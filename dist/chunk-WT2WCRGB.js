'use strict';

var chunk5YMPXU57_js = require('./chunk-5YMPXU57.js');
var chunkZM4FIU5F_js = require('./chunk-ZM4FIU5F.js');

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// validation/conformance.ts
var ConformanceChecker = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor() {
    // ─────────────────────────────────────────────────────────────────────────
    // PROPERTIES
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "checks", /* @__PURE__ */ new Map());
    this.registerDefaultChecks();
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Run all registered conformance checks.
   */
  async runAll(context, options = {}) {
    const results = [];
    const categoriesToRun = options.categories ?? [
      "architecture",
      "accessibility",
      "color-intelligence",
      "tokens",
      "performance"
    ];
    const skipSet = new Set(options.skipChecks ?? []);
    for (const [id, check] of this.checks) {
      if (skipSet.has(id)) continue;
      if (!categoriesToRun.includes(check.category)) continue;
      const result = await check.run(context);
      results.push(result);
    }
    return this.generateReport(results, options);
  }
  /**
   * Run a specific conformance check.
   */
  async runCheck(checkId, context) {
    const check = this.checks.get(checkId);
    if (!check) {
      return chunk5YMPXU57_js.failure(new Error(`Check not found: ${checkId}`));
    }
    const result = await check.run(context);
    return chunk5YMPXU57_js.success(result);
  }
  /**
   * Register a custom conformance check.
   */
  registerCheck(check) {
    this.checks.set(check.id, check);
  }
  /**
   * Get all registered check IDs.
   */
  getCheckIds() {
    return Array.from(this.checks.keys());
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  registerDefaultChecks() {
    this.registerCheck(new ContrastRatioCheck());
    this.registerCheck(new ColorBlindnessCheck());
    this.registerCheck(new PerceptualUniformityCheck());
    this.registerCheck(new GamutBoundaryCheck());
    this.registerCheck(new HardcodedColorCheck());
    this.registerCheck(new TokenNamingConventionCheck());
    this.registerCheck(new TokenCompletenessCheck());
    this.registerCheck(new TokenTypeValidationCheck());
    this.registerCheck(new DependencyDirectionCheck());
    this.registerCheck(new PortContractCheck());
  }
  generateReport(results, options) {
    let errors = 0;
    let warnings = 0;
    let infos = 0;
    for (const result of results) {
      for (const issue of result.issues) {
        switch (issue.severity) {
          case "error":
            errors++;
            break;
          case "warning":
            warnings++;
            break;
          case "info":
            infos++;
            break;
        }
      }
    }
    const passed = results.filter((r) => r.passed).length;
    const failed = results.filter((r) => !r.passed).length;
    const overallPassed = options.failOnWarnings ? errors === 0 && warnings === 0 : errors === 0;
    const complianceScore = this.calculateComplianceScore(results);
    return {
      timestamp: /* @__PURE__ */ new Date(),
      version: "1.0.0",
      summary: {
        totalChecks: results.length,
        passed,
        failed,
        errors,
        warnings,
        infos
      },
      checks: results,
      overallPassed,
      complianceScore
    };
  }
  calculateComplianceScore(results) {
    if (results.length === 0) return 100;
    let totalWeight = 0;
    let earnedScore = 0;
    for (const result of results) {
      const weight = this.getCheckWeight(result.checkId);
      totalWeight += weight;
      if (result.passed) {
        earnedScore += weight;
      } else {
        const errorCount = result.issues.filter(
          (i) => i.severity === "error"
        ).length;
        const warningCount = result.issues.filter(
          (i) => i.severity === "warning"
        ).length;
        const totalIssues = result.issues.length;
        if (totalIssues > 0) {
          const severityPenalty = (errorCount * 1 + warningCount * 0.5) / totalIssues;
          earnedScore += weight * Math.max(0, 1 - severityPenalty);
        }
      }
    }
    return Math.round(earnedScore / totalWeight * 100);
  }
  getCheckWeight(checkId) {
    const weights = {
      "contrast-ratio": 10,
      "color-blindness": 5,
      "perceptual-uniformity": 8,
      "gamut-boundary": 5,
      "hardcoded-colors": 10,
      "token-naming": 5,
      "token-completeness": 5,
      "token-type-validation": 5,
      "dependency-direction": 8,
      "port-contract": 8
    };
    return weights[checkId] ?? 5;
  }
};
var ContrastRatioCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "contrast-ratio");
    chunkZM4FIU5F_js.__publicField(this, "name", "WCAG Contrast Ratio");
    chunkZM4FIU5F_js.__publicField(this, "category", "accessibility");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates color combinations meet WCAG 2.1 AA contrast requirements");
  }
  async run(context) {
    const issues = [];
    const colors = context.colors;
    if (!colors || colors.size === 0) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: true,
        issues: [],
        metadata: { skipped: true, reason: "No colors provided" }
      };
    }
    const bg = colors.get("background");
    const text = colors.get("text");
    const primary = colors.get("primary");
    if (bg && text) {
      const contrast = this.calculateContrast(bg, text);
      if (contrast < 4.5) {
        issues.push({
          id: `${this.id}-text-bg`,
          category: this.category,
          severity: "error",
          message: `Text/background contrast ratio (${contrast.toFixed(2)}) is below WCAG AA minimum (4.5:1)`,
          location: "colors.text / colors.background",
          suggestion: "Increase lightness difference between text and background colors"
        });
      }
    }
    if (bg && primary) {
      const contrast = this.calculateContrast(bg, primary);
      if (contrast < 3) {
        issues.push({
          id: `${this.id}-primary-bg`,
          category: this.category,
          severity: "warning",
          message: `Primary/background contrast ratio (${contrast.toFixed(2)}) may be insufficient for UI elements`,
          location: "colors.primary / colors.background",
          suggestion: "Consider adjusting primary color lightness for better visibility"
        });
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues
    };
  }
  calculateContrast(color1, color2) {
    const l1 = color1.lightness;
    const l2 = color2.lightness;
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
};
var ColorBlindnessCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "color-blindness");
    chunkZM4FIU5F_js.__publicField(this, "name", "Color Blindness Accessibility");
    chunkZM4FIU5F_js.__publicField(this, "category", "accessibility");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates colors are distinguishable for color-blind users");
  }
  async run(context) {
    const issues = [];
    const colors = context.colors;
    if (!colors || colors.size < 2) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: true,
        issues: [],
        metadata: { skipped: true, reason: "Insufficient colors for comparison" }
      };
    }
    const colorArray = Array.from(colors.entries());
    for (let i = 0; i < colorArray.length; i++) {
      for (let j = i + 1; j < colorArray.length; j++) {
        const [name1, color1] = colorArray[i];
        const [name2, color2] = colorArray[j];
        if (this.isRedGreenPair(color1, color2)) {
          const lightnessDiff = Math.abs(color1.lightness - color2.lightness);
          if (lightnessDiff < 0.3) {
            issues.push({
              id: `${this.id}-${name1}-${name2}`,
              category: this.category,
              severity: "warning",
              message: `${name1} and ${name2} may be indistinguishable for red-green color blind users`,
              location: `colors.${name1} / colors.${name2}`,
              suggestion: "Increase lightness difference between these colors or use different hues"
            });
          }
        }
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues
    };
  }
  isRedGreenPair(c1, c2) {
    const isRedish = (h) => h < 30 || h > 330;
    const isGreenish = (h) => h > 80 && h < 160;
    return isRedish(c1.hue) && isGreenish(c2.hue) || isGreenish(c1.hue) && isRedish(c2.hue);
  }
};
var PerceptualUniformityCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "perceptual-uniformity");
    chunkZM4FIU5F_js.__publicField(this, "name", "Perceptual Uniformity");
    chunkZM4FIU5F_js.__publicField(this, "category", "color-intelligence");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates color scales have perceptually uniform steps");
  }
  async run(context) {
    const issues = [];
    const tokens = context.tokenCollection;
    if (!tokens) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: true,
        issues: [],
        metadata: { skipped: true, reason: "No token collection provided" }
      };
    }
    const colorTokens = tokens.filter({ type: "color" });
    const scaleTokens = colorTokens.filter((t) => /\.\d{2,3}$/.test(t.name));
    const scales = /* @__PURE__ */ new Map();
    for (const token of scaleTokens) {
      const prefix = token.name.replace(/\.\d{2,3}$/, "");
      if (!scales.has(prefix)) {
        scales.set(prefix, []);
      }
      scales.get(prefix).push(token);
    }
    for (const [prefix, tokens2] of scales) {
      if (tokens2.length < 3) continue;
      const sorted = tokens2.sort((a, b) => {
        const stepA = parseInt(a.name.match(/\.(\d{2,3})$/)?.[1] ?? "0");
        const stepB = parseInt(b.name.match(/\.(\d{2,3})$/)?.[1] ?? "0");
        return stepA - stepB;
      });
      const lightnesses = sorted.map((t) => {
        const colorValue = t.value;
        return colorValue.perceptual?.oklch.l ?? 0.5;
      });
      const diffs = [];
      for (let i = 1; i < lightnesses.length; i++) {
        diffs.push(Math.abs(lightnesses[i] - lightnesses[i - 1]));
      }
      const avgDiff = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const maxDeviation = Math.max(...diffs.map((d) => Math.abs(d - avgDiff)));
      if (maxDeviation > avgDiff * 0.5) {
        issues.push({
          id: `${this.id}-${prefix}`,
          category: this.category,
          severity: "warning",
          message: `Color scale '${prefix}' has non-uniform perceptual steps`,
          details: `Max deviation: ${(maxDeviation * 100).toFixed(1)}% from average step`,
          location: prefix,
          suggestion: "Use Color Intelligence palette generation for uniform scales"
        });
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues
    };
  }
};
var GamutBoundaryCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "gamut-boundary");
    chunkZM4FIU5F_js.__publicField(this, "name", "Gamut Boundary");
    chunkZM4FIU5F_js.__publicField(this, "category", "color-intelligence");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates colors are within displayable gamut");
  }
  async run(context) {
    const issues = [];
    const colors = context.colors;
    if (!colors) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: true,
        issues: [],
        metadata: { skipped: true, reason: "No colors provided" }
      };
    }
    for (const [name, color] of colors) {
      if (color.chroma > 0.37) {
        issues.push({
          id: `${this.id}-${name}`,
          category: this.category,
          severity: "warning",
          message: `Color '${name}' has very high chroma (${color.chroma.toFixed(3)}) which may be outside sRGB gamut`,
          location: `colors.${name}`,
          suggestion: "Reduce chroma or use gamut mapping for wider compatibility"
        });
      }
      if (color.lightness < 0 || color.lightness > 1) {
        issues.push({
          id: `${this.id}-${name}-lightness`,
          category: this.category,
          severity: "error",
          message: `Color '${name}' has invalid lightness value: ${color.lightness}`,
          location: `colors.${name}`,
          suggestion: "Lightness must be between 0 and 1"
        });
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues
    };
  }
};
var HardcodedColorCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "hardcoded-colors");
    chunkZM4FIU5F_js.__publicField(this, "name", "No Hardcoded Colors");
    chunkZM4FIU5F_js.__publicField(this, "category", "color-intelligence");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates no hardcoded color values exist outside the design system");
  }
  async run(context) {
    const issues = [];
    const sourceCode = context.sourceCode ?? [];
    const hexPattern = /#[0-9A-Fa-f]{3,8}\b/g;
    const rgbPattern = /rgba?\s*\(\s*\d+/g;
    const hslPattern = /hsla?\s*\(\s*\d+/g;
    for (const code of sourceCode) {
      const lines = code.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().startsWith("//") || line.trim().startsWith("*")) {
          continue;
        }
        if (line.includes("--") && line.includes(":")) {
          continue;
        }
        const hexMatches = line.match(hexPattern);
        if (hexMatches) {
          for (const match of hexMatches) {
            issues.push({
              id: `${this.id}-line${i + 1}`,
              category: this.category,
              severity: "error",
              message: `Hardcoded hex color found: ${match}`,
              location: `Line ${i + 1}`,
              suggestion: "Use a design token or CSS variable instead"
            });
          }
        }
        const rgbMatches = line.match(rgbPattern);
        if (rgbMatches) {
          issues.push({
            id: `${this.id}-rgb-line${i + 1}`,
            category: this.category,
            severity: "error",
            message: "Hardcoded RGB color found",
            location: `Line ${i + 1}`,
            suggestion: "Use a design token or CSS variable instead"
          });
        }
        const hslMatches = line.match(hslPattern);
        if (hslMatches) {
          issues.push({
            id: `${this.id}-hsl-line${i + 1}`,
            category: this.category,
            severity: "error",
            message: "Hardcoded HSL color found",
            location: `Line ${i + 1}`,
            suggestion: "Use a design token or CSS variable instead"
          });
        }
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues,
      metadata: { filesScanned: sourceCode.length }
    };
  }
};
var TokenNamingConventionCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "token-naming");
    chunkZM4FIU5F_js.__publicField(this, "name", "Token Naming Convention");
    chunkZM4FIU5F_js.__publicField(this, "category", "tokens");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates token paths follow naming conventions");
  }
  async run(context) {
    const issues = [];
    const tokens = context.tokenCollection;
    if (!tokens) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: true,
        issues: [],
        metadata: { skipped: true, reason: "No token collection provided" }
      };
    }
    const allTokens = tokens.getAll();
    const validPathPattern = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)*$/;
    for (const token of allTokens) {
      if (!validPathPattern.test(token.name)) {
        issues.push({
          id: `${this.id}-${token.name}`,
          category: this.category,
          severity: "warning",
          message: `Token name '${token.name}' doesn't follow naming convention`,
          suggestion: "Use lowercase dot-separated names (e.g., color.brand.primary)"
        });
      }
      const depth = token.path.length;
      if (depth > 5) {
        issues.push({
          id: `${this.id}-depth-${token.name}`,
          category: this.category,
          severity: "info",
          message: `Token '${token.name}' has deep nesting (${depth} levels)`,
          suggestion: "Consider flattening token structure for easier maintenance"
        });
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues
    };
  }
};
var TokenCompletenessCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "token-completeness");
    chunkZM4FIU5F_js.__publicField(this, "name", "Token Completeness");
    chunkZM4FIU5F_js.__publicField(this, "category", "tokens");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates required token categories are present");
    chunkZM4FIU5F_js.__publicField(this, "requiredCategories", [
      "color.primary",
      "color.background",
      "color.text"
    ]);
  }
  async run(context) {
    const issues = [];
    const tokens = context.tokenCollection;
    if (!tokens) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: true,
        issues: [],
        metadata: { skipped: true, reason: "No token collection provided" }
      };
    }
    for (const requiredPrefix of this.requiredCategories) {
      const matchingTokens = tokens.filter({ name: new RegExp(`^${requiredPrefix}`) });
      if (matchingTokens.length === 0) {
        issues.push({
          id: `${this.id}-missing-${requiredPrefix}`,
          category: this.category,
          severity: "error",
          message: `Required token category '${requiredPrefix}' is missing`,
          suggestion: `Add tokens with names starting with '${requiredPrefix}'`
        });
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues
    };
  }
};
var TokenTypeValidationCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "token-type-validation");
    chunkZM4FIU5F_js.__publicField(this, "name", "Token Type Validation");
    chunkZM4FIU5F_js.__publicField(this, "category", "tokens");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates token values match their declared types");
  }
  async run(context) {
    const issues = [];
    const tokens = context.tokenCollection;
    if (!tokens) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: true,
        issues: [],
        metadata: { skipped: true, reason: "No token collection provided" }
      };
    }
    const allTokens = tokens.getAll();
    for (const token of allTokens) {
      const typeError = this.validateTokenType(token);
      if (typeError) {
        issues.push({
          id: `${this.id}-${token.name}`,
          category: this.category,
          severity: "error",
          message: typeError,
          location: token.name
        });
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues
    };
  }
  validateTokenType(token) {
    const tokenValue = token.value;
    const type = token.type;
    switch (type) {
      case "color": {
        const colorVal = tokenValue;
        if (typeof colorVal.value !== "string") {
          return `Color token must have string value, got ${typeof colorVal.value}`;
        }
        if (!/^(#|rgb|hsl|oklch|lch|lab)/.test(colorVal.value)) {
          return `Invalid color format: ${colorVal.value}`;
        }
        break;
      }
      case "dimension": {
        const dimVal = tokenValue;
        if (typeof dimVal.value !== "number") {
          return `Dimension token must have numeric value, got ${typeof dimVal.value}`;
        }
        if (!["px", "rem", "em", "%", "vw", "vh"].includes(dimVal.unit)) {
          return `Invalid dimension unit: ${dimVal.unit}`;
        }
        break;
      }
    }
    return null;
  }
};
var DependencyDirectionCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "dependency-direction");
    chunkZM4FIU5F_js.__publicField(this, "name", "Dependency Direction");
    chunkZM4FIU5F_js.__publicField(this, "category", "architecture");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates dependencies point inward (hexagonal architecture)");
  }
  async run(context) {
    const issues = [];
    const sourceCode = context.sourceCode ?? [];
    const adapterImportInDomain = /from\s+['"].*\/adapters?\//;
    const infraImportInDomain = /from\s+['"].*\/infrastructure\//;
    for (const code of sourceCode) {
      const lines = code.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("/domain/") && (adapterImportInDomain.test(line) || infraImportInDomain.test(line))) {
          issues.push({
            id: `${this.id}-line${i + 1}`,
            category: this.category,
            severity: "error",
            message: "Domain layer should not import from adapters or infrastructure",
            location: `Line ${i + 1}`,
            suggestion: "Dependencies should point inward only"
          });
        }
      }
    }
    return {
      checkId: this.id,
      checkName: this.name,
      passed: issues.filter((i) => i.severity === "error").length === 0,
      issues,
      metadata: { note: "Requires source code context for full validation" }
    };
  }
};
var PortContractCheck = class {
  constructor() {
    chunkZM4FIU5F_js.__publicField(this, "id", "port-contract");
    chunkZM4FIU5F_js.__publicField(this, "name", "Port Contract Definition");
    chunkZM4FIU5F_js.__publicField(this, "category", "architecture");
    chunkZM4FIU5F_js.__publicField(this, "description", "Validates ports define proper contracts with Result types");
    /**
     * Pattern to detect class exports (ports should be interfaces)
     */
    chunkZM4FIU5F_js.__publicField(this, "classExportPattern", /export\s+class\s+\w+Port/);
    /**
     * Pattern to detect interface exports (expected for ports)
     */
    chunkZM4FIU5F_js.__publicField(this, "interfaceExportPattern", /export\s+interface\s+(\w+Port)/g);
    /**
     * Pattern to detect Promise returns without Result wrapper
     */
    chunkZM4FIU5F_js.__publicField(this, "barePromisePattern", /:\s*Promise<(?!Result)[^>]+>/);
    /**
     * Pattern to detect Result type usage
     */
    chunkZM4FIU5F_js.__publicField(this, "resultTypePattern", /Result<[^>]+>/);
  }
  async run(context) {
    const issues = [];
    const sourceCode = context.sourceCode ?? [];
    if (sourceCode.length === 0) {
      return {
        checkId: this.id,
        checkName: this.name,
        passed: false,
        // Not passed - we didn't validate anything
        issues: [{
          id: `${this.id}-no-source`,
          category: this.category,
          severity: "warning",
          message: "Port contract validation skipped: no source code provided",
          details: "Provide port file contents in context.sourceCode for validation",
          suggestion: "Run validation with sourceCode context populated"
        }],
        metadata: {
          skipped: true,
          reason: "No source code provided for analysis"
        }
      };
    }
    for (let fileIndex = 0; fileIndex < sourceCode.length; fileIndex++) {
      const code = sourceCode[fileIndex];
      if (this.classExportPattern.test(code)) {
        issues.push({
          id: `${this.id}-class-port-file${fileIndex}`,
          category: this.category,
          severity: "error",
          message: "Port defined as class instead of interface",
          details: "Ports in hexagonal architecture must be interfaces to enable dependency inversion",
          location: `File ${fileIndex + 1}`,
          suggestion: 'Convert "export class XxxPort" to "export interface XxxPort"'
        });
      }
      const interfaceMatches = code.matchAll(this.interfaceExportPattern);
      for (const match of interfaceMatches) {
        const portName = match[1];
        const startIndex = match.index ?? 0;
        const interfaceBody = this.extractInterfaceBody(code, startIndex);
        if (interfaceBody) {
          const methodLines = interfaceBody.split("\n");
          for (let i = 0; i < methodLines.length; i++) {
            const line = methodLines[i];
            if (!line.includes(":") || line.trim().startsWith("//") || line.trim().startsWith("*")) {
              continue;
            }
            if (this.barePromisePattern.test(line) && !this.resultTypePattern.test(line)) {
              issues.push({
                id: `${this.id}-bare-promise-${portName}`,
                category: this.category,
                severity: "warning",
                message: `Port '${portName}' has method with bare Promise return type`,
                details: "Port methods should return Result<T, E> for explicit error handling",
                location: portName,
                suggestion: "Use Promise<Result<SuccessType, Error>> instead of Promise<SuccessType>"
              });
              break;
            }
          }
        }
      }
      const implementsPattern = /class\s+\w+\s+implements\s+(\w+Port)/g;
      const implementsMatches = code.matchAll(implementsPattern);
      for (const match of implementsMatches) {
        const portName = match[1];
        const classBody = this.extractInterfaceBody(code, match.index ?? 0);
        if (classBody && classBody.split("\n").filter((l) => l.trim()).length < 3) {
          issues.push({
            id: `${this.id}-empty-adapter-${portName}`,
            category: this.category,
            severity: "error",
            message: `Adapter implementing '${portName}' appears to be empty or incomplete`,
            location: `File ${fileIndex + 1}`,
            suggestion: "Implement all required port methods"
          });
        }
      }
    }
    const errorCount = issues.filter((i) => i.severity === "error").length;
    return {
      checkId: this.id,
      checkName: this.name,
      passed: errorCount === 0,
      issues,
      metadata: {
        filesAnalyzed: sourceCode.length,
        validationType: "static-regex",
        note: "Full AST validation available via TypeScript compiler API integration"
      }
    };
  }
  /**
   * Extract interface/class body starting from a given position.
   * Simplified implementation using brace counting.
   */
  extractInterfaceBody(code, startIndex) {
    const openBrace = code.indexOf("{", startIndex);
    if (openBrace === -1) return null;
    let depth = 1;
    let pos = openBrace + 1;
    while (depth > 0 && pos < code.length) {
      if (code[pos] === "{") depth++;
      if (code[pos] === "}") depth--;
      pos++;
    }
    if (depth === 0) {
      return code.slice(openBrace + 1, pos - 1);
    }
    return null;
  }
};
var conformance_default = ConformanceChecker;

// validation/report-generator.ts
var ReportGenerator = class {
  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Generate a formatted report from conformance results.
   */
  generate(report, options) {
    switch (options.format) {
      case "text":
        return this.generateTextReport(report, options);
      case "markdown":
        return this.generateMarkdownReport(report, options);
      case "json":
        return this.generateJsonReport(report, options);
      case "html":
        return this.generateHtmlReport(report, options);
      default:
        throw new Error(`Unsupported format: ${options.format}`);
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // TEXT FORMAT
  // ─────────────────────────────────────────────────────────────────────────
  generateTextReport(report, options) {
    const lines = [];
    const title = options.title ?? "UI Kit Conformance Report";
    lines.push("\u2550".repeat(60));
    lines.push(this.centerText(title, 60));
    lines.push("\u2550".repeat(60));
    lines.push("");
    lines.push("SUMMARY");
    lines.push("\u2500".repeat(40));
    lines.push(`Timestamp:        ${report.timestamp.toISOString()}`);
    lines.push(`Version:          ${report.version}`);
    lines.push(`Total Checks:     ${report.summary.totalChecks}`);
    lines.push(`Passed:           ${report.summary.passed}`);
    lines.push(`Failed:           ${report.summary.failed}`);
    lines.push(`Errors:           ${report.summary.errors}`);
    lines.push(`Warnings:         ${report.summary.warnings}`);
    lines.push(`Compliance Score: ${report.complianceScore}%`);
    lines.push(`Overall Status:   ${report.overallPassed ? "\u2713 PASSED" : "\u2717 FAILED"}`);
    lines.push("");
    lines.push("DETAILED RESULTS");
    lines.push("\u2500".repeat(40));
    for (const check of report.checks) {
      if (!options.includePassedChecks && check.passed) continue;
      const status = check.passed ? "\u2713" : "\u2717";
      lines.push(`
${status} ${check.checkName} (${check.checkId})`);
      if (check.issues.length === 0) {
        lines.push("  No issues found");
        continue;
      }
      for (const issue of check.issues) {
        const icon = this.getSeverityIcon(issue.severity);
        lines.push(`  ${icon} [${issue.severity.toUpperCase()}] ${issue.message}`);
        if (issue.location) {
          lines.push(`    Location: ${issue.location}`);
        }
        if (issue.details) {
          lines.push(`    Details: ${issue.details}`);
        }
        if (options.includeSuggestions && issue.suggestion) {
          lines.push(`    Suggestion: ${issue.suggestion}`);
        }
      }
    }
    lines.push("");
    lines.push("\u2550".repeat(60));
    lines.push(this.centerText("End of Report", 60));
    lines.push("\u2550".repeat(60));
    return lines.join("\n");
  }
  // ─────────────────────────────────────────────────────────────────────────
  // MARKDOWN FORMAT
  // ─────────────────────────────────────────────────────────────────────────
  generateMarkdownReport(report, options) {
    const lines = [];
    const title = options.title ?? "UI Kit Conformance Report";
    lines.push(`# ${title}`);
    lines.push("");
    lines.push(`> Generated: ${report.timestamp.toISOString()}`);
    lines.push("");
    const statusBadge = report.overallPassed ? "![Status](https://img.shields.io/badge/Status-PASSED-green)" : "![Status](https://img.shields.io/badge/Status-FAILED-red)";
    lines.push(statusBadge);
    lines.push(`![Score](https://img.shields.io/badge/Score-${report.complianceScore}%25-blue)`);
    lines.push("");
    lines.push("## Summary");
    lines.push("");
    lines.push("| Metric | Value |");
    lines.push("|--------|-------|");
    lines.push(`| Total Checks | ${report.summary.totalChecks} |`);
    lines.push(`| Passed | ${report.summary.passed} |`);
    lines.push(`| Failed | ${report.summary.failed} |`);
    lines.push(`| Errors | ${report.summary.errors} |`);
    lines.push(`| Warnings | ${report.summary.warnings} |`);
    lines.push(`| Compliance Score | ${report.complianceScore}% |`);
    lines.push("");
    lines.push("## Issues by Category");
    lines.push("");
    const byCategory = this.groupByCategory(report.checks);
    for (const [category, checks] of Object.entries(byCategory)) {
      const issues = checks.flatMap((c) => c.issues);
      if (issues.length === 0 && !options.includePassedChecks) continue;
      lines.push(`### ${this.formatCategory(category)}`);
      lines.push("");
      if (issues.length === 0) {
        lines.push("\u2705 All checks passed");
        lines.push("");
        continue;
      }
      for (const issue of issues) {
        const emoji = this.getSeverityEmoji(issue.severity);
        lines.push(`- ${emoji} **${issue.message}**`);
        if (issue.location) {
          lines.push(`  - Location: \`${issue.location}\``);
        }
        if (options.includeSuggestions && issue.suggestion) {
          lines.push(`  - \u{1F4A1} ${issue.suggestion}`);
        }
      }
      lines.push("");
    }
    lines.push("## Detailed Results");
    lines.push("");
    for (const check of report.checks) {
      if (!options.includePassedChecks && check.passed) continue;
      const statusEmoji = check.passed ? "\u2705" : "\u274C";
      lines.push(`### ${statusEmoji} ${check.checkName}`);
      lines.push("");
      lines.push(`**Check ID:** \`${check.checkId}\``);
      lines.push("");
      if (check.passed) {
        lines.push("No issues found.");
      } else {
        lines.push("| Severity | Message | Location |");
        lines.push("|----------|---------|----------|");
        for (const issue of check.issues) {
          const severity = this.getSeverityBadge(issue.severity);
          const location = issue.location ?? "-";
          lines.push(`| ${severity} | ${issue.message} | ${location} |`);
        }
      }
      if (options.includeMetadata && check.metadata) {
        lines.push("");
        lines.push("**Metadata:**");
        lines.push("```json");
        lines.push(JSON.stringify(check.metadata, null, 2));
        lines.push("```");
      }
      lines.push("");
    }
    return lines.join("\n");
  }
  // ─────────────────────────────────────────────────────────────────────────
  // JSON FORMAT
  // ─────────────────────────────────────────────────────────────────────────
  generateJsonReport(report, options) {
    const output = {
      title: options.title ?? "UI Kit Conformance Report",
      timestamp: report.timestamp.toISOString(),
      version: report.version,
      summary: report.summary,
      overallPassed: report.overallPassed,
      complianceScore: report.complianceScore
    };
    if (options.includePassedChecks) {
      output.checks = report.checks;
    } else {
      output.checks = report.checks.filter((c) => !c.passed);
    }
    if (options.includeMetadata) {
      output.generatedBy = "@zuclubit/momoto-ui";
      output.reportFormat = "json";
    }
    return JSON.stringify(output, null, 2);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // HTML FORMAT
  // ─────────────────────────────────────────────────────────────────────────
  generateHtmlReport(report, options) {
    const title = options.title ?? "UI Kit Conformance Report";
    const statusClass = report.overallPassed ? "passed" : "failed";
    const statusText = report.overallPassed ? "PASSED" : "FAILED";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --color-success: #22c55e;
      --color-error: #ef4444;
      --color-warning: #f59e0b;
      --color-info: #3b82f6;
      --color-bg: #0f172a;
      --color-surface: #1e293b;
      --color-text: #f1f5f9;
      --color-muted: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: 1.6;
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1, h2, h3 {
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      border-bottom: 2px solid var(--color-surface);
      padding-bottom: 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .status {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-weight: bold;
      font-size: 0.875rem;
    }

    .status.passed {
      background: var(--color-success);
      color: white;
    }

    .status.failed {
      background: var(--color-error);
      color: white;
    }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat {
      background: var(--color-surface);
      padding: 1rem;
      border-radius: 0.5rem;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
    }

    .stat-label {
      color: var(--color-muted);
      font-size: 0.875rem;
    }

    .score {
      background: linear-gradient(135deg, var(--color-info), #8b5cf6);
    }

    .check {
      background: var(--color-surface);
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      overflow: hidden;
    }

    .check-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      cursor: pointer;
    }

    .check-header:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .check-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .check-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .check-status.passed {
      background: var(--color-success);
    }

    .check-status.failed {
      background: var(--color-error);
    }

    .check-body {
      padding: 0 1rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .issue {
      padding: 0.75rem;
      margin: 0.5rem 0;
      border-radius: 0.25rem;
      border-left: 3px solid;
    }

    .issue.error {
      background: rgba(239, 68, 68, 0.1);
      border-color: var(--color-error);
    }

    .issue.warning {
      background: rgba(245, 158, 11, 0.1);
      border-color: var(--color-warning);
    }

    .issue.info {
      background: rgba(59, 130, 246, 0.1);
      border-color: var(--color-info);
    }

    .issue-message {
      font-weight: 500;
    }

    .issue-detail {
      font-size: 0.875rem;
      color: var(--color-muted);
      margin-top: 0.25rem;
    }

    .meta {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-surface);
      font-size: 0.875rem;
      color: var(--color-muted);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
      <span class="status ${statusClass}">${statusText}</span>
    </div>

    <div class="summary">
      <div class="stat score">
        <div class="stat-value">${report.complianceScore}%</div>
        <div class="stat-label">Compliance Score</div>
      </div>
      <div class="stat">
        <div class="stat-value">${report.summary.totalChecks}</div>
        <div class="stat-label">Total Checks</div>
      </div>
      <div class="stat">
        <div class="stat-value">${report.summary.passed}</div>
        <div class="stat-label">Passed</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color: var(--color-error)">${report.summary.errors}</div>
        <div class="stat-label">Errors</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color: var(--color-warning)">${report.summary.warnings}</div>
        <div class="stat-label">Warnings</div>
      </div>
    </div>

    <h2>Check Results</h2>
    ${report.checks.filter((c) => options.includePassedChecks || !c.passed).map((check) => this.generateHtmlCheck(check, options)).join("\n")}

    <div class="meta">
      <p>Generated: ${report.timestamp.toISOString()}</p>
      <p>Version: ${report.version}</p>
    </div>
  </div>
</body>
</html>`;
  }
  generateHtmlCheck(check, options) {
    const statusClass = check.passed ? "passed" : "failed";
    return `
    <div class="check">
      <div class="check-header">
        <div class="check-title">
          <span class="check-status ${statusClass}"></span>
          <strong>${check.checkName}</strong>
          <span style="color: var(--color-muted); font-size: 0.875rem;">(${check.checkId})</span>
        </div>
        <span style="color: var(--color-muted);">${check.issues.length} issues</span>
      </div>
      ${check.issues.length > 0 ? `<div class="check-body">
          ${check.issues.map((issue) => this.generateHtmlIssue(issue, options)).join("\n")}
        </div>` : ""}
    </div>`;
  }
  generateHtmlIssue(issue, options) {
    return `
      <div class="issue ${issue.severity}">
        <div class="issue-message">${issue.message}</div>
        ${issue.location ? `<div class="issue-detail">Location: ${issue.location}</div>` : ""}
        ${issue.details ? `<div class="issue-detail">${issue.details}</div>` : ""}
        ${options.includeSuggestions && issue.suggestion ? `<div class="issue-detail">\u{1F4A1} ${issue.suggestion}</div>` : ""}
      </div>`;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  centerText(text, width) {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return " ".repeat(padding) + text;
  }
  getSeverityIcon(severity) {
    switch (severity) {
      case "error":
        return "\u2717";
      case "warning":
        return "\u26A0";
      case "info":
        return "\u2139";
    }
  }
  getSeverityEmoji(severity) {
    switch (severity) {
      case "error":
        return "\u{1F534}";
      case "warning":
        return "\u{1F7E1}";
      case "info":
        return "\u{1F535}";
    }
  }
  getSeverityBadge(severity) {
    switch (severity) {
      case "error":
        return "![Error](https://img.shields.io/badge/-Error-red)";
      case "warning":
        return "![Warning](https://img.shields.io/badge/-Warning-yellow)";
      case "info":
        return "![Info](https://img.shields.io/badge/-Info-blue)";
    }
  }
  formatCategory(category) {
    return category.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  groupByCategory(checks) {
    const groups = {};
    for (const check of checks) {
      const category = this.inferCategory(check.checkId);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(check);
    }
    return groups;
  }
  inferCategory(checkId) {
    if (checkId.includes("contrast") || checkId.includes("color-blind")) {
      return "accessibility";
    }
    if (checkId.includes("token")) {
      return "tokens";
    }
    if (checkId.includes("color") || checkId.includes("perceptual") || checkId.includes("gamut")) {
      return "color-intelligence";
    }
    if (checkId.includes("dependency") || checkId.includes("port")) {
      return "architecture";
    }
    return "other";
  }
};
var report_generator_default = ReportGenerator;

exports.ColorBlindnessCheck = ColorBlindnessCheck;
exports.ConformanceChecker = ConformanceChecker;
exports.ContrastRatioCheck = ContrastRatioCheck;
exports.DependencyDirectionCheck = DependencyDirectionCheck;
exports.GamutBoundaryCheck = GamutBoundaryCheck;
exports.HardcodedColorCheck = HardcodedColorCheck;
exports.PerceptualUniformityCheck = PerceptualUniformityCheck;
exports.PortContractCheck = PortContractCheck;
exports.ReportGenerator = ReportGenerator;
exports.TokenCompletenessCheck = TokenCompletenessCheck;
exports.TokenNamingConventionCheck = TokenNamingConventionCheck;
exports.TokenTypeValidationCheck = TokenTypeValidationCheck;
exports.conformance_default = conformance_default;
exports.report_generator_default = report_generator_default;
//# sourceMappingURL=chunk-WT2WCRGB.js.map
//# sourceMappingURL=chunk-WT2WCRGB.js.map