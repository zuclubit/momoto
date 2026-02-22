//! # Material Design 3 Elevation System
//!
//! Implements Material Design 3 elevation with surface tints.

use crate::glass::LiquidGlass;
use momoto_core::color::Color;
use momoto_core::space::oklch::OKLCH;

/// Material Design 3 elevation levels
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
#[repr(u8)]
pub enum Elevation {
    /// Level 0 - Base surface
    Level0 = 0,
    /// Level 1 - 1dp elevation
    Level1 = 1,
    /// Level 2 - 3dp elevation
    Level2 = 2,
    /// Level 3 - 6dp elevation
    Level3 = 3,
    /// Level 4 - 8dp elevation
    Level4 = 4,
    /// Level 5 - 12dp elevation
    Level5 = 5,
}

impl Elevation {
    /// Get elevation value in dp
    pub fn dp(&self) -> f64 {
        match self {
            Elevation::Level0 => 0.0,
            Elevation::Level1 => 1.0,
            Elevation::Level2 => 3.0,
            Elevation::Level3 => 6.0,
            Elevation::Level4 => 8.0,
            Elevation::Level5 => 12.0,
        }
    }

    /// Get surface tint overlay opacity for this elevation
    pub fn tint_opacity(&self) -> f64 {
        match self {
            Elevation::Level0 => 0.0,
            Elevation::Level1 => 0.05,
            Elevation::Level2 => 0.08,
            Elevation::Level3 => 0.11,
            Elevation::Level4 => 0.12,
            Elevation::Level5 => 0.14,
        }
    }
}

/// Material surface with elevation and optional glass effect
pub struct MaterialSurface {
    elevation: Elevation,
    surface_tint: OKLCH,
    glass_overlay: Option<LiquidGlass>,
}

impl MaterialSurface {
    /// Create material surface from elevation and theme color
    pub fn new(elevation: Elevation, theme_primary: OKLCH) -> Self {
        Self {
            elevation,
            surface_tint: theme_primary,
            glass_overlay: None,
        }
    }

    /// Apply glass overlay to elevated surface
    pub fn with_glass(mut self, glass: LiquidGlass) -> Self {
        self.glass_overlay = Some(glass);
        self
    }

    /// Calculate final surface color over base
    pub fn surface_color(&self, base_surface: Color) -> Color {
        let base_oklch = base_surface.to_oklch();
        let tint_alpha = self.elevation.tint_opacity();

        // Apply tint overlay
        let tinted = OKLCH::new(
            base_oklch.l * (1.0 - tint_alpha) + self.surface_tint.l * tint_alpha,
            base_oklch.c * (1.0 - tint_alpha) + self.surface_tint.c * tint_alpha,
            if tint_alpha > 0.01 {
                self.surface_tint.h
            } else {
                base_oklch.h
            },
        );

        let tinted_color = tinted.to_color();

        // Apply glass if present
        if let Some(glass) = &self.glass_overlay {
            glass.effective_color(tinted_color)
        } else {
            tinted_color
        }
    }

    /// Get elevation
    pub fn elevation(&self) -> Elevation {
        self.elevation
    }

    /// Get surface tint
    pub fn surface_tint(&self) -> OKLCH {
        self.surface_tint
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_elevation_dp() {
        assert_eq!(Elevation::Level0.dp(), 0.0);
        assert_eq!(Elevation::Level3.dp(), 6.0);
        assert_eq!(Elevation::Level5.dp(), 12.0);
    }

    #[test]
    fn test_elevation_tint_opacity() {
        assert_eq!(Elevation::Level0.tint_opacity(), 0.0);
        assert!(Elevation::Level3.tint_opacity() > 0.0);
        assert!(Elevation::Level5.tint_opacity() > Elevation::Level1.tint_opacity());
    }

    #[test]
    fn test_material_surface() {
        let primary = OKLCH::new(0.55, 0.14, 240.0); // Blue
        let surface = MaterialSurface::new(Elevation::Level3, primary);

        assert_eq!(surface.elevation(), Elevation::Level3);
        assert_eq!(surface.surface_tint(), primary);
    }
}
