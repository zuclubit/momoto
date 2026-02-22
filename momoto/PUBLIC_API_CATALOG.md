# Public API Catalog

**Date:** 2026-02-22
**Version:** 7.1.0 — Multimodal (Color + Audio + Haptics)
**Status:** ✅ Complete — all domains documented

---

## 0. momoto-audio (Acoustic Domain)

### 0.1 AudioDomain (`momoto_audio::domain`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `AudioDomain::at_48khz()` | fn | ✅ Stable | ✅ Yes | 48 kHz domain root |
| `AudioDomain::new(sr)` | fn | ✅ Stable | ✅ Yes | Custom rate — returns `Option<AudioDomain>` |
| `AudioDomain::at_sample_rate(sr)` | fn | ✅ Stable | ✅ Yes | Custom sample rate |
| `AudioDomain::lufs_analyzer(channels)` | fn | ✅ Stable | ✅ Yes | Returns `LufsAnalyzer` |
| `AudioDomain::validate_broadcast(lufs)` | fn | ✅ Stable | ✅ Yes | EBU R128 compliance |
| `AudioDomain::id()` / `name()` / `version()` | fn | ✅ Stable | ✅ Yes | Domain trait impl |

### 0.2 LUFS Loudness (`momoto_audio::perceptual::lufs`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `LufsAnalyzer::add_mono_block(&[f32])` | fn | ✅ Stable | ✅ Yes | Allocation-free hot path |
| `LufsAnalyzer::momentary()` | fn | ✅ Stable | ✅ Yes | 400 ms window (LUFS) |
| `LufsAnalyzer::short_term()` | fn | ✅ Stable | ✅ Yes | 3 s window (LUFS) |
| `LufsAnalyzer::integrated()` | fn | ✅ Stable | ✅ Yes | Gated integrated LUFS |
| `LoudnessBlock` | struct | ✅ Stable | ✅ Yes | 400 ms block with K-weighting |

### 0.3 FFT (`momoto_audio::physical::fft`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `FftPlan::new(n)` | fn | ✅ Stable | ✅ Yes | n must be power of two |
| `FftPlan::fft(&mut samples)` | fn | ✅ Stable | ✅ Yes | In-place, interleaved re/im |

### 0.4 Mel Filterbank (`momoto_audio::perceptual::mel`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `MelFilterbank::new(n, fft, sr, f_min, f_max)` | fn | ✅ Stable | ✅ Yes | HTK + Slaney |
| `MelFilterbank::apply_into(&spectrum, &mut out)` | fn | ✅ Stable | ✅ Yes | Allocation-free |
| `hz_to_mel(hz)` | fn | ✅ Stable | ✅ Yes | HTK formula |
| `mel_to_hz(mel)` | fn | ✅ Stable | ✅ Yes | HTK inverse |

### 0.5 Spectral Features (`momoto_audio::perceptual::spectral`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `spectral_centroid(spectrum, sr)` | fn | ✅ Stable | ✅ Yes | Weighted center of mass (Hz) |
| `spectral_brightness(spectrum, sr, cutoff)` | fn | ✅ Stable | ✅ Yes | Energy above cutoff / total |
| `spectral_flux(prev, curr)` | fn | ✅ Stable | ✅ Yes | Frame-to-frame change |
| `spectral_rolloff(spectrum, sr, pct)` | fn | ✅ Stable | ✅ Yes | Frequency below pct% energy |
| `spectral_flatness(spectrum)` | fn | ✅ Stable | ✅ Yes | Wiener entropy (0=tone, 1=noise) |

### 0.6 IIR Filters (`momoto_audio::filters`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `BiquadFilter::new(coeffs)` | fn | ✅ Stable | ✅ Yes | Generic IIR |
| `BiquadFilter::process(sample)` | fn | ✅ Stable | ✅ Yes | Denormal-guarded hot path |
| `BiquadCoeffs` | struct | ✅ Stable | ✅ Yes | b0/b1/b2/a1/a2 |
| `KWeightingFilter::new(sr)` | fn | ✅ Stable | ✅ Yes | ITU-R BS.1770-4 two-stage |
| `KWeightingFilter::process(sample)` | fn | ✅ Stable | ✅ Yes | High-shelf + high-pass |
| `KWeightingCoeffs` | struct | ✅ Stable | ✅ Yes | Pre-computed stage coefficients |

### 0.7 EBU R128 (`momoto_audio::compliance::ebur128`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `EbuR128Limits` | struct | ✅ Stable | ✅ Yes | Target: −23 LUFS ±1, LRA ≤ 18 |
| `EbuR128Measurement` | struct | ✅ Stable | ✅ Yes | `passes`, `margin_lu` |

### 0.8 WASM Audio API (`momoto-wasm` — feature: `audio`)

| JS name (camelCase) | Description |
|--------------------|-------------|
| `audioLufs(samples, sr, channels)` | Integrated LUFS → `f32` |
| `audioMomentaryLufs(samples, sr, channels)` | 400 ms momentary LUFS |
| `audioFftPowerSpectrum(samples, n)` | Power spectrum → `Float32Array` |
| `audioMelSpectrum(samples, sr, n_mels)` | Mel filterbank → `Float32Array` |
| `audioSpectralCentroid(spectrum, sr)` | Center of mass (Hz) |
| `audioSpectralBrightness(spectrum, sr, cutoff)` | Brightness above cutoff |
| `audioSpectralFlux(prev, curr)` | Frame change |
| `audioSpectralRolloff(spectrum, sr, pct)` | Rolloff frequency |
| `audioSpectralFlatness(spectrum)` | Wiener entropy |
| `audioValidateEbuR128(lufs)` | JSON compliance report |
| `domainProcess(domain_id, samples)` | Generic domain signal processing |
| `domainPerceptualDistance(a_id, a_val, b_id, b_val)` | Cross-domain distance |
| `audioDomainInfo()` | JSON domain metadata |

---

## 0b. momoto-haptics (Vibrotactile Domain)

### 0b.1 HapticsDomain (`momoto_haptics::domain`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `HapticsDomain::new(capacity_j)` | fn | ✅ Stable | ✅ Yes | LRA default: 0.050 J |
| `HapticsDomain::with_recharge(j, j_per_s)` | fn | ✅ Stable | ✅ Yes | Passive recharge model |
| `HapticsDomain::id()` / `name()` / `version()` | fn | ✅ Stable | ✅ Yes | Domain trait impl |
| `HapticsDomain::energy_report(input)` | fn | ✅ Stable | ✅ Yes | EnergyConserving trait |

### 0b.2 Energy Budget (`momoto_haptics::energy`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `EnergyBudget::new(capacity_j)` | fn | ✅ Stable | ✅ Yes | Fixed capacity (joules) |
| `EnergyBudget::with_recharge(j, j_per_s)` | fn | ✅ Stable | ✅ Yes | With passive recharge |
| `EnergyBudget::try_consume(j)` | fn | ✅ Stable | ✅ Yes | Returns `Err` if exceeded |
| `EnergyBudget::tick(secs)` | fn | ✅ Stable | ✅ Yes | Advance time, recover energy |
| `EnergyBudget::available_j()` | fn | ✅ Stable | ✅ Yes | Remaining capacity |
| `EnergyBudget::load_fraction()` | fn | ✅ Stable | ✅ Yes | consumed / capacity |
| `EnergyBudget::can_afford(j)` | fn | ✅ Stable | ✅ Yes | Non-consuming check |
| `EnergyBudget::reset()` | fn | ✅ Stable | ✅ Yes | Full recharge |
| `EnergyBudgetError { required_j, available_j }` | struct | ✅ Stable | ✅ Yes | Budget exceeded error |

### 0b.3 Frequency-Force Mapping (`momoto_haptics::mapping`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `FrequencyForceMapper::new(model)` | fn | ✅ Stable | ✅ Yes | Build from actuator preset |
| `FrequencyForceMapper::map(intensity, dur_ms)` | fn | ✅ Stable | ✅ Yes | Weber's law scaling |
| `VibrationSpec { freq_hz, force_n, duration_ms, intensity }` | struct | ✅ Stable | ✅ Yes | Physical output |
| `VibrationSpec::energy_j()` | fn | ✅ Stable | ✅ Yes | Estimated joules |
| `FrequencyForcePoint { freq_hz, force_n }` | struct | ✅ Stable | ✅ Yes | Curve point |
| `ActuatorModel::Lra` | variant | ✅ Stable | ✅ Yes | ~150–200 Hz narrow band |
| `ActuatorModel::Erm` | variant | ✅ Stable | ✅ Yes | 80–300 Hz broad band |
| `ActuatorModel::Piezo` | variant | ✅ Stable | ✅ Yes | 200–1000 Hz wide band |
| `ActuatorModel::Custom { … }` | variant | ✅ Stable | ✅ Yes | Device-specific |

### 0b.4 Waveform Generation (`momoto_haptics::waveform`)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `HapticWaveform::generate(kind, freq, dur, amp, sr)` | fn | ✅ Stable | ✅ Yes | Returns `Box<[f32]>` samples |
| `HapticWaveform { kind, freq_hz, sample_rate, samples }` | struct | ✅ Stable | ✅ Yes | Generated waveform |
| `WaveformKind::Sine` | variant | ✅ Stable | ✅ Yes | Pure sinusoid |
| `WaveformKind::Pulse` | variant | ✅ Stable | ✅ Yes | Gaussian impulse |
| `WaveformKind::Ramp` | variant | ✅ Stable | ✅ Yes | Linear envelope × sine |
| `WaveformKind::Buzz` | variant | ✅ Stable | ✅ Yes | Clipped sine (rich harmonics) |

---

## 0c. momoto-engine (Multimodal Orchestrator)

| API | Type | Stability | Tests | Notes |
|-----|------|-----------|-------|-------|
| `MomotoEngine::new()` | fn | ✅ Stable | ✅ Yes | ColorDomain always registered |
| `MomotoEngine::with_scratch_len(n)` | fn | ✅ Stable | ✅ Yes | Override 4096-element default |
| `engine.domain_count()` | fn | ✅ Stable | ✅ Yes | Registered domain count |
| `engine.has_domain(id)` | fn | ✅ Stable | ✅ Yes | Check by DomainId |
| `engine.is_fully_deterministic()` | fn | ✅ Stable | ✅ Yes | All domains deterministic |
| `engine.is_fully_compliant()` | fn | ✅ Stable | ✅ Yes | All compliance reports pass |
| `engine.scratch()` / `scratch_mut()` | fn | ✅ Stable | ✅ Yes | Shared work buffer |
| `engine.total_energy_report(input)` | fn | ✅ Stable | ✅ Yes | Σ per-domain energy |
| `engine.verify_all_conservation(input, tol)` | fn | ✅ Stable | ✅ Yes | Boolean conservation check |
| `engine.validate_all()` | fn | ✅ Stable | ✅ Yes | `Vec<ComplianceReport>` |
| `engine.normalize_perceptual_energy(id, raw)` | fn | ✅ Stable | ✅ Yes | Domain normalization |
| `engine.perceptual_alignment(a, b, va, vb)` | fn | ✅ Stable | ✅ Yes | Cross-domain coherence |
| `engine.validate_system_energy()` | fn | ✅ Stable | ✅ Yes | `SystemEnergyReport` |
| `engine.domain_names()` | fn | ✅ Stable | ✅ Yes | Registered crate names |
| `ColorDomain` | struct | ✅ Stable | ✅ Yes | Ideal lossless optical domain |
| `DomainVariant` | enum | ✅ Stable | ✅ Yes | Enum dispatch (no vtable) |
| `SystemEnergyReport` | struct | ✅ Stable | ✅ Yes | Per-domain + total + efficiency |

---

## Previous Audit (Phase 4.2 - 2026-01-07)

---

## Mission

Enumerate **every public API** across Rust, WASM, and JS/TS bindings.
Classify each API as: **Stable**, **Experimental**, or **Internal** (should not be public).
Verify each has: **Tests**, **Examples**, **Documentation**.

---

## Audit Methodology

1. **Source inspection**: Grep all `pub` items across crates
2. **Documentation generation**: `cargo doc` to verify exported surface
3. **WASM binding analysis**: Review `#[wasm_bindgen]` attributes
4. **Test coverage mapping**: Match APIs to test cases
5. **Example verification**: Check doc tests and usage examples

---

## 1. momoto-core (Foundation Layer)

### 1.1 Color Module (`momoto_core::color`)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `Color` | struct | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Core type |
| `Color::from_srgb8(r, g, b)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Primary constructor |
| `Color::from_srgb(r, g, b)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Float constructor |
| `Color::from_linear(r, g, b)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Linear RGB |
| `Color::to_srgb8()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `Color.srgb: [f64; 3]` | field | ✅ Stable | ✅ Yes | ❌ No | ⚠️ Minimal | Public field |
| `Color.linear: [f64; 3]` | field | ✅ Stable | ✅ Yes | ❌ No | ⚠️ Minimal | Public field |

**Coverage:** 6/7 have examples (86%)

**Issues Found:**
- ⚠️ `to_srgb8()` lacks doc example
- ⚠️ Public fields could use more documentation

---

### 1.2 Luminance Module (`momoto_core::luminance`)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `RelativeLuminance` | struct | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Newtype wrapper |
| `RelativeLuminance::new(value)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Constructor |
| `RelativeLuminance::value()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Accessor |
| `relative_luminance_srgb(color)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | WCAG algorithm |
| `relative_luminance_apca(color)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `soft_clamp(y, threshold, exp)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |

**Coverage:** 4/6 have examples (67%)

**Issues Found:**
- ⚠️ `relative_luminance_apca()` needs doc example
- ⚠️ `soft_clamp()` needs doc example (APCA-specific)

---

### 1.3 Math Module (`momoto_core::math`)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `clamp(value, min, max)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `lerp(a, b, t)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `inverse_lerp(a, b, value)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |

**Coverage:** 0/3 have examples (0%)

**Issues Found:**
- 🔴 **CRITICAL**: Math utilities have no doc examples
- These are simple utilities but should demonstrate usage

---

### 1.4 Perception Module (`momoto_core::perception`)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `ContrastMetric` | trait | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Core abstraction |
| `ContrastMetric::evaluate()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Single evaluation |
| `ContrastMetric::evaluate_batch()` | fn | ✅ Stable | ✅ Yes | ⚠️ Ignore | ✅ Yes | Batch operation |
| `ContrastMetric::name()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `ContrastMetric::version()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `PerceptualResult` | struct | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Result type |
| `PerceptualResult::new(value)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Constructor |
| `PerceptualResult::with_polarity()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | APCA support |
| `PerceptualResult::abs()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Absolute value |
| `PerceptualResult.value: f64` | field | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Main result |
| `PerceptualResult.polarity: Option<Polarity>` | field | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Optional polarity |
| `PerceptualResult.metadata: Option<&'static str>` | field | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Unused field?** |
| `Polarity` | enum | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Dark/Light |
| `Polarity::DarkOnLight` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Positive polarity |
| `Polarity::LightOnDark` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Negative polarity |

**Coverage:** 11/15 have examples (73%)

**Issues Found:**
- ⚠️ `metadata` field is never used (dead code?)
- ⚠️ `name()` and `version()` methods need examples
- ⚠️ `evaluate_batch()` example is marked `ignore` (WASM compilation issue?)

---

### 1.5 Space Module (`momoto_core::space`)

#### 1.5.1 OKLCH Submodule

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `OKLCH` | struct | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Perceptual color space |
| `OKLCH::new(l, c, h)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Direct constructor |
| `OKLCH::from_color(color)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Convert from RGB |
| `OKLCH::to_oklab()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLCH::to_color()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Convert to RGB |
| `OKLCH::with_lightness(l)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLCH::with_chroma(c)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLCH::with_hue(h)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLCH::lighten(delta)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Adjust lightness |
| `OKLCH::darken(delta)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Adjust lightness |
| `OKLCH::saturate(factor)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Adjust chroma |
| `OKLCH::desaturate(factor)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Adjust chroma |
| `OKLCH::rotate_hue(degrees)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Adjust hue |
| `OKLCH::estimate_max_chroma()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLCH::is_in_gamut()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Gamut check |
| `OKLCH::clamp_to_gamut()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLCH::map_to_gamut()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Perceptual mapping |
| `OKLCH::delta_e(other)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Perceptual distance |
| `OKLCH::is_similar_to(other, threshold)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLCH::interpolate(a, b, t, path)` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Color interpolation |
| `OKLCH.l: f64` | field | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Lightness |
| `OKLCH.c: f64` | field | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Chroma |
| `OKLCH.h: f64` | field | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Hue |
| `OKLab` | struct | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLab::from_color(color)` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLab::to_color()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `OKLab.l: f64` | field | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | L channel |
| `OKLab.a: f64` | field | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | a channel |
| `OKLab.b: f64` | field | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | b channel |
| `HuePath` | enum | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Interpolation path |
| `HuePath::Shorter` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Shortest arc |
| `HuePath::Longer` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Longest arc |
| `HuePath::Increasing` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Clockwise |
| `HuePath::Decreasing` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Counter-clockwise |

**Coverage:** 22/34 have examples (65%)

**Issues Found:**
- ⚠️ OKLab type has no examples (less commonly used than OKLCH)
- ⚠️ Several OKLCH methods lack examples (with_*, estimate_max_chroma, etc.)
- ✅ Core OKLCH transformations well-documented

---

## 2. momoto-metrics (Implementation Layer)

### 2.1 WCAG Module (`momoto_metrics::wcag`)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `WCAGMetric` | struct | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | WCAG 2.1 |
| `WCAGMetric::new()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Constructor |
| `WCAGMetric::evaluate()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Single contrast |
| `WCAGMetric::evaluate_batch()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Batch contrast |
| `WCAGMetric::passes()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Compliance check |
| `WCAGMetric::level()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `WCAGMetric::is_large_text()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `WCAGLevel` | enum | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | AA/AAA |
| `WCAGLevel::AA` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Minimum |
| `WCAGLevel::AAA` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Enhanced |
| `WCAGLevel::requirement()` | fn | ✅ Stable | ✅ Yes | ❌ No | ✅ Yes | **Need example** |
| `TextSize` | enum | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Normal/Large |
| `TextSize::Normal` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Small text |
| `TextSize::Large` | variant | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Large text |
| `WCAG_REQUIREMENTS` | const | ✅ Stable | ✅ Yes | ❌ No | ⚠️ Minimal | **Public const** |

**Coverage:** 11/15 have examples (73%)

**Issues Found:**
- ⚠️ `level()`, `is_large_text()`, `requirement()` need examples
- ⚠️ `WCAG_REQUIREMENTS` const is public but minimally documented

---

### 2.2 APCA Module (`momoto_metrics::apca`)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `APCAMetric` | struct | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | APCA-W3 0.1.9 |
| `APCAMetric::new()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Constructor |
| `APCAMetric::evaluate()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Polarity-aware |
| `APCAMetric::evaluate_batch()` | fn | ✅ Stable | ✅ Yes | ✅ Yes | ✅ Yes | Batch polarity |

**Coverage:** 4/4 have examples (100%)

**Issues Found:** None - APCA API is well-documented ✅

---

### 2.3 SAPC Module (`momoto_metrics::sapc`)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `SAPCMetric` | struct | ⚠️ **Not exported** | ❌ No | ❌ No | ⚠️ Minimal | **Placeholder only** |

**Status:** 🚫 Not part of public API (correctly hidden during refinement)

---

## 3. momoto-wasm (WASM Binding Layer)

### 3.1 Color Bindings

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `Color` | class | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | WASM wrapper |
| `Color.constructor(r, g, b)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | JS constructor |
| `Color.fromHex(hex)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Hex parsing |
| `Color.toHex()` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Hex output |
| `Color.r: number` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Red channel |
| `Color.g: number` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Green channel |
| `Color.b: number` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Blue channel |

**Coverage:** All have README examples

**Issues Found:**
- 🔴 **CRITICAL**: No automated WASM tests (manual testing only)

---

### 3.2 Metric Bindings

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `WCAGMetric` | class | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | WASM wrapper |
| `WCAGMetric.constructor()` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | JS constructor |
| `WCAGMetric.evaluate(fg, bg)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Single eval |
| `WCAGMetric.evaluateBatch(fgs, bgs)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Batch eval |
| `WCAGMetric.passes(ratio, level, isLargeText)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Static check |
| `APCAMetric` | class | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | WASM wrapper |
| `APCAMetric.constructor()` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | JS constructor |
| `APCAMetric.evaluate(fg, bg)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Polarity-aware |
| `APCAMetric.evaluateBatch(fgs, bgs)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Batch polarity |

**Coverage:** All have README examples

**Issues Found:**
- 🔴 **CRITICAL**: No automated WASM tests

---

### 3.3 OKLCH Bindings

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `OKLCH` | class | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | WASM wrapper |
| `OKLCH.constructor(l, c, h)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Direct construct |
| `OKLCH.fromColor(color)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | From RGB |
| `OKLCH.toColor()` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | To RGB |
| `OKLCH.lighten(delta)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Transform |
| `OKLCH.darken(delta)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Transform |
| `OKLCH.saturate(factor)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Transform |
| `OKLCH.desaturate(factor)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Transform |
| `OKLCH.rotateHue(degrees)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Transform |
| `OKLCH.mapToGamut()` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Gamut mapping |
| `OKLCH.deltaE(other)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Distance |
| `OKLCH.interpolate(a, b, t, path)` | fn | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Interpolation |
| `OKLCH.l: number` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Lightness |
| `OKLCH.c: number` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Chroma |
| `OKLCH.h: number` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Hue |

**Coverage:** All have README examples

**Issues Found:**
- 🔴 **CRITICAL**: No automated WASM tests

---

### 3.4 Result Bindings

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| `ContrastResult` | class | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | WASM wrapper |
| `ContrastResult.value: number` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Contrast value |
| `ContrastResult.polarity: string \| null` | field | ✅ Stable | ⚠️ Manual | ✅ README | ✅ Yes | Polarity string |

**Coverage:** All have README examples

**Issues Found:**
- 🔴 **CRITICAL**: No automated WASM tests

---

## 4. momoto-engine (Placeholder)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| *No public APIs* | - | - | - | - | - | Placeholder crate |

**Status:** ✅ Correctly empty (future work)

---

## 5. momoto-intelligence (Placeholder)

| API | Type | Stability | Tests | Examples | Docs | Notes |
|-----|------|-----------|-------|----------|------|-------|
| *No public APIs* | - | - | - | - | - | Placeholder crate |

**Status:** ⚠️ **FASE 5 will implement this**

---

## Summary Statistics

### Rust API Coverage

| Crate | Total APIs | With Tests | With Examples | With Docs |
|-------|------------|------------|---------------|-----------|
| momoto-core | 76 | 76 (100%) | 52 (68%) | 76 (100%) |
| momoto-metrics | 19 | 19 (100%) | 15 (79%) | 19 (100%) |
| **Total Rust** | **95** | **95 (100%)** | **67 (71%)** | **95 (100%)** |

### WASM API Coverage

| Category | Total APIs | With Tests | With Examples | With Docs |
|----------|------------|------------|---------------|-----------|
| Color | 7 | 0 (0%) | 7 (100%) | 7 (100%) |
| Metrics | 9 | 0 (0%) | 9 (100%) | 9 (100%) |
| OKLCH | 15 | 0 (0%) | 15 (100%) | 15 (100%) |
| Results | 3 | 0 (0%) | 3 (100%) | 3 (100%) |
| **Total WASM** | **34** | **0 (0%)** | **34 (100%)** | **34 (100%)** |

---

## Critical Issues Found

### 🔴 HIGH PRIORITY

1. **No automated WASM tests** (34 APIs untested)
   - **Impact:** Cannot verify JavaScript bindings work
   - **Risk:** Breaking changes may go undetected
   - **Action Required:** Implement wasm-pack test suite

2. **Math utilities lack examples** (3 APIs)
   - **Impact:** Users don't know how to use basic utilities
   - **Risk:** Incorrect usage, confusion
   - **Action Required:** Add doc examples for clamp, lerp, inverse_lerp

3. **PerceptualResult.metadata field unused**
   - **Impact:** Dead code in public API
   - **Risk:** Confusing to users
   - **Action Required:** Remove or document use case

### ⚠️ MEDIUM PRIORITY

4. **28 Rust APIs lack doc examples** (29% missing)
   - Includes: to_srgb8, luminance functions, OKLCH helpers
   - **Action Required:** Add examples systematically

5. **Public constants minimally documented**
   - `WCAG_REQUIREMENTS` array is public but unclear
   - **Action Required:** Document structure and purpose

### ✅ LOW PRIORITY

6. **OKLab type underutilized**
   - Few examples, rarely used directly
   - **Action:** Consider if this should be public or internal

---

## Stability Classification

### ✅ Stable (Safe to Use)

**All current public APIs are classified as Stable:**
- momoto-core: All 76 APIs
- momoto-metrics: All 19 APIs
- momoto-wasm: All 34 APIs

**Rationale:**
- APIs have been through Phase 3 validation
- Performance benchmarked
- Golden vectors validated
- No breaking changes planned

### ⚠️ Experimental (None Currently)

No APIs are marked experimental.

### 🚫 Internal (Should Not Be Public)

**Candidates for review:**
- `PerceptualResult.metadata` - unused field
- `WCAG_REQUIREMENTS` - implementation detail?
- `OKLab` - rarely used directly, could be internal

---

## Action Items (FASE 4 Requirements)

### Must-Have for Production

- [ ] Implement automated WASM test suite (34 tests)
- [ ] Add missing doc examples (28 examples)
- [ ] Remove or document `metadata` field
- [ ] Document `WCAG_REQUIREMENTS` const

### Should-Have for Quality

- [ ] Add comprehensive E2E examples
- [ ] Create API usage guide
- [ ] Add migration guide (if breaking changes)
- [ ] Performance notes in batch API docs

### Nice-to-Have for Polish

- [ ] Interactive API playground
- [ ] Video tutorials
- [ ] Community examples repository

---

## Compliance Check

| Requirement | Status | Details |
|-------------|--------|---------|
| **Every public API has tests** | ⚠️ **94% (95/101)** | Missing: WASM tests (0/34) |
| **Every API has usage example** | ⚠️ **71% (67/95 Rust)** | Missing: 28 doc examples |
| **Every API has documentation** | ✅ **100% (129/129)** | All documented |
| **No internal APIs exposed** | ⚠️ **Review needed** | metadata field, OKLab? |

---

## Next Steps

1. **Implement WASM test suite** (FASE 4.1)
2. **Add missing doc examples** (FASE 4.2 completion)
3. **Create E2E scenarios** (FASE 4.3)
4. **Build intelligence layer** (FASE 5)
5. **Final validation** (Cross-phase)

---

**Audit Completed By:** Momoto FASE 4 Team
**Date:** 2026-01-07
**Confidence Level:** HIGH (comprehensive source inspection)
**Recommendation:** Address WASM testing before production release

