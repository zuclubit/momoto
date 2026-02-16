/**
 * @fileoverview Header Component
 *
 * FASE 16: Topocho CRM Demo
 *
 * Top header with search using ONLY Momoto UI components.
 *
 * @module apps/topocho-crm/components/Header
 * @version 1.0.0
 */

import React from 'react';
import { TextField } from '../../../adapters/react/textfield';
import {
  headerBg,
  headerBorder,
  fieldBg,
  fieldText,
  fieldBorder,
  fieldPlaceholder,
  fieldHoverBorder,
  fieldFocusBorder,
  fieldFocusOutline,
} from '../tokens/mockTokens';
import { typography, spacing } from '../tokens/designTokens';

// ============================================================================
// TYPES
// ============================================================================

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  return (
    <div
      style={{
        height: '64px',
        backgroundColor: headerBg.value.hex,
        borderBottom: `1px solid ${headerBorder.value.hex}`,
        padding: `0 ${spacing[6]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Search */}
      <div style={{ width: '400px' }}>
        <TextField
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search clients, opportunities..."
          backgroundColor={fieldBg}
          textColor={fieldText}
          borderColor={fieldBorder}
          placeholderColor={fieldPlaceholder}
          hoverBorderColor={fieldHoverBorder}
          focusBorderColor={fieldFocusBorder}
          focusOutlineColor={fieldFocusOutline}
          size="md"
        />
      </div>

      {/* User Info */}
      <div
        style={{
          color: fieldText.value.hex,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.medium,
          lineHeight: typography.lineHeight.normal,
        }}
      >
        Demo User
      </div>
    </div>
  );
}
