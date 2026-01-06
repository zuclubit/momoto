import { b as UIState, au as UIRole, C as ComponentVariant, P as PerceptualColor } from './UIState-CG23I-mF.mjs';
import { C as ComponentIntent } from './ComponentIntent-DNvvUhxK.mjs';
import { a as TokenContext, D as DesignToken } from './DesignToken-CKW5vfOU.mjs';
import { T as TokenCollection } from './TokenCollection-BHaIwQnZ.mjs';

/**
 * @fileoverview Token Derivation Service
 *
 * Servicio de dominio para derivar tokens automáticamente basándose
 * en reglas perceptuales y semánticas.
 *
 * @module momoto-ui/domain/tokens/services/TokenDerivationService
 * @version 1.0.0
 */

/**
 * Configuración de derivación.
 */
interface DerivationConfig {
    readonly states: readonly UIState[];
    readonly roles: readonly UIRole[];
    readonly variants: readonly ComponentVariant[];
    readonly generateAccessibilityPairs: boolean;
    readonly generateScaleSteps: boolean;
    readonly scaleSteps: number;
}
/**
 * Regla de derivación de estado.
 */
interface StateDerivationRule {
    readonly state: UIState;
    readonly lightnessAdjust: number;
    readonly chromaAdjust: number;
    readonly opacityMultiplier: number;
}
/**
 * Regla de derivación de escala.
 */
interface ScaleDerivationRule {
    readonly step: number;
    readonly lightnessTarget: number;
    readonly chromaMultiplier: number;
}
/**
 * Par de accesibilidad generado.
 */
interface AccessibilityPair {
    readonly background: DesignToken;
    readonly foreground: DesignToken;
    readonly apcaContrast: number;
    readonly wcagRatio: number;
    readonly passes: {
        readonly apcaBody: boolean;
        readonly apcaHeading: boolean;
        readonly wcagAA: boolean;
        readonly wcagAAA: boolean;
    };
}
/**
 * Configuración por defecto de derivación.
 */
declare const DEFAULT_DERIVATION_CONFIG: DerivationConfig;
/**
 * Reglas de derivación por estado.
 */
declare const STATE_DERIVATION_RULES: Record<UIState, StateDerivationRule>;
/**
 * Pasos de escala de luminosidad (similar a Tailwind 50-950).
 */
declare const LIGHTNESS_SCALE: Record<number, number>;
/**
 * TokenDerivationService - Servicio para derivación automática de tokens.
 *
 * Genera tokens derivados basándose en:
 * - Estados de interacción (hover, active, etc.)
 * - Escalas de luminosidad (50-950)
 * - Pares de accesibilidad (foreground/background)
 * - Variantes de componente (solid, soft, outline, ghost)
 *
 * @example
 * ```typescript
 * const service = new TokenDerivationService();
 *
 * // Derivar estados para un color base
 * const baseColor = PerceptualColor.fromHex('#3B82F6').value!;
 * const stateTokens = service.deriveStates('button.primary', baseColor);
 *
 * // Generar escala completa
 * const scale = service.deriveScale('blue', baseColor);
 *
 * // Generar colección completa para componente
 * const collection = service.deriveComponentTokens('button', baseColor, 'action');
 * ```
 */
declare class TokenDerivationService {
    private readonly _config;
    private readonly _stateRules;
    constructor(config?: Partial<DerivationConfig>);
    /**
     * Deriva tokens de estado desde un color base.
     */
    deriveStates(baseName: string, baseColor: PerceptualColor, context?: Partial<TokenContext>): DesignToken[];
    /**
     * Aplica regla de estado a un color.
     */
    private applyStateRule;
    /**
     * Deriva una escala completa de luminosidad (50-950).
     */
    deriveScale(baseName: string, baseColor: PerceptualColor, context?: Partial<TokenContext>): DesignToken[];
    /**
     * Calcula multiplicador de croma para preservar percepción.
     */
    private calculateChromaMultiplier;
    /**
     * Genera pares de colores con contraste garantizado.
     */
    deriveAccessibilityPairs(baseName: string, baseColor: PerceptualColor, context?: Partial<TokenContext>): AccessibilityPair[];
    /**
     * Crea un par de accesibilidad con métricas.
     */
    private createAccessibilityPair;
    /**
     * Deriva una colección completa de tokens para un componente.
     */
    deriveComponentTokens(componentName: string, brandColor: PerceptualColor, intent: ComponentIntent): TokenCollection;
    /**
     * Deriva tokens para una variante específica.
     */
    private deriveVariantTokens;
    /**
     * Deriva color de texto con contraste adecuado.
     */
    private deriveContrastText;
    /**
     * Deriva color para un rol específico.
     */
    private deriveRoleColor;
    /**
     * Deriva un tema completo desde un color de marca.
     */
    deriveTheme(themeName: string, brandColor: PerceptualColor, options?: {
        includeSemanticColors?: boolean;
        includeShadows?: boolean;
        includeSpacing?: boolean;
    }): TokenCollection;
    /**
     * Deriva colores semánticos (success, warning, error, info).
     */
    private deriveSemanticColors;
    /**
     * Deriva grises con tinte del brand.
     */
    private deriveNeutrals;
    /**
     * Deriva sombras coherentes con el tema.
     */
    private deriveShadows;
}

export { type AccessibilityPair as A, DEFAULT_DERIVATION_CONFIG as D, LIGHTNESS_SCALE as L, STATE_DERIVATION_RULES as S, TokenDerivationService as T, type DerivationConfig as a, type StateDerivationRule as b, type ScaleDerivationRule as c };
