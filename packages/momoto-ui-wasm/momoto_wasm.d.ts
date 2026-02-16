/* tslint:disable */
/* eslint-disable */

export class APCAMetric {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a new APCA metric.
   */
  constructor();
  /**
   * Evaluate APCA contrast (Lc value) between foreground and background.
   *
   * Returns Lc value:
   * - Positive = dark text on light background
   * - Negative = light text on dark background
   * - Near zero = insufficient contrast
   */
  evaluate(foreground: Color, background: Color): ContrastResult;
  /**
   * Evaluate APCA contrast for multiple color pairs (faster than calling evaluate in a loop).
   *
   * # Arguments
   *
   * * `foregrounds` - Array of foreground colors
   * * `backgrounds` - Array of background colors (must match length)
   *
   * # Returns
   *
   * Array of APCA results with Lc values and polarities
   */
  evaluateBatch(foregrounds: Color[], backgrounds: Color[]): ContrastResult[];
}

export class BackgroundContext {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * White background preset
   */
  static white(): BackgroundContext;
  /**
   * Black background preset
   */
  static black(): BackgroundContext;
  /**
   * Gray background preset
   */
  static gray(): BackgroundContext;
  /**
   * Colorful background preset
   */
  static colorful(): BackgroundContext;
  /**
   * Sky background preset
   */
  static sky(): BackgroundContext;
}

export class BatchEvaluator {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create new batch evaluator with default context
   */
  constructor();
  /**
   * Create batch evaluator with custom context
   */
  static withContext(context: MaterialContext): BatchEvaluator;
  /**
   * Evaluate batch of materials
   *
   * Returns result object with arrays for each property.
   * This is 7-10x faster than evaluating materials individually
   * when called from JavaScript (reduces JS↔WASM crossings).
   */
  evaluate(input: BatchMaterialInput): BatchResult;
  /**
   * Update context
   */
  setContext(context: MaterialContext): void;
}

export class BatchMaterialInput {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create new empty batch input
   */
  constructor();
  /**
   * Add a material to the batch
   *
   * # Arguments
   *
   * * `ior` - Index of refraction
   * * `roughness` - Surface roughness (0-1)
   * * `thickness` - Thickness in mm
   * * `absorption` - Absorption coefficient per mm
   */
  push(ior: number, roughness: number, thickness: number, absorption: number): void;
  /**
   * Get number of materials in batch
   */
  len(): number;
  /**
   * Check if batch is empty
   */
  isEmpty(): boolean;
}

export class BatchResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get opacity array
   */
  getOpacity(): Float64Array;
  /**
   * Get blur array
   */
  getBlur(): Float64Array;
  /**
   * Get Fresnel normal incidence array
   */
  getFresnelNormal(): Float64Array;
  /**
   * Get Fresnel grazing angle array
   */
  getFresnelGrazing(): Float64Array;
  /**
   * Get transmittance array
   */
  getTransmittance(): Float64Array;
  /**
   * Number of materials evaluated
   */
  readonly count: number;
}

/**
 * Blur intensity levels matching Apple HIG.
 */
export enum BlurIntensity {
  /**
   * No blur (0px)
   */
  None = 0,
  /**
   * Light blur (10px)
   */
  Light = 1,
  /**
   * Medium blur (20px)
   */
  Medium = 2,
  /**
   * Heavy blur (30px)
   */
  Heavy = 3,
  /**
   * Extra heavy blur (40px)
   */
  ExtraHeavy = 4,
}

export class Color {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a color from RGB values (0-255).
   */
  constructor(r: number, g: number, b: number);
  /**
   * Create a color from hex string (e.g., "#FF0000" or "FF0000").
   */
  static fromHex(hex: string): Color;
  /**
   * Convert to hex string (e.g., "#FF0000").
   */
  toHex(): string;
  /**
   * Create a new Color with the specified alpha (opacity) value.
   *
   * # Arguments
   * * `alpha` - Alpha value (0.0 = transparent, 1.0 = opaque)
   *
   * # Example (JavaScript)
   * ```javascript
   * const color = Color.fromHex("#FF0000");
   * const semiTransparent = color.withAlpha(0.5);
   * console.log(semiTransparent.alpha); // 0.5
   * ```
   */
  withAlpha(alpha: number): Color;
  /**
   * Make the color lighter by the specified amount.
   *
   * # Arguments
   * * `amount` - Lightness increase (0.0 to 1.0)
   */
  lighten(amount: number): Color;
  /**
   * Make the color darker by the specified amount.
   *
   * # Arguments
   * * `amount` - Lightness decrease (0.0 to 1.0)
   */
  darken(amount: number): Color;
  /**
   * Increase the saturation (chroma) of the color.
   *
   * # Arguments
   * * `amount` - Chroma increase
   */
  saturate(amount: number): Color;
  /**
   * Decrease the saturation (chroma) of the color.
   *
   * # Arguments
   * * `amount` - Chroma decrease
   */
  desaturate(amount: number): Color;
  /**
   * Get red channel (0-255).
   */
  readonly r: number;
  /**
   * Get green channel (0-255).
   */
  readonly g: number;
  /**
   * Get blue channel (0-255).
   */
  readonly b: number;
  /**
   * Get the alpha (opacity) value of this color (0.0-1.0).
   *
   * Returns 1.0 for fully opaque colors.
   */
  readonly alpha: number;
}

/**
 * Target compliance level for recommendations.
 */
export enum ComplianceTarget {
  /**
   * WCAG 2.1 Level AA (minimum legal requirement in many jurisdictions)
   */
  WCAG_AA = 0,
  /**
   * WCAG 2.1 Level AAA (enhanced accessibility)
   */
  WCAG_AAA = 1,
  /**
   * APCA-based recommendations (modern perceptual contrast)
   */
  APCA = 2,
  /**
   * Meet both WCAG AA and APCA minimums
   */
  Hybrid = 3,
}

export class ContactShadow {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Convert to CSS box-shadow string.
   *
   * # Example output
   *
   * `"0 0.5px 2.0px 0.0px oklch(0.050 0.003 240.0 / 0.75)"`
   */
  toCss(): string;
  /**
   * Get the shadow color as OKLCH.
   */
  readonly color: OKLCH;
  /**
   * Get blur radius in pixels.
   */
  readonly blur: number;
  /**
   * Get vertical offset in pixels.
   */
  readonly offsetY: number;
  /**
   * Get spread in pixels.
   */
  readonly spread: number;
  /**
   * Get opacity (0.0-1.0).
   */
  readonly opacity: number;
}

export class ContactShadowParams {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create contact shadow params with custom values.
   *
   * # Arguments
   *
   * * `darkness` - Shadow darkness (0.0 = no shadow, 1.0 = pure black)
   * * `blur_radius` - Blur radius in pixels (typically 1-3px for contact shadows)
   * * `offset_y` - Vertical offset in pixels (typically 0-1px)
   * * `spread` - Shadow spread (typically 0 for contact shadows)
   */
  constructor(darkness: number, blur_radius: number, offset_y: number, spread: number);
  /**
   * Create default contact shadow params (standard glass contact shadow).
   */
  static default(): ContactShadowParams;
  /**
   * Standard glass contact shadow preset.
   */
  static standard(): ContactShadowParams;
  /**
   * Floating glass preset (lighter contact shadow).
   */
  static floating(): ContactShadowParams;
  /**
   * Grounded glass preset (heavier contact shadow).
   */
  static grounded(): ContactShadowParams;
  /**
   * Subtle preset (barely visible contact shadow).
   */
  static subtle(): ContactShadowParams;
  readonly darkness: number;
  readonly blurRadius: number;
  readonly offsetY: number;
  readonly spread: number;
}

export class ContrastResult {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * The contrast value.
   *
   * Interpretation depends on metric:
   * - WCAG: 1.0 to 21.0 (contrast ratio)
   * - APCA: -108 to +106 (Lc value, signed)
   */
  value: number;
  /**
   * Polarity of the contrast (APCA only).
   *
   * - 1 = dark on light
   * - -1 = light on dark
   * - 0 = not applicable (WCAG)
   */
  polarity: number;
}

export class CssBackend {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create new CSS backend
   */
  constructor();
  /**
   * Render evaluated material to CSS string
   *
   * # Arguments
   *
   * * `material` - Evaluated material with resolved properties
   * * `context` - Rendering context
   *
   * # Returns
   *
   * CSS string with all material properties, or error
   *
   * # Example (JavaScript)
   *
   * ```javascript
   * const glass = GlassMaterial.frosted();
   * const evalCtx = EvalMaterialContext.new();
   * const evaluated = glass.evaluate(evalCtx);
   *
   * const backend = new CssBackend();
   * const renderCtx = RenderContext.desktop();
   * const css = backend.render(evaluated, renderCtx);
   * console.log(css); // "backdrop-filter: blur(24px); background: ..."
   * ```
   */
  render(material: EvaluatedMaterial, context: RenderContext): string;
  /**
   * Get backend name
   */
  name(): string;
}

/**
 * Material Design 3 elevation levels.
 */
export enum Elevation {
  /**
   * Level 0 - Base surface
   */
  Level0 = 0,
  /**
   * Level 1 - 1dp elevation
   */
  Level1 = 1,
  /**
   * Level 2 - 3dp elevation
   */
  Level2 = 2,
  /**
   * Level 3 - 6dp elevation
   */
  Level3 = 3,
  /**
   * Level 4 - 8dp elevation
   */
  Level4 = 4,
  /**
   * Level 5 - 12dp elevation
   */
  Level5 = 5,
}

export class ElevationPresets {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Flush with surface (no elevation)
   */
  static readonly LEVEL_0: number;
  /**
   * Subtle lift (standard buttons)
   */
  static readonly LEVEL_1: number;
  /**
   * Hover state (interactive lift)
   */
  static readonly LEVEL_2: number;
  /**
   * Floating cards
   */
  static readonly LEVEL_3: number;
  /**
   * Modals, sheets
   */
  static readonly LEVEL_4: number;
  /**
   * Dropdowns, tooltips
   */
  static readonly LEVEL_5: number;
  /**
   * Drag state (maximum separation)
   */
  static readonly LEVEL_6: number;
}

export class ElevationShadow {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Convert to CSS box-shadow string
   */
  toCSS(): string;
  /**
   * Get elevation level used
   */
  readonly elevation: number;
}

export class EvalMaterialContext {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create default evaluation context
   *
   * Uses standard viewing angle (0° = looking straight at surface),
   * neutral background, and default lighting.
   */
  constructor();
  /**
   * Create context with custom background color
   */
  static withBackground(background: OKLCH): EvalMaterialContext;
  /**
   * Create context with custom viewing angle
   *
   * # Arguments
   *
   * * `angle_deg` - Viewing angle in degrees (0° = perpendicular, 90° = edge-on)
   */
  static withViewingAngle(angle_deg: number): EvalMaterialContext;
  /**
   * Get background color
   */
  readonly background: OKLCH;
  /**
   * Get viewing angle in degrees
   */
  readonly viewingAngle: number;
  /**
   * Get ambient light intensity
   */
  readonly ambientLight: number;
  /**
   * Get key light intensity
   */
  readonly keyLight: number;
}

export class EvaluatedMaterial {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Get base color (RGB in linear space)
   */
  baseColor(): Float64Array;
  /**
   * Get final opacity (0.0-1.0)
   */
  readonly opacity: number;
  /**
   * Get Fresnel reflectance at normal incidence (F0)
   */
  readonly fresnelF0: number;
  /**
   * Get edge intensity for Fresnel glow
   */
  readonly fresnelEdgeIntensity: number;
  /**
   * Get index of refraction (if applicable)
   */
  readonly ior: number | undefined;
  /**
   * Get surface roughness (0.0-1.0)
   */
  readonly roughness: number;
  /**
   * Get scattering radius in millimeters (physical property)
   */
  readonly scatteringRadiusMm: number;
  /**
   * Get blur amount in CSS pixels (DEPRECATED)
   *
   * **DEPRECATED:** Use scatteringRadiusMm instead and convert in your renderer.
   * This method assumes 96 DPI and will be removed in v6.0.
   */
  readonly blurPx: number;
  /**
   * Get specular intensity
   */
  readonly specularIntensity: number;
  /**
   * Get specular shininess
   */
  readonly specularShininess: number;
  /**
   * Get thickness in millimeters
   */
  readonly thicknessMm: number;
  /**
   * Get absorption coefficients (RGB)
   */
  readonly absorption: Float64Array;
  /**
   * Get scattering coefficients (RGB)
   */
  readonly scattering: Float64Array;
}

export class GlassLayers {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Top layer: Specular highlights
   */
  readonly highlight: OKLCH;
  /**
   * Middle layer: Base glass tint
   */
  readonly base: OKLCH;
  /**
   * Bottom layer: Shadow for depth
   */
  readonly shadow: OKLCH;
}

export class GlassMaterial {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create glass material with custom properties
   *
   * # Arguments
   *
   * * `ior` - Index of refraction (1.0-2.5, typical glass: 1.5)
   * * `roughness` - Surface roughness (0.0-1.0, 0 = mirror-smooth)
   * * `thickness` - Thickness in millimeters
   * * `noise_scale` - Frosted texture amount (0.0-1.0)
   * * `base_color` - Material tint color
   * * `edge_power` - Fresnel edge sharpness (1.0-4.0)
   */
  constructor(ior: number, roughness: number, thickness: number, noise_scale: number, base_color: OKLCH, edge_power: number);
  /**
   * Create clear glass preset
   * IOR: 1.5, Roughness: 0.05, Thickness: 2mm
   */
  static clear(): GlassMaterial;
  /**
   * Create regular glass preset (Apple-like)
   * IOR: 1.5, Roughness: 0.15, Thickness: 5mm
   */
  static regular(): GlassMaterial;
  /**
   * Create thick glass preset
   * IOR: 1.52, Roughness: 0.25, Thickness: 10mm
   */
  static thick(): GlassMaterial;
  /**
   * Create frosted glass preset
   * IOR: 1.5, Roughness: 0.6, Thickness: 8mm
   */
  static frosted(): GlassMaterial;
  /**
   * Calculate Blinn-Phong shininess from roughness
   */
  shininess(): number;
  /**
   * Calculate scattering radius in millimeters (physical property)
   */
  scatteringRadiusMm(): number;
  /**
   * Calculate blur amount in pixels (DEPRECATED)
   *
   * **DEPRECATED:** Use scatteringRadiusMm() instead and convert in your renderer.
   * This assumes 96 DPI and will be removed in v6.0.
   */
  blurAmount(): number;
  /**
   * Calculate translucency (opacity 0-1)
   */
  translucency(): number;
  /**
   * Evaluate material properties based on context (Phase 3 pipeline)
   *
   * Performs full physics-based evaluation including Fresnel reflectance,
   * Beer-Lambert absorption, and subsurface scattering.
   *
   * # Arguments
   *
   * * `context` - Material evaluation context (lighting, viewing angle, background)
   *
   * # Returns
   *
   * EvaluatedMaterial with all optical properties resolved
   *
   * # Example (JavaScript)
   *
   * ```javascript
   * const glass = GlassMaterial.frosted();
   * const context = EvalMaterialContext.default();
   * const evaluated = glass.evaluate(context);
   * console.log(`Opacity: ${evaluated.opacity}`);
   * console.log(`Scattering: ${evaluated.scatteringRadiusMm}mm`);
   * ```
   */
  evaluate(context: EvalMaterialContext): EvaluatedMaterial;
  /**
   * Create a builder for custom glass materials (Gap 5 - P1).
   *
   * Provides a fluent API for creating glass materials with custom properties.
   * Unset properties default to the "regular" preset values.
   *
   * # Example (JavaScript)
   *
   * ```javascript
   * const custom = GlassMaterial.builder()
   *     .ior(1.45)
   *     .roughness(0.3)
   *     .thickness(8.0)
   *     .build();
   * ```
   */
  static builder(): GlassMaterialBuilder;
  /**
   * Get index of refraction
   */
  readonly ior: number;
  /**
   * Get surface roughness
   */
  readonly roughness: number;
  /**
   * Get thickness in millimeters
   */
  readonly thickness: number;
  /**
   * Get noise scale
   */
  readonly noiseScale: number;
  /**
   * Get base color
   */
  readonly baseColor: OKLCH;
  /**
   * Get edge power
   */
  readonly edgePower: number;
}

export class GlassMaterialBuilder {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a new builder with no preset values.
   */
  constructor();
  /**
   * Start from the "clear" preset.
   */
  presetClear(): GlassMaterialBuilder;
  /**
   * Start from the "regular" preset.
   */
  presetRegular(): GlassMaterialBuilder;
  /**
   * Start from the "thick" preset.
   */
  presetThick(): GlassMaterialBuilder;
  /**
   * Start from the "frosted" preset.
   */
  presetFrosted(): GlassMaterialBuilder;
  /**
   * Set the index of refraction (IOR).
   *
   * Valid range: 1.0 - 2.5
   */
  ior(ior: number): GlassMaterialBuilder;
  /**
   * Set the surface roughness.
   *
   * Valid range: 0.0 - 1.0
   */
  roughness(roughness: number): GlassMaterialBuilder;
  /**
   * Set the glass thickness in millimeters.
   */
  thickness(mm: number): GlassMaterialBuilder;
  /**
   * Set the noise scale for frosted texture.
   *
   * Valid range: 0.0 - 1.0
   */
  noiseScale(scale: number): GlassMaterialBuilder;
  /**
   * Set the base color tint.
   */
  baseColor(color: OKLCH): GlassMaterialBuilder;
  /**
   * Set the edge power for Fresnel glow.
   *
   * Valid range: 1.0 - 4.0
   */
  edgePower(power: number): GlassMaterialBuilder;
  /**
   * Build the GlassMaterial.
   *
   * Any unset properties default to the "regular" preset values.
   */
  build(): GlassMaterial;
}

export class GlassPhysicsEngine {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create new glass physics engine with material preset
   *
   * # Arguments
   *
   * * `preset` - "clear", "regular", "thick", or "frosted"
   */
  constructor(preset: string);
  /**
   * Create with custom material and noise
   */
  static withCustom(material: GlassMaterial, noise: PerlinNoise): GlassPhysicsEngine;
  /**
   * Calculate complete glass properties for rendering
   *
   * Returns object with all CSS-ready values:
   * - opacity: Material translucency (0-1)
   * - blur: Blur amount in pixels
   * - fresnel: Array of gradient stops [position, intensity, ...]
   * - specular: Array of layer data [intensity, x, y, size, ...]
   * - noise: Noise texture scale
   */
  calculateProperties(normal: Vec3, light_dir: Vec3, view_dir: Vec3): object;
  /**
   * Generate noise texture
   */
  generateNoiseTexture(width: number, height: number, scale: number): Uint8Array;
  /**
   * Get material
   */
  readonly material: GlassMaterial;
}

export class GlassProperties {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create default glass properties.
   */
  constructor();
  /**
   * Get base tint color.
   */
  getBaseTint(): OKLCH;
  /**
   * Set base tint color.
   */
  setBaseTint(tint: OKLCH): void;
  /**
   * Get opacity (0.0 = transparent, 1.0 = opaque).
   */
  opacity: number;
  /**
   * Get blur radius in pixels.
   */
  blurRadius: number;
  /**
   * Get reflectivity (0.0 = none, 1.0 = mirror).
   */
  reflectivity: number;
  /**
   * Get refraction index.
   */
  refraction: number;
  /**
   * Get depth/thickness.
   */
  depth: number;
  /**
   * Get noise scale.
   */
  noiseScale: number;
  /**
   * Get specular intensity.
   */
  specularIntensity: number;
}

export class GlassRenderOptions {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create options with default settings.
   */
  constructor();
  /**
   * Create minimal preset (no visual effects).
   */
  static minimal(): GlassRenderOptions;
  /**
   * Create premium preset (Apple Liquid Glass quality).
   */
  static premium(): GlassRenderOptions;
  /**
   * Create modal preset (floating dialogs).
   */
  static modal(): GlassRenderOptions;
  /**
   * Create subtle preset (content-focused cards).
   */
  static subtle(): GlassRenderOptions;
  /**
   * Create dark mode preset.
   */
  static darkMode(): GlassRenderOptions;
  /**
   * Enable or disable specular highlights.
   */
  set specularEnabled(value: boolean);
  /**
   * Set specular highlight intensity (0.0-1.0).
   */
  set specularIntensity(value: number);
  /**
   * Enable or disable Fresnel edge glow.
   */
  set fresnelEnabled(value: boolean);
  /**
   * Set Fresnel edge intensity (0.0-1.0).
   */
  set fresnelIntensity(value: number);
  /**
   * Set elevation level (0-6).
   */
  set elevation(value: number);
  /**
   * Enable or disable backdrop saturation boost.
   */
  set saturate(value: boolean);
  /**
   * Set border radius in pixels.
   */
  set borderRadius(value: number);
  /**
   * Set light mode (true) or dark mode (false).
   */
  set lightMode(value: boolean);
  /**
   * Enable or disable inner highlight.
   */
  set innerHighlightEnabled(value: boolean);
  /**
   * Enable or disable border.
   */
  set borderEnabled(value: boolean);
}

/**
 * Glass variant defines the visual behavior of Liquid Glass.
 */
export enum GlassVariant {
  /**
   * Regular glass - adaptive, most versatile
   */
  Regular = 0,
  /**
   * Clear glass - permanently more transparent
   */
  Clear = 1,
}

export class LayerTransmittance {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Surface layer (edge highlight) - High reflectivity, bright
   */
  readonly surface: number;
  /**
   * Volume layer (glass body) - Main transmittance value
   */
  readonly volume: number;
  /**
   * Substrate layer (deep contact) - Darkest layer, creates depth
   */
  readonly substrate: number;
}

export class LightingContext {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create studio lighting preset
   */
  static studio(): LightingContext;
  /**
   * Create outdoor lighting preset
   */
  static outdoor(): LightingContext;
  /**
   * Create dramatic lighting preset
   */
  static dramatic(): LightingContext;
  /**
   * Create soft lighting preset
   */
  static soft(): LightingContext;
  /**
   * Create neutral lighting preset
   */
  static neutral(): LightingContext;
}

export class LiquidGlass {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create new Liquid Glass with specified variant.
   */
  constructor(variant: GlassVariant);
  /**
   * Create with custom properties.
   */
  static withProperties(variant: GlassVariant, properties: GlassProperties): LiquidGlass;
  /**
   * Calculate effective color when glass is over background.
   */
  effectiveColor(background: Color): Color;
  /**
   * Recommend text color for maximum readability.
   *
   * # Arguments
   *
   * * `background` - Background color behind the glass
   * * `prefer_white` - Whether to prefer white text over dark text
   */
  recommendTextColor(background: Color, prefer_white: boolean): Color;
  /**
   * Decompose into multi-layer structure.
   */
  getLayers(background: Color): GlassLayers;
  /**
   * Adapt glass properties for dark mode.
   */
  adaptForDarkMode(): void;
  /**
   * Adapt glass properties for light mode.
   */
  adaptForLightMode(): void;
  /**
   * Get variant.
   */
  readonly variant: GlassVariant;
  /**
   * Get properties.
   */
  readonly properties: GlassProperties;
}

export class MaterialContext {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create studio preset context
   */
  static studio(): MaterialContext;
  /**
   * Create outdoor preset context
   */
  static outdoor(): MaterialContext;
  /**
   * Create dramatic preset context
   */
  static dramatic(): MaterialContext;
  /**
   * Create neutral preset context
   */
  static neutral(): MaterialContext;
  /**
   * Create showcase preset context
   */
  static showcase(): MaterialContext;
}

export class MaterialSurface {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create material surface from elevation and theme color.
   */
  constructor(elevation: Elevation, theme_primary: OKLCH);
  /**
   * Apply glass overlay to elevated surface.
   */
  withGlass(glass: LiquidGlass): MaterialSurface;
  /**
   * Calculate final surface color over base.
   */
  surfaceColor(base_surface: Color): Color;
  /**
   * Get elevation.
   */
  readonly elevation: Elevation;
  /**
   * Get surface tint.
   */
  readonly surfaceTint: OKLCH;
}

export class OKLCH {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create OKLCH color from L, C, H values.
   *
   * # Arguments
   *
   * * `l` - Lightness (0.0 to 1.0)
   * * `c` - Chroma (0.0 to ~0.4)
   * * `h` - Hue (0.0 to 360.0 degrees)
   */
  constructor(l: number, c: number, h: number);
  /**
   * Convert RGB color to OKLCH.
   */
  static fromColor(color: Color): OKLCH;
  /**
   * Convert OKLCH to RGB color.
   */
  toColor(): Color;
  /**
   * Make color lighter by delta.
   */
  lighten(delta: number): OKLCH;
  /**
   * Make color darker by delta.
   */
  darken(delta: number): OKLCH;
  /**
   * Increase chroma (saturation) by factor.
   */
  saturate(factor: number): OKLCH;
  /**
   * Decrease chroma (saturation) by factor.
   */
  desaturate(factor: number): OKLCH;
  /**
   * Rotate hue by degrees.
   */
  rotateHue(degrees: number): OKLCH;
  /**
   * Map to sRGB gamut by reducing chroma if necessary.
   */
  mapToGamut(): OKLCH;
  /**
   * Calculate perceptual difference (Delta E) between two colors.
   */
  deltaE(other: OKLCH): number;
  /**
   * Interpolate between two OKLCH colors.
   *
   * # Arguments
   *
   * * `a` - Start color
   * * `b` - End color
   * * `t` - Interpolation factor (0.0 to 1.0)
   * * `hue_path` - "shorter" or "longer"
   */
  static interpolate(a: OKLCH, b: OKLCH, t: number, hue_path: string): OKLCH;
  /**
   * Get lightness (0.0 to 1.0).
   */
  readonly l: number;
  /**
   * Get chroma (0.0 to ~0.4).
   */
  readonly c: number;
  /**
   * Get hue (0.0 to 360.0).
   */
  readonly h: number;
}

export class OpticalProperties {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create with custom optical properties
   */
  constructor(absorption_coefficient: number, scattering_coefficient: number, thickness: number, refractive_index: number);
  /**
   * Create default optical properties
   */
  static default(): OpticalProperties;
  /**
   * Get absorption coefficient
   */
  readonly absorptionCoefficient: number;
  /**
   * Get scattering coefficient
   */
  readonly scatteringCoefficient: number;
  /**
   * Get thickness
   */
  readonly thickness: number;
  /**
   * Get refractive index
   */
  readonly refractiveIndex: number;
}

export class PerlinNoise {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create new Perlin noise generator
   *
   * # Arguments
   *
   * * `seed` - Random seed for reproducibility
   * * `octaves` - Number of noise layers (1-8)
   * * `persistence` - Amplitude decrease per octave (0.0-1.0)
   * * `lacunarity` - Frequency increase per octave (typically 2.0)
   */
  constructor(seed: number, octaves: number, persistence: number, lacunarity: number);
  /**
   * Generate 2D noise value at position
   *
   * Returns value in range [-1.0, 1.0]
   */
  noise2D(x: number, y: number): number;
  /**
   * Generate fractal (multi-octave) 2D noise
   *
   * Returns value in range [-1.0, 1.0]
   */
  fractalNoise2D(x: number, y: number): number;
  /**
   * Generate RGBA texture buffer
   *
   * # Arguments
   *
   * * `width` - Texture width in pixels
   * * `height` - Texture height in pixels
   * * `scale` - Noise scale factor (typical: 0.01-0.1)
   *
   * # Returns
   *
   * Uint8Array with RGBA values (width * height * 4 bytes)
   */
  generateTexture(width: number, height: number, scale: number): Uint8Array;
  /**
   * Create clear glass noise preset (1 octave)
   */
  static clearGlass(): PerlinNoise;
  /**
   * Create regular glass noise preset (3 octaves)
   */
  static regularGlass(): PerlinNoise;
  /**
   * Create thick glass noise preset (4 octaves)
   */
  static thickGlass(): PerlinNoise;
  /**
   * Create frosted glass noise preset (6 octaves)
   */
  static frostedGlass(): PerlinNoise;
}

export class QualityScore {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Returns whether this score indicates the combination passes requirements.
   */
  passes(): boolean;
  /**
   * Returns a qualitative assessment of the score.
   *
   * Returns: "Excellent", "Good", "Acceptable", "Marginal", or "Poor"
   */
  assessment(): string;
  /**
   * Get confidence level (0.0 to 1.0).
   *
   * Higher confidence means the score is more reliable.
   * For now, returns compliance score as proxy for confidence.
   */
  confidence(): number;
  /**
   * Get human-readable explanation of the score.
   */
  explanation(): string;
  /**
   * Overall quality score (0.0 to 1.0)
   */
  readonly overall: number;
  /**
   * Compliance score (0.0 = fails, 1.0 = exceeds)
   */
  readonly compliance: number;
  /**
   * Perceptual quality score (0.0 = poor, 1.0 = optimal)
   */
  readonly perceptual: number;
  /**
   * Context appropriateness score (0.0 = inappropriate, 1.0 = perfect fit)
   */
  readonly appropriateness: number;
}

export class QualityScorer {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a new quality scorer.
   */
  constructor();
  /**
   * Score a color combination for a given context.
   *
   * # Arguments
   *
   * * `foreground` - Foreground color
   * * `background` - Background color
   * * `context` - Usage context
   *
   * # Returns
   *
   * Quality score with overall, compliance, perceptual, and appropriateness scores
   */
  score(foreground: Color, background: Color, context: RecommendationContext): QualityScore;
}

export class RecommendationContext {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a new recommendation context.
   */
  constructor(usage: UsageContext, target: ComplianceTarget);
  /**
   * Create context for body text (WCAG AA).
   */
  static bodyText(): RecommendationContext;
  /**
   * Create context for large text (WCAG AA).
   */
  static largeText(): RecommendationContext;
  /**
   * Create context for interactive elements (WCAG AA).
   */
  static interactive(): RecommendationContext;
  /**
   * Create context for decorative elements (no requirements).
   */
  static decorative(): RecommendationContext;
}

export class RenderContext {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create desktop rendering context (1920x1080, sRGB)
   */
  static desktop(): RenderContext;
  /**
   * Create mobile rendering context (375x667, Display P3 if supported)
   */
  static mobile(): RenderContext;
  /**
   * Create 4K rendering context
   */
  static fourK(): RenderContext;
  /**
   * Create custom rendering context
   *
   * # Arguments
   *
   * * `viewport_width` - Viewport width in CSS pixels
   * * `viewport_height` - Viewport height in CSS pixels
   * * `pixel_density` - Device pixel density (1.0 = standard, 2.0 = retina)
   */
  constructor(viewport_width: number, viewport_height: number, pixel_density: number);
  /**
   * Get viewport width
   */
  readonly viewportWidth: number;
  /**
   * Get viewport height
   */
  readonly viewportHeight: number;
  /**
   * Get pixel density
   */
  readonly pixelDensity: number;
}

export class ThinFilm {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a new thin film with custom parameters.
   *
   * # Arguments
   *
   * * `n_film` - Film refractive index (typically 1.3-1.7)
   * * `thickness_nm` - Film thickness in nanometers (typically 50-500nm)
   *
   * # Example
   *
   * ```javascript
   * // Custom thin film: n=1.45, thickness=180nm
   * const film = new ThinFilm(1.45, 180.0);
   * ```
   */
  constructor(n_film: number, thickness_nm: number);
  /**
   * Thin soap bubble (~100nm water film).
   *
   * Creates subtle blue-violet interference colors.
   */
  static soapBubbleThin(): ThinFilm;
  /**
   * Medium soap bubble (~200nm water film).
   *
   * Creates balanced rainbow interference colors.
   */
  static soapBubbleMedium(): ThinFilm;
  /**
   * Thick soap bubble (~400nm water film).
   *
   * Creates stronger yellow-red interference colors.
   */
  static soapBubbleThick(): ThinFilm;
  /**
   * Thin oil slick on water (~150nm).
   *
   * Oil (n≈1.5) on water (n≈1.33) creates classic rainbow effect.
   */
  static oilThin(): ThinFilm;
  /**
   * Medium oil slick (~300nm).
   */
  static oilMedium(): ThinFilm;
  /**
   * Thick oil slick (~500nm).
   */
  static oilThick(): ThinFilm;
  /**
   * Anti-reflective coating (MgF2 on glass).
   *
   * Quarter-wave thickness at 550nm for minimal reflection.
   */
  static arCoating(): ThinFilm;
  /**
   * Thin oxide layer (SiO2 on silicon, ~50nm).
   *
   * Creates characteristic chip colors.
   */
  static oxideThin(): ThinFilm;
  /**
   * Medium oxide layer (~150nm).
   */
  static oxideMedium(): ThinFilm;
  /**
   * Thick oxide layer (~300nm).
   */
  static oxideThick(): ThinFilm;
  /**
   * Beetle shell coating (chitin-like material).
   *
   * Creates natural iridescence seen in jewel beetles.
   */
  static beetleShell(): ThinFilm;
  /**
   * Pearl nacre (aragonite layers).
   *
   * Creates lustrous pearl iridescence.
   */
  static nacre(): ThinFilm;
  /**
   * Calculate optical path difference for given viewing angle.
   *
   * OPD = 2 * n_film * d * cos(theta_film)
   *
   * # Arguments
   *
   * * `cos_theta_air` - Cosine of incidence angle in air (1.0 = normal)
   *
   * # Returns
   *
   * Optical path difference in nanometers
   */
  opticalPathDifference(cos_theta_air: number): number;
  /**
   * Calculate phase difference for a given wavelength.
   *
   * delta = 2 * PI * OPD / lambda
   *
   * # Arguments
   *
   * * `wavelength_nm` - Wavelength in nanometers (visible: 400-700nm)
   * * `cos_theta` - Cosine of incidence angle (1.0 = normal)
   *
   * # Returns
   *
   * Phase difference in radians
   */
  phaseDifference(wavelength_nm: number, cos_theta: number): number;
  /**
   * Calculate reflectance at a single wavelength using the Airy formula.
   *
   * This is the core physics calculation that accounts for:
   * - Fresnel reflection at both interfaces
   * - Phase difference from optical path
   * - Interference between reflected rays
   *
   * # Arguments
   *
   * * `wavelength_nm` - Wavelength in nanometers (visible: 400-700nm)
   * * `n_substrate` - Substrate refractive index (air=1.0, water=1.33, glass=1.52)
   * * `cos_theta` - Cosine of incidence angle (1.0 = normal, 0.0 = grazing)
   *
   * # Returns
   *
   * Reflectance (0.0-1.0)
   *
   * # Example
   *
   * ```javascript
   * const film = ThinFilm.soapBubbleMedium();
   *
   * // Green light at normal incidence, air substrate
   * const rGreen = film.reflectance(550.0, 1.0, 1.0);
   *
   * // Same but at 60° angle
   * const rAngled = film.reflectance(550.0, 1.0, 0.5);  // cos(60°) = 0.5
   * ```
   */
  reflectance(wavelength_nm: number, n_substrate: number, cos_theta: number): number;
  /**
   * Calculate RGB reflectance (R=650nm, G=550nm, B=450nm).
   *
   * Returns reflectance values for rendering colored interference.
   *
   * # Arguments
   *
   * * `n_substrate` - Substrate refractive index
   * * `cos_theta` - Cosine of incidence angle
   *
   * # Returns
   *
   * Array of 3 reflectance values [R, G, B] in range 0.0-1.0
   *
   * # Example
   *
   * ```javascript
   * const film = ThinFilm.oilMedium();
   * const rgb = film.reflectanceRgb(1.33, 0.8);  // oil on water
   * console.log(`R=${rgb[0]}, G=${rgb[1]}, B=${rgb[2]}`);
   * ```
   */
  reflectanceRgb(n_substrate: number, cos_theta: number): Float64Array;
  /**
   * Calculate full spectrum reflectance (8 wavelengths: 400-750nm).
   *
   * Returns wavelengths and corresponding reflectances for spectral rendering.
   *
   * # Arguments
   *
   * * `n_substrate` - Substrate refractive index
   * * `cos_theta` - Cosine of incidence angle
   *
   * # Returns
   *
   * Object with `wavelengths` (8 values) and `reflectances` (8 values)
   */
  reflectanceSpectrum(n_substrate: number, cos_theta: number): object;
  /**
   * Find wavelength of maximum constructive interference.
   *
   * For first-order maximum: OPD = lambda
   *
   * # Arguments
   *
   * * `cos_theta` - Cosine of incidence angle
   *
   * # Returns
   *
   * Wavelength in nanometers where reflectance is maximized
   */
  maxWavelength(cos_theta: number): number;
  /**
   * Find wavelength of maximum destructive interference.
   *
   * For first-order minimum: OPD = lambda/2
   *
   * # Arguments
   *
   * * `cos_theta` - Cosine of incidence angle
   *
   * # Returns
   *
   * Wavelength in nanometers where reflectance is minimized
   */
  minWavelength(cos_theta: number): number;
  /**
   * Generate CSS for soap bubble effect.
   *
   * Creates a radial gradient that simulates angle-dependent
   * interference colors with a highlight at the center.
   *
   * # Arguments
   *
   * * `size_percent` - Size scaling percentage (100 = full size)
   *
   * # Returns
   *
   * CSS radial-gradient string
   *
   * # Example
   *
   * ```javascript
   * const film = ThinFilm.soapBubbleMedium();
   * const css = film.toCssSoapBubble(100.0);
   * element.style.background = css;
   * ```
   */
  toCssSoapBubble(size_percent: number): string;
  /**
   * Generate CSS for oil slick effect.
   *
   * Creates a linear gradient that simulates rainbow-like
   * interference patterns seen on oil films.
   *
   * # Returns
   *
   * CSS linear-gradient string
   *
   * # Example
   *
   * ```javascript
   * const film = ThinFilm.oilMedium();
   * const css = film.toCssOilSlick();
   * element.style.background = css;
   * ```
   */
  toCssOilSlick(): string;
  /**
   * Generate CSS for general iridescent gradient.
   *
   * Creates a gradient with angle-dependent color shift over a base color.
   *
   * # Arguments
   *
   * * `n_substrate` - Substrate refractive index
   * * `base_color` - Base CSS color string (e.g., "#000000")
   *
   * # Returns
   *
   * CSS gradient string
   */
  toCssIridescentGradient(n_substrate: number, base_color: string): string;
  /**
   * Convert thin-film reflectance to RGB color for given conditions.
   *
   * # Arguments
   *
   * * `n_substrate` - Substrate refractive index
   * * `cos_theta` - Cosine of incidence angle
   *
   * # Returns
   *
   * Array [r, g, b] with values 0-255
   */
  toRgb(n_substrate: number, cos_theta: number): Uint8Array;
  /**
   * Film refractive index.
   */
  readonly nFilm: number;
  /**
   * Film thickness in nanometers.
   */
  readonly thicknessNm: number;
}

/**
 * Usage context for color recommendations.
 */
export enum UsageContext {
  /**
   * Body text - primary content (18px or less, normal weight)
   */
  BodyText = 0,
  /**
   * Large text - headings, titles (18pt+ or 14pt+ bold)
   */
  LargeText = 1,
  /**
   * Interactive elements - buttons, links, form inputs
   */
  Interactive = 2,
  /**
   * Decorative - non-essential visual elements
   */
  Decorative = 3,
  /**
   * Icons and graphics - functional imagery
   */
  IconsGraphics = 4,
  /**
   * Disabled state - reduced emphasis
   */
  Disabled = 5,
}

export class Vec3 {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a new 3D vector
   */
  constructor(x: number, y: number, z: number);
  /**
   * Normalize vector to unit length
   */
  normalize(): Vec3;
  /**
   * Calculate dot product with another vector
   */
  dot(other: Vec3): number;
  /**
   * Reflect vector around normal
   */
  reflect(normal: Vec3): Vec3;
  /**
   * Get x component
   */
  readonly x: number;
  /**
   * Get y component
   */
  readonly y: number;
  /**
   * Get z component
   */
  readonly z: number;
}

export class VibrancyEffect {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create new vibrancy effect.
   */
  constructor(level: VibrancyLevel);
  /**
   * Apply vibrancy to foreground color given background.
   */
  apply(foreground: OKLCH, background: OKLCH): OKLCH;
  /**
   * Get vibrancy level.
   */
  readonly level: VibrancyLevel;
}

/**
 * Vibrancy level determines how much background color bleeds through.
 */
export enum VibrancyLevel {
  /**
   * Primary vibrancy - most color through (75%)
   */
  Primary = 0,
  /**
   * Secondary vibrancy - moderate color (50%)
   */
  Secondary = 1,
  /**
   * Tertiary vibrancy - subtle color (30%)
   */
  Tertiary = 2,
  /**
   * Divider vibrancy - minimal color (15%)
   */
  Divider = 3,
}

export class ViewContext {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Perpendicular view preset
   */
  static perpendicular(): ViewContext;
  /**
   * Oblique view preset (45° angle)
   */
  static oblique(): ViewContext;
  /**
   * Grazing angle view preset
   */
  static grazing(): ViewContext;
}

export class WCAGMetric {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Create a new WCAG metric.
   */
  constructor();
  /**
   * Evaluate contrast between foreground and background colors.
   *
   * Returns a contrast ratio from 1.0 to 21.0.
   */
  evaluate(foreground: Color, background: Color): ContrastResult;
  /**
   * Evaluate contrast for multiple color pairs (faster than calling evaluate in a loop).
   *
   * # Arguments
   *
   * * `foregrounds` - Array of foreground colors
   * * `backgrounds` - Array of background colors (must match length)
   *
   * # Returns
   *
   * Array of contrast results
   */
  evaluateBatch(foregrounds: Color[], backgrounds: Color[]): ContrastResult[];
  /**
   * Check if contrast ratio passes WCAG level for text size.
   *
   * # Arguments
   *
   * * `ratio` - Contrast ratio to check
   * * `level` - "AA" or "AAA"
   * * `is_large_text` - Whether text is large (18pt+ or 14pt+ bold)
   */
  static passes(ratio: number, level: string, is_large_text: boolean): boolean;
}

/**
 * Fast Beer-Lambert attenuation using lookup table
 *
 * 4x faster than exp() calculation with <1% error.
 *
 * # Arguments
 *
 * * `absorption` - Absorption coefficient per mm (0.0 to 1.0)
 * * `distance` - Path length in mm (0.0 to 100.0)
 *
 * # Returns
 *
 * Transmittance (0.0 to 1.0)
 */
export function beerLambertFast(absorption: number, distance: number): number;

/**
 * Calculate Blinn-Phong specular highlight
 *
 * Uses halfway vector for faster and more accurate specular than Phong model.
 *
 * # Arguments
 *
 * * `normal` - Surface normal vector
 * * `light_dir` - Light direction vector (from surface to light)
 * * `view_dir` - View direction vector (from surface to camera)
 * * `shininess` - Material shininess (1-256, higher = sharper highlight)
 *
 * # Returns
 *
 * Specular intensity (0.0 to 1.0)
 */
export function blinnPhongSpecular(normal: Vec3, light_dir: Vec3, view_dir: Vec3, shininess: number): number;

/**
 * Calculate Brewster's angle (minimum reflectance for p-polarization)
 *
 * # Arguments
 *
 * * `ior1` - Refractive index of first medium
 * * `ior2` - Refractive index of second medium
 *
 * # Returns
 *
 * Brewster's angle in degrees
 */
export function brewsterAngle(ior1: number, ior2: number): number;

/**
 * Calculate optimal AR coating thickness for a given wavelength.
 *
 * For quarter-wave AR coating: d = lambda / (4 * n_film)
 *
 * # Arguments
 *
 * * `wavelength_nm` - Design wavelength in nanometers (typically 550nm for visible)
 * * `n_film` - Film refractive index
 *
 * # Returns
 *
 * Optimal thickness in nanometers
 *
 * # Example
 *
 * ```javascript
 * // AR coating for green light on MgF2
 * const thickness = calculateArCoatingThickness(550.0, 1.38);
 * console.log(`Optimal thickness: ${thickness}nm`);  // ~99.6nm
 * ```
 */
export function calculateArCoatingThickness(wavelength_nm: number, n_film: number): number;

/**
 * Calculate contact shadow for a glass element.
 *
 * Generates a sharp, dark shadow at the point where glass meets background.
 *
 * # Arguments
 *
 * * `params` - Contact shadow configuration
 * * `background` - Background color in OKLCH (affects shadow visibility)
 * * `glass_depth` - Perceived thickness of glass (affects shadow intensity, 0.0-2.0)
 *
 * # Returns
 *
 * Calculated contact shadow ready for CSS rendering.
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const params = ContactShadowParams.standard();
 * const background = new OKLCH(0.95, 0.01, 240.0); // Light background
 * const shadow = calculateContactShadow(params, background, 1.0);
 *
 * element.style.boxShadow = shadow.toCss();
 * ```
 */
export function calculateContactShadow(params: ContactShadowParams, background: OKLCH, glass_depth: number): ContactShadow;

/**
 * Calculate elevation shadow for glass element
 *
 * # Arguments
 *
 * * `elevation` - Elevation level (0-24)
 * * `background` - Background color in OKLCH
 * * `glass_depth` - Perceived thickness of glass (0.0-2.0)
 *
 * # Returns
 *
 * Complete shadow system as CSS box-shadow string
 */
export function calculateElevationShadow(elevation: number, background: OKLCH, glass_depth: number): ElevationShadow;

/**
 * Calculate CSS position for highlight from light direction
 *
 * # Arguments
 *
 * * `light_dir` - Light direction vector
 *
 * # Returns
 *
 * Array of [x, y] in percentage (-50 to 150)
 */
export function calculateHighlightPosition(light_dir: Vec3): Float64Array;

/**
 * Calculate multi-layer transmittance for realistic glass rendering
 *
 * # Arguments
 *
 * * `optical_props` - Optical properties of the glass
 * * `incident_intensity` - Incoming light intensity (0.0-1.0)
 *
 * # Returns
 *
 * Layer-separated transmittance values
 */
export function calculateMultiLayerTransmittance(optical_props: OpticalProperties, incident_intensity: number): LayerTransmittance;

/**
 * Calculate multi-layer specular highlights
 *
 * Generates 4 layers: main, secondary, top edge, left edge
 *
 * # Arguments
 *
 * * `normal` - Surface normal vector
 * * `light_dir` - Light direction vector
 * * `view_dir` - View direction vector
 * * `base_shininess` - Base material shininess
 *
 * # Returns
 *
 * Flat array of [intensity1, x1, y1, size1, intensity2, x2, y2, size2, ...]
 */
export function calculateSpecularLayers(normal: Vec3, light_dir: Vec3, view_dir: Vec3, base_shininess: number): Float64Array;

/**
 * Calculate view angle between normal and view direction
 *
 * # Arguments
 *
 * * `normal` - Surface normal vector
 * * `view_dir` - View direction vector
 *
 * # Returns
 *
 * Cosine of angle (for use in Fresnel calculations)
 */
export function calculateViewAngle(normal: Vec3, view_dir: Vec3): number;

/**
 * Calculate edge intensity for edge glow effect
 *
 * # Arguments
 *
 * * `cos_theta` - Cosine of view angle
 * * `edge_power` - Power curve exponent (1.0-4.0, higher = sharper edge)
 *
 * # Returns
 *
 * Edge intensity (0.0 at center to 1.0 at edge)
 */
export function edgeIntensity(cos_theta: number, edge_power: number): number;

/**
 * Evaluate and render glass material to CSS in one call (convenience function)
 *
 * This is a shortcut for:
 * 1. glass.evaluate(materialContext)
 * 2. backend.render(evaluated, renderContext)
 *
 * # Arguments
 *
 * * `glass` - Glass material to render
 * * `material_context` - Evaluation context (viewing angle, background, etc.)
 * * `render_context` - Rendering context (viewport, pixel ratio, etc.)
 *
 * # Returns
 *
 * CSS string ready to apply to DOM element
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const glass = GlassMaterial.frosted();
 * const materialCtx = EvalMaterialContext.new();
 * const renderCtx = RenderContext.desktop();
 *
 * const css = evaluateAndRenderCss(glass, materialCtx, renderCtx);
 * document.getElementById('panel').style.cssText = css;
 * ```
 */
export function evaluateAndRenderCss(glass: GlassMaterial, material_context: EvalMaterialContext, render_context: RenderContext): string;

/**
 * Batch evaluate and render multiple materials to CSS strings.
 *
 * This is significantly more efficient than calling `evaluateAndRenderCss`
 * in a loop, especially for large numbers of materials.
 *
 * # Arguments
 *
 * * `materials` - Array of GlassMaterial instances
 * * `material_contexts` - Array of EvalMaterialContext instances (same length)
 * * `render_context` - Single RenderContext to use for all materials
 *
 * # Returns
 *
 * Array of CSS strings, one per material
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const materials = [
 *     GlassMaterial.clear(),
 *     GlassMaterial.frosted(),
 *     GlassMaterial.thick()
 * ];
 * const contexts = materials.map(() => EvalMaterialContext.default());
 * const renderCtx = RenderContext.desktop();
 *
 * const cssArray = evaluateAndRenderCssBatch(materials, contexts, renderCtx);
 * cssArray.forEach((css, i) => {
 *     document.getElementById(`panel-${i}`).style.cssText = css;
 * });
 * ```
 */
export function evaluateAndRenderCssBatch(materials: GlassMaterial[], material_contexts: EvalMaterialContext[], render_context: RenderContext): string[];

/**
 * Batch evaluate and render with individual render contexts.
 *
 * More flexible version that allows different render contexts per material.
 *
 * # Arguments
 *
 * * `materials` - Array of GlassMaterial instances
 * * `material_contexts` - Array of EvalMaterialContext instances
 * * `render_contexts` - Array of RenderContext instances (all arrays must match length)
 *
 * # Returns
 *
 * Array of CSS strings, one per material
 */
export function evaluateAndRenderCssBatchFull(materials: GlassMaterial[], material_contexts: EvalMaterialContext[], render_contexts: RenderContext[]): string[];

/**
 * Find the dominant (brightest) wavelength for a thin film.
 *
 * Returns the wavelength with maximum reflectance in the visible range.
 *
 * # Arguments
 *
 * * `film` - ThinFilm parameters
 * * `n_substrate` - Substrate refractive index
 * * `cos_theta` - Cosine of incidence angle
 *
 * # Returns
 *
 * Dominant wavelength in nanometers (400-700nm)
 *
 * # Example
 *
 * ```javascript
 * const film = ThinFilm.soapBubbleMedium();
 * const lambda = findDominantWavelength(film, 1.0, 1.0);
 * console.log(`Dominant color wavelength: ${lambda}nm`);
 * ```
 */
export function findDominantWavelength(film: ThinFilm, n_substrate: number, cos_theta: number): number;

/**
 * Fast Fresnel calculation using lookup table
 *
 * 5x faster than direct calculation with <1% error.
 * Ideal for batch processing or performance-critical paths.
 *
 * # Arguments
 *
 * * `ior` - Index of refraction (1.0 to 2.5)
 * * `cos_theta` - Cosine of view angle (0.0 to 1.0)
 *
 * # Returns
 *
 * Fresnel reflectance (0.0 to 1.0)
 */
export function fresnelFast(ior: number, cos_theta: number): number;

/**
 * Calculate full Fresnel equations (s and p polarization)
 *
 * More accurate than Schlick's approximation but slower.
 *
 * # Arguments
 *
 * * `ior1` - Refractive index of first medium
 * * `ior2` - Refractive index of second medium
 * * `cos_theta_i` - Cosine of incident angle
 *
 * # Returns
 *
 * Tuple of (Rs, Rp) - reflectance for s and p polarization
 */
export function fresnelFull(ior1: number, ior2: number, cos_theta_i: number): Float64Array;

/**
 * Calculate Fresnel reflectance using Schlick's approximation
 *
 * Fast approximation of angle-dependent reflectivity (<4% error vs full Fresnel).
 *
 * # Arguments
 *
 * * `ior1` - Refractive index of first medium (e.g., 1.0 for air)
 * * `ior2` - Refractive index of second medium (e.g., 1.5 for glass)
 * * `cos_theta` - Cosine of view angle (0 = grazing, 1 = perpendicular)
 *
 * # Returns
 *
 * Reflectance value (0.0 to 1.0)
 */
export function fresnelSchlick(ior1: number, ior2: number, cos_theta: number): number;

/**
 * Generate CSS-ready Fresnel gradient
 *
 * # Arguments
 *
 * * `ior` - Index of refraction (e.g., 1.5 for glass)
 * * `samples` - Number of gradient stops (typically 8-16)
 * * `edge_power` - Edge sharpness (1.0-4.0)
 *
 * # Returns
 *
 * Flat array of [position, intensity, position, intensity, ...]
 */
export function generateFresnelGradient(ior: number, samples: number, edge_power: number): Float64Array;

/**
 * Generate Fresnel edge gradient CSS.
 *
 * Creates a radial gradient that simulates angle-dependent reflection
 * (Schlick's approximation). Edges appear brighter than center.
 *
 * # Arguments
 *
 * * `intensity` - Edge glow intensity (0.0-1.0)
 * * `light_mode` - Whether to use light mode colors
 *
 * # Returns
 *
 * CSS radial-gradient string
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const gradient = generateFresnelGradientCss(0.3, true);
 * element.style.background = gradient;
 * ```
 */
export function generateFresnelGradientCss(intensity: number, light_mode: boolean): string;

/**
 * Generate inner top highlight CSS.
 *
 * Creates a linear gradient from top that simulates
 * light hitting the top edge.
 *
 * # Arguments
 *
 * * `intensity` - Highlight intensity (0.0-1.0)
 * * `light_mode` - Whether to use light mode colors
 *
 * # Returns
 *
 * CSS linear-gradient string
 */
export function generateInnerHighlightCss(intensity: number, light_mode: boolean): string;

/**
 * Generate secondary specular (fill light) CSS.
 *
 * Creates a weaker highlight at bottom-right to simulate
 * ambient/fill lighting.
 *
 * # Arguments
 *
 * * `intensity` - Highlight intensity (0.0-1.0)
 * * `size` - Highlight size as percentage (15-40)
 *
 * # Returns
 *
 * CSS radial-gradient string
 */
export function generateSecondarySpecularCss(intensity: number, size: number): string;

/**
 * Generate specular highlight CSS.
 *
 * Creates a positioned radial gradient for light reflection
 * based on Blinn-Phong model.
 *
 * # Arguments
 *
 * * `intensity` - Highlight intensity (0.0-1.0)
 * * `size` - Highlight size as percentage (20-60)
 * * `pos_x` - Horizontal position percentage (0-100)
 * * `pos_y` - Vertical position percentage (0-100)
 *
 * # Returns
 *
 * CSS radial-gradient string
 */
export function generateSpecularHighlightCss(intensity: number, size: number, pos_x: number, pos_y: number): string;

/**
 * Get all thin-film presets with their names and recommended substrates.
 *
 * # Returns
 *
 * Array of objects with { name, nFilm, thicknessNm, suggestedSubstrate }
 *
 * # Example
 *
 * ```javascript
 * const presets = getThinFilmPresets();
 * for (const preset of presets) {
 *     console.log(`${preset.name}: n=${preset.nFilm}, d=${preset.thicknessNm}nm`);
 * }
 * ```
 */
export function getThinFilmPresets(): Array<any>;

export function init(): void;

/**
 * Render enhanced glass CSS with physics-based effects.
 *
 * This generates complete CSS with:
 * - Multi-layer backgrounds with gradients
 * - Specular highlights (Blinn-Phong)
 * - Fresnel edge glow
 * - 4-layer elevation shadows
 * - Backdrop blur with saturation
 *
 * # Example (JavaScript)
 *
 * ```javascript
 * const glass = GlassMaterial.regular();
 * const ctx = EvalMaterialContext.new();
 * const rctx = RenderContext.desktop();
 * const options = GlassRenderOptions.premium();
 *
 * const css = renderEnhancedGlassCss(glass, ctx, rctx, options);
 * document.getElementById('panel').style.cssText = css;
 * ```
 */
export function renderEnhancedGlassCss(glass: GlassMaterial, material_context: EvalMaterialContext, _render_context: RenderContext, options: GlassRenderOptions): string;

/**
 * Convert PBR roughness to Blinn-Phong shininess
 *
 * Maps roughness (0.0-1.0) to shininess (1-256) using perceptually linear curve.
 *
 * # Arguments
 *
 * * `roughness` - Surface roughness (0.0 = smooth, 1.0 = rough)
 *
 * # Returns
 *
 * Shininess value for Blinn-Phong (1-256)
 */
export function roughnessToShininess(roughness: number): number;

/**
 * Get total LUT memory usage in bytes
 */
export function totalLutMemory(): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_color_free: (a: number, b: number) => void;
  readonly color_from_rgb: (a: number, b: number, c: number) => number;
  readonly color_fromHex: (a: number, b: number, c: number) => void;
  readonly color_r: (a: number) => number;
  readonly color_g: (a: number) => number;
  readonly color_b: (a: number) => number;
  readonly color_toHex: (a: number, b: number) => void;
  readonly color_alpha: (a: number) => number;
  readonly color_withAlpha: (a: number, b: number) => number;
  readonly color_lighten: (a: number, b: number) => number;
  readonly color_darken: (a: number, b: number) => number;
  readonly color_saturate: (a: number, b: number) => number;
  readonly color_desaturate: (a: number, b: number) => number;
  readonly __wbg_contrastresult_free: (a: number, b: number) => void;
  readonly __wbg_get_contrastresult_value: (a: number) => number;
  readonly __wbg_set_contrastresult_value: (a: number, b: number) => void;
  readonly __wbg_get_contrastresult_polarity: (a: number) => number;
  readonly __wbg_set_contrastresult_polarity: (a: number, b: number) => void;
  readonly wcagmetric_evaluate: (a: number, b: number, c: number) => number;
  readonly wcagmetric_evaluateBatch: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly wcagmetric_passes: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_apcametric_free: (a: number, b: number) => void;
  readonly apcametric_evaluate: (a: number, b: number, c: number) => number;
  readonly apcametric_evaluateBatch: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly oklch_new: (a: number, b: number, c: number) => number;
  readonly oklch_fromColor: (a: number) => number;
  readonly oklch_toColor: (a: number) => number;
  readonly oklch_lighten: (a: number, b: number) => number;
  readonly oklch_darken: (a: number, b: number) => number;
  readonly oklch_saturate: (a: number, b: number) => number;
  readonly oklch_desaturate: (a: number, b: number) => number;
  readonly oklch_rotateHue: (a: number, b: number) => number;
  readonly oklch_mapToGamut: (a: number) => number;
  readonly oklch_deltaE: (a: number, b: number) => number;
  readonly oklch_interpolate: (a: number, b: number, c: number, d: number, e: number) => number;
  readonly recommendationcontext_new: (a: number, b: number) => number;
  readonly recommendationcontext_bodyText: () => number;
  readonly recommendationcontext_largeText: () => number;
  readonly recommendationcontext_interactive: () => number;
  readonly recommendationcontext_decorative: () => number;
  readonly __wbg_get_qualityscore_compliance: (a: number) => number;
  readonly __wbg_get_qualityscore_perceptual: (a: number) => number;
  readonly __wbg_get_qualityscore_appropriateness: (a: number) => number;
  readonly qualityscore_passes: (a: number) => number;
  readonly qualityscore_assessment: (a: number, b: number) => void;
  readonly qualityscore_confidence: (a: number) => number;
  readonly qualityscore_explanation: (a: number, b: number) => void;
  readonly qualityscorer_score: (a: number, b: number, c: number, d: number) => number;
  readonly glassproperties_new: () => number;
  readonly glassproperties_setBaseTint: (a: number, b: number) => void;
  readonly glassproperties_set_opacity: (a: number, b: number) => void;
  readonly glassproperties_set_blurRadius: (a: number, b: number) => void;
  readonly glassproperties_set_reflectivity: (a: number, b: number) => void;
  readonly glassproperties_set_refraction: (a: number, b: number) => void;
  readonly glassproperties_set_depth: (a: number, b: number) => void;
  readonly glassproperties_noiseScale: (a: number) => number;
  readonly glassproperties_set_noiseScale: (a: number, b: number) => void;
  readonly glassproperties_specularIntensity: (a: number) => number;
  readonly glassproperties_set_specularIntensity: (a: number, b: number) => void;
  readonly __wbg_glasslayers_free: (a: number, b: number) => void;
  readonly __wbg_get_glasslayers_highlight: (a: number) => number;
  readonly __wbg_get_glasslayers_base: (a: number) => number;
  readonly __wbg_get_glasslayers_shadow: (a: number) => number;
  readonly __wbg_liquidglass_free: (a: number, b: number) => void;
  readonly liquidglass_new: (a: number) => number;
  readonly liquidglass_withProperties: (a: number, b: number) => number;
  readonly liquidglass_effectiveColor: (a: number, b: number) => number;
  readonly liquidglass_recommendTextColor: (a: number, b: number, c: number) => number;
  readonly liquidglass_getLayers: (a: number, b: number) => number;
  readonly liquidglass_adaptForDarkMode: (a: number) => void;
  readonly liquidglass_adaptForLightMode: (a: number) => void;
  readonly liquidglass_variant: (a: number) => number;
  readonly liquidglass_properties: (a: number) => number;
  readonly vibrancyeffect_new: (a: number) => number;
  readonly vibrancyeffect_apply: (a: number, b: number, c: number) => number;
  readonly vibrancyeffect_level: (a: number) => number;
  readonly __wbg_materialsurface_free: (a: number, b: number) => void;
  readonly materialsurface_new: (a: number, b: number) => number;
  readonly materialsurface_withGlass: (a: number, b: number) => number;
  readonly materialsurface_surfaceColor: (a: number, b: number) => number;
  readonly materialsurface_elevation: (a: number) => number;
  readonly __wbg_elevationshadow_free: (a: number, b: number) => void;
  readonly elevationshadow_elevation: (a: number) => number;
  readonly elevationshadow_toCSS: (a: number, b: number) => void;
  readonly calculateElevationShadow: (a: number, b: number, c: number) => number;
  readonly elevationpresets_LEVEL_0: () => number;
  readonly elevationpresets_LEVEL_1: () => number;
  readonly elevationpresets_LEVEL_2: () => number;
  readonly elevationpresets_LEVEL_3: () => number;
  readonly elevationpresets_LEVEL_4: () => number;
  readonly elevationpresets_LEVEL_5: () => number;
  readonly elevationpresets_LEVEL_6: () => number;
  readonly __wbg_contactshadowparams_free: (a: number, b: number) => void;
  readonly contactshadowparams_new: (a: number, b: number, c: number, d: number) => number;
  readonly contactshadowparams_default: () => number;
  readonly contactshadowparams_floating: () => number;
  readonly contactshadowparams_grounded: () => number;
  readonly contactshadowparams_subtle: () => number;
  readonly contactshadowparams_darkness: (a: number) => number;
  readonly contactshadowparams_blurRadius: (a: number) => number;
  readonly contactshadowparams_offsetY: (a: number) => number;
  readonly contactshadow_color: (a: number) => number;
  readonly contactshadow_blur: (a: number) => number;
  readonly contactshadow_offsetY: (a: number) => number;
  readonly contactshadow_spread: (a: number) => number;
  readonly contactshadow_toCss: (a: number, b: number) => void;
  readonly calculateContactShadow: (a: number, b: number, c: number) => number;
  readonly opticalproperties_new: (a: number, b: number, c: number, d: number) => number;
  readonly opticalproperties_default: () => number;
  readonly __wbg_layertransmittance_free: (a: number, b: number) => void;
  readonly calculateMultiLayerTransmittance: (a: number, b: number) => number;
  readonly vec3_new: (a: number, b: number, c: number) => number;
  readonly vec3_normalize: (a: number) => number;
  readonly vec3_dot: (a: number, b: number) => number;
  readonly vec3_reflect: (a: number, b: number) => number;
  readonly __wbg_glassmaterial_free: (a: number, b: number) => void;
  readonly glassmaterial_new: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly glassmaterial_clear: () => number;
  readonly glassmaterial_regular: () => number;
  readonly glassmaterial_thick: () => number;
  readonly glassmaterial_frosted: () => number;
  readonly glassmaterial_baseColor: (a: number) => number;
  readonly glassmaterial_edgePower: (a: number) => number;
  readonly glassmaterial_shininess: (a: number) => number;
  readonly glassmaterial_scatteringRadiusMm: (a: number) => number;
  readonly glassmaterial_blurAmount: (a: number) => number;
  readonly glassmaterial_translucency: (a: number) => number;
  readonly glassmaterial_evaluate: (a: number, b: number) => number;
  readonly glassmaterial_builder: () => number;
  readonly __wbg_glassmaterialbuilder_free: (a: number, b: number) => void;
  readonly glassmaterialbuilder_presetClear: (a: number) => number;
  readonly glassmaterialbuilder_presetRegular: (a: number) => number;
  readonly glassmaterialbuilder_presetThick: (a: number) => number;
  readonly glassmaterialbuilder_presetFrosted: (a: number) => number;
  readonly glassmaterialbuilder_ior: (a: number, b: number) => number;
  readonly glassmaterialbuilder_roughness: (a: number, b: number) => number;
  readonly glassmaterialbuilder_thickness: (a: number, b: number) => number;
  readonly glassmaterialbuilder_noiseScale: (a: number, b: number) => number;
  readonly glassmaterialbuilder_baseColor: (a: number, b: number) => number;
  readonly glassmaterialbuilder_edgePower: (a: number, b: number) => number;
  readonly glassmaterialbuilder_build: (a: number) => number;
  readonly __wbg_perlinnoise_free: (a: number, b: number) => void;
  readonly perlinnoise_new: (a: number, b: number, c: number, d: number) => number;
  readonly perlinnoise_noise2D: (a: number, b: number, c: number) => number;
  readonly perlinnoise_fractalNoise2D: (a: number, b: number, c: number) => number;
  readonly perlinnoise_generateTexture: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly perlinnoise_clearGlass: () => number;
  readonly perlinnoise_regularGlass: () => number;
  readonly perlinnoise_thickGlass: () => number;
  readonly perlinnoise_frostedGlass: () => number;
  readonly fresnelSchlick: (a: number, b: number, c: number) => number;
  readonly fresnelFull: (a: number, b: number, c: number, d: number) => void;
  readonly calculateViewAngle: (a: number, b: number) => number;
  readonly edgeIntensity: (a: number, b: number) => number;
  readonly generateFresnelGradient: (a: number, b: number, c: number, d: number) => void;
  readonly blinnPhongSpecular: (a: number, b: number, c: number, d: number) => number;
  readonly calculateSpecularLayers: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly roughnessToShininess: (a: number) => number;
  readonly calculateHighlightPosition: (a: number, b: number) => void;
  readonly fresnelFast: (a: number, b: number) => number;
  readonly beerLambertFast: (a: number, b: number) => number;
  readonly lightingcontext_studio: () => number;
  readonly lightingcontext_outdoor: () => number;
  readonly lightingcontext_dramatic: () => number;
  readonly lightingcontext_soft: () => number;
  readonly lightingcontext_neutral: () => number;
  readonly __wbg_backgroundcontext_free: (a: number, b: number) => void;
  readonly backgroundcontext_white: () => number;
  readonly backgroundcontext_black: () => number;
  readonly backgroundcontext_gray: () => number;
  readonly backgroundcontext_colorful: () => number;
  readonly backgroundcontext_sky: () => number;
  readonly viewcontext_perpendicular: () => number;
  readonly viewcontext_oblique: () => number;
  readonly viewcontext_grazing: () => number;
  readonly materialcontext_studio: () => number;
  readonly materialcontext_outdoor: () => number;
  readonly materialcontext_dramatic: () => number;
  readonly materialcontext_neutral: () => number;
  readonly materialcontext_showcase: () => number;
  readonly __wbg_batchmaterialinput_free: (a: number, b: number) => void;
  readonly batchmaterialinput_new: () => number;
  readonly batchmaterialinput_push: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly batchmaterialinput_len: (a: number) => number;
  readonly batchmaterialinput_isEmpty: (a: number) => number;
  readonly __wbg_batchresult_free: (a: number, b: number) => void;
  readonly batchresult_count: (a: number) => number;
  readonly batchresult_getOpacity: (a: number, b: number) => void;
  readonly batchresult_getBlur: (a: number, b: number) => void;
  readonly batchresult_getFresnelNormal: (a: number, b: number) => void;
  readonly batchresult_getFresnelGrazing: (a: number, b: number) => void;
  readonly batchresult_getTransmittance: (a: number, b: number) => void;
  readonly __wbg_batchevaluator_free: (a: number, b: number) => void;
  readonly batchevaluator_new: () => number;
  readonly batchevaluator_withContext: (a: number) => number;
  readonly batchevaluator_evaluate: (a: number, b: number, c: number) => void;
  readonly batchevaluator_setContext: (a: number, b: number) => void;
  readonly __wbg_glassphysicsengine_free: (a: number, b: number) => void;
  readonly glassphysicsengine_new: (a: number, b: number, c: number) => void;
  readonly glassphysicsengine_withCustom: (a: number, b: number) => number;
  readonly glassphysicsengine_material: (a: number) => number;
  readonly glassphysicsengine_calculateProperties: (a: number, b: number, c: number, d: number) => number;
  readonly glassphysicsengine_generateNoiseTexture: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly __wbg_evalmaterialcontext_free: (a: number, b: number) => void;
  readonly evalmaterialcontext_new: () => number;
  readonly evalmaterialcontext_withBackground: (a: number) => number;
  readonly evalmaterialcontext_withViewingAngle: (a: number) => number;
  readonly __wbg_evaluatedmaterial_free: (a: number, b: number) => void;
  readonly evaluatedmaterial_baseColor: (a: number, b: number) => void;
  readonly evaluatedmaterial_opacity: (a: number) => number;
  readonly evaluatedmaterial_fresnelF0: (a: number) => number;
  readonly evaluatedmaterial_fresnelEdgeIntensity: (a: number) => number;
  readonly evaluatedmaterial_ior: (a: number, b: number) => void;
  readonly evaluatedmaterial_roughness: (a: number) => number;
  readonly evaluatedmaterial_scatteringRadiusMm: (a: number) => number;
  readonly evaluatedmaterial_blurPx: (a: number) => number;
  readonly evaluatedmaterial_specularIntensity: (a: number) => number;
  readonly evaluatedmaterial_specularShininess: (a: number) => number;
  readonly evaluatedmaterial_thicknessMm: (a: number) => number;
  readonly evaluatedmaterial_absorption: (a: number, b: number) => void;
  readonly evaluatedmaterial_scattering: (a: number, b: number) => void;
  readonly __wbg_rendercontext_free: (a: number, b: number) => void;
  readonly rendercontext_desktop: () => number;
  readonly rendercontext_mobile: () => number;
  readonly rendercontext_fourK: () => number;
  readonly rendercontext_new: (a: number, b: number, c: number) => number;
  readonly rendercontext_viewportWidth: (a: number) => number;
  readonly rendercontext_viewportHeight: (a: number) => number;
  readonly __wbg_cssbackend_free: (a: number, b: number) => void;
  readonly cssbackend_new: () => number;
  readonly cssbackend_render: (a: number, b: number, c: number, d: number) => void;
  readonly cssbackend_name: (a: number, b: number) => void;
  readonly evaluateAndRenderCss: (a: number, b: number, c: number, d: number) => void;
  readonly evaluateAndRenderCssBatch: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly evaluateAndRenderCssBatchFull: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly glassrenderoptions_new: () => number;
  readonly glassrenderoptions_minimal: () => number;
  readonly glassrenderoptions_premium: () => number;
  readonly glassrenderoptions_modal: () => number;
  readonly glassrenderoptions_subtle: () => number;
  readonly glassrenderoptions_darkMode: () => number;
  readonly glassrenderoptions_set_specularEnabled: (a: number, b: number) => void;
  readonly glassrenderoptions_set_specularIntensity: (a: number, b: number) => void;
  readonly glassrenderoptions_set_fresnelEnabled: (a: number, b: number) => void;
  readonly glassrenderoptions_set_fresnelIntensity: (a: number, b: number) => void;
  readonly glassrenderoptions_set_elevation: (a: number, b: number) => void;
  readonly glassrenderoptions_set_saturate: (a: number, b: number) => void;
  readonly glassrenderoptions_set_lightMode: (a: number, b: number) => void;
  readonly glassrenderoptions_set_innerHighlightEnabled: (a: number, b: number) => void;
  readonly glassrenderoptions_set_borderEnabled: (a: number, b: number) => void;
  readonly renderEnhancedGlassCss: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly generateFresnelGradientCss: (a: number, b: number, c: number) => void;
  readonly generateSpecularHighlightCss: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly generateSecondarySpecularCss: (a: number, b: number, c: number) => void;
  readonly generateInnerHighlightCss: (a: number, b: number, c: number) => void;
  readonly thinfilm_soapBubbleThin: () => number;
  readonly thinfilm_soapBubbleMedium: () => number;
  readonly thinfilm_soapBubbleThick: () => number;
  readonly thinfilm_oilThin: () => number;
  readonly thinfilm_oilMedium: () => number;
  readonly thinfilm_oilThick: () => number;
  readonly thinfilm_arCoating: () => number;
  readonly thinfilm_oxideThin: () => number;
  readonly thinfilm_oxideMedium: () => number;
  readonly thinfilm_oxideThick: () => number;
  readonly thinfilm_beetleShell: () => number;
  readonly thinfilm_nacre: () => number;
  readonly thinfilm_opticalPathDifference: (a: number, b: number) => number;
  readonly thinfilm_phaseDifference: (a: number, b: number, c: number) => number;
  readonly thinfilm_reflectance: (a: number, b: number, c: number, d: number) => number;
  readonly thinfilm_reflectanceRgb: (a: number, b: number, c: number, d: number) => void;
  readonly thinfilm_reflectanceSpectrum: (a: number, b: number, c: number) => number;
  readonly thinfilm_maxWavelength: (a: number, b: number) => number;
  readonly thinfilm_minWavelength: (a: number, b: number) => number;
  readonly thinfilm_toCssSoapBubble: (a: number, b: number, c: number) => void;
  readonly thinfilm_toCssOilSlick: (a: number, b: number) => void;
  readonly thinfilm_toCssIridescentGradient: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly thinfilm_toRgb: (a: number, b: number, c: number, d: number) => void;
  readonly calculateArCoatingThickness: (a: number, b: number) => number;
  readonly findDominantWavelength: (a: number, b: number, c: number) => number;
  readonly getThinFilmPresets: () => number;
  readonly init: () => void;
  readonly materialsurface_surfaceTint: (a: number) => number;
  readonly glassproperties_getBaseTint: (a: number) => number;
  readonly evalmaterialcontext_background: (a: number) => number;
  readonly contactshadowparams_standard: () => number;
  readonly totalLutMemory: () => number;
  readonly brewsterAngle: (a: number, b: number) => number;
  readonly thinfilm_new: (a: number, b: number) => number;
  readonly glassrenderoptions_set_borderRadius: (a: number, b: number) => void;
  readonly glassmaterialbuilder_new: () => number;
  readonly __wbg_get_qualityscore_overall: (a: number) => number;
  readonly glassproperties_refraction: (a: number) => number;
  readonly oklch_l: (a: number) => number;
  readonly oklch_c: (a: number) => number;
  readonly oklch_h: (a: number) => number;
  readonly glassproperties_opacity: (a: number) => number;
  readonly contactshadowparams_spread: (a: number) => number;
  readonly glassproperties_blurRadius: (a: number) => number;
  readonly glassproperties_reflectivity: (a: number) => number;
  readonly contactshadow_opacity: (a: number) => number;
  readonly opticalproperties_absorptionCoefficient: (a: number) => number;
  readonly opticalproperties_scatteringCoefficient: (a: number) => number;
  readonly opticalproperties_thickness: (a: number) => number;
  readonly opticalproperties_refractiveIndex: (a: number) => number;
  readonly layertransmittance_surface: (a: number) => number;
  readonly layertransmittance_volume: (a: number) => number;
  readonly layertransmittance_substrate: (a: number) => number;
  readonly vec3_x: (a: number) => number;
  readonly vec3_y: (a: number) => number;
  readonly vec3_z: (a: number) => number;
  readonly glassmaterial_ior: (a: number) => number;
  readonly glassmaterial_roughness: (a: number) => number;
  readonly glassmaterial_thickness: (a: number) => number;
  readonly glassmaterial_noiseScale: (a: number) => number;
  readonly glassproperties_depth: (a: number) => number;
  readonly evalmaterialcontext_viewingAngle: (a: number) => number;
  readonly evalmaterialcontext_ambientLight: (a: number) => number;
  readonly evalmaterialcontext_keyLight: (a: number) => number;
  readonly rendercontext_pixelDensity: (a: number) => number;
  readonly thinfilm_nFilm: (a: number) => number;
  readonly thinfilm_thicknessNm: (a: number) => number;
  readonly __wbg_wcagmetric_free: (a: number, b: number) => void;
  readonly __wbg_qualityscorer_free: (a: number, b: number) => void;
  readonly __wbg_vibrancyeffect_free: (a: number, b: number) => void;
  readonly __wbg_elevationpresets_free: (a: number, b: number) => void;
  readonly __wbg_qualityscore_free: (a: number, b: number) => void;
  readonly __wbg_contactshadow_free: (a: number, b: number) => void;
  readonly __wbg_opticalproperties_free: (a: number, b: number) => void;
  readonly __wbg_oklch_free: (a: number, b: number) => void;
  readonly __wbg_vec3_free: (a: number, b: number) => void;
  readonly __wbg_lightingcontext_free: (a: number, b: number) => void;
  readonly __wbg_viewcontext_free: (a: number, b: number) => void;
  readonly __wbg_materialcontext_free: (a: number, b: number) => void;
  readonly __wbg_glassproperties_free: (a: number, b: number) => void;
  readonly __wbg_recommendationcontext_free: (a: number, b: number) => void;
  readonly __wbg_glassrenderoptions_free: (a: number, b: number) => void;
  readonly __wbg_thinfilm_free: (a: number, b: number) => void;
  readonly wcagmetric_new: () => number;
  readonly apcametric_new: () => number;
  readonly qualityscorer_new: () => number;
  readonly __wbindgen_export: (a: number, b: number) => number;
  readonly __wbindgen_export2: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export3: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export4: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
