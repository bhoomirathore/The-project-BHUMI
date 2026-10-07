import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';

export default function AuthorityVerification() {
  const navigate = useNavigate();
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComments, setRejectComments] = useState('');

  const [checklist, setChecklist] = useState({
    identity: true,
    records: true,
    encumbrance: true,
    stampDuty: true,
  });

  const handleToggleCheck = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApprove = () => {
    alert('Application #2024-0234 Approved Successfully! Redirecting to eKYC...');
    navigate('/authority/ekyc');
  };

  const handleRejectSubmit = () => {
    if (!rejectReason) {
      alert('Please select a rejection reason');
      return;
    }
    alert(`Application Rejected: ${rejectReason}`);
    setRejectModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            Document Verification
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">Verify and approve land documents</p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Left Column: Application Details */}
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#2B1B14]">Application #2024-0234</h3>
                <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626]">
                  URGENT
                </span>
              </div>

              <div className="flex flex-col gap-3 text-xs border-b border-[#D3CCC8] pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Applicant Name:</span>
                  <span className="font-bold text-[#2B1B14]">Suresh Kumar Singh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Father's Name:</span>
                  <span className="text-[#2B1B14]">Ram Kumar Singh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Khasra Number:</span>
                  <span className="font-bold text-[#2B1B14]">234/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Village:</span>
                  <span className="text-[#2B1B14]">Rampur, Tehsil Sadar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Registry Type:</span>
                  <span className="text-[#2B1B14]">Sale Deed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Land Area:</span>
                  <span className="text-[#2B1B14]">2,500 sq. ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Submitted On:</span>
                  <span className="text-[#2B1B14]">15-Jan-2024, 10:30 AM</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#2B1B14] mb-3">Parties Involved</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg">
                    <strong className="text-[#2B1B14] block mb-1">Seller:</strong>
                    <p className="text-[#6E5D53]">Ram Kumar Singh</p>
                    <p className="text-[#7A6B63]">Contact: +91 98765 43210</p>
                  </div>
                  <div className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg">
                    <strong className="text-[#2B1B14] block mb-1">Buyer:</strong>
                    <p className="text-[#6E5D53]">Suresh Kumar Singh</p>
                    <p className="text-[#7A6B63]">Contact: +91 98765 43211</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D3CCC8] flex flex-wrap gap-3">
              <button
                onClick={handleApprove}
                className="flex-1 py-3 px-4 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-lg shadow transition-colors"
              >
                Approve Application
              </button>
              <button
                onClick={() => setRejectModalOpen(true)}
                className="py-3 px-4 bg-transparent border border-[#DC2626]/40 text-[#DC2626] hover:bg-[#DC2626]/10 font-semibold text-xs rounded-lg transition-colors"
              >
                Reject Application
              </button>
              <button
                onClick={() => alert('Request for additional documents sent to applicant')}
                className="py-3 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
              >
                Request Docs
              </button>
            </div>
          </div>

          {/* Right Column: Submitted Documents & Audit Checklist */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Submitted Documents</h3>
              <div className="flex flex-col gap-3">
                {[
                  'Sale Deed Agreement.pdf',
                  'Identity Proof - Aadhaar.pdf',
                  'Land Map & Boundaries.pdf',
                  'Non-Encumbrance Certificate.pdf',
                  'Tax Clearance Receipt.pdf',
                ].map((docName, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span>📄</span>
                      <span className="font-medium text-[#2B1B14]">{docName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#047857] text-[0.7rem] font-bold">Verified</span>
                      <button
                        onClick={() => alert(`Opening preview for ${docName}`)}
                        className="py-1 px-2.5 bg-transparent border border-[#D3CCC8] rounded text-[0.68rem] text-[#6E5D53] hover:text-[#2B1B14]"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Verification Checklist</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checklist.identity}
                    onChange={() => handleToggleCheck('identity')}
                    className="w-4 h-4 accent-[#047857]"
                  />
                  <span className="text-[#2B1B14]">Identity verified with Aadhaar</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checklist.records}
                    onChange={() => handleToggleCheck('records')}
                    className="w-4 h-4 accent-[#047857]"
                  />
                  <span className="text-[#2B1B14]">Land records matched with revenue registry</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checklist.encumbrance}
                    onChange={() => handleToggleCheck('encumbrance')}
                    className="w-4 h-4 accent-[#047857]"
                  />
                  <span className="text-[#2B1B14]">No encumbrances or ongoing disputes</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={checklist.stampDuty}
                    onChange={() => handleToggleCheck('stampDuty')}
                    className="w-4 h-4 accent-[#047857]"
                  />
                  <span className="text-[#2B1B14]">Stamp duty payment verified & cleared</span>
                </label>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Document"
        footer={
          <>
            <button
              onClick={() => setRejectModalOpen(false)}
              className="py-2 px-4 bg-transparent border border-[#D3CCC8] text-[#2B1B14] rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              className="py-2 px-4 bg-[#DC2626] text-white font-bold rounded-lg text-xs"
            >
              Confirm Rejection
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg text-[#DC2626]">
            <strong>This action will notify the applicant.</strong>
            <p className="mt-1">Please provide a clear rejection reason below.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#2B1B14]">Rejection Reason *</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14]"
            >
              <option value="">Select a reason...</option>
              <option value="Incomplete documents submitted">Incomplete documents submitted</option>
              <option value="Aadhaar verification failed">Aadhaar verification failed</option>
              <option value="Mismatched land records">Mismatched land records</option>
              <option value="Encumbrance certificate missing">Encumbrance certificate missing</option>
              <option value="Forged document suspected">Forged document suspected</option>
              <option value="Stamp duty underpaid">Stamp duty underpaid</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#2B1B14]">Additional Comments</label>
            <textarea
              rows={3}
              value={rejectComments}
              onChange={(e) => setRejectComments(e.target.value)}
              placeholder="Provide specific details for the applicant..."
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
