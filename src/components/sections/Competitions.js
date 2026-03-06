export default function Competitions() {
  return (
    <section id="competitions" className="competitions">
      <h2 className="section-title">All Events</h2>

      <div className="track-grid">
        {/* Hackathon */}
        <div className="track-card event-hackathon">
          <h3>Smart Campus Hackathon</h3>
          <p>Build innovative tech solutions.</p>
          <a href="/rules/hackathon" className="rules-btn">
            Rules
          </a>
        </div>

        {/* Business Plan */}
        <div className="track-card event-business">
          <h3>Business Plan</h3>
          <p>Pitch your startup idea.</p>
          <a href="/rules/business-plan" className="rules-btn">
            Rules
          </a>
        </div>

        {/* Debugging */}
        <div className="track-card event-debug">
          <h3>Code Debugging</h3>
          <p>Fix bugs under pressure.</p>
          <a href="/rules/debugging" className="rules-btn">
            Rules
          </a>
        </div>

        {/* Typing */}
        <div className="track-card event-typing">
          <h3>Typing Master</h3>
          <p>Test speed and accuracy.</p>
          <a href="/rules/typing" className="rules-btn">
            Rules
          </a>
        </div>

        {/* BGMI */}
        <div className="track-card event-bgmi">
          <h3>BGMI</h3>
          <p>Battle royale tournament.</p>
        </div>

        {/* MLBB */}
        <div className="track-card event-mlbb">
          <h3>MLBB</h3>
          <p>5v5 strategic gameplay.</p>
        </div>

        {/* Cosplay */}
        <div className="track-card event-cosplay">
          <h3>Cosplay</h3>
          <p>Showcase your character creativity.</p>
        </div>

        {/* Cultural Dance */}
        <div className="track-card event-dance">
          <h3>Cultural Dance</h3>
          <p>Celebrate culture through performance.</p>
        </div>

        {/* Reels */}
        <div className="track-card event-reels">
          <h3>Reels Competition</h3>
          <p>Create engaging short videos.</p>
        </div>

        {/* Treasure Hunt */}
        <div className="track-card event-treasure">
          <h3>Treasure Hunt</h3>
          <p>Solve clues and discover the prize.</p>
        </div>

        {/* Run */}
        <div className="track-card event-run">
          <h3>INNOU Run</h3>
          <p>7km endurance challenge.</p>
        </div>
      </div>
    </section>
  );
}
