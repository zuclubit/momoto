import { D as DecisionId, Q as PerceptualColor, ac as UIState, au as UIRole$1, ae as UIState$1, A as AccessibilityMetadata, V as PolicyId, G as GovernanceEvaluation, t as DecisionStatus, e as AuditInfo } from '../UIState-DmEU8dBf.mjs';
export { a as AccessibilityUseCase, b as ApcaLc, c as ApcaLevel, d as AuditId, B as BrandConstructors, f as BrandedRecord, C as ColorHarmony, g as ColorInterpolation, h as ColorSpace, i as ColorTemperature, j as ComponentConfig, k as ComponentId, l as ComponentSize, m as ComponentVariant, n as ConfidenceLevel, o as ContrastDetectionFactors, p as ContrastMode, q as ContrastModeResult, r as ContrastPolarity, s as DecisionSource, u as DecisionType, v as DeepPartial, w as DeepReadonly, E as ExportFormat, H as HctCoordinates, x as HctTone, y as HexColor, z as HslCoordinates, F as HueInterpolation, I as InterpolationOptions, K as KeysOfType, N as NumericRange, O as OklchChroma, J as OklchCoordinates, L as OklchHue, M as OklchLightness, P as PerceptualAnalysis, R as PerceptualColorOptions, S as PerceptualMetadata, T as PolicyCategory, U as PolicyEnforcement, W as PolicyPriority, X as PolicyResult, Y as PolicyVersion, Z as PolicyViolation, _ as Result, $ as RgbCoordinates, a0 as STATE_PRIORITY, a1 as STATE_TRANSITIONS, a2 as Severity, a3 as StateTokenMap, a4 as StateTokens, a5 as TokenCategory, a6 as TokenId, a7 as TokenName, a8 as TokenOrigin, a9 as TokenReference, aa as TokenType, ab as TypeGuards, ad as UIStateMachine, af as UI_STATES, ag as UnwrapBrand, ah as ValidationResult, ai as ViolationAction, aj as ViolationId, ak as Wcag3Tier, al as WcagLevel, am as WcagRatio, an as failure, ao as success, ap as tryBrand, aq as unwrap, ar as unwrapOr, as as validationFailure, at as validationSuccess } from '../UIState-DmEU8dBf.mjs';
import { a as ComponentIntent, U as UIRole } from '../ComponentIntent-DvAiAw-R.mjs';
export { C as COMPONENT_INTENTS, I as INTENT_CATEGORIES, b as INTENT_SEVERITY, c as INTENT_VARIANTS, d as IntentCategory, e as IntentInteractivity, R as ROLE_ACCESSIBILITY, f as RolePair, g as UI_ROLES } from '../ComponentIntent-DvAiAw-R.mjs';
export { C as ColorTokenValue, a as CompositeTokenValue, D as DesignToken, b as DimensionTokenValue, G as GradientTokenValue, S as ShadowTokenValue, T as TokenContext, c as TokenProvenance, d as TokenValue, W as W3CDesignToken } from '../DesignToken-Bln084x4.mjs';
export { E as EnrichedToken, M as MomotoColorDecision, a as MomotoDecisionMetadata } from '../EnrichedToken-Dc3_yv97.mjs';
export { C as CollectionStats, T as TokenCollection, a as TokenFilter, b as TokenHierarchy, V as ValidationError, c as ValidationWarning } from '../TokenCollection-CtE784DZ.mjs';
export { A as AccessibilityPair, D as DEFAULT_DERIVATION_CONFIG, a as DerivationConfig, L as LIGHTNESS_SCALE, S as STATE_DERIVATION_RULES, b as ScaleDerivationRule, c as StateDerivationRule, T as TokenDerivationService } from '../TokenDerivationService-uHyxwXHo.mjs';
import { d as EnterprisePolicyConfig, j as PolicySet } from '../GovernanceEvaluator-YY0VUXSn.mjs';
export { A as AccessibilityCondition, a as AggregatedEvaluationResult, C as ColorCondition, b as CustomCondition, c as CustomEvaluatorFn, E as EnterprisePolicy, G as GovernanceEvaluationInput, e as GovernanceEvaluator, P as PolicyCondition, f as PolicyContext, g as PolicyEvaluationResult, h as PolicyRule, i as PolicyScope, k as PolicySeverity, l as PolicyViolationDetail, T as ThemeCondition, m as TokenCondition, n as governanceEvaluator } from '../GovernanceEvaluator-YY0VUXSn.mjs';

/**
 * @fileoverview AccessibilityService - Domain Service for Contrast Calculations
 *
 * Servicio de dominio puro para cálculos de accesibilidad de color.
 * Implementa WCAG 2.1 y APCA (Accessible Perceptual Contrast Algorithm).
 *
 * Principios:
 * - Sin dependencias externas (pure domain logic)
 * - Inmutable (stateless)
 * - Algoritmos documentados con fuentes
 *
 * @module momoto-ui/domain/perceptual/services/AccessibilityService
 * @version 1.0.0
 */
/**
 * Representación RGB normalizada (0-255).
 */
interface RgbColor {
    readonly r: number;
    readonly g: number;
    readonly b: number;
}
/**
 * Niveles WCAG 2.1 para contraste.
 */
type WcagLevel = 'AAA' | 'AA' | 'AA-large' | 'Fail';
/**
 * Niveles APCA para diferentes usos de texto.
 * Lc = Lightness Contrast
 */
type ApcaLevel = 'Lc75' | 'Lc60' | 'Lc45' | 'Lc30' | 'Lc15' | 'Fail';
/**
 * Resultado de evaluación de contraste.
 */
interface ContrastEvaluation {
    readonly wcagRatio: number;
    readonly wcagLevel: WcagLevel;
    readonly apcaValue: number;
    readonly apcaLevel: ApcaLevel;
    readonly meetsWcagAA: boolean;
    readonly meetsWcagAAA: boolean;
    readonly meetsApcaBody: boolean;
    readonly meetsApcaHeading: boolean;
    readonly meetsApcaUI: boolean;
}
/**
 * Thresholds para WCAG.
 */
declare const WCAG_THRESHOLDS: Readonly<{
    readonly AAA: 7;
    readonly AA: 4.5;
    readonly 'AA-large': 3;
}>;
/**
 * Thresholds para APCA.
 * @see https://www.myndex.com/APCA/
 */
declare const APCA_THRESHOLDS: Readonly<{
    readonly Lc75: 75;
    readonly Lc60: 60;
    readonly Lc45: 45;
    readonly Lc30: 30;
    readonly Lc15: 15;
}>;
/**
 * AccessibilityService - Servicio de dominio para cálculos de accesibilidad.
 *
 * Implementa:
 * - WCAG 2.1 Relative Luminance y Contrast Ratio
 * - APCA (Accessible Perceptual Contrast Algorithm)
 *
 * @example
 * ```typescript
 * const service = new AccessibilityService();
 *
 * const bg = { r: 255, g: 255, b: 255 };
 * const fg = { r: 0, g: 0, b: 0 };
 *
 * const evaluation = service.evaluate(bg, fg);
 * console.log(evaluation.wcagLevel); // 'AAA'
 * console.log(evaluation.apcaLevel); // 'Lc75'
 * ```
 */
declare class AccessibilityService {
    /**
     * Evalúa el contraste entre dos colores.
     * Retorna métricas WCAG y APCA.
     */
    evaluate(background: RgbColor, foreground: RgbColor): ContrastEvaluation;
    /**
     * Calcula ratio de contraste WCAG 2.1.
     * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
     */
    calculateWcagContrast(background: RgbColor, foreground: RgbColor): number;
    /**
     * Calcula valor de contraste APCA.
     *
     * Implementación simplificada del algoritmo APCA.
     * Para producción, considerar usar la librería oficial apca-w3.
     *
     * @see https://github.com/Myndex/SAPC-APCA
     * @see https://www.myndex.com/APCA/
     */
    calculateApcaContrast(background: RgbColor, foreground: RgbColor): number;
    /**
     * Determina nivel WCAG basado en ratio de contraste.
     */
    getWcagLevel(ratio: number): WcagLevel;
    /**
     * Determina nivel APCA basado en valor Lc.
     */
    getApcaLevel(lc: number): ApcaLevel;
    /**
     * Sugiere color de texto óptimo para un fondo dado.
     */
    suggestTextColor(background: RgbColor, preferDark?: boolean): {
        color: RgbColor;
        evaluation: ContrastEvaluation;
    };
    /**
     * Verifica si un par de colores cumple requisitos mínimos.
     */
    meetsMinimumRequirements(background: RgbColor, foreground: RgbColor, options?: {
        wcagLevel?: 'AA' | 'AAA';
        apcaMinimum?: number;
    }): boolean;
    /**
     * Calcula luminancia relativa WCAG.
     * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
     */
    private relativeLuminance;
    /**
     * Calcula luminancia perceptual APCA (Y).
     * Coeficientes específicos de APCA.
     */
    private apcaLuminance;
}
/**
 * Instancia singleton para uso conveniente.
 */
declare const accessibilityService: AccessibilityService;

/**
 * @fileoverview UXDecision Entity
 *
 * Entidad que representa una decisión perceptual gobernada.
 * Es el resultado de Color Intelligence procesando una solicitud
 * de tokens para un componente.
 *
 * UXDecision es el contrato entre el dominio y la aplicación:
 * - Contiene todos los tokens necesarios para un componente
 * - Incluye metadatos de accesibilidad
 * - Registra la procedencia y confianza de cada decisión
 * - Es auditable y trazable
 *
 * @module momoto-ui/domain/ux/entities/UXDecision
 * @version 1.0.0
 */

/**
 * Token individual dentro de una decisión.
 */
interface DecisionToken {
    readonly role: UIRole$1;
    readonly state: UIState$1;
    readonly color: PerceptualColor;
    readonly cssValue: string;
    readonly accessibility: AccessibilityMetadata;
    readonly derivedFrom?: string;
    readonly adjustedBy?: PolicyId;
}
/**
 * Solicitud de decisión de tokens.
 */
interface TokenRequest {
    readonly componentId: string;
    readonly intent: ComponentIntent;
    readonly brandColor: PerceptualColor;
    readonly states: readonly UIState[];
    readonly roles: readonly UIRole[];
    readonly variant?: string;
    readonly context?: Record<string, unknown>;
}
/**
 * Configuración de decisión.
 */
interface DecisionConfig {
    readonly enforcementLevel: 'strict' | 'moderate' | 'lenient';
    readonly accessibilityTarget: 'aa' | 'aaa' | 'apca-gold';
    readonly allowOverrides: boolean;
    readonly auditEnabled: boolean;
}
/**
 * Snapshot de una decisión para auditoría.
 */
interface DecisionSnapshot {
    readonly id: DecisionId;
    readonly timestamp: Date;
    readonly request: TokenRequest;
    readonly tokens: readonly DecisionToken[];
    readonly governance: GovernanceEvaluation;
    readonly config: DecisionConfig;
}
/**
 * UXDecision - Entidad que encapsula una decisión perceptual.
 *
 * Esta es la entidad central del sistema de tokens gobernado.
 * Cuando un componente necesita colores, no los define directamente.
 * En su lugar, solicita una UXDecision que contiene todos los tokens
 * necesarios, validados y gobernados.
 *
 * @example
 * ```typescript
 * // Crear una decisión para un botón
 * const decision = UXDecision.create({
 *   componentId: 'btn-primary',
 *   intent: ComponentIntent.action(),
 *   brandColor: PerceptualColor.fromHex('#0EB58C'),
 *   states: [UIState.idle(), UIState.hover(), UIState.active()],
 *   roles: [UIRole.accent(), UIRole.textInverse(), UIRole.border()],
 * });
 *
 * // Obtener token específico
 * const hoverBg = decision.getToken('accent', 'hover');
 * console.log(hoverBg?.cssValue); // "oklch(72.3% 0.18 164.5)"
 *
 * // Verificar accesibilidad
 * console.log(decision.isFullyAccessible); // true
 *
 * // Exportar como variables CSS
 * const cssVars = decision.toCssVariables();
 * ```
 */
declare class UXDecision {
    private readonly _id;
    private readonly _request;
    private readonly _tokens;
    private readonly _governance;
    private readonly _config;
    private readonly _createdAt;
    private _status;
    private readonly _auditTrail;
    private constructor();
    /**
     * Crea una nueva decisión.
     * Nota: En producción, esto delegaría a Color Intelligence.
     */
    static create(request: TokenRequest, config?: DecisionConfig): UXDecision;
    /**
     * Genera tokens para la solicitud.
     * Esto es una implementación simplificada - en producción usaría Color Intelligence.
     */
    private static generateTokens;
    /**
     * Deriva un color basado en rol, estado e intención.
     */
    private static deriveColor;
    /**
     * Calcula metadatos de accesibilidad para un color.
     */
    private static calculateAccessibility;
    /**
     * Evalúa gobernanza de tokens.
     */
    private static evaluateGovernance;
    /**
     * ID único de la decisión.
     */
    get id(): DecisionId;
    /**
     * Solicitud original.
     */
    get request(): TokenRequest;
    /**
     * Evaluación de gobernanza.
     */
    get governance(): GovernanceEvaluation;
    /**
     * Configuración aplicada.
     */
    get config(): DecisionConfig;
    /**
     * Estado actual de la decisión.
     */
    get status(): DecisionStatus;
    /**
     * Fecha de creación.
     */
    get createdAt(): Date;
    /**
     * Trail de auditoría.
     */
    get auditTrail(): readonly AuditInfo[];
    /**
     * Todos los tokens.
     */
    get tokens(): readonly DecisionToken[];
    /**
     * Número de tokens.
     */
    get tokenCount(): number;
    /**
     * Verifica si la decisión es compliant.
     */
    get isCompliant(): boolean;
    /**
     * Verifica si todos los tokens son accesibles.
     */
    get isFullyAccessible(): boolean;
    /**
     * Verifica si tiene advertencias.
     */
    get hasWarnings(): boolean;
    /**
     * Verifica si fue aplicada.
     */
    get isApplied(): boolean;
    /**
     * Genera la clave para un token.
     */
    private tokenKey;
    /**
     * Obtiene un token específico.
     */
    getToken(role: UIRole$1, state: UIState$1): DecisionToken | undefined;
    /**
     * Obtiene tokens por rol.
     */
    getTokensByRole(role: UIRole$1): DecisionToken[];
    /**
     * Obtiene tokens por estado.
     */
    getTokensByState(state: UIState$1): DecisionToken[];
    /**
     * Obtiene el color CSS para un rol y estado.
     */
    getCssValue(role: UIRole$1, state: UIState$1): string | undefined;
    /**
     * Obtiene todos los tokens para un estado como mapa de roles.
     */
    getStateTokens(state: UIState$1): Map<UIRole$1, string>;
    /**
     * Marca la decisión como aplicada.
     */
    markApplied(): void;
    /**
     * Rechaza la decisión.
     */
    reject(reason: string): void;
    /**
     * Exporta como variables CSS.
     */
    toCssVariables(prefix?: string): Record<string, string>;
    /**
     * Exporta como string CSS.
     */
    toCssString(prefix?: string, selector?: string): string;
    /**
     * Exporta como design tokens (W3C DTCG format).
     */
    toDesignTokens(): Record<string, unknown>;
    /**
     * Crea un snapshot para auditoría.
     */
    toSnapshot(): DecisionSnapshot;
    toJSON(): Record<string, unknown>;
}
declare const DEFAULT_CONFIG: DecisionConfig;

/**
 * @fileoverview Governance Domain Module
 *
 * Enterprise governance domain layer for enforcing design policies
 * across all products and teams.
 *
 * @module momoto-ui/domain/governance
 * @version 1.0.0
 */

/**
 * Pre-built enterprise policy configurations.
 */
declare const ENTERPRISE_POLICIES: Record<string, EnterprisePolicyConfig>;
/**
 * Creates the default enterprise policy set.
 */
declare function createDefaultPolicySet(): PolicySet;
/**
 * Creates a strict enterprise policy set (all required, critical).
 */
declare function createStrictPolicySet(): PolicySet;
/**
 * Creates a lenient enterprise policy set (all optional).
 */
declare function createLenientPolicySet(): PolicySet;

export { APCA_THRESHOLDS, AccessibilityMetadata, AccessibilityService, AuditInfo, ComponentIntent, type ContrastEvaluation, DEFAULT_CONFIG, type DecisionConfig, DecisionId, type DecisionSnapshot, DecisionStatus, type DecisionToken, ENTERPRISE_POLICIES, EnterprisePolicyConfig, GovernanceEvaluation, PerceptualColor, PolicyId, PolicySet, type RgbColor, type TokenRequest, UIRole, UIState, UXDecision, WCAG_THRESHOLDS, accessibilityService, createDefaultPolicySet, createLenientPolicySet, createStrictPolicySet };
