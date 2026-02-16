import { _ as Result } from '../../UIState-DmEU8dBf.mjs';
import { D as DesignToken } from '../../DesignToken-Bln084x4.mjs';
import { T as TokenCollection } from '../../TokenCollection-CtE784DZ.mjs';
import { c as ExporterPort, f as ExportOptions, a as ExportResult, E as ExportDestination, b as ExportToDestinationResult, e as ExportFormat, B as BaseExportOptions } from '../../ExporterPort-BfduwJSx.mjs';

/**
 * @fileoverview W3C Design Tokens Exporter
 *
 * Implementación del ExporterPort para exportar tokens en formato W3C DTCG.
 * Cumple con la especificación del Design Tokens Community Group.
 *
 * @see https://design-tokens.github.io/community-group/format/
 *
 * @module momoto-ui/infrastructure/exporters/W3CTokenExporter
 * @version 1.0.0
 */

/**
 * Opciones específicas del exportador W3C.
 */
interface W3CExporterOptions {
    /** Si incluir $type en todos los tokens */
    readonly includeType?: boolean;
    /** Si incluir $description cuando esté disponible */
    readonly includeDescription?: boolean;
    /** Si incluir $extensions con metadatos adicionales */
    readonly includeExtensions?: boolean;
    /** Namespace para extensions propias */
    readonly extensionNamespace?: string;
    /** Si agrupar tokens por path */
    readonly groupByPath?: boolean;
    /** Si incluir metadatos del archivo */
    readonly includeFileMetadata?: boolean;
}
/**
 * W3CTokenExporter - Exportador de tokens en formato W3C DTCG.
 *
 * Genera archivos JSON compatibles con la especificación del
 * Design Tokens Community Group, listos para ser consumidos por
 * herramientas como Style Dictionary, Figma Tokens, o cualquier
 * otra herramienta compatible.
 *
 * @example
 * ```typescript
 * const exporter = new W3CTokenExporter({
 *   includeType: true,
 *   includeDescription: true,
 *   groupByPath: true,
 * });
 *
 * const result = await exporter.export(tokenCollection, {
 *   format: 'w3c',
 * });
 *
 * if (result.success) {
 *   console.log(result.value.content);
 * }
 * ```
 */
declare class W3CTokenExporter implements ExporterPort {
    private readonly options;
    constructor(options?: W3CExporterOptions);
    export(collection: TokenCollection, options: ExportOptions): Promise<Result<ExportResult, Error>>;
    exportTokens(tokens: DesignToken[], options: ExportOptions): Promise<Result<ExportResult, Error>>;
    exportTo(collection: TokenCollection, options: ExportOptions, destination: ExportDestination): Promise<Result<ExportToDestinationResult, Error>>;
    getSupportedFormats(): ExportFormat[];
    supportsFormat(format: string): format is ExportFormat;
    getDefaultOptions(format: ExportFormat): BaseExportOptions;
    validateOptions(options: ExportOptions): Result<void, Error>;
    validateDestination(destination: ExportDestination): Promise<Result<void, Error>>;
    preview(collection: TokenCollection, options: ExportOptions, maxLines?: number): Promise<Result<{
        preview: string;
        truncated: boolean;
        totalLines: number;
    }, Error>>;
    exportMultiple(collection: TokenCollection, formats: ExportOptions[]): Promise<Result<Map<ExportFormat, ExportResult>, Error>>;
    exportToMultiple(collection: TokenCollection, destinations: Array<{
        options: ExportOptions;
        destination: ExportDestination;
    }>): Promise<Result<ExportToDestinationResult[], Error>>;
    private exportW3C;
    private exportCSS;
    private exportSCSS;
    private exportTypeScript;
    /**
     * Gets the token path as an array of strings.
     * DesignToken.path is always string[], so this is a simple accessor.
     */
    private getTokenPath;
    private tokenToW3C;
    private mapToW3CType;
    private getTokenValue;
    private setNestedValue;
}

export { type W3CExporterOptions, W3CTokenExporter };
