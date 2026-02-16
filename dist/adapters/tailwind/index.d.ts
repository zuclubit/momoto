import { _ as Result } from '../../UIState-DmEU8dBf.js';
import { T as TokenCollection } from '../../TokenCollection-tspMCTIo.js';
import '../../DesignToken-BFJu4GcO.js';

/**
 * @fileoverview Tailwind Config Adapter
 *
 * Adaptador para generar configuración de Tailwind CSS desde tokens de diseño.
 * Convierte TokenCollection a formato compatible con tailwind.config.js.
 *
 * @module momoto-ui/adapters/tailwind/TailwindConfigAdapter
 * @version 1.0.0
 */

/**
 * Opciones de configuración del adaptador Tailwind.
 */
interface TailwindAdapterOptions {
    /** Prefijo para clases generadas */
    readonly prefix?: string;
    /** Si usar CSS variables en lugar de valores directos */
    readonly useCssVariables?: boolean;
    /** Prefijo de CSS variables */
    readonly cssVariablePrefix?: string;
    /** Si extender la configuración existente o reemplazar */
    readonly extend?: boolean;
    /** Namespaces de tokens a incluir */
    readonly includeNamespaces?: string[];
    /** Namespaces de tokens a excluir */
    readonly excludeNamespaces?: string[];
    /** Formato de salida */
    readonly outputFormat?: 'js' | 'ts' | 'json' | 'esm' | 'cjs';
    /** Si incluir tipos TypeScript */
    readonly includeTypes?: boolean;
    /** Configuración personalizada de mapeo */
    readonly customMappings?: Record<string, string>;
}
/**
 * Resultado de la generación de configuración.
 */
interface TailwindConfigResult {
    /** Configuración generada */
    readonly config: TailwindThemeConfig;
    /** Contenido exportable como string */
    readonly content: string;
    /** Estadísticas de generación */
    readonly stats: {
        readonly totalTokens: number;
        readonly colorTokens: number;
        readonly spacingTokens: number;
        readonly typographyTokens: number;
        readonly otherTokens: number;
    };
}
/**
 * Configuración de tema de Tailwind.
 */
interface TailwindThemeConfig {
    colors?: Record<string, string | Record<string, string>>;
    spacing?: Record<string, string>;
    fontSize?: Record<string, string | [string, {
        lineHeight?: string;
        letterSpacing?: string;
        fontWeight?: string;
    }]>;
    fontFamily?: Record<string, string[]>;
    fontWeight?: Record<string, string>;
    lineHeight?: Record<string, string>;
    letterSpacing?: Record<string, string>;
    borderRadius?: Record<string, string>;
    borderWidth?: Record<string, string>;
    boxShadow?: Record<string, string>;
    opacity?: Record<string, string>;
    zIndex?: Record<string, string>;
    transitionDuration?: Record<string, string>;
    transitionTimingFunction?: Record<string, string>;
    animation?: Record<string, string>;
    keyframes?: Record<string, Record<string, Record<string, string>>>;
}
/**
 * Configuración completa de Tailwind.
 */
interface FullTailwindConfig {
    content?: string[];
    theme?: {
        extend?: TailwindThemeConfig;
    } & TailwindThemeConfig;
    plugins?: unknown[];
    darkMode?: 'media' | 'class' | ['class', string];
    prefix?: string;
}
/**
 * TailwindConfigAdapter - Adaptador de tokens a configuración de Tailwind.
 *
 * Convierte una colección de tokens de diseño en configuración compatible
 * con Tailwind CSS, con soporte para CSS variables y extensiones.
 *
 * @example
 * ```typescript
 * const adapter = new TailwindConfigAdapter({
 *   useCssVariables: true,
 *   cssVariablePrefix: 'color',
 *   extend: true,
 *   outputFormat: 'ts',
 * });
 *
 * const result = await adapter.generate(tokenCollection);
 *
 * if (result.success) {
 *   console.log(result.value.content);
 *   // Output: module.exports = { theme: { extend: { colors: { ... } } } }
 * }
 * ```
 */
declare class TailwindConfigAdapter {
    private readonly options;
    constructor(options?: TailwindAdapterOptions);
    /**
     * Genera configuración de Tailwind desde tokens.
     */
    generate(collection: TokenCollection): Promise<Result<TailwindConfigResult, Error>>;
    /**
     * Genera configuración completa de Tailwind incluyendo plugins y dark mode.
     */
    generateFull(collection: TokenCollection, baseConfig?: Partial<FullTailwindConfig>): Promise<Result<{
        config: FullTailwindConfig;
        content: string;
    }, Error>>;
    /**
     * Genera solo la sección de colores.
     */
    generateColors(collection: TokenCollection): Promise<Result<Record<string, string | Record<string, string>>, Error>>;
    /**
     * Genera una escala de colores para un nombre base.
     */
    generateColorScale(collection: TokenCollection, baseName: string): Promise<Result<Record<string, string>, Error>>;
    /**
     * Genera el plugin de Tailwind para los tokens.
     */
    generatePlugin(collection: TokenCollection): Promise<Result<string, Error>>;
    /**
     * Valida si una configuración es compatible.
     */
    validate(config: TailwindThemeConfig): Promise<Result<{
        valid: boolean;
        warnings: string[];
    }, Error>>;
    private filterTokens;
    private buildThemeConfig;
    private buildColorConfig;
    private buildSpacingConfig;
    private buildTypographyConfig;
    private buildShadowConfig;
    private buildBorderConfig;
    private formatTokenValue;
    private tokenToVariableName;
    private tokenToKey;
    private getTokenRawValue;
    private isColorToken;
    private isSpacingToken;
    private isTypographyToken;
    private isShadowToken;
    private isBorderToken;
    private formatOutput;
    private formatFullConfig;
    private formatTypeScript;
    private calculateStats;
    private isValidColorValue;
    private isValidSpacingValue;
}

export { type FullTailwindConfig, type TailwindAdapterOptions, TailwindConfigAdapter, type TailwindConfigResult, type TailwindThemeConfig, TailwindConfigAdapter as default };
