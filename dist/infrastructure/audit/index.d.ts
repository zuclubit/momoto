import { _ as Result, Q as PerceptualColor, ae as UIState } from '../../UIState-DmEU8dBf.js';
import { b as AuditPort, e as AuditEntry, f as AuditFilter, g as AuditReport, d as AuditStats } from '../../AuditPort-9DApR4zW.js';
import { D as DesignToken } from '../../DesignToken-BFJu4GcO.js';
import { U as UIRole, a as ComponentIntent } from '../../ComponentIntent-CyMXhAbr.js';

/**
 * @fileoverview In-Memory Audit Adapter
 *
 * Implementación en memoria del AuditPort para desarrollo y testing.
 * Almacena entradas de auditoría en memoria con capacidad limitada.
 *
 * @module momoto-ui/infrastructure/audit/InMemoryAuditAdapter
 * @version 1.0.0
 */

/**
 * Opciones de configuración del adaptador.
 */
interface InMemoryAuditOptions {
    /** Número máximo de entradas a mantener */
    readonly maxEntries?: number;
    /** Si habilitar logging a consola */
    readonly consoleLogging?: boolean;
    /** Nivel de logging */
    readonly logLevel?: 'info' | 'warning' | 'error' | 'critical';
    /** Callback para cada entrada nueva */
    readonly onEntry?: (entry: AuditEntry) => void;
}
/**
 * InMemoryAuditAdapter - Adaptador de auditoría en memoria.
 *
 * Ideal para:
 * - Desarrollo local
 * - Testing
 * - Debugging
 * - Demos
 *
 * NO recomendado para producción (datos se pierden al reiniciar).
 *
 * @example
 * ```typescript
 * const auditAdapter = new InMemoryAuditAdapter({
 *   maxEntries: 1000,
 *   consoleLogging: true,
 *   logLevel: 'info',
 * });
 *
 * // Log a color decision
 * await auditAdapter.logColorDecision({
 *   inputColor: PerceptualColor.fromHex('#3B82F6'),
 *   outputColor: PerceptualColor.fromHex('#2563EB'),
 *   rationale: 'Adjusted for WCAG AA compliance',
 * });
 * ```
 */
declare class InMemoryAuditAdapter implements AuditPort {
    private readonly options;
    private entries;
    private archivedEntries;
    private entryCounter;
    constructor(options?: InMemoryAuditOptions);
    log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): Promise<Result<string, Error>>;
    logColorDecision(decision: {
        inputColor: PerceptualColor;
        outputColor: PerceptualColor;
        role?: UIRole;
        state?: UIState;
        intent?: ComponentIntent;
        rationale: string;
    }, correlationId?: string): Promise<Result<string, Error>>;
    logAccessibilityEvaluation(evaluation: {
        foreground: PerceptualColor;
        background: PerceptualColor;
        wcagRatio: number;
        apcaLevel: number;
        requiredLevel: string;
        passes: boolean;
        component?: string;
    }, correlationId?: string): Promise<Result<string, Error>>;
    logTokenGeneration(generation: {
        name: string;
        tokens: DesignToken[];
        generationTimeMs: number;
        config?: Record<string, unknown>;
    }, correlationId?: string): Promise<Result<string, Error>>;
    query(filter: AuditFilter): Promise<Result<AuditEntry[], Error>>;
    getById(id: string): Promise<Result<AuditEntry | null, Error>>;
    getByCorrelation(correlationId: string): Promise<Result<AuditEntry[], Error>>;
    generateReport(startDate: Date, endDate: Date): Promise<Result<AuditReport, Error>>;
    getStats(): Promise<Result<AuditStats, Error>>;
    export(filter: AuditFilter, format: 'json' | 'csv' | 'html'): Promise<Result<string, Error>>;
    purge(olderThan: Date): Promise<Result<number, Error>>;
    archive(olderThan: Date): Promise<Result<number, Error>>;
    isAvailable(): Promise<boolean>;
    /**
     * Clears all entries. For testing purposes.
     */
    clear(): Promise<Result<void, Error>>;
    /**
     * Gets archived entries. For testing purposes.
     */
    getArchivedEntries(): readonly AuditEntry[];
    private generateId;
    private addEntry;
    private logToConsole;
    private initializeCategoryRecord;
    private initializeSeverityRecord;
    private generateRecommendations;
}

export { InMemoryAuditAdapter, type InMemoryAuditOptions };
