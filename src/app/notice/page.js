import "./notice.css";
import Image from "next/image";

export default function NoticePage() {
  return (
    <main className="notice-page">
      <div className="notice-bg-glow"></div>

      <div className="notice-container">
        <div className="notice-card">

          <span className="notice-badge">⚠ Official Notice</span>

          <h1 className="notice-title">
            INNOU <span>1.0</span> Postponed
          </h1>

          <p className="notice-text">
            It is hereby informed to all the participants of INNOU 1.0 that the
            festival scheduled from <strong>19th April 2026 to 25th April 2026</strong>
            has been postponed until further notice due to the ongoing situation in the state.
          </p>

          <p className="notice-sub">
            New dates will be announced soon.
          </p>

          <div className="notice-image">
            <Image
              src="/images/innou-notice.jpg"
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
