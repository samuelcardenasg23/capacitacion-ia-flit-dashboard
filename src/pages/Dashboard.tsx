import { Typography } from '@/components/atoms/Typography';
import { KPICard } from '@/components/molecules/KPICard';
import { AnalyticsCharts } from '@/components/organisms/AnalyticsCharts';
import { SortableTable } from '@/components/organisms/SortableTable';
import { mockKPIs, mockChartData, mockReports } from '@/mocks/data';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <Typography variant="h2">Dashboard</Typography>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.id} data={kpi} />
        ))}
      </div>

      <AnalyticsCharts data={mockChartData} />

      <SortableTable data={mockReports} />
    </div>
  );
}
