import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Search, ArrowRight, FileText, UploadCloud } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import applicationService from '../../services/applicationService';
import TransactionStatusPill from '../../components/TransactionStatusPill';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

function matchesFilter(app, filter) {
  const s = app.applicationStatus;
  switch (filter) {
    case 'in_progress':
      // DRAFT is treated as in-progress (awaiting citizen document upload)
      return !['COMPLETED', 'REJECTED', 'FAILED'].includes(s);
    case 'completed':
      return s === 'COMPLETED';
    case 'rejected':
      return s === 'REJECTED' || s === 'FAILED';
    default:
      return true;
  }
}

export default function CitizenApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchApps() {
      if (user?.id) {
        try {
          const list = await applicationService.getUserApplications(user.id);
          setApplications(list);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchApps();
  }, [user]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((app) => {
      if (!matchesFilter(app, filter)) return false;
      if (!q) return true;
      return `${app.id} ${app.propertyId} ${app.buyerName} ${app.applicationStatus}`.toLowerCase().includes(q);
    });
  }, [applications, filter, query]);

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.value, applications.filter((a) => matchesFilter(a, f.value)).length])),
    [applications]
  );

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title="My Applications"
        description="Track the progress of your land transfer applications"
        actions={
          <Button onClick={() => navigate('/citizen/book-appointment?purpose=TRANSFER')} className="gap-2 font-bold min-h-[44px]">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Button>
        }
      />

      <Card className="overflow-hidden shadow-card border-border/80 bg-card">
        <div className="flex flex-col gap-3 border-b bg-muted/30 p-4 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold sm:text-lg">
              Active &amp; Historical Transfer Requests ({applications.length})
            </h2>
            <span className="text-xs text-muted-foreground">Real-time mutation workflow tracking</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="h-auto flex-wrap">
                {FILTERS.map((f) => (
                  <TabsTrigger key={f.value} value={f.value} className="gap-1.5 text-xs">
                    {f.label}
                    <span className="rounded-full bg-muted px-1.5 font-mono text-[0.65rem] text-muted-foreground">{counts[f.value] ?? 0}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                aria-label="Search applications"
                placeholder="Search by ID, property or buyer"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-background pl-9"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  {['Application ID', 'Property ID', 'Buyer', 'Submission Date', 'Status', 'Actions'].map((h) => (
                    <TableHead key={h} className="px-4">{h}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[0, 1, 2].map((i) => (
                  <TableRow key={i}>
                    {[0, 1, 2, 3, 4, 5].map((c) => (
                      <TableCell key={c} className="px-4 py-3"><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : applications.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No transfer applications found"
            description="Book an appointment to initiate a property transfer and track its mutation workflow here."
            action={
              <Button onClick={() => navigate('/citizen/book-appointment?purpose=TRANSFER')} className="gap-2">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                Book Appointment
              </Button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching applications"
            description="Try a different search term or status filter."
            action={
              <Button variant="outline" onClick={() => { setQuery(''); setFilter('all'); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[640px] text-xs sm:text-sm">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-4">Application ID</TableHead>
                  <TableHead className="px-4">Property ID</TableHead>
                  <TableHead className="px-4">Buyer</TableHead>
                  <TableHead className="px-4">Submission Date</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((app) => (
                  <TableRow
                    key={app.id}
                    tabIndex={0}
                    onClick={() => navigate(`/citizen/applications/${app.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') navigate(`/citizen/applications/${app.id}`);
                    }}
                    className="cursor-pointer hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none"
                  >
                    <TableCell className="px-4 py-3 font-mono font-bold text-foreground">{app.id}</TableCell>
                    <TableCell className="px-4 py-3 font-mono text-muted-foreground">{app.propertyId}</TableCell>
                    <TableCell className="px-4 py-3 font-medium text-foreground">{app.buyerName}</TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground">
                      {app.submittedAt || (app.applicationStatus === 'DRAFT' ? 'Pending upload' : '—')}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <TransactionStatusPill status={app.applicationStatus} />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {app.applicationStatus === 'DRAFT' ? (
                        <Button
                          size="sm"
                          className="gap-1.5 font-bold min-h-[36px]"
                          onClick={() => navigate(`/citizen/applications/${app.id}#documents`)}
                        >
                          <UploadCloud className="h-3.5 w-3.5" />
                          Upload documents
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 min-h-[36px]"
                          onClick={() => navigate(`/citizen/applications/${app.id}`)}
                        >
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </AppShell>
  );
}
