import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function CitizenVerifyLand() {
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    tehsil: '',
    village: '',
    khasra: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleReset = () => {
    setFormData({ state: '', district: '', tehsil: '', village: '', khasra: '' });
    setResult(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.state || !formData.district || !formData.tehsil || !formData.village || !formData.khasra) {
      alert('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setResult({
        ...formData,
        id: '#VER-2024-001234',
        ownerName: 'Rajesh Kumar Singh',
        fatherName: 'Ram Kumar Singh',
        ownershipType: 'Individual',
        acquisitionDate: '15-Mar-2020',
        registryNumber: 'REG/2020/5678',
        area: '2,500 sq. ft',
        landType: 'Residential',
        irrigation: 'Not Applicable',
        landUse: 'Construction',
        marketValue: '₹45,00,000',
        registryStatus: 'Verified',
        mutationStatus: 'Completed',
        encumbrance: 'Clear',
        lastUpdated: '10-Jan-2024',
        blockchainHash: '0x7a8f...92e4',
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
              Verify Land Ownership
            </h1>
            <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">Check land ownership details using Khasra number</p>
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

        {/* Verification Form Section */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mb-10">
          <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#2B1B14]">Land Verification Form</h2>
              <p className="text-sm text-[#6E5D53] mt-1">Enter the details below to verify land ownership</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="state" className="text-xs font-medium text-[#2B1B14]">
                    State *
                  </label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
                  >
                    <option value="">Select State</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Punjab">Punjab</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="district" className="text-xs font-medium text-[#2B1B14]">
                    District *
                  </label>
                  <select
                    id="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
                  >
                    <option value="">Select District</option>
                    <option value="Lucknow">Lucknow</option>
                    <option value="Kanpur">Kanpur</option>
                    <option value="Agra">Agra</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tehsil" className="text-xs font-medium text-[#2B1B14]">
                    Tehsil *
                  </label>
                  <select
                    id="tehsil"
                    value={formData.tehsil}
                    onChange={handleChange}
                    required
                    className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
                  >
                    <option value="">Select Tehsil</option>
                    <option value="Sadar">Sadar</option>
                    <option value="North">North</option>
                    <option value="East">East</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="village" className="text-xs font-medium text-[#2B1B14]">
                    Village *
                  </label>
                  <input
                    type="text"
                    id="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Enter Village Name"
                    required
                    className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="khasra" className="text-xs font-medium text-[#2B1B14]">
                  Khasra Number *
                </label>
                <input
                  type="text"
                  id="khasra"
                  value={formData.khasra}
                  onChange={handleChange}
                  placeholder="e.g., 123/1, 456/2"
                  required
                  className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
                />
                <small className="text-[0.7rem] text-[#7A6B63]">
                  Enter the Khasra number as mentioned in land records
                </small>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-6 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-sm font-semibold text-[#2B1B14] rounded-lg transition-colors"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#2B1B14]/90 transition-all"
                >
                  {isLoading ? 'Verifying...' : 'Verify Now'}
                </button>
              </div>
            </form>
          </div>

          {/* Info Cards */}
          <div className="flex flex-col gap-6">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">What You'll Get</h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-[#6E5D53]">
                <li>Owner Name & Details</li>
                <li>Land Area & Boundaries</li>
                <li>Registry Status</li>
                <li>Encumbrance Details</li>
                <li>Mutation History</li>
              </ul>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-bold text-[#2B1B14] mb-3">Quick Tips</h3>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-[#6E5D53]">
                <li>Use correct Khasra format</li>
                <li>Verify village spelling</li>
                <li>Check recent records</li>
                <li>Download for reference</li>
                <li>Contact support if issues</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Result Section */}
        {result && (
          <section className="bg-[#E6DEDA] border-2 border-[#D3CCC8] rounded-2xl p-6 sm:p-8 shadow-lg mb-12 animate-fade-in">
            <div className="flex justify-between items-center pb-4 border-b border-[#D3CCC8] mb-6">
              <h2 className="text-xl font-bold text-[#2B1B14]">Verification Results</h2>
              <button
                onClick={() => setResult(null)}
                className="text-2xl text-[#6E5D53] hover:text-[#2B1B14] leading-none p-1"
              >
                &times;
              </button>
            </div>

            {/* Status Header */}
            <div className="p-5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 mb-8 flex flex-col gap-1">
              <h3 className="text-lg font-bold text-[#047857]">
                Land Record Found & Verified
              </h3>
              <p className="text-sm text-[#6E5D53]">
                The land ownership details have been successfully verified from blockchain records
              </p>
              <span className="text-xs font-mono font-bold text-[#2B1B14] mt-1">
                Verification ID: {result.id}
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#F8F2F0] p-5 rounded-xl border border-[#D3CCC8] flex flex-col gap-2">
                <h4 className="font-bold text-[#2B1B14] text-sm border-b border-[#D3CCC8] pb-2 mb-1">
                  Land Information
                </h4>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Khasra Number:</span>
                  <span className="font-bold text-[#2B1B14]">{result.khasra}</span>
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

              <div className="bg-[#F8F2F0] p-5 rounded-xl border border-[#D3CCC8] flex flex-col gap-2">
                <h4 className="font-bold text-[#2B1B14] text-sm border-b border-[#D3CCC8] pb-2 mb-1">
                  Owner Details
                </h4>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Owner Name:</span>
                  <span className="font-bold text-[#2B1B14]">{result.ownerName}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Father's Name:</span>
                  <span className="text-[#2B1B14]">{result.fatherName}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Ownership Type:</span>
                  <span className="text-[#2B1B14]">{result.ownershipType}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Acquisition Date:</span>
                  <span className="text-[#2B1B14]">{result.acquisitionDate}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Registry Number:</span>
                  <span className="text-[#2B1B14]">{result.registryNumber}</span>
                </div>
              </div>

              <div className="bg-[#F8F2F0] p-5 rounded-xl border border-[#D3CCC8] flex flex-col gap-2">
                <h4 className="font-bold text-[#2B1B14] text-sm border-b border-[#D3CCC8] pb-2 mb-1">
                  Land Specifications
                </h4>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Total Area:</span>
                  <span className="text-[#2B1B14]">{result.area}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Land Type:</span>
                  <span className="text-[#2B1B14]">{result.landType}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Irrigation:</span>
                  <span className="text-[#2B1B14]">{result.irrigation}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Land Use:</span>
                  <span className="text-[#2B1B14]">{result.landUse}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Market Value:</span>
                  <span className="font-bold text-[#2B1B14]">{result.marketValue}</span>
                </div>
              </div>

              <div className="bg-[#F8F2F0] p-5 rounded-xl border border-[#D3CCC8] flex flex-col gap-2">
                <h4 className="font-bold text-[#2B1B14] text-sm border-b border-[#D3CCC8] pb-2 mb-1">
                  Status & Verification
                </h4>
                <div className="text-xs flex justify-between items-center">
                  <span className="text-[#6E5D53]">Registry Status:</span>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#047857] font-bold">
                    {result.registryStatus}
                  </span>
                </div>
                <div className="text-xs flex justify-between items-center">
                  <span className="text-[#6E5D53]">Mutation Status:</span>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#047857] font-bold">
                    {result.mutationStatus}
                  </span>
                </div>
                <div className="text-xs flex justify-between items-center">
                  <span className="text-[#6E5D53]">Encumbrance:</span>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#047857] font-bold">
                    {result.encumbrance}
                  </span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Last Updated:</span>
                  <span className="text-[#2B1B14]">{result.lastUpdated}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-[#6E5D53]">Blockchain Hash:</span>
                  <span className="font-mono text-[#2B1B14] font-semibold">{result.blockchainHash}</span>
                </div>
              </div>
            </div>

            {/* Mutation History Timeline */}
            <div className="p-6 rounded-xl bg-[#F8F2F0] border border-[#D3CCC8] mb-8">
              <h4 className="font-bold text-[#2B1B14] text-sm mb-4">Mutation History</h4>
              <div className="flex flex-col gap-4 border-l-2 border-[#D3CCC8] ml-2 pl-4">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#047857]" />
                  <h5 className="font-bold text-sm text-[#2B1B14]">Registry Completed</h5>
                  <p className="text-xs text-[#6E5D53]">Land registered in the name of Rajesh Kumar Singh</p>
                  <span className="text-[0.68rem] text-[#7A6B63]">15-Mar-2020</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#047857]" />
                  <h5 className="font-bold text-sm text-[#2B1B14]">Mutation Approved</h5>
                  <p className="text-xs text-[#6E5D53]">Mutation entry updated in revenue records</p>
                  <span className="text-[0.68rem] text-[#7A6B63]">22-Mar-2020</span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#047857]" />
                  <h5 className="font-bold text-sm text-[#2B1B14]">Blockchain Entry</h5>
                  <p className="text-xs text-[#6E5D53]">Record added to blockchain for immutability</p>
                  <span className="text-[0.68rem] text-[#7A6B63]">25-Mar-2020</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => alert('Downloading comprehensive verification report as PDF...')}
                className="py-3 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#2B1B14]/90"
              >
                Download Full Report
              </button>
              <button
                onClick={() => window.print()}
                className="py-3 px-6 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-sm font-semibold rounded-lg"
              >
                Print Report
              </button>
              <button
                onClick={() => alert('Share options will appear here')}
                className="py-3 px-6 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-sm font-semibold rounded-lg"
              >
                Share Report
              </button>
              <button
                onClick={handleReset}
                className="py-3 px-6 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-sm font-semibold rounded-lg"
              >
                Verify Another
              </button>
            </div>
          </section>
        )}

        {/* Recent Verifications */}
        <section>
          <h2 className="text-xl font-bold text-[#2B1B14] mb-5">Recent Verifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#D3CCC8] text-[#2B1B14]">
                    123/1
                  </span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857]">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#6E5D53]">Village Rampur, Tehsil Sadar</p>
                <p className="text-xs text-[#6E5D53] mt-1">Owner: Rajesh Kumar Singh</p>
                <p className="text-[0.68rem] text-[#7A6B63] mt-1">Verified: 2 days ago</p>
              </div>
              <button
                onClick={() => alert('Viewing details for Khasra No. 123/1')}
                className="mt-4 w-full py-2 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-bold rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#D3CCC8] text-[#2B1B14]">
                    456/2
                  </span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#10B981]/15 text-[#047857]">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-[#6E5D53]">Village Shyampur, Tehsil North</p>
                <p className="text-xs text-[#6E5D53] mt-1">Owner: Priya Sharma</p>
                <p className="text-[0.68rem] text-[#7A6B63] mt-1">Verified: 5 days ago</p>
              </div>
              <button
                onClick={() => alert('Viewing details for Khasra No. 456/2')}
                className="mt-4 w-full py-2 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-bold rounded-lg transition-colors"
              >
                View Details
              </button>
            </div>

            <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#D3CCC8] text-[#2B1B14]">
                    789/3
                  </span>
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#F59E0B]/15 text-[#B45309]">
                    Pending
                  </span>
                </div>
                <p className="text-xs text-[#6E5D53]">Village Greenfield, Tehsil East</p>
                <p className="text-xs text-[#6E5D53] mt-1">Owner: Verification in progress</p>
                <p className="text-[0.68rem] text-[#7A6B63] mt-1">Requested: 1 week ago</p>
              </div>
              <button
                onClick={() => alert('Viewing status for Khasra No. 789/3')}
                className="mt-4 w-full py-2 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-[#2B1B14] text-xs font-bold rounded-lg transition-colors"
              >
                View Status
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
