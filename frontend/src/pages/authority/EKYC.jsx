import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function AuthorityEKYC() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [biometricScanned, setBiometricScanned] = useState(false);

  const handleSendOtp = () => {
    setOtpSent(true);
    alert('OTP sent to applicant registered mobile number +91 98765 43211 (Simulated OTP: 7842)');
  };

  const handleVerifyOtp = () => {
    if (!otpVal) {
      alert('Please enter OTP');
      return;
    }
    alert('Aadhaar OTP Verified Successfully!');
    setCurrentStep(3);
  };

  const handleBiometricScan = () => {
    alert('Scanning fingerprint scanner device...');
    setTimeout(() => {
      setBiometricScanned(true);
      alert('Biometric Fingerprint Match: 99.4% Authenticated!');
      setCurrentStep(4);
    }, 1000);
  };

  const handleFinalApproval = () => {
    alert('eKYC Process Completed and Digitally Signed! Proceeding to Registry & Mutation...');
    navigate('/authority/registry');
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="authority" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            eKYC Verification
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Verify identity through Aadhaar authentication
          </p>
        </header>

        {/* eKYC Process Steps */}
        <section className="mb-10 p-6 rounded-xl bg-[#E6DEDA] border border-[#D3CCC8] shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#047857] text-white font-bold text-xs flex items-center justify-center">
                ✓
              </div>
              <span className="text-xs font-semibold text-[#2B1B14]">Documents Verified</span>
            </div>
            <div className="hidden sm:block flex-1 h-0.5 bg-[#D3CCC8]" />

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-[#2B1B14] text-[#F8F2F0]' : 'bg-[#D3CCC8] text-[#6E5D53]'
                }`}
              >
                2
              </div>
              <span className="text-xs font-semibold text-[#2B1B14]">Aadhaar Authentication</span>
            </div>
            <div className="hidden sm:block flex-1 h-0.5 bg-[#D3CCC8]" />

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-[#2B1B14] text-[#F8F2F0]' : 'bg-[#D3CCC8] text-[#6E5D53]'
                }`}
              >
                3
              </div>
              <span className="text-xs font-semibold text-[#2B1B14]">Biometric Verification</span>
            </div>
            <div className="hidden sm:block flex-1 h-0.5 bg-[#D3CCC8]" />

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center ${
                  currentStep >= 4 ? 'bg-[#047857] text-white' : 'bg-[#D3CCC8] text-[#6E5D53]'
                }`}
              >
                4
              </div>
              <span className="text-xs font-semibold text-[#2B1B14]">Final Approval</span>
            </div>
          </div>
        </section>

        {/* eKYC Interface */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Left Column: Applicant & Seller Data */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Applicant Details</h3>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                <div className="w-24 h-24 rounded-xl bg-[#2B1B14] flex items-center justify-center text-[#F8F2F0] text-2xl font-bold shrink-0 shadow-sm">
                  SK
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-[#2B1B14] text-base">Suresh Kumar Singh</h4>
                  <p className="text-xs text-[#6E5D53]">Application #2024-0234</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t border-[#D3CCC8]">
                <div>
                  <span className="text-[#6E5D53]">Aadhaar:</span>
                  <p className="font-bold text-[#2B1B14]">XXXX-XXXX-3456</p>
                </div>
                <div>
                  <span className="text-[#6E5D53]">Mobile:</span>
                  <p className="font-bold text-[#2B1B14]">+91 98765 43211</p>
                </div>
                <div>
                  <span className="text-[#6E5D53]">Email:</span>
                  <p className="font-bold text-[#2B1B14]">suresh.k@example.com</p>
                </div>
                <div>
                  <span className="text-[#6E5D53]">DOB:</span>
                  <p className="font-bold text-[#2B1B14]">15-Mar-1985</p>
                </div>
              </div>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-4">Seller Details</h3>
              <div className="text-xs flex flex-col gap-2">
                <h4 className="font-bold text-[#2B1B14] text-sm">Ram Kumar Singh</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-[#6E5D53]">Aadhaar:</span>
                    <p className="font-bold text-[#2B1B14]">XXXX-XXXX-7890</p>
                  </div>
                  <div>
                    <span className="text-[#6E5D53]">Status:</span>
                    <p className="font-bold text-[#047857]">Biometric Registered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interaction Controls */}
          <div className="flex flex-col gap-6">
            {/* Step 2: Aadhaar OTP */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">
                1. Aadhaar OTP Authentication
              </h3>
              <p className="text-xs text-[#6E5D53] mb-4">
                Trigger Aadhaar OTP for instant verification via UIDAI gateway
              </p>
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  className="py-2.5 px-5 bg-[#2B1B14] text-[#F8F2F0] font-bold text-xs rounded-lg shadow hover:bg-[#2B1B14]/90 transition-all"
                >
                  Send Aadhaar OTP
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      value={otpVal}
                      onChange={(e) => setOtpVal(e.target.value)}
                      className="p-2.5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] text-xs flex-1 focus:outline-none focus:border-[#2B1B14]"
                    />
                    <button
                      onClick={handleVerifyOtp}
                      className="py-2.5 px-4 bg-[#047857] text-white font-bold text-xs rounded-lg shadow hover:bg-[#065F46]"
                    >
                      Verify OTP
                    </button>
                  </div>
                  <span className="text-[0.7rem] text-[#047857] font-semibold">✓ OTP Sent to +91 98765 43211</span>
                </div>
              )}
            </div>

            {/* Step 3: Biometric Scan */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">
                2. Live Biometric Fingerprint / Iris Scan
              </h3>
              <p className="text-xs text-[#6E5D53] mb-4">
                Connect UIDAI approved scanner device for live biometric capture
              </p>
              <button
                onClick={handleBiometricScan}
                className="py-2.5 px-5 bg-[#F8F2F0] border border-[#D3CCC8] text-[#2B1B14] font-semibold text-xs rounded-lg hover:bg-[#D3CCC8]/40 transition-colors"
              >
                {biometricScanned ? '✓ Biometrics Authenticated' : 'Initialize Biometric Scanner'}
              </button>
            </div>

            {/* Step 4: Final Signoff */}
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">
                3. Officer Authorization & Digital Signoff
              </h3>
              <p className="text-xs text-[#6E5D53] mb-4">
                Approve verified applicant and commit biometric attestation token
              </p>
              <button
                onClick={handleFinalApproval}
                className="w-full py-3 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#2B1B14]/90 transition-all"
              >
                Authorize eKYC & Proceed to Mutation
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
