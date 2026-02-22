//! # PBR API v1 Prelude
//!
//! Common imports for working with the PBR API.
//!
//! ## Usage
//!
//! ```rust,ignore
//! use momoto_materials::glass_physics::pbr_api::v1::prelude::*;
//! ```

// Material types
pub use super::material::{Material, Layer, MaterialBuilder, MaterialPreset};

// BSDF types
pub use super::bsdf::{
    BSDF,
    BSDFResponse,
    BSDFSample,
    EnergyValidation,
    DielectricBSDF,
    ConductorBSDF,
    ThinFilmBSDF,
    LayeredBSDF,
    LambertianBSDF,
};

// Context types
pub use super::context::{EvaluationContext, Vector3};

// Quality tiers
pub use super::super::super::enhanced_presets::QualityTier;

// Anisotropic
pub use super::AnisotropicGGX;

// Version info
pub use super::{API_VERSION, API_VERSION_STRING, is_compatible};
