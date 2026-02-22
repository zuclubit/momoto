import 'package:flutter/material.dart';

/// Extension on Flutter's [Color] to add Momoto accessibility utilities.
///
/// Usage:
/// ```dart
/// final color = MomotoColor.fromHex('#6188d8');
/// final ratio = await color.contrastWith(Colors.black);
/// ```
extension MomotoColorExtension on Color {
  /// Convert Flutter Color to hex string (#rrggbb)
  String toHex() {
    final r = (red).toRadixString(16).padLeft(2, '0');
    final g = (green).toRadixString(16).padLeft(2, '0');
    final b = (blue).toRadixString(16).padLeft(2, '0');
    return '#$r$g$b';
  }

  /// Compute WCAG relative luminance (0–1)
  double get wcagLuminance {
    double toLinear(double c) =>
        c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) * ((c + 0.055) / 1.055) * ((c + 0.055) / 1.055);
    return 0.2126 * toLinear(red / 255) +
           0.7152 * toLinear(green / 255) +
           0.0722 * toLinear(blue / 255);
  }

  /// WCAG contrast ratio against another color (1:1–21:1)
  double contrastRatioWith(Color other) {
    final l1 = wcagLuminance;
    final l2 = other.wcagLuminance;
    return l1 > l2 ? (l1 + 0.05) / (l2 + 0.05) : (l2 + 0.05) / (l1 + 0.05);
  }

  /// Whether this color passes WCAG AA on the given background
  bool passesWcagAA(Color bg, {bool largeText = false}) =>
      contrastRatioWith(bg) >= (largeText ? 3.0 : 4.5);

  /// Whether this color passes WCAG AAA on the given background
  bool passesWcagAAA(Color bg, {bool largeText = false}) =>
      contrastRatioWith(bg) >= (largeText ? 4.5 : 7.0);

  /// Choose black or white as the most readable foreground for this background
  Color get accessibleForeground =>
      wcagLuminance > 0.179 ? Colors.black : Colors.white;
}

/// Static constructors for hex-based Color creation
class MomotoColor {
  const MomotoColor._();

  /// Create a Flutter [Color] from a hex string (#rrggbb or rrggbb)
  static Color fromHex(String hex) {
    final h = hex.replaceAll('#', '');
    return Color(int.parse('FF$h', radix: 16));
  }

  /// Create a MaterialColor swatch from a palette map (tone → hex)
  static MaterialColor toMaterialColor(Map<int, String> palette) {
    final swatch = palette.map((k, v) => MapEntry(k, MomotoColor.fromHex(v)));
    final primary = swatch[500] ?? swatch.values.first;
    return MaterialColor(primary.value, swatch);
  }
}
