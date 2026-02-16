import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [],
  },
  resolve: {
    alias: {
      'momoto-wasm': path.resolve(__dirname, '../momoto/crates/momoto-wasm/pkg'),
    },
  },
});
