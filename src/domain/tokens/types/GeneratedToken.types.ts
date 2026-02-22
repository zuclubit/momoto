/**
 * @fileoverview Generated Token Types - Layer 2 (Momoto-Enriched Output)
 *
 * FASE 12: Token System Enhancement
 *
 * Generated tokens are the OUTPUT of TokenThemeGenerator.
 * They include complete TokenTheme with all state variants and
 * full Momoto metadata.
 *
 * CONTRACT:
 * - This is OUTPUT from token generation
 * - ALL tokens are EnrichedToken with Momoto metadata
 * - Complete state coverage (hover, focus, active, disabled)
 *
 * @module momoto-ui/domain/tokens/types/GeneratedToken
 * @version 1.0.0
 */

import type { TokenTheme } from '../../../components/primitives/tokens/TokenTheme.types';

// ============================================================================
// GENERATION METADATA
// ============================================================================

/**
 * Metadata about token theme generation.
 */
export interface GenerationMetadata {
  /** Theme version (from design intent) */
  version: string;

  /** Timestamp of generation */
  generatedAt: string;

  /** Generator identifier */
  generatedBy: 'TokenThemeGenerator';

  /** Hash of source design intent (for change detection) */
  sourceIntentHash: string;

  /** Momoto WASM version used */
  momotoVersion: string;

  /** Number of Momoto decisions made */
  decisionCount: number;

  /** Generation duration (ms) */
  generationTimeMs: number;
}

// ============================================================================
// QUALITY REPORT
// ============================================================================

/**
 * Token with low quality score.
 */
export interface LowQualityToken {
  /** Token path (e.g., 'button.primary.background') */
  path: string;

  /** Token name */
  name: string;

  /** Quality score */
  score: number;

  /** Momoto reason */
  reason: string;

  /** Momoto decision ID */
  decisionId: string;
}

/**
 * Text/background pair failing accessibility.
 */
export interface AccessibilityFailure {
  /** Foreground token path */
  foreground: string;

  /** Background token path */
  background: string;

  /** Actual WCAG ratio */
  wcagRatio: number;

  /** Required WCAG ratio */
  requiredRatio: number;

  /** Compliance level failed (AA or AAA) */
  level: 'AA' | 'AAA';
}

/**
 * Quality report for generated theme.
 */
export interface QualityReport {
  /** Overall quality score (average of all tokens) */
  overallScore: number;

  /** Overall confidence (average of all tokens) */
  overallConfidence: number;

  /** Total tokens generated */
  totalTokens: number;

  /** Tokens with quality < 0.5 */
  lowQualityTokens: LowQualityToken[];

  /** Tokens with confidence < 0.5 */
  lowConfidenceTokens: Array<{
    path: string;
    name: string;
    confidence: number;
  }>;

  /** Text/background pairs failing WCAG AA */
  accessibilityFailures: AccessibilityFailure[];

  /** Distribution of quality scores */
  qualityDistribution: {
    high: number;    // >= 0.8
    medium: number;  // 0.5-0.8
    low: number;     // < 0.5
  };
}

// ============================================================================
// GENERATED TOKEN THEME
// ============================================================================

/**
 * Complete generated token theme (output of TokenThemeGenerator).
 *
 * This is the result of transforming DesignIntent into complete
 * TokenTheme with full Momoto enrichment.
 *
 * @example
 * ```typescript
 * const generated: GeneratedTokenTheme = await generator.generate(intent);
 *
 * // Access metadata
 * console.log(generated.metadata.version);         // '1.0.0'
 * console.log(generated.metadata.decisionCount);   // 243
 *
 * // Access theme
 * const theme = generated.theme;
 * const primaryBg = theme.button.primary.background; // EnrichedToken
 *
 * // Check quality
 * if (generated.quality.overallScore < 0.8) {
 *   console.warn('Theme has low quality tokens:', generated.quality.lowQualityTokens);
 * }
 *
 * // Check accessibility
 * if (generated.quality.accessibilityFailures.length > 0) {
 *   console.error('Theme has accessibility failures:', generated.quality.accessibilityFailures);
 * }
 * ```
 */
export interface GeneratedTokenTheme {
  /** Generation metadata */
  metadata: GenerationMetadata;

  /** Complete token theme (ALL states generated) */
  theme: TokenTheme;

  /** Quality report */
  quality: QualityReport;
}

// ============================================================================
// STATE VARIANT CONFIGURATION
// ============================================================================

/**
 * Configuration for state variant generation.
 *
 * These are CONSTANTS for Momoto operations, NOT heuristics.
 * The amounts specify how much to lighten/darken/desaturate,
 * but the OPERATION itself (lighten, darken) is from Momoto WASM.
 */
export interface StateVariantConfig {
  /** Hover state configuration */
  hover: {
    /** Amount to lighten (0-1) */
    lighten?: number;

    /** Amount to darken (0-1) */
    darken?: number;

    /** Amount to saturate (0-1) */
    saturate?: number;
  };

  /** Focus state configuration */
  focus: {
    lighten?: number;
    darken?: number;
    saturate?: number;
  };

  /** Active/pressed state configuration */
  active: {
    lighten?: number;
    darken?: number;
    desaturate?: number;
  };

  /** Disabled state configuration */
  disabled: {
    lighten?: number;
    darken?: number;
    desaturate?: number;
  };
}

/**
 * Default state variant configuration.
 *
 * These values are CONSTANTS based on design system conventions,
 * NOT perceptual heuristics.
 */
export const DEFAULT_STATE_VARIANTS: StateVariantConfig = {
  hover: {
    lighten: 0.05, // 5% lighter on hover
  },
  focus: {
    lighten: 0.03, // 3% lighter on focus
  },
  active: {
    darken: 0.05, // 5% darker when pressed
  },
  disabled: {
    desaturate: 0.5, // 50% less saturated
    lighten: 0.2,    // 20% lighter
  },
};

// ============================================================================
// GENERATOR OPTIONS
// ============================================================================

/**
 * Options for TokenThemeGenerator.
 */
export interface GeneratorOptions {
  /** State variant configuration (defaults to DEFAULT_STATE_VARIANTS) */
  stateVariants?: Partial<StateVariantConfig>;

  /** Quality threshold for warnings (not blocking) */
  qualityWarningThreshold?: number;

  /** Confidence threshold for warnings (not blocking) */
  confidenceWarningThreshold?: number;

  /** Whether to generate accessibility metadata */
  includeAccessibility?: boolean;

  /** Progress callback for long-running generation */
  onProgress?: (progress: GenerationProgress) => void;
}

/**
 * Progress information during generation.
 */
export interface GenerationProgress {
  /** Current step */
  step: 'colors' | 'components' | 'states' | 'validation';

  /** Current progress (0-100) */
  progress: number;

  /** Current token being processed */
  currentToken?: string;

  /** Total decisions made so far */
  decisionsCount: number;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default GeneratedTokenTheme;

/**
 * LAYER 2 CONTRACT:
 *
 * Generated tokens are the OUTPUT of Momoto intelligence.
 *
 * ✅ CONTAINS:
 * - Complete TokenTheme with ALL states
 * - Full Momoto metadata (qualityScore, confidence, reason, etc.)
 * - Accessibility metrics (WCAG ratios, AA/AAA pass)
 * - Quality report
 * - Generation metadata
 *
 * ❌ DOES NOT CONTAIN:
 * - Local heuristics (all decisions from Momoto)
 * - Hardcoded defaults (all tokens explicitly generated)
 * - Fallbacks (errors are explicit, not silent)
 *
 * IMPORTANT:
 * - State variants use Momoto WASM operations (lighten, darken, desaturate)
 * - Amounts are CONSTANTS (not decisions)
 * - Full enrichment via TokenEnrichmentService for each state
 * - Complete traceability via sourceDecisionId
 */
