
# momoto-ui

> **Chromatic intelligence and material physics engine — compiled to WebAssembly.**
> Momoto decides. Momoto UI renders.

[![Version](https://img.shields.io/badge/Engine-v7.0.0-6c63ff.svg)](https://zuclubit.github.io/momoto-ui/)
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

`momoto-ui` is the **design system and UI layer** built on top of the Momoto engine. It consumes engine decisions and renders them as accessible, consistent interfaces.

| Layer | Responsibility |
|-------|---------------|
| **Momoto Engine (WASM)** | Color perception, contrast, physics, accessibility, policies, AI |
| **Momoto UI** | Components, themes, tokens, rendering, framework bindings |

> If Momoto is the **decision engine**, **Momoto UI is the execution surface**.

---

## Engine Overview

Momoto v7.0.0 provides **9 WASM modules** covering 280+ individual callable methods:

| Module | Description |
|--------|-------------|
| **HCT** | Google Material Design 3 color space (CAM16 + CIELAB). Tonal palettes, gamut-safe conversions. |
| **Core** | sRGB ↔ OKLCH ↔ OKLab. WCAG 2.1 + APCA-W3 v0.1.9 contrast metrics. Batch luminance. |
| **Intelligence** | AI color recommendations, 7 harmony types, CVD simulation (Viénot 1999), constraint solver, scoring. |
| **Materials** | Full Sprint 1–4 PBR physics: thin film, Cauchy/Sellmeier dispersion, complex IOR (12 metals), Mie scattering, multilayer TMM, SpectralPipeline, shadows, refraction. |
| **Temporal** | Time-evolving physics: drying paint, soap bubbles, heated metals. Allocation-free free functions. |
| **Procedural** | Perlin fBm noise, IOR variation fields, roughness maps. Deterministic seed. |
| **SIREN** | Neural network [9→16→16→3], 483 params, ω₀=30. Perceptual color correction. |
| **Events** | MomotoEventBus pub/sub + MomotoEventStream SSE-compatible consumer. |
| **Agent** | High-level JSON interface: validate, recommend, improve, material queries, workflow engine. |

---

## Key Features

- **Color spaces**: sRGB (gamma + linear), OKLCH, OKLab, HCT (CAM16+CIELAB), LinearRGBA
- **Accessibility**: WCAG 2.1 (AA=4.5:1 / AAA=7:1) and APCA-W3 v0.1.9 (Lc body≥75, heading≥60)
- **CVD simulation**: Viénot 1999 protanopia / deuteranopia / tritanopia — D65 white preserved exactly
- **PBR**: Cook-Torrance (GGX NDF + Smith G2 + Schlick Fresnel), Oren-Nayar diffuse
- **Thin film**: Airy formula (12 presets) + transfer-matrix method 380–700nm (9 TMM presets)
- **Chromatic dispersion**: Cauchy n(λ)=A+B/λ²+C/λ⁴ (7 glass presets) + Sellmeier (5 presets)
- **Metals**: 12 complex IOR presets (gold, silver, copper, aluminum, iron, chromium, titanium, nickel, platinum, brass, bronze, tungsten)
- **Drude model**: 7 metal presets, temperature-dependent IOR via `atTemperature(K)`
- **Mie scattering**: Henyey-Greenstein + Rayleigh/Mie/geometric regimes. 9 particle presets + 8 dynamic presets
- **Multilayer TMM**: FilmLayer, TransferMatrixFilm with 9 structural-color presets (morphoButterfly, nacre, opticalDisc…)
- **Spectral pipeline**: SpectralPipeline composable stages → SpectralSignal (D65, XYZ, sRGB)
- **SIREN neural correction**: 483-param deterministic network for perceptual quality
- **Constraint solver**: Penalty method, 6 constraint types (WCAG/APCA/harmony/gamut)
- **Energy conservation**: All BSDF evaluations guarantee R+T+A=1.0
- **Zero hardcoded colors**: All UI output driven by engine decisions

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

## Installation

```bash
# WASM engine (standalone)
npm install momoto-wasm

# Or local file reference:
# "momoto-wasm": "file:./momoto/crates/momoto-wasm/pkg"

# Crystal component library
npm install @momoto-ui/crystal
```

---

## Quick Start

### WASM Engine (Core Usage)

```js
import init, { Color, wcagContrastRatio, wcagPasses } from 'momoto-wasm';

await init(); // Required: load WASM binary

const fg = Color.fromHex('#1a1a2e');
const bg = Color.fromHex('#f0f4ff');

const ratio = wcagContrastRatio(fg, bg);
const passes = wcagPasses(ratio, 0, false); // 0=AA, false=normal text
console.log(ratio.toFixed(2), passes);     // "12.34 true"
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
const apca = apcaContrast(fg, bg); // APCA Lc value

console.log(`WCAG: ${wcag.toFixed(2)}:1 (${wcagLevel(wcag, false)})`);
console.log(`APCA: ${apca.toFixed(1)} Lc (body text needs ≥75)`);
```

### HCT / Material Design 3

```js
import init, { hexToHct, hctTonalPalette, hctToHex } from 'momoto-wasm';

await init();

const [hue, chroma, tone] = hexToHct('#3a7bd5');
console.log(hue, chroma, tone); // 264.5  41.2  50.0

// Generate 13-tone palette (HCT triples, 39 values)
const palette = hctTonalPalette(hue, chroma);
const tone50 = hctToHex(palette[0], palette[1], 50);
```

### Glass Physics

```js
import init, {
  ThinFilm, TransferMatrixFilm, cookTorranceBRDF
} from 'momoto-wasm';

await init();

// Soap bubble iridescence
const bubble = ThinFilm.soapBubbleMedium();
const [r, g, b] = bubble.reflectanceRgb(1.0, 0.0); // nSub=1, normal incidence
const css = bubble.toCssSoapBubble(80); // CSS gradient string

// Morpho butterfly structural color
const morpho = TransferMatrixFilm.morphoButterfly();
const structural = morpho.toCssStructuralColor(45); // 45° viewing angle

// Cook-Torrance PBR BRDF
const brdf = cookTorranceBRDF(
  [0,1,0],   // normal
  [0,1,0],   // view
  [0.7,0.7,0], // light
  0.2,       // roughness
  1.5,       // IOR
  0.8        // cosTheta
);
```

### AI Recommendations

```js
import init, {
  agentRecommendForeground, agentValidatePair,
  ContractBuilder, agentValidate
} from 'momoto-wasm';

await init();

// Recommend best foreground for a dark background
const rec = JSON.parse(agentRecommendForeground('#07070e', 0, 0));
// context 0=BodyText, target 0=WCAG_AA
console.log(rec.hex, rec.wcagRatio, rec.passes);

// Validate a specific pair
const result = JSON.parse(agentValidatePair('#c8d4ff', '#07070e', 'wcag', 'aa'));
console.log(result.passes, result.ratio); // true  12.34

// Contract-based validation
const contract = new ContractBuilder()
  .minContrastWcagAA('#07070e')
  .lightnessRange(0.4, 0.9)
  .inSrgb()
  .build();
const validation = JSON.parse(agentValidate('#6188d8', contract));
console.log(validation.passes, validation.violations);
```

### Color Harmony

```js
import init, {
  generatePalette, harmonyScore, generateShades, simulateCVD
} from 'momoto-wasm';

await init();

// 7 harmony types: complementary, triadic, analogous, split_complementary,
//                  tetradic, square, monochromatic
const triad = generatePalette('#3a7bd5', 'triadic', 3);
const score = harmonyScore(new Float64Array([0.6, 0.18, 265, 0.5, 0.2, 85, 0.4, 0.15, 145]));

// CVD simulation (Viénot 1999, D65 white preserved)
const simulated = simulateCVD('#3a7bd5', 'protanopia');
console.log(simulated); // hex color as seen by protanope
```

### Mie Scattering & Atmospheric Optics

```js
import init, {
  MieParams, DynamicMieParams, henyeyGreenstein, rayleighIntensityRgb
} from 'momoto-wasm';

await init();

// Static particle scattering
const fog = MieParams.fogSmall(); // 2µm droplets
console.log(fog.radiusUm, fog.asymmetryFactor());

// Dynamic animated particles
const mist = DynamicMieParams.condensingFog();
const [r, g, b] = mist.scatteringColorAtTime(2.5, 550);
const css = mist.toCssFog();

// Phase functions
const p_forward = henyeyGreenstein(1.0, 0.85);
const sky = rayleighIntensityRgb(0.0); // 90° → deep blue [0.12, 0.24, 1.0]
```

### SpectralPipeline

```js
import init, {
  SpectralPipeline, SpectralSignal, EvaluationContext,
  ThinFilm, MieParams
} from 'momoto-wasm';

await init();

const pipeline = new SpectralPipeline();
pipeline.addThinFilm(ThinFilm.soapBubbleMedium());
pipeline.addMieScattering(MieParams.fogSmall());

const ctx = new EvaluationContext()
  .withAngle(45.0)
  .withTemperature(293.0); // 20°C

const result = pipeline.evaluate(SpectralSignal.d65Illuminant(), ctx);
const [r, g, b] = result.toRgb();
console.log(pipeline.stageCount()); // 2
console.log(pipeline.verifyEnergyConservation());
```

---

## Crystal Design System (2026)

Production-ready React component library with integrated WASM engine.

```bash
npm install @momoto-ui/crystal
```

```tsx
import { Button, Input, Card, MetricCard } from '@momoto-ui/crystal';
import '@momoto-ui/crystal/styles';

function Dashboard() {
  return (
    <div>
      <MetricCard
        title="Total Revenue"
        value="$127,540"
        change="+12.5%"
        changeType="positive"
      />
      <Card variant="elevated">
        <Input label="Email" type="email" placeholder="name@example.com" />
        <Button variant="primary">Submit</Button>
      </Card>
    </div>
  );
}
```

**Components**: Button (4 variants, 3 sizes) · Input (validation, password, icons) · Card (metric, interactive, elevated)

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      MOMOTO ENGINE (WASM)                         │
│  lib.rs 7979 lines + 9 module files                               │
│                                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────────────────┐  │
│  │   hct.rs  │ │core_ext.rs│ │         lib.rs (materials)       │  │
│  │HCT/CAM16  │ │OKLCH/WCAG │ │Sprint 1: ThinFilm (12 presets)  │  │
│  │tonal      │ │APCA batch │ │Sprint 2: Cauchy/Sellmeier/IOR   │  │
│  │palettes   │ │linearRGB  │ │Sprint 3: Mie/9 particles        │  │
│  └──────────┘ └──────────┘ │Sprint 4: TMM/9 presets           │  │
│                              └──────────────────────────────────┘  │
│  ┌──────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │intelligence.rs│ │materials   │ │temporal.rs │ │procedural.r│  │
│  │Recommendations│ │_ext.rs     │ │Temporal    │ │Perlin fBm  │  │
│  │CVD/Harmony  │ │Refraction  │ │physics     │ │IOR/rough   │  │
│  │Constraints  │ │Shadows/PBR │ │R+T+A=1     │ │variation   │  │
│  └──────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────────────────┐  │
│  │ siren.rs  │ │ events.rs │ │            agent.rs             │  │
│  │[9→16→16→3]│ │EventBus  │ │JSON interface, workflows,       │  │
│  │483 params │ │EventStream│ │ContractBuilder, selfCertify     │  │
│  └──────────┘ └──────────┘ └──────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                    WASM Bridge (wasm-bindgen)
                              │
┌──────────────────────────────────────────────────────────────────┐
│                    MOMOTO UI (TypeScript / React)                  │
│  src/domain · src/application · src/adapters · src/infrastructure  │
│  packages/momoto-ui-crystal · packages/momoto-ui-playground        │
│  apps/topocho-crm                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Module Reference

### HCT Color Space

Google Material Design 3 perceptual model (CAM16 hue + CIELAB tone).

```js
hexToHct(hex) → Float64Array [hue, chroma, tone]
hctToHex(hue, chroma, tone) → string
hctTonalPalette(hue, chroma) → Float64Array (39 values: 13 tones × 3)
hctMaxChroma(hue, tone) → number
hctToOklch(hue, chroma, tone) → Float64Array [L, C, H]
oklchToHct(l, c, h) → Float64Array [hue, chroma, tone]
HCT class: fromHex, withTone, withChroma, withHue, toArgb, clampToGamut
```

### Core: Color & Luminance

```js
Color.fromHex(hex), Color.fromRgb(r,g,b)
wcagContrastRatio(fg, bg) → number
wcagPasses(ratio, level, isLargeText) → boolean  // level: 0=AA, 1=AAA
wcagLevel(ratio, isLargeText) → string
apcaContrast(fg, bg) → number (Lc)
relativeLuminanceSrgb(color) → number
relativeLuminanceApca(color) → number
srgbToLinear(v), linearToSrgb(v)
relativeLuminanceBatch(colors) → Float64Array
wcagContrastRatioBatch(pairs) → Float64Array     // Uint8Array [r,g,b,r,g,b,...]
```

### Intelligence: Recommendations

```js
// Harmony
generatePalette(hex, harmonyType, count) → string[]
generateShades(hex, count) → string[]
harmonyScore(lchFlat) → number [0,1]
temperaturePalette(warm) → Float64Array [L,C,H × 5]

// CVD (Viénot 1999 — D65 white preserved)
simulateCVD(hex, type) → string   // type: "protanopia"|"deuteranopia"|"tritanopia"
cvdDeltaE(hex, type) → number     // OKLab ΔE (>60 = severe, redesign needed)

// Recommendations
RecommendationEngine, ExplanationGenerator, AdvancedScorer, ConvergenceDetector
StepSelector, CostEstimator                          // custom optimization
usageMinWcagAA/AAA/ApcaLc(usageContext) → number
complianceTargetDescription(target) → string

// Constraint solver (penalty method)
solveColorConstraints(lchFlat, constraintsJson, maxIterations)
// Constraint kinds: MinContrast, MinAPCA, HarmonyAngle, InGamut, LightnessRange, ChromaRange
```

### Materials: Physics (Sprint 1–4)

**Sprint 1 — Thin-Film Optics**
```js
// 12 presets: soapBubbleThin/Medium/Thick, oilThin/Medium/Thick,
//             arCoating, oxideThin/Medium/Thick, beetleShell, nacre
ThinFilm.soapBubbleMedium() → ThinFilm
film.reflectance(λNm, nSubstrate, cosTheta) → number
film.reflectanceRgb(nSubstrate, cosTheta) → Float64Array [r,g,b]
film.toCssSoapBubble(sizePercent) → CSS string
film.toCssOilSlick() → CSS gradient
film.toCssIridescentGradient(nSubstrate, baseColor) → CSS string
```

**Sprint 2 — Chromatic Dispersion & Metals**
```js
CauchyDispersion.bk7()          // 7 glass presets with Abbe numbers
SellmeierDispersion.bk7()       // 5 presets (higher accuracy)
ComplexIOR.gold()               // 12 presets: gold n=0.17 k=3.5, silver n=0.05 k=4.2...
ComplexIOR.f0() → number        // Fresnel F0 at normal incidence
SpectralComplexIOR.gold()       // 12 metal presets, wavelength-resolved
SpectralComplexIOR.toCssSurface(roughness) → CSS
DrudeParams.aluminum()          // 7 presets, temperature-dependent
DrudeParams.atTemperature(K) → DrudeParams
f0FromIor(ior) → number         // ((n-1)/(n+1))²
```

**Sprint 3 — Mie Scattering**
```js
// 9 static presets: fineDust(Rayleigh x~0.3), coarseDust, fogSmall(2µm),
//                   fogLarge(10µm), cloud(8µm), mist(3µm), smoke(soot 0.3µm),
//                   milkGlobule(2.5µm), pollen(25µm geometric)
MieParams.fogSmall().asymmetryFactor() → number

// 8 dynamic presets: stratocumulus, fog, smoke, milk, dust,
//                    iceCrystals, condensingFog, evaporatingMist
DynamicMieParams.fog().scatteringColorAtTime(t, λNm) → [r,g,b]
DynamicMieParams.fog().toCssFog() → CSS

// Phase functions
henyeyGreenstein(cosTheta, g) → number
doubleHenyeyGreenstein(cosTheta, gFwd, gBack, weight) → number
rayleighPhase(cosTheta) → number
rayleighIntensityRgb(cosTheta) → Float64Array [r,g,b]
```

**Sprint 4 — Multilayer Transfer Matrix Method**
```js
// Build custom stacks
const film = new TransferMatrixFilm(nIncident, nSubstrate);
film.addLayer(n, thicknessNm);
film.reflectance(λNm, angleDeg, pol) → number  // pol: 0=S, 1=P, 2=Average

// 9 presets: braggMirror, arBroadband, notchFilter,
//            dichroicBlueReflect, dichroicRedReflect,
//            morphoButterfly, beetleShell, nacre, opticalDisc
TransferMatrixFilm.morphoButterfly()
film.toCssStructuralColor(angleDeg) → CSS string
```

**SpectralPipeline**
```js
SpectralSignal.d65Illuminant() → SpectralSignal
SpectralSignal.toXyz() → [X,Y,Z]
EvaluationContext.withAngle(deg).withTemperature(K) → ctx
new SpectralPipeline()
  .addThinFilm(film)
  .addMieScattering(mieParams)
  .addGold()                        // conductor layer
  .evaluate(signal, ctx) → SpectralSignal
  .verifyEnergyConservation() → {passes, maxViolation}
```

**Other Materials**
```js
// Glass surface (Apple HIG-inspired)
GlassMaterial.frosted().css('#07070e') → CSS
GlassMaterialBuilder.ior(1.45).roughness(0.3).build()
renderEnhancedCss(material, config) → CSS
renderPremiumCss(material, config)   → CSS

// Refraction & distortion
RefractionParams.frosted()
calculateRefraction(params, x, y, angle) → [offsetX, offsetY, hueShift, brightness]
generateDistortionMap(params, cols, rows) → Float64Array (cols×rows×4 floats)

// PBR BRDFs
cookTorranceBRDF(normal, view, light, roughness, ior, cosTheta) → number
orenNayarBRDF(roughness, normal, view, light) → number

// Shadows
AmbientShadowParams.standard(), .elevated(), .subtle(), .dramatic()
ElevationTransition.card(), .fab(), .flat()
calculateAmbientShadow(params, bgHex) → CSS shadow string

// Color difference
deltaE76(lab1, lab2), deltaE94(lab1, lab2), deltaE2000(lab1, lab2)
```

### Temporal Materials

```js
TemporalMaterial.dryingPaint().evalAtTime(t, cosTheta) → [R,T,A]
TemporalThinFilmMaterial.soapBubble().sampleTimeline(duration, frames, cosTheta)
TemporalConductorMaterial.heatedGold().evalAtTemperature(K, cosTheta)

// Free functions (no allocation)
temporalDryingPaint(t, cosTheta) → Float64Array [R,T,A]
temporalSoapBubble(t, cosTheta)  → Float64Array [R,T,A]
```

### SIREN Neural Network

```js
computeSirenCorrection(bgL, bgC, bgH, fgL, fgC, fgH, apcaLc, wcagRatio, quality)
  → { deltaL, deltaC, deltaH }
applySirenCorrection(l, c, h, deltaL, deltaC, deltaH) → Float64Array [L,C,H]
computeSirenCorrectionBatch(inputs) → Float64Array
sirenMetadata() → { architecture:[9,16,16,3], totalParams:483, omega0:30, seed:421337 }
sirenWeights() → { W1, B1, W2, B2, W3, B3 }
```

### Events & Streaming

```js
const bus = new MomotoEventBus();
bus.subscribe(e => console.log(e.category, e.payload));
bus.emitProgress('engine', 50, 'Computing…');
bus.subscribeFiltered([0, 1], handler); // 0=Progress, 1=Metrics

const stream = MomotoEventStream.fromBus(bus);
const batch = stream.poll(); // { events, sequence, totalEvents, droppedEvents }
stream.pause(); stream.resume(); stream.close();
```

### Agent API

```js
// Validation
agentValidatePair(fg, bg, standard, level) → JSON
agentValidatePairsBatch(pairsJson) → JSON
agentGetMetrics(colorHex) → JSON  // oklch, hct, luminance
agentGetMetricsBatch(colorsJson) → JSON

// Recommendations
agentRecommendForeground(bgHex, context, target) → JSON
agentImproveForeground(fgHex, bgHex, context, target) → JSON
agentScorePair(fgHex, bgHex, context, target) → JSON

// Materials
agentGetMaterial(preset) → JSON
agentListMaterials(category?) → JSON   // category: "dielectric"|"conductor"|"thin_film"|"pbr"

// Contracts
new ContractBuilder()
  .minContrastWcagAA('#07070e')
  .inSrgb()
  .lightnessRange(0.4, 0.9)
  .build() → JSON
agentValidate(colorHex, contractJson) → JSON

// Workflows
executeWorkflow(workflowJson) → JSON  // types: "brand_palette"|"accessibility_audit"|"theme_generation"
createSession(configJson) → sessionId
executeWithSession(sessionId, queryJson) → JSON
generateReport(colorsJson, reportType) → JSON  // reportType: "wcag"|"apca"|"cvd"|"full"
listWorkflows() → JSON

// Engine
getMomotoIdentity() → JSON  // version 7.0.0, buildId, specVersion
selfCertify() → JSON         // WCAG golden vectors, APCA constants, SIREN checksum
```

---

## Physics Constants

| Constant | Value |
|----------|-------|
| APCA MAIN_TRC | 2.4 |
| APCA sRco/sGco/sBco | 0.2126 / 0.7152 / 0.0722 |
| APCA BLK_THRS/BLK_CLMP | 0.022 / 1.414 |
| APCA Lc body/heading | ≥75 / ≥60 |
| WCAG AA (normal/large) | 4.5:1 / 3.0:1 |
| WCAG AAA (normal/large) | 7.0:1 / 4.5:1 |
| CAM16 z formula | z = 1.48 + 0.29 × √n |
| SIREN architecture | [9, 16, 16, 3], 483 params, ω₀=30, seed=421337 |
| Constraint solver | penalty method, max_iter=500, convergence=1e-4 |

---

## Flat Array Conventions

Functions returning `Float64Array` use packed layouts:

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

## Best Practices

### Use Token Roles, Not Raw Colors

```ts
// Don't
background: '#3B82F6'

// Do
background: theme.colors.intent.primary
```

### Let Momoto Decide

```ts
// Don't
color.darken(10)

// Do
theme.colors.text.onPrimary
// or: agentImproveForeground(fg, bg, context, target)
```

### Validate with Contracts

```ts
const contract = new ContractBuilder()
  .minContrastWcagAA('#07070e')
  .inSrgb()
  .build();

// Every color passes the contract before rendering
agentValidate(candidateColor, contract);
```

---

## When to Use momoto-ui

| Use case | Suitable? |
|----------|-----------|
| Design systems | ✅ |
| CRMs / Dashboards | ✅ |
| AI-assisted UI | ✅ |
| Multi-brand platforms | ✅ |
| Accessibility-critical products | ✅ |
| Static marketing pages | ❌ |
| One-off decorative components | ❌ |

---

## Documentation

| Doc | Description |
|-----|-------------|
| [Interactive API Explorer](https://zuclubit.github.io/momoto-ui/) | Live search across all 188 API entries |
| [docs/API.md](docs/API.md) | Complete WASM API reference |
| [docs/API_REFERENCE.md](docs/API_REFERENCE.md) | Architecture & TypeScript layer |
| [docs/mcp/README.md](docs/mcp/README.md) | MCP stdio server for AI assistants |
| [momoto/crates/momoto-wasm/README.md](momoto/crates/momoto-wasm/README.md) | WASM package README |
| [docs/design/CRYSTAL-DESIGN-SYSTEM-2025.md](docs/design/CRYSTAL-DESIGN-SYSTEM-2025.md) | Crystal design system spec |
| [docs/reports/PROJECT-SUMMARY-2026.md](docs/reports/PROJECT-SUMMARY-2026.md) | Project status summary |

---

## Philosophy

> Color is not styling.
> Color is responsibility.

**Momoto decides. Momoto UI renders.**

---

## License

MIT © 2026 Zuclubit
