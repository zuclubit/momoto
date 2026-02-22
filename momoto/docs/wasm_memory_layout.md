# WASM Memory Layout Contract — Momoto v7.1.0

This document defines the memory contract for all functions exported from
`momoto-wasm` to JavaScript. Violating these contracts is a **breaking change**
and must be reflected in a semver major bump.

---

## Fundamental Rules

### 1. No heap growth in hot-path loops

Audio and haptics processing must never allocate in the inner loop:

```
❌ BAD:  Vec::new() inside sample loop
✓ GOOD: pre-allocated Box<[f32]> returned once per call
✓ GOOD: &mut [f32] scratch passed in from caller
```

Allocation is permitted only at:
- Construction time (FFT plan, Mel filterbank)
- Return boundary (one `Box<[f32]>` per function call)

### 2. Return type contract

| Return type | When to use | Example |
|-------------|-------------|---------|
| `f32` | Single scalar result | `audioLufs(block)` → `f32` |
| `Box<[f32]>` | Fixed-size array | `audioFftPowerSpectrum(sig)` → N/2+1 values |
| `String` (JSON) | Structured metadata only | `audioDomainInfo()` |
| `bool` | Pass/fail check | `wcagPasses(fg, bg, level)` |

**Never return**: `Vec<T>`, nested structs, trait objects, or `Option`/`Result`
directly — these cannot cross the WASM ABI cleanly.

### 3. Input contract

All slice inputs are typed as `&[f32]` in Rust, exposed as `Float32Array` in
JavaScript. The caller is responsible for:

- Allocating the `Float32Array` with the correct length
- Passing a view into `wasm_bindgen`'s memory (not a detached ArrayBuffer)
- Not modifying the input buffer while the WASM call is in flight

### 4. Output ownership

When a function returns `Box<[f32]>`, ownership transfers to JavaScript via
`wasm-bindgen`'s `Float32Array` return value. The WASM heap is NOT copied —
the `Float32Array` is a view into WASM linear memory until the next GC cycle.

**If you need to retain the data across WASM calls**, copy it immediately:

```js
const ps = audioFftPowerSpectrum(signal);
const copy = ps.slice(); // copy out of WASM memory
// now safe to call other WASM functions
```

---

## Per-Function Memory Layout

### Audio Domain

#### `audioLufs(block: Float32Array, sampleRate: u32, channels: u32) → f32`

```
Input:  interleaved f32 samples  [L₀ R₀ L₁ R₁ … ]  (stereo)
                                  [S₀ S₁ S₂ … ]      (mono, channels=1)
Length: n_samples × n_channels
Output: single f32 (integrated LUFS or NEG_INFINITY for silence)
Alloc:  0 alloc in hot path (uses pre-allocated K-filter state)
```

#### `audioFftPowerSpectrum(signal: Float32Array) → Float32Array`

```
Input:  N real samples (N must be power-of-two: 64, 128, 256 … 4096)
Output: N/2+1 f32 power values  [DC, bin₁, bin₂ … Nyquist]
        Normalised: Σ ps[k] × N ≈ Σ x[n]²  (Parseval's theorem)
Alloc:  1 Box<[f32]> per call (N/2+1 elements)
NaN:    non-finite inputs → 0.0 in output
```

#### `audioMelSpectrum(signal: Float32Array, sampleRate: u32, nBands: u32) → Float32Array`

```
Input:  N real samples, sample rate, number of Mel bands (1–512)
Output: nBands f32 energies  [band₀_energy, band₁_energy … ]
Alloc:  1 Box<[f32]> per call (nBands elements)
```

#### `audioSpectralCentroid(powerSpectrum: Float32Array, sampleRate: u32) → f32`

```
Input:  N/2+1 power spectrum values (output of audioFftPowerSpectrum)
Output: centroid frequency in Hz, or 0.0 if spectrum is all-zero
Alloc:  0 alloc
```

#### `audioValidateEbuR128(integratedLufs: f32, shortTermLufs: f32, truePeakDbtp: f32, profile: &str) → bool`

```
profile: "broadcast" | "streaming" | "podcast"
Output:  true iff all three measurements pass EBU R128 for profile
Alloc:   0 alloc
```

---

### Color Domain (existing, stable)

#### All color functions

All color functions follow the same pattern:
- Hex string inputs: `"#RRGGBB"` or `"#RRGGBBAA"`
- Scalar f32 outputs for single values
- `Box<[f32]>` for arrays (e.g. tonal palettes)
- No heap growth in hot path

---

### Haptics Domain (future — `--features haptics`)

When `momoto-haptics` WASM bindings are added, they will follow this contract:

#### `hapticVibrationSpec(intensity: f32, durationMs: f32, model: &str) → Float32Array`

```
Output: [freq_hz, force_n, duration_ms, energy_j]  (4 elements)
Alloc:  1 Box<[f32; 4]> per call
```

#### `hapticWaveform(kind: &str, freqHz: f32, durationMs: f32, amplitude: f32, sampleRate: u32) → Float32Array`

```
Output: floor(sampleRate × durationMs / 1000) f32 samples in [-1, 1]
Alloc:  1 Box<[f32]> per call
NaN:    freqHz ≤ 0 or durationMs ≤ 0 → empty Float32Array (length 0)
```

---

## WASM Linear Memory Model

```
 ┌─────────────────────────────────────────────────────────┐
 │  WASM Linear Memory (grows on demand, never shrinks)    │
 ├───────────────┬─────────────────┬───────────────────────┤
 │  wasm-bindgen │  Rust heap      │  Stack                │
 │  glue / stubs │  (allocator)    │  (call frames)        │
 ├───────────────┴─────────────────┴───────────────────────┤
 │  Box<[f32]> returns live here until JS GC + free()      │
 │  Float32Array views point into this memory (zero-copy)  │
 └─────────────────────────────────────────────────────────┘
```

### Memory growth triggers

| Operation | Growth? | Notes |
|-----------|---------|-------|
| `FftPlan::new(N)` | Yes (once) | N/2 twiddles + N bit_rev table |
| `MelFilterbank::new(bands, N)` | Yes (once) | Sparse weight table |
| `LufsAnalyzer::new(sr, ch)` | Yes (once) | Block history Vec |
| Any `power_spectrum()` call | Yes (small) | N/2+1 floats per call |
| Any `process()` call | No | In-place state update |

### Avoiding WASM OOM

1. **Reuse FFT plans** — construct once per frame size, not per audio block.
2. **Reuse Mel filterbanks** — construct once per (bands, sample_rate) pair.
3. **Use `_into()` variants** — `power_spectrum_into()` eliminates per-call allocation.
4. **Free returned Float32Arrays** — call `.free()` or let them go out of scope
   before the next batch of calls to allow wasm-bindgen to reclaim memory.

---

## Numerical Guarantees

All WASM-exported functions guarantee:

1. **No NaN outputs** — NaN inputs are flushed to 0 at domain boundaries.
2. **No Inf outputs** — Diverging values are clamped or reset.
3. **No panics for valid inputs** — All public APIs are `#[must_use]` and
   handle edge cases (empty slices, zero duration, zero frequency) gracefully.
4. **Deterministic** — Same inputs → same outputs across all platforms
   (x86-64, ARM64, WASM32). No thread-local state, no randomness.

---

*Document covers Momoto v7.1.0. Last updated: 2026-02-22.*
