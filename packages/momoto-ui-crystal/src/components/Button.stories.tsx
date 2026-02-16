/**
 * Crystal Button Stories - Advanced Liquid Glass Showcase
 *
 * Complete demonstration of all Button capabilities powered by Momoto WASM
 * Features 6 glass variants + vibrancy + custom configurations (100% Momoto Physics)
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { VibrancyLevel } from '../utils/liquid-glass';
import React from 'react';

// ============================================================================
// META
// ============================================================================

const meta = {
  title: 'Components/Button (Advanced Liquid Glass)',
  component: Button,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '**🚀 Advanced Crystal Button with 100% Momoto WASM**\\n\\n' +
          'The most sophisticated button implementation featuring:\\n' +
          '- **6 Glass Variants** - Regular, Clear, Thick, Subtle, Frosted, Vibrant (100% Momoto Physics)\\n' +
          '- **Beer-Lambert Transmittance** - Multi-layer light physics (Surface, Volume, Substrate)\\n' +
          '- **Shadow Engine** - Contact + Ambient shadows with elevation transitions\\n' +
          '- **Physical Properties** - Blur, reflectivity, refraction, specular, depth, noise\\n' +
          '- **Multi-Layer Composition** - Highlight, base, shadow layers from WASM\\n' +
          '- **Vibrancy Effects** - Boosted chroma for content on glass\\n' +
          '- **WCAG AAA** - All text contrast validated via WASM\\n\\n' +
          '**Every single color, effect, and property is calculated by Momoto WASM for perceptual uniformity.**',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'glass-regular',
        'glass-clear',
        'glass-thick',
        'glass-subtle',
        'glass-frosted',
        'glass-vibrant',
      ],
      description: 'Button variant with unique physical glass properties (100% Momoto WASM)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    vibrancyLevel: {
      control: 'select',
      options: [undefined, VibrancyLevel.Primary, VibrancyLevel.Secondary, VibrancyLevel.Tertiary],
      description: 'Apply WASM vibrancy effect to boost content chroma',
    },
    backgroundHint: {
      control: 'color',
      description: 'Background color for glass calculations (affects effective color)',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// 🌟 HERO DEMO - THIS IS REAL GLASS
// ============================================================================

/**
 * **🌟 This is Real Liquid Glass**
 *
 * This is NOT opacity. This is NOT flat CSS.
 * This is Momoto WASM-powered Liquid Glass with physical properties.
 *
 * **What you're seeing:**
 * - Real backdrop-filter blur (not faked)
 * - Multi-layer composition (highlight, base, shadow)
 * - Physical refraction simulation
 * - Adaptive saturation boost
 * - Specular highlights that respond to light
 * - WCAG AAA contrast validation
 *
 * **Try this:**
 * 1. Change background (toolbar above) → Notice glass adapts
 * 2. Hover → Feel physical lift + blur micro-shift
 * 3. Click → Experience compression + inner shadow
 * 4. Inspect DevTools → See WASM-calculated CSS properties
 *
 * **This is what makes Momoto different.**
 */
export const ThisIsRealGlass: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '4rem',
        gap: '3rem',
      }}
    >
      {/* Hero Section */}
      <div style={{ textAlign: 'center', maxWidth: '600px' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 700,
            margin: '0 0 1rem 0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          This is Real Liquid Glass
        </h1>
        <p
          style={{
            fontSize: '1.25rem',
            opacity: 0.8,
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Not opacity. Not flat CSS. Physical glass materials powered by Momoto WASM.
        </p>
      </div>

      {/* Glass Button Showcase */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        {/* Large Glass Button */}
        <Button variant="glass-regular" size="lg">
          Hover Me - Feel the Glass
        </Button>

        {/* Comparison Row */}
        <div
          style={{
            display: 'flex',
            gap: '1.5rem',
            alignItems: 'center',
            padding: '2rem',
            background: 'rgba(0,0,0,0.03)',
            borderRadius: '16px',
          }}
        >
          <Button variant="glass-clear">Glass Clear</Button>
          <Button variant="glass-regular">Glass Regular</Button>
          <Button variant="glass-thick">Glass Thick</Button>
          <Button variant="glass-frosted">Glass Frosted</Button>
        </div>

        {/* Physical System Proof */}
        <div
          style={{
            marginTop: '2rem',
            padding: '2rem',
            background: 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            maxWidth: '600px',
          }}
        >
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
            🔬 Physical System Active
          </h3>
          <div
            style={{
              margin: '0 0 1rem 0',
              padding: '1rem',
              background: 'rgba(102,126,234,0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(102,126,234,0.2)',
            }}
          >
            <strong style={{ fontSize: '0.875rem' }}>✨ Beer-Lambert Transmittance:</strong>
            <ul style={{ margin: '0.5rem 0 0', padding: '0 0 0 1.5rem', fontSize: '0.8125rem', opacity: 0.9 }}>
              <li>Surface layer (edge highlights): Fresnel reflections</li>
              <li>Volume layer (main body): Exponential light decay</li>
              <li>Substrate layer (contact): Edge darkening effect</li>
            </ul>
          </div>
          <div
            style={{
              margin: '0 0 1rem 0',
              padding: '1rem',
              background: 'rgba(102,126,234,0.08)',
              borderRadius: '8px',
              border: '1px solid rgba(102,126,234,0.2)',
            }}
          >
            <strong style={{ fontSize: '0.875rem' }}>🌑 Elevation Shadow System:</strong>
            <ul style={{ margin: '0.5rem 0 0', padding: '0 0 0 1.5rem', fontSize: '0.8125rem', opacity: 0.9 }}>
              <li>Contact shadow: Sharp (1-4px blur) at contact point</li>
              <li>Ambient shadow: Soft (12-40px blur) environmental</li>
              <li>Dynamic elevation: Rest → Hover → Active transitions</li>
            </ul>
          </div>
          <ul
            style={{
              margin: 0,
              padding: '0 0 0 1.5rem',
              fontSize: '0.9375rem',
              lineHeight: 1.8,
              opacity: 0.9,
            }}
          >
            <li>
              <strong>Change background</strong> (toolbar) → Physical calculations adapt
            </li>
            <li>
              <strong>Hover</strong> → Blur increases (+2px), reflectivity +30%, physical lift
            </li>
            <li>
              <strong>Click</strong> → Compression (scale 0.985), blur reduces (-3px), depth shadow
            </li>
            <li>
              <strong>DevTools</strong> → All properties calculated by Momoto WASM, zero hardcoding
            </li>
          </ul>
        </div>

        {/* Technical Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'rgba(102,126,234,0.1)',
            border: '1px solid rgba(102,126,234,0.2)',
            borderRadius: '100px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#667eea',
          }}
        >
          <span>⚡</span>
          <span>Beer-Lambert Law • Shadow Engine • OKLCH • 100% WASM Physics</span>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'vibrant-gradient',
    },
  },
};

// ============================================================================
// ALL GLASS VARIANTS COMPARISON
// ============================================================================

/**
 * **All Glass Variants** - Side-by-side comparison
 *
 * See all 6 glass variants + tinted together to compare visual properties.
 * Each uses different WASM-calculated physical properties.
 */
export const AllGlassVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '700px' }}>
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>
          All Glass Variants Comparison
        </h3>
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
          Each variant has unique WASM-calculated physical properties
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="glass-regular">Regular ✨</Button>
        <Button variant="glass-clear">Clear 💎</Button>
        <Button variant="glass-thick">Thick 🔷</Button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="glass-subtle">Subtle 💫</Button>
        <Button variant="glass-frosted">Frosted ❄️</Button>
        <Button variant="glass-vibrant">Vibrant 🌈</Button>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// ============================================================================
// VIBRANCY EFFECTS
// ============================================================================

/**
 * **Vibrancy Effects**
 *
 * WASM Vibrancy boosts chroma of text/icons on glass surfaces.
 * Compare Primary, Secondary, and Tertiary vibrancy levels.
 */
export const VibrancyShowcase: Story = {
  render: () => (
    <div
      style={{
        padding: '3rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        minWidth: '600px',
      }}
    >
      <h3 style={{ color: 'white', marginBottom: '2rem', fontWeight: 600 }}>
        WASM Vibrancy Effects 🌟
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* No Vibrancy */}
        <div>
          <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
            No Vibrancy (Default)
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="glass-regular" backgroundHint="#667eea">Regular Glass</Button>
            <Button variant="glass-vibrant" backgroundHint="#667eea">Vibrant Glass</Button>
          </div>
        </div>

        {/* Primary Vibrancy */}
        <div>
          <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
            Primary Vibrancy (Strong boost)
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="glass-regular"
              vibrancyLevel={VibrancyLevel.Primary}
              backgroundHint="#667eea"
            >
              Regular + Primary
            </Button>
            <Button
              variant="glass-vibrant"
              vibrancyLevel={VibrancyLevel.Primary}
              backgroundHint="#667eea"
            >
              Vibrant + Primary ⚡
            </Button>
          </div>
        </div>

        {/* Secondary Vibrancy */}
        <div>
          <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
            Secondary Vibrancy (Medium boost)
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="glass-regular"
              vibrancyLevel={VibrancyLevel.Secondary}
              backgroundHint="#667eea"
            >
              Regular + Secondary
            </Button>
            <Button
              variant="glass-vibrant"
              vibrancyLevel={VibrancyLevel.Secondary}
              backgroundHint="#667eea"
            >
              Vibrant + Secondary
            </Button>
          </div>
        </div>

        {/* Tertiary Vibrancy */}
        <div>
          <p style={{ color: 'white', fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>
            Tertiary Vibrancy (Subtle boost)
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="glass-regular"
              vibrancyLevel={VibrancyLevel.Tertiary}
              backgroundHint="#667eea"
            >
              Regular + Tertiary
            </Button>
            <Button
              variant="glass-vibrant"
              vibrancyLevel={VibrancyLevel.Tertiary}
              backgroundHint="#667eea"
            >
              Vibrant + Tertiary
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '0.875rem',
        }}
      >
        <strong>💡 Vibrancy Details:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', opacity: 0.9 }}>
          <li>Calculated by Momoto WASM VibrancyEffect</li>
          <li>Boosts chroma of text and icons on glass</li>
          <li>Primary: 1.2x chroma | Secondary: 1.1x | Tertiary: 1.05x</li>
          <li>Maintains perceptual uniformity</li>
        </ul>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// ============================================================================
// CUSTOM GLASS CONFIGURATION
// ============================================================================

/**
 * **Custom Glass Configuration**
 *
 * Fine-tune all physical properties: blur, opacity, reflectivity, specular, depth, noise.
 * Full control over WASM Liquid Glass parameters.
 */
export const CustomGlassConfig: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      <div>
        <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
          Custom Configuration Examples
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Extreme Blur */}
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              Extreme Blur (60px)
            </p>
            <Button
              variant="glass-regular"
              glassConfig={{ blurRadius: 60 }}
            >
              Super Blurred Glass
            </Button>
          </div>

          {/* High Reflectivity */}
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              High Reflectivity (0.35)
            </p>
            <Button
              variant="glass-regular"
              glassConfig={{ reflectivity: 0.35 }}
            >
              Glowing Glass
            </Button>
          </div>

          {/* Extreme Specular */}
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              Intense Specular (0.5)
            </p>
            <Button
              variant="glass-regular"
              glassConfig={{ specularIntensity: 0.5 }}
            >
              Shiny Glass
            </Button>
          </div>

          {/* Max Depth */}
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              Maximum Depth (1.0)
            </p>
            <Button
              variant="glass-regular"
              glassConfig={{ depth: 1.0 }}
            >
              Deep Glass
            </Button>
          </div>

          {/* Custom Combo */}
          <div>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.8 }}>
              Custom Combination
            </p>
            <Button
              variant="glass-regular"
              glassConfig={{
                opacity: 0.95,
                blurRadius: 35,
                reflectivity: 0.25,
                specularIntensity: 0.4,
                depth: 0.8,
                noiseScale: 0.05,
              }}
            >
              Ultimate Glass ⚡
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * **Interactive States Debugger**
 *
 * Force hover, active, and focus states for precise inspection.
 * Useful for designers/developers to see exact state appearance.
 */
export const InteractiveStatesDebugger: Story = {
  render: (args) => (
    <div style={{ padding: '3rem' }}>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>
        Interactive States Debugger
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
            Default State
          </h4>
          <Button variant="glass-regular">Default</Button>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
            Hover State (forced)
          </h4>
          <Button variant="glass-regular" _forceHover>
            Forced Hover
          </Button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
            Blur +2px, reflectivity +30%, translateY(-1.5px), specular 85%
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
            Active State (forced)
          </h4>
          <Button variant="glass-regular" _forceActive>
            Forced Active
          </Button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
            Blur -3px, scale(0.985), inner shadow, specular 40%
          </p>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
            Focus State (forced)
          </h4>
          <Button variant="glass-regular" _forceFocus>
            Forced Focus
          </Button>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', opacity: 0.7 }}>
            Outline + focus ring glow + enhanced specular
          </p>
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '1.5rem',
            background: '#f3f4f6',
            borderRadius: '8px',
          }}
        >
          <strong>💡 States Implementation:</strong>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', fontSize: '0.875rem' }}>
            <li><strong>Hover:</strong> Micro-shift of blur, reflectivity boost, physical lift</li>
            <li><strong>Active:</strong> Compression (scale), blur reduction, inner shadow depth</li>
            <li><strong>Focus:</strong> Outline with glow, enhanced specular (refraction simulation)</li>
            <li>All calculated via WASM-driven properties</li>
          </ul>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// ============================================================================
// PHYSICS ENGINE SHOWCASE
// ============================================================================

/**
 * **Physics Engine Showcase**
 *
 * Live demonstration of Momoto's complete physics systems:
 *
 * **Beer-Lambert Transmittance (Multi-Layer Light Physics)**
 * - Surface Layer: Fresnel reflections (edge highlights)
 * - Volume Layer: Exponential light decay (Beer-Lambert law)
 * - Substrate Layer: Contact shadow darkening
 *
 * **Elevation Shadow System (Contact + Ambient)**
 * - Contact Shadow: Sharp, dark shadow at contact point (1-4px blur)
 * - Ambient Shadow: Soft, diffuse shadow from env light (12-40px blur)
 * - Physical elevation transitions (rest → hover → active)
 *
 * **What Makes This Different:**
 * - NOT decorative gradients - physics-derived from virtual light sources
 * - NOT simple box-shadow - multi-layer contact + ambient shadows
 * - NOT linear opacity - exponential Beer-Lambert decay
 *
 * **Inspect DevTools** to see:
 * - \`--btn-layer-surface\`, \`--btn-layer-volume\`, \`--btn-layer-substrate\`
 * - \`--btn-shadow-rest\`, \`--btn-shadow-hover\`, \`--btn-shadow-active\`
 */
export const PhysicsEngineShowcase: Story = {
  render: () => (
    <div
      style={{
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #F5F5F7 0%, #FFFFFF 50%, #F0F0F2 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Hero Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '4rem' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          🔬 Physics Engine Showcase
        </h1>
        <p style={{ fontSize: '1.125rem', opacity: 0.8, lineHeight: 1.6, maxWidth: '800px' }}>
          Real physics-based glass rendering powered by Momoto WASM. Every shadow, every layer,
          every gradient is calculated from physical light models and material properties.
        </p>
      </div>

      {/* Glass Variants with Physics Breakdown */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Regular Glass */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Regular Glass</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <Button variant="glass-regular" size="lg" fullWidth>
                Physical Glass
              </Button>
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.6 }}>
              <strong>Optical Properties:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Absorption: 0.15 (15% light absorbed)</li>
                <li>Scattering: 0.25 (25% light scattered)</li>
                <li>Thickness: 1.0 (standard depth)</li>
                <li>Refractive Index: 1.5 (real glass)</li>
              </ul>
              <strong>Transmittance Layers:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Surface: ~8% (edge highlights)</li>
                <li>Volume: ~62% (main appearance)</li>
                <li>Substrate: ~43% (contact darkening)</li>
              </ul>
              <strong>Elevation Shadows:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>Rest: Level 1 (subtle lift)</li>
                <li>Hover: Level 3 (interactive)</li>
                <li>Active: Level 0 (pressed down)</li>
              </ul>
            </div>
          </div>

          {/* Frosted Glass */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Frosted Glass</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <Button variant="glass-frosted" size="lg" fullWidth>
                Heavy Scattering
              </Button>
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.6 }}>
              <strong>Optical Properties:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Absorption: 0.12 (12% absorbed)</li>
                <li>Scattering: 0.85 (85% scattered!)</li>
                <li>Thickness: 1.2 (thicker material)</li>
                <li>Refractive Index: 1.5</li>
              </ul>
              <strong>Why Frosted Looks Different:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>High scattering creates diffuse appearance</li>
                <li>Less sharp transmission = softer edges</li>
                <li>More surface layer visibility</li>
                <li>Background detail heavily obscured</li>
              </ul>
            </div>
          </div>

          {/* Thick Glass */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Thick Glass</h3>
            <div style={{ marginBottom: '1.5rem' }}>
              <Button variant="glass-thick" size="lg" fullWidth>
                Dense Material
              </Button>
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.7, lineHeight: 1.6 }}>
              <strong>Optical Properties:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>Absorption: 0.35 (35% absorbed)</li>
                <li>Scattering: 0.3 (moderate)</li>
                <li>Thickness: 3.0 (triple depth!)</li>
                <li>Refractive Index: 1.6 (denser)</li>
              </ul>
              <strong>Beer-Lambert in Action:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                <li>I(x) = I₀ × e^(-μx)</li>
                <li>More thickness = exponential decay</li>
                <li>Visible color tint emerges</li>
                <li>Stronger contact shadows</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Explanation */}
        <div
          style={{
            marginTop: '3rem',
            background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(102,126,234,0.2)',
          }}
        >
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How It Works</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                📐 Beer-Lambert Transmittance
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8 }}>
                Real glass doesn&apos;t fade linearly—light transmission follows exponential decay:
              </p>
              <div
                style={{
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '0.75rem',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              >
                I(x) = I₀ × e^(-μx)
                <br />
                μ = absorption + scattering
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8, marginTop: '0.75rem' }}>
                This creates the characteristic multi-layer appearance: bright edges (surface
                reflections), main body (volume), and dark contact areas (substrate).
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                🌑 Multi-Layer Shadows
              </h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8 }}>
                Real shadows consist of multiple distinct layers:
              </p>
              <ul style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8, paddingLeft: '1.5rem', marginTop: '0.75rem' }}>
                <li>
                  <strong>Contact Shadow:</strong> Sharp and dark (1-4px blur) where glass touches
                  background. Complete light occlusion.
                </li>
                <li style={{ marginTop: '0.5rem' }}>
                  <strong>Ambient Shadow:</strong> Soft and diffuse (12-40px blur) from
                  environmental light blocking. Creates atmospheric depth.
                </li>
              </ul>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8, marginTop: '0.75rem' }}>
                Elevation changes both: higher elements have larger, softer, more visible shadows.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
            <strong style={{ fontSize: '0.875rem' }}>🎯 The Momoto Difference:</strong>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, opacity: 0.8, marginTop: '0.5rem' }}>
              Most UI glass is decorative CSS (linear gradients, simple box-shadow). Momoto uses
              <strong> real physics models</strong> computed in Rust WASM: Beer-Lambert law for
              transmittance, Snell's law for refraction, Blinn-Phong for lighting, and physically-based
              shadow layering. This creates glass that looks and behaves like real material.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// ============================================================================
// 🍎 APPLE-STYLE LIQUID GLASS
// ============================================================================

/**
 * **🍎 Apple macOS-Compatible Liquid Glass**
 *
 * Momoto now supports ALL Apple Liquid Glass parameters from macOS:
 *
 * **New Parameters (matching Apple's Icon Editor):**
 * - **Translucency (50%)** - Light transmission through material (different from opacity)
 * - **Dark Tint (42%)** - Inherent glass color/tint (like architectural tinted glass)
 * - **Specular (ON)** - Enhanced edge/corner highlights with directional lighting
 * - **Shadow System (Neutral, 50%)** - Integrated shadows as part of glass material
 *
 * **Technical Implementation:**
 * - Translucency affects backdrop-filter blur and saturation (higher = less diffusion)
 * - Dark tint uses multiply blend mode for realistic glass tinting
 * - Specular supports edge/corner highlights with configurable angle and sharpness
 * - Shadow system with inner/outer components and temperature types (neutral/warm/cool)
 *
 * **Three Apple-Style Presets:**
 * 1. **Apple Style** - Exact match to macOS parameters
 * 2. **Apple Clear** - High translucency, minimal dark tint
 * 3. **Apple Thick** - Heavy material, strong dark tint
 */
export const AppleStyleLiquidGlass: Story = {
  render: () => {
    const [selectedPreset, setSelectedPreset] = React.useState<'apple' | 'clear' | 'thick'>('apple');

    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '4rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', color: 'white' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 700 }}>
              🍎 Apple-Style Liquid Glass
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>
              Full compatibility with Apple macOS Liquid Glass parameters
            </p>
          </div>

          {/* Preset Selector */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '3rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h2 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              Choose Apple Preset
            </h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setSelectedPreset('apple')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: selectedPreset === 'apple' ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                  background: selectedPreset === 'apple' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Apple Style
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Blur: 21.8% • Translucency: 50% • Dark: 42%
                </div>
              </button>

              <button
                onClick={() => setSelectedPreset('clear')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: selectedPreset === 'clear' ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                  background: selectedPreset === 'clear' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Apple Clear
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Blur: 15% • Translucency: 75% • Dark: 15%
                </div>
              </button>

              <button
                onClick={() => setSelectedPreset('thick')}
                style={{
                  flex: 1,
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: selectedPreset === 'thick' ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                  background: selectedPreset === 'thick' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Apple Thick
                </div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                  Blur: 30% • Translucency: 35% • Dark: 60%
                </div>
              </button>
            </div>
          </div>

          {/* Parameter Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem',
            }}
          >
            {/* Translucency */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                ✨ Translucency
              </h3>
              <p style={{ color: 'white', opacity: 0.8, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Light transmission through material. Different from opacity - controls how much light
                passes through and diffuses. Apple uses 50% for standard glass.
              </p>
            </div>

            {/* Dark Tint */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                🎨 Dark Tint
              </h3>
              <p style={{ color: 'white', opacity: 0.8, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Inherent color of the glass material, like tinted architectural glass. Uses multiply
                blend mode. Apple uses 42% for standard depth.
              </p>
            </div>

            {/* Specular */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                💎 Specular Highlights
              </h3>
              <p style={{ color: 'white', opacity: 0.8, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Edge and corner highlights with directional lighting. Toggle on/off like Apple,
                with configurable intensity, angle, and sharpness.
              </p>
            </div>

            {/* Shadow System */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
                🌑 Shadow System
              </h3>
              <p style={{ color: 'white', opacity: 0.8, fontSize: '0.875rem', lineHeight: 1.6 }}>
                Integrated shadows as part of glass material. Supports neutral/warm/cool types.
                Inner and outer components. Apple uses Neutral at 50%.
              </p>
            </div>
          </div>

          {/* Live Demo */}
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '3rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
              Live Demo - {selectedPreset === 'apple' ? 'Apple Style' : selectedPreset === 'clear' ? 'Apple Clear' : 'Apple Thick'}
            </h2>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                variant="glass-regular"
                size="lg"
                glassConfig={
                  selectedPreset === 'apple'
                    ? {
                        blurRadius: 21.8,
                        translucency: 0.50,
                        opacity: 0.85,
                        darkTint: {
                          intensity: 0.42,
                          color: { l: 0.25, c: 0.01, h: 240 },
                          blendMode: 'multiply',
                        },
                        specular: {
                          enabled: true,
                          intensity: 0.65,
                          edges: true,
                          corners: true,
                          directionAngle: 135,
                          sharpness: 0.7,
                        },
                      }
                    : selectedPreset === 'clear'
                    ? {
                        blurRadius: 15,
                        translucency: 0.75,
                        opacity: 0.70,
                        darkTint: {
                          intensity: 0.15,
                          color: { l: 0.30, c: 0.01, h: 240 },
                          blendMode: 'multiply',
                        },
                        specular: {
                          enabled: true,
                          intensity: 0.55,
                          edges: true,
                          corners: false,
                          sharpness: 0.6,
                        },
                      }
                    : {
                        blurRadius: 30,
                        translucency: 0.35,
                        opacity: 0.92,
                        darkTint: {
                          intensity: 0.60,
                          color: { l: 0.20, c: 0.01, h: 240 },
                          blendMode: 'multiply',
                        },
                        specular: {
                          enabled: true,
                          intensity: 0.75,
                          edges: true,
                          corners: true,
                          directionAngle: 135,
                          sharpness: 0.8,
                        },
                      }
                }
              >
                Apple-Style Liquid Glass
              </Button>
            </div>

            <div
              style={{
                marginTop: '3rem',
                padding: '2rem',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(102, 126, 234, 0.1)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                Current Configuration
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                <div>
                  <strong>Blur Radius:</strong>{' '}
                  {selectedPreset === 'apple' ? '21.8px' : selectedPreset === 'clear' ? '15px' : '30px'}
                </div>
                <div>
                  <strong>Translucency:</strong>{' '}
                  {selectedPreset === 'apple' ? '50%' : selectedPreset === 'clear' ? '75%' : '35%'}
                </div>
                <div>
                  <strong>Dark Tint:</strong>{' '}
                  {selectedPreset === 'apple' ? '42%' : selectedPreset === 'clear' ? '15%' : '60%'}
                </div>
                <div>
                  <strong>Specular:</strong> {selectedPreset === 'apple' ? '65%' : selectedPreset === 'clear' ? '55%' : '75%'}
                </div>
                <div>
                  <strong>Edges:</strong> {selectedPreset === 'clear' ? 'No' : 'Yes'}
                </div>
                <div>
                  <strong>Corners:</strong> {selectedPreset === 'clear' ? 'No' : 'Yes'}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: '3rem',
              padding: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
              🎯 <strong>100% Apple-Compatible:</strong> All parameters match Apple's macOS Liquid Glass
              system. Calculated by Momoto WASM for perceptual accuracy.
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
