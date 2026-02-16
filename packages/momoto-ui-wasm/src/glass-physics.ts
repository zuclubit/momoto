/**
 * @fileoverview Glass Physics Engine - TypeScript Interface
 *
 * High-level TypeScript API for physical glass material rendering powered by
 * Rust/WASM. Provides physics-based calculations for:
 *
 * - Fresnel reflectivity (angle-dependent glass appearance)
 * - Blinn-Phong specular highlights (dynamic light reflections)
 * - Perlin noise textures (frosted glass effects)
 * - Complete CSS generation for glass materials
 *
 * @module @momoto-ui/wasm/glass-physics
 * @version 1.0.0
 */

import type {
  Vec3 as WasmVec3,
  GlassMaterial as WasmGlassMaterial,
  PerlinNoise as WasmPerlinNoise,
  GlassPhysicsEngine as WasmGlassPhysicsEngine,
  OKLCH as WasmOKLCH,
  MaterialContext as WasmMaterialContext,
  BatchMaterialInput as WasmBatchMaterialInput,
  BatchResult as WasmBatchResult,
  BatchEvaluator as WasmBatchEvaluator,
} from '../momoto_wasm';

// Re-export WASM functions for advanced usage
export {
  fresnelSchlick,
  fresnelFull,
  brewsterAngle,
  calculateViewAngle,
  edgeIntensity,
  generateFresnelGradient,
  blinnPhongSpecular,
  calculateSpecularLayers,
  roughnessToShininess,
  calculateHighlightPosition,
  // LUT functions (5x faster in WASM)
  fresnelFast,
  beerLambertFast,
  totalLutMemory,
} from '../momoto_wasm';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * 3D vector for light direction and surface normals
 */
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Glass material preset types
 */
export type GlassMaterialPreset = 'clear' | 'regular' | 'thick' | 'frosted';

/**
 * Material context preset types - environment scenarios for glass evaluation
 */
export type MaterialContextPreset =
  | 'studio'    // Professional product photography
  | 'outdoor'   // Natural daylight
  | 'dramatic'  // High-contrast theatrical
  | 'neutral'   // Balanced default for UI
  | 'showcase'; // Best for revealing material properties

/**
 * Complete glass properties for CSS rendering
 */
export interface GlassProperties {
  /** Opacity value (0-1) */
  opacity: number;
  /** Blur amount in pixels */
  blur: number;
  /** Noise texture scale (0-1) */
  noiseScale: number;
  /** Current Fresnel reflectance value */
  fresnelValue: number;
  /** Fresnel gradient stops [position, intensity, ...] */
  fresnelGradient: number[];
  /** Specular layer data [intensity, x, y, size, ...] */
  specularLayers: number[];
}

/**
 * CSS string output for glass effects
 */
export interface GlassCSS {
  /** CSS filter property */
  filter: string;
  /** CSS background (gradient + effects) */
  background: string;
  /** CSS backdrop-filter */
  backdropFilter: string;
  /** CSS box-shadow (specular highlights) */
  boxShadow: string;
  /** Complete CSS object */
  all: Record<string, string>;
}

/**
 * Light source configuration
 */
export interface LightConfig {
  /** Light direction vector */
  direction: Vector3;
  /** Light intensity (0-1) */
  intensity?: number;
  /** Light color in hex */
  color?: string;
}

/**
 * Noise texture options
 */
export interface NoiseTextureOptions {
  /** Texture width in pixels */
  width?: number;
  /** Texture height in pixels */
  height?: number;
  /** Noise scale factor */
  scale?: number;
  /** Output format */
  format?: 'dataURL' | 'blob' | 'uint8array';
}

/**
 * Material properties for batch evaluation
 */
export interface BatchMaterialOptions {
  /** Index of refraction (1.0-2.5, glass typically 1.5) */
  ior: number;
  /** Surface roughness (0-1, 0=smooth, 1=frosted) */
  roughness: number;
  /** Thickness in millimeters */
  thickness: number;
  /** Absorption coefficient per millimeter */
  absorption: number;
}

/**
 * Result from batch material evaluation
 */
export interface BatchEvaluationResult {
  /** Number of materials evaluated */
  count: number;
  /** Opacity values (0-1) for each material */
  opacity: number[];
  /** Blur amounts in pixels for each material */
  blur: number[];
  /** Fresnel reflectance at normal incidence for each material */
  fresnelNormal: number[];
  /** Fresnel reflectance at grazing angle for each material */
  fresnelGrazing: number[];
  /** Transmittance values (0-1) for each material */
  transmittance: number[];
}

// ============================================================================
// VECTOR 3D UTILITIES
// ============================================================================

/**
 * Create a 3D vector
 */
export function vec3(x: number, y: number, z: number): Vector3 {
  return { x, y, z };
}

/**
 * Normalize a vector to unit length
 */
export function normalizeVec3(v: Vector3): Vector3 {
  const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  if (len === 0) return { x: 0, y: 0, z: 1 };
  return {
    x: v.x / len,
    y: v.y / len,
    z: v.z / len,
  };
}

/**
 * Calculate dot product of two vectors
 */
export function dotVec3(a: Vector3, b: Vector3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

/**
 * Common light direction presets
 */
export const LightDirections = {
  /** Light from top-left (typical UI lighting) */
  topLeft: normalizeVec3({ x: -0.5, y: -0.7, z: 0.5 }),
  /** Light from top */
  top: normalizeVec3({ x: 0, y: -1, z: 0.3 }),
  /** Light from top-right */
  topRight: normalizeVec3({ x: 0.5, y: -0.7, z: 0.5 }),
  /** Light from front */
  front: { x: 0, y: 0, z: 1 },
  /** Dramatic top light */
  dramatic: normalizeVec3({ x: 0, y: -1, z: 0.3 }),
} as const;

/**
 * Common surface normals
 */
export const SurfaceNormals = {
  /** Flat surface facing camera */
  flat: { x: 0, y: 0, z: 1 },
  /** Slightly curved upward */
  curvedUp: normalizeVec3({ x: 0, y: 0.2, z: 1 }),
  /** Slightly curved down */
  curvedDown: normalizeVec3({ x: 0, y: -0.2, z: 1 }),
} as const;

// ============================================================================
// GLASS PHYSICS ENGINE
// ============================================================================

/**
 * High-level glass physics engine with CSS generation
 *
 * @example
 * ```typescript
 * const engine = new GlassPhysics('regular');
 *
 * // Calculate properties
 * const props = engine.calculate({
 *   normal: { x: 0, y: 0, z: 1 },
 *   lightDirection: LightDirections.topLeft,
 * });
 *
 * // Generate CSS
 * const css = engine.toCSS(props);
 * element.style.cssText = css.all;
 * ```
 */
export class GlassPhysics {
  private engine: WasmGlassPhysicsEngine | null = null;
  private preset: GlassMaterialPreset;
  private wasmModule: typeof import('../momoto_wasm') | null = null;

  /**
   * Create glass physics engine
   *
   * @param preset - Material preset: 'clear', 'regular', 'thick', or 'frosted'
   */
  constructor(preset: GlassMaterialPreset = 'regular') {
    this.preset = preset;
    this.tryInitWasm();
  }

  /**
   * Try to initialize WASM engine
   */
  private async tryInitWasm(): Promise<void> {
    try {
      // Dynamic import for better tree-shaking
      this.wasmModule = await import('../momoto_wasm');
      await this.wasmModule.default(); // Initialize WASM

      // Create engine
      this.engine = new this.wasmModule.GlassPhysicsEngine(this.preset);
    } catch (error) {
      console.warn('[GlassPhysics] WASM not available:', error);
    }
  }

  /**
   * Calculate glass properties for rendering
   *
   * @param config - Light and surface configuration
   * @returns Complete glass properties
   */
  calculate(config: {
    normal?: Vector3;
    lightDirection?: Vector3;
    viewDirection?: Vector3;
  } = {}): GlassProperties {
    const {
      normal = SurfaceNormals.flat,
      lightDirection = LightDirections.topLeft,
      viewDirection = { x: 0, y: 0, z: 1 },
    } = config;

    if (!this.engine || !this.wasmModule) {
      return this.getFallbackProperties();
    }

    // Convert to WASM vectors
    const wasmNormal = new this.wasmModule.Vec3(normal.x, normal.y, normal.z);
    const wasmLight = new this.wasmModule.Vec3(
      lightDirection.x,
      lightDirection.y,
      lightDirection.z
    );
    const wasmView = new this.wasmModule.Vec3(
      viewDirection.x,
      viewDirection.y,
      viewDirection.z
    );

    // Calculate properties
    const props = this.engine.calculateProperties(wasmNormal, wasmLight, wasmView);

    // Clean up WASM objects
    wasmNormal.free();
    wasmLight.free();
    wasmView.free();

    return props as GlassProperties;
  }

  /**
   * Generate CSS from glass properties
   *
   * @param props - Glass properties from calculate()
   * @param options - CSS generation options
   * @returns CSS strings ready to apply
   */
  toCSS(
    props: GlassProperties,
    options: {
      /** Include background gradient (default: true) */
      includeBackground?: boolean;
      /** Include backdrop filter (default: true) */
      includeBackdrop?: boolean;
      /** Include specular highlights (default: true) */
      includeSpecular?: boolean;
      /** Base color for glass (default: white with low opacity) */
      baseColor?: string;
    } = {}
  ): GlassCSS {
    const {
      includeBackground = true,
      includeBackdrop = true,
      includeSpecular = true,
      baseColor = 'rgba(255, 255, 255, 0.1)',
    } = options;

    // Generate filter
    const filter = props.blur > 0 ? `blur(${props.blur.toFixed(2)}px)` : 'none';

    // Generate backdrop filter
    const backdropFilter = includeBackdrop
      ? `blur(${props.blur.toFixed(2)}px) saturate(1.2)`
      : 'none';

    // Generate Fresnel gradient
    let background = baseColor;
    if (includeBackground && props.fresnelGradient.length > 0) {
      const stops: string[] = [];
      for (let i = 0; i < props.fresnelGradient.length; i += 2) {
        const position = props.fresnelGradient[i];
        const intensity = props.fresnelGradient[i + 1];
        const alpha = intensity * props.opacity;
        stops.push(`rgba(255, 255, 255, ${alpha.toFixed(3)}) ${(position * 100).toFixed(1)}%`);
      }
      background = `linear-gradient(135deg, ${stops.join(', ')})`;
    }

    // Generate specular highlights as box-shadow
    let boxShadow = 'none';
    if (includeSpecular && props.specularLayers.length > 0) {
      const shadows: string[] = [];
      for (let i = 0; i < props.specularLayers.length; i += 4) {
        const intensity = props.specularLayers[i];
        const x = props.specularLayers[i + 1];
        const y = props.specularLayers[i + 2];
        const size = props.specularLayers[i + 3];

        if (intensity > 0.05) {
          // Only add visible highlights
          const alpha = Math.min(intensity, 0.6);
          shadows.push(
            `${x.toFixed(1)}% ${y.toFixed(1)}% ${size.toFixed(1)}px rgba(255, 255, 255, ${alpha.toFixed(2)})`
          );
        }
      }
      boxShadow = shadows.length > 0 ? `inset ${shadows.join(', inset ')}` : 'none';
    }

    // Combine all CSS
    const all: Record<string, string> = {
      filter,
      background,
      backdropFilter,
      boxShadow,
      opacity: props.opacity.toFixed(3),
    };

    return {
      filter,
      background,
      backdropFilter,
      boxShadow,
      all,
    };
  }

  /**
   * Generate noise texture as data URL
   *
   * @param options - Texture generation options
   * @returns Data URL or Uint8Array depending on format
   */
  async generateTexture(
    options: NoiseTextureOptions = {}
  ): Promise<string | Uint8Array> {
    const {
      width = 256,
      height = 256,
      scale = 0.05,
      format = 'dataURL',
    } = options;

    if (!this.engine || !this.wasmModule) {
      throw new Error('WASM engine not initialized');
    }

    // Generate texture
    const data = this.engine.generateNoiseTexture(width, height, scale);

    if (format === 'uint8array') {
      return data;
    }

    // Convert to canvas and get data URL
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    const imageData = ctx.createImageData(width, height);
    imageData.data.set(data);
    ctx.putImageData(imageData, 0, 0);

    if (format === 'blob') {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob as any));
      });
    }

    return canvas.toDataURL('image/png');
  }

  /**
   * Get material information
   */
  getMaterial(): {
    preset: GlassMaterialPreset;
    ior: number;
    roughness: number;
    thickness: number;
  } | null {
    if (!this.engine || !this.wasmModule) return null;

    const material = this.engine.material;
    return {
      preset: this.preset,
      ior: material.ior,
      roughness: material.roughness,
      thickness: material.thickness,
    };
  }

  /**
   * Get fallback properties when WASM is not available
   */
  private getFallbackProperties(): GlassProperties {
    const presetMap = {
      clear: { opacity: 0.95, blur: 4 },
      regular: { opacity: 0.85, blur: 12 },
      thick: { opacity: 0.7, blur: 20 },
      frosted: { opacity: 0.5, blur: 30 },
    };

    const preset = presetMap[this.preset];

    return {
      opacity: preset.opacity,
      blur: preset.blur,
      noiseScale: this.preset === 'frosted' ? 1.0 : 0.3,
      fresnelValue: 0.04,
      fresnelGradient: [0, 0.02, 1, 0.1], // Simple fallback
      specularLayers: [0.3, 50, 30, 40], // Simple fallback
    };
  }
}

// ============================================================================
// BATCH MATERIAL EVALUATOR
// ============================================================================

/**
 * High-performance batch evaluator for multiple materials
 *
 * Evaluates multiple materials in a single WASM call, achieving 7-10x
 * performance improvement over individual evaluations by reducing
 * JavaScript↔WASM boundary crossings.
 *
 * @example
 * ```typescript
 * const evaluator = new BatchMaterialEvaluator('studio');
 *
 * const materials = [
 *   { ior: 1.5, roughness: 0.2, thickness: 2.0, absorption: 0.1 }, // Clear
 *   { ior: 1.5, roughness: 0.6, thickness: 3.0, absorption: 0.2 }, // Frosted
 * ];
 *
 * const result = evaluator.evaluate(materials);
 * console.log(`Evaluated ${result.count} materials`);
 * console.log('Opacity values:', result.opacity);
 * ```
 */
export class BatchMaterialEvaluator {
  private evaluator: WasmBatchEvaluator | null = null;
  private wasmModule: typeof import('../momoto_wasm') | null = null;
  private contextPreset: MaterialContextPreset;

  /**
   * Create batch material evaluator
   *
   * @param contextPreset - Environment context preset (default: 'studio')
   */
  constructor(contextPreset: MaterialContextPreset = 'studio') {
    this.contextPreset = contextPreset;
    this.tryInitWasm();
  }

  /**
   * Try to initialize WASM engine
   */
  private async tryInitWasm(): Promise<void> {
    try {
      // Dynamic import for better tree-shaking
      this.wasmModule = await import('../momoto_wasm');
      await this.wasmModule.default(); // Initialize WASM

      // Create context and evaluator
      const context = this.createContext(this.contextPreset);
      this.evaluator = this.wasmModule.BatchEvaluator.withContext(context);
    } catch (error) {
      console.warn('[BatchMaterialEvaluator] WASM not available:', error);
    }
  }

  /**
   * Create MaterialContext from preset
   */
  private createContext(preset: MaterialContextPreset): WasmMaterialContext {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized');
    }

    switch (preset) {
      case 'studio':
        return this.wasmModule.MaterialContext.studio();
      case 'outdoor':
        return this.wasmModule.MaterialContext.outdoor();
      case 'dramatic':
        return this.wasmModule.MaterialContext.dramatic();
      case 'neutral':
        return this.wasmModule.MaterialContext.neutral();
      case 'showcase':
        return this.wasmModule.MaterialContext.showcase();
      default:
        return this.wasmModule.MaterialContext.studio();
    }
  }

  /**
   * Evaluate multiple materials in a single batch
   *
   * This is 7-10x faster than evaluating materials individually
   * due to reduced JavaScript↔WASM boundary crossings.
   *
   * @param materials - Array of material properties
   * @returns Evaluation results with arrays for each property
   */
  evaluate(materials: BatchMaterialOptions[]): BatchEvaluationResult {
    if (!this.evaluator || !this.wasmModule) {
      throw new Error('WASM engine not initialized. Wait for initialization or check console for errors.');
    }

    // Create batch input
    const input = new this.wasmModule.BatchMaterialInput();

    try {
      // Push all materials
      for (const mat of materials) {
        input.push(mat.ior, mat.roughness, mat.thickness, mat.absorption);
      }

      // Evaluate batch (single WASM call!)
      const result = this.evaluator.evaluate(input);

      // Convert to JavaScript-friendly format
      return {
        count: materials.length,
        opacity: Array.from(result.getOpacity()),
        blur: Array.from(result.getBlur()),
        fresnelNormal: Array.from(result.getFresnelNormal()),
        fresnelGrazing: Array.from(result.getFresnelGrazing()),
        transmittance: Array.from(result.getTransmittance()),
      };
    } finally {
      // Clean up WASM objects
      input.free();
    }
  }

  /**
   * Change the evaluation context
   *
   * @param preset - New context preset
   */
  setContext(preset: MaterialContextPreset): void {
    if (!this.evaluator || !this.wasmModule) {
      throw new Error('WASM engine not initialized');
    }

    this.contextPreset = preset;
    const context = this.createContext(preset);
    this.evaluator.setContext(context);
  }

  /**
   * Get current context preset
   */
  getContext(): MaterialContextPreset {
    return this.contextPreset;
  }

  /**
   * Check if WASM is initialized and ready
   */
  isReady(): boolean {
    return this.evaluator !== null && this.wasmModule !== null;
  }

  /**
   * Wait for WASM initialization
   *
   * @param timeout - Maximum wait time in milliseconds (default: 5000)
   * @returns Promise that resolves when ready or rejects on timeout
   */
  async waitForReady(timeout: number = 5000): Promise<void> {
    const start = Date.now();
    while (!this.isReady()) {
      if (Date.now() - start > timeout) {
        throw new Error('Timeout waiting for WASM initialization');
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Quick CSS generation for glass effect
 *
 * @example
 * ```typescript
 * const css = glassCSS('regular', {
 *   lightDirection: LightDirections.topLeft,
 * });
 * element.style.cssText = css;
 * ```
 */
export async function glassCSS(
  preset: GlassMaterialPreset = 'regular',
  config: Parameters<GlassPhysics['calculate']>[0] = {}
): Promise<Record<string, string>> {
  const engine = new GlassPhysics(preset);
  // Wait a bit for WASM to initialize
  await new Promise((resolve) => setTimeout(resolve, 10));
  const props = engine.calculate(config);
  const css = engine.toCSS(props);
  return css.all;
}

/**
 * Create multiple glass engines for comparison
 */
export function createGlassPresets(): Record<
  GlassMaterialPreset,
  GlassPhysics
> {
  return {
    clear: new GlassPhysics('clear'),
    regular: new GlassPhysics('regular'),
    thick: new GlassPhysics('thick'),
    frosted: new GlassPhysics('frosted'),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export type {
  WasmVec3,
  WasmGlassMaterial,
  WasmPerlinNoise,
  WasmGlassPhysicsEngine,
  WasmOKLCH,
  WasmMaterialContext,
  WasmBatchMaterialInput,
  WasmBatchResult,
  WasmBatchEvaluator,
};
