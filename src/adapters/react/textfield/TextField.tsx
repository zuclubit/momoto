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

import React, { useState, useMemo } from 'react';
import { TextFieldCore, CLASS_PREFIX } from '../../core/textfield';
import type { TextFieldProps } from './types';

// ============================================================================
// TEXTFIELD COMPONENT
// ============================================================================

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
export function TextField(props: TextFieldProps): React.ReactElement {
  // ──────────────────────────────────────────────────────────────────────────
  // DESTRUCTURE PROPS
  // ──────────────────────────────────────────────────────────────────────────

  const {
    // Content
    value,
    placeholder,
    label,
    helperText,

    // Tokens (base)
    backgroundColor,
    textColor,
    borderColor,
    placeholderColor,
    labelColor,
    helperTextColor,

    // Tokens (hover)
    hoverBackgroundColor,
    hoverBorderColor,

    // Tokens (focus)
    focusBackgroundColor,
    focusBorderColor,

    // Tokens (error)
    errorBackgroundColor,
    errorTextColor,
    errorBorderColor,
    errorLabelColor,
    errorHelperTextColor,

    // Tokens (success)
    successBackgroundColor,
    successTextColor,
    successBorderColor,
    successLabelColor,
    successHelperTextColor,

    // Tokens (disabled)
    disabledBackgroundColor,
    disabledTextColor,
    disabledBorderColor,
    disabledLabelColor,

    // Behavior
    onChange,
    onFocus,
    onBlur,
    disabled = false,
    error = false,
    success = false,
    required = false,
    type = 'text',

    // Layout
    size = 'md',
    fullWidth = false,
    multiline = false,
    rows = 3,

    // Styling
    className,
    style,

    // Advanced
    showQualityWarnings = process.env.NODE_ENV === 'development',

    // ARIA
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'data-testid': testId,
  } = props;

  // ──────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT (React-specific)
  // ──────────────────────────────────────────────────────────────────────────

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // TEXTFIELD CORE INTEGRATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Process text field logic via TextFieldCore.
   *
   * This replaces ALL embedded logic - pure delegation.
   * - State determination → TextFieldCore
   * - Token resolution → TextFieldCore
   * - Style computation → TextFieldCore
   * - ARIA generation → TextFieldCore
   * - Quality checks → TextFieldCore
   *
   * NO logic duplication.
   */
  const textFieldOutput = useMemo(() => {
    return TextFieldCore.processTextField({
      // Tokens
      tokens: {
        backgroundColor,
        textColor,
        borderColor,
        placeholderColor,
        labelColor,
        helperTextColor,
        hoverBackgroundColor,
        hoverBorderColor,
        focusBackgroundColor,
        focusBorderColor,
        errorBackgroundColor,
        errorTextColor,
        errorBorderColor,
        errorLabelColor,
        errorHelperTextColor,
        successBackgroundColor,
        successTextColor,
        successBorderColor,
        successLabelColor,
        successHelperTextColor,
        disabledBackgroundColor,
        disabledTextColor,
        disabledBorderColor,
        disabledLabelColor,
      },

      // Interaction state
      disabled,
      error,
      success,
      isHovered,
      isFocused,

      // Layout
      size,
      fullWidth,
      multiline,

      // Content
      label,
      helperText,

      // ARIA
      required,
      ariaLabel,
      ariaDescribedby,

      // Styles (cast to match core types)
      userStyles: style as any,

      // Dev mode
      showQualityWarnings,
      customClass: className,
    });
  }, [
    // Tokens
    backgroundColor, textColor, borderColor, placeholderColor, labelColor, helperTextColor,
    hoverBackgroundColor, hoverBorderColor,
    focusBackgroundColor, focusBorderColor,
    errorBackgroundColor, errorTextColor, errorBorderColor, errorLabelColor, errorHelperTextColor,
    successBackgroundColor, successTextColor, successBorderColor, successLabelColor, successHelperTextColor,
    disabledBackgroundColor, disabledTextColor, disabledBorderColor, disabledLabelColor,
    // State
    disabled, error, success, isHovered, isFocused,
    // Layout
    size, fullWidth, multiline,
    // Content
    label, helperText,
    // ARIA
    required, ariaLabel, ariaDescribedby,
    // Styles
    style, className,
    // Dev
    showQualityWarnings,
  ]);

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY WARNINGS (DEV MODE ONLY)
  // ──────────────────────────────────────────────────────────────────────────

  // Log quality warnings from TextFieldCore
  useMemo(() => {
    if (textFieldOutput.qualityWarnings.length > 0) {
      textFieldOutput.qualityWarnings.forEach((warning) => {
        console.warn(`[TextField] ${warning.message}`, warning.details);
      });
    }
  }, [textFieldOutput.qualityWarnings]);

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS (React-specific)
  // ──────────────────────────────────────────────────────────────────────────

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onChange?.(event.target.value);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (disabled) return;
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // COMPUTED STYLES
  // ──────────────────────────────────────────────────────────────────────────

  // Container styles
  const containerStyles: React.CSSProperties = {
    width: textFieldOutput.styles.containerWidth,
    display: textFieldOutput.styles.containerDisplay,
    flexDirection: textFieldOutput.styles.containerFlexDirection as React.CSSProperties['flexDirection'],
    gap: textFieldOutput.styles.containerGap,
  };

  // Input styles
  const inputStyles: React.CSSProperties = {
    height: multiline ? 'auto' : textFieldOutput.styles.inputHeight,
    paddingLeft: textFieldOutput.styles.inputPaddingLeft,
    paddingRight: textFieldOutput.styles.inputPaddingRight,
    paddingTop: textFieldOutput.styles.inputPaddingTop,
    paddingBottom: textFieldOutput.styles.inputPaddingBottom,
    fontSize: textFieldOutput.styles.inputFontSize,
    fontWeight: textFieldOutput.styles.inputFontWeight,
    lineHeight: textFieldOutput.styles.inputLineHeight,
    fontFamily: textFieldOutput.styles.inputFontFamily,
    backgroundColor: textFieldOutput.styles.inputBackgroundColor,
    color: textFieldOutput.styles.inputColor,
    borderRadius: textFieldOutput.styles.inputBorderRadius,
    outline: textFieldOutput.styles.inputOutline,
    cursor: textFieldOutput.styles.inputCursor,
    transition: textFieldOutput.styles.inputTransition,
    borderWidth: textFieldOutput.styles.inputBorderWidth,
    borderStyle: textFieldOutput.styles.inputBorderStyle,
    borderColor: textFieldOutput.styles.inputBorderColor,
  };

  // Label styles
  const labelStyles: React.CSSProperties | undefined = textFieldOutput.styles.labelColor ? {
    fontSize: textFieldOutput.styles.labelFontSize,
    fontWeight: textFieldOutput.styles.labelFontWeight,
    color: textFieldOutput.styles.labelColor,
    marginBottom: textFieldOutput.styles.labelMarginBottom,
  } : undefined;

  // Helper text styles
  const helperStyles: React.CSSProperties | undefined = textFieldOutput.styles.helperColor ? {
    fontSize: textFieldOutput.styles.helperFontSize,
    color: textFieldOutput.styles.helperColor,
    marginTop: textFieldOutput.styles.helperMarginTop,
  } : undefined;

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  // Common input props
  const commonInputProps = {
    value,
    placeholder,
    onChange: handleChange,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    disabled,
    required,
    style: inputStyles,
    'data-testid': testId,
    // ✅ MOMOTO TRACEABILITY (dev mode)
    'data-momoto-bg-quality': showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.qualityScore : undefined,
    'data-momoto-bg-decision': showQualityWarnings ? textFieldOutput.resolvedTokens.backgroundColor.sourceDecisionId : undefined,
    'data-momoto-text-quality': showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.qualityScore : undefined,
    'data-momoto-wcag-ratio': showQualityWarnings ? textFieldOutput.resolvedTokens.textColor.accessibility?.wcagRatio : undefined,
    ...textFieldOutput.ariaAttrs,
  };

  return (
    <div style={containerStyles} className={textFieldOutput.classNames}>
      {/* Label (optional) */}
      {label && (
        <label
          className={`${CLASS_PREFIX}__label`}
          style={labelStyles}
        >
          {label}
          {required && <span aria-label="required"> *</span>}
        </label>
      )}

      {/* Input or Textarea */}
      {multiline ? (
        <textarea
          {...commonInputProps}
          rows={rows}
          className={`${CLASS_PREFIX}__input ${CLASS_PREFIX}__input--multiline`}
        />
      ) : (
        <input
          {...commonInputProps}
          type={type}
          className={`${CLASS_PREFIX}__input`}
        />
      )}

      {/* Helper text (optional) */}
      {helperText && (
        <div
          className={`${CLASS_PREFIX}__helper`}
          style={helperStyles}
        >
          {helperText}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default TextField;

/**
 * CONTRACT COMPLIANCE VERIFICATION (FASE 15):
 *
 * ✅ Zero logic duplication
 *    - ALL logic delegated to TextFieldCore.processTextField()
 *    - Adapter is THIN wrapper
 *
 * ✅ 100% token-driven
 *    - All colors from EnrichedToken (via TextFieldCore)
 *    - NO local color calculations
 *
 * ✅ State management via framework
 *    - Uses React useState for interaction state
 *    - TextFieldCore handles state determination
 *
 * ✅ Framework-specific concerns only
 *    - Component rendering (React-specific)
 *    - Event handling (React events → TextFieldCore)
 *    - Memoization (React useMemo)
 *
 * ✅ Follows ButtonCore pattern
 *    - Same structure as Button.tsx
 *    - Same delegation approach
 *    - Same contract compliance
 *
 * PATTERN: Exact copy of Button.tsx adapted for TextField
 * VERIFIED: 100% compliance with ComponentCore pattern
 */
