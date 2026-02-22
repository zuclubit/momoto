//! # Perceptual Refraction System
//!
//! Models light bending through glass using perceptually-tuned parameters.
//!
//! ## Physical Background
//!
//! When light passes from air into glass, it bends according to Snell's law:
//!
//! ```text
//! n₁ sin(θ₁) = n₂ sin(θ₂)
//! ```
//!
//! This creates:
//! - **Lensing**: Objects appear shifted/magnified through glass
//! - **Chromatic aberration**: Different colors bend differently
//! - **Caustics**: Focused light patterns (complex, usually omitted in UI)
//!
//! ## Perceptual Adaptation
//!
//! For UI design, we don't need physical accuracy—we need *perceptual believability*.
//! This module provides simplified refraction that:
//! - Looks correct to human perception
//! - Performs well in real-time
//! - Integrates with OKLCH color space
//!
//! Real glass has n ≈ 1.5-1.9, but perceptually we can use lower values
//! (1.05-1.3) that give the "feel" of glass without extreme distortion.

use momoto_core::space::oklch::OKLCH;

/// Refraction parameters for perceptual light bending
#[derive(Debug, Clone, Copy)]
pub struct RefractionParams {
    /// Refractive index (1.0 = no bending, 1.5 = glass)
    /// UI range: 1.05 (subtle) to 1.3 (strong)
    pub index: f64,

    /// Distortion strength for background content
    /// 0.0 = no distortion, 1.0 = maximum
    pub distortion_strength: f64,

    /// Chromatic aberration amount
    /// 0.0 = none, 0.05 = subtle, 0.15 = strong
    pub chromatic_aberration: f64,

    /// Edge lensing (extra distortion at edges)
    /// 0.0 = uniform, 1.0 = strong edge effect
    pub edge_lensing: f64,
}

impl Default for RefractionParams {
    fn default() -> Self {
        Self {
            index: 1.15,
            distortion_strength: 0.3,
            chromatic_aberration: 0.02,
            edge_lensing: 0.4,
        }
    }
}

/// Result of refraction calculation
#[derive(Debug, Clone, Copy)]
pub struct RefractionResult {
    /// Apparent displacement in x direction
    pub offset_x: f64,

    /// Apparent displacement in y direction
    pub offset_y: f64,

    /// Color shift (hue rotation due to chromatic aberration)
    pub hue_shift: f64,

    /// Brightness adjustment (Fresnel darkening/brightening)
    pub brightness_factor: f64,
}

/// Calculate refraction offset for background content
///
/// This determines how much the background appears to shift when viewed
/// through glass at a given position.
///
/// # Arguments
///
/// * `params` - Refraction parameters
/// * `position_x` - Horizontal position (0.0 = left, 1.0 = right)
/// * `position_y` - Vertical position (0.0 = top, 1.0 = bottom)
/// * `incident_angle` - Angle of light incidence (0.0 = perpendicular, 90.0 = grazing)
///
/// # Returns
///
/// Refraction result with displacement and color shift
pub fn calculate_refraction(
    params: &RefractionParams,
    position_x: f64,
    position_y: f64,
    incident_angle: f64,
) -> RefractionResult {
    // Normalize inputs
    let pos_x = position_x.clamp(0.0, 1.0);
    let pos_y = position_y.clamp(0.0, 1.0);
    let angle = incident_angle.clamp(0.0, 89.0); // Avoid division by zero at 90°

    // 1. Calculate base refraction using simplified Snell's law
    let n1 = 1.0; // Air
    let n2 = params.index;
    let angle_rad = angle.to_radians();

    // sin(θ₂) = (n₁/n₂) × sin(θ₁)
    let sin_refracted = (n1 / n2) * angle_rad.sin();
    let refracted_angle = sin_refracted.asin();

    // Angular deviation
    let deviation = angle_rad - refracted_angle;

    // 2. Edge lensing effect
    // Glass edges cause more distortion due to longer path length
    let edge_distance = ((pos_x - 0.5).powi(2) + (pos_y - 0.5).powi(2)).sqrt();
    let edge_factor = 1.0 + params.edge_lensing * edge_distance;

    // 3. Calculate displacement
    let base_displacement = deviation.tan() * params.distortion_strength;
    let offset_x = base_displacement * edge_factor * (pos_x - 0.5).signum();
    let offset_y = base_displacement * edge_factor * (pos_y - 0.5).signum();

    // 4. Chromatic aberration
    // Different wavelengths refract differently
    // In perceptual terms: hue shifts slightly
    let hue_shift = params.chromatic_aberration * edge_distance * 360.0;

    // 5. Fresnel brightness adjustment
    // Light intensity changes based on angle
    let fresnel_factor = calculate_fresnel_brightness(n1, n2, angle_rad);
    let brightness_factor = 1.0 + (fresnel_factor - 1.0) * 0.3; // Damped for UI

    RefractionResult {
        offset_x,
        offset_y,
        hue_shift,
        brightness_factor,
    }
}

/// Calculate Fresnel brightness factor
///
/// Fresnel equations describe how much light is reflected vs transmitted
/// based on incident angle. This affects apparent brightness through glass.
fn calculate_fresnel_brightness(n1: f64, n2: f64, incident_angle: f64) -> f64 {
    let cos_i = incident_angle.cos();
    let sin_i = incident_angle.sin();

    // Snell's law for transmitted angle
    let sin_t = (n1 / n2) * sin_i;

    // Check for total internal reflection
    if sin_t.abs() > 1.0 {
        return 0.0; // No transmission
    }

    let cos_t = (1.0 - sin_t.powi(2)).sqrt();

    // Fresnel equations (average of s and p polarization)
    let rs = ((n1 * cos_i - n2 * cos_t) / (n1 * cos_i + n2 * cos_t)).powi(2);
    let rp = ((n1 * cos_t - n2 * cos_i) / (n1 * cos_t + n2 * cos_i)).powi(2);
    let reflectance = (rs + rp) / 2.0;

    // Transmittance = 1 - Reflectance
    1.0 - reflectance
}

/// Apply refraction to a color
///
/// Adjusts color based on refraction effects (chromatic aberration, brightness)
///
/// # Arguments
///
/// * `color` - Original color in OKLCH
/// * `refraction` - Refraction result from calculate_refraction
///
/// # Returns
///
/// Modified color with refraction effects applied
pub fn apply_refraction_to_color(color: OKLCH, refraction: &RefractionResult) -> OKLCH {
    // Apply chromatic aberration (hue shift)
    let shifted_hue = color.h + refraction.hue_shift;
    let normalized_hue = ((shifted_hue % 360.0) + 360.0) % 360.0;

    // Apply brightness adjustment (preserve perceptual uniformity)
    let adjusted_lightness = (color.l * refraction.brightness_factor).clamp(0.0, 1.0);

    OKLCH::new(adjusted_lightness, color.c, normalized_hue)
}

/// Refraction presets for common glass types
pub struct RefractionPresets;

impl RefractionPresets {
    /// Standard clear glass
    /// Subtle distortion, minimal chromatic aberration
    pub fn clear() -> RefractionParams {
        RefractionParams {
            index: 1.1,
            distortion_strength: 0.15,
            chromatic_aberration: 0.01,
            edge_lensing: 0.2,
        }
    }

    /// Frosted/etched glass
    /// Light scattering reduces sharp refraction
    pub fn frosted() -> RefractionParams {
        RefractionParams {
            index: 1.08,
            distortion_strength: 0.05,
            chromatic_aberration: 0.005,
            edge_lensing: 0.1,
        }
    }

    /// Thick decorative glass
    /// Strong lensing effect
    pub fn thick() -> RefractionParams {
        RefractionParams {
            index: 1.25,
            distortion_strength: 0.5,
            chromatic_aberration: 0.04,
            edge_lensing: 0.6,
        }
    }

    /// Subtle overlay (barely noticeable)
    pub fn subtle() -> RefractionParams {
        RefractionParams {
            index: 1.05,
            distortion_strength: 0.08,
            chromatic_aberration: 0.003,
            edge_lensing: 0.05,
        }
    }

    /// High-index glass (strong effect)
    pub fn high_index() -> RefractionParams {
        RefractionParams {
            index: 1.3,
            distortion_strength: 0.7,
            chromatic_aberration: 0.06,
            edge_lensing: 0.8,
        }
    }
}

/// Calculate distortion map for efficient rendering
///
/// Pre-computes a grid of refraction offsets that can be used
/// for real-time rendering with CSS or canvas.
///
/// # Arguments
///
/// * `params` - Refraction parameters
/// * `grid_size` - Resolution of the distortion map (e.g., 16x16)
///
/// # Returns
///
/// 2D array of refraction results
pub fn generate_distortion_map(
    params: &RefractionParams,
    grid_size: usize,
) -> Vec<Vec<RefractionResult>> {
    let mut map = Vec::with_capacity(grid_size);

    for y in 0..grid_size {
        let mut row = Vec::with_capacity(grid_size);
        let pos_y = y as f64 / (grid_size - 1) as f64;

        for x in 0..grid_size {
            let pos_x = x as f64 / (grid_size - 1) as f64;

            // Assume light comes from above at slight angle
            let incident_angle = 15.0; // Degrees

            let refraction = calculate_refraction(params, pos_x, pos_y, incident_angle);

            row.push(refraction);
        }

        map.push(row);
    }

    map
}

#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;

    #[test]
    fn test_perpendicular_incidence_minimal_distortion() {
        let params = RefractionParams::default();
        let result = calculate_refraction(&params, 0.5, 0.5, 0.0);

        // At center with perpendicular incidence, distortion should be minimal
        assert!(result.offset_x.abs() < 0.01);
        assert!(result.offset_y.abs() < 0.01);
    }

    #[test]
    fn test_edge_lensing_increases_distortion() {
        let params = RefractionParams {
            edge_lensing: 0.8,
            ..Default::default()
        };

        let center = calculate_refraction(&params, 0.5, 0.5, 30.0);
        let edge = calculate_refraction(&params, 0.0, 0.0, 30.0);

        // Edge should have more distortion
        let center_dist = (center.offset_x.powi(2) + center.offset_y.powi(2)).sqrt();
        let edge_dist = (edge.offset_x.powi(2) + edge.offset_y.powi(2)).sqrt();

        assert!(edge_dist > center_dist);
    }

    #[test]
    fn test_higher_index_more_refraction() {
        let low = RefractionParams {
            index: 1.1,
            ..Default::default()
        };
        let high = RefractionParams {
            index: 1.5,
            ..Default::default()
        };

        let low_result = calculate_refraction(&low, 0.3, 0.3, 45.0);
        let high_result = calculate_refraction(&high, 0.3, 0.3, 45.0);

        let low_dist = (low_result.offset_x.powi(2) + low_result.offset_y.powi(2)).sqrt();
        let high_dist = (high_result.offset_x.powi(2) + high_result.offset_y.powi(2)).sqrt();

        // Higher index should cause more distortion
        assert!(high_dist > low_dist);
    }

    #[test]
    fn test_chromatic_aberration_shifts_hue() {
        let params = RefractionParams {
            chromatic_aberration: 0.1,
            ..Default::default()
        };

        let result = calculate_refraction(&params, 0.0, 0.0, 30.0);

        // Should have some hue shift
        assert!(result.hue_shift.abs() > 0.0);
    }

    #[test]
    fn test_color_refraction() {
        let color = OKLCH::new(0.7, 0.15, 240.0);
        let refraction = RefractionResult {
            offset_x: 0.0,
            offset_y: 0.0,
            hue_shift: 10.0,
            brightness_factor: 1.1,
        };

        let refracted = apply_refraction_to_color(color, &refraction);

        // Hue should be shifted
        assert_relative_eq!(refracted.h, 250.0, epsilon = 0.1);

        // Lightness should be adjusted
        assert!(refracted.l > color.l);
    }

    #[test]
    fn test_distortion_map_generation() {
        let params = RefractionParams::default();
        let map = generate_distortion_map(&params, 8);

        // Should be 8x8 grid
        assert_eq!(map.len(), 8);
        assert_eq!(map[0].len(), 8);

        // Center should have less distortion than corners
        let center = &map[4][4];
        let corner = &map[0][0];

        let center_dist = (center.offset_x.powi(2) + center.offset_y.powi(2)).sqrt();
        let corner_dist = (corner.offset_x.powi(2) + corner.offset_y.powi(2)).sqrt();

        assert!(corner_dist >= center_dist);
    }
}
