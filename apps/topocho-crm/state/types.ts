/**
 * @fileoverview Topocho CRM Domain Types
 *
 * FASE 16: Topocho CRM Demo
 *
 * Domain types for CRM entities.
 *
 * @module apps/topocho-crm/state/types
 * @version 1.0.0
 */

// ============================================================================
// CLIENT
// ============================================================================

export type ClientStatus = 'active' | 'inactive' | 'prospect';
export type ClientCategory = 'enterprise' | 'smb' | 'startup' | 'individual';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  category: ClientCategory;
  status: ClientStatus;
  createdAt: Date;
  notes: string;
  isPremium: boolean;
  marketingConsent: boolean;
}

// ============================================================================
// OPPORTUNITY
// ============================================================================

export type OpportunityStage = 'lead' | 'prospect' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Opportunity {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  value: number;
  stage: OpportunityStage;
  probability: number; // 0-100
  expectedCloseDate: Date;
  createdAt: Date;
  notes: string;
  isActive: boolean;
}

// ============================================================================
// SETTINGS
// ============================================================================

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  preferences: {
    compactView: boolean;
    showInactiveClients: boolean;
    autoSaveEnabled: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reduceMotion: boolean;
  };
}

// ============================================================================
// FILTERS
// ============================================================================

export interface ClientFilters {
  status: ClientStatus | 'all';
  category: ClientCategory | 'all';
  searchQuery: string;
}

export interface OpportunityFilters {
  stage: OpportunityStage | 'all';
  minValue: number;
  searchQuery: string;
}
