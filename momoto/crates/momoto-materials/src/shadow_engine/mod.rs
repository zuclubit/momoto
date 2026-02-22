//! # Shadow Engine - Multi-Layer Depth System
//!
//! Physically-inspired shadow system for glass materials.
//!
//! ## Shadow Architecture
//!
//! Real-world shadows consist of multiple distinct layers:
//!
//! ```text
//! ┌─────────────────────────────────────────┐
//! │           SHADOW SYSTEM                 │
//! ├─────────────────────────────────────────┤
//! │  Contact Shadow   │ Sharp, dark, local  │
//! │  Ambient Shadow   │ Soft, diffuse, wide │
//! │  Elevation        │ Combined system     │
//! └─────────────────────────────────────────┘
//! ```
//!
//! ### Contact Shadow
//! - **Sharp and dark**: Appears where glass touches surface
//! - **Small spread**: 1-4px typical
//! - **High opacity**: 60-85%
//! - **Physics**: Complete light occlusion at contact point
//!
//! ### Ambient Shadow
//! - **Soft and blurred**: Environmental light blocking
//! - **Large spread**: 12-40px typical
//! - **Low opacity**: 15-45%
//! - **Physics**: Partial occlusion of ambient/skylight
//!
//! ### Elevation Shadow
//! - **Unified system**: Combines contact + ambient
//! - **Elevation-aware**: Adjusts with element height
//! - **Interactive**: Responds to hover/active states
//!
//! ## Design Philosophy
//!
//! Apple Liquid Glass uses **refined shadows**—not the dramatic shadows
//! of Material Design, but subtle depth cues that respect translucency:
//!
//! - Shadows are **suggestions** not declarations
//! - Blur is **generous** to avoid harshness
//! - Opacity is **modest** to maintain airiness
//! - Multiple layers create **natural gradation**
//!
//! ## Usage
//!
//! ```rust
//! use momoto_materials::shadow_engine::{
//!     elevation_shadow::{calculate_elevation_shadow, ElevationPresets},
//! };
//! use momoto_core::space::oklch::OKLCH;
//!
//! let background = OKLCH::new(0.95, 0.01, 240.0);
//!
//! // Calculate shadow for button (elevation 1)
//! let button_shadow = calculate_elevation_shadow(
//!     ElevationPresets::LEVEL_1,
//!     background,
//!     1.0, // glass depth
//! );
//!
//! // Convert to CSS
//! use momoto_materials::shadow_engine::elevation_shadow;
//! let css = elevation_shadow::to_css(&button_shadow);
//! // Output: "0 0.5px 2.0px 0.0px oklch(...), 0 2.5px 10.0px -2.0px oklch(...)"
//! ```
//!
//! ## Performance
//!
//! Shadow calculations are lightweight (microseconds) and can be done:
//! - **Build-time**: Pre-calculate shadows for design tokens
//! - **Runtime**: Calculate dynamically for interactive elements
//! - **Hybrid**: Pre-calculate common elevations, interpolate between
//!
//! The shadow system outputs CSS `box-shadow` strings that render
//! efficiently using GPU-accelerated compositing.

pub mod ambient_shadow;
pub mod contact_shadow;
pub mod elevation_shadow;

// Re-export commonly used types
pub use contact_shadow::{
    calculate_contact_shadow, ContactShadow, ContactShadowParams, ContactShadowPresets,
};

pub use ambient_shadow::{
    calculate_ambient_shadow, calculate_multi_scale_ambient, AmbientShadow, AmbientShadowParams,
    AmbientShadowPresets,
};

pub use elevation_shadow::{
    calculate_elevation_shadow, calculate_interactive_shadow, Elevation, ElevationPresets,
    ElevationShadow, ElevationTransition, InteractiveState,
};
