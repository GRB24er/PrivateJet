import api from './client.js';

export async function getProfile() {
  const { data } = await api.get('/users/me');
  return data.user;
}

export async function updateProfile(payload) {
  const { data } = await api.put('/users/me', payload);
  return data.user;
}

export async function changePassword(payload) {
  const { data } = await api.put('/users/me/password', payload);
  return data;
}