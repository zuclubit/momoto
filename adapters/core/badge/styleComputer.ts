/**
 * @fileoverview Badge Component Style Computer
 *
 * Computes all styles for the Badge component based on props.
 *
 * @module adapters/core/badge/styleComputer
 * @version 1.0.0
 */

import type {
  BadgeProps,
  BadgeComputeOutput,
  BadgeSize,
  BadgeVariant,
} from './badgeCore.types';
import {
  SIZE_CONFIG,
  VARIANT_CONFIG,
  DEFAULT_VARIANT,
  DEFAULT_SIZE,
} from './constants';

// ============================================================================
// STYLE COMPUTER
// ============================================================================

/**
 * Compute all styles for the Badge component
 */
export function computeStyles(props: BadgeProps): BadgeComputeOutput {
  const variant = props.variant || DEFAULT_VARIANT;
  const size = props.size || DEFAULT_SIZE;
  const sizeConfig = SIZE_CONFIG[size];
  const variantConfig = VARIANT_CONFIG[variant];

  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    padding: sizeConfig.padding,
    borderRadius: sizeConfig.borderRadius,
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    cursor: props.onClick ? 'pointer' : 'default',
    userSelect: 'none',
    ...getVariantStyles(variant, variantConfig, props),
    ...props.style,
  };

  // Data attributes
  const dataAttributes: Record<string, string> = {
    'data-component': 'badge',
    'data-variant': variant,
    'data-size': size,
  };

  // ARIA props
  const ariaProps: Record<string, string> = {};

  if (props.onClick) {
    ariaProps['role'] = 'button';
    ariaProps['tabIndex'] = '0';
  }

  return {
    styles: {
      container: containerStyles,
    },
    dataAttributes,
    ariaProps,
  };
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get variant-specific styles
 */
function getVariantStyles(
  variant: BadgeVariant,
  config: any,
  props: BadgeProps
): React.CSSProperties {
  const styles: React.CSSProperties = {};

  // Background
  if (config.hasBackground && props.backgroundColor) {
    const bgColor = props.backgroundColor.toCssValue();
    if (bgColor) {
      if (config.opacityBackground) {
        // For subtle variant: use rgba with opacity
        const rgb = hexToRgb(bgColor);
        if (rgb) {
          styles.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacityBackground})`;
        } else {
          styles.backgroundColor = bgColor;
        }
      } else {
        styles.backgroundColor = bgColor;
      }
    }
  }

  // Text color
  if (props.textColor) {
    const textColor = props.textColor.toCssValue();
    if (textColor) {
      styles.color = textColor;
    }
  }

  // Border
  if (config.hasBorder) {
    const borderColor = props.borderColor?.toCssValue() || props.textColor?.toCssValue();
    if (borderColor) {
      styles.border = `1px solid ${borderColor}`;
    }
  }

  return styles;
}

/**
 * Convert hex to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Validate BadgeProps
 */
export function validateProps(props: BadgeProps): void {
  if (!props.children) {
    console.warn('[Badge] children is required');
  }
}

/**
 * Get default variant
 */
export function getDefaultVariant(): BadgeVariant {
  return DEFAULT_VARIANT;
}

/**
 * Get default size
 */
export function getDefaultSize(): BadgeSize {
  return DEFAULT_SIZE;
}
