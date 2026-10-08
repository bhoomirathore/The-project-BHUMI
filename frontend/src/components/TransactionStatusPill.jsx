import React from 'react';
import {
  getApplicationStatusMeta,
  getTransactionStatusMeta,
  getKycStatusMeta,
  getPaymentStatusMeta,
  STATUS_PILL_STYLES,
} from '../utils/statuses';

export default function TransactionStatusPill({ status, type = 'application', className = '' }) {
  if (!status) return null;

  let meta;
  if (type === 'blockchain') {
    meta = getTransactionStatusMeta(status);
  } else if (type === 'kyc') {
    meta = getKycStatusMeta(status);
  } else if (type === 'payment') {
    meta = getPaymentStatusMeta(status);
  } else {
    meta = getApplicationStatusMeta(status);
  }

  const styleClass = STATUS_PILL_STYLES[meta.variant] || STATUS_PILL_STYLES.neutral;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full transition-colors ${styleClass} ${className}`}
    >
      {meta.label}
    </span>
  );
}
