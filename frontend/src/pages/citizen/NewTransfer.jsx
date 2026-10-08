import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import propertyService from '../../services/propertyService';
import applicationService from '../../services/applicationService';
import documentService from '../../services/documentService';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from '../../utils/statuses';

const REQUIRED_DOC_TYPES = [
  DOCUMENT_TYPES.SALE_DEED,
  DOCUMENT_TYPES.IDENTITY_PROOF,
  DOCUMENT_TYPES.LAND_MAP,
  DOCUMENT_TYPES.ENCUMBRANCE_CERT,
  DOCUMENT_TYPES.TAX_RECEIPT,
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per Assumption A9
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

export default function CitizenNewTransfer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedPropId = searchParams.get('propertyId');

  const [step, setStep] = useState(1);
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(preSelectedPropId || '');
  const [buyerQuery, setBuyerQuery] = useState('');
  const [buyerResult, setBuyerResult] = useState(null);
  const [buyerSearching, setBuyerSearching] = useState(false);
  const [buyerError, setBuyerError] = useState('');

  // Uploaded docs: { [type]: { file, fileName, hash, loading, error } }
  const [uploadedDocs, setUploadedDocs] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      if (user?.id) {
        try {
          const list = await propertyService.getUserProperties(user.id);
          setProperties(list);
          if (preSelectedPropId && list.some((p) => p.propertyId === preSelectedPropId && p.status === 'Active')) {
            setSelectedPropertyId(preSelectedPropId);
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchProperties();
  }, [user, preSelectedPropId]);

  const selectedProperty = properties.find((p) => p.propertyId === selectedPropertyId);

  // --- Step 2: Buyer Lookup ---
  const handleLookupBuyer = async (e) => {
    e.preventDefault();
    setBuyerError('');
    setBuyerResult(null);

    if (!buyerQuery.trim()) {
      setBuyerError('Please enter the buyer email or mobile number.');
      return;
    }

    setBuyerSearching(true);
    try {
      const res = await applicationService.lookupBuyer(buyerQuery.trim(), user.id);
      setBuyerResult(res);
    } catch (err) {
      setBuyerError(err.message || 'Buyer lookup failed.');
    } finally {
      setBuyerSearching(false);
    }
  };

  // --- Step 3: Document Upload Handler ---
  const handleFileChange = async (docType, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          error: `Invalid file format (${ext}). Allowed: PDF, JPG, PNG.`,
        },
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          error: `File exceeds 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
        },
      }));
      return;
    }

    // Client-side validation passed. Upload to server to receive server-side SHA-256 hash.
    setUploadedDocs((prev) => ({
      ...prev,
      [docType]: {
        fileName: file.name,
        loading: true,
        error: '',
        hash: '',
      },
    }));

    try {
      const uploadRes = await documentService.uploadDocument(file, docType);
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          type: docType,
          fileName: file.name,
          hash: uploadRes.hash,
          loading: false,
          error: '',
        },
      }));
    } catch (err) {
      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          loading: false,
          error: 'Failed to upload document to server.',
        },
      }));
    }
  };

  const areAllDocsUploaded = REQUIRED_DOC_TYPES.every(
    (t) => uploadedDocs[t]?.hash && !uploadedDocs[t]?.loading
  );

  // --- Step 4: Submit Application ---
  const handleSubmitApplication = async () => {
    setFormError('');
    setSubmitting(true);

    try {
      const docPayload = REQUIRED_DOC_TYPES.map((t) => ({
        type: t,
        fileName: uploadedDocs[t].fileName,
        hash: uploadedDocs[t].hash,
      }));

      const newApp = await applicationService.createApplication({
        propertyId: selectedPropertyId,
        seller: {
          id: user.id,
          name: user.name,
          phone: user.phone || '9876543210',
        },
        buyer: {
          id: buyerResult.id,
          name: buyerResult.name,
          phone: buyerResult.phone,
        },
        documents: docPayload,
      });

      navigate(`/citizen/applications/${newApp.id}`);
    } catch (err) {
      setFormError(err.message || 'Failed to submit application.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            New Land Transfer Application
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Initiate a Sale Deed mutation transfer workflow for your registered parcel
          </p>
        </header>

        {/* Step Indicator Header */}
        <div className="mb-8 p-4 bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl flex items-center justify-between overflow-x-auto text-xs font-bold text-[#6E5D53]">
          {[
            { num: 1, label: '1. Select Property' },
            { num: 2, label: '2. Buyer Lookup' },
            { num: 3, label: '3. Upload Deeds' },
            { num: 4, label: '4. Review & Submit' },
          ].map((item) => (
            <div
              key={item.num}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
                step === item.num
                  ? 'bg-[#2B1B14] text-[#F8F2F0]'
                  : step > item.num
                  ? 'text-[#047857]'
                  : 'text-[#7A6B63]'
              }`}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-semibold">
            {formError}
          </div>
        )}

        {/* STEP 1: Select Property */}
        {step === 1 && (
          <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 max-w-3xl shadow-sm">
            <h2 className="text-lg font-bold text-[#2B1B14] mb-2">Step 1: Choose Your Property</h2>
            <p className="text-xs text-[#6E5D53] mb-6">
              Select one of your registered active land parcels to transfer.
            </p>

            <div className="flex flex-col gap-3">
              {properties.map((prop) => {
                const isBlocked = prop.status === 'Transfer in progress';
                const isSelected = selectedPropertyId === prop.propertyId;

                return (
                  <label
                    key={prop.propertyId}
                    className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                      isBlocked
                        ? 'opacity-60 bg-[#D3CCC8]/30 border-[#D3CCC8] cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#F8F2F0] border-[#2B1B14] shadow-sm cursor-pointer'
                        : 'bg-[#F8F2F0]/60 border-[#D3CCC8] hover:border-[#2B1B14]/40 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="propertySelect"
                      value={prop.propertyId}
                      disabled={isBlocked}
                      checked={isSelected}
                      onChange={() => setSelectedPropertyId(prop.propertyId)}
                      className="w-4 h-4 mt-1 accent-[#2B1B14]"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-sm text-[#2B1B14]">
                          {prop.propertyId}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[0.68rem] font-bold rounded-full ${
                            isBlocked
                              ? 'bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30'
                              : 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E5D53] mt-1">
                        Khasra No. <strong>{prop.khasraNumber}</strong> · Village {prop.village}, Tehsil {prop.tehsil}, {prop.district}
                      </p>
                      <p className="text-xs text-[#7A6B63] mt-0.5">
                        Area: {prop.areaSqFt.toLocaleString()} sq. ft · Type: {prop.landType}
                      </p>
                      {isBlocked && (
                        <p className="text-[0.7rem] text-[#B45309] font-semibold mt-1">
                          Transfer already in progress on this parcel. Open transfer must be finalized or cancelled.
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-[#D3CCC8] flex justify-end">
              <button
                disabled={!selectedPropertyId || selectedProperty?.status === 'Transfer in progress'}
                onClick={() => setStep(2)}
                className="py-2.5 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Buyer Lookup &rarr;
              </button>
            </div>
          </section>
        )}

        {/* STEP 2: Buyer Lookup */}
        {step === 2 && (
          <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 max-w-3xl shadow-sm">
            <h2 className="text-lg font-bold text-[#2B1B14] mb-2">Step 2: Buyer Lookup</h2>
            <p className="text-xs text-[#6E5D53] mb-6">
              Search for the registered buyer by registered email address or mobile phone.
            </p>

            <form onSubmit={handleLookupBuyer} className="flex flex-col sm:flex-row gap-3 mb-6">
              <input
                type="text"
                placeholder="Buyer email (e.g., suresh.singh@example.com) or 10-digit phone"
                value={buyerQuery}
                onChange={(e) => setBuyerQuery(e.target.value)}
                className="flex-1 p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-xs sm:text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
              />
              <button
                type="submit"
                disabled={buyerSearching}
                className="py-3 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-50"
              >
                {buyerSearching ? 'Searching...' : 'Search Buyer'}
              </button>
            </form>

            {buyerError && (
              <div className="mb-6 p-3 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-semibold">
                {buyerError}
              </div>
            )}

            {buyerResult && (
              <div className="p-5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-[#2B1B14]">Buyer Record Found</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                    KYC: {buyerResult.kycStatus}
                  </span>
                </div>
                <div className="text-xs text-[#6E5D53] flex flex-col gap-1">
                  <p>
                    <strong className="text-[#2B1B14]">Legal Name:</strong> {buyerResult.maskedName}
                  </p>
                  <p>
                    <strong className="text-[#2B1B14]">Email:</strong> {buyerResult.email}
                  </p>
                  <p>
                    <strong className="text-[#2B1B14]">Phone:</strong> +91 {buyerResult.phone}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 pt-4 border-t border-[#D3CCC8] flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="py-2.5 px-4 bg-transparent border border-[#D3CCC8] text-[#2B1B14] text-xs font-semibold rounded-lg hover:border-[#2B1B14]"
              >
                &larr; Back
              </button>
              <button
                disabled={!buyerResult}
                onClick={() => setStep(3)}
                className="py-2.5 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Documents &rarr;
              </button>
            </div>
          </section>
        )}

        {/* STEP 3: Document Upload */}
        {step === 3 && (
          <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 max-w-3xl shadow-sm">
            <h2 className="text-lg font-bold text-[#2B1B14] mb-2">Step 3: Document Upload</h2>
            <p className="text-xs text-[#6E5D53] mb-6">
              Upload the 5 required deeds (PDF, JPG, PNG up to 10 MB each). Cryptographic hashes are securely computed and signed by the server.
            </p>

            <div className="flex flex-col gap-4 mb-6">
              {REQUIRED_DOC_TYPES.map((docType) => {
                const docState = uploadedDocs[docType] || {};
                const isUploaded = !!docState.hash;

                return (
                  <div
                    key={docType}
                    className="p-4 rounded-xl bg-[#F8F2F0] border border-[#D3CCC8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-xs text-[#2B1B14] block">
                        {DOCUMENT_TYPE_LABELS[docType]} *
                      </span>
                      {docState.fileName ? (
                        <span className="text-xs text-[#047857] font-semibold mt-0.5 block">
                          ✓ File: {docState.fileName}
                        </span>
                      ) : (
                        <span className="text-[0.72rem] text-[#7A6B63]">
                          Required format: PDF, JPG, PNG (Max 10 MB)
                        </span>
                      )}
                      {docState.hash && (
                        <span className="font-mono text-[0.68rem] text-[#6E5D53] block mt-0.5 break-all">
                          Server Hash: {docState.hash.slice(0, 20)}...
                        </span>
                      )}
                      {docState.error && (
                        <span className="text-[0.72rem] text-[#DC2626] font-semibold block mt-1">
                          {docState.error}
                        </span>
                      )}
                    </div>

                    <div className="shrink-0">
                      <label className="py-2 px-4 bg-[#2B1B14] hover:bg-[#3D281F] text-[#F8F2F0] text-xs font-bold rounded-lg cursor-pointer shadow transition-all inline-block">
                        {docState.loading
                          ? 'Uploading...'
                          : isUploaded
                          ? 'Replace File'
                          : 'Select File'}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(docType, e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-4 border-t border-[#D3CCC8] flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="py-2.5 px-4 bg-transparent border border-[#D3CCC8] text-[#2B1B14] text-xs font-semibold rounded-lg hover:border-[#2B1B14]"
              >
                &larr; Back
              </button>
              <button
                disabled={!areAllDocsUploaded}
                onClick={() => setStep(4)}
                className="py-2.5 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review Application &rarr;
              </button>
            </div>
          </section>
        )}

        {/* STEP 4: Review & Submit */}
        {step === 4 && (
          <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 max-w-3xl shadow-sm">
            <h2 className="text-lg font-bold text-[#2B1B14] mb-2">Step 4: Review and Submit</h2>
            <p className="text-xs text-[#6E5D53] mb-6">
              Confirm your transfer details before generating the initial submission record.
            </p>

            <div className="flex flex-col gap-4 mb-6 text-xs">
              {/* Property summary */}
              <div className="p-4 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8]">
                <h3 className="font-bold text-sm text-[#2B1B14] mb-2">Parcel to Transfer</h3>
                <div className="grid grid-cols-2 gap-2">
                  <p><strong className="text-[#2B1B14]">Property ID:</strong> {selectedProperty?.propertyId}</p>
                  <p><strong className="text-[#2B1B14]">Khasra No:</strong> {selectedProperty?.khasraNumber}</p>
                  <p><strong className="text-[#2B1B14]">Location:</strong> Village {selectedProperty?.village}, Tehsil {selectedProperty?.tehsil}</p>
                  <p><strong className="text-[#2B1B14]">Surface Area:</strong> {selectedProperty?.areaSqFt} sq. ft</p>
                </div>
              </div>

              {/* Parties summary */}
              <div className="p-4 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8]">
                <h3 className="font-bold text-sm text-[#2B1B14] mb-2">Parties</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <strong className="text-[#2B1B14] block">Seller (You):</strong>
                    <span>{user.name}</span>
                    <span className="block text-[#7A6B63]">+91 {user.phone || '9876543210'}</span>
                  </div>
                  <div>
                    <strong className="text-[#2B1B14] block">Buyer:</strong>
                    <span>{buyerResult?.maskedName}</span>
                    <span className="block text-[#7A6B63]">+91 {buyerResult?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Documents summary */}
              <div className="p-4 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8]">
                <h3 className="font-bold text-sm text-[#2B1B14] mb-2">
                  Attached Deeds ({REQUIRED_DOC_TYPES.length})
                </h3>
                <ul className="space-y-1">
                  {REQUIRED_DOC_TYPES.map((t) => (
                    <li key={t} className="flex justify-between text-[#6E5D53]">
                      <span>{DOCUMENT_TYPE_LABELS[t]}</span>
                      <span className="font-mono text-[#047857]">✓ {uploadedDocs[t]?.fileName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#D3CCC8] flex justify-between">
              <button
                disabled={submitting}
                onClick={() => setStep(3)}
                className="py-2.5 px-4 bg-transparent border border-[#D3CCC8] text-[#2B1B14] text-xs font-semibold rounded-lg hover:border-[#2B1B14]"
              >
                &larr; Back
              </button>
              <button
                disabled={submitting}
                onClick={handleSubmitApplication}
                className="py-3 px-8 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting Transfer...' : 'Confirm & Submit Application'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
