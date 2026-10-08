// Status definitions and metadata
// Provisional statuses per Assumption A8 (WORKFLOWS.md not yet finalized in docs)

export const APPLICATION_STATUSES = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_VERIFICATION: 'UNDER_VERIFICATION',
  APPROVED: 'APPROVED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  RESUBMISSION: 'RESUBMISSION',
  FAILED: 'FAILED',
};

export const BLOCKCHAIN_STATUSES = {
  SUBMITTED: 'SUBMITTED',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SYNCED: 'SYNCED',
  SYNC_FAILED: 'SYNC_FAILED',
  FAILED: 'FAILED',
};

export const KYC_STATUSES = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  FAILED: 'FAILED',
};

export const PAYMENT_STATUSES = {
  INITIATED: 'INITIATED',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
};

export const DOCUMENT_TYPES = {
  SALE_DEED: 'SALE_DEED',
  IDENTITY_PROOF: 'IDENTITY_PROOF',
  LAND_MAP: 'LAND_MAP',
  ENCUMBRANCE_CERT: 'ENCUMBRANCE_CERT',
  TAX_RECEIPT: 'TAX_RECEIPT',
  E_REGISTRY: 'E_REGISTRY',
};

export const DOCUMENT_TYPE_LABELS = {
  SALE_DEED: 'Sale Deed Agreement',
  IDENTITY_PROOF: 'Identity Proof (Aadhaar / Passport)',
  LAND_MAP: 'Land Map & Boundaries',
  ENCUMBRANCE_CERT: 'Non-Encumbrance Certificate',
  TAX_RECEIPT: 'Tax Clearance Receipt',
  E_REGISTRY: 'Digital E-Registry Certificate',
};

export const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  REGISTRAR: 'REGISTRAR',
  GOVERNMENT_HQ: 'GOVERNMENT_HQ',
};

// Styling variant mapping to the design system:
// success: bg-[#10B981]/15 text-[#047857] border-[#10B981]/30
// warning: bg-[#F59E0B]/15 text-[#B45309] border-[#F59E0B]/30
// error: bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/30
// info: bg-[#2563EB]/15 text-[#2563EB] border-[#2563EB]/30
// neutral: bg-[#D3CCC8]/50 text-[#6E5D53] border-[#D3CCC8]

export const STATUS_PILL_STYLES = {
  success: 'bg-[#10B981]/15 text-[#047857] border border-[#10B981]/30',
  warning: 'bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30',
  error: 'bg-[#DC2626]/15 text-[#DC2626] border border-[#DC2626]/30',
  info: 'bg-[#2563EB]/15 text-[#2563EB] border border-[#2563EB]/30',
  neutral: 'bg-[#D3CCC8]/50 text-[#6E5D53] border border-[#D3CCC8]',
};

export function getApplicationStatusMeta(status) {
  switch (status) {
    case APPLICATION_STATUSES.DRAFT:
      return { label: 'Draft', variant: 'neutral' };
    case APPLICATION_STATUSES.SUBMITTED:
      return { label: 'Submitted', variant: 'info' };
    case APPLICATION_STATUSES.UNDER_VERIFICATION:
      return { label: 'Under Verification', variant: 'warning' };
    case APPLICATION_STATUSES.APPROVED:
      return { label: 'Approved', variant: 'info' };
    case APPLICATION_STATUSES.PROCESSING:
      return { label: 'Processing', variant: 'info' };
    case APPLICATION_STATUSES.COMPLETED:
      return { label: 'Completed', variant: 'success' };
    case APPLICATION_STATUSES.REJECTED:
      return { label: 'Rejected', variant: 'error' };
    case APPLICATION_STATUSES.RESUBMISSION:
      return { label: 'Resubmission Requested', variant: 'warning' };
    case APPLICATION_STATUSES.FAILED:
      return { label: 'Failed', variant: 'error' };
    default:
      return { label: status || 'Unknown', variant: 'neutral' };
  }
}

export function getTransactionStatusMeta(status) {
  switch (status) {
    case BLOCKCHAIN_STATUSES.SUBMITTED:
      return { label: 'Tx Submitted', variant: 'info' };
    case BLOCKCHAIN_STATUSES.PENDING:
      return { label: 'Waiting for Confirmation', variant: 'warning' };
    case BLOCKCHAIN_STATUSES.CONFIRMED:
      return { label: 'Confirmed', variant: 'info' };
    case BLOCKCHAIN_STATUSES.SYNCED:
      return { label: 'Synchronized', variant: 'success' };
    case BLOCKCHAIN_STATUSES.SYNC_FAILED:
      return { label: 'Sync Failed', variant: 'error' };
    case BLOCKCHAIN_STATUSES.FAILED:
      return { label: 'Transaction Failed', variant: 'error' };
    default:
      return { label: status || 'Not Started', variant: 'neutral' };
  }
}

export function getKycStatusMeta(status) {
  switch (status) {
    case KYC_STATUSES.VERIFIED:
      return { label: 'KYC Verified', variant: 'success' };
    case KYC_STATUSES.FAILED:
      return { label: 'KYC Failed', variant: 'error' };
    case KYC_STATUSES.PENDING:
    default:
      return { label: 'KYC Pending', variant: 'warning' };
  }
}

export function getPaymentStatusMeta(status) {
  switch (status) {
    case PAYMENT_STATUSES.SUCCESSFUL:
      return { label: 'Payment Successful', variant: 'success' };
    case PAYMENT_STATUSES.FAILED:
      return { label: 'Payment Failed', variant: 'error' };
    case PAYMENT_STATUSES.INITIATED:
    default:
      return { label: 'Payment Initiated', variant: 'warning' };
  }
}
