//! P5-FT: Stress Testing Científico
//!
//! Tests de estabilidad numérica para fine-tuning post-remediación.
//! Evalúa: drift, saturación indebida, banding, inestabilidad numérica.

use momoto_ui_core::ColorOklch;

// ============================================================================
// STRESS TEST 1: ROUNDTRIP ERROR ACUMULADO
// ============================================================================

/// Test de roundtrip iterativo: RGB → OKLCH → RGB (1000 iteraciones)
/// Mide el drift acumulado después de conversiones repetidas.
#[test]
fn stress_roundtrip_1000_iterations() {
    let test_colors = [
        (255, 0, 0),     // Red
        (0, 255, 0),     // Green
        (0, 0, 255),     // Blue
        (255, 255, 0),   // Yellow
        (0, 255, 255),   // Cyan
        (255, 0, 255),   // Magenta
        (128, 128, 128), // Gray
        (64, 128, 192),  // Random
    ];

    for (r, g, b) in test_colors {
        let mut current_r = r;
        let mut current_g = g;
        let mut current_b = b;

        // 1000 roundtrips
        for _ in 0..1000 {
            let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", current_r, current_g, current_b)).unwrap();
            let hex = oklch.to_hex();
            let hex_clean = hex.trim_start_matches('#');
            current_r = u8::from_str_radix(&hex_clean[0..2], 16).unwrap();
            current_g = u8::from_str_radix(&hex_clean[2..4], 16).unwrap();
            current_b = u8::from_str_radix(&hex_clean[4..6], 16).unwrap();
        }

        // Drift máximo permitido: ±2 por canal después de 1000 iteraciones
        let drift_r = (current_r as i32 - r as i32).abs();
        let drift_g = (current_g as i32 - g as i32).abs();
        let drift_b = (current_b as i32 - b as i32).abs();

        assert!(
            drift_r <= 2 && drift_g <= 2 && drift_b <= 2,
            "Drift excesivo después de 1000 roundtrips para RGB({},{},{}): Δ=({},{},{})",
            r, g, b, drift_r, drift_g, drift_b
        );
    }
}

// ============================================================================
// STRESS TEST 2: COLORES EXTREMOS (NEAR-BLACK, NEAR-WHITE)
// ============================================================================

/// Test de estabilidad en colores extremos
///
/// NOTA P5-FT: Los umbrales se ajustaron basado en evidencia empírica.
/// RGB(4,4,4) produce L≈0.107 debido a la no-linealidad de sRGB gamma.
/// Esto es matemáticamente correcto según la especificación OKLCH.
#[test]
fn stress_extreme_colors() {
    // Near-black: L debe crecer rápidamente desde 0 debido a gamma
    // RGB(5,5,5) → L ≈ 0.12 es esperado (no lineal)
    for v in 0..=5 {
        let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", v, v, v)).unwrap();
        // Ajuste P5-FT: tolerancia basada en comportamiento real de gamma
        assert!(
            oklch.l >= 0.0 && oklch.l <= 0.15,
            "Near-black L fuera de rango ajustado: v={}, L={}",
            v, oklch.l
        );
        assert!(
            oklch.c < 0.01,
            "Near-black tiene chroma: v={}, C={}",
            v, oklch.c
        );
    }

    // Near-white: L debe estar cerca de 1.0
    for v in 250..=255 {
        let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", v, v, v)).unwrap();
        assert!(
            oklch.l >= 0.95 && oklch.l <= 1.0,
            "Near-white L fuera de rango: v={}, L={}",
            v, oklch.l
        );
        assert!(
            oklch.c < 0.01,
            "Near-white tiene chroma: v={}, C={}",
            v, oklch.c
        );
    }
}

// ============================================================================
// STRESS TEST 3: GRADIENTE LARGO (BANDING CHECK)
// ============================================================================

/// Test de gradiente: verifica que no hay saltos abruptos en L
///
/// NOTA P5-FT: Los primeros valores de sRGB (0-10) tienen saltos mayores
/// debido a la no-linealidad de gamma. Esto es correcto.
/// El test verifica que no hay banding en el rango perceptualmente importante.
#[test]
fn stress_gradient_no_banding() {
    let mut prev_l: f64 = 0.0;
    let mut max_delta: f64 = 0.0;

    // Gradiente de negro a blanco
    for v in 0..=255 {
        let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", v, v, v)).unwrap();

        if v > 0 {
            let delta_l = oklch.l - prev_l;
            max_delta = max_delta.max(delta_l);

            // Monotonicidad: L debe ser creciente (o igual)
            assert!(
                delta_l >= -0.0001,
                "Monotonicidad violada en v={}: ΔL={:.4}",
                v, delta_l
            );

            // Banding check: para v > 10, ΔL debe ser < 0.015
            // Los primeros valores tienen saltos mayores (gamma effect)
            if v > 10 {
                assert!(
                    delta_l <= 0.015,
                    "Banding detectado en v={}: ΔL={:.4} (prev={:.4}, curr={:.4})",
                    v, delta_l, prev_l, oklch.l
                );
            }
        }

        prev_l = oklch.l;
    }

    println!("Gradiente: max ΔL = {:.5}", max_delta);
}

// ============================================================================
// STRESS TEST 4: CHROMA ALTA (GAMUT BOUNDARY)
// ============================================================================

/// Test de chroma máxima por hue
#[test]
fn stress_high_chroma_stability() {
    // Colores con chroma máxima en sRGB
    let high_chroma_colors = [
        (255, 0, 0),   // Red - máxima chroma ~0.26
        (0, 255, 0),   // Green - máxima chroma ~0.29
        (0, 0, 255),   // Blue - máxima chroma ~0.31
        (255, 255, 0), // Yellow
        (0, 255, 255), // Cyan
        (255, 0, 255), // Magenta
    ];

    for (r, g, b) in high_chroma_colors {
        let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", r, g, b)).unwrap();

        // Chroma debe estar en rango válido
        assert!(
            oklch.c >= 0.0 && oklch.c <= 0.4,
            "Chroma fuera de rango para RGB({},{},{}): C={}",
            r, g, b, oklch.c
        );

        // Hue debe estar definido para colores cromáticos
        assert!(
            oklch.h >= 0.0 && oklch.h <= 360.0,
            "Hue inválido para RGB({},{},{}): H={}",
            r, g, b, oklch.h
        );

        // Roundtrip debe preservar el color
        let hex = oklch.to_hex();
        let hex_clean = hex.trim_start_matches('#');
        let r2 = u8::from_str_radix(&hex_clean[0..2], 16).unwrap();
        let g2 = u8::from_str_radix(&hex_clean[2..4], 16).unwrap();
        let b2 = u8::from_str_radix(&hex_clean[4..6], 16).unwrap();

        assert!(
            (r as i32 - r2 as i32).abs() <= 1 &&
            (g as i32 - g2 as i32).abs() <= 1 &&
            (b as i32 - b2 as i32).abs() <= 1,
            "Roundtrip falló para high-chroma RGB({},{},{}): got ({},{},{})",
            r, g, b, r2, g2, b2
        );
    }
}

// ============================================================================
// STRESS TEST 5: ESTADOS UI ENCADENADOS
// ============================================================================

/// Test de estados UI: idle → hover → active → idle (sin drift)
#[test]
fn stress_ui_state_chain() {
    let base = ColorOklch { l: 0.5, c: 0.15, h: 220.0 };

    // Simular cadena de estados
    let hover = base.shift_lightness(0.05).shift_chroma(0.02);
    let active = hover.shift_lightness(-0.13).shift_chroma(0.01); // Hover a Active
    let back_to_idle = active.shift_lightness(0.08).shift_chroma(-0.03); // Active a Idle

    // El resultado debe estar cerca del base
    let l_diff = (back_to_idle.l - base.l).abs();
    let c_diff = (back_to_idle.c - base.c).abs();

    assert!(
        l_diff < 0.001,
        "Drift de L en cadena de estados: Δ={:.6}",
        l_diff
    );
    assert!(
        c_diff < 0.001,
        "Drift de C en cadena de estados: Δ={:.6}",
        c_diff
    );
}

// ============================================================================
// STRESS TEST 6: PRECISIÓN NUMÉRICA (f64)
// ============================================================================

/// Test de precisión: valores muy pequeños y muy grandes
#[test]
fn stress_numerical_precision() {
    // Test con valores que podrían causar underflow/overflow
    let test_cases = [
        (1, 1, 1),       // Near-black
        (254, 254, 254), // Near-white
        (1, 0, 0),       // Near-black red
        (0, 1, 0),       // Near-black green
        (0, 0, 1),       // Near-black blue
    ];

    for (r, g, b) in test_cases {
        let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", r, g, b)).unwrap();

        // No debe haber NaN o Infinity
        assert!(
            oklch.l.is_finite(),
            "L es infinito/NaN para RGB({},{},{})",
            r, g, b
        );
        assert!(
            oklch.c.is_finite(),
            "C es infinito/NaN para RGB({},{},{})",
            r, g, b
        );
        assert!(
            oklch.h.is_finite(),
            "H es infinito/NaN para RGB({},{},{})",
            r, g, b
        );
    }
}

// ============================================================================
// STRESS TEST 7: MONOTONICIDAD DE LIGHTNESS
// ============================================================================

/// Test: L debe ser monótono creciente con brillo RGB
#[test]
fn stress_lightness_monotonicity() {
    let mut prev_l = 0.0;

    for v in 0..=255 {
        let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", v, v, v)).unwrap();

        assert!(
            oklch.l >= prev_l - 0.001, // Permitir error de redondeo mínimo
            "Monotonicidad violada en v={}: prev_L={:.4}, curr_L={:.4}",
            v, prev_l, oklch.l
        );

        prev_l = oklch.l;
    }
}

// ============================================================================
// MÉTRICAS DE ERROR (REPORTE)
// ============================================================================

/// Genera reporte de métricas de error para fine-tuning
#[test]
fn report_error_metrics() {
    println!("\n=== P5-FT ERROR METRICS REPORT ===\n");

    // Colores de referencia con valores conocidos
    let references = [
        ((255, 0, 0), 0.628, 0.257, 29.2),   // Red
        ((0, 255, 0), 0.866, 0.295, 142.0),  // Green
        ((0, 0, 255), 0.452, 0.313, 264.0),  // Blue
    ];

    let mut total_l_error: f64 = 0.0;
    let mut total_c_error: f64 = 0.0;
    let mut max_l_error: f64 = 0.0;
    let mut max_c_error: f64 = 0.0;

    for ((r, g, b), ref_l, ref_c, _ref_h) in references {
        let oklch = ColorOklch::from_hex(&format!("{:02x}{:02x}{:02x}", r, g, b)).unwrap();

        let l_error = (oklch.l - ref_l).abs();
        let c_error = (oklch.c - ref_c).abs();

        total_l_error += l_error;
        total_c_error += c_error;
        max_l_error = max_l_error.max(l_error);
        max_c_error = max_c_error.max(c_error);

        println!(
            "RGB({:3},{:3},{:3}): L={:.4} (ref={:.3}, Δ={:.4}), C={:.4} (ref={:.3}, Δ={:.4})",
            r, g, b, oklch.l, ref_l, l_error, oklch.c, ref_c, c_error
        );
    }

    println!("\n--- Summary ---");
    println!("Avg L error: {:.5}", total_l_error / 3.0);
    println!("Avg C error: {:.5}", total_c_error / 3.0);
    println!("Max L error: {:.5}", max_l_error);
    println!("Max C error: {:.5}", max_c_error);
    println!("\n=== END REPORT ===\n");

    // Criterio P5-FT: error máximo < 1%
    assert!(
        max_l_error < 0.01,
        "Error de L excede 1%: {:.4}",
        max_l_error
    );
}
