//! AI Contract types for declarative color constraints.

use serde::{Deserialize, Serialize};

/// Contrast measurement standard.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub enum ContrastStandard {
    Wcag,
    Apca,
}

/// WCAG compliance level.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub enum ComplianceLevel {
    AA,
    AAA,
    #[serde(rename = "AA_Large")]
    AALarge,
}

/// Color gamut target.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub enum Gamut {
    Srgb,
    P3,
    Rec2020,
}

/// A single constraint within a contract.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct Constraint {
    pub kind: String,
    pub params: serde_json::Value,
}

impl Constraint {
    pub fn min_contrast_wcag_aa(background: &str) -> Self {
        Self {
            kind: "min_contrast_wcag_aa".into(),
            params: serde_json::json!({"background": background}),
        }
    }

    pub fn min_contrast_wcag_aaa(background: &str) -> Self {
        Self {
            kind: "min_contrast_wcag_aaa".into(),
            params: serde_json::json!({"background": background}),
        }
    }

    pub fn min_apca(lc: f64, background: &str) -> Self {
        Self {
            kind: "min_apca".into(),
            params: serde_json::json!({"lc": lc, "background": background}),
        }
    }

    pub fn in_gamut(gamut: Gamut) -> Self {
        Self {
            kind: "in_gamut".into(),
            params: serde_json::json!({"gamut": format!("{:?}", gamut)}),
        }
    }

    /// Constrain the OKLCH lightness channel to [min, max].
    pub fn lightness_range(min: f32, max: f32) -> Self {
        Self {
            kind: "lightness_range".into(),
            params: serde_json::json!({"min": min, "max": max}),
        }
    }

    /// Constrain the OKLCH chroma channel to [min, max].
    pub fn chroma_range(min: f32, max: f32) -> Self {
        Self {
            kind: "chroma_range".into(),
            params: serde_json::json!({"min": min, "max": max}),
        }
    }

    /// Constrain the OKLCH hue angle to [min, max] degrees.
    pub fn hue_range(min: f32, max: f32) -> Self {
        Self {
            kind: "hue_range".into(),
            params: serde_json::json!({"min": min, "max": max}),
        }
    }
}

/// Semantic version for a contract specification.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Version {
    /// Major version number (breaking changes).
    pub major: u32,
    /// Minor version number (additive changes).
    pub minor: u32,
}

impl Default for Version {
    fn default() -> Self {
        Self { major: 1, minor: 0 }
    }
}

/// Declarative specification of color constraints.
///
/// # Fields
/// Only `version` and `constraints` are public struct fields — this ensures
/// compatibility with the WASM bindings that construct `Contract` via a struct
/// literal. Additional metadata (description) is accessible via builder methods.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct Contract {
    /// Contract schema version.
    pub version: Version,
    /// The ordered list of constraints to enforce.
    pub constraints: Vec<Constraint>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            version: Version::default(),
            constraints: Vec::new(),
        }
    }
}

impl Contract {
    /// Create an empty contract with the default version.
    pub fn new() -> Self {
        Self::default()
    }

    /// Add a constraint to the contract (builder).
    pub fn with_constraint(mut self, c: Constraint) -> Self {
        self.constraints.push(c);
        self
    }

    /// Whether the contract has no constraints.
    pub fn is_empty(&self) -> bool {
        self.constraints.is_empty()
    }

    /// Serialise the contract to a JSON string.
    pub fn to_json(&self) -> String {
        serde_json::to_string(self).unwrap_or_else(|_| "{}".to_string())
    }
}
