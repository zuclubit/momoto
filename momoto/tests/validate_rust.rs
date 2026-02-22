//! Cross-runtime parity validator for Rust implementation
//!
//! This test validates that Rust outputs match the golden test vectors.
//! Run with: cargo test --test validate_rust

use momoto_core::color::Color;
use momoto_core::perception::ContrastMetric;
use momoto_core::space::oklch::OKLCH;
use momoto_metrics::apca::APCAMetric;
use momoto_metrics::wcag::WCAGMetric;
use serde::Deserialize;
use std::fs;

#[derive(Deserialize)]
struct TestVectors {
    wcag_vectors: Vec<WCAGVector>,
    apca_vectors: Vec<APCAVector>,
    oklch_vectors: Vec<OKLCHVector>,
}

#[derive(Deserialize)]
struct WCAGVector {
    name: String,
    foreground: [u8; 3],
    background: [u8; 3],
    expected_ratio: f64,
    tolerance: f64,
}

#[derive(Deserialize)]
struct APCAVector {
    name: String,
    foreground: [u8; 3],
    background: [u8; 3],
    expected_lc: f64,
    tolerance: f64,
    #[allow(dead_code)] // Documented in test vectors but not validated yet
    expected_polarity: String,
}

#[derive(Deserialize)]
struct OKLCHVector {
    name: String,
    rgb: [u8; 3],
    expected_l: f64,
    #[serde(default)]
    expected_c: f64,
    #[serde(default)]
    expected_h: f64,
    #[serde(default = "default_tolerance")]
    #[allow(dead_code)] // Generic tolerance; specific tolerances used instead
    tolerance: f64,
    #[serde(default = "default_tolerance")]
    tolerance_l: f64,
    #[serde(default = "default_tolerance")]
    tolerance_c: f64,
    #[serde(default = "default_tolerance_h")]
    tolerance_h: f64,
}

fn default_tolerance() -> f64 {
    0.01
}

fn default_tolerance_h() -> f64 {
    2.0
}

#[test]
fn validate_wcag_parity() {
    let json = fs::read_to_string("tests/parity/test-vectors.json")
        .or_else(|_| fs::read_to_string("parity/test-vectors.json"))
        .expect("Failed to read test vectors");
    let vectors: TestVectors = serde_json::from_str(&json).expect("Failed to parse JSON");

    let metric = WCAGMetric;
    let mut passed = 0;
    let mut failed = 0;

    for vector in vectors.wcag_vectors {
        let fg = Color::from_srgb8(
            vector.foreground[0],
            vector.foreground[1],
            vector.foreground[2],
        );
        let bg = Color::from_srgb8(
            vector.background[0],
            vector.background[1],
            vector.background[2],
        );
        let result = metric.evaluate(fg, bg);

        let diff = (result.value - vector.expected_ratio).abs();
        if diff <= vector.tolerance {
            passed += 1;
            println!(
                "✓ WCAG: {} - {:.4} (expected {:.4}, diff {:.4})",
                vector.name, result.value, vector.expected_ratio, diff
            );
        } else {
            failed += 1;
            eprintln!(
                "✗ WCAG: {} - {:.4} (expected {:.4}, diff {:.4}, tolerance {:.4})",
                vector.name, result.value, vector.expected_ratio, diff, vector.tolerance
            );
        }
    }

    println!("\nWCAG Results: {}/{} passed", passed, passed + failed);
    assert_eq!(failed, 0, "Some WCAG vectors failed validation");
}

#[test]
fn validate_apca_parity() {
    let json = fs::read_to_string("tests/parity/test-vectors.json")
        .or_else(|_| fs::read_to_string("parity/test-vectors.json"))
        .expect("Failed to read test vectors");
    let vectors: TestVectors = serde_json::from_str(&json).expect("Failed to parse JSON");

    let metric = APCAMetric;
    let mut passed = 0;
    let mut failed = 0;

    for vector in vectors.apca_vectors {
        let fg = Color::from_srgb8(
            vector.foreground[0],
            vector.foreground[1],
            vector.foreground[2],
        );
        let bg = Color::from_srgb8(
            vector.background[0],
            vector.background[1],
            vector.background[2],
        );
        let result = metric.evaluate(fg, bg);

        let diff = (result.value - vector.expected_lc).abs();
        if diff <= vector.tolerance {
            passed += 1;
            println!(
                "✓ APCA: {} - {:.2} Lc (expected {:.2}, diff {:.2})",
                vector.name, result.value, vector.expected_lc, diff
            );
        } else {
            failed += 1;
            eprintln!(
                "✗ APCA: {} - {:.2} Lc (expected {:.2}, diff {:.2}, tolerance {:.2})",
                vector.name, result.value, vector.expected_lc, diff, vector.tolerance
            );
        }
    }

    println!("\nAPCA Results: {}/{} passed", passed, passed + failed);
    assert_eq!(failed, 0, "Some APCA vectors failed validation");
}

#[test]
fn validate_oklch_parity() {
    let json = fs::read_to_string("tests/parity/test-vectors.json")
        .or_else(|_| fs::read_to_string("parity/test-vectors.json"))
        .expect("Failed to read test vectors");
    let vectors: TestVectors = serde_json::from_str(&json).expect("Failed to parse JSON");

    let mut passed = 0;
    let mut failed = 0;

    for vector in vectors.oklch_vectors {
        let color = Color::from_srgb8(vector.rgb[0], vector.rgb[1], vector.rgb[2]);
        let oklch = OKLCH::from_color(&color);

        let diff_l = (oklch.l - vector.expected_l).abs();
        let diff_c = (oklch.c - vector.expected_c).abs();

        // Handle hue specially (it's circular)
        let mut diff_h = (oklch.h - vector.expected_h).abs();
        if diff_h > 180.0 {
            diff_h = 360.0 - diff_h;
        }

        let l_ok = diff_l <= vector.tolerance_l;
        let c_ok = diff_c <= vector.tolerance_c;
        let h_ok = vector.expected_h == 0.0 || diff_h <= vector.tolerance_h;

        if l_ok && c_ok && h_ok {
            passed += 1;
            println!(
                "✓ OKLCH: {} - L={:.3} C={:.3} H={:.1} (expected L={:.3} C={:.3} H={:.1})",
                vector.name,
                oklch.l,
                oklch.c,
                oklch.h,
                vector.expected_l,
                vector.expected_c,
                vector.expected_h
            );
        } else {
            failed += 1;
            eprintln!(
                "✗ OKLCH: {} - L={:.3} C={:.3} H={:.1} (expected L={:.3} C={:.3} H={:.1})",
                vector.name,
                oklch.l,
                oklch.c,
                oklch.h,
                vector.expected_l,
                vector.expected_c,
                vector.expected_h
            );
            if !l_ok {
                eprintln!("  L diff: {:.4} > {:.4}", diff_l, vector.tolerance_l);
            }
            if !c_ok {
                eprintln!("  C diff: {:.4} > {:.4}", diff_c, vector.tolerance_c);
            }
            if !h_ok {
                eprintln!("  H diff: {:.4} > {:.4}", diff_h, vector.tolerance_h);
            }
        }
    }

    println!("\nOKLCH Results: {}/{} passed", passed, passed + failed);
    assert_eq!(failed, 0, "Some OKLCH vectors failed validation");
}
