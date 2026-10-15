import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  FileText,
  Loader2,
  ShieldCheck,
  CreditCard,
  CalendarClock,
  Link2,
  AlertTriangle,
  Landmark,
  Users,
  SearchX,
} from 'lucide-react';
import { toast } from 'sonner';
import MutationStepper from '../../components/MutationStepper';
import TransactionStatusPill from '../../components/TransactionStatusPill';
import applicationService from '../../services/applicationService';
import kycService from '../../services/kycService';
import paymentService from '../../services/paymentService';
import propertyService from '../../services/propertyService';
import { DOCUMENT_TYPE_LABELS } from '../../utils/statuses';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

function Row({ label, children, last }) {
  return (
    <div className={`flex items-start justify-between gap-4 py-2 text-xs ${last ? '' : 'border-b'}`}>
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{children}</dd>
    </div>
  );
}

export default function CitizenApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const loadData = async () => {
    try {
      const app = await applicationService.getApplicationById(id);
      setApplication(app);
      if (app?.propertyId) {
        const prop = await propertyService.getPropertyById(app.propertyId);
        setProperty(prop);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStartKyc = async () => {
    setActionLoading(true);
    try {
      const updated = await kycService.triggerMockKyc(application.id, 'VERIFIED');
      setApplication(updated);
      toast.success('Mock Aadhaar KYC verification completed successfully.');
    } catch (err) {
      toast.error(err.message || 'Mock KYC failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    setActionLoading(true);
    try {
      const updated = await paymentService.triggerMockPayment(application.id, 'SUCCESSFUL');
      setApplication(updated);
      toast.success('Simulated INR stamp duty & mutation fees paid successfully.');
    } catch (err) {
      toast.error(err.message || 'Simulated payment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyHash = () => {
    if (application?.txHash) {
      navigator.clipboard.writeText(application.txHash);
      setCopiedHash(true);
      toast.success('Copied');
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied');
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (loading) {
    return (
      <AppShell portal="citizen">
        <div className="mb-8 space-y-3 border-b pb-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="mb-8 h-28 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Skeleton className="h-52 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!application) {
    return (
      <AppShell portal="citizen">
        <PageHeader eyebrow="Citizen Portal" title="Application" />
        <Card className="shadow-card">
          <EmptyState
            icon={SearchX}
            title="Application not found"
            description="We could not find a transfer application with that ID."
            action={
              <Button onClick={() => navigate('/citizen/applications')}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Applications
              </Button>
            }
          />
        </Card>
      </AppShell>
    );
  }

  const isKycVerified = application.kycStatus === 'VERIFIED';
  const isPaymentSuccess = application.paymentStatus === 'SUCCESSFUL';

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title={`Transfer Application #${application.id}`}
        description={`Submitted on ${application.submittedAt} · Property ${application.propertyId}`}
        actions={
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Copy application ID" onClick={() => copyText(application.id)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy application ID</TooltipContent>
            </Tooltip>
            <Button variant="outline" asChild>
              <Link to="/citizen/applications">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Applications
              </Link>
            </Button>
          </>
        }
      >
        <div className="mt-2">
          <TransactionStatusPill status={application.applicationStatus} />
        </div>
      </PageHeader>

      {/* Failure banners */}
      {(application.blockchainStatus === 'SYNC_FAILED' || application.blockchainError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Blockchain State Synchronization Failed</AlertTitle>
          <AlertDescription>
            {application.blockchainError ||
              'Database state synchronization timed out after blockchain ledger confirmation. The transfer has NOT been completed.'}
          </AlertDescription>
        </Alert>
      )}

      {application.paymentFailureMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Payment Verification Notice</AlertTitle>
          <AlertDescription>{application.paymentFailureMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-6">
          <section>
            <h2 className="mb-3 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Mutation Workflow Progress
            </h2>
            <MutationStepper
              applicationStatus={application.applicationStatus}
              blockchainStatus={application.blockchainStatus}
            />
          </section>

          {/* Parcel */}
          <Card className="shadow-card">
            <CardHeader className="flex-row items-center gap-3 space-y-0 p-5 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Landmark className="h-4 w-4" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">Parcel Details</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <dl>
                <Row label="Property ID (ULPIN):">
                  <span className="font-mono font-bold">{application.propertyId}</span>
                </Row>
                <Row label="Khasra Number:"><span className="font-bold">{property?.khasraNumber}</span></Row>
                <Row label="Location:">
                  Village {property?.village}, Tehsil {property?.tehsil}, {property?.district}
                </Row>
                <Row label="Surface Area:"><span className="font-mono">{property?.areaSqFt}</span> sq. ft</Row>
                <Row label="Land Classification:" last>{property?.landType}</Row>
              </dl>
            </CardContent>
          </Card>

          {/* Parties */}
          <Card className="shadow-card">
            <CardHeader className="flex-row items-center gap-3 space-y-0 p-5 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">Parties Involved</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 p-5 pt-0 text-xs sm:grid-cols-2">
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <span className="mb-1 block text-[0.68rem] font-bold uppercase text-muted-foreground">Transferor (Seller)</span>
                <strong className="block text-sm text-foreground">{application.sellerName}</strong>
                <span className="mt-1 block font-mono text-muted-foreground">+91 {application.sellerPhone}</span>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3.5">
                <span className="mb-1 block text-[0.68rem] font-bold uppercase text-muted-foreground">Transferee (Buyer)</span>
                <strong className="block text-sm text-foreground">{application.buyerName}</strong>
                <span className="mt-1 block font-mono text-muted-foreground">+91 {application.buyerPhone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="shadow-card">
            <CardHeader className="flex-row items-center gap-3 space-y-0 p-5 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" aria-hidden="true" />
              </div>
              <CardTitle className="text-base">
                Submitted Deeds &amp; Certs ({application.documents?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {(application.documents || []).length === 0 ? (
                <p className="text-xs text-muted-foreground">No documents attached.</p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {(application.documents || []).map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3 text-xs transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground">
                          <FileText className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <strong className="block truncate text-foreground">{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</strong>
                          <span className="block truncate text-[0.72rem] text-muted-foreground">{doc.fileName}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <code className="rounded border bg-card px-2 py-0.5 font-mono text-[0.68rem] text-muted-foreground">
                          {truncateHash(doc.hash)}
                        </code>
                        {doc.hash && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Copy document hash" onClick={() => copyText(doc.hash)}>
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy hash</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Side column */}
        <aside className="flex min-w-0 flex-col gap-6">
          {/* Status summary */}
          <Card className="shadow-card">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base">Status Summary</CardTitle>
              <CardDescription>Current state of each workflow stage.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <dl className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Application</dt>
                  <dd><TransactionStatusPill status={application.applicationStatus} /></dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">KYC</dt>
                  <dd><TransactionStatusPill status={application.kycStatus} type="kyc" /></dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Payment</dt>
                  <dd><TransactionStatusPill status={application.paymentStatus} type="payment" /></dd>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <dt className="text-muted-foreground">Blockchain</dt>
                  <dd><TransactionStatusPill status={application.blockchainStatus} type="blockchain" /></dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* KYC */}
          <Card className="shadow-card">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                  Identity Verification (KYC)
                </CardTitle>
                <TransactionStatusPill status={application.kycStatus} type="kyc" />
              </div>
              <CardDescription className="text-xs">
                Aadhaar eKYC authentication simulation for seller &amp; buyer identity verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {isKycVerified ? (
                <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/15 p-3 text-xs font-semibold text-success-foreground">
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>KYC verified and recorded for this application.</span>
                </div>
              ) : (
                <Button className="w-full" disabled={actionLoading} onClick={handleStartKyc}>
                  {actionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Simulating Verification...
                    </>
                  ) : (
                    'Start KYC (simulated)'
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="shadow-card">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-4 w-4 text-primary" aria-hidden="true" />
                  Stamp Duty &amp; Mutation Fees
                </CardTitle>
                <TransactionStatusPill status={application.paymentStatus} type="payment" />
              </div>
              <CardDescription className="text-xs">
                Mock Indian Rupee (INR) payment for stamp duty charges. Requires verified KYC.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {isPaymentSuccess ? (
                <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/15 p-3 text-xs font-semibold text-success-foreground">
                  <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Payment received and cleared.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button className="w-full" disabled={!isKycVerified || actionLoading} onClick={handleProcessPayment}>
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Processing simulated payment...
                      </>
                    ) : (
                      'Pay (simulated, INR)'
                    )}
                  </Button>
                  {!isKycVerified && (
                    <span className="text-[0.7rem] text-warning-foreground">
                      * KYC must be verified before payment can be initiated.
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Appointment */}
          <Card className="shadow-card">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="h-4 w-4 text-primary" aria-hidden="true" />
                Sub-Registrar Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              {application.appointment ? (
                <dl className="flex flex-col gap-1.5 rounded-xl border bg-muted/30 p-3.5 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Office:</dt>
                    <dd className="text-right font-bold text-foreground">{application.appointment.office}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Date:</dt>
                    <dd className="font-bold text-foreground">{application.appointment.date}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Time Slot:</dt>
                    <dd className="font-bold text-foreground">{application.appointment.slot}</dd>
                  </div>
                </dl>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">
                    No appointment scheduled yet for physical verification signoff.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/citizen/book-appointment?applicationId=${application.id}`)}
                  >
                    Schedule Appointment Slot
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blockchain */}
          {application.txHash && (
            <Card className="shadow-card">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
                    Blockchain State Tracker
                  </CardTitle>
                  <TransactionStatusPill status={application.blockchainStatus} type="blockchain" />
                </div>
                <CardDescription className="text-xs">
                  Asynchronous ledger confirmation details recorded by the backend registrar node.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[0.72rem] text-muted-foreground">Transaction Hash:</span>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Copy transaction hash" onClick={handleCopyHash}>
                          {copiedHash ? <Check className="h-3.5 w-3.5 text-success-foreground" /> : <Copy className="h-3.5 w-3.5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{copiedHash ? 'Copied' : 'Copy hash'}</TooltipContent>
                    </Tooltip>
                  </div>
                  <Separator className="mb-2" />
                  <code className="block break-all font-mono text-xs text-foreground">{application.txHash}</code>
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </AppShell>
  );
}
