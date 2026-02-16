/**
 * Crystal Card - Example Implementations
 *
 * Real-world card examples for common use cases
 */

import React from 'react';
import { Card, MetricCard } from './Card';

// ============================================================================
// DASHBOARD CARDS
// ============================================================================

/**
 * Dashboard Metric Card with Trend
 */
export const DashboardMetricCard: React.FC<{
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}> = ({ title, value, change, changeType, icon }) => (
  <MetricCard
    title={title}
    value={value}
    change={change}
    changeType={changeType}
    icon={icon}
  />
);

/**
 * Revenue Card Example
 */
export const RevenueCard = () => (
  <DashboardMetricCard
    title="Total Revenue"
    value="$127,540"
    change="+12.5%"
    changeType="positive"
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
  />
);

/**
 * Users Card Example
 */
export const UsersCard = () => (
  <DashboardMetricCard
    title="Active Users"
    value="1,234"
    change="+18.2%"
    changeType="positive"
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
  />
);

/**
 * Orders Card Example
 */
export const OrdersCard = () => (
  <DashboardMetricCard
    title="Orders"
    value="856"
    change="-5.3%"
    changeType="negative"
    icon={
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    }
  />
);

// ============================================================================
// PRODUCT CARDS
// ============================================================================

/**
 * Product Card Example
 */
export const ProductCard: React.FC<{
  image: string;
  title: string;
  price: string;
  rating: number;
  reviews: number;
}> = ({ image, title, price, rating, reviews }) => (
  <Card
    variant="elevated"
    hoverable
    interactive
    padding="none"
    onClick={() => console.log('Product clicked:', title)}
  >
    <div
      style={{
        width: '100%',
        height: '200px',
        background: `url(${image}) center/cover`,
        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
      }}
    />
    <div style={{ padding: 'var(--space-4)' }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>
        {title}
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ color: 'var(--crystal-warning)' }}>
          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </span>
        <span style={{ fontSize: '14px', color: 'var(--crystal-text-secondary)' }}>
          ({reviews})
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--crystal-primary)' }}>
        {price}
      </p>
    </div>
  </Card>
);

// ============================================================================
// USER PROFILE CARDS
// ============================================================================

/**
 * User Profile Card
 */
export const UserProfileCard: React.FC<{
  name: string;
  role: string;
  avatar: string;
  email: string;
  stats: { label: string; value: string }[];
}> = ({ name, role, avatar, email, stats }) => (
  <Card variant="elevated" padding="lg">
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: `url(${avatar}) center/cover`,
        }}
      />
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 600 }}>
          {name}
        </h3>
        <p style={{ margin: '0 0 4px 0', color: 'var(--crystal-text-secondary)' }}>
          {role}
        </p>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--crystal-text-tertiary)' }}>
          {email}
        </p>
      </div>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {stats.map((stat, idx) => (
        <div key={idx} style={{ textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 700 }}>
            {stat.value}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--crystal-text-secondary)' }}>
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  </Card>
);

// ============================================================================
// NOTIFICATION CARDS
// ============================================================================

/**
 * Notification Card
 */
export const NotificationCard: React.FC<{
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
}> = ({ type, title, message, time }) => {
  const colors = {
    info: 'var(--crystal-primary)',
    success: 'var(--crystal-success)',
    warning: 'var(--crystal-warning)',
    error: 'var(--crystal-error)',
  };

  const icons = {
    info: '🔵',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return (
    <Card
      variant="default"
      hoverable
      padding="md"
      style={{ borderLeft: `4px solid ${colors[type]}` }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>{icons[type]}</span>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 600 }}>
            {title}
          </h4>
          <p style={{ margin: '0 0 8px 0', color: 'var(--crystal-text-secondary)' }}>
            {message}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--crystal-text-tertiary)' }}>
            {time}
          </p>
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// STATS CARDS
// ============================================================================

/**
 * Stats Card with Progress
 */
export const StatsCard: React.FC<{
  title: string;
  current: number;
  target: number;
  unit: string;
}> = ({ title, current, target, unit }) => {
  const percentage = Math.round((current / target) * 100);

  return (
    <Card variant="elevated" padding="lg">
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
        {title}
      </h3>

      <div style={{ marginBottom: '12px' }}>
        <span style={{ fontSize: '32px', fontWeight: 700 }}>
          {current.toLocaleString()}
        </span>
        <span style={{ fontSize: '16px', color: 'var(--crystal-text-secondary)', marginLeft: '4px' }}>
          {unit}
        </span>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            width: '100%',
            height: '8px',
            background: 'var(--crystal-border)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              background: 'var(--crystal-primary)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <p style={{ margin: 0, fontSize: '14px', color: 'var(--crystal-text-secondary)' }}>
        {percentage}% of {target.toLocaleString()} {unit} target
      </p>
    </Card>
  );
};

// ============================================================================
// ACTIVITY CARDS
// ============================================================================

/**
 * Activity Card
 */
export const ActivityCard: React.FC<{
  activities: Array<{
    user: string;
    action: string;
    target: string;
    time: string;
  }>;
}> = ({ activities }) => (
  <Card variant="elevated" padding="md">
    <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600 }}>
      Recent Activity
    </h3>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {activities.map((activity, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px',
            background: 'var(--crystal-surface)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--crystal-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {activity.user[0]}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>{activity.user}</strong> {activity.action}{' '}
              <strong>{activity.target}</strong>
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--crystal-text-tertiary)' }}>
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// ============================================================================
// FEATURE CARDS
// ============================================================================

/**
 * Feature Card
 */
export const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
}> = ({ icon, title, description, link }) => (
  <Card
    variant="elevated"
    hoverable
    interactive={!!link}
    padding="lg"
    onClick={link ? () => window.location.href = link : undefined}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--crystal-glass-light)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}
    >
      {icon}
    </div>

    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 600 }}>
      {title}
    </h3>

    <p style={{ margin: '0', color: 'var(--crystal-text-secondary)', lineHeight: 1.6 }}>
      {description}
    </p>

    {link && (
      <div style={{ marginTop: '16px' }}>
        <span style={{ color: 'var(--crystal-primary)', fontSize: '14px', fontWeight: 600 }}>
          Learn more →
        </span>
      </div>
    )}
  </Card>
);
