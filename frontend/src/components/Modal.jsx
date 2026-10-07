import React, { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-3 sm:p-4 bg-[#2B1B14]/50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-[540px] max-h-[90vh] flex flex-col bg-[#E6DEDA] border border-[#D3CCC8] rounded-[20px] shadow-[0_20px_60px_rgba(43,27,20,0.12)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#D3CCC8] bg-[#F8F2F0]/70 shrink-0">
          <h3 id="modal-title" className="text-base sm:text-lg font-bold text-[#2B1B14]">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6E5D53] hover:text-[#2B1B14] hover:bg-[#D3CCC8]/50 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-4 sm:p-6 text-[#2B1B14] overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2.5 p-3 sm:p-4 border-t border-[#D3CCC8] bg-[#F8F2F0]/50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
