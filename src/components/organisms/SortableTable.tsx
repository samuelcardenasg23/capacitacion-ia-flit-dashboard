import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/Card';
import type { ReportItem } from '@/types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SortableTableProps {
  data: ReportItem[];
}

type SortKey = keyof ReportItem;
type SortOrder = 'asc' | 'desc';

export function SortableTable({ data }: SortableTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">Title {getSortIcon('title')}</div>
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center">Author {getSortIcon('author')}</div>
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">Status {getSortIcon('status')}</div>
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">Date {getSortIcon('date')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle font-medium">{item.title}</td>
                  <td className="p-4 align-middle">{item.author}</td>
                  <td className="p-4 align-middle">
                    <span
                      className={cn('px-2 py-1 rounded-full text-xs font-semibold', {
                        'bg-green-100 text-green-800': item.status === 'published',
                        'bg-yellow-100 text-yellow-800': item.status === 'draft',
                        'bg-gray-100 text-gray-800': item.status === 'archived',
                      })}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 align-middle">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
