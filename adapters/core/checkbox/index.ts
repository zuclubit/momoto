/**
 * @fileoverview Checkbox Core - Exports
 *
 * FASE 15: Component Expansion
 *
 * Central export point for all checkbox core functionality.
 *
 * @module momoto-ui/adapters/core/checkbox
 * @version 1.0.0
 */

// ============================================================================
// MAIN CLASS
// ============================================================================

export { CheckboxCore, default } from './checkboxCore';

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
  CheckboxState,
  CheckboxSize,

  // Tokens
  CheckboxTokens,
  ResolvedCheckboxTokens,

  // Config
  SizeConfig,
  CheckboxSizeConfig,

  // Styles
  CheckboxStyles,

  // ARIA
  ARIAAttributes,

  // State tracking
  StateTracker,
  StateUpdater,

  // Events
  CheckboxEventHandlers,

  // Inputs
  DetermineStateInput,
  ResolveTokensInput,
  ComputeStylesInput,
  CreateEventHandlersInput,
  GenerateARIAInput,
  QualityCheckInput,

  // Quality
  QualityWarning,
} from './checkboxCore.types';

/**
 * USAGE EXAMPLES:
 *
 * # Example 1: Use CheckboxCore.processCheckbox() (simplest)
 * ```typescript
 * import { CheckboxCore } from '@momoto/ui-adapters/core/checkbox';
 *
 * const result = CheckboxCore.processCheckbox({
 *   tokens: checkboxTokens,
 *   isChecked: true,
 *   isIndeterminate: false,
 *   disabled: false,
 *   isHovered,
 *   isFocused,
 *   size: 'md',
 *   label: 'Accept terms',
 * });
 *
 * // result has: currentState, resolvedTokens, styles, ariaAttrs, classNames
 * ```
 *
 * # Example 2: Use individual methods (fine-grained control)
 * ```typescript
 * import { CheckboxCore } from '@momoto/ui-adapters/core/checkbox';
 *
 * const currentState = CheckboxCore.determineState({ isChecked, disabled, ... });
 * const resolvedTokens = CheckboxCore.resolveTokens({ state: currentState, tokens });
 * const sizeConfig = CheckboxCore.getSizeConfig(size);
 * const styles = CheckboxCore.computeStyles({ resolvedTokens, size, ... });
 * const ariaAttrs = CheckboxCore.generateARIA({ isChecked, disabled, ... });
 * const classNames = CheckboxCore.generateClassNames(currentState, size, ...);
 * ```
 *
 * # Example 3: Import individual functions directly
 * ```typescript
 * import {
 *   determineState,
 *   resolveTokens,
 *   computeStyles,
 *   generateARIA,
 * } from '@momoto/ui-adapters/core/checkbox';
 *
 * const state = determineState({ isChecked, disabled, ... });
 * const tokens = resolveTokens({ state, tokens: checkboxTokens });
 * // ...
 * ```
 *
 * # Example 4: Tri-state checkbox (indeterminate)
 * ```typescript
 * import { CheckboxCore } from '@momoto/ui-adapters/core/checkbox';
 *
 * const result = CheckboxCore.processCheckbox({
 *   tokens: checkboxTokens,
 *   isChecked: false,
 *   isIndeterminate: true, // ← Tri-state
 *   disabled: false,
 *   isHovered,
 *   isFocused,
 *   size: 'md',
 *   label: 'Select all',
 * });
 *
 * // result.ariaAttrs['aria-checked'] === 'mixed'
 * ```
 */
