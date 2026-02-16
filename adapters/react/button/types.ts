/**
 * @fileoverview React Button Types
 *
 * FASE 14: Core Consolidation
 *
 * React-specific types for Button component (refactored to use ButtonCore).
 *
 * @module momoto-ui/adapters/react/button/types
 * @version 2.0.0 (FASE 14)
 */

import type { ReactNode, CSSProperties, MouseEvent } from 'react';
import type {
  ButtonSize,
  IconPosition,
} from '../../core/button/buttonCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// BUTTON PROPS
// ============================================================================

/**
 * ButtonProps - Props for React Button component.
 *
 * FASE 14: Matches the pattern established by Vue/Svelte/Angular adapters.
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
   * Icon element (ReactNode).
   */
  icon?: ReactNode;

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
   * Click handler.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

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
  className?: string;

  /**
   * Custom inline styles (merged with computed styles).
   */
  style?: CSSProperties;

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY (ARIA)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * ARIA label (overrides visible label for screen readers).
   */
  'aria-label'?: string;

  /**
   * ARIA describedby (references description element ID).
   */
  'aria-describedby'?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TESTING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Test ID for automated testing.
   */
  'data-testid'?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Show quality warnings in console (dev mode).
   * @default process.env.NODE_ENV === 'development'
   */
  showQualityWarnings?: boolean;
}

// ============================================================================
// BUTTON WITH VARIANT PROPS
// ============================================================================

/**
 * ButtonVariantProps - Props for ButtonWithVariant component.
 *
 * This variant automatically resolves tokens from the theme.
 */
export interface ButtonVariantProps extends Omit<ButtonProps,
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
// NOTE: Types are exported inline above (export interface)
// ============================================================================
