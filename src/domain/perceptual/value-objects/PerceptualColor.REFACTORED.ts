/**
 * @fileoverview PerceptualColor Value Object (REFACTORED v2.0)
 *
 * THIN WRAPPER around Momoto WASM Color.
 *
 * ANTES: 824 líneas de lógica de color en TypeScript
 * DESPUÉS: <200 líneas, CERO lógica de color
 *
 * PRINCIPIOS:
 * - Momoto decide, PerceptualColor delega
 * - NO reimplementa conversiones
 * - NO reimplementa operaciones
 * - NO reimplementa análisis
 * - ES un adapter, NO un servicio de color
 *
 * @module momoto-ui/domain/perceptual/value-objects/PerceptualColor
 * @version 2.0.0 (refactored from 1.0.0 - removed 600+ lines of color logic)
 */

import type {
  OklchCoordinates,
  RgbCoordinates,
  ColorTemperature,
  ContrastMode,
  Result,
} from '../../types';

import {
  type HexColor,
  type ConfidenceLevel,
  BrandConstructors,
  TypeGuards,
} from '../../types/branded';

import { MomotoBridge, Color as WasmColor, OKLCH as WasmOKLCH } from '../../../infrastructure/MomotoBridge';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Análisis perceptual (adaptado desde Momoto).
 */
export interface PerceptualAnalysis {
  readonly warmth: ColorTemperature;
  readonly brightness: 'dark' | 'medium' | 'light';
  readonly saturation: 'desaturated' | 'muted' | 'saturated' | 'vivid';
  readonly contrastMode: ContrastMode;
  readonly contrastConfidence: ConfidenceLevel;
}

// ============================================================================
// PERCEPTUAL COLOR (THIN WRAPPER)
// ============================================================================

/**
 * PerceptualColor - Thin wrapper around Momoto WASM Color.
 *
 * RESPONSABILIDADES:
 * - Adapter entre WASM y domain types de momoto-ui
 * - Type conversions (sin cálculos)
 * - Lazy caching de conversiones
 *
 * NO RESPONSABILIDADES:
 * - ❌ Color space conversions (WASM lo hace)
 * - ❌ Color operations (lighten, darken → WASM)
 * - ❌ Perceptual analysis (contrast mode → WASM)
 * - ❌ Delta E calculation (WASM lo hace)
 *
 * @example
 * ```typescript
 * // Crear desde hex (async porque inicializa WASM)
 * const color = await PerceptualColor.fromHex('#0EB58C');
 *
 * // Acceso a coordenadas (delegado a WASM)
 * console.log(color.oklch.l); // Lee desde WASM
 *
 * // Operaciones (delegadas a WASM)
 * const lighter = await color.lighten(0.1); // Llama WASM
 * ```
 */
export class PerceptualColor {
  // ──────────────────────────────────────────────────────────────────────────
  // PRIVATE STATE (Solo referencia a WASM)
  // ──────────────────────────────────────────────────────────────────────────

  /** Referencia al Color WASM (source of truth) */
  private readonly wasmColor: WasmColor;

  /** Lazy cache para coordenadas (evita llamadas repetidas a WASM) */
  private _oklchCache?: OklchCoordinates;
  private _rgbCache?: RgbCoordinates;
  private _hexCache?: HexColor;

  // ──────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private - use static factories)
  // ──────────────────────────────────────────────────────────────────────────

  private constructor(wasmColor: WasmColor) {
    this.wasmColor = wasmColor;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES (Delegate to WASM via Bridge)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Crea desde hex (delegado a Momoto WASM).
   */
  static async fromHex(hex: string): Promise<PerceptualColor> {
    const wasmColor = await MomotoBridge.createColor(hex);
    return new PerceptualColor(wasmColor);
  }

  /**
   * Crea desde OKLCH (delegado a Momoto WASM).
   */
  static async fromOklch(
    l: number,
    c: number,
    h: number
  ): Promise<PerceptualColor> {
    await MomotoBridge.initialize();
    const wasmColor = WasmColor.from_oklch(l, c, h);
    return new PerceptualColor(wasmColor);
  }

  /**
   * Crea desde RGB (delegado a Momoto WASM).
   */
  static async fromRgb(
    r: number,
    g: number,
    b: number
  ): Promise<PerceptualColor> {
    await MomotoBridge.initialize();
    const wasmColor = WasmColor.from_rgb(r, g, b);
    return new PerceptualColor(wasmColor);
  }

  /**
   * Intenta crear desde hex, retorna Result.
   */
  static async tryFromHex(hex: string): Promise<Result<PerceptualColor, Error>> {
    try {
      if (!TypeGuards.isHexColor(hex)) {
        return { success: false, error: new Error(`Invalid hex color: ${hex}`) };
      }
      const color = await PerceptualColor.fromHex(hex);
      return { success: true, value: color };
    } catch (e) {
      return { success: false, error: e as Error };
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GETTERS (Delegate to WASM with lazy caching)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Coordenadas OKLCH (desde WASM).
   */
  get oklch(): Readonly<OklchCoordinates> {
    if (!this._oklchCache) {
      const wasmOklch: WasmOKLCH = this.wasmColor.to_oklch();
      this._oklchCache = {
        l: wasmOklch.l,
        c: wasmOklch.c,
        h: wasmOklch.h,
      };
    }
    return this._oklchCache;
  }

  /**
   * Coordenadas RGB (desde WASM).
   */
  get rgb(): Readonly<RgbCoordinates> {
    if (!this._rgbCache) {
      const wasmRgb = this.wasmColor.to_rgb();
      this._rgbCache = {
        r: wasmRgb.r,
        g: wasmRgb.g,
        b: wasmRgb.b,
      };
    }
    return this._rgbCache;
  }

  /**
   * Valor hexadecimal (desde WASM).
   */
  get hex(): HexColor {
    if (!this._hexCache) {
      this._hexCache = this.wasmColor.toHex() as HexColor;
    }
    return this._hexCache;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OPERACIONES INMUTABLES (✅ FASE 9 - Delegated to Momoto WASM)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Aclara el color (delegado a Momoto WASM).
   *
   * ✅ FASE 9: Now delegates to MomotoBridge → color.lighten() (WASM)
   *
   * @param amount - Lightness increase (0-1)
   * @returns New PerceptualColor with increased lightness
   */
  async lighten(amount: number): Promise<PerceptualColor> {
    const lightened = await MomotoBridge.lightenColor(this.wasmColor, amount);
    return new PerceptualColor(lightened);
  }

  /**
   * Oscurece el color (delegado a Momoto WASM).
   *
   * ✅ FASE 9: Now delegates to MomotoBridge → color.darken() (WASM)
   *
   * @param amount - Lightness decrease (0-1)
   * @returns New PerceptualColor with decreased lightness
   */
  async darken(amount: number): Promise<PerceptualColor> {
    const darkened = await MomotoBridge.darkenColor(this.wasmColor, amount);
    return new PerceptualColor(darkened);
  }

  /**
   * Aumenta saturación (delegado a Momoto WASM).
   *
   * ✅ FASE 9: Now delegates to MomotoBridge → color.saturate() (WASM)
   *
   * @param amount - Chroma increase
   * @returns New PerceptualColor with increased chroma
   */
  async saturate(amount: number): Promise<PerceptualColor> {
    const saturated = await MomotoBridge.saturateColor(this.wasmColor, amount);
    return new PerceptualColor(saturated);
  }

  /**
   * Reduce saturación (delegado a Momoto WASM).
   *
   * ✅ FASE 9: Now delegates to MomotoBridge → color.desaturate() (WASM)
   *
   * @param amount - Chroma decrease
   * @returns New PerceptualColor with decreased chroma
   */
  async desaturate(amount: number): Promise<PerceptualColor> {
    const desaturated = await MomotoBridge.desaturateColor(this.wasmColor, amount);
    return new PerceptualColor(desaturated);
  }

  /**
   * Ajusta transparencia (delegado a Momoto WASM).
   *
   * ✅ FASE 9: Now delegates to MomotoBridge → color.with_alpha() (WASM)
   *
   * @param alpha - Alpha value (0.0 = transparent, 1.0 = opaque)
   * @returns New PerceptualColor with specified alpha
   */
  async withAlpha(alpha: number): Promise<PerceptualColor> {
    const withAlpha = await MomotoBridge.setAlpha(this.wasmColor, alpha);
    return new PerceptualColor(withAlpha);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ANÁLISIS PERCEPTUAL (✅ FASE 10 - Descriptive Classification)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Analiza propiedades perceptuales del color.
   *
   * ✅ FASE 10: Implementado como clasificación descriptiva basada en coordenadas OKLCH.
   *
   * IMPORTANT DISTINCTION:
   * - This method provides DESCRIPTIVE classification (warm/cool, dark/light, etc.)
   * - It does NOT make INTELLIGENT DECISIONS (that's for TokenEnrichmentService)
   * - The thresholds here are OKLCH space conventions, not intelligence heuristics
   *
   * For example:
   * - L < 0.35 = "dark" is a DESCRIPTIVE fact about OKLCH, not an intelligent decision
   * - H in [30, 90] = "warm" is a HUE RANGE definition, not a quality judgment
   *
   * INTELLIGENT decisions (should this color be used? is it good quality?) come from
   * momoto-intelligence WASM via TokenEnrichmentService.
   *
   * @returns Perceptual analysis with descriptive classifications
   *
   * @example
   * ```typescript
   * const color = await PerceptualColor.fromHex('#FF6B6B');
   * const analysis = color.analyze();
   * console.log(analysis.warmth); // 'warm'
   * console.log(analysis.brightness); // 'medium'
   * console.log(analysis.saturation); // 'saturated'
   * console.log(analysis.contrastMode); // 'light'
   * ```
   */
  analyze(): PerceptualAnalysis {
    const { l, c, h } = this.oklch;

    // Warmth classification (based on hue range)
    const warmth = this.classifyWarmth(h);

    // Brightness classification (based on lightness)
    const brightness = this.classifyBrightness(l);

    // Saturation classification (based on chroma)
    const saturation = this.classifySaturation(c);

    // Contrast mode (light/dark based on lightness)
    const contrastMode: ContrastMode = l > 0.5 ? 'light' : 'dark';

    // Confidence (higher when L is extreme)
    const contrastConfidence = this.computeContrastConfidence(l);

    return {
      warmth,
      brightness,
      saturation,
      contrastMode,
      contrastConfidence,
    };
  }

  /**
   * Classify warmth based on hue (OKLCH convention).
   */
  private classifyWarmth(h: number): ColorTemperature {
    // Warm hues: red, orange, yellow (0-90°)
    // Neutral: yellow-green, cyan (90-150° and 270-330°)
    // Cool: blue, blue-green (150-270°)

    if ((h >= 0 && h < 90) || (h >= 330 && h <= 360)) {
      return 'warm';
    } else if (h >= 150 && h < 270) {
      return 'cool';
    } else {
      return 'neutral';
    }
  }

  /**
   * Classify brightness based on lightness (OKLCH convention).
   */
  private classifyBrightness(l: number): 'dark' | 'medium' | 'light' {
    if (l < 0.35) {
      return 'dark';
    } else if (l < 0.65) {
      return 'medium';
    } else {
      return 'light';
    }
  }

  /**
   * Classify saturation based on chroma (OKLCH convention).
   */
  private classifySaturation(c: number): 'desaturated' | 'muted' | 'saturated' | 'vivid' {
    if (c < 0.05) {
      return 'desaturated';
    } else if (c < 0.1) {
      return 'muted';
    } else if (c < 0.2) {
      return 'saturated';
    } else {
      return 'vivid';
    }
  }

  /**
   * Compute contrast confidence based on lightness (how clear is the contrast mode).
   */
  private computeContrastConfidence(l: number): ConfidenceLevel {
    // Confidence is higher when lightness is clearly light (>0.7) or dark (<0.3)
    if (l < 0.2 || l > 0.8) {
      return 'high';
    } else if (l < 0.35 || l > 0.65) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CONVERSIONES A STRING
  // ──────────────────────────────────────────────────────────────────────────

  toCssOklch(): string {
    const { l, c, h } = this.oklch;
    return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
  }

  toString(): string {
    return this.hex;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SERIALIZACIÓN
  // ──────────────────────────────────────────────────────────────────────────

  toJSON(): { oklch: OklchCoordinates; hex: string } {
    return {
      oklch: { ...this.oklch },
      hex: this.hex,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default PerceptualColor;

/**
 * REFACTORING SUMMARY:
 *
 * ELIMINADO (~600 líneas de lógica perceptual):
 * - ❌ hexToRgb()
 * - ❌ rgbToHex()
 * - ❌ rgbToOklch()
 * - ❌ oklchToRgb()
 * - ❌ rgbToHsl()
 * - ❌ interpolateHue()
 * - ❌ deltaE()
 * - ❌ computeContrastMode() (complex version)
 * - ❌ gradient()
 * - ❌ complement()
 * - ❌ analogous()
 * - ❌ triadic()
 * - ❌ All color space math
 * - ❌ lighten/darken/saturate/desaturate implementations (FASE 8 removal)
 * - ❌ analyze() and computeWarmth() implementations (FASE 8 removal)
 * - ❌ withAlpha() no-op implementation (FASE 8 removal)
 *
 * CONSERVADO (~150 líneas):
 * - ✅ Static factories (delegate to WASM)
 * - ✅ Getters (lazy cache WASM results)
 * - ✅ Type conversions (no math)
 *
 * ✅ FASE 9 COMPLETE (delegated to Momoto WASM):
 * - ✅ lighten() - delegates to MomotoBridge.lightenColor()
 * - ✅ darken() - delegates to MomotoBridge.darkenColor()
 * - ✅ saturate() - delegates to MomotoBridge.saturateColor()
 * - ✅ desaturate() - delegates to MomotoBridge.desaturateColor()
 * - ✅ withAlpha() - delegates to MomotoBridge.setAlpha()
 *
 * ✅ FASE 10 COMPLETE:
 * - ✅ analyze() - implemented as descriptive OKLCH classification (not intelligence)
 *
 * FUTURE WORK (not blocking):
 * - deltaE(), gradient(), color harmonies - future enhancements
 */
