import { success, failure } from './chunk-445P5ZF2.mjs';
import { __publicField } from './chunk-ABD7DB5B.mjs';

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// infrastructure/audit/InMemoryAuditAdapter.ts
var DEFAULT_OPTIONS = {
  maxEntries: 1e4,
  consoleLogging: false,
  logLevel: "info",
  onEntry: () => {
  }
};
var InMemoryAuditAdapter = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(options = {}) {
    // ─────────────────────────────────────────────────────────────────────────
    // PROPERTIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "options");
    __publicField(this, "entries", []);
    __publicField(this, "archivedEntries", []);
    __publicField(this, "entryCounter", 0);
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // LOGGING METHODS
  // ─────────────────────────────────────────────────────────────────────────
  async log(entry) {
    try {
      const id = this.generateId();
      const fullEntry = {
        id,
        timestamp: /* @__PURE__ */ new Date(),
        category: entry.category,
        severity: entry.severity,
        message: entry.message,
        data: entry.data,
        source: entry.source,
        correlationId: entry.correlationId,
        tags: entry.tags
      };
      this.addEntry(fullEntry);
      return success(id);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to log entry")
      );
    }
  }
  async logColorDecision(decision, correlationId) {
    return this.log({
      category: "color-decision",
      severity: "info",
      message: `Color decision: ${decision.rationale}`,
      correlationId,
      source: "color-intelligence",
      data: {
        inputColor: decision.inputColor.hex,
        outputColor: decision.outputColor.hex,
        context: {
          role: decision.role,
          state: decision.state,
          intent: decision.intent
        },
        rationale: decision.rationale,
        transformations: []
      }
    });
  }
  async logAccessibilityEvaluation(evaluation, correlationId) {
    return this.log({
      category: "accessibility",
      severity: evaluation.passes ? "info" : "warning",
      message: evaluation.passes ? `Accessibility check passed for ${evaluation.component ?? "component"}` : `Accessibility check failed for ${evaluation.component ?? "component"}`,
      correlationId,
      source: "accessibility-checker",
      data: {
        foreground: evaluation.foreground.hex,
        background: evaluation.background.hex,
        wcagRatio: evaluation.wcagRatio,
        apcaLevel: evaluation.apcaLevel,
        requiredLevel: evaluation.requiredLevel,
        passes: evaluation.passes,
        component: evaluation.component
      }
    });
  }
  async logTokenGeneration(generation, correlationId) {
    const tokenTypes = [...new Set(generation.tokens.map((t) => t.type))];
    return this.log({
      category: "token-generation",
      severity: "info",
      message: `Generated ${generation.tokens.length} tokens for ${generation.name}`,
      correlationId,
      source: "token-derivation-service",
      data: {
        name: generation.name,
        tokenCount: generation.tokens.length,
        tokenTypes,
        generationTimeMs: generation.generationTimeMs,
        config: generation.config
      }
    });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // QUERY METHODS
  // ─────────────────────────────────────────────────────────────────────────
  async query(filter) {
    try {
      let results = [...this.entries];
      if (filter.categories && filter.categories.length > 0) {
        results = results.filter((e) => filter.categories.includes(e.category));
      }
      if (filter.severities && filter.severities.length > 0) {
        results = results.filter((e) => filter.severities.includes(e.severity));
      }
      if (filter.startDate) {
        results = results.filter((e) => e.timestamp >= filter.startDate);
      }
      if (filter.endDate) {
        results = results.filter((e) => e.timestamp <= filter.endDate);
      }
      if (filter.correlationId) {
        results = results.filter((e) => e.correlationId === filter.correlationId);
      }
      if (filter.tags && filter.tags.length > 0) {
        results = results.filter(
          (e) => e.tags && filter.tags.some((t) => e.tags.includes(t))
        );
      }
      if (filter.searchText) {
        const searchLower = filter.searchText.toLowerCase();
        results = results.filter(
          (e) => e.message.toLowerCase().includes(searchLower) || JSON.stringify(e.data).toLowerCase().includes(searchLower)
        );
      }
      const offset = filter.offset ?? 0;
      const limit = filter.limit ?? 100;
      results = results.slice(offset, offset + limit);
      return success(results);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to query entries")
      );
    }
  }
  async getById(id) {
    const entry = this.entries.find((e) => e.id === id);
    return success(entry ?? null);
  }
  async getByCorrelation(correlationId) {
    const entries = this.entries.filter((e) => e.correlationId === correlationId);
    return success(entries);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // REPORT METHODS
  // ─────────────────────────────────────────────────────────────────────────
  async generateReport(startDate, endDate) {
    try {
      const periodEntries = this.entries.filter(
        (e) => e.timestamp >= startDate && e.timestamp <= endDate
      );
      const byCategory = this.initializeCategoryRecord();
      for (const entry of periodEntries) {
        byCategory[entry.category]++;
      }
      const bySeverity = this.initializeSeverityRecord();
      for (const entry of periodEntries) {
        bySeverity[entry.severity]++;
      }
      const correlations = new Set(
        periodEntries.filter((e) => e.correlationId).map((e) => e.correlationId)
      );
      const accessibilityEntries = periodEntries.filter(
        (e) => e.category === "accessibility"
      );
      const passedAccessibility = accessibilityEntries.filter(
        (e) => e.data?.passes === true
      );
      const wcagRatios = accessibilityEntries.map((e) => e.data?.wcagRatio).filter((r) => typeof r === "number");
      const apcaLevels = accessibilityEntries.map((e) => e.data?.apcaLevel).filter((l) => typeof l === "number");
      const failedComponents = [
        ...new Set(
          accessibilityEntries.filter((e) => e.data?.passes === false).map((e) => e.data?.component).filter((c) => typeof c === "string")
        )
      ];
      const tokenEntries = periodEntries.filter(
        (e) => e.category === "token-generation"
      );
      const tokenCounts = tokenEntries.map((e) => e.data?.tokenCount).filter((c) => typeof c === "number");
      const generationTimes = tokenEntries.map((e) => e.data?.generationTimeMs).filter((t) => typeof t === "number");
      const tokenTypeEntries = tokenEntries.flatMap(
        (e) => e.data?.tokenTypes ?? []
      );
      const tokenByType = {};
      for (const type of tokenTypeEntries) {
        tokenByType[type] = (tokenByType[type] ?? 0) + 1;
      }
      const highlightedIssues = periodEntries.filter(
        (e) => e.severity === "error" || e.severity === "critical"
      );
      const recommendations = this.generateRecommendations(periodEntries);
      const report = {
        period: {
          start: startDate,
          end: endDate
        },
        summary: {
          totalEvents: periodEntries.length,
          byCategory,
          bySeverity,
          uniqueCorrelations: correlations.size
        },
        accessibility: {
          totalEvaluations: accessibilityEntries.length,
          passRate: accessibilityEntries.length > 0 ? passedAccessibility.length / accessibilityEntries.length : 1,
          failedComponents,
          avgWcagRatio: wcagRatios.length > 0 ? wcagRatios.reduce((a, b) => a + b, 0) / wcagRatios.length : 0,
          avgApcaLevel: apcaLevels.length > 0 ? apcaLevels.reduce((a, b) => a + b, 0) / apcaLevels.length : 0
        },
        tokens: {
          totalGenerated: tokenCounts.reduce((a, b) => a + b, 0),
          avgGenerationTimeMs: generationTimes.length > 0 ? generationTimes.reduce((a, b) => a + b, 0) / generationTimes.length : 0,
          byType: tokenByType
        },
        highlightedIssues,
        recommendations
      };
      return success(report);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to generate report")
      );
    }
  }
  async getStats() {
    try {
      const now = /* @__PURE__ */ new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1e3);
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastHourEntries = this.entries.filter((e) => e.timestamp >= oneHourAgo);
      const todayEntries = this.entries.filter((e) => e.timestamp >= todayStart);
      const todayByCategory = this.initializeCategoryRecord();
      for (const entry of todayEntries) {
        todayByCategory[entry.category]++;
      }
      const accessibilityEntries = this.entries.filter(
        (e) => e.category === "accessibility"
      );
      const passedCount = accessibilityEntries.filter(
        (e) => e.data?.passes === true
      ).length;
      const accessibilityPassRate = accessibilityEntries.length > 0 ? passedCount / accessibilityEntries.length : 1;
      const componentIssues = {};
      const issueEntries = this.entries.filter(
        (e) => e.severity === "error" || e.severity === "warning"
      );
      for (const entry of issueEntries) {
        const component = entry.data?.component ?? "unknown";
        componentIssues[component] = (componentIssues[component] ?? 0) + 1;
      }
      const topIssueComponents = Object.entries(componentIssues).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);
      const stats = {
        lastHour: {
          total: lastHourEntries.length,
          errors: lastHourEntries.filter((e) => e.severity === "error").length,
          warnings: lastHourEntries.filter((e) => e.severity === "warning").length
        },
        today: {
          total: todayEntries.length,
          byCategory: todayByCategory
        },
        accessibilityPassRate,
        topIssueComponents
      };
      return success(stats);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to get stats")
      );
    }
  }
  async export(filter, format) {
    const queryResult = await this.query(filter);
    if (!queryResult.success) {
      return failure(queryResult.error);
    }
    const entries = queryResult.value;
    switch (format) {
      case "json":
        return success(JSON.stringify(entries, null, 2));
      case "csv": {
        if (entries.length === 0) {
          return success("id,timestamp,category,severity,message,correlationId\n");
        }
        const headers = ["id", "timestamp", "category", "severity", "message", "correlationId"];
        const rows = entries.map((e) => [
          e.id,
          e.timestamp.toISOString(),
          e.category,
          e.severity,
          e.message.replace(/"/g, '""'),
          e.correlationId ?? ""
        ]);
        const csv = [
          headers.join(","),
          ...rows.map((r) => r.map((v) => `"${v}"`).join(","))
        ].join("\n");
        return success(csv);
      }
      case "html": {
        const rows = entries.map(
          (e) => `
          <tr>
            <td>${e.timestamp.toISOString()}</td>
            <td>${e.category}</td>
            <td class="severity-${e.severity}">${e.severity}</td>
            <td>${e.message}</td>
          </tr>`
        ).join("");
        const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Audit Report</title>
  <style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
    .severity-info { color: #2196F3; }
    .severity-warning { color: #FF9800; }
    .severity-error { color: #F44336; }
    .severity-critical { color: #9C27B0; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Audit Report</h1>
  <p>Total entries: ${entries.length}</p>
  <table>
    <thead>
      <tr><th>Timestamp</th><th>Category</th><th>Severity</th><th>Message</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
        return success(html);
      }
      default:
        return failure(new Error(`Unsupported format: ${format}`));
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // MAINTENANCE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  async purge(olderThan) {
    try {
      const initialCount = this.entries.length;
      this.entries = this.entries.filter((e) => e.timestamp >= olderThan);
      const purgedCount = initialCount - this.entries.length;
      return success(purgedCount);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to purge entries")
      );
    }
  }
  async archive(olderThan) {
    try {
      const toArchive = this.entries.filter((e) => e.timestamp < olderThan);
      this.archivedEntries.push(...toArchive);
      this.entries = this.entries.filter((e) => e.timestamp >= olderThan);
      return success(toArchive.length);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Failed to archive entries")
      );
    }
  }
  async isAvailable() {
    return true;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // ADDITIONAL PUBLIC METHODS (not in port, for testing)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Clears all entries. For testing purposes.
   */
  async clear() {
    this.entries = [];
    this.archivedEntries = [];
    this.entryCounter = 0;
    return success(void 0);
  }
  /**
   * Gets archived entries. For testing purposes.
   */
  getArchivedEntries() {
    return this.archivedEntries;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  generateId() {
    this.entryCounter++;
    return `audit-${Date.now()}-${this.entryCounter}`;
  }
  addEntry(entry) {
    if (this.options.consoleLogging) {
      this.logToConsole(entry);
    }
    this.options.onEntry(entry);
    this.entries.push(entry);
    if (this.entries.length > this.options.maxEntries) {
      this.entries = this.entries.slice(-this.options.maxEntries);
    }
  }
  logToConsole(entry) {
    const severityLevels = {
      info: 0,
      warning: 1,
      error: 2,
      critical: 3
    };
    const configLevel = severityLevels[this.options.logLevel];
    const entryLevel = severityLevels[entry.severity];
    if (entryLevel < configLevel) return;
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.category}] [${entry.severity.toUpperCase()}]`;
    switch (entry.severity) {
      case "critical":
      case "error":
        console.error(`${prefix} ${entry.message}`, entry.data);
        break;
      case "warning":
        console.warn(`${prefix} ${entry.message}`, entry.data);
        break;
      default:
        console.log(`${prefix} ${entry.message}`, entry.data);
    }
  }
  initializeCategoryRecord() {
    return {
      "color-decision": 0,
      accessibility: 0,
      "token-generation": 0,
      "token-modification": 0,
      "theme-change": 0,
      export: 0,
      import: 0,
      validation: 0,
      performance: 0
    };
  }
  initializeSeverityRecord() {
    return {
      info: 0,
      warning: 0,
      error: 0,
      critical: 0
    };
  }
  generateRecommendations(entries) {
    const recommendations = [];
    const criticalCount = entries.filter((e) => e.severity === "critical").length;
    if (criticalCount > 0) {
      recommendations.push(`Address ${criticalCount} critical issues immediately`);
    }
    const accessibilityFails = entries.filter(
      (e) => e.category === "accessibility" && e.data?.passes === false
    ).length;
    if (accessibilityFails > 5) {
      recommendations.push(
        "Review color contrast ratios for accessibility compliance"
      );
    }
    const colorDecisions = entries.filter((e) => e.category === "color-decision");
    if (colorDecisions.length > 100) {
      recommendations.push(
        "Consider consolidating color tokens to reduce complexity"
      );
    }
    const slowOps = entries.filter(
      (e) => e.category === "performance" && e.severity === "warning"
    ).length;
    if (slowOps > 10) {
      recommendations.push("Optimize slow operations to improve performance");
    }
    if (recommendations.length === 0) {
      recommendations.push("No immediate actions required");
    }
    return recommendations;
  }
};

export { InMemoryAuditAdapter };
//# sourceMappingURL=chunk-OH7OLZQ7.mjs.map
//# sourceMappingURL=chunk-OH7OLZQ7.mjs.map