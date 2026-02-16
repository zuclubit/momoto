/**
 * @fileoverview CheckboxCore Types - Complete Type System
 *
 * FASE 15: Component Expansion
 *
 * Type definitions for CheckboxCore (framework-agnostic).
 * Follows ButtonCore/TextFieldCore pattern exactly.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ All tokens are EnrichedToken (NO raw colors)
 * - ✅ State is selection-based (NOT calculated)
 * - ✅ NO perceptual logic in types
 *
 * @module momoto-ui/adapters/core/checkbox/checkboxCore.types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// CHECKBOX STATE
// ============================================================================

/**
 * CheckboxState - All possible checkbox states.
 *
 * Combined check state + interaction state for complete state modeling.
 *
 * UNCHECKED STATES:
 * - base: Unchecked, no interaction
 * - hover: Unchecked + mouse hover
 * - focus: Unchecked + keyboard focus
 *
 * CHECKED STATES:
 * - checked: Checked, no interaction
 * - checkedHover: Checked + mouse hover
 * - checkedFocus: Checked + keyboard focus
 *
 * INDETERMINATE STATES (tri-state checkbox):
 * - indeterminate: Indeterminate, no interaction
 * - indeterminateHover: Indeterminate + mouse hover
 * - indeterminateFocus: Indeterminate + keyboard focus
 *
 * DISABLED STATES:
 * - disabled: Unchecked + disabled
 * - checkedDisabled: Checked + disabled
 * - indeterminateDisabled: Indeterminate + disabled
 */
export type CheckboxState =
  // Unchecked states
  | 'base'
  | 'hover'
  | 'focus'
  // Checked states
  | 'checked'
  | 'checkedHover'
  | 'checkedFocus'
  // Indeterminate states
  | 'indeterminate'
  | 'indeterminateHover'
  | 'indeterminateFocus'
  // Disabled states
  | 'disabled'
  | 'checkedDisabled'
  | 'indeterminateDisabled';

/**
 * CheckboxSize - Size variants.
 */
export type CheckboxSize = 'sm' | 'md' | 'lg';

// ============================================================================
// CHECKBOX TOKENS
// ============================================================================

/**
 * CheckboxTokens - All tokens required for a checkbox.
 *
 * CONTRACT: All colors must be EnrichedToken (NOT hex strings).
 * These are the INPUT tokens - what the component receives.
 *
 * REQUIRED TOKENS:
 * - backgroundColor: Background of checkbox box
 * - borderColor: Border of checkbox box
 * - checkColor: Color of checkmark/dash icon
 *
 * OPTIONAL STATE-SPECIFIC TOKENS:
 * - Tokens for each state override base tokens
 * - If not provided, falls back to base tokens
 */
export interface CheckboxTokens {
  // ──────────────────────────────────────────────────────────────────────────
  // BASE (UNCHECKED) TOKENS (REQUIRED)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Background color of checkbox box (unchecked).
   */
  backgroundColor: EnrichedToken;

  /**
   * Border color of checkbox box (unchecked).
   */
  borderColor: EnrichedToken;

  /**
   * Color of checkmark icon (when checked).
   * Used for both checked and indeterminate states.
   */
  checkColor: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // HOVER (UNCHECKED) TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // FOCUS (UNCHECKED) TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  focusBackgroundColor?: EnrichedToken;
  focusBorderColor?: EnrichedToken;
  focusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // CHECKED TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  checkedBackgroundColor?: EnrichedToken;
  checkedBorderColor?: EnrichedToken;
  checkedCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // CHECKED + HOVER TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  checkedHoverBackgroundColor?: EnrichedToken;
  checkedHoverBorderColor?: EnrichedToken;
  checkedHoverCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // CHECKED + FOCUS TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  checkedFocusBackgroundColor?: EnrichedToken;
  checkedFocusBorderColor?: EnrichedToken;
  checkedFocusCheckColor?: EnrichedToken;
  checkedFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INDETERMINATE TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  indeterminateBackgroundColor?: EnrichedToken;
  indeterminateBorderColor?: EnrichedToken;
  indeterminateCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INDETERMINATE + HOVER TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  indeterminateHoverBackgroundColor?: EnrichedToken;
  indeterminateHoverBorderColor?: EnrichedToken;
  indeterminateHoverCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INDETERMINATE + FOCUS TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  indeterminateFocusBackgroundColor?: EnrichedToken;
  indeterminateFocusBorderColor?: EnrichedToken;
  indeterminateFocusCheckColor?: EnrichedToken;
  indeterminateFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // DISABLED TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  disabledBackgroundColor?: EnrichedToken;
  disabledBorderColor?: EnrichedToken;
  disabledCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // CHECKED + DISABLED TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  checkedDisabledBackgroundColor?: EnrichedToken;
  checkedDisabledBorderColor?: EnrichedToken;
  checkedDisabledCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // INDETERMINATE + DISABLED TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  indeterminateDisabledBackgroundColor?: EnrichedToken;
  indeterminateDisabledBorderColor?: EnrichedToken;
  indeterminateDisabledCheckColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // LABEL TOKENS (OPTIONAL)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Label text color (optional).
   * If not provided, inherits from parent.
   */
  labelColor?: EnrichedToken | null;

  /**
   * Disabled label color (optional).
   */
  disabledLabelColor?: EnrichedToken | null;
}

/**
 * ResolvedCheckboxTokens - Tokens resolved for current state.
 *
 * OUTPUT from token resolution - what CheckboxCore uses internally.
 * All optional tokens have been resolved to actual values.
 */
export interface ResolvedCheckboxTokens {
  backgroundColor: EnrichedToken;
  borderColor: EnrichedToken;
  checkColor: EnrichedToken;
  outlineColor: EnrichedToken | null;
  labelColor: EnrichedToken | null;
}

// ============================================================================
// SIZE CONFIGURATION
// ============================================================================

/**
 * SizeConfig - Configuration for a specific checkbox size.
 */
export interface SizeConfig {
  /**
   * Checkbox box size (width & height in px).
   */
  boxSize: number;

  /**
   * Border width in px.
   */
  borderWidth: number;

  /**
   * Checkmark/dash icon size in px.
   */
  iconSize: number;

  /**
   * Label font size in px.
   */
  labelFontSize: number;

  /**
   * Gap between checkbox and label in px.
   */
  gap: number;
}

/**
 * CheckboxSizeConfig - Size configurations for all checkbox sizes.
 */
export type CheckboxSizeConfig = {
  [K in CheckboxSize]: SizeConfig;
};

// ============================================================================
// STYLES
// ============================================================================

/**
 * CheckboxStyles - Computed styles for checkbox.
 *
 * Framework-agnostic style object.
 * Frameworks convert this to their specific style format.
 */
export interface CheckboxStyles {
  // Container
  containerDisplay?: string;
  containerAlignItems?: string;
  containerGap?: number;
  containerCursor?: string;
  containerOpacity?: number;

  // Checkbox box
  boxWidth: number;
  boxHeight: number;
  boxBackgroundColor: string;
  boxBorderWidth: number;
  boxBorderStyle: string;
  boxBorderColor: string;
  boxBorderRadius: number;
  boxDisplay?: string;
  boxAlignItems?: string;
  boxJustifyContent?: string;
  boxTransition?: string;

  // Checkmark/dash icon
  iconSize: number;
  iconColor: string;
  iconDisplay?: string;

  // Focus outline
  outlineColor?: string | null;
  outlineWidth?: number;
  outlineOffset?: number;

  // Label
  labelFontSize?: number;
  labelColor?: string | null;
}

// ============================================================================
// ARIA ATTRIBUTES
// ============================================================================

/**
 * ARIAAttributes - ARIA attributes for accessibility.
 */
export interface ARIAAttributes {
  'aria-checked'?: boolean | 'mixed';
  'aria-disabled'?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
}

// ============================================================================
// STATE TRACKING
// ============================================================================

/**
 * StateTracker - Tracks checkbox interaction state.
 */
export interface StateTracker {
  isChecked: boolean;
  isIndeterminate: boolean;
  isHovered: boolean;
  isFocused: boolean;
}

/**
 * StateUpdater - Methods to update checkbox state.
 */
export interface StateUpdater {
  setChecked: (checked: boolean) => void;
  setIndeterminate: (indeterminate: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setFocused: (focused: boolean) => void;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * CheckboxEventHandlers - Framework-agnostic event handlers.
 */
export interface CheckboxEventHandlers {
  onChange: (checked: boolean) => void;
  onFocus: () => void;
  onBlur: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// ============================================================================
// FUNCTION INPUTS
// ============================================================================

/**
 * DetermineStateInput - Input for determineState().
 */
export interface DetermineStateInput {
  isChecked: boolean;
  isIndeterminate: boolean;
  disabled: boolean;
  isHovered: boolean;
  isFocused: boolean;
}

/**
 * ResolveTokensInput - Input for resolveTokens().
 */
export interface ResolveTokensInput {
  state: CheckboxState;
  tokens: CheckboxTokens;
}

/**
 * ComputeStylesInput - Input for computeStyles().
 */
export interface ComputeStylesInput {
  resolvedTokens: ResolvedCheckboxTokens;
  size: CheckboxSize;
  currentState: CheckboxState;
  sizeConfig: SizeConfig;
}

/**
 * CreateEventHandlersInput - Input for createEventHandlers().
 */
export interface CreateEventHandlersInput {
  disabled: boolean;
  onChange?: (checked: boolean) => void;
  stateUpdater: StateUpdater;
}

/**
 * GenerateARIAInput - Input for generateARIA().
 */
export interface GenerateARIAInput {
  isChecked: boolean;
  isIndeterminate: boolean;
  disabled: boolean;
  required?: boolean;
  invalid?: boolean;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

/**
 * QualityCheckInput - Input for checkQuality().
 */
export interface QualityCheckInput {
  resolvedTokens: ResolvedCheckboxTokens;
  showWarnings: boolean;
}

// ============================================================================
// QUALITY WARNINGS
// ============================================================================

/**
 * QualityWarning - Quality/accessibility warning.
 */
export interface QualityWarning {
  type: 'low_quality_bg' | 'low_quality_border' | 'low_quality_check' | 'wcag_fail';
  message: string;
  details: Record<string, any>;
}

// ============================================================================
// NOTE: All types are exported inline above (export type/interface)
// ============================================================================
