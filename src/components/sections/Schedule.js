"use client";
import "./schedule.css";
import { eventConfig } from "@/config/eventConfig";

import {
  Keyboard,
  Bug,
  Laptop,
  Activity,
  Mic,
  Trophy,
  Lightbulb,
  Gamepad2,
  Sparkles,
  MapPin,
  Calendar
} from "lucide-react";

export default function Schedule() {
  const days = eventConfig.schedule || [];

  // Icon mapping (clean professional way)
  const iconMap = {
    keyboard: Keyboard,
    bug: Bug,
    laptop: Laptop,
    activity: Activity,
    mic: Mic,
    trophy: Trophy,
    lightbulb: Lightbulb,
    gamepad: Gamepad2,
    sparkles: Sparkles
  };

  return (
    <section id="schedule" className="timeline-section reveal">
      <h2 className="section-title">Schedule</h2>

      <div className="circle-wrapper">
        <div className="circle-track">

          {days.map((d, i) => (
            <div key={i} className="track-card">

              <h3>{d.day}</h3>

              <p className="date">
                <Calendar size={16} />
                {d.date}
              </p>

              <ul>
                {d.events.map((e, index) => {
                  const Icon = iconMap[e.type];

                  return (
                    <li key={index}>
                      {Icon && <Icon size={16} color="var(--neon-cyan)"strokeWidth={2.5} />}
                      {e.text}
                    </li>
                  );
                })}
              </ul>

              <p className="venue">
                <MapPin size={16} />
                {d.venue}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
