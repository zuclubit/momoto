/**
 * @fileoverview Clients Management Page
 *
 * FASE 16: Topocho CRM Demo
 *
 * Client list with filtering and management.
 *
 * @module apps/topocho-crm/pages/Clients
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardVariant } from '../../../adapters/react/card';
import { Button } from '../../../adapters/react/button';
import { TextField } from '../../../adapters/react/textfield';
import { Select } from '../../../adapters/react/select';
import { Checkbox } from '../../../adapters/react/checkbox';
import type { SelectOption } from '../../../adapters/core/select';
import type { Client, ClientStatus, ClientCategory } from '../state/types';
import {
  neutralBg,
  neutralText,
  neutralBorder,
  neutralHoverBg,
  primaryBg,
  primaryText,
  primaryHoverBg,
  fieldBg,
  fieldText,
  fieldBorder,
  fieldPlaceholder,
  fieldHoverBorder,
  fieldFocusBorder,
  fieldFocusOutline,
  labelText,
  helperText,
  dropdownBg,
  dropdownBorder,
  dropdownShadow,
  optionText,
  optionHoverBg,
  optionSelectedBg,
  checkboxBg,
  checkboxBorder,
  checkboxCheck,
  checkboxCheckedBg,
  checkboxCheckedCheck,
} from '../tokens/mockTokens';
import {
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
} from '../tokens/designTokens';

// ============================================================================
// TYPES
// ============================================================================

interface ClientsProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateClient: (id: string, updates: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
  statusFilter: ClientStatus | 'all';
  categoryFilter: ClientCategory | 'all';
  onStatusFilterChange: (status: ClientStatus | 'all') => void;
  onCategoryFilterChange: (category: ClientCategory | 'all') => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Clients({
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  statusFilter,
  categoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
}: ClientsProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formIsPremium, setFormIsPremium] = useState(false);
  const [formMarketingConsent, setFormMarketingConsent] = useState(false);

  // Filter options
  const statusOptions: SelectOption<ClientStatus | 'all'>[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'prospect', label: 'Prospect' },
  ];

  const categoryOptions: SelectOption<ClientCategory | 'all'>[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'smb', label: 'SMB' },
    { value: 'startup', label: 'Startup' },
    { value: 'individual', label: 'Individual' },
  ];

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditing(true);
    setFormName(client.name);
    setFormEmail(client.email);
    setFormPhone(client.phone);
    setFormCompany(client.company);
    setFormNotes(client.notes);
    setFormIsPremium(client.isPremium);
    setFormMarketingConsent(client.marketingConsent);
  };

  const handleCancelEdit = () => {
    setSelectedClient(null);
    setIsEditing(false);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormCompany('');
    setFormNotes('');
    setFormIsPremium(false);
    setFormMarketingConsent(false);
  };

  const handleSaveClient = () => {
    if (selectedClient) {
      onUpdateClient(selectedClient.id, {
        name: formName,
        email: formEmail,
        phone: formPhone,
        company: formCompany,
        notes: formNotes,
        isPremium: formIsPremium,
        marketingConsent: formMarketingConsent,
      });
      handleCancelEdit();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
      {/* Page Title */}
      <div>
        <h1
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize['3xl'],
            fontWeight: typography.fontWeight.bold,
            lineHeight: typography.lineHeight.tight,
            margin: 0,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          Clients
        </h1>
        <p
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize.sm,
            lineHeight: typography.lineHeight.relaxed,
            margin: `${spacing[2]} 0 0 0`,
            opacity: 0.6,
          }}
        >
          Manage your client relationships
        </p>
      </div>

      {/* Filters */}
      <Card variant={CardVariant.ELEVATED} style={{ display: 'flex', gap: spacing[4] }}>
        <div style={{ flex: 1 }}>
          <Select
            options={statusOptions}
            value={statusOptions.find((opt) => opt.value === statusFilter) || null}
            onChange={(opt) => opt && onStatusFilterChange(opt.value)}
            label="Status Filter"
            placeholder="All Statuses"
            backgroundColor={fieldBg}
            textColor={fieldText}
            borderColor={fieldBorder}
            hoverBorderColor={fieldHoverBorder}
            focusBorderColor={fieldFocusBorder}
            focusOutlineColor={fieldFocusOutline}
            dropdownBackgroundColor={dropdownBg}
            dropdownBorderColor={dropdownBorder}
            dropdownShadowColor={dropdownShadow}
            optionTextColor={optionText}
            optionHoverBackgroundColor={optionHoverBg}
            optionSelectedBackgroundColor={optionSelectedBg}
            size="md"
          />
        </div>

        <div style={{ flex: 1 }}>
          <Select
            options={categoryOptions}
            value={categoryOptions.find((opt) => opt.value === categoryFilter) || null}
            onChange={(opt) => opt && onCategoryFilterChange(opt.value)}
            label="Category Filter"
            placeholder="All Categories"
            backgroundColor={fieldBg}
            textColor={fieldText}
            borderColor={fieldBorder}
            hoverBorderColor={fieldHoverBorder}
            focusBorderColor={fieldFocusBorder}
            focusOutlineColor={fieldFocusOutline}
            dropdownBackgroundColor={dropdownBg}
            dropdownBorderColor={dropdownBorder}
            dropdownShadowColor={dropdownShadow}
            optionTextColor={optionText}
            optionHoverBackgroundColor={optionHoverBg}
            optionSelectedBackgroundColor={optionSelectedBg}
            size="md"
          />
        </div>
      </Card>

      {/* Client List */}
      <Card variant={CardVariant.ELEVATED} style={{ overflow: 'hidden', padding: 0 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 120px',
            padding: `${spacing[4]} ${spacing[6]}`,
            borderBottom: `1px solid ${neutralBorder.value.hex}`,
            fontWeight: typography.fontWeight.semibold,
            color: neutralText.value.hex,
            fontSize: typography.fontSize.sm,
            backgroundColor: neutralBg.value.hex,
          }}
        >
          <div>Name</div>
          <div>Company</div>
          <div>Status</div>
          <div>Category</div>
          <div>Actions</div>
        </div>

        {clients.map((client) => (
          <div
            key={client.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 2fr 1fr 1fr 120px',
              padding: `${spacing[4]} ${spacing[6]}`,
              borderBottom: `1px solid ${neutralBorder.value.hex}`,
              color: neutralText.value.hex,
              fontSize: typography.fontSize.sm,
              backgroundColor:
                selectedClient?.id === client.id
                  ? neutralHoverBg.value.hex
                  : 'transparent',
              transition: transitions.base,
              cursor: 'default',
            }}
            onMouseEnter={(e) => {
              if (selectedClient?.id !== client.id) {
                e.currentTarget.style.backgroundColor = neutralBg.value.hex;
              }
            }}
            onMouseLeave={(e) => {
              if (selectedClient?.id !== client.id) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div style={{ fontWeight: typography.fontWeight.medium }}>{client.name}</div>
            <div>{client.company}</div>
            <div style={{ textTransform: 'capitalize', opacity: 0.7 }}>{client.status}</div>
            <div style={{ textTransform: 'capitalize', opacity: 0.7 }}>{client.category}</div>
            <div>
              <Button
                label="Edit"
                backgroundColor={primaryBg}
                textColor={primaryText}
                hoverBackgroundColor={primaryHoverBg}
                onClick={() => handleEditClient(client)}
                size="sm"
              />
            </div>
          </div>
        ))}

        {clients.length === 0 && (
          <div
            style={{
              padding: `${spacing[12]} ${spacing[6]}`,
              textAlign: 'center',
              color: neutralText.value.hex,
              fontSize: typography.fontSize.sm,
              opacity: 0.5,
            }}
          >
            No clients found
          </div>
        )}
      </Card>

      {/* Edit Form */}
      {isEditing && selectedClient && (
        <Card variant={CardVariant.ELEVATED}>
          <h2
            style={{
              color: neutralText.value.hex,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              lineHeight: typography.lineHeight.tight,
              margin: `0 0 ${spacing[6]} 0`,
              letterSpacing: typography.letterSpacing.tight,
            }}
          >
            Edit Client
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
              <TextField
                value={formName}
                onChange={setFormName}
                label="Name"
                required
                backgroundColor={fieldBg}
                textColor={fieldText}
                borderColor={fieldBorder}
                placeholderColor={fieldPlaceholder}
                hoverBorderColor={fieldHoverBorder}
                focusBorderColor={fieldFocusBorder}
                focusOutlineColor={fieldFocusOutline}
                labelColor={labelText}
                helperTextColor={helperText}
                size="md"
              />

              <TextField
                value={formEmail}
                onChange={setFormEmail}
                label="Email"
                required
                backgroundColor={fieldBg}
                textColor={fieldText}
                borderColor={fieldBorder}
                placeholderColor={fieldPlaceholder}
                hoverBorderColor={fieldHoverBorder}
                focusBorderColor={fieldFocusBorder}
                focusOutlineColor={fieldFocusOutline}
                labelColor={labelText}
                helperTextColor={helperText}
                size="md"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
              <TextField
                value={formPhone}
                onChange={setFormPhone}
                label="Phone"
                backgroundColor={fieldBg}
                textColor={fieldText}
                borderColor={fieldBorder}
                placeholderColor={fieldPlaceholder}
                hoverBorderColor={fieldHoverBorder}
                focusBorderColor={fieldFocusBorder}
                focusOutlineColor={fieldFocusOutline}
                labelColor={labelText}
                helperTextColor={helperText}
                size="md"
              />

              <TextField
                value={formCompany}
                onChange={setFormCompany}
                label="Company"
                backgroundColor={fieldBg}
                textColor={fieldText}
                borderColor={fieldBorder}
                placeholderColor={fieldPlaceholder}
                hoverBorderColor={fieldHoverBorder}
                focusBorderColor={fieldFocusBorder}
                focusOutlineColor={fieldFocusOutline}
                labelColor={labelText}
                helperTextColor={helperText}
                size="md"
              />
            </div>

            <TextField
              value={formNotes}
              onChange={setFormNotes}
              label="Notes"
              helperText="Additional information about this client"
              backgroundColor={fieldBg}
              textColor={fieldText}
              borderColor={fieldBorder}
              placeholderColor={fieldPlaceholder}
              hoverBorderColor={fieldHoverBorder}
              focusBorderColor={fieldFocusBorder}
              focusOutlineColor={fieldFocusOutline}
              labelColor={labelText}
              helperTextColor={helperText}
              size="md"
            />

            <div style={{ display: 'flex', gap: spacing[6] }}>
              <Checkbox
                isChecked={formIsPremium}
                onChange={setFormIsPremium}
                label="Premium Client"
                backgroundColor={checkboxBg}
                borderColor={checkboxBorder}
                checkColor={checkboxCheck}
                checkedBackgroundColor={checkboxCheckedBg}
                checkedCheckColor={checkboxCheckedCheck}
                size="md"
              />

              <Checkbox
                isChecked={formMarketingConsent}
                onChange={setFormMarketingConsent}
                label="Marketing Consent"
                backgroundColor={checkboxBg}
                borderColor={checkboxBorder}
                checkColor={checkboxCheck}
                checkedBackgroundColor={checkboxCheckedBg}
                checkedCheckColor={checkboxCheckedCheck}
                size="md"
              />
            </div>

            <div style={{ display: 'flex', gap: spacing[3], marginTop: spacing[2] }}>
              <Button
                label="Save Changes"
                backgroundColor={primaryBg}
                textColor={primaryText}
                hoverBackgroundColor={primaryHoverBg}
                onClick={handleSaveClient}
                size="md"
              />

              <Button
                label="Cancel"
                backgroundColor={neutralBg}
                textColor={neutralText}
                hoverBackgroundColor={neutralHoverBg}
                onClick={handleCancelEdit}
                size="md"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
