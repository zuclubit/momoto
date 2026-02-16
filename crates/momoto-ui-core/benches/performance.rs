// Rust performance benchmarks
//
// Run with: cargo bench
//
// These benchmarks measure the raw Rust performance without WASM overhead.
// For WASM benchmarks, see packages/momoto-ui-wasm/benchmark/

use momoto_ui_core::*;

// ============================================================================
// STATE MACHINE BENCHMARKS
// ============================================================================

#[cfg(test)]
mod state_benchmarks {
    use super::*;

    #[test]
    fn bench_determine_state_idle() {
        let iterations = 100_000;
        let start = std::time::Instant::now();

        for _ in 0..iterations {
            UIState::determine(false, false, false, false, false);
        }

        let elapsed = start.elapsed();
        let avg_ns = elapsed.as_nanos() / iterations;

        println!("determine_state (idle): {} ns/call", avg_ns);
        assert!(avg_ns < 100); // Should be < 100ns
    }

    #[test]
    fn bench_determine_state_complex() {
        let iterations = 100_000;
        let start = std::time::Instant::now();

        for i in 0..iterations {
            let disabled = i % 5 == 0;
            let loading = i % 7 == 0;
            let active = i % 3 == 0;
            let focused = i % 2 == 0;
            let hovered = i % 4 == 0;

            UIState::determine(disabled, loading, active, focused, hovered);
        }

        let elapsed = start.elapsed();
        let avg_ns = elapsed.as_nanos() / iterations;

        println!("determine_state (varied): {} ns/call", avg_ns);
        assert!(avg_ns < 150);
    }

    #[test]
    fn bench_state_metadata() {
        let iterations = 100_000;
        let states = [
            UIState::Idle,
            UIState::Hover,
            UIState::Active,
            UIState::Focus,
        ];

        let start = std::time::Instant::now();

        for i in 0..iterations {
            states[i % states.len()].metadata();
        }

        let elapsed = start.elapsed();
        let avg_ns = elapsed.as_nanos() / iterations;

        println!("state_metadata: {} ns/call", avg_ns);
        assert!(avg_ns < 50); // Should be very fast
    }
}

// ============================================================================
// COLOR BENCHMARKS
// ============================================================================

#[cfg(test)]
mod color_benchmarks {
    use super::*;

    #[test]
    fn bench_color_shifts() {
        let iterations = 100_000;
        let color = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let _ = color.shift_lightness(0.05);
            let _ = color.shift_chroma(0.02);
            let _ = color.rotate_hue(30.0);
        }

        let elapsed = start.elapsed();
        let avg_ns = elapsed.as_nanos() / (iterations * 3);

        println!("color_shift: {} ns/call", avg_ns);
        assert!(avg_ns < 50);
    }
}

// ============================================================================
// TOKEN DERIVATION BENCHMARKS
// ============================================================================

#[cfg(test)]
mod token_benchmarks {
    use super::*;

    #[test]
    fn bench_derive_single_state() {
        let iterations = 10_000;
        let mut engine = TokenDerivationEngine::new();
        let base = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let _ = engine.derive_states(base.l, base.c, base.h);
        }

        let elapsed = start.elapsed();
        let avg_us = elapsed.as_micros() / iterations;

        println!("derive_states (6 states): {} µs/call", avg_us);
        println!("Cache size: {}", engine.cache_size());

        assert!(avg_us < 50); // Should be < 50µs per call
    }

    #[test]
    fn bench_derive_cold_cache() {
        let iterations = 1_000;
        let colors = vec![
            (0.3, 0.08, 180.0),
            (0.4, 0.10, 240.0),
            (0.5, 0.12, 300.0),
            (0.6, 0.14, 60.0),
            (0.7, 0.16, 120.0),
        ];

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let mut engine = TokenDerivationEngine::new();
            for (l, c, h) in &colors {
                let _ = engine.derive_states(*l, *c, *h);
            }
        }

        let elapsed = start.elapsed();
        let avg_us = elapsed.as_micros() / (iterations * colors.len() as u128);

        println!("derive_states (cold cache): {} µs/call", avg_us);
        assert!(avg_us < 100);
    }

    #[test]
    fn bench_derive_hot_cache() {
        let iterations = 100_000;
        let mut engine = TokenDerivationEngine::new();
        let base = ColorOklch::new(0.5, 0.1, 180.0).unwrap();

        // Prime cache
        let _ = engine.derive_states(base.l, base.c, base.h);

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let _ = engine.derive_states(base.l, base.c, base.h);
        }

        let elapsed = start.elapsed();
        let avg_ns = elapsed.as_nanos() / iterations;

        println!("derive_states (hot cache): {} ns/call", avg_ns);
        assert!(avg_ns < 500); // Should be very fast with cache
    }
}

// ============================================================================
// ACCESSIBILITY BENCHMARKS
// ============================================================================

#[cfg(test)]
mod a11y_benchmarks {
    use super::*;

    #[test]
    fn bench_wcag_contrast() {
        let iterations = 10_000;
        let fg = ColorOklch { l: 0.2, c: 0.05, h: 240.0 };
        let bg = ColorOklch { l: 0.95, c: 0.02, h: 60.0 };

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let _ = a11y::calculate_wcag_contrast(&fg, &bg);
        }

        let elapsed = start.elapsed();
        let avg_us = elapsed.as_micros() / iterations;

        println!("wcag_contrast: {} µs/call", avg_us);
        assert!(avg_us < 20); // Should be < 20µs
    }

    #[test]
    fn bench_apca_contrast() {
        let iterations = 10_000;
        let fg = ColorOklch { l: 0.2, c: 0.05, h: 240.0 };
        let bg = ColorOklch { l: 0.95, c: 0.02, h: 60.0 };

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let _ = a11y::calculate_apca_contrast(&fg, &bg);
        }

        let elapsed = start.elapsed();
        let avg_us = elapsed.as_micros() / iterations;

        println!("apca_contrast: {} µs/call", avg_us);
        assert!(avg_us < 25); // Should be < 25µs
    }

    #[test]
    fn bench_validate_contrast_full() {
        let iterations = 5_000;

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let _ = validate_contrast(
                0.2, 0.05, 240.0,
                0.95, 0.02, 60.0,
            );
        }

        let elapsed = start.elapsed();
        let avg_us = elapsed.as_micros() / iterations;

        println!("validate_contrast (WCAG + APCA): {} µs/call", avg_us);
        assert!(avg_us < 50); // Full validation < 50µs
    }

    #[test]
    fn bench_passes_wcag_aa() {
        let iterations = 50_000;

        let start = std::time::Instant::now();

        for _ in 0..iterations {
            let _ = passes_wcag_aa(
                0.2, 0.0, 0.0,
                0.9, 0.0, 0.0,
            );
        }

        let elapsed = start.elapsed();
        let avg_ns = elapsed.as_nanos() / iterations;

        println!("passes_wcag_aa (quick check): {} ns/call", avg_ns);
        assert!(avg_ns < 1000); // Quick check < 1µs
    }
}

// ============================================================================
// CACHE PERFORMANCE
// ============================================================================

#[cfg(test)]
mod cache_benchmarks {
    use super::*;

    #[test]
    fn bench_cache_growth() {
        let mut engine = TokenDerivationEngine::new();

        let counts = [10, 50, 100, 500, 1000];

        println!("\nCache Growth Analysis:");
        println!("Colors | Cache Size | Avg Time (µs)");
        println!("-------|------------|-------------");

        for &count in &counts {
            engine.clear_cache();

            let start = std::time::Instant::now();

            for i in 0..count {
                let l = 0.3 + (i as f64 / count as f64) * 0.4;
                let c = 0.05 + (i as f64 / count as f64) * 0.15;
                let h = (i as f64 / count as f64) * 360.0;

                let _ = engine.derive_states(l, c, h);
            }

            let elapsed = start.elapsed();
            let avg_us = elapsed.as_micros() / count as u128;

            println!("{:6} | {:10} | {:12}",
                count,
                engine.cache_size(),
                avg_us
            );
        }
    }

    #[test]
    fn bench_cache_hit_rate() {
        let mut engine = TokenDerivationEngine::new();

        // Create 100 unique colors
        let colors: Vec<(f64, f64, f64)> = (0..100)
            .map(|i| {
                let t = i as f64 / 100.0;
                (0.3 + t * 0.4, 0.05 + t * 0.15, t * 360.0)
            })
            .collect();

        // Prime cache
        for (l, c, h) in &colors {
            let _ = engine.derive_states(*l, *c, *h);
        }

        // Measure cache hits (80% of requests hit cache)
        let iterations = 10_000;
        let start = std::time::Instant::now();

        for i in 0..iterations {
            let (l, c, h) = if i % 5 < 4 {
                // 80% cache hit
                colors[i % colors.len()]
            } else {
                // 20% cache miss
                let t = (i as f64) / (iterations as f64);
                (0.5 + t * 0.1, 0.1 + t * 0.05, t * 60.0)
            };

            let _ = engine.derive_states(l, c, h);
        }

        let elapsed = start.elapsed();
        let avg_ns = elapsed.as_nanos() / iterations;

        println!("\nCache Hit Rate Test (80% hits):");
        println!("Average time: {} ns/call", avg_ns);
        println!("Cache size: {}", engine.cache_size());
    }
}
