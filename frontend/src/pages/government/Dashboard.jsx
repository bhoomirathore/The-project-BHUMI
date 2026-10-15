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

const REGIONS = [
  { region: 'Pune Region', mutations: 1420, area: '84,200 Hectares', areaHa: 84200, health: '100% Operational' },
  { region: 'Mumbai Metropolitan', mutations: 3890, area: '42,100 Hectares', areaHa: 42100, health: '100% Operational' },
];

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
        title="State Land Revenue & Governance HQ"
        description="State Overview (prototype)"
        actions={
          <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">HQ</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-foreground">Directorate of Land Records</span>
              <span className="text-[0.68rem] text-muted-foreground">State Administrator</span>
            </div>
          </div>
        }
      />

      {/* HQ Metrics Grid */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="HQ metrics">
        <StatCard
          label="Total Land Digitized"
          value="1.42 M"
          icon={Landmark}
          tone="success"
          hint={<Trend>+12.4% vs last quarter</Trend>}
          delay={0}
        />
        <StatCard
          label="Blockchain Blocks"
          value={10484}
          icon={Blocks}
          tone="info"
          hint={<Trend>100% Immutable</Trend>}
          delay={0.05}
        />
        <StatCard
          label="Tehsils Online"
          value="358 / 358"
          icon={Radio}
          tone="success"
          hint={
            <span className="inline-flex items-center gap-1.5 font-medium text-success-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Fully Connected
            </span>
          }
          delay={0.1}
        />
        <StatCard
          label="Stamp Duty Revenue"
          value="₹ 4,820 Cr"
          icon={IndianRupee}
          tone="warning"
          hint={<Trend>+8.1% target met</Trend>}
          delay={0.15}
        />
      </section>

      {/* Regional Stream */}
      <Section
        title="Regional Land Transaction Stream"
        description="Live mutation and registration activity across monitored regions"
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <Card className="h-full shadow-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-[640px]">
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="px-4">Region / District</TableHead>
                        <TableHead className="px-4">Active Mutations</TableHead>
                        <TableHead className="px-4">Total Registered Area</TableHead>
                        <TableHead className="px-4">Validator Health</TableHead>
                        <TableHead className="px-4 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {REGIONS.map((row) => (
                        <TableRow
                          key={row.region}
                          className="cursor-pointer hover:bg-muted/40"
                          onClick={() => navigate('/government/analytics')}
                        >
                          <TableCell className="px-4 py-4 font-bold">
                            <span className="inline-flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                              {row.region}
                            </span>
                          </TableCell>
                          <TableCell className="px-4 py-4 font-mono">{row.mutations.toLocaleString('en-IN')}</TableCell>
                          <TableCell className="px-4 py-4 font-mono">{row.area}</TableCell>
                          <TableCell className="px-4 py-4">
                            <Badge variant="success">
                              <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
                              {row.health}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate('/government/analytics');
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
                <CardTitle className="text-base">Active Mutations by Region</CardTitle>
                <CardDescription>Mutations currently in progress</CardDescription>
              </CardHeader>
              <CardContent className="h-[240px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REGIONS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
                      dataKey="mutations"
                      name="Active Mutations"
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
