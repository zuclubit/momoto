/**
 * @fileoverview LUT Performance Benchmarks
 *
 * Measures performance of Fresnel and Beer-Lambert LUT functions.
 *
 * Targets:
 * - fresnelFast: < 1µs
 * - beerLambertFast: < 1µs
 * - LUT memory: < 1MB
 */

/**
 * Run LUT performance benchmarks.
 *
 * @param {Object} harness - BenchmarkHarness
 * @param {Function} fresnelFast - Fresnel LUT function from WASM
 * @param {Function} beerLambertFast - Beer-Lambert LUT function from WASM
 * @param {Function} totalLutMemory - Memory query function from WASM
 * @returns {LUTBenchmarkResults}
 */
function runLUTBenchmarks(harness, fresnelFast, beerLambertFast, totalLutMemory) {
  console.log('\n' + '═'.repeat(80));
  console.log('LUT FUNCTIONS PERFORMANCE');
  console.log('═'.repeat(80));
  console.log('Testing fast approximations using lookup tables.');
  console.log('');

  const results = {};

  // ============================================================================
  // 1. FRESNEL FAST
  // ============================================================================

  console.log('1. fresnelFast(ior, cos_theta)');
  console.log('   Target: < 1µs (1000ns)');
  console.log('');

  // Generate varied inputs to prevent constant folding
  const iorValues = [1.0, 1.3, 1.5, 1.7, 2.0, 2.5];
  const cosThetaValues = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];

  results.fresnelFast = harness.benchmark(
    'fresnelFast(ior, cos_theta)',
    (i) => {
      const ior = iorValues[i % iorValues.length];
      const cosTheta = cosThetaValues[(i * 7) % cosThetaValues.length]; // Prime for distribution
      return fresnelFast(ior, cosTheta);
    },
    {
      warmupRuns: 1000,
      measuredRuns: 5000,
      batchSize: 100, // Batch 100 calls per timing sample for accuracy
      inputGenerator: (i) => i,
    }
  );

  console.log(harness.reportBenchmark(results.fresnelFast));
  console.log('');

  // Validate against target
  const fresnelTarget = harness.validateTarget(results.fresnelFast, 0.001, 'less'); // < 1µs = 0.001ms
  console.log(`Target Validation: ${fresnelTarget.status}`);
  console.log(`  Target: < ${harness.formatTime(fresnelTarget.target)}`);
  console.log(`  Actual: ${harness.formatTime(fresnelTarget.actual)}`);
  console.log(`  Margin: ${fresnelTarget.passed ? '-' : '+'}${harness.formatPercent(fresnelTarget.margin_percent)}`);
  console.log('');

  // ============================================================================
  // 2. BEER-LAMBERT FAST
  // ============================================================================

  console.log('2. beerLambertFast(absorption, distance)');
  console.log('   Target: < 1µs (1000ns)');
  console.log('');

  // Generate varied inputs
  const absorptionValues = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
  const distanceValues = [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0];

  results.beerLambertFast = harness.benchmark(
    'beerLambertFast(absorption, distance)',
    (i) => {
      const absorption = absorptionValues[i % absorptionValues.length];
      const distance = distanceValues[(i * 11) % distanceValues.length]; // Prime for distribution
      return beerLambertFast(absorption, distance);
    },
    {
      warmupRuns: 1000,
      measuredRuns: 5000,
      batchSize: 100,
      inputGenerator: (i) => i,
    }
  );

  console.log(harness.reportBenchmark(results.beerLambertFast));
  console.log('');

  // Validate against target
  const beerTarget = harness.validateTarget(results.beerLambertFast, 0.001, 'less');
  console.log(`Target Validation: ${beerTarget.status}`);
  console.log(`  Target: < ${harness.formatTime(beerTarget.target)}`);
  console.log(`  Actual: ${harness.formatTime(beerTarget.actual)}`);
  console.log(`  Margin: ${beerTarget.passed ? '-' : '+'}${harness.formatPercent(beerTarget.margin_percent)}`);
  console.log('');

  // ============================================================================
  // 3. MEMORY USAGE
  // ============================================================================

  console.log('3. LUT Memory Footprint');
  console.log('   Target: < 1MB (1,048,576 bytes)');
  console.log('');

  const lutMemory = totalLutMemory();
  results.lutMemory = lutMemory;

  const memoryTarget = lutMemory < 1024 * 1024;
  console.log(`  Total LUT Memory: ${(lutMemory / 1024).toFixed(2)} KB`);
  console.log(`  Status: ${memoryTarget ? 'PASS ✓' : 'FAIL ✗'}`);
  console.log('');

  // ============================================================================
  // SUMMARY
  // ============================================================================

  console.log('─'.repeat(80));
  console.log('LUT PERFORMANCE SUMMARY:');
  console.log('');

  const allPassed = fresnelTarget.passed && beerTarget.passed && memoryTarget;

  console.log(`  fresnelFast:      ${fresnelTarget.status} (${harness.formatTime(results.fresnelFast.median_ms)})`);
  console.log(`  beerLambertFast:  ${beerTarget.status} (${harness.formatTime(results.beerLambertFast.median_ms)})`);
  console.log(`  LUT memory:       ${memoryTarget ? 'PASS' : 'FAIL'} (${(lutMemory / 1024).toFixed(2)} KB)`);
  console.log('');

  if (allPassed) {
    console.log('✓ All LUT targets MET');
  } else {
    console.log('✗ Some LUT targets NOT MET');
  }

  console.log('═'.repeat(80));
  console.log('');

  return {
    results,
    targets: {
      fresnelFast: fresnelTarget,
      beerLambertFast: beerTarget,
      lutMemory: memoryTarget,
    },
    allPassed,
  };
}

// Export for browser
if (typeof window !== 'undefined') {
  window.LUTBenchmarks = {
    runLUTBenchmarks,
  };
}
