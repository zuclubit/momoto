import React__default from 'react';
import { Q as PerceptualColor } from '../../UIState-DmEU8dBf.js';
import { D as DesignToken } from '../../DesignToken-BFJu4GcO.js';
import { T as TokenCollection } from '../../TokenCollection-tspMCTIo.js';

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

/**
 * Props del componente ColorSwatch.
 */
interface ColorSwatchProps {
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
declare function ColorSwatch({ color, size, showValue, showLabel, label, selectable, selected, onSelect, shape, bordered, className, }: ColorSwatchProps): React__default.ReactElement;
/**
 * ColorSwatchGroup - Agrupa swatches de color.
 */
interface ColorSwatchGroupProps {
    children: React__default.ReactNode;
    orientation?: 'horizontal' | 'vertical';
    gap?: number;
    className?: string;
}
declare function ColorSwatchGroup({ children, orientation, gap, className, }: ColorSwatchGroupProps): React__default.ReactElement;
/**
 * ColorScale - Muestra una escala completa de colores.
 */
interface ColorScaleProps {
    colors: Array<{
        color: PerceptualColor;
        label?: string;
    }>;
    size?: ColorSwatchProps['size'];
    showValues?: boolean;
    showLabels?: boolean;
    className?: string;
}
declare function ColorScale({ colors, size, showValues, showLabels, className, }: ColorScaleProps): React__default.ReactElement;

/**
 * @fileoverview TokenDisplay - Primitive Component
 *
 * Componente primitivo para visualizar design tokens.
 * Útil para documentación y debugging del sistema de diseño.
 *
 * @module momoto-ui/components/primitives/TokenDisplay
 * @version 1.0.0
 */

/**
 * Props del componente TokenDisplay.
 */
interface TokenDisplayProps {
    /** Token individual a mostrar */
    token?: DesignToken;
    /** Colección de tokens a mostrar */
    collection?: TokenCollection;
    /** Filtro por tipo de token */
    filterType?: 'color' | 'dimension' | 'fontFamily' | 'fontWeight' | 'duration' | 'cubicBezier' | 'number' | 'string';
    /** Si mostrar metadatos */
    showMetadata?: boolean;
    /** Si mostrar el path completo */
    showPath?: boolean;
    /** Formato de visualización */
    format?: 'list' | 'grid' | 'table';
    /** Tamaño del texto */
    textSize?: 'sm' | 'md' | 'lg';
    /** Clase CSS adicional */
    className?: string;
}
/**
 * TokenDisplay - Visualiza tokens del sistema de diseño.
 *
 * @example
 * ```tsx
 * import { TokenDisplay } from '@zuclubit/momoto-ui/components';
 *
 * function DesignSystemDocs() {
 *   return (
 *     <div>
 *       <h2>Color Tokens</h2>
 *       <TokenDisplay
 *         collection={colorTokens}
 *         filterType="color"
 *         format="grid"
 *         showMetadata
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
declare function TokenDisplay({ token, collection, filterType, showMetadata, showPath, format, textSize, className, }: TokenDisplayProps): React__default.ReactElement;

export { ColorScale, type ColorScaleProps, ColorSwatch, ColorSwatchGroup, type ColorSwatchGroupProps, type ColorSwatchProps, TokenDisplay, type TokenDisplayProps };
