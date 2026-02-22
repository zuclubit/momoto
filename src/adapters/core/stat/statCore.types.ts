/**
 * @fileoverview Stat Component Types
 *
 * Type definitions for the Stat component (KPI display).
 *
 * @module adapters/core/stat/statCore.types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Stat Size Variants
 */
export enum StatSize {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
}

/**
 * Trend Direction
 */
export enum TrendDirection {
  UP = 'up',
  DOWN = 'down',
  NEUTRAL = 'neutral',
}

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Trend configuration
 */
export interface StatTrend {
  /** Trend direction */
  direction: TrendDirection;
  /** Trend value (e.g., "+10.3%", "-5.2%") */
  value: string;
  /** Optional description (e.g., "vs last month") */
  description?: string;
  /** Optional color override */
  color?: EnrichedToken;
}

/**
 * Stat Props
 */
export interface StatProps {
  /** Stat label */
  label: string;
  /** Stat value (formatted) */
  value: string | number;
  /** Optional trend indicator */
  trend?: StatTrend;
  /** Optional helper text */
  helperText?: string;
  /** Size variant */
  size?: StatSize;
  /** Custom label color */
  labelColor?: EnrichedToken;
  /** Custom value color */
  valueColor?: EnrichedToken;
  /** Custom helper text color */
  helperTextColor?: EnrichedToken;
  /** Additional CSS class */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Unique identifier */
  id?: string;
}

/**
 * Stat Compute Output
 */
export interface StatComputeOutput {
  styles: {
    container: React.CSSProperties;
    label: React.CSSProperties;
    value: React.CSSProperties;
    trend?: React.CSSProperties;
    helperText?: React.CSSProperties;
  };
  dataAttributes: Record<string, string>;
}
