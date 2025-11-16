import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJet } from "../api/jets.js";
import { jetImageByModel, jetImageByCategory } from "../data/jetImages.js";

export default function FleetDetail() {
  const { id } = useParams();
  const [jet, setJet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const j = await fetchJet(id);
        setJet(j);
      } finally {
        setLoading(false);
      }
    })();
  },[id]);

  const gallery = useMemo(()=>{
    if (!jet) return [];
    const cover =
      (jet.images && jet.images[0]) ||
      jetImageByModel[jet.name] ||
      jetImageByCategory[jet.category] ||
      jetImageByCategory.Heavy;

    const extras = (jet.images || []).slice(1);
    return [cover, ...extras].filter(Boolean);
  },[jet]);

  if (loading) return <div className="container-xl">Loading…</div>;
  if (!jet) return <div className="container-xl">Not found</div>;

  return (
    <div className="container-xl" style={{ display:"grid", gap:16 }}>
      <Link to="/fleet" className="btn btn-ghost">← Back to Fleet</Link>

      <div className="card" style={{ padding: 0 }}>
        {gallery.length > 0 && (
          <div style={{ height: 360, overflow: "hidden", borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
            <img src={gallery[0]} alt={jet.name} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
          </div>
        )}
        <div style={{ padding:16, display:"grid", gap:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
            <h2 style={{ margin:0 }}>{jet.name}</h2>
            <span className="badge">{jet.category}</span>
          </div>
          <div style={{ color:"var(--muted)" }}>{jet.manufacturer} • Base: {jet.baseAirport || "HQ"}</div>
          <ul className="jet-specs">
            <li><strong>{jet.seats}</strong> seats</li>
            <li><strong>{jet.rangeNM}</strong> nm</li>
            <li><strong>{jet.speedKts}</strong> kts</li>
            <li><strong>${jet.hourlyRate.toLocaleString()}</strong>/hr</li>
          </ul>
          <p style={{ margin:"6px 0 0 0" }}>{jet.description || "Premium private charter aircraft."}</p>

          {gallery.length > 1 && (
            <div style={{ display:"grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap:10 }}>
              {gallery.slice(1).map((g, i)=>(
                <div key={i} className="card" style={{ padding:0, overflow:"hidden" }}>
                  <img src={g} alt={`${jet.name} ${i+2}`} style={{ width:"100%", height:120, objectFit:"cover" }}/>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:"flex", gap:8 }}>
            <Link to={`/book/${jet._id}`} className="btn btn-primary">Book this Jet</Link>
            <Link to="/fleet" className="btn btn-ghost">More Aircraft</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
