//! # Multi-Layer Transmittance System
//!
//! Beer-Lambert inspired light transmission through glass materials.
//!
//! ## Physical Model
//!
//! Real glass doesn't just fade linearly—light transmission follows exponential
//! decay based on material thickness and optical properties:
//!
//! ```text
//! I(x) = I₀ × e^(-μx)
//! ```
//!
//! Where:
//! - I(x) = transmitted intensity at depth x
//! - I₀ = incident intensity
//! - μ = extinction coefficient (absorption + scattering)
//! - x = path length through material
//!
//! ## Layers
//!
//! Glass is composed of multiple physical layers:
//! 1. **Surface**: Air-glass interface (Fresnel reflections)
//! 2. **Volume**: Bulk material (absorption, scattering)
//! 3. **Substrate**: Glass-background interface (transmission)
//!
//! This creates the characteristic multi-layer appearance of real glass.

use std::f64::consts::E;

/// Optical properties of glass material
#[derive(Debug, Clone, Copy)]
pub struct OpticalProperties {
    /// Absorption coefficient (how much light is absorbed)
    /// Range: 0.0 (clear) to 1.0 (opaque)
    pub absorption_coefficient: f64,

    /// Scattering coefficient (how much light diffuses)
    /// Range: 0.0 (no scatter) to 1.0 (heavy frosting)
    pub scattering_coefficient: f64,

    /// Material thickness in arbitrary units
    /// Range: 0.1 (thin) to 10.0 (thick)
    pub thickness: f64,

    /// Refractive index (controls light bending)
    /// Typical glass: 1.5-1.9
    pub refractive_index: f64,
}

impl Default for OpticalProperties {
    fn default() -> Self {
        Self {
            absorption_coefficient: 0.15,
            scattering_coefficient: 0.25,
            thickness: 1.0,
            refractive_index: 1.5,
        }
    }
}

/// Result of light transmission through glass layers
#[derive(Debug, Clone, Copy)]
pub struct TransmittanceResult {
    /// Total light transmitted (0.0 = opaque, 1.0 = transparent)
    pub transmitted: f64,

    /// Light absorbed by material
    pub absorbed: f64,

    /// Light scattered (frosting effect)
    pub scattered: f64,

    /// Light reflected at surface (Fresnel)
    pub reflected: f64,
}

/// Calculate non-linear transmittance using Beer-Lambert law
///
/// This models realistic light transmission through glass:
/// - Exponential decay based on thickness
/// - Separate absorption and scattering
/// - Surface reflections (Fresnel)
///
/// # Arguments
///
/// * `props` - Optical properties of the glass material
/// * `incident_intensity` - Incoming light intensity (0.0-1.0)
///
/// # Returns
///
/// Transmittance result with light distribution
///
/// # Example
///
/// ```rust
/// use momoto_materials::glass_physics::transmittance::{
///     calculate_transmittance, OpticalProperties
/// };
///
/// let props = OpticalProperties {
///     absorption_coefficient: 0.2,
///     scattering_coefficient: 0.3,
///     thickness: 1.5,
///     refractive_index: 1.5,
/// };
///
/// let result = calculate_transmittance(&props, 1.0);
/// println!("Transmitted: {:.2}%", result.transmitted * 100.0);
/// ```
pub fn calculate_transmittance(
    props: &OpticalProperties,
    incident_intensity: f64,
) -> TransmittanceResult {
    // Clamp input
    let incident = incident_intensity.clamp(0.0, 1.0);

    // 1. Surface reflection (Fresnel at normal incidence)
    // Simplified Fresnel equation for perpendicular incidence:
    // R = ((n₁ - n₂) / (n₁ + n₂))²
    let n1 = 1.0; // Air
    let n2 = props.refractive_index;
    let fresnel_reflectance = ((n1 - n2) / (n1 + n2)).powi(2);
    let reflected = incident * fresnel_reflectance;

    // Light entering glass after surface reflection
    let entering = incident - reflected;

    // 2. Volume absorption (Beer-Lambert law)
    // I = I₀ × e^(-μₐ × d)
    let absorption_factor = E.powf(-props.absorption_coefficient * props.thickness);
    let after_absorption = entering * absorption_factor;

    // 3. Volume scattering (Rayleigh-inspired)
    // Scattering increases with thickness but saturates
    let scattering_factor = 1.0 - props.scattering_coefficient * (1.0 - E.powf(-props.thickness));
    let after_scattering = after_absorption * scattering_factor;

    // Light that was scattered
    let scattered = after_absorption - after_scattering;

    // Light that was absorbed
    let absorbed = entering - after_absorption;

    // Final transmitted light
    let transmitted = after_scattering;

    TransmittanceResult {
        transmitted,
        absorbed,
        scattered,
        reflected,
    }
}

/// Multi-layer glass composition
///
/// Real glass has distinct visual layers:
/// - **Edge highlight**: Bright rim from surface reflections
/// - **Volume**: Main glass body with absorption/scattering
/// - **Substrate**: Deep shadow where glass meets background
#[derive(Debug, Clone, Copy)]
pub struct LayerTransmittance {
    /// Surface layer (edge highlight)
    /// High reflectivity, bright
    pub surface: f64,

    /// Volume layer (glass body)
    /// Main transmittance value
    pub volume: f64,

    /// Substrate layer (deep contact)
    /// Darkest layer, creates depth
    pub substrate: f64,
}

/// Calculate multi-layer transmittance for realistic glass rendering
///
/// This decomposes transmittance into three distinct layers that create
/// the characteristic appearance of Apple Liquid Glass.
///
/// # Arguments
///
/// * `props` - Optical properties of the glass
/// * `incident_intensity` - Incoming light intensity
///
/// # Returns
///
/// Layer-separated transmittance values for rendering
pub fn calculate_multi_layer_transmittance(
    props: &OpticalProperties,
    incident_intensity: f64,
) -> LayerTransmittance {
    let result = calculate_transmittance(props, incident_intensity);

    // Surface layer: dominated by Fresnel reflections
    // Creates the bright edge highlight
    let surface = result.reflected + result.scattered * 0.3;

    // Volume layer: main glass appearance
    // This is what we see as "the glass"
    let volume = result.transmitted;

    // Substrate layer: contact shadow effect
    // Darker region where glass meets background
    // Models increased path length at edges (2D approximation of 3D effect)
    let edge_darkening = 1.0 - (props.thickness * 0.15).min(0.4);
    let substrate = result.transmitted * edge_darkening;

    LayerTransmittance {
        surface: surface.clamp(0.0, 1.0),
        volume: volume.clamp(0.0, 1.0),
        substrate: substrate.clamp(0.0, 1.0),
    }
}

/// Glass material presets based on real-world materials
pub struct GlassPresets;

impl GlassPresets {
    /// Standard window glass
    /// Clear, minimal absorption
    pub fn window() -> OpticalProperties {
        OpticalProperties {
            absorption_coefficient: 0.08,
            scattering_coefficient: 0.05,
            thickness: 0.8,
            refractive_index: 1.52,
        }
    }

    /// Frosted glass
    /// Heavy scattering, soft appearance
    pub fn frosted() -> OpticalProperties {
        OpticalProperties {
            absorption_coefficient: 0.12,
            scattering_coefficient: 0.85,
            thickness: 1.2,
            refractive_index: 1.5,
        }
    }

    /// Thick decorative glass
    /// High absorption, visible tint
    pub fn thick() -> OpticalProperties {
        OpticalProperties {
            absorption_coefficient: 0.35,
            scattering_coefficient: 0.3,
            thickness: 3.0,
            refractive_index: 1.6,
        }
    }

    /// Subtle overlay glass
    /// Very transparent, minimal effect
    pub fn subtle() -> OpticalProperties {
        OpticalProperties {
            absorption_coefficient: 0.05,
            scattering_coefficient: 0.15,
            thickness: 0.4,
            refractive_index: 1.45,
        }
    }

    /// Tinted glass (colored)
    /// Moderate absorption, minimal scatter
    pub fn tinted() -> OpticalProperties {
        OpticalProperties {
            absorption_coefficient: 0.25,
            scattering_coefficient: 0.1,
            thickness: 1.0,
            refractive_index: 1.5,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;

    #[test]
    fn test_basic_transmittance() {
        let props = OpticalProperties::default();
        let result = calculate_transmittance(&props, 1.0);

        // Total light should be conserved (within numerical error)
        let total = result.transmitted + result.absorbed + result.scattered + result.reflected;
        assert_relative_eq!(total, 1.0, epsilon = 0.01);

        // Transmitted should be less than incident
        assert!(result.transmitted < 1.0);
        assert!(result.transmitted > 0.0);
    }

    #[test]
    fn test_thickness_affects_transmittance() {
        let thin = OpticalProperties {
            thickness: 0.5,
            ..Default::default()
        };
        let thick = OpticalProperties {
            thickness: 3.0,
            ..Default::default()
        };

        let thin_result = calculate_transmittance(&thin, 1.0);
        let thick_result = calculate_transmittance(&thick, 1.0);

        // Thicker glass should transmit less light
        assert!(thin_result.transmitted > thick_result.transmitted);
    }

    #[test]
    fn test_multi_layer_structure() {
        let props = OpticalProperties::default();
        let layers = calculate_multi_layer_transmittance(&props, 1.0);

        // All layers should be in valid range
        assert!(layers.surface >= 0.0 && layers.surface <= 1.0);
        assert!(layers.volume >= 0.0 && layers.volume <= 1.0);
        assert!(layers.substrate >= 0.0 && layers.substrate <= 1.0);

        // Substrate should be darker than volume (edge darkening)
        assert!(layers.substrate <= layers.volume);
    }

    #[test]
    fn test_frosted_glass_scatters_more() {
        let clear = GlassPresets::window();
        let frosted = GlassPresets::frosted();

        let clear_result = calculate_transmittance(&clear, 1.0);
        let frosted_result = calculate_transmittance(&frosted, 1.0);

        // Frosted glass should scatter more light
        assert!(frosted_result.scattered > clear_result.scattered);
    }

    #[test]
    fn test_fresnel_reflection() {
        let props = OpticalProperties::default();
        let result = calculate_transmittance(&props, 1.0);

        // Should have some surface reflection (Fresnel effect)
        assert!(result.reflected > 0.0);

        // Reflection should be relatively small for glass
        assert!(result.reflected < 0.1); // Less than 10%
    }
}
