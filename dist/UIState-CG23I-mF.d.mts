/**
 * @fileoverview Branded Types para el UI Kit
 *
 * Tipos con "brand" que proporcionan type-safety en tiempo de compilación
 * para prevenir mezcla accidental de valores semánticamente diferentes.
 *
 * @module momoto-ui/domain/types/branded
 * @version 1.0.0
 */
declare const __brand: unique symbol;
type Brand<T, TBrand extends string> = T & {
    [__brand]: TBrand;
};
/**
 * Valor hexadecimal de color con brand protection.
 * Garantiza que solo strings validados como hex colors pueden usarse.
 */
type HexColor = Brand<string, 'HexColor'>;
/**
 * Valor de luminancia OKLCH (0-1).
 * Representa la luminancia perceptual en el espacio OKLCH.
 */
type OklchLightness = Brand<number, 'OklchLightness'>;
/**
 * Valor de chroma OKLCH (0-0.4 típico).
 * Representa la saturación perceptual en el espacio OKLCH.
 */
type OklchChroma = Brand<number, 'OklchChroma'>;
/**
 * Valor de hue OKLCH (0-360).
 * Representa el tono en grados en el espacio OKLCH.
 */
type OklchHue = Brand<number, 'OklchHue'>;
/**
 * Valor de tono HCT (0-100).
 * Escala de luminancia Material Design 3.
 */
type HctTone = Brand<number, 'HctTone'>;
/**
 * Valor de contraste APCA Lc (-108 a +108).
 * Lightness Contrast según WCAG 3.0 Working Draft.
 */
type ApcaLc = Brand<number, 'ApcaLc'>;
/**
 * Ratio de contraste WCAG 2.1 (1-21).
 */
type WcagRatio = Brand<number, 'WcagRatio'>;
/**
 * Identificador único de token.
 */
type TokenId = Brand<string, 'TokenId'>;
/**
 * Nombre de token siguiendo naming convention.
 * Formato: category-role-variant-state
 */
type TokenName = Brand<string, 'TokenName'>;
/**
 * Categoría de token (color, spacing, typography, etc.).
 */
type TokenCategory = Brand<string, 'TokenCategory'>;
/**
 * Referencia a otro token (para aliases).
 */
type TokenReference = Brand<string, 'TokenReference'>;
/**
 * Identificador de componente UI.
 */
type ComponentId = Brand<string, 'ComponentId'>;
/**
 * Identificador de decisión perceptual.
 */
type DecisionId = Brand<string, 'DecisionId'>;
/**
 * Nivel de confianza (0-1).
 */
type ConfidenceLevel = Brand<number, 'ConfidenceLevel'>;
/**
 * Prioridad de política (1-1000).
 */
type PolicyPriority = Brand<number, 'PolicyPriority'>;
/**
 * Identificador de política.
 */
type PolicyId = Brand<string, 'PolicyId'>;
/**
 * Versión de política (semver).
 */
type PolicyVersion = Brand<string, 'PolicyVersion'>;
/**
 * Identificador de violación.
 */
type ViolationId = Brand<string, 'ViolationId'>;
/**
 * Identificador de auditoría.
 */
type AuditId = Brand<string, 'AuditId'>;
/**
 * Funciones para crear branded types con validación.
 * Estas funciones actúan como "smart constructors" que validan
 * los valores antes de aplicar el brand.
 */
declare const BrandConstructors: {
    /**
     * Crea un HexColor validado.
     * @throws {Error} Si el string no es un hex color válido.
     */
    readonly hexColor: (value: string) => HexColor;
    /**
     * Crea un OklchLightness validado.
     * @throws {Error} Si el valor está fuera del rango [0, 1].
     */
    readonly oklchLightness: (value: number) => OklchLightness;
    /**
     * Crea un OklchChroma validado.
     * @throws {Error} Si el valor es negativo.
     */
    readonly oklchChroma: (value: number) => OklchChroma;
    /**
     * Crea un OklchHue validado (normalizado a 0-360).
     */
    readonly oklchHue: (value: number) => OklchHue;
    /**
     * Crea un HctTone validado.
     * @throws {Error} Si el valor está fuera del rango [0, 100].
     */
    readonly hctTone: (value: number) => HctTone;
    /**
     * Crea un ApcaLc validado.
     * @throws {Error} Si el valor está fuera del rango [-108, 108].
     */
    readonly apcaLc: (value: number) => ApcaLc;
    /**
     * Crea un WcagRatio validado.
     * @throws {Error} Si el valor está fuera del rango [1, 21].
     */
    readonly wcagRatio: (value: number) => WcagRatio;
    /**
     * Crea un TokenId validado.
     */
    readonly tokenId: (value: string) => TokenId;
    /**
     * Crea un TokenName siguiendo naming convention.
     * Formato esperado: lowercase con guiones, ej: "color-primary-hover"
     */
    readonly tokenName: (value: string) => TokenName;
    /**
     * Crea un ConfidenceLevel validado.
     * @throws {Error} Si el valor está fuera del rango [0, 1].
     */
    readonly confidenceLevel: (value: number) => ConfidenceLevel;
    /**
     * Crea un PolicyPriority validado.
     * @throws {Error} Si el valor está fuera del rango [1, 1000].
     */
    readonly policyPriority: (value: number) => PolicyPriority;
    /**
     * Crea un PolicyId validado.
     */
    readonly policyId: (value: string) => PolicyId;
    /**
     * Crea un PolicyVersion validado (semver).
     */
    readonly policyVersion: (value: string) => PolicyVersion;
    /**
     * Crea IDs únicos.
     */
    readonly generateId: (prefix: string) => string;
    /**
     * Crea un DecisionId único.
     */
    readonly decisionId: () => DecisionId;
    /**
     * Crea un AuditId único.
     */
    readonly auditId: () => AuditId;
    /**
     * Crea un ViolationId único.
     */
    readonly violationId: () => ViolationId;
    /**
     * Crea un ComponentId único.
     */
    readonly componentId: (name: string) => ComponentId;
};
/**
 * Type guards para verificar branded types en runtime.
 */
declare const TypeGuards: {
    readonly isHexColor: (value: unknown) => value is HexColor;
    readonly isOklchLightness: (value: unknown) => value is OklchLightness;
    readonly isApcaLc: (value: unknown) => value is ApcaLc;
    readonly isConfidenceLevel: (value: unknown) => value is ConfidenceLevel;
    readonly isTokenName: (value: unknown) => value is TokenName;
};
/**
 * Extrae el tipo base de un branded type.
 */
type UnwrapBrand<T> = T extends Brand<infer U, string> ? U : T;
/**
 * Hace que todas las propiedades sean branded.
 */
type BrandedRecord<T, TBrand extends string> = {
    [K in keyof T]: Brand<T[K], TBrand>;
};
/**
 * Resultado de validación.
 */
interface ValidationResult<T> {
    readonly success: boolean;
    readonly value?: T;
    readonly error?: string;
}
/**
 * Crea un ValidationResult exitoso.
 */
declare function validationSuccess<T>(value: T): ValidationResult<T>;
/**
 * Crea un ValidationResult fallido.
 */
declare function validationFailure<T>(error: string): ValidationResult<T>;
/**
 * Intenta crear un branded type, retornando ValidationResult.
 */
declare function tryBrand<T>(constructor: (value: unknown) => T, value: unknown): ValidationResult<T>;

/**
 * @fileoverview Domain Types - Tipos fundamentales del UI Kit
 *
 * Este módulo exporta todos los tipos de dominio usados en el UI Kit.
 * Incluye branded types, enums, interfaces y tipos utilitarios.
 *
 * @module momoto-ui/domain/types
 * @version 1.0.0
 */

/**
 * Estados de interacción de un componente UI.
 * Cada estado puede tener tokens de color diferentes.
 */
type UIState$1 = 'idle' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading' | 'error' | 'success';
/**
 * Roles semánticos de color en la UI.
 * Define el propósito de un color, no su valor.
 */
type UIRole = 'background' | 'surface' | 'surface-elevated' | 'text-primary' | 'text-secondary' | 'text-muted' | 'text-inverse' | 'icon' | 'icon-muted' | 'accent' | 'accent-muted' | 'border' | 'border-subtle' | 'divider' | 'overlay' | 'shadow' | 'focus-ring';
/**
 * Intención de un componente.
 * Define qué tipo de acción o información representa.
 */
type ComponentIntent = 'navigation' | 'action' | 'action-destructive' | 'action-secondary' | 'status-info' | 'status-success' | 'status-warning' | 'status-error' | 'data-entry' | 'data-display' | 'feedback' | 'decoration';
/**
 * Severidad de un componente de estado.
 */
type Severity = 'info' | 'success' | 'warning' | 'error' | 'neutral';
/**
 * Tamaños estándar de componentes.
 */
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/**
 * Variantes de estilo visual.
 */
type ComponentVariant = 'solid' | 'outline' | 'ghost' | 'soft' | 'glass' | 'gradient';
/**
 * Nivel de conformidad WCAG 2.1.
 */
type WcagLevel = 'Fail' | 'A' | 'AA' | 'AAA';
/**
 * Tier de conformidad WCAG 3.0 (Working Draft).
 */
type Wcag3Tier = 'Fail' | 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
/**
 * Nivel de conformidad APCA.
 */
type ApcaLevel = 'fail' | 'minimum' | 'spot' | 'large' | 'body' | 'fluent' | 'excellent';
/**
 * Caso de uso de accesibilidad.
 */
type AccessibilityUseCase = 'body-text' | 'large-text' | 'headline' | 'ui-component' | 'decorative' | 'icon' | 'badge-text' | 'link' | 'placeholder' | 'disabled-text';
/**
 * Modo de contraste detectado.
 */
type ContrastMode = 'light-content' | 'dark-content';
/**
 * Polaridad de contraste APCA.
 */
type ContrastPolarity = 'dark-on-light' | 'light-on-dark';
/**
 * Tipo de token de diseño.
 */
type TokenType = 'color' | 'spacing' | 'typography' | 'shadow' | 'border' | 'radius' | 'opacity' | 'duration' | 'easing' | 'z-index' | 'breakpoint' | 'composite';
/**
 * Origen de un token.
 */
type TokenOrigin = 'brand' | 'derived' | 'computed' | 'governance' | 'override';
/**
 * Formato de exportación de tokens.
 */
type ExportFormat = 'css-variables' | 'scss-variables' | 'less-variables' | 'tailwind' | 'design-tokens' | 'style-dictionary' | 'figma-tokens' | 'json' | 'typescript';
/**
 * Categoría de política perceptual.
 */
type PolicyCategory = 'accessibility' | 'brand-consistency' | 'perceptual-harmony' | 'contrast' | 'color-blindness' | 'motion-sensitivity' | 'custom';
/**
 * Nivel de enforcement de política.
 */
type PolicyEnforcement = 'required' | 'recommended' | 'optional';
/**
 * Resultado de evaluación de política.
 */
type PolicyResult = 'pass' | 'warn' | 'fail';
/**
 * Acción tomada después de violación.
 */
type ViolationAction = 'block' | 'adjust' | 'warn' | 'log';
/**
 * Espacio de color soportado.
 */
type ColorSpace = 'srgb' | 'display-p3' | 'oklch' | 'oklab' | 'hct' | 'cam16';
/**
 * Tipo de interpolación de color.
 */
type ColorInterpolation = 'linear' | 'bezier' | 'catmull-rom' | 'perceptual';
/**
 * Dirección de interpolación de hue.
 */
type HueInterpolation = 'shorter' | 'longer' | 'increasing' | 'decreasing';
/**
 * Armonía de color.
 */
type ColorHarmony = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'split-complementary' | 'monochromatic';
/**
 * Temperatura perceptual de color.
 */
type ColorTemperature = 'cold' | 'cool' | 'neutral' | 'warm' | 'hot';
/**
 * Tipo de decisión perceptual.
 */
type DecisionType = 'contrast-mode' | 'color-adjustment' | 'accessibility-fix' | 'harmony-suggestion' | 'gradient-generation' | 'palette-derivation';
/**
 * Fuente de una decisión.
 */
type DecisionSource = 'color-intelligence' | 'governance-engine' | 'user-override' | 'theme-provider' | 'component-default';
/**
 * Estado de una decisión.
 */
type DecisionStatus = 'pending' | 'applied' | 'rejected' | 'overridden' | 'expired';
/**
 * Rango numérico.
 */
interface NumericRange {
    readonly min: number;
    readonly max: number;
}
/**
 * Coordenadas OKLCH.
 */
interface OklchCoordinates {
    readonly l: number;
    readonly c: number;
    readonly h: number;
    readonly alpha?: number;
}
/**
 * Coordenadas HCT (Material Design 3).
 */
interface HctCoordinates {
    readonly h: number;
    readonly c: number;
    readonly t: number;
    readonly alpha?: number;
}
/**
 * Coordenadas RGB.
 */
interface RgbCoordinates {
    readonly r: number;
    readonly g: number;
    readonly b: number;
    readonly alpha?: number;
}
/**
 * Coordenadas HSL.
 */
interface HslCoordinates {
    readonly h: number;
    readonly s: number;
    readonly l: number;
    readonly alpha?: number;
}
/**
 * Metadatos de accesibilidad.
 */
interface AccessibilityMetadata {
    readonly wcagLevel: WcagLevel;
    readonly wcag3Tier: Wcag3Tier;
    readonly apcaLc: number;
    readonly apcaLevel: ApcaLevel;
    readonly contrastRatio: number;
    readonly meetsRequirement: boolean;
    readonly minimumFontSize?: number;
    readonly recommendedFontWeight?: number;
}
/**
 * Factores de detección de contraste.
 */
interface ContrastDetectionFactors {
    readonly oklchLightness: number;
    readonly hctTone: number;
    readonly apcaPreference: ContrastMode;
    readonly warmthAdjustment: number;
    readonly chromaInfluence: number;
}
/**
 * Resultado de detección de modo de contraste.
 */
interface ContrastModeResult {
    readonly mode: ContrastMode;
    readonly confidence: number;
    readonly factors: ContrastDetectionFactors;
    readonly recommendations: readonly string[];
}
/**
 * Metadata perceptual de un color.
 */
interface PerceptualMetadata {
    readonly warmth: ColorTemperature;
    readonly brightness: 'dark' | 'medium' | 'light';
    readonly saturation: 'desaturated' | 'muted' | 'saturated' | 'vivid';
    readonly dominantWavelength?: number;
    readonly purity: number;
}
/**
 * Definición de estado de componente con tokens.
 */
interface StateTokens {
    readonly background?: string;
    readonly foreground?: string;
    readonly border?: string;
    readonly shadow?: string;
    readonly outline?: string;
}
/**
 * Mapa completo de tokens por estado.
 */
type StateTokenMap = Record<UIState$1, StateTokens>;
/**
 * Configuración de componente.
 */
interface ComponentConfig {
    readonly id: string;
    readonly intent: ComponentIntent;
    readonly variant: ComponentVariant;
    readonly size: ComponentSize;
    readonly states: readonly UIState$1[];
    readonly roles: readonly UIRole[];
}
/**
 * Información de auditoría.
 */
interface AuditInfo {
    readonly id: string;
    readonly timestamp: Date;
    readonly action: string;
    readonly source: DecisionSource;
    readonly details: Record<string, unknown>;
    readonly previousValue?: unknown;
    readonly newValue: unknown;
}
/**
 * Violación de política.
 */
interface PolicyViolation {
    readonly id: string;
    readonly policyId: string;
    readonly policyName: string;
    readonly severity: 'error' | 'warning' | 'info';
    readonly message: string;
    readonly affectedTokens: readonly string[];
    readonly suggestedFix?: string;
}
/**
 * Resultado de evaluación de gobernanza.
 */
interface GovernanceEvaluation {
    readonly isCompliant: boolean;
    readonly score: number;
    readonly violations: readonly PolicyViolation[];
    readonly warnings: readonly PolicyViolation[];
    readonly appliedAdjustments: readonly string[];
    readonly timestamp: Date;
}
/**
 * Hace todas las propiedades readonly de forma profunda.
 */
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
/**
 * Hace todas las propiedades opcionales de forma profunda.
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
/**
 * Extrae las keys de un tipo que son de un tipo específico.
 */
type KeysOfType<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];
/**
 * Resultado de operación que puede fallar.
 */
type Result<T, E = Error> = {
    readonly success: true;
    readonly value: T;
} | {
    readonly success: false;
    readonly error: E;
};
/**
 * Crea un resultado exitoso.
 */
declare function success<T>(value: T): Result<T, never>;
/**
 * Crea un resultado fallido.
 */
declare function failure<E>(error: E): Result<never, E>;
/**
 * Unwrap un Result, lanzando si es error.
 */
declare function unwrap<T, E>(result: Result<T, E>): T;
/**
 * Unwrap un Result con valor por defecto.
 */
declare function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T;

/**
 * @fileoverview PerceptualColor Value Object
 *
 * Value Object inmutable que representa un color en múltiples espacios
 * perceptuales. Es el objeto fundamental del UI Kit, actuando como
 * puente entre Color Intelligence y el sistema de tokens.
 *
 * Principios:
 * - Inmutabilidad total
 * - Conversiones lazy con memoization
 * - No conoce React, DOM ni CSS
 * - Delega cálculos a Color Intelligence
 *
 * @module momoto-ui/domain/perceptual/value-objects/PerceptualColor
 * @version 1.0.0
 */

/**
 * Opciones para crear un PerceptualColor.
 */
interface PerceptualColorOptions {
    readonly alpha?: number;
    readonly gamutMapped?: boolean;
}
/**
 * Resultado de análisis perceptual.
 */
interface PerceptualAnalysis {
    readonly warmth: ColorTemperature;
    readonly brightness: 'dark' | 'medium' | 'light';
    readonly saturation: 'desaturated' | 'muted' | 'saturated' | 'vivid';
    readonly contrastMode: ContrastMode;
    readonly contrastConfidence: ConfidenceLevel;
}
/**
 * Opciones de interpolación.
 */
interface InterpolationOptions {
    readonly steps?: number;
    readonly hueDirection?: 'shorter' | 'longer' | 'increasing' | 'decreasing';
    readonly chromaPreservation?: boolean;
}
/**
 * PerceptualColor - Value Object inmutable para colores perceptuales.
 *
 * Este es el objeto de color fundamental del UI Kit. Almacena el color
 * en formato OKLCH (perceptualmente uniforme) y proporciona conversiones
 * lazy a otros espacios.
 *
 * @example
 * ```typescript
 * // Crear desde hex
 * const color = PerceptualColor.fromHex('#0EB58C');
 *
 * // Operaciones inmutables (retornan nuevos objetos)
 * const lighter = color.lighten(0.1);
 * const moreVivid = color.saturate(0.2);
 *
 * // Acceso a coordenadas
 * console.log(color.oklch.l); // 0.72 (luminancia)
 *
 * // Análisis perceptual
 * const analysis = color.analyze();
 * console.log(analysis.contrastMode); // 'light-content'
 * ```
 */
declare class PerceptualColor {
    private readonly _oklch;
    private readonly _alpha;
    private readonly _gamutMapped;
    private _hexCache?;
    private _rgbCache?;
    private _hslCache?;
    private _hctCache?;
    private _analysisCache?;
    private constructor();
    /**
     * Crea un PerceptualColor desde un valor hexadecimal.
     */
    static fromHex(hex: string): PerceptualColor;
    /**
     * Crea un PerceptualColor desde coordenadas OKLCH.
     */
    static fromOklch(l: number, c: number, h: number, alpha?: number): PerceptualColor;
    /**
     * Crea un PerceptualColor desde coordenadas RGB.
     */
    static fromRgb(r: number, g: number, b: number, alpha?: number): PerceptualColor;
    /**
     * Crea un PerceptualColor desde coordenadas HCT.
     */
    static fromHct(h: number, c: number, t: number): PerceptualColor;
    /**
     * Intenta crear un PerceptualColor, retornando Result.
     */
    static tryFromHex(hex: string): Result<PerceptualColor, Error>;
    /**
     * Coordenadas OKLCH (fuente de verdad).
     */
    get oklch(): Readonly<OklchCoordinates>;
    /**
     * Luminancia OKLCH (0-1).
     */
    get lightness(): OklchLightness;
    /**
     * Chroma OKLCH.
     */
    get chroma(): OklchChroma;
    /**
     * Hue OKLCH (0-360).
     */
    get hue(): OklchHue;
    /**
     * Alpha (transparencia).
     */
    get alpha(): number;
    /**
     * Indica si el color fue mapeado al gamut sRGB.
     */
    get isGamutMapped(): boolean;
    /**
     * Coordenadas RGB (lazy-evaluated).
     */
    get rgb(): Readonly<RgbCoordinates>;
    /**
     * Coordenadas HSL (lazy-evaluated).
     */
    get hsl(): Readonly<HslCoordinates>;
    /**
     * Coordenadas HCT aproximadas (lazy-evaluated).
     */
    get hct(): Readonly<HctCoordinates>;
    /**
     * Valor hexadecimal (lazy-evaluated).
     */
    get hex(): HexColor;
    /**
     * Aclara el color.
     * @param amount - Cantidad (0-1) para aclarar
     */
    lighten(amount: number): PerceptualColor;
    /**
     * Oscurece el color.
     * @param amount - Cantidad (0-1) para oscurecer
     */
    darken(amount: number): PerceptualColor;
    /**
     * Aumenta la saturación.
     * @param amount - Cantidad para aumentar chroma
     */
    saturate(amount: number): PerceptualColor;
    /**
     * Reduce la saturación.
     * @param amount - Cantidad para reducir chroma
     */
    desaturate(amount: number): PerceptualColor;
    /**
     * Rota el hue.
     * @param degrees - Grados para rotar
     */
    rotateHue(degrees: number): PerceptualColor;
    /**
     * Ajusta la transparencia.
     * @param alpha - Nuevo valor alpha (0-1)
     */
    withAlpha(alpha: number): PerceptualColor;
    /**
     * Interpola hacia otro color.
     * @param target - Color destino
     * @param t - Factor de interpolación (0-1)
     * @param options - Opciones de interpolación
     */
    interpolate(target: PerceptualColor, t: number, options?: InterpolationOptions): PerceptualColor;
    /**
     * Genera un gradiente hacia otro color.
     * @param target - Color destino
     * @param steps - Número de pasos (incluye inicio y fin)
     */
    gradient(target: PerceptualColor, steps: number, options?: InterpolationOptions): PerceptualColor[];
    /**
     * Obtiene el color complementario.
     */
    complement(): PerceptualColor;
    /**
     * Obtiene colores análogos.
     * @param angle - Ángulo de separación (default 30°)
     */
    analogous(angle?: number): [PerceptualColor, PerceptualColor];
    /**
     * Obtiene colores triádicos.
     */
    triadic(): [PerceptualColor, PerceptualColor];
    /**
     * Analiza las propiedades perceptuales del color.
     */
    analyze(): PerceptualAnalysis;
    private computeAnalysis;
    private computeWarmth;
    private computeContrastMode;
    /**
     * Convierte a string CSS OKLCH.
     */
    toCssOklch(): string;
    /**
     * Convierte a string CSS RGB.
     */
    toCssRgb(): string;
    /**
     * Convierte a string CSS HSL.
     */
    toCssHsl(): string;
    /**
     * Representación por defecto es hex.
     */
    toString(): string;
    /**
     * Calcula la diferencia perceptual (Delta E OKLCH).
     */
    deltaE(other: PerceptualColor): number;
    /**
     * Verifica si dos colores son perceptualmente similares.
     * @param other - Otro color
     * @param threshold - Umbral de Delta E (default 0.02)
     */
    isSimilarTo(other: PerceptualColor, threshold?: number): boolean;
    /**
     * Verifica igualdad estructural.
     */
    equals(other: PerceptualColor): boolean;
    /**
     * Serializa a objeto JSON.
     */
    toJSON(): {
        oklch: OklchCoordinates;
        hex: string;
        alpha: number;
        gamutMapped: boolean;
    };
    /**
     * Crea desde objeto JSON.
     */
    static fromJSON(json: {
        oklch: OklchCoordinates;
        alpha?: number;
    }): PerceptualColor;
}

/**
 * @fileoverview UIState Value Object
 *
 * Value Object que representa un estado de interacción de componente UI.
 * Define transiciones válidas, metadatos perceptuales y reglas de negocio
 * para estados de interfaz.
 *
 * @module momoto-ui/domain/ux/value-objects/UIState
 * @version 1.0.0
 */

/**
 * Estados válidos de UI.
 */
declare const UI_STATES: readonly ["idle", "hover", "active", "focus", "disabled", "loading", "error", "success"];
/**
 * Matriz de transiciones válidas entre estados.
 * Define qué transiciones son permitidas desde cada estado.
 */
declare const STATE_TRANSITIONS: Record<UIState$1, readonly UIState$1[]>;
/**
 * Prioridad de estados para resolución de conflictos.
 * Mayor número = mayor prioridad.
 */
declare const STATE_PRIORITY: Record<UIState$1, number>;
/**
 * Metadatos perceptuales por estado.
 */
interface StatePerceptualMetadata {
    readonly requiresContrast: boolean;
    readonly suggestedLightnessShift: number;
    readonly suggestedChromaShift: number;
    readonly suggestedOpacity: number;
    readonly animation: 'none' | 'subtle' | 'medium' | 'prominent';
    readonly focusIndicator: boolean;
}
/**
 * UIState - Value Object para estados de interacción.
 *
 * Encapsula un estado de UI con toda su lógica de dominio:
 * - Transiciones válidas
 * - Metadatos perceptuales
 * - Priorización
 * - Combinación de estados
 *
 * @example
 * ```typescript
 * const idle = UIState.idle();
 * const hover = UIState.hover();
 *
 * // Verificar transición válida
 * if (idle.canTransitionTo(hover)) {
 *   const newState = idle.transitionTo(hover);
 * }
 *
 * // Combinar estados (focus + hover)
 * const combined = UIState.combine([hover, UIState.focus()]);
 * console.log(combined.value); // 'focus' (mayor prioridad)
 *
 * // Obtener metadatos perceptuales
 * console.log(hover.metadata.suggestedLightnessShift); // 0.05
 * ```
 */
declare class UIState {
    private readonly _value;
    private constructor();
    /**
     * Crea desde un string.
     */
    static from(value: string): Result<UIState, Error>;
    /**
     * Crea un UIState sin validación (usar solo con valores conocidos).
     */
    static of(value: UIState$1): UIState;
    static idle(): UIState;
    static hover(): UIState;
    static active(): UIState;
    static focus(): UIState;
    static disabled(): UIState;
    static loading(): UIState;
    static error(): UIState;
    static success(): UIState;
    /**
     * Obtiene todos los estados posibles.
     */
    static all(): readonly UIState[];
    /**
     * Combina múltiples estados, retornando el de mayor prioridad.
     */
    static combine(states: readonly UIState[]): UIState;
    /**
     * Valor del estado.
     */
    get value(): UIState$1;
    /**
     * Prioridad del estado.
     */
    get priority(): number;
    /**
     * Metadatos perceptuales del estado.
     */
    get metadata(): StatePerceptualMetadata;
    /**
     * Estados a los que se puede transicionar.
     */
    get validTransitions(): readonly UIState$1[];
    /**
     * Verifica si es el estado idle.
     */
    get isIdle(): boolean;
    /**
     * Verifica si es un estado interactivo (hover, active, focus).
     */
    get isInteractive(): boolean;
    /**
     * Verifica si es un estado de feedback (error, success, loading).
     */
    get isFeedback(): boolean;
    /**
     * Verifica si el estado requiere alto contraste.
     */
    get requiresHighContrast(): boolean;
    /**
     * Verifica si el estado necesita indicador de focus.
     */
    get needsFocusIndicator(): boolean;
    /**
     * Verifica si el estado tiene animación.
     */
    get hasAnimation(): boolean;
    /**
     * Verifica si puede transicionar a otro estado.
     */
    canTransitionTo(target: UIState): boolean;
    /**
     * Transiciona a otro estado si es válido.
     */
    transitionTo(target: UIState): Result<UIState, Error>;
    /**
     * Fuerza transición (sin validación).
     * Usar solo cuando se sabe que es correcto.
     */
    forceTransitionTo(target: UIState): UIState;
    /**
     * Verifica igualdad.
     */
    equals(other: UIState): boolean;
    /**
     * Compara por prioridad.
     * Retorna positivo si this tiene mayor prioridad.
     */
    comparePriority(other: UIState): number;
    toString(): string;
    toJSON(): UIState$1;
}
/**
 * Máquina de estados simple para gestionar transiciones.
 */
declare class UIStateMachine {
    private _current;
    private readonly _history;
    private readonly _maxHistory;
    constructor(initial?: UIState, maxHistory?: number);
    /**
     * Estado actual.
     */
    get current(): UIState;
    /**
     * Historial de estados.
     */
    get history(): readonly UIState[];
    /**
     * Intenta transicionar a un nuevo estado.
     */
    transition(target: UIState): Result<UIState, Error>;
    /**
     * Fuerza transición (sin validación).
     */
    forceTransition(target: UIState): void;
    /**
     * Retrocede al estado anterior.
     */
    back(): Result<UIState, Error>;
    /**
     * Resetea al estado inicial.
     */
    reset(): void;
}

export { type OklchChroma as $, type ApcaLevel as A, type StateTokens as B, type ComponentVariant as C, type DecisionType as D, type ExportFormat as E, type StateTokenMap as F, type ComponentConfig as G, type HueInterpolation as H, type AuditInfo as I, type PolicyViolation as J, type GovernanceEvaluation as K, type DeepReadonly as L, type DeepPartial as M, type NumericRange as N, type OklchCoordinates as O, PerceptualColor as P, type KeysOfType as Q, type Result as R, type Severity as S, type TokenType as T, UIState as U, type ViolationAction as V, type WcagLevel as W, unwrap as X, unwrapOr as Y, type HexColor as Z, type OklchLightness as _, UIStateMachine as a, type OklchHue as a0, type HctTone as a1, type ApcaLc as a2, type WcagRatio as a3, type TokenId as a4, type TokenName as a5, type TokenCategory as a6, type TokenReference as a7, type ComponentId as a8, type DecisionId as a9, type ConfidenceLevel as aa, type PolicyPriority as ab, type PolicyId as ac, type PolicyVersion as ad, type ViolationId as ae, type AuditId as af, BrandConstructors as ag, TypeGuards as ah, type UnwrapBrand as ai, type BrandedRecord as aj, type ValidationResult as ak, validationSuccess as al, validationFailure as am, tryBrand as an, type PerceptualColorOptions as ao, type PerceptualAnalysis as ap, type InterpolationOptions as aq, UI_STATES as ar, STATE_PRIORITY as as, STATE_TRANSITIONS as at, type UIRole as au, type ComponentIntent as av, type UIState$1 as b, type ComponentSize as c, type Wcag3Tier as d, type AccessibilityUseCase as e, failure as f, type ContrastMode as g, type ContrastPolarity as h, type TokenOrigin as i, type PolicyCategory as j, type PolicyEnforcement as k, type PolicyResult as l, type ColorSpace as m, type ColorInterpolation as n, type ColorHarmony as o, type ColorTemperature as p, type DecisionSource as q, type DecisionStatus as r, success as s, type HctCoordinates as t, type RgbCoordinates as u, type HslCoordinates as v, type AccessibilityMetadata as w, type ContrastDetectionFactors as x, type ContrastModeResult as y, type PerceptualMetadata as z };
