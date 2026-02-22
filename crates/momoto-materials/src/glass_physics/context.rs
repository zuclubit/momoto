//! # Material Context System
//!
//! Formal context representation for physical material evaluation.
//!
//! ## Design Philosophy
//!
//! Materials don't exist in isolation - they interact with their environment.
//! The same glass material looks different under:
//! - Different lighting (studio vs outdoor vs dramatic)
//! - Different backgrounds (white vs black vs colorful)
//! - Different viewing angles (perpendicular vs grazing)
//!
//! This module formalizes these contexts to enable:
//! 1. **Consistent evaluation** - Same material + same context = same result
//! 2. **Context presets** - Easy switching between common scenarios
//! 3. **Batch efficiency** - Single context for multiple materials
//! 4. **Composability** - Mix and match lighting/background/view
//!
//! ## Architecture
//!
//! ```text
//! ┌─────────────────────────────────────────────────┐
//! │         MaterialContext                          │
//! ├─────────────────────────────────────────────────┤
//! │  LightingContext   │ Key, fill, ambient light   │
//! │  BackgroundContext │ What's behind the glass    │
//! │  ViewContext       │ Observer position/props    │
//! └─────────────────────────────────────────────────┘
//! ```
//!
//! ## Usage
//!
//! ```rust
//! use momoto_materials::glass_physics::context::ContextPresets;
//!
//! // Use a preset
//! let _context = ContextPresets::studio();
//! ```

use super::light_model::Vec3;

// ============================================================================
// LIGHTING CONTEXT
// ============================================================================

/// Lighting environment for material evaluation
///
/// Describes the light sources illuminating the material.
/// Based on three-point lighting model from cinematography:
/// - **Key light**: Primary light source (direction + intensity)
/// - **Fill light**: Secondary light to soften shadows
/// - **Ambient**: Environmental/reflected light
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct LightingContext {
    /// Primary light direction (normalized vector)
    pub key_direction: Vec3,

    /// Primary light intensity (0.0 to 1.0)
    pub key_intensity: f64,

    /// Secondary/fill light direction (normalized vector)
    pub fill_direction: Vec3,

    /// Secondary light intensity (0.0 to 1.0)
    pub fill_intensity: f64,

    /// Ambient light level (0.0 to 1.0)
    pub ambient: f64,

    /// Color temperature in Kelvin (2000-10000)
    /// Used for chromatic effects on materials
    pub temperature: f64,
}

impl LightingContext {
    /// Studio lighting setup
    ///
    /// Classic three-point lighting:
    /// - Key from top-left (45°)
    /// - Fill from bottom-right
    /// - Moderate ambient
    pub fn studio() -> Self {
        Self {
            key_direction: Vec3::new(-0.707, 0.707, 0.5).normalize(),
            key_intensity: 0.8,
            fill_direction: Vec3::new(0.5, -0.5, 0.3).normalize(),
            fill_intensity: 0.3,
            ambient: 0.2,
            temperature: 5500.0, // Daylight balanced
        }
    }

    /// Outdoor daylight lighting
    ///
    /// Bright overhead sun with sky fill:
    /// - Strong key from above
    /// - Diffuse sky fill
    /// - Higher ambient
    pub fn outdoor() -> Self {
        Self {
            key_direction: Vec3::new(0.0, 0.866, 0.5).normalize(), // 60° elevation
            key_intensity: 1.0,
            fill_direction: Vec3::new(0.0, 0.0, 1.0), // Sky dome
            fill_intensity: 0.4,
            ambient: 0.3,
            temperature: 6500.0, // Cooler daylight
        }
    }

    /// Dramatic/theatrical lighting
    ///
    /// Strong directional light with minimal fill:
    /// - Very strong key
    /// - Minimal fill
    /// - Low ambient (deep shadows)
    pub fn dramatic() -> Self {
        Self {
            key_direction: Vec3::new(-0.866, 0.5, 0.3).normalize(), // Side/top
            key_intensity: 1.0,
            fill_direction: Vec3::new(0.3, -0.3, 0.2).normalize(),
            fill_intensity: 0.1,
            ambient: 0.05,
            temperature: 3200.0, // Warm tungsten
        }
    }

    /// Soft/diffuse lighting
    ///
    /// Even, shadowless illumination:
    /// - Moderate key from front
    /// - Strong fill
    /// - High ambient
    pub fn soft() -> Self {
        Self {
            key_direction: Vec3::new(0.0, 0.5, 0.866).normalize(), // Front-top
            key_intensity: 0.6,
            fill_direction: Vec3::new(0.0, -0.3, 0.95).normalize(),
            fill_intensity: 0.5,
            ambient: 0.4,
            temperature: 5000.0, // Neutral
        }
    }

    /// Neutral/default lighting
    ///
    /// Balanced lighting for general use
    pub fn neutral() -> Self {
        Self {
            key_direction: Vec3::new(-0.577, 0.577, 0.577).normalize(), // 45° all axes
            key_intensity: 0.7,
            fill_direction: Vec3::new(0.4, -0.4, 0.5).normalize(),
            fill_intensity: 0.3,
            ambient: 0.2,
            temperature: 5500.0,
        }
    }

    /// Calculate total illumination at a surface normal
    ///
    /// Combines key + fill + ambient contributions using Lambertian shading.
    ///
    /// # Arguments
    ///
    /// * `normal` - Surface normal vector (normalized)
    ///
    /// # Returns
    ///
    /// Total illumination intensity (0.0 to 1.0+)
    pub fn total_illumination(&self, normal: Vec3) -> f64 {
        // Key light contribution (Lambertian)
        let key_dot = normal.dot(&self.key_direction).max(0.0);
        let key_contrib = key_dot * self.key_intensity;

        // Fill light contribution
        let fill_dot = normal.dot(&self.fill_direction).max(0.0);
        let fill_contrib = fill_dot * self.fill_intensity;

        // Ambient (no directional dependency)
        let ambient_contrib = self.ambient;

        // Combine (can exceed 1.0 in bright spots)
        key_contrib + fill_contrib + ambient_contrib
    }

    /// Calculate light direction for specular highlights
    ///
    /// Returns the dominant light direction (key light).
    pub fn dominant_direction(&self) -> Vec3 {
        self.key_direction
    }
}

impl Default for LightingContext {
    fn default() -> Self {
        Self::neutral()
    }
}

// ============================================================================
// BACKGROUND CONTEXT
// ============================================================================

/// Background behind the glass material
///
/// Describes what's visible through/behind the translucent material.
/// Affects perceived opacity, color tint, and blur visibility.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct BackgroundContext {
    /// Background brightness (0.0 = black, 1.0 = white)
    pub brightness: f64,

    /// Background color (R, G, B normalized 0-1)
    pub color: (f64, f64, f64),

    /// Background detail/contrast (0.0 = flat, 1.0 = high detail)
    ///
    /// High detail makes blur more visible.
    /// Low detail makes glass appear smoother.
    pub detail: f64,

    /// Background distance (affects refraction/parallax)
    ///
    /// - Near (0.0-0.3): Background close to glass
    /// - Medium (0.3-0.7): Typical UI distance
    /// - Far (0.7-1.0): Distant background
    pub distance: f64,
}

impl BackgroundContext {
    /// Pure white background
    pub fn white() -> Self {
        Self {
            brightness: 1.0,
            color: (1.0, 1.0, 1.0),
            detail: 0.5,
            distance: 0.5,
        }
    }

    /// Pure black background
    pub fn black() -> Self {
        Self {
            brightness: 0.0,
            color: (0.0, 0.0, 0.0),
            detail: 0.5,
            distance: 0.5,
        }
    }

    /// Mid-gray background (typical for design tools)
    pub fn gray() -> Self {
        Self {
            brightness: 0.5,
            color: (0.5, 0.5, 0.5),
            detail: 0.5,
            distance: 0.5,
        }
    }

    /// Colorful gradient background (reveals material properties well)
    pub fn colorful() -> Self {
        Self {
            brightness: 0.6,
            color: (0.7, 0.5, 0.9), // Purple-ish
            detail: 0.8,            // High detail to show blur
            distance: 0.4,          // Relatively close
        }
    }

    /// Natural/sky background
    pub fn sky() -> Self {
        Self {
            brightness: 0.75,
            color: (0.5, 0.7, 1.0), // Sky blue
            detail: 0.3,            // Smooth gradient
            distance: 1.0,          // Far
        }
    }

    /// Calculate contrast ratio with glass material
    ///
    /// Higher contrast makes material properties more visible.
    ///
    /// # Arguments
    ///
    /// * `material_opacity` - Material opacity (0.0 to 1.0)
    pub fn contrast_with_material(&self, material_opacity: f64) -> f64 {
        // Effective background brightness as seen through material
        let effective_bg = self.brightness * (1.0 - material_opacity);

        // Contrast between material and background
        (material_opacity - effective_bg).abs()
    }
}

impl Default for BackgroundContext {
    fn default() -> Self {
        Self::gray()
    }
}

// ============================================================================
// VIEW CONTEXT
// ============================================================================

/// Observer/camera viewing context
///
/// Describes the perspective from which the material is viewed.
/// Affects Fresnel reflectance, specular highlights, and apparent depth.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ViewContext {
    /// View direction (normalized vector pointing at surface)
    pub direction: Vec3,

    /// Field of view in degrees (affects perspective distortion)
    pub fov: f64,

    /// View distance (affects blur appearance)
    ///
    /// - Close (0.0-0.3): Macro/detail view
    /// - Medium (0.3-0.7): Typical UI view
    /// - Far (0.7-1.0): Overview/thumbnail
    pub distance: f64,

    /// Enable perspective correction
    ///
    /// When true, adjusts material properties based on viewing angle.
    /// When false, uses simplified perpendicular approximation.
    pub perspective: bool,
}

impl ViewContext {
    /// Perpendicular view (looking straight at surface)
    pub fn perpendicular() -> Self {
        Self {
            direction: Vec3::new(0.0, 0.0, 1.0),
            fov: 45.0,
            distance: 0.5,
            perspective: true,
        }
    }

    /// Oblique view (45° angle)
    pub fn oblique() -> Self {
        Self {
            direction: Vec3::new(0.707, 0.0, 0.707).normalize(),
            fov: 45.0,
            distance: 0.5,
            perspective: true,
        }
    }

    /// Grazing angle view (nearly parallel to surface)
    pub fn grazing() -> Self {
        Self {
            direction: Vec3::new(0.95, 0.0, 0.31).normalize(),
            fov: 45.0,
            distance: 0.5,
            perspective: true,
        }
    }

    /// Close-up/macro view
    pub fn closeup() -> Self {
        Self {
            direction: Vec3::new(0.0, 0.0, 1.0),
            fov: 30.0, // Narrow FOV
            distance: 0.2,
            perspective: true,
        }
    }

    /// Wide overview
    pub fn overview() -> Self {
        Self {
            direction: Vec3::new(0.0, 0.0, 1.0),
            fov: 60.0, // Wide FOV
            distance: 0.8,
            perspective: false, // Simplified for thumbnails
        }
    }

    /// Calculate cosine of angle between view and surface normal
    ///
    /// Used for Fresnel calculations.
    ///
    /// # Arguments
    ///
    /// * `surface_normal` - Surface normal vector
    ///
    /// # Returns
    ///
    /// cos(θ) where θ is angle between view and normal (0.0 to 1.0)
    pub fn cos_theta(&self, surface_normal: Vec3) -> f64 {
        self.direction.dot(&surface_normal).abs().clamp(0.0, 1.0)
    }
}

impl Default for ViewContext {
    fn default() -> Self {
        Self::perpendicular()
    }
}

// ============================================================================
// MATERIAL CONTEXT (COMPOSITE)
// ============================================================================

/// Complete context for material evaluation
///
/// Combines lighting, background, and view contexts into a single
/// coherent environment description.
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct MaterialContext {
    /// Lighting environment
    pub lighting: LightingContext,

    /// Background behind material
    pub background: BackgroundContext,

    /// Observer view parameters
    pub view: ViewContext,
}

impl MaterialContext {
    /// Create context from components
    pub fn new(
        lighting: LightingContext,
        background: BackgroundContext,
        view: ViewContext,
    ) -> Self {
        Self {
            lighting,
            background,
            view,
        }
    }

    /// Studio preset: Professional product photography lighting
    ///
    /// - Studio three-point lighting
    /// - Gray background
    /// - Perpendicular view
    pub fn studio() -> Self {
        Self {
            lighting: LightingContext::studio(),
            background: BackgroundContext::gray(),
            view: ViewContext::perpendicular(),
        }
    }

    /// Outdoor preset: Natural daylight
    ///
    /// - Outdoor sun lighting
    /// - Sky background
    /// - Slightly oblique view
    pub fn outdoor() -> Self {
        Self {
            lighting: LightingContext::outdoor(),
            background: BackgroundContext::sky(),
            view: ViewContext::oblique(),
        }
    }

    /// Dramatic preset: High-contrast theatrical lighting
    ///
    /// - Dramatic side lighting
    /// - Black background
    /// - Oblique view for depth
    pub fn dramatic() -> Self {
        Self {
            lighting: LightingContext::dramatic(),
            background: BackgroundContext::black(),
            view: ViewContext::oblique(),
        }
    }

    /// Neutral preset: Balanced default for UI
    ///
    /// - Neutral lighting
    /// - Gray background
    /// - Perpendicular view
    pub fn neutral() -> Self {
        Self {
            lighting: LightingContext::neutral(),
            background: BackgroundContext::gray(),
            view: ViewContext::perpendicular(),
        }
    }

    /// Showcase preset: Best for revealing material properties
    ///
    /// - Soft even lighting
    /// - Colorful detailed background
    /// - Perpendicular view
    pub fn showcase() -> Self {
        Self {
            lighting: LightingContext::soft(),
            background: BackgroundContext::colorful(),
            view: ViewContext::perpendicular(),
        }
    }
}

impl Default for MaterialContext {
    fn default() -> Self {
        Self::neutral()
    }
}

// ============================================================================
// CONTEXT PRESETS
// ============================================================================

/// Convenient access to context presets
pub struct ContextPresets;

impl ContextPresets {
    /// Studio photography setup
    pub fn studio() -> MaterialContext {
        MaterialContext::studio()
    }

    /// Natural outdoor lighting
    pub fn outdoor() -> MaterialContext {
        MaterialContext::outdoor()
    }

    /// Dramatic theatrical lighting
    pub fn dramatic() -> MaterialContext {
        MaterialContext::dramatic()
    }

    /// Neutral/default for UI
    pub fn neutral() -> MaterialContext {
        MaterialContext::neutral()
    }

    /// Best for showcasing material properties
    pub fn showcase() -> MaterialContext {
        MaterialContext::showcase()
    }

    /// All presets as array
    pub fn all() -> [MaterialContext; 5] {
        [
            Self::studio(),
            Self::outdoor(),
            Self::dramatic(),
            Self::neutral(),
            Self::showcase(),
        ]
    }
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;
    use approx::assert_relative_eq;

    #[test]
    fn test_lighting_context_presets() {
        let studio = LightingContext::studio();
        let outdoor = LightingContext::outdoor();
        let dramatic = LightingContext::dramatic();

        // Verify all have normalized light directions
        assert_relative_eq!(studio.key_direction.length(), 1.0, epsilon = 0.01);
        assert_relative_eq!(outdoor.key_direction.length(), 1.0, epsilon = 0.01);
        assert_relative_eq!(dramatic.key_direction.length(), 1.0, epsilon = 0.01);

        // Verify intensity ranges
        assert!(studio.key_intensity >= 0.0 && studio.key_intensity <= 1.0);
        assert!(outdoor.ambient >= 0.0 && outdoor.ambient <= 1.0);
        assert!(dramatic.fill_intensity >= 0.0 && dramatic.fill_intensity <= 1.0);
    }

    #[test]
    fn test_lighting_illumination() {
        let lighting = LightingContext::neutral();
        let normal = Vec3::new(0.0, 0.0, 1.0); // Flat surface facing forward

        let illumination = lighting.total_illumination(normal);

        // Should include ambient at minimum
        assert!(illumination >= lighting.ambient);
    }

    #[test]
    fn test_background_context_presets() {
        let white = BackgroundContext::white();
        let black = BackgroundContext::black();
        let gray = BackgroundContext::gray();

        assert_eq!(white.brightness, 1.0);
        assert_eq!(black.brightness, 0.0);
        assert_eq!(gray.brightness, 0.5);
    }

    #[test]
    fn test_background_contrast() {
        let white = BackgroundContext::white();
        let black = BackgroundContext::black();

        // High opacity material on white background
        let contrast_white = white.contrast_with_material(0.8);
        // High opacity material on black background
        let contrast_black = black.contrast_with_material(0.8);

        // Both should have good contrast
        assert!(contrast_white > 0.5);
        assert!(contrast_black > 0.5);
    }

    #[test]
    fn test_view_context_presets() {
        let perp = ViewContext::perpendicular();
        let oblique = ViewContext::oblique();
        let grazing = ViewContext::grazing();

        // All should have normalized directions
        assert_relative_eq!(perp.direction.length(), 1.0, epsilon = 0.01);
        assert_relative_eq!(oblique.direction.length(), 1.0, epsilon = 0.01);
        assert_relative_eq!(grazing.direction.length(), 1.0, epsilon = 0.01);

        // Verify viewing angles
        let surface_normal = Vec3::new(0.0, 0.0, 1.0);

        let cos_perp = perp.cos_theta(surface_normal);
        let cos_oblique = oblique.cos_theta(surface_normal);
        let cos_grazing = grazing.cos_theta(surface_normal);

        // Perpendicular should be ~1.0, oblique ~0.7, grazing ~0.3
        assert!(cos_perp > 0.99);
        assert!(cos_oblique > 0.6 && cos_oblique < 0.8);
        assert!(cos_grazing < 0.4);
    }

    #[test]
    fn test_material_context_presets() {
        let studio = MaterialContext::studio();
        let outdoor = MaterialContext::outdoor();
        let dramatic = MaterialContext::dramatic();
        let neutral = MaterialContext::neutral();
        let showcase = MaterialContext::showcase();

        // All should be valid
        assert!(studio.lighting.key_intensity > 0.0);
        assert!(outdoor.background.brightness > 0.0);
        assert!(dramatic.lighting.ambient >= 0.0);
        assert!(neutral.view.fov > 0.0);
        assert!(showcase.background.detail > 0.0);
    }

    #[test]
    fn test_context_presets_api() {
        let presets = ContextPresets::all();
        assert_eq!(presets.len(), 5);

        // Verify all presets are distinct
        assert_ne!(presets[0], presets[1]);
        assert_ne!(presets[1], presets[2]);
    }

    #[test]
    fn test_default_contexts() {
        let lighting = LightingContext::default();
        let background = BackgroundContext::default();
        let view = ViewContext::default();
        let material = MaterialContext::default();

        // Defaults should be neutral
        assert_eq!(lighting, LightingContext::neutral());
        assert_eq!(background, BackgroundContext::gray());
        assert_eq!(view, ViewContext::perpendicular());
        assert_eq!(material, MaterialContext::neutral());
    }
}
