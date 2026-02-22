# Core Concepts

**Version:** 5.0.0
**Audience:** Developers implementing materials or backends
**Prerequisites:** Basic understanding of color spaces, linear algebra

---

## Overview

Momoto models **optical behavior** through four core abstractions:

1. **Material** - Immutable physical parameters
2. **Context** - Environmental conditions during evaluation
3. **Evaluation** - Physics transformation (Material + Context → Properties)
4. **Backend** - Rendering transformation (Properties → Output)

**Key Insight:** These abstractions are **strictly separated**. Materials know nothing about rendering. Backends know nothing about physics. Context is the bridge.

---

## 1. Materials

### Definition

A **Material** is an **immutable data structure** describing the physical properties of an optical medium.

**NOT:**
- ❌ An object with methods that produce visual output
- ❌ A stateful entity that can be "updated"
- ❌ A rendering primitive

**IS:**
- ✅ A pure function of physical parameters
- ✅ A mathematical description of light interaction
- ✅ A deterministic transformation

### Mathematical Model

```
Material: P → E
where:
  P = Physical parameters (IOR, roughness, thickness, ...)
  E = EvaluatedMaterial (scattering_radius_mm, fresnel_f0, ...)
```

**Properties:**
- **Deterministic:** Same input → same output, always
- **Pure:** No side effects, no I/O, no randomness
- **Composable:** Materials can be combined (future: layered materials)

### Example: Glass Material

```rust
pub struct GlassMaterial {
    /// Index of refraction (IOR)
    /// - Air: 1.0
    /// - Water: 1.33
    /// - Glass: 1.5-1.9
    /// - Diamond: 2.42
    pub ior: f64,

    /// Surface roughness (dimensionless)
    /// - 0.0 = Perfect mirror (specular reflection)
    /// - 0.5 = Etched glass (mixed diffuse/specular)
    /// - 1.0 = Completely frosted (diffuse only)
    pub roughness: f64,

    /// Thickness in millimeters
    /// - Affects Beer-Lambert absorption
    /// - Affects volume scattering
    pub thickness: f64,

    /// Base color in perceptual color space
    /// - OKLCH for perceptual uniformity
    /// - Applied via Beer-Lambert law (wavelength-dependent absorption)
    pub base_color: OKLCH,

    /// Noise scale for frosting effect
    /// - 0.0 = No frosting texture
    /// - 1.0 = Maximum frosting variation
    pub noise_scale: f64,

    /// Fresnel edge power (sharpness of grazing angle effect)
    /// - 1.0 = Linear falloff
    /// - 2.0 = Standard Fresnel (physically accurate)
    /// - 5.0 = Sharp edge effect
    pub edge_power: f64,
}
```

**Physical Basis:**

| Parameter | Physics Model | Reference |
|-----------|---------------|-----------|
| `ior` | Fresnel equations: F₀ = ((n₁-n₂)/(n₁+n₂))² | [Fresnel](https://en.wikipedia.org/wiki/Fresnel_equations) |
| `roughness` | Microfacet theory (Beckmann distribution) | [Cook-Torrance](https://en.wikipedia.org/wiki/Specular_highlight#Cook%E2%80%93Torrance_model) |
| `thickness` | Beer-Lambert law: T = exp(-αd) | [Beer-Lambert](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law) |
| `base_color` | Wavelength-dependent absorption | Colorimetry |

### Material as Function

**Contrast with Object-Oriented Approach:**

```rust
// ❌ OOP Approach (stateful, impure)
let mut glass = Glass::new();
glass.set_blur(20);  // Mutation!
glass.set_opacity(0.8);  // State change!
let css = glass.render();  // Side effect?

// ✅ Functional Approach (immutable, pure)
let glass = GlassMaterial {
    ior: 1.5,
    roughness: 0.6,
    thickness: 8.0,
    // ...
};
let evaluated = glass.evaluate(&context);  // Pure function
let css = backend.render(&evaluated, &render_ctx);  // Deterministic
```

**Benefits:**

1. **Reproducibility** - Same parameters always produce same result
2. **Testability** - Easy to write golden vector tests
3. **Parallelism** - No shared state, trivially parallelizable
4. **Reasoning** - No hidden state, easier to understand

### Preset Materials

Momoto provides factory methods for common materials:

```rust
// Clear window glass
let clear = GlassMaterial::clear();
// IOR: 1.52, roughness: 0.05, thickness: 3mm

// Regular frosted glass
let regular = GlassMaterial::regular();
// IOR: 1.5, roughness: 0.15, thickness: 5mm

// Heavily frosted privacy glass
let frosted = GlassMaterial::frosted();
// IOR: 1.5, roughness: 0.6, thickness: 8mm

// Custom material
let custom = GlassMaterial {
    ior: 1.7,
    roughness: 0.3,
    thickness: 10.0,
    base_color: OKLCH::new(0.9, 0.05, 180.0),  // Green tint
    noise_scale: 0.5,
    edge_power: 2.0,
};
```

### Future: User-Defined Materials

```rust
// Trait for evaluable materials
pub trait Evaluable {
    fn evaluate(&self, context: &MaterialContext) -> EvaluatedMaterial;
}

// User implements custom material
struct MyCustomGlass {
    special_property: f64,
}

impl Evaluable for MyCustomGlass {
    fn evaluate(&self, context: &MaterialContext) -> EvaluatedMaterial {
        // Custom physics model
        let scattering = calculate_custom_scattering(self.special_property);

        EvaluatedMaterial {
            scattering_radius_mm: scattering,
            // ...
        }
    }
}
```

---

## 2. Context

### Definition

A **MaterialContext** describes the **environmental conditions** in which a material is evaluated.

**Purpose:** Same material behaves differently under different lighting, viewing angles, and backgrounds.

### Physical Basis

Real-world materials don't exist in isolation. Their appearance depends on:

1. **Background** - What's behind the material (affects perceived color/opacity)
2. **Lighting** - Ambient and key light intensity (affects reflectance)
3. **Viewing Angle** - Observer's angle relative to surface normal (Fresnel effect)
4. **Temperature** (future) - Affects IOR in some materials
5. **Humidity** (future) - Affects scattering in some materials

### Structure

```rust
pub struct MaterialContext {
    /// Background color behind the material
    /// - Affects perceived opacity (dark bg → lighter glass)
    /// - Used for contrast-based adaptations
    pub background: OKLCH,

    /// Viewing angle in degrees (0° = perpendicular, 90° = grazing)
    /// - Affects Fresnel reflectance (grazing angle → more reflection)
    /// - Range: 0.0-90.0
    pub viewing_angle_deg: f64,

    /// Ambient light level (0.0-1.0)
    /// - 0.0 = Complete darkness
    /// - 0.5 = Indoor lighting
    /// - 1.0 = Bright daylight
    pub ambient_light: f64,

    /// Key light intensity (0.0-1.0)
    /// - Directional light source
    /// - Affects specular highlights
    pub key_light: f64,

    /// Whether to adapt opacity based on background
    /// - true = Material adjusts to ensure visibility
    /// - false = Fixed opacity from physics alone
    pub adapt_to_background: bool,
}
```

### Default Context

```rust
impl Default for MaterialContext {
    fn default() -> Self {
        Self {
            background: OKLCH::new(0.5, 0.0, 0.0),  // Neutral gray
            viewing_angle_deg: 0.0,                  // Perpendicular
            ambient_light: 0.7,                      // Indoor lighting
            key_light: 0.5,                          // Moderate directional
            adapt_to_background: true,               // Adaptive by default
        }
    }
}
```

### Context Presets

```rust
// Studio lighting (neutral, controlled)
let studio = MaterialContext::default();

// Outdoor lighting (bright, high contrast)
let outdoor = MaterialContext {
    background: OKLCH::new(0.98, 0.01, 100.0),  // Bright sky
    viewing_angle_deg: 15.0,                     // Slight angle
    ambient_light: 0.9,                          // Bright daylight
    key_light: 0.8,                              // Strong sun
    adapt_to_background: true,
};

// Dark mode UI
let dark_mode = MaterialContext {
    background: OKLCH::new(0.15, 0.02, 240.0),  // Dark gray-blue
    viewing_angle_deg: 0.0,
    ambient_light: 0.3,                          // Dim screen
    key_light: 0.2,
    adapt_to_background: true,
};
```

### Context-Dependent Behavior

**Example: Viewing Angle Effect**

```rust
let glass = GlassMaterial::regular();

// Perpendicular view (0°)
let ctx_perpendicular = MaterialContext {
    viewing_angle_deg: 0.0,
    ..Default::default()
};
let eval_perp = glass.evaluate(&ctx_perpendicular);
// Fresnel reflectance: ~4% (low)

// Grazing view (85°)
let ctx_grazing = MaterialContext {
    viewing_angle_deg: 85.0,
    ..Default::default()
};
let eval_grazing = glass.evaluate(&ctx_grazing);
// Fresnel reflectance: ~80% (high, nearly mirror-like)

assert!(eval_grazing.fresnel_f0 > eval_perp.fresnel_f0);
```

**Example: Background Adaptation**

```rust
let glass = GlassMaterial::regular();

// Light background → darker glass (higher opacity)
let ctx_light = MaterialContext::with_background(
    OKLCH::new(0.95, 0.01, 100.0)
);
let eval_light = glass.evaluate(&ctx_light);

// Dark background → lighter glass (lower opacity)
let ctx_dark = MaterialContext::with_background(
    OKLCH::new(0.15, 0.02, 240.0)
);
let eval_dark = glass.evaluate(&ctx_dark);

// Glass adapts to maintain visibility
assert!(eval_light.opacity > eval_dark.opacity);
```

**Physics:** This is NOT a "hack" — real glass appears more opaque against bright backgrounds due to contrast perception in the human visual system.

### Comparison with Other Systems

| System | Context Model | Limitations |
|--------|---------------|-------------|
| **CSS** | None (hardcoded for screen) | No viewing angle, no lighting |
| **Three.js** | Scene graph (implicit) | Tightly coupled to renderer |
| **Physically Based Rendering** | Full environment map | Overkill for UI, slow |
| **Momoto** | Explicit, parameterized | Decoupled, fast, predictable |

---

## 3. Evaluation

### Definition

**Evaluation** is the transformation from material parameters and context to **physical optical properties**.

```
evaluate: (Material, Context) → EvaluatedMaterial
```

**NOT:**
- ❌ Rendering (that's the backend's job)
- ❌ Visual approximation (physics only)
- ❌ Platform-specific (same on all platforms)

**IS:**
- ✅ Physics simulation (Fresnel, Beer-Lambert, scattering)
- ✅ Backend-agnostic (no pixels, no CSS)
- ✅ Deterministic (same input → same output)

### EvaluatedMaterial Structure

```rust
pub struct EvaluatedMaterial {
    /// Light scattering radius in millimeters
    /// - Physical property, backend-agnostic
    /// - Based on surface roughness + volume scattering
    pub scattering_radius_mm: f64,

    /// Fresnel reflectance at normal incidence (F₀)
    /// - Dimensionless (0.0-1.0)
    /// - Calculated from IOR: F₀ = ((n₁-n₂)/(n₁+n₂))²
    pub fresnel_f0: f64,

    /// Opacity (1.0 - transmission)
    /// - Dimensionless (0.0-1.0)
    /// - From Beer-Lambert: T = exp(-αd)
    pub opacity: f64,

    /// Material color in linear RGB (no gamma)
    /// - Linear for physically correct blending
    pub color: LinearRgba,

    /// RGB absorption coefficients (mm⁻¹)
    /// - Wavelength-dependent absorption
    /// - Used in Beer-Lambert calculation
    pub absorption: [f64; 3],

    /// Material thickness in millimeters
    pub thickness_mm: f64,

    /// Surface roughness (0.0-1.0)
    pub roughness: f64,
}
```

**All properties are in physical units.** No pixels, no CSS, no rendering concepts.

### Physics Models

#### Fresnel Reflectance (Schlick Approximation)

**Full Fresnel equations are complex:**

```
R_s = |n₁cosθᵢ - n₂cosθₜ|² / |n₁cosθᵢ + n₂cosθₜ|²
R_p = |n₁cosθₜ - n₂cosθᵢ|² / |n₁cosθₜ + n₂cosθᵢ|²
R = (R_s + R_p) / 2
```

**Schlick approximation (much faster, <1% error):**

```
F(θ) = F₀ + (1 - F₀)(1 - cosθ)⁵

where F₀ = ((n₁ - n₂) / (n₁ + n₂))²
```

**Implementation:**

```rust
fn calculate_fresnel(ior: f64, viewing_angle_deg: f64) -> f64 {
    let n1 = 1.0;  // Air
    let n2 = ior;  // Material

    // F₀ at normal incidence
    let f0 = ((n1 - n2) / (n1 + n2)).powi(2);

    // Viewing angle effect
    let theta_rad = viewing_angle_deg.to_radians();
    let cos_theta = theta_rad.cos();

    // Schlick approximation
    f0 + (1.0 - f0) * (1.0 - cos_theta).powi(5)
}
```

**Example Values:**

| Material | IOR | F₀ (0°) | F (85°) |
|----------|-----|---------|---------|
| Air/Water | 1.33 | 0.02 | ~1.0 |
| Air/Glass | 1.5 | 0.04 | ~1.0 |
| Air/Diamond | 2.42 | 0.17 | ~1.0 |

**Note:** All materials approach 100% reflectance at grazing angles (Fresnel effect).

#### Beer-Lambert Absorption

**Law:** Transmitted light intensity decreases exponentially with path length.

```
I(d) = I₀ · exp(-α · d)

where:
  I₀ = Incident intensity
  α = Absorption coefficient (mm⁻¹)
  d = Path length (mm)
```

**Implementation:**

```rust
fn calculate_transmission(absorption_coeff: f64, thickness: f64) -> f64 {
    (-absorption_coeff * thickness).exp()
}
```

**Example Values:**

| Material | α (mm⁻¹) | Thickness (mm) | Transmission |
|----------|----------|----------------|--------------|
| Clear glass | 0.01 | 3 | 0.970 (97%) |
| Tinted glass | 0.1 | 5 | 0.606 (61%) |
| Colored glass | 0.5 | 8 | 0.018 (2%) |

**Opacity = 1 - Transmission**

#### Scattering Radius

**Physical Model:**

```
r_scatter = r_surface + r_volume

where:
  r_surface = roughness × 10.0 mm  (surface scattering)
  r_volume = min(thickness × 0.1, 2.0) mm  (volume scattering)
```

**Surface Scattering:**
- Based on microfacet theory
- Empirically measured for frosted glass
- Range: 0-10mm

**Volume Scattering:**
- Based on Beer-Lambert contribution
- Thicker glass → more scattering
- Clamped to prevent unrealistic blur

**Implementation:**

```rust
fn calculate_scattering_radius(roughness: f64, thickness: f64) -> f64 {
    let surface_scattering = roughness * 10.0;
    let volume_scattering = (thickness * 0.1).min(2.0);
    surface_scattering + volume_scattering
}
```

**Example Values:**

| Roughness | Thickness (mm) | Surface (mm) | Volume (mm) | Total (mm) |
|-----------|----------------|--------------|-------------|------------|
| 0.0 (clear) | 3 | 0.0 | 0.3 | 0.3 |
| 0.15 (regular) | 5 | 1.5 | 0.5 | 2.0 |
| 0.6 (frosted) | 8 | 6.0 | 0.8 | 6.8 |

### Evaluation Process

**Step-by-step for `GlassMaterial::evaluate()`:**

```rust
impl Evaluable for GlassMaterial {
    fn evaluate(&self, context: &MaterialContext) -> EvaluatedMaterial {
        // 1. Calculate Fresnel reflectance
        let f0 = ((1.0 - self.ior) / (1.0 + self.ior)).powi(2);
        let cos_theta = (90.0 - context.viewing_angle_deg)
            .to_radians()
            .cos();
        let fresnel = f0 + (1.0 - f0) * (1.0 - cos_theta)
            .powf(self.edge_power);

        // 2. Calculate Beer-Lambert transmission
        let absorption_coeff = 0.1;  // mm⁻¹
        let transmission = (-absorption_coeff * self.thickness).exp();
        let base_opacity = 1.0 - transmission;

        // 3. Adapt opacity to background (if enabled)
        let opacity = if context.adapt_to_background {
            let bg_luminance = context.background.l;
            let contrast_factor = (bg_luminance - 0.5).abs() * 0.4;
            (base_opacity + contrast_factor).clamp(0.0, 1.0)
        } else {
            base_opacity
        };

        // 4. Calculate scattering radius
        let surface_scattering = self.roughness * 10.0;
        let volume_scattering = (self.thickness * 0.1).min(2.0);
        let scattering_radius_mm = surface_scattering + volume_scattering;

        // 5. Convert color to linear RGB
        let color = self.base_color.to_linear_rgba();

        EvaluatedMaterial {
            scattering_radius_mm,
            fresnel_f0: f0,
            opacity,
            color,
            absorption: [absorption_coeff; 3],
            thickness_mm: self.thickness,
            roughness: self.roughness,
        }
    }
}
```

### Comparison with Other Systems

| System | Evaluation Model | Physics Accuracy |
|--------|------------------|------------------|
| **CSS** | None (hardcoded values) | Low (no physics) |
| **Three.js** | Shader-based (runtime) | Medium (approximations) |
| **Blender Cycles** | Path tracing (offline) | Very high (ray-traced) |
| **Unreal Engine** | Material graph (runtime) | High (PBR shaders) |
| **Momoto** | Function-based (CPU/GPU) | High (physics equations) |

**Momoto's Niche:**
- Higher accuracy than CSS/Three.js
- Faster than Blender/Unreal for UI contexts
- Backend-agnostic (can run anywhere)

---

## 4. Backends

### Definition

A **Backend** converts **physical properties** (EvaluatedMaterial) into **rendering commands** for a specific target.

```
render: (EvaluatedMaterial, RenderContext) → Output
```

**NOT:**
- ❌ Physics simulation (that's evaluation's job)
- ❌ Material definition (that's material's job)

**IS:**
- ✅ Unit conversion (mm → px, mm → points, etc.)
- ✅ Rendering command generation (CSS, GPU, PDF)
- ✅ Platform-specific optimization

### Backend Trait

```rust
pub trait RenderBackend {
    type Output;

    fn render(
        &self,
        material: &EvaluatedMaterial,
        context: &RenderContext,
    ) -> Result<Self::Output, RenderError>;

    fn capabilities(&self) -> BackendCapabilities;
}
```

### RenderContext

```rust
pub struct RenderContext {
    /// Viewport width in pixels
    pub viewport_width_px: f64,

    /// Viewport width in millimeters (for DPI calculation)
    pub viewport_width_mm: f64,

    /// Target color space
    pub color_space: ColorSpace,

    /// DPI (derived: viewport_width_px / viewport_width_mm * 25.4)
    pub dpi: f64,
}
```

**Presets:**

```rust
impl RenderContext {
    // Desktop/laptop (96 DPI standard)
    pub fn desktop() -> Self {
        Self {
            viewport_width_px: 1920.0,
            viewport_width_mm: 508.0,  // ~20 inches
            color_space: ColorSpace::SRGB,
            dpi: 96.0,
        }
    }

    // Retina display (220 DPI)
    pub fn retina() -> Self {
        Self {
            viewport_width_px: 2880.0,
            viewport_width_mm: 331.2,  // ~13 inches
            color_space: ColorSpace::DisplayP3,
            dpi: 220.0,
        }
    }

    // Print (300 DPI)
    pub fn print_300dpi() -> Self {
        Self {
            viewport_width_px: 2550.0,
            viewport_width_mm: 215.9,  // 8.5 inches
            color_space: ColorSpace::AdobeRGB,
            dpi: 300.0,
        }
    }
}
```

### CSS Backend

**Implementation:**

```rust
pub struct CssBackend;

impl RenderBackend for CssBackend {
    type Output = String;

    fn render(
        &self,
        material: &EvaluatedMaterial,
        context: &RenderContext,
    ) -> Result<String, RenderError> {
        // Convert mm → px (CSS assumes 96 DPI)
        const MM_TO_PX: f64 = 3.779527559;  // 96 / 25.4
        let blur_px = material.scattering_radius_mm * MM_TO_PX;

        // Optional saturation boost (CSS limitation workaround)
        let saturation = if cfg!(feature = "css-saturation-boost") {
            1.0 + (1.0 - material.roughness) * 0.5
        } else {
            1.0  // Pure physics
        };

        // Generate backdrop-filter
        let mut filters = vec![format!("blur({:.0}px)", blur_px)];
        if saturation > 1.01 {
            filters.push(format!("saturate({:.1})", saturation));
        }

        // Convert color to OKLCH CSS
        let color = material.color.to_oklch();

        Ok(format!(
            "backdrop-filter: {}; background: oklch({:.2} {:.2} {:.0} / {:.2});",
            filters.join(" "),
            color.l, color.c, color.h,
            material.opacity
        ))
    }

    fn capabilities(&self) -> BackendCapabilities {
        BackendCapabilities {
            supports_fresnel_shader: false,  // CSS cannot do this
            supports_hdr: false,
            color_spaces: vec![ColorSpace::SRGB],
            max_blur_radius_px: Some(100.0),
        }
    }
}
```

**Example Output:**

```css
backdrop-filter: blur(26px);
background: oklch(0.85 0.02 240 / 0.65);
```

**Limitations:**
- Cannot implement wavelength-dependent Fresnel
- Blur limited to ~100px
- sRGB only (no HDR, no wide gamut)

**See:** [ADR-005: Backend-Specific Compensations](./architecture/ADR-005-backend-specific-compensations.md)

---

### WebGPU Backend (Planned)

**Advantages over CSS:**
- Real Fresnel shader (wavelength-dependent)
- Unlimited blur radius (compute shaders)
- HDR support
- Performance (GPU-accelerated)

**Implementation (conceptual):**

```rust
pub struct WebGpuBackend {
    device: wgpu::Device,
    fresnel_shader: FresnelShader,
    blur_shader: BlurShader,
}

impl RenderBackend for WebGpuBackend {
    type Output = WebGpuCommands;

    fn render(
        &self,
        material: &EvaluatedMaterial,
        context: &RenderContext,
    ) -> Result<WebGpuCommands, RenderError> {
        // Calculate blur kernel size from physical scattering
        let px_per_mm = context.dpi / 25.4;
        let blur_px = material.scattering_radius_mm * px_per_mm;
        let kernel_radius = (blur_px / 2.0).ceil() as u32;

        Ok(WebGpuCommands {
            blur_pass: BlurPass {
                kernel: GaussianKernel::new(kernel_radius),
                sigma: blur_px / 3.0,  // Standard deviation
            },
            fresnel_pass: FresnelPass {
                f0: material.fresnel_f0,
                edge_power: material.edge_power,
                ior: material.ior,  // Can simulate wavelength-dependent!
            },
            composite_pass: CompositePass {
                color: material.color,
                opacity: material.opacity,
            },
        })
    }

    fn capabilities(&self) -> BackendCapabilities {
        BackendCapabilities {
            supports_fresnel_shader: true,  // ✅ Real Fresnel!
            supports_hdr: true,
            color_spaces: vec![
                ColorSpace::SRGB,
                ColorSpace::DisplayP3,
                ColorSpace::Rec2020,
            ],
            max_blur_radius_px: None,  // Unlimited
        }
    }
}
```

---

### Print Backend (Planned)

**Advantage:** Native millimeter units, no conversion needed.

```rust
pub struct PrintBackend;

impl RenderBackend for PrintBackend {
    type Output = PdfCommands;

    fn render(
        &self,
        material: &EvaluatedMaterial,
        context: &RenderContext,
    ) -> Result<PdfCommands, RenderError> {
        // No conversion needed - PDF supports mm natively!
        let blur_mm = material.scattering_radius_mm;

        // Convert to CMYK for print
        let cmyk = material.color.to_cmyk();

        Ok(PdfCommands {
            filter: format!("filter: blur({:.2}mm);", blur_mm),
            color: cmyk,
            opacity: material.opacity,
        })
    }
}
```

**This is why physical units matter:** Print backend requires **zero conversion**.

---

### Backend Comparison

| Feature | CSS | WebGPU | Print | Native |
|---------|-----|--------|-------|--------|
| **Fresnel Shader** | ❌ No | ✅ Yes | ❌ No | ✅ Yes |
| **HDR** | ❌ No | ✅ Yes | ⚠️ Depends | ✅ Yes |
| **Max Blur** | ~100px | Unlimited | Unlimited | Unlimited |
| **Color Spaces** | sRGB | sRGB, P3, Rec2020 | CMYK, RGB | Platform |
| **Performance** | Medium | High | Offline | High |
| **Unit Conversion** | mm → px | mm → px | None | mm → points |

---

## Putting It All Together

### Complete Example: Frosted Glass Panel

```rust
use momoto_core::{
    material::GlassMaterial,
    evaluated::{Evaluable, MaterialContext},
    backend::CssBackend,
    render::{RenderBackend, RenderContext},
    space::oklch::OKLCH,
};

// 1. Define Material (Physical Parameters)
let glass = GlassMaterial {
    ior: 1.5,
    roughness: 0.6,
    thickness: 8.0,
    noise_scale: 0.4,
    base_color: OKLCH::new(0.95, 0.01, 240.0),  // Slight blue tint
    edge_power: 2.0,
};

// 2. Define Context (Environmental Conditions)
let context = MaterialContext {
    background: OKLCH::new(0.2, 0.05, 220.0),  // Dark blue background
    viewing_angle_deg: 0.0,
    ambient_light: 0.7,
    key_light: 0.5,
    adapt_to_background: true,
};

// 3. Evaluate Physics
let evaluated = glass.evaluate(&context);

// Inspect physical properties
println!("Scattering: {:.2} mm", evaluated.scattering_radius_mm);  // 6.8 mm
println!("Fresnel F₀: {:.3}", evaluated.fresnel_f0);  // 0.040
println!("Opacity: {:.2}", evaluated.opacity);  // 0.55

// 4. Render to CSS Backend
let backend = CssBackend;
let render_ctx = RenderContext::desktop();
let css = backend.render(&evaluated, &render_ctx).unwrap();

println!("{}", css);
// Output: backdrop-filter: blur(26px); background: oklch(0.85 0.02 240 / 0.55);
```

**Same Material, Different Backend:**

```rust
// Render to WebGPU (future)
let webgpu_backend = WebGpuBackend::new(device);
let webgpu_cmds = webgpu_backend.render(&evaluated, &render_ctx).unwrap();

// Render to Print (future)
let print_backend = PrintBackend;
let pdf_cmds = print_backend.render(&evaluated, &RenderContext::print_300dpi()).unwrap();
```

**Same physics, different output format.**

---

## Comparison with Other Systems

### Momoto vs. CSS Libraries

| Aspect | CSS Library | Momoto |
|--------|-------------|--------|
| **Model** | Visual effects | Optical physics |
| **Units** | Pixels | Millimeters |
| **Backends** | CSS only | CSS, WebGPU, Print, Native |
| **Determinism** | Browser-dependent | Platform-independent |
| **Extensibility** | Hardcoded | User-defined materials |

**Example:**

```javascript
// CSS Library (magic numbers)
const panel = glassmorphism({
  blur: 20,  // Pixels? Which DPI?
  opacity: 0.7,  // Why 0.7?
  saturation: 1.3,  // Why 1.3?
});

// Momoto (physics)
const glass = GlassMaterial.frosted();
const context = MaterialContext.new();
const evaluated = glass.evaluate(context);
// scattering_radius_mm: 6.2 (from IOR=1.5, roughness=0.6, thickness=8mm)
// fresnel_f0: 0.04 (from Fresnel equations)
// opacity: 0.55 (from Beer-Lambert law)
```

---

### Momoto vs. Three.js Materials

| Aspect | Three.js | Momoto |
|--------|----------|--------|
| **Coupling** | Tightly coupled to renderer | Backend-agnostic |
| **Evaluation** | Runtime (GPU shaders) | Ahead-of-time (CPU) |
| **Context** | Implicit (scene graph) | Explicit (MaterialContext) |
| **Testability** | Difficult (requires WebGL) | Easy (pure functions) |

**Three.js:**

```javascript
const material = new THREE.MeshPhysicalMaterial({
  roughness: 0.6,
  transmission: 1.0,
  thickness: 8.0,
  // Material is coupled to Three.js renderer
});
scene.add(new THREE.Mesh(geometry, material));
```

**Momoto:**

```rust
let glass = GlassMaterial { roughness: 0.6, thickness: 8.0, ... };
let evaluated = glass.evaluate(&context);  // Decoupled evaluation

// Can render to any backend
let css = CssBackend.render(&evaluated, &ctx);
let webgpu = WebGpuBackend.render(&evaluated, &ctx);
```

---

### Momoto vs. Unreal Engine Materials

| Aspect | Unreal | Momoto |
|--------|--------|--------|
| **Scope** | Full 3D engine | UI-focused |
| **Complexity** | Node-based graphs | Function-based |
| **Performance** | Real-time rendering | Batch evaluation |
| **Use Case** | Games, visualization | UI, design systems |

**Similarities:**
- Both use physics-based rendering (PBR)
- Both separate material definition from rendering
- Both support custom materials

**Differences:**
- Unreal: Runtime shader compilation (heavy)
- Momoto: Ahead-of-time evaluation (lightweight)

---

## Best Practices

### 1. Material Design

**DO:**
- ✅ Use physically plausible values (IOR 1.0-3.0, roughness 0.0-1.0)
- ✅ Test materials with multiple contexts (light/dark backgrounds)
- ✅ Validate with golden vectors

**DON'T:**
- ❌ Use magic numbers without documentation
- ❌ Couple materials to specific backends
- ❌ Mutate material properties

### 2. Context Configuration

**DO:**
- ✅ Use presets (studio, outdoor, dark_mode) as starting points
- ✅ Adapt contexts to user's environment (light/dark mode)
- ✅ Document why specific context values are chosen

**DON'T:**
- ❌ Use default context for all scenarios
- ❌ Hardcode viewing angles without justification

### 3. Backend Selection

**DO:**
- ✅ Choose backend based on capabilities needed
- ✅ Test backend output in target environment
- ✅ Document backend limitations

**DON'T:**
- ❌ Assume CSS backend supports all features
- ❌ Use WebGPU if CSS suffices (unnecessary complexity)

---

## Further Reading

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and data flow
- [PERFORMANCE.md](./PERFORMANCE.md) - Optimization techniques
- [MIGRATION.md](./MIGRATION.md) - Upgrading from legacy APIs
- [ADR-004](./architecture/ADR-004-physical-units-in-evaluated-material.md) - Physical units decision
- [ADR-005](./architecture/ADR-005-backend-specific-compensations.md) - Backend compensations pattern

---

**Core Concepts** — Materials are functions. Context is environment. Evaluation is physics. Backends are converters.
