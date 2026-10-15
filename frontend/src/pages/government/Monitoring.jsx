import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Download,
  Gauge,
  MapPin,
  RefreshCw,
  Search,
  SearchX,
  ServerCog,
  Timer,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

const TEHSIL_DATA = [
  { name: 'Agra Sadar', district: 'Agra', registries: 8420, mutations: 3210, pending: 284, coverage: 97, status: 'active' },
  { name: 'Fatehabad', district: 'Agra', registries: 4180, mutations: 1640, pending: 512, coverage: 88, status: 'pending' },
  { name: 'Etmadpur', district: 'Agra', registries: 2930, mutations: 980, pending: 120, coverage: 94, status: 'active' },
  { name: 'Lucknow Sadar', district: 'Lucknow', registries: 9840, mutations: 4120, pending: 340, coverage: 98, status: 'active' },
  { name: 'Bakshi Ka Talab', district: 'Lucknow', registries: 5210, mutations: 2180, pending: 189, coverage: 95, status: 'active' },
  { name: 'Mohanlalganj', district: 'Lucknow', registries: 3760, mutations: 1490, pending: 421, coverage: 87, status: 'pending' },
  { name: 'Varanasi Sadar', district: 'Varanasi', registries: 7840, mutations: 3280, pending: 218, coverage: 96, status: 'active' },
  { name: 'Pindra', district: 'Varanasi', registries: 3120, mutations: 1140, pending: 380, coverage: 82, status: 'pending' },
  { name: 'Arajiline', district: 'Varanasi', registries: 2480, mutations: 890, pending: 640, coverage: 71, status: 'inactive' },
  { name: 'Kanpur Sadar', district: 'Kanpur', registries: 8190, mutations: 3410, pending: 290, coverage: 97, status: 'active' },
  { name: 'Bilhaur', district: 'Kanpur', registries: 3490, mutations: 1360, pending: 452, coverage: 85, status: 'pending' },
  { name: 'Ghatampur', district: 'Kanpur', registries: 2860, mutations: 1020, pending: 320, coverage: 89, status: 'active' },
  { name: 'Prayagraj Sadar', district: 'Prayagraj', registries: 9120, mutations: 3840, pending: 180, coverage: 98, status: 'active' },
  { name: 'Phulpur', district: 'Prayagraj', registries: 4280, mutations: 1680, pending: 390, coverage: 90, status: 'active' },
  { name: 'Handia', district: 'Prayagraj', registries: 2940, mutations: 1090, pending: 510, coverage: 83, status: 'pending' },
  { name: 'Soraon', district: 'Prayagraj', registries: 1840, mutations: 620, pending: 720, coverage: 68, status: 'inactive' },
  { name: 'Mathura Sadar', district: 'Mathura', registries: 6320, mutations: 2480, pending: 210, coverage: 96, status: 'active' },
  { name: 'Chhata', district: 'Mathura', registries: 2890, mutations: 980, pending: 340, coverage: 88, status: 'pending' },
];

const DISTRICTS = ['Agra', 'Lucknow', 'Varanasi', 'Kanpur', 'Prayagraj', 'Mathura'];

const STATUS_META = {
  active: { label: 'Active', badge: 'success', dot: 'bg-success', live: true },
  pending: { label: 'Pending', badge: 'warning', dot: 'bg-warning', live: false },
  inactive: { label: 'Inactive', badge: 'error', dot: 'bg-destructive', live: false },
};

const coverageTone = (c) => (c >= 90 ? '[&>div]:bg-success' : c >= 75 ? '[&>div]:bg-info' : '[&>div]:bg-warning');

function TehsilCard({ row }) {
  const meta = STATUS_META[row.status];
  return (
    <motion.div variants={staggerItem} className="h-full">
      <Card className="card-interactive h-full shadow-card">
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold">{row.name}</h3>
              <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {row.district}
              </p>
            </div>
            <Badge variant={meta.badge} className="shrink-0">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                {meta.live && <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', meta.dot)} />}
                <span className={cn('relative inline-flex h-2 w-2 rounded-full', meta.dot)} />
              </span>
              {meta.label}
            </Badge>
          </div>

          <dl className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/40 px-2 py-2">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">Registries</dt>
              <dd className="font-mono text-sm font-bold">{row.registries.toLocaleString('en-IN')}</dd>
            </div>
            <div className="rounded-lg bg-muted/40 px-2 py-2">
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">Mutations</dt>
              <dd className="font-mono text-sm font-bold">{row.mutations.toLocaleString('en-IN')}</dd>
            </div>
            <div className={cn('rounded-lg px-2 py-2', row.pending > 400 ? 'bg-warning/15' : 'bg-muted/40')}>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">Pending</dt>
              <dd className={cn('font-mono text-sm font-bold', row.pending > 400 && 'text-warning-foreground')}>
                {row.pending.toLocaleString('en-IN')}
              </dd>
            </div>
          </dl>

          <div className="mt-auto">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Digitized Coverage</span>
              <span className="font-mono font-semibold">{row.coverage}%</span>
            </div>
            <Progress value={row.coverage} className={cn('h-2 bg-muted', coverageTone(row.coverage))} aria-label={`${row.name} coverage ${row.coverage}%`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function GovernmentMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState(() => new Date());
  const perPage = 8;

  const filtered = useMemo(() => {
    return TEHSIL_DATA.filter((row) => {
      const matchSearch =
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDistrict = districtFilter === 'all' || row.district === districtFilter;
      const matchStatus = statusFilter === 'all' || row.status === statusFilter;
      return matchSearch && matchDistrict && matchStatus;
    });
  }, [searchTerm, districtFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const counts = useMemo(
    () => ({
      all: TEHSIL_DATA.length,
      active: TEHSIL_DATA.filter((r) => r.status === 'active').length,
      pending: TEHSIL_DATA.filter((r) => r.status === 'pending').length,
      inactive: TEHSIL_DATA.filter((r) => r.status === 'inactive').length,
    }),
    []
  );

  const exportCSV = () => {
    toast.info('Exporting Tehsil Monitoring data as CSV...');
  };

  const refresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    // Static dataset: simulate a node poll so the UI reflects a fresh sync timestamp.
    window.setTimeout(() => {
      setLastSynced(new Date());
      setRefreshing(false);
      toast.success('Monitoring data refreshed');
    }, 700);
  }, [refreshing]);

  return (
    <AppShell portal="government">
      <PageHeader
        eyebrow="Government HQ"
        title="Registry Monitoring"
        description="Real-time tehsil & block-wise tracking"
        actions={
          <>
            <Badge variant="success" className="h-9 px-3">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              LIVE
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={refresh} disabled={refreshing} aria-label="Refresh monitoring data">
                  <RefreshCw className={cn(refreshing && 'animate-spin')} aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
            <Button onClick={exportCSV}>
              <Download aria-hidden="true" />
              Export CSV
            </Button>
          </>
        }
      />

      {/* KPI Strip */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="Network KPIs">
        <StatCard label="Active Tehsils" value="358 Nodes" icon={ServerCog} tone="success" hint="100% Online" delay={0} />
        <StatCard label="Today's Registrations" value={1842} icon={Activity} tone="info" hint="Across state" delay={0.05} />
        <StatCard label="Blockchain Latency" value="1.2 sec" icon={Timer} hint="Consensus Finality" delay={0.1} />
        <StatCard label="Sync Status" value="Healthy" icon={Gauge} tone="success" hint="Block #10484" delay={0.15} />
      </section>

      {/* Filter Controls */}
      <Card className="mb-6 shadow-card">
        <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Label htmlFor="tehsil-search" className="sr-only">
                Search tehsil or district
              </Label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                id="tehsil-search"
                type="search"
                placeholder="Search tehsil or district..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="district-filter" className="sr-only">
                District
              </Label>
              <Select
                value={districtFilter}
                onValueChange={(v) => {
                  setDistrictFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger id="district-filter" className="w-full sm:w-[170px]" aria-label="Filter by district">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <div className="overflow-x-auto pb-1">
              <TabsList>
                <TabsTrigger value="all">
                  All Status <span className="ml-1.5 font-mono text-[0.68rem] text-muted-foreground">{counts.all}</span>
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active <span className="ml-1.5 font-mono text-[0.68rem] text-muted-foreground">{counts.active}</span>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending <span className="ml-1.5 font-mono text-[0.68rem] text-muted-foreground">{counts.pending}</span>
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive <span className="ml-1.5 font-mono text-[0.68rem] text-muted-foreground">{counts.inactive}</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tehsil Health Grid */}
      <section aria-label="Tehsil node health" aria-busy={refreshing}>
        {refreshing ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: Math.max(paginated.length, 4) }).map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="flex flex-col gap-4 p-5">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-2 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <Card className="shadow-card">
            <EmptyState
              icon={SearchX}
              title="No tehsils match"
              description="Try a different search term or clear the district and status filters."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setDistrictFilter('all');
                    setStatusFilter('all');
                    setPage(1);
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </Card>
        ) : (
          <motion.div
            key={`${page}-${statusFilter}-${districtFilter}-${searchTerm}`}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {paginated.map((row) => (
              <TehsilCard key={row.name} row={row} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        <div className="mt-5 flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 text-xs text-muted-foreground shadow-card sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to{' '}
            {Math.min(page * perPage, filtered.length)} of {filtered.length} tehsils
            <span className="hidden sm:inline"> · Last synced {lastSynced.toLocaleTimeString('en-IN')}</span>
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft aria-hidden="true" />
              Previous
            </Button>
            <span className="font-mono">
              {page} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
              <ChevronRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
