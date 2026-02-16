# P3 - Propuesta de Corrección: Conversión OKLCH en momoto-ui-core

## Problema

El archivo `crates/momoto-ui-core/src/color.rs` usa una aproximación incorrecta para la conversión RGB ↔ OKLCH que produce errores de hasta 40% en Lightness para colores primarios.

## Solución Propuesta

Reemplazar las funciones `from_rgb_simple` y `to_rgb_simple` con las matrices de transformación correctas de Björn Ottosson, idénticas a las usadas en `momoto-core`.

### Código de Corrección

```rust
// ============================================================================
// OKLab Transformation Matrices (from Björn Ottosson's paper)
// ============================================================================

// RGB to LMS matrix (cone response)
const RGB_TO_LMS: [[f64; 3]; 3] = [
    [0.4122214708, 0.5363325363, 0.0514459929],
    [0.2119034982, 0.6806995451, 0.1073969566],
    [0.0883024619, 0.2817188376, 0.6299787005],
];

// LMS to Lab matrix
const LMS_TO_LAB: [[f64; 3]; 3] = [
    [0.2104542553, 0.7936177850, -0.0040720468],
    [1.9779984951, -2.4285922050, 0.4505937099],
    [0.0259040371, 0.7827717662, -0.8086757660],
];

// Lab to LMS matrix (inverse)
const LAB_TO_LMS: [[f64; 3]; 3] = [
    [1.0, 0.3963377774, 0.2158037573],
    [1.0, -0.1055613458, -0.0638541728],
    [1.0, -0.0894841775, -1.2914855480],
];

// LMS to RGB matrix (inverse)
const LMS_TO_RGB: [[f64; 3]; 3] = [
    [4.0767416621, -3.3077115913, 0.2309699292],
    [-1.2684380046, 2.6097574011, -0.3413193965],
    [-0.0041960863, -0.7034186147, 1.7076147010],
];

// ============================================================================
// sRGB Gamma Correction (IEC 61966-2-1)
// ============================================================================

/// Convert sRGB to linear RGB
#[inline]
fn srgb_to_linear(value: f64) -> f64 {
    if value <= 0.04045 {
        value / 12.92
    } else {
        ((value + 0.055) / 1.055).powf(2.4)
    }
}

/// Convert linear RGB to sRGB
#[inline]
fn linear_to_srgb(value: f64) -> f64 {
    if value <= 0.0031308 {
        value * 12.92
    } else {
        1.055 * value.powf(1.0 / 2.4) - 0.055
    }
}

impl ColorOklch {
    /// Correct RGB → OKLCH conversion using Björn Ottosson's algorithm
    fn from_rgb_correct(r: u8, g: u8, b: u8) -> Self {
        // Step 1: Normalize and linearize sRGB
        let r_linear = srgb_to_linear(r as f64 / 255.0);
        let g_linear = srgb_to_linear(g as f64 / 255.0);
        let b_linear = srgb_to_linear(b as f64 / 255.0);

        // Step 2: RGB to LMS (cone response)
        let l = RGB_TO_LMS[0][0] * r_linear + RGB_TO_LMS[0][1] * g_linear + RGB_TO_LMS[0][2] * b_linear;
        let m = RGB_TO_LMS[1][0] * r_linear + RGB_TO_LMS[1][1] * g_linear + RGB_TO_LMS[1][2] * b_linear;
        let s = RGB_TO_LMS[2][0] * r_linear + RGB_TO_LMS[2][1] * g_linear + RGB_TO_LMS[2][2] * b_linear;

        // Step 3: Apply cube root (perceptual transformation)
        let l_cbrt = l.cbrt();
        let m_cbrt = m.cbrt();
        let s_cbrt = s.cbrt();

        // Step 4: LMS to OKLab
        let lab_l = LMS_TO_LAB[0][0] * l_cbrt + LMS_TO_LAB[0][1] * m_cbrt + LMS_TO_LAB[0][2] * s_cbrt;
        let lab_a = LMS_TO_LAB[1][0] * l_cbrt + LMS_TO_LAB[1][1] * m_cbrt + LMS_TO_LAB[1][2] * s_cbrt;
        let lab_b = LMS_TO_LAB[2][0] * l_cbrt + LMS_TO_LAB[2][1] * m_cbrt + LMS_TO_LAB[2][2] * s_cbrt;

        // Step 5: OKLab to OKLCH (Cartesian to polar)
        let c = (lab_a * lab_a + lab_b * lab_b).sqrt();
        let h = if c > 0.0001 {
            let h_rad = lab_b.atan2(lab_a);
            let h_deg = h_rad.to_degrees();
            if h_deg < 0.0 { h_deg + 360.0 } else { h_deg }
        } else {
            0.0
        };

        ColorOklch {
            l: lab_l.clamp(0.0, 1.0),
            c: c.clamp(0.0, 0.4),
            h: h.rem_euclid(360.0),
        }
    }

    /// Correct OKLCH → RGB conversion using Björn Ottosson's algorithm
    fn to_rgb_correct(&self) -> (u8, u8, u8) {
        // Step 1: OKLCH to OKLab (polar to Cartesian)
        let h_rad = self.h.to_radians();
        let lab_a = self.c * h_rad.cos();
        let lab_b = self.c * h_rad.sin();

        // Step 2: OKLab to LMS'
        let l_cbrt = LAB_TO_LMS[0][0] * self.l + LAB_TO_LMS[0][1] * lab_a + LAB_TO_LMS[0][2] * lab_b;
        let m_cbrt = LAB_TO_LMS[1][0] * self.l + LAB_TO_LMS[1][1] * lab_a + LAB_TO_LMS[1][2] * lab_b;
        let s_cbrt = LAB_TO_LMS[2][0] * self.l + LAB_TO_LMS[2][1] * lab_a + LAB_TO_LMS[2][2] * lab_b;

        // Step 3: Apply cube (inverse of cube root)
        let l = l_cbrt * l_cbrt * l_cbrt;
        let m = m_cbrt * m_cbrt * m_cbrt;
        let s = s_cbrt * s_cbrt * s_cbrt;

        // Step 4: LMS to linear RGB
        let r_linear = LMS_TO_RGB[0][0] * l + LMS_TO_RGB[0][1] * m + LMS_TO_RGB[0][2] * s;
        let g_linear = LMS_TO_RGB[1][0] * l + LMS_TO_RGB[1][1] * m + LMS_TO_RGB[1][2] * s;
        let b_linear = LMS_TO_RGB[2][0] * l + LMS_TO_RGB[2][1] * m + LMS_TO_RGB[2][2] * s;

        // Step 5: Linear RGB to sRGB with clamping
        let r = (linear_to_srgb(r_linear.clamp(0.0, 1.0)) * 255.0).round() as u8;
        let g = (linear_to_srgb(g_linear.clamp(0.0, 1.0)) * 255.0).round() as u8;
        let b = (linear_to_srgb(b_linear.clamp(0.0, 1.0)) * 255.0).round() as u8;

        (r, g, b)
    }
}
```

## Tests de Verificación

```rust
#[test]
fn test_oklch_red_golden() {
    // Rojo puro: RGB(255, 0, 0) → OKLCH(0.628, 0.257, 29.2°)
    let color = ColorOklch::from_rgb_correct(255, 0, 0);
    assert!((color.l - 0.628).abs() < 0.01, "Red L: {}", color.l);
    assert!((color.c - 0.257).abs() < 0.01, "Red C: {}", color.c);
    assert!((color.h - 29.2).abs() < 2.0, "Red H: {}", color.h);
}

#[test]
fn test_oklch_roundtrip() {
    // Roundtrip: RGB → OKLCH → RGB
    for (r, g, b) in [(255, 0, 0), (0, 255, 0), (0, 0, 255), (128, 128, 128)] {
        let oklch = ColorOklch::from_rgb_correct(r, g, b);
        let (r2, g2, b2) = oklch.to_rgb_correct();
        assert!((r as i32 - r2 as i32).abs() <= 1, "R mismatch: {} vs {}", r, r2);
        assert!((g as i32 - g2 as i32).abs() <= 1, "G mismatch: {} vs {}", g, g2);
        assert!((b as i32 - b2 as i32).abs() <= 1, "B mismatch: {} vs {}", b, b2);
    }
}
```

## Impacto

### Antes (con aproximación):
| Color | OKLCH L (aproximado) | Error |
|-------|---------------------|-------|
| Rojo | 0.461 | 26.6% |
| Azul | 0.269 | 40.5% |
| Gris | 0.505 | 15.8% |

### Después (con corrección):
| Color | OKLCH L (correcto) | Error |
|-------|-------------------|-------|
| Rojo | 0.628 | 0% |
| Azul | 0.452 | 0% |
| Gris | 0.600 | 0% |

## Archivos a Modificar

1. `crates/momoto-ui-core/src/color.rs` - Reemplazar funciones de conversión
2. `crates/momoto-ui-core/src/a11y.rs` - Actualizar `calculate_relative_luminance`

## Compatibilidad

- **API**: Sin cambios (misma interfaz pública)
- **Comportamiento**: Valores de color más precisos
- **Performance**: Similar (misma complejidad O(1))
- **WASM size**: +~200 bytes por matrices

## Validación Requerida

Después de aplicar la corrección:

1. Ejecutar todos los tests existentes
2. Verificar paridad con momoto-core usando colores de referencia
3. Validar que WCAG/APCA producen resultados consistentes
4. Ejecutar benchmarks de performance

---

*Propuesta generada por P3 Scientific Validation Phase*
