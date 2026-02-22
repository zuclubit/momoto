/**
 * @fileoverview TokenEnrichmentService - Generate Enriched Tokens (MOMOTO INTELLIGENCE)
 *
 * Creates color tokens with real Momoto decision metadata:
 * - qualityScore: Evaluated via Momoto WASM QualityScorer (primary) or
 *                 OKLCH perceptual scoring (fallback when WASM unavailable)
 * - confidence:   Derived from decision clarity and color properties
 * - reason:       Human-readable explanation of the decision
 *
 * Architecture:
 * 1. Primary path: Momoto WASM intelligence (agent.scorePair)
 * 2. Fallback path: OKLCH perceptual analysis in TypeScript
 *    (uses actual color math, not stub values)
 *
 * @module momoto-ui/domain/tokens/services/TokenEnrichmentService
 * @version 3.0.0
 */

import type { PerceptualColor } from '../../perceptual/value-objects/PerceptualColor';
import type { TokenContext } from '../value-objects/DesignToken';
import type { MomotoColorDecision, MomotoDecisionMetadata } from '../value-objects/EnrichedToken';
import { MomotoBridge } from '../../../infrastructure/MomotoBridge';
import type { UIRole as UIRoleType } from '../../types';

// ============================================================================
// USAGE CONTEXT / COMPLIANCE TARGET constants
// These numeric values match the Rust enum variants in momoto-intelligence.
// ============================================================================

/**
 * Numeric indices for UsageContext enum in momoto-intelligence Rust crate.
 * Exported for use by callers that need raw WASM quality scoring.
 */
export const USAGE_CONTEXT = {
  BODY_TEXT: 0,
  LARGE_TEXT: 1,
  UI_COMPONENT: 2,
  DECORATION: 3,
} as const;

/**
 * Numeric indices for ComplianceTarget enum in momoto-intelligence Rust crate.
 * Exported for use by callers that need raw WASM quality scoring.
 */
export const COMPLIANCE_TARGET = {
  WCAG_AA: 0,
  WCAG_AAA: 1,
  APCA_LC60: 2,
  APCA_LC75: 3,
} as const;

// ============================================================================
// TYPES
// ============================================================================

export interface ColorDecisionInput {
  readonly color: PerceptualColor;
  readonly role?: UIRoleType;
  readonly context?: TokenContext;
  readonly description?: string;
  readonly background?: PerceptualColor;
}

interface LocalQualityResult {
  qualityScore: number;
  confidence: number;
  reason: string;
}

// ============================================================================
// SERVICE
// ============================================================================

/**
 * TokenEnrichmentService — Real Momoto color decision metadata.
 *
 * Primary: Uses Momoto WASM QualityScorer + WCAG contrast for precise
 * perceptual quality evaluation in OKLCH space.
 *
 * Fallback: When WASM is unavailable (CI, test without build), computes
 * quality from first principles using the Ottosson OKLCH model:
 * - Perceptual lightness appropriateness by role
 * - Chroma adequacy (saturation signal)
 * - Hue-based warmth categorization
 * - Estimated WCAG ratio via OKLCH luminance approximation
 */
export class TokenEnrichmentService {

  // ──────────────────────────────────────────────────────────────────────────
  // PRIMARY API
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Create a color decision with full Momoto metadata.
   *
   * Uses WASM when available, OKLCH fallback otherwise.
   */
  static async createColorDecision(
    input: ColorDecisionInput
  ): Promise<MomotoColorDecision> {
    const bgHex = input.background?.hex ?? '#FFFFFF';
    const fgHex = input.color.hex;

    // Try WASM path first
    let quality: LocalQualityResult;
    let accessibility: MomotoDecisionMetadata['accessibility'] | undefined;

    const wasmReady = await this.tryInitWasm();

    if (wasmReady) {
      quality = this.scoreViaWasm(fgHex, bgHex, input.role);
      if (input.background) {
        accessibility = this.accessibilityViaWasm(fgHex, bgHex);
      }
    } else {
      // Fallback: real OKLCH perceptual computation
      quality = this.scoreViaOklch(input.color, input.role);
      if (input.background) {
        accessibility = this.estimateAccessibility(input.color, input.background);
      }
    }

    const metadata: MomotoDecisionMetadata = {
      qualityScore: quality.qualityScore,
      confidence: quality.confidence,
      reason: quality.reason,
      sourceDecisionId: this.generateId(),
      accessibility,
    };

    return {
      color: input.color,
      metadata,
      context: input.context,
      description: input.description,
    };
  }

  /**
   * Batch create color decisions (parallel processing).
   */
  static async createColorDecisionsBatch(
    inputs: ColorDecisionInput[]
  ): Promise<MomotoColorDecision[]> {
    await this.tryInitWasm();
    return Promise.all(inputs.map(input => this.createColorDecision(input)));
  }

  // ──────────────────────────────────────────────────────────────────────────
  // WASM PATH
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Initialize WASM, returning true on success and false if unavailable.
   */
  private static async tryInitWasm(): Promise<boolean> {
    if (MomotoBridge.isReady()) return true;
    try {
      await MomotoBridge.init();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Score a color pair using Momoto WASM agent API.
   * Returns structured quality from WASM intelligence engine.
   */
  private static scoreViaWasm(
    fgHex: string,
    bgHex: string,
    role?: UIRoleType,
  ): LocalQualityResult {
    try {
      // Map UI role to agent context string
      const context = this.roleToContext(role);
      const target = 'wcag_aa';

      // agentScorePair returns JSON: { passes, overall, wcag_ratio, apca_lc, assessment }
      const raw = MomotoBridge.agent.scorePair(fgHex, bgHex, context, target);
      const data = JSON.parse(raw) as {
        passes: boolean;
        overall: number;
        wcag_ratio: number;
        apca_lc: number;
        assessment: string;
      };

      const qualityScore = Math.min(1, Math.max(0, data.overall));

      // Confidence based on margin from WCAG 4.5:1 threshold
      const margin = data.wcag_ratio / 4.5;
      const confidence = data.passes
        ? Math.min(0.98, 0.65 + (margin - 1) * 0.15)
        : Math.max(0.45, 0.65 - (1 - margin) * 0.2);

      const reason = [
        `${data.assessment} (Momoto WASM)`,
        `WCAG ${data.wcag_ratio.toFixed(1)}:1`,
        `APCA Lc ${Math.abs(data.apca_lc).toFixed(0)}`,
        data.passes ? '✓ AA' : '✗ AA',
      ].join('. ');

      return { qualityScore, confidence, reason };
    } catch {
      // WASM call failed — fall through to OKLCH computation
      return this.scoreViaOklch(undefined, role);
    }
  }

  /**
   * Get WCAG accessibility data via WASM contrast engine.
   */
  private static accessibilityViaWasm(
    fgHex: string,
    bgHex: string,
  ): MomotoDecisionMetadata['accessibility'] {
    try {
      const fg = MomotoBridge.color.fromHex(fgHex);
      const bg = MomotoBridge.color.fromHex(bgHex);
      const wcagRatio = MomotoBridge.contrast.wcagRatio(fg, bg);
      fg.free?.();
      bg.free?.();
      return {
        wcagRatio,
        passesAA: wcagRatio >= 4.5,
        passesAAA: wcagRatio >= 7.0,
      };
    } catch {
      return undefined;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // OKLCH FALLBACK PATH (real color math, not stubs)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Score color quality from OKLCH coordinates.
   *
   * Uses Ottosson's perceptually uniform model:
   * - L: lightness [0,1], perceptually linear
   * - C: chroma, [0, ~0.4 for sRGB]
   * - H: hue angle [0°, 360°]
   *
   * Quality criteria by role:
   * - accent/background: moderate L (0.3–0.75), C > 0.05 (vivid signal)
   * - text-primary: high contrast L (< 0.2 or > 0.85), low C
   * - surface: mid L (0.9–1.0 for light, 0.1–0.25 for dark)
   */
  private static scoreViaOklch(
    color: PerceptualColor | undefined,
    role?: UIRoleType,
  ): LocalQualityResult {
    if (!color) {
      return { qualityScore: 0.5, confidence: 0.5, reason: 'Default quality (no color data)' };
    }

    const { l, c, h } = color.oklch;
    const reasons: string[] = [`OKLCH(${l.toFixed(3)}, ${c.toFixed(3)}, ${h.toFixed(1)}°)`];

    let qualityScore: number;
    let confidence: number;

    switch (role) {
      case 'accent': {
        // Accent colors: vivid, readable saturation, mid-to-bright lightness
        const chromaScore = this.scoreInRange(c, 0.08, 0.35, 0.04, 0.40);
        const lightnessScore = this.scoreInRange(l, 0.35, 0.75, 0.20, 0.90);
        qualityScore = 0.4 * chromaScore + 0.4 * lightnessScore + 0.2;
        confidence = 0.70 + 0.15 * chromaScore;
        reasons.push(
          chromaScore > 0.7 ? 'Vivid chroma (brand signal)' : 'Low chroma (muted accent)',
          lightnessScore > 0.7 ? 'Optimal lightness' : 'Extreme lightness',
        );
        break;
      }

      case 'text-primary': {
        // Text: near-black or near-white, very low chroma for neutral readability
        const contrastPotential = l < 0.25 || l > 0.82
          ? 1.0
          : 1.0 - Math.abs(l - 0.53) * 1.5;
        const neutrality = Math.max(0, 1 - c * 8); // Low chroma = more neutral = better for text
        qualityScore = 0.6 * contrastPotential + 0.25 * neutrality + 0.15;
        confidence = 0.65 + 0.25 * contrastPotential;
        reasons.push(
          contrastPotential > 0.8 ? 'High contrast potential' : 'Insufficient contrast for body text',
          neutrality > 0.7 ? 'Neutral (readable)' : 'Chromatic text color',
        );
        break;
      }

      case 'text-secondary': {
        // Secondary text: slightly less contrast than primary
        const midContrast = l < 0.40 || l > 0.70
          ? 0.85
          : 0.5 + Math.abs(l - 0.55) * 1.2;
        qualityScore = 0.55 * midContrast + 0.20 * Math.max(0, 1 - c * 6) + 0.25;
        confidence = 0.60 + 0.20 * midContrast;
        reasons.push(midContrast > 0.7 ? 'Adequate secondary contrast' : 'Borderline contrast');
        break;
      }

      case 'surface': {
        // Surface/background colors: near-white or near-dark, low chroma
        const isLightSurface = l > 0.88;
        const isDarkSurface = l < 0.20;
        const surfaceScore = (isLightSurface || isDarkSurface) ? 0.9 : 0.4;
        const lowChromaBonus = Math.max(0, 1 - c * 12);
        qualityScore = 0.5 * surfaceScore + 0.3 * lowChromaBonus + 0.2;
        confidence = 0.65 + 0.20 * surfaceScore;
        reasons.push(
          isLightSurface ? 'Light surface (appropriate)' :
          isDarkSurface ? 'Dark surface (appropriate)' : 'Mid-tone surface (use with care)',
        );
        break;
      }

      case 'border': {
        // Borders: subtle, low chroma, mid-to-light lightness
        const borderLightnessScore = this.scoreInRange(l, 0.65, 0.90, 0.40, 0.97);
        const subtleChroma = Math.max(0, 1 - c * 15);
        qualityScore = 0.5 * borderLightnessScore + 0.3 * subtleChroma + 0.2;
        confidence = 0.60 + 0.20 * borderLightnessScore;
        reasons.push(borderLightnessScore > 0.6 ? 'Subtle border tone' : 'Bold border color');
        break;
      }

      case 'background': {
        // Background: functional, readable, good lightness
        const bgLightnessScore = this.scoreInRange(l, 0.30, 0.72, 0.15, 0.85);
        const chromaScore = this.scoreInRange(c, 0.06, 0.30, 0.02, 0.38);
        qualityScore = 0.35 * bgLightnessScore + 0.35 * chromaScore + 0.30;
        confidence = 0.65 + 0.15 * bgLightnessScore;
        reasons.push(`Background lightness ${(l * 100).toFixed(0)}%`);
        break;
      }

      default: {
        // General: use statistical model from OKLCH distribution
        // Colors in [0.3–0.8L, >0.05C] tend to be perceptually robust
        const generalL = this.scoreInRange(l, 0.30, 0.80, 0.10, 0.95);
        const generalC = Math.min(1, c * 5); // penalize grayscale
        qualityScore = 0.4 * generalL + 0.3 * generalC + 0.3;
        confidence = 0.60 + 0.15 * generalL;
        reasons.push('General perceptual evaluation');
        break;
      }
    }

    return {
      qualityScore: Math.min(1, Math.max(0, qualityScore)),
      confidence: Math.min(0.97, Math.max(0.50, confidence)),
      reason: reasons.join('. '),
    };
  }

  /**
   * Estimate WCAG accessibility without WASM.
   *
   * Uses the sRGB relative luminance formula (WCAG 2.x specification):
   * Y = 0.2126*R_lin + 0.7152*G_lin + 0.0722*B_lin
   * contrast = (Y_lighter + 0.05) / (Y_darker + 0.05)
   *
   * This gives exact WCAG ratios (identical to WASM path for sRGB colors).
   */
  private static estimateAccessibility(
    fg: PerceptualColor,
    bg: PerceptualColor,
  ): MomotoDecisionMetadata['accessibility'] {
    const fgY = this.srgbLuminance(fg.rgb.r, fg.rgb.g, fg.rgb.b);
    const bgY = this.srgbLuminance(bg.rgb.r, bg.rgb.g, bg.rgb.b);
    const lighter = Math.max(fgY, bgY);
    const darker = Math.min(fgY, bgY);
    const wcagRatio = (lighter + 0.05) / (darker + 0.05);
    return {
      wcagRatio,
      passesAA: wcagRatio >= 4.5,
      passesAAA: wcagRatio >= 7.0,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Score a value within a target range.
   * Returns 1.0 inside [idealMin, idealMax], decreasing to 0 at [absMin, absMax].
   */
  private static scoreInRange(
    value: number,
    idealMin: number,
    idealMax: number,
    absMin: number,
    absMax: number,
  ): number {
    if (value < absMin || value > absMax) return 0;
    if (value >= idealMin && value <= idealMax) return 1.0;
    if (value < idealMin) {
      return (value - absMin) / (idealMin - absMin);
    }
    return (absMax - value) / (absMax - idealMax);
  }

  /**
   * sRGB relative luminance per WCAG 2.x.
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  private static srgbLuminance(r: number, g: number, b: number): number {
    const toLinear = (c: number) => {
      const n = c / 255;
      return n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }

  /**
   * Map UIRole to agent context string used by Momoto WASM agent API.
   */
  private static roleToContext(role?: UIRoleType): string {
    switch (role) {
      case 'text-primary':
      case 'text-secondary':
        return 'body_text';
      case 'accent':
      case 'background':
      case 'surface':
        return 'ui_component';
      case 'border':
        return 'large_text';
      default:
        return 'ui_component';
    }
  }

  /**
   * Generate a unique decision ID compatible with browser and Node.js.
   */
  private static generateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 9);
    if (typeof globalThis.crypto?.randomUUID === 'function') {
      return `momoto-${globalThis.crypto.randomUUID()}`;
    }
    return `momoto-${timestamp}-${random}`;
  }
}

export default TokenEnrichmentService;
