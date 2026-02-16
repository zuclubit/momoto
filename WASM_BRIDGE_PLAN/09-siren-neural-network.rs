// =============================================================================
// momoto-wasm: SIREN Neural Network for Perceptual Color Correction
// File: crates/momoto-wasm/src/siren.rs
//
// Rust port of ventazo-web phase5-siren.ts
//
// Architecture: 9 → 16 → 16 → 3 (delta_L, delta_C, delta_H)
//   Layer 1: sin(ω₀ · (W·x + b)), ω₀ = 30.0
//   Layer 2: sin(1.0 · (W·x + b))
//   Layer 3: linear output
//
// Total parameters: (9×16 + 16) + (16×16 + 16) + (16×3 + 3) = 483
//
// Weights initialized deterministically via Mulberry32 PRNG (seed 42_1337)
// to match the TypeScript implementation exactly.
//
// This is a DIRECT PORT — identical seed, identical RNG, identical init scheme.
// Parity tests in 10-parity-tests.ts verify bit-exact output matching.
// =============================================================================

use wasm_bindgen::prelude::*;
use std::sync::LazyLock;

// =============================================================================
// CONSTANTS
// =============================================================================

const OMEGA_0: f64 = 30.0;

const INPUT_DIM: usize = 9;
const HIDDEN_DIM: usize = 16;
const OUTPUT_DIM: usize = 3;

const CLAMP_DELTA_L: (f64, f64) = (-0.15, 0.15);
const CLAMP_DELTA_C: (f64, f64) = (-0.05, 0.05);
const CLAMP_DELTA_H: (f64, f64) = (-10.0, 10.0);

// =============================================================================
// MULBERRY32 PRNG (matches TypeScript implementation exactly)
// =============================================================================

struct Mulberry32 {
    state: u32,
}

impl Mulberry32 {
    fn new(seed: u32) -> Self {
        Self { state: seed }
    }

    /// Generate next random value in [0, 1).
    /// Exact port of the TypeScript Mulberry32 implementation.
    fn next(&mut self) -> f64 {
        self.state = self.state.wrapping_add(0x6D2B79F5);
        let mut t = self.state ^ (self.state >> 15);
        t = t.wrapping_mul(1 | self.state);
        t = (t.wrapping_add(t ^ (t >> 7)).wrapping_mul(61 | t)) ^ t;
        ((t ^ (t >> 14)) as f64) / 4294967296.0
    }
}

// =============================================================================
// WEIGHT INITIALIZATION (matches TS initializeWeights / initializeBias)
// =============================================================================

fn initialize_weights(
    rows: usize,
    cols: usize,
    rng: &mut Mulberry32,
    is_first_layer: bool,
) -> Vec<f64> {
    let bound = if is_first_layer {
        1.0 / cols as f64
    } else {
        (6.0 / cols as f64).sqrt() / OMEGA_0
    };

    let mut weights = Vec::with_capacity(rows * cols);
    for _ in 0..(rows * cols) {
        weights.push((rng.next() * 2.0 - 1.0) * bound);
    }
    weights
}

fn initialize_bias(size: usize, rng: &mut Mulberry32, scale: f64) -> Vec<f64> {
    let mut bias = Vec::with_capacity(size);
    for _ in 0..size {
        bias.push((rng.next() * 2.0 - 1.0) * scale * 0.01);
    }
    bias
}

// =============================================================================
// NETWORK WEIGHTS (computed once, stored in static)
// =============================================================================

struct SirenWeights {
    w1: Vec<f64>, // 16 × 9 = 144
    b1: Vec<f64>, // 16
    w2: Vec<f64>, // 16 × 16 = 256
    b2: Vec<f64>, // 16
    w3: Vec<f64>, // 3 × 16 = 48
    b3: Vec<f64>, // 3
}

impl SirenWeights {
    fn init() -> Self {
        let seed: u32 = 42_1337; // Must match TS: const SEED = 42_1337
        let mut rng = Mulberry32::new(seed);

        let w1 = initialize_weights(HIDDEN_DIM, INPUT_DIM, &mut rng, true);
        let b1 = initialize_bias(HIDDEN_DIM, &mut rng, 1.0);
        let w2 = initialize_weights(HIDDEN_DIM, HIDDEN_DIM, &mut rng, false);
        let b2 = initialize_bias(HIDDEN_DIM, &mut rng, 1.0);
        let w3 = initialize_weights(OUTPUT_DIM, HIDDEN_DIM, &mut rng, false);
        let b3 = initialize_bias(OUTPUT_DIM, &mut rng, 0.1);

        Self { w1, b1, w2, b2, w3, b3 }
    }
}

static WEIGHTS: LazyLock<SirenWeights> = LazyLock::new(SirenWeights::init);

// =============================================================================
// FORWARD PASS (pure compute, no allocations on hot path)
// =============================================================================

/// Matrix-vector multiply + bias: output[i] = sum_j(W[i*cols + j] * input[j]) + bias[i]
#[inline]
fn mat_vec_mul_add(
    w: &[f64],
    input: &[f64],
    bias: &[f64],
    out_rows: usize,
    in_cols: usize,
    output: &mut [f64],
) {
    for i in 0..out_rows {
        let mut sum = bias[i];
        let row_offset = i * in_cols;
        for j in 0..in_cols {
            sum += w[row_offset + j] * input[j];
        }
        output[i] = sum;
    }
}

/// Apply sin activation with frequency scaling (in-place).
#[inline]
fn siren_activation(x: &mut [f64], omega: f64) {
    for val in x.iter_mut() {
        *val = (*val * omega).sin();
    }
}

/// SIREN forward pass.
///
/// Input features (9):
///   [bg_L, bg_C, bg_H_norm, fg_L, fg_C, fg_H_norm, apca_lc_norm, wcag_ratio_norm, quality_norm]
///
/// Output (3): [delta_L, delta_C, delta_H]
fn forward(input: &[f64; INPUT_DIM]) -> [f64; OUTPUT_DIM] {
    let weights = &*WEIGHTS;

    // Layer 1: sin(ω₀ · (W1 @ x + b1))
    let mut z1 = [0.0f64; HIDDEN_DIM];
    mat_vec_mul_add(&weights.w1, input, &weights.b1, HIDDEN_DIM, INPUT_DIM, &mut z1);
    siren_activation(&mut z1, OMEGA_0);

    // Layer 2: sin(1.0 · (W2 @ a1 + b2))
    let mut z2 = [0.0f64; HIDDEN_DIM];
    mat_vec_mul_add(&weights.w2, &z1, &weights.b2, HIDDEN_DIM, HIDDEN_DIM, &mut z2);
    siren_activation(&mut z2, 1.0);

    // Layer 3: linear (W3 @ a2 + b3)
    let mut output = [0.0f64; OUTPUT_DIM];
    mat_vec_mul_add(&weights.w3, &z2, &weights.b3, OUTPUT_DIM, HIDDEN_DIM, &mut output);

    output
}

/// Clamp value to [min, max].
#[inline]
fn clamp(value: f64, min: f64, max: f64) -> f64 {
    if value < min { min } else if value > max { max } else { value }
}

// =============================================================================
// WASM-BINDGEN PUBLIC API
// =============================================================================

/// SIREN neural correction result.
#[wasm_bindgen]
pub struct SirenCorrection {
    delta_l: f64,
    delta_c: f64,
    delta_h: f64,
}

#[wasm_bindgen]
impl SirenCorrection {
    #[wasm_bindgen(getter, js_name = "deltaL")]
    pub fn delta_l(&self) -> f64 { self.delta_l }

    #[wasm_bindgen(getter, js_name = "deltaC")]
    pub fn delta_c(&self) -> f64 { self.delta_c }

    #[wasm_bindgen(getter, js_name = "deltaH")]
    pub fn delta_h(&self) -> f64 { self.delta_h }
}

/// Compute SIREN neural correction for a foreground/background color pair.
///
/// Returns small delta adjustments in OKLCH space that improve perceptual quality.
/// Output is clamped to safe ranges to prevent destructive changes.
///
/// # Arguments
/// * `bg_l`, `bg_c`, `bg_h` - Background OKLCH (L 0-1, C 0-0.4, H 0-360)
/// * `fg_l`, `fg_c`, `fg_h` - Foreground OKLCH
/// * `apca_lc` - APCA Lightness Contrast (0-106)
/// * `wcag_ratio` - WCAG contrast ratio (1-21)
/// * `quality` - Quality score (0-100)
///
/// # Returns
/// SirenCorrection with delta_L, delta_C, delta_H
#[wasm_bindgen(js_name = "computeSirenCorrection")]
pub fn compute_siren_correction(
    bg_l: f64,
    bg_c: f64,
    bg_h: f64,
    fg_l: f64,
    fg_c: f64,
    fg_h: f64,
    apca_lc: f64,
    wcag_ratio: f64,
    quality: f64,
) -> SirenCorrection {
    let input: [f64; INPUT_DIM] = [
        bg_l,
        bg_c,
        bg_h / 360.0,
        fg_l,
        fg_c,
        fg_h / 360.0,
        apca_lc.abs() / 106.0,
        wcag_ratio / 21.0,
        quality / 100.0,
    ];

    let output = forward(&input);

    SirenCorrection {
        delta_l: clamp(output[0], CLAMP_DELTA_L.0, CLAMP_DELTA_L.1),
        delta_c: clamp(output[1], CLAMP_DELTA_C.0, CLAMP_DELTA_C.1),
        delta_h: clamp(output[2], CLAMP_DELTA_H.0, CLAMP_DELTA_H.1),
    }
}

/// Apply SIREN correction to OKLCH values.
///
/// Returns corrected [L, C, H] clamped to valid ranges.
#[wasm_bindgen(js_name = "applySirenCorrection")]
pub fn apply_siren_correction(
    l: f64,
    c: f64,
    h: f64,
    delta_l: f64,
    delta_c: f64,
    delta_h: f64,
) -> Box<[f64]> {
    Box::new([
        clamp(l + delta_l, 0.0, 1.0),
        (c + delta_c).max(0.0),
        ((h + delta_h) % 360.0 + 360.0) % 360.0,
    ])
}

/// Batch: Compute SIREN corrections for multiple color pairs.
///
/// # Arguments
/// * `inputs` - Float64Array of [bg_L, bg_C, bg_H, fg_L, fg_C, fg_H, apca_lc, wcag_ratio, quality, ...]
///              (9 values per pair)
///
/// # Returns
/// Float64Array of [delta_L, delta_C, delta_H, ...] (3 values per pair)
#[wasm_bindgen(js_name = "computeSirenCorrectionBatch")]
pub fn compute_siren_correction_batch(inputs: &[f64]) -> Result<Box<[f64]>, JsValue> {
    if inputs.len() % INPUT_DIM != 0 {
        return Err(JsValue::from_str(
            "Input must be multiple of 9: [bg_L, bg_C, bg_H, fg_L, fg_C, fg_H, apca_lc, wcag_ratio, quality, ...]"
        ));
    }

    let count = inputs.len() / INPUT_DIM;
    let mut results = Vec::with_capacity(count * OUTPUT_DIM);

    for i in 0..count {
        let base = i * INPUT_DIM;
        let input: [f64; INPUT_DIM] = [
            inputs[base],           // bg_L
            inputs[base + 1],       // bg_C
            inputs[base + 2] / 360.0, // bg_H (normalize)
            inputs[base + 3],       // fg_L
            inputs[base + 4],       // fg_C
            inputs[base + 5] / 360.0, // fg_H (normalize)
            inputs[base + 6].abs() / 106.0, // apca_lc (normalize)
            inputs[base + 7] / 21.0, // wcag_ratio (normalize)
            inputs[base + 8] / 100.0, // quality (normalize)
        ];

        let output = forward(&input);

        results.push(clamp(output[0], CLAMP_DELTA_L.0, CLAMP_DELTA_L.1));
        results.push(clamp(output[1], CLAMP_DELTA_C.0, CLAMP_DELTA_C.1));
        results.push(clamp(output[2], CLAMP_DELTA_H.0, CLAMP_DELTA_H.1));
    }

    Ok(results.into_boxed_slice())
}

/// Get network metadata as JSON.
///
/// Returns { architecture, totalParams, omega0, seed, clampRanges }
#[wasm_bindgen(js_name = "sirenMetadata")]
pub fn siren_metadata() -> Result<JsValue, JsValue> {
    let metadata = serde_json::json!({
        "architecture": [INPUT_DIM, HIDDEN_DIM, HIDDEN_DIM, OUTPUT_DIM],
        "totalParams": 483,
        "omega0": OMEGA_0,
        "seed": 42_1337u32,
        "activations": ["sin(ω₀·x)", "sin(x)", "linear"],
        "clampRanges": {
            "deltaL": CLAMP_DELTA_L,
            "deltaC": CLAMP_DELTA_C,
            "deltaH": CLAMP_DELTA_H,
        },
        "inputFeatures": [
            "bg_L", "bg_C", "bg_H_norm",
            "fg_L", "fg_C", "fg_H_norm",
            "apca_lc_norm", "wcag_ratio_norm", "quality_norm"
        ],
        "normalization": {
            "H": "/ 360.0",
            "apca_lc": "abs() / 106.0",
            "wcag_ratio": "/ 21.0",
            "quality": "/ 100.0"
        }
    });

    Ok(serde_wasm_bindgen::to_value(&metadata)
        .map_err(|e| JsValue::from_str(&e.to_string()))?)
}

/// Export raw network weights for inspection/debugging.
///
/// Returns JSON with W1, B1, W2, B2, W3, B3 as flat arrays.
#[wasm_bindgen(js_name = "sirenWeights")]
pub fn siren_weights() -> Result<JsValue, JsValue> {
    let w = &*WEIGHTS;
    let data = serde_json::json!({
        "W1": { "shape": [HIDDEN_DIM, INPUT_DIM], "data": w.w1 },
        "B1": { "shape": [HIDDEN_DIM], "data": w.b1 },
        "W2": { "shape": [HIDDEN_DIM, HIDDEN_DIM], "data": w.w2 },
        "B2": { "shape": [HIDDEN_DIM], "data": w.b2 },
        "W3": { "shape": [OUTPUT_DIM, HIDDEN_DIM], "data": w.w3 },
        "B3": { "shape": [OUTPUT_DIM], "data": w.b3 },
    });

    Ok(serde_wasm_bindgen::to_value(&data)
        .map_err(|e| JsValue::from_str(&e.to_string()))?)
}

// =============================================================================
// UNIT TESTS (cargo test)
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mulberry32_deterministic() {
        let mut rng1 = Mulberry32::new(42_1337);
        let mut rng2 = Mulberry32::new(42_1337);

        for _ in 0..100 {
            assert_eq!(rng1.next(), rng2.next());
        }
    }

    #[test]
    fn test_mulberry32_range() {
        let mut rng = Mulberry32::new(42_1337);
        for _ in 0..1000 {
            let v = rng.next();
            assert!(v >= 0.0 && v < 1.0, "Out of range: {}", v);
        }
    }

    #[test]
    fn test_weight_count() {
        let w = &*WEIGHTS;
        let total = w.w1.len() + w.b1.len()
                  + w.w2.len() + w.b2.len()
                  + w.w3.len() + w.b3.len();
        assert_eq!(total, 483, "Expected 483 parameters, got {}", total);
    }

    #[test]
    fn test_weight_dimensions() {
        let w = &*WEIGHTS;
        assert_eq!(w.w1.len(), 16 * 9, "W1 should be 16×9");
        assert_eq!(w.b1.len(), 16, "B1 should be 16");
        assert_eq!(w.w2.len(), 16 * 16, "W2 should be 16×16");
        assert_eq!(w.b2.len(), 16, "B2 should be 16");
        assert_eq!(w.w3.len(), 3 * 16, "W3 should be 3×16");
        assert_eq!(w.b3.len(), 3, "B3 should be 3");
    }

    #[test]
    fn test_forward_deterministic() {
        let input = [0.5, 0.1, 0.5, 0.9, 0.05, 0.5, 0.7, 0.6, 0.8];
        let out1 = forward(&input);
        let out2 = forward(&input);
        assert_eq!(out1, out2, "Forward pass must be deterministic");
    }

    #[test]
    fn test_output_in_range() {
        // Various input combinations
        let test_cases = [
            [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
            [1.0, 0.4, 1.0, 1.0, 0.4, 1.0, 1.0, 1.0, 1.0],
            [0.2, 0.15, 0.7, 0.8, 0.05, 0.7, 0.5, 0.3, 0.6],
        ];

        for input in &test_cases {
            let output = forward(input);
            let correction = SirenCorrection {
                delta_l: clamp(output[0], CLAMP_DELTA_L.0, CLAMP_DELTA_L.1),
                delta_c: clamp(output[1], CLAMP_DELTA_C.0, CLAMP_DELTA_C.1),
                delta_h: clamp(output[2], CLAMP_DELTA_H.0, CLAMP_DELTA_H.1),
            };

            assert!(correction.delta_l >= -0.15 && correction.delta_l <= 0.15,
                    "delta_L out of range: {}", correction.delta_l);
            assert!(correction.delta_c >= -0.05 && correction.delta_c <= 0.05,
                    "delta_C out of range: {}", correction.delta_c);
            assert!(correction.delta_h >= -10.0 && correction.delta_h <= 10.0,
                    "delta_H out of range: {}", correction.delta_h);
        }
    }

    #[test]
    fn test_correction_small_magnitude() {
        // With near-identity initialization, corrections should be small
        let input = [0.5, 0.1, 0.5, 0.9, 0.05, 0.5, 0.7, 0.6, 0.8];
        let output = forward(&input);

        // Raw output should be bounded (small corrections expected)
        for &v in &output {
            assert!(v.abs() < 5.0,
                    "Raw output too large: {} — weights may be miscalibrated", v);
        }
    }

    #[test]
    fn test_apply_correction() {
        let corrected = apply_siren_correction(
            0.8,   // L
            0.15,  // C
            350.0, // H
            -0.05, // delta_L
            0.02,  // delta_C
            15.0,  // delta_H (wraps around)
        );
        assert!((corrected[0] - 0.75).abs() < 1e-10, "L correction wrong");
        assert!((corrected[1] - 0.17).abs() < 1e-10, "C correction wrong");
        assert!((corrected[2] - 5.0).abs() < 1e-10, "H wrap-around wrong: {}", corrected[2]);
    }

    #[test]
    fn test_apply_correction_clamps() {
        let corrected = apply_siren_correction(
            0.05,  // L (near zero)
            0.01,  // C (near zero)
            5.0,   // H
            -0.15, // delta_L (would push below 0)
            -0.05, // delta_C (would push below 0)
            -10.0, // delta_H (wraps negative)
        );
        assert!(corrected[0] >= 0.0, "L should be clamped to >= 0");
        assert!(corrected[1] >= 0.0, "C should be clamped to >= 0");
        assert!(corrected[2] >= 0.0 && corrected[2] < 360.0, "H should be in [0, 360)");
    }

    #[test]
    fn test_batch_matches_single() {
        let bg_l = 0.2; let bg_c = 0.15; let bg_h = 250.0;
        let fg_l = 0.9; let fg_c = 0.03; let fg_h = 250.0;
        let apca = 75.0; let wcag = 8.5; let quality = 72.0;

        // Single call
        let single = compute_siren_correction(
            bg_l, bg_c, bg_h, fg_l, fg_c, fg_h, apca, wcag, quality,
        );

        // Batch call (same input)
        let batch_input = vec![bg_l, bg_c, bg_h, fg_l, fg_c, fg_h, apca, wcag, quality];
        let batch = compute_siren_correction_batch(&batch_input).unwrap();

        assert!((single.delta_l - batch[0]).abs() < 1e-15, "Batch delta_L mismatch");
        assert!((single.delta_c - batch[1]).abs() < 1e-15, "Batch delta_C mismatch");
        assert!((single.delta_h - batch[2]).abs() < 1e-15, "Batch delta_H mismatch");
    }
}
