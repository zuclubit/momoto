/**
 * @fileoverview Design Tokens - Modern Design System
 *
 * FASE 16.2: UX/UI Modernization
 *
 * Comprehensive design token system following 2025 standards.
 * Inspired by: Linear, Stripe, Vercel, Tailwind CSS, Radix.
 *
 * @module apps/topocho-crm/tokens/designTokens
 * @version 2.0.0
 */

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const typography = {
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
    '7xl': '72px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING SCALE (4px base unit)
// ============================================================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
} as const;

// ============================================================================
// SHADOW SCALE (Elevation)
// ============================================================================

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const transitionProperty = {
  none: 'none',
  all: 'all',
  default: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
  colors: 'background-color, border-color, color, fill, stroke',
  opacity: 'opacity',
  shadow: 'box-shadow',
  transform: 'transform',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: 'auto',
  // Semantic
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
} as const;

// ============================================================================
// OPACITY SCALE
// ============================================================================

export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// CONTAINER MAX WIDTHS
// ============================================================================

export const maxWidth = {
  xs: '320px',
  sm: '384px',
  md: '448px',
  lg: '512px',
  xl: '576px',
  '2xl': '672px',
  '3xl': '768px',
  '4xl': '896px',
  '5xl': '1024px',
  '6xl': '1152px',
  '7xl': '1280px',
  full: '100%',
  content: '1400px', // Main content max-width
} as const;

// ============================================================================
// ANIMATION CURVES
// ============================================================================

export const easings = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Custom eases
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format large numbers with K/M/B suffixes
 * @example formatNumber(75000) => "$75K"
 * @example formatNumber(1500000) => "$1.5M"
 */
export function formatNumber(value: number, currency = true): string {
  const prefix = currency ? '$' : '';

  if (value >= 1000000000) {
    return `${prefix}${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `${prefix}${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${prefix}${(value / 1000).toFixed(1)}K`;
  }
  return `${prefix}${value.toLocaleString()}`;
}

/**
 * Calculate percentage change
 * @example calculateChange(100, 120) => "+20%"
 * @example calculateChange(100, 80) => "-20%"
 */
export function calculateChange(previous: number, current: number): string {
  if (previous === 0) return '+0%';
  const change = ((current - previous) / previous) * 100;
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

/**
 * Get trend direction
 * @example getTrend(100, 120) => "up"
 * @example getTrend(100, 80) => "down"
 */
export function getTrend(previous: number, current: number): 'up' | 'down' | 'neutral' {
  if (current > previous) return 'up';
  if (current < previous) return 'down';
  return 'neutral';
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
export type LetterSpacing = keyof typeof typography.letterSpacing;
export type Spacing = keyof typeof spacing;
export type Shadow = keyof typeof shadows;
export type BorderRadius = keyof typeof borderRadius;
export type Transition = keyof typeof transitions;
export type ZIndex = keyof typeof zIndex;
export type Opacity = keyof typeof opacity;
export type Breakpoint = keyof typeof breakpoints;
export type MaxWidth = keyof typeof maxWidth;
export type Easing = keyof typeof easings;
