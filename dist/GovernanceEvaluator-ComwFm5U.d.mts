import { j as PolicyCategory, k as PolicyEnforcement, R as Result, P as PerceptualColor } from './UIState-CG23I-mF.mjs';
import { T as TokenCollection } from './TokenCollection-BHaIwQnZ.mjs';

/**
 * @fileoverview EnterprisePolicy Value Object
 *
 * Immutable value object representing an enterprise-wide design policy.
 * Policies define rules that must be enforced across all products.
 *
 * Cross-cutting concerns addressed:
 * - Accessibility compliance (WCAG/APCA)
 * - Brand color governance
 * - Token naming conventions
 * - Theme consistency rules
 * - Audit/traceability requirements
 *
 * @module momoto-ui/domain/governance/value-objects/EnterprisePolicy
 * @version 1.0.0
 */

/**
 * Severity level for policy violations.
 */
type PolicySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
/**
 * Policy scope defines where the policy applies.
 */
type PolicyScope = 'global' | 'component' | 'token' | 'theme' | 'accessibility';
/**
 * Policy evaluation context.
 */
interface PolicyContext {
    readonly scope: PolicyScope;
    readonly componentName?: string;
    readonly tokenPath?: string[];
    readonly themeMode?: 'light' | 'dark';
    readonly brandColor?: string;
    readonly metadata?: Record<string, unknown>;
}
/**
 * Policy violation details.
 */
interface PolicyViolationDetail {
    readonly policyId: string;
    readonly policyName: string;
    readonly severity: PolicySeverity;
    readonly message: string;
    readonly context: PolicyContext;
    readonly suggestion?: string;
    readonly autoFixable: boolean;
}
/**
 * Policy evaluation result.
 */
interface PolicyEvaluationResult {
    readonly passed: boolean;
    readonly violations: readonly PolicyViolationDetail[];
    readonly warnings: readonly PolicyViolationDetail[];
    readonly score: number;
    readonly evaluatedAt: Date;
}
/**
 * Configuration for creating an EnterprisePolicy.
 */
interface EnterprisePolicyConfig {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly category: PolicyCategory;
    readonly scope: PolicyScope;
    readonly enforcement: PolicyEnforcement;
    readonly severity: PolicySeverity;
    readonly version: string;
    readonly rules: readonly PolicyRule[];
    readonly enabled?: boolean;
    readonly metadata?: Record<string, unknown>;
}
/**
 * Individual policy rule.
 */
interface PolicyRule {
    readonly id: string;
    readonly name: string;
    readonly condition: PolicyCondition;
    readonly message: string;
    readonly suggestion?: string;
    readonly autoFixable: boolean;
}
/**
 * Policy condition types.
 */
type PolicyCondition = AccessibilityCondition | ColorCondition | TokenCondition | ThemeCondition | CustomCondition;
interface AccessibilityCondition {
    readonly type: 'accessibility';
    readonly standard: 'wcag-aa' | 'wcag-aaa' | 'apca-body' | 'apca-ui';
    readonly minContrast?: number;
}
interface ColorCondition {
    readonly type: 'color';
    readonly check: 'brand-alignment' | 'harmony' | 'saturation' | 'lightness';
    readonly threshold?: number;
    readonly tolerance?: number;
}
interface TokenCondition {
    readonly type: 'token';
    readonly check: 'naming-convention' | 'hierarchy' | 'completeness' | 'consistency';
    readonly pattern?: string;
    readonly requiredTokens?: string[];
}
interface ThemeCondition {
    readonly type: 'theme';
    readonly check: 'mode-coverage' | 'semantic-mapping' | 'scale-consistency';
    readonly modes?: ('light' | 'dark')[];
}
interface CustomCondition {
    readonly type: 'custom';
    readonly evaluator: string;
    readonly params?: Record<string, unknown>;
}
/**
 * EnterprisePolicy - Immutable value object for enterprise design policies.
 *
 * Represents a single governance rule that can be evaluated against
 * design decisions, tokens, themes, or components.
 *
 * @example
 * ```typescript
 * const policy = EnterprisePolicy.create({
 *   id: 'accessibility-wcag-aa',
 *   name: 'WCAG AA Compliance',
 *   description: 'All text must meet WCAG AA contrast requirements',
 *   category: 'accessibility',
 *   scope: 'accessibility',
 *   enforcement: 'required',
 *   severity: 'critical',
 *   version: '1.0.0',
 *   rules: [{
 *     id: 'min-contrast',
 *     name: 'Minimum Contrast',
 *     condition: { type: 'accessibility', standard: 'wcag-aa', minContrast: 4.5 },
 *     message: 'Text contrast ratio must be at least 4.5:1',
 *     suggestion: 'Increase color difference between text and background',
 *     autoFixable: true,
 *   }],
 * });
 * ```
 */
declare class EnterprisePolicy {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly category: PolicyCategory;
    readonly scope: PolicyScope;
    readonly enforcement: PolicyEnforcement;
    readonly severity: PolicySeverity;
    readonly version: string;
    readonly rules: readonly PolicyRule[];
    readonly enabled: boolean;
    readonly metadata: Readonly<Record<string, unknown>>;
    private constructor();
    /**
     * Creates a new EnterprisePolicy from configuration.
     */
    static create(config: EnterprisePolicyConfig): Result<EnterprisePolicy, Error>;
    /**
     * Creates a policy without validation (for internal use).
     */
    static unsafe(config: EnterprisePolicyConfig): EnterprisePolicy;
    /**
     * Validates policy configuration.
     */
    static validate(config: EnterprisePolicyConfig): {
        valid: boolean;
        errors: string[];
    };
    /**
     * Checks if this policy applies to a given context.
     */
    appliesTo(context: PolicyContext): boolean;
    /**
     * Returns a new policy with enabled state toggled.
     */
    withEnabled(enabled: boolean): EnterprisePolicy;
    /**
     * Returns a new policy with updated metadata.
     */
    withMetadata(metadata: Record<string, unknown>): EnterprisePolicy;
    /**
     * Checks if policy is blocking (must pass for operation to proceed).
     */
    isBlocking(): boolean;
    /**
     * Checks if policy is advisory only (warnings, not errors).
     */
    isAdvisory(): boolean;
    /**
     * Gets the weight of this policy for scoring.
     */
    getWeight(): number;
    /**
     * Serializes policy to plain object.
     */
    toJSON(): EnterprisePolicyConfig;
    /**
     * Checks equality with another policy.
     */
    equals(other: EnterprisePolicy): boolean;
}
/**
 * PolicySet - Collection of enterprise policies.
 */
declare class PolicySet {
    private readonly policies;
    constructor(policies?: EnterprisePolicy[]);
    /**
     * Gets a policy by ID.
     */
    get(id: string): EnterprisePolicy | undefined;
    /**
     * Gets all policies.
     */
    all(): readonly EnterprisePolicy[];
    /**
     * Filters policies by scope.
     */
    byScope(scope: PolicyScope): readonly EnterprisePolicy[];
    /**
     * Filters policies by category.
     */
    byCategory(category: PolicyCategory): readonly EnterprisePolicy[];
    /**
     * Filters policies by enforcement level.
     */
    byEnforcement(enforcement: PolicyEnforcement): readonly EnterprisePolicy[];
    /**
     * Gets only enabled policies.
     */
    enabled(): readonly EnterprisePolicy[];
    /**
     * Gets blocking policies (must pass).
     */
    blocking(): readonly EnterprisePolicy[];
    /**
     * Adds a policy and returns new set.
     */
    add(policy: EnterprisePolicy): PolicySet;
    /**
     * Removes a policy and returns new set.
     */
    remove(id: string): PolicySet;
    /**
     * Gets policies that apply to a context.
     */
    applicableTo(context: PolicyContext): readonly EnterprisePolicy[];
    /**
     * Returns count of policies.
     */
    get size(): number;
    /**
     * Checks if set is empty.
     */
    isEmpty(): boolean;
}

/**
 * @fileoverview GovernanceEvaluator Domain Service
 *
 * Pure domain service for evaluating design decisions against enterprise policies.
 * No external dependencies - operates solely on domain types.
 *
 * @module momoto-ui/domain/governance/services/GovernanceEvaluator
 * @version 1.0.0
 */

/**
 * Input for governance evaluation.
 */
interface GovernanceEvaluationInput {
    readonly context: PolicyContext;
    readonly color?: PerceptualColor;
    readonly tokens?: TokenCollection;
    readonly contrastRatio?: number;
    readonly apcaValue?: number;
    readonly tokenNames?: string[];
    readonly themeHasLightMode?: boolean;
    readonly themeHasDarkMode?: boolean;
}
/**
 * Aggregated evaluation result across all policies.
 */
interface AggregatedEvaluationResult {
    readonly overallPassed: boolean;
    readonly overallScore: number;
    readonly totalPolicies: number;
    readonly passedPolicies: number;
    readonly failedPolicies: number;
    readonly criticalViolations: readonly PolicyViolationDetail[];
    readonly allViolations: readonly PolicyViolationDetail[];
    readonly allWarnings: readonly PolicyViolationDetail[];
    readonly byCategory: Map<string, PolicyEvaluationResult>;
    readonly evaluatedAt: Date;
    readonly blockingViolations: boolean;
}
/**
 * Custom evaluator function type.
 */
type CustomEvaluatorFn = (input: GovernanceEvaluationInput, params?: Record<string, unknown>) => {
    passed: boolean;
    message?: string;
};
/**
 * GovernanceEvaluator - Domain service for policy evaluation.
 *
 * Stateless service that evaluates design decisions against a set of policies.
 * Uses pure functions and domain types only.
 *
 * @example
 * ```typescript
 * const evaluator = new GovernanceEvaluator();
 *
 * const result = evaluator.evaluate(policySet, {
 *   context: { scope: 'accessibility' },
 *   contrastRatio: 4.2,
 * });
 *
 * if (!result.overallPassed) {
 *   console.log('Violations:', result.criticalViolations);
 * }
 * ```
 */
declare class GovernanceEvaluator {
    private readonly customEvaluators;
    /**
     * Registers a custom evaluator function.
     */
    registerCustomEvaluator(name: string, evaluator: CustomEvaluatorFn): void;
    /**
     * Evaluates input against all applicable policies.
     */
    evaluate(policySet: PolicySet, input: GovernanceEvaluationInput): AggregatedEvaluationResult;
    /**
     * Evaluates a single policy.
     */
    evaluatePolicy(policy: EnterprisePolicy, input: GovernanceEvaluationInput): PolicyEvaluationResult;
    /**
     * Quickly checks if all blocking policies pass.
     */
    passesBlockingPolicies(policySet: PolicySet, input: GovernanceEvaluationInput): boolean;
    /**
     * Gets all auto-fixable violations.
     */
    getAutoFixableViolations(result: AggregatedEvaluationResult): readonly PolicyViolationDetail[];
    /**
     * Evaluates a single rule.
     */
    private evaluateRule;
    /**
     * Evaluates accessibility conditions.
     */
    private evaluateAccessibilityCondition;
    /**
     * Evaluates color conditions.
     */
    private evaluateColorCondition;
    /**
     * Evaluates token conditions.
     */
    private evaluateTokenCondition;
    /**
     * Evaluates theme conditions.
     */
    private evaluateThemeCondition;
    /**
     * Evaluates custom conditions.
     */
    private evaluateCustomCondition;
    /**
     * Aggregates individual policy results into overall result.
     */
    private aggregateResults;
}
/**
 * Default evaluator instance.
 */
declare const governanceEvaluator: GovernanceEvaluator;

export { type AccessibilityCondition as A, type ColorCondition as C, EnterprisePolicy as E, GovernanceEvaluator as G, PolicySet as P, type TokenCondition as T, type EnterprisePolicyConfig as a, type PolicyRule as b, type PolicyCondition as c, type ThemeCondition as d, type CustomCondition as e, type PolicyContext as f, governanceEvaluator as g, type PolicySeverity as h, type PolicyScope as i, type PolicyViolationDetail as j, type PolicyEvaluationResult as k, type GovernanceEvaluationInput as l, type AggregatedEvaluationResult as m, type CustomEvaluatorFn as n };
