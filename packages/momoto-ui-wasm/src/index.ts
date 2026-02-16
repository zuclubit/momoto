/**
 * @fileoverview Momoto UI WASM - TypeScript Bindings
 *
 * This package provides TypeScript bindings for the Momoto UI Rust/WASM core.
 *
 * Features:
 * - 10x faster state determination
 * - Deterministic behavior
 * - Graceful fallback to TypeScript if WASM unavailable
 * - Feature flags for gradual rollout
 * - Glass physics engine with physical material rendering
 *
 * @module @momoto-ui/wasm
 * @version 1.0.0
 */

// ============================================================================
// GLASS PHYSICS EXPORTS
// ============================================================================

export * from './glass-physics';
export * from './glass-physics-hooks';

import type {
  StateMetadata as WasmStateMetadata,
  UIState as WasmUIState,
} from '../pkg/momoto_ui_core';

// ============================================================================
// WASM LOADING (WITH FALLBACK)
// ============================================================================

let wasmModule: typeof import('../pkg/momoto_ui_core') | null = null;
let wasmLoadError: Error | null = null;

/**
 * Try to load WASM module
 *
 * Respects ENABLE_WASM environment variable and gracefully falls back to
 * TypeScript if WASM is unavailable.
 */
function tryLoadWasm() {
  try {
    // Check feature flag
    const enableWasm = process.env.ENABLE_WASM !== 'false';
    if (!enableWasm) {
      console.info('[Momoto WASM] Disabled via ENABLE_WASM=false');
      return;
    }

    // Check WebAssembly support
    if (typeof WebAssembly === 'undefined') {
      console.warn('[Momoto WASM] WebAssembly not supported in this environment');
      return;
    }

    // Load WASM module
    wasmModule = require('../pkg/momoto_ui_core');
    console.info('[Momoto WASM] ✅ Loaded successfully');
  } catch (error) {
    wasmLoadError = error as Error;
    console.warn('[Momoto WASM] ⚠️  Not available, using TypeScript fallback:', error);
  }
}

// Try to load WASM on module initialization
tryLoadWasm();

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * UI interaction states
 */
export enum UIStateValue {
  Idle = 0,
  Hover = 1,
  Active = 2,
  Focus = 3,
  Disabled = 4,
  Loading = 5,
  Error = 6,
  Success = 7,
}

/**
 * Animation levels
 */
export enum AnimationLevel {
  None = 0,
  Subtle = 1,
  Medium = 2,
  Prominent = 3,
}

/**
 * State metadata interface (TypeScript-friendly)
 */
export interface StateMetadata {
  /** Lightness shift to apply [-1.0, 1.0] */
  lightnessShift: number;

  /** Chroma shift to apply [-1.0, 1.0] */
  chromaShift: number;

  /** Opacity multiplier [0.0, 1.0] */
  opacity: number;

  /** Animation level */
  animation: AnimationLevel;

  /** Whether focus indicator is required */
  focusIndicator: boolean;
}

// ============================================================================
// FALLBACK IMPLEMENTATIONS (TYPESCRIPT)
// ============================================================================

/**
 * Fallback state metadata (matches Rust implementation exactly)
 */
const STATE_METADATA_FALLBACK: Record<UIStateValue, StateMetadata> = {
  [UIStateValue.Idle]: {
    lightnessShift: 0.0,
    chromaShift: 0.0,
    opacity: 1.0,
    animation: AnimationLevel.None,
    focusIndicator: false,
  },
  [UIStateValue.Hover]: {
    lightnessShift: 0.05,
    chromaShift: 0.02,
    opacity: 1.0,
    animation: AnimationLevel.Subtle,
    focusIndicator: false,
  },
  [UIStateValue.Active]: {
    lightnessShift: -0.08,
    chromaShift: 0.03,
    opacity: 1.0,
    animation: AnimationLevel.Medium,
    focusIndicator: false,
  },
  [UIStateValue.Focus]: {
    lightnessShift: 0.0,
    chromaShift: 0.0,
    opacity: 1.0,
    animation: AnimationLevel.Subtle,
    focusIndicator: true,
  },
  [UIStateValue.Disabled]: {
    lightnessShift: 0.2,
    chromaShift: -0.1,
    opacity: 0.5,
    animation: AnimationLevel.None,
    focusIndicator: false,
  },
  [UIStateValue.Loading]: {
    lightnessShift: 0.0,
    chromaShift: -0.05,
    opacity: 0.7,
    animation: AnimationLevel.Prominent,
    focusIndicator: false,
  },
  [UIStateValue.Error]: {
    lightnessShift: 0.0,
    chromaShift: 0.1,
    opacity: 1.0,
    animation: AnimationLevel.Medium,
    focusIndicator: false,
  },
  [UIStateValue.Success]: {
    lightnessShift: 0.0,
    chromaShift: 0.05,
    opacity: 1.0,
    animation: AnimationLevel.Subtle,
    focusIndicator: false,
  },
};

/**
 * State priority lookup (TypeScript fallback)
 */
const STATE_PRIORITY: Record<UIStateValue, number> = {
  [UIStateValue.Idle]: 0,
  [UIStateValue.Hover]: 40,
  [UIStateValue.Active]: 60,
  [UIStateValue.Focus]: 50,
  [UIStateValue.Disabled]: 100,
  [UIStateValue.Loading]: 90,
  [UIStateValue.Error]: 80,
  [UIStateValue.Success]: 75,
};

/**
 * Determine state (TypeScript fallback)
 */
function determineUIStateFallback(
  disabled: boolean,
  loading: boolean,
  active: boolean,
  focused: boolean,
  hovered: boolean
): UIStateValue {
  if (disabled) return UIStateValue.Disabled;
  if (loading) return UIStateValue.Loading;
  if (active) return UIStateValue.Active;
  if (focused) return UIStateValue.Focus;
  if (hovered) return UIStateValue.Hover;
  return UIStateValue.Idle;
}

// ============================================================================
// PUBLIC API (WITH WASM/FALLBACK)
// ============================================================================

/**
 * Determine UI state from interaction flags
 *
 * Uses WASM if available (10x faster), falls back to TypeScript
 *
 * @param disabled - Component is disabled
 * @param loading - Component is in loading state
 * @param active - Component is being pressed/clicked
 * @param focused - Component has keyboard focus
 * @param hovered - Component is being hovered
 * @returns State value (0-7)
 *
 * @example
 * ```typescript
 * import { determineUIState, UIStateValue } from '@momoto-ui/wasm';
 *
 * const state = determineUIState(false, false, true, false, false);
 * // state === UIStateValue.Active (2)
 * ```
 */
export function determineUIState(
  disabled: boolean,
  loading: boolean,
  active: boolean,
  focused: boolean,
  hovered: boolean
): UIStateValue {
  if (wasmModule) {
    return wasmModule.determine_ui_state(disabled, loading, active, focused, hovered);
  }

  return determineUIStateFallback(disabled, loading, active, focused, hovered);
}

/**
 * Get state metadata
 *
 * Uses WASM if available, falls back to TypeScript
 *
 * @param state - State value (0-7)
 * @returns State metadata with perceptual shifts and animation info
 *
 * @example
 * ```typescript
 * import { getStateMetadata, UIStateValue } from '@momoto-ui/wasm';
 *
 * const metadata = getStateMetadata(UIStateValue.Hover);
 * console.log(metadata.lightnessShift); // 0.05
 * console.log(metadata.animation); // AnimationLevel.Subtle (1)
 * ```
 */
export function getStateMetadata(state: UIStateValue): StateMetadata {
  if (wasmModule) {
    const wasm = wasmModule.get_state_metadata(state);
    return {
      lightnessShift: wasm.lightness_shift,
      chromaShift: wasm.chroma_shift,
      opacity: wasm.opacity,
      animation: wasm.animation as AnimationLevel,
      focusIndicator: wasm.focus_indicator,
    };
  }

  return STATE_METADATA_FALLBACK[state];
}

/**
 * Get state priority
 *
 * @param state - State value (0-7)
 * @returns Priority (higher = takes precedence)
 */
export function getStatePriority(state: UIStateValue): number {
  if (wasmModule) {
    return wasmModule.get_state_priority(state);
  }

  return STATE_PRIORITY[state];
}

/**
 * Combine multiple states, returning highest priority
 *
 * @param states - Array of state values
 * @returns Highest priority state
 *
 * @example
 * ```typescript
 * import { combineStates, UIStateValue } from '@momoto-ui/wasm';
 *
 * const result = combineStates([
 *   UIStateValue.Hover,
 *   UIStateValue.Focus,
 *   UIStateValue.Idle,
 * ]);
 * // result === UIStateValue.Focus (higher priority than Hover)
 * ```
 */
export function combineStates(states: UIStateValue[]): UIStateValue {
  if (wasmModule) {
    return wasmModule.combine_states(new Uint8Array(states));
  }

  // TypeScript fallback
  if (states.length === 0) {
    return UIStateValue.Idle;
  }

  return states.reduce((highest, current) =>
    STATE_PRIORITY[current] > STATE_PRIORITY[highest] ? current : highest
  );
}

// ============================================================================
// TOKEN DERIVATION
// ============================================================================

/**
 * Derived token result
 */
export interface DerivedToken {
  /** Lightness [0.0, 1.0] */
  l: number;
  /** Chroma [0.0, 0.4] */
  c: number;
  /** Hue [0.0, 360.0] */
  h: number;
  /** State value */
  state: UIStateValue;
}

/**
 * Token derivation engine with memoization
 *
 * Uses WASM if available (15x faster), falls back to TypeScript
 *
 * @example
 * ```typescript
 * import { TokenDerivationEngine } from '@momoto-ui/wasm';
 *
 * const engine = new TokenDerivationEngine();
 * const tokens = engine.deriveStates(0.5, 0.1, 180.0);
 * console.log(tokens); // Array of 6 tokens (Idle, Hover, Active, Focus, Disabled, Loading)
 * ```
 */
export class TokenDerivationEngine {
  private wasmEngine?: any;
  private cache: Map<string, DerivedToken> = new Map();

  constructor() {
    if (wasmModule) {
      this.wasmEngine = new wasmModule.TokenDerivationEngine();
    }
  }

  /**
   * Derive state tokens from base color
   *
   * @param baseL - Base lightness [0.0, 1.0]
   * @param baseC - Base chroma [0.0, 0.4]
   * @param baseH - Base hue [0.0, 360.0]
   * @returns Array of derived tokens for all states
   */
  deriveStates(baseL: number, baseC: number, baseH: number): DerivedToken[] {
    if (this.wasmEngine) {
      // Use WASM implementation
      const packed = this.wasmEngine.derive_states(baseL, baseC, baseH);
      const tokens: DerivedToken[] = [];

      // Unpack Float64Array: [l, c, h, state, l, c, h, state, ...]
      for (let i = 0; i < packed.length; i += 4) {
        tokens.push({
          l: packed[i],
          c: packed[i + 1],
          h: packed[i + 2],
          state: packed[i + 3] as UIStateValue,
        });
      }

      return tokens;
    }

    // TypeScript fallback
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
   * Derive single state token
   *
   * @param baseL - Base lightness
   * @param baseC - Base chroma
   * @param baseH - Base hue
   * @param state - State to derive
   * @returns Derived token
   */
  deriveState(
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

    // Get metadata
    const metadata = getStateMetadata(state);

    // Apply shifts
    const derivedL = Math.max(0, Math.min(1, baseL + metadata.lightnessShift));
    const derivedC = Math.max(0, Math.min(0.4, baseC + metadata.chromaShift));

    const token: DerivedToken = {
      l: derivedL,
      c: derivedC,
      h: baseH,
      state,
    };

    // Cache result
    this.cache.set(key, token);

    return token;
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    if (this.wasmEngine) {
      return this.wasmEngine.cache_size();
    }
    return this.cache.size;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    if (this.wasmEngine) {
      this.wasmEngine.clear_cache();
    }
    this.cache.clear();
  }
}

/**
 * Derive tokens for a specific state (one-shot, no caching)
 *
 * @param baseL - Base lightness [0.0, 1.0]
 * @param baseC - Base chroma [0.0, 0.4]
 * @param baseH - Base hue [0.0, 360.0]
 * @param state - State to derive (0-7)
 * @returns Derived token
 *
 * @example
 * ```typescript
 * import { deriveTokenForState, UIStateValue } from '@momoto-ui/wasm';
 *
 * const hoverToken = deriveTokenForState(0.5, 0.1, 180.0, UIStateValue.Hover);
 * console.log(hoverToken); // { l: 0.55, c: 0.1, h: 180.0, state: 1 }
 * ```
 */
export function deriveTokenForState(
  baseL: number,
  baseC: number,
  baseH: number,
  state: UIStateValue
): DerivedToken {
  if (wasmModule) {
    const packed = wasmModule.derive_token_for_state(baseL, baseC, baseH, state);
    return {
      l: packed[0],
      c: packed[1],
      h: packed[2],
      state: packed[3] as UIStateValue,
    };
  }

  // TypeScript fallback
  const metadata = getStateMetadata(state);
  const derivedL = Math.max(0, Math.min(1, baseL + metadata.lightnessShift));
  const derivedC = Math.max(0, Math.min(0.4, baseC + metadata.chromaShift));

  return {
    l: derivedL,
    c: derivedC,
    h: baseH,
    state,
  };
}

// ============================================================================
// ACCESSIBILITY VALIDATION
// ============================================================================

/**
 * WCAG conformance levels
 */
export enum WCAGLevel {
  /** Does not meet minimum standards */
  Fail = 0,
  /** WCAG AA (4.5:1 normal, 3:1 large) */
  AA = 1,
  /** WCAG AAA (7:1 normal, 4.5:1 large) */
  AAA = 2,
}

/**
 * Contrast validation result
 */
export interface ContrastValidation {
  /** WCAG 2.1 contrast ratio [1.0, 21.0] */
  wcagRatio: number;
  /** APCA contrast value [-108, 106] */
  apcaContrast: number;
  /** WCAG level for normal text */
  wcagNormalLevel: WCAGLevel;
  /** WCAG level for large text */
  wcagLargeLevel: WCAGLevel;
  /** Passes APCA for body text (>= 60) */
  apcaBodyPass: boolean;
  /** Passes APCA for large text (>= 45) */
  apcaLargePass: boolean;
}

/**
 * WCAG minimum contrast ratios
 */
export const WCAG_RATIOS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3.0,
  AAA_NORMAL: 7.0,
  AAA_LARGE: 4.5,
} as const;

/**
 * APCA minimum contrast values
 */
export const APCA_MIN = {
  BODY: 60.0,
  LARGE: 45.0,
} as const;

/**
 * Calculate relative luminance (TypeScript fallback)
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
 * Calculate WCAG 2.1 contrast ratio (TypeScript fallback)
 */
function calculateWCAGContrast(
  fgL: number,
  fgC: number,
  fgH: number,
  bgL: number,
  bgC: number,
  bgH: number
): number {
  const lumFg = calculateRelativeLuminance(fgL, fgC, fgH);
  const lumBg = calculateRelativeLuminance(bgL, bgC, bgH);

  const lighter = Math.max(lumFg, lumBg);
  const darker = Math.min(lumFg, lumBg);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate APCA contrast (TypeScript fallback)
 */
function calculateAPCAContrast(
  fgL: number,
  fgC: number,
  fgH: number,
  bgL: number,
  bgC: number,
  bgH: number
): number {
  const yText = calculateRelativeLuminance(fgL, fgC, fgH);
  const yBg = calculateRelativeLuminance(bgL, bgC, bgH);

  // APCA constants
  const NORM_BG = 0.56;
  const NORM_TXT = 0.57;
  const REV_TXT = 0.62;
  const REV_BG = 0.65;
  const BLK_THRS = 0.022;
  const BLK_CLMP = 1.414;

  // Soft clamp
  const yTxt =
    yText < BLK_THRS ? yText + Math.pow(BLK_THRS - yText, BLK_CLMP) : yText;
  const yBgVal = yBg < BLK_THRS ? yBg + Math.pow(BLK_THRS - yBg, BLK_CLMP) : yBg;

  // Calculate SAPC
  const sapc =
    yBgVal > yTxt
      ? (Math.pow(yBgVal, NORM_BG) - Math.pow(yTxt, NORM_TXT)) * 1.14
      : (Math.pow(yBgVal, REV_BG) - Math.pow(yTxt, REV_TXT)) * 1.14;

  // Scale and clamp
  if (Math.abs(sapc) < 0.1) return 0.0;
  return sapc > 0.0 ? (sapc - 0.027) * 100.0 : (sapc + 0.027) * 100.0;
}

/**
 * Determine WCAG level from ratio
 */
function determineWCAGLevel(ratio: number, isLarge: boolean): WCAGLevel {
  if (isLarge) {
    if (ratio >= WCAG_RATIOS.AAA_LARGE) return WCAGLevel.AAA;
    if (ratio >= WCAG_RATIOS.AA_LARGE) return WCAGLevel.AA;
    return WCAGLevel.Fail;
  } else {
    if (ratio >= WCAG_RATIOS.AAA_NORMAL) return WCAGLevel.AAA;
    if (ratio >= WCAG_RATIOS.AA_NORMAL) return WCAGLevel.AA;
    return WCAGLevel.Fail;
  }
}

/**
 * Validate contrast between foreground and background colors
 *
 * Calculates both WCAG 2.1 and APCA contrast metrics.
 * Uses WASM if available (10-15x faster), falls back to TypeScript.
 *
 * @param foregroundL - Foreground lightness [0.0, 1.0]
 * @param foregroundC - Foreground chroma [0.0, 0.4]
 * @param foregroundH - Foreground hue [0.0, 360.0]
 * @param backgroundL - Background lightness [0.0, 1.0]
 * @param backgroundC - Background chroma [0.0, 0.4]
 * @param backgroundH - Background hue [0.0, 360.0]
 * @returns Contrast validation result with WCAG and APCA metrics
 *
 * @example
 * ```typescript
 * import { validateContrast, WCAGLevel } from '@momoto-ui/wasm';
 *
 * const result = validateContrast(
 *   0.2, 0.05, 240.0,  // Dark blue text
 *   0.95, 0.02, 60.0   // Light yellow background
 * );
 *
 * console.log(result.wcagRatio);        // e.g., 12.5
 * console.log(result.wcagNormalLevel);  // WCAGLevel.AAA
 * console.log(result.apcaContrast);     // e.g., 85.0
 * console.log(result.apcaBodyPass);     // true
 * ```
 */
export function validateContrast(
  foregroundL: number,
  foregroundC: number,
  foregroundH: number,
  backgroundL: number,
  backgroundC: number,
  backgroundH: number
): ContrastValidation {
  if (wasmModule) {
    // Use WASM implementation
    const result = wasmModule.validate_contrast(
      foregroundL,
      foregroundC,
      foregroundH,
      backgroundL,
      backgroundC,
      backgroundH
    );

    return {
      wcagRatio: result.wcag_ratio(),
      apcaContrast: result.apca_contrast(),
      wcagNormalLevel: result.wcag_normal_level() as WCAGLevel,
      wcagLargeLevel: result.wcag_large_level() as WCAGLevel,
      apcaBodyPass: result.apca_body_pass(),
      apcaLargePass: result.apca_large_pass(),
    };
  }

  // TypeScript fallback
  const wcagRatio = calculateWCAGContrast(
    foregroundL,
    foregroundC,
    foregroundH,
    backgroundL,
    backgroundC,
    backgroundH
  );

  const apcaContrast = calculateAPCAContrast(
    foregroundL,
    foregroundC,
    foregroundH,
    backgroundL,
    backgroundC,
    backgroundH
  );

  return {
    wcagRatio,
    apcaContrast,
    wcagNormalLevel: determineWCAGLevel(wcagRatio, false),
    wcagLargeLevel: determineWCAGLevel(wcagRatio, true),
    apcaBodyPass: Math.abs(apcaContrast) >= APCA_MIN.BODY,
    apcaLargePass: Math.abs(apcaContrast) >= APCA_MIN.LARGE,
  };
}

/**
 * Quick check if contrast meets WCAG AA for normal text
 *
 * @param foregroundL - Foreground lightness [0.0, 1.0]
 * @param foregroundC - Foreground chroma [0.0, 0.4]
 * @param foregroundH - Foreground hue [0.0, 360.0]
 * @param backgroundL - Background lightness [0.0, 1.0]
 * @param backgroundC - Background chroma [0.0, 0.4]
 * @param backgroundH - Background hue [0.0, 360.0]
 * @returns true if contrast >= 4.5:1
 *
 * @example
 * ```typescript
 * import { passesWCAG_AA } from '@momoto-ui/wasm';
 *
 * const passes = passesWCAG_AA(
 *   0.2, 0.0, 0.0,   // Dark text
 *   0.9, 0.0, 0.0    // Light background
 * );
 * // passes === true
 * ```
 */
export function passesWCAG_AA(
  foregroundL: number,
  foregroundC: number,
  foregroundH: number,
  backgroundL: number,
  backgroundC: number,
  backgroundH: number
): boolean {
  if (wasmModule) {
    return wasmModule.passes_wcag_aa(
      foregroundL,
      foregroundC,
      foregroundH,
      backgroundL,
      backgroundC,
      backgroundH
    );
  }

  // TypeScript fallback
  const ratio = calculateWCAGContrast(
    foregroundL,
    foregroundC,
    foregroundH,
    backgroundL,
    backgroundC,
    backgroundH
  );

  return ratio >= WCAG_RATIOS.AA_NORMAL;
}

// ============================================================================
// DIAGNOSTICS
// ============================================================================

/**
 * Check if WASM is loaded and enabled
 */
export function isWasmEnabled(): boolean {
  return wasmModule !== null;
}

/**
 * Get WASM load status
 */
export function getWasmStatus(): {
  enabled: boolean;
  error: Error | null;
  backend: 'wasm' | 'typescript';
} {
  return {
    enabled: wasmModule !== null,
    error: wasmLoadError,
    backend: wasmModule !== null ? 'wasm' : 'typescript',
  };
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

// Re-export WASM types and classes for advanced users
export type {
  StateMetadata as WasmStateMetadata,
  UIState as WasmUIState,
  ContrastResult as WasmContrastResult,
} from '../pkg/momoto_ui_core';

export {
  ColorOklch,
  TokenDerivationEngine as WasmTokenDerivationEngine,
  ContrastLevel as WasmContrastLevel,
} from '../pkg/momoto_ui_core';
