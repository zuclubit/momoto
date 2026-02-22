# momoto-audio

**Acoustic signal processing domain for the Momoto Multimodal Perceptual Physics Engine.**

Implements loudness measurement, spectral analysis, and broadcast compliance
in pure, safe Rust — zero `unsafe`, deterministic across all platforms.

[![crates.io](https://img.shields.io/crates/v/momoto-audio)](https://crates.io/crates/momoto-audio)
[![docs.rs](https://img.shields.io/docsrs/momoto-audio)](https://docs.rs/momoto-audio)

---

## Module overview

| Module | Subsystem | Standard |
|--------|-----------|---------|
| `filters::biquad` | Generic IIR biquad filter | — |
| `filters::kweighting` | K-weighting pre-filter | **ITU-R BS.1770-4** |
| `physical::fft` | Radix-2 Cooley-Tukey DIT FFT | Cooley–Tukey 1965 |
| `perceptual::lufs` | LUFS loudness (momentary/short-term/integrated + absolute gate) | **ITU-R BS.1770-4** |
| `perceptual::mel` | Mel filterbank (HTK + Slaney scales) | HTK / Slaney 1994 |
| `perceptual::spectral` | Centroid, brightness, flux, rolloff, flatness | Perceptual audio |
| `compliance::ebur128` | EBU R128 broadcast compliance check | **EBU R128 (2020)** |
| `domain` | `AudioDomain` — `Domain` + `EnergyConserving` contracts | momoto-core traits |

---

## Quick start

### LUFS measurement

```rust
use momoto_audio::{AudioDomain, LufsAnalyzer};

// 48 kHz stereo setup
let domain = AudioDomain::at_48khz();
let mut analyzer = domain.lufs_analyzer(2).unwrap(); // 2 channels

// Generate a 1 kHz sine (or feed real audio blocks)
let sample_rate = 48_000u32;
let freq = 1_000.0_f32;
let block: Vec<f32> = (0..sample_rate)
    .map(|i| (2.0 * std::f32::consts::PI * freq * i as f32 / sample_rate as f32).sin())
    .collect();

analyzer.add_mono_block(&block);

let integrated = analyzer.integrated();
println!("Integrated LUFS: {:.1}", integrated);
```

### FFT power spectrum

```rust
use momoto_audio::{AudioDomain, FftPlan};

let domain = AudioDomain::at_48khz();
let plan = FftPlan::new(4096);

let signal: Vec<f32> = /* ... */;
let mut spectrum = signal[..4096].to_vec();
plan.fft(&mut spectrum);

// Bins are now complex interleaved (re, im, re, im, …)
let power_db: Vec<f32> = spectrum
    .chunks(2)
    .map(|c| {
        let power = c[0] * c[0] + c[1] * c[1];
        10.0 * (power + 1e-30).log10()
    })
    .collect();
```

### Mel filterbank + spectral features

```rust
use momoto_audio::{MelFilterbank, spectral_centroid, spectral_brightness};

let sample_rate = 48_000u32;
let fft_size = 2048;
let n_mels = 40;

let filterbank = MelFilterbank::new(n_mels, fft_size, sample_rate, 80.0, 8_000.0);
let power_spectrum: Vec<f32> = /* ... */;

let mut mel_output = vec![0.0f32; n_mels];
filterbank.apply_into(&power_spectrum, &mut mel_output);

let centroid = spectral_centroid(&power_spectrum, sample_rate);
let bright   = spectral_brightness(&power_spectrum, sample_rate, 2_000.0);
println!("Centroid: {:.0} Hz  Brightness@2kHz: {:.3}", centroid, bright);
```

### EBU R128 broadcast compliance

```rust
use momoto_audio::AudioDomain;

let domain = AudioDomain::at_48khz();
let mut analyzer = domain.lufs_analyzer(1).unwrap();

// … feed audio …
let integrated = analyzer.integrated();
let report = domain.validate_broadcast(integrated);

println!("EBU R128 compliant: {}", report.passes);
if !report.passes {
    println!("Integrated: {:.1} LUFS (target: -23.0 ±1.0)", integrated);
}
```

---

## Full public API

| Type / Function | Description |
|-----------------|-------------|
| `AudioDomain` | Domain root — `at_48khz()`, `new(sr)` (returns `Option`) |
| `AudioDomain::lufs_analyzer(channels)` | Create a new `LufsAnalyzer` |
| `AudioDomain::validate_broadcast(lufs)` | `EbuR128Measurement` compliance check |
| `LufsAnalyzer::add_mono_block(&[f32])` | Feed a block of K-weighted samples |
| `LufsAnalyzer::momentary()` | 400 ms window loudness (LUFS) |
| `LufsAnalyzer::short_term()` | 3 s window loudness (LUFS) |
| `LufsAnalyzer::integrated()` | Program-integrated loudness with gating (LUFS) |
| `FftPlan::new(n)` | Radix-2 DIT FFT plan (n must be power of two) |
| `FftPlan::fft(&mut samples)` | In-place complex FFT (interleaved re/im) |
| `MelFilterbank::new(…)` | Mel filterbank with HTK or Slaney frequency mapping |
| `MelFilterbank::apply_into(&spectrum, &mut out)` | Apply filterbank to power spectrum |
| `hz_to_mel(hz)` / `mel_to_hz(mel)` | Mel scale conversion |
| `spectral_centroid(spectrum, sr)` | Frequency-weighted centre of mass (Hz) |
| `spectral_brightness(spectrum, sr, cutoff)` | Energy above cutoff / total energy |
| `spectral_flux(prev, curr)` | Frame-to-frame spectral change |
| `spectral_rolloff(spectrum, sr, pct)` | Frequency below which `pct`% of energy lies |
| `spectral_flatness(spectrum)` | Tonality measure (Wiener entropy) |
| `KWeightingFilter` | Two-stage K-weighting pre-filter (high-shelf + high-pass) |
| `BiquadFilter` / `BiquadCoeffs` | Generic second-order IIR with denormal guard |
| `EbuR128Limits` | Broadcast limits: integrated target, LRA, true peak |
| `EbuR128Measurement` | Compliance result with `passes`, `margin_lu` |

---

## Standards compliance

| Standard | Implementation | Notes |
|----------|----------------|-------|
| ITU-R BS.1770-4 | K-weighting IIR + LUFS gating | Momentary / short-term / integrated |
| EBU R128 (2020) | `compliance::ebur128` | −23 LUFS ±1 target, LRA ≤ 18 LU |
| Cooley-Tukey FFT | `physical::fft` | Radix-2 DIT, in-place, zero unsafe |
| HTK Mel scale | `perceptual::mel` | 700 Hz offset; also supports Slaney |

---

## Design constraints

- **Zero `unsafe`** — all code is safe Rust.
- **Deterministic** — same input → same output on all platforms (IEEE 754 f32).
- **Allocation-free hot paths** — `FftPlan::fft`, `BiquadFilter::process`,
  `MelFilterbank::apply_into`, `LufsAnalyzer::add_mono_block` allocate nothing.
- **f32 throughout** — WASM compatibility and SIMD alignment.
- **Denormal guards** — biquad and LUFS operations use epsilon clamps to
  prevent denormal floats from degrading performance on x86.
