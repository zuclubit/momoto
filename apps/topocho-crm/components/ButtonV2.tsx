/**
 * @fileoverview Button V2 - State of the Art Implementation
 *
 * FASE 17: Button System Evolution
 *
 * Implements:
 * - Elevation system (FLAT, RAISED, FLOATING)
 * - Multi-layer shadows
 * - Hover transforms (translateY + scale)
 * - Enhanced focus ring (WCAG 2.2 AAA)
 * - Micro-contrasts (inner shadows)
 * - Simplified token API
 *
 * @module apps/topocho-crm/components/ButtonV2
 * @version 2.0.0
 */

import React, { useState, CSSProperties } from 'react';
import type { EnrichedToken } from '../../../domain/tokens/value-objects/EnrichedToken';

// ============================================================================
// TYPES
// ============================================================================

export enum ButtonElevation {
  FLAT = 'flat',
  RAISED = 'raised',
  FLOATING = 'floating',
}

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonV2Props {
  // Content
  label: string;

  // Tokens (simplified API - 80% fewer props)
  surface: EnrichedToken;        // Background color
  onSurface: EnrichedToken;      // Text color

  // Visual
  elevation?: ButtonElevation;
  size?: ButtonSize;
  fullWidth?: boolean;

  // Behavior
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;

  // Style
  className?: string;
  style?: CSSProperties;
}

// ============================================================================
// ELEVATION CONFIGURATIONS
// ============================================================================

interface ShadowLayer {
  blur: number;
  spread: number;
  y: number;
  opacity: number;
}

interface ElevationConfig {
  shadowLayers: ShadowLayer[];
  hoverShadowLayers: ShadowLayer[];
  hoverLift: number;        // translateY in px
  hoverScale: number;
  activePress: number;      // translateY in px (from hover position)
  activeScale: number;
  innerShadow?: {
    y: number;
    blur: number;
    opacity: number;
  };
}

const ELEVATION_CONFIGS: Record<ButtonElevation, ElevationConfig> = {
  [ButtonElevation.FLAT]: {
    shadowLayers: [],
    hoverShadowLayers: [],
    hoverLift: 0,
    hoverScale: 1,
    activePress: 0,
    activeScale: 0.98,
    innerShadow: undefined,
  },
  [ButtonElevation.RAISED]: {
    shadowLayers: [
      { blur: 2, spread: 0, y: 1, opacity: 0.12 },
      { blur: 4, spread: 0, y: 2, opacity: 0.08 },
    ],
    hoverShadowLayers: [
      { blur: 4, spread: -1, y: 2, opacity: 0.16 },
      { blur: 6, spread: 0, y: 3, opacity: 0.12 },
    ],
    hoverLift: -1,
    hoverScale: 1,
    activePress: 0.5,
    activeScale: 0.98,
    innerShadow: {
      y: 1,
      blur: 2,
      opacity: 0.15,
    },
  },
  [ButtonElevation.FLOATING]: {
    shadowLayers: [
      { blur: 4, spread: -1, y: 2, opacity: 0.16 },
      { blur: 8, spread: 0, y: 4, opacity: 0.12 },
      { blur: 12, spread: 2, y: 6, opacity: 0.08 },
    ],
    hoverShadowLayers: [
      { blur: 6, spread: -1, y: 3, opacity: 0.2 },
      { blur: 12, spread: 0, y: 6, opacity: 0.16 },
      { blur: 16, spread: 2, y: 8, opacity: 0.12 },
    ],
    hoverLift: -2,
    hoverScale: 1.01,
    activePress: 1,
    activeScale: 0.99,
    innerShadow: {
      y: 1,
      blur: 3,
      opacity: 0.2,
    },
  },
};

// ============================================================================
// SIZE CONFIGURATIONS (AAA Compliant - 44px minimum)
// ============================================================================

interface SizeConfig {
  height: number;
  paddingX: number;
  paddingY: number;
  fontSize: number;
  borderRadius: number;
}

const SIZE_CONFIGS: Record<ButtonSize, SizeConfig> = {
  sm: {
    height: 44,      // AAA minimum (was 32)
    paddingX: 16,
    paddingY: 10,
    fontSize: 14,
    borderRadius: 8,
  },
  md: {
    height: 48,      // AAA minimum (was 40)
    paddingX: 20,
    paddingY: 12,
    fontSize: 16,
    borderRadius: 10,
  },
  lg: {
    height: 56,      // Enhanced AAA
    paddingX: 24,
    paddingY: 16,
    fontSize: 18,
    borderRadius: 12,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function compileShadow(layers: ShadowLayer[]): string {
  return layers
    .map(layer => `0 ${layer.y}px ${layer.blur}px ${layer.spread}px rgba(0, 0, 0, ${layer.opacity})`)
    .join(', ');
}

function compileInnerShadow(config: { y: number; blur: number; opacity: number }): string {
  return `inset 0 ${config.y}px ${config.blur}px 0 rgba(0, 0, 0, ${config.opacity})`;
}

function darken(hex: string, amount: number): string {
  // Simple darkening: reduce RGB values by percentage
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const factor = 1 - (amount / 100);

  const newR = Math.round(r * factor);
  const newG = Math.round(g * factor);
  const newB = Math.round(b * factor);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ButtonV2(props: ButtonV2Props): React.ReactElement {
  const {
    label,
    surface,
    onSurface,
    elevation = ButtonElevation.RAISED,
    size = 'md',
    fullWidth = false,
    onClick,
    disabled = false,
    loading = false,
    className,
    style: userStyle,
  } = props;

  // State
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Config
  const elevationConfig = ELEVATION_CONFIGS[elevation];
  const sizeConfig = SIZE_CONFIGS[size];

  // Derived colors (automatic token derivation)
  const surfaceHex = surface.value.hex;
  const onSurfaceHex = onSurface.value.hex;

  const hoverSurface = darken(surfaceHex, 8);
  const activeSurface = darken(surfaceHex, 16);
  const disabledSurface = hexToRgba(surfaceHex, 0.5);
  const disabledText = hexToRgba(onSurfaceHex, 0.5);

  // Current colors based on state
  let currentBg = surfaceHex;
  let currentText = onSurfaceHex;

  if (disabled || loading) {
    currentBg = disabledSurface;
    currentText = disabledText;
  } else if (isActive) {
    currentBg = activeSurface;
  } else if (isHovered) {
    currentBg = hoverSurface;
  }

  // Shadow compilation
  let boxShadow = '';

  // Outer shadow
  if (!disabled && !loading) {
    const shadowLayers = (isHovered && !isActive)
      ? elevationConfig.hoverShadowLayers
      : elevationConfig.shadowLayers;

    if (isActive) {
      // Reduced shadow on press
      const pressedLayers = shadowLayers.map(layer => ({
        ...layer,
        opacity: layer.opacity * 0.5,
        y: layer.y * 0.5,
      }));
      boxShadow = compileShadow(pressedLayers);
    } else {
      boxShadow = compileShadow(shadowLayers);
    }
  }

  // Inner shadow (micro-contrast)
  if (elevationConfig.innerShadow && !disabled && !loading) {
    const innerShadow = compileInnerShadow(elevationConfig.innerShadow);
    boxShadow = boxShadow ? `${boxShadow}, ${innerShadow}` : innerShadow;
  }

  // Focus ring (WCAG 2.2 AAA - 3px + glow)
  if (isFocused && !disabled && !loading) {
    const focusRing = `0 0 0 3px ${hexToRgba(surfaceHex, 1)}`;
    const focusGlow = `0 0 0 7px ${hexToRgba(surfaceHex, 0.3)}`;
    boxShadow = boxShadow ? `${boxShadow}, ${focusRing}, ${focusGlow}` : `${focusRing}, ${focusGlow}`;
  }

  // Transform (hover lift + press)
  let transform = 'none';

  if (!disabled && !loading) {
    if (isActive) {
      const liftY = elevationConfig.hoverLift + elevationConfig.activePress;
      transform = `translateY(${liftY}px) scale(${elevationConfig.activeScale})`;
    } else if (isHovered) {
      transform = `translateY(${elevationConfig.hoverLift}px) scale(${elevationConfig.hoverScale})`;
    }
  }

  // Transition
  const transition = 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)';

  // Styles
  const buttonStyle: CSSProperties = {
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

    // Typography
    fontSize: sizeConfig.fontSize,
    fontWeight: 500,
    lineHeight: 1,
    fontFamily: 'inherit',

    // Colors
    backgroundColor: currentBg,
    color: currentText,

    // Visual polish
    borderRadius: sizeConfig.borderRadius,
    border: 'none',
    boxShadow,
    transform,
    transition,

    // Interaction
    cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
    userSelect: 'none',

    // Merge user styles
    ...userStyle,
  };

  // Event handlers
  const handleClick = () => {
    if (disabled || loading) return;
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (disabled || loading) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsActive(false);
  };

  const handleFocus = () => {
    if (disabled || loading) return;
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMouseDown = () => {
    if (disabled || loading) return;
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };

  return (
    <button
      type="button"
      className={className}
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || loading}
      aria-label={label}
      aria-busy={loading}
      aria-disabled={disabled}
    >
      {loading ? 'Loading...' : label}
    </button>
  );
}

export default ButtonV2;
