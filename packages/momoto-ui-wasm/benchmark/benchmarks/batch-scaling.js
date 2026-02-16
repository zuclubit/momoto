/**
 * @fileoverview Batch API Scaling Benchmarks
 *
 * Measures scaling efficiency of batch evaluation API.
 *
 * Targets:
 * - Batch scaling (500 vs 1): > 6x improvement
 * - Batch vs Individual (100 materials): 7-10x speedup
 */

/**
 * Generate material test data with varied properties.
 */
function generateMaterials(count) {
  const materials = [];
  for (let i = 0; i < count; i++) {
    // Vary properties to prevent optimization
    materials.push({
      ior: 1.3 + (i / count) * 1.2, // Range: 1.3-2.5
      roughness: 0.1 + (i / count) * 0.8, // Range: 0.1-0.9
      thickness: 1.5 + (i / count) * 5.0, // Range: 1.5-6.5
      absorption: 0.05 + (i / count) * 0.25, // Range: 0.05-0.3
    });
  }
  return materials;
}

/**
 * Run batch scaling benchmarks.
 *
 * @param {Object} harness - BenchmarkHarness
 * @param {Class} BatchMaterialInput - WASM BatchMaterialInput class
 * @param {Class} BatchEvaluator - WASM BatchEvaluator class
 * @param {Class} MaterialContext - WASM MaterialContext class
 * @returns {BatchScalingResults}
 */
function runBatchScalingBenchmarks(harness, BatchMaterialInput, BatchEvaluator, MaterialContext) {
  console.log('\n' + '═'.repeat(80));
  console.log('BATCH API SCALING PERFORMANCE');
  console.log('═'.repeat(80));
  console.log('Testing how per-material cost decreases with batch size.');
  console.log('');

  const results = {
    scaling: [],
  };

  // Material counts to test
  const counts = [1, 10, 50, 100, 250, 500];

  console.log('Material Count | Time       | Per-Material | Throughput');
  console.log('─'.repeat(80));

  for (const count of counts) {
    const materials = generateMaterials(count);

    // Create reusable context (avoid measuring context creation)
    const context = MaterialContext.studio();
    const evaluator = BatchEvaluator.withContext(context);

    const result = harness.benchmark(
      `Batch evaluation (${count} materials)`,
      (i) => {
        // Vary materials slightly per run to prevent optimization
        const input = new BatchMaterialInput();
        for (let j = 0; j < materials.length; j++) {
          const mat = materials[j];
          const variation = (i % 10) * 0.001; // Small variation
          input.push(
            mat.ior + variation,
            mat.roughness,
            mat.thickness,
            mat.absorption
          );
        }

        const res = evaluator.evaluate(input);

        // Use results to prevent elimination
        const opacity = res.getOpacity();
        let sum = 0;
        for (let k = 0; k < opacity.length; k++) {
          sum += opacity[k];
        }

        // Cleanup
        res.free();
        input.free();

        return sum;
      },
      {
        warmupRuns: 20,
        measuredRuns: 100,
        batchSize: 1,
        inputGenerator: (i) => i,
      }
    );

    // Cleanup
    evaluator.free();
    context.free();

    const perMaterial = result.median_ms / count;
    const throughput = 1000 / perMaterial; // materials per second

    results.scaling.push({
      count,
      totalTime: result.median_ms,
      perMaterial,
      throughput,
      result,
    });

    console.log(
      `${count.toString().padStart(14)} | ` +
      `${harness.formatTime(result.median_ms).padStart(10)} | ` +
      `${harness.formatTime(perMaterial).padStart(12)} | ` +
      `${harness.formatNumber(throughput).padStart(10)} /s`
    );
  }

  console.log('');

  // ============================================================================
  // SCALING ANALYSIS
  // ============================================================================

  const baseline = results.scaling[0]; // 1 material
  const best = results.scaling[results.scaling.length - 1]; // 500 materials

  const scalingFactor = baseline.perMaterial / best.perMaterial;

  console.log('─'.repeat(80));
  console.log('SCALING ANALYSIS:');
  console.log('');
  console.log(`  Per-material cost (1 material):   ${harness.formatTime(baseline.perMaterial)}`);
  console.log(`  Per-material cost (500 materials): ${harness.formatTime(best.perMaterial)}`);
  console.log(`  Scaling improvement:              ${harness.formatSpeedup(scalingFactor)}`);
  console.log('');

  const scalingTarget = harness.validateTarget(
    { median_ms: scalingFactor },
    6.0,
    'greater'
  );

  console.log(`Target Validation: ${scalingTarget.status}`);
  console.log(`  Target: > 6.0x`);
  console.log(`  Actual: ${scalingFactor.toFixed(2)}x`);
  console.log('');

  if (scalingTarget.passed) {
    console.log('✓ Batch scaling target MET');
  } else {
    console.log('✗ Batch scaling target NOT MET');
    console.log('   Expected: > 6x improvement from batching');
    console.log(`   Got: ${scalingFactor.toFixed(2)}x`);
  }

  console.log('═'.repeat(80));
  console.log('');

  return {
    results: results.scaling,
    scalingFactor,
    target: scalingTarget,
  };
}

/**
 * Run batch vs individual comparison.
 *
 * @param {Object} harness - BenchmarkHarness
 * @param {Class} BatchMaterialInput - WASM BatchMaterialInput class
 * @param {Class} BatchEvaluator - WASM BatchEvaluator class
 * @param {Class} MaterialContext - WASM MaterialContext class
 * @returns {BatchVsIndividualResults}
 */
function runBatchVsIndividualBenchmarks(harness, BatchMaterialInput, BatchEvaluator, MaterialContext) {
  console.log('\n' + '═'.repeat(80));
  console.log('BATCH VS INDIVIDUAL EVALUATION');
  console.log('═'.repeat(80));
  console.log('Comparing batch evaluation (1 WASM call) vs individual (N WASM calls).');
  console.log('');

  const results = {};
  const testCounts = [10, 50, 100];

  for (const count of testCounts) {
    console.log(`Testing with ${count} materials:`);
    console.log('');

    const materials = generateMaterials(count);

    // ============================================================================
    // INDIVIDUAL EVALUATION (N separate calls)
    // ============================================================================

    const context1 = MaterialContext.studio();
    const evaluator1 = BatchEvaluator.withContext(context1);

    const individualResult = harness.benchmark(
      `Individual evaluation (${count} materials)`,
      (i) => {
        let sum = 0;
        for (let j = 0; j < materials.length; j++) {
          const mat = materials[j];
          const variation = (i % 10) * 0.001;

          const input = new BatchMaterialInput();
          input.push(
            mat.ior + variation,
            mat.roughness,
            mat.thickness,
            mat.absorption
          );

          const res = evaluator1.evaluate(input);
          const opacity = res.getOpacity();
          sum += opacity[0];

          res.free();
          input.free();
        }
        return sum;
      },
      {
        warmupRuns: 10,
        measuredRuns: 50,
        batchSize: 1,
        inputGenerator: (i) => i,
      }
    );

    evaluator1.free();
    context1.free();

    console.log('  Individual (N separate WASM calls):');
    console.log(`    Median: ${harness.formatTime(individualResult.median_ms)}`);
    console.log(`    Range: ${harness.formatTime(individualResult.min_ms)} - ${harness.formatTime(individualResult.max_ms)}`);
    console.log('');

    // ============================================================================
    // BATCH EVALUATION (1 call)
    // ============================================================================

    const context2 = MaterialContext.studio();
    const evaluator2 = BatchEvaluator.withContext(context2);

    const batchResult = harness.benchmark(
      `Batch evaluation (${count} materials)`,
      (i) => {
        const input = new BatchMaterialInput();
        const variation = (i % 10) * 0.001;

        for (const mat of materials) {
          input.push(
            mat.ior + variation,
            mat.roughness,
            mat.thickness,
            mat.absorption
          );
        }

        const res = evaluator2.evaluate(input);
        const opacity = res.getOpacity();
        let sum = 0;
        for (let k = 0; k < opacity.length; k++) {
          sum += opacity[k];
        }

        res.free();
        input.free();

        return sum;
      },
      {
        warmupRuns: 10,
        measuredRuns: 50,
        batchSize: 1,
        inputGenerator: (i) => i,
      }
    );

    evaluator2.free();
    context2.free();

    console.log('  Batch (1 WASM call):');
    console.log(`    Median: ${harness.formatTime(batchResult.median_ms)}`);
    console.log(`    Range: ${harness.formatTime(batchResult.min_ms)} - ${harness.formatTime(batchResult.max_ms)}`);
    console.log('');

    // ============================================================================
    // SPEEDUP ANALYSIS
    // ============================================================================

    const speedup = individualResult.median_ms / batchResult.median_ms;

    console.log('  Speedup Analysis:');
    console.log(`    Speedup (median): ${harness.formatSpeedup(speedup)}`);
    console.log(`    JS↔WASM crossings reduced: ${count} → 1 (${count}x reduction)`);
    console.log('');

    results[count] = {
      individual: individualResult,
      batch: batchResult,
      speedup,
    };

    console.log('─'.repeat(80));
    console.log('');
  }

  // ============================================================================
  // VALIDATION (100 materials)
  // ============================================================================

  const result100 = results[100];
  const speedup100 = result100.speedup;

  console.log('TARGET VALIDATION (100 materials):');
  console.log('');
  console.log(`  Target: 7-10x speedup`);
  console.log(`  Actual: ${speedup100.toFixed(2)}x`);
  console.log('');

  const passed = speedup100 >= 7 && speedup100 <= 12; // Allow some margin
  console.log(`  Status: ${passed ? 'PASS ✓' : 'FAIL ✗'}`);

  if (!passed) {
    if (speedup100 < 7) {
      console.log('  Note: Speedup below target (< 7x)');
    } else {
      console.log('  Note: Speedup exceeds expectations (> 10x) - excellent!');
    }
  }

  console.log('═'.repeat(80));
  console.log('');

  return {
    results,
    speedup100,
    passed,
  };
}

// Export for browser
if (typeof window !== 'undefined') {
  window.BatchScalingBenchmarks = {
    runBatchScalingBenchmarks,
    runBatchVsIndividualBenchmarks,
    generateMaterials,
  };
}
