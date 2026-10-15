import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  FileWarning,
  Gavel,
  MapPin,
  Scale,
  Search,
  SearchX,
  Users,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

const INITIAL_DISPUTES = [
  {
    id: 'DISP-2024-0891',
    khasra: '104/A',
    district: 'Lucknow',
    complainant: 'Harish Chandra',
    respondent: 'Devendra Nath',
    category: 'Boundary Overlap',
    filedDate: '02-Jan-2024',
    status: 'Active',
    summary: 'Alleged encroachment of 300 sq.ft residential plot boundary after road expansion.',
  },
  {
    id: 'DISP-2024-0742',
    khasra: '512/3',
    district: 'Agra',
    complainant: 'Sunita Mehra',
    respondent: 'Ratan Lal',
    category: 'Ownership Title Contest',
    filedDate: '14-Dec-2023',
    status: 'Under Review',
    summary: 'Conflicting historical inheritance claims registered in two separate sub-tehsil books.',
  },
  {
    id: 'DISP-2023-9981',
    khasra: '78/B',
    district: 'Kanpur',
    complainant: 'Ajay K. Saxena',
    respondent: 'State Highway Authority',
    category: 'Compensation Dispute',
    filedDate: '28-Nov-2023',
    status: 'Resolved',
    summary: 'Discrepancy in circle rate evaluation for acquired agricultural corridor land.',
  },
  {
    id: 'DISP-2024-0105',
    khasra: '221/1',
    district: 'Prayagraj',
    complainant: 'Balram Yadav',
    respondent: 'Vikramaditya Rao',
    category: 'Mutation Objection',
    filedDate: '18-Jan-2024',
    status: 'Active',
    summary: 'Objection filed against digital mutation claiming forged unregistered sale deed.',
  },
];

const STATUS_TABS = ['All', 'Active', 'Under Review', 'Resolved'];

const STATUS_VARIANT = {
  Resolved: 'success',
  Active: 'error',
  'Under Review': 'warning',
};

function StatusBadge({ status, className }) {
  const Icon = status === 'Resolved' ? CheckCircle2 : status === 'Active' ? FileWarning : Clock;
  return (
    <Badge variant={STATUS_VARIANT[status] || 'neutral'} className={className}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {status}
    </Badge>
  );
}

function copyId(id) {
  navigator.clipboard?.writeText(id);
  toast.success('Copied');
}

/** Derive a simple case timeline from the dispute's current status. */
function buildTimeline(item) {
  const reviewed = item.status === 'Under Review' || item.status === 'Resolved';
  const resolved = item.status === 'Resolved';
  return [
    { label: 'Dispute filed', detail: `Filed on ${item.filedDate} · ${item.district}`, done: true, icon: CalendarDays },
    { label: 'Tribunal review', detail: reviewed ? 'Case under tribunal examination' : 'Awaiting tribunal allocation', done: reviewed, icon: Scale },
    { label: 'Resolution', detail: resolved ? 'Marked RESOLVED on Tribunal Ledger' : 'Pending resolution', done: resolved, icon: CheckCircle2 },
  ];
}

export default function GovernmentDisputes() {
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeCase, setActiveCase] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type: 'resolve' | 'escalate', id }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return disputes.filter((d) => {
      const matchStatus = filter === 'All' || d.status.toLowerCase() === filter.toLowerCase();
      const matchSearch =
        !q ||
        [d.id, d.khasra, d.district, d.complainant, d.respondent, d.category].some((v) => v.toLowerCase().includes(q));
      return matchStatus && matchSearch;
    });
  }, [disputes, filter, search]);

  const counts = useMemo(
    () => STATUS_TABS.reduce((acc, t) => ({ ...acc, [t]: t === 'All' ? disputes.length : disputes.filter((d) => d.status === t).length }), {}),
    [disputes]
  );

  const handleResolveCase = (id) => {
    setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'Resolved' } : d)));
    toast.success(`Case ${id} marked as RESOLVED and updated on Tribunal Ledger.`);
    setActiveCase(null);
  };

  const handleEscalateCase = (id) => {
    toast.info(`Case ${id} escalated to District Magistrate Revenue Tribunal.`);
    setActiveCase(null);
  };

  const handleExport = () => {
    toast.info('Exporting disputes log as PDF/CSV...');
  };

  const confirmAction = () => {
    if (!confirm) return;
    if (confirm.type === 'resolve') handleResolveCase(confirm.id);
    else handleEscalateCase(confirm.id);
    setConfirm(null);
  };

  return (
    <AppShell portal="government">
      <PageHeader
        eyebrow="Government HQ"
        title="Dispute Management"
        description="Monitor, escalate & resolve land disputes nationwide"
        actions={
          <Button onClick={handleExport}>
            <Download aria-hidden="true" />
            Export
          </Button>
        }
      />

      {/* Dispute KPIs */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="Dispute KPIs">
        <StatCard label="Total Disputes" value={4218} icon={Gavel} hint="FY 2024–25" delay={0} />
        <StatCard
          label="Active / Open"
          value={1204}
          icon={FileWarning}
          tone="error"
          hint={<span className="font-medium text-warning-foreground">Requires monitoring</span>}
          delay={0.05}
        />
        <StatCard
          label="Resolved"
          value={2791}
          icon={CheckCircle2}
          tone="success"
          hint={<span className="font-medium text-success-foreground">66.2% resolution rate</span>}
          delay={0.1}
        />
        <StatCard
          label="Avg Resolution Time"
          value="42 Days"
          icon={Clock}
          tone="info"
          hint={<span className="font-medium text-success-foreground">Fastest in South Zone</span>}
          delay={0.15}
        />
      </section>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <div className="overflow-x-auto pb-1">
            <TabsList>
              {STATUS_TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab}>
                  {tab}
                  <span className="ml-1.5 font-mono text-[0.68rem] text-muted-foreground">{counts[tab]}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
        <div className="relative w-full sm:max-w-xs">
          <Label htmlFor="dispute-search" className="sr-only">
            Search disputes
          </Label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            id="dispute-search"
            type="search"
            placeholder="Search case, khasra, party..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Disputes Grid */}
      <section className="mb-10" aria-label="Disputes">
        {filtered.length === 0 ? (
          <Card className="shadow-card">
            <EmptyState
              icon={SearchX}
              title="No disputes found"
              description="No cases match the current status filter or search term."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter('All');
                    setSearch('');
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          </Card>
        ) : (
          <motion.div
            key={`${filter}-${search}`}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {filtered.map((item) => (
              <motion.div key={item.id} variants={staggerItem} className="h-full">
                <Card className="card-interactive flex h-full flex-col shadow-card">
                  <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-bold">
                        {item.id}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6" aria-label={`Copy case ID ${item.id}`} onClick={() => copyId(item.id)}>
                              <Copy className="h-3 w-3" aria-hidden="true" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy case ID</TooltipContent>
                        </Tooltip>
                      </span>
                      <StatusBadge status={item.status} />
                    </div>

                    <h3 className="mb-1 text-base font-bold">
                      Khasra {item.khasra} · {item.district}
                    </h3>
                    <span className="mb-3 inline-block text-[0.7rem] font-bold uppercase tracking-wide text-muted-foreground">
                      {item.category}
                    </span>

                    <div className="mb-3 flex flex-col gap-1 text-xs text-muted-foreground">
                      <p className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        <strong className="text-foreground">Parties:</strong> {item.complainant} vs {item.respondent}
                      </p>
                      <p className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        <strong className="text-foreground">Filed:</strong> {item.filedDate}
                      </p>
                    </div>

                    <p className="rounded-lg border bg-muted/30 p-3 text-xs text-foreground">{item.summary}</p>

                    <div className="mt-5 flex gap-2 border-t pt-4">
                      <Button className="flex-1" size="sm" onClick={() => setActiveCase(item)}>
                        Review Case
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setConfirm({ type: 'escalate', id: item.id })}>
                        Escalate
                        <ArrowUpRight aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Case Review Modal */}
      <Modal
        isOpen={!!activeCase}
        onClose={() => setActiveCase(null)}
        title={activeCase ? `Tribunal Case Review - ${activeCase.id}` : ''}
        description={activeCase ? `${activeCase.category} · Khasra ${activeCase.khasra}, ${activeCase.district}` : undefined}
        size="lg"
        footer={
          activeCase && (
            <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
              <Button variant="outline" onClick={() => setActiveCase(null)}>
                Close
              </Button>
              <Button variant="secondary" onClick={() => setConfirm({ type: 'escalate', id: activeCase.id })}>
                <ArrowUpRight aria-hidden="true" />
                Escalate to DM Court
              </Button>
              <Button
                onClick={() => setConfirm({ type: 'resolve', id: activeCase.id })}
                disabled={activeCase.status === 'Resolved'}
              >
                <CheckCircle2 aria-hidden="true" />
                Resolve & Close Case
              </Button>
            </div>
          )
        }
      >
        {activeCase && (
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between">
              <StatusBadge status={activeCase.status} />
              <span className="inline-flex items-center gap-1 font-mono text-muted-foreground">
                {activeCase.id}
                <Button variant="ghost" size="icon" className="h-6 w-6" aria-label="Copy case ID" onClick={() => copyId(activeCase.id)}>
                  <Copy className="h-3 w-3" aria-hidden="true" />
                </Button>
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Case Category:</dt>
                <dd className="text-right font-bold">{activeCase.category}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Parcel / Khasra:</dt>
                <dd className="text-right font-mono font-bold">{activeCase.khasra}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">District:</dt>
                <dd className="inline-flex items-center gap-1 text-right">
                  <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  {activeCase.district}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Filed:</dt>
                <dd className="text-right font-mono">{activeCase.filedDate}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Complainant:</dt>
                <dd className="text-right">{activeCase.complainant}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Respondent:</dt>
                <dd className="text-right">{activeCase.respondent}</dd>
              </div>
            </dl>

            <div className="rounded-lg border bg-muted/30 p-3">
              <strong className="mb-1 block text-foreground">Detailed Case Summary:</strong>
              <p className="leading-relaxed text-muted-foreground">{activeCase.summary}</p>
            </div>

            <div>
              <strong className="mb-3 block text-foreground">Case Timeline</strong>
              <ol className="relative ml-2 border-l pl-5">
                {buildTimeline(activeCase).map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.label} className={cn('pb-4 last:pb-0', !step.done && 'opacity-70')}>
                      <span
                        className={cn(
                          'absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full border bg-card',
                          step.done ? 'border-success/30 bg-success/15 text-success-foreground' : 'text-muted-foreground'
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{step.label}</span>
                        {step.done ? (
                          <Badge variant="success" className="px-1.5 py-0 text-[0.6rem]">Done</Badge>
                        ) : (
                          <Badge variant="neutral" className="px-1.5 py-0 text-[0.6rem]">Pending</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-muted-foreground">{step.detail}</p>
                      <span className="sr-only">Step {i + 1} of 3</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation */}
      <AlertDialog open={!!confirm} onOpenChange={(open) => { if (!open) setConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.type === 'resolve' ? 'Resolve and close this case?' : 'Escalate this case?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.type === 'resolve'
                ? `Case ${confirm?.id} will be marked as RESOLVED and the change will be recorded on the Tribunal Ledger. This cannot be undone.`
                : `Case ${confirm?.id} will be escalated to the District Magistrate Revenue Tribunal for adjudication.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {confirm?.type === 'resolve' ? 'Resolve & Close' : 'Escalate'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
