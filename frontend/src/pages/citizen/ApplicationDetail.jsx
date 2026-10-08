import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import MutationStepper from '../../components/MutationStepper';
import TransactionStatusPill from '../../components/TransactionStatusPill';
import applicationService from '../../services/applicationService';
import kycService from '../../services/kycService';
import paymentService from '../../services/paymentService';
import propertyService from '../../services/propertyService';
import { DOCUMENT_TYPE_LABELS } from '../../utils/statuses';

export default function CitizenApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [notice, setNotice] = useState('');

  const loadData = async () => {
    try {
      const app = await applicationService.getApplicationById(id);
      setApplication(app);
      if (app?.propertyId) {
        const prop = await propertyService.getPropertyById(app.propertyId);
        setProperty(prop);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleStartKyc = async () => {
    setActionLoading(true);
    setNotice('');
    try {
      const updated = await kycService.triggerMockKyc(application.id, 'VERIFIED');
      setApplication(updated);
      setNotice('Mock Aadhaar KYC verification completed successfully.');
    } catch (err) {
      setNotice(err.message || 'Mock KYC failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    setActionLoading(true);
    setNotice('');
    try {
      const updated = await paymentService.triggerMockPayment(application.id, 'SUCCESSFUL');
      setApplication(updated);
      setNotice('Simulated INR stamp duty & mutation fees paid successfully.');
    } catch (err) {
      setNotice(err.message || 'Simulated payment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyHash = () => {
    if (application?.txHash) {
      navigator.clipboard.writeText(application.txHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
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
        <Sidebar portal="citizen" />
        <main className="flex-1 md:ml-[280px] p-8 flex items-center justify-center">
          <span className="text-xs text-[#6E5D53]">Loading application details...</span>
        </main>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
        <Sidebar portal="citizen" />
        <main className="flex-1 md:ml-[280px] p-8">
          <p className="text-sm text-[#DC2626]">Application not found.</p>
          <button
            onClick={() => navigate('/citizen/applications')}
            className="mt-4 py-2 px-4 bg-[#2B1B14] text-white rounded text-xs"
          >
            Back to Applications
          </button>
        </main>
      </div>
    );
  }

  const isKycVerified = application.kycStatus === 'VERIFIED';
  const isPaymentSuccess = application.paymentStatus === 'SUCCESSFUL';

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
                Transfer Application #{application.id}
              </h1>
              <TransactionStatusPill status={application.applicationStatus} />
            </div>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
              Submitted on {application.submittedAt} · Property {application.propertyId}
            </p>
          </div>
          <Link
            to="/citizen/applications"
            className="py-2 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
          >
            &larr; Back to Applications
          </Link>
        </header>

        {notice && (
          <div className="mb-6 p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#047857] text-xs font-semibold animate-fade-in flex justify-between items-center">
            <span>{notice}</span>
            <button onClick={() => setNotice('')} className="text-sm font-bold leading-none">
              &times;
            </button>
          </div>
        )}

        {/* Failure banner if FAILED or SYNC_FAILED */}
        {(application.blockchainStatus === 'SYNC_FAILED' || application.blockchainError) && (
          <div className="mb-6 p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-medium">
            <strong className="block font-bold mb-1">
              Blockchain State Synchronization Failed
            </strong>
            <p>
              {application.blockchainError ||
                'Database state synchronization timed out after blockchain ledger confirmation. The transfer has NOT been completed.'}
            </p>
          </div>
        )}

        {application.paymentFailureMessage && (
          <div className="mb-6 p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-medium">
            <strong className="block font-bold mb-1">Payment Verification Notice:</strong>
            <p>{application.paymentFailureMessage}</p>
          </div>
        )}

        {/* Mutation Stepper */}
        <section className="mb-8">
          <h2 className="text-sm font-bold text-[#6E5D53] uppercase tracking-wider mb-3">
            Mutation Workflow Progress
          </h2>
          <MutationStepper
            applicationStatus={application.applicationStatus}
            blockchainStatus={application.blockchainStatus}
          />
        </section>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Property & Parties */}
          <div className="flex flex-col gap-6">
            {/* Property Card */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Parcel Details</h3>
              <div className="text-xs flex flex-col gap-2.5">
                <div className="flex justify-between py-1 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Property ID (ULPIN):</span>
                  <span className="font-mono font-bold text-[#2B1B14]">
                    {application.propertyId}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Khasra Number:</span>
                  <span className="font-bold text-[#2B1B14]">{property?.khasraNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Location:</span>
                  <span className="text-[#2B1B14]">
                    Village {property?.village}, Tehsil {property?.tehsil}, {property?.district}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#D3CCC8]">
                  <span className="text-[#6E5D53]">Surface Area:</span>
                  <span className="text-[#2B1B14]">{property?.areaSqFt} sq. ft</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#6E5D53]">Land Classification:</span>
                  <span className="text-[#2B1B14]">{property?.landType}</span>
                </div>
              </div>
            </div>

            {/* Parties Card */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Parties Involved</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8]">
                  <span className="text-[0.68rem] uppercase font-bold text-[#6E5D53] block mb-1">
                    Transferor (Seller)
                  </span>
                  <strong className="text-sm text-[#2B1B14] block">
                    {application.sellerName}
                  </strong>
                  <span className="text-[#7A6B63] block mt-1">+91 {application.sellerPhone}</span>
                </div>
                <div className="p-3.5 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8]">
                  <span className="text-[0.68rem] uppercase font-bold text-[#6E5D53] block mb-1">
                    Transferee (Buyer)
                  </span>
                  <strong className="text-sm text-[#2B1B14] block">{application.buyerName}</strong>
                  <span className="text-[#7A6B63] block mt-1">+91 {application.buyerPhone}</span>
                </div>
              </div>
            </div>

            {/* Documents Card */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">
                Submitted Deeds &amp; Certs ({application.documents?.length || 0})
              </h3>
              <div className="flex flex-col gap-2.5">
                {(application.documents || []).map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#F8F2F0] rounded-lg border border-[#D3CCC8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                  >
                    <div>
                      <strong className="text-[#2B1B14] block">
                        {DOCUMENT_TYPE_LABELS[doc.type] || doc.type}
                      </strong>
                      <span className="text-[#6E5D53] text-[0.72rem]">{doc.fileName}</span>
                    </div>
                    <div className="font-mono text-[0.68rem] text-[#7A6B63] bg-[#E6DEDA] px-2 py-0.5 rounded border border-[#D3CCC8]">
                      Hash: {truncateHash(doc.hash)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Actions (KYC, Payment, Appointment, Blockchain) */}
          <div className="flex flex-col gap-6">
            {/* KYC Card */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-[#2B1B14]">Identity Verification (KYC)</h3>
                <TransactionStatusPill status={application.kycStatus} type="kyc" />
              </div>
              <p className="text-xs text-[#6E5D53] mb-4">
                Aadhaar eKYC authentication simulation for seller &amp; buyer identity verification.
              </p>
              {isKycVerified ? (
                <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/25 rounded-lg text-[#047857] text-xs font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>KYC verified and recorded for this application.</span>
                </div>
              ) : (
                <button
                  disabled={actionLoading}
                  onClick={handleStartKyc}
                  className="w-full py-2.5 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-60"
                >
                  {actionLoading
                    ? 'Simulating Verification...'
                    : 'Start KYC (simulated)'}
                </button>
              )}
            </div>

            {/* Payment Card */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-[#2B1B14]">Stamp Duty &amp; Mutation Fees</h3>
                <TransactionStatusPill status={application.paymentStatus} type="payment" />
              </div>
              <p className="text-xs text-[#6E5D53] mb-4">
                Mock Indian Rupee (INR) payment for stamp duty charges. Requires verified KYC.
              </p>
              {isPaymentSuccess ? (
                <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/25 rounded-lg text-[#047857] text-xs font-semibold flex items-center gap-2">
                  <span>✓</span>
                  <span>Payment received and cleared.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    disabled={!isKycVerified || actionLoading}
                    onClick={handleProcessPayment}
                    className="w-full py-2.5 px-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading
                      ? 'Processing simulated payment...'
                      : 'Pay (simulated, INR)'}
                  </button>
                  {!isKycVerified && (
                    <span className="text-[0.7rem] text-[#B45309]">
                      * KYC must be verified before payment can be initiated.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Appointment Card */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">Sub-Registrar Appointment</h3>
              {application.appointment ? (
                <div className="p-3.5 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8] text-xs flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#6E5D53]">Office:</span>
                    <strong className="text-[#2B1B14]">{application.appointment.office}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E5D53]">Date:</span>
                    <strong className="text-[#2B1B14]">{application.appointment.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6E5D53]">Time Slot:</span>
                    <strong className="text-[#2B1B14]">{application.appointment.slot}</strong>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-[#6E5D53]">
                    No appointment scheduled yet for physical verification signoff.
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/citizen/book-appointment?applicationId=${application.id}`)
                    }
                    className="py-2.5 px-4 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg transition-colors"
                  >
                    Schedule Appointment Slot &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Blockchain Transaction Tracker */}
            {application.txHash && (
              <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-[#2B1B14]">Blockchain State Tracker</h3>
                  <TransactionStatusPill
                    status={application.blockchainStatus}
                    type="blockchain"
                  />
                </div>
                <p className="text-xs text-[#6E5D53] mb-3">
                  Asynchronous ledger confirmation details recorded by the backend registrar node.
                </p>
                <div className="p-3 rounded-lg bg-[#F8F2F0] border border-[#D3CCC8] flex flex-col gap-2">
                  <span className="text-[0.72rem] text-[#6E5D53]">Transaction Hash:</span>
                  <div className="font-mono text-xs break-all text-[#2B1B14]">
                    {application.txHash}
                  </div>
                  <button
                    onClick={handleCopyHash}
                    className="self-start py-1 px-3 bg-[#E6DEDA] border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-[0.72rem] font-semibold rounded transition-colors"
                  >
                    {copiedHash ? '✓ Copied' : 'Copy Hash'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
