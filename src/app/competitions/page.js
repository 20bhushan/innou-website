"use client";

import { useEffect } from "react";
import Link from "next/link";
import { rulesData } from "@/data/rulesData";

export default function Competitions() {
  useEffect(() => {
    const cards = document.querySelectorAll(".track-card");

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = ((y - rect.height / 2) / rect.height) * 8;
        const rotateY = ((x - rect.width / 2) / rect.width) * -8;

        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }, []);

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
