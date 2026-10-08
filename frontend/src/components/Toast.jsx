import React, { useEffect } from 'react';

export default function Toast({
  message,
  type = 'info',
  onClose,
  duration = 4000,
}) {
  useEffect(() => {
    if (!message || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  if (!message) return null;

  let bgBorderClass = 'bg-[#E6DEDA] border-[#D3CCC8] text-[#2B1B14]';
  if (type === 'success') {
    bgBorderClass = 'bg-[#10B981]/15 border-[#10B981]/30 text-[#047857]';
  } else if (type === 'error') {
    bgBorderClass = 'bg-[#DC2626]/15 border-[#DC2626]/30 text-[#DC2626]';
  } else if (type === 'warning') {
    bgBorderClass = 'bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#B45309]';
  } else if (type === 'info') {
    bgBorderClass = 'bg-[#2563EB]/15 border-[#2563EB]/30 text-[#2563EB]';
  }

  return (
    <div className="fixed bottom-5 right-5 z-[1200] max-w-sm w-full animate-fade-in">
      <div
        className={`flex items-center justify-between p-3.5 rounded-xl border shadow-lg backdrop-blur-sm ${bgBorderClass}`}
      >
        <span className="text-xs sm:text-sm font-semibold">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close notification"
            className="ml-3 text-lg leading-none opacity-60 hover:opacity-100 transition-opacity"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
