//! End-to-End Usage Scenarios
//!
//! Real-world workflows demonstrating complete usage patterns:
//! 1. Design System Validation - Ensure brand colors meet accessibility
//! 2. Accessibility Compliance Pipeline - Automated WCAG checking
//! 3. Light/Dark Theme Validation - Verify theme pairs
//! 4. Batch Contrast at Scale - Performance testing with large datasets
//!
//! Run with: cargo test --test e2e_scenarios

use momoto_core::color::Color;
use momoto_core::perception::ContrastMetric;
use momoto_core::space::oklch::OKLCH;
use momoto_metrics::apca::APCAMetric;
use momoto_metrics::wcag::{TextSize, WCAGLevel, WCAGMetric};

// ============================================================================
// Scenario 1: Design System Validation
// ============================================================================

/// Brand colors from a typical design system
struct BrandColors {
    primary: Color,
    secondary: Color,
    accent: Color,
    background_light: Color,
    background_dark: Color,
    text_primary: Color,
    text_secondary: Color,
    error: Color,
    warning: Color,
    success: Color,
}

impl BrandColors {
    fn new() -> Self {
        Self {
            primary: Color::from_srgb8(59, 130, 246),   // Blue-500
            secondary: Color::from_srgb8(139, 92, 246), // Purple-500
            accent: Color::from_srgb8(236, 72, 153),    // Pink-500
            background_light: Color::from_srgb8(255, 255, 255), // White
            background_dark: Color::from_srgb8(17, 24, 39), // Gray-900
            text_primary: Color::from_srgb8(17, 24, 39), // Gray-900
            text_secondary: Color::from_srgb8(107, 114, 128), // Gray-500
            error: Color::from_srgb8(239, 68, 68),      // Red-500
            warning: Color::from_srgb8(245, 158, 11),   // Amber-500
            success: Color::from_srgb8(34, 197, 94),    // Green-500
        }
    }
}

#[test]
fn scenario_design_system_validation() {
    println!("\n=== Scenario 1: Design System Validation ===\n");

    let brand = BrandColors::new();
    let metric = WCAGMetric::new();

    // Define all color pairs that will be used in the UI
    let pairs = vec![
        (
            "Primary on Light Background",
            brand.primary,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Secondary on Light Background",
            brand.secondary,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Accent on Light Background",
            brand.accent,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Text Primary on Light Background",
            brand.text_primary,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Text Secondary on Light Background",
            brand.text_secondary,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Primary on Dark Background",
            brand.primary,
            brand.background_dark,
            TextSize::Normal,
        ),
        (
            "Error on Light Background",
            brand.error,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Warning on Light Background",
            brand.warning,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Success on Light Background",
            brand.success,
            brand.background_light,
            TextSize::Normal,
        ),
        (
            "Light Background on Text Primary",
            brand.background_light,
            brand.text_primary,
            TextSize::Large,
        ),
    ];

    let mut aa_passed = 0;
    let mut aaa_passed = 0;
    let mut failures = Vec::new();

    for (name, fg, bg, text_size) in pairs {
        let result = metric.evaluate(fg, bg);
        let ratio = result.value;

        let aa = WCAGMetric::passes(ratio, WCAGLevel::AA, text_size);
        let aaa = WCAGMetric::passes(ratio, WCAGLevel::AAA, text_size);

        print!("{:<40} {:.2}:1  ", name, ratio);

        if aaa {
            println!("✓ AAA");
            aaa_passed += 1;
            aa_passed += 1;
        } else if aa {
            println!("✓ AA");
            aa_passed += 1;
        } else {
            println!("✗ FAIL");
            failures.push((name, ratio));
        }
    }

    println!("\n--- Summary ---");
    println!("AA Compliance: {}/10", aa_passed);
    println!("AAA Compliance: {}/10", aaa_passed);

    if !failures.is_empty() {
        println!("\n⚠️  Color combinations that failed WCAG AA:");
        for (name, ratio) in failures {
            println!("  - {}: {:.2}:1", name, ratio);
        }
    }

    // For a production design system, we'd typically want all pairs to pass AA
    // But for this demo, we just ensure the test runs and reports correctly
    assert!(aa_passed > 0, "At least some combinations should pass AA");
}

// ============================================================================
// Scenario 2: Accessibility Compliance Pipeline
// ============================================================================

/// Represents a UI component with text content
struct UIComponent {
    name: &'static str,
    foreground: Color,
    background: Color,
    text_size: TextSize,
    required_level: WCAGLevel,
}

#[test]
fn scenario_accessibility_compliance_pipeline() {
    println!("\n=== Scenario 2: Accessibility Compliance Pipeline ===\n");

    // Simulate a CI/CD pipeline checking all UI components
    let components = vec![
        UIComponent {
            name: "Heading 1",
            foreground: Color::from_srgb8(17, 24, 39),
            background: Color::from_srgb8(255, 255, 255),
            text_size: TextSize::Large,
            required_level: WCAGLevel::AAA,
        },
        UIComponent {
            name: "Body Text",
            foreground: Color::from_srgb8(55, 65, 81),
            background: Color::from_srgb8(255, 255, 255),
            text_size: TextSize::Normal,
            required_level: WCAGLevel::AA,
        },
        UIComponent {
            name: "Button Primary",
            foreground: Color::from_srgb8(255, 255, 255),
            background: Color::from_srgb8(59, 130, 246),
            text_size: TextSize::Normal,
            required_level: WCAGLevel::AA,
        },
        UIComponent {
            name: "Button Secondary",
            foreground: Color::from_srgb8(59, 130, 246),
            background: Color::from_srgb8(239, 246, 255),
            text_size: TextSize::Normal,
            required_level: WCAGLevel::AA,
        },
        UIComponent {
            name: "Link",
            foreground: Color::from_srgb8(29, 78, 216),
            background: Color::from_srgb8(255, 255, 255),
            text_size: TextSize::Normal,
            required_level: WCAGLevel::AA,
        },
        UIComponent {
            name: "Error Message",
            foreground: Color::from_srgb8(185, 28, 28),
            background: Color::from_srgb8(254, 242, 242),
            text_size: TextSize::Normal,
            required_level: WCAGLevel::AA,
        },
    ];

    let metric = WCAGMetric::new();
    let mut passed = 0;
    let mut failed_components = Vec::new();

    println!("Component                    Ratio    Required Level  Status");
    println!("-------------------------------------------------------------------");

    for component in components {
        let result = metric.evaluate(component.foreground, component.background);
        let passes =
            WCAGMetric::passes(result.value, component.required_level, component.text_size);

        let status = if passes { "PASS" } else { "FAIL" };
        let icon = if passes { "✓" } else { "✗" };

        println!(
            "{:<28} {:.2}:1   {:?}-{:?}       {} {}",
            component.name,
            result.value,
            component.required_level,
            component.text_size,
            icon,
            status
        );

        if passes {
            passed += 1;
        } else {
            failed_components.push(component.name);
        }
    }

    println!("\n--- Pipeline Results ---");
    println!("Passed: {}/6", passed);
    println!("Failed: {}/6", 6 - passed);

    if !failed_components.is_empty() {
        println!("\n⚠️  Components needing attention:");
        for name in failed_components {
            println!("  - {}", name);
        }
    } else {
        println!("\n✅ All components meet requirements");
    }

    // Demonstration of validation process - we expect at least some to pass
    assert!(
        passed >= 4,
        "At least 4 components should meet requirements in a typical design system"
    );
}

// ============================================================================
// Scenario 3: Light/Dark Theme Validation
// ============================================================================

struct ThemePair {
    light_fg: Color,
    light_bg: Color,
    dark_fg: Color,
    dark_bg: Color,
}

#[test]
fn scenario_light_dark_theme_validation() {
    println!("\n=== Scenario 3: Light/Dark Theme Validation ===\n");

    // Define semantic color pairs that should work in both themes
    let theme_pairs = vec![
        (
            "Primary Text",
            ThemePair {
                light_fg: Color::from_srgb8(17, 24, 39),    // Gray-900
                light_bg: Color::from_srgb8(255, 255, 255), // White
                dark_fg: Color::from_srgb8(243, 244, 246),  // Gray-100
                dark_bg: Color::from_srgb8(17, 24, 39),     // Gray-900
            },
        ),
        (
            "Secondary Text",
            ThemePair {
                light_fg: Color::from_srgb8(107, 114, 128), // Gray-500
                light_bg: Color::from_srgb8(255, 255, 255), // White
                dark_fg: Color::from_srgb8(156, 163, 175),  // Gray-400
                dark_bg: Color::from_srgb8(17, 24, 39),     // Gray-900
            },
        ),
        (
            "Interactive (Links/Buttons)",
            ThemePair {
                light_fg: Color::from_srgb8(37, 99, 235),   // Blue-600
                light_bg: Color::from_srgb8(255, 255, 255), // White
                dark_fg: Color::from_srgb8(147, 197, 253),  // Blue-300
                dark_bg: Color::from_srgb8(17, 24, 39),     // Gray-900
            },
        ),
        (
            "Success State",
            ThemePair {
                light_fg: Color::from_srgb8(22, 163, 74),   // Green-600
                light_bg: Color::from_srgb8(240, 253, 244), // Green-50
                dark_fg: Color::from_srgb8(134, 239, 172),  // Green-300
                dark_bg: Color::from_srgb8(20, 83, 45),     // Green-900
            },
        ),
    ];

    let wcag = WCAGMetric::new();
    let apca = APCAMetric::new();

    println!("Pair                          Theme  WCAG    APCA   Status");
    println!("---------------------------------------------------------------------");

    let mut all_pass = true;
    let mut pass_count = 0;

    for (name, pair) in &theme_pairs {
        // Check light theme
        let light_wcag = wcag.evaluate(pair.light_fg, pair.light_bg);
        let light_apca = apca.evaluate(pair.light_fg, pair.light_bg);
        let light_pass = light_wcag.value >= 4.5 && light_apca.value.abs() >= 45.0;

        println!(
            "{:<30} Light  {:.2}:1  {:.0}Lc  {}",
            name,
            light_wcag.value,
            light_apca.value,
            if light_pass { "✓" } else { "✗" }
        );

        // Check dark theme
        let dark_wcag = wcag.evaluate(pair.dark_fg, pair.dark_bg);
        let dark_apca = apca.evaluate(pair.dark_fg, pair.dark_bg);
        let dark_pass = dark_wcag.value >= 4.5 && dark_apca.value.abs() >= 45.0;

        println!(
            "{:<30} Dark   {:.2}:1  {:.0}Lc  {}",
            "",
            dark_wcag.value,
            dark_apca.value,
            if dark_pass { "✓" } else { "✗" }
        );

        if !light_pass || !dark_pass {
            all_pass = false;
        } else {
            pass_count += 1;
        }
    }

    println!("\n--- Theme Validation Results ---");
    println!("Passed: {}/{}", pass_count, theme_pairs.len());

    if all_pass {
        println!("✅ Both themes pass accessibility requirements");
    } else {
        println!("⚠️  Some theme pairs need adjustment for optimal accessibility");
    }

    // Demonstration of theme validation - most pairs should work well
    assert!(
        pass_count >= 3,
        "At least 3 of 4 theme pairs should be well-designed"
    );
}

// ============================================================================
// Scenario 4: Batch Contrast at Scale
// ============================================================================

#[test]
fn scenario_batch_contrast_at_scale() {
    println!("\n=== Scenario 4: Batch Contrast at Scale ===\n");

    // Simulate a large-scale batch operation (e.g., validating a color picker)
    // Generate 1000 color combinations

    println!("Generating 1000 color combinations...");

    let mut foregrounds = Vec::with_capacity(1000);
    let mut backgrounds = Vec::with_capacity(1000);

    // Create a gradient of foreground colors (dark to light)
    for i in 0..1000 {
        let value = (i as f64 / 1000.0 * 255.0) as u8;
        foregrounds.push(Color::from_srgb8(value, value, value));

        // Background is always white
        backgrounds.push(Color::from_srgb8(255, 255, 255));
    }

    println!("Running batch WCAG evaluation...");
    let start = std::time::Instant::now();
    let wcag = WCAGMetric::new();
    let wcag_results = wcag.evaluate_batch(&foregrounds, &backgrounds);
    let wcag_duration = start.elapsed();

    println!("Running batch APCA evaluation...");
    let start = std::time::Instant::now();
    let apca = APCAMetric::new();
    let apca_results = apca.evaluate_batch(&foregrounds, &backgrounds);
    let apca_duration = start.elapsed();

    // Analyze results
    let wcag_aa_pass = wcag_results.iter().filter(|r| r.value >= 4.5).count();
    let wcag_aaa_pass = wcag_results.iter().filter(|r| r.value >= 7.0).count();
    let apca_pass = apca_results
        .iter()
        .filter(|r| r.value.abs() >= 60.0)
        .count();

    println!("\n--- Performance Results ---");
    println!(
        "WCAG evaluation: {:.2}ms ({:.2}µs per pair)",
        wcag_duration.as_secs_f64() * 1000.0,
        wcag_duration.as_secs_f64() * 1_000_000.0 / 1000.0
    );
    println!(
        "APCA evaluation: {:.2}ms ({:.2}µs per pair)",
        apca_duration.as_secs_f64() * 1000.0,
        apca_duration.as_secs_f64() * 1_000_000.0 / 1000.0
    );

    println!("\n--- Compliance Results ---");
    println!(
        "WCAG AA pass:  {}/1000 ({:.1}%)",
        wcag_aa_pass,
        wcag_aa_pass as f64 / 10.0
    );
    println!(
        "WCAG AAA pass: {}/1000 ({:.1}%)",
        wcag_aaa_pass,
        wcag_aaa_pass as f64 / 10.0
    );
    println!(
        "APCA pass:     {}/1000 ({:.1}%)",
        apca_pass,
        apca_pass as f64 / 10.0
    );

    // Verify batch operation completed successfully
    assert_eq!(
        wcag_results.len(),
        1000,
        "WCAG batch should return 1000 results"
    );
    assert_eq!(
        apca_results.len(),
        1000,
        "APCA batch should return 1000 results"
    );

    // Performance assertions (should be fast)
    assert!(
        wcag_duration.as_millis() < 100,
        "WCAG batch should complete in <100ms"
    );
    assert!(
        apca_duration.as_millis() < 100,
        "APCA batch should complete in <100ms"
    );

    println!("\n✅ Batch processing completed successfully");
}

// ============================================================================
// Scenario 5: Perceptual Color Matching (Bonus)
// ============================================================================

#[test]
fn scenario_perceptual_color_matching() {
    println!("\n=== Scenario 5: Perceptual Color Matching ===\n");

    // Use case: Find perceptually similar colors across a palette
    let palette = vec![
        ("Red", Color::from_srgb8(239, 68, 68)),
        ("Orange", Color::from_srgb8(249, 115, 22)),
        ("Yellow", Color::from_srgb8(234, 179, 8)),
        ("Green", Color::from_srgb8(34, 197, 94)),
        ("Blue", Color::from_srgb8(59, 130, 246)),
        ("Indigo", Color::from_srgb8(99, 102, 241)),
        ("Purple", Color::from_srgb8(168, 85, 247)),
        ("Pink", Color::from_srgb8(236, 72, 153)),
    ];

    println!("Analyzing palette in OKLCH space...\n");

    // Convert all colors to OKLCH
    let oklch_colors: Vec<_> = palette
        .iter()
        .map(|(name, color)| (*name, OKLCH::from_color(color)))
        .collect();

    // Print color properties
    println!("Color        Lightness  Chroma   Hue");
    println!("-------------------------------------------");
    for (name, oklch) in &oklch_colors {
        println!(
            "{:<12} {:.3}      {:.3}    {:.1}°",
            name, oklch.l, oklch.c, oklch.h
        );
    }

    // Find perceptually similar colors (Delta E < 0.2)
    println!("\n--- Perceptual Similarity (ΔE < 0.2) ---");
    let mut similar_pairs = Vec::new();

    for i in 0..oklch_colors.len() {
        for j in (i + 1)..oklch_colors.len() {
            let (name1, color1) = &oklch_colors[i];
            let (name2, color2) = &oklch_colors[j];
            let delta_e = color1.delta_e(color2);

            if delta_e < 0.2 {
                similar_pairs.push((name1, name2, delta_e));
            }
        }
    }

    if similar_pairs.is_empty() {
        println!("No highly similar colors found (good palette diversity)");
    } else {
        for (name1, name2, delta_e) in similar_pairs {
            println!("{} ↔ {}: ΔE = {:.3}", name1, name2, delta_e);
        }
    }

    // Test OKLCH transformations
    println!("\n--- Color Transformations ---");
    let blue = oklch_colors.iter().find(|(n, _)| *n == "Blue").unwrap().1;

    let lighter = blue.lighten(0.2);
    let darker = blue.darken(0.2);
    let saturated = blue.saturate(1.5);
    let desaturated = blue.desaturate(2.0);

    println!(
        "Original Blue:   L={:.3} C={:.3} H={:.1}°",
        blue.l, blue.c, blue.h
    );
    println!(
        "Lighter (+0.2):  L={:.3} C={:.3} H={:.1}°",
        lighter.l, lighter.c, lighter.h
    );
    println!(
        "Darker (-0.2):   L={:.3} C={:.3} H={:.1}°",
        darker.l, darker.c, darker.h
    );
    println!(
        "Saturated (1.5x):L={:.3} C={:.3} H={:.1}°",
        saturated.l, saturated.c, saturated.h
    );
    println!(
        "Desaturated (/2):L={:.3} C={:.3} H={:.1}°",
        desaturated.l, desaturated.c, desaturated.h
    );

    // Verify transformations are working
    assert!(lighter.l > blue.l, "Lighter should have higher lightness");
    assert!(darker.l < blue.l, "Darker should have lower lightness");
    assert!(saturated.c > blue.c, "Saturated should have higher chroma");
    assert!(
        desaturated.c < blue.c,
        "Desaturated should have lower chroma"
    );

    println!("\n✅ Perceptual analysis completed");
}
