import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const STATUS_COLORS = {
  COMPLETED: 'hsl(var(--success))',
  UNDER_VERIFICATION: 'hsl(var(--warning))',
  FAILED: 'hsl(var(--destructive))',
  REJECTED: 'hsl(var(--destructive))',
  SUBMITTED: 'hsl(var(--info))',
  APPROVED: 'hsl(var(--primary))',
  PROCESSING: 'hsl(var(--primary))',
};

function colorFor(status) {
  return STATUS_COLORS[status] ?? 'hsl(var(--muted-foreground))';
}

function StatusDonut({ applications = [], loading = false }) {
  const data = useMemo(() => {
    const counts = {};
    for (const app of applications) {
      const s = app.applicationStatus ?? 'UNKNOWN';
      counts[s] = (counts[s] ?? 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [applications]);

  if (loading || applications.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Application Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Application Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={colorFor(entry.name)} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default StatusDonut;
