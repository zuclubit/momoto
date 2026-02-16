# 🔍 Momoto UI Contract Validation Engine

## Overview

The Contract Validation Engine enforces the architectural contract of Momoto UI:

> **"Momoto decide, momoto-ui ejecuta."**

This automated validation ensures that:
- All perceptual decisions come from Momoto WASM
- Adapters are thin wrappers with zero logic
- All colors come from EnrichedToken
- WCAG 2.2 AA compliance is maintained

## Usage

```bash
npm run verify:contract
```

This command:
1. Analyzes all adapter files (React, Vue, Svelte, Angular)
2. Checks compliance with 4 core rules
3. Reports violations
4. Exits with error code if violations found

## Validation Rules

### Rule 1: No Perceptual Logic

**Forbidden:**
- Color calculations (`lighten`, `darken`, `mix`, etc.)
- Perceptual checks (`isDark`, `isLight`)
- Contrast calculations
- Manual state-based styling

**Example Violation:**
```typescript
// ❌ FORBIDDEN
const buttonColor = isDark(backgroundColor)
  ? lighten(backgroundColor, 0.2)
  : darken(backgroundColor, 0.2);
```

**Correct:**
```typescript
// ✅ CORRECT
const buttonOutput = ButtonCore.processButton({
  tokens: { backgroundColor, textColor, ... },
  // ...
});
```

### Rule 2: Token-Only Colors

**Forbidden:**
- Hardcoded hex values (`#FF0000`)
- RGB/RGBA/HSL/HSLA values
- CSS variables (`var(--custom-color)`)

**Example Violation:**
```typescript
// ❌ FORBIDDEN
const style = {
  backgroundColor: '#3B82F6',
  color: 'rgb(255, 255, 255)'
};
```

**Correct:**
```typescript
// ✅ CORRECT
const style = {
  backgroundColor: resolvedTokens.backgroundColor.value.hex,
  color: resolvedTokens.textColor.value.hex
};
```

### Rule 3: Core Delegation

**Required:**
- Import corresponding Core class
- Call `Core.process*()` method
- No logic duplication

**Example Violation:**
```typescript
// ❌ FORBIDDEN
const buttonStyle = disabled
  ? { backgroundColor: disabledBg, color: disabledText }
  : { backgroundColor: normalBg, color: normalText };
```

**Correct:**
```typescript
// ✅ CORRECT
const buttonOutput = useMemo(
  () => ButtonCore.processButton({ tokens, disabled, ... }),
  [tokens, disabled, ...]
);
```

### Rule 4: ARIA Compliance

**Required:**
- Use `Core.generateARIA()`
- Access `ariaAttrs` from Core output
- No manual ARIA definitions

**Example Violation:**
```typescript
// ❌ FORBIDDEN
<button aria-label="Close" aria-disabled={disabled}>
```

**Correct:**
```typescript
// ✅ CORRECT
<button
  aria-label={buttonOutput.ariaAttrs['aria-label']}
  aria-disabled={buttonOutput.ariaAttrs['aria-disabled']}
>
```

## Output Example

### Success

```
🔍 Momoto UI Contract Validation Engine

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Found 65 adapter files to validate

✓ Analyzing 52 TypeScript files

Running validation rules...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ CONTRACT VERIFIED - All checks passed

   Components: 5
   Frameworks: 4
   Violations: 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Failure

```
🔍 Momoto UI Contract Validation Engine

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Found 65 adapter files to validate

✓ Analyzing 52 TypeScript files

Running validation rules...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CONTRACT VIOLATIONS DETECTED:

📄 adapters/react/button/Button.tsx
   ❌ [no-perceptual-logic] Forbidden perceptual function: isDark():45
      💡 Use tokens from Core instead of calculating colors
   ❌ [token-only-colors] Hardcoded hex color detected: #FF0000:78
      💡 Use EnrichedToken.value.hex instead

📄 adapters/vue/checkbox/Checkbox.vue
   ⚠️  [core-delegation] Possible manual state determination detected:32
      💡 Use Core.determineState() instead of manual conditionals

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Summary: 2 error(s), 1 warning(s)

❌ CONTRACT VERIFICATION FAILED
```

## CI Integration

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Verify Contract Compliance
  run: npm run verify:contract
```

The command will exit with code 1 if violations are found, failing the build.

## Architecture

```
scripts/verify-contract/
├── index.ts              # Main entry point
├── reporter.ts           # Violation reporting
├── rules/
│   ├── no-perceptual-logic.ts    # Rule 1
│   ├── token-only-colors.ts      # Rule 2
│   ├── core-delegation.ts        # Rule 3
│   └── aria-compliance.ts        # Rule 4
└── README.md
```

## Extending

To add new rules:

1. Create `rules/your-rule.ts`
2. Export a validation function:
   ```typescript
   export function validateYourRule(sourceFile: SourceFile): Violation[]
   ```
3. Import and call in `index.ts`

## Technical Details

- **Parser**: Uses `ts-morph` for TypeScript AST analysis
- **Languages**: Analyzes TypeScript, TSX files (Vue/Svelte skipped for now)
- **Scope**: Validates adapter files only (skips Core, types, index files)
- **Performance**: ~1-2 seconds for full validation

## Philosophy

The validation engine embodies Momoto UI's core principle:

> The contract is not optional. It is enforced.

By making violations fail the build, we ensure that the architectural purity of the system is maintained across all contributions and over time.
