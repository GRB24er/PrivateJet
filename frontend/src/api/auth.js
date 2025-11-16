// frontend/src/api/auth.js
import api from "./client.js";

/**
 * Login
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{user: any, accessToken?: string}>}
 */
export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data;
}

/**
 * Register
 */
export async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

/**
 * Current authenticated user
 */
export async function me() {
  const { data } = await api.get("/auth/me");
  // backend returns { user } or user directly
  return data.user || data;
}

/**
 * Logout
 */
export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}