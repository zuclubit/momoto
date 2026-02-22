//! # SI Units and Unit Conversions
//!
//! Formal unit system for metrological measurements.

use std::fmt;

// ============================================================================
// UNIT ENUM
// ============================================================================

/// Physical units for measurements.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Unit {
    /// Dimensionless quantity (ratio, fraction).
    Dimensionless,
    /// Wavelength in nanometers.
    Nanometers,
    /// Angle in radians.
    Radians,
    /// Angle in degrees.
    Degrees,
    /// Temperature in Kelvin.
    Kelvin,
    /// Percentage (0-100).
    Percent,
    /// Color difference (CIEDE2000).
    DeltaE,
    /// Time in seconds.
    Seconds,
    /// Time in milliseconds.
    Milliseconds,
    /// Refractive index.
    RefractiveIndex,
    /// Extinction coefficient.
    ExtinctionCoeff,
    /// Film thickness in nanometers.
    ThicknessNm,
    /// Reflectance (0-1).
    Reflectance,
    /// Transmittance (0-1).
    Transmittance,
    /// Steradians (solid angle).
    Steradians,
    /// Per steradian (BRDF units).
    PerSteradian,
}

impl Unit {
    /// Get unit symbol for display.
    pub fn symbol(&self) -> &'static str {
        match self {
            Unit::Dimensionless => "",
            Unit::Nanometers => "nm",
            Unit::Radians => "rad",
            Unit::Degrees => "°",
            Unit::Kelvin => "K",
            Unit::Percent => "%",
            Unit::DeltaE => "ΔE",
            Unit::Seconds => "s",
            Unit::Milliseconds => "ms",
            Unit::RefractiveIndex => "n",
            Unit::ExtinctionCoeff => "k",
            Unit::ThicknessNm => "nm",
            Unit::Reflectance => "R",
            Unit::Transmittance => "T",
            Unit::Steradians => "sr",
            Unit::PerSteradian => "sr⁻¹",
        }
    }

    /// Get full unit name.
    pub fn name(&self) -> &'static str {
        match self {
            Unit::Dimensionless => "dimensionless",
            Unit::Nanometers => "nanometers",
            Unit::Radians => "radians",
            Unit::Degrees => "degrees",
            Unit::Kelvin => "kelvin",
            Unit::Percent => "percent",
            Unit::DeltaE => "delta E",
            Unit::Seconds => "seconds",
            Unit::Milliseconds => "milliseconds",
            Unit::RefractiveIndex => "refractive index",
            Unit::ExtinctionCoeff => "extinction coefficient",
            Unit::ThicknessNm => "thickness (nm)",
            Unit::Reflectance => "reflectance",
            Unit::Transmittance => "transmittance",
            Unit::Steradians => "steradians",
            Unit::PerSteradian => "per steradian",
        }
    }

    /// Check if unit is angular.
    pub fn is_angular(&self) -> bool {
        matches!(self, Unit::Radians | Unit::Degrees | Unit::Steradians)
    }

    /// Check if unit is spectral.
    pub fn is_spectral(&self) -> bool {
        matches!(self, Unit::Nanometers)
    }

    /// Check if unit is optical property.
    pub fn is_optical(&self) -> bool {
        matches!(
            self,
            Unit::RefractiveIndex
                | Unit::ExtinctionCoeff
                | Unit::Reflectance
                | Unit::Transmittance
                | Unit::PerSteradian
        )
    }
}

impl fmt::Display for Unit {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.symbol())
    }
}

// ============================================================================
// UNIT VALUE
// ============================================================================

/// Value with associated unit.
#[derive(Debug, Clone, Copy)]
pub struct UnitValue {
    /// Numeric value.
    pub value: f64,
    /// Physical unit.
    pub unit: Unit,
}

impl UnitValue {
    /// Create new unit value.
    pub fn new(value: f64, unit: Unit) -> Self {
        Self { value, unit }
    }

    /// Create dimensionless value.
    pub fn dimensionless(value: f64) -> Self {
        Self::new(value, Unit::Dimensionless)
    }

    /// Create wavelength in nm.
    pub fn nanometers(value: f64) -> Self {
        Self::new(value, Unit::Nanometers)
    }

    /// Create angle in radians.
    pub fn radians(value: f64) -> Self {
        Self::new(value, Unit::Radians)
    }

    /// Create angle in degrees.
    pub fn degrees(value: f64) -> Self {
        Self::new(value, Unit::Degrees)
    }

    /// Create temperature in Kelvin.
    pub fn kelvin(value: f64) -> Self {
        Self::new(value, Unit::Kelvin)
    }

    /// Create percentage.
    pub fn percent(value: f64) -> Self {
        Self::new(value, Unit::Percent)
    }

    /// Create delta E value.
    pub fn delta_e(value: f64) -> Self {
        Self::new(value, Unit::DeltaE)
    }

    /// Create reflectance value.
    pub fn reflectance(value: f64) -> Self {
        Self::new(value, Unit::Reflectance)
    }

    /// Create transmittance value.
    pub fn transmittance(value: f64) -> Self {
        Self::new(value, Unit::Transmittance)
    }
}

impl fmt::Display for UnitValue {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        if self.unit == Unit::Dimensionless {
            write!(f, "{:.6}", self.value)
        } else {
            write!(f, "{:.6} {}", self.value, self.unit.symbol())
        }
    }
}

// ============================================================================
// UNIT CONVERSIONS
// ============================================================================

/// Convert degrees to radians.
pub fn deg_to_rad(degrees: f64) -> f64 {
    degrees * std::f64::consts::PI / 180.0
}

/// Convert radians to degrees.
pub fn rad_to_deg(radians: f64) -> f64 {
    radians * 180.0 / std::f64::consts::PI
}

/// Convert percentage to fraction (0-1).
pub fn percent_to_fraction(percent: f64) -> f64 {
    percent / 100.0
}

/// Convert fraction (0-1) to percentage.
pub fn fraction_to_percent(fraction: f64) -> f64 {
    fraction * 100.0
}

/// Convert Celsius to Kelvin.
pub fn celsius_to_kelvin(celsius: f64) -> f64 {
    celsius + 273.15
}

/// Convert Kelvin to Celsius.
pub fn kelvin_to_celsius(kelvin: f64) -> f64 {
    kelvin - 273.15
}

/// Convert micrometers to nanometers.
pub fn um_to_nm(micrometers: f64) -> f64 {
    micrometers * 1000.0
}

/// Convert nanometers to micrometers.
pub fn nm_to_um(nanometers: f64) -> f64 {
    nanometers / 1000.0
}

// ============================================================================
// UNIT COMPATIBILITY
// ============================================================================

/// Check if two units are compatible for arithmetic.
pub fn units_compatible(a: Unit, b: Unit) -> bool {
    match (a, b) {
        // Same units always compatible
        (x, y) if x == y => true,
        // Angular units compatible
        (Unit::Radians, Unit::Degrees) | (Unit::Degrees, Unit::Radians) => true,
        // Optical ratios compatible
        (Unit::Reflectance, Unit::Transmittance)
        | (Unit::Transmittance, Unit::Reflectance)
        | (Unit::Reflectance, Unit::Dimensionless)
        | (Unit::Transmittance, Unit::Dimensionless)
        | (Unit::Dimensionless, Unit::Reflectance)
        | (Unit::Dimensionless, Unit::Transmittance) => true,
        // Percent and dimensionless
        (Unit::Percent, Unit::Dimensionless) | (Unit::Dimensionless, Unit::Percent) => true,
        _ => false,
    }
}

/// Convert unit value to target unit if compatible.
pub fn convert_unit(value: UnitValue, target: Unit) -> Option<UnitValue> {
    if value.unit == target {
        return Some(value);
    }

    let converted = match (value.unit, target) {
        (Unit::Radians, Unit::Degrees) => rad_to_deg(value.value),
        (Unit::Degrees, Unit::Radians) => deg_to_rad(value.value),
        (Unit::Percent, Unit::Dimensionless) => percent_to_fraction(value.value),
        (Unit::Dimensionless, Unit::Percent) => fraction_to_percent(value.value),
        (Unit::Nanometers, Unit::ThicknessNm) => value.value,
        (Unit::ThicknessNm, Unit::Nanometers) => value.value,
        _ => return None,
    };

    Some(UnitValue::new(converted, target))
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unit_symbols() {
        assert_eq!(Unit::Nanometers.symbol(), "nm");
        assert_eq!(Unit::Degrees.symbol(), "°");
        assert_eq!(Unit::DeltaE.symbol(), "ΔE");
    }

    #[test]
    fn test_unit_value_display() {
        let v = UnitValue::nanometers(550.0);
        assert!(v.to_string().contains("nm"));
    }

    #[test]
    fn test_deg_rad_conversion() {
        let deg = 90.0;
        let rad = deg_to_rad(deg);
        assert!((rad - std::f64::consts::FRAC_PI_2).abs() < 1e-10);
        assert!((rad_to_deg(rad) - deg).abs() < 1e-10);
    }

    #[test]
    fn test_percent_fraction() {
        assert!((percent_to_fraction(50.0) - 0.5).abs() < 1e-10);
        assert!((fraction_to_percent(0.25) - 25.0).abs() < 1e-10);
    }

    #[test]
    fn test_temperature_conversion() {
        assert!((celsius_to_kelvin(0.0) - 273.15).abs() < 1e-10);
        assert!((kelvin_to_celsius(373.15) - 100.0).abs() < 1e-10);
    }

    #[test]
    fn test_units_compatible() {
        assert!(units_compatible(Unit::Radians, Unit::Degrees));
        assert!(units_compatible(Unit::Reflectance, Unit::Transmittance));
        assert!(!units_compatible(Unit::Nanometers, Unit::Kelvin));
    }

    #[test]
    fn test_convert_unit() {
        let deg = UnitValue::degrees(180.0);
        let rad = convert_unit(deg, Unit::Radians).unwrap();
        assert!((rad.value - std::f64::consts::PI).abs() < 1e-10);
    }
}
