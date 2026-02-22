# Momoto Architecture

**Version:** 5.0.0
**Status:** Phase 4 Complete
**Last Updated:** 2026-01-09

---

## Overview

Momoto is a **physics-based material rendering system** that separates optical physics from backend rendering. Materials are pure functions that evaluate to physical properties, which backends convert to rendering commands.

**Core Pipeline:**

```
Material (IOR, roughness, thickness)
    ↓ evaluate(MaterialContext)
EvaluatedMaterial (scattering_radius_mm, fresnel_f0, absorption)
    ↓ render(Backend, RenderContext)
CSS | WebGPU | Print | Native
```

**Key Insight:** `EvaluatedMaterial` contains **only physical properties** with **physical units** (millimeters, coefficients). No rendering concepts (pixels, CSS, GPU) exist at this layer.

---

## Design Philosophy

### Why Momoto Exists

Current UI rendering libraries conflate physics with rendering:

| Problem | Consequence |
|---------|-------------|
| Blur measured in pixels | Cannot render to print, vector, or AR/VR |
| Colors in sRGB only | No HDR, wide gamut, or perceptual accuracy |
| Effects hardcoded for CSS | Cannot leverage WebGPU, Native, or Offline |
| Magic numbers everywhere | Non-reproducible, non-deterministic |

**Momoto's Separation:**

```
┌─────────────────────────────────────┐
│   Materials (Physics)               │  Pure functions
│   - GlassMaterial { ior, roughness }│  No side effects
│   - LiquidMaterial { viscosity }    │  Deterministic
└───────────┬─────────────────────────┘
            │ evaluate(MaterialContext)
            ↓
┌─────────────────────────────────────┐
│   EvaluatedMaterial                 │  Backend-agnostic
│   - scattering_radius_mm: 6.2       │  Physical units only
│   - fresnel_f0: 0.04                │  No rendering concepts
│   - absorption: [0.1, 0.1, 0.1]     │
└───────────┬─────────────────────────┘
            │ render(Backend, RenderContext)
            ↓
      ┌─────┴─────┬──────────┬──────────┐
      ↓           ↓          ↓          ↓
   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
   │ CSS  │   │WebGPU│   │Print │   │Native│
   │ 23px │   │Kernel│   │6.2mm │   │ Skia │
   └──────┘   └──────┘   └──────┘   └──────┘
```

### Why NOT a CSS Library

**Momoto is NOT:**
- ❌ A CSS generator (CSS is one backend among many)
- ❌ A visual effects library (effects are physics consequences)
- ❌ A styling framework (materials are optical models)

**Momoto IS:**
- ✅ A physics engine that renders to multiple targets
- ✅ A deterministic material evaluation system
- ✅ A backend-agnostic optical property calculator

**Evidence:**

```rust
// ❌ CSS Library Approach
let glass = Glass::new();
glass.set_blur(20);  // Pixels? Which DPI? Which backend?
let css = glass.to_css();  // Locked into CSS

// ✅ Momoto Approach
let glass = GlassMaterial { ior: 1.5, roughness: 0.6, thickness: 8.0 };
let evaluated = glass.evaluate(&context);  // Physics: 6.2mm scattering
let css = CssBackend.render(&evaluated, &ctx);  // CSS: 23px
let print = PrintBackend.render(&evaluated, &ctx);  // Print: 6.2mm
let webgpu = WebGpuBackend.render(&evaluated, &ctx);  // GPU: kernel config
```

**Same physics, different rendering.**

---

## Crate Structure

### Dependency Graph

```
┌────────────────────────────────────────────────────────┐
│  Application Layer (React, Vue, Solid, Native)         │
└─────────────────────┬──────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │momoto-  │ │momoto-  │ │momoto-  │
    │wasm     │ │engine   │ │intelli- │
    │         │ │         │ │gence    │
    └────┬────┘ └────┬────┘ └────┬────┘
         │           │           │
         └───────────┼───────────┘
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │momoto-  │ │momoto-  │ │momoto-  │
    │core     │ │metrics  │ │materials│
    └─────────┘ └─────────┘ └─────────┘
```

**Dependency Rules:**
- **Core** has zero external dependencies (pure Rust)
- **Metrics** depends only on Core
- **Materials** depends only on Core
- **Engine** coordinates Core + Metrics + Materials
- **WASM** exposes Engine to JavaScript

---

### momoto-core

**Purpose:** Canonical physics foundation — color science, material evaluation, backend abstraction.

**Modules:**

| Module | Responsibility | Physical Basis |
|--------|----------------|----------------|
| `color` | Color representations (RGB, linear) | sRGB color space |
| `space` | Color space transforms (OKLCH, OKLab) | Oklab perceptual uniformity |
| `luminance` | Luminance calculations | CIE Y, gamma correction |
| `perception` | Perceptual primitives | Human visual system |
| `math` | Numerical utilities | IEEE 754 determinism |
| `material` | Material definitions (Glass, Liquid) | Fresnel, Beer-Lambert |
| `evaluated` | Evaluated material with physical properties | Scattering theory |
| `backend` | Backend abstraction (CSS, WebGPU, Print) | Unit conversions |
| `render` | Render traits and contexts | DPI, color space, viewport |

**Key Types:**

```rust
// Material (input)
pub struct GlassMaterial {
    pub ior: f64,              // Index of refraction (1.5 for glass)
    pub roughness: f64,        // 0.0 = mirror, 1.0 = frosted
    pub thickness: f64,        // Millimeters
    pub base_color: OKLCH,     // Base tint color
    // ...
}

// Evaluated Material (physics output)
pub struct EvaluatedMaterial {
    pub scattering_radius_mm: f64,  // Physical scattering in mm
    pub fresnel_f0: f64,            // Reflectance at 0° (0.04 for glass)
    pub opacity: f64,               // Transmission (0.0-1.0)
    pub color: LinearRgba,          // Linear RGB (no gamma)
    pub absorption: [f64; 3],       // RGB absorption coefficients (mm⁻¹)
    // ...
}
```

**Design Constraints:**
- ✅ Zero external dependencies
- ✅ Deterministic floating-point operations
- ✅ No platform-specific code
- ✅ `#![no_std]` ready (future)

**See:** [ADR-004: Physical Units in EvaluatedMaterial](./architecture/ADR-004-physical-units-in-evaluated-material.md)

---

### momoto-metrics

**Purpose:** Perceptual contrast metrics — WCAG, APCA, custom algorithms.

**Modules:**

| Module | Algorithm | Standard |
|--------|-----------|----------|
| `wcag` | WCAG 2.1 contrast ratio | W3C WCAG 2.1 |
| `apca` | APCA perceptual contrast | W3C APCA (draft) |
| `sapc` | SAPC (precursor to APCA) | Research |

**Usage:**

```rust
use momoto_metrics::apca::apca_contrast;

let bg = OKLCH::new(0.95, 0.01, 100.0);
let fg = OKLCH::new(0.20, 0.05, 240.0);
let contrast = apca_contrast(fg, bg);  // Lc 90 (high readability)
```

---

### momoto-materials

**Purpose:** Predefined material library — Glass, Liquid, Metal, Acrylic.

**Current Materials:**

| Material | Parameters | Physics Model |
|----------|------------|---------------|
| `GlassMaterial` | IOR, roughness, thickness | Fresnel + Beer-Lambert |
| `LiquidMaterial` | Viscosity, surface tension (planned) | Navier-Stokes (planned) |
| `MetalMaterial` | Conductivity, roughness (planned) | Fresnel (metal) |

**Future:** User-defined materials via trait `Evaluable`.

---

### momoto-engine

**Purpose:** High-performance batch evaluation, caching, LUT acceleration.

**Features:**

| Feature | Performance | Use Case |
|---------|-------------|----------|
| Batch evaluation | 1000 materials in 180µs | UI component libraries |
| LUT-based Fresnel | 5× faster than direct | Real-time preview |
| SIMD-ready layout | Memory aligned for AVX2 | Future optimization |
| Material caching | O(1) lookup | Repeated evaluations |

**Usage:**

```rust
use momoto_engine::batch::BatchEvaluator;

let materials: Vec<GlassMaterial> = /* ... */;
let contexts: Vec<MaterialContext> = /* ... */;

let evaluator = BatchEvaluator::new();
let evaluated = evaluator.evaluate_batch(&materials, &contexts);
// ~180ns per material (Apple M2 Pro)
```

**See:** [PERFORMANCE.md](./PERFORMANCE.md)

---

### momoto-intelligence

**Purpose:** AI-assisted material generation, accessibility auditing, design suggestions.

**Status:** Planned for Phase 6.

**Planned Features:**
- Material recommendations based on brand colors
- Accessibility auditing (WCAG compliance)
- Automatic contrast adjustments
- Design system generation

---

### momoto-wasm

**Purpose:** WebAssembly bindings for JavaScript/TypeScript.

**Exports:**

```typescript
// Material construction
export class GlassMaterial {
  static regular(): GlassMaterial;
  static frosted(): GlassMaterial;
  evaluate(context: MaterialContext): EvaluatedMaterial;
}

// Evaluation context
export class MaterialContext {
  static new(): MaterialContext;
  withBackground(color: OKLCH): MaterialContext;
}

// Rendering
export class CssBackend {
  render(material: EvaluatedMaterial, context: RenderContext): string;
}

// Convenience API
export function evaluateAndRenderCss(
  material: GlassMaterial,
  evalCtx: MaterialContext,
  renderCtx: RenderContext
): string;
```

**Build:**

```bash
cd crates/momoto-wasm
wasm-pack build --target web
# Output: pkg/momoto_wasm.js, pkg/momoto_wasm_bg.wasm
```

**Bundle Size:** ~42KB gzipped (includes all physics)

---

## Core Pipeline Details

### 1. Material Definition

**Materials are immutable data structures** describing physical properties:

```rust
let glass = GlassMaterial {
    ior: 1.5,                          // Glass index of refraction
    roughness: 0.6,                    // 60% frosted
    thickness: 8.0,                    // 8mm thick
    noise_scale: 0.4,                  // Frosting intensity
    base_color: OKLCH::new(0.95, 0.01, 240.0),  // Slight blue tint
    edge_power: 2.0,                   // Fresnel edge sharpness
};
```

**No methods, no state, no side effects.** Just data.

---

### 2. Evaluation (Physics)

**Evaluation transforms materials into physical properties** via physics equations:

```rust
impl Evaluable for GlassMaterial {
    fn evaluate(&self, context: &MaterialContext) -> EvaluatedMaterial {
        // 1. Fresnel reflectance (Schlick approximation)
        let f0 = ((1.0 - self.ior) / (1.0 + self.ior)).powi(2);
        let fresnel = f0 + (1.0 - f0) * (1.0 - cos_theta).powi(5);

        // 2. Beer-Lambert transmission
        let absorption = 0.1;  // mm⁻¹
        let transmission = (-absorption * self.thickness).exp();

        // 3. Scattering radius (physical model)
        let surface_scattering = self.roughness * 10.0;  // 0-10mm
        let volume_scattering = (self.thickness * 0.1).min(2.0);  // Beer-Lambert
        let scattering_radius_mm = surface_scattering + volume_scattering;

        EvaluatedMaterial {
            scattering_radius_mm,
            fresnel_f0: f0,
            opacity: 1.0 - transmission,
            color: self.base_color.to_linear_rgba(),
            absorption: [absorption, absorption, absorption],
            // ...
        }
    }
}
```

**Physical Basis:**

| Property | Equation | Reference |
|----------|----------|-----------|
| Fresnel F0 | `((n1-n2)/(n1+n2))²` | [Fresnel Equations](https://en.wikipedia.org/wiki/Fresnel_equations) |
| Transmission | `exp(-α·d)` | [Beer-Lambert Law](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law) |
| Scattering | `r·10 + min(d·0.1, 2)` | Empirical (frosted glass) |

**Context-Dependent:**

```rust
let glass = GlassMaterial::regular();

// Bright background → darker glass (higher opacity)
let bright_bg = MaterialContext::with_background(OKLCH::new(0.95, 0.01, 100.0));
let eval_bright = glass.evaluate(&bright_bg);

// Dark background → lighter glass (lower opacity)
let dark_bg = MaterialContext::with_background(OKLCH::new(0.15, 0.02, 240.0));
let eval_dark = glass.evaluate(&dark_bg);

assert!(eval_bright.opacity > eval_dark.opacity);  // Adapts to context
```

---

### 3. Rendering (Backend-Specific)

**Backends convert physical properties to rendering commands:**

#### CSS Backend

```rust
impl RenderBackend for CssBackend {
    fn render(&self, material: &EvaluatedMaterial, context: &RenderContext)
        -> Result<String, RenderError>
    {
        // Convert mm → px (96 DPI standard)
        const MM_TO_PX: f64 = 3.779527559;
        let blur_px = material.scattering_radius_mm * MM_TO_PX;

        // Optional saturation boost (CSS limitation workaround)
        let saturation = if cfg!(feature = "css-saturation-boost") {
            1.0 + (1.0 - material.roughness) * 0.5
        } else {
            1.0  // Pure physics
        };

        // Generate CSS
        let mut filters = vec![format!("blur({:.0}px)", blur_px)];
        if saturation > 1.01 {
            filters.push(format!("saturate({:.1})", saturation));
        }

        let color = material.color.to_oklch();
        Ok(format!(
            "backdrop-filter: {}; background: oklch({:.2} {:.2} {:.0} / {:.2});",
            filters.join(" "),
            color.l, color.c, color.h, material.opacity
        ))
    }
}
```

**Output:**

```css
backdrop-filter: blur(23px);
background: oklch(0.85 0.02 240 / 0.65);
```

**See:** [ADR-005: Backend-Specific Compensations](./architecture/ADR-005-backend-specific-compensations.md)

---

#### WebGPU Backend (Planned)

```rust
impl RenderBackend for WebGpuBackend {
    fn render(&self, material: &EvaluatedMaterial, context: &RenderContext)
        -> Result<WebGpuCommands, RenderError>
    {
        // Convert mm → viewport-relative kernel size
        let viewport_mm = context.viewport_width_mm;
        let viewport_px = context.viewport_width_px;
        let px_per_mm = viewport_px / viewport_mm;

        let blur_px = material.scattering_radius_mm * px_per_mm;
        let kernel_radius = (blur_px / 2.0).ceil() as u32;

        Ok(WebGpuCommands {
            blur_kernel: BlurKernel::gaussian(kernel_radius),
            fresnel_shader: FresnelShader::schlick(material.fresnel_f0),
            color: material.color,
            // ...
        })
    }
}
```

**Key Difference:** WebGPU can implement **real Fresnel color shifts** (wavelength-dependent). CSS cannot.

---

#### Print Backend (Planned)

```rust
impl RenderBackend for PrintBackend {
    fn render(&self, material: &EvaluatedMaterial, context: &RenderContext)
        -> Result<PdfCommands, RenderError>
    {
        // No conversion needed - PDF natively supports mm!
        let blur_mm = material.scattering_radius_mm;

        Ok(PdfCommands {
            blur: format!("filter: blur({:.2}mm);", blur_mm),
            color: material.color.to_cmyk(),  // CMYK for print
            opacity: material.opacity,
        })
    }
}
```

**Why This Works:** EvaluatedMaterial uses physical units, so Print backend requires **zero conversion**.

---

## Data Flow with Physical Units

### Example: Frosted Glass Panel

**Input (Material Parameters):**

```rust
GlassMaterial {
    ior: 1.5,           // Dimensionless
    roughness: 0.6,     // Dimensionless (0.0-1.0)
    thickness: 8.0,     // Millimeters
    base_color: OKLCH::new(0.95, 0.01, 240.0),  // Perceptual color space
}
```

**Physics Evaluation:**

```
Material → evaluate(context) → EvaluatedMaterial

Fresnel:
  f0 = ((1.0 - 1.5) / (1.0 + 1.5))² = 0.04

Beer-Lambert:
  transmission = exp(-0.1 * 8.0) = 0.449

Scattering:
  surface = 0.6 * 10.0 = 6.0 mm
  volume = min(8.0 * 0.1, 2.0) = 0.8 mm
  total = 6.8 mm
```

**Output (Physical Properties):**

```rust
EvaluatedMaterial {
    scattering_radius_mm: 6.8,          // Millimeters
    fresnel_f0: 0.04,                   // Dimensionless
    opacity: 0.551,                     // Dimensionless (1 - transmission)
    color: LinearRgba { r: 0.95, g: 0.94, b: 0.96, a: 1.0 },
    absorption: [0.1, 0.1, 0.1],        // mm⁻¹
}
```

**Backend Rendering:**

| Backend | Conversion | Output |
|---------|------------|--------|
| **CSS** | `6.8mm × 3.78 = 25.7px` | `backdrop-filter: blur(26px);` |
| **WebGPU** | `kernel = 26px / 2 = 13` | `BlurKernel::gaussian(13)` |
| **Print** | No conversion | `filter: blur(6.8mm);` |

**All backends render the same material with the same physics, just different units.**

---

## Physical Units Reference

### EvaluatedMaterial Properties

| Property | Type | Unit | Physical Meaning |
|----------|------|------|------------------|
| `scattering_radius_mm` | `f64` | millimeters | Light scattering distance |
| `fresnel_f0` | `f64` | dimensionless | Reflectance at normal incidence |
| `opacity` | `f64` | dimensionless | 1.0 - transmission |
| `absorption` | `[f64; 3]` | mm⁻¹ | RGB absorption coefficients |
| `thickness_mm` | `f64` | millimeters | Material thickness |
| `color` | `LinearRgba` | linear RGB | Color without gamma |

### Material Parameters

| Parameter | Type | Unit | Range | Physical Meaning |
|-----------|------|------|-------|------------------|
| `ior` | `f64` | dimensionless | 1.0-3.0 | Index of refraction |
| `roughness` | `f64` | dimensionless | 0.0-1.0 | Surface roughness |
| `thickness` | `f64` | millimeters | 0.0-∞ | Material thickness |
| `edge_power` | `f64` | dimensionless | 1.0-5.0 | Fresnel edge sharpness |
| `noise_scale` | `f64` | dimensionless | 0.0-1.0 | Frosting intensity |

### Backend Conversions

| Backend | Input Unit | Output Unit | Conversion Factor |
|---------|------------|-------------|-------------------|
| CSS (96 DPI) | mm | pixels | `3.779527559` (96/25.4) |
| WebGPU | mm | kernel size | viewport-dependent |
| Print (PDF) | mm | mm | `1.0` (native) |
| Native (Skia) | mm | points | DPI-dependent |

**See:** [ADR-004: Physical Units in EvaluatedMaterial](./architecture/ADR-004-physical-units-in-evaluated-material.md)

---

## Architectural Decision Records

All major design decisions are documented:

| ADR | Title | Impact |
|-----|-------|--------|
| [ADR-001](./architecture/ADR-001-color-space-canonical-representation.md) | Color Space Canonical Representation | OKLCH as internal format |
| [ADR-002](./architecture/ADR-002-zero-dependency-policy.md) | Zero Dependency Policy | No external deps in core |
| [ADR-003](./architecture/ADR-003-deterministic-floating-point.md) | Deterministic Floating Point | Reproducible results |
| [ADR-004](./architecture/ADR-004-physical-units-in-evaluated-material.md) | Physical Units in EvaluatedMaterial | Backend-agnostic design |
| [ADR-005](./architecture/ADR-005-backend-specific-compensations.md) | Backend-Specific Compensations | Opt-in visual enhancements |

---

## Performance Architecture

### Batch Processing

**Problem:** Evaluating 1000 materials individually is slow (naive loop: ~300µs).

**Solution:** Batch API with SIMD-friendly memory layout.

```rust
// Naive (slow)
let evaluated: Vec<_> = materials.iter()
    .map(|m| m.evaluate(&context))
    .collect();  // ~300µs for 1000 materials

// Batch (fast)
let evaluated = BatchEvaluator::new()
    .evaluate_batch(&materials, &contexts);  // ~180µs (1.67× faster)
```

**Optimizations:**

1. **Memory Layout:** Contiguous arrays for cache efficiency
2. **LUT Acceleration:** Pre-computed Fresnel/Beer-Lambert tables (5× faster)
3. **SIMD-Ready:** Aligned structs for future AVX2 vectorization

**See:** [PERFORMANCE.md](./PERFORMANCE.md)

---

### LUT-Based Fresnel

**Direct Calculation:**

```rust
fn fresnel_schlick(f0: f64, cos_theta: f64) -> f64 {
    f0 + (1.0 - f0) * (1.0 - cos_theta).powi(5)  // ~50ns
}
```

**LUT Acceleration:**

```rust
static FRESNEL_LUT: [f64; 1024] = /* pre-computed */;

fn fresnel_lut(f0: f64, cos_theta: f64) -> f64 {
    let index = (cos_theta * 1023.0) as usize;
    f0 + (1.0 - f0) * FRESNEL_LUT[index]  // ~10ns (5× faster)
}
```

**Trade-off:** 8KB memory for 5× speedup. Acceptable for real-time rendering.

---

## Testing Architecture

### Test Pyramid

```
       ┌─────────────────┐
       │  Integration    │  End-to-end material rendering
       │  Tests (12)     │  Multi-backend validation
       └────────┬────────┘
                │
       ┌────────▼────────┐
       │  Property-Based │  Fuzzing, invariant checking
       │  Tests (24)     │  (proptest crate)
       └────────┬────────┘
                │
       ┌────────▼────────┐
       │  Unit Tests     │  Physics equations, conversions
       │  (50)           │  Golden vectors
       └─────────────────┘
```

**Coverage:** 86 tests, 100% of public API.

---

### Golden Vectors

**Purpose:** Ensure deterministic results across platforms.

```rust
#[test]
fn test_glass_frosted_golden() {
    let glass = GlassMaterial::frosted();
    let context = MaterialContext::default();
    let evaluated = glass.evaluate(&context);

    // Golden values (must never change)
    assert_eq!(evaluated.scattering_radius_mm, 6.2);
    assert_eq!(evaluated.fresnel_f0, 0.04);
    assert_eq!(evaluated.opacity, 0.55);
}
```

**Validation:** Run on every commit, all platforms (Linux, macOS, Windows, WASM).

---

## Migration Path

### From blur_px to scattering_radius_mm

**Old API (Deprecated):**

```rust
let evaluated = glass.evaluate(&context);
let blur_px = evaluated.blur_px;  // ⚠️ Deprecated
```

**New API (Recommended):**

```rust
let evaluated = glass.evaluate(&context);
let scatter_mm = evaluated.scattering_radius_mm;  // ✅ Physical unit

// Convert to pixels for CSS (if needed)
const MM_TO_PX: f64 = 3.779527559;
let blur_px = scatter_mm * MM_TO_PX;
```

**Timeline:**
- v5.0: `blur_px` deprecated, `scattering_radius_mm` added
- v5.x: Both APIs work (backward compatible)
- v6.0: `blur_px` removed (breaking change)

**See:** [MIGRATION.md](./MIGRATION.md)

---

## Future Architecture

### Phase 5: Performance Optimization

**Planned:**
- SIMD vectorization (AVX2, NEON)
- Multi-threaded batch evaluation
- GPU-accelerated evaluation (WebGPU compute shaders)

**Target:** 10× faster batch processing (1000 materials in 18µs).

---

### Phase 6: Advanced Materials

**Planned Materials:**
- `LiquidMaterial` - Navier-Stokes fluid simulation
- `MetalMaterial` - Fresnel equations for conductors
- `AcrylicMaterial` - Multi-layer compositing
- `FabricMaterial` - Anisotropic scattering

---

### Phase 7: Real-Time Preview

**Planned:**
- WebGPU backend with real Fresnel shaders
- Real-time material editor (React + WASM)
- Live parameter tweaking (<16ms latency)

---

## References

### Physics

- [Fresnel Equations](https://en.wikipedia.org/wiki/Fresnel_equations) - Reflectance model
- [Beer-Lambert Law](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law) - Absorption model
- [Rayleigh Scattering](https://en.wikipedia.org/wiki/Rayleigh_scattering) - Light scattering theory

### Color Science

- [Oklab Color Space](https://bottosson.github.io/posts/oklab/) - Perceptual uniformity
- [APCA Contrast Algorithm](https://github.com/Myndex/SAPC-APCA) - Perceptual contrast

### Standards

- [CSS Values and Units](https://www.w3.org/TR/css-values/#absolute-lengths) - 96 DPI definition
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) - Accessibility guidelines

---

## Contributing

**Architectural Guidelines:**

1. **Physics First** - No visual hacks without documented physical basis
2. **Backend-Agnostic** - No rendering concepts in `momoto-core`
3. **Deterministic** - Reproducible results across platforms
4. **Performance-Aware** - Batch APIs, SIMD-friendly layouts
5. **Zero Dependencies** - Core must remain dependency-free

**See:** [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Momoto Architecture** — Physics over pixels. Behavior over appearance.
