/**
 * @fileoverview TextFieldCore Types - Framework-Agnostic TextField Types
 *
 * FASE 15: Component Expansion
 *
 * Shared type definitions for TextField component across all frameworks.
 * Follows ButtonCore pattern established in FASE 13/14.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Framework-agnostic types
 * - ✅ NO perceptual logic
 * - ✅ Token-driven design
 *
 * @module momoto-ui/adapters/core/textfield/types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// TEXTFIELD STATE
// ============================================================================

/**
 * TextFieldState - All possible text field states.
 *
 * State priority (highest to lowest):
 * 1. disabled (blocks all interactions)
 * 2. error (validation failed)
 * 3. success (validation passed)
 * 4. focus (keyboard focus - CRITICAL for inputs)
 * 5. hover (mouse over)
 * 6. base (default state)
 */
export type TextFieldState =
  | 'base'      // default
  | 'hover'     // mouse over
  | 'focus'     // keyboard focus (CRITICAL)
  | 'disabled'  // blocked
  | 'error'     // validation error
  | 'success';  // validation success

/**
 * TextFieldSize - Available sizes.
 */
export type TextFieldSize = 'sm' | 'md' | 'lg';

/**
 * TextFieldType - HTML input types supported.
 */
export type TextFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'number';

// ============================================================================
// TOKEN TYPES
// ============================================================================

/**
 * TextFieldTokens - All tokens required for a text field.
 */
export interface TextFieldTokens {
  // Background tokens
  backgroundColor: EnrichedToken;
  hoverBackgroundColor?: EnrichedToken;
  focusBackgroundColor?: EnrichedToken;
  errorBackgroundColor?: EnrichedToken;
  successBackgroundColor?: EnrichedToken;
  disabledBackgroundColor?: EnrichedToken;

  // Text tokens
  textColor: EnrichedToken;
  placeholderColor?: EnrichedToken;
  errorTextColor?: EnrichedToken;
  successTextColor?: EnrichedToken;
  disabledTextColor?: EnrichedToken;

  // Border tokens
  borderColor?: EnrichedToken | null;
  hoverBorderColor?: EnrichedToken | null;
  focusBorderColor?: EnrichedToken | null;
  errorBorderColor?: EnrichedToken | null;
  successBorderColor?: EnrichedToken | null;
  disabledBorderColor?: EnrichedToken | null;

  // Label tokens
  labelColor?: EnrichedToken;
  errorLabelColor?: EnrichedToken;
  successLabelColor?: EnrichedToken;
  disabledLabelColor?: EnrichedToken;

  // Helper text tokens
  helperTextColor?: EnrichedToken;
  errorHelperTextColor?: EnrichedToken;
  successHelperTextColor?: EnrichedToken;
}

/**
 * ResolvedTextFieldTokens - Tokens resolved for current state.
 */
export interface ResolvedTextFieldTokens {
  backgroundColor: EnrichedToken;
  textColor: EnrichedToken;
  placeholderColor: EnrichedToken | null;
  borderColor: EnrichedToken | null;
  labelColor: EnrichedToken | null;
  helperTextColor: EnrichedToken | null;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * SizeConfig - Size configuration for a text field size.
 */
export interface SizeConfig {
  height: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  labelFontSize: number;
  helperFontSize: number;
}

/**
 * TextFieldSizeConfig - Configuration for all text field sizes.
 */
export type TextFieldSizeConfig = Record<TextFieldSize, SizeConfig>;

// ============================================================================
// STYLE TYPES
// ============================================================================

/**
 * TextFieldStyles - Framework-agnostic style object.
 */
export interface TextFieldStyles {
  // Container
  containerWidth: string;
  containerDisplay: string;
  containerFlexDirection: string;
  containerGap: number;

  // Input
  inputHeight: number;
  inputPaddingLeft: number;
  inputPaddingRight: number;
  inputPaddingTop: number;
  inputPaddingBottom: number;
  inputFontSize: number;
  inputFontWeight: number;
  inputLineHeight: number;
  inputFontFamily: string;
  inputBackgroundColor: string;
  inputColor: string;
  inputBorderWidth?: number;
  inputBorderStyle?: string;
  inputBorderColor?: string;
  inputBorderRadius: number;
  inputOutline: string;
  inputCursor: string;
  inputTransition: string;

  // Placeholder
  placeholderColor?: string;

  // Label
  labelFontSize?: number;
  labelFontWeight?: number;
  labelColor?: string;
  labelMarginBottom?: number;

  // Helper text
  helperFontSize?: number;
  helperColor?: string;
  helperMarginTop?: number;
}

// ============================================================================
// ARIA TYPES
// ============================================================================

/**
 * ARIAAttributes - Accessibility attributes for text field.
 */
export interface ARIAAttributes {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  'aria-disabled'?: boolean;
  role?: string;
}

// ============================================================================
// STATE TRACKER TYPES
// ============================================================================

/**
 * StateTracker - Tracks text field interaction states.
 */
export interface StateTracker {
  isHovered: boolean;
  isFocused: boolean;
}

/**
 * StateUpdater - Functions to update state.
 */
export interface StateUpdater {
  setHovered: (value: boolean) => void;
  setFocused: (value: boolean) => void;
}

// ============================================================================
// EVENT HANDLER TYPES
// ============================================================================

/**
 * TextFieldEventHandlers - Framework-agnostic event handlers.
 */
export interface TextFieldEventHandlers {
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// ============================================================================
// CORE INPUT TYPES
// ============================================================================

/**
 * DetermineStateInput - Input for state determination.
 */
export interface DetermineStateInput {
  disabled: boolean;
  error: boolean;
  success: boolean;
  isFocused: boolean;
  isHovered: boolean;
}

/**
 * ResolveTokensInput - Input for token resolution.
 */
export interface ResolveTokensInput {
  state: TextFieldState;
  tokens: TextFieldTokens;
}

/**
 * ComputeStylesInput - Input for style computation.
 */
export interface ComputeStylesInput {
  resolvedTokens: ResolvedTextFieldTokens;
  size: TextFieldSize;
  fullWidth: boolean;
  multiline: boolean;
  currentState: TextFieldState;
  sizeConfig: SizeConfig;
}

/**
 * CreateEventHandlersInput - Input for event handler creation.
 */
export interface CreateEventHandlersInput {
  disabled: boolean;
  onChange?: (value: string) => void;
  stateUpdater: StateUpdater;
}

/**
 * GenerateARIAInput - Input for ARIA generation.
 */
export interface GenerateARIAInput {
  label?: string;
  disabled: boolean;
  error: boolean;
  required: boolean;
  ariaLabel?: string;
  ariaDescribedby?: string;
}

// ============================================================================
// QUALITY WARNING TYPES
// ============================================================================

/**
 * QualityWarning - Quality warning for dev mode.
 */
export interface QualityWarning {
  type: 'low_quality_bg' | 'low_quality_text' | 'wcag_fail';
  message: string;
  details: Record<string, any>;
}

/**
 * QualityCheckInput - Input for quality checks.
 */
export interface QualityCheckInput {
  resolvedTokens: ResolvedTextFieldTokens;
  showWarnings: boolean;
}

// ============================================================================
// NOTE: All types are exported inline above (export type/interface)
// ============================================================================

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Framework-agnostic types
 *    - NO React/Vue/Svelte/Angular dependencies
 *    - Plain TypeScript types
 *
 * ✅ Token-driven design
 *    - All colors from EnrichedToken
 *    - State-specific tokens (hover, focus, error, etc.)
 *
 * ✅ NO perceptual logic
 *    - Types describe structure only
 *    - NO calculation logic in types
 *
 * PATTERN: Exact copy of ButtonCore.types.ts adapted for TextField
 */
