import { R as Result, au as UIRole, b as UIState } from './UIState-CG23I-mF.js';
import { D as DesignToken, e as TokenType, f as TokenCategory } from './DesignToken-wtGoW8Zp.js';

/**
 * @fileoverview TokenCollection Entity (Immutable)
 *
 * Entidad INMUTABLE que representa una colección organizada de Design Tokens.
 * Proporciona operaciones de consulta, filtrado, agrupación y exportación.
 *
 * Todas las operaciones de modificación retornan una NUEVA instancia,
 * preservando la inmutabilidad requerida por DDD.
 *
 * @module momoto-ui/domain/tokens/entities/TokenCollection
 * @version 2.0.0
 */

/**
 * Filtro para búsqueda de tokens.
 */
interface TokenFilter {
    readonly name?: string | RegExp;
    readonly type?: TokenType;
    readonly category?: TokenCategory;
    readonly namespace?: string;
    readonly role?: UIRole;
    readonly state?: UIState;
    readonly component?: string;
    readonly includeDeprecated?: boolean;
}
/**
 * Opciones de exportación.
 */
interface ExportOptions {
    readonly format: 'css' | 'scss' | 'json' | 'w3c' | 'tailwind' | 'figma';
    readonly includeMetadata?: boolean;
    readonly includeDeprecated?: boolean;
    readonly prefix?: string;
    readonly indent?: number;
}
/**
 * Estructura jerárquica de tokens.
 */
interface TokenHierarchy {
    [key: string]: TokenHierarchy | DesignToken;
}
/**
 * Estadísticas de la colección.
 */
interface CollectionStats {
    readonly totalTokens: number;
    readonly byType: Readonly<Record<TokenType, number>>;
    readonly byCategory: Readonly<Record<TokenCategory, number>>;
    readonly byNamespace: Readonly<Record<string, number>>;
    readonly deprecatedCount: number;
    readonly uniqueColors: number;
}
/**
 * Resultado de validación.
 */
interface ValidationResult {
    readonly valid: boolean;
    readonly errors: readonly ValidationError[];
    readonly warnings: readonly ValidationWarning[];
}
interface ValidationError {
    readonly tokenName: string;
    readonly code: string;
    readonly message: string;
}
interface ValidationWarning {
    readonly tokenName: string;
    readonly code: string;
    readonly message: string;
}
/**
 * Opciones para crear una colección.
 */
interface TokenCollectionOptions {
    readonly name: string;
    readonly description?: string;
    readonly version?: string;
}
/**
 * TokenCollection - Entidad INMUTABLE para gestión de colecciones de tokens.
 *
 * IMPORTANTE: Todas las operaciones de modificación retornan una NUEVA instancia.
 * La instancia original nunca se modifica.
 *
 * Proporciona operaciones avanzadas sobre conjuntos de tokens:
 * - Consultas y filtrado
 * - Agrupación y organización
 * - Exportación a múltiples formatos
 * - Validación y auditoría
 *
 * @example
 * ```typescript
 * // Crear colección (inmutable)
 * const collection = TokenCollection.create({ name: 'brand' })
 *   .add(buttonBgToken)
 *   .add(buttonTextToken)
 *   .addAll(stateTokens);
 *
 * // Cada operación retorna nueva instancia
 * const updated = collection.add(newToken);
 * console.log(collection === updated); // false
 *
 * // Filtrar (no modifica)
 * const colorTokens = collection.filter({ type: 'color' });
 *
 * // Exportar a CSS
 * console.log(collection.export({ format: 'css' }));
 *
 * // Validar
 * const result = collection.validate();
 * ```
 */
declare class TokenCollection {
    private readonly _name;
    private readonly _description;
    private readonly _version;
    private readonly _tokens;
    private readonly _createdAt;
    private readonly _updatedAt;
    private constructor();
    /**
     * Crea una nueva colección vacía.
     * @param optionsOrName - Options object o simplemente el nombre.
     */
    static create(optionsOrName: TokenCollectionOptions | string): TokenCollection;
    /**
     * Crea colección vacía (alias de create).
     */
    static empty(name: string): TokenCollection;
    /**
     * Crea colección desde array de tokens.
     */
    static from(name: string, tokens: readonly DesignToken[], description?: string): TokenCollection;
    /**
     * Merge múltiples colecciones en una nueva.
     */
    static merge(name: string, collections: readonly TokenCollection[]): TokenCollection;
    get name(): string;
    get description(): string;
    get version(): string;
    get size(): number;
    get isEmpty(): boolean;
    get createdAt(): Date;
    get updatedAt(): Date;
    /**
     * Obtiene todos los namespaces únicos.
     */
    get namespaces(): readonly string[];
    /**
     * Agrega un token. Retorna NUEVA colección.
     */
    add(token: DesignToken): TokenCollection;
    /**
     * Agrega múltiples tokens. Retorna NUEVA colección.
     */
    addAll(tokens: readonly DesignToken[]): TokenCollection;
    /**
     * Obtiene un token por nombre.
     */
    get(name: string): DesignToken | undefined;
    /**
     * Verifica si existe un token.
     */
    has(name: string): boolean;
    /**
     * Elimina un token. Retorna NUEVA colección.
     * Si el token no existe, retorna la misma instancia (sin cambios).
     */
    remove(name: string): TokenCollection;
    /**
     * Reemplaza un token. Retorna Result con NUEVA colección o error.
     */
    replace(token: DesignToken): Result<TokenCollection, Error>;
    /**
     * Actualiza o agrega un token. Retorna NUEVA colección.
     */
    upsert(token: DesignToken): TokenCollection;
    /**
     * Limpia la colección. Retorna NUEVA colección vacía.
     */
    clear(): TokenCollection;
    /**
     * Actualiza metadatos. Retorna NUEVA colección.
     */
    withMetadata(options: Partial<Pick<TokenCollectionOptions, 'name' | 'description' | 'version'>>): TokenCollection;
    /**
     * Obtiene todos los tokens (copia defensiva).
     */
    all(): readonly DesignToken[];
    /**
     * Alias de all() para compatibilidad.
     * @deprecated Usar all() en su lugar.
     */
    getAll(): readonly DesignToken[];
    /**
     * Obtiene tokens por prefijo de path (e.g., 'color.brand').
     */
    getByPath(pathPrefix: string): readonly DesignToken[];
    /**
     * Filtra tokens según criterios.
     */
    filter(criteria: TokenFilter): readonly DesignToken[];
    /**
     * Retorna nueva colección con solo los tokens que cumplen criterios.
     */
    filterToCollection(criteria: TokenFilter): TokenCollection;
    /**
     * Encuentra el primer token que cumple criterios.
     */
    find(criteria: TokenFilter): DesignToken | undefined;
    /**
     * Verifica si algún token cumple criterios.
     */
    some(criteria: TokenFilter): boolean;
    /**
     * Verifica si todos los tokens cumplen criterios.
     */
    every(criteria: TokenFilter): boolean;
    /**
     * Obtiene tokens por tipo.
     */
    byType(type: TokenType): readonly DesignToken[];
    /**
     * Obtiene tokens por categoría.
     */
    byCategory(category: TokenCategory): readonly DesignToken[];
    /**
     * Obtiene tokens por namespace.
     */
    byNamespace(namespace: string): readonly DesignToken[];
    /**
     * Obtiene tokens por componente.
     */
    byComponent(component: string): readonly DesignToken[];
    /**
     * Agrupa tokens por tipo.
     */
    groupByType(): ReadonlyMap<TokenType, readonly DesignToken[]>;
    /**
     * Agrupa tokens por categoría.
     */
    groupByCategory(): ReadonlyMap<TokenCategory, readonly DesignToken[]>;
    /**
     * Agrupa tokens por namespace.
     */
    groupByNamespace(): ReadonlyMap<string, readonly DesignToken[]>;
    /**
     * Construye estructura jerárquica desde paths.
     */
    toHierarchy(): Readonly<TokenHierarchy>;
    /**
     * Exporta la colección en el formato especificado.
     */
    export(options: ExportOptions): string;
    /**
     * Exporta a CSS variables.
     */
    private exportToCss;
    /**
     * Exporta a SCSS variables.
     */
    private exportToScss;
    /**
     * Exporta a JSON.
     */
    private exportToJson;
    /**
     * Exporta a formato W3C DTCG.
     */
    private exportToW3C;
    /**
     * Exporta a configuración Tailwind.
     */
    private exportToTailwind;
    /**
     * Exporta a formato Figma Tokens.
     */
    private exportToFigma;
    /**
     * Valida la colección.
     */
    validate(): ValidationResult;
    /**
     * Obtiene estadísticas de la colección.
     */
    stats(): CollectionStats;
    /**
     * Itera sobre tokens.
     */
    forEach(callback: (token: DesignToken) => void): void;
    /**
     * Mapea tokens a nuevo tipo.
     */
    map<T>(callback: (token: DesignToken) => T): readonly T[];
    /**
     * Reduce tokens.
     */
    reduce<T>(callback: (acc: T, token: DesignToken) => T, initial: T): T;
    /**
     * Iterator support.
     */
    [Symbol.iterator](): Iterator<DesignToken>;
    /**
     * Compara dos colecciones por contenido.
     */
    equals(other: TokenCollection): boolean;
    /**
     * Calcula diff entre colecciones.
     */
    diff(other: TokenCollection): {
        readonly added: readonly string[];
        readonly removed: readonly string[];
        readonly changed: readonly string[];
    };
    toJSON(): Readonly<{
        name: string;
        description: string;
        version: string;
        createdAt: string;
        updatedAt: string;
        tokens: readonly object[];
    }>;
    /**
     * Reconstituye desde JSON.
     */
    static fromJSON(json: {
        name: string;
        description?: string;
        version?: string;
        tokens: unknown[];
    }, tokenDeserializer: (data: unknown) => DesignToken): TokenCollection;
}

export { type CollectionStats as C, TokenCollection as T, type ValidationError as V, type TokenFilter as a, type TokenHierarchy as b, type ValidationWarning as c };
