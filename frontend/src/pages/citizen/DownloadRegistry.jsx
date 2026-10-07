import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';

export default function CitizenDownloadRegistry() {
  const [searchKhasra, setSearchKhasra] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const [documents, setDocuments] = useState([
    {
      id: 'REG/2020/5678',
      khasra: '123/1',
      location: 'Village Rampur, Tehsil Sadar',
      owner: 'Rajesh Kumar Singh',
      area: '2,500 sq. ft',
      date: '15-Mar-2020',
      status: 'Verified',
    },
    {
      id: 'REG/2019/3456',
      khasra: '456/2',
      location: 'Village Shyampur, Tehsil North',
      owner: 'Priya Sharma',
      area: '1,800 sq. ft',
      date: '22-Jul-2019',
      status: 'Verified',
    },
  ]);

  const handleDownload = (khasra) => {
    alert(`Downloading digital signed land registry certificate for Khasra ${khasra}...`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchKhasra) return;
    alert(`Searching for registry documents with Khasra No. ${searchKhasra}...`);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Download E-Registry
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Access your digital land registry documents
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
            <div className="relative p-2 sm:p-2.5 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] cursor-pointer hover:border-[#2B1B14] transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full">
                3
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 px-3 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8]">
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

        {/* Search Section */}
        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 shadow-sm mb-10">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-1">Search Registry Documents</h2>
          <p className="text-sm text-[#6E5D53] mb-6">
            Enter Khasra number to find and download your registry documents
          </p>

          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-[1.5fr_1.5fr_1fr] gap-4 items-end">
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
                required
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
                <option value="">Select District</option>
                <option value="lucknow">Lucknow</option>
                <option value="kanpur">Kanpur</option>
              </select>
            </div>

            <button
              type="submit"
              className="py-3 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#2B1B14]/90 transition-all"
            >
              Search
            </button>
          </form>
        </section>

        {/* Available Documents */}
        <section>
          <h2 className="text-xl font-bold text-[#2B1B14] mb-6">Available Registry Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl">📄</span>
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                      {doc.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2B1B14] mb-3">
                    Land Registry Certificate
                  </h3>
                  <div className="flex flex-col gap-1.5 text-xs text-[#6E5D53]">
                    <p><strong className="text-[#2B1B14]">Khasra No:</strong> {doc.khasra}</p>
                    <p><strong className="text-[#2B1B14]">Location:</strong> {doc.location}</p>
                    <p><strong className="text-[#2B1B14]">Owner:</strong> {doc.owner}</p>
                    <p><strong className="text-[#2B1B14]">Area:</strong> {doc.area}</p>
                    <p><strong className="text-[#2B1B14]">Registry Date:</strong> {doc.date}</p>
                    <p><strong className="text-[#2B1B14]">Document ID:</strong> {doc.id}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#D3CCC8]">
                  <button
                    onClick={() => handleDownload(doc.khasra)}
                    className="flex-1 py-2 px-3 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="py-2 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => alert(`Share link for Document ${doc.id} copied to clipboard!`)}
                    className="py-2 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg"
                  >
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Document Preview Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title="Registry Document Preview"
          footer={
            <button
              onClick={() => {
                handleDownload(previewDoc.khasra);
                setPreviewDoc(null);
              }}
              className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg hover:bg-[#2B1B14]/90"
            >
              Download PDF
            </button>
          }
        >
          <div className="p-4 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8] flex flex-col gap-3 font-mono text-xs text-[#2B1B14]">
            <div className="text-center pb-2 border-b border-[#D3CCC8] font-sans">
              <h4 className="font-bold text-sm text-[#2B1B14]">GOVERNMENT OF INDIA</h4>
              <p className="text-[0.7rem] text-[#6E5D53]">DIGITAL LAND REGISTRY CERTIFICATE</p>
            </div>
            <div><strong>DOCUMENT ID:</strong> {previewDoc.id}</div>
            <div><strong>KHASRA NUMBER:</strong> {previewDoc.khasra}</div>
            <div><strong>PROPERTY OWNER:</strong> {previewDoc.owner}</div>
            <div><strong>LOCATION:</strong> {previewDoc.location}</div>
            <div><strong>SURFACE AREA:</strong> {previewDoc.area}</div>
            <div><strong>DATE OF REGISTRY:</strong> {previewDoc.date}</div>
            <div><strong>BLOCKCHAIN STATE:</strong> IMMUTABLE & VERIFIED (#10484)</div>
          </div>
        </Modal>
      )}
    </div>
  );
}
