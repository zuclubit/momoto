import { TokenDerivationService, ComponentIntent, TokenCollection } from './chunk-YC4E5BUD.mjs';
import { PerceptualColor } from './chunk-QN62TTT3.mjs';
import { failure, success } from './chunk-445P5ZF2.mjs';
import { __publicField } from './chunk-ABD7DB5B.mjs';

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// application/use-cases/GenerateComponentTokens.ts
var GenerateComponentTokens = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(derivationService, tokenRepository) {
    // ─────────────────────────────────────────────────────────────────────────
    // DEPENDENCIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "derivationService");
    __publicField(this, "tokenRepository");
    this.derivationService = derivationService || new TokenDerivationService();
    this.tokenRepository = tokenRepository;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Ejecuta el use case.
   */
  async execute(input) {
    try {
      const validationResult = this.validateInput(input);
      if (!validationResult.success) {
        return failure(validationResult.error);
      }
      const colorResult = PerceptualColor.tryFromHex(input.brandColorHex);
      if (!colorResult.success) {
        return failure(new Error(`Invalid brand color: ${colorResult.error.message}`));
      }
      const brandColor = colorResult.value;
      const intentResult = ComponentIntent.from(input.intent);
      if (!intentResult.success) {
        return failure(new Error(`Invalid intent: ${intentResult.error.message}`));
      }
      const intent = intentResult.value;
      const collection = this.derivationService.deriveComponentTokens(
        input.componentName,
        brandColor,
        intent
      );
      if (input.states && input.states.length > 0) {
        const stateTokens = this.derivationService.deriveStates(
          `${input.componentName}.base`,
          brandColor,
          { component: input.componentName, intent: intent.value }
        );
        collection.addAll(stateTokens);
      }
      if (input.generateScale) {
        const scaleTokens = this.derivationService.deriveScale(
          `${input.componentName}.scale`,
          brandColor,
          { component: input.componentName }
        );
        collection.addAll(scaleTokens);
      }
      if (this.tokenRepository) {
        await this.tokenRepository.save(collection);
      }
      const stats = this.calculateStats(collection);
      const css = collection.export({ format: "css", prefix: input.namespace });
      const w3cTokens = collection.export({ format: "w3c" });
      return success({
        collection,
        stats,
        css,
        w3cTokens
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error during token generation")
      );
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Valida el input del use case.
   */
  validateInput(input) {
    if (!input.componentName || input.componentName.trim().length === 0) {
      return failure(new Error("Component name is required"));
    }
    if (!input.brandColorHex || input.brandColorHex.trim().length === 0) {
      return failure(new Error("Brand color hex is required"));
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(input.brandColorHex)) {
      return failure(new Error("Brand color must be a valid 6-digit hex color"));
    }
    if (!input.intent || input.intent.trim().length === 0) {
      return failure(new Error("Intent is required"));
    }
    return success(void 0);
  }
  /**
   * Calcula estadísticas de la colección.
   */
  calculateStats(collection) {
    const all = collection.all();
    const colorTokens = collection.byType("color").length;
    const stateTokens = collection.filter({ state: "hover" }).length + collection.filter({ state: "active" }).length + collection.filter({ state: "disabled" }).length + collection.filter({ state: "focus" }).length;
    return {
      totalTokens: all.length,
      colorTokens,
      stateTokens,
      variantTokens: all.length - colorTokens
    };
  }
};

// application/use-cases/EvaluateComponentAccessibility.ts
var WCAG_RATIOS = {
  "Fail": 0,
  // Below minimum
  "A": 3,
  // Minimum for large text
  "AA": 4.5,
  // Standard requirement
  "AAA": 7
  // Enhanced requirement
};
var APCA_LEVELS = {
  "fail": 0,
  // Below minimum
  "minimum": 15,
  // Decorative only
  "spot": 30,
  // Non-text, icons
  "large": 45,
  // Large text, headings
  "body": 60,
  // Standard body text
  "fluent": 75,
  // Optimal reading
  "excellent": 90
  // Maximum readability
};
var WCAG_AA_LARGE_RATIO = 3;
var EvaluateComponentAccessibility = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(auditPort) {
    // ─────────────────────────────────────────────────────────────────────────
    // DEPENDENCIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "auditPort");
    this.auditPort = auditPort;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Ejecuta la evaluación de accesibilidad.
   */
  async execute(input) {
    try {
      const pairs = this.resolvePairs(input);
      if (pairs.length === 0) {
        return failure(new Error("No color pairs to evaluate"));
      }
      const results = [];
      const violations = [];
      for (const pair of pairs) {
        const result = this.evaluatePair(pair, input);
        results.push(result);
        if (!result.passes) {
          violations.push(...this.createViolations(result, input));
          if (input.failFast) {
            break;
          }
        }
      }
      const passingPairs = results.filter((r) => r.passes).length;
      const score = Math.round(passingPairs / results.length * 100);
      const recommendations = this.generateRecommendations(results, input);
      if (this.auditPort && results.length > 0) {
        for (const result of results) {
          const fgResult = PerceptualColor.tryFromHex(result.foreground);
          const bgResult = PerceptualColor.tryFromHex(result.background);
          if (fgResult.success && bgResult.success) {
            await this.auditPort.logAccessibilityEvaluation({
              foreground: fgResult.value,
              background: bgResult.value,
              wcagRatio: result.wcag.ratio,
              apcaLevel: result.apca.contrast,
              requiredLevel: input.requiredWcagLevel,
              passes: result.passes,
              component: result.pairName
            });
          }
        }
      }
      const output = {
        passes: violations.length === 0,
        totalPairs: pairs.length,
        passingPairs,
        violationCount: violations.length,
        results,
        violations,
        score,
        recommendations
      };
      return success(output);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error during accessibility evaluation")
      );
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PAIR RESOLUTION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Resuelve los pares a evaluar desde input.
   */
  resolvePairs(input) {
    const pairs = [];
    if (input.colorPairs) {
      pairs.push(...input.colorPairs);
    }
    if (input.tokenCollection) {
      const tokenPairs = this.extractPairsFromCollection(input.tokenCollection);
      pairs.push(...tokenPairs);
    }
    return pairs;
  }
  /**
   * Extrae pares de colores de una colección de tokens.
   */
  extractPairsFromCollection(collection) {
    const pairs = [];
    const colorTokens = collection.byType("color");
    const backgrounds = colorTokens.filter(
      (t) => t.context.role === "background" || t.context.role === "surface" || t.name.includes(".bg")
    );
    const texts = colorTokens.filter(
      (t) => t.context.role?.startsWith("text") || t.name.includes(".text")
    );
    for (const bg of backgrounds) {
      for (const text of texts) {
        if (bg.namespace === text.namespace || bg.context.component === text.context.component) {
          pairs.push({
            name: `${bg.name} / ${text.name}`,
            background: bg.toCssValue(),
            foreground: text.toCssValue(),
            role: text.context.role
          });
        }
      }
    }
    return pairs;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EVALUATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Evalúa un par de colores.
   */
  evaluatePair(pair, input) {
    const fgResult = PerceptualColor.tryFromHex(pair.foreground);
    const bgResult = PerceptualColor.tryFromHex(pair.background);
    if (!fgResult.success || !bgResult.success) {
      return this.createErrorResult(pair, "Invalid color value");
    }
    const fgColor = fgResult.value;
    const bgColor = bgResult.value;
    const wcagRatio = this.calculateWcagRatio(fgColor, bgColor);
    const wcagLevel = this.determineWcagLevel(wcagRatio);
    const passesAA = wcagRatio >= WCAG_RATIOS.AA;
    const passesAAA = wcagRatio >= WCAG_RATIOS.AAA;
    const passesAALarge = wcagRatio >= WCAG_AA_LARGE_RATIO;
    const apcaContrast = this.calculateApcaContrast(fgColor, bgColor);
    const apcaLevel = this.determineApcaLevel(apcaContrast);
    const passesBodyText = Math.abs(apcaContrast) >= APCA_LEVELS.fluent;
    const passesHeading = Math.abs(apcaContrast) >= APCA_LEVELS.body;
    const passesNonText = Math.abs(apcaContrast) >= APCA_LEVELS.spot;
    const violations = [];
    const recommendations = [];
    if (input.requiredWcagLevel === "AAA" && !passesAAA) {
      violations.push(`WCAG AAA requires ratio >= 7.0, got ${wcagRatio.toFixed(2)}`);
    } else if (input.requiredWcagLevel === "AA" && !passesAA) {
      violations.push(`WCAG AA requires ratio >= 4.5, got ${wcagRatio.toFixed(2)}`);
    }
    const requiredApca = APCA_LEVELS[input.requiredApcaLevel];
    if (Math.abs(apcaContrast) < requiredApca) {
      violations.push(
        `APCA ${input.requiredApcaLevel} requires |Lc| >= ${requiredApca}, got ${apcaContrast.toFixed(1)}`
      );
    }
    if (!passesAA && passesAALarge) {
      recommendations.push("Consider using this combination only for large text (18pt+ or 14pt bold)");
    }
    if (!passesBodyText && passesHeading) {
      recommendations.push("This contrast is suitable for headings but not body text");
    }
    return {
      pairName: pair.name,
      foreground: pair.foreground,
      background: pair.background,
      wcag: {
        ratio: wcagRatio,
        level: wcagLevel,
        passesAA,
        passesAAA,
        passesAALarge
      },
      apca: {
        contrast: apcaContrast,
        level: apcaLevel,
        passesBodyText,
        passesHeading,
        passesNonText
      },
      passes: violations.length === 0,
      violations,
      recommendations
    };
  }
  /**
   * Crea resultado de error.
   */
  createErrorResult(pair, error) {
    return {
      pairName: pair.name,
      foreground: pair.foreground,
      background: pair.background,
      wcag: {
        ratio: 0,
        level: "Fail",
        passesAA: false,
        passesAAA: false,
        passesAALarge: false
      },
      apca: {
        contrast: 0,
        level: "fail",
        passesBodyText: false,
        passesHeading: false,
        passesNonText: false
      },
      passes: false,
      violations: [error],
      recommendations: []
    };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // CALCULATIONS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Calcula ratio de contraste WCAG 2.1.
   */
  calculateWcagRatio(fg, bg) {
    const fgRgb = fg.rgb;
    const bgRgb = bg.rgb;
    const luminance = (rgb) => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const l1 = luminance(fgRgb);
    const l2 = luminance(bgRgb);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  /**
   * Calcula contraste APCA.
   */
  calculateApcaContrast(fg, bg) {
    const fgRgb = fg.rgb;
    const bgRgb = bg.rgb;
    const toY = (rgb) => {
      const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => Math.pow(v / 255, 2.4));
      return 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
    };
    const yBg = toY(bgRgb);
    const yFg = toY(fgRgb);
    const polarity = yBg > yFg ? 1 : -1;
    const normBG = Math.pow(yBg, 0.56);
    const normTXT = Math.pow(yFg, 0.57);
    const SAPC = (normBG - normTXT) * 1.14;
    return SAPC * 100 * polarity;
  }
  /**
   * Determina nivel WCAG.
   */
  determineWcagLevel(ratio) {
    if (ratio >= WCAG_RATIOS.AAA) return "AAA";
    if (ratio >= WCAG_RATIOS.AA) return "AA";
    if (ratio >= WCAG_RATIOS.A) return "A";
    return "Fail";
  }
  /**
   * Determina nivel APCA.
   */
  determineApcaLevel(contrast) {
    const absContrast = Math.abs(contrast);
    if (absContrast >= APCA_LEVELS.excellent) return "excellent";
    if (absContrast >= APCA_LEVELS.fluent) return "fluent";
    if (absContrast >= APCA_LEVELS.body) return "body";
    if (absContrast >= APCA_LEVELS.large) return "large";
    if (absContrast >= APCA_LEVELS.spot) return "spot";
    if (absContrast >= APCA_LEVELS.minimum) return "minimum";
    return "fail";
  }
  // ─────────────────────────────────────────────────────────────────────────
  // VIOLATIONS & RECOMMENDATIONS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea objetos de violación para audit.
   */
  createViolations(result, input) {
    return result.violations.map((message) => ({
      type: "contrast",
      severity: "error",
      element: result.pairName,
      message,
      wcagCriteria: input.requiredWcagLevel === "AAA" ? "1.4.6" : "1.4.3",
      foreground: result.foreground,
      background: result.background,
      actualRatio: result.wcag.ratio,
      requiredRatio: WCAG_RATIOS[input.requiredWcagLevel],
      suggestion: this.generateFixSuggestion(result)
    }));
  }
  /**
   * Genera sugerencia de corrección.
   */
  generateFixSuggestion(result) {
    const bgColor = PerceptualColor.tryFromHex(result.background);
    const fgColor = PerceptualColor.tryFromHex(result.foreground);
    if (!bgColor.success || !fgColor.success) {
      return "Adjust colors to meet contrast requirements";
    }
    const bgL = bgColor.value.oklch.l;
    const fgL = fgColor.value.oklch.l;
    if (bgL > 0.5) {
      return `Try darkening the foreground. Current lightness: ${(fgL * 100).toFixed(0)}%. Suggested: ${Math.max(0, (fgL - 0.2) * 100).toFixed(0)}%`;
    } else {
      return `Try lightening the foreground. Current lightness: ${(fgL * 100).toFixed(0)}%. Suggested: ${Math.min(100, (fgL + 0.2) * 100).toFixed(0)}%`;
    }
  }
  /**
   * Genera recomendaciones generales.
   */
  generateRecommendations(results, _input) {
    const recommendations = [];
    const failingCount = results.filter((r) => !r.passes).length;
    if (failingCount > results.length / 2) {
      recommendations.push(
        "More than half of color pairs fail accessibility requirements. Consider reviewing the color palette."
      );
    }
    const lowContrastPairs = results.filter((r) => r.wcag.ratio < 3);
    if (lowContrastPairs.length > 0) {
      recommendations.push(
        `${lowContrastPairs.length} pair(s) have very low contrast (< 3:1). These should be used only for decorative purposes.`
      );
    }
    const apcaOnlyPairs = results.filter(
      (r) => !r.wcag.passesAA && r.apca.passesHeading
    );
    if (apcaOnlyPairs.length > 0) {
      recommendations.push(
        `${apcaOnlyPairs.length} pair(s) pass APCA but fail WCAG. Consider APCA for perceptual accuracy, but WCAG for legal compliance.`
      );
    }
    return recommendations;
  }
};

// application/use-cases/ApplyPerceptualPolicy.ts
var PRESET_POLICIES = {
  /** Política estándar WCAG AA */
  wcagAA: {
    name: "WCAG 2.1 AA",
    description: "Cumplimiento m\xEDnimo WCAG 2.1 nivel AA",
    lightness: { min: 0, max: 100, autoAdjust: false },
    chroma: { min: 0, max: 150, varianceTolerance: 20, autoAdjust: false },
    contrast: {
      minWcagRatio: 4.5,
      minApcaLevel: 60,
      requiredPairs: [["foreground", "background"]],
      onFailure: "error"
    },
    strict: false
  },
  /** Política estricta WCAG AAA */
  wcagAAA: {
    name: "WCAG 2.1 AAA",
    description: "Cumplimiento WCAG 2.1 nivel AAA",
    lightness: { min: 10, max: 90, autoAdjust: true },
    chroma: { min: 0, max: 130, varianceTolerance: 15, autoAdjust: true },
    contrast: {
      minWcagRatio: 7,
      minApcaLevel: 75,
      requiredPairs: [["foreground", "background"]],
      onFailure: "error"
    },
    strict: true
  },
  /** Política de alto contraste */
  highContrast: {
    name: "High Contrast",
    description: "Alto contraste para usuarios con baja visi\xF3n",
    lightness: { min: 0, max: 100, autoAdjust: true },
    contrast: {
      minWcagRatio: 10,
      minApcaLevel: 90,
      requiredPairs: [["foreground", "background"]],
      onFailure: "adjust"
    },
    strict: true
  },
  /** Política de armonía de marca */
  brandHarmony: {
    name: "Brand Harmony",
    description: "Consistencia crom\xE1tica para identidad de marca",
    chroma: { min: 30, max: 100, varianceTolerance: 10, autoAdjust: true },
    harmony: {
      type: "analogous",
      hueTolerance: 30,
      autoAdjust: true
    },
    strict: false
  },
  /** Política permisiva (solo warnings) */
  lenient: {
    name: "Lenient",
    description: "Pol\xEDtica permisiva que solo genera warnings",
    contrast: {
      minWcagRatio: 3,
      minApcaLevel: 45,
      requiredPairs: [],
      onFailure: "warn"
    },
    strict: false
  }
};
var ApplyPerceptualPolicy = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(auditPort) {
    // ─────────────────────────────────────────────────────────────────────────
    // DEPENDENCIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "auditPort");
    this.auditPort = auditPort;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Ejecuta el use case.
   */
  async execute(input) {
    try {
      const { collection, policy, applyCorrections = false, generateReport = false } = input;
      if (!collection || collection.all().length === 0) {
        return failure(new Error("Token collection is empty"));
      }
      const violations = [];
      const colorTokens = collection.byType("color");
      for (const token of colorTokens) {
        const tokenViolations = this.evaluateToken(token, policy);
        violations.push(...tokenViolations);
      }
      let correctedCollection;
      let correctedCount = 0;
      if (applyCorrections && violations.some((v) => v.correctedToken)) {
        correctedCollection = this.createCorrectedCollection(collection, violations);
        correctedCount = violations.filter((v) => v.correctedToken).length;
      }
      const summary = this.calculateSummary(collection, violations, correctedCount);
      if (this.auditPort) {
        await this.auditPort.log({
          category: "validation",
          severity: summary.errorCount > 0 ? "warning" : "info",
          message: `Perceptual policy "${policy.name}" applied to ${summary.totalTokens} tokens`,
          data: {
            policyName: policy.name,
            complianceRate: summary.complianceRate,
            violationCount: violations.length,
            correctedCount
          }
        });
      }
      let report;
      if (generateReport) {
        report = this.generateReport(policy, violations, summary);
      }
      return success({
        compliant: violations.filter((v) => v.severity === "error").length === 0,
        violations,
        correctedCollection,
        summary,
        report
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error during policy evaluation")
      );
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Evalúa un token contra la política.
   */
  evaluateToken(token, policy) {
    const violations = [];
    const colorHex = token.toCssVariable().replace(/var\(--[^)]+\)/, "").trim();
    const colorResult = PerceptualColor.tryFromHex(colorHex);
    if (!colorResult.success) {
      return violations;
    }
    const color = colorResult.value;
    const oklch = color.oklch;
    if (policy.lightness) {
      const violation = this.evaluateLightness(token, oklch.l * 100, policy.lightness);
      if (violation) violations.push(violation);
    }
    if (policy.chroma) {
      const violation = this.evaluateChroma(token, oklch.c * 100, policy.chroma);
      if (violation) violations.push(violation);
    }
    return violations;
  }
  /**
   * Evalúa política de luminosidad.
   */
  evaluateLightness(token, lightness, policy) {
    if (lightness < policy.min || lightness > policy.max) {
      const correctedToken = policy.autoAdjust ? this.adjustLightness(token, lightness, policy) : void 0;
      return {
        token,
        rule: "lightness",
        actualValue: lightness.toFixed(1),
        expectedValue: `${policy.min}-${policy.max}`,
        severity: "error",
        suggestion: `Adjust lightness to be within ${policy.min}-${policy.max}`,
        correctedToken
      };
    }
    return null;
  }
  /**
   * Evalúa política de saturación.
   */
  evaluateChroma(token, chroma, policy) {
    if (chroma < policy.min || chroma > policy.max) {
      const correctedToken = policy.autoAdjust ? this.adjustChroma(token, chroma, policy) : void 0;
      return {
        token,
        rule: "chroma",
        actualValue: chroma.toFixed(1),
        expectedValue: `${policy.min}-${policy.max}`,
        severity: "warning",
        suggestion: `Adjust chroma to be within ${policy.min}-${policy.max}`,
        correctedToken
      };
    }
    return null;
  }
  /**
   * Ajusta luminosidad de un token.
   */
  adjustLightness(token, currentLightness, _policy) {
    return token;
  }
  /**
   * Ajusta saturación de un token.
   */
  adjustChroma(token, _currentChroma, _policy) {
    return token;
  }
  /**
   * Crea colección corregida.
   */
  createCorrectedCollection(original, violations) {
    const correctedMap = /* @__PURE__ */ new Map();
    for (const violation of violations) {
      if (violation.correctedToken) {
        correctedMap.set(violation.token.name, violation.correctedToken);
      }
    }
    const allTokens = [];
    for (const token of original.all()) {
      allTokens.push(correctedMap.get(token.name) || token);
    }
    return TokenCollection.from(`${original.name}-corrected`, allTokens, original.description);
  }
  /**
   * Calcula resumen de cumplimiento.
   */
  calculateSummary(collection, violations, correctedCount) {
    const totalTokens = collection.all().length;
    const errorCount = violations.filter((v) => v.severity === "error").length;
    const warningCount = violations.filter((v) => v.severity === "warning").length;
    const violatingTokens = new Set(violations.map((v) => v.token.name)).size;
    return {
      totalTokens,
      compliantTokens: totalTokens - violatingTokens,
      warningCount,
      errorCount,
      correctedCount,
      complianceRate: (totalTokens - violatingTokens) / totalTokens
    };
  }
  /**
   * Genera reporte de texto.
   */
  generateReport(policy, violations, summary) {
    const lines = [
      "\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550",
      `  PERCEPTUAL POLICY REPORT: ${policy.name}`,
      "\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550",
      "",
      `Policy Description: ${policy.description || "N/A"}`,
      "",
      "\u2500\u2500\u2500 SUMMARY \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500",
      `Total Tokens:      ${summary.totalTokens}`,
      `Compliant Tokens:  ${summary.compliantTokens}`,
      `Compliance Rate:   ${(summary.complianceRate * 100).toFixed(1)}%`,
      `Errors:            ${summary.errorCount}`,
      `Warnings:          ${summary.warningCount}`,
      `Corrected:         ${summary.correctedCount}`,
      ""
    ];
    if (violations.length > 0) {
      lines.push("\u2500\u2500\u2500 VIOLATIONS \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
      for (const v of violations) {
        lines.push(`[${v.severity.toUpperCase()}] ${v.token.name}`);
        lines.push(`  Rule: ${v.rule}`);
        lines.push(`  Actual: ${v.actualValue}`);
        lines.push(`  Expected: ${v.expectedValue}`);
        if (v.suggestion) {
          lines.push(`  Suggestion: ${v.suggestion}`);
        }
        lines.push("");
      }
    }
    lines.push("\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550");
    return lines.join("\n");
  }
};

// application/use-cases/ExportDesignTokens.ts
var EXPORT_PRESETS = {
  /** Preset para desarrollo web */
  web: {
    name: "Web Development",
    formats: ["css", "scss", "typescript"],
    formatOptions: {
      css: { rootSelector: ":root", includeFallbacks: true },
      scss: { generateMaps: true, generateMixins: true },
      typescript: { generateTypes: true, constAssertions: true }
    }
  },
  /** Preset para Tailwind */
  tailwind: {
    name: "Tailwind CSS",
    formats: ["tailwind", "css"],
    formatOptions: {
      tailwind: {
        mode: "extend",
        sections: ["colors", "spacing", "fontSize", "boxShadow", "borderRadius"],
        generatePlugin: true
      }
    }
  },
  /** Preset para design tools */
  designTools: {
    name: "Design Tools",
    formats: ["w3c", "figma", "json"],
    formatOptions: {
      w3c: { specVersion: "1.0", includeExtensions: true }
    }
  },
  /** Preset para apps nativas */
  native: {
    name: "Native Apps",
    formats: ["swift", "kotlin", "android-xml"]
  },
  /** Preset para CI/CD */
  ci: {
    name: "CI/CD Pipeline",
    formats: ["json", "w3c"],
    transformations: [
      { type: "sort", config: { by: "name" } }
    ]
  },
  /** Preset completo */
  full: {
    name: "Full Export",
    formats: ["css", "scss", "tailwind", "w3c", "json", "typescript"]
  }
};
var ExportDesignTokens = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(exporterPort, auditPort) {
    // ─────────────────────────────────────────────────────────────────────────
    // DEPENDENCIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "exporterPort");
    __publicField(this, "auditPort");
    this.exporterPort = exporterPort;
    this.auditPort = auditPort;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Ejecuta el use case.
   */
  async execute(input) {
    const startTime = Date.now();
    try {
      const resolvedInput = this.resolvePreset(input);
      const validationResult = this.validateInput(resolvedInput);
      if (!validationResult.success) {
        return failure(validationResult.error);
      }
      const transformedCollection = await this.applyTransformations(
        resolvedInput.collection,
        resolvedInput.transformations
      );
      if (resolvedInput.validateBeforeExport) {
        const collectionValidation = transformedCollection.validate();
        if (!collectionValidation.valid) {
          return failure(
            new Error(`Token collection validation failed: ${collectionValidation.errors.join(", ")}`)
          );
        }
      }
      const results = [];
      const warnings = [];
      for (const format of resolvedInput.formats) {
        const formatResult = await this.exportFormat(
          transformedCollection,
          format,
          resolvedInput
        );
        results.push(formatResult);
        if (!formatResult.success && formatResult.error) {
          warnings.push(`Format ${format}: ${formatResult.error.message}`);
        }
      }
      const summary = this.calculateSummary(results, startTime);
      let manifest;
      if (resolvedInput.generateManifest) {
        manifest = this.generateManifest(transformedCollection, resolvedInput.formats, results);
      }
      if (this.auditPort) {
        await this.auditPort.log({
          category: "export",
          severity: summary.failedFormats > 0 ? "warning" : "info",
          message: `Exported ${summary.totalTokensExported} tokens to ${summary.successfulFormats} formats`,
          data: {
            formats: resolvedInput.formats,
            tokenCount: summary.totalTokensExported,
            sizeBytes: summary.totalSizeBytes,
            executionTimeMs: summary.executionTimeMs
          }
        });
      }
      return success({
        success: summary.failedFormats === 0,
        results,
        manifest,
        summary,
        warnings
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error during token export")
      );
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Resuelve preset si se especifica.
   */
  resolvePreset(input) {
    if (!input.preset || !EXPORT_PRESETS[input.preset]) {
      return input;
    }
    const preset = EXPORT_PRESETS[input.preset];
    return {
      ...input,
      formats: input.formats.length > 0 ? input.formats : preset.formats,
      destinations: input.destinations || preset.destinations,
      transformations: [...preset.transformations || [], ...input.transformations || []],
      formatOptions: { ...preset.formatOptions, ...input.formatOptions }
    };
  }
  /**
   * Valida el input.
   */
  validateInput(input) {
    if (!input.collection) {
      return failure(new Error("Token collection is required"));
    }
    if (!input.formats || input.formats.length === 0) {
      return failure(new Error("At least one export format is required"));
    }
    for (const format of input.formats) {
      if (!this.exporterPort.supportsFormat(format)) {
        return failure(new Error(`Unsupported export format: ${format}`));
      }
    }
    return success(void 0);
  }
  /**
   * Aplica transformaciones a la colección.
   */
  async applyTransformations(collection, transformations) {
    if (!transformations || transformations.length === 0) {
      return collection;
    }
    let result = collection;
    for (const transform of transformations) {
      result = this.applyTransformation(result, transform);
    }
    return result;
  }
  /**
   * Aplica una transformación individual.
   */
  applyTransformation(collection, transform) {
    switch (transform.type) {
      case "filter":
        return this.applyFilterTransform(collection, transform.config);
      case "sort":
        return this.applySortTransform(collection, transform.config);
      default:
        return collection;
    }
  }
  /**
   * Aplica transformación de filtro.
   */
  applyFilterTransform(collection, config) {
    const tokens = collection.filter(config);
    return TokenCollection.from(`${collection.name}-filtered`, [...tokens], collection.description);
  }
  /**
   * Aplica transformación de ordenamiento.
   */
  applySortTransform(collection, _config) {
    return collection;
  }
  /**
   * Exporta a un formato específico.
   */
  async exportFormat(collection, format, input) {
    try {
      const options = this.buildExportOptions(format, input);
      const exportResult = await this.exporterPort.export(collection, options);
      if (!exportResult.success) {
        return {
          format,
          success: false,
          error: exportResult.error
        };
      }
      const destinations = input.destinations || [];
      const destinationResults = [];
      for (const dest of destinations) {
        try {
          const destResult = await this.exporterPort.exportTo(collection, options, dest);
          destinationResults.push({
            type: dest.type,
            location: destResult.success ? destResult.value.location : void 0,
            success: destResult.success,
            error: destResult.success ? void 0 : destResult.error.message
          });
        } catch (e) {
          destinationResults.push({
            type: dest.type,
            success: false,
            error: e instanceof Error ? e.message : "Unknown error"
          });
        }
      }
      return {
        format,
        success: true,
        result: exportResult.value,
        destinations: destinationResults.length > 0 ? destinationResults : void 0
      };
    } catch (error) {
      return {
        format,
        success: false,
        error: error instanceof Error ? error : new Error("Unknown export error")
      };
    }
  }
  /**
   * Construye opciones de exportación.
   */
  buildExportOptions(format, input) {
    const baseOptions = input.options || {};
    const formatSpecificOptions = input.formatOptions?.[format] || {};
    return {
      format,
      ...baseOptions,
      ...formatSpecificOptions
    };
  }
  /**
   * Calcula resumen de exportación.
   */
  calculateSummary(results, startTime) {
    const successfulFormats = results.filter((r) => r.success).length;
    const failedFormats = results.length - successfulFormats;
    const totalTokensExported = results.filter((r) => r.success && r.result).reduce((sum, r) => sum + (r.result?.tokenCount || 0), 0) / Math.max(successfulFormats, 1);
    const totalSizeBytes = results.filter((r) => r.success && r.result).reduce((sum, r) => sum + (r.result?.sizeBytes || 0), 0);
    const destinations = results.flatMap((r) => r.destinations || []);
    const successfulDestinations = destinations.filter((d) => d.success).length;
    return {
      totalFormats: results.length,
      successfulFormats,
      failedFormats,
      totalDestinations: destinations.length,
      successfulDestinations,
      totalTokensExported: Math.round(totalTokensExported),
      totalSizeBytes,
      executionTimeMs: Date.now() - startTime
    };
  }
  /**
   * Genera manifest de exportación.
   */
  generateManifest(collection, formats, results) {
    const destinations = results.flatMap((r) => r.destinations || []).filter((d) => d.success && d.location).map((d) => d.location);
    return {
      exportedAt: /* @__PURE__ */ new Date(),
      version: "1.0.0",
      collectionName: collection.name,
      tokenCount: collection.all().length,
      formats,
      destinations,
      checksum: this.generateChecksum(collection)
    };
  }
  /**
   * Genera checksum de la colección.
   */
  generateChecksum(collection) {
    const content = collection.export({ format: "json" });
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  }
};

// application/use-cases/AuditVisualDecisions.ts
var AuditVisualDecisions = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(auditPort) {
    // ─────────────────────────────────────────────────────────────────────────
    // DEPENDENCIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "auditPort");
    this.auditPort = auditPort;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Ejecuta el use case.
   */
  async execute(input) {
    const startTime = Date.now();
    try {
      const validationResult = this.validateInput(input);
      if (!validationResult.success) {
        return failure(validationResult.error);
      }
      const auditTypes = input.auditTypes.includes("full") ? ["accessibility", "color-decisions", "token-usage", "performance"] : input.auditTypes;
      let accessibility;
      let colorDecisions;
      let tokenUsage;
      let performance;
      if (auditTypes.includes("accessibility")) {
        accessibility = await this.auditAccessibility(input);
      }
      if (auditTypes.includes("color-decisions")) {
        colorDecisions = await this.auditColorDecisions(input);
      }
      if (auditTypes.includes("token-usage") && input.tokenCollection) {
        tokenUsage = await this.auditTokenUsage(input);
      }
      if (auditTypes.includes("performance")) {
        performance = await this.auditPerformance(input);
      }
      const qualityScore = this.calculateQualityScore(
        accessibility,
        colorDecisions,
        tokenUsage,
        performance
      );
      const recommendations = this.generateRecommendations(
        accessibility,
        colorDecisions,
        tokenUsage,
        performance
      );
      const report = this.generateReport(input, {
        accessibility,
        colorDecisions,
        tokenUsage,
        performance,
        qualityScore,
        recommendations
      });
      const executiveSummary = this.generateExecutiveSummary(qualityScore, recommendations);
      await this.auditPort.log({
        category: "validation",
        severity: qualityScore.overall < 70 ? "warning" : "info",
        message: `Visual decisions audit completed with score ${qualityScore.overall}/100 (${qualityScore.grade})`,
        data: {
          score: qualityScore.overall,
          grade: qualityScore.grade,
          auditTypes,
          duration: Date.now() - startTime
        }
      });
      return success({
        accessibility,
        colorDecisions,
        tokenUsage,
        performance,
        qualityScore,
        report,
        executiveSummary,
        recommendations,
        metadata: {
          auditedAt: /* @__PURE__ */ new Date(),
          duration: Date.now() - startTime,
          auditTypes,
          periodCovered: input.periodFilter
        }
      });
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Unknown error during audit")
      );
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Valida el input.
   */
  validateInput(input) {
    if (!input.auditTypes || input.auditTypes.length === 0) {
      return failure(new Error("At least one audit type is required"));
    }
    if (input.auditTypes.includes("token-usage") && !input.tokenCollection) {
      return failure(new Error("Token collection is required for token-usage audit"));
    }
    return success(void 0);
  }
  /**
   * Audita accesibilidad.
   */
  async auditAccessibility(input) {
    const filter = {
      categories: ["accessibility"],
      startDate: input.periodFilter?.start,
      endDate: input.periodFilter?.end
    };
    const entriesResult = await this.auditPort.query(filter);
    const entries = entriesResult.success ? entriesResult.value : [];
    const passing = entries.filter((e) => e.data?.passes === true).length;
    const failing = entries.length - passing;
    const issueComponents = entries.filter((e) => e.data?.passes === false).map((e) => ({
      component: String(e.data?.component || "Unknown"),
      issue: e.message,
      severity: e.severity,
      recommendation: String(e.data?.recommendation || "")
    }));
    const wcagRatios = entries.map((e) => Number(e.data?.wcagRatio || 0)).filter((r) => r > 0);
    const avgWcagRatio = wcagRatios.length > 0 ? wcagRatios.reduce((a, b) => a + b, 0) / wcagRatios.length : 0;
    const apcaLevels = entries.map((e) => Number(e.data?.apcaLevel || 0)).filter((l) => l > 0);
    const avgApcaLevel = apcaLevels.length > 0 ? apcaLevels.reduce((a, b) => a + b, 0) / apcaLevels.length : 0;
    return {
      totalEvaluations: entries.length,
      passing,
      failing,
      complianceRate: entries.length > 0 ? passing / entries.length : 1,
      issueComponents,
      avgWcagRatio,
      avgApcaLevel
    };
  }
  /**
   * Audita decisiones de color.
   */
  async auditColorDecisions(input) {
    const filter = {
      categories: ["color-decision"],
      startDate: input.periodFilter?.start,
      endDate: input.periodFilter?.end
    };
    const entriesResult = await this.auditPort.query(filter);
    const entries = entriesResult.success ? entriesResult.value : [];
    const colors = /* @__PURE__ */ new Set();
    for (const entry of entries) {
      const data = entry.data;
      if (data?.outputColor) {
        colors.add(String(data.outputColor));
      }
    }
    return {
      totalDecisions: entries.length,
      consistentDecisions: entries.length,
      // Simplified
      variations: [],
      harmonyScore: 85,
      // Simplified
      effectivePalette: Array.from(colors).slice(0, 10)
    };
  }
  /**
   * Audita uso de tokens.
   */
  async auditTokenUsage(input) {
    const collection = input.tokenCollection;
    const allTokens = collection.all();
    const valueMap = /* @__PURE__ */ new Map();
    for (const token of allTokens) {
      const value = token.toCssVariable();
      const existing = valueMap.get(value) || [];
      existing.push(token.name);
      valueMap.set(value, existing);
    }
    const duplicates = Array.from(valueMap.entries()).filter(([, names]) => names.length > 1).map(([, names]) => ({
      name: names[0],
      duplicateOf: names.slice(1).join(", ")
    }));
    const uncategorized = allTokens.filter((t) => !t.context?.component && !t.context?.intent).map((t) => t.name);
    return {
      totalTokens: allTokens.length,
      usedTokens: allTokens.length - uncategorized.length,
      unusedTokens: [],
      // Would need actual usage tracking
      duplicateTokens: duplicates,
      uncategorizedTokens: uncategorized,
      usageCoverage: 1 - uncategorized.length / allTokens.length
    };
  }
  /**
   * Audita rendimiento.
   */
  async auditPerformance(input) {
    const filter = {
      categories: ["token-generation", "performance"],
      startDate: input.periodFilter?.start,
      endDate: input.periodFilter?.end
    };
    const entriesResult = await this.auditPort.query(filter);
    const entries = entriesResult.success ? entriesResult.value : [];
    const times = entries.map((e) => Number(e.data?.generationTimeMs || 0)).filter((t) => t > 0);
    const avgTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const maxTime = times.length > 0 ? Math.max(...times) : 0;
    const threshold = input.performanceConfig?.generationTimeThreshold || 100;
    const slowOperations = entries.filter((e) => Number(e.data?.generationTimeMs || 0) > threshold).map((e) => ({
      operation: e.message,
      timeMs: Number(e.data?.generationTimeMs || 0),
      threshold
    }));
    return {
      avgGenerationTimeMs: avgTime,
      maxGenerationTimeMs: maxTime,
      slowOperations,
      collectionSizeBytes: input.tokenCollection ? Buffer.byteLength(input.tokenCollection.export({ format: "json" })) : 0,
      performanceScore: Math.max(0, 100 - slowOperations.length * 10)
    };
  }
  /**
   * Calcula score de calidad.
   */
  calculateQualityScore(accessibility, colorDecisions, tokenUsage, performance) {
    const scores = {
      accessibility: accessibility ? accessibility.complianceRate * 100 : 100,
      consistency: colorDecisions ? colorDecisions.harmonyScore : 100,
      coverage: tokenUsage ? tokenUsage.usageCoverage * 100 : 100,
      performance: performance ? performance.performanceScore : 100
    };
    const overall = Object.values(scores).reduce((a, b) => a + b, 0) / 4;
    const improvementAreas = [];
    if (scores.accessibility < 80) improvementAreas.push("Accessibility compliance");
    if (scores.consistency < 80) improvementAreas.push("Color consistency");
    if (scores.coverage < 80) improvementAreas.push("Token coverage");
    if (scores.performance < 80) improvementAreas.push("Performance optimization");
    return {
      overall: Math.round(overall),
      byCategory: scores,
      grade: this.calculateGrade(overall),
      improvementAreas
    };
  }
  /**
   * Calcula grade basado en score.
   */
  calculateGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }
  /**
   * Genera recomendaciones.
   */
  generateRecommendations(accessibility, colorDecisions, tokenUsage, performance) {
    const recommendations = [];
    if (accessibility && accessibility.complianceRate < 1) {
      recommendations.push({
        priority: "high",
        category: "Accessibility",
        recommendation: `Fix ${accessibility.failing} accessibility violations`,
        impact: "Critical for users with disabilities and legal compliance"
      });
    }
    if (colorDecisions && colorDecisions.variations.length > 0) {
      recommendations.push({
        priority: "medium",
        category: "Color Decisions",
        recommendation: `Review ${colorDecisions.variations.length} color decision variations`,
        impact: "Maintains visual consistency and reduces technical debt"
      });
    }
    if (tokenUsage && tokenUsage.duplicateTokens.length > 0) {
      recommendations.push({
        priority: "medium",
        category: "Token Usage",
        recommendation: `Consolidate ${tokenUsage.duplicateTokens.length} duplicate tokens`,
        impact: "Reduces bundle size and improves maintainability"
      });
    }
    if (performance && performance.slowOperations.length > 0) {
      recommendations.push({
        priority: "low",
        category: "Performance",
        recommendation: `Optimize ${performance.slowOperations.length} slow operations`,
        impact: "Improves development experience and build times"
      });
    }
    return recommendations;
  }
  /**
   * Genera reporte formateado.
   */
  generateReport(input, data) {
    switch (input.outputFormat) {
      case "json":
        return JSON.stringify(data, null, 2);
      case "markdown":
        return this.generateMarkdownReport(data);
      case "html":
        return this.generateHtmlReport(data);
      default:
        return this.generateTextReport(data);
    }
  }
  /**
   * Genera reporte en texto.
   */
  generateTextReport(data) {
    const lines = [
      "\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550",
      "           VISUAL DECISIONS AUDIT REPORT",
      "\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550",
      "",
      `Quality Score: ${data.qualityScore?.overall}/100 (${data.qualityScore?.grade})`,
      ""
    ];
    if (data.qualityScore?.improvementAreas.length) {
      lines.push("Areas for Improvement:");
      for (const area of data.qualityScore.improvementAreas) {
        lines.push(`  \u2022 ${area}`);
      }
      lines.push("");
    }
    return lines.join("\n");
  }
  /**
   * Genera reporte en Markdown.
   */
  generateMarkdownReport(data) {
    return `# Visual Decisions Audit Report

## Quality Score: ${data.qualityScore?.overall}/100 (${data.qualityScore?.grade})

### Scores by Category
- Accessibility: ${data.qualityScore?.byCategory.accessibility.toFixed(0)}%
- Consistency: ${data.qualityScore?.byCategory.consistency.toFixed(0)}%
- Coverage: ${data.qualityScore?.byCategory.coverage.toFixed(0)}%
- Performance: ${data.qualityScore?.byCategory.performance.toFixed(0)}%

### Recommendations
${data.recommendations?.map((r) => `- **[${r.priority.toUpperCase()}]** ${r.recommendation}`).join("\n") || "None"}
`;
  }
  /**
   * Genera reporte en HTML.
   */
  generateHtmlReport(data) {
    return `<!DOCTYPE html>
<html>
<head><title>Audit Report</title></head>
<body>
<h1>Visual Decisions Audit Report</h1>
<h2>Quality Score: ${data.qualityScore?.overall}/100 (${data.qualityScore?.grade})</h2>
</body>
</html>`;
  }
  /**
   * Genera resumen ejecutivo.
   */
  generateExecutiveSummary(qualityScore, recommendations) {
    const highPriority = recommendations.filter((r) => r.priority === "high").length;
    return `Quality Score: ${qualityScore.overall}/100 (Grade ${qualityScore.grade}). ${highPriority} high-priority issues require attention. Key improvement areas: ${qualityScore.improvementAreas.join(", ") || "None"}.`;
  }
};

export { ApplyPerceptualPolicy, AuditVisualDecisions, EXPORT_PRESETS, EvaluateComponentAccessibility, ExportDesignTokens, GenerateComponentTokens, PRESET_POLICIES };
//# sourceMappingURL=chunk-VG5TP2WB.mjs.map
//# sourceMappingURL=chunk-VG5TP2WB.mjs.map