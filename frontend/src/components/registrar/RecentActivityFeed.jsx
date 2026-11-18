import React, { useMemo } from 'react';
import {
  CheckCircle2,
  Send,
  XCircle,
  Clock,
  Link2,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/common/EmptyState';

function ageStr(ts) {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  if (isNaN(diff) || diff < 0) return '';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  return `${days}d ago`;
}

function deriveEvents(applications, transactions) {
  const events = [];

  for (const app of applications) {
    if (app.submittedAt) {
      events.push({
        id: `app-submitted-${app.id}`,
        ts: new Date(app.submittedAt).getTime(),
        label: `${app.id} submitted`,
        icon: Send,
        dotClass: 'bg-primary',
      });
    }
    if (app.approvedAt) {
      events.push({
        id: `app-approved-${app.id}`,
        ts: new Date(app.approvedAt).getTime(),
        label: `${app.id} approved`,
        icon: CheckCircle2,
        dotClass: 'bg-success',
      });
    }
    if (app.applicationStatus === 'REJECTED' || app.applicationStatus === 'FAILED') {
      events.push({
        id: `app-rejected-${app.id}`,
        ts: app.submittedAt ? new Date(app.submittedAt).getTime() : Date.now(),
        label: `${app.id} ${app.applicationStatus.toLowerCase()}`,
        icon: XCircle,
        dotClass: 'bg-destructive',
      });
    }
    if (app.applicationStatus === 'COMPLETED' && !app.approvedAt) {
      events.push({
        id: `app-completed-${app.id}`,
        ts: app.submittedAt ? new Date(app.submittedAt).getTime() : Date.now(),
        label: `${app.id} completed`,
        icon: CheckCircle2,
        dotClass: 'bg-success',
      });
    }
  }

  for (const tx of transactions) {
    if (tx.status === 'CONFIRMED' || tx.status === 'SYNCED') {
      events.push({
        id: `tx-confirmed-${tx.txHash ?? tx.applicationId}`,
        ts: tx.submittedAt ? new Date(tx.submittedAt).getTime() : Date.now(),
        label: `TX confirmed for ${tx.applicationId ?? '—'}`,
        icon: Link2,
        dotClass: 'bg-success',
      });
    } else if (tx.status === 'FAILED' || tx.status === 'SYNC_FAILED') {
      events.push({
        id: `tx-failed-${tx.txHash ?? tx.applicationId}`,
        ts: tx.submittedAt ? new Date(tx.submittedAt).getTime() : Date.now(),
        label: `TX failed for ${tx.applicationId ?? '—'}`,
        icon: XCircle,
        dotClass: 'bg-destructive',
      });
    }
  }

  return events
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 5);
}

function RecentActivityFeed({ applications = [], transactions = [], loading = false }) {
  const events = useMemo(
    () => deriveEvents(applications, transactions),
    [applications, transactions]
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No recent activity"
            description="Activity will appear here as applications are processed."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((ev) => {
              const Icon = ev.icon;
              return (
                <li key={ev.id} className="flex items-center gap-3">
                  <span
                    className={`inline-flex h-2 w-2 shrink-0 rounded-full ${ev.dotClass}`}
                    aria-hidden
                  />
                  <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-xs text-foreground">{ev.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {ageStr(ev.ts)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivityFeed;
