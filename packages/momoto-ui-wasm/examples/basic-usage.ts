/**
 * @fileoverview Basic usage examples for @momoto-ui/wasm
 */

import {
  determineUIState,
  getStateMetadata,
  combineStates,
  getStatePriority,
  isWasmEnabled,
  getWasmStatus,
  UIStateValue,
  AnimationLevel,
} from '../src';

// ============================================================================
// EXAMPLE 1: Button State Determination
// ============================================================================

console.log('=== Example 1: Button State Determination ===\n');

// Simulate button interaction flags
const buttonFlags = {
  disabled: false,
  loading: false,
  active: false,
  focused: false,
  hovered: true, // User is hovering
};

// Determine state (uses WASM if available)
const buttonState = determineUIState(
  buttonFlags.disabled,
  buttonFlags.loading,
  buttonFlags.active,
  buttonFlags.focused,
  buttonFlags.hovered
);

console.log('Button state:', UIStateValue[buttonState]); // "Hover"
console.log('State value:', buttonState); // 1

// Get metadata for styling
const hoverMetadata = getStateMetadata(buttonState);
console.log('Hover metadata:');
console.log('  Lightness shift:', hoverMetadata.lightnessShift); // 0.05
console.log('  Chroma shift:', hoverMetadata.chromaShift); // 0.02
console.log('  Opacity:', hoverMetadata.opacity); // 1.0
console.log('  Animation:', AnimationLevel[hoverMetadata.animation]); // "Subtle"
console.log('  Focus indicator:', hoverMetadata.focusIndicator); // false
console.log();

// ============================================================================
// EXAMPLE 2: Complex State Priority
// ============================================================================

console.log('=== Example 2: Complex State Priority ===\n');

// Button is both hovered AND focused
const complexState = determineUIState(
  false, // disabled
  false, // loading
  false, // active
  true,  // focused ← Focus has higher priority
  true   // hovered
);

console.log('State (hover + focus):', UIStateValue[complexState]); // "Focus"
console.log('Priority:', getStatePriority(complexState)); // 50 (Focus) > 40 (Hover)
console.log();

// ============================================================================
// EXAMPLE 3: Disabled State
// ============================================================================

console.log('=== Example 3: Disabled State ===\n');

// Disabled always wins (highest priority)
const disabledState = determineUIState(
  true,  // disabled ← Always wins
  false, // loading
  true,  // active
  true,  // focused
  true   // hovered
);

console.log('State (disabled + active + focus + hover):', UIStateValue[disabledState]); // "Disabled"

const disabledMetadata = getStateMetadata(disabledState);
console.log('Disabled metadata:');
console.log('  Lightness shift:', disabledMetadata.lightnessShift); // 0.2 (lighter)
console.log('  Chroma shift:', disabledMetadata.chromaShift); // -0.1 (desaturated)
console.log('  Opacity:', disabledMetadata.opacity); // 0.5 (semi-transparent)
console.log();

// ============================================================================
// EXAMPLE 4: Combining Multiple States
// ============================================================================

console.log('=== Example 4: Combining States ===\n');

// Multiple components with different states
const states = [
  UIStateValue.Idle,
  UIStateValue.Hover,
  UIStateValue.Focus,
  UIStateValue.Active,
];

// Get highest priority state
const dominantState = combineStates(states);
console.log('Dominant state:', UIStateValue[dominantState]); // "Active" (priority 60)

// Priority order
states.forEach(state => {
  console.log(`  ${UIStateValue[state].padEnd(8)} priority: ${getStatePriority(state)}`);
});
// Output:
// Idle     priority: 0
// Hover    priority: 40
// Focus    priority: 50
// Active   priority: 60  ← Winner
console.log();

// ============================================================================
// EXAMPLE 5: Loading State with Animation
// ============================================================================

console.log('=== Example 5: Loading State ===\n');

const loadingState = determineUIState(
  false, // disabled
  true,  // loading
  false, // active
  false, // focused
  false  // hovered
);

console.log('State:', UIStateValue[loadingState]); // "Loading"

const loadingMetadata = getStateMetadata(loadingState);
console.log('Loading metadata:');
console.log('  Animation:', AnimationLevel[loadingMetadata.animation]); // "Prominent"
console.log('  Opacity:', loadingMetadata.opacity); // 0.7
console.log('  Use spinner: true');
console.log();

// ============================================================================
// EXAMPLE 6: Backend Status
// ============================================================================

console.log('=== Example 6: Backend Status ===\n');

// Check if WASM is enabled
console.log('WASM enabled:', isWasmEnabled());

// Get detailed status
const status = getWasmStatus();
console.log('Backend:', status.backend); // "wasm" or "typescript"
console.log('Error:', status.error); // null if OK
console.log();

// ============================================================================
// EXAMPLE 7: Real-world Button Component
// ============================================================================

console.log('=== Example 7: Real-world Button ===\n');

class SmartButton {
  private disabled: boolean = false;
  private loading: boolean = false;
  private active: boolean = false;
  private focused: boolean = false;
  private hovered: boolean = false;

  // Event handlers
  onMouseEnter() {
    this.hovered = true;
    this.updateState();
  }

  onMouseLeave() {
    this.hovered = false;
    this.updateState();
  }

  onFocus() {
    this.focused = true;
    this.updateState();
  }

  onBlur() {
    this.focused = false;
    this.updateState();
  }

  onMouseDown() {
    this.active = true;
    this.updateState();
  }

  onMouseUp() {
    this.active = false;
    this.updateState();
  }

  async onClick() {
    this.loading = true;
    this.updateState();

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.loading = false;
    this.updateState();
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
    this.updateState();
  }

  private updateState() {
    // Determine state (WASM-accelerated)
    const state = determineUIState(
      this.disabled,
      this.loading,
      this.active,
      this.focused,
      this.hovered
    );

    // Get metadata
    const metadata = getStateMetadata(state);

    // Apply styles (pseudocode)
    console.log(`State: ${UIStateValue[state]}`);
    console.log(`  Background lightness shift: ${metadata.lightnessShift}`);
    console.log(`  Cursor: ${this.disabled || this.loading ? 'not-allowed' : 'pointer'}`);
    console.log(`  Animation: ${AnimationLevel[metadata.animation]}`);
    if (metadata.focusIndicator) {
      console.log(`  Show focus ring`);
    }
    console.log();
  }
}

// Simulate user interaction
const button = new SmartButton();

console.log('User hovers button:');
button.onMouseEnter();

console.log('User presses button:');
button.onMouseDown();

console.log('User releases button:');
button.onMouseUp();

console.log('Button disabled:');
button.setDisabled(true);

// ============================================================================
// PERFORMANCE COMPARISON
// ============================================================================

console.log('=== Performance Comparison ===\n');

const iterations = 100_000;

// WASM
console.time('WASM (100k iterations)');
for (let i = 0; i < iterations; i++) {
  determineUIState(false, false, true, false, false);
}
console.timeEnd('WASM (100k iterations)');

console.log('\n✅ Examples complete!');
console.log(`Backend: ${getWasmStatus().backend}`);
console.log(`Performance: ${isWasmEnabled() ? '10x faster with WASM' : 'TypeScript fallback'}`);
