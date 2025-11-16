import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchJets } from "../api/jets.js";
import JetCard from "../components/jet/JetCard.jsx";

const CATEGORIES = ["Light", "Midsize", "Heavy", "UltraLong"];

export default function FleetList() {
  const [searchParams] = useSearchParams();
  const [jets, setJets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: "",
    onlyAvailable: true,
  });

  useEffect(() => {
    loadJets();
  }, []);

  const loadJets = async () => {
    try {
      setLoading(true);
      const data = await fetchJets({ onlyAvailable: filters.onlyAvailable });
      setJets(data.items || []);
    } catch (err) {
      setError(err.message || "Failed to load fleet");
    } finally {
      setLoading(false);
    }
  };

  const filteredJets = useMemo(() => {
    let result = [...jets];

    if (filters.category) {
      result = result.filter(j => j.category === filters.category);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(j => 
        j.name.toLowerCase().includes(search) ||
        j.manufacturer?.toLowerCase().includes(search)
      );
    }

    return result;
  }, [jets, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      search: "",
      onlyAvailable: true,
    });
  };

  if (loading) {
    return (
      <div className="container-xl" style={{ padding: "48px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card" style={{ height: 400, background: "rgba(255,255,255,0.03)" }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-xl" style={{ padding: "48px 0", textAlign: "center" }}>
        <h2>Unable to load fleet</h2>
        <p style={{ color: "var(--muted)" }}>{error}</p>
        <button onClick={loadJets} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="container-xl" style={{ display: "grid", gap: 24, padding: "32px 0" }}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Our Fleet</h2>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>
            {filteredJets.length} aircraft available
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          <input
            type="text"
            className="input"
            placeholder="Search aircraft..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          <select
            className="input"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={filters.onlyAvailable}
              onChange={(e) => handleFilterChange("onlyAvailable", e.target.checked)}
            />
            <span>Only available</span>
          </label>
          <button className="btn btn-ghost" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      {filteredJets.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <h3>No aircraft match your criteria</h3>
          <p style={{ color: "var(--muted)" }}>Try adjusting your filters</p>
          <button onClick={resetFilters} className="btn btn-primary">Reset Filters</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {filteredJets.map(jet => (
            <JetCard key={jet._id} jet={jet} />
          ))}
        </div>
      )}
    </div>
  );
}