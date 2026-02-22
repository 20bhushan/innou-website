"use client";

export default function Sponsors() {
  const sponsors = [
    { name: "TechCorp" },
    { name: "InnovateX" },
    { name: "FutureLabs" },
    { name: "CodeWorks" },
  ];

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
