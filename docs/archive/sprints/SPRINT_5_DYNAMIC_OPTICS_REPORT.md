# Sprint 5: Thermo-Optic & Stress-Optic Coupling (Living Materials)

**Date**: 2026-01-11
**Engineer**: Claude Opus 4.5
**Objective**: Expose thermo-optic and stress-optic physics from Rust to WASM

---

## Executive Summary

**STATUS: COMPLETE**

Sprint 5 successfully exposed dynamic optical physics via WASM. Materials now respond to physical state changes (temperature T, stress σ), not time-based animation.

### Key Principle Achieved

> **"Un material vivo no cambia porque pasa el tiempo. Cambia porque cambia su estado físico."**
> (A living material doesn't change because time passes. It changes because its physical state changes.)

Color EMERGES from physical state (T, σ), NOT from animation speeds or intensity parameters.

---

## 1. FASE 1: Rust Module Audit

### Modules Analyzed

| Module | Location | LOC | Physics |
|--------|----------|-----|---------|
| `thin_film_dynamic.rs` | momoto-materials/glass_physics | 833 | Thermo-optic, stress-optic |
| `metal_temp.rs` | momoto-materials/glass_physics | 738 | Drude model, oxidation |

### Key Physics Implemented

**Thermo-Optic Effect**:
```
n(T) = n_base + (dn/dT) × (T - T_ref)

Typical dn/dT values:
- Glass: +10⁻⁶ to +10⁻⁵ /K
- Polymers: -10⁻⁴ /K (negative!)
- Water: -10⁻⁴ /K
```

**Thermal Expansion**:
```
d(T) = d_base × (1 + α × (T - T_ref))

Typical α values:
- Glass: 5×10⁻⁶ /K
- Metals: 10-25×10⁻⁶ /K
- Polymers: 50-200×10⁻⁶ /K
```

**Stress-Optic (Photoelastic) Effect**:
```
ε = σ/E (strain from stress)
d(σ) = d_base × (1 + ε)
Δn = C × (σ₁ - σ₂) (birefringence)
```

**Drude Model (Temperature-Dependent)**:
```
ε(ω,T) = ε∞ - ωₚ²(T)/(ω² + iγ(T)ω)

where:
- ωₚ(T) = ωₚ₀ × (1 - α×ΔT)  // thermal expansion
- γ(T) = γ₀ × (T/T₀)        // phonon scattering
```

---

## 2. FASE 2: WASM Bindings Implementation

### Structs Exposed (~680 LOC added to lib.rs)

| Struct | Rust Source | Methods |
|--------|-------------|---------|
| `DynamicFilmLayer` | thin_film_dynamic.rs | constructor, withDnDt, withThermalExpansion, withMechanical |
| `DynamicThinFilmStack` | thin_film_dynamic.rs | constructor, addLayer, setEnvironment, applyStress, presets |
| `TempOxidizedMetal` | metal_temp.rs | constructor, setTemperature, setOxidation, presets, f0Rgb |

### DynamicFilmLayer Methods

**Builder Pattern**:
- `new(n_base, thickness_nm, reference_temp_k)` - Create layer
- `withDnDt(dn_dt)` - Set thermo-optic coefficient (/K)
- `withThermalExpansion(alpha)` - Set thermal expansion coefficient (/K)
- `withMechanical(youngs_modulus, poisson_ratio)` - Set mechanical properties
- `withK(k)` - Set extinction coefficient (absorbing layers)

### DynamicThinFilmStack Methods

**Layer Management**:
- `new(n_ambient, n_substrate)` - Create empty stack
- `addLayer(layer)` - Add dynamic layer
- `layerCount` - Get number of layers

**Physical State**:
- `setEnvironment(temp_k, pressure_pa, humidity)` - Set environmental conditions
- `applyStress(stress_tensor)` - Apply stress [σxx, σyy, σzz, σxy, σyz, σzx] in MPa
- `setTemperature(temp_k)` - Set temperature in Kelvin

**Physics Calculations**:
- `reflectanceAt(wavelength_nm, angle_rad)` - Reflectance at point
- `reflectanceRgb(angle_rad)` - RGB reflectance
- `totalThickness()` - Current total thickness (changes with T, σ)

**Presets (4 total)**:
| Preset | Description | Physics |
|--------|-------------|---------|
| `soapBubble(temp_k)` | Water film | High dn/dT, thermal expansion |
| `arCoatingStressed(stress_mpa)` | AR coating | Stress-optic response |
| `oilSlickRippled()` | Oil film | Temperature-dependent thickness |
| `morphoCurved()` | Curved Morpho | Angular-dependent iridescence |

### TempOxidizedMetal Methods

**State Control**:
- `setTemperature(temp_k)` - Set temperature (200-1500K valid range)
- `setOxidation(level)` - Set oxidation level (0.0 to 1.0)

**Physics Output**:
- `metalSpectralIor()` - Returns [n_R, k_R, n_G, k_G, n_B, k_B]
- `f0Rgb()` - Normal incidence reflectance at RGB wavelengths
- `effectiveOxideThickness()` - Current oxide layer thickness (nm)
- `toCssGradient()` - CSS gradient from physics

**Presets (8 total)**:
| Preset | Description | Oxidation |
|--------|-------------|-----------|
| `copperFresh()` | Clean copper | Native oxide only |
| `copperTarnished()` | Light Cu₂O | 30% oxidation |
| `copperPatina()` | Full verdigris | 100% oxidation |
| `silverFresh()` | Polished silver | No tarnish |
| `silverTarnished()` | Ag₂S layer | 50% tarnish |
| `aluminumFresh()` | Native Al₂O₃ | Stable oxide |
| `ironRusty()` | Fe₂O₃ rust | Heavy oxidation |
| `goldHot()` | Heated gold | Temperature only |

### Utility Functions

| Function | Purpose |
|----------|---------|
| `calculateTemperatureSensitivity(metal, λ)` | dn/dT, dk/dT at wavelength |
| `demonstrateThermoOpticEffect()` | Show T dependence |
| `demonstrateStressOpticEffect()` | Show σ dependence |
| `getDynamicFilmPresets()` | List all dynamic presets |

---

## 3. FASE 3: TypeScript API

### Generated Definitions

```typescript
// Dynamic Film Layer
export class DynamicFilmLayer {
  constructor(n_base: number, thickness_nm: number, reference_temp_k: number);

  // Builder pattern
  withDnDt(dn_dt: number): DynamicFilmLayer;
  withThermalExpansion(alpha: number): DynamicFilmLayer;
  withMechanical(youngs_modulus: number, poisson_ratio: number): DynamicFilmLayer;
  withK(k: number): DynamicFilmLayer;

  // Properties
  readonly nBase: number;
  readonly thicknessNm: number;
  readonly dnDt: number;
  readonly thermalExpansion: number;
}

// Dynamic Thin Film Stack
export class DynamicThinFilmStack {
  constructor(n_ambient: number, n_substrate: number);

  // Presets
  static soapBubble(temp_k: number): DynamicThinFilmStack;
  static arCoatingStressed(stress_mpa: number): DynamicThinFilmStack;
  static oilSlickRippled(): DynamicThinFilmStack;

  // State control - PHYSICAL PARAMETERS ONLY
  setEnvironment(temp_k: number, pressure_pa: number, humidity: number): void;
  applyStress(stress: Float64Array): void;  // [σxx, σyy, σzz, σxy, σyz, σzx]

  // Physics output
  reflectanceAt(wavelength_nm: number, angle_rad: number): number;
  reflectanceRgb(angle_rad: number): Float64Array;
  totalThickness(): number;

  readonly layerCount: number;
}

// Temperature-Dependent Oxidized Metal
export class TempOxidizedMetal {
  // Presets
  static copperFresh(): TempOxidizedMetal;
  static copperTarnished(): TempOxidizedMetal;
  static copperPatina(): TempOxidizedMetal;
  static silverFresh(): TempOxidizedMetal;
  static silverTarnished(): TempOxidizedMetal;
  static aluminumFresh(): TempOxidizedMetal;
  static ironRusty(): TempOxidizedMetal;
  static goldHot(): TempOxidizedMetal;

  // State control - PHYSICAL PARAMETERS ONLY
  setTemperature(temp_k: number): void;
  setOxidation(level: number): void;

  // Physics output
  metalSpectralIor(): Float64Array;  // [n_R, k_R, n_G, k_G, n_B, k_B]
  f0Rgb(): Float64Array;             // [R, G, B] reflectance
  effectiveOxideThickness(): number;
  toCssGradient(): string;
}

// Utility functions
export function calculateTemperatureSensitivity(metal: string, wavelength_nm: number): object;
export function demonstrateThermoOpticEffect(): object;
export function demonstrateStressOpticEffect(): object;
```

---

## 4. FASE 4: Story Migration

### DynamicMaterials.stories.tsx (~650 LOC)

| Story | Description | Features |
|-------|-------------|----------|
| **ThermoChromicMetal** | Temperature-dependent metal | T slider (77-1500K), oxidation control, spectral IOR table |
| **StressOpticGlass** | Photoelastic thin film | Stress tensor sliders, birefringence visualization |
| **DynamicSoapBubble** | T + σ combined | Temperature + stress + angle controls |
| **DynamicOilSlick** | Temperature-dependent | Oil film interference |
| **DynamicARCoating** | Stress-responsive | AR coating under mechanical load |

### ThermoChromicMetal Story Features

- 8 oxidized metal presets
- Temperature slider (77K to 1500K)
- Oxidation slider (0% to 100%)
- Spectral n(λ)+ik(λ) table at R/G/B
- Emergent color display from F0
- Drude model physics panel
- Hot/Red Hot indicators

### StressOpticGlass Story Features

- σₓₓ and σᵧᵧ stress sliders (-200 to +200 MPa)
- Temperature control (200-500K)
- Strain calculation display
- Birefringence Δn indicator
- Stress visualization lines
- Spectral reflectance bars

### DynamicThinFilm Story Features

- Soap bubble, oil slick, AR coating presets
- Combined T + σ controls
- Viewing angle slider (0-80°)
- Phase at 550nm display
- Optical path length
- Interference color preview

---

## 5. FASE 5: Physics Validation

### Test Results (21/21 PASS)

**thin_film_dynamic tests (9 passed)**:
```
test_dynamic_layer_temperature ... ok
test_dynamic_layer_thermal_expansion ... ok
test_dynamic_layer_stress ... ok
test_height_map_spherical ... ok
test_height_map_normal ... ok
test_curvature_affects_reflectance ... ok
test_dynamic_stack_temperature_response ... ok
test_iridescence_map ... ok
test_css_generation ... ok
```

**metal_temp tests (12 passed)**:
```
test_memory_usage ... ok
test_spectral_ior ... ok
test_drude_model ... ok
test_oxide_layer ... ok
test_oxidized_metal_reflectance ... ok
test_temperature_dependence ... ok
test_css_generation ... ok
test_all_oxide_presets ... ok
test_all_drude_presets ... ok
test_all_oxidized_presets ... ok
test_metal_temperature_changes ... ok
test_temperature_sensitivity ... ok
```

### Key Validations

| Test | Validation | Result |
|------|------------|--------|
| Temperature Response | n(T) changes with dn/dT | PASS |
| Thermal Expansion | d(T) changes with α | PASS |
| Stress Response | d(σ) changes with σ/E | PASS |
| Drude Temperature | ωₚ(T), γ(T) correct | PASS |
| Oxidation Effects | Oxide layer changes color | PASS |
| Copper Fresh → Patina | Color shift green | PASS |
| Silver Fresh → Tarnished | Darkening | PASS |

---

## 6. Build Verification

```bash
# WASM build
wasm-pack build --target web --out-dir pkg
# ✅ Done in 8.13s

# Storybook build
npm run build-storybook
# ✅ Built in 14.91s

# Story output
# DynamicMaterials.stories-B7fUEij7.js: 97.19 kB (9.74 kB gzipped)
```

### TypeScript Definitions

```bash
grep -c "DynamicFilmLayer\|DynamicThinFilmStack\|TempOxidizedMetal" pkg/momoto_wasm.d.ts
# Result: 28 references
```

---

## 7. API Usage Examples

### Thermo-Chromic Metal

```javascript
import init, { TempOxidizedMetal } from 'momoto-wasm';

await init();

// Create temperature-responsive metal
const copper = TempOxidizedMetal.copperFresh();

// Change PHYSICAL STATE - color EMERGES
copper.setTemperature(500);  // Kelvin (hot)
copper.setOxidation(0.3);    // Light tarnish

// Color from physics, NOT hardcoded
const f0 = copper.f0Rgb();
console.log('Color from physics:', f0);
// Changes with temperature!

// CSS for display
const gradient = copper.toCssGradient();
```

### Stress-Optic Film

```javascript
import { DynamicThinFilmStack } from 'momoto-wasm';

// AR coating under stress
const stack = DynamicThinFilmStack.arCoatingStressed(0);

// Set environmental conditions
stack.setEnvironment(293, 101325.0, 0.5);

// Apply stress tensor [σxx, σyy, σzz, σxy, σyz, σzx] in MPa
const stress = new Float64Array([100, 0, 0, 0, 0, 0]);  // Uniaxial tension
stack.applyStress(stress);

// Color EMERGES from stress-induced thickness change
const rRgb = stack.reflectanceRgb(0.0);
console.log('Stress-induced reflectance:', rRgb);
```

### Dynamic Soap Bubble

```javascript
import { DynamicThinFilmStack } from 'momoto-wasm';

// Soap bubble at room temperature
const bubble = DynamicThinFilmStack.soapBubble(293);

// Heat it up - thickness changes!
bubble.setEnvironment(323, 101325.0, 0.8);  // 50°C, humid

// Color shifts with temperature
const warm = bubble.reflectanceRgb(0.0);

// Cool it down
bubble.setEnvironment(273, 101325.0, 0.3);  // 0°C, dry
const cool = bubble.reflectanceRgb(0.0);

// Different colors! From physics, not animation.
```

---

## 8. Contract Rules (ENFORCED)

### VALID (Physical State Parameters)

```typescript
// Temperature in Kelvin
setTemperature(tempK: number)  // ✅ 200-1500K

// Stress in MPa (Voigt notation)
applyStress(stress: Float64Array)  // ✅ [σxx, σyy, σzz, σxy, σyz, σzx]

// Oxidation level (dimensionless)
setOxidation(level: number)  // ✅ 0.0-1.0

// Environment (physical units)
setEnvironment(tempK, pressurePa, humidity)  // ✅
```

### INVALID (Animation/Fake Parameters)

```typescript
// WRONG: Time-based animation
setAnimationSpeed(speed)  // ❌ REJECTED
setAnimationDuration(ms)  // ❌ REJECTED

// WRONG: Fake intensity
setHeatIntensity(value)   // ❌ REJECTED
setStressIntensity(value) // ❌ REJECTED

// WRONG: Visual-only
setGlowAmount(value)      // ❌ REJECTED
setPulseRate(hz)          // ❌ REJECTED
```

---

## 9. Metrics

| Metric | Value |
|--------|-------|
| Rust LOC added (lib.rs) | ~680 |
| TypeScript definitions | 28 Dynamic* references |
| DynamicThinFilmStack presets | 4 structures |
| TempOxidizedMetal presets | 8 metals |
| Story components | 5 (ThermoChromic, StressOptic, 3 Dynamic) |
| Story size | 97.19 kB (9.74 kB gzipped) |
| Physics tests | 21/21 passed |
| WASM build time | 8.13s |
| Storybook build time | 14.91s |

---

## 10. Sprint Criteria Verification

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Temperature in Kelvin | ✅ PASS | `setTemperature(tempK)` |
| Stress in MPa | ✅ PASS | `applyStress([σxx, σyy, σzz, σxy, σyz, σzx])` |
| No animation params | ✅ PASS | Only physical state controls |
| No intensity params | ✅ PASS | No fake values |
| Color from physics | ✅ PASS | n(T), d(T,σ) → interference |
| dn/dT implemented | ✅ PASS | `withDnDt()` builder |
| Thermal expansion | ✅ PASS | `withThermalExpansion()` builder |
| Stress-optic | ✅ PASS | `applyStress()` method |
| Drude temperature | ✅ PASS | `TempOxidizedMetal.setTemperature()` |

---

## 11. Files Modified

| File | Changes |
|------|---------|
| `momoto-wasm/src/lib.rs` | +~680 LOC (DynamicFilmLayer, DynamicThinFilmStack, TempOxidizedMetal) |
| `DynamicMaterials.stories.tsx` | New file (~650 LOC) |
| `momoto-wasm/pkg/*` | Regenerated WASM + TypeScript |

---

## 12. Next Steps (Sprint 6 Candidates)

1. **Anisotropic Stress** — Birefringence from non-hydrostatic stress
2. **Subsurface Temperature** — Depth-dependent thermal response
3. **Time-Dependent Relaxation** — Viscoelastic stress response (still physical!)
4. **Electrochromic Effects** — Voltage-dependent n(V)
5. **Humidity Response** — Hygroscopic film swelling

---

## 13. Conclusion

Sprint 5 achieved its primary objective: **Living materials that respond to physical state (T, σ), not animation**.

Key achievements:
- **Thermo-Optic Effect**: n(T) = n₀ + (dn/dT)×ΔT implemented
- **Thermal Expansion**: d(T) = d₀ × (1 + α×ΔT) implemented
- **Stress-Optic Effect**: d(σ) = d₀ × (1 + σ/E) implemented
- **Drude Temperature**: ωₚ(T), γ(T) for metals implemented
- **Oxidation Effects**: Oxide layer thickness and color
- **Physical Contracts**: Only T, σ parameters, NO animation fake values
- **21 Physics Tests**: All passing

**Key Principle Maintained**:
> "Un material vivo no cambia porque pasa el tiempo. Cambia porque cambia su estado físico."

**Sprint 5 Status: COMPLETE**

---

*Generated by Claude Opus 4.5 — Sprint 5 Thermo-Optic & Stress-Optic Coupling (Living Materials)*
