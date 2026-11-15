import {
  LayoutDashboard,
  Landmark,
  FileText,
  SearchCheck,
  CalendarClock,
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
      links: [
        { to: '/citizen/dashboard', label: 'Dashboard', icon: LayoutDashboard, keywords: 'home overview' },
      ],
    },
    {
      label: 'Services',
      links: [
        { to: '/citizen/book-appointment', label: 'Book Appointment', icon: CalendarClock, keywords: 'appointment slot visit transfer registrar office' },
        { to: '/citizen/verify-land', label: 'Verify Land & E-Registry', icon: SearchCheck, keywords: 'verify land certificate e-registry khasra download ownership' },
      ],
    },
    {
      label: 'My Records',
      links: [
        { to: '/citizen/properties', label: 'My Properties', icon: Landmark, keywords: 'land properties parcels khasra' },
        { to: '/citizen/applications', label: 'My Applications', icon: FileText, keywords: 'status track applications transfers' },
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
