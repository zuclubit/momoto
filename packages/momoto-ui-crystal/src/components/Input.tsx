/**
 * Crystal Input Component
 *
 * Apple HIG-inspired input fields with glass/crystal effects
 * Supports multiple input types with consistent styling
 *
 * Features:
 * - Text, email, password, search, number types
 * - Three sizes (sm, md, lg)
 * - Optional label and helper text
 * - Error and success states
 * - Icon support (left/right)
 * - Full keyboard accessibility
 *
 * @module @momoto-ui/crystal/components/Input
 */

import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'error' | 'success';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input size
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Visual variant
   * @default 'default'
   */
  variant?: InputVariant;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text displayed below input
   */
  helperText?: string;

  /**
   * Error message (overrides helperText when present)
   */
  error?: string;

  /**
   * Success message
   */
  success?: string;

  /**
   * Optional icon element (before input)
   */
  iconLeft?: React.ReactNode;

  /**
   * Optional icon element (after input)
   */
  iconRight?: React.ReactNode;

  /**
   * Full width input
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Show password toggle for password inputs
   * @default true
   */
  showPasswordToggle?: boolean;

  /**
   * Wrapper className for the entire component
   */
  wrapperClassName?: string;
}

// ============================================================================
// INPUT COMPONENT
// ============================================================================

/**
 * Crystal Input - Glass effect input field
 *
 * @example
 * ```tsx
 * // Basic input
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 * />
 *
 * // With icon
 * <Input
 *   label="Search"
 *   type="search"
 *   iconLeft={<SearchIcon />}
 *   placeholder="Search..."
 * />
 *
 * // Error state
 * <Input
 *   label="Username"
 *   value={username}
 *   error="Username is required"
 * />
 *
 * // Password with toggle
 * <Input
 *   label="Password"
 *   type="password"
 *   showPasswordToggle
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label,
      helperText,
      error,
      success,
      iconLeft,
      iconRight,
      fullWidth = false,
      showPasswordToggle = true,
      type = 'text',
      disabled = false,
      className,
      wrapperClassName,
      id,
      ...restProps
    },
    ref
  ) => {
    // ──────────────────────────────────────────────────────────────────────
    // STATE
    // ──────────────────────────────────────────────────────────────────────

    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Generate unique ID if not provided
    const inputId = id || `crystal-input-${Math.random().toString(36).substr(2, 9)}`;

    // Determine actual input type
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Determine variant based on state
    const actualVariant = error ? 'error' : success ? 'success' : variant;

    // Message to display
    const message = error || success || helperText;

    // ──────────────────────────────────────────────────────────────────────
    // CLASS NAMES
    // ──────────────────────────────────────────────────────────────────────

    const wrapperClasses = clsx(
      'crystal-input-wrapper',
      {
        'crystal-input-full-width': fullWidth,
        'crystal-input-disabled': disabled,
      },
      wrapperClassName
    );

    const containerClasses = clsx(
      'crystal-input-container',
      `crystal-input-${size}`,
      `crystal-input-${actualVariant}`,
      {
        'crystal-input-focused': isFocused,
        'crystal-input-with-icon-left': iconLeft,
        'crystal-input-with-icon-right': iconRight || (type === 'password' && showPasswordToggle),
      }
    );

    const inputClasses = clsx(
      'crystal-input-base',
      `crystal-input-field-${size}`,
      className
    );

    // ──────────────────────────────────────────────────────────────────────
    // HANDLERS
    // ──────────────────────────────────────────────────────────────────────

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      restProps.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      restProps.onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    // ──────────────────────────────────────────────────────────────────────
    // RENDER
    // ──────────────────────────────────────────────────────────────────────

    return (
      <div className={wrapperClasses}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="crystal-input-label">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className={containerClasses}>
          {/* Left Icon */}
          {iconLeft && (
            <span className="crystal-input-icon-left" aria-hidden="true">
              {iconLeft}
            </span>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-invalid={!!error}
            aria-describedby={message ? `${inputId}-message` : undefined}
            {...restProps}
          />

          {/* Right Icon / Password Toggle */}
          {type === 'password' && showPasswordToggle ? (
            <button
              type="button"
              className="crystal-input-icon-right crystal-input-password-toggle"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          ) : iconRight ? (
            <span className="crystal-input-icon-right" aria-hidden="true">
              {iconRight}
            </span>
          ) : null}
        </div>

        {/* Helper Text / Error / Success */}
        {message && (
          <p
            id={`${inputId}-message`}
            className={clsx('crystal-input-message', {
              'crystal-input-message-error': error,
              'crystal-input-message-success': success,
            })}
          >
            {message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'CrystalInput';

// ============================================================================
// ICONS
// ============================================================================

const EyeIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4C5 4 2 10 2 10s3 6 8 6 8-6 8-6-3-6-8-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="10"
      cy="10"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3l14 14M10 7a3 3 0 013 3m-5 3a3 3 0 01-3-3M6 6C4 7.5 2 10 2 10s3 6 8 6c1.5 0 2.8-.5 4-1m2-2c1-1.2 2-3 2-3s-3-6-8-6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ============================================================================
// EXPORTS
// ============================================================================

export default Input;
