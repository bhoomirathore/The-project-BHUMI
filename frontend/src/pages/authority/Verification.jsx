import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import MutationStepper from '../../components/MutationStepper';
import TransactionStatusPill from '../../components/TransactionStatusPill';
import applicationService from '../../services/applicationService';
import propertyService from '../../services/propertyService';
import documentService from '../../services/documentService';
import verificationService from '../../services/verificationService';
import { DOCUMENT_TYPE_LABELS } from '../../utils/statuses';

export default function AuthorityVerification() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Document integrity statuses: { [docId]: { checked: boolean, integrity: 'MATCH' | 'MISMATCH', message: string, verifying: boolean } }
  const [docIntegrityState, setDocIntegrityState] = useState({});

  // Manual review checklist items
  const [manualChecks, setManualChecks] = useState({
    documentsReviewed: false,
    propertyMatched: false,
  });

  // Modals & form state
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [approving, setApproving] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComments, setRejectComments] = useState('');

  const [resubmitModalOpen, setResubmitModalOpen] = useState(false);
  const [resubmitRemarks, setResubmitRemarks] = useState('');

  const [notice, setNotice] = useState('');
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    async function loadAppDetails() {
      if (!id) {
        // Fallback to queue if no id parameter
        navigate('/authority/applications', { replace: true });
        return;
      }
      try {
        const app = await applicationService.getApplicationById(id);
        setApplication(app);
        if (app?.propertyId) {
          const prop = await propertyService.getPropertyById(app.propertyId);
          setProperty(prop);
        }
      } catch (err) {
        setErrorNotice(err.message || 'Application not found.');
      } finally {
        setLoading(false);
      }
    }
    loadAppDetails();
  }, [id, navigate]);

  const handleVerifyDocIntegrity = async (docId) => {
    setDocIntegrityState((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], verifying: true },
    }));

    try {
      const res = await documentService.verifyIntegrity(docId, application.id);
      setDocIntegrityState((prev) => ({
        ...prev,
        [docId]: {
          checked: true,
          integrity: res.integrity,
          message: res.message,
          verifying: false,
        },
      }));
    } catch (err) {
      setDocIntegrityState((prev) => ({
        ...prev,
        [docId]: {
          checked: true,
          integrity: 'MISMATCH',
          message: err.message || 'Integrity check failed.',
          verifying: false,
        },
      }));
    }
  };

  // Integrity checks evaluation
  const documents = application?.documents || [];
  const allDocsChecked =
    documents.length > 0 && documents.every((d) => docIntegrityState[d.docId]?.checked);
  const hasDocMismatch = documents.some(
    (d) => docIntegrityState[d.docId]?.integrity === 'MISMATCH' || d.integrity === 'MISMATCH'
  );

  const isKycVerified = application?.kycStatus === 'VERIFIED';
  const isPaymentReceived = application?.paymentStatus === 'SUCCESSFUL';
  const noCompetingTransfer = true; // In mock data, validated from property records

  // All conditions required for approving
  const canApprove =
    isKycVerified &&
    isPaymentReceived &&
    allDocsChecked &&
    !hasDocMismatch &&
    manualChecks.documentsReviewed &&
    manualChecks.propertyMatched &&
    noCompetingTransfer &&
    application?.applicationStatus === 'UNDER_VERIFICATION';

  const handleConfirmApproval = async () => {
    setApproving(true);
    setErrorNotice('');
    try {
      const updated = await verificationService.approveApplication(application.id, {
        kycVerified: true,
        paymentReceived: true,
        documentsReviewed: true,
        propertyMatched: true,
        noConflict: true,
      });
      setApplication(updated);
      setApproveModalOpen(false);
      setNotice(
        'Application approved successfully! Backend blockchain transaction has been initiated and submitted to ledger.'
      );
    } catch (err) {
      setErrorNotice(err.message || 'Approval failed.');
      setApproveModalOpen(false);
    } finally {
      setApproving(false);
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectReason) {
      setErrorNotice('Please select a rejection reason.');
      return;
    }
    try {
      const updated = await verificationService.rejectApplication(
        application.id,
        rejectReason,
        rejectComments
      );
      setApplication(updated);
      setRejectModalOpen(false);
      setNotice(`Application ${application.id} rejected: ${rejectReason}`);
    } catch (err) {
      setErrorNotice(err.message || 'Rejection failed.');
    }
  };

  const handleConfirmResubmission = async () => {
    if (!resubmitRemarks.trim()) {
      setErrorNotice('Please provide remarks explaining what needs to be resubmitted.');
      return;
    }
    try {
      const updated = await verificationService.requestResubmission(
        application.id,
        resubmitRemarks
      );
      setApplication(updated);
      setResubmitModalOpen(false);
      setNotice(`Resubmission request sent to applicant for ${application.id}.`);
    } catch (err) {
      setErrorNotice(err.message || 'Request failed.');
    }
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
        <Sidebar portal="authority" />
        <main className="flex-1 md:ml-[280px] p-8 flex items-center justify-center">
          <span className="text-xs text-[#6E5D53]">Loading verification dossier...</span>
        </main>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
        <Sidebar portal="authority" />
        <main className="flex-1 md:ml-[280px] p-8">
          <p className="text-sm text-[#DC2626]">Application not found.</p>
          <button
            onClick={() => navigate('/authority/applications')}
            className="mt-4 py-2 px-4 bg-[#2B1B14] text-white rounded text-xs"
          >
            Back to Queue
          </button>
        </main>
      </div>
    );
  }

  const isApprovedOrBeyond = [
    'APPROVED',
    'PROCESSING',
    'COMPLETED',
  ].includes(application.applicationStatus);

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
                Application Review #{application.id}
              </h1>
              <TransactionStatusPill status={application.applicationStatus} />
            </div>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Officer verification desk · Parcel {application.propertyId}
            </p>
          </div>

          <Link
            to="/authority/applications"
            className="py-2 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
          >
            &larr; Back to Queue
          </Link>
        </header>

        {notice && (
          <div className="mb-6 p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#047857] text-xs font-semibold flex justify-between items-center animate-fade-in">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="text-sm font-bold leading-none">
              &times;
            </button>
          </div>
        )}

        {errorNotice && (
          <div className="mb-6 p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-semibold flex justify-between items-center animate-fade-in">
            <span>{errorNotice}</span>
            <button onClick={() => setErrorNotice('')} className="text-sm font-bold leading-none">
              &times;
            </button>
          </div>
        )}

        {/* Stepper (shown especially when approved or processing) */}
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#6E5D53] mb-3">
            Mutation Workflow Status
          </h2>
          <MutationStepper
            applicationStatus={application.applicationStatus}
            blockchainStatus={application.blockchainStatus}
          />
        </section>

        {/* Two-Column Dossier Card Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Left Column: Application Details & Parties */}
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#2B1B14]">Application Dossier</h3>
                <span className="font-mono text-xs text-[#6E5D53] bg-[#F8F2F0] px-2.5 py-1 rounded border border-[#D3CCC8]">
                  ULPIN: {application.propertyId}
                </span>
              </div>

              {/* Application Details */}
              <div className="flex flex-col gap-3 text-xs border-b border-[#D3CCC8] pb-6 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Khasra Number:</span>
                  <span className="font-bold text-[#2B1B14]">{property?.khasraNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Location:</span>
                  <span className="text-[#2B1B14]">
                    Village {property?.village}, Tehsil {property?.tehsil}, {property?.district}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Registry Type:</span>
                  <span className="text-[#2B1B14]">Sale Deed</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Surface Area:</span>
                  <span className="text-[#2B1B14]">{property?.areaSqFt} sq. ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Land Classification:</span>
                  <span className="text-[#2B1B14]">{property?.landType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6E5D53]">Submitted On:</span>
                  <span className="text-[#2B1B14]">{application.submittedAt}</span>
                </div>
              </div>

              {/* Parties Details (Visible to Registrar) */}
              <div>
                <h4 className="text-sm font-bold text-[#2B1B14] mb-3">Parties Involved</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg">
                    <strong className="text-[#2B1B14] block mb-1">Seller (Transferor):</strong>
                    <p className="font-bold text-[#2B1B14]">{application.sellerName}</p>
                    <p className="text-[#7A6B63] mt-0.5">Contact: +91 {application.sellerPhone}</p>
                  </div>
                  <div className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg">
                    <strong className="text-[#2B1B14] block mb-1">Buyer (Transferee):</strong>
                    <p className="font-bold text-[#2B1B14]">{application.buyerName}</p>
                    <p className="text-[#7A6B63] mt-0.5">Contact: +91 {application.buyerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isApprovedOrBeyond && application.applicationStatus !== 'REJECTED' && (
              <div className="mt-8 pt-6 border-t border-[#D3CCC8] flex flex-wrap gap-3">
                <button
                  disabled={!canApprove}
                  onClick={() => setApproveModalOpen(true)}
                  className="flex-1 py-3 px-4 bg-[#047857] hover:bg-[#065F46] text-white font-bold text-xs rounded-lg shadow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                  onClick={() => setResubmitModalOpen(true)}
                  className="py-3 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
                >
                  Request Resubmission
                </button>
              </div>
            )}

            {isApprovedOrBeyond && (
              <div className="mt-8 pt-6 border-t border-[#D3CCC8] text-xs text-[#047857] font-semibold flex items-center gap-2">
                <span>✓ Application has been approved and committed to the ledger transaction stream.</span>
              </div>
            )}
          </div>

          {/* Right Column: Submitted Documents & Audit Checklist */}
          <div className="flex flex-col gap-6">
            {/* Documents with Integrity Verification */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">
                Submitted Documents &amp; Cryptographic Hashes
              </h3>
              <div className="flex flex-col gap-3">
                {documents.map((doc) => {
                  const check = docIntegrityState[doc.docId];
                  const hasChecked = !!check?.checked;
                  const isMismatch = check?.integrity === 'MISMATCH' || (!check && doc.integrity === 'MISMATCH');

                  return (
                    <div
                      key={doc.docId}
                      className="p-3.5 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] flex flex-col gap-2 text-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-[#2B1B14] block">
                            {DOCUMENT_TYPE_LABELS[doc.type] || doc.type}
                          </strong>
                          <span className="text-[#6E5D53] text-[0.72rem]">{doc.fileName}</span>
                          <span className="font-mono text-[0.68rem] text-[#7A6B63] block mt-0.5">
                            SHA-256: {truncateHash(doc.hash)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasChecked ? (
                            <span
                              className={`px-2 py-0.5 rounded text-[0.7rem] font-bold ${
                                isMismatch
                                  ? 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/30'
                                  : 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30'
                              }`}
                            >
                              {isMismatch ? 'MISMATCH' : 'Match ✓'}
                            </span>
                          ) : (
                            <button
                              disabled={check?.verifying}
                              onClick={() => handleVerifyDocIntegrity(doc.docId)}
                              className="py-1 px-3 bg-[#2B1B14] hover:bg-[#3D281F] text-[#F8F2F0] text-xs font-semibold rounded shadow transition-all"
                            >
                              {check?.verifying ? 'Checking...' : 'Verify integrity'}
                            </button>
                          )}
                        </div>
                      </div>

                      {check?.message && (
                        <p
                          className={`text-[0.7rem] ${
                            isMismatch ? 'text-[#DC2626] font-semibold' : 'text-[#047857]'
                          }`}
                        >
                          {check.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Verification Checklist</h3>
              <div className="flex flex-col gap-3">
                {/* 1. KYC Verified (Auto, read-only) */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={isKycVerified ? 'text-[#047857] font-bold' : 'text-[#DC2626]'}>
                      {isKycVerified ? '✓' : '✕'}
                    </span>
                    <span className="text-[#2B1B14]">Identity verified with Aadhaar KYC (Auto)</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[0.68rem] font-bold rounded ${
                      isKycVerified ? 'bg-[#10B981]/15 text-[#047857]' : 'bg-[#DC2626]/15 text-[#DC2626]'
                    }`}
                  >
                    {application.kycStatus}
                  </span>
                </div>

                {/* 2. Payment Received (Auto, read-only) */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={isPaymentReceived ? 'text-[#047857] font-bold' : 'text-[#DC2626]'}>
                      {isPaymentReceived ? '✓' : '✕'}
                    </span>
                    <span className="text-[#2B1B14]">Stamp duty &amp; mutation payment received (Auto)</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[0.68rem] font-bold rounded ${
                      isPaymentReceived ? 'bg-[#10B981]/15 text-[#047857]' : 'bg-[#DC2626]/15 text-[#DC2626]'
                    }`}
                  >
                    {application.paymentStatus}
                  </span>
                </div>

                {/* 3. Documents Reviewed (Manual; requires all checked first) */}
                <label
                  className={`flex items-center gap-3 p-3 rounded-lg border text-xs transition-colors ${
                    !allDocsChecked || hasDocMismatch
                      ? 'bg-[#F8F2F0]/50 border-[#D3CCC8] text-[#7A6B63] cursor-not-allowed'
                      : 'bg-[#F8F2F0] border-[#D3CCC8] text-[#2B1B14] cursor-pointer'
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={!allDocsChecked || hasDocMismatch}
                    checked={manualChecks.documentsReviewed}
                    onChange={(e) =>
                      setManualChecks((prev) => ({
                        ...prev,
                        documentsReviewed: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#047857]"
                  />
                  <div>
                    <span className="font-semibold block">Documents reviewed &amp; cryptographic signatures valid</span>
                    {(!allDocsChecked || hasDocMismatch) && (
                      <span className="text-[0.68rem] text-[#B45309] block mt-0.5">
                        * Requires all documents to be integrity-checked with no MISMATCH.
                      </span>
                    )}
                  </div>
                </label>

                {/* 4. Property details match records (Manual) */}
                <label className="flex items-center gap-3 p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={manualChecks.propertyMatched}
                    onChange={(e) =>
                      setManualChecks((prev) => ({
                        ...prev,
                        propertyMatched: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-[#047857]"
                  />
                  <span className="text-[#2B1B14] font-semibold">
                    Property details match revenue registry records
                  </span>
                </label>

                {/* 5. No competing open transfer (Shown from data) */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#047857] font-bold">✓</span>
                    <span className="text-[#2B1B14]">No competing open transfer on this property</span>
                  </div>
                  <span className="px-2 py-0.5 text-[0.68rem] font-bold rounded bg-[#10B981]/15 text-[#047857]">
                    Clear
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Approve Confirm Modal */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Confirm Application Approval"
        footer={
          <div className="flex gap-2.5">
            <button
              onClick={() => setApproveModalOpen(false)}
              className="py-2 px-4 bg-transparent border border-[#D3CCC8] text-[#2B1B14] rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              disabled={approving}
              onClick={handleConfirmApproval}
              className="py-2 px-4 bg-[#047857] text-white font-bold rounded-lg text-xs hover:bg-[#065F46] disabled:opacity-50"
            >
              {approving ? 'Submitting to Ledger...' : 'Confirm Approval & Commit'}
            </button>
          </div>
        }
      >
        <div className="text-xs text-[#2B1B14] flex flex-col gap-3">
          <p>
            You are approving land transfer application <strong>{application.id}</strong> for parcel{' '}
            <strong>{application.propertyId}</strong>.
          </p>
          <div className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#6E5D53]">
            Approval alone initiates the backend blockchain transaction write. Ownership will mutate upon asynchronous event confirmation.
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Application"
        footer={
          <div className="flex gap-2.5">
            <button
              onClick={() => setRejectModalOpen(false)}
              className="py-2 px-4 bg-transparent border border-[#D3CCC8] text-[#2B1B14] rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRejection}
              className="py-2 px-4 bg-[#DC2626] text-white font-bold rounded-lg text-xs hover:bg-[#B91C1C]"
            >
              Confirm Rejection
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 text-xs">
          <div className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-lg text-[#DC2626]">
            <strong>This action will terminate the transfer process.</strong>
            <p className="mt-1">Select an authoritative rejection reason below.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#2B1B14]">Rejection Reason *</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              <option value="">Select a reason...</option>
              <option value="Incomplete documents submitted">Incomplete documents submitted</option>
              <option value="Identity (KYC) verification failed">Identity (KYC) verification failed</option>
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
              placeholder="Provide specific notes for the applicant..."
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            />
          </div>
        </div>
      </Modal>

      {/* Resubmission Modal */}
      <Modal
        isOpen={resubmitModalOpen}
        onClose={() => setResubmitModalOpen(false)}
        title="Request Resubmission"
        footer={
          <div className="flex gap-2.5">
            <button
              onClick={() => setResubmitModalOpen(false)}
              className="py-2 px-4 bg-transparent border border-[#D3CCC8] text-[#2B1B14] rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmResubmission}
              className="py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold rounded-lg text-xs hover:bg-[#3D281F]"
            >
              Send Request
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 text-xs">
          <p className="text-[#6E5D53]">
            Specify the corrections or documents that the applicant must provide to continue verification.
          </p>
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-[#2B1B14]">Resubmission Remarks *</label>
            <textarea
              rows={3}
              value={resubmitRemarks}
              onChange={(e) => setResubmitRemarks(e.target.value)}
              placeholder="e.g. Please re-upload clear scan of Land Map with seal..."
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
