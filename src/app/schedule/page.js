import "./schedule-page.css";
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
} from "lucide-react";
export default function SchedulePage() {
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
    <main className="schedule-page">

      <h1 className="schedule-title">Event Schedule</h1>

      <div className="schedule-list">

        {eventConfig.schedule.map((day, index) => (
          <div key={index} className="schedule-item">

            <div className="schedule-day">
              <h2>{day.day}</h2>
              <span>{day.date}</span>
            </div>
            <div className="schedule-events">
              {day.events.map((event, i) => {
                  const Icon = iconMap[event.type];

                  return (
                    <li key={i}>
                      {Icon && <Icon size={18} color="var(--neon-cyan)"strokeWidth={2.5}/>}
                      {event.text}
                    </li>
                  );
                })}

              <p className="schedule-venue"><MapPin size={18}/>{day.venue}</p>
            </div>


          </div>
        ))}

      </div>

    </main>
  );
}
