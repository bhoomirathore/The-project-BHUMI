// Transaction Service (Blockchain transaction tracking & retry)

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

export const transactionService = {
  async getAllTransactions() {
    if (isMockMode()) {
      const apps = await mockStore.getAllApplications();
      // Filter applications that have had a blockchain transaction attempt
      return apps
        .filter((a) => a.txHash || a.blockchainStatus)
        .map((a) => ({
          applicationId: a.id,
          propertyId: a.propertyId,
          sellerName: a.sellerName,
          buyerName: a.buyerName,
          txHash: a.txHash,
          status: a.blockchainStatus,
          error: a.blockchainError,
          submittedAt: a.approvedAt || a.submittedAt,
        }));
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.get('/authority/transactions');
  },

  async retry(applicationId) {
    if (isMockMode()) {
      return await mockStore.retryTransaction(applicationId);
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post(`/authority/transactions/${encodeURIComponent(applicationId)}/retry`, {});
  },
};

export default transactionService;
