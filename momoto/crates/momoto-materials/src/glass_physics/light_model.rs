//! # Physical Light Model for Glass Materials
//!
//! Simulates how light interacts with glass surfaces to derive physically-based
//! gradients and highlights.
//!
//! ## Why This Matters
//!
//! Most UI glass effects use **decorative gradients**—arbitrary linear gradients
//! that "look nice" but don't follow physical rules. This creates visual
//! inconsistency and breaks down under different lighting conditions.
//!
//! **Physics-derived gradients** respond to virtual light sources, creating:
//! - Consistent highlight placement
//! - Realistic edge brightening
//! - Natural shadow gradients
//! - Believable specular reflections
//!
//! ## Light Model
//!
//! We simulate a simple virtual environment:
//! - **Key light**: Primary directional light (e.g., from top-left)
//! - **Fill light**: Soft ambient light (prevents pure black shadows)
//! - **Environment**: Background color affects glass appearance
//!
//! This is enough to create convincing glass without full ray tracing.

use momoto_core::space::oklch::OKLCH;
use std::f64::consts::PI;
use std::ops::Add;

/// 3D vector for light direction and surface normals
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Vec3 {
    /// X component
    pub x: f64,
    /// Y component
    pub y: f64,
    /// Z component
    pub z: f64,
}

impl Vec3 {
    /// Create a new 3D vector
    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }

    /// Calculate vector length (magnitude)
    pub fn length(&self) -> f64 {
        (self.x * self.x + self.y * self.y + self.z * self.z).sqrt()
    }

    /// Normalize vector to unit length
    pub fn normalize(&self) -> Self {
        let len = self.length();
        if len > 0.0 {
            Self {
                x: self.x / len,
                y: self.y / len,
                z: self.z / len,
            }
        } else {
            Self {
                x: 0.0,
                y: 0.0,
                z: 1.0,
            }
        }
    }

    /// Dot product
    pub fn dot(&self, other: &Vec3) -> f64 {
        self.x * other.x + self.y * other.y + self.z * other.z
    }

    /// Reflect vector around normal
    pub fn reflect(&self, normal: &Vec3) -> Vec3 {
        let d = 2.0 * self.dot(normal);
        Vec3::new(
            self.x - d * normal.x,
            self.y - d * normal.y,
            self.z - d * normal.z,
        )
    }
}

// Implement Add trait for Vec3 (needed for Blinn-Phong halfway vector)
impl Add for Vec3 {
    type Output = Vec3;

    fn add(self, other: Vec3) -> Vec3 {
        Vec3 {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}

/// Virtual light source
#[derive(Debug, Clone, Copy)]
pub struct LightSource {
    /// Direction the light is coming FROM (normalized)
    pub direction: Vec3,

    /// Light intensity (0.0 = off, 1.0 = full)
    pub intensity: f64,

    /// Color temperature in OKLCH
    /// Warm light: L=0.9, C=0.05, H=80 (yellowish)
    /// Cool light: L=0.9, C=0.05, H=240 (blueish)
    pub color: OKLCH,
}

impl LightSource {
    /// Create default key light (from top-left, slightly in front)
    pub fn default_key_light() -> Self {
        Self {
            direction: Vec3::new(-0.5, -0.7, 0.5).normalize(),
            intensity: 1.0,
            color: OKLCH::new(0.95, 0.02, 90.0), // Slightly warm white
        }
    }

    /// Create ambient fill light (uniform from environment)
    pub fn default_fill_light() -> Self {
        Self {
            direction: Vec3::new(0.0, 0.0, 1.0), // Directly from front
            intensity: 0.3,
            color: OKLCH::new(0.85, 0.01, 240.0), // Slightly cool
        }
    }

    /// Create dramatic top light (strong from above)
    pub fn dramatic_top_light() -> Self {
        Self {
            direction: Vec3::new(0.0, -1.0, 0.3).normalize(),
            intensity: 1.2,
            color: OKLCH::new(0.98, 0.01, 60.0),
        }
    }
}

/// Lighting environment for glass rendering
#[derive(Debug, Clone)]
pub struct LightingEnvironment {
    /// Primary directional light
    pub key_light: LightSource,

    /// Soft ambient fill
    pub fill_light: LightSource,

    /// Ambient light intensity
    pub ambient_intensity: f64,

    /// Background color (affects glass appearance)
    pub background: OKLCH,
}

impl Default for LightingEnvironment {
    fn default() -> Self {
        Self {
            key_light: LightSource::default_key_light(),
            fill_light: LightSource::default_fill_light(),
            ambient_intensity: 0.2,
            background: OKLCH::new(0.95, 0.01, 240.0),
        }
    }
}

/// Result of lighting calculation
#[derive(Debug, Clone, Copy)]
pub struct LightingResult {
    /// Diffuse lighting (scattered from surface)
    pub diffuse: f64,

    /// Specular highlight (mirror-like reflection)
    pub specular: f64,

    /// Combined lighting value
    pub total: f64,

    /// Light color contribution
    pub light_color: OKLCH,
}

/// Calculate lighting at a surface point
///
/// This models how light hits the glass surface and determines:
/// - How bright the surface appears (diffuse)
/// - Whether there's a specular highlight (glossy reflection)
/// - What color the light contributes
///
/// # Arguments
///
/// * `surface_normal` - Normal vector of the surface (perpendicular)
/// * `view_direction` - Direction from surface to camera/eye
/// * `environment` - Lighting environment
/// * `shininess` - Material shininess (higher = sharper highlights)
///
/// # Returns
///
/// Lighting result with diffuse, specular, and color
pub fn calculate_lighting(
    surface_normal: &Vec3,
    view_direction: &Vec3,
    environment: &LightingEnvironment,
    shininess: f64,
) -> LightingResult {
    let normal = surface_normal.normalize();
    let view = view_direction.normalize();

    // 1. Key light contribution (diffuse + specular)
    let key_diffuse = calculate_diffuse(&normal, &environment.key_light.direction);
    let key_specular =
        calculate_specular(&normal, &view, &environment.key_light.direction, shininess);

    let key_contrib = (key_diffuse + key_specular) * environment.key_light.intensity;

    // 2. Fill light contribution (mostly diffuse)
    let fill_diffuse = calculate_diffuse(&normal, &environment.fill_light.direction);
    let fill_contrib = fill_diffuse * environment.fill_light.intensity * 0.5;

    // 3. Ambient contribution
    let ambient_contrib = environment.ambient_intensity;

    // 4. Combine contributions
    let total = (key_contrib + fill_contrib + ambient_contrib).clamp(0.0, 2.0);

    // 5. Light color (blend key and fill based on contributions)
    let key_weight = key_contrib / (key_contrib + fill_contrib + 0.01);
    let _fill_weight = 1.0 - key_weight;

    let light_color = blend_oklch(
        environment.key_light.color,
        environment.fill_light.color,
        key_weight,
    );

    LightingResult {
        diffuse: key_diffuse + fill_diffuse,
        specular: key_specular,
        total,
        light_color,
    }
}

/// Calculate diffuse lighting (Lambertian reflectance)
///
/// Models matte surfaces that scatter light uniformly.
/// Brightness = max(0, N · L) where N is normal, L is light direction.
fn calculate_diffuse(normal: &Vec3, light_direction: &Vec3) -> f64 {
    let light_dir = light_direction.normalize();
    normal.dot(&light_dir).max(0.0)
}

/// Calculate specular highlight (Blinn-Phong model)
///
/// Models glossy surfaces with mirror-like reflections.
/// Creates the characteristic "shine" on glass.
fn calculate_specular(normal: &Vec3, view: &Vec3, light_direction: &Vec3, shininess: f64) -> f64 {
    let light_dir = light_direction.normalize();

    // Blinn-Phong half vector
    let half_vector = Vec3::new(
        (view.x + light_dir.x) / 2.0,
        (view.y + light_dir.y) / 2.0,
        (view.z + light_dir.z) / 2.0,
    )
    .normalize();

    let spec_angle = normal.dot(&half_vector).max(0.0);

    if spec_angle > 0.0 {
        spec_angle.powf(shininess)
    } else {
        0.0
    }
}

/// Derive gradient from lighting across surface
///
/// Generates a physically-based gradient by sampling lighting
/// at different points on the surface.
///
/// # Arguments
///
/// * `environment` - Lighting environment
/// * `surface_curvature` - How curved the surface is (0.0 = flat, 1.0 = sphere)
/// * `shininess` - Material shininess
/// * `num_samples` - Number of gradient stops to generate
///
/// # Returns
///
/// Array of lighting values from top to bottom
pub fn derive_gradient(
    environment: &LightingEnvironment,
    surface_curvature: f64,
    shininess: f64,
    num_samples: usize,
) -> Vec<LightingResult> {
    let mut gradient = Vec::with_capacity(num_samples);
    let view_direction = Vec3::new(0.0, 0.0, 1.0); // Camera looking straight at surface

    for i in 0..num_samples {
        let t = i as f64 / (num_samples - 1) as f64;

        // Calculate surface normal based on position and curvature
        // t=0 (top) to t=1 (bottom)
        let normal = if surface_curvature > 0.0 {
            // Curved surface: normal rotates from top to bottom
            let angle = (t - 0.5) * PI * surface_curvature;
            Vec3::new(0.0, angle.sin(), angle.cos())
        } else {
            // Flat surface: normal always faces forward
            Vec3::new(0.0, 0.0, 1.0)
        };

        let lighting = calculate_lighting(&normal, &view_direction, environment, shininess);

        gradient.push(lighting);
    }

    gradient
}

/// Blend two OKLCH colors
fn blend_oklch(color1: OKLCH, color2: OKLCH, t: f64) -> OKLCH {
    let t_clamped = t.clamp(0.0, 1.0);

    // Linear interpolation in OKLCH (perceptually uniform)
    OKLCH::new(
        color1.l * t_clamped + color2.l * (1.0 - t_clamped),
        color1.c * t_clamped + color2.c * (1.0 - t_clamped),
        interpolate_hue(color1.h, color2.h, t_clamped),
    )
}

/// Interpolate hue taking shorter path around color wheel
fn interpolate_hue(h1: f64, h2: f64, t: f64) -> f64 {
    let h1_norm = ((h1 % 360.0) + 360.0) % 360.0;
    let h2_norm = ((h2 % 360.0) + 360.0) % 360.0;

    let mut diff = h2_norm - h1_norm;
    if diff > 180.0 {
        diff -= 360.0;
    } else if diff < -180.0 {
        diff += 360.0;
    }

    let result = h1_norm + diff * t;
    ((result % 360.0) + 360.0) % 360.0
}

/// Convert gradient to CSS-compatible format
///
/// Generates CSS gradient stops with OKLCH colors
pub fn gradient_to_css(gradient: &[LightingResult], base_color: OKLCH) -> Vec<(f64, OKLCH)> {
    gradient
        .iter()
        .enumerate()
        .map(|(i, result)| {
            let position = i as f64 / (gradient.len() - 1) as f64;

            // Apply lighting to base color
            let lit_color = OKLCH::new(
                (base_color.l * result.total).clamp(0.0, 1.0),
                base_color.c,
                base_color.h,
            );

            (position, lit_color)
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;

    #[test]
    fn test_vec3_normalize() {
        let v = Vec3::new(3.0, 4.0, 0.0);
        let normalized = v.normalize();

        let length = (normalized.x * normalized.x
            + normalized.y * normalized.y
            + normalized.z * normalized.z)
            .sqrt();

        assert_relative_eq!(length, 1.0, epsilon = 0.001);
    }

    #[test]
    fn test_vec3_dot_product() {
        let v1 = Vec3::new(1.0, 0.0, 0.0);
        let v2 = Vec3::new(0.0, 1.0, 0.0);

        // Perpendicular vectors have dot product of 0
        assert_relative_eq!(v1.dot(&v2), 0.0, epsilon = 0.001);

        let v3 = Vec3::new(1.0, 0.0, 0.0);
        // Parallel vectors have dot product of 1 (when normalized)
        assert_relative_eq!(v1.dot(&v3), 1.0, epsilon = 0.001);
    }

    #[test]
    fn test_diffuse_lighting_perpendicular() {
        let normal = Vec3::new(0.0, 0.0, 1.0);
        let light = Vec3::new(0.0, 0.0, 1.0);

        let diffuse = calculate_diffuse(&normal, &light);

        // Light perpendicular to surface = maximum brightness
        assert_relative_eq!(diffuse, 1.0, epsilon = 0.001);
    }

    #[test]
    fn test_diffuse_lighting_angle() {
        let normal = Vec3::new(0.0, 0.0, 1.0);
        let light = Vec3::new(1.0, 0.0, 1.0).normalize();

        let diffuse = calculate_diffuse(&normal, &light);

        // Light at angle should be dimmer
        assert!(diffuse > 0.0 && diffuse < 1.0);
    }

    #[test]
    fn test_specular_highlight() {
        let normal = Vec3::new(0.0, 0.0, 1.0);
        let view = Vec3::new(0.0, 0.0, 1.0);
        let light = Vec3::new(0.0, 0.0, 1.0);

        let specular = calculate_specular(&normal, &view, &light, 32.0);

        // Perfect alignment should give specular highlight
        assert!(specular > 0.0);
    }

    #[test]
    fn test_gradient_generation() {
        let environment = LightingEnvironment::default();
        let gradient = derive_gradient(&environment, 0.3, 32.0, 10);

        // Should generate requested number of samples
        assert_eq!(gradient.len(), 10);

        // All samples should have valid lighting values
        for sample in &gradient {
            assert!(sample.total >= 0.0);
            assert!(sample.diffuse >= 0.0);
            assert!(sample.specular >= 0.0);
        }
    }

    #[test]
    fn test_curved_surface_varies_lighting() {
        let environment = LightingEnvironment::default();

        let flat_gradient = derive_gradient(&environment, 0.0, 32.0, 10);
        let curved_gradient = derive_gradient(&environment, 0.5, 32.0, 10);

        // Curved surface should have more variation in lighting
        let flat_variance = calculate_variance(&flat_gradient);
        let curved_variance = calculate_variance(&curved_gradient);

        assert!(curved_variance > flat_variance);
    }

    fn calculate_variance(gradient: &[LightingResult]) -> f64 {
        let mean: f64 = gradient.iter().map(|r| r.total).sum::<f64>() / gradient.len() as f64;
        gradient
            .iter()
            .map(|r| (r.total - mean).powi(2))
            .sum::<f64>()
            / gradient.len() as f64
    }
}
