// Property Service

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

export const propertyService = {
  async getUserProperties(userId) {
    if (isMockMode()) {
      return await mockStore.getUserProperties(userId);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get(`/properties?userId=${encodeURIComponent(userId)}`);
  },

  async getPropertyById(propertyId) {
    if (isMockMode()) {
      return await mockStore.getPropertyById(propertyId);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get(`/properties/${encodeURIComponent(propertyId)}`);
  },
};

export default propertyService;
