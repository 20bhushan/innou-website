"use client";

import { rulesData } from "@/data/rulesData";
import Link from "next/link";

export default function RulesPage({ params }) {
  const event = rulesData[params.event];

  if (!event) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h1>Rules Not Found</h1>
      </div>
    );
  }

  return (
    <div
      className="rules-body"
      style={{
        "--accent-color": event.color,
        "--accent-glow": event.color,
        "--accent-low": event.color + "33",
      }}
    >
      {/* NAVBAR */}

      <nav className="rules-nav">
        <div className="nav-container">
          <Link href="/competitions" className="nav-back">
            ← Back
          </Link>

          <div className="nav-title">{event.title} Rules</div>

          <a href="#" className="nav-register">
            Register
          </a>
        </div>
      </nav>

      {/* HEADER */}

      <header className="rules-header">
        <h1 className="rules-title">{event.title}</h1>

        <p className="rules-subtitle">{event.subtitle}</p>
      </header>

      {/* RULES GRID */}

      <section className="rules-grid">
        {event.rules.map((rule, index) => (
          <div key={index} className="rule-card">
            <h3>{rule.title}</h3>

            <ul>
              {rule.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
