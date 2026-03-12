"use client";
import "./sponsors.css";
import { eventConfig } from "@/config/eventConfig";

export default function Sponsors() {
  const sponsors = eventConfig.sponsors || [];

  return (
    <section id="sponsors" className="tracks reveal">
      <h2 className="section-title">Sponsors</h2>

      <div className="circle-wrapper">
        <div className="circle-track">
          {sponsors.map((s, i) => (
            <div key={i} className="track-card sponsor">
              {s.name}
            </div>
          ))}

          {sponsors.map((s, i) => (
            <div key={"dup" + i} className="track-card sponsor">
              {s.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
