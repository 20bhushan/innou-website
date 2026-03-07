"use client";

import { eventConfig } from "@/config/eventConfig";

export default function Schedule() {
  const days = eventConfig.schedule || [];

  return (
    <section id="schedule" className="timeline-section reveal">
      <h2 className="section-title">Schedule</h2>

      <div className="circle-wrapper">
        <div className="circle-track">
          {days.map((d, i) => (
            <div key={i} className="track-card">
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}

          {days.map((d, i) => (
            <div key={"dup" + i} className="track-card">
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
