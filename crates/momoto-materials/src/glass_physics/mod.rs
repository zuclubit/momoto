// Note: Allow unused items in research/experimental modules
// These are reserved for future implementations and advanced use cases
#![allow(dead_code, unused_imports, unused_variables)]

//! # Glass Physics Engine
//!
//! Physical simulation of light interaction with glass materials.
//!
//! This module provides the foundation for realistic glass rendering by modeling:
//! - **Transmittance**: How light passes through glass (Beer-Lambert law)
//! - **Refraction**: How light bends at glass interfaces (Snell's law)
//! - **Lighting**: How light scatters and reflects from surfaces
//!
//! ## Architecture
//!
//! The glass physics engine separates concerns:
//!
//! ```text
//! ┌─────────────────────────────────────────────────┐
//! │          Glass Physics Engine                    │
//! ├─────────────────────────────────────────────────┤
//! │  transmittance.rs  │  Light passing through     │
//! │  refraction.rs     │  Light bending             │
//! │  light_model.rs    │  Light scattering          │
//! └─────────────────────────────────────────────────┘
//!          ↓                   ↓                   ↓
//! ┌─────────────────────────────────────────────────┐
//! │       Material Layers (composition)              │
//! └─────────────────────────────────────────────────┘
//!                      ↓
//! ┌─────────────────────────────────────────────────┐
//! │          Rendering (CSS/Canvas)                  │
//! └─────────────────────────────────────────────────┘
//! ```
//!
//! ## Usage
//!
//! ```rust
//! use momoto_materials::glass_physics::{
//!     transmittance::{OpticalProperties, calculate_multi_layer_transmittance},
//!     refraction_index::{RefractionParams, calculate_refraction},
//!     light_model::{LightingEnvironment, derive_gradient},
//! };
//!
//! // 1. Define glass optical properties
//! let optical = OpticalProperties {
//!     absorption_coefficient: 0.2,
//!     scattering_coefficient: 0.3,
//!     thickness: 1.5,
//!     refractive_index: 1.5,
//! };
//!
//! // 2. Calculate light transmission
//! let layers = calculate_multi_layer_transmittance(&optical, 1.0);
//! println!("Surface: {:.2}%", layers.surface * 100.0);
//! println!("Volume: {:.2}%", layers.volume * 100.0);
//! println!("Substrate: {:.2}%", layers.substrate * 100.0);
//!
//! // 3. Calculate refraction distortion
//! let refraction_params = RefractionParams::default();
//! let refraction = calculate_refraction(&refraction_params, 0.5, 0.5, 30.0);
//!
//! // 4. Generate physics-based gradient
//! let environment = LightingEnvironment::default();
//! let gradient = derive_gradient(&environment, 0.3, 32.0, 10);
//! ```
//!
//! ## Design Philosophy
//!
//! **Perceptual > Physical**: We prioritize perceptual correctness over
//! strict physical accuracy. Real glass physics involves complex phenomena
//! (Fresnel equations, dispersion, caustics) that are expensive to compute
//! and often imperceptible in UI contexts.
//!
//! Instead, we use **simplified physical models** that capture the essential
//! characteristics while remaining fast enough for real-time UI rendering.

pub mod batch; // ✅ NEW - Batch evaluation for 7-10x performance boost
pub mod blinn_phong;
pub mod complex_ior; // ✅ PBR Phase 3 - Complex IOR for metals (Gold, Silver, Copper, etc.)
pub mod context;
pub mod dhg_lut; // ✅ PBR Phase 2 - Double Henyey-Greenstein LUT
pub mod dispersion; // ✅ PBR Phase 1 - Wavelength-dependent IOR (Cauchy, Sellmeier)
pub mod enhanced_presets; // ✅ PBR Phase 1 - Enhanced material presets with new parameters
pub mod fresnel;
pub mod light_model;
pub mod lut; // ✅ NEW - Lookup Tables for 5x performance boost
pub mod mie_lut; // ✅ PBR Phase 3 - Mie scattering approximation for particles
pub mod pbr_validation; // ✅ PBR Phase 1 - Validation tests and benchmarks
pub mod perlin_noise;
pub mod phase2_validation; // ✅ PBR Phase 2 - Comparison benchmarks (DHG vs H-G, Sellmeier vs Cauchy)
pub mod phase3_validation; // ✅ PBR Phase 3 - Complex IOR, Mie, Thin-Film validation
pub mod phase4_validation; // ✅ PBR Phase 4 - Compression, Advanced TF, Temp Metals, Dynamic Mie
pub mod quality_tiers; // ✅ PBR Phase 2 - Quality tier auto-selection (+ Phase 4 extensions)
pub mod refraction_index;

// PBR Phase 4 - Advanced Features
pub mod lut_compression; // ✅ PBR Phase 4 - LUT compression for memory optimization
pub mod thin_film_advanced; // ✅ PBR Phase 4 - Transfer matrix multi-layer thin-film
pub mod metal_temp; // ✅ PBR Phase 4 - Temperature-dependent metal IOR + oxidation
pub mod mie_dynamic; // ✅ PBR Phase 4 - Dynamic Mie with polydisperse/anisotropic scattering
pub mod scattering; // ✅ PBR Phase 1 - Henyey-Greenstein phase function with LUT
pub mod spectral_fresnel; // ✅ PBR Phase 1 - RGB spectral Fresnel evaluation
pub mod thin_film; // ✅ PBR Phase 3 - Thin-film interference for iridescent effects
pub mod transmittance; // ✅ NEW - Formal context system for environment-aware evaluation

// Sprint 6 - Unified Spectral Pipeline
pub mod spectral_pipeline; // ✅ Sprint 6 - End-to-end spectral processing (no RGB intermediate)
#[cfg(test)]
mod spectral_pipeline_validation; // ✅ Sprint 6 - Physical validation tests

// Sprint 7 - Performance Optimization
pub mod spectral_profiling; // ✅ Sprint 7 - Profiling and benchmarking
pub mod spectral_optimization; // ✅ Sprint 7 - Quality tiers and adaptive spectral sampling
pub mod spectral_lut; // ✅ Sprint 7 - LUTs for ΔE < 1 with 10x+ speedup
pub mod spectral_cache; // ✅ Sprint 7 - Deterministic cache for ΔE=0 with O(1) lookup
pub mod spectral_gpu; // ✅ Sprint 7 - GPU/WebGPU batch evaluation foundation

// GGX Microfacet BRDF — Cook-Torrance + Oren-Nayar
pub mod microfacet; // ✅ FASE D - GGX NDF, Smith G2, Cook-Torrance, Oren-Nayar

// Sprint 8 - Scientific Validation
pub mod scientific_validation; // ✅ Sprint 8 - Publication-ready validation vs analytical references

// Re-export commonly used types
pub use transmittance::{
    calculate_multi_layer_transmittance, calculate_transmittance,
    GlassPresets as TransmittancePresets, LayerTransmittance, OpticalProperties,
    TransmittanceResult,
};

pub use refraction_index::{
    apply_refraction_to_color, calculate_refraction, generate_distortion_map, RefractionParams,
    RefractionPresets, RefractionResult,
};

pub use light_model::{
    calculate_lighting, derive_gradient, gradient_to_css, LightSource, LightingEnvironment,
    LightingResult, Vec3,
};

pub use fresnel::{
    brewster_angle, calculate_view_angle, edge_intensity, fresnel_full,
    fresnel_outer_glow_params, fresnel_schlick, generate_fresnel_gradient,
    to_css_fresnel_gradient, to_css_luminous_border,
};

pub use blinn_phong::{
    blinn_phong_specular, calculate_highlight_position, calculate_specular_layers,
    roughness_to_shininess, to_css_inner_glow, to_css_inner_highlight, to_css_secondary_specular,
    to_css_specular_highlight,
};

pub use perlin_noise::{presets as NoisePresets, PerlinNoise};

pub use lut::{beer_lambert_fast, fresnel_fast, total_lut_memory, BeerLambertLUT, FresnelLUT};

pub use batch::{evaluate_batch, BatchEvaluator, BatchMaterialInput, BatchResult};

pub use context::{
    BackgroundContext, ContextPresets, LightingContext, MaterialContext, ViewContext,
};

// PBR Phase 1 - Dispersion models
pub use dispersion::{
    CauchyDispersion, Dispersion, DispersionModel, SellmeierDispersion,
    f0_from_ior, f0_rgb, chromatic_aberration_strength, wavelengths,
};

// PBR Phase 1 - Scattering phase functions
pub use scattering::{
    henyey_greenstein, hg_fast, double_henyey_greenstein,
    HenyeyGreensteinLUT, ScatteringParams, sample_hg,
    presets as scattering_presets,
};

// PBR Phase 1 - Spectral Fresnel
pub use spectral_fresnel::{
    fresnel_rgb, fresnel_rgb_fast, fresnel_rgb_lut,
    edge_intensity_rgb, SpectralFresnelResult, SpectralFresnelLUT,
    to_css_chromatic_fresnel, to_css_chromatic_border,
};

// PBR Phase 1 - Enhanced material presets
pub use enhanced_presets::{
    EnhancedGlassMaterial, QualityTier,
    crown_glass, flint_glass, fused_silica, diamond, frosted_glass,
    opal_glass, polycarbonate, pmma, water, sapphire, ice, milk_glass,
    all_presets, presets_by_quality,
};

// PBR Phase 2 - Double Henyey-Greenstein LUT
pub use dhg_lut::{
    dhg_fast, dhg_preset, scattering_params_for_preset, total_dhg_memory,
    DoubleHGLUT, CompactDHGLUT, DHGPreset,
};

// PBR Phase 2 - Quality Tier System
pub use quality_tiers::{
    select_tier, DeviceCapabilities, MaterialComplexity, QualityConfig,
    TierFeatures, TierMetrics,
};

// PBR Phase 2 - Validation and Benchmarks
pub use phase2_validation::{
    compare_dhg_vs_hg, compare_dhg_lut_vs_direct, compare_sellmeier_vs_cauchy,
    benchmark_quality_tiers, memory_analysis, full_phase2_report,
    ComparisonResult, TierBenchmark,
};

// PBR Phase 3 - Complex IOR for Metals
pub use complex_ior::{
    Complex, ComplexIOR, SpectralComplexIOR,
    fresnel_conductor, fresnel_conductor_unpolarized, fresnel_conductor_schlick,
    to_css_metallic_gradient, to_css_metallic_surface,
    metals,
};

// PBR Phase 3 - Mie Scattering Approximation
pub use mie_lut::{
    MieParams, MieLUT,
    rayleigh_phase, rayleigh_efficiency, rayleigh_intensity_rgb,
    mie_asymmetry_g, mie_phase_hg, mie_efficiencies,
    mie_fast, mie_particle, mie_particle_rgb,
    total_mie_memory,
    particles as mie_particles,
};

// PBR Phase 3 - Thin-Film Interference
pub use thin_film::{
    ThinFilm, ThinFilmStack,
    thin_film_to_rgb, to_css_iridescent_gradient, to_css_soap_bubble, to_css_oil_slick,
    ar_coating_thickness, dominant_wavelength, total_thin_film_memory,
    presets as thin_film_presets,
};

// PBR Phase 3 - Validation and Benchmarks
pub use phase3_validation::{
    compare_complex_vs_dielectric_fresnel, compare_metal_schlick_vs_full,
    compare_mie_lut_vs_direct, compare_rayleigh_vs_mie,
    benchmark_thin_film, validate_thin_film_physics,
    phase3_memory_analysis, full_phase3_report,
    Phase3ComparisonResult, Phase3MemoryAnalysis,
};

// PBR Phase 4 - LUT Compression
pub use lut_compression::{
    CompressedLUT1D, CompressedLUT2D, SparseLUT1D, DeltaEncodedLUT,
    HybridEvaluator, EvaluationMethod, CompressedFresnelLUT, CompressedHGLUT,
    quantize_f32_to_u16, quantize_f32_to_u8,
    dequantize_u16_to_f32, dequantize_u8_to_f32,
    CompressionAnalysis, calculate_memory_savings,
};

// PBR Phase 4 - Advanced Thin-Film (Transfer Matrix)
pub use thin_film_advanced::{
    TransferMatrixFilm, FilmLayer, Matrix2x2,
    advanced_presets as thin_film_advanced_presets,
};

// PBR Phase 4 - Temperature-Dependent Metals
pub use metal_temp::{
    DrudeParams, OxideLayer, TempOxidizedMetal,
    drude_metals, oxides, oxidized_presets,
};

// PBR Phase 4 - Dynamic Mie Scattering
pub use mie_dynamic::{
    SizeDistribution, DynamicMieParams,
    dynamic_presets,
};

// PBR Phase 4 - Validation and Benchmarks
pub use phase4_validation::{
    benchmark_lut_compression, compare_thin_film_methods,
    validate_thin_film_advanced, compare_metal_temperatures,
    validate_oxidation_effects, compare_dynamic_mie_presets,
    validate_polydisperse_scattering, phase4_memory_analysis,
    full_phase4_report,
    CompressionBenchmark, ThinFilmComparisonResult,
    MetalTempResult, DynamicMieResult, Phase4MemoryAnalysis,
};

// PBR Phase 5 - Advanced Features
pub mod differentiable_render; // ✅ PBR Phase 5 - Auto-calibration with differentiable rendering
pub mod thin_film_dynamic; // ✅ PBR Phase 5 - Dynamic thin-film with physical deformations
pub mod metal_oxidation_dynamic; // ✅ PBR Phase 5 - Dynamic metal oxidation with time evolution
pub mod mie_physics; // ✅ PBR Phase 5 - Advanced Mie physics with particle interactions
pub mod phase5_validation; // ✅ PBR Phase 5 - Validation and benchmarks

// PBR Phase 5 - Differentiable Rendering / Auto-Calibration
pub use differentiable_render::{
    MaterialParams, ParamGradient, LossConfig, AutoCalibrator,
    Optimizer, AdamOptimizer, SgdOptimizer,
    fresnel_schlick_diff, beer_lambert_diff, henyey_greenstein_diff,
    thin_film_reflectance_diff, forward_dielectric, forward_thin_film, forward_metal,
    reference_presets,
};

// PBR Phase 5 - Dynamic Thin-Film
pub use thin_film_dynamic::{
    DynamicFilmLayer, DynamicThinFilmStack, HeightMap, SubstrateProperties,
    IridescenceMap,
    dynamic_presets as thin_film_dynamic_presets,
};

// PBR Phase 5 - Dynamic Metal Oxidation
pub use metal_oxidation_dynamic::{
    Element, AlloyComposition, OxidationKinetics, OxidationState,
    OxideStructure, OxideLayerProperties, DynamicOxidizedMetal,
    OxidationSimulation,
    oxidation_presets,
    to_css_oxidized, to_css_oxidation_animation,
};

// PBR Phase 5 - Advanced Mie Physics
pub use mie_physics::{
    Particle, ParticleSpecies, MediumProperties,
    ParticleDynamics, ParticleEnsemble, SizeStatistics,
    ScatteringField, TurbulenceParams,
    henyey_greenstein as hg_phase, ensemble_phase_function,
    mie_approximation,
    ensemble_presets,
    to_css_scattering, to_css_scattering_animation,
};

// PBR Phase 5 - Validation and Benchmarks
pub use phase5_validation::{
    validate_differentiable_gradients, validate_material_params,
    validate_dynamic_thin_film, validate_metal_oxidation,
    validate_mie_physics, validate_integration,
    benchmark_phase5, analyze_memory as phase5_memory_analysis,
    run_all_validations, generate_validation_report,
    ValidationResult, BenchmarkResults, MemoryAnalysis,
};

// PBR Phase 6 - Performance Optimization & Research-Grade Features
pub mod perceptual_loss; // ✅ PBR Phase 6 - LAB color space & Delta E metrics
pub mod material_datasets; // ✅ PBR Phase 6 - Reference spectral data for calibration
pub mod simd_batch; // ✅ PBR Phase 6 - SIMD-accelerated batch evaluation
pub mod combined_effects; // ✅ PBR Phase 6 - Unified effect compositor
pub mod phase6_validation; // ✅ PBR Phase 6 - Benchmarks and validation

// PBR Phase 6 - Perceptual Loss Functions
pub use perceptual_loss::{
    LabColor, XyzColor, Illuminant,
    DeltaEFormula, PerceptualLossConfig,
    rgb_to_xyz, xyz_to_rgb, xyz_to_lab, lab_to_xyz, rgb_to_lab, lab_to_rgb,
    delta_e_76, delta_e_94, delta_e_2000,
    perceptual_loss, perceptual_loss_gradient,
};

// PBR Phase 6 - Reference Material Datasets
pub use material_datasets::{
    MaterialCategory, MeasurementMetadata, SpectralMeasurement,
    MaterialDatabase,
};

// PBR Phase 6 - SIMD Batch Evaluation
pub use simd_batch::{
    SimdBatchInput, SimdBatchResult, SimdConfig,
    SimdBatchEvaluator,
    fresnel_schlick_8, beer_lambert_8, henyey_greenstein_8,
};

// PBR Phase 6 - Combined Effects Compositor
pub use combined_effects::{
    EffectLayer, BlendMode, RoughnessModel,
    CombinedMaterial, CombinedMaterialBuilder,
    presets as combined_presets,
};

// PBR Phase 6 - Validation and Benchmarks
pub use phase6_validation::{
    validate_perceptual_loss, validate_material_datasets,
    validate_simd_batch, validate_combined_effects,
    benchmark_phase6,
    SimdBenchmarks, Phase6MemoryAnalysis,
    ValidationResult as Phase6ValidationResult,
};

// PBR Phase 7 - Ultra-Realistic Rendering & Advanced Parallelization
pub mod simd_parallel; // ✅ PBR Phase 7 - CPU parallelization with SIMD inner loops
pub mod spectral_render; // ✅ PBR Phase 7 - Full spectral rendering with CIE CMF
pub mod auto_calibration_realtime; // ✅ PBR Phase 7 - Real-time perceptual calibration
pub mod combined_effects_advanced; // ✅ PBR Phase 7 - Extended effect layers with Phase 5 dynamics
pub mod presets_experimental; // ✅ PBR Phase 7 - 8 ultra-realistic experimental presets
pub mod phase7_validation; // ✅ PBR Phase 7 - Benchmarks and validation

// PBR Phase 7 - Parallel Batch Evaluation
pub use simd_parallel::{
    ParallelConfig, ParallelBatchEvaluator, ParallelBenchmark,
};

// PBR Phase 7 - Full Spectral Rendering
pub use spectral_render::{
    SpectralRenderConfig, SpectralMaterialEvaluator, SpectralRadiance,
    ColorMatchingLUT, WAVELENGTH_COUNT,
};

// PBR Phase 7 - Real-Time Auto-Calibration
pub use auto_calibration_realtime::{
    RealtimeCalibrationConfig, CalibrationFeedbackLoop, ConvergenceStatus,
    realtime_calibrate, compare_to_dataset, perceptual_match_score,
};

// PBR Phase 7 - Advanced Combined Effects
pub use combined_effects_advanced::{
    AdvancedEffectLayer, AdvancedCombinedMaterial, AdvancedCombinedMaterialBuilder,
    PhysicalState, DispersionModel as AdvancedDispersionModel,
    SizeDistribution as AdvancedSizeDistribution, TemperatureGradientConfig, GradientType,
    total_advanced_memory,
};

// PBR Phase 7 - Experimental Presets
pub use presets_experimental::{
    morpho_dynamic, copper_aging, stressed_crystal, opalescent_suspension,
    titanium_heated, dynamic_soap_bubble, ancient_bronze, oil_on_water_dynamic,
    preset_catalog, create_default as create_experimental_preset,
    list_presets as list_experimental_presets,
    PresetInfo, total_presets_memory,
};

// PBR Phase 7 - Validation and Benchmarks
pub use phase7_validation::{
    benchmark_parallel_performance, benchmark_spectral_rendering, benchmark_calibration,
    analyze_phase7_memory, validate_perceptual_accuracy,
    validate_parallel_correctness, validate_spectral_correctness, validate_experimental_presets,
    benchmark_phase7, compare_phase6_vs_phase7, generate_phase7_report,
    ParallelComparison, SpectralComparison, CalibrationMetrics,
    Phase7MemoryAnalysis, PerceptualValidation, Phase7BenchmarkResults, Phase7Comparison,
};

// PBR Phase 8 - Reference-Grade Scientific Validation & Ecosystem Integration
pub mod reference_renderer; // ✅ PBR Phase 8 - IEEE754 full precision rendering
pub mod spectral_error; // ✅ PBR Phase 8 - Comprehensive spectral/perceptual error metrics
pub mod material_fingerprint; // ✅ PBR Phase 8 - Deterministic material hashing & versioning
pub mod external_validation; // ✅ PBR Phase 8 - External dataset validation framework
pub mod dataset_merl; // ✅ PBR Phase 8 - MERL BRDF dataset support
pub mod material_export; // ✅ PBR Phase 8 - GLSL/WGSL/MaterialX/CSS export
pub mod material_import; // ✅ PBR Phase 8 - MaterialX/glTF/JSON import
pub mod plugin_api; // ✅ PBR Phase 8 - Versioned plugin system
pub mod research_api; // ✅ PBR Phase 8 - ML integration & optimization hooks
pub mod phase8_validation; // ✅ PBR Phase 8 - Benchmarks and reports
pub mod tier_validation; // ✅ PBR Phase 8 - Cross-tier validation
pub mod canonical_demos; // ✅ PBR Phase 8 - Reproducible scientific demos

// PBR Phase 8 - Reference Renderer
pub use reference_renderer::{
    PrecisionMode, ReferenceRenderConfig, ReferenceRenderer, ReferenceRenderResult,
    LutVsReferenceComparison,
    total_reference_memory,
};

// PBR Phase 8 - Spectral Error Metrics
pub use spectral_error::{
    SpectralErrorMetrics, PerceptualErrorMetrics, EnergyMetrics, ComprehensiveMetrics,
    SpectralQualityGrade, PerceptualQualityGrade, ValidationStatus,
    compute_spectral_metrics, compute_perceptual_metrics, compute_energy_metrics,
    compute_comprehensive, compute_spectral_angle,
    total_error_memory,
};

// PBR Phase 8 - Material Fingerprinting
pub use material_fingerprint::{
    MaterialFingerprint, MaterialVersion, CalibrationLog, CalibrationEntry,
    deterministic_hash, fingerprint_from_params, fingerprint_from_named,
    total_fingerprint_memory,
};

// PBR Phase 8 - External Validation Framework
pub use external_validation::{
    ExternalDataset, ValidationResult as ExternalValidationResult, ValidationReport,
    ReportSummary, MaterialValidation, ValidationEngine, ValidationConfig,
    total_validation_memory,
};

// PBR Phase 8 - MERL BRDF Dataset
pub use dataset_merl::{
    MerlMaterial, MerlDataset, MaterialCategory as MerlCategory,
    total_merl_memory,
};

// PBR Phase 8 - Material Export
pub use material_export::{
    ExportTarget, GlslVersion, MaterialDescriptor, ThinFilmDescriptor,
    ExportOptions, MaterialExporter,
    total_export_memory,
};

// PBR Phase 8 - Material Import
pub use material_import::{
    ImportSource, ImportError, ImportAdapter, MaterialImporter,
    total_import_memory,
};

// PBR Phase 8 - Plugin System
pub use plugin_api::{
    PLUGIN_API_VERSION, PLUGIN_API_VERSION_STRING,
    MaterialType, PluginMaterialParams, EvaluationContext, PluginRenderOutput,
    SpectralMeasurement as PluginSpectralMeasurement, RenderPlugin, DatasetPlugin, MetricPlugin,
    PluginRegistry, PluginError, PluginInfo, PluginInventory,
    LambertianPlugin, RmseMetricPlugin, SamMetricPlugin,
    estimate_plugin_api_memory,
};

// PBR Phase 8 - Research API
pub use research_api::{
    ForwardFunction, ParameterBounds, ParameterMapping, MaterialForwardFunction,
    ObjectiveType, ObjectiveFunction, ConstraintType, Constraint,
    MultiObjectiveTarget, OptimizationResult, GridSearchOptimizer,
    estimate_research_api_memory,
};

// PBR Phase 8 - Validation and Benchmarks
pub use phase8_validation::{
    benchmark_reference_accuracy, benchmark_merl_validation, benchmark_export_performance,
    benchmark_fingerprint_consistency, benchmark_plugin_overhead, analyze_phase8_memory,
    benchmark_phase8, generate_phase8_report, generate_phase8_json_report,
    LutVsReferenceResults, MerlValidationResults, ExportTimingResults,
    FingerprintResults, PluginOverheadResults, Phase8MemoryAnalysis, Phase8BenchmarkResults,
};

// PBR Phase 8 - Tier Cross-Validation
pub use tier_validation::{
    TierValidationResult, CrossValidationReport,
    run_cross_validation, run_metal_validation, run_dispersion_validation,
    generate_full_validation_report, get_validation_summary,
};

// PBR Phase 8 - Canonical Demos
pub use canonical_demos::{
    DemoResult, DemoSuite,
    demo_dielectric_vs_conductor, demo_thin_film_soap_bubble, demo_ar_coating,
    demo_fog_vs_smoke, demo_copper_patina, demo_spectral_vs_rgb,
    run_all_demos, run_demo,
};

// PBR Phase 9 - Unified BSDF + Perceptual Rendering Loop
pub mod unified_bsdf; // ✅ PBR Phase 9 - Unified BSDF trait with energy conservation
pub mod anisotropic_brdf; // ✅ PBR Phase 9 - Anisotropic GGX microfacet model
pub mod subsurface_scattering; // ✅ PBR Phase 9 - Diffusion BSSRDF for translucent materials
pub mod perceptual_loop; // ✅ PBR Phase 9 - Closed-loop perceptual optimization
pub mod phase9_validation; // ✅ PBR Phase 9 - Comprehensive validation suite

// PBR Phase 9 - Unified BSDF
pub use unified_bsdf::{
    BSDF, BSDFContext, BSDFResponse, BSDFSample, EnergyValidation,
    Vector3 as BSDFVector3,
    DielectricBSDF, ConductorBSDF, ThinFilmBSDF, LayeredBSDF, LambertianBSDF,
    DispersionModel as BSDFDispersionModel,
    evaluate_rgb as bsdf_evaluate_rgb, evaluate_spectral as bsdf_evaluate_spectral,
    validate_energy_conservation as bsdf_validate_energy,
    total_unified_bsdf_memory,
};

// PBR Phase 9 - Anisotropic BRDF
pub use anisotropic_brdf::{
    AnisotropicGGX, AnisotropicConductor, FiberBSDF,
    presets as anisotropic_presets,
    anisotropy_strength, strength_to_alphas,
    total_anisotropic_memory,
};

// PBR Phase 9 - Subsurface Scattering
pub use subsurface_scattering::{
    SubsurfaceParams, DiffusionBSSRDF, SubsurfaceBSDF,
    sss_presets,
    total_sss_memory,
};

// PBR Phase 9 - Perceptual Rendering Loop
pub use perceptual_loop::{
    MaterialParams as PerceptualMaterialParams, ParameterBounds as PerceptualBounds, PerceptualTarget,
    AdamState, ConvergenceStatus as PerceptualConvergenceStatus, OptimizationResult as PerceptualOptResult,
    PerceptualLoopConfig, PerceptualRenderingLoop,
    quick_match_color,
    total_perceptual_loop_memory,
};

// PBR Phase 9 - Validation
pub use phase9_validation::{
    BSDFComparisonResults, AnisotropicValidation, SSSValidation, ConvergenceResults,
    EnergyConservationReport, Phase9MemoryAnalysis, Phase9ValidationReport,
    validate_unified_vs_legacy, validate_anisotropic, validate_sss,
    validate_perceptual_loop, validate_energy_conservation_all as validate_phase9_energy,
    analyze_memory as analyze_phase9_memory,
    run_full_validation as run_phase9_validation,
    generate_report as generate_phase9_report,
};

// PBR Phase 10 - Neural Correction Layers & Hybrid Physical-Neural Rendering
pub mod neural_correction; // ✅ PBR Phase 10 - SIREN MLP for physics residuals
pub mod neural_constraints; // ✅ PBR Phase 10 - Physics-based constraints enforcement
pub mod training_dataset; // ✅ PBR Phase 10 - Synthetic + MERL training data generation
pub mod training_pipeline; // ✅ PBR Phase 10 - Adam training loop with perceptual loss
pub mod phase10_validation; // ✅ PBR Phase 10 - Comprehensive validation suite

// PBR Phase 10 - Neural Correction MLP
pub use neural_correction::{
    NeuralCorrectionMLP, CorrectionInput, CorrectionOutput,
    NeuralCorrectedBSDF,
    total_neural_correction_memory,
};

// PBR Phase 10 - Physics Constraints
pub use neural_constraints::{
    ConstraintType as NeuralConstraintType, ConstraintConfig, ConstraintValidator,
    RegularizationTerms, ConstraintViolationReport,
    total_neural_constraints_memory,
};

// PBR Phase 10 - Training Dataset
pub use training_dataset::{
    TrainingSample, DatasetMetadata, DatasetSource, AugmentationConfig,
    TrainingDataset,
    estimate_dataset_memory,
};

// PBR Phase 10 - Training Pipeline
pub use training_pipeline::{
    LossWeights, TrainingConfig, TrainingResult,
    TrainingPipeline,
    total_training_pipeline_memory,
};

// PBR Phase 10 - Validation
pub use phase10_validation::{
    ComparisonResults, PerceptualImprovement, EnergyValidation as Phase10EnergyValidation,
    NetworkStats, Phase10MemoryAnalysis, Phase10ValidationReport,
    validate_physical_vs_hybrid, validate_perceptual_improvement,
    validate_energy_conservation as validate_phase10_energy,
    compute_network_stats, analyze_phase10_memory,
    run_full_validation as run_phase10_validation,
    generate_report as generate_phase10_report,
};

// PBR Phase 11 - Production Readiness, GPU Acceleration & Public Canonicalization
pub mod gpu_backend; // ✅ PBR Phase 11 - GPU compute backend (wgpu/WGSL)
pub mod pbr_api; // ✅ PBR Phase 11 - Stable public API v1.0
pub mod phase11_validation; // ✅ PBR Phase 11 - Validation suite

// PBR Phase 11 - GPU Backend
pub use gpu_backend::{
    GpuBackendConfig, GpuBackendStats,
    estimate_gpu_backend_memory,
};

#[cfg(feature = "gpu")]
pub use gpu_backend::{
    GpuContext, GpuContextError, GpuCapabilities, DeviceLimits,
    BufferPool, BufferHandle, MaterialGpuData, BSDFResponseGpu,
    ComputePipelineCache, PipelineType,
    GpuBatchEvaluator, GpuBatchResult, GpuDispatchConfig,
    GpuCpuParityTest, ParityConfig, ParityResult,
    AutoFallback, FallbackReason, FallbackStats, FallbackBatchEvaluator,
};

// PBR Phase 11 - Stable Public API v1.0
pub use pbr_api::v1::{
    API_VERSION, API_VERSION_STRING, is_compatible,
    Material, Layer, MaterialBuilder, MaterialPreset,
    EvaluationContext as PbrEvaluationContext, Vector3 as PbrVector3,
    QualityTier as PbrQualityTier,
    AnisotropicGGX as PbrAnisotropicGGX,
};

// PBR Phase 11 - Prelude for convenient imports
pub mod pbr_prelude {
    pub use super::pbr_api::v1::prelude::*;
}

// PBR Phase 11 - Validation
pub use phase11_validation::{
    GpuParityResults, ApiStabilityResults, MemoryResults, EnergyResults,
    Phase11MemoryAnalysis, Phase11ValidationReport,
    validate_gpu_parity, validate_api_stability, validate_memory,
    validate_energy_conservation as validate_phase11_energy,
    analyze_phase11_memory,
    run_full_validation as run_phase11_validation,
    generate_report as generate_phase11_report,
};

// PBR Phase 12 - Temporal Light Transport, Spectral Coherence & Differentiable Foundations
pub mod temporal; // ✅ PBR Phase 12 - Temporal BSDF evaluation with time-aware materials
pub mod spectral_coherence; // ✅ PBR Phase 12 - Spectral flicker prevention and coherent sampling
pub mod neural_temporal_correction; // ✅ PBR Phase 12 - Neural correction with cumulative drift bounding
pub mod phase12_validation; // ✅ PBR Phase 12 - Validation suite for temporal stability

// PBR Phase 12 - Temporal Material Model
pub use temporal::{
    TemporalContext, TemporalContextBuilder,
    DriftTracker, DriftConfig, DriftStatus,
    TemporalBSDF, EvolutionRate, TemporalEvolution, TemporalBSDFInfo,
    TemporalDielectric, DielectricEvolution,
    TemporalThinFilm, ThinFilmEvolution,
    TemporalConductor, ConductorEvolution,
    InterpolationMode, Interpolation, RateLimiter, ExponentialMovingAverage,
    smoothstep, smootherstep, lerp, inverse_lerp, remap,
    estimate_temporal_memory,
};

// PBR Phase 12 - Spectral Coherence
pub use spectral_coherence::{
    SpectralPacket, SpectralPacketBuilder, CoherenceMetadata, WavelengthBand,
    CoherentSampler, SamplingStrategy, StratifiedSampler, JitteredSampler,
    SpectralInterpolator, BlendConfig, GradientLimiter,
    FlickerValidator, FlickerConfig, FlickerStatus, FlickerReport, FrameComparison,
    estimate_spectral_coherence_memory,
};

// PBR Phase 12 - Neural Temporal Correction
pub use neural_temporal_correction::{
    TemporalCorrectionInput, TemporalNeuralCorrection, TemporalNeuralConfig,
    CumulativeDriftTracker, DriftLimitConfig,
    TemporalNeuralCorrectedBSDF,
    estimate_temporal_neural_memory,
};

// PBR Phase 12 - Validation
pub use phase12_validation::{
    Phase12ValidationConfig, Phase12ValidationSuite,
    ValidationResult as Phase12ValidationResult, Phase12ValidationReport,
    run_quick_validation as run_phase12_quick,
    run_full_validation as run_phase12_full,
    run_strict_validation as run_phase12_strict,
};

// PBR Phase 13 - Differentiable Rendering, Inverse Materials & Physical Parameter Recovery
pub mod differentiable; // ✅ PBR Phase 13 - DifferentiableBSDF trait with analytical gradients
pub mod inverse_material; // ✅ PBR Phase 13 - Adam/L-BFGS optimization for parameter recovery
pub mod temporal_differentiable; // ✅ PBR Phase 13 - BPTT and evolution gradients
pub mod spectral_gradients; // ✅ PBR Phase 13 - Per-wavelength gradients and ΔE2000
pub mod gradient_validation; // ✅ PBR Phase 13 - Analytical vs numerical gradient verification
pub mod phase13_validation; // ✅ PBR Phase 13 - Comprehensive validation suite

// PBR Phase 13 - Differentiable BSDF Rendering
pub use differentiable::{
    DifferentiableBSDF, DifferentiableResponse, ParameterGradients,
    ParameterBounds as DifferentiableBounds, GradientConfig, GradientVerification,
    fresnel_schlick_gradient, fresnel_conductor_gradient,
    ggx_distribution_gradient, smith_g_gradient, beer_lambert_gradient,
    DifferentiableDielectric, DifferentiableConductor, DifferentiableThinFilm,
    DifferentiableLayered, LayerConfig,
    Jacobian, JacobianBuilder,
    estimate_differentiable_memory,
};

// PBR Phase 13 - Inverse Material Solver
pub use inverse_material::{
    DifferentiableOptimizer,
    AdamOptimizer as InverseAdamOptimizer, LBFGSOptimizer,
    AdamConfig as InverseAdamConfig, LBFGSConfig,
    BoundsEnforcer, BoundsConfig as InverseBoundsConfig, ProjectionMethod,
    InverseMaterialSolver, InverseSolverConfig, InverseResult, ConvergenceReason,
    ReferenceData, ReferenceObservation, LossFunction,
    TemporalFitter, TemporalFitterConfig, TemporalSequence, TemporalFitResult,
    recover_ior_from_normal_reflectance, recover_roughness_from_glossiness,
    estimate_inverse_memory,
};

// PBR Phase 13 - Temporal Differentiable
pub use temporal_differentiable::{
    EvolutionGradient, LinearEvolutionGradient, ExponentialEvolutionGradient,
    OscillatingEvolutionGradient, EvolutionGradients, EvolutionType,
    compute_evolution_gradient,
    BPTT, BPTTConfig, BPTTState, TemporalGradientAccumulator,
    GradientStabilizer, StabilizerConfig,
    estimate_temporal_differentiable_memory,
};

// PBR Phase 13 - Spectral Gradients
pub use spectral_gradients::{
    SpectralGradient, WavelengthGradient, SpectralJacobian,
    compute_spectral_gradient, VISIBLE_WAVELENGTHS,
    CauchyDispersion as SpectralCauchyDispersion, SellmeierDispersion as SpectralSellmeierDispersion,
    Lab, LabGradient, DeltaE2000Gradient, PerceptualLoss as SpectralPerceptualLoss,
    delta_e_2000 as spectral_delta_e_2000, delta_e_2000_gradient,
    estimate_spectral_gradients_memory,
};

// PBR Phase 13 - Gradient Validation
pub use gradient_validation::{
    VerificationConfig, GradientCheck, GradientVerificationResult,
    verify_bsdf_gradients, BatchVerification,
    numerical_gradient_central, numerical_gradient_forward, numerical_jacobian,
    quick_verify, full_verify_with_report,
};

// PBR Phase 13 - Validation
pub use phase13_validation::{
    Phase13ValidationConfig, Phase13ValidationReport, ValidationTest,
    run_phase13_validation,
};

// PBR Phase 14 - Digital Material Twins & Calibration
pub mod material_twin; // ✅ PBR Phase 14 - MaterialTwin abstraction with UUID, fingerprint, variants
pub mod calibration; // ✅ PBR Phase 14 - Multi-source calibration (BRDF, spectral, time-series)
pub mod uncertainty; // ✅ PBR Phase 14 - Covariance, Fisher information, bootstrap CI
pub mod identifiability; // ✅ PBR Phase 14 - Jacobian rank analysis, parameter freezing
pub mod twin_validation; // ✅ PBR Phase 14 - TwinValidator, DriftMonitor
pub mod phase14_validation; // ✅ PBR Phase 14 - Comprehensive validation suite

// PBR Phase 14 - Material Twin Core
pub use material_twin::{
    TwinId, MaterialTwin, TwinBuilder, CalibrationMetadata, CalibrationQuality,
    TwinVariant, StaticTwinData, TemporalTwinData, LayeredTwinData, MeasuredTwinData,
    SpectralIdentity, SpectralSignature, SpectralDistance,
};

// PBR Phase 14 - Calibration Pipeline
pub use calibration::{
    CalibrationSource, BRDFSource, SpectralSource, TimeSeriesSource, CombinedSource,
    BRDFObservation, SpectralObservation, TemporalObservation,
    LossWeights as CalibrationLossWeights, LossComponents, AggregatedLoss, LossAggregator,
    ImputationStrategy, PartialDataHandler, DataQuality, MissingDataReport,
    estimate_calibration_memory,
};

// PBR Phase 14 - Uncertainty Estimation
pub use uncertainty::{
    ParameterCovarianceMatrix, CovarianceEstimator,
    FisherInformationMatrix, FisherInformationEstimator,
    BootstrapConfig, BootstrapResampler, BootstrapResult, ConfidenceInterval,
    TwinConfidenceReport, ConfidenceWarning, ConfidenceLevel, ParameterUncertainty,
    estimate_uncertainty_memory,
};

// PBR Phase 14 - Identifiability Analysis
pub use identifiability::{
    JacobianRankAnalyzer, IdentifiabilityResult, RankDeficiency,
    ParameterCorrelationMatrix, CorrelationCluster, CorrelationAnalysis,
    find_correlation_clusters, compute_vif,
    FreezingRecommendation, FreezingReason, ParameterFreezingRecommender,
    FreezingStrategy, FreezingReport,
    estimate_identifiability_memory,
};

// PBR Phase 14 - Twin Validation & Drift Monitoring
pub use twin_validation::{
    TwinValidator, ValidationResult as TwinValidationResult, ValidationIssue, IssueCategory,
    ValidationConfig as TwinValidationConfig, ValidationRecord,
    DriftMonitor, DriftObservation, DriftStatistics, DriftReport,
    estimate_validation_memory,
};

// PBR Phase 15 - Certifiable Material Twins
pub mod metrology; // ✅ PBR Phase 15 - Formal metrology layer (measurement, uncertainty, traceability)
pub mod instruments; // ✅ PBR Phase 15 - Virtual measurement instruments
pub mod certification; // ✅ PBR Phase 15 - Certification levels, profiles, and auditing
pub mod compliance; // ✅ PBR Phase 15 - Ground truth validation, neural audit, export
pub mod phase15_validation; // ✅ PBR Phase 15 - Comprehensive validation suite (67+ tests)

// PBR Phase 15 - Metrology Layer
pub use metrology::{
    // Units
    Unit, UnitValue, units_compatible, convert_unit,
    celsius_to_kelvin, kelvin_to_celsius, deg_to_rad, rad_to_deg,
    nm_to_um, um_to_nm, fraction_to_percent, percent_to_fraction,
    // Measurement
    Measurement, MeasurementId, MeasurementArray, Uncertainty, MeasurementQuality, MeasurementSource,
    // Traceability
    TraceabilityChain, TraceabilityEntry, TraceabilityOperation, CalibrationReference,
    ChainMetadata,
    // Tolerance
    ToleranceBudget, ToleranceComponent, ToleranceCategory, ToleranceValidation,
    CertificationTolerance, ComponentValidation,
    // Propagation
    UncertaintyPropagator, PropagationMethod, SensitivityAnalysis,
    identity_correlation, uniform_correlation, validate_correlation_matrix,
    // Memory
    estimate_memory_footprint as estimate_metrology_memory, MetrologyMemoryEstimate,
};

// PBR Phase 15 - Virtual Instruments
pub use instruments::{
    // Common
    NoiseModel, Resolution, BiasModel, InstrumentConfig, DetectorGeometry,
    LightSource as InstrumentLightSource, LightSourceType, Polarization,
    EnvironmentConditions, SimpleRng,
    // Gonioreflectometer
    VirtualGonioreflectometer, GoniometerResult,
    lambertian_brdf, phong_brdf, fresnel_brdf,
    // Spectrophotometer
    VirtualSpectrophotometer, SpectroResult, SpectroGeometry, SpectroMeasurementType,
    constant_reflectance, linear_reflectance, gaussian_absorption,
    // Ellipsometer
    VirtualEllipsometer, EllipsometryResult, ThinFilmResult, EllipsometerType, EllipsometryPoint,
    cauchy_dispersion, constant_optical_constants, glass_optical_constants, silicon_optical_constants,
    // Memory
    estimate_memory_footprint as estimate_instruments_memory, InstrumentsMemoryEstimate,
};

// PBR Phase 15 - Certification System
pub use certification::{
    // Levels
    CertificationLevel, CertificationMetrics, LevelCheck, LevelRequirements,
    // Requirements
    MandatoryTest, TestResult as CertificationTestResult, TestSuiteResult, required_tests, required_test_count,
    // Profiles
    CertifiedTwinProfile, NeuralCorrectionStats, NeuralViolation,
    // Auditor
    CertificationAuditor, MaterialAuditData, CertificationResult,
    // Quick functions
    can_achieve_level, highest_level, quick_certify_experimental,
    // Memory
    estimate_memory_footprint as estimate_certification_memory, CertificationMemoryEstimate,
};

// PBR Phase 15 - Compliance & Export
pub use compliance::{
    // Ground Truth
    GroundTruthValidator, GroundTruthDataset,
    ValidationReport as GroundTruthValidationReport, DatasetValidationReport,
    ReferenceMeasurement, SpectralMeasurement as ComplianceSpectralMeasurement,
    gold_reference_data, silver_reference_data, bk7_reference_data,
    // Neural Audit
    NeuralAuditor, NeuralAuditResult, AuditFinding, FindingSeverity, FindingCategory,
    CorrectionCheck,
    // Reproducibility
    ReproducibilityTest, ReproducibilityResult,
    ComparisonResult as ReproducibilityComparisonResult, CrossPlatformReference,
    compute_reproducibility_hash, verify_hash,
    // Export
    MetrologicalExporter, ExportFormat, batch_export,
    // Quick checks
    quick_ground_truth_check, quick_neural_audit, quick_reproducibility_check,
    full_compliance_check, FullComplianceResult,
    // Validation
    validate_module as validate_compliance_module, ComplianceValidation,
    estimate_memory_footprint as estimate_compliance_memory, ComplianceMemoryEstimate,
};

// PBR Phase 15 - Validation Suite
pub use phase15_validation::{
    run_phase15_validation, Phase15ValidationResult,
};

// Sprint 8 - Scientific Validation
pub use scientific_validation::{
    // Statistical Metrics
    ValidationMetrics as ScientificValidationMetrics,
    PhenomenonValidation, ValidationReport as ScientificValidationReport,
    // Analytical References
    fresnel_dielectric_exact, fresnel_conductor_exact,
    airy_thin_film_reflectance, transfer_matrix_multilayer,
    rayleigh_scattering, mie_asymmetry_g as mie_asymmetry_g_analytical,
    cauchy_dispersion as cauchy_dispersion_analytical, sellmeier_dispersion, bk7_sellmeier,
    // Reference Data
    gold_optical_constants, silver_optical_constants, copper_optical_constants,
    // Validation Functions
    validate_thin_film_vs_airy, validate_fresnel_dielectric,
    validate_dispersion_bk7, validate_gold_reflectance,
    validate_mie_rayleigh_limit,
    validate_energy_conservation as validate_sprint8_energy_conservation,
    run_full_validation as run_sprint8_validation,
};

// Phase 5 Intelligence - Enhanced Neural Corrections
pub mod phase13_neural;

// Enterprise Phase 7 - Advanced Materials Extension
pub mod anisotropic; // ✅ Enterprise Phase 7 - Anisotropic BSDF (brushed metals, hair, fabric)
pub mod meta_materials; // ✅ Enterprise Phase 7 - Photonic crystals, structural color
pub mod plasmonic; // ✅ Enterprise Phase 7 - Plasmonic nanoparticles (LSPR)
pub mod advanced_material_presets; // ✅ Enterprise Phase 7 - Extended presets (architectural, automotive, natural, technical)

// Phase 5 Intelligence - Wavelength-Specific Corrections
pub use phase13_neural::{
    WavelengthBand as NeuralWavelengthBand, WavelengthCorrectionConfig, WavelengthCorrectionMLP,
    BandInterpolator, BandStats, SpectralCorrectionResult,
};

// Phase 5 Intelligence - Polarization-Aware Corrections
pub use phase13_neural::{
    PolarizationState, PolarizationCorrectionConfig, PolarizationCorrectionMLP,
    PolarizedResponse, PolarizationDifference,
};

// Phase 5 Intelligence - Training Data Collection
pub use phase13_neural::{
    TrainingSample as NeuralTrainingSample, TrainingSampleInput, TrainingSampleTarget, SampleMetadata,
    MaterialType as TrainingMaterialType, DataSource,
    CollectionFilter, TrainingStorage, MemoryStorage, StorageError,
    TrainingDataCollector, CollectionStatistics,
};

// Phase 5 Intelligence - Confidence Scoring
pub use phase13_neural::{
    CorrectionConfidence, ConfidenceLevel as NeuralConfidenceLevel, TrainingStatistics, InputDistribution,
    ConfidenceScorer, ConfidenceScorerConfig,
    thresholds as confidence_thresholds,
    estimate_phase13_neural_memory,
};

// Enterprise Phase 7 - Anisotropic Materials (brushed metals, hair, fabric)
pub use anisotropic::{
    Color as AnisotropicColor,
    AnisotropicBSDF, AshikhminShirleyBSDF, HairBSDF,
    presets as anisotropic_material_presets,
    estimate_anisotropic_memory,
};

// Enterprise Phase 7 - Meta-Materials (photonic crystals, structural color)
pub use meta_materials::{
    MaterialRef, LatticeType, NanostructureType,
    PhotonicCrystal, StructuralColor, DiffractionGrating,
    presets as meta_material_presets,
    estimate_meta_materials_memory,
};

// Enterprise Phase 7 - Plasmonic Materials (nanoparticles, LSPR)
pub use plasmonic::{
    MetalType as PlasmonicMetalType, ParticleShape, Ordering as PlasmonicOrdering,
    PlasmonicNanoparticle, PlasmonicFilm, PlasmonicArray,
    presets as plasmonic_presets,
    estimate_plasmonic_memory,
};

// Enterprise Phase 7 - Advanced Material Presets (architectural, automotive, natural, technical)
pub use advanced_material_presets::{
    AdvancedMaterialCategory, AdvancedMaterialInfo,
    // Architectural glass
    low_e_coating, electrochromic_glass, smart_glass_pdlc,
    // Automotive finishes
    car_paint_metallic, pearlescent_paint, chrome_finish,
    // Natural materials
    opal, mother_of_pearl, beetle_shell,
    // Technical coatings
    anti_reflective_coating, dichroic_filter, holographic,
    // Catalog functions
    catalog as advanced_material_catalog, get_preset_info, list_by_category,
    estimate_advanced_presets_memory,
};
