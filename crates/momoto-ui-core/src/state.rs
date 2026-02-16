//! UIState Machine - Type-safe interaction states
//!
//! This module implements the UI state machine for Momoto components.
//! It provides:
//! - State priority resolution (O(1))
//! - State metadata (perceptual shifts, animations)
//! - Compile-time state validation
//!
//! WASM exports allow TypeScript to use this for 10x performance improvement.

use wasm_bindgen::prelude::*;

// ============================================================================
// UISTATE ENUM
// ============================================================================

/// UI interaction states
///
/// Priority (highest to lowest):
/// 1. Disabled (100)
/// 2. Loading (90)
/// 3. Error (80)
/// 4. Success (75)
/// 5. Active (60)
/// 6. Focus (50)
/// 7. Hover (40)
/// 8. Idle (0)
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[repr(u8)]
pub enum UIState {
    Idle = 0,
    Hover = 1,
    Active = 2,
    Focus = 3,
    Disabled = 4,
    Loading = 5,
    Error = 6,
    Success = 7,
}

impl UIState {
    /// Determine state from interaction flags
    ///
    /// Uses priority encoding for O(1) determination.
    /// Highest priority state wins.
    #[inline]
    pub const fn determine(
        disabled: bool,
        loading: bool,
        active: bool,
        focused: bool,
        hovered: bool,
    ) -> Self {
        if disabled {
            return Self::Disabled;
        }
        if loading {
            return Self::Loading;
        }
        if active {
            return Self::Active;
        }
        if focused {
            return Self::Focus;
        }
        if hovered {
            return Self::Hover;
        }
        Self::Idle
    }

    /// Get state priority (higher = takes precedence)
    #[inline]
    pub const fn priority(self) -> u8 {
        match self {
            Self::Disabled => 100,
            Self::Loading => 90,
            Self::Error => 80,
            Self::Success => 75,
            Self::Active => 60,
            Self::Focus => 50,
            Self::Hover => 40,
            Self::Idle => 0,
        }
    }

    /// Get perceptual metadata for state
    #[inline]
    pub const fn metadata(self) -> StateMetadata {
        match self {
            Self::Idle => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.0,
                opacity: 1.0,
                animation: Animation::None,
                focus_indicator: false,
            },
            Self::Hover => StateMetadata {
                lightness_shift: 0.05,
                chroma_shift: 0.02,
                opacity: 1.0,
                animation: Animation::Subtle,
                focus_indicator: false,
            },
            Self::Active => StateMetadata {
                lightness_shift: -0.08,
                chroma_shift: 0.03,
                opacity: 1.0,
                animation: Animation::Medium,
                focus_indicator: false,
            },
            Self::Focus => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.0,
                opacity: 1.0,
                animation: Animation::Subtle,
                focus_indicator: true,
            },
            Self::Disabled => StateMetadata {
                lightness_shift: 0.2,
                chroma_shift: -0.1,
                opacity: 0.5,
                animation: Animation::None,
                focus_indicator: false,
            },
            Self::Loading => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: -0.05,
                opacity: 0.7,
                animation: Animation::Prominent,
                focus_indicator: false,
            },
            Self::Error => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.1,
                opacity: 1.0,
                animation: Animation::Medium,
                focus_indicator: false,
            },
            Self::Success => StateMetadata {
                lightness_shift: 0.0,
                chroma_shift: 0.05,
                opacity: 1.0,
                animation: Animation::Subtle,
                focus_indicator: false,
            },
        }
    }

    /// Convert from u8 (for WASM interop)
    #[inline]
    pub const fn from_u8(value: u8) -> Self {
        match value {
            0 => Self::Idle,
            1 => Self::Hover,
            2 => Self::Active,
            3 => Self::Focus,
            4 => Self::Disabled,
            5 => Self::Loading,
            6 => Self::Error,
            7 => Self::Success,
            _ => Self::Idle, // Fallback to Idle for invalid values
        }
    }
}

// ============================================================================
// STATE METADATA
// ============================================================================

/// Perceptual metadata for UI state
///
/// Defines how a state affects visual appearance:
/// - Lightness/chroma shifts for color adjustments
/// - Opacity for disabled/loading states
/// - Animation level
/// - Focus indicator requirement
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct StateMetadata {
    /// Lightness shift to apply [-1.0, 1.0]
    pub lightness_shift: f64,

    /// Chroma shift to apply [-1.0, 1.0]
    pub chroma_shift: f64,

    /// Opacity multiplier [0.0, 1.0]
    pub opacity: f64,

    /// Animation level (private, use getter)
    animation: Animation,

    /// Whether focus indicator is required
    focus_indicator: bool,
}

#[wasm_bindgen]
impl StateMetadata {
    /// Get animation level as u8
    #[wasm_bindgen(getter)]
    pub fn animation(&self) -> u8 {
        self.animation as u8
    }

    /// Check if focus indicator is required
    #[wasm_bindgen(getter)]
    pub fn focus_indicator(&self) -> bool {
        self.focus_indicator
    }
}

// ============================================================================
// ANIMATION LEVELS
// ============================================================================

/// Animation levels for state transitions
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum Animation {
    None = 0,
    Subtle = 1,
    Medium = 2,
    Prominent = 3,
}

// ============================================================================
// WASM EXPORTS
// ============================================================================

/// Determine UI state from interaction flags
///
/// # Arguments
/// * `disabled` - Component is disabled
/// * `loading` - Component is in loading state
/// * `active` - Component is being pressed/clicked
/// * `focused` - Component has keyboard focus
/// * `hovered` - Component is being hovered
///
/// # Returns
/// State as u8 (0=Idle, 1=Hover, 2=Active, 3=Focus, 4=Disabled, 5=Loading, 6=Error, 7=Success)
///
/// # Example
/// ```typescript
/// import { determine_ui_state } from 'momoto-ui-wasm';
/// const state = determine_ui_state(false, false, true, false, false);
/// // state === 2 (Active)
/// ```
#[wasm_bindgen]
pub fn determine_ui_state(
    disabled: bool,
    loading: bool,
    active: bool,
    focused: bool,
    hovered: bool,
) -> u8 {
    UIState::determine(disabled, loading, active, focused, hovered) as u8
}

/// Get state metadata for a given state
///
/// # Arguments
/// * `state` - State value (0-7)
///
/// # Returns
/// StateMetadata with perceptual shifts and animation info
///
/// # Example
/// ```typescript
/// import { get_state_metadata } from 'momoto-ui-wasm';
/// const metadata = get_state_metadata(1); // Hover
/// console.log(metadata.lightness_shift); // 0.05
/// ```
#[wasm_bindgen]
pub fn get_state_metadata(state: u8) -> StateMetadata {
    UIState::from_u8(state).metadata()
}

/// Get state priority
///
/// # Arguments
/// * `state` - State value (0-7)
///
/// # Returns
/// Priority as u8 (higher = takes precedence)
#[wasm_bindgen]
pub fn get_state_priority(state: u8) -> u8 {
    UIState::from_u8(state).priority()
}

/// Combine multiple states, returning the highest priority
///
/// # Arguments
/// * `states` - Array of state values
///
/// # Returns
/// Highest priority state as u8
///
/// # Example
/// ```typescript
/// import { combine_states } from 'momoto-ui-wasm';
/// const result = combine_states(new Uint8Array([1, 3, 0])); // Hover, Focus, Idle
/// // result === 3 (Focus has higher priority than Hover)
/// ```
#[wasm_bindgen]
pub fn combine_states(states: &[u8]) -> u8 {
    if states.is_empty() {
        return UIState::Idle as u8;
    }

    states
        .iter()
        .map(|&s| UIState::from_u8(s))
        .max_by_key(|s| s.priority())
        .unwrap_or(UIState::Idle) as u8
}

// ============================================================================
// TESTS
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_state_priority_disabled_wins() {
        let state = UIState::determine(true, false, true, false, false);
        assert_eq!(state, UIState::Disabled);
    }

    #[test]
    fn test_state_priority_loading_over_active() {
        let state = UIState::determine(false, true, true, false, false);
        assert_eq!(state, UIState::Loading);
    }

    #[test]
    fn test_state_priority_active_over_hover() {
        let state = UIState::determine(false, false, true, false, true);
        assert_eq!(state, UIState::Active);
    }

    #[test]
    fn test_state_priority_focus_over_hover() {
        let state = UIState::determine(false, false, false, true, true);
        assert_eq!(state, UIState::Focus);
    }

    #[test]
    fn test_state_priority_hover_over_idle() {
        let state = UIState::determine(false, false, false, false, true);
        assert_eq!(state, UIState::Hover);
    }

    #[test]
    fn test_state_priority_idle_default() {
        let state = UIState::determine(false, false, false, false, false);
        assert_eq!(state, UIState::Idle);
    }

    #[test]
    fn test_hover_metadata() {
        let metadata = UIState::Hover.metadata();
        assert_eq!(metadata.lightness_shift, 0.05);
        assert_eq!(metadata.chroma_shift, 0.02);
        assert_eq!(metadata.opacity, 1.0);
        assert_eq!(metadata.animation, Animation::Subtle);
        assert_eq!(metadata.focus_indicator, false);
    }

    #[test]
    fn test_disabled_metadata() {
        let metadata = UIState::Disabled.metadata();
        assert_eq!(metadata.lightness_shift, 0.2);
        assert_eq!(metadata.chroma_shift, -0.1);
        assert_eq!(metadata.opacity, 0.5);
        assert_eq!(metadata.animation, Animation::None);
        assert_eq!(metadata.focus_indicator, false);
    }

    #[test]
    fn test_focus_indicator() {
        let focus = UIState::Focus.metadata();
        assert_eq!(focus.focus_indicator, true);

        let hover = UIState::Hover.metadata();
        assert_eq!(hover.focus_indicator, false);
    }

    #[test]
    fn test_combine_states() {
        let states = [
            UIState::Hover as u8,
            UIState::Focus as u8,
            UIState::Idle as u8,
        ];
        let result = combine_states(&states);
        assert_eq!(result, UIState::Focus as u8);
    }

    #[test]
    fn test_from_u8() {
        assert_eq!(UIState::from_u8(0), UIState::Idle);
        assert_eq!(UIState::from_u8(1), UIState::Hover);
        assert_eq!(UIState::from_u8(4), UIState::Disabled);
        assert_eq!(UIState::from_u8(99), UIState::Idle); // Invalid fallback
    }
}
