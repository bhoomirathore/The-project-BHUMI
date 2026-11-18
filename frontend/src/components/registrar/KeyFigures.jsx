import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function KeyFigures({ applications = [], loading = false }) {
  const figures = useMemo(() => {
    const completed = applications.filter(
      (a) => a.applicationStatus === 'COMPLETED'
    ).length;
    const rejected = applications.filter(
      (a) => a.applicationStatus === 'REJECTED'
    ).length;
    const failed = applications.filter(
      (a) => a.applicationStatus === 'FAILED'
    ).length;
    const denom = completed + rejected + failed;

    const result = [];

    if (denom > 0) {
      result.push({
        key: 'approvalRate',
        value: `${Math.round((completed / denom) * 100)}%`,
        label: 'Approval Rate',
      });
      result.push({
        key: 'rejectionRate',
        value: `${Math.round(((rejected + failed) / denom) * 100)}%`,
        label: 'Rejection / Failure Rate',
      });
    }

    const completedWithDates = applications.filter(
      (a) =>
        a.applicationStatus === 'COMPLETED' &&
        a.submittedAt &&
        a.approvedAt
    );
    if (completedWithDates.length > 0) {
      const totalDays = completedWithDates.reduce((sum, a) => {
        const diff =
          (new Date(a.approvedAt).getTime() -
            new Date(a.submittedAt).getTime()) /
          86400000;
        return sum + (isNaN(diff) ? 0 : diff);
      }, 0);
      const avg = totalDays / completedWithDates.length;
      result.push({
        key: 'avgProcessingDays',
        value: `${avg.toFixed(1)}d`,
        label: 'Avg. Processing Time',
      });
    }

    return result;
  }, [applications]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Key Figures</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-20 w-full rounded-md" />
        ) : figures.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Not enough data to compute key figures.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {figures.map((fig) => (
              <div
                key={fig.key}
                className="flex flex-col items-center rounded-lg border bg-muted/40 px-6 py-4"
              >
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {fig.value}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">{fig.label}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default KeyFigures;
