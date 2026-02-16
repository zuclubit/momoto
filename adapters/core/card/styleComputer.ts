/**
 * @fileoverview Card Component - Style Computer
 *
 * Computes card styles based on variant, tokens, and state.
 *
 * @module adapters/core/card/styleComputer
 * @version 1.0.0
 */

import type { CardProps, CardStyles, CardState } from './cardCore.types';
import {
  PADDING_CONFIG,
  RADIUS_CONFIG,
  SHADOW_CONFIG,
  VARIANT_CONFIG,
  TRANSITION_CONFIG,
  TRANSITION_PROPERTIES,
} from './constants';
import { CardVariant, CardPadding, CardRadius } from './cardCore.types';

// ============================================================================
// STYLE COMPUTATION
// ============================================================================

/**
 * Compute card styles
 */
export function computeStyles(
  props: CardProps,
  state: CardState,
  tokens: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    shadow: string;
    hoverBackgroundColor?: string;
    hoverBorderColor?: string;
    hoverShadow?: string;
  }
): CardStyles {
  const {
    variant = CardVariant.DEFAULT,
    padding = CardPadding.LG,
    radius = CardRadius.XL,
    onClick,
    style = {},
  } = props;

  const variantConfig = VARIANT_CONFIG[variant];
  const { isHovered, isDisabled } = state;

  // Base styles
  const containerStyles: React.CSSProperties = {
    // Layout
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',

    // Sizing
    boxSizing: 'border-box',

    // Spacing
    padding: PADDING_CONFIG[padding],

    // Visual
    backgroundColor: isHovered && tokens.hoverBackgroundColor
      ? tokens.hoverBackgroundColor
      : tokens.backgroundColor,
    borderRadius: RADIUS_CONFIG[radius],

    // Border
    ...(variantConfig.hasBorder && {
      border: `${tokens.borderWidth} solid ${
        isHovered && tokens.hoverBorderColor
          ? tokens.hoverBorderColor
          : tokens.borderColor
      }`,
    }),

    // Shadow
    ...(variantConfig.hasShadow && {
      boxShadow: isHovered && variantConfig.hasHoverEffect && tokens.hoverShadow
        ? tokens.hoverShadow
        : tokens.shadow,
    }),

    // Transform
    ...(variantConfig.hasHoverEffect && isHovered && variantConfig.hoverTransform && {
      transform: variantConfig.hoverTransform,
    }),

    // Transition
    transition: variantConfig.hasHoverEffect
      ? `${TRANSITION_PROPERTIES.all} ${TRANSITION_CONFIG.base}`
      : 'none',

    // Interactivity
    cursor: onClick && !isDisabled ? 'pointer' : 'default',

    // Disabled state
    ...(isDisabled && {
      opacity: 0.5,
      pointerEvents: 'none',
      cursor: 'not-allowed',
    }),

    // Merge user styles
    ...style,
  };

  return {
    container: containerStyles,
  };
}

/**
 * Get default variant based on props
 */
export function getDefaultVariant(props: CardProps): CardVariant {
  // If onClick is provided, default to interactive
  if (props.onClick) {
    return CardVariant.INTERACTIVE;
  }

  // Otherwise default to elevated (most common in modern UIs)
  return CardVariant.ELEVATED;
}

/**
 * Validate card props
 */
export function validateProps(props: CardProps): string[] {
  const errors: string[] = [];

  // Padding validation
  if (props.padding && !Object.values(CardPadding).includes(props.padding)) {
    errors.push(`Invalid padding: ${props.padding}`);
  }

  // Radius validation
  if (props.radius && !Object.values(CardRadius).includes(props.radius)) {
    errors.push(`Invalid radius: ${props.radius}`);
  }

  // Variant validation
  if (props.variant && !Object.values(CardVariant).includes(props.variant)) {
    errors.push(`Invalid variant: ${props.variant}`);
  }

  return errors;
}
