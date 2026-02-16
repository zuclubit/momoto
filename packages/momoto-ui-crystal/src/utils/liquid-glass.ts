/**
 * Liquid Glass Material System
 *
 * TypeScript wrapper for Apple's Liquid Glass material system (WWDC 2025)
 * Built on top of Momoto's perceptual color science.
 */

import type { ColorOklch } from './token-engine';

// Dynamic import to handle WASM initialization
let wasmModule: any = null;
let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

async function initWasm() {
  if (wasmInitialized) return;
  if (wasmInitPromise) return wasmInitPromise;

  wasmInitPromise = (async () => {
    try {
      // Import the module
      const module = await import('@momoto-ui/wasm');

      // Initialize WASM (call default export function)
      if (typeof module.default === 'function') {
        await module.default();
      }

      wasmModule = module;
      wasmInitialized = true;
      console.info('[LiquidGlass] Momoto WASM initialized successfully');
    } catch (error) {
      console.warn('[LiquidGlass] Failed to load Momoto WASM, using fallback calculations:', error);
      wasmInitialized = false;
    }
  })();

  return wasmInitPromise;
}

// Start initialization immediately
if (typeof window !== 'undefined') {
  initWasm();
}

// Define enums locally to avoid synchronous WASM import
export enum GlassVariant {
  Regular = 0,
  Clear = 1,
}

export enum VibrancyLevel {
  Primary = 0,
  Secondary = 1,
  Tertiary = 2,
}

export enum Elevation {
  Level0 = 0,
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
  Level5 = 5,
}

export type { ColorOklch };

/**
 * Dark tint configuration for glass material
 * Simulates the inherent tint color of the glass (like tinted glass in architecture)
 */
export type DarkTintConfig = {
  /** Intensity of the dark tint (0.0 = no tint, 1.0 = maximum tint) */
  intensity: number;
  /** Color of the tint (usually neutral/gray, but can be any color) */
  color?: ColorOklch;
  /** Blend mode for the tint layer */
  blendMode?: 'multiply' | 'overlay' | 'darken';
};

/**
 * Specular highlight configuration (Apple-style)
 * Real specular reflections on glass surface, not just a static gradient
 */
export type SpecularConfig = {
  /** Enable/disable specular highlights (like Apple's toggle) */
  enabled: boolean;
  /** Intensity of specular highlights (0.0 - 1.0) */
  intensity: number;
  /** Show highlights on edges of the glass */
  edges?: boolean;
  /** Show highlights on corners of the glass */
  corners?: boolean;
  /** Direction angle of light source (0-360 degrees) */
  directionAngle?: number;
  /** Sharpness of the highlight (0.0 = soft, 1.0 = sharp) */
  sharpness?: number;
};

/**
 * Integrated shadow configuration
 * Shadows as part of the glass material, not external
 */
export type GlassShadowConfig = {
  /** Enable/disable shadows */
  enabled: boolean;
  /** Shadow type (affects color temperature) */
  type?: 'neutral' | 'warm' | 'cool';
  /** Shadow intensity (0-100, matching Apple's percentage) */
  intensity: number;
  /** Inner shadows (within glass thickness) */
  inner?: {
    enabled: boolean;
    depth: number;
  };
  /** Outer shadows (elevation/projection) */
  outer?: {
    enabled: boolean;
    elevation: number;
  };
};

export type GlassConfig = {
  variant?: GlassVariant;
  baseTint?: ColorOklch;

  /** Simple transparency (0.0 = transparent, 1.0 = opaque) */
  opacity?: number;

  /**
   * Translucency - Light transmission through material (different from opacity)
   * 0.0 = Opaque (no light passes through)
   * 0.5 = Translucent (light passes but diffuses)  ← Apple's 50%
   * 1.0 = Transparent (light passes without diffusion)
   */
  translucency?: number;

  blurRadius?: number;
  reflectivity?: number;
  refraction?: number;
  depth?: number;
  noiseScale?: number;

  /**
   * Dark tint of the glass material (Apple's "Dark" parameter at 42%)
   * Simulates inherent color/tint of the glass
   */
  darkTint?: DarkTintConfig;

  /**
   * Specular highlights system (Apple-style with toggle + intensity)
   * Real specular reflections on glass surface
   */
  specular?: SpecularConfig;

  /**
   * Integrated shadow system (Apple's "Shadow: Neutral, 50%")
   * Shadows as part of the glass material
   */
  shadow?: GlassShadowConfig;

  /** @deprecated Use specular.intensity instead */
  specularIntensity?: number;
};

/**
 * Liquid Glass surface implementation
 *
 * @example
 * ```ts
 * const glass = new LiquidGlass({ variant: GlassVariant.Regular });
 * const effectiveColor = glass.getEffectiveColor('#3B82F6');
 * const textColor = glass.recommendTextColor('#3B82F6', true);
 * ```
 */
export class LiquidGlass {
  private glass: any;

  constructor(config: GlassConfig = {}) {
    // Store config for lazy initialization
    this.config = config;
    this.glass = null as any; // Will be initialized on first use
  }

  private config: GlassConfig;

  private ensureInitialized() {
    if (this.glass) return;

    if (!wasmInitialized || !wasmModule) {
      // Fallback: use simple default values
      this.glass = this.createFallbackGlass();
      return;
    }

    const variant = this.config.variant ?? wasmModule.GlassVariant.Regular;

    try {
      if (Object.keys(this.config).length > 1 || this.config.baseTint) {
        // Custom properties provided
        const properties = new wasmModule.GlassProperties();

        if (this.config.baseTint) {
          const tint = new wasmModule.OKLCH(
            this.config.baseTint.l,
            this.config.baseTint.c,
            this.config.baseTint.h
          );
          properties.setBaseTint(tint);
        }

        if (this.config.opacity !== undefined) properties.opacity = this.config.opacity;
        if (this.config.blurRadius !== undefined) properties.blurRadius = this.config.blurRadius;
        if (this.config.reflectivity !== undefined) properties.reflectivity = this.config.reflectivity;
        if (this.config.refraction !== undefined) properties.refraction = this.config.refraction;
        if (this.config.depth !== undefined) properties.depth = this.config.depth;
        if (this.config.noiseScale !== undefined) properties.noiseScale = this.config.noiseScale;
        if (this.config.specularIntensity !== undefined) properties.specularIntensity = this.config.specularIntensity;

        this.glass = wasmModule.LiquidGlass.withProperties(variant, properties);
      } else {
        this.glass = new wasmModule.LiquidGlass(variant);
      }
    } catch (error) {
      console.warn('Failed to create WASM LiquidGlass, using fallback:', error);
      this.glass = this.createFallbackGlass();
    }
  }

  private createFallbackGlass() {
    // Simple fallback implementation when WASM is not available
    const baseTint = this.config.baseTint || { l: 0.95, c: 0.01, h: 240 };
    const opacity = this.config.opacity || 0.8;
    const blurRadius = this.config.blurRadius || 20;

    return {
      effectiveColor: () => '#E8EBF5',
      recommendTextColor: () => '#1A1A1A',
      getLayers: () => ({
        highlight: { l: Math.min(1.0, baseTint.l + 0.05), c: baseTint.c * 0.5, h: baseTint.h },
        base: baseTint,
        shadow: { l: Math.max(0.0, baseTint.l - 0.1), c: baseTint.c * 1.2, h: baseTint.h },
      }),
      getProperties: () => ({
        baseTint,
        opacity,
        blurRadius,
        reflectivity: this.config.reflectivity || 0.15,
        refraction: this.config.refraction || 1.3,
        depth: this.config.depth || 0.5,
        noiseScale: this.config.noiseScale || 0.02,
        specularIntensity: this.config.specularIntensity || 0.25,
      }),
      adaptForDarkMode: () => {},
      adaptForLightMode: () => {},
      variant: this.config.variant || 0,
      properties: null,
    };
  }

  /**
   * Calculate the effective color when glass is placed over a background
   *
   * @param background - Background color (hex string or RGB)
   * @returns Effective color as hex string
   */
  getEffectiveColor(background: string | {r: number, g: number, b: number}): string {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      return this.glass.effectiveColor();
    }

    const bgColor = typeof background === 'string'
      ? wasmModule.Color.fromHex(background)
      : new wasmModule.Color(background.r, background.g, background.b);

    const effective = this.glass.effectiveColor(bgColor);
    return effective.toHex();
  }

  /**
   * Recommend text color for maximum readability over glass
   *
   * @param background - Background color behind the glass
   * @param preferWhite - Whether to prefer white text over dark text
   * @returns Recommended text color as hex string
   */
  recommendTextColor(
    background: string | {r: number, g: number, b: number},
    preferWhite: boolean = false
  ): string {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      return this.glass.recommendTextColor();
    }

    const bgColor = typeof background === 'string'
      ? wasmModule.Color.fromHex(background)
      : new wasmModule.Color(background.r, background.g, background.b);

    const textColor = this.glass.recommendTextColor(bgColor, preferWhite);
    return textColor.toHex();
  }

  /**
   * Get multi-layer composition for advanced rendering
   *
   * @param background - Background color
   * @returns Object with highlight, base, and shadow layers
   */
  getLayers(background: string | {r: number, g: number, b: number}): {
    highlight: ColorOklch;
    base: ColorOklch;
    shadow: ColorOklch;
  } {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      const layers = this.glass.getLayers();
      return layers;
    }

    const bgColor = typeof background === 'string'
      ? wasmModule.Color.fromHex(background)
      : new wasmModule.Color(background.r, background.g, background.b);

    const layers = this.glass.getLayers(bgColor);

    return {
      highlight: { l: layers.highlight.l, c: layers.highlight.c, h: layers.highlight.h },
      base: { l: layers.base.l, c: layers.base.c, h: layers.base.h },
      shadow: { l: layers.shadow.l, c: layers.shadow.c, h: layers.shadow.h },
    };
  }

  /**
   * Adapt glass properties for dark mode
   */
  adaptForDarkMode(): void {
    this.ensureInitialized();
    if (this.glass.adaptForDarkMode) {
      this.glass.adaptForDarkMode();
    }
  }

  /**
   * Adapt glass properties for light mode
   */
  adaptForLightMode(): void {
    this.ensureInitialized();
    if (this.glass.adaptForLightMode) {
      this.glass.adaptForLightMode();
    }
  }

  /**
   * Get glass variant
   */
  getVariant(): any {
    this.ensureInitialized();
    return this.glass.variant;
  }

  /**
   * Get glass properties
   */
  getProperties(): {
    baseTint: ColorOklch;
    opacity: number;
    blurRadius: number;
    reflectivity: number;
    refraction: number;
    depth: number;
    noiseScale: number;
    specularIntensity: number;
  } {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      return this.glass.getProperties();
    }

    const props = this.glass.properties;
    const baseTint = props.getBaseTint();

    return {
      baseTint: { l: baseTint.l, c: baseTint.c, h: baseTint.h },
      opacity: props.opacity,
      blurRadius: props.blurRadius,
      reflectivity: props.reflectivity,
      refraction: props.refraction,
      depth: props.depth,
      noiseScale: props.noiseScale,
      specularIntensity: props.specularIntensity,
    };
  }

  /**
   * Generate CSS custom properties for use in stylesheets
   *
   * @param background - Background color
   * @param prefix - CSS variable prefix
   * @returns Object with CSS custom properties
   */
  toCSSVars(background: string, prefix: string = '--glass'): Record<string, string> {
    const effective = this.getEffectiveColor(background);
    const textColor = this.recommendTextColor(background, false);
    const props = this.getProperties();
    const layers = this.getLayers(background);

    const oklchToString = (color: ColorOklch) =>
      `${color.l} ${color.c} ${color.h}`;

    const vars: Record<string, string> = {
      [`${prefix}-color`]: effective,
      [`${prefix}-text`]: textColor,
      [`${prefix}-opacity`]: props.opacity.toString(),
      [`${prefix}-blur`]: `${props.blurRadius}px`,
      [`${prefix}-reflectivity`]: props.reflectivity.toString(),
      [`${prefix}-refraction`]: props.refraction.toString(),
      [`${prefix}-depth`]: props.depth.toString(),
      [`${prefix}-noise-scale`]: props.noiseScale.toString(),
      [`${prefix}-specular`]: props.specularIntensity.toString(),
      [`${prefix}-layer-highlight`]: oklchToString(layers.highlight),
      [`${prefix}-layer-base`]: oklchToString(layers.base),
      [`${prefix}-layer-shadow`]: oklchToString(layers.shadow),
    };

    // Add Apple-style parameters
    if (this.config.translucency !== undefined) {
      vars[`${prefix}-translucency`] = this.config.translucency.toString();
    }

    if (this.config.darkTint) {
      vars[`${prefix}-dark-intensity`] = this.config.darkTint.intensity.toString();
      if (this.config.darkTint.color) {
        vars[`${prefix}-dark-color`] = oklchToString(this.config.darkTint.color);
      }
      if (this.config.darkTint.blendMode) {
        vars[`${prefix}-dark-blend`] = this.config.darkTint.blendMode;
      }
    }

    if (this.config.specular) {
      vars[`${prefix}-specular-enabled`] = this.config.specular.enabled ? '1' : '0';
      vars[`${prefix}-specular-intensity`] = this.config.specular.intensity.toString();
      if (this.config.specular.edges !== undefined) {
        vars[`${prefix}-specular-edges`] = this.config.specular.edges ? '1' : '0';
      }
      if (this.config.specular.corners !== undefined) {
        vars[`${prefix}-specular-corners`] = this.config.specular.corners ? '1' : '0';
      }
      if (this.config.specular.directionAngle !== undefined) {
        vars[`${prefix}-specular-angle`] = `${this.config.specular.directionAngle}deg`;
      }
      if (this.config.specular.sharpness !== undefined) {
        vars[`${prefix}-specular-sharpness`] = this.config.specular.sharpness.toString();
      }
    }

    if (this.config.shadow) {
      vars[`${prefix}-shadow-enabled`] = this.config.shadow.enabled ? '1' : '0';
      if (this.config.shadow.type) {
        vars[`${prefix}-shadow-type`] = this.config.shadow.type;
      }
      vars[`${prefix}-shadow-intensity`] = (this.config.shadow.intensity / 100).toString();

      if (this.config.shadow.inner) {
        vars[`${prefix}-shadow-inner-enabled`] = this.config.shadow.inner.enabled ? '1' : '0';
        vars[`${prefix}-shadow-inner-depth`] = this.config.shadow.inner.depth.toString();
      }

      if (this.config.shadow.outer) {
        vars[`${prefix}-shadow-outer-enabled`] = this.config.shadow.outer.enabled ? '1' : '0';
        vars[`${prefix}-shadow-outer-elevation`] = this.config.shadow.outer.elevation.toString();
      }
    }

    return vars;
  }
}

/**
 * Vibrancy effect for content over glass
 *
 * @example
 * ```ts
 * const vibrancy = new Vibrancy(VibrancyLevel.Primary);
 * const vibrantColor = vibrancy.apply(
 *   { l: 0.5, c: 0.1, h: 240 },
 *   { l: 0.8, c: 0.05, h: 200 }
 * );
 * ```
 */
export class Vibrancy {
  private effect: any;
  private level: VibrancyLevel;

  constructor(level: VibrancyLevel) {
    this.level = level;
    this.effect = null;
  }

  private ensureInitialized() {
    if (this.effect) return;

    if (!wasmInitialized || !wasmModule) {
      this.effect = this.createFallbackEffect();
      return;
    }

    try {
      this.effect = new wasmModule.VibrancyEffect(this.level);
    } catch (error) {
      console.warn('Failed to create WASM VibrancyEffect, using fallback:', error);
      this.effect = this.createFallbackEffect();
    }
  }

  private createFallbackEffect() {
    return {
      apply: (fg: ColorOklch, bg: ColorOklch) => {
        // Simple vibrancy fallback: boost chroma slightly based on level
        const boost = this.level === VibrancyLevel.Primary ? 1.2 :
                      this.level === VibrancyLevel.Secondary ? 1.1 : 1.05;
        return {
          l: fg.l,
          c: Math.min(0.4, fg.c * boost),
          h: fg.h,
        };
      },
      level: this.level,
    };
  }

  /**
   * Apply vibrancy to foreground color given background
   *
   * @param foreground - Foreground color in OKLCH
   * @param background - Background color in OKLCH
   * @returns Vibrant foreground color in OKLCH
   */
  apply(foreground: ColorOklch, background: ColorOklch): ColorOklch {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      return this.effect.apply(foreground, background);
    }

    const fg = new wasmModule.OKLCH(foreground.l, foreground.c, foreground.h);
    const bg = new wasmModule.OKLCH(background.l, background.c, background.h);
    const result = this.effect.apply(fg, bg);

    return { l: result.l, c: result.c, h: result.h };
  }

  /**
   * Get vibrancy level
   */
  getLevel(): VibrancyLevel {
    this.ensureInitialized();
    return this.effect.level;
  }
}

/**
 * Material surface with elevation and optional glass overlay
 *
 * @example
 * ```ts
 * const surface = new Surface(Elevation.Level3, { l: 0.55, c: 0.14, h: 240 });
 * const glass = new LiquidGlass({ variant: GlassVariant.Regular });
 * surface.applyGlass(glass);
 * const color = surface.getSurfaceColor('#FFFFFF');
 * ```
 */
export class Surface {
  private surface: any;
  private elevation: Elevation;
  private themePrimary: ColorOklch;

  constructor(elevation: Elevation, themePrimary: ColorOklch) {
    this.elevation = elevation;
    this.themePrimary = themePrimary;
    this.surface = null;
  }

  private ensureInitialized() {
    if (this.surface) return;

    if (!wasmInitialized || !wasmModule) {
      this.surface = this.createFallbackSurface();
      return;
    }

    try {
      const primary = new wasmModule.OKLCH(this.themePrimary.l, this.themePrimary.c, this.themePrimary.h);
      this.surface = new wasmModule.MaterialSurface(this.elevation, primary);
    } catch (error) {
      console.warn('Failed to create WASM MaterialSurface, using fallback:', error);
      this.surface = this.createFallbackSurface();
    }
  }

  private createFallbackSurface() {
    return {
      surfaceColor: (baseColor: any) => {
        // Simple fallback: blend primary with base based on elevation
        const elevationOpacity = this.elevation * 0.05;
        return {
          toHex: () => {
            // Return a simple blend (this is a simplified fallback)
            return '#E8EBF5';
          }
        };
      },
      elevation: this.elevation,
      surfaceTint: this.themePrimary,
      withGlass: (glass: any) => this.surface,
    };
  }

  /**
   * Apply glass overlay to surface
   *
   * @param glass - LiquidGlass instance
   */
  applyGlass(glass: LiquidGlass): void {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      // Fallback doesn't support glass overlay
      return;
    }

    try {
      // Create a new MaterialSurface with glass
      const primary = this.surface.surfaceTint;
      const newSurface = new wasmModule.MaterialSurface(this.surface.elevation, primary);
      this.surface = newSurface.withGlass((glass as any).glass);
    } catch (error) {
      console.warn('Failed to apply glass to surface:', error);
    }
  }

  /**
   * Get final surface color over base
   *
   * @param baseSurface - Base surface color
   * @returns Final surface color as hex string
   */
  getSurfaceColor(baseSurface: string | {r: number, g: number, b: number}): string {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      return this.surface.surfaceColor(baseSurface).toHex();
    }

    const baseColor = typeof baseSurface === 'string'
      ? wasmModule.Color.fromHex(baseSurface)
      : new wasmModule.Color(baseSurface.r, baseSurface.g, baseSurface.b);

    const result = this.surface.surfaceColor(baseColor);
    return result.toHex();
  }

  /**
   * Get elevation level
   */
  getElevation(): Elevation {
    this.ensureInitialized();
    return this.surface.elevation;
  }

  /**
   * Get surface tint
   */
  getSurfaceTint(): ColorOklch {
    this.ensureInitialized();

    if (!wasmInitialized || !wasmModule) {
      return this.surface.surfaceTint;
    }

    const tint = this.surface.surfaceTint;
    return { l: tint.l, c: tint.c, h: tint.h };
  }
}

/**
 * Factory functions for common glass configurations
 */
export const GlassPresets = {
  /**
   * Regular adaptive glass (default)
   */
  regular: () => new LiquidGlass({ variant: GlassVariant.Regular }),

  /**
   * Clear glass for rich content
   */
  clear: () => new LiquidGlass({ variant: GlassVariant.Clear }),

  /**
   * Tinted glass with custom hue
   */
  tinted: (hue: number, lightness: number = 0.95, chroma: number = 0.02) =>
    new LiquidGlass({
      variant: GlassVariant.Regular,
      baseTint: { l: lightness, c: chroma, h: hue },
    }),

  /**
   * Extra thick glass for modals
   */
  thick: () => new LiquidGlass({
    variant: GlassVariant.Regular,
    opacity: 0.9,
    blurRadius: 30,
    depth: 0.8,
  }),

  /**
   * Subtle glass for overlays
   */
  subtle: () => new LiquidGlass({
    variant: GlassVariant.Clear,
    opacity: 0.4,
    blurRadius: 15,
  }),

  /**
   * Apple-style Liquid Glass (matching macOS parameters from image)
   * Specular: ON, Blur: 21.8%, Translucency: 50%, Dark: 42%, Shadow: Neutral 50%
   */
  appleStyle: () => new LiquidGlass({
    variant: GlassVariant.Regular,
    blurRadius: 21.8,
    translucency: 0.50,  // 50% translucency (light passes but diffuses)
    opacity: 0.85,       // Base opacity for material presence
    darkTint: {
      intensity: 0.42,   // 42% dark tint
      color: { l: 0.25, c: 0.01, h: 240 },  // Neutral gray
      blendMode: 'multiply',
    },
    specular: {
      enabled: true,
      intensity: 0.65,
      edges: true,
      corners: true,
      directionAngle: 135,
      sharpness: 0.7,
    },
    shadow: {
      enabled: true,
      type: 'neutral',
      intensity: 50,  // 50% intensity
      inner: {
        enabled: true,
        depth: 0.8,
      },
      outer: {
        enabled: true,
        elevation: 2,
      },
    },
    refraction: 1.52,
    depth: 0.9,
    reflectivity: 0.18,
  }),

  /**
   * Apple-style Clear Glass (high translucency, minimal dark tint)
   */
  appleClear: () => new LiquidGlass({
    variant: GlassVariant.Clear,
    blurRadius: 15,
    translucency: 0.75,   // More translucent
    opacity: 0.70,
    darkTint: {
      intensity: 0.15,    // Light tint only
      color: { l: 0.30, c: 0.01, h: 240 },
      blendMode: 'multiply',
    },
    specular: {
      enabled: true,
      intensity: 0.55,
      edges: true,
      corners: false,
      sharpness: 0.6,
    },
    shadow: {
      enabled: true,
      type: 'neutral',
      intensity: 35,
      inner: {
        enabled: true,
        depth: 0.5,
      },
      outer: {
        enabled: true,
        elevation: 1,
      },
    },
  }),

  /**
   * Apple-style Thick Glass (heavy material, strong dark tint)
   */
  appleThick: () => new LiquidGlass({
    variant: GlassVariant.Regular,
    blurRadius: 30,
    translucency: 0.35,   // Less translucent (heavier material)
    opacity: 0.92,
    darkTint: {
      intensity: 0.60,    // Strong dark tint
      color: { l: 0.20, c: 0.01, h: 240 },
      blendMode: 'multiply',
    },
    specular: {
      enabled: true,
      intensity: 0.75,
      edges: true,
      corners: true,
      directionAngle: 135,
      sharpness: 0.8,
    },
    shadow: {
      enabled: true,
      type: 'neutral',
      intensity: 65,
      inner: {
        enabled: true,
        depth: 1.2,
      },
      outer: {
        enabled: true,
        elevation: 4,
      },
    },
    refraction: 1.60,
    depth: 1.3,
    reflectivity: 0.25,
  }),
};

// ============================================================================
// Glass Physics System
// ============================================================================

export type OpticalPropertiesConfig = {
  absorptionCoefficient: number;
  scatteringCoefficient: number;
  thickness: number;
  refractiveIndex: number;
};

export type LayerTransmittanceResult = {
  surface: number;  // Edge highlight layer
  volume: number;   // Main glass body
  substrate: number; // Deep contact shadow
};

/**
 * Glass Physics Engine
 *
 * Provides Beer-Lambert transmittance calculations and multi-layer
 * glass composition for physically-accurate rendering.
 *
 * @example
 * ```ts
 * const physics = new GlassPhysics({
 *   absorptionCoefficient: 0.2,
 *   scatteringCoefficient: 0.3,
 *   thickness: 1.5,
 *   refractiveIndex: 1.5,
 * });
 *
 * const layers = physics.calculateTransmittance(1.0);
 * console.log(`Surface: ${layers.surface}, Volume: ${layers.volume}`);
 * ```
 */
export class GlassPhysics {
  private opticalProps: OpticalPropertiesConfig;

  constructor(config: OpticalPropertiesConfig) {
    this.opticalProps = config;
  }

  /**
   * Calculate multi-layer transmittance using Beer-Lambert law
   *
   * @param incidentIntensity - Incoming light intensity (0.0-1.0)
   * @returns Layer-separated transmittance values
   */
  calculateTransmittance(incidentIntensity: number = 1.0): LayerTransmittanceResult {
    if (!wasmInitialized || !wasmModule) {
      // Fallback: simple exponential decay
      const decay = Math.exp(-this.opticalProps.absorptionCoefficient * this.opticalProps.thickness);
      const scatter = this.opticalProps.scatteringCoefficient * 0.3;

      return {
        surface: scatter,
        volume: decay * (1 - scatter),
        substrate: decay * (1 - scatter) * 0.7,
      };
    }

    try {
      const optical = new wasmModule.OpticalProperties(
        this.opticalProps.absorptionCoefficient,
        this.opticalProps.scatteringCoefficient,
        this.opticalProps.thickness,
        this.opticalProps.refractiveIndex
      );

      const result = wasmModule.calculateMultiLayerTransmittance(optical, incidentIntensity);

      return {
        surface: result.surface,
        volume: result.volume,
        substrate: result.substrate,
      };
    } catch (error) {
      console.warn('Failed to calculate transmittance, using fallback:', error);
      const decay = Math.exp(-this.opticalProps.absorptionCoefficient * this.opticalProps.thickness);
      const scatter = this.opticalProps.scatteringCoefficient * 0.3;

      return {
        surface: scatter,
        volume: decay * (1 - scatter),
        substrate: decay * (1 - scatter) * 0.7,
      };
    }
  }

  /**
   * Get optical properties
   */
  getProperties(): OpticalPropertiesConfig {
    return { ...this.opticalProps };
  }
}

/**
 * Optical property presets for common glass types
 */
export const OpticalPresets = {
  /** Standard window glass - Clear, minimal absorption */
  window: (): OpticalPropertiesConfig => ({
    absorptionCoefficient: 0.08,
    scatteringCoefficient: 0.05,
    thickness: 0.8,
    refractiveIndex: 1.52,
  }),

  /** Frosted glass - Heavy scattering, soft appearance */
  frosted: (): OpticalPropertiesConfig => ({
    absorptionCoefficient: 0.12,
    scatteringCoefficient: 0.85,
    thickness: 1.2,
    refractiveIndex: 1.5,
  }),

  /** Thick decorative glass - High absorption, visible tint */
  thick: (): OpticalPropertiesConfig => ({
    absorptionCoefficient: 0.35,
    scatteringCoefficient: 0.3,
    thickness: 3.0,
    refractiveIndex: 1.6,
  }),

  /** Subtle overlay glass - Very transparent, minimal effect */
  subtle: (): OpticalPropertiesConfig => ({
    absorptionCoefficient: 0.05,
    scatteringCoefficient: 0.15,
    thickness: 0.4,
    refractiveIndex: 1.45,
  }),
};

// ============================================================================
// Shadow Engine
// ============================================================================

/**
 * Elevation levels for shadow calculation (0-24 scale)
 */
export const ElevationLevels = {
  LEVEL_0: 0,  // Flush with surface
  LEVEL_1: 1,  // Standard buttons
  LEVEL_2: 3,  // Hover states
  LEVEL_3: 6,  // Floating cards
  LEVEL_4: 10, // Modals, sheets
  LEVEL_5: 16, // Dropdowns, tooltips
  LEVEL_6: 24, // Drag states
} as const;

/**
 * Shadow Engine
 *
 * Calculates physically-inspired multi-layer shadows (contact + ambient)
 * based on elevation and background color.
 *
 * @example
 * ```ts
 * const shadowEngine = new ShadowEngine();
 * const shadow = shadowEngine.calculateShadow(
 *   ElevationLevels.LEVEL_2, // Hover state
 *   { l: 0.95, c: 0.01, h: 240 }, // Light background
 *   1.0 // Glass depth
 * );
 *
 * // Apply to element
 * element.style.boxShadow = shadow;
 * ```
 */
export class ShadowEngine {
  /**
   * Calculate complete shadow system for glass element
   *
   * @param elevation - Elevation level (0-24)
   * @param background - Background color in OKLCH
   * @param glassDepth - Perceived thickness of glass (0.0-2.0)
   * @returns CSS box-shadow string
   */
  calculateShadow(
    elevation: number,
    background: ColorOklch,
    glassDepth: number = 1.0
  ): string {
    if (!wasmInitialized || !wasmModule) {
      // Fallback: simple shadow based on elevation
      const blur = 8 + elevation * 1.5;
      const offsetY = 2 + elevation * 0.5;
      const opacity = 0.15 + elevation * 0.015;

      return `0 ${offsetY}px ${blur}px rgba(0, 0, 0, ${opacity})`;
    }

    try {
      const bg = new wasmModule.OKLCH(background.l, background.c, background.h);
      const elevationShadow = wasmModule.calculateElevationShadow(elevation, bg, glassDepth);
      return elevationShadow.toCSS();
    } catch (error) {
      console.warn('Failed to calculate elevation shadow, using fallback:', error);
      const blur = 8 + elevation * 1.5;
      const offsetY = 2 + elevation * 0.5;
      const opacity = 0.15 + elevation * 0.015;

      return `0 ${offsetY}px ${blur}px rgba(0, 0, 0, ${opacity})`;
    }
  }

  /**
   * Get elevation preset values
   */
  static get Levels() {
    return ElevationLevels;
  }
}

/**
 * Interactive shadow transitions for UI elements
 */
export type ShadowTransition = {
  rest: number;
  hover: number;
  active: number;
  focus: number;
};

/**
 * Shadow transition presets for common UI patterns
 */
export const ShadowTransitions = {
  /** Standard button elevation transitions */
  button: (): ShadowTransition => ({
    rest: ElevationLevels.LEVEL_1,
    hover: ElevationLevels.LEVEL_2,
    active: ElevationLevels.LEVEL_0, // Press down
    focus: ElevationLevels.LEVEL_1,
  }),

  /** Card elevation transitions */
  card: (): ShadowTransition => ({
    rest: ElevationLevels.LEVEL_2,
    hover: ElevationLevels.LEVEL_3,
    active: ElevationLevels.LEVEL_2,
    focus: ElevationLevels.LEVEL_3,
  }),

  /** Modal elevation (no transitions) */
  modal: (): ShadowTransition => ({
    rest: ElevationLevels.LEVEL_4,
    hover: ElevationLevels.LEVEL_4,
    active: ElevationLevels.LEVEL_4,
    focus: ElevationLevels.LEVEL_4,
  }),

  /** Draggable element transitions */
  draggable: (): ShadowTransition => ({
    rest: ElevationLevels.LEVEL_1,
    hover: ElevationLevels.LEVEL_3,
    active: ElevationLevels.LEVEL_6, // Lift high when dragging
    focus: ElevationLevels.LEVEL_2,
  }),
};
