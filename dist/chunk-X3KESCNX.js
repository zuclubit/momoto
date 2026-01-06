'use strict';

var chunk5YMPXU57_js = require('./chunk-5YMPXU57.js');
var chunkZM4FIU5F_js = require('./chunk-ZM4FIU5F.js');

/* @zuclubit/momoto-ui - Color Intelligence Design System */

// domain/perceptual/value-objects/PerceptualColor.ts
var PerceptualColor = class _PerceptualColor {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR (Private - use static factories)
  // ─────────────────────────────────────────────────────────────────────────
  constructor(oklch, options = {}) {
    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE STATE
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "_oklch");
    chunkZM4FIU5F_js.__publicField(this, "_alpha");
    chunkZM4FIU5F_js.__publicField(this, "_gamutMapped");
    // Lazy-evaluated caches
    chunkZM4FIU5F_js.__publicField(this, "_hexCache");
    chunkZM4FIU5F_js.__publicField(this, "_rgbCache");
    chunkZM4FIU5F_js.__publicField(this, "_hslCache");
    chunkZM4FIU5F_js.__publicField(this, "_hctCache");
    chunkZM4FIU5F_js.__publicField(this, "_analysisCache");
    this._oklch = Object.freeze({
      l: Math.max(0, Math.min(1, oklch.l)),
      c: Math.max(0, oklch.c),
      h: (oklch.h % 360 + 360) % 360
    });
    this._alpha = options.alpha ?? 1;
    this._gamutMapped = options.gamutMapped ?? false;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // STATIC FACTORIES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Crea un PerceptualColor desde un valor hexadecimal.
   */
  static fromHex(hex) {
    const rgb = hexToRgb(hex);
    const oklch = rgbToOklch(rgb);
    return new _PerceptualColor(oklch);
  }
  /**
   * Crea un PerceptualColor desde coordenadas OKLCH.
   */
  static fromOklch(l, c, h, alpha = 1) {
    return new _PerceptualColor({ l, c, h }, { alpha });
  }
  /**
   * Crea un PerceptualColor desde coordenadas RGB.
   */
  static fromRgb(r, g, b, alpha = 1) {
    const oklch = rgbToOklch({ r, g, b });
    return new _PerceptualColor(oklch, { alpha });
  }
  /**
   * Crea un PerceptualColor desde coordenadas HCT.
   */
  static fromHct(h, c, t) {
    const l = t / 100;
    const oklchC = c / 100 * 0.4;
    return new _PerceptualColor({ l, c: oklchC, h });
  }
  /**
   * Intenta crear un PerceptualColor, retornando Result.
   */
  static tryFromHex(hex) {
    try {
      if (!chunk5YMPXU57_js.TypeGuards.isHexColor(hex)) {
        return { success: false, error: new Error(`Invalid hex color: ${hex}`) };
      }
      return { success: true, value: _PerceptualColor.fromHex(hex) };
    } catch (e) {
      return { success: false, error: e };
    }
  }
  // ─────────────────────────────────────────────────────────────────────────
  // GETTERS (Coordenadas)
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Coordenadas OKLCH (fuente de verdad).
   */
  get oklch() {
    return this._oklch;
  }
  /**
   * Luminancia OKLCH (0-1).
   */
  get lightness() {
    return chunk5YMPXU57_js.BrandConstructors.oklchLightness(this._oklch.l);
  }
  /**
   * Chroma OKLCH.
   */
  get chroma() {
    return chunk5YMPXU57_js.BrandConstructors.oklchChroma(this._oklch.c);
  }
  /**
   * Hue OKLCH (0-360).
   */
  get hue() {
    return chunk5YMPXU57_js.BrandConstructors.oklchHue(this._oklch.h);
  }
  /**
   * Alpha (transparencia).
   */
  get alpha() {
    return this._alpha;
  }
  /**
   * Indica si el color fue mapeado al gamut sRGB.
   */
  get isGamutMapped() {
    return this._gamutMapped;
  }
  /**
   * Coordenadas RGB (lazy-evaluated).
   */
  get rgb() {
    if (!this._rgbCache) {
      this._rgbCache = oklchToRgb(this._oklch);
    }
    return this._rgbCache;
  }
  /**
   * Coordenadas HSL (lazy-evaluated).
   */
  get hsl() {
    if (!this._hslCache) {
      this._hslCache = rgbToHsl(this.rgb);
    }
    return this._hslCache;
  }
  /**
   * Coordenadas HCT aproximadas (lazy-evaluated).
   */
  get hct() {
    if (!this._hctCache) {
      this._hctCache = {
        h: this._oklch.h,
        c: this._oklch.c * 250,
        // Scale to HCT range
        t: this._oklch.l * 100
      };
    }
    return this._hctCache;
  }
  /**
   * Valor hexadecimal (lazy-evaluated).
   */
  get hex() {
    if (!this._hexCache) {
      this._hexCache = rgbToHex(this.rgb);
    }
    return this._hexCache;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // OPERACIONES INMUTABLES
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Aclara el color.
   * @param amount - Cantidad (0-1) para aclarar
   */
  lighten(amount) {
    const newL = Math.min(1, this._oklch.l + amount);
    return new _PerceptualColor({
      l: newL,
      c: this._oklch.c,
      h: this._oklch.h
    }, { alpha: this._alpha });
  }
  /**
   * Oscurece el color.
   * @param amount - Cantidad (0-1) para oscurecer
   */
  darken(amount) {
    const newL = Math.max(0, this._oklch.l - amount);
    return new _PerceptualColor({
      l: newL,
      c: this._oklch.c,
      h: this._oklch.h
    }, { alpha: this._alpha });
  }
  /**
   * Aumenta la saturación.
   * @param amount - Cantidad para aumentar chroma
   */
  saturate(amount) {
    const newC = this._oklch.c + amount;
    return new _PerceptualColor({
      l: this._oklch.l,
      c: newC,
      h: this._oklch.h
    }, { alpha: this._alpha });
  }
  /**
   * Reduce la saturación.
   * @param amount - Cantidad para reducir chroma
   */
  desaturate(amount) {
    const newC = Math.max(0, this._oklch.c - amount);
    return new _PerceptualColor({
      l: this._oklch.l,
      c: newC,
      h: this._oklch.h
    }, { alpha: this._alpha });
  }
  /**
   * Rota el hue.
   * @param degrees - Grados para rotar
   */
  rotateHue(degrees) {
    const newH = ((this._oklch.h + degrees) % 360 + 360) % 360;
    return new _PerceptualColor({
      l: this._oklch.l,
      c: this._oklch.c,
      h: newH
    }, { alpha: this._alpha });
  }
  /**
   * Ajusta la transparencia.
   * @param alpha - Nuevo valor alpha (0-1)
   */
  withAlpha(alpha) {
    return new _PerceptualColor(this._oklch, {
      alpha: Math.max(0, Math.min(1, alpha)),
      gamutMapped: this._gamutMapped
    });
  }
  /**
   * Interpola hacia otro color.
   * @param target - Color destino
   * @param t - Factor de interpolación (0-1)
   * @param options - Opciones de interpolación
   */
  interpolate(target, t, options = {}) {
    const { hueDirection = "shorter" } = options;
    const l = this._oklch.l + (target._oklch.l - this._oklch.l) * t;
    const c = this._oklch.c + (target._oklch.c - this._oklch.c) * t;
    const h = interpolateHue(
      this._oklch.h,
      target._oklch.h,
      t,
      hueDirection
    );
    const alpha = this._alpha + (target._alpha - this._alpha) * t;
    return new _PerceptualColor({ l, c, h }, { alpha });
  }
  /**
   * Genera un gradiente hacia otro color.
   * @param target - Color destino
   * @param steps - Número de pasos (incluye inicio y fin)
   */
  gradient(target, steps, options = {}) {
    const result = [];
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      result.push(this.interpolate(target, t, options));
    }
    return result;
  }
  /**
   * Obtiene el color complementario.
   */
  complement() {
    return this.rotateHue(180);
  }
  /**
   * Obtiene colores análogos.
   * @param angle - Ángulo de separación (default 30°)
   */
  analogous(angle = 30) {
    return [this.rotateHue(-angle), this.rotateHue(angle)];
  }
  /**
   * Obtiene colores triádicos.
   */
  triadic() {
    return [this.rotateHue(120), this.rotateHue(240)];
  }
  // ─────────────────────────────────────────────────────────────────────────
  // ANÁLISIS PERCEPTUAL
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Analiza las propiedades perceptuales del color.
   */
  analyze() {
    if (!this._analysisCache) {
      this._analysisCache = this.computeAnalysis();
    }
    return this._analysisCache;
  }
  computeAnalysis() {
    const { l, c, h } = this._oklch;
    const warmth = this.computeWarmth(h);
    const brightness = l < 0.35 ? "dark" : l > 0.7 ? "light" : "medium";
    const saturation = c < 0.03 ? "desaturated" : c < 0.1 ? "muted" : c < 0.2 ? "saturated" : "vivid";
    const contrastResult = this.computeContrastMode();
    return {
      warmth,
      brightness,
      saturation,
      contrastMode: contrastResult.mode,
      contrastConfidence: contrastResult.confidence
    };
  }
  computeWarmth(hue) {
    if (hue >= 0 && hue < 30 || hue >= 330) return "hot";
    if (hue >= 30 && hue < 60) return "warm";
    if (hue >= 60 && hue < 150) return "neutral";
    if (hue >= 150 && hue < 210) return "cool";
    if (hue >= 210 && hue < 270) return "cold";
    return "cool";
  }
  computeContrastMode() {
    const { l, c, h } = this._oklch;
    const lightnessScore = l;
    const warmth = this.computeWarmth(h);
    const warmthAdjustment = warmth === "hot" ? 0.08 : warmth === "warm" ? 0.05 : warmth === "cold" ? -0.05 : warmth === "cool" ? -0.03 : 0;
    const chromaAdjustment = c > 0.15 ? -0.02 : 0;
    const combinedScore = lightnessScore + warmthAdjustment + chromaAdjustment;
    const threshold = 0.6;
    const uncertaintyZone = 0.1;
    const mode = combinedScore > threshold ? "light-content" : "dark-content";
    const distanceToThreshold = Math.abs(combinedScore - threshold);
    const confidence = Math.min(1, distanceToThreshold / uncertaintyZone);
    return {
      mode,
      confidence: chunk5YMPXU57_js.BrandConstructors.confidenceLevel(confidence)
    };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // CONVERSIONES A STRING
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Convierte a string CSS OKLCH.
   */
  toCssOklch() {
    const { l, c, h } = this._oklch;
    if (this._alpha < 1) {
      return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)} / ${this._alpha})`;
    }
    return `oklch(${(l * 100).toFixed(1)}% ${c.toFixed(3)} ${h.toFixed(1)})`;
  }
  /**
   * Convierte a string CSS RGB.
   */
  toCssRgb() {
    const { r, g, b } = this.rgb;
    if (this._alpha < 1) {
      return `rgba(${r}, ${g}, ${b}, ${this._alpha})`;
    }
    return `rgb(${r}, ${g}, ${b})`;
  }
  /**
   * Convierte a string CSS HSL.
   */
  toCssHsl() {
    const { h, s, l } = this.hsl;
    if (this._alpha < 1) {
      return `hsla(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%, ${this._alpha})`;
    }
    return `hsl(${h.toFixed(0)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;
  }
  /**
   * Representación por defecto es hex.
   */
  toString() {
    return this.hex;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // COMPARACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Calcula la diferencia perceptual (Delta E OKLCH).
   */
  deltaE(other) {
    const dL = this._oklch.l - other._oklch.l;
    const dC = this._oklch.c - other._oklch.c;
    const h1 = this._oklch.h * Math.PI / 180;
    const h2 = other._oklch.h * Math.PI / 180;
    const dH = 2 * Math.sqrt(this._oklch.c * other._oklch.c) * Math.sin((h1 - h2) / 2);
    return Math.sqrt(dL * dL + dC * dC + dH * dH);
  }
  /**
   * Verifica si dos colores son perceptualmente similares.
   * @param other - Otro color
   * @param threshold - Umbral de Delta E (default 0.02)
   */
  isSimilarTo(other, threshold = 0.02) {
    return this.deltaE(other) < threshold;
  }
  /**
   * Verifica igualdad estructural.
   */
  equals(other) {
    return this._oklch.l === other._oklch.l && this._oklch.c === other._oklch.c && this._oklch.h === other._oklch.h && this._alpha === other._alpha;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // SERIALIZACIÓN
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Serializa a objeto JSON.
   */
  toJSON() {
    return {
      oklch: { ...this._oklch },
      hex: this.hex,
      alpha: this._alpha,
      gamutMapped: this._gamutMapped
    };
  }
  /**
   * Crea desde objeto JSON.
   */
  static fromJSON(json) {
    return new _PerceptualColor(json.oklch, { alpha: json.alpha });
  }
};
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const expanded = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(expanded, 16);
  return {
    r: num >> 16 & 255,
    g: num >> 8 & 255,
    b: num & 255
  };
}
function rgbToHex(rgb) {
  const toHex = (n) => Math.round(n).toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
function rgbToOklch(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const toLinear = (c) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l = Math.cbrt(l_);
  const m = Math.cbrt(m_);
  const s = Math.cbrt(s_);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bOk = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(a * a + bOk * bOk);
  let h = Math.atan2(bOk, a) * 180 / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c: C, h };
}
function oklchToRgb(oklch) {
  const { l: L, c: C, h } = oklch;
  const hRad = h * Math.PI / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  let lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const toGamma = (c) => c <= 31308e-7 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  lr = Math.max(0, Math.min(1, toGamma(lr)));
  lg = Math.max(0, Math.min(1, toGamma(lg)));
  lb = Math.max(0, Math.min(1, toGamma(lb)));
  return {
    r: Math.round(lr * 255),
    g: Math.round(lg * 255),
    b: Math.round(lb * 255)
  };
}
function rgbToHsl(rgb) {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) {
    return { h: 0, s: 0, l: l * 100 };
  }
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
  }
  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}
function interpolateHue(h1, h2, t, direction) {
  let diff = h2 - h1;
  switch (direction) {
    case "shorter":
      if (diff > 180) diff -= 360;
      else if (diff < -180) diff += 360;
      break;
    case "longer":
      if (diff > 0 && diff < 180) diff -= 360;
      else if (diff < 0 && diff > -180) diff += 360;
      break;
    case "increasing":
      if (diff < 0) diff += 360;
      break;
    case "decreasing":
      if (diff > 0) diff -= 360;
      break;
  }
  let result = h1 + diff * t;
  return (result % 360 + 360) % 360;
}

// domain/perceptual/services/AccessibilityService.ts
var WCAG_THRESHOLDS = Object.freeze({
  AAA: 7,
  AA: 4.5,
  "AA-large": 3
});
var APCA_THRESHOLDS = Object.freeze({
  Lc75: 75,
  // Body text (12px+)
  Lc60: 60,
  // Large text (18px+), sub-fluent text
  Lc45: 45,
  // Headings, large icons
  Lc30: 30,
  // Spot text, non-essential
  Lc15: 15
  // Minimum discernible
});
var AccessibilityService = class {
  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Evalúa el contraste entre dos colores.
   * Retorna métricas WCAG y APCA.
   */
  evaluate(background, foreground) {
    const wcagRatio = this.calculateWcagContrast(background, foreground);
    const apcaValue = this.calculateApcaContrast(background, foreground);
    return Object.freeze({
      wcagRatio,
      wcagLevel: this.getWcagLevel(wcagRatio),
      apcaValue,
      apcaLevel: this.getApcaLevel(apcaValue),
      meetsWcagAA: wcagRatio >= WCAG_THRESHOLDS.AA,
      meetsWcagAAA: wcagRatio >= WCAG_THRESHOLDS.AAA,
      meetsApcaBody: Math.abs(apcaValue) >= APCA_THRESHOLDS.Lc60,
      meetsApcaHeading: Math.abs(apcaValue) >= APCA_THRESHOLDS.Lc45,
      meetsApcaUI: Math.abs(apcaValue) >= APCA_THRESHOLDS.Lc30
    });
  }
  /**
   * Calcula ratio de contraste WCAG 2.1.
   * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
   */
  calculateWcagContrast(background, foreground) {
    const l1 = this.relativeLuminance(background);
    const l2 = this.relativeLuminance(foreground);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  /**
   * Calcula valor de contraste APCA.
   *
   * Implementación simplificada del algoritmo APCA.
   * Para producción, considerar usar la librería oficial apca-w3.
   *
   * @see https://github.com/Myndex/SAPC-APCA
   * @see https://www.myndex.com/APCA/
   */
  calculateApcaContrast(background, foreground) {
    const yBg = this.apcaLuminance(background);
    const yFg = this.apcaLuminance(foreground);
    const polarity = yBg > yFg ? 1 : -1;
    const normBG = Math.pow(yBg, 0.56);
    const normTXT = Math.pow(yFg, 0.57);
    const SAPC = (normBG - normTXT) * 1.14;
    return SAPC * 100 * polarity;
  }
  /**
   * Determina nivel WCAG basado en ratio de contraste.
   */
  getWcagLevel(ratio) {
    if (ratio >= WCAG_THRESHOLDS.AAA) return "AAA";
    if (ratio >= WCAG_THRESHOLDS.AA) return "AA";
    if (ratio >= WCAG_THRESHOLDS["AA-large"]) return "AA-large";
    return "Fail";
  }
  /**
   * Determina nivel APCA basado en valor Lc.
   */
  getApcaLevel(lc) {
    const absLc = Math.abs(lc);
    if (absLc >= APCA_THRESHOLDS.Lc75) return "Lc75";
    if (absLc >= APCA_THRESHOLDS.Lc60) return "Lc60";
    if (absLc >= APCA_THRESHOLDS.Lc45) return "Lc45";
    if (absLc >= APCA_THRESHOLDS.Lc30) return "Lc30";
    if (absLc >= APCA_THRESHOLDS.Lc15) return "Lc15";
    return "Fail";
  }
  /**
   * Sugiere color de texto óptimo para un fondo dado.
   */
  suggestTextColor(background, preferDark = true) {
    const white = { r: 255, g: 255, b: 255 };
    const black = { r: 0, g: 0, b: 0 };
    const whiteEval = this.evaluate(background, white);
    const blackEval = this.evaluate(background, black);
    const whiteBetter = Math.abs(whiteEval.apcaValue) > Math.abs(blackEval.apcaValue);
    const blackBetter = Math.abs(blackEval.apcaValue) > Math.abs(whiteEval.apcaValue);
    const useWhite = whiteBetter || !blackBetter && !preferDark;
    if (useWhite) {
      return { color: white, evaluation: whiteEval };
    } else {
      return { color: black, evaluation: blackEval };
    }
  }
  /**
   * Verifica si un par de colores cumple requisitos mínimos.
   */
  meetsMinimumRequirements(background, foreground, options = {}) {
    const { wcagLevel = "AA", apcaMinimum = APCA_THRESHOLDS.Lc45 } = options;
    const evaluation = this.evaluate(background, foreground);
    const wcagThreshold = wcagLevel === "AAA" ? WCAG_THRESHOLDS.AAA : WCAG_THRESHOLDS.AA;
    return evaluation.wcagRatio >= wcagThreshold && Math.abs(evaluation.apcaValue) >= apcaMinimum;
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Calcula luminancia relativa WCAG.
   * @see https://www.w3.org/WAI/GL/wiki/Relative_luminance
   */
  relativeLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : Math.pow((normalized + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  /**
   * Calcula luminancia perceptual APCA (Y).
   * Coeficientes específicos de APCA.
   */
  apcaLuminance(rgb) {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(
      (channel) => Math.pow(channel / 255, 2.4)
    );
    return 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
  }
};
var accessibilityService = new AccessibilityService();

// domain/governance/value-objects/EnterprisePolicy.ts
var EnterprisePolicy = class _EnterprisePolicy {
  // ─────────────────────────────────────────────────────────────────────────
  // CONSTRUCTOR
  // ─────────────────────────────────────────────────────────────────────────
  constructor(config) {
    // ─────────────────────────────────────────────────────────────────────────
    // PROPERTIES
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "id");
    chunkZM4FIU5F_js.__publicField(this, "name");
    chunkZM4FIU5F_js.__publicField(this, "description");
    chunkZM4FIU5F_js.__publicField(this, "category");
    chunkZM4FIU5F_js.__publicField(this, "scope");
    chunkZM4FIU5F_js.__publicField(this, "enforcement");
    chunkZM4FIU5F_js.__publicField(this, "severity");
    chunkZM4FIU5F_js.__publicField(this, "version");
    chunkZM4FIU5F_js.__publicField(this, "rules");
    chunkZM4FIU5F_js.__publicField(this, "enabled");
    chunkZM4FIU5F_js.__publicField(this, "metadata");
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.category = config.category;
    this.scope = config.scope;
    this.enforcement = config.enforcement;
    this.severity = config.severity;
    this.version = config.version;
    this.rules = Object.freeze([...config.rules]);
    this.enabled = config.enabled ?? true;
    this.metadata = Object.freeze({ ...config.metadata });
    Object.freeze(this);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // FACTORY METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Creates a new EnterprisePolicy from configuration.
   */
  static create(config) {
    const validation = _EnterprisePolicy.validate(config);
    if (!validation.valid) {
      return chunk5YMPXU57_js.failure(new Error(validation.errors.join("; ")));
    }
    return chunk5YMPXU57_js.success(new _EnterprisePolicy(config));
  }
  /**
   * Creates a policy without validation (for internal use).
   */
  static unsafe(config) {
    return new _EnterprisePolicy(config);
  }
  /**
   * Validates policy configuration.
   */
  static validate(config) {
    const errors = [];
    if (!config.id || config.id.trim().length === 0) {
      errors.push("Policy ID is required");
    }
    if (!config.name || config.name.trim().length === 0) {
      errors.push("Policy name is required");
    }
    if (!config.description || config.description.trim().length === 0) {
      errors.push("Policy description is required");
    }
    if (!config.rules || config.rules.length === 0) {
      errors.push("Policy must have at least one rule");
    }
    if (!/^\d+\.\d+\.\d+$/.test(config.version)) {
      errors.push("Policy version must be in semver format (x.y.z)");
    }
    return { valid: errors.length === 0, errors };
  }
  // ─────────────────────────────────────────────────────────────────────────
  // INSTANCE METHODS
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Checks if this policy applies to a given context.
   */
  appliesTo(context) {
    if (!this.enabled) return false;
    if (this.scope === "global") return true;
    return this.scope === context.scope;
  }
  /**
   * Returns a new policy with enabled state toggled.
   */
  withEnabled(enabled) {
    return new _EnterprisePolicy({
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      scope: this.scope,
      enforcement: this.enforcement,
      severity: this.severity,
      version: this.version,
      rules: this.rules,
      enabled,
      metadata: this.metadata
    });
  }
  /**
   * Returns a new policy with updated metadata.
   */
  withMetadata(metadata) {
    return new _EnterprisePolicy({
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      scope: this.scope,
      enforcement: this.enforcement,
      severity: this.severity,
      version: this.version,
      rules: this.rules,
      enabled: this.enabled,
      metadata: { ...this.metadata, ...metadata }
    });
  }
  /**
   * Checks if policy is blocking (must pass for operation to proceed).
   */
  isBlocking() {
    return this.enforcement === "required" && this.severity === "critical";
  }
  /**
   * Checks if policy is advisory only (warnings, not errors).
   */
  isAdvisory() {
    return this.enforcement === "optional" || this.severity === "info";
  }
  /**
   * Gets the weight of this policy for scoring.
   */
  getWeight() {
    const severityWeights = {
      critical: 10,
      high: 7,
      medium: 5,
      low: 3,
      info: 1
    };
    const enforcementMultiplier = {
      required: 2,
      recommended: 1.5,
      optional: 1
    };
    return severityWeights[this.severity] * enforcementMultiplier[this.enforcement];
  }
  /**
   * Serializes policy to plain object.
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      scope: this.scope,
      enforcement: this.enforcement,
      severity: this.severity,
      version: this.version,
      rules: [...this.rules],
      enabled: this.enabled,
      metadata: { ...this.metadata }
    };
  }
  /**
   * Checks equality with another policy.
   */
  equals(other) {
    return this.id === other.id && this.version === other.version;
  }
};
var PolicySet = class _PolicySet {
  constructor(policies = []) {
    chunkZM4FIU5F_js.__publicField(this, "policies");
    this.policies = new Map(policies.map((p) => [p.id, p]));
    Object.freeze(this);
  }
  /**
   * Gets a policy by ID.
   */
  get(id) {
    return this.policies.get(id);
  }
  /**
   * Gets all policies.
   */
  all() {
    return Object.freeze([...this.policies.values()]);
  }
  /**
   * Filters policies by scope.
   */
  byScope(scope) {
    return this.all().filter((p) => p.scope === scope || p.scope === "global");
  }
  /**
   * Filters policies by category.
   */
  byCategory(category) {
    return this.all().filter((p) => p.category === category);
  }
  /**
   * Filters policies by enforcement level.
   */
  byEnforcement(enforcement) {
    return this.all().filter((p) => p.enforcement === enforcement);
  }
  /**
   * Gets only enabled policies.
   */
  enabled() {
    return this.all().filter((p) => p.enabled);
  }
  /**
   * Gets blocking policies (must pass).
   */
  blocking() {
    return this.all().filter((p) => p.isBlocking());
  }
  /**
   * Adds a policy and returns new set.
   */
  add(policy) {
    const newPolicies = [...this.policies.values(), policy];
    return new _PolicySet(newPolicies);
  }
  /**
   * Removes a policy and returns new set.
   */
  remove(id) {
    const newPolicies = [...this.policies.values()].filter((p) => p.id !== id);
    return new _PolicySet(newPolicies);
  }
  /**
   * Gets policies that apply to a context.
   */
  applicableTo(context) {
    return this.enabled().filter((p) => p.appliesTo(context));
  }
  /**
   * Returns count of policies.
   */
  get size() {
    return this.policies.size;
  }
  /**
   * Checks if set is empty.
   */
  isEmpty() {
    return this.policies.size === 0;
  }
};

// domain/governance/services/GovernanceEvaluator.ts
var GovernanceEvaluator = class {
  constructor() {
    // ─────────────────────────────────────────────────────────────────────────
    // CUSTOM EVALUATORS REGISTRY
    // ─────────────────────────────────────────────────────────────────────────
    chunkZM4FIU5F_js.__publicField(this, "customEvaluators", /* @__PURE__ */ new Map());
  }
  // ─────────────────────────────────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Registers a custom evaluator function.
   */
  registerCustomEvaluator(name, evaluator) {
    this.customEvaluators.set(name, evaluator);
  }
  /**
   * Evaluates input against all applicable policies.
   */
  evaluate(policySet, input) {
    const applicablePolicies = policySet.applicableTo(input.context);
    const evaluatedAt = /* @__PURE__ */ new Date();
    const results = [];
    for (const policy of applicablePolicies) {
      const result = this.evaluatePolicy(policy, input);
      results.push({ policy, result });
    }
    return this.aggregateResults(results, evaluatedAt);
  }
  /**
   * Evaluates a single policy.
   */
  evaluatePolicy(policy, input) {
    const violations = [];
    const warnings = [];
    for (const rule of policy.rules) {
      const ruleResult = this.evaluateRule(policy, rule, input);
      if (!ruleResult.passed) {
        const violation = {
          policyId: policy.id,
          policyName: policy.name,
          severity: policy.severity,
          message: ruleResult.message || rule.message,
          context: input.context,
          suggestion: rule.suggestion,
          autoFixable: rule.autoFixable
        };
        if (policy.isAdvisory()) {
          warnings.push(violation);
        } else {
          violations.push(violation);
        }
      }
    }
    const totalRules = policy.rules.length;
    const passedRules = totalRules - violations.length - warnings.length;
    const score = totalRules > 0 ? passedRules / totalRules * 100 : 100;
    return Object.freeze({
      passed: violations.length === 0,
      violations: Object.freeze(violations),
      warnings: Object.freeze(warnings),
      score,
      evaluatedAt: /* @__PURE__ */ new Date()
    });
  }
  /**
   * Quickly checks if all blocking policies pass.
   */
  passesBlockingPolicies(policySet, input) {
    const blockingPolicies = policySet.blocking();
    for (const policy of blockingPolicies) {
      if (!policy.appliesTo(input.context)) continue;
      const result = this.evaluatePolicy(policy, input);
      if (!result.passed) return false;
    }
    return true;
  }
  /**
   * Gets all auto-fixable violations.
   */
  getAutoFixableViolations(result) {
    return result.allViolations.filter((v) => v.autoFixable);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // RULE EVALUATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Evaluates a single rule.
   */
  evaluateRule(_policy, rule, input) {
    const condition = rule.condition;
    switch (condition.type) {
      case "accessibility":
        return this.evaluateAccessibilityCondition(condition, input);
      case "color":
        return this.evaluateColorCondition(condition, input);
      case "token":
        return this.evaluateTokenCondition(condition, input);
      case "theme":
        return this.evaluateThemeCondition(condition, input);
      case "custom":
        return this.evaluateCustomCondition(condition.evaluator, condition.params, input);
      default:
        return { passed: true };
    }
  }
  /**
   * Evaluates accessibility conditions.
   */
  evaluateAccessibilityCondition(condition, input) {
    const { contrastRatio, apcaValue } = input;
    switch (condition.standard) {
      case "wcag-aa":
        if (contrastRatio === void 0) return { passed: true };
        const aaThreshold = condition.minContrast ?? 4.5;
        if (contrastRatio < aaThreshold) {
          return {
            passed: false,
            message: `WCAG AA requires contrast ratio >= ${aaThreshold}:1, got ${contrastRatio.toFixed(2)}:1`
          };
        }
        return { passed: true };
      case "wcag-aaa":
        if (contrastRatio === void 0) return { passed: true };
        const aaaThreshold = condition.minContrast ?? 7;
        if (contrastRatio < aaaThreshold) {
          return {
            passed: false,
            message: `WCAG AAA requires contrast ratio >= ${aaaThreshold}:1, got ${contrastRatio.toFixed(2)}:1`
          };
        }
        return { passed: true };
      case "apca-body":
        if (apcaValue === void 0) return { passed: true };
        const bodyThreshold = condition.minContrast ?? 60;
        if (Math.abs(apcaValue) < bodyThreshold) {
          return {
            passed: false,
            message: `APCA body text requires Lc >= ${bodyThreshold}, got Lc ${Math.abs(apcaValue).toFixed(1)}`
          };
        }
        return { passed: true };
      case "apca-ui":
        if (apcaValue === void 0) return { passed: true };
        const uiThreshold = condition.minContrast ?? 30;
        if (Math.abs(apcaValue) < uiThreshold) {
          return {
            passed: false,
            message: `APCA UI elements require Lc >= ${uiThreshold}, got Lc ${Math.abs(apcaValue).toFixed(1)}`
          };
        }
        return { passed: true };
      default:
        return { passed: true };
    }
  }
  /**
   * Evaluates color conditions.
   */
  evaluateColorCondition(condition, input) {
    const { color } = input;
    if (!color) return { passed: true };
    switch (condition.check) {
      case "saturation": {
        const threshold = condition.threshold ?? 20;
        const chroma = color.oklch.c * 100;
        if (chroma < threshold) {
          return {
            passed: false,
            message: `Color saturation (${chroma.toFixed(1)}) is below minimum (${threshold})`
          };
        }
        return { passed: true };
      }
      case "lightness": {
        const threshold = condition.threshold ?? 50;
        const tolerance = condition.tolerance ?? 30;
        const lightness = color.oklch.l * 100;
        if (Math.abs(lightness - threshold) > tolerance) {
          return {
            passed: false,
            message: `Color lightness (${lightness.toFixed(1)}) is outside acceptable range (${threshold} \xB1 ${tolerance})`
          };
        }
        return { passed: true };
      }
      case "brand-alignment":
      case "harmony":
        return { passed: true };
      default:
        return { passed: true };
    }
  }
  /**
   * Evaluates token conditions.
   */
  evaluateTokenCondition(condition, input) {
    const { tokens: _tokens, tokenNames } = input;
    switch (condition.check) {
      case "naming-convention": {
        if (!condition.pattern || !tokenNames) return { passed: true };
        const regex = new RegExp(condition.pattern);
        const invalidNames = tokenNames.filter((name) => !regex.test(name));
        if (invalidNames.length > 0) {
          return {
            passed: false,
            message: `Invalid token names: ${invalidNames.slice(0, 3).join(", ")}${invalidNames.length > 3 ? "..." : ""}`
          };
        }
        return { passed: true };
      }
      case "completeness": {
        if (!condition.requiredTokens || !tokenNames) return { passed: true };
        const missing = condition.requiredTokens.filter((t) => !tokenNames.includes(t));
        if (missing.length > 0) {
          return {
            passed: false,
            message: `Missing required tokens: ${missing.join(", ")}`
          };
        }
        return { passed: true };
      }
      case "hierarchy":
      case "consistency":
        return { passed: true };
      default:
        return { passed: true };
    }
  }
  /**
   * Evaluates theme conditions.
   */
  evaluateThemeCondition(condition, input) {
    const { themeHasLightMode, themeHasDarkMode } = input;
    switch (condition.check) {
      case "mode-coverage": {
        const modes = condition.modes ?? ["light", "dark"];
        const missingModes = [];
        if (modes.includes("light") && !themeHasLightMode) {
          missingModes.push("light");
        }
        if (modes.includes("dark") && !themeHasDarkMode) {
          missingModes.push("dark");
        }
        if (missingModes.length > 0) {
          return {
            passed: false,
            message: `Theme is missing required modes: ${missingModes.join(", ")}`
          };
        }
        return { passed: true };
      }
      case "semantic-mapping":
      case "scale-consistency":
        return { passed: true };
      default:
        return { passed: true };
    }
  }
  /**
   * Evaluates custom conditions.
   */
  evaluateCustomCondition(evaluatorName, params, input) {
    const evaluator = this.customEvaluators.get(evaluatorName);
    if (!evaluator) {
      return { passed: true };
    }
    return evaluator(input, params);
  }
  // ─────────────────────────────────────────────────────────────────────────
  // AGGREGATION
  // ─────────────────────────────────────────────────────────────────────────
  /**
   * Aggregates individual policy results into overall result.
   */
  aggregateResults(results, evaluatedAt) {
    const allViolations = [];
    const allWarnings = [];
    const criticalViolations = [];
    const byCategory = /* @__PURE__ */ new Map();
    let totalWeight = 0;
    let weightedScore = 0;
    let passedCount = 0;
    let failedCount = 0;
    let hasBlockingViolation = false;
    for (const { policy, result } of results) {
      allViolations.push(...result.violations);
      allWarnings.push(...result.warnings);
      if (result.passed) {
        passedCount++;
      } else {
        failedCount++;
        if (policy.isBlocking()) {
          hasBlockingViolation = true;
          criticalViolations.push(...result.violations);
        }
      }
      const weight = policy.getWeight();
      totalWeight += weight;
      weightedScore += result.score * weight;
      const existing = byCategory.get(policy.category);
      if (!existing || result.score < existing.score) {
        byCategory.set(policy.category, result);
      }
    }
    const overallScore = totalWeight > 0 ? weightedScore / totalWeight : 100;
    return Object.freeze({
      overallPassed: !hasBlockingViolation && allViolations.length === 0,
      overallScore,
      totalPolicies: results.length,
      passedPolicies: passedCount,
      failedPolicies: failedCount,
      criticalViolations: Object.freeze(criticalViolations),
      allViolations: Object.freeze(allViolations),
      allWarnings: Object.freeze(allWarnings),
      byCategory,
      evaluatedAt,
      blockingViolations: hasBlockingViolation
    });
  }
};
var governanceEvaluator = new GovernanceEvaluator();

// domain/governance/index.ts
var ENTERPRISE_POLICIES = {
  /**
   * WCAG AA Accessibility Policy
   */
  "accessibility-wcag-aa": {
    id: "accessibility-wcag-aa",
    name: "WCAG AA Compliance",
    description: "Ensures all text meets WCAG 2.1 AA contrast requirements (4.5:1 for normal text)",
    category: "accessibility",
    scope: "accessibility",
    enforcement: "required",
    severity: "critical",
    version: "1.0.0",
    rules: [
      {
        id: "wcag-aa-contrast",
        name: "WCAG AA Contrast Ratio",
        condition: { type: "accessibility", standard: "wcag-aa", minContrast: 4.5 },
        message: "Text contrast ratio must be at least 4.5:1 for WCAG AA compliance",
        suggestion: "Increase the lightness difference between text and background colors",
        autoFixable: true
      }
    ]
  },
  /**
   * APCA Body Text Policy
   */
  "accessibility-apca-body": {
    id: "accessibility-apca-body",
    name: "APCA Body Text Compliance",
    description: "Ensures body text meets APCA perceptual contrast standards (Lc 60+)",
    category: "accessibility",
    scope: "accessibility",
    enforcement: "recommended",
    severity: "high",
    version: "1.0.0",
    rules: [
      {
        id: "apca-body-contrast",
        name: "APCA Body Text Contrast",
        condition: { type: "accessibility", standard: "apca-body", minContrast: 60 },
        message: "Body text should have APCA contrast of at least Lc 60",
        suggestion: "Adjust text or background color for better perceptual contrast",
        autoFixable: true
      }
    ]
  },
  /**
   * Theme Coverage Policy
   */
  "theme-mode-coverage": {
    id: "theme-mode-coverage",
    name: "Light/Dark Mode Coverage",
    description: "Ensures themes support both light and dark modes",
    category: "custom",
    scope: "theme",
    enforcement: "required",
    severity: "high",
    version: "1.0.0",
    rules: [
      {
        id: "dual-mode",
        name: "Dual Mode Support",
        condition: { type: "theme", check: "mode-coverage", modes: ["light", "dark"] },
        message: "Theme must support both light and dark modes",
        suggestion: "Generate theme tokens for both light and dark modes",
        autoFixable: false
      }
    ]
  },
  /**
   * Token Naming Convention Policy
   */
  "token-naming-convention": {
    id: "token-naming-convention",
    name: "Token Naming Convention",
    description: "Enforces consistent token naming patterns (kebab-case)",
    category: "custom",
    scope: "token",
    enforcement: "required",
    severity: "medium",
    version: "1.0.0",
    rules: [
      {
        id: "kebab-case",
        name: "Kebab Case Naming",
        condition: {
          type: "token",
          check: "naming-convention",
          pattern: "^[a-z][a-z0-9]*(-[a-z0-9]+)*$"
        },
        message: "Token names must use kebab-case format",
        suggestion: 'Rename tokens to use lowercase with hyphens (e.g., "primary-color")',
        autoFixable: true
      }
    ]
  },
  /**
   * Brand Color Saturation Policy
   */
  "color-minimum-saturation": {
    id: "color-minimum-saturation",
    name: "Minimum Color Saturation",
    description: "Ensures brand colors have sufficient saturation for visual impact",
    category: "brand-consistency",
    scope: "component",
    enforcement: "recommended",
    severity: "low",
    version: "1.0.0",
    rules: [
      {
        id: "min-saturation",
        name: "Minimum Saturation Check",
        condition: { type: "color", check: "saturation", threshold: 15 },
        message: "Brand colors should have at least 15% saturation",
        suggestion: "Increase the chroma/saturation of the color",
        autoFixable: true
      }
    ]
  }
};
function createDefaultPolicySet() {
  const policies = [];
  for (const config of Object.values(ENTERPRISE_POLICIES)) {
    const result = EnterprisePolicy.create(config);
    if (result.success) {
      policies.push(result.value);
    }
  }
  return new PolicySet(policies);
}
function createStrictPolicySet() {
  const policies = [];
  for (const config of Object.values(ENTERPRISE_POLICIES)) {
    const strictConfig = {
      ...config,
      enforcement: "required",
      severity: config.severity === "info" ? "low" : config.severity
    };
    const result = EnterprisePolicy.create(strictConfig);
    if (result.success) {
      policies.push(result.value);
    }
  }
  return new PolicySet(policies);
}
function createLenientPolicySet() {
  const policies = [];
  for (const config of Object.values(ENTERPRISE_POLICIES)) {
    const lenientConfig = {
      ...config,
      enforcement: "optional"
    };
    const result = EnterprisePolicy.create(lenientConfig);
    if (result.success) {
      policies.push(result.value);
    }
  }
  return new PolicySet(policies);
}

exports.APCA_THRESHOLDS = APCA_THRESHOLDS;
exports.AccessibilityService = AccessibilityService;
exports.ENTERPRISE_POLICIES = ENTERPRISE_POLICIES;
exports.EnterprisePolicy = EnterprisePolicy;
exports.GovernanceEvaluator = GovernanceEvaluator;
exports.PerceptualColor = PerceptualColor;
exports.PolicySet = PolicySet;
exports.WCAG_THRESHOLDS = WCAG_THRESHOLDS;
exports.accessibilityService = accessibilityService;
exports.createDefaultPolicySet = createDefaultPolicySet;
exports.createLenientPolicySet = createLenientPolicySet;
exports.createStrictPolicySet = createStrictPolicySet;
exports.governanceEvaluator = governanceEvaluator;
//# sourceMappingURL=chunk-X3KESCNX.js.map
//# sourceMappingURL=chunk-X3KESCNX.js.map