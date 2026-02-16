/**
 * @fileoverview Baseline Benchmarks for Sanity Checks
 *
 * These benchmarks establish baselines for known operations
 * to validate that the benchmark harness is working correctly.
 *
 * If these show suspicious results, the entire benchmark suite
 * is compromised.
 */

/**
 * Run baseline sanity checks.
 *
 * @param {Object} harness - BenchmarkHarness
 * @returns {BaselineResults}
 */
function runBaselineChecks(harness) {
  console.log('\n' + '═'.repeat(80));
  console.log('BASELINE SANITY CHECKS');
  console.log('═'.repeat(80));
  console.log('These establish known-good performance numbers for validation.');
  console.log('');

  const results = {};

  // 1. Math.random() - Expected: 20-50ns
  results.mathRandom = harness.benchmark(
    'Math.random()',
    (i) => {
      return Math.random();
    },
    {
      warmupRuns: 1000,
      measuredRuns: 5000,
      batchSize: 100, // Batch for accuracy
      inputGenerator: (i) => i % 1000, // Vary to prevent optimization
    }
  );

  console.log(harness.reportBenchmark(results.mathRandom));
  console.log('');

  // Validate Math.random()
  const mathRandomHealthy = results.mathRandom.median_ms * 1000 >= 10 &&
                            results.mathRandom.median_ms * 1000 <= 100;
  if (!mathRandomHealthy) {
    console.log('⚠️  WARNING: Math.random() outside expected range (20-50ns)');
    console.log('   Timer resolution may be insufficient or system under load');
  } else {
    console.log('✓ Math.random() baseline healthy');
  }
  console.log('');

  // 2. Simple arithmetic - Expected: < 5ns (nearly free)
  results.simpleArithmetic = harness.benchmark(
    'Simple arithmetic (a + b * c)',
    (i) => {
      const a = i * 0.7;
      const b = i * 1.3;
      const c = i * 2.1;
      return a + b * c;
    },
    {
      warmupRuns: 1000,
      measuredRuns: 5000,
      batchSize: 100,
      inputGenerator: (i) => i % 1000,
    }
  );

  console.log(harness.reportBenchmark(results.simpleArithmetic));
  console.log('');

  // 3. Math.sqrt() - Expected: 5-15ns
  results.mathSqrt = harness.benchmark(
    'Math.sqrt()',
    (i) => {
      return Math.sqrt(i * 1.7 + 1);
    },
    {
      warmupRuns: 1000,
      measuredRuns: 5000,
      batchSize: 100,
      inputGenerator: (i) => i % 1000,
    }
  );

  console.log(harness.reportBenchmark(results.mathSqrt));
  console.log('');

  // 4. Math.pow() - Expected: 10-30ns
  results.mathPow = harness.benchmark(
    'Math.pow()',
    (i) => {
      return Math.pow(i * 0.01 + 1.5, 2.5);
    },
    {
      warmupRuns: 1000,
      measuredRuns: 5000,
      batchSize: 100,
      inputGenerator: (i) => i % 1000,
    }
  );

  console.log(harness.reportBenchmark(results.mathPow));
  console.log('');

  // 5. Array access - Expected: < 5ns
  const testArray = new Float64Array(1000);
  for (let i = 0; i < testArray.length; i++) {
    testArray[i] = Math.random();
  }

  results.arrayAccess = harness.benchmark(
    'Float64Array access',
    (i) => {
      return testArray[i % 1000];
    },
    {
      warmupRuns: 1000,
      measuredRuns: 5000,
      batchSize: 100,
      inputGenerator: (i) => i % 1000,
    }
  );

  console.log(harness.reportBenchmark(results.arrayAccess));
  console.log('');

  // Overall health check
  console.log('─'.repeat(80));
  console.log('BASELINE HEALTH CHECK:');
  const allHealthy = mathRandomHealthy &&
                     !results.mathRandom.suspicious &&
                     !results.mathRandom.unstable;

  if (allHealthy) {
    console.log('✓ All baselines healthy - benchmark harness is working correctly');
  } else {
    console.log('⚠️  Some baselines unhealthy - results may not be reliable');
    console.log('   Consider:');
    console.log('   - Closing background applications');
    console.log('   - Disabling browser extensions');
    console.log('   - Using Chrome DevTools Performance CPU throttling: "No throttling"');
  }
  console.log('═'.repeat(80));
  console.log('');

  return {
    results,
    healthy: allHealthy,
  };
}

// Export for browser
if (typeof window !== 'undefined') {
  window.BaselineBenchmarks = {
    runBaselineChecks,
  };
}
