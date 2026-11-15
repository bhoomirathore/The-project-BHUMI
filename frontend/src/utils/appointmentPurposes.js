// Appointment purposes definitions, descriptions, and required carry documents.

export const APPOINTMENT_PURPOSES = {
  TRANSFER: 'TRANSFER',
  APPLICATION_VISIT: 'APPLICATION_VISIT',
  RECORD_QUERY: 'RECORD_QUERY',
  CERTIFICATE_HELP: 'CERTIFICATE_HELP',
  OTHER: 'OTHER',
};

export const APPOINTMENT_PURPOSE_LABELS = {
  TRANSFER: 'Property transfer (sale deed)',
  APPLICATION_VISIT: 'Document verification for my application',
  RECORD_QUERY: 'Land record query or correction',
  CERTIFICATE_HELP: 'E-Registry or certificate assistance',
  OTHER: 'Other',
};

export const APPOINTMENT_PURPOSE_DESCRIPTIONS = {
  TRANSFER: 'Initiate a new property ownership transfer and book Sub-Registrar execution',
  APPLICATION_VISIT: 'Physical verification and biometric capture for an active application',
  RECORD_QUERY: 'Query cadastral records, boundaries, or seek correction assistance',
  CERTIFICATE_HELP: 'Assistance with digital E-Registry certificates or mutation deeds',
  OTHER: 'General Sub-Registrar Office inquiry or citizen service',
};

export const APPOINTMENT_DOCUMENTS_TO_CARRY = {
  TRANSFER: [
    'Original Sale Deed Agreement',
    'Original Identity Proof (Aadhaar / Passport)',
    'Revenue Survey Land Map & Boundaries',
    'Non-Encumbrance Certificate',
    'Tax Clearance Receipt',
    'Valid Government-issued Photo ID',
  ],
  APPLICATION_VISIT: [
    'Application Reference number',
    'All original uploaded documents for physical verification',
    'Valid Government-issued Photo ID',
  ],
  RECORD_QUERY: [
    'Property ID and Khasra details',
    'Existing title deed or mutation extract (if available)',
    'Valid Government-issued Photo ID',
  ],
  CERTIFICATE_HELP: [
    'Property ID or Application Reference number',
    'Valid Government-issued Photo ID',
  ],
  OTHER: [
    'Valid Government-issued Photo ID',
    'Relevant supporting documents for the visit',
  ],
};

export function getAppointmentPurposeMeta(purpose) {
  return {
    label: APPOINTMENT_PURPOSE_LABELS[purpose] || purpose || 'General Visit',
    description: APPOINTMENT_PURPOSE_DESCRIPTIONS[purpose] || '',
    documents: APPOINTMENT_DOCUMENTS_TO_CARRY[purpose] || [],
  };
}
