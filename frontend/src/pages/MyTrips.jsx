import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { myBookings, cancelMine } from "../api/bookings.js";
import { fetchFeaturedJets } from "../api/jets.js";
import toast from "react-hot-toast";

export default function MyTrips() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [jets, setJets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [bks, jetsList] = await Promise.all([
          myBookings(),
          fetchFeaturedJets(6).catch(() => []),
        ]);

        if (!cancelled) {
          setBookings(Array.isArray(bks) ? bks : bks?.items || []);
          setJets(Array.isArray(jetsList) ? jetsList : []);
        }
      } catch (err) {
        console.error("MyTrips load error:", err);
        if (!cancelled) {
          setError("We couldn't load your trips right now. Please try again in a moment.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this trip?")) return;

    try {
      await cancelMine(id);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "Cancelled" } : b
        )
      );
      toast.success("Trip cancelled successfully");
    } catch (err) {
      console.error("Cancel booking error:", err);
      toast.error("Could not cancel this trip. Please try again.");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "--";
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['Pending', 'Confirmed', 'Enroute'].includes(b.status);
    if (filter === 'completed') return b.status === 'Completed';
    if (filter === 'cancelled') return b.status === 'Cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="mytrips-page">
        <div className="mytrips-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your trips...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mytrips-page">
      <div className="mytrips-container">
        {/* Hero Header */}
        <motion.div 
          className="page-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-content">
            <h1 className="page-title">My Flight History</h1>
            <p className="page-subtitle">
              {user?.name ? `${user.name}'s private charter portfolio` : "Your complete flight history and upcoming journeys"}
            </p>
          </div>
          <Link to="/fleet" className="btn-luxury-primary">
            <span className="btn-icon">✈️</span>
            <span>Book New Flight</span>
          </Link>
        </motion.div>

        {error && (
          <motion.div 
            className="error-banner"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </motion.div>
        )}

        {/* Stats Summary */}
        <motion.div 
          className="trips-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stat-item">
            <div className="stat-number">{bookings.length}</div>
            <div className="stat-label">Total Flights</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">
              {bookings.filter(b => ['Pending', 'Confirmed', 'Enroute'].includes(b.status)).length}
            </div>
            <div className="stat-label">Upcoming</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">
              {bookings.filter(b => b.status === 'Completed').length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">
              {bookings.reduce((sum, b) => sum + (b.flightHours || 0), 0).toFixed(1)}h
            </div>
            <div className="stat-label">Flight Hours</div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="filter-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Trips ({bookings.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({bookings.filter(b => ['Pending', 'Confirmed', 'Enroute'].includes(b.status)).length})
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({bookings.filter(b => b.status === 'Completed').length})
          </button>
          <button 
            className={`filter-tab ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'Cancelled').length})
          </button>
        </motion.div>

        {/* Trips List */}
        <motion.section 
          className="trips-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No {filter !== 'all' ? filter : ''} trips found</h3>
              <p>
                {filter === 'all' 
                  ? "Start your journey by booking your first private charter"
                  : `You have no ${filter} trips at the moment`
                }
              </p>
              {filter === 'all' && (
                <Link to="/fleet" className="btn-luxury-primary">
                  Explore Our Fleet
                </Link>
              )}
            </div>
          ) : (
            <div className="trips-grid-luxury">
              {filteredBookings.map((booking, index) => (
                <motion.article
                  key={booking._id}
                  className="trip-card-luxury"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {/* Card Header with Route */}
                  <div className="trip-card-header">
                    <div className="route-display">
                      <div className="route-point">
                        <div className="airport-badge">{booking.origin}</div>
                        <div className="airport-label">Departure</div>
                      </div>
                      <div className="route-connector">
                        <div className="connector-line"></div>
                        <div className="connector-icon">✈</div>
                      </div>
                      <div className="route-point">
                        <div className="airport-badge">{booking.destination}</div>
                        <div className="airport-label">Arrival</div>
                      </div>
                    </div>
                    <span 
                      className="status-pill"
                      style={{ 
                        background: `${getStatusColor(booking.status)}20`,
                        color: getStatusColor(booking.status),
                        borderColor: `${getStatusColor(booking.status)}50`
                      }}
                    >
                      <span className="status-dot" style={{ background: getStatusColor(booking.status) }}></span>
                      {booking.status}
                    </span>
                  </div>

                  {/* Card Body with Details */}
                  <div className="trip-card-body">
                    {booking.jet && (
                      <div className="info-row">
                        <div className="info-icon">🛩️</div>
                        <div className="info-content">
                          <div className="info-label">Aircraft</div>
                          <div className="info-value">
                            {booking.jet.name} · {booking.jet.category}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="info-row">
                      <div className="info-icon">📅</div>
                      <div className="info-content">
                        <div className="info-label">Departure Time</div>
                        <div className="info-value">{formatDate(booking.departureAt)}</div>
                      </div>
                    </div>

                    <div className="info-row">
                      <div className="info-icon">🕐</div>
                      <div className="info-content">
                        <div className="info-label">Flight Duration</div>
                        <div className="info-value">
                          {booking.flightHours ? `${booking.flightHours.toFixed(1)} hours` : 'TBD'}
                        </div>
                      </div>
                    </div>

                    {(booking.priceUSD || booking.price) && (
                      <div className="info-row price-row">
                        <div className="info-icon">💎</div>
                        <div className="info-content">
                          <div className="info-label">Charter Value</div>
                          <div className="info-value price-value">
                            ${Number(booking.priceUSD || booking.price).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer with Actions */}
                  <div className="trip-card-footer">
                    <Link 
                      to={`/trips/${booking._id}`} 
                      className="btn-action btn-primary"
                    >
                      View Details
                    </Link>
                    {booking.status === 'Pending' && (
                      <button
                        type="button"
                        className="btn-action btn-cancel"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel Trip
                      </button>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.section>

        {/* Featured Jets Section */}
        {jets && jets.length > 0 && (
          <motion.section 
            className="featured-jets-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="section-header">
              <h2 className="section-title">Plan Your Next Journey</h2>
              <p className="section-subtitle">Featured aircraft ready for immediate dispatch</p>
            </div>
            <div className="jets-grid-compact">
              {jets.map((jet) => (
                <Link 
                  key={jet._id} 
                  to={`/fleet/${jet._id}`}
                  className="jet-card-compact"
                >
                  <div className="jet-card-content">
                    <h3 className="jet-name">{jet.name}</h3>
                    <div className="jet-specs-compact">
                      <span>{jet.seats} seats</span>
                      <span>•</span>
                      <span>{jet.rangeNM || jet.rangeNm} nm</span>
                    </div>
                    <div className="jet-price-compact">
                      <span className="price-label">From</span>
                      <span className="price-amount">
                        ${Number(jet.hourlyRate).toLocaleString()}/hr
                      </span>
                    </div>
                  </div>
                  <div className="jet-card-arrow">→</div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}