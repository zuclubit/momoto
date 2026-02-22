/**
 * @fileoverview tsup Build Configuration for @zuclubit/momoto-ui
 *
 * Configures the build process for the Color Intelligence Design System.
 * Generates ESM, CJS, and TypeScript declarations for all entry points.
 *
 * @module momoto-ui/tsup.config
 */

import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry points matching package.json exports
  entry: {
    // Main entry
    'index': 'src/index.ts',

    // Domain layer
    'domain/index': 'src/domain/index.ts',

    // Application layer
    'application/index': 'src/application/index.ts',

    // Adapters layer
    'adapters/index': 'src/adapters/index.ts',
    'adapters/react/index': 'src/adapters/react/index.ts',
    'adapters/css/index': 'src/adapters/css/index.ts',
    'adapters/tailwind/index': 'src/adapters/tailwind/index.ts',

    // Infrastructure layer
    'infrastructure/index': 'src/infrastructure/index.ts',
    'infrastructure/audit/index': 'src/infrastructure/audit/index.ts',
    'infrastructure/exporters/index': 'src/infrastructure/exporters/index.ts',

    // Components layer
    'components/index': 'src/components/index.ts',
    'components/primitives/index': 'src/components/primitives/index.ts',
    'components/composed/index': 'src/components/composed/index.ts',

    // Validation layer
    'validation/index': 'src/validation/index.ts',
  },

  // Output formats
  format: ['esm', 'cjs'],

  // Generate TypeScript declarations
  dts: true,

  // Sourcemaps for debugging
  sourcemap: true,

  // Clean output directory before build
  clean: true,

  // Split chunks for better tree-shaking
  splitting: true,

  // Target modern browsers/node
  target: 'es2020',

  // External dependencies (peer deps)
  external: ['react', 'react-dom'],

  // Tree-shake for smaller bundles
  treeshake: true,

  // Minify production builds
  minify: process.env.NODE_ENV === 'production',

  // Output configuration
  outDir: 'dist',

  // Banner for builds
  banner: {
    js: '/* @zuclubit/momoto-ui - Color Intelligence Design System */',
  },
});
