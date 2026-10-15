import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Inbox,
  Link2,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import Section from '@/components/common/Section';
import StatCard from '@/components/common/StatCard';
import EmptyState from '@/components/common/EmptyState';
import { staggerContainer, staggerItem } from '@/components/common/Reveal';
import TransactionStatusPill from '@/components/TransactionStatusPill';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import applicationService from '../../services/applicationService';

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const [clock, setClock] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      setClock(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadAuthorityData() {
      try {
        const apps = await applicationService.getAllApplications();
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAuthorityData();
  }, []);

  // Stats derived from domain services
  const pendingReviews = applications.filter(
    (a) => a.applicationStatus === 'UNDER_VERIFICATION'
  ).length;

  const completedThisMonth = applications.filter(
    (a) => a.applicationStatus === 'COMPLETED'
  ).length;

  const needingAttention = applications.filter(
    (a) =>
      a.applicationStatus === 'FAILED' ||
      a.blockchainStatus === 'FAILED' ||
      a.blockchainStatus === 'SYNC_FAILED'
  ).length;

  const scheduledAppointments = applications.filter((a) => a.appointment).length;

  // Oldest 3 applications awaiting review
  const tasksAwaitingReview = applications
    .filter((a) => a.applicationStatus === 'UNDER_VERIFICATION')
    .slice(0, 3);

  const quickLinks = [
    { label: 'Application Queue', to: '/authority/applications', icon: ListChecks },
    { label: 'KYC Status Table', to: '/authority/ekyc', icon: ShieldCheck },
    { label: 'Blockchain Transactions', to: '/authority/registry', icon: Link2 },
  ];

  return (
    <AppShell portal="authority">
      <PageHeader
        eyebrow="Registrar Portal"
        title={
          <span className="flex flex-wrap items-center gap-2 sm:gap-3">
            Registrar Dashboard
            {clock && (
              <span
                className="rounded-md border bg-muted px-2.5 py-1 font-mono text-xs font-bold tabular-nums text-foreground"
                aria-live="off"
              >
                {clock}
              </span>
            )}
          </span>
        }
        description="Review transfer submissions and supervise blockchain ledger mutations"
        actions={
          <Button onClick={() => navigate('/authority/applications')}>
            Open Application Queue
            <ArrowRight aria-hidden="true" />
          </Button>
        }
      />

      {/* Derived Stats Overview */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="Registrar statistics">
        <StatCard
          label="Needing Attention"
          value={needingAttention}
          icon={AlertTriangle}
          tone="error"
          hint="Failed or sync retry needed"
          loading={loading}
          onClick={() => navigate('/authority/registry')}
          delay={0}
        />
        <StatCard
          label="Pending Reviews"
          value={pendingReviews}
          icon={Clock}
          tone="warning"
          hint="Awaiting officer audit"
          loading={loading}
          onClick={() => navigate('/authority/applications')}
          delay={0.05}
        />
        <StatCard
          label="Completed This Month"
          value={completedThisMonth}
          icon={CheckCircle2}
          tone="success"
          hint="Finalized and synchronized"
          loading={loading}
          delay={0.1}
        />
        <StatCard
          label="Scheduled Appointments"
          value={scheduledAppointments}
          icon={CalendarCheck}
          tone="info"
          hint="Physical verification slots"
          loading={loading}
          delay={0.15}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
        {/* Today's tasks */}
        <Section
          title="Today's Tasks"
          description="Oldest applications awaiting registrar review"
          className="mb-0"
        >
          {loading ? (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-9 w-40" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : tasksAwaitingReview.length === 0 ? (
            <Card>
              <EmptyState
                icon={Inbox}
                title="Queue is clear"
                description="No applications currently awaiting registrar review."
                action={
                  <Button variant="outline" onClick={() => navigate('/authority/applications')}>
                    View all applications
                    <ArrowRight aria-hidden="true" />
                  </Button>
                }
              />
            </Card>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
              {tasksAwaitingReview.map((app) => (
                <motion.div key={app.id} variants={staggerItem}>
                  <Card
                    className="card-interactive cursor-pointer"
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/authority/applications/${app.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/authority/applications/${app.id}`);
                      }
                    }}
                  >
                    <CardContent className="p-5 sm:p-6">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <TransactionStatusPill status={app.applicationStatus} />
                        <span className="text-xs text-muted-foreground">{app.submittedAt}</span>
                      </div>
                      <h4 className="mb-1 text-base font-bold text-foreground">
                        <span className="font-mono">{app.id}</span> · Parcel{' '}
                        <span className="font-mono">{app.propertyId}</span>
                      </h4>
                      <p className="mb-4 text-xs text-muted-foreground">
                        Seller: {app.sellerName} &rarr; Buyer: {app.buyerName} | Type: Sale Deed
                      </p>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/authority/applications/${app.id}`);
                        }}
                      >
                        Review Application
                        <ArrowRight aria-hidden="true" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </Section>

        {/* Quick Operations & Direct Navigation */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Operational Summary</CardTitle>
              <CardDescription>Live totals from the application register</CardDescription>
            </CardHeader>
            <CardContent className="text-xs">
              <dl className="flex flex-col">
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">Total Applications</dt>
                  <dd className="font-mono font-bold text-foreground">
                    {loading ? <Skeleton className="h-4 w-8" /> : applications.length}
                  </dd>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">Pending Review</dt>
                  <dd className="font-mono font-bold text-warning-foreground">
                    {loading ? <Skeleton className="h-4 w-8" /> : pendingReviews}
                  </dd>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">Scheduled Appointments</dt>
                  <dd className="font-mono font-bold text-info-foreground">
                    {loading ? <Skeleton className="h-4 w-8" /> : scheduledAppointments}
                  </dd>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2.5">
                  <dt className="text-muted-foreground">Finalized Mutations</dt>
                  <dd className="font-mono font-bold text-success-foreground">
                    {loading ? <Skeleton className="h-4 w-8" /> : completedThisMonth}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Direct Navigation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {quickLinks.map(({ label, to, icon: Icon }) => (
                <Button
                  key={to}
                  variant="outline"
                  className="group w-full justify-between"
                  onClick={() => navigate(to)}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="text-muted-foreground" aria-hidden="true" />
                    {label}
                  </span>
                  <ArrowRight
                    className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
