/**
 * @fileoverview Angular Button Types
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Angular-specific types for Button component.
 * These extend the core ButtonTokens with Angular-specific props.
 *
 * @module momoto-ui/adapters/angular/button/types
 * @version 1.0.0
 */

import type {
  ButtonSize,
  IconPosition,
  ButtonStyles,
} from '../../core/button/buttonCore.types';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// BUTTON INPUTS
// ============================================================================

/**
 * ButtonInputs - Inputs for Angular Button component.
 *
 * This matches the React/Vue/Svelte ButtonProps but uses Angular-specific
 * conventions (component @Input properties).
 */
export interface ButtonInputs {
  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  label: string;
  icon?: any;
  iconPosition?: IconPosition;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS - BASE
  // ──────────────────────────────────────────────────────────────────────────

  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
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

  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  size?: ButtonSize;
  fullWidth?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  customClass?: string;
  customStyle?: Partial<ButtonStyles>;

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY (ARIA)
  // ──────────────────────────────────────────────────────────────────────────

  ariaLabel?: string;
  ariaDescribedby?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TESTING
  // ──────────────────────────────────────────────────────────────────────────

  testId?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  showQualityWarnings?: boolean;
}

// ============================================================================
// BUTTON WITH VARIANT INPUTS
// ============================================================================

/**
 * ButtonWithVariantInputs - Inputs for ButtonWithVariant component.
 *
 * This variant automatically resolves tokens from the theme.
 */
export interface ButtonWithVariantInputs extends Omit<ButtonInputs,
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
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  ButtonInputs,
  ButtonWithVariantInputs,
};
