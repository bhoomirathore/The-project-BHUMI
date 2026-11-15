import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { cn } from '@/lib/utils';

export default function ApplicationSelectStep({
  applications = [],
  selectedApplicationId,
  onSelectApplication,
  error,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Select Application
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose an active application you wish to visit the Sub-Registrar Office for document verification.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
          No transfer applications found for your account.
        </div>
      ) : (
        <RadioGroup
          value={selectedApplicationId}
          onValueChange={onSelectApplication}
          aria-label="Select application"
          className="flex flex-col gap-3"
        >
          {applications.map((app) => {
            const hasAppointment = Boolean(app.appointment && app.appointment.date);
            const isSelected = selectedApplicationId === app.id;
            const inputId = `app-${app.id}`;

            return (
              <Label
                key={app.id}
                htmlFor={inputId}
                className={cn(
                  'flex items-start gap-4 rounded-xl border p-4 font-normal transition-all',
                  hasAppointment
                    ? 'cursor-not-allowed bg-muted/40 opacity-70'
                    : isSelected
                    ? 'cursor-pointer border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                    : 'cursor-pointer bg-card hover:border-primary/40'
                )}
              >
                <RadioGroupItem id={inputId} value={app.id} disabled={hasAppointment} className="mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{app.id}</span>
                    <TransactionStatusPill status={app.applicationStatus} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Property: <span className="font-mono font-medium text-foreground">{app.propertyId}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Buyer: <span className="font-semibold text-foreground">{app.buyerName}</span> · Seller: <span className="font-semibold text-foreground">{app.sellerName}</span>
                  </p>
                  {hasAppointment && (
                    <div className="mt-2 flex items-center gap-1.5 rounded bg-muted p-2 text-xs font-medium text-muted-foreground">
                      <span>Booked:</span>
                      <span className="font-semibold text-foreground">{app.appointment.office}</span>
                      <span>·</span>
                      <span className="font-mono">{app.appointment.date}</span>
                      <span>·</span>
                      <span className="font-mono">{app.appointment.slot}</span>
                    </div>
                  )}
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      )}

      {error && (
        <p className="text-xs font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
