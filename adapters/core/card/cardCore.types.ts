/**
 * @fileoverview Card Component - Type Definitions
 *
 * Card is a container component with elevation, borders, and interactive states.
 * Core primitive for building modern UI layouts.
 *
 * @module adapters/core/card/cardCore.types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Card visual variants
 */
export enum CardVariant {
  DEFAULT = 'default',     // Basic card with border
  ELEVATED = 'elevated',   // Card with shadow, no border
  INTERACTIVE = 'interactive', // Elevated + hover effects
  OUTLINED = 'outlined',   // Border only, no shadow
  FLAT = 'flat',          // No border, no shadow
}

/**
 * Card padding sizes
 */
export enum CardPadding {
  NONE = 'none',   // 0
  SM = 'sm',       // 12px
  MD = 'md',       // 16px
  LG = 'lg',       // 24px
  XL = 'xl',       // 32px
}

/**
 * Card border radius sizes
 */
export enum CardRadius {
  NONE = 'none',   // 0
  SM = 'sm',       // 4px
  MD = 'md',       // 8px
  LG = 'lg',       // 12px
  XL = 'xl',       // 16px
  FULL = 'full',   // 9999px
}

// ============================================================================
// COMPONENT STATE
// ============================================================================

/**
 * Card interaction state
 */
export interface CardState {
  isHovered: boolean;
  isFocused: boolean;
  isPressed: boolean;
  isDisabled: boolean;
}

// ============================================================================
// STYLE COMPUTATION
// ============================================================================

/**
 * Computed styles for card
 */
export interface CardStyles {
  container: React.CSSProperties;
}

// ============================================================================
// TOKEN PROPS
// ============================================================================

/**
 * Card color tokens
 */
export interface CardTokens {
  // Background
  backgroundColor: EnrichedToken;

  // Border
  borderColor: EnrichedToken;
  borderWidth?: string;

  // Shadow
  shadowColor?: string; // RGBA string

  // Interactive states
  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;
  hoverShadowColor?: string;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Card component props
 */
export interface CardProps {
  // Content
  children?: React.ReactNode;

  // Visual
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;

  // Tokens (if not using variant)
  backgroundColor?: EnrichedToken;
  borderColor?: EnrichedToken;
  borderWidth?: string;
  shadowColor?: string;

  // Hover tokens (for interactive variant)
  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;
  hoverShadowColor?: string;

  // Behavior
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;

  // Accessibility
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;

  // State
  disabled?: boolean;

  // DOM
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  testId?: string;
}

// ============================================================================
// CORE OUTPUT
// ============================================================================

/**
 * Output from CardCore processing
 */
export interface CardCoreOutput {
  styles: CardStyles;
  ariaProps: Record<string, string | boolean | undefined>;
  dataAttributes: Record<string, string>;
  handlers: {
    onClick?: () => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseLeave?: (e: React.MouseEvent) => void;
  };
}
