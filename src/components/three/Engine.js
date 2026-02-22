/**
 * ============================================================
 * ⚠ CORE 3D ENGINE - DO NOT MODIFY
 * ------------------------------------------------------------
 * This controls:
 * - Particle morph animation
 * - Floating objects
 * - Grid system
 * - Camera movement
 * - Post-processing
 *
 * Editing this without understanding the full system
 * may break the entire website.
 *
 * Only modify if you fully understand Three.js and GSAP.
 * ============================================================
 */
"use client";

import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from "three-stdlib";
import { RenderPass } from "three-stdlib";
import { UnrealBloomPass } from "three-stdlib";

/**
 * ⚠ DO NOT MODIFY
 * Core 3D Animation Engine
 */

export default class Engine {
  constructor(container) {
    this.container = container;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;

    this.grid = null;
    this.particles = null;
    this.floatingGroup = null;

    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initPostProcessing();
    this.initLights();
    this.initGrid();
    this.initParticles();
    this.initFloatingObjects();
    this.initInteraction();

    this.animate();
  }

  /* ================= SCENE ================= */

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x020617, 1000, 5000);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );

    this.camera.position.z = 900;
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

    this.renderer.toneMappingExposure = 1.2;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.2,
      0.6,
      0.4,
    );

    this.composer.addPass(bloom);
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);

    const point = new THREE.PointLight(0x00f2ff, 5, 3000);

    point.position.set(500, 500, 500);

    this.scene.add(ambient);
    this.scene.add(point);
  }

  /* ================= GRID ================= */

  initGrid() {
    this.grid = new THREE.GridHelper(5000, 50, 0x1e293b, 0x1e293b);

    this.grid.position.y = -400;

    this.grid.material.opacity = 0.4;
    this.grid.material.transparent = true;

    this.scene.add(this.grid);
  }

  /* ================= INTERACTION ================= */

  initInteraction() {
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;

      this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  }

  /* ================= PARTICLES ================= */

  initParticles() {
    const LOGO_SRC = "/logo.png";
    const SAMPLE_STEP = 3;
    const MORPH_TIME = 3;

    let geometry;
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

      initParticleSystem(coords);
    };

    const initParticleSystem = (coords) => {
      const count = coords.length;

      geometry = new THREE.BufferGeometry();

      spherePos = new Float32Array(count * 3);
      scatterPos = new Float32Array(count * 3);
      logoPos = new Float32Array(count * 3);
      const delays = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Sphere math (exact)
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);

        spherePos[i3] = 260 * Math.sin(phi) * Math.cos(theta);
        spherePos[i3 + 1] = 260 * Math.sin(phi) * Math.sin(theta);
        spherePos[i3 + 2] = 260 * Math.cos(phi);

        // Scatter
        scatterPos[i3] = (Math.random() - 0.5) * 1500;
        scatterPos[i3 + 1] = (Math.random() - 0.5) * 1500;
        scatterPos[i3 + 2] = (Math.random() - 0.5) * 1500;

        // Logo
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
        color: 0xffffff,
        size: 4,
        map: new THREE.TextureLoader().load(
          "https://threejs.org/examples/textures/sprites/circle.png",
        ),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      this.particles = new THREE.Points(geometry, material);

      this.scene.add(this.particles);

      startSequence();
    };

    const morph = (from, to, duration) => {
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
    };

    const startSequence = () => {
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
    };
  }
  /* ================= FLOATING OBJECTS ================= */

  initFloatingObjects() {
    this.floatingGroup = new THREE.Group();
    this.scene.add(this.floatingGroup);

    const create3DLineGraph = () => {
      const group = new THREE.Group();

      const mat = new THREE.MeshStandardMaterial({
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.7,
      });

      let prevPoint = new THREE.Vector3(0, 0, 0);

      for (let i = 0; i < 5; i++) {
        const nextPoint = new THREE.Vector3(
          (i + 1) * 20,
          Math.random() * 50,
          0,
        );

        const distance = prevPoint.distanceTo(nextPoint);

        const segment = new THREE.Mesh(
          new THREE.BoxGeometry(distance, 4, 4),
          mat,
        );

        segment.position.copy(prevPoint).lerp(nextPoint, 0.5);

        segment.lookAt(nextPoint);
        segment.rotateY(Math.PI / 2);

        group.add(segment);
        prevPoint = nextPoint;
      }

      return group;
    };

    const create3DAreaChart = () => {
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
    };

    for (let i = 0; i < 300; i++) {
      let obj;
      const rand = Math.random();

      if (rand < 0.2) {
        obj = create3DLineGraph();
      } else if (rand < 0.4) {
        obj = create3DAreaChart();
      } else if (rand < 0.6) {
        const mat = new THREE.MeshStandardMaterial({
          color: 0x00f2ff,
          transparent: true,
          opacity: 0.6,
        });

        obj =
          Math.random() > 0.5
            ? new THREE.Mesh(new THREE.BoxGeometry(8, 60, 8), mat)
            : new THREE.Mesh(new THREE.TorusGeometry(20, 5, 8, 20), mat);
      } else {
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

      this.floatingGroup.add(obj);
    }
  }
  /* ================= ANIMATION LOOP ================= */

  animate = () => {
    requestAnimationFrame(this.animate);

    /* PARTICLE ROTATION */
    if (this.particles) {
      this.particles.rotation.y += 0.008;

      const angle = this.particles.rotation.y % (Math.PI * 2);

      this.particles.scale.x =
        angle > Math.PI / 2 && angle < (3 * Math.PI) / 2 ? -1 : 1;
    }

    /* CAMERA STACKING */
    this.camera.position.x +=
      (this.mouse.x * 100 - this.camera.position.x) * 0.05;

    this.camera.position.y +=
      (-this.mouse.y * 100 - this.camera.position.y) * 0.05;

    const time = Date.now() * 0.00005;

    this.camera.position.x += Math.sin(time) * 0.3;

    this.camera.position.y += Math.cos(time) * 0.3;

    this.camera.lookAt(0, 0, 0);

    /* GRID SCROLL */
    this.grid.position.z += 2;

    if (this.grid.position.z > 200) this.grid.position.z = 0;

    /* FLOATING UPDATE */
    if (this.floatingGroup) {
      this.floatingGroup.children.forEach((obj) => {
        obj.rotation.x += obj.userData.rotSpeed;

        obj.rotation.y += obj.userData.rotSpeed;

        obj.position.z += 3.5;

        if (obj.position.z > 1500) obj.position.z = -3000;
      });
    }

    this.composer.render();
  };
  updateFloatingColors(colorHex) {
    if (!this.floatingGroup) return;

    this.floatingGroup.children.forEach((obj) => {
      if (obj.material && obj.material.color) {
        obj.material.color.set(colorHex);
      }
    });
  }
}
