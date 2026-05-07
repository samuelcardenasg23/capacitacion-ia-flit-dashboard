
import { Activity } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LogoProps {
  className?: string;
  collapsed?: boolean;
}

export function Logo({ className, collapsed = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2 font-bold text-xl', className)}>
      <div className="bg-primary text-primary-foreground p-1 rounded-md">
        <Activity size={24} />
      </div>
      {!collapsed && <span>Flit Analytics</span>}
    </div>
  );
}
