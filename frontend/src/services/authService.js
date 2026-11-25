// Authentication Service
// Communicates directly with B.H.U.M.I. Backend Authentication API
// Enforces real bcrypt verification, JWT access tokens, refresh token rotation, and Google Sign-In.

import apiClient, {
  setAuthSession,
  clearAuthSession,
} from '../api/client';

const SESSION_STORAGE_KEY = 'bhumi_session';

export const authService = {
  /**
   * Log in with email and password (verified via bcrypt and JWT on backend)
   */
  async login(email, password) {
    const data = await apiClient.post('/auth/login', { email, password });
    if (data.user && data.accessToken) {
      setAuthSession(data.user, data.accessToken, data.refreshToken);
      return data.user;
    }
    throw new Error('Invalid response from authentication server.');
  },

  /**
   * Sign in or register with verified Google OAuth2 ID token
   */
  async googleLogin(credential) {
    const data = await apiClient.post('/auth/google', { credential });
    if (data.user && data.accessToken) {
      setAuthSession(data.user, data.accessToken, data.refreshToken);
      return data.user;
    }
    throw new Error('Google sign-in failed.');
  },

  /**
   * Register a new Citizen account (strict validation & bcrypt hash on backend)
   */
  async register({ name, email, phone, password }) {
    const data = await apiClient.post('/auth/register', {
      name,
      email,
      phone,
      password,
    });
    return data;
  },

  /**
   * Request a time-limited cryptographically secure password reset link
   */
  async forgotPassword(email) {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with verified token and invalidate all previous sessions
   */
  async resetPassword({ token, email, password }) {
    return await apiClient.post('/auth/reset-password', {
      token,
      email,
      password,
    });
  },

  /**
   * Log out current user, revoke refresh token on backend, and clear local state
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // Ignore network transport failures on logout
    } finally {
      clearAuthSession();
    }
  },

  /**
   * Fetch and verify current authenticated user from backend.
   * Prevents client-side session spoofing.
   */
  async getMe() {
    try {
      const data = await apiClient.get('/auth/me');
      if (data.user) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data.user));
        return data.user;
      }
      return null;
    } catch (err) {
      clearAuthSession();
      return null;
    }
  },

  /**
   * Read stored user profile from storage
   */
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
