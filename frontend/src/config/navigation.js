import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  FileText,
  SearchCheck,
  CalendarClock,
  FileDown,
  ClipboardList,
  Fingerprint,
  Blocks,
  Activity,
  BarChart3,
  Scale,
} from 'lucide-react';

export const PORTAL_META = {
  citizen: { sub: 'Citizen Portal', name: 'Rajesh Kumar Singh', role: 'Citizen', badge: 'CITIZEN', avatar: 'RS', home: '/citizen/dashboard' },
  authority: { sub: 'Registrar Portal', name: 'Ramesh Sharma', role: 'Registrar, Sadar', badge: 'REGISTRAR', avatar: 'RS', home: '/authority/dashboard' },
  government: { sub: 'HQ Portal', name: 'Mukesh Kumar', role: 'Joint Secretary', badge: 'GOVERNMENT_HQ', avatar: 'MK', home: '/government/dashboard' },
};

export const PORTAL_NAV = {
  citizen: [
    {
      label: 'Overview',
      links: [{ to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard, keywords: 'home overview' }],
    },
    {
      label: 'Property & Transfers',
      links: [
        { to: '/citizen/properties', label: 'My Properties', icon: Landmark, keywords: 'land parcels khasra' },
        { to: '/citizen/new-transfer', label: 'New Transfer', icon: ArrowLeftRight, keywords: 'mutation sale transfer' },
        { to: '/citizen/applications', label: 'My Applications', icon: FileText, keywords: 'status track' },
      ],
    },
    {
      label: 'Land Services',
      links: [
        { to: '/citizen/verify-land', label: 'Verify Land', icon: SearchCheck, keywords: 'khasra ownership check' },
        { to: '/citizen/book-appointment', label: 'Book Appointment', icon: CalendarClock, keywords: 'slot registrar office' },
        { to: '/citizen/download-registry', label: 'Download E-Registry', icon: FileDown, keywords: 'certificate pdf' },
      ],
    },
  ],
  authority: [
    {
      label: 'Overview',
      links: [{ to: '/authority/dashboard', label: 'Dashboard', icon: LayoutDashboard, keywords: 'home overview' }],
    },
    {
      label: 'Operations',
      links: [
        { to: '/authority/applications', label: 'Applications', icon: ClipboardList, keywords: 'queue review verify' },
        { to: '/authority/ekyc', label: 'KYC Status', icon: Fingerprint, keywords: 'biometric identity' },
        { to: '/authority/registry', label: 'Transactions', icon: Blocks, keywords: 'blockchain ledger retry' },
      ],
    },
  ],
  government: [
    {
      label: 'Overview',
      links: [{ to: '/government/dashboard', label: 'Dashboard', icon: LayoutDashboard, keywords: 'home overview' }],
    },
    {
      label: 'Surveillance',
      links: [
        { to: '/government/monitoring', label: 'Registry Monitoring', icon: Activity, keywords: 'tehsil nodes health' },
        { to: '/government/analytics', label: 'Analytics', icon: BarChart3, keywords: 'reports charts revenue' },
        { to: '/government/disputes', label: 'Disputes', icon: Scale, keywords: 'cases resolution' },
      ],
    },
  ],
};

export function portalForRole(role) {
  if (role === 'REGISTRAR') return 'authority';
  if (role === 'GOVERNMENT_HQ') return 'government';
  return 'citizen';
}
