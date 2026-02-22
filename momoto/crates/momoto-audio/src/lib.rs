//! # Momoto Audio
//!
//! Acoustic signal processing domain for the Momoto Multimodal Perceptual
//! Physics Engine.
//!
//! ## Capabilities
//!
//! | Subsystem | Module | Standard |
//! |-----------|--------|---------|
//! | K-weighting IIR | `filters::kweighting` | ITU-R BS.1770-4 |
//! | Biquad IIR | `filters::biquad` | — |
//! | FFT (radix-2 DIT) | `physical::fft` | Cooley-Tukey 1965 |
//! | LUFS loudness | `perceptual::lufs` | ITU-R BS.1770-4 |
//! | Mel filterbank | `perceptual::mel` | HTK + Slaney |
//! | Spectral features | `perceptual::spectral` | — |
//! | EBU R128 compliance | `compliance::ebur128` | EBU R128 (2020) |
//! | Domain contract | `domain` | `momoto-core::traits` |
//!
//! ## Quick start
//!
//! ```rust,ignore
//! use momoto_audio::{AudioDomain, LufsAnalyzer};
//!
//! let domain = AudioDomain::at_48khz();
//! let mut analyzer = domain.lufs_analyzer(1).unwrap();
//!
//! // Feed 400 ms blocks of mono samples
//! analyzer.add_mono_block(&my_samples);
//!
//! let lufs = analyzer.integrated();
//! println!("Integrated loudness: {lufs:.1} LUFS");
//!
//! let report = domain.validate_broadcast(lufs);
//! println!("EBU R128 broadcast compliant: {}", report.passes);
//! ```
//!
//! ## Design constraints
//!
//! - **Zero unsafe** — all code is safe Rust.
//! - **Deterministic** — same input → same output on all platforms.
//! - **Allocation-free hot paths** — `FftPlan::fft()`, `BiquadFilter::process()`,
//!   `MelFilterbank::apply_into()`, `LufsAnalyzer::add_mono_block()` allocate nothing.
//! - **f32 throughout** — for WASM compatibility and SIMD alignment.

#![warn(
    missing_docs,
    missing_debug_implementations,
    rust_2018_idioms,
    unreachable_pub
)]

pub mod compliance;
pub mod domain;
pub mod filters;
pub mod perceptual;
pub mod physical;

// ── Re-exports ────────────────────────────────────────────────────────────────

pub use compliance::ebur128::{EbuR128Limits, EbuR128Measurement};
pub use domain::AudioDomain;
pub use filters::biquad::{BiquadCoeffs, BiquadFilter};
pub use filters::kweighting::{KWeightingCoeffs, KWeightingFilter};
pub use perceptual::lufs::{LoudnessBlock, LufsAnalyzer};
pub use perceptual::mel::{hz_to_mel, mel_to_hz, MelFilterbank};
pub use perceptual::spectral::{
    spectral_brightness, spectral_centroid, spectral_flatness, spectral_flux, spectral_rolloff,
};
pub use physical::fft::FftPlan;
