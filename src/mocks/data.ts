import type { KPIData, ChartData, ReportItem } from '@/types';

export const mockKPIs: KPIData[] = [
  { id: '1', title: 'Total Revenue', value: '$45,231.89', change: 20.1, trend: 'up' },
  { id: '2', title: 'Active Users', value: '+2350', change: 180.1, trend: 'up' },
  { id: '3', title: 'Sales', value: '+12,234', change: 19, trend: 'up' },
  { id: '4', title: 'Active Now', value: '573', change: -201, trend: 'down' },
];

export const mockChartData: ChartData[] = [
  { name: 'Jan', revenue: 4000, users: 2400 },
  { name: 'Feb', revenue: 3000, users: 1398 },
  { name: 'Mar', revenue: 2000, users: 9800 },
  { name: 'Apr', revenue: 2780, users: 3908 },
  { name: 'May', revenue: 1890, users: 4800 },
  { name: 'Jun', revenue: 2390, users: 3800 },
  { name: 'Jul', revenue: 3490, users: 4300 },
];

export const mockReports: ReportItem[] = [
  { id: '1', date: '2026-05-01', author: 'Alice Smith', status: 'published', title: 'Q1 Performance' },
  { id: '2', date: '2026-05-03', author: 'Bob Jones', status: 'draft', title: 'User Growth Analysis' },
  { id: '3', date: '2026-04-20', author: 'Charlie Brown', status: 'archived', title: 'Server Costs 2025' },
  { id: '4', date: '2026-05-05', author: 'Alice Smith', status: 'published', title: 'Marketing Campaign ROI' },
];
