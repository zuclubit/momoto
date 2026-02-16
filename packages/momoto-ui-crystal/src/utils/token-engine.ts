/**
 * Token Derivation Engine - WASM-Powered
 *
 * Uses Momoto WASM for perceptual color derivation and contrast validation
 */

/**
 * OKLCH color representation
 */
export interface ColorOklch {
  /** Lightness [0.0, 1.0] */
  l: number;
  /** Chroma [0.0, 0.4] */
  c: number;
  /** Hue [0.0, 360.0] */
  h: number;
}

/**
 * UI State values
 */
export enum UIStateValue {
  Idle = 0,
  Hover = 1,
  Active = 2,
  Focus = 3,
  Disabled = 4,
  Loading = 5,
}

/**
 * Derived token with state
 */
export interface DerivedToken extends ColorOklch {
  state: UIStateValue;
}

/**
 * WCAG conformance levels
 */
export enum WCAGLevel {
  Fail = 0,
  AA = 1,
  AAA = 2,
}

/**
 * Contrast validation result
 */
export interface ContrastValidation {
  wcagRatio: number;
  apcaContrast: number;
  wcagNormalLevel: WCAGLevel;
  wcagLargeLevel: WCAGLevel;
  apcaBodyPass: boolean;
  apcaLargePass: boolean;
}

// ============================================================================
// WASM INITIALIZATION
// ============================================================================

let wasmModule: any = null;
let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

async function initWasm() {
  if (wasmInitialized) return;
  if (wasmInitPromise) return wasmInitPromise;

  wasmInitPromise = (async () => {
    try {
      // Import the module
      const module = await import('@momoto-ui/wasm');

      // Initialize WASM (call default export function)
      if (typeof module.default === 'function') {
        await module.default();
      }

      wasmModule = module;
      wasmInitialized = true;
      console.info('[TokenEngine] Momoto WASM initialized successfully');
    } catch (error) {
      console.warn('[TokenEngine] Failed to load Momoto WASM, using fallback:', error);
      wasmInitialized = false;
    }
  })();

  return wasmInitPromise;
}

// Start initialization immediately in browser
if (typeof window !== 'undefined') {
  initWasm();
}

// ============================================================================
// STATE METADATA
// ============================================================================

interface StateMetadata {
  lightnessShift: number;
  chromaShift: number;
}

const STATE_METADATA: Record<UIStateValue, StateMetadata> = {
  [UIStateValue.Idle]: {
    lightnessShift: 0.0,
    chromaShift: 0.0,
  },
  [UIStateValue.Hover]: {
    lightnessShift: 0.05,
    chromaShift: 0.02,
  },
  [UIStateValue.Active]: {
    lightnessShift: -0.08,
    chromaShift: 0.03,
  },
  [UIStateValue.Focus]: {
    lightnessShift: 0.0,
    chromaShift: 0.0,
  },
  [UIStateValue.Disabled]: {
    lightnessShift: 0.25,
    chromaShift: -0.1,
  },
  [UIStateValue.Loading]: {
    lightnessShift: 0.0,
    chromaShift: -0.05,
  },
};

// ============================================================================
// TOKEN DERIVATION ENGINE
// ============================================================================

/**
 * Token Derivation Engine
 *
 * Derives interactive state tokens from a base color using Momoto WASM
 */
export class TokenDerivationEngine {
  private cache: Map<string, DerivedToken> = new Map();
  private initialized = false;

  private ensureInitialized() {
    if (this.initialized) return;
    this.initialized = true;

    // WASM initialization happens asynchronously, but we can work with it
    // once it's ready or fall back to JS implementation
  }

  /**
   * Derive all state tokens from base color
   *
   * @param baseL - Base lightness [0.0, 1.0]
   * @param baseC - Base chroma [0.0, 0.4]
   * @param baseH - Base hue [0.0, 360.0]
   * @returns Array of derived tokens for all states
   */
  deriveStates(baseL: number, baseC: number, baseH: number): DerivedToken[] {
    this.ensureInitialized();

    const states = [
      UIStateValue.Idle,
      UIStateValue.Hover,
      UIStateValue.Active,
      UIStateValue.Focus,
      UIStateValue.Disabled,
      UIStateValue.Loading,
    ];

    return states.map((state) => this.deriveState(baseL, baseC, baseH, state));
  }

  /**
   * Derive single state token using WASM
   */
  private deriveState(
    baseL: number,
    baseC: number,
    baseH: number,
    state: UIStateValue
  ): DerivedToken {
    const key = `${baseL},${baseC},${baseH},${state}`;

    // Check cache
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    let token: DerivedToken;

    if (wasmInitialized && wasmModule) {
      // Use WASM for perceptual color derivation
      try {
        const baseColor = new wasmModule.OKLCH(baseL, baseC, baseH);
        const metadata = STATE_METADATA[state];

        // Use WASM's perceptual color operations
        let derivedColor = baseColor;

        // Apply lightness shift perceptually
        if (metadata.lightnessShift !== 0) {
          const targetL = Math.max(0, Math.min(1, baseL + metadata.lightnessShift));
          derivedColor = new wasmModule.OKLCH(targetL, derivedColor.c, derivedColor.h);
        }

        // Apply chroma shift perceptually
        if (metadata.chromaShift !== 0) {
          const targetC = Math.max(0, Math.min(0.4, derivedColor.c + metadata.chromaShift));
          derivedColor = new wasmModule.OKLCH(derivedColor.l, targetC, derivedColor.h);
        }

        token = {
          l: derivedColor.l,
          c: derivedColor.c,
          h: derivedColor.h,
          state,
        };
      } catch (error) {
        console.warn('[TokenEngine] WASM derivation failed, using fallback:', error);
        token = this.deriveStateFallback(baseL, baseC, baseH, state);
      }
    } else {
      // Fallback to JavaScript implementation
      token = this.deriveStateFallback(baseL, baseC, baseH, state);
    }

    // Cache result
    this.cache.set(key, token);

    return token;
  }

  /**
   * Fallback JavaScript implementation
   */
  private deriveStateFallback(
    baseL: number,
    baseC: number,
    baseH: number,
    state: UIStateValue
  ): DerivedToken {
    const metadata = STATE_METADATA[state];

    // Apply shifts with clamping
    const derivedL = Math.max(0, Math.min(1, baseL + metadata.lightnessShift));
    const derivedC = Math.max(0, Math.min(0.4, baseC + metadata.chromaShift));

    return {
      l: derivedL,
      c: derivedC,
      h: baseH,
      state,
    };
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Validate contrast between two colors using WASM
   *
   * @param foreground - Foreground color
   * @param background - Background color
   * @param level - Optional WCAG level to check ('AA' or 'AAA')
   * @returns Boolean indicating if contrast is sufficient
   */
  validateContrast(
    foreground: ColorOklch,
    background: ColorOklch,
    level?: 'AA' | 'AAA'
  ): boolean {
    const result = validateContrast(
      foreground.l,
      foreground.c,
      foreground.h,
      background.l,
      background.c,
      background.h
    );

    if (!level) {
      // Return true if passes AA for normal text
      return result.wcagNormalLevel >= WCAGLevel.AA;
    }

    if (level === 'AA') {
      return result.wcagNormalLevel >= WCAGLevel.AA;
    }

    if (level === 'AAA') {
      return result.wcagNormalLevel >= WCAGLevel.AAA;
    }

    return false;
  }

  /**
   * Get full contrast validation details using WASM
   */
  getContrastValidation(
    foreground: ColorOklch,
    background: ColorOklch
  ): ContrastValidation {
    return validateContrast(
      foreground.l,
      foreground.c,
      foreground.h,
      background.l,
      background.c,
      background.h
    );
  }
}

// ============================================================================
// CONTRAST VALIDATION (WASM-POWERED)
// ============================================================================

/**
 * Validate contrast between colors using Momoto WASM
 */
export function validateContrast(
  fgL: number,
  fgC: number,
  fgH: number,
  bgL: number,
  bgC: number,
  bgH: number
): ContrastValidation {
  if (wasmInitialized && wasmModule) {
    try {
      // Create OKLCH colors
      const fgOklch = new wasmModule.OKLCH(fgL, fgC, fgH);
      const bgOklch = new wasmModule.OKLCH(bgL, bgC, bgH);

      // Convert to Color (RGB)
      const fgColor = fgOklch.toColor();
      const bgColor = bgOklch.toColor();

      // Create metrics
      const wcagMetric = new wasmModule.WCAGMetric();
      const apcaMetric = new wasmModule.APCAMetric();

      // Evaluate contrast
      const wcagResult = wcagMetric.evaluate(fgColor, bgColor);
      const apcaResult = apcaMetric.evaluate(fgColor, bgColor);

      const wcagRatio = wcagResult.value;
      const apcaContrast = Math.abs(apcaResult.value);

      return {
        wcagRatio,
        apcaContrast,
        wcagNormalLevel: wcagRatio >= 7.0 ? WCAGLevel.AAA : wcagRatio >= 4.5 ? WCAGLevel.AA : WCAGLevel.Fail,
        wcagLargeLevel: wcagRatio >= 4.5 ? WCAGLevel.AAA : wcagRatio >= 3.0 ? WCAGLevel.AA : WCAGLevel.Fail,
        apcaBodyPass: apcaContrast >= 60,
        apcaLargePass: apcaContrast >= 45,
      };
    } catch (error) {
      console.warn('[TokenEngine] WASM contrast validation failed, using fallback:', error);
      return validateContrastFallback(fgL, fgC, fgH, bgL, bgC, bgH);
    }
  }

  // Fallback to JavaScript implementation
  return validateContrastFallback(fgL, fgC, fgH, bgL, bgC, bgH);
}

/**
 * Fallback contrast validation (simplified)
 */
function validateContrastFallback(
  fgL: number,
  fgC: number,
  fgH: number,
  bgL: number,
  bgC: number,
  bgH: number
): ContrastValidation {
  const lumFg = calculateRelativeLuminance(fgL, fgC, fgH);
  const lumBg = calculateRelativeLuminance(bgL, bgC, bgH);

  const lighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);

  const wcagRatio = (lighter + 0.05) / (darker + 0.05);

  // Simplified APCA calculation
  const apcaContrast = Math.abs(lumBg - lumFg) * 100;

  return {
    wcagRatio,
    apcaContrast,
    wcagNormalLevel: wcagRatio >= 7.0 ? WCAGLevel.AAA : wcagRatio >= 4.5 ? WCAGLevel.AA : WCAGLevel.Fail,
    wcagLargeLevel: wcagRatio >= 4.5 ? WCAGLevel.AAA : wcagRatio >= 3.0 ? WCAGLevel.AA : WCAGLevel.Fail,
    apcaBodyPass: apcaContrast >= 60,
    apcaLargePass: apcaContrast >= 45,
  };
}

/**
 * Calculate relative luminance (fallback)
 */
function calculateRelativeLuminance(l: number, c: number, h: number): number {
  // Simplified OKLCH → Linear RGB conversion
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const rLinear = Math.max(0, Math.min(1, l + a));
  const gLinear = Math.max(0, Math.min(1, l));
  const bLinear = Math.max(0, Math.min(1, l + b));

  // Linearize sRGB
  const linearize = (v: number) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);

  const rSrgb = linearize(rLinear);
  const gSrgb = linearize(gLinear);
  const bSrgb = linearize(bLinear);

  // Calculate relative luminance
  return 0.2126 * rSrgb + 0.7152 * gSrgb + 0.0722 * bSrgb;
}

/**
 * Check if contrast passes WCAG AA
 */
export function passesWCAG_AA(
  fgL: number,
  fgC: number,
  fgH: number,
  bgL: number,
  bgC: number,
  bgH: number
): boolean {
  const result = validateContrast(fgL, fgC, fgH, bgL, bgC, bgH);
  return result.wcagRatio >= 4.5;
}

/**
 * Get WASM status
 */
export function getWasmStatus() {
  return {
    enabled: wasmInitialized,
    backend: wasmInitialized ? ('wasm' as const) : ('typescript' as const),
  };
}
