// Authentication Service
// Communicates via mock store or API client depending on environment mode.

import apiClient, { isMockMode } from '../api/client';
import mockStore from '../api/mock/store';

// TODO(auth-mechanism): real mechanism (JWT/session) not yet decided in Architecture
const SESSION_STORAGE_KEY = 'bhumi_session';

export const authService = {
  async login(email, password) {
    if (isMockMode()) {
      const user = await mockStore.login(email, password);
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    // TODO(api-contract): path not yet defined in docs
    const data = await apiClient.post('/auth/login', { email, password });
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    return data;
  },

  async register({ name, email, phone, password }) {
    if (isMockMode()) {
      return await mockStore.register({ name, email, phone, password });
    }
    // TODO(api-contract): path not yet defined in docs
    return await apiClient.post('/auth/register', { name, email, phone, password });
  },

  logout() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    if (!isMockMode()) {
      // TODO(api-contract): path not yet defined in docs
      apiClient.post('/auth/logout', {}).catch(() => {});
    }
  },

  getCurrentUser() {
    try {
      const item = sessionStorage.getItem(SESSION_STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
};

export default authService;
