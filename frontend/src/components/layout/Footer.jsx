import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // TODO: Replace with your actual API endpoint
      // await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus('success');
      setEmail("");
      setTimeout(() => setSubmitStatus(null), 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      {/* Top Section - Main Content */}
      <div className="footer-top">
        <div className="container-xl">
          <div className="ft-main-grid">
            {/* Brand Column */}
            <div className="ft-brand-col">
              <div className="ft-brand">
                <div className="ft-logo-wrapper">
                  <div className="ft-logo">✈</div>
                  <div className="ft-brand-text">
                    <div className="ft-name">ATF Jets</div>
                    <div className="ft-tagline">Enterprise Private Charter</div>
                  </div>
                </div>
                <p className="ft-desc">
                  Redefining luxury air travel with mission-critical precision. 
                  Experience unparalleled service backed by ARGUS Platinum standards, 
                  250+ vetted aircraft, and 24/7 global dispatch.
                </p>
              </div>

              {/* Quick Contact */}
              <div className="ft-contact-grid">
                <div className="contact-card">
                  <div className="contact-icon">📞</div>
                  <div className="contact-info">
                    <div className="contact-label">24/7 Charter Desk</div>
                    <a href="tel:+18005551234" className="contact-value">+1 (800) 555-1234</a>
                  </div>
                </div>
                <div className="contact-card">
                  <div className="contact-icon">✉</div>
                  <div className="contact-info">
                    <div className="contact-label">Enterprise Sales</div>
                    <a href="mailto:charter@atfjets.com" className="contact-value">charter@atfjets.com</a>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="ft-trust-badges">
                <div className="trust-item">
                  <div className="trust-badge">
                    <span className="badge-icon">✓</span>
                  </div>
                  <span className="trust-text">ARGUS Platinum</span>
                </div>
                <div className="trust-item">
                  <div className="trust-badge">
                    <span className="badge-icon">✓</span>
                  </div>
                  <span className="trust-text">WYVERN Wingman</span>
                </div>
                <div className="trust-item">
                  <div className="trust-badge">
                    <span className="badge-icon">✓</span>
                  </div>
                  <span className="trust-text">IS-BAO Stage III</span>
                </div>
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="ft-nav-grid">
              <div className="ft-nav-col">
                <h6 className="ft-nav-title">Company</h6>
                <ul className="ft-nav-list">
                  <li><Link to="/about">About ATF Jets</Link></li>
                  <li><Link to="/safety">Safety & Compliance</Link></li>
                  <li><Link to="/leadership">Leadership Team</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/press">Press & Media</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>

              <div className="ft-nav-col">
                <h6 className="ft-nav-title">Solutions</h6>
                <ul className="ft-nav-list">
                  <li><Link to="/charter">On-Demand Charter</Link></li>
                  <li><Link to="/corporate">Corporate Programs</Link></li>
                  <li><Link to="/membership">Jet Card Membership</Link></li>
                  <li><Link to="/aircraft-management">Aircraft Management</Link></li>
                  <li><Link to="/group-travel">Group Travel</Link></li>
                  <li><Link to="/cargo">Air Cargo Services</Link></li>
                </ul>
              </div>

              <div className="ft-nav-col">
                <h6 className="ft-nav-title">Fleet</h6>
                <ul className="ft-nav-list">
                  <li><Link to="/fleet?category=Light">Light Jets</Link></li>
                  <li><Link to="/fleet?category=Midsize">Midsize Jets</Link></li>
                  <li><Link to="/fleet?category=Heavy">Heavy Jets</Link></li>
                  <li><Link to="/fleet?category=SuperMidsize">Super Midsize</Link></li>
                  <li><Link to="/fleet?category=UltraLong">Ultra-Long Range</Link></li>
                  <li><Link to="/fleet">View All Aircraft</Link></li>
                </ul>
              </div>

              <div className="ft-nav-col">
                <h6 className="ft-nav-title">Resources</h6>
                <ul className="ft-nav-list">
                  <li><Link to="/blog">Travel Insights</Link></li>
                  <li><Link to="/destinations">Destination Guide</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                  <li><Link to="/help">Help Center</Link></li>
                  <li><Link to="/downloads">Downloads</Link></li>
                  <li><Link to="/sitemap">Sitemap</Link></li>
                </ul>
              </div>

              <div className="ft-nav-col ft-nav-col-wide">
                <h6 className="ft-nav-title">Stay Connected</h6>
                <p className="ft-newsletter-desc">
                  Join 15,000+ executives receiving exclusive charter offers, 
                  market intelligence, and luxury travel insights.
                </p>
                
                <form className="ft-newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <div className="newsletter-input-group">
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      aria-label="Email address"
                      required
                      disabled={isSubmitting}
                      className={submitStatus ? `status-${submitStatus}` : ''}
                    />
                    <button 
                      type="submit" 
                      className="btn-newsletter"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  {submitStatus === 'success' && (
                    <div className="form-message success">
                      ✓ Thank you for subscribing!
                    </div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="form-message error">
                      × Please try again later
                    </div>
                  )}
                  <p className="newsletter-privacy">
                    By subscribing, you agree to our{" "}
                    <Link to="/privacy">Privacy Policy</Link>
                  </p>
                </form>

                <div className="ft-social-section">
                  <div className="social-title">Follow Us</div>
                  <div className="ft-social-links">
                    <a 
                      href="https://linkedin.com/company/atfjets" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="LinkedIn"
                      className="social-link"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://instagram.com/atfjets" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="Instagram"
                      className="social-link"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://twitter.com/atfjets" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="X (Twitter)"
                      className="social-link"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://facebook.com/atfjets" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="Facebook"
                      className="social-link"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://youtube.com/@atfjets" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label="YouTube"
                      className="social-link"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="footer-stats">
        <div className="container-xl">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">250+</div>
              <div className="stat-label">Aircraft Worldwide</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.8%</div>
              <div className="stat-label">On-Time Performance</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Global Dispatch</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15K+</div>
              <div className="stat-label">Executive Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="container-xl">
          <div className="ft-bottom-content">
            <div className="ft-bottom-left">
              <div className="copyright">
                © {year} ATF Jets Corporation. All rights reserved.
              </div>
              <div className="ft-legal-links">
                <Link to="/terms">Terms of Service</Link>
                <Link to="/privacy">Privacy Policy</Link>
                <Link to="/cookies">Cookie Policy</Link>
                <Link to="/accessibility">Accessibility</Link>
              </div>
            </div>
            <div className="ft-bottom-right">
              <div className="ft-categories">
                Light • Midsize • Heavy • Ultra-Long Range
              </div>
              <div className="ft-compliance">
                <span>DOT Registered</span>
                <span>•</span>
                <span>FAA Certified</span>
                <span>•</span>
                <span>EASA Approved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}