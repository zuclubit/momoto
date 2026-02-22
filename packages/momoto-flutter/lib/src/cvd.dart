import 'package:flutter/material.dart';
import 'color.dart';
import 'engine.dart';

/// CVD (Color Vision Deficiency) simulation utilities for Flutter.
///
/// Usage:
/// ```dart
/// final engine = await MomotoEngine.instance;
/// final result = await engine.simulateCvd('#6188d8', CvdType.protanopia);
/// print('Simulated: ${result.simulated}'); // hex string
/// ```

/// Widget: side-by-side CVD simulation preview
class CvdPreview extends StatefulWidget {
  final String hex;
  final double swatchSize;
  const CvdPreview({super.key, required this.hex, this.swatchSize = 60});

  @override
  State<CvdPreview> createState() => _CvdPreviewState();
}

class _CvdPreviewState extends State<CvdPreview> {
  Map<CvdType, CvdResult?> _results = {};
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _simulate();
  }

  @override
  void didUpdateWidget(CvdPreview old) {
    super.didUpdateWidget(old);
    if (old.hex != widget.hex) _simulate();
  }

  Future<void> _simulate() async {
    setState(() => _loading = true);
    final engine = await MomotoEngine.instance;
    final results = <CvdType, CvdResult>{};
    for (final type in CvdType.values) {
      results[type] = await engine.simulateCvd(widget.hex, type);
    }
    if (mounted) setState(() { _results = results; _loading = false; });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Center(child: CircularProgressIndicator());

    const labels = {
      CvdType.protanopia:   'Protanopia\n(Red)',
      CvdType.deuteranopia: 'Deuteranopia\n(Green)',
      CvdType.tritanopia:   'Tritanopia\n(Blue)',
    };

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Original', style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: 4),
        Container(
          width: widget.swatchSize,
          height: widget.swatchSize,
          decoration: BoxDecoration(
            color:        MomotoColor.fromHex(widget.hex),
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        const SizedBox(height: 12),
        Text('CVD Simulation', style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: 4),
        Row(
          children: CvdType.values.map((type) {
            final result = _results[type];
            if (result == null) return const SizedBox();
            return Padding(
              padding: const EdgeInsets.only(right: 12),
              child: Column(
                children: [
                  Container(
                    width:  widget.swatchSize,
                    height: widget.swatchSize,
                    decoration: BoxDecoration(
                      color:        MomotoColor.fromHex(result.simulated),
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(labels[type]!, style: Theme.of(context).textTheme.labelSmall, textAlign: TextAlign.center),
                  Text(result.simulated, style: const TextStyle(fontFamily: 'monospace', fontSize: 9)),
                ],
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}
