/**
 * @fileoverview MomotoBridge Test Suite
 *
 * Tests critical initialization and error handling paths.
 * Updated to use the current MomotoBridge API (init/color/contrast namespaces).
 *
 * @module momoto-ui/__tests__/MomotoBridge
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { MomotoBridge } from '../src/infrastructure/MomotoBridge';

// NOTE: WASM must be built at momoto/crates/momoto-wasm/pkg/ before tests run.
// If pkg/ doesn't exist, tests will fail with a module not found error.
// Build with: npm run build:wasm

const WASM_AVAILABLE = (() => {
  try {
    require.resolve('../momoto/crates/momoto-wasm/pkg');
    return true;
  } catch {
    return false;
  }
})();

describe('MomotoBridge', () => {
  describe('Initialization', () => {
    it('should expose init/isReady/getError/assertReady', () => {
      expect(typeof MomotoBridge.init).toBe('function');
      expect(typeof MomotoBridge.isReady).toBe('function');
      expect(typeof MomotoBridge.getError).toBe('function');
      expect(typeof MomotoBridge.assertReady).toBe('function');
    });

    it.skipIf(!WASM_AVAILABLE)('should initialize WASM successfully', async () => {
      await expect(MomotoBridge.init()).resolves.not.toThrow();
      expect(MomotoBridge.isReady()).toBe(true);
    });

    it.skipIf(!WASM_AVAILABLE)('should be idempotent (multiple calls safe)', async () => {
      await MomotoBridge.init();
      await expect(MomotoBridge.init()).resolves.not.toThrow();
      expect(MomotoBridge.isReady()).toBe(true);
    });
  });

  describe('Color Creation (requires WASM)', () => {
    beforeAll(async () => {
      if (WASM_AVAILABLE) await MomotoBridge.init();
    });

    it.skipIf(!WASM_AVAILABLE)('should create color from valid hex', () => {
      const color = MomotoBridge.color.fromHex('#3B82F6');
      expect(color).toBeDefined();
      expect(color.toHex().toLowerCase()).toBe('#3b82f6');
    });

    it.skipIf(!WASM_AVAILABLE)('should throw on invalid hex', () => {
      expect(() => MomotoBridge.color.fromHex('invalid')).toThrow();
    });
  });

  describe('WCAG Contrast (requires WASM)', () => {
    beforeAll(async () => {
      if (WASM_AVAILABLE) await MomotoBridge.init();
    });

    it.skipIf(!WASM_AVAILABLE)('should calculate 21:1 for black on white', () => {
      const fg = MomotoBridge.color.fromHex('#000000');
      const bg = MomotoBridge.color.fromHex('#ffffff');
      const ratio = MomotoBridge.contrast.wcagRatio(fg, bg);
      expect(ratio).toBeCloseTo(21, 0);
    });

    it.skipIf(!WASM_AVAILABLE)('should return 1:1 for identical colors', () => {
      const color = MomotoBridge.color.fromHex('#808080');
      const ratio = MomotoBridge.contrast.wcagRatio(color, color);
      expect(ratio).toBeCloseTo(1, 1);
    });

    it.skipIf(!WASM_AVAILABLE)('should pass WCAG AA for 6.88:1 ratio', () => {
      const fg = MomotoBridge.color.fromHex('#6188d8');
      const bg = MomotoBridge.color.fromHex('#07070e');
      const ratio = MomotoBridge.contrast.wcagRatio(fg, bg);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('APCA Contrast (requires WASM)', () => {
    beforeAll(async () => {
      if (WASM_AVAILABLE) await MomotoBridge.init();
    });

    it.skipIf(!WASM_AVAILABLE)('should return Lc > 60 for blue on dark background', () => {
      const fg = MomotoBridge.color.fromHex('#6188d8');
      const bg = MomotoBridge.color.fromHex('#07070e');
      const lc = Math.abs(MomotoBridge.contrast.apca(fg, bg));
      expect(lc).toBeGreaterThan(60);
    });
  });
});
