// ============================================
// WCAG 2.1 Contrast Value Object
// Pure Domain Logic for WCAG 2.x Contrast Ratio
// ============================================
//
// Implements the WCAG 2.1 contrast ratio algorithm as defined in:
// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
//
// This is a VALUE OBJECT - immutable and side-effect free.
// All methods return new instances or primitives.
//
// Note: WCAG 2.x uses relative luminance (Y in CIE XYZ).
// For modern accessibility, prefer APCA (WCAG 3.0).
//
// ============================================

/**
 * WCAG 2.1 conformance levels
 */
export type WCAGLevel = 'AA' | 'AAA';

/**
 * Text size categories for WCAG
 */
export type WCAGTextSize = 'normal' | 'large';

/**
 * WCAG 2.1 Contrast Requirements
 */
export const WCAG_REQUIREMENTS = {
  AA: {
    normal: 4.5,  // Normal text: 4.5:1
    large: 3.0,   // Large text: 3:1
  },
  AAA: {
    normal: 7.0,  // Normal text: 7:1
    large: 4.5,   // Large text: 4.5:1
  },
} as const;

/**
 * WCAG text size definition:
 * - Large text: 18pt (24px) or 14pt (18.66px) bold
 * - Normal text: anything smaller
 */
export function isLargeText(fontSizePx: number, fontWeight: number): boolean {
  if (fontSizePx >= 24) return true;
  if (fontSizePx >= 18.66 && fontWeight >= 700) return true;
  return false;
}

/**
 * WCAGContrast Value Object
 *
 * Represents a WCAG 2.1 contrast ratio between two colors.
 * Immutable and deterministic.
 *
 * @example
 * ```typescript
 * const contrast = WCAGContrast.fromHex('#000000', '#FFFFFF');
 * console.log(contrast.ratio);           // 21
 * console.log(contrast.passes('AA'));    // true
 * console.log(contrast.level());         // 'AAA'
 * ```
 */
export default class WCAGContrast {
  private constructor(
    private readonly _ratio: number,
    private readonly _foregroundLuminance: number,
    private readonly _backgroundLuminance: number
  ) {}

  // ============================================
  // Factory Methods
  // ============================================

  /**
   * Create WCAGContrast from hex color strings
   *
   * @param foreground - Foreground color (text) in hex format
   * @param background - Background color in hex format
   * @returns WCAGContrast instance or null if invalid input
   *
   * @example
   * ```typescript
   * const contrast = WCAGContrast.fromHex('#333333', '#FFFFFF');
   * ```
   */
  static fromHex(foreground: string, background: string): WCAGContrast | null {
    const fgLum = this.relativeLuminance(foreground);
    const bgLum = this.relativeLuminance(background);

    if (fgLum === null || bgLum === null) {
      return null;
    }

    const ratio = this.calculateRatio(fgLum, bgLum);
    return new WCAGContrast(ratio, fgLum, bgLum);
  }

  /**
   * Create WCAGContrast from RGB values
   *
   * @param fgR - Foreground red (0-255)
   * @param fgG - Foreground green (0-255)
   * @param fgB - Foreground blue (0-255)
   * @param bgR - Background red (0-255)
   * @param bgG - Background green (0-255)
   * @param bgB - Background blue (0-255)
   * @returns WCAGContrast instance
   *
   * @example
   * ```typescript
   * const contrast = WCAGContrast.fromRGB(51, 51, 51, 255, 255, 255);
   * ```
   */
  static fromRGB(
    fgR: number,
    fgG: number,
    fgB: number,
    bgR: number,
    bgG: number,
    bgB: number
  ): WCAGContrast {
    const fgLum = this.luminanceFromRGB(fgR, fgG, fgB);
    const bgLum = this.luminanceFromRGB(bgR, bgG, bgB);
    const ratio = this.calculateRatio(fgLum, bgLum);

    return new WCAGContrast(ratio, fgLum, bgLum);
  }

  /**
   * Create WCAGContrast from pre-calculated luminance values
   *
   * @param foregroundLuminance - Foreground relative luminance (0-1)
   * @param backgroundLuminance - Background relative luminance (0-1)
   * @returns WCAGContrast instance
   */
  static fromLuminance(
    foregroundLuminance: number,
    backgroundLuminance: number
  ): WCAGContrast {
    const ratio = this.calculateRatio(foregroundLuminance, backgroundLuminance);
    return new WCAGContrast(ratio, foregroundLuminance, backgroundLuminance);
  }

  // ============================================
  // Getters
  // ============================================

  /**
   * Get the WCAG 2.1 contrast ratio
   *
   * Range: 1:1 (no contrast) to 21:1 (maximum contrast)
   *
   * @example
   * ```typescript
   * const contrast = WCAGContrast.fromHex('#000', '#FFF');
   * console.log(contrast.ratio); // 21
   * ```
   */
  get ratio(): number {
    return this._ratio;
  }

  /**
   * Get foreground relative luminance
   *
   * Range: 0 (black) to 1 (white)
   */
  get foregroundLuminance(): number {
    return this._foregroundLuminance;
  }

  /**
   * Get background relative luminance
   *
   * Range: 0 (black) to 1 (white)
   */
  get backgroundLuminance(): number {
    return this._backgroundLuminance;
  }

  // ============================================
  // Validation Methods
  // ============================================

  /**
   * Check if contrast passes a specific WCAG level
   *
   * @param level - WCAG level to check ('AA' or 'AAA')
   * @param textSize - Text size category ('normal' or 'large')
   * @returns true if contrast meets or exceeds the requirement
   *
   * @example
   * ```typescript
   * const contrast = WCAGContrast.fromHex('#333', '#FFF');
   * contrast.passes('AA', 'normal');  // true if ratio >= 4.5
   * contrast.passes('AAA', 'large');  // true if ratio >= 4.5
   * ```
   */
  passes(level: WCAGLevel, textSize: WCAGTextSize = 'normal'): boolean {
    const requirement = WCAG_REQUIREMENTS[level][textSize];
    return this._ratio >= requirement;
  }

  /**
   * Check if contrast passes for a given font size and weight
   *
   * @param level - WCAG level to check
   * @param fontSizePx - Font size in pixels
   * @param fontWeight - Font weight (400 = normal, 700 = bold)
   * @returns true if contrast meets the requirement
   *
   * @example
   * ```typescript
   * contrast.passesForFont('AA', 16, 400);  // Normal text
   * contrast.passesForFont('AA', 24, 400);  // Large text
   * ```
   */
  passesForFont(
    level: WCAGLevel,
    fontSizePx: number,
    fontWeight: number = 400
  ): boolean {
    const textSize = isLargeText(fontSizePx, fontWeight) ? 'large' : 'normal';
    return this.passes(level, textSize);
  }

  /**
   * Get the highest WCAG level this contrast achieves
   *
   * @param textSize - Text size category
   * @returns 'AAA', 'AA', or null if neither is met
   *
   * @example
   * ```typescript
   * const contrast = WCAGContrast.fromHex('#333', '#FFF');
   * console.log(contrast.level('normal')); // 'AAA'
   * ```
   */
  level(textSize: WCAGTextSize = 'normal'): WCAGLevel | null {
    if (this.passes('AAA', textSize)) return 'AAA';
    if (this.passes('AA', textSize)) return 'AA';
    return null;
  }

  /**
   * Get the highest level for a specific font
   */
  levelForFont(fontSizePx: number, fontWeight: number = 400): WCAGLevel | null {
    const textSize = isLargeText(fontSizePx, fontWeight) ? 'large' : 'normal';
    return this.level(textSize);
  }

  // ============================================
  // Utility Methods
  // ============================================

  /**
   * Get a formatted ratio string
   *
   * @param precision - Number of decimal places
   * @returns Formatted ratio (e.g., "4.5:1")
   *
   * @example
   * ```typescript
   * contrast.toRatioString(1); // "4.5:1"
   * ```
   */
  toRatioString(precision: number = 2): string {
    return `${this._ratio.toFixed(precision)}:1`;
  }

  /**
   * Get minimum adjustment needed to meet a level
   *
   * Returns how much the lighter color needs to lighten
   * or the darker color needs to darken to meet the requirement.
   *
   * @param level - Target WCAG level
   * @param textSize - Text size category
   * @returns Adjustment factor (0 = no adjustment needed, 1 = maximum)
   *
   * @example
   * ```typescript
   * const adjustment = contrast.adjustmentNeeded('AA', 'normal');
   * ```
   */
  adjustmentNeeded(
    level: WCAGLevel,
    textSize: WCAGTextSize = 'normal'
  ): number {
    const requirement = WCAG_REQUIREMENTS[level][textSize];
    if (this._ratio >= requirement) return 0;

    // Calculate how much adjustment is needed
    // This is a simplified heuristic
    const deficit = requirement - this._ratio;
    return Math.min(deficit / requirement, 1);
  }

  // ============================================
  // Comparison Methods
  // ============================================

  /**
   * Compare with another WCAGContrast
   *
   * @returns true if ratios are equal (within epsilon)
   */
  equals(other: WCAGContrast): boolean {
    const epsilon = 0.001;
    return Math.abs(this._ratio - other._ratio) < epsilon;
  }

  /**
   * Check if this contrast is better than another
   *
   * @returns true if this ratio is higher
   */
  isBetterThan(other: WCAGContrast): boolean {
    return this._ratio > other._ratio;
  }

  // ============================================
  // Static Calculation Methods
  // ============================================

  /**
   * Calculate relative luminance from hex color
   *
   * Implements WCAG 2.1 relative luminance formula:
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   *
   * @param hex - Color in hex format (#RRGGBB or RRGGBB)
   * @returns Relative luminance (0-1) or null if invalid
   */
  private static relativeLuminance(hex: string): number | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result || !result[1] || !result[2] || !result[3]) {
      return null;
    }

    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);

    return this.luminanceFromRGB(r, g, b);
  }

  /**
   * Calculate relative luminance from RGB values
   *
   * @param r - Red channel (0-255)
   * @param g - Green channel (0-255)
   * @param b - Blue channel (0-255)
   * @returns Relative luminance (0-1)
   */
  private static luminanceFromRGB(r: number, g: number, b: number): number {
    // Convert to 0-1 range
    const rs = r / 255;
    const gs = g / 255;
    const bs = b / 255;

    // Apply gamma correction
    const rLin = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
    const gLin = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
    const bLin = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);

    // Calculate relative luminance using sRGB weights
    // These are the official WCAG 2.1 coefficients
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  }

  /**
   * Calculate contrast ratio from two luminance values
   *
   * Formula: (L1 + 0.05) / (L2 + 0.05)
   * where L1 is the lighter luminance and L2 is the darker
   *
   * @param lum1 - First luminance value
   * @param lum2 - Second luminance value
   * @returns Contrast ratio (1-21)
   */
  private static calculateRatio(lum1: number, lum2: number): number {
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  // ============================================
  // Serialization
  // ============================================

  /**
   * Convert to JSON representation
   */
  toJSON(): {
    ratio: number;
    foregroundLuminance: number;
    backgroundLuminance: number;
    passes: {
      AA_normal: boolean;
      AA_large: boolean;
      AAA_normal: boolean;
      AAA_large: boolean;
    };
  } {
    return {
      ratio: this._ratio,
      foregroundLuminance: this._foregroundLuminance,
      backgroundLuminance: this._backgroundLuminance,
      passes: {
        AA_normal: this.passes('AA', 'normal'),
        AA_large: this.passes('AA', 'large'),
        AAA_normal: this.passes('AAA', 'normal'),
        AAA_large: this.passes('AAA', 'large'),
      },
    };
  }

  /**
   * String representation
   */
  toString(): string {
    return `WCAGContrast(${this.toRatioString()})`;
  }
}
