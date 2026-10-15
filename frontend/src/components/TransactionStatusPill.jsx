import React from 'react';
import { CheckCircle2, Clock, XCircle, Info, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  getApplicationStatusMeta,
  getTransactionStatusMeta,
  getKycStatusMeta,
  getPaymentStatusMeta,
} from '../utils/statuses';

const VARIANT_ICON = {
  success: CheckCircle2,
  warning: Clock,
  error: XCircle,
  info: Info,
  neutral: Circle,
};

export default function TransactionStatusPill({ status, type = 'application', className = '', showIcon = true }) {
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

  const Icon = VARIANT_ICON[meta.variant] || Circle;
  const pulsing = meta.variant === 'warning' && type === 'blockchain';

  return (
    <Badge variant={meta.variant} className={cn('whitespace-nowrap font-bold', className)}>
      {showIcon && (
        <Icon className={cn('h-3 w-3', pulsing && 'animate-pulse')} aria-hidden="true" />
      )}
      {meta.label}
    </Badge>
  );
}
