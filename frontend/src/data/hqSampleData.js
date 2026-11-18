/**
 * Pilot-scale sample dataset for the Madhya Pradesh Government HQ portal.
 *
 * IMPORTANT — NOT OFFICIAL DATA.
 * All numbers are illustrative sample figures for a prototype pilot covering
 * 15 tehsils across 5 MP districts.  Do not present as actual government data.
 *
 * Pilot scope  : 15 tehsils · 5 districts · 3 tehsils each · reference year 2026
 * Area basis   : ~12,480 land parcels digitised · ~3,200 Ha registered area
 * Stamp duty   : avg ₹8,540 per registered transfer (illustrative, not official)
 */

// ─── Formatting helpers ────────────────────────────────────────────────────
/** Indian-locale number string (e.g. 1,23,456) */
export const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);
/** ₹ in Crore with 1 decimal (pass raw rupees) */
export const fmtCr = (n) => `₹\u00a0${(n / 1e7).toFixed(1)}\u00a0Cr`;
/** ₹ in Lakh with 1 decimal (pass raw rupees) */
export const fmtLakh = (n) => `₹\u00a0${(n / 1e5).toFixed(1)}\u00a0L`;

// ─── Pilot geography ───────────────────────────────────────────────────────
/** Registered area (Ha) per pilot district — sums to TOTAL_AREA_HA */
const DISTRICT_AREA_HA = {
  Bhopal:   982,
  Indore:   847,
  Jabalpur: 674,
  Gwalior:  428,
  Ujjain:   269,
};

export const PILOT_DISTRICTS = Object.keys(DISTRICT_AREA_HA);

/** Total registered area across all pilot tehsils = 3,200 Ha */
export const TOTAL_AREA_HA = Object.values(DISTRICT_AREA_HA).reduce((s, v) => s + v, 0);

// ─── Tehsil monitoring data ────────────────────────────────────────────────
// 14 active + 1 pending (Kolar) = 15 tehsils → "14 / 15 online".
// registries : cumulative on-platform registrations since pilot launch.
// mutations  : cumulative mutation entries recorded.
// pending    : applications currently awaiting officer action.
// coverage   : % of plot records for that tehsil digitised (not 100% anywhere).

export const TEHSIL_DATA = [
  // ── Bhopal ──────────────────────────────────────────────────────────────
  { name: 'Huzur',     district: 'Bhopal',   registries: 198, mutations: 142, pending:  23, coverage: 93.4, status: 'active'  },
  { name: 'Berasia',   district: 'Bhopal',   registries: 134, mutations:  97, pending:  31, coverage: 86.2, status: 'active'  },
  { name: 'Kolar',     district: 'Bhopal',   registries:  89, mutations:  61, pending:  44, coverage: 78.8, status: 'pending' },
  // ── Indore ──────────────────────────────────────────────────────────────
  { name: 'Sanwer',    district: 'Indore',   registries: 187, mutations: 136, pending:  19, coverage: 94.1, status: 'active'  },
  { name: 'Depalpur',  district: 'Indore',   registries: 143, mutations: 104, pending:  28, coverage: 89.6, status: 'active'  },
  { name: 'Mhow',      district: 'Indore',   registries: 112, mutations:  78, pending:  37, coverage: 83.5, status: 'active'  },
  // ── Jabalpur ────────────────────────────────────────────────────────────
  { name: 'Patan',     district: 'Jabalpur', registries: 171, mutations: 121, pending:  24, coverage: 91.8, status: 'active'  },
  { name: 'Sihora',    district: 'Jabalpur', registries:  98, mutations:  68, pending:  41, coverage: 81.3, status: 'active'  },
  { name: 'Panagar',   district: 'Jabalpur', registries:  76, mutations:  52, pending:  55, coverage: 74.6, status: 'active'  },
  // ── Gwalior ─────────────────────────────────────────────────────────────
  { name: 'Gwalior',   district: 'Gwalior',  registries: 184, mutations: 128, pending:  22, coverage: 92.7, status: 'active'  },
  { name: 'Dabra',     district: 'Gwalior',  registries: 109, mutations:  73, pending:  38, coverage: 85.4, status: 'active'  },
  { name: 'Bhitarwar', district: 'Gwalior',  registries:  83, mutations:  57, pending:  47, coverage: 77.9, status: 'active'  },
  // ── Ujjain ──────────────────────────────────────────────────────────────
  { name: 'Ujjain',    district: 'Ujjain',   registries: 162, mutations: 118, pending:  21, coverage: 94.8, status: 'active'  },
  { name: 'Nagda',     district: 'Ujjain',   registries: 118, mutations:  84, pending:  33, coverage: 87.3, status: 'active'  },
  { name: 'Mahidpur',  district: 'Ujjain',   registries:  71, mutations:  48, pending:  52, coverage: 72.1, status: 'active'  },
];

/** Status counts derived from TEHSIL_DATA — Monitoring tabs must equal these. */
export const TEHSIL_COUNTS = {
  all:      TEHSIL_DATA.length,                                    // 15
  active:   TEHSIL_DATA.filter((r) => r.status === 'active').length,  // 14
  pending:  TEHSIL_DATA.filter((r) => r.status === 'pending').length, //  1
  inactive: TEHSIL_DATA.filter((r) => r.status === 'inactive').length,//  0
};

// ─── Application stats ─────────────────────────────────────────────────────
// 3,260 total  =  2,415 completed  +  612 in-progress  +  148 rejected  +  85 sync-retry
// Verify: 2415 + 612 + 148 + 85 = 3260 ✓

export const APP_STATS = {
  total:      3_260,
  completed:  2_415,
  inProgress:   612,
  rejected:     148,
  syncRetry:     85,
};

// ─── Blockchain metrics ────────────────────────────────────────────────────
// Blocks ≈ completed transfers + retry overhead for failed/retried txns.
// 2415 completed + 203 retry/overhead = 2618 (intentionally above completed, below total apps).
export const BLOCKCHAIN_BLOCKS = APP_STATS.completed + 203; // 2618

/** % of registered blocks successfully hash-verified (not 100%). */
export const HASH_VERIFIED_PCT = 99.2;

// ─── Today's registrations ─────────────────────────────────────────────────
// Pilot-week average ÷ 7, rounded (reflects 15-tehsil pilot volume).
export const TODAY_REGISTRATIONS = 38;

// ─── Average processing times ──────────────────────────────────────────────
export const AVG_MUTATION_DAYS   = 4.8;  // days from application to mutation entry
export const NODE_UPTIME_PCT     = 98.1; // % node uptime since pilot launch

// ─── Deed type breakdown ───────────────────────────────────────────────────
// Counts must sum to APP_STATS.completed (2,415).

export const DEED_TYPES = (() => {
  const raw = [
    { type: 'Sale Deed',      count: 1_340, color: 'hsl(var(--primary))'     },
    { type: 'Gift Deed',      count:   456, color: 'hsl(var(--success))'     },
    { type: 'Mortgage Deed',  count:   302, color: 'hsl(var(--warning))'     },
    { type: 'Partition Deed', count:   193, color: 'hsl(var(--info))'        },
    { type: 'Lease / Other',  count:   124, color: 'hsl(var(--destructive))' },
  ];
  const total = raw.reduce((s, d) => s + d.count, 0); // must equal 2415
  return raw.map((d) => ({
    ...d,
    pct: parseFloat(((d.count / total) * 100).toFixed(1)),
  }));
})();
// Deed totals: 1340+456+302+193+124 = 2,415 ✓

// ─── District performance rankings ─────────────────────────────────────────
// Deed counts must sum to APP_STATS.completed (2,415).
// Revenue = deeds × AVG_STAMP_DUTY_RS (illustrative; not official).

const AVG_STAMP_DUTY_RS = 8_540; // ₹ per registered transfer (illustrative)

export const DISTRICT_RANKINGS = (() => {
  const rows = [
    { rank: 1, district: 'Bhopal',   deeds: 680, compliance: 93.6 },
    { rank: 2, district: 'Indore',   deeds: 612, compliance: 96.8 },
    { rank: 3, district: 'Jabalpur', deeds: 489, compliance: 91.4 },
    { rank: 4, district: 'Gwalior',  deeds: 374, compliance: 88.7 },
    { rank: 5, district: 'Ujjain',   deeds: 260, compliance: 87.9 },
  ];
  // Deed totals: 680+612+489+374+260 = 2,415 ✓
  return rows.map((d) => {
    const revenueRaw = d.deeds * AVG_STAMP_DUTY_RS;
    return {
      ...d,
      revenueRaw,                                       // in rupees (for chart)
      revenueL: parseFloat((revenueRaw / 1e5).toFixed(1)), // in Lakh (for display)
      complianceStr: `${d.compliance}%`,
    };
  });
})();

/** Total stamp revenue across all pilot districts (in rupees). */
export const TOTAL_REVENUE_RS = DISTRICT_RANKINGS.reduce((s, d) => s + d.revenueRaw, 0);
// = 20,624,100 ₹ ≈ ₹ 2.1 Cr

// ─── Division stream (dashboard table + chart) ─────────────────────────────
// Derived by grouping TEHSIL_DATA by district.
// pendingApps  : sum of tehsil pending counts per district.
// areaStr      : from DISTRICT_AREA_HA lookup.
// syncHealth   : fraction of tehsils currently active in that district.

export const DIVISION_STREAM = PILOT_DISTRICTS.map((district) => {
  const tehsils      = TEHSIL_DATA.filter((t) => t.district === district);
  const pendingApps  = tehsils.reduce((s, t) => s + t.pending, 0);
  const areaHa       = DISTRICT_AREA_HA[district];
  const activeCt     = tehsils.filter((t) => t.status === 'active').length;
  const totalCt      = tehsils.length;
  const syncHealth   = `${activeCt} / ${totalCt} Active`;
  return {
    region:      `${district} Division`,
    district,
    pendingApps,                                        // for chart dataKey
    areaHa,
    areaStr:     `${areaHa.toLocaleString('en-IN')} Ha`,
    syncHealth,
    allActive:   activeCt === totalCt,
  };
});
// DIVISION_STREAM totals:
//   pendingApps: 98+84+120+107+106 = 515 (= TEHSIL_DATA pending sum)
//   areaHa     : 982+847+674+428+269 = 3,200 ✓

// ─── Properties on platform ────────────────────────────────────────────────
// Total digitised land parcels loaded into the pilot system.
export const PROPERTIES_ON_PLATFORM = 12_480;

// ─── Disputes ──────────────────────────────────────────────────────────────
// 12 cases — all filed in 2026 (pilot year), all in MP districts.
// Resolved cases carry resolutionDays for avg-time computation.

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
// Counts: Active 5, Under Review 3, Resolved 4, Total 12.

/** Dispute statistics derived from DISPUTES — header cards must equal these. */
export const DISPUTE_STATS = (() => {
  const total         = DISPUTES.length;                                           // 12
  const resolvedList  = DISPUTES.filter((d) => d.status === 'Resolved');
  const resolvedCount = resolvedList.length;                                       //  4
  const active        = DISPUTES.filter((d) => d.status === 'Active').length;     //  5
  const underReview   = DISPUTES.filter((d) => d.status === 'Under Review').length; // 3
  const avgDays       = resolvedCount > 0
    ? Math.round(resolvedList.reduce((s, d) => s + (d.resolutionDays || 0), 0) / resolvedCount)
    : 0; // (32+44+28+41)/4 = 36
  const resolutionRate = total > 0
    ? parseFloat(((resolvedCount / total) * 100).toFixed(1))
    : 0; // 33.3%
  return { total, active, underReview, resolvedCount, avgDays, resolutionRate };
})();
