import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  FileStack,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import applicationService from '../../services/applicationService';
import transactionService from '../../services/transactionService';
import { trendData } from './dashboardMock';
import LiveClock from '@/components/registrar/LiveClock';
import PriorityWorkQueue from '@/components/registrar/PriorityWorkQueue';
import AppointmentsTimeline from '@/components/registrar/AppointmentsTimeline';
import LedgerActivityFeed from '@/components/registrar/LedgerActivityFeed';
import RecentActivityFeed from '@/components/registrar/RecentActivityFeed';
import TrendChart from '@/components/registrar/TrendChart';
import StatusDonut from '@/components/registrar/StatusDonut';
import PipelineFunnel from '@/components/registrar/PipelineFunnel';
import KeyFigures from '@/components/registrar/KeyFigures';

export default function Dashboard() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    applicationService
      .getAllApplications()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
    transactionService
      .getAllTransactions()
      .then(setTransactions)
      .catch(console.error)
      .finally(() => setTxLoading(false));
  }, []);

  // Metric derivations
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

  // Trend hint for "Completed This Month"
  const lastTwo = trendData.slice(-2);
  const completedTrend =
    lastTwo.length === 2
      ? (() => {
          const pct = Math.round(
            ((lastTwo[1].registrations - lastTwo[0].registrations) /
              lastTwo[0].registrations) *
              100
          );
          return pct >= 0 ? `+${pct}% vs last month` : `${pct}% vs last month`;
        })()
      : null;

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const headerDescription = (
    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <span>Sub-Registrar Office, Sadar</span>
      <span aria-hidden>·</span>
      <span>{todayStr}</span>
      <span aria-hidden>·</span>
      {needingAttention > 0 ? (
        <Badge variant="error">Ledger: {needingAttention} need attention</Badge>
      ) : (
        <Badge variant="success">Ledger: synced</Badge>
      )}
    </div>
  );

  const headerActions = (
    <Button
      variant="default"
      size="sm"
      onClick={() => navigate('/authority/applications')}
    >
      Open Application Queue
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );

  const headerTitle = (
    <span className="flex flex-wrap items-center gap-3">
      Registrar Dashboard
      <LiveClock />
    </span>
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <PageHeader
          eyebrow="Registrar Portal"
          title={headerTitle}
          description={headerDescription}
          actions={headerActions}
        />

        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Needing Attention"
            value={needingAttention}
            icon={AlertTriangle}
            tone="warning"
            hint="Failed or sync retry needed"
            loading={loading}
            onClick={() => navigate('/authority/applications')}
            delay={0}
          />
          <StatCard
            label="Pending Reviews"
            value={pendingReviews}
            icon={Clock}
            tone="info"
            hint="Awaiting officer audit"
            loading={loading}
            onClick={() => navigate('/authority/applications')}
            delay={1}
          />
          <StatCard
            label="Completed This Month"
            value={completedThisMonth}
            icon={CheckCircle2}
            tone="success"
            hint={completedTrend ?? 'All time completions'}
            loading={loading}
            delay={2}
          />
          <StatCard
            label="Scheduled Appointments"
            value={scheduledAppointments}
            icon={CalendarCheck}
            tone="primary"
            hint="Upcoming appointments"
            loading={loading}
            delay={3}
          />
        </div>

        {/* Tabbed content */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
              {/* Left: Priority Work Queue */}
              <PriorityWorkQueue
                applications={applications}
                loading={loading}
                navigate={navigate}
              />
              {/* Right column: stack of 3 cards */}
              <div className="flex flex-col gap-6">
                <AppointmentsTimeline
                  applications={applications}
                  loading={loading}
                />
                <LedgerActivityFeed
                  transactions={transactions}
                  loading={txLoading}
                />
                <RecentActivityFeed
                  applications={applications}
                  transactions={transactions}
                  loading={loading || txLoading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="flex flex-col gap-8">
              <TrendChart data={trendData} />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <StatusDonut applications={applications} loading={loading} />
                <PipelineFunnel applications={applications} loading={loading} />
              </div>
              <KeyFigures applications={applications} loading={loading} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
