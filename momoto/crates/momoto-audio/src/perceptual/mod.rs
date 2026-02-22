//! Perceptual audio measurements.
//!
//! | Module | Purpose |
//! |--------|---------|
//! | [`lufs`]     | LUFS loudness (ITU-R BS.1770-4): momentary, short-term, integrated |
//! | [`mel`]      | Mel filterbank (HTK formula + Slaney normalisation) |
//! | [`spectral`] | Spectral centroid, brightness, flux, rolloff, flatness |

pub mod lufs;
pub mod mel;
pub mod spectral;

pub use lufs::{LoudnessBlock, LufsAnalyzer, ABSOLUTE_GATE_LUFS, LUFS_OFFSET, RELATIVE_GATE_LU};
pub use mel::{hz_to_mel, mel_to_hz, MelFilterbank};
pub use spectral::{
    spectral_brightness, spectral_centroid, spectral_flatness, spectral_flux, spectral_rolloff,
};
