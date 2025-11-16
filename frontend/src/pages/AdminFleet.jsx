import React, { useEffect, useState } from "react";
import { adminList, createJet, updateJet, deleteJet } from "../api/jets.js";
import { useAuth } from "../context/AuthContext.jsx";

const empty = {
  name:"", manufacturer:"", category:"Light", seats:4, rangeNM:1000, speedKts:350,
  hourlyRate:2000, baseAirport:"", amenities:"", images:"", description:"", isAvailable:true, isActive:true
};

export default function AdminFleet() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminList();
      setItems(data.items);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); }, []);

  const toPayload = () => ({
    ...form,
    seats: Number(form.seats),
    rangeNM: Number(form.rangeNM),
    speedKts: Number(form.speedKts),
    hourlyRate: Number(form.hourlyRate),
    amenities: (form.amenities||"").split(',').map(s=>s.trim()).filter(Boolean),
    images: (form.images||"").split(',').map(s=>s.trim()).filter(Boolean)
  });

  const submit = async (e) => {
    e.preventDefault();
    const payload = toPayload();
    if (editingId) {
      await updateJet(editingId, payload);
    } else {
      await createJet(payload);
    }
    setForm(empty);
    setEditingId(null);
    await load();
  };

  const onEdit = (j) => {
    setEditingId(j._id);
    setForm({
      name:j.name, manufacturer:j.manufacturer||"", category:j.category, seats:j.seats, rangeNM:j.rangeNM,
      speedKts:j.speedKts, hourlyRate:j.hourlyRate, baseAirport:j.baseAirport||"",
      amenities:(j.amenities||[]).join(', '), images:(j.images||[]).join(', '),
      description:j.description||"", isAvailable:j.isAvailable, isActive:j.isActive
    });
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this jet?')) return;
    await deleteJet(id);
    await load();
  };

  if (user?.role !== 'admin') {
    return <div className="container-xl" style={{ padding:"24px 0" }}>Forbidden (admin only)</div>;
  }

  return (
    <div className="container-xl" style={{ display:"grid", gap:16 }}>
      <h2 style={{ margin:0, fontWeight:800, fontSize:24 }}>Admin • Fleet</h2>

      <form onSubmit={submit} className="card" style={{ padding:16, display:"grid", gap:8 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          <input className="input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
          <input className="input" placeholder="Manufacturer" value={form.manufacturer} onChange={(e)=>setForm({...form,manufacturer:e.target.value})} />
          <select className="input" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}>
            <option>Light</option><option>Midsize</option><option>Heavy</option><option>UltraLong</option>
          </select>
          <input className="input" type="number" placeholder="Seats" value={form.seats} onChange={(e)=>setForm({...form,seats:e.target.value})} />
          <input className="input" type="number" placeholder="Range NM" value={form.rangeNM} onChange={(e)=>setForm({...form,rangeNM:e.target.value})} />
          <input className="input" type="number" placeholder="Speed kts" value={form.speedKts} onChange={(e)=>setForm({...form,speedKts:e.target.value})} />
          <input className="input" type="number" placeholder="Hourly USD" value={form.hourlyRate} onChange={(e)=>setForm({...form,hourlyRate:e.target.value})} />
          <input className="input" placeholder="Base Airport (e.g., KTEB)" value={form.baseAirport} onChange={(e)=>setForm({...form,baseAirport:e.target.value})} />
          <select className="input" value={form.isAvailable} onChange={(e)=>setForm({...form,isAvailable:(e.target.value==='true')})}>
            <option value="true">Available</option><option value="false">Not available</option>
          </select>
          <select className="input" value={form.isActive} onChange={(e)=>setForm({...form,isActive:(e.target.value==='true')})}>
            <option value="true">Active (visible)</option><option value="false">Inactive (hidden)</option>
          </select>
        </div>
        <input className="input" placeholder="Amenities (comma-separated)" value={form.amenities} onChange={(e)=>setForm({...form,amenities:e.target.value})} />
        <input className="input" placeholder="Image URLs (comma-separated)" value={form.images} onChange={(e)=>setForm({...form,images:e.target.value})} />
        <textarea className="input" rows="3" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={()=>{ setEditingId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:12 }}>
        {loading ? 'Loading…' : items.map(j => (
          <div key={j._id} className="card" style={{ padding:12, display:"grid", gap:8 }}>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <strong>{j.name}</strong>
              <span className="badge">{j.category}</span>
            </div>
            <div style={{ color:"var(--muted)", fontSize:13 }}>
              Seats {j.seats} • {j.rangeNM} NM • {j.speedKts} kts • ${j.hourlyRate}/hr
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button className="btn btn-ghost" onClick={()=>onEdit(j)}>Edit</button>
              <button className="btn btn-ghost" onClick={()=>onDelete(j._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
