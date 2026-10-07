import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function AuthorityRegistry() {
  const navigate = useNavigate();

  const handleExecute = () => {
    alert('Smart Contract Executed! Block Committed to Hyperledger Node #10484.');
    navigate('/authority/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            Smart Contract Mutation Execution
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Final digital signoff &amp; Hyperledger block commitment
          </p>
        </header>

        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-8 max-w-[800px] shadow-sm">
          <h2 className="text-xl font-bold text-[#2B1B14] mb-6">
            Deed Registration Final Signoff
          </h2>

          <div className="flex flex-col gap-3.5 mb-8 text-sm border-b border-[#D3CCC8] pb-6">
            <div className="flex justify-between">
              <strong className="text-[#6E5D53]">Deed Reference:</strong>
              <span className="font-mono font-bold text-[#2B1B14]">MUT-2026-8812</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-[#6E5D53]">Parcel ULPIN:</strong>
              <span className="font-mono font-bold text-[#2B1B14]">B.H.U.M.I-2026-MH-984210</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-[#6E5D53]">Seller Transferor:</strong>
              <span className="text-[#2B1B14]">Rajesh Kumar Sharma</span>
            </div>
            <div className="flex justify-between">
              <strong className="text-[#6E5D53]">Buyer Transferee:</strong>
              <span className="text-[#2B1B14]">Ananya Verma</span>
            </div>
            <div className="flex justify-between items-center">
              <strong className="text-[#6E5D53]">Biometric Status:</strong>
              <span className="text-[#047857] font-bold">Verified ✓</span>
            </div>
            <div className="flex justify-between items-center">
              <strong className="text-[#6E5D53]">Encumbrance Audit:</strong>
              <span className="text-[#047857] font-bold">Passed ✓</span>
            </div>
          </div>

          <button
            onClick={handleExecute}
            className="w-full py-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-base rounded-[10px] shadow hover:bg-[#2B1B14]/90 transition-all"
          >
            Execute Smart Contract &amp; Mint Digital Deed
          </button>
        </section>
      </main>
    </div>
  );
}
