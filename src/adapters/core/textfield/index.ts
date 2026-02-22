/**
 * @fileoverview TextField Core - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for all text field core functionality.
 *
 * @module momoto-ui/adapters/core/textfield
 * @version 1.0.0
 */

// ============================================================================
// MAIN CLASS
// ============================================================================

export { TextFieldCore, default } from './textFieldCore';

// ============================================================================
// INDIVIDUAL MODULES
// ============================================================================

export {
  determineState,
  resolveTokens,
} from './tokenResolver';

export {
  computeStyles,
  mergeStyles,
} from './styleComputer';

export {
  generateARIA,
  generateClassNames,
  validateARIA,
} from './ariaGenerator';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  SIZE_CONFIG,
  BORDER_RADIUS,
  TRANSITION_DURATION,
  FOCUS_OUTLINE_WIDTH,
  LABEL_MARGIN_BOTTOM,
  HELPER_MARGIN_TOP,
  QUALITY_THRESHOLD,
  CONFIDENCE_THRESHOLD,
  CLASS_PREFIX,
} from './constants';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // State
  TextFieldState,
  TextFieldSize,

  // Tokens
  TextFieldTokens,
  ResolvedTextFieldTokens,

  // Config
  SizeConfig,
  TextFieldSizeConfig,

  // Styles
  TextFieldStyles,

  // ARIA
  ARIAAttributes,

  // State tracking
  StateTracker,
  StateUpdater,

  // Events
  TextFieldEventHandlers,

  // Inputs
  DetermineStateInput,
  ResolveTokensInput,
  ComputeStylesInput,
  CreateEventHandlersInput,
  GenerateARIAInput,
  QualityCheckInput,

  // Quality
  QualityWarning,
} from './textFieldCore.types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Use TextFieldCore.processTextField() (simplest)
 * ```typescript
 * import { TextFieldCore } from '@momoto/ui-adapters/core/textfield';
 *
 * const result = TextFieldCore.processTextField({
 *   tokens: textFieldTokens,
 *   disabled: false,
 *   error: false,
 *   success: false,
 *   isHovered,
 *   isFocused,
 *   size: 'md',
 *   fullWidth: false,
 *   multiline: false,
 *   label: 'Email',
 *   helperText: 'Enter your email address',
 * });
 *
 * // result has: currentState, resolvedTokens, styles, ariaAttrs, classNames
 * ```
 *
 * # Example 2: Use individual methods (fine-grained control)
 * ```typescript
 * import { TextFieldCore } from '@momoto/ui-adapters/core/textfield';
 *
 * const currentState = TextFieldCore.determineState({ disabled, error, ... });
 * const resolvedTokens = TextFieldCore.resolveTokens({ state: currentState, tokens });
 * const sizeConfig = TextFieldCore.getSizeConfig(size);
 * const styles = TextFieldCore.computeStyles({ resolvedTokens, size, ... });
 * const ariaAttrs = TextFieldCore.generateARIA({ label, disabled, ... });
 * const classNames = TextFieldCore.generateClassNames(currentState, size, ...);
 * ```
 *
 * # Example 3: Import individual functions directly
 * ```typescript
 * import {
 *   determineState,
 *   resolveTokens,
 *   computeStyles,
 *   generateARIA,
 * } from '@momoto/ui-adapters/core/textfield';
 *
 * const state = determineState({ disabled, error, ... });
 * const tokens = resolveTokens({ state, tokens: textFieldTokens });
 * // ...
 * ```
 */
