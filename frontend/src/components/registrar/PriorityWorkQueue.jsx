import React from 'react';
import { Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/common/EmptyState';
import TransactionStatusPill from '@/components/TransactionStatusPill';

function ageStr(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (isNaN(diff) || diff < 0) return '';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(diff / 86400000);
  return `${days}d ago`;
}

const URGENT_STATUSES = new Set(['FAILED', 'SYNC_FAILED']);

function PriorityWorkQueue({ applications = [], loading = false, navigate }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Priority Work Queue</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const sorted = [...applications]
    .filter(Boolean)
    .sort((a, b) => {
      const aUrgent =
        URGENT_STATUSES.has(a.applicationStatus) ||
        URGENT_STATUSES.has(a.blockchainStatus);
      const bUrgent =
        URGENT_STATUSES.has(b.applicationStatus) ||
        URGENT_STATUSES.has(b.blockchainStatus);
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return aTime - bTime;
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Priority Work Queue</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sorted.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Queue is clear"
            description="No applications need attention."
          />
        ) : (
          sorted.map((app) => (
            <div
              key={app.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/authority/applications/${app.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/authority/applications/${app.id}`);
                }
              }}
              className="card-interactive cursor-pointer rounded-lg border bg-card p-4 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-medium text-muted-foreground">
                    Sale Deed Transfer
                  </span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {app.id}
                    </span>
                    {app.propertyId && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {app.propertyId}
                      </span>
                    )}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {app.sellerName ?? '—'} → {app.buyerName ?? '—'}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <TransactionStatusPill
                    status={app.applicationStatus}
                    type="application"
                    showIcon
                  />
                  <span className="text-xs text-muted-foreground">
                    {ageStr(app.submittedAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default PriorityWorkQueue;
