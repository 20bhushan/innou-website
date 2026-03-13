"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hideOnRulesPage = pathname?.startsWith("/rules/");

  useEffect(() => {
    const colors = {
      "/": "#00f2ff",
      "/schedule": "#ff4d6d",
      "/competitions": "#00ff9d",
      "/sponsors": "#f7c948",
      "/contact": "#ff00e0",
    };

    const color = colors[pathname] || "#00f2ff";
    document.documentElement.style.setProperty("--accent-color", color);
  }, [pathname]);

  if (hideOnRulesPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
          <Image
            src="/logoIcon.png"
            alt="INNOU Logo"
            className="nav-logo"
            width={48}
            height={48}
            priority
          />
          <div className="logo-text">
            <span className="para">INNOU</span>
            <span className="gradient-text">1.0</span>
          </div>
        </Link>

        <ul className={`nav-links ${open ? "show" : ""}`}>
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

        <a
          href="https://forms.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary register-btn"
        >
          Register Now
        </a>

        <button
          type="button"
          className="hamburger"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

