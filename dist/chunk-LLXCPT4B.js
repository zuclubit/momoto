'use strict';

var chunkX3KESCNX_js = require('./chunk-X3KESCNX.js');
var chunk5YMPXU57_js = require('./chunk-5YMPXU57.js');
var chunkZM4FIU5F_js = require('./chunk-ZM4FIU5F.js');

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// application/use-cases/EnforceEnterpriseGovernance.ts
var EnforceEnterpriseGovernance = class _EnforceEnterpriseGovernance {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(config = {}) {
    // ─────────────────────────────────────────────────────────────────────────
    // DEPENDENCIES
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "evaluator");
    chunkZM4FIU5F_js.__publicField(this, "policySet");
    chunkZM4FIU5F_js.__publicField(this, "config");
    chunkZM4FIU5F_js.__publicField(this, "auditPort");
    this.config = config;
    this.evaluator = new chunkX3KESCNX_js.GovernanceEvaluator();
    this.policySet = config.policySet ?? chunkX3KESCNX_js.createDefaultPolicySet();
    this.auditPort = config.auditPort;
    if (config.customEvaluators) {
      for (const [name, evaluator] of Object.entries(config.customEvaluators)) {
        this.evaluator.registerCustomEvaluator(name, evaluator);
      }
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXECUTION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Executes governance enforcement on a subject.
   */
  async execute(input) {
    try {
      const evalInput = this.buildEvaluationInput(input);
      const policies = this.getApplicablePolicies(input);
      const evaluation = this.evaluator.evaluate(policies, evalInput);
      const summary = this.generateSummary(evaluation, input.subject);
      let fixes;
      if (this.config.autoFix && !input.validationOnly) {
        fixes = this.attemptAutoFixes(evaluation);
      }
      let auditId;
      if (this.auditPort && !input.validationOnly) {
        auditId = await this.auditPort.logGovernanceDecision({
          subject: input.subject,
          evaluation,
          summary,
          fixes,
          timestamp: /* @__PURE__ */ new Date()
        });
      }
      const output = {
        compliant: evaluation.overallPassed,
        complianceScore: evaluation.overallScore,
        evaluation,
        summary,
        fixes,
        auditId
      };
      return chunk5YMPXU57_js.success(output);
    } catch (error) {
      return chunk5YMPXU57_js.failure(
        error instanceof Error ? error : new Error("Unknown error during governance enforcement")
      );
    }
  }
  /**
   * Quick check - returns only pass/fail.
   */
  async quickCheck(input) {
    const result = await this.execute({ ...input, validationOnly: true });
    return result.success && result.value.compliant;
  }
  /**
   * Gets the current policy set.
   */
  getPolicySet() {
    return this.policySet;
  }
  /**
   * Creates a new instance with additional policies.
   */
  withPolicies(policies) {
    let newSet = this.policySet;
    for (const policy of policies) {
      newSet = newSet.add(policy);
    }
    return new _EnforceEnterpriseGovernance({
      ...this.config,
      policySet: newSet
    });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Builds evaluation input from enforcement input.
   */
  buildEvaluationInput(input) {
    const subject = input.subject;
    const baseContext = {
      scope: this.inferScope(subject),
      ...input.context
    };
    switch (subject.type) {
      case "color":
        return {
          context: { ...baseContext, componentName: subject.purpose },
          color: subject.color
        };
      case "tokens":
        return {
          context: baseContext,
          tokens: subject.tokens,
          tokenNames: subject.tokens.all().map((t) => t.name)
        };
      case "theme":
        return {
          context: baseContext,
          color: subject.brandColor,
          themeHasLightMode: subject.hasLightMode,
          themeHasDarkMode: subject.hasDarkMode
        };
      case "component":
        return {
          context: { ...baseContext, componentName: subject.componentName },
          color: subject.brandColor,
          tokens: subject.tokens,
          tokenNames: subject.tokens?.all().map((t) => t.name)
        };
      case "accessibility":
        return {
          context: baseContext,
          color: subject.foreground,
          contrastRatio: subject.contrastRatio,
          apcaValue: subject.apcaValue
        };
    }
  }
  /**
   * Infers scope from subject type.
   */
  inferScope(subject) {
    switch (subject.type) {
      case "color":
        return "component";
      case "tokens":
        return "token";
      case "theme":
        return "theme";
      case "component":
        return "component";
      case "accessibility":
        return "accessibility";
    }
  }
  /**
   * Gets applicable policy set with any additional policies.
   */
  getApplicablePolicies(input) {
    let policies = this.policySet;
    if (input.additionalPolicies) {
      for (const policy of input.additionalPolicies) {
        policies = policies.add(policy);
      }
    }
    return policies;
  }
  /**
   * Generates human-readable summary.
   */
  generateSummary(evaluation, subject) {
    const status = evaluation.overallPassed ? "pass" : evaluation.blockingViolations ? "fail" : "warning";
    const subjectLabel = this.getSubjectLabel(subject);
    let headline;
    if (status === "pass") {
      headline = `${subjectLabel} passes all governance checks (score: ${evaluation.overallScore.toFixed(0)}%)`;
    } else if (status === "fail") {
      headline = `${subjectLabel} has ${evaluation.criticalViolations.length} critical violations`;
    } else {
      headline = `${subjectLabel} has ${evaluation.allViolations.length} non-critical issues`;
    }
    const details = [];
    details.push(`Evaluated ${evaluation.totalPolicies} policies`);
    details.push(`Passed: ${evaluation.passedPolicies}, Failed: ${evaluation.failedPolicies}`);
    if (evaluation.allViolations.length > 0) {
      details.push("Violations:");
      for (const v of evaluation.allViolations.slice(0, 5)) {
        details.push(`  - [${v.severity}] ${v.message}`);
      }
      if (evaluation.allViolations.length > 5) {
        details.push(`  ... and ${evaluation.allViolations.length - 5} more`);
      }
    }
    if (evaluation.allWarnings.length > 0) {
      details.push(`Warnings: ${evaluation.allWarnings.length}`);
    }
    const recommendations = [];
    for (const v of evaluation.allViolations) {
      if (v.suggestion && !recommendations.includes(v.suggestion)) {
        recommendations.push(v.suggestion);
      }
    }
    return {
      status,
      headline,
      details,
      recommendations: recommendations.slice(0, 5)
    };
  }
  /**
   * Gets a human-readable label for the subject.
   */
  getSubjectLabel(subject) {
    switch (subject.type) {
      case "color":
        return `Color (${subject.purpose ?? "general"})`;
      case "tokens":
        return "Token collection";
      case "theme":
        return "Theme configuration";
      case "component":
        return `Component "${subject.componentName}"`;
      case "accessibility":
        return "Accessibility check";
    }
  }
  /**
   * Attempts to auto-fix fixable violations.
   */
  attemptAutoFixes(evaluation) {
    const fixable = this.evaluator.getAutoFixableViolations(evaluation);
    const details = [];
    let successful = 0;
    for (const violation of fixable) {
      details.push({
        violation,
        fixed: false,
        fixDescription: "Auto-fix not yet implemented for this violation type"
      });
    }
    return {
      attempted: fixable.length,
      successful,
      failed: fixable.length - successful,
      details
    };
  }
};
async function checkColorGovernance(colorHex, purpose) {
  const colorResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(colorHex);
  if (!colorResult.success) {
    return chunk5YMPXU57_js.failure(new Error(`Invalid color: ${colorResult.error.message}`));
  }
  const governance = new EnforceEnterpriseGovernance();
  return governance.execute({
    subject: {
      type: "color",
      color: colorResult.value,
      purpose
    }
  });
}
async function checkAccessibilityGovernance(foregroundHex, backgroundHex) {
  const fgResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(foregroundHex);
  const bgResult = chunkX3KESCNX_js.PerceptualColor.tryFromHex(backgroundHex);
  if (!fgResult.success) {
    return chunk5YMPXU57_js.failure(new Error(`Invalid foreground color: ${fgResult.error.message}`));
  }
  if (!bgResult.success) {
    return chunk5YMPXU57_js.failure(new Error(`Invalid background color: ${bgResult.error.message}`));
  }
  const fg = fgResult.value;
  const bg = bgResult.value;
  const fgLum = fg.oklch.l;
  const bgLum = bg.oklch.l;
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  const contrastRatio = (lighter + 0.05) / (darker + 0.05);
  const apcaValue = Math.abs(bgLum - fgLum) * 100;
  const governance = new EnforceEnterpriseGovernance();
  return governance.execute({
    subject: {
      type: "accessibility",
      foreground: fg,
      background: bg,
      contrastRatio,
      apcaValue
    }
  });
}

// application/ports/outbound/GovernanceAuditPort.ts
var NoOpAuditAdapter = class {
  async logGovernanceDecision() {
    return `audit-${Date.now()}`;
  }
  async logViolation() {
  }
  async logAutoFix() {
  }
  async getAuditHistory() {
    return [];
  }
  async generateAuditReport(options) {
    return {
      generatedAt: /* @__PURE__ */ new Date(),
      period: { start: options.startDate, end: options.endDate },
      summary: {
        totalDecisions: 0,
        compliantDecisions: 0,
        nonCompliantDecisions: 0,
        complianceRate: 100,
        totalViolations: 0,
        autoFixAttempts: 0,
        autoFixSuccesses: 0
      },
      breakdowns: {
        byPolicy: {},
        bySeverity: {}
      },
      content: "No audit data available"
    };
  }
};
var ConsoleAuditAdapter = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "entries", []);
  }
  async logGovernanceDecision(decision) {
    const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.group(`[Governance Audit] ${decision.summary.status.toUpperCase()}`);
    console.log("ID:", id);
    console.log("Subject:", decision.subject.type);
    console.log("Score:", decision.evaluation.overallScore.toFixed(1) + "%");
    console.log("Violations:", decision.evaluation.allViolations.length);
    console.log("Headline:", decision.summary.headline);
    console.groupEnd();
    this.entries.push({
      id,
      type: "decision",
      timestamp: decision.timestamp,
      data: decision
    });
    return id;
  }
  async logViolation(violation, context) {
    console.warn(
      `[Governance Violation] [${violation.severity}] ${violation.policyName}: ${violation.message}`
    );
    this.entries.push({
      id: `violation-${Date.now()}`,
      type: "violation",
      timestamp: context.timestamp,
      data: violation,
      context
    });
  }
  async logAutoFix(fix) {
    console.info(
      `[Governance AutoFix] ${fix.successful ? "\u2713" : "\u2717"} ${fix.fixDescription || "No description"}`
    );
    this.entries.push({
      id: `fix-${Date.now()}`,
      type: "autofix",
      timestamp: fix.timestamp,
      data: fix
    });
  }
  async getAuditHistory(filter) {
    let filtered = [...this.entries];
    if (filter.startDate) {
      filtered = filtered.filter((e) => e.timestamp >= filter.startDate);
    }
    if (filter.endDate) {
      filtered = filtered.filter((e) => e.timestamp <= filter.endDate);
    }
    if (filter.limit) {
      filtered = filtered.slice(filter.offset || 0, (filter.offset || 0) + filter.limit);
    }
    return filtered;
  }
  async generateAuditReport(options) {
    const decisions = this.entries.filter((e) => e.type === "decision");
    const compliant = decisions.filter((d) => d.data.evaluation.overallPassed).length;
    const totalViolations = decisions.reduce(
      (sum, d) => sum + d.data.evaluation.allViolations.length,
      0
    );
    return {
      generatedAt: /* @__PURE__ */ new Date(),
      period: { start: options.startDate, end: options.endDate },
      summary: {
        totalDecisions: decisions.length,
        compliantDecisions: compliant,
        nonCompliantDecisions: decisions.length - compliant,
        complianceRate: decisions.length > 0 ? compliant / decisions.length * 100 : 100,
        totalViolations,
        autoFixAttempts: this.entries.filter((e) => e.type === "autofix").length,
        autoFixSuccesses: this.entries.filter(
          (e) => e.type === "autofix" && e.data.successful
        ).length
      },
      breakdowns: {
        byPolicy: {},
        bySeverity: {}
      },
      content: `Audit report for ${decisions.length} governance decisions`
    };
  }
};
var noOpAuditAdapter = new NoOpAuditAdapter();
var consoleAuditAdapter = new ConsoleAuditAdapter();

exports.ConsoleAuditAdapter = ConsoleAuditAdapter;
exports.EnforceEnterpriseGovernance = EnforceEnterpriseGovernance;
exports.NoOpAuditAdapter = NoOpAuditAdapter;
exports.checkAccessibilityGovernance = checkAccessibilityGovernance;
exports.checkColorGovernance = checkColorGovernance;
exports.consoleAuditAdapter = consoleAuditAdapter;
exports.noOpAuditAdapter = noOpAuditAdapter;
//# sourceMappingURL=chunk-LLXCPT4B.js.map
//# sourceMappingURL=chunk-LLXCPT4B.js.map