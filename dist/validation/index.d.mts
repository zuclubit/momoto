import { P as PerceptualColor, R as Result } from '../UIState-CG23I-mF.mjs';
import { T as TokenCollection } from '../TokenCollection-BHaIwQnZ.mjs';
import '../DesignToken-CKW5vfOU.mjs';

/**
 * @fileoverview Conformance Validation System
 *
 * Sistema de validación para verificar conformidad con la arquitectura
 * hexagonal y los principios de Color Intelligence.
 *
 * @module momoto-ui/validation/conformance
 * @version 1.0.0
 */

/**
 * Severity levels for conformance issues.
 */
type ConformanceSeverity = 'error' | 'warning' | 'info';
/**
 * Categories of conformance checks.
 */
type ConformanceCategory = 'architecture' | 'accessibility' | 'color-intelligence' | 'tokens' | 'performance';
/**
 * A single conformance issue.
 */
interface ConformanceIssue {
    readonly id: string;
    readonly category: ConformanceCategory;
    readonly severity: ConformanceSeverity;
    readonly message: string;
    readonly details?: string;
    readonly location?: string;
    readonly suggestion?: string;
}
/**
 * Result of a conformance check.
 */
interface ConformanceCheckResult {
    readonly checkId: string;
    readonly checkName: string;
    readonly passed: boolean;
    readonly issues: ConformanceIssue[];
    readonly metadata?: Record<string, unknown>;
}
/**
 * Complete conformance report.
 */
interface ConformanceReport {
    readonly timestamp: Date;
    readonly version: string;
    readonly summary: {
        readonly totalChecks: number;
        readonly passed: number;
        readonly failed: number;
        readonly errors: number;
        readonly warnings: number;
        readonly infos: number;
    };
    readonly checks: ConformanceCheckResult[];
    readonly overallPassed: boolean;
    readonly complianceScore: number;
}
/**
 * Options for running conformance checks.
 */
interface ConformanceOptions {
    readonly includeInfos?: boolean;
    readonly failOnWarnings?: boolean;
    readonly categories?: ConformanceCategory[];
    readonly skipChecks?: string[];
}
/**
 * ConformanceChecker - Validates conformance with design system standards.
 *
 * Runs various checks to ensure:
 * - Architectural boundaries are respected
 * - Color Intelligence principles are followed
 * - Accessibility requirements are met
 * - Token standards are maintained
 *
 * @example
 * ```typescript
 * const checker = new ConformanceChecker();
 *
 * const report = await checker.runAll({
 *   tokenCollection: tokens,
 *   colors: themeColors,
 * });
 *
 * if (!report.overallPassed) {
 *   console.log('Conformance issues found:', report.summary);
 * }
 * ```
 */
declare class ConformanceChecker {
    private readonly checks;
    constructor();
    /**
     * Run all registered conformance checks.
     */
    runAll(context: ConformanceContext, options?: ConformanceOptions): Promise<ConformanceReport>;
    /**
     * Run a specific conformance check.
     */
    runCheck(checkId: string, context: ConformanceContext): Promise<Result<ConformanceCheckResult, Error>>;
    /**
     * Register a custom conformance check.
     */
    registerCheck(check: ConformanceCheck): void;
    /**
     * Get all registered check IDs.
     */
    getCheckIds(): string[];
    private registerDefaultChecks;
    private generateReport;
    private calculateComplianceScore;
    private getCheckWeight;
}
/**
 * Context provided to conformance checks.
 */
interface ConformanceContext {
    readonly tokenCollection?: TokenCollection;
    readonly colors?: Map<string, PerceptualColor>;
    readonly themeConfig?: unknown;
    readonly sourceCode?: string[];
    readonly cssVariables?: Map<string, string>;
}
/**
 * Base interface for conformance checks.
 */
interface ConformanceCheck {
    readonly id: string;
    readonly name: string;
    readonly category: ConformanceCategory;
    readonly description: string;
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
}
/**
 * Check for WCAG contrast ratio compliance.
 */
declare class ContrastRatioCheck implements ConformanceCheck {
    readonly id = "contrast-ratio";
    readonly name = "WCAG Contrast Ratio";
    readonly category: ConformanceCategory;
    readonly description = "Validates color combinations meet WCAG 2.1 AA contrast requirements";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
    private calculateContrast;
}
/**
 * Check for color blindness accessibility.
 */
declare class ColorBlindnessCheck implements ConformanceCheck {
    readonly id = "color-blindness";
    readonly name = "Color Blindness Accessibility";
    readonly category: ConformanceCategory;
    readonly description = "Validates colors are distinguishable for color-blind users";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
    private isRedGreenPair;
}
/**
 * Check for perceptual uniformity in color scales.
 */
declare class PerceptualUniformityCheck implements ConformanceCheck {
    readonly id = "perceptual-uniformity";
    readonly name = "Perceptual Uniformity";
    readonly category: ConformanceCategory;
    readonly description = "Validates color scales have perceptually uniform steps";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
}
/**
 * Check for colors outside displayable gamut.
 */
declare class GamutBoundaryCheck implements ConformanceCheck {
    readonly id = "gamut-boundary";
    readonly name = "Gamut Boundary";
    readonly category: ConformanceCategory;
    readonly description = "Validates colors are within displayable gamut";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
}
/**
 * Check for hardcoded color values.
 */
declare class HardcodedColorCheck implements ConformanceCheck {
    readonly id = "hardcoded-colors";
    readonly name = "No Hardcoded Colors";
    readonly category: ConformanceCategory;
    readonly description = "Validates no hardcoded color values exist outside the design system";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
}
/**
 * Check token naming conventions.
 */
declare class TokenNamingConventionCheck implements ConformanceCheck {
    readonly id = "token-naming";
    readonly name = "Token Naming Convention";
    readonly category: ConformanceCategory;
    readonly description = "Validates token paths follow naming conventions";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
}
/**
 * Check for token completeness.
 */
declare class TokenCompletenessCheck implements ConformanceCheck {
    readonly id = "token-completeness";
    readonly name = "Token Completeness";
    readonly category: ConformanceCategory;
    readonly description = "Validates required token categories are present";
    private readonly requiredCategories;
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
}
/**
 * Check token type validation.
 */
declare class TokenTypeValidationCheck implements ConformanceCheck {
    readonly id = "token-type-validation";
    readonly name = "Token Type Validation";
    readonly category: ConformanceCategory;
    readonly description = "Validates token values match their declared types";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
    private validateTokenType;
}
/**
 * Check dependency direction in hexagonal architecture.
 */
declare class DependencyDirectionCheck implements ConformanceCheck {
    readonly id = "dependency-direction";
    readonly name = "Dependency Direction";
    readonly category: ConformanceCategory;
    readonly description = "Validates dependencies point inward (hexagonal architecture)";
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
}
/**
 * Check port contracts are properly defined.
 *
 * Validates:
 * - Port files export interfaces (not classes)
 * - Port interfaces use Result types for error handling
 * - Port methods are documented
 *
 * Note: Full AST validation requires TypeScript compiler API.
 * This implementation performs static analysis via regex patterns.
 */
declare class PortContractCheck implements ConformanceCheck {
    readonly id = "port-contract";
    readonly name = "Port Contract Definition";
    readonly category: ConformanceCategory;
    readonly description = "Validates ports define proper contracts with Result types";
    /**
     * Pattern to detect class exports (ports should be interfaces)
     */
    private readonly classExportPattern;
    /**
     * Pattern to detect interface exports (expected for ports)
     */
    private readonly interfaceExportPattern;
    /**
     * Pattern to detect Promise returns without Result wrapper
     */
    private readonly barePromisePattern;
    /**
     * Pattern to detect Result type usage
     */
    private readonly resultTypePattern;
    run(context: ConformanceContext): Promise<ConformanceCheckResult>;
    /**
     * Extract interface/class body starting from a given position.
     * Simplified implementation using brace counting.
     */
    private extractInterfaceBody;
}

/**
 * @fileoverview Conformance Report Generator
 *
 * Generates human-readable reports from conformance check results.
 * Supports multiple output formats: text, markdown, JSON, and HTML.
 *
 * @module momoto-ui/validation/report-generator
 * @version 1.0.0
 */

/**
 * Report output formats.
 */
type ReportFormat = 'text' | 'markdown' | 'json' | 'html';
/**
 * Report generation options.
 */
interface ReportOptions {
    readonly format: ReportFormat;
    readonly includePassedChecks?: boolean;
    readonly includeSuggestions?: boolean;
    readonly includeMetadata?: boolean;
    readonly title?: string;
}
/**
 * ReportGenerator - Generates formatted conformance reports.
 *
 * @example
 * ```typescript
 * const generator = new ReportGenerator();
 *
 * const textReport = generator.generate(conformanceReport, {
 *   format: 'text',
 *   includePassedChecks: false,
 * });
 *
 * const mdReport = generator.generate(conformanceReport, {
 *   format: 'markdown',
 *   title: 'Design System Conformance Report',
 * });
 * ```
 */
declare class ReportGenerator {
    /**
     * Generate a formatted report from conformance results.
     */
    generate(report: ConformanceReport, options: ReportOptions): string;
    private generateTextReport;
    private generateMarkdownReport;
    private generateJsonReport;
    private generateHtmlReport;
    private generateHtmlCheck;
    private generateHtmlIssue;
    private centerText;
    private getSeverityIcon;
    private getSeverityEmoji;
    private getSeverityBadge;
    private formatCategory;
    private groupByCategory;
    private inferCategory;
}

export { ColorBlindnessCheck, type ConformanceCategory, type ConformanceCheck, type ConformanceCheckResult, ConformanceChecker, ConformanceChecker as ConformanceCheckerDefault, type ConformanceContext, type ConformanceIssue, type ConformanceOptions, type ConformanceReport, type ConformanceSeverity, ContrastRatioCheck, DependencyDirectionCheck, GamutBoundaryCheck, HardcodedColorCheck, PerceptualUniformityCheck, PortContractCheck, type ReportFormat, ReportGenerator, ReportGenerator as ReportGeneratorDefault, type ReportOptions, TokenCompletenessCheck, TokenNamingConventionCheck, TokenTypeValidationCheck };
