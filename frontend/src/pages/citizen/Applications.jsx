import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import applicationService from '../../services/applicationService';
import TransactionStatusPill from '../../components/TransactionStatusPill';

export default function CitizenApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      if (user?.id) {
        try {
          const list = await applicationService.getUserApplications(user.id);
          setApplications(list);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchApps();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              My Applications
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Track the progress of your land transfer applications
            </p>
          </div>
          <button
            onClick={() => navigate('/citizen/new-transfer')}
            className="py-2.5 px-5 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all"
          >
            + New Transfer
          </button>
        </header>

        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#D3CCC8] flex justify-between items-center bg-[#F8F2F0]/50">
            <h2 className="text-base sm:text-lg font-bold text-[#2B1B14]">
              Active &amp; Historical Transfer Requests ({applications.length})
            </h2>
            <span className="text-xs text-[#6E5D53]">Real-time mutation workflow tracking</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">
              No transfer applications found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                    <th className="p-4 font-semibold">Application ID</th>
                    <th className="p-4 font-semibold">Property ID</th>
                    <th className="p-4 font-semibold">Buyer</th>
                    <th className="p-4 font-semibold">Submission Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-[#D3CCC8]/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#2B1B14]">{app.id}</td>
                      <td className="p-4 font-mono text-[#6E5D53]">{app.propertyId}</td>
                      <td className="p-4 font-medium text-[#2B1B14]">{app.buyerName}</td>
                      <td className="p-4 text-[#6E5D53]">{app.submittedAt}</td>
                      <td className="p-4">
                        <TransactionStatusPill status={app.applicationStatus} />
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate(`/citizen/applications/${app.id}`)}
                          className="py-1.5 px-3 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all"
                        >
                          View Detail &rarr;
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
