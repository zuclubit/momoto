#!/usr/bin/env node

// Quick script to test APCA accuracy after fix
import { runAPCAAccuracyTests } from './benchmark/suites/accuracy.benchmark.ts';

const results = runAPCAAccuracyTests();

console.log('\n='.repeat(60));
console.log('APCA ACCURACY TEST RESULTS (After Fix)');
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
      console.log(`  - ${r.testName}: expected ${r.expected}, got ${r.actual} (Δ ${r.deviation.toFixed(2)})`);
    });
}

console.log('='.repeat(60));

// Exit code based on pass rate
process.exit(results.passRate >= 95 ? 0 : 1);
