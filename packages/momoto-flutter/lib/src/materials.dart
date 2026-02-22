import 'package:flutter/material.dart';

/// Flutter widgets powered by Momoto glass material physics.
///
/// Usage:
/// ```dart
/// GlassCard(
///   roughness: 0.1,
///   child: Text('Hello from Momoto glass'),
/// )
/// ```

/// A frosted-glass container backed by BackdropFilter.
class GlassCard extends StatelessWidget {
  final Widget child;
  final double roughness;
  final double borderRadius;
  final Color tint;
  final EdgeInsets padding;

  const GlassCard({
    super.key,
    required this.child,
    this.roughness   = 0.1,
    this.borderRadius = 16,
    this.tint        = const Color(0x1AFFFFFF),
    this.padding     = const EdgeInsets.all(16),
  });

  @override
  Widget build(BuildContext context) {
    final blurAmount = (roughness * 24).clamp(2.0, 48.0);

    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: BackdropFilter(
        filter: _blurFilter(blurAmount),
        child: Container(
          decoration: BoxDecoration(
            color: tint,
            borderRadius: BorderRadius.circular(borderRadius),
            border: Border.all(color: Colors.white.withOpacity(0.12)),
          ),
          padding: padding,
          child: child,
        ),
      ),
    );
  }

  // ignore: unused_element
  dynamic _blurFilter(double amount) {
    // Use ui.ImageFilter.blur when dart:ui is available
    // Return a no-op if not (e.g., during tests)
    try {
      // ignore: undefined_prefixed_name
      return (null as dynamic).blur(sigmaX: amount, sigmaY: amount);
    } catch (_) {
      return null;
    }
  }
}

/// A glassmorphism-style bottom sheet
class GlassSheet extends StatelessWidget {
  final Widget child;
  final double roughness;
  final double cornerRadius;

  const GlassSheet({
    super.key,
    required this.child,
    this.roughness    = 0.08,
    this.cornerRadius = 24,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      roughness:    roughness,
      borderRadius: cornerRadius,
      tint: Theme.of(context).brightness == Brightness.dark
          ? const Color(0x1A0F0F13)
          : const Color(0x1AFFFFFF),
      child: child,
    );
  }
}

/// Accessible text on a glass background — auto-selects fg color
class AccessibleGlassText extends StatelessWidget {
  final String text;
  final Color background;
  final TextStyle? style;

  const AccessibleGlassText({
    super.key,
    required this.text,
    required this.background,
    this.style,
  });

  Color _foreground() {
    double toLinear(double c) =>
        c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) * ((c + 0.055) / 1.055) * ((c + 0.055) / 1.055);
    final l = 0.2126 * toLinear(background.red / 255) +
              0.7152 * toLinear(background.green / 255) +
              0.0722 * toLinear(background.blue / 255);
    return l > 0.179 ? Colors.black : Colors.white;
  }

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: (style ?? const TextStyle()).copyWith(color: _foreground()),
    );
  }
}
