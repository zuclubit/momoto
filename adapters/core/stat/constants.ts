/**
 * @fileoverview Stat Component Constants
 *
 * Configuration constants for Stat size variants and typography.
 *
 * @module adapters/core/stat/constants
 * @version 1.0.0
 */

import { StatSize, TrendDirection } from './statCore.types';

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

export interface StatSizeConfig {
  labelFontSize: string;
  valueFontSize: string;
  trendFontSize: string;
  helperFontSize: string;
  gap: string;
}

export const SIZE_CONFIG: Record<StatSize, StatSizeConfig> = {
  [StatSize.SM]: {
    labelFontSize: '0.75rem', // text-xs
    valueFontSize: '1.5rem', // text-2xl
    trendFontSize: '0.75rem', // text-xs
    helperFontSize: '0.75rem', // text-xs
    gap: '0.25rem', // 4px
  },
  [StatSize.MD]: {
    labelFontSize: '0.875rem', // text-sm
    valueFontSize: '2.25rem', // text-4xl
    trendFontSize: '0.875rem', // text-sm
    helperFontSize: '0.875rem', // text-sm
    gap: '0.375rem', // 6px
  },
  [StatSize.LG]: {
    labelFontSize: '0.875rem', // text-sm
    valueFontSize: '3rem', // text-5xl
    trendFontSize: '0.875rem', // text-sm
    helperFontSize: '0.875rem', // text-sm
    gap: '0.5rem', // 8px
  },
  [StatSize.XL]: {
    labelFontSize: '0.875rem', // text-sm
    valueFontSize: '3.75rem', // text-6xl
    trendFontSize: '0.875rem', // text-sm
    helperFontSize: '0.875rem', // text-sm
    gap: '0.625rem', // 10px
  },
};

// ============================================================================
// TREND SYMBOLS
// ============================================================================

export const TREND_SYMBOLS: Record<TrendDirection, string> = {
  [TrendDirection.UP]: '↑',
  [TrendDirection.DOWN]: '↓',
  [TrendDirection.NEUTRAL]: '→',
};

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const DEFAULT_SIZE: StatSize = StatSize.MD;
