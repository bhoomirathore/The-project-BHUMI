import React, { useState } from 'react';
import { Edit2, AlertCircle, FileText, Calendar, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
import { APPOINTMENT_PURPOSES, APPOINTMENT_PURPOSE_LABELS } from '@/utils/appointmentPurposes';

export default function ReviewStep({
  purpose,
  property,
  buyer,
  application,
  queryDetails,
  visitDetails,
  onEditStep,
  onConfirmSubmit,
  submitting,
  confirmed,
  onChangeConfirmed,
  error,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const isTransfer = purpose === APPOINTMENT_PURPOSES.TRANSFER;

  return (
    <div className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Review & Confirm Booking
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verify your booking information before scheduling your Sub-Registrar Office appointment.
        </p>
      </div>

      {isTransfer && (
        <Alert className="border-info/30 bg-info/10 text-info-foreground">
          <FileText className="h-4 w-4 text-info" />
          <AlertTitle className="font-bold">Document Upload Notice</AlertTitle>
          <AlertDescription className="text-xs">
            You will upload your documents on the next screen. Your application stays a draft until you submit them.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Section 1: Purpose */}
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Purpose of Visit
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(1)}
              className="h-7 gap-1 px-2 text-xs"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </Button>
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {APPOINTMENT_PURPOSE_LABELS[purpose] || purpose}
          </p>
          {queryDetails?.notes && (
            <p className="mt-1 text-xs text-muted-foreground">
              Notes: {queryDetails.notes}
            </p>
          )}
        </div>

        {/* Section 2: Property or Application Details */}
        {isTransfer && property && (
          <div className="rounded-xl border border-border/80 bg-card p-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Property to Transfer
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(2)}
                className="h-7 gap-1 px-2 text-xs"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
            </div>
            <dl className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Property ID</dt>
                <dd className="font-mono font-bold text-foreground">{property.propertyId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Khasra Number</dt>
                <dd className="font-semibold text-foreground">{property.khasraNumber}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="text-foreground">
                  Village {property.village}, Tehsil {property.tehsil}, {property.district}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Area & Type</dt>
                <dd className="text-foreground">
                  {property.areaSqFt?.toLocaleString()} sq. ft ({property.landType})
                </dd>
              </div>
            </dl>
          </div>
        )}

        {isTransfer && buyer && (
          <div className="rounded-xl border border-border/80 bg-card p-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Buyer Details
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(3)}
                className="h-7 gap-1 px-2 text-xs"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
            </div>
            <dl className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Buyer Name</dt>
                <dd className="font-semibold text-foreground">{buyer.maskedName || buyer.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="break-all font-semibold text-foreground">{buyer.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Mobile Phone</dt>
                <dd className="font-mono font-semibold text-foreground">+91 {buyer.phone}</dd>
              </div>
            </dl>
          </div>
        )}

        {purpose === APPOINTMENT_PURPOSES.APPLICATION_VISIT && application && (
          <div className="rounded-xl border border-border/80 bg-card p-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Linked Application
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(2)}
                className="h-7 gap-1 px-2 text-xs"
              >
                <Edit2 className="h-3 w-3" />
                Edit
              </Button>
            </div>
            <dl className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-muted-foreground">Application ID</dt>
                <dd className="font-mono font-bold text-foreground">{application.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Property ID</dt>
                <dd className="font-mono font-semibold text-foreground">{application.propertyId}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd className="font-semibold text-foreground">{application.applicationStatus}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* Section 3: Visit Details */}
        <div className="rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Appointment Schedule
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(isTransfer ? 4 : 3)}
              className="h-7 gap-1 px-2 text-xs"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </Button>
          </div>
          <dl className="mt-2 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Sub-Registrar Office</dt>
              <dd className="font-semibold text-foreground mt-0.5">{visitDetails.office}</dd>
              <dd className="text-muted-foreground">{visitDetails.district}, Madhya Pradesh</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Date & Slot</dt>
              <dd className="font-semibold text-foreground mt-0.5">
                {visitDetails.date} · <span className="font-mono text-primary font-bold">{visitDetails.slot}</span>
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Contact Mobile</dt>
              <dd className="font-mono font-semibold text-foreground mt-0.5">
                +91 {visitDetails.contactMobile}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Attendee</dt>
              <dd className="font-semibold text-foreground mt-0.5">
                {visitDetails.attendeeType === 'REPRESENTATIVE'
                  ? `Representative: ${visitDetails.repName} (+91 ${visitDetails.repMobile})`
                  : 'Self (Registered Citizen)'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex items-start space-x-3 rounded-xl border border-border/80 bg-muted/20 p-4 min-h-[44px]">
        <Checkbox
          id="confirm-details"
          checked={confirmed}
          onCheckedChange={onChangeConfirmed}
          className="mt-0.5"
        />
        <Label htmlFor="confirm-details" className="cursor-pointer text-xs leading-relaxed font-medium">
          I confirm these details are correct. I understand that false statements or invalid credentials are subject to rejection under the Registration Act.
        </Label>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-semibold">{error}</AlertDescription>
        </Alert>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Appointment Booking</AlertDialogTitle>
            <AlertDialogDescription>
              {isTransfer
                ? 'Your transfer application will be initialized as a draft, and your Sub-Registrar Office slot will be reserved. On the next screen, you will upload the required deeds.'
                : `Your appointment will be confirmed for ${visitDetails.date} at ${visitDetails.slot} at ${visitDetails.office}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Review again</AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting}
              onClick={() => {
                setDialogOpen(false);
                onConfirmSubmit();
              }}
            >
              {submitting ? 'Confirming...' : 'Confirm & Schedule'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="pt-2">
        <Button
          type="button"
          disabled={!confirmed || submitting}
          onClick={() => setDialogOpen(true)}
          className="w-full sm:w-auto font-bold px-8"
        >
          {submitting ? 'Processing...' : 'Schedule Appointment'}
        </Button>
      </div>
    </div>
  );
}
