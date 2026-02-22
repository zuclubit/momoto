/**
 * @fileoverview SelectCore - Central Exports
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Central export point for SelectCore.
 * Framework adapters import from here.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Framework-agnostic core
 * - ✅ 100% token-driven
 * - ✅ Zero perceptual logic
 * - ✅ WCAG 2.2 AA compliant
 *
 * @module momoto-ui/adapters/core/select
 * @version 1.0.0
 */

// ============================================================================
// CORE
// ============================================================================

export { SelectCore } from './selectCore';

// ============================================================================
// TYPES
// ============================================================================

export type {
  // State
  SelectState,

  // Options
  SelectOption,

  // Size
  SelectSize,
  SizeConfig,

  // Tokens
  SelectTokens,
  ResolvedSelectTokens,

  // Styles
  SelectStyles,

  // ARIA
  ARIAAttributes,

  // Quality
  QualityWarning,

  // Input/Output
  SelectCoreInput,
  SelectCoreOutput,
} from './selectCore.types';

// ============================================================================
// CONSTANTS
// ============================================================================

export {
  CLASS_PREFIX,
  SIZE_CONFIG,
  BORDER_WIDTH,
  BORDER_RADIUS,
  OUTLINE_WIDTH,
  OUTLINE_OFFSET,
  DROPDOWN_BORDER_WIDTH,
  DROPDOWN_BORDER_RADIUS,
  DROPDOWN_MAX_HEIGHT,
  DROPDOWN_Z_INDEX,
  DROPDOWN_OFFSET,
  DROPDOWN_SHADOW,
  OPTION_PADDING_X,
  OPTION_PADDING_Y,
  OPTION_DISABLED_OPACITY,
  TRANSITION,
  TRANSITION_DURATION,
  TRANSITION_EASING,
  TRANSITION_PROPERTIES,
  LABEL_FONT_WEIGHT,
  DISABLED_OPACITY,
  DISABLED_CURSOR,
  ICON_ROTATION_CLOSED,
  ICON_ROTATION_OPEN,
} from './constants';

/**
 * USAGE EXAMPLE (Framework Adapter):
 *
 * ```typescript
 * import { SelectCore, CLASS_PREFIX } from '../../core/select';
 * import type { SelectCoreInput } from '../../core/select';
 *
 * // In your component:
 * const selectOutput = SelectCore.processSelect({
 *   tokens,
 *   options,
 *   value,
 *   isOpen,
 *   disabled,
 *   isHovered,
 *   isFocused,
 *   hasError,
 *   size: 'md',
 *   // ... other params
 * });
 *
 * // Use selectOutput.styles, selectOutput.ariaAttrs, etc.
 * ```
 *
 * CRITICAL CONTRACT RULES:
 *
 * 1. ALWAYS use SelectCore.processSelect()
 *    - NO direct token access in adapters
 *    - NO state logic in adapters
 *    - NO style calculations in adapters
 *
 * 2. Adapters are THIN wrappers
 *    - Framework binding only (useState, computed, $:, @Input)
 *    - Event handling only (onClick, @change, on:click)
 *    - Render only (JSX, <template>, {#if})
 *
 * 3. NO color calculations ANYWHERE
 *    - isDark/isLight → FORBIDDEN
 *    - lighten/darken → FORBIDDEN
 *    - getContrastRatio → FORBIDDEN
 *    - All colors from tokens.toCssValue()
 *
 * 4. NO perceptual heuristics
 *    - Magic numbers → FORBIDDEN
 *    - Hardcoded colors → FORBIDDEN
 *    - "If light then..." → FORBIDDEN
 *
 * 5. State SELECTION not CALCULATION
 *    - determineState() uses priority rules
 *    - resolveTokens() uses switch statement
 *    - NO dynamic computation
 *
 * PATTERN CONSISTENCY:
 *
 * SelectCore follows EXACT same pattern as:
 * - ButtonCore (FASE 14)
 * - TextFieldCore (FASE 15.1)
 * - CheckboxCore (FASE 15.3)
 *
 * If you're unsure, look at those implementations.
 */
