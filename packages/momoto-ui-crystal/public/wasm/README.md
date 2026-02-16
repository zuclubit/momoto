# @momoto/wasm

WebAssembly bindings for Momoto color perception metrics.

## Features

- **WCAG 2.1** - Industry-standard contrast ratios
- **APCA-W3** - Modern perceptual contrast (Lc values)
- **OKLCH** - Perceptually uniform color space
- **Batch Operations** - High-performance batch processing
- **Zero Dependencies** - Pure Rust compiled to WASM

## Installation

```bash
npm install @momoto/wasm
```

## Usage

### WCAG 2.1 Contrast

```javascript
import init, { WCAGMetric, Color } from '@momoto/wasm';

await init();

const wcag = new WCAGMetric();
const black = new Color(0, 0, 0);
const white = new Color(255, 255, 255);

const result = wcag.evaluate(black, white);
console.log(`Contrast ratio: ${result.value}:1`); // 21:1

// Check against WCAG levels
const passes = WCAGMetric.passes(result.value, "AA", false);
console.log(`Passes WCAG AA: ${passes}`); // true
```

### APCA Contrast

```javascript
import { APCAMetric, Color } from '@momoto/wasm';

const apca = new APCAMetric();
const darkText = new Color(0, 0, 0);
const lightBg = new Color(255, 255, 255);

const result = apca.evaluate(darkText, lightBg);
console.log(`APCA Lc: ${result.value}`); // ~106 Lc
console.log(`Polarity: ${result.polarity}`); // 1 (dark on light)
```

### OKLCH Color Space

```javascript
import { OKLCH, Color } from '@momoto/wasm';

// Convert RGB to OKLCH
const color = new Color(59, 130, 246); // Blue
const oklch = OKLCH.fromColor(color);

console.log(`L: ${oklch.l}, C: ${oklch.c}, H: ${oklch.h}`);

// Transform colors
const lighter = oklch.lighten(0.1);
const saturated = oklch.saturate(1.5);
const rotated = oklch.rotateHue(30);

// Convert back to RGB
const rgb = lighter.toColor();
```

### Batch Operations (Performance)

Process many color pairs efficiently:

```javascript
import { WCAGMetric, Color } from '@momoto/wasm';

const wcag = new WCAGMetric();

// Create arrays of colors
const foregrounds = [
  new Color(0, 0, 0),
  new Color(128, 128, 128),
  new Color(255, 0, 0)
];

const backgrounds = [
  new Color(255, 255, 255),
  new Color(255, 255, 255),
  new Color(255, 255, 255)
];

// Evaluate in batch (~3x faster than individual calls)
const results = wcag.evaluateBatch(foregrounds, backgrounds);

results.forEach((result, i) => {
  console.log(`Pair ${i}: ${result.value}:1`);
});
```

### Color from Hex

```javascript
import { Color } from '@momoto/wasm';

const color = Color.fromHex("#3B82F6"); // Blue-500
console.log(color.toHex()); // "#3B82F6"
```

## API Reference

### Color

- `new Color(r, g, b)` - Create from RGB (0-255)
- `Color.fromHex(hex)` - Create from hex string
- `toHex()` - Convert to hex string
- `r`, `g`, `b` - Get channel values

### WCAGMetric

- `new WCAGMetric()` - Create metric instance
- `evaluate(fg, bg)` - Single evaluation → `ContrastResult`
- `evaluateBatch(fgs, bgs)` - Batch evaluation → `ContrastResult[]`
- `WCAGMetric.passes(ratio, level, isLargeText)` - Check WCAG conformance

### APCAMetric

- `new APCAMetric()` - Create metric instance
- `evaluate(fg, bg)` - Single evaluation → `ContrastResult`
- `evaluateBatch(fgs, bgs)` - Batch evaluation → `ContrastResult[]`

### OKLCH

- `new OKLCH(l, c, h)` - Create from LCH values
- `OKLCH.fromColor(color)` - Convert RGB to OKLCH
- `toColor()` - Convert to RGB
- `lighten(delta)`, `darken(delta)` - Adjust lightness
- `saturate(factor)`, `desaturate(factor)` - Adjust chroma
- `rotateHue(degrees)` - Rotate hue
- `mapToGamut()` - Clamp to sRGB gamut
- `deltaE(other)` - Perceptual difference
- `OKLCH.interpolate(a, b, t, path)` - Interpolate colors

### ContrastResult

- `value` - Contrast value (ratio for WCAG, Lc for APCA)
- `polarity` - Polarity: 1 (dark on light), -1 (light on dark), 0 (not applicable)

## Performance

Rust-powered WASM provides significant performance benefits:

- **6-10x faster** than JavaScript implementations
- **Batch operations** are ~3x faster than individual calls
- **Zero GC pressure** - No JavaScript object allocations during computation
- **Consistent timing** - No JIT warmup or deoptimization

## Build from Source

```bash
# Install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Build for web
wasm-pack build --target web

# Build for Node.js
wasm-pack build --target nodejs

# Build for bundlers (webpack, rollup, etc.)
wasm-pack build --target bundler
```

## License

MIT
