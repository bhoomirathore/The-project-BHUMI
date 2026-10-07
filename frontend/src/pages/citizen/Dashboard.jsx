import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Registry Appointment Reminder',
      message: 'Your appointment is scheduled for tomorrow at 10:00 AM',
      time: '5 min ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Verification Complete',
      message: 'Land verification for Khasra 456/2 has been completed',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 3,
      title: 'System Update',
      message: 'New features added to citizen portal',
      time: '1 day ago',
      unread: false,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleDownload = (khasra) => {
    alert(`Downloading E-Registry for Khasra No. ${khasra}`);
    setTimeout(() => {
      alert('Download started!');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Welcome back, Rajesh Kumar
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">Manage your land records with ease</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
            <div
              className="relative p-2 sm:p-2.5 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] cursor-pointer hover:border-[#2B1B14] transition-colors"
              onClick={() => alert('Notifications panel')}
              title="Notifications"
            >
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
                3
              </span>
            </div>
            <div
              className="flex items-center gap-3 p-2 px-3 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] cursor-pointer hover:border-[#2B1B14] transition-colors"
              onClick={() => alert('Profile menu')}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2B1B14] to-[#6E5D53] text-[#F8F2F0] font-bold text-xs flex items-center justify-center">
                RK
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-[#2B1B14]">Rajesh Kumar</span>
                <span className="text-[0.68rem] text-[#6E5D53]">Citizen</span>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#2B1B14]">
              3
            </div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Total Properties</div>
          </div>
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#2B1B14]">
              2
            </div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Verified Records</div>
          </div>
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#2B1B14]">
              1
            </div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Pending Process</div>
          </div>
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl font-extrabold text-[#2B1B14]">
              1
            </div>
            <div className="text-sm font-medium text-[#6E5D53] mt-1">Upcoming Appointment</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => navigate('/citizen/verify-land')}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#2B1B14] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-[#2B1B14] mb-2">Verify Land Ownership</h3>
                <p className="text-sm text-[#6E5D53] leading-relaxed">
                  Check ownership details using Khasra number
                </p>
              </div>
              <button className="mt-6 w-full py-2.5 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-sm shadow hover:shadow-md transition-all">
                Verify Now
              </button>
            </div>

            <div
              onClick={() => navigate('/citizen/book-appointment')}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#2B1B14] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-[#2B1B14] mb-2">Book Registry Appointment</h3>
                <p className="text-sm text-[#6E5D53] leading-relaxed">
                  Schedule your visit to registrar office
                </p>
              </div>
              <button className="mt-6 w-full py-2.5 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-sm shadow hover:shadow-md transition-all">
                Book Slot
              </button>
            </div>

            <div
              onClick={() => navigate('/citizen/download-registry')}
              className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:border-[#2B1B14] cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-[#2B1B14] mb-2">Download E-Registry</h3>
                <p className="text-sm text-[#6E5D53] leading-relaxed">
                  Get digital copy of your land registry
                </p>
              </div>
              <button className="mt-6 w-full py-2.5 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-sm shadow hover:shadow-md transition-all">
                Download
              </button>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Recent Activity</h2>
          <div className="flex flex-col gap-4">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-[#2B1B14] text-base">Land Verification Completed</h4>
                <p className="text-sm text-[#6E5D53]">Khasra No. 456/2 - Verified Successfully</p>
                <span className="text-xs text-[#7A6B63]">2 hours ago</span>
              </div>
              <button
                onClick={() => alert('Viewing details for: Land Verification Completed')}
                className="py-1.5 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-[#2B1B14] text-base">Appointment Scheduled</h4>
                <p className="text-sm text-[#6E5D53]">Registry appointment on 15th Jan 2024, 10:00 AM</p>
                <span className="text-xs text-[#7A6B63]">1 day ago</span>
              </div>
              <button
                onClick={() => alert('Viewing details for: Appointment Scheduled')}
                className="py-1.5 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-bold text-[#2B1B14] text-base">E-Registry Downloaded</h4>
                <p className="text-sm text-[#6E5D53]">Khasra No. 123/1 - PDF downloaded</p>
                <span className="text-xs text-[#7A6B63]">3 days ago</span>
              </div>
              <button
                onClick={() => alert('Viewing details for: E-Registry Downloaded')}
                className="py-1.5 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </section>

        {/* My Properties Table */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">My Properties</h2>
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                  <th className="p-4 font-semibold">Khasra No.</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Area (sq. ft)</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                <tr>
                  <td className="p-4 font-bold text-[#2B1B14]">123/1</td>
                  <td className="p-4">Village Rampur, Tehsil Sadar</td>
                  <td className="p-4">2,500</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                      Verified
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => alert('Viewing details for Khasra No. 123/1')}
                      className="px-3 py-1 bg-transparent border border-[#D3CCC8] rounded text-xs hover:border-[#2B1B14] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownload('123/1')}
                      className="px-3 py-1 bg-[#D3CCC8] border border-[#D3CCC8] rounded text-xs hover:bg-[#D3CCC8]/70 transition-colors"
                    >
                      Download
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#2B1B14]">456/2</td>
                  <td className="p-4">Village Shyampur, Tehsil North</td>
                  <td className="p-4">1,800</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                      Verified
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => alert('Viewing details for Khasra No. 456/2')}
                      className="px-3 py-1 bg-transparent border border-[#D3CCC8] rounded text-xs hover:border-[#2B1B14] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDownload('456/2')}
                      className="px-3 py-1 bg-[#D3CCC8] border border-[#D3CCC8] rounded text-xs hover:bg-[#D3CCC8]/70 transition-colors"
                    >
                      Download
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-[#2B1B14]">789/3</td>
                  <td className="p-4">Village Greenfield, Tehsil East</td>
                  <td className="p-4">3,200</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30">
                      Pending
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => alert('Viewing details for Khasra No. 789/3')}
                      className="px-3 py-1 bg-transparent border border-[#D3CCC8] rounded text-xs hover:border-[#2B1B14] transition-colors"
                    >
                      View
                    </button>
                    <button
                      disabled
                      className="px-3 py-1 bg-[#D3CCC8]/30 border border-[#D3CCC8]/30 text-[#7A6B63]/60 rounded text-xs cursor-not-allowed"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Notifications Panel */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Notifications</h2>
          <div className="flex flex-col gap-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start gap-3 ${
                  item.unread
                    ? 'bg-[#D3CCC8]/50 border-[#D3CCC8]'
                    : 'bg-[#F8F2F0]/60 border-[#D3CCC8]/50'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    item.unread ? 'bg-[#2B1B14]' : 'bg-[#7A6B63]'
                  }`}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#2B1B14]">{item.title}</h4>
                  <p className="text-xs text-[#6E5D53] mt-0.5">{item.message}</p>
                  <span className="text-[0.68rem] text-[#7A6B63] mt-1 block">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => alert('Redirecting to all notifications page...')}
            className="mt-5 w-full py-2.5 bg-transparent border border-[#D3CCC8] text-[#2B1B14] text-xs font-bold rounded-lg hover:border-[#2B1B14] transition-colors"
          >
            View All Notifications
          </button>
        </section>
      </main>
    </div>
  );
}
