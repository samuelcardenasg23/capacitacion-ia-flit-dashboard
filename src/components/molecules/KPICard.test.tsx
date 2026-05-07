import { render, screen } from '@testing-library/react';
import { KPICard } from './KPICard';
import type { KPIData } from '@/types';

describe('KPICard', () => {
  it('renders data correctly', () => {
    const data: KPIData = {
      id: '1',
      title: 'Total Sales',
      value: '$50,000',
      change: 12.5,
      trend: 'up',
    };

    render(<KPICard data={data} />);

    expect(screen.getByText(/total sales/i)).toBeInTheDocument();
    expect(screen.getByText(/\$50,000/)).toBeInTheDocument();
    expect(screen.getByText(/12\.5% from last month/i)).toBeInTheDocument();
  });

  it('renders negative trend correctly', () => {
    const data: KPIData = {
      id: '2',
      title: 'Bounce Rate',
      value: '45%',
      change: -5.2,
      trend: 'down',
    };

    render(<KPICard data={data} />);

    expect(screen.getByText(/bounce rate/i)).toBeInTheDocument();
    expect(screen.getByText(/5\.2% from last month/i)).toBeInTheDocument();
  });
});
