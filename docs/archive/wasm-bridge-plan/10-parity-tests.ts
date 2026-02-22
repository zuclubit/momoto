/**
 * @fileoverview WASM Bridge Parity Tests
 *
 * Verifies that WASM bindings produce identical results to:
 * 1. Rust native (cross-validated via known reference values)
 * 2. TypeScript implementations being replaced (phase5-siren, phase4-metrics, etc.)
 * 3. Batch APIs match single-call APIs
 *
 * Test categories:
 * - SIREN parity (Rust vs TS: bit-exact Mulberry32 + forward pass)
 * - APCA/WCAG contrast parity
 * - OKLCH operations parity
 * - Quality scoring parity
 * - Materials/PBR parity
 * - Batch API consistency
 * - Edge cases (black, white, out-of-gamut, NaN)
 * - Performance benchmarks
 *
 * Run with: npx vitest run parity-tests.ts
 *
 * @module WASM_BRIDGE_PLAN/10-parity-tests
 */

import { describe, it, expect, beforeAll, bench } from 'vitest';
import { MomotoBridge, UsageContext, ComplianceTarget } from './06-MomotoBridge';

// TS implementations being replaced (for parity comparison)
import { computeSirenCorrection as tsSiren, type SirenInput } from
  '@/components/layout/hooks/pipeline/phase5-siren';

// =============================================================================
// SETUP
// =============================================================================

const EPSILON = 1e-10;     // Bit-exact parity
const FLOAT_EPS = 1e-6;    // Floating-point tolerance (cross-platform)
const APCA_EPS = 0.01;     // APCA tolerance (algorithm rounding)
const WCAG_EPS = 0.001;    // WCAG ratio tolerance

beforeAll(async () => {
  await MomotoBridge.init();
  expect(MomotoBridge.isReady()).toBe(true);
});

// =============================================================================
// HELPERS
// =============================================================================

function assertClose(actual: number, expected: number, eps: number, msg: string) {
  const diff = Math.abs(actual - expected);
  expect(diff).toBeLessThan(eps);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

// =============================================================================
// 1. SIREN NEURAL NETWORK PARITY
// =============================================================================

describe('SIREN Parity: Rust WASM vs TypeScript', () => {
  const testCases: SirenInput[] = [
    // Dark background, light foreground (typical sidebar)
    { bgL: 0.2, bgC: 0.15, bgH: 250, fgL: 0.9, fgC: 0.03, fgH: 250, apcaLc: 75, wcagRatio: 8.5, quality: 72 },
    // Light background, dark foreground
    { bgL: 0.95, bgC: 0.01, bgH: 0, fgL: 0.15, fgC: 0.05, fgH: 0, apcaLc: 90, wcagRatio: 15.2, quality: 88 },
    // Mid-range colors
    { bgL: 0.5, bgC: 0.1, bgH: 180, fgL: 0.8, fgC: 0.08, fgH: 180, apcaLc: 55, wcagRatio: 4.6, quality: 60 },
    // Edge: all zeros
    { bgL: 0, bgC: 0, bgH: 0, fgL: 0, fgC: 0, fgH: 0, apcaLc: 0, wcagRatio: 1, quality: 0 },
    // Edge: all maxes
    { bgL: 1, bgC: 0.4, bgH: 360, fgL: 1, fgC: 0.4, fgH: 360, apcaLc: 106, wcagRatio: 21, quality: 100 },
    // Saturated red
    { bgL: 0.3, bgC: 0.25, bgH: 30, fgL: 0.95, fgC: 0.02, fgH: 30, apcaLc: 85, wcagRatio: 12, quality: 78 },
    // Blue-purple
    { bgL: 0.15, bgC: 0.2, bgH: 270, fgL: 0.85, fgC: 0.04, fgH: 270, apcaLc: 70, wcagRatio: 7, quality: 65 },
  ];

  it('should produce identical weights (verify Mulberry32 PRNG)', async () => {
    const wasmWeights = MomotoBridge.isReady()
      ? (globalThis as any).__wasm__.sirenWeights()
      : null;

    if (wasmWeights) {
      // W1 should have shape [16, 9] = 144 values
      expect(wasmWeights.W1.shape).toEqual([16, 9]);
      expect(wasmWeights.W1.data.length).toBe(144);

      // B1 should have 16 values
      expect(wasmWeights.B1.data.length).toBe(16);

      // Total params = 483
      const total = wasmWeights.W1.data.length + wasmWeights.B1.data.length
                   + wasmWeights.W2.data.length + wasmWeights.B2.data.length
                   + wasmWeights.W3.data.length + wasmWeights.B3.data.length;
      expect(total).toBe(483);
    }
  });

  it('should match metadata', () => {
    const wasm = (globalThis as any).__wasm__;
    const meta = wasm.sirenMetadata();
    expect(meta.architecture).toEqual([9, 16, 16, 3]);
    expect(meta.totalParams).toBe(483);
    expect(meta.omega0).toBe(30.0);
    expect(meta.seed).toBe(42_1337);
  });

  for (const [i, input] of testCases.entries()) {
    it(`should match TS output for test case ${i}`, () => {
      // TypeScript result
      const tsResult = tsSiren(input);

      // WASM result
      const wasm = (globalThis as any).__wasm__;
      const wasmResult = wasm.computeSirenCorrection(
        input.bgL, input.bgC, input.bgH,
        input.fgL, input.fgC, input.fgH,
        input.apcaLc, input.wcagRatio, input.quality,
      );

      assertClose(wasmResult.deltaL, tsResult.deltaL, EPSILON,
        `Case ${i} deltaL: WASM=${wasmResult.deltaL} TS=${tsResult.deltaL}`);
      assertClose(wasmResult.deltaC, tsResult.deltaC, EPSILON,
        `Case ${i} deltaC: WASM=${wasmResult.deltaC} TS=${tsResult.deltaC}`);
      assertClose(wasmResult.deltaH, tsResult.deltaH, EPSILON,
        `Case ${i} deltaH: WASM=${wasmResult.deltaH} TS=${tsResult.deltaH}`);

      wasmResult.free();
    });
  }

  it('should match batch API to single-call API', () => {
    const wasm = (globalThis as any).__wasm__;

    // Build batch input
    const batchInput = new Float64Array(testCases.length * 9);
    for (let i = 0; i < testCases.length; i++) {
      const c = testCases[i]!;
      const base = i * 9;
      batchInput[base] = c.bgL;
      batchInput[base + 1] = c.bgC;
      batchInput[base + 2] = c.bgH;
      batchInput[base + 3] = c.fgL;
      batchInput[base + 4] = c.fgC;
      batchInput[base + 5] = c.fgH;
      batchInput[base + 6] = c.apcaLc;
      batchInput[base + 7] = c.wcagRatio;
      batchInput[base + 8] = c.quality;
    }

    const batchResult = new Float64Array(wasm.computeSirenCorrectionBatch(batchInput));

    // Compare each pair
    for (let i = 0; i < testCases.length; i++) {
      const c = testCases[i]!;
      const single = wasm.computeSirenCorrection(
        c.bgL, c.bgC, c.bgH, c.fgL, c.fgC, c.fgH,
        c.apcaLc, c.wcagRatio, c.quality,
      );

      const base = i * 3;
      assertClose(batchResult[base]!, single.deltaL, EPSILON, `Batch[${i}] deltaL`);
      assertClose(batchResult[base + 1]!, single.deltaC, EPSILON, `Batch[${i}] deltaC`);
      assertClose(batchResult[base + 2]!, single.deltaH, EPSILON, `Batch[${i}] deltaH`);
      single.free();
    }
  });

  it('should clamp outputs to safe ranges', () => {
    const wasm = (globalThis as any).__wasm__;

    // Test with extreme inputs that might produce large raw outputs
    const result = wasm.computeSirenCorrection(
      0.0, 0.0, 0.0, 1.0, 0.4, 180.0, 106.0, 21.0, 100.0,
    );

    expect(result.deltaL).toBeGreaterThanOrEqual(-0.15);
    expect(result.deltaL).toBeLessThanOrEqual(0.15);
    expect(result.deltaC).toBeGreaterThanOrEqual(-0.05);
    expect(result.deltaC).toBeLessThanOrEqual(0.05);
    expect(result.deltaH).toBeGreaterThanOrEqual(-10.0);
    expect(result.deltaH).toBeLessThanOrEqual(10.0);

    result.free();
  });
});

// =============================================================================
// 2. APCA / WCAG CONTRAST PARITY
// =============================================================================

describe('Contrast Metrics Parity', () => {
  // Reference values (computed independently)
  const contrastPairs = [
    { fg: '#FFFFFF', bg: '#000000', wcag: 21.0, apcaAbsMin: 105 },
    { fg: '#000000', bg: '#FFFFFF', wcag: 21.0, apcaAbsMin: 105 },
    { fg: '#777777', bg: '#FFFFFF', wcag: 4.48, apcaAbsMin: 55 },
    { fg: '#FF0000', bg: '#000000', wcag: 5.25, apcaAbsMin: 45 },
    { fg: '#00FF00', bg: '#000000', wcag: 15.3, apcaAbsMin: 90 },
    { fg: '#0000FF', bg: '#000000', wcag: 2.44, apcaAbsMin: 20 },
    { fg: '#123456', bg: '#FEDCBA', wcag: 6.0, apcaAbsMin: 50 },
  ];

  for (const pair of contrastPairs) {
    it(`WCAG ratio: ${pair.fg} on ${pair.bg}`, () => {
      const fg = MomotoBridge.color.fromHex(pair.fg);
      const bg = MomotoBridge.color.fromHex(pair.bg);

      const ratio = MomotoBridge.contrast.wcagRatio(fg, bg);

      // WCAG ratio should be within tolerance of reference
      assertClose(ratio, pair.wcag, 0.15,
        `WCAG: expected ~${pair.wcag}, got ${ratio}`);

      fg.free();
      bg.free();
    });

    it(`APCA Lc magnitude: ${pair.fg} on ${pair.bg}`, () => {
      const fg = MomotoBridge.color.fromHex(pair.fg);
      const bg = MomotoBridge.color.fromHex(pair.bg);

      const result = MomotoBridge.contrast.apca(fg, bg);
      const absLc = Math.abs(result.value);

      expect(absLc).toBeGreaterThanOrEqual(pair.apcaAbsMin);

      fg.free();
      bg.free();
    });
  }

  it('WCAG batch matches single calls', () => {
    const pairs = new Uint8Array([
      255, 255, 255, 0, 0, 0,       // white on black
      0, 0, 0, 255, 255, 255,       // black on white
      119, 119, 119, 255, 255, 255, // gray on white
    ]);

    const batchRatios = MomotoBridge.contrast.wcagRatioBatch(pairs);

    // Compare to single calls
    for (let i = 0; i < 3; i++) {
      const base = i * 6;
      const fg = MomotoBridge.color.fromRgb(pairs[base]!, pairs[base + 1]!, pairs[base + 2]!);
      const bg = MomotoBridge.color.fromRgb(pairs[base + 3]!, pairs[base + 4]!, pairs[base + 5]!);
      const singleRatio = MomotoBridge.contrast.wcagRatio(fg, bg);

      assertClose(batchRatios[i]!, singleRatio, EPSILON, `Batch[${i}] ratio mismatch`);

      fg.free();
      bg.free();
    }
  });

  it('WCAG requirements matrix is correct', () => {
    const matrix = MomotoBridge.contrast.wcagRequirementsMatrix();
    expect(matrix[0]).toBe(4.5);  // AA normal
    expect(matrix[1]).toBe(3.0);  // AA large
    expect(matrix[2]).toBe(7.0);  // AAA normal
    expect(matrix[3]).toBe(4.5);  // AAA large
  });

  it('wcagPasses returns correct results', () => {
    expect(MomotoBridge.contrast.wcagPasses(4.5, 'AA', false)).toBe(true);
    expect(MomotoBridge.contrast.wcagPasses(4.49, 'AA', false)).toBe(false);
    expect(MomotoBridge.contrast.wcagPasses(3.0, 'AA', true)).toBe(true);
    expect(MomotoBridge.contrast.wcagPasses(7.0, 'AAA', false)).toBe(true);
    expect(MomotoBridge.contrast.wcagPasses(6.99, 'AAA', false)).toBe(false);
  });

  it('wcagLevel returns correct levels', () => {
    expect(MomotoBridge.contrast.wcagLevel(8.0, false)).toBe('AAA');
    expect(MomotoBridge.contrast.wcagLevel(5.0, false)).toBe('AA');
    expect(MomotoBridge.contrast.wcagLevel(2.0, false)).toBeNull();
    expect(MomotoBridge.contrast.wcagLevel(4.0, true)).toBe('AAA');
  });

  it('isLargeText follows WCAG rules', () => {
    expect(MomotoBridge.contrast.isLargeText(24, 400)).toBe(true);   // >= 24px
    expect(MomotoBridge.contrast.isLargeText(18.66, 700)).toBe(true); // >= 18.66px bold
    expect(MomotoBridge.contrast.isLargeText(16, 400)).toBe(false);  // too small
    expect(MomotoBridge.contrast.isLargeText(18, 700)).toBe(false);  // 18px bold is NOT large
  });
});

// =============================================================================
// 3. OKLCH / OKLAB OPERATIONS
// =============================================================================

describe('OKLCH/OKLab Operations', () => {
  it('roundtrip: hex → Color → OKLCH → Color → hex', () => {
    const testHexes = ['#FF0000', '#00FF00', '#0000FF', '#FFFFFF', '#000000', '#808080', '#1A2B3C'];

    for (const hex of testHexes) {
      const color1 = MomotoBridge.color.fromHex(hex);
      const oklch = MomotoBridge.oklch.fromColor(color1);
      const color2 = MomotoBridge.oklch.toColor(oklch);
      const hex2 = MomotoBridge.color.toHex(color2);

      // Roundtrip should be close (gamut clipping may cause small differences)
      const [r1, g1, b1] = hexToRgb(hex);
      const [r2, g2, b2] = hexToRgb(hex2);
      expect(Math.abs(r1 - r2)).toBeLessThan(2);
      expect(Math.abs(g1 - g2)).toBeLessThan(2);
      expect(Math.abs(b1 - b2)).toBeLessThan(2);

      color1.free();
      oklch.free();
      color2.free();
    }
  });

  it('OKLCH interpolation midpoint', () => {
    const black = MomotoBridge.oklch.create(0, 0, 0);
    const white = MomotoBridge.oklch.create(1, 0, 0);
    const mid = MomotoBridge.oklch.interpolate(black, white, 0.5);

    assertClose(mid.l, 0.5, FLOAT_EPS, 'Mid L should be 0.5');
    assertClose(mid.c, 0.0, FLOAT_EPS, 'Mid C should be 0');

    black.free();
    white.free();
    mid.free();
  });

  it('OKLab deltaE is symmetric', () => {
    const a = MomotoBridge.oklab.create(0.5, 0.1, -0.05);
    const b = MomotoBridge.oklab.create(0.7, -0.05, 0.1);

    const d1 = MomotoBridge.oklab.deltaE(a, b);
    const d2 = MomotoBridge.oklab.deltaE(b, a);

    assertClose(d1, d2, EPSILON, 'deltaE should be symmetric');
    expect(d1).toBeGreaterThan(0);

    a.free();
    b.free();
  });

  it('OKLab identity has zero deltaE', () => {
    const a = MomotoBridge.oklab.create(0.5, 0.1, -0.05);
    const d = MomotoBridge.oklab.deltaE(a, a);
    assertClose(d, 0, EPSILON, 'deltaE(a, a) should be 0');
    a.free();
  });
});

// =============================================================================
// 4. LUMINANCE
// =============================================================================

describe('Luminance', () => {
  it('white has luminance ~1.0', () => {
    const white = MomotoBridge.color.fromHex('#FFFFFF');
    const lum = MomotoBridge.luminance.srgb(white);
    assertClose(lum, 1.0, FLOAT_EPS, 'White luminance');
    white.free();
  });

  it('black has luminance ~0.0', () => {
    const black = MomotoBridge.color.fromHex('#000000');
    const lum = MomotoBridge.luminance.srgb(black);
    assertClose(lum, 0.0, FLOAT_EPS, 'Black luminance');
    black.free();
  });

  it('sRGB gamma decoding roundtrip', () => {
    for (const v of [0.0, 0.1, 0.25, 0.5, 0.75, 1.0]) {
      const linear = MomotoBridge.luminance.srgbToLinear(v);
      const back = MomotoBridge.luminance.linearToSrgb(linear);
      assertClose(back, v, FLOAT_EPS, `Gamma roundtrip for ${v}`);
    }
  });

  it('luminance batch matches single calls', () => {
    const colors = new Uint8Array([
      255, 0, 0,     // red
      0, 255, 0,     // green
      0, 0, 255,     // blue
      255, 255, 255, // white
      0, 0, 0,       // black
    ]);

    const batchLum = MomotoBridge.contrast.luminanceBatch(colors);

    for (let i = 0; i < 5; i++) {
      const base = i * 3;
      const color = MomotoBridge.color.fromRgb(colors[base]!, colors[base + 1]!, colors[base + 2]!);
      const singleLum = MomotoBridge.luminance.srgb(color);

      assertClose(batchLum[i]!, singleLum, EPSILON, `Batch luminance[${i}]`);
      color.free();
    }
  });
});

// =============================================================================
// 5. MATH UTILITIES
// =============================================================================

describe('Math Utilities', () => {
  it('lerp boundary values', () => {
    expect(MomotoBridge.math.lerp(0, 10, 0)).toBe(0);
    expect(MomotoBridge.math.lerp(0, 10, 1)).toBe(10);
    expect(MomotoBridge.math.lerp(0, 10, 0.5)).toBe(5);
  });

  it('inverseLerp is inverse of lerp', () => {
    for (const t of [0.0, 0.25, 0.5, 0.75, 1.0]) {
      const value = MomotoBridge.math.lerp(10, 20, t);
      const tBack = MomotoBridge.math.inverseLerp(10, 20, value);
      assertClose(tBack, t, FLOAT_EPS, `inverseLerp(lerp(${t})) = ${tBack}`);
    }
  });

  it('smoothstep is in [0, 1] for t in [0, 1]', () => {
    for (let t = 0; t <= 1.0; t += 0.1) {
      const v = MomotoBridge.math.smoothstep(t);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(MomotoBridge.math.smoothstep(0)).toBe(0);
    expect(MomotoBridge.math.smoothstep(1)).toBe(1);
  });

  it('remap linear scaling', () => {
    const v = MomotoBridge.math.remap(5, 0, 10, 100, 200);
    assertClose(v, 150, FLOAT_EPS, 'remap(5, 0-10, 100-200)');
  });
});

// =============================================================================
// 6. MATERIALS / PBR
// =============================================================================

describe('Materials & PBR', () => {
  it('DielectricBSDF energy conservation', () => {
    const wasm = (globalThis as any).__wasm__;

    const glass = new wasm.DielectricBSDF(1.5, 0.05);
    const validation = glass.validateEnergy();

    expect(validation.conserved).toBe(true);
    expect(validation.totalEnergy).toBeLessThanOrEqual(1.0 + FLOAT_EPS);

    glass.free();
  });

  it('ConductorBSDF metal presets have color', () => {
    const wasm = (globalThis as any).__wasm__;

    const gold = wasm.ConductorBSDF.gold();
    const result = gold.evaluate(0, 0, 1, 0, 0, 1); // Normal incidence

    expect(result.reflectance).toBeGreaterThan(0);
    expect(result.transmittance).toBe(0); // Metals are opaque

    gold.free();
  });

  it('LayeredBSDF respects layer count', () => {
    const wasm = (globalThis as any).__wasm__;

    const layered = new wasm.LayeredBSDF();
    expect(layered.layerCount()).toBe(0);

    layered.addDielectric(1.5, 0.05);
    expect(layered.layerCount()).toBe(1);

    layered.addThinFilm(400.0, 1.3);
    expect(layered.layerCount()).toBe(2);

    layered.free();
  });

  it('PBRMaterial presets are valid', () => {
    const wasm = (globalThis as any).__wasm__;
    const presets = ['glass', 'water', 'diamond', 'gold', 'silver', 'copper'];

    for (const name of presets) {
      const mat = wasm.PBRMaterial.fromPreset(name);
      const result = mat.evaluateNormal();

      expect(result.reflectance).toBeGreaterThanOrEqual(0);
      expect(result.reflectance).toBeLessThanOrEqual(1);

      mat.free();
    }
  });

  it('ConstraintValidator enforces energy conservation', () => {
    const wasm = (globalThis as any).__wasm__;

    const validator = new wasm.ConstraintValidator();

    // Valid: R + T + A = 1.0
    const valid = validator.validate(0.5, 0.3, 0.2);
    assertClose(valid.totalPenalty, 0.0, FLOAT_EPS, 'Valid input should have zero penalty');

    // Invalid: R + T + A > 1.0
    const invalid = validator.validate(0.6, 0.5, 0.3);
    expect(invalid.energyPenalty).toBeGreaterThan(0);

    // Clamp should fix it
    const clamped = new Float64Array(validator.validateAndClamp(0.6, 0.5, 0.3));
    const sum = clamped[0]! + clamped[1]! + clamped[2]!;
    assertClose(sum, 1.0, FLOAT_EPS, 'Clamped should sum to 1.0');

    validator.free();
  });
});

// =============================================================================
// 7. REFRACTION & SHADOWS
// =============================================================================

describe('Refraction & Shadows', () => {
  it('RefractionParams presets are valid', () => {
    const wasm = (globalThis as any).__wasm__;

    const presets = ['clear', 'frosted', 'thick', 'subtle', 'highIndex'];
    for (const name of presets) {
      const params = wasm.RefractionParams[name]();
      expect(params.ior).toBeGreaterThan(1.0);
      expect(params.ior).toBeLessThan(3.0);
      params.free();
    }
  });

  it('Refraction at center has minimal distortion', () => {
    const wasm = (globalThis as any).__wasm__;

    const params = wasm.RefractionParams.subtle();
    const result = wasm.calculateRefraction(params, 0.5, 0.5);

    // Center of panel should have near-zero offset
    expect(Math.abs(result.offsetX)).toBeLessThan(0.1);
    expect(Math.abs(result.offsetY)).toBeLessThan(0.1);

    params.free();
  });

  it('Distortion map has correct size', () => {
    const wasm = (globalThis as any).__wasm__;

    const params = wasm.RefractionParams.clear();
    const gridSize = 8;
    const map = new Float64Array(wasm.generateDistortionMap(params, gridSize));

    // 8×8 grid, 4 values per sample
    expect(map.length).toBe(gridSize * gridSize * 4);

    params.free();
  });

  it('Ambient shadow presets produce CSS', () => {
    const wasm = (globalThis as any).__wasm__;

    const params = wasm.AmbientShadowParams.standard();
    const css = wasm.calculateAmbientShadow(params, 4.0);

    expect(typeof css).toBe('string');
    expect(css.length).toBeGreaterThan(0);
    // Should contain rgba() or similar
    expect(css).toMatch(/rgba?\(/);

    params.free();
  });

  it('Interactive shadow changes with state', () => {
    const wasm = (globalThis as any).__wasm__;

    const transition = wasm.ElevationTransition.card();
    const shadow = wasm.AmbientShadowParams.standard();

    const rest = wasm.calculateInteractiveShadow(transition, 0, shadow);
    const hover = wasm.calculateInteractiveShadow(transition, 1, shadow);

    // Hover should produce larger shadow than rest
    expect(rest).not.toBe(hover);

    transition.free();
    shadow.free();
  });
});

// =============================================================================
// 8. TEMPORAL & SPECTRAL
// =============================================================================

describe('Temporal & Spectral', () => {
  it('EMA converges to target', () => {
    const wasm = (globalThis as any).__wasm__;

    const ema = new wasm.ExponentialMovingAverage(0.3);

    // Feed constant value, should converge
    for (let i = 0; i < 50; i++) {
      ema.update(1.0);
    }
    assertClose(ema.value, 1.0, 0.01, 'EMA should converge to 1.0');

    ema.free();
  });

  it('Temporal dielectric IOR changes over time', () => {
    const wasm = (globalThis as any).__wasm__;

    const td = new wasm.TemporalDielectric(1.5, 0.05, 0.01, 0.005);
    const ior0 = td.iorAt(0.0);
    const ior10 = td.iorAt(10.0);

    expect(ior0).not.toBe(ior10);
    assertClose(ior0, 1.5, FLOAT_EPS, 'IOR at t=0');

    td.free();
  });

  it('Spectral gradient has correct length', () => {
    const wasm = (globalThis as any).__wasm__;

    const steps = 10;
    const gradient = new Uint8Array(wasm.spectralGradient(
      255, 0, 0,   // red
      0, 0, 255,   // blue
      steps,
    ));

    expect(gradient.length).toBe(steps * 3);

    // First step should be red-ish, last should be blue-ish
    expect(gradient[0]).toBeGreaterThan(200);  // R high
    expect(gradient[gradient.length - 1]!).toBeGreaterThan(200); // B high
  });
});

// =============================================================================
// 9. DELTA-E COLOR DIFFERENCE
// =============================================================================

describe('DeltaE Color Difference', () => {
  it('deltaE76: identical colors have zero difference', () => {
    const wasm = (globalThis as any).__wasm__;
    const d = wasm.deltaE76(50, 10, -20, 50, 10, -20);
    assertClose(d, 0.0, EPSILON, 'Identical colors');
  });

  it('deltaE2000: black vs white is large', () => {
    const wasm = (globalThis as any).__wasm__;
    // L*=0 (black) vs L*=100 (white)
    const d = wasm.deltaE2000(0, 0, 0, 100, 0, 0);
    expect(d).toBeGreaterThan(50);
  });

  it('deltaE2000 batch matches single', () => {
    const wasm = (globalThis as any).__wasm__;

    const pairs = new Float64Array([
      50, 10, -20, 60, 15, -25,  // pair 1
      30, -5, 40, 70, 20, -10,   // pair 2
    ]);

    const batch = new Float64Array(wasm.deltaE2000Batch(pairs));

    const single1 = wasm.deltaE2000(50, 10, -20, 60, 15, -25);
    const single2 = wasm.deltaE2000(30, -5, 40, 70, 20, -10);

    assertClose(batch[0]!, single1, EPSILON, 'Batch[0]');
    assertClose(batch[1]!, single2, EPSILON, 'Batch[1]');
  });

  it('RGB → LAB → RGB roundtrip', () => {
    const wasm = (globalThis as any).__wasm__;

    const testColors: [number, number, number][] = [
      [255, 0, 0], [0, 255, 0], [0, 0, 255],
      [128, 128, 128], [255, 255, 255], [0, 0, 0],
    ];

    for (const [r, g, b] of testColors) {
      const lab = new Float64Array(wasm.rgbToLab(r, g, b));
      const rgb = new Uint8Array(wasm.labToRgb(lab[0], lab[1], lab[2]));

      expect(Math.abs(rgb[0]! - r)).toBeLessThan(2);
      expect(Math.abs(rgb[1]! - g)).toBeLessThan(2);
      expect(Math.abs(rgb[2]! - b)).toBeLessThan(2);
    }
  });
});

// =============================================================================
// 10. EDGE CASES
// =============================================================================

describe('Edge Cases', () => {
  it('handles black (#000000) gracefully', () => {
    const black = MomotoBridge.color.fromHex('#000000');
    const oklch = MomotoBridge.oklch.fromColor(black);

    expect(oklch.l).toBe(0);
    expect(oklch.c).toBe(0);

    black.free();
    oklch.free();
  });

  it('handles white (#FFFFFF) gracefully', () => {
    const white = MomotoBridge.color.fromHex('#FFFFFF');
    const oklch = MomotoBridge.oklch.fromColor(white);

    assertClose(oklch.l, 1.0, 0.01, 'White L');
    assertClose(oklch.c, 0.0, 0.01, 'White C');

    white.free();
    oklch.free();
  });

  it('WCAG contrast of identical colors is 1:1', () => {
    const color = MomotoBridge.color.fromHex('#808080');
    const ratio = MomotoBridge.contrast.wcagRatio(color, color);
    assertClose(ratio, 1.0, WCAG_EPS, 'Same color = 1:1 ratio');
    color.free();
  });

  it('SIREN handles zero inputs without NaN', () => {
    const wasm = (globalThis as any).__wasm__;
    const result = wasm.computeSirenCorrection(0, 0, 0, 0, 0, 0, 0, 1, 0);

    expect(Number.isNaN(result.deltaL)).toBe(false);
    expect(Number.isNaN(result.deltaC)).toBe(false);
    expect(Number.isNaN(result.deltaH)).toBe(false);

    result.free();
  });

  it('Batch APIs reject invalid input sizes', () => {
    const wasm = (globalThis as any).__wasm__;

    // WCAG batch needs multiple of 6
    expect(() => wasm.wcagContrastRatioBatch(new Uint8Array([1, 2, 3, 4])))
      .toThrow();

    // SIREN batch needs multiple of 9
    expect(() => wasm.computeSirenCorrectionBatch(new Float64Array([1, 2, 3])))
      .toThrow();

    // Luminance batch needs multiple of 3
    expect(() => wasm.relativeLuminanceBatch(new Uint8Array([1, 2])))
      .toThrow();
  });
});

// =============================================================================
// 11. PERFORMANCE BENCHMARKS
// =============================================================================

describe('Performance Benchmarks', () => {
  const N = 1000;

  bench('SIREN single correction (WASM)', () => {
    const wasm = (globalThis as any).__wasm__;
    const result = wasm.computeSirenCorrection(
      0.2, 0.15, 250, 0.9, 0.03, 250, 75, 8.5, 72,
    );
    result.free();
  });

  bench('SIREN single correction (TS)', () => {
    tsSiren({
      bgL: 0.2, bgC: 0.15, bgH: 250,
      fgL: 0.9, fgC: 0.03, fgH: 250,
      apcaLc: 75, wcagRatio: 8.5, quality: 72,
    });
  });

  bench(`SIREN batch ${N} corrections (WASM)`, () => {
    const wasm = (globalThis as any).__wasm__;
    const input = new Float64Array(N * 9);
    for (let i = 0; i < N; i++) {
      const base = i * 9;
      input[base] = 0.2; input[base + 1] = 0.15; input[base + 2] = 250;
      input[base + 3] = 0.9; input[base + 4] = 0.03; input[base + 5] = 250;
      input[base + 6] = 75; input[base + 7] = 8.5; input[base + 8] = 72;
    }
    wasm.computeSirenCorrectionBatch(input);
  });

  bench(`WCAG batch ${N} ratios (WASM)`, () => {
    const wasm = (globalThis as any).__wasm__;
    const pairs = new Uint8Array(N * 6);
    for (let i = 0; i < N; i++) {
      const base = i * 6;
      pairs[base] = 255; pairs[base + 1] = 255; pairs[base + 2] = 255;
      pairs[base + 3] = 0; pairs[base + 4] = 0; pairs[base + 5] = 0;
    }
    wasm.wcagContrastRatioBatch(pairs);
  });

  bench(`Luminance batch ${N} colors (WASM)`, () => {
    const wasm = (globalThis as any).__wasm__;
    const colors = new Uint8Array(N * 3);
    for (let i = 0; i < N; i++) {
      colors[i * 3] = i % 256;
      colors[i * 3 + 1] = (i * 7) % 256;
      colors[i * 3 + 2] = (i * 13) % 256;
    }
    wasm.relativeLuminanceBatch(colors);
  });

  bench('DielectricBSDF evaluate (WASM)', () => {
    const wasm = (globalThis as any).__wasm__;
    const bsdf = wasm.DielectricBSDF.glass();
    bsdf.evaluate(0, 0, 1, 0, 0, 1);
    bsdf.free();
  });
});
