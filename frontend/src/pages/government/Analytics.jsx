import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  TOTAL_REVENUE_RS,
  AVG_MUTATION_DAYS,
  HASH_VERIFIED_PCT,
  NODE_UPTIME_PCT,
  TOTAL_COMPLETED_DEEDS,
  DISTRICT_ANALYTICS_MAP,
  VALID_DISTRICT_SLUGS,
  PILOT_DISTRICTS_META,
  STATE_KPIS,
  fmt,
  fmtCr,
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
  const [searchParams, setSearchParams] = useSearchParams();

  // District routing & URL query state (?district=bhopal)
  const districtParam = searchParams.get('district')?.toLowerCase();
  const isDistrictSelected = Boolean(districtParam && VALID_DISTRICT_SLUGS.includes(districtParam));
  const selectedDistrict = isDistrictSelected ? districtParam : 'all';
  const activeDistrict = isDistrictSelected ? DISTRICT_ANALYTICS_MAP[selectedDistrict] : null;

  const handleDistrictChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      newParams.delete('district');
    } else {
      newParams.set('district', value);
    }
    setSearchParams(newParams);
  };

  // Recomputed KPIs for selection (District or Statewide)
  const currentKpis = activeDistrict || STATE_KPIS;
  const currentDeedsTotal = currentKpis.deeds;
  const currentDeedTypes = activeDistrict ? activeDistrict.deedTypes : DEED_TYPES;

  const deedChart = useMemo(
    () => currentDeedTypes.map((d) => ({ ...d, value: d.count })),
    [currentDeedTypes]
  );

  const districtChart = useMemo(
    () =>
      DISTRICT_RANKINGS.map((d) => ({
        ...d,
        name: d.district,
        deedsNum: d.deeds,
        complianceNum: d.compliance,
        revenueNum: d.revenueCr,
      })),
    []
  );

  const tehsilChart = useMemo(
    () =>
      activeDistrict
        ? activeDistrict.tehsils.map((t) => ({
            ...t,
            deedsNum: t.deeds,
            complianceNum: t.compliance,
            revenueNum: t.revenueCr,
          }))
        : [],
    [activeDistrict]
  );

  // Active chart data depending on selection
  const regionalData = isDistrictSelected ? tehsilChart : districtChart;
  const xAxisKey = isDistrictSelected ? 'name' : 'district';
  const leaderboardData = isDistrictSelected ? tehsilChart : districtChart;
  const maxLeaderboardRevenue = leaderboardData[0]?.revenueNum || 1;

  const handleExport = () => {
    toast.info(`Exporting Revenue & Deed Analytics Report for ${currentKpis.name} (${selectedYear})...`);
  };

  return (
    <AppShell portal="government">
      <PageHeader
        eyebrow="Government HQ"
        title="Analytics"
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            {isDistrictSelected
              ? `Deep insights for ${activeDistrict.name}, deed types & timelines`
              : 'Deep insights across Madhya Pradesh districts, deed types & timelines'}
            <Badge variant="warning" className="px-2 py-0.5 text-[0.68rem]">Sample data</Badge>
          </span>
        }
        actions={
          <>
            <div className="flex items-center gap-2">
              <Label htmlFor="analytics-district" className="sr-only">
                District
              </Label>
              <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                <SelectTrigger id="analytics-district" className="w-[170px]" aria-label="Select district">
                  <SelectValue placeholder="All Madhya Pradesh" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Madhya Pradesh</SelectItem>
                  {PILOT_DISTRICTS_META.map((d) => (
                    <SelectItem key={d.slug} value={d.slug}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="analytics-year" className="sr-only">
                Year
              </Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger id="analytics-year" className="w-[100px]" aria-label="Select year">
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
          value={fmt(currentKpis.deeds)}
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
          value={fmtCr(currentKpis.revenueRaw)}
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
          value={`${currentKpis.avgMutationDays} Days`}
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
          value={`${currentKpis.verificationPct}%`}
          icon={ShieldCheck}
          tone="success"
          hint={`${currentKpis.nodeUptimePct || NODE_UPTIME_PCT}% node uptime`}
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
                  <CardDescription>
                    {isDistrictSelected
                      ? `Share of registered deeds by instrument type in ${activeDistrict.name}`
                      : 'Share of registered deeds by instrument type across Madhya Pradesh'}
                  </CardDescription>
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
                    {currentDeedTypes.map((item) => {
                      const pct = currentDeedsTotal > 0 ? parseFloat(((item.count / currentDeedsTotal) * 100).toFixed(1)) : 0;
                      return (
                        <li key={item.type} className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
                              {item.type}
                            </span>
                            <span className="font-mono text-muted-foreground">
                              {fmt(item.count)} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">
                    {isDistrictSelected ? `Tehsils in ${activeDistrict.name}` : 'Top Performing Districts — Madhya Pradesh'}
                  </CardTitle>
                  <CardDescription>Ranked by deeds registered in {selectedYear}</CardDescription>
                </CardHeader>
                <CardContent className="p-0 pb-2">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[480px]">
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="px-4">Rank</TableHead>
                          <TableHead>{isDistrictSelected ? 'Tehsil' : 'District'}</TableHead>
                          <TableHead>Deeds</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead className="pr-4">Compliance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isDistrictSelected
                          ? activeDistrict.tehsils.map((row) => (
                              <TableRow key={row.name} className="hover:bg-muted/40">
                                <TableCell className="px-4 py-3 font-bold">
                                  <span className="inline-flex items-center gap-1.5">
                                    {row.rank === 1 && <Award className="h-3.5 w-3.5 text-warning-foreground" aria-hidden="true" />}#{row.rank}
                                  </span>
                                </TableCell>
                                <TableCell className="py-3 font-semibold">{row.name}</TableCell>
                                <TableCell className="py-3 font-mono">{fmt(row.deeds)}</TableCell>
                                <TableCell className="py-3 font-mono">{fmtCr(row.revenueRaw)}</TableCell>
                                <TableCell className="py-3 pr-4">
                                  <Badge variant="success">{row.complianceStr}</Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          : DISTRICT_RANKINGS.map((row) => (
                              <TableRow key={row.rank} className="hover:bg-muted/40">
                                <TableCell className="px-4 py-3 font-bold">
                                  <span className="inline-flex items-center gap-1.5">
                                    {row.rank === 1 && <Award className="h-3.5 w-3.5 text-warning-foreground" aria-hidden="true" />}#{row.rank}
                                  </span>
                                </TableCell>
                                <TableCell className="py-3 font-semibold">{row.district}</TableCell>
                                <TableCell className="py-3 font-mono">{fmt(row.deeds)}</TableCell>
                                <TableCell className="py-3 font-mono">{fmtCr(row.revenueRaw)}</TableCell>
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
                  <CardTitle className="text-base">
                    {isDistrictSelected
                      ? `Deeds Registered by Tehsil — ${activeDistrict.name} (${selectedYear})`
                      : `Deeds Registered by District — MP (${selectedYear})`}
                  </CardTitle>
                  <CardDescription>
                    {isDistrictSelected
                      ? `Volume across tehsils in ${activeDistrict.name}`
                      : 'Top five Madhya Pradesh districts by volume'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey={xAxisKey} tick={AXIS_TICK} tickLine={false} axisLine={AXIS_LINE} />
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
                  <CardDescription>
                    {isDistrictSelected
                      ? `Digitization compliance across tehsils in ${activeDistrict.name}`
                      : 'Digitization compliance by district'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={regionalData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey={xAxisKey} tick={AXIS_TICK} tickLine={false} axisLine={AXIS_LINE} />
                      <YAxis domain={isDistrictSelected ? [80, 100] : [85, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
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
                  <CardTitle className="text-base">
                    {isDistrictSelected ? 'Stamp Revenue vs Deeds by Tehsil' : 'Stamp Revenue vs Deeds by District'}
                  </CardTitle>
                  <CardDescription>
                    {isDistrictSelected
                      ? `Revenue in ₹ Crore alongside deed volume in ${activeDistrict.name} (${selectedYear})`
                      : `Revenue in ₹ Crore alongside deed volume across Madhya Pradesh (${selectedYear})`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionalData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey={xAxisKey} tick={AXIS_TICK} tickLine={false} axisLine={AXIS_LINE} />
                      <YAxis yAxisId="left" tick={AXIS_TICK} tickLine={false} axisLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={AXIS_TICK} tickLine={false} axisLine={false} unit=" Cr" />
                      <Tooltip
                        content={
                          <ChartTooltip
                            formatter={(v, p) => (p.dataKey === 'revenueNum' ? `₹ ${v} Cr` : Number(v).toLocaleString('en-IN'))}
                          />
                        }
                        cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                      />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }} />
                      <Bar yAxisId="left" dataKey="deedsNum" name="Deeds" fill="hsl(var(--primary) / 0.35)" radius={[6, 6, 0, 0]} maxBarSize={40} />
                      <Bar yAxisId="right" dataKey="revenueNum" name="Revenue (₹ Cr)" fill="hsl(var(--warning))" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="h-full shadow-card">
                <CardHeader>
                  <CardTitle className="text-base">
                    {isDistrictSelected ? 'Revenue Leaderboard — Tehsils' : 'Revenue Leaderboard'}
                  </CardTitle>
                  <CardDescription>
                    {isDistrictSelected
                      ? `Stamp revenue collected per tehsil in ${activeDistrict.name}`
                      : 'Stamp revenue collected per MP district'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {leaderboardData.map((row) => (
                    <div key={row.rank || row.name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">
                          <span className="mr-2 font-mono text-muted-foreground">#{row.rank}</span>
                          {row.name || row.district}
                        </span>
                        <span className="font-mono font-semibold">{fmtCr(row.revenueRaw)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-warning transition-all duration-500"
                          style={{ width: `${Math.round((row.revenueNum / maxLeaderboardRevenue) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
