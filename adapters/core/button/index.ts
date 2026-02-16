/**
 * @fileoverview Button Core - Exports
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Central export point for all button core functionality.
 *
 * @module momoto-ui/adapters/core/button
 * @version 1.0.0
 */

// ============================================================================
// MAIN CLASS
// ============================================================================

export { ButtonCore, default } from './buttonCore';

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
  FOCUS_OUTLINE_OFFSET,
  QUALITY_THRESHOLD,
  CONFIDENCE_THRESHOLD,
  CLASS_PREFIX,
} from './constants';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // State
  ButtonState,
  ButtonSize,
  ButtonVariant,
  IconPosition,

  // Tokens
  ButtonTokens,
  ResolvedButtonTokens,

  // Config
  SizeConfig,
  ButtonSizeConfig,

  // Styles
  ButtonStyles,

  // ARIA
  ARIAAttributes,

  // State tracking
  StateTracker,
  StateUpdater,

  // Events
  ButtonEventHandlers,

  // Inputs
  DetermineStateInput,
  ResolveTokensInput,
  ComputeStylesInput,
  CreateEventHandlersInput,
  GenerateARIAInput,
  QualityCheckInput,

  // Quality
  QualityWarning,
} from './buttonCore.types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Use ButtonCore.processButton() (simplest)
 * ```typescript
 * import { ButtonCore } from '@momoto/ui-adapters/core/button';
 *
 * const result = ButtonCore.processButton({
 *   tokens: buttonTokens,
 *   disabled: false,
 *   loading: false,
 *   isHovered,
 *   isFocused,
 *   isActive,
 *   size: 'md',
 *   fullWidth: false,
 *   hasIcon: true,
 *   label: 'Submit',
 * });
 *
 * // result has: currentState, resolvedTokens, styles, ariaAttrs, classNames
 * ```
 *
 * # Example 2: Use individual methods (fine-grained control)
 * ```typescript
 * import { ButtonCore } from '@momoto/ui-adapters/core/button';
 *
 * const currentState = ButtonCore.determineState({ disabled, loading, ... });
 * const resolvedTokens = ButtonCore.resolveTokens({ state: currentState, tokens });
 * const sizeConfig = ButtonCore.getSizeConfig(size);
 * const styles = ButtonCore.computeStyles({ resolvedTokens, size, ... });
 * const ariaAttrs = ButtonCore.generateARIA({ label, disabled, ... });
 * const classNames = ButtonCore.generateClassNames(currentState, size, ...);
 * ```
 *
 * # Example 3: Import individual functions directly
 * ```typescript
 * import {
 *   determineState,
 *   resolveTokens,
 *   computeStyles,
 *   generateARIA,
 * } from '@momoto/ui-adapters/core/button';
 *
 * const state = determineState({ disabled, loading, ... });
 * const tokens = resolveTokens({ state, tokens: buttonTokens });
 * // ...
 * ```
 */
