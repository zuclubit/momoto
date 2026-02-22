# Installation Guide

## Quick Install

```bash
npm install momoto
```

## Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **TypeScript**: >= 5.0.0 (if using TypeScript)

## Framework-Specific Installation

### React

```bash
npm install momoto react@^18
```

### Vue (Coming Soon)

```bash
npm install momoto @momoto/vue
```

### Angular (Coming Soon)

```bash
npm install momoto @momoto/angular
```

## Verify Installation

Create a test file to verify Momoto is working:

```typescript
// test-momoto.ts
import { detectContrastMode, OKLCH } from 'momoto';

const color = OKLCH.fromHex('#3B82F6');
console.log('OKLCH:', color?.l, color?.c, color?.h);

const mode = detectContrastMode('#3B82F6');
console.log('Contrast Mode:', mode);
```

Run it:

```bash
npx tsx test-momoto.ts
```

Expected output:
```
OKLCH: 0.612 0.195 264.05
Contrast Mode: { mode: 'light-content', confidence: 0.87, ... }
```

## Project Setup

### TypeScript Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Module Resolution

Momoto is an **ESM-only** package. Ensure your project supports ES modules:

```json
{
  "type": "module"
}
```

If using CommonJS, you'll need to use dynamic imports:

```javascript
const { detectContrastMode } = await import('momoto');
```

## API Levels

Momoto provides three API levels:

### 1. Public API (Stable)

**Recommended for all users**

```typescript
import { /* ... */ } from 'momoto';
// or
import { /* ... */ } from 'momoto/public-api';
```

SemVer guaranteed. Safe for production.

### 2. Experimental API (Unstable)

**Use with caution**

```typescript
import { /* ... */ } from 'momoto/experimental';
```

Breaking changes may occur between minor versions.

### 3. React Hooks

```typescript
import { useColorIntelligence } from 'momoto/react';
```

## Build Tool Configuration

### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['momoto'],
  },
});
```

### Webpack

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    fullySpecified: false,
  },
};
```

### Next.js

```javascript
// next.config.js
module.exports = {
  transpilePackages: ['momoto'],
};
```

### Remix

```javascript
// remix.config.js
module.exports = {
  serverDependenciesToBundle: ['momoto'],
};
```

## Performance Optimization

### Tree Shaking

Momoto is fully tree-shakeable. Import only what you need:

```typescript
// ✅ Good - only imports what you use
import { detectContrastMode } from 'momoto';

// ❌ Avoid - imports entire library
import * as Momoto from 'momoto';
```

### Code Splitting

For large applications, split Momoto into a separate chunk:

```typescript
// Lazy load Momoto
const loadMomoto = () => import('momoto');

async function analyzeColor(hex: string) {
  const { analyzeBrandColor } = await loadMomoto();
  return analyzeBrandColor(hex);
}
```

## Development vs Production

### Development

```bash
npm install momoto
```

Includes source maps and helpful error messages.

### Production

Momoto automatically optimizes for production when `NODE_ENV=production`:

- Minified output
- Dead code elimination
- Smaller bundle size

## Troubleshooting

### "Cannot find module 'momoto'"

**Solution**: Ensure you're using Node.js >= 18 and npm >= 9.

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
```

### "Module not found: Error: Can't resolve 'momoto/react'"

**Solution**: Install React as a peer dependency:

```bash
npm install react@^18
```

### TypeScript Errors

**Solution**: Ensure `moduleResolution` is set to `bundler` or `node16`:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler"
  }
}
```

### ESM Import Issues

If you see `ERR_REQUIRE_ESM`, your project is using CommonJS. Convert to ESM:

```json
// package.json
{
  "type": "module"
}
```

Or use dynamic imports:

```javascript
const momoto = await import('momoto');
```

## IDE Setup

### VS Code

Install recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

### WebStorm / IntelliJ

Enable TypeScript language service:
`Settings → Languages & Frameworks → TypeScript → Enable TypeScript Language Service`

## Testing

### Vitest

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

### Jest

```javascript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
```

## Update Strategy

### Semantic Versioning

Momoto follows SemVer:

- **Patch** (5.0.x): Bug fixes, no breaking changes
- **Minor** (5.x.0): New features, no breaking changes
- **Major** (x.0.0): Breaking changes

### Upgrade Guide

Before upgrading major versions, review:
- `CHANGELOG.md` - List of changes
- Migration guides in `docs/`

### Stay Updated

```bash
# Check for updates
npm outdated momoto

# Update to latest within semver range
npm update momoto

# Update to latest major version
npm install momoto@latest
```

## Platform-Specific Notes

### Node.js

Momoto works in Node.js >= 18. No browser-specific APIs required.

### Browser

Supported browsers:
- Chrome/Edge >= 90
- Firefox >= 88
- Safari >= 14

### Deno

```typescript
import { detectContrastMode } from 'npm:momoto';
```

### Bun

```bash
bun add momoto
```

## Bundle Size

| Import | Size (minified + gzipped) |
|--------|---------------------------|
| Full library | ~15 KB |
| Public API only | ~12 KB |
| Single function | ~3-5 KB |
| React hook | ~8 KB |

## Next Steps

- [Quick Start Guide](./README.md#quick-start)
- [API Documentation](./API.md)
- [Examples](./docs/examples/)
- [Contributing Guide](./CONTRIBUTING.md)

## Support

- GitHub Issues: [momoto/issues](https://github.com/zuclubit/momoto/issues)
- Discussions: [momoto/discussions](https://github.com/zuclubit/momoto/discussions)

---

**Ready to build?** Check out the [Quick Start Guide](./README.md#quick-start).
