import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client.js";
import toast from "react-hot-toast";

export default function BookingWidget() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departureAt: "",
    arrivalAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [avail, setAvail] = useState(null); // {available, conflicts}

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const check = async () => {
    setAvail(null);
    // lightweight pre-check requiring dates only – jet will be chosen later
    if (!form.departureAt || !form.arrivalAt || !form.origin || !form.destination) {
      toast.error("Fill origin, destination, and both times.");
      return;
    }
    if (new Date(form.departureAt) >= new Date(form.arrivalAt)) {
      toast.error("Arrival must be after departure.");
      return;
    }
    toast.success("Great — pick a jet to continue.");
  };

  const goFleet = () => {
    if (!form.departureAt || !form.arrivalAt || !form.origin || !form.destination) {
      toast.error("Complete all fields first.");
      return;
    }
    // Pass query params to Fleet for pre-filled booking intent
    const q = new URLSearchParams({
      o: form.origin.trim(),
      d: form.destination.trim(),
      from: new Date(form.departureAt).toISOString(),
      to: new Date(form.arrivalAt).toISOString(),
    }).toString();
    nav(`/fleet?${q}`);
  };

  return (
    <div className="booking-widget card">
      <h3 className="bw-title">Plan a Flight</h3>
      <div className="bw-grid">
        <div className="bw-field">
          <label>Origin (ICAO/IATA)</label>
          <input name="origin" value={form.origin} onChange={onChange} placeholder="KTEB / TEB" />
        </div>
        <div className="bw-field">
          <label>Destination (ICAO/IATA)</label>
          <input name="destination" value={form.destination} onChange={onChange} placeholder="KSFO / SFO" />
        </div>
        <div className="bw-field">
          <label>Departure</label>
          <input type="datetime-local" name="departureAt" value={form.departureAt} onChange={onChange} />
        </div>
        <div className="bw-field">
          <label>Arrival</label>
          <input type="datetime-local" name="arrivalAt" value={form.arrivalAt} onChange={onChange} />
        </div>
      </div>

      <div className="bw-actions">
        <button className="btn btn-ghost" onClick={check} disabled={loading}>Check</button>
        <button className="btn btn-primary" onClick={goFleet} disabled={loading}>Select Aircraft</button>
      </div>

      {avail && (
        <div className="bw-result">
          {avail.available ? (
            <span className="badge" style={{ background: "#16a34a" }}>Times are available</span>
          ) : (
            <span className="badge" style={{ background: "#ef4444" }}>Conflicts found</span>
          )}
        </div>
      )}
    </div>
  );
}
