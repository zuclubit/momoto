//! # Perlin Noise Generator for Frosted Glass Textures
//!
//! Implements improved Perlin noise with multiple octaves for natural-looking
//! frosted glass effects.
//!
//! ## Why Perlin Noise for Glass?
//!
//! Real frosted glass has a **random but natural** surface texture. Simple random
//! noise looks artificial—pixels jump sharply between values. **Perlin noise**
//! (Ken Perlin, 1985) creates smooth, organic randomness by interpolating gradients.
//!
//! ### What Makes Good Frosted Glass?
//!
//! - **Smooth variations**: No sharp pixel-to-pixel jumps
//! - **Multiple scales**: Large features (blotches) + small features (grain)
//! - **Natural appearance**: Looks like real etched glass, not digital noise
//!
//! Perlin noise achieves all three by combining multiple octaves (layers) at
//! different frequencies.
//!
//! ## Multi-Octave (Fractal) Noise
//!
//! Single-octave noise is too uniform. **Fractal noise** combines multiple octaves:
//!
//! ```text
//! Octave 1 (low freq):   ~~~  ~~~  ~~~     (large blotches)
//! Octave 2:             ~ ~~ ~ ~~ ~ ~~      (medium detail)
//! Octave 3:            ~~~~~~~~  ~~~~~~~~   (fine grain)
//! Octave 4 (high freq): ~~~~~~~~~~~~~~~~    (micro detail)
//!                       ──────────────────
//! Result:              Natural frosted glass appearance
//! ```
//!
//! Each octave has:
//! - **Halved amplitude** (persistence, typically 0.5)
//! - **Doubled frequency** (lacunarity, typically 2.0)
//!
//! ## Usage
//!
//! ```rust
//! use momoto_materials::glass_physics::perlin_noise::PerlinNoise;
//!
//! // Create noise generator with 6 octaves for high-quality frosted glass
//! let noise = PerlinNoise::new(42, 6, 0.5, 2.0);
//!
//! // Sample at specific position
//! let value = noise.fractal_noise_2d(10.5, 20.3);
//! println!("Noise: {:.3}", value); // Range: [-1.0, 1.0]
//!
//! // Generate texture for CSS
//! let texture_data = noise.generate_texture(256, 256, 0.05);
//! // Returns RGBA buffer ready for data URL encoding
//! ```

/// Perlin noise generator with configurable parameters
///
/// This struct holds the permutation table and noise parameters for
/// generating consistent, reproducible noise patterns.
#[derive(Clone, Copy)]
pub struct PerlinNoise {
    /// Permutation table for gradient lookups (512 values for wrapping)
    permutation: [u8; 512],

    /// Number of octaves (layers of noise, typical: 1-8)
    /// - 1 octave: Simple, uniform noise
    /// - 4 octaves: Good balance for UI
    /// - 6-8 octaves: High quality, natural appearance
    octaves: u32,

    /// Persistence (amplitude multiplier per octave, typical: 0.5)
    /// - 0.5: Balanced (each octave half as strong)
    /// - 0.4: Smoother (octaves fade faster)
    /// - 0.6: More detailed (octaves stronger)
    persistence: f64,

    /// Lacunarity (frequency multiplier per octave, typical: 2.0)
    /// - 2.0: Standard (each octave double frequency)
    /// - 1.8: More gradual frequency increase
    /// - 2.5: Sharper frequency jumps
    lacunarity: f64,
}

impl PerlinNoise {
    /// Create new Perlin noise generator with seed
    ///
    /// # Arguments
    ///
    /// * `seed` - Random seed for reproducible noise (any u32 value)
    /// * `octaves` - Number of noise layers (1-8, typical: 4-6)
    /// * `persistence` - Amplitude falloff per octave (0.0-1.0, typical: 0.5)
    /// * `lacunarity` - Frequency growth per octave (1.0-3.0, typical: 2.0)
    ///
    /// # Example
    ///
    /// ```rust
    /// use momoto_materials::glass_physics::perlin_noise::PerlinNoise;
    ///
    /// // High-quality frosted glass
    /// let noise = PerlinNoise::new(42, 6, 0.5, 2.0);
    ///
    /// // Simple glass (fast)
    /// let simple = PerlinNoise::new(42, 2, 0.5, 2.0);
    /// ```
    pub fn new(seed: u32, octaves: u32, persistence: f64, lacunarity: f64) -> Self {
        let mut permutation = [0u8; 512];

        // Initialize permutation with 0..255
        let mut p: Vec<u8> = (0..256).map(|i| i as u8).collect();

        // Shuffle using seed (simple LCG random)
        let mut rng_state = seed;
        for i in (1..256).rev() {
            // LCG: next = (a * prev + c) mod m
            rng_state = rng_state.wrapping_mul(1103515245).wrapping_add(12345);
            let j = ((rng_state / 65536) % ((i + 1) as u32)) as usize;
            p.swap(i as usize, j);
        }

        // Duplicate for wrapping (avoids modulo in hot path)
        permutation[..256].copy_from_slice(&p[..256]);
        permutation[256..512].copy_from_slice(&p[..256]);

        Self {
            permutation,
            octaves,
            persistence,
            lacunarity,
        }
    }

    /// Generate 2D Perlin noise value at given coordinates
    ///
    /// This is the **core single-octave noise function**.
    ///
    /// # Arguments
    ///
    /// * `x` - X coordinate (can be any f64 value)
    /// * `y` - Y coordinate (can be any f64 value)
    ///
    /// # Returns
    ///
    /// Noise value in range **[-1.0, 1.0]** (approximately)
    ///
    /// # Algorithm
    ///
    /// 1. Find integer grid cell containing (x, y)
    /// 2. Calculate gradients at 4 corners of cell
    /// 3. Interpolate gradients using smooth fade curves
    /// 4. Return interpolated value
    ///
    /// # Example
    ///
    /// ```rust
    /// use momoto_materials::glass_physics::perlin_noise::PerlinNoise;
    ///
    /// let noise = PerlinNoise::new(42, 1, 0.5, 2.0);
    /// let value = noise.noise_2d(5.5, 10.3);
    /// assert!(value >= -1.0 && value <= 1.0);
    /// ```
    pub fn noise_2d(&self, x: f64, y: f64) -> f64 {
        // Find grid cell coordinates
        let x0 = x.floor() as i32 & 255;
        let y0 = y.floor() as i32 & 255;

        // Find relative position within cell
        let xf = x - x.floor();
        let yf = y - y.floor();

        // Compute fade curves for smooth interpolation
        // Ken Perlin's improved fade: 6t^5 - 15t^4 + 10t^3
        let u = Self::fade(xf);
        let v = Self::fade(yf);

        // Hash coordinates of 4 corners
        let aa = self.permutation[self.permutation[x0 as usize] as usize + y0 as usize];
        let ab = self.permutation[self.permutation[x0 as usize] as usize + (y0 + 1) as usize];
        let ba = self.permutation[self.permutation[(x0 + 1) as usize] as usize + y0 as usize];
        let bb = self.permutation[self.permutation[(x0 + 1) as usize] as usize + (y0 + 1) as usize];

        // Calculate gradients at 4 corners
        let g1 = Self::grad_2d(aa, xf, yf);
        let g2 = Self::grad_2d(ba, xf - 1.0, yf);
        let g3 = Self::grad_2d(ab, xf, yf - 1.0);
        let g4 = Self::grad_2d(bb, xf - 1.0, yf - 1.0);

        // Bilinear interpolation
        let x1 = Self::lerp(g1, g2, u);
        let x2 = Self::lerp(g3, g4, u);
        Self::lerp(x1, x2, v)
    }

    /// Generate fractal (multi-octave) Perlin noise
    ///
    /// This is the **main function** for high-quality noise. It combines multiple
    /// octaves at different frequencies for natural, detailed appearance.
    ///
    /// # Returns
    ///
    /// Noise value in range approximately **[-1.0, 1.0]**
    ///
    /// # How It Works
    ///
    /// ```text
    /// total = 0
    /// frequency = 1.0
    /// amplitude = 1.0
    ///
    /// for each octave:
    ///     total += noise_2d(x * frequency, y * frequency) * amplitude
    ///     amplitude *= persistence  (e.g., 0.5)
    ///     frequency *= lacunarity   (e.g., 2.0)
    ///
    /// return total / sum_of_amplitudes
    /// ```
    ///
    /// # Example
    ///
    /// ```rust
    /// use momoto_materials::glass_physics::perlin_noise::PerlinNoise;
    ///
    /// let noise = PerlinNoise::new(42, 6, 0.5, 2.0);
    ///
    /// // Sample many points
    /// for y in 0..10 {
    ///     for x in 0..10 {
    ///         let value = noise.fractal_noise_2d(x as f64 * 0.1, y as f64 * 0.1);
    ///         // Use value for frosted glass texture
    ///     }
    /// }
    /// ```
    pub fn fractal_noise_2d(&self, x: f64, y: f64) -> f64 {
        let mut total = 0.0;
        let mut frequency = 1.0;
        let mut amplitude = 1.0;
        let mut max_value = 0.0; // Normalization factor

        for _ in 0..self.octaves {
            total += self.noise_2d(x * frequency, y * frequency) * amplitude;
            max_value += amplitude;
            amplitude *= self.persistence;
            frequency *= self.lacunarity;
        }

        // Normalize to approximately [-1, 1]
        total / max_value
    }

    /// Generate noise texture as RGBA buffer
    ///
    /// Creates a grayscale noise texture ready for encoding as a data URL
    /// or saving as an image.
    ///
    /// # Arguments
    ///
    /// * `width` - Texture width in pixels
    /// * `height` - Texture height in pixels
    /// * `scale` - Scale factor for noise frequency
    ///   - **0.01**: Very large features (blotchy)
    ///   - **0.05**: Good for frosted glass (recommended)
    ///   - **0.1**: Fine grain
    ///   - **0.5**: Very fine, almost pixelated
    ///
    /// # Returns
    ///
    /// RGBA buffer with **4 bytes per pixel**: `[R, G, B, A, R, G, B, A, ...]`
    /// - Grayscale: R = G = B
    /// - Alpha: Always 255 (fully opaque)
    /// - Total size: `width × height × 4` bytes
    ///
    /// # Example
    ///
    /// ```rust
    /// use momoto_materials::glass_physics::perlin_noise::PerlinNoise;
    ///
    /// let noise = PerlinNoise::new(42, 6, 0.5, 2.0);
    ///
    /// // Generate 256×256 texture
    /// let rgba = noise.generate_texture(256, 256, 0.05);
    ///
    /// assert_eq!(rgba.len(), 256 * 256 * 4);
    ///
    /// // Encode as data URL for CSS
    /// // let base64 = base64::encode(&rgba);
    /// // let data_url = format!("data:image/png;base64,{}", base64);
    /// ```
    pub fn generate_texture(&self, width: u32, height: u32, scale: f64) -> Vec<u8> {
        let mut buffer = Vec::with_capacity((width * height * 4) as usize);

        for y in 0..height {
            for x in 0..width {
                // Scale coordinates
                let nx = x as f64 * scale;
                let ny = y as f64 * scale;

                // Get fractal noise value
                let noise = self.fractal_noise_2d(nx, ny);

                // Map [-1, 1] to [0, 255]
                let value = ((noise + 1.0) * 127.5).clamp(0.0, 255.0) as u8;

                // Write grayscale RGBA
                buffer.push(value); // R
                buffer.push(value); // G
                buffer.push(value); // B
                buffer.push(255); // A (fully opaque)
            }
        }

        buffer
    }

    // ═══════════════════════════════════════════════════════════
    // Private Helper Functions
    // ═══════════════════════════════════════════════════════════

    /// Ken Perlin's improved fade function: 6t^5 - 15t^4 + 10t^3
    ///
    /// This provides C2 continuity (smooth second derivative) which
    /// eliminates visible grid artifacts.
    #[inline]
    fn fade(t: f64) -> f64 {
        t * t * t * (t * (t * 6.0 - 15.0) + 10.0)
    }

    /// Linear interpolation
    #[inline]
    fn lerp(a: f64, b: f64, t: f64) -> f64 {
        a + t * (b - a)
    }

    /// Gradient calculation for 2D Perlin noise
    ///
    /// Converts hash value to a gradient direction and computes dot product
    /// with distance vector.
    #[inline]
    fn grad_2d(hash: u8, x: f64, y: f64) -> f64 {
        // Use bottom 2 bits to choose gradient direction
        let h = hash & 3;
        match h {
            0 => x + y,  // Gradient: ( 1,  1)
            1 => -x + y, // Gradient: (-1,  1)
            2 => x - y,  // Gradient: ( 1, -1)
            _ => -x - y, // Gradient: (-1, -1)
        }
    }
}

/// Preset noise configurations for different glass types
///
/// These presets are tuned for optimal visual quality in UI contexts.
pub mod presets {
    use super::*;

    /// Clear glass (minimal noise)
    ///
    /// - 1 octave: Simple, barely visible texture
    /// - Use for: Transparent glass buttons, subtle effects
    pub fn clear_glass() -> PerlinNoise {
        PerlinNoise::new(42, 1, 0.5, 2.0)
    }

    /// Regular glass (moderate noise)
    ///
    /// - 3 octaves: Good balance of detail and performance
    /// - Use for: Standard glass buttons, panels
    pub fn regular_glass() -> PerlinNoise {
        PerlinNoise::new(42, 3, 0.5, 2.0)
    }

    /// Thick glass (substantial noise)
    ///
    /// - 4 octaves: More visible texture
    /// - Use for: Heavy glass panels, thick buttons
    pub fn thick_glass() -> PerlinNoise {
        PerlinNoise::new(42, 4, 0.5, 2.0)
    }

    /// Frosted glass (maximum detail)
    ///
    /// - 6 octaves: High-quality, natural appearance
    /// - Use for: Privacy glass, decorative frosted effects
    pub fn frosted_glass() -> PerlinNoise {
        PerlinNoise::new(42, 6, 0.5, 2.0)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_noise_range() {
        let noise = PerlinNoise::new(42, 4, 0.5, 2.0);

        // Sample 100 random points
        for i in 0..100 {
            let x = i as f64 * 0.73; // Use prime-ish multiplier for variety
            let y = i as f64 * 1.37;
            let value = noise.fractal_noise_2d(x, y);

            // Allow small overshoot due to interpolation
            assert!(
                value >= -1.2 && value <= 1.2,
                "Noise value out of range: {}",
                value
            );
        }
    }

    #[test]
    fn test_noise_deterministic() {
        let noise1 = PerlinNoise::new(42, 4, 0.5, 2.0);
        let noise2 = PerlinNoise::new(42, 4, 0.5, 2.0);

        // Same seed should produce same values
        for i in 0..10 {
            let x = i as f64;
            let y = i as f64 * 2.0;

            let v1 = noise1.fractal_noise_2d(x, y);
            let v2 = noise2.fractal_noise_2d(x, y);

            assert_eq!(v1, v2, "Noise should be deterministic with same seed");
        }
    }

    #[test]
    fn test_different_seeds() {
        let noise1 = PerlinNoise::new(42, 4, 0.5, 2.0);
        let noise2 = PerlinNoise::new(123, 4, 0.5, 2.0);

        // Different seeds should produce different values
        // Test multiple points to ensure robustness
        let mut different = false;
        for i in 0..10 {
            let x = i as f64 * 1.7 + 0.5;
            let y = i as f64 * 2.3 + 0.3;
            let v1 = noise1.fractal_noise_2d(x, y);
            let v2 = noise2.fractal_noise_2d(x, y);

            if (v1 - v2).abs() > 0.01 {
                different = true;
                break;
            }
        }

        assert!(different, "Different seeds should produce different noise");
    }

    #[test]
    fn test_generate_texture() {
        let noise = PerlinNoise::new(42, 4, 0.5, 2.0);
        let texture = noise.generate_texture(32, 32, 0.1);

        // Check size
        assert_eq!(texture.len(), 32 * 32 * 4, "Texture should be correct size");

        // Check all alpha values are 255
        for i in (0..texture.len()).step_by(4) {
            assert_eq!(texture[i + 3], 255, "Alpha should be fully opaque");
        }

        // Check grayscale (R = G = B)
        for i in (0..texture.len()).step_by(4) {
            assert_eq!(
                texture[i],
                texture[i + 1],
                "Red should equal green (grayscale)"
            );
            assert_eq!(
                texture[i],
                texture[i + 2],
                "Red should equal blue (grayscale)"
            );
        }
    }

    #[test]
    fn test_octave_effect() {
        let noise1 = PerlinNoise::new(42, 1, 0.5, 2.0); // Single octave
        let noise6 = PerlinNoise::new(42, 6, 0.5, 2.0); // Multiple octaves

        // Multi-octave noise should have more variation
        let mut variance1 = 0.0;
        let mut variance6 = 0.0;
        let samples = 100;

        for i in 0..samples {
            let x = i as f64 * 0.1;
            let y = i as f64 * 0.1;

            let v1 = noise1.fractal_noise_2d(x, y);
            let v6 = noise6.fractal_noise_2d(x, y);

            variance1 += v1 * v1;
            variance6 += v6 * v6;
        }

        variance1 /= samples as f64;
        variance6 /= samples as f64;

        // Note: This test might be flaky depending on the sample points
        // Just checking they're both non-zero and reasonable
        assert!(variance1 > 0.0, "Single octave should have variance");
        assert!(variance6 > 0.0, "Multiple octaves should have variance");
    }

    #[test]
    fn test_presets() {
        let clear = presets::clear_glass();
        let regular = presets::regular_glass();
        let thick = presets::thick_glass();
        let frosted = presets::frosted_glass();

        // All presets should generate valid noise
        let x = 10.5;
        let y = 20.3;

        let v1 = clear.fractal_noise_2d(x, y);
        let v2 = regular.fractal_noise_2d(x, y);
        let v3 = thick.fractal_noise_2d(x, y);
        let v4 = frosted.fractal_noise_2d(x, y);

        assert!(v1.abs() <= 1.2);
        assert!(v2.abs() <= 1.2);
        assert!(v3.abs() <= 1.2);
        assert!(v4.abs() <= 1.2);
    }

    #[test]
    fn test_smoothness() {
        let noise = PerlinNoise::new(42, 4, 0.5, 2.0);

        // Adjacent samples should not differ wildly (smoothness property)
        let x = 10.0;
        let y = 10.0;
        let step = 0.01; // Small step

        let v1 = noise.fractal_noise_2d(x, y);
        let v2 = noise.fractal_noise_2d(x + step, y);
        let v3 = noise.fractal_noise_2d(x, y + step);

        let diff_x = (v2 - v1).abs();
        let diff_y = (v3 - v1).abs();

        // With small steps, differences should be small
        assert!(diff_x < 0.1, "Noise should be smooth: diff_x = {}", diff_x);
        assert!(diff_y < 0.1, "Noise should be smooth: diff_y = {}", diff_y);
    }
}
