"use client";

import Link from "next/link";
import { rulesData } from "@/data/rulesData";

export default function Competitions() {
  return (
    <section id="competitions" className="competitions">
      <h2 className="section-title">All Events</h2>

      <div className="track-grid">
        {Object.entries(rulesData).map(([key, event]) => (
          <div key={key} className={`track-card event-${key}`}>
            <h3>{event.title}</h3>

            <p>{event.subtitle}</p>

            <Link href={`/rules/${key}`} className="rules-btn">
              Rules
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
