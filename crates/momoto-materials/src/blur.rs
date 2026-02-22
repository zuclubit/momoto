//! # Backdrop Blur Calculations
//!
//! Utilities for calculating backdrop blur effects.

/// Blur intensity levels matching Apple HIG
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum BlurIntensity {
    /// No blur
    None,
    /// Light blur (10px)
    Light,
    /// Medium blur (20px)
    Medium,
    /// Heavy blur (30px)
    Heavy,
    /// Extra heavy blur (40px)
    ExtraHeavy,
    /// Custom blur radius
    Custom(f64),
}

impl BlurIntensity {
    /// Get blur radius in pixels
    pub fn radius(&self) -> f64 {
        match self {
            BlurIntensity::None => 0.0,
            BlurIntensity::Light => 10.0,
            BlurIntensity::Medium => 20.0,
            BlurIntensity::Heavy => 30.0,
            BlurIntensity::ExtraHeavy => 40.0,
            BlurIntensity::Custom(r) => *r,
        }
    }

    /// Get saturation boost (1.0 = no boost, 1.5 = 50% boost)
    pub fn saturation_boost(&self) -> f64 {
        match self {
            BlurIntensity::None => 1.0,
            BlurIntensity::Light => 1.1,
            BlurIntensity::Medium => 1.2,
            BlurIntensity::Heavy => 1.3,
            BlurIntensity::ExtraHeavy => 1.5,
            BlurIntensity::Custom(_) => 1.2,
        }
    }
}
