/**
 * @fileoverview SelectCore Types
 *
 * FASE 15.4: Component Expansion - Select
 *
 * Type definitions for framework-agnostic Select component.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven (no color calculations)
 * - ✅ State-based token selection (no heuristics)
 * - ✅ Framework-agnostic (pure TypeScript)
 * - ✅ WCAG 2.2 AA compliant
 *
 * @module momoto-ui/adapters/core/select/types
 * @version 1.0.0
 */

import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// SELECT STATE
// ============================================================================

/**
 * SelectState - All possible select states.
 *
 * State priority (highest to lowest):
 * 1. disabled
 * 2. error
 * 3. open (dropdown is open)
 * 4. focus
 * 5. hover
 * 6. base
 */
export type SelectState =
  | 'base'
  | 'hover'
  | 'focus'
  | 'open'
  | 'openHover'
  | 'openFocus'
  | 'disabled'
  | 'error'
  | 'errorHover'
  | 'errorFocus';

// ============================================================================
// SELECT OPTION
// ============================================================================

/**
 * SelectOption - Single option in the dropdown.
 */
export interface SelectOption<T = string> {
  /** Display label */
  label: string;

  /** Internal value */
  value: T;

  /** Whether this option is disabled */
  disabled?: boolean;

  /** Optional description/helper text */
  description?: string;
}

// ============================================================================
// SELECT SIZE
// ============================================================================

/**
 * SelectSize - Predefined size variants.
 */
export type SelectSize = 'sm' | 'md' | 'lg';

/**
 * SizeConfig - Size-specific dimensions.
 */
export interface SizeConfig {
  /** Field height in pixels */
  height: number;

  /** Horizontal padding in pixels */
  paddingX: number;

  /** Font size in pixels */
  fontSize: number;

  /** Label font size in pixels */
  labelFontSize: number;

  /** Helper text font size in pixels */
  helperFontSize: number;

  /** Icon size in pixels */
  iconSize: number;

  /** Gap between label and field in pixels */
  labelGap: number;

  /** Gap between field and helper text in pixels */
  helperGap: number;
}

// ============================================================================
// SELECT TOKENS (INPUT)
// ============================================================================

/**
 * SelectTokens - All token inputs for Select.
 *
 * CRITICAL: All colors MUST come from EnrichedToken.
 * NO color calculations, NO hardcoded values.
 */
export interface SelectTokens {
  // ──────────────────────────────────────────────────────────────────────────
  // FIELD - BASE STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Field background color (base state) */
  backgroundColor: EnrichedToken;

  /** Field border color (base state) */
  borderColor: EnrichedToken;

  /** Field text color (base state) */
  textColor: EnrichedToken;

  /** Placeholder text color (base state) */
  placeholderColor?: EnrichedToken;

  /** Chevron icon color (base state) */
  iconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // FIELD - HOVER STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Field background color (hover) */
  hoverBackgroundColor?: EnrichedToken;

  /** Field border color (hover) */
  hoverBorderColor?: EnrichedToken;

  /** Field text color (hover) */
  hoverTextColor?: EnrichedToken;

  /** Chevron icon color (hover) */
  hoverIconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // FIELD - FOCUS STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Field background color (focus) */
  focusBackgroundColor?: EnrichedToken;

  /** Field border color (focus) */
  focusBorderColor?: EnrichedToken;

  /** Field text color (focus) */
  focusTextColor?: EnrichedToken;

  /** Focus outline color */
  focusOutlineColor?: EnrichedToken;

  /** Chevron icon color (focus) */
  focusIconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // FIELD - OPEN STATE (dropdown visible)
  // ──────────────────────────────────────────────────────────────────────────

  /** Field background color (open) */
  openBackgroundColor?: EnrichedToken;

  /** Field border color (open) */
  openBorderColor?: EnrichedToken;

  /** Field text color (open) */
  openTextColor?: EnrichedToken;

  /** Open outline color */
  openOutlineColor?: EnrichedToken;

  /** Chevron icon color (open) */
  openIconColor?: EnrichedToken;

  /** Field background color (open + hover) */
  openHoverBackgroundColor?: EnrichedToken;

  /** Field border color (open + hover) */
  openHoverBorderColor?: EnrichedToken;

  /** Field background color (open + focus) */
  openFocusBackgroundColor?: EnrichedToken;

  /** Field border color (open + focus) */
  openFocusBorderColor?: EnrichedToken;

  /** Open focus outline color */
  openFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // FIELD - DISABLED STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Field background color (disabled) */
  disabledBackgroundColor?: EnrichedToken;

  /** Field border color (disabled) */
  disabledBorderColor?: EnrichedToken;

  /** Field text color (disabled) */
  disabledTextColor?: EnrichedToken;

  /** Placeholder color (disabled) */
  disabledPlaceholderColor?: EnrichedToken;

  /** Label color (disabled) */
  disabledLabelColor?: EnrichedToken;

  /** Chevron icon color (disabled) */
  disabledIconColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // FIELD - ERROR STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Field background color (error) */
  errorBackgroundColor?: EnrichedToken;

  /** Field border color (error) */
  errorBorderColor?: EnrichedToken;

  /** Field text color (error) */
  errorTextColor?: EnrichedToken;

  /** Error message text color */
  errorMessageColor?: EnrichedToken;

  /** Chevron icon color (error) */
  errorIconColor?: EnrichedToken;

  /** Field background color (error + hover) */
  errorHoverBackgroundColor?: EnrichedToken;

  /** Field border color (error + hover) */
  errorHoverBorderColor?: EnrichedToken;

  /** Field background color (error + focus) */
  errorFocusBackgroundColor?: EnrichedToken;

  /** Field border color (error + focus) */
  errorFocusBorderColor?: EnrichedToken;

  /** Error focus outline color */
  errorFocusOutlineColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // LABEL & HELPER TEXT
  // ──────────────────────────────────────────────────────────────────────────

  /** Label text color */
  labelColor?: EnrichedToken;

  /** Helper text color */
  helperTextColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // DROPDOWN MENU
  // ──────────────────────────────────────────────────────────────────────────

  /** Dropdown background color */
  dropdownBackgroundColor: EnrichedToken;

  /** Dropdown border color */
  dropdownBorderColor?: EnrichedToken;

  /** Dropdown shadow color */
  dropdownShadowColor?: EnrichedToken;

  // ──────────────────────────────────────────────────────────────────────────
  // DROPDOWN OPTIONS
  // ──────────────────────────────────────────────────────────────────────────

  /** Option text color (base) */
  optionTextColor: EnrichedToken;

  /** Option background color (hover) */
  optionHoverBackgroundColor?: EnrichedToken;

  /** Option text color (hover) */
  optionHoverTextColor?: EnrichedToken;

  /** Option background color (selected) */
  optionSelectedBackgroundColor?: EnrichedToken;

  /** Option text color (selected) */
  optionSelectedTextColor?: EnrichedToken;

  /** Option text color (disabled) */
  optionDisabledTextColor?: EnrichedToken;

  /** Option background color (disabled) */
  optionDisabledBackgroundColor?: EnrichedToken;
}

// ============================================================================
// RESOLVED TOKENS (OUTPUT)
// ============================================================================

/**
 * ResolvedSelectTokens - Tokens after state-based selection.
 *
 * These are the FINAL tokens to use for styling.
 */
export interface ResolvedSelectTokens {
  // Field
  backgroundColor: EnrichedToken;
  borderColor: EnrichedToken;
  textColor: EnrichedToken;
  placeholderColor: EnrichedToken;
  iconColor: EnrichedToken;
  outlineColor: EnrichedToken | null;

  // Label & helper
  labelColor: EnrichedToken;
  helperTextColor: EnrichedToken;

  // Dropdown
  dropdownBackgroundColor: EnrichedToken;
  dropdownBorderColor: EnrichedToken;
  dropdownShadowColor: EnrichedToken;

  // Options
  optionTextColor: EnrichedToken;
  optionHoverBackgroundColor: EnrichedToken;
  optionHoverTextColor: EnrichedToken;
  optionSelectedBackgroundColor: EnrichedToken;
  optionSelectedTextColor: EnrichedToken;
  optionDisabledTextColor: EnrichedToken;
  optionDisabledBackgroundColor: EnrichedToken;
}

// ============================================================================
// SELECT STYLES (OUTPUT)
// ============================================================================

/**
 * SelectStyles - Computed CSS properties for Select.
 */
export interface SelectStyles {
  // Container
  containerDisplay: string;
  containerFlexDirection: string;
  containerGap: number;

  // Field
  fieldPosition: string;
  fieldDisplay: string;
  fieldAlignItems: string;
  fieldJustifyContent: string;
  fieldHeight: number;
  fieldPaddingX: number;
  fieldBackgroundColor: string;
  fieldBorderWidth: number;
  fieldBorderStyle: string;
  fieldBorderColor: string;
  fieldBorderRadius: number;
  fieldTextColor: string;
  fieldFontSize: number;
  fieldCursor: string;
  fieldTransition: string;
  fieldOpacity: number;

  // Outline (focus/open)
  outlineWidth: number;
  outlineOffset: number;
  outlineColor: string | null;

  // Placeholder
  placeholderColor: string;

  // Icon (chevron)
  iconSize: number;
  iconColor: string;
  iconTransform: string; // rotate(0deg) or rotate(180deg)

  // Label
  labelDisplay: string;
  labelFontSize: number;
  labelColor: string;
  labelFontWeight: number;

  // Helper text
  helperDisplay: string;
  helperFontSize: number;
  helperColor: string;

  // Dropdown menu
  dropdownPosition: string;
  dropdownTop: string;
  dropdownLeft: string;
  dropdownRight: string;
  dropdownZIndex: number;
  dropdownBackgroundColor: string;
  dropdownBorderWidth: number;
  dropdownBorderStyle: string;
  dropdownBorderColor: string;
  dropdownBorderRadius: number;
  dropdownBoxShadow: string;
  dropdownMaxHeight: number;
  dropdownOverflowY: string;

  // Option
  optionPaddingX: number;
  optionPaddingY: number;
  optionFontSize: number;
  optionTextColor: string;
  optionCursor: string;
  optionTransition: string;

  // Option - hover
  optionHoverBackgroundColor: string;
  optionHoverTextColor: string;

  // Option - selected
  optionSelectedBackgroundColor: string;
  optionSelectedTextColor: string;

  // Option - disabled
  optionDisabledTextColor: string;
  optionDisabledBackgroundColor: string;
  optionDisabledCursor: string;
  optionDisabledOpacity: number;

  // User overrides
  [key: string]: string | number | null;
}

// ============================================================================
// ARIA ATTRIBUTES
// ============================================================================

/**
 * ARIAAttributes - WCAG 2.2 AA compliant ARIA attributes for Select.
 */
export interface ARIAAttributes {
  /** Combobox role */
  'role': 'combobox';

  /** Whether dropdown is expanded */
  'aria-expanded': boolean;

  /** ID of the listbox element */
  'aria-controls': string;

  /** ID of the currently focused option */
  'aria-activedescendant'?: string;

  /** Whether field is disabled */
  'aria-disabled'?: boolean;

  /** Whether field is required */
  'aria-required'?: boolean;

  /** Whether field has error */
  'aria-invalid'?: boolean;

  /** Accessible label */
  'aria-label'?: string;

  /** ID of element describing the field */
  'aria-describedby'?: string;

  /** ID of label element */
  'aria-labelledby'?: string;
}

// ============================================================================
// QUALITY WARNING
// ============================================================================

/**
 * QualityWarning - Dev mode quality warning.
 */
export interface QualityWarning {
  /** Warning severity */
  severity: 'error' | 'warning' | 'info';

  /** Human-readable message */
  message: string;

  /** Technical details */
  details: Record<string, unknown>;
}

// ============================================================================
// SELECT CORE INPUT
// ============================================================================

/**
 * SelectCoreInput - Input parameters for SelectCore.processSelect().
 */
export interface SelectCoreInput<T = string> {
  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  /** All token inputs */
  tokens: SelectTokens;

  // ──────────────────────────────────────────────────────────────────────────
  // SELECT STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Available options */
  options: SelectOption<T>[];

  /** Currently selected value */
  value: T | null;

  /** Placeholder text */
  placeholder?: string;

  /** Whether dropdown is open */
  isOpen: boolean;

  /** Currently highlighted option value (for keyboard navigation) */
  highlightedValue?: T | null;

  // ──────────────────────────────────────────────────────────────────────────
  // INTERACTION STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Whether field is disabled */
  disabled: boolean;

  /** Whether field is hovered */
  isHovered: boolean;

  /** Whether field is focused */
  isFocused: boolean;

  /** Whether field has error */
  hasError: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // LAYOUT
  // ──────────────────────────────────────────────────────────────────────────

  /** Size variant */
  size?: SelectSize;

  // ──────────────────────────────────────────────────────────────────────────
  // CONTENT
  // ──────────────────────────────────────────────────────────────────────────

  /** Field label */
  label?: string;

  /** Helper text */
  helperText?: string;

  /** Error message */
  errorMessage?: string;

  /** Whether field is required */
  required?: boolean;

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────────────────────────────────────

  /** Custom aria-label */
  ariaLabel?: string;

  /** ID of element describing the field */
  ariaDescribedby?: string;

  /** ID of label element */
  ariaLabelledby?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLING
  // ──────────────────────────────────────────────────────────────────────────

  /** User-provided style overrides */
  userStyles?: Partial<SelectStyles>;

  /** Custom CSS class */
  customClass?: string;

  // ──────────────────────────────────────────────────────────────────────────
  // DEVELOPER EXPERIENCE
  // ──────────────────────────────────────────────────────────────────────────

  /** Enable quality warnings in dev mode */
  showQualityWarnings?: boolean;
}

// ============================================================================
// SELECT CORE OUTPUT
// ============================================================================

/**
 * SelectCoreOutput - Output from SelectCore.processSelect().
 */
export interface SelectCoreOutput<T = string> {
  // ──────────────────────────────────────────────────────────────────────────
  // STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** Determined state */
  state: SelectState;

  /** Currently selected option (or null) */
  selectedOption: SelectOption<T> | null;

  /** Display value (selected label or placeholder) */
  displayValue: string;

  // ──────────────────────────────────────────────────────────────────────────
  // TOKENS
  // ──────────────────────────────────────────────────────────────────────────

  /** Resolved tokens (after state selection) */
  resolvedTokens: ResolvedSelectTokens;

  // ──────────────────────────────────────────────────────────────────────────
  // STYLES
  // ──────────────────────────────────────────────────────────────────────────

  /** Computed styles */
  styles: SelectStyles;

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA
  // ──────────────────────────────────────────────────────────────────────────

  /** ARIA attributes */
  ariaAttrs: ARIAAttributes;

  // ──────────────────────────────────────────────────────────────────────────
  // CSS CLASSES
  // ──────────────────────────────────────────────────────────────────────────

  /** Generated CSS class names */
  classNames: string;

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY
  // ──────────────────────────────────────────────────────────────────────────

  /** Quality warnings (dev mode) */
  qualityWarnings: QualityWarning[];
}
