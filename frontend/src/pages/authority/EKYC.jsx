import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import TransactionStatusPill from '../../components/TransactionStatusPill';
import applicationService from '../../services/applicationService';

export default function AuthorityEKYC() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const apps = await applicationService.getAllApplications();
        setApplications(apps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            KYC Status Overview
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Read-only audit record of applicant and counterparty Aadhaar identity verification across transfer filings
          </p>
        </header>

        {/* Informational Banner */}
        <div className="mb-6 p-4 rounded-xl bg-[#E6DEDA] border border-[#D3CCC8] text-xs text-[#6E5D53] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-base">🛡️</span>
            <div>
              <strong className="text-[#2B1B14] block sm:inline mr-1">Statutory Verification Notice:</strong>
              e-KYC authentication is initiated and authenticated directly by citizens via simulated UIDAI identity gateway. Registrars perform visual matching and attestation during review.
            </div>
          </div>
          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#047857]/15 text-[#047857] border border-[#047857]/30">
            SECURE AUDIT LOG
          </span>
        </div>

        {/* KYC Records Table */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-[#D3CCC8] flex justify-between items-center bg-[#F8F2F0]/50">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#2B1B14]">
                Filing KYC Records ({applications.length})
              </h2>
              <p className="text-xs text-[#6E5D53]">
                Identity authentication statuses for sellers and buyers per application
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">Loading KYC records...</div>
          ) : applications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">
              No application records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#D3CCC8] bg-[#D3CCC8]/30 text-[#6E5D53]">
                    <th className="p-4 font-semibold">Application ID</th>
                    <th className="p-4 font-semibold">Parcel ULPIN</th>
                    <th className="p-4 font-semibold">Seller Identity</th>
                    <th className="p-4 font-semibold">Buyer Identity</th>
                    <th className="p-4 font-semibold">Filing Status</th>
                    <th className="p-4 font-semibold text-right">Action</th>
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
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-semibold text-[#2B1B14]">{app.sellerName}</span>
                          <TransactionStatusPill status="VERIFIED" type="kyc" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-semibold text-[#2B1B14]">{app.buyerName}</span>
                          <TransactionStatusPill status={app.kycStatus || 'PENDING'} type="kyc" />
                        </div>
                      </td>
                      <td className="p-4">
                        <TransactionStatusPill status={app.applicationStatus} type="application" />
                      </td>
                      <td className="p-4 text-right">
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
