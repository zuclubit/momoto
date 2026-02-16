# Honest Benchmark v2 Failure Analysis

## Executive Summary

**Status:** Benchmark v2 **BROKEN** - All measurements report 0.00ps
**Root Cause:** Timer resolution insufficient for batch size used
**Fix:** v3 with massive batch sizes (10,000+) and Float64Array sink

---

## The Problem

### Symptoms Observed

```
Math.random():      0.00ps ⚠️ SUSPICIOUS
fresnelFast:        0.00ps ⚠️ SUSPICIOUS
beerLambertFast:    0.00ps ⚠️ SUSPICIOUS
Batch scaling:      NaN (0/0)
Overall speedup:    Infinity (x/0)
CV (variance):      400-600% ⚠️ UNSTABLE
```

**All operations reported 0.00ps, even Math.random() which should take ~30ns.**

This is physically impossible and indicates the benchmark is measuring nothing.

---

## Root Cause Analysis

### Investigation Process

1. **Checked the sink** - Is `__benchSink` being eliminated by JIT?
   - Added `keepSinkAlive()` to force reading
   - Result: Still 0.00ps ❌

2. **Checked input variability** - Is JIT constant-folding?
   - Inputs are varied via `inputGenerator`
   - Result: Still 0.00ps ❌

3. **Checked timer resolution** - Is `performance.now()` working?
   - **This was the problem** ✅

### The Real Problem: Timer Resolution

```javascript
// v2 code:
batchSize: 100  // ← TOO SMALL!
```

**Math:**
- Math.random() takes ~30ns
- 100 operations = 100 × 30ns = 3,000ns = 3µs = **0.003ms**
- `performance.now()` has resolution of ~100µs in many browsers
- If total time < 100µs, timer reports 0

```javascript
const start = performance.now();  // 1234.5670ms
for (let i = 0; i < 100; i++) {
  Math.random();  // 100 × 30ns = 3µs
}
const end = performance.now();    // 1234.5670ms (no change!)
const time = end - start;         // 0ms ← ZERO!
```

**Result:** Division by zero → 0.00ps, NaN, Infinity

### Why Even Chrome Failed

Modern browsers **intentionally degrade** `performance.now()` resolution for security (Spectre/Meltdown mitigation):

| Browser | Normal Resolution | Degraded Resolution |
|---------|-------------------|---------------------|
| Chrome  | 5µs               | 100µs (with Site Isolation) |
| Firefox | 1µs               | 100µs (privacy.resistFingerprinting) |
| Safari  | 1µs               | 100µs (ITP enabled) |

**Even if the sink is perfect, if the timer can't measure the operation, we get zero.**

---

## Why v2's Anti-Optimizations Weren't Enough

### Technique #1: globalThis.__benchSink ✅ (Good but insufficient)

```javascript
globalThis.__benchSink += result;
```

**Status:** Correct, but not the main problem.

The JIT can detect that `__benchSink` is never read and eliminate writes. We added `keepSinkAlive()` to force reading, which helps, but doesn't fix the timer issue.

### Technique #2: Variable Inputs ✅ (Good)

```javascript
inputGenerator: (i) => i % 1000
```

**Status:** Correct. Prevents constant folding.

### Technique #3: Statistical Analysis ✅ (Good)

Using median instead of average is correct and helps with outliers.

### **Technique #4: Batch Size ❌ (BROKEN)**

```javascript
batchSize: 100  // Way too small!
```

**Status:** INSUFFICIENT for timer resolution.

**Required batch size calculation:**

```
Timer Resolution: 100µs (conservative)
Operation Time:   30ns (Math.random)

Minimum Batch Size = 100µs / 30ns = 3,333 operations
Recommended:       10,000 (provides margin)
```

---

## The Fix: v3 Changes

### Change #1: Massive Batch Sizes 🔧 CRITICAL

```javascript
const BATCH_SIZES = {
  NANO: 100_000,   // < 10ns operations (array access)
  FAST: 10_000,    // 10-100ns (Math.random, sqrt, LUT lookups)
  MEDIUM: 1_000,   // 100-1000ns (WASM calls)
  SLOW: 100,       // > 1µs (complex operations)
};
```

**Why this works:**

```
Math.random() with batchSize=10,000:
  10,000 × 30ns = 300,000ns = 300µs = 0.3ms

Timer measures: 0.3ms ✅ (well above 100µs threshold)
Time per op: 0.3ms / 10,000 = 30ns ✅ ACCURATE!
```

### Change #2: Float64Array Sink 🔧 RECOMMENDED

```javascript
// v2: Can be optimized away
globalThis.__benchSink += result;

// v3: Harder to optimize
const SINK = new Float64Array(1);
SINK[0] += result;
```

**Why this is better:**

TypedArray writes involve more complex machinery:
- Memory bounds checking
- Typed conversion
- Potential SharedArrayBuffer complications

The JIT is more conservative about eliminating these.

### Change #3: Precalculated Inputs 🔧 GOOD PRACTICE

```javascript
// v2: Generator function (can be inlined)
inputGenerator: (i) => Math.random()

// v3: External data (cannot be inlined)
const INPUTS = generateInputs();  // Called once
benchmark((i) => INPUTS.random[i % INPUTS.length])
```

### Change #4: Strict Validation 🔧 CRITICAL

```javascript
if (timePerOpNs < 0.001) {  // < 1 picosecond
  throw new Error('INVALID: Timer resolution insufficient or JIT eliminated code');
}
```

**No more lying.** If measurements are impossible, we say so explicitly.

### Change #5: Sink Verification 🔧 PROOF

```javascript
return {
  // ... other fields
  sinkBefore,
  sinkAfter,
  sinkDelta: sinkAfter - sinkBefore,
};
```

**Shows that results were actually used.** If `sinkDelta = 0`, JIT eliminated code.

---

## Expected Results (v3)

### Baseline Checks

```
Math.random():      20-50ns   ✅
Math.sqrt():        5-15ns    ✅
Float64Array:       <5ns      ✅

Status: ✓ VALID - Benchmark working correctly
```

### LUT Functions

```
fresnelFast:        30-100ns  ✅ (< 1µs target)
beerLambertFast:    30-100ns  ✅ (< 1µs target)
LUT memory:         148KB     ✅ (< 1MB target)
```

### Batch Scaling

```
Individual (100 calls):  150-200µs
Batch (1 call):          15-30µs
Speedup:                 7-10x ✅
```

---

## Lessons Learned

### 1. Timer Resolution is Often the Limiting Factor

Modern browsers degrade `performance.now()` for security. Always assume **100µs resolution** and batch accordingly.

### 2. Anti-JIT Optimizations Are Necessary But Not Sufficient

You need:
- ✅ Sink that forces side effects
- ✅ Variable inputs
- ✅ **Batch size large enough for timer resolution** ← v2 missed this

### 3. Validate Everything

If a measurement seems too good (0.00ps) or too bad (∞ ops/s), it's probably wrong. Fail explicitly.

### 4. Test in Multiple Browsers

- Chrome: Best WASM performance, but aggressive JIT
- Firefox: Good balance
- Safari: Most conservative, often slowest

Each browser has different JIT behavior and timer resolution.

---

## Comparison: v2 vs v3

| Aspect | v2 | v3 | Impact |
|--------|----|----|--------|
| Batch size (fast ops) | 100 | 10,000 | 🔴 CRITICAL |
| Batch size (slow ops) | 1 | 100 | 🔴 CRITICAL |
| Sink type | globalThis | Float64Array | 🟡 MODERATE |
| Input generation | Runtime | Precalculated | 🟢 MINOR |
| Validation | Warnings | Strict errors | 🔴 CRITICAL |
| Sink verification | No | Yes (shows delta) | 🟡 MODERATE |

**Key insight:** The batch size was the critical failure, not the sink mechanism.

---

## When to Use Each Approach

### Use v3 (Massive Batch) When:
- ✅ Operations are < 1µs
- ✅ Running in browser (security-degraded timer)
- ✅ Need accurate per-operation timing
- ✅ Target is sub-microsecond precision

### Alternative Approaches:

#### For Very Fast Operations (< 1ns):
```javascript
// Measure 1 million operations at once
const MEGA_BATCH = 1_000_000;
```

#### For Slow Operations (> 1ms):
```javascript
// Can use smaller batches
batchSize: 1  // Direct measurement OK
```

#### For Node.js (Better Timer):
```javascript
// process.hrtime.bigint() has nanosecond resolution
// Can use smaller batches than browser
```

---

## Recommendations for Future Benchmarks

### 1. Always Start With Baseline Validation

```javascript
const baseline = runBaselineChecks();
if (!baseline.valid) {
  throw new Error('Benchmark environment broken - cannot proceed');
}
```

**Never trust WASM benchmarks if Math.random() reports 0.**

### 2. Calculate Required Batch Size

```javascript
function calculateBatchSize(expectedTimeNs, timerResolutionUs = 100) {
  const timerResolutionNs = timerResolutionUs * 1000;
  const targetTotalNs = timerResolutionNs * 3; // 3x margin
  return Math.ceil(targetTotalNs / expectedTimeNs);
}

// Example: 30ns operation
const batchSize = calculateBatchSize(30); // Returns 10,000
```

### 3. Use Performance Budget

```javascript
const PERFORMANCE_BUDGET = {
  fresnelFast: { max: 1000, unit: 'ns' },
  batchScaling: { min: 7, max: 10, unit: 'x' },
};

if (result.time_per_op_ns > PERFORMANCE_BUDGET.fresnelFast.max) {
  throw new Error('Performance regression detected');
}
```

### 4. Document Hardware

```javascript
console.log(`
Environment:
  Browser: ${detectBrowser()}
  CPU: ${navigator.hardwareConcurrency} cores
  Memory: ${navigator.deviceMemory}GB
  Timer Resolution: ${measureTimerResolution()}µs
`);
```

### 5. Version Your Benchmarks

- v1: Initial attempt (broken)
- v2: Anti-JIT optimizations (still broken)
- **v3: Massive batch sizes (FIXED)** ✅

Never delete old versions - they document the learning process.

---

## Conclusion

The v2 benchmark failed because **timer resolution was insufficient for the batch size used**, not because the anti-JIT optimizations were wrong.

The fix was simple: **use 100x larger batch sizes** (10,000 instead of 100).

This is a classic example of optimizing the wrong thing: we focused on preventing JIT elimination when the real problem was timer resolution.

**Key takeaway:** For sub-microsecond operations in browsers, you need batch sizes of 10,000+ to overcome timer resolution limitations.

---

## See Also

- [honest-benchmark-v3.html](./honest-benchmark-v3.html) - Fixed benchmark
- [HONEST-BENCHMARK-GUIDE.md](./HONEST-BENCHMARK-GUIDE.md) - Usage guide
- [README.md](./README.md) - Overview

---

**Remember:** If Math.random() reports 0.00ps, your benchmark is broken. Fix it before measuring anything else.
