import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Award,
  Clock,
  Download,
  FileText,
  IndianRupee,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AppShell from '@/components/layout/AppShell';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import Reveal from '@/components/common/Reveal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DEED_TYPES,
  DISTRICT_RANKINGS,
  APP_STATS,
  TOTAL_REVENUE_RS,
  AVG_MUTATION_DAYS,
  HASH_VERIFIED_PCT,
  NODE_UPTIME_PCT,
  fmt,
  fmtCr,
  fmtLakh,
} from '@/data/hqSampleData';

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-2 text-xs text-popover-foreground shadow-lg">
      {label && <div className="mb-1 font-semibold">{label}</div>}
      {payload.map((p) => (
        <div key={p.dataKey || p.name} className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color || p.payload?.color }} aria-hidden="true" />
            {p.name}
          </span>
          <span className="font-mono font-semibold">{formatter ? formatter(p.value, p) : Number(p.value).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

const AXIS_TICK = { fill: 'hsl(var(--muted-foreground))', fontSize: 11 };
const AXIS_LINE = { stroke: 'hsl(var(--border))' };

export default function GovernmentAnalytics() {
  const [selectedYear, setSelectedYear] = useState('2026');

  const deedChart = useMemo(
    () => DEED_TYPES.map((d) => ({ ...d, value: d.count })),
    []
  );
  const districtChart = useMemo(
    () =>
      DISTRICT_RANKINGS.map((d) => ({
        ...d,
        deedsNum: d.deeds,
        complianceNum: d.compliance,
      })),
    []
  );

  const handleExport = () => {
    toast.info(`Exporting Revenue & Deed Analytics Report for ${selectedYear} (PDF/CSV)...`);
  };

  return (
    <AppShell portal="government">
      <PageHeader
        eyebrow="Government HQ"
        title="Analytics"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            Deep insights across Madhya Pradesh districts, deed types &amp; timelines
            <Badge variant="warning" className="px-2 py-0.5 text-[0.68rem]">Sample data</Badge>
          </span>
        }
        actions={
          <>
            <div className="flex items-center gap-2">
              <Label htmlFor="analytics-year" className="sr-only">
                Year
              </Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="analytics-year" className="w-[110px]" aria-label="Select year">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExport}>
              <Download aria-hidden="true" />
              Export Report
            </Button>
          </>
        }
      />

      {/* Stat Summary Row */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4" aria-label="Summary">
        <StatCard
          label="Total Deeds"
          value={fmt(APP_STATS.completed)}
          icon={FileText}
          hint={
            <span className="inline-flex items-center gap-1 font-medium text-success-foreground">
              <TrendingUp className="h-3 w-3" aria-hidden="true" /> +3.2% vs last month
            </span>
          }
          delay={0}
        />
        <StatCard
          label="Stamp Revenue"
          value={fmtCr(TOTAL_REVENUE_RS)}
          icon={IndianRupee}
          tone="warning"
          hint={
            <span className="inline-flex items-center gap-1 font-medium text-success-foreground">
              <TrendingUp className="h-3 w-3" aria-hidden="true" /> +2.1% vs last month
            </span>
          }
          delay={0.05}
        />
        <StatCard
          label="Avg Mutation Time"
          value={`${AVG_MUTATION_DAYS} Days`}
          icon={Clock}
          tone="info"
          hint={
            <span className="inline-flex items-center gap-1 font-medium text-success-foreground">
              <TrendingDown className="h-3 w-3" aria-hidden="true" /> 0.9d faster vs last month
            </span>
          }
          delay={0.1}
        />
        <StatCard
          label="Blockchain Verification"
          value={`${HASH_VERIFIED_PCT}%`}
          icon={ShieldCheck}
          tone="success"
          hint={`${NODE_UPTIME_PCT}% node uptime`}
          delay={0.15}
        />
      </section>

      <Tabs defaultValue="overview" className="w-full">
        <div className="overflow-x-auto pb-1">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
        </div>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Reveal>
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Deed Classification Breakdown ({selectedYear})</CardTitle>
                  <CardDescription>Share of registered deeds by instrument type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deedChart}
                          dataKey="value"
                          nameKey="type"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={2}
                          stroke="hsl(var(--card))"
                          strokeWidth={2}
                        >
                          {deedChart.map((d) => (
                            <Cell key={d.type} fill={d.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <ul className="mt-2 flex flex-col gap-3" aria-label="Deed type distribution">
                    {DEED_TYPES.map((item) => (
                      <li key={item.type} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
                            {item.type}
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {fmt(item.count)} ({item.pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Top Performing Districts — Madhya Pradesh</CardTitle>
                  <CardDescription>Ranked by deeds registered in {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pb-2">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[480px]">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="px-4">Rank</TableHead>
                          <TableHead>District</TableHead>
                          <TableHead>Deeds</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead className="pr-4">Compliance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {DISTRICT_RANKINGS.map((row) => (
                          <TableRow key={row.rank} className="hover:bg-muted/40">
                            <TableCell className="px-4 py-3 font-bold">
                              <span className="inline-flex items-center gap-1.5">
                                {row.rank === 1 && <Award className="h-3.5 w-3.5 text-warning-foreground" aria-hidden="true" />}#{row.rank}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 font-semibold">{row.district}</TableCell>
                            <TableCell className="py-3 font-mono">{fmt(row.deeds)}</TableCell>
                            <TableCell className="py-3 font-mono">{fmtLakh(row.revenueRaw)}</TableCell>
                            <TableCell className="py-3 pr-4">
                              <Badge variant="success">{row.complianceStr}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </TabsContent>

        {/* REGIONAL */}
        <TabsContent value="regional" className="mt-4">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Deeds Registered by District — MP ({selectedYear})</CardTitle>
                  <CardDescription>Top five Madhya Pradesh districts by volume</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtChart} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey="district" tick={AXIS_TICK} tickLine={false} axisLine={AXIS_LINE} />
                      <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
                      <Bar dataKey="deedsNum" name="Deeds" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Compliance Rate</CardTitle>
                  <CardDescription>Digitization compliance by district</CardDescription>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={districtChart} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey="district" tick={AXIS_TICK} tickLine={false} axisLine={AXIS_LINE} />
                      <YAxis domain={[85, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
                      <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} cursor={{ stroke: 'hsl(var(--border))' }} />
                      <Line
                        type="monotone"
                        dataKey="complianceNum"
                        name="Compliance"
                        stroke="hsl(var(--success))"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: 'hsl(var(--success))', stroke: 'hsl(var(--card))', strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </TabsContent>

        {/* REVENUE */}
        <TabsContent value="revenue" className="mt-4">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Stamp Revenue vs Deeds by District</CardTitle>
                  <CardDescription>Revenue in ₹ Lakh alongside deed volume ({selectedYear})</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtChart} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey="district" tick={AXIS_TICK} tickLine={false} axisLine={AXIS_LINE} />
                      <YAxis yAxisId="left" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={AXIS_TICK} tickLine={false} axisLine={false} unit=" L" />
                      <Tooltip
                        content={
                          <ChartTooltip
                            formatter={(v, p) => (p.dataKey === 'revenueL' ? `₹ ${v} L` : Number(v).toLocaleString('en-IN'))}
                          />
                        }
                        cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }} />
                      <Bar yAxisId="left" dataKey="deedsNum" name="Deeds" fill="hsl(var(--primary) / 0.35)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                      <Bar yAxisId="right" dataKey="revenueL" name="Revenue (₹ Lakh)" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">Revenue Leaderboard</CardTitle>
                  <CardDescription>Stamp revenue collected per MP district</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {districtChart.map((row) => {
                    const max = districtChart[0].revenueL;
                    return (
                      <div key={row.rank} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">
                            <span className="mr-2 font-mono text-muted-foreground">#{row.rank}</span>
                            {row.district}
                          </span>
                          <span className="font-mono font-semibold">{fmtLakh(row.revenueRaw)}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-warning transition-all duration-500"
                            style={{ width: `${Math.round((row.revenueL / max) * 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
