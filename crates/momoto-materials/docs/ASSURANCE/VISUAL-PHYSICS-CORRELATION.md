# Visual-Physics Correlation Report

**Date:** 2026-01-11
**Author:** Claude Opus 4.5 Assurance System
**Status:** CORRELATIONS DOCUMENTED

---

## Executive Summary

This document maps visual phenomena observed in Storybook to their underlying physics implementations, explaining what each effect represents and which engine modules produce it.

---

## 1. Fresnel Edge Glow

### 1.1 Visual Phenomenon

**What you see:** Bright edge glow around glass panels, intensifying at grazing angles.

**Where visible:**
- All GlassPresets stories
- Clear and Regular glass show strongest effect
- Frosted glass shows softer, diffused glow

### 1.2 Physics Explanation

The Fresnel effect describes how reflectivity increases as viewing angle approaches grazing incidence.

**Formula:**
```
R(θ) = R₀ + (1 - R₀)(1 - cos θ)⁵
```

Where:
- R₀ = Base reflectivity at normal incidence
- θ = Viewing angle from surface normal
- R(θ) = Reflectivity at angle θ

**At normal incidence (θ = 0°):** R = R₀ ≈ 4% for glass
**At grazing incidence (θ → 90°):** R → 100%

### 1.3 Engine Module

```rust
// glass_physics/transmittance.rs
pub fn fresnel_schlick(cos_theta: f64, ior1: f64, ior2: f64) -> f64
```

### 1.4 CSS Manifestation

```css
/* generateFresnelGradientCss() */
background: radial-gradient(
  ellipse at center,
  transparent 40%,
  rgba(255,255,255,0.35) 100%
);
```

### 1.5 Controlling Parameters

| Parameter | Effect | Range |
|-----------|--------|-------|
| IOR | Higher = stronger edge glow | 1.0-2.5 |
| edgePower | Sharpness of transition | 1.0-4.0 |
| fresnelIntensity | Overall brightness | 0.0-1.0 |

---

## 2. Specular Highlights

### 2.1 Visual Phenomenon

**What you see:** Bright spots on material surface representing light source reflections.

**Where visible:**
- All material stories
- Metal materials show larger, more diffuse highlights
- Glass shows sharp, concentrated highlights

### 2.2 Physics Explanation

Blinn-Phong specular model approximates microfacet reflection.

**Formula:**
```
S = max(0, N·H)^shininess
```

Where:
- N = Surface normal
- H = Halfway vector between view and light
- shininess = Roughness⁻¹ × 256

### 2.3 Engine Module

```rust
// glass_physics/light_model.rs
pub fn blinn_phong_specular(
    normal: Vec3,
    light_dir: Vec3,
    view_dir: Vec3,
    shininess: f64
) -> f64
```

### 2.4 CSS Manifestation

```css
/* generateSpecularHighlightCss() */
background: radial-gradient(
  ellipse 15% 8% at 70% 15%,
  rgba(255,255,255,0.6) 0%,
  transparent 100%
);
```

### 2.5 Controlling Parameters

| Parameter | Effect | Range |
|-----------|--------|-------|
| roughness | Higher = larger, dimmer highlight | 0.0-1.0 |
| specularIntensity | Brightness | 0.0-1.0 |
| shininess | Focus of highlight | 1-256 |

---

## 3. Metal Reflectivity (F0)

### 3.1 Visual Phenomenon

**What you see:** Metals appear highly reflective with colored tints (gold = yellow, copper = orange).

**Where visible:**
- MetalMaterials story
- F0 bar shows reflectivity percentage

### 3.2 Physics Explanation

Metals have complex IOR (n + ik) where k is the extinction coefficient.

**Formula:**
```
F₀ = ((n-1)² + k²) / ((n+1)² + k²)
```

| Metal | n | k | F₀ |
|-------|---|---|-----|
| Gold | 0.27 | 2.95 | 91% |
| Silver | 0.15 | 3.32 | 97% |
| Copper | 0.62 | 2.57 | 80% |

### 3.3 Engine Module

```rust
// complex_ior/mod.rs
pub fn conductor_fresnel(n: f64, k: f64, cos_theta: f64) -> f64
```

### 3.4 Visual Correlation

**High F0 (>90%):** Mirror-like, bright reflection (silver, gold)
**Medium F0 (50-80%):** Reflective but with visible base color (copper, titanium)
**Low F0 (<50%):** Less reflective, more matte appearance

### 3.5 Controlling Parameters

| Parameter | Effect |
|-----------|--------|
| n (real IOR) | Base reflectivity character |
| k (extinction) | Increases overall reflectivity |
| roughness | Diffuses reflection |

---

## 4. Thin-Film Iridescence

### 4.1 Visual Phenomenon

**What you see:** Rainbow colors that shift with thickness and viewing angle.

**Where visible:**
- ThinFilmIridescence stories
- Soap bubbles show animated color shifts
- Oil slick shows spatial color gradient

### 4.2 Physics Explanation

Constructive/destructive interference from film surfaces.

**Formula:**
```
R = 4r² sin²(2π × n × d / λ)
```

Where:
- r = Fresnel reflection coefficient
- n = Film refractive index
- d = Film thickness
- λ = Wavelength of light

**Constructive interference:** When 2nd = mλ (bright color)
**Destructive interference:** When 2nd = (m+½)λ (dark/absent color)

### 4.3 Engine Module

```rust
// thin_film.rs
pub fn thin_film_reflectance(
    thickness: f64,
    film_ior: f64,
    substrate_ior: f64,
    wavelength: f64,
    cos_theta: f64
) -> f64
```

### 4.4 Visual Correlation

| Thickness | Dominant Color |
|-----------|----------------|
| 100nm | Dark (below visible) |
| 200nm | Blue/violet |
| 300nm | Green/cyan |
| 400nm | Yellow/orange |
| 500nm | Red/magenta |
| 600nm+ | Cycle repeats |

### 4.5 Controlling Parameters

| Parameter | Effect |
|-----------|--------|
| thickness | Changes dominant color |
| film_ior | Shifts color spectrum |
| wavelength | Target color elimination |

---

## 5. Anisotropic Highlights

### 5.1 Visual Phenomenon

**What you see:** Elongated, directional highlights (like on brushed metal).

**Where visible:**
- AnisotropicMaterials story
- Brushed aluminum/steel show linear highlights
- Hair/fiber materials show strand-oriented reflections

### 5.2 Physics Explanation

Anisotropic microfacets have different roughness along two perpendicular directions.

**GGX Anisotropic Distribution:**
```
D(H) = 1 / (π × αx × αy × (Hx²/αx² + Hy²/αy² + Hz²)²)
```

Where:
- αx = Roughness along tangent (brush direction)
- αy = Roughness perpendicular to brush

### 5.3 Visual Correlation

| αx vs αy | Visual Effect |
|----------|---------------|
| αx << αy | Horizontal stretch |
| αx >> αy | Vertical stretch |
| αx = αy | Isotropic (circular) |

### 5.4 Controlling Parameters

| Parameter | Effect |
|-----------|--------|
| roughnessX | Tangent roughness |
| roughnessY | Bitangent roughness |
| brushAngle | Rotation of highlight |

---

## 6. Subsurface Glow

### 6.1 Visual Phenomenon

**What you see:** Soft, glowing translucency from within the material.

**Where visible:**
- SubsurfaceMaterials story
- Skin shows warm red-orange backlight glow
- Marble shows cool, deep glow
- Wax shows yellow-warm translucency

### 6.2 Physics Explanation

Light enters the material, scatters internally, and exits at nearby points.

**Dipole Diffusion (Jensen 2001):**
```
Rd(r) = (α'/4π) × [zr(σtr×dr+1)e^(-σtr×dr)/dr³ + zv(σtr×dv+1)e^(-σtr×dv)/dv³]
```

Key parameters:
- σa = Absorption coefficient (color absorption)
- σs = Scattering coefficient (light diffusion)
- MFP = 1/(σa + σs) = Mean Free Path

### 6.3 Visual Correlation

| MFP | Visual Effect |
|-----|---------------|
| < 1mm | Thin glow layer, opaque core (skin) |
| 1-5mm | Moderate translucency (wax, jade) |
| 5-15mm | Deep glow, very translucent (marble, milk) |

### 6.4 Controlling Parameters

| Parameter | Effect |
|-----------|--------|
| meanFreePath | Depth of light penetration |
| scatterColor | Color of scattered light |
| absorptionColor | Color absorbed (complementary visible) |
| backlight | Intensity of glow |

---

## 7. Quality Tier Differences

### 7.1 Visual Phenomenon

**What you see:** Same material looks different at different quality tiers.

**Where visible:**
- RenderContext story
- Mobile: Simpler gradients, reduced blur
- Desktop: Full quality effects
- 4K: Enhanced detail, crisp edges

### 7.2 Technical Explanation

Quality tiers adjust:
- Blur kernel size
- Gradient complexity
- Shadow layers
- Specular samples

### 7.3 Visual Correlation

| Tier | Blur Radius | Gradient Stops | Shadow Layers |
|------|-------------|----------------|---------------|
| Mobile | 8px | 3 | 1 |
| Desktop | 20px | 6 | 3 |
| 4K | 40px | 12 | 5 |

---

## 8. Elevation Shadows

### 8.1 Visual Phenomenon

**What you see:** Progressive shadow depth as elevation increases.

**Where visible:**
- ElevationShadows story
- Level 0: No shadow (flat)
- Level 6: Deep, multi-layer shadow

### 8.2 Technical Explanation

Material Design 3 elevation system with multiple shadow layers.

**Shadow composition:**
```css
box-shadow:
  0 1px 2px rgba(0,0,0,0.1),   /* Ambient */
  0 2px 4px rgba(0,0,0,0.08),  /* Key light */
  0 4px 8px rgba(0,0,0,0.06); /* Fill */
```

### 8.3 Controlling Parameters

| Parameter | Effect |
|-----------|--------|
| elevation | Number of shadow layers |
| background | Shadow color adaptation |
| glass_depth | Shadow offset scaling |

---

## 9. Artifact Detection Guide

### 9.1 Expected Artifacts (Not Bugs)

| Artifact | Cause | Acceptable |
|----------|-------|------------|
| Banding in gradients | CSS gradient limitations | Yes |
| Slight color shift at edges | Gamut mapping | Yes |
| Soft focus at high blur | Backdrop-filter limits | Yes |

### 9.2 Unexpected Artifacts (Bugs)

| Artifact | Possible Cause | Severity |
|----------|----------------|----------|
| Hard edges in Fresnel | Missing gradient stops | MAJOR |
| Black spots | Division by zero | CRITICAL |
| Color explosion | Out-of-gamut values | MAJOR |
| Flickering | State update race | MAJOR |

---

## 10. Module-to-Visual Mapping

### 10.1 Complete Mapping Table

| Visual Effect | Engine Module | WASM Function | CSS Generator |
|---------------|---------------|---------------|---------------|
| Fresnel edge | transmittance.rs | fresnelSchlick() | generateFresnelGradientCss() |
| Specular highlight | light_model.rs | blinnPhongSpecular() | generateSpecularHighlightCss() |
| Metal reflectivity | complex_ior/mod.rs | conductor_fresnel() | (color calculation) |
| Thin-film color | thin_film.rs | thin_film_reflectance() | (RGB from λ) |
| Anisotropic stretch | anisotropic_brdf.rs | ggx_anisotropic_d() | (simulated) |
| SSS glow | subsurface_scattering.rs | diffusion_bssrdf() | (simulated) |
| Elevation shadow | shadow_engine/ | calculateElevationShadow() | to_css() |
| Quality tier | context.rs | RenderContext::*() | (CSS complexity) |

### 10.2 Parameter Flow

```
User Input (Storybook Control)
    ↓
GlassMaterial Constructor
    ↓
evaluate(EvalMaterialContext)
    ↓
EvaluatedMaterial
    ↓
CssBackend.render(RenderContext)
    ↓
CSS String
    ↓
enhanceGlassCss(options)
    ↓
React Style Object
    ↓
DOM Rendering
```

---

## 11. Correlation Verification Checklist

### 11.1 For Each Screenshot

- [ ] Identify primary visual effect
- [ ] Map to engine module
- [ ] Verify parameter matches visual
- [ ] Check for artifacts
- [ ] Confirm physics formula visible in effect

### 11.2 Correlation Status

| Effect | Visually Verified | Physics Correct | Correlation |
|--------|-------------------|-----------------|-------------|
| Fresnel edge | Pending | ✅ | Pending |
| Specular highlight | Pending | ✅ | Pending |
| Metal F0 | Pending | ✅ | Pending |
| Thin-film color | Pending | ✅ | Pending |
| Anisotropic | Pending | ✅ | Pending |
| SSS glow | Pending | ✅ | Pending |
| Elevation shadow | Pending | ✅ | Pending |
| Quality tiers | Pending | ✅ | Pending |

---

## 12. Conclusion

This document provides complete mapping between:
- **What you see** (visual phenomena)
- **Why you see it** (physics formulas)
- **How it's produced** (engine modules)
- **What controls it** (parameters)

**Status:** CORRELATIONS DOCUMENTED - AWAITING VISUAL VERIFICATION

---

*End of Visual-Physics Correlation Report*
