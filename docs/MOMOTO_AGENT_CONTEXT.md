# Momoto Design System - Agent Context Documentation

## For AI Agents Working on Zuclubit Projects

**Version**: 1.0.0-rc1
**Last Updated**: 2026-01-31
**Target Project**: zuclubit-sso-web (and all Zuclubit projects)

---

## What is Momoto?

Momoto is a **Color Intelligence Design System** built with:

1. **Scientific Color Foundation**: OKLCH perceptually uniform color space
2. **Rust/WASM Core**: High-performance computation engine
3. **Accessibility First**: WCAG 2.1 and APCA built-in
4. **Framework Agnostic**: React, Vue, Svelte, Angular adapters

### Key Differentiators

- **Perceptually uniform**: Colors look consistent across different hues
- **Scientifically validated**: < 0.1% error in color conversion
- **Contract locked**: 68 tests guarantee stability
- **Enterprise ready**: Governance, audit trails, quality scoring

---

## Package Structure

```
@zuclubit/momoto-ui
├── /adapters/react     # React components and hooks
├── /adapters/css       # CSS Variables adapter
├── /adapters/tailwind  # Tailwind plugin
├── /domain             # Core domain logic (TypeScript)
├── /components         # Ready-to-use components
└── /infrastructure     # Exporters, audit, validation
```

---

## Quick Start for SSO Project

### 1. Installation

```bash
npm install @zuclubit/momoto-ui
```

### 2. Provider Setup

```tsx
// app/providers.tsx
import { ThemeProvider } from '@zuclubit/momoto-ui/adapters/react';

const ssoTheme = {
  name: 'zuclubit-sso',
  isDark: false,
  tokens: {
    // Brand colors
    primary: { value: '#3B82F6', role: 'primary' },
    secondary: { value: '#10B981', role: 'secondary' },
    background: { value: '#FFFFFF', role: 'background' },
    surface: { value: '#F9FAFB', role: 'surface' },
    error: { value: '#EF4444', role: 'error' },
    success: { value: '#22C55E', role: 'success' },
  }
};

export function Providers({ children }) {
  return (
    <ThemeProvider
      initialTheme={ssoTheme}
      followSystem={true}
    >
      {children}
    </ThemeProvider>
  );
}
```

### 3. Using Components

```tsx
import { Button, TextField, Card, Badge } from '@zuclubit/momoto-ui/adapters/react';

function LoginForm() {
  return (
    <Card variant="elevated" padding="lg">
      <TextField
        label="Email"
        type="email"
        placeholder="user@zuclubit.com"
      />
      <TextField
        label="Password"
        type="password"
      />
      <Button
        label="Sign In"
        backgroundColor="#3B82F6"
        textColor="#FFFFFF"
        onClick={handleLogin}
      />
    </Card>
  );
}
```

---

## Available Components

### Core Components

| Component | Import | Description |
|-----------|--------|-------------|
| `Button` | `@zuclubit/momoto-ui/adapters/react` | Token-driven button |
| `TextField` | `@zuclubit/momoto-ui/adapters/react` | Input field |
| `Checkbox` | `@zuclubit/momoto-ui/adapters/react` | Checkbox input |
| `Select` | `@zuclubit/momoto-ui/adapters/react` | Dropdown select |
| `Switch` | `@zuclubit/momoto-ui/adapters/react` | Toggle switch |
| `Card` | `@zuclubit/momoto-ui/adapters/react` | Container card |
| `Badge` | `@zuclubit/momoto-ui/adapters/react` | Status badge |
| `Stat` | `@zuclubit/momoto-ui/adapters/react` | KPI display |

### Component Props Pattern

All components follow a **token-driven** pattern:

```tsx
<Button
  // Content
  label="Submit"
  icon={<MailIcon />}
  iconPosition="left" | "right"

  // Base tokens
  backgroundColor="#3B82F6"
  textColor="#FFFFFF"
  borderColor="#3B82F6"

  // State tokens (optional - auto-derived if not provided)
  hoverBackgroundColor="#2563EB"
  hoverTextColor="#FFFFFF"
  activeBackgroundColor="#1D4ED8"
  disabledBackgroundColor="#9CA3AF"
  disabledTextColor="#6B7280"

  // Behavior
  onClick={handler}
  disabled={false}
  loading={false}
  type="button" | "submit" | "reset"

  // Layout
  size="sm" | "md" | "lg"
  fullWidth={false}
/>
```

---

## Hooks Reference

### useTheme

```tsx
import { useTheme } from '@zuclubit/momoto-ui/adapters/react';

function MyComponent() {
  const {
    activeTheme,       // Current theme name
    isDark,            // Dark mode status
    availableThemes,   // List of registered themes
    appliedTokens,     // Currently applied TokenCollection
  } = useTheme();
}
```

### useDarkMode

```tsx
import { useDarkMode } from '@zuclubit/momoto-ui/adapters/react';

function ThemeToggle() {
  const { isDark, toggle, enable, disable } = useDarkMode();

  return (
    <button onClick={toggle}>
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
```

### useThemeSwitcher

```tsx
import { useThemeSwitcher } from '@zuclubit/momoto-ui/adapters/react';

function ThemePicker() {
  const { current, available, switchTo } = useThemeSwitcher();

  return (
    <select
      value={current}
      onChange={(e) => switchTo(e.target.value)}
    >
      {available.map(name => (
        <option key={name} value={name}>{name}</option>
      ))}
    </select>
  );
}
```

### useSystemPreferences

```tsx
import { useSystemPreferences } from '@zuclubit/momoto-ui/adapters/react';

function SystemAwareComponent() {
  const {
    prefersDark,
    prefersReducedMotion,
    prefersHighContrast,
  } = useSystemPreferences();
}
```

---

## UI States

Momoto defines 8 interaction states with automatic token derivation:

| State | Priority | L Shift | C Shift | Opacity |
|-------|----------|---------|---------|---------|
| `idle` | 0 | 0 | 0 | 1.0 |
| `hover` | 40 | +0.05 | +0.02 | 1.0 |
| `focus` | 50 | 0 | 0 | 1.0 |
| `active` | 60 | -0.08 | +0.03 | 1.0 |
| `success` | 75 | 0 | +0.05 | 1.0 |
| `error` | 80 | 0 | +0.10 | 1.0 |
| `loading` | 90 | 0 | -0.05 | 0.7 |
| `disabled` | 100 | +0.20 | -0.10 | 0.5 |

**Priority Resolution**: When multiple states are active, the highest priority wins.

```tsx
// State determination
import { UIState } from '@zuclubit/momoto-ui/domain/ux';

const state = UIState.combine([
  UIState.hover(),
  UIState.focus(),
]);
// Result: focus (priority 50 > hover priority 40)
```

---

## Accessibility Service

### WCAG Validation

```tsx
import { AccessibilityService } from '@zuclubit/momoto-ui/domain/perceptual';

const a11y = new AccessibilityService();

const evaluation = a11y.evaluate(
  { r: 255, g: 255, b: 255 }, // background
  { r: 0, g: 0, b: 0 }        // foreground
);

console.log(evaluation.wcagLevel);    // 'AAA'
console.log(evaluation.wcagRatio);    // 21
console.log(evaluation.apcaValue);    // ~106
console.log(evaluation.meetsWcagAA);  // true
console.log(evaluation.meetsApcaBody);// true
```

### WCAG Thresholds

| Level | Ratio | Use Case |
|-------|-------|----------|
| AAA | 7:1 | Enhanced accessibility |
| AA | 4.5:1 | Normal text |
| AA-large | 3:1 | Large text (18px+) |

### APCA Thresholds

| Level | Lc Value | Use Case |
|-------|----------|----------|
| Lc75 | 75+ | Body text (12px+) |
| Lc60 | 60+ | Large text, sub-fluent |
| Lc45 | 45+ | Headings, large icons |
| Lc30 | 30+ | Spot text, non-essential |
| Lc15 | 15+ | Minimum discernible |

### Suggest Text Color

```tsx
const { color, evaluation } = a11y.suggestTextColor(
  { r: 59, g: 130, b: 246 }, // blue background
  true // preferDark
);
// Returns optimal text color (black or white)
```

---

## Token Derivation

### Automatic State Tokens

When you provide only base colors, Momoto automatically derives all states:

```tsx
import { TokenDerivationService } from '@zuclubit/momoto-ui/domain/tokens';

const service = new TokenDerivationService();

// Derive all state variants from base color
const tokens = service.deriveForAllStates({
  baseColor: '#3B82F6',
  role: 'primary',
});

// Result:
// {
//   idle: { backgroundColor: '#3B82F6', ... },
//   hover: { backgroundColor: '#4A90F7', ... },  // +0.05 L
//   active: { backgroundColor: '#2D6FE0', ... }, // -0.08 L
//   disabled: { backgroundColor: '#A3C1F9', ... }, // +0.20 L, -0.10 C
//   ...
// }
```

---

## CSS Variables Adapter

### Generate CSS Custom Properties

```tsx
import { CssVariablesAdapter } from '@zuclubit/momoto-ui/adapters/css';

const adapter = new CssVariablesAdapter({
  prefix: 'sso',
  outputFormat: 'oklch', // or 'hex', 'rgb'
});

const css = adapter.generateFromTokens(tokens);

// Output:
// :root {
//   --sso-primary-idle: oklch(0.592 0.157 254.1);
//   --sso-primary-hover: oklch(0.642 0.177 254.1);
//   --sso-primary-active: oklch(0.512 0.187 254.1);
//   --sso-primary-text: #ffffff;
//   ...
// }
```

### Using CSS Variables

```css
.sso-button {
  background-color: var(--sso-primary-idle);
  color: var(--sso-primary-text);
}

.sso-button:hover {
  background-color: var(--sso-primary-hover);
}

.sso-button:active {
  background-color: var(--sso-primary-active);
}

.sso-button:disabled {
  background-color: var(--sso-primary-disabled);
  opacity: var(--sso-primary-disabled-opacity);
}
```

---

## Color Science Reference

### OKLCH Color Space

Momoto uses OKLCH (Oklab Lightness Chroma Hue):

```
L = Lightness [0, 1] - How bright the color is
C = Chroma [0, 0.4] - How saturated the color is
H = Hue [0, 360) - The actual color angle
```

### Why OKLCH?

1. **Perceptually uniform**: Equal L changes = equal perceived brightness changes
2. **Hue stable**: Changing L or C doesn't shift the perceived hue
3. **Gamut aware**: Can detect out-of-gamut colors

### Color Manipulation

```tsx
// From the WASM core (via domain wrappers)
const color = ColorOklch.fromHex('#3B82F6');

// Lightness shifts
const lighter = color.shiftLightness(0.1);  // Brighter
const darker = color.shiftLightness(-0.1);  // Darker

// Chroma shifts
const vivid = color.shiftChroma(0.05);      // More saturated
const muted = color.shiftChroma(-0.05);     // Less saturated

// Hue rotation
const warm = color.rotateHue(30);           // Towards orange
const cool = color.rotateHue(-30);          // Towards purple
```

---

## SSO-Specific Patterns

### Login Form Pattern

```tsx
import {
  Card,
  TextField,
  Button,
  Checkbox
} from '@zuclubit/momoto-ui/adapters/react';

function LoginForm({ onSubmit, loading, error }) {
  return (
    <Card variant="elevated" padding="xl" radius="lg">
      <h1>Welcome to Zuclubit</h1>

      {error && (
        <Badge variant="error" size="md">
          {error.message}
        </Badge>
      )}

      <form onSubmit={onSubmit}>
        <TextField
          label="Email"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
        />

        <TextField
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          disabled={loading}
        />

        <Checkbox
          label="Remember me"
          disabled={loading}
        />

        <Button
          type="submit"
          label={loading ? 'Signing in...' : 'Sign In'}
          backgroundColor="#3B82F6"
          textColor="#FFFFFF"
          loading={loading}
          fullWidth
        />
      </form>
    </Card>
  );
}
```

### OAuth Provider Buttons

```tsx
function OAuthButtons() {
  return (
    <div className="oauth-buttons">
      <Button
        label="Continue with Google"
        icon={<GoogleIcon />}
        backgroundColor="#FFFFFF"
        textColor="#1F2937"
        borderColor="#D1D5DB"
        onClick={() => signInWith('google')}
        fullWidth
      />

      <Button
        label="Continue with Microsoft"
        icon={<MicrosoftIcon />}
        backgroundColor="#FFFFFF"
        textColor="#1F2937"
        borderColor="#D1D5DB"
        onClick={() => signInWith('microsoft')}
        fullWidth
      />

      <Button
        label="Continue with GitHub"
        icon={<GitHubIcon />}
        backgroundColor="#24292F"
        textColor="#FFFFFF"
        onClick={() => signInWith('github')}
        fullWidth
      />
    </div>
  );
}
```

### Status Messages

```tsx
import { Badge } from '@zuclubit/momoto-ui/adapters/react';

function StatusMessage({ type, message }) {
  const variants = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <Badge variant={variants[type]} size="lg">
      {message}
    </Badge>
  );
}
```

---

## Best Practices

### 1. Always Use Token-Driven Colors

```tsx
// ✅ Good - Token driven
<Button
  backgroundColor={tokens.primary.idle}
  textColor={tokens.primary.text}
/>

// ❌ Avoid - Hardcoded colors without context
<Button
  style={{ backgroundColor: 'blue' }}
/>
```

### 2. Provide Accessible Contrast

```tsx
// ✅ Good - High contrast
<Button
  backgroundColor="#1D4ED8"  // Dark blue
  textColor="#FFFFFF"        // White (contrast 8.59:1)
/>

// ❌ Avoid - Low contrast
<Button
  backgroundColor="#93C5FD"  // Light blue
  textColor="#FFFFFF"        // White (contrast 1.47:1)
/>
```

### 3. Use Loading States

```tsx
// ✅ Good - Shows loading state
<Button
  label="Submit"
  loading={isSubmitting}
  disabled={isSubmitting}
/>

// ❌ Avoid - No loading feedback
<Button
  label="Submit"
  onClick={async () => {
    await submit(); // User sees no feedback
  }}
/>
```

### 4. Respect System Preferences

```tsx
// ✅ Good - Follows system dark mode
<ThemeProvider followSystem={true}>
  <App />
</ThemeProvider>

// Also good - Explicit control
const { isDark } = useDarkMode();
```

### 5. Use Semantic Colors

```tsx
// ✅ Good - Semantic meaning
<Button backgroundColor={theme.error} />  // For destructive actions
<Button backgroundColor={theme.primary} /> // For primary actions

// ❌ Avoid - Arbitrary colors
<Button backgroundColor="#FF0000" /> // Why red?
```

---

## Troubleshooting

### Component Not Styled

```tsx
// Ensure ThemeProvider wraps your app
<ThemeProvider initialTheme={theme}>
  <App /> {/* All components inside */}
</ThemeProvider>
```

### Dark Mode Not Working

```tsx
// Enable system preference following
<ThemeProvider followSystem={true}>
  <App />
</ThemeProvider>

// Or manually control
const { toggle } = useDarkMode();
```

### Contrast Warnings

```tsx
// Button shows contrast warning in dev mode
<Button
  showQualityWarnings={process.env.NODE_ENV === 'development'}
  // ...
/>
// Check console for WCAG/APCA warnings
```

---

## Scientific Guarantees

Momoto provides these validated guarantees:

| Guarantee | Threshold | Actual |
|-----------|-----------|--------|
| OKLCH L error | < 1% | 0.04% |
| OKLCH C error | < 2% | 0.07% |
| Roundtrip stability | ±2/1000 | ±2 |
| WCAG AA threshold | 4.5:1 | Locked |
| APCA body threshold | Lc 60 | Locked |

---

## File Locations Reference

```
momoto-ui/
├── adapters/
│   ├── react/
│   │   ├── index.ts          # All exports
│   │   ├── ReactThemeProvider.tsx
│   │   ├── useTheme.ts       # Hooks
│   │   ├── button/
│   │   ├── textfield/
│   │   ├── checkbox/
│   │   ├── select/
│   │   ├── switch/
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   └── stat.tsx
│   ├── css/
│   │   └── CssVariablesAdapter.ts
│   └── tailwind/
│       └── index.ts
├── domain/
│   ├── tokens/
│   │   ├── services/TokenDerivationService.ts
│   │   └── value-objects/DesignToken.ts
│   ├── perceptual/
│   │   └── services/AccessibilityService.ts
│   └── ux/
│       └── value-objects/UIState.ts
├── crates/momoto-ui-core/    # Rust/WASM core
└── docs/
    ├── API_REFERENCE.md
    ├── SCIENTIFIC_FOUNDATIONS.md
    └── INTEGRATION_GUIDE.md
```

---

## Summary for Agents

When working on zuclubit-sso-web:

1. **Import from** `@zuclubit/momoto-ui/adapters/react`
2. **Wrap app** in `<ThemeProvider>`
3. **Use components**: Button, TextField, Card, Badge, etc.
4. **Follow token pattern**: backgroundColor, textColor, etc.
5. **States are automatic**: hover, focus, active derived from base
6. **Accessibility built-in**: WCAG/APCA validation included
7. **Dark mode ready**: Use `useDarkMode()` or `followSystem`

---

*Generated for Zuclubit AI Agents*
*Momoto Design System v1.0.0-rc1*
