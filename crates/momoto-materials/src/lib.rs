//! # Momoto Materials - Advanced Glass Physics System
//!
//! Physically-inspired material effects for perceptual color systems.
//!
//! ## Features
//!
//! ### Core Systems
//! - **Liquid Glass**: Modern translucent materials with perceptual color science
//! - **Glass Physics**: Beer-Lambert transmittance, Snell's law refraction, physical light models
//! - **Shadow Engine**: Multi-layer shadows (contact, ambient, elevation)
//! - **Material Composition**: Edge highlights, frost layers, translucency
//!
//! ### Advanced Capabilities
//! - **Multi-layer composition**: Highlight, shadow, and illumination layers
//! - **Adaptive tinting**: Context-aware color adaptation
//! - **Contrast validation**: Ensures text readability on glass surfaces
//! - **Perceptual uniformity**: All adjustments in OKLCH space
//! - **Physics-derived gradients**: Real light interaction, not decorative
//!
//! ## Quick Start
//!
//! ```rust
//! use momoto_core::color::Color;
//! use momoto_materials::glass::{LiquidGlass, GlassVariant};
//!
//! // Create glass surface
//! let background = Color::from_srgb8(59, 130, 246); // Blue
//! let glass = LiquidGlass::new(GlassVariant::Regular);
//!
//! // Get recommended text color
//! let text_color = glass.recommend_text_color(background, true);
//! ```
//!
//! ## Advanced Usage
//!
//! ```rust
//! use momoto_materials::glass_physics::{
//!     transmittance::{OpticalProperties, calculate_multi_layer_transmittance},
//!     light_model::{LightingEnvironment, derive_gradient},
//! };
//! use momoto_materials::shadow_engine::{
//!     elevation_shadow::{calculate_elevation_shadow, ElevationPresets},
//! };
//! use momoto_core::space::oklch::OKLCH;
//!
//! // 1. Calculate physical transmittance
//! let optical = OpticalProperties::default();
//! let layers = calculate_multi_layer_transmittance(&optical, 1.0);
//!
//! // 2. Generate physics-based gradient
//! let environment = LightingEnvironment::default();
//! let gradient = derive_gradient(&environment, 0.3, 32.0, 10);
//!
//! // 3. Calculate elevation shadow
//! let background = OKLCH::new(0.95, 0.01, 240.0);
//! let shadow = calculate_elevation_shadow(ElevationPresets::LEVEL_2, background, 1.0);
//! ```

// TODO: Re-enable missing_docs after Phase 15 documentation sprint
#![allow(missing_docs)]
#![deny(unsafe_code)]

// Core modules
pub mod blur;
pub mod elevation;
pub mod glass;
pub mod vibrancy;

// Advanced physics modules
pub mod glass_physics;
pub mod shadow_engine;

// Enhanced CSS generation
pub mod css_enhanced;

// Re-exports - Core
pub use elevation::{Elevation, MaterialSurface};
pub use glass::{GlassProperties, GlassVariant, LiquidGlass};
pub use vibrancy::{VibrancyEffect, VibrancyLevel};

// Re-exports - Glass Physics
pub use glass_physics::{
    light_model::{LightingEnvironment, LightingResult},
    refraction_index::{RefractionParams, RefractionResult},
    transmittance::{LayerTransmittance, OpticalProperties, TransmittanceResult},
};

// Re-exports - Shadow Engine
pub use shadow_engine::{
    ambient_shadow::{AmbientShadow, AmbientShadowParams},
    contact_shadow::{ContactShadow, ContactShadowParams},
    elevation_shadow::{ElevationShadow, ElevationTransition, InteractiveState},
};

// Re-exports - Enhanced CSS
pub use css_enhanced::{render_enhanced_css, render_premium_css, EnhancedCssBackend};

// ============================================================================
// Tier 1 - Essential APIs (Core shading, context, presets, performance)
// ============================================================================

// Fresnel reflectance - fundamental for glass/metal rendering
pub use glass_physics::{
    fresnel_schlick, fresnel_full, brewster_angle, edge_intensity,
    generate_fresnel_gradient, to_css_fresnel_gradient, to_css_luminous_border,
};

// Blinn-Phong specular - core highlight calculations
pub use glass_physics::{
    blinn_phong_specular, calculate_highlight_position, calculate_specular_layers,
    roughness_to_shininess, to_css_specular_highlight, to_css_inner_highlight,
};

// Context system - environment-aware material evaluation
pub use glass_physics::{
    BackgroundContext, ContextPresets, LightingContext, MaterialContext, ViewContext,
};

// Enhanced material presets with quality tiers
pub use glass_physics::{
    EnhancedGlassMaterial, QualityTier,
    crown_glass, flint_glass, fused_silica, diamond, frosted_glass,
    opal_glass, polycarbonate, pmma, water, sapphire, ice, milk_glass,
    all_presets, presets_by_quality,
};

// LUT system for performance (5-10x speedup)
pub use glass_physics::{
    beer_lambert_fast, fresnel_fast, total_lut_memory,
    BeerLambertLUT, FresnelLUT,
};

// Batch evaluation for bulk operations (7-10x speedup)
pub use glass_physics::{
    evaluate_batch, BatchEvaluator, BatchMaterialInput, BatchResult,
};

// Quality tier selection system
pub use glass_physics::{
    select_tier, DeviceCapabilities, MaterialComplexity, QualityConfig,
    TierFeatures, TierMetrics,
};

// ============================================================================
// Tier 2 - Advanced APIs (BSDF, digital twins, thin film, metals)
// ============================================================================

// Unified BSDF system - physically-based material evaluation
pub use glass_physics::{
    BSDF, BSDFContext, BSDFResponse, BSDFSample, EnergyValidation,
    DielectricBSDF, ConductorBSDF, ThinFilmBSDF, LayeredBSDF, LambertianBSDF,
    bsdf_evaluate_rgb, bsdf_evaluate_spectral, bsdf_validate_energy,
};

// Digital Material Twins - calibrated material instances
pub use glass_physics::{
    TwinId, MaterialTwin, TwinBuilder, CalibrationMetadata, CalibrationQuality,
    TwinVariant, StaticTwinData, TemporalTwinData, LayeredTwinData, MeasuredTwinData,
    SpectralIdentity, SpectralSignature, SpectralDistance,
};

// Thin film interference - iridescent effects
pub use glass_physics::{
    ThinFilm, ThinFilmStack,
    thin_film_to_rgb, to_css_iridescent_gradient, to_css_soap_bubble, to_css_oil_slick,
    ar_coating_thickness, dominant_wavelength, total_thin_film_memory,
};

// Complex IOR for metals (gold, silver, copper, etc.)
pub use glass_physics::{
    Complex, ComplexIOR, SpectralComplexIOR,
    fresnel_conductor, fresnel_conductor_unpolarized, fresnel_conductor_schlick,
    to_css_metallic_gradient, to_css_metallic_surface,
    metals,
};

// Dispersion models - wavelength-dependent IOR
pub use glass_physics::{
    CauchyDispersion, Dispersion, DispersionModel, SellmeierDispersion,
    f0_from_ior, f0_rgb, chromatic_aberration_strength,
};

// Scattering phase functions
pub use glass_physics::{
    henyey_greenstein, hg_fast, double_henyey_greenstein,
    HenyeyGreensteinLUT, ScatteringParams, sample_hg,
};

// Mie scattering for particles
pub use glass_physics::{
    MieParams, MieLUT,
    rayleigh_phase, rayleigh_efficiency, rayleigh_intensity_rgb,
    mie_asymmetry_g, mie_phase_hg, mie_efficiencies,
    mie_fast, mie_particle, mie_particle_rgb,
    total_mie_memory,
};

// ============================================================================
// Tier 3 - Research & Production APIs (differentiable, calibration, GPU)
// ============================================================================

// Differentiable rendering - gradient computation for optimization
pub use glass_physics::{
    DifferentiableBSDF, DifferentiableResponse, ParameterGradients,
    GradientConfig, GradientVerification,
    DifferentiableDielectric, DifferentiableConductor, DifferentiableThinFilm,
    DifferentiableLayered, LayerConfig,
    Jacobian, JacobianBuilder,
};

// Inverse material solver - parameter recovery from measurements
pub use glass_physics::{
    InverseMaterialSolver, InverseSolverConfig, InverseResult, ConvergenceReason,
    ReferenceData, ReferenceObservation, LossFunction,
    recover_ior_from_normal_reflectance, recover_roughness_from_glossiness,
};

// Calibration pipeline - multi-source material calibration
pub use glass_physics::{
    CalibrationSource, BRDFSource, SpectralSource, TimeSeriesSource, CombinedSource,
    BRDFObservation, SpectralObservation, TemporalObservation,
    LossComponents, AggregatedLoss, LossAggregator,
};

// Uncertainty estimation - confidence intervals and covariance
pub use glass_physics::{
    ParameterCovarianceMatrix, CovarianceEstimator,
    FisherInformationMatrix, FisherInformationEstimator,
    BootstrapConfig, BootstrapResampler, BootstrapResult, ConfidenceInterval,
    TwinConfidenceReport, ConfidenceWarning, ConfidenceLevel, ParameterUncertainty,
};

// Perceptual loss functions - LAB color space and Delta E
pub use glass_physics::{
    LabColor, XyzColor, Illuminant,
    DeltaEFormula, PerceptualLossConfig,
    rgb_to_xyz, xyz_to_rgb, xyz_to_lab, lab_to_xyz, rgb_to_lab, lab_to_rgb,
    delta_e_76, delta_e_94, delta_e_2000,
    perceptual_loss, perceptual_loss_gradient,
};

// Combined effects compositor
pub use glass_physics::{
    EffectLayer, BlendMode, RoughnessModel,
    CombinedMaterial, CombinedMaterialBuilder,
};

// Anisotropic BRDF - brushed metals, hair, fabric
pub use glass_physics::{
    AnisotropicGGX, AnisotropicConductor, FiberBSDF,
    anisotropy_strength, strength_to_alphas,
};

// Subsurface scattering - translucent materials
pub use glass_physics::{
    SubsurfaceParams, DiffusionBSSRDF, SubsurfaceBSDF,
    sss_presets,
};

// PBR API v1 - stable public interface
pub use glass_physics::{
    API_VERSION, API_VERSION_STRING, is_compatible,
    Material, Layer, MaterialBuilder, MaterialPreset,
};

// GPU backend configuration (feature-gated types available via glass_physics)
pub use glass_physics::{
    GpuBackendConfig, GpuBackendStats,
    estimate_gpu_backend_memory,
};

// ============================================================================
// Tier 4 - Scientific & Metrology APIs (certification, instruments, validation)
// ============================================================================

// Metrology - formal measurement system
pub use glass_physics::{
    Unit, UnitValue, Measurement, MeasurementId, MeasurementArray,
    Uncertainty, MeasurementQuality, MeasurementSource,
    TraceabilityChain, TraceabilityEntry, TraceabilityOperation,
    ToleranceBudget, ToleranceComponent, ToleranceCategory,
};

// Virtual instruments - simulation of physical measurement devices
pub use glass_physics::{
    VirtualGonioreflectometer, GoniometerResult,
    VirtualSpectrophotometer, SpectroResult, SpectroGeometry,
    VirtualEllipsometer, EllipsometryResult, ThinFilmResult as EllipsometryThinFilmResult,
};

// Certification system - material validation levels
pub use glass_physics::{
    CertificationLevel, CertificationMetrics, LevelRequirements,
    CertificationAuditor, MaterialAuditData, CertificationResult,
    can_achieve_level, highest_level, quick_certify_experimental,
};

// Ground truth validation
pub use glass_physics::{
    GroundTruthValidator, GroundTruthDataset,
    gold_reference_data, silver_reference_data, bk7_reference_data,
};

// Material export/import
pub use glass_physics::{
    ExportTarget, GlslVersion, MaterialDescriptor,
    ExportOptions, MaterialExporter,
    ImportSource, ImportError, ImportAdapter, MaterialImporter,
};

// Plugin system
pub use glass_physics::{
    PLUGIN_API_VERSION, PLUGIN_API_VERSION_STRING,
    MaterialType, PluginMaterialParams, PluginRenderOutput,
    RenderPlugin, DatasetPlugin, MetricPlugin,
    PluginRegistry, PluginError, PluginInfo, PluginInventory,
};

// Reference renderer - IEEE754 precision
pub use glass_physics::{
    PrecisionMode, ReferenceRenderConfig, ReferenceRenderer, ReferenceRenderResult,
};

// Spectral error metrics
pub use glass_physics::{
    SpectralErrorMetrics, PerceptualErrorMetrics, EnergyMetrics, ComprehensiveMetrics,
    SpectralQualityGrade, PerceptualQualityGrade, ValidationStatus,
    compute_spectral_metrics, compute_perceptual_metrics, compute_comprehensive,
};

// Scientific validation
pub use glass_physics::{
    fresnel_dielectric_exact, fresnel_conductor_exact,
    airy_thin_film_reflectance, transfer_matrix_multilayer,
    rayleigh_scattering, cauchy_dispersion_analytical, sellmeier_dispersion,
};

// ============================================================================
// Enterprise Phase 7 - Advanced Material Presets
// ============================================================================

// Advanced material presets catalog
pub use glass_physics::{
    AdvancedMaterialCategory, AdvancedMaterialInfo,
    advanced_material_catalog, get_preset_info, list_by_category,
    estimate_advanced_presets_memory,
    // Architectural glass
    low_e_coating, electrochromic_glass, smart_glass_pdlc,
    // Automotive finishes
    car_paint_metallic, pearlescent_paint, chrome_finish,
    // Natural materials
    opal, mother_of_pearl, beetle_shell,
    // Technical coatings
    anti_reflective_coating, dichroic_filter, holographic,
};

// Anisotropic materials (brushed metals, hair, fabric)
pub use glass_physics::{
    AnisotropicBSDF, AshikhminShirleyBSDF, HairBSDF,
    anisotropic_material_presets, estimate_anisotropic_memory,
};

// Meta-materials (photonic crystals, structural color)
pub use glass_physics::{
    MaterialRef, LatticeType, NanostructureType,
    PhotonicCrystal, StructuralColor, DiffractionGrating,
    meta_material_presets, estimate_meta_materials_memory,
};

// Plasmonic materials (nanoparticles, LSPR)
pub use glass_physics::{
    PlasmonicMetalType, ParticleShape, PlasmonicOrdering,
    PlasmonicNanoparticle, PlasmonicFilm, PlasmonicArray,
    plasmonic_presets, estimate_plasmonic_memory,
};
