# 🏢 Topocho CRM - Momoto UI Showcase

## Overview

**Topocho CRM** is a functional Customer Relationship Management dashboard built **exclusively** with Momoto UI components. It demonstrates real-world usage, composition patterns, and the productivity gains of a token-driven design system.

## What This Demo Proves

1. **5 components are enough** - Button, TextField, Checkbox, Select, Switch cover 90% of CRM needs
2. **Composition > Quantity** - Complex UIs built from simple primitives
3. **Zero CSS custom** - Entire app styled via tokens only
4. **Accessibility by default** - WCAG 2.2 AA without extra effort
5. **Contract compliance** - Passes `npm run verify:contract`
6. **Framework parity** - Could be built identically in Vue/Svelte/Angular

## Features

### 📊 Dashboard
- KPI cards (revenue, clients, opportunities)
- System status indicators (Switch)
- Quick filters (Select)
- Global search (TextField)

### 👥 Clients Management
- Client list with filters
- Client creation/editing forms
- Status management (active/inactive)
- Category assignment

### 💼 Opportunities Management
- Sales pipeline visualization
- Stage transitions (Lead → Prospect → Won/Lost)
- Probability tracking
- Value calculation

### ⚙️ Settings
- User preferences
- Notification settings
- Accessibility options
- System configuration

## Technical Stack

**Framework:** React 18
**Components:** Momoto UI (Button, TextField, Checkbox, Select, Switch)
**Styling:** 100% token-driven (zero custom CSS)
**State:** React hooks + Context
**Data:** Mock domain objects (no backend)

## What This Demo Does NOT Include

- ❌ Backend integration
- ❌ Real authentication
- ❌ Data persistence
- ❌ Complex table components
- ❌ Advanced data visualization
- ❌ Custom CSS/styling

These are intentionally omitted to focus on **component composition** and **token-driven architecture**.

## Architecture

```
topocho-crm/
├── pages/              # Main views
│   ├── Dashboard.tsx
│   ├── Clients.tsx
│   ├── Opportunities.tsx
│   └── Settings.tsx
├── components/         # Composed components (layout only)
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   └── Header.tsx
├── state/             # Domain data + state
│   ├── types.ts
│   ├── mockData.ts
│   └── useClients.ts
├── tokens/            # Mock tokens for demo
│   └── mockTokens.ts
└── App.tsx            # Main entry
```

## Key Learnings

### Component Reusability

The same `TextField` component handles:
- Search inputs
- Form fields (required, optional)
- Error states
- Disabled states

Without any wrapper logic or custom styling.

### State Management via Core

All visual states (hover, focus, disabled, error) are managed by Core:

```tsx
// NO custom logic needed
<TextField
  value={clientName}
  onChange={setClientName}
  label="Client Name"
  required
  error={errors.name}
  errorMessage="Name is required"
  // All state handling is automatic
/>
```

### Accessibility Without Effort

All components emit proper ARIA:
- Keyboard navigation works automatically
- Screen reader announcements included
- Focus management handled by Core

## Usage

```bash
# From repo root
cd apps/topocho-crm

# Install dependencies (if needed)
npm install

# Run demo
npm run dev
```

## Contract Compliance

This demo **passes all contract rules**:

```bash
npm run verify:contract
```

✅ Zero perceptual logic
✅ Zero hardcoded colors
✅ 100% Core delegation
✅ ARIA compliance

## Future Enhancements (Not in Scope)

- Table component for client lists
- Modal dialogs for confirmations
- Toast notifications for actions
- Tabs for multi-section forms
- Advanced filters with date pickers

These would be added in **FASE 17** (Component Expansion Phase 2).

## Conclusion

**Topocho CRM proves that Momoto UI is production-ready.** The component library enables rapid development of enterprise software without compromising on accessibility, maintainability, or architectural purity.

---

**Built with Momoto UI - Where perceptual intelligence meets architectural purity.**
