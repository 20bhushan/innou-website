"use client";

import "./competitions.css";
import Link from "next/link";
import { rulesData } from "@/data/rulesData";
import { getEventVisual } from "@/lib/helpers";

export default function Competitions({ marquee = false }) {
  const events = Object.entries(rulesData);

  const renderCard = ([key, event], isDuplicate = false) => {
    const visual = getEventVisual(key) || {};

    return (
      <div
        key={isDuplicate ? `dup-${key}` : key}
        className={`track-card event-${visual.classKey || key}`}
        aria-hidden={isDuplicate ? "true" : undefined}
      >
        <div
          className="track-card-bg"
          style={{
            backgroundImage: `url(${visual.image || "/images/default-event.png"})`,
          }}
        />
        <div className="track-card-overlay" />
        <div className="track-card-glow" />

        <div className="track-card-content">
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
      </div>
    );
  };

  return (
    <section id="competitions" className="competitions section-shell">
      <h2 className="section-title">All Events</h2>

      {marquee ? (
        <div className="competitions-scroll-shell">
          <div className="competitions-track">
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
