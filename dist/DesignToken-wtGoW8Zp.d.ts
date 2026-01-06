import { P as PerceptualColor, au as UIRole, b as UIState, av as ComponentIntent, R as Result, U as UIState$1 } from './UIState-CG23I-mF.js';

/**
 * @fileoverview DesignToken Value Object
 *
 * Value Object inmutable que representa un token de diseño individual.
 * Sigue el estándar W3C Design Tokens Community Group (DTCG).
 *
 * @module momoto-ui/domain/tokens/value-objects/DesignToken
 * @version 1.0.0
 */

/**
 * Tipo de token según DTCG.
 */
type TokenType = 'color' | 'dimension' | 'fontFamily' | 'fontWeight' | 'duration' | 'cubicBezier' | 'shadow' | 'gradient' | 'typography' | 'border' | 'transition' | 'composite';
/**
 * Categoría semántica del token.
 */
type TokenCategory = 'primitive' | 'semantic' | 'component' | 'state';
/**
 * Metadatos de trazabilidad del token.
 */
interface TokenProvenance {
    readonly derivedFrom?: string;
    readonly transformations: string[];
    readonly createdAt: Date;
    readonly version: string;
    readonly generator: string;
}
/**
 * Contexto de uso del token.
 */
interface TokenContext {
    readonly role?: UIRole;
    readonly state?: UIState;
    readonly intent?: ComponentIntent;
    readonly component?: string;
    readonly variant?: string;
}
/**
 * Valor del token según tipo.
 */
type TokenValue = ColorTokenValue | DimensionTokenValue | ShadowTokenValue | GradientTokenValue | CompositeTokenValue;
interface ColorTokenValue {
    readonly type: 'color';
    readonly value: string;
    readonly perceptual?: {
        readonly oklch: {
            l: number;
            c: number;
            h: number;
        };
        readonly apca?: number;
        readonly wcagRatio?: number;
    };
}
interface DimensionTokenValue {
    readonly type: 'dimension';
    readonly value: number;
    readonly unit: 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh';
}
interface ShadowTokenValue {
    readonly type: 'shadow';
    readonly value: {
        readonly offsetX: number;
        readonly offsetY: number;
        readonly blur: number;
        readonly spread: number;
        readonly color: string;
        readonly inset?: boolean;
    }[];
}
interface GradientTokenValue {
    readonly type: 'gradient';
    readonly value: {
        readonly type: 'linear' | 'radial' | 'conic';
        readonly angle?: number;
        readonly stops: Array<{
            color: string;
            position: number;
        }>;
    };
}
interface CompositeTokenValue {
    readonly type: 'composite';
    readonly value: Record<string, TokenValue>;
}
/**
 * Formato W3C DTCG para exportación.
 */
interface W3CDesignToken {
    readonly $value: unknown;
    readonly $type: string;
    readonly $description?: string;
    readonly $extensions?: Record<string, unknown>;
}
/**
 * DesignToken - Value Object para tokens de diseño.
 *
 * Representa un token de diseño inmutable con toda su metadata,
 * trazabilidad y capacidad de exportación a múltiples formatos.
 *
 * @example
 * ```typescript
 * // Crear token de color
 * const buttonBg = DesignToken.color(
 *   'button.primary.background',
 *   PerceptualColor.fromHex('#3B82F6').value!,
 *   {
 *     role: 'accent',
 *     state: 'idle',
 *     intent: 'action',
 *     component: 'button',
 *     variant: 'primary'
 *   }
 * );
 *
 * // Exportar a CSS
 * console.log(buttonBg.toCssVariable());
 * // --button-primary-background: #3B82F6;
 *
 * // Exportar a W3C format
 * console.log(buttonBg.toW3C());
 * ```
 */
declare class DesignToken {
    private readonly _name;
    private readonly _value;
    private readonly _category;
    private readonly _description;
    private readonly _context;
    private readonly _provenance;
    private readonly _deprecated;
    private readonly _deprecationMessage?;
    private constructor();
    /**
     * Crea un token de color desde PerceptualColor.
     */
    static color(name: string, color: PerceptualColor, context?: TokenContext, description?: string): DesignToken;
    /**
     * Crea un token de color desde hex string.
     */
    static colorFromHex(name: string, hex: string, context?: TokenContext, description?: string): Result<DesignToken, Error>;
    /**
     * Crea un token de dimensión.
     */
    static dimension(name: string, value: number, unit: DimensionTokenValue['unit'], context?: TokenContext, description?: string): DesignToken;
    /**
     * Crea un token de sombra.
     */
    static shadow(name: string, shadows: ShadowTokenValue['value'], context?: TokenContext, description?: string): DesignToken;
    /**
     * Crea un token de gradiente.
     */
    static gradient(name: string, gradientDef: GradientTokenValue['value'], context?: TokenContext, description?: string): DesignToken;
    /**
     * Crea un token compuesto.
     */
    static composite(name: string, values: Record<string, TokenValue>, context?: TokenContext, description?: string): DesignToken;
    /**
     * Infiere categoría desde contexto.
     */
    private static inferCategory;
    /**
     * Crea provenance inicial.
     */
    private static createProvenance;
    get name(): string;
    get value(): TokenValue;
    get type(): TokenType;
    get category(): TokenCategory;
    get description(): string;
    get context(): TokenContext;
    get provenance(): TokenProvenance;
    get deprecated(): boolean;
    get deprecationMessage(): string | undefined;
    /**
     * Nombre como variable CSS.
     */
    get cssVariableName(): string;
    /**
     * Path jerárquico.
     */
    get path(): string[];
    /**
     * Namespace (primer segmento del path).
     */
    get namespace(): string;
    get isColor(): boolean;
    get isDimension(): boolean;
    get isShadow(): boolean;
    get isGradient(): boolean;
    get isComposite(): boolean;
    get isPrimitive(): boolean;
    get isSemantic(): boolean;
    get isComponent(): boolean;
    get isState(): boolean;
    /**
     * Crea copia con nuevo nombre.
     */
    rename(newName: string): DesignToken;
    /**
     * Crea copia con nueva descripción.
     */
    describe(description: string): DesignToken;
    /**
     * Marca como deprecado.
     */
    deprecate(message: string): DesignToken;
    /**
     * Crea copia con contexto adicional.
     */
    withContext(additionalContext: Partial<TokenContext>): DesignToken;
    /**
     * Deriva un token de estado desde este token.
     */
    deriveState(state: UIState$1, color: PerceptualColor): DesignToken;
    /**
     * Agrega transformación al provenance.
     */
    private addTransformation;
    /**
     * Exporta a variable CSS.
     */
    toCssVariable(): string;
    /**
     * Exporta a valor CSS.
     */
    toCssValue(): string;
    /**
     * Exporta a formato W3C DTCG.
     */
    toW3C(): W3CDesignToken;
    /**
     * Obtiene valor en formato W3C.
     */
    private getW3CValue;
    /**
     * Obtiene tipo W3C.
     */
    private getW3CType;
    /**
     * Exporta a formato Tailwind.
     */
    toTailwindConfig(): {
        key: string;
        value: string;
    };
    /**
     * Verifica igualdad estructural.
     */
    equals(other: DesignToken): boolean;
    /**
     * Verifica si es del mismo tipo.
     */
    sameType(other: DesignToken): boolean;
    /**
     * Verifica si comparten namespace.
     */
    sameNamespace(other: DesignToken): boolean;
    toString(): string;
    toJSON(): object;
}

export { type ColorTokenValue as C, DesignToken as D, type GradientTokenValue as G, type ShadowTokenValue as S, type TokenProvenance as T, type W3CDesignToken as W, type TokenContext as a, type TokenValue as b, type DimensionTokenValue as c, type CompositeTokenValue as d, type TokenType as e, type TokenCategory as f };
