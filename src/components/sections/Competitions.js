"use client";

import Link from "next/link";
import { rulesData } from "@/data/rulesData";

export default function Competitions({ marquee = false }) {
  const events = Object.entries(rulesData);

  const renderCard = ([key, event], isDuplicate = false) => (
    <div
      key={isDuplicate ? `dup-${key}` : key}
      className={`track-card event-${key}`}
      aria-hidden={isDuplicate ? "true" : undefined}
    >
      <h3>{event.title}</h3>
      <p>{event.subtitle}</p>
      <Link
        href={`/rules/${key}`}
        className="rules-btn"
        tabIndex={isDuplicate ? -1 : undefined}
      >
        Rules
      </Link>
    </div>
  );

  return (
    <section id="competitions" className="competitions">
      <h2 className="section-title">All Events</h2>

      {marquee ? (
        <div className="circle-wrapper">
          <div className="circle-track">
            {events.map((entry) => renderCard(entry))}
            {events.map((entry) => renderCard(entry, true))}
          </div>
        </div>
      ) : (
        <div className="track-grid">
          {events.map((entry) => renderCard(entry))}
        </div>
      )}
    </section>
  );
}
