/// @momoto-ui/flutter — Momoto Engine Flutter bindings
///
/// Provides:
/// - [MomotoEngine]: singleton for WCAG/APCA, HCT palettes, CVD, materials
/// - [MomotoColor]: immutable color type with contrast utilities
/// - [HctPalette]: HCT tonal palette (Material Design 3)
/// - [MomotoTheme]: Flutter ThemeData builder from HCT palettes
///
/// Usage:
/// ```dart
/// import 'package:momoto_flutter/momoto_flutter.dart';
///
/// final engine = await MomotoEngine.instance;
/// final result = await engine.validateContrast('#6188d8', '#07070e');
/// print('WCAG: ${result.wcagRatio.toStringAsFixed(2)}:1 (${result.level})');
/// ```
library momoto_flutter;

export 'src/engine.dart';
export 'src/color.dart';
export 'src/palette.dart';
export 'src/theme.dart';
export 'src/cvd.dart';
export 'src/materials.dart';
