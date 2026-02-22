"use client";

export default function Schedule() {
  const days = [
    { title: "Day 1", desc: "Opening Ceremony & Workshops" },
    { title: "Day 2", desc: "Competitions & Final Presentations" },
    { title: "Day 3", desc: "Networking & Closing Ceremony" },
  ];

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
