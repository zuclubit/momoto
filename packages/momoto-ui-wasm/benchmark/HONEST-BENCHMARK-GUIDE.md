# Momoto Honest Benchmark Guide

## Why "Honest"?

The previous benchmark reported times of `0.00ns` and throughput of `∞ ops/s`. This happened because:

1. **Dead Code Elimination**: The JIT compiler detected that function results were never used and removed the entire benchmark loop
2. **Constant Folding**: Using the same inputs every iteration allowed aggressive optimization
3. **No Validation**: No checks for impossible results (< 1ns measurements)

This new benchmark suite defeats these optimizations to provide **honest, reliable measurements**.

---

## Quick Start

```bash
cd packages/momoto-ui-wasm

# Start HTTP server
python3 -m http.server 8080
# or
npx http-server -p 8080

# Open in browser
open http://localhost:8080/benchmark/honest-benchmark.html

# Click "Run All Benchmarks"
```

---

## Anti-Optimization Techniques

### 1. Global Sink (`globalThis.__benchSink`)

All benchmark results flow through a global variable that the JIT **cannot eliminate**:

```javascript
// WRONG (old benchmark)
for (let i = 0; i < iterations; i++) {
  fn(); // Result never used → JIT eliminates entire loop!
}

// RIGHT (honest benchmark)
for (let i = 0; i < iterations; i++) {
  const result = fn(i);
  globalThis.__benchSink += result; // JIT cannot eliminate
}
```

### 2. Variable Inputs

Using different inputs each iteration prevents constant folding:

```javascript
// WRONG
benchmark(() => fresnelFast(1.5, 0.8), 10000); // Same inputs → JIT optimizes

// RIGHT
benchmark((i) => {
  const ior = iorValues[i % iorValues.length];
  const cosTheta = cosThetaValues[(i * 7) % cosThetaValues.length];
  return fresnelFast(ior, cosTheta); // Different inputs each iteration
}, 10000);
```

### 3. Statistical Analysis

Using **median** instead of **average** eliminates outliers:

```javascript
// WRONG
const avgTime = totalTime / iterations; // One outlier ruins everything

// RIGHT
times.sort((a, b) => a - b);
const median = times[Math.floor(times.length / 2)]; // Robust to outliers
```

### 4. Sanity Checks

Automatic detection of impossible results:

```javascript
const suspicious = median < 0.0001; // < 0.1µs is suspicious for WASM calls

if (suspicious) {
  console.warn('⚠️  SUSPICIOUS: Time too low, may indicate JIT elimination');
}
```

---

## Understanding the Results

### Output Format

```
fresnelFast(ior, cos_theta)
  Median: 45.2ns | Min: 41.1ns | Max: 89.3ns | σ: 8.2ns
  Status: ✓ PASS (target: < 1µs)
```

- **Median**: Middle value when sorted (robust to outliers)
- **Min/Max**: Best and worst case (shows variance)
- **σ (sigma)**: Standard deviation (stability indicator)
- **Status**: PASS/FAIL vs target (honest - no maquillaje)

### Warnings

#### ⚠️ SUSPICIOUS

```
⚠️  SUSPICIOUS: Time too low (< 100ns), may indicate JIT elimination
```

**What it means**: The measured time is impossibly low. The JIT likely optimized away the code.

**What to do**:
1. Check if result is actually used (should flow through `__benchSink`)
2. Verify inputs vary each iteration
3. Try increasing `batchSize` for more accurate timing

#### ⚠️ UNSTABLE

```
⚠️  UNSTABLE: High variance (CV > 20%), results may not be reliable
```

**What it means**: Coefficient of Variation > 20% indicates high variance between runs.

**What to do**:
1. Close background applications
2. Disable browser extensions
3. Check CPU throttling is off
4. Run multiple times and use median of medians

---

## Performance Targets

### LUT Functions

| Function | Target | Why |
|----------|--------|-----|
| `fresnelFast` | < 1µs | Fast approximation for common case |
| `beerLambertFast` | < 1µs | Fast approximation for absorption |
| LUT memory | < 1MB | Reasonable memory footprint |

**If FAIL**: LUTs may be slower than direct calculation (possible on some hardware). Consider fallback.

### Batch API Scaling

| Metric | Target | Why |
|--------|--------|-----|
| Scaling (500 vs 1) | > 6x | Per-material cost should decrease significantly |

**If FAIL**: SOA layout not providing cache benefits, or overhead dominates.

### Batch vs Individual

| Materials | Target | Why |
|-----------|--------|-----|
| 100 | 7-10x | JS↔WASM crossing reduction is key win |

**If FAIL**:
- < 7x: Overhead too high or batch not optimized enough
- > 10x: Excellent! Exceeds expectations

---

## Baseline Health Check

The benchmark first runs sanity checks with known operations:

```
Math.random()      Expected: 20-50ns   (standard random number generator)
Math.sqrt()        Expected: 5-15ns    (hardware-optimized operation)
Math.pow()         Expected: 10-30ns   (more complex than sqrt)
Float64Array access Expected: < 5ns    (nearly free)
```

**If these are off**, the entire benchmark suite is compromised:

- **< 10ns**: Timer resolution too low (use different browser)
- **> 100ns**: System under load (close applications)
- **High variance**: CPU throttling active (disable)

---

## Common Issues

### Issue: All times show as 0ns

**Cause**: Dead code elimination - results not being used.

**Solution**: Check that `globalThis.__benchSink` is being written to. The honest benchmark handles this automatically.

### Issue: Throughput shows as ∞

**Cause**: Division by zero because time = 0.

**Solution**: Use larger `batchSize` to increase timing resolution.

### Issue: Results vary wildly between runs

**Cause**: System instability (background apps, CPU throttling).

**Solutions**:
1. Close background applications
2. Disable browser extensions
3. Use Chrome DevTools Performance: "No throttling"
4. Run multiple times and use median

### Issue: PASS locally but FAIL in CI

**Cause**: CI may use virtualized hardware or CPU throttling.

**Solution**: Adjust targets for CI environment or skip performance tests.

---

## Interpreting Speedups

### Good Speedup

```
Baseline: 142.3µs
Optimized: 12.4µs
Speedup: 11.5x
✓ Target met (7-10x)
```

**Interpretation**: Clear win. The optimization works as expected.

### Marginal Speedup

```
Baseline: 142.3µs
Optimized: 23.7µs
Speedup: 6.0x
⚠️ Below target (7-10x)
```

**Interpretation**: Some improvement but below target. May still be acceptable depending on use case.

### No Speedup

```
Baseline: 142.3µs
Optimized: 138.1µs
Speedup: 1.0x (no change)
✗ Target not met
```

**Interpretation**: Optimization ineffective. Investigate overhead or implementation issues.

### Slower!

```
Baseline: 12.4µs
Optimized: 23.7µs
Speedup: 0.52x (SLOWER!)
✗ Target not met
```

**Interpretation**: "Optimization" makes things worse. Overhead exceeds benefits.

---

## Browser-Specific Notes

### Chrome (Recommended)

- Best WASM performance (V8 + TurboFan)
- Expected: Meets all targets easily
- If fails: Check for extensions or background tabs

### Firefox

- Good WASM performance (SpiderMonkey)
- Expected: Meets most targets
- May be 10-20% slower than Chrome

### Safari

- Decent WASM performance (JavaScriptCore)
- Expected: May be at lower end of target ranges
- If fails: This is known limitation of JSC

### Mobile

- **50-70% of desktop** performance
- Expected: May not meet 7-10x target on low-end devices
- Flagships should meet targets

---

## When to Worry

### 🚨 Critical Issues

1. **Baseline checks fail**: Timer or system compromised
2. **All results suspicious**: JIT elimination occurring
3. **Huge variance (CV > 50%)**: System unstable

→ **Do not trust any results until resolved**

### ⚠️ Issues to Investigate

1. **One target fails**: May be implementation issue
2. **Close to target (±10%)**: Borderline, may vary by hardware
3. **Mobile fails but desktop passes**: Expected

→ **Results may still be useful with caveats**

### ✅ Minor Issues

1. **Exceeds targets**: Great! Document for future reference
2. **Slightly unstable (CV 15-20%)**: Acceptable for rough comparison
3. **Baseline slightly off**: Okay if consistent across runs

→ **Results are reliable**

---

## Example: Good Run

```
═══════════════════════════════════════════════════════
BASELINE SANITY CHECKS
═══════════════════════════════════════════════════════
Math.random(): 23.4ns (healthy)
✓ All baselines healthy

═══════════════════════════════════════════════════════
LUT FUNCTIONS PERFORMANCE
═══════════════════════════════════════════════════════
fresnelFast:      45.2ns ✓ PASS
beerLambertFast:  38.7ns ✓ PASS
LUT memory:       147KB  ✓ PASS

═══════════════════════════════════════════════════════
BATCH API SCALING PERFORMANCE
═══════════════════════════════════════════════════════
Scaling (500 vs 1): 7.1x ✓ PASS

═══════════════════════════════════════════════════════
BATCH VS INDIVIDUAL (100 materials)
═══════════════════════════════════════════════════════
Speedup: 11.5x ✓ PASS (exceeds 7-10x target!)

═══════════════════════════════════════════════════════
SUMMARY: 5/5 PASS | 0 FAIL | 0 SUSPICIOUS
═══════════════════════════════════════════════════════
```

**Interpretation**: Perfect run. All targets met or exceeded. Results are reliable.

---

## Example: Problematic Run

```
═══════════════════════════════════════════════════════
BASELINE SANITY CHECKS
═══════════════════════════════════════════════════════
Math.random(): 0.01ns ⚠️ SUSPICIOUS
⚠️ Timer resolution may be insufficient

═══════════════════════════════════════════════════════
LUT FUNCTIONS PERFORMANCE
═══════════════════════════════════════════════════════
fresnelFast:      0.00ns ⚠️ SUSPICIOUS (JIT elimination!)
beerLambertFast:  0.00ns ⚠️ SUSPICIOUS (JIT elimination!)

═══════════════════════════════════════════════════════
SUMMARY: 0/5 PASS | 5 FAIL | 2 SUSPICIOUS
═══════════════════════════════════════════════════════
```

**Interpretation**: Benchmark is broken. Do not trust any results. Check:
1. Browser supports `performance.now()` with sufficient resolution
2. WASM module loaded correctly
3. No browser extensions interfering

---

## Reporting Results

When reporting benchmark results, include:

1. **Environment**:
   - Browser + version
   - OS + version
   - Hardware (CPU, RAM)
   - Any throttling/limitations

2. **All metrics**:
   - Median (primary)
   - Min/Max (variance)
   - Stddev/CV (stability)
   - PASS/FAIL status

3. **Warnings**:
   - Any SUSPICIOUS flags
   - Any UNSTABLE flags
   - Baseline health status

4. **Raw data** (if possible):
   - Screenshot of summary
   - Console output
   - Multiple runs

### Example Report

```markdown
## Benchmark Results

**Environment**:
- Browser: Chrome 120.0.6099.109
- OS: macOS 14.2.1
- Hardware: M2 Pro, 16GB RAM
- Throttling: None

**Results**:
- fresnelFast: 45.2ns (σ: 8.2ns) ✓ PASS
- beerLambertFast: 38.7ns (σ: 6.1ns) ✓ PASS
- LUT memory: 147KB ✓ PASS
- Batch scaling: 7.1x ✓ PASS
- Overall speedup: 11.5x ✓ PASS

**Status**: 5/5 targets met, 0 suspicious, 0 unstable

**Notes**: All targets met or exceeded. Performance excellent on M2.
```

---

## Next Steps

After running benchmarks:

1. **If all PASS**: Document results, proceed to production
2. **If 1-2 FAIL**: Investigate specific issues, may still be acceptable
3. **If many FAIL**: Review implementation, check for bugs
4. **If SUSPICIOUS**: Fix benchmark (check anti-optimizations)

---

## Technical Details

### Benchmark Harness Design

```javascript
function benchmark(name, fn, options) {
  // 1. Warmup (discard results)
  for (let i = 0; i < warmupRuns; i++) {
    globalThis.__benchSink += fn(i);
  }

  // 2. Measure (collect timing samples)
  const times = [];
  for (let run = 0; run < measuredRuns; run++) {
    const start = performance.now();
    for (let i = 0; i < batchSize; i++) {
      globalThis.__benchSink += fn(run * batchSize + i);
    }
    const end = performance.now();
    times.push((end - start) / batchSize);
  }

  // 3. Statistical analysis
  times.sort();
  const median = times[Math.floor(times.length / 2)];
  const stddev = calculateStddev(times);

  // 4. Sanity check
  const suspicious = median < 0.0001; // < 100ns

  return { median, stddev, suspicious };
}
```

### Why Median Over Average?

Median is robust to outliers:

```
Times: [10, 11, 10, 11, 10, 11, 500] (GC spike!)

Average: (10+11+10+11+10+11+500)/7 = 80.4 ← Wrong!
Median: 11 ← Correct!
```

### Why Batch for Fast Operations?

For operations < 1µs, single-call timing has insufficient resolution:

```
// BAD: resolution too low
start = performance.now(); // 1234.567ms
fresnelFast(1.5, 0.8);     // ~50ns
end = performance.now();   // 1234.567ms (no change!)
time = 0

// GOOD: batch for resolution
start = performance.now();  // 1234.567ms
for 100 iterations:
  fresnelFast(ior[i], cos[i]);
end = performance.now();    // 1234.572ms
time = 5µs / 100 = 50ns ← Accurate!
```

---

## Contributing

When adding new benchmarks:

1. Use `benchmark()` harness (handles anti-optimizations)
2. Vary inputs using `inputGenerator`
3. Document expected ranges
4. Add sanity checks
5. Test on multiple browsers

---

## License

Same as Momoto project (MIT)

---

**Remember**: If results look too good to be true, they probably are. This benchmark is designed to be honest, even when the truth is inconvenient.
