// In-memory mock store and asynchronous handlers (approx 300ms latency)
// Flows persist in-memory until browser page reload.

import { INITIAL_USERS, INITIAL_PROPERTIES, INITIAL_APPLICATIONS } from './mockData';
import { APPLICATION_STATUSES, BLOCKCHAIN_STATUSES, KYC_STATUSES, PAYMENT_STATUSES } from '../../utils/statuses';
import { APPOINTMENT_PURPOSES } from '../../utils/appointmentPurposes';
import { getSROOffices } from './locations';

// Clone helper to prevent accidental cross-reference mutations
const deepClone = (val) => JSON.parse(JSON.stringify(val));

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const getRelativeDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  if (d.getDay() === 0) {
    d.setDate(d.getDate() + 1);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDeterministicSlotState = (office, date, slot) => {
  const str = `${office}_${date}_${slot}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  const rem = hash % 10;
  if (rem <= 1) return 'FULL';
  if (rem <= 4) return 'FEW_LEFT';
  return 'AVAILABLE';
};

class MockStore {
  constructor() {
    this.users = deepClone(INITIAL_USERS);
    this.properties = deepClone(INITIAL_PROPERTIES);
    this.applications = deepClone(INITIAL_APPLICATIONS);

    // Make APP-2026-002 appointment date relative (+5 days) for a live upcoming demo appointment
    const app2 = this.applications.find((a) => a.id === 'APP-2026-002');
    if (app2 && app2.appointment) {
      app2.appointment.date = getRelativeDate(5);
    }

    // Seed appointments from existing application appointments
    this.appointments = [];
    let aptCount = 1;
    this.applications.forEach((a) => {
      if (a.appointment && a.appointment.office && a.appointment.date) {
        const reference = `APT-2026-${String(aptCount).padStart(4, '0')}`;
        const apt = {
          id: `apt-${aptCount}`,
          reference,
          purpose: APPOINTMENT_PURPOSES.TRANSFER,
          applicationId: a.id,
          propertyId: a.propertyId,
          office: a.appointment.office,
          date: a.appointment.date,
          slot: a.appointment.slot,
          contactMobile: a.sellerPhone || '9876543210',
          attendee: {
            type: 'SELF',
            name: a.sellerName,
            mobile: a.sellerPhone || '9876543210',
          },
          assistanceNeeded: false,
          notes: '',
          status: 'SCHEDULED',
          userId: a.sellerId,
          createdAt: '2026-01-10T10:00:00Z',
        };
        this.appointments.push(apt);
        // Ensure application.appointment has reference and purpose
        a.appointment.reference = reference;
        a.appointment.purpose = APPOINTMENT_PURPOSES.TRANSFER;
        aptCount++;
      }
    });
  }

  // --- BUYER LOOKUP ---
  async lookupBuyer(query, currentUserId) {
    await delay();
    const q = (query || '').trim().toLowerCase();
    const found = this.users.find(
      (u) =>
        u.role === 'CITIZEN' &&
        (u.email.toLowerCase() === q || u.phone.toLowerCase() === q)
    );

    if (!found) {
      const err = new Error('Buyer not found with the specified email or phone.');
      err.status = 404;
      throw err;
    }

    if (found.id === currentUserId) {
      const err = new Error('You cannot transfer a property to yourself.');
      err.status = 400;
      throw err;
    }

    // Mask name per Assumption A6 (e.g. "Suresh Kumar Singh" -> "S*** K*** S***")
    const parts = found.name.split(' ');
    const maskedName = parts
      .map((p) => (p.length > 0 ? p[0] + '***' : ''))
      .join(' ');

    return {
      id: found.id,
      name: found.name,
      maskedName,
      email: found.email,
      phone: found.phone,
      kycStatus: found.kycStatus || 'VERIFIED',
    };
  }

  // --- PROPERTIES ---
  async getUserProperties(userId) {
    await delay();
    const list = this.properties.filter((p) => p.ownerId === userId);
    return deepClone(list);
  }

  async getPropertyById(propertyId) {
    await delay();
    const property = this.properties.find((p) => p.propertyId === propertyId);
    if (!property) {
      const err = new Error(`Property ${propertyId} not found.`);
      err.status = 404;
      throw err;
    }
    return deepClone(property);
  }

  async findPropertyByDetails({ state, district, tehsil, village, khasraNumber }) {
    await delay();
    const normalize = (s) => (s || '').trim().toLowerCase();
    const match = this.properties.find((p) => {
      const stateMatch = !state || normalize(p.state) === normalize(state);
      const distMatch = !district || normalize(p.district) === normalize(district);
      const tehsilMatch = !tehsil || normalize(p.tehsil) === normalize(tehsil);
      const villageMatch = !village || normalize(p.village) === normalize(village);
      const khasraMatch = !khasraNumber || normalize(p.khasraNumber) === normalize(khasraNumber);
      return stateMatch && distMatch && tehsilMatch && villageMatch && khasraMatch;
    });

    return match ? deepClone(match) : null;
  }

  // --- APPLICATIONS ---
  async getUserApplications(userId) {
    await delay();
    const list = this.applications.filter(
      (a) => a.sellerId === userId || a.buyerId === userId
    );
    return deepClone(list);
  }

  async getAllApplications(statusFilter) {
    await delay();
    // Registrar queue must EXCLUDE DRAFT applications
    let list = this.applications.filter((a) => a.applicationStatus !== APPLICATION_STATUSES.DRAFT);
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter((a) => a.applicationStatus === statusFilter);
    }
    return deepClone(list);
  }

  async getApplicationById(id) {
    await delay();
    const app = this.applications.find((a) => a.id === id);
    if (!app) {
      const err = new Error(`Application ${id} not found.`);
      err.status = 404;
      throw err;
    }
    return deepClone(app);
  }

  async createApplication({ propertyId, seller, buyer, documents = [] }) {
    await delay();
    const prop = this.properties.find((p) => p.propertyId === propertyId);
    if (!prop) {
      const err = new Error('Property not found.');
      err.status = 404;
      throw err;
    }

    // Check if property already has an open transfer
    const existingOpenApp = this.applications.find(
      (a) =>
        a.propertyId === propertyId &&
        !['COMPLETED', 'REJECTED', 'FAILED'].includes(a.applicationStatus)
    );
    if (existingOpenApp) {
      const err = new Error('This property already has an ongoing transfer application.');
      err.status = 400;
      throw err;
    }

    // Mark property as Transfer in progress
    prop.status = 'Transfer in progress';

    const isDraft = !documents || documents.length === 0;
    const newId = `APP-2026-${String(this.applications.length + 1).padStart(3, '0')}`;
    const newApp = {
      id: newId,
      propertyId,
      sellerId: seller.id,
      sellerName: seller.name,
      sellerPhone: seller.phone || '9876543210',
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerPhone: buyer.phone || '9876543211',
      applicationStatus: isDraft ? APPLICATION_STATUSES.DRAFT : APPLICATION_STATUSES.SUBMITTED,
      kycStatus: KYC_STATUSES.PENDING,
      paymentStatus: PAYMENT_STATUSES.INITIATED,
      blockchainStatus: null,
      txHash: null,
      submittedAt: isDraft
        ? null
        : new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: '2026',
          }) + ', 10:00 AM',
      approvedAt: null,
      completedAt: null,
      appointment: null,
      documents: isDraft
        ? []
        : documents.map((doc, idx) => ({
            docId: `doc-${Date.now()}-${idx}`,
            type: doc.type,
            fileName: doc.fileName,
            hash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
            integrity: 'MATCH',
          })),
      checklist: {
        kycVerified: false,
        paymentReceived: false,
        documentsReviewed: false,
        propertyMatched: false,
        noConflict: true,
      },
      registryNumber: null,
      hasERegistry: false,
    };

    this.applications.unshift(newApp);
    return deepClone(newApp);
  }

  async addDocument(applicationId, { type, fileName, hash }) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) {
      const err = new Error(`Application ${applicationId} not found.`);
      err.status = 404;
      throw err;
    }
    if (app.applicationStatus !== APPLICATION_STATUSES.DRAFT) {
      const err = new Error('Documents can only be modified while the application is in draft status.');
      err.status = 400;
      throw err;
    }

    if (!app.documents) {
      app.documents = [];
    }

    const docHash = hash || `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const existingIdx = app.documents.findIndex((d) => d.type === type);
    const newDoc = {
      docId: existingIdx >= 0 ? app.documents[existingIdx].docId : `doc-${Date.now()}-${type.toLowerCase()}`,
      type,
      fileName,
      hash: docHash,
      integrity: 'MATCH',
    };

    if (existingIdx >= 0) {
      app.documents[existingIdx] = newDoc;
    } else {
      app.documents.push(newDoc);
    }

    return deepClone(app);
  }

  async submitApplication(applicationId) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) {
      const err = new Error(`Application ${applicationId} not found.`);
      err.status = 404;
      throw err;
    }

    const REQUIRED_DOC_TYPES = [
      'SALE_DEED',
      'IDENTITY_PROOF',
      'LAND_MAP',
      'ENCUMBRANCE_CERT',
      'TAX_RECEIPT',
    ];

    const uploadedTypes = (app.documents || []).map((d) => d.type);
    const allPresent = REQUIRED_DOC_TYPES.every((t) => uploadedTypes.includes(t));
    if (!allPresent) {
      const missing = REQUIRED_DOC_TYPES.filter((t) => !uploadedTypes.includes(t));
      const err = new Error(`All 5 required documents must be uploaded before submitting. Missing: ${missing.join(', ')}`);
      err.status = 400;
      throw err;
    }

    app.applicationStatus = APPLICATION_STATUSES.SUBMITTED;
    const now = new Date();
    app.submittedAt = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2026',
    }) + ', ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    return deepClone(app);
  }

  // --- KYC ---
  async triggerKyc(applicationId, targetStatus = KYC_STATUSES.VERIFIED) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    app.kycStatus = targetStatus;
    if (targetStatus === KYC_STATUSES.VERIFIED) {
      app.checklist.kycVerified = true;
      // If payment is already successful, application moves to UNDER_VERIFICATION
      if (app.paymentStatus === PAYMENT_STATUSES.SUCCESSFUL) {
        app.applicationStatus = APPLICATION_STATUSES.UNDER_VERIFICATION;
      }
    } else {
      app.checklist.kycVerified = false;
    }

    return deepClone(app);
  }

  // --- PAYMENT ---
  async triggerPayment(applicationId, targetStatus = PAYMENT_STATUSES.SUCCESSFUL) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    if (app.kycStatus !== KYC_STATUSES.VERIFIED) {
      const err = new Error('KYC must be verified before proceeding with payment.');
      err.status = 400;
      throw err;
    }

    app.paymentStatus = targetStatus;
    if (targetStatus === PAYMENT_STATUSES.SUCCESSFUL) {
      app.checklist.paymentReceived = true;
      app.paymentFailureMessage = null;
      // When both KYC and payment are done, application moves to UNDER_VERIFICATION
      if (app.kycStatus === KYC_STATUSES.VERIFIED) {
        app.applicationStatus = APPLICATION_STATUSES.UNDER_VERIFICATION;
      }
    } else {
      app.checklist.paymentReceived = false;
      app.paymentFailureMessage = 'Simulated INR payment failed. The application has not been finalized.';
    }

    return deepClone(app);
  }

  // --- APPOINTMENTS ---
  async bookAppointment(applicationId, { office, date, slot }) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const reference = `APT-2026-${String(this.appointments.length + 1).padStart(4, '0')}`;
    app.appointment = {
      office,
      date,
      slot,
      reference,
      purpose: APPOINTMENT_PURPOSES.TRANSFER,
    };

    const apt = {
      id: `apt-${Date.now()}`,
      reference,
      purpose: APPOINTMENT_PURPOSES.TRANSFER,
      applicationId: app.id,
      propertyId: app.propertyId,
      office,
      date,
      slot,
      contactMobile: app.sellerPhone || '9876543210',
      attendee: { type: 'SELF', name: app.sellerName, mobile: app.sellerPhone },
      assistanceNeeded: false,
      notes: '',
      status: 'SCHEDULED',
      userId: app.sellerId,
      createdAt: new Date().toISOString(),
    };
    this.appointments.push(apt);

    return deepClone(app);
  }

  async createAppointment({
    purpose,
    applicationId,
    propertyId,
    office,
    date,
    slot,
    contactMobile,
    attendee = { type: 'SELF' },
    assistanceNeeded = false,
    notes = '',
    documents = [],
    userId,
  }) {
    await delay();

    // 1. Office exists
    const validOffices = getSROOffices();
    if (!validOffices.includes(office)) {
      const err = new Error(`Invalid Sub-Registrar Office: ${office}`);
      err.status = 400;
      throw err;
    }

    // 2. Date validation: future, within 60 days, not a Sunday
    if (!date) {
      const err = new Error('Appointment date is required.');
      err.status = 400;
      throw err;
    }

    const apptDate = new Date(`${date}T00:00:00`);
    if (isNaN(apptDate.getTime())) {
      const err = new Error('Invalid appointment date format.');
      err.status = 400;
      throw err;
    }

    if (apptDate.getDay() === 0) {
      const err = new Error('Sub-Registrar Offices are closed on Sundays.');
      err.status = 400;
      throw err;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);

    if (apptDate <= today) {
      const err = new Error('Appointment date must be in the future.');
      err.status = 400;
      throw err;
    }

    if (apptDate > maxDate) {
      const err = new Error('Appointments can only be booked up to 60 days in advance.');
      err.status = 400;
      throw err;
    }

    // 3. Slot is not FULL
    const availability = this.getSlotAvailability(office, date);
    if (availability[slot] === 'FULL') {
      const err = new Error('The selected time slot is full. Please choose another slot.');
      err.status = 400;
      throw err;
    }

    // 4. Purpose is valid
    if (!Object.values(APPOINTMENT_PURPOSES).includes(purpose)) {
      const err = new Error(`Invalid appointment purpose: ${purpose}`);
      err.status = 400;
      throw err;
    }

    // 5. If applicationId is given, validate application
    let app = null;
    if (applicationId) {
      app = this.applications.find((a) => a.id === applicationId);
      if (!app) {
        const err = new Error(`Application ${applicationId} not found.`);
        err.status = 404;
        throw err;
      }
      if (userId && app.sellerId !== userId && app.buyerId !== userId) {
        const err = new Error('You do not have access to this application.');
        err.status = 403;
        throw err;
      }
      if (app.appointment && app.appointment.date) {
        const err = new Error('This application already has an appointment.');
        err.status = 400;
        throw err;
      }
    }

    const reference = `APT-2026-${String(this.appointments.length + 1).padStart(4, '0')}`;

    // When applicationId is present, also set application.appointment
    if (app) {
      app.appointment = {
        office,
        date,
        slot,
        reference,
        purpose,
      };
      if (Array.isArray(documents) && documents.length > 0) {
        app.documents = documents.map((d) => ({
          docId: d.docId,
          type: d.type,
          fileName: d.fileName,
          size: d.size ?? d.fileSize ?? 0,
          mimeType: d.mimeType || 'application/octet-stream',
          hash: d.hash || '',
        }));
      }
    }

    const newAppointment = {
      id: `apt-${Date.now()}`,
      reference,
      purpose,
      applicationId: applicationId || null,
      propertyId: propertyId || (app ? app.propertyId : null),
      office,
      date,
      slot,
      contactMobile: contactMobile || '',
      attendee,
      assistanceNeeded: Boolean(assistanceNeeded),
      notes: notes || '',
      documents: Array.isArray(documents)
        ? documents.map((d) => ({
            docId: d.docId,
            type: d.type,
            fileName: d.fileName,
            size: d.size ?? d.fileSize ?? 0,
            mimeType: d.mimeType || 'application/octet-stream',
            hash: d.hash || '',
          }))
        : [],
      status: 'SCHEDULED',
      userId: userId || (app ? app.sellerId : 'usr-citizen-rajesh'),
      createdAt: new Date().toISOString(),
    };

    this.appointments.push(newAppointment);
    return deepClone(newAppointment);
  }

  getSlotAvailability(office, date) {
    const slots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'];
    const res = {};
    slots.forEach((s) => {
      const booked = this.appointments.filter(
        (a) => a.office === office && a.date === date && a.slot === s && a.status === 'SCHEDULED'
      );
      if (booked.length >= 2) {
        res[s] = 'FULL';
      } else {
        let state = getDeterministicSlotState(office, date, s);
        if (booked.length > 0 && state === 'AVAILABLE') {
          state = 'FEW_LEFT';
        }
        res[s] = state;
      }
    });
    return res;
  }

  async getUserAppointments(userId) {
    await delay();
    const list = this.appointments.filter((a) => a.userId === userId);
    const todayStr = new Date().toISOString().split('T')[0];

    const upcoming = list
      .filter((a) => a.date >= todayStr && a.status === 'SCHEDULED')
      .sort((a, b) => a.date.localeCompare(b.date) || a.slot.localeCompare(b.slot));

    const past = list
      .filter((a) => a.date < todayStr || a.status !== 'SCHEDULED')
      .sort((a, b) => b.date.localeCompare(a.date) || b.slot.localeCompare(a.slot));

    const combined = [...upcoming, ...past].map((apt) => {
      const linkedApp = apt.applicationId
        ? this.applications.find((a) => a.id === apt.applicationId)
        : null;
      return {
        ...apt,
        applicationStatus: linkedApp ? linkedApp.applicationStatus : null,
        isDraft: linkedApp ? linkedApp.applicationStatus === APPLICATION_STATUSES.DRAFT : false,
      };
    });

    return deepClone(combined);
  }

  // --- DOCUMENT INTEGRITY ---
  async verifyDocumentIntegrity(docId, applicationId) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    const doc = app.documents.find((d) => d.docId === docId);
    if (!doc) throw new Error('Document not found');

    return {
      docId,
      integrity: doc.integrity || 'MATCH',
      message:
        doc.integrity === 'MISMATCH'
          ? (doc.integrityMessage || 'Cryptographic hash mismatch detected.')
          : 'Document SHA-256 integrity verified successfully against server signature.',
    };
  }

  // --- REGISTRAR REVIEW & BLOCKCHAIN TRIGGER ---
  async approveApplication(applicationId) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    // Validate readiness
    if (app.kycStatus !== KYC_STATUSES.VERIFIED) {
      throw new Error('KYC is not verified.');
    }
    if (app.paymentStatus !== PAYMENT_STATUSES.SUCCESSFUL) {
      throw new Error('Payment has not been received.');
    }
    const hasMismatch = app.documents.some((d) => d.integrity === 'MISMATCH');
    if (hasMismatch) {
      throw new Error('Cannot approve application with document hash integrity mismatch.');
    }

    app.applicationStatus = APPLICATION_STATUSES.APPROVED;
    app.approvedAt = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2026',
    }) + ', 12:00 PM';
    app.blockchainStatus = BLOCKCHAIN_STATUSES.SUBMITTED;
    app.txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    // Simulate asynchronous blockchain progression sequence:
    // SUBMITTED -> PENDING -> CONFIRMED -> SYNCED -> COMPLETED
    setTimeout(() => {
      app.blockchainStatus = BLOCKCHAIN_STATUSES.PENDING;
    }, 1500);

    setTimeout(() => {
      app.blockchainStatus = BLOCKCHAIN_STATUSES.CONFIRMED;
    }, 3500);

    setTimeout(() => {
      app.blockchainStatus = BLOCKCHAIN_STATUSES.SYNCED;
      app.applicationStatus = APPLICATION_STATUSES.COMPLETED;
      app.completedAt = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: '2026',
      }) + ', 12:05 PM';
      app.hasERegistry = true;
      app.registryNumber = `REG/2026/${app.id.replace('APP-2026-', '')}`;

      // Update property ownership & status in store
      const prop = this.properties.find((p) => p.propertyId === app.propertyId);
      if (prop) {
        prop.status = 'Active';
        prop.history.unshift({
          date: '08-Oct-2026',
          description: 'Ownership transferred, finalized on blockchain and synchronized',
          from: app.sellerName,
          to: app.buyerName,
          txHash: app.txHash,
        });
        prop.ownerId = app.buyerId;
        prop.ownerName = app.buyerName;
      }
    }, 6000);

    return deepClone(app);
  }

  async rejectApplication(applicationId, reason, comments) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    app.applicationStatus = APPLICATION_STATUSES.REJECTED;
    app.rejectionReason = reason;
    app.rejectionComments = comments;

    // Reset property status to Active
    const prop = this.properties.find((p) => p.propertyId === app.propertyId);
    if (prop) {
      prop.status = 'Active';
    }

    return deepClone(app);
  }

  async requestResubmission(applicationId, remarks) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    app.applicationStatus = APPLICATION_STATUSES.RESUBMISSION;
    app.resubmissionRemarks = remarks;

    return deepClone(app);
  }

  // --- RETRY TRANSACTION ---
  async retryTransaction(applicationId) {
    await delay();
    const app = this.applications.find((a) => a.id === applicationId);
    if (!app) throw new Error('Application not found');

    app.applicationStatus = APPLICATION_STATUSES.PROCESSING;
    app.blockchainStatus = BLOCKCHAIN_STATUSES.SUBMITTED;
    app.blockchainError = null;

    setTimeout(() => {
      app.blockchainStatus = BLOCKCHAIN_STATUSES.PENDING;
    }, 1200);

    setTimeout(() => {
      app.blockchainStatus = BLOCKCHAIN_STATUSES.CONFIRMED;
    }, 2800);

    setTimeout(() => {
      app.blockchainStatus = BLOCKCHAIN_STATUSES.SYNCED;
      app.applicationStatus = APPLICATION_STATUSES.COMPLETED;
      app.hasERegistry = true;
      app.registryNumber = `REG/2026/${app.id.replace('APP-2026-', '')}`;

      const prop = this.properties.find((p) => p.propertyId === app.propertyId);
      if (prop) {
        prop.status = 'Active';
        prop.ownerId = app.buyerId;
        prop.ownerName = app.buyerName;
      }
    }, 4500);

    return deepClone(app);
  }
}

export const mockStore = new MockStore();
export default mockStore;
