//! Color representation and manipulation
//!
//! This module provides OKLCH color space representation with perceptual
//! operations for token derivation.
//!
//! OKLCH (Oklab Lightness Chroma Hue) is a perceptually uniform color space
//! that's ideal for generating accessible color scales.
//!
//! # Implementation Reference
//!
//! This implementation uses the correct transformation matrices from
//! Björn Ottosson's paper "A perceptual color space for image processing"
//! (https://bottosson.github.io/posts/oklab/)
//!
//! Pipeline: sRGB → Linear RGB → LMS → OKLab → OKLCH

use wasm_bindgen::prelude::*;

// ============================================================================
// OKLCH TRANSFORMATION MATRICES (Björn Ottosson)
// Reference: https://bottosson.github.io/posts/oklab/
// ============================================================================

/// RGB to LMS matrix (cone response)
/// Maps linear sRGB to LMS cone response space
const RGB_TO_LMS: [[f64; 3]; 3] = [
    [0.4122214708, 0.5363325363, 0.0514459929],
    [0.2119034982, 0.6806995451, 0.1073969566],
    [0.0883024619, 0.2817188376, 0.6299787005],
];

/// LMS to OKLab matrix
/// Maps cube-root LMS to OKLab coordinates
const LMS_TO_LAB: [[f64; 3]; 3] = [
    [0.2104542553, 0.7936177850, -0.0040720468],
    [1.9779984951, -2.4285922050, 0.4505937099],
    [0.0259040371, 0.7827717662, -0.8086757660],
];

/// OKLab to LMS matrix (inverse)
/// Maps OKLab to cube-root LMS space
const LAB_TO_LMS: [[f64; 3]; 3] = [
    [1.0, 0.3963377774, 0.2158037573],
    [1.0, -0.1055613458, -0.0638541728],
    [1.0, -0.0894841775, -1.2914855480],
];

/// LMS to RGB matrix (inverse)
/// Maps linear LMS to linear sRGB
const LMS_TO_RGB: [[f64; 3]; 3] = [
    [4.0767416621, -3.3077115913, 0.2309699292],
    [-1.2684380046, 2.6097574011, -0.3413193965],
    [-0.0041960863, -0.7034186147, 1.7076147010],
];

// ============================================================================
// sRGB GAMMA CORRECTION (IEC 61966-2-1)
// ============================================================================

/// Convert sRGB channel to linear RGB
/// Applies inverse gamma correction per sRGB specification
#[inline]
fn srgb_to_linear(value: f64) -> f64 {
    if value <= 0.04045 {
        value / 12.92
    } else {
        ((value + 0.055) / 1.055).powf(2.4)
    }
}

/// Convert linear RGB channel to sRGB
/// Applies gamma correction per sRGB specification
#[inline]
fn linear_to_srgb(value: f64) -> f64 {
    if value <= 0.0031308 {
        value * 12.92
    } else {
        1.055 * value.powf(1.0 / 2.4) - 0.055
    }
}

// ============================================================================
// COLOR OKLCH
// ============================================================================

/// OKLCH color representation
///
/// OKLCH is a cylindrical representation of Oklab:
/// - L (Lightness): 0.0 (black) to 1.0 (white)
/// - C (Chroma): 0.0 (gray) to ~0.4 (vivid)
/// - H (Hue): 0.0 to 360.0 (degrees)
///
/// This color space is perceptually uniform, meaning that equal distances
/// in the color space correspond to equal perceived differences.
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct ColorOklch {
    /// Lightness [0.0, 1.0]
    pub l: f64,

    /// Chroma [0.0, 0.4]
    pub c: f64,

    /// Hue [0.0, 360.0] degrees
    pub h: f64,
}

#[wasm_bindgen]
impl ColorOklch {
    /// Create new OKLCH color with validation
    ///
    /// # Arguments
    /// * `l` - Lightness [0.0, 1.0]
    /// * `c` - Chroma [0.0, 0.4]
    /// * `h` - Hue [0.0, 360.0]
    ///
    /// # Returns
    /// ColorOklch or Error if values out of range
    ///
    /// # Example
    /// ```typescript
    /// import { ColorOklch } from '@momoto-ui/wasm';
    ///
    /// const color = ColorOklch.new(0.5, 0.1, 180.0);
    /// // Mid-lightness, low chroma, cyan hue
    /// ```
    #[wasm_bindgen(constructor)]
    pub fn new(l: f64, c: f64, h: f64) -> Result<ColorOklch, JsValue> {
        // Validate lightness
        if !(0.0..=1.0).contains(&l) {
            return Err(JsValue::from_str(&format!(
                "Lightness must be in [0.0, 1.0], got {}",
                l
            )));
        }

        // Validate chroma
        if !(0.0..=0.4).contains(&c) {
            return Err(JsValue::from_str(&format!(
                "Chroma must be in [0.0, 0.4], got {}",
                c
            )));
        }

        // Validate hue
        if !(0.0..=360.0).contains(&h) {
            return Err(JsValue::from_str(&format!(
                "Hue must be in [0.0, 360.0], got {}",
                h
            )));
        }

        Ok(ColorOklch { l, c, h })
    }

    /// Shift lightness by delta
    ///
    /// # Arguments
    /// * `delta` - Lightness shift [-1.0, 1.0]
    ///
    /// # Returns
    /// New ColorOklch with shifted lightness (clamped to valid range)
    ///
    /// # Example
    /// ```typescript
    /// const base = ColorOklch.new(0.5, 0.1, 180.0);
    /// const lighter = base.shift_lightness(0.1); // l=0.6
    /// const darker = base.shift_lightness(-0.2); // l=0.3
    /// ```
    pub fn shift_lightness(&self, delta: f64) -> ColorOklch {
        ColorOklch {
            l: (self.l + delta).clamp(0.0, 1.0),
            c: self.c,
            h: self.h,
        }
    }

    /// Shift chroma by delta
    ///
    /// # Arguments
    /// * `delta` - Chroma shift [-0.4, 0.4]
    ///
    /// # Returns
    /// New ColorOklch with shifted chroma (clamped to valid range)
    pub fn shift_chroma(&self, delta: f64) -> ColorOklch {
        ColorOklch {
            l: self.l,
            c: (self.c + delta).clamp(0.0, 0.4),
            h: self.h,
        }
    }

    /// Rotate hue by degrees
    ///
    /// # Arguments
    /// * `degrees` - Hue rotation in degrees
    ///
    /// # Returns
    /// New ColorOklch with rotated hue (wrapped to [0, 360])
    pub fn rotate_hue(&self, degrees: f64) -> ColorOklch {
        let new_hue = (self.h + degrees) % 360.0;
        ColorOklch {
            l: self.l,
            c: self.c,
            h: if new_hue < 0.0 {
                new_hue + 360.0
            } else {
                new_hue
            },
        }
    }

    /// Convert to hex string (via RGB)
    ///
    /// # Returns
    /// Hex color string (e.g., "#FF5733")
    ///
    /// Note: This is a simplified conversion. For production, use
    /// momoto-core's precise OKLCH → sRGB conversion.
    pub fn to_hex(&self) -> String {
        // Simplified OKLCH → RGB conversion
        // For production, integrate with momoto-core
        let rgb = self.to_rgb_simple();
        format!("#{:02x}{:02x}{:02x}", rgb.0, rgb.1, rgb.2)
    }

    /// Create from hex string
    ///
    /// # Arguments
    /// * `hex` - Hex color string (e.g., "#FF5733" or "FF5733")
    ///
    /// # Returns
    /// ColorOklch or Error if invalid hex
    #[wasm_bindgen(js_name = fromHex)]
    pub fn from_hex(hex: &str) -> Result<ColorOklch, JsValue> {
        // Remove # if present
        let hex = hex.trim_start_matches('#');

        // Validate length
        if hex.len() != 6 {
            return Err(JsValue::from_str("Hex must be 6 characters (RRGGBB)"));
        }

        // Parse RGB
        let r = u8::from_str_radix(&hex[0..2], 16)
            .map_err(|_| JsValue::from_str("Invalid hex format"))?;
        let g = u8::from_str_radix(&hex[2..4], 16)
            .map_err(|_| JsValue::from_str("Invalid hex format"))?;
        let b = u8::from_str_radix(&hex[4..6], 16)
            .map_err(|_| JsValue::from_str("Invalid hex format"))?;

        // Convert RGB → OKLCH (simplified)
        Ok(Self::from_rgb_simple(r, g, b))
    }
}

// ============================================================================
// INTERNAL HELPERS - CORRECT OKLCH CONVERSION
// Reference: Björn Ottosson - https://bottosson.github.io/posts/oklab/
// ============================================================================

impl ColorOklch {
    /// Correct RGB → OKLCH conversion using Björn Ottosson's algorithm
    ///
    /// Pipeline: sRGB → Linear RGB → LMS → LMS^(1/3) → OKLab → OKLCH
    ///
    /// This is the scientifically correct conversion that produces
    /// perceptually uniform lightness values.
    fn from_rgb_simple(r: u8, g: u8, b: u8) -> Self {
        // Step 1: Normalize sRGB to [0, 1] and linearize
        let r_linear = srgb_to_linear(r as f64 / 255.0);
        let g_linear = srgb_to_linear(g as f64 / 255.0);
        let b_linear = srgb_to_linear(b as f64 / 255.0);

        // Step 2: Linear RGB to LMS (cone response)
        let l = RGB_TO_LMS[0][0] * r_linear + RGB_TO_LMS[0][1] * g_linear + RGB_TO_LMS[0][2] * b_linear;
        let m = RGB_TO_LMS[1][0] * r_linear + RGB_TO_LMS[1][1] * g_linear + RGB_TO_LMS[1][2] * b_linear;
        let s = RGB_TO_LMS[2][0] * r_linear + RGB_TO_LMS[2][1] * g_linear + RGB_TO_LMS[2][2] * b_linear;

        // Step 3: Apply cube root (perceptual non-linearity)
        let l_cbrt = l.cbrt();
        let m_cbrt = m.cbrt();
        let s_cbrt = s.cbrt();

        // Step 4: LMS' to OKLab
        let lab_l = LMS_TO_LAB[0][0] * l_cbrt + LMS_TO_LAB[0][1] * m_cbrt + LMS_TO_LAB[0][2] * s_cbrt;
        let lab_a = LMS_TO_LAB[1][0] * l_cbrt + LMS_TO_LAB[1][1] * m_cbrt + LMS_TO_LAB[1][2] * s_cbrt;
        let lab_b = LMS_TO_LAB[2][0] * l_cbrt + LMS_TO_LAB[2][1] * m_cbrt + LMS_TO_LAB[2][2] * s_cbrt;

        // Step 5: OKLab to OKLCH (Cartesian to polar)
        let c = (lab_a * lab_a + lab_b * lab_b).sqrt();
        let h = if c > 1e-10 {
            let h_rad = lab_b.atan2(lab_a);
            let h_deg = h_rad.to_degrees();
            if h_deg < 0.0 { h_deg + 360.0 } else { h_deg }
        } else {
            0.0 // Achromatic: hue is undefined
        };

        ColorOklch {
            l: lab_l.clamp(0.0, 1.0),
            c: c.clamp(0.0, 0.4),
            h: h.rem_euclid(360.0),
        }
    }

    /// Correct OKLCH → RGB conversion using Björn Ottosson's algorithm
    ///
    /// Pipeline: OKLCH → OKLab → LMS' → LMS → Linear RGB → sRGB
    ///
    /// Returns (r, g, b) as u8 [0, 255]
    fn to_rgb_simple(&self) -> (u8, u8, u8) {
        // Step 1: OKLCH to OKLab (polar to Cartesian)
        let h_rad = self.h.to_radians();
        let lab_a = self.c * h_rad.cos();
        let lab_b = self.c * h_rad.sin();

        // Step 2: OKLab to LMS' (cube-root space)
        let l_cbrt = LAB_TO_LMS[0][0] * self.l + LAB_TO_LMS[0][1] * lab_a + LAB_TO_LMS[0][2] * lab_b;
        let m_cbrt = LAB_TO_LMS[1][0] * self.l + LAB_TO_LMS[1][1] * lab_a + LAB_TO_LMS[1][2] * lab_b;
        let s_cbrt = LAB_TO_LMS[2][0] * self.l + LAB_TO_LMS[2][1] * lab_a + LAB_TO_LMS[2][2] * lab_b;

        // Step 3: Apply cube (inverse of cube root)
        let l = l_cbrt * l_cbrt * l_cbrt;
        let m = m_cbrt * m_cbrt * m_cbrt;
        let s = s_cbrt * s_cbrt * s_cbrt;

        // Step 4: LMS to linear RGB
        let r_linear = LMS_TO_RGB[0][0] * l + LMS_TO_RGB[0][1] * m + LMS_TO_RGB[0][2] * s;
        let g_linear = LMS_TO_RGB[1][0] * l + LMS_TO_RGB[1][1] * m + LMS_TO_RGB[1][2] * s;
        let b_linear = LMS_TO_RGB[2][0] * l + LMS_TO_RGB[2][1] * m + LMS_TO_RGB[2][2] * s;

        // Step 5: Linear RGB to sRGB with clamping and gamma correction
        let r = (linear_to_srgb(r_linear.clamp(0.0, 1.0)) * 255.0).round() as u8;
        let g = (linear_to_srgb(g_linear.clamp(0.0, 1.0)) * 255.0).round() as u8;
        let b = (linear_to_srgb(b_linear.clamp(0.0, 1.0)) * 255.0).round() as u8;

        (r, g, b)
    }

    /// Get linear RGB values from this OKLCH color
    /// Used for WCAG luminance calculation
    pub(crate) fn to_linear_rgb(&self) -> (f64, f64, f64) {
        let h_rad = self.h.to_radians();
        let lab_a = self.c * h_rad.cos();
        let lab_b = self.c * h_rad.sin();

        let l_cbrt = LAB_TO_LMS[0][0] * self.l + LAB_TO_LMS[0][1] * lab_a + LAB_TO_LMS[0][2] * lab_b;
        let m_cbrt = LAB_TO_LMS[1][0] * self.l + LAB_TO_LMS[1][1] * lab_a + LAB_TO_LMS[1][2] * lab_b;
        let s_cbrt = LAB_TO_LMS[2][0] * self.l + LAB_TO_LMS[2][1] * lab_a + LAB_TO_LMS[2][2] * lab_b;

        let l = l_cbrt * l_cbrt * l_cbrt;
        let m = m_cbrt * m_cbrt * m_cbrt;
        let s = s_cbrt * s_cbrt * s_cbrt;

        let r = (LMS_TO_RGB[0][0] * l + LMS_TO_RGB[0][1] * m + LMS_TO_RGB[0][2] * s).clamp(0.0, 1.0);
        let g = (LMS_TO_RGB[1][0] * l + LMS_TO_RGB[1][1] * m + LMS_TO_RGB[1][2] * s).clamp(0.0, 1.0);
        let b = (LMS_TO_RGB[2][0] * l + LMS_TO_RGB[2][1] * m + LMS_TO_RGB[2][2] * s).clamp(0.0, 1.0);

        (r, g, b)
    }
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    #[cfg(target_arch = "wasm32")]
    use super::*;

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_color_creation_valid() {
        let color = ColorOklch::new(0.5, 0.1, 180.0);
        assert!(color.is_ok());

        let color = color.unwrap();
        assert_eq!(color.l, 0.5);
        assert_eq!(color.c, 0.1);
        assert_eq!(color.h, 180.0);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_color_creation_invalid_lightness() {
        let color = ColorOklch::new(1.5, 0.1, 180.0);
        assert!(color.is_err());

        let color = ColorOklch::new(-0.1, 0.1, 180.0);
        assert!(color.is_err());
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_color_creation_invalid_chroma() {
        let color = ColorOklch::new(0.5, 0.5, 180.0);
        assert!(color.is_err());

        let color = ColorOklch::new(0.5, -0.1, 180.0);
        assert!(color.is_err());
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_shift_lightness() {
        let color = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        let lighter = color.shift_lightness(0.2);
        assert_eq!(lighter.l, 0.7);

        let darker = color.shift_lightness(-0.3);
        assert_eq!(darker.l, 0.2);

        // Test clamping
        let clamped = color.shift_lightness(1.0);
        assert_eq!(clamped.l, 1.0);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_shift_chroma() {
        let color = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        let more_vivid = color.shift_chroma(0.05);
        assert_eq!(more_vivid.c, 0.15);

        let less_vivid = color.shift_chroma(-0.05);
        assert_eq!(less_vivid.c, 0.05);

        // Test clamping
        let clamped = color.shift_chroma(0.5);
        assert_eq!(clamped.c, 0.4);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_rotate_hue() {
        let color = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        let rotated = color.rotate_hue(30.0);
        assert_eq!(rotated.h, 210.0);

        // Test wrapping
        let wrapped = color.rotate_hue(200.0);
        assert_eq!(wrapped.h, 20.0);

        // Test negative rotation
        let negative = color.rotate_hue(-45.0);
        assert_eq!(negative.h, 135.0);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_to_hex() {
        let color = ColorOklch::new(0.5, 0.1, 180.0).unwrap();
        let hex = color.to_hex();
        assert!(hex.starts_with('#'));
        assert_eq!(hex.len(), 7);
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_from_hex_valid() {
        let color = ColorOklch::from_hex("#FF5733");
        assert!(color.is_ok());

        let color = ColorOklch::from_hex("FF5733");
        assert!(color.is_ok());
    }

    #[cfg(target_arch = "wasm32")]
    #[test]
    fn test_from_hex_invalid() {
        let color = ColorOklch::from_hex("#FF57");
        assert!(color.is_err());

        let color = ColorOklch::from_hex("GGGGGG");
        assert!(color.is_err());
    }

    // ========================================================================
    // SCIENTIFIC VALIDATION TESTS (P4)
    // Reference values from Björn Ottosson's implementation and momoto-core
    // These tests run on all architectures to validate correctness
    // ========================================================================

    use super::{ColorOklch, srgb_to_linear, linear_to_srgb};

    /// Golden test: Pure Red RGB(255, 0, 0) → OKLCH
    /// Reference: momoto-core golden_primary_colors test
    #[test]
    fn test_oklch_red_golden() {
        let color = ColorOklch::from_rgb_simple(255, 0, 0);

        // Expected: L ≈ 0.628, C ≈ 0.257, H ≈ 29.2°
        assert!(
            (color.l - 0.628).abs() < 0.01,
            "Red L: {} (expected ~0.628, error: {:.2}%)",
            color.l,
            (color.l - 0.628).abs() / 0.628 * 100.0
        );
        assert!(
            (color.c - 0.257).abs() < 0.01,
            "Red C: {} (expected ~0.257)",
            color.c
        );
        assert!(
            (color.h - 29.2).abs() < 2.0,
            "Red H: {} (expected ~29.2°)",
            color.h
        );
    }

    /// Golden test: Pure Green RGB(0, 255, 0) → OKLCH
    #[test]
    fn test_oklch_green_golden() {
        let color = ColorOklch::from_rgb_simple(0, 255, 0);

        // Expected: L ≈ 0.866, C ≈ 0.295, H ≈ 142°
        assert!(
            (color.l - 0.866).abs() < 0.01,
            "Green L: {} (expected ~0.866, error: {:.2}%)",
            color.l,
            (color.l - 0.866).abs() / 0.866 * 100.0
        );
        assert!(
            (color.c - 0.295).abs() < 0.02,
            "Green C: {} (expected ~0.295)",
            color.c
        );
    }

    /// Golden test: Pure Blue RGB(0, 0, 255) → OKLCH
    #[test]
    fn test_oklch_blue_golden() {
        let color = ColorOklch::from_rgb_simple(0, 0, 255);

        // Expected: L ≈ 0.452, C ≈ 0.313, H ≈ 264°
        assert!(
            (color.l - 0.452).abs() < 0.01,
            "Blue L: {} (expected ~0.452, error: {:.2}%)",
            color.l,
            (color.l - 0.452).abs() / 0.452 * 100.0
        );
        assert!(
            (color.c - 0.313).abs() < 0.02,
            "Blue C: {} (expected ~0.313)",
            color.c
        );
    }

    /// Golden test: White RGB(255, 255, 255) → OKLCH
    #[test]
    fn test_oklch_white_golden() {
        let color = ColorOklch::from_rgb_simple(255, 255, 255);

        // Expected: L ≈ 1.0, C ≈ 0.0
        assert!(
            (color.l - 1.0).abs() < 0.01,
            "White L: {} (expected ~1.0)",
            color.l
        );
        assert!(
            color.c < 0.01,
            "White C: {} (expected ~0.0)",
            color.c
        );
    }

    /// Golden test: Black RGB(0, 0, 0) → OKLCH
    #[test]
    fn test_oklch_black_golden() {
        let color = ColorOklch::from_rgb_simple(0, 0, 0);

        // Expected: L ≈ 0.0, C ≈ 0.0
        assert!(
            color.l < 0.01,
            "Black L: {} (expected ~0.0)",
            color.l
        );
        assert!(
            color.c < 0.01,
            "Black C: {} (expected ~0.0)",
            color.c
        );
    }

    /// Golden test: Mid Gray RGB(128, 128, 128) → OKLCH
    #[test]
    fn test_oklch_gray_golden() {
        let color = ColorOklch::from_rgb_simple(128, 128, 128);

        // Expected: L ≈ 0.60, C ≈ 0.0 (achromatic)
        assert!(
            (color.l - 0.60).abs() < 0.02,
            "Gray L: {} (expected ~0.60, error: {:.2}%)",
            color.l,
            (color.l - 0.60).abs() / 0.60 * 100.0
        );
        assert!(
            color.c < 0.01,
            "Gray C: {} (expected ~0.0)",
            color.c
        );
    }

    /// Roundtrip test: RGB → OKLCH → RGB
    #[test]
    fn test_oklch_roundtrip() {
        let test_colors = [
            (255, 0, 0),     // Red
            (0, 255, 0),     // Green
            (0, 0, 255),     // Blue
            (255, 255, 255), // White
            (0, 0, 0),       // Black
            (128, 128, 128), // Gray
            (255, 128, 0),   // Orange
            (128, 0, 255),   // Purple
        ];

        for (r, g, b) in test_colors {
            let oklch = ColorOklch::from_rgb_simple(r, g, b);
            let (r2, g2, b2) = oklch.to_rgb_simple();

            // Allow ±1 for rounding
            assert!(
                (r as i32 - r2 as i32).abs() <= 1,
                "Roundtrip R: {} → {} (color: RGB({},{},{}))",
                r, r2, r, g, b
            );
            assert!(
                (g as i32 - g2 as i32).abs() <= 1,
                "Roundtrip G: {} → {} (color: RGB({},{},{}))",
                g, g2, r, g, b
            );
            assert!(
                (b as i32 - b2 as i32).abs() <= 1,
                "Roundtrip B: {} → {} (color: RGB({},{},{}))",
                b, b2, r, g, b
            );
        }
    }

    /// Test gamma correction functions
    #[test]
    fn test_gamma_correction() {
        // Test linearization at key points
        assert!((srgb_to_linear(0.0) - 0.0).abs() < 1e-10);
        assert!((srgb_to_linear(1.0) - 1.0).abs() < 1e-10);

        // Test gamma application at key points
        assert!((linear_to_srgb(0.0) - 0.0).abs() < 1e-10);
        assert!((linear_to_srgb(1.0) - 1.0).abs() < 1e-10);

        // Roundtrip through gamma
        for i in 0..=10 {
            let v = i as f64 / 10.0;
            let roundtrip = linear_to_srgb(srgb_to_linear(v));
            assert!(
                (v - roundtrip).abs() < 1e-10,
                "Gamma roundtrip failed for {}: got {}",
                v, roundtrip
            );
        }
    }

    /// Test that lightness error is within 1% tolerance (P4 criterion)
    #[test]
    fn test_lightness_error_tolerance() {
        let test_cases = [
            ((255, 0, 0), 0.628),   // Red
            ((0, 255, 0), 0.866),   // Green
            ((0, 0, 255), 0.452),   // Blue
            ((128, 128, 128), 0.60), // Gray
        ];

        for ((r, g, b), expected_l) in test_cases {
            let color = ColorOklch::from_rgb_simple(r, g, b);
            let error_percent = (color.l - expected_l).abs() / expected_l * 100.0;

            assert!(
                error_percent < 1.0,
                "Lightness error > 1% for RGB({},{},{}): L={}, expected={}, error={:.2}%",
                r, g, b, color.l, expected_l, error_percent
            );
        }
    }
}
