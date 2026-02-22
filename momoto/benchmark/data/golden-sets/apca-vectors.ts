/**
 * APCA Golden Test Vectors
 *
 * Source: Myndex SAPC-APCA Reference Implementation
 * Version: SAPC-4g / APCA-W3 0.1.9
 * Reference: https://github.com/Myndex/SAPC-APCA
 *
 * These vectors are canonical and should not be modified.
 */

export interface APCATestVector {
  readonly name: string;
  readonly description: string;
  readonly foreground: {
    readonly hex: string;
    readonly rgb: readonly [number, number, number];
  };
  readonly background: {
    readonly hex: string;
    readonly rgb: readonly [number, number, number];
  };
  readonly expected: {
    readonly lc: number;
    readonly polarity: 'dark-on-light' | 'light-on-dark';
    readonly tolerance: number;
  };
  readonly category: 'standard' | 'edge-case' | 'regression';
}

export const APCA_GOLDEN_VECTORS: readonly APCATestVector[] = [
  // Standard cases - maximum contrast
  {
    name: 'Black on White',
    description: 'Maximum positive contrast (dark text on light background)',
    foreground: { hex: '#000000', rgb: [0, 0, 0] },
    background: { hex: '#FFFFFF', rgb: [255, 255, 255] },
    expected: { lc: 106.04, polarity: 'dark-on-light', tolerance: 0.5 },
    category: 'standard',
  },
  {
    name: 'White on Black',
    description: 'Maximum negative contrast (light text on dark background)',
    foreground: { hex: '#FFFFFF', rgb: [255, 255, 255] },
    background: { hex: '#000000', rgb: [0, 0, 0] },
    expected: { lc: -107.89, polarity: 'light-on-dark', tolerance: 0.5 },
    category: 'standard',
  },

  // Mid-range grays
  {
    name: 'Mid Gray on White',
    description: 'Gray #888 on white background',
    foreground: { hex: '#888888', rgb: [136, 136, 136] },
    background: { hex: '#FFFFFF', rgb: [255, 255, 255] },
    expected: { lc: 63.06, polarity: 'dark-on-light', tolerance: 0.5 },
    category: 'standard',
  },
  {
    name: 'Mid Gray on Black',
    description: 'Gray #888 on black background',
    foreground: { hex: '#888888', rgb: [136, 136, 136] },
    background: { hex: '#000000', rgb: [0, 0, 0] },
    expected: { lc: -38.62, polarity: 'light-on-dark', tolerance: 0.5 }, // CORRECTED 2026-01-06: was -68.54, canonical is -38.62
    category: 'standard',
  },

  // Chromatic colors
  {
    name: 'Blue on White',
    description: 'Pure blue on white - tests blue coefficient',
    foreground: { hex: '#0000FF', rgb: [0, 0, 255] },
    background: { hex: '#FFFFFF', rgb: [255, 255, 255] },
    expected: { lc: 85.82, polarity: 'dark-on-light', tolerance: 0.5 }, // CORRECTED 2026-01-06: was 54.62, canonical is 85.82
    category: 'standard',
  },
  {
    name: 'Teal on Cream',
    description: 'Real-world color combination',
    foreground: { hex: '#112233', rgb: [17, 34, 51] },
    background: { hex: '#DDEEFF', rgb: [221, 238, 255] },
    expected: { lc: 91.67, polarity: 'dark-on-light', tolerance: 0.5 }, // CORRECTED 2026-01-06: was 91.34, canonical is 91.67
    category: 'standard',
  },

  // Edge cases - yellow problem
  {
    name: 'Yellow on Black',
    description: 'EDGE CASE: Yellow has high luminance but appears low contrast',
    foreground: { hex: '#FFFF00', rgb: [255, 255, 0] },
    background: { hex: '#000000', rgb: [0, 0, 0] },
    expected: { lc: -102.71, polarity: 'light-on-dark', tolerance: 1.0 }, // CORRECTED 2026-01-06: was -91.67, canonical is -102.71
    category: 'edge-case',
  },
  {
    name: 'Yellow on White',
    description: 'EDGE CASE: Yellow on white - very low contrast (clipped to zero)',
    foreground: { hex: '#FFFF00', rgb: [255, 255, 0] },
    background: { hex: '#FFFFFF', rgb: [255, 255, 255] },
    expected: { lc: 0.00, polarity: 'dark-on-light', tolerance: 1.0 }, // CORRECTED 2026-01-06: was 7.51, canonical is 0.00 (below loClip threshold)
    category: 'edge-case',
  },

  // Edge cases - dark on dark
  {
    name: 'Dark Navy on Darker Navy',
    description: 'EDGE CASE: Low contrast dark colors - tests soft clamp and loClip threshold',
    foreground: { hex: '#223344', rgb: [34, 51, 68] },
    background: { hex: '#112233', rgb: [17, 34, 51] },
    expected: { lc: 0.00, polarity: 'light-on-dark', tolerance: 1.0 }, // CORRECTED 2026-01-06: was -6.77, canonical is 0.00 (below loClip threshold)
    category: 'edge-case',
  },
  {
    name: 'Near Black on Black',
    description: 'EDGE CASE: Tests blkThrs soft clamp and loClip threshold',
    foreground: { hex: '#050505', rgb: [5, 5, 5] },
    background: { hex: '#000000', rgb: [0, 0, 0] },
    expected: { lc: 0.00, polarity: 'light-on-dark', tolerance: 1.0 }, // CORRECTED 2026-01-06: was -2.18, canonical is 0.00 (below loClip threshold)
    category: 'edge-case',
  },

  // Threshold cases
  {
    name: 'AA Normal Text Threshold',
    description: 'Color pair at approximately Lc 60 (WCAG AA equivalent)',
    foreground: { hex: '#595959', rgb: [89, 89, 89] },
    background: { hex: '#FFFFFF', rgb: [255, 255, 255] },
    expected: { lc: 84.29, polarity: 'dark-on-light', tolerance: 0.5 }, // CORRECTED 2026-01-06: was 74.18, canonical is 84.29
    category: 'standard',
  },
  {
    name: 'AAA Normal Text Threshold',
    description: 'Color pair at approximately Lc 75 (WCAG AAA equivalent)',
    foreground: { hex: '#3D3D3D', rgb: [61, 61, 61] },
    background: { hex: '#FFFFFF', rgb: [255, 255, 255] },
    expected: { lc: 95.19, polarity: 'dark-on-light', tolerance: 0.5 }, // CORRECTED 2026-01-06: was 86.48, canonical is 95.19
    category: 'standard',
  },
] as const;

/**
 * APCA Soft Clamp Constants
 * These are the canonical values from SAPC-4g
 */
export const APCA_CONSTANTS = {
  /** Black soft clamp threshold */
  blkThrs: 0.022,
  /** Soft clamp exponent */
  blkClmp: 1.414,
  /** Main TRC (gamma) */
  mainTRC: 2.4,
  /** sRGB Red coefficient */
  sRco: 0.2126729,
  /** sRGB Green coefficient */
  sGco: 0.7151522,
  /** sRGB Blue coefficient */
  sBco: 0.072175,
  /** Normal polarity exponent */
  normBG: 0.56,
  /** Normal polarity offset */
  normTXT: 0.57,
  /** Reverse polarity exponent */
  revBG: 0.65,
  /** Reverse polarity offset */
  revTXT: 0.62,
  /** Output scale factor */
  scaleBoW: 1.14,
  /** Reverse output scale factor */
  scaleWoB: 1.14,
  /** Low clip threshold */
  loClip: 0.001,
  /** Low contrast threshold for clipping */
  loConThresh: 0.035991,
  /** Low contrast offset */
  loConOffset: 0.027,
  /** Low contrast factor */
  loConFactor: 27.7847239587675,
} as const;

/**
 * APCA Level Thresholds
 * Mapping from Lc values to accessibility levels
 */
export const APCA_LEVELS = {
  /** Minimum for any text */
  minimum: 15,
  /** Large text minimum (similar to WCAG AA large) */
  large: 45,
  /** Body text minimum (similar to WCAG AA) */
  body: 60,
  /** Enhanced readability (similar to WCAG AAA) */
  enhanced: 75,
  /** Preferred for body text */
  preferred: 90,
  /** Maximum achievable */
  max: 108,
} as const;

export default APCA_GOLDEN_VECTORS;
