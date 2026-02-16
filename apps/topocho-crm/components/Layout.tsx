/**
 * @fileoverview Main Layout Component
 *
 * FASE 16: Topocho CRM Demo
 *
 * Main layout wrapper with sidebar and header.
 *
 * @module apps/topocho-crm/components/Layout
 * @version 1.0.0
 */

import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { contentBg } from '../tokens/mockTokens';

// ============================================================================
// TYPES
// ============================================================================

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Layout({
  children,
  currentPage,
  onNavigate,
  searchQuery,
  onSearchChange,
}: LayoutProps) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />

        {/* Page Content */}
        <div
          style={{
            flex: 1,
            backgroundColor: contentBg.value.hex,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
