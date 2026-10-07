import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';

const TEHSIL_DATA = [
  { name: 'Agra Sadar', district: 'Agra', registries: 8420, mutations: 3210, pending: 284, coverage: 97, status: 'active' },
  { name: 'Fatehabad', district: 'Agra', registries: 4180, mutations: 1640, pending: 512, coverage: 88, status: 'pending' },
  { name: 'Etmadpur', district: 'Agra', registries: 2930, mutations: 980, pending: 120, coverage: 94, status: 'active' },
  { name: 'Lucknow Sadar', district: 'Lucknow', registries: 9840, mutations: 4120, pending: 340, coverage: 98, status: 'active' },
  { name: 'Bakshi Ka Talab', district: 'Lucknow', registries: 5210, mutations: 2180, pending: 189, coverage: 95, status: 'active' },
  { name: 'Mohanlalganj', district: 'Lucknow', registries: 3760, mutations: 1490, pending: 421, coverage: 87, status: 'pending' },
  { name: 'Varanasi Sadar', district: 'Varanasi', registries: 7840, mutations: 3280, pending: 218, coverage: 96, status: 'active' },
  { name: 'Pindra', district: 'Varanasi', registries: 3120, mutations: 1140, pending: 380, coverage: 82, status: 'pending' },
  { name: 'Arajiline', district: 'Varanasi', registries: 2480, mutations: 890, pending: 640, coverage: 71, status: 'inactive' },
  { name: 'Kanpur Sadar', district: 'Kanpur', registries: 8190, mutations: 3410, pending: 290, coverage: 97, status: 'active' },
  { name: 'Bilhaur', district: 'Kanpur', registries: 3490, mutations: 1360, pending: 452, coverage: 85, status: 'pending' },
  { name: 'Ghatampur', district: 'Kanpur', registries: 2860, mutations: 1020, pending: 320, coverage: 89, status: 'active' },
  { name: 'Prayagraj Sadar', district: 'Prayagraj', registries: 9120, mutations: 3840, pending: 180, coverage: 98, status: 'active' },
  { name: 'Phulpur', district: 'Prayagraj', registries: 4280, mutations: 1680, pending: 390, coverage: 90, status: 'active' },
  { name: 'Handia', district: 'Prayagraj', registries: 2940, mutations: 1090, pending: 510, coverage: 83, status: 'pending' },
  { name: 'Soraon', district: 'Prayagraj', registries: 1840, mutations: 620, pending: 720, coverage: 68, status: 'inactive' },
  { name: 'Mathura Sadar', district: 'Mathura', registries: 6320, mutations: 2480, pending: 210, coverage: 96, status: 'active' },
  { name: 'Chhata', district: 'Mathura', registries: 2890, mutations: 980, pending: 340, coverage: 88, status: 'pending' },
];

export default function GovernmentMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    return TEHSIL_DATA.filter((row) => {
      const matchSearch =
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.district.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDistrict = districtFilter === 'all' || row.district === districtFilter;
      const matchStatus = statusFilter === 'all' || row.status === statusFilter;
      return matchSearch && matchDistrict && matchStatus;
    });
  }, [searchTerm, districtFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const exportCSV = () => {
    alert('Exporting Tehsil Monitoring data as CSV...');
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="government" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Topbar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Registry Monitoring
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Real-time tehsil &amp; block-wise tracking
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#047857] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#047857] animate-pulse" />
              LIVE
            </span>
            <button
              onClick={exportCSV}
              className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90 transition-all"
            >
              ⬇ Export CSV
            </button>
          </div>
        </header>

        {/* KPI Strip */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Active Tehsils</span>
            <div className="text-2xl font-bold text-[#2B1B14] mt-1">358 Nodes</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">100% Online</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Today's Registrations</span>
            <div className="text-2xl font-bold text-[#2B1B14] mt-1">1,842</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">Across state</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Blockchain Latency</span>
            <div className="text-2xl font-bold text-[#2B1B14] mt-1">1.2 sec</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">Consensus Finality</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Sync Status</span>
            <div className="text-2xl font-bold text-[#047857] mt-1">Healthy</div>
            <span className="text-xs text-[#6E5D53] mt-1 block">Block #10484</span>
          </div>
        </section>

        {/* Filter Controls */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="Search tehsil or district..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="p-2.5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-xs text-[#2B1B14] placeholder-[#7A6B63] w-full sm:w-64 focus:outline-none focus:border-[#2B1B14]"
          />

          <div className="flex flex-wrap gap-3">
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setPage(1);
              }}
              className="p-2.5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-xs text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              <option value="all">All Districts</option>
              <option value="Agra">Agra</option>
              <option value="Lucknow">Lucknow</option>
              <option value="Varanasi">Varanasi</option>
              <option value="Kanpur">Kanpur</option>
              <option value="Prayagraj">Prayagraj</option>
              <option value="Mathura">Mathura</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="p-2.5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-xs text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </section>

        {/* Tehsil Monitoring Table */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-x-auto shadow-sm mb-6">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                <th className="p-4 font-semibold">Tehsil</th>
                <th className="p-4 font-semibold">District</th>
                <th className="p-4 font-semibold">Registries</th>
                <th className="p-4 font-semibold">Mutations</th>
                <th className="p-4 font-semibold">Pending</th>
                <th className="p-4 font-semibold">Digitized Coverage</th>
                <th className="p-4 font-semibold">Node Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
              {paginated.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#D3CCC8]/30 transition-colors">
                  <td className="p-4 font-bold text-[#2B1B14]">{row.name}</td>
                  <td className="p-4 text-[#6E5D53]">{row.district}</td>
                  <td className="p-4 font-mono">{row.registries.toLocaleString('en-IN')}</td>
                  <td className="p-4 font-mono">{row.mutations.toLocaleString('en-IN')}</td>
                  <td className={`p-4 font-mono ${row.pending > 400 ? 'text-[#B45309] font-bold' : 'text-inherit'}`}>
                    {row.pending.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-[#D3CCC8] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.coverage >= 90
                              ? 'bg-[#047857]'
                              : row.coverage >= 75
                              ? 'bg-[#2563EB]'
                              : 'bg-[#B45309]'
                          }`}
                          style={{ width: `${row.coverage}%` }}
                        />
                      </div>
                      <span className="font-semibold text-[0.7rem]">{row.coverage}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    {row.status === 'active' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#047857] font-bold">
                        ● Active
                      </span>
                    )}
                    {row.status === 'pending' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#B45309] font-bold">
                        ● Pending
                      </span>
                    )}
                    {row.status === 'inactive' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#DC2626]/15 text-[#DC2626] font-bold">
                        ● Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t border-[#D3CCC8] bg-[#F8F2F0]/40">
            <span className="text-xs text-[#6E5D53]">
              Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to{' '}
              {Math.min(page * perPage, filtered.length)} of {filtered.length} tehsils
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="py-1 px-3 rounded bg-[#F8F2F0] border border-[#D3CCC8] text-[#2B1B14] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D3CCC8]/40"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="py-1 px-3 rounded bg-[#F8F2F0] border border-[#D3CCC8] text-[#2B1B14] text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#D3CCC8]/40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
