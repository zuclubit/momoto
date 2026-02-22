/**
 * @fileoverview Badge Component Constants
 *
 * Configuration constants for Badge variants and sizes.
 *
 * @module adapters/core/badge/constants
 * @version 1.0.0
 */

import { BadgeSize, BadgeVariant } from './badgeCore.types';

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

export interface BadgeSizeConfig {
  fontSize: string;
  padding: string;
  borderRadius: string;
}

export const SIZE_CONFIG: Record<BadgeSize, BadgeSizeConfig> = {
  [BadgeSize.SM]: {
    fontSize: '0.6875rem', // 11px, text-2xs
    padding: '0.125rem 0.375rem', // 2px 6px
    borderRadius: '0.25rem', // 4px
  },
  [BadgeSize.MD]: {
    fontSize: '0.75rem', // 12px, text-xs
    padding: '0.25rem 0.5rem', // 4px 8px
    borderRadius: '0.375rem', // 6px
  },
  [BadgeSize.LG]: {
    fontSize: '0.875rem', // 14px, text-sm
    padding: '0.375rem 0.75rem', // 6px 12px
    borderRadius: '0.5rem', // 8px
  },
};

// ============================================================================
// VARIANT CONFIGURATION
// ============================================================================

export interface BadgeVariantConfig {
  hasBackground: boolean;
  hasBorder: boolean;
  opacityBackground?: number;
  opacityBorder?: number;
}

export const VARIANT_CONFIG: Record<BadgeVariant, BadgeVariantConfig> = {
  [BadgeVariant.SOLID]: {
    hasBackground: true,
    hasBorder: false,
  },
  [BadgeVariant.SUBTLE]: {
    hasBackground: true,
    hasBorder: false,
    opacityBackground: 0.1,
  },
  [BadgeVariant.OUTLINE]: {
    hasBackground: false,
    hasBorder: true,
  },
};

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_VARIANT: BadgeVariant = BadgeVariant.SOLID;
export const DEFAULT_SIZE: BadgeSize = BadgeSize.MD;
