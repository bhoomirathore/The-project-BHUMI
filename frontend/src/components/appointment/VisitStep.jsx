import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, FileCheck, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getDistricts } from '@/api/mock/locations';
import appointmentService from '@/services/appointmentService';
import {
  APPOINTMENT_PURPOSES,
  APPOINTMENT_DOCUMENTS_TO_CARRY,
} from '@/utils/appointmentPurposes';
import { DOCUMENT_TYPE_LABELS } from '@/utils/statuses';
import { cn } from '@/lib/utils';

const MORNING_SLOTS = ['10:00 AM', '11:30 AM'];
const AFTERNOON_SLOTS = ['02:00 PM', '04:00 PM'];

export default function VisitStep({
  purpose,
  visitDetails,
  onChangeVisitDetails,
  user,
  error,
}) {
  const [districts] = useState(() => getDistricts('Madhya Pradesh'));
  const [offices, setOffices] = useState([]);
  const [slotAvailability, setSlotAvailability] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dateError, setDateError] = useState('');

  // Calculate min (tomorrow) and max (60 days ahead) dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDay = new Date(today);
  maxDay.setDate(maxDay.getDate() + 60);

  const formatDateStr = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const minDate = formatDateStr(tomorrow);
  const maxDate = formatDateStr(maxDay);

  // Update offices when district changes
  useEffect(() => {
    if (visitDetails.district) {
      const list = appointmentService.getOfficesByDistrict(visitDetails.district);
      setOffices(list);
      if (!list.includes(visitDetails.office)) {
        onChangeVisitDetails({ office: list[0] || '' });
      }
    }
  }, [visitDetails.district]);

  // Validate Sunday & fetch slots
  useEffect(() => {
    const selectedDate = visitDetails.date;
    if (!selectedDate) {
      setDateError('');
      setSlotAvailability(null);
      return;
    }

    const d = new Date(`${selectedDate}T00:00:00`);
    if (d.getDay() === 0) {
      setDateError('Sub-Registrar Offices are closed on Sundays. Please pick another date.');
      setSlotAvailability(null);
      return;
    }
    setDateError('');

    if (visitDetails.office && selectedDate) {
      setLoadingSlots(true);
      appointmentService
        .getSlotAvailability(visitDetails.office, selectedDate)
        .then((res) => {
          setSlotAvailability(res);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoadingSlots(false);
        });
    }
  }, [visitDetails.office, visitDetails.date]);

  const handleDistrictChange = (d) => {
    onChangeVisitDetails({ district: d });
  };

  const handleOfficeChange = (o) => {
    onChangeVisitDetails({ office: o });
  };

  const handleDateChange = (e) => {
    onChangeVisitDetails({ date: e.target.value, slot: '' });
  };

  const handleSlotSelect = (s) => {
    onChangeVisitDetails({ slot: s });
  };

  // Documents to carry
  const carryDocs =
    purpose === APPOINTMENT_PURPOSES.TRANSFER
      ? [
          DOCUMENT_TYPE_LABELS.SALE_DEED,
          DOCUMENT_TYPE_LABELS.IDENTITY_PROOF,
          DOCUMENT_TYPE_LABELS.LAND_MAP,
          DOCUMENT_TYPE_LABELS.ENCUMBRANCE_CERT,
          DOCUMENT_TYPE_LABELS.TAX_RECEIPT,
          'Valid Government-issued Photo ID (Aadhaar / Voter ID / Passport)',
        ]
      : APPOINTMENT_DOCUMENTS_TO_CARRY[purpose] || [
          'Valid Government-issued Photo ID',
        ];

  const renderSlotGroup = (title, slots) => (
    <div>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </span>
      <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {slots.map((s) => {
          const status = slotAvailability ? slotAvailability[s] || 'AVAILABLE' : 'AVAILABLE';
          const isFull = status === 'FULL';
          const isSelected = visitDetails.slot === s;

          const slotBtn = (
            <button
              type="button"
              disabled={isFull || loadingSlots}
              onClick={() => handleSlotSelect(s)}
              className={cn(
                'flex items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-all min-h-[44px]',
                isFull
                  ? 'cursor-not-allowed bg-muted/40 opacity-60'
                  : isSelected
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/80 bg-card hover:border-primary/50'
              )}
            >
              <span className="flex items-center gap-2 font-mono font-bold">
                <Clock className="h-4 w-4" aria-hidden="true" />
                {s}
              </span>
              <span className="text-xs">
                {isFull ? (
                  <Badge variant="destructive" className="text-[10px]">Full</Badge>
                ) : status === 'FEW_LEFT' ? (
                  <Badge variant={isSelected ? 'outline' : 'warning'} className="text-[10px]">
                    Few left
                  </Badge>
                ) : (
                  <Badge variant={isSelected ? 'outline' : 'success'} className="text-[10px]">
                    Available
                  </Badge>
                )}
              </span>
            </button>
          );

          if (isFull) {
            return (
              <Tooltip key={s}>
                <TooltipTrigger asChild>
                  <div>{slotBtn}</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This time slot is full. Please select an alternate slot or date.</p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={s}>{slotBtn}</div>;
        })}
      </div>
    </div>
  );

  const phoneInvalid =
    visitDetails.contactMobile && !/^\d{10}$/.test(visitDetails.contactMobile.trim());
  const repMobileInvalid =
    visitDetails.attendeeType === 'REPRESENTATIVE' &&
    visitDetails.repMobile &&
    !/^\d{10}$/.test(visitDetails.repMobile.trim());

  return (
    <div className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Schedule SRO Visit
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select your local Sub-Registrar Office, appointment date, time slot, and attendee details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visit-district">District (Madhya Pradesh) *</Label>
          <Select value={visitDetails.district} onValueChange={handleDistrictChange}>
            <SelectTrigger id="visit-district" aria-label="District">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="visit-office">Sub-Registrar Office *</Label>
          <Select value={visitDetails.office} onValueChange={handleOfficeChange}>
            <SelectTrigger id="visit-office" aria-label="Sub-Registrar Office">
              <SelectValue placeholder="Select SRO office" />
            </SelectTrigger>
            <SelectContent>
              {offices.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="visit-date">Appointment Date *</Label>
        <Input
          id="visit-date"
          type="date"
          min={minDate}
          max={maxDate}
          value={visitDetails.date}
          onChange={handleDateChange}
          aria-invalid={!!dateError}
          aria-describedby={dateError ? 'date-error' : 'date-hint'}
          className={cn('w-full sm:w-1/2', dateError && 'border-destructive focus-visible:ring-destructive')}
        />
        {dateError ? (
          <p id="date-error" role="alert" className="text-xs text-destructive font-semibold">
            {dateError}
          </p>
        ) : (
          <p id="date-hint" className="text-xs text-muted-foreground">
            Offices open Mon–Sat (closed Sundays). Bookings available up to 60 days in advance.
          </p>
        )}
      </div>

      {visitDetails.date && !dateError && (
        <div className="space-y-4 rounded-xl border border-border/80 bg-muted/20 p-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold">Select Time Slot *</Label>
            {loadingSlots && <span className="text-xs text-muted-foreground">Checking availability...</span>}
          </div>

          {loadingSlots ? (
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          ) : (
            <div className="space-y-4">
              {renderSlotGroup('Morning Sessions', MORNING_SLOTS)}
              {renderSlotGroup('Afternoon Sessions', AFTERNOON_SLOTS)}
            </div>
          )}
        </div>
      )}

      {/* Contact and Attendee Details */}
      <div className="space-y-4 rounded-xl border border-border/80 bg-card p-5">
        <h3 className="text-sm font-bold text-foreground">Attendee & Contact Information</h3>

        <div className="flex flex-col gap-1.5 sm:w-1/2">
          <Label htmlFor="contact-mobile">Contact Mobile Number *</Label>
          <Input
            id="contact-mobile"
            type="tel"
            maxLength={10}
            value={visitDetails.contactMobile}
            onChange={(e) => onChangeVisitDetails({ contactMobile: e.target.value.replace(/\D/g, '') })}
            placeholder="10-digit mobile number"
            aria-invalid={phoneInvalid}
            aria-describedby="contact-mobile-hint"
            className={cn(phoneInvalid && 'border-destructive focus-visible:ring-destructive')}
          />
          <p id="contact-mobile-hint" className="text-xs text-muted-foreground">
            SMS confirmations and slot updates will be sent to this number.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-sm font-semibold">Who will attend the office? *</Label>
          <RadioGroup
            value={visitDetails.attendeeType}
            onValueChange={(val) => onChangeVisitDetails({ attendeeType: val })}
            className="flex flex-col gap-2 sm:flex-row sm:gap-6"
          >
            <div className="flex items-center space-x-2 min-h-[44px]">
              <RadioGroupItem value="SELF" id="att-self" />
              <Label htmlFor="att-self" className="cursor-pointer font-normal">
                Myself ({user?.name})
              </Label>
            </div>
            <div className="flex items-center space-x-2 min-h-[44px]">
              <RadioGroupItem value="REPRESENTATIVE" id="att-rep" />
              <Label htmlFor="att-rep" className="cursor-pointer font-normal">
                Authorised representative
              </Label>
            </div>
          </RadioGroup>
        </div>

        {visitDetails.attendeeType === 'REPRESENTATIVE' && (
          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rep-name">Representative Full Name *</Label>
              <Input
                id="rep-name"
                value={visitDetails.repName || ''}
                onChange={(e) => onChangeVisitDetails({ repName: e.target.value })}
                placeholder="Name as per government photo ID"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rep-mobile">Representative Mobile *</Label>
              <Input
                id="rep-mobile"
                type="tel"
                maxLength={10}
                value={visitDetails.repMobile || ''}
                onChange={(e) => onChangeVisitDetails({ repMobile: e.target.value.replace(/\D/g, '') })}
                placeholder="10-digit mobile number"
                aria-invalid={repMobileInvalid}
                className={cn(repMobileInvalid && 'border-destructive focus-visible:ring-destructive')}
              />
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2 min-h-[44px]">
          <Checkbox
            id="assistance"
            checked={visitDetails.assistanceNeeded}
            onCheckedChange={(checked) => onChangeVisitDetails({ assistanceNeeded: !!checked })}
          />
          <Label htmlFor="assistance" className="cursor-pointer text-xs font-normal">
            Special assistance requested (wheelchair accessibility or senior citizen priority)
          </Label>
        </div>
      </div>

      {/* Documents to carry panel */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-primary">
          <FileCheck className="h-4 w-4" aria-hidden="true" />
          <span>Documents to Carry for Your Visit</span>
        </div>
        <p className="mt-1 text-muted-foreground">
          Bring originals of all required records. Sub-Registrars inspect original documents before physical biometric execution.
        </p>
        <ul className="mt-2.5 list-disc space-y-1 pl-4 text-foreground">
          {carryDocs.map((doc, idx) => (
            <li key={idx} className="leading-relaxed">{doc}</li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="text-xs font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
