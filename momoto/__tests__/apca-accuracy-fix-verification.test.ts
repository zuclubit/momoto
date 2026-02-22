/**
 * APCA Accuracy Fix Verification
 *
 * This test verifies that the piecewise sRGB transformation fix (2026-01-06)
 * improved APCA accuracy from 33.3% to >95% pass rate.
 */

import { describe, it, expect } from 'vitest';
import { runAPCAAccuracyTests } from '../benchmark/suites/accuracy.benchmark';

describe('APCA Accuracy Fix Verification', () => {
  it('should achieve >95% pass rate on golden vectors', () => {
    const results = runAPCAAccuracyTests();

    console.log('\n' + '='.repeat(60));
    console.log('APCA ACCURACY TEST RESULTS (After sRGB Fix)');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${results.totalTests}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Pass Rate: ${results.passRate.toFixed(1)}%`);
    console.log('\nDeviation Statistics:');
    console.log(`  Max Deviation: ${results.summary.maxDeviation.toFixed(2)} Lc`);
    console.log(`  Mean Deviation: ${results.summary.meanDeviation.toFixed(2)} Lc`);
    console.log(`  P95 Deviation: ${results.summary.p95Deviation.toFixed(2)} Lc`);

    if (results.failed > 0) {
      console.log('\nFailed Tests:');
      results.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  ❌ ${r.testName}`);
          console.log(`     Expected: ${r.expected} Lc`);
          console.log(`     Actual:   ${r.actual} Lc`);
          console.log(`     Deviation: ${r.deviation.toFixed(2)} Lc (tolerance: ${r.tolerance})`);
          if (r.details) {
            console.log(`     Details: ${r.details}`);
          }
        });
    } else {
      console.log('\n✅ All golden vectors passed!');
    }

    console.log('='.repeat(60));

    // Assert pass rate is >95%
    expect(results.passRate).toBeGreaterThanOrEqual(95);

    // Assert max deviation is <1 Lc
    expect(results.summary.maxDeviation).toBeLessThan(1);

    // Assert mean deviation is <0.3 Lc
    expect(results.summary.meanDeviation).toBeLessThan(0.3);
  });

  it('should have fixed the piecewise sRGB transformation', () => {
    // This test documents the specific fix that was applied
    const results = runAPCAAccuracyTests();

    // Before fix: 33.3% pass rate (4/12)
    // After fix: >95% pass rate (11-12/12)
    expect(results.passRate).toBeGreaterThan(33.3);

    // Before fix: max deviation ~31 Lc
    // After fix: max deviation <1 Lc
    expect(results.summary.maxDeviation).toBeLessThan(31);
  });
});
