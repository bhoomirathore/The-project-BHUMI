import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ChevronDown, ChevronUp, FileCheck2, User, Landmark, ClipboardList } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  APPOINTMENT_PURPOSES,
  APPOINTMENT_PURPOSE_LABELS,
  APPOINTMENT_DOCUMENTS_TO_CARRY,
} from '@/utils/appointmentPurposes';
import { DOCUMENT_TYPE_LABELS } from '@/utils/statuses';
import { cn } from '@/lib/utils';

export default function BookingSummaryCard({
  purpose,
  property,
  buyer,
  application,
  visitDetails,
  className,
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const carryDocs =
    purpose === APPOINTMENT_PURPOSES.TRANSFER
      ? [
          DOCUMENT_TYPE_LABELS.SALE_DEED,
          DOCUMENT_TYPE_LABELS.IDENTITY_PROOF,
          DOCUMENT_TYPE_LABELS.LAND_MAP,
          DOCUMENT_TYPE_LABELS.ENCUMBRANCE_CERT,
          DOCUMENT_TYPE_LABELS.TAX_RECEIPT,
          'Valid Government-issued Photo ID',
        ]
      : APPOINTMENT_DOCUMENTS_TO_CARRY[purpose] || [
          'Valid Government-issued Photo ID',
        ];

  const content = (
    <div className="space-y-4 text-xs">
      <div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Purpose
        </span>
        <div className="mt-1 font-bold text-foreground text-sm">
          {APPOINTMENT_PURPOSE_LABELS[purpose] || 'Select Purpose'}
        </div>
      </div>

      {property && (
        <div className="border-t border-border/60 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Property
          </span>
          <div className="mt-1 font-mono font-bold text-foreground">
            {property.propertyId}
          </div>
          <p className="mt-0.5 text-muted-foreground">
            Khasra {property.khasraNumber} · {property.village}, {property.district}
          </p>
        </div>
      )}

      {buyer && (
        <div className="border-t border-border/60 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Buyer
          </span>
          <div className="mt-1 font-semibold text-foreground">
            {buyer.maskedName || buyer.name}
          </div>
        </div>
      )}

      {application && (
        <div className="border-t border-border/60 pt-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Application
          </span>
          <div className="mt-1 font-mono font-bold text-foreground">
            {application.id}
          </div>
        </div>
      )}

      <div className="border-t border-border/60 pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Sub-Registrar Office
        </span>
        <div className="mt-1 flex items-start gap-1.5 font-medium text-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
          <span>{visitDetails?.office || 'Select Office'}</span>
        </div>
      </div>

      <div className="border-t border-border/60 pt-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Date & Time Slot
        </span>
        <div className="mt-1 flex flex-wrap items-center gap-3 font-semibold text-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {visitDetails?.date || 'Select Date'}
          </span>
          {visitDetails?.slot && (
            <span className="flex items-center gap-1 font-mono text-primary font-bold">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {visitDetails.slot}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-border/60 pt-3">
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <FileCheck2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>What to Carry</span>
        </div>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
          {carryDocs.map((doc, idx) => (
            <li key={idx} className="leading-tight text-[11px]">{doc}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <Card className={cn('shadow-card border-border/80 bg-card', className)}>
      <CardHeader className="p-4 sm:p-5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
            </div>
            <CardTitle className="text-base font-bold">Your Booking</CardTitle>
          </div>
          {/* Mobile toggle */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="h-8 px-2 text-xs lg:hidden"
            aria-expanded={mobileExpanded}
          >
            {mobileExpanded ? 'Hide' : 'Show details'}
            {mobileExpanded ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
          </Button>
        </div>
      </CardHeader>

      {/* On desktop always visible; on mobile collapsible */}
      <CardContent className="p-4 sm:p-5 pt-2">
        <div className="hidden lg:block">{content}</div>
        {mobileExpanded && <div className="mt-2 block lg:hidden border-t pt-3">{content}</div>}
      </CardContent>
    </Card>
  );
}
