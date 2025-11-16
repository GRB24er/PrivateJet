import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBooking } from "../api/bookings.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import Timeline from "../components/booking/Timeline.jsx";

export default function TripDetail() {
  const { id } = useParams();
  const [b, setB] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const booking = await getBooking(id);
        setB(booking);
      } finally {
        setLoading(false);
      }
    })();
  },[id]);

  if (loading) return <div className="container-xl">Loading…</div>;
  if (!b) return <div className="container-xl">Not found</div>;

  return (
    <div className="container-xl" style={{ display:"grid", gap:16 }}>
      <Link to="/trips" className="btn btn-ghost">← Back to My Trips</Link>

      <div className="card" style={{ padding:16, display:"grid", gap:8 }}>
        <h2 style={{ margin:0 }}>{b.jet?.name || "Jet"}</h2>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <StatusBadge value={b.status} />
          <span style={{ color:"var(--muted)" }}>#{b._id}</span>
        </div>
        <div>Route: <strong>{b.origin}</strong> → <strong>{b.destination}</strong></div>
        <div>Departure: <strong>{new Date(b.departureAt).toLocaleString()}</strong></div>
        <div>Arrival: <strong>{new Date(b.arrivalAt).toLocaleString()}</strong></div>
        <div>Flight Hours: <strong>{b.flightHours}</strong></div>
        <div>Price: <strong>${(b.priceUSD||0).toLocaleString()}</strong></div>
        {b.notes ? <p style={{marginTop:8}}>Notes: {b.notes}</p> : null}
      </div>

      <Timeline items={b.statusHistory || []} />
    </div>
  );
}
