//! # Contact Shadow System
//!
//! Sharp, dark shadows that appear where glass touches the background.
//!
//! ## What Are Contact Shadows?
//!
//! Contact shadows (also called "core shadows") are the darkest shadows that
//! appear at points of contact between objects. For glass UI elements:
//!
//! - **Sharp and defined**: Crisp edges at the contact point
//! - **Very dark**: High contrast to indicate direct contact
//! - **Small spread**: Only visible immediately at the boundary
//!
//! In Apple's Liquid Glass, contact shadows create the sense that glass
//! elements are physically resting on the background, not floating.
//!
//! ## Physical Basis
//!
//! Contact shadows occur because:
//! 1. No light can reach the contact area (complete occlusion)
//! 2. No bounce light from environment
//! 3. Glass blocks all direct illumination
//!
//! This creates near-black shadows regardless of ambient lighting.

use momoto_core::space::oklch::OKLCH;

/// Contact shadow configuration
#[derive(Debug, Clone, Copy)]
pub struct ContactShadowParams {
    /// Shadow darkness (0.0 = no shadow, 1.0 = pure black)
    /// Typically 0.6-0.9 for realistic glass
    pub darkness: f64,

    /// Shadow blur radius in pixels
    /// Contact shadows are sharp: typically 1-3px
    pub blur_radius: f64,

    /// Vertical offset in pixels
    /// Usually 0 or very small (0.5-1px)
    pub offset_y: f64,

    /// Shadow spread (positive = expand, negative = contract)
    /// Usually 0 for contact shadows
    pub spread: f64,
}

impl Default for ContactShadowParams {
    fn default() -> Self {
        Self {
            darkness: 0.75,
            blur_radius: 2.0,
            offset_y: 0.5,
            spread: 0.0,
        }
    }
}

/// Contact shadow result
#[derive(Debug, Clone, Copy)]
pub struct ContactShadow {
    /// Shadow color in OKLCH
    pub color: OKLCH,

    /// Blur radius (px)
    pub blur: f64,

    /// Vertical offset (px)
    pub offset_y: f64,

    /// Spread (px)
    pub spread: f64,

    /// Opacity (0.0-1.0)
    pub opacity: f64,
}

/// Calculate contact shadow for glass element
///
/// Generates a sharp, dark shadow at the point where glass meets background.
///
/// # Arguments
///
/// * `params` - Contact shadow parameters
/// * `background` - Background color (affects shadow visibility)
/// * `glass_depth` - Perceived thickness of glass (affects shadow intensity)
///
/// # Returns
///
/// Contact shadow specification
///
/// # Example
///
/// ```rust
/// use momoto_materials::shadow_engine::contact_shadow::{
///     ContactShadowParams, calculate_contact_shadow
/// };
/// use momoto_core::space::oklch::OKLCH;
///
/// let params = ContactShadowParams::default();
/// let background = OKLCH::new(0.95, 0.01, 240.0); // Light background
/// let shadow = calculate_contact_shadow(&params, background, 1.0);
///
/// println!("Shadow opacity: {:.2}", shadow.opacity);
/// ```
pub fn calculate_contact_shadow(
    params: &ContactShadowParams,
    background: OKLCH,
    glass_depth: f64,
) -> ContactShadow {
    // 1. Shadow color: very dark, slightly tinted toward background hue
    let shadow_lightness = (1.0 - params.darkness) * 0.2; // Very dark
    let shadow_chroma = background.c * 0.3; // Slightly chromatic
    let shadow_hue = background.h;

    let color = OKLCH::new(shadow_lightness, shadow_chroma, shadow_hue);

    // 2. Opacity: adjust based on background lightness
    // Darker backgrounds need less opaque shadows (already dark)
    // Lighter backgrounds need more opaque shadows (contrast)
    let opacity_factor = (background.l * 0.5 + 0.5).clamp(0.5, 1.0);
    let opacity = params.darkness * opacity_factor;

    // 3. Depth affects shadow intensity
    // Thicker glass = heavier shadow
    let depth_factor = (glass_depth * 0.3 + 0.7).clamp(0.7, 1.3);
    let adjusted_opacity = (opacity * depth_factor).clamp(0.0, 1.0);

    ContactShadow {
        color,
        blur: params.blur_radius,
        offset_y: params.offset_y,
        spread: params.spread,
        opacity: adjusted_opacity,
    }
}

/// Convert contact shadow to CSS box-shadow
///
/// # Returns
///
/// CSS box-shadow string
pub fn to_css(shadow: &ContactShadow) -> String {
    format!(
        "0 {:.1}px {:.1}px {:.1}px oklch({:.3} {:.3} {:.1} / {:.2})",
        shadow.offset_y,
        shadow.blur,
        shadow.spread,
        shadow.color.l,
        shadow.color.c,
        shadow.color.h,
        shadow.opacity,
    )
}

/// Contact shadow presets
pub struct ContactShadowPresets;

impl ContactShadowPresets {
    /// Standard glass contact shadow
    pub fn standard() -> ContactShadowParams {
        ContactShadowParams {
            darkness: 0.75,
            blur_radius: 2.0,
            offset_y: 0.5,
            spread: 0.0,
        }
    }

    /// Floating glass (lighter contact)
    pub fn floating() -> ContactShadowParams {
        ContactShadowParams {
            darkness: 0.5,
            blur_radius: 1.5,
            offset_y: 0.25,
            spread: 0.0,
        }
    }

    /// Grounded glass (heavy contact)
    pub fn grounded() -> ContactShadowParams {
        ContactShadowParams {
            darkness: 0.85,
            blur_radius: 3.0,
            offset_y: 1.0,
            spread: 0.5,
        }
    }

    /// Subtle (barely visible)
    pub fn subtle() -> ContactShadowParams {
        ContactShadowParams {
            darkness: 0.4,
            blur_radius: 1.0,
            offset_y: 0.25,
            spread: 0.0,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_contact_shadow_calculation() {
        let params = ContactShadowParams::default();
        let background = OKLCH::new(0.95, 0.01, 240.0);
        let shadow = calculate_contact_shadow(&params, background, 1.0);

        // Shadow should be dark
        assert!(shadow.color.l < 0.3);

        // Opacity should be reasonable
        assert!(shadow.opacity > 0.0 && shadow.opacity <= 1.0);

        // Should inherit background hue
        assert!((shadow.color.h - background.h).abs() < 1.0);
    }

    #[test]
    fn test_darker_background_reduces_opacity() {
        let params = ContactShadowParams::default();
        let light_bg = OKLCH::new(0.95, 0.01, 240.0);
        let dark_bg = OKLCH::new(0.2, 0.01, 240.0);

        let light_shadow = calculate_contact_shadow(&params, light_bg, 1.0);
        let dark_shadow = calculate_contact_shadow(&params, dark_bg, 1.0);

        // Lighter background should have more opaque shadow (more contrast needed)
        assert!(light_shadow.opacity > dark_shadow.opacity);
    }

    #[test]
    fn test_glass_depth_affects_shadow() {
        let params = ContactShadowParams::default();
        let background = OKLCH::new(0.95, 0.01, 240.0);

        let thin = calculate_contact_shadow(&params, background, 0.3);
        let thick = calculate_contact_shadow(&params, background, 2.0);

        // Thicker glass should have stronger shadow
        assert!(thick.opacity > thin.opacity);
    }

    #[test]
    fn test_css_output() {
        let shadow = ContactShadow {
            color: OKLCH::new(0.15, 0.01, 240.0),
            blur: 2.0,
            offset_y: 0.5,
            spread: 0.0,
            opacity: 0.75,
        };

        let css = to_css(&shadow);

        // Should contain expected CSS box-shadow format
        assert!(css.contains("oklch("));
        assert!(css.contains("0.5px")); // offset
        assert!(css.contains("2.0px")); // blur
    }
}
