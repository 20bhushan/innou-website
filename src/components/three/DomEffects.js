import { eventConfig } from "@/config/eventConfig";

export default function initDomEffects() {
  setTimeout(() => {
    const root = document.documentElement;

    /* ================= LOADER ================= */

    window.addEventListener("load", () => {
      const loader = document.getElementById("loader");
      if (!loader) return;

      setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.pointerEvents = "none";
      }, 2000);
    });

    /* ================= COUNTDOWN ================= */

    const targetDate = new Date(eventConfig.countdownDate);

    setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const d = document.getElementById("days");
      const h = document.getElementById("hours");
      const m = document.getElementById("minutes");
      const s = document.getElementById("seconds");

      if (d) d.innerText = days;
      if (h) h.innerText = hours;
      if (m) m.innerText = minutes;
      if (s) s.innerText = seconds;
    }, 1000);

    /* ================= NAVBAR SHADOW ================= */

    window.addEventListener("scroll", () => {
      const nav = document.querySelector(".navbar");
      if (!nav) return;

      if (window.scrollY > 50) {
        nav.style.background = "rgba(2,6,23,0.95)";
        nav.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
      } else {
        nav.style.background = "rgba(2,6,23,0.6)";
        nav.style.boxShadow = "none";
      }
    });

    /* ================= SECTION DETECTION + THEME ================= */

    window.addEventListener("scroll", () => {
      const sections = document.querySelectorAll("section");
      const navLinks = document.querySelectorAll(".nav-links a");

      let current = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 200;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });

      /* NAV ACTIVE */
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });

      /* THEME SWITCH */
      if (current === "home") {
        root.style.setProperty("--neon-cyan", "#00f2ff");
        root.style.setProperty("--neon-purple", "#bc70ff");
        window.__ENGINE__?.updateFloatingColors(0xbc70ff);
      }

      if (current === "home-events") {
        root.style.setProperty("--neon-cyan", "#ff4d6d");
        root.style.setProperty("--neon-purple", "#ff9f1c");
        window.__ENGINE__?.updateFloatingColors(0xff4d6d);
      }

      if (current === "competitions") {
        root.style.setProperty("--neon-cyan", "#00ff88");
        root.style.setProperty("--neon-purple", "#00c3ff");
        window.__ENGINE__?.updateFloatingColors(0x00ff88);
      }
      if (current === "schedule") {
        root.style.setProperty("--neon-cyan", "#5f6cff");
        root.style.setProperty("--neon-purple", "#00d4ff");
        window.__ENGINE__?.updateFloatingColors(0x5f6cff);
      }
      if (current === "sponsors") {
        root.style.setProperty("--neon-cyan", "#ffd166");
        root.style.setProperty("--neon-purple", "#ef476f");
        window.__ENGINE__?.updateFloatingColors(0xffd166);
      }

      if (current === "contact") {
        root.style.setProperty("--neon-cyan", "#ff00ff");
        root.style.setProperty("--neon-purple", "#7b2cbf");
        window.__ENGINE__?.updateFloatingColors(0xff00ff);
      }

      /* PROGRESS BAR */
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrollPercent = (scrollTop / scrollHeight) * 100;
      const bar = document.getElementById("progress-bar");
      if (bar) bar.style.width = scrollPercent + "%";
    });
    /* ================= SCROLL REVEAL ================= */

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15 },
    );

    // Observe reveal sections
    document.querySelectorAll(".reveal").forEach((el) => {
      observer.observe(el);
    });

    // Observe track cards
    document.querySelectorAll(".track-card").forEach((el) => {
      observer.observe(el);
    });

    // Observe about section
    document.querySelectorAll(".about").forEach((el) => {
      observer.observe(el);
    });
    /* ================= MAGNETIC BUTTONS ================= */

    document.querySelectorAll(".btn-primary, .btn-outline").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    });

    /* ================= TILT CARDS ================= */

    document.querySelectorAll(".track-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const rotateX = (y / rect.height - 0.5) * 12;
        const rotateY = (x / rect.width - 0.5) * -12;

        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(1.05)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          scale(1)
        `;
      });
    });
    /* ================= NEON PARTICLES ================= */

    const particlesContainer = document.querySelector(".particles");

    if (particlesContainer) {
      for (let i = 0; i < 40; i++) {
        const span = document.createElement("span");

        span.style.left = Math.random() * 100 + "vw";
        span.style.animationDuration = 5 + Math.random() * 10 + "s";
        span.style.opacity = Math.random();

        particlesContainer.appendChild(span);
      }
    }
    /* ================= CURSOR GLOW ================= */

    const cursor = document.querySelector(".cursor-glow");

    document.addEventListener("mousemove", (e) => {
      if (!cursor) return;
      cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    });
  }, 100);
}
