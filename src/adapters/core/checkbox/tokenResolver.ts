/**
 * @fileoverview Token Resolver - Checkbox Token Resolution Logic
 *
 * FASE 15: Component Expansion
 *
 * Resolves checkbox tokens based on current state.
 * Follows ButtonCore/TextFieldCore pattern exactly.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Token SELECTION based on state (NOT calculation)
 * - ✅ NO color calculations or transformations
 * - ✅ Fallback to base tokens if state tokens not provided
 *
 * @module momoto-ui/adapters/core/checkbox/tokenResolver
 * @version 1.0.0
 */

import type {
  CheckboxState,
  ResolvedCheckboxTokens,
  DetermineStateInput,
  ResolveTokensInput,
} from './checkboxCore.types';

// ============================================================================
// STATE DETERMINATION
// ============================================================================

/**
 * Determine current checkbox state based on check state and interaction flags.
 *
 * State priority (highest to lowest):
 * 1. disabled (blocks all interactions)
 *    - unchecked + disabled → disabled
 *    - checked + disabled → checkedDisabled
 *    - indeterminate + disabled → indeterminateDisabled
 * 2. checked/indeterminate (visual state)
 *    - checked + focus → checkedFocus
 *    - checked + hover → checkedHover
 *    - checked → checked
 *    - indeterminate + focus → indeterminateFocus
 *    - indeterminate + hover → indeterminateHover
 *    - indeterminate → indeterminate
 * 3. unchecked interaction states
 *    - focus → focus
 *    - hover → hover
 *    - base → base
 *
 * CONTRACT: This is state SELECTION logic (ALLOWED).
 * NOT perceptual calculation.
 *
 * @param input - State determination input
 * @returns Current checkbox state
 */
export function determineState(input: DetermineStateInput): CheckboxState {
  const { isChecked, isIndeterminate, disabled, isFocused, isHovered } = input;

  // Priority 1: Disabled state
  if (disabled) {
    if (isIndeterminate) {
      return 'indeterminateDisabled';
    }
    if (isChecked) {
      return 'checkedDisabled';
    }
    return 'disabled';
  }

  // Priority 2: Indeterminate state (tri-state checkbox)
  if (isIndeterminate) {
    if (isFocused) {
      return 'indeterminateFocus';
    }
    if (isHovered) {
      return 'indeterminateHover';
    }
    return 'indeterminate';
  }

  // Priority 3: Checked state
  if (isChecked) {
    if (isFocused) {
      return 'checkedFocus';
    }
    if (isHovered) {
      return 'checkedHover';
    }
    return 'checked';
  }

  // Priority 4: Unchecked interaction states
  if (isFocused) {
    return 'focus';
  }

  if (isHovered) {
    return 'hover';
  }

  // Priority 5: Base state (unchecked, no interaction)
  return 'base';
}

// ============================================================================
// TOKEN RESOLUTION
// ============================================================================

/**
 * Resolve tokens for current checkbox state.
 *
 * CONTRACT: This is token SELECTION (ALLOWED).
 * - Selects the appropriate token for the current state
 * - Falls back to base token if state token not provided
 * - NO color calculations or transformations
 *
 * @param input - Token resolution input
 * @returns Resolved tokens for current state
 */
export function resolveTokens(input: ResolveTokensInput): ResolvedCheckboxTokens {
  const { state, tokens } = input;

  switch (state) {
    // ─────────────────────────────────────────────────────────────────────────
    // UNCHECKED STATES
    // ─────────────────────────────────────────────────────────────────────────

    case 'base':
      return {
        backgroundColor: tokens.backgroundColor,
        borderColor: tokens.borderColor,
        checkColor: tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.labelColor || null,
      };

    case 'hover':
      return {
        backgroundColor: tokens.hoverBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.hoverBorderColor || tokens.borderColor,
        checkColor: tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.labelColor || null,
      };

    case 'focus':
      return {
        backgroundColor: tokens.focusBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.focusBorderColor || tokens.borderColor,
        checkColor: tokens.checkColor,
        outlineColor: tokens.focusOutlineColor || null,
        labelColor: tokens.labelColor || null,
      };

    // ─────────────────────────────────────────────────────────────────────────
    // CHECKED STATES
    // ─────────────────────────────────────────────────────────────────────────

    case 'checked':
      return {
        backgroundColor: tokens.checkedBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.checkedBorderColor || tokens.borderColor,
        checkColor: tokens.checkedCheckColor || tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.labelColor || null,
      };

    case 'checkedHover':
      return {
        backgroundColor: tokens.checkedHoverBackgroundColor || tokens.checkedBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.checkedHoverBorderColor || tokens.checkedBorderColor || tokens.borderColor,
        checkColor: tokens.checkedHoverCheckColor || tokens.checkedCheckColor || tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.labelColor || null,
      };

    case 'checkedFocus':
      return {
        backgroundColor: tokens.checkedFocusBackgroundColor || tokens.checkedBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.checkedFocusBorderColor || tokens.checkedBorderColor || tokens.borderColor,
        checkColor: tokens.checkedFocusCheckColor || tokens.checkedCheckColor || tokens.checkColor,
        outlineColor: tokens.checkedFocusOutlineColor || tokens.focusOutlineColor || null,
        labelColor: tokens.labelColor || null,
      };

    // ─────────────────────────────────────────────────────────────────────────
    // INDETERMINATE STATES
    // ─────────────────────────────────────────────────────────────────────────

    case 'indeterminate':
      return {
        backgroundColor: tokens.indeterminateBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.indeterminateBorderColor || tokens.borderColor,
        checkColor: tokens.indeterminateCheckColor || tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.labelColor || null,
      };

    case 'indeterminateHover':
      return {
        backgroundColor: tokens.indeterminateHoverBackgroundColor || tokens.indeterminateBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.indeterminateHoverBorderColor || tokens.indeterminateBorderColor || tokens.borderColor,
        checkColor: tokens.indeterminateHoverCheckColor || tokens.indeterminateCheckColor || tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.labelColor || null,
      };

    case 'indeterminateFocus':
      return {
        backgroundColor: tokens.indeterminateFocusBackgroundColor || tokens.indeterminateBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.indeterminateFocusBorderColor || tokens.indeterminateBorderColor || tokens.borderColor,
        checkColor: tokens.indeterminateFocusCheckColor || tokens.indeterminateCheckColor || tokens.checkColor,
        outlineColor: tokens.indeterminateFocusOutlineColor || tokens.focusOutlineColor || null,
        labelColor: tokens.labelColor || null,
      };

    // ─────────────────────────────────────────────────────────────────────────
    // DISABLED STATES
    // ─────────────────────────────────────────────────────────────────────────

    case 'disabled':
      return {
        backgroundColor: tokens.disabledBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.disabledBorderColor || tokens.borderColor,
        checkColor: tokens.disabledCheckColor || tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.disabledLabelColor || tokens.labelColor || null,
      };

    case 'checkedDisabled':
      return {
        backgroundColor: tokens.checkedDisabledBackgroundColor || tokens.disabledBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.checkedDisabledBorderColor || tokens.disabledBorderColor || tokens.borderColor,
        checkColor: tokens.checkedDisabledCheckColor || tokens.disabledCheckColor || tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.disabledLabelColor || tokens.labelColor || null,
      };

    case 'indeterminateDisabled':
      return {
        backgroundColor: tokens.indeterminateDisabledBackgroundColor || tokens.disabledBackgroundColor || tokens.backgroundColor,
        borderColor: tokens.indeterminateDisabledBorderColor || tokens.disabledBorderColor || tokens.borderColor,
        checkColor: tokens.indeterminateDisabledCheckColor || tokens.disabledCheckColor || tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.disabledLabelColor || tokens.labelColor || null,
      };

    default:
      // Fallback to base state
      return {
        backgroundColor: tokens.backgroundColor,
        borderColor: tokens.borderColor,
        checkColor: tokens.checkColor,
        outlineColor: null,
        labelColor: tokens.labelColor || null,
      };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  determineState,
  resolveTokens,
};

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Token SELECTION only (NOT calculation)
 *    - Selects tokens based on state
 *    - Falls back to base tokens
 *    - NO color transformations
 *
 * ✅ State determination is LOGIC (ALLOWED)
 *    - Priority-based state selection
 *    - NOT perceptual decision
 *
 * ✅ Framework-agnostic
 *    - Pure functions with no side effects
 *    - No framework dependencies
 *
 * PATTERN: Exact copy of textfield/tokenResolver.ts adapted for Checkbox
 * SUPPORTS: Tri-state checkboxes (unchecked, checked, indeterminate)
 */
