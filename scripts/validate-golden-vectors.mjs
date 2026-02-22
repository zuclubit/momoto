/**
 * Golden Vector Validation Script - FASE 3 Tarea 1
 *
 * Purpose: Validate golden test vectors against canonical apca-w3 npm package
 * to determine if the expected values in our test vectors are correct.
 *
 * This is CRITICAL because FASE 2 showed 33.3% accuracy after fixing all bugs,
 * suggesting either:
 * 1. Golden vectors are wrong
 * 2. Our implementation has deeper issues
 *
 * Date: 2026-01-06
 * Phase: FASE 3 - Rust/WASM Migration - Preliminary Investigation
 */

import { APCAcontrast, sRGBtoY } from 'apca-w3';
import { colorParsley } from 'colorparsley';

// Golden vectors from our test suite
const GOLDEN_VECTORS = [
  {
    name: 'Black on White',
    foreground: '#000000',
    background: '#FFFFFF',
    expected: { lc: 106.04, tolerance: 0.5 },
  },
  {
    name: 'White on Black',
    foreground: '#FFFFFF',
    background: '#000000',
    expected: { lc: -107.89, tolerance: 0.5 },
  },
  {
    name: 'Mid Gray on White',
    foreground: '#888888',
    background: '#FFFFFF',
    expected: { lc: 63.06, tolerance: 0.5 },
  },
  {
    name: 'Mid Gray on Black',
    foreground: '#888888',
    background: '#000000',
    expected: { lc: -68.54, tolerance: 0.5 },
  },
  {
    name: 'Blue on White',
    foreground: '#0000FF',
    background: '#FFFFFF',
    expected: { lc: 54.62, tolerance: 0.5 },
  },
  {
    name: 'Teal on Cream',
    foreground: '#112233',
    background: '#DDEEFF',
    expected: { lc: 91.34, tolerance: 0.5 },
  },
  {
    name: 'Yellow on Black',
    foreground: '#FFFF00',
    background: '#000000',
    expected: { lc: -91.67, tolerance: 1.0 },
  },
  {
    name: 'Yellow on White',
    foreground: '#FFFF00',
    background: '#FFFFFF',
    expected: { lc: 7.51, tolerance: 1.0 },
  },
  {
    name: 'Dark Navy on Darker Navy',
    foreground: '#223344',
    background: '#112233',
    expected: { lc: -6.77, tolerance: 1.0 },
  },
  {
    name: 'Near Black on Black',
    foreground: '#050505',
    background: '#000000',
    expected: { lc: -2.18, tolerance: 1.0 },
  },
  {
    name: 'AA Normal Text Threshold',
    foreground: '#595959',
    background: '#FFFFFF',
    expected: { lc: 74.18, tolerance: 0.5 },
  },
  {
    name: 'AAA Normal Text Threshold',
    foreground: '#3D3D3D',
    background: '#FFFFFF',
    expected: { lc: 86.48, tolerance: 0.5 },
  },
];

console.log('═'.repeat(70));
console.log('GOLDEN VECTOR VALIDATION - FASE 3 Tarea 1');
console.log('═'.repeat(70));
console.log('\nValidating golden vectors against canonical apca-w3 npm package\n');
console.log('Purpose: Determine if 33.3% FASE 2 accuracy is due to wrong vectors\n');
console.log('─'.repeat(70));

const results = [];
let passed = 0;
let failed = 0;
const deviations = [];

for (const vector of GOLDEN_VECTORS) {
  // Parse hex colors to rgba arrays using colorParsley
  const txtColor = colorParsley(vector.foreground);
  const bgColor = colorParsley(vector.background);

  // Convert to luminance using sRGBtoY
  const txtY = sRGBtoY(txtColor);
  const bgY = sRGBtoY(bgColor);

  // Run canonical implementation
  // Note: APCAcontrast expects (textY, backgroundY) in that order
  const canonicalLc = APCAcontrast(txtY, bgY);

  // Parse result - APCAcontrast returns a string like "Lc 106.0" or just the number
  const parsedLc = typeof canonicalLc === 'string'
    ? parseFloat(canonicalLc.replace('Lc', '').trim())
    : canonicalLc;

  const deviation = Math.abs(parsedLc - vector.expected.lc);
  const isPassed = deviation <= vector.expected.tolerance;

  deviations.push(deviation);

  if (isPassed) {
    passed++;
  } else {
    failed++;
  }

  results.push({
    name: vector.name,
    foreground: vector.foreground,
    background: vector.background,
    expectedLc: vector.expected.lc,
    canonicalLc: parsedLc,
    deviation,
    tolerance: vector.expected.tolerance,
    passed: isPassed,
  });
}

// Print results
console.log('\nRESULTS:\n');

for (const result of results) {
  const status = result.passed ? '✅' : '❌';
  console.log(`${status} ${result.name}`);
  console.log(`   Foreground: ${result.foreground} | Background: ${result.background}`);
  console.log(`   Expected:   ${result.expectedLc.toFixed(2)} Lc`);
  console.log(`   Canonical:  ${result.canonicalLc.toFixed(2)} Lc`);
  console.log(`   Deviation:  ${result.deviation.toFixed(2)} Lc (tolerance: ${result.tolerance})`);

  if (!result.passed) {
    const percentDiff = ((result.deviation / Math.abs(result.expectedLc)) * 100).toFixed(1);
    console.log(`   ⚠️  MISMATCH: ${percentDiff}% difference`);
  }
  console.log('');
}

// Summary statistics
const maxDeviation = Math.max(...deviations, 0);
const meanDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;
const passRate = (passed / results.length) * 100;

console.log('─'.repeat(70));
console.log('SUMMARY:');
console.log('─'.repeat(70));
console.log(`Total Vectors:   ${results.length}`);
console.log(`Passed:          ${passed}`);
console.log(`Failed:          ${failed}`);
console.log(`Pass Rate:       ${passRate.toFixed(1)}%`);
console.log(`Max Deviation:   ${maxDeviation.toFixed(2)} Lc`);
console.log(`Mean Deviation:  ${meanDeviation.toFixed(2)} Lc`);
console.log('');

// Verdict
console.log('═'.repeat(70));
console.log('VERDICT:');
console.log('═'.repeat(70));

if (passRate === 100) {
  console.log('✅ ALL GOLDEN VECTORS ARE CORRECT');
  console.log('');
  console.log('Conclusion: The expected values in our test vectors match the');
  console.log('canonical apca-w3 implementation perfectly.');
  console.log('');
  console.log('Implication: The 33.3% accuracy in FASE 2 is NOT due to wrong');
  console.log('test vectors. The Momoto TypeScript implementation has deeper');
  console.log('bugs that were not identified in line-by-line comparison.');
  console.log('');
  console.log('Next Step: Proceed with Rust/WASM implementation using canonical');
  console.log('library, as there is no path to fixing the TypeScript version.');
} else if (passRate >= 95) {
  console.log('⚠️  GOLDEN VECTORS ARE MOSTLY CORRECT');
  console.log('');
  console.log(`${failed} vector(s) deviate from canonical implementation.`);
  console.log('');
  console.log('Action Required: Review failing vectors to determine if:');
  console.log('1. Our expected values need updating');
  console.log('2. Canonical implementation version mismatch');
  console.log('3. Tolerance values need adjustment');
} else {
  console.log('❌ GOLDEN VECTORS ARE SIGNIFICANTLY WRONG');
  console.log('');
  console.log(`Pass rate: ${passRate.toFixed(1)}% - Expected values do NOT match canonical.`);
  console.log('');
  console.log('Critical Issue: The test vectors we\'ve been using are incorrect.');
  console.log('');
  console.log('Action Required:');
  console.log('1. Update all expected values to canonical outputs');
  console.log('2. Re-run FASE 2 tests with corrected vectors');
  console.log('3. Determine if TypeScript fix is actually viable');
}

console.log('═'.repeat(70));
console.log('');

// Exit code
process.exit(passRate === 100 ? 0 : 1);
