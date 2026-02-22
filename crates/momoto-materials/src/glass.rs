//! # Liquid Glass - Apple 2026 Material Design
//!
//! Implementation of Apple's Liquid Glass material system announced at WWDC 2025.
//!
//! ## Design Principles
//!
//! - **Physically-based**: Refracts and reflects like real glass
//! - **Adaptive**: Changes based on content and lighting
//! - **Multi-layer**: Highlight + Shadow + Illumination
//! - **Accessible**: Ensures text contrast automatically
//!
//! ## Variants
//!
//! - **Regular**: Adaptive translucent glass (default)
//! - **Clear**: More transparent, allows rich content through
//!
//! References:
//! - WWDC25 Video: "Meet Liquid Glass"
//! - Apple HIG: Materials

use momoto_core::color::Color;
use momoto_core::space::oklch::OKLCH;

/// Glass variant defines the visual behavior
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum GlassVariant {
    /// Regular glass - adaptive, most versatile
    /// Changes opacity/tint based on content
    Regular,

    /// Clear glass - permanently more transparent
    /// Allows background richness through
    Clear,
}

/// Glass properties defining the multi-layer composition
#[derive(Debug, Clone)]
pub struct GlassProperties {
    /// Base tint color in perceptually uniform OKLCH
    pub base_tint: OKLCH,

    /// Overall opacity (0.0 = transparent, 1.0 = opaque)
    pub opacity: f64,

    /// Backdrop blur radius (px equivalent)
    pub blur_radius: f64,

    /// Reflection strength (0.0 = none, 1.0 = mirror)
    pub reflectivity: f64,

    /// Refraction index (1.0 = no bend, 1.5 = glass)
    pub refraction: f64,

    /// Perceived depth/thickness
    pub depth: f64,

    /// Noise/grain scale for realism
    pub noise_scale: f64,

    /// Specular highlight intensity
    pub specular_intensity: f64,
}

impl Default for GlassProperties {
    fn default() -> Self {
        Self {
            base_tint: OKLCH::new(0.95, 0.01, 240.0), // Very light, nearly neutral
            opacity: 0.8,
            blur_radius: 20.0,
            reflectivity: 0.15,
            refraction: 1.3,
            depth: 0.5,
            noise_scale: 0.02,
            specular_intensity: 0.25,
        }
    }
}

/// Multi-layer glass composition
#[derive(Debug, Clone)]
pub struct GlassLayers {
    /// Top layer: Specular highlights
    pub highlight: OKLCH,

    /// Middle layer: Base glass tint
    pub base: OKLCH,

    /// Bottom layer: Shadow for depth
    pub shadow: OKLCH,
}

/// Liquid Glass surface with adaptive behavior
#[derive(Clone)]
pub struct LiquidGlass {
    variant: GlassVariant,
    properties: GlassProperties,
}

impl LiquidGlass {
    /// Create new Liquid Glass with specified variant
    pub fn new(variant: GlassVariant) -> Self {
        let properties = match variant {
            GlassVariant::Regular => GlassProperties::default(),
            GlassVariant::Clear => GlassProperties {
                opacity: 0.6,       // More transparent
                blur_radius: 24.0,  // Stronger blur
                reflectivity: 0.08, // Less reflective
                noise_scale: 0.01,  // Finer grain
                ..Default::default()
            },
        };

        Self {
            variant,
            properties,
        }
    }

    /// Create with custom properties
    pub fn with_properties(variant: GlassVariant, properties: GlassProperties) -> Self {
        Self {
            variant,
            properties,
        }
    }

    /// Calculate effective color when glass is over background
    pub fn effective_color(&self, background: Color) -> Color {
        let bg_oklch = background.to_oklch();

        // Apply tint in OKLCH space
        let tinted = OKLCH::new(
            bg_oklch.l * (1.0 - self.properties.opacity)
                + self.properties.base_tint.l * self.properties.opacity,
            bg_oklch.c * (1.0 - self.properties.opacity)
                + self.properties.base_tint.c * self.properties.opacity,
            // Hue interpolation using shorter path
            interpolate_hue(
                bg_oklch.h,
                self.properties.base_tint.h,
                self.properties.opacity,
            ),
        );

        tinted.to_color()
    }

    /// Recommend text color for maximum readability
    pub fn recommend_text_color(&self, background: Color, prefer_white: bool) -> Color {
        let effective = self.effective_color(background);
        let effective_oklch = effective.to_oklch();

        // White text
        let white = OKLCH::new(1.0, 0.0, 0.0);

        // Dark text
        let dark = OKLCH::new(0.15, 0.01, 240.0);

        if prefer_white {
            // Try white first
            if self.validate_text_contrast(white, effective_oklch) {
                return white.to_color();
            }
        }

        // Try dark
        if self.validate_text_contrast(dark, effective_oklch) {
            return dark.to_color();
        }

        // If prefer white but dark works
        if !prefer_white && self.validate_text_contrast(white, effective_oklch) {
            return white.to_color();
        }

        // Fallback: adjust lightness to ensure contrast
        if effective_oklch.l > 0.5 {
            OKLCH::new(0.15, 0.01, 240.0).to_color()
        } else {
            OKLCH::new(1.0, 0.0, 0.0).to_color()
        }
    }

    /// Validate text contrast against effective glass color
    fn validate_text_contrast(&self, text: OKLCH, background: OKLCH) -> bool {
        // Simplified contrast check (can integrate momoto-metrics for full WCAG/APCA)
        let text_lum = text.l;
        let bg_lum = background.l;

        let lighter = text_lum.max(bg_lum);
        let darker = text_lum.min(bg_lum);

        let ratio = (lighter + 0.05) / (darker + 0.05);

        // WCAG AA minimum (4.5:1 for normal text)
        ratio >= 4.5
    }

    /// Decompose into multi-layer structure
    pub fn get_layers(&self, background: Color) -> GlassLayers {
        let bg_oklch = background.to_oklch();

        // Highlight: lighter, desaturated
        let highlight = OKLCH::new(
            (self.properties.base_tint.l + 0.3).min(1.0),
            (self.properties.base_tint.c * 0.5).max(0.0),
            self.properties.base_tint.h,
        );

        // Shadow: darker, more saturated
        let shadow = OKLCH::new(
            (bg_oklch.l * 0.7).max(0.0),
            (bg_oklch.c * 1.2).min(0.4),
            bg_oklch.h,
        );

        GlassLayers {
            highlight,
            base: self.properties.base_tint,
            shadow,
        }
    }

    /// Adapt glass properties for dark mode
    pub fn adapt_for_dark_mode(&mut self) {
        // In dark mode, glass should be darker and less saturated
        self.properties.base_tint = OKLCH::new(
            0.2,   // Much darker
            0.005, // Nearly achromatic
            self.properties.base_tint.h,
        );

        // Increase blur for better separation
        self.properties.blur_radius *= 1.2;

        // Reduce reflectivity (less light to reflect)
        self.properties.reflectivity *= 0.7;
    }

    /// Adapt glass properties for light mode
    pub fn adapt_for_light_mode(&mut self) {
        // In light mode, glass should be light and slightly tinted
        self.properties.base_tint = OKLCH::new(0.95, 0.01, self.properties.base_tint.h);

        // Standard blur
        self.properties.blur_radius = 20.0;

        // Normal reflectivity
        self.properties.reflectivity = 0.15;
    }

    /// Get variant
    pub fn variant(&self) -> GlassVariant {
        self.variant
    }

    /// Get properties
    pub fn properties(&self) -> &GlassProperties {
        &self.properties
    }

    /// Get mutable properties
    pub fn properties_mut(&mut self) -> &mut GlassProperties {
        &mut self.properties
    }
}

/// Interpolate hue values taking shorter path around color wheel
fn interpolate_hue(h1: f64, h2: f64, t: f64) -> f64 {
    // Normalize hues to 0-360
    let h1_norm = ((h1 % 360.0) + 360.0) % 360.0;
    let h2_norm = ((h2 % 360.0) + 360.0) % 360.0;

    // Calculate difference (shortest path)
    let mut diff = h2_norm - h1_norm;
    if diff > 180.0 {
        diff -= 360.0;
    } else if diff < -180.0 {
        diff += 360.0;
    }

    // Interpolate
    let result = h1_norm + diff * t;

    // Normalize result
    ((result % 360.0) + 360.0) % 360.0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_regular_glass() {
        let glass = LiquidGlass::new(GlassVariant::Regular);
        assert_eq!(glass.variant(), GlassVariant::Regular);
        assert_eq!(glass.properties().opacity, 0.8);
    }

    #[test]
    fn test_clear_glass() {
        let glass = LiquidGlass::new(GlassVariant::Clear);
        assert_eq!(glass.variant(), GlassVariant::Clear);
        assert_eq!(glass.properties().opacity, 0.6);
    }

    #[test]
    fn test_effective_color() {
        let glass = LiquidGlass::new(GlassVariant::Regular);
        let background = Color::from_srgb8(59, 130, 246); // Blue
        let effective = glass.effective_color(background);

        // Should be lighter than background due to white tint
        let bg_oklch = background.to_oklch();
        let eff_oklch = effective.to_oklch();
        assert!(eff_oklch.l > bg_oklch.l);
    }

    #[test]
    fn test_text_recommendation() {
        let glass = LiquidGlass::new(GlassVariant::Regular);

        // Very dark background
        let very_dark_bg = Color::from_srgb8(0, 0, 0);
        // Light background
        let light_bg = Color::from_srgb8(240, 240, 240);

        // Get text recommendations
        let text_dark_bg = glass.recommend_text_color(very_dark_bg, false);
        let text_light_bg = glass.recommend_text_color(light_bg, false);

        // Both should be valid colors
        let text_dark_oklch = text_dark_bg.to_oklch();
        let text_light_oklch = text_light_bg.to_oklch();

        // Text colors should be in valid range
        assert!(text_dark_oklch.l >= 0.0 && text_dark_oklch.l <= 1.0);
        assert!(text_light_oklch.l >= 0.0 && text_light_oklch.l <= 1.0);

        // Light background should recommend dark text
        assert!(
            text_light_oklch.l < 0.5,
            "Expected dark text on light glass, got L={}",
            text_light_oklch.l
        );
    }

    #[test]
    fn test_dark_mode_adaptation() {
        let mut glass = LiquidGlass::new(GlassVariant::Regular);
        let original_lightness = glass.properties().base_tint.l;

        glass.adapt_for_dark_mode();

        // Should be much darker
        assert!(glass.properties().base_tint.l < original_lightness);
        assert!(glass.properties().base_tint.l < 0.5);
    }

    #[test]
    fn test_hue_interpolation() {
        // Test shorter path
        assert!((interpolate_hue(10.0, 350.0, 0.5) - 0.0).abs() < 10.0);

        // Test normal interpolation (0 to 180 at 0.5 = 90)
        let result = interpolate_hue(0.0, 180.0, 0.5);
        assert!((result - 90.0).abs() < 1.0, "Expected ~90, got {}", result);

        // Test wrap around
        assert!((interpolate_hue(350.0, 10.0, 0.5) - 0.0).abs() < 10.0);
    }
}
