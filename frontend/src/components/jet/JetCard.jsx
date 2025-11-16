import React from "react";
import { Link } from "react-router-dom";
import { jetImageByModel, jetImageByCategory } from "../../data/jetImages.js";

export default function JetCard({ jet }) {
  const image = 
    (jet.images && jet.images[0]) ||
    jetImageByModel[jet.name] ||
    jetImageByCategory[jet.category] ||
    jetImageByCategory.Heavy;

  return (
    <Link to={`/fleet/${jet._id}`} className="jet-card card">
      <div className="jet-card-image" style={{ height: 200, overflow: "hidden", borderRadius: "8px 8px 0 0" }}>
        <img 
          src={image} 
          alt={jet.name} 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: 16, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{jet.name}</h3>
          <span className="badge">{jet.category}</span>
        </div>
        <div style={{ color: "var(--muted)", fontSize: 14 }}>
          {jet.manufacturer || "Premium Jet"}
        </div>
        <ul className="jet-specs" style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", gap: 12, fontSize: 14 }}>
          <li><strong>{jet.seats}</strong> seats</li>
          <li><strong>{jet.rangeNM || jet.rangeNm}</strong> nm</li>
        </ul>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>From</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              ${jet.hourlyRate?.toLocaleString()}/hr
            </div>
          </div>
          <span className="btn btn-primary btn-sm">View Details</span>
        </div>
      </div>
    </Link>
  );
}