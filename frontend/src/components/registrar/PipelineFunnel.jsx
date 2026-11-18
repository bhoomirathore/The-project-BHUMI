import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const STAGES = [
  'SUBMITTED',
  'UNDER_VERIFICATION',
  'APPROVED',
  'PROCESSING',
  'COMPLETED',
];

const STAGE_LABELS = {
  SUBMITTED: 'Submitted',
  UNDER_VERIFICATION: 'Under Verification',
  APPROVED: 'Approved',
  PROCESSING: 'Processing',
  COMPLETED: 'Completed',
};

function PipelineFunnel({ applications = [], loading = false }) {
  const counts = useMemo(() => {
    const c = {};
    for (const stage of STAGES) c[stage] = 0;
    for (const app of applications) {
      if (STAGES.includes(app.applicationStatus)) {
        c[app.applicationStatus] += 1;
      }
    }
    return c;
  }, [applications]);

  const maxCount = Math.max(...Object.values(counts), 1);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Application Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {STAGES.map((stage) => {
              const count = counts[stage];
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={stage} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-sm text-muted-foreground">
                    {STAGE_LABELS[stage]}
                  </span>
                  <div className="flex-1">
                    <Progress value={pct} className="h-2" />
                  </div>
                  <span className="w-6 shrink-0 text-right font-mono text-sm font-semibold text-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PipelineFunnel;
