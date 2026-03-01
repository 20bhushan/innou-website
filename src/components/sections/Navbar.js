"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

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
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [open]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo → goes to homepage */}
        <Link href="/" className="logo">
          <img src="/logoIcon.png" alt="INNOU Logo" className="nav-logo" />
          <div className="logo-text">
            <span className="para">INNOU</span>
            <span className="gradient-text">1.0</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <ul ref={navRef} className={`nav-links ${open ? "show" : ""}`}>
          <li>
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>

          <li>
            <Link href="/schedule" onClick={() => setOpen(false)}>
              Schedule
            </Link>
          </li>

          <li>
            <Link href="/competitions" onClick={() => setOpen(false)}>
              Competitions
            </Link>
          </li>

          <li>
            <Link href="/sponsors" onClick={() => setOpen(false)}>
              Sponsors
            </Link>
          </li>

          <li>
            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Register Button */}
        <a
          href="https://forms.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary register-btn"
        >
          Register Now
        </a>

        {/* Hamburger */}
        <div className="hamburger" onClick={() => setOpen((prev) => !prev)}>
          ☰
        </div>
      </div>
    </nav>
  );
}
