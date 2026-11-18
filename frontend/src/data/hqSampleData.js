/**
 * Pilot-scale sample dataset for the Madhya Pradesh Government HQ portal.
 *
 * IMPORTANT — NOT OFFICIAL DATA.
 * All numbers are illustrative sample figures for a prototype pilot covering
 * 15 tehsils across 5 MP districts. Do not present as actual government data.
 *
 * Pilot scope  : 15 tehsils · 5 districts · 3 tehsils each · reference year 2026
 * Area basis   : ~12,480 land parcels digitised · ~3,200 Ha registered area
 * Reference    : 2,415 completed deeds on platform across 5 pilot districts
 *
 * STAMP DUTY ASSUMPTIONS (illustrative sample averages per deed type):
 * - Sale Deed      : ~₹ 3,00,000 (₹ 3.0 Lakh avg duty)
 * - Gift Deed      : ~₹   60,000 (₹ 0.6 Lakh avg duty)
 * - Mortgage Deed  : ~₹   40,000 (₹ 0.4 Lakh avg duty)
 * - Partition Deed : ~₹   30,000 (₹ 0.3 Lakh avg duty)
 * - Lease / Other  : ~₹   25,000 (₹ 0.25 Lakh avg duty)
 * Total statewide revenue lands in the tens of crores (₹ 45.0 Cr).
 */

// ─── Formatting helpers ────────────────────────────────────────────────────
/** Indian-locale number string (e.g. 1,23,456) */
export const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);
/** ₹ in Crore with 1 decimal (pass raw rupees) */
export const fmtCr = (n) => `₹\u00a0${(n / 1e7).toFixed(1)}\u00a0Cr`;
/** ₹ in Lakh with 1 decimal (pass raw rupees) */
export const fmtLakh = (n) => `₹\u00a0${(n / 1e5).toFixed(1)}\u00a0L`;

// ─── Stamp Duty Assumptions ────────────────────────────────────────────────
export const STAMP_DUTY_ASSUMPTIONS_RS = {
  'Sale Deed':      300_000,
  'Gift Deed':       60_000,
  'Mortgage Deed':   40_000,
  'Partition Deed':  30_000,
  'Lease / Other':   25_000,
};

export const DEED_COLORS = {
  'Sale Deed':      'hsl(var(--primary))',
  'Gift Deed':      'hsl(var(--success))',
  'Mortgage Deed':  'hsl(var(--warning))',
  'Partition Deed': 'hsl(var(--info))',
  'Lease / Other':  'hsl(var(--destructive))',
};

// ─── Pilot Geography & Area ────────────────────────────────────────────────
const DISTRICT_AREA_HA = {
  Bhopal:   982,
  Indore:   847,
  Jabalpur: 674,
  Gwalior:  428,
  Ujjain:   269,
};

export const PILOT_DISTRICTS = Object.keys(DISTRICT_AREA_HA);
export const TOTAL_AREA_HA = Object.values(DISTRICT_AREA_HA).reduce((s, v) => s + v, 0);

// ─── Raw District & Tehsil Data Structure ──────────────────────────────────
// Consistency check targets:
// Statewide deeds: 2,415
// Deed types statewide: Sale 1340, Gift 456, Mortgage 302, Partition 193, Lease 124
// Deeds per district: Bhopal 680, Indore 612, Jabalpur 489, Gwalior 374, Ujjain 260

const RAW_DISTRICTS_DATA = [
  {
    name: 'Bhopal District',
    district: 'Bhopal',
    slug: 'bhopal',
    areaHa: 982,
    avgMutationDays: 4.6,
    verificationPct: 99.4,
    nodeUptimePct: 98.7,
    tehsils: [
      {
        name: 'Huzur',
        district: 'Bhopal',
        deedCounts: { 'Sale Deed': 215, 'Gift Deed': 60, 'Mortgage Deed': 30, 'Partition Deed': 22, 'Lease / Other': 21 },
        compliance: 95.2,
        mutationDays: 4.2,
        // Monitoring values:
        registries: 198, mutations: 142, pending: 23, coverage: 93.4, status: 'active',
      },
      {
        name: 'Berasia',
        district: 'Bhopal',
        deedCounts: { 'Sale Deed': 120, 'Gift Deed': 38, 'Mortgage Deed': 18, 'Partition Deed': 13, 'Lease / Other': 13 },
        compliance: 92.4,
        mutationDays: 4.8,
        // Monitoring values:
        registries: 134, mutations: 97, pending: 31, coverage: 86.2, status: 'active',
      },
      {
        name: 'Kolar',
        district: 'Bhopal',
        deedCounts: { 'Sale Deed': 80, 'Gift Deed': 22, 'Mortgage Deed': 12, 'Partition Deed': 8, 'Lease / Other': 8 },
        compliance: 90.8,
        mutationDays: 5.2,
        // Monitoring values:
        registries: 89, mutations: 61, pending: 44, coverage: 78.8, status: 'pending',
      },
    ],
  },
  {
    name: 'Indore District',
    district: 'Indore',
    slug: 'indore',
    areaHa: 847,
    avgMutationDays: 3.9,
    verificationPct: 99.6,
    nodeUptimePct: 99.1,
    tehsils: [
      {
        name: 'Sanwer',
        district: 'Indore',
        deedCounts: { 'Sale Deed': 185, 'Gift Deed': 42, 'Mortgage Deed': 24, 'Partition Deed': 13, 'Lease / Other': 10 },
        compliance: 97.4,
        mutationDays: 3.6,
        // Monitoring values:
        registries: 187, mutations: 136, pending: 19, coverage: 94.1, status: 'active',
      },
      {
        name: 'Depalpur',
        district: 'Indore',
        deedCounts: { 'Sale Deed': 135, 'Gift Deed': 31, 'Mortgage Deed': 18, 'Partition Deed': 10, 'Lease / Other': 7 },
        compliance: 96.5,
        mutationDays: 4.0,
        // Monitoring values:
        registries: 143, mutations: 104, pending: 28, coverage: 89.6, status: 'active',
      },
      {
        name: 'Mhow',
        district: 'Indore',
        deedCounts: { 'Sale Deed': 90, 'Gift Deed': 22, 'Mortgage Deed': 13, 'Partition Deed': 7, 'Lease / Other': 5 },
        compliance: 95.8,
        mutationDays: 4.3,
        // Monitoring values:
        registries: 112, mutations: 78, pending: 37, coverage: 83.5, status: 'active',
      },
    ],
  },
  {
    name: 'Jabalpur District',
    district: 'Jabalpur',
    slug: 'jabalpur',
    areaHa: 674,
    avgMutationDays: 4.9,
    verificationPct: 99.1,
    nodeUptimePct: 97.9,
    tehsils: [
      {
        name: 'Patan',
        district: 'Jabalpur',
        deedCounts: { 'Sale Deed': 110, 'Gift Deed': 42, 'Mortgage Deed': 30, 'Partition Deed': 36, 'Lease / Other': 14 },
        compliance: 93.1,
        mutationDays: 4.6,
        // Monitoring values:
        registries: 171, mutations: 121, pending: 24, coverage: 91.8, status: 'active',
      },
      {
        name: 'Sihora',
        district: 'Jabalpur',
        deedCounts: { 'Sale Deed': 72, 'Gift Deed': 28, 'Mortgage Deed': 20, 'Partition Deed': 23, 'Lease / Other': 9 },
        compliance: 90.5,
        mutationDays: 5.1,
        // Monitoring values:
        registries: 98, mutations: 68, pending: 41, coverage: 81.3, status: 'active',
      },
      {
        name: 'Panagar',
        district: 'Jabalpur',
        deedCounts: { 'Sale Deed': 48, 'Gift Deed': 20, 'Mortgage Deed': 14, 'Partition Deed': 16, 'Lease / Other': 7 },
        compliance: 88.9,
        mutationDays: 5.4,
        // Monitoring values:
        registries: 76, mutations: 52, pending: 55, coverage: 74.6, status: 'active',
      },
    ],
  },
  {
    name: 'Gwalior District',
    district: 'Gwalior',
    slug: 'gwalior',
    areaHa: 428,
    avgMutationDays: 5.5,
    verificationPct: 98.8,
    nodeUptimePct: 97.4,
    tehsils: [
      {
        name: 'Gwalior',
        district: 'Gwalior',
        deedCounts: { 'Sale Deed': 75, 'Gift Deed': 52, 'Mortgage Deed': 42, 'Partition Deed': 12, 'Lease / Other': 8 },
        compliance: 90.6,
        mutationDays: 5.1,
        // Monitoring values:
        registries: 184, mutations: 128, pending: 22, coverage: 92.7, status: 'active',
      },
      {
        name: 'Dabra',
        district: 'Gwalior',
        deedCounts: { 'Sale Deed': 44, 'Gift Deed': 32, 'Mortgage Deed': 26, 'Partition Deed': 7, 'Lease / Other': 4 },
        compliance: 87.8,
        mutationDays: 5.7,
        // Monitoring values:
        registries: 109, mutations: 73, pending: 38, coverage: 85.4, status: 'active',
      },
      {
        name: 'Bhitarwar',
        district: 'Gwalior',
        deedCounts: { 'Sale Deed': 26, 'Gift Deed': 21, 'Mortgage Deed': 17, 'Partition Deed': 5, 'Lease / Other': 3 },
        compliance: 85.5,
        mutationDays: 6.2,
        // Monitoring values:
        registries: 83, mutations: 57, pending: 47, coverage: 77.9, status: 'active',
      },
    ],
  },
  {
    name: 'Ujjain District',
    district: 'Ujjain',
    slug: 'ujjain',
    areaHa: 269,
    avgMutationDays: 6.1,
    verificationPct: 98.4,
    nodeUptimePct: 96.8,
    tehsils: [
      {
        name: 'Ujjain',
        district: 'Ujjain',
        deedCounts: { 'Sale Deed': 72, 'Gift Deed': 24, 'Mortgage Deed': 20, 'Partition Deed': 11, 'Lease / Other': 8 },
        compliance: 89.8,
        mutationDays: 5.8,
        // Monitoring values:
        registries: 162, mutations: 118, pending: 21, coverage: 94.8, status: 'active',
      },
      {
        name: 'Nagda',
        district: 'Ujjain',
        deedCounts: { 'Sale Deed': 44, 'Gift Deed': 14, 'Mortgage Deed': 12, 'Partition Deed': 6, 'Lease / Other': 4 },
        compliance: 87.2,
        mutationDays: 6.2,
        // Monitoring values:
        registries: 118, mutations: 84, pending: 33, coverage: 87.3, status: 'active',
      },
      {
        name: 'Mahidpur',
        district: 'Ujjain',
        deedCounts: { 'Sale Deed': 24, 'Gift Deed': 8, 'Mortgage Deed': 6, 'Partition Deed': 4, 'Lease / Other': 3 },
        compliance: 84.4,
        mutationDays: 6.7,
        // Monitoring values:
        registries: 71, mutations: 48, pending: 52, coverage: 72.1, status: 'active',
      },
    ],
  },
];

// Helper to calculate revenue from deed counts map
function calcDeedRevenue(counts) {
  return Object.entries(counts).reduce((sum, [type, count]) => {
    const rate = STAMP_DUTY_ASSUMPTIONS_RS[type] || 0;
    return sum + count * rate;
  }, 0);
}

// ─── Processed District & Tehsil Hierarchy ─────────────────────────────────
export const PROCESSED_DISTRICTS = RAW_DISTRICTS_DATA.map((dist) => {
  // Process tehsils with computed deeds, revenues, and ranks
  const processedTehsils = dist.tehsils.map((t) => {
    const deeds = Object.values(t.deedCounts).reduce((s, c) => s + c, 0);
    const revenueRaw = calcDeedRevenue(t.deedCounts);
    return {
      ...t,
      deeds,
      revenueRaw,
      revenueCr: parseFloat((revenueRaw / 1e7).toFixed(2)),
      revenueL: parseFloat((revenueRaw / 1e5).toFixed(1)),
      complianceStr: `${t.compliance}%`,
    };
  });

  // Sort tehsils by deeds descending and assign rank
  processedTehsils.sort((a, b) => b.deeds - a.deeds);
  const rankedTehsils = processedTehsils.map((t, idx) => ({
    ...t,
    rank: idx + 1,
  }));

  // Aggregate district totals
  const deeds = rankedTehsils.reduce((s, t) => s + t.deeds, 0);
  const revenueRaw = rankedTehsils.reduce((s, t) => s + t.revenueRaw, 0);
  const compliance = parseFloat(
    (rankedTehsils.reduce((s, t) => s + t.compliance * t.deeds, 0) / deeds).toFixed(1)
  );

  // Deed counts aggregated for this district
  const deedCounts = {};
  Object.keys(STAMP_DUTY_ASSUMPTIONS_RS).forEach((type) => {
    deedCounts[type] = rankedTehsils.reduce((sum, t) => sum + (t.deedCounts[type] || 0), 0);
  });

  const deedTypes = Object.entries(deedCounts).map(([type, count]) => ({
    type,
    count,
    pct: deeds > 0 ? parseFloat(((count / deeds) * 100).toFixed(1)) : 0,
    color: DEED_COLORS[type],
  }));

  return {
    ...dist,
    deeds,
    revenueRaw,
    revenueCr: parseFloat((revenueRaw / 1e7).toFixed(1)),
    revenueL: parseFloat((revenueRaw / 1e5).toFixed(1)),
    compliance,
    complianceStr: `${compliance}%`,
    deedCounts,
    deedTypes,
    tehsils: rankedTehsils,
  };
});

// Map keyed by district slug for instant lookup in Analytics
export const DISTRICT_ANALYTICS_MAP = PROCESSED_DISTRICTS.reduce((acc, d) => {
  acc[d.slug] = d;
  return acc;
}, {});

export const VALID_DISTRICT_SLUGS = Object.keys(DISTRICT_ANALYTICS_MAP);

export const PILOT_DISTRICTS_META = PROCESSED_DISTRICTS.map((d) => ({
  slug: d.slug,
  name: d.name,
  district: d.district,
}));

// ─── Statewide Totals & Rankings ───────────────────────────────────────────
// Verify: 680 + 612 + 489 + 374 + 260 = 2,415 deeds ✓
export const TOTAL_COMPLETED_DEEDS = PROCESSED_DISTRICTS.reduce((s, d) => s + d.deeds, 0);

// Total stamp revenue across pilot = ₹ 45,03,30,000 (tens of crores)
export const TOTAL_REVENUE_RS = PROCESSED_DISTRICTS.reduce((s, d) => s + d.revenueRaw, 0);
export const TOTAL_REVENUE_CR = parseFloat((TOTAL_REVENUE_RS / 1e7).toFixed(1)); // 45.0

// Statewide deed type distribution
export const DEED_TYPES = (() => {
  const aggregated = {};
  Object.keys(STAMP_DUTY_ASSUMPTIONS_RS).forEach((type) => {
    aggregated[type] = PROCESSED_DISTRICTS.reduce((sum, d) => sum + (d.deedCounts[type] || 0), 0);
  });
  return Object.entries(aggregated).map(([type, count]) => ({
    type,
    count,
    pct: parseFloat(((count / TOTAL_COMPLETED_DEEDS) * 100).toFixed(1)),
    color: DEED_COLORS[type],
  }));
})();
// Deed totals: Sale 1340, Gift 456, Mortgage 302, Partition 193, Lease 124 = 2,415 ✓

// District performance rankings (ranked by deeds)
export const DISTRICT_RANKINGS = [...PROCESSED_DISTRICTS]
  .sort((a, b) => b.deeds - a.deeds)
  .map((d, idx) => ({
    rank: idx + 1,
    district: d.district,
    name: d.name,
    slug: d.slug,
    deeds: d.deeds,
    revenueRaw: d.revenueRaw,
    revenueCr: d.revenueCr,
    revenueL: d.revenueL,
    compliance: d.compliance,
    complianceStr: d.complianceStr,
  }));

// Statewide average mutation time & verification
export const AVG_MUTATION_DAYS = parseFloat(
  (
    PROCESSED_DISTRICTS.reduce((s, d) => s + d.avgMutationDays * d.deeds, 0) /
    TOTAL_COMPLETED_DEEDS
  ).toFixed(1)
); // 4.8 Days ✓

export const HASH_VERIFIED_PCT = parseFloat(
  (
    PROCESSED_DISTRICTS.reduce((s, d) => s + d.verificationPct * d.deeds, 0) /
    TOTAL_COMPLETED_DEEDS
  ).toFixed(1)
); // 99.2% ✓

export const NODE_UPTIME_PCT = 98.1; // % node uptime since pilot launch

// Statewide KPI object
export const STATE_KPIS = {
  deeds: TOTAL_COMPLETED_DEEDS,
  revenueRaw: TOTAL_REVENUE_RS,
  revenueCr: TOTAL_REVENUE_CR,
  avgMutationDays: AVG_MUTATION_DAYS,
  verificationPct: HASH_VERIFIED_PCT,
  uptimePct: NODE_UPTIME_PCT,
  name: 'All Madhya Pradesh',
};

// ─── Tehsil Flat List (For Monitoring page) ────────────────────────────────
export const TEHSIL_DATA = PROCESSED_DISTRICTS.flatMap((d) =>
  d.tehsils.map((t) => ({
    name: t.name,
    district: t.district,
    registries: t.registries,
    mutations: t.mutations,
    pending: t.pending,
    coverage: t.coverage,
    status: t.status,
  }))
);

export const TEHSIL_COUNTS = {
  all:      TEHSIL_DATA.length,                                    // 15
  active:   TEHSIL_DATA.filter((r) => r.status === 'active').length,  // 14
  pending:  TEHSIL_DATA.filter((r) => r.status === 'pending').length, //  1
  inactive: TEHSIL_DATA.filter((r) => r.status === 'inactive').length,//  0
};

// ─── Application Stats ─────────────────────────────────────────────────────
export const APP_STATS = {
  total:      3_260,
  completed:  TOTAL_COMPLETED_DEEDS, // 2,415
  inProgress:   612,
  rejected:     148,
  syncRetry:     85,
};

export const BLOCKCHAIN_BLOCKS = APP_STATS.completed + 203; // 2,618
export const TODAY_REGISTRATIONS = 38;
export const PROPERTIES_ON_PLATFORM = 12_480;

// ─── Division/District Stream (Dashboard table + chart) ────────────────────
export const DIVISION_STREAM = PROCESSED_DISTRICTS.map((dist) => {
  const tehsils = dist.tehsils;
  const pendingApps = tehsils.reduce((s, t) => s + t.pending, 0);
  const activeCt = tehsils.filter((t) => t.status === 'active').length;
  const totalCt = tehsils.length;
  const syncHealth = `${activeCt} / ${totalCt} Active`;
  return {
    region: dist.name, // e.g. "Bhopal District"
    district: dist.district,
    slug: dist.slug,
    pendingApps,
    areaHa: dist.areaHa,
    areaStr: `${dist.areaHa.toLocaleString('en-IN')} Ha`,
    syncHealth,
    allActive: activeCt === totalCt,
  };
});

// ─── Disputes ──────────────────────────────────────────────────────────────
export const DISPUTES = [
  {
    id: 'DISP-2026-0021', khasra: '104/A', district: 'Bhopal',
    complainant: 'Harish Chandra',  respondent: 'Devendra Nath',
    category: 'Boundary Overlap',   filedDate: '08-Jan-2026',
    status: 'Resolved',             resolutionDays: 32,
    summary: 'Alleged encroachment on 180 sq.ft residential plot boundary following road-widening in Huzur tehsil. Resolved after joint field survey.',
  },
  {
    id: 'DISP-2026-0032', khasra: '317/2', district: 'Indore',
    complainant: 'Sunita Mehra',    respondent: 'Ratan Lal',
    category: 'Ownership Title Contest', filedDate: '15-Jan-2026',
    status: 'Resolved',             resolutionDays: 44,
    summary: 'Conflicting inheritance claims registered in two separate sub-tehsil books in Depalpur. Resolved via tribunal order.',
  },
  {
    id: 'DISP-2026-0039', khasra: '78/B',  district: 'Jabalpur',
    complainant: 'Ajay K. Saxena', respondent: 'State Highway Authority',
    category: 'Compensation Dispute', filedDate: '21-Jan-2026',
    status: 'Resolved',             resolutionDays: 28,
    summary: 'Discrepancy in circle rate valuation for acquired agricultural land corridor in Panagar tehsil.',
  },
  {
    id: 'DISP-2026-0051', khasra: '221/1', district: 'Gwalior',
    complainant: 'Balram Yadav',   respondent: 'Vikramaditya Rao',
    category: 'Mutation Objection', filedDate: '29-Jan-2026',
    status: 'Resolved',             resolutionDays: 41,
    summary: 'Objection against digital mutation citing unregistered sale deed. Resolved after document verification by Gwalior tehsil office.',
  },
  {
    id: 'DISP-2026-0059', khasra: '482/C', district: 'Ujjain',
    complainant: 'Meena Devi',     respondent: 'Ramesh Patel',
    category: 'Encroachment',      filedDate: '05-Feb-2026',
    status: 'Under Review',
    summary: 'Agricultural plot boundary dispute following survey recalculation in Ujjain tehsil. Tribunal has appointed a surveyor.',
  },
  {
    id: 'DISP-2026-0068', khasra: '134/5', district: 'Bhopal',
    complainant: 'Dinesh Kumar',   respondent: 'Housing Board, MP',
    category: 'Compensation Dispute', filedDate: '12-Feb-2026',
    status: 'Active',
    summary: 'Circle rate mismatch for acquired residential plot in Berasia tehsil. Awaiting revenue department response.',
  },
  {
    id: 'DISP-2026-0076', khasra: '99/A',  district: 'Indore',
    complainant: 'Priya Sharma',   respondent: 'Suresh Verma',
    category: 'Boundary Overlap',  filedDate: '19-Feb-2026',
    status: 'Under Review',
    summary: 'Disputed common wall affecting two adjacent plots in Depalpur tehsil. Joint measurement ordered.',
  },
  {
    id: 'DISP-2026-0084', khasra: '56/D',  district: 'Jabalpur',
    complainant: 'Santosh Tripathi', respondent: 'Pankaj Gupta',
    category: 'Mutation Objection', filedDate: '28-Feb-2026',
    status: 'Active',
    summary: 'Mutation objection filed claiming power of attorney was revoked before sale execution in Patan tehsil.',
  },
  {
    id: 'DISP-2026-0097', khasra: '271/3', district: 'Gwalior',
    complainant: 'Kamla Bai',      respondent: 'Revenue Department',
    category: 'Survey Dispute',    filedDate: '07-Mar-2026',
    status: 'Active',
    summary: 'Plot dimensions in Dabra tehsil differ between old patwari records and revised digital survey map.',
  },
  {
    id: 'DISP-2026-0105', khasra: '388/1', district: 'Ujjain',
    complainant: 'Govind Rao',     respondent: 'Mahesh Sharma',
    category: 'Ownership Title Contest', filedDate: '14-Mar-2026',
    status: 'Under Review',
    summary: 'Title dispute over agricultural plot in Nagda tehsil involving two registered sale deeds of different years.',
  },
  {
    id: 'DISP-2026-0112', khasra: '612/B', district: 'Bhopal',
    complainant: 'Anita Joshi',    respondent: 'Vikas Nagar Society',
    category: 'Encroachment',      filedDate: '21-Mar-2026',
    status: 'Active',
    summary: 'Society common-area boundary encroachment reported against residential plot in Kolar tehsil.',
  },
  {
    id: 'DISP-2026-0131', khasra: '45/2',  district: 'Indore',
    complainant: 'Rajendra Singh', respondent: 'Mhow Cantonment Board',
    category: 'Compensation Dispute', filedDate: '02-Apr-2026',
    status: 'Active',
    summary: 'Compensation amount disputed for land acquired by cantonment authority in Mhow tehsil.',
  },
];

export const DISPUTE_STATS = (() => {
  const total         = DISPUTES.length;                                           // 12
  const resolvedList  = DISPUTES.filter((d) => d.status === 'Resolved');
  const resolvedCount = resolvedList.length;                                       //  4
  const active        = DISPUTES.filter((d) => d.status === 'Active').length;     //  5
  const underReview   = DISPUTES.filter((d) => d.status === 'Under Review').length; // 3
  const avgDays       = resolvedCount > 0
    ? Math.round(resolvedList.reduce((s, d) => s + (d.resolutionDays || 0), 0) / resolvedCount)
    : 0; // 36
  const resolutionRate = total > 0
    ? parseFloat(((resolvedCount / total) * 100).toFixed(1))
    : 0; // 33.3%
  return { total, active, underReview, resolvedCount, avgDays, resolutionRate };
})();
