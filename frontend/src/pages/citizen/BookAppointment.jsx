import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export default function CitizenBookAppointment() {
  const navigate = useNavigate();
  const [sroOffice, setSroOffice] = useState('SRO Haveli 1 - Pune Sadar');
  const [serviceType, setServiceType] = useState('Deed Registration & Biometric Signoff');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');

  const slots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Appointment Slot Booked Successfully! Notification sent.');
    navigate('/citizen/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            Book Sub-Registrar Slot
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Schedule your physical deed registration appointment
          </p>
        </header>

        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-8 max-w-[800px] shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#2B1B14]">
                Sub-Registrar Office
              </label>
              <select
                value={sroOffice}
                onChange={(e) => setSroOffice(e.target.value)}
                className="w-full p-3.5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] text-sm focus:outline-none focus:border-[#2B1B14]"
              >
                <option value="SRO Haveli 1 - Pune Sadar">SRO Haveli 1 - Pune Sadar</option>
                <option value="SRO Mulshi - Paud">SRO Mulshi - Paud</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#2B1B14]">
                Service Type
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full p-3.5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] text-sm focus:outline-none focus:border-[#2B1B14]"
              >
                <option value="Deed Registration & Biometric Signoff">
                  Deed Registration & Biometric Signoff
                </option>
                <option value="Mutation Claim Submission">Mutation Claim Submission</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#2B1B14]">
                Appointment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-3.5 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] text-sm focus:outline-none focus:border-[#2B1B14]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#2B1B14]">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-1">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer text-center ${
                      selectedSlot === slot
                        ? 'border-[#2B1B14] text-[#2B1B14] bg-[#D3CCC8] shadow-sm'
                        : 'border-[#D3CCC8] bg-[#F8F2F0] text-[#6E5D53] hover:border-[#2B1B14] hover:text-[#2B1B14]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 p-4 bg-[#2B1B14] text-[#F8F2F0] font-bold text-base rounded-[10px] shadow hover:bg-[#2B1B14]/90 transition-all"
            >
              Confirm Appointment
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
