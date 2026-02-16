/**
 * @fileoverview MomotoBridge Test Suite
 *
 * Minimum test coverage for BLOCKER #4 remediation.
 * Tests critical initialization and error handling paths.
 *
 * @module momoto-ui/__tests__/MomotoBridge
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { MomotoBridge } from '../infrastructure/MomotoBridge';

describe('MomotoBridge', () => {
  describe('Initialization', () => {
    it('should initialize WASM successfully', async () => {
      // Test that WASM can be initialized
      await expect(MomotoBridge.initialize()).resolves.not.toThrow();
    });

    it('should be idempotent (multiple calls safe)', async () => {
      // Initialize twice - should not throw
      await MomotoBridge.initialize();
      await expect(MomotoBridge.initialize()).resolves.not.toThrow();
    });
  });

  describe('Color Creation', () => {
    beforeAll(async () => {
      await MomotoBridge.initialize();
    });

    it('should create color from valid hex', async () => {
      const color = await MomotoBridge.createColor('#3B82F6');
      expect(color).toBeDefined();
      expect(color.toHex()).toBe('#3b82f6');
    });

    it('should reject invalid hex', async () => {
      await expect(MomotoBridge.createColor('invalid')).rejects.toThrow();
    });

    it('should handle hex without hash', async () => {
      await expect(MomotoBridge.createColor('3B82F6')).rejects.toThrow();
    });
  });

  describe('WCAG Contrast', () => {
    beforeAll(async () => {
      await MomotoBridge.initialize();
    });

    it('should calculate contrast ratio between colors', async () => {
      const fg = await MomotoBridge.createColor('#000000');
      const bg = await MomotoBridge.createColor('#FFFFFF');

      const ratio = await MomotoBridge.getWCAGContrastRatio(fg, bg);

      expect(ratio).toBeGreaterThan(0);
      expect(ratio).toBeLessThanOrEqual(21); // Max contrast is 21:1
    });

    it('should return 1:1 for identical colors', async () => {
      const color = await MomotoBridge.createColor('#808080');

      const ratio = await MomotoBridge.getWCAGContrastRatio(color, color);

      expect(ratio).toBeCloseTo(1, 1);
    });
  });
});
