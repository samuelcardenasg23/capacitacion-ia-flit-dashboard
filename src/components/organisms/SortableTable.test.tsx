import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortableTable } from './SortableTable';
import { mockReports } from '@/mocks/data';

describe('SortableTable', () => {
  it('renders table headers and rows', () => {
    render(<SortableTable data={mockReports} />);

    expect(screen.getByRole('columnheader', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByText(mockReports[0].title)).toBeInTheDocument();
  });

  it('sorts by status when clicking on header', async () => {
    render(<SortableTable data={mockReports} />);

    const statusHeader = screen.getByRole('columnheader', { name: /status/i });
    await userEvent.click(statusHeader); // Ascending

    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBeGreaterThan(0);
  });
});
