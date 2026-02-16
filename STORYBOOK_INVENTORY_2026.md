# Inventario de Stories y Ejemplos — momoto-ui

**Fecha**: 2026-01-11
**Ingeniero**: Claude Opus 4.5 (Especialista DX/Storybook)
**Objetivo**: Inventario exhaustivo para integración Storybook

---

## 1. RESUMEN EJECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total archivos .stories.tsx** | 31 |
| **Total archivos de ejemplos** | 3 |
| **Stories avanzadas (✅)** | 16 |
| **Stories parciales (⚠️)** | 12 |
| **Stories triviales (❌)** | 3 |
| **Cobertura WASM** | 52% |
| **Estado general** | Excelente base, requiere integración |

---

## 2. CLASIFICACIÓN DE STORIES

### 2.1 ✅ AVANZADAS — Estado del Arte (16 archivos)

Estas stories demuestran capacidades completas del engine WASM de Momoto.

| Archivo | Ubicación | Funcionalidades |
|---------|-----------|-----------------|
| `MomotoExamples.stories.tsx` | packages/momoto-ui-crystal | 4 ejemplos canónicos WASM |
| `Button.stories.tsx` | packages/momoto-ui-crystal | Liquid Glass showcase |
| `MomotoComplete.stories.tsx` | packages/momoto-ui-crystal | API completa demostrada |
| `Card.advanced.stories.tsx` | packages/momoto-ui-crystal | Dashboard, e-commerce, profiles |
| `CrystalEmulation.stories.tsx` | momoto/apps/storybook | Window reflections, stained glass, lens optics, ice |
| `PhysicsAnimations.stories.tsx` | momoto/apps/storybook | Fresnel interactivo, fogging, Beer-Lambert, day/night |
| `GlassBuilder.stories.tsx` | momoto/apps/storybook | Material builder con sliders |
| `BatchRendering.stories.tsx` | momoto/apps/storybook | Benchmark individual vs batch |
| `ThinFilmIridescence.stories.tsx` | momoto/apps/storybook | Soap bubbles, oil slicks, AR coating |
| `GlassCard.stories.tsx` | momoto/apps/storybook | Card con Fresnel + Blinn-Phong |
| `GlassModal.stories.tsx` | momoto/apps/storybook | Modal con física de vidrio |
| `GlassNavigation.stories.tsx` | momoto/apps/storybook | Navegación glass morphism |
| `EnhancedGlass.stories.tsx` | momoto/apps/storybook | Glass materials mejorados |
| `GlassPresets.stories.tsx` | momoto/apps/storybook | Presets: clear, regular, thick, frosted |
| `HighPerformance.stories.tsx` | momoto/apps/storybook | Optimizaciones de rendimiento |
| `RealWorldUseCases.stories.tsx` | momoto/apps/storybook | Casos de uso prácticos |

**Características Avanzadas Detectadas**:
- ✅ Integración WASM completa
- ✅ Física real (Fresnel, Beer-Lambert, Blinn-Phong)
- ✅ Controles interactivos (sliders, selects)
- ✅ Documentación inline con fórmulas
- ✅ Código generado copiable
- ✅ Múltiples fondos de prueba
- ✅ Animaciones basadas en física

### 2.2 ⚠️ PARCIALES — Requieren Mejora (12 archivos)

Funcionan pero no aprovechan WASM o física avanzada.

| Archivo | Ubicación | Problema |
|---------|-----------|----------|
| `Card.stories.tsx` | packages/momoto-ui-crystal | No usa WASM physics |
| `Input.stories.tsx` | packages/momoto-ui-crystal | No usa WASM physics |
| `CardStack.stories.tsx` | momoto/apps/storybook | Interacción básica |
| `Notification.stories.tsx` | momoto/apps/storybook | Sin efectos glass |
| `Modal.stories.tsx` | momoto/apps/storybook | Versión simplificada |
| `ContactShadows.stories.tsx` | momoto/apps/storybook | Sin WASM shadows |
| `ElevationShadows.stories.tsx` | momoto/apps/storybook | Sin WASM shadows |
| `BackgroundAdaptation.stories.tsx` | momoto/apps/storybook | Conceptual |
| `RenderContext.stories.tsx` | momoto/apps/storybook | Debug utility |
| `GlassTransparency.stories.tsx` | momoto/apps/storybook | Necesita más variantes |
| `MetalMaterials.stories.tsx` | momoto/apps/storybook | Incompleto |
| `SubsurfaceMaterials.stories.tsx` | momoto/apps/storybook | Incompleto |

**Mejoras Requeridas**:
- [ ] Integrar WASM materials
- [ ] Agregar controles interactivos
- [ ] Documentar física
- [ ] Mostrar código generado

### 2.3 ❌ TRIVIALES — Demos Básicos (3 archivos)

| Archivo | Ubicación | Razón |
|---------|-----------|-------|
| `WasmDiagnostic.stories.tsx` | momoto/apps/storybook | Utilidad debug, no ejemplo |
| `Principles.stories.tsx` | momoto/apps/storybook | Solo documentación |
| `Experimental.stories.tsx` | momoto/apps/storybook | Experimentos incompletos |

---

## 3. INVENTARIO DE EJEMPLOS (TypeScript)

| Archivo | Ubicación | Contenido |
|---------|-----------|-----------|
| `enriched-tokens.example.ts` | examples/ | 7 ejemplos: tokens, accessibility, batch, themes |
| `governance-usage.example.ts` | examples/ | Uso de governance |
| `basic-usage.ts` | packages/momoto-ui-wasm/examples/ | Setup básico WASM |

### 3.1 Análisis: enriched-tokens.example.ts

**Estado**: ✅ Avanzado

**Ejemplos incluidos**:
1. `example1_CreateEnrichedToken` — Token individual con metadata
2. `example2_TokenWithAccessibility` — Validación WCAG
3. `example3_GenerateComponentTokens` — Sistema completo de tokens
4. `example4_BatchTokenCreation` — Creación en batch
5. `example5_QualityFiltering` — Filtrado por calidad
6. `example6_DebugOutput` — Output de debug
7. `example7_ThemeSystemIntegration` — Integración con temas

**Calidad**:
- ✅ JSDoc completo
- ✅ Ejecutable directamente
- ✅ Exports individuales y runAllExamples
- ✅ Casos de uso reales

---

## 4. MAPA DE COBERTURA FUNCIONAL

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                     COBERTURA DE FUNCIONALIDADES                               │
├────────────────────┬───────────────────┬───────────────────┬──────────────────┤
│   Funcionalidad    │  Stories Exist    │   Calidad        │   Gap            │
├────────────────────┼───────────────────┼───────────────────┼──────────────────┤
│ GlassMaterial      │ 8                 │ ✅ Excelente     │ Ninguno          │
│ EvalMaterialContext│ 6                 │ ✅ Excelente     │ Ninguno          │
│ RenderContext      │ 5                 │ ✅ Bueno         │ Más variantes    │
│ OKLCH Color        │ 4                 │ ✅ Bueno         │ Ninguno          │
│ BatchEvaluator     │ 1                 │ ✅ Excelente     │ Ninguno          │
│ Fresnel Physics    │ 3                 │ ✅ Excelente     │ Ninguno          │
│ Beer-Lambert       │ 2                 │ ✅ Excelente     │ Ninguno          │
│ Thin-Film          │ 1                 │ ✅ Excelente     │ Ninguno          │
├────────────────────┼───────────────────┼───────────────────┼──────────────────┤
│ Shadows WASM       │ 2                 │ ⚠️ Parcial       │ Integrar WASM    │
│ EnrichedTokens     │ 0 (solo ejemplo)  │ ⚠️ No integrado  │ Crear story      │
│ TokenValidator     │ 0                 │ ❌ Ausente       │ Crear story      │
│ Adapters (React)   │ 0                 │ ❌ Ausente       │ Crear story      │
│ Adapters (Vue)     │ 0                 │ ❌ Ausente       │ Crear story      │
│ Adapters (Svelte)  │ 0                 │ ❌ Ausente       │ Crear story      │
│ CssVariablesAdapter│ 0                 │ ❌ Ausente       │ Crear story      │
└────────────────────┴───────────────────┴───────────────────┴──────────────────┘
```

---

## 5. GAPS IDENTIFICADOS

### 5.1 Funcionalidades Sin Stories

1. **EnrichedTokens** — Existe ejemplo TS pero no hay story
2. **TokenValidator** — Sin demostración visual
3. **Framework Adapters** — React/Vue/Svelte sin stories
4. **CssVariablesAdapter** — Sin story de integración
5. **PerceptualColor** — Sin story dedicado
6. **TextColorDecisionService** — Sin story

### 5.2 Inconsistencias

1. **Dos ubicaciones de stories**:
   - `packages/momoto-ui-crystal/src/components/`
   - `momoto/apps/storybook/src/stories/`

2. **Diferentes estilos de escritura**:
   - Algunos usan argTypes extensivos
   - Otros usan render functions simples

3. **Documentación variable**:
   - Algunas stories tienen docs completos con fórmulas
   - Otras no tienen descripción

---

## 6. RECOMENDACIONES FASE 2

### 6.1 Prioridad Alta

1. **Crear story EnrichedTokens** — Migrar ejemplo a story interactiva
2. **Crear story TokenValidator** — Demostrar validación visual
3. **Crear story Framework Adapters** — Mostrar React/Vue/Svelte

### 6.2 Prioridad Media

4. **Mejorar stories de shadows** — Integrar WASM calculateElevationShadow
5. **Unificar ubicación** — Mover todas a `momoto/apps/storybook`
6. **Estandarizar formato** — Aplicar template consistente

### 6.3 Prioridad Baja

7. **Limpiar experimentales** — Completar o eliminar
8. **Agregar tests de accessibility** — A11y addon
9. **Documentar arquitectura** — Crear story de overview

---

## 7. ESTRUCTURA PROPUESTA

```
momoto/apps/storybook/src/stories/
├── getting-started/
│   ├── Introduction.stories.tsx    # Overview del sistema
│   ├── Installation.stories.tsx    # Setup WASM
│   └── FirstComponent.stories.tsx  # Tutorial paso a paso
├── core/
│   ├── GlassMaterial.stories.tsx   # ✅ Existente
│   ├── OKLCH.stories.tsx           # Nuevo
│   ├── RenderContext.stories.tsx   # ✅ Existente
│   └── BatchEvaluator.stories.tsx  # ✅ Existente
├── physics/
│   ├── Fresnel.stories.tsx         # ✅ Existente (PhysicsAnimations)
│   ├── BeerLambert.stories.tsx     # ✅ Existente
│   ├── ThinFilm.stories.tsx        # ✅ Existente
│   └── BlinnPhong.stories.tsx      # Nuevo
├── tokens/
│   ├── EnrichedTokens.stories.tsx  # Nuevo
│   ├── TokenValidator.stories.tsx  # Nuevo
│   └── CssVariables.stories.tsx    # Nuevo
├── adapters/
│   ├── React.stories.tsx           # Nuevo
│   ├── Vue.stories.tsx             # Nuevo
│   └── Svelte.stories.tsx          # Nuevo
├── examples/
│   ├── GlassCard.stories.tsx       # ✅ Existente
│   ├── Dashboard.stories.tsx       # Nuevo (de Card.advanced)
│   └── ECommerce.stories.tsx       # Nuevo (de Card.advanced)
└── debug/
    └── WasmDiagnostic.stories.tsx  # ✅ Existente
```

---

## 8. CONCLUSIÓN

El repositorio tiene **una base excelente** de stories avanzadas que demuestran las capacidades del engine WASM de Momoto. Los ejemplos de física (Fresnel, Beer-Lambert, thin-film) son estado del arte.

**Áreas de mejora principales**:
1. Integrar ejemplos TypeScript como stories interactivas
2. Crear stories para adapters de framework
3. Unificar y organizar la estructura
4. Estandarizar documentación

**Preparación para FASE 2**: Listo para análisis profundo por módulo.

---

*Fin del Inventario — FASE 1 completada*
