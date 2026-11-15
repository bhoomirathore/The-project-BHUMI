import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Calendar, Clock, MapPin, UploadCloud, RotateCcw, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { APPOINTMENT_PURPOSES, APPOINTMENT_PURPOSE_LABELS, APPOINTMENT_DOCUMENTS_TO_CARRY } from '@/utils/appointmentPurposes';
import { DOCUMENT_TYPE_LABELS } from '@/utils/statuses';

export default function AppointmentSuccess({
  appointment,
  application,
  purpose,
  property,
  onReset,
}) {
  const navigate = useNavigate();
  const isTransfer = purpose === APPOINTMENT_PURPOSES.TRANSFER && application;

  const carryDocs =
    isTransfer
      ? [
          DOCUMENT_TYPE_LABELS.SALE_DEED,
          DOCUMENT_TYPE_LABELS.IDENTITY_PROOF,
          DOCUMENT_TYPE_LABELS.LAND_MAP,
          DOCUMENT_TYPE_LABELS.ENCUMBRANCE_CERT,
          DOCUMENT_TYPE_LABELS.TAX_RECEIPT,
          'Valid Government-issued Photo ID (Original)',
        ]
      : APPOINTMENT_DOCUMENTS_TO_CARRY[purpose] || [
          'Valid Government-issued Photo ID',
        ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-success/30 shadow-card bg-card">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-success/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground">Appointment Confirmed</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your appointment has been scheduled at the Sub-Registrar Office.
          </p>

          <div className="my-5 inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 font-mono text-base font-bold text-primary">
            <span>Reference:</span>
            <span>{appointment?.reference || 'APT-2026-CONFIRMED'}</span>
          </div>

          {/* Details summary */}
          <div className="w-full rounded-xl border border-border/80 bg-muted/20 p-4 text-left text-xs sm:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Purpose</span>
                <p className="font-semibold text-foreground text-sm mt-0.5">
                  {APPOINTMENT_PURPOSE_LABELS[purpose] || purpose}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Sub-Registrar Office</span>
                <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  {appointment?.office}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Appointment Date</span>
                <p className="font-semibold text-foreground mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  {appointment?.date}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Time Slot</span>
                <p className="font-mono font-bold text-primary mt-0.5 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {appointment?.slot}
                </p>
              </div>
            </div>

            {application && (
              <div className="mt-3 border-t border-border/60 pt-3">
                <span className="text-muted-foreground">Transfer Application ID</span>
                <p className="font-mono font-bold text-foreground mt-0.5">
                  {application.id}
                </p>
              </div>
            )}
          </div>

          {/* Notice for Transfer Draft */}
          {isTransfer && (
            <Alert className="mt-4 text-left border-warning/40 bg-warning/10 text-warning-foreground">
              <FileText className="h-4 w-4 text-warning" />
              <AlertTitle className="font-bold text-xs">Action Required: Upload Documents</AlertTitle>
              <AlertDescription className="text-xs mt-1">
                Your application is a draft until you upload and submit all 5 required documents. Please do this before your visit.
              </AlertDescription>
            </Alert>
          )}

          {/* What to carry */}
          <div className="mt-4 w-full rounded-xl border border-border/80 bg-card p-4 text-left text-xs">
            <span className="font-bold text-foreground">What to Bring to the Office:</span>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
              {carryDocs.map((doc, idx) => (
                <li key={idx}>{doc}</li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {isTransfer ? (
              <Button
                onClick={() => navigate(`/citizen/applications/${application.id}#documents`)}
                className="gap-2 font-bold px-6"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Documents
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : null}

            <Button
              variant="outline"
              onClick={() => navigate('/citizen/dashboard')}
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Button>

            <Button
              variant="ghost"
              onClick={onReset}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Book Another
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
