//! Property-based tests using proptest
//!
//! Tests invariants that should hold for all possible inputs.

use momoto_core::{
    backend::CssBackend,
    evaluated::{Evaluable, MaterialContext},
    material::GlassMaterial,
    render::{RenderBackend, RenderContext},
    space::oklch::OKLCH,
};
use proptest::prelude::*;

// ============================================================================
// Property: MaterialContext Always Produces Valid EvaluatedMaterial
// ============================================================================

proptest! {
    #[test]
    fn prop_material_context_always_valid(
        angle in 0.0f64..=89.0,
        ambient in 0.0f64..=1.0,
        key in 0.0f64..=1.0,
    ) {
        let ctx = MaterialContext {
            viewing_angle_deg: angle,
            ambient_light: ambient,
            key_light: key,
            ..Default::default()
        };

        let material = GlassMaterial::regular();
        let result = material.evaluate(&ctx);

        // Invariants that MUST hold for any valid context
        prop_assert!(result.opacity >= 0.0 && result.opacity <= 1.0,
            "Opacity out of range: {}", result.opacity);
        prop_assert!(result.scattering_radius_mm >= 0.0,
            "Negative scattering: {}", result.scattering_radius_mm);
        prop_assert!(result.fresnel_f0 >= 0.0 && result.fresnel_f0 <= 1.0,
            "Fresnel F0 out of range: {}", result.fresnel_f0);
        prop_assert!(result.fresnel_edge_intensity >= 0.0 && result.fresnel_edge_intensity <= 1.0,
            "Edge intensity out of range: {}", result.fresnel_edge_intensity);
    }
}

// ============================================================================
// Property: GlassMaterial Parameters Always Produce Valid Results
// ============================================================================

proptest! {
    #[test]
    fn prop_glass_material_parameters_valid(
        roughness in 0.0f64..=1.0,
        ior in 1.0f64..=3.0,
        thickness in 0.1f64..=100.0,
    ) {
        let material = GlassMaterial {
            roughness,
            ior,
            thickness,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let context = MaterialContext::default();
        let evaluated = material.evaluate(&context);

        // All physical properties must be valid
        prop_assert!(evaluated.opacity >= 0.0 && evaluated.opacity <= 1.0);
        prop_assert!(evaluated.scattering_radius_mm >= 0.0);
        prop_assert!(evaluated.fresnel_f0 >= 0.0 && evaluated.fresnel_f0 <= 1.0);
        prop_assert!(evaluated.thickness_mm == thickness);
        prop_assert!(evaluated.roughness == roughness);

        // Color components must be finite
        prop_assert!(evaluated.base_color.r.is_finite());
        prop_assert!(evaluated.base_color.g.is_finite());
        prop_assert!(evaluated.base_color.b.is_finite());
        prop_assert!(evaluated.base_color.a.is_finite());
    }
}

// ============================================================================
// Property: Scattering Increases with Roughness
// ============================================================================

proptest! {
    #[test]
    fn prop_scattering_monotonic_with_roughness(
        r1 in 0.0f64..=0.5,
        r2 in 0.5f64..=1.0,
    ) {
        prop_assume!(r1 < r2);

        let material1 = GlassMaterial {
            roughness: r1,
            ior: 1.5,
            thickness: 5.0,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let material2 = GlassMaterial {
            roughness: r2,
            ior: 1.5,
            thickness: 5.0,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let context = MaterialContext::default();
        let eval1 = material1.evaluate(&context);
        let eval2 = material2.evaluate(&context);

        // Higher roughness should produce higher scattering
        prop_assert!(eval2.scattering_radius_mm >= eval1.scattering_radius_mm,
            "Scattering should increase with roughness: r1={}, s1={}, r2={}, s2={}",
            r1, eval1.scattering_radius_mm, r2, eval2.scattering_radius_mm);
    }
}

// ============================================================================
// Property: IOR Affects Fresnel F0 Monotonically
// ============================================================================

proptest! {
    #[test]
    fn prop_fresnel_monotonic_with_ior(
        ior1 in 1.0f64..=2.0,
        ior2 in 2.0f64..=3.0,
    ) {
        prop_assume!(ior1 < ior2);

        let material1 = GlassMaterial {
            roughness: 0.0,
            ior: ior1,
            thickness: 5.0,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let material2 = GlassMaterial {
            roughness: 0.0,
            ior: ior2,
            thickness: 5.0,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let context = MaterialContext {
            viewing_angle_deg: 0.0,
            ..Default::default()
        };

        let eval1 = material1.evaluate(&context);
        let eval2 = material2.evaluate(&context);

        // Higher IOR should produce higher F0
        prop_assert!(eval2.fresnel_f0 >= eval1.fresnel_f0,
            "F0 should increase with IOR: ior1={}, f0_1={}, ior2={}, f0_2={}",
            ior1, eval1.fresnel_f0, ior2, eval2.fresnel_f0);
    }
}

// ============================================================================
// Property: CSS Backend Always Produces Valid CSS
// ============================================================================

proptest! {
    #[test]
    fn prop_css_backend_always_valid(
        roughness in 0.0f64..=1.0,
        thickness in 0.1f64..=50.0,
    ) {
        let material = GlassMaterial {
            roughness,
            ior: 1.5,
            thickness,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let evaluated = material.evaluate(&MaterialContext::default());
        let backend = CssBackend::new();
        let css_result = backend.render(&evaluated, &RenderContext::desktop());

        // Should never fail to render
        prop_assert!(css_result.is_ok(), "CSS rendering failed");

        let css = css_result.unwrap();

        // CSS should not be empty
        prop_assert!(!css.is_empty(), "CSS output is empty");

        // CSS should contain expected properties
        prop_assert!(css.contains("backdrop-filter") || css.contains("background"),
            "CSS missing expected properties: {}", css);

        // If blur is present, it should be valid
        if css.contains("blur") {
            prop_assert!(css.contains("px"), "Blur should specify px unit: {}", css);
        }
    }
}

// ============================================================================
// Property: Determinism - Same Input Always Produces Same Output
// ============================================================================

proptest! {
    #[test]
    fn prop_determinism_same_input_same_output(
        roughness in 0.0f64..=1.0,
        angle in 0.0f64..=89.0,
    ) {
        let material = GlassMaterial {
            roughness,
            ior: 1.5,
            thickness: 5.0,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let context = MaterialContext {
            viewing_angle_deg: angle,
            ..Default::default()
        };

        // Evaluate twice
        let eval1 = material.evaluate(&context);
        let eval2 = material.evaluate(&context);

        // Results must be identical
        prop_assert_eq!(eval1.opacity, eval2.opacity);
        prop_assert_eq!(eval1.scattering_radius_mm, eval2.scattering_radius_mm);
        prop_assert_eq!(eval1.fresnel_f0, eval2.fresnel_f0);
        prop_assert_eq!(eval1.metadata.context_hash, eval2.metadata.context_hash);
    }
}

// ============================================================================
// Property: Absorption Coefficients Non-Negative
// ============================================================================

proptest! {
    #[test]
    fn prop_absorption_non_negative(
        roughness in 0.0f64..=1.0,
        thickness in 0.1f64..=100.0,
    ) {
        let material = GlassMaterial {
            roughness,
            ior: 1.5,
            thickness,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let evaluated = material.evaluate(&MaterialContext::default());

        // All absorption coefficients must be non-negative
        for (i, &coeff) in evaluated.absorption.iter().enumerate() {
            prop_assert!(coeff >= 0.0,
                "Absorption coefficient {} is negative: {}",
                i, coeff);
        }
    }
}

// ============================================================================
// Property: Thickness Preserved Through Evaluation
// ============================================================================

proptest! {
    #[test]
    fn prop_thickness_preserved(
        thickness in 0.1f64..=100.0,
    ) {
        let material = GlassMaterial {
            roughness: 0.5,
            ior: 1.5,
            thickness,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let evaluated = material.evaluate(&MaterialContext::default());

        // Thickness should be preserved exactly
        prop_assert_eq!(evaluated.thickness_mm, thickness);
    }
}

// ============================================================================
// Property: No NaN or Infinity in Results
// ============================================================================

proptest! {
    #[test]
    fn prop_no_nan_or_infinity(
        roughness in 0.0f64..=1.0,
        ior in 1.0f64..=3.0,
        thickness in 0.1f64..=100.0,
        angle in 0.0f64..=89.0,
    ) {
        let material = GlassMaterial {
            roughness,
            ior,
            thickness,
            noise_scale: 0.0,
            base_color: OKLCH::new(0.95, 0.01, 240.0),
            edge_power: 2.0,
        };

        let context = MaterialContext {
            viewing_angle_deg: angle,
            ..Default::default()
        };

        let evaluated = material.evaluate(&context);

        // No NaN or infinity allowed in any output
        prop_assert!(evaluated.opacity.is_finite());
        prop_assert!(evaluated.scattering_radius_mm.is_finite());
        prop_assert!(evaluated.fresnel_f0.is_finite());
        prop_assert!(evaluated.fresnel_edge_intensity.is_finite());
        prop_assert!(evaluated.thickness_mm.is_finite());
        prop_assert!(evaluated.roughness.is_finite());
        prop_assert!(evaluated.base_color.r.is_finite());
        prop_assert!(evaluated.base_color.g.is_finite());
        prop_assert!(evaluated.base_color.b.is_finite());
        prop_assert!(evaluated.base_color.a.is_finite());
    }
}
