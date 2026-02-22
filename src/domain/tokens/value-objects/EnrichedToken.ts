/**
 * @fileoverview EnrichedToken - Token with Momoto Decision Metadata
 *
 * FASE 4: Token Enrichment (QUALITY + EXPLAINABILITY)
 *
 * Extends DesignToken with decision metadata from Momoto WASM:
 * - qualityScore: How good is this color decision (0-1)
 * - confidence: How confident is the decision (0-1)
 * - reason: Why this decision was made (human-readable)
 * - sourceDecisionId: Traceability to WASM decision
 *
 * BEFORE (❌ VIOLATION):
 * ```typescript
 * const token = DesignToken.color('button.bg', color);
 * // No metadata, no traceability, no explainability
 * ```
 *
 * AFTER (✅ CORRECT):
 * ```typescript
 * const token = await EnrichedToken.fromMomotoDecision('button.bg', decision);
 * // token.qualityScore: 0.92
 * // token.confidence: 0.95
 * // token.reason: "OKLCH(0.6, 0.15, 240) provides optimal brand signaling"
 * // token.sourceDecisionId: "momoto-wasm-decision-uuid"
 * ```
 *
 * @module momoto-ui/domain/tokens/value-objects/EnrichedToken
 * @version 1.0.0
 */

import { DesignToken, type TokenContext } from './DesignToken';
import type { PerceptualColor } from '../../perceptual/value-objects/PerceptualColor';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Decision metadata from Momoto WASM.
 *
 * Every color decision must include this metadata for explainability.
 */
export interface MomotoDecisionMetadata {
  /** Quality score of the decision (0-1, where 1 is optimal) */
  readonly qualityScore: number;

  /** Confidence in the decision (0-1, where 1 is very confident) */
  readonly confidence: number;

  /** Human-readable reason for this decision */
  readonly reason: string;

  /** Unique ID of the source decision (for traceability) */
  readonly sourceDecisionId: string;

  /** Optional WCAG/APCA metrics if this is a text/background pair */
  readonly accessibility?: {
    readonly wcagRatio?: number;
    readonly apcaContrast?: number;
    readonly passesAA?: boolean;
    readonly passesAAA?: boolean;
  };
}

/**
 * Color decision from Momoto WASM.
 *
 * Used to create EnrichedToken with full metadata.
 */
export interface MomotoColorDecision {
  /** The decided color */
  readonly color: PerceptualColor;

  /** Decision metadata */
  readonly metadata: MomotoDecisionMetadata;

  /** Context of the decision */
  readonly context?: TokenContext;

  /** Description of the token */
  readonly description?: string;
}

// ============================================================================
// ENRICHED TOKEN
// ============================================================================

/**
 * EnrichedToken - DesignToken with Momoto decision metadata.
 *
 * This class wraps a DesignToken and adds decision metadata from Momoto WASM.
 * It ensures that every color token can explain:
 * - WHY it was chosen (reason)
 * - HOW good it is (qualityScore)
 * - HOW confident we are (confidence)
 * - WHERE it came from (sourceDecisionId)
 *
 * This satisfies the contract requirement:
 * > "Every decision must have: qualityScore, confidence, reason"
 *
 * @example
 * ```typescript
 * // Create from Momoto decision
 * const decision: MomotoColorDecision = {
 *   color: await PerceptualColor.fromHex('#3B82F6'),
 *   metadata: {
 *     qualityScore: 0.92,
 *     confidence: 0.95,
 *     reason: "OKLCH(0.6, 0.15, 240) provides optimal brand signaling with high chroma",
 *     sourceDecisionId: "momoto-wasm-decision-uuid-123",
 *   },
 *   context: { role: 'accent', component: 'button' },
 * };
 *
 * const token = EnrichedToken.fromMomotoDecision('button.primary.background', decision);
 *
 * // Access metadata
 * console.log(token.qualityScore); // 0.92
 * console.log(token.confidence); // 0.95
 * console.log(token.reason); // "OKLCH(0.6, 0.15, 240)..."
 * console.log(token.isHighQuality); // true
 * console.log(token.isHighConfidence); // true
 *
 * // Export with metadata
 * const w3c = token.toW3CWithMetadata();
 * // Includes $extensions['com.momoto-ui'].decision with all metadata
 * ```
 */
export class EnrichedToken {
  // ──────────────────────────────────────────────────────────────────────────
  // PRIVATE STATE
  // ──────────────────────────────────────────────────────────────────────────

  /** The underlying DesignToken */
  private readonly _token: DesignToken;

  /** Decision metadata from Momoto */
  private readonly _metadata: MomotoDecisionMetadata;

  // ──────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private - use static factories)
  // ──────────────────────────────────────────────────────────────────────────

  private constructor(token: DesignToken, metadata: MomotoDecisionMetadata) {
    this._token = token;
    this._metadata = metadata;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Create EnrichedToken from Momoto color decision.
   *
   * This is the PRIMARY way to create enriched tokens.
   * It ensures all metadata is captured.
   */
  static fromMomotoDecision(
    name: string,
    decision: MomotoColorDecision
  ): EnrichedToken {
    // Create base DesignToken
    const token = DesignToken.color(
      name,
      decision.color,
      decision.context,
      decision.description
    );

    // Wrap with metadata
    return new EnrichedToken(token, decision.metadata);
  }

  /**
   * Create EnrichedToken from existing DesignToken + metadata.
   *
   * Useful when you have a DesignToken and want to enrich it later.
   */
  static enrich(
    token: DesignToken,
    metadata: MomotoDecisionMetadata
  ): EnrichedToken {
    return new EnrichedToken(token, metadata);
  }

  /**
   * Create EnrichedToken with default/placeholder metadata.
   *
   * ⚠️ USE SPARINGLY - This is for migration/fallback only.
   * All production tokens should come from Momoto decisions.
   */
  static withDefaultMetadata(
    token: DesignToken,
    reason: string = 'Legacy token without Momoto decision'
  ): EnrichedToken {
    const metadata: MomotoDecisionMetadata = {
      qualityScore: 0.5, // Unknown quality
      confidence: 0.3,   // Low confidence
      reason,
      sourceDecisionId: 'legacy-token',
    };
    return new EnrichedToken(token, metadata);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GETTERS - Token Properties (Delegated)
  // ──────────────────────────────────────────────────────────────────────────

  /** Underlying DesignToken */
  get token(): DesignToken { return this._token; }

  /** Token name */
  get name(): string { return this._token.name; }

  /** Token value */
  get value() { return this._token.value; }

  /** Token type */
  get type() { return this._token.type; }

  /** Token category */
  get category() { return this._token.category; }

  /** Token description */
  get description(): string { return this._token.description; }

  /** Token context */
  get context() { return this._token.context; }

  /** Token provenance */
  get provenance() { return this._token.provenance; }

  /** CSS variable name */
  get cssVariableName(): string { return this._token.cssVariableName; }

  // ──────────────────────────────────────────────────────────────────────────
  // GETTERS - Decision Metadata (NEW)
  // ──────────────────────────────────────────────────────────────────────────

  /** Quality score (0-1) */
  get qualityScore(): number { return this._metadata.qualityScore; }

  /** Confidence (0-1) */
  get confidence(): number { return this._metadata.confidence; }

  /** Human-readable reason */
  get reason(): string { return this._metadata.reason; }

  /** Source decision ID */
  get sourceDecisionId(): string { return this._metadata.sourceDecisionId; }

  /** Accessibility metrics (if available) */
  get accessibility() { return this._metadata.accessibility; }

  /** Full metadata object */
  get metadata(): MomotoDecisionMetadata { return this._metadata; }

  // ──────────────────────────────────────────────────────────────────────────
  // PREDICATES - Quality Assessment
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Is this a high-quality decision? (score >= 0.8)
   */
  get isHighQuality(): boolean {
    return this._metadata.qualityScore >= 0.8;
  }

  /**
   * Is this a medium-quality decision? (0.5 <= score < 0.8)
   */
  get isMediumQuality(): boolean {
    return this._metadata.qualityScore >= 0.5 && this._metadata.qualityScore < 0.8;
  }

  /**
   * Is this a low-quality decision? (score < 0.5)
   */
  get isLowQuality(): boolean {
    return this._metadata.qualityScore < 0.5;
  }

  /**
   * Is this a high-confidence decision? (confidence >= 0.8)
   */
  get isHighConfidence(): boolean {
    return this._metadata.confidence >= 0.8;
  }

  /**
   * Is this a medium-confidence decision? (0.5 <= confidence < 0.8)
   */
  get isMediumConfidence(): boolean {
    return this._metadata.confidence >= 0.5 && this._metadata.confidence < 0.8;
  }

  /**
   * Is this a low-confidence decision? (confidence < 0.5)
   */
  get isLowConfidence(): boolean {
    return this._metadata.confidence < 0.5;
  }

  /**
   * Does this token come from a Momoto decision?
   * (vs being a legacy/default token)
   */
  get isMomotoDecision(): boolean {
    return this._metadata.sourceDecisionId !== 'legacy-token';
  }

  /**
   * Does this token pass WCAG AA? (if accessibility metrics available)
   */
  get passesWCAG_AA(): boolean {
    return this._metadata.accessibility?.passesAA ?? false;
  }

  /**
   * Does this token pass WCAG AAA? (if accessibility metrics available)
   */
  get passesWCAG_AAA(): boolean {
    return this._metadata.accessibility?.passesAAA ?? false;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EXPORT - CSS (Delegated to DesignToken)
  // ──────────────────────────────────────────────────────────────────────────

  toCssVariable(): string {
    return this._token.toCssVariable();
  }

  toCssValue(): string {
    return this._token.toCssValue();
  }

  toTailwindConfig() {
    return this._token.toTailwindConfig();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // EXPORT - W3C (Extended with Metadata)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Export to W3C format WITH decision metadata.
   *
   * This extends the standard W3C format with Momoto decision metadata
   * in the $extensions['com.momoto-ui'].decision field.
   */
  toW3CWithMetadata() {
    const baseW3C = this._token.toW3C();

    return {
      ...baseW3C,
      $extensions: {
        ...baseW3C.$extensions,
        'com.momoto-ui': {
          ...(baseW3C.$extensions?.['com.momoto-ui'] as object),
          decision: {
            qualityScore: this._metadata.qualityScore,
            confidence: this._metadata.confidence,
            reason: this._metadata.reason,
            sourceDecisionId: this._metadata.sourceDecisionId,
            accessibility: this._metadata.accessibility,
          },
        },
      },
    };
  }

  /**
   * Export to W3C format (without metadata, standard format).
   */
  toW3C() {
    return this._token.toW3C();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // SERIALIZATION
  // ──────────────────────────────────────────────────────────────────────────

  toString(): string {
    return `${this._token.toString()} (Q: ${this._metadata.qualityScore.toFixed(2)}, C: ${this._metadata.confidence.toFixed(2)})`;
  }

  toJSON(): object {
    return {
      token: this._token.toJSON(),
      metadata: {
        qualityScore: this._metadata.qualityScore,
        confidence: this._metadata.confidence,
        reason: this._metadata.reason,
        sourceDecisionId: this._metadata.sourceDecisionId,
        accessibility: this._metadata.accessibility,
      },
    };
  }

  /**
   * Export to detailed debug format.
   *
   * Useful for logging and debugging token decisions.
   */
  toDebugString(): string {
    const quality = this.isHighQuality ? 'HIGH' : this.isMediumQuality ? 'MEDIUM' : 'LOW';
    const confidence = this.isHighConfidence ? 'HIGH' : this.isMediumConfidence ? 'MEDIUM' : 'LOW';

    return `
EnrichedToken: ${this.name}
  Value: ${this._token.toCssValue()}
  Quality: ${quality} (${this._metadata.qualityScore.toFixed(2)})
  Confidence: ${confidence} (${this._metadata.confidence.toFixed(2)})
  Reason: ${this._metadata.reason}
  Source: ${this._metadata.sourceDecisionId}
  ${this._metadata.accessibility ? `WCAG AA: ${this._metadata.accessibility.passesAA ? 'PASS' : 'FAIL'}` : ''}
    `.trim();
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default EnrichedToken;

/**
 * USAGE EXAMPLES:
 *
 * 1. Create from Momoto decision (PRIMARY):
 * ```typescript
 * const decision = await TokenEnrichmentService.decideColor({
 *   role: 'accent',
 *   oklch: { l: 0.6, c: 0.15, h: 240 }
 * });
 * const token = EnrichedToken.fromMomotoDecision('button.bg', decision);
 * ```
 *
 * 2. Enrich existing token:
 * ```typescript
 * const baseToken = DesignToken.color('surface.bg', color);
 * const metadata = await getMomotoMetadata(color);
 * const enriched = EnrichedToken.enrich(baseToken, metadata);
 * ```
 *
 * 3. Check quality:
 * ```typescript
 * if (token.isLowQuality) {
 *   console.warn(`Low quality token: ${token.name}`);
 *   console.warn(`Reason: ${token.reason}`);
 * }
 * ```
 *
 * 4. Export with metadata:
 * ```typescript
 * const w3c = token.toW3CWithMetadata();
 * // {
 * //   $value: "#3B82F6",
 * //   $type: "color",
 * //   $extensions: {
 * //     "com.momoto-ui": {
 * //       decision: {
 * //         qualityScore: 0.92,
 * //         confidence: 0.95,
 * //         reason: "...",
 * //         sourceDecisionId: "uuid"
 * //       }
 * //     }
 * //   }
 * // }
 * ```
 */
