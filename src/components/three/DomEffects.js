import { eventConfig } from "@/config/eventConfig";

export default function initDomEffects() {
  const root = document.documentElement;
  const cleanups = [];
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const supportsHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  let scrollFrame = 0;
  let cursorFrame = 0;

  const runLoaderExit = () => {
    const loader = document.getElementById("loader");
    if (!loader) return;

    const timeoutId = window.setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
    }, 2000);

    cleanups.push(() => window.clearTimeout(timeoutId));
  };

  if (document.readyState === "complete") {
    runLoaderExit();
  } else {
    window.addEventListener("load", runLoaderExit, { once: true });
  }

  const targetDate = new Date(eventConfig.countdownDate);
  const syncCountdown = () => {
    const now = new Date();
    const diff = Math.max(0, targetDate - now);

    const values = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };

    Object.entries(values).forEach(([id, value]) => {
      const node = document.getElementById(id);
      if (node) node.textContent = String(value).padStart(2, "0");
    });
  };

  syncCountdown();
  const countdownId = window.setInterval(syncCountdown, 1000);
  cleanups.push(() => window.clearInterval(countdownId));

  const applyScrollEffects = () => {
    scrollFrame = 0;

    const nav = document.querySelector(".navbar");
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");
    const bar = document.getElementById("progress-bar");
    const scrollTop = window.scrollY;
    let current = "";

    if (nav) {
      nav.style.background =
        scrollTop > 50 ? "rgba(2,6,23,0.95)" : "rgba(2,6,23,0.6)";
      nav.style.boxShadow =
        scrollTop > 50 ? "0 10px 30px rgba(0,0,0,0.6)" : "none";
    }

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;

      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        current = section.getAttribute("id") || "";
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", isActive);
    });

    if (current === "home") {
      root.style.setProperty("--neon-cyan", "#00f2ff");
      root.style.setProperty("--neon-purple", "#bc70ff");
      window.__ENGINE__?.updateFloatingColors(0xbc70ff);
    } else if (current === "home-events") {
      root.style.setProperty("--neon-cyan", "#ff4d6d");
      root.style.setProperty("--neon-purple", "#ff9f1c");
      window.__ENGINE__?.updateFloatingColors(0xff4d6d);
    } else if (current === "competitions") {
      root.style.setProperty("--neon-cyan", "#00ff88");
      root.style.setProperty("--neon-purple", "#00c3ff");
      window.__ENGINE__?.updateFloatingColors(0x00ff88);
    } else if (current === "schedule") {
      root.style.setProperty("--neon-cyan", "#5f6cff");
      root.style.setProperty("--neon-purple", "#00d4ff");
      window.__ENGINE__?.updateFloatingColors(0x5f6cff);
    } else if (current === "sponsors") {
      root.style.setProperty("--neon-cyan", "#ffd166");
      root.style.setProperty("--neon-purple", "#ef476f");
      window.__ENGINE__?.updateFloatingColors(0xffd166);
    } else if (current === "contact") {
      root.style.setProperty("--neon-cyan", "#ff00ff");
      root.style.setProperty("--neon-purple", "#7b2cbf");
      window.__ENGINE__?.updateFloatingColors(0xff00ff);
    }

    if (bar) {
      const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrollPercent =
        scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = `${scrollPercent}%`;
    }
  };

  const onScroll = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(applyScrollEffects);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  cleanups.push(() => {
    window.removeEventListener("scroll", onScroll);
    if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
  });
  applyScrollEffects();

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

  document
    .querySelectorAll(".reveal, .track-card, .about")
    .forEach((element) => observer.observe(element));
  cleanups.push(() => observer.disconnect());

  if (supportsHover && !prefersReducedMotion) {
    const buttonCleanup = [];
    document
      .querySelectorAll(".btn-primary, .btn-outline , .btn-register-main")
      .forEach((btn) => {
        const onMove = (event) => {
          const rect = btn.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;

          btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        };

        const onLeave = () => {
          btn.style.transform = "translate(0,0)";
        };

        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        buttonCleanup.push(() => {
          btn.removeEventListener("mousemove", onMove);
          btn.removeEventListener("mouseleave", onLeave);
        });
      });
    cleanups.push(() => buttonCleanup.forEach((fn) => fn()));

    const cardCleanup = [];
    document.querySelectorAll(".track-card").forEach((card) => {
      const onMove = (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = (y / rect.height - 0.5) * 12;
        const rotateY = (x / rect.width - 0.5) * -12;

        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(1.05)
        `;
      };

      const onLeave = () => {
        card.style.transform = `
          perspective(1000px)
          rotateX(0deg)
          rotateY(0deg)
          scale(1)
        `;
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cardCleanup.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    cleanups.push(() => cardCleanup.forEach((fn) => fn()));
  }

  const particlesContainer = document.querySelector(".particles");
  if (particlesContainer && !particlesContainer.childElementCount) {
    const particleCount = window.innerWidth < 768 ? 18 : 40;

    for (let i = 0; i < particleCount; i += 1) {
      const span = document.createElement("span");
      span.style.left = `${Math.random() * 100}vw`;
      span.style.animationDuration = `${5 + Math.random() * 10}s`;
      span.style.opacity = `${Math.random()}`;
      particlesContainer.appendChild(span);
    }
  }

  const cursor = document.querySelector(".cursor-glow");
  if (cursor && supportsHover) {
    const onMouseMove = (event) => {
      if (cursorFrame) return;
      cursorFrame = window.requestAnimationFrame(() => {
        cursorFrame = 0;
        cursor.style.transform = `translate(${event.clientX - 10}px, ${event.clientY - 10}px)`;
      });
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    cleanups.push(() => {
      document.removeEventListener("mousemove", onMouseMove);
      if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
    });
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
