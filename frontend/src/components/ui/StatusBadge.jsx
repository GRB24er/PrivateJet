import React from "react";

const colors = {
  Pending: "#f59e0b",
  Confirmed: "#16a34a",
  Enroute: "#2563eb",
  Completed: "#10b981",
  Cancelled: "#ef4444"
};

export default function StatusBadge({ value }) {
  const bg = colors[value] || "#6b7280";
  return (
    <span className="badge" style={{ background: bg, color: "#fff" }}>{value}</span>
  );
}
