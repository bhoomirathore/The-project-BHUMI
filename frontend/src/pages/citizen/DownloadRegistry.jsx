import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import Toast from '../../components/Toast';
import { useAuth } from '../../hooks/useAuth';
import applicationService from '../../services/applicationService';
import propertyService from '../../services/propertyService';
import documentService from '../../services/documentService';

export default function CitizenDownloadRegistry() {
  const { user } = useAuth();
  const [searchKhasra, setSearchKhasra] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [completedApps, setCompletedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadCompletedTransfers() {
      if (user?.id) {
        try {
          const [apps, props] = await Promise.all([
            applicationService.getUserApplications(user.id),
            propertyService.getUserProperties(user.id),
          ]);

          const completed = apps
            .filter((a) => a.applicationStatus === 'COMPLETED' || a.hasERegistry)
            .map((a) => {
              const prop = props.find((p) => p.propertyId === a.propertyId);
              return {
                id: a.registryNumber || `REG/2026/${a.id}`,
                transferId: a.id,
                propertyId: a.propertyId,
                khasra: prop?.khasraNumber || '123/1',
                district: prop?.district || 'Lucknow',
                location: `Village ${prop?.village || 'Rampur'}, Tehsil ${prop?.tehsil || 'Lucknow Sadar'}`,
                owner: a.buyerName || user.name,
                area: prop ? `${prop.areaSqFt.toLocaleString()} sq. ft` : '2,500 sq. ft',
                date: a.completedAt || a.approvedAt || '15-Jan-2026',
                txHash: a.txHash,
                status: 'Finalized and synchronized',
              };
            });

          setCompletedApps(completed);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadCompletedTransfers();
  }, [user]);

  const handleDownload = async (transferId) => {
    try {
      const res = await documentService.downloadERegistry(transferId);
      if (res?.isMockNotice) {
        setToastMessage(res.message);
      }
    } catch (err) {
      setToastMessage(err.message || 'Failed to download E-Registry.');
    }
  };

  const filteredDocs = completedApps.filter((doc) => {
    const matchKhasra =
      !searchKhasra.trim() ||
      doc.khasra.toLowerCase().includes(searchKhasra.trim().toLowerCase());
    const matchDistrict =
      !searchDistrict ||
      doc.district.toLowerCase() === searchDistrict.toLowerCase();
    return matchKhasra && matchDistrict;
  });

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {toastMessage && (
          <Toast message={toastMessage} type="info" onClose={() => setToastMessage('')} />
        )}

        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            Download E-Registry
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Access and download finalized digital certificates for completed land transfers
          </p>
        </header>

        {/* Filter / Search Section */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-1">Search Registry Documents</h2>
          <p className="text-sm text-[#6E5D53] mb-6">
            Filter certificates by Khasra number or District
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_1.5fr_1fr] gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="searchKhasra" className="text-xs font-medium text-[#2B1B14]">
                Khasra Number
              </label>
              <input
                type="text"
                id="searchKhasra"
                value={searchKhasra}
                onChange={(e) => setSearchKhasra(e.target.value)}
                placeholder="e.g., 123/1"
                className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="searchDistrict" className="text-xs font-medium text-[#2B1B14]">
                District
              </label>
              <select
                id="searchDistrict"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
              >
                <option value="">All Districts</option>
                <option value="Lucknow">Lucknow</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchKhasra('');
                setSearchDistrict('');
              }}
              className="py-3 px-6 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] font-bold text-sm rounded-lg transition-all"
            >
              Clear Filter
            </button>
          </div>
        </section>

        {/* Available Documents */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#2B1B14]">
              Available Registry Certificates ({filteredDocs.length})
            </h2>
            <span className="text-xs text-[#6E5D53]">
              Only completed and blockchain-synchronized transfers
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[#6E5D53]">
              Loading certificates...
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-8 bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl text-center text-xs text-[#6E5D53]">
              No finalized E-Registry certificates found matching your criteria. Only fully completed transfers appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl">📄</span>
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                        Finalized &amp; Synchronized
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#2B1B14] mb-3">
                      Digital E-Registry Certificate
                    </h3>
                    <div className="flex flex-col gap-1.5 text-xs text-[#6E5D53]">
                      <p>
                        <strong className="text-[#2B1B14]">Registry Number:</strong> {doc.id}
                      </p>
                      <p>
                        <strong className="text-[#2B1B14]">Transfer ID:</strong> {doc.transferId}
                      </p>
                      <p>
                        <strong className="text-[#2B1B14]">Property ID:</strong> {doc.propertyId}
                      </p>
                      <p>
                        <strong className="text-[#2B1B14]">Khasra No:</strong> {doc.khasra}
                      </p>
                      <p>
                        <strong className="text-[#2B1B14]">Location:</strong> {doc.location}
                      </p>
                      <p>
                        <strong className="text-[#2B1B14]">Surface Area:</strong> {doc.area}
                      </p>
                      <p>
                        <strong className="text-[#2B1B14]">Finalized Date:</strong> {doc.date}
                      </p>
                      <p>
                        <strong className="text-[#2B1B14]">Transaction Hash:</strong>{' '}
                        <span className="font-mono">{truncateHash(doc.txHash)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#D3CCC8]">
                    <button
                      onClick={() => handleDownload(doc.transferId)}
                      className="flex-1 py-2 px-3 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all"
                    >
                      Download PDF
                    </button>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="py-2 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
                    >
                      Preview Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title="Digital E-Registry Certificate Preview"
          footer={
            <button
              onClick={() => {
                handleDownload(previewDoc.transferId);
                setPreviewDoc(null);
              }}
              className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg hover:bg-[#3D281F]"
            >
              Download PDF
            </button>
          }
        >
          <div className="p-4 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8] flex flex-col gap-3 font-mono text-xs text-[#2B1B14]">
            <div className="text-center pb-2 border-b border-[#D3CCC8] font-sans">
              <h4 className="font-bold text-sm text-[#2B1B14]">B.H.U.M.I. (PROTOTYPE)</h4>
              <p className="text-[0.7rem] text-[#6E5D53]">DIGITAL LAND REGISTRY CERTIFICATE</p>
            </div>
            <div>
              <strong>REGISTRY NUMBER:</strong> {previewDoc.id}
            </div>
            <div>
              <strong>TRANSFER REF:</strong> {previewDoc.transferId}
            </div>
            <div>
              <strong>PARCEL ULPIN:</strong> {previewDoc.propertyId}
            </div>
            <div>
              <strong>KHASRA NUMBER:</strong> {previewDoc.khasra}
            </div>
            <div>
              <strong>TITLE HOLDER:</strong> {previewDoc.owner}
            </div>
            <div>
              <strong>LOCATION:</strong> {previewDoc.location}
            </div>
            <div>
              <strong>SURFACE AREA:</strong> {previewDoc.area}
            </div>
            <div>
              <strong>DATE FINALIZED:</strong> {previewDoc.date}
            </div>
            <div>
              <strong>LEDGER EVENT:</strong> Finalized and synchronized (Tx: {truncateHash(previewDoc.txHash)})
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
