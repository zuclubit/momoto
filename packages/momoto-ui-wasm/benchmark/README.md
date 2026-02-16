# Momoto UI Performance Benchmarks

Comprehensive benchmark suite for measuring WASM vs TypeScript performance across all Momoto UI modules.

## ⚠️ Important: Which Benchmark Should You Use?

### 🎯 RECOMMENDED: Honest Benchmark v3 (FIXED)

**Use this for Week 1-2 glass physics validation:**
```bash
python3 -m http.server 8080
# Open http://localhost:8080/benchmark/honest-benchmark-v3.html
```

**Why?**
- **v1 (glass-physics-performance.html)**: Broken - reports 0.00ns due to JIT elimination ❌
- **v2 (honest-benchmark.html)**: Still broken - timer resolution too low, reports 0.00ps ❌
- **v3 (honest-benchmark-v3.html)**: FIXED - massive batch sizes (10,000+), Float64Array sink, strict validation ✅

**What's Fixed in v3:**
- ✅ Massive BatchSize: 10,000+ operations per timing sample (fixes timer resolution)
- ✅ Float64Array Sink: Harder for JIT to optimize than globalThis
- ✅ Precalculated Inputs: External data that JIT cannot inline
- ✅ Strict Validation: Fails explicitly if measurements are impossible (< 1ps)
- ✅ Sink Verification: Shows sinkSum to prove no optimization occurred

See [HONEST-BENCHMARK-GUIDE.md](./HONEST-BENCHMARK-GUIDE.md) for details.

### ⚠️ Legacy Benchmarks (May Have Issues)

These benchmarks may report inaccurate results due to dead code elimination:

- `glass-physics-performance.html` - ⚠️ Known to report 0ns times (DO NOT USE)
- `comprehensive.js` - Node.js benchmarks (may need anti-optimization fixes)
- `token-derivation.js` - Node.js benchmarks (may need anti-optimization fixes)

## Quick Start

### Honest Benchmark v2 (Recommended)

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

### Legacy Benchmarks (Use with Caution)

```bash
# Run comprehensive benchmarks
node benchmark/comprehensive.js

# Run with memory profiling (requires Node.js with --expose-gc)
node --expose-gc benchmark/comprehensive.js

# Run token derivation benchmarks
node benchmark/token-derivation.js
```

## Benchmarks Overview

### 1. Comprehensive Benchmark (`comprehensive.js`)

Tests all three modules with detailed performance metrics:

- **State Machine** (Phase 1)
  - `determineUIState()` - All priority combinations
  - `getStateMetadata()` - Metadata lookup
  - `combineStates()` - Multi-state combination

- **Token Derivation** (Phase 2)
  - Cold cache (first call)
  - Hot cache (cache hits)
  - One-shot derivations
  - Cache growth analysis

- **Accessibility** (Phase 3)
  - WCAG 2.1 contrast validation
  - APCA perceptual contrast
  - Quick boolean checks

- **Memory Analysis**
  - Cache growth patterns
  - Memory usage per token
  - Garbage collection impact

### 2. Token Derivation Benchmark (`token-derivation.js`)

Specialized benchmark focusing on token derivation performance:

- Cold vs hot cache comparison
- Cache hit rate simulation
- Throughput measurements
- Warmup iterations

### 3. Glass Physics Benchmark (`glass-physics-performance.html`)

Week 1-2 performance validation for glass physics engine:

- **LUT Functions**
  - Fresnel fast approximation (< 1µs target)
  - Beer-Lambert fast approximation (< 1µs target)
  - Memory usage validation (< 1MB target)

- **Batch API Scaling**
  - Test with 1, 10, 50, 100, 250, 500 materials
  - Measure per-material cost reduction
  - Validate 6x+ scaling improvement

- **Batch vs Individual**
  - Compare batch evaluation vs N individual calls
  - Measure JS↔WASM boundary crossing reduction
  - Validate 7-10x overall speedup

- **Memory Analysis**
  - Track memory usage across material counts
  - Verify no memory leaks

## Configuration

Edit iteration counts in `comprehensive.js`:

```javascript
const ITERATIONS = {
  WARMUP: 1000,
  FAST: 10000,      // For fast operations (< 1ms)
  MEDIUM: 5000,     // For medium operations (1-10ms)
  SLOW: 1000,       // For slow operations (> 10ms)
};
```

## Expected Results

### WASM Performance
```
Operation                     Time        Throughput
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
State determination           < 0.01ms    > 100k ops/s
Token derivation (cold)       ~0.2ms      5k ops/s
Token derivation (hot)        ~0.02ms     50k ops/s
WCAG validation               ~0.1ms      10k ops/s
APCA validation               ~0.15ms     6.6k ops/s
```

### WASM vs TypeScript Speedup
- State Machine: **4-5x faster**
- Token Derivation: **10-15x faster**
- Accessibility: **12-13x faster**

## Memory Profiling

Run with `--expose-gc` for accurate memory measurements:

```bash
node --expose-gc benchmark/comprehensive.js
```

This enables garbage collection before measurements, providing more accurate memory usage data.

## Interpreting Results

### Time Units
- **ns** (nanoseconds): 1/1,000,000,000 second
- **µs** (microseconds): 1/1,000,000 second
- **ms** (milliseconds): 1/1,000 second

### Throughput
- **ops/s**: Operations per second (higher is better)

### Speedup
- **Nx faster**: WASM time / TypeScript time

### Cache Speedup
- Ratio of hot cache to cold cache performance
- Typically **8-12x faster** with cache hits

## Performance Targets

All operations must meet these targets:

✅ State determination: < 100ns
✅ Token derivation (cold): < 200µs
✅ Token derivation (hot): < 1µs
✅ WCAG contrast: < 20µs
✅ APCA contrast: < 25µs

## Troubleshooting

### "Backend: TYPESCRIPT"
WASM module failed to load. Check:
- WASM file exists in `pkg/` directory
- Run `wasm-pack build` to rebuild
- Check browser console for errors

### "Permission denied" or "Module not found"
```bash
# Ensure you're in the correct directory
cd packages/momoto-ui-wasm

# Install dependencies
npm install

# Build WASM
cd ../../crates/momoto-ui-core
wasm-pack build --target web --out-dir ../../packages/momoto-ui-wasm/pkg
```

### Times showing as "0"
Operations are so fast they're below measurement precision. This is expected for native Rust tests. JavaScript benchmarks should show measurable times.

## Contributing

When adding new features:
1. Add benchmark tests to `comprehensive.js`
2. Set performance targets
3. Run benchmarks before/after changes
4. Document any significant performance impacts

## See Also

- [IMPLEMENTATION-PHASE4-COMPLETE.md](../../../IMPLEMENTATION-PHASE4-COMPLETE.md) - Full performance documentation
- [Performance Optimization Guide](../../../docs/PERFORMANCE.md) - Best practices
- Rust tests: `crates/momoto-ui-core/tests/performance_tests.rs`
