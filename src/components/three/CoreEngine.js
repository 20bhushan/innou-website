/**
 * ============================================================
 * CORE 3D ENGINE
 * ------------------------------------------------------------
 * Optimized to preserve the original visual sequence while
 * reducing CPU work, draw calls, and fill rate pressure.
 * ============================================================
 */
"use client";

import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from "three-stdlib";
import { RenderPass } from "three-stdlib";
import { UnrealBloomPass } from "three-stdlib";

const LOGO_SRC = "/logo.png";
const LOGO_CANVAS_SIZE = 512;
const PARTICLE_MORPH_TIME = 3;
const GRID_Z_RESET = 200;
const GRID_Y = -400;
const FLOATING_Z_RESET = 1500;
const FLOATING_Z_START = -3000;
const FLOATING_RANGE_X = 7000;
const FLOATING_RANGE_Y = 5000;
const FLOATING_RANGE_Z = 6000;
const PARTICLE_STAGE_SPHERE_TO_LOGO = 0;
const PARTICLE_STAGE_LOGO_TO_SCATTER = 1;
const PARTICLE_STAGE_SCATTER_TO_SPHERE = 2;

export default class CoreEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.isMobile = options.isMobile || window.innerWidth < 768;
    this.hardwareConcurrency = navigator.hardwareConcurrency || 4;
    this.deviceMemory = navigator.deviceMemory || 4;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.clock = new THREE.Clock();
    this.frameInterval = this.isMobile ? 1 / 30 : 1 / 60;
    this.lastFrame = 0;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.bloomPass = null;

    this.grid = null;
    this.particles = null;
    this.particleMaterial = null;
    this.particleSequence = null;

    this.floatingGroup = null;
    this.floatingObjects = [];
    this.instancedFloating = [];
    this.groupFloating = [];

    this.mouse = { x: 0, y: 0 };
    this.pixelRatio = 1;
    this.qualityProfile = this.createQualityProfile();
    this.frustum = new THREE.Frustum();
    this.projectionScreenMatrix = new THREE.Matrix4();
    this.reusableDummy = new THREE.Object3D();
    this.reusableBounds = new THREE.Sphere(new THREE.Vector3(), 1);
    this.rafId = 0;

    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onResize = this.handleResize.bind(this);
    this.animate = this.animate.bind(this);

    this.init();
  }

  createQualityProfile() {
    const widthFactor = THREE.MathUtils.clamp(this.width / 1440, 0.55, 1);
    const cpuFactor =
      this.hardwareConcurrency >= 8
        ? 1
        : this.hardwareConcurrency >= 6
          ? 0.85
          : this.hardwareConcurrency >= 4
            ? 0.7
            : 0.5;
    const memoryFactor =
      this.deviceMemory >= 8 ? 1 : this.deviceMemory >= 4 ? 0.85 : 0.65;
    const mobileFactor = this.isMobile ? 0.55 : 1;
    const quality = THREE.MathUtils.clamp(
      widthFactor * cpuFactor * memoryFactor * mobileFactor,
      this.isMobile ? 0.28 : 0.45,
      1,
    );

    return {
      quality,
      particleSize: this.isMobile ? 3 : 4,
      particleBudget: this.isMobile
        ? Math.round(2600 * quality + 500)
        : Math.round(5200 * quality + 900),
      objectBudget: this.isMobile
        ? Math.round(70 * quality + 30)
        : Math.round(180 * quality + 80),
      bloomStrength:
        this.hardwareConcurrency <= 4 || this.isMobile ? 0.6 : 1.2,
      maxPixelRatio: this.isMobile ? 1 : 1.5,
      gridSpeed: this.isMobile ? 1 : 2,
      floatingSpeed: this.isMobile ? 2 : 3.5,
      particleSpin: this.isMobile ? 0.004 : 0.008,
    };
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

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x020617, 1000, 5000);
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.width / this.height,
      0.1,
      5000,
    );
    this.camera.position.z = 900;
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    this.pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      this.qualityProfile.maxPixelRatio,
    );

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      this.qualityProfile.bloomStrength,
      0.6,
      0.4,
    );

    this.composer.addPass(this.bloomPass);
  }

  initLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    const point = new THREE.PointLight(0x00f2ff, 5, 3000);

    point.position.set(500, 500, 500);

    this.scene.add(ambient);
    this.scene.add(point);
  }

  initGrid() {
    this.grid = new THREE.GridHelper(5000, 50, 0x1e293b, 0x1e293b);
    this.grid.position.y = GRID_Y;
    this.grid.material.opacity = 0.4;
    this.grid.material.transparent = true;
    this.scene.add(this.grid);
  }

  initInteraction() {
    window.addEventListener("mousemove", this.onMouseMove, { passive: true });
    window.addEventListener("resize", this.onResize, { passive: true });
  }

  handleMouseMove(event) {
    this.mouse.x = (event.clientX / this.width - 0.5) * 2;
    this.mouse.y = (event.clientY / this.height - 0.5) * 2;
  }

  initParticles() {
    const img = new Image();

    img.src = LOGO_SRC;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const coords = this.sampleLogoPixels(img);
      const selectedCoords = this.selectParticleCoords(
        coords,
        this.qualityProfile.particleBudget,
      );

      this.createParticleSystem(selectedCoords);
    };
  }

  sampleLogoPixels(image) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const sampleStep = this.isMobile ? 4 : 3;
    const coords = [];

    canvas.width = LOGO_CANVAS_SIZE;
    canvas.height = LOGO_CANVAS_SIZE;

    ctx.drawImage(image, 0, 0, LOGO_CANVAS_SIZE, LOGO_CANVAS_SIZE);

    const data = ctx.getImageData(
      0,
      0,
      LOGO_CANVAS_SIZE,
      LOGO_CANVAS_SIZE,
    ).data;

    for (let y = 0; y < LOGO_CANVAS_SIZE; y += sampleStep) {
      for (let x = 0; x < LOGO_CANVAS_SIZE; x += sampleStep) {
        const index = (y * LOGO_CANVAS_SIZE + x) * 4;
        const brightness =
          (data[index] + data[index + 1] + data[index + 2]) / 3;

        if (brightness < 100) {
          coords.push({
            x: (x - LOGO_CANVAS_SIZE / 2) * 1.2,
            y: (LOGO_CANVAS_SIZE / 2 - y) * 1.2,
          });
        }
      }
    }

    return coords;
  }

  selectParticleCoords(coords, targetCount) {
    if (coords.length <= targetCount) return coords;

    const result = new Array(targetCount);
    const stride = coords.length / targetCount;

    // Evenly spaced sampling keeps the same silhouette while scaling the load.
    for (let i = 0; i < targetCount; i += 1) {
      result[i] = coords[Math.floor(i * stride)];
    }

    return result;
  }

  createParticleSystem(coords) {
    const count = coords.length;
    const geometry = new THREE.BufferGeometry();
    const spherePositions = new Float32Array(count * 3);
    const logoPositions = new Float32Array(count * 3);
    const scatterPositions = new Float32Array(count * 3);
    const delays = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const u = Math.random();
      const v = Math.random();
      const theta = Math.PI * 2 * u;
      const phi = Math.acos(2 * v - 1);

      spherePositions[i3] = 260 * Math.sin(phi) * Math.cos(theta);
      spherePositions[i3 + 1] = 260 * Math.sin(phi) * Math.sin(theta);
      spherePositions[i3 + 2] = 260 * Math.cos(phi);

      scatterPositions[i3] = (Math.random() - 0.5) * 1500;
      scatterPositions[i3 + 1] = (Math.random() - 0.5) * 1500;
      scatterPositions[i3 + 2] = (Math.random() - 0.5) * 1500;

      logoPositions[i3] = coords[i].x;
      logoPositions[i3 + 1] = coords[i].y;
      logoPositions[i3 + 2] = (Math.random() - 0.5) * 10;

      delays[i] = Math.random();
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(spherePositions, 3),
    );
    geometry.setAttribute(
      "aSpherePosition",
      new THREE.BufferAttribute(spherePositions, 3),
    );
    geometry.setAttribute(
      "aLogoPosition",
      new THREE.BufferAttribute(logoPositions, 3),
    );
    geometry.setAttribute(
      "aScatterPosition",
      new THREE.BufferAttribute(scatterPositions, 3),
    );
    geometry.setAttribute("aDelay", new THREE.BufferAttribute(delays, 1));

    this.particleMaterial = this.createParticleMaterial();
    this.particles = new THREE.Points(geometry, this.particleMaterial);
    this.scene.add(this.particles);

    this.startParticleSequence();
  }

  createParticleMaterial() {
    const spriteCanvas = document.createElement("canvas");
    const spriteSize = 64;
    const spriteCtx = spriteCanvas.getContext("2d");

    spriteCanvas.width = spriteSize;
    spriteCanvas.height = spriteSize;

    const gradient = spriteCtx.createRadialGradient(
      spriteSize / 2,
      spriteSize / 2,
      0,
      spriteSize / 2,
      spriteSize / 2,
      spriteSize / 2,
    );

    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,1)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    spriteCtx.fillStyle = gradient;
    spriteCtx.fillRect(0, 0, spriteSize, spriteSize);

    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTexture: { value: spriteTexture },
        uProgress: { value: 0 },
        uStage: { value: PARTICLE_STAGE_SPHERE_TO_LOGO },
        uSize: { value: this.qualityProfile.particleSize },
        uPixelRatio: { value: this.pixelRatio },
      },
      vertexShader: `
        uniform float uProgress;
        uniform float uStage;
        uniform float uSize;
        uniform float uPixelRatio;

        attribute vec3 aSpherePosition;
        attribute vec3 aLogoPosition;
        attribute vec3 aScatterPosition;
        attribute float aDelay;

        varying float vAlpha;

        void main() {
          float t = clamp(uProgress * 1.4 - aDelay * 0.5, 0.0, 1.0);
          float smoothT = t * t * (3.0 - 2.0 * t);

          vec3 fromPosition = aSpherePosition;
          vec3 toPosition = aLogoPosition;

          if (uStage > 1.5) {
            fromPosition = aScatterPosition;
            toPosition = aSpherePosition;
          } else if (uStage > 0.5) {
            fromPosition = aLogoPosition;
            toPosition = aScatterPosition;
          }

          vec3 transformed = mix(fromPosition, toPosition, smoothT);
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);

          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = max(1.0, uSize * uPixelRatio * (300.0 / -mvPosition.z));
          vAlpha = 1.0;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying float vAlpha;

        void main() {
          vec4 color = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(color.rgb, color.a * vAlpha);
        }
      `,
    });
  }

  startParticleSequence() {
    const { uniforms } = this.particleMaterial;

    if (this.particleSequence) {
      this.particleSequence.kill();
    }

    this.particleSequence = gsap.timeline({ repeat: -1 });

    this.particleSequence
      .call(() => {
        uniforms.uStage.value = PARTICLE_STAGE_SPHERE_TO_LOGO;
        uniforms.uProgress.value = 0;
      })
      .to(uniforms.uProgress, {
        value: 1,
        duration: PARTICLE_MORPH_TIME,
        ease: "power2.inOut",
      })
      .to({}, { duration: 0.5 })
      .call(() => {
        uniforms.uStage.value = PARTICLE_STAGE_LOGO_TO_SCATTER;
        uniforms.uProgress.value = 0;
      })
      .to(uniforms.uProgress, {
        value: 1,
        duration: 2.5,
        ease: "power2.inOut",
      })
      .to({}, { duration: 0.5 })
      .call(() => {
        uniforms.uStage.value = PARTICLE_STAGE_SCATTER_TO_SPHERE;
        uniforms.uProgress.value = 0;
      })
      .to(uniforms.uProgress, {
        value: 1,
        duration: 3.5,
        ease: "power2.inOut",
      })
      .to({}, { duration: 1 });
  }

  initFloatingObjects() {
    this.floatingGroup = new THREE.Group();
    this.scene.add(this.floatingGroup);

    const count = THREE.MathUtils.clamp(
      Math.round((this.width / 1200) * this.qualityProfile.objectBudget),
      this.isMobile ? 40 : 80,
      this.isMobile ? 120 : 220,
    );

    this.sharedResources = this.createFloatingResources();

    let graphCount = 0;
    let areaChartCount = 0;
    let pillarCount = 0;
    let torusCount = 0;
    let octaCount = 0;

    for (let i = 0; i < count; i += 1) {
      const rand = Math.random();

      if (rand < 0.2) {
        graphCount += 1;
      } else if (rand < 0.4) {
        areaChartCount += 1;
      } else if (rand < 0.6) {
        pillarCount += 1;
      } else if (rand < 0.8) {
        torusCount += 1;
      } else {
        octaCount += 1;
      }
    }

    this.createLineGraphs(graphCount);
    this.createAreaCharts(areaChartCount);
    this.createInstancedFloatingType("pillars", pillarCount);
    this.createInstancedFloatingType("torus", torusCount);
    this.createInstancedFloatingType("octa", octaCount);

    this.floatingObjects = [...this.instancedFloating, ...this.groupFloating];
  }

  createFloatingResources() {
    return {
      lineMaterial: new THREE.MeshStandardMaterial({
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.7,
      }),
      areaMaterial: new THREE.MeshStandardMaterial({
        color: 0xbc70ff,
        transparent: true,
        opacity: 0.4,
        wireframe: true,
      }),
      pillarMaterial: new THREE.MeshStandardMaterial({
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.6,
      }),
      torusMaterial: new THREE.MeshStandardMaterial({
        color: 0x00f2ff,
        transparent: true,
        opacity: 0.6,
      }),
      octaMaterial: new THREE.MeshStandardMaterial({
        color: 0xbc70ff,
        wireframe: true,
      }),
      lineGeometry: new THREE.BoxGeometry(1, 4, 4),
      areaGeometry: new THREE.BoxGeometry(15, 1, 15),
      pillarGeometry: new THREE.BoxGeometry(8, 60, 8),
      torusGeometry: new THREE.TorusGeometry(20, 5, 8, 20),
      octaGeometry: new THREE.OctahedronGeometry(25),
    };
  }

  randomFloatingTransform() {
    return {
      x: (Math.random() - 0.5) * FLOATING_RANGE_X,
      y: (Math.random() - 0.5) * FLOATING_RANGE_Y,
      z: (Math.random() - 0.5) * FLOATING_RANGE_Z,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      radius: 55,
    };
  }

  createLineGraphs(count) {
    for (let i = 0; i < count; i += 1) {
      const graph = new THREE.Group();
      let prevX = 0;
      let prevY = 0;

      for (let segmentIndex = 0; segmentIndex < 5; segmentIndex += 1) {
        const nextX = (segmentIndex + 1) * 20;
        const nextY = Math.random() * 50;
        const deltaX = nextX - prevX;
        const deltaY = nextY - prevY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);
        const segment = new THREE.Mesh(
          this.sharedResources.lineGeometry,
          this.sharedResources.lineMaterial,
        );

        segment.position.set((prevX + nextX) * 0.5, (prevY + nextY) * 0.5, 0);
        segment.rotation.z = angle;
        segment.scale.x = distance;

        graph.add(segment);

        prevX = nextX;
        prevY = nextY;
      }

      const transform = this.randomFloatingTransform();

      graph.position.set(transform.x, transform.y, transform.z);
      graph.rotation.set(transform.rotX, transform.rotY, 0);

      this.floatingGroup.add(graph);
      this.groupFloating.push({
        type: "group",
        object: graph,
        z: transform.z,
        rotSpeed: transform.rotSpeed,
        radius: 80,
      });
    }
  }

  createAreaCharts(count) {
    for (let i = 0; i < count; i += 1) {
      const chart = new THREE.Group();

      for (let blockIndex = 0; blockIndex < 4; blockIndex += 1) {
        const height = 20 + Math.random() * 60;
        const block = new THREE.Mesh(
          this.sharedResources.areaGeometry,
          this.sharedResources.areaMaterial,
        );

        block.position.set(blockIndex * 20, height * 0.5, 0);
        block.scale.y = height;
        chart.add(block);
      }

      const transform = this.randomFloatingTransform();

      chart.position.set(transform.x, transform.y, transform.z);
      chart.rotation.set(transform.rotX, transform.rotY, 0);

      this.floatingGroup.add(chart);
      this.groupFloating.push({
        type: "group",
        object: chart,
        z: transform.z,
        rotSpeed: transform.rotSpeed,
        radius: 90,
      });
    }
  }

  createInstancedFloatingType(type, count) {
    if (!count) return;

    let geometry;
    let material;
    let radius;

    if (type === "pillars") {
      geometry = this.sharedResources.pillarGeometry;
      material = this.sharedResources.pillarMaterial;
      radius = 50;
    } else if (type === "torus") {
      geometry = this.sharedResources.torusGeometry;
      material = this.sharedResources.torusMaterial;
      radius = 45;
    } else {
      geometry = this.sharedResources.octaGeometry;
      material = this.sharedResources.octaMaterial;
      radius = 40;
    }

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const data = new Array(count);

    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < count; i += 1) {
      const transform = this.randomFloatingTransform();

      data[i] = {
        x: transform.x,
        y: transform.y,
        z: transform.z,
        rotX: transform.rotX,
        rotY: transform.rotY,
        rotSpeed: transform.rotSpeed,
        radius,
      };

      this.reusableDummy.position.set(transform.x, transform.y, transform.z);
      this.reusableDummy.rotation.set(transform.rotX, transform.rotY, 0);
      this.reusableDummy.updateMatrix();
      mesh.setMatrixAt(i, this.reusableDummy.matrix);
    }

    this.floatingGroup.add(mesh);
    this.instancedFloating.push({
      type: "instanced",
      mesh,
      data,
    });
  }

  updateFloatingFrustum() {
    this.camera.updateMatrixWorld();
    this.projectionScreenMatrix.multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse,
    );
    this.frustum.setFromProjectionMatrix(this.projectionScreenMatrix);
  }

  isFloatingVisible(x, y, z, radius) {
    const center = this.reusableBounds.center;

    center.set(x, y, z);
    this.reusableBounds.radius = radius;

    return this.frustum.intersectsSphere(this.reusableBounds);
  }

  updateGroupFloating() {
    for (let i = 0; i < this.groupFloating.length; i += 1) {
      const item = this.groupFloating[i];
      const object = item.object;

      item.z += this.qualityProfile.floatingSpeed;
      if (item.z > FLOATING_Z_RESET) item.z = FLOATING_Z_START;

      object.position.z = item.z;

      if (!this.isFloatingVisible(object.position.x, object.position.y, item.z, item.radius)) {
        continue;
      }

      object.rotation.x += item.rotSpeed;
      object.rotation.y += item.rotSpeed;
    }
  }

  updateInstancedFloating() {
    for (let groupIndex = 0; groupIndex < this.instancedFloating.length; groupIndex += 1) {
      const instanced = this.instancedFloating[groupIndex];
      const { mesh, data } = instanced;

      for (let i = 0; i < data.length; i += 1) {
        const item = data[i];

        item.z += this.qualityProfile.floatingSpeed;
        if (item.z > FLOATING_Z_RESET) item.z = FLOATING_Z_START;

        if (this.isFloatingVisible(item.x, item.y, item.z, item.radius)) {
          item.rotX += item.rotSpeed;
          item.rotY += item.rotSpeed;
        }

        this.reusableDummy.position.set(item.x, item.y, item.z);
        this.reusableDummy.rotation.set(item.rotX, item.rotY, 0);
        this.reusableDummy.updateMatrix();
        mesh.setMatrixAt(i, this.reusableDummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = this.width < 768;
    this.qualityProfile = this.createQualityProfile();
    this.frameInterval = this.isMobile ? 1 / 30 : 1 / 60;
    this.pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      this.qualityProfile.maxPixelRatio,
    );

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.composer.setSize(this.width, this.height);
    this.composer.setPixelRatio(this.pixelRatio);

    if (this.bloomPass) {
      this.bloomPass.setSize(this.width, this.height);
      this.bloomPass.strength = this.qualityProfile.bloomStrength;
    }

    if (this.particleMaterial) {
      this.particleMaterial.uniforms.uPixelRatio.value = this.pixelRatio;
      this.particleMaterial.uniforms.uSize.value =
        this.qualityProfile.particleSize;
    }
  }

  animate() {
    this.rafId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();
    if (elapsed - this.lastFrame < this.frameInterval) return;
    this.lastFrame = elapsed;

    if (this.particles) {
      this.particles.rotation.y += this.qualityProfile.particleSpin;

      const angle = this.particles.rotation.y % (Math.PI * 2);

      this.particles.scale.x =
        angle > Math.PI / 2 && angle < (Math.PI * 3) / 2 ? -1 : 1;
    }

    this.camera.position.x +=
      (this.mouse.x * 100 - this.camera.position.x) * 0.05;
    this.camera.position.y +=
      (-this.mouse.y * 100 - this.camera.position.y) * 0.05;

    this.camera.position.x += Math.sin(elapsed) * 0.3;
    this.camera.position.y += Math.cos(elapsed) * 0.3;
    this.camera.lookAt(0, 0, 0);

    this.grid.position.z += this.qualityProfile.gridSpeed;
    if (this.grid.position.z > GRID_Z_RESET) this.grid.position.z = 0;

    this.updateFloatingFrustum();
    this.updateGroupFloating();
    this.updateInstancedFloating();

    this.composer.render();
  }

  updateFloatingColors(colorHex) {
    if (!this.sharedResources) return;

    this.sharedResources.lineMaterial.color.set(colorHex);
    this.sharedResources.areaMaterial.color.set(colorHex);
    this.sharedResources.pillarMaterial.color.set(colorHex);
    this.sharedResources.torusMaterial.color.set(colorHex);
    this.sharedResources.octaMaterial.color.set(colorHex);
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("resize", this.onResize);

    if (this.particleSequence) {
      this.particleSequence.kill();
    }
  }
}
