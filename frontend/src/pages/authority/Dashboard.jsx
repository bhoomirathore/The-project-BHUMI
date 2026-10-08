import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import applicationService from '../../services/applicationService';

export default function AuthorityDashboard() {
  const navigate = useNavigate();
  const [clock, setClock] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function loadAuthorityData() {
      try {
        const apps = await applicationService.getAllApplications();
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAuthorityData();
  }, []);

  // Stats derived from domain services
  const pendingReviews = applications.filter(
    (a) => a.applicationStatus === 'UNDER_VERIFICATION'
  ).length;

  const completedThisMonth = applications.filter(
    (a) => a.applicationStatus === 'COMPLETED'
  ).length;

  const needingAttention = applications.filter(
    (a) =>
      a.applicationStatus === 'FAILED' ||
      a.blockchainStatus === 'FAILED' ||
      a.blockchainStatus === 'SYNC_FAILED'
  ).length;

  const scheduledAppointments = applications.filter((a) => a.appointment).length;

  // Oldest 3 applications awaiting review
  const tasksAwaitingReview = applications
    .filter((a) => a.applicationStatus === 'UNDER_VERIFICATION')
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
                Registrar Dashboard
              </h1>
              {clock && (
                <span className="font-mono text-xs px-2.5 py-1 rounded bg-[#E6DEDA] border border-[#D3CCC8] text-[#2B1B14] font-bold">
                  {clock}
                </span>
              )}
            </div>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Review transfer submissions and supervise blockchain ledger mutations
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => navigate('/authority/applications')}
              className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all"
            >
              Open Application Queue &rarr;
            </button>
          </div>
        </header>

        {/* Derived Stats Overview */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#B45309]">{pendingReviews}</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Pending Reviews</div>
            <span className="text-xs text-[#6E5D53] mt-1 block">Awaiting officer audit</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#047857]">{completedThisMonth}</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Completed This Month</div>
            <span className="text-xs text-[#047857] font-medium mt-1 block">Finalized and synchronized</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#DC2626]">{needingAttention}</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Needing Attention</div>
            <span className="text-xs text-[#DC2626] font-medium mt-1 block">Failed or sync retry needed</span>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-extrabold text-[#2563EB]">{scheduledAppointments}</div>
            <div className="text-sm font-semibold text-[#2B1B14] mt-1">Scheduled Appointments</div>
            <span className="text-xs text-[#6E5D53] mt-1 block">Physical verification slots</span>
          </div>
        </section>

        {/* Overview Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 mb-10">
          <div>
            <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Today's Tasks</h2>
            {loading ? (
              <div className="p-6 bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl text-xs text-[#6E5D53]">
                Loading tasks...
              </div>
            ) : tasksAwaitingReview.length === 0 ? (
              <div className="p-6 bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl text-xs text-[#6E5D53]">
                No applications currently awaiting registrar review.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {tasksAwaitingReview.map((app) => (
                  <div
                    key={app.id}
                    className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-0.5 rounded text-[0.68rem] font-extrabold bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#B45309]">
                        UNDER VERIFICATION
                      </span>
                      <span className="text-xs text-[#6E5D53]">{app.submittedAt}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#2B1B14] mb-1">
                      {app.id} · Parcel {app.propertyId}
                    </h4>
                    <p className="text-xs text-[#6E5D53] mb-4">
                      Seller: {app.sellerName} &rarr; Buyer: {app.buyerName} | Type: Sale Deed
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/authority/applications/${app.id}`)}
                        className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all"
                      >
                        Review Application
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Operations & Direct Navigation */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Operational Summary</h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex justify-between py-2 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Total Applications:</span>
                  <span className="font-bold text-[#2B1B14]">{applications.length}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Pending Review:</span>
                  <span className="font-bold text-[#B45309]">{pendingReviews}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Scheduled Appointments:</span>
                  <span className="font-bold text-[#2563EB]">{scheduledAppointments}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-[#6E5D53]">Finalized Mutations:</span>
                  <span className="font-bold text-[#047857]">{completedThisMonth}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Direct Navigation</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate('/authority/applications')}
                  className="w-full text-left p-2.5 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] hover:bg-[#D3CCC8]/40 text-xs font-semibold text-[#2B1B14] flex justify-between items-center transition-all"
                >
                  <span>Application Queue</span>
                  <span>&rarr;</span>
                </button>
                <button
                  onClick={() => navigate('/authority/ekyc')}
                  className="w-full text-left p-2.5 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] hover:bg-[#D3CCC8]/40 text-xs font-semibold text-[#2B1B14] flex justify-between items-center transition-all"
                >
                  <span>KYC Status Table</span>
                  <span>&rarr;</span>
                </button>
                <button
                  onClick={() => navigate('/authority/registry')}
                  className="w-full text-left p-2.5 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] hover:bg-[#D3CCC8]/40 text-xs font-semibold text-[#2B1B14] flex justify-between items-center transition-all"
                >
                  <span>Blockchain Transactions</span>
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
