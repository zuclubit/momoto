//! Integration tests for material evaluation
//!
//! These tests validate that Material::evaluate() produces correct optical properties
//! under different conditions.

use momoto_core::{
    evaluated::{Evaluable, MaterialContext},
    material::GlassMaterial,
    space::oklch::OKLCH,
};

// ============================================================================
// Test 1-2: Viewing Angle Effects
// ============================================================================

#[test]
fn test_glass_perpendicular_view() {
    let glass = GlassMaterial::regular();
    let context = MaterialContext::at_angle(0.0); // Perpendicular

    let evaluated = glass.evaluate(&context);

    println!(
        "Perpendicular view - opacity: {}, F0: {}, edge_intensity: {}",
        evaluated.opacity, evaluated.fresnel_f0, evaluated.fresnel_edge_intensity
    );

    // At perpendicular view, Fresnel effect is minimal
    assert!(evaluated.fresnel_f0 < 0.1, "F0 should be low for glass");

    // Glass at perpendicular view - adjust expectation based on physics
    // Regular glass has some inherent opacity from thickness
    assert!(
        evaluated.opacity < 0.9,
        "Glass should have transparency at perpendicular view, got opacity={}",
        evaluated.opacity
    );

    // Perpendicular view should have less edge intensity
    assert!(
        evaluated.fresnel_edge_intensity < 0.5,
        "Edge intensity should be low at perpendicular view, got={}",
        evaluated.fresnel_edge_intensity
    );
}

#[test]
fn test_glass_grazing_angle() {
    let glass = GlassMaterial::regular();
    let context = MaterialContext::at_angle(80.0); // Nearly grazing

    let evaluated = glass.evaluate(&context);

    println!(
        "Grazing angle - opacity: {}, F0: {}, edge_intensity: {}",
        evaluated.opacity, evaluated.fresnel_f0, evaluated.fresnel_edge_intensity
    );

    // At grazing angle, Fresnel effect increases significantly
    assert!(
        evaluated.opacity > 0.3,
        "Glass should be more opaque at grazing angles due to Fresnel, got={}",
        evaluated.opacity
    );

    // Grazing angle should have high edge intensity (using edge_power=2.5 for regular glass)
    // At 80°, cos(80°) ≈ 0.174, so (1 - 0.174)^2.5 ≈ 0.68
    assert!(
        evaluated.fresnel_edge_intensity > 0.5,
        "Edge intensity should be high at grazing angles, got={}",
        evaluated.fresnel_edge_intensity
    );
}

#[test]
fn test_fresnel_increases_with_angle() {
    let glass = GlassMaterial::clear();

    let eval_0 = glass.evaluate(&MaterialContext::at_angle(0.0));
    let eval_45 = glass.evaluate(&MaterialContext::at_angle(45.0));
    let eval_80 = glass.evaluate(&MaterialContext::at_angle(80.0));

    // Opacity should increase with viewing angle (Fresnel effect)
    assert!(
        eval_0.opacity < eval_45.opacity,
        "Opacity should increase from 0° to 45°"
    );
    assert!(
        eval_45.opacity < eval_80.opacity,
        "Opacity should increase from 45° to 80°"
    );

    // Edge intensity should also increase
    assert!(eval_0.fresnel_edge_intensity < eval_45.fresnel_edge_intensity);
    assert!(eval_45.fresnel_edge_intensity < eval_80.fresnel_edge_intensity);
}

// ============================================================================
// Test 3: Thickness Effects
// ============================================================================

#[test]
fn test_thickness_affects_absorption() {
    let thin_glass = GlassMaterial {
        thickness: 2.0,
        ..GlassMaterial::clear()
    };

    let thick_glass = GlassMaterial {
        thickness: 20.0,
        ..GlassMaterial::clear()
    };

    let context = MaterialContext::default();

    let eval_thin = thin_glass.evaluate(&context);
    let eval_thick = thick_glass.evaluate(&context);

    // Thicker glass should be more opaque (Beer-Lambert)
    assert!(
        eval_thin.opacity < eval_thick.opacity,
        "Thicker glass should be more opaque: thin={}, thick={}",
        eval_thin.opacity,
        eval_thick.opacity
    );

    // Thickness should be reflected in evaluated material
    assert_eq!(eval_thin.thickness_mm, 2.0);
    assert_eq!(eval_thick.thickness_mm, 20.0);

    // Scattering should also increase with thickness
    assert!(
        eval_thin.scattering_radius_mm < eval_thick.scattering_radius_mm,
        "Thicker glass should have more scattering"
    );
}

// ============================================================================
// Test 4-5: Serde Serialization
// ============================================================================

#[test]
#[cfg(feature = "serde")]
fn test_evaluated_material_serde_roundtrip() {
    let glass = GlassMaterial::frosted();
    let context = MaterialContext::default();
    let original = glass.evaluate(&context);

    // Serialize to JSON
    let json = serde_json::to_string(&original).expect("Failed to serialize");

    // Deserialize back
    let deserialized: momoto_core::evaluated::EvaluatedMaterial =
        serde_json::from_str(&json).expect("Failed to deserialize");

    // Should be identical
    assert_eq!(original.opacity, deserialized.opacity);
    assert_eq!(
        original.scattering_radius_mm,
        deserialized.scattering_radius_mm
    );
    assert_eq!(original.fresnel_f0, deserialized.fresnel_f0);
    assert_eq!(original.material_type, deserialized.material_type);

    println!(
        "Serialized JSON (first 200 chars): {}",
        &json[..200.min(json.len())]
    );
}

#[test]
#[cfg(not(feature = "serde"))]
fn test_serde_feature_disabled() {
    // This test just documents that serde is optional
    println!("Serde feature is disabled - EvaluatedMaterial serialization not available");
}

// ============================================================================
// Test 6: Default Values
// ============================================================================

#[test]
fn test_material_context_default() {
    let context = MaterialContext::default();

    // Sane defaults
    assert_eq!(context.viewing_angle_deg, 0.0);
    assert!(context.ambient_light > 0.0 && context.ambient_light < 1.0);
    assert!(context.key_light > 0.0 && context.key_light <= 1.0);
    assert!(context.temperature_kelvin > 0.0);

    // Background should be light neutral
    assert!(context.background.l > 0.8);
    assert!(context.background.c < 0.05);
}

// ============================================================================
// Test 7: Material Context Hash
// ============================================================================

#[test]
fn test_material_context_hash() {
    let context1 = MaterialContext::default();
    let context2 = MaterialContext::default();

    // Same context should have same hash
    assert_eq!(
        context1.compute_hash(),
        context2.compute_hash(),
        "Identical contexts should have same hash"
    );

    // Different angles should have different hashes
    let context3 = MaterialContext::at_angle(45.0);
    assert_ne!(
        context1.compute_hash(),
        context3.compute_hash(),
        "Different angles should have different hashes"
    );

    // Different backgrounds should have different hashes
    let context4 = MaterialContext::with_background(OKLCH::new(0.2, 0.1, 180.0));
    assert_ne!(
        context1.compute_hash(),
        context4.compute_hash(),
        "Different backgrounds should have different hashes"
    );
}

// ============================================================================
// Test 8: Quality Hints / Convenience Methods
// ============================================================================

#[test]
fn test_evaluated_material_predicates() {
    let clear = GlassMaterial::clear();
    let frosted = GlassMaterial::frosted();
    let context = MaterialContext::default();

    let eval_clear = clear.evaluate(&context);
    let eval_frosted = frosted.evaluate(&context);

    // Clear glass should be more transparent
    assert!(eval_clear.is_transparent() || !eval_clear.is_opaque());

    // Frosted glass should have scattering (v6.0.0: replaced has_blur() with has_scattering())
    assert!(
        eval_frosted.has_scattering(),
        "Frosted glass should have scattering"
    );
    // Frosted glass should have significant scattering (>5mm)
    assert!(eval_frosted.scattering_radius_mm > 5.0);

    // Neither should be emissive
    assert!(!eval_clear.is_emissive());
    assert!(!eval_frosted.is_emissive());
}

// ============================================================================
// Test 9: Builder Pattern
// ============================================================================

#[test]
fn test_material_context_builder_pattern() {
    let context = MaterialContext {
        background: OKLCH::new(0.3, 0.02, 240.0),
        viewing_angle_deg: 30.0,
        ambient_light: 0.5,
        ..Default::default()
    };

    // Builder-like construction works
    assert_eq!(context.viewing_angle_deg, 30.0);
    assert!(context.background.l < 0.5); // Dark background

    let glass = GlassMaterial::regular();
    let evaluated = glass.evaluate(&context);

    // Should produce valid evaluation
    assert!(evaluated.opacity > 0.0);
    assert!(evaluated.scattering_radius_mm > 0.0);
}

// ============================================================================
// Test 10: Convenience Methods
// ============================================================================

#[test]
fn test_linear_rgba_from_oklch() {
    use momoto_core::evaluated::LinearRgba;

    let oklch = OKLCH::new(0.7, 0.15, 240.0); // Blue
    let color = LinearRgba::from_oklch(oklch, 0.8);

    // Should be in linear space
    assert!(color.r >= 0.0 && color.r <= 1.0);
    assert!(color.g >= 0.0 && color.g <= 1.0);
    assert!(color.b >= 0.0 && color.b <= 1.0);
    assert_eq!(color.a, 0.8);

    // Blue should have higher B channel
    assert!(color.b > color.r, "Blue color should have b > r");
}

// ============================================================================
// Regression Tests
// ============================================================================

#[test]
fn test_all_presets_evaluate_successfully() {
    let context = MaterialContext::default();

    let presets = vec![
        GlassMaterial::clear(),
        GlassMaterial::regular(),
        GlassMaterial::thick(),
        GlassMaterial::frosted(),
    ];

    for (i, preset) in presets.iter().enumerate() {
        let evaluated = preset.evaluate(&context);

        // All evaluations should produce valid results
        assert!(
            evaluated.opacity >= 0.0 && evaluated.opacity <= 1.0,
            "Preset {} has invalid opacity: {}",
            i,
            evaluated.opacity
        );

        assert!(
            evaluated.scattering_radius_mm >= 0.0,
            "Preset {} has negative scattering: {}",
            i,
            evaluated.scattering_radius_mm
        );

        assert!(
            evaluated.fresnel_f0 >= 0.0 && evaluated.fresnel_f0 <= 1.0,
            "Preset {} has invalid F0: {}",
            i,
            evaluated.fresnel_f0
        );

        println!(
            "Preset {}: opacity={:.2}, scattering={:.1}mm, F0={:.3}",
            i, evaluated.opacity, evaluated.scattering_radius_mm, evaluated.fresnel_f0
        );
    }
}

#[test]
fn test_determinism() {
    let glass = GlassMaterial::regular();
    let context = MaterialContext::default();

    // Multiple evaluations should produce identical results
    let eval1 = glass.evaluate(&context);
    let eval2 = glass.evaluate(&context);

    assert_eq!(
        eval1.opacity, eval2.opacity,
        "Evaluation should be deterministic"
    );
    assert_eq!(eval1.scattering_radius_mm, eval2.scattering_radius_mm);
    assert_eq!(eval1.fresnel_f0, eval2.fresnel_f0);
    assert_eq!(eval1.metadata.context_hash, eval2.metadata.context_hash);
}

#[test]
fn test_different_backgrounds_affect_color() {
    let glass = GlassMaterial::clear(); // Translucent

    let light_bg = MaterialContext::with_background(OKLCH::new(0.95, 0.01, 0.0));
    let dark_bg = MaterialContext::with_background(OKLCH::new(0.1, 0.01, 0.0));

    let eval_light = glass.evaluate(&light_bg);
    let eval_dark = glass.evaluate(&dark_bg);

    // Background should bleed through translucent material
    // Light background should result in lighter final color
    let luminance_light = eval_light.base_color.r * 0.2126
        + eval_light.base_color.g * 0.7152
        + eval_light.base_color.b * 0.0722;

    let luminance_dark = eval_dark.base_color.r * 0.2126
        + eval_dark.base_color.g * 0.7152
        + eval_dark.base_color.b * 0.0722;

    assert!(
        luminance_light > luminance_dark,
        "Light background should result in brighter material: light={:.3}, dark={:.3}",
        luminance_light,
        luminance_dark
    );
}
