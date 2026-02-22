//! Physical acoustic models.
//!
//! | Module | Purpose |
//! |--------|---------|
//! | [`fft`] | Cooley-Tukey Radix-2 DIT FFT with preallocated plan |

pub mod fft;

pub use fft::FftPlan;
