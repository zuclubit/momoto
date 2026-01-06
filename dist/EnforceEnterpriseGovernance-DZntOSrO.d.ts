import { P as PerceptualColor, R as Result } from './UIState-CG23I-mF.js';
import { m as AggregatedEvaluationResult, j as PolicyViolationDetail, P as PolicySet, n as CustomEvaluatorFn, f as PolicyContext, E as EnterprisePolicy } from './GovernanceEvaluator-EG_kiS-i.js';
import { T as TokenCollection } from './TokenCollection-q4YtsOMz.js';

/**
 * @fileoverview GovernanceAuditPort - Outbound Port
 *
 * Defines the outbound port (driven port) for governance auditing.
 * This is the contract that the governance system uses to log
 * decisions for traceability and compliance reporting.
 *
 * @module momoto-ui/application/ports/outbound/GovernanceAuditPort
 * @version 1.0.0
 */

/**
 * GovernanceAuditPort - Outbound port for audit logging.
 *
 * Implementations:
 * - ConsoleAuditAdapter: Logs to console (development)
 * - FileAuditAdapter: Logs to file system
 * - APIAuditAdapter: Sends to remote audit service
 * - NoOpAuditAdapter: Disables auditing
 */
interface GovernanceAuditPort {
    /**
     * Logs a governance decision.
     * Returns an audit ID for traceability.
     */
    logGovernanceDecision(decision: GovernanceDecision): Promise<string>;
    /**
     * Logs a policy violation.
     */
    logViolation(violation: PolicyViolationDetail, context: AuditContext): Promise<void>;
    /**
     * Logs an auto-fix attempt.
     */
    logAutoFix(fix: AutoFixAttempt): Promise<void>;
    /**
     * Retrieves audit history.
     */
    getAuditHistory(filter: AuditFilter): Promise<AuditEntry[]>;
    /**
     * Generates an audit report.
     */
    generateAuditReport(options: AuditReportOptions): Promise<AuditReport>;
}
/**
 * A governance decision record.
 */
interface GovernanceDecision {
    readonly subject: {
        readonly type: string;
        readonly [key: string]: unknown;
    };
    readonly evaluation: AggregatedEvaluationResult;
    readonly summary: {
        readonly status: 'pass' | 'fail' | 'warning';
        readonly headline: string;
        readonly details: string[];
        readonly recommendations: string[];
    };
    readonly fixes?: {
        readonly attempted: number;
        readonly successful: number;
        readonly failed: number;
        readonly details: Array<{
            readonly violation: PolicyViolationDetail;
            readonly fixed: boolean;
            readonly fixDescription?: string;
        }>;
    };
    readonly timestamp: Date;
}
/**
 * Context for audit logging.
 */
interface AuditContext {
    readonly sessionId?: string;
    readonly userId?: string;
    readonly applicationId?: string;
    readonly componentPath?: string;
    readonly timestamp: Date;
    readonly metadata?: Record<string, unknown>;
}
/**
 * Auto-fix attempt record.
 */
interface AutoFixAttempt {
    readonly violation: PolicyViolationDetail;
    readonly attempted: boolean;
    readonly successful: boolean;
    readonly fixDescription?: string;
    readonly beforeValue?: unknown;
    readonly afterValue?: unknown;
    readonly timestamp: Date;
}
/**
 * Filter for retrieving audit history.
 */
interface AuditFilter {
    readonly startDate?: Date;
    readonly endDate?: Date;
    readonly status?: 'pass' | 'fail' | 'warning';
    readonly policyId?: string;
    readonly severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
    readonly limit?: number;
    readonly offset?: number;
}
/**
 * An audit entry.
 */
interface AuditEntry {
    readonly id: string;
    readonly type: 'decision' | 'violation' | 'autofix';
    readonly timestamp: Date;
    readonly data: GovernanceDecision | PolicyViolationDetail | AutoFixAttempt;
    readonly context?: AuditContext;
}
/**
 * Options for generating audit reports.
 */
interface AuditReportOptions {
    readonly startDate: Date;
    readonly endDate: Date;
    readonly groupBy?: 'policy' | 'severity' | 'day' | 'week';
    readonly format?: 'json' | 'csv' | 'markdown';
    readonly includeDetails?: boolean;
}
/**
 * An audit report.
 */
interface AuditReport {
    readonly generatedAt: Date;
    readonly period: {
        readonly start: Date;
        readonly end: Date;
    };
    readonly summary: {
        readonly totalDecisions: number;
        readonly compliantDecisions: number;
        readonly nonCompliantDecisions: number;
        readonly complianceRate: number;
        readonly totalViolations: number;
        readonly autoFixAttempts: number;
        readonly autoFixSuccesses: number;
    };
    readonly breakdowns: {
        readonly byPolicy: Record<string, {
            pass: number;
            fail: number;
        }>;
        readonly bySeverity: Record<string, number>;
        readonly byDate?: Record<string, number>;
    };
    readonly content: string;
}
/**
 * No-op audit adapter for when auditing is disabled.
 */
declare class NoOpAuditAdapter implements GovernanceAuditPort {
    logGovernanceDecision(): Promise<string>;
    logViolation(): Promise<void>;
    logAutoFix(): Promise<void>;
    getAuditHistory(): Promise<AuditEntry[]>;
    generateAuditReport(options: AuditReportOptions): Promise<AuditReport>;
}
/**
 * Console audit adapter for development.
 */
declare class ConsoleAuditAdapter implements GovernanceAuditPort {
    private entries;
    logGovernanceDecision(decision: GovernanceDecision): Promise<string>;
    logViolation(violation: PolicyViolationDetail, context: AuditContext): Promise<void>;
    logAutoFix(fix: AutoFixAttempt): Promise<void>;
    getAuditHistory(filter: AuditFilter): Promise<AuditEntry[]>;
    generateAuditReport(options: AuditReportOptions): Promise<AuditReport>;
}
declare const noOpAuditAdapter: NoOpAuditAdapter;
declare const consoleAuditAdapter: ConsoleAuditAdapter;

/**
 * @fileoverview EnforceEnterpriseGovernance Use Case
 *
 * Application layer orchestrator for enterprise design governance.
 * Coordinates policy evaluation across all design decisions and provides
 * a unified interface for governance enforcement.
 *
 * This is the "golden path" use case that teams should use for all
 * design decisions to ensure enterprise compliance.
 *
 * @module momoto-ui/application/use-cases/EnforceEnterpriseGovernance
 * @version 1.0.0
 */

/**
 * Configuration for the governance orchestrator.
 */
interface GovernanceConfig {
    /** Policy set to use (default: createDefaultPolicySet()) */
    readonly policySet?: PolicySet;
    /** Whether to fail fast on blocking violations */
    readonly failFast?: boolean;
    /** Whether to auto-fix fixable violations */
    readonly autoFix?: boolean;
    /** Audit port for logging decisions */
    readonly auditPort?: GovernanceAuditPort;
    /** Custom evaluators to register */
    readonly customEvaluators?: Record<string, CustomEvaluatorFn>;
}
/**
 * Input for governance enforcement.
 */
interface GovernanceEnforcementInput {
    /** What is being evaluated */
    readonly subject: GovernanceSubject;
    /** Context for evaluation */
    readonly context?: Partial<PolicyContext>;
    /** Optional override policies (adds to default set) */
    readonly additionalPolicies?: EnterprisePolicy[];
    /** Whether this is a validation-only check (no side effects) */
    readonly validationOnly?: boolean;
}
/**
 * Subject of governance enforcement.
 */
type GovernanceSubject = ColorSubject | TokenSubject | ThemeSubject | ComponentSubject | AccessibilitySubject;
interface ColorSubject {
    readonly type: 'color';
    readonly color: PerceptualColor;
    readonly purpose?: 'brand' | 'text' | 'background' | 'border';
}
interface TokenSubject {
    readonly type: 'tokens';
    readonly tokens: TokenCollection;
}
interface ThemeSubject {
    readonly type: 'theme';
    readonly hasLightMode: boolean;
    readonly hasDarkMode: boolean;
    readonly brandColor?: PerceptualColor;
}
interface ComponentSubject {
    readonly type: 'component';
    readonly componentName: string;
    readonly tokens?: TokenCollection;
    readonly brandColor?: PerceptualColor;
}
interface AccessibilitySubject {
    readonly type: 'accessibility';
    readonly foreground: PerceptualColor;
    readonly background: PerceptualColor;
    readonly contrastRatio: number;
    readonly apcaValue: number;
}
/**
 * Output of governance enforcement.
 */
interface GovernanceEnforcementOutput {
    /** Whether all required policies passed */
    readonly compliant: boolean;
    /** Overall compliance score (0-100) */
    readonly complianceScore: number;
    /** Detailed evaluation result */
    readonly evaluation: AggregatedEvaluationResult;
    /** Human-readable summary */
    readonly summary: GovernanceSummary;
    /** Auto-fix results if enabled */
    readonly fixes?: GovernanceFixes;
    /** Audit ID for traceability */
    readonly auditId?: string;
}
/**
 * Human-readable governance summary.
 */
interface GovernanceSummary {
    readonly status: 'pass' | 'fail' | 'warning';
    readonly headline: string;
    readonly details: string[];
    readonly recommendations: string[];
}
/**
 * Auto-fix results.
 */
interface GovernanceFixes {
    readonly attempted: number;
    readonly successful: number;
    readonly failed: number;
    readonly details: Array<{
        readonly violation: PolicyViolationDetail;
        readonly fixed: boolean;
        readonly fixDescription?: string;
    }>;
}
/**
 * EnforceEnterpriseGovernance - Application orchestrator for governance.
 *
 * This is the primary entry point for teams to ensure their design decisions
 * comply with enterprise policies. It provides:
 *
 * - Unified interface for all governance checks
 * - Automatic policy set management
 * - Human-readable feedback
 * - Optional auto-fixing
 * - Audit trail integration
 *
 * @example
 * ```typescript
 * const governance = new EnforceEnterpriseGovernance();
 *
 * // Check a color
 * const colorResult = await governance.execute({
 *   subject: {
 *     type: 'color',
 *     color: PerceptualColor.fromHex('#3B82F6'),
 *     purpose: 'brand',
 *   },
 * });
 *
 * if (!colorResult.value.compliant) {
 *   console.log(colorResult.value.summary.headline);
 *   console.log(colorResult.value.summary.recommendations);
 * }
 *
 * // Check accessibility
 * const a11yResult = await governance.execute({
 *   subject: {
 *     type: 'accessibility',
 *     foreground: PerceptualColor.fromHex('#000000'),
 *     background: PerceptualColor.fromHex('#FFFFFF'),
 *     contrastRatio: 21,
 *     apcaValue: 106,
 *   },
 * });
 * ```
 */
declare class EnforceEnterpriseGovernance {
    private readonly evaluator;
    private readonly policySet;
    private readonly config;
    private readonly auditPort?;
    constructor(config?: GovernanceConfig);
    /**
     * Executes governance enforcement on a subject.
     */
    execute(input: GovernanceEnforcementInput): Promise<Result<GovernanceEnforcementOutput, Error>>;
    /**
     * Quick check - returns only pass/fail.
     */
    quickCheck(input: GovernanceEnforcementInput): Promise<boolean>;
    /**
     * Gets the current policy set.
     */
    getPolicySet(): PolicySet;
    /**
     * Creates a new instance with additional policies.
     */
    withPolicies(policies: EnterprisePolicy[]): EnforceEnterpriseGovernance;
    /**
     * Builds evaluation input from enforcement input.
     */
    private buildEvaluationInput;
    /**
     * Infers scope from subject type.
     */
    private inferScope;
    /**
     * Gets applicable policy set with any additional policies.
     */
    private getApplicablePolicies;
    /**
     * Generates human-readable summary.
     */
    private generateSummary;
    /**
     * Gets a human-readable label for the subject.
     */
    private getSubjectLabel;
    /**
     * Attempts to auto-fix fixable violations.
     */
    private attemptAutoFixes;
}
/**
 * Quick governance check for a color.
 */
declare function checkColorGovernance(colorHex: string, purpose?: 'brand' | 'text' | 'background' | 'border'): Promise<Result<GovernanceEnforcementOutput, Error>>;
/**
 * Quick governance check for accessibility.
 */
declare function checkAccessibilityGovernance(foregroundHex: string, backgroundHex: string): Promise<Result<GovernanceEnforcementOutput, Error>>;

export { type AuditContext as A, ConsoleAuditAdapter as C, EnforceEnterpriseGovernance as E, type GovernanceConfig as G, NoOpAuditAdapter as N, checkAccessibilityGovernance as a, type GovernanceEnforcementInput as b, checkColorGovernance as c, type GovernanceEnforcementOutput as d, type GovernanceSubject as e, type GovernanceSummary as f, type GovernanceAuditPort as g, type GovernanceDecision as h, type AutoFixAttempt as i, type AuditFilter as j, type AuditEntry as k, type AuditReport as l, consoleAuditAdapter as m, noOpAuditAdapter as n };
