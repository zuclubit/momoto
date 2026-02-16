# Momoto Crystal Design System 2025

> Glass/Crystal UI component library powered by Momoto WASM for perceptually accurate color token derivation

[![Version](https://img.shields.io/npm/v/@momoto-ui/crystal)](https://www.npmjs.com/package/@momoto-ui/crystal)
[![License](https://img.shields.io/npm/l/@momoto-ui/crystal)](https://github.com/zuclubit/momoto-ui/blob/main/LICENSE)

## 🎨 Overview

Momoto Crystal is a modern React component library that combines Apple Human Interface Guidelines principles with advanced glass/crystal design aesthetics. Built on top of the Momoto WASM engine, it provides perceptually uniform color tokens and automatic accessibility compliance.

### Key Features

- **🔮 Crystal Design Language**: Frosted glass surfaces with multi-layer depth
- **⚡ WASM-Powered**: 15x faster token derivation via Rust/WASM
- **♿ Accessibility First**: WCAG AAA + APCA compliance by default
- **🎯 OKLCH Color Space**: Perceptually uniform colors
- **📦 Tree-Shakeable**: Import only what you need
- **🎭 Fully Typed**: Complete TypeScript support
- **📚 Storybook Docs**: Interactive component documentation
- **🌗 Dark Mode**: Built-in dark mode support

## 📦 Installation

```bash
npm install @momoto-ui/crystal
# or
yarn add @momoto-ui/crystal
# or
pnpm add @momoto-ui/crystal
```

### Peer Dependencies

```bash
npm install react react-dom
```

## 🚀 Quick Start

### 1. Import Styles

Import the CSS file in your application entry point:

```tsx
import '@momoto-ui/crystal/styles';
```

Or import in your CSS:

```css
@import '@momoto-ui/crystal/dist/styles/crystal.css';
```

### 2. Use Components

```tsx
import { Button, Input, Card } from '@momoto-ui/crystal';

function App() {
  return (
    <Card variant="elevated">
      <h2>Welcome to Crystal Design</h2>
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
      />
      <Button variant="primary">
        Get Started
      </Button>
    </Card>
  );
}
```

## 🧩 Components

### Button

Glass-effect button with automatic token derivation.

```tsx
import { Button } from '@momoto-ui/crystal';

// Primary action
<Button variant="primary" onClick={handleSubmit}>
  Submit
</Button>

// With icon
<Button
  variant="secondary"
  icon={<SaveIcon />}
  loading={isLoading}
>
  Save Changes
</Button>

// Custom color (automatic state derivation)
<Button
  customColor={{ l: 0.60, c: 0.16, h: 140 }}
>
  Custom Green
</Button>
```

**Props:**
- `variant`: `'primary' | 'secondary' | 'ghost' | 'danger'`
- `size`: `'sm' | 'md' | 'lg'`
- `loading`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `icon`: ReactNode
- `iconRight`: ReactNode
- `customColor`: `{ l: number, c: number, h: number }`

### Input

Glass-effect input fields with validation states.

```tsx
import { Input } from '@momoto-ui/crystal';

// Basic input
<Input
  label="Username"
  placeholder="Enter username"
  helperText="Choose a unique username"
/>

// Error state
<Input
  label="Email"
  type="email"
  value={email}
  error="Please enter a valid email"
/>

// Password with toggle
<Input
  label="Password"
  type="password"
  showPasswordToggle
/>

// With icon
<Input
  label="Search"
  type="search"
  iconLeft={<SearchIcon />}
  placeholder="Search..."
/>
```

**Props:**
- `size`: `'sm' | 'md' | 'lg'`
- `variant`: `'default' | 'error' | 'success'`
- `label`: string
- `helperText`: string
- `error`: string
- `success`: string
- `iconLeft`: ReactNode
- `iconRight`: ReactNode
- `showPasswordToggle`: boolean (for password inputs)
- `fullWidth`: boolean

### Card

Flexible glass-effect container for various content types.

```tsx
import { Card, MetricCard } from '@momoto-ui/crystal';

// Basic card
<Card variant="elevated" hoverable>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>

// With header and footer
<Card
  header={<h3>Feature Title</h3>}
  footer={<Button>Learn More</Button>}
>
  <p>Feature description</p>
</Card>

// Interactive card
<Card
  variant="action"
  interactive
  onClick={() => handleClick()}
>
  <h3>Click Me</h3>
</Card>

// Metric card (specialized)
<MetricCard
  title="Total Revenue"
  value="$127,540"
  change="+12.5%"
  changeType="positive"
  icon={<DollarIcon />}
/>
```

**Card Props:**
- `variant`: `'default' | 'metric' | 'action' | 'elevated'`
- `padding`: `'none' | 'sm' | 'md' | 'lg'`
- `hoverable`: boolean
- `interactive`: boolean
- `loading`: boolean
- `header`: ReactNode
- `footer`: ReactNode

**MetricCard Props:**
- `title`: string
- `value`: string | number
- `change`: string
- `changeType`: `'positive' | 'negative' | 'neutral'`
- `icon`: ReactNode
- `trend`: ReactNode

### Ready-to-Use Card Examples

The library includes pre-built card examples for common use cases:

```tsx
import {
  RevenueCard,
  UsersCard,
  OrdersCard,
  ProductCard,
  UserProfileCard,
  NotificationCard,
  StatsCard,
  ActivityCard,
  FeatureCard,
} from '@momoto-ui/crystal';

// Dashboard with metrics
<div className="dashboard-grid">
  <RevenueCard />
  <UsersCard />
  <OrdersCard />
</div>

// User profile
<UserProfileCard
  name="Oscar Valois"
  role="Senior Designer"
  avatar="..."
  email="oscar@example.com"
  stats={[
    { label: 'Projects', value: '42' },
    { label: 'Followers', value: '1.2K' },
    { label: 'Following', value: '234' },
  ]}
/>

// Notifications
<NotificationCard
  type="success"
  title="Payment Successful"
  message="Your payment has been processed."
  time="2 minutes ago"
/>

// Progress tracking
<StatsCard
  title="Monthly Sales Goal"
  current={8560}
  target={10000}
  unit="sales"
/>

// Product showcase
<ProductCard
  image="product.jpg"
  title="Crystal Design System"
  price="$49.99"
  rating={5}
  reviews={124}
/>
```

**Available Card Examples:**
- **Dashboard**: `RevenueCard`, `UsersCard`, `OrdersCard`, `DashboardMetricCard`
- **E-commerce**: `ProductCard`
- **Social**: `UserProfileCard`, `ActivityCard`
- **Notifications**: `NotificationCard`
- **Analytics**: `StatsCard`
- **Marketing**: `FeatureCard`

## 🎨 Design Tokens

### Color System (OKLCH)

```css
:root {
  /* Neutrals */
  --crystal-surface: oklch(0.98 0.005 240);
  --crystal-canvas: oklch(0.96 0.008 240);
  --crystal-text-primary: oklch(0.15 0.01 240);
  --crystal-text-secondary: oklch(0.45 0.02 240);

  /* Semantic */
  --crystal-primary: oklch(0.55 0.14 240);
  --crystal-success: oklch(0.50 0.12 140);
  --crystal-error: oklch(0.52 0.18 25);
  --crystal-warning: oklch(0.60 0.16 60);
}
```

### Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
```

### Elevation Shadows

```css
--shadow-1: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-2: 0 4px 12px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.08);
--shadow-3: 0 8px 24px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.10);
```

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

## 🔮 Custom Colors with Momoto WASM

All components support custom colors via OKLCH values. Momoto automatically derives all interactive states:

```tsx
import { Button } from '@momoto-ui/crystal';

// Define custom brand color
const brandColor = { l: 0.60, c: 0.16, h: 140 }; // Green

// Momoto automatically derives:
// - hover state (+0.05 lightness)
// - active state (-0.08 lightness)
// - disabled state (+0.25 lightness, -0.1 chroma)
// - loading state (-0.05 chroma)

<Button customColor={brandColor}>
  Custom Brand Button
</Button>
```

## ♿ Accessibility

All components are built with accessibility in mind:

- **Keyboard Navigation**: Full keyboard support
- **ARIA Attributes**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Semantic HTML and ARIA
- **Color Contrast**: WCAG AAA compliance (7:1 minimum)
- **Motion Preferences**: Respects `prefers-reduced-motion`
- **High Contrast**: Respects `prefers-contrast: high`

## 📚 Storybook Documentation

Run Storybook for interactive documentation:

```bash
npm run storybook
```

This will start Storybook at `http://localhost:6006` with live examples and documentation for all components.

## 🌗 Dark Mode

Crystal Design System automatically adapts to dark mode via `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --crystal-surface: oklch(0.18 0.01 240);
    --crystal-canvas: oklch(0.12 0.01 240);
    --crystal-text-primary: oklch(0.95 0.005 240);
  }
}
```

You can also force a specific theme:

```css
html[data-theme='dark'] {
  --crystal-surface: oklch(0.18 0.01 240);
  /* ... dark theme tokens */
}
```

## 🎯 TypeScript Support

All components are fully typed:

```tsx
import type { ButtonProps, InputProps, CardProps } from '@momoto-ui/crystal';

const buttonProps: ButtonProps = {
  variant: 'primary',
  size: 'lg',
  loading: false,
};
```

## 📊 Performance

- **WASM Token Derivation**: 15x faster than JavaScript
- **Tree-Shakeable**: Import only what you need
- **Zero Runtime CSS-in-JS**: All styles are pre-compiled
- **Minimal Bundle Size**: ~25KB gzipped (with all components)

## 🔧 Advanced Usage

### Using Momoto Token Engine Directly

```tsx
import { TokenDerivationEngine } from '@momoto-ui/wasm';

const engine = new TokenDerivationEngine();

// Derive all states from base color
const states = engine.deriveStates(0.55, 0.14, 240);

const tokens = {
  idle: states[0],
  hover: states[1],
  active: states[2],
  focus: states[3],
  disabled: states[4],
  loading: states[5],
};

// Use tokens in custom CSS
document.documentElement.style.setProperty(
  '--my-button-bg',
  `oklch(${tokens.idle.l} ${tokens.idle.c} ${tokens.idle.h})`
);
```

### Creating Custom Variants

```tsx
import { Button } from '@momoto-ui/crystal';

// Define custom semantic colors
const CUSTOM_COLORS = {
  info: { l: 0.55, c: 0.14, h: 200 },
  warning: { l: 0.60, c: 0.16, h: 60 },
};

// Use in components
<Button customColor={CUSTOM_COLORS.info}>
  Info Button
</Button>
```

## 📖 Examples

### Dashboard with Metrics

```tsx
import { Card, MetricCard, Button, Input } from '@momoto-ui/crystal';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="metrics-grid">
        <MetricCard
          title="Total Revenue"
          value="$127,540"
          change="+12.5%"
          changeType="positive"
        />
        <MetricCard
          title="New Customers"
          value="248"
          change="+18.2%"
          changeType="positive"
        />
      </div>

      <Card variant="elevated">
        <h2>Quick Actions</h2>
        <Input label="Search" type="search" fullWidth />
        <Button variant="primary" fullWidth>
          Create New
        </Button>
      </Card>
    </div>
  );
}
```

### Form with Validation

```tsx
import { Input, Button, Card } from '@momoto-ui/crystal';
import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  return (
    <Card variant="elevated">
      <h2>Sign In</h2>

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        fullWidth
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        showPasswordToggle
        fullWidth
      />

      <Button variant="primary" fullWidth>
        Sign In
      </Button>
    </Card>
  );
}
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT © Zuclubit

## 🔗 Links

- [Documentation](https://momoto-ui.dev)
- [GitHub](https://github.com/zuclubit/momoto-ui)
- [npm](https://www.npmjs.com/package/@momoto-ui/crystal)
- [Storybook](https://storybook.momoto-ui.dev)

## 💬 Support

- [GitHub Issues](https://github.com/zuclubit/momoto-ui/issues)
- [Discussions](https://github.com/zuclubit/momoto-ui/discussions)

---

**Made with 🔮 by Zuclubit**
