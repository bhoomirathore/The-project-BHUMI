import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  Layers,
  Link2,
  Loader2,
  RefreshCw,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import EmptyState from '@/components/common/EmptyState';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import transactionService from '../../services/transactionService';

const CONFIRMED = ['CONFIRMED', 'SYNCED'];
const PENDING = ['SUBMITTED', 'PENDING'];
const FAILED = ['FAILED', 'SYNC_FAILED'];

const FILTERS = [
  { value: 'ALL', label: 'All', match: () => true },
  { value: 'CONFIRMED', label: 'Confirmed', match: (s) => CONFIRMED.includes(s) },
  { value: 'PENDING', label: 'Pending', match: (s) => PENDING.includes(s) },
  { value: 'FAILED', label: 'Failed', match: (s) => FAILED.includes(s) },
];

function HashCell({ hash }) {
  if (!hash) return <span className="italic text-muted-foreground">Pending Tx Hash</span>;
  return (
    <span className="inline-flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="font-mono text-[11px] text-foreground" tabIndex={0}>
            {hash.slice(0, 10)}…{hash.slice(-8)}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[90vw] break-all font-mono text-[11px]">{hash}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Copy transaction hash"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await navigator.clipboard.writeText(hash);
                toast.success('Copied');
              } catch {
                toast.error('Could not copy to clipboard');
              }
            }}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy hash</TooltipContent>
      </Tooltip>
    </span>
  );
}

export default function AuthorityRegistry() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retryingId, setRetryingId] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const loadTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTransactions();
      toast.info('Ledger log refreshed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleRetry = async (applicationId) => {
    setRetryingId(applicationId);
    try {
      await toast.promise(transactionService.retry(applicationId), {
        loading: `Re-submitting ${applicationId} to the ledger…`,
        success: `Retry initiated for ${applicationId}. Synchronizing transaction with ledger...`,
        error: (err) => err?.message || `Failed to retry transaction for ${applicationId}`,
      });
      // Refresh list after brief moment
      await loadTransactions();
      // Poll again after 2s and 5s to catch mock async transitions
      setTimeout(loadTransactions, 2000);
      setTimeout(loadTransactions, 5000);
    } catch {
      // error already surfaced by toast.promise
    } finally {
      setRetryingId(null);
    }
  };

  const stats = useMemo(
    () => ({
      total: transactions.length,
      confirmed: transactions.filter((t) => CONFIRMED.includes(t.status)).length,
      pending: transactions.filter((t) => PENDING.includes(t.status)).length,
      failed: transactions.filter((t) => FAILED.includes(t.status)).length,
    }),
    [transactions]
  );

  const counts = { ALL: stats.total, CONFIRMED: stats.confirmed, PENDING: stats.pending, FAILED: stats.failed };

  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.value === filter) || FILTERS[0];
    return transactions.filter((t) => f.match(t.status));
  }, [transactions, filter]);

  const openApp = (id) => navigate(`/authority/applications/${id}`);

  return (
    <AppShell portal="authority">
      <PageHeader
        eyebrow="Registrar Portal"
        title="Blockchain Transactions"
        description="Ledger commit tracking, transaction hashes, and state synchronization records"
        actions={
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={cn(refreshing && 'animate-spin')} aria-hidden="true" />
            Refresh Log
          </Button>
        }
      />

      {/* Summary */}
      <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Ledger summary">
        <StatCard label="Total Transactions" value={stats.total} icon={Layers} tone="default" loading={loading} delay={0} />
        <StatCard
          label="Confirmed"
          value={stats.confirmed}
          icon={CheckCircle2}
          tone="success"
          hint="Confirmed or synced"
          loading={loading}
          onClick={() => setFilter('CONFIRMED')}
          delay={0.05}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          tone="warning"
          hint="Awaiting block finality"
          loading={loading}
          onClick={() => setFilter('PENDING')}
          delay={0.1}
        />
        <StatCard
          label="Failed"
          value={stats.failed}
          icon={XCircle}
          tone="error"
          hint="Retry sync required"
          loading={loading}
          onClick={() => setFilter('FAILED')}
          delay={0.15}
        />
      </section>

      {/* Architecture Note Banner */}
      <Alert variant="info" className="mb-6">
        <Link2 className="h-4 w-4" />
        <AlertTitle className="flex flex-wrap items-center justify-between gap-2">
          Asynchronous Settlement
          <Badge variant="info" className="text-[0.62rem] uppercase tracking-wide">
            Event driven
          </Badge>
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          State mutations are submitted to the ledger upon registrar approval. Relational database records are
          updated only after confirmed ledger block events are received and verified.
        </AlertDescription>
      </Alert>

      {/* Transactions Table Card */}
      <Card className="overflow-hidden shadow-card">
        <CardHeader className="gap-4 border-b bg-muted/30 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Ledger Transaction Log{' '}
                <span className="font-mono text-muted-foreground">({loading ? '…' : visible.length})</span>
              </CardTitle>
              <CardDescription>Transfer mutation transactions committed or pending ledger finality</CardDescription>
            </div>
            <Tabs value={filter} onValueChange={setFilter}>
              <div className="overflow-x-auto pb-1">
                <TabsList className="h-auto w-max">
                  {FILTERS.map((f) => (
                    <TabsTrigger key={f.value} value={f.value} className="gap-1.5">
                      {f.label}
                      <span className="font-mono text-[0.68rem] text-muted-foreground">{counts[f.value] || 0}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col divide-y">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="hidden h-4 w-48 sm:block" />
                  <Skeleton className="hidden h-4 w-32 md:block" />
                  <Skeleton className="ml-auto h-5 w-24 rounded-full" />
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Link2}
              title={filter === 'ALL' ? 'No blockchain transactions recorded yet' : 'No transactions in this state'}
              description={
                filter === 'ALL'
                  ? 'No blockchain transactions recorded yet. Approved applications will appear here.'
                  : 'Switch to another filter to see other ledger records.'
              }
              action={
                filter === 'ALL' ? (
                  <Button variant="outline" onClick={() => navigate('/authority/applications')}>
                    Open Application Queue
                    <ArrowRight aria-hidden="true" />
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => setFilter('ALL')}>
                    Show all transactions
                  </Button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Application</TableHead>
                    <TableHead>Parcel ULPIN</TableHead>
                    <TableHead>Parties</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((tx) => {
                    const isFailed = FAILED.includes(tx.status);
                    const isRetrying = retryingId === tx.applicationId;

                    return (
                      <React.Fragment key={tx.applicationId}>
                        <TableRow
                          tabIndex={0}
                          onClick={() => openApp(tx.applicationId)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') openApp(tx.applicationId);
                          }}
                          className={cn(
                            'cursor-pointer transition-colors hover:bg-muted/40',
                            isFailed && 'bg-destructive/5 hover:bg-destructive/10',
                            isFailed && tx.error && 'border-b-0'
                          )}
                        >
                          <TableCell className="font-mono font-bold text-foreground">{tx.applicationId}</TableCell>
                          <TableCell className="font-mono text-muted-foreground">{tx.propertyId}</TableCell>
                          <TableCell>
                            <span className="text-xs">
                              <span className="font-semibold">{tx.sellerName}</span>
                              <span className="mx-1 text-muted-foreground">&rarr;</span>
                              <span className="font-semibold">{tx.buyerName}</span>
                            </span>
                          </TableCell>
                          <TableCell>
                            <HashCell hash={tx.txHash} />
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {tx.blockNumber ?? '—'}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                            {tx.submittedAt || '—'}
                          </TableCell>
                          <TableCell>
                            <TransactionStatusPill status={tx.status} type="blockchain" />
                          </TableCell>
                          <TableCell className="text-right">
                            {isFailed ? (
                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={isRetrying}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRetry(tx.applicationId);
                                }}
                              >
                                {isRetrying ? (
                                  <Loader2 className="animate-spin" aria-hidden="true" />
                                ) : (
                                  <RotateCcw aria-hidden="true" />
                                )}
                                {isRetrying ? 'Retrying…' : 'Retry Sync'}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openApp(tx.applicationId);
                                }}
                              >
                                View
                                <ArrowRight aria-hidden="true" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>

                        {/* Error details row if transaction failed or sync failed */}
                        {isFailed && tx.error && (
                          <TableRow className="bg-destructive/5 hover:bg-destructive/5">
                            <TableCell colSpan={8} className="py-2 text-xs text-destructive">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                <span>
                                  <span className="font-bold">Ledger Sync Fault:</span> {tx.error}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
