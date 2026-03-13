"use client";
import "./schedule.css";
import { eventConfig } from "@/config/eventConfig";

import {
  LuActivity,
  LuBug,
  LuCalendar,
  LuGamepad2,
  LuKeyboard,
  LuLaptop,
  LuLightbulb,
  LuMapPin,
  LuMic,
  LuSparkles,
  LuTrophy,
} from "react-icons/lu";

export default function Schedule() {
  const days = eventConfig.schedule || [];

  // Icon mapping (clean professional way)
  const iconMap = {
    keyboard: LuKeyboard,
    bug: LuBug,
    laptop: LuLaptop,
    activity: LuActivity,
    mic: LuMic,
    trophy: LuTrophy,
    lightbulb: LuLightbulb,
    gamepad: LuGamepad2,
    sparkles: LuSparkles
  };

  return (
    <section id="schedule" className="timeline-section reveal section-shell">
      <h2 className="section-title">Schedule</h2>

      <div className="schedule-scroll">
        <div className="schedule-track">

          {days.map((d, i) => (
            <article key={i} className="track-card">

              <h3>{d.day}</h3>

              <p className="date">
                <LuCalendar size={16} />
                {d.date}
              </p>

              <ul>
                {d.events.map((e, index) => {
                  const Icon = iconMap[e.type];

                  return (
                    <li key={index}>
                      {Icon && <Icon size={16} color="var(--neon-cyan)" />}
                      {e.text}
                    </li>
                  );
                })}
              </ul>

              <p className="venue">
                <LuMapPin size={16} />
                {d.venue}
              </p>

            </article>
          ))}

        </div>
      </div>
    </section>
  );
}
