import React, { useEffect, useState } from "react";
import { fetchFeaturedJets } from "../../api/jets.js";
import JetCard from "../jet/JetCard.jsx";

export default function FeaturedJets() {
  const [jets, setJets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJets();
  }, []);

  const loadJets = async () => {
    try {
      const data = await fetchFeaturedJets(6);
      setJets(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error("Failed to load featured jets:", error);
      setJets([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card" style={{ height: 400, background: "rgba(255,255,255,0.03)" }} />
        ))}
      </div>
    );
  }

  if (jets.length === 0) {
    return (
      <div className="card" style={{ padding: 48, textAlign: "center" }}>
        <p style={{ color: "var(--muted)" }}>No featured jets available at the moment.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {jets.map(jet => (
        <JetCard key={jet._id} jet={jet} />
      ))}
    </div>
  );
}