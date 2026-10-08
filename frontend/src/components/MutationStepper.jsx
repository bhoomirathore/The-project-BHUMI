import React from 'react';

const STEPS = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'under_verification', label: 'Under Verification' },
  { id: 'approved', label: 'Approved' },
  { id: 'blockchain_pending', label: 'Blockchain Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'synchronizing', label: 'Synchronizing' },
  { id: 'completed', label: 'Completed' },
];

export default function MutationStepper({
  applicationStatus = 'SUBMITTED',
  blockchainStatus = null,
  className = '',
}) {
  // Determine the active step index (0 to 6) and error state
  let currentStepIndex = 0;
  let isFailed = false;
  let failureMessage = '';

  if (applicationStatus === 'REJECTED') {
    currentStepIndex = 1;
    isFailed = true;
    failureMessage = 'Application Rejected by Registrar';
  } else if (applicationStatus === 'RESUBMISSION') {
    currentStepIndex = 1;
    isFailed = true;
    failureMessage = 'Resubmission Requested';
  } else if (blockchainStatus === 'SYNC_FAILED') {
    currentStepIndex = 5;
    isFailed = true;
    failureMessage = 'Ledger Sync Failed';
  } else if (blockchainStatus === 'FAILED') {
    currentStepIndex = 3;
    isFailed = true;
    failureMessage = 'Blockchain Transaction Failed';
  } else if (applicationStatus === 'FAILED') {
    currentStepIndex = 3;
    isFailed = true;
    failureMessage = 'Transaction Failed';
  } else if (applicationStatus === 'COMPLETED') {
    currentStepIndex = 6;
  } else if (blockchainStatus === 'SYNCED') {
    currentStepIndex = 5;
  } else if (blockchainStatus === 'CONFIRMED') {
    currentStepIndex = 4;
  } else if (blockchainStatus === 'PENDING' || blockchainStatus === 'SUBMITTED') {
    currentStepIndex = 3;
  } else if (applicationStatus === 'APPROVED' || applicationStatus === 'PROCESSING') {
    currentStepIndex = 2;
  } else if (applicationStatus === 'UNDER_VERIFICATION') {
    currentStepIndex = 1;
  } else {
    currentStepIndex = 0;
  }

  return (
    <div className={`w-full bg-[#F8F2F0] border border-[#D3CCC8] rounded-xl p-4 sm:p-6 ${className}`}>
      {/* Desktop View: Horizontal Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && applicationStatus === 'COMPLETED');
          const isCurrent = idx === currentStepIndex && applicationStatus !== 'COMPLETED';
          const isStepError = isCurrent && isFailed;

          let circleClass = 'bg-[#E6DEDA] border-2 border-[#D3CCC8] text-[#7A6B63]';
          if (isStepError) {
            circleClass = 'bg-[#DC2626] border-2 border-[#DC2626] text-white';
          } else if (isCompleted) {
            circleClass = 'bg-[#047857] border-2 border-[#047857] text-white';
          } else if (isCurrent) {
            circleClass = 'bg-[#2B1B14] border-2 border-[#2B1B14] text-[#F8F2F0] ring-4 ring-[#2B1B14]/10';
          }

          let labelColor = 'text-[#7A6B63]';
          if (isStepError) {
            labelColor = 'text-[#DC2626] font-bold';
          } else if (isCompleted) {
            labelColor = 'text-[#047857] font-semibold';
          } else if (isCurrent) {
            labelColor = 'text-[#2B1B14] font-bold';
          }

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center z-10 max-w-[100px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${circleClass}`}
                >
                  {isStepError ? '✕' : isCompleted ? '✓' : idx + 1}
                </div>
                <span className={`text-[0.72rem] mt-2 leading-tight ${labelColor}`}>
                  {step.label}
                </span>
                {isStepError && failureMessage && (
                  <span className="text-[0.62rem] text-[#DC2626] mt-0.5 leading-none">
                    {failureMessage}
                  </span>
                )}
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 -mt-5 transition-colors ${
                    idx < currentStepIndex
                      ? isFailed && idx === currentStepIndex - 1
                        ? 'bg-[#DC2626]'
                        : 'bg-[#047857]'
                      : 'bg-[#D3CCC8]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile View: Vertical Stepper */}
      <div className="flex md:hidden flex-col gap-3">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && applicationStatus === 'COMPLETED');
          const isCurrent = idx === currentStepIndex && applicationStatus !== 'COMPLETED';
          const isStepError = isCurrent && isFailed;

          let circleClass = 'bg-[#E6DEDA] border border-[#D3CCC8] text-[#7A6B63]';
          if (isStepError) {
            circleClass = 'bg-[#DC2626] text-white';
          } else if (isCompleted) {
            circleClass = 'bg-[#047857] text-white';
          } else if (isCurrent) {
            circleClass = 'bg-[#2B1B14] text-[#F8F2F0]';
          }

          return (
            <div key={step.id} className="flex items-start gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold shrink-0 mt-0.5 ${circleClass}`}
              >
                {isStepError ? '✕' : isCompleted ? '✓' : idx + 1}
              </div>
              <div className="flex flex-col">
                <span
                  className={`text-xs ${
                    isStepError
                      ? 'text-[#DC2626] font-bold'
                      : isCompleted
                      ? 'text-[#047857] font-semibold'
                      : isCurrent
                      ? 'text-[#2B1B14] font-bold'
                      : 'text-[#7A6B63]'
                  }`}
                >
                  {step.label}
                </span>
                {isStepError && failureMessage && (
                  <span className="text-[0.68rem] text-[#DC2626] mt-0.5 font-medium">
                    {failureMessage}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
