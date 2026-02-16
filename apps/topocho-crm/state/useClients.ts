/**
 * @fileoverview Client State Hook
 *
 * FASE 16: Topocho CRM Demo
 *
 * State management for CRM clients.
 *
 * @module apps/topocho-crm/state/useClients
 * @version 1.0.0
 */

import { useState, useMemo } from 'react';
import type { Client, ClientFilters } from './types';
import { mockClients } from './mockData';

// ============================================================================
// HOOK
// ============================================================================

export function useClients() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [filters, setFilters] = useState<ClientFilters>({
    status: 'all',
    category: 'all',
    searchQuery: '',
  });

  // Filter clients based on current filters
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Status filter
      if (filters.status !== 'all' && client.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && client.category !== filters.category) {
        return false;
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = client.name.toLowerCase().includes(query);
        const matchesEmail = client.email.toLowerCase().includes(query);
        const matchesCompany = client.company.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesCompany) {
          return false;
        }
      }

      return true;
    });
  }, [clients, filters]);

  // Add client
  const addClient = (client: Client) => {
    setClients((prev) => [...prev, client]);
  };

  // Update client
  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, ...updates } : client))
    );
  };

  // Delete client
  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  // Update filters
  const updateFilters = (updates: Partial<ClientFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      searchQuery: '',
    });
  };

  return {
    clients: filteredClients,
    allClients: clients,
    filters,
    addClient,
    updateClient,
    deleteClient,
    updateFilters,
    resetFilters,
  };
}
