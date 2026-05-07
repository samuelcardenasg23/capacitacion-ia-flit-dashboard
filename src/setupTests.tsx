import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

afterEach(() => {
  cleanup();
});

// Mock Recharts to avoid jsdom rendering issues with SVG/Canvas
vi.mock('recharts', async () => {
  const OriginalRechartsModule = await vi.importActual('recharts');

  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
      React.createElement('div', { style: { width: 800, height: 800 } }, children),
  };
});
