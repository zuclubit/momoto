/**
 * @fileoverview GenerateEnrichedComponentTokens Use Case (FASE 4)
 *
 * NEW use case that generates component tokens WITH Momoto decision metadata.
 *
 * REPLACES: GenerateComponentTokens (which creates tokens without metadata)
 *
 * BEFORE (❌ OLD):
 * ```typescript
 * const useCase = new GenerateComponentTokens();
 * const result = await useCase.execute({
 *   componentName: 'button',
 *   brandColorHex: '#3B82F6',
 *   intent: 'action'
 * });
 * // Tokens created without qualityScore, confidence, reason
 * ```
 *
 * AFTER (✅ NEW):
 * ```typescript
 * const useCase = new GenerateEnrichedComponentTokens();
 * const result = await useCase.execute({
 *   componentName: 'button',
 *   brandColorHex: '#3B82F6',
 *   intent: 'action'
 * });
 * // All tokens have qualityScore, confidence, reason from Momoto
 * // result.enrichedTokens: EnrichedToken[]
 * ```
 *
 * @module momoto-ui/application/use-cases/GenerateEnrichedComponentTokens
 * @version 1.0.0
 */

import type { Result, ComponentVariant, UIState as UIStateType, UIRole as UIRoleType } from '../../domain/types';
import { success, failure } from '../../domain/types';
import { PerceptualColor } from '../../domain/perceptual';
import { ComponentIntent } from '../../domain/ux';
import { EnrichedToken } from '../../domain/tokens/value-objects/EnrichedToken';
import { TokenEnrichmentService } from '../../domain/tokens/services/TokenEnrichmentService';
import type { TokenRepositoryPort } from '../ports/outbound/TokenRepositoryPort';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Input for the use case.
 */
export interface GenerateEnrichedComponentTokensInput {
  /** Nombre del componente */
  readonly componentName: string;
  /** Color de marca en hex */
  readonly brandColorHex: string;
  /** Intención del componente */
  readonly intent: string;
  /** UI role para el color principal */
  readonly role?: UIRoleType;
  /** Variantes a generar */
  readonly variants?: ComponentVariant[];
  /** Estados a generar */
  readonly states?: UIStateType[];
  /** Namespace para los tokens */
  readonly namespace?: string;
}

/**
 * Output del use case.
 */
export interface GenerateEnrichedComponentTokensOutput {
  /** Tokens enriquecidos generados */
  readonly enrichedTokens: EnrichedToken[];

  /** Estadísticas de generación */
  readonly stats: {
    readonly totalTokens: number;
    readonly highQualityTokens: number;
    readonly mediumQualityTokens: number;
    readonly lowQualityTokens: number;
    readonly avgQualityScore: number;
    readonly avgConfidence: number;
  };

  /** CSS generado (from enriched tokens) */
  readonly css: string;

  /** W3C tokens con metadata */
  readonly w3cTokens: string;
}

// ============================================================================
// USE CASE
// ============================================================================

/**
 * GenerateEnrichedComponentTokens - Genera tokens con metadata de Momoto.
 *
 * Este use case orquesta la generación de tokens enriquecidos que incluyen
 * metadata de decisión (qualityScore, confidence, reason) de Momoto WASM.
 *
 * @example
 * ```typescript
 * const useCase = new GenerateEnrichedComponentTokens();
 *
 * const result = await useCase.execute({
 *   componentName: 'button',
 *   brandColorHex: '#3B82F6',
 *   intent: 'action',
 *   role: 'accent',
 *   states: ['idle', 'hover', 'active', 'disabled'],
 * });
 *
 * if (result.success) {
 *   console.log(`Generated ${result.value.stats.totalTokens} enriched tokens`);
 *   console.log(`Avg quality: ${result.value.stats.avgQualityScore.toFixed(2)}`);
 *   console.log(`High quality: ${result.value.stats.highQualityTokens}`);
 *
 *   // All tokens have metadata
 *   result.value.enrichedTokens.forEach(token => {
 *     console.log(`${token.name}: ${token.reason}`);
 *   });
 * }
 * ```
 */
export class GenerateEnrichedComponentTokens {
  // ──────────────────────────────────────────────────────────────────────────
  // DEPENDENCIES
  // ──────────────────────────────────────────────────────────────────────────

  private readonly tokenRepository?: TokenRepositoryPort;

  // ──────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ──────────────────────────────────────────────────────────────────────────

  constructor(tokenRepository?: TokenRepositoryPort) {
    this.tokenRepository = tokenRepository;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Ejecuta el use case.
   */
  async execute(
    input: GenerateEnrichedComponentTokensInput
  ): Promise<Result<GenerateEnrichedComponentTokensOutput, Error>> {
    try {
      // 1. Validar input
      const validationResult = this.validateInput(input);
      if (!validationResult.success) {
        return failure(validationResult.error);
      }

      // 2. Crear color perceptual
      const colorResult = await PerceptualColor.tryFromHex(input.brandColorHex);
      if (!colorResult.success) {
        return failure(new Error(`Invalid brand color: ${colorResult.error.message}`));
      }
      const brandColor = colorResult.value;

      // 3. Obtener intención
      const intentResult = ComponentIntent.from(input.intent);
      if (!intentResult.success) {
        return failure(new Error(`Invalid intent: ${intentResult.error.message}`));
      }
      const intent = intentResult.value;

      // 4. Generar token base con metadata de Momoto
      const baseTokenName = `${input.componentName}.primary.background`;
      const baseDecision = await TokenEnrichmentService.createColorDecision({
        color: brandColor,
        role: input.role || 'accent',
        context: {
          component: input.componentName,
          intent: intent.value,
        },
        description: `Primary background color for ${input.componentName} component`,
      });

      const baseToken = EnrichedToken.fromMomotoDecision(baseTokenName, baseDecision);
      const enrichedTokens: EnrichedToken[] = [baseToken];

      // 5. Generar estados si se especifican
      if (input.states && input.states.length > 0) {
        const stateTokens = await this.generateStateTokens(
          input.componentName,
          brandColor,
          input.states,
          { component: input.componentName, intent: intent.value }
        );
        enrichedTokens.push(...stateTokens);
      }

      // 6. Guardar en repositorio si está disponible
      // TODO: Implement TokenRepositoryPort.saveEnrichedTokens()
      // if (this.tokenRepository) {
      //   await this.tokenRepository.saveEnrichedTokens(enrichedTokens);
      // }

      // 7. Generar outputs
      const stats = this.calculateStats(enrichedTokens);
      const css = this.generateCSS(enrichedTokens, input.namespace);
      const w3cTokens = this.generateW3C(enrichedTokens);

      return success({
        enrichedTokens,
        stats,
        css,
        w3cTokens,
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error('Unknown error during enriched token generation')
      );
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Valida el input del use case.
   */
  private validateInput(input: GenerateEnrichedComponentTokensInput): Result<void, Error> {
    if (!input.componentName || input.componentName.trim().length === 0) {
      return failure(new Error('Component name is required'));
    }

    if (!input.brandColorHex || input.brandColorHex.trim().length === 0) {
      return failure(new Error('Brand color hex is required'));
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(input.brandColorHex)) {
      return failure(new Error('Brand color must be a valid 6-digit hex color'));
    }

    if (!input.intent || input.intent.trim().length === 0) {
      return failure(new Error('Intent is required'));
    }

    return success(undefined);
  }

  /**
   * Genera tokens de estado con metadata de Momoto.
   *
   * ✅ FASE 9: Now uses Momoto WASM color operations (lighten, darken, desaturate).
   * All state variations are perceptually uniform in OKLCH space.
   */
  private async generateStateTokens(
    componentName: string,
    baseColor: PerceptualColor,
    states: UIStateType[],
    context: any
  ): Promise<EnrichedToken[]> {
    const tokens: EnrichedToken[] = [];

    for (const state of states) {
      // Derivar color para el estado (delegado a Momoto WASM)
      let stateColor: PerceptualColor;
      switch (state) {
        case 'hover':
          // ✅ Delegates to Momoto WASM lighten()
          stateColor = await baseColor.lighten(0.05);
          break;
        case 'active':
          // ✅ Delegates to Momoto WASM darken()
          stateColor = await baseColor.darken(0.05);
          break;
        case 'disabled':
          // ✅ Delegates to Momoto WASM desaturate()
          stateColor = await baseColor.desaturate(0.5);
          break;
        case 'focus':
          stateColor = baseColor; // Same as idle
          break;
        case 'idle':
        default:
          stateColor = baseColor;
          break;
      }

      // Crear decisión con metadata
      const decision = await TokenEnrichmentService.createColorDecision({
        color: stateColor,
        role: 'accent',
        context: { ...context, state },
        description: `${state} state color for ${componentName}`,
      });

      // Crear token enriquecido
      const tokenName = `${componentName}.primary.${state}`;
      const token = EnrichedToken.fromMomotoDecision(tokenName, decision);

      tokens.push(token);
    }

    return tokens;
  }

  /**
   * Calcula estadísticas de los tokens enriquecidos.
   */
  private calculateStats(tokens: EnrichedToken[]) {
    const totalTokens = tokens.length;
    const highQualityTokens = tokens.filter(t => t.isHighQuality).length;
    const mediumQualityTokens = tokens.filter(t => t.isMediumQuality).length;
    const lowQualityTokens = tokens.filter(t => t.isLowQuality).length;

    const avgQualityScore = tokens.reduce((sum, t) => sum + t.qualityScore, 0) / totalTokens;
    const avgConfidence = tokens.reduce((sum, t) => sum + t.confidence, 0) / totalTokens;

    return {
      totalTokens,
      highQualityTokens,
      mediumQualityTokens,
      lowQualityTokens,
      avgQualityScore,
      avgConfidence,
    };
  }

  /**
   * Genera CSS de los tokens enriquecidos.
   */
  private generateCSS(tokens: EnrichedToken[], namespace?: string): string {
    const prefix = namespace ? `${namespace}-` : '';
    const variables = tokens.map(t => {
      const cssVar = t.toCssVariable();
      return prefix ? cssVar.replace('--', `--${prefix}`) : cssVar;
    });

    return `:root {\n  ${variables.join('\n  ')}\n}`;
  }

  /**
   * Genera W3C tokens con metadata.
   */
  private generateW3C(tokens: EnrichedToken[]): string {
    const w3cTokens = tokens.reduce((acc, token) => {
      acc[token.name] = token.toW3CWithMetadata();
      return acc;
    }, {} as Record<string, any>);

    return JSON.stringify(w3cTokens, null, 2);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default GenerateEnrichedComponentTokens;

/**
 * MIGRATION GUIDE:
 *
 * OLD (GenerateComponentTokens):
 * ```typescript
 * import { GenerateComponentTokens } from '@/application/use-cases/GenerateComponentTokens';
 *
 * const useCase = new GenerateComponentTokens();
 * const result = await useCase.execute({
 *   componentName: 'button',
 *   brandColorHex: '#3B82F6',
 *   intent: 'action',
 * });
 *
 * // result.collection: TokenCollection (no metadata)
 * ```
 *
 * NEW (GenerateEnrichedComponentTokens):
 * ```typescript
 * import { GenerateEnrichedComponentTokens } from '@/application/use-cases/GenerateEnrichedComponentTokens';
 *
 * const useCase = new GenerateEnrichedComponentTokens();
 * const result = await useCase.execute({
 *   componentName: 'button',
 *   brandColorHex: '#3B82F6',
 *   intent: 'action',
 *   role: 'accent', // NEW: specify role
 * });
 *
 * // result.enrichedTokens: EnrichedToken[] (with metadata)
 * result.value.enrichedTokens.forEach(token => {
 *   console.log(`${token.name}:`);
 *   console.log(`  Quality: ${token.qualityScore.toFixed(2)}`);
 *   console.log(`  Confidence: ${token.confidence.toFixed(2)}`);
 *   console.log(`  Reason: ${token.reason}`);
 * });
 *
 * console.log(`Avg quality: ${result.value.stats.avgQualityScore.toFixed(2)}`);
 * console.log(`High quality tokens: ${result.value.stats.highQualityTokens}/${result.value.stats.totalTokens}`);
 * ```
 *
 * BENEFITS:
 * - ✅ All tokens have qualityScore, confidence, reason
 * - ✅ Decisions traceable to Momoto WASM (sourceDecisionId)
 * - ✅ Quality metrics available (highQualityTokens, avgQualityScore)
 * - ✅ W3C export includes decision metadata
 * - ✅ Contract compliant: "Every decision must have qualityScore, confidence, reason"
 */
