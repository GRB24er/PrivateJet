import React from "react";

export default function Timeline({ items = [] }) {
  // items: [{ status, at, by? }]
  return (
    <div className="card" style={{ padding: 16 }}>
      <h3 style={{ margin: "0 0 8px 0" }}>Status Timeline</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {items.length === 0 && <div>No history.</div>}
        {items.map((it, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {new Date(it.at).toLocaleString()}
            </div>
            <div>
              <strong>{it.status}</strong>
              {it.by?.name ? <span style={{ marginLeft: 8, color: "var(--muted)" }}>by {it.by.name}</span> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
