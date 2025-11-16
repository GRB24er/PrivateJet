import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      // TODO: Replace with actual admin bookings API call
      // const data = await adminBookings();
      // setBookings(data);
      setBookings([]);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="container-xl" style={{ padding: "24px 0" }}>Forbidden (admin only)</div>;
  }

  return (
    <div className="container-xl" style={{ padding: "24px 0" }}>
      <h2 style={{ margin: 0, fontWeight: 800, fontSize: 24, marginBottom: 16 }}>
        Admin • Bookings
      </h2>

      {loading ? (
        <div className="card" style={{ padding: 24 }}>Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="card" style={{ padding: 24, textAlign: "center" }}>
          <p>No bookings found</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {bookings.map(booking => (
            <div key={booking._id} className="card" style={{ padding: 16 }}>
              <div>{booking.origin} → {booking.destination}</div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>
                Status: {booking.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}