# Momoto

> **Multimodal Perceptual Physics Engine — Color · Audio · Haptics**
> Compiled to WebAssembly. Grounded in published standards. Deterministic on all platforms.

[![Engine](https://img.shields.io/badge/Engine-v7.1.0-6c63ff.svg)](https://zuclubit.github.io/momoto/)
[![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
[![WASM](https://img.shields.io/badge/WASM-ready-blue.svg)](https://webassembly.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-GitHub%20Pages-7c3aed.svg)](https://zuclubit.github.io/momoto/)
[![API](https://img.shields.io/badge/API-momoto.json-0ea5e9.svg)](https://zuclubit.github.io/momoto/momoto.json)
[![LLMs](https://img.shields.io/badge/LLM%20Context-llms.txt-10b981.svg)](https://zuclubit.github.io/momoto/llms.txt)

---

## Live Documentation

| Resource | URL |
|----------|-----|
| **Interactive API Explorer** | [zuclubit.github.io/momoto](https://zuclubit.github.io/momoto/) |
| **JSON API Spec** | [momoto.json](https://zuclubit.github.io/momoto/momoto.json) |
| **LLM Context** | [llms.txt](https://zuclubit.github.io/momoto/llms.txt) |
| **MCP Server** | [`docs/mcp/`](docs/mcp/README.md) — stdio context server for AI assistants |
| **WASM Package** | [`momoto/crates/momoto-wasm/`](momoto/crates/momoto-wasm/README.md) |

---

## What is Momoto?

Momoto is a **Rust library (v7.1.0) compiled to WebAssembly** that models perceptual physics
across three sensory domains. Every algorithm is grounded in a published standard;
every output is deterministic, energy-conserving, and allocation-free in hot paths.

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

| Domain | Physical quantity | Standard | WASM exports |
|--------|------------------|----------|-------------|
| **Color** | Photon wavelength 380–780 nm | WCAG 2.1, APCA-W3, CIE | 280+ |
| **Audio** | Sound pressure 20 Hz–20 kHz | ITU-R BS.1770-4, EBU R128 | 13 |
| **Haptics** | Vibrotactile force (Hz, N, J) | IEEE 1451.4, Weber–Fechner | planned |

---

## Crates

| Crate | Dominio | Tests |
|-------|---------|-------|
| [`momoto-core`](momoto/crates/momoto-core) | OKLCH · HCT · CAM16 · traits · zero deps | 290 |
| [`momoto-metrics`](momoto/crates/momoto-metrics) | WCAG 2.1 + APCA-W3 contrast | 50 |
| [`momoto-intelligence`](momoto/crates/momoto-intelligence) | Harmony (7 tipos) · CVD (Viénot 1999) · constraint solver | 18 |
| [`momoto-materials`](momoto/crates/momoto-materials) | Glass · GGX PBR · SSS · thin-film · shadows | 1 616 |
| [`momoto-audio`](momoto/crates/momoto-audio) | ITU-R BS.1770-4 · EBU R128 · FFT radix-2 · Mel filterbank | 70 |
| [`momoto-haptics`](momoto/crates/momoto-haptics) | Weber's law · LRA/ERM/Piezo · energy budget · waveforms | 36 |
| [`momoto-engine`](momoto/crates/momoto-engine) | MomotoEngine · DomainVariant · cross-domain normalization | 24 |
| [`momoto-events`](momoto/crates/momoto-events) | PubSub · EventBroadcaster · EventStream (RAII) | — |
| [`momoto-agent`](momoto/crates/momoto-agent) | Workflow · session · visual generation · audit | — |
| [`momoto-wasm`](momoto/crates/momoto-wasm) | WASM bindings JS/TS | — |
| **Total** | | **2 104** |

---

## Repository Structure

```
momoto/                             ← Rust engine workspace (v7.1.0)
├── Cargo.toml                      ← Workspace root
└── crates/
    ├── momoto-core/                ← Color spaces, OKLCH, traits, zero deps
    ├── momoto-metrics/             ← WCAG 2.1 + APCA-W3 v0.1.9
    ├── momoto-intelligence/        ← Harmony, CVD, constraint solver
    ├── momoto-materials/           ← PBR physics, thin film, Mie, TMM, shadows
    ├── momoto-audio/               ← LUFS, K-weighting, FFT, Mel, EBU R128
    ├── momoto-haptics/             ← Energy budget, LRA/ERM/Piezo, waveforms
    ├── momoto-engine/              ← Cross-domain orchestrator, DomainVariant
    ├── momoto-agent/               ← JSON workflow engine
    ├── momoto-events/              ← Pub/sub + SSE streaming
    └── momoto-wasm/                ← WASM bindings (wasm-pack)

docs/
├── website/index.html              ← Interactive API explorer (GitHub Pages)
├── api/momoto.json                 ← Machine-readable API spec
├── api/llms.txt                    ← LLM context document
└── mcp/                            ← MCP stdio server

src/                                ← TypeScript design system (hexagonal architecture)
├── domain/                         ← Color entities, ports, value objects
├── application/                    ← Use cases, recommendation pipeline
├── adapters/                       ← React, CSS, Tailwind adapters
└── infrastructure/                 ← WASM bridge, exporters, audit

packages/
├── momoto-ui-wasm/                 ← @momoto-ui/wasm (built from momoto-wasm crate)
└── momoto-ui-crystal/              ← @momoto-ui/crystal (React components)
```

---

## Getting Started

### Rust

```toml
[dependencies]
momoto-core        = "7.1"
momoto-metrics     = "7.1"    # WCAG 2.1 + APCA contrast
momoto-intelligence = "7.1"   # Harmony, CVD, constraint solver
momoto-materials   = "7.1"    # Glass physics, PBR, thin-film
momoto-audio       = "7.1"    # LUFS, FFT, Mel, EBU R128
momoto-haptics     = "7.1"    # Energy budget, waveforms
momoto-engine      = "7.1"    # Cross-domain orchestrator
```

### WASM / npm

```bash
npm install momoto-wasm
```

```bash
git clone https://github.com/zuclubit/momoto.git
cd momoto
cargo test --workspace       # 2 104 tests
wasm-pack build --target web -- --features multimodal
```

---

## Quick Start

### Color (OKLCH + APCA)

```javascript
import init, { wcagContrastRatio, wcagPasses, apcaContrast } from 'momoto-wasm';

await init();

const ratio = wcagContrastRatio('#FFFFFF', '#3B82F6');
const apca  = apcaContrast('#FFFFFF', '#3B82F6');

console.log(`WCAG: ${ratio.toFixed(2)}:1`);   // 3.06:1
console.log(`APCA: ${apca.toFixed(1)} Lc`);   // 55.2
console.log(`AA:   ${wcagPasses(ratio, 0, false)}`); // false
```

### Audio (ITU-R BS.1770-4 / EBU R128)

```javascript
import init, { audioLufs, audioFftPowerSpectrum, audioValidateEbuR128 } from 'momoto-wasm';

await init();

// 1 kHz sine, 1 second, 48 kHz
const sr = 48000;
const samples = new Float32Array(sr);
for (let i = 0; i < sr; i++)
    samples[i] = Math.sin(2 * Math.PI * 1000 * i / sr);

const lufs = audioLufs(samples, sr, 1);
console.log(`Integrated: ${lufs.toFixed(2)} LUFS`);

const compliance = JSON.parse(audioValidateEbuR128(lufs));
console.log(`EBU R128 passes: ${compliance.passes}`);

const fft = audioFftPowerSpectrum(samples, 2048);
console.log(`FFT bins: ${fft.length}`);  // 1025
```

### Haptics (Weber's law / Energy budget — Rust)

```rust
use momoto_haptics::{ActuatorModel, EnergyBudget, HapticWaveform, WaveformKind};
use momoto_haptics::mapping::FrequencyForceMapper;

// 50 mJ LRA with passive recharge
let mut budget = EnergyBudget::with_recharge(0.050, 0.010);
budget.try_consume(0.005).expect("tap ok");
budget.tick(0.1); // 100 ms elapsed

let mapper = FrequencyForceMapper::new(ActuatorModel::Lra);
let spec = mapper.map(0.7, 100.0); // intensity=0.7, duration=100 ms
println!("{:.0} Hz  {:.4} N  {:.4} J", spec.freq_hz, spec.force_n, spec.energy_j());

let wave = HapticWaveform::generate(WaveformKind::Buzz, 200.0, 50.0, 0.8, 8_000);
println!("Samples: {}", wave.samples.len());
```

### Cross-Domain Engine (Rust)

```rust
use momoto_engine::MomotoEngine;
use momoto_core::traits::domain::DomainId;

let engine = MomotoEngine::new();

// Normalize perceptual energy across domains
let color_norm = engine.normalize_perceptual_energy(DomainId::Color, 0.72);
// Audio: (lufs + 70) / 70 → [0, 1]
let audio_norm = engine.normalize_perceptual_energy(DomainId::Audio, -23.0);

let alignment = engine.perceptual_alignment(DomainId::Color, DomainId::Color, 0.72, 0.68);
println!("Alignment: {:.3}", alignment);  // 0.960

let report = engine.validate_system_energy();
println!("System conserved: {}", report.system_conserved);
```

### HCT / Material Design 3 (WASM)

```javascript
import init, { hexToHct, hctTonalPalette, hctToHex } from 'momoto-wasm';

await init();

const [hue, chroma, tone] = hexToHct('#3a7bd5'); // [264.5, 41.2, 50.0]
const palette = hctTonalPalette(hue, chroma);    // 39 values (13 × [h,c,t])
const tone80  = hctToHex(palette[0], palette[1], 80); // "#a8c5f8"
```

### Glass Physics (WASM)

```javascript
import init, { ThinFilm, TransferMatrixFilm } from 'momoto-wasm';

await init();

// Soap bubble iridescence (Airy formula)
const bubble = ThinFilm.soapBubbleMedium();
const css = bubble.toCssSoapBubble(80); // CSS conic-gradient

// Morpho butterfly (9-layer TMM stack)
const morpho = TransferMatrixFilm.morphoButterfly();
console.log(morpho.toCssStructuralColor(0));   // 0° — deep blue
console.log(morpho.toCssStructuralColor(45));  // 45° — cyan shift
```

### Color Harmony & CVD (WASM)

```javascript
import init, { generatePalette, harmonyScore, simulateCVD } from 'momoto-wasm';

await init();

// 7 types: complementary, triadic, analogous, split_complementary,
//          tetradic, square, monochromatic
const triad = generatePalette('#3a7bd5', 'triadic', 3);

// CVD simulation (Viénot 1999, D65 white preserved)
const deuteranope = simulateCVD('#3a7bd5', 'deuteranopia');
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

## Engine Overview — WASM Modules

| Module | Description | Exports |
|--------|-------------|---------|
| **HCT** | Google Material Design 3 (CAM16 + CIELAB). Tonal palettes, gamut-safe conversions. | 12 |
| **Core** | sRGB ↔ OKLCH ↔ OKLab. WCAG 2.1 + APCA-W3 v0.1.9. Batch luminance. | 40+ |
| **Intelligence** | AI recommendations, 7 harmony types, CVD simulation (Viénot 1999), constraint solver. | 30+ |
| **Materials** | Sprint 1–4 PBR: thin film (12), dispersion (7+5), metals (12), Mie (9+8), TMM (9), SpectralPipeline. | 120+ |
| **Temporal** | Time-evolving physics: drying paint, soap bubbles, heated metals. R+T+A=1. | 15+ |
| **Procedural** | Perlin fBm noise, IOR variation fields, roughness maps. Deterministic seed. | 8+ |
| **SIREN** | Neural network [9→16→16→3], 483 params, ω₀=30. Perceptual color correction. | 5 |
| **Events** | MomotoEventBus pub/sub + MomotoEventStream SSE-compatible. | 20+ |
| **Agent** | High-level JSON interface: validate, recommend, improve, material queries, workflows. | 20+ |
| **Audio** | audioLufs, audioFftPowerSpectrum, audioMelSpectrum, audioValidateEbuR128, spectral. | 13 |

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

**Dispatch sin vtable:** `DomainVariant` enum en lugar de `Box<dyn Domain>` —
LLVM inlinea todos los match arms, cero overhead de dynamic dispatch en hot paths.

---

## Module Reference

### Audio: ITU-R BS.1770-4 / EBU R128

```javascript
// LUFS measurement (mono or stereo)
const lufs = audioLufs(samples, sampleRate, channels);
const momentary  = audioMomentaryLufs(samples, sampleRate);

// EBU R128 broadcast compliance (−23 LUFS ±1)
const report = JSON.parse(audioValidateEbuR128(lufs));
// → { passes: bool, standard: "EBU R128", violations: [] }

// FFT power spectrum (radix-2 Cooley-Tukey)
const power = audioFftPowerSpectrum(samples, 2048); // N/2+1 bins

// Mel filterbank (HTK scale)
const mel = audioMelSpectrum(samples, sampleRate, 40); // 40 mel bands

// Spectral features
const centroid  = audioSpectralCentroid(power, sampleRate);   // Hz
const brightness = audioSpectralBrightness(power, sampleRate, 2000); // 0–1
const flux      = audioSpectralFlux(prevPower, power);
const rolloff   = audioSpectralRolloff(power, sampleRate, 0.85);
const flatness  = audioSpectralFlatness(power);
```

### HCT Color Space

```javascript
hexToHct(hex) → Float64Array [hue, chroma, tone]
hctToHex(hue, chroma, tone) → string
hctTonalPalette(hue, chroma) → Float64Array  // 39 values: 13 × [h,c,t]
hctMaxChroma(hue, tone) → number
hctToOklch(hue, chroma, tone) → Float64Array [L,C,H]
oklchToHct(l, c, h) → Float64Array [hue,chroma,tone]

HCT.fromHex(hex), HCT.fromArgb(argb)
hct.withTone(t), hct.withChroma(c), hct.withHue(h)
hct.toArgb(), hct.clampToGamut()
```

### Core: Color & Luminance

```javascript
Color.fromHex(hex), Color.fromRgb(r,g,b)
wcagContrastRatio(fg, bg) → number
wcagPasses(ratio, level, isLargeText) → boolean  // level: 0=AA, 1=AAA
wcagLevel(ratio, isLargeText) → "AAA"|"AA"|"AA-Large"|"fail"
apcaContrast(fg, bg) → number                    // Lc; body≥75, heading≥60
relativeLuminanceSrgb(color) → number
relativeLuminanceBatch(colors: Uint8Array) → Float64Array
wcagContrastRatioBatch(pairs: Uint8Array) → Float64Array
hexToOklch(hex) → Float64Array [L,C,H]
oklchToHex(l,c,h) → string
```

### Intelligence: Harmony, CVD, Constraints

```javascript
// Harmony (7 types)
generatePalette(hex, type, count) → string[]
// types: complementary|triadic|analogous|split_complementary|tetradic|square|monochromatic
generateShades(hex, count) → string[]
harmonyScore(lchFlat: Float64Array) → number [0,1]

// CVD (Viénot 1999, D65 preserved — NOT Brettel 1997)
simulateCVD(hex, "protanopia"|"deuteranopia"|"tritanopia") → string
cvdDeltaE(hex, cvdType) → number  // <20=mild, 20-60=moderate, >60=severe

// Constraint solver (penalty method, 500 iter, 1e-4 convergence)
solveColorConstraints(lchFlat, constraintsJson, maxIterations)
// → { colors, converged, iterations, finalPenalty, violations }
```

### Materials: Physics (Sprint 1–4)

**Sprint 1 — Thin-Film Optics**
```javascript
// 12 presets: soapBubbleThin/Medium/Thick, oilThin/Medium/Thick,
//             arCoating, oxideThin/Medium/Thick, beetleShell, nacre
ThinFilm.soapBubbleMedium()
film.reflectanceRgb(nSubstrate, cosTheta) → Float64Array [r,g,b]
film.toCssSoapBubble(sizePercent) → CSS conic-gradient
film.toCssOilSlick() → CSS gradient
```

**Sprint 2 — Chromatic Dispersion & Metals**
```javascript
CauchyDispersion.bk7()       // 7 glass presets
ComplexIOR.gold()             // 12 metal presets
SpectralComplexIOR.gold()    // wavelength-resolved
DrudeParams.aluminum()        // temperature-dependent
```

**Sprint 3 — Mie Scattering**
```javascript
// 9 static + 8 dynamic presets
DynamicMieParams.condensingFog().scatteringColorAtTime(t, λNm) → [r,g,b]
rayleighIntensityRgb(cosTheta) → Float64Array [r,g,b]
```

**Sprint 4 — Multilayer Transfer Matrix**
```javascript
// 9 presets: braggMirror, arBroadband, morphoButterfly, beetleShell, nacre…
TransferMatrixFilm.morphoButterfly()
film.toCssStructuralColor(angleDeg) → CSS
```

**SpectralPipeline**
```javascript
new SpectralPipeline()
  .addThinFilm(film).addMieScattering(params).addGold()
  .evaluate(SpectralSignal.d65Illuminant(), new EvaluationContext().withAngle(30))
  .verifyEnergyConservation() → { passes, maxViolation }
```

### Temporal Materials

```javascript
TemporalMaterial.dryingPaint().evalAtTime(t, cosTheta) → [R,T,A]
TemporalThinFilmMaterial.soapBubble().sampleTimeline(durationS, frames, cosTheta)
TemporalConductorMaterial.heatedGold().evalAtTemperature(K, cosTheta)
// All guarantee R + T + A = 1.0
```

### SIREN Neural Network

```javascript
// Architecture: [9,16,16,3], 483 params, ω₀=30, Mulberry32 seed=421337
computeSirenCorrection(bgL,bgC,bgH, fgL,fgC,fgH, apcaLc,wcagRatio,quality)
  → { deltaL, deltaC, deltaH }
applySirenCorrection(l,c,h, deltaL,deltaC,deltaH) → Float64Array [L,C,H]
```

### Agent API

```javascript
// Validation & recommendations
agentValidatePair(fg, bg, standard, level) → JSON
agentRecommendForeground(bgHex, context, target) → JSON
agentScorePair(fgHex, bgHex, context, target) → JSON

// Contracts
const contract = new ContractBuilder()
  .minContrastWcagAA('#07070e').lightnessRange(0.4, 0.9).inSrgb().build();
agentValidate(colorHex, contractJson) → JSON { passes, violations }

// Workflows
executeWorkflow(workflowJson) → JSON
// type: "brand_palette"|"accessibility_audit"|"theme_generation"
getMomotoIdentity() → JSON { version:"7.1.0", buildId, specVersion }
selfCertify() → JSON { passed, tests, timestamp }
```

### Events & Streaming

```javascript
const bus = new MomotoEventBus();
bus.subscribe(cb)
bus.emitProgress('engine', 50, 'Computing palette…')
bus.emitMetric('wcag', 'ratio', 4.5)

const stream = MomotoEventStream.fromBus(bus);
stream.poll() → { events, sequence, totalEvents, droppedEvents } | null
stream.pause(), stream.resume(), stream.close()
```

---

## Physics Constants

| Constant | Value |
|----------|-------|
| WCAG AA (normal text) | 4.5:1 |
| WCAG AAA (normal text) | 7.0:1 |
| WCAG AA (large text) | 3.0:1 |
| APCA body text | Lc ≥ 75 |
| APCA heading | Lc ≥ 60 |
| EBU R128 integrated | −23.0 LUFS ±1 |
| EBU R128 LRA | ≤ 18 LU |
| ITU-R BS.1770-4 gate | −70 LUFS absolute |
| LRA resonance (Lra) | ~150–200 Hz |
| SIREN architecture | [9, 16, 16, 3], 483 params, ω₀=30 |
| Constraint solver | penalty method, max_iter=500, convergence=1e-4 |
| CAM16 z formula | z = 1.48 + 0.29 × √n |

---

## Design Principles

1. **Physics first** — Fresnel, K-weighting, Weber's law; no magic numbers
2. **Deterministic** — same input → same output across all platforms (IEEE 754 f32)
3. **Energy-conserving** — `output + absorbed + scattered = input` enforced at runtime
4. **No unsafe Rust** — zero `unsafe` in all crates
5. **No dynamic dispatch in hot paths** — `DomainVariant` enum, not `Box<dyn Domain>`
6. **No heap in loops** — `Box<[f32]>` allocated once per call; inner loops zero-alloc
7. **f32 throughout** — WASM compatibility and SIMD alignment

---

## Testing

```bash
cd momoto

# Full suite
cargo test --workspace          # 2 104 tests, 0 failures

# Per domain
cargo test --package momoto-audio    # 70 tests
cargo test --package momoto-haptics  # 36 tests
cargo test --package momoto-engine   # 24 tests
cargo test --package momoto-core     # 290 tests
cargo test --package momoto-materials # 1 616 tests

# Examples
cargo run --example 05_audio_lufs --package momoto-audio
cargo run --example 06_haptics_feedback --package momoto-haptics
cargo run --example 07_multimodal_engine --package momoto-engine
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [momoto/docs/GETTING_STARTED.md](momoto/docs/GETTING_STARTED.md) | Instalación, quick start por dominio, WASM |
| [momoto/docs/ARCHITECTURE.md](momoto/docs/ARCHITECTURE.md) | System design, multimodal diagram, enum dispatch |
| [momoto/PUBLIC_API_CATALOG.md](momoto/PUBLIC_API_CATALOG.md) | API completa de todos los crates |
| [momoto/SCIENTIFIC_VALIDATION.md](momoto/SCIENTIFIC_VALIDATION.md) | Golden vectors, algoritmo↔estándar |
| [momoto/BENCHMARKS.md](momoto/BENCHMARKS.md) | Performance por dominio |
| [Interactive API Explorer](https://zuclubit.github.io/momoto/) | Live search — 188 documented entries |
| [docs/mcp/](docs/mcp/README.md) | MCP stdio server para AI assistants |

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
- [Weber–Fechner Law](https://en.wikipedia.org/wiki/Weber%E2%80%93Fechner_law) — Haptic perception
- [Fresnel Equations](https://en.wikipedia.org/wiki/Fresnel_equations) — Optical physics
- [HCT Color Space](https://material.io/blog/science-of-color-design) — Google Material You
- [Viénot 1999](https://www.sciencedirect.com/science/article/pii/S0042698999000423) — CVD simulation matrices

---

> Physics over pixels. Behavior over appearance.

MIT © 2026 Zuclubit
