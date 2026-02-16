# Momoto WASM Bridge — Discovery Table

## Legend

| Symbol | Meaning |
|--------|---------|
| **PC** | Pure Compute (stateless math, O(1) or O(n)) |
| **DS** | Data Structure (struct/enum, state container) |
| **HP** | Heavy Physics (optics, spectral, iterative) |
| **OR** | Orchestration (pipeline, workflow, scheduling) |
| **EV** | Event/IO (streaming, subscriptions, side-effects) |
| **CLI** | CLI-only (skip — not applicable to WASM) |

| Expose? | Meaning |
|---------|---------|
| `ALREADY` | Already has `#[wasm_bindgen]` in momoto-wasm |
| `YES` | Must expose — high value |
| `YES-BATCH` | Must expose with batch API |
| `WRAP` | Expose via wrapper (trait/generic can't bind directly) |
| `SKIP` | Internal/CLI — not useful in WASM |

---

## 1. MOMOTO-CORE

| Item | Type | Category | Expose? | Notes |
|------|------|----------|---------|-------|
| `Color` | struct | DS | ALREADY | from_srgb8, from_hex, to_hex, lighten, darken, saturate, desaturate, with_alpha |
| `Color::from_srgb` | fn | PC | YES | f64 inputs (0.0-1.0), currently only u8 exposed |
| `Color::from_linear` | fn | PC | YES | Linear RGB input |
| `Color::to_srgb8` | fn | PC | YES | Returns [u8; 3] |
| `Color::to_oklch` | fn | PC | ALREADY | Via OKLCH::from_color |
| `Color::from_oklch` | fn | PC | ALREADY | Via OKLCH::to_color |
| `OKLCH` | struct | DS | ALREADY | Full OKLCH with operations |
| `OKLCH::estimate_max_chroma` | fn | PC | YES | Gamut boundary estimation |
| `OKLCH::is_in_gamut` | fn | PC | YES | sRGB gamut check |
| `OKLCH::clamp_to_gamut` | fn | PC | YES | Fast clamp |
| `OKLCH::with_lightness/chroma/hue` | fn | PC | YES | Immutable setters |
| `OKLCH::is_similar_to` | fn | PC | YES | Threshold-based comparison |
| `OKLab` | struct | DS | **YES** | Cartesian perceptual space — needed for interpolation |
| `OKLab::from_color` | fn | PC | **YES** | Color → OKLab |
| `OKLab::to_color` | fn | PC | **YES** | OKLab → Color |
| `HuePath` | enum | DS | ALREADY | As string param ("shorter"/"longer") |
| `RelativeLuminance` | struct | DS | **YES** | Newtype for luminance values |
| `relative_luminance_srgb` | fn | PC | **YES** | WCAG luminance |
| `relative_luminance_apca` | fn | PC | **YES** | APCA luminance |
| `soft_clamp` | fn | PC | **YES** | APCA soft-clamp |
| `srgb_to_linear` | fn | PC | **YES** | Gamma decoding |
| `linear_to_srgb` | fn | PC | **YES** | Gamma encoding |
| `clamp` | fn | PC | SKIP | Trivial math |
| `lerp` | fn | PC | **YES** | Useful for interpolation |
| `inverse_lerp` | fn | PC | **YES** | Useful for normalization |
| `GlassMaterial` | struct | DS | ALREADY | Full glass material |
| `GlassMaterialBuilder` | struct | DS | ALREADY | Builder pattern |
| `LinearRgba` | struct | DS | **YES** | Linear color for physics |
| `LinearRgba::from_oklch` | fn | PC | **YES** | OKLCH → linear RGBA |
| `EvaluatedMaterial` | struct | DS | ALREADY | Partial — missing fields |
| `EvaluatedMaterial::is_transparent` | fn | PC | **YES** | Opacity check |
| `EvaluatedMaterial::has_scattering` | fn | PC | **YES** | Scattering check |
| `EvaluatedMaterial::is_emissive` | fn | PC | **YES** | Emission check |
| `EvaluatedMaterial::effective_specular` | fn | PC | **YES** | Derived specular |
| `ClearCoatProperties` | struct | DS | **YES** | For advanced materials |
| `IridescenceProperties` | struct | DS | **YES** | For thin-film integration |
| `NoiseProperties` | struct | DS | **YES** | For frosted effects |
| `MaterialType` | enum | DS | **YES** | Glass/Metal/Plastic/Liquid/Custom |
| `MaterialContext` (core) | struct | DS | ALREADY | Partially via EvalMaterialContext |
| `MaterialContext::compute_hash` | fn | PC | **YES** | Cache key generation |
| `Evaluable` | trait | OR | WRAP | Can't bind trait — wrap with free fn |
| `PerceptualResult` | struct | DS | ALREADY | Via ContrastResult |
| `Polarity` | enum | DS | ALREADY | DarkOnLight/LightOnDark |
| `ContrastMetric` | trait | OR | WRAP | Wrap implementations |
| `RenderBackend` | trait | OR | SKIP | Backend internal |
| `CssBackend` | struct | OR | ALREADY | render() exposed |
| `CssRenderConfig` | struct | DS | **YES** | Premium/minimal/modal presets |
| `RenderContext` | struct | DS | ALREADY | Desktop/mobile/4K |
| `BackendCapabilities` | struct | DS | SKIP | Internal |
| `PerformanceCharacteristics` | struct | DS | SKIP | Internal |
| `ColorSpace` | enum | DS | **YES** | SRgb/DisplayP3/Rec2020/LinearRgb |
| `TargetMedium` | enum | DS | **YES** | Screen/Print/Projection |
| `AccessibilityMode` | enum | DS | **YES** | HighContrast/ReducedMotion/etc |
| `RenderError` | enum | DS | SKIP | Internal error type |
| `ColorBackend` | trait | OR | SKIP | Internal |
| `CpuBackend` | struct | OR | SKIP | Internal impl |
| `WebGpuBackend` | struct | OR | SKIP | Feature-gated, future |
| `RGB_TO_LMS` | const | PC | SKIP | Internal matrix |
| `LMS_TO_LAB` | const | PC | SKIP | Internal matrix |
| `GAMUT_COEFFICIENTS` | const | PC | **YES** | Gamut boundary data |

**Summary: momoto-core**
- Already exposed: 15 items
- To expose: 28 items
- Skip: 12 items

---

## 2. MOMOTO-METRICS

| Item | Type | Category | Expose? | Notes |
|------|------|----------|---------|-------|
| `WCAGMetric` | struct | PC | ALREADY | evaluate() + evaluate_batch() |
| `WCAGMetric::new` | fn | PC | ALREADY | Constructor |
| `WCAGMetric::passes` | fn | PC | **YES** | Static: (ratio, level, size) → bool |
| `WCAGMetric::level` | fn | PC | **YES** | ratio → Option<WCAGLevel> |
| `WCAGMetric::is_large_text` | fn | PC | **YES** | (font_size_px, font_weight) → bool |
| `WCAGMetric::calculate_ratio` | fn | PC | **YES** | Direct ratio without PerceptualResult |
| `WCAGLevel` | enum | DS | **YES** | AA / AAA |
| `WCAGLevel::requirement` | fn | PC | **YES** | (level, text_size) → f64 |
| `TextSize` | enum | DS | **YES** | Normal / Large |
| `WCAG_REQUIREMENTS` | const | DS | **YES** | [[4.5, 3.0], [7.0, 4.5]] |
| `APCAMetric` | struct | PC | ALREADY | evaluate() + evaluate_batch() |
| `APCAMetric::new` | fn | PC | ALREADY | Constructor |
| `APCA constants` | const | PC | **YES** | 16 algorithm constants (feature-gated) |
| `SAPCMetric` | struct | PC | SKIP | Placeholder — not implemented |

**Summary: momoto-metrics**
- Already exposed: 4 items
- To expose: 10 items
- Skip: 1 item

---

## 3. MOMOTO-INTELLIGENCE

| Item | Type | Category | Expose? | Notes |
|------|------|----------|---------|-------|
| `UsageContext` | enum | DS | ALREADY | 6 variants |
| `UsageContext::min_wcag_aa` | fn | PC | **YES** | Usage → min ratio |
| `UsageContext::min_wcag_aaa` | fn | PC | **YES** | Usage → min ratio |
| `UsageContext::min_apca_lc` | fn | PC | **YES** | Usage → min Lc |
| `UsageContext::requires_compliance` | fn | PC | **YES** | Decorative → false |
| `ComplianceTarget` | enum | DS | ALREADY | 4 variants |
| `ComplianceTarget::description` | fn | PC | **YES** | Target → &str |
| `RecommendationContext` | struct | DS | ALREADY | Presets exposed |
| `QualityScorer` | struct | PC | ALREADY | score() exposed |
| `QualityScore` | struct | DS | ALREADY | 4 fields |
| `QualityScore::assessment` | fn | PC | **YES** | Score → grade string |
| `Recommendation` | struct | DS | **YES** | color + score + confidence + reason |
| `Modification` | enum | DS | **YES** | Lightness/Chroma/Hue/Combined/None |
| `RecommendationEngine` | struct | PC | **YES** | Main recommendation pipeline |
| `RecommendationEngine::recommend_foreground` | fn | PC | **YES** | bg → recommended fg |
| `RecommendationEngine::improve_foreground` | fn | PC | **YES** | (fg, bg) → improved fg |
| `ExplanationGenerator` | struct | DS | **YES** | Human-readable explanations |
| `ExplanationGenerator::generate_contrast_improvement` | fn | PC | **YES** | Full explanation |
| `ExplanationGenerator::generate_quality_improvement` | fn | PC | **YES** | Full explanation |
| `ExplanationGenerator::generate_from_advanced_score` | fn | PC | **YES** | Full explanation |
| `RecommendationExplanation` | struct | DS | **YES** | summary + reasoning + technical |
| `ReasoningPoint` | struct | DS | **YES** | category + explanation + importance |
| `TechnicalDetails` | struct | DS | **YES** | Before/after metrics |
| `OklchChanges` | struct | DS | **YES** | deltaL, deltaC, deltaH |
| `ExplanationBuilder` | struct | DS | **YES** | Fluent API |
| `AdvancedScore` | struct | DS | **YES** | quality + impact + effort + confidence |
| `AdvancedScore::recommendation_strength` | fn | PC | **YES** | Derived metric |
| `AdvancedScore::priority_assessment` | fn | PC | **YES** | → PriorityAssessment |
| `PriorityAssessment` | enum | DS | **YES** | Critical/High/Medium/Low |
| `ScoreBreakdown` | struct | DS | **YES** | impact + effort + confidence components |
| `ScoreComponent` | struct | DS | **YES** | name + value + weight |
| `ImpactWeights` | struct | DS | **YES** | 5 weight factors |
| `ImpactCalculator` | struct | PC | **YES** | calculate_impact(), calculate_recommendation_impact() |
| `EffortEstimator` | struct | PC | **YES** | estimate_color_change(), estimate_recommendation() |
| `EffortLevel` | enum | DS | **YES** | Trivial/Easy/Moderate/Significant/Major |
| `ConfidenceCalculator` | struct | PC | **YES** | calculate_confidence() + record_outcome() |
| `HistoricalOutcome` | struct | DS | **YES** | Tracks accept/success rates |
| `AdvancedScorer` | struct | PC | **YES** | score_recommendation() |
| `StepSelector` | struct | OR | **YES** | Adaptive pipeline step selection |
| `StepRecommendation` | struct | DS | **YES** | step_type + confidence + reasoning |
| `GoalTracker` | struct | OR | **YES** | progress(), gap(), estimated_steps_remaining() |
| `StepScoringModel` | struct | OR | **YES** | Effectiveness learning |
| `CostEstimator` | struct | OR | **YES** | estimate(), estimate_sequential(), estimate_parallel() |
| `CostEstimate` | struct | DS | **YES** | cpu_time + memory + io + complexity |
| `CostModel` | struct | DS | **YES** | Base costs + per-color scaling |
| `CostBudget` | struct | DS | **YES** | Max constraints |
| `CostFactors` | struct | DS | **YES** | color_count + spectral + neural + material |
| `BranchEvaluator` | struct | OR | **YES** | Conditional branching |
| `BranchCondition` | enum | DS | **YES** | Threshold/Boolean/And/Or/Not/AllPassed/AnyFailed |
| `ComparisonOp` | enum | DS | **YES** | Gt/Gte/Lt/Lte/Eq/Ne |
| `Branch` | struct | DS | **YES** | id + condition + steps + priority |
| `ConvergenceDetector` | struct | OR | **YES** | update() → ConvergenceStatus |
| `ConvergenceStatus` | enum | DS | **YES** | Converging/Converged/Oscillating/Diverging/Stalled |
| `ConvergenceConfig` | struct | DS | **YES** | Thresholds + presets (fast/high_quality/neural) |
| `ConvergenceStats` | struct | DS | **YES** | Summary metrics |

**Summary: momoto-intelligence**
- Already exposed: 7 items
- To expose: 47 items
- Skip: 0 items

---

## 4. MOMOTO-MATERIALS (items NOT already in momoto-wasm)

| Item | Type | Category | Expose? | Notes |
|------|------|----------|---------|-------|
| **Refraction** | | | | |
| `RefractionParams` | struct | HP | **YES** | IOR + distortion + chromatic + edge |
| `RefractionResult` | struct | DS | **YES** | offset_x/y + hue_shift + brightness |
| `RefractionPresets` | struct | DS | **YES** | clear/frosted/thick/subtle/high_index |
| `calculate_refraction` | fn | HP | **YES** | Position-based refraction |
| `apply_refraction_to_color` | fn | HP | **YES** | OKLCH color correction |
| `generate_distortion_map` | fn | HP | **YES-BATCH** | Grid-based distortion |
| **Lighting Model** | | | | |
| `Vec3` (light_model) | struct | DS | ALREADY | In momoto-wasm |
| `LightSource` | struct | DS | **YES** | direction + intensity + color |
| `LightingEnvironment` | struct | DS | **YES** | key + fill + ambient + background |
| `LightingResult` | struct | DS | **YES** | diffuse + specular + total + light_color |
| `calculate_lighting` | fn | HP | **YES** | Full lighting calculation |
| `derive_gradient` | fn | HP | **YES-BATCH** | Multi-sample gradient |
| **Ambient Shadows** | | | | |
| `AmbientShadowParams` | struct | DS | **YES** | opacity + blur + offset + spread + tint |
| `AmbientShadow` | struct | DS | **YES** | color + blur + offset + spread + opacity |
| `AmbientShadowPresets` | struct | DS | **YES** | standard/elevated/subtle/dramatic/colored |
| `calculate_ambient_shadow` | fn | HP | **YES** | Single ambient shadow |
| `calculate_multi_scale_ambient` | fn | HP | **YES-BATCH** | Multi-scale set |
| **Interactive Shadows** | | | | |
| `ElevationTransition` | struct | DS | **YES** | rest/hover/active/focus elevations |
| `InteractiveState` | enum | DS | **YES** | Rest/Hover/Active/Focus |
| `calculate_interactive_shadow` | fn | HP | **YES** | State-aware shadows |
| **Elevation (Material Design)** | | | | |
| `Elevation` (enum version) | enum | DS | **YES** | Level0-5 with dp() + tint_opacity() |
| `MaterialSurface` | struct | DS | **YES** | elevation + tint + glass overlay |
| **Spectral Coherence** | | | | |
| `SpectralPacket` | struct | HP | **YES** | Wavelength band coherence |
| `SpectralPacketBuilder` | struct | HP | **YES** | Fluent construction |
| `CoherenceMetadata` | struct | DS | **YES** | Metadata for packets |
| `WavelengthBand` | struct | DS | **YES** | Band definition |
| `CoherentSampler` | struct | HP | **YES** | Sampling strategies |
| `SamplingStrategy` | enum | DS | **YES** | Strategy selection |
| `SpectralInterpolator` | struct | HP | **YES** | Blend config |
| `FlickerValidator` | struct | HP | **YES** | Frame comparison flicker detection |
| `FlickerConfig` | struct | DS | **YES** | Thresholds |
| `FlickerStatus` | enum | DS | **YES** | Status result |
| `FlickerReport` | struct | DS | **YES** | Full report |
| **Temporal** | | | | |
| `Interpolation` | struct | HP | **YES** | Temporal interpolation |
| `InterpolationMode` | enum | DS | **YES** | Mode selection |
| `RateLimiter` | struct | HP | **YES** | Rate limiting for temporal |
| `ExponentialMovingAverage` | struct | HP | **YES** | EMA smoothing |
| `TemporalBSDF` | struct | HP | **YES** | Time-varying BSDF |
| `TemporalDielectric` | struct | HP | **YES** | Time-varying dielectric |
| `TemporalThinFilm` | struct | HP | **YES** | Time-varying thin film |
| `TemporalConductor` | struct | HP | **YES** | Time-varying conductor |
| **Neural Constraints** | | | | |
| `ConstraintValidator` | struct | HP | **YES** | Physics constraint enforcement |
| `ConstraintConfig` | struct | DS | **YES** | Tolerance config |
| `ConstraintType` | enum | DS | **YES** | EnergyConservation/Reciprocity/etc |
| `RegularizationTerms` | struct | DS | **YES** | Penalty values |
| **Training Dataset** | | | | |
| `TrainingDataset` | struct | HP | **YES** | Synthetic data generation |
| `TrainingSample` | struct | DS | **YES** | Input/output pairs |
| `DatasetSource` | enum | DS | **YES** | Synthetic/MERL/Combined |
| `AugmentationConfig` | struct | DS | **YES** | Jitter/noise config |
| **GPU Backend** | | | | |
| `GpuBackendConfig` | struct | DS | SKIP | Feature-gated (future) |
| `GpuBackendStats` | struct | DS | SKIP | Feature-gated (future) |
| **PBR API v1** | | | | |
| `Material` (PBR) | struct | HP | **YES** | PBR material |
| `Layer` (PBR) | struct | HP | **YES** | Material layer |
| `MaterialBuilder` (PBR) | struct | HP | **YES** | Fluent construction |
| `BSDF` | trait | HP | WRAP | Wrap implementations |
| `BSDFResponse` | struct | DS | **YES** | Evaluation result |
| `BSDFSample` | struct | DS | **YES** | Sample point |
| `EnergyValidation` | struct | DS | **YES** | Conservation check |
| `DielectricBSDF` | struct | HP | **YES** | Glass/transparent |
| `ConductorBSDF` | struct | HP | **YES** | Metal |
| `ThinFilmBSDF` | struct | HP | **YES** | Thin film layer |
| `LayeredBSDF` | struct | HP | **YES** | Multi-layer stack |
| `LambertianBSDF` | struct | HP | **YES** | Diffuse |
| `EvaluationContext` (PBR) | struct | DS | **YES** | Vector3 + angles |
| **Easing** | | | | |
| `smoothstep` | fn | PC | **YES** | Smooth interpolation |
| `smootherstep` | fn | PC | **YES** | Smoother variant |
| `ease_in_out` | fn | PC | **YES** | Standard easing |
| `remap` | fn | PC | **YES** | Range remapping |

**Summary: momoto-materials (missing items only)**
- Already exposed: 1 item (Vec3)
- To expose: 64 items
- Skip: 2 items (GPU backend)

---

## 5. MOMOTO-AGENT

| Item | Type | Category | Expose? | Notes |
|------|------|----------|---------|-------|
| **Core Executor** | | | | |
| `AgentExecutor` | struct | OR | **YES** | Main query/response engine |
| `AgentExecutor::execute` | fn | OR | **YES** | Query → Response |
| `validate` | fn | PC | **YES** | Quick color validation |
| `validate_pair` | fn | PC | **YES** | Quick pair validation |
| `get_metrics` | fn | PC | **YES** | Color → metrics |
| `get_material` | fn | PC | **YES** | Preset → material response |
| `list_materials` | fn | PC | **YES** | Category filter |
| `recommend_foreground` | fn | PC | **YES** | bg → fg recommendation |
| `improve_foreground` | fn | PC | **YES** | (fg, bg) → improved |
| `score_pair` | fn | PC | **YES** | (fg, bg) → quality score |
| **Contract System** | | | | |
| `Contract` | struct | DS | **YES** | Constraint collection |
| `Constraint` | enum | DS | **YES** | MinContrast/InGamut/LightnessRange/etc |
| `ContrastStandard` | enum | DS | **YES** | Wcag/Apca |
| `ComplianceLevel` | enum | DS | **YES** | AA/AAA |
| `Gamut` | enum | DS | **YES** | Srgb/P3/Rec2020 |
| `Version` | struct | DS | **YES** | Major.minor |
| **Query/Response** | | | | |
| `Query` | enum | OR | **YES** | 20+ query variants |
| `Response` | enum | OR | **YES** | 25+ response variants |
| `ValidationResponse` | struct | DS | **YES** | valid + violations + metrics |
| `Violation` | struct | DS | **YES** | constraint + actual + required |
| `ColorMetrics` | struct | DS | **YES** | L/C/H + luminance + contrasts |
| `ErrorResponse` | struct | DS | **YES** | code + message |
| `MaterialResponse` | struct | DS | **YES** | Full material info |
| **Workflow** | | | | |
| `Workflow` | struct | OR | **YES** | Multi-step automation |
| `WorkflowStep` | enum | OR | **YES** | 20+ step types |
| `WorkflowConfig` | struct | DS | **YES** | fail_fast + compliance + context |
| **Session** | | | | |
| `SessionManager` | struct | OR | **YES** | Multi-turn conversation |
| `SessionManagerConfig` | struct | DS | **YES** | max_history + timeout + max_sessions |
| **Experience** | | | | |
| `VisualExperience` | struct | DS | **YES** | Complete theme generation |
| `ExperiencePalette` | struct | DS | **YES** | 10+ semantic colors |
| `ColorSpec` | struct | DS | **YES** | hex + oklch + srgb + contrast |
| `ExperienceMaterials` | struct | DS | **YES** | glass + surface + fresnel |
| `GlassSpec` | struct | DS | **YES** | opacity + blur + border + ior |
| `FresnelSpec` | struct | DS | **YES** | edge_glow + intensity + color |
| `TypographySpec` | struct | DS | **YES** | fonts + sizes + weights |
| **Orchestration** | | | | |
| `IntelligentScheduler` | struct | OR | **YES** | Adaptive scheduling |
| `ResourceTracker` | struct | OR | **YES** | Resource monitoring |
| `ParallelizationAdvisor` | struct | OR | **YES** | Concurrency hints |
| **Temporal** | | | | |
| `ColorSequence` | struct | DS | **YES** | Time-based color animation |
| `ColorTransition` | struct | DS | **YES** | From/to with easing |
| `TemporalColorState` | struct | DS | **YES** | time + oklch |
| `EasingFunction` | enum | DS | **YES** | Linear/EaseIn/EaseOut/EaseInOut/Step |
| **Certification** | | | | |
| `CertificationAuthority` | struct | OR | **YES** | Quality certification |
| `MomotoIdentity` | struct | DS | **YES** | Version + build info |
| **Reporting** | | | | |
| `ReportConfig` | struct | DS | **YES** | Format + type + sections |
| `ReportFormat` | enum | DS | **YES** | Json/Markdown/Html |
| `ReportType` | enum | DS | **YES** | Comprehensive/Accessibility/etc |

**Summary: momoto-agent**
- Already exposed: 0 items
- To expose: 46 items
- Skip: 0 items

---

## 6. MOMOTO-EVENTS

| Item | Type | Category | Expose? | Notes |
|------|------|----------|---------|-------|
| `Event` | struct | EV | **YES** | Core event with id/timestamp/category/payload |
| `EventId` | struct | DS | **YES** | Unique event identifier |
| `EventTimestamp` | struct | DS | **YES** | Millisecond timestamp |
| `EventCategory` | enum | DS | **YES** | Progress/Metrics/Recommendation/Validation/Error/System/Chart/Heartbeat/Custom |
| `EventPriority` | enum | DS | **YES** | Low/Normal/High/Critical |
| `EventPayload` | enum | EV | **YES** | 8 payload variants |
| `ProgressEvent` | struct | EV | **YES** | progress + message + step |
| `MetricEvent` | struct | EV | **YES** | name + value + unit + delta |
| `RecommendationEvent` | struct | EV | **YES** | color + score + confidence |
| `ValidationEvent` | struct | EV | **YES** | passed + violations + suggestions |
| `ValidationViolation` | struct | DS | **YES** | type + severity + description |
| `ChartUpdateEvent` | struct | EV | **YES** | chart_id + data_points |
| `ChartDataPoint` | struct | DS | **YES** | x + y + series + color |
| `HeartbeatEvent` | struct | EV | **YES** | sequence + uptime + connections |
| `SystemEvent` | struct | EV | **YES** | type + description + data |
| `EventBroadcaster` | struct | EV | **YES** | Pub/sub event bus |
| `EventFilter` | struct | DS | **YES** | category/priority/source filters |
| `BroadcasterConfig` | struct | DS | **YES** | buffer_size + max_age |
| `EventHandler` | trait | EV | WRAP | Wrap with closure-based API |
| `EventStream` | struct | EV | **YES** | Streaming event consumption |
| `StreamConfig` | struct | DS | **YES** | batch_size + timeout + filter |
| `StreamState` | enum | DS | **YES** | Active/Paused/Closed |
| `StreamError` | enum | DS | **YES** | QueueOverflow/StreamClosed/SerError |
| `BatchedEvents` | struct | EV | **YES** | Batched event delivery |
| `StreamMessage` | enum | EV | **YES** | Events/StateChange/Error/Ack |
| `StreamStats` | struct | DS | **YES** | pending + total + dropped |
| `Subscription` | struct | EV | **YES** | Unsubscribe handle |
| `SubscriberId` | struct | DS | **YES** | Subscriber identifier |

**Summary: momoto-events**
- Already exposed: 0 items
- To expose: 27 items (1 via wrapper)
- Skip: 0 items

---

## 7. MOMOTO-PRELUDE (Convenience Facades)

| Item | Type | Category | Expose? | Notes |
|------|------|----------|---------|-------|
| `color` | fn | PC | **YES** | Parse hex → Color (convenience) |
| `check_contrast` | fn | PC | **YES** | Quick (fg, bg) → ContrastResult |
| `check_wcag_aa` | fn | PC | **YES** | Quick WCAG AA check |
| `check_wcag_aaa` | fn | PC | **YES** | Quick WCAG AAA check |
| `check_apca` | fn | PC | **YES** | Quick APCA Lc |
| `ContrastResult` (prelude) | struct | DS | **YES** | Simplified contrast result |
| `ViewContext` (prelude) | enum | DS | **YES** | Desktop/Mobile/Display/Print |
| `Glass` (prelude) | struct | DS | **YES** | Simplified glass facade |
| `EvaluatedGlass` (prelude) | struct | DS | **YES** | Evaluated glass result |

**Summary: momoto-prelude**
- Already exposed: 0 items
- To expose: 9 items

---

## GRAND TOTALS

| Crate | Already | To Expose | Skip | Total |
|-------|---------|-----------|------|-------|
| momoto-core | 15 | 28 | 12 | 55 |
| momoto-metrics | 4 | 10 | 1 | 15 |
| momoto-intelligence | 7 | 47 | 0 | 54 |
| momoto-materials (new) | 1 | 64 | 2 | 67 |
| momoto-agent | 0 | 46 | 0 | 46 |
| momoto-events | 0 | 27 | 0 | 27 |
| momoto-prelude | 0 | 9 | 0 | 9 |
| **TOTAL** | **27** | **231** | **15** | **273** |

**Current exposure rate: 27/273 = 9.9%**
**Target exposure rate: 258/273 = 94.5%**
