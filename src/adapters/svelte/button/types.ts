/**
 * @fileoverview Svelte Button Types
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Svelte-specific types for Button component.
 * These extend the core ButtonTokens with Svelte-specific props.
 *
 * @module momoto-ui/adapters/svelte/button/types
 * @version 1.0.0
 */

import type { ComponentType } from 'svelte';
import type {
  ButtonSize,
  IconPosition,
  ButtonStyles,
} from '../../core/button/buttonCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// BUTTON PROPS
// ============================================================================

/**
 * ButtonProps - Props for Svelte Button component.
 *
 * This matches the React/Vue ButtonProps but uses Svelte-specific types
 * where appropriate (e.g., ComponentType instead of Component).
 */
export interface ButtonProps {
  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Button label (visible text).
   * Required for accessibility.
   */
  label: string;

  /**
   * Icon component (Svelte Component).
   * Can be rendered via slot or directly.
   */
  icon?: ComponentType | string;

  /**
   * Icon position relative to label.
   * @default 'left'
   */
  iconPosition?: IconPosition;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - BASE
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Background color token (required).
   */
  backgroundColor: EnrichedToken;

  /**
   * Text color token (required).
   */
  textColor: EnrichedToken;

  /**
   * Border color token (optional).
   */
  borderColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - HOVER STATE
  // ──────────────────────────────────────────────────────────────────────────

  hoverBackgroundColor?: EnrichedToken;
  hoverTextColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - FOCUS STATE
  // ──────────────────────────────────────────────────────────────────────────

  focusBackgroundColor?: EnrichedToken;
  focusTextColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken | null;
  focusOutlineColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - ACTIVE STATE
  // ──────────────────────────────────────────────────────────────────────────

  activeBackgroundColor?: EnrichedToken;
  activeTextColor?: EnrichedToken;
  activeBorderColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - DISABLED STATE
  // ──────────────────────────────────────────────────────────────────────────

  disabledBackgroundColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken | null;

  // ──────────────────────────────────────────────────────────────────────────
  // BEHAVIOR
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Button type attribute.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * Disabled state (blocks interactions).
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state (shows spinner, blocks interactions).
   * @default false
   */
  loading?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Button size (affects height, padding, fontSize).
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Full width button (width: 100%).
   * @default false
   */
  fullWidth?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Custom CSS class name(s).
   */
  class?: string;

  /**
   * Custom inline styles (merged with computed styles).
   */
  style?: Partial<ButtonStyles>;

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY (ARIA)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * ARIA label (overrides visible label for screen readers).
   */
  ariaLabel?: string;

  /**
   * ARIA describedby (references description element ID).
   */
  ariaDescribedby?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TESTING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Test ID for automated testing.
   */
  testId?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Show quality warnings in console (dev mode).
   * @default true
   */
  showQualityWarnings?: boolean;
}

// ============================================================================
// BUTTON WITH VARIANT PROPS
// ============================================================================

/**
 * ButtonWithVariantProps - Props for ButtonWithVariant component.
 *
 * This variant automatically resolves tokens from the theme.
 */
export interface ButtonWithVariantProps extends Omit<ButtonProps,
  | 'backgroundColor'
  | 'textColor'
  | 'borderColor'
  | 'hoverBackgroundColor'
  | 'hoverTextColor'
  | 'hoverBorderColor'
  | 'focusBackgroundColor'
  | 'focusTextColor'
  | 'focusBorderColor'
  | 'focusOutlineColor'
  | 'activeBackgroundColor'
  | 'activeTextColor'
  | 'activeBorderColor'
  | 'disabledBackgroundColor'
  | 'disabledTextColor'
  | 'disabledBorderColor'
> {
  /**
   * Button variant (resolves tokens from theme).
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  ButtonProps,
  ButtonWithVariantProps,
};
