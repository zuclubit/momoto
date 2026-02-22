import 'package:flutter/material.dart';
import 'engine.dart';
import 'palette.dart';

/// Builds Flutter [ThemeData] from a Momoto HCT palette.
///
/// Usage:
/// ```dart
/// final engine = await MomotoEngine.instance;
/// final palette = await engine.generatePalette('#3a7bd5');
/// final theme = MomotoTheme.fromPalette(palette, brightness: Brightness.dark);
///
/// MaterialApp(theme: theme, ...)
/// ```
class MomotoTheme {
  const MomotoTheme._();

  static ThemeData fromPalette(
    HctPalette palette, {
    Brightness brightness = Brightness.light,
    String? fontFamily,
  }) {
    final colorScheme = palette.toColorScheme(brightness: brightness);
    final isDark = brightness == Brightness.dark;

    return ThemeData(
      useMaterial3:  true,
      colorScheme:   colorScheme,
      brightness:    brightness,
      fontFamily:    fontFamily,
      scaffoldBackgroundColor: colorScheme.background,

      // ── AppBar ────────────────────────────────────────────────────────
      appBarTheme: AppBarTheme(
        backgroundColor:  colorScheme.surface,
        foregroundColor:  colorScheme.onSurface,
        elevation:        0,
        centerTitle:      false,
        titleTextStyle: TextStyle(
          fontSize:   18,
          fontWeight: FontWeight.w600,
          color:      colorScheme.onSurface,
          fontFamily: fontFamily,
        ),
      ),

      // ── Cards ─────────────────────────────────────────────────────────
      cardTheme: CardTheme(
        color:      colorScheme.surface,
        elevation:  0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: colorScheme.outline.withOpacity(0.15)),
        ),
      ),

      // ── Elevated buttons ──────────────────────────────────────────────
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: colorScheme.primary,
          foregroundColor: colorScheme.onPrimary,
          elevation:       0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          textStyle: const TextStyle(fontWeight: FontWeight.w600),
        ),
      ),

      // ── Input fields ──────────────────────────────────────────────────
      inputDecorationTheme: InputDecorationTheme(
        filled:    true,
        fillColor: isDark ? const Color(0xFF1A1A23) : const Color(0xFFF0F0F8),
        border:    OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),

      // ── Chips ─────────────────────────────────────────────────────────
      chipTheme: ChipThemeData(
        backgroundColor: colorScheme.primary.withOpacity(0.1),
        labelStyle:      TextStyle(color: colorScheme.primary, fontWeight: FontWeight.w500),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(6)),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      ),
    );
  }

  /// Async convenience method: generates palette from hex then builds theme
  static Future<ThemeData> fromHex(
    String hex, {
    Brightness brightness = Brightness.light,
    String? fontFamily,
  }) async {
    final engine  = await MomotoEngine.instance;
    final palette = await engine.generatePalette(hex);
    return fromPalette(palette, brightness: brightness, fontFamily: fontFamily);
  }
}
