
# momoto-ui

> **A design system & UI surface powered by Momoto Color Intelligence.**
> Momoto decides. Momoto UI renders.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Overview

`momoto-ui` is a **UI and design system layer** that **consumes decisions from the Momoto Color Intelligence Engine** and applies them to real interfaces.

It does **not decide color rules**, calculate contrast, or enforce policies.
Those responsibilities belong to **Momoto Core**.

`momoto-ui` focuses on:

* Rendering accessible UI
* Applying color decisions consistently
* Providing framework adapters and components
* Bridging design systems with intelligent color governance

---

## Relationship with Momoto

| Layer         | Responsibility                                                 |
| ------------- | -------------------------------------------------------------- |
| **Momoto**    | Color perception, contrast, accessibility, policies, AI safety |
| **Momoto UI** | Components, themes, tokens, rendering, framework bindings      |

> If Momoto is the **decision engine**,
> **Momoto UI is the execution surface**.

---

## Key Features

* 🎨 **Powered by Momoto** — consumes perceptual color decisions
* ♿ **Accessibility by construction** — no manual contrast guessing
* 🧩 **Design-system ready** — tokens, themes, components
* 🧱 **Hexagonal UI Architecture** — adapters over decisions
* ⚛️ **React-first**, framework-agnostic core
* 🌗 **Dark / Light mode without breaking brand**
* ❌ **Zero hardcoded colors**

---

## Architecture (UI Layer)

```
┌────────────────────────────────────────────────────────────────────┐
│                          UI ADAPTERS                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │   React     │ │    CSS      │ │  Tailwind   │ │ Components  │  │
│  │ ThemeProvider│ │ Variables  │ │   Config    │ │  Primitives │  │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘  │
└─────────┼────────────────┼────────────────┼────────────────┼──────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌────────────────────────────────────────────────────────────────────┐
│                      APPLICATION (UI USE CASES)                     │
│  ┌─────────────────────┐ ┌─────────────────────┐                  │
│  │ ApplyThemeDecisions │ │ SyncDesignTokens     │                  │
│  └──────────┬──────────┘ └──────────┬──────────┘                  │
│             │                         │                             │
│             ▼                         ▼                             │
│        ┌──────────────────────────────────────────┐                │
│        │      Momoto Integration Layer             │                │
│        │  (Theme decisions, contrast modes, etc.)  │                │
│        └──────────────────────────────────────────┘                │
└────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────────┐
│                         MOMOTO CORE (External)                      │
│   Color Intelligence • APCA • OKLCH • Policies • AI Guards           │
└────────────────────────────────────────────────────────────────────┘
```

---

## Installation

```bash
npm install momoto momoto-ui
```

> `momoto-ui` **requires `momoto`** as its decision engine.

---

## Quick Start

### 1. Create a Theme from Momoto Decisions

```ts
import { analyzeBrandColor } from 'momoto';
import { createTheme } from 'momoto-ui';

const analysis = analyzeBrandColor('#3B82F6');

const theme = createTheme({
  id: 'brand-light',
  mode: 'light',
  colors: analysis,
});
```

---

### 2. React Theme Provider

```tsx
import { ThemeProvider, useTheme } from 'momoto-ui/react';

function App() {
  return (
    <ThemeProvider theme={theme} followSystem>
      <Dashboard />
    </ThemeProvider>
  );
}

function Dashboard() {
  const { colors, contrastMode } = useTheme();

  return (
    <div
      style={{
        background: colors.surface.primary,
        color: colors.text.primary,
      }}
    >
      Contrast mode: {contrastMode}
    </div>
  );
}
```

---

### 3. Components Consume Decisions (Not Hex Values)

```tsx
import { Button } from 'momoto-ui/components';

<Button variant="primary">
  Save changes
</Button>
```

Internally, the component resolves:

* background
* text color
* hover / focus
* disabled state

All from **Momoto decisions**, not hardcoded styles.

---

### 4. Tailwind Integration

```ts
import { createTailwindConfig } from 'momoto-ui/tailwind';

export default createTailwindConfig({
  theme,
  prefix: 'brand-',
  cssVariables: true,
});
```

---

### 5. Design Token Export

```ts
import { exportTokens } from 'momoto-ui/tokens';

const tokens = exportTokens(theme, {
  format: 'w3c',
  namespace: 'brand',
});
```

---

## Core Concepts

### Color Is a Decision

Momoto UI never answers:

> “What color should this be?”

It asks:

> “What did Momoto decide for this role?”

---

### Token Roles (Not Raw Colors)

```ts
theme.colors.text.primary
theme.colors.surface.secondary
theme.colors.border.muted
theme.colors.intent.danger
```

Roles are stable.
Values are **computed, validated, explainable**.

---

### Dark Mode Without Guessing

```ts
const { toggleDark } = useTheme();
toggleDark();
```

No manual overrides.
No duplicated palettes.
No broken contrast.

---

## Best Practices

### ❌ Don’t Hardcode Colors

```ts
background: '#3B82F6'
```

### ✅ Consume Decisions

```ts
background: theme.colors.intent.primary
```

---

### ❌ Don’t Adjust Colors Manually

```ts
color.darken(10)
```

### ✅ Let Momoto Decide

```ts
theme.colors.text.onPrimary
```

---

## When to Use momoto-ui

✅ Design systems
✅ CRMs / Dashboards
✅ AI-assisted UI
✅ Multi-brand platforms
✅ Accessibility-critical products

---

## When NOT to Use It

❌ Static marketing pages
❌ One-off components
❌ Decorative-only UI

---

## Philosophy

> Color is not styling.
> Color is responsibility.

**Momoto decides.
Momoto UI renders.**

---

## 🔮 Crystal Design System (New in 2026)

**Phase 5 & 6 Complete**: Production-ready component library with integrated WASM engine.

### What's New

The **Momoto Crystal Design System** is a complete React component library featuring:

- 🔮 **Glass/Crystal UI** - Apple HIG-inspired with frosted glass effects
- ⚡ **Integrated WASM** - Built-in token derivation (15x faster)
- 📦 **Production Ready** - Button, Input, Card components
- 📚 **Storybook Docs** - 30+ interactive stories
- ♿ **WCAG AAA** - Accessibility by default

### Quick Start (Crystal Components)

```bash
npm install @momoto-ui/crystal
```

```tsx
import { Button, Input, Card, MetricCard } from '@momoto-ui/crystal';
import '@momoto-ui/crystal/styles';

function Dashboard() {
  return (
    <div>
      <MetricCard
        title="Total Revenue"
        value="$127,540"
        change="+12.5%"
        changeType="positive"
      />

      <Card variant="elevated">
        <Input
          label="Email"
          type="email"
          placeholder="name@example.com"
        />
        <Button variant="primary">Submit</Button>
      </Card>
    </div>
  );
}
```

### Crystal Components

- **Button** - 4 variants (primary, secondary, ghost, danger), 3 sizes
- **Input** - Validation states, password toggle, icons
- **Card** - Metric cards, interactive cards, elevated cards

### Documentation

- [Crystal Components README](packages/momoto-ui-crystal/README.md)
- [Crystal Design System 2025](CRYSTAL-DESIGN-SYSTEM-2025.md)
- [UI Mockup Prompts](UI-MOCKUP-PROMPT.md)
- [Phase 5 Complete](IMPLEMENTATION-PHASE5-COMPLETE.md)
- [Phase 6 Complete](IMPLEMENTATION-PHASE6-COMPLETE.md)
- [Project Summary 2026](PROJECT-SUMMARY-2026.md)

### Interactive Playground

Try the Momoto UI Playground to explore color token derivation:

```bash
cd packages/momoto-ui-playground
npm run dev
```

**Features:**
- Real-time OKLCH color controls
- Live accessibility validation (WCAG + APCA)
- Component showcase
- CSS token export

---

## License

MIT © 2026 Zuclubit

---