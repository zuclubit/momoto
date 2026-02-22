import 'package:flutter/material.dart';
import 'color.dart';
import 'engine.dart';

/// HCT Tonal Palette — Material Design 3 compatible
///
/// Usage:
/// ```dart
/// final engine = await MomotoEngine.instance;
/// final palette = await engine.generatePalette('#6188d8');
/// final color500 = palette.atTailwindScale(500); // Color
/// ```
class HctPalette {
  final String baseHex;
  final List<PaletteEntry> entries;

  const HctPalette({required this.baseHex, required this.entries});

  /// Returns a Flutter Color for a given Tailwind scale (50–950)
  Color? atTailwindScale(int scale) {
    final entry = entries.where((e) => e.tailwindScale == scale).firstOrNull;
    return entry != null ? MomotoColor.fromHex(entry.hex) : null;
  }

  /// Returns a Flutter Color for a given HCT tone (0–100)
  Color? atTone(int tone) {
    final entry = entries.where((e) => e.tone == tone).firstOrNull;
    return entry != null ? MomotoColor.fromHex(entry.hex) : null;
  }

  /// Convert to a Flutter MaterialColor (maps tones 10→950, …, 99→50)
  MaterialColor toMaterialColor() {
    final swatch = <int, Color>{};
    for (final entry in entries) {
      swatch[entry.tailwindScale] = MomotoColor.fromHex(entry.hex);
    }
    final primary = swatch[600] ?? swatch.values.first;
    return MaterialColor(primary.value, swatch);
  }

  /// Convert to a ColorScheme (Material Design 3 style)
  ColorScheme toColorScheme({Brightness brightness = Brightness.light}) {
    final isDark = brightness == Brightness.dark;
    return ColorScheme(
      brightness:     brightness,
      primary:        atTailwindScale(isDark ? 300 : 600)!,
      onPrimary:      atTailwindScale(isDark ? 900 : 100)!,
      secondary:      atTailwindScale(isDark ? 400 : 500)!,
      onSecondary:    atTailwindScale(isDark ? 900 : 100)!,
      error:          const Color(0xFFB00020),
      onError:        Colors.white,
      background:     isDark ? const Color(0xFF07070E) : Colors.white,
      onBackground:   isDark ? const Color(0xFFE8EAF6) : const Color(0xFF07070E),
      surface:        isDark ? const Color(0xFF1A1A23) : const Color(0xFFF5F5FA),
      onSurface:      isDark ? const Color(0xFFE8EAF6) : const Color(0xFF07070E),
    );
  }
}
