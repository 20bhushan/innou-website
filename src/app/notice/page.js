import "./notice.css";
import Image from "next/image";

export default function NoticePage() {
  return (
    <main className="notice-page">
      <div className="notice-bg-glow"></div>

      <div className="notice-container">
        <div className="notice-card">
          <span className="notice-badge">📢 Official Update</span>

          <h1 className="notice-title">
            INNOU <span>1.0</span> Rescheduled
          </h1>

          <p className="notice-text">
            It is hereby informed to all stakeholders of INNOU 1.0 that the
            festival, which was previously postponed due to the law and order
            situation in the state, is scheduled to resume from{" "}
            <strong>6th June 2026 to 13th June 2026</strong>.
          </p>

          <p className="notice-sub">
            Participants are requested to refer to the official notice and
            updated schedule for complete details.
          </p>

          <div className="notice-image">
            <Image
              src="/images/innou-notice2.jpg"
              alt="Official Notice"
              width={900}
              height={1200}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
