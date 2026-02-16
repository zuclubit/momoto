/**
 * @fileoverview Glass Physics Demo Components
 *
 * Example React components demonstrating glass physics integration
 */

import React from 'react';
import {
  useGlassPhysics,
  useGlassAnimation,
  useGlassPresets,
  useNoiseTexture,
  useResponsiveGlass,
  LightDirections,
  SurfaceNormals,
  type GlassMaterialPreset,
} from '../src/glass-physics-hooks';

// ============================================================================
// BASIC GLASS BUTTON
// ============================================================================

export function GlassButton({ children }: { children: React.ReactNode }) {
  const { style, isReady } = useGlassPhysics({
    preset: 'regular',
    lightDirection: LightDirections.topLeft,
    normal: SurfaceNormals.flat,
  });

  return (
    <button
      style={{
        ...style,
        padding: '12px 24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '16px',
        cursor: isReady ? 'pointer' : 'not-allowed',
        transition: 'all 0.2s ease',
      }}
      disabled={!isReady}
    >
      {children}
    </button>
  );
}

// ============================================================================
// ANIMATED GLASS CARD
// ============================================================================

export function AnimatedGlassCard({ children }: { children: React.ReactNode }) {
  const { style, handlers, isReady } = useGlassAnimation({
    preset: 'regular',
    enableHover: true,
    duration: 300,
    easing: 'ease-out',
  });

  return (
    <div
      style={{
        ...style,
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        minHeight: '200px',
        opacity: isReady ? 1 : 0.5,
      }}
      {...handlers}
    >
      {children}
    </div>
  );
}

// ============================================================================
// PRESET COMPARISON GRID
// ============================================================================

export function PresetComparison() {
  const presets = useGlassPresets(['clear', 'regular', 'thick', 'frosted']);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        padding: '24px',
      }}
    >
      {presets.map(({ preset, style, isReady, properties }) => (
        <div
          key={preset}
          style={{
            ...style,
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
            minHeight: '150px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', textTransform: 'capitalize' }}>
            {preset}
          </h3>
          {isReady && properties && (
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              <div>Opacity: {properties.opacity.toFixed(2)}</div>
              <div>Blur: {properties.blur.toFixed(1)}px</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// FROSTED GLASS WITH NOISE TEXTURE
// ============================================================================

export function FrostedGlassPanel({ children }: { children: React.ReactNode }) {
  const { textureURL, isGenerating, regenerate } = useNoiseTexture({
    preset: 'frosted',
    width: 512,
    height: 512,
    scale: 0.08,
  });

  const { style } = useGlassPhysics({
    preset: 'frosted',
  });

  return (
    <div
      style={{
        ...style,
        backgroundImage: textureURL ? `url(${textureURL})` : undefined,
        backgroundSize: 'cover',
        backgroundBlend: 'overlay',
        padding: '32px',
        borderRadius: '16px',
        position: 'relative',
        minHeight: '300px',
      }}
    >
      {children}

      <button
        onClick={regenerate}
        disabled={isGenerating}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '8px',
          cursor: isGenerating ? 'wait' : 'pointer',
          color: 'white',
        }}
      >
        {isGenerating ? 'Generating...' : 'New Texture'}
      </button>
    </div>
  );
}

// ============================================================================
// RESPONSIVE GLASS CONTAINER
// ============================================================================

export function ResponsiveGlassContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const { style, isReady } = useResponsiveGlass({
    preset: 'regular',
    lightDirection: LightDirections.topLeft,
  });

  return (
    <div
      style={{
        ...style,
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minHeight: '200px',
        opacity: isReady ? 1 : 0.5,
      }}
    >
      {children}
      <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '16px' }}>
        Automatically optimized for {window.innerWidth < 768 ? 'mobile' : 'desktop'}
      </div>
    </div>
  );
}

// ============================================================================
// CUSTOM LIGHT DIRECTION DEMO
// ============================================================================

export function CustomLightDemo() {
  const [lightAngle, setLightAngle] = React.useState(45);

  // Calculate light direction from angle
  const lightDirection = React.useMemo(() => {
    const radians = (lightAngle * Math.PI) / 180;
    return {
      x: Math.cos(radians),
      y: Math.sin(radians),
      z: 0.5,
    };
  }, [lightAngle]);

  const { style } = useGlassPhysics({
    preset: 'regular',
    lightDirection,
  });

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          ...style,
          padding: '32px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <h3>Dynamic Light Direction</h3>
        <p>Angle: {lightAngle}°</p>
      </div>

      <div>
        <label htmlFor="light-angle-slider" style={{ display: 'block', marginBottom: '8px' }}>
          Light Angle: {lightAngle}°
        </label>
        <input
          id="light-angle-slider"
          type="range"
          min="0"
          max="360"
          value={lightAngle}
          onChange={(e) => setLightAngle(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// DEMO APP
// ============================================================================

export function GlassPhysicsDemoApp() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '48px 24px',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '48px' }}>
        Glass Physics Demo
      </h1>

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <section>
          <h2>Basic Glass Button</h2>
          <GlassButton>Click Me</GlassButton>
        </section>

        <section>
          <h2>Animated Glass Card (Hover to interact)</h2>
          <AnimatedGlassCard>
            <h3>Interactive Glass</h3>
            <p>Move your mouse over this card to see the light follow!</p>
          </AnimatedGlassCard>
        </section>

        <section>
          <h2>Preset Comparison</h2>
          <PresetComparison />
        </section>

        <section>
          <h2>Frosted Glass with Noise Texture</h2>
          <FrostedGlassPanel>
            <h3>Frosted Glass Effect</h3>
            <p>Real Perlin noise texture generated by Rust/WASM</p>
          </FrostedGlassPanel>
        </section>

        <section>
          <h2>Responsive Glass</h2>
          <ResponsiveGlassContainer>
            <h3>Responsive Optimization</h3>
            <p>
              This glass effect automatically adjusts for mobile devices to
              maintain performance.
            </p>
          </ResponsiveGlassContainer>
        </section>

        <section>
          <h2>Custom Light Direction</h2>
          <CustomLightDemo />
        </section>
      </div>
    </div>
  );
}

// Export for Storybook or documentation
export default {
  GlassButton,
  AnimatedGlassCard,
  PresetComparison,
  FrostedGlassPanel,
  ResponsiveGlassContainer,
  CustomLightDemo,
  GlassPhysicsDemoApp,
};
