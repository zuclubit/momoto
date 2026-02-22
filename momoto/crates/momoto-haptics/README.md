# momoto-haptics

**Haptic / vibrotactile output domain for the Momoto Multimodal Perceptual Physics Engine.**

Models actuator energy budgets, frequency-force response curves (Weber's law),
and waveform generation — fully in safe, `no_std`-compatible Rust.

[![crates.io](https://img.shields.io/crates/v/momoto-haptics)](https://crates.io/crates/momoto-haptics)
[![docs.rs](https://img.shields.io/docsrs/momoto-haptics)](https://docs.rs/momoto-haptics)

---

## Module overview

| Module | Subsystem | Physical model |
|--------|-----------|---------------|
| `energy` | `EnergyBudget` — consumption + recharge | `∫P(t)dt ≤ capacity_joules` |
| `mapping` | `FrequencyForceMapper` — perceptual intensity → vibration | Weber's law (√ scaling) |
| `waveform` | `HapticWaveform` — Sine / Pulse / Ramp / Buzz | Time-domain sample generation |
| `domain` | `HapticsDomain` — `Domain` + `EnergyConserving` contracts | momoto-core traits |

---

## Quick start

### LRA energy budget

```rust
use momoto_haptics::EnergyBudget;

// Typical smartphone LRA: 50 mJ capacity, 10 mJ/s passive recharge
let mut budget = EnergyBudget::with_recharge(0.050, 0.010);

// UI tap feedback: 5 mJ
budget.try_consume(0.005).expect("tap ok");
println!("Remaining: {:.1} mJ", budget.available_j() * 1000.0);

// Time passes (0.5 s) → recharge
budget.tick(0.5);

// Notification pulse: 20 mJ
match budget.try_consume(0.020) {
    Ok(()) => println!("Notification delivered"),
    Err(e)  => println!("Budget exceeded: {}", e),
}
```

### Frequency-force mapping (Weber's law)

```rust
use momoto_haptics::{ActuatorModel, VibrationSpec};
use momoto_haptics::mapping::FrequencyForceMapper;

let mapper = FrequencyForceMapper::new(ActuatorModel::Lra);

// Perceptual intensity 0.0–1.0 → VibrationSpec
let spec: VibrationSpec = mapper.map(0.7, 120.0 /* duration_ms */);
println!("Frequency: {:.0} Hz   Force: {:.4} N", spec.freq_hz, spec.force_n);
println!("Energy: {:.4} J", spec.energy_j());
```

### Waveform generation

```rust
use momoto_haptics::{HapticWaveform, WaveformKind};

// 200 Hz buzz for 100 ms at 80% amplitude, 8 kHz haptic DAC rate
let wave = HapticWaveform::generate(
    WaveformKind::Buzz,
    200.0,  // freq_hz
    100.0,  // duration_ms
    0.8,    // amplitude
    8_000,  // sample_rate
);

println!("Samples: {}  Peak: {:.3}",
    wave.samples.len(),
    wave.samples.iter().cloned().fold(0.0f32, f32::max),
);
```

### 5-event haptic sequence

```rust
use momoto_haptics::{EnergyBudget, HapticWaveform, WaveformKind};

let mut budget = EnergyBudget::new(0.050); // 50 mJ

let events = [
    (WaveformKind::Sine,  150.0, 80.0,  0.5),
    (WaveformKind::Pulse, 200.0, 30.0,  0.9),
    (WaveformKind::Ramp,  180.0, 120.0, 0.7),
    (WaveformKind::Buzz,  220.0, 50.0,  0.6),
    (WaveformKind::Sine,  160.0, 200.0, 0.4),
];

for (kind, freq, dur_ms, amp) in events {
    let wave = HapticWaveform::generate(kind, freq, dur_ms, amp, 8_000);
    let energy = 0.5 * amp * amp * (dur_ms / 1000.0) * 0.001; // simplified
    match budget.try_consume(energy) {
        Ok(()) => println!("{:?} @ {:.0} Hz — delivered ({:.4} J)", kind, freq, energy),
        Err(e)  => println!("{:?} — skipped: {}", kind, e),
    }
}
println!("Final load: {:.1}%", budget.load_fraction() * 100.0);
```

---

## Actuator models

| Model | Resonant freq. | Max force | Bandwidth | Use case |
|-------|---------------|-----------|-----------|----------|
| `Lra` | ~150–200 Hz | 0.5 N | Narrow | Smartphone haptic |
| `Erm` | 80–300 Hz | 1.0 N | Broad | Gamepad rumble |
| `Piezo` | 200–1 000 Hz | 2.0 N | Wide | Precision haptics |
| `Custom { … }` | Configurable | Configurable | — | Device-specific |

---

## Full public API

| Type / Function | Description |
|-----------------|-------------|
| `EnergyBudget::new(capacity_j)` | Fixed-capacity budget (joules) |
| `EnergyBudget::with_recharge(j, j_per_s)` | Budget with passive recharge |
| `EnergyBudget::try_consume(j)` | Consume energy or return `Err` if exceeded |
| `EnergyBudget::tick(secs)` | Advance time, recover energy via recharge |
| `EnergyBudget::available_j()` | Remaining energy (joules) |
| `EnergyBudget::load_fraction()` | Consumed / capacity (0.0–1.0) |
| `EnergyBudget::can_afford(j)` | Non-consuming capacity check |
| `FrequencyForceMapper::new(model)` | Build mapper from actuator preset |
| `FrequencyForceMapper::map(intensity, dur_ms)` | Perceptual intensity → `VibrationSpec` |
| `VibrationSpec::energy_j()` | Estimated energy expenditure (joules) |
| `HapticWaveform::generate(kind, freq, dur, amp, sr)` | Time-domain waveform samples |
| `HapticsDomain` | `Domain` + `EnergyConserving` for engine integration |
| `ActuatorModel` | `Lra` / `Erm` / `Piezo` / `Custom { … }` |
| `WaveformKind` | `Sine` / `Pulse` / `Ramp` / `Buzz` |

---

## Physical model

```text
Energy budget invariant:
  ∫P(t)dt ≤ energy_capacity_joules
  P(t) = F(t) · v(t)   [force × velocity]

EnergyReport (EnergyConserving trait):
  input    = available energy capacity
  output   = energy delivered (perceptual work)
  absorbed = heat dissipated in actuator
  scattered = 0  (no acoustic radiation modelled)

Weber's law frequency mapping:
  freq_hz = lerp(f_min, f_resonance, intensity^0.5)
  force_n = lerp(0, f_max_n, intensity)
```

---

## Design constraints

- **Zero `unsafe`** — all code is safe Rust.
- **Deterministic** — same input → same output across all platforms.
- **NaN/Inf guards** — invalid energy or time inputs are silently flushed to zero.
- **f32 throughout** — consistent with audio domain and WASM ABI.
- **Allocation-free hot paths** — `try_consume`, `tick`, `map` allocate nothing.
