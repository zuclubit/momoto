/**
 * @fileoverview Settings State Hook
 *
 * FASE 16: Topocho CRM Demo
 *
 * State management for user settings.
 *
 * @module apps/topocho-crm/state/useSettings
 * @version 1.0.0
 */

import { useState } from 'react';
import type { UserSettings } from './types';
import { defaultSettings } from './mockData';

// ============================================================================
// HOOK
// ============================================================================

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  // Update notification settings
  const updateNotifications = (updates: Partial<UserSettings['notifications']>) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  };

  // Update preference settings
  const updatePreferences = (updates: Partial<UserSettings['preferences']>) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
    }));
  };

  // Update accessibility settings
  const updateAccessibility = (updates: Partial<UserSettings['accessibility']>) => {
    setSettings((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...updates },
    }));
  };

  // Reset to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return {
    settings,
    updateNotifications,
    updatePreferences,
    updateAccessibility,
    resetSettings,
  };
}
