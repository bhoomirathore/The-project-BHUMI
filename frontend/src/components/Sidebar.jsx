import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ portal = 'citizen' }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/auth/login');
    }
  };

  const portalConfig = {
    citizen: {
      sub: 'Citizen Portal',
      user: { avatar: 'RS', name: 'Ramesh Sharma', role: 'Citizen', badge: null },
      sections: [
        {
          label: 'My Account',
          links: [
            { to: '/citizen/dashboard', label: 'Dashboard' },
          ],
        },
        {
          label: 'Land Services',
          links: [
            { to: '/citizen/verify-land', label: 'Verify Land' },
            { to: '/citizen/book-appointment', label: 'Book Appointment' },
            { to: '/citizen/download-registry', label: 'Download E-Registry' },
          ],
        },
        {
          label: 'Account',
          links: [
            { to: '#', label: 'Profile', onClick: (e) => { e.preventDefault(); alert('Profile modal / settings'); } },
            { to: '/auth/login', label: 'Logout', onClick: handleLogout },
          ],
        },
      ],
    },
    authority: {
      sub: 'Authority Portal',
      user: { avatar: 'RS', name: 'Ramesh Sharma', role: 'Registrar, Sadar', badge: 'AUTHORITY' },
      sections: [
        {
          label: 'Overview',
          links: [
            { to: '/authority/dashboard', label: 'Dashboard' },
          ],
        },
        {
          label: 'Operations',
          links: [
            { to: '/authority/verification', label: 'Document Verification' },
            { to: '/authority/ekyc', label: 'eKYC Processing' },
            { to: '/authority/registry', label: 'Registry & Mutation' },
          ],
        },
        {
          label: 'Account',
          links: [
            { to: '#', label: 'Profile', onClick: (e) => { e.preventDefault(); alert('Profile settings'); } },
            { to: '/auth/login', label: 'Logout', onClick: handleLogout },
          ],
        },
      ],
    },
    government: {
      sub: 'HQ Portal',
      user: { avatar: 'MK', name: 'Mukesh Kumar', role: 'Joint Secretary', badge: 'GOV HQ' },
      sections: [
        {
          label: 'Overview',
          links: [
            { to: '/government/dashboard', label: 'Dashboard' },
          ],
        },
        {
          label: 'Surveillance',
          links: [
            { to: '/government/monitoring', label: 'Registry Monitoring' },
            { to: '/government/analytics', label: 'Analytics' },
            { to: '/government/disputes', label: 'Disputes' },
          ],
        },
        {
          label: 'Account',
          links: [
            { to: '/auth/login', label: 'Logout', onClick: handleLogout },
          ],
        },
      ],
    },
  };

  const current = portalConfig[portal] || portalConfig.citizen;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#2B1B14]/40 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile top toggle */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 rounded-xl bg-[#E6DEDA] border border-[#D3CCC8] text-[#2B1B14] shadow-md flex items-center justify-center text-lg active:scale-95 transition-all"
          aria-label="Toggle Sidebar Menu"
        >
          &#9776;
        </button>
      </div>

      <aside
        className={`fixed top-0 left-0 h-screen z-50 flex flex-col bg-[#E6DEDA] border-r border-[#D3CCC8] shadow-[4px_0_30px_rgba(43,27,20,0.06)] transition-all duration-300 ${
          collapsed ? 'w-[80px]' : 'w-[280px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#D3CCC8] bg-[#F8F2F0]/60 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-[32px] h-[32px] rounded-[6px] bg-gradient-to-br from-[#2B1B14] to-[#6E5D53] flex items-center justify-center shrink-0 shadow-sm">
              <div className="w-[12px] h-[12px] bg-[#E6DEDA] rounded-[2px]" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-[1.2rem] font-bold tracking-[1px] text-[#2B1B14]">
                  B.H.U.M.I
                </span>
                <span className="text-[0.68rem] text-[#6E5D53] uppercase tracking-wider font-semibold">
                  {current.sub}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-[#6E5D53] hover:text-[#2B1B14] p-1 text-lg leading-none"
            title="Toggle Sidebar"
          >
            &#9776;
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#6E5D53] hover:text-[#2B1B14] p-1 text-2xl leading-none"
            aria-label="Close Sidebar"
          >
            &times;
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-[#D3CCC8] flex items-center gap-3 bg-[#D3CCC8]/30">
          <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#2B1B14] to-[#6E5D53] text-[#F8F2F0] font-bold flex items-center justify-center shrink-0 shadow-sm">
            {current.user.avatar}
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[0.92rem] font-bold text-[#2B1B14] truncate">
                {current.user.name}
              </span>
              <span className="text-[0.78rem] text-[#6E5D53] truncate">
                {current.user.role}
              </span>
              {current.user.badge && (
                <span className="mt-1 inline-block text-[0.62rem] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2B1B14]/10 border border-[#2B1B14]/20 text-[#2B1B14] w-fit">
                  {current.user.badge}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-4">
          {current.sections.map((sec, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {!collapsed && (
                <div className="px-3 text-[0.68rem] font-bold uppercase tracking-wider text-[#7A6B63] mb-1">
                  {sec.label}
                </div>
              )}
              {sec.links.map((link, lIdx) => (
                <NavLink
                  key={lIdx}
                  to={link.to}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setMobileOpen(false);
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.9rem] font-medium transition-all duration-200 ${
                      isActive && link.to !== '#'
                        ? 'bg-[#D3CCC8] text-[#2B1B14] shadow-sm border-l-4 border-[#2B1B14]'
                        : 'text-[#6E5D53] hover:text-[#2B1B14] hover:bg-[#D3CCC8]/40'
                    }`
                  }
                  title={collapsed ? link.label : undefined}
                >
                  <span className="truncate">{link.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#D3CCC8]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-[0.88rem] font-semibold text-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/15 border border-[#DC2626]/20 transition-all"
          >
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
