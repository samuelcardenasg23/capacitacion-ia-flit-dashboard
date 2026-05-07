import { render, screen } from '@testing-library/react';
import { AnalyticsCharts } from './AnalyticsCharts';
import { mockChartData } from '@/mocks/data';

describe('AnalyticsCharts', () => {
  it('renders both charts titles', () => {
    render(<AnalyticsCharts data={mockChartData} />);

    expect(screen.getByText(/revenue trend/i)).toBeInTheDocument();
    expect(screen.getByText(/active users/i)).toBeInTheDocument();
  });
});
