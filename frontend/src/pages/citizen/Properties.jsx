import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Ruler, Landmark, ArrowRight, Copy, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../services/propertyService';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function statusVariant(status) {
  if (status === 'Active') return 'success';
  if (status === 'Transfer in progress') return 'warning';
  return 'neutral';
}

export default function CitizenProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        if (user?.id) {
          const list = await propertyService.getUserProperties(user.id);
          setProperties(list);
        }
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [user]);

  const statuses = useMemo(() => {
    const set = new Set(properties.map((p) => p.status));
    const rest = [...set].filter((s) => s !== 'Active').sort();
    return ['All', ...(set.has('Active') ? ['Active'] : []), ...rest];
  }, [properties]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return properties.filter((p) => {
      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const haystack = `${p.propertyId} ${p.khasraNumber} ${p.village} ${p.tehsil} ${p.district} ${p.landType}`.toLowerCase();
      const matchQuery = !q || haystack.includes(q);
      return matchStatus && matchQuery;
    });
  }, [properties, query, statusFilter]);

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    toast.success('Copied');
  };

  const isTransferOpen = (p) => p?.status === 'Transfer in progress';

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title="My Properties"
        description="Registered land parcels under your ownership record"
        actions={
          <Button onClick={() => navigate('/citizen/new-transfer')}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Transfer Application
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            aria-label="Search properties"
            placeholder="Search by Khasra, ULPIN or location"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="h-auto flex-wrap">
              {statuses.map((s) => (
                <TabsTrigger key={s} value={s} className="text-xs">
                  {s}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <span className="text-xs text-muted-foreground">
            Ownership Portfolio ({properties.length}) · All parcels synchronized with ledger
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card className="shadow-card">
          <EmptyState
            icon={Landmark}
            title="No properties found"
            description="No properties found registered under your account."
            action={
              <Button variant="outline" onClick={() => navigate('/citizen/verify-land')}>
                Verify a parcel
              </Button>
            }
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="shadow-card">
          <EmptyState
            icon={Search}
            title="No matching parcels"
            description="Try a different search term or status filter."
            action={
              <Button variant="outline" onClick={() => { setQuery(''); setStatusFilter('All'); }}>
                Clear filters
              </Button>
            }
          />
        </Card>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {filtered.map((prop) => (
            <motion.div key={prop.propertyId} variants={staggerItem} className="h-full">
              <Card
                role="button"
                tabIndex={0}
                onClick={() => setSelected(prop)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelected(prop);
                  }
                }}
                className="card-interactive group flex h-full cursor-pointer flex-col shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">Khasra No.</span>
                    <Badge variant={statusVariant(prop.status)}>{prop.status}</Badge>
                  </div>
                  <div className="text-3xl font-extrabold tracking-tight text-foreground">{prop.khasraNumber}</div>
                  <div className="mt-1 font-mono text-xs text-muted-foreground">{prop.propertyId}</div>

                  <dl className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <dd>Village {prop.village}, Tehsil {prop.tehsil}, {prop.district}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <dd><span className="font-mono text-foreground">{prop.areaSqFt.toLocaleString()}</span> sq. ft</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <dd>{prop.landType}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto flex items-center justify-between pt-4 text-xs font-bold text-primary">
                    <span>View details</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent className="sm:max-w-[560px]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle>Khasra {selected.khasraNumber}</DialogTitle>
                  <Badge variant={statusVariant(selected.status)}>{selected.status}</Badge>
                </div>
                <DialogDescription>Registered parcel details synchronized with the ledger.</DialogDescription>
              </DialogHeader>

              <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Property ID (ULPIN)</dt>
                  <dd className="flex items-center gap-1 font-mono font-bold text-foreground">
                    <span className="break-all">{selected.propertyId}</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Copy property ID" onClick={() => copyId(selected.propertyId)}>
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy ID</TooltipContent>
                    </Tooltip>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Khasra No.</dt>
                  <dd className="font-bold text-foreground">{selected.khasraNumber}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Area (sq. ft)</dt>
                  <dd className="font-mono text-foreground">{selected.areaSqFt.toLocaleString()}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Location</dt>
                  <dd className="text-foreground">Village {selected.village}, Tehsil {selected.tehsil}, {selected.district}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Type</dt>
                  <dd className="text-foreground">{selected.landType}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Status</dt>
                  <dd><Badge variant={statusVariant(selected.status)}>{selected.status}</Badge></dd>
                </div>
              </dl>

              <DialogFooter className="gap-2 sm:gap-0">
                {isTransferOpen(selected) ? (
                  <Button variant="outline" onClick={() => navigate('/citizen/applications')}>
                    View Transfer
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button onClick={() => navigate(`/citizen/new-transfer?propertyId=${selected.propertyId}`)}>
                    Initiate Transfer
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
