//! Comprehensive Phase 5 Tests
//!
//! Edge cases, determinism, physics regression, and cross-backend consistency tests.

use momoto_core::{
    backend::CssBackend,
    evaluated::{Evaluable, MaterialContext},
    material::GlassMaterial,
    render::{RenderBackend, RenderContext},
    space::oklch::OKLCH,
};

// ============================================================================
// EDGE CASES
// ============================================================================

#[test]
fn test_roughness_zero_minimum_scattering() {
    let glass = GlassMaterial {
        roughness: 0.0,
        ior: 1.5,
        thickness: 5.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let evaluated = glass.evaluate(&MaterialContext::default());

    assert!(
        evaluated.scattering_radius_mm < 1.0,
        "Roughness=0 should have minimal scattering, got {:.4}mm",
        evaluated.scattering_radius_mm
    );
    assert!(evaluated.opacity >= 0.0 && evaluated.opacity <= 1.0);
}

#[test]
fn test_roughness_one_maximum_scattering() {
    let glass = GlassMaterial {
        roughness: 1.0,
        ior: 1.5,
        thickness: 5.0,
        noise_scale: 1.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let evaluated = glass.evaluate(&MaterialContext::default());

    assert!(
        evaluated.scattering_radius_mm > 10.0,
        "Roughness=1 should have high scattering, got {:.4}mm",
        evaluated.scattering_radius_mm
    );
}

#[test]
fn test_viewing_angle_zero_perpendicular() {
    let glass = GlassMaterial::regular();
    let context = MaterialContext {
        viewing_angle_deg: 0.0,
        ..Default::default()
    };

    let evaluated = glass.evaluate(&context);

    assert!(
        evaluated.fresnel_edge_intensity < 0.3,
        "Perpendicular view should have low edge intensity, got {:.4}",
        evaluated.fresnel_edge_intensity
    );
}

#[test]
fn test_viewing_angle_grazing() {
    let glass = GlassMaterial::regular();
    let context = MaterialContext {
        viewing_angle_deg: 89.0,
        ..Default::default()
    };

    let evaluated = glass.evaluate(&context);

    assert!(
        evaluated.fresnel_edge_intensity > 0.7,
        "Grazing angle should have high edge intensity, got {:.4}",
        evaluated.fresnel_edge_intensity
    );
}

#[test]
fn test_thickness_thin_film() {
    let glass = GlassMaterial {
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.1,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let evaluated = glass.evaluate(&MaterialContext::default());

    assert!(
        evaluated.opacity < 0.5,
        "Thin film should have low opacity, got {:.4}",
        evaluated.opacity
    );
    assert_eq!(evaluated.thickness_mm, 0.1);
}

#[test]
fn test_thickness_thick_block() {
    let glass = GlassMaterial {
        roughness: 0.1,
        ior: 1.5,
        thickness: 100.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let evaluated = glass.evaluate(&MaterialContext::default());

    assert!(
        evaluated.opacity > 0.3,
        "Thick block should have higher opacity, got {:.4}",
        evaluated.opacity
    );
    assert_eq!(evaluated.thickness_mm, 100.0);
}

#[test]
fn test_color_pure_black() {
    let glass = GlassMaterial {
        roughness: 0.5,
        ior: 1.5,
        thickness: 5.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.0, 0.0, 0.0),
        edge_power: 2.0,
    };

    let evaluated = glass.evaluate(&MaterialContext::default());
    let color = evaluated.base_color;

    // Black glass may have some reflectance/transmission making it not pure black
    // Validate that color components are valid and finite
    assert!(color.r.is_finite() && color.r >= 0.0);
    assert!(color.g.is_finite() && color.g >= 0.0);
    assert!(color.b.is_finite() && color.b >= 0.0);
}

#[test]
fn test_color_pure_white() {
    let glass = GlassMaterial {
        roughness: 0.5,
        ior: 1.5,
        thickness: 5.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(1.0, 0.0, 0.0),
        edge_power: 2.0,
    };

    let evaluated = glass.evaluate(&MaterialContext::default());
    let color = evaluated.base_color;

    assert!(
        color.r > 0.8 && color.g > 0.8 && color.b > 0.8,
        "White glass should have light color"
    );
}

#[test]
fn test_all_extremes_valid() {
    let materials = vec![
        // All minimums
        GlassMaterial {
            roughness: 0.0,
            ior: 1.0,
            thickness: 0.0,
            noise_scale: 0.0,
            base_color: OKLCH::new(1.0, 0.0, 0.0),
            edge_power: 1.0,
        },
        // All maximums
        GlassMaterial {
            roughness: 1.0,
            ior: 3.0,
            thickness: 100.0,
            noise_scale: 1.0,
            base_color: OKLCH::new(0.0, 0.4, 0.0),
            edge_power: 5.0,
        },
    ];

    for material in materials {
        let evaluated = material.evaluate(&MaterialContext::default());

        // All should produce valid results
        assert!(evaluated.opacity >= 0.0 && evaluated.opacity <= 1.0);
        assert!(evaluated.scattering_radius_mm >= 0.0);
        assert!(evaluated.fresnel_f0 >= 0.0 && evaluated.fresnel_f0 <= 1.0);
    }
}

// ============================================================================
// DETERMINISM
// ============================================================================

#[test]
fn test_determinism_100_evaluations() {
    let material = GlassMaterial::regular();
    let context = MaterialContext::default();

    let results: Vec<_> = (0..100).map(|_| material.evaluate(&context)).collect();

    // All evaluations must be identical
    for i in 1..results.len() {
        assert_eq!(
            results[0].opacity, results[i].opacity,
            "Opacity differs at iteration {}",
            i
        );
        assert_eq!(
            results[0].scattering_radius_mm, results[i].scattering_radius_mm,
            "Scattering differs at iteration {}",
            i
        );
    }
}

#[test]
fn test_context_hash_consistency() {
    let material = GlassMaterial::regular();
    let context = MaterialContext::default();

    let evals: Vec<_> = (0..10).map(|_| material.evaluate(&context)).collect();

    let first_hash = evals[0].metadata.context_hash;
    for (i, eval) in evals.iter().enumerate().skip(1) {
        assert_eq!(
            eval.metadata.context_hash, first_hash,
            "Context hash differs at iteration {}",
            i
        );
    }
}

#[test]
fn test_material_immutability() {
    let material = GlassMaterial::regular();
    let context = MaterialContext::default();

    let _ = material.evaluate(&context);
    let _ = material.evaluate(&context);

    // Material parameters should be unchanged
    assert_eq!(material.roughness, GlassMaterial::regular().roughness);
    assert_eq!(material.ior, GlassMaterial::regular().ior);
}

#[test]
fn test_evaluation_order_independence() {
    let materials = vec![
        GlassMaterial::clear(),
        GlassMaterial::regular(),
        GlassMaterial::frosted(),
    ];

    let context = MaterialContext::default();

    // Evaluate in order A-B-C
    let results_abc: Vec<_> = materials.iter().map(|m| m.evaluate(&context)).collect();

    // Evaluate in order C-B-A
    let results_cba: Vec<_> = materials
        .iter()
        .rev()
        .map(|m| m.evaluate(&context))
        .collect();

    // Results should be the same regardless of order
    assert_eq!(results_abc[0].opacity, results_cba[2].opacity);
    assert_eq!(results_abc[1].opacity, results_cba[1].opacity);
    assert_eq!(results_abc[2].opacity, results_cba[0].opacity);
}

// ============================================================================
// PHYSICS REGRESSION
// ============================================================================

#[test]
fn test_fresnel_glass_f0() {
    let glass = GlassMaterial {
        ior: 1.5,
        roughness: 0.0,
        thickness: 5.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let context = MaterialContext {
        viewing_angle_deg: 0.0,
        ..Default::default()
    };

    let evaluated = glass.evaluate(&context);

    // F0 = ((1.0 - 1.5) / (1.0 + 1.5))^2 = 0.04
    assert!(
        (evaluated.fresnel_f0 - 0.04).abs() < 0.001,
        "Glass F0 should be ~0.04, got {:.4}",
        evaluated.fresnel_f0
    );
}

#[test]
fn test_fresnel_water_f0() {
    let water = GlassMaterial {
        ior: 1.33,
        roughness: 0.0,
        thickness: 5.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let evaluated = water.evaluate(&MaterialContext {
        viewing_angle_deg: 0.0,
        ..Default::default()
    });

    // F0 for water ≈ 0.02
    assert!(
        (evaluated.fresnel_f0 - 0.02).abs() < 0.001,
        "Water F0 should be ~0.02, got {:.4}",
        evaluated.fresnel_f0
    );
}

#[test]
fn test_beer_lambert_thickness_correlation() {
    let thin = GlassMaterial {
        ior: 1.5,
        roughness: 0.1,
        thickness: 1.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let thick = GlassMaterial {
        ior: 1.5,
        roughness: 0.1,
        thickness: 20.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let context = MaterialContext::default();

    let eval_thin = thin.evaluate(&context);
    let eval_thick = thick.evaluate(&context);

    // Thicker glass should have more scattering
    assert!(
        eval_thick.scattering_radius_mm > eval_thin.scattering_radius_mm,
        "Thicker glass should have more scattering"
    );
}

#[test]
fn test_scattering_roughness_linear() {
    let context = MaterialContext::default();

    for roughness in &[0.0, 0.25, 0.5, 0.75, 1.0] {
        let glass = GlassMaterial {
            ior: 1.5,
            roughness: *roughness,
            thickness: 5.0,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let evaluated = glass.evaluate(&context);

        // Surface scattering = roughness * 10.0
        // Volume scattering = min(5.0 * 0.1, 2.0) = 0.5
        let expected = roughness * 10.0 + 0.5;

        assert!(
            (evaluated.scattering_radius_mm - expected).abs() < 0.1,
            "Roughness={:.2}: expected {:.1}mm, got {:.4}mm",
            roughness,
            expected,
            evaluated.scattering_radius_mm
        );
    }
}

#[test]
fn test_ior_affects_fresnel() {
    let low_ior = GlassMaterial {
        ior: 1.2,
        roughness: 0.0,
        thickness: 5.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let high_ior = GlassMaterial {
        ior: 2.0,
        roughness: 0.0,
        thickness: 5.0,
        noise_scale: 0.0,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let context = MaterialContext {
        viewing_angle_deg: 0.0,
        ..Default::default()
    };

    let eval_low = low_ior.evaluate(&context);
    let eval_high = high_ior.evaluate(&context);

    assert!(
        eval_high.fresnel_f0 > eval_low.fresnel_f0,
        "Higher IOR should increase F0"
    );
}

// ============================================================================
// CROSS-BACKEND CONSISTENCY
// ============================================================================

#[test]
fn test_evaluated_backend_agnostic() {
    let material = GlassMaterial::regular();
    let evaluated = material.evaluate(&MaterialContext::default());

    // CSS Backend should accept EvaluatedMaterial
    let css_backend = CssBackend::new();
    let css_result = css_backend.render(&evaluated, &RenderContext::desktop());
    assert!(css_result.is_ok());
}

#[test]
fn test_physical_units_only() {
    let evaluated = GlassMaterial::regular().evaluate(&MaterialContext::default());

    // All properties should be physical (not rendering-specific)
    assert!(evaluated.scattering_radius_mm > 0.0);
    assert!(evaluated.fresnel_f0 >= 0.0 && evaluated.fresnel_f0 <= 1.0);
    assert!(evaluated.opacity >= 0.0 && evaluated.opacity <= 1.0);
    assert!(evaluated.thickness_mm >= 0.0);
    assert!(evaluated.roughness >= 0.0 && evaluated.roughness <= 1.0);
}

#[test]
fn test_css_backend_mm_to_px_conversion() {
    let material = GlassMaterial {
        ior: 1.5,
        roughness: 0.6,
        thickness: 8.0,
        noise_scale: 0.4,
        base_color: OKLCH::new(0.95, 0.01, 240.0),
        edge_power: 2.0,
    };

    let evaluated = material.evaluate(&MaterialContext::default());
    let scatter_mm = evaluated.scattering_radius_mm;

    let css = CssBackend::new()
        .render(&evaluated, &RenderContext::desktop())
        .unwrap();

    // CSS should contain blur in pixels
    assert!(css.contains("blur"));
    assert!(css.contains("px"));

    // Expected: blur_px = scatter_mm * 3.779527559 (96 DPI)
    const MM_TO_PX: f64 = 3.779527559;
    let expected_blur = scatter_mm * MM_TO_PX;

    // Check blur value is approximately correct (±1px tolerance)
    assert!(
        css.contains(&format!("blur({:.0}px)", expected_blur))
            || css.contains(&format!("blur({:.0}px)", expected_blur - 1.0))
            || css.contains(&format!("blur({:.0}px)", expected_blur + 1.0)),
        "CSS should contain blur ~{:.0}px, got: {}",
        expected_blur,
        css
    );
}

#[test]
fn test_multiple_renders_identical() {
    let evaluated = GlassMaterial::frosted().evaluate(&MaterialContext::default());

    let css_backend = CssBackend::new();
    let render_ctx = RenderContext::desktop();

    let css1 = css_backend.render(&evaluated, &render_ctx).unwrap();
    let css2 = css_backend.render(&evaluated, &render_ctx).unwrap();

    assert_eq!(css1, css2, "Same evaluated should produce identical CSS");
}

#[test]
fn test_backend_capabilities() {
    let capabilities = CssBackend::new().capabilities();

    // CSS backend should have valid capabilities
    assert!(!capabilities.name.is_empty());
    assert!(!capabilities.output_formats.is_empty());
}

#[test]
fn test_cross_backend_validation_matrix() {
    let materials = vec![
        GlassMaterial::clear(),
        GlassMaterial::regular(),
        GlassMaterial::frosted(),
    ];

    let contexts = vec![
        MaterialContext::default(),
        MaterialContext {
            background: OKLCH::new(0.0, 0.0, 0.0),
            ..Default::default()
        },
        MaterialContext {
            background: OKLCH::new(1.0, 0.0, 0.0),
            ..Default::default()
        },
    ];

    let css_backend = CssBackend::new();
    let render_ctx = RenderContext::desktop();

    for material in &materials {
        for context in &contexts {
            let evaluated = material.evaluate(context);
            let css_result = css_backend.render(&evaluated, &render_ctx);
            assert!(css_result.is_ok());
        }
    }
}

// ============================================================================
// INVARIANTS
// ============================================================================

#[test]
fn test_all_presets_produce_valid_evaluations() {
    let presets = vec![
        GlassMaterial::clear(),
        GlassMaterial::regular(),
        GlassMaterial::frosted(),
    ];

    let contexts = vec![
        MaterialContext::default(),
        MaterialContext {
            viewing_angle_deg: 0.0,
            ..Default::default()
        },
        MaterialContext {
            viewing_angle_deg: 45.0,
            ..Default::default()
        },
        MaterialContext {
            viewing_angle_deg: 85.0,
            ..Default::default()
        },
    ];

    for material in &presets {
        for context in &contexts {
            let evaluated = material.evaluate(context);

            // Validate all invariants
            assert!(evaluated.opacity >= 0.0 && evaluated.opacity <= 1.0);
            assert!(evaluated.scattering_radius_mm >= 0.0);
            assert!(evaluated.fresnel_f0 >= 0.0 && evaluated.fresnel_f0 <= 1.0);
            assert!(
                evaluated.fresnel_edge_intensity >= 0.0 && evaluated.fresnel_edge_intensity <= 1.0
            );
            assert!(evaluated.thickness_mm >= 0.0);
            assert!(evaluated.roughness >= 0.0 && evaluated.roughness <= 1.0);

            // Color components should be finite
            assert!(evaluated.base_color.r.is_finite());
            assert!(evaluated.base_color.g.is_finite());
            assert!(evaluated.base_color.b.is_finite());
            assert!(evaluated.base_color.a.is_finite());
        }
    }
}
