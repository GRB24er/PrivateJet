import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeaturedJets from "../components/home/FeaturedJets.jsx";
import ValueProps from "../components/home/ValueProps.jsx";
import Testimonials from "../components/home/Testimonials.jsx";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className={`hero-section ${scrolled ? "scrolled" : ""}`}>
        <div className="hero-background">
          <div className="gradient-overlay" />
        </div>

        <div className="container-xl hero-content">
          <div className="hero-badge">
            ✈ Premium Private Charter
          </div>

          <h1 className="hero-headline">
            <span className="headline-line">Enterprise Private</span>
            <span className="headline-line highlight">Charter, <span className="gold-text">On Your</span></span>
            <span className="headline-line">Terms</span>
          </h1>

          <p className="hero-description">
            Experience unparalleled luxury with ATF Jets. From light jets to ultra-long range, 
            we deliver seamless, secure, and sophisticated private aviation solutions worldwide.
          </p>

          <div className="hero-actions">
            <Link to="/fleet" className="btn-luxury-primary btn-large">
              <span className="btn-icon">✈️</span>
              Explore Fleet
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/dashboard" className="btn-luxury-outline btn-large">
              <span className="btn-icon">📊</span>
              Dashboard
            </Link>
          </div>

          {/* Live Stats */}
          <div className="hero-stats-luxury">
            <div className="stat-item-luxury">
              <div className="stat-icon">🌍</div>
              <div className="stat-content">
                <div className="luxury-counter">7500 nm</div>
                <span className="stat-label">Max Range</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item-luxury">
              <div className="stat-icon">⚡</div>
              <div className="stat-content">
                <div className="luxury-counter">&lt; 90 min</div>
                <span className="stat-label">Response Time</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item-luxury">
              <div className="stat-icon">✈️</div>
              <div className="stat-content">
                <div className="luxury-counter">54+</div>
                <span className="stat-label">Aircraft Fleet</span>
              </div>
            </div>
            <div className="stat-divider" />
            <div className="stat-item-luxury">
              <div className="stat-icon">🏅</div>
              <div className="stat-content">
                <div className="luxury-counter">99.8%</div>
                <span className="stat-label">Client Satisfaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span className="scroll-text">Scroll to Explore</span>
          <div className="scroll-icon">
            <div className="scroll-wheel" />
          </div>
        </div>
      </section>

      {/* FEATURED FLEET */}
      <section className="luxury-fleet-section">
        <div className="container-xl">
          <div className="section-header-luxury">
            <span className="section-label">OUR FLEET</span>
            <h2 className="section-title">Featured Aircraft</h2>
            <p className="section-subtitle">
              Meticulously maintained, fully certified, and ready for immediate dispatch
            </p>
          </div>

          <FeaturedJets />

          <div className="section-footer">
            <Link to="/fleet" className="btn-luxury-secondary btn-large">
              View Complete Fleet
              <span className="btn-badge">54+ Aircraft</span>
            </Link>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <ValueProps />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* LUXURY CTA */}
      <section className="luxury-cta-section">
        <div className="container-xl">
          <div className="cta-content">
            <h2>Ready to Elevate Your Journey?</h2>
            <p>Join the elite circle of ATF Jets members and experience aviation perfection</p>
            <div className="cta-actions">
              <Link to="/register" className="btn-luxury-primary btn-xlarge">
                Get Started Now
              </Link>
              <a href="tel:+1-800-ATF-JETS" className="cta-phone">
                <span className="phone-icon">📞</span>
                <span className="phone-text">
                  <span className="phone-label">24/7 Support</span>
                  <span className="phone-number">+1-800-ATF-JETS</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}