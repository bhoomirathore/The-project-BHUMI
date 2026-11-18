import React from 'react';
import { CalendarCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import EmptyState from '@/components/common/EmptyState';

function AppointmentsTimeline({ applications = [], loading = false }) {
  const withAppt = applications
    .filter((a) => !!a.appointment)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : withAppt.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No appointments"
            description="No appointments scheduled for today."
          />
        ) : (
          <ScrollArea className="max-h-56">
            <ol className="relative flex flex-col gap-0 pl-4">
              {withAppt.map((app, idx) => (
                <li key={app.id} className="relative pb-4 last:pb-0">
                  {/* timeline line */}
                  {idx < withAppt.length - 1 && (
                    <span
                      className="absolute left-[-9px] top-3 h-full w-px bg-border"
                      aria-hidden
                    />
                  )}
                  {/* dot */}
                  <span
                    className="absolute left-[-13px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-primary bg-background"
                    aria-hidden
                  />
                  <div className="pl-1">
                    <p className="text-xs font-medium text-foreground leading-snug">
                      {typeof app.appointment === 'string'
                        ? app.appointment
                        : JSON.stringify(app.appointment)}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {app.propertyId && (
                        <span className="font-mono">{app.propertyId}</span>
                      )}
                      {app.propertyId && (app.sellerName || app.buyerName) && ' · '}
                      {app.sellerName ?? '—'} → {app.buyerName ?? '—'}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default AppointmentsTimeline;
