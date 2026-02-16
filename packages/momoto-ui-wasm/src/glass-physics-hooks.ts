/**
 * @fileoverview React Hooks for Glass Physics
 *
 * Provides React hooks for integrating glass physics calculations with
 * React components, including automatic recalculation on prop changes
 * and optimized CSS generation.
 *
 * @module @momoto-ui/wasm/glass-physics-hooks
 * @version 1.0.0
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  GlassPhysics,
  BatchMaterialEvaluator,
  type GlassMaterialPreset,
  type GlassProperties,
  type GlassCSS,
  type Vector3,
  type LightConfig,
  type MaterialContextPreset,
  type BatchMaterialOptions,
  type BatchEvaluationResult,
  LightDirections,
  SurfaceNormals,
} from './glass-physics';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Hook options for glass physics
 */
export interface UseGlassPhysicsOptions {
  /** Material preset */
  preset?: GlassMaterialPreset;
  /** Material context preset (for batch evaluation) */
  context?: MaterialContextPreset;
  /** Surface normal vector */
  normal?: Vector3;
  /** Light direction vector */
  lightDirection?: Vector3;
  /** View direction vector */
  viewDirection?: Vector3;
  /** Enable automatic recalculation on prop changes */
  autoUpdate?: boolean;
  /** CSS generation options */
  cssOptions?: {
    includeBackground?: boolean;
    includeBackdrop?: boolean;
    includeSpecular?: boolean;
    baseColor?: string;
  };
}

/**
 * Return value from useGlassPhysics hook
 */
export interface UseGlassPhysicsReturn {
  /** Calculated glass properties */
  properties: GlassProperties | null;
  /** Generated CSS strings */
  css: GlassCSS | null;
  /** CSS object ready to spread into style prop */
  style: React.CSSProperties;
  /** Whether WASM is initialized */
  isReady: boolean;
  /** Manually trigger recalculation */
  recalculate: () => void;
  /** Generate noise texture */
  generateTexture: (options?: {
    width?: number;
    height?: number;
    scale?: number;
  }) => Promise<string | Uint8Array>;
}

/**
 * Hook options for glass animation
 */
export interface UseGlassAnimationOptions extends UseGlassPhysicsOptions {
  /** Enable hover light movement */
  enableHover?: boolean;
  /** Animation duration in ms */
  duration?: number;
  /** Easing function */
  easing?: 'linear' | 'ease-in-out' | 'ease-out';
}

// ============================================================================
// MAIN HOOK: useGlassPhysics
// ============================================================================

/**
 * React hook for glass physics calculations
 *
 * @example
 * ```tsx
 * function GlassButton() {
 *   const { style, isReady } = useGlassPhysics({
 *     preset: 'regular',
 *     lightDirection: LightDirections.topLeft,
 *   });
 *
 *   return (
 *     <button style={style} disabled={!isReady}>
 *       Glass Button
 *     </button>
 *   );
 * }
 * ```
 */
export function useGlassPhysics(
  options: UseGlassPhysicsOptions = {}
): UseGlassPhysicsReturn {
  const {
    preset = 'regular',
    normal = SurfaceNormals.flat,
    lightDirection = LightDirections.topLeft,
    viewDirection = { x: 0, y: 0, z: 1 },
    autoUpdate = true,
    cssOptions = {},
  } = options;

  const [isReady, setIsReady] = useState(false);
  const [properties, setProperties] = useState<GlassProperties | null>(null);
  const [css, setCSS] = useState<GlassCSS | null>(null);

  // Create engine instance (memoized)
  const engine = useMemo(() => new GlassPhysics(preset), [preset]);

  // Calculate properties
  const calculate = useCallback(() => {
    const props = engine.calculate({ normal, lightDirection, viewDirection });
    setProperties(props);

    const generatedCSS = engine.toCSS(props, cssOptions);
    setCSS(generatedCSS);
  }, [engine, normal, lightDirection, viewDirection, cssOptions]);

  // Initialize and calculate on mount
  useEffect(() => {
    const init = async () => {
      // Wait for WASM to initialize
      await new Promise((resolve) => setTimeout(resolve, 50));
      setIsReady(true);
      calculate();
    };

    init();
  }, [calculate]);

  // Auto-recalculate on changes
  useEffect(() => {
    if (autoUpdate && isReady) {
      calculate();
    }
  }, [autoUpdate, isReady, calculate, normal, lightDirection, viewDirection]);

  // Generate texture function
  const generateTexture = useCallback(
    async (textureOptions = {}) => {
      return engine.generateTexture(textureOptions);
    },
    [engine]
  );

  // Convert CSS to React style object
  const style = useMemo<React.CSSProperties>(() => {
    if (!css) return {};

    return {
      filter: css.filter,
      background: css.background,
      backdropFilter: css.backdropFilter,
      boxShadow: css.boxShadow,
      opacity: properties?.opacity ?? 1,
    };
  }, [css, properties]);

  return {
    properties,
    css,
    style,
    isReady,
    recalculate: calculate,
    generateTexture,
  };
}

// ============================================================================
// ANIMATED GLASS HOOK
// ============================================================================

/**
 * Hook for animated glass effects with hover interactions
 *
 * @example
 * ```tsx
 * function AnimatedGlassCard() {
 *   const { style, handlers } = useGlassAnimation({
 *     preset: 'regular',
 *     enableHover: true,
 *   });
 *
 *   return (
 *     <div style={style} {...handlers}>
 *       Animated Glass
 *     </div>
 *   );
 * }
 * ```
 */
export function useGlassAnimation(
  options: UseGlassAnimationOptions = {}
): UseGlassPhysicsReturn & {
  handlers: {
    onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave: () => void;
  };
} {
  const {
    enableHover = true,
    duration = 300,
    easing = 'ease-out',
    ...glassOptions
  } = options;

  const [lightDirection, setLightDirection] = useState<Vector3>(
    options.lightDirection || LightDirections.topLeft
  );

  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Use base glass physics hook
  const glassPhysics = useGlassPhysics({
    ...glassOptions,
    lightDirection,
  });

  // Handle mouse move for dynamic light
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!enableHover) return;

      const element = e.currentTarget;
      elementRef.current = element;

      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Convert mouse position to light direction
      // Center (0.5, 0.5) = light from front
      // Edges create angled light
      const dx = (x - 0.5) * 2;
      const dy = (y - 0.5) * 2;

      const newLight: Vector3 = {
        x: -dx,
        y: -dy,
        z: Math.max(0.3, 1 - Math.abs(dx) - Math.abs(dy)),
      };

      // Normalize
      const len = Math.sqrt(newLight.x ** 2 + newLight.y ** 2 + newLight.z ** 2);
      setLightDirection({
        x: newLight.x / len,
        y: newLight.y / len,
        z: newLight.z / len,
      });
    },
    [enableHover]
  );

  // Handle mouse leave - return to default
  const handleMouseLeave = useCallback(() => {
    if (!enableHover) return;

    // Animate back to default light direction
    const defaultLight = options.lightDirection || LightDirections.topLeft;
    setLightDirection(defaultLight);
  }, [enableHover, options.lightDirection]);

  // Add transition to style
  const animatedStyle = useMemo<React.CSSProperties>(() => {
    return {
      ...glassPhysics.style,
      transition: `all ${duration}ms ${easing}`,
    };
  }, [glassPhysics.style, duration, easing]);

  return {
    ...glassPhysics,
    style: animatedStyle,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}

// ============================================================================
// PRESET COMPARISON HOOK
// ============================================================================

/**
 * Hook for comparing multiple glass presets
 *
 * @example
 * ```tsx
 * function GlassComparison() {
 *   const presets = useGlassPresets(['clear', 'regular', 'frosted']);
 *
 *   return (
 *     <div>
 *       {presets.map(({ preset, style }) => (
 *         <div key={preset} style={style}>
 *           {preset}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useGlassPresets(
  presets: GlassMaterialPreset[] = ['clear', 'regular', 'thick', 'frosted'],
  sharedOptions: Omit<UseGlassPhysicsOptions, 'preset'> = {}
): Array<{
  preset: GlassMaterialPreset;
  properties: GlassProperties | null;
  css: GlassCSS | null;
  style: React.CSSProperties;
  isReady: boolean;
}> {
  const results = presets.map((preset) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const glass = useGlassPhysics({ ...sharedOptions, preset });
    return {
      preset,
      properties: glass.properties,
      css: glass.css,
      style: glass.style,
      isReady: glass.isReady,
    };
  });

  return results;
}

// ============================================================================
// NOISE TEXTURE HOOK
// ============================================================================

/**
 * Hook for generating and managing noise textures
 *
 * @example
 * ```tsx
 * function FrostedGlass() {
 *   const { textureURL, regenerate } = useNoiseTexture({
 *     preset: 'frosted',
 *     width: 512,
 *     height: 512,
 *   });
 *
 *   return (
 *     <div
 *       style={{
 *         backgroundImage: `url(${textureURL})`,
 *         backgroundSize: 'cover',
 *       }}
 *     >
 *       <button onClick={regenerate}>New Texture</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNoiseTexture(options: {
  preset?: GlassMaterialPreset;
  width?: number;
  height?: number;
  scale?: number;
  autoGenerate?: boolean;
}): {
  textureURL: string | null;
  isGenerating: boolean;
  regenerate: () => Promise<void>;
} {
  const {
    preset = 'regular',
    width = 256,
    height = 256,
    scale = 0.05,
    autoGenerate = true,
  } = options;

  const [textureURL, setTextureURL] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const engine = useMemo(() => new GlassPhysics(preset), [preset]);

  const generate = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Wait for WASM
      await new Promise((resolve) => setTimeout(resolve, 50));

      const url = await engine.generateTexture({
        width,
        height,
        scale,
        format: 'dataURL',
      });

      setTextureURL(url as string);
    } catch (error) {
      console.error('[useNoiseTexture] Failed to generate:', error);
      setTextureURL(null);
    } finally {
      setIsGenerating(false);
    }
  }, [engine, width, height, scale]);

  // Auto-generate on mount
  useEffect(() => {
    if (autoGenerate) {
      generate();
    }
  }, [autoGenerate, generate]);

  return {
    textureURL,
    isGenerating,
    regenerate: generate,
  };
}

// ============================================================================
// BATCH EVALUATION HOOKS
// ============================================================================

/**
 * Hook for batch material evaluation with context support
 *
 * Evaluates multiple materials in a single WASM call for maximum performance.
 * 7-10x faster than individual evaluations.
 *
 * @example
 * ```tsx
 * function MaterialGrid() {
 *   const materials = useMemo(() => [
 *     { ior: 1.5, roughness: 0.2, thickness: 2.0, absorption: 0.1 },
 *     { ior: 1.5, roughness: 0.6, thickness: 3.0, absorption: 0.2 },
 *   ], []);
 *
 *   const { result, context, setContext } = useGlassBatchEvaluator(materials, 'studio');
 *
 *   return (
 *     <div>
 *       <select value={context} onChange={(e) => setContext(e.target.value)}>
 *         <option value="studio">Studio</option>
 *         <option value="outdoor">Outdoor</option>
 *       </select>
 *       {result.opacity.map((opacity, i) => (
 *         <div key={i} style={{ opacity }}>Material {i}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useGlassBatchEvaluator(
  materials: BatchMaterialOptions[],
  initialContext: MaterialContextPreset = 'studio'
): {
  result: BatchEvaluationResult | null;
  context: MaterialContextPreset;
  setContext: (preset: MaterialContextPreset) => void;
  isReady: boolean;
  evaluator: BatchMaterialEvaluator | null;
} {
  const [context, setContextState] = useState<MaterialContextPreset>(initialContext);
  const [result, setResult] = useState<BatchEvaluationResult | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Create evaluator (memoized)
  const evaluator = useMemo(() => new BatchMaterialEvaluator(initialContext), [initialContext]);

  // Initialize
  useEffect(() => {
    const init = async () => {
      try {
        await evaluator.waitForReady();
        setIsReady(true);
      } catch (error) {
        console.error('[useGlassBatchEvaluator] Initialization failed:', error);
      }
    };

    init();
  }, [evaluator]);

  // Evaluate when ready or materials/context change
  useEffect(() => {
    if (!isReady || materials.length === 0) return;

    try {
      const evalResult = evaluator.evaluate(materials);
      setResult(evalResult);
    } catch (error) {
      console.error('[useGlassBatchEvaluator] Evaluation failed:', error);
    }
  }, [isReady, materials, evaluator]);

  // Context setter
  const setContext = useCallback(
    (preset: MaterialContextPreset) => {
      setContextState(preset);
      if (isReady) {
        evaluator.setContext(preset);
        // Re-evaluate with new context
        try {
          const evalResult = evaluator.evaluate(materials);
          setResult(evalResult);
        } catch (error) {
          console.error('[useGlassBatchEvaluator] Re-evaluation failed:', error);
        }
      }
    },
    [isReady, evaluator, materials]
  );

  return {
    result,
    context,
    setContext,
    isReady,
    evaluator: isReady ? evaluator : null,
  };
}

/**
 * Hook for managing material context state
 *
 * Provides a simple state manager for MaterialContext presets.
 *
 * @example
 * ```tsx
 * function ContextSelector() {
 *   const { context, setContext, isStudio, isDramatic } = useMaterialContext('studio');
 *
 *   return (
 *     <div>
 *       <button
 *         onClick={() => setContext('studio')}
 *         disabled={isStudio}
 *       >
 *         Studio
 *       </button>
 *       <button
 *         onClick={() => setContext('dramatic')}
 *         disabled={isDramatic}
 *       >
 *         Dramatic
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useMaterialContext(initialPreset: MaterialContextPreset = 'studio'): {
  context: MaterialContextPreset;
  setContext: (preset: MaterialContextPreset) => void;
  isStudio: boolean;
  isOutdoor: boolean;
  isDramatic: boolean;
  isNeutral: boolean;
  isShowcase: boolean;
} {
  const [context, setContext] = useState<MaterialContextPreset>(initialPreset);

  return {
    context,
    setContext,
    isStudio: context === 'studio',
    isOutdoor: context === 'outdoor',
    isDramatic: context === 'dramatic',
    isNeutral: context === 'neutral',
    isShowcase: context === 'showcase',
  };
}

/**
 * Hook for comparing materials across different contexts
 *
 * Evaluates the same materials under multiple lighting contexts for comparison.
 *
 * @example
 * ```tsx
 * function ContextComparison() {
 *   const materials = useMemo(() => [
 *     { ior: 1.5, roughness: 0.2, thickness: 2.0, absorption: 0.1 },
 *   ], []);
 *
 *   const results = useContextComparison(materials, ['studio', 'outdoor', 'dramatic']);
 *
 *   return (
 *     <div>
 *       {results.map(({ context, result }) => (
 *         <div key={context}>
 *           <h3>{context}</h3>
 *           <div style={{ opacity: result?.opacity[0] }}>Material</div>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useContextComparison(
  materials: BatchMaterialOptions[],
  contexts: MaterialContextPreset[] = ['studio', 'outdoor', 'dramatic']
): Array<{
  context: MaterialContextPreset;
  result: BatchEvaluationResult | null;
  isReady: boolean;
}> {
  return contexts.map((context) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { result, isReady } = useGlassBatchEvaluator(materials, context);
    return { context, result, isReady };
  });
}

// ============================================================================
// RESPONSIVE GLASS HOOK
// ============================================================================

/**
 * Hook for responsive glass effects based on screen size
 *
 * Automatically adjusts blur and opacity for better performance on mobile
 */
export function useResponsiveGlass(
  baseOptions: UseGlassPhysicsOptions = {}
): UseGlassPhysicsReturn {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Adjust preset for mobile
  const responsiveOptions = useMemo<UseGlassPhysicsOptions>(() => {
    if (isMobile) {
      // Use lighter presets on mobile for performance
      const presetMap: Record<GlassMaterialPreset, GlassMaterialPreset> = {
        clear: 'clear',
        regular: 'clear',
        thick: 'regular',
        frosted: 'regular',
      };

      return {
        ...baseOptions,
        preset: presetMap[baseOptions.preset || 'regular'],
        cssOptions: {
          ...baseOptions.cssOptions,
          includeSpecular: false, // Disable expensive effects on mobile
        },
      };
    }

    return baseOptions;
  }, [isMobile, baseOptions]);

  return useGlassPhysics(responsiveOptions);
}
