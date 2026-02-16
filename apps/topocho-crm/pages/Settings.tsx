/**
 * @fileoverview Settings Page
 *
 * FASE 16: Topocho CRM Demo
 *
 * User settings and preferences.
 *
 * @module apps/topocho-crm/pages/Settings
 * @version 1.0.0
 */

import React from 'react';
import { Card, CardVariant } from '../../../adapters/react/card';
import { Switch } from '../../../adapters/react/switch';
import { Button } from '../../../adapters/react/button';
import type { UserSettings } from '../state/types';
import {
  neutralBg,
  neutralText,
  neutralBorder,
  primaryBg,
  primaryText,
  primaryHoverBg,
  switchTrackBg,
  switchTrackBorder,
  switchThumb,
  switchCheckedTrackBg,
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

interface SettingsProps {
  settings: UserSettings;
  onUpdateNotifications: (updates: Partial<UserSettings['notifications']>) => void;
  onUpdatePreferences: (updates: Partial<UserSettings['preferences']>) => void;
  onUpdateAccessibility: (updates: Partial<UserSettings['accessibility']>) => void;
  onResetSettings: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function Settings({
  settings,
  onUpdateNotifications,
  onUpdatePreferences,
  onUpdateAccessibility,
  onResetSettings,
}: SettingsProps) {
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
          Settings
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
          Manage your preferences and system configuration
        </p>
      </div>

      {/* Notifications Section */}
      <Card variant={CardVariant.ELEVATED}>
        <h2
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            lineHeight: typography.lineHeight.tight,
            margin: `0 0 ${spacing[4]} 0`,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          Notifications
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[2],
            borderTop: `1px solid ${neutralBorder.value.hex}`,
            paddingTop: spacing[4],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.notifications.email}
              onChange={(checked) => onUpdateNotifications({ email: checked })}
              label="Email Notifications"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.notifications.push}
              onChange={(checked) => onUpdateNotifications({ push: checked })}
              label="Push Notifications"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.notifications.sms}
              onChange={(checked) => onUpdateNotifications({ sms: checked })}
              label="SMS Notifications"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>
        </div>
      </Card>

      {/* Preferences Section */}
      <Card variant={CardVariant.ELEVATED}>
        <h2
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            lineHeight: typography.lineHeight.tight,
            margin: `0 0 ${spacing[4]} 0`,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          Preferences
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[2],
            borderTop: `1px solid ${neutralBorder.value.hex}`,
            paddingTop: spacing[4],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.preferences.compactView}
              onChange={(checked) => onUpdatePreferences({ compactView: checked })}
              label="Compact View"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.preferences.showInactiveClients}
              onChange={(checked) => onUpdatePreferences({ showInactiveClients: checked })}
              label="Show Inactive Clients"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.preferences.autoSaveEnabled}
              onChange={(checked) => onUpdatePreferences({ autoSaveEnabled: checked })}
              label="Auto-Save Enabled"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>
        </div>
      </Card>

      {/* Accessibility Section */}
      <Card variant={CardVariant.ELEVATED}>
        <h2
          style={{
            color: neutralText.value.hex,
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.semibold,
            lineHeight: typography.lineHeight.tight,
            margin: `0 0 ${spacing[4]} 0`,
            letterSpacing: typography.letterSpacing.tight,
          }}
        >
          Accessibility
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: spacing[2],
            borderTop: `1px solid ${neutralBorder.value.hex}`,
            paddingTop: spacing[4],
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.accessibility.highContrast}
              onChange={(checked) => onUpdateAccessibility({ highContrast: checked })}
              label="High Contrast Mode"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.accessibility.largeText}
              onChange={(checked) => onUpdateAccessibility({ largeText: checked })}
              label="Large Text"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing[3],
              padding: spacing[3],
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
              isChecked={settings.accessibility.reduceMotion}
              onChange={(checked) => onUpdateAccessibility({ reduceMotion: checked })}
              label="Reduce Motion"
              trackBackgroundColor={switchTrackBg}
              trackBorderColor={switchTrackBorder}
              thumbColor={switchThumb}
              checkedTrackBackgroundColor={switchCheckedTrackBg}
              size="md"
            />
          </div>
        </div>
      </Card>

      {/* Reset Button */}
      <div>
        <Button
          label="Reset to Defaults"
          backgroundColor={neutralBg}
          textColor={neutralText}
          hoverBackgroundColor={primaryBg}
          onClick={onResetSettings}
          size="md"
        />
      </div>
    </div>
  );
}
