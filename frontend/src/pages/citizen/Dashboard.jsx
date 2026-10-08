import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../services/propertyService';
import applicationService from '../../services/applicationService';
import documentService from '../../services/documentService';
import Toast from '../../components/Toast';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      if (user?.id) {
        try {
          const [props, apps] = await Promise.all([
            propertyService.getUserProperties(user.id),
            applicationService.getUserApplications(user.id),
          ]);
          setProperties(props);
          setApplications(apps);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadDashboardData();
  }, [user]);

  // Derived stats
  const totalProperties = properties.length;
  const activeProperties = properties.filter((p) => p.status === 'Active').length;
  const transfersInProgress = applications.filter(
    (a) => !['COMPLETED', 'REJECTED', 'FAILED'].includes(a.applicationStatus)
  ).length;
  const upcomingAppointments = applications.filter((a) => a.appointment).length;

  // Recent activity derived from applications
  const recentActivities = applications.slice(0, 4).map((app) => ({
    id: app.id,
    title: `Transfer Application ${app.id}`,
    description: `Parcel ${app.propertyId} · Status: ${app.applicationStatus}`,
    time: app.completedAt || app.approvedAt || app.submittedAt || 'Recently',
    appId: app.id,
  }));

  const handleDownload = async (appId) => {
    const res = await documentService.downloadERegistry(appId);
    if (res?.isMockNotice) {
      setToastMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {toastMessage && (
          <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />
        )}

        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Welcome back, {user?.name || 'Rajesh Kumar Singh'}
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Manage your land records and transfer applications
            </p>
          </div>

          <div className="flex items-center gap-3 p-2 px-3 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B1B14] to-[#6E5D53] text-[#F8F2F0] font-bold text-xs flex items-center justify-center">
              {user?.avatar || 'RS'}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#2B1B14]">{user?.name}</span>
              <span className="text-[0.68rem] text-[#6E5D53]">Citizen</span>
            </div>
          </div>
        </header>

        {/* Quick Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#2B1B14]">{totalProperties}</div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Total Properties</div>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#047857]">{activeProperties}</div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Active Properties</div>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#B45309]">{transfersInProgress}</div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Transfers In Progress</div>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#2563EB]">{upcomingAppointments}</div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Upcoming Appointments</div>
          </div>
        </section>

        {/* Quick Actions (4 Cards) */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              onClick={() => navigate('/citizen/new-transfer')}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#2B1B14] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-[#2B1B14] mb-2">New Transfer</h3>
                <p className="text-xs text-[#6E5D53] leading-relaxed">
                  Start a new land transfer mutation request
                </p>
              </div>
              <button className="mt-6 w-full py-2 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-xs shadow hover:bg-[#3D281F] transition-all">
                Initiate Now
              </button>
            </div>

            <div
              onClick={() => navigate('/citizen/verify-land')}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#2B1B14] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-[#2B1B14] mb-2">Verify Land</h3>
                <p className="text-xs text-[#6E5D53] leading-relaxed">
                  Verify title and synchronized records using Khasra
                </p>
              </div>
              <button className="mt-6 w-full py-2 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-xs shadow hover:bg-[#3D281F] transition-all">
                Verify Now
              </button>
            </div>

            <div
              onClick={() => navigate('/citizen/book-appointment')}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#2B1B14] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-[#2B1B14] mb-2">Book Appointment</h3>
                <p className="text-xs text-[#6E5D53] leading-relaxed">
                  Schedule physical Sub-Registrar Office slot
                </p>
              </div>
              <button className="mt-6 w-full py-2 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-xs shadow hover:bg-[#3D281F] transition-all">
                Book Slot
              </button>
            </div>

            <div
              onClick={() => navigate('/citizen/download-registry')}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#2B1B14] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-bold text-[#2B1B14] mb-2">Download E-Registry</h3>
                <p className="text-xs text-[#6E5D53] leading-relaxed">
                  View and download finalized digital certificates
                </p>
              </div>
              <button className="mt-6 w-full py-2 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-xs shadow hover:bg-[#3D281F] transition-all">
                Download
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity (Derived from user applications) */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            {recentActivities.length === 0 ? (
              <div className="p-6 bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl text-xs text-[#6E5D53]">
                No recent transfer activity recorded.
              </div>
            ) : (
              recentActivities.map((act) => (
                <div
                  key={act.id}
                  className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <h4 className="font-bold text-[#2B1B14] text-sm">{act.title}</h4>
                    <p className="text-xs text-[#6E5D53] mt-0.5">{act.description}</p>
                    <span className="text-[0.68rem] text-[#7A6B63] block mt-1">{act.time}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/citizen/applications/${act.appId}`)}
                    className="py-1.5 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* My Properties Table */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-[#2B1B14]">My Properties</h2>
            <button
              onClick={() => navigate('/citizen/properties')}
              className="text-xs font-bold text-[#2B1B14] hover:underline"
            >
              View All Properties &rarr;
            </button>
          </div>

          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                  <th className="p-4 font-semibold">Khasra No.</th>
                  <th className="p-4 font-semibold">Property ID</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Area (sq. ft)</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-xs text-[#6E5D53]">
                      Loading parcels...
                    </td>
                  </tr>
                ) : (
                  properties.map((prop) => {
                    const completedApp = applications.find(
                      (a) => a.propertyId === prop.propertyId && a.hasERegistry
                    );

                    return (
                      <tr key={prop.propertyId} className="hover:bg-[#D3CCC8]/20 transition-colors">
                        <td className="p-4 font-bold text-[#2B1B14]">{prop.khasraNumber}</td>
                        <td className="p-4 font-mono text-[#6E5D53]">{prop.propertyId}</td>
                        <td className="p-4 text-[#6E5D53]">
                          Village {prop.village}, Tehsil {prop.tehsil}
                        </td>
                        <td className="p-4 font-mono">{prop.areaSqFt.toLocaleString()}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                              prop.status === 'Active'
                                ? 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30'
                                : 'bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30'
                            }`}
                          >
                            {prop.status}
                          </span>
                        </td>
                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() => navigate('/citizen/properties')}
                            className="px-3 py-1 bg-transparent border border-[#D3CCC8] rounded text-xs hover:border-[#2B1B14] transition-colors"
                          >
                            View
                          </button>
                          {completedApp ? (
                            <button
                              onClick={() => handleDownload(completedApp.id)}
                              className="px-3 py-1 bg-[#2B1B14] text-[#F8F2F0] rounded text-xs hover:bg-[#3D281F] transition-colors"
                            >
                              Download
                            </button>
                          ) : (
                            <button
                              disabled
                              title="No finalized E-Registry available for this property"
                              className="px-3 py-1 bg-[#D3CCC8]/30 border border-[#D3CCC8]/30 text-[#7A6B63]/60 rounded text-xs cursor-not-allowed"
                            >
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
