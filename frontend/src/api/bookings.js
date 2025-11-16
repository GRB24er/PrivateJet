// frontend/src/api/bookings.js
import api from "./client.js";

/**
 * Get *my* bookings (client)
 * Handles several backend formats safely.
 */
export async function myBookings() {
  try {
    const { data } = await api.get("/bookings/me");

    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    if (data?.bookings && Array.isArray(data.bookings)) return data.bookings;

    return data || [];
  } catch (error) {
    console.error("myBookings error:", error);
    throw error;
  }
}

/**
 * Cancel one of *my* bookings
 */
export async function cancelMine(id) {
  try {
    const { data } = await api.post(`/bookings/${id}/cancel`);
    return data?.booking || data?.data || data || null;
  } catch (error) {
    console.error("Cancel booking error:", error);
    throw error;
  }
}

/**
 * Get booking by id
 */
export async function getBooking(id) {
  const { data } = await api.get(`/bookings/${id}`);
  return data?.booking || data?.data || data;
}

/**
 * Check availability for a jet
 */
export async function checkAvailability(payload) {
  const { data } = await api.post('/bookings/check-availability', payload);
  return data;
}

/**
 * Create a new booking
 */
export async function createBooking(payload) {
  const { data } = await api.post('/bookings', payload);
  return data?.booking || data?.data || data;
}