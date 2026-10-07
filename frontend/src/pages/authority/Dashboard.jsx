import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setClock(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
                Authority Dashboard
              </h1>
              {clock && (
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#E6DEDA] border border-[#D3CCC8] text-[#2B1B14] font-bold">
                  {clock}
                </span>
              )}
            </div>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">Lucknow Sadar Registry Office</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end sm:self-auto">
            <button
              onClick={() => alert('New application entry dialog')}
              className="py-2 px-3.5 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90 transition-all"
            >
              + New Application
            </button>
            <button
              onClick={() => alert('Search registry database')}
              className="py-2 px-3.5 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
            >
              🔍 Search Records
            </button>
            <div className="relative p-2 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] cursor-pointer hover:border-[#2B1B14] transition-colors">
              <span>🔔</span>
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[0.65rem] font-bold px-1.5 py-0.2 rounded-full">
                12
              </span>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#DC2626]">8</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Urgent Applications</div>
            <span className="text-xs text-[#DC2626] font-medium mt-1 block">Due Today</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#B45309]">24</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Pending Verifications</div>
            <span className="text-xs text-[#6E5D53] mt-1 block">+5 from yesterday</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#047857]">156</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Completed This Month</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">↑ 12% from last month</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#2563EB]">15</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Scheduled Appointments</div>
            <span className="text-xs text-[#6E5D53] mt-1 block">This Week</span>
          </div>
        </section>

        {/* Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 mb-10">
          <div>
            <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Today's Tasks</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded text-[0.68rem] font-extrabold bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626]">
                    URGENT
                  </span>
                  <span className="text-xs text-[#6E5D53]">2 hours left</span>
                </div>
                <h4 className="text-base font-bold text-[#2B1B14] mb-1">
                  Document Verification - Khasra 234/5
                </h4>
                <p className="text-xs text-[#6E5D53] mb-4">
                  Applicant: Suresh Kumar | Registry Type: Sale Deed
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/authority/verification')}
                    className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90"
                  >
                    Start Verification
                  </button>
                  <button
                    onClick={() => alert('Applicant details modal')}
                    className="py-2 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>

              <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded text-[0.68rem] font-extrabold bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB]">
                    EKYC PENDING
                  </span>
                  <span className="text-xs text-[#6E5D53]">Today 02:30 PM</span>
                </div>
                <h4 className="text-base font-bold text-[#2B1B14] mb-1">
                  eKYC Biometric Verification - Application #2024-0235
                </h4>
                <p className="text-xs text-[#6E5D53] mb-4">
                  Parties: Ram Kumar Singh & Suresh Kumar
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/authority/ekyc')}
                    className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90"
                  >
                    Start eKYC
                  </button>
                </div>
              </div>

              <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded text-[0.68rem] font-extrabold bg-[#047857]/10 border border-[#047857]/20 text-[#047857]">
                    MUTATION READY
                  </span>
                  <span className="text-xs text-[#6E5D53]">Pending Approval</span>
                </div>
                <h4 className="text-base font-bold text-[#2B1B14] mb-1">
                  Deed Execution & Mutation - Khasra 567/8
                </h4>
                <p className="text-xs text-[#6E5D53] mb-4">
                  Smart Contract Final Commitment: Node #10484
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/authority/registry')}
                    className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90"
                  >
                    Execute Deed
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Operations & Office Stats */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Office Activity Summary</h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Today's Appointments:</span>
                  <span className="font-bold text-[#2B1B14]">12 Slots</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Biometrics Done:</span>
                  <span className="font-bold text-[#047857]">8 Verified</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Deeds Minted:</span>
                  <span className="font-bold text-[#2B1B14]">5 Blocks</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6E5D53]">Stamp Duty Collected:</span>
                  <span className="font-bold text-[#2B1B14]">₹ 38.4 Lakhs</span>
                </div>
              </div>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Direct Navigation</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate('/authority/verification')}
                  className="w-full text-left p-2.5 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] hover:bg-[#D3CCC8]/40 text-xs font-semibold text-[#2B1B14] flex justify-between items-center transition-all"
                >
                  <span>Document Audit Queue</span>
                  <span>&rarr;</span>
                </button>
                <button
                  onClick={() => navigate('/authority/ekyc')}
                  className="w-full text-left p-2.5 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] hover:bg-[#D3CCC8]/40 text-xs font-semibold text-[#2B1B14] flex justify-between items-center transition-all"
                >
                  <span>Aadhaar Biometric eKYC</span>
                  <span>&rarr;</span>
                </button>
                <button
                  onClick={() => navigate('/authority/registry')}
                  className="w-full text-left p-2.5 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] hover:bg-[#D3CCC8]/40 text-xs font-semibold text-[#2B1B14] flex justify-between items-center transition-all"
                >
                  <span>Deed Mutation & Minting</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
