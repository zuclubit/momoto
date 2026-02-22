# Momoto WASM API Reference

> Complete API documentation for `momoto-wasm` v7.0.0
> Rust library compiled to WebAssembly via wasm-bindgen. 188 documented entries, 280+ callable methods.

**Interactive explorer**: [zuclubit.github.io/momoto-ui](https://zuclubit.github.io/momoto-ui/)
**Machine-readable spec**: [momoto.json](https://zuclubit.github.io/momoto-ui/momoto.json)
**LLM context**: [llms.txt](https://zuclubit.github.io/momoto-ui/llms.txt)

---

## Table of Contents

1. [Initialization](#initialization)
2. [Module: HCT Color Space](#module-hct-color-space)
3. [Module: Core — Color & Luminance](#module-core--color--luminance)
4. [Module: Intelligence — Recommendations](#module-intelligence--recommendations)
5. [Module: Materials — Physics](#module-materials--physics)
   - [Sprint 1: Thin-Film Optics](#sprint-1-thin-film-optics)
   - [Sprint 2: Chromatic Dispersion & Metals](#sprint-2-chromatic-dispersion--metals)
   - [Sprint 3: Mie Scattering](#sprint-3-mie-scattering)
   - [Sprint 4: Multilayer Transfer Matrix](#sprint-4-multilayer-transfer-matrix)
   - [Spectral Pipeline](#spectral-pipeline)
   - [Glass Surface & Rendering](#glass-surface--rendering)
   - [Refraction System](#refraction-system)
   - [Lighting & Shadows](#lighting--shadows)
   - [PBR BRDFs](#pbr-brdfs)
   - [Interpolation](#interpolation)
   - [Color Difference](#color-difference)
6. [Module: Temporal Materials](#module-temporal-materials)
7. [Module: Procedural Noise](#module-procedural-noise)
8. [Module: SIREN Neural Network](#module-siren-neural-network)
9. [Module: Events & Streaming](#module-events--streaming)
10. [Module: Agent API](#module-agent-api)
11. [Flat Array Conventions](#flat-array-conventions)
12. [Physics Constants](#physics-constants)

---

## Initialization

Every page load must call `init()` before using any WASM function:

```js
import init from 'momoto-wasm';
// Named exports: import init, { Color, wcagContrastRatio, ... } from 'momoto-wasm';

await init(); // Loads and instantiates the WASM binary
```

---

## Module: HCT Color Space

Google Material Design 3 perceptual model. CAM16 hue + CIELAB tone. Gamut-safe tonal palettes via binary search.

### Free Functions

```js
hexToHct(hex: string) → Float64Array [hue, chroma, tone]
// hue∈[0,360), chroma≥0, tone∈[0,100]

hctToHex(hue, chroma, tone) → string "#rrggbb"

hctTonalPalette(hue, chroma) → Float64Array
// Returns 39 values: 13 tones × [hue, chroma, tone]
// Standard tones: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100

hctMaxChroma(hue, tone) → number
// Maximum displayable chroma for given hue+tone

hctToOklch(hue, chroma, tone) → Float64Array [L, C, H]
oklchToHct(l, c, h) → Float64Array [hue, chroma, tone]
```

### HCT Class

```js
HCT.fromHex(hex) → HCT
HCT.fromArgb(argb: number) → HCT
hct.toArgb() → number
hct.withTone(tone) → HCT       // binary search to maintain gamut
hct.withChroma(chroma) → HCT
hct.withHue(hue) → HCT
hct.clampToGamut() → HCT
hct.hue, hct.chroma, hct.tone  // getters
```

**Example**:
```js
const [hue, chroma, tone] = hexToHct('#3a7bd5');  // [264.5, 41.2, 50.0]
const palette = hctTonalPalette(hue, chroma);
const tone50hex = hctToHex(palette[0], palette[1], 50);
```

**Key facts**:
- CAM16 z formula: `z = 1.48 + 0.29 × √n` (corrected from literature errors)
- HCT inverse uses binary search on J to guarantee target_Y = y_from_lstar(tone)

---

## Module: Core — Color & Luminance

sRGB/OKLCH/OKLab conversions, WCAG 2.1, APCA-W3 v0.1.9, batch operations.

### Color Class

```js
Color.fromHex(hex: string) → Color
Color.fromRgb(r, g, b) → Color      // r,g,b ∈ [0,255] (integers)
color.toHex() → string
color.r, color.g, color.b           // u8 channel getters
```

### WCAG 2.1

```js
wcagContrastRatio(fg: Color, bg: Color) → number
// Standard formula: (L1+0.05)/(L2+0.05) where L = relative luminance

wcagPasses(ratio, level, isLargeText) → boolean
// level: 0=AA, 1=AAA
// Normal AA=4.5, Normal AAA=7.0
// Large AA=3.0, Large AAA=4.5

wcagLevel(ratio, isLargeText) → string
// Returns "AAA" | "AA" | "AA-Large" | "fail"

isLargeText(fontSizePx, bold) → boolean
// WCAG: ≥18px or (≥14px + bold)
```

### APCA-W3 v0.1.9

```js
apcaContrast(fg: Color, bg: Color) → number
// Returns Lc value (signed). Positive = dark text on light bg.
// MAIN_TRC=2.4, NORM_BG=0.56, NORM_TXT=0.57
// Body text: Lc≥75, Heading: Lc≥60

relativeLuminanceSrgb(color: Color) → number
// WCAG 2.1 relative luminance
relativeLuminanceApca(color: Color) → number
// APCA-specific luminance (BLK_THRS=0.022, BLK_CLMP=1.414)
apcaConstants() → JSON string   // All APCA numeric constants
```

### Batch Operations

```js
relativeLuminanceBatch(colors: Uint8Array) → Float64Array
// Input: Uint8Array [r,g,b, r,g,b, ...] multiples of 3

wcagContrastRatioBatch(pairs: Uint8Array) → Float64Array
// Input: Uint8Array [fg_r,fg_g,fg_b, bg_r,bg_g,bg_b, ...] multiples of 6
```

### Gamma & Math

```js
srgbToLinear(v: number) → number   // gamma decode: v<=0.04045 ? v/12.92 : ((v+0.055)/1.055)^2.4
linearToSrgb(v: number) → number   // gamma encode
```

### OKLab/OKLCH Utilities

```js
oklchToHex(l, c, h) → string
hexToOklch(hex) → Float64Array [L, C, H]
// L∈[0,1], C≥0, H∈[0,360)
```

---

## Module: Intelligence — Recommendations

AI-powered color recommendations, harmony, CVD simulation, constraint solving.

### Color Harmony

```js
generatePalette(baseHex, harmonyType, count) → string[]
// harmonyType: "complementary"|"triadic"|"analogous"|"split_complementary"
//              "tetradic"|"square"|"monochromatic"
// Angles: Complementary=180°, SplitComplementary=±150°, Triadic=120°,
//         Tetradic=90°, Analogous=±30°

generatePaletteFromHex(hex, harmonyType: number) → Float64Array [L,C,H × N]
// harmonyType: 0=Complementary,1=SplitComp,2=Triadic,3=Tetradic,4=Analogous,5=Monochromatic

generateShades(colorHex, count) → string[]
// Perceptual shades light→dark in OKLCH. Typical count: 5–11.

harmonyScore(lchFlat: Float64Array) → number [0,1]
// Input: flat [L,C,H,...] for 2+ colors. Higher = more harmonious.

temperaturePalette(warm: boolean) → Float64Array [L,C,H × 5]
// warm=true → ambers/reds, warm=false → blues/cyans
```

### CVD Simulation (Viénot 1999)

```js
simulateCVD(hex, cvdType) → string "#rrggbb"
// cvdType: "protanopia" | "deuteranopia" | "tritanopia"
// D65 white preserved exactly (row-stochastic matrices, NOT Brettel 1997)

cvdDeltaE(hex, cvdType) → number
// OKLab ΔE between original and simulated. <20=mild, 20–60=moderate, >60=severe

simulateCVDOklch(l, c, h, cvdType) → Float64Array [L,C,H]
// Direct OKLCH simulation, avoids hex conversion overhead
```

**CVD matrices (linear sRGB):**
- Protanopia: [0.567, 0.433, 0; 0.558, 0.442, 0; 0, 0.242, 0.758]
- Deuteranopia: [0.625, 0.375, 0; 0.700, 0.300, 0; 0, 0.300, 0.700]
- Tritanopia: [0.95, 0.05, 0; 0, 0.433, 0.567; 0, 0.475, 0.525]

### Recommendation Engine

```js
new RecommendationEngine()
  .recommendForeground(bg: Color, usage: number, target: number) → Recommendation
  .improveForeground(fg: Color, bg: Color, usage, target) → Recommendation
// usage: 0=BodyText,1=LargeText,2=UIComponent,3=Decorative,4=Logo,5=Disabled
// target: 0=WCAG_AA, 1=WCAG_AAA, 2=APCA_W3, 3=Hybrid

new ExplanationGenerator()
  .explainContrastImprovement(from, to, bg, ...) → RecommendationExplanation
// RecommendationExplanation: toMarkdown(), summary(), benefits(), tradeOffs()

new AdvancedScorer()
  .scoreRecommendation(category, before*, after*, deltas) → AdvancedScore
// AdvancedScore: qualityOverall, impact, effort, confidence, priority,
//               priorityAssessment(), isStrongRecommendation()

new ConvergenceDetector()     // Presets: fast(), highQuality(), neural()
  .update(quality) → status  // status: Converging|Converged|Oscillating|Diverging|Stalled
  .bestQuality() → number
  .iterationCount() → number

new StepSelector()
  .selectStep(gradient: Float64Array, currentPenalty: number) → number
  .lastStep() → number

new CostEstimator()
  .estimateCost(nColors, nConstraints) → { flops, memBytes, estimatedMs }
  .isExpensive(nColors, nConstraints) → boolean
```

### Constraint Solver

```js
solveColorConstraints(lchFlat: Float64Array, constraintsJson: string, maxIterations: number)
  → { colors: number[], converged: boolean, iterations: number, finalPenalty: number, violations: string[] }

// Constraint JSON schema:
// [{ colorIdx, kind, otherIdx?, target? }, ...]
// kinds: "MinContrast"|"MinAPCA"|"HarmonyAngle"|"InGamut"|"LightnessRange"|"ChromaRange"
// max_iterations=500, convergence_threshold=1e-4, finite-difference gradient
```

**Example**:
```js
const result = solveColorConstraints(
  new Float64Array([0.6, 0.18, 265,   0.1, 0.01, 270]),
  JSON.stringify([
    { colorIdx:0, kind:"MinContrast", otherIdx:1, target:4.5 },
    { colorIdx:0, kind:"InGamut" }
  ]),
  200
);
```

### Scoring & Batch

```js
scorePairsBatch(pairs: Float64Array) → Float64Array
// Input multiples of 8: [fg_r,fg_g,fg_b, bg_r,bg_g,bg_b, usage, target, ...]

recommendForegroundBatch(backgrounds: Uint8Array) → Array<Recommendation>
// Input multiples of 5: [bg_r,bg_g,bg_b, usage, target, ...]
```

### Usage Utilities

```js
usageMinWcagAA(usageContext: number) → number   // 4.5 or 3.0
usageMinWcagAAA(usageContext: number) → number  // 7.0 or 4.5
usageMinApcaLc(usageContext: number) → number   // 75|60|45|15
complianceTargetDescription(target: number) → string
// target: 0=WCAG_AA, 1=WCAG_AAA, 2=APCA_W3, 3=Hybrid
```

---

## Module: Materials — Physics

Full Sprint 1–4 physics implementation. All BSDF evaluations guarantee R+T+A=1.0.

---

### Sprint 1: Thin-Film Optics

Airy formula for single-layer thin-film interference, 380–700nm.

```js
// 12 presets:
ThinFilm.soapBubbleThin()    // 300nm
ThinFilm.soapBubbleMedium()  // 450nm
ThinFilm.soapBubbleThick()   // 600nm
ThinFilm.oilThin()           // 100nm
ThinFilm.oilMedium()         // 200nm
ThinFilm.oilThick()          // 400nm
ThinFilm.arCoating()         // λ/4 MgF₂ at 550nm
ThinFilm.oxideThin()         // 50nm SiO₂
ThinFilm.oxideMedium()       // 100nm
ThinFilm.oxideThick()        // 200nm
ThinFilm.beetleShell()       // structural iridescence
ThinFilm.nacre()             // pearl (nacre) layers

// Constructor
new ThinFilm(nFilm: number, thicknessNm: number)

// Physics
film.reflectance(λNm, nSubstrate, cosTheta) → number
film.reflectanceRgb(nSubstrate, cosTheta) → Float64Array [r,g,b]
film.reflectanceSpectrum(nSubstrate, cosTheta) → Float64Array  // 33 values
film.opticalPathDifference(cosTheta) → number   // OPD = 2·n·d·cosθ
film.phaseDifference(λNm, cosTheta) → number    // φ = 2π·OPD/λ
film.maxWavelength(cosTheta) → number           // peak reflectance λ
film.minWavelength(cosTheta) → number           // minimum reflectance λ

// CSS output
film.toCssSoapBubble(sizePercent: number) → string   // CSS gradient
film.toCssOilSlick() → string                         // CSS gradient
film.toCssIridescentGradient(nSubstrate, baseColor) → string

// Utilities
getThinFilmPresets() → string[]     // ["soapBubbleThin", ...]
findDominantWavelength(film, nSubstrate, cosTheta) → number
calculateArCoatingThickness(designLambdaNm, nFilm) → number  // λ/(4n)
```

---

### Sprint 2: Chromatic Dispersion & Metals

```js
// Cauchy dispersion: n(λ) = A + B/λ² + C/λ⁴
// 7 glass presets with Abbe numbers:
CauchyDispersion.crownGlass()   // BK7 equivalent, Vd=64.2
CauchyDispersion.flintGlass()   // Vd=36.4
CauchyDispersion.bk7()
CauchyDispersion.sf11()
CauchyDispersion.f2()
CauchyDispersion.fusedSilica()
CauchyDispersion.calcite()

disp.nAt(λNm) → number
disp.abbeNumber() → number
disp.groupIndex(λNm) → number

// Sellmeier: n²(λ)−1 = Σ Bᵢλ²/(λ²−Cᵢ)
// 5 presets (higher accuracy than Cauchy):
SellmeierDispersion.bk7()
SellmeierDispersion.fk51a()
SellmeierDispersion.fusedSilica()
SellmeierDispersion.calcite()
SellmeierDispersion.sapphire()

disp.nAt(λNm) → number
disp.groupIndex(λNm) → number
disp.groupVelocityDispersion(λNm) → number

getDispersionWavelengths() → Float64Array  // [380, 390, ..., 700] 33 values
```

**Complex IOR (n̂ = n + ik)**

```js
// 12 presets (real-data IOR):
ComplexIOR.gold()      // n=0.17, k=3.5
ComplexIOR.silver()    // n=0.05, k=4.2
ComplexIOR.copper()    // n=0.25, k=2.8
ComplexIOR.iron()
ComplexIOR.nickel()
ComplexIOR.platinum()
ComplexIOR.titanium()
ComplexIOR.chromium()
ComplexIOR.tungsten()
ComplexIOR.aluminum()
ComplexIOR.cobalt()
ComplexIOR.zinc()

ior.reflectanceAt(cosTheta) → number
ior.absorptionAt(λNm) → number
ior.skinDepthNm() → number          // δ = λ/(4πk)
ior.f0() → number                   // ((n-1)²+k²)/((n+1)²+k²)
ior.isConductor() → boolean         // k > 0.1
ior.penetrationDepthNm(λNm) → number

getMetalPresets() → string[]        // 12 metal names
f0FromIor(ior: number) → number     // dielectric F0 = ((n-1)/(n+1))²
```

**SpectralComplexIOR** — wavelength-resolved IOR

```js
// 12 metal presets (gold/silver/copper/aluminum/iron/chromium/titanium/
//                   nickel/platinum/brass/bronze/tungsten)
SpectralComplexIOR.gold()

spIor.nAt(λNm) → number
spIor.kAt(λNm) → number
spIor.reflectanceRgb(cosTheta) → Float64Array [r,g,b]
spIor.colorHex(cosTheta) → string
spIor.f0Rgb() → Float64Array [r,g,b]
spIor.fresnelRgb(cosTheta) → Float64Array [r,g,b]
spIor.fresnelSchlickRgb(cosTheta, f0Rgb) → Float64Array [r,g,b]
spIor.toCssGradient(angleDeg) → string
spIor.toCssSurface(roughness) → string
spIor.red, spIor.green, spIor.blue  // SpectralSignal per channel
```

**DrudeParams** — free-electron model

```js
// 7 presets: gold, silver, copper, aluminum, tungsten, nickel, platinum
DrudeParams.gold()

drude.iorAt(λNm) → { n, k }                      // room temperature
drude.temperatureDependentIor(λNm, tempK) → { n, k }
drude.complexIor(λNm, tempK) → { n, k }           // full Drude at T
drude.spectralIor(tempK) → Float64Array           // [n0,k0,n1,k1,...] 380–700nm
drude.atTemperature(tempK) → DrudeParams          // scaled params for target T

getDrudeMetalPresets() → string[]                 // 7 preset names
```

---

### Sprint 3: Mie Scattering

```js
// MieParams — static particle Mie scattering
// 9 presets:
MieParams.fineDust()      // Rayleigh regime, x~0.3
MieParams.coarseDust()
MieParams.fogSmall()      // 2µm — Mie regime
MieParams.fogLarge()      // 10µm
MieParams.cloud()         // 8µm water droplet → white
MieParams.mist()          // 3µm
MieParams.smoke()         // 0.3µm soot
MieParams.milkGlobule()   // 2.5µm
MieParams.pollen()        // 25µm → geometric regime

new MieParams(radiusUm, nParticle, nMedium)

mp.radiusUm, mp.nParticle, mp.nMedium  // getters
mp.sizeParameter(λNm) → number         // x = 2πr/λ
mp.asymmetryFactor() → number          // Henyey-Greenstein g
mp.scatteringEfficiency(λNm) → number
mp.scatteringCoeff(λNm) → number

getMieParticlePresets() → string[]     // 9 preset names
scatteringColorFromRadius(radiusUm, nParticle) → Float64Array [r,g,b]
getMieLutMemory() → number             // LUT memory in bytes
```

**DynamicMieParams** — animated particle effects

```js
// 8 presets:
DynamicMieParams.stratocumulus()
DynamicMieParams.fog()
DynamicMieParams.smoke()
DynamicMieParams.milk()
DynamicMieParams.dust()
DynamicMieParams.iceCrystals()
DynamicMieParams.condensingFog()
DynamicMieParams.evaporatingMist()

dyn.paramsAtTime(t) → MieParams
dyn.scatteringColorAtTime(t, λNm) → Float64Array [r,g,b]
dyn.toCssFog() → string                // CSS backdrop-filter
dyn.toCssSmoke() → string              // CSS filter

getMieDynamicPresets() → string[]      // 8 preset names
```

**Phase Functions**

```js
henyeyGreenstein(cosTheta, g) → number
// p(θ) = (1-g²) / (4π·(1+g²-2g·cosθ)^1.5)
// g∈[-1,1]: 0=isotropic, >0=forward scatter (fog), <0=backscatter

doubleHenyeyGreenstein(cosTheta, gForward, gBackward, weight) → number
// p = weight·HG(cosθ,gFwd) + (1-weight)·HG(cosθ,gBack)

rayleighPhase(cosTheta) → number
// p(θ) = 3/4·(1+cos²θ)

rayleighEfficiency(sizeParam, relativeIor) → number
// Qscat = (8/3)·x⁴·|K|²

rayleighIntensityRgb(cosTheta) → Float64Array [r,g,b]
// 1/λ⁴ weighting at 650/510/440nm → blue-sky / sunset color
```

---

### Sprint 4: Multilayer Transfer Matrix

Transfer-matrix method (TMM): M = D₀⁻¹ · Π(Dᵢ·Pᵢ·Dᵢ⁻¹) · Dₛ

```js
// FilmLayer — single layer in a TMM stack
FilmLayer.dielectric(n, thicknessNm)
FilmLayer.absorbing(n, k, thicknessNm)
layer.n, layer.k, layer.thicknessNm   // getters

// TransferMatrixFilm — full multilayer stack
new TransferMatrixFilm(nIncident, nSubstrate)
film.addLayer(n, thicknessNm)
film.addAbsorbingLayer(n, k, thicknessNm)

film.reflectance(λNm, angleDeg, pol) → number
// pol: 0=S, 1=P, 2=Average
film.reflectanceRgb(angleDeg, pol) → Float64Array [r,g,b]
film.colorHex(angleDeg, pol) → string
film.transmittance(λNm, angleDeg, pol) → number
film.reflectanceSpectrum(angleDeg, pol) → Float64Array   // 33 values
film.transmittanceSpectrum(pol) → Float64Array
film.toCssStructuralColor(angleDeg) → string  // CSS background-color

// 9 static presets:
TransferMatrixFilm.braggMirror(nH, nL, λNm, pairs)
TransferMatrixFilm.arBroadband(designLambdaNm)
TransferMatrixFilm.notchFilter(centerLambdaNm, bandwidthNm)
TransferMatrixFilm.dichroicBlueReflect()
TransferMatrixFilm.dichroicRedReflect()
TransferMatrixFilm.morphoButterfly()   // Morpho rhetenor lamella stack — structural blue
TransferMatrixFilm.beetleShell()
TransferMatrixFilm.nacre()
TransferMatrixFilm.opticalDisc()
```

**Example — Bragg mirror**:
```js
const mirror = TransferMatrixFilm.braggMirror(2.35, 1.46, 550.0, 5);
const R = mirror.reflectance(550.0, 0.0, 2); // >0.99
console.log(mirror.toCssStructuralColor(0));
```

---

### Spectral Pipeline

Composable physics pipeline — chain multiple optical stages.

```js
// SpectralSignal — spectral power distribution 380–700nm
SpectralSignal.uniformDefault() → SpectralSignal   // flat unit spectrum
SpectralSignal.d65Illuminant() → SpectralSignal    // CIE D65 standard

sig.intensityAt(λNm) → number     // linear interpolation
sig.toXyz() → [X, Y, Z]           // CIE 1931
sig.toRgb() → [r, g, b]           // via XYZ → sRGB
sig.multiply(other) → SpectralSignal
sig.scale(factor) → SpectralSignal
sig.wavelengths → Float64Array

// EvaluationContext — per-frame parameters
new EvaluationContext()
  .withAngle(deg) → self
  .withTemperature(K) → self
  .withStress(Pa) → self
  .withPosition(x, y) → self

// SpectralPipeline — composable stages
new SpectralPipeline()
pipeline.addThinFilm(film: ThinFilm)
pipeline.addDispersion(disp: CauchyDispersion)
pipeline.addMieScattering(params: MieParams)
pipeline.addGold()    // conductor layer
pipeline.addSilver()
pipeline.addCopper()

pipeline.evaluate(signal: SpectralSignal, ctx: EvaluationContext) → SpectralSignal
pipeline.stageCount() → number
pipeline.verifyEnergyConservation() → { passes: boolean, maxViolation: number }
```

**Example**:
```js
const pipeline = new SpectralPipeline();
pipeline.addThinFilm(ThinFilm.soapBubbleMedium());
pipeline.addMieScattering(MieParams.fogSmall());

const ctx = new EvaluationContext().withAngle(30).withTemperature(293);
const result = pipeline.evaluate(SpectralSignal.d65Illuminant(), ctx);
const [r, g, b] = result.toRgb();
```

---

### Glass Surface & Rendering

Apple HIG-inspired glass materials.

```js
// Presets
GlassMaterial.window()             // clear, high-IOR
GlassMaterial.frosted()            // scattered
GlassMaterial.tinted(r, g, b, a)  // tinted glass

// Construction
new GlassMaterial(ior, roughness, tint, opacity)

// Methods
mat.effectiveColor(bgL, bgC, bgH) → oklch
mat.css(bgHex) → string             // backdrop-filter, background, border
mat.cssDark(bgHex) → string         // dark-mode variant
mat.withRoughness(r) → GlassMaterial
mat.withIor(n) → GlassMaterial

// Builder
new GlassMaterialBuilder()
  .ior(1.45)
  .roughness(0.3)
  .tintRgba(r, g, b, a)
  .frosted()
  .build() → GlassMaterial

// LiquidGlass
LiquidGlass.water(), LiquidGlass.honey(), LiquidGlass.mercury()
liquid.css(bgHex) → string

// CSS rendering
CssRenderConfig.standard(), .premium()
renderEnhancedCss(material, config) → string   // backdrop-filter + gradient + shadow
renderPremiumCss(material, config) → string    // multi-layer premium output
```

---

### Refraction System

```js
// 5 presets:
RefractionParams.clear()      // minimal distortion
RefractionParams.frosted()    // strong blur/distortion
RefractionParams.thick()      // high index
RefractionParams.subtle()     // light effect
RefractionParams.highIndex()  // n>2.0

new RefractionParams(index, distortionStrength, chromaticAberration, edgeLensing)
params.index, params.distortionStrength, params.chromaticAberration, params.edgeLensing

calculateRefraction(params, x, y, incidentAngle) → Float64Array [offsetX, offsetY, hueShift, brightnessFactor]
applyRefractionToColor(params, hex, incidentAngle) → string  // refracted hex
generateDistortionMap(params, cols, rows) → Float64Array
// cols×rows×4 floats: [offsetX, offsetY, hueShift, brightness × N²]
// Upload directly as WebGL texture
```

---

### Lighting & Shadows

```js
// LightSource presets
LightSource.defaultKeyLight()    // 45° top-right warm
LightSource.defaultFillLight()   // opposite cool
LightSource.dramaticTopLight()   // 90° above

new LightingEnvironment([keyLight, fillLight])
calculateLighting(material, env) → { diffuse, specular, ambient }
deriveGradient(material, env) → gradient
gradientToCss(gradient) → string

// Shadows (Material Design 0–8 elevation scale)
// 4 presets:
AmbientShadowParams.standard()
AmbientShadowParams.elevated()
AmbientShadowParams.subtle()
AmbientShadowParams.dramatic()

new AmbientShadowParams(blur, spread, opacity, yOffset)

calculateAmbientShadow(params, bgOklch) → string   // CSS box-shadow
calculateMultiScaleAmbient(params, bgOklch) → string
calculateInteractiveShadow(params, bgOklch, pressed) → string

// ElevationTransition presets
ElevationTransition.card()
ElevationTransition.fab()
ElevationTransition.flat()

elevationDp(dp: number) → string         // dp value → CSS shadow
elevationTintOpacity(dp: number) → number // Material Design tint opacity
```

---

### PBR BRDFs

```js
// Cook-Torrance: GGX NDF + Smith G2 + Schlick Fresnel
cookTorranceBRDF(normal, view, light, roughness, ior, cosTheta) → number
// All vectors as [x, y, z] arrays
// Energy conserving: reflectance + absorption ≤ 1

// Oren-Nayar diffuse BRDF
orenNayarBRDF(roughness, normal, view, light) → number
// Generalizes Lambertian with inter-facet masking

// GGX NDF
ggxNDF(nDotH, roughness) → number  // GGX normal distribution function

// BSDF classes
DielectricBSDF.glass(), .water(), .diamond(), .frostedGlass()
ConductorBSDF.gold(), .silver(), .copper(), .aluminum(), .chrome()
ThinFilmBSDF.soapBubble(), .oilOnWater(), .arCoating()
new LambertianBSDF(albedo)
new LayeredBSDF(base, coat)
new PBRMaterial(baseColor, metallic, roughness, ior)
new PBRMaterialBuilder()
  .baseColor(r,g,b).metallic(m).roughness(r).ior(n).build()

// Batch evaluation
evaluateDielectricBatch(materials, angles) → Float64Array  // [R,T,A × N]
evaluateMaterialBatch(materials, contexts) → Float64Array
materialToDominantColor(material) → Float64Array [r,g,b]
```

---

### Interpolation

```js
InterpolationModeEnum  // Linear=0, Smoothstep=1, Smootherstep=2, EaseInOut=3, Step=4

smoothstep(t) → number        // 3t²-2t³
smootherstep(t) → number      // 6t⁵-15t⁴+10t³
easeInOut(t) → number
remap(t, inMin, inMax, outMin, outMax) → number

applyInterpolation(mode: number, t: number) → number
interpolateValues(mode: number, a: number, b: number, t: number) → number
```

### Color Difference

```js
deltaE76(lab1, lab2) → number    // CIE 1976
deltaE94(lab1, lab2) → number    // CIE 1994
deltaE2000(lab1, lab2) → number  // CIEDE2000 (most accurate)
deltaE2000Batch(labPairs) → Float64Array

rgbToLab(r, g, b) → [L*, a*, b*]
labToRgb(L, a, b) → [r, g, b]
```

### Utilities

```js
new FlickerValidator()    // presets: strict(), relaxed()
  .validate(reflectances: Float64Array) → { passes, violations }

new ConstraintValidator()
  .validate(constraint, color) → boolean

new RateLimiter(maxCallsPerSecond)
  .tryAcquire() → boolean
  .timeUntilNextAllowed() → number

new ExponentialMovingAverage(alpha)
  .update(value) → number
  .current() → number
```

---

## Module: Temporal Materials

Time-evolving physics. All BSDF evaluations guarantee R+T+A=1.0.

### High-Level Classes

```js
// TemporalMaterial — dielectric aging
TemporalMaterial.dryingPaint()       // roughness 0.8→0.05, τ=60s
TemporalMaterial.weatheringGlass()   // IOR+roughness increase over hours

mat.evalAtTime(t, cosTheta) → Float64Array [R, T, A]
mat.sampleTimeline(durationS, frames, cosTheta) → Float64Array [t0,R0,t1,R1,...]

// TemporalThinFilmMaterial — iridescent animation
TemporalThinFilmMaterial.soapBubble()
TemporalThinFilmMaterial.oilSlick()

film.evalAtTime(t, cosTheta) → Float64Array [R, T, A]
film.sampleTimeline(durationS, frames, cosTheta) → Float64Array

// TemporalConductorMaterial — heated metal
TemporalConductorMaterial.heatedGold()
TemporalConductorMaterial.heatedCopper()

cond.evalAtTemperature(K, cosTheta) → Float64Array [R, T, A]
```

### Lightweight Classes

```js
TemporalDielectric.dryingPaint(), .weatheringGlass()
TemporalThinFilm.soapBubble()
TemporalConductor.heatedGold()
```

### Free Functions (allocation-free)

```js
temporalDryingPaint(t, cosTheta) → Float64Array [R, T, A]
// Roughness: 0.8→0.05 with τ=60s exponential decay

temporalSoapBubble(t, cosTheta) → Float64Array [R, T, A]
// Thickness oscillates → iridescent cycles
```

---

## Module: Procedural Noise

Improved Perlin fBm. Deterministic seed — same seed always returns same field.

```js
// 4 presets:
ProceduralNoise.frosted()   // 6 octaves, high-frequency
ProceduralNoise.regular()   // 3 octaves
ProceduralNoise.clear()     // 1 octave, smooth
ProceduralNoise.thick()     // 4 octaves

new ProceduralNoise(seed, octaves, persistence, lacunarity)

noise.sample(x, y) → number [0,1]
noise.sampleTiled(x, y, period) → number [0,1]   // tileable variant

// Field generators
variationField(baseIor, variation, cols, rows, seed) → Float64Array
// cols×rows IOR values = baseIor ± variation × noise

roughnessVariationField(baseRoughness, variation, cols, rows, seed) → Float64Array
// cols×rows roughness values for PBR micro-surface textures
```

---

## Module: SIREN Neural Network

Perceptual color correction via sinusoidal representation network.

- Architecture: [9, 16, 16, 3] (input → hidden → hidden → output)
- Parameters: 483 (deterministic, Mulberry32 PRNG seed=421337)
- Activation: sin(ω₀·Wx+b), ω₀=30
- Input: [bgL,bgC,bgH, fgL,fgC,fgH, apcaLc, wcagRatio, quality] (9 features)
- Output: [ΔL, ΔC, ΔH] correction deltas

```js
computeSirenCorrection(bgL, bgC, bgH, fgL, fgC, fgH, apcaLc, wcagRatio, quality)
  → { deltaL: number, deltaC: number, deltaH: number }

applySirenCorrection(l, c, h, deltaL, deltaC, deltaH) → Float64Array [L, C, H]
// Clamps result to valid OKLCH ranges

computeSirenCorrectionBatch(inputs: Float64Array) → Float64Array
// Input: multiples of 9 (one 9-tuple per color pair)
// Output: flat [dL, dC, dH, ...] per pair

sirenMetadata() → {
  architecture: [9, 16, 16, 3],
  totalParams: 483,
  omega0: 30,
  seed: 421337,
  activations: string[],
  inputNormalization: object,
  clampRanges: object
}

sirenWeights() → { W1, B1, W2, B2, W3, B3 }
// W1: 9×16, B1: 16, W2: 16×16, B2: 16, W3: 16×3, B3: 3
```

**Example**:
```js
const corr = computeSirenCorrection(
  0.04, 0.02, 270,   // background OKLCH
  0.537, 0.165, 265, // foreground OKLCH
  58.3, 4.21, 62.0   // apcaLc, wcagRatio, quality
);
const [L, C, H] = applySirenCorrection(
  0.537, 0.165, 265,
  corr.deltaL, corr.deltaC, corr.deltaH
);
```

---

## Module: Events & Streaming

Pub/sub event system + SSE-compatible streaming consumer.

### MomotoEventBus

```js
new MomotoEventBus()
MomotoEventBus.withConfig(bufferSize, maxAgeMs) → MomotoEventBus

// Subscribe
bus.subscribe(callback: (event) => void) → subscriptionId
bus.subscribeFiltered(categories: number[], callback) → subscriptionId
bus.unsubscribe(subscriptionId)

// Emit
bus.emitProgress(source, percent, message)
bus.emitMetric(source, name, value)
bus.emitRecommendation(source, recommendationJson)
bus.emitValidation(source, validationJson)
bus.emitError(source, description)
bus.emitCustom(source, json)
bus.emitJson(eventJson)

// Buffer
bus.bufferedEvents() → Event[]
bus.clearBuffer()

// Stats
bus.subscriberCount() → number
bus.eventCount() → number

// Event categories:
// 0=Progress, 1=Metrics, 2=Recommendation, 3=Validation,
// 4=Error, 5=System, 6=Chart, 7=Heartbeat, 8=Custom
```

### MomotoEventStream

```js
MomotoEventStream.fromBus(bus) → MomotoEventStream
MomotoEventStream.fromBusBatched(bus, batchSize, timeoutMs) → MomotoEventStream
MomotoEventStream.standalone() → MomotoEventStream

stream.poll() → { events, sequence, totalEvents, droppedEvents, count } | null
stream.push(eventJson)      // standalone mode only
stream.flush() → Event[]
stream.shouldFlush() → boolean
stream.pendingCount() → number
stream.totalEvents() → number
stream.droppedEvents() → number
stream.pause()
stream.resume()
stream.close()
stream.stats() → object
stream.state → "Active" | "Paused" | "Closed"
```

**Example**:
```js
const bus = new MomotoEventBus();
const stream = MomotoEventStream.fromBus(bus);

bus.subscribe(e => updateSidebar(e));
bus.emitProgress('engine', 75, 'Analyzing colors…');

// Animation loop:
requestAnimationFrame(function tick() {
  const batch = stream.poll();
  if (batch) batch.events.forEach(handleEvent);
  requestAnimationFrame(tick);
});
```

---

## Module: Agent API

High-level JSON interface over the engine. All functions return JSON strings.

### Validation

```js
agentValidate(colorHex, contractJson) → JSON { passes, violations, metrics }
agentValidatePair(fg, bg, standard, level) → JSON { passes, ratio, level }
// standard: "wcag"|"apca", level: "aa"|"aaa"

agentValidatePairsBatch(pairsJson) → JSON
// pairsJson: [{ fg, bg, standard, level }, ...]
```

### Metrics

```js
agentGetMetrics(colorHex) → JSON { hex, oklch, hct, luminance }
agentGetMetricsBatch(colorsJson) → JSON  // colorsJson: ["#hex1", "#hex2", ...]
```

### Recommendations

```js
agentRecommendForeground(bgHex, context, target) → JSON
agentImproveForeground(fgHex, bgHex, context, target) → JSON
agentScorePair(fgHex, bgHex, context, target) → JSON
// context: 0=BodyText,1=LargeText,2=UIComponent,3=Decorative,4=Logo,5=Disabled
// target: 0=WCAG_AA,1=WCAG_AAA,2=APCA_W3,3=Hybrid
```

### Materials

```js
agentGetMaterial(preset) → JSON { name, ior, roughness, type, cssSnippet }
// preset: "glass"|"frostedGlass"|"water"|"gold"|"silver"|"copper"|"soapBubble"|"oilSlick"|...

agentListMaterials(category?) → JSON  // [{ name, type, description }]
// category: "dielectric"|"conductor"|"thin_film"|"pbr"
```

### Contracts

```js
new ContractBuilder()
  .minContrastWcagAA(against: string)
  .minContrastWcagAAA(against: string)
  .inSrgb()
  .inP3()
  .lightnessRange(min, max)
  .chromaRange(min, max)
  .hueRange(min, max)
  .build() → JSON string
  .buildAndValidate(colorHex) → JSON { passes, violations }
```

### Color Transitions & Experience

```js
createColorTransition(fromHex, toHex, durationMs, easing, frameCount) → JSON
// easing: "easeIn"|"easeOut"|"easeInOut"|"linear"|"step"
// Returns: [{ t, hex, oklch }, ...] frameCount keyframes

generateExperience(preset, primaryHex, backgroundHex) → JSON
// preset: "dashboard"|"landing"|"app"
// Returns: CSS tokens, material params, color roles
```

### Engine Identity

```js
getMomotoIdentity() → JSON { version:"7.0.0", buildId, specVersion, phaseCoverage, major, minor, patch }
selfCertify() → JSON { passed, tests, timestamp }
// Validates WCAG golden vectors, APCA constants, SIREN weights checksum, HCT roundtrip
```

### Low-Level Executor

```js
new AgentExecutor()
  .execute(queryJson) → JSON string
// Accepts any agent query: { action, color, contract, ... }
```

### Workflow Engine

```js
executeWorkflow(workflowJson) → JSON
// workflow types: "brand_palette", "accessibility_audit", "theme_generation"
// Example: { type: "brand_palette", primary: "#3a7bd5", target: "wcag_aa" }

createSession(configJson) → sessionId: string
// config: { mode:"interactive"|"batch", cacheEnabled, maxColors }
// Session expires after 30 min of inactivity

executeWithSession(sessionId, queryJson) → JSON
// Maintains color history and caching across calls

generateReport(colorsJson, reportType) → JSON
// colorsJson: ["#hex1", "#hex2", ...]
// reportType: "wcag"|"apca"|"cvd"|"full"
// Returns: { pairsChecked, passRate, recommendations, details }

listWorkflows() → JSON  // [{ type, description, required }]
```

---

## Flat Array Conventions

| Data type | Float64Array layout |
|-----------|---------------------|
| OKLCH | `[L, C, H]` — L∈[0,1], C≥0, H∈[0,360) |
| HCT | `[hue, chroma, tone]` — tone∈[0,100] |
| RGB | `[r, g, b]` — ∈[0,1] |
| BSDF | `[reflectance, transmittance, absorption]` — sums to 1.0 |
| Tonal palette | 13 HCT triples → 39 values |
| Timeline | `[t₀, R₀, t₁, R₁, …]` — time,reflectance pairs |
| Distortion map | `[offsetX, offsetY, hueShift, brightness × N²]` |
| Refraction result | `[offset_x, offset_y, hue_shift, brightness_factor]` |
| Complex IOR batch | `[n₀, k₀, n₁, k₁, …]` |
| Spectral | 33 values at 380,390,…,700nm |

---

## Physics Constants

### APCA-W3 v0.1.9

| Constant | Value |
|----------|-------|
| MAIN_TRC | 2.4 |
| sRco (red) | 0.2126 |
| sGco (green) | 0.7152 |
| sBco (blue) | 0.0722 |
| BLK_THRS | 0.022 |
| BLK_CLMP | 1.414 |
| LO_CLIP | 0.1 |
| NORM_BG | 0.56 |
| NORM_TXT | 0.57 |
| REV_BG | 0.65 |
| REV_TXT | 0.62 |
| SCALE_NORM | 1.14 |
| SCALE_REV | 1.14 |

### Metal Presets

| Metal | n (550nm) | k (550nm) |
|-------|-----------|-----------|
| Gold | 0.17 | 3.5 |
| Silver | 0.05 | 4.2 |
| Copper | 0.25 | 2.8 |
| Aluminum | 0.15 | 3.5 |
| Iron | 2.94 | 3.08 |
| Chromium | 3.17 | 3.31 |
| Titanium | 2.54 | 3.06 |
| Nickel | 1.97 | 3.74 |
| Platinum | 2.25 | 4.17 |
| Tungsten | 3.18 | 2.93 |

### CVD Matrices (Viénot 1999, linear sRGB)

```
Protanopia:  [0.567, 0.433, 0;   0.558, 0.442, 0;   0,     0.242, 0.758]
Deuteranopia:[0.625, 0.375, 0;   0.700, 0.300, 0;   0,     0.300, 0.700]
Tritanopia:  [0.950, 0.050, 0;   0,     0.433, 0.567; 0,   0.475, 0.525]
```

### SIREN Network

- Architecture: [9, 16, 16, 3]
- Parameters: 483
- ω₀ = 30
- PRNG: Mulberry32, seed=421337
- Activation: sin(ω₀·x)

---

*Generated from Rust source: `momoto/crates/momoto-wasm/src/lib.rs` (7979 lines) + 9 module files.*
*Last updated: February 2026 — v7.0.0*
