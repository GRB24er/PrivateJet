import React from "react";

export default function ValueProps() {
  const props = [
    {
      icon: "🛡️",
      title: "Safety First",
      description: "ARGUS Platinum certified operators. Rigorous audits. Zero compromise on safety standards."
    },
    {
      icon: "⚡",
      title: "Instant Availability",
      description: "Access 250+ aircraft worldwide. Ready to depart in under 2 hours with our rapid dispatch service."
    },
    {
      icon: "💎",
      title: "White-Glove Service",
      description: "Dedicated flight concierge. Customized catering. Ground transportation. Every detail perfected."
    },
    {
      icon: "🌍",
      title: "Global Reach",
      description: "Worldwide coverage. 24/7 operations center. Seamless international clearances and handling."
    }
  ];

  return (
    <section className="value-props-section" style={{ padding: "80px 0", background: "rgba(0,0,0,0.2)" }}>
      <div className="container-xl">
        <div className="section-header-luxury" style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">WHY CHOOSE ATF</span>
          <h2 className="section-title">The ATF Difference</h2>
          <p className="section-subtitle">
            Uncompromising excellence in every flight
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {props.map((prop, index) => (
            <div key={index} className="card" style={{ padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{prop.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{prop.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
                {prop.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}