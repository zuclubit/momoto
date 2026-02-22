//! # Vibrancy Effects
//!
//! Apple HIG vibrancy levels for content over glass.

use momoto_core::space::oklch::OKLCH;

/// Vibrancy level determines how much background color bleeds through
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum VibrancyLevel {
    /// Primary vibrancy - most color through
    Primary,
    /// Secondary vibrancy - moderate color
    Secondary,
    /// Tertiary vibrancy - subtle color
    Tertiary,
    /// Divider vibrancy - minimal color
    Divider,
}

impl VibrancyLevel {
    /// Get blending factor (0.0 = no bleed, 1.0 = full bleed)
    pub fn blend_factor(&self) -> f64 {
        match self {
            VibrancyLevel::Primary => 0.75,
            VibrancyLevel::Secondary => 0.5,
            VibrancyLevel::Tertiary => 0.3,
            VibrancyLevel::Divider => 0.15,
        }
    }
}

/// Vibrancy effect applies background color to foreground
pub struct VibrancyEffect {
    level: VibrancyLevel,
}

impl VibrancyEffect {
    /// Create new vibrancy effect
    pub fn new(level: VibrancyLevel) -> Self {
        Self { level }
    }

    /// Apply vibrancy to foreground color given background
    pub fn apply(&self, foreground: OKLCH, background: OKLCH) -> OKLCH {
        let factor = self.level.blend_factor();

        OKLCH::new(
            foreground.l * (1.0 - factor) + background.l * factor,
            foreground.c * (1.0 - factor) + background.c * factor,
            foreground.h,
        )
    }

    /// Get vibrancy level
    pub fn level(&self) -> VibrancyLevel {
        self.level
    }
}
