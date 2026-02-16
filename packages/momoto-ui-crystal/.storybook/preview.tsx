import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/styles/crystal.css';
import '../src/components/Button.css';
import '../src/components/Input.css';
import '../src/components/Card.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={{
          fontFamily: 'var(--font-family)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          letterSpacing: '-0.01em',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'glass-light-surface',
      values: [
        {
          name: 'glass-light-surface',
          value: 'linear-gradient(135deg, #F5F5F7 0%, #FFFFFF 50%, #F0F0F2 100%)',
        },
        {
          name: 'glass-dark-material',
          value: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #1A1A1C 100%)',
        },
        {
          name: 'vibrant-gradient',
          value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
        {
          name: 'aurora-gradient',
          value: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 50%, #667eea 100%)',
        },
        {
          name: 'sunset-gradient',
          value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        },
        {
          name: 'frosted-image',
          value: `
            url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"),
            linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
          `,
        },
        {
          name: 'mesh-gradient',
          value: 'radial-gradient(at 40% 20%, hsla(240,78%,64%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(300,76%,72%,0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(200,85%,68%,0.3) 0px, transparent 50%), radial-gradient(at 80% 50%, hsla(270,82%,70%,0.3) 0px, transparent 50%), radial-gradient(at 0% 100%, hsla(340,100%,76%,0.3) 0px, transparent 50%), radial-gradient(at 80% 100%, hsla(22,100%,77%,0.3) 0px, transparent 50%), radial-gradient(at 0% 0%, hsla(242,100%,70%,0.3) 0px, transparent 50%), linear-gradient(135deg, #F5F5F7 0%, #FFFFFF 100%)',
        },
        {
          name: 'white',
          value: '#FFFFFF',
        },
        {
          name: 'black',
          value: '#000000',
        },
      ],
    },
    layout: 'fullscreen',
  },
};

export default preview;
