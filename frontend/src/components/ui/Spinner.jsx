import React from "react";

export default function Spinner({ size = 20 }) {
  const s = `${size}px`;
  return (
    <span
      style={{ width: s, height: s }}
      className="inline-block animate-spin rounded-full border-2 border-white/30 border-t-brand-gold align-middle"
    />
  );
}
