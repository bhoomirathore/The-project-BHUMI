import React from 'react';
import { Link2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/common/EmptyState';
import TransactionStatusPill from '@/components/TransactionStatusPill';

const FAILED_STATUSES = new Set(['FAILED', 'SYNC_FAILED']);

function LedgerActivityFeed({ transactions = [], loading = false }) {
  const sorted = [...transactions]
    .sort((a, b) => {
      const aT = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const bT = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return bT - aT;
    })
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Ledger Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No ledger activity"
            description="No blockchain transactions recorded yet."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {sorted.map((tx) => {
              const isFailed = FAILED_STATUSES.has(tx.status);
              return (
                <li
                  key={tx.txHash ?? tx.applicationId}
                  className={`flex items-center justify-between gap-3 rounded-md px-3 py-2 text-xs ${
                    isFailed
                      ? 'border-l-2 border-destructive bg-destructive/10'
                      : 'border border-border bg-muted/40'
                  }`}
                >
                  <TransactionStatusPill
                    status={tx.status}
                    type="blockchain"
                    showIcon
                  />
                  <span className="flex-1 truncate font-mono text-muted-foreground">
                    {tx.txHash
                      ? `${tx.txHash.slice(0, 8)}…`
                      : '—'}
                  </span>
                  <span className="shrink-0 font-mono font-semibold text-foreground">
                    {tx.applicationId ?? '—'}
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

export default LedgerActivityFeed;
