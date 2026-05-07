import { Typography } from '@/components/atoms/Typography';
import { Card, CardContent } from '@/components/atoms/Card';

export function Reports() {
  return (
    <div className="space-y-6">
      <Typography variant="h2">Reports</Typography>
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          <Typography variant="p">This is a placeholder page for Reports.</Typography>
          <Typography variant="p">Select an item from the sidebar to navigate.</Typography>
        </CardContent>
      </Card>
    </div>
  );
}
