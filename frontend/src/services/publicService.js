// Public Verification Service
// Public verification does not expose sensitive personal info per architectural rules.

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

export const publicService = {
  async verifyProperty(searchParams) {
    if (isMockMode()) {
      const match = await mockStore.findPropertyByDetails(searchParams);
      if (!match) {
        return null;
      }
      return {
        propertyId: match.propertyId,
        khasraNumber: match.khasraNumber,
        village: match.village,
        tehsil: match.tehsil,
        district: match.district,
        state: match.state,
        areaSqFt: match.areaSqFt,
        landType: match.landType,
        registrationStatus: match.status === 'Active' ? 'Verified' : 'Under Process',
        verificationStatus: 'Verified against blockchain state',
        integrityCheck: 'MATCH',
        txHash: match.history?.[0]?.txHash || '0x7b4a8e29f10c3d9a5482b610c49e217d83f60a12e345b678c90123456789abcd',
        ownershipHistory: (match.history || []).map((h) => ({
          date: h.date,
          event: h.description,
          txHash: h.txHash,
          from: h.from,
          to: h.to,
        })),
      };
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post('/public/verify-land', searchParams);
  },
};

export default publicService;
