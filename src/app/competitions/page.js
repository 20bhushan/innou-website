"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Footer from "@/components/sections/Footer";
import { rulesData } from "@/data/rulesData";
import { getEventCardBackground, getEventVisual } from "@/lib/helpers";

const CATEGORY_ORDER = [
  "MAIN EVENTS",
  "TECHNICAL EVENTS",
  "E-SPORTS",
  "CREATIVE ARENA",
  "SPORTS",
  "OTHER",
];

function EventCountdown({ config }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!config?.enabled || !config?.endTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const endTime = new Date(config.endTime);
      const diff = endTime - now;

      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(config.expiredLabel || "Ended");
        return;
      }

      setExpired(false);

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      if (days > 0) {
        setTimeLeft(
          `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`,
        );
      } else {
        setTimeLeft(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
        );
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [config]);

  if (!config?.enabled) return null;

  return (
    <div className={`offer-countdown ${expired ? "expired" : ""}`}>
      {expired
        ? config.expiredLabel || "Ended"
        : `${config.activeLabel || "⏳"} ${timeLeft}`}
    </div>
  );
}

export default function CompetitionsPage() {
  const canvasRef = useRef(null);
  const [runSlots, setRunSlots] = useState(null);

  const groupedEvents = useMemo(() => {
    return Object.entries(rulesData).reduce((acc, [key, event]) => {
      const visual = getEventVisual(key);
      const category = visual.category || "OTHER";

      if (!acc[category]) acc[category] = [];
      acc[category].push({ key, event, visual });
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(
          "https://script.googleusercontent.com/macros/echo?user_content_key=AWDtjMXAOgrYCuwlHjMIopsHH8Ox0pN2P5tOdNrSRUwuAYsNh3wcxJzaxANlx2KFUYet3JwQn1T88fjO1s7upc0vcr4gdqnu5aQrgE8dS9Eq-bfQn--6Mtns9_dmAByrKwIiggXTxqtTuVU1JTPObs7tmhJytE40IeU46rlYtcqjv1YGt14yzdHTp3noCkAQxcAT9fpY6_XVDiOc7A0wxqemwaBMZpPADvmqxgQiWuuJ38UoeEwCbYActfeVCI7IEjiHFkp75csFwirjR0z8jOEXI7NtvuGSC-Vlk63e6zhF&lib=MWyaZlUpm3upAE3Wu6BsslOYlIZy54kvZ",
          {
            cache: "no-store",
          },
        );
        const data = await res.json();
        setRunSlots(data);
      } catch (err) {
        console.error("Slot fetch error:", err);
      }
    };

    fetchSlots();
    const interval = setInterval(fetchSlots, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hoverCapable = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let glowFrame = 0;
    let latestPointer = null;

    const handleMouseGlow = (e) => {
      latestPointer = e;
      if (glowFrame) return;

      glowFrame = requestAnimationFrame(() => {
        glowFrame = 0;
        if (!latestPointer) return;

        document.documentElement.style.setProperty(
          "--x",
          `${latestPointer.clientX}px`,
        );
        document.documentElement.style.setProperty(
          "--y",
          `${latestPointer.clientY}px`,
        );
      });
    };

    if (!isMobile && hoverCapable) {
      document.addEventListener("mousemove", handleMouseGlow);
    }

    const cards = document.querySelectorAll(".hackathon-card");
    const buttons = document.querySelectorAll(".card-buttons .btn-primary");

    if (!isMobile && hoverCapable && !prefersReducedMotion) {
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = Math.max(Math.min((y - centerY) / 45, 6), -6);
          const rotateY = Math.max(Math.min((centerX - x) / 45, 6), -6);

          card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
          card.style.setProperty("--mouse-x", `${x}px`);
          card.style.setProperty("--mouse-y", `${y}px`);
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "translateY(0) scale(1)";
        });
      });

      buttons.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "translate(0,0)";
        });
      });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.25);

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particleCount = isMobile ? 25 : 80;

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
      vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
    }));

    let frame;

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, isMobile ? 1.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = "#00f2ff";
        ctx.fill();

        if (!isMobile) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = p.x - particles[j].x;
            const dy = p.y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(0,242,255,${1 - dist / 120})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      });

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("mousemove", handleMouseGlow);
    };
  }, []);

  return (
    <main className="events-body">
      <canvas id="neural-bg" ref={canvasRef}></canvas>
      <div className="aurora-bg"></div>
      <div className="neon-field"></div>
      <div className="grid-sweep"></div>

      <div className="particles">
        <span style={{ left: "10%", animationDuration: "12s" }}></span>
        <span style={{ left: "25%", animationDuration: "15s" }}></span>
        <span style={{ left: "40%", animationDuration: "18s" }}></span>
        <span style={{ left: "55%", animationDuration: "20s" }}></span>
        <span style={{ left: "70%", animationDuration: "14s" }}></span>
        <span style={{ left: "85%", animationDuration: "17s" }}></span>
      </div>

      <header className="event-header">
        <h1 className="main-heading">
          ALL <span className="cyan">EVENTS</span>
        </h1>
      </header>

      {CATEGORY_ORDER.filter(
        (category) => groupedEvents[category]?.length > 0,
      ).map((category) => (
        <section key={category}>
          <div className="category-head">
            <h2>{category}</h2>
          </div>

          <div className="page-wrapper">
            {groupedEvents[category].map(({ key, event, visual }) => (
              <article
                key={key}
                className={`hackathon-card event-${visual.classKey}`}
                style={{
                  backgroundImage: getEventCardBackground(key),
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="card-overlay"></div>

                <div className="card-content">
                  <h1 className="card-title">{event.title}</h1>
                  <p className="card-subtitle">{event.subtitle}</p>

                  <div className="card-prize">
                    <span>
                      {key === "stall" ? "AVAILABILITY" : "PRIZE POOL UPTO"}
                    </span>

                    <h3>{visual.prize}</h3>

                    <div className="card-fee">
                      <span>REGISTRATION</span>

                      <div className="fee-content">
                        {typeof visual.fee === "string" &&
                        visual.fee.includes("<") ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: visual.fee }}
                          />
                        ) : (
                          <div>{visual.fee}</div>
                        )}
                      </div>

                      <EventCountdown config={visual.offerCountdown} />

                      {key === "run" && runSlots && (
                        <div
                          className={`slot-count ${
                            runSlots.full ? "danger" : ""
                          }`}
                        >
                          {runSlots.full
                            ? "🚫 Slots Full"
                            : `🔥 Only ${runSlots.remaining} slots left`}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="card-description">{visual.description}</p>

                  <div className="card-buttons">
                    <Link href={`/rules/${key}`} className="btn-outline">
                      Rules
                    </Link>

                    {key === "reels" ? (
                      <a
                        href="https://wa.me/918732055623"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Upload
                      </a>
                    ) : key === "run" && runSlots?.full ? (
                      <Link href="/slots-full" className="btn-primary btn-full">
                        Slots Full
                      </Link>
                    ) : (
                      <a
                        href={event.formLink ? event.formLink : "/updating"}
                        target={event.formLink ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        {event.formLink ? "Register" : "Coming Soon"}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <Footer />
    </main>
  );
}
