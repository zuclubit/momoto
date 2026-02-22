# momoto-wasm

> Chromatic intelligence and material physics engine — Rust v7.0.0 compiled to WebAssembly.

[![Version](https://img.shields.io/badge/version-7.0.0-6c63ff.svg)](https://zuclubit.github.io/momoto-ui/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](../../../../LICENSE)
[![Docs](https://img.shields.io/badge/docs-interactive-7c3aed.svg)](https://zuclubit.github.io/momoto-ui/)

---

## What's Inside

Full photometric and perceptual pipeline in one WASM binary:

| Capability | Details |
|------------|---------|
| **Color spaces** | sRGB ↔ OKLCH ↔ OKLab ↔ HCT (CAM16+CIELAB) ↔ LinearRGBA |
| **Accessibility** | WCAG 2.1 (AA/AAA) + APCA-W3 v0.1.9 (Lc metrics) |
| **CVD simulation** | Viénot 1999 protanopia/deuteranopia/tritanopia — D65 white preserved |
| **PBR** | Cook-Torrance (GGX + Smith G2 + Schlick), Oren-Nayar diffuse |
| **Thin film** | Airy formula (12 presets) + TMM 380–700nm (9 structural-color presets) |
| **Dispersion** | Cauchy (7 glass presets, Abbe numbers) + Sellmeier (5 presets) |
| **Metals** | 12 complex IOR presets + SpectralComplexIOR + Drude temperature model |
| **Mie scattering** | 9 static + 8 dynamic presets, Henyey-Greenstein, Rayleigh |
| **Spectral pipeline** | SpectralPipeline, SpectralSignal (D65), EvaluationContext |
| **SIREN** | Neural network [9→16→16→3], 483 params, ω₀=30, deterministic |
| **Intelligence** | Recommendations, 7 harmony types, constraint solver, CVD ΔE |
| **Events** | MomotoEventBus pub/sub + MomotoEventStream SSE-compatible |
| **Agent** | High-level JSON interface, ContractBuilder, workflow engine |
| **Temporal** | Drying paint, soap bubbles, heated metals — R+T+A=1 |
| **Procedural** | Perlin fBm, IOR variation fields, roughness maps |

---

## Installation

```bash
npm install momoto-wasm
```

Or reference the local build:

```json
{
  "momoto-wasm": "file:./momoto/crates/momoto-wasm/pkg"
}
```

---

## Build from Source

```bash
# Install wasm-pack (if not installed)
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

cd momoto/crates/momoto-wasm

# Web (ES module)
wasm-pack build --target web

# Bundler (Webpack/Rollup/Vite)
wasm-pack build --target bundler

# Node.js
wasm-pack build --target nodejs
```

The built package is output to `pkg/` with:
- `momoto_wasm_bg.wasm` — the binary
- `momoto_wasm.js` — JS bindings
- `momoto_wasm.d.ts` — TypeScript types
- `package.json`

---

## Quick Start

```js
import init, {
  Color,
  wcagContrastRatio,
  wcagPasses,
  apcaContrast
} from 'momoto-wasm';

await init(); // Required: loads WASM binary

const fg = Color.fromHex('#1a1a2e');
const bg = Color.fromHex('#f0f4ff');

const ratio = wcagContrastRatio(fg, bg);
const passes = wcagPasses(ratio, 0, false);   // 0=AA, false=normal text
const lc = apcaContrast(fg, bg);              // APCA Lc value

console.log(`WCAG ${ratio.toFixed(2)}:1 — ${passes ? 'PASS' : 'FAIL'}`);
console.log(`APCA ${lc.toFixed(1)} Lc`);
```

---

## Usage Examples

### HCT / Material Design 3 Tonal Palettes

```js
import init, { hexToHct, hctTonalPalette, hctToHex } from 'momoto-wasm';
await init();

const [hue, chroma, tone] = hexToHct('#3a7bd5');
// [264.5, 41.2, 50.0]

// 13-step tonal palette (39 Float64Array values: hue,chroma,tone per step)
const palette = hctTonalPalette(hue, chroma);

// Get hex for specific tone
const tone80 = hctToHex(palette[0], palette[1], 80);
console.log(tone80); // "#a8c5f8"
```

### Thin-Film Iridescence

```js
import init, { ThinFilm, TransferMatrixFilm } from 'momoto-wasm';
await init();

// Soap bubble (Airy formula)
const bubble = ThinFilm.soapBubbleMedium();
const [r, g, b] = bubble.reflectanceRgb(1.0, 0.0);
const css = bubble.toCssSoapBubble(80);
// → "conic-gradient(from 180deg, oklch(0.72 0.18 280), ...)"

// Morpho butterfly structural color (TMM 9-layer stack)
const morpho = TransferMatrixFilm.morphoButterfly();
console.log(morpho.toCssStructuralColor(0));   // at 0° incidence
console.log(morpho.toCssStructuralColor(45));  // 45° — color shifts
```

### Mie Scattering

```js
import init, {
  MieParams,
  DynamicMieParams,
  henyeyGreenstein,
  rayleighIntensityRgb
} from 'momoto-wasm';
await init();

// Static particle
const fog = MieParams.fogSmall(); // 2µm water droplets
console.log(fog.asymmetryFactor()); // ~0.85

// Dynamic animation (condensing fog: particles grow Rayleigh → Mie)
const condensing = DynamicMieParams.condensingFog();
const [r, g, b] = condensing.scatteringColorAtTime(2.5, 550); // t=2.5s, λ=550nm
const css = condensing.toCssFog();

// Phase functions
const forward_peak = henyeyGreenstein(1.0, 0.85);  // g=0.85 cloud
const blue_sky = rayleighIntensityRgb(0.0);         // 90° scattering → [0.12, 0.24, 1.0]
```

### SpectralPipeline

```js
import init, {
  SpectralPipeline, SpectralSignal, EvaluationContext,
  ThinFilm, MieParams
} from 'momoto-wasm';
await init();

const pipeline = new SpectralPipeline();
pipeline.addThinFilm(ThinFilm.arCoating());
pipeline.addMieScattering(MieParams.cloud());
pipeline.addGold(); // add conductor layer

const ctx = new EvaluationContext()
  .withAngle(30.0)
  .withTemperature(293.0); // 20°C

const d65 = SpectralSignal.d65Illuminant();
const result = pipeline.evaluate(d65, ctx);

const [r, g, b] = result.toRgb();
const [X, Y, Z] = result.toXyz();

console.log(`Stages: ${pipeline.stageCount()}`); // 3
const ec = pipeline.verifyEnergyConservation();
console.log(`Energy conserved: ${ec.passes}`);
```

### WCAG + APCA Validation

```js
import init, {
  Color, wcagContrastRatio, wcagPasses, wcagLevel, apcaContrast
} from 'momoto-wasm';
await init();

const pairs = [
  { fg: '#c8d4ff', bg: '#07070e' },
  { fg: '#888888', bg: '#ffffff' },
  { fg: '#000000', bg: '#ffffff' },
];

for (const { fg, bg } of pairs) {
  const fgColor = Color.fromHex(fg);
  const bgColor = Color.fromHex(bg);

  const ratio = wcagContrastRatio(fgColor, bgColor);
  const lc = apcaContrast(fgColor, bgColor);
  const level = wcagLevel(ratio, false);

  console.log(`${fg}/${bg}: WCAG ${ratio.toFixed(2)}:1 (${level}) | APCA ${lc.toFixed(0)} Lc`);
}
```

### AI Color Recommendations

```js
import init, {
  agentRecommendForeground, agentImproveForeground,
  ContractBuilder, agentValidate
} from 'momoto-wasm';
await init();

// Recommend best foreground for dark background
const rec = JSON.parse(agentRecommendForeground('#07070e', 0, 0));
// context=0: BodyText, target=0: WCAG_AA
console.log(rec.hex, rec.wcagRatio, rec.passes);

// Improve existing color to meet accessibility
const improved = JSON.parse(agentImproveForeground('#5577cc', '#07070e', 0, 0));
console.log(improved.original, improved.improved, improved.ratioImprovement);

// Contract-based validation
const contract = new ContractBuilder()
  .minContrastWcagAA('#07070e')
  .lightnessRange(0.4, 0.9)
  .inSrgb()
  .build();

const validation = JSON.parse(agentValidate('#6188d8', contract));
console.log(validation.passes, validation.violations);
```

### Color Harmony & CVD

```js
import init, { generatePalette, harmonyScore, simulateCVD, cvdDeltaE } from 'momoto-wasm';
await init();

// 7 harmony types
const triad = generatePalette('#3a7bd5', 'triadic', 3);
// ["#3a7bd5", "#d5833a", "#3ad576"]

// CVD simulation (Viénot 1999 — D65 white preserved)
const protanope = simulateCVD('#3a7bd5', 'protanopia');
const severity = cvdDeltaE('#3a7bd5', 'protanopia');
console.log(protanope);           // color as seen by protanope
console.log(severity.toFixed(1)); // <20=mild, 20-60=moderate, >60=severe
```

### Glass & CSS Rendering

```js
import init, {
  GlassMaterial, GlassMaterialBuilder,
  renderEnhancedCss, renderPremiumCss, CssRenderConfig
} from 'momoto-wasm';
await init();

// Apple HIG-inspired glass
const frosted = GlassMaterial.frosted();
console.log(frosted.css('#07070e'));
// backdrop-filter: blur(20px) saturate(180%);
// background: rgba(7,7,14,0.75);
// border: 1px solid rgba(255,255,255,0.12);

// Premium rendering
const mat = new GlassMaterialBuilder()
  .ior(1.45)
  .roughness(0.2)
  .tintRgba(1.0, 1.0, 1.0, 0.08)
  .build();

const css = renderPremiumCss(mat, CssRenderConfig.premium());
```

### SIREN Neural Correction

```js
import init, { computeSirenCorrection, applySirenCorrection, sirenMetadata } from 'momoto-wasm';
await init();

// Check network info
const meta = sirenMetadata();
console.log(meta.architecture);  // [9, 16, 16, 3]
console.log(meta.totalParams);   // 483

// Apply perceptual correction
const corr = computeSirenCorrection(
  0.04, 0.02, 270,   // background OKLCH
  0.537, 0.165, 265, // foreground OKLCH
  58.3, 4.21, 62.0   // apcaLc, wcagRatio, quality
);
const corrected = applySirenCorrection(
  0.537, 0.165, 265,
  corr.deltaL, corr.deltaC, corr.deltaH
);
```

### Batch Operations

```js
import init, { wcagContrastRatioBatch, relativeLuminanceBatch } from 'momoto-wasm';
await init();

// Batch WCAG — input: Uint8Array [fg_r,fg_g,fg_b, bg_r,bg_g,bg_b, ...]
const pairs = new Uint8Array([
  0,   0,   0,   255, 255, 255,  // black on white
  200, 200, 200, 50,  50,  50,   // light on dark
  255, 0,   0,   255, 255, 255,  // red on white
]);
const ratios = wcagContrastRatioBatch(pairs);
// Float64Array [21.0, 5.74, 3.99]
```

### Events

```js
import init, { MomotoEventBus, MomotoEventStream } from 'momoto-wasm';
await init();

const bus = new MomotoEventBus();
const stream = MomotoEventStream.fromBus(bus);

bus.subscribe(e => console.log(e.category, e.payload));
bus.subscribeFiltered([0, 1], e => updateProgress(e)); // 0=Progress, 1=Metrics

bus.emitProgress('engine', 50, 'Computing palette…');
bus.emitMetric('wcag', 'ratio', 4.5);

// Poll in animation loop
requestAnimationFrame(function tick() {
  const batch = stream.poll();
  if (batch) batch.events.forEach(handleEvent);
  requestAnimationFrame(tick);
});
```

---

## API Summary

### 9 Modules, 188 Documented Entries, 280+ Callable Methods

| Module | Key Classes & Functions |
|--------|------------------------|
| **hct** | `hexToHct`, `hctTonalPalette`, `hctToHex`, `hctMaxChroma`, `HCT` class |
| **core** | `Color`, `wcagContrastRatio`, `wcagPasses`, `apcaContrast`, `relativeLuminanceBatch` |
| **intelligence** | `RecommendationEngine`, `generatePalette`, `simulateCVD`, `solveColorConstraints`, `ConvergenceDetector` |
| **materials** | `ThinFilm` (12), `ComplexIOR` (12), `TransferMatrixFilm` (9), `MieParams` (9), `SpectralPipeline`, `cookTorranceBRDF` |
| **temporal** | `TemporalMaterial`, `TemporalThinFilmMaterial`, `temporalDryingPaint`, `temporalSoapBubble` |
| **procedural** | `ProceduralNoise`, `variationField`, `roughnessVariationField` |
| **siren** | `computeSirenCorrection`, `applySirenCorrection`, `sirenMetadata`, `sirenWeights` |
| **events** | `MomotoEventBus`, `MomotoEventStream` |
| **agent** | `agentValidatePair`, `agentRecommendForeground`, `ContractBuilder`, `executeWorkflow` |

Full interactive reference: **[zuclubit.github.io/momoto-ui](https://zuclubit.github.io/momoto-ui/)**

---

## Performance

- **6–10x faster** than equivalent JavaScript implementations
- **Batch operations**: process thousands of pairs in microseconds
- **Zero GC pressure**: no JS allocations during computation
- **Deterministic**: SIREN network, Perlin noise always produce identical results
- **Energy conserving**: all BSDF evaluations guarantee R+T+A=1.0

---

## Flat Array Conventions

Functions returning `Float64Array` use packed layouts:

| Type | Layout |
|------|--------|
| OKLCH | `[L, C, H]` — L∈[0,1], H∈[0,360) |
| HCT | `[hue, chroma, tone]` — tone∈[0,100] |
| RGB | `[r, g, b]` — ∈[0,1] |
| BSDF | `[reflectance, transmittance, absorption]` — sums to 1.0 |
| Tonal palette | 13 × `[hue, chroma, tone]` = 39 values |
| Distortion map | `[offsetX, offsetY, hueShift, brightness × N²]` |
| Spectral | 33 values at 380,390,…,700nm |

---

## Source

```
momoto/crates/momoto-wasm/src/
├── lib.rs           # 7979 lines — Sprint 1-4 physics + HCT + core
├── core_ext.rs      # OKLCH/APCA/WCAG extensions
├── hct.rs           # CAM16/HCT color space
├── intelligence.rs  # Recommendations, harmony, CVD
├── materials_ext.rs # Refraction, shadows, interpolation, PBR
├── temporal.rs      # Time-evolving materials
├── procedural.rs    # Perlin fBm noise
├── siren.rs         # SIREN neural network
├── events.rs        # EventBus + EventStream
└── agent.rs         # High-level Agent API
```

---

## License

MIT © 2026 Zuclubit
