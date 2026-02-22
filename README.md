
# momoto-ui

> **Chromatic intelligence and material physics engine — compiled to WebAssembly.**
> Momoto decides. Momoto UI renders.

[![Engine](https://img.shields.io/badge/Engine-v7.0.0-6c63ff.svg)](https://zuclubit.github.io/momoto-ui/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docs](https://img.shields.io/badge/Docs-GitHub%20Pages-7c3aed.svg)](https://zuclubit.github.io/momoto-ui/)
[![API](https://img.shields.io/badge/API-momoto.json-0ea5e9.svg)](https://zuclubit.github.io/momoto-ui/momoto.json)
[![LLMs](https://img.shields.io/badge/LLM%20Context-llms.txt-10b981.svg)](https://zuclubit.github.io/momoto-ui/llms.txt)

---

## Live Documentation

| Resource | URL |
|----------|-----|
| **Interactive API Explorer** | [zuclubit.github.io/momoto-ui](https://zuclubit.github.io/momoto-ui/) |
| **JSON API Spec** | [momoto.json](https://zuclubit.github.io/momoto-ui/momoto.json) |
| **LLM Context** | [llms.txt](https://zuclubit.github.io/momoto-ui/llms.txt) |
| **MCP Server** | [`docs/mcp/`](docs/mcp/README.md) — stdio context server for AI assistants |
| **WASM Package** | [`momoto/crates/momoto-wasm/`](momoto/crates/momoto-wasm/README.md) |

---

## What is Momoto?

Momoto is a **Rust library (v7.0.0) compiled to WebAssembly** via wasm-bindgen. It implements the full photometric and perceptual pipeline — from color science and accessibility metrics through physically-based glass physics and AI-powered recommendations.

`momoto-ui` is the **monorepo** that houses both the Momoto engine and the UI layer built on top of it.

| Layer | Package | Responsibility |
|-------|---------|---------------|
| **Momoto Engine (Rust/WASM)** | `@momoto-ui/wasm` | Color perception, contrast, physics, accessibility, AI |
| **Crystal UI** | `@momoto-ui/crystal` | React components, design tokens, glass effects |
| **Topocho CRM** | `@momoto/topocho-crm` | Reference CRM app built on Crystal + Engine |

> If Momoto is the **decision engine**, **Momoto UI is the execution surface**.

---

## Monorepo Structure

```
momoto-ui/                          ← Root (npm workspaces)
├── momoto/                         ← Rust engine (git subtree: zuclubit/momoto)
│   ├── Cargo.toml                  ← Engine workspace (v7.0.0)
│   └── crates/
│       ├── momoto-core/            ← Color spaces, OKLCH, linear RGB
│       ├── momoto-metrics/         ← WCAG 2.1 + APCA-W3 v0.1.9
│       ├── momoto-intelligence/    ← Harmony, CVD, constraint solver
│       ├── momoto-materials/       ← PBR physics, thin film, Mie, TMM
│       ├── momoto-agent/           ← JSON workflow engine
│       ├── momoto-events/          ← Pub/sub + SSE streaming
│       └── momoto-wasm/            ← WASM bindings (wasm-pack output)
│
├── packages/                       ← npm workspace packages
│   ├── momoto-ui-wasm/             ← @momoto-ui/wasm (built from momoto/crates/momoto-wasm)
│   └── momoto-ui-crystal/          ← @momoto-ui/crystal (React components)
│
├── apps/                           ← npm workspace apps
│   └── topocho-crm/                ← @momoto/topocho-crm (reference CRM)
│
├── src/                            ← TypeScript design system (hexagonal arch)
│   ├── domain/                     ← Color entities, ports, value objects
│   ├── application/                ← Use cases, recommendation pipeline
│   ├── adapters/                   ← React, CSS, Tailwind adapters
│   └── infrastructure/             ← WASM bridge, exporters, audit
│
├── crates/                         ← Rust UI bindings workspace
│   └── momoto-ui-core/             ← UI-layer Rust crate (v1.0.0-rc1)
│
├── docs/                           ← All documentation
│   ├── website/index.html          ← Interactive API explorer (GitHub Pages)
│   ├── api/momoto.json             ← Machine-readable API spec
│   ├── api/llms.txt                ← LLM context document
│   └── mcp/                        ← MCP stdio server
│
├── examples/                       ← Standalone usage examples
├── scripts/                        ← Build and verification scripts
├── Cargo.toml                      ← UI Rust workspace root
└── package.json                    ← Monorepo root (workspaces: packages/*, apps/*)
```

---

## Engine Overview

Momoto v7.0.0 provides **9 WASM modules** covering 280+ individual callable methods:

| Module | Description |
|--------|-------------|
| **HCT** | Google Material Design 3 (CAM16 + CIELAB). Tonal palettes, gamut-safe conversions. |
| **Core** | sRGB ↔ OKLCH ↔ OKLab. WCAG 2.1 + APCA-W3 v0.1.9. Batch luminance. |
| **Intelligence** | AI recommendations, 7 harmony types, CVD simulation (Viénot 1999), constraint solver. |
| **Materials** | Sprint 1–4 PBR: thin film (12), dispersion (7+5), metals (12), Mie (9+8), TMM (9), SpectralPipeline. |
| **Temporal** | Time-evolving physics: drying paint, soap bubbles, heated metals. R+T+A=1. |
| **Procedural** | Perlin fBm noise, IOR variation fields, roughness maps. Deterministic seed. |
| **SIREN** | Neural network [9→16→16→3], 483 params, ω₀=30. Perceptual color correction. |
| **Events** | MomotoEventBus pub/sub + MomotoEventStream SSE-compatible. |
| **Agent** | High-level JSON interface: validate, recommend, improve, material queries, workflows. |

---

## Getting Started

### Install (npm workspace)

```bash
git clone https://github.com/zuclubit/momoto-ui.git
cd momoto-ui
npm install          # Links all workspace packages automatically
```

### Build the WASM Engine

```bash
# Requires wasm-pack: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
npm run build:wasm    # → packages/momoto-ui-wasm/ (bundler target)
npm run build:wasm:web  # → web target (ES modules, no bundler)
```

### Build Everything

```bash
npm run build:all    # build:wasm + TypeScript + Crystal + CRM
npm run build        # TypeScript design system only (dist/)
npm run build:crm    # topocho-crm app only
npm run build:crystal # @momoto-ui/crystal only
```

### Engine Development

```bash
npm run build:engine  # cargo build --release (full engine)
npm run test:engine   # cargo test (all engine tests)
cd momoto && cargo test crates/momoto-wasm  # specific crate
```

### App Development

```bash
npm run dev:crm      # Start topocho-crm dev server
npm run dev          # TypeScript design system watch mode
```

---

## Installation (Standalone)

```bash
# WASM engine (published to npm)
npm install momoto-wasm

# Crystal component library
npm install @momoto-ui/crystal

# Local workspace reference (monorepo)
# packages automatically linked via npm workspaces
```

---

## Quick Start

### WASM Engine

```js
import init, { Color, wcagContrastRatio, wcagPasses } from 'momoto-wasm';

await init(); // Required: load WASM binary

const fg = Color.fromHex('#1a1a2e');
const bg = Color.fromHex('#f0f4ff');

const ratio = wcagContrastRatio(fg, bg);
const passes = wcagPasses(ratio, 0, false); // 0=AA, false=normal text
console.log(`${ratio.toFixed(2)}:1 — ${passes ? 'PASS' : 'FAIL'}`);
```

### Accessibility Validation

```js
import init, {
  wcagContrastRatio, wcagPasses, wcagLevel,
  apcaContrast, Color
} from 'momoto-wasm';

await init();
const fg = Color.fromHex('#c8d4ff');
const bg = Color.fromHex('#07070e');

const wcag = wcagContrastRatio(fg, bg);
const apca = apcaContrast(fg, bg);

console.log(`WCAG: ${wcag.toFixed(2)}:1 (${wcagLevel(wcag, false)})`);
console.log(`APCA: ${apca.toFixed(1)} Lc`); // body text needs ≥75
```

### HCT / Material Design 3

```js
import init, { hexToHct, hctTonalPalette, hctToHex } from 'momoto-wasm';

await init();

const [hue, chroma, tone] = hexToHct('#3a7bd5'); // [264.5, 41.2, 50.0]

// 13-tone palette (39 values: hue,chroma,tone per step)
const palette = hctTonalPalette(hue, chroma);
const tone80 = hctToHex(palette[0], palette[1], 80); // "#a8c5f8"
```

### Glass Physics

```js
import init, { ThinFilm, TransferMatrixFilm } from 'momoto-wasm';

await init();

// Soap bubble iridescence (Airy formula)
const bubble = ThinFilm.soapBubbleMedium();
const [r, g, b] = bubble.reflectanceRgb(1.0, 0.0);
const css = bubble.toCssSoapBubble(80); // CSS conic-gradient

// Morpho butterfly (9-layer TMM stack)
const morpho = TransferMatrixFilm.morphoButterfly();
console.log(morpho.toCssStructuralColor(0));   // 0° — deep blue
console.log(morpho.toCssStructuralColor(45));  // 45° — shifts toward cyan
```

### AI Recommendations

```js
import init, {
  agentRecommendForeground, agentValidatePair,
  ContractBuilder, agentValidate
} from 'momoto-wasm';

await init();

// Recommend best foreground for dark background
const rec = JSON.parse(agentRecommendForeground('#07070e', 0, 0));
// context=0: BodyText, target=0: WCAG_AA
console.log(rec.hex, rec.wcagRatio, rec.passes);

// Contract-based validation
const contract = new ContractBuilder()
  .minContrastWcagAA('#07070e')
  .lightnessRange(0.4, 0.9)
  .inSrgb()
  .build();
const result = JSON.parse(agentValidate('#6188d8', contract));
console.log(result.passes, result.violations);
```

### Color Harmony

```js
import init, { generatePalette, harmonyScore, simulateCVD } from 'momoto-wasm';

await init();

// 7 types: complementary, triadic, analogous, split_complementary,
//          tetradic, square, monochromatic
const triad = generatePalette('#3a7bd5', 'triadic', 3);

// CVD simulation (Viénot 1999, D65 white preserved)
const protanope = simulateCVD('#3a7bd5', 'protanopia');
```

### Mie Scattering & Atmospheric Optics

```js
import init, {
  MieParams, DynamicMieParams, henyeyGreenstein, rayleighIntensityRgb
} from 'momoto-wasm';

await init();

const fog = MieParams.fogSmall();             // 2µm droplets
const mist = DynamicMieParams.condensingFog();
const [r, g, b] = mist.scatteringColorAtTime(2.5, 550); // t=2.5s, λ=550nm
const css = mist.toCssFog();

const sky = rayleighIntensityRgb(0.0); // 90° → [0.12, 0.24, 1.0] deep blue
```

### SpectralPipeline

```js
import init, {
  SpectralPipeline, SpectralSignal, EvaluationContext,
  ThinFilm, MieParams
} from 'momoto-wasm';

await init();

const result = new SpectralPipeline()
  .addThinFilm(ThinFilm.arCoating())
  .addMieScattering(MieParams.cloud())
  .addGold()
  .evaluate(
    SpectralSignal.d65Illuminant(),
    new EvaluationContext().withAngle(30).withTemperature(293)
  );

const [r, g, b] = result.toRgb();
const [X, Y, Z] = result.toXyz();
```

---

## Crystal Design System

Production-ready React component library powered by the Momoto engine.

```bash
npm install @momoto-ui/crystal
```

```tsx
import { Button, Input, Card, MetricCard } from '@momoto-ui/crystal';
import '@momoto-ui/crystal/styles';

function Dashboard() {
  return (
    <Card variant="elevated">
      <MetricCard title="Revenue" value="$127,540" change="+12.5%" changeType="positive" />
      <Input label="Email" type="email" placeholder="name@example.com" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

**Components**: Button (4 variants, 3 sizes) · Input (validation, icons) · Card (metric, elevated)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MONOREPO: zuclubit/momoto-ui                     │
│                         npm workspaces + git subtree                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  momoto/ (Rust Engine — git subtree from zuclubit/momoto)                │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  lib.rs (7979 lines) + 9 module files                             │   │
│  │  ┌──────────┐ ┌───────────┐ ┌────────────────────────────────┐  │   │
│  │  │  hct.rs  │ │core_ext.rs│ │       lib.rs (materials)        │  │   │
│  │  │CAM16/HCT │ │OKLCH/WCAG │ │S1: ThinFilm (12 presets)       │  │   │
│  │  │tonal pal.│ │APCA batch │ │S2: Cauchy/Sellmeier/12 metals  │  │   │
│  │  └──────────┘ └───────────┘ │S3: Mie (9+8 presets)           │  │   │
│  │                              │S4: TMM (9 presets)              │  │   │
│  │  ┌──────────────┐ ┌────────┐└────────────────────────────────┘  │   │
│  │  │intelligence.rs│ │siren.rs│ ┌────────┐ ┌────────┐ ┌────────┐ │   │
│  │  │Harmony/CVD    │ │[9,16,  │ │events  │ │agent.rs│ │temporal│ │   │
│  │  │Constraints    │ │16,3]   │ │EventBus│ │JSON API│ │physics │ │   │
│  │  └──────────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                         │ wasm-pack build                                 │
│                         ▼                                                 │
│  packages/momoto-ui-wasm/ (@momoto-ui/wasm v7.0.0)                       │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  momoto_wasm.js · momoto_wasm.d.ts · momoto_wasm_bg.wasm        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                         │ npm workspace                                    │
│                         ▼                                                 │
│  packages/momoto-ui-crystal/ · apps/topocho-crm/                         │
│  src/ (domain · application · adapters · infrastructure)                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Module Reference

### HCT Color Space

```js
hexToHct(hex) → Float64Array [hue, chroma, tone]
hctToHex(hue, chroma, tone) → string
hctTonalPalette(hue, chroma) → Float64Array  // 39 values: 13 × [h,c,t]
hctMaxChroma(hue, tone) → number
hctToOklch(hue, chroma, tone) → Float64Array [L,C,H]
oklchToHct(l, c, h) → Float64Array [hue,chroma,tone]

HCT.fromHex(hex), HCT.fromArgb(argb)
hct.withTone(t), hct.withChroma(c), hct.withHue(h)
hct.toArgb(), hct.clampToGamut()
hct.hue, hct.chroma, hct.tone
```

### Core: Color & Luminance

```js
Color.fromHex(hex), Color.fromRgb(r,g,b)
wcagContrastRatio(fg, bg) → number
wcagPasses(ratio, level, isLargeText) → boolean  // level: 0=AA, 1=AAA
wcagLevel(ratio, isLargeText) → "AAA"|"AA"|"AA-Large"|"fail"
apcaContrast(fg, bg) → number                    // Lc; body≥75, heading≥60
relativeLuminanceSrgb(color) → number
relativeLuminanceApca(color) → number
srgbToLinear(v), linearToSrgb(v)
relativeLuminanceBatch(colors: Uint8Array) → Float64Array
wcagContrastRatioBatch(pairs: Uint8Array) → Float64Array
hexToOklch(hex) → Float64Array [L,C,H]
oklchToHex(l,c,h) → string
```

### Intelligence: Recommendations

```js
// Harmony (7 types)
generatePalette(hex, type, count) → string[]
// types: complementary|triadic|analogous|split_complementary|tetradic|square|monochromatic
generateShades(hex, count) → string[]
harmonyScore(lchFlat: Float64Array) → number [0,1]
temperaturePalette(warm: boolean) → Float64Array [L,C,H × 5]

// CVD (Viénot 1999, D65 preserved — NOT Brettel 1997)
simulateCVD(hex, "protanopia"|"deuteranopia"|"tritanopia") → string
cvdDeltaE(hex, cvdType) → number  // <20=mild, 20-60=moderate, >60=severe

// Constraint solver (penalty method, 500 iter, 1e-4 convergence)
solveColorConstraints(lchFlat, constraintsJson, maxIterations)
// → { colors, converged, iterations, finalPenalty, violations }

// Helpers
new StepSelector().selectStep(gradient, penalty) → number
new CostEstimator().estimateCost(nColors, nConstraints) → { flops, memBytes, estimatedMs }
usageMinWcagAA(usageContext) → number   // 0=BodyText→4.5, 1=LargeText→3.0
usageMinApcaLc(usageContext) → number   // 0→75, 1→60, 2→45, 3→15
complianceTargetDescription(target) → string
```

### Materials: Physics (Sprint 1–4)

**Sprint 1 — Thin-Film Optics**
```js
// 12 presets: soapBubbleThin/Medium/Thick, oilThin/Medium/Thick,
//             arCoating, oxideThin/Medium/Thick, beetleShell, nacre
ThinFilm.soapBubbleMedium()
new ThinFilm(nFilm, thicknessNm)
film.reflectance(λNm, nSubstrate, cosTheta) → number
film.reflectanceRgb(nSubstrate, cosTheta) → Float64Array [r,g,b]
film.toCssSoapBubble(sizePercent) → CSS conic-gradient
film.toCssOilSlick() → CSS gradient
film.toCssIridescentGradient(nSubstrate, baseColor) → CSS
```

**Sprint 2 — Chromatic Dispersion & Metals**
```js
CauchyDispersion.bk7()       // 7 presets: bk7/fk51a/sf11/lak9/sf57/nbk7/baf10
SellmeierDispersion.bk7()    // 5 presets (higher accuracy)
ComplexIOR.gold()             // 12 metals: gold(n=0.17,k=3.5), silver(0.05,4.2), copper...
ior.f0(), ior.isConductor(), ior.penetrationDepthNm(λNm)
SpectralComplexIOR.gold()    // 12 metals, wavelength-resolved
spIor.f0Rgb(), spIor.fresnelRgb(cosTheta), spIor.toCssSurface(roughness)
DrudeParams.aluminum()        // 7 metals, temperature-dependent
drude.atTemperature(K) → DrudeParams
drude.complexIor(λNm, K), drude.spectralIor(K)
f0FromIor(ior) → number      // ((n-1)/(n+1))²
```

**Sprint 3 — Mie Scattering**
```js
// 9 static: fineDust(Rayleigh x~0.3), coarseDust, fogSmall(2µm),
//           fogLarge(10µm), cloud(8µm), mist(3µm), smoke(0.3µm), milkGlobule(2.5µm), pollen(25µm)
MieParams.fogSmall().asymmetryFactor(), .sizeParameter(λNm)

// 8 dynamic: stratocumulus, fog, smoke, milk, dust, iceCrystals, condensingFog, evaporatingMist
DynamicMieParams.condensingFog().scatteringColorAtTime(t, λNm) → [r,g,b]
DynamicMieParams.fog().toCssFog(), .toCssSmoke()

// Phase functions
henyeyGreenstein(cosTheta, g) → number
doubleHenyeyGreenstein(cosTheta, gFwd, gBack, weight) → number
rayleighPhase(cosTheta) → number
rayleighIntensityRgb(cosTheta) → Float64Array [r,g,b]
scatteringColorFromRadius(radiusUm, nParticle) → [r,g,b]
```

**Sprint 4 — Multilayer Transfer Matrix**
```js
FilmLayer.dielectric(n, thicknessNm)
FilmLayer.absorbing(n, k, thicknessNm)
new TransferMatrixFilm(nIncident, nSubstrate)
film.addLayer(n, nm), film.addAbsorbingLayer(n, k, nm)
film.reflectance(λNm, angleDeg, pol)   // pol: 0=S, 1=P, 2=Average
film.reflectanceRgb(angleDeg, pol) → [r,g,b]
film.toCssStructuralColor(angleDeg) → CSS

// 9 presets: braggMirror, arBroadband, notchFilter,
//            dichroicBlueReflect, dichroicRedReflect,
//            morphoButterfly, beetleShell, nacre, opticalDisc
TransferMatrixFilm.morphoButterfly()
```

**SpectralPipeline**
```js
SpectralSignal.d65Illuminant()    // CIE D65
SpectralSignal.uniformDefault()   // flat unit spectrum
sig.toXyz() → [X,Y,Z], sig.toRgb() → [r,g,b]

new EvaluationContext().withAngle(deg).withTemperature(K)

new SpectralPipeline()
  .addThinFilm(film).addMieScattering(params).addGold()
  .evaluate(signal, ctx) → SpectralSignal
  .verifyEnergyConservation() → { passes, maxViolation }
```

**Glass, Refraction & Shadows**
```js
// Glass surface (Apple HIG-inspired)
GlassMaterial.frosted().css('#07070e') → CSS
renderPremiumCss(material, CssRenderConfig.premium()) → CSS

// Refraction
RefractionParams.frosted()
generateDistortionMap(params, cols, rows) → Float64Array  // N² × 4 floats

// Shadows (Material Design elevation)
AmbientShadowParams.elevated()
calculateAmbientShadow(params, bgOklch) → CSS shadow string
elevationDp(dp) → CSS

// PBR BRDFs
cookTorranceBRDF(normal, view, light, roughness, ior, cosTheta) → number
orenNayarBRDF(roughness, normal, view, light) → number

// Color difference
deltaE2000(lab1, lab2) → number
deltaE2000Batch(labPairs) → Float64Array
```

### Temporal Materials

```js
TemporalMaterial.dryingPaint().evalAtTime(t, cosTheta) → [R,T,A]
TemporalThinFilmMaterial.soapBubble().sampleTimeline(durationS, frames, cosTheta)
TemporalConductorMaterial.heatedGold().evalAtTemperature(K, cosTheta)

// Free functions (zero allocation)
temporalDryingPaint(t, cosTheta) → Float64Array [R,T,A]
temporalSoapBubble(t, cosTheta)  → Float64Array [R,T,A]
// All guarantee R + T + A = 1.0
```

### Procedural Noise

```js
// 4 presets: frosted (6 oct), regular (3 oct), clear (1 oct), thick (4 oct)
ProceduralNoise.frosted()
noise.sample(x, y) → number [0,1]       // deterministic
noise.sampleTiled(x, y, period) → number // tileable

variationField(baseIor, variation, cols, rows, seed) → Float64Array
roughnessVariationField(baseRoughness, variation, cols, rows, seed) → Float64Array
```

### SIREN Neural Network

```js
// Architecture: [9,16,16,3], 483 params, ω₀=30, Mulberry32 seed=421337
computeSirenCorrection(bgL,bgC,bgH, fgL,fgC,fgH, apcaLc,wcagRatio,quality)
  → { deltaL, deltaC, deltaH }
applySirenCorrection(l,c,h, deltaL,deltaC,deltaH) → Float64Array [L,C,H]
computeSirenCorrectionBatch(inputs: Float64Array) → Float64Array  // multiples of 9
sirenMetadata() → { architecture:[9,16,16,3], totalParams:483, omega0:30, seed:421337 }
sirenWeights() → { W1, B1, W2, B2, W3, B3 }
```

### Events & Streaming

```js
const bus = new MomotoEventBus();
bus.subscribe(cb)
bus.subscribeFiltered([0, 1], cb) // 0=Progress, 1=Metrics
bus.emitProgress('engine', 50, 'Computing palette…')
bus.emitMetric('wcag', 'ratio', 4.5)
bus.subscriberCount(), bus.eventCount(), bus.bufferedEvents()

const stream = MomotoEventStream.fromBus(bus);
stream.poll() → { events, sequence, totalEvents, droppedEvents } | null
stream.pause(), stream.resume(), stream.close()
```

### Agent API

```js
// Validation
agentValidatePair(fg, bg, standard, level) → JSON { passes, ratio, level }
agentValidatePairsBatch(pairsJson) → JSON
agentGetMetrics(hex) → JSON { hex, oklch, hct, luminance }
agentGetMetricsBatch(colorsJson) → JSON

// Recommendations
agentRecommendForeground(bgHex, context, target) → JSON
agentImproveForeground(fgHex, bgHex, context, target) → JSON
agentScorePair(fgHex, bgHex, context, target) → JSON

// Materials
agentGetMaterial(preset) → JSON
agentListMaterials(category?) → JSON

// Contracts
new ContractBuilder()
  .minContrastWcagAA('#07070e').inSrgb().lightnessRange(0.4, 0.9)
  .build() → JSON
agentValidate(colorHex, contractJson) → JSON { passes, violations }

// Workflows
executeWorkflow(workflowJson) → JSON
// type: "brand_palette"|"accessibility_audit"|"theme_generation"
createSession(configJson) → sessionId
executeWithSession(sessionId, queryJson) → JSON
generateReport(colorsJson, reportType) → JSON
// reportType: "wcag"|"apca"|"cvd"|"full"
listWorkflows() → JSON

// Engine identity & certification
getMomotoIdentity() → JSON { version:"7.0.0", buildId, specVersion }
selfCertify() → JSON { passed, tests, timestamp }
```

---

## Physics Constants

| Constant | Value |
|----------|-------|
| WCAG AA (normal text) | 4.5:1 |
| WCAG AAA (normal text) | 7.0:1 |
| WCAG AA (large text) | 3.0:1 |
| APCA body text | Lc ≥ 75 |
| APCA heading | Lc ≥ 60 |
| APCA MAIN_TRC | 2.4 |
| APCA sRco/sGco/sBco | 0.2126 / 0.7152 / 0.0722 |
| APCA BLK_THRS / BLK_CLMP | 0.022 / 1.414 |
| CAM16 z formula | z = 1.48 + 0.29 × √n |
| SIREN architecture | [9, 16, 16, 3], 483 params, ω₀=30, seed=421337 |
| Constraint solver | penalty method, max_iter=500, convergence=1e-4 |

---

## Flat Array Conventions

| Type | Layout |
|------|--------|
| OKLCH | `[L, C, H]` — L∈[0,1], C≥0, H∈[0,360) |
| HCT | `[hue, chroma, tone]` — tone∈[0,100] |
| RGB | `[r, g, b]` — ∈[0,1] |
| BSDF | `[reflectance, transmittance, absorption]` — sums to 1.0 |
| Tonal palette | 13 HCT triples → 39 values |
| Distortion map | `[offsetX, offsetY, hueShift, brightness × N²]` |
| Complex IOR batch | `[n₀, k₀, n₁, k₁, …]` |
| Spectral | 33 wavelengths: 380, 390, …, 700 nm |

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Interactive API Explorer](https://zuclubit.github.io/momoto-ui/) | Live search across 188 documented entries |
| [docs/API.md](docs/API.md) | Complete WASM API reference (all 9 modules) |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | TypeScript design system layer |
| [docs/mcp/](docs/mcp/README.md) | MCP stdio server for AI assistants |
| [momoto/crates/momoto-wasm/README.md](momoto/crates/momoto-wasm/README.md) | WASM crate README |

---

## Engine Internals

<table>
<tr>
<td align="center" width="50%">
<img src="docs/momoto-ui-geno1.png" alt="SIREN Neural Correction Flow" width="420"/>
<br/>
<strong>SIREN Neural Correction Flow</strong><br/>
<sub>483-param network · ω₀=30 · [9,16,16,3] · seed=421337</sub>
</td>
<td align="center" width="50%">
<img src="docs/momoto-ui-geno2.png" alt="AI Visual Generator Pipeline" width="420"/>
<br/>
<strong>AI Visual Generator Pipeline</strong><br/>
<sub>Physics · OKLCH · WCAG + APCA · Token export</sub>
</td>
</tr>
</table>

---

## Philosophy

> Color is not styling.
> Color is responsibility.

**Momoto decides. Momoto UI renders.**

---

## License

MIT © 2026 Zuclubit
