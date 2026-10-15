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

const toNumber = (s) => Number(String(s).replace(/[^0-9.]/g, ''));

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
  const [selectedYear, setSelectedYear] = useState('2024');

  const deedTypes = [
    { type: 'Sale Deed', count: '84,210', pct: 56, color: 'hsl(var(--primary))' },
    { type: 'Gift Deed', count: '28,140', pct: 19, color: 'hsl(var(--success))' },
    { type: 'Mortgage Deed', count: '18,320', pct: 12, color: 'hsl(var(--warning))' },
    { type: 'Partition Deed', count: '11,430', pct: 8, color: 'hsl(var(--info))' },
    { type: 'Lease / Other', count: '6,202', pct: 5, color: 'hsl(var(--destructive))' },
  ];

  const districtRankings = [
    { rank: 1, district: 'Lucknow', deeds: '24,890', revenue: '₹ 142 Cr', compliance: '98%' },
    { rank: 2, district: 'Prayagraj', deeds: '21,340', revenue: '₹ 118 Cr', compliance: '97%' },
    { rank: 3, district: 'Kanpur', deeds: '19,820', revenue: '₹ 105 Cr', compliance: '96%' },
    { rank: 4, district: 'Agra', deeds: '16,740', revenue: '₹ 89 Cr', compliance: '95%' },
    { rank: 5, district: 'Varanasi', deeds: '14,210', revenue: '₹ 78 Cr', compliance: '94%' },
  ];

  const deedChart = useMemo(
    () => deedTypes.map((d) => ({ ...d, value: toNumber(d.count) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const districtChart = useMemo(
    () =>
      districtRankings.map((d) => ({
        ...d,
        deedsNum: toNumber(d.deeds),
        revenueNum: toNumber(d.revenue),
        complianceNum: toNumber(d.compliance),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        description="Deep insights across districts, deed types & timelines"
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
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
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
          value="1,48,302"
          icon={FileText}
          hint={
            <span className="inline-flex items-center gap-1 font-medium text-success-foreground">
              <TrendingUp className="h-3 w-3" aria-hidden="true" /> 12.4% YoY
            </span>
          }
          delay={0}
        />
        <StatCard
          label="Stamp Revenue"
          value="₹842Cr"
          icon={IndianRupee}
          tone="warning"
          hint={
            <span className="inline-flex items-center gap-1 font-medium text-success-foreground">
              <TrendingUp className="h-3 w-3" aria-hidden="true" /> 9.1% YoY
            </span>
          }
          delay={0.05}
        />
        <StatCard
          label="Avg Mutation Time"
          value="3.2 Days"
          icon={Clock}
          tone="info"
          hint={
            <span className="inline-flex items-center gap-1 font-medium text-success-foreground">
              <TrendingDown className="h-3 w-3" aria-hidden="true" /> 1.8d vs 2023
            </span>
          }
          delay={0.1}
        />
        <StatCard
          label="Blockchain Verification"
          value="100%"
          icon={ShieldCheck}
          tone="success"
          hint="Node uptime 99.98%"
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
                    {deedTypes.map((item) => (
                      <li key={item.type} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="inline-flex items-center gap-2 font-semibold text-foreground">
                            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
                            {item.type}
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {item.count} ({item.pct}%)
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
                  <CardTitle className="text-base">Top Performing Districts</CardTitle>
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
                        {districtRankings.map((row) => (
                          <TableRow key={row.rank} className="hover:bg-muted/40">
                            <TableCell className="px-4 py-3 font-bold">
                              <span className="inline-flex items-center gap-1.5">
                                {row.rank === 1 && <Award className="h-3.5 w-3.5 text-warning-foreground" aria-hidden="true" />}#{row.rank}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 font-semibold">{row.district}</TableCell>
                            <TableCell className="py-3 font-mono">{row.deeds}</TableCell>
                            <TableCell className="py-3 font-mono">{row.revenue}</TableCell>
                            <TableCell className="py-3 pr-4">
                              <Badge variant="success">{row.compliance}</Badge>
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
                  <CardTitle className="text-base">Deeds Registered by District ({selectedYear})</CardTitle>
                  <CardDescription>Top five districts by volume</CardDescription>
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
                      <YAxis domain={[90, 100]} tick={AXIS_TICK} tickLine={false} axisLine={false} unit="%" />
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
                  <CardDescription>Revenue in ₹ Crore alongside deed volume ({selectedYear})</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtChart} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                      <XAxis dataKey="district" tick={AXIS_TICK} tickLine={false} axisLine={AXIS_LINE} />
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
                  <CardTitle className="text-base">Revenue Leaderboard</CardTitle>
                  <CardDescription>Stamp revenue collected per district</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {districtChart.map((row) => {
                    const max = districtChart[0].revenueNum;
                    return (
                      <div key={row.rank} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold">
                            <span className="mr-2 font-mono text-muted-foreground">#{row.rank}</span>
                            {row.district}
                          </span>
                          <span className="font-mono font-semibold">{row.revenue}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-warning transition-all duration-500"
                            style={{ width: `${Math.round((row.revenueNum / max) * 100)}%` }}
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
