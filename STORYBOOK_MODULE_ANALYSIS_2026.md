# Análisis Profundo por Módulo — momoto-ui

**Fecha**: 2026-01-11
**Fase**: FASE 2 - Análisis Profundo
**Objetivo**: Identificar APIs públicas para integración Storybook

---

## 1. RESUMEN DE MÓDULOS

| Módulo | Ubicación | WASM Deps | Stories Existentes | Prioridad |
|--------|-----------|-----------|-------------------|-----------|
| EnrichedToken | domain/tokens/value-objects | Sí (QualityScorer) | 0 | Alta |
| TokenEnrichmentService | domain/tokens/services | Sí (Bridge) | 0 | Alta |
| TokenValidator | domain/tokens/validators | Sí (WCAG) | 0 | Media |
| PerceptualColor | domain/perceptual/value-objects | No | 0 | Alta |
| TextColorDecisionService | domain/perceptual/services | Sí (WCAG) | 0 | Alta |
| React Adapters | adapters/react | Indirecto | 0 | Alta |
| Vue Adapters | adapters/vue | Indirecto | 0 | Media |
| Svelte Adapters | adapters/svelte | Indirecto | 0 | Media |
| CssVariablesAdapter | adapters/css | No | 0 | Alta |
| ButtonCore | adapters/core/button | No | 0 | Media |

---

## 2. DOMAIN/TOKENS — Sistema de Tokens Enriquecidos

### 2.1 EnrichedToken

**Archivo**: `domain/tokens/value-objects/EnrichedToken.ts`

**Factories Estáticas**:
```typescript
EnrichedToken.fromMomotoDecision(name, decision) → EnrichedToken
EnrichedToken.enrich(token, metadata) → EnrichedToken
EnrichedToken.withDefaultMetadata(token, reason) → EnrichedToken
```

**Getters Públicos**:
- `qualityScore: number` — 0-1, del QualityScorer WASM
- `confidence: number` — 0-1, claridad de decisión
- `reason: string` — Explicación legible
- `sourceDecisionId: string` — Trazabilidad a WASM
- `accessibility?: { wcagRatio, passesAA, passesAAA }`

**Predicados (útiles para filtros en Storybook)**:
- `isHighQuality`, `isMediumQuality`, `isLowQuality`
- `isHighConfidence`, `isMediumConfidence`, `isLowConfidence`
- `passesWCAG_AA`, `passesWCAG_AAA`, `isMomotoDecision`

**Exports**:
- `toW3CWithMetadata()` — Formato W3C con metadata Momoto
- `toCssVariable()` — Sintaxis CSS variable
- `toDebugString()` — Output detallado de debug
- `toJSON()` — Serialización

**Demo Story Propuesta**:
```
EnrichedTokens.stories.tsx
├── Default — Token básico con metadata
├── HighQuality — Token de alta calidad
├── LowQuality — Token con warnings
├── WithAccessibility — Token con evaluación WCAG
├── BatchCreation — Creación en batch
├── QualityFiltering — Filtrado por calidad
└── ThemeIntegration — Integración con temas
```

### 2.2 TokenEnrichmentService

**Archivo**: `domain/tokens/services/TokenEnrichmentService.ts`

**API Principal**:
```typescript
TokenEnrichmentService.createColorDecision(input): Promise<MomotoColorDecision>
TokenEnrichmentService.createColorDecisionsBatch(inputs): Promise<MomotoColorDecision[]>
```

**Input Type**:
```typescript
ColorDecisionInput {
  color: PerceptualColor
  role?: UIRoleType
  context?: TokenContext
  description?: string
  background?: PerceptualColor  // Activa evaluación de contraste
}
```

**Output Type**:
```typescript
MomotoColorDecision {
  color: PerceptualColor
  qualityScore: number
  confidence: number
  reason: string
  sourceDecisionId: string
  accessibility?: { wcagRatio, passesAA, passesAAA }
}
```

**WASM Integration**: Delega 100% a Momoto para scoring y razonamiento.

### 2.3 TokenValidator

**Archivo**: `domain/tokens/validators/TokenValidator.ts`

**API**:
```typescript
validate(theme, version): ValidationResult
checkCompatibility(themeVersion, uiVersion): CompatibilityResult
```

**Validaciones**:
- Completitud estructural (todos los tokens requeridos)
- Completitud de metadata (qualityScore, confidence, reason)
- Compliance de accesibilidad (WCAG AA/AAA)
- Warnings de calidad (no bloqueantes)

---

## 3. DOMAIN/PERCEPTUAL — Engine de Percepción de Color

### 3.1 PerceptualColor

**Archivo**: `domain/perceptual/value-objects/PerceptualColor.ts`

**Factories**:
```typescript
PerceptualColor.fromHex(hex): Promise<PerceptualColor>
PerceptualColor.fromOklch(l, c, h, alpha): PerceptualColor
PerceptualColor.fromRgb(r, g, b, alpha): PerceptualColor
PerceptualColor.fromHct(h, c, t): PerceptualColor
PerceptualColor.tryFromHex(hex): Result<PerceptualColor>
```

**Getters de Color Spaces** (lazy-evaluated):
- `oklch: OklchCoordinates` — Source of truth
- `rgb: RgbCoordinates`
- `hsl: HslCoordinates`
- `hct: HctCoordinates`
- `hex: HexColor`

**Operaciones Inmutables**:
```typescript
lighten(amount): PerceptualColor
darken(amount): PerceptualColor
saturate(amount): PerceptualColor
desaturate(amount): PerceptualColor
rotateHue(degrees): PerceptualColor
withAlpha(alpha): PerceptualColor
interpolate(target, t, options): PerceptualColor
gradient(target, steps, options): PerceptualColor[]
complement(): PerceptualColor
analogous(): [PerceptualColor, PerceptualColor]
triadic(): [PerceptualColor, PerceptualColor]
```

**Análisis**:
```typescript
analyze(): PerceptualAnalysis  // warmth, brightness, saturation, contrastMode
deltaE(other): number          // Delta E OKLCH
isSimilarTo(other, threshold): boolean
```

**Exports CSS**:
- `toCssOklch()`, `toCssRgb()`, `toCssHsl()`
- `toJSON()`, `fromJSON()`

**Demo Story Propuesta**:
```
PerceptualColor.stories.tsx
├── ColorSpaces — Visualizar OKLCH, RGB, HSL, HCT
├── ColorOperations — lighten/darken/saturate
├── Interpolation — Gradientes smooth
├── ColorHarmonies — Complement, analogous, triadic
├── DeltaE — Comparación perceptual
└── Analyze — Warmth, brightness, saturation
```

### 3.2 TextColorDecisionService

**Archivo**: `domain/perceptual/services/TextColorDecisionService.ts`

**API**:
```typescript
getOptimalTextColor(background): Promise<TextColorDecision>
tryGetOptimalTextColor(background): Promise<Result<TextColorDecision>>
getTextMode(background): 'light' | 'dark'
```

**Output**:
```typescript
TextColorDecision {
  color: PerceptualColor      // Color óptimo
  contrastRatio: number       // WCAG ratio
  qualityScore: number        // 0-1
  confidence: number          // 0-1
  reason: string              // Explicación
  passesAA, passesAAA: boolean
}
```

**Demo Story Propuesta**:
```
TextColorDecision.stories.tsx
├── AutomaticTextColor — Input de fondo, output de texto
├── ContrastVisualization — Mostrar ratio WCAG
├── WCAGCompliance — AA vs AAA
└── EdgeCases — Colores difíciles
```

---

## 4. ADAPTERS/REACT — Componentes React

### 4.1 Provider & Context

```typescript
ThemeProvider      // Context provider wrapper
useThemeContext()  // Raw context access
useTheme()         // { isDark, themeName, isLoading, error }
useDarkMode()      // { toggle, setDark, setLight }
```

### 4.2 Hooks

```typescript
useThemeSwitcher()       // Theme switching
useThemeVariable()       // Access CSS variables
useSystemPreferences()   // System dark mode detection
useAppliedTokens()       // Currently applied tokens
useThemePreferences()    // User preferences
```

### 4.3 Governance Hooks

```typescript
useGovernance()             // Access governance context
useColorGovernance()        // Color policy checks
useAccessibilityGovernance() // A11y compliance
useComplianceStatus()       // Compliance metrics
```

### 4.4 Componentes

| Componente | Props Pattern | Estado |
|------------|---------------|--------|
| Button | label, backgroundColor, textColor, size, variant | Completo |
| ButtonWithVariant | variant: primary/secondary/tertiary/danger | Completo |
| TextField | label, value, onChange, error | Completo |
| Checkbox | checked, onChange, label | Completo |
| Select | options, value, onChange | Completo |
| Switch | checked, onChange, size | Completo |
| Card | children, variant, padding | FASE 16.3 |
| Stat | value, label, change, changeType | Completo |
| Badge | label, variant, size | Completo |

**Demo Story Propuesta**:
```
ReactComponents.stories.tsx
├── ButtonShowcase — Todos los variants y sizes
├── FormComponents — TextField, Checkbox, Select, Switch
├── CardLayouts — Card con contenido real
├── DataDisplay — Stat, Badge
├── ThemeIntegration — ThemeProvider + hooks
└── GovernanceDemo — Compliance visualization
```

---

## 5. ADAPTERS/CSS — CssVariablesAdapter

**Archivo**: `adapters/css/CssVariablesAdapter.ts`

### 5.1 Theme Application

```typescript
apply(config): Result<void, Error>
remove(): Result<void, Error>
switchTo(themeName, options): Result<void, Error>
toggleDarkMode(options): Result<void, Error>
```

### 5.2 State Management

```typescript
getState(): Result<ThemeState, Error>
registerTheme(config): Result<void, Error>
unregisterTheme(themeName): Result<void, Error>
listThemes(): Result<string[], Error>
```

### 5.3 Preferences

```typescript
getPreferences(): Result<ThemePreferences, Error>
setPreferences(prefs): Result<void, Error>
detectSystemPreferences(): Result<SystemPreferences, Error>
syncWithSystem(): Result<void, Error>
```

### 5.4 CSS Variables

```typescript
getVariable(name): Result<string | null, Error>
setVariable(name, value): Result<void, Error>
getAllVariables(): Result<Record<string, string>, Error>
```

### 5.5 Options

```typescript
CssAdapterOptions {
  rootSelector?: string          // ':root'
  variablePrefix?: string        // ''
  styleElementId?: string        // 'momoto-ui-theme'
  useDarkModeMediaQuery?: boolean // true
  darkModeClass?: string         // 'dark'
  storageKey?: string            // 'momoto-ui-theme-preferences'
  defaultTransitionDuration?: number // 200
}
```

**Demo Story Propuesta**:
```
CssVariablesAdapter.stories.tsx
├── ThemeSwitching — switchTo() demo
├── DarkModeToggle — toggleDarkMode() demo
├── SystemSync — syncWithSystem() demo
├── VariableInspector — getAllVariables() visualizer
├── PersistenceDemo — Preferences storage
└── ConfigurationOptions — Different options
```

---

## 6. STORYBOOK UTILITIES (lib/utils.ts)

### 6.1 Glass Enhancement

```typescript
enhanceGlassCss(baseCss, options): CSSProperties

GlassEnhancement {
  border?: boolean
  innerHighlight?: boolean
  fresnelGlow?: boolean        // DEFAULT: true
  specularHighlight?: boolean  // DEFAULT: true
  specularIntensity?: number   // 0-1
  fresnelIntensity?: number    // 0-1
  elevation?: number           // 0-5
  borderRadius?: number
  lightMode?: boolean
  saturate?: boolean
}
```

### 6.2 Text Styles

```typescript
glassTextStyles.heading      // Light mode heading
glassTextStyles.body         // Light mode body
glassTextStyles.subtle       // Light mode subtle
glassTextStyles.headingDark  // Dark mode heading
glassTextStyles.bodyDark     // Dark mode body
glassTextStyles.subtleDark   // Dark mode subtle
```

### 6.3 Backgrounds

```typescript
gradientBackgrounds: {
  ocean, sunset, forest, midnight, dawn, aurora, cosmic
}

imageBackgrounds: {
  mountain, ocean, forest, sunset, aurora,
  cityNight, cityDay, architecture,
  colorful, gradient, neon,
  marble, wood, fabric,
  dashboard, code, map
}
```

---

## 7. GAPS CRÍTICOS IDENTIFICADOS

### 7.1 Sin Story Interactiva

| Módulo | Impacto DX | Prioridad |
|--------|------------|-----------|
| EnrichedToken | Alto — No se muestra metadata | P0 |
| PerceptualColor | Alto — No se visualizan color spaces | P0 |
| TextColorDecisionService | Alto — Uso crítico para UIs | P0 |
| React Components | Alto — No hay demo de hooks | P1 |
| CssVariablesAdapter | Medio — No hay demo de switching | P1 |
| Vue/Svelte Adapters | Medio — Multi-framework sin ejemplos | P2 |

### 7.2 Stories Existentes que Necesitan Mejora

| Story | Problema | Mejora Requerida |
|-------|----------|------------------|
| Card.stories.tsx | No usa WASM physics | Integrar GlassMaterial |
| Input.stories.tsx | No usa WASM physics | Integrar GlassMaterial |
| Shadows stories | No usa WASM shadows | Integrar calculateElevationShadow |

---

## 8. PLAN PARA FASE 3

### Stories Nuevas a Crear (Prioridad P0-P1)

1. **EnrichedTokens.stories.tsx** — 7 variantes
2. **PerceptualColor.stories.tsx** — 6 variantes
3. **TextColorDecision.stories.tsx** — 4 variantes
4. **ReactComponents.stories.tsx** — 6 variantes
5. **CssVariablesAdapter.stories.tsx** — 6 variantes

### Stories Existentes a Mejorar

1. **Card.stories.tsx** — Añadir presets WASM
2. **Input.stories.tsx** — Añadir estados glass

### Estimación

- Stories nuevas: 5 archivos × ~400 LOC = ~2000 LOC
- Mejoras: 2 archivos × ~100 LOC = ~200 LOC
- **Total estimado**: ~2200 LOC

---

*Fin del Análisis — FASE 2 completada*
