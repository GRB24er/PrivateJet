import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProfile } from "../api/user.js";
import { myBookings } from "../api/bookings.js";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const u = await getProfile();
      const b = await myBookings();

      setUser(u);
      setBookings(Array.isArray(b) ? b : b?.items || []);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = {
    totalTrips: bookings.length,
    upcoming: bookings.filter(b => 
      b.status === 'Pending' || b.status === 'Confirmed'
    ).length,
    completed: bookings.filter(b => b.status === 'Completed').length,
    totalSpent: bookings
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + (b.priceUSD || b.price || 0), 0)
  };

  const recentBookings = bookings.slice(0, 5);

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f59e0b',
      'Confirmed': '#3b82f6',
      'Enroute': '#8b5cf6',
      'Completed': '#22c55e',
      'Cancelled': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Hero Header */}
        <motion.div 
          className="dashboard-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-content">
            <h1 className="dashboard-title">
              Welcome back, <span className="highlight-gold">{user?.name}</span>
            </h1>
            <p className="dashboard-subtitle">
              Your private aviation command center
            </p>
          </div>
          <Link to="/fleet" className="btn-luxury-primary">
            <span className="btn-icon">✈️</span>
            <span>Book New Flight</span>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="stats-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalTrips}</div>
              <div className="stat-label">Total Flights</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.upcoming}</div>
              <div className="stat-label">Upcoming Trips</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">${stats.totalSpent.toLocaleString()}</div>
              <div className="stat-label">Total Charter Value</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Bookings */}
        <motion.section 
          className="dashboard-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="section-header">
            <div>
              <h2 className="section-title">Recent Flight Activity</h2>
              <p className="section-subtitle">Your latest bookings and upcoming trips</p>
            </div>
            <Link to="/trips" className="btn-luxury-outline">
              View All Trips
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✈️</div>
              <h3>No flights yet</h3>
              <p>Book your first private charter to get started</p>
              <Link to="/fleet" className="btn-luxury-primary">
                Explore Our Fleet
              </Link>
            </div>
          ) : (
            <div className="bookings-list">
              {recentBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  className="booking-card-luxury"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                >
                  <div className="booking-main">
                    <div className="booking-route">
                      <div className="airport-code">{booking.origin}</div>
                      <div className="route-line">
                        <div className="route-dot"></div>
                        <div className="route-path"></div>
                        <div className="route-plane">✈</div>
                      </div>
                      <div className="airport-code">{booking.destination}</div>
                    </div>
                    
                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="detail-label">Aircraft</span>
                        <span className="detail-value">{booking.jet?.name || 'Aircraft TBD'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Departure</span>
                        <span className="detail-value">
                          {new Date(booking.departureAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-meta">
                    <span 
                      className="status-badge"
                      style={{ 
                        background: `${getStatusColor(booking.status)}15`,
                        color: getStatusColor(booking.status),
                        borderColor: getStatusColor(booking.status)
                      }}
                    >
                      {booking.status}
                    </span>
                    <Link 
                      to={`/trips/${booking._id}`} 
                      className="view-details"
                    >
                      View Details →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="quick-actions-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <Link to="/fleet" className="action-card">
              <div className="action-icon">🛩️</div>
              <h3>Browse Fleet</h3>
              <p>Explore our premium aircraft</p>
            </Link>
            <Link to="/trips" className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Trips</h3>
              <p>View all flight history</p>
            </Link>
            <Link to="/profile" className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Manage your account</p>
            </Link>
            <a href="tel:+18005551234" className="action-card">
              <div className="action-icon">📞</div>
              <h3>Concierge</h3>
              <p>24/7 support available</p>
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  );
}