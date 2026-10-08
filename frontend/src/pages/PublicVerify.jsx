import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import VerifyLandForm from '../components/VerifyLandForm';
import VerifyLandResult from '../components/VerifyLandResult';
import publicService from '../services/publicService';

export default function PublicVerify() {
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleVerify = async (searchParams) => {
    setIsLoading(true);
    setResult(null);
    setNotFound(false);
    setSearchError('');

    try {
      const data = await publicService.verifyProperty(searchParams);
      if (!data) {
        setNotFound(true);
      } else {
        setResult(data);
      }
    } catch (err) {
      setSearchError(err.message || 'Unable to verify property. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setNotFound(false);
    setSearchError('');
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[1100px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16">

        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-[#E6DEDA] border border-[#D3CCC8] text-xs font-semibold text-[#6E5D53]">
            <span>🔍</span>
            <span>Public Land Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2B1B14] mb-3 leading-tight">
            Verify Land Ownership
          </h1>
          <p className="text-[#6E5D53] text-sm sm:text-base max-w-[640px] leading-relaxed">
            Look up any land parcel using its revenue identifiers. Records are verified against
            confirmed blockchain state. This is a public, read-only service — no login required.
          </p>
        </div>

        {/* Privacy Notice Banner */}
        <div className="mb-8 p-4 rounded-xl bg-[#E6DEDA] border border-[#D3CCC8] flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-lg shrink-0">🔒</span>
          <div className="text-xs text-[#6E5D53] leading-relaxed">
            <strong className="text-[#2B1B14]">Privacy Notice: </strong>
            Personal information (owner name, contact, identity documents) is not disclosed on this
            public page in compliance with applicable data protection obligations. To view masked
            owner details, please{' '}
            <Link to="/auth/login" className="text-[#2B1B14] font-semibold underline underline-offset-2 hover:opacity-75">
              sign in as a registered citizen
            </Link>
            .
          </div>
        </div>

        {/* Search Error Banner */}
        {searchError && (
          <div className="mb-6 p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/30 text-[#DC2626] text-xs font-semibold flex justify-between items-center">
            <span>⚠️ {searchError}</span>
            <button
              onClick={() => setSearchError('')}
              className="ml-4 font-bold text-xs hover:opacity-75"
            >
              ✕
            </button>
          </div>
        )}

        {/* Verify Form */}
        <div className="mb-8">
          <VerifyLandForm
            onVerify={handleVerify}
            isLoading={isLoading}
            onReset={handleReset}
          />
        </div>

        {/* Not Found Message */}
        {notFound && !isLoading && (
          <div className="mb-8 p-6 rounded-xl bg-[#E6DEDA] border border-[#D3CCC8] shadow-sm text-center">
            <div className="text-3xl mb-3">🔎</div>
            <h3 className="text-base font-bold text-[#2B1B14] mb-2">No Record Found</h3>
            <p className="text-xs text-[#6E5D53] max-w-sm mx-auto leading-relaxed">
              No land parcel matching the provided details was found in the registry. Please
              double-check the State, District, Tehsil, Village, and Khasra Number.
            </p>
          </div>
        )}

        {/* Verification Result */}
        {result && !isLoading && (
          <VerifyLandResult
            result={result}
            isPublic={true}
            onClose={handleReset}
          />
        )}

        {/* Call to Action Footer */}
        <div className="mt-10 p-6 sm:p-8 rounded-xl bg-[#E6DEDA] border border-[#D3CCC8] shadow-sm flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div>
            <h3 className="font-bold text-[#2B1B14] text-base mb-1">
              Own a registered property?
            </h3>
            <p className="text-xs text-[#6E5D53] max-w-sm leading-relaxed">
              Citizens can sign in to initiate a land transfer application, track application
              status, and download e-Registry certificates.
            </p>
          </div>
          <Link
            to="/auth/login"
            className="shrink-0 py-2.5 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#3D281F] transition-all"
          >
            Sign In &rarr;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
