# Benchmarks — Momoto v7.1.0

Momoto is designed for real-time use in UI rendering pipelines and WASM
environments. This document documents expected performance characteristics,
measured targets, and WASM binary size budgets.

> **Note:** These benchmarks reflect design targets and analytical estimates
> based on operation counts. Automated criterion benchmarks live in `benches/`
> (currently excluded from workspace; run with `cargo bench --package momoto-audio`).

---

## Audio Domain

### FFT Throughput

| FFT size | Estimated throughput | Notes |
|----------|---------------------|-------|
| 256 | > 500 000 FFT/s | L2-resident, minimal cache pressure |
| 1 024 | > 200 000 FFT/s | ~4 KB complex buffer |
| 4 096 | > 40 000 FFT/s | Fits in shared 16 KiB scratch |
| 8 192 | > 15 000 FFT/s | Exceeds default scratch; reallocates |

Operation count: `N·log₂(N)` complex multiply-adds per FFT.
At 1 024 samples: 10 240 cmul-adds ≈ 30 720 flops.

### LUFS Measurement Cost

| Configuration | Latency per 400 ms block | Notes |
|---------------|--------------------------|-------|
| Mono, 48 kHz | < 0.5 ms | 19 200 samples × 2 biquad stages |
| Stereo, 48 kHz | < 1.0 ms | 2× channels |
| Integrated (10 blocks) | < 0.1 ms overhead | Two-pass gating: O(B) |

K-weighting: 5 multiplies + 4 adds per sample per stage, 2 stages = 18 flops/sample.
At 19 200 samples × 18 flops = 345 600 flops per 400 ms block.

### Mel Filterbank

| Bands | FFT size | Latency | Notes |
|-------|----------|---------|-------|
| 40 | 1 024 | < 0.2 ms | Standard ASR feature extraction |
| 80 | 2 048 | < 0.5 ms | High-resolution music analysis |
| 128 | 4 096 | < 1.0 ms | Maximum resolution |

Sparse filter implementation: only non-zero filter weights stored.
Typical non-zero rate: ~30% of FFT bins per filter (triangular overlap).

---

## Color Domain

### OKLCH Perceptual Distance (ΔE₂₀₀₀)

| Batch size | Estimated throughput | Notes |
|------------|---------------------|-------|
| 1 pair | < 1 µs | Single OKLCH → OKLab → ΔE₂₀₀₀ |
| 1 000 pairs | < 1 ms | Cache-warm batch |
| 1 000 000 pairs | < 1 s | Memory-bound above ~100K |

### WCAG / APCA Contrast

| Operation | Latency | Notes |
|-----------|---------|-------|
| WCAG ratio (1 pair) | < 100 ns | 2× sRGB→linear + luminance |
| APCA Lc (1 pair) | < 200 ns | Polynomial soft-clip |
| Batch (1 000 pairs) | < 0.2 ms | Cache-warm |

### HCT Tonal Palette (13 tones)

| Operation | Latency | Notes |
|-----------|---------|-------|
| Single hex→HCT | < 5 µs | sRGB→XYZ→CAM16 |
| 13-tone palette | < 50 µs | 13 CAM16 inverse transforms |
| Full palette (5 roles × 13) | < 0.3 ms | 65 tonal values |

---

## Engine Dispatch Overhead

`DomainVariant` enum dispatch eliminates vtable indirection. Each match arm
is monomorphised separately, enabling full LLVM inlining.

| Operation | Overhead vs direct call |
|-----------|------------------------|
| `energy_report()` | < 1 ns (≡ zero — inlined by LLVM) |
| `validate_compliance()` | < 5 ns (ComplianceReport stack-allocated) |
| `validate_system_energy()` | < 1 µs (1 domain, unit input) |
| `normalize_perceptual_energy()` | < 1 ns (single clamp or arithmetic) |
| `perceptual_alignment()` | < 2 ns (2× normalize + abs subtract) |

---

## WASM Binary Size

Target: **< 40% total size growth** when adding audio + haptics vs color-only.

| Feature combination | Target WASM size | Target gzip |
|--------------------|-----------------|-------------|
| `--features color` | < 350 KB | < 100 KB |
| `--features audio` | < 450 KB | < 130 KB |
| `--features color,audio` | < 500 KB | < 145 KB |
| `--features multimodal` | < 550 KB | < 160 KB |

wasm-opt flags (release): `-O3 --enable-bulk-memory --enable-nontrapping-float-to-int --enable-simd128`

Size budget breakdown (audio additions):
- `momoto-audio` core (LUFS + FFT + Mel + Spectral): ~80 KB wasm (est.)
- `momoto-haptics` (Energy + Mapping + Waveform): ~30 KB wasm (est.)
- WASM bindings overhead: ~20 KB per domain (serde_json, wasm-bindgen glue)

---

## Memory Model

### Heap Allocations Per Operation

| Operation | Allocations | Notes |
|-----------|-------------|-------|
| `BiquadFilter::process()` | 0 | In-place state update |
| `LufsAnalyzer::add_mono_block()` | 0 | Pushes to pre-allocated Vec |
| `FftPlan::fft()` | 0 | In-place on caller's buffer |
| `FftPlan::power_spectrum()` | 1 | Returns `Box<[f32]>` |
| `FftPlan::power_spectrum_into()` | 0 | Zero-allocation hot path |
| `MelFilterbank::apply_into()` | 0 | Zero-allocation hot path |
| `HapticWaveform::generate()` | 1 | Returns `Box<[f32]>` samples |
| `EnergyBudget::try_consume()` | 0 | In-place arithmetic |
| `MomotoEngine::validate_system_energy()` | 1 | Vec per domain (small) |

### Shared Scratch Buffer

`MomotoEngine` owns a pre-allocated `Box<[f32]>` (default 4 096 × 4 B = 16 KiB).
Domains receive `&mut [f32]` slices from this buffer during evaluation.

| Buffer size | Max FFT frame | Max Mel bands × frames |
|-------------|--------------|----------------------|
| 4 096 (default) | 4 096 samples (85 ms @ 48 kHz) | 128 × 32 |
| 8 192 | 8 192 samples (170 ms) | 128 × 64 |
| 16 384 | 16 384 samples (341 ms) | 128 × 128 |

---

## Running Benchmarks

```bash
# Audio benchmarks (LUFS, FFT, Mel)
cargo bench --package momoto-audio

# Engine dispatch benchmarks
cargo bench --package momoto-engine

# Color distance benchmarks
cargo bench --package momoto-metrics

# WASM size check
wasm-pack build crates/momoto-wasm --target web --release --features color
ls -lh pkg/momoto_wasm_bg.wasm

wasm-pack build crates/momoto-wasm --target web --release --features multimodal
ls -lh pkg/momoto_wasm_bg.wasm
```

Benchmarks use [criterion](https://github.com/bheisler/criterion.rs) v0.5
with `--measurement-time 5` and `--warm-up-time 3`.
