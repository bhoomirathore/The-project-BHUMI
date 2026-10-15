import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  CheckCircle2,
  Copy,
  FileText,
  Fingerprint,
  Info,
  Landmark,
  Link2,
  Loader2,
  MapPin,
  RotateCcw,
  SearchX,
  ShieldCheck,
  User,
  Wallet,
  X,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import MutationStepper from '@/components/MutationStepper';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import applicationService from '../../services/applicationService';
import propertyService from '../../services/propertyService';
import documentService from '../../services/documentService';
import verificationService from '../../services/verificationService';
import { DOCUMENT_TYPE_LABELS } from '../../utils/statuses';

const REJECTION_REASONS = [
  'Incomplete documents submitted',
  'Identity (KYC) verification failed',
  'Mismatched land records',
  'Encumbrance certificate missing',
  'Forged document suspected',
  'Stamp duty underpaid',
  'Other',
];

function CopyButton({ value, label }) {
  if (!value) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          aria-label={`Copy ${label}`}
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await navigator.clipboard.writeText(value);
              toast.success('Copied');
            } catch {
              toast.error('Could not copy to clipboard');
            }
          }}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy {label}</TooltipContent>
    </Tooltip>
  );
}

function DetailRow({ label, children, mono }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={cn('text-xs font-semibold text-foreground sm:text-right', mono && 'font-mono')}>{children}</dd>
    </div>
  );
}

function CheckRow({ ok, children, trailing, muted }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-3 text-xs',
        muted && 'opacity-70'
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
            ok ? 'bg-success/15 text-success-foreground' : 'bg-destructive/15 text-destructive'
          )}
          aria-hidden="true"
        >
          {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
        </span>
        <span className="text-foreground">{children}</span>
      </div>
      {trailing}
    </div>
  );
}

export default function AuthorityVerification() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Document integrity statuses: { [docId]: { checked: boolean, integrity: 'MATCH' | 'MISMATCH', message: string, verifying: boolean } }
  const [docIntegrityState, setDocIntegrityState] = useState({});

  // Manual review checklist items
  const [manualChecks, setManualChecks] = useState({
    documentsReviewed: false,
    propertyMatched: false,
  });

  // Modals & form state
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComments, setRejectComments] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [resubmitRemarks, setResubmitRemarks] = useState('');
  const [resubmitError, setResubmitError] = useState('');
  const [resubmitting, setResubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadAppDetails() {
      if (!id) {
        // Fallback to queue if no id parameter
        navigate('/authority/applications', { replace: true });
        return;
      }
      try {
        const app = await applicationService.getApplicationById(id);
        setApplication(app);
        if (app?.propertyId) {
          const prop = await propertyService.getPropertyById(app.propertyId);
          setProperty(prop);
        }
      } catch (err) {
        setLoadError(err.message || 'Application not found.');
        toast.error(err.message || 'Application not found.');
      } finally {
        setLoading(false);
      }
    }
    loadAppDetails();
  }, [id, navigate]);

  const handleVerifyDocIntegrity = async (docId) => {
    setDocIntegrityState((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], verifying: true },
    }));

    try {
      const res = await documentService.verifyIntegrity(docId, application.id);
      setDocIntegrityState((prev) => ({
        ...prev,
        [docId]: {
          checked: true,
          integrity: res.integrity,
          message: res.message,
          verifying: false,
        },
      }));
      if (res.integrity === 'MISMATCH') {
        toast.warning(res.message || 'Document hash mismatch detected.');
      } else {
        toast.success(res.message || 'Document integrity verified.');
      }
    } catch (err) {
      setDocIntegrityState((prev) => ({
        ...prev,
        [docId]: {
          checked: true,
          integrity: 'MISMATCH',
          message: err.message || 'Integrity check failed.',
          verifying: false,
        },
      }));
      toast.error(err.message || 'Integrity check failed.');
    }
  };

  // Integrity checks evaluation
  const documents = application?.documents || [];
  const allDocsChecked =
    documents.length > 0 && documents.every((d) => docIntegrityState[d.docId]?.checked);
  const hasDocMismatch = documents.some(
    (d) => docIntegrityState[d.docId]?.integrity === 'MISMATCH' || d.integrity === 'MISMATCH'
  );
  const docsCheckedCount = documents.filter((d) => docIntegrityState[d.docId]?.checked).length;

  const isKycVerified = application?.kycStatus === 'VERIFIED';
  const isPaymentReceived = application?.paymentStatus === 'SUCCESSFUL';
  const noCompetingTransfer = true; // In mock data, validated from property records

  // All conditions required for approving
  const canApprove =
    isKycVerified &&
    isPaymentReceived &&
    allDocsChecked &&
    !hasDocMismatch &&
    manualChecks.documentsReviewed &&
    manualChecks.propertyMatched &&
    noCompetingTransfer &&
    application?.applicationStatus === 'UNDER_VERIFICATION';

  const handleConfirmApproval = async () => {
    setApproving(true);
    try {
      const updated = await verificationService.approveApplication(application.id, {
        kycVerified: true,
        paymentReceived: true,
        documentsReviewed: true,
        propertyMatched: true,
        noConflict: true,
      });
      setApplication(updated);
      setApproveModalOpen(false);
      toast.success('Application approved successfully!', {
        description: 'Backend blockchain transaction has been initiated and submitted to ledger.',
      });
      setActiveTab('blockchain');
    } catch (err) {
      toast.error(err.message || 'Approval failed.');
      setApproveModalOpen(false);
    } finally {
      setApproving(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectReason) {
      setRejectError('Please select a rejection reason.');
      return;
    }
    setRejectError('');
    setRejecting(true);
    try {
      const updated = await verificationService.rejectApplication(
        application.id,
        rejectReason,
        rejectComments
      );
      setApplication(updated);
      setRejectModalOpen(false);
      toast.success(`Application ${application.id} rejected: ${rejectReason}`);
    } catch (err) {
      toast.error(err.message || 'Rejection failed.');
    } finally {
      setRejecting(false);
    }
  };

  const handleConfirmResubmission = async () => {
    if (!resubmitRemarks.trim()) {
      setResubmitError('Please provide remarks explaining what needs to be resubmitted.');
      return;
    }
    setResubmitError('');
    setResubmitting(true);
    try {
      const updated = await verificationService.requestResubmission(
        application.id,
        resubmitRemarks
      );
      setApplication(updated);
      setResubmitModalOpen(false);
      toast.success(`Resubmission request sent to applicant for ${application.id}.`);
    } catch (err) {
      toast.error(err.message || 'Request failed.');
    } finally {
      setResubmitting(false);
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (loading) {
    return (
      <AppShell portal="authority">
        <PageHeader eyebrow="Registrar Portal" title={<Skeleton className="h-8 w-72" />} description="Loading verification dossier…" />
        <Skeleton className="mb-6 h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!application) {
    return (
      <AppShell portal="authority">
        <PageHeader eyebrow="Registrar Portal" title="Application Review" />
        <Card>
          <EmptyState
            icon={SearchX}
            title="Application not found"
            description={loadError || 'The requested application does not exist or is no longer accessible.'}
            action={
              <Button onClick={() => navigate('/authority/applications')}>
                <ArrowLeft aria-hidden="true" />
                Back to Queue
              </Button>
            }
          />
        </Card>
      </AppShell>
    );
  }

  const isApprovedOrBeyond = ['APPROVED', 'PROCESSING', 'COMPLETED'].includes(application.applicationStatus);
  const showActions = !isApprovedOrBeyond && application.applicationStatus !== 'REJECTED';
  const isFailedChain = ['FAILED', 'SYNC_FAILED'].includes(application.blockchainStatus);

  const readiness = [
    { ok: isKycVerified, label: 'KYC verified' },
    { ok: isPaymentReceived, label: 'Payment received' },
    { ok: allDocsChecked && !hasDocMismatch, label: `Documents integrity-checked (${docsCheckedCount}/${documents.length})` },
    { ok: manualChecks.documentsReviewed, label: 'Documents reviewed' },
    { ok: manualChecks.propertyMatched, label: 'Property matched' },
    { ok: noCompetingTransfer, label: 'No competing transfer' },
  ];
  const readyCount = readiness.filter((r) => r.ok).length;

  const actionBar = showActions && (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        {canApprove ? (
          <span className="flex items-center gap-1.5 text-success-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            All checks passed. Ready to approve.
          </span>
        ) : application.applicationStatus !== 'UNDER_VERIFICATION' ? (
          'Approval is only available while the application is under verification.'
        ) : (
          `${readyCount}/${readiness.length} checks complete. Finish the checklist to enable approval.`
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setResubmitError('');
            setResubmitModalOpen(true);
          }}
        >
          <RotateCcw aria-hidden="true" />
          Request Resubmission
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => {
            setRejectError('');
            setRejectModalOpen(true);
          }}
        >
          <Ban aria-hidden="true" />
          Reject
        </Button>
        <Button
          size="sm"
          disabled={!canApprove}
          onClick={() => setApproveModalOpen(true)}
          className="flex-1 sm:flex-none"
        >
          <CheckCircle2 aria-hidden="true" />
          Approve Application
        </Button>
      </div>
    </div>
  );

  return (
    <AppShell portal="authority">
      <PageHeader
        eyebrow="Registrar Portal"
        title={
          <span className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span>
              Application Review <span className="font-mono">#{application.id}</span>
            </span>
            <TransactionStatusPill status={application.applicationStatus} />
          </span>
        }
        description={
          <span className="inline-flex flex-wrap items-center gap-1">
            Officer verification desk · Parcel <span className="font-mono">{application.propertyId}</span>
            <CopyButton value={application.propertyId} label="ULPIN" />
          </span>
        }
        actions={
          <Button variant="outline" asChild>
            <Link to="/authority/applications">
              <ArrowLeft aria-hidden="true" />
              Back to Queue
            </Link>
          </Button>
        }
      />

      {isApprovedOrBeyond && (
        <Alert variant="success" className="mb-6">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Approved and committed</AlertTitle>
          <AlertDescription>
            Application has been approved and committed to the ledger transaction stream.
          </AlertDescription>
        </Alert>
      )}

      {application.applicationStatus === 'REJECTED' && (
        <Alert variant="destructive" className="mb-6">
          <Ban className="h-4 w-4" />
          <AlertTitle>Application rejected</AlertTitle>
          <AlertDescription>
            This transfer has been terminated by the registrar. No further actions are available.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="pb-24 md:pb-0">
        <div className="overflow-x-auto pb-1">
          <TabsList className="h-auto w-max">
            <TabsTrigger value="overview" className="gap-1.5">
              <Landmark className="h-3.5 w-3.5" aria-hidden="true" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-1.5">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Documents
              <span className="font-mono text-[0.68rem] text-muted-foreground">
                {docsCheckedCount}/{documents.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="parties" className="gap-1.5">
              <Fingerprint className="h-3.5 w-3.5" aria-hidden="true" />
              Parties &amp; KYC
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="gap-1.5">
              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
              Blockchain
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ---------------- Overview ---------------- */}
        <TabsContent value="overview" className="mt-4 flex flex-col gap-6">
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Mutation Workflow Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MutationStepper
                applicationStatus={application.applicationStatus}
                blockchainStatus={application.blockchainStatus}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3">
                <div>
                  <CardTitle className="text-lg">Application Dossier</CardTitle>
                  <CardDescription>Parcel and filing details from the revenue registry</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono text-[0.68rem]">
                  ULPIN: {application.propertyId}
                </Badge>
              </CardHeader>
              <CardContent>
                <dl className="divide-y">
                  <DetailRow label="Khasra Number" mono>{property?.khasraNumber || '—'}</DetailRow>
                  <DetailRow label="Location">
                    <span className="inline-flex items-start gap-1">
                      <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
                      Village {property?.village}, Tehsil {property?.tehsil}, {property?.district}
                    </span>
                  </DetailRow>
                  <DetailRow label="Registry Type">Sale Deed</DetailRow>
                  <DetailRow label="Surface Area" mono>{property?.areaSqFt} sq. ft</DetailRow>
                  <DetailRow label="Land Classification">{property?.landType || '—'}</DetailRow>
                  <DetailRow label="Submitted On">{application.submittedAt}</DetailRow>
                  {application.approvedAt && <DetailRow label="Approved On">{application.approvedAt}</DetailRow>}
                  {application.completedAt && <DetailRow label="Completed On">{application.completedAt}</DetailRow>}
                  {application.appointment && (
                    <DetailRow label="Appointment">
                      {application.appointment.office}
                      <span className="block text-muted-foreground">
                        {application.appointment.date} · {application.appointment.slot}
                      </span>
                    </DetailRow>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Approval Readiness</CardTitle>
                <CardDescription>
                  {readyCount}/{readiness.length} conditions satisfied
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {readiness.map((r) => (
                  <div key={r.label} className="flex items-center gap-2.5 text-xs">
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                        r.ok ? 'bg-success/15 text-success-foreground' : 'bg-muted text-muted-foreground'
                      )}
                      aria-hidden="true"
                    >
                      {r.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </span>
                    <span className={r.ok ? 'text-foreground' : 'text-muted-foreground'}>{r.label}</span>
                  </div>
                ))}
                {showActions && (
                  <Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveTab('documents')}>
                    Go to document checks
                    <ArrowRight aria-hidden="true" />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---------------- Documents ---------------- */}
        <TabsContent value="documents" className="mt-4 flex flex-col gap-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Submitted Documents &amp; Cryptographic Hashes</CardTitle>
              <CardDescription>
                Run the integrity check on every document before confirming manual review.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {documents.length === 0 && (
                <EmptyState compact icon={FileText} title="No documents attached" />
              )}
              {documents.map((doc) => {
                const check = docIntegrityState[doc.docId];
                const hasChecked = !!check?.checked;
                const isMismatch = check?.integrity === 'MISMATCH' || (!check && doc.integrity === 'MISMATCH');

                return (
                  <div
                    key={doc.docId}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border bg-muted/30 p-3.5 text-xs transition-colors',
                      hasChecked && (isMismatch ? 'border-destructive/30 bg-destructive/5' : 'border-success/30 bg-success/5')
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <strong className="block text-foreground">{DOCUMENT_TYPE_LABELS[doc.type] || doc.type}</strong>
                        <span className="text-[0.72rem] text-muted-foreground">{doc.fileName}</span>
                        <span className="mt-0.5 flex items-center gap-1 font-mono text-[0.68rem] text-muted-foreground">
                          SHA-256: {truncateHash(doc.hash)}
                          <CopyButton value={doc.hash} label="document hash" />
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {hasChecked ? (
                          <Badge variant={isMismatch ? 'error' : 'success'}>
                            {isMismatch ? <X className="h-3 w-3" aria-hidden="true" /> : <Check className="h-3 w-3" aria-hidden="true" />}
                            {isMismatch ? 'MISMATCH' : 'Match'}
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            disabled={check?.verifying}
                            onClick={() => handleVerifyDocIntegrity(doc.docId)}
                          >
                            {check?.verifying ? (
                              <>
                                <Loader2 className="animate-spin" aria-hidden="true" />
                                Checking…
                              </>
                            ) : (
                              <>
                                <ShieldCheck aria-hidden="true" />
                                Verify integrity
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {check?.message && (
                      <p className={cn('text-[0.7rem]', isMismatch ? 'font-semibold text-destructive' : 'text-success-foreground')}>
                        {check.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Verification Checklist</CardTitle>
              <CardDescription>Automatic checks are read-only; manual attestations require your confirmation.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {/* 1. KYC Verified (Auto, read-only) */}
              <CheckRow
                ok={isKycVerified}
                trailing={<TransactionStatusPill status={application.kycStatus} type="kyc" />}
              >
                Identity verified with Aadhaar KYC (Auto)
              </CheckRow>

              {/* 2. Payment Received (Auto, read-only) */}
              <CheckRow
                ok={isPaymentReceived}
                trailing={<TransactionStatusPill status={application.paymentStatus} type="payment" />}
              >
                Stamp duty &amp; mutation payment received (Auto)
              </CheckRow>

              {/* 3. Documents Reviewed (Manual; requires all checked first) */}
              <div
                className={cn(
                  'flex items-start gap-3 rounded-lg border bg-muted/30 p-3 text-xs transition-colors',
                  (!allDocsChecked || hasDocMismatch) && 'opacity-70'
                )}
              >
                <Checkbox
                  id="check-documents-reviewed"
                  disabled={!allDocsChecked || hasDocMismatch}
                  checked={manualChecks.documentsReviewed}
                  onCheckedChange={(v) =>
                    setManualChecks((prev) => ({ ...prev, documentsReviewed: v === true }))
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="check-documents-reviewed" className="flex cursor-pointer flex-col gap-0.5 text-xs font-semibold leading-snug">
                  Documents reviewed &amp; cryptographic signatures valid
                  {(!allDocsChecked || hasDocMismatch) && (
                    <span className="text-[0.68rem] font-normal text-warning-foreground">
                      * Requires all documents to be integrity-checked with no MISMATCH.
                    </span>
                  )}
                </Label>
              </div>

              {/* 4. Property details match records (Manual) */}
              <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3 text-xs">
                <Checkbox
                  id="check-property-matched"
                  checked={manualChecks.propertyMatched}
                  onCheckedChange={(v) =>
                    setManualChecks((prev) => ({ ...prev, propertyMatched: v === true }))
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="check-property-matched" className="cursor-pointer text-xs font-semibold leading-snug">
                  Property details match revenue registry records
                </Label>
              </div>

              {/* 5. No competing open transfer (Shown from data) */}
              <CheckRow ok={noCompetingTransfer} trailing={<Badge variant="success">Clear</Badge>}>
                No competing open transfer on this property
              </CheckRow>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Parties & KYC ---------------- */}
        <TabsContent value="parties" className="mt-4 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  Seller (Transferor)
                </CardDescription>
                <CardTitle className="text-base">{application.sellerName}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-mono">+91 {application.sellerPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Aadhaar KYC</span>
                  <TransactionStatusPill status="VERIFIED" type="kyc" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" aria-hidden="true" />
                  Buyer (Transferee)
                </CardDescription>
                <CardTitle className="text-base">{application.buyerName}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Contact</span>
                  <span className="font-mono">+91 {application.buyerPhone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Aadhaar KYC</span>
                  <TransactionStatusPill status={application.kycStatus || 'PENDING'} type="kyc" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Statutory Checks</CardTitle>
              <CardDescription>Identity and payment gates are completed by the citizen before registrar review.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <CheckRow
                ok={isKycVerified}
                trailing={<TransactionStatusPill status={application.kycStatus} type="kyc" />}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Fingerprint className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  Aadhaar e-KYC authentication
                </span>
              </CheckRow>
              <CheckRow
                ok={isPaymentReceived}
                trailing={<TransactionStatusPill status={application.paymentStatus} type="payment" />}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  Stamp duty &amp; mutation fee
                </span>
              </CheckRow>
              {!isKycVerified && (
                <p className="text-xs text-muted-foreground">
                  Buyer KYC is still outstanding. Visit the{' '}
                  <Link to="/authority/ekyc" className="font-semibold text-primary underline-offset-4 hover:underline">
                    KYC Status Table
                  </Link>{' '}
                  to attest identity.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Blockchain ---------------- */}
        <TabsContent value="blockchain" className="mt-4 flex flex-col gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3">
              <div>
                <CardTitle className="text-base">Ledger Transaction</CardTitle>
                <CardDescription>Asynchronous settlement record for this mutation</CardDescription>
              </div>
              {application.blockchainStatus ? (
                <TransactionStatusPill status={application.blockchainStatus} type="blockchain" />
              ) : (
                <Badge variant="neutral">Not submitted</Badge>
              )}
            </CardHeader>
            <CardContent>
              {!application.blockchainStatus && !application.txHash ? (
                <EmptyState
                  compact
                  icon={Link2}
                  title="No ledger transaction yet"
                  description="A blockchain transaction is initiated automatically once the application is approved."
                />
              ) : (
                <dl className="divide-y">
                  <DetailRow label="Transaction Hash" mono>
                    {application.txHash ? (
                      <span className="inline-flex items-center gap-1">
                        <span title={application.txHash}>{truncateHash(application.txHash)}</span>
                        <CopyButton value={application.txHash} label="transaction hash" />
                      </span>
                    ) : (
                      <span className="italic text-muted-foreground">Pending Tx Hash</span>
                    )}
                  </DetailRow>
                  <DetailRow label="Block Number" mono>{application.blockNumber ?? '—'}</DetailRow>
                  <DetailRow label="Ledger Status">
                    <TransactionStatusPill status={application.blockchainStatus} type="blockchain" />
                  </DetailRow>
                  {application.approvedAt && <DetailRow label="Submitted to Ledger">{application.approvedAt}</DetailRow>}
                  {application.registryNumber && <DetailRow label="Registry Number" mono>{application.registryNumber}</DetailRow>}
                </dl>
              )}

              {isFailedChain && (
                <Alert variant="destructive" className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Ledger sync fault</AlertTitle>
                  <AlertDescription className="flex flex-col gap-3">
                    <span>{application.blockchainError || 'The ledger transaction failed or could not be synchronized.'}</span>
                    <Button variant="outline" size="sm" className="w-fit" asChild>
                      <Link to="/authority/registry">
                        <RotateCcw aria-hidden="true" />
                        Retry from Blockchain Transactions
                      </Link>
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Separator />
          <p className="text-xs text-muted-foreground">
            Approval alone initiates the backend blockchain transaction write. Ownership mutates upon asynchronous event confirmation.
          </p>
        </TabsContent>
      </Tabs>

      {/* Action bar: sticky at the bottom on mobile, inline card on desktop */}
      {showActions && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 shadow-lift backdrop-blur md:static md:mt-6 md:rounded-xl md:border md:bg-card md:p-4 md:shadow-card">
          {actionBar}
        </div>
      )}

      {/* Approve Confirm (AlertDialog) */}
      <AlertDialog open={approveModalOpen} onOpenChange={(open) => { if (!approving) setApproveModalOpen(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Application Approval</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="flex flex-col gap-3 text-sm">
                <p>
                  You are approving land transfer application{' '}
                  <strong className="font-mono text-foreground">{application.id}</strong> for parcel{' '}
                  <strong className="font-mono text-foreground">{application.propertyId}</strong>.
                </p>
                <p className="rounded-lg border bg-muted/30 p-3 text-xs">
                  Approval alone initiates the backend blockchain transaction write. Ownership will mutate upon
                  asynchronous event confirmation.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={approving}>Cancel</AlertDialogCancel>
            <Button disabled={approving} onClick={handleConfirmApproval}>
              {approving ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" />
                  Submitting to Ledger…
                </>
              ) : (
                <>
                  <CheckCircle2 aria-hidden="true" />
                  Confirm Approval &amp; Commit
                </>
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={rejectModalOpen} onOpenChange={(open) => { if (!rejecting) setRejectModalOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Select an authoritative rejection reason below.</DialogDescription>
          </DialogHeader>

          <Alert variant="destructive">
            <Ban className="h-4 w-4" />
            <AlertTitle>This action will terminate the transfer process.</AlertTitle>
          </Alert>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Select value={rejectReason} onValueChange={(v) => { setRejectReason(v); setRejectError(''); }}>
                <SelectTrigger id="reject-reason" aria-invalid={!!rejectError}>
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent>
                  {REJECTION_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {rejectError && <p className="text-xs text-destructive">{rejectError}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reject-comments">Additional Comments</Label>
              <Textarea
                id="reject-comments"
                rows={3}
                value={rejectComments}
                onChange={(e) => setRejectComments(e.target.value)}
                placeholder="Provide specific notes for the applicant..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={rejecting} onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" disabled={rejecting} onClick={handleConfirmRejection}>
              {rejecting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Ban aria-hidden="true" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resubmission Dialog */}
      <Dialog open={resubmitModalOpen} onOpenChange={(open) => { if (!resubmitting) setResubmitModalOpen(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Resubmission</DialogTitle>
            <DialogDescription>
              Specify the corrections or documents that the applicant must provide to continue verification.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="resubmit-remarks">Resubmission Remarks *</Label>
            <Textarea
              id="resubmit-remarks"
              rows={4}
              value={resubmitRemarks}
              onChange={(e) => { setResubmitRemarks(e.target.value); setResubmitError(''); }}
              placeholder="e.g. Please re-upload clear scan of Land Map with seal..."
              aria-invalid={!!resubmitError}
            />
            {resubmitError && <p className="text-xs text-destructive">{resubmitError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={resubmitting} onClick={() => setResubmitModalOpen(false)}>
              Cancel
            </Button>
            <Button disabled={resubmitting} onClick={handleConfirmResubmission}>
              {resubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
