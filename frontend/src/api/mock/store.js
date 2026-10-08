// In-memory mock store and asynchronous handlers (approx 300ms latency)
// Flows persist in-memory until browser page reload.

import { INITIAL_USERS, INITIAL_PROPERTIES, INITIAL_APPLICATIONS } from './mockData';
import { APPLICATION_STATUSES, BLOCKCHAIN_STATUSES, KYC_STATUSES, PAYMENT_STATUSES } from '../../utils/statuses';

// Clone helper to prevent accidental cross-reference mutations
const deepClone = (val) => JSON.parse(JSON.stringify(val));

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

class MockStore {
  constructor() {
    this.users = deepClone(INITIAL_USERS);
    this.properties = deepClone(INITIAL_PROPERTIES);
    this.applications = deepClone(INITIAL_APPLICATIONS);
  }

  // --- AUTH ---
  async login(email, password) {
    await delay();
    const user = this.users.find(
      (u) => u.email.toLowerCase() === (email || '').trim().toLowerCase()
    );
    if (!user) {
      const err = new Error('Invalid email or password.');
      err.status = 401;
      throw err;
    }
    // Return user with token
    return deepClone(user);
  }

  async register({ name, email, phone, password }) {
    await delay();
    const existing = this.users.find(
      (u) => u.email.toLowerCase() === (email || '').trim().toLowerCase()
    );
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.status = 409;
      throw err;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'CITIZEN',
      avatar: name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      kycStatus: 'PENDING',
      token: `mock-token-${Date.now()}`,
    };
    this.users.push(newUser);
    return deepClone(newUser);
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
    let list = this.applications;
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

  async createApplication({ propertyId, seller, buyer, documents }) {
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
      applicationStatus: APPLICATION_STATUSES.SUBMITTED,
      kycStatus: KYC_STATUSES.PENDING,
      paymentStatus: PAYMENT_STATUSES.INITIATED,
      blockchainStatus: null,
      txHash: null,
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: '2026',
      }) + ', 10:00 AM',
      approvedAt: null,
      completedAt: null,
      appointment: null,
      documents: documents.map((doc, idx) => ({
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

    app.appointment = { office, date, slot };
    return deepClone(app);
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
