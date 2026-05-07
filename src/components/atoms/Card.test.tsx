import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

describe('Card', () => {
  it('renders its children correctly', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText(/card title/i)).toBeInTheDocument();
    expect(screen.getByText(/card content/i)).toBeInTheDocument();
  });
});
