// frontend/src/components/admin/Stat.jsx
import React from "react";

export default function Stat({ label, value, hint }) {
  return (
    <div className="card" style={{ padding:16, display:"grid", gap:4 }}>
      <div style={{ color:"var(--muted)", fontSize:12 }}>{label}</div>
      <div style={{ fontWeight:800, fontSize:28 }}>{value}</div>
      {hint ? <div style={{ fontSize:12, color:"var(--muted)" }}>{hint}</div> : null}
    </div>
  );
}
