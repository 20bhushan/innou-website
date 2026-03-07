"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Footer from "@/components/sections/Footer";
import { rulesData } from "@/data/rulesData";
import { getEventCardBackground, getEventVisual } from "@/lib/helpers";

const CATEGORY_ORDER = [
  "MAIN EVENTS",
  "TECHNICAL EVENTS",
  "E-SPORTS",
  "CULTURAL AND CREATIVE",
  "SPORTS",
  "OTHER",
];

export default function CompetitionsPage() {
  const canvasRef = useRef(null);

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
    const handleMouseGlow = (e) => {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--y", `${e.clientY}px`);
    };

    document.addEventListener("mousemove", handleMouseGlow);

    const cards = document.querySelectorAll(".hackathon-card");
    const buttons = document.querySelectorAll(".card-buttons .btn-primary");

    const cardMouseMoveHandlers = [];
    const cardLeaveHandlers = [];

    cards.forEach((card) => {
      const onMove = (e) => {
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
      };

      const onLeave = () => {
        card.style.transform = "translateY(0) scale(1)";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cardMouseMoveHandlers.push([card, onMove]);
      cardLeaveHandlers.push([card, onLeave]);
    });

    const btnMoveHandlers = [];
    const btnLeaveHandlers = [];

    buttons.forEach((btn) => {
      const onMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      };

      const onLeave = () => {
        btn.style.transform = "translate(0,0)";
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      btnMoveHandlers.push([btn, onMove]);
      btnLeaveHandlers.push([btn, onLeave]);
    });

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {
        document.removeEventListener("mousemove", handleMouseGlow);
      };
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return () => {
        document.removeEventListener("mousemove", handleMouseGlow);
      };
    }

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();
    window.addEventListener("resize", setSize);

    const particleCount = 80;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }));

    let frameId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#00f2ff";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
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
      });

      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseGlow);
      window.removeEventListener("resize", setSize);
      if (frameId) window.cancelAnimationFrame(frameId);

      cardMouseMoveHandlers.forEach(([card, handler]) => {
        card.removeEventListener("mousemove", handler);
      });
      cardLeaveHandlers.forEach(([card, handler]) => {
        card.removeEventListener("mouseleave", handler);
      });
      btnMoveHandlers.forEach(([btn, handler]) => {
        btn.removeEventListener("mousemove", handler);
      });
      btnLeaveHandlers.forEach(([btn, handler]) => {
        btn.removeEventListener("mouseleave", handler);
      });
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

      {CATEGORY_ORDER.filter((category) => groupedEvents[category]?.length > 0).map(
        (category) => (
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
                      <span>PRIZE POOL</span>
                      <h3>{visual.prize}</h3>
                    </div>

                    <p className="card-description">{visual.description}</p>

                    <div className="card-buttons">
                      <Link href={`/rules/${key}`} className="btn-outline">
                        Rules
                      </Link>
                      <a
                        href="https://forms.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Register
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ),
      )}

      <Footer />
    </main>
  );
}
