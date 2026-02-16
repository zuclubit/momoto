export { InMemoryAuditAdapter, InMemoryAuditOptions } from './audit/index.mjs';
export { W3CExporterOptions, W3CTokenExporter } from './exporters/index.mjs';
import * as momoto_wasm from 'momoto-wasm';
import '../UIState-DmEU8dBf.mjs';
import '../AuditPort-BZq0Hub6.mjs';
import '../ComponentIntent-DvAiAw-R.mjs';
import '../DesignToken-Bln084x4.mjs';
import '../TokenCollection-CtE784DZ.mjs';
import '../ExporterPort-BfduwJSx.mjs';

type WasmModule = typeof momoto_wasm;
declare const MomotoBridge: {
    /** Initialize the WASM module. Safe to call multiple times. */
    readonly init: () => Promise<void>;
    /** Check if WASM is loaded and ready. */
    readonly isReady: () => boolean;
    /** Get initialization error, if any. */
    readonly getError: () => Error | null;
    /** Assert WASM is initialized (throws if not). */
    readonly assertReady: () => void;
    /** Reset for testing only. */
    readonly __resetForTests: () => void;
    readonly color: {
        readonly fromHex: (hex: string) => momoto_wasm.Color;
        readonly fromRgb: (r: number, g: number, b: number) => momoto_wasm.Color;
        readonly toHex: (color: InstanceType<WasmModule["Color"]>) => string;
        readonly lighten: (color: InstanceType<WasmModule["Color"]>, amount: number) => momoto_wasm.Color;
        readonly darken: (color: InstanceType<WasmModule["Color"]>, amount: number) => momoto_wasm.Color;
        readonly saturate: (color: InstanceType<WasmModule["Color"]>, amount: number) => momoto_wasm.Color;
        readonly desaturate: (color: InstanceType<WasmModule["Color"]>, amount: number) => momoto_wasm.Color;
    };
    readonly oklch: {
        readonly create: (l: number, c: number, h: number) => momoto_wasm.OKLCH;
        readonly fromColor: (color: InstanceType<WasmModule["Color"]>) => momoto_wasm.OKLCH;
        readonly toColor: (oklch: InstanceType<WasmModule["OKLCH"]>) => momoto_wasm.Color;
        readonly interpolate: (a: InstanceType<WasmModule["OKLCH"]>, b: InstanceType<WasmModule["OKLCH"]>, t: number, huePath?: "shorter" | "longer") => momoto_wasm.OKLCH;
        readonly deltaE: (a: InstanceType<WasmModule["OKLCH"]>, b: InstanceType<WasmModule["OKLCH"]>) => number;
        readonly mapToGamut: (oklch: InstanceType<WasmModule["OKLCH"]>) => momoto_wasm.OKLCH;
    };
    readonly oklab: {
        readonly create: (l: number, a: number, b: number) => momoto_wasm.OKLab;
        readonly fromColor: (color: InstanceType<WasmModule["Color"]>) => momoto_wasm.OKLab;
        readonly toColor: (oklab: InstanceType<WasmModule["OKLab"]>) => momoto_wasm.Color;
        readonly toOklch: (oklab: InstanceType<WasmModule["OKLab"]>) => momoto_wasm.OKLCH;
        readonly interpolate: (from: InstanceType<WasmModule["OKLab"]>, to: InstanceType<WasmModule["OKLab"]>, t: number) => momoto_wasm.OKLab;
        readonly deltaE: (a: InstanceType<WasmModule["OKLab"]>, b: InstanceType<WasmModule["OKLab"]>) => number;
    };
    readonly contrast: {
        /** Full WCAG 2.1 evaluation. */
        readonly wcag: (fg: InstanceType<WasmModule["Color"]>, bg: InstanceType<WasmModule["Color"]>) => momoto_wasm.ContrastResult;
        /** Full APCA evaluation with polarity. */
        readonly apca: (fg: InstanceType<WasmModule["Color"]>, bg: InstanceType<WasmModule["Color"]>) => momoto_wasm.ContrastResult;
        /** Direct WCAG contrast ratio (faster than full evaluate). */
        readonly wcagRatio: (fg: InstanceType<WasmModule["Color"]>, bg: InstanceType<WasmModule["Color"]>) => number;
        /** Check if ratio passes WCAG level. */
        readonly wcagPasses: (ratio: number, level: "AA" | "AAA", isLarge: boolean) => boolean;
        /** Determine highest WCAG level: null | 'AA' | 'AAA'. */
        readonly wcagLevel: (ratio: number, isLarge: boolean) => null | "AA" | "AAA";
        /** Check if text qualifies as "large text" per WCAG. */
        readonly isLargeText: (fontSizePx: number, fontWeight: number) => boolean;
        /** Get WCAG minimum ratio for level + text size. */
        readonly wcagRequirement: (level: "AA" | "AAA", isLarge: boolean) => number;
        /** Get full requirements matrix: [AA_normal, AA_large, AAA_normal, AAA_large]. */
        readonly wcagRequirementsMatrix: () => Float64Array;
        /** Get APCA algorithm constants (reference values). */
        readonly apcaConstants: () => Record<string, number>;
        /** Batch: WCAG contrast ratios for multiple pairs. */
        readonly wcagRatioBatch: (pairs: Uint8Array) => Float64Array;
        /** Batch: WCAG relative luminance for multiple colors. */
        readonly luminanceBatch: (rgbData: Uint8Array) => Float64Array;
    };
    readonly luminance: {
        readonly srgb: (color: InstanceType<WasmModule["Color"]>) => number;
        readonly apca: (color: InstanceType<WasmModule["Color"]>) => number;
        readonly srgbToLinear: (value: number) => number;
        readonly linearToSrgb: (value: number) => number;
    };
    readonly quality: {
        /** Score a color pair for overall quality. */
        readonly score: (fg: InstanceType<WasmModule["Color"]>, bg: InstanceType<WasmModule["Color"]>, usage: number, target: number) => momoto_wasm.QualityScore;
        /** Batch: Score multiple pairs. */
        readonly scoreBatch: (pairs: Float64Array) => Float64Array;
        /** Get minimum WCAG AA ratio for usage context. */
        readonly minWcagAA: (usage: number) => number;
        /** Get minimum APCA Lc for usage context. */
        readonly minApcaLc: (usage: number) => number;
        /** Whether usage context requires compliance. */
        readonly requiresCompliance: (usage: number) => boolean;
    };
    readonly recommend: {
        /** Recommend optimal foreground for a background. */
        readonly foreground: (bg: InstanceType<WasmModule["Color"]>, usage: number, target: number) => momoto_wasm.Recommendation;
        /** Improve existing foreground against background. */
        readonly improveForeground: (fg: InstanceType<WasmModule["Color"]>, bg: InstanceType<WasmModule["Color"]>, usage: number, target: number) => momoto_wasm.Recommendation;
        /** Batch: Recommend foregrounds for multiple backgrounds. */
        readonly foregroundBatch: (backgrounds: Uint8Array) => any[];
    };
    readonly explain: {
        readonly contrastImprovement: (originalHex: string, recommendedHex: string, backgroundHex: string, originalRatio: number, newRatio: number, targetRatio: number, deltaL: number, deltaC: number, deltaH: number) => momoto_wasm.RecommendationExplanation;
    };
    readonly advancedScoring: {
        readonly scoreRecommendation: (category: string, before: QualityScoreInput, after: QualityScoreInput, deltaL: number, deltaC: number, deltaH: number) => momoto_wasm.AdvancedScore;
    };
    readonly convergence: {
        readonly create: (preset?: "default" | "fast" | "highQuality" | "neural") => momoto_wasm.ConvergenceDetector;
    };
    readonly agent: {
        /** Create an agent executor for query/response operations. */
        readonly createExecutor: () => momoto_wasm.AgentExecutor;
        /** Quick: Validate a color pair. */
        readonly validatePair: (fgHex: string, bgHex: string, standard: "wcag" | "apca", level: "AA" | "AAA") => string;
        /** Quick: Get color metrics. */
        readonly getMetrics: (hex: string) => string;
        /** Quick: Recommend foreground. */
        readonly recommendForeground: (bgHex: string, context: string, target: string) => string;
        /** Quick: Improve foreground. */
        readonly improveForeground: (fgHex: string, bgHex: string, context: string, target: string) => string;
        /** Quick: Score a pair. */
        readonly scorePair: (fgHex: string, bgHex: string, context: string, target: string) => string;
        /** Batch: Validate multiple pairs. */
        readonly validatePairsBatch: (pairs: Array<{
            fg: string;
            bg: string;
            standard: number;
            level: number;
        }>) => string;
        /** Batch: Get metrics for multiple colors. */
        readonly getMetricsBatch: (hexColors: string[]) => string;
        /** Build a contract with constraints. */
        readonly contract: () => momoto_wasm.ContractBuilder;
        /** Generate a complete visual experience. */
        readonly generateExperience: (preset: string, primaryHex: string, backgroundHex: string) => string;
        /** Get Momoto system identity. */
        readonly getIdentity: () => string;
        /** Run self-certification. */
        readonly selfCertify: () => string;
    };
    readonly events: {
        /** Create an event bus. */
        readonly createBus: (bufferSize?: number, maxAgeMs?: number) => momoto_wasm.MomotoEventBus;
        /** Create a real-time event stream from a bus. */
        readonly createStream: (bus: InstanceType<WasmModule["MomotoEventBus"]>) => momoto_wasm.MomotoEventStream;
        /** Create a batched event stream from a bus. */
        readonly createBatchedStream: (bus: InstanceType<WasmModule["MomotoEventBus"]>, batchSize: number, timeoutMs: number) => momoto_wasm.MomotoEventStream;
    };
    readonly glass: {
        readonly clear: () => momoto_wasm.GlassMaterial;
        readonly regular: () => momoto_wasm.GlassMaterial;
        readonly thick: () => momoto_wasm.GlassMaterial;
        readonly frosted: () => momoto_wasm.GlassMaterial;
        readonly builder: () => momoto_wasm.GlassMaterialBuilder;
        readonly liquid: (variant?: "regular" | "clear") => momoto_wasm.LiquidGlass;
    };
    readonly css: {
        readonly config: {
            readonly default: () => momoto_wasm.CssRenderConfig;
            readonly minimal: () => momoto_wasm.CssRenderConfig;
            readonly premium: () => momoto_wasm.CssRenderConfig;
            readonly modal: () => momoto_wasm.CssRenderConfig;
            readonly subtle: () => momoto_wasm.CssRenderConfig;
            readonly darkMode: () => momoto_wasm.CssRenderConfig;
        };
        /** Render a glass material to CSS. */
        readonly render: (material: InstanceType<WasmModule["GlassMaterial"]>, context?: InstanceType<WasmModule["RenderContext"]>) => string;
    };
    readonly math: {
        readonly lerp: (a: number, b: number, t: number) => number;
        readonly inverseLerp: (a: number, b: number, v: number) => number;
        readonly smoothstep: (t: number) => number;
        readonly smootherstep: (t: number) => number;
        readonly easeInOut: (t: number) => number;
        readonly remap: (v: number, inMin: number, inMax: number, outMin: number, outMax: number) => number;
    };
    readonly siren: {
        /** Compute SIREN neural correction for a foreground/background pair. */
        readonly correct: (bgL: number, bgC: number, bgH: number, fgL: number, fgC: number, fgH: number, apcaLc: number, wcagRatio: number, quality: number) => SirenCorrectionResult;
        /** Apply SIREN correction to OKLCH values. Returns corrected [L, C, H]. */
        readonly apply: (l: number, c: number, h: number, deltaL: number, deltaC: number, deltaH: number) => [number, number, number];
        /** Batch: Compute corrections for multiple pairs.
         *  Input: Float64Array of [bgL, bgC, bgH, fgL, fgC, fgH, apcaLc, wcagRatio, quality, ...] (9 per pair)
         *  Output: Float64Array of [deltaL, deltaC, deltaH, ...] (3 per pair) */
        readonly correctBatch: (inputs: Float64Array) => Float64Array;
        /** Get network metadata (architecture, params, seed). */
        readonly metadata: () => SirenMetadata;
        /** Export raw weights for inspection. */
        readonly weights: () => any;
    };
    readonly refraction: {
        /** Create refraction parameters. */
        readonly params: (ior: number, distortion: number, chromatic: number, edge: number) => momoto_wasm.RefractionParams;
        /** Presets */
        readonly clear: () => momoto_wasm.RefractionParams;
        readonly frosted: () => momoto_wasm.RefractionParams;
        readonly thick: () => momoto_wasm.RefractionParams;
        readonly subtle: () => momoto_wasm.RefractionParams;
        readonly highIndex: () => momoto_wasm.RefractionParams;
        /** Calculate refraction at position. Returns Float64Array [offsetX, offsetY, hueShift, brightness]. */
        readonly calculate: (params: InstanceType<WasmModule["RefractionParams"]>, x: number, y: number, incidentAngle?: number) => Float64Array;
        /** Apply refraction to OKLCH. Returns Float64Array [l, c, h]. */
        readonly applyToColor: (params: InstanceType<WasmModule["RefractionParams"]>, l: number, c: number, h: number, x: number, y: number, incidentAngle?: number) => Float64Array;
        /** Generate distortion map. Returns Float64Array [offsetX, offsetY, hueShift, brightness, ...]. */
        readonly distortionMap: (params: InstanceType<WasmModule["RefractionParams"]>, gridSize: number) => Float64Array;
    };
    readonly lighting: {
        /** Create default lighting environment. */
        readonly environment: () => momoto_wasm.LightingEnvironment;
        /** Calculate lighting for a surface.
         *  Returns { diffuse, specular, total, light_color } */
        readonly calculate: (normalX: number, normalY: number, normalZ: number, viewX: number, viewY: number, viewZ: number, env: InstanceType<WasmModule["LightingEnvironment"]>, shininess: number) => any;
        /** Derive physics-based gradient. */
        readonly gradient: (env: InstanceType<WasmModule["LightingEnvironment"]>, surfaceCurvature: number, shininess: number, samples: number) => any;
        /** Gradient to CSS with base color. */
        readonly gradientCss: (env: InstanceType<WasmModule["LightingEnvironment"]>, surfaceCurvature: number, shininess: number, samples: number, baseL: number, baseC: number, baseH: number) => any;
        /** Lighting context presets (for material evaluation). */
        readonly context: {
            readonly studio: () => momoto_wasm.LightingContext;
            readonly outdoor: () => momoto_wasm.LightingContext;
            readonly dramatic: () => momoto_wasm.LightingContext;
            readonly soft: () => momoto_wasm.LightingContext;
            readonly neutral: () => momoto_wasm.LightingContext;
        };
    };
    readonly shadows: {
        /** Shadow parameter presets */
        readonly standard: () => momoto_wasm.AmbientShadowParams;
        readonly elevated: () => momoto_wasm.AmbientShadowParams;
        readonly subtle: () => momoto_wasm.AmbientShadowParams;
        readonly dramatic: () => momoto_wasm.AmbientShadowParams;
        /** Calculate ambient shadow CSS. Requires background OKLCH. */
        readonly ambient: (params: InstanceType<WasmModule["AmbientShadowParams"]>, bgL: number, bgC: number, bgH: number, elevation: number) => string;
        /** Multi-scale ambient shadow CSS (3 layers). */
        readonly multiScale: (params: InstanceType<WasmModule["AmbientShadowParams"]>, bgL: number, bgC: number, bgH: number, elevation: number) => string;
        /** Interactive shadow that responds to UI state.
         *  state: 0=Rest, 1=Hover, 2=Active, 3=Focus */
        readonly interactive: (transition: InstanceType<WasmModule["ElevationTransition"]>, state: number, bgL: number, bgC: number, bgH: number, glassDepth: number) => string;
        /** Elevation transition presets */
        readonly transitions: {
            readonly card: () => momoto_wasm.ElevationTransition;
            readonly fab: () => momoto_wasm.ElevationTransition;
            readonly flat: () => momoto_wasm.ElevationTransition;
        };
        /** Material Design elevation value in dp. */
        readonly elevationDp: (level: number) => number;
        /** Elevation surface tint opacity. */
        readonly elevationTint: (level: number) => number;
    };
    readonly pbr: {
        /** Create dielectric (glass) BSDF. */
        readonly dielectric: (ior: number, roughness: number) => momoto_wasm.DielectricBSDF;
        readonly glass: () => momoto_wasm.DielectricBSDF;
        readonly water: () => momoto_wasm.DielectricBSDF;
        readonly diamond: () => momoto_wasm.DielectricBSDF;
        /** Create conductor (metal) BSDF. */
        readonly conductor: (n: number, k: number, roughness: number) => momoto_wasm.ConductorBSDF;
        readonly gold: () => momoto_wasm.ConductorBSDF;
        readonly silver: () => momoto_wasm.ConductorBSDF;
        readonly copper: () => momoto_wasm.ConductorBSDF;
        /** Create thin-film BSDF. */
        readonly thinFilm: (thickness: number, filmIor: number, substrateIor: number) => momoto_wasm.ThinFilmBSDF;
        readonly soapBubble: (thickness?: number) => momoto_wasm.ThinFilmBSDF;
        readonly oilSlick: (thickness?: number) => momoto_wasm.ThinFilmBSDF;
        /** Create layered material stack. */
        readonly layered: () => momoto_wasm.LayeredBSDF;
        /** Create Lambertian (diffuse) BSDF. albedo: 0-1. */
        readonly lambertian: (albedo: number) => momoto_wasm.LambertianBSDF;
        /** High-level PBR material from preset name. */
        readonly material: (preset: string) => momoto_wasm.PBRMaterial;
        /** PBR material builder for custom composition. */
        readonly materialBuilder: () => momoto_wasm.PBRMaterialBuilder;
        /** Batch evaluate multiple materials. */
        readonly evaluateBatch: (iors: Float64Array, roughnesses: Float64Array, thicknesses: Float64Array, absorptions: Float64Array) => any;
    };
    readonly spectral: {
        /** Create a spectral pipeline for physically-based rendering. */
        readonly pipeline: () => momoto_wasm.SpectralPipeline;
        /** Create a spectral signal. */
        readonly signal: (wavelengths: Float64Array, intensities: Float64Array) => momoto_wasm.SpectralSignal;
        /** D65 illuminant spectral signal. */
        readonly d65: () => momoto_wasm.SpectralSignal;
        /** Uniform spectral signal. */
        readonly uniform: (intensity: number) => momoto_wasm.SpectralSignal;
        /** Default spectral sampling wavelengths (31 points, 380-780nm). */
        readonly defaultSampling: () => Float64Array<ArrayBufferLike>;
        /** High-resolution spectral sampling (81 points). */
        readonly highResSampling: () => Float64Array<ArrayBufferLike>;
        /** Demonstrate spectral pipeline. */
        readonly demo: () => object;
        /** Flicker detection validator. */
        readonly flickerValidator: () => momoto_wasm.FlickerValidator;
        readonly flickerValidatorStrict: () => momoto_wasm.FlickerValidator;
        readonly flickerValidatorRelaxed: () => momoto_wasm.FlickerValidator;
        readonly flickerValidatorCustom: (stable: number, minor: number, warning: number) => momoto_wasm.FlickerValidator;
    };
    readonly temporal: {
        /** Rate limiter for smooth transitions. */
        readonly rateLimiter: (initial: number, maxRate: number, smooth?: boolean) => momoto_wasm.RateLimiter;
        /** Exponential moving average. */
        readonly ema: (alpha: number) => momoto_wasm.ExponentialMovingAverage;
        /** Time-varying dielectric presets. */
        readonly dryingPaint: () => momoto_wasm.TemporalDielectric;
        readonly weatheringGlass: () => momoto_wasm.TemporalDielectric;
        /** Time-varying thin film preset. */
        readonly soapBubble: () => momoto_wasm.TemporalThinFilm;
        /** Time-varying conductor preset. */
        readonly heatedGold: () => momoto_wasm.TemporalConductor;
    };
    readonly constraints: {
        /** Create physics constraint validator. */
        readonly validator: () => momoto_wasm.ConstraintValidator;
        /** Create validator with custom config. */
        readonly validatorWithConfig: (energyTol: number, reciprocityTol: number, maxSpectralGrad: number, hardClamp: boolean) => momoto_wasm.ConstraintValidator;
    };
    readonly deltaE: {
        /** CIE delta-E76 (Euclidean in CIELAB). JND ~ 2.3. */
        readonly e76: (l1: number, a1: number, b1: number, l2: number, a2: number, b2: number) => number;
        /** CIE delta-E94 (improved weighting). */
        readonly e94: (l1: number, a1: number, b1: number, l2: number, a2: number, b2: number) => number;
        /** CIEDE2000 (state-of-the-art perceptual). */
        readonly e2000: (l1: number, a1: number, b1: number, l2: number, a2: number, b2: number) => number;
        /** Batch CIEDE2000. Input: Float64Array [L1,a1,b1,L2,a2,b2,...]. */
        readonly e2000Batch: (labPairs: Float64Array) => Float64Array<ArrayBuffer>;
        /** Convert sRGB to CIELAB. Returns [L, a, b]. */
        readonly rgbToLab: (r: number, g: number, b: number) => [number, number, number];
        /** Convert CIELAB to sRGB. Returns [r, g, b]. */
        readonly labToRgb: (l: number, a: number, b: number) => [number, number, number];
    };
    readonly cssEnhanced: {
        /** Render enhanced CSS with all effects. Takes CssRenderConfig.
         *  material: EvaluatedMaterial from GlassMaterial.evaluate() */
        readonly render: (material: any, config?: InstanceType<WasmModule["CssRenderConfig"]>) => string;
        /** Render premium CSS with animations.
         *  material: EvaluatedMaterial from GlassMaterial.evaluate() */
        readonly renderPremium: (material: any) => string;
    };
    readonly presets: {
        /** Get all enhanced glass presets. */
        readonly glass: () => any;
        /** Get presets by quality tier ('low' | 'medium' | 'high' | 'ultra'). */
        readonly byQuality: (tier: string) => any;
    };
};
interface QualityScoreInput {
    overall: number;
    compliance: number;
    perceptual: number;
    appropriateness: number;
}
interface SirenCorrectionResult {
    deltaL: number;
    deltaC: number;
    deltaH: number;
}
interface SirenMetadata {
    architecture: number[];
    totalParams: number;
    omega0: number;
    seed: number;
    activations: string[];
    clampRanges: {
        deltaL: [number, number];
        deltaC: [number, number];
        deltaH: [number, number];
    };
    inputFeatures: string[];
}

export { MomotoBridge, type QualityScoreInput, type SirenCorrectionResult, type SirenMetadata, type WasmModule };
