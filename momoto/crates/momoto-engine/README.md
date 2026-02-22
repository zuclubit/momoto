# momoto-engine

**Multimodal perceptual orchestrator for the Momoto Physics Engine.**

Composes Color, Audio, and Haptics domains via enum dispatch (no vtable overhead),
provides cross-domain perceptual energy normalization, alignment scoring, and
system-wide energy conservation validation.

[![crates.io](https://img.shields.io/crates/v/momoto-engine)](https://crates.io/crates/momoto-engine)
[![docs.rs](https://img.shields.io/docsrs/momoto-engine)](https://docs.rs/momoto-engine)

---

## Multimodal stack

```text
┌─────────────────────────────────────────────────────────────────┐
│                      MomotoEngine                               │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  DomainVariant (enum dispatch — no dyn, no vtable)      │    │
│  │  ├─ Color(ColorDomain)    ← optical / OKLCH / APCA      │    │
│  │  ├─ Audio(AudioDomain)    ← LUFS / FFT / EBU R128       │    │
│  │  └─ Haptics(HapticsDomain)← energy budget / Weber law   │    │
│  └─────────────────────────────────────────────────────────┘    │
│  scratch: Box<[f32; 4096]>   ← shared, allocation-free          │
└─────────────────────────────────────────────────────────────────┘
         │ normalize_perceptual_energy()
         │ perceptual_alignment()
         │ validate_system_energy()
         ▼
   SystemEnergyReport { per_domain, total, system_conserved }
```

---

## Quick start

### Basic orchestration

```rust
use momoto_engine::MomotoEngine;
use momoto_core::traits::domain::DomainId;

let engine = MomotoEngine::new(); // ColorDomain always registered

println!("Domains: {}", engine.domain_count());
println!("Fully deterministic: {}", engine.is_fully_deterministic());
println!("Fully compliant: {}", engine.is_fully_compliant());
```

### Cross-domain perceptual normalization

```rust
use momoto_engine::MomotoEngine;
use momoto_core::traits::domain::DomainId;

let engine = MomotoEngine::new();

// Color: relative luminance [0, 1] → pass-through
let color_norm = engine.normalize_perceptual_energy(DomainId::Color, 0.72);
println!("Color (L=0.72) normalized: {:.3}", color_norm); // → 0.720

// Audio: integrated LUFS [-70, 0] → [0, 1]
// normalize_perceptual_energy returns 0.0 for unregistered domains
let audio_raw = -23.0_f32; // EBU R128 broadcast target
let audio_norm = engine.normalize_perceptual_energy(DomainId::Audio, audio_raw);
// Returns 0.0 if Audio not registered (engine only has Color by default)
println!("Audio (-23.0 LUFS) normalized: {:.3}", audio_norm);
```

### System energy report

```rust
use momoto_engine::MomotoEngine;

let engine = MomotoEngine::new();
let report = engine.validate_system_energy();

println!("System conserved: {}", report.system_conserved);
println!("Worst efficiency: {:.4}", report.worst_efficiency);
for (domain_id, energy_report) in &report.per_domain {
    println!("  {:?}: in={:.3} out={:.3} conserved={}",
        domain_id,
        energy_report.input,
        energy_report.output,
        energy_report.is_conserved(1e-4),
    );
}
```

### Perceptual alignment

```rust
use momoto_engine::MomotoEngine;
use momoto_core::traits::domain::DomainId;

let engine = MomotoEngine::new();

// Alignment between two Color signals (both registered → real result)
// alignment = 1.0 − |norm_a − norm_b|, clamped to [0, 1]
let alignment = engine.perceptual_alignment(
    DomainId::Color, DomainId::Color,
    0.72, 0.68,
);
println!("Perceptual alignment: {:.3}", alignment); // → 0.960
```

---

## Cross-domain normalization table

| Domain | Physical input | Normalization formula | Range |
|--------|---------------|----------------------|-------|
| Color | Relative luminance | pass-through | [0, 1] |
| Audio | Integrated LUFS | `(lufs + 70.0) / 70.0` | [0, 1] |
| Haptics | Vibration intensity | pass-through | [0, 1] |

---

## Full public API

| Method | Description |
|--------|-------------|
| `MomotoEngine::new()` | Create engine with `ColorDomain` registered |
| `MomotoEngine::with_scratch_len(n)` | Override scratch buffer (default: 4 096 f32) |
| `engine.domain_count()` | Number of registered domains |
| `engine.has_domain(id)` | Check if a domain is registered |
| `engine.is_fully_deterministic()` | All domains deterministic? |
| `engine.is_fully_compliant()` | All domains pass compliance? |
| `engine.scratch()` / `scratch_mut()` | Shared work buffer for domains |
| `engine.total_energy_report(input)` | Sum of all per-domain energy reports |
| `engine.verify_all_conservation(input, tol)` | All domains conserve energy? |
| `engine.validate_all()` | `Vec<ComplianceReport>` per domain |
| `engine.normalize_perceptual_energy(id, raw)` | Domain-specific normalization |
| `engine.perceptual_alignment(a, b, va, vb)` | Cross-domain coherence score |
| `engine.validate_system_energy()` | `SystemEnergyReport` |
| `engine.domain_names()` | Registered domain crate names |
| `ColorDomain` | Optical domain (ideal lossless model) |
| `DomainVariant` | Enum over all registered domains |
| `SystemEnergyReport` | Aggregated cross-domain energy report |

---

## Energy invariant

```text
For all registered domains D_i with unit_input = 1.0:

  EnergyReport { input, output, absorbed, scattered }
  invariant:  |input − (output + absorbed + scattered)| ≤ 1e-4

  ColorDomain:    absorbed = 0, scattered = 0  (ideal lossless)
  AudioDomain:    absorbed = energy_dissipated_as_heat
  HapticsDomain:  absorbed = energy_dissipated_in_actuator

  System total = Σ E_i.input across all domains
```

---

## Design decisions

- **Enum dispatch over `dyn Domain`**: LLVM inlines all domain paths, enabling
  cross-domain SIMD vectorization in future.
- **Shared scratch buffer**: domains receive `&mut [f32]` slices from a
  pre-allocated pool; no domain evaluation allocates heap memory.
- **ColorDomain always present**: Color is the founding domain of Momoto and
  is unconditionally registered at engine construction.
