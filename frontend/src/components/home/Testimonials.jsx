import React from "react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "ATF Jets transformed our executive travel. The attention to detail and seamless experience is unmatched.",
      author: "Sarah Chen",
      title: "CEO, TechVentures Inc.",
      rating: 5
    },
    {
      quote: "When time is money, ATF delivers. Their rapid response and global network have been invaluable to our operations.",
      author: "Michael Rodriguez",
      title: "COO, Global Finance Partners",
      rating: 5
    },
    {
      quote: "The level of service and professionalism sets a new standard. We trust ATF for all our critical charter needs.",
      author: "James Patterson",
      title: "Managing Director, Heritage Capital",
      rating: 5
    }
  ];

  return (
    <section className="testimonials-section" style={{ padding: "80px 0" }}>
      <div className="container-xl">
        <div className="section-header-luxury" style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">TESTIMONIALS</span>
          <h2 className="section-title">Trusted by Industry Leaders</h2>
          <p className="section-subtitle">
            Join thousands of executives who rely on ATF Jets
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card" style={{ padding: 32 }}>
              <div style={{ marginBottom: 16, color: "#d4af37", fontSize: 20 }}>
                {"★".repeat(testimonial.rating)}
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
                "{testimonial.quote}"
              </p>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{testimonial.author}</div>
                <div style={{ fontSize: 14, color: "var(--muted)" }}>{testimonial.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}