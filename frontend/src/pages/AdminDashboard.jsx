import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getAdminStats } from "../api/admin.js";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="container-xl" style={{ padding: "24px 0" }}>Forbidden (admin only)</div>;
  }

  return (
    <div className="container-xl" style={{ padding: "24px 0" }}>
      <h2 style={{ margin: 0, fontWeight: 800, fontSize: 24, marginBottom: 24 }}>
        Admin Dashboard
      </h2>

      {loading ? (
        <div className="card" style={{ padding: 24 }}>Loading statistics...</div>
      ) : (
        <div style={{ display: "grid", gap: 24 }}>
          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            <div className="card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
                {stats?.totals?.bookings || 0}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>Total Bookings</div>
            </div>
            <div className="card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
                {stats?.totals?.jets || 0}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>Fleet Size</div>
            </div>
            <div className="card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
                {stats?.totals?.users || 0}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>Total Users</div>
            </div>
            <div className="card" style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
                ${stats?.totals?.revenue?.toLocaleString() || 0}
              </div>
              <div style={{ color: "var(--muted)", fontSize: 14 }}>Revenue</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Quick Actions</h3>
            <div style={{ display: "flex", gap: 12 }}>
              <Link to="/admin/fleet" className="btn btn-primary">
                Manage Fleet
              </Link>
              <Link to="/admin/bookings" className="btn btn-ghost">
                View Bookings
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}