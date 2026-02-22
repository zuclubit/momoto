// =============================================================================
// momoto-events: Pub/sub event system for Momoto engine
//
// Provides Event, EventBroadcaster, and EventStream primitives used by
// momoto-wasm/src/events.rs WASM bindings.
// =============================================================================

pub mod event;
pub mod broadcaster;
pub mod stream;

pub use event::{Event, EventCategory};
pub use broadcaster::{EventBroadcaster, EventFilter, BroadcasterConfig, EventHandler, Subscription};
pub use stream::{EventStream, StreamConfig, StreamState};
