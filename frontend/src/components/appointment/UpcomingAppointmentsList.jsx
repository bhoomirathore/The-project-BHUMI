import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { APPOINTMENT_PURPOSES, APPOINTMENT_PURPOSE_LABELS } from '@/utils/appointmentPurposes';

export default function UpcomingAppointmentsList({ appointments = [] }) {
  if (!appointments || appointments.length === 0) return null;

  const top3 = appointments.slice(0, 3);

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Your Upcoming Appointments</h3>
        <span className="text-xs text-muted-foreground">{appointments.length} scheduled</span>
      </div>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {top3.map((apt) => (
          <Card key={apt.id || apt.reference} className="border-border/70 bg-card shadow-sm">
            <CardContent className="p-3.5 text-xs">
              <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-border/50">
                <span className="font-mono font-bold text-foreground">{apt.reference}</span>
                <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                  {apt.status}
                </Badge>
              </div>
              <div className="mt-2 font-medium text-foreground truncate">
                {APPOINTMENT_PURPOSE_LABELS[apt.purpose] || apt.purpose}
              </div>
              <div className="mt-1.5 space-y-1 text-muted-foreground">
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3 w-3 shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">{apt.office}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {apt.date}
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {apt.slot}
                  </span>
                </div>
              </div>
              {apt.purpose === APPOINTMENT_PURPOSES.TRANSFER && (
                <div className="mt-2 flex items-center">
                  <Badge variant="secondary" className="text-[10px] font-medium gap-1 px-1.5 py-0.5">
                    <FileText className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    7 documents
                  </Badge>
                </div>
              )}
              {apt.isDraft && (
                <div className="mt-2 flex items-center gap-1 rounded bg-warning/15 px-2 py-1 text-[11px] font-medium text-warning-foreground border border-warning/30">
                  <AlertCircle className="h-3 w-3 shrink-0 text-warning" aria-hidden="true" />
                  <span>Documents pending</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
