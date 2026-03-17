"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image"
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hideOnRulesPage = pathname?.startsWith("/rules/");
useEffect(() => {
  const updateColor = () => {
    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--accent-color");

    document.documentElement.style.setProperty("--accent-color", color);
  };

  window.addEventListener("scroll", updateColor);

  return () => window.removeEventListener("scroll", updateColor);
}, []);


  if (hideOnRulesPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link href="/" className="logo">
        <Image src="/newLogo3.png" 
        width={80}
        height={80}
        className="nav-logo" alt="INNOU logo"
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
          href="/competitions"
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

