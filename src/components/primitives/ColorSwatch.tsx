/**
 * @fileoverview ColorSwatch - Primitive Component
 *
 * Componente primitivo para mostrar un color del sistema de diseño.
 * Demuestra la integración correcta con Color Intelligence.
 *
 * Principios arquitectónicos:
 * 1. NO hay colores hardcodeados - usa tokens
 * 2. Toda lógica de color está en el dominio
 * 3. El componente solo renderiza, no decide
 * 4. Accesibilidad automática via Color Intelligence
 *
 * @module momoto-ui/components/primitives/ColorSwatch
 * @version 1.0.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import type { PerceptualColor } from '../../domain/perceptual';
import { TextColorDecisionService } from '../../domain/perceptual/services/TextColorDecisionService';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Props del componente ColorSwatch.
 */
export interface ColorSwatchProps {
  /** Color perceptual a mostrar */
  color: PerceptualColor;
  /** Tamaño del swatch */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Si mostrar el valor del color */
  showValue?: boolean;
  /** Si mostrar el nombre/label */
  showLabel?: boolean;
  /** Label personalizado */
  label?: string;
  /** Si es seleccionable */
  selectable?: boolean;
  /** Si está seleccionado */
  selected?: boolean;
  /** Callback al seleccionar */
  onSelect?: (color: PerceptualColor) => void;
  /** Forma del swatch */
  shape?: 'square' | 'rounded' | 'circle';
  /** Si mostrar borde */
  bordered?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

// ============================================================================
// SIZE MAP
// ============================================================================

const SIZE_MAP = {
  sm: { dimension: 32, fontSize: 10 },
  md: { dimension: 48, fontSize: 12 },
  lg: { dimension: 64, fontSize: 14 },
  xl: { dimension: 96, fontSize: 16 },
} as const;

const SHAPE_MAP = {
  square: 0,
  rounded: 8,
  circle: '50%',
} as const;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ColorSwatch - Muestra un color del sistema de diseño.
 *
 * Este componente es un ejemplo de "dumb component" que recibe
 * un PerceptualColor y lo renderiza correctamente, incluyendo
 * el texto accesible calculado por Color Intelligence.
 *
 * @example
 * ```tsx
 * import { ColorSwatch } from '@zuclubit/momoto-ui/components';
 * import { PerceptualColor } from '@zuclubit/momoto-ui';
 *
 * const brandColor = PerceptualColor.fromHex('#3B82F6').value!;
 *
 * function ColorPalette() {
 *   return (
 *     <div className="flex gap-2">
 *       <ColorSwatch
 *         color={brandColor}
 *         size="lg"
 *         showValue
 *         showLabel
 *         label="Brand Primary"
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function ColorSwatch({
  color,
  size = 'md',
  showValue = false,
  showLabel = false,
  label,
  selectable = false,
  selected = false,
  onSelect,
  shape = 'rounded',
  bordered = false,
  className = '',
}: ColorSwatchProps): React.ReactElement {
  // ✅ DECISIÓN DELEGADA A MOMOTO (no hardcoded)
  // Deriva el color de texto óptimo usando TextColorDecisionService
  const [textColor, setTextColor] = useState<string | null>(null); // null until Momoto decides
  const [textColorError, setTextColorError] = useState<Error | null>(null);

  useEffect(() => {
    setTextColorError(null); // Clear previous error
    TextColorDecisionService.getOptimalTextColor(color)
      .then((decision) => {
        setTextColor(decision.color.hex);
        setTextColorError(null);
      })
      .catch((error) => {
        // ❌ NO SILENT FALLBACK
        // Store error and render explicit error indicator
        setTextColorError(error instanceof Error ? error : new Error('Text color decision failed'));
        setTextColor(null);
      });
  }, [color]);

  // Obtiene el valor hex del color
  const backgroundColor = useMemo(() => color.hex, [color]);

  // ⚠️ DISPLAY-ONLY APPROXIMATION - NOT FOR DECISION MAKING
  // This is a simplified preview calculation for informational display purposes only.
  // For actual accessibility decisions, use TextColorDecisionService or AccessibilityService.
  // The text color decision above is correctly delegated to Momoto WASM.
  const contrastInfo = useMemo(() => {
    // Simplified approximation using OKLCH lightness
    // NOTE: These thresholds (0.6, 0.5) are for display preview only
    // Real decisions use TextColorDecisionService which delegates to Momoto WASM
    const l = color.oklch.l;
    const LIGHTNESS_MIDPOINT = 0.6; // Display approximation threshold
    const contrastRatio = l > LIGHTNESS_MIDPOINT
      ? (l + 0.05) / 0.05  // Estimated ratio with black text
      : 1.05 / (l + 0.05); // Estimated ratio with white text

    return {
      wcag: contrastRatio.toFixed(2),
      apca: Math.round(Math.abs(l - 0.5) * 200).toString(), // Display approximation
    };
  }, [color]);

  // Config de tamaño
  const sizeConfig = SIZE_MAP[size];
  const borderRadius = SHAPE_MAP[shape];

  // Estilos base
  const swatchStyle: React.CSSProperties = {
    width: sizeConfig.dimension,
    height: sizeConfig.dimension,
    backgroundColor,
    borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
    border: bordered ? '1px solid currentColor' : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: selectable ? 'pointer' : 'default',
    position: 'relative',
    transition: 'transform 150ms ease, box-shadow 150ms ease',
    boxShadow: selected ? `0 0 0 2px ${backgroundColor}, 0 0 0 4px currentColor` : undefined,
  };

  const handleClick = () => {
    if (selectable && onSelect) {
      onSelect(color);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectable && onSelect && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect(color);
    }
  };

  return (
    <div className={`color-swatch ${className}`}>
      <div
        role={selectable ? 'button' : 'presentation'}
        tabIndex={selectable ? 0 : undefined}
        aria-pressed={selectable ? selected : undefined}
        aria-label={label ?? `Color ${backgroundColor}`}
        style={swatchStyle}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {showValue && size !== 'sm' && (
          <span
            style={{
              // ❌ NO SILENT FALLBACK - If text color decision failed, use error color
              color: textColorError ? '#FF0000' : (textColor || backgroundColor),
              fontSize: sizeConfig.fontSize,
              fontFamily: 'monospace',
              fontWeight: 500,
            }}
            title={textColorError ? `Error: ${textColorError.message}` : undefined}
          >
            {textColorError ? '⚠️' : backgroundColor.toUpperCase()}
          </span>
        )}
      </div>

      {showLabel && label && (
        <div
          style={{
            marginTop: 4,
            fontSize: sizeConfig.fontSize,
            textAlign: 'center',
            maxWidth: sizeConfig.dimension,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      )}

      {showValue && contrastInfo && size !== 'sm' && (
        <div
          style={{
            marginTop: 2,
            fontSize: sizeConfig.fontSize - 2,
            textAlign: 'center',
            opacity: 0.7,
          }}
        >
          WCAG: {contrastInfo.wcag} | APCA: {contrastInfo.apca}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPOUND COMPONENTS
// ============================================================================

/**
 * ColorSwatchGroup - Agrupa swatches de color.
 */
export interface ColorSwatchGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  gap?: number;
  className?: string;
}

export function ColorSwatchGroup({
  children,
  orientation = 'horizontal',
  gap = 8,
  className = '',
}: ColorSwatchGroupProps): React.ReactElement {
  return (
    <div
      className={`color-swatch-group ${className}`}
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap,
        flexWrap: 'wrap',
      }}
    >
      {children}
    </div>
  );
}

/**
 * ColorScale - Muestra una escala completa de colores.
 */
export interface ColorScaleProps {
  colors: Array<{ color: PerceptualColor; label?: string }>;
  size?: ColorSwatchProps['size'];
  showValues?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function ColorScale({
  colors,
  size = 'md',
  showValues = false,
  showLabels = true,
  className = '',
}: ColorScaleProps): React.ReactElement {
  return (
    <ColorSwatchGroup className={className}>
      {colors.map((item, index) => (
        <ColorSwatch
          key={index}
          color={item.color}
          size={size}
          showValue={showValues}
          showLabel={showLabels}
          label={item.label}
        />
      ))}
    </ColorSwatchGroup>
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ColorSwatch;
