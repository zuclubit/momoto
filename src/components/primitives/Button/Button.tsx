/**
 * @fileoverview Button Component - Canonical FASE 11 Implementation
 *
 * FASE 11: UI Primitives & Component Kit
 *
 * This is the CANONICAL reference implementation demonstrating
 * all FASE 11 principles:
 * - 100% Momoto-governed (zero local decisions)
 * - Token-driven state management
 * - Accessibility by construction
 * - Full traceability and explainability
 *
 * @module momoto-ui/components/primitives/Button
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import type { ButtonProps, ButtonVariantProps, ResolvedButtonTokens, ButtonState } from './Button.types';
import { useTokenTheme } from '../tokens/TokenProvider';
import { classNames } from '../utils/classNames';
import { createButtonAria } from '../utils/aria';

// ============================================================================
// SIZE CONFIGURATION (Non-color constants - ALLOWED)
// ============================================================================

const SIZE_CONFIG = {
  sm: {
    height: 32,
    paddingX: 12,
    paddingY: 6,
    fontSize: 14,
    iconSize: 16,
    gap: 6,
  },
  md: {
    height: 40,
    paddingX: 16,
    paddingY: 8,
    fontSize: 16,
    iconSize: 20,
    gap: 8,
  },
  lg: {
    height: 48,
    paddingX: 20,
    paddingY: 12,
    fontSize: 18,
    iconSize: 24,
    gap: 10,
  },
} as const;

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

/**
 * Button - Canonical token-driven button component.
 *
 * CONTRACT COMPLIANCE:
 * - ✅ 100% token-driven colors (NO calculations)
 * - ✅ State management via token selection (NOT computation)
 * - ✅ Accessibility from token metadata
 * - ✅ Full Momoto traceability
 *
 * @example
 * ```tsx
 * // Pattern A: Explicit tokens
 * <Button
 *   label="Submit"
 *   backgroundColor={submitBg}
 *   textColor={submitText}
 *   hoverBackgroundColor={submitBgHover}
 *   onClick={handleSubmit}
 * />
 *
 * // Pattern B: Theme variant
 * <Button
 *   label="Submit"
 *   variant="primary"
 *   onClick={handleSubmit}
 * />
 * ```
 */
export function Button(props: ButtonProps): React.ReactElement {
  // ──────────────────────────────────────────────────────────────────────────
  // DESTRUCTURE PROPS
  // ──────────────────────────────────────────────────────────────────────────

  const {
    // Content
    label,
    icon,
    iconPosition = 'left',

    // Tokens - Base
    backgroundColor,
    textColor,
    borderColor,

    // Tokens - Hover
    hoverBackgroundColor,
    hoverTextColor,
    hoverBorderColor,

    // Tokens - Focus
    focusBackgroundColor,
    focusTextColor,
    focusBorderColor,
    focusOutlineColor,

    // Tokens - Active
    activeBackgroundColor,
    activeTextColor,
    activeBorderColor,

    // Tokens - Disabled
    disabledBackgroundColor,
    disabledTextColor,
    disabledBorderColor,

    // Behavior
    onClick,
    disabled = false,
    type = 'button',
    loading = false,

    // Layout
    size = 'md',
    fullWidth = false,

    // Styling
    className,
    style,

    // Advanced
    showQualityWarnings = process.env.NODE_ENV === 'development',

    // ARIA
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'data-testid': testId,

    ...restAriaProps
  } = props;

  // ──────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // ──────────────────────────────────────────────────────────────────────────
  // DETERMINE CURRENT STATE (NO LOGIC - JUST STATE PRIORITY)
  // ──────────────────────────────────────────────────────────────────────────

  const currentState: ButtonState = useMemo(() => {
    if (disabled || loading) return 'disabled';
    if (isActive) return 'active';
    if (isFocused) return 'focus';
    if (isHovered) return 'hover';
    return 'base';
  }, [disabled, loading, isActive, isFocused, isHovered]);

  // ──────────────────────────────────────────────────────────────────────────
  // RESOLVE TOKENS FOR CURRENT STATE (✅ SELECTION, NOT CALCULATION)
  // ──────────────────────────────────────────────────────────────────────────

  const resolvedTokens: ResolvedButtonTokens = useMemo(() => {
    switch (currentState) {
      case 'disabled':
        return {
          backgroundColor: disabledBackgroundColor || backgroundColor,
          textColor: disabledTextColor || textColor,
          borderColor: disabledBorderColor || borderColor || null,
          outlineColor: null,
        };

      case 'active':
        return {
          backgroundColor: activeBackgroundColor || backgroundColor,
          textColor: activeTextColor || textColor,
          borderColor: activeBorderColor || borderColor || null,
          outlineColor: null,
        };

      case 'focus':
        return {
          backgroundColor: focusBackgroundColor || backgroundColor,
          textColor: focusTextColor || textColor,
          borderColor: focusBorderColor || borderColor || null,
          outlineColor: focusOutlineColor || null,
        };

      case 'hover':
        return {
          backgroundColor: hoverBackgroundColor || backgroundColor,
          textColor: hoverTextColor || textColor,
          borderColor: hoverBorderColor || borderColor || null,
          outlineColor: null,
        };

      case 'base':
      default:
        return {
          backgroundColor,
          textColor,
          borderColor: borderColor || null,
          outlineColor: null,
        };
    }
  }, [
    currentState,
    backgroundColor, textColor, borderColor,
    hoverBackgroundColor, hoverTextColor, hoverBorderColor,
    focusBackgroundColor, focusTextColor, focusBorderColor, focusOutlineColor,
    activeBackgroundColor, activeTextColor, activeBorderColor,
    disabledBackgroundColor, disabledTextColor, disabledBorderColor,
  ]);

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY WARNINGS (DEV MODE ONLY)
  // ──────────────────────────────────────────────────────────────────────────

  if (showQualityWarnings) {
    // Warn if background color has low quality
    if (resolvedTokens.backgroundColor.isLowQuality) {
      console.warn(
        `[Button] Low quality background token: ${resolvedTokens.backgroundColor.name}`,
        {
          score: resolvedTokens.backgroundColor.qualityScore,
          reason: resolvedTokens.backgroundColor.reason,
          decisionId: resolvedTokens.backgroundColor.sourceDecisionId,
        }
      );
    }

    // Warn if text color has low quality
    if (resolvedTokens.textColor.isLowQuality) {
      console.warn(
        `[Button] Low quality text token: ${resolvedTokens.textColor.name}`,
        {
          score: resolvedTokens.textColor.qualityScore,
          reason: resolvedTokens.textColor.reason,
          decisionId: resolvedTokens.textColor.sourceDecisionId,
        }
      );
    }

    // Warn if WCAG contrast fails
    const accessibility = resolvedTokens.textColor.accessibility;
    if (accessibility && !accessibility.passesAA) {
      console.warn(
        `[Button] Text color fails WCAG AA contrast`,
        {
          wcagRatio: accessibility.wcagRatio,
          textToken: resolvedTokens.textColor.name,
          bgToken: resolvedTokens.backgroundColor.name,
        }
      );
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SIZE CONFIGURATION
  // ──────────────────────────────────────────────────────────────────────────

  const sizeConfig = SIZE_CONFIG[size];

  // ──────────────────────────────────────────────────────────────────────────
  // STYLES (✅ FROM TOKENS ONLY)
  // ──────────────────────────────────────────────────────────────────────────

  const buttonStyle: React.CSSProperties = {
    // Layout
    height: sizeConfig.height,
    paddingLeft: sizeConfig.paddingX,
    paddingRight: sizeConfig.paddingX,
    paddingTop: sizeConfig.paddingY,
    paddingBottom: sizeConfig.paddingY,
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: icon ? sizeConfig.gap : 0,

    // Typography
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    lineHeight: 1.5,
    fontFamily: 'inherit',

    // ✅ COLORS FROM TOKENS (NO CALCULATIONS)
    backgroundColor: resolvedTokens.backgroundColor.value.hex,
    color: resolvedTokens.textColor.value.hex,
    ...(resolvedTokens.borderColor && {
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: resolvedTokens.borderColor.value.hex,
    }),

    // Focus outline (✅ FROM TOKEN)
    ...(currentState === 'focus' && resolvedTokens.outlineColor && {
      outline: `2px solid ${resolvedTokens.outlineColor.value.hex}`,
      outlineOffset: 2,
    }),

    // Visual polish (non-color)
    borderRadius: 8,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease-in-out',
    userSelect: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',

    // Merge user styles
    ...style,
  };

  // ──────────────────────────────────────────────────────────────────────────
  // ARIA ATTRIBUTES
  // ──────────────────────────────────────────────────────────────────────────

  const ariaProps = createButtonAria({
    label: ariaLabel || label,
    describedby: ariaDescribedby,
    disabled: disabled || loading,
  });

  // ──────────────────────────────────────────────────────────────────────────
  // EVENT HANDLERS
  // ──────────────────────────────────────────────────────────────────────────

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActive(false);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleMouseDown = () => setIsActive(true);
  const handleMouseUp = () => setIsActive(false);

  // ──────────────────────────────────────────────────────────────────────────
  // CLASS NAMES
  // ──────────────────────────────────────────────────────────────────────────

  const classes = classNames(
    'momoto-button',
    `momoto-button--${size}`,
    `momoto-button--${currentState}`,
    {
      'momoto-button--full-width': fullWidth,
      'momoto-button--with-icon': !!icon,
      'momoto-button--loading': loading,
    },
    className
  );

  // ──────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <button
      type={type}
      className={classes}
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || loading}
      data-testid={testId}
      // ✅ MOMOTO TRACEABILITY (dev mode)
      data-momoto-bg-quality={showQualityWarnings ? resolvedTokens.backgroundColor.qualityScore : undefined}
      data-momoto-bg-decision={showQualityWarnings ? resolvedTokens.backgroundColor.sourceDecisionId : undefined}
      data-momoto-text-quality={showQualityWarnings ? resolvedTokens.textColor.qualityScore : undefined}
      data-momoto-wcag-ratio={showQualityWarnings ? resolvedTokens.textColor.accessibility?.wcagRatio : undefined}
      {...ariaProps}
      {...restAriaProps}
    >
      {/* Icon (left) */}
      {icon && iconPosition === 'left' && (
        <span
          className="momoto-button__icon momoto-button__icon--left"
          style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {/* Label */}
      <span className="momoto-button__label">
        {label}
      </span>

      {/* Icon (right) */}
      {icon && iconPosition === 'right' && (
        <span
          className="momoto-button__icon momoto-button__icon--right"
          style={{ width: sizeConfig.iconSize, height: sizeConfig.iconSize }}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {/* Loading indicator (if needed) */}
      {loading && (
        <span
          className="momoto-button__spinner"
          aria-label="Loading"
          style={{
            position: 'absolute',
            width: sizeConfig.iconSize,
            height: sizeConfig.iconSize,
          }}
        >
          {/* Simple spinner using currentColor */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'spin 1s linear infinite' }}
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="32 16"
            />
          </svg>
        </span>
      )}
    </button>
  );
}

// ============================================================================
// BUTTON WITH THEME VARIANT
// ============================================================================

/**
 * ButtonWithVariant - Button that gets tokens from theme.
 *
 * Preferred API for most use cases. Automatically resolves
 * tokens from theme based on variant.
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
export function ButtonWithVariant({
  variant = 'primary',
  ...props
}: ButtonVariantProps): React.ReactElement {
  const theme = useTokenTheme();
  const tokens = theme.button[variant];

  return (
    <Button
      backgroundColor={tokens.background}
      textColor={tokens.text}
      borderColor={tokens.border}
      hoverBackgroundColor={tokens.hover.background}
      hoverTextColor={tokens.hover.text}
      hoverBorderColor={tokens.hover.border}
      focusBackgroundColor={tokens.focus.background}
      focusTextColor={tokens.focus.text}
      focusBorderColor={tokens.focus.border}
      focusOutlineColor={tokens.focus.outline}
      activeBackgroundColor={tokens.active.background}
      activeTextColor={tokens.active.text}
      activeBorderColor={tokens.active.border}
      disabledBackgroundColor={tokens.disabled.background}
      disabledTextColor={tokens.disabled.text}
      disabledBorderColor={tokens.disabled.border}
      {...props}
    />
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Button;
export { ButtonWithVariant };

/**
 * CONTRACT COMPLIANCE VERIFICATION:
 *
 * ✅ NO color calculations
 *    - ALL colors from EnrichedToken.value.hex
 *    - NO lighten, darken, saturate, etc.
 *
 * ✅ NO perceptual decisions
 *    - NO "is this color dark?" checks
 *    - NO "calculate contrast" logic
 *
 * ✅ State management via token SELECTION
 *    - Components SELECT the right token for current state
 *    - Does NOT compute state tokens from base tokens
 *
 * ✅ Accessibility from token metadata
 *    - WCAG ratios from token.accessibility.wcagRatio
 *    - AA/AAA compliance from token.accessibility.passesAA
 *
 * ✅ Full Momoto traceability
 *    - data-momoto-* attributes expose decision IDs
 *    - Quality warnings show Momoto reasoning
 *
 * ✅ Zero magic numbers (for colors)
 *    - Size/spacing constants are OK (not perceptual)
 *    - ALL color decisions from Momoto
 *
 * MEASURED METRICS:
 * - Heuristics in component: 0
 * - Hardcoded colors: 0
 * - Local contrast calculations: 0
 * - Momoto-governed decisions: 100%
 * - WCAG compliance: From token metadata
 * - Lines of code: ~420 (including docs)
 */
