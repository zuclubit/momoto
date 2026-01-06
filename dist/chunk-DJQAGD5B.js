'use strict';

var chunk5YMPXU57_js = require('./chunk-5YMPXU57.js');
var chunkZM4FIU5F_js = require('./chunk-ZM4FIU5F.js');

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// adapters/tailwind/TailwindConfigAdapter.ts
var DEFAULT_OPTIONS = {
  prefix: "",
  useCssVariables: true,
  cssVariablePrefix: "",
  extend: true,
  includeNamespaces: [],
  excludeNamespaces: [],
  outputFormat: "js",
  includeTypes: false,
  customMappings: {}
};
var TailwindConfigAdapter = class {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(options = {}) {
    // ─────────────────────────────────────────────────────────────────────────
    // PROPERTIES
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "options");
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Genera configuración de Tailwind desde tokens.
   */
  async generate(collection) {
    try {
      const tokens = this.filterTokens(collection);
      const themeConfig = this.buildThemeConfig(tokens);
      const content = this.formatOutput(themeConfig);
      const stats = this.calculateStats(tokens);
      return chunk5YMPXU57_js.success({
        config: themeConfig,
        content,
        stats
      });
    } catch (error) {
      return chunk5YMPXU57_js.failure(
        error instanceof Error ? error : new Error("Failed to generate Tailwind config")
      );
    }
  }
  /**
   * Genera configuración completa de Tailwind incluyendo plugins y dark mode.
   */
  async generateFull(collection, baseConfig) {
    try {
      const themeResult = await this.generate(collection);
      if (!themeResult.success) {
        return chunk5YMPXU57_js.failure(themeResult.error);
      }
      const fullConfig = {
        content: baseConfig?.content ?? ["./src/**/*.{js,ts,jsx,tsx}"],
        darkMode: baseConfig?.darkMode ?? "class",
        prefix: this.options.prefix || baseConfig?.prefix || "",
        theme: this.options.extend ? { extend: themeResult.value.config } : themeResult.value.config,
        plugins: baseConfig?.plugins ?? []
      };
      const content = this.formatFullConfig(fullConfig);
      return chunk5YMPXU57_js.success({ config: fullConfig, content });
    } catch (error) {
      return chunk5YMPXU57_js.failure(
        error instanceof Error ? error : new Error("Failed to generate full Tailwind config")
      );
    }
  }
  /**
   * Genera solo la sección de colores.
   */
  async generateColors(collection) {
    try {
      const tokens = this.filterTokens(collection);
      const colorTokens = tokens.filter((t) => this.isColorToken(t));
      const colors = this.buildColorConfig(colorTokens);
      return chunk5YMPXU57_js.success(colors);
    } catch (error) {
      return chunk5YMPXU57_js.failure(
        error instanceof Error ? error : new Error("Failed to generate colors")
      );
    }
  }
  /**
   * Genera una escala de colores para un nombre base.
   */
  async generateColorScale(collection, baseName) {
    try {
      const tokens = collection.getByPath(`${baseName}.`);
      const scale = {};
      for (const token of tokens) {
        const parts = token.path;
        const key = parts[parts.length - 1];
        scale[key] = this.formatTokenValue(token);
      }
      return chunk5YMPXU57_js.success(scale);
    } catch (error) {
      return chunk5YMPXU57_js.failure(
        error instanceof Error ? error : new Error("Failed to generate color scale")
      );
    }
  }
  /**
   * Genera el plugin de Tailwind para los tokens.
   */
  async generatePlugin(collection) {
    try {
      const tokens = this.filterTokens(collection);
      const colorTokens = tokens.filter((t) => this.isColorToken(t));
      let plugin = `const plugin = require('tailwindcss/plugin');

`;
      plugin += `module.exports = plugin(function({ addBase, addUtilities, theme }) {
`;
      plugin += `  // Add CSS variables to :root
`;
      plugin += `  addBase({
`;
      plugin += `    ':root': {
`;
      for (const token of colorTokens) {
        const varName = this.tokenToVariableName(token);
        const value = this.getTokenRawValue(token);
        plugin += `      '${varName}': '${value}',
`;
      }
      plugin += `    },
`;
      plugin += `    '.dark': {
`;
      plugin += `      // Dark mode overrides go here
`;
      plugin += `    },
`;
      plugin += `  });
`;
      plugin += `});
`;
      return chunk5YMPXU57_js.success(plugin);
    } catch (error) {
      return chunk5YMPXU57_js.failure(
        error instanceof Error ? error : new Error("Failed to generate plugin")
      );
    }
  }
  /**
   * Valida si una configuración es compatible.
   */
  async validate(config) {
    const warnings = [];
    if (config.colors) {
      for (const [key, value] of Object.entries(config.colors)) {
        if (typeof value === "string" && !this.isValidColorValue(value)) {
          warnings.push(`Color "${key}" has potentially invalid value: ${value}`);
        }
      }
    }
    if (config.spacing) {
      for (const [key, value] of Object.entries(config.spacing)) {
        if (!this.isValidSpacingValue(value)) {
          warnings.push(`Spacing "${key}" has potentially invalid value: ${value}`);
        }
      }
    }
    return chunk5YMPXU57_js.success({ valid: warnings.length === 0, warnings });
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  filterTokens(collection) {
    let tokens = collection.getAll();
    if (this.options.includeNamespaces.length > 0) {
      tokens = tokens.filter(
        (t) => this.options.includeNamespaces.some((ns) => t.name.startsWith(ns))
      );
    }
    if (this.options.excludeNamespaces.length > 0) {
      tokens = tokens.filter(
        (t) => !this.options.excludeNamespaces.some((ns) => t.name.startsWith(ns))
      );
    }
    return [...tokens];
  }
  buildThemeConfig(tokens) {
    const config = {};
    const colorTokens = tokens.filter((t) => this.isColorToken(t));
    const spacingTokens = tokens.filter((t) => this.isSpacingToken(t));
    const typographyTokens = tokens.filter((t) => this.isTypographyToken(t));
    const shadowTokens = tokens.filter((t) => this.isShadowToken(t));
    const borderTokens = tokens.filter((t) => this.isBorderToken(t));
    if (colorTokens.length > 0) {
      config.colors = this.buildColorConfig(colorTokens);
    }
    if (spacingTokens.length > 0) {
      config.spacing = this.buildSpacingConfig(spacingTokens);
    }
    if (typographyTokens.length > 0) {
      const typo = this.buildTypographyConfig(typographyTokens);
      if (typo.fontSize && Object.keys(typo.fontSize).length > 0) {
        config.fontSize = typo.fontSize;
      }
      if (typo.fontFamily && Object.keys(typo.fontFamily).length > 0) {
        config.fontFamily = typo.fontFamily;
      }
      if (typo.fontWeight && Object.keys(typo.fontWeight).length > 0) {
        config.fontWeight = typo.fontWeight;
      }
      if (typo.lineHeight && Object.keys(typo.lineHeight).length > 0) {
        config.lineHeight = typo.lineHeight;
      }
      if (typo.letterSpacing && Object.keys(typo.letterSpacing).length > 0) {
        config.letterSpacing = typo.letterSpacing;
      }
    }
    if (shadowTokens.length > 0) {
      config.boxShadow = this.buildShadowConfig(shadowTokens);
    }
    if (borderTokens.length > 0) {
      const border = this.buildBorderConfig(borderTokens);
      if (border.borderRadius && Object.keys(border.borderRadius).length > 0) {
        config.borderRadius = border.borderRadius;
      }
      if (border.borderWidth && Object.keys(border.borderWidth).length > 0) {
        config.borderWidth = border.borderWidth;
      }
    }
    return config;
  }
  buildColorConfig(tokens) {
    const colors = {};
    const grouped = /* @__PURE__ */ new Map();
    for (const token of tokens) {
      const parts = token.path;
      const relevantParts = parts[0] === "color" ? parts.slice(1) : parts;
      if (relevantParts.length >= 2) {
        const baseName = relevantParts[0];
        if (!grouped.has(baseName)) {
          grouped.set(baseName, []);
        }
        grouped.get(baseName).push(token);
      } else if (relevantParts.length === 1) {
        colors[relevantParts[0]] = this.formatTokenValue(token);
      }
    }
    for (const [baseName, groupTokens] of grouped) {
      if (groupTokens.length === 1) {
        colors[baseName] = this.formatTokenValue(groupTokens[0]);
      } else {
        const scale = {};
        for (const token of groupTokens) {
          const parts = token.path;
          const relevantParts = parts[0] === "color" ? parts.slice(1) : parts;
          const key = relevantParts.slice(1).join("-") || "DEFAULT";
          scale[key] = this.formatTokenValue(token);
        }
        colors[baseName] = scale;
      }
    }
    return colors;
  }
  buildSpacingConfig(tokens) {
    const spacing = {};
    for (const token of tokens) {
      const key = this.tokenToKey(token, "spacing");
      spacing[key] = this.formatTokenValue(token);
    }
    return spacing;
  }
  buildTypographyConfig(tokens) {
    const result = {};
    for (const token of tokens) {
      const pathStr = token.name.toLowerCase();
      if (pathStr.includes("size") || pathStr.includes("fontsize")) {
        result.fontSize = result.fontSize ?? {};
        const key = this.tokenToKey(token, "fontSize");
        result.fontSize[key] = this.formatTokenValue(token);
      } else if (pathStr.includes("family") || pathStr.includes("fontfamily")) {
        result.fontFamily = result.fontFamily ?? {};
        const key = this.tokenToKey(token, "fontFamily");
        const value = this.getTokenRawValue(token);
        result.fontFamily[key] = typeof value === "string" ? [value] : value;
      } else if (pathStr.includes("weight") || pathStr.includes("fontweight")) {
        result.fontWeight = result.fontWeight ?? {};
        const key = this.tokenToKey(token, "fontWeight");
        result.fontWeight[key] = this.formatTokenValue(token);
      } else if (pathStr.includes("lineheight") || pathStr.includes("line-height")) {
        result.lineHeight = result.lineHeight ?? {};
        const key = this.tokenToKey(token, "lineHeight");
        result.lineHeight[key] = this.formatTokenValue(token);
      } else if (pathStr.includes("letterspacing") || pathStr.includes("letter-spacing")) {
        result.letterSpacing = result.letterSpacing ?? {};
        const key = this.tokenToKey(token, "letterSpacing");
        result.letterSpacing[key] = this.formatTokenValue(token);
      }
    }
    return result;
  }
  buildShadowConfig(tokens) {
    const shadows = {};
    for (const token of tokens) {
      const key = this.tokenToKey(token, "shadow");
      shadows[key] = this.formatTokenValue(token);
    }
    return shadows;
  }
  buildBorderConfig(tokens) {
    const result = {};
    for (const token of tokens) {
      const pathStr = token.name.toLowerCase();
      if (pathStr.includes("radius")) {
        result.borderRadius = result.borderRadius ?? {};
        const key = this.tokenToKey(token, "borderRadius");
        result.borderRadius[key] = this.formatTokenValue(token);
      } else if (pathStr.includes("width")) {
        result.borderWidth = result.borderWidth ?? {};
        const key = this.tokenToKey(token, "borderWidth");
        result.borderWidth[key] = this.formatTokenValue(token);
      }
    }
    return result;
  }
  formatTokenValue(token) {
    if (this.options.useCssVariables) {
      return `var(${this.tokenToVariableName(token)})`;
    }
    return String(this.getTokenRawValue(token));
  }
  tokenToVariableName(token) {
    const prefix = this.options.cssVariablePrefix ? `--${this.options.cssVariablePrefix}-` : "--";
    return `${prefix}${token.name.replace(/\./g, "-")}`;
  }
  tokenToKey(token, type) {
    const parts = token.path;
    const typePrefix = type.toLowerCase();
    const relevantParts = parts[0].toLowerCase().includes(typePrefix) ? parts.slice(1) : parts;
    return relevantParts.join("-") || "DEFAULT";
  }
  getTokenRawValue(token) {
    return token.value;
  }
  isColorToken(token) {
    const pathStr = token.name.toLowerCase();
    return pathStr.includes("color") || pathStr.includes("background") || pathStr.includes("foreground") || pathStr.includes("border") || pathStr.includes("text") || pathStr.includes("brand") || pathStr.includes("surface") || pathStr.includes("accent") || pathStr.includes("primary") || pathStr.includes("secondary") || pathStr.includes("success") || pathStr.includes("warning") || pathStr.includes("error") || pathStr.includes("info");
  }
  isSpacingToken(token) {
    const pathStr = token.name.toLowerCase();
    return pathStr.includes("spacing") || pathStr.includes("space") || pathStr.includes("gap") || pathStr.includes("margin") || pathStr.includes("padding");
  }
  isTypographyToken(token) {
    const pathStr = token.name.toLowerCase();
    return pathStr.includes("font") || pathStr.includes("text") || pathStr.includes("typography") || pathStr.includes("lineheight") || pathStr.includes("letterspacing");
  }
  isShadowToken(token) {
    const pathStr = token.name.toLowerCase();
    return pathStr.includes("shadow") || pathStr.includes("elevation");
  }
  isBorderToken(token) {
    const pathStr = token.name.toLowerCase();
    return pathStr.includes("radius") || pathStr.includes("border");
  }
  formatOutput(config) {
    const wrapper = this.options.extend ? { theme: { extend: config } } : { theme: config };
    switch (this.options.outputFormat) {
      case "json":
        return JSON.stringify(wrapper, null, 2);
      case "ts":
        return this.formatTypeScript(wrapper);
      case "esm":
        return `export default ${JSON.stringify(wrapper, null, 2)};`;
      case "cjs":
      case "js":
      default:
        return `module.exports = ${JSON.stringify(wrapper, null, 2)};`;
    }
  }
  formatFullConfig(config) {
    switch (this.options.outputFormat) {
      case "json":
        return JSON.stringify(config, null, 2);
      case "ts":
        return this.formatTypeScript(config);
      case "esm":
        return `export default ${JSON.stringify(config, null, 2)};`;
      case "cjs":
      case "js":
      default:
        return `module.exports = ${JSON.stringify(config, null, 2)};`;
    }
  }
  formatTypeScript(config) {
    let output = "";
    if (this.options.includeTypes) {
      output += `import type { Config } from 'tailwindcss';

`;
      output += `const config: Config = ${JSON.stringify(config, null, 2)};

`;
      output += `export default config;
`;
    } else {
      output += `export default ${JSON.stringify(config, null, 2)} as const;
`;
    }
    return output;
  }
  calculateStats(tokens) {
    return {
      totalTokens: tokens.length,
      colorTokens: tokens.filter((t) => this.isColorToken(t)).length,
      spacingTokens: tokens.filter((t) => this.isSpacingToken(t)).length,
      typographyTokens: tokens.filter((t) => this.isTypographyToken(t)).length,
      otherTokens: tokens.filter(
        (t) => !this.isColorToken(t) && !this.isSpacingToken(t) && !this.isTypographyToken(t)
      ).length
    };
  }
  isValidColorValue(value) {
    return value.startsWith("#") || value.startsWith("rgb") || value.startsWith("hsl") || value.startsWith("oklch") || value.startsWith("var(") || /^[a-z]+$/i.test(value);
  }
  isValidSpacingValue(value) {
    return value.endsWith("px") || value.endsWith("rem") || value.endsWith("em") || value.endsWith("%") || value === "0" || value.startsWith("var(");
  }
};
var TailwindConfigAdapter_default = TailwindConfigAdapter;

exports.TailwindConfigAdapter = TailwindConfigAdapter;
exports.TailwindConfigAdapter_default = TailwindConfigAdapter_default;
//# sourceMappingURL=chunk-DJQAGD5B.js.map
//# sourceMappingURL=chunk-DJQAGD5B.js.map