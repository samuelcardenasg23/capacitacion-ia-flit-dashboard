import { LayoutDashboard, FileText, Settings } from 'lucide-react';
import { Logo } from '../atoms/Logo';
import { NavItem } from '../molecules/NavItem';
import { cn } from '@/utils/cn';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn('flex flex-col w-64 border-r bg-card px-4 py-6', className)}>
      <div className="mb-8 px-2">
        <Logo />
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem to="/reports" icon={<FileText size={20} />} label="Reports" />
        <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
      </nav>
    </aside>
  );
}
