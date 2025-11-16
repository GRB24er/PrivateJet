import React from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed-layer">
      <div className="fixed-backdrop" onClick={onClose} />
      <div className="fixed-card card">
        <div className="modal-head">
          <h4 className="modal-title">{title}</h4>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="card-content">{children}</div>
      </div>
      <style>{`
        .fixed-layer{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;padding:16px}
        .fixed-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6)}
        .fixed-card{position:relative;z-index:10;max-width:640px;width:100%}
        .modal-head{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--stroke);padding:12px 20px}
        .modal-title{margin:0;font-weight:700}
      `}</style>
    </div>
  );
}
