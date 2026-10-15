import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  Search,
  Upload,
  UserCheck,
  AlertTriangle,
  Landmark,
  Users,
  Files,
  ClipboardCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../services/propertyService';
import applicationService from '../../services/applicationService';
import documentService from '../../services/documentService';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from '../../utils/statuses';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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

const REQUIRED_DOC_TYPES = [
  DOCUMENT_TYPES.SALE_DEED,
  DOCUMENT_TYPES.IDENTITY_PROOF,
  DOCUMENT_TYPES.LAND_MAP,
  DOCUMENT_TYPES.ENCUMBRANCE_CERT,
  DOCUMENT_TYPES.TAX_RECEIPT,
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per Assumption A9
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

const STEPS = [
  { num: 1, label: 'Select Property', icon: Landmark },
  { num: 2, label: 'Buyer Lookup', icon: Users },
  { num: 3, label: 'Upload Deeds', icon: Files },
  { num: 4, label: 'Review & Submit', icon: ClipboardCheck },
];

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function CitizenNewTransfer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPropId = searchParams.get('propertyId');

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(preSelectedPropId || '');
  const [buyerQuery, setBuyerQuery] = useState('');
  const [buyerResult, setBuyerResult] = useState(null);
  const [buyerSearching, setBuyerSearching] = useState(false);
  const [buyerError, setBuyerError] = useState('');

  // Uploaded docs: { [type]: { file, fileName, hash, loading, error } }
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [createdApp, setCreatedApp] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      if (user?.id) {
        try {
          const list = await propertyService.getUserProperties(user.id);
          setProperties(list);
          if (preSelectedPropId && list.some((p) => p.propertyId === preSelectedPropId && p.status === 'Active')) {
            setSelectedPropertyId(preSelectedPropId);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchProperties();
  }, [user, preSelectedPropId]);

  const selectedProperty = properties.find((p) => p.propertyId === selectedPropertyId);

  const goTo = (next) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  // --- Step 2: Buyer Lookup ---
  const handleLookupBuyer = async (e) => {
    e.preventDefault();
    setBuyerError('');
    setBuyerResult(null);

    if (!buyerQuery.trim()) {
      setBuyerError('Please enter the buyer email or mobile number.');
      return;
    }

    setBuyerSearching(true);
    try {
      const res = await applicationService.lookupBuyer(buyerQuery.trim(), user.id);
      setBuyerResult(res);
    } catch (err) {
      setBuyerError(err.message || 'Buyer lookup failed.');
    } finally {
      setBuyerSearching(false);
    }
  };

  // --- Step 3: Document Upload Handler ---
  const handleFile = async (docType, file) => {
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          error: `Invalid file format (${ext}). Allowed: PDF, JPG, PNG.`,
        },
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          error: `File exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
        },
      }));
      return;
    }

    // Client-side validation passed. Upload to server to receive server-side SHA-256 hash.
    setUploadedDocs((prev) => ({
      ...prev,
      [docType]: {
        fileName: file.name,
        loading: true,
        error: '',
        hash: '',
      },
    }));

    try {
      const uploadRes = await documentService.uploadDocument(file, docType);
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          type: docType,
          fileName: file.name,
          hash: uploadRes.hash,
          loading: false,
          error: '',
        },
      }));
    } catch (err) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          loading: false,
          error: 'Failed to upload document to server.',
        },
      }));
    }
  };

  const handleFileChange = (docType, e) => {
    const file = e.target.files?.[0];
    handleFile(docType, file);
  };

  const handleDrop = (docType, e) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer?.files?.[0];
    handleFile(docType, file);
  };

  const areAllDocsUploaded = REQUIRED_DOC_TYPES.every(
    (t) => uploadedDocs[t]?.hash && !uploadedDocs[t]?.loading
  );

  // --- Step 4: Submit Application ---
  const handleSubmitApplication = async () => {
    setConfirmOpen(false);
    setFormError('');
    setSubmitting(true);

    try {
      const docPayload = REQUIRED_DOC_TYPES.map((t) => ({
        type: t,
        fileName: uploadedDocs[t].fileName,
        hash: uploadedDocs[t].hash,
      }));

      const newApp = await applicationService.createApplication({
        propertyId: selectedPropertyId,
        seller: {
          id: user.id,
          name: user.name,
          phone: user.phone || '9876543210',
        },
        buyer: {
          id: buyerResult.id,
          name: buyerResult.name,
          phone: buyerResult.phone,
        },
        documents: docPayload,
      });

      setCreatedApp(newApp);
      toast.success('Transfer application submitted successfully.');
    } catch (err) {
      const msg = err.message || 'Failed to submit application.';
      setFormError(msg);
      toast.error(msg);
      setSubmitting(false);
    }
  };

  const progress = createdApp ? 100 : ((step - 1) / STEPS.length) * 100 + 12.5;

  // --- Success state ---
  if (createdApp) {
    return (
      <AppShell portal="citizen">
        <PageHeader
          eyebrow="Citizen Portal"
          title="New Land Transfer Application"
          description="Initiate a Sale Deed mutation transfer workflow for your registered parcel"
        />
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="max-w-3xl">
          <Card className="border-success/30 shadow-card">
            <CardContent className="flex flex-col items-center p-8 text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 animate-pulse-ring rounded-full bg-success/20" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success-foreground">
                  <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                </div>
              </div>
              <h2 className="text-lg font-bold">Application submitted</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your transfer application <span className="font-mono font-semibold text-foreground">{createdApp.id}</span> has been recorded
                and is now awaiting registrar verification.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Button onClick={() => navigate(`/citizen/applications/${createdApp.id}`)}>
                  View application
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/citizen/dashboard')}>Back to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title="New Land Transfer Application"
        description="Initiate a Sale Deed mutation transfer workflow for your registered parcel"
      />

      <Card className="max-w-3xl overflow-hidden shadow-card">
        {/* Progress + step pills */}
        <div className="border-b bg-muted/30 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">
              Step {step} of {STEPS.length}
            </span>
            <span className="font-mono text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" aria-label={`Step ${step} of ${STEPS.length}`} />
          <ol className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Form steps">
            {STEPS.map((item) => {
              const done = step > item.num;
              const active = step === item.num;
              const Icon = item.icon;
              return (
                <li
                  key={item.num}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : done
                      ? 'border-success/30 bg-success/15 text-success-foreground'
                      : 'bg-card text-muted-foreground'
                  )}
                >
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold',
                      active ? 'bg-primary-foreground/20' : done ? 'bg-success text-primary-foreground' : 'bg-muted'
                    )}
                  >
                    {done ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : item.num}
                  </span>
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {formError && (
          <div className="px-6 pt-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Submission failed</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {/* STEP 1 */}
            {step === 1 && (
              <motion.section
                key="step-1"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <CardHeader className="p-6 pb-2 sm:p-8 sm:pb-2">
                  <CardTitle className="text-lg">Step 1: Choose Your Property</CardTitle>
                  <CardDescription>Select one of your registered active land parcels to transfer.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4 sm:p-8 sm:pt-4">
                  <RadioGroup
                    value={selectedPropertyId}
                    onValueChange={setSelectedPropertyId}
                    aria-label="Select property"
                    className="flex flex-col gap-3"
                  >
                    {properties.map((prop) => {
                      const isBlocked = prop.status === 'Transfer in progress';
                      const isSelected = selectedPropertyId === prop.propertyId;
                      const inputId = `prop-${prop.propertyId}`;

                      return (
                        <Label
                          key={prop.propertyId}
                          htmlFor={inputId}
                          className={cn(
                            'flex items-start gap-4 rounded-xl border p-4 font-normal transition-all',
                            isBlocked
                              ? 'cursor-not-allowed bg-muted/40 opacity-60'
                              : isSelected
                              ? 'cursor-pointer border-primary bg-primary/5 shadow-sm'
                              : 'cursor-pointer bg-card hover:border-primary/40'
                          )}
                        >
                          <RadioGroupItem id={inputId} value={prop.propertyId} disabled={isBlocked} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-mono text-sm font-bold text-foreground">{prop.propertyId}</span>
                              <Badge variant={isBlocked ? 'warning' : 'success'}>{prop.status}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Khasra No. <strong className="text-foreground">{prop.khasraNumber}</strong> · Village {prop.village}, Tehsil {prop.tehsil}, {prop.district}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              Area: <span className="font-mono">{prop.areaSqFt.toLocaleString()}</span> sq. ft · Type: {prop.landType}
                            </p>
                            {isBlocked && (
                              <p className="mt-1 text-[0.7rem] font-semibold text-warning-foreground">
                                Transfer already in progress on this parcel. Open transfer must be finalized or cancelled.
                              </p>
                            )}
                          </div>
                        </Label>
                      );
                    })}
                  </RadioGroup>

                  <div className="mt-8 flex justify-end border-t pt-4">
                    <Button
                      disabled={!selectedPropertyId || selectedProperty?.status === 'Transfer in progress'}
                      onClick={() => goTo(2)}
                    >
                      Continue to Buyer Lookup
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </motion.section>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.section
                key="step-2"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <CardHeader className="p-6 pb-2 sm:p-8 sm:pb-2">
                  <CardTitle className="text-lg">Step 2: Buyer Lookup</CardTitle>
                  <CardDescription>Search for the registered buyer by registered email address or mobile phone.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4 sm:p-8 sm:pt-4">
                  <form onSubmit={handleLookupBuyer} noValidate className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex flex-1 flex-col gap-1.5">
                      <Label htmlFor="buyerQuery">Buyer email or phone</Label>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input
                          id="buyerQuery"
                          type="text"
                          placeholder="Buyer email (e.g., suresh.singh@example.com) or 10-digit phone"
                          value={buyerQuery}
                          onChange={(e) => setBuyerQuery(e.target.value)}
                          aria-invalid={!!buyerError}
                          className="pl-9"
                        />
                      </div>
                      {buyerError && <p role="alert" className="text-xs text-destructive">{buyerError}</p>}
                    </div>
                    <Button type="submit" disabled={buyerSearching}>
                      {buyerSearching ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" aria-hidden="true" />
                          Search Buyer
                        </>
                      )}
                    </Button>
                  </form>

                  <AnimatePresence>
                    {buyerResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mb-6 rounded-xl border border-success/30 bg-success/5 p-5"
                      >
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <UserCheck className="h-4 w-4 text-success-foreground" aria-hidden="true" />
                            Buyer Record Found
                          </h3>
                          <Badge variant="success">KYC: {buyerResult.kycStatus}</Badge>
                        </div>
                        <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
                          <div>
                            <dt className="text-muted-foreground">Legal Name</dt>
                            <dd className="font-semibold text-foreground">{buyerResult.maskedName}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Email</dt>
                            <dd className="break-all font-semibold text-foreground">{buyerResult.email}</dd>
                          </div>
                          <div>
                            <dt className="text-muted-foreground">Phone</dt>
                            <dd className="font-mono font-semibold text-foreground">+91 {buyerResult.phone}</dd>
                          </div>
                        </dl>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 flex justify-between border-t pt-4">
                    <Button variant="outline" onClick={() => goTo(1)}>
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Back
                    </Button>
                    <Button disabled={!buyerResult} onClick={() => goTo(3)}>
                      Continue to Documents
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </motion.section>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.section
                key="step-3"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <CardHeader className="p-6 pb-2 sm:p-8 sm:pb-2">
                  <CardTitle className="text-lg">Step 3: Document Upload</CardTitle>
                  <CardDescription>
                    Upload the 5 required deeds (PDF, JPG, PNG up to 10 MB each). Cryptographic hashes are securely computed and signed by the server.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4 sm:p-8 sm:pt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {REQUIRED_DOC_TYPES.filter((t) => uploadedDocs[t]?.hash).length} of {REQUIRED_DOC_TYPES.length} uploaded
                    </span>
                  </div>
                  <div className="mb-6 flex flex-col gap-3">
                    {REQUIRED_DOC_TYPES.map((docType) => {
                      const docState = uploadedDocs[docType] || {};
                      const isUploaded = !!docState.hash;
                      const inputId = `doc-${docType}`;
                      const isDrag = dragOver === docType;

                      return (
                        <div
                          key={docType}
                          onDragOver={(e) => { e.preventDefault(); setDragOver(docType); }}
                          onDragLeave={() => setDragOver(null)}
                          onDrop={(e) => handleDrop(docType, e)}
                          className={cn(
                            'flex flex-col gap-3 rounded-xl border-2 border-dashed p-4 transition-colors sm:flex-row sm:items-center sm:justify-between',
                            isDrag
                              ? 'border-primary bg-primary/5'
                              : isUploaded
                              ? 'border-success/40 bg-success/5'
                              : docState.error
                              ? 'border-destructive/40 bg-destructive/5'
                              : 'bg-muted/20 hover:border-primary/40'
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-start gap-3">
                            <div
                              className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                isUploaded ? 'bg-success/15 text-success-foreground' : 'bg-primary/10 text-primary'
                              )}
                            >
                              {docState.loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                              ) : isUploaded ? (
                                <FileText className="h-5 w-5" aria-hidden="true" />
                              ) : (
                                <Upload className="h-5 w-5" aria-hidden="true" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Label htmlFor={inputId} className="block text-xs font-bold text-foreground">
                                {DOCUMENT_TYPE_LABELS[docType]} *
                              </Label>
                              {docState.fileName ? (
                                <span className="mt-0.5 flex items-center gap-1 truncate text-xs font-semibold text-success-foreground">
                                  <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
                                  File: {docState.fileName}
                                </span>
                              ) : (
                                <span className="text-[0.72rem] text-muted-foreground">
                                  Drag &amp; drop or select. Required format: PDF, JPG, PNG (Max 10 MB)
                                </span>
                              )}
                              {docState.hash && (
                                <span className="mt-0.5 block break-all font-mono text-[0.68rem] text-muted-foreground">
                                  Server Hash: {docState.hash.slice(0, 20)}...
                                </span>
                              )}
                              {docState.error && (
                                <span role="alert" className="mt-1 block text-xs font-semibold text-destructive">
                                  {docState.error}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0">
                            <Button asChild variant={isUploaded ? 'outline' : 'default'} size="sm" className="cursor-pointer">
                              <label htmlFor={inputId}>
                                <Upload className="h-3.5 w-3.5" aria-hidden="true" />
                                {docState.loading ? 'Uploading...' : isUploaded ? 'Replace File' : 'Select File'}
                              </label>
                            </Button>
                            <input
                              id={inputId}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(docType, e)}
                              className="sr-only"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex justify-between border-t pt-4">
                    <Button variant="outline" onClick={() => goTo(2)}>
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Back
                    </Button>
                    <Button disabled={!areAllDocsUploaded} onClick={() => goTo(4)}>
                      Review Application
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </CardContent>
              </motion.section>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <motion.section
                key="step-4"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                <CardHeader className="p-6 pb-2 sm:p-8 sm:pb-2">
                  <CardTitle className="text-lg">Step 4: Review and Submit</CardTitle>
                  <CardDescription>Confirm your transfer details before generating the initial submission record.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-4 sm:p-8 sm:pt-4">
                  <div className="mb-6 flex flex-col gap-4 text-xs">
                    {/* Property summary */}
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                        <Landmark className="h-4 w-4 text-primary" aria-hidden="true" />
                        Parcel to Transfer
                      </h3>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                        <div>
                          <dt className="text-muted-foreground">Property ID</dt>
                          <dd className="font-mono font-semibold text-foreground">{selectedProperty?.propertyId}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Khasra No</dt>
                          <dd className="font-semibold text-foreground">{selectedProperty?.khasraNumber}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Location</dt>
                          <dd className="text-foreground">Village {selectedProperty?.village}, Tehsil {selectedProperty?.tehsil}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Surface Area</dt>
                          <dd className="text-foreground"><span className="font-mono">{selectedProperty?.areaSqFt}</span> sq. ft</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Parties summary */}
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                        <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                        Parties
                      </h3>
                      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <dt className="text-muted-foreground">Seller (You)</dt>
                          <dd className="font-semibold text-foreground">{user.name}</dd>
                          <dd className="font-mono text-muted-foreground">+91 {user.phone || '9876543210'}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Buyer</dt>
                          <dd className="font-semibold text-foreground">{buyerResult?.maskedName}</dd>
                          <dd className="font-mono text-muted-foreground">+91 {buyerResult?.phone}</dd>
                        </div>
                      </dl>
                    </div>

                    {/* Documents summary */}
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                        <Files className="h-4 w-4 text-primary" aria-hidden="true" />
                        Attached Deeds ({REQUIRED_DOC_TYPES.length})
                      </h3>
                      <dl className="flex flex-col gap-1.5">
                        {REQUIRED_DOC_TYPES.map((t) => (
                          <div key={t} className="flex items-center justify-between gap-3">
                            <dt className="text-muted-foreground">{DOCUMENT_TYPE_LABELS[t]}</dt>
                            <dd className="flex items-center gap-1 truncate font-mono text-success-foreground">
                              <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
                              <span className="truncate">{uploadedDocs[t]?.fileName}</span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-between">
                    <Button variant="outline" disabled={submitting} onClick={() => goTo(3)}>
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                      Back
                    </Button>
                    <Button size="lg" disabled={submitting} onClick={() => setConfirmOpen(true)}>
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Submitting Transfer...
                        </>
                      ) : (
                        <>
                          <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                          Confirm &amp; Submit Application
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit this transfer application?</AlertDialogTitle>
            <AlertDialogDescription>
              Parcel <span className="font-mono">{selectedProperty?.propertyId}</span> will be transferred to{' '}
              {buyerResult?.maskedName}. Once submitted, the application enters registrar verification and cannot be edited.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review again</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitApplication}>Submit application</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
