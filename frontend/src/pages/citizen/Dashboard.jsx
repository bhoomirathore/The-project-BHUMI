import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Landmark,
  BadgeCheck,
  ArrowLeftRight,
  CalendarClock,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Inbox,
  Download,
  Eye,
  UploadCloud,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../services/propertyService';
import applicationService from '../../services/applicationService';
import appointmentService from '../../services/appointmentService';
import documentService from '../../services/documentService';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import Section from '@/components/common/Section';
import StatCard from '@/components/common/StatCard';
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (user?.id) {
        try {
          const [props, apps, appts] = await Promise.all([
            propertyService.getUserProperties(user.id),
            applicationService.getUserApplications(user.id),
            appointmentService.getUserAppointments(user.id),
          ]);
          setProperties(props);
          setApplications(apps);
          setAppointments(appts);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadDashboardData();
  }, [user]);

  // Derived stats
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === 'Active').length;
  const transfersInProgress = applications.filter(
    (a) => !['COMPLETED', 'REJECTED', 'FAILED'].includes(a.applicationStatus)
  ).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const scheduledUpcoming = appointments.filter(
    (a) => a.status === 'SCHEDULED' && a.date >= todayStr
  );
  const upcomingAppointmentsCount = scheduledUpcoming.length;
  const nextAppt = scheduledUpcoming[0] || null;

  // Check application status items derived from user applications
  const recentActivities = applications.slice(0, 4).map((app) => ({
    id: app.id,
    title: `Transfer Application ${app.id}`,
    description: `Property ${app.propertyId}`,
    status: app.applicationStatus,
    time: app.completedAt || app.approvedAt || app.submittedAt || (app.applicationStatus === 'DRAFT' ? 'Draft created' : 'Recently'),
    appId: app.id,
  }));

  const handleDownload = async (appId) => {
    const res = await documentService.downloadERegistry(appId);
    if (res?.isMockNotice) {
      toast.info(res.message);
    }
  };

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <AppShell portal="citizen">
      <PageHeader
        eyebrow="Citizen Portal"
        title={`Welcome back, ${user?.name || 'Rajesh Kumar Singh'}`}
        description="Manage your land records, appointments, and transfer applications in Madhya Pradesh."
        actions={
          <div className="text-left sm:text-right">
            <div className="text-sm font-semibold text-foreground">{greeting()}</div>
            <div className="text-xs text-muted-foreground">{todayFormatted}</div>
          </div>
        }
      />

      {/* 1. Quick stats */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="Summary statistics">
        <StatCard label="Total Properties" value={totalProperties} icon={Landmark} tone="default" loading={loading} delay={0} />
        <StatCard label="Active Properties" value={activeProperties} icon={BadgeCheck} tone="success" loading={loading} delay={0.05} />
        <StatCard label="Transfers In Progress" value={transfersInProgress} icon={ArrowLeftRight} tone="warning" loading={loading} delay={0.1} />
        <StatCard label="Upcoming Appointments" value={upcomingAppointmentsCount} icon={CalendarClock} tone="info" loading={loading} delay={0.15} />
      </section>

      {/* 2. Quick Actions: TWO cards */}
      <Section title="Quick Actions">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:gap-5">
          {/* Hero Card: Book Appointment (2/3 width on lg) */}
          <Link
            to="/citizen/book-appointment"
            className="group block lg:col-span-2 rounded-2xl bg-primary text-primary-foreground p-6 sm:p-7 shadow-card transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-foreground/15 text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <CalendarDays className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <Badge variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground text-xs font-semibold">
                    Primary Service
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Book an appointment</h3>
                <p className="mt-2 text-sm text-primary-foreground/80 max-w-xl leading-relaxed">
                  Start a property transfer or visit your Sub-Registrar Office. Pick a purpose, a date and a slot.
                </p>

                {/* Outline chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-2.5 py-1 text-xs font-medium text-primary-foreground">
                    Transfer
                  </span>
                  <span className="rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-2.5 py-1 text-xs font-medium text-primary-foreground">
                    Verification
                  </span>
                  <span className="rounded-full border border-primary-foreground/30 bg-primary-foreground/5 px-2.5 py-1 text-xs font-medium text-primary-foreground">
                    Record query
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t border-primary-foreground/15 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-background text-foreground px-4 py-2.5 text-xs font-bold shadow transition-transform group-hover:translate-x-0.5">
                    Book an appointment
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>

                  {nextAppt && (
                    <div className="flex items-center gap-2 text-xs text-primary-foreground/90 font-medium">
                      <span>Next appointment: {nextAppt.date}, {nextAppt.slot}, {nextAppt.office}</span>
                      {nextAppt.isDraft && (
                        <span className="inline-flex items-center gap-1 rounded bg-warning/20 border border-warning/40 px-1.5 py-0.5 text-[10px] font-bold text-warning-foreground">
                          <AlertCircle className="h-3 w-3" />
                          Documents pending
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary Card: Verify Land (1/3 width on lg) */}
          <Link
            to="/citizen/verify-land"
            className="group block lg:col-span-1 rounded-2xl border-2 border-primary/30 bg-card p-6 sm:p-7 shadow-card transition-all hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <ShieldCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Verify Land</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Check ownership records and download your E-Registry certificates.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                  Verify land
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </Section>

      {/* 3. Check Application Status (renamed from Recent Activity) */}
      <Section
        title="Check Application Status"
        description="Track every application you have submitted. Latest first."
        actions={
          <Button
            variant="link"
            size="sm"
            className="px-0 text-xs font-bold"
            onClick={() => navigate('/citizen/applications')}
          >
            View all applications
            <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
          </Button>
        }
      >
        <Card className="shadow-card border-border/80 bg-card">
          <CardContent className="p-5 sm:p-6">
            {loading ? (
              <div className="flex flex-col gap-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <EmptyState
                compact
                icon={Inbox}
                title="No applications to track yet"
                description="Once you submit a transfer through an appointment, you can track it here."
                action={
                  <Button size="sm" onClick={() => navigate('/citizen/book-appointment?purpose=TRANSFER')}>
                    Book an appointment
                  </Button>
                }
              />
            ) : (
              <ol className="relative flex flex-col">
                {recentActivities.map((act, idx) => (
                  <motion.li
                    key={act.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 * idx, duration: 0.35 }}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          'mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-card ring-2',
                          idx === 0 ? 'bg-primary ring-primary/30' : 'bg-muted-foreground/60 ring-border'
                        )}
                        aria-hidden="true"
                      />
                      {idx < recentActivities.length - 1 && (
                        <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-foreground">{act.title}</h4>
                          <TransactionStatusPill status={act.status} />
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{act.description}</p>
                        <span className="mt-1 block text-[0.68rem] text-muted-foreground/80">{act.time}</span>
                      </div>

                      {act.status === 'DRAFT' ? (
                        <Button
                          size="sm"
                          className="shrink-0 gap-1.5 font-bold self-start sm:self-auto min-h-[36px]"
                          onClick={() => navigate(`/citizen/applications/${act.appId}#documents`)}
                        >
                          <UploadCloud className="h-3.5 w-3.5" />
                          Upload documents
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0 gap-1.5 self-start sm:self-auto min-h-[36px]"
                          onClick={() => navigate(`/citizen/applications/${act.appId}`)}
                        >
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* 4. My properties */}
      <Section
        title="My Properties"
        actions={
          <Button variant="link" size="sm" className="px-0 text-xs font-bold" onClick={() => navigate('/citizen/properties')}>
            View All Properties
            <ArrowRight className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
          </Button>
        }
      >
        <Card className="overflow-hidden shadow-card border-border/80 bg-card">
          <div className="overflow-x-auto">
            <Table className="min-w-[640px] text-xs sm:text-sm">
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="px-4">Khasra No.</TableHead>
                  <TableHead className="px-4">Property ID</TableHead>
                  <TableHead className="px-4">Location</TableHead>
                  <TableHead className="px-4">Area (sq. ft)</TableHead>
                  <TableHead className="px-4">Status</TableHead>
                  <TableHead className="px-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [0, 1, 2].map((i) => (
                    <TableRow key={i}>
                      {[0, 1, 2, 3, 4, 5].map((c) => (
                        <TableCell key={c} className="px-4 py-3">
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="p-0">
                      <EmptyState
                        compact
                        icon={Landmark}
                        title="No properties yet"
                        description="No properties found registered under your account."
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((prop) => {
                    const completedApp = applications.find(
                      (a) => a.propertyId === prop.propertyId && a.hasERegistry
                    );
                    const isActive = prop.status === 'Active';

                    return (
                      <TableRow
                        key={prop.propertyId}
                        className="cursor-pointer hover:bg-muted/40"
                        onClick={() => navigate('/citizen/properties')}
                      >
                        <TableCell className="px-4 py-3 font-bold text-foreground">{prop.khasraNumber}</TableCell>
                        <TableCell className="px-4 py-3 font-mono text-muted-foreground">{prop.propertyId}</TableCell>
                        <TableCell className="px-4 py-3 text-muted-foreground">
                          Village {prop.village}, Tehsil {prop.tehsil}
                        </TableCell>
                        <TableCell className="px-4 py-3 font-mono">{prop.areaSqFt.toLocaleString()}</TableCell>
                        <TableCell className="px-4 py-3">
                          <Badge variant={isActive ? 'success' : 'warning'}>{prop.status}</Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate('/citizen/properties')}>
                              <Eye className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                              View
                            </Button>
                            {completedApp ? (
                              <Button size="sm" onClick={() => handleDownload(completedApp.id)}>
                                <Download className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                                Download
                              </Button>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span tabIndex={0} className="inline-flex">
                                    <Button size="sm" disabled aria-label="Download not available">
                                      <Download className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                                      Download
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>No finalized E-Registry available for this property</TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </Section>
    </AppShell>
  );
}
