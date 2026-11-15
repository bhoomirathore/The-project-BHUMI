import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PropertyStep({
  properties = [],
  selectedPropertyId,
  onSelectProperty,
  error,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 id="step-heading" className="text-lg font-bold text-foreground outline-none" tabIndex={-1}>
          Select Registered Property
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose an active property you own in Madhya Pradesh to initiate this transfer.
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
          No registered properties found for your account.
        </div>
      ) : (
        <RadioGroup
          value={selectedPropertyId}
          onValueChange={onSelectProperty}
          aria-label="Select property"
          className="flex flex-col gap-3"
        >
          {properties.map((prop) => {
            const isBlocked = prop.status !== 'Active';
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
                    ? 'cursor-pointer border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                    : 'cursor-pointer bg-card hover:border-primary/40'
                )}
              >
                <RadioGroupItem id={inputId} value={prop.propertyId} disabled={isBlocked} className="mt-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-foreground">{prop.propertyId}</span>
                    <Badge variant={isBlocked ? 'warning' : 'success'}>{prop.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Khasra No. <strong className="text-foreground">{prop.khasraNumber}</strong> · Village {prop.village}, Tehsil {prop.tehsil}, {prop.district}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Area: <span className="font-mono">{prop.areaSqFt?.toLocaleString()}</span> sq. ft · Type: {prop.landType}
                  </p>
                  {isBlocked && (
                    <p className="mt-1.5 text-xs font-semibold text-warning-foreground">
                      Transfer already in progress on this property.
                    </p>
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
