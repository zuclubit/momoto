# FASE 16: Layout & Display Components

## Overview

FASE 16 introduces three essential layout and display components to Momoto UI, built with the Core + Adapter pattern for maximum reusability and framework independence.

**Components:**
- **Card** - Flexible container for content grouping
- **Stat** - KPI and metric display component
- **Badge** - Status and label indicators

All components follow Momoto's perceptual color principles and provide extensive customization through tokens.

---

## Card Component

### Purpose
Container component for grouping related content with semantic visual hierarchy through variants.

### Architecture
```
adapters/core/card/
├── cardCore.types.ts      # Type definitions
├── constants.ts           # Configuration constants
├── styleComputer.ts       # Style computation logic
├── cardCore.ts            # Framework-agnostic core
└── index.ts              # Exports

adapters/react/
└── card.tsx              # React adapter
```

### Variants

#### 1. DEFAULT
Standard card with subtle background.
```tsx
<Card variant={CardVariant.DEFAULT}>
  <Content />
</Card>
```
**Use cases:** General content containers, form sections

#### 2. ELEVATED
Card with prominent shadow for visual hierarchy.
```tsx
<Card variant={CardVariant.ELEVATED}>
  <Content />
</Card>
```
**Use cases:** Primary content cards, featured items

#### 3. INTERACTIVE
Card with hover effects for clickable elements.
```tsx
<Card variant={CardVariant.INTERACTIVE} onClick={handleClick}>
  <Content />
</Card>
```
**Features:**
- Hover shadow enhancement
- Subtle lift transform
- Smooth transitions

**Use cases:** Clickable cards, navigation items, selectable options

#### 4. OUTLINED
Card emphasizing border over shadow.
```tsx
<Card variant={CardVariant.OUTLINED}>
  <Content />
</Card>
```
**Use cases:** Secondary content, list items, bordered sections

#### 5. FLAT
Minimal card without shadows.
```tsx
<Card variant={CardVariant.FLAT}>
  <Content />
</Card>
```
**Use cases:** Nested cards, minimal UI, dense layouts

### Padding Variants

Control internal spacing:
- `CardPadding.NONE` - No padding (for custom layouts)
- `CardPadding.SM` - 12px (compact)
- `CardPadding.MD` - 16px (standard)
- `CardPadding.LG` - 24px (default, comfortable)
- `CardPadding.XL` - 32px (spacious)

```tsx
<Card padding={CardPadding.NONE}>
  {/* Custom layout with no padding */}
</Card>
```

### Radius Variants

Control corner roundness:
- `CardRadius.NONE` - 0px (sharp corners)
- `CardRadius.SM` - 4px (subtle)
- `CardRadius.MD` - 8px (standard)
- `CardRadius.LG` - 12px (pronounced)
- `CardRadius.XL` - 16px (default, modern)
- `CardRadius.FULL` - 9999px (pill shape)

### Token Props

```tsx
interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  radius?: CardRadius;

  // Token overrides
  backgroundColor?: EnrichedToken;
  borderColor?: EnrichedToken;
  borderWidth?: string;
  shadow?: string;

  // Hover states (for INTERACTIVE variant)
  hoverBackgroundColor?: EnrichedToken;
  hoverBorderColor?: EnrichedToken;
  hoverShadow?: string;

  // Interaction
  onClick?: () => void;
  disabled?: boolean;

  // React
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
```

### Best Practices

1. **Semantic Variants**: Choose variants based on content hierarchy
   - Use ELEVATED for primary content
   - Use DEFAULT for secondary content
   - Use INTERACTIVE for clickable items

2. **Padding Scale**: Match padding to content density
   - Use NONE for custom layouts (e.g., full-width images)
   - Use LG (default) for comfortable reading
   - Use XL for hero sections

3. **Accessibility**:
   - INTERACTIVE variant automatically adds `cursor: pointer`
   - Disabled state reduces opacity and prevents interaction

---

## Stat Component

### Purpose
Display KPIs, metrics, and statistics with optional trends and helper text.

### Architecture
```
adapters/core/stat/
├── statCore.types.ts     # Type definitions
├── constants.ts          # Size and trend configuration
├── styleComputer.ts      # Style computation
├── statCore.ts           # Core logic
└── index.ts             # Exports

adapters/react/
└── stat.tsx             # React adapter
```

### Sizes

- `StatSize.SM` - Small (label: 12px, value: 20px)
- `StatSize.MD` - Medium (label: 14px, value: 28px)
- `StatSize.LG` - Large (label: 14px, value: 36px)
- `StatSize.XL` - Extra Large (label: 16px, value: 48px)

### Trend Indicators

Show metric changes with visual direction:

```tsx
<Stat
  label="Revenue"
  value="$127,450"
  trend={{
    direction: TrendDirection.UP,
    value: '+18.2%',
    description: 'vs last month',
    color: successText,
  }}
/>
```

**Trend Directions:**
- `TrendDirection.UP` → ↑ (upward arrow)
- `TrendDirection.DOWN` → ↓ (downward arrow)
- `TrendDirection.NEUTRAL` → → (neutral arrow)

### Token Props

```tsx
interface StatProps {
  // Required
  label: string;
  value: string | number;

  // Optional
  size?: StatSize;
  helperText?: string;
  trend?: StatTrend;

  // Tokens
  labelColor?: EnrichedToken;
  valueColor?: EnrichedToken;
  helperTextColor?: EnrichedToken;

  // React
  style?: React.CSSProperties;
  className?: string;
}

interface StatTrend {
  direction: TrendDirection;
  value: string;
  description?: string;
  color?: EnrichedToken;
}
```

### Usage Patterns

#### Basic KPI
```tsx
<Stat
  label="Total Revenue"
  value="$75,420"
  size={StatSize.XL}
  labelColor={neutralText}
  valueColor={neutralText}
/>
```

#### With Trend
```tsx
<Stat
  label="Conversion Rate"
  value="45.2%"
  trend={{
    direction: TrendDirection.DOWN,
    value: '-5.8%',
    description: 'vs last month',
    color: errorText,
  }}
  size={StatSize.LG}
  labelColor={neutralText}
  valueColor={neutralText}
/>
```

#### With Helper Text
```tsx
<Stat
  label="Pipeline Value"
  value="$425,000"
  helperText="Across 43 opportunities"
  size={StatSize.MD}
  labelColor={neutralText}
  valueColor={neutralText}
  helperTextColor={neutralText}
/>
```

### Best Practices

1. **Size Selection**:
   - Use XL for hero metrics on dashboards
   - Use LG for primary KPIs in cards
   - Use MD for secondary metrics
   - Use SM for compact displays

2. **Trend Colors**:
   - UP trends → Success color (green)
   - DOWN trends → Error or Warning color (red/amber)
   - NEUTRAL → Neutral text color (gray)

3. **Helper Text**:
   - Keep concise (< 30 characters)
   - Provide context (e.g., "vs last month", "Target: $150K")
   - Use for units or clarifications

---

## Badge Component

### Purpose
Display status, labels, and categorical information in a compact format.

### Architecture
```
adapters/core/badge/
├── badgeCore.types.ts    # Type definitions
├── constants.ts          # Variant and size config
├── styleComputer.ts      # Style computation
├── badgeCore.ts          # Core logic
└── index.ts             # Exports

adapters/react/
└── badge.tsx            # React adapter
```

### Variants

#### 1. SOLID
Filled background with high contrast.
```tsx
<Badge
  variant={BadgeVariant.SOLID}
  backgroundColor={successBg}
  textColor={successText}
>
  Won
</Badge>
```
**Use cases:** Primary status indicators, active states

#### 2. SUBTLE
Low-contrast background (20% opacity).
```tsx
<Badge
  variant={BadgeVariant.SUBTLE}
  backgroundColor={warningBg}
  textColor={warningText}
>
  Pending
</Badge>
```
**Use cases:** Secondary labels, tags, categories

#### 3. OUTLINE
Border-only with transparent background.
```tsx
<Badge
  variant={BadgeVariant.OUTLINE}
  textColor={primaryText}
  borderColor={neutralBorder}
>
  Draft
</Badge>
```
**Use cases:** Minimal UI, secondary information

### Sizes

- `BadgeSize.SM` - Small (text: 11px, padding: 2px 8px)
- `BadgeSize.MD` - Medium (text: 12px, padding: 4px 10px)
- `BadgeSize.LG` - Large (text: 13px, padding: 6px 12px)

### Clickable Badges

Badges can be interactive:
```tsx
<Badge
  onClick={() => handleFilter('won')}
  backgroundColor={primaryBg}
  textColor={primaryText}
>
  Filter
</Badge>
```
Automatically adds:
- `cursor: pointer`
- `role="button"`
- `tabIndex="0"`
- Keyboard support (Enter/Space)

### Token Props

```tsx
interface BadgeProps {
  // Required
  children: React.ReactNode;

  // Optional
  variant?: BadgeVariant;
  size?: BadgeSize;

  // Tokens
  backgroundColor?: EnrichedToken;
  textColor?: EnrichedToken;
  borderColor?: EnrichedToken;

  // Interaction
  onClick?: () => void;

  // React
  style?: React.CSSProperties;
  className?: string;
  id?: string;
}
```

### Status Color Patterns

```tsx
// Success states
<Badge variant={BadgeVariant.SOLID} backgroundColor={successBg} textColor={successText}>
  Active
</Badge>

// Warning states
<Badge variant={BadgeVariant.SOLID} backgroundColor={warningBg} textColor={warningText}>
  Pending
</Badge>

// Error states
<Badge variant={BadgeVariant.SOLID} backgroundColor={errorBg} textColor={errorText}>
  Failed
</Badge>

// Neutral states
<Badge variant={BadgeVariant.SUBTLE} backgroundColor={neutralBg} textColor={neutralText}>
  Draft
</Badge>
```

### Best Practices

1. **Variant Selection**:
   - Use SOLID for high-priority status (Won/Lost/Active)
   - Use SUBTLE for secondary information (tags, categories)
   - Use OUTLINE for minimal UI or tertiary info

2. **Color Semantics**:
   - Success (green) → Positive outcomes, completions
   - Warning (amber) → Attention needed, in-progress
   - Error (red) → Failures, blocked states
   - Neutral (gray) → Inactive, draft, default

3. **Size Guidelines**:
   - SM → Inline with text, compact lists
   - MD → Standard UI elements
   - LG → Prominent displays, hero sections

---

## Integration Examples

### Dashboard Card with All Components

```tsx
<Card variant={CardVariant.ELEVATED}>
  <div style={{ padding: '24px' }}>
    {/* Header with Badge */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
      <h3>Sales Performance</h3>
      <Badge
        variant={BadgeVariant.SOLID}
        backgroundColor={successBg}
        textColor={successText}
        size={BadgeSize.SM}
      >
        Active
      </Badge>
    </div>

    {/* Primary Stat with Trend */}
    <Stat
      label="Monthly Revenue"
      value="$127,450"
      trend={{
        direction: TrendDirection.UP,
        value: '+18.2%',
        description: 'vs last month',
        color: successText,
      }}
      helperText="Target: $150,000"
      size={StatSize.LG}
      labelColor={neutralText}
      valueColor={neutralText}
    />

    {/* Footer with Multiple Badges */}
    <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
      <Badge variant={BadgeVariant.SUBTLE} backgroundColor={primaryBg} textColor={primaryText}>
        Q4 2025
      </Badge>
      <Badge variant={BadgeVariant.SUBTLE} backgroundColor={successBg} textColor={successText}>
        On Track
      </Badge>
    </div>
  </div>
</Card>
```

### Interactive List Item

```tsx
<Card variant={CardVariant.INTERACTIVE} onClick={handleSelect}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div>
      <h4>Deal with Acme Corp</h4>
      <p>Enterprise software license</p>
    </div>
    <Badge
      variant={BadgeVariant.SOLID}
      backgroundColor={successBg}
      textColor={successText}
      size={BadgeSize.SM}
    >
      Won
    </Badge>
  </div>
</Card>
```

---

## Design Tokens

All components accept Momoto `EnrichedToken` objects:

```typescript
interface EnrichedToken {
  value: {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
  };
  qualityScore?: number;
  metadata?: Record<string, any>;
}
```

This ensures perceptual accuracy and accessibility compliance across all components.

---

## Accessibility Features

### Card
- Semantic HTML (`<div>` with proper ARIA)
- Keyboard focus for interactive variants
- Disabled state prevents interaction
- Proper cursor indicators

### Stat
- Semantic structure (label → value → trend → helper)
- Color is not the only indicator (trend symbols)
- Data attributes for testing

### Badge
- Role="button" for clickable badges
- Keyboard navigation (Tab, Enter, Space)
- Text capitalization for readability
- Sufficient color contrast (AA compliant)

---

## Performance

All components are optimized for performance:

1. **No Re-renders**: Pure computation in Core
2. **Minimal CSS**: Inline styles, no CSS-in-JS overhead
3. **Tree-shakeable**: Import only what you need
4. **Type-safe**: Full TypeScript support

---

## Migration Guide

### From inline cards to Card component

Before:
```tsx
<div style={{
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
}}>
  <Content />
</div>
```

After:
```tsx
<Card variant={CardVariant.ELEVATED}>
  <Content />
</Card>
```

### From custom KPI displays to Stat

Before:
```tsx
<div>
  <div style={{ fontSize: '14px', opacity: 0.6 }}>Revenue</div>
  <div style={{ fontSize: '36px', fontWeight: 700 }}>$127,450</div>
  <div style={{ fontSize: '14px', color: 'green' }}>↑ +18.2%</div>
</div>
```

After:
```tsx
<Stat
  label="Revenue"
  value="$127,450"
  trend={{
    direction: TrendDirection.UP,
    value: '+18.2%',
    color: successText,
  }}
  size={StatSize.LG}
/>
```

---

## Testing

All components include data attributes for testing:

```tsx
// Card
<Card data-testid="my-card" />
// → data-component="card"
// → data-variant="elevated"

// Stat
<Stat data-testid="revenue-stat" />
// → data-component="stat"
// → data-size="lg"
// → data-trend="up"

// Badge
<Badge data-testid="status-badge" />
// → data-component="badge"
// → data-variant="solid"
// → data-size="md"
```

---

## Future Enhancements

### Planned for FASE 16.4+
- Card: Focus ring styles, focus-visible support
- Stat: Animation for value changes
- Badge: Dot variant, icon support
- All: Dark mode refinements
- All: Animation presets

---

## Support

For questions or issues:
- GitHub: [momoto-ui/issues](https://github.com/zuclubit/momoto-ui/issues)
- Documentation: [momoto-ui/docs](https://github.com/zuclubit/momoto-ui/docs)

---

**Built with Momoto Perceptual Color System**
FASE 16 | Version 1.0.0
