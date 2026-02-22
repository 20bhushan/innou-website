"use client";

import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (open && navRef.current && !navRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [open]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <img src="/logoIcon.png" alt="INNOU Logo" className="nav-logo" />
          <div className="logo-text">
            <span className="para">INNOU</span>
            <span className="gradient-text">1.0</span>
          </div>
        </div>

        {/* IMPORTANT: ref only on nav-links wrapper */}
        <ul ref={navRef} className={`nav-links ${open ? "show" : ""}`}>
          <li>
            <a href="#home" onClick={() => setOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#home-events" onClick={() => setOpen(false)}>
              Events
            </a>
          </li>
          <li>
            <a href="#competitions" onClick={() => setOpen(false)}>
              Competitions
            </a>
          </li>
          <li>
            <a href="#sponsors" onClick={() => setOpen(false)}>
              Sponsors
            </a>
          </li>
          <li>
            <a href="#contact" onClick={() => setOpen(false)}>
              Contact
            </a>
          </li>
        </ul>
        {/* Register Button - Desktop */}
        <a href="#register" className="btn-primary register-btn">
          Register Now
        </a>
        <div className="hamburger" onClick={() => setOpen((prev) => !prev)}>
          ☰
        </div>
      </div>
    </nav>
  );
}
