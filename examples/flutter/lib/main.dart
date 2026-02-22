/// Momoto Flutter Example
///
/// Demonstrates:
/// - WCAG/APCA contrast validation
/// - HCT tonal palette generation + MaterialColor
/// - CVD simulation preview
/// - Glass card UI components
/// - Momoto-generated ThemeData
///
/// Run with: flutter run

import 'package:flutter/material.dart';
// In a real project: import 'package:momoto_flutter/momoto_flutter.dart';
// For this example we inline a minimal stub
import 'momoto_stub.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Build theme from HCT palette before app starts
  final lightTheme = await MomotoTheme.fromHex('#3a7bd5', brightness: Brightness.light);
  final darkTheme  = await MomotoTheme.fromHex('#3a7bd5', brightness: Brightness.dark);

  runApp(MomotoExampleApp(lightTheme: lightTheme, darkTheme: darkTheme));
}

class MomotoExampleApp extends StatelessWidget {
  final ThemeData lightTheme, darkTheme;
  const MomotoExampleApp({super.key, required this.lightTheme, required this.darkTheme});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title:          'Momoto Flutter Demo',
      theme:          lightTheme,
      darkTheme:      darkTheme,
      themeMode:      ThemeMode.system,
      debugShowCheckedModeBanner: false,
      home:           const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _fg = '#6188d8';
  String _bg = '#07070e';
  ContrastResult? _result;
  bool _checking = false;

  Future<void> _check() async {
    setState(() => _checking = true);
    final engine = await MomotoEngine.instance;
    final result = await engine.validateContrast(_fg, _bg);
    setState(() { _result = result; _checking = false; });
  }

  @override
  void initState() {
    super.initState();
    _check();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Momoto Color Intelligence')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Contrast checker ──────────────────────────────────────────
            _SectionTitle('Contrast Checker'),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Expanded(child: _ColorField('Foreground', _fg, (v) => setState(() => _fg = v))),
                        const SizedBox(width: 12),
                        Expanded(child: _ColorField('Background', _bg, (v) => setState(() => _bg = v))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    // Preview swatch
                    Container(
                      height: 80,
                      decoration: BoxDecoration(
                        color: _hexToColor(_bg),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'Sample Text',
                        style: TextStyle(color: _hexToColor(_fg), fontSize: 18, fontWeight: FontWeight.w600),
                      ),
                    ),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _checking ? null : _check,
                      child: _checking
                          ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Text('Check Contrast'),
                    ),
                    if (_result != null) ...[
                      const SizedBox(height: 12),
                      _ContrastResultWidget(result: _result!),
                    ],
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // ── Palette ───────────────────────────────────────────────────
            _SectionTitle('HCT Tonal Palette'),
            _PaletteSection(hex: _fg),

            const SizedBox(height: 20),

            // ── CVD Simulation ────────────────────────────────────────────
            _SectionTitle('CVD Simulation'),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: CvdPreview(hex: _fg),
              ),
            ),

            const SizedBox(height: 20),

            // ── Glass card demo ───────────────────────────────────────────
            _SectionTitle('Glass Material'),
            Container(
              height: 160,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [_hexToColor(_fg), _hexToColor(_bg)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Center(
                child: GlassCard(
                  roughness: 0.15,
                  child: const Text('Momoto Glass', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                ),
              ),
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}

// ── Supporting widgets ─────────────────────────────────────────────────────

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(text, style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
    );
  }
}

class _ColorField extends StatelessWidget {
  final String label;
  final String value;
  final ValueChanged<String> onChanged;
  const _ColorField(this.label, this.value, this.onChanged);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.labelSmall),
        const SizedBox(height: 4),
        Row(
          children: [
            Container(
              width: 28, height: 28,
              decoration: BoxDecoration(
                color: _hexToColor(value),
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: Colors.grey.shade400),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextFormField(
                initialValue: value,
                style: const TextStyle(fontFamily: 'monospace', fontSize: 12),
                onChanged: (v) { if (RegExp(r'^#[0-9a-fA-F]{6}$').hasMatch(v)) onChanged(v); },
                decoration: InputDecoration(
                  contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                  hintText: '#rrggbb',
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _ContrastResultWidget extends StatelessWidget {
  final ContrastResult result;
  const _ContrastResultWidget({required this.result});

  @override
  Widget build(BuildContext context) {
    final pass = result.passesAA;
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: (pass ? Colors.green : Colors.red).withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: (pass ? Colors.green : Colors.red).withOpacity(0.3)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _Metric('WCAG', '${result.wcagRatio.toStringAsFixed(2)}:1'),
          _Metric('Level', result.wcagLevel),
          _Metric('APCA', '${result.apcaLc.toStringAsFixed(0)} Lc'),
          _Metric('AA', result.passesAA ? '✓' : '✗'),
          _Metric('AAA', result.passesAAA ? '✓' : '✗'),
        ],
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  final String label, value;
  const _Metric(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(label, style: Theme.of(context).textTheme.labelSmall),
        Text(value, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
      ],
    );
  }
}

class _PaletteSection extends StatefulWidget {
  final String hex;
  const _PaletteSection({required this.hex});

  @override
  State<_PaletteSection> createState() => _PaletteSectionState();
}

class _PaletteSectionState extends State<_PaletteSection> {
  HctPalette? _palette;

  @override
  void initState() { super.initState(); _load(); }
  @override
  void didUpdateWidget(_PaletteSection old) { super.didUpdateWidget(old); if (old.hex != widget.hex) _load(); }

  Future<void> _load() async {
    final engine  = await MomotoEngine.instance;
    final palette = await engine.generatePalette(widget.hex);
    if (mounted) setState(() => _palette = palette);
  }

  @override
  Widget build(BuildContext context) {
    if (_palette == null) return const LinearProgressIndicator();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Base: ${widget.hex}', style: Theme.of(context).textTheme.labelSmall),
            const SizedBox(height: 8),
            SizedBox(
              height: 40,
              child: Row(
                children: _palette!.entries.map((e) {
                  return Expanded(
                    child: Tooltip(
                      message: '${e.tailwindScale}: ${e.hex}',
                      child: Container(
                        decoration: BoxDecoration(
                          color: _hexToColor(e.hex),
                          borderRadius: BorderRadius.circular(4),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Hex → Color helper ────────────────────────────────────────────────────
Color _hexToColor(String hex) {
  try {
    final h = hex.replaceAll('#', '');
    return Color(int.parse('FF$h', radix: 16));
  } catch (_) {
    return Colors.grey;
  }
}
