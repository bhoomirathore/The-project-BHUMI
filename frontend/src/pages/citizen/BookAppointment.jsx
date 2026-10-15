import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarCheck2, CalendarDays, Clock, Loader2, Building2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import applicationService from '../../services/applicationService';
import appointmentService from '../../services/appointmentService';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { cn } from '@/lib/utils';

export default function CitizenBookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedAppId = searchParams.get('applicationId');

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(preSelectedAppId || '');
  const [sroOffice, setSroOffice] = useState('Lucknow Sadar Sub-Registrar Office');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const offices = appointmentService.getOffices();
  const slots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

  useEffect(() => {
    async function loadApps() {
      if (user?.id) {
        try {
          const list = await applicationService.getUserApplications(user.id);
          setApplications(list);
          if (preSelectedAppId && list.some((a) => a.id === preSelectedAppId)) {
            setSelectedAppId(preSelectedAppId);
          } else if (list.length > 0 && !selectedAppId) {
            setSelectedAppId(list[0].id);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadApps();
  }, [user, preSelectedAppId]);

  const selectedApp = applications.find((a) => a.id === selectedAppId);
  const existingAppointment = selectedApp?.appointment;

  // Validate, then open confirmation dialog
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedAppId) {
      setErrorMsg('Please select a transfer application.');
      return;
    }

    if (!date) {
      setErrorMsg('Please select an appointment date.');
      return;
    }

    setConfirmOpen(true);
  };

  const confirmBooking = async () => {
    setConfirmOpen(false);
    setSubmitting(true);
    try {
      await appointmentService.bookAppointment(selectedAppId, {
        office: sroOffice,
        date,
        slot: selectedSlot,
      });

      // Update in local state
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selectedAppId
            ? { ...a, appointment: { office: sroOffice, date, slot: selectedSlot } }
            : a
        )
      );

      setBooked(true);
      toast.success('Appointment booked successfully! Your Sub-Registrar slot has been confirmed.');
    } catch (err) {
      const msg = err.message || 'Failed to book appointment.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title="Book Sub-Registrar Appointment"
        description="Schedule an in-person physical deed verification slot with the local Sub-Registrar Office"
      />

      <div className="max-w-[800px]">
        {loading ? (
          <Card className="shadow-card">
            <CardContent className="space-y-4 p-6">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-9 w-full" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card className="shadow-card">
            <EmptyState
              icon={FileText}
              title="No applications to schedule"
              description="You have no active transfer applications to schedule an appointment for."
              action={
                <Button onClick={() => navigate('/citizen/new-transfer')}>
                  Create Transfer Application
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              }
            />
          </Card>
        ) : booked && existingAppointment ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
            <Card className="border-success/30 shadow-card">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="relative mb-4">
                  <div className="absolute inset-0 animate-pulse-ring rounded-full bg-success/20" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-success-foreground">
                    <CalendarCheck2 className="h-8 w-8" aria-hidden="true" />
                  </div>
                </div>
                <h2 className="text-lg font-bold">Appointment booked successfully!</h2>
                <p className="mt-1 text-sm text-muted-foreground">Your Sub-Registrar slot has been confirmed.</p>
                <dl className="mt-6 grid w-full max-w-md grid-cols-1 gap-3 text-left text-xs sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <dt className="flex items-center gap-1 text-muted-foreground"><Building2 className="h-3.5 w-3.5" aria-hidden="true" /> Office</dt>
                    <dd className="mt-1 font-semibold text-foreground">{existingAppointment.office}</dd>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <dt className="flex items-center gap-1 text-muted-foreground"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Date</dt>
                    <dd className="mt-1 font-mono font-semibold text-foreground">{existingAppointment.date}</dd>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <dt className="flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> Slot</dt>
                    <dd className="mt-1 font-mono font-semibold text-foreground">{existingAppointment.slot}</dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button onClick={() => navigate(`/citizen/applications/${selectedAppId}`)}>
                    View Application
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/citizen/dashboard')}>Back to Dashboard</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="shadow-card">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-base">Appointment details</CardTitle>
              <CardDescription>Pick the application, office, date and a time slot.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {/* Application selector */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="application">Select Application *</Label>
                  <Select
                    value={selectedAppId}
                    onValueChange={(v) => {
                      setSelectedAppId(v);
                      setBooked(false);
                      setErrorMsg('');
                    }}
                  >
                    <SelectTrigger id="application" aria-label="Select application">
                      <SelectValue placeholder="Choose an application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          <span className="font-mono">{app.id}</span> · Parcel {app.propertyId} ({app.applicationStatus})
                          {app.appointment ? ' [Appointment Booked]' : ' [Pending Slot]'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {existingAppointment ? (
                  <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-5">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="text-sm font-bold text-foreground">Appointment Already Scheduled</span>
                      <Badge variant="success">Confirmed Slot</Badge>
                    </div>
                    <dl className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                      <div className="flex gap-2"><dt className="font-semibold text-foreground">Office:</dt><dd>{existingAppointment.office}</dd></div>
                      <div className="flex gap-2"><dt className="font-semibold text-foreground">Date:</dt><dd className="font-mono">{existingAppointment.date}</dd></div>
                      <div className="flex gap-2"><dt className="font-semibold text-foreground">Time Slot:</dt><dd className="font-mono">{existingAppointment.slot}</dd></div>
                    </dl>
                    <p className="mt-1 text-[0.72rem] text-muted-foreground">
                      Each application supports one official Sub-Registrar appointment. To review the case, navigate to application details.
                    </p>
                    <Button type="button" className="mt-2 self-start" onClick={() => navigate(`/citizen/applications/${selectedAppId}`)}>
                      View Application Detail
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Office */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="office">Sub-Registrar Office *</Label>
                      <Select value={sroOffice} onValueChange={setSroOffice}>
                        <SelectTrigger id="office" aria-label="Sub-Registrar office">
                          <SelectValue placeholder="Choose an office" />
                        </SelectTrigger>
                        <SelectContent>
                          {offices.map((off) => (
                            <SelectItem key={off} value={off}>{off}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="date">Appointment Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => { setDate(e.target.value); setErrorMsg(''); }}
                        min="2026-01-01"
                        required
                        aria-invalid={!!errorMsg && !date}
                      />
                      {errorMsg && (
                        <p role="alert" className="text-xs text-destructive">{errorMsg}</p>
                      )}
                    </div>

                    {/* Time slots */}
                    <fieldset className="flex flex-col gap-2">
                      <legend className="mb-2 text-sm font-medium">Available Time Slots *</legend>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {slots.map((slot) => {
                          const active = selectedSlot === slot;
                          return (
                            <Button
                              key={slot}
                              type="button"
                              variant={active ? 'default' : 'outline'}
                              aria-pressed={active}
                              onClick={() => setSelectedSlot(slot)}
                              className={cn('h-11 font-mono', active && 'ring-2 ring-primary/30')}
                            >
                              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                              {slot}
                            </Button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <Button type="submit" size="lg" disabled={submitting} className="mt-2">
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Booking Slot...
                        </>
                      ) : (
                        <>
                          <CalendarCheck2 className="h-4 w-4" aria-hidden="true" />
                          Confirm Appointment
                        </>
                      )}
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              Application <span className="font-mono">{selectedAppId}</span> at {sroOffice} on{' '}
              <span className="font-mono">{date}</span>, {selectedSlot}. Each application supports one official appointment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBooking}>Book slot</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
