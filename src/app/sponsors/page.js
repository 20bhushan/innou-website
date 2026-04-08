"use client";
import "./sponsors-page.css";
import Image from "next/image";
import Footer from "@/components/sections/Footer";
import { sponsorsData } from "@/data/sponsorsData";

const sponsorSections = [
  {
    title: "Gaming Partner",
    roles: ["Gaming Partner"],
  },
  {
    title: "Sponsors",
    roles: ["Sponsor"],
  },
  {
    title: "Media Partner",
    roles: ["Media Partner"],
  },
  {
    title: "Community & Support Partners",
    roles: ["Community Partner", "Innovation Partner", "Support Partner"],
  },
];

function SponsorCard({ sponsor, featured = false }) {
  return (
    <a
      href={sponsor.link || "#"}
      target={sponsor.link ? "_blank" : "_self"}
      rel={sponsor.link ? "noopener noreferrer" : undefined}
      className={`sponsor-card ${featured ? "featured" : ""}`}
    >
      <div className="sponsor-card-glow" />
      <div className="sponsor-logo-wrap">
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          width={420}
          height={220}
          className="sponsor-logo"
        />
      </div>

      <div className="sponsor-info">
        <h3 className="sponsor-name">{sponsor.name}</h3>
        <span className="sponsor-role">{sponsor.role}</span>
      </div>
    </a>
  );
}

function SponsorSection({ title, roles }) {
  const items = sponsorsData.filter((item) => roles.includes(item.role));
  if (!items.length) return null;

  return (
    <section className="partners-section">
      <div className="section-heading-wrap">
        <h2 className="section-heading">{title}</h2>
      </div>

      <div className="sponsor-grid">
        {items.map((sponsor, index) => (
          <SponsorCard key={`${sponsor.name}-${index}`} sponsor={sponsor} />
        ))}
      </div>
    </section>
  );
}

export default function SponsorsPage() {
  const titleSponsor = sponsorsData.find((item) => item.role === "Title Sponsor");

  return (
    <>
      <main id="sponsors-page">
        <div className="sponsors-bg">
          <div className="bg-grid" />
          <div className="bg-aurora aurora-1" />
          <div className="bg-aurora aurora-2" />
          <div className="bg-spotlight" />
        </div>

        <section className="sponsors-hero">
          <span className="hero-badge">INNOU 1.0 PARTNERS</span>
          <h1 className="hero-title">Sponsors & Partners</h1>
          <p className="hero-text">
            The brands, communities, and collaborators powering the INNOU 1.0
            experience.
          </p>
        </section>

        {titleSponsor && (
          <section className="featured-section">
            <div className="section-heading-wrap">
              <h2 className="section-heading featured-heading">Title Sponsor</h2>
            </div>

            <a
              href={titleSponsor.link || "#"}
              target={titleSponsor.link ? "_blank" : "_self"}
              rel={titleSponsor.link ? "noopener noreferrer" : undefined}
              className="featured-sponsor"
            >
              <div className="featured-overlay" />

              <div className="featured-content">
                <div className="featured-text">
                  <span className="featured-label">Powered By</span>
                  <h3>{titleSponsor.name}</h3>
                  <p>
                    Proudly supporting innovation, creativity, and the future of
                    student-led technology at INNOU 1.0.
                  </p>
                  <span className="featured-role">{titleSponsor.role}</span>
                </div>

                <div className="featured-logo-wrap">
                  <Image
                    src={titleSponsor.logo}
                    alt={titleSponsor.name}
                    width={520}
                    height={260}
                    className="featured-logo"
                  />
                </div>
              </div>
            </a>
          </section>
        )}

        {sponsorSections.map((section) => (
          <SponsorSection
            key={section.title}
            title={section.title}
            roles={section.roles}
          />
        ))}
      </main>

      <Footer />
    </>
  );
}
