import React, { useState } from 'react';
import { getStates, getDistricts, getTehsils } from '../api/mock/locations';

export default function VerifyLandForm({ onVerify, isLoading = false, onReset }) {
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Lucknow');
  const [tehsil, setTehsil] = useState('Lucknow Sadar');
  const [village, setVillage] = useState('');
  const [khasraNumber, setKhasraNumber] = useState('');
  const [error, setError] = useState('');

  const states = getStates();
  const districts = getDistricts(state);
  const tehsils = getTehsils(state, district);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setState(newState);
    const newDistricts = getDistricts(newState);
    setDistrict(newDistricts[0] || '');
    const newTehsils = getTehsils(newState, newDistricts[0] || '');
    setTehsil(newTehsils[0] || '');
  };

  const handleDistrictChange = (e) => {
    const newDist = e.target.value;
    setDistrict(newDist);
    const newTehsils = getTehsils(state, newDist);
    setTehsil(newTehsils[0] || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!village.trim() || !khasraNumber.trim()) {
      setError('Please provide Village and Khasra Number.');
      return;
    }

    onVerify({
      state,
      district,
      tehsil,
      village: village.trim(),
      khasraNumber: khasraNumber.trim(),
    });
  };

  const handleResetForm = () => {
    setVillage('');
    setKhasraNumber('');
    setError('');
    if (onReset) onReset();
  };

  return (
    <div className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#2B1B14]">Land Verification Form</h2>
        <p className="text-sm text-[#6E5D53] mt-1">
          Verify land records directly against synchronized blockchain state
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="state" className="text-xs font-medium text-[#2B1B14]">
              State *
            </label>
            <select
              id="state"
              value={state}
              onChange={handleStateChange}
              required
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="district" className="text-xs font-medium text-[#2B1B14]">
              District *
            </label>
            <select
              id="district"
              value={district}
              onChange={handleDistrictChange}
              required
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
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
              value={tehsil}
              onChange={(e) => setTehsil(e.target.value)}
              required
              className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
            >
              {tehsils.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="village" className="text-xs font-medium text-[#2B1B14]">
              Village *
            </label>
            <input
              type="text"
              id="village"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g., Rampur, Shyampur"
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
            value={khasraNumber}
            onChange={(e) => setKhasraNumber(e.target.value)}
            placeholder="e.g., 123/1, 456/2"
            required
            className="p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-sm text-[#2B1B14] focus:outline-none focus:border-[#2B1B14]"
          />
          <small className="text-[0.7rem] text-[#7A6B63]">
            Khasra numbers are unique within a village revenue boundary
          </small>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={handleResetForm}
            className="py-3 px-6 bg-transparent border border-[#D3CCC8] hover:border-[#2B1B14] text-sm font-semibold text-[#2B1B14] rounded-lg transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 px-6 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying Records...' : 'Verify Now'}
          </button>
        </div>
      </form>
    </div>
  );
}
