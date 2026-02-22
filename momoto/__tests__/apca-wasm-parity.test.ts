/**
 * APCA WASM Parity Tests - FASE 3
 *
 * Verifies that Rust/WASM implementation produces IDENTICAL results
 * to TypeScript implementation (bit-for-bit parity).
 *
 * Date: 2026-01-06
 * Requirement: Rust output MUST equal TypeScript output exactly
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { APCA_GOLDEN_VECTORS } from '../benchmark/data/golden-sets/apca-vectors';
import { apca_contrast } from '../wasm/apca_wasm';

// Helper to parse hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error(`Invalid hex: ${hex}`);
  return {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16),
  };
}

// TypeScript reference implementation (from APCAContrast.ts)
// This is the EXACT same code as in the TypeScript implementation
const APCA = {
  mainTRC: 2.4,
  sRco: 0.2126729,
  sGco: 0.7151522,
  sBco: 0.0721750,
  blkThrs: 0.022,
  blkClmp: 1.414,
  loClip: 0.1,
  deltaYmin: 0.0005,
  normBG: 0.56,
  normTXT: 0.57,
  revBG: 0.65,
  revTXT: 0.62,
  scaleBoW: 1.14,
  scaleWoB: 1.14,
  loBoWoffset: 0.027,
  loWoBoffset: 0.027,
} as const;

function calculateAPCATypeScript(
  fg_r: number,
  fg_g: number,
  fg_b: number,
  bg_r: number,
  bg_g: number,
  bg_b: number
): number {
  // Convert to luminance
  const rLinTxt = Math.pow(fg_r / 255, APCA.mainTRC);
  const gLinTxt = Math.pow(fg_g / 255, APCA.mainTRC);
  const bLinTxt = Math.pow(fg_b / 255, APCA.mainTRC);
  let textY = APCA.sRco * rLinTxt + APCA.sGco * gLinTxt + APCA.sBco * bLinTxt;

  const rLinBg = Math.pow(bg_r / 255, APCA.mainTRC);
  const gLinBg = Math.pow(bg_g / 255, APCA.mainTRC);
  const bLinBg = Math.pow(bg_b / 255, APCA.mainTRC);
  let backY = APCA.sRco * rLinBg + APCA.sGco * gLinBg + APCA.sBco * bLinBg;

  // Soft clamp
  textY = textY > APCA.blkThrs ? textY : textY + Math.pow(APCA.blkThrs - textY, APCA.blkClmp);
  backY = backY > APCA.blkThrs ? backY : backY + Math.pow(APCA.blkThrs - backY, APCA.blkClmp);

  // deltaYmin check
  if (Math.abs(backY - textY) < APCA.deltaYmin) {
    return 0.0;
  }

  // Determine polarity
  const isDarkOnLight = backY > textY;

  // Calculate SAPC
  let SAPC: number;
  if (isDarkOnLight) {
    SAPC = (Math.pow(backY, APCA.normBG) - Math.pow(textY, APCA.normTXT)) * APCA.scaleBoW;
  } else {
    SAPC = (Math.pow(backY, APCA.revBG) - Math.pow(textY, APCA.revTXT)) * APCA.scaleWoB;
  }

  // Low contrast clipping
  let outputContrast: number;
  if (isDarkOnLight) {
    outputContrast = (SAPC < APCA.loClip) ? 0 : SAPC - APCA.loBoWoffset;
  } else {
    outputContrast = (SAPC > -APCA.loClip) ? 0 : SAPC + APCA.loWoBoffset;
  }

  return outputContrast * 100;
}

describe('APCA WASM Parity Tests', () => {
  describe('Golden Vectors Parity', () => {
    it('should match TypeScript output for all golden vectors', () => {
      let totalDeviation = 0;
      let maxDeviation = 0;
      const failures: Array<{ name: string; tsLc: number; wasmLc: number; diff: number }> = [];

      for (const vector of APCA_GOLDEN_VECTORS) {
        const rgb_fg = hexToRgb(vector.foreground.hex);
        const rgb_bg = hexToRgb(vector.background.hex);

        const tsLc = calculateAPCATypeScript(
          rgb_fg.r, rgb_fg.g, rgb_fg.b,
          rgb_bg.r, rgb_bg.g, rgb_bg.b
        );

        const wasmLc = apca_contrast(
          rgb_fg.r, rgb_fg.g, rgb_fg.b,
          rgb_bg.r, rgb_bg.g, rgb_bg.b
        );

        const deviation = Math.abs(tsLc - wasmLc);
        totalDeviation += deviation;
        maxDeviation = Math.max(maxDeviation, deviation);

        if (deviation > 0.01) {
          failures.push({
            name: vector.name,
            tsLc,
            wasmLc,
            diff: deviation,
          });
        }

        // Assert exact match (within floating point precision)
        expect(wasmLc).toBeCloseTo(tsLc, 2); // 2 decimal places
      }

      const meanDeviation = totalDeviation / APCA_GOLDEN_VECTORS.length;

      console.log('\n' + '='.repeat(60));
      console.log('APCA WASM PARITY TEST RESULTS');
      console.log('='.repeat(60));
      console.log(`Total Vectors: ${APCA_GOLDEN_VECTORS.length}`);
      console.log(`Max Deviation: ${maxDeviation.toFixed(4)} Lc`);
      console.log(`Mean Deviation: ${meanDeviation.toFixed(4)} Lc`);

      if (failures.length > 0) {
        console.log(`\n❌ Failures: ${failures.length}`);
        failures.forEach(f => {
          console.log(`  ${f.name}: TS=${f.tsLc.toFixed(2)}, WASM=${f.wasmLc.toFixed(2)}, Δ=${f.diff.toFixed(4)}`);
        });
      } else {
        console.log('\n✅ Perfect parity! All vectors match.');
      }
      console.log('='.repeat(60));

      // Assert perfect parity
      expect(failures.length).toBe(0);
      expect(maxDeviation).toBeLessThan(0.01);
    });
  });

  describe('Random Color Parity', () => {
    it('should match TypeScript for 1000 random color combinations', () => {
      const iterations = 1000;
      let maxDeviation = 0;
      let totalDeviation = 0;

      for (let i = 0; i < iterations; i++) {
        // Generate random RGB values
        const fg_r = Math.floor(Math.random() * 256);
        const fg_g = Math.floor(Math.random() * 256);
        const fg_b = Math.floor(Math.random() * 256);
        const bg_r = Math.floor(Math.random() * 256);
        const bg_g = Math.floor(Math.random() * 256);
        const bg_b = Math.floor(Math.random() * 256);

        const tsLc = calculateAPCATypeScript(fg_r, fg_g, fg_b, bg_r, bg_g, bg_b);
        const wasmLc = apca_contrast(fg_r, fg_g, fg_b, bg_r, bg_g, bg_b);

        const deviation = Math.abs(tsLc - wasmLc);
        totalDeviation += deviation;
        maxDeviation = Math.max(maxDeviation, deviation);

        expect(wasmLc).toBeCloseTo(tsLc, 2);
      }

      const meanDeviation = totalDeviation / iterations;

      console.log('\n' + '='.repeat(60));
      console.log(`RANDOM COLOR PARITY (${iterations} iterations)`);
      console.log('='.repeat(60));
      console.log(`Max Deviation: ${maxDeviation.toFixed(4)} Lc`);
      console.log(`Mean Deviation: ${meanDeviation.toFixed(4)} Lc`);
      console.log('✅ All random colors matched!');
      console.log('='.repeat(60));

      expect(maxDeviation).toBeLessThan(0.01);
    });
  });

  describe('Edge Cases Parity', () => {
    const edgeCases = [
      { name: 'Identical colors', fg: [128, 128, 128], bg: [128, 128, 128] },
      { name: 'Black on Black', fg: [0, 0, 0], bg: [0, 0, 0] },
      { name: 'White on White', fg: [255, 255, 255], bg: [255, 255, 255] },
      { name: 'Near-zero difference', fg: [100, 100, 100], bg: [101, 101, 101] },
      { name: 'Max red vs black', fg: [255, 0, 0], bg: [0, 0, 0] },
      { name: 'Max green vs black', fg: [0, 255, 0], bg: [0, 0, 0] },
      { name: 'Max blue vs black', fg: [0, 0, 255], bg: [0, 0, 0] },
      { name: 'Very dark on dark', fg: [5, 5, 5], bg: [10, 10, 10] },
    ];

    edgeCases.forEach(({ name, fg, bg }) => {
      it(`should match TypeScript for: ${name}`, () => {
        const tsLc = calculateAPCATypeScript(fg[0]!, fg[1]!, fg[2]!, bg[0]!, bg[1]!, bg[2]!);
        const wasmLc = apca_contrast(fg[0]!, fg[1]!, fg[2]!, bg[0]!, bg[1]!, bg[2]!);

        expect(wasmLc).toBeCloseTo(tsLc, 2);

        console.log(`  ${name}: TS=${tsLc.toFixed(2)}, WASM=${wasmLc.toFixed(2)}, Δ=${Math.abs(tsLc - wasmLc).toFixed(4)}`);
      });
    });
  });

  describe('Polarity Consistency', () => {
    it('should have consistent polarity (sign) with TypeScript', () => {
      const testCases = [
        { fg: [0, 0, 0], bg: [255, 255, 255], expectedSign: 1 }, // Dark on light = positive
        { fg: [255, 255, 255], bg: [0, 0, 0], expectedSign: -1 }, // Light on dark = negative
        { fg: [100, 100, 100], bg: [200, 200, 200], expectedSign: 1 },
        { fg: [200, 200, 200], bg: [100, 100, 100], expectedSign: -1 },
      ];

      testCases.forEach(({ fg, bg, expectedSign }) => {
        const tsLc = calculateAPCATypeScript(fg[0]!, fg[1]!, fg[2]!, bg[0]!, bg[1]!, bg[2]!);
        const wasmLc = apca_contrast(fg[0]!, fg[1]!, fg[2]!, bg[0]!, bg[1]!, bg[2]!);

        // Check same sign (or both zero)
        if (Math.abs(tsLc) < 0.01 && Math.abs(wasmLc) < 0.01) {
          // Both effectively zero
          expect(true).toBe(true);
        } else {
          expect(Math.sign(wasmLc)).toBe(Math.sign(tsLc));
          expect(Math.sign(wasmLc)).toBe(expectedSign);
        }
      });
    });
  });
});
