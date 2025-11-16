import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const { isAuthed, user, logout } = useAuth();
  const nav = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [fleetOpen, setFleetOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target) && !toggleRef.current.contains(e.target)) {
        setOpen(false);
        setFleetOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setFleetOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const navClass = ({ isActive }) => (isActive ? "active" : "");
  const leave = async () => {
    try { await logout(); } finally { nav("/login"); }
  };
  const closeAll = () => { setOpen(false); setFleetOpen(false); };

  const FleetMega = () => (
    <div
      className={`mega ${fleetOpen ? "open" : ""}`}
      role="menu"
      aria-label="Fleet categories"
      onMouseLeave={() => setFleetOpen(false)}
    >
      <div className="mega-grid">
        <div className="mega-col">
          <h5>Light Jets</h5>
          <p className="text-sm text-brand-muted">Regional excellence</p>
          <ul>
            <li><Link to="/fleet?category=Light" onClick={closeAll}>Citation CJ4</Link></li>
            <li><Link to="/fleet?category=Light" onClick={closeAll}>Phenom 300</Link></li>
            <li><Link to="/fleet?category=Light" onClick={closeAll}>Learjet 75</Link></li>
          </ul>
        </div>
        <div className="mega-col">
          <h5>Midsize</h5>
          <p className="text-sm text-brand-muted">Transcontinental range</p>
          <ul>
            <li><Link to="/fleet?category=Midsize" onClick={closeAll}>Challenger 350</Link></li>
            <li><Link to="/fleet?category=Midsize" onClick={closeAll}>Citation X</Link></li>
            <li><Link to="/fleet?category=Midsize" onClick={closeAll}>Hawker 4000</Link></li>
          </ul>
        </div>
        <div className="mega-col">
          <h5>Heavy</h5>
          <p className="text-sm text-brand-muted">Long-range capability</p>
          <ul>
            <li><Link to="/fleet?category=Heavy" onClick={closeAll}>Gulfstream G450</Link></li>
            <li><Link to="/fleet?category=Heavy" onClick={closeAll}>Falcon 900</Link></li>
            <li><Link to="/fleet?category=Heavy" onClick={closeAll}>Legacy 650</Link></li>
          </ul>
        </div>
        <div className="mega-col">
          <h5>Ultra-Long Range</h5>
          <p className="text-sm text-brand-muted">Global reach</p>
          <ul>
            <li><Link to="/fleet?category=UltraLong" onClick={closeAll}>G650ER</Link></li>
            <li><Link to="/fleet?category=UltraLong" onClick={closeAll}>Global 7500</Link></li>
            <li><Link to="/fleet?category=UltraLong" onClick={closeAll}>Falcon 8X</Link></li>
          </ul>
        </div>
      </div>
      <div className="mega-aside">
        <div className="mega-feature">
          <h6>Why ATF Jets</h6>
          <p>Mission-matched aircraft. Audited operators. 24/7 dispatch support.</p>
          <Link to="/fleet" className="btn btn-primary" onClick={closeAll}>
            Explore Full Fleet
          </Link>
        </div>
        <div className="mega-stats">
          <div className="stat-item">
            <div className="stat-value">250+</div>
            <div className="stat-label">Aircraft Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">99.8%</div>
            <div className="stat-label">On-Time Performance</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container-xl header-inner">
        <Link to="/" className="brand" onClick={closeAll} aria-label="ATF Jets home">
          <span className="brand-icon" aria-hidden>✈</span>
          <span className="brand-text">
            <span className="brand-name">ATF Jets</span>
            <span className="brand-tagline">Enterprise Charter</span>
          </span>
        </Link>

        <button
          ref={toggleRef}
          className={`nav-toggle ${open ? "open" : ""}`}
          aria-expanded={open}
          aria-controls="mainnav"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>

        <nav id="mainnav" className={`nav ${open ? "open" : ""}`} ref={menuRef}>
          <NavLink to="/" end className={navClass} onClick={closeAll}>Home</NavLink>

          <div
            className={`nav-group ${fleetOpen ? "open" : ""}`}
            onMouseEnter={() => setFleetOpen(true)}
          >
            <button
              className="nav-link"
              aria-haspopup="true"
              aria-expanded={fleetOpen}
              onClick={() => setFleetOpen((v) => !v)}
              onKeyDown={(e) => { if (e.key === "ArrowDown") setFleetOpen(true); }}
            >
              Fleet
              <span className="chev" aria-hidden>▾</span>
            </button>
            <FleetMega />
          </div>

          <NavLink to="/dashboard" className={navClass} onClick={closeAll}>Dashboard</NavLink>
          {isAuthed && <NavLink to="/trips" className={navClass} onClick={closeAll}>My Trips</NavLink>}
          <NavLink to="/about" className={navClass} onClick={closeAll}>About</NavLink>
          <NavLink to="/contact" className={navClass} onClick={closeAll}>Contact</NavLink>

          {isAuthed && user?.role === "admin" && (
            <div className="nav-admin">
              <NavLink to="/admin" className={navClass} onClick={closeAll}>Admin</NavLink>
              <NavLink to="/admin/fleet" className={navClass} onClick={closeAll}>Fleet Mgmt</NavLink>
              <NavLink to="/admin/bookings" className={navClass} onClick={closeAll}>Bookings</NavLink>
            </div>
          )}
        </nav>

        <div className="header-actions">
          {isAuthed ? (
            <details className="user-dd">
              <summary className="badge" role="button" aria-label="Account menu">
                <span className="user-avatar">{(user?.name || "U").charAt(0).toUpperCase()}</span>
                <span className="user-name">{user?.name || "User"}</span>
              </summary>
              <div className="user-menu" role="menu">
                <div className="user-menu-header">
                  <div className="user-menu-name">{user?.name}</div>
                  <div className="user-menu-email text-sm text-brand-muted">{user?.email}</div>
                </div>
                <hr />
                <Link to="/profile" role="menuitem" onClick={closeAll}>
                  <span>Profile Settings</span>
                </Link>
                <Link to="/trips" role="menuitem" onClick={closeAll}>
                  <span>My Trips</span>
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" role="menuitem" onClick={closeAll}>
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <hr />
                <button className="btn btn-ghost w-100" onClick={leave}>Logout</button>
              </div>
            </details>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={closeAll}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={closeAll}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}