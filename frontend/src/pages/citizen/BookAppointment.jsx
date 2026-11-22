import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Calendar,
  Landmark,
  Users,
  FileText,
  HelpCircle,
  ClipboardCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import StepHeader from '@/components/common/StepHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

import propertyService from '@/services/propertyService';
import applicationService from '@/services/applicationService';
import appointmentService from '@/services/appointmentService';
import documentService from '@/services/documentService';
import { APPOINTMENT_PURPOSES } from '@/utils/appointmentPurposes';

import PurposeStep from '@/components/appointment/PurposeStep';
import PropertyStep from '@/components/appointment/PropertyStep';
import BuyerStep from '@/components/appointment/BuyerStep';
import TransferDetailsStep from '@/components/appointment/TransferDetailsStep';
import ApplicationSelectStep from '@/components/appointment/ApplicationSelectStep';
import QueryDetailsStep from '@/components/appointment/QueryDetailsStep';
import VisitStep from '@/components/appointment/VisitStep';
import DocumentsStep, { DOCUMENT_SLOTS } from '@/components/appointment/DocumentsStep';
import ReviewStep from '@/components/appointment/ReviewStep';
import BookingSummaryCard from '@/components/appointment/BookingSummaryCard';
import AppointmentSuccess from '@/components/appointment/AppointmentSuccess';

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
};

export default function BookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialPurposeParam = searchParams.get('purpose');
  const initialPropId = searchParams.get('propertyId');
  const initialAppId = searchParams.get('applicationId');

  // Determine initial purpose
  const getInitialPurpose = () => {
    if (initialAppId) return APPOINTMENT_PURPOSES.APPLICATION_VISIT;
    if (initialPurposeParam && APPOINTMENT_PURPOSES[initialPurposeParam]) {
      return initialPurposeParam;
    }
    return APPOINTMENT_PURPOSES.TRANSFER;
  };

  const [purpose, setPurpose] = useState(getInitialPurpose);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Data collections
  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  // Form states
  const [selectedPropertyId, setSelectedPropertyId] = useState(initialPropId || '');
  const [selectedApplicationId, setSelectedApplicationId] = useState(initialAppId || '');
  const [otherNote, setOtherNote] = useState('');

  // Buyer lookup state
  const [buyerQuery, setBuyerQuery] = useState('');
  const [buyerResult, setBuyerResult] = useState(null);
  const [buyerSearching, setBuyerSearching] = useState(false);
  const [buyerError, setBuyerError] = useState('');

  // Query details (for non-transfer)
  const [queryDetails, setQueryDetails] = useState({
    propertyId: '',
    notes: '',
  });

  // Visit details
  const [visitDetails, setVisitDetails] = useState({
    district: 'Bhopal',
    office: 'Huzur Sub-Registrar Office',
    date: '',
    slot: '',
    contactMobile: user?.phone || '9876543210',
    attendeeType: 'SELF',
    repName: '',
    repMobile: '',
    assistanceNeeded: false,
  });

  // Document upload state (keeping raw File objects in memory while wizard is open)
  const [uploadedDocuments, setUploadedDocuments] = useState({});
  const [documentUploading, setDocumentUploading] = useState({});
  const [slotErrors, setSlotErrors] = useState({});

  const [confirmed, setConfirmed] = useState(false);
  const [stepError, setStepError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Retry state if transfer app was created but appointment booking failed
  const [pendingApplication, setPendingApplication] = useState(null);
  const [createdAppointment, setCreatedAppointment] = useState(null);

  // Purpose change confirmation dialog
  const [pendingPurposeChange, setPendingPurposeChange] = useState(null);
  const [purposeChangeOpen, setPurposeChangeOpen] = useState(false);

  // Initial load
  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const [props, apps, appts] = await Promise.all([
          propertyService.getUserProperties(user.id),
          applicationService.getUserApplications(user.id),
          appointmentService.getUserAppointments(user.id),
        ]);
        setProperties(props);
        setApplications(apps);
        setUpcomingAppointments(appts);

        if (initialPropId && props.some((p) => p.propertyId === initialPropId && p.status === 'Active')) {
          setSelectedPropertyId(initialPropId);
        }
        if (initialAppId && apps.some((a) => a.id === initialAppId)) {
          setSelectedApplicationId(initialAppId);
        }
      } catch (err) {
        console.error('Error loading appointment booking data', err);
      }
    }
    loadData();
  }, [user?.id, initialPropId, initialAppId]);

  // Focus step heading on step change
  useEffect(() => {
    const el = document.getElementById('step-heading');
    if (el) {
      el.focus();
    }
  }, [step]);

  // Define steps according to active purpose:
  // TRANSFER is 5 steps: 1 Purpose, 2 Details, 3 Visit Details, 4 Documents, 5 Review.
  // Other purposes are 4 steps: 1 Purpose, 2 Details/Application, 3 Visit Details, 4 Review.
  const getSteps = () => {
    if (purpose === APPOINTMENT_PURPOSES.TRANSFER) {
      return [
        { num: 1, label: 'Purpose', icon: ArrowRightLeft },
        { num: 2, label: 'Details', icon: Landmark },
        { num: 3, label: 'Visit Details', icon: Calendar },
        { num: 4, label: 'Documents', icon: FileText },
        { num: 5, label: 'Review', icon: ClipboardCheck },
      ];
    }
    if (purpose === APPOINTMENT_PURPOSES.APPLICATION_VISIT) {
      return [
        { num: 1, label: 'Purpose', icon: ArrowRightLeft },
        { num: 2, label: 'Application', icon: FileText },
        { num: 3, label: 'Visit Details', icon: Calendar },
        { num: 4, label: 'Review', icon: ClipboardCheck },
      ];
    }
    return [
      { num: 1, label: 'Purpose', icon: ArrowRightLeft },
      { num: 2, label: 'Details', icon: HelpCircle },
      { num: 3, label: 'Visit Details', icon: Calendar },
      { num: 4, label: 'Review', icon: ClipboardCheck },
    ];
  };

  const currentSteps = getSteps();
  const selectedProperty = properties.find((p) => p.propertyId === selectedPropertyId);
  const selectedApp = applications.find((a) => a.id === selectedApplicationId);

  // Count uploaded document slots for TRANSFER
  const uploadedDocsCount = DOCUMENT_SLOTS.filter(
    (slot) => (uploadedDocuments[slot.id] || []).length > 0
  ).length;

  // Change purpose with safety dialog if user entered data
  const handleSelectPurpose = (newP) => {
    if (newP === purpose) return;
    const hasData =
      step > 1 ||
      selectedPropertyId ||
      buyerResult ||
      otherNote.trim().length > 0 ||
      queryDetails.notes.trim().length > 0;

    if (hasData) {
      setPendingPurposeChange(newP);
      setPurposeChangeOpen(true);
    } else {
      setPurpose(newP);
      setStep(1);
    }
  };

  const confirmPurposeChange = () => {
    if (pendingPurposeChange) {
      setPurpose(pendingPurposeChange);
      setStep(1);
      setSelectedPropertyId('');
      setSelectedApplicationId('');
      setBuyerResult(null);
      setBuyerQuery('');
      setOtherNote('');
      setQueryDetails({ propertyId: '', notes: '' });
      setStepError('');
      setSubmitError('');
      setPendingApplication(null);
      // NOTE: Per requirement, keep uploaded files in memory even if user changes purpose
    }
    setPurposeChangeOpen(false);
  };

  const goTo = (nextStep) => {
    setStepError('');
    setSubmitError('');
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  // Buyer lookup handler
  const handleSearchBuyer = async (e) => {
    if (e) e.preventDefault();
    setBuyerError('');
    if (!buyerQuery.trim()) {
      setBuyerError('Please enter a buyer email or phone number.');
      return;
    }
    try {
      setBuyerSearching(true);
      const res = await applicationService.lookupBuyer(buyerQuery.trim(), user.id);
      setBuyerResult(res);
      toast.success('Buyer account verified.');
    } catch (err) {
      setBuyerResult(null);
      setBuyerError(err.message || 'Buyer not found.');
    } finally {
      setBuyerSearching(false);
    }
  };

  // Document upload handler: stages file through documentService and keeps File object in memory
  const handleUploadDocumentFile = async (slotId, file, replaceIndex = -1) => {
    setDocumentUploading((prev) => ({ ...prev, [slotId]: true }));
    try {
      const res = await documentService.uploadDocument(file, slotId);
      const docRecord = {
        ...res,
        file, // Keep raw File object in memory
      };

      setUploadedDocuments((prev) => {
        const existing = prev[slotId] || [];
        if (replaceIndex >= 0 && existing.length > 0) {
          const updated = [...existing];
          updated[replaceIndex] = docRecord;
          return { ...prev, [slotId]: updated };
        }
        return {
          ...prev,
          [slotId]: [...existing, docRecord],
        };
      });

      setSlotErrors((prev) => ({ ...prev, [slotId]: '' }));
      setStepError('');
      return docRecord;
    } finally {
      setDocumentUploading((prev) => ({ ...prev, [slotId]: false }));
    }
  };

  // Document remove handler
  const handleRemoveDocumentFile = (slotId, docId) => {
    setUploadedDocuments((prev) => {
      const existing = prev[slotId] || [];
      const filtered = existing.filter((d) => d.docId !== docId);
      return {
        ...prev,
        [slotId]: filtered,
      };
    });
  };

  // Validation before advancing to next step
  const handleNext = () => {
    setStepError('');

    // Step 1: Purpose
    if (step === 1) {
      if (purpose === APPOINTMENT_PURPOSES.OTHER) {
        if (!otherNote.trim() || otherNote.trim().length < 10) {
          setStepError('Please describe your purpose (minimum 10 characters).');
          return;
        }
      }
      goTo(2);
      return;
    }

    // TRANSFER purpose (5 steps)
    if (purpose === APPOINTMENT_PURPOSES.TRANSFER) {
      if (step === 2) {
        if (!selectedPropertyId) {
          setStepError('Please select a property to transfer.');
          return;
        }
        if (selectedProperty?.status !== 'Active') {
          setStepError('The selected property is not active for new transfers.');
          return;
        }
        if (!buyerResult) {
          setStepError('Please search and verify the buyer before proceeding.');
          return;
        }
        goTo(3);
        return;
      }
      if (step === 3) {
        if (!validateVisit()) return;
        goTo(4);
        return;
      }
      if (step === 4) {
        const missingSlots = DOCUMENT_SLOTS.filter(
          (slot) => !(uploadedDocuments[slot.id] && uploadedDocuments[slot.id].length > 0)
        );
        if (missingSlots.length > 0) {
          setStepError(
            `Please upload all 7 required documents before proceeding. Missing: ${missingSlots.map((s) => s.label).join(', ')}`
          );
          return;
        }
        goTo(5);
        return;
      }
    }

    // APPLICATION_VISIT purpose (4 steps)
    if (purpose === APPOINTMENT_PURPOSES.APPLICATION_VISIT) {
      if (step === 2) {
        if (!selectedApplicationId) {
          setStepError('Please select an application to verify.');
          return;
        }
        goTo(3);
        return;
      }
      if (step === 3) {
        if (!validateVisit()) return;
        goTo(4);
        return;
      }
    }

    // Other purposes (4 steps)
    if (step === 2) {
      if (purpose === APPOINTMENT_PURPOSES.OTHER && (!queryDetails.notes.trim() || queryDetails.notes.trim().length < 10)) {
        setStepError('Please provide visit details (minimum 10 characters).');
        return;
      }
      goTo(3);
      return;
    }
    if (step === 3) {
      if (!validateVisit()) return;
      goTo(4);
      return;
    }
  };

  const validateVisit = () => {
    if (!visitDetails.office) {
      setStepError('Please select a Sub-Registrar Office.');
      return false;
    }
    if (!visitDetails.date) {
      setStepError('Please select an appointment date.');
      return false;
    }
    const d = new Date(`${visitDetails.date}T00:00:00`);
    if (d.getDay() === 0) {
      setStepError('Offices are closed on Sundays. Please choose another date.');
      return false;
    }
    if (!visitDetails.slot) {
      setStepError('Please select an available time slot.');
      return false;
    }
    if (!/^\d{10}$/.test((visitDetails.contactMobile || '').trim())) {
      setStepError('Please provide a valid 10-digit contact mobile number.');
      return false;
    }
    if (visitDetails.attendeeType === 'REPRESENTATIVE') {
      if (!visitDetails.repName?.trim()) {
        setStepError('Please enter the authorised representative name.');
        return false;
      }
      if (!/^\d{10}$/.test((visitDetails.repMobile || '').trim())) {
        setStepError('Please enter a valid 10-digit mobile number for the representative.');
        return false;
      }
    }
    return true;
  };

  // Submission handler
  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');

    try {
      if (purpose === APPOINTMENT_PURPOSES.TRANSFER) {
        // Flatten documents metadata for submission (excluding the raw File memory handle)
        const documentsPayload = Object.values(uploadedDocuments)
          .flat()
          .map(({ docId, type, fileName, size, fileSize, mimeType, hash }) => ({
            docId,
            type,
            fileName,
            size: size ?? fileSize ?? 0,
            mimeType: mimeType || 'application/octet-stream',
            hash: hash || '',
          }));

        let app = pendingApplication;

        // If transfer app wasn't created yet, create it in DRAFT mode
        if (!app) {
          app = await applicationService.createApplication({
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
            documents: documentsPayload,
          });
          setPendingApplication(app);
        }

        // Create appointment record linked to application and holding document metadata
        const apt = await appointmentService.createAppointment({
          purpose: APPOINTMENT_PURPOSES.TRANSFER,
          applicationId: app.id,
          propertyId: selectedPropertyId,
          office: visitDetails.office,
          date: visitDetails.date,
          slot: visitDetails.slot,
          contactMobile: visitDetails.contactMobile,
          attendee: {
            type: visitDetails.attendeeType,
            name: visitDetails.attendeeType === 'REPRESENTATIVE' ? visitDetails.repName : user.name,
            mobile: visitDetails.attendeeType === 'REPRESENTATIVE' ? visitDetails.repMobile : visitDetails.contactMobile,
          },
          assistanceNeeded: visitDetails.assistanceNeeded,
          notes: 'Transfer deed execution booking',
          documents: documentsPayload,
          userId: user.id,
        });

        setCreatedAppointment(apt);
        toast.success('Appointment scheduled and transfer application created.');
      } else {
        // Non-transfer purposes
        const apt = await appointmentService.createAppointment({
          purpose,
          applicationId: purpose === APPOINTMENT_PURPOSES.APPLICATION_VISIT ? selectedApplicationId : null,
          propertyId: queryDetails.propertyId || null,
          office: visitDetails.office,
          date: visitDetails.date,
          slot: visitDetails.slot,
          contactMobile: visitDetails.contactMobile,
          attendee: {
            type: visitDetails.attendeeType,
            name: visitDetails.attendeeType === 'REPRESENTATIVE' ? visitDetails.repName : user.name,
            mobile: visitDetails.attendeeType === 'REPRESENTATIVE' ? visitDetails.repMobile : visitDetails.contactMobile,
          },
          assistanceNeeded: visitDetails.assistanceNeeded,
          notes: queryDetails.notes || otherNote || '',
          documents: [],
          userId: user.id,
        });

        setCreatedAppointment(apt);
        toast.success('Appointment scheduled successfully.');
      }
    } catch (err) {
      console.error('Appointment booking failed', err);
      const msg = err.message || 'Failed to complete appointment booking.';
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAll = () => {
    setPurpose(APPOINTMENT_PURPOSES.TRANSFER);
    setStep(1);
    setSelectedPropertyId('');
    setSelectedApplicationId('');
    setBuyerResult(null);
    setBuyerQuery('');
    setOtherNote('');
    setQueryDetails({ propertyId: '', notes: '' });
    setUploadedDocuments({});
    setDocumentUploading({});
    setSlotErrors({});
    setPendingApplication(null);
    setCreatedAppointment(null);
    setConfirmed(false);
    setStepError('');
    setSubmitError('');
  };

  // Success screen
  if (createdAppointment) {
    return (
      <AppShell portal="citizen">
        <PageHeader
          eyebrow="Citizen Portal"
          title="Book an Appointment"
          description="Schedule a visit to your Madhya Pradesh Sub-Registrar Office"
        />
        <AppointmentSuccess
          appointment={createdAppointment}
          application={pendingApplication || selectedApp}
          purpose={purpose}
          property={selectedProperty}
          onReset={handleResetAll}
        />
      </AppShell>
    );
  }

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title="Book an Appointment"
        description="Schedule a visit to your Madhya Pradesh Sub-Registrar Office for property transfers, document verification, or land queries."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form Wizard on Left */}
        <div className="lg:col-span-2">
          <Card className="shadow-card border-border/80 overflow-hidden bg-card">
            <StepHeader steps={currentSteps} currentStep={step} />

            {/* Error alerts */}
            {submitError && (
              <div className="p-4 sm:p-5 pb-0">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Booking Failed</AlertTitle>
                  <AlertDescription className="text-xs">
                    {submitError}
                    {pendingApplication && (
                      <div className="mt-2">
                        <span>
                          Application <strong>{pendingApplication.id}</strong> has been initialized. You can retry booking the appointment below without creating a second application.
                        </span>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <PurposeStep
                      purpose={purpose}
                      onSelectPurpose={handleSelectPurpose}
                      otherNote={otherNote}
                      onChangeOtherNote={setOtherNote}
                      upcomingAppointments={upcomingAppointments}
                      error={stepError}
                    />
                  </motion.div>
                )}

                {/* Step 2 for TRANSFER: Transfer Details (Property & Buyer) */}
                {step === 2 && purpose === APPOINTMENT_PURPOSES.TRANSFER && (
                  <motion.div
                    key="step-2-transfer"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <TransferDetailsStep
                      properties={properties}
                      selectedPropertyId={selectedPropertyId}
                      onSelectProperty={setSelectedPropertyId}
                      buyerQuery={buyerQuery}
                      onChangeBuyerQuery={setBuyerQuery}
                      onSearchBuyer={handleSearchBuyer}
                      buyerSearching={buyerSearching}
                      buyerResult={buyerResult}
                      buyerError={buyerError}
                      error={stepError}
                    />
                  </motion.div>
                )}

                {/* Step 2 for APPLICATION_VISIT: Application Select */}
                {step === 2 && purpose === APPOINTMENT_PURPOSES.APPLICATION_VISIT && (
                  <motion.div
                    key="step-2-app"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <ApplicationSelectStep
                      applications={applications}
                      selectedApplicationId={selectedApplicationId}
                      onSelectApplication={setSelectedApplicationId}
                      error={stepError}
                    />
                  </motion.div>
                )}

                {/* Step 2 for Query/Other */}
                {step === 2 &&
                  purpose !== APPOINTMENT_PURPOSES.TRANSFER &&
                  purpose !== APPOINTMENT_PURPOSES.APPLICATION_VISIT && (
                    <motion.div
                      key="step-2-query"
                      custom={direction}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.25 }}
                    >
                      <QueryDetailsStep
                        properties={properties}
                        selectedPropertyId={queryDetails.propertyId}
                        onSelectProperty={(pId) => setQueryDetails((q) => ({ ...q, propertyId: pId }))}
                        notes={queryDetails.notes}
                        onChangeNotes={(n) => setQueryDetails((q) => ({ ...q, notes: n }))}
                        notesRequired={purpose === APPOINTMENT_PURPOSES.OTHER}
                        error={stepError}
                      />
                    </motion.div>
                  )}

                {/* Step 3: Visit Details (for all purposes) */}
                {step === 3 && (
                  <motion.div
                    key="step-visit"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <VisitStep
                      purpose={purpose}
                      visitDetails={visitDetails}
                      onChangeVisitDetails={(patch) => setVisitDetails((v) => ({ ...v, ...patch }))}
                      user={user}
                      error={stepError}
                    />
                  </motion.div>
                )}

                {/* Step 4 for TRANSFER ONLY: Documents Upload */}
                {step === 4 && purpose === APPOINTMENT_PURPOSES.TRANSFER && (
                  <motion.div
                    key="step-documents"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <DocumentsStep
                      documents={uploadedDocuments}
                      onUploadFile={handleUploadDocumentFile}
                      onRemoveFile={handleRemoveDocumentFile}
                      uploading={documentUploading}
                      slotErrors={slotErrors}
                      setSlotErrors={setSlotErrors}
                      error={stepError}
                    />
                  </motion.div>
                )}

                {/* Review Step: Step 5 for TRANSFER, Step 4 for other purposes */}
                {((step === 5 && purpose === APPOINTMENT_PURPOSES.TRANSFER) ||
                  (step === 4 && purpose !== APPOINTMENT_PURPOSES.TRANSFER)) && (
                  <motion.div
                    key="step-review"
                    custom={direction}
                    variants={slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                  >
                    <ReviewStep
                      purpose={purpose}
                      property={selectedProperty}
                      buyer={buyerResult}
                      application={selectedApp || pendingApplication}
                      queryDetails={queryDetails}
                      visitDetails={visitDetails}
                      documents={uploadedDocuments}
                      onEditStep={(s) => goTo(s)}
                      onConfirmSubmit={handleConfirmSubmit}
                      submitting={submitting}
                      confirmed={confirmed}
                      onChangeConfirmed={setConfirmed}
                      error={submitError}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Step Navigation Actions */}
              {step < currentSteps.length && (
                <div className="mt-8 flex justify-between border-t border-border/60 pt-4">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo(step - 1)}
                      className="gap-2 min-h-[44px]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-2 font-bold min-h-[44px] px-6"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Live Booking Summary on Right */}
        <div className="lg:col-span-1">
          <BookingSummaryCard
            purpose={purpose}
            property={selectedProperty}
            buyer={buyerResult}
            application={selectedApp || pendingApplication}
            visitDetails={visitDetails}
            documentsCount={uploadedDocsCount}
            className="sticky top-20"
          />
        </div>
      </div>

      {/* Purpose change confirmation dialog */}
      <AlertDialog open={purposeChangeOpen} onOpenChange={setPurposeChangeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Visit Purpose?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing the purpose will reset the form information you have entered so far. Would you like to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingPurposeChange(null)}>
              Keep Current Purpose
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPurposeChange}>
              Reset & Switch Purpose
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
