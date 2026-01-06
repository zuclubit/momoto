import { failure, success } from './chunk-445P5ZF2.mjs';
import { __publicField } from './chunk-ABD7DB5B.mjs';

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// infrastructure/exporters/W3CTokenExporter.ts
var DEFAULT_W3C_OPTIONS = {
  includeType: true,
  includeDescription: true,
  includeExtensions: false,
  extensionNamespace: "zuclubit",
  groupByPath: true,
  includeFileMetadata: true
};
var SUPPORTED_FORMATS = [
  "w3c",
  "json",
  "css",
  "scss",
  "typescript"
];
var W3CTokenExporter = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(options = {}) {
    // ─────────────────────────────────────────────────────────────────────────
    // PROPERTIES
    // ─────────────────────────────────────────────────────────────────────────
    __publicField(this, "options");
    this.options = { ...DEFAULT_W3C_OPTIONS, ...options };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT METHODS
  // ─────────────────────────────────────────────────────────────────────────
  async export(collection, options) {
    try {
      const tokens = [...collection.getAll()];
      return this.exportTokens(tokens, options);
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Export failed")
      );
    }
  }
  async exportTokens(tokens, options) {
    try {
      const format = options.format ?? "w3c";
      switch (format) {
        case "w3c":
        case "json":
          return this.exportW3C(tokens, options);
        case "css":
          return this.exportCSS(tokens, options);
        case "scss":
          return this.exportSCSS(tokens, options);
        case "typescript":
          return this.exportTypeScript(tokens, options);
        default:
          return failure(new Error(`Unsupported format: ${format}`));
      }
    } catch (error) {
      return failure(
        error instanceof Error ? error : new Error("Export failed")
      );
    }
  }
  async exportTo(collection, options, destination) {
    const exportResult = await this.export(collection, options);
    if (!exportResult.success) {
      return failure(exportResult.error);
    }
    let location;
    if (destination.type === "file") {
      location = destination.path;
    } else if (destination.type === "api") {
      location = destination.url;
    }
    return success({
      ...exportResult.value,
      destination,
      location
    });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // FORMAT SUPPORT
  // ─────────────────────────────────────────────────────────────────────────
  getSupportedFormats() {
    return [...SUPPORTED_FORMATS];
  }
  supportsFormat(format) {
    return SUPPORTED_FORMATS.includes(format);
  }
  getDefaultOptions(format) {
    const baseDefaults = {
      prefix: "",
      suffix: "",
      includeComments: true,
      minify: false,
      nameTransform: "kebab-case"
    };
    switch (format) {
      case "css":
        return { ...baseDefaults };
      case "scss":
        return { ...baseDefaults };
      case "typescript":
        return { ...baseDefaults, nameTransform: "camelCase" };
      default:
        return baseDefaults;
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // VALIDATION
  // ─────────────────────────────────────────────────────────────────────────
  validateOptions(options) {
    if (!options.format) {
      return failure(new Error("Export format is required"));
    }
    if (!this.supportsFormat(options.format)) {
      return failure(new Error(`Unsupported format: ${options.format}`));
    }
    return success(void 0);
  }
  async validateDestination(destination) {
    switch (destination.type) {
      case "file":
        if (!destination.path) {
          return failure(new Error("File path is required"));
        }
        break;
      case "api":
        if (!destination.url) {
          return failure(new Error("API URL is required"));
        }
        try {
          new URL(destination.url);
        } catch {
          return failure(new Error("Invalid API URL"));
        }
        break;
      case "figma":
        if (!destination.fileKey) {
          return failure(new Error("Figma file key is required"));
        }
        break;
    }
    return success(void 0);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PREVIEW
  // ─────────────────────────────────────────────────────────────────────────
  async preview(collection, options, maxLines = 50) {
    const exportResult = await this.export(collection, options);
    if (!exportResult.success) {
      return failure(exportResult.error);
    }
    const lines = exportResult.value.content.split("\n");
    const totalLines = lines.length;
    const truncated = totalLines > maxLines;
    const preview = truncated ? lines.slice(0, maxLines).join("\n") + "\n... (truncated)" : exportResult.value.content;
    return success({ preview, truncated, totalLines });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // BATCH OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────
  async exportMultiple(collection, formats) {
    const results = /* @__PURE__ */ new Map();
    const errors = [];
    for (const options of formats) {
      const result = await this.export(collection, options);
      if (result.success) {
        results.set(options.format, result.value);
      } else {
        errors.push(`${options.format}: ${result.error.message}`);
      }
    }
    if (errors.length > 0 && results.size === 0) {
      return failure(new Error(`All exports failed: ${errors.join("; ")}`));
    }
    return success(results);
  }
  async exportToMultiple(collection, destinations) {
    const results = [];
    const errors = [];
    for (const { options, destination } of destinations) {
      const result = await this.exportTo(collection, options, destination);
      if (result.success) {
        results.push(result.value);
      } else {
        errors.push(`${options.format} to ${destination.type}: ${result.error.message}`);
      }
    }
    if (errors.length > 0 && results.length === 0) {
      return failure(new Error(`All exports failed: ${errors.join("; ")}`));
    }
    return success(results);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE EXPORT METHODS
  // ─────────────────────────────────────────────────────────────────────────
  exportW3C(tokens, options) {
    const output = {};
    const warnings = [];
    if (this.options.includeFileMetadata) {
      output["$schema"] = "https://design-tokens.github.io/community-group/format/";
      output["$metadata"] = {
        name: "tokens",
        version: "1.0.0",
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        generator: "@zuclubit/momoto-ui"
      };
    }
    for (const token of tokens) {
      const w3cToken = this.tokenToW3C(token);
      const pathParts = this.getTokenPath(token);
      if (this.options.groupByPath) {
        this.setNestedValue(output, pathParts, w3cToken);
      } else {
        output[pathParts.join(".")] = w3cToken;
      }
    }
    const content = JSON.stringify(output, null, options.minify ? 0 : 2);
    return success({
      format: "w3c",
      content,
      tokenCount: tokens.length,
      sizeBytes: new TextEncoder().encode(content).length,
      exportedAt: /* @__PURE__ */ new Date(),
      warnings,
      metadata: {
        generatedAt: /* @__PURE__ */ new Date(),
        version: "1.0.0"
      }
    });
  }
  exportCSS(tokens, options) {
    const prefix = options.prefix ?? "";
    const warnings = [];
    const lines = [
      "/* Generated by @zuclubit/momoto-ui */",
      "/* W3C Design Tokens to CSS Custom Properties */",
      "",
      ":root {"
    ];
    for (const token of tokens) {
      const pathParts = this.getTokenPath(token);
      const varName = `--${prefix}${pathParts.join("-")}`;
      const value = this.getTokenValue(token);
      lines.push(`  ${varName}: ${value};`);
    }
    lines.push("}");
    const content = lines.join("\n");
    return success({
      format: "css",
      content,
      tokenCount: tokens.length,
      sizeBytes: new TextEncoder().encode(content).length,
      exportedAt: /* @__PURE__ */ new Date(),
      warnings
    });
  }
  exportSCSS(tokens, options) {
    const prefix = options.prefix ?? "";
    const warnings = [];
    const lines = [
      "// Generated by @zuclubit/momoto-ui",
      "// W3C Design Tokens to SCSS Variables",
      ""
    ];
    for (const token of tokens) {
      const pathParts = this.getTokenPath(token);
      const varName = `$${prefix}${pathParts.join("-")}`;
      const value = this.getTokenValue(token);
      lines.push(`${varName}: ${value};`);
    }
    lines.push("");
    lines.push("// CSS Custom Properties");
    lines.push(":root {");
    for (const token of tokens) {
      const pathParts = this.getTokenPath(token);
      const varName = `--${prefix}${pathParts.join("-")}`;
      const scssVar = `$${prefix}${pathParts.join("-")}`;
      lines.push(`  ${varName}: #{${scssVar}};`);
    }
    lines.push("}");
    const content = lines.join("\n");
    return success({
      format: "scss",
      content,
      tokenCount: tokens.length,
      sizeBytes: new TextEncoder().encode(content).length,
      exportedAt: /* @__PURE__ */ new Date(),
      warnings
    });
  }
  exportTypeScript(tokens, _options) {
    const warnings = [];
    const lines = [
      "/**",
      " * Generated by @zuclubit/momoto-ui",
      " * W3C Design Tokens to TypeScript",
      " */",
      "",
      "export const tokens = {"
    ];
    const obj = {};
    for (const token of tokens) {
      const pathParts = this.getTokenPath(token);
      this.setNestedValue(obj, pathParts, this.getTokenValue(token));
    }
    const jsonStr = JSON.stringify(obj, null, 2);
    const tsContent = jsonStr.replace(/"([^"]+)":/g, "$1:");
    lines.push(tsContent.slice(1, -1));
    lines.push("} as const;");
    lines.push("");
    lines.push("export type TokenPath = keyof typeof tokens;");
    lines.push("export default tokens;");
    const content = lines.join("\n");
    return success({
      format: "typescript",
      content,
      tokenCount: tokens.length,
      sizeBytes: new TextEncoder().encode(content).length,
      exportedAt: /* @__PURE__ */ new Date(),
      warnings
    });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Gets the token path as an array of strings.
   * DesignToken.path is always string[], so this is a simple accessor.
   */
  getTokenPath(token) {
    return token.path.length > 0 ? token.path : ["unknown"];
  }
  tokenToW3C(token) {
    const tokenData = token;
    const w3cToken = {
      $value: tokenData.value
    };
    if (this.options.includeType && tokenData.type) {
      w3cToken.$type = this.mapToW3CType(tokenData.type);
    }
    if (this.options.includeDescription && tokenData.description) {
      w3cToken.$description = tokenData.description;
    }
    if (this.options.includeExtensions && tokenData.metadata) {
      w3cToken.$extensions = {
        [this.options.extensionNamespace]: tokenData.metadata
      };
    }
    return w3cToken;
  }
  mapToW3CType(type) {
    const typeMap = {
      color: "color",
      dimension: "dimension",
      fontFamily: "fontFamily",
      fontWeight: "fontWeight",
      duration: "duration",
      cubicBezier: "cubicBezier",
      number: "number",
      string: "string",
      shadow: "shadow",
      strokeStyle: "strokeStyle",
      border: "border",
      transition: "transition",
      gradient: "gradient",
      typography: "typography"
    };
    return typeMap[type] ?? type;
  }
  getTokenValue(token) {
    const tokenData = token;
    const value = tokenData.value;
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value);
  }
  setNestedValue(obj, path, value) {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!(key in current)) {
        current[key] = {};
      }
      current = current[key];
    }
    current[path[path.length - 1]] = value;
  }
};

export { W3CTokenExporter };
//# sourceMappingURL=chunk-UVENUKT6.mjs.map
//# sourceMappingURL=chunk-UVENUKT6.mjs.map