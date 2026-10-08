// Payment Service (Mock INR payment)

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

export const paymentService = {
  async triggerMockPayment(applicationId, targetStatus = 'SUCCESSFUL') {
    if (isMockMode()) {
      return await mockStore.triggerPayment(applicationId, targetStatus);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/applications/${encodeURIComponent(applicationId)}/payment/process`, {
      targetStatus,
    });
  },
};

export default paymentService;
