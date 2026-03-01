export default function CompetitionsPage() {
  return (
    <main className="competition-page">
      {/* HERO */}
      <section className="competition-hero">
        <h1 className="competition-title">
          TECHNICAL EVENTS <span>2026</span>
        </h1>
        <p className="competition-subtitle">Create. Debug. Compete.</p>
      </section>

      {/* EVENT VISION */}
      <section className="competition-section">
        <h2>Event Vision & Purpose</h2>
        <ul>
          <li>
            Create a high-energy, hands-on hackathon solving real campus
            problems.
          </li>
          <li>Working ideas matter more than perfect code.</li>
          <li>Simple logic is better than complex features.</li>
          <li>Learning, fairness, and teamwork come first.</li>
        </ul>
      </section>

      {/* HACKATHON */}
      <section className="competition-section">
        <h2>Hackathon (Main Event)</h2>
        <p>
          <strong>Theme:</strong> Smart Campus Support System
        </p>
        <p>
          <strong>Duration:</strong> 12 Hours (Offline)
        </p>
        <p>
          <strong>Team Size:</strong> 2–4 Students
        </p>
        <p>
          <strong>Eligibility:</strong> College Students (Beginners &
          Intermediate Welcome)
        </p>
      </section>

      {/* TRACK 1 */}
      <section className="competition-section">
        <h3>Track 1 – Web Development</h3>
        <p>
          <strong>Mandatory:</strong> HTML, CSS, JavaScript
        </p>
        <p>
          <strong>One Enhancement Allowed:</strong> Firebase / Charts Library /
          LocalStorage
        </p>
        <p>
          <strong>Frameworks:</strong> Only UI Support (Bootstrap, Tailwind)
        </p>
        <p>
          <strong>Not Allowed:</strong> Heavy backend, Paid templates
        </p>
      </section>

      {/* TRACK 2 */}
      <section className="competition-section">
        <h3>Track 2 – Python Development</h3>
        <p>
          <strong>Allowed:</strong> Core Python logic required
        </p>
        <p>
          <strong>Libraries:</strong> Basic libraries + One external
          (matplotlib/tkinter)
        </p>
        <p>
          <strong>Not Allowed:</strong> Django/Flask, Pre-built templates
        </p>
      </section>

      {/* CODE DEBUGGING */}
      <section className="competition-section">
        <h2>Code Debugging</h2>
        <p>
          <strong>Theme:</strong> Crack the Code – Debug, Fix, Conquer.
        </p>
        <p>
          <strong>Mode:</strong> Offline | Duration: 1 Hour
        </p>
        <p>
          <strong>Participation:</strong> Individual
        </p>
        <p>
          <strong>Eligibility:</strong> Classes 11 & 12 (Computer Science
          students)
        </p>
      </section>

      {/* TYPING MASTER */}
      <section className="competition-section">
        <h2>Typing Master</h2>
        <p>
          <strong>Theme:</strong> Precision at the Speed of Thought.
        </p>
        <p>
          <strong>Mode:</strong> Offline | Duration: 1 Hour
        </p>
        <p>
          <strong>Participation:</strong> Individual
        </p>
        <p>
          <strong>Eligibility:</strong> Class 9 and above (including college)
        </p>
      </section>

      {/* CTA */}
      <section className="competition-cta">
        <a href="#" className="btn-primary">
          Register Now
        </a>
      </section>
    </main>
  );
}
