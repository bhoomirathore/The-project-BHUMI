import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../services/propertyService';

export default function CitizenProperties() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      try {
        if (user?.id) {
          const list = await propertyService.getUserProperties(user.id);
          setProperties(list);
        }
      } catch (err) {
        console.error('Failed to load properties', err);
      } finally {
        setLoading(false);
      }
    }
    loadProperties();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              My Properties
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Registered land parcels under your ownership record
            </p>
          </div>
          <button
            onClick={() => navigate('/citizen/new-transfer')}
            className="py-2.5 px-5 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all"
          >
            + New Transfer Application
          </button>
        </header>

        {/* Properties Table Card */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#D3CCC8] flex justify-between items-center bg-[#F8F2F0]/50">
            <h2 className="text-base sm:text-lg font-bold text-[#2B1B14]">
              Ownership Portfolio ({properties.length})
            </h2>
            <span className="text-xs text-[#6E5D53]">All parcels synchronized with ledger</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">
              No properties found registered under your account.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                    <th className="p-4 font-semibold">Property ID (ULPIN)</th>
                    <th className="p-4 font-semibold">Khasra No.</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Area (sq. ft)</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D3CCC8] text-[#2B1B14]">
                  {properties.map((prop) => {
                    const isTransferOpen = prop.status === 'Transfer in progress';
                    return (
                      <tr key={prop.propertyId} className="hover:bg-[#D3CCC8]/20 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#2B1B14]">
                          {prop.propertyId}
                        </td>
                        <td className="p-4 font-bold text-[#2B1B14]">{prop.khasraNumber}</td>
                        <td className="p-4 text-[#6E5D53]">
                          Village {prop.village}, Tehsil {prop.tehsil}, {prop.district}
                        </td>
                        <td className="p-4 font-mono">{prop.areaSqFt.toLocaleString()}</td>
                        <td className="p-4 text-[#6E5D53]">{prop.landType}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                              isTransferOpen
                                ? 'bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30'
                                : 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30'
                            }`}
                          >
                            {prop.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {isTransferOpen ? (
                            <button
                              onClick={() => navigate('/citizen/applications')}
                              className="py-1.5 px-3 bg-[#F8F2F0] border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
                            >
                              View Transfer &rarr;
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                navigate(`/citizen/new-transfer?propertyId=${prop.propertyId}`)
                              }
                              className="py-1.5 px-3 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all"
                            >
                              Initiate Transfer
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
