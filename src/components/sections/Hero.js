export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-overlay">
        <div className="particles"></div> {/* ✅ inside hero */}
        <div className="title-wrapper">
          <h1 className="main-title">
            INNOU <span className="gradient-text">1.0</span>
          </h1>
          <div className="title-line"></div>
        </div>
        <p className="subtitle">The intersection of Technology & Business</p>
        <div className="cta-group">
          <a href="#home-events" className="btn-primary">
            View Track
          </a>
          <a href="#about" className="btn-outline">
            About Fest
          </a>
        </div>
        <div className="countdown">
          <div>
            <span id="days">00</span>
            <p>Days</p>
          </div>
          <div>
            <span id="hours">00</span>
            <p>Hours</p>
          </div>
          <div>
            <span id="minutes">00</span>
            <p>Minutes</p>
          </div>
          <div>
            <span id="seconds">00</span>
            <p>Seconds</p>
          </div>
        </div>
      </div>
      <div className="particles"></div>
    </section>
  );
}
