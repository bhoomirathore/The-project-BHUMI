// Application Service

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

export const applicationService = {
  async lookupBuyer(query, currentUserId) {
    if (isMockMode()) {
      return await mockStore.lookupBuyer(query, currentUserId);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get(`/users/lookup?q=${encodeURIComponent(query)}`);
  },

  async getUserApplications(userId) {
    if (isMockMode()) {
      return await mockStore.getUserApplications(userId);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get(`/applications?userId=${encodeURIComponent(userId)}`);
  },

  async getAllApplications(statusFilter) {
    if (isMockMode()) {
      return await mockStore.getAllApplications(statusFilter);
    }
    // TODO(api-contract): path not yet defined in docs
    const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    return await apiClient.get(`/applications${query}`);
  },

  async getApplicationById(id) {
    if (isMockMode()) {
      return await mockStore.getApplicationById(id);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get(`/applications/${encodeURIComponent(id)}`);
  },

  async createApplication(data) {
    if (isMockMode()) {
      return await mockStore.createApplication(data);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post('/applications', data);
  },

  async addDocument(applicationId, docData) {
    if (isMockMode()) {
      return await mockStore.addDocument(applicationId, docData);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/applications/${encodeURIComponent(applicationId)}/documents`, docData);
  },

  async submitApplication(applicationId) {
    if (isMockMode()) {
      return await mockStore.submitApplication(applicationId);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/applications/${encodeURIComponent(applicationId)}/submit`);
  },
};

export default applicationService;
