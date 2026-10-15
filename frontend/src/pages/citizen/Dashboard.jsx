import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Landmark,
  BadgeCheck,
  ArrowLeftRight,
  CalendarClock,
  ArrowRight,
  FilePlus2,
  ShieldCheck,
  CalendarDays,
  FileDown,
  Inbox,
  Download,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../services/propertyService';
import applicationService from '../../services/applicationService';
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

const QUICK_ACTIONS = [
  {
    title: 'New Transfer',
    description: 'Start a new land transfer mutation request',
    cta: 'Initiate Now',
    to: '/citizen/new-transfer',
    icon: FilePlus2,
  },
  {
    title: 'Verify Land',
    description: 'Verify title and synchronized records using Khasra',
    cta: 'Verify Now',
    to: '/citizen/verify-land',
    icon: ShieldCheck,
  },
  {
    title: 'Book Appointment',
    description: 'Schedule physical Sub-Registrar Office slot',
    cta: 'Book Slot',
    to: '/citizen/book-appointment',
    icon: CalendarDays,
  },
  {
    title: 'Download E-Registry',
    description: 'View and download finalized digital certificates',
    cta: 'Download',
    to: '/citizen/download-registry',
    icon: FileDown,
  },
];

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (user?.id) {
        try {
          const [props, apps] = await Promise.all([
            propertyService.getUserProperties(user.id),
            applicationService.getUserApplications(user.id),
          ]);
          setProperties(props);
          setApplications(apps);
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
  const upcomingAppointments = applications.filter((a) => a.appointment).length;

  // Recent activity derived from applications
  const recentActivities = applications.slice(0, 4).map((app) => ({
    id: app.id,
    title: `Transfer Application ${app.id}`,
    description: `Parcel ${app.propertyId}`,
    status: app.applicationStatus,
    time: app.completedAt || app.approvedAt || app.submittedAt || 'Recently',
    appId: app.id,
  }));

  const handleDownload = async (appId) => {
    const res = await documentService.downloadERegistry(appId);
    if (res?.isMockNotice) {
      toast.info(res.message);
    }
  };

  const today = new Date().toLocaleDateString('en-IN', {
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
        description="Manage your land records and transfer applications"
        actions={
          <div className="text-left sm:text-right">
            <div className="text-sm font-semibold text-foreground">{greeting()}</div>
            <div className="text-xs text-muted-foreground">{today}</div>
          </div>
        }
      />

      {/* Quick stats */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="Summary statistics">
        <StatCard label="Total Properties" value={totalProperties} icon={Landmark} tone="default" loading={loading} delay={0} />
        <StatCard label="Active Properties" value={activeProperties} icon={BadgeCheck} tone="success" loading={loading} delay={0.05} />
        <StatCard label="Transfers In Progress" value={transfersInProgress} icon={ArrowLeftRight} tone="warning" loading={loading} delay={0.1} />
        <StatCard label="Upcoming Appointments" value={upcomingAppointments} icon={CalendarClock} tone="info" loading={loading} delay={0.15} />
      </section>

      {/* Quick actions */}
      <Section title="Quick Actions">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5"
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.div key={action.to} variants={staggerItem} className="h-full">
                <Card
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(action.to)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(action.to);
                    }
                  }}
                  className="card-interactive group flex h-full cursor-pointer flex-col justify-between shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CardContent className="flex h-full flex-col p-5 sm:p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{action.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{action.description}</p>
                    <div className="mt-5 flex items-center justify-between text-xs font-bold text-primary">
                      <span>{action.cta}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </Section>

      {/* Recent activity */}
      <Section title="Recent Activity" description="Derived from your latest transfer applications">
        <Card className="shadow-card">
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
                title="No recent activity"
                description="No recent transfer activity recorded."
                action={
                  <Button size="sm" onClick={() => navigate('/citizen/new-transfer')}>
                    Start a transfer
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
                    {/* dot + line */}
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 self-start sm:self-auto"
                        onClick={() => navigate(`/citizen/applications/${act.appId}`)}
                      >
                        View Details
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                    </div>
                  </motion.li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </Section>

      {/* My properties */}
      <Section
        title="My Properties"
        actions={
          <Button variant="link" size="sm" className="px-0 text-xs font-bold" onClick={() => navigate('/citizen/properties')}>
            View All Properties
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        }
      >
        <Card className="overflow-hidden shadow-card">
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
                              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                              View
                            </Button>
                            {completedApp ? (
                              <Button size="sm" onClick={() => handleDownload(completedApp.id)}>
                                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                                Download
                              </Button>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span tabIndex={0} className="inline-flex">
                                    <Button size="sm" disabled aria-label="Download not available">
                                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
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
