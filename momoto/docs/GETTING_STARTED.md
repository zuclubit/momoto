# Getting Started with Momoto v7.1.0

Momoto is a **Multimodal Perceptual Physics Engine** — a scientifically-grounded
Rust library (and WASM package) for Color, Audio, and Haptics domains.

---

## Installation

### Option A: Full multimodal (recommended)

```toml
[dependencies]
momoto-core        = "7.1"
momoto-metrics     = "7.1"       # WCAG 2.1 + APCA-W3 contrast
momoto-intelligence = "7.1"      # Color recommendations, harmony, CVD
momoto-materials   = "7.1"       # Glass physics, PBR, thin-film
momoto-audio       = "7.1"       # LUFS, FFT, Mel, EBU R128
momoto-haptics     = "7.1"       # Energy budget, waveform generation
momoto-engine      = "7.1"       # Cross-domain orchestrator
```

### Option B: Color-only (smallest footprint)

```toml
[dependencies]
momoto-core    = "7.1"
momoto-metrics = "7.1"
```

### WASM (JavaScript/TypeScript)

```bash
# Full build (color + audio + panic hook)
wasm-pack build --target web

# Minimal (color only)
wasm-pack build --target web -- --no-default-features --features color

# Complete multimodal
wasm-pack build --target web -- --features multimodal
```

**Feature flags for `momoto-wasm`:**

| Feature | Description | Adds |
|---------|-------------|------|
| `color` | OKLCH, HCT, APCA, materials | always compiled |
| `audio` | LUFS, FFT, Mel, EBU R128 | `momoto-audio` |
| `haptics` | Energy budget, waveforms | `momoto-haptics` |
| `multimodal` | All three domains | `audio + haptics` |
| `panic_hook` | Browser panic messages | `console_error_panic_hook` |

---

## Domain Quick Start

### Color Domain

```rust
use momoto_core::color::Color;
use momoto_core::space::oklch::OKLCH;

// Create colors
let blue = Color::from_srgb8(59, 130, 246);
let red  = Color::from_hex("#EF4444").unwrap();

// Convert to OKLCH (perceptually uniform)
let oklch = blue.to_oklch();
println!("L={:.2} C={:.2} H={:.2}°", oklch.l, oklch.c, oklch.h);

// Interpolate perceptually
let mid = OKLCH::interpolate(&blue.to_oklch(), &red.to_oklch(), 0.5);
```

### Accessibility Metrics (WCAG 2.1 + APCA)

```rust
use momoto_metrics::{APCAMetric, WCAGMetric};
use momoto_core::color::Color;

let fg = Color::from_hex("#FFFFFF").unwrap();
let bg = Color::from_hex("#3B82F6").unwrap();

// WCAG 2.1 contrast ratio
let wcag = WCAGMetric::new();
let ratio = wcag.evaluate(fg, bg).contrast;
println!("WCAG ratio: {:.2}:1", ratio);          // 3.06:1

// APCA (perceptual contrast)
let apca = APCAMetric::new();
let lc = apca.evaluate(fg, bg).contrast;
println!("APCA Lc: {:.1}", lc);                  // e.g. 55.2
```

### Color Intelligence

```rust
use momoto_intelligence::{
    RecommendationEngine, RecommendationContext, UsageContext, ComplianceTarget,
    HarmonyType, generate_palette, harmony_score,
};
use momoto_core::{Color, OKLCH};

// Recommend foreground for a dark background
let bg = Color::from_hex("#1E3A5F").unwrap();
let engine = RecommendationEngine::new();
let ctx = RecommendationContext::new(UsageContext::BodyText, ComplianceTarget::WCAG_AA);
let rec = engine.recommend_foreground(bg, ctx);
println!("Recommended: {:?}  confidence: {:.0}%", rec.color.to_srgb8(), rec.confidence * 100.0);

// Harmony engine
let seed = OKLCH::new(0.65, 0.18, 210.0);
let palette = generate_palette(seed, HarmonyType::Analogous { spread: 45.0 });
let score = harmony_score(&palette.colors);
println!("Harmony score: {:.3}", score);          // 0.0–1.0
```

### Audio Domain (ITU-R BS.1770-4)

```rust
use momoto_audio::{AudioDomain, FftPlan};

let domain = AudioDomain::at_48khz();

// LUFS measurement
let mut analyzer = domain.lufs_analyzer(1).unwrap(); // mono
let samples: Vec<f32> = /* your audio */;
analyzer.add_mono_block(&samples);

println!("Momentary:  {:.1} LUFS", analyzer.momentary());
println!("Short-term: {:.1} LUFS", analyzer.short_term());
println!("Integrated: {:.1} LUFS", analyzer.integrated());

// EBU R128 compliance
let report = domain.validate_broadcast(analyzer.integrated());
println!("EBU R128 passes: {}", report.passes);

// FFT power spectrum
let plan = FftPlan::new(2048);
let mut buf = vec![0.0f32; 4096]; // interleaved re/im
buf.iter_mut().zip(samples.iter()).for_each(|(b, &s)| *b = s);
plan.fft(&mut buf);
```

### Haptics Domain (Weber's Law)

```rust
use momoto_haptics::{
    ActuatorModel, EnergyBudget, HapticWaveform, WaveformKind,
};
use momoto_haptics::mapping::FrequencyForceMapper;

// Energy budget — 50 mJ LRA with recharge
let mut budget = EnergyBudget::with_recharge(0.050, 0.010);

// Consume energy for a UI tap
budget.try_consume(0.005).expect("tap ok");

// Recharge over 100 ms
budget.tick(0.1);

// Frequency-force mapping
let mapper = FrequencyForceMapper::new(ActuatorModel::Lra);
let spec = mapper.map(0.7, 80.0 /* ms */);
println!("{:.0} Hz, {:.4} N, {:.4} J", spec.freq_hz, spec.force_n, spec.energy_j());

// Generate waveform
let wave = HapticWaveform::generate(WaveformKind::Buzz, 200.0, 50.0, 0.8, 8_000);
println!("Samples: {}", wave.samples.len());
```

### Multimodal Engine Orchestration

```rust
use momoto_engine::MomotoEngine;
use momoto_core::traits::domain::DomainId;

let engine = MomotoEngine::new();

// Cross-domain perceptual normalization
let color_norm = engine.normalize_perceptual_energy(DomainId::Color, 0.72);  // → 0.72
let audio_norm = ((-23.0_f32 + 70.0) / 70.0).clamp(0.0, 1.0);               // → 0.671

// Perceptual alignment (Color ↔ Color in base engine)
let alignment = engine.perceptual_alignment(DomainId::Color, DomainId::Color, 0.72, 0.68);
println!("Alignment: {:.3}", alignment);  // → 0.960

// System energy conservation
let report = engine.validate_system_energy();
println!("System conserved: {}", report.system_conserved);
println!("Worst efficiency: {:.4}", report.worst_efficiency);
```

---

## WASM Usage

### JavaScript

```javascript
import init, {
    audioLufs, audioFftPowerSpectrum, audioMelSpectrum,
    audioValidateEbuR128,
} from 'momoto-wasm';

await init();

// 1 kHz sine, 1 second, 48 kHz
const sr = 48000;
const samples = new Float32Array(sr);
for (let i = 0; i < sr; i++) {
    samples[i] = Math.sin(2 * Math.PI * 1000 * i / sr);
}

// LUFS measurement
const lufs = audioLufs(samples, sr, 1);
console.log(`Integrated LUFS: ${lufs.toFixed(2)}`);

// EBU R128 compliance
const compliance = audioValidateEbuR128(lufs);
console.log(`EBU R128: ${compliance}`);   // JSON string

// FFT power spectrum
const fft = audioFftPowerSpectrum(samples, 2048);
console.log(`FFT bins: ${fft.length}`);

// Mel filterbank
const mel = audioMelSpectrum(samples, sr, 40);
console.log(`Mel bands: ${mel.length}`);
```

### TypeScript (Color)

```typescript
import init, { wcagContrastRatio, wcagPasses } from 'momoto-wasm';

await init();

const ratio: number = wcagContrastRatio('#FFFFFF', '#3B82F6');
console.log(`WCAG: ${ratio.toFixed(2)}:1`);

const passes: boolean = wcagPasses('#FFFFFF', '#3B82F6', 'AA', false);
console.log(`AA passes: ${passes}`);
```

---

## Runnable Examples

```bash
cd momoto

# Color + materials
cargo run --example 01_liquid_glass_benchmark
cargo run --example 02_context_aware_material
cargo run --example 03_batch_vs_single
cargo run --example 04_backend_swap

# Audio — LUFS, EBU R128, FFT, Mel, spectral
cargo run --example 05_audio_lufs --package momoto-audio

# Haptics — energy budget, Weber mapping, waveforms
cargo run --example 06_haptics_feedback --package momoto-haptics

# Engine — cross-domain orchestration, alignment, energy report
cargo run --example 07_multimodal_engine --package momoto-engine
```

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                     momoto-wasm (WASM bindings)                  │
│  feature: color ──── feature: audio ──── feature: haptics        │
└────────┬────────────────────┬────────────────────┬───────────────┘
         │                    │                    │
   ┌─────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
   │momoto-     │     │momoto-      │     │momoto-      │
   │intelligence│     │audio        │     │haptics      │
   │materials   │     │(LUFS/FFT)   │     │(energy/wave)│
   │metrics     │     └──────┬──────┘     └──────┬──────┘
   └─────┬──────┘            │                    │
         │                   └─────────┬──────────┘
         └──────────────────────────── │
                                ┌──────▼──────┐
                                │momoto-engine│
                                │(orchestrator│
                                │enum dispatch│
                                └──────┬──────┘
                                       │
                                ┌──────▼──────┐
                                │momoto-core  │
                                │(OKLCH/traits│
                                │/zero deps)  │
                                └─────────────┘
```

---

## Next Steps

- [Architecture](./ARCHITECTURE.md) — full system design with multimodal diagram
- [API Catalog](../PUBLIC_API_CATALOG.md) — every public API across all crates
- [WASM Memory Layout](./wasm_memory_layout.md) — zero-copy buffer design
- [Scientific Validation](../SCIENTIFIC_VALIDATION.md) — golden vectors and standards
- [Benchmarks](../BENCHMARKS.md) — performance numbers

## Support

- GitHub: https://github.com/zuclubit/momoto
- Issues: https://github.com/zuclubit/momoto/issues
