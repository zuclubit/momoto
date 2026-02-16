/**
 * Card Component - Advanced Examples
 *
 * Real-world card implementations
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import {
  RevenueCard,
  UsersCard,
  OrdersCard,
  ProductCard,
  UserProfileCard,
  NotificationCard,
  StatsCard,
  ActivityCard,
  FeatureCard,
} from './Card.examples';

// ============================================================================
// META
// ============================================================================

const meta = {
  title: 'Components/Card/Advanced Examples',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Real-world card examples for common use cases: dashboards, e-commerce, profiles, notifications, and more.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// DASHBOARD EXAMPLES
// ============================================================================

/**
 * Dashboard with Metrics
 */
export const DashboardMetrics: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      <RevenueCard />
      <UsersCard />
      <OrdersCard />
    </div>
  ),
};

/**
 * Complete Dashboard Layout
 */
export const CompleteDashboard: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <RevenueCard />
        <UsersCard />
        <OrdersCard />
      </div>

      {/* Stats and Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <ActivityCard
          activities={[
            { user: 'John Doe', action: 'created', target: 'new order #1234', time: '2 min ago' },
            { user: 'Jane Smith', action: 'updated', target: 'customer profile', time: '15 min ago' },
            { user: 'Mike Johnson', action: 'deleted', target: 'product listing', time: '1 hour ago' },
            { user: 'Sarah Wilson', action: 'approved', target: 'refund request', time: '2 hours ago' },
          ]}
        />
        <StatsCard
          title="Monthly Sales Goal"
          current={8560}
          target={10000}
          unit="sales"
        />
      </div>
    </div>
  ),
};

// ============================================================================
// E-COMMERCE EXAMPLES
// ============================================================================

/**
 * Product Grid
 */
export const ProductGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      <ProductCard
        image="https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Product+1"
        title="Crystal Design System"
        price="$49.99"
        rating={5}
        reviews={124}
      />
      <ProductCard
        image="https://via.placeholder.com/400x300/10B981/FFFFFF?text=Product+2"
        title="UI Component Library"
        price="$79.99"
        rating={4}
        reviews={89}
      />
      <ProductCard
        image="https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Product+3"
        title="Design Tokens Pack"
        price="$29.99"
        rating={5}
        reviews={203}
      />
    </div>
  ),
};

// ============================================================================
// USER PROFILE EXAMPLES
// ============================================================================

/**
 * User Profile
 */
export const UserProfile: Story = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <UserProfileCard
        name="Oscar Valois"
        role="Senior Product Designer"
        avatar="https://via.placeholder.com/128/6366F1/FFFFFF?text=OV"
        email="oscar@example.com"
        stats={[
          { label: 'Projects', value: '42' },
          { label: 'Followers', value: '1.2K' },
          { label: 'Following', value: '234' },
        ]}
      />
    </div>
  ),
};

/**
 * Team Members Grid
 */
export const TeamMembers: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
      <UserProfileCard
        name="Alice Johnson"
        role="Frontend Developer"
        avatar="https://via.placeholder.com/128/EC4899/FFFFFF?text=AJ"
        email="alice@example.com"
        stats={[
          { label: 'Commits', value: '342' },
          { label: 'PRs', value: '89' },
          { label: 'Reviews', value: '156' },
        ]}
      />
      <UserProfileCard
        name="Bob Smith"
        role="Backend Engineer"
        avatar="https://via.placeholder.com/128/8B5CF6/FFFFFF?text=BS"
        email="bob@example.com"
        stats={[
          { label: 'APIs', value: '23' },
          { label: 'Issues', value: '45' },
          { label: 'Tests', value: '891' },
        ]}
      />
    </div>
  ),
};

// ============================================================================
// NOTIFICATION EXAMPLES
// ============================================================================

/**
 * Notification Center
 */
export const NotificationCenter: Story = {
  render: () => (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <NotificationCard
        type="success"
        title="Payment Successful"
        message="Your payment of $49.99 has been processed successfully."
        time="2 minutes ago"
      />
      <NotificationCard
        type="info"
        title="New Message"
        message="You have a new message from Sarah Wilson."
        time="15 minutes ago"
      />
      <NotificationCard
        type="warning"
        title="Low Stock Alert"
        message="Product 'Crystal Design Kit' is running low on stock."
        time="1 hour ago"
      />
      <NotificationCard
        type="error"
        title="Failed Upload"
        message="Failed to upload file 'design-assets.zip'. Please try again."
        time="2 hours ago"
      />
    </div>
  ),
};

// ============================================================================
// STATS EXAMPLES
// ============================================================================

/**
 * Progress Cards
 */
export const ProgressCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
      <StatsCard
        title="Monthly Sales Goal"
        current={8560}
        target={10000}
        unit="sales"
      />
      <StatsCard
        title="New Customers"
        current={342}
        target={500}
        unit="customers"
      />
      <StatsCard
        title="Revenue Target"
        current={127540}
        target={150000}
        unit="USD"
      />
      <StatsCard
        title="Support Tickets"
        current={89}
        target={100}
        unit="tickets"
      />
    </div>
  ),
};

// ============================================================================
// FEATURE EXAMPLES
// ============================================================================

/**
 * Features Grid
 */
export const FeaturesGrid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
      <FeatureCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
              stroke="var(--crystal-primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        }
        title="Lightning Fast"
        description="WASM-powered token derivation provides 15x performance improvement over JavaScript."
        link="#"
      />
      <FeatureCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
              stroke="var(--crystal-success)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        title="Accessible"
        description="WCAG AAA compliance by default with automatic contrast validation and APCA support."
        link="#"
      />
      <FeatureCard
        icon={
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="var(--crystal-warning)"
              strokeWidth="2"
            />
            <path
              d="M12 6v6l4 2"
              stroke="var(--crystal-warning)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        }
        title="Crystal Design"
        description="Apple HIG-inspired glass effects with multi-layer depth and beautiful shadows."
        link="#"
      />
    </div>
  ),
};

// ============================================================================
// MIXED LAYOUTS
// ============================================================================

/**
 * Complex Layout
 */
export const ComplexLayout: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <Card variant="elevated" padding="lg">
          <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 700 }}>
            Welcome back, Oscar! 👋
          </h1>
          <p style={{ margin: 0, color: 'var(--crystal-text-secondary)' }}>
            Here's what's happening with your projects today.
          </p>
        </Card>
        <StatsCard
          title="Today's Progress"
          current={7}
          target={10}
          unit="tasks"
        />
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <RevenueCard />
        <UsersCard />
        <OrdersCard />
        <Card variant="metric" padding="md">
          <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', textTransform: 'uppercase', color: 'var(--crystal-text-secondary)' }}>
            Conversion Rate
          </h3>
          <p style={{ margin: '0', fontSize: '32px', fontWeight: 700 }}>
            3.24%
          </p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: 'var(--crystal-success)' }}>
            ↑ +0.5%
          </p>
        </Card>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <ActivityCard
          activities={[
            { user: 'Sarah', action: 'completed', target: 'Design Review', time: '5 min ago' },
            { user: 'Mike', action: 'started', target: 'Backend API', time: '1 hour ago' },
            { user: 'Alice', action: 'merged', target: 'PR #234', time: '2 hours ago' },
          ]}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <NotificationCard
            type="info"
            title="System Update"
            message="New features available in v2.0"
            time="1 hour ago"
          />
          <NotificationCard
            type="success"
            title="Deployment Complete"
            message="Production deployment finished successfully"
            time="3 hours ago"
          />
        </div>
      </div>
    </div>
  ),
};
