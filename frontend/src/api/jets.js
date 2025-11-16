// frontend/src/api/jets.js
import api from "./client.js";

/**
 * Featured / available jets
 */
export async function fetchFeaturedJets(limit = 6) {
  const { data } = await api.get("/jets", {
    params: { onlyAvailable: true, limit },
  });
  return data?.jets || data || [];
}

/**
 * Generic jets fetcher if you need it elsewhere
 */
export async function fetchJets(params = {}) {
  const { data } = await api.get("/jets", { params });
  return data?.jets || data || [];
}

/**
 * Fetch single jet by ID
 */
export async function fetchJet(id) {
  const { data } = await api.get(`/jets/${id}`);
  return data?.jet || data || null;
}

/**
 * Create booking for a jet
 */
export async function createBooking(jetId, payload) {
  const { data } = await api.post(`/jets/${jetId}/book`, payload);
  return data?.booking || data || null;
}

/**
 * Admin: Get all jets (including inactive)
 */
export async function adminList() {
  const { data } = await api.get("/admin/jets");
  return data;
}

/**
 * Admin: Create new jet
 */
export async function createJet(payload) {
  const { data } = await api.post("/admin/jets", payload);
  return data?.jet || data || null;
}

/**
 * Admin: Update jet
 */
export async function updateJet(id, payload) {
  const { data } = await api.put(`/admin/jets/${id}`, payload);
  return data?.jet || data || null;
}

/**
 * Admin: Delete jet
 */
export async function deleteJet(id) {
  const { data } = await api.delete(`/admin/jets/${id}`);
  return data;
}