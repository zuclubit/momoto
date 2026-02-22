# Momoto API Stability Guide

**Version:** 6.0.0
**Last Updated:** 2026-02-01

This document defines the stability levels for all Momoto APIs and provides guidance for consumers on which APIs are safe to depend on.

---

## Stability Levels

### STABLE
APIs that are production-ready and follow semantic versioning:
- Will not have breaking changes in minor versions (6.x)
- Breaking changes only in major versions (7.0)
- Fully documented with examples
- Covered by comprehensive tests

### BETA
APIs that are feature-complete but may have minor changes:
- May have non-breaking improvements in minor versions
- Breaking changes possible with deprecation warnings
- Documented with basic examples
- Good test coverage

### EXPERIMENTAL
Research-grade APIs that may change significantly:
- May change or be removed at any time
- Use only for research/prototyping
- Limited documentation
- Test coverage varies

---

## API Stability Matrix

### momoto-core (100% STABLE)

| API | Stability | Since |
|-----|-----------|-------|
| `Color` | STABLE | 1.0 |
| `Color::from_srgb8()` | STABLE | 1.0 |
| `Color::from_hex()` | STABLE | 1.0 |
| `Color::to_oklch()` | STABLE | 1.0 |
| `Color::with_alpha()` | STABLE | 5.0 |
| `OKLCH` | STABLE | 1.0 |
| `OKLCH::new()` | STABLE | 1.0 |
| `OKLCH::interpolate()` | STABLE | 2.0 |
| `OKLCH::map_to_gamut()` | STABLE | 3.0 |
| `OKLab` | STABLE | 1.0 |
| `GlassMaterial` | STABLE | 2.0 |
| `GlassMaterial::clear()` | STABLE | 2.0 |
| `GlassMaterial::regular()` | STABLE | 2.0 |
| `GlassMaterial::thick()` | STABLE | 2.0 |
| `GlassMaterial::frosted()` | STABLE | 2.0 |
| `GlassMaterial::builder()` | STABLE | 3.0 |
| `GlassMaterial::scattering_radius_mm()` | STABLE | 5.0 |
| `EvaluatedMaterial` | STABLE | 3.0 |
| `MaterialContext` | STABLE | 3.0 |
| `ColorBackend` trait | STABLE | 3.0 |
| `CpuBackend` | STABLE | 3.0 |
| `RenderBackend` trait | STABLE | 4.0 |
| `RenderContext` | STABLE | 4.0 |
| Gamma utilities | STABLE | 1.0 |
| Luminance utilities | STABLE | 2.0 |

### momoto-metrics (100% STABLE)

| API | Stability | Since |
|-----|-----------|-------|
| `WCAGMetric` | STABLE | 1.0 |
| `WCAGMetric::evaluate()` | STABLE | 1.0 |
| `WCAGMetric::passes()` | STABLE | 1.0 |
| `WCAGMetric::level()` | STABLE | 1.0 |
| `WCAGMetric::is_large_text()` | STABLE | 2.0 |
| `WCAGLevel` | STABLE | 1.0 |
| `TextSize` | STABLE | 2.0 |
| `WCAG_REQUIREMENTS` | STABLE | 1.0 |
| `APCAMetric` | STABLE | 1.0 |
| `APCAMetric::evaluate()` | STABLE | 1.0 |
| `ContrastMetric` trait | STABLE | 1.0 |
| `PerceptualResult` | STABLE | 1.0 |

### momoto-intelligence (100% STABLE)

| API | Stability | Since |
|-----|-----------|-------|
| `RecommendationEngine` | STABLE | 4.0 |
| `RecommendationEngine::recommend_foreground()` | STABLE | 4.0 |
| `RecommendationEngine::improve_foreground()` | STABLE | 4.0 |
| `QualityScorer` | STABLE | 4.0 |
| `QualityScorer::score()` | STABLE | 4.0 |
| `QualityScore` | STABLE | 4.0 |
| `RecommendationContext` | STABLE | 4.0 |
| `UsageContext` | STABLE | 4.0 |
| `ComplianceTarget` | STABLE | 4.0 |
| `Recommendation` | STABLE | 4.0 |
| `Modification` | STABLE | 4.0 |

### momoto-materials

#### Tier 1 - Essential (STABLE)

| API | Stability | Since |
|-----|-----------|-------|
| `fresnel_schlick()` | STABLE | 5.0 |
| `fresnel_full()` | STABLE | 5.0 |
| `brewster_angle()` | STABLE | 5.0 |
| `edge_intensity()` | STABLE | 5.0 |
| `blinn_phong_specular()` | STABLE | 5.0 |
| `to_css_fresnel_gradient()` | STABLE | 5.0 |
| `to_css_specular_highlight()` | STABLE | 5.0 |
| `BackgroundContext` | STABLE | 5.0 |
| `LightingContext` | STABLE | 5.0 |
| `ViewContext` | STABLE | 5.0 |
| `MaterialContext` | STABLE | 5.0 |
| `ContextPresets` | STABLE | 5.0 |
| `EnhancedGlassMaterial` | STABLE | 5.0 |
| `QualityTier` | STABLE | 5.0 |
| Material presets (crown_glass, etc.) | STABLE | 5.0 |
| `FresnelLUT` | STABLE | 5.0 |
| `BeerLambertLUT` | STABLE | 5.0 |
| `fresnel_fast()` | STABLE | 5.0 |
| `beer_lambert_fast()` | STABLE | 5.0 |
| `BatchEvaluator` | STABLE | 5.0 |
| `evaluate_batch()` | STABLE | 5.0 |
| `select_tier()` | STABLE | 5.0 |
| `DeviceCapabilities` | STABLE | 5.0 |

#### Tier 2 - Advanced (STABLE)

| API | Stability | Since |
|-----|-----------|-------|
| `BSDF` trait | STABLE | 5.0 |
| `BSDFContext` | STABLE | 5.0 |
| `BSDFResponse` | STABLE | 5.0 |
| `DielectricBSDF` | STABLE | 5.0 |
| `ConductorBSDF` | STABLE | 5.0 |
| `ThinFilmBSDF` | STABLE | 5.0 |
| `LayeredBSDF` | STABLE | 5.0 |
| `ThinFilm` | STABLE | 5.0 |
| `ThinFilmStack` | STABLE | 5.0 |
| `thin_film_to_rgb()` | STABLE | 5.0 |
| `to_css_iridescent_gradient()` | STABLE | 5.0 |
| `Complex` | STABLE | 5.0 |
| `ComplexIOR` | STABLE | 5.0 |
| `fresnel_conductor()` | STABLE | 5.0 |
| `metals::*` | STABLE | 5.0 |
| `CauchyDispersion` | STABLE | 5.0 |
| `SellmeierDispersion` | STABLE | 5.0 |
| `MieParams` | STABLE | 5.0 |
| `MieLUT` | STABLE | 5.0 |
| `rayleigh_phase()` | STABLE | 5.0 |
| `henyey_greenstein()` | STABLE | 5.0 |

#### Tier 3 - Research (BETA)

| API | Stability | Since |
|-----|-----------|-------|
| `MaterialTwin` | BETA | 5.0 |
| `TwinBuilder` | BETA | 5.0 |
| `SpectralIdentity` | BETA | 5.0 |
| `DifferentiableBSDF` | BETA | 5.0 |
| `DifferentiableResponse` | BETA | 5.0 |
| `ParameterGradients` | BETA | 5.0 |
| `Jacobian` | BETA | 5.0 |
| `InverseMaterialSolver` | BETA | 5.0 |
| `CalibrationSource` | BETA | 5.0 |
| `ParameterCovarianceMatrix` | BETA | 5.0 |
| `FisherInformationMatrix` | BETA | 5.0 |
| `BootstrapResampler` | BETA | 5.0 |
| `LabColor` | BETA | 5.0 |
| `delta_e_2000()` | BETA | 5.0 |
| `perceptual_loss()` | BETA | 5.0 |
| `AnisotropicGGX` | BETA | 5.0 |
| `SubsurfaceBSDF` | BETA | 5.0 |
| `Material` (PBR API v1) | BETA | 5.0 |
| `MaterialBuilder` | BETA | 5.0 |
| `GpuBackendConfig` | BETA | 5.0 |

#### Tier 4 - Scientific (EXPERIMENTAL)

| API | Stability | Since |
|-----|-----------|-------|
| `Unit` | EXPERIMENTAL | 5.0 |
| `Measurement` | EXPERIMENTAL | 5.0 |
| `TraceabilityChain` | EXPERIMENTAL | 5.0 |
| `ToleranceBudget` | EXPERIMENTAL | 5.0 |
| `VirtualGonioreflectometer` | EXPERIMENTAL | 5.0 |
| `VirtualSpectrophotometer` | EXPERIMENTAL | 5.0 |
| `VirtualEllipsometer` | EXPERIMENTAL | 5.0 |
| `CertificationLevel` | EXPERIMENTAL | 5.0 |
| `CertificationAuditor` | EXPERIMENTAL | 5.0 |
| `GroundTruthValidator` | EXPERIMENTAL | 5.0 |
| `MaterialExporter` | EXPERIMENTAL | 5.0 |
| `MaterialImporter` | EXPERIMENTAL | 5.0 |
| `RenderPlugin` | EXPERIMENTAL | 5.0 |
| `PluginRegistry` | EXPERIMENTAL | 5.0 |
| `ReferenceRenderer` | EXPERIMENTAL | 5.0 |
| `SpectralErrorMetrics` | EXPERIMENTAL | 5.0 |

---

## Migration Guide

### From v5.0 to v6.0

#### Removed APIs

**`blur_amount()` → `scattering_radius_mm()`**

```rust
// BEFORE (v5.0 - deprecated)
let blur_px = glass.blur_amount();

// AFTER (v6.0)
let scatter_mm = glass.scattering_radius_mm();
let dpi = 96.0; // or window.devicePixelRatio * 96
let blur_px = scatter_mm * (dpi / 25.4);
```

**`has_blur()` → `has_scattering()`**

```rust
// BEFORE (v5.0 - deprecated)
if material.has_blur() { ... }

// AFTER (v6.0)
if material.has_scattering() { ... }
```

#### JavaScript Migration

```javascript
// BEFORE (v5.0 - deprecated)
const blurPx = glass.blurAmount();

// AFTER (v6.0)
const scatterMm = glass.scatteringRadiusMm();
const dpiPxPerMm = window.devicePixelRatio * 96 / 25.4;
const blurPx = scatterMm * dpiPxPerMm;
```

---

## Feature Flags

### Production Features

| Flag | Description | Default |
|------|-------------|---------|
| `default` | Core functionality | enabled |
| `wasm` | WebAssembly support | disabled |
| `gpu` | GPU acceleration | disabled |

### Physics Features

| Flag | Description | Default |
|------|-------------|---------|
| `thin-film` | Thin-film interference | disabled |
| `dispersion` | Chromatic dispersion | disabled |
| `metals` | Complex IOR for metals | disabled |
| `mie` | Mie scattering | disabled |
| `spectral` | Full spectral pipeline | disabled |

### Research Features

| Flag | Description | Default |
|------|-------------|---------|
| `differentiable` | Gradient computation | disabled |
| `neural` | Neural correction | disabled |
| `metrology` | Scientific metrology | disabled |
| `internals` | Internal algorithms | disabled |

### Bundles

| Flag | Includes | Use Case |
|------|----------|----------|
| `physics-full` | thin-film, dispersion, metals, mie, spectral | Full physics |
| `research` | physics-full, differentiable, metrology, internals | Research |
| `production` | physics-full, gpu | Production apps |

---

## Deprecation Policy

1. APIs are deprecated for at least one major version before removal
2. Deprecated APIs emit compiler warnings with migration guidance
3. Migration guides are provided for all breaking changes
4. Deprecated APIs continue to function until removal

---

## Support

For questions about API stability:
- GitHub Issues: https://github.com/momoto/momoto/issues
- Documentation: https://docs.momoto.dev
