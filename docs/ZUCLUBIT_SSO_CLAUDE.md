# CLAUDE.md - Momoto Design System Context for zuclubit-sso-web

> Este archivo proporciona contexto a AI agents que trabajan en zuclubit-sso-web.
> Copiar este contenido al archivo CLAUDE.md del proyecto zuclubit-sso-web.

---

## Design System: Momoto

Este proyecto usa **Momoto**, un Design System de Color Intelligence desarrollado por Zuclubit.

### Ubicación del Código Fuente

```
/Users/oscarvalois/Documents/Github/Zuclubit/momoto-ui
```

### Documentación Completa

- `momoto-ui/docs/API_REFERENCE.md` - Referencia completa de APIs
- `momoto-ui/docs/SCIENTIFIC_FOUNDATIONS.md` - Fundamentos matemáticos
- `momoto-ui/docs/INTEGRATION_GUIDE.md` - Guía de integración
- `momoto-ui/docs/MOMOTO_AGENT_CONTEXT.md` - Contexto para agents

---

## Quick Reference

### Installation

```bash
npm install @zuclubit/momoto-ui
```

### Core Imports

```tsx
// React components y hooks
import {
  ThemeProvider,
  Button,
  TextField,
  Checkbox,
  Select,
  Switch,
  Card,
  Badge,
  Stat,
  useTheme,
  useDarkMode,
  useThemeSwitcher,
} from '@zuclubit/momoto-ui/adapters/react';

// Domain services (if needed)
import { AccessibilityService } from '@zuclubit/momoto-ui/domain/perceptual';
import { TokenDerivationService } from '@zuclubit/momoto-ui/domain/tokens';
import { UIState } from '@zuclubit/momoto-ui/domain/ux';
```

### Provider Setup

```tsx
// En el layout principal o providers.tsx
import { ThemeProvider } from '@zuclubit/momoto-ui/adapters/react';

const ssoTheme = {
  name: 'zuclubit-sso',
  isDark: false,
  tokens: {
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
    <ThemeProvider initialTheme={ssoTheme} followSystem={true}>
      {children}
    </ThemeProvider>
  );
}
```

---

## Componentes Disponibles

### Button

```tsx
<Button
  label="Sign In"
  backgroundColor="#3B82F6"
  textColor="#FFFFFF"
  onClick={handleClick}
  loading={isLoading}
  disabled={isDisabled}
  size="md" // sm | md | lg
  fullWidth={false}
  icon={<Icon />}
  iconPosition="left" // left | right
/>
```

### TextField

```tsx
<TextField
  label="Email"
  type="email"
  placeholder="user@example.com"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
  disabled={isLoading}
/>
```

### Card

```tsx
<Card
  variant="elevated" // default | outlined | elevated
  padding="lg"       // sm | md | lg | xl
  radius="md"        // sm | md | lg
>
  {children}
</Card>
```

### Badge

```tsx
<Badge
  variant="success" // default | success | error | warning | info
  size="md"         // sm | md | lg
>
  Active
</Badge>
```

---

## UI States

Momoto maneja 8 estados de interacción automáticamente:

| Estado | Prioridad | Uso |
|--------|-----------|-----|
| `idle` | 0 | Estado base |
| `hover` | 40 | Mouse sobre el elemento |
| `focus` | 50 | Foco de teclado |
| `active` | 60 | Click/press activo |
| `success` | 75 | Operación exitosa |
| `error` | 80 | Error de validación |
| `loading` | 90 | Operación en progreso |
| `disabled` | 100 | Elemento deshabilitado |

Los tokens para cada estado se derivan automáticamente del color base.

---

## Hooks Útiles

### useDarkMode

```tsx
const { isDark, toggle, enable, disable } = useDarkMode();
```

### useTheme

```tsx
const { activeTheme, isDark, availableThemes, appliedTokens } = useTheme();
```

### useSystemPreferences

```tsx
const { prefersDark, prefersReducedMotion, prefersHighContrast } = useSystemPreferences();
```

---

## Accesibilidad

Momoto incluye validación WCAG y APCA automática.

### Thresholds WCAG

- **AAA**: 7:1 (máxima accesibilidad)
- **AA**: 4.5:1 (texto normal)
- **AA-large**: 3:1 (texto grande 18px+)

### Thresholds APCA

- **Lc75**: Texto body (12px+)
- **Lc60**: Texto grande (18px+)
- **Lc45**: Headings, iconos grandes
- **Lc30**: Texto secundario

### Validación de Contraste

```tsx
import { AccessibilityService } from '@zuclubit/momoto-ui/domain/perceptual';

const a11y = new AccessibilityService();
const result = a11y.evaluate(
  { r: 255, g: 255, b: 255 }, // background
  { r: 0, g: 0, b: 0 }        // foreground
);

if (!result.meetsWcagAA) {
  console.warn('Contrast too low!');
}
```

---

## Patrones SSO Comunes

### Login Form

```tsx
function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <Card variant="elevated" padding="xl">
      {error && <Badge variant="error">{error}</Badge>}

      <TextField label="Email" type="email" required />
      <TextField label="Password" type="password" required />

      <Checkbox label="Remember me" />

      <Button
        type="submit"
        label={loading ? 'Signing in...' : 'Sign In'}
        backgroundColor="#3B82F6"
        textColor="#FFFFFF"
        loading={loading}
        fullWidth
      />
    </Card>
  );
}
```

### OAuth Buttons

```tsx
<Button
  label="Continue with Google"
  icon={<GoogleIcon />}
  backgroundColor="#FFFFFF"
  textColor="#1F2937"
  borderColor="#D1D5DB"
  fullWidth
/>

<Button
  label="Continue with GitHub"
  icon={<GitHubIcon />}
  backgroundColor="#24292F"
  textColor="#FFFFFF"
  fullWidth
/>
```

---

## Arquitectura del Sistema

```
Momoto Architecture:

┌─────────────────────────────────────────────┐
│            React Components                  │
│  (Button, TextField, Card, Badge, etc.)     │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│           React Adapters                     │
│  (ThemeProvider, useTheme, useDarkMode)     │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│            Domain Layer                      │
│  (TokenDerivation, Accessibility, UIState)  │
└─────────────────────┬───────────────────────┘
                      │
┌─────────────────────▼───────────────────────┐
│          Rust/WASM Core                      │
│  (OKLCH, Contrast, Performance)             │
└─────────────────────────────────────────────┘
```

---

## Garantías Científicas

| Garantía | Valor |
|----------|-------|
| Error OKLCH L | < 0.1% |
| Error OKLCH C | < 0.1% |
| Estabilidad roundtrip | ±2/1000 iteraciones |
| Tests totales | 68 |
| Contratos bloqueados | 23 |

---

## Archivos Clave en momoto-ui

```
momoto-ui/
├── adapters/react/
│   ├── index.ts              # Exports principales
│   ├── ReactThemeProvider.tsx
│   ├── useTheme.ts
│   ├── button/Button.tsx
│   ├── textfield/TextField.tsx
│   ├── card.tsx
│   └── badge.tsx
├── domain/
│   ├── perceptual/services/AccessibilityService.ts
│   ├── tokens/services/TokenDerivationService.ts
│   └── ux/value-objects/UIState.ts
└── crates/momoto-ui-core/    # Rust/WASM
```

---

## Reglas para el Agent

1. **Siempre usar ThemeProvider** en el root de la aplicación
2. **Preferir componentes Momoto** sobre HTML nativo para UI
3. **Usar pattern token-driven**: backgroundColor, textColor, etc.
4. **Los estados se derivan automáticamente** del color base
5. **Validar accesibilidad** con AccessibilityService si hay dudas
6. **Seguir dark mode del sistema** con `followSystem={true}`
7. **Usar Badge para feedback** de error/success/warning

---

## Ejemplos de Código Completos

Ver: `momoto-ui/docs/MOMOTO_AGENT_CONTEXT.md`

---

*Momoto Design System v1.0.0-rc1*
*Para uso en proyectos Zuclubit*
