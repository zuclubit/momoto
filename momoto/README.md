# Momoto

**Multimodal Perceptual Physics Engine — Color · Audio · Haptics**

Momoto models **perceptual physics** across three sensory domains. Every algorithm
is grounded in a published standard; every output is deterministic, energy-conserving,
and WASM-ready.

```
┌────────────────────────────────────────────────────────────────┐
│                 MomotoEngine  (v7.1.0)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │  Color       │  │  Audio       │  │  Haptics             │ │
│  │  OKLCH · HCT │  │  LUFS · FFT  │  │  LRA · ERM · Piezo   │ │
│  │  APCA · CVD  │  │  Mel · EBU   │  │  Energy budget       │ │
│  │  Harmony     │  │  R128        │  │  Waveform gen        │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│  Energy invariant: output + absorbed + scattered = input       │
│  No dynamic dispatch · No heap in hot loops · No unsafe Rust   │
└────────────────────────────────────────────────────────────────┘
```

---

## Domain Comparison

| Domain | Physical quantity | Standard | WASM exports |
|--------|------------------|----------|-------------|
| **Color** | Photon wavelength (380–780 nm) | WCAG 2.1, APCA-W3, CIE | 180+ |
| **Audio** | Sound pressure (20 Hz–20 kHz) | ITU-R BS.1770-4, EBU R128 | 13 |
| **Haptics** | Vibrotactile force (Hz, N) | IEEE 1451.4, Weber's law | planned |

---

## Energy Invariants

All three domains satisfy `output + absorbed + scattered = input` (± tolerance):

| Domain | Energy model | Absorption |
|--------|-------------|------------|
| Color | Lossless optical (R+T=1) | 0 in base model |
| Audio | K-weighting is Parseval-conserving | 0 |
| Haptics | budget: delivered + remaining = capacity | 0 |

---

## Feature Flags

```toml
# Minimal — color domain only (<350 KB WASM)
momoto-wasm = { features = ["color"] }

# Default — color + audio (<500 KB WASM)
momoto-wasm = { features = ["color", "audio"] }

# Full multimodal (<550 KB WASM)
momoto-wasm = { features = ["multimodal"] }
```

---

## Why Momoto Exists

Current UI systems conflate **physics** with **rendering** and ignore non-visual senses:

| Problem | Consequence |
|---------|-------------|
| Colors in sRGB only | No HDR, wide gamut, or perceptual accuracy |
| Audio loudness by feel | EBU R128 non-compliance, inconsistent UX |
| Haptics by trial and error | Actuator damage, accessibility failures |
| Magic numbers everywhere | Non-reproducible, non-deterministic |

**Momoto separates physics from rendering and unifies all three sensory domains.**

---

## Design Principles

1. **Physics first** — Fresnel equations, K-weighting, Weber's law, not hacks
2. **Deterministic** — Same input → same output across all platforms
3. **Energy-conserving** — `R + T + A + S = 1` enforced at runtime
4. **No unsafe Rust** — Zero unsafe throughout all crates
5. **No dynamic dispatch in hot paths** — `DomainVariant` enum, not `Box<dyn Domain>`
6. **No heap in loops** — `Box<[f32]>` allocated once per call; inner loops are zero-alloc
7. **Backend-agnostic** — WASM, native Rust, or direct Cargo dependency

See [`SCIENTIFIC_VALIDATION.md`](./SCIENTIFIC_VALIDATION.md) for algorithm-to-standard mappings.

---

## Quick Start

### Rust (Core Library)

```rust
use momoto_core::{
    material::GlassMaterial,
    evaluated::{Evaluable, MaterialContext},
    backend::CssBackend,
    render::{RenderBackend, RenderContext},
};

// 1. Define material with physical parameters
let glass = GlassMaterial {
    ior: 1.5,                          // Index of refraction
    roughness: 0.6,                    // 0.0 = mirror, 1.0 = frosted
    thickness: 8.0,                    // Millimeters
    noise_scale: 0.4,                  // Frosting intensity
    base_color: OKLCH::new(0.95, 0.01, 240.0), // Slight blue tint
    edge_power: 2.0,                   // Fresnel edge sharpness
};

// 2. Evaluate physics (Fresnel, Beer-Lambert, scattering)
let context = MaterialContext::default();
let evaluated = glass.evaluate(&context);

// Physics-based properties (backend-agnostic)
println!("Scattering: {}mm", evaluated.scattering_radius_mm);
println!("Fresnel F0: {}", evaluated.fresnel_f0);
println!("Opacity: {}", evaluated.opacity);

// 3. Render to target backend
let backend = CssBackend::new();
let css = backend.render(&evaluated, &RenderContext::desktop())?;

// Result: backdrop-filter: blur(23px); background: oklch(0.85 0.02 240 / 0.65);
```

### WebAssembly (JavaScript/TypeScript)

```javascript
import init, {
    GlassMaterial,
    EvalMaterialContext,
    RenderContext,
    CssBackend,
    evaluateAndRenderCss
} from './momoto_wasm';

await init();

// Simple API (one call)
const glass = GlassMaterial.frosted();
const css = evaluateAndRenderCss(
    glass,
    EvalMaterialContext.new(),
    RenderContext.desktop()
);

// Advanced API (inspect physics)
const evaluated = glass.evaluate(EvalMaterialContext.new());
console.log(`Scattering: ${evaluated.scatteringRadiusMm}mm`);
console.log(`Fresnel: ${evaluated.fresnelF0}`);

const backend = new CssBackend();
const css = backend.render(evaluated, RenderContext.desktop());
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Application Layer (React, Vue, Solid, Native)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│  Momoto Engine (Evaluation, Batch, Cache)                   │
│  - MaterialContext (lighting, viewing angle, background)    │
│  - Batch evaluation for 1000+ materials                     │
│  - LUT-based fast paths (Fresnel, Beer-Lambert)             │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│  Momoto Materials (Glass, Liquid, Acrylic, Metal)           │
│  - GlassMaterial::evaluate() → EvaluatedMaterial            │
│  - Pure functions: no side effects, deterministic           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│  Momoto Core (Physics, Math, Color Science)                 │
│  - Fresnel equations (Schlick approximation)                │
│  - Beer-Lambert absorption                                  │
│  - OKLCH / OKLab color spaces                               │
│  - No external dependencies                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        │             │             │             │
┌───────▼──────┐ ┌────▼──────┐ ┌───▼──────┐ ┌────▼─────┐
│ CSS Backend  │ │ WebGPU    │ │  Print   │ │  Native  │
│ (String)     │ │ (Commands)│ │  (PDF)   │ │ (Skia)   │
└──────────────┘ └───────────┘ └──────────┘ └──────────┘
```

**Key Insight:** `EvaluatedMaterial` contains only physical properties (scattering radius in mm, absorption coefficients, Fresnel reflectance). Backends convert these to rendering units (CSS pixels, WebGPU kernel sizes, PDF points).

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed diagrams.

---

## Core Concepts

### Materials are Functions

Materials are **deterministic transformations** of physical parameters into optical properties:

```rust
Material = f(IOR, roughness, thickness, color, ...)
EvaluatedMaterial = Material::evaluate(context: MaterialContext)
```

**Not this:**
```rust
// ❌ Side effects, platform-dependent
let glass = Glass::new();
glass.set_blur(20);  // What unit? Pixels? Points?
let css = glass.to_css();  // Locks us into CSS
```

**This:**
```rust
// ✅ Pure function, backend-agnostic
let glass = GlassMaterial { ior: 1.5, roughness: 0.6, ... };
let evaluated = glass.evaluate(&context);  // Physics
let css = CssBackend.render(&evaluated, &render_ctx);  // Rendering
let webgpu = WebGpuBackend.render(&evaluated, &render_ctx);  // Same physics!
```

### Physical Units

All properties in `EvaluatedMaterial` use **physical units**:

| Property | Unit | Example | Backend Conversion |
|----------|------|---------|-------------------|
| `scattering_radius_mm` | Millimeters | 6.2mm | CSS: × 3.78 = 23px (96 DPI) |
| `absorption` | mm⁻¹ | [0.1, 0.1, 0.1] | RGB attenuation |
| `fresnel_f0` | Dimensionless | 0.04 | Reflectance at 0° |
| `thickness_mm` | Millimeters | 8.0mm | Beer-Lambert path length |

**Why mm?** Universal, device-independent, works for print/vector/AR natively.

### Context-Dependent Evaluation

Same material behaves differently based on **physical context**:

```rust
let glass = GlassMaterial::regular();

// Outdoor (bright, direct light)
let outdoor = MaterialContext {
    background: OKLCH::new(0.98, 0.01, 100.0),
    viewing_angle_deg: 0.0,
    ambient_light: 0.9,
    key_light: 0.8,
    ..Default::default()
};

// Studio (neutral, soft light)
let studio = MaterialContext::default();

let eval_outdoor = glass.evaluate(&outdoor);
let eval_studio = glass.evaluate(&studio);

// Same glass, different optical properties based on physics
assert_ne!(eval_outdoor.opacity, eval_studio.opacity);
```

See [docs/CONCEPTS.md](./docs/CONCEPTS.md) for deep dive.

---

## Performance

Momoto is designed for **batch processing** and **real-time performance**:

```rust
// Evaluate 1000 materials in parallel
let materials: Vec<GlassMaterial> = /* ... */;
let contexts: Vec<MaterialContext> = /* ... */;

let evaluated: Vec<EvaluatedMaterial> = materials
    .par_iter()
    .zip(contexts.par_iter())
    .map(|(mat, ctx)| mat.evaluate(ctx))
    .collect();

// Render batch to CSS (1 allocation)
let backend = CssBackend::new();
let css_strings = backend.render_batch(&evaluated, &RenderContext::desktop())?;
```

**Benchmarks (Apple M2 Pro):**
- Single evaluation: ~200ns
- Batch 1000 materials: ~180µs (1.8× faster than naive loop)
- LUT-accelerated Fresnel: 5× faster than direct calculation

See [docs/PERFORMANCE.md](./docs/PERFORMANCE.md) for tuning guide.

---

## Examples

### 1. Frosted Glass Panel

```rust
let glass = GlassMaterial::frosted();
let context = MaterialContext::default();
let evaluated = glass.evaluate(&context);

let css = CssBackend::new().render(&evaluated, &RenderContext::desktop())?;
// backdrop-filter: blur(23px); background: oklch(0.80 0.02 220 / 0.68);
```

### 2. Context-Aware Material

```rust
let glass = GlassMaterial::regular();

// Light background → darker glass
let light_bg = MaterialContext::with_background(OKLCH::new(0.95, 0.01, 100.0));
let eval_light = glass.evaluate(&light_bg);

// Dark background → lighter glass
let dark_bg = MaterialContext::with_background(OKLCH::new(0.15, 0.02, 240.0));
let eval_dark = glass.evaluate(&dark_bg);

// Opacity adapts to ensure visibility
assert!(eval_light.opacity > eval_dark.opacity);
```

### 3. Multi-Backend Rendering

```rust
let glass = GlassMaterial::frosted();
let evaluated = glass.evaluate(&MaterialContext::default());

// Same physics, different outputs
let css = CssBackend::new().render(&evaluated, &RenderContext::desktop())?;
let webgpu = WebGpuBackend::new().render(&evaluated, &RenderContext::desktop())?;

// Future: Print backend renders to PDF natively in mm
// let pdf = PrintBackend::new().render(&evaluated, &RenderContext::print_300dpi())?;
```

---

## Migration from v5.x to v6.0

**Breaking Changes in v6.0.0:**

| Removed | Replacement |
|---------|-------------|
| `blur_amount()` | `scattering_radius_mm()` |
| `has_blur()` | `has_scattering()` |

**Migration:**
```rust
// v5.x (removed)
let blur_px = glass.blur_amount();

// v6.0
let scatter_mm = glass.scattering_radius_mm();
let blur_px = scatter_mm * (96.0 / 25.4); // Convert to pixels
```

See [docs/MIGRATION.md](./docs/MIGRATION.md) for complete migration guide.

---

## Testing

```bash
# Core library tests
cargo test --workspace --all-features

# WASM tests
cd crates/momoto-wasm && wasm-pack test --headless --chrome

# Benchmarks
cargo bench --workspace

# Lint
cargo clippy --workspace --all-features
```

---

## Project Status

**Version 6.0.0** - Production Ready

| Component | Status | Tests |
|-----------|--------|-------|
| momoto-core | STABLE | 100+ |
| momoto-metrics | STABLE | 43 |
| momoto-intelligence | STABLE | 15 |
| momoto-materials | STABLE | 1,511 |
| momoto-wasm | STABLE | N/A |

See [API_STABILITY.md](./API_STABILITY.md) for detailed stability levels.

See [ROADMAP.md](./ROADMAP.md) for detailed plan.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design, crate structure, data flow |
| [CONCEPTS.md](./docs/CONCEPTS.md) | Core concepts (Materials, Context, Evaluation) |
| [MIGRATION.md](./docs/MIGRATION.md) | Upgrading from blur_px to scattering_radius_mm |
| [PERFORMANCE.md](./docs/PERFORMANCE.md) | Tuning, benchmarks, optimization guide |
| [MANIFESTO.md](./docs/architecture/manifesto-alignment-post-corrections.md) | Design philosophy and principles |

---

## Contributing

Contributions must maintain manifesto alignment:
- Physics first (no visual hacks without documentation)
- Backend-agnostic (no CSS/rendering concepts in core)
- Deterministic (reproducible results)
- Performance-aware (batch APIs, SIMD-friendly)

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT © 2026 Momoto Contributors

---

## References

- [Oklab Color Space](https://bottosson.github.io/posts/oklab/) - Björn Ottosson
- [APCA Contrast Algorithm](https://github.com/Myndex/SAPC-APCA) - Myndex
- [Fresnel Equations](https://en.wikipedia.org/wiki/Fresnel_equations) - Physics foundation
- [Beer-Lambert Law](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law) - Absorption model

---

**Momoto** — Behavior over appearance. Physics over pixels.
