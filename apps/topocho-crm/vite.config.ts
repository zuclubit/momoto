/**
 * @fileoverview Vite Configuration
 *
 * FASE 16: Topocho CRM Demo
 *
 * Vite configuration for Topocho CRM demo app.
 *
 * @module apps/topocho-crm/vite.config
 * @version 1.0.0
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
