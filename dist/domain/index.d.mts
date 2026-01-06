import { P as PerceptualColor, U as UIState, a9 as DecisionId, K as GovernanceEvaluation, r as DecisionStatus, I as AuditInfo, au as UIRole$1, b as UIState$1, w as AccessibilityMetadata, ac as PolicyId } from '../UIState-CG23I-mF.mjs';
export { e as AccessibilityUseCase, a2 as ApcaLc, A as ApcaLevel, af as AuditId, ag as BrandConstructors, aj as BrandedRecord, o as ColorHarmony, n as ColorInterpolation, m as ColorSpace, p as ColorTemperature, G as ComponentConfig, a8 as ComponentId, c as ComponentSize, C as ComponentVariant, aa as ConfidenceLevel, x as ContrastDetectionFactors, g as ContrastMode, y as ContrastModeResult, h as ContrastPolarity, q as DecisionSource, D as DecisionType, M as DeepPartial, L as DeepReadonly, E as ExportFormat, t as HctCoordinates, a1 as HctTone, Z as HexColor, v as HslCoordinates, H as HueInterpolation, aq as InterpolationOptions, Q as KeysOfType, N as NumericRange, $ as OklchChroma, O as OklchCoordinates, a0 as OklchHue, _ as OklchLightness, ap as PerceptualAnalysis, ao as PerceptualColorOptions, z as PerceptualMetadata, j as PolicyCategory, k as PolicyEnforcement, ab as PolicyPriority, l as PolicyResult, ad as PolicyVersion, J as PolicyViolation, R as Result, u as RgbCoordinates, as as STATE_PRIORITY, at as STATE_TRANSITIONS, S as Severity, F as StateTokenMap, B as StateTokens, a6 as TokenCategory, a4 as TokenId, a5 as TokenName, i as TokenOrigin, a7 as TokenReference, T as TokenType, ah as TypeGuards, a as UIStateMachine, ar as UI_STATES, ai as UnwrapBrand, ak as ValidationResult, V as ViolationAction, ae as ViolationId, d as Wcag3Tier, W as WcagLevel, a3 as WcagRatio, f as failure, s as success, an as tryBrand, X as unwrap, Y as unwrapOr, am as validationFailure, al as validationSuccess } from '../UIState-CG23I-mF.mjs';
import { C as ComponentIntent, U as UIRole } from '../ComponentIntent-DNvvUhxK.mjs';
export { c as COMPONENT_INTENTS, I as INTENT_CATEGORIES, d as INTENT_SEVERITY, e as INTENT_VARIANTS, f as IntentCategory, g as IntentInteractivity, b as ROLE_ACCESSIBILITY, R as RolePair, a as UI_ROLES } from '../ComponentIntent-DNvvUhxK.mjs';
export { C as ColorTokenValue, d as CompositeTokenValue, D as DesignToken, c as DimensionTokenValue, G as GradientTokenValue, S as ShadowTokenValue, a as TokenContext, T as TokenProvenance, b as TokenValue, W as W3CDesignToken } from '../DesignToken-CKW5vfOU.mjs';
export { C as CollectionStats, T as TokenCollection, a as TokenFilter, b as TokenHierarchy, V as ValidationError, c as ValidationWarning } from '../TokenCollection-BHaIwQnZ.mjs';
export { A as AccessibilityPair, D as DEFAULT_DERIVATION_CONFIG, a as DerivationConfig, L as LIGHTNESS_SCALE, S as STATE_DERIVATION_RULES, c as ScaleDerivationRule, b as StateDerivationRule, T as TokenDerivationService } from '../TokenDerivationService-BC4m1qgb.mjs';
import { P as PolicySet, a as EnterprisePolicyConfig } from '../GovernanceEvaluator-ComwFm5U.mjs';
export { A as AccessibilityCondition, m as AggregatedEvaluationResult, C as ColorCondition, e as CustomCondition, n as CustomEvaluatorFn, E as EnterprisePolicy, l as GovernanceEvaluationInput, G as GovernanceEvaluator, c as PolicyCondition, f as PolicyContext, k as PolicyEvaluationResult, b as PolicyRule, i as PolicyScope, h as PolicySeverity, j as PolicyViolationDetail, d as ThemeCondition, T as TokenCondition, g as governanceEvaluator } from '../GovernanceEvaluator-ComwFm5U.mjs';

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
