//! Response types for the agent protocol.

use serde::{Deserialize, Serialize};

/// Context information for a color pair evaluation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ContextInfo {
    pub usage: String,
    pub target: String,
    pub min_wcag_ratio: f64,
    pub min_apca_lc: f64,
    pub session_id: Option<String>,
    pub turn: u32,
}

impl Default for ContextInfo {
    fn default() -> Self {
        Self {
            usage: "body_text".to_string(),
            target: "wcag_aa".to_string(),
            min_wcag_ratio: 4.5,
            min_apca_lc: 60.0,
            session_id: None,
            turn: 0,
        }
    }
}

/// Color metrics for a single color.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ColorMetrics {
    pub hex: String,
    pub oklch: [f64; 3],
    pub srgb: [u8; 3],
    pub relative_luminance: f64,
    pub lightness: f64,
    pub chroma: f64,
    pub hue: f64,
    pub ior: f64,
    pub category: String,
    pub dispersion: Option<f64>,
    pub has_scattering: bool,
}

impl Default for ColorMetrics {
    fn default() -> Self {
        Self {
            hex: "#000000".to_string(),
            oklch: [0.0, 0.0, 0.0],
            srgb: [0, 0, 0],
            relative_luminance: 0.0,
            lightness: 0.0,
            chroma: 0.0,
            hue: 0.0,
            ior: 1.5,
            category: "glass".to_string(),
            dispersion: None,
            has_scattering: false,
        }
    }
}

/// A contract violation.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct Violation {
    pub description: String,
    pub severity: String,
}

/// Response to a validation query.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ValidationResponse {
    pub is_valid: bool,
    pub violations: Vec<Violation>,
    pub metrics: Option<ColorMetrics>,
}

impl ValidationResponse {
    pub fn is_valid(&self) -> bool {
        self.is_valid
    }
}

/// Modification detail for a single property.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ModificationDetail {
    pub property: String,
    pub before: f64,
    pub after: f64,
}

/// Aggregated modification info.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[allow(dead_code)]
pub struct ModificationInfo {
    pub changes: Vec<ModificationDetail>,
}

/// Response to a recommendation or improvement query.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct RecommendationResponse {
    pub color: String,
    pub oklch: [f64; 3],
    pub srgb: [u8; 3],
    pub quality_score: f64,
    pub confidence: f64,
    pub reason: String,
    pub assessment: String,
    pub modification: Option<ModificationInfo>,
    pub context: ContextInfo,
}

/// Response to a score query.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ScoreResponse {
    pub foreground: String,
    pub background: String,
    pub overall: f64,
    pub compliance: f64,
    pub perceptual: f64,
    pub appropriateness: f64,
    pub passes: bool,
    pub assessment: String,
    pub context: ContextInfo,
    pub wcag_ratio: f64,
    pub apca_lc: f64,
}

/// Response to an adjust_color query.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct AdjustedColorResponse {
    pub adjusted: String,
    pub description: String,
    pub modifications: ModificationInfo,
}

/// Response to a color conversion query.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ColorConversionResponse {
    pub space: String,
    pub values: serde_json::Value,
}

/// Response to a color difference query.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ColorDifferenceResponse {
    pub delta_e: f64,
    pub perceptual_difference: String,
}

/// Response to a gamut check query.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct GamutCheckResponse {
    pub in_gamut: bool,
    pub gamut: String,
    pub nearest_in_gamut: Option<String>,
}

/// Material category information.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct MaterialCategory {
    pub name: String,
    pub count: u32,
}

/// Single material info.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct MaterialResponse {
    pub name: String,
    pub description: String,
    pub ior: f64,
    pub category: String,
    pub dispersion: Option<f64>,
    pub has_scattering: bool,
}

/// List of materials response.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct MaterialListResponse {
    pub materials: Vec<MaterialResponse>,
    pub total: usize,
    pub categories: Vec<MaterialCategory>,
}

/// CSS representation of a material.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct MaterialCssResponse {
    pub css: String,
}

/// Error info for error responses.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub struct ErrorInfo {
    pub message: String,
    pub code: Option<String>,
}

/// The main response enum returned by the executor.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[allow(dead_code)]
pub enum Response {
    Json(serde_json::Value),
    Error(ErrorInfo),
    Text(String),
    Empty,
    Validation(ValidationResponse),
    Recommendation(RecommendationResponse),
    Score(ScoreResponse),
    Metrics(ColorMetrics),
    Material(Option<MaterialResponse>),
    Materials(MaterialListResponse),
    Conversion(ColorConversionResponse),
    Adjusted(AdjustedColorResponse),
    GamutCheck(GamutCheckResponse),
    ColorDiff(ColorDifferenceResponse),
}
