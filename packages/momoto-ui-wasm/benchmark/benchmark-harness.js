/**
 * @fileoverview Honest Benchmark Harness for Momoto
 *
 * This harness is designed to defeat JIT optimizations and provide
 * accurate, reliable performance measurements.
 *
 * Anti-optimization techniques:
 * - globalThis.__benchSink: prevents dead code elimination
 * - Variable inputs: prevents constant folding
 * - Multiple runs: statistical analysis with median
 * - Sanity checks: automatic detection of suspicious results
 *
 * @version 2.0.0 (Honest Edition)
 */

// ============================================================================
// ANTI-OPTIMIZATION SINK
// ============================================================================

/**
 * Global sink that JIT cannot eliminate.
 * All benchmark results MUST flow through this.
 */
if (!globalThis.__benchSink) {
  globalThis.__benchSink = 0;
}

/**
 * Force the JIT to keep __benchSink alive by actually using it.
 * This function READS from the sink, preventing dead code elimination.
 */
function keepSinkAlive() {
  // The JIT cannot prove this will never execute, so it must keep the sink
  if (globalThis.__benchSink > 1e308) {
    // Create a side effect - never executes but JIT can't eliminate
    console.log('sink overflow:', globalThis.__benchSink);
    globalThis.__benchSink = 0; // Reset
  }
  // Return the sink to force the read
  return globalThis.__benchSink;
}

// ============================================================================
// BASELINE MEASUREMENTS
// ============================================================================

/**
 * Measure Math.random() as sanity check baseline.
 * Expected: 20-50ns on modern hardware.
 * If this is < 10ns or > 100ns, something is wrong.
 */
function measureBaseline() {
  const runs = 10000;
  const times = [];

  // Warmup
  for (let i = 0; i < 1000; i++) {
    globalThis.__benchSink += Math.random();
  }

  // Measure
  for (let run = 0; run < runs; run++) {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      globalThis.__benchSink += Math.random();
    }
    const end = performance.now();
    times.push((end - start) * 1000000 / 100); // ns per call
  }

  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];

  return {
    median_ns: median,
    healthy: median >= 10 && median <= 100,
    warning: median < 10 ? 'Timer resolution too low' : median > 100 ? 'System under load' : null
  };
}

// ============================================================================
// CORE BENCHMARK FUNCTION
// ============================================================================

/**
 * Run an honest benchmark with anti-optimizations.
 *
 * @param {string} name - Benchmark name
 * @param {Function} fn - Function to benchmark. MUST return a value that gets accumulated.
 * @param {Object} options - Configuration
 * @param {number} options.warmupRuns - Warmup iterations (default: 100)
 * @param {number} options.measuredRuns - Measured iterations (default: 1000)
 * @param {number} options.batchSize - Iterations per timing sample (default: 1)
 * @param {Function} options.inputGenerator - Function to generate varied inputs (i) => input
 * @returns {BenchmarkResult}
 */
function benchmark(name, fn, options = {}) {
  const {
    warmupRuns = 100,
    measuredRuns = 1000,
    batchSize = 1,
    inputGenerator = (i) => i, // Default: use index as input
  } = options;

  // Warmup - critical to let JIT warm up but results discarded
  for (let i = 0; i < warmupRuns; i++) {
    const input = inputGenerator(i);
    const result = fn(input);
    globalThis.__benchSink += (typeof result === 'number' ? result : 1);
  }

  // Force reading the sink after warmup - prevents JIT from eliminating all writes
  keepSinkAlive();

  // Measured runs - collect timing samples
  const times = [];

  for (let run = 0; run < measuredRuns; run++) {
    const start = performance.now();

    for (let i = 0; i < batchSize; i++) {
      const input = inputGenerator(run * batchSize + i);
      const result = fn(input);
      globalThis.__benchSink += (typeof result === 'number' ? result : 1);
    }

    const end = performance.now();
    const timeMs = (end - start) / batchSize; // Average time per call in this batch
    times.push(timeMs);
  }

  // Force reading the sink after measurements - this is CRITICAL
  // The JIT cannot eliminate any writes if we read the value here
  const finalSink = keepSinkAlive();

  // Statistical analysis
  times.sort((a, b) => a - b);

  const median = times[Math.floor(times.length / 2)];
  const min = times[0];
  const max = times[times.length - 1];
  const mean = times.reduce((sum, t) => sum + t, 0) / times.length;

  // Standard deviation
  const variance = times.reduce((sum, t) => sum + (t - mean) ** 2, 0) / times.length;
  const stddev = Math.sqrt(variance);

  // Coefficient of variation (relative stability)
  const cv = mean > 0 ? (stddev / mean) * 100 : 0;

  // Sanity checks
  const suspicious = median < 0.0001; // < 0.1µs (100ns) is suspicious for WASM calls
  const unstable = cv > 20; // CV > 20% means high variance

  return {
    name,
    median_ms: median,
    mean_ms: mean,
    min_ms: min,
    max_ms: max,
    stddev_ms: stddev,
    cv_percent: cv,
    suspicious,
    unstable,
    runs: measuredRuns,
    batchSize,
    totalSamples: measuredRuns * batchSize,
    _sinkValue: finalSink // Include sink to force JIT to keep it
  };
}

// ============================================================================
// COMPARISON BENCHMARK
// ============================================================================

/**
 * Compare two functions and compute speedup.
 *
 * @param {string} nameA - Name of baseline
 * @param {Function} fnA - Baseline function
 * @param {string} nameB - Name of optimized
 * @param {Function} fnB - Optimized function
 * @param {Object} options - Benchmark options
 * @returns {ComparisonResult}
 */
function benchmarkComparison(nameA, fnA, nameB, fnB, options = {}) {
  const resultA = benchmark(nameA, fnA, options);
  const resultB = benchmark(nameB, fnB, options);

  const speedup = resultA.median_ms / resultB.median_ms;
  const speedupMin = resultA.max_ms / resultB.min_ms; // Conservative estimate
  const speedupMax = resultA.min_ms / resultB.max_ms; // Optimistic estimate

  return {
    baseline: resultA,
    optimized: resultB,
    speedup_median: speedup,
    speedup_min: speedupMin,
    speedup_max: speedupMax,
    speedup_reliable: speedupMax / speedupMin > 0.8, // Less than 25% variance
  };
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format time with appropriate units.
 */
function formatTime(ms) {
  if (ms < 0.000001) return `${(ms * 1000000000).toFixed(2)}ps`;
  if (ms < 0.001) return `${(ms * 1000000).toFixed(2)}ns`;
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format number with thousands separators.
 */
function formatNumber(n) {
  return Math.floor(n).toLocaleString('en-US');
}

/**
 * Format percentage.
 */
function formatPercent(p) {
  return `${p.toFixed(1)}%`;
}

/**
 * Format speedup with color coding.
 */
function formatSpeedup(speedup) {
  if (speedup === Infinity) return '∞x (SUSPICIOUS!)';
  if (speedup < 0.5) return `${speedup.toFixed(2)}x (SLOWER!)`;
  if (speedup < 1.5) return `${speedup.toFixed(2)}x (no change)`;
  if (speedup < 3) return `${speedup.toFixed(2)}x`;
  if (speedup < 7) return `${speedup.toFixed(1)}x`;
  return `${speedup.toFixed(1)}x`;
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Generate a detailed report for a benchmark result.
 */
function reportBenchmark(result) {
  const lines = [];

  lines.push(`${result.name}`);
  lines.push(`  Median: ${formatTime(result.median_ms)}`);
  lines.push(`  Range: ${formatTime(result.min_ms)} - ${formatTime(result.max_ms)}`);
  lines.push(`  σ: ${formatTime(result.stddev_ms)} (CV: ${formatPercent(result.cv_percent)})`);
  lines.push(`  Runs: ${result.runs} × ${result.batchSize} = ${formatNumber(result.totalSamples)} samples`);

  // Warnings
  if (result.suspicious) {
    lines.push(`  ⚠️  SUSPICIOUS: Time too low (< 100ns), may indicate JIT elimination`);
  }
  if (result.unstable) {
    lines.push(`  ⚠️  UNSTABLE: High variance (CV > 20%), results may not be reliable`);
  }

  return lines.join('\n');
}

/**
 * Generate a comparison report.
 */
function reportComparison(comparison) {
  const lines = [];

  lines.push(`Baseline: ${comparison.baseline.name}`);
  lines.push(`  Median: ${formatTime(comparison.baseline.median_ms)}`);
  lines.push('');
  lines.push(`Optimized: ${comparison.optimized.name}`);
  lines.push(`  Median: ${formatTime(comparison.optimized.median_ms)}`);
  lines.push('');
  lines.push(`Speedup: ${formatSpeedup(comparison.speedup_median)}`);
  lines.push(`  Range: ${formatSpeedup(comparison.speedup_min)} - ${formatSpeedup(comparison.speedup_max)}`);

  if (!comparison.speedup_reliable) {
    lines.push(`  ⚠️  WARNING: Large variance in speedup, results may not be reliable`);
  }

  return lines.join('\n');
}

/**
 * Validate results against targets.
 *
 * @param {BenchmarkResult} result - Benchmark result
 * @param {number} targetMs - Target time in ms
 * @param {string} comparison - 'less' or 'greater'
 * @returns {ValidationResult}
 */
function validateTarget(result, targetMs, comparison = 'less') {
  const passed = comparison === 'less'
    ? result.median_ms < targetMs
    : result.median_ms > targetMs;

  const margin = Math.abs((result.median_ms - targetMs) / targetMs) * 100;

  return {
    passed,
    target: targetMs,
    actual: result.median_ms,
    margin_percent: margin,
    status: passed ? 'PASS' : 'FAIL'
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    benchmark,
    benchmarkComparison,
    measureBaseline,
    formatTime,
    formatNumber,
    formatPercent,
    formatSpeedup,
    reportBenchmark,
    reportComparison,
    validateTarget,
  };
}

// Also expose globally for browser usage
if (typeof window !== 'undefined') {
  window.BenchmarkHarness = {
    benchmark,
    benchmarkComparison,
    measureBaseline,
    formatTime,
    formatNumber,
    formatPercent,
    formatSpeedup,
    reportBenchmark,
    reportComparison,
    validateTarget,
  };
}
