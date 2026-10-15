import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ArrowUpDown, Inbox, Search, X } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import applicationService from '../../services/applicationService';
import { APPLICATION_STATUSES, getApplicationStatusMeta } from '../../utils/statuses';

// Canonical order for the status tabs (only those present in the data are shown)
const TAB_ORDER = [
  APPLICATION_STATUSES.SUBMITTED,
  APPLICATION_STATUSES.UNDER_VERIFICATION,
  APPLICATION_STATUSES.RESUBMISSION,
  APPLICATION_STATUSES.APPROVED,
  APPLICATION_STATUSES.PROCESSING,
  APPLICATION_STATUSES.COMPLETED,
  APPLICATION_STATUSES.FAILED,
  APPLICATION_STATUSES.REJECTED,
];

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

/** Parses "10-Jan-2026, 10:30 AM" style dates; falls back to Date.parse. */
function parseSubmittedAt(value) {
  if (!value) return 0;
  const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})(?:,?\s*(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i.exec(value);
  if (m) {
    let hours = Number(m[4] || 0);
    const meridiem = (m[6] || '').toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return new Date(Number(m[3]), MONTHS[m[2].toLowerCase()] ?? 0, Number(m[1]), hours, Number(m[5] || 0)).getTime();
  }
  const t = Date.parse(value);
  return Number.isNaN(t) ? 0 : t;
}

function isUrgent(app) {
  return (
    app.applicationStatus === APPLICATION_STATUSES.FAILED ||
    app.blockchainStatus === 'FAILED' ||
    app.blockchainStatus === 'SYNC_FAILED'
  );
}

export default function ApplicationQueue() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState('desc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      setLoading(true);
      try {
        const apps = await applicationService.getAllApplications();
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
  }, []);

  const presentStatuses = useMemo(() => {
    const present = new Set(applications.map((a) => a.applicationStatus));
    return TAB_ORDER.filter((s) => present.has(s));
  }, [applications]);

  const counts = useMemo(() => {
    const c = { ALL: applications.length };
    applications.forEach((a) => {
      c[a.applicationStatus] = (c[a.applicationStatus] || 0) + 1;
    });
    return c;
  }, [applications]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = applications.filter((a) => {
      if (statusFilter !== 'ALL' && a.applicationStatus !== statusFilter) return false;
      if (!q) return true;
      return [a.id, a.propertyId, a.sellerName, a.buyerName]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
    // Urgent rows float to the top, then sort by submission date
    return list.sort((a, b) => {
      const ua = isUrgent(a) ? 1 : 0;
      const ub = isUrgent(b) ? 1 : 0;
      if (ua !== ub) return ub - ua;
      const diff = parseSubmittedAt(a.submittedAt) - parseSubmittedAt(b.submittedAt);
      return sortDir === 'asc' ? diff : -diff;
    });
  }, [applications, statusFilter, search, sortDir]);

  const openReview = (id) => navigate(`/authority/applications/${id}`);

  return (
    <AppShell portal="authority">
      <PageHeader
        eyebrow="Registrar Portal"
        title="Application Queue"
        description="Review, verify and audit land transfer applications"
      />

      <Card className="overflow-hidden shadow-card">
        <CardHeader className="gap-4 border-b bg-muted/30 pb-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Transfer Applications{' '}
                <span className="font-mono text-muted-foreground">({loading ? '…' : visible.length})</span>
              </CardTitle>
              <CardDescription>Click on any row to open review desk</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Label htmlFor="queue-search" className="sr-only">
                  Search applications
                </Label>
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="queue-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ID, ULPIN, seller, buyer…"
                  className="pl-8 pr-8"
                />
                {search && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Clear search"
                    onClick={() => setSearch('')}
                    className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2"
                  >
                    <X />
                  </Button>
                )}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label={sortDir === 'desc' ? 'Sort by date, oldest first' : 'Sort by date, newest first'}
                    onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                    className="shrink-0"
                  >
                    <ArrowUpDown />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{sortDir === 'desc' ? 'Newest first' : 'Oldest first'}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <div className="overflow-x-auto pb-1">
              <TabsList className="h-auto flex-wrap justify-start gap-1 sm:flex-nowrap">
                <TabsTrigger value="ALL" className="gap-1.5">
                  All
                  <span className="font-mono text-[0.68rem] text-muted-foreground">{counts.ALL || 0}</span>
                </TabsTrigger>
                {presentStatuses.map((s) => (
                  <TabsTrigger key={s} value={s} className="gap-1.5">
                    {getApplicationStatusMeta(s).label}
                    <span className="font-mono text-[0.68rem] text-muted-foreground">{counts[s] || 0}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col divide-y">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="hidden h-4 w-32 sm:block" />
                  <Skeleton className="hidden h-4 w-32 md:block" />
                  <Skeleton className="ml-auto h-5 w-24 rounded-full" />
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No applications found"
              description={
                search || statusFilter !== 'ALL'
                  ? 'No applications found matching the selected filter.'
                  : 'No transfer applications have been filed yet.'
              }
              action={
                (search || statusFilter !== 'ALL') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('ALL');
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Application ID</TableHead>
                    <TableHead>Parcel ULPIN</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 hover:text-foreground"
                        onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
                      >
                        Submitted Date
                        <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((app) => {
                    const urgent = isUrgent(app);
                    return (
                      <TableRow
                        key={app.id}
                        onClick={() => openReview(app.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') openReview(app.id);
                        }}
                        tabIndex={0}
                        className={cn(
                          'cursor-pointer transition-colors hover:bg-muted/40',
                          urgent && 'bg-destructive/5 hover:bg-destructive/10'
                        )}
                      >
                        <TableCell className="font-mono font-bold text-foreground">
                          <div className="flex items-center gap-2">
                            {app.id}
                            {urgent && (
                              <Badge variant="error" className="text-[0.62rem] uppercase">
                                <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-muted-foreground">{app.propertyId}</TableCell>
                        <TableCell className="font-medium">{app.sellerName}</TableCell>
                        <TableCell className="font-medium">{app.buyerName}</TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{app.submittedAt}</TableCell>
                        <TableCell>
                          <TransactionStatusPill status={app.applicationStatus} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openReview(app.id);
                            }}
                          >
                            Review
                            <ArrowRight aria-hidden="true" />
                          </Button>
                        </TableCell>
                      </TableRow>
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
