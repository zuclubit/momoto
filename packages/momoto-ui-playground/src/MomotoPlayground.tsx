/**
 * Momoto UI Playground
 *
 * Interactive demonstration of Momoto Crystal Design System 2025
 * Integrated into Topocho CRM
 *
 * Features:
 * - Real-time token derivation (WASM-powered)
 * - Live accessibility validation (WCAG + APCA)
 * - Interactive component showcase
 * - Glass/Crystal design preview
 * - Performance metrics
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  TokenDerivationEngine,
  validateContrast,
  passesWCAG_AA,
  UIStateValue,
  WCAGLevel,
  ColorOklch,
  getWasmStatus,
} from '@momoto-ui/wasm';
import './MomotoPlayground.css';

// ============================================================================
// TYPES
// ============================================================================

interface ColorInput {
  l: number; // Lightness [0.0, 1.0]
  c: number; // Chroma [0.0, 0.4]
  h: number; // Hue [0.0, 360.0]
}

interface DerivedTokenSet {
  idle: ColorOklch;
  hover: ColorOklch;
  active: ColorOklch;
  focus: ColorOklch;
  disabled: ColorOklch;
  loading: ColorOklch;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const MomotoPlayground: React.FC = () => {
  // WASM status
  const [wasmStatus, setWasmStatus] = useState(getWasmStatus());

  // Color inputs
  const [primaryColor, setPrimaryColor] = useState<ColorInput>({
    l: 0.55,
    c: 0.14,
    h: 240, // Blue
  });

  const [backgroundColor, setBackgroundColor] = useState<ColorInput>({
    l: 0.98,
    c: 0.005,
    h: 240,
  });

  // Token engine
  const tokenEngine = useMemo(() => new TokenDerivationEngine(), []);

  // Derived tokens
  const derivedTokens = useMemo(() => {
    const tokens = tokenEngine.deriveStates(
      primaryColor.l,
      primaryColor.c,
      primaryColor.h
    );

    return {
      idle: tokens[0],
      hover: tokens[1],
      active: tokens[2],
      focus: tokens[3],
      disabled: tokens[4],
      loading: tokens[5],
    };
  }, [primaryColor, tokenEngine]);

  // Contrast validation
  const contrastResult = useMemo(() => {
    return validateContrast(
      backgroundColor.l,
      backgroundColor.c,
      backgroundColor.h,
      primaryColor.l,
      primaryColor.c,
      primaryColor.h
    );
  }, [primaryColor, backgroundColor]);

  // Performance metrics
  const [perfMetrics, setPerfMetrics] = useState({
    derivationTime: 0,
    validationTime: 0,
  });

  // Measure performance
  useEffect(() => {
    const start = performance.now();
    tokenEngine.deriveStates(primaryColor.l, primaryColor.c, primaryColor.h);
    const derivationTime = performance.now() - start;

    const start2 = performance.now();
    validateContrast(
      backgroundColor.l,
      backgroundColor.c,
      backgroundColor.h,
      primaryColor.l,
      primaryColor.c,
      primaryColor.h
    );
    const validationTime = performance.now() - start2;

    setPerfMetrics({ derivationTime, validationTime });
  }, [primaryColor, backgroundColor, tokenEngine]);

  return (
    <div className="momoto-playground">
      {/* Header */}
      <header className="playground-header glass-surface elevation-1">
        <div className="header-content">
          <div className="header-title">
            <h1>Momoto UI Playground</h1>
            <p className="subtitle">Crystal Design System 2025</p>
          </div>

          <div className="header-status">
            <StatusBadge
              label="WASM"
              status={wasmStatus.enabled ? 'active' : 'disabled'}
              value={wasmStatus.backend}
            />
            <StatusBadge
              label="Performance"
              status="active"
              value={`${perfMetrics.derivationTime.toFixed(2)}ms`}
            />
          </div>
        </div>
      </header>

      <div className="playground-grid">
        {/* Sidebar: Color Controls */}
        <aside className="playground-sidebar glass-surface elevation-1">
          <section className="control-section">
            <h2>Primary Color (OKLCH)</h2>

            <ColorSlider
              label="Lightness"
              value={primaryColor.l}
              min={0}
              max={1}
              step={0.01}
              onChange={(l) => setPrimaryColor({ ...primaryColor, l })}
              unit=""
            />

            <ColorSlider
              label="Chroma"
              value={primaryColor.c}
              min={0}
              max={0.4}
              step={0.01}
              onChange={(c) => setPrimaryColor({ ...primaryColor, c })}
              unit=""
            />

            <ColorSlider
              label="Hue"
              value={primaryColor.h}
              min={0}
              max={360}
              step={1}
              onChange={(h) => setPrimaryColor({ ...primaryColor, h })}
              unit="°"
            />

            <div className="color-preview">
              <div
                className="preview-swatch"
                style={{
                  background: oklchToCSS(primaryColor),
                }}
              />
              <code className="preview-code">
                oklch({primaryColor.l.toFixed(2)} {primaryColor.c.toFixed(2)}{' '}
                {primaryColor.h.toFixed(0)})
              </code>
            </div>
          </section>

          <section className="control-section">
            <h2>Background (OKLCH)</h2>

            <ColorSlider
              label="Lightness"
              value={backgroundColor.l}
              min={0}
              max={1}
              step={0.01}
              onChange={(l) => setBackgroundColor({ ...backgroundColor, l })}
              unit=""
            />

            <div className="color-preview">
              <div
                className="preview-swatch"
                style={{
                  background: oklchToCSS(backgroundColor),
                }}
              />
            </div>
          </section>

          {/* Performance Metrics */}
          <section className="control-section">
            <h2>Performance</h2>
            <MetricRow
              label="Token Derivation"
              value={`${perfMetrics.derivationTime.toFixed(3)}ms`}
              status={perfMetrics.derivationTime < 1 ? 'success' : 'warning'}
            />
            <MetricRow
              label="Contrast Validation"
              value={`${perfMetrics.validationTime.toFixed(3)}ms`}
              status={perfMetrics.validationTime < 1 ? 'success' : 'warning'}
            />
            <MetricRow
              label="Cache Size"
              value={`${tokenEngine.getCacheSize()} entries`}
              status="info"
            />
          </section>
        </aside>

        {/* Main: Component Showcase */}
        <main className="playground-main">
          {/* Accessibility Report */}
          <section className="showcase-section glass-surface elevation-1">
            <h2>Accessibility Validation</h2>

            <div className="a11y-grid">
              <A11yCard
                title="WCAG 2.1"
                ratio={contrastResult.wcagRatio.toFixed(2)}
                level={
                  contrastResult.wcagNormalLevel === WCAGLevel.AAA
                    ? 'AAA'
                    : contrastResult.wcagNormalLevel === WCAGLevel.AA
                    ? 'AA'
                    : 'Fail'
                }
                status={
                  contrastResult.wcagNormalLevel >= WCAGLevel.AA
                    ? 'pass'
                    : 'fail'
                }
              />

              <A11yCard
                title="APCA"
                ratio={Math.abs(contrastResult.apcaContrast).toFixed(1)}
                level={
                  contrastResult.apcaBodyPass
                    ? 'Pass (Body)'
                    : contrastResult.apcaLargePass
                    ? 'Pass (Large)'
                    : 'Fail'
                }
                status={contrastResult.apcaBodyPass ? 'pass' : 'fail'}
              />
            </div>
          </section>

          {/* State Tokens */}
          <section className="showcase-section glass-surface elevation-1">
            <h2>Derived State Tokens</h2>

            <div className="token-grid">
              <TokenCard
                state="Idle"
                color={derivedTokens.idle}
                description="Base state, no interaction"
              />
              <TokenCard
                state="Hover"
                color={derivedTokens.hover}
                description="+0.05 lightness (lifted)"
              />
              <TokenCard
                state="Active"
                color={derivedTokens.active}
                description="-0.08 lightness (pressed)"
              />
              <TokenCard
                state="Focus"
                color={derivedTokens.focus}
                description="Same as idle + focus ring"
              />
              <TokenCard
                state="Disabled"
                color={derivedTokens.disabled}
                description="+0.25 lightness, -0.1 chroma"
              />
              <TokenCard
                state="Loading"
                color={derivedTokens.loading}
                description="-0.05 chroma (desaturated)"
              />
            </div>
          </section>

          {/* Component Showcase */}
          <section className="showcase-section glass-surface elevation-1">
            <h2>Interactive Components</h2>

            <div className="component-showcase">
              <div className="showcase-row">
                <label>Buttons</label>
                <div className="showcase-items">
                  <button
                    className="btn-crystal-primary"
                    style={{
                      '--btn-bg': oklchToCSS(derivedTokens.idle),
                      '--btn-bg-hover': oklchToCSS(derivedTokens.hover),
                      '--btn-bg-active': oklchToCSS(derivedTokens.active),
                    }}
                  >
                    Primary Action
                  </button>

                  <button className="btn-crystal-secondary">
                    Secondary
                  </button>

                  <button className="btn-crystal-ghost">Ghost</button>
                </div>
              </div>

              <div className="showcase-row">
                <label>Input Fields</label>
                <div className="showcase-items">
                  <input
                    type="text"
                    className="input-crystal"
                    placeholder="Enter text..."
                  />
                  <input
                    type="email"
                    className="input-crystal"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="showcase-row">
                <label>Cards</label>
                <div className="showcase-items">
                  <div className="card-crystal-demo">
                    <h3>Metric Card</h3>
                    <p className="metric-value">$127,540</p>
                    <p className="metric-change positive">+12.5%</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CSS Export */}
          <section className="showcase-section glass-surface elevation-1">
            <h2>Generated CSS Tokens</h2>

            <pre className="css-export">
              <code>{generateCSSTokens(derivedTokens)}</code>
            </pre>

            <button
              className="btn-crystal-secondary btn-copy"
              onClick={() => {
                navigator.clipboard.writeText(generateCSSTokens(derivedTokens));
              }}
            >
              📋 Copy CSS
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const StatusBadge: React.FC<{
  label: string;
  status: 'active' | 'disabled';
  value: string;
}> = ({ label, status, value }) => (
  <div className={`status-badge status-${status}`}>
    <span className="status-label">{label}</span>
    <span className="status-value">{value}</span>
  </div>
);

const ColorSlider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}> = ({ label, value, min, max, step, unit, onChange }) => (
  <div className="color-slider">
    <label className="slider-label">
      {label}
      <span className="slider-value">
        {value.toFixed(2)}
        {unit}
      </span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="slider-input"
    />
  </div>
);

const MetricRow: React.FC<{
  label: string;
  value: string;
  status: 'success' | 'warning' | 'info';
}> = ({ label, value, status }) => (
  <div className={`metric-row metric-${status}`}>
    <span className="metric-label">{label}</span>
    <span className="metric-value">{value}</span>
  </div>
);

const A11yCard: React.FC<{
  title: string;
  ratio: string;
  level: string;
  status: 'pass' | 'fail';
}> = ({ title, ratio, level, status }) => (
  <div className={`a11y-card glass-surface elevation-0 a11y-${status}`}>
    <h3 className="a11y-title">{title}</h3>
    <p className="a11y-ratio">{ratio}:1</p>
    <p className={`a11y-level ${status}`}>{level}</p>
    <div className={`a11y-badge ${status}`}>
      {status === 'pass' ? '✓ Pass' : '✗ Fail'}
    </div>
  </div>
);

const TokenCard: React.FC<{
  state: string;
  color: { l: number; c: number; h: number };
  description: string;
}> = ({ state, color, description }) => (
  <div className="token-card glass-surface elevation-0">
    <div
      className="token-swatch"
      style={{
        background: oklchToCSS(color),
      }}
    />
    <div className="token-info">
      <h4 className="token-state">{state}</h4>
      <p className="token-description">{description}</p>
      <code className="token-code">
        oklch({color.l.toFixed(2)} {color.c.toFixed(2)} {color.h.toFixed(0)})
      </code>
    </div>
  </div>
);

// ============================================================================
// UTILITIES
// ============================================================================

function oklchToCSS(color: { l: number; c: number; h: number }): string {
  return `oklch(${color.l.toFixed(3)} ${color.c.toFixed(3)} ${color.h.toFixed(1)})`;
}

function generateCSSTokens(tokens: DerivedTokenSet): string {
  return `:root {
  /* Idle State */
  --color-primary-idle-l: ${tokens.idle.l.toFixed(3)};
  --color-primary-idle-c: ${tokens.idle.c.toFixed(3)};
  --color-primary-idle-h: ${tokens.idle.h.toFixed(1)};

  /* Hover State */
  --color-primary-hover-l: ${tokens.hover.l.toFixed(3)};
  --color-primary-hover-c: ${tokens.hover.c.toFixed(3)};
  --color-primary-hover-h: ${tokens.hover.h.toFixed(1)};

  /* Active State */
  --color-primary-active-l: ${tokens.active.l.toFixed(3)};
  --color-primary-active-c: ${tokens.active.c.toFixed(3)};
  --color-primary-active-h: ${tokens.active.h.toFixed(1)};

  /* Focus State */
  --color-primary-focus-l: ${tokens.focus.l.toFixed(3)};
  --color-primary-focus-c: ${tokens.focus.c.toFixed(3)};
  --color-primary-focus-h: ${tokens.focus.h.toFixed(1)};

  /* Disabled State */
  --color-primary-disabled-l: ${tokens.disabled.l.toFixed(3)};
  --color-primary-disabled-c: ${tokens.disabled.c.toFixed(3)};
  --color-primary-disabled-h: ${tokens.disabled.h.toFixed(1)};

  /* Loading State */
  --color-primary-loading-l: ${tokens.loading.l.toFixed(3)};
  --color-primary-loading-c: ${tokens.loading.c.toFixed(3)};
  --color-primary-loading-h: ${tokens.loading.h.toFixed(1)};
}`;
}

export default MomotoPlayground;
