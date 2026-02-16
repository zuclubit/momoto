/**
 * @fileoverview Opportunity State Hook
 *
 * FASE 16: Topocho CRM Demo
 *
 * State management for sales opportunities.
 *
 * @module apps/topocho-crm/state/useOpportunities
 * @version 1.0.0
 */

import { useState, useMemo } from 'react';
import type { Opportunity, OpportunityFilters } from './types';
import { mockOpportunities } from './mockData';

// ============================================================================
// HOOK
// ============================================================================

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [filters, setFilters] = useState<OpportunityFilters>({
    stage: 'all',
    minValue: 0,
    searchQuery: '',
  });

  // Filter opportunities based on current filters
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Stage filter
      if (filters.stage !== 'all' && opp.stage !== filters.stage) {
        return false;
      }

      // Min value filter
      if (opp.value < filters.minValue) {
        return false;
      }

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesClient = opp.clientName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesClient) {
          return false;
        }
      }

      return true;
    });
  }, [opportunities, filters]);

  // Calculate total value
  const totalValue = useMemo(() => {
    return filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  }, [filteredOpportunities]);

  // Calculate weighted value (value × probability)
  const weightedValue = useMemo(() => {
    return filteredOpportunities.reduce((sum, opp) => sum + opp.value * (opp.probability / 100), 0);
  }, [filteredOpportunities]);

  // Add opportunity
  const addOpportunity = (opp: Opportunity) => {
    setOpportunities((prev) => [...prev, opp]);
  };

  // Update opportunity
  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities((prev) =>
      prev.map((opp) => (opp.id === id ? { ...opp, ...updates } : opp))
    );
  };

  // Delete opportunity
  const deleteOpportunity = (id: string) => {
    setOpportunities((prev) => prev.filter((opp) => opp.id !== id));
  };

  // Update filters
  const updateFilters = (updates: Partial<OpportunityFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      stage: 'all',
      minValue: 0,
      searchQuery: '',
    });
  };

  return {
    opportunities: filteredOpportunities,
    allOpportunities: opportunities,
    filters,
    totalValue,
    weightedValue,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    updateFilters,
    resetFilters,
  };
}
