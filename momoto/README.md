# Momoto

**Multimodal Perceptual Physics Engine — Color · Audio · Haptics**

Momoto models **perceptual physics** across three sensory domains. Every algorithm
is grounded in a published standard; every output is deterministic, energy-conserving,
and WASM-ready.

```
┌────────────────────────────────────────────────────────────────┐
│                    MomotoEngine  (v7.1.0)                      │
│  ┌──────────────┐   ┌──────────────┐   ┌─────────────────────┐ │
│  │  Color       │   │  Audio       │   │  Haptics            │ │
│  │  OKLCH · HCT │   │  LUFS · FFT  │   │  LRA · ERM · Piezo  │ │
│  │  APCA · CVD  │   │  Mel · EBU   │   │  Energy budget      │ │
│  │  Harmony     │   │  R128        │   │  Waveform gen       │ │
│  └──────────────┘   └──────────────┘   └─────────────────────┘ │
│  Energy invariant: output + absorbed + scattered = input        │
│  No dynamic dispatch · No heap in hot loops · No unsafe Rust    │
└────────────────────────────────────────────────────────────────┘
```

---

## Crates

| Crate | Dominio | Descripción | Tests |
|-------|---------|-------------|-------|
| [`momoto-core`](./crates/momoto-core) | Foundation | OKLCH · HCT · CAM16 · traits · zero deps | 290 |
| [`momoto-metrics`](./crates/momoto-metrics) | Color | WCAG 2.1 + APCA-W3 contrast | 14 |
| [`momoto-intelligence`](./crates/momoto-intelligence) | Color | Harmony (7 tipos) · CVD (Viénot 1999) · constraint solver | 18 |
| [`momoto-materials`](./crates/momoto-materials) | Color | Glass physics · GGX PBR · SSS · thin-film · shadows | 1 616 |
| [`momoto-audio`](./crates/momoto-audio) | Audio | ITU-R BS.1770-4 · EBU R128 · FFT radix-2 · Mel filterbank | 70 |
| [`momoto-haptics`](./crates/momoto-haptics) | Haptics | Weber's law · LRA/ERM/Piezo · energy budget · waveforms | 36 |
| [`momoto-engine`](./crates/momoto-engine) | Orchestration | MomotoEngine · DomainVariant · cross-domain normalization | 24 |
| [`momoto-events`](./crates/momoto-events) | Infrastructure | PubSub · EventBroadcaster · EventStream (RAII) | — |
| [`momoto-agent`](./crates/momoto-agent) | Orchestration | Workflow · session · visual generation · audit | — |
| [`momoto-wasm`](./crates/momoto-wasm) | WASM | Bindings JS/TS: 280+ exports color · 13 audio · haptics planned | — |

---

## Domain Overview

| Domain | Physical quantity | Standard | WASM exports |
|--------|------------------|----------|-------------|
| **Color** | Photon wavelength 380–780 nm | WCAG 2.1, APCA-W3, CIE, ITU-R | 280+ |
| **Audio** | Sound pressure 20 Hz–20 kHz | ITU-R BS.1770-4, EBU R128 | 13 |
| **Haptics** | Vibrotactile force (Hz, N, J) | IEEE 1451.4, Weber–Fechner | planned |

---

## Quick Start

### Instalación (Rust)

```toml
[dependencies]
momoto-core        = "7.1"
momoto-metrics     = "7.1"   # WCAG 2.1 + APCA contrast
momoto-intelligence = "7.1"  # Harmony, CVD, constraint solver
momoto-materials   = "7.1"   # Glass physics, PBR, thin-film
momoto-audio       = "7.1"   # LUFS, FFT, Mel, EBU R128
momoto-haptics     = "7.1"   # Energy budget, waveforms
momoto-engine      = "7.1"   # Cross-domain orchestrator
```

### Color (OKLCH + APCA + Harmony)

```rust
use momoto_core::color::Color;
use momoto_core::space::oklch::OKLCH;
use momoto_metrics::{APCAMetric, WCAGMetric};
use momoto_intelligence::{generate_palette, harmony_score, HarmonyType};

let fg = Color::from_hex("#FFFFFF").unwrap();
let bg = Color::from_hex("#3B82F6").unwrap();

// Contrast metrics
let wcag = WCAGMetric::new().evaluate(fg, bg).contrast;
let apca = APCAMetric::new().evaluate(fg, bg).contrast;
println!("WCAG: {:.2}:1  APCA Lc: {:.1}", wcag, apca);  // 3.06:1  55.2

// Color harmony
let seed = OKLCH::new(0.65, 0.18, 210.0);
let palette = generate_palette(seed, HarmonyType::Analogous { spread: 45.0 });
println!("Harmony score: {:.3}", harmony_score(&palette.colors)); // 0.0–1.0
```

### Audio (ITU-R BS.1770-4 / EBU R128)

```rust
use momoto_audio::AudioDomain;

let domain = AudioDomain::at_48khz();
let mut analyzer = domain.lufs_analyzer(1).unwrap();

let samples: Vec<f32> = /* your audio blocks */;
analyzer.add_mono_block(&samples);

println!("Integrated: {:.1} LUFS", analyzer.integrated());
println!("EBU R128 passes: {}", domain.validate_broadcast(analyzer.integrated()).passes);
```

### Haptics (Weber's law / Energy budget)

```rust
use momoto_haptics::{ActuatorModel, EnergyBudget, HapticWaveform, WaveformKind};
use momoto_haptics::mapping::FrequencyForceMapper;

let mut budget = EnergyBudget::with_recharge(0.050, 0.010); // 50 mJ LRA
budget.try_consume(0.005).expect("tap ok");
budget.tick(0.1); // 100 ms elapsed

let mapper = FrequencyForceMapper::new(ActuatorModel::Lra);
let spec = mapper.map(0.7, 100.0); // intensity=0.7, 100 ms
println!("{:.0} Hz  {:.4} N  {:.4} J", spec.freq_hz, spec.force_n, spec.energy_j());
```

### Engine (Cross-domain orchestration)

```rust
use momoto_engine::MomotoEngine;
use momoto_core::traits::domain::DomainId;

let engine = MomotoEngine::new();

let color_norm = engine.normalize_perceptual_energy(DomainId::Color, 0.72);
let alignment  = engine.perceptual_alignment(DomainId::Color, DomainId::Color, 0.72, 0.68);
let report     = engine.validate_system_energy();

println!("Alignment: {:.3}  Conserved: {}", alignment, report.system_conserved);
```

### WASM (JavaScript)

```javascript
import init, {
    wcagContrastRatio, wcagPasses,
    audioLufs, audioFftPowerSpectrum, audioValidateEbuR128,
} from 'momoto-wasm';

await init();

// Color
const ratio = wcagContrastRatio('#FFFFFF', '#3B82F6');
console.log(`WCAG: ${ratio.toFixed(2)}:1`);

// Audio
const samples = new Float32Array(48000); // 1 s sine
for (let i = 0; i < 48000; i++)
    samples[i] = Math.sin(2 * Math.PI * 1000 * i / 48000);

const lufs = audioLufs(samples, 48000, 1);
console.log(`Integrated: ${lufs.toFixed(2)} LUFS`);
```

---

## WASM Feature Flags

```bash
# Color only (<350 KB)
wasm-pack build --target web -- --no-default-features --features color

# Color + Audio (<500 KB)
wasm-pack build --target web -- --features audio

# Full multimodal (<550 KB)
wasm-pack build --target web -- --features multimodal
```

| Feature | Adds |
|---------|------|
| `color` | OKLCH, HCT, APCA, materials — always compiled |
| `audio` | LUFS, FFT, Mel, EBU R128 |
| `haptics` | Energy budget, waveforms |
| `multimodal` | audio + haptics |
| `panic_hook` | Browser panic messages |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                  momoto-wasm (WASM bindings)                     │
│  feature: color ──── feature: audio ──── feature: haptics        │
└────────┬────────────────────┬────────────────────┬───────────────┘
         │                    │                    │
   ┌─────▼──────┐     ┌───────▼─────┐     ┌───────▼─────┐
   │momoto-     │     │momoto-audio │     │momoto-      │
   │intelligence│     │(LUFS/FFT/   │     │haptics      │
   │materials   │     │Mel/EBU R128)│     │(energy/wave)│
   │metrics     │     └───────┬─────┘     └───────┬─────┘
   └─────┬──────┘             │                    │
         │                    └──────────┬──────────┘
         └───────────────────────────────┤
                                  ┌──────▼──────┐
                                  │momoto-engine│
                                  │(orchestrator│
                                  │enum dispatch│
                                  └──────┬──────┘
                                         │
                                  ┌──────▼──────┐
                                  │momoto-core  │
                                  │(OKLCH/traits│
                                  │ zero deps)  │
                                  └─────────────┘
```

**Dispatch sin vtable:** `DomainVariant` enum en lugar de `Box<dyn Domain>` — LLVM
inlinea todos los match arms, cero overhead de dynamic dispatch en hot paths.

---

## Energy Invariants

Todos los dominios satisfacen `output + absorbed + scattered = input` (± 1e-4):

| Domain | Energy model | Tolerance |
|--------|-------------|-----------|
| Color | Lossless optical (R + T = 1) | 1e-4 |
| Audio | K-weighting Parseval-conserving | 1e-4 |
| Haptics | `delivered + remaining = capacity` | 1e-12 |

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

## Project Status — v7.1.0

| Crate | Status | Unit tests | Doc tests | Total |
|-------|--------|-----------|-----------|-------|
| momoto-core | STABLE | 222 | 68 | **290** |
| momoto-metrics | STABLE | 7 | 7 | **14** |
| momoto-intelligence | STABLE | 18 | — | **18** |
| momoto-materials | STABLE | 1 556 | 60 | **1 616** |
| momoto-audio | STABLE | 70 | — | **70** |
| momoto-haptics | STABLE | 34 | 2 | **36** |
| momoto-engine | STABLE | 22 | 2 | **24** |
| momoto-events | STABLE | — | — | — |
| momoto-agent | BETA | — | — | — |
| momoto-wasm | STABLE | — | — | — |
| **Total** | | **2 029** | **139** | **2 068** |

---

## Design Principles

1. **Physics first** — Fresnel equations, K-weighting, Weber's law; no hacks
2. **Deterministic** — mismo input → mismo output en todas las plataformas
3. **Energy-conserving** — `output + absorbed + scattered = input` en runtime
4. **No unsafe Rust** — cero `unsafe` en todos los crates
5. **No dynamic dispatch en hot paths** — `DomainVariant` enum, no `Box<dyn Domain>`
6. **No heap en loops** — `Box<[f32]>` allocado una vez por call; inner loops zero-alloc
7. **Backend-agnostic** — WASM, native Rust, o Cargo dependency directo

---

## Documentation

| Documento | Propósito |
|-----------|-----------|
| [docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md) | Instalación, quick start por dominio, WASM |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, diagrama multimodal, enum dispatch |
| [PUBLIC_API_CATALOG.md](./PUBLIC_API_CATALOG.md) | Catálogo completo de API pública (todos los crates) |
| [SCIENTIFIC_VALIDATION.md](./SCIENTIFIC_VALIDATION.md) | Golden vectors, mapeo algoritmo↔estándar |
| [BENCHMARKS.md](./BENCHMARKS.md) | Números de performance por dominio |
| [docs/wasm_memory_layout.md](./docs/wasm_memory_layout.md) | Zero-copy buffer design para WASM |
| [CHANGELOG.md](./CHANGELOG.md) | Historial de versiones |

---

## Testing

```bash
# Todos los crates
cargo test --workspace

# Por dominio
cargo test --package momoto-audio
cargo test --package momoto-haptics
cargo test --package momoto-engine

# WASM
cd crates/momoto-wasm && wasm-pack test --headless --chrome

# Benchmarks
cargo bench --workspace
```

---

## Why Momoto

Los sistemas UI actuales tratan color, audio y haptics como capas independientes
sin base física, generando resultados inconsistentes y no reproducibles:

| Problema | Consecuencia |
|----------|-------------|
| Colores en sRGB únicamente | Sin HDR, wide gamut ni exactitud perceptual |
| Loudness de audio por intuición | No-cumplimiento EBU R128, UX inconsistente |
| Haptics por prueba y error | Daño al actuador, fallas de accesibilidad |
| Magic numbers por todos lados | No reproducible, no determinístico |

**Momoto separa la física del rendering y unifica los tres dominios sensoriales.**

---

## References

- [Oklab Color Space](https://bottosson.github.io/posts/oklab/) — Björn Ottosson
- [APCA Contrast Algorithm](https://github.com/Myndex/SAPC-APCA) — Myndex
- [ITU-R BS.1770-4](https://www.itu.int/rec/R-REC-BS.1770/) — LUFS loudness measurement
- [EBU R128](https://tech.ebu.ch/docs/r/r128.pdf) — Broadcast loudness standard
- [Weber's Law](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law) — Haptic perception model
- [Fresnel Equations](https://en.wikipedia.org/wiki/Fresnel_equations) — Optical physics
- [HCT Color Space](https://material.io/blog/science-of-color-design) — Google Material You

---

**Momoto** — Behavior over appearance. Physics over pixels.
