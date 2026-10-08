// KYC Service (Mock Aadhaar KYC verification)

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

export const kycService = {
  async triggerMockKyc(applicationId, targetStatus = 'VERIFIED') {
    if (isMockMode()) {
      return await mockStore.triggerKyc(applicationId, targetStatus);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/applications/${encodeURIComponent(applicationId)}/kyc/verify`, {
      targetStatus,
    });
  },
};

export default kycService;
