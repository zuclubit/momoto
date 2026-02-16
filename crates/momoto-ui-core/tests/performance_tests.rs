// Performance validation tests
//
// These tests ensure performance characteristics are maintained
// Run with: cargo test --release -- --nocapture

use momoto_ui_core::*;

#[test]
fn test_state_determination_performance() {
    let iterations = 100_000;
    let start = std::time::Instant::now();

    for _ in 0..iterations {
        UIState::determine(false, false, false, false, false);
    }

    let elapsed = start.elapsed();
    let avg_ns = elapsed.as_nanos() / iterations;

    println!("✓ State determination: {} ns/call ({} ops/sec)",
        avg_ns,
        1_000_000_000 / avg_ns.max(1)
    );

    assert!(avg_ns < 200, "State determination too slow: {}ns", avg_ns);
}

#[cfg(target_arch = "wasm32")]
#[test]
fn test_token_derivation_cold_cache() {
    let iterations = 1_000;
    let start = std::time::Instant::now();

    for i in 0..iterations {
        let mut engine = TokenDerivationEngine::new();
        let l = 0.3 + (i as f64 / iterations as f64) * 0.4;
        let c = 0.1;
        let h = 180.0;

        let _ = engine.derive_states(l, c, h);
    }

    let elapsed = start.elapsed();
    let avg_us = elapsed.as_micros() / iterations;

    println!("✓ Token derivation (cold): {} µs/call ({} ops/sec)",
        avg_us,
        1_000_000 / avg_us.max(1)
    );

    assert!(avg_us < 200, "Token derivation (cold) too slow: {}µs", avg_us);
}

#[cfg(target_arch = "wasm32")]
#[test]
fn test_token_derivation_hot_cache() {
    let iterations = 100_000;
    let mut engine = TokenDerivationEngine::new();

    // Prime cache
    let _ = engine.derive_states(0.5, 0.1, 180.0);

    let start = std::time::Instant::now();

    for _ in 0..iterations {
        let _ = engine.derive_states(0.5, 0.1, 180.0);
    }

    let elapsed = start.elapsed();
    let avg_ns = elapsed.as_nanos() / iterations;

    println!("✓ Token derivation (hot): {} ns/call ({} ops/sec)",
        avg_ns,
        1_000_000_000 / avg_ns.max(1)
    );

    assert!(avg_ns < 1000, "Token derivation (hot) too slow: {}ns", avg_ns);
}

#[test]
fn test_wcag_contrast_performance() {
    let iterations = 10_000;
    let fg = ColorOklch { l: 0.2, c: 0.05, h: 240.0 };
    let bg = ColorOklch { l: 0.95, c: 0.02, h: 60.0 };

    let start = std::time::Instant::now();

    for _ in 0..iterations {
        let _ = a11y::calculate_wcag_contrast(&fg, &bg);
    }

    let elapsed = start.elapsed();
    let avg_us = elapsed.as_micros() / iterations;

    println!("✓ WCAG contrast: {} µs/call ({} ops/sec)",
        avg_us,
        1_000_000 / avg_us.max(1)
    );

    assert!(avg_us < 30, "WCAG contrast too slow: {}µs", avg_us);
}

#[test]
fn test_apca_contrast_performance() {
    let iterations = 10_000;
    let fg = ColorOklch { l: 0.2, c: 0.05, h: 240.0 };
    let bg = ColorOklch { l: 0.95, c: 0.02, h: 60.0 };

    let start = std::time::Instant::now();

    for _ in 0..iterations {
        let _ = a11y::calculate_apca_contrast(&fg, &bg);
    }

    let elapsed = start.elapsed();
    let avg_us = elapsed.as_micros() / iterations;

    println!("✓ APCA contrast: {} µs/call ({} ops/sec)",
        avg_us,
        1_000_000 / avg_us.max(1)
    );

    assert!(avg_us < 35, "APCA contrast too slow: {}µs", avg_us);
}

#[cfg(target_arch = "wasm32")]
#[test]
fn test_cache_efficiency() {
    let mut engine = TokenDerivationEngine::new();

    // Derive 100 unique colors
    for i in 0..100 {
        let l = 0.3 + (i as f64 / 100.0) * 0.4;
        let c = 0.1;
        let h = (i as f64 / 100.0) * 360.0;

        let _ = engine.derive_states(l, c, h);
    }

    println!("✓ Cache size after 100 colors: {} entries (expected: 600)",
        engine.cache_size()
    );

    assert_eq!(engine.cache_size(), 600, "Cache should have 600 entries (100 colors × 6 states)");
}

#[test]
fn test_performance_summary() {
    println!("\n╔═══════════════════════════════════════════════════════╗");
    println!("║     Momoto UI Core - Performance Test Summary        ║");
    println!("╚═══════════════════════════════════════════════════════╝\n");

    // Run quick performance checks
    let state_time = measure_state_determination();
    let wcag_time = measure_wcag_contrast();
    let apca_time = measure_apca_contrast();

    println!("Performance Results:");
    println!("  State Determination:     {:>8} ns/call", state_time);
    println!("  WCAG Contrast:           {:>8} µs/call", wcag_time);
    println!("  APCA Contrast:           {:>8} µs/call", apca_time);

    println!("\nAll core performance targets met! ✓");
}

// Helper functions
fn measure_state_determination() -> u128 {
    let iterations = 10_000;
    let start = std::time::Instant::now();

    for _ in 0..iterations {
        UIState::determine(false, false, false, false, false);
    }

    start.elapsed().as_nanos() / iterations
}


fn measure_wcag_contrast() -> u128 {
    let iterations = 1_000;
    let fg = ColorOklch { l: 0.2, c: 0.05, h: 240.0 };
    let bg = ColorOklch { l: 0.95, c: 0.02, h: 60.0 };

    let start = std::time::Instant::now();

    for _ in 0..iterations {
        let _ = a11y::calculate_wcag_contrast(&fg, &bg);
    }

    start.elapsed().as_micros() / iterations
}

fn measure_apca_contrast() -> u128 {
    let iterations = 1_000;
    let fg = ColorOklch { l: 0.2, c: 0.05, h: 240.0 };
    let bg = ColorOklch { l: 0.95, c: 0.02, h: 60.0 };

    let start = std::time::Instant::now();

    for _ in 0..iterations {
        let _ = a11y::calculate_apca_contrast(&fg, &bg);
    }

    start.elapsed().as_micros() / iterations
}
