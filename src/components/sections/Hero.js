import "./hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg"></div>

      <div className="hero-content section-shell">
        <h1 className="hero-title">
          INNOU <span>1.0</span>
        </h1>

        <p className="hero-subtitle">
          The Intersection of Technology & Business
        </p>

        <div className="hero-buttons">
          <a href="#competitions" className="btn-primary">
            View Events
          </a>

          <a href="#about" className="btn-outline">
            About Fest
          </a>
        </div>
        <div className="hero-register">
          <a href="/competitions" className="btn-register-main">
            Register Now
          </a>
        </div>

        <div className="countdown">
          <div className="count-item">
            <span id="days">00</span>
            <p>Days</p>
          </div>

          <div className="count-item">
            <span id="hours">00</span>
            <p>Hours</p>
          </div>

          <div className="count-item">
            <span id="minutes">00</span>
            <p>Minutes</p>
          </div>

          <div className="count-item">
            <span id="seconds">00</span>
            <p>Seconds</p>
          </div>
        </div>
      </div>
    </section>
  );
}
