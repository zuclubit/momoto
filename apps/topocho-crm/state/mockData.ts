/**
 * @fileoverview Mock Data for Topocho CRM
 *
 * FASE 16: Topocho CRM Demo
 *
 * Mock domain data for demonstration purposes.
 *
 * @module apps/topocho-crm/state/mockData
 * @version 1.0.0
 */

import type { Client, Opportunity, UserSettings } from './types';

// ============================================================================
// CLIENTS
// ============================================================================

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    category: 'enterprise',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    notes: 'Key decision maker for enterprise solutions',
    isPremium: true,
    marketingConsent: true,
  },
  {
    id: 'client-2',
    name: 'Marcus Johnson',
    email: 'marcus@startupxyz.com',
    phone: '+1 (555) 234-5678',
    company: 'StartupXYZ',
    category: 'startup',
    status: 'active',
    createdAt: new Date('2024-02-20'),
    notes: 'Interested in growth plan',
    isPremium: false,
    marketingConsent: true,
  },
  {
    id: 'client-3',
    name: 'Elena Rodriguez',
    email: 'elena.r@techcorp.io',
    phone: '+1 (555) 345-6789',
    company: 'TechCorp Solutions',
    category: 'smb',
    status: 'active',
    createdAt: new Date('2024-03-10'),
    notes: 'SMB customer, high engagement',
    isPremium: true,
    marketingConsent: false,
  },
  {
    id: 'client-4',
    name: 'David Kim',
    email: 'david@freelancer.com',
    phone: '+1 (555) 456-7890',
    company: 'Freelance Designer',
    category: 'individual',
    status: 'prospect',
    createdAt: new Date('2024-04-05'),
    notes: 'Evaluating individual plan',
    isPremium: false,
    marketingConsent: true,
  },
  {
    id: 'client-5',
    name: 'Amanda Foster',
    email: 'a.foster@globalinc.com',
    phone: '+1 (555) 567-8901',
    company: 'Global Inc',
    category: 'enterprise',
    status: 'inactive',
    createdAt: new Date('2023-11-20'),
    notes: 'Contract ended, potential renewal',
    isPremium: false,
    marketingConsent: true,
  },
];

// ============================================================================
// OPPORTUNITIES
// ============================================================================

export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    title: 'Enterprise License Renewal',
    value: 125000,
    stage: 'negotiation',
    probability: 85,
    expectedCloseDate: new Date('2024-06-30'),
    createdAt: new Date('2024-04-01'),
    notes: 'Negotiating multi-year contract',
    isActive: true,
  },
  {
    id: 'opp-2',
    clientId: 'client-2',
    clientName: 'StartupXYZ',
    title: 'Growth Plan Upgrade',
    value: 25000,
    stage: 'prospect',
    probability: 60,
    expectedCloseDate: new Date('2024-05-15'),
    createdAt: new Date('2024-03-15'),
    notes: 'Interested after free trial',
    isActive: true,
  },
  {
    id: 'opp-3',
    clientId: 'client-3',
    clientName: 'TechCorp Solutions',
    title: 'Additional Licenses',
    value: 45000,
    stage: 'proposal',
    probability: 70,
    expectedCloseDate: new Date('2024-05-30'),
    createdAt: new Date('2024-04-10'),
    notes: 'Team expansion, need 50 more licenses',
    isActive: true,
  },
  {
    id: 'opp-4',
    clientId: 'client-4',
    clientName: 'Freelance Designer',
    title: 'Individual Pro Plan',
    value: 1200,
    stage: 'lead',
    probability: 30,
    expectedCloseDate: new Date('2024-05-10'),
    createdAt: new Date('2024-04-20'),
    notes: 'Evaluating competitors',
    isActive: true,
  },
  {
    id: 'opp-5',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    title: 'Additional Services Package',
    value: 75000,
    stage: 'won',
    probability: 100,
    expectedCloseDate: new Date('2024-03-15'),
    createdAt: new Date('2024-02-01'),
    notes: 'Closed successfully',
    isActive: false,
  },
];

// ============================================================================
// USER SETTINGS
// ============================================================================

export const defaultSettings: UserSettings = {
  notifications: {
    email: true,
    push: false,
    sms: false,
  },
  preferences: {
    compactView: false,
    showInactiveClients: false,
    autoSaveEnabled: true,
  },
  accessibility: {
    highContrast: false,
    largeText: false,
    reduceMotion: false,
  },
};
