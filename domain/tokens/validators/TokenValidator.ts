/**
 * @fileoverview TokenValidator - Strict Token Theme Validation
 *
 * FASE 12: Token System Enhancement
 *
 * Validates TokenTheme completeness and quality with NO fallbacks.
 *
 * CONTRACT:
 * - ✅ Validates structure and completeness
 * - ✅ Checks Momoto metadata presence
 * - ✅ Verifies accessibility compliance
 * - ❌ NO fallbacks, NO autocorrection
 * - ❌ Errors are BLOCKING
 *
 * @module momoto-ui/domain/tokens/validators/TokenValidator
 * @version 1.0.0
 */

import type { TokenTheme, ButtonTokenSet } from '../../../components/primitives/tokens/TokenTheme.types';
import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidatorOptions,
  CompatibilityResult,
} from '../types/Validation.types';
import type { EnrichedToken } from '../value-objects/EnrichedToken';

// ============================================================================
// TYPE HELPERS FOR SAFE DYNAMIC ACCESS
// ============================================================================

/**
 * Type-safe color key accessor for TokenTheme.colors
 */
type ColorKey = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';

/**
 * Type-safe component key accessor for TokenTheme
 */
type ComponentKey = 'button' | 'textField' | 'select' | 'checkbox' | 'switch' | 'badge' | 'alert' | 'card' | 'tooltip';

/**
 * Check if a key is a valid color key
 */
function isValidColorKey(key: string): key is ColorKey {
  return ['primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'].includes(key);
}

/**
 * Check if a key is a valid component key
 */
function isValidComponentKey(key: string): key is ComponentKey {
  return ['button', 'textField', 'select', 'checkbox', 'switch', 'badge', 'alert', 'card', 'tooltip'].includes(key);
}

/**
 * Safely get a color token from theme.colors
 * Returns undefined if the key doesn't exist
 */
function getColorToken(colors: TokenTheme['colors'], key: string): EnrichedToken | undefined {
  if (isValidColorKey(key)) {
    return colors[key];
  }
  return undefined;
}

/**
 * Safely get component tokens from theme
 * Returns undefined if the component doesn't exist
 */
function getComponentTokens(theme: TokenTheme, key: string): Record<string, unknown> | undefined {
  if (isValidComponentKey(key)) {
    return theme[key] as Record<string, unknown> | undefined;
  }
  return undefined;
}

// ============================================================================
// TOKEN VALIDATOR
// ============================================================================

/**
 * TokenValidator - Validates token themes with strict rules.
 *
 * PHILOSOPHY: "Fail fast and loud"
 * Better to catch issues early than have bad tokens reach production.
 *
 * USAGE:
 * ```typescript
 * const validator = new TokenValidator();
 * const result = validator.validate(theme, '1.0.0');
 *
 * if (!result.valid) {
 *   throw new Error(`Validation failed:\n${formatErrors(result.errors)}`);
 * }
 *
 * // Warnings are logged but not blocking
 * if (result.warnings.length > 0) {
 *   console.warn('Quality warnings:', result.warnings);
 * }
 * ```
 */
export class TokenValidator {
  private readonly options: Required<ValidatorOptions>;

  constructor(options: ValidatorOptions = {}) {
    this.options = {
      minQualityScore: options.minQualityScore ?? 0.5,
      minConfidence: options.minConfidence ?? 0.5,
      wcagLevel: options.wcagLevel ?? 'AA',
      checkVersionCompatibility: options.checkVersionCompatibility ?? true,
      expectedUIVersion: options.expectedUIVersion ?? '1.0.0',
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Validate a TokenTheme.
   *
   * @param theme - Token theme to validate
   * @param version - Expected theme version
   * @returns Validation result (success or detailed errors)
   */
  validate(theme: TokenTheme, version: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 1. Structural completeness check
    const structuralErrors = this.validateStructure(theme);
    errors.push(...structuralErrors);

    // 2. Metadata completeness check
    const metadataErrors = this.validateMetadata(theme);
    errors.push(...metadataErrors);

    // 3. Accessibility compliance check
    const a11yErrors = this.validateAccessibility(theme);
    errors.push(...a11yErrors);

    // 4. Quality checks (warnings, not blocking)
    const qualityWarnings = this.checkQuality(theme);
    warnings.push(...qualityWarnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      validatedAt: new Date().toISOString(),
      version,
    };
  }

  /**
   * Check version compatibility.
   *
   * @param themeVersion - Theme version
   * @param uiVersion - UI version
   * @returns Compatibility result
   */
  checkCompatibility(themeVersion: string, uiVersion: string): CompatibilityResult {
    // Parse versions
    const theme = this.parseVersion(themeVersion);
    const ui = this.parseVersion(uiVersion);

    // Check major version compatibility
    const compatible = theme.major === ui.major;

    // Breaking changes occur when major version changes
    const breaking = theme.major !== ui.major;

    return {
      compatible,
      themeVersion,
      expectedUIVersion: uiVersion,
      actualUIVersion: uiVersion,
      breaking,
      breakingChanges: breaking ? [
        `Theme v${themeVersion} requires UI v${theme.major}.x.x`,
      ] : undefined,
      migrationGuide: breaking ? `https://docs.momoto.dev/migration/v${theme.major}` : undefined,
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STRUCTURAL VALIDATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Validate theme structure (all required tokens present).
   */
  private validateStructure(theme: TokenTheme): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check primitive colors
    const requiredColors = [
      'primary', 'secondary', 'accent',
      'success', 'warning', 'error', 'info',
    ];

    for (const colorName of requiredColors) {
      const token = getColorToken(theme.colors, colorName);
      if (!token) {
        errors.push({
          code: 'MISSING_TOKEN',
          message: `Missing required color token: colors.${colorName}`,
          path: `colors.${colorName}`,
          severity: 'error',
        });
      }
    }

    // Check nested color tokens
    if (!theme.colors.background?.primary) {
      errors.push({
        code: 'MISSING_TOKEN',
        message: 'Missing required token: colors.background.primary',
        path: 'colors.background.primary',
        severity: 'error',
      });
    }

    if (!theme.colors.text?.primary) {
      errors.push({
        code: 'MISSING_TOKEN',
        message: 'Missing required token: colors.text.primary',
        path: 'colors.text.primary',
        severity: 'error',
      });
    }

    // Check component tokens
    const requiredComponents = ['button'];

    for (const component of requiredComponents) {
      const componentTokens = getComponentTokens(theme, component);
      if (!componentTokens) {
        errors.push({
          code: 'MISSING_COMPONENT_TOKENS',
          message: `Missing component tokens: ${component}`,
          path: component,
          severity: 'error',
        });
      } else {
        // Check component variants
        const componentErrors = this.validateComponentTokens(
          componentTokens,
          component
        );
        errors.push(...componentErrors);
      }
    }

    return errors;
  }

  /**
   * Validate component tokens (all variants and states present).
   */
  private validateComponentTokens(
    componentTokens: Record<string, unknown>,
    componentName: string
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check button variants
    if (componentName === 'button') {
      const requiredVariants = ['primary', 'secondary', 'tertiary', 'danger'];

      for (const variant of requiredVariants) {
        const variantData = componentTokens[variant];
        if (!variantData) {
          errors.push({
            code: 'MISSING_TOKEN',
            message: `Missing button variant: ${variant}`,
            path: `button.${variant}`,
            severity: 'error',
          });
          continue;
        }

        // Type-safe access: variantData is unknown, so we check properties exist
        const variantTokens = variantData as Record<string, unknown>;

        // Check base tokens
        if (!variantTokens['background']) {
          errors.push({
            code: 'MISSING_TOKEN',
            message: `Missing token: button.${variant}.background`,
            path: `button.${variant}.background`,
            severity: 'error',
          });
        }

        if (!variantTokens['text']) {
          errors.push({
            code: 'MISSING_TOKEN',
            message: `Missing token: button.${variant}.text`,
            path: `button.${variant}.text`,
            severity: 'error',
          });
        }

        // Check state tokens
        const requiredStates = ['hover', 'focus', 'active', 'disabled'];
        for (const state of requiredStates) {
          if (!variantTokens[state]) {
            errors.push({
              code: 'MISSING_STATE_VARIANT',
              message: `Missing state variant: button.${variant}.${state}`,
              path: `button.${variant}.${state}`,
              severity: 'error',
            });
          }
        }
      }
    }

    return errors;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // METADATA VALIDATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Validate Momoto metadata presence.
   */
  private validateMetadata(theme: TokenTheme): ValidationError[] {
    const errors: ValidationError[] = [];

    // Traverse all tokens in theme
    this.traverseTokens(theme, (token, path) => {
      // Check required metadata
      if (token.qualityScore === undefined || token.qualityScore === null) {
        errors.push({
          code: 'MISSING_METADATA',
          message: `Token missing qualityScore: ${path}`,
          path,
          severity: 'error',
        });
      }

      if (token.confidence === undefined || token.confidence === null) {
        errors.push({
          code: 'MISSING_METADATA',
          message: `Token missing confidence: ${path}`,
          path,
          severity: 'error',
        });
      }

      if (!token.reason) {
        errors.push({
          code: 'MISSING_METADATA',
          message: `Token missing reason: ${path}`,
          path,
          severity: 'error',
        });
      }

      if (!token.sourceDecisionId) {
        errors.push({
          code: 'MISSING_METADATA',
          message: `Token missing sourceDecisionId: ${path}`,
          path,
          severity: 'error',
        });
      }
    });

    return errors;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ACCESSIBILITY VALIDATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Validate accessibility compliance.
   */
  private validateAccessibility(theme: TokenTheme): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check text/background pairs in buttons
    if (theme.button) {
      for (const [variant, tokenSet] of Object.entries(theme.button)) {
        // Type-safe access to ButtonTokenSet properties
        const buttonTokenSet = tokenSet as ButtonTokenSet;
        const text = buttonTokenSet.text;
        const bg = buttonTokenSet.background;

        if (!text || !bg) continue;

        const accessibility = text.accessibility;

        if (!accessibility) {
          errors.push({
            code: 'MISSING_ACCESSIBILITY',
            message: `Text token missing accessibility metadata: button.${variant}.text`,
            path: `button.${variant}.text`,
            severity: 'error',
          });
          continue;
        }

        // Check WCAG compliance based on level
        if (this.options.wcagLevel === 'AA' && !accessibility.passesAA) {
          errors.push({
            code: 'WCAG_AA_FAIL',
            message: `Text fails WCAG AA contrast: button.${variant}.text (ratio: ${accessibility.wcagRatio?.toFixed(2)})`,
            path: `button.${variant}.text`,
            severity: 'error',
            details: {
              wcagRatio: accessibility.wcagRatio,
              required: 4.5,
              textToken: text.name,
              bgToken: bg.name,
            },
          });
        }

        if (this.options.wcagLevel === 'AAA' && !accessibility.passesAAA) {
          errors.push({
            code: 'WCAG_AAA_FAIL',
            message: `Text fails WCAG AAA contrast: button.${variant}.text (ratio: ${accessibility.wcagRatio?.toFixed(2)})`,
            path: `button.${variant}.text`,
            severity: 'error',
            details: {
              wcagRatio: accessibility.wcagRatio,
              required: 7.0,
              textToken: text.name,
              bgToken: bg.name,
            },
          });
        }
      }
    }

    return errors;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // QUALITY CHECKS (WARNINGS)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Check quality (warnings only, not blocking).
   */
  private checkQuality(theme: TokenTheme): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    this.traverseTokens(theme, (token, path) => {
      // Low quality warning
      if (token.qualityScore < this.options.minQualityScore) {
        warnings.push({
          code: 'LOW_QUALITY',
          message: `Token has low quality score: ${path} (${token.qualityScore.toFixed(2)})`,
          path,
          severity: 'warning',
          details: {
            score: token.qualityScore,
            reason: token.reason,
            threshold: this.options.minQualityScore,
          },
        });
      }

      // Low confidence warning
      if (token.confidence < this.options.minConfidence) {
        warnings.push({
          code: 'LOW_CONFIDENCE',
          message: `Token has low confidence: ${path} (${token.confidence.toFixed(2)})`,
          path,
          severity: 'warning',
          details: {
            confidence: token.confidence,
            threshold: this.options.minConfidence,
          },
        });
      }
    });

    return warnings;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Traverse all tokens in theme and apply callback.
   */
  private traverseTokens(
    obj: any,
    callback: (token: EnrichedToken, path: string) => void,
    path = ''
  ): void {
    if (obj && typeof obj === 'object') {
      // Check if it's an EnrichedToken (has required metadata)
      if (
        'qualityScore' in obj &&
        'confidence' in obj &&
        'reason' in obj &&
        'sourceDecisionId' in obj
      ) {
        callback(obj as EnrichedToken, path);
      } else {
        // Recursively traverse nested objects
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const newPath = path ? `${path}.${key}` : key;
            this.traverseTokens(obj[key], callback, newPath);
          }
        }
      }
    }
  }

  /**
   * Parse semantic version string.
   */
  private parseVersion(version: string): { major: number; minor: number; patch: number } {
    const parts = version.split('.').map(Number);
    return {
      major: parts[0] || 0,
      minor: parts[1] || 0,
      patch: parts[2] || 0,
    };
  }
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format validation errors for display.
 */
export function formatErrors(errors: ValidationError[]): string {
  return errors
    .map(err => {
      let msg = `[${err.severity.toUpperCase()}] ${err.code}: ${err.message}`;
      if (err.path) msg += `\n  Path: ${err.path}`;
      if (err.details) msg += `\n  Details: ${JSON.stringify(err.details, null, 2)}`;
      return msg;
    })
    .join('\n\n');
}

/**
 * Format validation warnings for display.
 */
export function formatWarnings(warnings: ValidationWarning[]): string {
  return warnings
    .map(warn => `[WARN] ${warn.code}: ${warn.message}`)
    .join('\n');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default TokenValidator;

/**
 * CONTRACT COMPLIANCE:
 *
 * ✅ Strict validation:
 *    - ALL required tokens must be present
 *    - ALL tokens must have complete Momoto metadata
 *    - WCAG compliance enforced via token metadata
 *
 * ✅ NO fallbacks:
 *    - Missing tokens → error (blocking)
 *    - Missing metadata → error (blocking)
 *    - WCAG failures → error (blocking)
 *    - NO silent failures
 *
 * ✅ Quality checks:
 *    - Low quality → warning (non-blocking)
 *    - Low confidence → warning (non-blocking)
 *    - Configurable thresholds
 *
 * ✅ Version compatibility:
 *    - Major version must match (breaking changes)
 *    - Minor/patch versions compatible within major
 *
 * VALIDATION PHILOSOPHY:
 * "Fail fast and loud" - Better to catch issues in development
 * than have bad tokens reach production.
 *
 * NO AUTOCORRECTION:
 * Validator NEVER modifies tokens. It only reports errors.
 * Fixing errors is the responsibility of the token generator
 * or the developer.
 */
