/**
 * @fileoverview Sidebar Navigation Component
 *
 * FASE 16: Topocho CRM Demo
 *
 * Sidebar navigation using ONLY Momoto UI components.
 *
 * @module apps/topocho-crm/components/Sidebar
 * @version 1.0.0
 */

import React from 'react';
import { Button } from '../../../adapters/react/button';
import { sidebarBg, sidebarText, sidebarHoverBg, neutralBorder } from '../tokens/mockTokens';
import { typography, spacing } from '../tokens/designTokens';

// ============================================================================
// TYPES
// ============================================================================

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'clients', label: 'Clients' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'settings', label: 'Settings' },
    { id: 'playground', label: 'Playground' },
  ];

  return (
    <div
      style={{
        width: '220px',
        height: '100vh',
        backgroundColor: sidebarBg.value.hex,
        borderRight: `1px solid ${neutralBorder.value.hex}`,
        padding: `${spacing[6]} ${spacing[4]}`,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[1],
      }}
    >
      {/* Logo */}
      <div
        style={{
          color: sidebarText.value.hex,
          fontSize: typography.fontSize.xl,
          fontWeight: typography.fontWeight.bold,
          lineHeight: typography.lineHeight.tight,
          letterSpacing: typography.letterSpacing.tight,
          marginBottom: spacing[8],
          paddingLeft: spacing[3],
        }}
      >
        Topocho CRM
      </div>

      {/* Navigation */}
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <Button
            key={item.id}
            label={item.label}
            backgroundColor={isActive ? sidebarHoverBg : sidebarBg}
            textColor={sidebarText}
            hoverBackgroundColor={sidebarHoverBg}
            onClick={() => onNavigate(item.id)}
            size="md"
            fullWidth
            style={{
              justifyContent: 'flex-start',
              paddingLeft: spacing[3],
              fontWeight: isActive ? typography.fontWeight.semibold : typography.fontWeight.normal,
            }}
          />
        );
      })}
    </div>
  );
}
