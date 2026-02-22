// =============================================================================
// momoto-events::event — Core event types
// =============================================================================

use serde::{Deserialize, Serialize};

/// Event category for filtering and routing.
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum EventCategory {
    Progress,
    Metrics,
    Recommendation,
    Validation,
    Error,
    System,
    Chart,
    Heartbeat,
    Custom,
}

/// Core event type with category, source, and JSON payload.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Event {
    pub category: EventCategory,
    pub source: String,
    pub timestamp_ms: u64,
    pub payload: serde_json::Value,
}

impl Event {
    /// Create a progress event.
    pub fn progress(source: &str, progress: f64, message: &str) -> Self {
        Self {
            category: EventCategory::Progress,
            source: source.to_string(),
            timestamp_ms: now_ms(),
            payload: serde_json::json!({
                "progress": progress,
                "message": message,
            }),
        }
    }

    /// Create a metric event.
    pub fn metric(source: &str, name: &str, value: f64) -> Self {
        Self {
            category: EventCategory::Metrics,
            source: source.to_string(),
            timestamp_ms: now_ms(),
            payload: serde_json::json!({
                "name": name,
                "value": value,
            }),
        }
    }

    /// Create an error event.
    pub fn error(source: &str, description: &str) -> Self {
        Self {
            category: EventCategory::Error,
            source: source.to_string(),
            timestamp_ms: now_ms(),
            payload: serde_json::json!({
                "description": description,
            }),
        }
    }

    /// Create a custom event with arbitrary JSON payload.
    pub fn custom(source: &str, payload: serde_json::Value) -> Self {
        Self {
            category: EventCategory::Custom,
            source: source.to_string(),
            timestamp_ms: now_ms(),
            payload,
        }
    }

    /// Deserialize event from JSON string.
    pub fn from_json(json: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(json)
    }

    /// Serialize event to JSON string.
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string(self)
    }
}

/// Returns current time in milliseconds.
/// In WASM targets, returns 0 (no std::time available without feature flags).
fn now_ms() -> u64 {
    #[cfg(not(target_arch = "wasm32"))]
    {
        use std::time::{SystemTime, UNIX_EPOCH};
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_millis() as u64)
            .unwrap_or(0)
    }
    #[cfg(target_arch = "wasm32")]
    {
        0
    }
}
