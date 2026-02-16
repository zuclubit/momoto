/**
 * @fileoverview Topocho CRM Entry Point
 *
 * FASE 16: Topocho CRM Demo
 *
 * React entry point for Topocho CRM application.
 *
 * @module apps/topocho-crm/index
 * @version 1.0.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
