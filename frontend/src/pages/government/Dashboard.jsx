import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Blocks, Building2, IndianRupee, Landmark, Radio, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import Section from '@/components/common/Section';
import StatCard from '@/components/common/StatCard';
import Reveal from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DIVISION_STREAM,
  BLOCKCHAIN_BLOCKS,
  HASH_VERIFIED_PCT,
  PROPERTIES_ON_PLATFORM,
  TEHSIL_COUNTS,
  TOTAL_REVENUE_RS,
  fmt,
  fmtCr,
} from '@/data/hqSampleData';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-2 text-xs text-popover-foreground shadow-lg">
      <div className="mb-1 font-semibold">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">{p.name}</span>
          <span className="font-mono font-semibold">{Number(p.value).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

function Trend({ children }) {
  return (
    <span className="inline-flex items-center gap-1 font-medium text-success-foreground">
      <TrendingUp className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function GovernmentDashboard() {
  const navigate = useNavigate();

  return (
    <AppShell portal="government">
      <PageHeader
        eyebrow="Government HQ"
        title="Madhya Pradesh Land Records & Governance HQ"
        description="Madhya Pradesh Overview (prototype · sample data)"
        actions={
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">HQ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-foreground">Directorate of Land Records, MP</span>
              <span className="text-[0.68rem] text-muted-foreground">State Administrator</span>
            </div>
          </div>
        }
      />

      {/* HQ Metrics Grid */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="HQ metrics">
        <StatCard
          label="Properties on Platform"
          value={fmt(PROPERTIES_ON_PLATFORM)}
          icon={Landmark}
          tone="success"
          hint={<Trend>+3.2% vs last month</Trend>}
          delay={0}
        />
        <StatCard
          label="Blockchain Blocks"
          value={BLOCKCHAIN_BLOCKS}
          icon={Blocks}
          tone="info"
          hint={<Trend>Hash-verified {HASH_VERIFIED_PCT}%</Trend>}
          delay={0.05}
        />
        <StatCard
          label="Tehsils Online"
          value={`${TEHSIL_COUNTS.active} / ${TEHSIL_COUNTS.all}`}
          icon={Radio}
          tone="success"
          hint={
            <span className="inline-flex items-center gap-1.5 font-medium text-success-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {TEHSIL_COUNTS.active} of {TEHSIL_COUNTS.all} Connected
            </span>
          }
          delay={0.1}
        />
        <StatCard
          label="Stamp Duty Revenue"
          value={fmtCr(TOTAL_REVENUE_RS)}
          icon={IndianRupee}
          tone="warning"
          hint={<Trend>+2.8% vs last month</Trend>}
          delay={0.15}
        />
      </section>

      {/* Regional Stream */}
      <Section
        title="District Land Transaction Stream"
        description="Sample pending application activity across Madhya Pradesh pilot districts"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <Card className="h-full shadow-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-[640px]">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="px-4">District</TableHead>
                        <TableHead className="px-4">Pending Applications</TableHead>
                        <TableHead className="px-4">Total Registered Area</TableHead>
                        <TableHead className="px-4">Sync Health</TableHead>
                        <TableHead className="px-4 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DIVISION_STREAM.map((row) => (
                        <TableRow
                          key={row.slug}
                          className="cursor-pointer hover:bg-muted/40"
                          onClick={() => navigate(`/government/analytics?district=${row.slug}`)}
                        >
                          <TableCell className="px-4 py-4 font-bold">
                            <span className="inline-flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                              {row.region}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-4 font-mono">{row.pendingApps.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="px-4 py-4 font-mono">{row.areaStr}</TableCell>
                          <TableCell className="px-4 py-4">
                            <Badge variant={row.allActive ? 'success' : 'warning'}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                              {row.syncHealth}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/government/analytics?district=${row.slug}`);
                              }}
                            >
                              View Analytics
                              <ArrowUpRight aria-hidden="true" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="h-full shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending Applications by District</CardTitle>
                <CardDescription>Sample application backlog per district</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DIVISION_STREAM} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="region"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      tickFormatter={(v) => v.split(' ')[0]}
                    />
                    <YAxis
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
                    <Bar
                      dataKey="pendingApps"
                      name="Pending Applications"
                      fill="hsl(var(--primary))"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={56}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </Section>
    </AppShell>
  );
}
