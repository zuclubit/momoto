/**
 * @fileoverview Card Component - Constants
 *
 * Configuration for card variants, padding, and radius.
 *
 * @module adapters/core/card/constants
 * @version 1.0.0
 */

import { CardVariant, CardPadding, CardRadius } from './cardCore.types';

// ============================================================================
// PADDING CONFIGURATION
// ============================================================================

export const PADDING_CONFIG: Record<CardPadding, string> = {
  [CardPadding.NONE]: '0',
  [CardPadding.SM]: '12px',
  [CardPadding.MD]: '16px',
  [CardPadding.LG]: '24px',
  [CardPadding.XL]: '32px',
};

// ============================================================================
// RADIUS CONFIGURATION
// ============================================================================

export const RADIUS_CONFIG: Record<CardRadius, string> = {
  [CardRadius.NONE]: '0',
  [CardRadius.SM]: '4px',
  [CardRadius.MD]: '8px',
  [CardRadius.LG]: '12px',
  [CardRadius.XL]: '16px',
  [CardRadius.FULL]: '9999px',
};

// ============================================================================
// SHADOW CONFIGURATION
// ============================================================================

export const SHADOW_CONFIG = {
  none: 'none',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
} as const;

// ============================================================================
// VARIANT CONFIGURATION
// ============================================================================

/**
 * Visual configuration for each card variant
 */
export interface VariantConfig {
  hasBorder: boolean;
  hasShadow: boolean;
  shadowLevel: keyof typeof SHADOW_CONFIG;
  hasHoverEffect: boolean;
  hoverShadowLevel?: keyof typeof SHADOW_CONFIG;
  hoverTransform?: string;
}

export const VARIANT_CONFIG: Record<CardVariant, VariantConfig> = {
  [CardVariant.DEFAULT]: {
    hasBorder: true,
    hasShadow: false,
    shadowLevel: 'none',
    hasHoverEffect: false,
  },

  [CardVariant.ELEVATED]: {
    hasBorder: false,
    hasShadow: true,
    shadowLevel: 'sm',
    hasHoverEffect: false,
  },

  [CardVariant.INTERACTIVE]: {
    hasBorder: false,
    hasShadow: true,
    shadowLevel: 'sm',
    hasHoverEffect: true,
    hoverShadowLevel: 'md',
    hoverTransform: 'translateY(-2px)',
  },

  [CardVariant.OUTLINED]: {
    hasBorder: true,
    hasShadow: false,
    shadowLevel: 'none',
    hasHoverEffect: false,
  },

  [CardVariant.FLAT]: {
    hasBorder: false,
    hasShadow: false,
    shadowLevel: 'none',
    hasHoverEffect: false,
  },
};

// ============================================================================
// TRANSITION CONFIGURATION
// ============================================================================

export const TRANSITION_CONFIG = {
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const TRANSITION_PROPERTIES = {
  all: 'all',
  transform: 'transform',
  shadow: 'box-shadow',
  colors: 'background-color, border-color',
} as const;
