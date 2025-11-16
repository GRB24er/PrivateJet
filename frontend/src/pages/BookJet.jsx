// frontend/src/pages/BookJet.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { fetchJet } from "../api/jets.js";
import { checkAvailability, createBooking } from "../api/bookings.js";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";
import Input, { Label } from "../components/ui/Input.jsx";
import toast from "react-hot-toast";

export default function BookJet() {
  const { id } = useParams(); // jet id
  const { isAuthed } = useAuth();
  const nav = useNavigate();

  const [jet, setJet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departureAt: "",  // "yyyy-MM-ddTHH:mm"
    arrivalAt: ""     // "yyyy-MM-ddTHH:mm"
  });
  const [availability, setAvailability] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const j = await fetchJet(id);
        setJet(j);
      } catch {
        setJet(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!id) return <div className="container-xl">Not found</div>;
  if (loading) return <div className="container-xl">Loading…</div>;
  if (!jet) return <div className="container-xl">Not found</div>;

  const toISO = (v) => new Date(v).toISOString();

  const validRange = () => {
    if (!form.departureAt || !form.arrivalAt) return false;
    const start = new Date(form.departureAt);
    const end = new Date(form.arrivalAt);
    return end > start;
  };

  const ensureValid = () => {
    if (!form.origin || !form.destination || !form.departureAt || !form.arrivalAt) {
      toast.error("Fill all fields first");
      return false;
    }
    if (!validRange()) {
      toast.error("Arrival must be AFTER departure (check date & year).");
      return false;
    }
    return true;
  };

  const check = async () => {
    if (!ensureValid()) return;
    try {
      const data = await checkAvailability({
        jetId: id,
        from: toISO(form.departureAt),
        to:   toISO(form.arrivalAt)
      });
      setAvailability(data);
      toast[data.available ? "success" : "error"](data.available ? "Available" : "Not available");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Check failed");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!ensureValid()) return;
    if (!isAuthed) { nav('/login', { state: { from: `/book/${id}` } }); return; }

    setSubmitting(true);
    try {
      await createBooking({
        jet: id,
        origin: form.origin,
        destination: form.destination,
        departureAt: toISO(form.departureAt),
        arrivalAt:   toISO(form.arrivalAt)
      });
      toast.success("Booking created");
      nav('/trips');
    } catch (e2) {
      toast.error(e2?.response?.data?.message || "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  // convenience: prevent choosing arrival before departure
  const arrivalMin = form.departureAt || undefined;

  return (
    <div className="container-xl" style={{ display:"grid", gap:16 }}>
      <Link to={`/fleet/${id}`} className="btn btn-ghost">← Back to Jet</Link>
      <h2 style={{ margin:0, fontWeight:800, fontSize:24 }}>Book • {jet.name}</h2>

      <form onSubmit={submit} className="card" style={{ padding:16, display:"grid", gap:12, maxWidth:680 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <Label>Origin (ICAO/IATA)</Label>
            <Input value={form.origin} onChange={(e)=>setForm({...form, origin:e.target.value})} placeholder="KTEB" required />
          </div>
          <div>
            <Label>Destination (ICAO/IATA)</Label>
            <Input value={form.destination} onChange={(e)=>setForm({...form, destination:e.target.value})} placeholder="KSFO" required />
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <Label>Departure</Label>
            <Input
              type="datetime-local"
              value={form.departureAt}
              onChange={(e)=>setForm({...form, departureAt:e.target.value, arrivalAt: form.arrivalAt && (new Date(form.arrivalAt) <= new Date(e.target.value) ? "" : form.arrivalAt)})}
              required
            />
          </div>
          <div>
            <Label>Arrival</Label>
            <Input
              type="datetime-local"
              min={arrivalMin}
              value={form.arrivalAt}
              onChange={(e)=>setForm({...form, arrivalAt:e.target.value})}
              required
            />
          </div>
        </div>

        <div style={{ display:"flex", gap:8 }}>
          <Button type="button" variant="ghost" onClick={check}>Check Availability</Button>
          <Button disabled={submitting}>{submitting ? 'Submitting…' : 'Create Booking'}</Button>
        </div>

        {availability && (
          <div style={{ color: availability.available ? 'lime' : '#ff6b6b' }}>
            {availability.available ? 'This time window is available.' : 'Conflicts found.'}
          </div>
        )}
      </form>
    </div>
  );
}
