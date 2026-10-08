import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import applicationService from '../../services/applicationService';
import TransactionStatusPill from '../../components/TransactionStatusPill';
import { APPLICATION_STATUSES } from '../../utils/statuses';

export default function ApplicationQueue() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      setLoading(true);
      try {
        const apps = await applicationService.getAllApplications(statusFilter);
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Application Queue
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Review, verify and audit land transfer applications
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="text-xs font-semibold text-[#2B1B14]">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-xs font-semibold text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              <option value="ALL">All Applications</option>
              <option value={APPLICATION_STATUSES.UNDER_VERIFICATION}>Under Verification</option>
              <option value={APPLICATION_STATUSES.SUBMITTED}>Submitted</option>
              <option value={APPLICATION_STATUSES.COMPLETED}>Completed</option>
              <option value={APPLICATION_STATUSES.FAILED}>Failed</option>
              <option value={APPLICATION_STATUSES.REJECTED}>Rejected</option>
              <option value={APPLICATION_STATUSES.RESUBMISSION}>Resubmission</option>
            </select>
          </div>
        </header>

        {/* Applications Table Card */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#D3CCC8] flex justify-between items-center bg-[#F8F2F0]/50">
            <h2 className="text-base sm:text-lg font-bold text-[#2B1B14]">
              Transfer Applications ({applications.length})
            </h2>
            <span className="text-xs text-[#6E5D53]">Click on any row to open review desk</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">Loading queue...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">
              No applications found matching the selected filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                    <th className="p-4 font-semibold">Application ID</th>
                    <th className="p-4 font-semibold">Parcel ULPIN</th>
                    <th className="p-4 font-semibold">Seller</th>
                    <th className="p-4 font-semibold">Buyer</th>
                    <th className="p-4 font-semibold">Submitted Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => navigate(`/authority/applications/${app.id}`)}
                      className="hover:bg-[#D3CCC8]/30 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-[#2B1B14]">{app.id}</td>
                      <td className="p-4 font-mono text-[#6E5D53]">{app.propertyId}</td>
                      <td className="p-4 font-medium text-[#2B1B14]">{app.sellerName}</td>
                      <td className="p-4 font-medium text-[#2B1B14]">{app.buyerName}</td>
                      <td className="p-4 text-[#6E5D53]">{app.submittedAt}</td>
                      <td className="p-4">
                        <TransactionStatusPill status={app.applicationStatus} />
                      </td>
                      <td className="p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/authority/applications/${app.id}`);
                          }}
                          className="py-1 px-3 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded shadow hover:bg-[#3D281F]"
                        >
                          Review &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
