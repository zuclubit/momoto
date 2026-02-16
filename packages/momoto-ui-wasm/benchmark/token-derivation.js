/**
 * Token Derivation Performance Benchmark
 *
 * Compares WASM vs TypeScript token derivation performance
 */

import { TokenDerivationEngine, isWasmEnabled, getWasmStatus } from '../src/index.ts';

// Benchmark configuration
const ITERATIONS = 10000;
const WARMUP_ITERATIONS = 1000;

// Test data
const testColors = [
  { l: 0.5, c: 0.1, h: 180.0 },  // Cyan
  { l: 0.6, c: 0.15, h: 30.0 },   // Orange
  { l: 0.4, c: 0.12, h: 140.0 },  // Green
  { l: 0.55, c: 0.18, h: 300.0 }, // Purple
  { l: 0.45, c: 0.14, h: 0.0 },   // Red
];

/**
 * Run benchmark
 */
async function runBenchmark() {
  console.log('🚀 Token Derivation Performance Benchmark\n');

  // Check WASM status
  const status = getWasmStatus();
  console.log(`Backend: ${status.backend.toUpperCase()}`);
  console.log(`WASM Enabled: ${status.enabled}`);
  if (status.error) {
    console.log(`WASM Error: ${status.error.message}`);
  }
  console.log('');

  // Create engine
  const engine = new TokenDerivationEngine();

  // Warmup
  console.log(`Warming up (${WARMUP_ITERATIONS} iterations)...`);
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    const color = testColors[i % testColors.length];
    engine.deriveStates(color.l, color.c, color.h);
  }
  console.log('Warmup complete.\n');

  // Benchmark: Cold cache
  console.log('📊 Benchmark: Cold Cache');
  console.log('─'.repeat(50));

  engine.clearCache();
  const coldStart = performance.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const color = testColors[i % testColors.length];
    engine.deriveStates(color.l, color.c, color.h);
  }

  const coldEnd = performance.now();
  const coldTime = coldEnd - coldStart;
  const coldAvg = coldTime / ITERATIONS;

  console.log(`Total time: ${coldTime.toFixed(2)}ms`);
  console.log(`Average per call: ${coldAvg.toFixed(4)}ms`);
  console.log(`Throughput: ${(ITERATIONS / coldTime * 1000).toFixed(0)} ops/sec`);
  console.log(`Cache size: ${engine.getCacheSize()}\n`);

  // Benchmark: Hot cache (cache hits)
  console.log('📊 Benchmark: Hot Cache (Cache Hits)');
  console.log('─'.repeat(50));

  const hotStart = performance.now();

  for (let i = 0; i < ITERATIONS; i++) {
    const color = testColors[i % testColors.length];
    engine.deriveStates(color.l, color.c, color.h);
  }

  const hotEnd = performance.now();
  const hotTime = hotEnd - hotStart;
  const hotAvg = hotTime / ITERATIONS;

  console.log(`Total time: ${hotTime.toFixed(2)}ms`);
  console.log(`Average per call: ${hotAvg.toFixed(4)}ms`);
  console.log(`Throughput: ${(ITERATIONS / hotTime * 1000).toFixed(0)} ops/sec`);
  console.log(`Cache size: ${engine.getCacheSize()}\n`);

  // Summary
  console.log('📈 Summary');
  console.log('─'.repeat(50));
  console.log(`Cold cache: ${coldAvg.toFixed(4)}ms per call`);
  console.log(`Hot cache: ${hotAvg.toFixed(4)}ms per call`);
  console.log(`Speedup (hot vs cold): ${(coldAvg / hotAvg).toFixed(1)}x faster`);

  if (status.backend === 'wasm') {
    console.log(`\n✅ WASM is ${(coldAvg / hotAvg).toFixed(1)}x faster with cache hits!`);
  } else {
    console.log('\n⚠️  Running on TypeScript fallback (WASM not available)');
  }
}

// Run benchmark
runBenchmark().catch(console.error);
