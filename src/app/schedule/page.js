import "./schedule-page.css";
import { eventConfig } from "@/config/eventConfig";
import {
  LuActivity,
  LuBug,
  LuGamepad2,
  LuKeyboard,
  LuLaptop,
  LuLightbulb,
  LuMapPin,
  LuMic,
  LuSparkles,
  LuTrophy,
} from "react-icons/lu";
export default function SchedulePage() {
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
                      {Icon && <Icon size={18} color="var(--neon-cyan)"/>}
                      {event.text}
                    </li>
                  );
                })}

              <p className="schedule-venue"><LuMapPin size={18}/>{day.venue}</p>
            </div>


          </div>
        ))}

      </div>

    </main>
  );
}
