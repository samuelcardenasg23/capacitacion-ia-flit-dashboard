import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard', () => {
  it('renders KPIs and Charts', () => {
    render(<Dashboard />);

    // Check main title (h2 from Typography variant="h2")
    expect(screen.getByRole('heading', { level: 2, name: /dashboard/i })).toBeInTheDocument();

    // Check KPI cards (we know there are 4 from the mocks)
    expect(screen.getByText(/total revenue/i)).toBeInTheDocument();

    // Check charts
    expect(screen.getByText(/revenue trend/i)).toBeInTheDocument();
    // "Active Users" appears in both KPI card and chart title
    expect(screen.getAllByText(/active users/i).length).toBeGreaterThanOrEqual(1);

    // Check table
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
