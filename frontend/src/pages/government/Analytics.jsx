import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function GovernmentAnalytics() {
  const [selectedYear, setSelectedYear] = useState('2024');

  const deedTypes = [
    { type: 'Sale Deed', count: '84,210', pct: 56, color: '#3B82F6' },
    { type: 'Gift Deed', count: '28,140', pct: 19, color: '#10B981' },
    { type: 'Mortgage Deed', count: '18,320', pct: 12, color: '#F59E0B' },
    { type: 'Partition Deed', count: '11,430', pct: 8, color: '#8B5CF6' },
    { type: 'Lease / Other', count: '6,202', pct: 5, color: '#EF4444' },
  ];

  const districtRankings = [
    { rank: 1, district: 'Lucknow', deeds: '24,890', revenue: '₹ 142 Cr', compliance: '98%' },
    { rank: 2, district: 'Prayagraj', deeds: '21,340', revenue: '₹ 118 Cr', compliance: '97%' },
    { rank: 3, district: 'Kanpur', deeds: '19,820', revenue: '₹ 105 Cr', compliance: '96%' },
    { rank: 4, district: 'Agra', deeds: '16,740', revenue: '₹ 89 Cr', compliance: '95%' },
    { rank: 5, district: 'Varanasi', deeds: '14,210', revenue: '₹ 78 Cr', compliance: '94%' },
  ];

  const handleExport = () => {
    alert(`Exporting Revenue & Deed Analytics Report for ${selectedYear} (PDF/CSV)...`);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="government" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Topbar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">Analytics</h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Deep insights across districts, deed types &amp; timelines
            </p>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="py-2 px-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-xs text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <button
              onClick={handleExport}
              className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90 transition-all"
            >
              ⬇ Export Report
            </button>
          </div>
        </header>

        {/* Stat Summary Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Total Deeds</span>
            <div className="text-3xl font-extrabold text-[#2B1B14] mt-1">1,48,302</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">↑ 12.4% YoY</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Stamp Revenue</span>
            <div className="text-3xl font-extrabold text-[#2B1B14] mt-1">₹842Cr</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">↑ 9.1% YoY</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Avg Mutation Time</span>
            <div className="text-3xl font-extrabold text-[#2B1B14] mt-1">3.2 Days</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">↓ 1.8d vs 2023</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Blockchain Verification</span>
            <div className="text-3xl font-extrabold text-[#047857] mt-1">100%</div>
            <span className="text-xs text-[#6E5D53] mt-1 block">Node uptime 99.98%</span>
          </div>
        </section>

        {/* Charts & Breakdown */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Deed Type Distribution */}
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#2B1B14] mb-4">
              Deed Classification Breakdown ({selectedYear})
            </h3>
            <div className="flex flex-col gap-4">
              {deedTypes.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#2B1B14]">{item.type}</span>
                    <span className="text-[#6E5D53]">
                      {item.count} ({item.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#D3CCC8] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District Ranking Table */}
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#2B1B14] mb-4">
              Top Performing Districts
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#D3CCC8] text-[#6E5D53]">
                    <th className="py-2.5 font-semibold">Rank</th>
                    <th className="py-2.5 font-semibold">District</th>
                    <th className="py-2.5 font-semibold">Deeds</th>
                    <th className="py-2.5 font-semibold">Revenue</th>
                    <th className="py-2.5 font-semibold">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                  {districtRankings.map((row) => (
                    <tr key={row.rank}>
                      <td className="py-3 font-bold text-[#2B1B14]">#{row.rank}</td>
                      <td className="py-3 font-semibold text-[#2B1B14]">{row.district}</td>
                      <td className="py-3">{row.deeds}</td>
                      <td className="py-3 font-mono">{row.revenue}</td>
                      <td className="py-3 text-[#047857] font-bold">{row.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
