// frontend/src/api/admin.js
import api from './client.js';

export async function getAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data; // { totals, byStatus, topJets, monthly }
}