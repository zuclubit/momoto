export { T as ThemeContext, a as ThemeContextActions, b as ThemeContextState, c as ThemeContextValue, d as ThemeProvider, e as ThemeProviderProps, u as useAppliedTokens, f as useDarkMode, g as useSystemPreferences, h as useTheme, i as useThemeContext, j as useThemePreferences, k as useThemeSwitcher, l as useThemeVariable } from '../../useTheme-h4ynBK7Q.js';
import React__default, { ReactNode, MouseEvent, CSSProperties } from 'react';
import { E as EnrichedToken } from '../../EnrichedToken-C16ENusG.js';
import * as react_jsx_runtime from 'react/jsx-runtime';
import '../../TokenCollection-tspMCTIo.js';
import '../../UIState-DmEU8dBf.js';
import '../../DesignToken-BFJu4GcO.js';
import '../../ThemeAdapterPort-SCERvwI1.js';
import '../css/index.js';

/**
 * @fileoverview ButtonCore Types - Framework-Agnostic Button Types
 *
 * FASE 13: Multi-Framework Adapters
 *
 * Shared type definitions used by all framework adapters.
 * These types are framework-agnostic and define the contract
 * for button behavior across React, Vue, Svelte, and Angular.
 *
 * @module momoto-ui/adapters/core/button/types
 * @version 1.0.0
 */

/**
 * ButtonSize - Available button sizes.
 */
type ButtonSize = 'sm' | 'md' | 'lg';
/**
 * IconPosition - Position of icon relative to label.
 */
type IconPosition = 'left' | 'right';

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

/**
 * ButtonProps - Props for React Button component.
 *
 * FASE 14: Matches the pattern established by Vue/Svelte/Angular adapters.
 */
interface ButtonProps {
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
    hoverBackgroundColor?: EnrichedToken;
    hoverTextColor?: EnrichedToken;
    hoverBorderColor?: EnrichedToken | null;
    focusBackgroundColor?: EnrichedToken;
    focusTextColor?: EnrichedToken;
    focusBorderColor?: EnrichedToken | null;
    focusOutlineColor?: EnrichedToken | null;
    activeBackgroundColor?: EnrichedToken;
    activeTextColor?: EnrichedToken;
    activeBorderColor?: EnrichedToken | null;
    disabledBackgroundColor?: EnrichedToken;
    disabledTextColor?: EnrichedToken;
    disabledBorderColor?: EnrichedToken | null;
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
    /**
     * Custom CSS class name(s).
     */
    className?: string;
    /**
     * Custom inline styles (merged with computed styles).
     */
    style?: CSSProperties;
    /**
     * ARIA label (overrides visible label for screen readers).
     */
    'aria-label'?: string;
    /**
     * ARIA describedby (references description element ID).
     */
    'aria-describedby'?: string;
    /**
     * Test ID for automated testing.
     */
    'data-testid'?: string;
    /**
     * Show quality warnings in console (dev mode).
     * @default process.env.NODE_ENV === 'development'
     */
    showQualityWarnings?: boolean;
}
/**
 * ButtonVariantProps - Props for ButtonWithVariant component.
 *
 * This variant automatically resolves tokens from the theme.
 */
interface ButtonVariantProps extends Omit<ButtonProps, 'backgroundColor' | 'textColor' | 'borderColor' | 'hoverBackgroundColor' | 'hoverTextColor' | 'hoverBorderColor' | 'focusBackgroundColor' | 'focusTextColor' | 'focusBorderColor' | 'focusOutlineColor' | 'activeBackgroundColor' | 'activeTextColor' | 'activeBorderColor' | 'disabledBackgroundColor' | 'disabledTextColor' | 'disabledBorderColor'> {
    /**
     * Button variant (resolves tokens from theme).
     * @default 'primary'
     */
    variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
}

/**
 * @fileoverview React Button Adapter - FASE 14 Refactor
 *
 * REFACTORED to use ButtonCore (was FASE 11 with embedded logic)
 *
 * This is a THIN wrapper that delegates all logic to ButtonCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to ButtonCore)
 * - ✅ 100% token-driven (via ButtonCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/react/button
 * @version 2.0.0 (FASE 14)
 */

/**
 * Button - Token-driven button component (REFACTORED for FASE 14).
 *
 * CHANGES FROM FASE 11:
 * - ✅ NOW uses ButtonCore.processButton() for ALL logic
 * - ✅ Reduced from ~420 LOC to ~180 LOC (57% reduction)
 * - ✅ Identical behavior to Vue/Svelte/Angular
 * - ✅ NO embedded logic (all in ButtonCore)
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven colors (NO calculations)
 * - ✅ State management via ButtonCore (NOT local logic)
 * - ✅ Accessibility from ButtonCore
 * - ✅ Full Momoto traceability
 *
 * @example
 * ```tsx
 * <Button
 *   label="Submit"
 *   backgroundColor={submitBg}
 *   textColor={submitText}
 *   onClick={handleSubmit}
 * />
 * ```
 */
declare function Button(props: ButtonProps): React__default.ReactElement;

/**
 * @fileoverview ButtonWithVariant - React Adapter with Theme Variant
 *
 * FASE 14: Core Consolidation
 *
 * React Button that resolves tokens from theme based on variant.
 * This is the preferred API for most use cases.
 *
 * @module momoto-ui/adapters/react/button/ButtonWithVariant
 * @version 2.0.0 (FASE 14)
 */

/**
 * ButtonWithVariant - Button that gets tokens from theme.
 *
 * Preferred API for most use cases. Automatically resolves
 * tokens from theme based on variant.
 *
 * FASE 14: Now uses refactored Button component (which uses ButtonCore).
 *
 * @example
 * ```tsx
 * <ButtonWithVariant
 *   label="Submit"
 *   variant="primary"
 *   onClick={handleSubmit}
 * />
 * ```
 */
declare function ButtonWithVariant({ variant, ...props }: ButtonVariantProps): React__default.ReactElement;

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

/**
 * TextFieldSize - Available sizes.
 */
type TextFieldSize = 'sm' | 'md' | 'lg';

/**
 * @fileoverview React TextField Types
 *
 * FASE 15: Component Expansion
 *
 * React-specific types for TextField component.
 *
 * @module momoto-ui/adapters/react/textfield/types
 * @version 1.0.0
 */

/**
 * TextFieldProps - React-specific TextField component props.
 *
 * Extends TextFieldCore contract with React-specific props:
 * - Event handlers (onChange, onFocus, onBlur)
 * - React styling (className, style)
 * - ARIA attributes
 * - Data attributes for testing
 *
 * CONTRACT: All colors must be EnrichedToken (NO hex strings).
 */
interface TextFieldProps {
    /**
     * Current value of the text field.
     */
    value: string;
    /**
     * Placeholder text when input is empty.
     */
    placeholder?: string;
    /**
     * Label text displayed above the input.
     */
    label?: string;
    /**
     * Helper text displayed below the input.
     */
    helperText?: string;
    /**
     * Background color token (REQUIRED).
     */
    backgroundColor: EnrichedToken;
    /**
     * Text color token (REQUIRED).
     */
    textColor: EnrichedToken;
    /**
     * Border color token (optional).
     */
    borderColor?: EnrichedToken;
    /**
     * Placeholder color token (optional).
     */
    placeholderColor?: EnrichedToken;
    /**
     * Label color token (optional).
     */
    labelColor?: EnrichedToken;
    /**
     * Helper text color token (optional).
     */
    helperTextColor?: EnrichedToken;
    hoverBackgroundColor?: EnrichedToken;
    hoverBorderColor?: EnrichedToken;
    focusBackgroundColor?: EnrichedToken;
    focusBorderColor?: EnrichedToken;
    errorBackgroundColor?: EnrichedToken;
    errorTextColor?: EnrichedToken;
    errorBorderColor?: EnrichedToken;
    errorLabelColor?: EnrichedToken;
    errorHelperTextColor?: EnrichedToken;
    successBackgroundColor?: EnrichedToken;
    successTextColor?: EnrichedToken;
    successBorderColor?: EnrichedToken;
    successLabelColor?: EnrichedToken;
    successHelperTextColor?: EnrichedToken;
    disabledBackgroundColor?: EnrichedToken;
    disabledTextColor?: EnrichedToken;
    disabledBorderColor?: EnrichedToken;
    disabledLabelColor?: EnrichedToken;
    /**
     * Change handler for input value.
     */
    onChange?: (value: string) => void;
    /**
     * Focus handler.
     */
    onFocus?: (event: React__default.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Blur handler.
     */
    onBlur?: (event: React__default.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Disabled state.
     * @default false
     */
    disabled?: boolean;
    /**
     * Error state (validation failed).
     * @default false
     */
    error?: boolean;
    /**
     * Success state (validation passed).
     * @default false
     */
    success?: boolean;
    /**
     * Required field indicator.
     * @default false
     */
    required?: boolean;
    /**
     * Input type for single-line inputs.
     * @default 'text'
     */
    type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'number';
    /**
     * Text field size.
     * @default 'md'
     */
    size?: TextFieldSize;
    /**
     * Full width (100% of container).
     * @default false
     */
    fullWidth?: boolean;
    /**
     * Multiline input (uses textarea instead of input).
     * @default false
     */
    multiline?: boolean;
    /**
     * Number of rows for multiline input.
     * @default 3
     */
    rows?: number;
    /**
     * Additional CSS class names.
     */
    className?: string;
    /**
     * Inline styles (merged with computed styles).
     */
    style?: React__default.CSSProperties;
    /**
     * Show quality warnings in dev mode.
     * @default process.env.NODE_ENV === 'development'
     */
    showQualityWarnings?: boolean;
    /**
     * ARIA label (overrides visible label for screen readers).
     */
    'aria-label'?: string;
    /**
     * ID of element that describes the input.
     */
    'aria-describedby'?: string;
    /**
     * Test ID for testing frameworks.
     */
    'data-testid'?: string;
}

/**
 * @fileoverview React TextField Adapter
 *
 * FASE 15: Component Expansion
 *
 * This is a THIN wrapper that delegates all logic to TextFieldCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to TextFieldCore)
 * - ✅ 100% token-driven (via TextFieldCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/react/textfield
 * @version 1.0.0
 */

/**
 * TextField - Token-driven text input component.
 *
 * PATTERN: Follows ButtonCore pattern exactly.
 * - ✅ Uses TextFieldCore.processTextField() for ALL logic
 * - ✅ Thin wrapper (framework-specific concerns only)
 * - ✅ NO embedded logic (all in TextFieldCore)
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven colors (NO calculations)
 * - ✅ State management via TextFieldCore (NOT local logic)
 * - ✅ Accessibility from TextFieldCore
 * - ✅ Full Momoto traceability
 *
 * @example
 * ```tsx
 * <TextField
 *   label="Email"
 *   value={email}
 *   onChange={setEmail}
 *   backgroundColor={inputBg}
 *   textColor={inputText}
 *   placeholder="Enter your email"
 * />
 * ```
 */
declare function TextField(props: TextFieldProps): React__default.ReactElement;

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

/**
 * CheckboxSize - Size variants.
 */
type CheckboxSize = 'sm' | 'md' | 'lg';

/**
 * @fileoverview React Checkbox Types
 *
 * FASE 15: Component Expansion
 *
 * React-specific types for Checkbox component.
 *
 * @module momoto-ui/adapters/react/checkbox/types
 * @version 1.0.0
 */

/**
 * CheckboxProps - React-specific Checkbox component props.
 *
 * Extends CheckboxCore contract with React-specific props:
 * - Event handlers (onChange, onFocus, onBlur)
 * - React styling (className, style)
 * - ARIA attributes
 * - Data attributes for testing
 *
 * CONTRACT: All colors must be EnrichedToken (NO hex strings).
 */
interface CheckboxProps {
    /**
     * Checked state of the checkbox.
     * @default false
     */
    checked?: boolean;
    /**
     * Indeterminate state (tri-state checkbox).
     * Takes precedence over checked state for display.
     * @default false
     */
    indeterminate?: boolean;
    /**
     * Label text displayed next to checkbox.
     */
    label?: string;
    /**
     * Background color token (REQUIRED).
     */
    backgroundColor: EnrichedToken;
    /**
     * Border color token (REQUIRED).
     */
    borderColor: EnrichedToken;
    /**
     * Checkmark/dash color token (REQUIRED).
     */
    checkColor: EnrichedToken;
    /**
     * Label color token (optional).
     */
    labelColor?: EnrichedToken;
    hoverBackgroundColor?: EnrichedToken;
    hoverBorderColor?: EnrichedToken;
    focusBackgroundColor?: EnrichedToken;
    focusBorderColor?: EnrichedToken;
    focusOutlineColor?: EnrichedToken;
    checkedBackgroundColor?: EnrichedToken;
    checkedBorderColor?: EnrichedToken;
    checkedCheckColor?: EnrichedToken;
    checkedHoverBackgroundColor?: EnrichedToken;
    checkedHoverBorderColor?: EnrichedToken;
    checkedHoverCheckColor?: EnrichedToken;
    checkedFocusBackgroundColor?: EnrichedToken;
    checkedFocusBorderColor?: EnrichedToken;
    checkedFocusCheckColor?: EnrichedToken;
    checkedFocusOutlineColor?: EnrichedToken;
    indeterminateBackgroundColor?: EnrichedToken;
    indeterminateBorderColor?: EnrichedToken;
    indeterminateCheckColor?: EnrichedToken;
    indeterminateHoverBackgroundColor?: EnrichedToken;
    indeterminateHoverBorderColor?: EnrichedToken;
    indeterminateHoverCheckColor?: EnrichedToken;
    indeterminateFocusBackgroundColor?: EnrichedToken;
    indeterminateFocusBorderColor?: EnrichedToken;
    indeterminateFocusCheckColor?: EnrichedToken;
    indeterminateFocusOutlineColor?: EnrichedToken;
    disabledBackgroundColor?: EnrichedToken;
    disabledBorderColor?: EnrichedToken;
    disabledCheckColor?: EnrichedToken;
    disabledLabelColor?: EnrichedToken;
    checkedDisabledBackgroundColor?: EnrichedToken;
    checkedDisabledBorderColor?: EnrichedToken;
    checkedDisabledCheckColor?: EnrichedToken;
    indeterminateDisabledBackgroundColor?: EnrichedToken;
    indeterminateDisabledBorderColor?: EnrichedToken;
    indeterminateDisabledCheckColor?: EnrichedToken;
    /**
     * Change handler for checkbox state.
     */
    onChange?: (checked: boolean) => void;
    /**
     * Focus handler.
     */
    onFocus?: (event: React__default.FocusEvent<HTMLInputElement>) => void;
    /**
     * Blur handler.
     */
    onBlur?: (event: React__default.FocusEvent<HTMLInputElement>) => void;
    /**
     * Disabled state.
     * @default false
     */
    disabled?: boolean;
    /**
     * Required field indicator.
     * @default false
     */
    required?: boolean;
    /**
     * Invalid state (validation failed).
     * @default false
     */
    invalid?: boolean;
    /**
     * Checkbox size.
     * @default 'md'
     */
    size?: CheckboxSize;
    /**
     * Additional CSS class names.
     */
    className?: string;
    /**
     * Inline styles (merged with computed styles).
     */
    style?: React__default.CSSProperties;
    /**
     * Show quality warnings in dev mode.
     * @default process.env.NODE_ENV === 'development'
     */
    showQualityWarnings?: boolean;
    /**
     * ARIA label (overrides visible label for screen readers).
     */
    'aria-label'?: string;
    /**
     * ID of element that describes the checkbox.
     */
    'aria-describedby'?: string;
    /**
     * Test ID for testing frameworks.
     */
    'data-testid'?: string;
}

/**
 * @fileoverview React Checkbox Adapter
 *
 * FASE 15: Component Expansion
 *
 * This is a THIN wrapper that delegates all logic to CheckboxCore.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ Zero logic duplication (delegates to CheckboxCore)
 * - ✅ 100% token-driven (via CheckboxCore)
 * - ✅ NO perceptual logic
 * - ✅ Framework-specific state management only
 *
 * @module momoto-ui/adapters/react/checkbox
 * @version 1.0.0
 */

/**
 * Checkbox - Token-driven checkbox component.
 *
 * PATTERN: Follows TextField/Button pattern exactly.
 * - ✅ Uses CheckboxCore.processCheckbox() for ALL logic
 * - ✅ Thin wrapper (framework-specific concerns only)
 * - ✅ NO embedded logic (all in CheckboxCore)
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven colors (NO calculations)
 * - ✅ State management via CheckboxCore (NOT local logic)
 * - ✅ Accessibility from CheckboxCore
 * - ✅ Full Momoto traceability
 * - ✅ Tri-state support (unchecked, checked, indeterminate)
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms"
 *   checked={accepted}
 *   onChange={setAccepted}
 *   backgroundColor={checkboxBg}
 *   borderColor={checkboxBorder}
 *   checkColor={checkmark}
 * />
 * ```
 */
declare function Checkbox(props: CheckboxProps): React__default.ReactElement;

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

/**
 * SelectOption - Single option in the dropdown.
 */
interface SelectOption<T = string> {
    /** Display label */
    label: string;
    /** Internal value */
    value: T;
    /** Whether this option is disabled */
    disabled?: boolean;
    /** Optional description/helper text */
    description?: string;
}
/**
 * SelectSize - Predefined size variants.
 */
type SelectSize = 'sm' | 'md' | 'lg';
/**
 * SelectStyles - Computed CSS properties for Select.
 */
interface SelectStyles {
    containerDisplay: string;
    containerFlexDirection: string;
    containerGap: number;
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
    outlineWidth: number;
    outlineOffset: number;
    outlineColor: string | null;
    placeholderColor: string;
    iconSize: number;
    iconColor: string;
    iconTransform: string;
    labelDisplay: string;
    labelFontSize: number;
    labelColor: string;
    labelFontWeight: number;
    helperDisplay: string;
    helperFontSize: number;
    helperColor: string;
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
    optionPaddingX: number;
    optionPaddingY: number;
    optionFontSize: number;
    optionTextColor: string;
    optionCursor: string;
    optionTransition: string;
    optionHoverBackgroundColor: string;
    optionHoverTextColor: string;
    optionSelectedBackgroundColor: string;
    optionSelectedTextColor: string;
    optionDisabledTextColor: string;
    optionDisabledBackgroundColor: string;
    optionDisabledCursor: string;
    optionDisabledOpacity: number;
    [key: string]: string | number | null;
}

/**
 * @fileoverview React Select Types
 *
 * FASE 15.4: Component Expansion - Select
 *
 * React-specific types for Select component.
 *
 * @module momoto-ui/adapters/react/select/types
 * @version 1.0.0
 */

/**
 * SelectProps - Props for React Select component.
 */
interface SelectProps<T = string> {
    options: SelectOption<T>[];
    value: T | null;
    onChange: (value: T | null) => void;
    placeholder?: string;
    backgroundColor: EnrichedToken;
    borderColor: EnrichedToken;
    textColor: EnrichedToken;
    placeholderColor?: EnrichedToken;
    iconColor?: EnrichedToken;
    hoverBackgroundColor?: EnrichedToken;
    hoverBorderColor?: EnrichedToken;
    hoverTextColor?: EnrichedToken;
    hoverIconColor?: EnrichedToken;
    focusBackgroundColor?: EnrichedToken;
    focusBorderColor?: EnrichedToken;
    focusTextColor?: EnrichedToken;
    focusOutlineColor?: EnrichedToken;
    focusIconColor?: EnrichedToken;
    openBackgroundColor?: EnrichedToken;
    openBorderColor?: EnrichedToken;
    openTextColor?: EnrichedToken;
    openOutlineColor?: EnrichedToken;
    openIconColor?: EnrichedToken;
    openHoverBackgroundColor?: EnrichedToken;
    openHoverBorderColor?: EnrichedToken;
    openFocusBackgroundColor?: EnrichedToken;
    openFocusBorderColor?: EnrichedToken;
    openFocusOutlineColor?: EnrichedToken;
    disabledBackgroundColor?: EnrichedToken;
    disabledBorderColor?: EnrichedToken;
    disabledTextColor?: EnrichedToken;
    disabledPlaceholderColor?: EnrichedToken;
    disabledLabelColor?: EnrichedToken;
    disabledIconColor?: EnrichedToken;
    errorBackgroundColor?: EnrichedToken;
    errorBorderColor?: EnrichedToken;
    errorTextColor?: EnrichedToken;
    errorMessageColor?: EnrichedToken;
    errorIconColor?: EnrichedToken;
    errorHoverBackgroundColor?: EnrichedToken;
    errorHoverBorderColor?: EnrichedToken;
    errorFocusBackgroundColor?: EnrichedToken;
    errorFocusBorderColor?: EnrichedToken;
    errorFocusOutlineColor?: EnrichedToken;
    labelColor?: EnrichedToken;
    helperTextColor?: EnrichedToken;
    dropdownBackgroundColor: EnrichedToken;
    dropdownBorderColor?: EnrichedToken;
    dropdownShadowColor?: EnrichedToken;
    optionTextColor: EnrichedToken;
    optionHoverBackgroundColor?: EnrichedToken;
    optionHoverTextColor?: EnrichedToken;
    optionSelectedBackgroundColor?: EnrichedToken;
    optionSelectedTextColor?: EnrichedToken;
    optionDisabledTextColor?: EnrichedToken;
    optionDisabledBackgroundColor?: EnrichedToken;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    size?: SelectSize;
    label?: string;
    helperText?: string;
    errorMessage?: string;
    className?: string;
    style?: Partial<SelectStyles>;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaLabelledby?: string;
    testId?: string;
    showQualityWarnings?: boolean;
}

/**
 * Select - React dropdown component.
 *
 * ARCHITECTURE:
 * - Delegates ALL logic to SelectCore.processSelect()
 * - Manages only React-specific state (isOpen, isHovered, isFocused)
 * - NO color calculations, NO perceptual logic
 *
 * @param props - Select props
 * @returns React element
 */
declare function Select<T = string>(props: SelectProps<T>): react_jsx_runtime.JSX.Element;

/**
 * @fileoverview SwitchCore Types
 *
 * FASE 15.5: Component Expansion - Switch (Final Base Component)
 *
 * Type definitions for framework-agnostic Switch component.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven (no color calculations)
 * - ✅ State-based token selection (no heuristics)
 * - ✅ Framework-agnostic (pure TypeScript)
 * - ✅ WCAG 2.2 AA compliant
 *
 * @module momoto-ui/adapters/core/switch/types
 * @version 1.0.0
 */

/**
 * SwitchSize - Predefined size variants.
 */
type SwitchSize = 'sm' | 'md' | 'lg';
/**
 * SwitchStyles - Computed CSS properties for Switch.
 */
interface SwitchStyles {
    containerDisplay: string;
    containerAlignItems: string;
    containerGap: number;
    trackPosition: string;
    trackDisplay: string;
    trackWidth: number;
    trackHeight: number;
    trackBackgroundColor: string;
    trackBorderWidth: number;
    trackBorderStyle: string;
    trackBorderColor: string;
    trackBorderRadius: number;
    trackCursor: string;
    trackTransition: string;
    trackOpacity: number;
    outlineWidth: number;
    outlineOffset: number;
    outlineColor: string | null;
    thumbPosition: string;
    thumbDisplay: string;
    thumbWidth: number;
    thumbHeight: number;
    thumbBackgroundColor: string;
    thumbBorderRadius: number;
    thumbTransition: string;
    thumbTransform: string;
    labelDisplay: string;
    labelFontSize: number;
    labelColor: string;
    labelFontWeight: number;
    helperDisplay: string;
    helperFontSize: number;
    helperColor: string;
    [key: string]: string | number | null;
}

/**
 * @fileoverview React Switch Types
 * FASE 15.5: Component Expansion - Switch
 */

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    trackBackgroundColor: EnrichedToken;
    trackBorderColor: EnrichedToken;
    thumbColor: EnrichedToken;
    hoverTrackBackgroundColor?: EnrichedToken;
    hoverTrackBorderColor?: EnrichedToken;
    hoverThumbColor?: EnrichedToken;
    focusTrackBackgroundColor?: EnrichedToken;
    focusTrackBorderColor?: EnrichedToken;
    focusThumbColor?: EnrichedToken;
    focusOutlineColor?: EnrichedToken;
    checkedTrackBackgroundColor: EnrichedToken;
    checkedTrackBorderColor?: EnrichedToken;
    checkedThumbColor?: EnrichedToken;
    checkedHoverTrackBackgroundColor?: EnrichedToken;
    checkedHoverTrackBorderColor?: EnrichedToken;
    checkedHoverThumbColor?: EnrichedToken;
    checkedFocusTrackBackgroundColor?: EnrichedToken;
    checkedFocusTrackBorderColor?: EnrichedToken;
    checkedFocusThumbColor?: EnrichedToken;
    checkedFocusOutlineColor?: EnrichedToken;
    disabledTrackBackgroundColor?: EnrichedToken;
    disabledTrackBorderColor?: EnrichedToken;
    disabledThumbColor?: EnrichedToken;
    disabledLabelColor?: EnrichedToken;
    checkedDisabledTrackBackgroundColor?: EnrichedToken;
    checkedDisabledTrackBorderColor?: EnrichedToken;
    checkedDisabledThumbColor?: EnrichedToken;
    errorTrackBackgroundColor?: EnrichedToken;
    errorTrackBorderColor?: EnrichedToken;
    errorThumbColor?: EnrichedToken;
    errorMessageColor?: EnrichedToken;
    errorHoverTrackBackgroundColor?: EnrichedToken;
    errorHoverTrackBorderColor?: EnrichedToken;
    errorHoverThumbColor?: EnrichedToken;
    errorFocusTrackBackgroundColor?: EnrichedToken;
    errorFocusTrackBorderColor?: EnrichedToken;
    errorFocusThumbColor?: EnrichedToken;
    errorFocusOutlineColor?: EnrichedToken;
    labelColor?: EnrichedToken;
    helperTextColor?: EnrichedToken;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    size?: SwitchSize;
    helperText?: string;
    errorMessage?: string;
    className?: string;
    style?: Partial<SwitchStyles>;
    ariaLabel?: string;
    ariaDescribedby?: string;
    ariaLabelledby?: string;
    testId?: string;
    showQualityWarnings?: boolean;
}

declare function Switch(props: SwitchProps): react_jsx_runtime.JSX.Element;

/**
 * @fileoverview Card Component - Type Definitions
 *
 * Card is a container component with elevation, borders, and interactive states.
 * Core primitive for building modern UI layouts.
 *
 * @module adapters/core/card/cardCore.types
 * @version 1.0.0
 */

/**
 * Card visual variants
 */
declare enum CardVariant {
    DEFAULT = "default",// Basic card with border
    ELEVATED = "elevated",// Card with shadow, no border
    INTERACTIVE = "interactive",// Elevated + hover effects
    OUTLINED = "outlined",// Border only, no shadow
    FLAT = "flat"
}
/**
 * Card padding sizes
 */
declare enum CardPadding {
    NONE = "none",// 0
    SM = "sm",// 12px
    MD = "md",// 16px
    LG = "lg",// 24px
    XL = "xl"
}
/**
 * Card border radius sizes
 */
declare enum CardRadius {
    NONE = "none",// 0
    SM = "sm",// 4px
    MD = "md",// 8px
    LG = "lg",// 12px
    XL = "xl",// 16px
    FULL = "full"
}
/**
 * Card component props
 */
interface CardProps {
    children?: React.ReactNode;
    variant?: CardVariant;
    padding?: CardPadding;
    radius?: CardRadius;
    backgroundColor?: EnrichedToken;
    borderColor?: EnrichedToken;
    borderWidth?: string;
    shadowColor?: string;
    hoverBackgroundColor?: EnrichedToken;
    hoverBorderColor?: EnrichedToken;
    hoverShadowColor?: string;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    role?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    testId?: string;
}

/**
 * @fileoverview Card Component - React Adapter
 *
 * Card container component with variants, elevation, and interactive states.
 *
 * @module adapters/react/card
 * @version 1.0.0
 */

/**
 * Card Component
 *
 * Flexible container component with elevation and interactive states.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <h2>Title</h2>
 *   <p>Content here...</p>
 * </Card>
 *
 * // Interactive card with onClick
 * <Card variant="interactive" onClick={() => console.log('clicked')}>
 *   <h2>Clickable Card</h2>
 * </Card>
 *
 * // Outlined card with custom padding
 * <Card variant="outlined" padding="md">
 *   <h2>Outlined Card</h2>
 * </Card>
 * ```
 */
declare function Card(props: CardProps): JSX.Element;

/**
 * @fileoverview Stat Component Types
 *
 * Type definitions for the Stat component (KPI display).
 *
 * @module adapters/core/stat/statCore.types
 * @version 1.0.0
 */

/**
 * Stat Size Variants
 */
declare enum StatSize {
    SM = "sm",
    MD = "md",
    LG = "lg",
    XL = "xl"
}
/**
 * Trend Direction
 */
declare enum TrendDirection {
    UP = "up",
    DOWN = "down",
    NEUTRAL = "neutral"
}
/**
 * Trend configuration
 */
interface StatTrend {
    /** Trend direction */
    direction: TrendDirection;
    /** Trend value (e.g., "+10.3%", "-5.2%") */
    value: string;
    /** Optional description (e.g., "vs last month") */
    description?: string;
    /** Optional color override */
    color?: EnrichedToken;
}
/**
 * Stat Props
 */
interface StatProps {
    /** Stat label */
    label: string;
    /** Stat value (formatted) */
    value: string | number;
    /** Optional trend indicator */
    trend?: StatTrend;
    /** Optional helper text */
    helperText?: string;
    /** Size variant */
    size?: StatSize;
    /** Custom label color */
    labelColor?: EnrichedToken;
    /** Custom value color */
    valueColor?: EnrichedToken;
    /** Custom helper text color */
    helperTextColor?: EnrichedToken;
    /** Additional CSS class */
    className?: string;
    /** Additional inline styles */
    style?: React.CSSProperties;
    /** Unique identifier */
    id?: string;
}

/**
 * @fileoverview Stat Component - React Adapter
 *
 * KPI/Stat display component with trend indicators.
 *
 * @module adapters/react/stat
 * @version 1.0.0
 */

/**
 * Stat Component
 *
 * Display KPIs and metrics with optional trend indicators.
 *
 * @example
 * ```tsx
 * // Basic stat
 * <Stat
 *   label="Total Revenue"
 *   value="$75,000"
 *   size="xl"
 * />
 *
 * // Stat with trend
 * <Stat
 *   label="Active Clients"
 *   value={42}
 *   trend={{
 *     direction: TrendDirection.UP,
 *     value: '+10.3%',
 *     description: 'vs last month',
 *   }}
 *   size="lg"
 * />
 *
 * // Stat with helper text
 * <Stat
 *   label="Weighted Value"
 *   value="$58,000"
 *   helperText="Probability-weighted forecast"
 *   size="md"
 * />
 * ```
 */
declare function Stat(props: StatProps): JSX.Element;

/**
 * @fileoverview Badge Component Types
 *
 * Type definitions for the Badge component (status indicators).
 *
 * @module adapters/core/badge/badgeCore.types
 * @version 1.0.0
 */

/**
 * Badge Variants
 */
declare enum BadgeVariant {
    SOLID = "solid",
    SUBTLE = "subtle",
    OUTLINE = "outline"
}
/**
 * Badge Size Variants
 */
declare enum BadgeSize {
    SM = "sm",
    MD = "md",
    LG = "lg"
}
/**
 * Badge Props
 */
interface BadgeProps {
    /** Badge content/label */
    children: React.ReactNode;
    /** Visual variant */
    variant?: BadgeVariant;
    /** Size variant */
    size?: BadgeSize;
    /** Background color */
    backgroundColor?: EnrichedToken;
    /** Text color */
    textColor?: EnrichedToken;
    /** Border color (for outline variant) */
    borderColor?: EnrichedToken;
    /** Additional CSS class */
    className?: string;
    /** Additional inline styles */
    style?: React.CSSProperties;
    /** Unique identifier */
    id?: string;
    /** Click handler */
    onClick?: () => void;
}

/**
 * @fileoverview Badge Component - React Adapter
 *
 * Status indicator badge component.
 *
 * @module adapters/react/badge
 * @version 1.0.0
 */

/**
 * Badge Component
 *
 * Display status indicators, tags, and labels.
 *
 * @example
 * ```tsx
 * // Solid badge
 * <Badge
 *   variant="solid"
 *   backgroundColor={successBg}
 *   textColor={successText}
 * >
 *   Won
 * </Badge>
 *
 * // Subtle badge
 * <Badge
 *   variant="subtle"
 *   backgroundColor={warningBg}
 *   textColor={warningText}
 *   size="md"
 * >
 *   Negotiation
 * </Badge>
 *
 * // Outline badge
 * <Badge
 *   variant="outline"
 *   textColor={primaryText}
 *   borderColor={primaryBorder}
 * >
 *   Lead
 * </Badge>
 *
 * // Clickable badge
 * <Badge
 *   onClick={() => console.log('Clicked!')}
 *   backgroundColor={neutralBg}
 *   textColor={neutralText}
 * >
 *   Clickable
 * </Badge>
 * ```
 */
declare function Badge(props: BadgeProps): JSX.Element;

export { Badge, type BadgeProps, BadgeSize, BadgeVariant, Button, type ButtonProps, type ButtonVariantProps, ButtonWithVariant, Card, CardPadding, type CardProps, CardRadius, CardVariant, Checkbox, type CheckboxProps, Select, type SelectProps, Stat, type StatProps, StatSize, type StatTrend, Switch, type SwitchProps, TextField, type TextFieldProps, TrendDirection };
