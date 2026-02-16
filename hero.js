import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import gsap from "https://cdn.skypack.dev/gsap@3.12.2";

/* ================= SCENE SETUP ================= */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  innerWidth / innerHeight,
  0.1,
  5000,
);
camera.position.z = 900;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
document.getElementById("canvas-container").appendChild(renderer.domElement);

/* ================= LIGHTING ================= */
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

const pLight = new THREE.PointLight(0x00f2ff, 5, 3000);
pLight.position.set(500, 500, 500);
scene.add(pLight);

/* ================= MOUSE CAMERA ================= */
const mouse = { x: 0, y: 0 };

document.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / innerHeight - 0.5) * 2;
});

/* ================= LOGO PARTICLE SYSTEM ================= */

const LOGO_SRC = "logo.png";
const SAMPLE_STEP = 3;
const MORPH_TIME = 3;

let geometry, points;
let spherePos, scatterPos, logoPos;
const mix = { v: 0 };

const img = new Image();
img.src = LOGO_SRC;
img.crossOrigin = "anonymous";

img.onload = () => {
  const size = 512;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = size;
  canvas.height = size;

  ctx.drawImage(img, 0, 0, size, size);

  const data = ctx.getImageData(0, 0, size, size).data;
  const coords = [];

  for (let y = 0; y < size; y += SAMPLE_STEP) {
    for (let x = 0; x < size; x += SAMPLE_STEP) {
      const i = (y * size + x) * 4;
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

      if (brightness < 100) {
        coords.push({
          x: (x - size / 2) * 1.2,
          y: (size / 2 - y) * 1.2,
        });
      }
    }
  }

  initParticles(coords);
};

function initParticles(coords) {
  const count = coords.length;

  geometry = new THREE.BufferGeometry();

  spherePos = new Float32Array(count * 3);
  scatterPos = new Float32Array(count * 3);
  logoPos = new Float32Array(count * 3);
  const delays = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    spherePos[i3] = 260 * Math.sin(phi) * Math.cos(theta);
    spherePos[i3 + 1] = 260 * Math.sin(phi) * Math.sin(theta);
    spherePos[i3 + 2] = 260 * Math.cos(phi);

    scatterPos[i3] = (Math.random() - 0.5) * 1500;
    scatterPos[i3 + 1] = (Math.random() - 0.5) * 1500;
    scatterPos[i3 + 2] = (Math.random() - 0.5) * 1500;

    logoPos[i3] = coords[i].x;
    logoPos[i3 + 1] = coords[i].y;
    logoPos[i3 + 2] = (Math.random() - 0.5) * 10;

    delays[i] = Math.random();
  }

  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(spherePos.slice(), 3),
  );
  geometry.setAttribute("delay", new THREE.BufferAttribute(delays, 1));

  const material = new THREE.PointsMaterial({
    color: 0xbc70ff,
    size: 2.5,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);

  startSequence();
}

/* ================= MORPH SYSTEM ================= */

function morph(from, to, duration) {
  mix.v = 0;

  gsap.to(mix, {
    v: 1,
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      const pos = geometry.attributes.position.array;
      const d = geometry.attributes.delay.array;

      for (let i = 0; i < pos.length; i += 3) {
        let t = THREE.MathUtils.clamp(mix.v * 1.4 - d[i / 3] * 0.5, 0, 1);
        const smooth = t * t * (3 - 2 * t);

        pos[i] = THREE.MathUtils.lerp(from[i], to[i], smooth);
        pos[i + 1] = THREE.MathUtils.lerp(from[i + 1], to[i + 1], smooth);
        pos[i + 2] = THREE.MathUtils.lerp(from[i + 2], to[i + 2], smooth);
      }

      geometry.attributes.position.needsUpdate = true;
    },
  });
}

function startSequence() {
  morph(spherePos, logoPos, MORPH_TIME);

  setTimeout(
    () => {
      morph(logoPos, scatterPos, 2.5);
    },
    MORPH_TIME * 1000 + 500,
  );

  setTimeout(
    () => {
      morph(scatterPos, spherePos, 3.5);
    },
    MORPH_TIME * 1000 + 3500,
  );

  setTimeout(startSequence, MORPH_TIME * 1000 + 8000);
}

/* ================= FLOATING 3D OBJECTS ================= */

const floatingGroup = new THREE.Group();
scene.add(floatingGroup);

// ===== 3D ZIGZAG LINE GRAPH =====
function create3DLineGraph() {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x00f2ff,
    transparent: true,
    opacity: 0.7,
  });

  let prevPoint = new THREE.Vector3(0, 0, 0);

  for (let i = 0; i < 5; i++) {
    const nextPoint = new THREE.Vector3((i + 1) * 20, Math.random() * 50, 0);

    const distance = prevPoint.distanceTo(nextPoint);

    const segment = new THREE.Mesh(new THREE.BoxGeometry(distance, 4, 4), mat);

    segment.position.copy(prevPoint).lerp(nextPoint, 0.5);
    segment.lookAt(nextPoint);
    segment.rotateY(Math.PI / 2);

    group.add(segment);
    prevPoint = nextPoint;
  }

  return group;
}

// ===== 3D AREA CHART =====
function create3DAreaChart() {
  const group = new THREE.Group();

  for (let i = 0; i < 4; i++) {
    const h = 20 + Math.random() * 60;

    const block = new THREE.Mesh(
      new THREE.BoxGeometry(15, h, 15),
      new THREE.MeshStandardMaterial({
        color: 0xbc70ff,
        transparent: true,
        opacity: 0.4,
        wireframe: true,
      }),
    );

    block.position.set(i * 20, h / 2, 0);
    group.add(block);
  }

  return group;
}

// ===== SPAWN LOOP (EXACT ORIGINAL LOGIC) =====
for (let i = 0; i < 300; i++) {
  let obj;
  const rand = Math.random();

  if (rand < 0.2) {
    obj = create3DLineGraph();
  } else if (rand < 0.4) {
    obj = create3DAreaChart();
  } else if (rand < 0.6) {
    // Binary digits
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.6,
    });

    obj =
      Math.random() > 0.5
        ? new THREE.Mesh(new THREE.BoxGeometry(8, 60, 8), mat) // 1
        : new THREE.Mesh(new THREE.TorusGeometry(20, 5, 8, 20), mat); // 0
  } else {
    // Background polygons
    obj = new THREE.Mesh(
      new THREE.OctahedronGeometry(25),
      new THREE.MeshStandardMaterial({
        color: 0xbc70ff,
        wireframe: true,
      }),
    );
  }

  obj.position.set(
    (Math.random() - 0.5) * 7000,
    (Math.random() - 0.5) * 5000,
    (Math.random() - 0.5) * 6000,
  );

  obj.userData.rotSpeed = (Math.random() - 0.5) * 0.015;

  floatingGroup.add(obj);
}

/* ================= ANIMATION ================= */

function animate() {
  requestAnimationFrame(animate);

  if (points) {
    points.rotation.y += 0.008;

    const angle = points.rotation.y % (Math.PI * 2);
    points.scale.x = angle > Math.PI / 2 && angle < (3 * Math.PI) / 2 ? -1 : 1;
  }

  camera.position.x += (mouse.x * 100 - camera.position.x) * 0.05;
  camera.position.y += (-mouse.y * 100 - camera.position.y) * 0.05;
  camera.lookAt(0, 0, 0);

  floatingGroup.children.forEach((obj) => {
    obj.rotation.x += obj.userData.rotSpeed;
    obj.rotation.y += obj.userData.rotSpeed;
    obj.position.z += 3.5;

    if (obj.position.z > 1500) obj.position.z = -3000;
  });

  renderer.render(scene, camera);
}
animate();

/* ================= RESPONSIVE ================= */

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    nav.style.background = "rgba(2,6,23,0.95)";
    nav.style.boxShadow = "0 10px 30px rgba(0,0,0,0.6)";
  } else {
    nav.style.background = "rgba(2,6,23,0.6)";
    nav.style.boxShadow = "none";
  }
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
});

document.querySelectorAll(".track-card, .about").forEach((el) => {
  observer.observe(el);
});

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
const title = document.querySelector(".main-title");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  title.style.transform = `translate(${x}px, ${y}px)`;
});
// ===== Loading Bar =====
const loader = document.createElement("div");
loader.style.position = "fixed";
loader.style.top = "0";
loader.style.left = "0";
loader.style.height = "3px";
loader.style.width = "0%";
loader.style.background = "linear-gradient(90deg,#00f2ff,#bc70ff)";
loader.style.zIndex = "9999";
loader.style.transition = "width 0.4s ease";
document.body.appendChild(loader);

// SPA Navigation
const links = document.querySelectorAll("[data-page]");
const pages = document.querySelectorAll(".page");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("data-page");
    const current = document.querySelector(".page.active");
    const next = document.getElementById(targetId);

    if (!next || current === next) return;

    // Loading animation
    loader.style.width = "100%";

    setTimeout(() => {
      current.classList.remove("active");
      current.classList.add("exit-left");

      next.classList.add("active");

      setTimeout(() => {
        current.classList.remove("exit-left");
        loader.style.width = "0%";
      }, 600);

      changeTheme(targetId);
      change3DBackground(targetId);
    }, 400);
  });
});
function changeTheme(page) {
  const root = document.documentElement;

  if (page === "home") {
    root.style.setProperty("--neon-cyan", "#00f2ff");
    root.style.setProperty("--neon-purple", "#bc70ff");
  }

  if (page === "events") {
    root.style.setProperty("--neon-cyan", "#ff4d6d");
    root.style.setProperty("--neon-purple", "#ff9f1c");
  }

  if (page === "competitions") {
    root.style.setProperty("--neon-cyan", "#00ff88");
    root.style.setProperty("--neon-purple", "#00c3ff");
  }

  if (page === "contact") {
    root.style.setProperty("--neon-cyan", "#ff00ff");
    root.style.setProperty("--neon-purple", "#7b2cbf");
  }
}
function change3DBackground(page) {
  if (!floatingGroup) return;

  floatingGroup.children.forEach((obj) => {
    if (page === "events") obj.material.color.set(0xff4d6d);
    if (page === "competitions") obj.material.color.set(0x00ff88);
    if (page === "contact") obj.material.color.set(0xff00ff);
    if (page === "home") obj.material.color.set(0xbc70ff);
  });
}
// Scroll Reveal
const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight;
    const revealTop = el.getBoundingClientRect().top;
    const revealPoint = 100;

    if (revealTop < windowHeight - revealPoint) {
      el.classList.add("active");
    }
  });
});
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});
const targetDate = new Date("March 15, 2026 09:00:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;
}, 1000);
const modal = document.getElementById("registerModal");
const registerBtn = document.querySelector(".btn-primary");
const closeBtn = document.querySelector(".close");

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
// Parallax effect
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero");
  let offset = window.scrollY;
  hero.style.backgroundPositionY = offset * 0.5 + "px";
});
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / scrollHeight) * 100;
  document.getElementById("progress-bar").style.width = scrollPercent + "%";
});
const cursor = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
});
const particlesContainer = document.querySelector(".particles");

for (let i = 0; i < 30; i++) {
  const span = document.createElement("span");
  span.style.left = Math.random() * 100 + "vw";
  span.style.animationDuration = 5 + Math.random() * 10 + "s";
  span.style.opacity = Math.random();
  particlesContainer.appendChild(span);
}
const magneticButtons = document.querySelectorAll(".btn-primary, .btn-outline");

magneticButtons.forEach((btn) => {
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
const cards = document.querySelectorAll(".track-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * 12;
    const rotateY = (x / rect.width - 0.5) * -12;

    card.style.transform = `
      translateY(0px)
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `
      translateY(0px)
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  });
});
