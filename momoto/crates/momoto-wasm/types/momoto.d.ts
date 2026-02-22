// Momoto WASM TypeScript Definitions
// Generated: 2026-02-01
// Version: 6.0.0
//
// These types supplement the auto-generated wasm-bindgen types
// and provide complete type safety for JavaScript/TypeScript consumers.

declare module 'momoto-wasm' {
  // ============================================================================
  // Color
  // ============================================================================

  /** RGB color with alpha channel support. */
  export class Color {
    /** Create color from RGB values (0-255). */
    constructor(r: number, g: number, b: number);

    /** Create color from hex string (e.g., "#FF0000" or "FF0000"). */
    static fromHex(hex: string): Color;

    /** Red channel (0-255). */
    readonly r: number;
    /** Green channel (0-255). */
    readonly g: number;
    /** Blue channel (0-255). */
    readonly b: number;
    /** Alpha channel (0.0-1.0). */
    readonly alpha: number;

    /** Convert to hex string. */
    toHex(): string;

    /** Create new color with specified alpha. */
    withAlpha(alpha: number): Color;

    /** Make color lighter by amount (0.0-1.0). */
    lighten(amount: number): Color;
    /** Make color darker by amount (0.0-1.0). */
    darken(amount: number): Color;
    /** Increase saturation by amount. */
    saturate(amount: number): Color;
    /** Decrease saturation by amount. */
    desaturate(amount: number): Color;

    /** Free WASM memory. */
    free(): void;
  }

  // ============================================================================
  // OKLCH Color Space
  // ============================================================================

  /** Perceptually uniform cylindrical color space. */
  export class OKLCH {
    /** Create OKLCH color (L: 0-1, C: 0-0.4, H: 0-360). */
    constructor(l: number, c: number, h: number);

    /** Convert RGB color to OKLCH. */
    static fromColor(color: Color): OKLCH;

    /** Lightness (0.0-1.0). */
    readonly l: number;
    /** Chroma (0.0-~0.4). */
    readonly c: number;
    /** Hue (0.0-360.0). */
    readonly h: number;

    /** Convert to RGB color. */
    toColor(): Color;

    /** Make lighter by delta. */
    lighten(delta: number): OKLCH;
    /** Make darker by delta. */
    darken(delta: number): OKLCH;
    /** Increase chroma by factor. */
    saturate(factor: number): OKLCH;
    /** Decrease chroma by factor. */
    desaturate(factor: number): OKLCH;
    /** Rotate hue by degrees. */
    rotateHue(degrees: number): OKLCH;
    /** Map to sRGB gamut. */
    mapToGamut(): OKLCH;
    /** Calculate Delta E difference. */
    deltaE(other: OKLCH): number;

    /** Interpolate between two OKLCH colors. */
    static interpolate(a: OKLCH, b: OKLCH, t: number, huePath: 'shorter' | 'longer'): OKLCH;

    free(): void;
  }

  // ============================================================================
  // Glass Material
  // ============================================================================

  /** Physical glass material properties. */
  export class GlassMaterial {
    /** Create custom glass material. */
    constructor(
      ior: number,
      roughness: number,
      thickness: number,
      noiseScale: number,
      baseColor: OKLCH,
      edgePower: number
    );

    /** Clear glass preset (very transparent). */
    static clear(): GlassMaterial;
    /** Regular glass preset (Apple-like). */
    static regular(): GlassMaterial;
    /** Thick glass preset (substantial). */
    static thick(): GlassMaterial;
    /** Frosted glass preset (privacy glass). */
    static frosted(): GlassMaterial;
    /** Create a builder for custom materials. */
    static builder(): GlassMaterialBuilder;

    readonly ior: number;
    readonly roughness: number;
    readonly thickness: number;
    readonly noiseScale: number;
    readonly baseColor: OKLCH;
    readonly edgePower: number;

    /** Calculate Blinn-Phong shininess. */
    shininess(): number;
    /** Calculate scattering radius (mm). */
    scatteringRadiusMm(): number;
    /** Calculate translucency (0-1). */
    translucency(): number;
    // REMOVED in v6.0.0: blurAmount() - Use scatteringRadiusMm() instead
    // Migration: const blurPx = scatteringRadiusMm() * (devicePixelRatio * 96 / 25.4);

    /** Evaluate material with context. */
    evaluate(context: EvalMaterialContext): EvaluatedMaterial;

    free(): void;
  }

  /** Builder for custom glass materials. */
  export class GlassMaterialBuilder {
    constructor();

    /** Start from clear preset. */
    presetClear(): GlassMaterialBuilder;
    /** Start from regular preset. */
    presetRegular(): GlassMaterialBuilder;
    /** Start from thick preset. */
    presetThick(): GlassMaterialBuilder;
    /** Start from frosted preset. */
    presetFrosted(): GlassMaterialBuilder;

    /** Set index of refraction (1.0-2.5). */
    ior(ior: number): GlassMaterialBuilder;
    /** Set roughness (0.0-1.0). */
    roughness(roughness: number): GlassMaterialBuilder;
    /** Set thickness in mm. */
    thickness(mm: number): GlassMaterialBuilder;
    /** Set noise scale (0.0-1.0). */
    noiseScale(scale: number): GlassMaterialBuilder;
    /** Set base color tint. */
    baseColor(color: OKLCH): GlassMaterialBuilder;
    /** Set edge power (1.0-4.0). */
    edgePower(power: number): GlassMaterialBuilder;

    /** Build the material. */
    build(): GlassMaterial;

    free(): void;
  }

  // ============================================================================
  // Material Context
  // ============================================================================

  /** Context for material evaluation. */
  export class EvalMaterialContext {
    constructor();

    /** Default context (neutral lighting, light background). */
    static default(): EvalMaterialContext;

    free(): void;
  }

  /** Evaluated material with all optical properties resolved. */
  export class EvaluatedMaterial {
    readonly opacity: number;
    readonly roughness: number;
    readonly metallic: number;
    readonly fresnelF0: number;
    readonly fresnelEdgeIntensity: number;
    readonly scatteringRadiusMm: number;
    readonly thicknessMm: number;
    readonly specularIntensity: number;
    readonly specularShininess: number;

    free(): void;
  }

  // ============================================================================
  // Render Context
  // ============================================================================

  /** Rendering context for CSS output. */
  export class RenderContext {
    constructor(viewportWidth: number, viewportHeight: number, pixelDensity: number);

    /** Desktop preset (1920x1080, 1x density). */
    static desktop(): RenderContext;
    /** Mobile preset (375x667, 2x density). */
    static mobile(): RenderContext;
    /** 4K preset (3840x2160, 1x density). */
    static fourK(): RenderContext;

    readonly viewportWidth: number;
    readonly viewportHeight: number;
    readonly pixelDensity: number;

    free(): void;
  }

  // ============================================================================
  // CSS Backend
  // ============================================================================

  /** CSS rendering backend. */
  export class CssBackend {
    constructor();

    /** Render evaluated material to CSS string. */
    render(material: EvaluatedMaterial, context: RenderContext): string;

    free(): void;
  }

  // ============================================================================
  // Shadow System
  // ============================================================================

  /** Contact shadow configuration parameters. */
  export class ContactShadowParams {
    constructor(darkness: number, blurRadius: number, offsetY: number, spread: number);

    /** Default params (standard glass contact shadow). */
    static default(): ContactShadowParams;
    /** Standard preset. */
    static standard(): ContactShadowParams;
    /** Floating preset (lighter). */
    static floating(): ContactShadowParams;
    /** Grounded preset (heavier). */
    static grounded(): ContactShadowParams;
    /** Subtle preset (barely visible). */
    static subtle(): ContactShadowParams;

    readonly darkness: number;
    readonly blurRadius: number;
    readonly offsetY: number;
    readonly spread: number;

    free(): void;
  }

  /** Calculated contact shadow. */
  export class ContactShadow {
    readonly color: OKLCH;
    readonly blur: number;
    readonly offsetY: number;
    readonly spread: number;
    readonly opacity: number;

    /** Convert to CSS box-shadow string. */
    toCss(): string;

    free(): void;
  }

  /** Elevation shadow result. */
  export class ElevationShadow {
    readonly elevation: number;

    /** Convert to CSS box-shadow string. */
    toCSS(): string;

    free(): void;
  }

  /** Elevation presets (Apple Liquid Glass patterns). */
  export const ElevationPresets: {
    readonly LEVEL_0: number;
    readonly LEVEL_1: number;
    readonly LEVEL_2: number;
    readonly LEVEL_3: number;
    readonly LEVEL_4: number;
    readonly LEVEL_5: number;
    readonly LEVEL_6: number;
  };

  // ============================================================================
  // Metrics
  // ============================================================================

  /** Contrast calculation result. */
  export interface ContrastResult {
    readonly value: number;
    readonly polarity: number;
  }

  /** WCAG 2.1 contrast ratio metric. */
  export class WCAGMetric {
    constructor();
    evaluate(foreground: Color, background: Color): ContrastResult;
    evaluateBatch(foregrounds: Color[], backgrounds: Color[]): ContrastResult[];
    static passes(ratio: number, level: 'AA' | 'AAA', isLargeText: boolean): boolean;
    free(): void;
  }

  /** APCA-W3 contrast metric. */
  export class APCAMetric {
    constructor();
    evaluate(foreground: Color, background: Color): ContrastResult;
    evaluateBatch(foregrounds: Color[], backgrounds: Color[]): ContrastResult[];
    free(): void;
  }

  // ============================================================================
  // High-Level Functions
  // ============================================================================

  /** Evaluate material and render to CSS in one call. */
  export function evaluateAndRenderCss(
    glass: GlassMaterial,
    materialContext: EvalMaterialContext,
    renderContext: RenderContext
  ): string;

  /** Batch evaluate and render multiple materials to CSS (more efficient). */
  export function evaluateAndRenderCssBatch(
    materials: GlassMaterial[],
    materialContexts: EvalMaterialContext[],
    renderContext: RenderContext
  ): string[];

  /** Batch evaluate with individual render contexts. */
  export function evaluateAndRenderCssBatchFull(
    materials: GlassMaterial[],
    materialContexts: EvalMaterialContext[],
    renderContexts: RenderContext[]
  ): string[];

  /** Calculate contact shadow for glass element. */
  export function calculateContactShadow(
    params: ContactShadowParams,
    background: OKLCH,
    glassDepth: number
  ): ContactShadow;

  /** Calculate elevation shadow for glass element. */
  export function calculateElevationShadow(
    elevation: number,
    background: OKLCH,
    glassDepth: number
  ): ElevationShadow;

  // ============================================================================
  // Gamma Correction Utilities (v6.0.0)
  // ============================================================================

  /**
   * sRGB gamma correction utilities.
   *
   * The sRGB color space uses a non-linear transfer function (gamma curve)
   * that approximates human perception. These utilities convert between
   * gamma-corrected sRGB and linear RGB values.
   *
   * @example
   * ```typescript
   * // sRGB mid-gray (0.5) is NOT 0.5 in linear light!
   * const linear = Gamma.srgbToLinear(0.5);
   * console.log(linear); // ~0.214
   * ```
   */
  export class Gamma {
    /**
     * Convert sRGB channel value (0.0-1.0) to linear RGB.
     * @param channel sRGB channel value (0.0 to 1.0)
     * @returns Linear RGB channel value
     */
    static srgbToLinear(channel: number): number;

    /**
     * Convert linear RGB channel value (0.0-1.0) to sRGB.
     * @param channel Linear RGB channel value (0.0 to 1.0)
     * @returns sRGB channel value
     */
    static linearToSrgb(channel: number): number;

    /**
     * Convert RGB array from sRGB to linear.
     * @param r Red channel (0.0 to 1.0)
     * @param g Green channel (0.0 to 1.0)
     * @param b Blue channel (0.0 to 1.0)
     * @returns Float64Array with linear RGB values
     */
    static rgbToLinear(r: number, g: number, b: number): Float64Array;

    /**
     * Convert RGB array from linear to sRGB.
     * @param r Red channel (0.0 to 1.0)
     * @param g Green channel (0.0 to 1.0)
     * @param b Blue channel (0.0 to 1.0)
     * @returns Float64Array with sRGB values
     */
    static linearToRgb(r: number, g: number, b: number): Float64Array;
  }

  // ============================================================================
  // Gamut Boundary Utilities (v6.0.0)
  // ============================================================================

  /**
   * sRGB gamut boundary estimation utilities.
   *
   * Provides fast estimation of maximum achievable chroma for any
   * lightness/hue combination within the sRGB color gamut.
   *
   * @example
   * ```typescript
   * // Estimate max chroma for cyan at mid-lightness
   * const maxChroma = GamutUtils.estimateMaxChroma(0.5, 180.0);
   * console.log(maxChroma); // ~0.06
   *
   * // Check if a color is displayable
   * const isDisplayable = GamutUtils.isInGamut(0.7, 0.15, 180.0);
   * ```
   */
  export class GamutUtils {
    /**
     * Estimate maximum chroma for given lightness and hue.
     * @param l Lightness (0.0 to 1.0)
     * @param h Hue (0.0 to 360.0 degrees)
     * @returns Estimated maximum chroma within sRGB gamut
     */
    static estimateMaxChroma(l: number, h: number): number;

    /**
     * Check if OKLCH color is approximately within sRGB gamut.
     * @param l Lightness (0.0 to 1.0)
     * @param c Chroma
     * @param h Hue (0.0 to 360.0 degrees)
     * @returns true if color is within sRGB gamut (with 10% tolerance)
     */
    static isInGamut(l: number, c: number, h: number): boolean;

    /**
     * Map OKLCH color to sRGB gamut by reducing chroma.
     * Preserves lightness and hue while finding maximum achievable chroma.
     * @param l Lightness (0.0 to 1.0)
     * @param c Chroma
     * @param h Hue (0.0 to 360.0 degrees)
     * @returns OKLCH color with chroma reduced to fit within sRGB gamut
     */
    static mapToGamut(l: number, c: number, h: number): OKLCH;
  }

  // ============================================================================
  // Luminance Utilities (v6.0.0)
  // ============================================================================

  /**
   * Relative luminance calculation utilities.
   *
   * Provides luminance calculations for both WCAG (sRGB) and APCA methods.
   * Luminance is a measure of perceived brightness, essential for contrast
   * calculations and accessibility compliance.
   *
   * @example
   * ```typescript
   * const color = new Color(255, 0, 0); // Red
   * const y = LuminanceUtils.relativeLuminanceSrgb(color);
   * console.log(y); // ~0.2126 (red channel coefficient)
   * ```
   */
  export class LuminanceUtils {
    /**
     * Calculate relative luminance using WCAG/sRGB coefficients.
     * Uses ITU-R BT.709 coefficients: 0.2126 R + 0.7152 G + 0.0722 B
     * @param color The color to calculate luminance for
     * @returns Relative luminance (0.0 to 1.0)
     */
    static relativeLuminanceSrgb(color: Color): number;

    /**
     * Calculate relative luminance using APCA coefficients.
     * Uses APCA-specific coefficients for better perceptual accuracy.
     * @param color The color to calculate luminance for
     * @returns Relative luminance (0.0 to 1.0)
     */
    static relativeLuminanceApca(color: Color): number;
  }

  // ============================================================================
  // Intelligence Types (v6.0.0)
  // ============================================================================

  /** Usage context for color recommendations. */
  export enum UsageContext {
    BodyText = 'BodyText',
    LargeText = 'LargeText',
    Interactive = 'Interactive',
    Decorative = 'Decorative',
    IconsGraphics = 'IconsGraphics',
    Disabled = 'Disabled',
  }

  /** Compliance target level. */
  export enum ComplianceTarget {
    WCAG_AA = 'WCAG_AA',
    WCAG_AAA = 'WCAG_AAA',
    APCA = 'APCA',
    Hybrid = 'Hybrid',
  }

  /** Context for intelligent color recommendations. */
  export class RecommendationContext {
    constructor(usage: UsageContext, target: ComplianceTarget);
    static bodyText(): RecommendationContext;
    static largeText(): RecommendationContext;
    static interactive(): RecommendationContext;
    free(): void;
  }

  /** Quality score for a color combination. */
  export interface QualityScore {
    readonly overall: number;
    readonly compliance: number;
    readonly perceptual: number;
    readonly appropriateness: number;
  }

  /** Quality scorer for evaluating color combinations. */
  export class QualityScorer {
    constructor();
    score(foreground: Color, background: Color, context: RecommendationContext): QualityScore;
    free(): void;
  }

  // ============================================================================
  // Glass Physics - Thin Film Interference (v6.0.0)
  // ============================================================================

  /**
   * Single-layer thin film for iridescent effects.
   *
   * Models optical interference from thin coatings like soap bubbles,
   * oil slicks, and anti-reflection coatings.
   *
   * @example
   * ```typescript
   * const film = ThinFilm.soapBubbleThin();
   * const color = film.reflectanceRgb(45.0);
   * console.log(color); // [r, g, b] values
   * ```
   */
  export class ThinFilm {
    /** Create thin film with refractive index and thickness (nm). */
    constructor(nFilm: number, thicknessNm: number);

    /** Thin soap bubble preset (~100nm). */
    static soapBubbleThin(): ThinFilm;
    /** Medium soap bubble preset (~200nm). */
    static soapBubbleMedium(): ThinFilm;
    /** Thick soap bubble preset (~400nm). */
    static soapBubbleThick(): ThinFilm;
    /** Oil slick preset. */
    static oilSlick(): ThinFilm;
    /** Anti-reflection coating preset. */
    static arCoating(): ThinFilm;

    readonly nFilm: number;
    readonly thicknessNm: number;

    /** Calculate reflectance for wavelength at angle. */
    reflectance(wavelengthNm: number, angleDeg: number): number;
    /** Calculate RGB reflectance at angle. */
    reflectanceRgb(angleDeg: number): Float64Array;
    /** Generate CSS iridescent gradient. */
    toCssGradient(): string;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Chromatic Dispersion (v6.0.0)
  // ============================================================================

  /**
   * Cauchy dispersion model for wavelength-dependent IOR.
   *
   * Simple polynomial model: n(λ) = A + B/λ² + C/λ⁴
   * Accurate for visible spectrum in most glasses.
   */
  export class CauchyDispersion {
    /** Create Cauchy model with A, B, C coefficients. */
    constructor(a: number, b: number, c: number);

    /** Crown glass preset (low dispersion). */
    static crownGlass(): CauchyDispersion;
    /** Flint glass preset (high dispersion). */
    static flintGlass(): CauchyDispersion;
    /** Fused silica preset. */
    static fusedSilica(): CauchyDispersion;
    /** Polycarbonate preset. */
    static polycarbonate(): CauchyDispersion;

    /** Calculate IOR at wavelength (nm). */
    ior(wavelengthNm: number): number;
    /** Calculate RGB IOR values. */
    iorRgb(): Float64Array;
    /** Calculate Abbe number (dispersion measure). */
    abbeNumber(): number;

    free(): void;
  }

  /**
   * Sellmeier dispersion model for accurate glass simulation.
   *
   * More accurate than Cauchy for wide wavelength range.
   * Uses resonance-based formula with B/C coefficient pairs.
   */
  export class SellmeierDispersion {
    /** Create Sellmeier model with B1-3 and C1-3 coefficients. */
    constructor(b1: number, c1: number, b2: number, c2: number, b3: number, c3: number);

    /** BK7 optical glass preset. */
    static bk7(): SellmeierDispersion;
    /** Fused silica preset. */
    static fusedSilica(): SellmeierDispersion;
    /** Sapphire preset. */
    static sapphire(): SellmeierDispersion;
    /** Diamond preset. */
    static diamond(): SellmeierDispersion;

    /** Calculate IOR at wavelength (nm). */
    ior(wavelengthNm: number): number;
    /** Calculate RGB IOR values. */
    iorRgb(): Float64Array;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Complex IOR for Metals (v6.0.0)
  // ============================================================================

  /**
   * Complex index of refraction for metals.
   *
   * Metals have complex IOR: n + ik where k is extinction coefficient.
   * Required for accurate metallic reflectance calculations.
   */
  export class ComplexIOR {
    /** Create complex IOR with n (real) and k (imaginary). */
    constructor(n: number, k: number);

    /** Gold preset at 550nm. */
    static gold(): ComplexIOR;
    /** Silver preset at 550nm. */
    static silver(): ComplexIOR;
    /** Copper preset at 550nm. */
    static copper(): ComplexIOR;
    /** Aluminum preset at 550nm. */
    static aluminum(): ComplexIOR;
    /** Iron preset at 550nm. */
    static iron(): ComplexIOR;

    readonly n: number;
    readonly k: number;

    /** Calculate Fresnel reflectance at angle. */
    fresnel(angleDeg: number): number;
    /** Calculate normal incidence reflectance. */
    normalReflectance(): number;

    free(): void;
  }

  /**
   * Spectral complex IOR with RGB wavelength data.
   */
  export class SpectralComplexIOR {
    /** Create from RGB complex IOR values. */
    constructor(nRgb: Float64Array, kRgb: Float64Array);

    /** Gold spectral preset. */
    static gold(): SpectralComplexIOR;
    /** Silver spectral preset. */
    static silver(): SpectralComplexIOR;
    /** Copper spectral preset. */
    static copper(): SpectralComplexIOR;

    /** Calculate RGB reflectance at angle. */
    fresnelRgb(angleDeg: number): Float64Array;
    /** Generate CSS metallic gradient. */
    toCssMetallicGradient(): string;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Temperature-Dependent Metals (v6.0.0)
  // ============================================================================

  /**
   * Drude model parameters for temperature-dependent metal IOR.
   */
  export class DrudeParams {
    /** Gold Drude preset. */
    static gold(): DrudeParams;
    /** Silver Drude preset. */
    static silver(): DrudeParams;
    /** Copper Drude preset. */
    static copper(): DrudeParams;

    /** Calculate complex IOR at temperature (Kelvin). */
    iorAtTemperature(temperatureK: number): ComplexIOR;

    free(): void;
  }

  /**
   * Oxidized metal with temperature-dependent patina.
   */
  export class TempOxidizedMetal {
    /** Create oxidized metal. */
    constructor(baseMetal: DrudeParams, oxideThicknessNm: number);

    /** Aged copper preset (green patina). */
    static agedCopper(): TempOxidizedMetal;
    /** Weathered bronze preset. */
    static weatheredBronze(): TempOxidizedMetal;
    /** Rusted iron preset. */
    static rustedIron(): TempOxidizedMetal;

    /** Calculate reflectance at temperature and angle. */
    reflectance(temperatureK: number, angleDeg: number): Float64Array;
    /** Generate CSS patina gradient. */
    toCssPatina(): string;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Mie Scattering (v6.0.0)
  // ============================================================================

  /**
   * Mie scattering parameters for particles.
   *
   * Models light scattering from particles (fog, smoke, milk, etc.)
   * with size-dependent phase functions.
   */
  export class MieParams {
    /** Create Mie params with particle radius (μm) and medium IOR. */
    constructor(radiusUm: number, particleIor: number, mediumIor: number);

    /** Fog preset (water droplets ~10μm). */
    static fog(): MieParams;
    /** Mist preset (smaller droplets ~2μm). */
    static mist(): MieParams;
    /** Smoke preset (soot particles ~0.1μm). */
    static smoke(): MieParams;
    /** Milk preset (fat globules ~1μm). */
    static milk(): MieParams;
    /** Opal preset (silica spheres ~0.3μm). */
    static opal(): MieParams;

    /** Calculate phase function at angle. */
    phase(angleDeg: number): number;
    /** Calculate RGB scattering at angle. */
    scatterRgb(angleDeg: number): Float64Array;
    /** Calculate asymmetry parameter g. */
    asymmetryG(): number;

    free(): void;
  }

  /**
   * Dynamic Mie scattering with polydisperse particles.
   */
  export class DynamicMieParams {
    /** Create dynamic Mie with mean radius and size distribution. */
    constructor(meanRadiusUm: number, stdDevUm: number, particleIor: number);

    /** Polydisperse fog preset. */
    static fog(): DynamicMieParams;
    /** Turbulent smoke preset. */
    static smoke(): DynamicMieParams;

    /** Calculate ensemble phase function. */
    ensemblePhase(angleDeg: number): number;
    /** Generate CSS fog effect. */
    toCssFogEffect(): string;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Advanced Thin Film (v6.0.0)
  // ============================================================================

  /**
   * Single layer in a multilayer thin film stack.
   */
  export class FilmLayer {
    /** Create film layer with IOR and thickness. */
    constructor(ior: number, thicknessNm: number);

    readonly ior: number;
    readonly thicknessNm: number;

    free(): void;
  }

  /**
   * Transfer matrix method for multilayer thin films.
   *
   * Accurate simulation of Bragg mirrors, anti-reflection coatings,
   * and complex interference structures.
   */
  export class TransferMatrixFilm {
    /** Create from array of film layers. */
    constructor(layers: FilmLayer[], substrateIor: number);

    /** Morpho butterfly wing preset (structural color). */
    static morphoWing(): TransferMatrixFilm;
    /** Bragg mirror preset (high reflectivity). */
    static braggMirror(): TransferMatrixFilm;
    /** Multi-layer AR coating preset. */
    static arCoatingMultilayer(): TransferMatrixFilm;

    /** Calculate reflectance at wavelength and angle. */
    reflectance(wavelengthNm: number, angleDeg: number): number;
    /** Calculate RGB reflectance at angle. */
    reflectanceRgb(angleDeg: number): Float64Array;
    /** Find peak wavelength for structural color. */
    findPeakWavelength(): number;
    /** Generate CSS structural color. */
    toCssStructuralColor(): string;

    free(): void;
  }

  /**
   * Dynamic thin film with physical deformations.
   */
  export class DynamicFilmLayer {
    /** Create dynamic layer with thickness variation. */
    constructor(baseIor: number, baseThicknessNm: number, variation: number);

    free(): void;
  }

  /**
   * Dynamic thin film stack with time-varying properties.
   */
  export class DynamicThinFilmStack {
    /** Create dynamic stack from layers. */
    constructor(layers: DynamicFilmLayer[]);

    /** Compute iridescence map for surface area. */
    computeIridescenceMap(width: number, height: number, time: number): Float64Array;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Spectral Pipeline (v6.0.0)
  // ============================================================================

  /**
   * Spectral signal with wavelength-dependent values.
   */
  export class SpectralSignal {
    /** Create empty spectral signal. */
    constructor();

    /** Number of wavelength samples. */
    readonly length: number;

    /** Get value at wavelength index. */
    get(index: number): number;
    /** Set value at wavelength index. */
    set(index: number, value: number): void;
    /** Convert to RGB. */
    toRgb(): Float64Array;

    free(): void;
  }

  /**
   * Spectral evaluation context.
   */
  export class EvaluationContext {
    /** Create evaluation context. */
    constructor(angleDeg: number, temperatureK: number);

    /** Default context (45° angle, room temperature). */
    static default(): EvaluationContext;

    readonly angleDeg: number;
    readonly temperatureK: number;

    free(): void;
  }

  /**
   * Unified spectral rendering pipeline.
   *
   * Processes materials through multiple physics stages
   * without RGB intermediate conversion for accuracy.
   */
  export class SpectralPipeline {
    /** Create pipeline with stages. */
    constructor();

    /** Add thin film stage. */
    addThinFilmStage(film: ThinFilm): SpectralPipeline;
    /** Add dispersion stage. */
    addDispersionStage(dispersion: CauchyDispersion): SpectralPipeline;
    /** Add Mie scattering stage. */
    addMieStage(mie: MieParams): SpectralPipeline;

    /** Evaluate pipeline to RGB. */
    evaluateRgb(context: EvaluationContext): Float64Array;
    /** Evaluate pipeline to spectral signal. */
    evaluateSpectral(context: EvaluationContext): SpectralSignal;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Batch Evaluation (v6.0.0)
  // ============================================================================

  /**
   * Batch material input for bulk evaluation.
   */
  export class BatchMaterialInput {
    /** Create batch input. */
    constructor(
      ior: number,
      roughness: number,
      absorption: number,
      thickness: number
    );

    free(): void;
  }

  /**
   * Batch evaluation result.
   */
  export class BatchResult {
    /** Get Fresnel normal incidence values. */
    getFresnelNormal(): Float64Array;
    /** Get Fresnel grazing angle values. */
    getFresnelGrazing(): Float64Array;
    /** Get transmittance values. */
    getTransmittance(): Float64Array;
    /** Get specular intensity values. */
    getSpecular(): Float64Array;

    free(): void;
  }

  /**
   * High-performance batch evaluator.
   *
   * Evaluates multiple materials simultaneously for 7-10x speedup.
   */
  export class BatchEvaluator {
    /** Create batch evaluator with LUT acceleration. */
    constructor();

    /** Evaluate batch of materials. */
    evaluate(inputs: BatchMaterialInput[]): BatchResult;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Context System (v6.0.0)
  // ============================================================================

  /**
   * Lighting context for material evaluation.
   */
  export class LightingContext {
    /** Create lighting context. */
    constructor(intensity: number, temperatureK: number, direction: Float64Array);

    /** Neutral studio lighting preset. */
    static neutralStudio(): LightingContext;
    /** Warm indoor lighting preset. */
    static warmIndoor(): LightingContext;
    /** Cool daylight preset. */
    static coolDaylight(): LightingContext;

    free(): void;
  }

  /**
   * Background context for adaptive materials.
   */
  export class BackgroundContext {
    /** Create background context. */
    constructor(color: OKLCH, isDark: boolean);

    /** Light background preset. */
    static light(): BackgroundContext;
    /** Dark background preset. */
    static dark(): BackgroundContext;

    free(): void;
  }

  /**
   * View context for angle-dependent effects.
   */
  export class ViewContext {
    /** Create view context with angle. */
    constructor(angleDeg: number);

    /** Normal incidence (0°) preset. */
    static normal(): ViewContext;
    /** Oblique angle (45°) preset. */
    static oblique(): ViewContext;
    /** Grazing angle (75°) preset. */
    static grazing(): ViewContext;

    readonly angleDeg: number;

    free(): void;
  }

  /**
   * Combined material evaluation context.
   */
  export class MaterialContext {
    /** Create full material context. */
    constructor(
      lighting: LightingContext,
      background: BackgroundContext,
      view: ViewContext
    );

    /** Default context preset. */
    static default(): MaterialContext;

    free(): void;
  }

  // ============================================================================
  // Glass Physics - Fresnel Functions (v6.0.0)
  // ============================================================================

  /** Calculate Fresnel reflectance using Schlick's approximation. */
  export function fresnelSchlick(f0: number, cosTheta: number): number;

  /** Calculate full Fresnel equations (s and p polarization). */
  export function fresnelFull(n1: number, n2: number, cosTheta: number): { rs: number; rp: number };

  /** Calculate Brewster's angle in degrees. */
  export function brewsterAngle(n1: number, n2: number): number;

  /** Fast Fresnel lookup (LUT-accelerated). */
  export function fresnelFast(ior: number, cosTheta: number): number;

  /** Generate CSS Fresnel gradient. */
  export function generateFresnelGradientCss(f0: number, isDark: boolean): string;

  // ============================================================================
  // Glass Physics - Blinn-Phong Functions (v6.0.0)
  // ============================================================================

  /** Calculate Blinn-Phong specular highlight. */
  export function blinnPhongSpecular(
    lightDir: Float64Array,
    viewDir: Float64Array,
    normal: Float64Array,
    shininess: number
  ): number;

  /** Convert roughness to Blinn-Phong shininess. */
  export function roughnessToShininess(roughness: number): number;

  /** Generate CSS specular highlight. */
  export function toCssSpecularHighlight(
    intensity: number,
    shininess: number,
    lightAngle: number
  ): string;

  // ============================================================================
  // Glass Physics - Perceptual Loss (v6.0.0)
  // ============================================================================

  /** Convert RGB to LAB color space. */
  export function rgbToLab(r: number, g: number, b: number): Float64Array;

  /** Convert LAB to RGB color space. */
  export function labToRgb(l: number, a: number, b: number): Float64Array;

  /** Calculate Delta E 76 color difference. */
  export function deltaE76(lab1: Float64Array, lab2: Float64Array): number;

  /** Calculate Delta E 2000 color difference (perceptually uniform). */
  export function deltaE2000(lab1: Float64Array, lab2: Float64Array): number;

  // ============================================================================
  // Module Initialization
  // ============================================================================

  /** Initialize the WASM module. Must be called before using any other exports. */
  export default function init(): Promise<void>;
}
