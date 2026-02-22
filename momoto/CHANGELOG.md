# Changelog

All notable changes to the Momoto perceptual color system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [7.0.0] - 2026-02-21

### 🎨 Complete Chromatic Intelligence Suite — 12 Systems

This release completes the full perceptual pipeline: color appearance modeling,
color harmony generation, CVD accessibility simulation, physically-based BRDFs,
spectral material-to-color bridging, and constraint-based palette optimization.
All 12 planned systems are implemented, tested against golden vectors, and
exposed via the WASM API.

### Added

#### HCT / CAM16 Color Space (`momoto-core`)
- **`space::hct`** — Complete HCT (Hue-Chroma-Tone) implementation matching
  Google Material Design 3 specification
  - `HCT::from_color()` / `HCT::to_color()` — forward and inverse conversion
  - Binary-search tone solver guarantees `|T_out − T_in| < 2 L*` (roundtrip)
  - `HCT::clamp_to_gamut()` — 50-iter binary search on CAM16 chroma
  - `HCT::from_argb()` / `HCT::to_argb()` — ARGB integer pack/unpack
- **`space::hct::cam16`** — Full CAM16 Color Appearance Model (Li et al. 2017)
  - `CAM16::from_xyz()` — forward model with correct z = 1.48 + 0.29√n
  - `CAM16::to_xyz_from_jch()` — inverse with Hunt offset correction (p2+0.305)
  - `ViewingConditions::s_rgb()` — matches material-color-utilities defaults
  - `lstar_from_y()` / `y_from_lstar()` — CIELAB utilities
- **WASM** (`momoto-wasm/src/hct.rs`):
  - `new HCT(hue, chroma, tone)`, `HCT.fromHex()`, `HCT.fromArgb()`
  - `hexToHct()`, `hctToHex()`, `hctToOklch()`, `oklchToHct()`
  - `hctTonalPalette(hue, chroma)` — 13 standard tones
  - `hctMaxChroma(hue, tone)` — gamut boundary query

#### Color Harmony Engine (`momoto-intelligence`)
- **`harmony`** module — 7 harmony types based on Itten (1961) + OKLCH geometry
  - `Complementary` (+180°), `SplitComplementary` (+150°/+210°)
  - `Triadic` (+120°/+240°), `Tetradic` (+90°/+180°/+270°)
  - `Analogous { spread }`, `Monochromatic { steps }`, `Temperature { warm }`
  - `generate_palette()` — gamut-safe palette generation
  - `harmony_score()` — hue coherence × chroma balance × lightness spread
  - `shades()` — 10-step shade scale (L 0.95→0.15, chroma reduced at extremes)
- **WASM** (`intelligence.rs`): `generatePalette()`, `harmonyScore()`,
  `generateShades()`, `WasmHarmonyType` enum

#### CVD Simulation (`momoto-core`)
- **`color::cvd`** — Viénot 1999 dichromat simulation in linear sRGB
  - `CVDType` enum: `Protanopia`, `Deuteranopia`, `Tritanopia`
  - `simulate_cvd()` — row-stochastic matrices preserving D65 white exactly
  - `cvd_delta_e()` — OKLCH-space ΔE between original and simulated
  - `suggest_cvd_safe_alternative()` — binary search for contrast-safe hue
  - `simulate_cvd_hex()` / `parse_hex()` — hex string utilities
- **WASM**: `simulateCVD(hex, type)`, `cvdDeltaE(hex, type)`

#### GGX Microfacet BRDF (`momoto-materials`)
- **`glass_physics::microfacet`** — physically-based surface model
  - `ggx_ndf()` — GGX Normal Distribution Function (Walter et al. 2007)
  - `smith_g1()` / `smith_g2()` — height-correlated Smith masking-shadowing
  - `cook_torrance()` — full (D·F·G)/(4·n·v·n·l) specular BRDF
  - `oren_nayar()` — rough diffuse BRDF (Oren & Nayar 1994)
  - `ggx_anisotropic_ndf()` — anisotropic GGX (Burley 2012)
  - Energy conservation validated via Monte Carlo hemisphere integration
- **WASM**: `cookTorranceBRDF()`, `orenNayarBRDF()`

#### Constraint Solver (`momoto-intelligence`)
- **`constraints`** module — penalty-method constraint satisfaction
  - `ConstraintKind`: `MinContrast`, `MinAPCA`, `HarmonyAngle`, `InGamut`,
    `LightnessRange`, `ChromaRange`
  - `ConstraintSolver::solve()` — finite-difference gradient descent with
    backtracking line search in OKLCH space
  - Convergence: penalty < 1e-4, max 500 iterations
  - Uses live `WCAGMetric` / `APCAMetric` for contrast evaluation
- **WASM**: `solveColorConstraints(lch_flat, constraints_json, max_iterations)`

#### Material → Color Bridge (`momoto-agent`)
- **`material_bridge`** — spectral BSDF-to-color pipeline
  - 31-band CIE 1931 2° CMF integration (400–700 nm, 10 nm steps)
  - D65 illuminant SPD for standard daylight evaluation
  - Cauchy dispersion: n(λ) = n₀ + 0.004/λ² for realistic IOR variation
  - McCamy (1992) CCT approximation from CIE xy chromaticity
  - Returns `MaterialColorResult { dominant: OKLCH, reflectance, transmittance, cct }`
- **WASM**: `materialToDominantColor(ior, roughness, cos_theta)`
  → `[L, C, H, reflectance, cct]`

#### Batch WASM APIs
- `evaluateDielectricBatch(iors, roughnesses, cos_thetas)` — vectorized BSDF
  evaluation, returns flat `[R, T, A] × N`
- `evaluateDielectricBSDF(ior, roughness, cos_theta)` — single-item variant
- Temporal Material bindings (`TemporalDielectric`, `TemporalThinFilm`)
- Procedural Noise bindings (`ProceduralNoise`, `variationField()`)

### Fixed

#### CAM16 Mathematical Bugs
- **z formula**: `z = 1.48 + sqrt(50000/13 · Nc · Ncb)` was wrong (gave z ≈ 28);
  corrected to `z = 1.48 + 0.29 · √n` (z ≈ 1.6) per Li et al. 2017
- **Inverse offset**: Recovery of `(Ra, Ga, Ba)` from CAM16 inverse required
  `p2 + 0.305` (Hunt model offset) — missing offset caused 14% XYZ error
- **HCT tone roundtrip**: Binary search over J now guarantees target Y matches
  `y_from_lstar(tone)`, fixing `|ΔL*| > 4` on high-chroma colors

#### CVD White Invariance
- Replaced Brettel 1997 LMS matrices (calibrated for E-white, not D65) with
  Viénot 1999 D65-adapted matrices; white now preserved exactly for all 3 types

#### WASM Duplicate Function
- `evaluateMaterialBatch` was defined twice with different signatures;
  new DielectricBSDF-based variant renamed to `evaluateDielectricBatch`

### Changed

- Version bumped 6.0.0 → 7.0.0
- `momoto-intelligence`: Added `harmony` and `constraints` re-exports to `lib.rs`
- `momoto-core`: Enabled `pub mod hct` in `space/mod.rs`, `pub mod cvd` in
  `color/mod.rs`
- `momoto-agent`: Added `pub mod material_bridge`
- `momoto-wasm`: Added `mod hct`, `mod temporal`, `mod procedural` to `lib.rs`
- Cleanup: Removed stale APCA investigation debug documents

## [6.0.0] - 2026-02-01

### 🚀 Production Release: World-Ready Infrastructure

This release marks Momoto as **production-ready for worldwide adoption**. All APIs have been audited, documented, and stability-classified.

### Breaking Changes

#### Removed APIs (Deprecated in v5.0.0)

| Removed | Replacement | Migration |
|---------|-------------|-----------|
| `blur_amount()` | `scattering_radius_mm()` | `scatter_mm * (dpi / 25.4)` |
| `has_blur()` | `has_scattering()` | Direct replacement |
| `blurAmount()` (WASM) | `scatteringRadiusMm()` | See TypeScript migration |

### Added

#### Documentation
- **API Stability Guide** (`API_STABILITY.md`): Complete stability matrix for 350+ APIs
- **Getting Started Guide** (`docs/GETTING_STARTED.md`): Quick start for new users
- **Release Baseline** (`RELEASE_BASELINE_V6.md`): Frozen baseline specification
- **Release Readiness Report** (`RELEASE_READINESS_REPORT.md`): Final verification

#### API Stability Classification
- **Tier 1 (STABLE)**: Core color, materials, metrics - production ready
- **Tier 2 (STABLE)**: BSDF, thin-film, metals, dispersion - production ready
- **Tier 3 (BETA)**: Digital twins, differentiable, calibration - feature complete
- **Tier 4 (EXPERIMENTAL)**: Metrology, certification, instruments - research grade

#### Test Coverage
- **1,897 unit tests** across all crates
- **64 doc-tests** with examples
- **Zero compiler warnings** after remediation

### Changed

- **Version bump**: 5.0.0 → 6.0.0
- **WASM property rename**: `blur` → `scatteringMm` in material export
- **Test migration**: Updated all tests to use new APIs

### Fixed

- **Example compilation**: Fixed WebGPU example Display trait issue
- **Dead code warnings**: Silenced in experimental modules with `#[allow(dead_code)]`

### Removed

- `GlassMaterial::blur_amount()` - Use `scattering_radius_mm()`
- `EvaluatedMaterial::has_blur()` - Use `has_scattering()`
- `GlassMaterial.blurAmount()` (WASM) - Use `scatteringRadiusMm()`

### Migration Guide

```rust
// v5.x (removed in v6.0)
let blur_px = glass.blur_amount();
if material.has_blur() { ... }

// v6.0
let blur_px = glass.scattering_radius_mm() * (96.0 / 25.4);
if material.has_scattering() { ... }
```

```javascript
// v5.x (removed in v6.0)
const blurPx = glass.blurAmount();

// v6.0
const scatterMm = glass.scatteringRadiusMm();
const blurPx = scatterMm * (devicePixelRatio * 96 / 25.4);
```

---

## [5.0.0] - 2026-01-09

### 🎉 Major Release: Rust as Canonical Core

This release establishes **Rust as the canonical implementation** for Momoto's perceptual color system, replacing the previous TypeScript implementation with a physics-based, type-safe foundation.

### Added

#### Core System
- **Physics-based material system** with `GlassMaterial` as the canonical liquid glass implementation
- **Perceptual color spaces**: OKLCH, Linear RGB, sRGB with full conversion support
- **Material evaluation pipeline**: `Material → MaterialContext → EvaluatedMaterial → CSS`
- **Backend abstraction**: Pluggable rendering with `CssBackend` and `WebGpuBackend` (stub)
- **Physical units throughout**: millimeters for scattering, absorption coefficients, thickness

#### Material Properties
- **Fresnel equations**: Accurate glass reflectance based on IOR and viewing angle
- **Beer-Lambert absorption**: Wavelength-dependent light transmission
- **Perlin noise**: Procedural texture generation for natural glass variation
- **Context-aware adaptation**: Materials respond to background color and lighting

#### Testing Infrastructure
- **192+ comprehensive tests** across all crates
- **Property-based testing** with proptest (9 invariant tests)
- **Edge case coverage**: Extreme values, black glass, high roughness
- **Physics regression tests**: Fresnel F0, Beer-Lambert, scattering monotonicity
- **Cross-backend consistency tests**: Same material renders consistently

#### Performance
- **Benchmark suite** with Criterion.rs
- **Single evaluation**: ~7.4 ns (WCAG), ~54 ns (APCA)
- **Batch evaluation**: 135 ns/10 materials, 635 ns/100 materials
- **Zero-cost abstractions**: Pure Rust with no runtime overhead

#### Documentation
- **Architecture guide** (`ARCHITECTURE.md`): System design and data flow
- **Concepts guide** (`CONCEPTS.md`): Physics principles and color theory
- **Migration guide** (`MIGRATION.md`): TypeScript to Rust transition
- **4 canonical demos**: Liquid glass, context adaptation, performance, backend swap
- **Inline documentation**: 100% public API coverage

#### Developer Experience
- **Clippy-clean**: Zero warnings with `-D warnings`
- **Rustfmt**: Consistent code formatting across workspace
- **IDE integration**: Full LSP support with rust-analyzer
- **Examples**: 4 runnable demos showcasing core features

### Changed

#### Breaking Changes
- **`blur_px` → `scattering_radius_mm`**: Physical units replace pixel-based blur
- **EvaluatedMaterial structure**: New fields for physical properties (fresnel, absorption)
- **Material evaluation**: Now requires `MaterialContext` instead of standalone evaluation
- **Backend API**: `render()` signature changed to accept `EvaluatedMaterial` + `RenderContext`

#### Improvements
- **Type safety**: Strong typing eliminates entire classes of runtime errors
- **Performance**: 4-8% improvement in core metrics vs previous TypeScript implementation
- **Modularity**: Clean separation between core, metrics, materials, and backends
- **Testability**: Pure functions enable comprehensive property-based testing

### Fixed
- **Numerical stability**: Clamping prevents NaN/Infinity in edge cases
- **Color space conversions**: Accurate OKLCH ↔ Linear RGB transformations
- **Fresnel edge cases**: Correct behavior at grazing angles (cos θ → 0)
- **Absorption coefficients**: Always non-negative per physics

### Deprecated
- **TypeScript implementation**: Marked for removal in 6.0.0 (Rust is now canonical)
- **`blur_amount()` method**: Use `scattering_radius_mm` instead
- **`blur_px` field**: Convert to physical units in rendering backend

### Removed
- **JavaScript/TypeScript core**: Replaced by Rust implementation
- **Legacy color spaces**: Removed non-standard color models
- **Deprecated APIs**: Cleaned up technical debt from 4.x series

## [4.x] - Previous Releases

See legacy changelog in `docs/legacy/CHANGELOG-4.x.md` for pre-5.0 history.

---

## Release Philosophy

Momoto follows these principles:

1. **Physics over aesthetics**: Grounded in real-world material science
2. **Type safety**: Leverage Rust's type system to prevent errors at compile time
3. **Zero dependencies**: Core remains dependency-free for maximum portability
4. **Performance**: Sub-microsecond evaluations enable real-time applications
5. **Testability**: Pure functions with comprehensive property-based tests

## Upgrade Guide

See `MIGRATION.md` for detailed upgrade instructions from 4.x to 5.0.

## Contributing

See `CONTRIBUTING.md` for development setup and guidelines.

## License

MIT License - see `LICENSE` file for details.
