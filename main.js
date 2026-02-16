import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
import gsap from "https://cdn.skypack.dev/gsap@3.12.2";

// ===== SCENE SETUP =====
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const pLight = new THREE.PointLight(0x00f2ff, 5, 3000);
pLight.position.set(500, 500, 500);
scene.add(pLight);

const mouse = { x: 0, y: 0 };
document.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ===== PARTICLE LOGIC (STABLE & OPTIMIZED) =====
const c = document.createElement("canvas");
const ctx = c.getContext("2d");
c.width = 1500;
c.height = 300;
ctx.fillStyle = "#ffffff";
ctx.font = "900 180px Arial";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("INNOU    1.0", 750, 150);

const data = ctx.getImageData(0, 0, 1500, 300).data;
const textPoints = [];
for (let y = 0; y < 300; y += 3) {
  for (let x = 0; x < 1500; x += 3) {
    if (data[(y * 1500 + x) * 4 + 3] > 128) {
      textPoints.push({ x: (x - 750) * 1.2, y: (150 - y) * 1.2 });
    }
  }
}

const count = textPoints.length;
const geometry = new THREE.BufferGeometry();
const pos = new Float32Array(count * 3);
const spherePos = new Float32Array(count * 3);
const textPos = new Float32Array(count * 3);
const scatterPos = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  const i3 = i * 3;
  const r = 260;
  const t = Math.random() * Math.PI * 2;
  const p = Math.acos(Math.random() * 2 - 1);
  spherePos[i3] = r * Math.sin(p) * Math.cos(t);
  spherePos[i3 + 1] = r * Math.sin(p) * Math.sin(t);
  spherePos[i3 + 2] = r * Math.cos(p);

  textPos[i3] = textPoints[i].x;
  textPos[i3 + 1] = textPoints[i].y;
  textPos[i3 + 2] = (Math.random() - 0.5) * 5;

  scatterPos[i3] = (Math.random() - 0.5) * 1500;
  scatterPos[i3 + 1] = (Math.random() - 0.5) * 1500;
  scatterPos[i3 + 2] = (Math.random() - 0.5) * 1500;

  pos[i3] = spherePos[i3];
  pos[i3 + 1] = spherePos[i3 + 1];
  pos[i3 + 2] = spherePos[i3 + 2];
}

geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
const material = new THREE.PointsMaterial({
  color: 0xbc70ff,
  size: 2.5,
  transparent: true,
  blending: THREE.AdditiveBlending,
});
const points = new THREE.Points(geometry, material);
scene.add(points);

let currentState = 0;
function morph() {
  let target =
    currentState === 0 ? textPos : currentState === 1 ? scatterPos : spherePos;
  currentState = (currentState + 1) % 3;
  gsap.to(geometry.attributes.position.array, {
    endArray: target,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
      geometry.attributes.position.needsUpdate = true;
    },
  });
}
setInterval(morph, 6000);

// ===== 3D GRAPH ELEMENTS =====
const floatingGroup = new THREE.Group();
scene.add(floatingGroup);

// Function to create a 3D zigzag line graph
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

    // Position and rotate segment to connect points
    segment.position.copy(prevPoint).lerp(nextPoint, 0.5);
    segment.lookAt(nextPoint);
    segment.rotateY(Math.PI / 2);

    group.add(segment);
    prevPoint = nextPoint;
  }
  return group;
}

// Function to create a 3D Area/Volume Chart
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

// Spawning Loop
for (let i = 0; i < 180; i++) {
  let obj;
  const rand = Math.random();
  if (rand < 0.2) obj = create3DLineGraph();
  else if (rand < 0.4) obj = create3DAreaChart();
  else if (rand < 0.6) {
    // Binary Digits
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00f2ff,
      transparent: true,
      opacity: 0.6,
    });
    obj =
      Math.random() > 0.5
        ? new THREE.Mesh(new THREE.BoxGeometry(8, 60, 8), mat) // 1
        : new THREE.Mesh(new THREE.TorusGeometry(20, 5, 8, 20), mat); // 0 (simplified)
  } else {
    // Background Polygons
    obj = new THREE.Mesh(
      new THREE.OctahedronGeometry(25),
      new THREE.MeshStandardMaterial({ color: 0xbc70ff, wireframe: true }),
    );
  }

  obj.position.set(
    (Math.random() - 0.5) * 5000,
    (Math.random() - 0.5) * 3000,
    (Math.random() - 0.5) * 4000,
  );
  obj.userData.rotSpeed = (Math.random() - 0.5) * 0.015;
  floatingGroup.add(obj);
}

// ===== ANIMATION LOOP =====
function animate() {
  requestAnimationFrame(animate);

  points.rotation.y += 0.008;
  points.scale.x = Math.cos(points.rotation.y) < 0 ? -1 : 1;

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

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
