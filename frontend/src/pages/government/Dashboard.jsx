import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function GovernmentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="government" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              State Land Revenue &amp; Governance HQ
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Ministry of Land Resources | State Overview
            </p>
          </div>
          <div className="flex items-center gap-3 p-2 px-3 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] self-end sm:self-auto">
            <div className="w-8 h-8 rounded-full bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs flex items-center justify-center">
              HQ
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#2B1B14]">
                Directorate of Land Records
              </span>
              <span className="text-[0.68rem] text-[#6E5D53]">State Administrator</span>
            </div>
          </div>
        </header>

        {/* HQ Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Total Land Digitized</span>
            <div className="text-3xl font-extrabold text-[#2B1B14] mt-1">1.42 M</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">↑ +12.4% vs last quarter</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Blockchain Blocks</span>
            <div className="text-3xl font-extrabold text-[#2B1B14] mt-1">10,484</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">↑ 100% Immutable</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Tehsils Online</span>
            <div className="text-3xl font-extrabold text-[#2B1B14] mt-1">358 / 358</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">● Fully Connected</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Stamp Duty Revenue</span>
            <div className="text-3xl font-extrabold text-[#2B1B14] mt-1">₹ 4,820 Cr</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">↑ +8.1% target met</span>
          </div>
        </section>

        {/* Regional Stream Table */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">
            Regional Land Transaction Stream
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                  <th className="p-4 font-semibold">Region / District</th>
                  <th className="p-4 font-semibold">Active Mutations</th>
                  <th className="p-4 font-semibold">Total Registered Area</th>
                  <th className="p-4 font-semibold">Validator Health</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                <tr>
                  <td className="p-4 font-bold text-[#2B1B14]">Pune Region</td>
                  <td className="p-4">1,420</td>
                  <td className="p-4">84,200 Hectares</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                      100% Operational
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate('/government/analytics')}
                      className="px-3 py-1.5 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] rounded text-xs font-semibold transition-colors"
                    >
                      View Analytics
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#2B1B14]">Mumbai Metropolitan</td>
                  <td className="p-4">3,890</td>
                  <td className="p-4">42,100 Hectares</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                      100% Operational
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => navigate('/government/analytics')}
                      className="px-3 py-1.5 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] rounded text-xs font-semibold transition-colors"
                    >
                      View Analytics
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
