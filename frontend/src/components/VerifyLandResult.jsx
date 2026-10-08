import React, { useState } from 'react';

export default function VerifyLandResult({ result, isPublic = false, onClose }) {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!result) return null;

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const maskName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((part) => (part.length > 0 ? part[0] + '***' : ''))
      .join(' ');
  };

  const handleCopyHash = () => {
    if (result.txHash) {
      navigator.clipboard.writeText(result.txHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const isMatch = result.integrityCheck === 'MATCH';

  return (
    <section className="bg-[#E6DEDA] border-2 border-[#D3CCC8] rounded-2xl p-6 sm:p-8 shadow-lg mb-12 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#D3CCC8] mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2B1B14]">Verification Results</h2>
          <p className="text-xs text-[#6E5D53] mt-0.5">
            Cryptographic ledger proof &amp; title confirmation
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-2xl text-[#6E5D53] hover:text-[#2B1B14] leading-none p-1"
            aria-label="Close Results"
          >
            &times;
          </button>
        )}
      </div>

      {/* Verification Status Banner */}
      <div
        className={`p-5 rounded-xl border mb-8 flex flex-col gap-1.5 ${
          isMatch
            ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#047857]'
            : 'bg-[#DC2626]/10 border-[#DC2626]/30 text-[#DC2626]'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold">
            {isMatch ? 'Record Found & Cryptographically Verified' : 'Record Verification Warning'}
          </h3>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
              isMatch
                ? 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30'
                : 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/30'
            }`}
          >
            Integrity: {result.integrityCheck || 'MATCH'}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#6E5D53]">
          {result.verificationStatus || 'Verified against blockchain state'}
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Land Identification */}
        <div className="bg-[#F8F2F0] p-5 rounded-xl border border-[#D3CCC8] flex flex-col gap-2">
          <h4 className="font-bold text-[#2B1B14] text-sm border-b border-[#D3CCC8] pb-2 mb-1">
            Parcel Identification
          </h4>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">Property ID:</span>
            <span className="font-mono font-bold text-[#2B1B14]">{result.propertyId}</span>
          </div>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">Khasra Number:</span>
            <span className="font-bold text-[#2B1B14]">{result.khasraNumber}</span>
          </div>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">Village:</span>
            <span className="text-[#2B1B14]">{result.village}</span>
          </div>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">Tehsil:</span>
            <span className="text-[#2B1B14]">{result.tehsil}</span>
          </div>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">District:</span>
            <span className="text-[#2B1B14]">{result.district}</span>
          </div>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">State:</span>
            <span className="text-[#2B1B14]">{result.state}</span>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-[#F8F2F0] p-5 rounded-xl border border-[#D3CCC8] flex flex-col gap-2">
          <h4 className="font-bold text-[#2B1B14] text-sm border-b border-[#D3CCC8] pb-2 mb-1">
            Specifications &amp; Status
          </h4>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">Surface Area:</span>
            <span className="font-bold text-[#2B1B14]">{result.areaSqFt} sq. ft</span>
          </div>
          <div className="text-xs flex justify-between">
            <span className="text-[#6E5D53]">Land Classification:</span>
            <span className="text-[#2B1B14]">{result.landType}</span>
          </div>
          <div className="text-xs flex justify-between items-center">
            <span className="text-[#6E5D53]">Registration Status:</span>
            <span className="px-2 py-0.5 rounded text-[0.72rem] font-bold bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
              {result.registrationStatus}
            </span>
          </div>
          <div className="text-xs flex justify-between items-center">
            <span className="text-[#6E5D53]">Cryptographic Integrity:</span>
            <span
              className={`px-2 py-0.5 rounded text-[0.72rem] font-bold ${
                isMatch
                  ? 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30'
                  : 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/30'
              }`}
            >
              {result.integrityCheck || 'MATCH'}
            </span>
          </div>
        </div>

        {/* Blockchain Reference */}
        <div className="bg-[#F8F2F0] p-5 rounded-xl border border-[#D3CCC8] flex flex-col justify-between gap-3">
          <div>
            <h4 className="font-bold text-[#2B1B14] text-sm border-b border-[#D3CCC8] pb-2 mb-2">
              Blockchain Reference
            </h4>
            <span className="text-[0.72rem] text-[#6E5D53] block mb-1">
              Confirmed Transaction Hash:
            </span>
            <div className="p-2.5 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] font-mono text-xs break-all text-[#2B1B14]">
              {result.txHash || 'N/A'}
            </div>
          </div>
          {result.txHash && (
            <button
              onClick={handleCopyHash}
              className="py-1.5 px-3 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-semibold rounded-lg self-start transition-colors"
            >
              {copiedHash ? '✓ Hash Copied' : 'Copy Full Tx Hash'}
            </button>
          )}
        </div>
      </div>

      {/* Ownership History */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#F8F2F0] border border-[#D3CCC8] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-[#2B1B14] text-sm">
            Ownership History ({result.ownershipHistory?.length || 0} Finalized Transfers)
          </h4>
          <span className="text-xs text-[#7A6B63]">
            {isPublic ? 'Public view (personal identities withheld)' : 'Citizen view (masked names)'}
          </span>
        </div>

        {(!result.ownershipHistory || result.ownershipHistory.length === 0) ? (
          <p className="text-xs text-[#6E5D53]">
            No previous transfer history recorded on this parcel.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {result.ownershipHistory.map((h, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#E6DEDA] border border-[#D3CCC8] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
              >
                <div>
                  <div className="font-bold text-[#2B1B14] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#047857]" />
                    <span>Ownership transferred, finalized on blockchain and synchronized</span>
                  </div>
                  {!isPublic && (h.from || h.to) && (
                    <p className="text-[0.72rem] text-[#6E5D53] mt-1 ml-4">
                      Parties: {maskName(h.from)} &rarr; {maskName(h.to)}
                    </p>
                  )}
                  <span className="text-[0.68rem] text-[#7A6B63] ml-4 block mt-0.5">
                    Finalized on: {h.date}
                  </span>
                </div>
                {h.txHash && (
                  <span className="font-mono text-[0.68rem] text-[#6E5D53] self-end sm:self-auto bg-[#F8F2F0] px-2 py-1 rounded border border-[#D3CCC8]">
                    Ref: {truncateHash(h.txHash)}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
