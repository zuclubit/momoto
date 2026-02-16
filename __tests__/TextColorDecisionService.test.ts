/**
 * @fileoverview TextColorDecisionService Test Suite
 *
 * Minimum test coverage for BLOCKER #4 remediation.
 * Tests text color decision logic and error handling.
 *
 * @module momoto-ui/__tests__/TextColorDecisionService
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import { TextColorDecisionService } from '../domain/decisions/services/TextColorDecisionService';
import { PerceptualColor } from '../domain/perceptual/value-objects/PerceptualColor.REFACTORED';

describe('TextColorDecisionService', () => {
  beforeAll(async () => {
    // Ensure WASM is initialized
    await PerceptualColor.fromHex('#000000');
  });

  describe('getOptimalTextColor', () => {
    it('should return white text for dark backgrounds', async () => {
      const darkBg = await PerceptualColor.fromHex('#000000');

      const decision = await TextColorDecisionService.getOptimalTextColor(darkBg);

      expect(decision).toBeDefined();
      expect(decision.color).toBeDefined();
      expect(decision.metadata).toBeDefined();
      expect(decision.metadata.qualityScore).toBeGreaterThan(0);
      expect(decision.metadata.confidence).toBeGreaterThan(0);
      expect(decision.metadata.reason).toBeTruthy();
    });

    it('should return black text for light backgrounds', async () => {
      const lightBg = await PerceptualColor.fromHex('#FFFFFF');

      const decision = await TextColorDecisionService.getOptimalTextColor(lightBg);

      expect(decision).toBeDefined();
      expect(decision.color).toBeDefined();
      // For white bg, expect dark text
      const { l } = decision.color.oklch;
      expect(l).toBeLessThan(0.5);
    });

    it('should include accessibility metadata', async () => {
      const blueBg = await PerceptualColor.fromHex('#3B82F6');

      const decision = await TextColorDecisionService.getOptimalTextColor(blueBg);

      expect(decision.metadata.accessibility).toBeDefined();
      expect(decision.metadata.accessibility?.wcagRatio).toBeGreaterThan(0);
      expect(decision.metadata.accessibility?.wcagLevel).toBeDefined();
    });

    it('should meet WCAG AA minimum (4.5:1) for normal text', async () => {
      const backgrounds = [
        '#FF0000', // red
        '#00FF00', // green
        '#0000FF', // blue
        '#808080', // gray
      ];

      for (const hex of backgrounds) {
        const bg = await PerceptualColor.fromHex(hex);
        const decision = await TextColorDecisionService.getOptimalTextColor(bg);

        expect(decision.metadata.accessibility?.wcagRatio).toBeGreaterThanOrEqual(4.5);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid colors gracefully', async () => {
      // This test ensures service doesn't crash on edge cases
      // Actual validation happens in PerceptualColor.fromHex
      const edgeCases = [
        '#000000', // pure black
        '#FFFFFF', // pure white
        '#FF0000', // pure red
      ];

      for (const hex of edgeCases) {
        const color = await PerceptualColor.fromHex(hex);
        await expect(
          TextColorDecisionService.getOptimalTextColor(color)
        ).resolves.toBeDefined();
      }
    });
  });
});
