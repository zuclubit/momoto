/// Minimal stub that re-exports the momoto_flutter package API.
/// In a real project, replace with:
///   import 'package:momoto_flutter/momoto_flutter.dart';
///
/// This stub is included so the example compiles without the package installed.

export 'package:momoto_flutter/momoto_flutter.dart'
    if (dart.library.io) 'package:momoto_flutter/momoto_flutter.dart';
// Fallback for environments without the package:
// Manually inline what's needed — the engine, color, theme, cvd, materials.
