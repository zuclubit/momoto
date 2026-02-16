/**
 * @fileoverview Stat Component Style Computer
 *
 * Computes all styles for the Stat component based on props.
 *
 * @module adapters/core/stat/styleComputer
 * @version 1.0.0
 */

import type {
  StatProps,
  StatComputeOutput,
  StatSize,
  TrendDirection,
} from './statCore.types';
import { SIZE_CONFIG, DEFAULT_SIZE, TREND_SYMBOLS } from './constants';

// ============================================================================
// STYLE COMPUTER
// ============================================================================

/**
 * Compute all styles for the Stat component
 */
export function computeStyles(props: StatProps): StatComputeOutput {
  const size = props.size || DEFAULT_SIZE;
  const sizeConfig = SIZE_CONFIG[size];

  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: sizeConfig.gap,
    ...props.style,
  };

  // Label styles
  const labelStyles: React.CSSProperties = {
    fontSize: sizeConfig.labelFontSize,
    fontWeight: 500,
    opacity: 0.6,
    letterSpacing: '0.01em',
    color: props.labelColor?.toCssValue(),
  };

  // Value styles
  const valueStyles: React.CSSProperties = {
    fontSize: sizeConfig.valueFontSize,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    color: props.valueColor?.toCssValue(),
  };

  // Trend styles (if trend exists)
  const trendStyles: React.CSSProperties | undefined = props.trend
    ? {
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontSize: sizeConfig.trendFontSize,
        fontWeight: 600,
        color: getTrendColor(props.trend.direction, props.trend.color),
      }
    : undefined;

  // Helper text styles (if helper text exists)
  const helperTextStyles: React.CSSProperties | undefined = props.helperText
    ? {
        fontSize: sizeConfig.helperFontSize,
        opacity: 0.5,
        color: props.helperTextColor?.toCssValue(),
      }
    : undefined;

  // Data attributes
  const dataAttributes: Record<string, string> = {
    'data-component': 'stat',
    'data-size': size,
  };

  if (props.trend) {
    dataAttributes['data-trend'] = props.trend.direction;
  }

  return {
    styles: {
      container: containerStyles,
      label: labelStyles,
      value: valueStyles,
      trend: trendStyles,
      helperText: helperTextStyles,
    },
    dataAttributes,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get trend color based on direction
 */
function getTrendColor(
  direction: TrendDirection,
  customColor?: { toCssValue(): string } | null
): string | undefined {
  if (customColor) {
    const cssValue = customColor.toCssValue();
    if (cssValue) {
      return cssValue;
    }
  }

  // Default colors (will be overridden by consumer)
  switch (direction) {
    case 'up':
      return '#10b981'; // green-500
    case 'down':
      return '#ef4444'; // red-500
    case 'neutral':
      return '#6b7280'; // gray-500
    default:
      return undefined;
  }
}

/**
 * Get trend symbol
 */
export function getTrendSymbol(direction: TrendDirection): string {
  return TREND_SYMBOLS[direction];
}

/**
 * Validate StatProps
 */
export function validateProps(props: StatProps): void {
  if (!props.label || props.label.trim() === '') {
    console.warn('[Stat] label is required');
  }

  if (props.value === undefined || props.value === null) {
    console.warn('[Stat] value is required');
  }
}

/**
 * Get default size
 */
export function getDefaultSize(): StatSize {
  return DEFAULT_SIZE;
}
