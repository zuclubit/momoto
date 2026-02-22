//! Audio signal conditioning filters.
//!
//! | Module | Purpose |
//! |--------|---------|
//! | [`biquad`]      | Direct Form II Transposed biquad IIR section |
//! | [`kweighting`]  | ITU-R BS.1770-4 two-stage K-weighting filter |

pub mod biquad;
pub mod kweighting;

pub use biquad::{BiquadCoeffs, BiquadFilter};
pub use kweighting::{KWeightingCoeffs, KWeightingFilter};
