import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'benchmark'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'domain/**/*.ts',
        'application/**/*.ts',
        'infrastructure/**/*.ts',
        'react/**/*.ts',
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.benchmark.ts',
        '**/types/**',
        '**/index.ts',
        'experimental-api.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@domain': resolve(__dirname, './domain'),
      '@application': resolve(__dirname, './application'),
      '@infrastructure': resolve(__dirname, './infrastructure'),
      '@presentation': resolve(__dirname, './react'),
    },
  },
});
