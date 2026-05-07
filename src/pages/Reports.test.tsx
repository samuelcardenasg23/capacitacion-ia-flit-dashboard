import { render, screen } from '@testing-library/react';
import { Reports } from './Reports';

describe('Reports', () => {
  it('renders correctly', () => {
    render(<Reports />);

    expect(screen.getByRole('heading', { level: 2, name: /reports/i })).toBeInTheDocument();
    expect(screen.getByText(/this is a placeholder page for reports/i)).toBeInTheDocument();
  });
});
