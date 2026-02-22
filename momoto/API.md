# Momoto Engine API — v7.0.0

> Complete API reference for the Momoto WASM engine.
> See [docs/API.md](../docs/API.md) for the full reference with all 9 modules.

**Interactive explorer**: [zuclubit.github.io/momoto-ui](https://zuclubit.github.io/momoto-ui/)

---

## Quick Reference

### Initialization

```js
import init from 'momoto-wasm';
await init(); // Required before any WASM call
```

---

## 1. HCT Color Space

Google Material Design 3 (CAM16 + CIELAB). Gamut-safe tonal palettes.

```js
import { hexToHct, hctTonalPalette, hctToHex, hctMaxChroma,
         hctToOklch, oklchToHct, HCT } from 'momoto-wasm';

// Functions
hexToHct(hex) → Float64Array [hue, chroma, tone]
hctToHex(hue, chroma, tone) → string
hctTonalPalette(hue, chroma) → Float64Array   // 39 values: 13 tones × [h,c,t]
hctMaxChroma(hue, tone) → number
hctToOklch(hue, chroma, tone) → Float64Array [L,C,H]
oklchToHct(l, c, h) → Float64Array [hue,chroma,tone]

// Class
HCT.fromHex(hex), HCT.fromArgb(argb)
hct.withTone(t), hct.withChroma(c), hct.withHue(h)
hct.toArgb(), hct.clampToGamut()
hct.hue, hct.chroma, hct.tone
```

---

## 2. Core: Color & Luminance

sRGB, WCAG 2.1, APCA-W3 v0.1.9, batch operations.

```js
import { Color, wcagContrastRatio, wcagPasses, wcagLevel,
         apcaContrast, relativeLuminanceSrgb, relativeLuminanceApca,
         srgbToLinear, linearToSrgb, relativeLuminanceBatch,
         wcagContrastRatioBatch, hexToOklch, oklchToHex } from 'momoto-wasm';

Color.fromHex(hex), Color.fromRgb(r,g,b)
wcagContrastRatio(fg, bg) → number
wcagPasses(ratio, level, isLargeText) → boolean  // level: 0=AA, 1=AAA
wcagLevel(ratio, isLargeText) → "AAA"|"AA"|"AA-Large"|"fail"
apcaContrast(fg, bg) → number  // Lc; body≥75, heading≥60
relativeLuminanceBatch(colors: Uint8Array) → Float64Array
wcagContrastRatioBatch(pairs: Uint8Array) → Float64Array
srgbToLinear(v), linearToSrgb(v)
hexToOklch(hex) → Float64Array [L,C,H]
oklchToHex(l,c,h) → string
```

---

## 3. Intelligence: Recommendations

```js
import { generatePalette, generateShades, harmonyScore,
         temperaturePalette, simulateCVD, cvdDeltaE,
         solveColorConstraints, RecommendationEngine,
         ExplanationGenerator, AdvancedScorer, ConvergenceDetector,
         StepSelector, CostEstimator,
         usageMinWcagAA, usageMinApcaLc, complianceTargetDescription } from 'momoto-wasm';

// Harmony (7 types: complementary|triadic|analogous|split_complementary|tetradic|square|monochromatic)
generatePalette(hex, harmonyType, count) → string[]
generateShades(hex, count) → string[]
harmonyScore(lchFlat: Float64Array) → number [0,1]
temperaturePalette(warm: boolean) → Float64Array [L,C,H × 5]

// CVD (Viénot 1999, D65 preserved)
simulateCVD(hex, "protanopia"|"deuteranopia"|"tritanopia") → string
cvdDeltaE(hex, cvdType) → number  // <20=mild, 20-60=moderate, >60=severe

// Constraint solver (penalty method, 6 constraint types)
solveColorConstraints(lchFlat, constraintsJson, maxIterations)
// → { colors, converged, iterations, finalPenalty, violations }

// Optimization helpers
new StepSelector().selectStep(gradient, penalty) → number
new CostEstimator().estimateCost(nColors, nConstraints) → { flops, memBytes, estimatedMs }
                   .isExpensive(nColors, nConstraints) → boolean

// Usage utilities
usageMinWcagAA(usageContext: number) → number     // 0=BodyText→4.5, 1=LargeText→3.0
usageMinApcaLc(usageContext: number) → number     // 0→75, 1→60, 2→45, 3→15
complianceTargetDescription(target: number) → string
```

---

## 4. Materials: Physics

### Sprint 1 — Thin-Film Optics

```js
import { ThinFilm, getThinFilmPresets, findDominantWavelength,
         calculateArCoatingThickness } from 'momoto-wasm';

// 12 presets: soapBubbleThin/Medium/Thick, oilThin/Medium/Thick,
//             arCoating, oxideThin/Medium/Thick, beetleShell, nacre
ThinFilm.soapBubbleMedium()
new ThinFilm(nFilm, thicknessNm)

film.reflectance(λNm, nSubstrate, cosTheta) → number
film.reflectanceRgb(nSubstrate, cosTheta) → Float64Array [r,g,b]
film.toCssSoapBubble(sizePercent) → CSS string
film.toCssOilSlick() → CSS gradient
film.toCssIridescentGradient(nSubstrate, baseColor) → CSS string
```

### Sprint 2 — Chromatic Dispersion & Metals

```js
import { CauchyDispersion, SellmeierDispersion,
         ComplexIOR, SpectralComplexIOR, DrudeParams,
         f0FromIor, getMetalPresets, getDrudeMetalPresets } from 'momoto-wasm';

CauchyDispersion.bk7()    // 7 glass presets + Abbe numbers
SellmeierDispersion.bk7() // 5 presets (higher accuracy)

ComplexIOR.gold()          // 12 metal presets (real-data n,k)
ior.reflectanceAt(cosTheta), ior.f0(), ior.isConductor(), ior.penetrationDepthNm(λNm)

SpectralComplexIOR.gold()  // 12 presets, wavelength-resolved
spIor.f0Rgb(), spIor.fresnelRgb(cosTheta), spIor.toCssSurface(roughness)

DrudeParams.aluminum()     // 7 presets, temperature-dependent
drude.atTemperature(K) → DrudeParams
drude.complexIor(λNm, K), drude.spectralIor(K)

f0FromIor(ior) → number    // ((n-1)/(n+1))²
```

### Sprint 3 — Mie Scattering

```js
import { MieParams, DynamicMieParams,
         henyeyGreenstein, doubleHenyeyGreenstein,
         rayleighPhase, rayleighIntensityRgb,
         getMieParticlePresets, getMieDynamicPresets,
         scatteringColorFromRadius } from 'momoto-wasm';

// 9 static presets: fineDust, coarseDust, fogSmall(2µm), fogLarge(10µm),
//                   cloud(8µm), mist(3µm), smoke(0.3µm), milkGlobule(2.5µm), pollen(25µm)
MieParams.fogSmall()
mp.asymmetryFactor(), mp.sizeParameter(λNm)

// 8 dynamic presets: stratocumulus, fog, smoke, milk, dust,
//                    iceCrystals, condensingFog, evaporatingMist
DynamicMieParams.condensingFog()
dyn.scatteringColorAtTime(t, λNm) → [r,g,b]
dyn.toCssFog(), dyn.toCssSmoke()

henyeyGreenstein(cosTheta, g), rayleighIntensityRgb(cosTheta) → [r,g,b]
scatteringColorFromRadius(radiusUm, nParticle) → [r,g,b]
```

### Sprint 4 — Multilayer Transfer Matrix

```js
import { FilmLayer, TransferMatrixFilm } from 'momoto-wasm';

FilmLayer.dielectric(n, thicknessNm)
FilmLayer.absorbing(n, k, thicknessNm)

new TransferMatrixFilm(nIncident, nSubstrate)
film.addLayer(n, nm), film.addAbsorbingLayer(n, k, nm)
film.reflectance(λNm, angleDeg, pol)  // pol: 0=S,1=P,2=Average
film.reflectanceRgb(angleDeg, pol) → [r,g,b]
film.toCssStructuralColor(angleDeg) → CSS

// 9 presets: braggMirror, arBroadband, notchFilter,
//            dichroicBlueReflect, dichroicRedReflect,
//            morphoButterfly, beetleShell, nacre, opticalDisc
TransferMatrixFilm.morphoButterfly()
```

### Spectral Pipeline

```js
import { SpectralPipeline, SpectralSignal, EvaluationContext } from 'momoto-wasm';

SpectralSignal.d65Illuminant()     // CIE D65
SpectralSignal.uniformDefault()    // flat unit

sig.toXyz() → [X,Y,Z], sig.toRgb() → [r,g,b]

new EvaluationContext().withAngle(deg).withTemperature(K)

new SpectralPipeline()
  .addThinFilm(film).addMieScattering(params).addGold()
  .evaluate(signal, ctx) → SpectralSignal
  .verifyEnergyConservation() → { passes, maxViolation }
```

### Other Materials

```js
import { cookTorranceBRDF, orenNayarBRDF,
         GlassMaterial, GlassMaterialBuilder, LiquidGlass,
         renderEnhancedCss, renderPremiumCss,
         RefractionParams, calculateRefraction, generateDistortionMap,
         AmbientShadowParams, ElevationTransition, calculateAmbientShadow,
         DielectricBSDF, ConductorBSDF, PBRMaterial, PBRMaterialBuilder,
         deltaE2000, deltaE2000Batch, rgbToLab,
         smoothstep, smootherstep, remap,
         RateLimiter, ExponentialMovingAverage } from 'momoto-wasm';

// PBR BRDFs
cookTorranceBRDF(normal, view, light, roughness, ior, cosTheta) → number
orenNayarBRDF(roughness, normal, view, light) → number

// BSDF presets
DielectricBSDF.glass(), .water(), .diamond(), .frostedGlass()
ConductorBSDF.gold(), .silver(), .copper(), .aluminum(), .chrome()

// Glass
GlassMaterial.frosted().css(bgHex) → CSS string
renderPremiumCss(material, config) → CSS

// Refraction
RefractionParams.frosted()
generateDistortionMap(params, cols, rows) → Float64Array  // cols×rows×4 floats

// Shadows
AmbientShadowParams.elevated()
calculateAmbientShadow(params, bgOklch) → CSS shadow string
elevationDp(dp: number) → CSS

// Color difference
deltaE2000(lab1, lab2) → number
deltaE2000Batch(labPairs) → Float64Array
```

---

## 5. Temporal Materials

```js
import { TemporalMaterial, TemporalThinFilmMaterial, TemporalConductorMaterial,
         temporalDryingPaint, temporalSoapBubble } from 'momoto-wasm';

TemporalMaterial.dryingPaint().evalAtTime(t, cosTheta) → [R,T,A]
TemporalThinFilmMaterial.soapBubble().sampleTimeline(durationS, frames, cosTheta)
TemporalConductorMaterial.heatedGold().evalAtTemperature(K, cosTheta) → [R,T,A]

// Free functions (no allocation)
temporalDryingPaint(t, cosTheta) → Float64Array [R,T,A]
temporalSoapBubble(t, cosTheta) → Float64Array [R,T,A]
```

---

## 6. Procedural Noise

```js
import { ProceduralNoise, variationField, roughnessVariationField } from 'momoto-wasm';

ProceduralNoise.frosted()  // 6 octaves — high-frequency
ProceduralNoise.regular()  // 3 octaves
ProceduralNoise.clear()    // 1 octave — smooth
ProceduralNoise.thick()    // 4 octaves

noise.sample(x, y) → number [0,1]        // deterministic
noise.sampleTiled(x, y, period) → number  // tileable

variationField(baseIor, variation, cols, rows, seed) → Float64Array
roughnessVariationField(baseRoughness, variation, cols, rows, seed) → Float64Array
```

---

## 7. SIREN Neural Network

```js
import { computeSirenCorrection, applySirenCorrection,
         computeSirenCorrectionBatch, sirenMetadata, sirenWeights } from 'momoto-wasm';

// Architecture: [9,16,16,3], 483 params, ω₀=30, seed=421337, activation: sin(ω₀x)
computeSirenCorrection(bgL,bgC,bgH, fgL,fgC,fgH, apcaLc,wcagRatio,quality)
  → { deltaL, deltaC, deltaH }

applySirenCorrection(l,c,h, deltaL,deltaC,deltaH) → Float64Array [L,C,H]
computeSirenCorrectionBatch(inputs: Float64Array) → Float64Array  // multiples of 9
sirenMetadata() → { architecture:[9,16,16,3], totalParams:483, omega0:30 }
sirenWeights() → { W1, B1, W2, B2, W3, B3 }
```

---

## 8. Events & Streaming

```js
import { MomotoEventBus, MomotoEventStream } from 'momoto-wasm';

// Pub/sub
const bus = new MomotoEventBus();
bus.subscribe(cb), bus.subscribeFiltered(categories, cb)
bus.emitProgress(src,pct,msg), bus.emitMetric(src,name,val)
bus.emitError(src,desc), bus.emitCustom(src,json)
bus.subscriberCount(), bus.eventCount(), bus.bufferedEvents()

// SSE-compatible streaming
const stream = MomotoEventStream.fromBus(bus);
stream.poll() → { events, sequence, totalEvents, droppedEvents } | null
stream.push(json)  // standalone mode
stream.pause(), stream.resume(), stream.close()
```

---

## 9. Agent API

```js
import { agentValidatePair, agentValidatePairsBatch,
         agentGetMetrics, agentGetMetricsBatch,
         agentRecommendForeground, agentImproveForeground, agentScorePair,
         agentGetMaterial, agentListMaterials,
         createColorTransition, generateExperience,
         getMomotoIdentity, selfCertify,
         ContractBuilder, AgentExecutor,
         executeWorkflow, createSession, executeWithSession,
         generateReport, listWorkflows } from 'momoto-wasm';

// All functions return JSON strings

agentValidatePair(fg, bg, standard, level) → JSON { passes, ratio, level }
agentGetMetrics(hex) → JSON { hex, oklch, hct, luminance }
agentRecommendForeground(bgHex, context, target) → JSON
agentImproveForeground(fgHex, bgHex, context, target) → JSON

// Contracts
new ContractBuilder()
  .minContrastWcagAA('#07070e').inSrgb().lightnessRange(0.4, 0.9)
  .build() → JSON
agentValidate(colorHex, contractJson) → JSON { passes, violations }

// Workflows
executeWorkflow(workflowJson) → JSON
// { type: "brand_palette"|"accessibility_audit"|"theme_generation", ... }
createSession(configJson) → sessionId
executeWithSession(sessionId, queryJson) → JSON
generateReport(colorsJson, reportType) → JSON
// reportType: "wcag"|"apca"|"cvd"|"full"

// Engine identity
getMomotoIdentity() → JSON { version:"7.0.0", ... }
selfCertify() → JSON { passed, tests, timestamp }
```

---

## Physics Constants

| Constant | Value |
|----------|-------|
| WCAG AA (normal text) | 4.5:1 |
| WCAG AAA (normal text) | 7.0:1 |
| APCA body text | Lc ≥ 75 |
| APCA heading | Lc ≥ 60 |
| APCA MAIN_TRC | 2.4 |
| APCA sRco/sGco/sBco | 0.2126 / 0.7152 / 0.0722 |
| SIREN params | 483 (ω₀=30, seed=421337) |
| Constraint solver | max_iter=500, convergence=1e-4 |
| CAM16 z | z = 1.48 + 0.29 × √n |

---

*Full reference: [docs/API.md](../docs/API.md) | Interactive: [zuclubit.github.io/momoto-ui](https://zuclubit.github.io/momoto-ui/)*
