/*!
 * APCA (Accessible Perceptual Contrast Algorithm) - Rust/WASM Implementation
 *
 * This is a direct port of the corrected TypeScript implementation to Rust/WASM
 * for performance optimization (target: ≥6x improvement).
 *
 * **CRITICAL**: This implementation MUST produce bit-for-bit identical results
 * to the TypeScript implementation in domain/value-objects/APCAContrast.ts
 *
 * Algorithm Version: SAPC-4g / APCA-W3 0.1.9
 * Reference: https://github.com/Myndex/apca-w3
 *
 * Date: 2026-01-06
 * Phase: FASE 3 - Rust/WASM Migration
 */

use wasm_bindgen::prelude::*;

// ============================================================================
// APCA Constants (MUST match TypeScript exactly)
// ============================================================================

/// Main TRC (gamma) for sRGB transformation
const MAIN_TRC: f64 = 2.4;

/// sRGB luminance coefficients
const S_R_CO: f64 = 0.2126729;
const S_G_CO: f64 = 0.7151522;
const S_B_CO: f64 = 0.0721750;

/// Soft clamp threshold for very dark colors
const BLK_THRS: f64 = 0.022;

/// Soft clamp exponent
const BLK_CLMP: f64 = 1.414;

/// Normalization exponents and scale factors
const NORM_BG: f64 = 0.56;
const NORM_TXT: f64 = 0.57;
const REV_BG: f64 = 0.65;
const REV_TXT: f64 = 0.62;
const SCALE_BOW: f64 = 1.14;  // Black on White scale
const SCALE_WOB: f64 = 1.14;  // White on Black scale

/// Low contrast offsets
const LO_BOW_OFFSET: f64 = 0.027;
const LO_WOB_OFFSET: f64 = 0.027;

/// Low contrast clipping threshold
/// CRITICAL: This is 0.1, NOT 0.001 (FASE 2 fix)
const LO_CLIP: f64 = 0.1;

/// Minimum luminance delta threshold
const DELTA_Y_MIN: f64 = 0.0005;

// ============================================================================
// Core APCA Implementation
// ============================================================================

/// Convert sRGB channel (0-255) to linear light (0.0-1.0)
///
/// Applies gamma correction with MAIN_TRC exponent (2.4)
#[inline]
fn srgb_to_linear(channel: u8) -> f64 {
    let normalized = f64::from(channel) / 255.0;
    normalized.powf(MAIN_TRC)
}

/// Convert sRGB color to luminance (Y)
///
/// Uses sRGB luminance coefficients to calculate relative luminance
fn srgb_to_y(r: u8, g: u8, b: u8) -> f64 {
    S_R_CO * srgb_to_linear(r) +
    S_G_CO * srgb_to_linear(g) +
    S_B_CO * srgb_to_linear(b)
}

/// Apply soft clamp for very dark colors
///
/// Colors with Y < BLK_THRS get clamped using a power curve
/// to prevent issues near absolute black
fn soft_clamp(y: f64) -> f64 {
    if y <= BLK_THRS {
        y + (BLK_THRS - y).powf(BLK_CLMP)
    } else {
        y
    }
}

/// Calculate APCA contrast (Lc value)
///
/// This is the main WASM-exported function that computes the Lc contrast
/// between foreground and background colors.
///
/// # Arguments
/// * `fg_r`, `fg_g`, `fg_b` - Foreground RGB values (0-255)
/// * `bg_r`, `bg_g`, `bg_b` - Background RGB values (0-255)
///
/// # Returns
/// * Lc value as f64
///   - Positive = dark text on light background
///   - Negative = light text on dark background
///   - Zero = insufficient contrast (below clipping threshold)
///
/// # Algorithm Flow
/// 1. Convert sRGB to luminance (Y)
/// 2. Apply soft clamp for very dark colors
/// 3. Check deltaYmin (minimum luminance difference)
/// 4. Calculate SAPC (base contrast value)
/// 5. Apply polarity-specific normalization
/// 6. Apply low contrast clipping
/// 7. Apply offset and scale to Lc
///
/// # Examples
/// ```rust
/// use apca_wasm::apca_contrast;
///
/// // Black on white = 106.04 Lc
/// let lc = apca_contrast(0, 0, 0, 255, 255, 255);
/// assert!((lc - 106.04).abs() < 0.1);
///
/// // White on black = -107.88 Lc
/// let lc = apca_contrast(255, 255, 255, 0, 0, 0);
/// assert!((lc + 107.88).abs() < 0.1);
/// ```
#[wasm_bindgen]
pub fn apca_contrast(
    fg_r: u8,
    fg_g: u8,
    fg_b: u8,
    bg_r: u8,
    bg_g: u8,
    bg_b: u8,
) -> f64 {
    // Step 1: Convert sRGB to luminance (Y)
    let mut text_y = srgb_to_y(fg_r, fg_g, fg_b);
    let mut back_y = srgb_to_y(bg_r, bg_g, bg_b);

    // Step 2: Apply soft clamp for very dark colors
    text_y = soft_clamp(text_y);
    back_y = soft_clamp(back_y);

    // Step 3: Check deltaYmin - return 0 if difference too small
    if (back_y - text_y).abs() < DELTA_Y_MIN {
        return 0.0;
    }

    // Step 4: Determine polarity
    let is_dark_on_light = back_y > text_y;

    // Step 5: Calculate SAPC with polarity-specific normalization
    let sapc = if is_dark_on_light {
        // Dark text on light background (normal polarity)
        (back_y.powf(NORM_BG) - text_y.powf(NORM_TXT)) * SCALE_BOW
    } else {
        // Light text on dark background (reverse polarity)
        (back_y.powf(REV_BG) - text_y.powf(REV_TXT)) * SCALE_WOB
    };

    // Step 6: Apply low contrast clipping and offset
    // CRITICAL: Uses LO_CLIP = 0.1 (FASE 2 fix)
    let output_contrast = if is_dark_on_light {
        // Normal polarity: clip if SAPC < 0.1
        if sapc < LO_CLIP {
            0.0
        } else {
            sapc - LO_BOW_OFFSET
        }
    } else {
        // Reverse polarity: clip if SAPC > -0.1
        if sapc > -LO_CLIP {
            0.0
        } else {
            sapc + LO_WOB_OFFSET
        }
    };

    // Step 7: Scale to Lc (multiply by 100)
    output_contrast * 100.0
}

// ============================================================================
// Unit Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    // Golden test vectors from corrected APCA implementation
    // These MUST match the canonical apca-w3 v0.1.9 outputs

    #[test]
    fn test_black_on_white() {
        let lc = apca_contrast(0, 0, 0, 255, 255, 255);
        assert!((lc - 106.04).abs() < 0.01, "Black on White: expected 106.04, got {}", lc);
    }

    #[test]
    fn test_white_on_black() {
        let lc = apca_contrast(255, 255, 255, 0, 0, 0);
        assert!((lc + 107.88).abs() < 0.01, "White on Black: expected -107.88, got {}", lc);
    }

    #[test]
    fn test_mid_gray_on_white() {
        let lc = apca_contrast(136, 136, 136, 255, 255, 255);
        assert!((lc - 63.06).abs() < 0.01, "Mid Gray on White: expected 63.06, got {}", lc);
    }

    #[test]
    fn test_mid_gray_on_black() {
        let lc = apca_contrast(136, 136, 136, 0, 0, 0);
        assert!((lc + 38.62).abs() < 0.01, "Mid Gray on Black: expected -38.62, got {}", lc);
    }

    #[test]
    fn test_blue_on_white() {
        // CRITICAL: This was wrong in original golden vectors (expected 54.62)
        // Canonical value is 85.82 Lc (FASE 2 discovery)
        let lc = apca_contrast(0, 0, 255, 255, 255, 255);
        assert!((lc - 85.82).abs() < 0.01, "Blue on White: expected 85.82, got {}", lc);
    }

    #[test]
    fn test_teal_on_cream() {
        let lc = apca_contrast(17, 34, 51, 221, 238, 255);
        assert!((lc - 91.67).abs() < 0.5, "Teal on Cream: expected 91.67, got {}", lc);
    }

    #[test]
    fn test_yellow_on_black() {
        let lc = apca_contrast(255, 255, 0, 0, 0, 0);
        assert!((lc + 102.71).abs() < 0.5, "Yellow on Black: expected -102.71, got {}", lc);
    }

    #[test]
    fn test_yellow_on_white() {
        // CRITICAL: This clips to zero (below LO_CLIP threshold)
        let lc = apca_contrast(255, 255, 0, 255, 255, 255);
        assert!((lc - 0.0).abs() < 0.01, "Yellow on White: expected 0.00 (clipped), got {}", lc);
    }

    #[test]
    fn test_dark_navy_on_darker_navy() {
        // CRITICAL: This clips to zero (below LO_CLIP threshold)
        let lc = apca_contrast(34, 51, 68, 17, 34, 51);
        assert!((lc - 0.0).abs() < 0.01, "Dark Navy on Darker Navy: expected 0.00 (clipped), got {}", lc);
    }

    #[test]
    fn test_near_black_on_black() {
        // CRITICAL: This clips to zero (below LO_CLIP threshold)
        let lc = apca_contrast(5, 5, 5, 0, 0, 0);
        assert!((lc - 0.0).abs() < 0.01, "Near Black on Black: expected 0.00 (clipped), got {}", lc);
    }

    #[test]
    fn test_aa_threshold() {
        let lc = apca_contrast(89, 89, 89, 255, 255, 255);
        assert!((lc - 84.29).abs() < 0.5, "AA Threshold: expected 84.29, got {}", lc);
    }

    #[test]
    fn test_aaa_threshold() {
        let lc = apca_contrast(61, 61, 61, 255, 255, 255);
        assert!((lc - 95.19).abs() < 0.5, "AAA Threshold: expected 95.19, got {}", lc);
    }

    // Additional edge case tests

    #[test]
    fn test_identical_colors() {
        // Same color should return 0
        let lc = apca_contrast(128, 128, 128, 128, 128, 128);
        assert_eq!(lc, 0.0, "Identical colors should return 0");
    }

    #[test]
    fn test_soft_clamp_near_black() {
        // Very dark colors should still produce a result
        let lc = apca_contrast(10, 10, 10, 0, 0, 0);
        assert!(lc.is_finite(), "Soft clamp should produce finite result");
    }

    #[test]
    fn test_polarity_detection() {
        // Positive Lc = dark on light
        let lc_dark_on_light = apca_contrast(0, 0, 0, 255, 255, 255);
        assert!(lc_dark_on_light > 0.0, "Dark on light should be positive");

        // Negative Lc = light on dark
        let lc_light_on_dark = apca_contrast(255, 255, 255, 0, 0, 0);
        assert!(lc_light_on_dark < 0.0, "Light on dark should be negative");
    }

    #[test]
    fn test_symmetry() {
        // Swapping colors should invert the sign (approximately)
        let lc1 = apca_contrast(50, 50, 50, 200, 200, 200);
        let lc2 = apca_contrast(200, 200, 200, 50, 50, 50);

        // Not exact due to polarity-specific normalization, but magnitudes should be close
        assert!((lc1.abs() - lc2.abs()).abs() < 20.0, "Polarity swap should produce similar magnitudes");
        assert!(lc1 * lc2 < 0.0, "Polarity swap should invert sign");
    }
}
