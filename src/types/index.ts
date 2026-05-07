export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
}

export interface KPIData {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  name: string;
  revenue: number;
  users: number;
}

export interface ReportItem {
  id: string;
  date: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  title: string;
}
