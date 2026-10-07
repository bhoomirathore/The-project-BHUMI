import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';

const INITIAL_DISPUTES = [
  {
    id: 'DISP-2024-0891',
    khasra: '104/A',
    district: 'Lucknow',
    complainant: 'Harish Chandra',
    respondent: 'Devendra Nath',
    category: 'Boundary Overlap',
    filedDate: '02-Jan-2024',
    status: 'Active',
    summary: 'Alleged encroachment of 300 sq.ft residential plot boundary after road expansion.',
  },
  {
    id: 'DISP-2024-0742',
    khasra: '512/3',
    district: 'Agra',
    complainant: 'Sunita Mehra',
    respondent: 'Ratan Lal',
    category: 'Ownership Title Contest',
    filedDate: '14-Dec-2023',
    status: 'Under Review',
    summary: 'Conflicting historical inheritance claims registered in two separate sub-tehsil books.',
  },
  {
    id: 'DISP-2023-9981',
    khasra: '78/B',
    district: 'Kanpur',
    complainant: 'Ajay K. Saxena',
    respondent: 'State Highway Authority',
    category: 'Compensation Dispute',
    filedDate: '28-Nov-2023',
    status: 'Resolved',
    summary: 'Discrepancy in circle rate evaluation for acquired agricultural corridor land.',
  },
  {
    id: 'DISP-2024-0105',
    khasra: '221/1',
    district: 'Prayagraj',
    complainant: 'Balram Yadav',
    respondent: 'Vikramaditya Rao',
    category: 'Mutation Objection',
    filedDate: '18-Jan-2024',
    status: 'Active',
    summary: 'Objection filed against digital mutation claiming forged unregistered sale deed.',
  },
];

export default function GovernmentDisputes() {
  const [disputes, setDisputes] = useState(INITIAL_DISPUTES);
  const [filter, setFilter] = useState('All');
  const [activeCase, setActiveCase] = useState(null);

  const filtered = disputes.filter((d) => {
    if (filter === 'All') return true;
    return d.status.toLowerCase() === filter.toLowerCase();
  });

  const handleResolveCase = (id) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Resolved' } : d))
    );
    alert(`Case ${id} marked as RESOLVED and updated on Tribunal Ledger.`);
    setActiveCase(null);
  };

  const handleEscalateCase = (id) => {
    alert(`Case ${id} escalated to District Magistrate Revenue Tribunal.`);
    setActiveCase(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="government" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Topbar */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Dispute Management
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Monitor, escalate &amp; resolve land disputes nationwide
            </p>
          </div>
          <button
            onClick={() => alert('Exporting disputes log as PDF/CSV...')}
            className="py-2 px-4 bg-[#2B1B14] hover:bg-[#3D281E] text-[#F8F2F0] font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all self-end sm:self-auto"
          >
            ⬇ Export
          </button>
        </header>

        {/* Dispute KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Total Disputes</span>
            <div className="text-2xl font-bold text-[#2B1B14] mt-1">4,218</div>
            <span className="text-xs text-[#6E5D53] mt-1 block">FY 2024–25</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#DC2626]/30 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Active / Open</span>
            <div className="text-2xl font-bold text-[#DC2626] mt-1">1,204</div>
            <span className="text-xs text-[#B45309] mt-1 block">Requires monitoring</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#10B981]/30 rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Resolved</span>
            <div className="text-2xl font-bold text-[#047857] mt-1">2,791</div>
            <span className="text-xs text-[#047857] mt-1 block">66.2% resolution rate</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm">
            <span className="text-xs font-semibold text-[#6E5D53]">Avg Resolution Time</span>
            <div className="text-2xl font-bold text-[#2B1B14] mt-1">42 Days</div>
            <span className="text-xs text-[#047857] mt-1 block">Fastest in South Zone</span>
          </div>
        </section>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['All', 'Active', 'Under Review', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${
                filter === tab
                  ? 'bg-[#2B1B14] text-[#F8F2F0] shadow-sm'
                  : 'bg-[#E6DEDA] border border-[#D3CCC8] text-[#6E5D53] hover:text-[#2B1B14]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Disputes Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs font-bold text-[#2B1B14]">
                    {item.id}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.status === 'Resolved'
                        ? 'bg-[#10B981]/15 text-[#047857]'
                        : item.status === 'Active'
                        ? 'bg-[#DC2626]/15 text-[#DC2626]'
                        : 'bg-[#F59E0B]/20 text-[#B45309]'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#2B1B14] mb-1">
                  Khasra {item.khasra} · {item.district}
                </h3>
                <span className="inline-block text-[0.7rem] uppercase font-bold text-[#6E5D53] mb-3">
                  {item.category}
                </span>

                <div className="text-xs text-[#6E5D53] flex flex-col gap-1 mb-3">
                  <p>
                    <strong className="text-[#2B1B14]">Parties:</strong> {item.complainant} vs{' '}
                    {item.respondent}
                  </p>
                  <p>
                    <strong className="text-[#2B1B14]">Filed:</strong> {item.filedDate}
                  </p>
                </div>

                <p className="text-xs text-[#2B1B14] bg-[#F8F2F0] p-3 rounded-lg border border-[#D3CCC8]">
                  {item.summary}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#D3CCC8] flex gap-2">
                <button
                  onClick={() => setActiveCase(item)}
                  className="flex-1 py-2 px-3 bg-[#2B1B14] hover:bg-[#3D281E] text-[#F8F2F0] font-bold text-xs rounded-lg shadow-sm"
                >
                  Review Case
                </button>
                <button
                  onClick={() => handleEscalateCase(item.id)}
                  className="py-2 px-3 bg-[#F8F2F0] border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg"
                >
                  Escalate
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Case Review Modal */}
      {activeCase && (
        <Modal
          isOpen={!!activeCase}
          onClose={() => setActiveCase(null)}
          title={`Tribunal Case Review - ${activeCase.id}`}
          footer={
            <div className="flex gap-2">
              <button
                onClick={() => setActiveCase(null)}
                className="py-2 px-4 bg-[#F8F2F0] border border-[#D3CCC8] hover:bg-[#D3CCC8]/50 text-[#2B1B14] rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => handleEscalateCase(activeCase.id)}
                className="py-2 px-4 bg-[#F59E0B] text-[#2B1B14] font-bold rounded-lg text-xs shadow-sm"
              >
                Escalate to DM Court
              </button>
              <button
                onClick={() => handleResolveCase(activeCase.id)}
                className="py-2 px-4 bg-[#10B981] text-white font-bold rounded-lg text-xs shadow-sm"
              >
                Resolve &amp; Close Case
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className="text-[#6E5D53]">Case Category:</span>
                <span className="font-bold text-[#2B1B14]">{activeCase.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5D53]">Parcel / Khasra:</span>
                <span className="font-bold text-[#2B1B14]">{activeCase.khasra}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5D53]">District:</span>
                <span className="text-[#2B1B14]">{activeCase.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5D53]">Complainant:</span>
                <span className="text-[#2B1B14]">{activeCase.complainant}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E5D53]">Respondent:</span>
                <span className="text-[#2B1B14]">{activeCase.respondent}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8]">
              <strong className="text-[#2B1B14] block mb-1">Detailed Case Summary:</strong>
              <p className="text-[#6E5D53] leading-relaxed">{activeCase.summary}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
