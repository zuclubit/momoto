//! # PBR Public API
//!
//! Stable, versioned public API for the Momoto PBR engine.
//!
//! ## Stability Guarantee
//!
//! All types in `pbr_api::v1` follow semantic versioning:
//! - **Patch (1.0.x)**: Bug fixes, performance improvements
//! - **Minor (1.x.0)**: Additive features, new presets
//! - **Major (x.0.0)**: Breaking changes (with deprecation cycle)
//!
//! ## Usage
//!
//! ```rust,ignore
//! use momoto_materials::glass_physics::pbr_api::v1::prelude::*;
//!
//! // Create a dielectric material
//! let glass = DielectricBSDF::new(1.5);
//!
//! // Evaluate at a specific angle
//! let ctx = EvaluationContext::new(
//!     Vector3::new(0.0, 0.0, 1.0),  // Incident direction
//!     Vector3::new(0.0, 0.0, 1.0),  // Outgoing direction
//!     Vector3::new(0.0, 0.0, 1.0),  // Normal
//! );
//!
//! let response = glass.evaluate(&ctx);
//! println!("Reflectance: {}", response.reflectance);
//! ```
//!
//! ## Versioning
//!
//! The current stable API version is v1.0.0.

pub mod v1;

// Re-export current stable version at module root
pub use v1::*;
