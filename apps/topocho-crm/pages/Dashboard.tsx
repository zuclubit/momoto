/**
 * @fileoverview Dashboard Page
 *
 * FASE 16: Topocho CRM Demo
 *
 * Main dashboard with KPIs and system status.
 *
 * @module apps/topocho-crm/pages/Dashboard
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardVariant } from '../../../adapters/react/card';
import { Stat, TrendDirection } from '../../../adapters/react/stat';
import { Switch } from '../../../adapters/react/switch';
import { Select } from '../../../adapters/react/select';
import type { SelectOption } from '../../../adapters/core/select';
import {
  neutralBg,
  neutralText,
  neutralBorder,
  primaryBg,
  primaryText,
  successBg,
  successText,
  warningBg,
  warningText,
  switchTrackBg,
  switchTrackBorder,
  switchThumb,
  switchCheckedTrackBg,
  fieldBg,
  fieldText,
  fieldBorder,
  fieldHoverBorder,
  fieldFocusBorder,
  fieldFocusOutline,
  dropdownBg,
  dropdownBorder,
  dropdownShadow,
  optionText,
  optionHoverBg,
  optionSelectedBg,
  contentBg,
} from '../tokens/mockTokens';
import {
  typography,
  spacing,
  shadows,
  borderRadius,
  transitions,
  formatNumber,
  calculateChange,
  getTrend,
} from '../tokens/designTokens';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardProps {
  totalRevenue: number;
  activeClients: number;
  activeOpportunities: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Dashboard({ totalRevenue, activeClients, activeOpportunities }: DashboardProps) {
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<SelectOption<string> | null>(null);

  const periodOptions: SelectOption<string>[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
  ];

  // Mock previous period data for trend calculation
  const previousRevenue = 68000;
  const previousClients = 3;
  const previousOpportunities = 3;

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
          Dashboard
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
          Overview of your CRM performance
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[6] }}>
        {/* Revenue Card */}
        <Card variant={CardVariant.INTERACTIVE}>
          <Stat
            label="Total Revenue"
            value={formatNumber(totalRevenue)}
            trend={{
              direction: TrendDirection.UP,
              value: calculateChange(previousRevenue, totalRevenue),
              description: 'vs last month',
              color: successText,
            }}
            size="xl"
            labelColor={neutralText}
            valueColor={neutralText}
            helperTextColor={neutralText}
          />
        </Card>

        {/* Clients Card */}
        <Card variant={CardVariant.INTERACTIVE}>
          <Stat
            label="Active Clients"
            value={activeClients}
            trend={{
              direction: TrendDirection.UP,
              value: calculateChange(previousClients, activeClients),
              description: 'vs last month',
              color: successText,
            }}
            size="xl"
            labelColor={neutralText}
            valueColor={neutralText}
            helperTextColor={neutralText}
          />
        </Card>

        {/* Opportunities Card */}
        <Card variant={CardVariant.INTERACTIVE}>
          <Stat
            label="Active Opportunities"
            value={activeOpportunities}
            trend={{
              direction: TrendDirection.UP,
              value: calculateChange(previousOpportunities, activeOpportunities),
              description: 'vs last month',
              color: successText,
            }}
            size="xl"
            labelColor={neutralText}
            valueColor={neutralText}
            helperTextColor={neutralText}
          />
        </Card>
      </div>

      {/* System Controls */}
      <Card variant={CardVariant.ELEVATED}>
        <h2
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            lineHeight: typography.lineHeight.tight,
            margin: `0 0 ${spacing[5]} 0`,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          System Settings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {/* Auto Refresh */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[4],
              borderRadius: borderRadius.md,
              transition: transitions.base,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = neutralBg.value.hex;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Switch
              isChecked={autoRefreshEnabled}
              onChange={setAutoRefreshEnabled}
              label="Auto Refresh"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          {/* Notifications */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[4],
              borderRadius: borderRadius.md,
              transition: transitions.base,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = neutralBg.value.hex;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Switch
              isChecked={notificationsEnabled}
              onChange={setNotificationsEnabled}
              label="Enable Notifications"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          {/* Period Selector */}
          <div style={{ maxWidth: '320px', marginTop: spacing[2] }}>
            <Select
              options={periodOptions}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              label="Report Period"
              placeholder="Select period..."
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
        </div>
      </Card>
    </div>
  );
}
