import React__default from 'react';
import { Q as PerceptualColor } from '../../UIState-DmEU8dBf.mjs';
import { a as ComponentIntent } from '../../ComponentIntent-DvAiAw-R.mjs';

/**
 * @fileoverview AccessibleButton - Composed Component
 *
 * Componente compuesto que demuestra la arquitectura correcta para
 * botones gobernados por Color Intelligence.
 *
 * Características:
 * 1. Colores derivados automáticamente por estado
 * 2. Contraste accesible garantizado (WCAG AA mínimo)
 * 3. Estados visuales perceptualmente correctos
 * 4. Sin hardcoding de colores
 *
 * @module momoto-ui/components/composed/AccessibleButton
 * @version 1.0.0
 */

/**
 * Variantes de botón disponibles.
 */
type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
/**
 * Tamaños de botón disponibles.
 */
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/**
 * Estado visual del botón.
 */
type ButtonState = 'idle' | 'hover' | 'active' | 'focus' | 'disabled';
/**
 * Props del componente AccessibleButton.
 */
interface AccessibleButtonProps extends Omit<React__default.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
    /** Color base del botón (de Color Intelligence) */
    baseColor: PerceptualColor;
    /** Variante visual */
    variant?: ButtonVariant;
    /** Tamaño del botón */
    size?: ButtonSize;
    /** Intent semántico */
    intent?: ComponentIntent;
    /** Si ocupa todo el ancho */
    fullWidth?: boolean;
    /** Si muestra loading */
    loading?: boolean;
    /** Icono a la izquierda */
    leftIcon?: React__default.ReactNode;
    /** Icono a la derecha */
    rightIcon?: React__default.ReactNode;
    /** Si el icono es solo (sin texto) */
    iconOnly?: boolean;
    /** Override de colores de estado */
    stateColors?: Partial<Record<ButtonState, PerceptualColor>>;
}
/**
 * AccessibleButton - Botón accesible gobernado por Color Intelligence.
 *
 * Este componente es un ejemplo de referencia arquitectónica que demuestra:
 * 1. Cómo recibir colores perceptuales como props
 * 2. Cómo derivar estados visuales automáticamente
 * 3. Cómo garantizar accesibilidad sin hardcoding
 * 4. Cómo manejar variantes e intents semánticos
 *
 * @example
 * ```tsx
 * import { AccessibleButton } from '@zuclubit/momoto-ui/components';
 * import { PerceptualColor } from '@zuclubit/momoto-ui';
 *
 * function ActionButtons() {
 *   const primaryColor = PerceptualColor.fromHex('#3B82F6').value!;
 *   const dangerColor = PerceptualColor.fromHex('#EF4444').value!;
 *
 *   return (
 *     <div>
 *       <AccessibleButton
 *         baseColor={primaryColor}
 *         variant="solid"
 *         size="md"
 *         intent="action"
 *       >
 *         Guardar cambios
 *       </AccessibleButton>
 *
 *       <AccessibleButton
 *         baseColor={dangerColor}
 *         variant="outline"
 *         size="md"
 *         intent="destructive"
 *       >
 *         Eliminar
 *       </AccessibleButton>
 *     </div>
 *   );
 * }
 * ```
 */
declare const AccessibleButton: React__default.ForwardRefExoticComponent<AccessibleButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

export { AccessibleButton, type AccessibleButtonProps, type ButtonSize, type ButtonState, type ButtonVariant };
