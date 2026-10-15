import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  Inbox,
  Loader2,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import kycService from '../../services/kycService';
import { KYC_STATUSES } from '../../utils/statuses';

const KYC_TABS = [
  { value: 'ALL', label: 'All' },
  { value: KYC_STATUSES.PENDING, label: 'Pending' },
  { value: KYC_STATUSES.VERIFIED, label: 'Verified' },
  { value: KYC_STATUSES.FAILED, label: 'Failed' },
];

const SCAN_DURATION_MS = 1500;

export default function AuthorityEKYC() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kycFilter, setKycFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Verify dialog state
  const [verifyTarget, setVerifyTarget] = useState(null); // application being verified
  const [phase, setPhase] = useState('idle'); // idle | scanning | submitting | done | failed
  const [scanProgress, setScanProgress] = useState(0);
  const [marking, setMarking] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const apps = await applicationService.getAllApplications();
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const buyerKyc = (app) => app.kycStatus || KYC_STATUSES.PENDING;

  const counts = useMemo(() => {
    const c = { ALL: applications.length };
    applications.forEach((a) => {
      const s = buyerKyc(a);
      c[s] = (c[s] || 0) + 1;
    });
    return c;
  }, [applications]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (kycFilter !== 'ALL' && buyerKyc(a) !== kycFilter) return false;
      if (!q) return true;
      return [a.id, a.propertyId, a.sellerName, a.buyerName]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [applications, kycFilter, search]);

  const openReview = (id) => navigate(`/authority/applications/${id}`);

  const applyUpdate = (updated) => {
    if (!updated?.id) return;
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)));
  };

  const openVerify = (app) => {
    setVerifyTarget(app);
    setPhase('idle');
    setScanProgress(0);
  };

  const closeVerify = () => {
    if (phase === 'scanning' || phase === 'submitting' || marking) return;
    cancelAnimationFrame(rafRef.current);
    setVerifyTarget(null);
    setPhase('idle');
    setScanProgress(0);
  };

  const submitVerified = async (app) => {
    setPhase('submitting');
    try {
      const updated = await kycService.triggerMockKyc(app.id, KYC_STATUSES.VERIFIED);
      applyUpdate(updated);
      setPhase('done');
      toast.success(`Aadhaar KYC verified for ${app.buyerName}`, { description: app.id });
    } catch (err) {
      setPhase('failed');
      toast.error(err.message || 'KYC verification failed.');
    }
  };

  const startScan = () => {
    if (!verifyTarget) return;
    setPhase('scanning');
    setScanProgress(0);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / SCAN_DURATION_MS);
      setScanProgress(Math.round(t * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        submitVerified(verifyTarget);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const markFailed = async () => {
    if (!verifyTarget) return;
    setMarking(true);
    try {
      await toast.promise(kycService.triggerMockKyc(verifyTarget.id, KYC_STATUSES.FAILED), {
        loading: 'Recording KYC failure…',
        success: (updated) => {
          applyUpdate(updated);
          return `KYC marked as failed for ${verifyTarget.buyerName}`;
        },
        error: (err) => err?.message || 'Could not update KYC status.',
      });
      setPhase('failed');
    } finally {
      setMarking(false);
    }
  };

  const dialogBusy = phase === 'scanning' || phase === 'submitting' || marking;

  return (
    <AppShell portal="authority">
      <PageHeader
        eyebrow="Registrar Portal"
        title="KYC Status Overview"
        description="Audit record and verification desk for applicant and counterparty Aadhaar identity verification across transfer filings"
      />

      {/* Informational Banner */}
      <Alert variant="success" className="mb-6">
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle className="flex flex-wrap items-center justify-between gap-2">
          Statutory Verification Notice
          <Badge variant="success" className="text-[0.62rem] uppercase tracking-wide">
            Secure audit log
          </Badge>
        </AlertTitle>
        <AlertDescription className="text-xs text-muted-foreground">
          e-KYC authentication is initiated and authenticated directly by citizens via simulated UIDAI identity
          gateway. Registrars perform visual matching and attestation during review.
        </AlertDescription>
      </Alert>

      {/* KYC Records Table */}
      <Card className="overflow-hidden shadow-card">
        <CardHeader className="gap-4 border-b bg-muted/30 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                Filing KYC Records{' '}
                <span className="font-mono text-muted-foreground">({loading ? '…' : visible.length})</span>
              </CardTitle>
              <CardDescription>Identity authentication statuses for sellers and buyers per application</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Label htmlFor="kyc-search" className="sr-only">
                Search KYC records
              </Label>
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="kyc-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, ULPIN or party name…"
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
          </div>

          <Tabs value={kycFilter} onValueChange={setKycFilter}>
            <div className="overflow-x-auto pb-1">
              <TabsList className="h-auto w-max">
                {KYC_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} className="gap-1.5">
                    {t.label}
                    <span className="font-mono text-[0.68rem] text-muted-foreground">{counts[t.value] || 0}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col divide-y">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="hidden h-9 w-36 sm:block" />
                  <Skeleton className="hidden h-9 w-36 md:block" />
                  <Skeleton className="ml-auto h-8 w-24" />
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No application records found"
              description={
                search || kycFilter !== 'ALL'
                  ? 'No KYC records match the current filter.'
                  : 'KYC records appear here as citizens file transfer applications.'
              }
              action={
                (search || kycFilter !== 'ALL') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch('');
                      setKycFilter('ALL');
                    }}
                  >
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[820px]">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Application ID</TableHead>
                    <TableHead>Parcel ULPIN</TableHead>
                    <TableHead>Seller Identity</TableHead>
                    <TableHead>Buyer Identity</TableHead>
                    <TableHead>Filing Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((app) => {
                    const status = buyerKyc(app);
                    const needsVerify = status !== KYC_STATUSES.VERIFIED;
                    return (
                      <TableRow
                        key={app.id}
                        tabIndex={0}
                        onClick={() => openReview(app.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') openReview(app.id);
                        }}
                        className={cn(
                          'cursor-pointer transition-colors hover:bg-muted/40',
                          status === KYC_STATUSES.FAILED && 'bg-destructive/5 hover:bg-destructive/10'
                        )}
                      >
                        <TableCell className="font-mono font-bold text-foreground">{app.id}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">{app.propertyId}</TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold">{app.sellerName}</span>
                            <TransactionStatusPill status="VERIFIED" type="kyc" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold">{app.buyerName}</span>
                            <TransactionStatusPill status={status} type="kyc" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <TransactionStatusPill status={app.applicationStatus} type="application" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {needsVerify && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openVerify(app);
                                }}
                              >
                                <Fingerprint aria-hidden="true" />
                                Verify
                              </Button>
                            )}
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
                          </div>
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

      {/* Biometric verification dialog */}
      <Dialog open={!!verifyTarget} onOpenChange={(open) => { if (!open) closeVerify(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aadhaar Biometric Verification</DialogTitle>
            <DialogDescription>
              {verifyTarget && (
                <>
                  Attest identity of <strong className="text-foreground">{verifyTarget.buyerName}</strong> (buyer) for{' '}
                  <span className="font-mono">{verifyTarget.id}</span>.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-2">
            <div className="relative flex h-24 w-24 items-center justify-center">
              {phase === 'scanning' && (
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" aria-hidden="true" />
              )}
              <div
                className={cn(
                  'relative flex h-20 w-20 items-center justify-center rounded-full border-2 transition-colors',
                  phase === 'done' && 'border-success/40 bg-success/15 text-success-foreground',
                  phase === 'failed' && 'border-destructive/40 bg-destructive/15 text-destructive',
                  phase !== 'done' && phase !== 'failed' && 'border-primary/30 bg-primary/10 text-primary'
                )}
              >
                {phase === 'done' ? (
                  <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
                ) : phase === 'failed' ? (
                  <XCircle className="h-9 w-9" aria-hidden="true" />
                ) : phase === 'submitting' ? (
                  <Loader2 className="h-9 w-9 animate-spin" aria-hidden="true" />
                ) : (
                  <Fingerprint className={cn('h-10 w-10', phase === 'scanning' && 'animate-pulse')} aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="w-full" aria-live="polite">
              <Progress value={phase === 'done' ? 100 : scanProgress} className="h-2" />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {phase === 'idle' && 'Place finger on the biometric scanner to begin.'}
                {phase === 'scanning' && `Capturing biometric template… ${scanProgress}%`}
                {phase === 'submitting' && 'Authenticating with UIDAI gateway…'}
                {phase === 'done' && 'Identity verified and recorded in the audit log.'}
                {phase === 'failed' && 'Verification failed. The applicant must re-attempt e-KYC.'}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {phase === 'done' || phase === 'failed' ? (
              <Button onClick={closeVerify}>Close</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  disabled={dialogBusy}
                  onClick={markFailed}
                >
                  <XCircle aria-hidden="true" />
                  Mark failed
                </Button>
                <Button disabled={dialogBusy} onClick={startScan}>
                  {dialogBusy ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Fingerprint aria-hidden="true" />}
                  {phase === 'scanning' ? 'Scanning…' : phase === 'submitting' ? 'Authenticating…' : 'Start biometric scan'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
