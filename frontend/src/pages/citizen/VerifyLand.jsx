import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import VerifyLandForm from '../../components/VerifyLandForm';
import VerifyLandResult from '../../components/VerifyLandResult';
import publicService from '../../services/publicService';

export default function CitizenVerifyLand() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = async (searchParams) => {
    setIsLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const data = await publicService.verifyProperty(searchParams);
      if (data) {
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setNotFound(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            Verify Land Ownership
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Check parcel ownership records against the synchronized blockchain ledger
          </p>
        </header>

        {/* Verification Form Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-10">
          <div>
            <VerifyLandForm
              onVerify={handleVerify}
              isLoading={isLoading}
              onReset={handleReset}
            />

            {notFound && (
              <div className="mt-4 p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-semibold animate-fade-in">
                No matching land parcel record found for the provided details. Please verify your Village and Khasra number.
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">What You'll Get</h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[#6E5D53]">
                <li>Property ID &amp; Khasra Details</li>
                <li>Surface Area &amp; Classification</li>
                <li>Registration Status</li>
                <li>Blockchain Transaction Reference</li>
                <li>Ownership History</li>
              </ul>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">Privacy &amp; Security</h3>
              <p className="text-xs text-[#6E5D53] leading-relaxed">
                Per B.H.U.M.I. security architecture, personal identification numbers, contact details, and sensitive documents are protected and not publicly exposed. Logged-in citizens view masked party initials.
              </p>
            </div>
          </div>
        </section>

        {/* Result Section */}
        {result && (
          <VerifyLandResult
            result={result}
            isPublic={false}
            onClose={() => setResult(null)}
          />
        )}
      </main>
    </div>
  );
}
