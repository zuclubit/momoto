import { R as Result, au as UIRole$1, A as ApcaLevel, av as ComponentIntent$1, S as Severity, C as ComponentVariant, U as UIState } from './UIState-CG23I-mF.mjs';

/**
 * @fileoverview UIRole Value Object
 *
 * Value Object que representa el rol semántico de un color en la UI.
 * Define el PROPÓSITO del color, no su valor específico.
 *
 * Principio fundamental: "El color no tiene significado inherente,
 * su significado viene de su rol en el contexto."
 *
 * @module momoto-ui/domain/ux/value-objects/UIRole
 * @version 1.0.0
 */

/**
 * Roles válidos de UI.
 */
declare const UI_ROLES: readonly ["background", "surface", "surface-elevated", "text-primary", "text-secondary", "text-muted", "text-inverse", "icon", "icon-muted", "accent", "accent-muted", "border", "border-subtle", "divider", "overlay", "shadow", "focus-ring"];
/**
 * Categorías de roles.
 */
type RoleCategory = 'background' | 'text' | 'icon' | 'accent' | 'structural' | 'decorative';
/**
 * Requisitos de accesibilidad por rol.
 */
interface RoleAccessibilityRequirements {
    readonly minApcaLevel: ApcaLevel;
    readonly requiresContrastAgainst: readonly UIRole$1[];
    readonly isDecorative: boolean;
    readonly fontSizeDependent: boolean;
}
declare const ROLE_ACCESSIBILITY: Record<UIRole$1, RoleAccessibilityRequirements>;
/**
 * Relaciones semánticas entre roles.
 * Define qué roles "van juntos" o deben considerarse en conjunto.
 */
interface RoleRelationships {
    readonly pairedWith: readonly UIRole$1[];
    readonly derivableFrom: readonly UIRole$1[];
    readonly overrides: readonly UIRole$1[];
}
/**
 * UIRole - Value Object para roles semánticos de color.
 *
 * El rol define el PROPÓSITO de un color, no su valor.
 * Esto permite que el sistema de tokens genere valores apropiados
 * basándose en el contexto y las políticas de accesibilidad.
 *
 * @example
 * ```typescript
 * const textRole = UIRole.textPrimary();
 * const bgRole = UIRole.background();
 *
 * // Verificar requisitos de accesibilidad
 * console.log(textRole.minApcaLevel); // 'body'
 * console.log(textRole.requiresContrastAgainst); // ['background', 'surface', ...]
 *
 * // Verificar relaciones
 * console.log(textRole.isPairedWith(bgRole)); // true
 *
 * // Categoría
 * console.log(textRole.category); // 'text'
 * ```
 */
declare class UIRole {
    private readonly _value;
    private constructor();
    /**
     * Crea desde un string.
     */
    static from(value: string): Result<UIRole, Error>;
    /**
     * Crea un UIRole sin validación.
     */
    static of(value: UIRole$1): UIRole;
    static background(): UIRole;
    static surface(): UIRole;
    static surfaceElevated(): UIRole;
    static textPrimary(): UIRole;
    static textSecondary(): UIRole;
    static textMuted(): UIRole;
    static textInverse(): UIRole;
    static icon(): UIRole;
    static iconMuted(): UIRole;
    static accent(): UIRole;
    static accentMuted(): UIRole;
    static border(): UIRole;
    static borderSubtle(): UIRole;
    static divider(): UIRole;
    static overlay(): UIRole;
    static shadow(): UIRole;
    static focusRing(): UIRole;
    /**
     * Obtiene todos los roles.
     */
    static all(): readonly UIRole[];
    /**
     * Obtiene roles por categoría.
     */
    static byCategory(category: RoleCategory): readonly UIRole[];
    /**
     * Valor del rol.
     */
    get value(): UIRole$1;
    /**
     * Categoría del rol.
     */
    get category(): RoleCategory;
    /**
     * Requisitos de accesibilidad.
     */
    get accessibilityRequirements(): RoleAccessibilityRequirements;
    /**
     * Nivel APCA mínimo requerido.
     */
    get minApcaLevel(): ApcaLevel;
    /**
     * Roles contra los que debe contrastar.
     */
    get requiresContrastAgainst(): readonly UIRole$1[];
    /**
     * Relaciones con otros roles.
     */
    get relationships(): RoleRelationships;
    /**
     * Roles con los que suele usarse en conjunto.
     */
    get pairedWith(): readonly UIRole$1[];
    /**
     * Roles de los que puede derivarse.
     */
    get derivableFrom(): readonly UIRole$1[];
    /**
     * Es un rol de fondo.
     */
    get isBackground(): boolean;
    /**
     * Es un rol de texto.
     */
    get isText(): boolean;
    /**
     * Es un rol de icono.
     */
    get isIcon(): boolean;
    /**
     * Es un rol de acento.
     */
    get isAccent(): boolean;
    /**
     * Es decorativo (no requiere contraste estricto).
     */
    get isDecorative(): boolean;
    /**
     * Depende del tamaño de fuente para requisitos de contraste.
     */
    get isFontSizeDependent(): boolean;
    /**
     * Verifica si está emparejado con otro rol.
     */
    isPairedWith(other: UIRole): boolean;
    /**
     * Verifica si puede derivarse de otro rol.
     */
    canDeriveFrom(other: UIRole): boolean;
    /**
     * Verifica si debe contrastar con otro rol.
     */
    mustContrastWith(other: UIRole): boolean;
    /**
     * Obtiene el rol "muted" correspondiente.
     */
    toMuted(): UIRole | null;
    /**
     * Obtiene el rol "inverso" (para uso sobre accent).
     */
    toInverse(): UIRole | null;
    equals(other: UIRole): boolean;
    /**
     * Verifica si comparten categoría.
     */
    sameCategory(other: UIRole): boolean;
    toString(): string;
    toJSON(): UIRole$1;
    /**
     * Convierte a nombre de variable CSS.
     */
    toCssVar(): string;
    /**
     * Convierte a nombre de token.
     */
    toTokenName(): string;
}
/**
 * Representa un par de roles foreground/background.
 * Útil para validación de contraste.
 */
declare class RolePair {
    readonly foreground: UIRole;
    readonly background: UIRole;
    constructor(foreground: UIRole, background: UIRole);
    /**
     * Verifica si el par requiere validación de contraste.
     */
    get requiresContrastValidation(): boolean;
    /**
     * Obtiene el nivel APCA mínimo requerido para este par.
     */
    get requiredApcaLevel(): ApcaLevel;
    /**
     * Verifica si es un par válido (roles que van juntos).
     */
    get isValidPair(): boolean;
    equals(other: RolePair): boolean;
    /**
     * Invierte el par (útil para verificación bidireccional).
     */
    invert(): RolePair;
    toString(): string;
}

/**
 * @fileoverview ComponentIntent Value Object
 *
 * Value Object que representa la intención semántica de un componente.
 * Define QUÉ hace el componente, no CÓMO se ve.
 *
 * @module momoto-ui/domain/ux/value-objects/ComponentIntent
 * @version 1.0.0
 */

/**
 * Intenciones válidas de componente.
 */
declare const COMPONENT_INTENTS: readonly ["navigation", "action", "action-destructive", "action-secondary", "status-info", "status-success", "status-warning", "status-error", "data-entry", "data-display", "feedback", "decoration"];
/**
 * Categoría de intención.
 */
type IntentCategory = 'navigation' | 'action' | 'status' | 'data' | 'feedback' | 'decoration';
/**
 * Mapeo de intención a categoría.
 */
declare const INTENT_CATEGORIES: Record<ComponentIntent$1, IntentCategory>;
/**
 * Severidad por intención.
 */
declare const INTENT_SEVERITY: Record<ComponentIntent$1, Severity>;
/**
 * Variantes recomendadas por intención.
 */
declare const INTENT_VARIANTS: Record<ComponentIntent$1, readonly ComponentVariant[]>;
/**
 * Interactividad por intención.
 */
interface IntentInteractivity {
    readonly isInteractive: boolean;
    readonly isFocusable: boolean;
    readonly supportsKeyboard: boolean;
    readonly requiresPointer: boolean;
}
/**
 * ComponentIntent - Value Object para intención de componente.
 *
 * Define el propósito semántico de un componente, lo que permite
 * al sistema de tokens generar estilos apropiados automáticamente.
 *
 * @example
 * ```typescript
 * const actionIntent = ComponentIntent.action();
 * const navIntent = ComponentIntent.navigation();
 *
 * // Obtener metadatos
 * console.log(actionIntent.severity); // 'info'
 * console.log(actionIntent.recommendedVariants); // ['solid', 'outline', 'soft']
 *
 * // Verificar interactividad
 * console.log(actionIntent.isInteractive); // true
 *
 * // Roles asociados
 * console.log(actionIntent.primaryRoles); // ['accent', 'text-inverse', 'border']
 * ```
 */
declare class ComponentIntent {
    private readonly _value;
    private constructor();
    /**
     * Crea desde un string.
     */
    static from(value: string): Result<ComponentIntent, Error>;
    /**
     * Crea sin validación.
     */
    static of(value: ComponentIntent$1): ComponentIntent;
    static navigation(): ComponentIntent;
    static action(): ComponentIntent;
    static actionDestructive(): ComponentIntent;
    static actionSecondary(): ComponentIntent;
    static statusInfo(): ComponentIntent;
    static statusSuccess(): ComponentIntent;
    static statusWarning(): ComponentIntent;
    static statusError(): ComponentIntent;
    static dataEntry(): ComponentIntent;
    static dataDisplay(): ComponentIntent;
    static feedback(): ComponentIntent;
    static decoration(): ComponentIntent;
    /**
     * Obtiene todas las intenciones.
     */
    static all(): readonly ComponentIntent[];
    /**
     * Obtiene intenciones por categoría.
     */
    static byCategory(category: IntentCategory): readonly ComponentIntent[];
    /**
     * Crea intención de status desde severidad.
     */
    static fromSeverity(severity: Severity): ComponentIntent;
    /**
     * Valor de la intención.
     */
    get value(): ComponentIntent$1;
    /**
     * Categoría de la intención.
     */
    get category(): IntentCategory;
    /**
     * Severidad asociada.
     */
    get severity(): Severity;
    /**
     * Variantes recomendadas.
     */
    get recommendedVariants(): readonly ComponentVariant[];
    /**
     * Variante por defecto.
     */
    get defaultVariant(): ComponentVariant;
    /**
     * Roles primarios asociados.
     */
    get primaryRoles(): readonly UIRole$1[];
    /**
     * Estados relevantes.
     */
    get relevantStates(): readonly (typeof UIState.prototype.value)[];
    /**
     * Información de interactividad.
     */
    get interactivity(): IntentInteractivity;
    /**
     * Es una acción.
     */
    get isAction(): boolean;
    /**
     * Es un estado/status.
     */
    get isStatus(): boolean;
    /**
     * Es navegación.
     */
    get isNavigation(): boolean;
    /**
     * Es interactivo.
     */
    get isInteractive(): boolean;
    /**
     * Es focusable.
     */
    get isFocusable(): boolean;
    /**
     * Es destructivo.
     */
    get isDestructive(): boolean;
    /**
     * Requiere confirmación (acciones peligrosas).
     */
    get requiresConfirmation(): boolean;
    /**
     * Soporta estado de carga.
     */
    get supportsLoading(): boolean;
    /**
     * Soporta estado de error.
     */
    get supportsError(): boolean;
    /**
     * Verifica si una variante es válida para esta intención.
     */
    supportsVariant(variant: ComponentVariant): boolean;
    /**
     * Verifica si un estado es relevante para esta intención.
     */
    hasState(state: UIState): boolean;
    /**
     * Obtiene los UIRoles como Value Objects.
     */
    getRoles(): readonly UIRole[];
    /**
     * Obtiene los UIStates como Value Objects.
     */
    getStates(): readonly UIState[];
    equals(other: ComponentIntent): boolean;
    /**
     * Verifica si comparten categoría.
     */
    sameCategory(other: ComponentIntent): boolean;
    /**
     * Verifica si comparten severidad.
     */
    sameSeverity(other: ComponentIntent): boolean;
    toString(): string;
    toJSON(): ComponentIntent$1;
    /**
     * Genera un nombre de clase CSS.
     */
    toCssClass(): string;
}

export { ComponentIntent as C, INTENT_CATEGORIES as I, RolePair as R, UIRole as U, UI_ROLES as a, ROLE_ACCESSIBILITY as b, COMPONENT_INTENTS as c, INTENT_SEVERITY as d, INTENT_VARIANTS as e, type IntentCategory as f, type IntentInteractivity as g };
