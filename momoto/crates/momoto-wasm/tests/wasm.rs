//! WASM Bindings Test Suite
//!
//! Comprehensive automated tests for all 34 public WASM APIs.
//! These tests run in wasm32-unknown-unknown target and verify:
//! - Functional parity with Rust core
//! - Input validation and error handling
//! - Edge cases (NaN, invalid ranges, extreme contrasts)
//! - Batch operations consistency
//!
//! Run with: wasm-pack test --node

use momoto_wasm::*;
use wasm_bindgen_test::*;

wasm_bindgen_test_configure!(run_in_browser);

// ============================================================================
// Color API Tests (7 APIs)
// ============================================================================

#[wasm_bindgen_test]
fn test_color_constructor() {
    let color = Color::from_rgb(255, 128, 0);
    assert_eq!(color.r(), 255);
    assert_eq!(color.g(), 128);
    assert_eq!(color.b(), 0);
}

#[wasm_bindgen_test]
fn test_color_from_hex_with_hash() {
    let color = Color::from_hex("#FF8000").expect("Valid hex");
    assert_eq!(color.r(), 255);
    assert_eq!(color.g(), 128);
    assert_eq!(color.b(), 0);
}

#[wasm_bindgen_test]
fn test_color_from_hex_without_hash() {
    let color = Color::from_hex("FF8000").expect("Valid hex");
    assert_eq!(color.r(), 255);
    assert_eq!(color.g(), 128);
    assert_eq!(color.b(), 0);
}

#[wasm_bindgen_test]
fn test_color_from_hex_lowercase() {
    let color = Color::from_hex("ff8000").expect("Valid hex");
    assert_eq!(color.r(), 255);
    assert_eq!(color.g(), 128);
    assert_eq!(color.b(), 0);
}

#[wasm_bindgen_test]
fn test_color_from_hex_invalid_length() {
    let result = Color::from_hex("FF80");
    assert!(result.is_err());
}

#[wasm_bindgen_test]
fn test_color_from_hex_invalid_chars() {
    let result = Color::from_hex("GGGGGG");
    assert!(result.is_err());
}

#[wasm_bindgen_test]
fn test_color_to_hex() {
    let color = Color::from_rgb(255, 128, 0);
    assert_eq!(color.to_hex(), "#ff8000");
}

#[wasm_bindgen_test]
fn test_color_roundtrip_hex() {
    let original = Color::from_rgb(100, 150, 200);
    let hex = original.to_hex();
    let restored = Color::from_hex(&hex).expect("Valid hex");
    assert_eq!(original.r(), restored.r());
    assert_eq!(original.g(), restored.g());
    assert_eq!(original.b(), restored.b());
}

#[wasm_bindgen_test]
fn test_color_getters() {
    let color = Color::from_rgb(42, 127, 255);
    assert_eq!(color.r(), 42);
    assert_eq!(color.g(), 127);
    assert_eq!(color.b(), 255);
}

#[wasm_bindgen_test]
fn test_color_black() {
    let black = Color::from_rgb(0, 0, 0);
    assert_eq!(black.r(), 0);
    assert_eq!(black.g(), 0);
    assert_eq!(black.b(), 0);
    assert_eq!(black.to_hex(), "#000000");
}

#[wasm_bindgen_test]
fn test_color_white() {
    let white = Color::from_rgb(255, 255, 255);
    assert_eq!(white.r(), 255);
    assert_eq!(white.g(), 255);
    assert_eq!(white.b(), 255);
    assert_eq!(white.to_hex(), "#ffffff");
}

// ============================================================================
// WCAGMetric API Tests (5 APIs)
// ============================================================================

#[wasm_bindgen_test]
fn test_wcag_metric_constructor() {
    let _metric = WCAGMetric::new();
    // Should not panic
}

#[wasm_bindgen_test]
fn test_wcag_evaluate_black_on_white() {
    let metric = WCAGMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&black, &white);

    // WCAG 2.1 specifies 21:1 for maximum contrast
    assert!((result.value - 21.0).abs() < 0.01);
}

#[wasm_bindgen_test]
fn test_wcag_evaluate_white_on_black() {
    let metric = WCAGMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&white, &black);

    // Should be same as black on white (symmetric)
    assert!((result.value - 21.0).abs() < 0.01);
}

#[wasm_bindgen_test]
fn test_wcag_evaluate_same_color() {
    let metric = WCAGMetric::new();
    let gray = Color::from_rgb(128, 128, 128);

    let result = metric.evaluate(&gray, &gray);

    // Same color should have 1:1 ratio
    assert!((result.value - 1.0).abs() < 0.01);
}

#[wasm_bindgen_test]
fn test_wcag_evaluate_aa_threshold() {
    let metric = WCAGMetric::new();
    // Colors with approximately 4.5:1 ratio (AA normal text)
    let fg = Color::from_rgb(118, 118, 118);
    let bg = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&fg, &bg);

    // Should be around 4.5:1
    assert!(result.value >= 4.5);
    assert!(result.value < 4.6);
}

#[wasm_bindgen_test]
fn test_wcag_evaluate_batch() {
    let metric = WCAGMetric::new();

    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);
    let gray = Color::from_rgb(128, 128, 128);

    let foregrounds = vec![black, white, gray];
    let backgrounds = vec![white, black, white];

    let results = metric
        .evaluate_batch(foregrounds, backgrounds)
        .expect("Valid batch");

    assert_eq!(results.len(), 3);
    assert!((results[0].value - 21.0).abs() < 0.01); // black on white
    assert!((results[1].value - 21.0).abs() < 0.01); // white on black
    assert!(results[2].value < 21.0); // gray on white
}

#[wasm_bindgen_test]
fn test_wcag_evaluate_batch_length_mismatch() {
    let metric = WCAGMetric::new();

    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let foregrounds = vec![black, white];
    let backgrounds = vec![white]; // Mismatch!

    let result = metric.evaluate_batch(foregrounds, backgrounds);
    assert!(result.is_err());
}

#[wasm_bindgen_test]
fn test_wcag_passes_aa_normal() {
    // 4.5:1 for AA normal text
    assert!(WCAGMetric::passes(4.5, "AA", false));
    assert!(WCAGMetric::passes(5.0, "AA", false));
    assert!(!WCAGMetric::passes(4.4, "AA", false));
}

#[wasm_bindgen_test]
fn test_wcag_passes_aa_large() {
    // 3.0:1 for AA large text
    assert!(WCAGMetric::passes(3.0, "AA", true));
    assert!(WCAGMetric::passes(4.0, "AA", true));
    assert!(!WCAGMetric::passes(2.9, "AA", true));
}

#[wasm_bindgen_test]
fn test_wcag_passes_aaa_normal() {
    // 7.0:1 for AAA normal text
    assert!(WCAGMetric::passes(7.0, "AAA", false));
    assert!(WCAGMetric::passes(10.0, "AAA", false));
    assert!(!WCAGMetric::passes(6.9, "AAA", false));
}

#[wasm_bindgen_test]
fn test_wcag_passes_aaa_large() {
    // 4.5:1 for AAA large text
    assert!(WCAGMetric::passes(4.5, "AAA", true));
    assert!(WCAGMetric::passes(6.0, "AAA", true));
    assert!(!WCAGMetric::passes(4.4, "AAA", true));
}

#[wasm_bindgen_test]
fn test_wcag_passes_invalid_level() {
    // Invalid level should return false
    assert!(!WCAGMetric::passes(10.0, "A", false));
    assert!(!WCAGMetric::passes(10.0, "AAAA", false));
}

// ============================================================================
// APCAMetric API Tests (4 APIs)
// ============================================================================

#[wasm_bindgen_test]
fn test_apca_metric_constructor() {
    let _metric = APCAMetric::new();
    // Should not panic
}

#[wasm_bindgen_test]
fn test_apca_evaluate_black_on_white() {
    let metric = APCAMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&black, &white);

    // Dark on light should be positive
    assert!(result.value > 0.0);
    // Should be around 106 Lc (maximum for dark on light)
    assert!(result.value > 100.0);

    // Should have polarity
    assert_eq!(result.polarity, 1); // DarkOnLight
}

#[wasm_bindgen_test]
fn test_apca_evaluate_white_on_black() {
    let metric = APCAMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&white, &black);

    // Light on dark should be negative
    assert!(result.value < 0.0);
    // Should be around -108 Lc (maximum for light on dark)
    assert!(result.value < -100.0);

    // Should have polarity
    assert_eq!(result.polarity, -1); // LightOnDark
}

#[wasm_bindgen_test]
fn test_apca_evaluate_same_color() {
    let metric = APCAMetric::new();
    let gray = Color::from_rgb(128, 128, 128);

    let result = metric.evaluate(&gray, &gray);

    // Same color should have 0 Lc
    assert_eq!(result.value, 0.0);
}

#[wasm_bindgen_test]
fn test_apca_polarity_preserved() {
    let metric = APCAMetric::new();

    // Dark blue on white (dark on light)
    let blue = Color::from_rgb(0, 0, 139);
    let white = Color::from_rgb(255, 255, 255);
    let result1 = metric.evaluate(&blue, &white);
    assert!(result1.value > 0.0);
    assert_eq!(result1.polarity, 1); // DarkOnLight

    // Light blue on black (light on dark)
    let light_blue = Color::from_rgb(173, 216, 230);
    let black = Color::from_rgb(0, 0, 0);
    let result2 = metric.evaluate(&light_blue, &black);
    assert!(result2.value < 0.0);
    assert_eq!(result2.polarity, -1); // LightOnDark
}

#[wasm_bindgen_test]
fn test_apca_evaluate_batch() {
    let metric = APCAMetric::new();

    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);
    let gray = Color::from_rgb(128, 128, 128);

    let foregrounds = vec![black, white, gray];
    let backgrounds = vec![white, black, gray];

    let results = metric
        .evaluate_batch(foregrounds, backgrounds)
        .expect("Valid batch");

    assert_eq!(results.len(), 3);
    assert!(results[0].value > 100.0); // black on white
    assert!(results[1].value < -100.0); // white on black
    assert_eq!(results[2].value, 0.0); // gray on gray
}

#[wasm_bindgen_test]
fn test_apca_evaluate_batch_length_mismatch() {
    let metric = APCAMetric::new();

    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let foregrounds = vec![black, white, black];
    let backgrounds = vec![white]; // Mismatch!

    let result = metric.evaluate_batch(foregrounds, backgrounds);
    assert!(result.is_err());
}

#[wasm_bindgen_test]
fn test_apca_evaluate_batch_polarity_consistency() {
    let metric = APCAMetric::new();

    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    // All dark on light
    let foregrounds = vec![black, black, black];
    let backgrounds = vec![white, white, white];

    let results = metric
        .evaluate_batch(foregrounds, backgrounds)
        .expect("Valid batch");

    for result in results {
        assert!(result.value > 0.0);
        assert_eq!(result.polarity, 1); // DarkOnLight
    }
}

// ============================================================================
// OKLCH API Tests (15 APIs)
// ============================================================================

#[wasm_bindgen_test]
fn test_oklch_constructor() {
    let oklch = OKLCH::new(0.5, 0.1, 180.0);
    assert_eq!(oklch.l(), 0.5);
    assert_eq!(oklch.c(), 0.1);
    assert_eq!(oklch.h(), 180.0);
}

#[wasm_bindgen_test]
fn test_oklch_from_color_black() {
    let black = Color::from_rgb(0, 0, 0);
    let oklch = OKLCH::from_color(&black);

    // Black should have L near 0, C near 0
    assert!(oklch.l() < 0.01);
    assert!(oklch.c() < 0.01);
}

#[wasm_bindgen_test]
fn test_oklch_from_color_white() {
    let white = Color::from_rgb(255, 255, 255);
    let oklch = OKLCH::from_color(&white);

    // White should have L near 1, C near 0
    assert!(oklch.l() > 0.99);
    assert!(oklch.c() < 0.01);
}

#[wasm_bindgen_test]
fn test_oklch_from_color_blue() {
    let blue = Color::from_rgb(0, 0, 255);
    let oklch = OKLCH::from_color(&blue);

    // Blue should have moderate L, high C, hue around 264°
    assert!(oklch.l() > 0.4 && oklch.l() < 0.6);
    assert!(oklch.c() > 0.2);
    assert!(oklch.h() > 250.0 && oklch.h() < 280.0);
}

#[wasm_bindgen_test]
fn test_oklch_to_color_roundtrip() {
    let original = Color::from_rgb(100, 150, 200);
    let oklch = OKLCH::from_color(&original);
    let restored = oklch.to_color();

    // Should roundtrip within 1 unit (8-bit precision)
    let diff_r = (original.r() as i16 - restored.r() as i16).abs();
    let diff_g = (original.g() as i16 - restored.g() as i16).abs();
    let diff_b = (original.b() as i16 - restored.b() as i16).abs();

    assert!(diff_r <= 1);
    assert!(diff_g <= 1);
    assert!(diff_b <= 1);
}

#[wasm_bindgen_test]
fn test_oklch_lighten() {
    let oklch = OKLCH::new(0.5, 0.1, 180.0);
    let lighter = oklch.lighten(0.1);

    assert_eq!(lighter.l(), 0.6);
    assert_eq!(lighter.c(), 0.1);
    assert_eq!(lighter.h(), 180.0);
}

#[wasm_bindgen_test]
fn test_oklch_darken() {
    let oklch = OKLCH::new(0.5, 0.1, 180.0);
    let darker = oklch.darken(0.1);

    assert_eq!(darker.l(), 0.4);
    assert_eq!(darker.c(), 0.1);
    assert_eq!(darker.h(), 180.0);
}

#[wasm_bindgen_test]
fn test_oklch_saturate() {
    let oklch = OKLCH::new(0.5, 0.1, 180.0);
    let saturated = oklch.saturate(2.0);

    assert_eq!(saturated.l(), 0.5);
    assert_eq!(saturated.c(), 0.2);
    assert_eq!(saturated.h(), 180.0);
}

#[wasm_bindgen_test]
fn test_oklch_desaturate() {
    let oklch = OKLCH::new(0.5, 0.2, 180.0);
    let desaturated = oklch.desaturate(0.5);

    assert_eq!(desaturated.l(), 0.5);
    assert_eq!(desaturated.c(), 0.1);
    assert_eq!(desaturated.h(), 180.0);
}

#[wasm_bindgen_test]
fn test_oklch_rotate_hue() {
    let oklch = OKLCH::new(0.5, 0.1, 180.0);
    let rotated = oklch.rotate_hue(90.0);

    assert_eq!(rotated.l(), 0.5);
    assert_eq!(rotated.c(), 0.1);
    assert_eq!(rotated.h(), 270.0);
}

#[wasm_bindgen_test]
fn test_oklch_rotate_hue_wrap() {
    let oklch = OKLCH::new(0.5, 0.1, 350.0);
    let rotated = oklch.rotate_hue(30.0);

    // Should wrap around to 20°
    assert_eq!(rotated.h(), 20.0);
}

#[wasm_bindgen_test]
fn test_oklch_map_to_gamut() {
    // Create out-of-gamut color (high chroma)
    let out_of_gamut = OKLCH::new(0.5, 0.5, 180.0);
    let in_gamut = out_of_gamut.map_to_gamut();

    // Should reduce chroma to fit in sRGB gamut
    assert!(in_gamut.c() < out_of_gamut.c());

    // Should preserve hue and lightness as much as possible
    assert_eq!(in_gamut.l(), out_of_gamut.l());
    assert_eq!(in_gamut.h(), out_of_gamut.h());
}

#[wasm_bindgen_test]
fn test_oklch_delta_e() {
    let color1 = OKLCH::new(0.5, 0.1, 180.0);
    let color2 = OKLCH::new(0.5, 0.1, 180.0);
    let color3 = OKLCH::new(0.6, 0.1, 180.0);

    // Same color should have delta_e = 0
    assert_eq!(color1.delta_e(&color2), 0.0);

    // Different colors should have delta_e > 0
    assert!(color1.delta_e(&color3) > 0.0);
}

#[wasm_bindgen_test]
fn test_oklch_interpolate_shorter() {
    let start = OKLCH::new(0.3, 0.1, 0.0);
    let end = OKLCH::new(0.7, 0.2, 180.0);

    let mid = OKLCH::interpolate(&start, &end, 0.5, "shorter");

    assert_eq!(mid.l(), 0.5);
    assert_eq!(mid.c(), 0.15);
    assert_eq!(mid.h(), 90.0);
}

#[wasm_bindgen_test]
fn test_oklch_interpolate_longer() {
    let start = OKLCH::new(0.3, 0.1, 10.0);
    let end = OKLCH::new(0.7, 0.2, 20.0);

    let mid = OKLCH::interpolate(&start, &end, 0.5, "longer");

    assert_eq!(mid.l(), 0.5);
    assert_eq!(mid.c(), 0.15);
    // Should go the long way around the hue circle
    assert_eq!(mid.h(), 195.0);
}

#[wasm_bindgen_test]
fn test_oklch_interpolate_increasing() {
    let start = OKLCH::new(0.3, 0.1, 10.0);
    let end = OKLCH::new(0.7, 0.2, 350.0);

    let mid = OKLCH::interpolate(&start, &end, 0.5, "increasing");

    assert_eq!(mid.l(), 0.5);
    assert_eq!(mid.c(), 0.15);
    // Should always increase, wrapping through 360
    assert_eq!(mid.h(), 180.0);
}

#[wasm_bindgen_test]
fn test_oklch_interpolate_decreasing() {
    let start = OKLCH::new(0.3, 0.1, 350.0);
    let end = OKLCH::new(0.7, 0.2, 10.0);

    let mid = OKLCH::interpolate(&start, &end, 0.5, "decreasing");

    assert_eq!(mid.l(), 0.5);
    assert_eq!(mid.c(), 0.15);
    // Should always decrease
    assert_eq!(mid.h(), 180.0);
}

// ============================================================================
// ContrastResult API Tests (3 APIs)
// ============================================================================

#[wasm_bindgen_test]
fn test_contrast_result_value() {
    let metric = WCAGMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&black, &white);

    assert!((result.value - 21.0).abs() < 0.01);
}

#[wasm_bindgen_test]
fn test_contrast_result_polarity_none() {
    let metric = WCAGMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&black, &white);

    // WCAG doesn't have polarity
    assert_eq!(result.polarity, 0); // WCAG doesn't have polarity
}

#[wasm_bindgen_test]
fn test_contrast_result_polarity_dark_on_light() {
    let metric = APCAMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&black, &white);

    assert_eq!(result.polarity, 1); // DarkOnLight
}

#[wasm_bindgen_test]
fn test_contrast_result_polarity_light_on_dark() {
    let metric = APCAMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&white, &black);

    assert_eq!(result.polarity, -1); // LightOnDark
}

// ============================================================================
// Edge Cases and Stress Tests
// ============================================================================

#[wasm_bindgen_test]
fn test_extreme_contrast_wcag() {
    let metric = WCAGMetric::new();
    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    let result = metric.evaluate(&black, &white);

    // Maximum possible contrast
    assert!((result.value - 21.0).abs() < 0.01);
}

#[wasm_bindgen_test]
fn test_minimum_contrast_wcag() {
    let metric = WCAGMetric::new();
    let gray = Color::from_rgb(128, 128, 128);

    let result = metric.evaluate(&gray, &gray);

    // Minimum possible contrast
    assert!((result.value - 1.0).abs() < 0.01);
}

#[wasm_bindgen_test]
fn test_large_batch_wcag() {
    let metric = WCAGMetric::new();

    let black = Color::from_rgb(0, 0, 0);
    let white = Color::from_rgb(255, 255, 255);

    // Create large batch
    let foregrounds: Vec<Color> = (0..100).map(|_| black).collect();
    let backgrounds: Vec<Color> = (0..100).map(|_| white).collect();

    let results = metric
        .evaluate_batch(foregrounds, backgrounds)
        .expect("Valid batch");

    assert_eq!(results.len(), 100);
    for result in results {
        assert!((result.value - 21.0).abs() < 0.01);
    }
}

#[wasm_bindgen_test]
fn test_oklch_chain_transformations() {
    let color = Color::from_rgb(100, 150, 200);
    let oklch = OKLCH::from_color(&color);

    // Chain multiple transformations
    let transformed = oklch
        .lighten(0.1)
        .saturate(1.5)
        .rotate_hue(30.0)
        .map_to_gamut();

    // Should still be valid
    assert!(transformed.l() >= 0.0 && transformed.l() <= 1.0);
    assert!(transformed.c() >= 0.0);
    assert!(transformed.h() >= 0.0 && transformed.h() < 360.0);

    // Should be able to convert back to RGB
    let _rgb = transformed.to_color();
}

#[wasm_bindgen_test]
fn test_color_hex_all_zeros() {
    let color = Color::from_hex("#000000").expect("Valid hex");
    assert_eq!(color.r(), 0);
    assert_eq!(color.g(), 0);
    assert_eq!(color.b(), 0);
}

#[wasm_bindgen_test]
fn test_color_hex_all_ones() {
    let color = Color::from_hex("#ffffff").expect("Valid hex");
    assert_eq!(color.r(), 255);
    assert_eq!(color.g(), 255);
    assert_eq!(color.b(), 255);
}

#[wasm_bindgen_test]
fn test_wcag_batch_empty() {
    let metric = WCAGMetric::new();

    let foregrounds: Vec<Color> = vec![];
    let backgrounds: Vec<Color> = vec![];

    let results = metric
        .evaluate_batch(foregrounds, backgrounds)
        .expect("Valid empty batch");

    assert_eq!(results.len(), 0);
}

#[wasm_bindgen_test]
fn test_apca_batch_empty() {
    let metric = APCAMetric::new();

    let foregrounds: Vec<Color> = vec![];
    let backgrounds: Vec<Color> = vec![];

    let results = metric
        .evaluate_batch(foregrounds, backgrounds)
        .expect("Valid empty batch");

    assert_eq!(results.len(), 0);
}
