// API Client fetch wrapper
// Attaches auth session token, handles credentials, automatic refresh, and normalizes responses

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const isMockMode = () => {
  return import.meta.env.VITE_USE_MOCK === 'true';
};

export const getAuthToken = () => {
  try {
    const stored = sessionStorage.getItem('bhumi_access_token');
    if (stored) return stored;

    const session = sessionStorage.getItem('bhumi_session');
    if (session) {
      const parsed = JSON.parse(session);
      return parsed?.accessToken || parsed?.token || null;
    }
  } catch {
    return null;
  }
  return null;
};

export const setAuthSession = (user, accessToken, refreshToken = null) => {
  try {
    if (user) {
      sessionStorage.setItem('bhumi_session', JSON.stringify(user));
    }
    if (accessToken) {
      sessionStorage.setItem('bhumi_access_token', accessToken);
    }
    if (refreshToken) {
      sessionStorage.setItem('bhumi_refresh_token', refreshToken);
    }
  } catch (err) {
    console.error('Failed to store session:', err);
  }
};

export const clearAuthSession = () => {
  try {
    sessionStorage.removeItem('bhumi_session');
    sessionStorage.removeItem('bhumi_access_token');
    sessionStorage.removeItem('bhumi_refresh_token');
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
};

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function tryRefreshToken() {
  try {
    const storedRefresh = sessionStorage.getItem('bhumi_refresh_token');
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refreshToken: storedRefresh || undefined }),
    });

    if (!response.ok) {
      clearAuthSession();
      return null;
    }

    const data = await response.json();
    if (data.accessToken) {
      sessionStorage.setItem('bhumi_access_token', data.accessToken);
      if (data.refreshToken) {
        sessionStorage.setItem('bhumi_refresh_token', data.refreshToken);
      }
      return data.accessToken;
    }
    return null;
  } catch (err) {
    clearAuthSession();
    return null;
  }
}

async function request(endpoint, options = {}, isRetry = false) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle token expired (401) with automatic refresh retry
    if (response.status === 401 && !isRetry && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newToken = await tryRefreshToken();
        isRefreshing = false;

        if (newToken) {
          onRefreshed(newToken);
          return request(endpoint, options, true);
        } else {
          window.dispatchEvent(new CustomEvent('bhumi:auth:unauthorized'));
        }
      } else {
        // Wait for refresh to complete
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              resolve(request(endpoint, options, true));
            } else {
              reject(new Error('Session expired'));
            }
          });
        });
      }
    }

    if (!response.ok) {
      const errorMessage =
        (typeof data === 'object' && data?.message) ||
        (typeof data === 'string' && data) ||
        `HTTP Error ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      error.code = typeof data === 'object' ? data?.code : null;
      throw error;
    }

    return data;
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    throw err;
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
};

export default apiClient;
