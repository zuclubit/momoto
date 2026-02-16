/**
 * Glass Button Component - Advanced Liquid Glass
 *
 * Advanced button using real Liquid Glass materials from Momoto WASM
 * Modern glassmorphism with physical properties and perceptual color science
 *
 * Features:
 * - True multi-layer glass composition (highlight, base, shadow)
 * - WASM-powered perceptual color derivation
 * - Adaptive behavior based on background
 * - Automatic text color recommendation
 * - Dark mode adaptation
 *
 * @module @momoto-ui/crystal/components/ButtonGlass
 */

import React, { useMemo, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { LiquidGlass, GlassVariant, GlassPresets, type ColorOklch } from '../utils/liquid-glass';
import './ButtonGlass.css';

// ============================================================================
// TYPES
// ============================================================================

export type GlassButtonVariant =
  | 'regular'      // Adaptive glass (default)
  | 'clear'        // More transparent
  | 'tinted-blue'  // Blue-tinted glass
  | 'tinted-green' // Green-tinted glass
  | 'tinted-purple'// Purple-tinted glass
  | 'thick'        // Extra thick for modals
  | 'subtle';      // Subtle for overlays

export type GlassButtonSize = 'sm' | 'md' | 'lg';

export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Glass variant determining visual style
   * @default 'regular'
   */
  variant?: GlassButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: GlassButtonSize;

  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Optional icon element (before text)
   */
  icon?: React.ReactNode;

  /**
   * Optional icon element (after text)
   */
  iconRight?: React.ReactNode;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Background color the button will be placed on
   * Used to calculate effective glass color
   * @default '#FFFFFF'
   */
  backgroundColor?: string;

  /**
   * Whether to prefer white text (for dark backgrounds)
   * @default false
   */
  preferWhiteText?: boolean;

  /**
   * Custom glass configuration
   */
  glassConfig?: {
    baseTint?: ColorOklch;
    opacity?: number;
    blurRadius?: number;
  };
}

// ============================================================================
// GLASS BUTTON COMPONENT
// ============================================================================

/**
 * Glass Button - Momoto Liquid Glass Material System
 *
 * @example
 * ```tsx
 * // Regular adaptive glass
 * <GlassButton onClick={handleClick}>
 *   Click Me
 * </GlassButton>
 *
 * // Tinted glass on dark background
 * <GlassButton
 *   variant="tinted-blue"
 *   backgroundColor="#1E1E1E"
 *   preferWhiteText
 * >
 *   Save Changes
 * </GlassButton>
 *
 * // Custom thick glass for modal
 * <GlassButton variant="thick" icon={<Icon />}>
 *   Confirm
 * </GlassButton>
 * ```
 */
export const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      variant = 'regular',
      size = 'md',
      children,
      icon,
      iconRight,
      fullWidth = false,
      loading = false,
      disabled = false,
      backgroundColor = '#FFFFFF',
      preferWhiteText = false,
      glassConfig,
      className,
      style,
      ...restProps
    },
    ref
  ) => {
    // ──────────────────────────────────────────────────────────────────────
    // LIQUID GLASS MATERIAL
    // WASM-powered glass surface with real perceptual calculations
    // ──────────────────────────────────────────────────────────────────────

    const glass = useMemo(() => {
      if (glassConfig) {
        return new LiquidGlass({
          variant: GlassVariant.Regular,
          ...glassConfig,
        });
      }

      // Use preset configurations
      switch (variant) {
        case 'clear':
          return GlassPresets.clear();
        case 'tinted-blue':
          return GlassPresets.tinted(240, 0.95, 0.02);
        case 'tinted-green':
          return GlassPresets.tinted(140, 0.95, 0.02);
        case 'tinted-purple':
          return GlassPresets.tinted(280, 0.95, 0.02);
        case 'thick':
          return GlassPresets.thick();
        case 'subtle':
          return GlassPresets.subtle();
        case 'regular':
        default:
          return GlassPresets.regular();
      }
    }, [variant, glassConfig]);

    // ──────────────────────────────────────────────────────────────────────
    // COLOR CALCULATIONS
    // Calculate effective glass color and text color using WASM
    // ──────────────────────────────────────────────────────────────────────

    const colors = useMemo(() => {
      const effectiveColor = glass.getEffectiveColor(backgroundColor);
      const textColor = glass.recommendTextColor(backgroundColor, preferWhiteText);
      const layers = glass.getLayers(backgroundColor);
      const props = glass.getProperties();

      return {
        effective: effectiveColor,
        text: textColor,
        layers,
        blur: props.blurRadius,
        opacity: props.opacity,
        reflectivity: props.reflectivity,
        specular: props.specularIntensity,
      };
    }, [glass, backgroundColor, preferWhiteText]);

    // ──────────────────────────────────────────────────────────────────────
    // STYLE GENERATION
    // Convert WASM calculations to CSS custom properties
    // ──────────────────────────────────────────────────────────────────────

    const buttonStyle: React.CSSProperties = {
      ...style,
      // Glass surface colors
      '--glass-bg': colors.effective,
      '--glass-text': colors.text,

      // Multi-layer composition
      '--glass-highlight': `oklch(${colors.layers.highlight.l} ${colors.layers.highlight.c} ${colors.layers.highlight.h})`,
      '--glass-base': `oklch(${colors.layers.base.l} ${colors.layers.base.c} ${colors.layers.base.h})`,
      '--glass-shadow': `oklch(${colors.layers.shadow.l} ${colors.layers.shadow.c} ${colors.layers.shadow.h})`,

      // Glass properties
      '--glass-blur': `${colors.blur}px`,
      '--glass-opacity': colors.opacity.toString(),
      '--glass-reflectivity': colors.reflectivity.toString(),
      '--glass-specular': colors.specular.toString(),
    } as React.CSSProperties;

    // ──────────────────────────────────────────────────────────────────────
    // DARK MODE ADAPTATION
    // Automatically adapt glass for dark/light modes
    // ──────────────────────────────────────────────────────────────────────

    useEffect(() => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          glass.adaptForDarkMode();
        } else {
          glass.adaptForLightMode();
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }, [glass]);

    // ──────────────────────────────────────────────────────────────────────
    // RENDER
    // ──────────────────────────────────────────────────────────────────────

    const buttonClasses = clsx(
      'glass-button',
      `glass-button-${size}`,
      {
        'glass-button-full-width': fullWidth,
        'glass-button-loading': loading,
        'glass-button-disabled': disabled,
        'glass-button-with-icon': icon || iconRight,
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        style={buttonStyle}
        {...restProps}
      >
        {/* Multi-layer glass effect */}
        <span className="glass-button-highlight" aria-hidden="true" />
        <span className="glass-button-shadow" aria-hidden="true" />

        {/* Button content */}
        <span className="glass-button-content">
          {loading && (
            <span className="glass-button-spinner" aria-label="Loading">
              <svg viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="60 40"
                />
              </svg>
            </span>
          )}
          {icon && !loading && <span className="glass-button-icon">{icon}</span>}
          <span className="glass-button-text">{children}</span>
          {iconRight && <span className="glass-button-icon-right">{iconRight}</span>}
        </span>
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';
