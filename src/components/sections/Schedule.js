"use client";

import "./schedule.css";
import { eventConfig } from "@/config/eventConfig";
import { useEffect, useRef } from "react";
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
  const allDays = [...days, ...days];

  const trackRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let position = 0;
    let speed = 0.35;
    let paused = false;

    const pause = () => {
      paused = true;
    };

    const play = () => {
      paused = false;
    };

    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);

    const animate = () => {
      if (!track) return;

      if (!paused) {
        position -= speed;
      }

      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(position) >= halfWidth) {
        position = 0;
      }

      track.style.transform = `translate3d(${position}px, 0, 0)`;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const iconMap = {
    keyboard: LuKeyboard,
    bug: LuBug,
    laptop: LuLaptop,
    activity: LuActivity,
    mic: LuMic,
    trophy: LuTrophy,
    lightbulb: LuLightbulb,
    gamepad: LuGamepad2,
    sparkles: LuSparkles,
  };

  return (
    <section id="schedule" className="timeline-section reveal">
      <div className="schedule-inner">
        <h2 className="section-title">Schedule</h2>

        <div className="schedule-scroll">
          <div className="schedule-track" ref={trackRef}>
            {allDays.map((d, i) => (
              <article key={i} className="track-card">
                <div className="card-glow" />

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
                        <span>{e.text}</span>
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
      </div>
    </section>
  );
}
