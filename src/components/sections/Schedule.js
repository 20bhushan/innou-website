"use client";

import { eventConfig } from "@/config/eventConfig";
import { Keyboard, Bug,Laptop,Activity,Mic,Trophy, Lightbulb, Gamepad2, Sparkles, MapPin, Calendar } from "lucide-react";
export default function Schedule() {
  const days = eventConfig.schedule || [];

  return (
    <section id="schedule" className="timeline-section reveal">
      <h2 className="section-title">Schedule</h2>

      <div className="circle-wrapper">
        <div className="circle-track">
          {days.map((d, i) => (
            <div key={i} className="track-card">
              <h3>{d.day}</h3>

              <p className="date"><Calendar size={16} />{d.date}</p>

              <ul>
                {d.events.map((e, index) => (
                  <li key={index}>

                    {e.type === "keyboard" && <Keyboard size={16} />}
                    {e.type === "bug" && <Bug size={16} />}
                    {e.type === "laptop" && <Laptop size={16} />}
                    {e.type === "activity" && <Activity size={16} />}
                    {e.type === "lightbulb" && <Lightbulb size={16} />}
                    {e.type === "mic" && <Mic size={16} />}
                    {e.type === "trophy" && <Trophy size={16} />}
                    {e.type === "gamepad" && <Gamepad2 size={16} />}
                    {e.type === "sparkles" && <Sparkles size={16} />}

                    {e.text}

                  </li>
                ))}
              </ul>

              <p className="venue"><MapPin size={16} />{d.venue}</p>
            </div>

          ))}

          {days.map((d, i) => (
            <div key={i} className="track-card">
              <h3>{d.day}</h3>

              <p className="date"><Calendar size={16} />{d.date}</p>

              <ul>
                {d.events.map((e, index) => (
                  <li key={index}>

                    {e.type === "keyboard" && <Keyboard size={16} />}
                    {e.type === "bug" && <Bug size={16} />}
                    {e.type === "laptop" && <Laptop size={16} />}
                    {e.type === "activity" && <Activity size={16} />}
                    {e.type === "lightbulb" && <Lightbulb size={16} />}
                    {e.type === "mic" && <Mic size={16} />}
                    {e.type === "trophy" && <Trophy size={16} />}
                    {e.type === "gamepad" && <Gamepad2 size={16} />}
                    {e.type === "sparkles" && <Sparkles size={16} />}

                    {e.text}

                  </li>
                ))}
              </ul>

              <p className="venue"><MapPin size={16} />{d.venue}</p>
            </div>

          ))}
        </div>
      </div>
    </section>
  );
}
