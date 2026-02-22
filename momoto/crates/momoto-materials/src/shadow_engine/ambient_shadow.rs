//! # Ambient Shadow System
//!
//! Soft, diffuse shadows from environmental light occlusion.
//!
//! ## What Are Ambient Shadows?
//!
//! Ambient shadows (also called "soft shadows" or "penumbra") represent
//! light blocked by an object from reaching the background. Unlike contact
//! shadows which are sharp and localized, ambient shadows are:
//!
//! - **Soft and blurred**: Large blur radius (8-24px typical)
//! - **Lighter**: Less opaque than contact shadows (30-50% opacity)
//! - **Larger spread**: Extends beyond the element boundary
//!
//! In Apple's Liquid Glass, ambient shadows create atmospheric depth and
//! help separate glass elements from their background.
//!
//! ## Physical Basis
//!
//! Ambient shadows approximate:
//! 1. **Area light source**: Large light source (sky, ceiling) not a point
//! 2. **Partial occlusion**: Element blocks some but not all ambient light
//! 3. **Light scatter**: Bounced light softens shadow edges
//!
//! This creates soft, gradual transitions characteristic of real-world shadows.

use momoto_core::space::oklch::OKLCH;

/// Ambient shadow configuration
#[derive(Debug, Clone, Copy)]
pub struct AmbientShadowParams {
    /// Base shadow opacity (0.0 = none, 1.0 = opaque)
    /// Typically 0.2-0.4 for glass
    pub base_opacity: f64,

    /// Blur radius in pixels
    /// Ambient shadows are soft: typically 12-24px
    pub blur_radius: f64,

    /// Vertical offset in pixels
    /// Usually larger than contact shadow (2-8px)
    pub offset_y: f64,

    /// Shadow spread in pixels
    /// Positive values make shadow larger than element
    pub spread: f64,

    /// Shadow color tint
    /// None = derive from background, Some = custom color
    pub color_tint: Option<OKLCH>,
}

impl Default for AmbientShadowParams {
    fn default() -> Self {
        Self {
            base_opacity: 0.3,
            blur_radius: 16.0,
            offset_y: 4.0,
            spread: -2.0, // Slightly smaller than element
            color_tint: None,
        }
    }
}

/// Ambient shadow result
#[derive(Debug, Clone, Copy)]
pub struct AmbientShadow {
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

/// Calculate ambient shadow for glass element
///
/// Generates a soft, diffuse shadow representing environmental light occlusion.
///
/// # Arguments
///
/// * `params` - Ambient shadow parameters
/// * `background` - Background color (affects shadow color)
/// * `elevation` - Element elevation in arbitrary units (0-10 typical)
///
/// # Returns
///
/// Ambient shadow specification
///
/// # Example
///
/// ```rust
/// use momoto_materials::shadow_engine::ambient_shadow::{
///     AmbientShadowParams, calculate_ambient_shadow
/// };
/// use momoto_core::space::oklch::OKLCH;
///
/// let params = AmbientShadowParams::default();
/// let background = OKLCH::new(0.95, 0.01, 240.0);
/// let shadow = calculate_ambient_shadow(&params, background, 2.0);
///
/// println!("Shadow blur: {:.1}px", shadow.blur);
/// ```
pub fn calculate_ambient_shadow(
    params: &AmbientShadowParams,
    background: OKLCH,
    elevation: f64,
) -> AmbientShadow {
    // 1. Shadow color: darker than background but not black
    let color = if let Some(tint) = params.color_tint {
        tint
    } else {
        // Derive from background: darken and slightly desaturate
        let shadow_lightness = (background.l * 0.4).clamp(0.1, 0.4);
        let shadow_chroma = background.c * 0.6; // Less saturated
        let shadow_hue = background.h;

        OKLCH::new(shadow_lightness, shadow_chroma, shadow_hue)
    };

    // 2. Elevation affects shadow properties
    // Higher elevation = larger, softer, more visible shadow
    let elevation_factor = (elevation * 0.3 + 1.0).clamp(1.0, 3.0);

    // Blur increases with elevation (shadow spreads more when further from surface)
    let blur = params.blur_radius * elevation_factor;

    // Offset increases with elevation (shadow moves further down)
    let offset_y = params.offset_y * elevation_factor;

    // Opacity adjusts with elevation (higher = more visible, but not linear)
    let opacity_factor = (elevation * 0.15 + 1.0).clamp(1.0, 1.5);
    let opacity = (params.base_opacity * opacity_factor).clamp(0.0, 1.0);

    // 3. Background lightness affects opacity
    // Darker backgrounds need less shadow (already low contrast)
    let background_factor = (background.l * 0.5 + 0.5).clamp(0.6, 1.0);
    let adjusted_opacity = (opacity * background_factor).clamp(0.0, 1.0);

    AmbientShadow {
        color,
        blur,
        offset_y,
        spread: params.spread,
        opacity: adjusted_opacity,
    }
}

/// Calculate multi-scale ambient shadow
///
/// Creates layered ambient shadows for more realistic depth.
/// Uses 2-3 shadows with different sizes/opacities.
///
/// # Returns
///
/// Vector of ambient shadows (typically 2-3 layers)
pub fn calculate_multi_scale_ambient(
    params: &AmbientShadowParams,
    background: OKLCH,
    elevation: f64,
) -> Vec<AmbientShadow> {
    let mut shadows = Vec::new();

    // Layer 1: Close, medium blur
    let close = calculate_ambient_shadow(
        &AmbientShadowParams {
            blur_radius: params.blur_radius * 0.6,
            offset_y: params.offset_y * 0.5,
            base_opacity: params.base_opacity * 0.8,
            ..*params
        },
        background,
        elevation,
    );
    shadows.push(close);

    // Layer 2: Far, large blur
    let far = calculate_ambient_shadow(params, background, elevation);
    shadows.push(far);

    // Layer 3: Extra far for high elevations
    if elevation > 3.0 {
        let extra_far = calculate_ambient_shadow(
            &AmbientShadowParams {
                blur_radius: params.blur_radius * 1.5,
                offset_y: params.offset_y * 1.8,
                base_opacity: params.base_opacity * 0.4,
                ..*params
            },
            background,
            elevation,
        );
        shadows.push(extra_far);
    }

    shadows
}

/// Convert ambient shadow to CSS box-shadow
pub fn to_css(shadow: &AmbientShadow) -> String {
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

/// Ambient shadow presets
pub struct AmbientShadowPresets;

impl AmbientShadowPresets {
    /// Standard glass ambient shadow
    pub fn standard() -> AmbientShadowParams {
        AmbientShadowParams {
            base_opacity: 0.3,
            blur_radius: 16.0,
            offset_y: 4.0,
            spread: -2.0,
            color_tint: None,
        }
    }

    /// Elevated glass (floating above surface)
    pub fn elevated() -> AmbientShadowParams {
        AmbientShadowParams {
            base_opacity: 0.4,
            blur_radius: 24.0,
            offset_y: 8.0,
            spread: -1.0,
            color_tint: None,
        }
    }

    /// Subtle (barely noticeable)
    pub fn subtle() -> AmbientShadowParams {
        AmbientShadowParams {
            base_opacity: 0.15,
            blur_radius: 12.0,
            offset_y: 2.0,
            spread: -3.0,
            color_tint: None,
        }
    }

    /// Dramatic (strong depth)
    pub fn dramatic() -> AmbientShadowParams {
        AmbientShadowParams {
            base_opacity: 0.5,
            blur_radius: 32.0,
            offset_y: 12.0,
            spread: 0.0,
            color_tint: None,
        }
    }

    /// Colored ambient (custom tint)
    pub fn colored(tint: OKLCH) -> AmbientShadowParams {
        AmbientShadowParams {
            base_opacity: 0.25,
            blur_radius: 20.0,
            offset_y: 6.0,
            spread: -2.0,
            color_tint: Some(tint),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ambient_shadow_calculation() {
        let params = AmbientShadowParams::default();
        let background = OKLCH::new(0.95, 0.01, 240.0);
        let shadow = calculate_ambient_shadow(&params, background, 1.0);

        // Shadow should be darker than background but not black
        assert!(shadow.color.l < background.l);
        assert!(shadow.color.l > 0.0);

        // Should be softer than contact shadow
        assert!(shadow.blur > 10.0);

        // Opacity should be reasonable
        assert!(shadow.opacity > 0.0 && shadow.opacity <= 1.0);
    }

    #[test]
    fn test_elevation_increases_shadow() {
        let params = AmbientShadowParams::default();
        let background = OKLCH::new(0.95, 0.01, 240.0);

        let low = calculate_ambient_shadow(&params, background, 1.0);
        let high = calculate_ambient_shadow(&params, background, 5.0);

        // Higher elevation = more blur
        assert!(high.blur > low.blur);

        // Higher elevation = larger offset
        assert!(high.offset_y > low.offset_y);

        // Higher elevation = more visible
        assert!(high.opacity > low.opacity);
    }

    #[test]
    fn test_custom_color_tint() {
        let tint = OKLCH::new(0.3, 0.1, 280.0); // Purple tint
        let params = AmbientShadowParams {
            color_tint: Some(tint),
            ..Default::default()
        };

        let background = OKLCH::new(0.95, 0.01, 240.0);
        let shadow = calculate_ambient_shadow(&params, background, 1.0);

        // Should use custom tint
        assert!((shadow.color.h - tint.h).abs() < 1.0);
    }

    #[test]
    fn test_multi_scale_shadows() {
        let params = AmbientShadowParams::default();
        let background = OKLCH::new(0.95, 0.01, 240.0);

        // Low elevation: 2 shadows
        let low_shadows = calculate_multi_scale_ambient(&params, background, 2.0);
        assert_eq!(low_shadows.len(), 2);

        // High elevation: 3 shadows
        let high_shadows = calculate_multi_scale_ambient(&params, background, 5.0);
        assert_eq!(high_shadows.len(), 3);

        // Each layer should have different properties
        assert!(high_shadows[0].blur < high_shadows[1].blur);
        assert!(high_shadows[1].blur < high_shadows[2].blur);
    }

    #[test]
    fn test_darker_background_reduces_opacity() {
        let params = AmbientShadowParams::default();

        let light_bg = OKLCH::new(0.95, 0.01, 240.0);
        let dark_bg = OKLCH::new(0.2, 0.01, 240.0);

        let light_shadow = calculate_ambient_shadow(&params, light_bg, 2.0);
        let dark_shadow = calculate_ambient_shadow(&params, dark_bg, 2.0);

        // Light background needs more contrast
        assert!(light_shadow.opacity > dark_shadow.opacity);
    }
}
