/**
 * @fileoverview Topocho CRM Application
 *
 * FASE 16: Topocho CRM Demo
 *
 * Main application entry point for Topocho CRM.
 * Built exclusively with Momoto UI components.
 *
 * @module apps/topocho-crm/App
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Opportunities } from './pages/Opportunities';
import { Settings } from './pages/Settings';
import { Playground } from './pages/Playground';
import { useClients } from './state/useClients';
import { useOpportunities } from './state/useOpportunities';
import { useSettings } from './state/useSettings';

// ============================================================================
// TYPES
// ============================================================================

type Page = 'dashboard' | 'clients' | 'opportunities' | 'settings' | 'playground';

// ============================================================================
// COMPONENT
// ============================================================================

export function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [globalSearch, setGlobalSearch] = useState('');

  // State hooks
  const {
    clients,
    allClients,
    filters: clientFilters,
    addClient,
    updateClient,
    deleteClient,
    updateFilters: updateClientFilters,
  } = useClients();

  const {
    opportunities,
    allOpportunities,
    filters: oppFilters,
    totalValue,
    weightedValue,
    updateOpportunity,
    updateFilters: updateOppFilters,
  } = useOpportunities();

  const {
    settings,
    updateNotifications,
    updatePreferences,
    updateAccessibility,
    resetSettings,
  } = useSettings();

  // Calculate dashboard metrics
  const activeClients = allClients.filter((c) => c.status === 'active').length;
  const activeOpps = allOpportunities.filter((o) => o.isActive).length;
  const totalRevenue = allOpportunities
    .filter((o) => o.stage === 'won')
    .reduce((sum, o) => sum + o.value, 0);

  // Apply global search to clients
  const filteredClients = globalSearch
    ? clients.filter((client) => {
        const query = globalSearch.toLowerCase();
        return (
          client.name.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query) ||
          client.company.toLowerCase().includes(query)
        );
      })
    : clients;

  // Apply global search to opportunities
  const filteredOpportunities = globalSearch
    ? opportunities.filter((opp) => {
        const query = globalSearch.toLowerCase();
        return (
          opp.title.toLowerCase().includes(query) ||
          opp.clientName.toLowerCase().includes(query)
        );
      })
    : opportunities;

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            totalRevenue={totalRevenue}
            activeClients={activeClients}
            activeOpportunities={activeOpps}
          />
        );

      case 'clients':
        return (
          <Clients
            clients={filteredClients}
            onAddClient={addClient}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
            statusFilter={clientFilters.status}
            categoryFilter={clientFilters.category}
            onStatusFilterChange={(status) => updateClientFilters({ status })}
            onCategoryFilterChange={(category) => updateClientFilters({ category })}
          />
        );

      case 'opportunities':
        return (
          <Opportunities
            opportunities={filteredOpportunities}
            onUpdateOpportunity={updateOpportunity}
            stageFilter={oppFilters.stage}
            onStageFilterChange={(stage) => updateOppFilters({ stage })}
            totalValue={totalValue}
            weightedValue={weightedValue}
          />
        );

      case 'settings':
        return (
          <Settings
            settings={settings}
            onUpdateNotifications={updateNotifications}
            onUpdatePreferences={updatePreferences}
            onUpdateAccessibility={updateAccessibility}
            onResetSettings={resetSettings}
          />
        );

      case 'playground':
        return <Playground />;

      default:
        return null;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onNavigate={(page) => setCurrentPage(page as Page)}
      searchQuery={globalSearch}
      onSearchChange={setGlobalSearch}
    >
      {renderPage()}
    </Layout>
  );
}

export default App;
