"use client";
import "./home-sponsors.css";
import Image from "next/image";
import { sponsorsData } from "@/data/sponsorsData";

export default function HomeSponsors() {
  return (
    <section id="sponsors" className="tracks reveal section-shell">
      <div className="sponsors-head">
        <h2 className="section-title">Sponsors</h2>
        <p className="sponsors-subtitle">Proud partners supporting INNOU 1.0</p>
      </div>

      <div className="sponsors-grid">
        {sponsorsData.map((s, i) => (
          <a
            key={i}
            href={s.link || "#"}
            target={s.link ? "_blank" : "_self"}
            rel={s.link ? "noopener noreferrer" : undefined}
            className="sponsor-card"
          >
            <div className="sponsor-logo-wrap">
              <Image
                src={s.logo}
                alt={s.name}
                width={240}
                height={120}
                className="sponsor-logo"
              />
            </div>

            <div className="sponsor-info">
              <h3>{s.name}</h3>
              <p>{s.role}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
