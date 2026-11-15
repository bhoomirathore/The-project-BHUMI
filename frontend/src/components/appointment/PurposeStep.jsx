import React from 'react';
import { ArrowRightLeft, ClipboardCheck, Search, FileCheck2, HelpCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  APPOINTMENT_PURPOSES,
  APPOINTMENT_PURPOSE_LABELS,
  APPOINTMENT_PURPOSE_DESCRIPTIONS,
} from '@/utils/appointmentPurposes';
import UpcomingAppointmentsList from './UpcomingAppointmentsList';
import { cn } from '@/lib/utils';

const PURPOSE_ICONS = {
  [APPOINTMENT_PURPOSES.TRANSFER]: ArrowRightLeft,
  [APPOINTMENT_PURPOSES.APPLICATION_VISIT]: ClipboardCheck,
  [APPOINTMENT_PURPOSES.RECORD_QUERY]: Search,
  [APPOINTMENT_PURPOSES.CERTIFICATE_HELP]: FileCheck2,
  [APPOINTMENT_PURPOSES.OTHER]: HelpCircle,
};

export default function PurposeStep({
  purpose,
  onSelectPurpose,
  otherNote,
  onChangeOtherNote,
  upcomingAppointments = [],
  error,
}) {
  const purposes = [
    {
      id: APPOINTMENT_PURPOSES.TRANSFER,
      badge: 'Most common',
    },
    {
      id: APPOINTMENT_PURPOSES.APPLICATION_VISIT,
    },
    {
      id: APPOINTMENT_PURPOSES.RECORD_QUERY,
    },
    {
      id: APPOINTMENT_PURPOSES.CERTIFICATE_HELP,
    },
    {
      id: APPOINTMENT_PURPOSES.OTHER,
    },
  ];

  const noteTooShort = purpose === APPOINTMENT_PURPOSES.OTHER && otherNote.trim().length > 0 && otherNote.trim().length < 10;
  const noteTooLong = otherNote.trim().length > 300;

  return (
    <div className="space-y-6">
      <UpcomingAppointmentsList appointments={upcomingAppointments} />

      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Choose Appointment Purpose
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the service you require at your local Madhya Pradesh Sub-Registrar Office.
        </p>
      </div>

      <RadioGroup
        value={purpose}
        onValueChange={onSelectPurpose}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        aria-label="Appointment Purpose"
      >
        {purposes.map((item) => {
          const Icon = PURPOSE_ICONS[item.id];
          const isSelected = purpose === item.id;
          return (
            <Label
              key={item.id}
              htmlFor={`purpose-${item.id}`}
              className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                  : 'border-border/80 bg-card hover:bg-muted/40'
              )}
            >
              <RadioGroupItem value={item.id} id={`purpose-${item.id}`} className="mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
                  <span className="font-bold text-foreground text-sm">
                    {APPOINTMENT_PURPOSE_LABELS[item.id]}
                  </span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary text-[10px] font-semibold">
                    {item.badge}
                  </Badge>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {APPOINTMENT_PURPOSE_DESCRIPTIONS[item.id]}
                </p>
              </div>
            </Label>
          );
        })}
      </RadioGroup>

      {purpose === APPOINTMENT_PURPOSES.OTHER && (
        <div className="space-y-1.5 rounded-xl border border-border/80 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="other-note" className="text-sm font-semibold">
              Visit Purpose Description *
            </Label>
            <span className="text-xs text-muted-foreground font-mono">
              {otherNote.length}/300
            </span>
          </div>
          <Textarea
            id="other-note"
            value={otherNote}
            onChange={(e) => onChangeOtherNote(e.target.value)}
            placeholder="Please describe why you are visiting the Sub-Registrar Office (10-300 characters)..."
            rows={3}
            aria-invalid={noteTooShort || noteTooLong}
            aria-describedby="other-note-hint"
            maxLength={300}
            className={cn(
              (noteTooShort || noteTooLong) && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          <p id="other-note-hint" className="text-xs text-muted-foreground">
            {noteTooShort ? (
              <span className="text-destructive font-semibold">Must be at least 10 characters long.</span>
            ) : (
              'Briefly state your query or matter for the Sub-Registrar.'
            )}
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
