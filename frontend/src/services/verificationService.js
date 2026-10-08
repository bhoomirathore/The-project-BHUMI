// Verification Service (Registrar / Authority Actions)

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

export const verificationService = {
  async approveApplication(applicationId, checklist) {
    if (isMockMode()) {
      return await mockStore.approveApplication(applicationId, checklist);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/authority/applications/${encodeURIComponent(applicationId)}/approve`, {
      checklist,
    });
  },

  async rejectApplication(applicationId, reason, comments) {
    if (isMockMode()) {
      return await mockStore.rejectApplication(applicationId, reason, comments);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/authority/applications/${encodeURIComponent(applicationId)}/reject`, {
      reason,
      comments,
    });
  },

  async requestResubmission(applicationId, remarks) {
    if (isMockMode()) {
      return await mockStore.requestResubmission(applicationId, remarks);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/authority/applications/${encodeURIComponent(applicationId)}/resubmit`, {
      remarks,
    });
  },
};

export default verificationService;
