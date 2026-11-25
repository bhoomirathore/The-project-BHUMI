import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Landmark,
  ArrowRight,
  ShieldCheck,
  CalendarDays,
  Inbox,
  Download,
  Eye,
  UploadCloud,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  ChevronDown,
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
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

function statusVariant(status) {
  if (status === 'Active') return 'success';
  if (status === 'Transfer in progress') return 'warning';
  return 'neutral';
}

const ABOUT_STORAGE_KEY = 'bhumi_dashboard_about_open';

export default function CitizenDashboard() {
  const { user, loading: authLoading } = useAuth();
  const activeUser = user || { id: 'usr-citizen-rajesh', name: 'Rajesh Kumar Singh', role: 'CITIZEN' };
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Collapsible About section: collapsed by default on first visit, persisted in localStorage
  const [isAboutOpen, setIsAboutOpen] = useState(() => {
    try {
      const stored = localStorage.getItem(ABOUT_STORAGE_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    } catch (err) {
      console.error('Failed to read about open state from localStorage:', err);
    }
    return false; // Default state: collapsed on first visit
  });

  const toggleAboutOpen = () => {
    setIsAboutOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(ABOUT_STORAGE_KEY, String(next));
      } catch (err) {
        console.error('Failed to write about open state to localStorage:', err);
      }
      return next;
    });
  };

  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async (userId) => {
    setPropertiesLoading(true);
    setPropertiesError(null);
    try {
      const props = await propertyService.getUserProperties(userId);
      setProperties(props || []);
    } catch (err) {
      console.error('Failed to load properties', err);
      setPropertiesError('Unable to load your properties. Please try again.');
    } finally {
      setPropertiesLoading(false);
    }
  };

  const loadDashboardData = async (userId) => {
    try {
      const [apps, appts] = await Promise.all([
        applicationService.getUserApplications(userId),
        appointmentService.getUserAppointments(userId),
      ]);
      setApplications(apps || []);
      setAppointments(appts || []);
    } catch (err) {
      console.error('Failed to load applications/appointments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUserId = user?.id || 'usr-citizen-rajesh';
    if (currentUserId) {
      loadProperties(currentUserId);
      loadDashboardData(currentUserId);
    } else if (!authLoading) {
      setPropertiesLoading(false);
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  const handleRetryProperties = () => {
    const currentUserId = user?.id || 'usr-citizen-rajesh';
    if (currentUserId) {
      loadProperties(currentUserId);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const scheduledUpcoming = appointments.filter(
    (a) => a.status === 'SCHEDULED' && a.date >= todayStr
  );
  const nextAppt = scheduledUpcoming[0] || null;

  // Derive states from property data for subtitle
  const propertyStates = useMemo(() => {
    return Array.from(new Set(properties.map((p) => p.state).filter(Boolean)));
  }, [properties]);

  const pageDescription = useMemo(() => {
    if (propertyStates.length > 0) {
      return `Manage your land records, appointments, and transfer applications in ${propertyStates.join(', ')}.`;
    }
    return 'Manage your land records, appointments, and transfer applications.';
  }, [propertyStates]);

  // Derived property summary statistics
  const totalAreaSqFt = useMemo(() => {
    return properties.reduce((sum, p) => sum + (Number(p.areaSqFt) || 0), 0);
  }, [properties]);

  const areaConversion = useMemo(() => {
    if (!totalAreaSqFt) return '0.00 acres';
    const acres = totalAreaSqFt / 43560;
    if (acres < 0.01) {
      return `${acres.toFixed(3)} acres`;
    }
    return `${acres.toFixed(2)} acres`;
  }, [totalAreaSqFt]);

  const distinctLocations = useMemo(() => {
    const set = new Set();
    const result = [];
    for (const p of properties) {
      const loc = p.district && p.state ? `${p.district}, ${p.state}` : (p.district || p.state);
      if (loc && !set.has(loc)) {
        set.add(loc);
        result.push(loc);
      }
    }
    return result;
  }, [properties]);

  const visibleLocations = distinctLocations.slice(0, 3);
  const extraLocationsCount = distinctLocations.length - 3;

  const landTypes = useMemo(() => {
    const set = new Set();
    const result = [];
    for (const p of properties) {
      if (p.landType && !set.has(p.landType)) {
        set.add(p.landType);
        result.push(p.landType);
      }
    }
    return result;
  }, [properties]);

  const shortPropertyList = useMemo(() => properties.slice(0, 3), [properties]);

  // Derived location summary for header stats block: first district, state; +N if more
  const locationSummary = useMemo(() => {
    const districts = Array.from(new Set(properties.map((p) => p.district).filter(Boolean)));
    if (districts.length === 0) {
      return propertyStates[0] || '—';
    }
    const firstDistrict = districts[0];
    const firstState = properties.find((p) => p.district === firstDistrict)?.state || propertyStates[0] || '';
    const base = firstState ? `${firstDistrict}, ${firstState}` : firstDistrict;
    const extra = districts.length - 1;
    return extra > 0 ? `${base} +${extra}` : base;
  }, [properties, propertyStates]);

  const displayAvatar =
    activeUser?.avatar ||
    (activeUser?.name
      ? activeUser.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase()
      : 'C');

  const mobileStats = `${properties.length} ${
    properties.length === 1 ? 'property' : 'properties'
  } · ${totalAreaSqFt.toLocaleString()} sq. ft`;

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
        title={`Welcome back, ${activeUser?.name || 'Rajesh Kumar Singh'}`}
        description={pageDescription}
        actions={
          <div className="text-left sm:text-right">
            <div className="text-sm font-semibold text-foreground">{greeting()}</div>
            <div className="text-xs text-muted-foreground">{todayFormatted}</div>
          </div>
        }
      />

      {/* Collapsible About you section as a single styled Card */}
      <Card className="mb-8 sm:mb-10 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card transition-all hover:border-border hover:shadow-md">
        <button
          type="button"
          id="about-you-toggle"
          aria-expanded={isAboutOpen}
          aria-controls="about-you-content"
          onClick={toggleAboutOpen}
          className="group flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition-colors hover:bg-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {/* Left: Avatar + Name + subtitle */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Avatar className="h-11 w-11 shrink-0 shadow-sm ring-2 ring-background">
              <AvatarFallback className="bg-gradient-to-br from-primary to-muted-foreground font-bold text-primary-foreground text-sm">
                {displayAvatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-base font-semibold text-foreground">
                {activeUser?.name || 'Citizen'}
              </span>
              <span className="hidden md:inline text-xs text-muted-foreground">
                Citizen profile
              </span>
              <span className="md:hidden text-xs text-muted-foreground truncate">
                {mobileStats}
              </span>
            </div>
          </div>

          {/* Middle: 3 stat blocks (hidden below md breakpoint) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10 shrink-0">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Properties
              </div>
              <div className="text-sm font-semibold text-foreground font-mono">
                {propertiesLoading ? <Skeleton className="h-4 w-6 mt-0.5" /> : properties.length}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Area
              </div>
              <div className="text-sm font-semibold text-foreground font-mono">
                {propertiesLoading ? (
                  <Skeleton className="h-4 w-20 mt-0.5" />
                ) : (
                  `${totalAreaSqFt.toLocaleString()} sq. ft`
                )}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Location
              </div>
              <div className="text-sm font-semibold text-foreground">
                {propertiesLoading ? <Skeleton className="h-4 w-28 mt-0.5" /> : locationSummary}
              </div>
            </div>
          </div>

          {/* Right: Small circular chevron icon button */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-muted/40 text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-foreground">
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200 motion-reduce:transition-none',
                isAboutOpen && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isAboutOpen && (
            <motion.div
              id="about-you-content"
              role="region"
              aria-labelledby="about-you-toggle"
              initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.2 },
                    }
              }
              className="overflow-hidden"
            >
              <div className="border-t border-border/60 p-5 sm:p-6 sm:pt-6">
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                  {/* Left Block: Contact & Identification */}
                  <div>
                    <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Contact & Identification
                        </span>
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-primary/10 text-primary font-semibold text-xs"
                        >
                          Citizen
                        </Badge>
                      </div>
                      <dl className="flex flex-col gap-3 text-xs sm:text-sm">
                        {activeUser?.name && (
                          <div className="flex items-center gap-2.5">
                            <User className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <dt className="text-muted-foreground text-xs w-20 shrink-0">Full Name</dt>
                            <dd className="font-semibold text-foreground truncate">{activeUser.name}</dd>
                          </div>
                        )}
                        {activeUser?.phone && (
                          <div className="flex items-center gap-2.5">
                            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <dt className="text-muted-foreground text-xs w-20 shrink-0">Phone</dt>
                            <dd className="font-mono text-foreground">{activeUser.phone}</dd>
                          </div>
                        )}
                        {activeUser?.email && (
                          <div className="flex items-center gap-2.5">
                            <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                            <dt className="text-muted-foreground text-xs w-20 shrink-0">Email</dt>
                            <dd className="text-foreground break-all">{activeUser.email}</dd>
                          </div>
                        )}
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <dt className="text-muted-foreground text-xs w-20 shrink-0">Role</dt>
                          <dd className="font-medium text-foreground">Citizen</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Right Block: Property Summary */}
                  <div className="space-y-4">
                    {propertiesLoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-5 w-36" />
                          <Skeleton className="h-5 w-5 rounded-full" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Skeleton className="h-16 w-full rounded-lg" />
                          <Skeleton className="h-16 w-full rounded-lg" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-24 rounded-full" />
                            <Skeleton className="h-6 w-28 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-12 w-full rounded-lg" />
                          <Skeleton className="h-12 w-full rounded-lg" />
                        </div>
                      </div>
                    ) : propertiesError ? (
                      <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 rounded-lg border border-dashed border-destructive/40 bg-destructive/5">
                        <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
                        <div className="text-sm font-semibold text-foreground">Failed to load property summary</div>
                        <p className="text-xs text-muted-foreground">{propertiesError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRetryProperties}
                          className="mt-2"
                        >
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                          Retry
                        </Button>
                      </div>
                    ) : properties.length === 0 ? (
                      <EmptyState
                        compact
                        icon={Landmark}
                        title="No properties linked"
                        description="No properties linked to your account yet."
                        action={
                          <Button variant="outline" size="sm" onClick={() => navigate('/citizen/verify-land')}>
                            Verify Land
                          </Button>
                        }
                      />
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <h3 className="text-base font-bold text-foreground">Property Summary</h3>
                            <p className="text-xs text-muted-foreground">Your registered land holdings portfolio</p>
                          </div>
                          <Landmark className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
                        </div>

                        {/* Total Properties & Total Land Area */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Properties Owned
                            </span>
                            <div className="mt-1 text-2xl font-extrabold tracking-tight text-foreground font-mono">
                              {properties.length}
                            </div>
                          </div>
                          <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                              Total Land Area
                            </span>
                            <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                              <span className="text-2xl font-extrabold tracking-tight text-foreground font-mono">
                                {totalAreaSqFt.toLocaleString()}
                              </span>
                              <span className="text-xs font-medium text-muted-foreground">sq. ft</span>
                              <span className="text-xs font-semibold text-primary">
                                (≈ {areaConversion})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Locations & Land Types */}
                        <div className="space-y-2.5">
                          {distinctLocations.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                                Locations
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {visibleLocations.map((loc) => (
                                  <Badge key={loc} variant="outline" className="text-xs font-normal">
                                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" aria-hidden="true" />
                                    {loc}
                                  </Badge>
                                ))}
                                {extraLocationsCount > 0 && (
                                  <Badge variant="outline" className="text-xs font-semibold text-muted-foreground">
                                    +{extraLocationsCount} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {landTypes.length > 0 && (
                            <div>
                              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                                Land Types
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {landTypes.map((type) => (
                                  <Badge key={type} variant="secondary" className="text-xs font-medium">
                                    {type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Short list of up to 3 properties */}
                        <div className="space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Properties
                          </span>
                          <div className="flex flex-col gap-2">
                            {shortPropertyList.map((prop) => (
                              <div
                                key={prop.propertyId}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5 transition-colors hover:bg-muted/30"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold text-foreground truncate">
                                      {prop.propertyId}
                                    </span>
                                    {prop.khasraNumber && (
                                      <span className="text-[11px] text-muted-foreground font-medium">
                                        (Khasra {prop.khasraNumber})
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                                    <span>Village {prop.village}, Tehsil {prop.tehsil}</span>
                                    <span>•</span>
                                    <span className="font-mono">{prop.areaSqFt?.toLocaleString()} sq. ft</span>
                                  </div>
                                </div>
                                <div className="shrink-0 self-start sm:self-center">
                                  <Badge variant={statusVariant(prop.status)} className="text-[10px]">
                                    {prop.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border/60 flex justify-end">
                          <Link
                            to="/citizen/properties"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                          >
                            View all properties
                            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

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
                {loading || propertiesLoading ? (
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
