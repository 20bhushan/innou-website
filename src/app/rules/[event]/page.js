import Link from "next/link";
import { rulesData } from "@/data/rulesData";

const EVENT_ALIASES = {
  debug: "debugging",
  bussiness: "business",
};

export default async function RulesPage({ params }) {
  const resolvedParams = await params;
  const rawSlug = decodeURIComponent(resolvedParams?.event || "").toLowerCase();
  const normalizedSlug = EVENT_ALIASES[rawSlug] || rawSlug;
  const event = rulesData[normalizedSlug];

  if (!event) {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h1>Rules Not Found</h1>
      </div>
    );
  }

  return (
    <div
      className="rules-body"
      style={{
        "--accent-color": event.color,
        "--accent-glow": event.color,
        "--accent-low": `${event.color}33`,
      }}
    >
      <nav className="rules-nav">
        <div className="nav-container">
          <Link href="/competitions" className="nav-back">
            Back
          </Link>

          <div className="nav-title">{event.title} Rules</div>

          {normalizedSlug === "reels" ? (
            <a
              href="https://wa.me/918732055623"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-register"
            >
              Upload
            </a>
          ) : (
            <a
              href={event.formLink ? event.formLink : "/updating"}
              target={event.formLink ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="nav-register"
            >
              {event.formLink ? "Register" : "Coming Soon"}
            </a>
          )}
        </div>
      </nav>

      <header className="rules-header">
        <h1 className="rules-title">{event.title}</h1>
        <p className="rules-subtitle">{event.subtitle}</p>
      </header>

      <section className="rules-grid">
        {event.rules.map((rule, index) => (
          <div key={index} className="rule-card">
            <h3>{rule.title}</h3>
            <ul>
              {rule.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
