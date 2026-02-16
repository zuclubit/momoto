/**
 * @fileoverview TextColorDecisionService - Optimal Text Color Selection
 *
 * CRITICAL SERVICE que elimina hardcoded colors (#000, #fff) de componentes.
 *
 * ANTES (❌ VIOLACIÓN):
 * ```typescript
 * // En componente:
 * const textColor = bgColor.oklch.l > 0.6 ? '#000000' : '#ffffff';
 * ```
 *
 * DESPUÉS (✅ CORRECTO):
 * ```typescript
 * // En componente:
 * const decision = await TextColorDecisionService.getOptimalTextColor(bgColor);
 * const textColor = decision.color.hex;
 * ```
 *
 * PRINCIPIO:
 * - Momoto decide (WASM evalúa contraste)
 * - momoto-ui ejecuta (componente renderiza)
 * - CERO hardcoded colors
 *
 * @module momoto-ui/domain/perceptual/services/TextColorDecisionService
 * @version 1.0.0
 */

import type { PerceptualColor } from '../value-objects/PerceptualColor';
import { MomotoBridge, Color as WasmColor, WCAGMetric } from '../../../infrastructure/MomotoBridge';
import type { Result } from '../../types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Decisión de color de texto con metadata de calidad.
 *
 * CONTRATO: Toda decisión debe incluir:
 * - color: El color decidido
 * - qualityScore: Qué tan buena es la decisión (0-1)
 * - confidence: Confianza en la decisión (0-1)
 * - reason: Por qué se tomó esta decisión
 */
export interface TextColorDecision {
  /** Color óptimo para el texto */
  readonly color: PerceptualColor;
  /** Ratio de contraste WCAG alcanzado */
  readonly contrastRatio: number;
  /** Score de calidad (0-1, basado en contraste) */
  readonly qualityScore: number;
  /** Confianza en la decisión (0-1) */
  readonly confidence: number;
  /** Razón de la decisión */
  readonly reason: string;
  /** Si pasa WCAG AA */
  readonly passesAA: boolean;
  /** Si pasa WCAG AAA */
  readonly passesAAA: boolean;
}

// ============================================================================
// SERVICE
// ============================================================================

/**
 * TextColorDecisionService - Servicio de dominio para determinar color de texto óptimo.
 *
 * RESPONSABILIDAD:
 * - Delegar a Momoto WASM la evaluación de contraste
 * - Comparar negro vs blanco contra fondo
 * - Retornar decisión con metadata de calidad
 *
 * NO RESPONSABILIDAD:
 * - ❌ Hardcodear decisiones
 * - ❌ Usar umbrales mágicos (0.6, etc.)
 * - ❌ Hacer cálculos de contraste propios
 *
 * @example
 * ```typescript
 * // En componente AccessibleButton:
 * const bgColor = await PerceptualColor.fromHex('#3B82F6');
 * const textDecision = await TextColorDecisionService.getOptimalTextColor(bgColor);
 *
 * console.log(textDecision.color.hex); // '#ffffff' o '#000000'
 * console.log(textDecision.contrastRatio); // 4.52
 * console.log(textDecision.passesAA); // true
 * console.log(textDecision.reason); // "White provides 4.52:1 contrast (WCAG AA compliant)"
 * ```
 */
export class TextColorDecisionService {
  // ──────────────────────────────────────────────────────────────────────────
  // CONSTANTS (Candidate colors for text)
  // ──────────────────────────────────────────────────────────────────────────

  private static readonly BLACK_HEX = '#000000';
  private static readonly WHITE_HEX = '#ffffff';

  // ──────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Determina el color de texto óptimo para un fondo dado.
   *
   * Evalúa contraste WCAG de negro y blanco contra el fondo,
   * retorna el que tenga mejor contraste.
   *
   * @param background - Color de fondo
   * @returns Decisión de color de texto con metadata
   */
  static async getOptimalTextColor(
    background: PerceptualColor
  ): Promise<TextColorDecision> {
    // Inicializar WASM si es necesario
    await MomotoBridge.initialize();

    // Crear colores candidatos (negro y blanco) en WASM
    const bgWasm = await MomotoBridge.createColor(background.hex);
    const blackWasm = await MomotoBridge.createColor(this.BLACK_HEX);
    const whiteWasm = await MomotoBridge.createColor(this.WHITE_HEX);

    // Crear métrica WCAG
    const wcagMetric = await MomotoBridge.createWCAGMetric();

    // Evaluar contraste de ambos candidatos
    const blackResult = wcagMetric.evaluate(blackWasm, bgWasm);
    const whiteResult = wcagMetric.evaluate(whiteWasm, bgWasm);

    const blackRatio = blackResult.ratio();
    const whiteRatio = whiteResult.ratio();

    // Seleccionar el mejor (mayor contraste)
    const useWhite = whiteRatio > blackRatio;
    const selectedRatio = useWhite ? whiteRatio : blackRatio;
    const selectedHex = useWhite ? this.WHITE_HEX : this.BLACK_HEX;
    const selectedColor = await PerceptualColor.fromHex(selectedHex);

    // Evaluar cumplimiento WCAG del color seleccionado
    const passesAA = selectedRatio >= 4.5; // WCAG AA normal text
    const passesAAA = selectedRatio >= 7.0; // WCAG AAA normal text

    // Calcular quality score (0-1)
    // 21:1 = max contrast = score 1.0
    // 4.5:1 = WCAG AA = score 0.5
    // < 4.5:1 = poor = score < 0.5
    const qualityScore = Math.min(1.0, selectedRatio / 21.0);

    // Confianza alta si la diferencia entre candidatos es clara
    const ratioDifference = Math.abs(whiteRatio - blackRatio);
    const confidence = Math.min(1.0, ratioDifference / 10.0); // Diferencia de 10+ = confianza 1.0

    // Razón explicativa
    const colorName = useWhite ? 'White' : 'Black';
    const wcagLevel = passesAAA ? 'WCAG AAA' : passesAA ? 'WCAG AA' : 'below WCAG AA';
    const reason = `${colorName} provides ${selectedRatio.toFixed(2)}:1 contrast (${wcagLevel})`;

    return {
      color: selectedColor,
      contrastRatio: selectedRatio,
      qualityScore,
      confidence,
      reason,
      passesAA,
      passesAAA,
    };
  }

  /**
   * Versión try-safe que retorna Result.
   */
  static async tryGetOptimalTextColor(
    background: PerceptualColor
  ): Promise<Result<TextColorDecision, Error>> {
    try {
      const decision = await this.getOptimalTextColor(background);
      return { success: true, value: decision };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      };
    }
  }

  /**
   * Determina si el texto debería ser claro u oscuro para un fondo dado.
   *
   * Helper simplificado que retorna 'light' o 'dark'.
   *
   * @param background - Color de fondo
   * @returns 'light' para texto blanco, 'dark' para texto negro
   */
  static async getTextMode(background: PerceptualColor): Promise<'light' | 'dark'> {
    const decision = await this.getOptimalTextColor(background);
    return decision.color.hex === this.WHITE_HEX ? 'light' : 'dark';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default TextColorDecisionService;

/**
 * REFACTORING IMPACT:
 *
 * ARCHIVOS QUE DEBEN MIGRAR A ESTE SERVICIO:
 * - ❌ AccessibleButton.tsx (línea 197)
 * - ❌ ColorSwatch.tsx (línea 118)
 *
 * MIGRACIÓN:
 * ```diff
 * - const textColor = color.oklch.l > 0.6 ? '#000000' : '#ffffff';
 * + const decision = await TextColorDecisionService.getOptimalTextColor(color);
 * + const textColor = decision.color.hex;
 * ```
 *
 * BENEFICIOS:
 * - ✅ Cero hardcoded colors
 * - ✅ Decisiones basadas en Momoto WASM (no en umbral mágico 0.6)
 * - ✅ Metadata de calidad (qualityScore, confidence, reason)
 * - ✅ Cumplimiento WCAG verificado
 * - ✅ Trazabilidad de decisiones
 */
