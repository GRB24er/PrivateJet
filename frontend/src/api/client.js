// frontend/src/api/client.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// In-memory token
let accessToken = null;
let isRefreshing = false;
let refreshQueue = [];

/** Call this after login/register/restore */
export function setAuthToken(token) {
  accessToken = token || null;
  if (accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

// Axios instance
const api = axios.create({
  baseURL: `${API_BASE}/api`, // ✅ Add /api here once
  withCredentials: true, // for refresh cookie
  timeout: 20000,
});

// Attach token
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/** Call refresh endpoint directly */
async function doRefresh() {
  const resp = await axios.post(
    `${API_BASE}/api/auth/refresh`,
    {},
    { withCredentials: true }
  );
  return resp.data; // { accessToken, user? }
}

// Handle 401 -> refresh once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((token) => {
            original._retry = true;
            original.headers.Authorization = `Bearer ${token}`;
            return api.request(original);
          })
          .catch((err) => Promise.reject(err));
      }

      try {
        isRefreshing = true;
        const data = await doRefresh();
        const newToken = data?.accessToken;
        if (!newToken) throw new Error("No accessToken in refresh");

        setAuthToken(newToken);

        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];

        original._retry = true;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api.request(original);
      } catch (err) {
        refreshQueue.forEach(({ reject }) => reject(err));
        refreshQueue = [];
        setAuthToken(null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;