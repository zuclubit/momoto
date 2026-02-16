/**
 * @fileoverview Validation Types - Token Theme Validation
 *
 * FASE 12: Token System Enhancement
 *
 * Types for TokenValidator - strict validation with NO fallbacks.
 *
 * CONTRACT:
 * - Validation errors are BLOCKING
 * - NO autocorrection, NO defaults
 * - Complete transparency about failures
 *
 * @module momoto-ui/domain/tokens/types/Validation
 * @version 1.0.0
 */

// ============================================================================
// ERROR & WARNING TYPES
// ============================================================================

/**
 * Validation error severity.
 */
export type ValidationSeverity = 'error' | 'warning';

/**
 * Validation error codes.
 */
export type ValidationErrorCode =
  | 'VERSION_MISMATCH'
  | 'MISSING_TOKEN'
  | 'MISSING_COMPONENT_TOKENS'
  | 'MISSING_STATE_VARIANT'
  | 'MISSING_METADATA'
  | 'MISSING_ACCESSIBILITY'
  | 'WCAG_AA_FAIL'
  | 'WCAG_AAA_FAIL'
  | 'INVALID_TOKEN_TYPE'
  | 'INVALID_TOKEN_VALUE'
  | 'LOW_QUALITY'
  | 'LOW_CONFIDENCE';

/**
 * Validation error.
 */
export interface ValidationError {
  /** Error code */
  code: ValidationErrorCode;

  /** Human-readable error message */
  message: string;

  /** Token path where error occurred (e.g., 'button.primary.background') */
  path?: string;

  /** Severity (error or warning) */
  severity: ValidationSeverity;

  /** Additional error details */
  details?: Record<string, any>;
}

/**
 * Validation warning (non-blocking).
 */
export interface ValidationWarning extends ValidationError {
  severity: 'warning';
}

// ============================================================================
// VALIDATION RESULT
// ============================================================================

/**
 * Result of token theme validation.
 */
export interface ValidationResult {
  /** Whether validation passed (no errors) */
  valid: boolean;

  /** Validation errors (blocking) */
  errors: ValidationError[];

  /** Validation warnings (non-blocking) */
  warnings: ValidationWarning[];

  /** Validation timestamp */
  validatedAt: string;

  /** Theme version validated */
  version: string;
}

// ============================================================================
// VERSION COMPATIBILITY
// ============================================================================

/**
 * Version compatibility check result.
 */
export interface CompatibilityResult {
  /** Whether versions are compatible */
  compatible: boolean;

  /** Theme version */
  themeVersion: string;

  /** Expected UI version range */
  expectedUIVersion: string;

  /** Actual UI version */
  actualUIVersion: string;

  /** Whether there are breaking changes */
  breaking: boolean;

  /** List of breaking changes (if any) */
  breakingChanges?: string[];

  /** Migration guide URL (if breaking) */
  migrationGuide?: string;
}

// ============================================================================
// VALIDATION OPTIONS
// ============================================================================

/**
 * Options for TokenValidator.
 */
export interface ValidatorOptions {
  /** Minimum quality score (for warnings, not blocking) */
  minQualityScore?: number;

  /** Minimum confidence (for warnings, not blocking) */
  minConfidence?: number;

  /** WCAG level to validate (AA or AAA) */
  wcagLevel?: 'AA' | 'AAA';

  /** Whether to check version compatibility */
  checkVersionCompatibility?: boolean;

  /** Expected UI version (for compatibility check) */
  expectedUIVersion?: string;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default ValidationResult;

/**
 * VALIDATION CONTRACT:
 *
 * TokenValidator enforces strict validation with NO fallbacks.
 *
 * ✅ VALIDATION CHECKS:
 * - Structure completeness (all required tokens present)
 * - Metadata completeness (qualityScore, confidence, reason, sourceDecisionId)
 * - Accessibility compliance (WCAG AA/AAA)
 * - Version compatibility
 *
 * ❌ VALIDATION DOES NOT:
 * - Autocorrect errors
 * - Provide default values
 * - Silently ignore failures
 * - Make perceptual decisions
 *
 * ERRORS VS WARNINGS:
 * - Errors: BLOCKING (missing tokens, missing metadata, WCAG failures)
 * - Warnings: NON-BLOCKING (low quality, low confidence)
 *
 * PHILOSOPHY:
 * "Fail fast and loud" - Better to catch issues early than have
 * bad tokens reach production.
 */
