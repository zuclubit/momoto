/**
 * APCA WASM Performance Benchmark - FASE 3
 *
 * Measures performance improvement of Rust/WASM vs TypeScript
 * Target: ≥6x speedup
 *
 * Date: 2026-01-06
 */

import { performance } from 'perf_hooks';
import { apca_contrast } from '../../wasm/apca_wasm';

// TypeScript reference implementation
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
  const rLinTxt = Math.pow(fg_r / 255, APCA.mainTRC);
  const gLinTxt = Math.pow(fg_g / 255, APCA.mainTRC);
  const bLinTxt = Math.pow(fg_b / 255, APCA.mainTRC);
  let textY = APCA.sRco * rLinTxt + APCA.sGco * gLinTxt + APCA.sBco * bLinTxt;

  const rLinBg = Math.pow(bg_r / 255, APCA.mainTRC);
  const gLinBg = Math.pow(bg_g / 255, APCA.mainTRC);
  const bLinBg = Math.pow(bg_b / 255, APCA.mainTRC);
  let backY = APCA.sRco * rLinBg + APCA.sGco * gLinBg + APCA.sBco * bLinBg;

  textY = textY > APCA.blkThrs ? textY : textY + Math.pow(APCA.blkThrs - textY, APCA.blkClmp);
  backY = backY > APCA.blkThrs ? backY : backY + Math.pow(APCA.blkThrs - backY, APCA.blkClmp);

  if (Math.abs(backY - textY) < APCA.deltaYmin) {
    return 0.0;
  }

  const isDarkOnLight = backY > textY;

  let SAPC: number;
  if (isDarkOnLight) {
    SAPC = (Math.pow(backY, APCA.normBG) - Math.pow(textY, APCA.normTXT)) * APCA.scaleBoW;
  } else {
    SAPC = (Math.pow(backY, APCA.revBG) - Math.pow(textY, APCA.revTXT)) * APCA.scaleWoB;
  }

  let outputContrast: number;
  if (isDarkOnLight) {
    outputContrast = (SAPC < APCA.loClip) ? 0 : SAPC - APCA.loBoWoffset;
  } else {
    outputContrast = (SAPC > -APCA.loClip) ? 0 : SAPC + APCA.loWoBoffset;
  }

  return outputContrast * 100;
}

// Generate test data
function generateTestData(count: number): Array<[number, number, number, number, number, number]> {
  const data: Array<[number, number, number, number, number, number]> = [];
  for (let i = 0; i < count; i++) {
    data.push([
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ]);
  }
  return data;
}

interface BenchmarkResult {
  name: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  opsPerSecond: number;
}

function benchmarkTypeScript(testData: Array<[number, number, number, number, number, number]>): BenchmarkResult {
  const start = performance.now();

  for (const [fg_r, fg_g, fg_b, bg_r, bg_g, bg_b] of testData) {
    calculateAPCATypeScript(fg_r, fg_g, fg_b, bg_r, bg_g, bg_b);
  }

  const end = performance.now();
  const totalTime = end - start;

  return {
    name: 'TypeScript',
    iterations: testData.length,
    totalTime,
    avgTime: totalTime / testData.length,
    opsPerSecond: (testData.length / totalTime) * 1000,
  };
}

function benchmarkWasm(testData: Array<[number, number, number, number, number, number]>): BenchmarkResult {
  const start = performance.now();

  for (const [fg_r, fg_g, fg_b, bg_r, bg_g, bg_b] of testData) {
    apca_contrast(fg_r, fg_g, fg_b, bg_r, bg_g, bg_b);
  }

  const end = performance.now();
  const totalTime = end - start;

  return {
    name: 'WASM',
    iterations: testData.length,
    totalTime,
    avgTime: totalTime / testData.length,
    opsPerSecond: (testData.length / totalTime) * 1000,
  };
}

export function runPerformanceBenchmark(iterations: number = 100_000): void {
  console.log('\n' + '='.repeat(70));
  console.log('APCA PERFORMANCE BENCHMARK - TypeScript vs Rust/WASM');
  console.log('='.repeat(70));
  console.log(`Iterations: ${iterations.toLocaleString()}`);
  console.log('Target: ≥6x speedup\n');

  const testData = generateTestData(iterations);

  // Warm-up (JIT optimization)
  console.log('Warming up...');
  const warmupData = generateTestData(1000);
  benchmarkTypeScript(warmupData);
  benchmarkWasm(warmupData);

  console.log('Running benchmarks...\n');

  // Run TypeScript benchmark
  const tsResult = benchmarkTypeScript(testData);

  // Run WASM benchmark
  const wasmResult = benchmarkWasm(testData);

  // Calculate speedup
  const speedup = tsResult.totalTime / wasmResult.totalTime;

  // Print results
  console.log('─'.repeat(70));
  console.log('RESULTS:');
  console.log('─'.repeat(70));

  console.log(`\nTypeScript Implementation:`);
  console.log(`  Total Time:       ${tsResult.totalTime.toFixed(2)} ms`);
  console.log(`  Avg Time/Op:      ${(tsResult.avgTime * 1000).toFixed(3)} µs`);
  console.log(`  Ops/Second:       ${Math.floor(tsResult.opsPerSecond).toLocaleString()}`);

  console.log(`\nRust/WASM Implementation:`);
  console.log(`  Total Time:       ${wasmResult.totalTime.toFixed(2)} ms`);
  console.log(`  Avg Time/Op:      ${(wasmResult.avgTime * 1000).toFixed(3)} µs`);
  console.log(`  Ops/Second:       ${Math.floor(wasmResult.opsPerSecond).toLocaleString()}`);

  console.log(`\nPerformance Improvement:`);
  console.log(`  Speedup:          ${speedup.toFixed(2)}x`);
  console.log(`  Time Reduction:   ${((1 - (wasmResult.totalTime / tsResult.totalTime)) * 100).toFixed(1)}%`);

  console.log('\n' + '─'.repeat(70));

  if (speedup >= 6) {
    console.log(`✅ SUCCESS: ${speedup.toFixed(2)}x speedup (exceeds 6x target)`);
  } else if (speedup >= 3) {
    console.log(`⚠️  PARTIAL: ${speedup.toFixed(2)}x speedup (below 6x target, but significant)`);
  } else {
    console.log(`❌ FAIL: ${speedup.toFixed(2)}x speedup (below 6x target)`);
  }

  console.log('='.repeat(70) + '\n');
}

// Run benchmark with different iteration counts
export function runComprehensiveBenchmark(): void {
  console.log('\n' + '█'.repeat(70));
  console.log('COMPREHENSIVE APCA PERFORMANCE ANALYSIS');
  console.log('█'.repeat(70));

  const testSizes = [
    { name: 'Small (1K)', size: 1_000 },
    { name: 'Medium (10K)', size: 10_000 },
    { name: 'Large (100K)', size: 100_000 },
    { name: 'XLarge (1M)', size: 1_000_000 },
  ];

  for (const test of testSizes) {
    console.log(`\n${'▬'.repeat(70)}`);
    console.log(`TEST: ${test.name} - ${test.size.toLocaleString()} iterations`);
    console.log('▬'.repeat(70));

    const testData = generateTestData(test.size);

    const tsResult = benchmarkTypeScript(testData);
    const wasmResult = benchmarkWasm(testData);
    const speedup = tsResult.totalTime / wasmResult.totalTime;

    console.log(`TypeScript: ${tsResult.totalTime.toFixed(2)} ms`);
    console.log(`WASM:       ${wasmResult.totalTime.toFixed(2)} ms`);
    console.log(`Speedup:    ${speedup.toFixed(2)}x ${speedup >= 6 ? '✅' : speedup >= 3 ? '⚠️' : '❌'}`);
  }

  console.log('\n' + '█'.repeat(70) + '\n');
}

// Self-executing benchmark
if (require.main === module) {
  runPerformanceBenchmark(100_000);
  runComprehensiveBenchmark();
}

export default {
  runPerformanceBenchmark,
  runComprehensiveBenchmark,
};
