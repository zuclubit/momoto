# MOMOTO CAPABILITY MAP
## Complete Inventory of System Capabilities

**Generated:** 2026-02-01
**Source:** Code archaeology of 206 Rust files + 174 TypeScript files

---

## CAPABILITY DOMAINS

```
MOMOTO SYSTEM
├── 1. PERCEPTUAL COLOR SCIENCE ────────────── momoto-core
│   ├── Color Representation
│   ├── Color Space Transformations
│   ├── Luminance Calculations
│   └── Gamut Handling
│
├── 2. ACCESSIBILITY METRICS ───────────────── momoto-metrics
│   ├── WCAG 2.1 Contrast
│   ├── APCA-W3 Contrast
│   └── Polarity Detection
│
├── 3. INTELLIGENT RECOMMENDATIONS ─────────── momoto-intelligence
│   ├── Context-Aware Scoring
│   ├── Color Recommendations
│   ├── Modification Tracking
│   └── Confidence Assessment
│
├── 4. PHYSICAL OPTICS ─────────────────────── momoto-materials/glass_physics
│   ├── Fresnel Equations
│   ├── Beer-Lambert Transmittance
│   ├── Thin-Film Interference
│   ├── Chromatic Dispersion
│   ├── Complex IOR (Metals)
│   ├── Mie Scattering
│   ├── Anisotropic BRDF
│   ├── Subsurface Scattering
│   └── Spectral Pipeline
│
├── 5. MATERIAL CHARACTERIZATION ───────────── momoto-materials/*
│   ├── Digital Material Twins
│   ├── Calibration Pipeline
│   ├── Uncertainty Quantification
│   ├── Virtual Instruments
│   ├── Metrology System
│   └── Certification Levels
│
├── 6. MACHINE LEARNING ────────────────────── momoto-materials/neural*
│   ├── Neural Correction MLP
│   ├── Differentiable Rendering
│   ├── Inverse Material Solver
│   └── Training Pipeline
│
└── 7. AI DECISION INFRASTRUCTURE ──────────── application/, domain/
    ├── Governance Engine
    ├── Policy Composition
    ├── AI Action Contracts
    ├── Constraint Generation
    └── Conformance Levels
```

---

## DOMAIN 1: PERCEPTUAL COLOR SCIENCE

### Crate: `momoto-core`

| Capability | Type | Status | WASM | Location |
|-----------|------|--------|------|----------|
| Color from RGB | `Color::from_srgb8()` | ✅ Stable | ✅ | color/mod.rs |
| Color from Hex | `Color::from_hex()` | ✅ Stable | ✅ | color/mod.rs |
| Color to RGB | `Color::to_srgb8()` | ✅ Stable | ✅ | color/mod.rs |
| Color to Hex | `Color::to_hex()` | ✅ Stable | ✅ | color/mod.rs |
| Alpha manipulation | `Color::with_alpha()` | ✅ Stable | ❌ GAP | color/mod.rs |
| Dual precision storage | Internal | ✅ Stable | N/A | color/mod.rs |
| OKLCH creation | `OKLCH::new()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| OKLCH from Color | `OKLCH::from_color()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| OKLCH to Color | `OKLCH::to_color()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| OKLCH lighten | `OKLCH::lighten()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| OKLCH darken | `OKLCH::darken()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| OKLCH saturate | `OKLCH::saturate()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| OKLCH desaturate | `OKLCH::desaturate()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| OKLCH hue rotation | `OKLCH::rotate_hue()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| Gamut mapping | `OKLCH::map_to_gamut()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| Gamut estimation | `OKLCH::estimate_max_chroma()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| Delta E | `OKLCH::delta_e()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| Interpolation | `OKLCH::interpolate()` | ✅ Stable | ✅ | space/oklch/mod.rs |
| Relative luminance (sRGB) | `relative_luminance_srgb()` | ✅ Stable | ✅ | luminance/mod.rs |
| Relative luminance (APCA) | `relative_luminance_apca()` | ✅ Stable | ✅ | luminance/mod.rs |
| Soft clamping | `soft_clamp()` | ✅ Stable | ✅ | luminance/mod.rs |
| sRGB to linear | `srgb_to_linear()` | ✅ Stable | ✅ | color/gamma.rs |
| Linear to sRGB | `linear_to_srgb()` | ✅ Stable | ✅ | color/gamma.rs |
| RGB to linear array | `Gamma::rgbToLinear()` | ✅ v6.0.0 | ✅ | wasm binding |
| Linear to RGB array | `Gamma::linearToRgb()` | ✅ v6.0.0 | ✅ | wasm binding |
| Gamut boundary coefficients | `GAMUT_COEFFICIENTS` | ✅ Stable | ✅ | space/oklch/mod.rs |
| Transformation matrices | `RGB_TO_LMS`, `LMS_TO_LAB`, etc. | ✅ Feature | ❌ | space/oklch/mod.rs |

### Feature Flags (momoto-core)
- `serde` - Serialization support
- `webgpu` - WebGPU backend (stub)
- `internals` - Expose transformation matrices
- `experimental` - Experimental features

---

## DOMAIN 2: ACCESSIBILITY METRICS

### Crate: `momoto-metrics`

| Capability | Type | Status | WASM | Location |
|-----------|------|--------|------|----------|
| WCAG metric creation | `WCAGMetric::new()` | ✅ Stable | ✅ | wcag/mod.rs |
| WCAG evaluate | `WCAGMetric::evaluate()` | ✅ Stable | ✅ | wcag/mod.rs |
| WCAG batch evaluate | `WCAGMetric::evaluate_batch()` | ✅ Stable | ✅ | wcag/mod.rs |
| WCAG passes check | `WCAGMetric::passes()` | ✅ Stable | ✅ | wcag/mod.rs |
| WCAG level enum | `WCAGLevel::AA/AAA` | ✅ Stable | ✅ | wcag/mod.rs |
| Text size enum | `TextSize::Normal/Large` | ✅ Stable | ✅ | wcag/mod.rs |
| WCAG requirements | `WCAG_REQUIREMENTS` | ✅ Stable | ❌ | wcag/mod.rs |
| APCA metric creation | `APCAMetric::new()` | ✅ Stable | ✅ | apca/mod.rs |
| APCA evaluate | `APCAMetric::evaluate()` | ✅ Stable | ✅ | apca/mod.rs |
| APCA batch evaluate | `APCAMetric::evaluate_batch()` | ✅ Stable | ✅ | apca/mod.rs |
| Polarity detection | `PerceptualResult.polarity` | ✅ Stable | ✅ | apca/mod.rs |
| APCA constants | `MAIN_TRC`, `NORM_*`, etc. | ✅ Feature | ❌ | apca/mod.rs |
| SAPC metric | `SAPCMetric` | ❌ Stub | ❌ | sapc/mod.rs |

### Feature Flags (momoto-metrics)
- `internals` - Expose APCA algorithm constants

---

## DOMAIN 3: INTELLIGENT RECOMMENDATIONS

### Crate: `momoto-intelligence`

| Capability | Type | Status | WASM | Location |
|-----------|------|--------|------|----------|
| Usage context enum | `UsageContext` | ✅ Stable | ✅ | context.rs |
| Compliance target enum | `ComplianceTarget` | ✅ Stable | ✅ | context.rs |
| Recommendation context | `RecommendationContext` | ✅ Stable | ✅ | context.rs |
| Body text preset | `RecommendationContext::body_text()` | ✅ Stable | ✅ | context.rs |
| Large text preset | `RecommendationContext::large_text()` | ✅ Stable | ✅ | context.rs |
| Interactive preset | `RecommendationContext::interactive()` | ✅ Stable | ✅ | context.rs |
| Decorative preset | `RecommendationContext::decorative()` | ✅ Stable | ✅ | context.rs |
| Quality scorer | `QualityScorer::new()` | ✅ Stable | ✅ | scoring.rs |
| Score evaluation | `QualityScorer::score()` | ✅ Stable | ✅ | scoring.rs |
| Quality score struct | `QualityScore` | ✅ Stable | ✅ | scoring.rs |
| Assessment text | `QualityScore::assessment()` | ✅ Stable | ✅ | scoring.rs |
| Passes check | `QualityScore::passes()` | ✅ Stable | ✅ | scoring.rs |
| Recommendation engine | `RecommendationEngine` | ✅ Stable | ❌ | recommendation.rs |
| Recommend foreground | `recommend_foreground()` | ✅ Stable | ❌ | recommendation.rs |
| Improve foreground | `improve_foreground()` | ✅ Stable | ❌ | recommendation.rs |
| Modification tracking | `Modification` enum | ✅ Stable | ❌ | recommendation.rs |
| Confidence scoring | Internal | ✅ Stable | N/A | recommendation.rs |

---

## DOMAIN 4: PHYSICAL OPTICS

### Crate: `momoto-materials/glass_physics`

#### 4.1 Fresnel Reflectance

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Schlick approximation | `fresnel_schlick()` | ✅ Stable | ✅ | ✅ |
| Full Fresnel equations | `fresnel_full()` | ✅ Stable | ✅ | ✅ |
| Brewster angle | `brewster_angle()` | ✅ Stable | ✅ | ✅ |
| Edge intensity | `edge_intensity()` | ✅ Stable | ✅ | ✅ |
| Fresnel gradient | `generate_fresnel_gradient()` | ✅ Stable | ✅ | ✅ |
| Fresnel LUT | `FresnelLUT` | ✅ Stable | ✅ | ❌ |
| Fast Fresnel | `fresnel_fast()` | ✅ Stable | ✅ | ✅ |

#### 4.2 Blinn-Phong Specular

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Specular calculation | `blinn_phong_specular()` | ✅ Stable | ✅ | ✅ |
| Highlight position | `calculate_highlight_position()` | ✅ Stable | ✅ | ❌ |
| Specular layers | `calculate_specular_layers()` | ✅ Stable | ✅ | ❌ |
| Roughness to shininess | `roughness_to_shininess()` | ✅ Stable | ✅ | ✅ |
| CSS highlight | `to_css_specular_highlight()` | ✅ Stable | ✅ | ✅ |

#### 4.3 Thin-Film Interference

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| ThinFilm struct | `ThinFilm` | ✅ Stable | ✅ | ✅ |
| ThinFilmStack | `ThinFilmStack` | ✅ Stable | ✅ | ❌ |
| Film to RGB | `thin_film_to_rgb()` | ✅ Stable | ✅ | ✅ |
| Iridescent gradient | `to_css_iridescent_gradient()` | ✅ Stable | ✅ | ✅ |
| Soap bubble CSS | `to_css_soap_bubble()` | ✅ Stable | ✅ | ✅ |
| Oil slick CSS | `to_css_oil_slick()` | ✅ Stable | ✅ | ✅ |
| AR coating thickness | `ar_coating_thickness()` | ✅ Stable | ✅ | ❌ |
| Dominant wavelength | `dominant_wavelength()` | ✅ Stable | ✅ | ❌ |
| Transfer matrix film | `TransferMatrixFilm` | ✅ Stable | ❌ | ✅ |
| Film layer | `FilmLayer` | ✅ Stable | ❌ | ✅ |

#### 4.4 Chromatic Dispersion

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Cauchy model | `CauchyDispersion` | ✅ Stable | ✅ | ✅ |
| Sellmeier model | `SellmeierDispersion` | ✅ Stable | ✅ | ✅ |
| Dispersion trait | `Dispersion` | ✅ Stable | ✅ | ❌ |
| f0 from IOR | `f0_from_ior()` | ✅ Stable | ✅ | ❌ |
| f0 RGB | `f0_rgb()` | ✅ Stable | ✅ | ❌ |
| Chromatic aberration | `chromatic_aberration_strength()` | ✅ Stable | ✅ | ❌ |

#### 4.5 Complex IOR (Metals)

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Complex number | `Complex` | ✅ Stable | ✅ | ❌ |
| ComplexIOR | `ComplexIOR` | ✅ Stable | ✅ | ✅ |
| SpectralComplexIOR | `SpectralComplexIOR` | ✅ Stable | ✅ | ✅ |
| Conductor Fresnel | `fresnel_conductor()` | ✅ Stable | ✅ | ❌ |
| Unpolarized conductor | `fresnel_conductor_unpolarized()` | ✅ Stable | ✅ | ❌ |
| Schlick conductor | `fresnel_conductor_schlick()` | ✅ Stable | ✅ | ❌ |
| Metal presets | `metals::gold()`, etc. | ✅ Stable | ✅ | ✅ |
| Metallic gradient | `to_css_metallic_gradient()` | ✅ Stable | ✅ | ❌ |

#### 4.6 Mie Scattering

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| MieParams | `MieParams` | ✅ Stable | ✅ | ✅ |
| MieLUT | `MieLUT` | ✅ Stable | ✅ | ❌ |
| Rayleigh phase | `rayleigh_phase()` | ✅ Stable | ✅ | ❌ |
| Rayleigh efficiency | `rayleigh_efficiency()` | ✅ Stable | ✅ | ❌ |
| Rayleigh RGB | `rayleigh_intensity_rgb()` | ✅ Stable | ✅ | ❌ |
| Mie asymmetry g | `mie_asymmetry_g()` | ✅ Stable | ✅ | ❌ |
| Mie efficiencies | `mie_efficiencies()` | ✅ Stable | ✅ | ❌ |
| Fast Mie | `mie_fast()` | ✅ Stable | ✅ | ❌ |
| Particle Mie | `mie_particle()` | ✅ Stable | ✅ | ❌ |
| Particle RGB | `mie_particle_rgb()` | ✅ Stable | ✅ | ❌ |
| DynamicMieParams | `DynamicMieParams` | ✅ Stable | ❌ | ✅ |

#### 4.7 Scattering Phase Functions

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Henyey-Greenstein | `henyey_greenstein()` | ✅ Stable | ✅ | ❌ |
| Fast H-G | `hg_fast()` | ✅ Stable | ✅ | ❌ |
| Double H-G | `double_henyey_greenstein()` | ✅ Stable | ✅ | ❌ |
| H-G LUT | `HenyeyGreensteinLUT` | ✅ Stable | ✅ | ❌ |
| Scattering params | `ScatteringParams` | ✅ Stable | ✅ | ❌ |
| Sample H-G | `sample_hg()` | ✅ Stable | ✅ | ❌ |

#### 4.8 Unified BSDF

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| BSDF trait | `BSDF` | ✅ Stable | ✅ | ❌ |
| BSDF context | `BSDFContext` | ✅ Stable | ✅ | ❌ |
| BSDF response | `BSDFResponse` | ✅ Stable | ✅ | ❌ |
| BSDF sample | `BSDFSample` | ✅ Stable | ✅ | ❌ |
| Energy validation | `EnergyValidation` | ✅ Stable | ✅ | ❌ |
| Dielectric BSDF | `DielectricBSDF` | ✅ Stable | ✅ | ❌ |
| Conductor BSDF | `ConductorBSDF` | ✅ Stable | ✅ | ❌ |
| Thin-film BSDF | `ThinFilmBSDF` | ✅ Stable | ✅ | ❌ |
| Layered BSDF | `LayeredBSDF` | ✅ Stable | ✅ | ❌ |
| Lambertian BSDF | `LambertianBSDF` | ✅ Stable | ✅ | ❌ |
| RGB evaluation | `bsdf_evaluate_rgb()` | ✅ Stable | ✅ | ❌ |
| Spectral evaluation | `bsdf_evaluate_spectral()` | ✅ Stable | ✅ | ❌ |
| Energy validation | `bsdf_validate_energy()` | ✅ Stable | ✅ | ❌ |

#### 4.9 Anisotropic BRDF

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Anisotropic GGX | `AnisotropicGGX` | ✅ Stable | ✅ | ❌ |
| Anisotropic conductor | `AnisotropicConductor` | ✅ Stable | ✅ | ❌ |
| Fiber BSDF | `FiberBSDF` | ✅ Stable | ✅ | ❌ |
| Anisotropy strength | `anisotropy_strength()` | ✅ Stable | ✅ | ❌ |
| Strength to alphas | `strength_to_alphas()` | ✅ Stable | ✅ | ❌ |

#### 4.10 Subsurface Scattering

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| SSS params | `SubsurfaceParams` | ✅ Stable | ✅ | ❌ |
| Diffusion BSSRDF | `DiffusionBSSRDF` | ✅ Stable | ✅ | ❌ |
| SSS BSDF | `SubsurfaceBSDF` | ✅ Stable | ✅ | ❌ |
| SSS presets | `sss_presets` | ✅ Stable | ✅ | ❌ |

#### 4.11 Spectral Pipeline

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Spectral signal | `SpectralSignal` | ✅ Stable | ❌ | ✅ |
| Spectral pipeline | `SpectralPipeline` | ✅ Stable | ❌ | ✅ |
| Evaluation context | `EvaluationContext` | ✅ Stable | ❌ | ✅ |

---

## DOMAIN 5: MATERIAL CHARACTERIZATION

### 5.1 Material Twins

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Twin ID | `TwinId` | ✅ Stable | ✅ | ❌ |
| Material twin | `MaterialTwin` | ✅ Stable | ✅ | ❌ |
| Twin builder | `TwinBuilder` | ✅ Stable | ✅ | ❌ |
| Calibration metadata | `CalibrationMetadata` | ✅ Stable | ✅ | ❌ |
| Calibration quality | `CalibrationQuality` | ✅ Stable | ✅ | ❌ |
| Twin variant | `TwinVariant` | ✅ Stable | ✅ | ❌ |
| Static twin data | `StaticTwinData` | ✅ Stable | ✅ | ❌ |
| Temporal twin data | `TemporalTwinData` | ✅ Stable | ✅ | ❌ |
| Layered twin data | `LayeredTwinData` | ✅ Stable | ✅ | ❌ |
| Measured twin data | `MeasuredTwinData` | ✅ Stable | ✅ | ❌ |
| Spectral identity | `SpectralIdentity` | ✅ Stable | ✅ | ❌ |
| Spectral signature | `SpectralSignature` | ✅ Stable | ✅ | ❌ |
| Spectral distance | `SpectralDistance` | ✅ Stable | ✅ | ❌ |

### 5.2 Calibration

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Calibration source | `CalibrationSource` | ✅ Stable | ✅ | ❌ |
| BRDF source | `BRDFSource` | ✅ Stable | ✅ | ❌ |
| Spectral source | `SpectralSource` | ✅ Stable | ✅ | ❌ |
| Time-series source | `TimeSeriesSource` | ✅ Stable | ✅ | ❌ |
| Combined source | `CombinedSource` | ✅ Stable | ✅ | ❌ |
| BRDF observation | `BRDFObservation` | ✅ Stable | ✅ | ❌ |
| Spectral observation | `SpectralObservation` | ✅ Stable | ✅ | ❌ |
| Temporal observation | `TemporalObservation` | ✅ Stable | ✅ | ❌ |
| Loss components | `LossComponents` | ✅ Stable | ✅ | ❌ |
| Aggregated loss | `AggregatedLoss` | ✅ Stable | ✅ | ❌ |
| Loss aggregator | `LossAggregator` | ✅ Stable | ✅ | ❌ |

### 5.3 Uncertainty

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Covariance matrix | `ParameterCovarianceMatrix` | ✅ Stable | ✅ | ❌ |
| Covariance estimator | `CovarianceEstimator` | ✅ Stable | ✅ | ❌ |
| Fisher information | `FisherInformationMatrix` | ✅ Stable | ✅ | ❌ |
| Fisher estimator | `FisherInformationEstimator` | ✅ Stable | ✅ | ❌ |
| Bootstrap config | `BootstrapConfig` | ✅ Stable | ✅ | ❌ |
| Bootstrap resampler | `BootstrapResampler` | ✅ Stable | ✅ | ❌ |
| Bootstrap result | `BootstrapResult` | ✅ Stable | ✅ | ❌ |
| Confidence interval | `ConfidenceInterval` | ✅ Stable | ✅ | ❌ |
| Twin confidence report | `TwinConfidenceReport` | ✅ Stable | ✅ | ❌ |
| Confidence warning | `ConfidenceWarning` | ✅ Stable | ✅ | ❌ |
| Confidence level | `ConfidenceLevel` | ✅ Stable | ✅ | ❌ |
| Parameter uncertainty | `ParameterUncertainty` | ✅ Stable | ✅ | ❌ |

### 5.4 Metrology

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Unit type | `Unit` | ✅ Stable | ✅ | ❌ |
| Unit value | `UnitValue` | ✅ Stable | ✅ | ❌ |
| Measurement | `Measurement` | ✅ Stable | ✅ | ❌ |
| Measurement ID | `MeasurementId` | ✅ Stable | ✅ | ❌ |
| Measurement array | `MeasurementArray` | ✅ Stable | ✅ | ❌ |
| Uncertainty | `Uncertainty` | ✅ Stable | ✅ | ❌ |
| Measurement quality | `MeasurementQuality` | ✅ Stable | ✅ | ❌ |
| Measurement source | `MeasurementSource` | ✅ Stable | ✅ | ❌ |
| Traceability chain | `TraceabilityChain` | ✅ Stable | ✅ | ❌ |
| Traceability entry | `TraceabilityEntry` | ✅ Stable | ✅ | ❌ |
| Traceability operation | `TraceabilityOperation` | ✅ Stable | ✅ | ❌ |
| Tolerance budget | `ToleranceBudget` | ✅ Stable | ✅ | ❌ |
| Tolerance component | `ToleranceComponent` | ✅ Stable | ✅ | ❌ |
| Tolerance category | `ToleranceCategory` | ✅ Stable | ✅ | ❌ |

### 5.5 Virtual Instruments

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Gonioreflectometer | `VirtualGonioreflectometer` | ✅ Stable | ✅ | ❌ |
| Goniometer result | `GoniometerResult` | ✅ Stable | ✅ | ❌ |
| Spectrophotometer | `VirtualSpectrophotometer` | ✅ Stable | ✅ | ❌ |
| Spectro result | `SpectroResult` | ✅ Stable | ✅ | ❌ |
| Spectro geometry | `SpectroGeometry` | ✅ Stable | ✅ | ❌ |
| Ellipsometer | `VirtualEllipsometer` | ✅ Stable | ✅ | ❌ |
| Ellipsometry result | `EllipsometryResult` | ✅ Stable | ✅ | ❌ |
| Thin-film result | `ThinFilmResult` | ✅ Stable | ✅ | ❌ |

### 5.6 Certification

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Certification level | `CertificationLevel` | ✅ Stable | ✅ | ❌ |
| Certification metrics | `CertificationMetrics` | ✅ Stable | ✅ | ❌ |
| Level requirements | `LevelRequirements` | ✅ Stable | ✅ | ❌ |
| Certification auditor | `CertificationAuditor` | ✅ Stable | ✅ | ❌ |
| Material audit data | `MaterialAuditData` | ✅ Stable | ✅ | ❌ |
| Certification result | `CertificationResult` | ✅ Stable | ✅ | ❌ |
| Can achieve level | `can_achieve_level()` | ✅ Stable | ✅ | ❌ |
| Highest level | `highest_level()` | ✅ Stable | ✅ | ❌ |
| Quick certify | `quick_certify_experimental()` | ✅ Stable | ✅ | ❌ |

---

## DOMAIN 6: MACHINE LEARNING

### 6.1 Differentiable Rendering

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Differentiable BSDF | `DifferentiableBSDF` | ✅ Stable | ✅ | ❌ |
| Differentiable response | `DifferentiableResponse` | ✅ Stable | ✅ | ❌ |
| Parameter gradients | `ParameterGradients` | ✅ Stable | ✅ | ❌ |
| Gradient config | `GradientConfig` | ✅ Stable | ✅ | ❌ |
| Gradient verification | `GradientVerification` | ✅ Stable | ✅ | ❌ |
| Diff. dielectric | `DifferentiableDielectric` | ✅ Stable | ✅ | ❌ |
| Diff. conductor | `DifferentiableConductor` | ✅ Stable | ✅ | ❌ |
| Diff. thin-film | `DifferentiableThinFilm` | ✅ Stable | ✅ | ❌ |
| Diff. layered | `DifferentiableLayered` | ✅ Stable | ✅ | ❌ |
| Layer config | `LayerConfig` | ✅ Stable | ✅ | ❌ |
| Jacobian | `Jacobian` | ✅ Stable | ✅ | ❌ |
| Jacobian builder | `JacobianBuilder` | ✅ Stable | ✅ | ❌ |

### 6.2 Inverse Material Solver

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Inverse solver | `InverseMaterialSolver` | ✅ Stable | ✅ | ❌ |
| Solver config | `InverseSolverConfig` | ✅ Stable | ✅ | ❌ |
| Inverse result | `InverseResult` | ✅ Stable | ✅ | ❌ |
| Convergence reason | `ConvergenceReason` | ✅ Stable | ✅ | ❌ |
| Reference data | `ReferenceData` | ✅ Stable | ✅ | ❌ |
| Reference observation | `ReferenceObservation` | ✅ Stable | ✅ | ❌ |
| Loss function | `LossFunction` | ✅ Stable | ✅ | ❌ |
| IOR recovery | `recover_ior_from_normal_reflectance()` | ✅ Stable | ✅ | ❌ |
| Roughness recovery | `recover_roughness_from_glossiness()` | ✅ Stable | ✅ | ❌ |

### 6.3 Neural Correction (NOT EXPOSED)

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Neural MLP | `NeuralCorrectionMLP` | ⚠️ Exp | ❌ | ❌ |
| Correction input | `CorrectionInput` | ⚠️ Exp | ❌ | ❌ |
| Correction output | `CorrectionOutput` | ⚠️ Exp | ❌ | ❌ |
| Neural BSDF | `NeuralCorrectedBSDF` | ⚠️ Exp | ❌ | ❌ |
| Constraint type | `NeuralConstraintType` | ⚠️ Exp | ❌ | ❌ |
| Constraint config | `ConstraintConfig` | ⚠️ Exp | ❌ | ❌ |
| Constraint validator | `ConstraintValidator` | ⚠️ Exp | ❌ | ❌ |
| Training sample | `TrainingSample` | ⚠️ Exp | ❌ | ❌ |
| Training dataset | `TrainingDataset` | ⚠️ Exp | ❌ | ❌ |
| Training pipeline | `TrainingPipeline` | ⚠️ Exp | ❌ | ❌ |
| Training config | `TrainingConfig` | ⚠️ Exp | ❌ | ❌ |
| Training result | `TrainingResult` | ⚠️ Exp | ❌ | ❌ |

### 6.4 Perceptual Loss

| Capability | Type | Status | Root Export | WASM |
|-----------|------|--------|-------------|------|
| Lab color | `LabColor` | ✅ Stable | ✅ | ❌ |
| XYZ color | `XyzColor` | ✅ Stable | ✅ | ❌ |
| Illuminant | `Illuminant` | ✅ Stable | ✅ | ❌ |
| Delta E formula | `DeltaEFormula` | ✅ Stable | ✅ | ❌ |
| Perceptual loss config | `PerceptualLossConfig` | ✅ Stable | ✅ | ❌ |
| RGB to XYZ | `rgb_to_xyz()` | ✅ Stable | ✅ | ✅ |
| XYZ to RGB | `xyz_to_rgb()` | ✅ Stable | ✅ | ✅ |
| XYZ to LAB | `xyz_to_lab()` | ✅ Stable | ✅ | ❌ |
| LAB to XYZ | `lab_to_xyz()` | ✅ Stable | ✅ | ❌ |
| RGB to LAB | `rgb_to_lab()` | ✅ Stable | ✅ | ✅ |
| LAB to RGB | `lab_to_rgb()` | ✅ Stable | ✅ | ✅ |
| Delta E 76 | `delta_e_76()` | ✅ Stable | ✅ | ✅ |
| Delta E 94 | `delta_e_94()` | ✅ Stable | ✅ | ❌ |
| Delta E 2000 | `delta_e_2000()` | ✅ Stable | ✅ | ✅ |
| Perceptual loss | `perceptual_loss()` | ✅ Stable | ✅ | ❌ |
| Loss gradient | `perceptual_loss_gradient()` | ✅ Stable | ✅ | ❌ |

---

## DOMAIN 7: AI DECISION INFRASTRUCTURE

### Location: `application/` and `domain/`

| Capability | Type | Status | Export | WASM |
|-----------|------|--------|--------|------|
| AI action contract | `AIActionContract` | ✅ Stable | TS | ❌ |
| Constraint generator | `ConstraintGenerator` | ✅ Stable | TS | ❌ |
| Contract schema | `ContractSchema` | ✅ Stable | TS | ❌ |
| Governance engine | `GovernanceEngine` | ✅ Stable | TS | ❌ |
| Policy registry | `PolicyRegistry` | ✅ Stable | TS | ❌ |
| Conformance engine | `ConformanceEngine` | ✅ Stable | TS | ❌ |
| Plugin manager | `PluginManager` | ⚠️ Beta | TS | ❌ |
| Contrast decision | `ContrastDecision` | ✅ Stable | TS | ❌ |
| Decision engine | `ContrastDecisionEngine` | ✅ Stable | TS | ❌ |

---

## STATISTICS SUMMARY

| Category | Total Types | Root Exported | WASM Exposed | Coverage |
|----------|-------------|---------------|--------------|----------|
| Core Color | 28 | 22 | 16 | 57% WASM |
| Metrics | 15 | 14 | 10 | 71% WASM |
| Intelligence | 15 | 12 | 8 | 53% WASM |
| Physics | 120+ | 85+ | 30+ | 25% WASM |
| Characterization | 80+ | 75+ | 0 | 0% WASM |
| ML/Neural | 35+ | 25+ | 0 | 0% WASM |
| AI Decision | 15 | 15 (TS) | 0 | 0% WASM |
| **TOTAL** | **308+** | **248+** | **64+** | **21% WASM** |

---

## RECOMMENDATIONS

### Critical Gaps to Address

1. **`Color.with_alpha()`** - Alpha manipulation missing from WASM
2. **BSDF system** - Not exposed to WASM despite being production-ready
3. **Material twins** - Not exposed to WASM
4. **Perceptual loss** - Partial WASM exposure
5. **Scientific validation** - Reference data not exposed

### Documentation Priorities

1. Physics module documentation (90+ modules undocumented)
2. Material twin workflow guide
3. Certification process documentation
4. Neural correction limitations
5. WASM memory management guide

---

*Generated by systematic capability inventory of Momoto v5.0.0*
