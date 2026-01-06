import { R as Result, C as ComponentVariant, b as UIState, W as WcagLevel, A as ApcaLevel, P as PerceptualColor } from '../UIState-CG23I-mF.mjs';
import { T as TokenCollection } from '../TokenCollection-BHaIwQnZ.mjs';
import { T as TokenDerivationService } from '../TokenDerivationService-BC4m1qgb.mjs';
import { D as DesignToken } from '../DesignToken-CKW5vfOU.mjs';
import { A as AuditPort, a as AuditSeverity } from '../AuditPort-CLaAxcdD.mjs';
export { d as AccessibilityAudit, b as AuditCategory, c as AuditStats, C as ColorDecisionAudit, T as TokenGenerationAudit } from '../AuditPort-CLaAxcdD.mjs';
import { E as ExporterPort, e as ExportFormat, b as ExportDestination, f as ExportOptions, a as ExportResult } from '../ExporterPort-C2r4KoDT.mjs';
export { B as BaseExportOptions, C as CssExportOptions, c as ExportToDestinationResult, F as FigmaExportOptions, S as ScssExportOptions, T as TailwindExportOptions, d as TypeScriptExportOptions, W as W3cExportOptions } from '../ExporterPort-C2r4KoDT.mjs';
import { U as UIRole, C as ComponentIntent } from '../ComponentIntent-DNvvUhxK.mjs';
export { S as SystemPreferences, T as ThemeAdapterPort, c as ThemeChangeOptions, a as ThemeConfig, d as ThemePreferences, b as ThemeState } from '../ThemeAdapterPort-CuBksSzq.mjs';
export { A as AuditContext, k as AuditEntry, j as AuditFilter, l as AuditReport, i as AutoFixAttempt, C as ConsoleAuditAdapter, E as EnforceEnterpriseGovernance, g as GovernanceAuditPort, G as GovernanceConfig, h as GovernanceDecision, b as GovernanceEnforcementInput, d as GovernanceEnforcementOutput, e as GovernanceSubject, f as GovernanceSummary, N as NoOpAuditAdapter, a as checkAccessibilityGovernance, c as checkColorGovernance, m as consoleAuditAdapter, n as noOpAuditAdapter } from '../EnforceEnterpriseGovernance-DBRGXWx5.mjs';
import { f as PolicyContext, P as PolicySet, i as PolicyScope, E as EnterprisePolicy } from '../GovernanceEvaluator-ComwFm5U.mjs';

/**
 * @fileoverview TokenRepositoryPort - Outbound Port for Token Persistence
 *
 * Puerto de salida que define el contrato para persistir y recuperar
 * tokens de diseño desde diferentes almacenes (archivos, bases de datos, APIs).
 *
 * @module momoto-ui/application/ports/outbound/TokenRepositoryPort
 * @version 1.0.0
 */

/**
 * Criterios de búsqueda para tokens.
 */
interface TokenSearchCriteria {
    /** Nombre o patrón de nombre */
    readonly name?: string | RegExp;
    /** Tipo de token */
    readonly type?: 'color' | 'dimension' | 'shadow' | 'gradient' | 'composite';
    /** Categoría del token */
    readonly category?: 'primitive' | 'semantic' | 'component';
    /** Componente asociado */
    readonly component?: string;
    /** Estado asociado */
    readonly state?: string;
    /** Tags que debe tener */
    readonly tags?: string[];
    /** Rango de fechas de creación */
    readonly createdAfter?: Date;
    readonly createdBefore?: Date;
    /** Límite de resultados */
    readonly limit?: number;
    /** Offset para paginación */
    readonly offset?: number;
}
/**
 * Resultado paginado de búsqueda.
 */
interface PaginatedResult<T> {
    /** Items en esta página */
    readonly items: T[];
    /** Total de items que coinciden */
    readonly total: number;
    /** Página actual (0-indexed) */
    readonly page: number;
    /** Items por página */
    readonly pageSize: number;
    /** Si hay más páginas */
    readonly hasMore: boolean;
}
/**
 * Opciones de guardado.
 */
interface SaveOptions {
    /** Si sobrescribir tokens existentes */
    readonly overwrite?: boolean;
    /** Si crear backup antes de sobrescribir */
    readonly backup?: boolean;
    /** Namespace para los tokens */
    readonly namespace?: string;
    /** Metadata adicional */
    readonly metadata?: Record<string, unknown>;
}
/**
 * Información de versión de tokens.
 */
interface TokenVersion {
    /** ID de la versión */
    readonly id: string;
    /** Timestamp de la versión */
    readonly timestamp: Date;
    /** Autor del cambio */
    readonly author?: string;
    /** Descripción del cambio */
    readonly description?: string;
    /** Hash del contenido */
    readonly contentHash: string;
}
/**
 * Resultado de comparación entre versiones.
 */
interface TokenDiff {
    /** Tokens añadidos */
    readonly added: DesignToken[];
    /** Tokens eliminados */
    readonly removed: DesignToken[];
    /** Tokens modificados */
    readonly modified: Array<{
        readonly name: string;
        readonly before: DesignToken;
        readonly after: DesignToken;
        readonly changes: string[];
    }>;
    /** Resumen de cambios */
    readonly summary: {
        readonly addedCount: number;
        readonly removedCount: number;
        readonly modifiedCount: number;
        readonly unchangedCount: number;
    };
}
/**
 * TokenRepositoryPort - Puerto de salida para persistencia de tokens.
 *
 * Define el contrato para almacenar y recuperar tokens de diseño.
 * Los adaptadores implementan este puerto para diferentes backends:
 * - Sistema de archivos (JSON, YAML)
 * - Base de datos
 * - APIs remotas (Figma, Design System APIs)
 * - Local Storage / IndexedDB
 *
 * @example
 * ```typescript
 * class FileTokenRepository implements TokenRepositoryPort {
 *   async save(collection: TokenCollection, options?: SaveOptions): Promise<Result<void, Error>> {
 *     const json = collection.export({ format: 'w3c' });
 *     await fs.writeFile(this.path, json);
 *     return success(undefined);
 *   }
 * }
 * ```
 */
interface TokenRepositoryPort {
    /**
     * Guarda una colección de tokens.
     *
     * @param collection - Colección a guardar
     * @param options - Opciones de guardado
     */
    save(collection: TokenCollection, options?: SaveOptions): Promise<Result<void, Error>>;
    /**
     * Carga todos los tokens del repositorio.
     *
     * @param namespace - Namespace opcional para filtrar
     */
    load(namespace?: string): Promise<Result<TokenCollection, Error>>;
    /**
     * Busca tokens según criterios.
     *
     * @param criteria - Criterios de búsqueda
     */
    search(criteria: TokenSearchCriteria): Promise<Result<PaginatedResult<DesignToken>, Error>>;
    /**
     * Obtiene un token por nombre.
     *
     * @param name - Nombre del token
     */
    getByName(name: string): Promise<Result<DesignToken | null, Error>>;
    /**
     * Elimina tokens según criterios.
     *
     * @param criteria - Criterios para eliminar
     */
    delete(criteria: TokenSearchCriteria): Promise<Result<number, Error>>;
    /**
     * Actualiza un token existente.
     *
     * @param name - Nombre del token a actualizar
     * @param token - Nuevo valor del token
     */
    update(name: string, token: DesignToken): Promise<Result<void, Error>>;
    /**
     * Lista las versiones disponibles.
     *
     * @param limit - Número máximo de versiones
     */
    listVersions(limit?: number): Promise<Result<TokenVersion[], Error>>;
    /**
     * Carga una versión específica.
     *
     * @param versionId - ID de la versión
     */
    loadVersion(versionId: string): Promise<Result<TokenCollection, Error>>;
    /**
     * Compara dos versiones.
     *
     * @param versionA - Primera versión
     * @param versionB - Segunda versión
     */
    compareVersions(versionA: string, versionB: string): Promise<Result<TokenDiff, Error>>;
    /**
     * Restaura una versión anterior.
     *
     * @param versionId - ID de la versión a restaurar
     */
    restoreVersion(versionId: string): Promise<Result<void, Error>>;
    /**
     * Importa tokens desde un formato externo.
     *
     * @param data - Datos a importar
     * @param format - Formato de los datos
     */
    import(data: string, format: 'w3c' | 'figma' | 'style-dictionary' | 'tailwind'): Promise<Result<TokenCollection, Error>>;
    /**
     * Exporta tokens a un formato específico.
     *
     * @param format - Formato de exportación
     * @param options - Opciones adicionales
     */
    export(format: 'w3c' | 'figma' | 'style-dictionary' | 'tailwind' | 'css' | 'scss', options?: {
        namespace?: string;
        minify?: boolean;
    }): Promise<Result<string, Error>>;
    /**
     * Verifica si el repositorio está disponible.
     */
    isAvailable(): Promise<boolean>;
    /**
     * Obtiene estadísticas del repositorio.
     */
    getStats(): Promise<Result<{
        totalTokens: number;
        byType: Record<string, number>;
        byCategory: Record<string, number>;
        lastModified: Date;
        sizeBytes: number;
    }, Error>>;
    /**
     * Limpia el repositorio.
     *
     * @param keepVersions - Si mantener el historial de versiones
     */
    clear(keepVersions?: boolean): Promise<Result<void, Error>>;
}

/**
 * @fileoverview GenerateComponentTokens Use Case
 *
 * Use case para generar una colección completa de tokens para un componente
 * basándose en un color de marca, intención y configuración de estados.
 *
 * @module momoto-ui/application/use-cases/GenerateComponentTokens
 * @version 1.0.0
 */

/**
 * Input para el use case.
 */
interface GenerateComponentTokensInput {
    /** Nombre del componente */
    readonly componentName: string;
    /** Color de marca en hex */
    readonly brandColorHex: string;
    /** Intención del componente */
    readonly intent: string;
    /** Variantes a generar */
    readonly variants?: ComponentVariant[];
    /** Estados a generar */
    readonly states?: UIState[];
    /** Si se debe generar escala completa */
    readonly generateScale?: boolean;
    /** Namespace para los tokens */
    readonly namespace?: string;
}
/**
 * Output del use case.
 */
interface GenerateComponentTokensOutput {
    /** Colección de tokens generados */
    readonly collection: TokenCollection;
    /** Estadísticas de generación */
    readonly stats: {
        readonly totalTokens: number;
        readonly colorTokens: number;
        readonly stateTokens: number;
        readonly variantTokens: number;
    };
    /** CSS generado */
    readonly css: string;
    /** Tokens W3C */
    readonly w3cTokens: string;
}
/**
 * GenerateComponentTokens - Genera tokens completos para un componente.
 *
 * Este use case orquesta la generación de tokens de diseño para un componente
 * específico, incluyendo todos sus estados, variantes y escalas de color.
 *
 * @example
 * ```typescript
 * const useCase = new GenerateComponentTokens(derivationService, tokenRepo);
 *
 * const result = await useCase.execute({
 *   componentName: 'button',
 *   brandColorHex: '#3B82F6',
 *   intent: 'action',
 *   variants: ['solid', 'outline', 'ghost'],
 *   states: ['idle', 'hover', 'active', 'disabled'],
 * });
 *
 * if (result.success) {
 *   console.log(result.value.css);
 *   console.log(`Generated ${result.value.stats.totalTokens} tokens`);
 * }
 * ```
 */
declare class GenerateComponentTokens {
    private readonly derivationService;
    private readonly tokenRepository?;
    constructor(derivationService?: TokenDerivationService, tokenRepository?: TokenRepositoryPort);
    /**
     * Ejecuta el use case.
     */
    execute(input: GenerateComponentTokensInput): Promise<Result<GenerateComponentTokensOutput, Error>>;
    /**
     * Valida el input del use case.
     */
    private validateInput;
    /**
     * Calcula estadísticas de la colección.
     */
    private calculateStats;
}

/**
 * @fileoverview EvaluateComponentAccessibility Use Case
 *
 * Use case para evaluar la accesibilidad de los colores de un componente
 * según estándares WCAG 2.1 y APCA.
 *
 * @module momoto-ui/application/use-cases/EvaluateComponentAccessibility
 * @version 1.0.0
 */

/**
 * Accessibility violation for audit logging.
 * Defined locally as it's specific to this use case.
 */
interface AccessibilityViolation {
    readonly type: 'contrast' | 'color-blind' | 'motion';
    readonly severity: 'error' | 'warning' | 'info';
    readonly element: string;
    readonly message: string;
    readonly wcagCriteria?: string;
    readonly foreground?: string;
    readonly background?: string;
    readonly actualRatio?: number;
    readonly requiredRatio?: number;
    readonly suggestion?: string;
}
/**
 * Par de colores a evaluar.
 */
interface ColorPair {
    readonly name: string;
    readonly foreground: string;
    readonly background: string;
    readonly role?: string;
    readonly minimumWcagLevel?: WcagLevel;
    readonly minimumApcaLevel?: ApcaLevel;
}
/**
 * Input para el use case.
 */
interface EvaluateAccessibilityInput {
    /** Pares de colores a evaluar */
    readonly colorPairs?: ColorPair[];
    /** Colección de tokens a evaluar */
    readonly tokenCollection?: TokenCollection;
    /** Nivel WCAG requerido */
    readonly requiredWcagLevel: WcagLevel;
    /** Nivel APCA requerido */
    readonly requiredApcaLevel: ApcaLevel;
    /** Si debe fallar en la primera violación */
    readonly failFast?: boolean;
}
/**
 * Resultado de evaluación de un par.
 */
interface PairEvaluationResult {
    readonly pairName: string;
    readonly foreground: string;
    readonly background: string;
    readonly wcag: {
        readonly ratio: number;
        readonly level: WcagLevel;
        readonly passesAA: boolean;
        readonly passesAAA: boolean;
        readonly passesAALarge: boolean;
    };
    readonly apca: {
        readonly contrast: number;
        readonly level: ApcaLevel;
        readonly passesBodyText: boolean;
        readonly passesHeading: boolean;
        readonly passesNonText: boolean;
    };
    readonly passes: boolean;
    readonly violations: string[];
    readonly recommendations: string[];
}
/**
 * Output del use case.
 */
interface EvaluateAccessibilityOutput {
    /** Si pasa todos los criterios */
    readonly passes: boolean;
    /** Número de pares evaluados */
    readonly totalPairs: number;
    /** Número de pares que pasan */
    readonly passingPairs: number;
    /** Número de violaciones */
    readonly violationCount: number;
    /** Resultados por par */
    readonly results: PairEvaluationResult[];
    /** Resumen de violaciones */
    readonly violations: AccessibilityViolation[];
    /** Score general (0-100) */
    readonly score: number;
    /** Recomendaciones generales */
    readonly recommendations: string[];
}
/**
 * EvaluateComponentAccessibility - Evalúa accesibilidad de colores.
 *
 * Evalúa pares de colores foreground/background según:
 * - WCAG 2.1 contrast ratio (AA, AAA)
 * - APCA (Accessible Perceptual Contrast Algorithm)
 *
 * @example
 * ```typescript
 * const useCase = new EvaluateComponentAccessibility();
 *
 * const result = await useCase.execute({
 *   colorPairs: [
 *     { name: 'button', foreground: '#FFFFFF', background: '#3B82F6' },
 *     { name: 'text', foreground: '#1F2937', background: '#FFFFFF' },
 *   ],
 *   requiredWcagLevel: 'AA',
 *   requiredApcaLevel: 'Lc60',
 * });
 *
 * if (result.success && result.value.passes) {
 *   console.log('All pairs pass accessibility requirements');
 * } else {
 *   console.log('Violations:', result.value.violations);
 * }
 * ```
 */
declare class EvaluateComponentAccessibility {
    private readonly auditPort?;
    constructor(auditPort?: AuditPort);
    /**
     * Ejecuta la evaluación de accesibilidad.
     */
    execute(input: EvaluateAccessibilityInput): Promise<Result<EvaluateAccessibilityOutput, Error>>;
    /**
     * Resuelve los pares a evaluar desde input.
     */
    private resolvePairs;
    /**
     * Extrae pares de colores de una colección de tokens.
     */
    private extractPairsFromCollection;
    /**
     * Evalúa un par de colores.
     */
    private evaluatePair;
    /**
     * Crea resultado de error.
     */
    private createErrorResult;
    /**
     * Calcula ratio de contraste WCAG 2.1.
     */
    private calculateWcagRatio;
    /**
     * Calcula contraste APCA.
     */
    private calculateApcaContrast;
    /**
     * Determina nivel WCAG.
     */
    private determineWcagLevel;
    /**
     * Determina nivel APCA.
     */
    private determineApcaLevel;
    /**
     * Crea objetos de violación para audit.
     */
    private createViolations;
    /**
     * Genera sugerencia de corrección.
     */
    private generateFixSuggestion;
    /**
     * Genera recomendaciones generales.
     */
    private generateRecommendations;
}

/**
 * @fileoverview ApplyPerceptualPolicy Use Case
 *
 * Use case para aplicar políticas perceptuales a colecciones de tokens,
 * garantizando consistencia perceptual y accesibilidad.
 *
 * Las políticas perceptuales definen:
 * - Rangos de luminosidad permitidos
 * - Diferencias mínimas de contraste
 * - Armonías de color
 * - Consistencia de saturación
 *
 * @module momoto-ui/application/use-cases/ApplyPerceptualPolicy
 * @version 1.0.0
 */

/**
 * Política de luminosidad.
 */
interface LightnessPolicy {
    /** Luminosidad mínima permitida */
    readonly min: number;
    /** Luminosidad máxima permitida */
    readonly max: number;
    /** Si ajustar automáticamente tokens fuera de rango */
    readonly autoAdjust: boolean;
}
/**
 * Política de saturación.
 */
interface ChromaPolicy {
    /** Saturación mínima permitida */
    readonly min: number;
    /** Saturación máxima permitida */
    readonly max: number;
    /** Tolerancia de variación entre tokens relacionados */
    readonly varianceTolerance: number;
    /** Si ajustar automáticamente */
    readonly autoAdjust: boolean;
}
/**
 * Política de contraste.
 */
interface ContrastPolicy {
    /** Ratio mínimo WCAG */
    readonly minWcagRatio: number;
    /** Nivel mínimo APCA */
    readonly minApcaLevel: number;
    /** Pares que deben cumplir (ej: ['text', 'background']) */
    readonly requiredPairs: Array<[string, string]>;
    /** Acción si falla */
    readonly onFailure: 'warn' | 'error' | 'adjust';
}
/**
 * Política de armonía.
 */
interface HarmonyPolicy {
    /** Tipo de armonía */
    readonly type: 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'tetradic' | 'none';
    /** Tolerancia en grados */
    readonly hueTolerance: number;
    /** Si ajustar automáticamente */
    readonly autoAdjust: boolean;
}
/**
 * Política perceptual completa.
 */
interface PerceptualPolicy {
    /** Nombre de la política */
    readonly name: string;
    /** Descripción */
    readonly description?: string;
    /** Política de luminosidad */
    readonly lightness?: LightnessPolicy;
    /** Política de saturación */
    readonly chroma?: ChromaPolicy;
    /** Política de contraste */
    readonly contrast?: ContrastPolicy;
    /** Política de armonía */
    readonly harmony?: HarmonyPolicy;
    /** Si es política estricta (falla en cualquier violación) */
    readonly strict?: boolean;
}
/**
 * Violación de política detectada.
 */
interface PolicyViolation {
    /** Token que viola */
    readonly token: DesignToken;
    /** Regla violada */
    readonly rule: 'lightness' | 'chroma' | 'contrast' | 'harmony';
    /** Valor actual */
    readonly actualValue: number | string;
    /** Valor esperado */
    readonly expectedValue: string;
    /** Severidad */
    readonly severity: 'warning' | 'error';
    /** Sugerencia de corrección */
    readonly suggestion?: string;
    /** Token corregido si autoAdjust está activo */
    readonly correctedToken?: DesignToken;
}
/**
 * Input para el use case.
 */
interface ApplyPerceptualPolicyInput {
    /** Colección de tokens a evaluar */
    readonly collection: TokenCollection;
    /** Política a aplicar */
    readonly policy: PerceptualPolicy;
    /** Si aplicar correcciones automáticas */
    readonly applyCorrections?: boolean;
    /** Si generar reporte detallado */
    readonly generateReport?: boolean;
}
/**
 * Output del use case.
 */
interface ApplyPerceptualPolicyOutput {
    /** Si la colección cumple la política */
    readonly compliant: boolean;
    /** Violaciones encontradas */
    readonly violations: PolicyViolation[];
    /** Colección corregida (si applyCorrections es true) */
    readonly correctedCollection?: TokenCollection;
    /** Resumen de cumplimiento */
    readonly summary: {
        readonly totalTokens: number;
        readonly compliantTokens: number;
        readonly warningCount: number;
        readonly errorCount: number;
        readonly correctedCount: number;
        readonly complianceRate: number;
    };
    /** Reporte detallado si se solicitó */
    readonly report?: string;
}
/**
 * Políticas perceptuales predefinidas.
 */
declare const PRESET_POLICIES: Record<string, PerceptualPolicy>;
/**
 * ApplyPerceptualPolicy - Aplica políticas perceptuales a tokens.
 *
 * Este use case evalúa una colección de tokens contra una política
 * perceptual, identificando violaciones y opcionalmente corrigiéndolas.
 *
 * @example
 * ```typescript
 * const useCase = new ApplyPerceptualPolicy(auditService);
 *
 * const result = await useCase.execute({
 *   collection: tokenCollection,
 *   policy: PRESET_POLICIES.wcagAA,
 *   applyCorrections: true,
 *   generateReport: true,
 * });
 *
 * if (result.success) {
 *   if (result.value.compliant) {
 *     console.log('All tokens are compliant!');
 *   } else {
 *     console.log(`Found ${result.value.violations.length} violations`);
 *     if (result.value.correctedCollection) {
 *       // Use corrected collection
 *     }
 *   }
 * }
 * ```
 */
declare class ApplyPerceptualPolicy {
    private readonly auditPort?;
    constructor(auditPort?: AuditPort);
    /**
     * Ejecuta el use case.
     */
    execute(input: ApplyPerceptualPolicyInput): Promise<Result<ApplyPerceptualPolicyOutput, Error>>;
    /**
     * Evalúa un token contra la política.
     */
    private evaluateToken;
    /**
     * Evalúa política de luminosidad.
     */
    private evaluateLightness;
    /**
     * Evalúa política de saturación.
     */
    private evaluateChroma;
    /**
     * Ajusta luminosidad de un token.
     */
    private adjustLightness;
    /**
     * Ajusta saturación de un token.
     */
    private adjustChroma;
    /**
     * Crea colección corregida.
     */
    private createCorrectedCollection;
    /**
     * Calcula resumen de cumplimiento.
     */
    private calculateSummary;
    /**
     * Genera reporte de texto.
     */
    private generateReport;
}

/**
 * @fileoverview ExportDesignTokens Use Case
 *
 * Use case para exportar tokens de diseño a múltiples formatos
 * con soporte para transformaciones, validación y destinos múltiples.
 *
 * @module momoto-ui/application/use-cases/ExportDesignTokens
 * @version 1.0.0
 */

/**
 * Transformación a aplicar antes de exportar.
 */
interface TokenTransformation {
    /** Tipo de transformación */
    readonly type: 'prefix' | 'suffix' | 'rename' | 'filter' | 'map' | 'sort' | 'group';
    /** Configuración de la transformación */
    readonly config: Record<string, unknown>;
}
/**
 * Preset de exportación.
 */
interface ExportPreset {
    /** Nombre del preset */
    readonly name: string;
    /** Formatos a generar */
    readonly formats: ExportFormat[];
    /** Destinos */
    readonly destinations?: ExportDestination[];
    /** Transformaciones a aplicar */
    readonly transformations?: TokenTransformation[];
    /** Opciones específicas por formato */
    readonly formatOptions?: Partial<Record<ExportFormat, Partial<ExportOptions>>>;
}
/**
 * Input para el use case.
 */
interface ExportDesignTokensInput {
    /** Colección de tokens a exportar */
    readonly collection: TokenCollection;
    /** Formatos de exportación */
    readonly formats: ExportFormat[];
    /** Destinos de exportación */
    readonly destinations?: ExportDestination[];
    /** Transformaciones a aplicar */
    readonly transformations?: TokenTransformation[];
    /** Opciones de exportación */
    readonly options?: Partial<ExportOptions>;
    /** Opciones específicas por formato */
    readonly formatOptions?: Partial<Record<ExportFormat, Partial<ExportOptions>>>;
    /** Si validar antes de exportar */
    readonly validateBeforeExport?: boolean;
    /** Si generar manifest */
    readonly generateManifest?: boolean;
    /** Preset a usar */
    readonly preset?: string;
}
/**
 * Resultado individual de exportación.
 */
interface FormatExportResult {
    /** Formato */
    readonly format: ExportFormat;
    /** Si tuvo éxito */
    readonly success: boolean;
    /** Resultado si éxito */
    readonly result?: ExportResult;
    /** Error si falló */
    readonly error?: Error;
    /** Destinos a los que se exportó */
    readonly destinations?: Array<{
        type: ExportDestination['type'];
        location?: string;
        success: boolean;
        error?: string;
    }>;
}
/**
 * Manifest de exportación.
 */
interface ExportManifest {
    /** Timestamp de exportación */
    readonly exportedAt: Date;
    /** Versión del exportador */
    readonly version: string;
    /** Nombre de la colección */
    readonly collectionName: string;
    /** Total de tokens */
    readonly tokenCount: number;
    /** Formatos generados */
    readonly formats: ExportFormat[];
    /** Destinos */
    readonly destinations: string[];
    /** Checksum del contenido */
    readonly checksum: string;
    /** Metadata adicional */
    readonly metadata?: Record<string, unknown>;
}
/**
 * Output del use case.
 */
interface ExportDesignTokensOutput {
    /** Si todas las exportaciones fueron exitosas */
    readonly success: boolean;
    /** Resultados por formato */
    readonly results: FormatExportResult[];
    /** Manifest si se solicitó */
    readonly manifest?: ExportManifest;
    /** Resumen */
    readonly summary: {
        readonly totalFormats: number;
        readonly successfulFormats: number;
        readonly failedFormats: number;
        readonly totalDestinations: number;
        readonly successfulDestinations: number;
        readonly totalTokensExported: number;
        readonly totalSizeBytes: number;
        readonly executionTimeMs: number;
    };
    /** Warnings */
    readonly warnings: string[];
}
/**
 * Presets de exportación predefinidos.
 */
declare const EXPORT_PRESETS: Record<string, ExportPreset>;
/**
 * ExportDesignTokens - Exporta tokens de diseño a múltiples formatos.
 *
 * Este use case orquesta la exportación de tokens a diferentes formatos
 * y destinos, aplicando transformaciones y validaciones.
 *
 * @example
 * ```typescript
 * const useCase = new ExportDesignTokens(exporter, auditService);
 *
 * const result = await useCase.execute({
 *   collection: tokenCollection,
 *   formats: ['css', 'tailwind', 'w3c'],
 *   destinations: [
 *     { type: 'file', path: './tokens' },
 *   ],
 *   validateBeforeExport: true,
 *   generateManifest: true,
 * });
 *
 * if (result.success) {
 *   console.log(`Exported ${result.value.summary.totalTokensExported} tokens`);
 *   console.log(`Total size: ${result.value.summary.totalSizeBytes} bytes`);
 * }
 * ```
 */
declare class ExportDesignTokens {
    private readonly exporterPort;
    private readonly auditPort?;
    constructor(exporterPort: ExporterPort, auditPort?: AuditPort);
    /**
     * Ejecuta el use case.
     */
    execute(input: ExportDesignTokensInput): Promise<Result<ExportDesignTokensOutput, Error>>;
    /**
     * Resuelve preset si se especifica.
     */
    private resolvePreset;
    /**
     * Valida el input.
     */
    private validateInput;
    /**
     * Aplica transformaciones a la colección.
     */
    private applyTransformations;
    /**
     * Aplica una transformación individual.
     */
    private applyTransformation;
    /**
     * Aplica transformación de filtro.
     */
    private applyFilterTransform;
    /**
     * Aplica transformación de ordenamiento.
     */
    private applySortTransform;
    /**
     * Exporta a un formato específico.
     */
    private exportFormat;
    /**
     * Construye opciones de exportación.
     */
    private buildExportOptions;
    /**
     * Calcula resumen de exportación.
     */
    private calculateSummary;
    /**
     * Genera manifest de exportación.
     */
    private generateManifest;
    /**
     * Genera checksum de la colección.
     */
    private generateChecksum;
}

/**
 * @fileoverview AuditVisualDecisions Use Case
 *
 * Use case para auditar decisiones visuales del sistema, generando
 * reportes de trazabilidad, cumplimiento y métricas de calidad.
 *
 * @module momoto-ui/application/use-cases/AuditVisualDecisions
 * @version 1.0.0
 */

/**
 * Tipo de auditoría a ejecutar.
 */
type AuditType = 'accessibility' | 'color-decisions' | 'token-usage' | 'performance' | 'compliance' | 'full';
/**
 * Nivel de detalle del reporte.
 */
type ReportDetail = 'summary' | 'standard' | 'detailed' | 'verbose';
/**
 * Formato de salida del reporte.
 */
type ReportFormat = 'text' | 'json' | 'html' | 'markdown' | 'csv';
/**
 * Configuración de auditoría de accesibilidad.
 */
interface AccessibilityAuditConfig {
    /** Nivel WCAG mínimo */
    readonly wcagLevel: 'A' | 'AA' | 'AAA';
    /** Si evaluar APCA */
    readonly evaluateApca: boolean;
    /** Nivel APCA mínimo */
    readonly apcaMinLevel: number;
    /** Componentes a auditar */
    readonly components?: string[];
    /** Si incluir recomendaciones */
    readonly includeRecommendations: boolean;
}
/**
 * Configuración de auditoría de decisiones de color.
 */
interface ColorDecisionAuditConfig {
    /** Si auditar consistencia */
    readonly auditConsistency: boolean;
    /** Si auditar armonía */
    readonly auditHarmony: boolean;
    /** Tolerancia de variación */
    readonly varianceTolerance: number;
    /** Período a auditar */
    readonly period?: {
        readonly start: Date;
        readonly end: Date;
    };
}
/**
 * Configuración de auditoría de uso de tokens.
 */
interface TokenUsageAuditConfig {
    /** Colección de referencia */
    readonly referenceCollection?: TokenCollection;
    /** Si detectar tokens no usados */
    readonly detectUnused: boolean;
    /** Si detectar tokens duplicados */
    readonly detectDuplicates: boolean;
    /** Si detectar tokens sin categorizar */
    readonly detectUncategorized: boolean;
}
/**
 * Configuración de auditoría de rendimiento.
 */
interface PerformanceAuditConfig {
    /** Umbral de tiempo de generación (ms) */
    readonly generationTimeThreshold: number;
    /** Umbral de tamaño de colección */
    readonly collectionSizeThreshold: number;
    /** Si auditar memoria */
    readonly auditMemory: boolean;
}
/**
 * Input para el use case.
 */
interface AuditVisualDecisionsInput {
    /** Tipos de auditoría a ejecutar */
    readonly auditTypes: AuditType[];
    /** Colección de tokens a auditar */
    readonly tokenCollection?: TokenCollection;
    /** Nivel de detalle del reporte */
    readonly detailLevel: ReportDetail;
    /** Formato de salida */
    readonly outputFormat: ReportFormat;
    /** Configuración de accesibilidad */
    readonly accessibilityConfig?: AccessibilityAuditConfig;
    /** Configuración de decisiones de color */
    readonly colorDecisionConfig?: ColorDecisionAuditConfig;
    /** Configuración de uso de tokens */
    readonly tokenUsageConfig?: TokenUsageAuditConfig;
    /** Configuración de rendimiento */
    readonly performanceConfig?: PerformanceAuditConfig;
    /** Filtros de período */
    readonly periodFilter?: {
        readonly start: Date;
        readonly end: Date;
    };
    /** Si incluir datos históricos */
    readonly includeHistory: boolean;
}
/**
 * Resultado de auditoría de accesibilidad.
 */
interface AccessibilityAuditResult {
    /** Total de evaluaciones */
    readonly totalEvaluations: number;
    /** Evaluaciones que pasan */
    readonly passing: number;
    /** Evaluaciones que fallan */
    readonly failing: number;
    /** Tasa de cumplimiento */
    readonly complianceRate: number;
    /** Componentes con issues */
    readonly issueComponents: Array<{
        readonly component: string;
        readonly issue: string;
        readonly severity: AuditSeverity;
        readonly recommendation?: string;
    }>;
    /** Ratio WCAG promedio */
    readonly avgWcagRatio: number;
    /** Nivel APCA promedio */
    readonly avgApcaLevel: number;
}
/**
 * Resultado de auditoría de decisiones de color.
 */
interface ColorDecisionAuditResult {
    /** Total de decisiones */
    readonly totalDecisions: number;
    /** Decisiones consistentes */
    readonly consistentDecisions: number;
    /** Variaciones detectadas */
    readonly variations: Array<{
        readonly context: string;
        readonly expected: string;
        readonly actual: string;
        readonly deviation: number;
    }>;
    /** Score de armonía */
    readonly harmonyScore: number;
    /** Paleta efectiva extraída */
    readonly effectivePalette: string[];
}
/**
 * Resultado de auditoría de uso de tokens.
 */
interface TokenUsageAuditResult {
    /** Total de tokens */
    readonly totalTokens: number;
    /** Tokens usados */
    readonly usedTokens: number;
    /** Tokens no usados */
    readonly unusedTokens: string[];
    /** Tokens duplicados */
    readonly duplicateTokens: Array<{
        readonly name: string;
        readonly duplicateOf: string;
    }>;
    /** Tokens sin categorizar */
    readonly uncategorizedTokens: string[];
    /** Cobertura de uso */
    readonly usageCoverage: number;
}
/**
 * Resultado de auditoría de rendimiento.
 */
interface PerformanceAuditResult {
    /** Tiempo promedio de generación */
    readonly avgGenerationTimeMs: number;
    /** Tiempo máximo de generación */
    readonly maxGenerationTimeMs: number;
    /** Operaciones lentas */
    readonly slowOperations: Array<{
        readonly operation: string;
        readonly timeMs: number;
        readonly threshold: number;
    }>;
    /** Tamaño de colección */
    readonly collectionSizeBytes: number;
    /** Score de rendimiento */
    readonly performanceScore: number;
}
/**
 * Score general de calidad.
 */
interface QualityScore {
    /** Score total (0-100) */
    readonly overall: number;
    /** Score por categoría */
    readonly byCategory: {
        readonly accessibility: number;
        readonly consistency: number;
        readonly coverage: number;
        readonly performance: number;
    };
    /** Grade (A-F) */
    readonly grade: 'A' | 'B' | 'C' | 'D' | 'F';
    /** Áreas de mejora */
    readonly improvementAreas: string[];
}
/**
 * Output del use case.
 */
interface AuditVisualDecisionsOutput {
    /** Resultado de accesibilidad */
    readonly accessibility?: AccessibilityAuditResult;
    /** Resultado de decisiones de color */
    readonly colorDecisions?: ColorDecisionAuditResult;
    /** Resultado de uso de tokens */
    readonly tokenUsage?: TokenUsageAuditResult;
    /** Resultado de rendimiento */
    readonly performance?: PerformanceAuditResult;
    /** Score de calidad general */
    readonly qualityScore: QualityScore;
    /** Reporte formateado */
    readonly report: string;
    /** Resumen ejecutivo */
    readonly executiveSummary: string;
    /** Recomendaciones priorizadas */
    readonly recommendations: Array<{
        readonly priority: 'high' | 'medium' | 'low';
        readonly category: string;
        readonly recommendation: string;
        readonly impact: string;
    }>;
    /** Metadata de la auditoría */
    readonly metadata: {
        readonly auditedAt: Date;
        readonly duration: number;
        readonly auditTypes: AuditType[];
        readonly periodCovered?: {
            start: Date;
            end: Date;
        };
    };
}
/**
 * AuditVisualDecisions - Audita decisiones visuales del sistema.
 *
 * Este use case genera reportes comprehensivos sobre la calidad
 * de las decisiones visuales, accesibilidad y uso de tokens.
 *
 * @example
 * ```typescript
 * const useCase = new AuditVisualDecisions(auditPort);
 *
 * const result = await useCase.execute({
 *   auditTypes: ['accessibility', 'color-decisions', 'token-usage'],
 *   tokenCollection: myTokens,
 *   detailLevel: 'detailed',
 *   outputFormat: 'markdown',
 *   accessibilityConfig: {
 *     wcagLevel: 'AA',
 *     evaluateApca: true,
 *     apcaMinLevel: 60,
 *     includeRecommendations: true,
 *   },
 *   includeHistory: true,
 * });
 *
 * if (result.success) {
 *   console.log(`Quality Score: ${result.value.qualityScore.overall}/100`);
 *   console.log(`Grade: ${result.value.qualityScore.grade}`);
 *   console.log(result.value.report);
 * }
 * ```
 */
declare class AuditVisualDecisions {
    private readonly auditPort;
    constructor(auditPort: AuditPort);
    /**
     * Ejecuta el use case.
     */
    execute(input: AuditVisualDecisionsInput): Promise<Result<AuditVisualDecisionsOutput, Error>>;
    /**
     * Valida el input.
     */
    private validateInput;
    /**
     * Audita accesibilidad.
     */
    private auditAccessibility;
    /**
     * Audita decisiones de color.
     */
    private auditColorDecisions;
    /**
     * Audita uso de tokens.
     */
    private auditTokenUsage;
    /**
     * Audita rendimiento.
     */
    private auditPerformance;
    /**
     * Calcula score de calidad.
     */
    private calculateQualityScore;
    /**
     * Calcula grade basado en score.
     */
    private calculateGrade;
    /**
     * Genera recomendaciones.
     */
    private generateRecommendations;
    /**
     * Genera reporte formateado.
     */
    private generateReport;
    /**
     * Genera reporte en texto.
     */
    private generateTextReport;
    /**
     * Genera reporte en Markdown.
     */
    private generateMarkdownReport;
    /**
     * Genera reporte en HTML.
     */
    private generateHtmlReport;
    /**
     * Genera resumen ejecutivo.
     */
    private generateExecutiveSummary;
}

/**
 * @fileoverview ColorDecisionPort - Inbound Port for Color Decisions
 *
 * Puerto de entrada que define el contrato para tomar decisiones de color
 * basadas en contexto UX, accesibilidad y percepción.
 *
 * Este puerto es implementado por los adaptadores que necesitan
 * solicitar decisiones de color al sistema Color Intelligence.
 *
 * @module momoto-ui/application/ports/inbound/ColorDecisionPort
 * @version 1.0.0
 */

/**
 * Contexto para una solicitud de decisión de color.
 */
interface ColorDecisionContext {
    /** Rol del elemento en la UI */
    readonly role: UIRole;
    /** Estado actual del elemento */
    readonly state: UIState;
    /** Intención del componente */
    readonly intent: ComponentIntent;
    /** Variante del componente */
    readonly variant?: ComponentVariant;
    /** Si el fondo es oscuro */
    readonly isDarkBackground?: boolean;
    /** Nivel de contraste requerido */
    readonly contrastRequirement?: 'AA' | 'AAA' | 'APCA-60' | 'APCA-75' | 'APCA-90';
    /** Metadata adicional */
    readonly metadata?: Record<string, unknown>;
}
/**
 * Resultado de una decisión de color.
 */
interface ColorDecisionResult {
    /** Color principal decidido */
    readonly color: PerceptualColor;
    /** Color de texto para este fondo */
    readonly textColor: PerceptualColor;
    /** Color de borde si aplica */
    readonly borderColor?: PerceptualColor;
    /** Color de sombra si aplica */
    readonly shadowColor?: PerceptualColor;
    /** Ratio de contraste WCAG */
    readonly wcagContrast: number;
    /** Nivel de contraste APCA */
    readonly apcaContrast: number;
    /** Si cumple el requisito de accesibilidad */
    readonly meetsAccessibility: boolean;
    /** Token generado */
    readonly token: DesignToken;
    /** Justificación de la decisión */
    readonly rationale: string;
}
/**
 * Solicitud de decisión de escala de colores.
 */
interface ColorScaleRequest {
    /** Nombre base para la escala */
    readonly baseName: string;
    /** Color base */
    readonly baseColor: PerceptualColor;
    /** Número de pasos en la escala */
    readonly steps?: number;
    /** Si incluir colores oscuros */
    readonly includeDark?: boolean;
    /** Si incluir colores claros */
    readonly includeLight?: boolean;
}
/**
 * Resultado de una escala de colores.
 */
interface ColorScaleResult {
    /** Escala de colores generada (índice 0-1000) */
    readonly scale: Map<number, PerceptualColor>;
    /** Tokens generados para cada paso */
    readonly tokens: DesignToken[];
    /** Pares de accesibilidad identificados */
    readonly accessiblePairs: Array<{
        background: number;
        foreground: number;
        contrast: number;
    }>;
}
/**
 * Solicitud de tema completo.
 */
interface ThemeRequest {
    /** Nombre del tema */
    readonly themeName: string;
    /** Color de marca primario */
    readonly brandColor: PerceptualColor;
    /** Colores semánticos opcionales */
    readonly semanticColors?: {
        readonly success?: PerceptualColor;
        readonly warning?: PerceptualColor;
        readonly error?: PerceptualColor;
        readonly info?: PerceptualColor;
    };
    /** Si generar variante oscura */
    readonly generateDarkVariant?: boolean;
    /** Contexto de la marca */
    readonly brandContext?: 'corporate' | 'playful' | 'luxury' | 'tech' | 'natural';
}
/**
 * Resultado de generación de tema.
 */
interface ThemeResult {
    /** Colores primarios del tema */
    readonly primary: ColorScaleResult;
    /** Colores neutrales */
    readonly neutral: ColorScaleResult;
    /** Colores semánticos */
    readonly semantic: {
        readonly success: PerceptualColor;
        readonly warning: PerceptualColor;
        readonly error: PerceptualColor;
        readonly info: PerceptualColor;
    };
    /** Todos los tokens del tema */
    readonly tokens: DesignToken[];
    /** CSS generado */
    readonly css: string;
    /** Si es tema oscuro */
    readonly isDark: boolean;
}
/**
 * ColorDecisionPort - Puerto de entrada para decisiones de color.
 *
 * Este puerto define el contrato que los adaptadores externos deben usar
 * para solicitar decisiones de color al sistema Color Intelligence.
 *
 * @example
 * ```typescript
 * class ReactColorAdapter implements ColorDecisionPort {
 *   async decideColor(context: ColorDecisionContext): Promise<Result<ColorDecisionResult, Error>> {
 *     // Implementación usando el UXDecision del dominio
 *     const decision = UXDecision.create(this.brandColor);
 *     return decision.request({
 *       role: context.role,
 *       state: context.state,
 *       intent: context.intent,
 *     });
 *   }
 * }
 * ```
 */
interface ColorDecisionPort {
    /**
     * Solicita una decisión de color para un contexto específico.
     *
     * @param context - Contexto completo de la decisión
     * @returns Resultado con el color decidido o error
     */
    decideColor(context: ColorDecisionContext): Promise<Result<ColorDecisionResult, Error>>;
    /**
     * Genera una escala completa de colores.
     *
     * @param request - Parámetros de la escala
     * @returns Escala de colores con tokens
     */
    generateScale(request: ColorScaleRequest): Promise<Result<ColorScaleResult, Error>>;
    /**
     * Genera un tema completo basado en un color de marca.
     *
     * @param request - Parámetros del tema
     * @returns Tema completo con todos los tokens
     */
    generateTheme(request: ThemeRequest): Promise<Result<ThemeResult, Error>>;
    /**
     * Evalúa si dos colores cumplen requisitos de accesibilidad.
     *
     * @param foreground - Color de primer plano
     * @param background - Color de fondo
     * @param level - Nivel de accesibilidad requerido
     * @returns Resultado de la evaluación
     */
    evaluateAccessibility(foreground: PerceptualColor, background: PerceptualColor, level: 'AA' | 'AAA' | 'APCA-60' | 'APCA-75' | 'APCA-90'): Promise<Result<{
        passes: boolean;
        wcagRatio: number;
        apcaLevel: number;
        recommendation?: PerceptualColor;
    }, Error>>;
    /**
     * Obtiene el color de texto óptimo para un fondo dado.
     *
     * @param background - Color de fondo
     * @param preferDark - Si se prefiere texto oscuro cuando sea posible
     * @returns Color de texto óptimo
     */
    getOptimalTextColor(background: PerceptualColor, preferDark?: boolean): Promise<Result<PerceptualColor, Error>>;
}

/**
 * @fileoverview EnterpriseGovernancePort - Inbound Port
 *
 * Defines the inbound port (driving port) for enterprise governance.
 * This is the contract that external adapters (React, CLI, etc.) use
 * to interact with the governance system.
 *
 * @module momoto-ui/application/ports/inbound/EnterpriseGovernancePort
 * @version 1.0.0
 */

/**
 * EnterpriseGovernancePort - Inbound port for governance operations.
 *
 * This port defines all operations available to external consumers
 * for enforcing enterprise design governance.
 *
 * Implementations:
 * - Direct use case invocation (application layer)
 * - React hooks/providers (adapter layer)
 * - CLI commands (adapter layer)
 * - REST API handlers (adapter layer)
 */
interface EnterpriseGovernancePort {
    /**
     * Enforces governance on a color decision.
     */
    enforceColorGovernance(input: ColorGovernanceInput): Promise<GovernanceResult>;
    /**
     * Enforces governance on an accessibility decision.
     */
    enforceAccessibilityGovernance(input: AccessibilityGovernanceInput): Promise<GovernanceResult>;
    /**
     * Enforces governance on a token collection.
     */
    enforceTokenGovernance(input: TokenGovernanceInput): Promise<GovernanceResult>;
    /**
     * Enforces governance on a theme configuration.
     */
    enforceThemeGovernance(input: ThemeGovernanceInput): Promise<GovernanceResult>;
    /**
     * Enforces governance on a component configuration.
     */
    enforceComponentGovernance(input: ComponentGovernanceInput): Promise<GovernanceResult>;
    /**
     * Quick check - returns only compliance status.
     */
    isCompliant(input: QuickCheckInput): Promise<boolean>;
    /**
     * Gets compliance score (0-100).
     */
    getComplianceScore(input: QuickCheckInput): Promise<number>;
    /**
     * Gets the current policy set.
     */
    getPolicySet(): PolicySet;
    /**
     * Gets policies by scope.
     */
    getPoliciesByScope(scope: PolicyScope): readonly EnterprisePolicy[];
    /**
     * Enables a policy.
     */
    enablePolicy(policyId: string): void;
    /**
     * Disables a policy.
     */
    disablePolicy(policyId: string): void;
    /**
     * Adds a custom policy.
     */
    addPolicy(policy: EnterprisePolicy): void;
    /**
     * Removes a policy.
     */
    removePolicy(policyId: string): void;
    /**
     * Generates a governance report.
     */
    generateReport(input: ReportInput): Promise<GovernanceReport>;
}
interface ColorGovernanceInput {
    readonly colorHex: string;
    readonly purpose?: 'brand' | 'text' | 'background' | 'border';
    readonly context?: Partial<PolicyContext>;
}
interface AccessibilityGovernanceInput {
    readonly foregroundHex: string;
    readonly backgroundHex: string;
    readonly textSize?: 'normal' | 'large';
    readonly context?: Partial<PolicyContext>;
}
interface TokenGovernanceInput {
    readonly tokens: TokenCollection;
    readonly namespace?: string;
    readonly context?: Partial<PolicyContext>;
}
interface ThemeGovernanceInput {
    readonly hasLightMode: boolean;
    readonly hasDarkMode: boolean;
    readonly brandColorHex?: string;
    readonly context?: Partial<PolicyContext>;
}
interface ComponentGovernanceInput {
    readonly componentName: string;
    readonly tokens?: TokenCollection;
    readonly brandColorHex?: string;
    readonly context?: Partial<PolicyContext>;
}
interface QuickCheckInput {
    readonly type: 'color' | 'accessibility' | 'tokens' | 'theme' | 'component';
    readonly data: Record<string, unknown>;
}
interface ReportInput {
    readonly scope?: PolicyScope;
    readonly format?: 'json' | 'markdown' | 'html';
    readonly includeDetails?: boolean;
}
interface GovernanceResult {
    readonly success: boolean;
    readonly compliant: boolean;
    readonly complianceScore: number;
    readonly summary: {
        readonly status: 'pass' | 'fail' | 'warning';
        readonly headline: string;
        readonly details: string[];
        readonly recommendations: string[];
    };
    readonly violations: readonly GovernanceViolation[];
    readonly warnings: readonly GovernanceViolation[];
    readonly auditId?: string;
}
interface GovernanceViolation {
    readonly policyId: string;
    readonly policyName: string;
    readonly severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    readonly message: string;
    readonly suggestion?: string;
    readonly autoFixable: boolean;
}
interface GovernanceReport {
    readonly generatedAt: Date;
    readonly scope: PolicyScope | 'all';
    readonly totalPolicies: number;
    readonly enabledPolicies: number;
    readonly policyBreakdown: Record<string, number>;
    readonly content: string;
}

export { type AccessibilityAuditConfig, type AccessibilityAuditResult, type AccessibilityGovernanceInput, type AccessibilityViolation, ApplyPerceptualPolicy, type ApplyPerceptualPolicyInput, type ApplyPerceptualPolicyOutput, AuditPort, AuditSeverity, type AuditType, AuditVisualDecisions, type AuditVisualDecisionsInput, type AuditVisualDecisionsOutput, type ChromaPolicy, type ColorDecisionAuditConfig, type ColorDecisionAuditResult, type ColorDecisionContext, type ColorDecisionPort, type ColorDecisionResult, type ColorGovernanceInput, type ColorPair, type ColorScaleRequest, type ColorScaleResult, type ComponentGovernanceInput, type ContrastPolicy, EXPORT_PRESETS, type EnterpriseGovernancePort, type EvaluateAccessibilityInput, type EvaluateAccessibilityOutput, EvaluateComponentAccessibility, ExportDesignTokens, type ExportDesignTokensInput, type ExportDesignTokensOutput, ExportDestination, type ExportManifest, type ExportPreset, ExportResult, ExporterPort, type FormatExportResult, GenerateComponentTokens, type GenerateComponentTokensInput, type GenerateComponentTokensOutput, type GovernanceReport, type GovernanceResult, type GovernanceViolation, type HarmonyPolicy, type LightnessPolicy, PRESET_POLICIES, type PairEvaluationResult, type PerformanceAuditConfig, type PerformanceAuditResult, type QualityScore, type ReportDetail, type ThemeGovernanceInput, type ThemeRequest, type ThemeResult, type TokenGovernanceInput, type TokenRepositoryPort, type TokenTransformation, type TokenUsageAuditConfig, type TokenUsageAuditResult };
