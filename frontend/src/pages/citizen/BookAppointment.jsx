import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import applicationService from '../../services/applicationService';
import appointmentService from '../../services/appointmentService';

export default function CitizenBookAppointment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedAppId = searchParams.get('applicationId');

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(preSelectedAppId || '');
  const [sroOffice, setSroOffice] = useState('Lucknow Sadar Sub-Registrar Office');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const offices = appointmentService.getOffices();
  const slots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];

  useEffect(() => {
    async function loadApps() {
      if (user?.id) {
        try {
          const list = await applicationService.getUserApplications(user.id);
          setApplications(list);
          if (preSelectedAppId && list.some((a) => a.id === preSelectedAppId)) {
            setSelectedAppId(preSelectedAppId);
          } else if (list.length > 0 && !selectedAppId) {
            setSelectedAppId(list[0].id);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    }
    loadApps();
  }, [user, preSelectedAppId]);

  const selectedApp = applications.find((a) => a.id === selectedAppId);
  const existingAppointment = selectedApp?.appointment;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedAppId) {
      setErrorMsg('Please select a transfer application.');
      return;
    }

    if (!date) {
      setErrorMsg('Please select an appointment date.');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentService.bookAppointment(selectedAppId, {
        office: sroOffice,
        date,
        slot: selectedSlot,
      });

      // Update in local state
      setApplications((prev) =>
        prev.map((a) =>
          a.id === selectedAppId
            ? { ...a, appointment: { office: sroOffice, date, slot: selectedSlot } }
            : a
        )
      );

      setSuccessMsg('Appointment booked successfully! Your Sub-Registrar slot has been confirmed.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F2F0] text-[#2B1B14] flex">
      <Sidebar portal="citizen" />

      <main className="flex-1 md:ml-[280px] p-4 sm:p-6 md:p-8 lg:p-10 pt-16 md:pt-8 max-w-full overflow-x-hidden">
        <header className="pb-6 sm:pb-8 border-b border-[#D3CCC8] mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#2B1B14]">
            Book Sub-Registrar Appointment
          </h1>
          <p className="text-[#6E5D53] text-xs sm:text-sm mt-1">
            Schedule an in-person physical deed verification slot with the local Sub-Registrar Office
          </p>
        </header>

        {successMsg && (
          <div className="mb-6 max-w-[800px] p-4 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#047857] text-xs font-semibold animate-fade-in flex justify-between items-center">
            <span>{successMsg}</span>
            <button
              onClick={() => navigate(`/citizen/applications/${selectedAppId}`)}
              className="py-1 px-3 bg-[#047857] text-white rounded text-xs ml-4"
            >
              View Application &rarr;
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 max-w-[800px] p-4 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#DC2626] text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <section className="bg-[#E6DEDA] border border-[#D3CCC8] rounded-xl p-6 sm:p-8 max-w-[800px] shadow-sm">
          {loading ? (
            <div className="p-6 text-center text-xs text-[#6E5D53]">Loading your applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-xs text-[#6E5D53]">
              <p>You have no active transfer applications to schedule an appointment for.</p>
              <button
                onClick={() => navigate('/citizen/new-transfer')}
                className="mt-4 py-2 px-4 bg-[#2B1B14] text-white text-xs font-bold rounded-lg"
              >
                Create Transfer Application &rarr;
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Application Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#2B1B14]">
                  Select Application *
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => {
                    setSelectedAppId(e.target.value);
                    setSuccessMsg('');
                    setErrorMsg('');
                  }}
                  className="w-full p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] text-sm focus:outline-none focus:border-[#2B1B14]"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.id} · Parcel {app.propertyId} ({app.applicationStatus})
                      {app.appointment ? ' [Appointment Booked]' : ' [Pending Slot]'}
                    </option>
                  ))}
                </select>
              </div>

              {/* If already has appointment, show read-only */}
              {existingAppointment ? (
                <div className="p-5 bg-[#F8F2F0] rounded-xl border border-[#D3CCC8] flex flex-col gap-3">
                  <div className="flex justify-between items-center pb-2 border-b border-[#D3CCC8]">
                    <span className="font-bold text-sm text-[#2B1B14]">
                      Appointment Already Scheduled
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30">
                      Confirmed Slot
                    </span>
                  </div>
                  <div className="text-xs text-[#6E5D53] flex flex-col gap-1.5">
                    <p>
                      <strong className="text-[#2B1B14]">Office:</strong> {existingAppointment.office}
                    </p>
                    <p>
                      <strong className="text-[#2B1B14]">Date:</strong> {existingAppointment.date}
                    </p>
                    <p>
                      <strong className="text-[#2B1B14]">Time Slot:</strong> {existingAppointment.slot}
                    </p>
                  </div>
                  <p className="text-[0.72rem] text-[#7A6B63] mt-1">
                    Each application supports one official Sub-Registrar appointment. To review the case, navigate to application details.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/citizen/applications/${selectedAppId}`)}
                    className="self-start mt-2 py-2 px-4 bg-[#2B1B14] text-[#F8F2F0] text-xs font-bold rounded-lg shadow"
                  >
                    View Application Detail &rarr;
                  </button>
                </div>
              ) : (
                <>
                  {/* Office select */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#2B1B14]">
                      Sub-Registrar Office *
                    </label>
                    <select
                      value={sroOffice}
                      onChange={(e) => setSroOffice(e.target.value)}
                      className="w-full p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] text-sm focus:outline-none focus:border-[#2B1B14]"
                    >
                      {offices.map((off) => (
                        <option key={off} value={off}>
                          {off}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Appointment Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#2B1B14]">
                      Appointment Date *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min="2026-01-01"
                      required
                      className="w-full p-3 bg-[#F8F2F0] border border-[#D3CCC8] rounded-lg text-[#2B1B14] text-sm focus:outline-none focus:border-[#2B1B14]"
                    />
                  </div>

                  {/* Time Slots */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-[#2B1B14]">
                      Available Time Slots *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-3 rounded-lg border text-xs sm:text-sm font-semibold transition-all text-center ${
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
                    disabled={submitting}
                    className="mt-2 p-3.5 bg-[#2B1B14] text-[#F8F2F0] font-bold text-sm rounded-lg shadow hover:bg-[#3D281F] transition-all disabled:opacity-50"
                  >
                    {submitting ? 'Booking Slot...' : 'Confirm Appointment'}
                  </button>
                </>
              )}
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
