import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'under_verification', label: 'Under Verification' },
  { id: 'approved', label: 'Approved' },
  { id: 'blockchain_pending', label: 'Blockchain Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'synchronizing', label: 'Synchronizing' },
  { id: 'completed', label: 'Completed' },
];

function deriveState(applicationStatus, blockchainStatus) {
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

  return { currentStepIndex, isFailed, failureMessage };
}

function StepCircle({ idx, isCompleted, isCurrent, isStepError, size = 'md' }) {
  const dim = size === 'md' ? 'h-9 w-9 text-xs' : 'h-7 w-7 text-[0.7rem]';
  const icon = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full border-2 font-bold transition-colors',
        dim,
        isStepError
          ? 'border-destructive bg-destructive text-destructive-foreground'
          : isCompleted
          ? 'border-success bg-success text-primary-foreground'
          : isCurrent
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground'
      )}
      aria-current={isCurrent ? 'step' : undefined}
    >
      {isCurrent && !isStepError && (
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary/30" aria-hidden="true" />
      )}
      {isStepError ? (
        <X className={icon} aria-hidden="true" />
      ) : isCompleted ? (
        <Check className={icon} strokeWidth={3} aria-hidden="true" />
      ) : isCurrent ? (
        <span className="relative h-2.5 w-2.5 rounded-full bg-primary-foreground" aria-hidden="true">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary-foreground/80" />
        </span>
      ) : (
        <span className="relative">{idx + 1}</span>
      )}
    </motion.div>
  );
}

function Connector({ filled, failed, vertical, idx }) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-border',
        vertical ? 'ml-[13px] h-6 w-0.5' : 'mx-2 mt-[17px] h-0.5 flex-1'
      )}
      aria-hidden="true"
    >
      <motion.div
        initial={reduce ? false : vertical ? { scaleY: 0 } : { scaleX: 0 }}
        animate={filled ? { scaleX: 1, scaleY: 1 } : vertical ? { scaleY: 0 } : { scaleX: 0 }}
        transition={{ duration: 0.45, delay: 0.1 + idx * 0.08, ease: 'easeOut' }}
        style={{ transformOrigin: vertical ? 'top' : 'left' }}
        className={cn('absolute inset-0 rounded-full', failed ? 'bg-destructive' : 'bg-success')}
      />
    </div>
  );
}

export default function MutationStepper({
  applicationStatus = 'SUBMITTED',
  blockchainStatus = null,
  className = '',
}) {
  const { currentStepIndex, isFailed, failureMessage } = deriveState(applicationStatus, blockchainStatus);

  const flags = (idx) => {
    const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && applicationStatus === 'COMPLETED');
    const isCurrent = idx === currentStepIndex && applicationStatus !== 'COMPLETED';
    const isStepError = isCurrent && isFailed;
    return { isCompleted, isCurrent, isStepError };
  };

  const labelClass = ({ isCompleted, isCurrent, isStepError }) =>
    cn(
      'leading-tight',
      isStepError
        ? 'font-bold text-destructive'
        : isCompleted
        ? 'font-semibold text-success-foreground'
        : isCurrent
        ? 'font-bold text-foreground'
        : 'text-muted-foreground'
    );

  return (
    <div className={cn('w-full rounded-xl border bg-card p-4 shadow-sm sm:p-6', className)}>
      {/* Desktop: horizontal */}
      <ol className="relative hidden items-start md:flex" aria-label="Mutation workflow progress">
        {STEPS.map((step, idx) => {
          const f = flags(idx);
          return (
            <React.Fragment key={step.id}>
              <li className="z-10 flex max-w-[110px] flex-col items-center text-center">
                <StepCircle idx={idx} {...f} />
                <span className={cn('mt-2 text-[0.72rem]', labelClass(f))}>{step.label}</span>
                {f.isStepError && failureMessage && (
                  <span className="mt-0.5 text-[0.62rem] leading-none text-destructive">{failureMessage}</span>
                )}
              </li>
              {idx < STEPS.length - 1 && (
                <Connector
                  idx={idx}
                  filled={idx < currentStepIndex}
                  failed={isFailed && idx === currentStepIndex - 1}
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>

      {/* Mobile: vertical */}
      <ol className="flex flex-col md:hidden" aria-label="Mutation workflow progress">
        {STEPS.map((step, idx) => {
          const f = flags(idx);
          return (
            <li key={step.id} className="flex flex-col">
              <div className="flex items-center gap-3">
                <StepCircle idx={idx} size="sm" {...f} />
                <div className="flex flex-col">
                  <span className={cn('text-xs', labelClass(f))}>{step.label}</span>
                  {f.isStepError && failureMessage && (
                    <span className="mt-0.5 text-[0.68rem] font-medium text-destructive">{failureMessage}</span>
                  )}
                </div>
              </div>
              {idx < STEPS.length - 1 && (
                <Connector
                  vertical
                  idx={idx}
                  filled={idx < currentStepIndex}
                  failed={isFailed && idx === currentStepIndex - 1}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
