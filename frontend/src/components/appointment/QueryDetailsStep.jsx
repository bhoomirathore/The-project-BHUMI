import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const NONE_PROPERTY_VALUE = '__none__';

export default function QueryDetailsStep({
  properties = [],
  selectedPropertyId,
  onSelectProperty,
  notes,
  onChangeNotes,
  notesRequired = false,
  error,
}) {
  const noteLength = (notes || '').trim().length;
  const isTooShort = notesRequired && noteLength > 0 && noteLength < 10;
  const isTooLong = noteLength > 300;

  return (
    <div className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Service Details & Query
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Provide optional property context and describe your inquiry or correction request.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="property-select">Associated Property (Optional)</Label>
          <Select
            value={selectedPropertyId || NONE_PROPERTY_VALUE}
            onValueChange={(val) => onSelectProperty(val === NONE_PROPERTY_VALUE ? '' : val)}
          >
            <SelectTrigger id="property-select" aria-label="Associated Property">
              <SelectValue placeholder="Not about a specific property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE_PROPERTY_VALUE}>Not about a specific property</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.propertyId} value={p.propertyId}>
                  {p.propertyId} (Khasra {p.khasraNumber}, {p.village})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="query-notes">
              Details / Notes {notesRequired ? '*' : '(Optional)'}
            </Label>
            <span className="font-mono text-xs text-muted-foreground">
              {noteLength}/300
            </span>
          </div>
          <Textarea
            id="query-notes"
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            placeholder="Explain what assistance or correction you need at the Sub-Registrar Office..."
            rows={4}
            maxLength={300}
            aria-invalid={isTooShort || isTooLong}
            aria-describedby="query-notes-hint"
            className={cn((isTooShort || isTooLong) && 'border-destructive focus-visible:ring-destructive')}
          />
          <p id="query-notes-hint" className="text-xs text-muted-foreground">
            {isTooShort ? (
              <span className="text-destructive font-semibold">Minimum 10 characters required.</span>
            ) : (
              'Provide enough detail for the Sub-Registrar to prepare your records.'
            )}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs font-semibold text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
