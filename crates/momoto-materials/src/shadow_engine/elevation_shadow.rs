//! # Elevation Shadow System
//!
//! Unified shadow system based on Material Design elevation principles.
//!
//! ## Elevation Model
//!
//! Elevation represents the distance between surfaces in the z-axis.
//! Higher elevation creates:
//! - Larger shadows (further from surface = more spread)
//! - Softer shadows (more distance = more diffusion)
//! - More visible shadows (higher contrast = clearer separation)
//!
//! ## Apple Liquid Glass Adaptation
//!
//! Apple's system uses subtle elevation cues:
//! - **Level 0**: Flush with surface (minimal shadow)
//! - **Level 1**: Standard buttons (subtle shadow)
//! - **Level 2**: Hover states (lifted appearance)
//! - **Level 3**: Modals, popovers (clear separation)
//! - **Level 4**: Dropdowns, tooltips (prominent)
//! - **Level 5+**: Drag states, maximum separation
//!
//! Unlike Material Design's dramatic shadows, Liquid Glass uses
//! refined, barely-there shadows that respect the translucent aesthetic.

use super::ambient_shadow::{calculate_multi_scale_ambient, AmbientShadow, AmbientShadowParams};
use super::contact_shadow::{calculate_contact_shadow, ContactShadow, ContactShadowParams};
use momoto_core::space::oklch::OKLCH;

/// Elevation level (0-24 scale, 0 = flat, 24 = maximum)
pub type Elevation = u8;

/// Complete shadow system for an element
#[derive(Debug, Clone)]
pub struct ElevationShadow {
    /// Sharp contact shadow
    pub contact: ContactShadow,

    /// Soft ambient shadows (one or more layers)
    pub ambient: Vec<AmbientShadow>,

    /// Elevation level used
    pub elevation: Elevation,
}

/// Calculate complete shadow system for given elevation
///
/// Automatically determines appropriate contact and ambient shadows
/// based on elevation level and background.
///
/// # Arguments
///
/// * `elevation` - Elevation level (0-24, where 0 = no shadow, 24 = maximum)
/// * `background` - Background color
/// * `glass_depth` - Perceived thickness of glass (0.0-2.0 typical)
///
/// # Returns
///
/// Complete elevation shadow system
///
/// # Example
///
/// ```rust
/// use momoto_materials::shadow_engine::elevation_shadow::calculate_elevation_shadow;
/// use momoto_core::space::oklch::OKLCH;
///
/// let background = OKLCH::new(0.95, 0.01, 240.0);
/// let shadow = calculate_elevation_shadow(2, background, 1.0);
///
/// println!("Contact shadow blur: {:.1}px", shadow.contact.blur);
/// println!("Ambient shadow layers: {}", shadow.ambient.len());
/// ```
pub fn calculate_elevation_shadow(
    elevation: Elevation,
    background: OKLCH,
    glass_depth: f64,
) -> ElevationShadow {
    let elevation_f64 = elevation as f64;

    // 1. Calculate contact shadow parameters based on elevation
    let contact_params = ContactShadowParams {
        darkness: (0.6 + elevation_f64 * 0.015).min(0.85),
        blur_radius: (1.0 + elevation_f64 * 0.15).min(4.0),
        offset_y: (0.25 + elevation_f64 * 0.08).min(2.0),
        spread: (elevation_f64 * 0.05).min(1.0),
    };

    let contact = calculate_contact_shadow(&contact_params, background, glass_depth);

    // 2. Calculate ambient shadow parameters based on elevation
    let ambient_params = AmbientShadowParams {
        base_opacity: (0.15 + elevation_f64 * 0.015).min(0.45),
        blur_radius: (8.0 + elevation_f64 * 1.5).min(40.0),
        offset_y: (2.0 + elevation_f64 * 0.5).min(16.0),
        spread: (-2.0 + elevation_f64 * 0.1).min(2.0),
        color_tint: None,
    };

    // Use normalized elevation (0.0-1.0) for calculation
    let normalized_elevation = (elevation_f64 / 24.0).clamp(0.0, 1.0) * 10.0;
    let ambient = calculate_multi_scale_ambient(&ambient_params, background, normalized_elevation);

    ElevationShadow {
        contact,
        ambient,
        elevation,
    }
}

/// Convert elevation shadow to CSS box-shadow
///
/// Generates a comma-separated list of box-shadows combining
/// contact and ambient layers.
///
/// # Returns
///
/// CSS box-shadow property value
pub fn to_css(shadow: &ElevationShadow) -> String {
    let mut shadows = Vec::new();

    // Add contact shadow
    shadows.push(super::contact_shadow::to_css(&shadow.contact));

    // Add ambient shadows
    for ambient in &shadow.ambient {
        shadows.push(super::ambient_shadow::to_css(ambient));
    }

    shadows.join(", ")
}

/// Elevation presets following Apple Liquid Glass patterns
pub struct ElevationPresets;

impl ElevationPresets {
    /// Flush with surface (no elevation)
    pub const LEVEL_0: Elevation = 0;

    /// Subtle lift (standard buttons)
    pub const LEVEL_1: Elevation = 1;

    /// Hover state (interactive lift)
    pub const LEVEL_2: Elevation = 3;

    /// Floating cards
    pub const LEVEL_3: Elevation = 6;

    /// Modals, sheets
    pub const LEVEL_4: Elevation = 10;

    /// Dropdowns, tooltips
    pub const LEVEL_5: Elevation = 16;

    /// Drag state (maximum separation)
    pub const LEVEL_6: Elevation = 24;
}

/// Interactive elevation transition
///
/// Smoothly transitions between elevation levels for interactive states.
pub struct ElevationTransition {
    /// Resting elevation
    pub rest: Elevation,

    /// Hover elevation
    pub hover: Elevation,

    /// Active/pressed elevation
    pub active: Elevation,

    /// Focus elevation
    pub focus: Elevation,
}

impl ElevationTransition {
    /// Standard button elevation transitions
    pub fn button() -> Self {
        Self {
            rest: ElevationPresets::LEVEL_1,
            hover: ElevationPresets::LEVEL_2,
            active: ElevationPresets::LEVEL_0, // Press down
            focus: ElevationPresets::LEVEL_1,
        }
    }

    /// Card elevation transitions
    pub fn card() -> Self {
        Self {
            rest: ElevationPresets::LEVEL_2,
            hover: ElevationPresets::LEVEL_3,
            active: ElevationPresets::LEVEL_2,
            focus: ElevationPresets::LEVEL_3,
        }
    }

    /// Modal elevation (no transitions)
    pub fn modal() -> Self {
        Self {
            rest: ElevationPresets::LEVEL_4,
            hover: ElevationPresets::LEVEL_4,
            active: ElevationPresets::LEVEL_4,
            focus: ElevationPresets::LEVEL_4,
        }
    }

    /// Draggable element
    pub fn draggable() -> Self {
        Self {
            rest: ElevationPresets::LEVEL_1,
            hover: ElevationPresets::LEVEL_3,
            active: ElevationPresets::LEVEL_6, // Lift high when dragging
            focus: ElevationPresets::LEVEL_2,
        }
    }
}

/// Calculate shadow for interactive state
///
/// Convenience function for getting shadows based on element state.
pub fn calculate_interactive_shadow(
    transition: &ElevationTransition,
    state: InteractiveState,
    background: OKLCH,
    glass_depth: f64,
) -> ElevationShadow {
    let elevation = match state {
        InteractiveState::Rest => transition.rest,
        InteractiveState::Hover => transition.hover,
        InteractiveState::Active => transition.active,
        InteractiveState::Focus => transition.focus,
    };

    calculate_elevation_shadow(elevation, background, glass_depth)
}

/// Interactive element state
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InteractiveState {
    /// Default state (no interaction)
    Rest,
    /// Mouse hover state
    Hover,
    /// Active/pressed state
    Active,
    /// Keyboard focus state
    Focus,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_elevation_affects_shadow_size() {
        let background = OKLCH::new(0.95, 0.01, 240.0);

        let low = calculate_elevation_shadow(1, background, 1.0);
        let high = calculate_elevation_shadow(10, background, 1.0);

        // Higher elevation should have larger shadows
        assert!(high.contact.blur > low.contact.blur);
        assert!(high.contact.offset_y > low.contact.offset_y);
        assert!(high.ambient[0].blur > low.ambient[0].blur);
    }

    #[test]
    fn test_zero_elevation_minimal_shadow() {
        let background = OKLCH::new(0.95, 0.01, 240.0);
        let shadow = calculate_elevation_shadow(0, background, 1.0);

        // Zero elevation should have minimal but non-zero shadow
        assert!(shadow.contact.blur < 2.0);
        assert!(shadow.contact.opacity < 0.7);
    }

    #[test]
    fn test_high_elevation_prominent_shadow() {
        let background = OKLCH::new(0.95, 0.01, 240.0);
        let shadow = calculate_elevation_shadow(24, background, 1.0);

        // Maximum elevation should have prominent shadow
        assert!(shadow.contact.blur > 3.0);
        assert!(shadow.ambient.len() >= 2);
        assert!(shadow.ambient[0].blur > 20.0);
    }

    #[test]
    fn test_css_generation() {
        let background = OKLCH::new(0.95, 0.01, 240.0);
        let shadow = calculate_elevation_shadow(3, background, 1.0);
        let css = to_css(&shadow);

        // Should generate valid CSS with multiple shadows
        assert!(css.contains("oklch("));
        assert!(css.contains(",")); // Multiple shadows separated by comma
    }

    #[test]
    fn test_button_elevation_transition() {
        let transition = ElevationTransition::button();
        let background = OKLCH::new(0.95, 0.01, 240.0);

        let rest =
            calculate_interactive_shadow(&transition, InteractiveState::Rest, background, 1.0);

        let hover =
            calculate_interactive_shadow(&transition, InteractiveState::Hover, background, 1.0);

        let active =
            calculate_interactive_shadow(&transition, InteractiveState::Active, background, 1.0);

        // Hover should have more elevation than rest
        assert!(hover.elevation > rest.elevation);

        // Active should have less elevation (pressed down)
        assert!(active.elevation < rest.elevation);
    }

    #[test]
    fn test_glass_depth_affects_shadow() {
        let background = OKLCH::new(0.95, 0.01, 240.0);

        let thin = calculate_elevation_shadow(3, background, 0.5);
        let thick = calculate_elevation_shadow(3, background, 2.0);

        // Thicker glass should cast stronger shadow
        assert!(thick.contact.opacity > thin.contact.opacity);
    }
}
