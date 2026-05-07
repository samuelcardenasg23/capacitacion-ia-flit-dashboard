
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import type { KPIData } from '@/types';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/utils/cn';

interface KPICardProps {
  data: KPIData;
}

export function KPICard({ data }: KPICardProps) {
  const isUp = data.trend === 'up';
  const isDown = data.trend === 'down';
  const TrendIcon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.value}</div>
        <p className={cn('text-xs flex items-center mt-1', {
          'text-green-500': isUp,
          'text-red-500': isDown,
          'text-muted-foreground': !isUp && !isDown,
        })}>
          <TrendIcon className="mr-1 h-4 w-4" />
          {Math.abs(data.change)}% from last month
        </p>
      </CardContent>
    </Card>
  );
}
