/**
 * ============================================================
 * CORE 3D ENGINE
 * ------------------------------------------------------------
 * Performance-focused refactor that preserves the original
 * visual sequence:
 * - particles morph sphere -> logo -> scatter -> sphere
 * - bloom stays enabled
 * - floating objects remain present
 * - grid and camera motion remain intact
 * - GSAP timing is unchanged
 * ============================================================
 */
"use client";

import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from "three-stdlib";
import { RenderPass } from "three-stdlib";
import { UnrealBloomPass } from "three-stdlib";
import { floatBitsToUint } from "three/src/nodes/math/BitcastNode";

const LOGO_SRC = "/logo.png";
const LOGO_CANVAS_SIZE = 512;
const PARTICLE_MORPH_TIME = 3;

const GRID_Y = -400;
const GRID_Z_RESET = 200;

const FLOATING_RANGE_X = 7000;
const FLOATING_RANGE_Y = 5000;
const FLOATING_RANGE_Z = 6000;
const FLOATING_Z_START = -3000;
const FLOATING_Z_RESET = 1500;

const PARTICLE_STAGE_SPHERE_TO_LOGO = 0;
const PARTICLE_STAGE_LOGO_TO_SCATTER = 1;
const PARTICLE_STAGE_SCATTER_TO_SPHERE = 2;

const FLOATING_TYPE_LINE = "line";
const FLOATING_TYPE_AREA = "area";
const FLOATING_TYPE_PILLAR = "pillar";
const FLOATING_TYPE_TORUS = "torus";
const FLOATING_TYPE_OCTA = "octa";

export default class CoreEngine {
  constructor(container, options = {}) {
    this.container = container;
    this.isMobile = options.isMobile || window.innerWidth < 768;
    this.hardwareConcurrency = navigator.hardwareConcurrency || 4;
    this.deviceMemory = navigator.deviceMemory || 4;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.clock = new THREE.Clock();
    this.lastFrame = 0;
    this.frameInterval = this.isMobile ? 1 / 30 : 1 / 60;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.bloomPass = null;
    this.bloomResolutionScale = 1;

    this.grid = null;
    this.particles = null;
    this.particleMaterial = null;
    this.particleSequence = null;
    this.particleUniforms = null;

    this.floatingGroup = null;
    this.floatingEntries = [];
    this.sharedResources = null;

    this.mouse = { x: 0, y: 0 };
    this.pixelRatio = 1;
    this.qualityProfile = this.createQualityProfile();

    this.frustum = new THREE.Frustum();
    this.projectionScreenMatrix = new THREE.Matrix4();
    this.reusableBounds = new THREE.Sphere(new THREE.Vector3(), 1);
    this.reusableDummy = new THREE.Object3D();
    this.reusableParentMatrix = new THREE.Matrix4();
    this.reusableMatrix = new THREE.Matrix4();

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
      maxPixelRatio: this.isMobile ? 1 : 1.5,
      particleSize: this.isMobile ? 3 : 4,
      particleBudget: this.isMobile
        ? Math.round(2600 * quality + 500)
        : Math.round(5200 * quality + 900),
      floatingBudget: this.isMobile
        ? Math.round(70 * quality + 30)
        : Math.round(180 * quality + 80),
      bloomStrength:
        this.hardwareConcurrency <= 4 || this.isMobile ? 0.6 : 1.2,
      bloomResolutionScale:
        this.hardwareConcurrency <= 4 || this.deviceMemory <= 4 || this.isMobile
          ? 0.5
          : 1,
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
    this.renderer.setAnimationLoop(this.animate);
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
      antialias: !this.isMobile,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
      depth: true,
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear=false;
    const gl=this.renderer.getContext();
    const floatBuffer=gl.getExtension("EXT_color_buffer_float");
    const floatLinear=gl.getExtension("OES_texture_float_linear");
    if(!floatBuffer){
      console.warn("EXT_color_buffer_float not supported");
    }
    if(!floatLinear){
      console.warn("OES_texture_float_linear not supported");
    }
    // Clamp pixel ratio aggressively to protect fill rate on dense screens.
    this.pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      this.qualityProfile.maxPixelRatio,
    );

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.shadowMap.enabled = false;
    this.renderer.info.autoReset = false;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);
  }

  initPostProcessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio(this.pixelRatio);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomResolutionScale = this.qualityProfile.bloomResolutionScale;

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(
        this.width * this.bloomResolutionScale,
        this.height * this.bloomResolutionScale,
      ),
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
    const image = new Image();

    image.src = LOGO_SRC;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const coords = this.sampleLogoPixels(image);
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
    const coords = [];
    const sampleStep = this.isMobile ? 4 : 3;

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

    const selected = new Array(targetCount);
    const stride = coords.length / targetCount;

    // Uniform downsampling preserves the logo silhouette while trimming load.
    for (let i = 0; i < targetCount; i += 1) {
      selected[i] = coords[Math.floor(i * stride)];
    }

    return selected;
  }

  createParticleSystem(coords) {
    const count = coords.length;
    const geometry = new THREE.BufferGeometry();
    const spherePositions = new Float32Array(count * 3);
    const logoPositions = new Float32Array(count * 3);
    const scatterPositions = new Float32Array(count * 3);
    const delays = new Float32Array(count);

    // All particle state is generated once up front and then left on the GPU.
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
    this.particleUniforms = this.particleMaterial.uniforms;
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
    if (!this.particleUniforms) return;

    if (this.particleSequence) {
      this.particleSequence.kill();
    }

    // GSAP timings intentionally match the original sequence exactly.
    this.particleSequence = gsap.timeline({ repeat: -1 });

    this.particleSequence
      .call(() => {
        this.particleUniforms.uStage.value = PARTICLE_STAGE_SPHERE_TO_LOGO;
        this.particleUniforms.uProgress.value = 0;
      })
      .to(this.particleUniforms.uProgress, {
        value: 1,
        duration: PARTICLE_MORPH_TIME,
        ease: "power2.inOut",
      })
      .to({}, { duration: 0.5 })
      .call(() => {
        this.particleUniforms.uStage.value = PARTICLE_STAGE_LOGO_TO_SCATTER;
        this.particleUniforms.uProgress.value = 0;
      })
      .to(this.particleUniforms.uProgress, {
        value: 1,
        duration: 2.5,
        ease: "power2.inOut",
      })
      .to({}, { duration: 0.5 })
      .call(() => {
        this.particleUniforms.uStage.value = PARTICLE_STAGE_SCATTER_TO_SPHERE;
        this.particleUniforms.uProgress.value = 0;
      })
      .to(this.particleUniforms.uProgress, {
        value: 1,
        duration: 3.5,
        ease: "power2.inOut",
      })
      .to({}, { duration: 1 });
  }

  initFloatingObjects() {
    this.floatingGroup = new THREE.Group();
    this.scene.add(this.floatingGroup);

    this.sharedResources = this.createFloatingResources();

    const totalCount = THREE.MathUtils.clamp(
      Math.round((this.width / 1200) * this.qualityProfile.floatingBudget),
      this.isMobile ? 40 : 80,
      this.isMobile ? 120 : 220,
    );

    let lineCount = 0;
    let areaCount = 0;
    let pillarCount = 0;
    let torusCount = 0;
    let octaCount = 0;

    for (let i = 0; i < totalCount; i += 1) {
      const rand = Math.random();

      if (rand < 0.2) {
        lineCount += 1;
      } else if (rand < 0.4) {
        areaCount += 1;
      } else if (rand < 0.6) {
        pillarCount += 1;
      } else if (rand < 0.8) {
        torusCount += 1;
      } else {
        octaCount += 1;
      }
    }

    this.createLineGraphInstances(lineCount);
    this.createAreaChartInstances(areaCount);
    this.createSimpleFloatingInstances(FLOATING_TYPE_PILLAR, pillarCount);
    this.createSimpleFloatingInstances(FLOATING_TYPE_TORUS, torusCount);
    this.createSimpleFloatingInstances(FLOATING_TYPE_OCTA, octaCount);
  }

  createFloatingResources() {
    return {
      lineGeometry: new THREE.BoxGeometry(1, 4, 4),
      areaGeometry: new THREE.BoxGeometry(15, 1, 15),
      pillarGeometry: new THREE.BoxGeometry(8, 60, 8),
      torusGeometry: new THREE.TorusGeometry(20, 5, 8, 20),
      octaGeometry: new THREE.OctahedronGeometry(25),
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
    };
  }

  createTransformBuffers(count, radius) {
    return {
      count,
      radius,
      x: new Float32Array(count),
      y: new Float32Array(count),
      z: new Float32Array(count),
      rotX: new Float32Array(count),
      rotY: new Float32Array(count),
      rotSpeed: new Float32Array(count),
    };
  }

  fillRandomTransform(buffers, index) {
    buffers.x[index] = (Math.random() - 0.5) * FLOATING_RANGE_X;
    buffers.y[index] = (Math.random() - 0.5) * FLOATING_RANGE_Y;
    buffers.z[index] = (Math.random() - 0.5) * FLOATING_RANGE_Z;
    buffers.rotX[index] = Math.random() * Math.PI;
    buffers.rotY[index] = Math.random() * Math.PI;
    buffers.rotSpeed[index] = (Math.random() - 0.5) * 0.015;
  }

  createSimpleFloatingInstances(type, count) {
    if (!count) return;

    let geometry;
    let material;
    let radius;

    if (type === FLOATING_TYPE_PILLAR) {
      geometry = this.sharedResources.pillarGeometry;
      material = this.sharedResources.pillarMaterial;
      radius = 50;
    } else if (type === FLOATING_TYPE_TORUS) {
      geometry = this.sharedResources.torusGeometry;
      material = this.sharedResources.torusMaterial;
      radius = 45;
    } else {
      geometry = this.sharedResources.octaGeometry;
      material = this.sharedResources.octaMaterial;
      radius = 40;
    }

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const transforms = this.createTransformBuffers(count, radius);

    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let i = 0; i < count; i += 1) {
      this.fillRandomTransform(transforms, i);
      this.reusableDummy.position.set(
        transforms.x[i],
        transforms.y[i],
        transforms.z[i],
      );
      this.reusableDummy.rotation.set(
        transforms.rotX[i],
        transforms.rotY[i],
        0,
      );
      this.reusableDummy.scale.set(1, 1, 1);
      this.reusableDummy.updateMatrix();
      mesh.setMatrixAt(i, this.reusableDummy.matrix);
    }

    this.floatingGroup.add(mesh);
    this.floatingEntries.push({
      kind: "simple",
      type,
      mesh,
      transforms,
    });
  }

  createLineGraphInstances(count) {
    if (!count) return;

    const segmentsPerGraph = 5;
    const totalInstances = count * segmentsPerGraph;
    const mesh = new THREE.InstancedMesh(
      this.sharedResources.lineGeometry,
      this.sharedResources.lineMaterial,
      totalInstances,
    );
    const transforms = this.createTransformBuffers(count, 80);
    const localMatrices = new Array(totalInstances);

    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let parentIndex = 0; parentIndex < count; parentIndex += 1) {
      this.fillRandomTransform(transforms, parentIndex);

      let prevX = 0;
      let prevY = 0;

      for (
        let segmentIndex = 0;
        segmentIndex < segmentsPerGraph;
        segmentIndex += 1
      ) {
        const nextX = (segmentIndex + 1) * 20;
        const nextY = Math.random() * 50;
        const deltaX = nextX - prevX;
        const deltaY = nextY - prevY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);
        const instanceIndex = parentIndex * segmentsPerGraph + segmentIndex;

        this.reusableDummy.position.set(
          (prevX + nextX) * 0.5,
          (prevY + nextY) * 0.5,
          0,
        );
        this.reusableDummy.rotation.set(0, 0, angle);
        this.reusableDummy.scale.set(distance, 1, 1);
        this.reusableDummy.updateMatrix();

        localMatrices[instanceIndex] = this.reusableDummy.matrix.clone();

        prevX = nextX;
        prevY = nextY;
      }
    }

    this.applyGroupedMatrices(mesh, transforms, localMatrices, segmentsPerGraph);

    this.floatingGroup.add(mesh);
    this.floatingEntries.push({
      kind: "grouped",
      type: FLOATING_TYPE_LINE,
      mesh,
      transforms,
      localMatrices,
      instancesPerParent: segmentsPerGraph,
    });
  }

  createAreaChartInstances(count) {
    if (!count) return;

    const blocksPerChart = 4;
    const totalInstances = count * blocksPerChart;
    const mesh = new THREE.InstancedMesh(
      this.sharedResources.areaGeometry,
      this.sharedResources.areaMaterial,
      totalInstances,
    );
    const transforms = this.createTransformBuffers(count, 90);
    const localMatrices = new Array(totalInstances);

    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    for (let parentIndex = 0; parentIndex < count; parentIndex += 1) {
      this.fillRandomTransform(transforms, parentIndex);

      for (let blockIndex = 0; blockIndex < blocksPerChart; blockIndex += 1) {
        const height = 20 + Math.random() * 60;
        const instanceIndex = parentIndex * blocksPerChart + blockIndex;

        this.reusableDummy.position.set(blockIndex * 20, height * 0.5, 0);
        this.reusableDummy.rotation.set(0, 0, 0);
        this.reusableDummy.scale.set(1, height, 1);
        this.reusableDummy.updateMatrix();

        localMatrices[instanceIndex] = this.reusableDummy.matrix.clone();
      }
    }

    this.applyGroupedMatrices(mesh, transforms, localMatrices, blocksPerChart);

    this.floatingGroup.add(mesh);
    this.floatingEntries.push({
      kind: "grouped",
      type: FLOATING_TYPE_AREA,
      mesh,
      transforms,
      localMatrices,
      instancesPerParent: blocksPerChart,
    });
  }

  applyGroupedMatrices(mesh, transforms, localMatrices, instancesPerParent) {
    const parentCount = transforms.count;

    for (let parentIndex = 0; parentIndex < parentCount; parentIndex += 1) {
      this.reusableDummy.position.set(
        transforms.x[parentIndex],
        transforms.y[parentIndex],
        transforms.z[parentIndex],
      );
      this.reusableDummy.rotation.set(
        transforms.rotX[parentIndex],
        transforms.rotY[parentIndex],
        0,
      );
      this.reusableDummy.scale.set(1, 1, 1);
      this.reusableDummy.updateMatrix();

      this.reusableParentMatrix.copy(this.reusableDummy.matrix);

      const start = parentIndex * instancesPerParent;
      const end = start + instancesPerParent;

      for (let instanceIndex = start; instanceIndex < end; instanceIndex += 1) {
        this.reusableMatrix.multiplyMatrices(
          this.reusableParentMatrix,
          localMatrices[instanceIndex],
        );
        mesh.setMatrixAt(instanceIndex, this.reusableMatrix);
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
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
    this.reusableBounds.center.set(x, y, z);
    this.reusableBounds.radius = radius;

    return this.frustum.intersectsSphere(this.reusableBounds);
  }

  updateFloating(deltaScale) {
    for (let entryIndex = 0; entryIndex < this.floatingEntries.length; entryIndex += 1) {
      const entry = this.floatingEntries[entryIndex];
      const { transforms, mesh } = entry;
      const count = transforms.count;
      let changed = false;

      if (entry.kind === "simple") {
        for (let i = 0; i < count; i += 1) {
          transforms.z[i] += this.qualityProfile.floatingSpeed * deltaScale;
          if (transforms.z[i] > FLOATING_Z_RESET) {
            transforms.z[i] = FLOATING_Z_START;
          }

          const isVisible = this.isFloatingVisible(
            transforms.x[i],
            transforms.y[i],
            transforms.z[i],
            transforms.radius,
          );

          if (isVisible) {
            transforms.rotX[i] += transforms.rotSpeed[i] * deltaScale;
            transforms.rotY[i] += transforms.rotSpeed[i] * deltaScale;

            this.reusableDummy.position.set(
              transforms.x[i],
              transforms.y[i],
              transforms.z[i],
            );
            this.reusableDummy.rotation.set(
              transforms.rotX[i],
              transforms.rotY[i],
              0,
            );
            this.reusableDummy.scale.set(1, 1, 1);
            this.reusableDummy.updateMatrix();
            mesh.setMatrixAt(i, this.reusableDummy.matrix);
            changed = true;
          }
        }
      } else {
        const { localMatrices, instancesPerParent } = entry;

        for (let parentIndex = 0; parentIndex < count; parentIndex += 1) {
          transforms.z[parentIndex] +=
            this.qualityProfile.floatingSpeed * deltaScale;
          if (transforms.z[parentIndex] > FLOATING_Z_RESET) {
            transforms.z[parentIndex] = FLOATING_Z_START;
          }

          const isVisible = this.isFloatingVisible(
            transforms.x[parentIndex],
            transforms.y[parentIndex],
            transforms.z[parentIndex],
            transforms.radius,
          );

          if (isVisible) {
            transforms.rotX[parentIndex] +=
              transforms.rotSpeed[parentIndex] * deltaScale;
            transforms.rotY[parentIndex] +=
              transforms.rotSpeed[parentIndex] * deltaScale;

            this.reusableDummy.position.set(
              transforms.x[parentIndex],
              transforms.y[parentIndex],
              transforms.z[parentIndex],
            );
            this.reusableDummy.rotation.set(
              transforms.rotX[parentIndex],
              transforms.rotY[parentIndex],
              0,
            );
            this.reusableDummy.scale.set(1, 1, 1);
            this.reusableDummy.updateMatrix();
            this.reusableParentMatrix.copy(this.reusableDummy.matrix);

            const start = parentIndex * instancesPerParent;
            const end = start + instancesPerParent;

            for (
              let instanceIndex = start;
              instanceIndex < end;
              instanceIndex += 1
            ) {
              this.reusableMatrix.multiplyMatrices(
                this.reusableParentMatrix,
                localMatrices[instanceIndex],
              );
              mesh.setMatrixAt(instanceIndex, this.reusableMatrix);
            }

            changed = true;
          }
        }
      }

      if (changed) {
        mesh.instanceMatrix.needsUpdate = true;
      }
    }
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = this.width < 768;
    this.qualityProfile = this.createQualityProfile();
    this.frameInterval = this.isMobile ? 1 / 30 : 1 / 60;
    this.bloomResolutionScale = this.qualityProfile.bloomResolutionScale;

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
      this.bloomPass.setSize(
        this.width * this.bloomResolutionScale,
        this.height * this.bloomResolutionScale,
      );
      this.bloomPass.strength = this.qualityProfile.bloomStrength;
    }

    if (this.particleUniforms) {
      this.particleUniforms.uPixelRatio.value = this.pixelRatio;
      this.particleUniforms.uSize.value = this.qualityProfile.particleSize;
    }
  }

  animate() {
    this.renderer.info.reset();
    const elapsed = this.clock.getElapsedTime();
    const delta = Math.min(elapsed - this.lastFrame, 0.1);

    if (delta < this.frameInterval) return;

    this.lastFrame = elapsed;

    // Normalize motion to ~60 fps so throttling on mobile does not change timing.
    const deltaScale = delta * 60;

    if (this.particles) {
      this.particles.rotation.y += this.qualityProfile.particleSpin * deltaScale;

      const angle = this.particles.rotation.y % (Math.PI * 2);

      this.particles.scale.x =
        angle > Math.PI / 2 && angle < (Math.PI * 3) / 2 ? -1 : 1;
    }

    this.camera.position.x +=
      (this.mouse.x * 100 - this.camera.position.x) * 0.05 * deltaScale;
    this.camera.position.y +=
      (-this.mouse.y * 100 - this.camera.position.y) * 0.05 * deltaScale;

    this.camera.position.x += Math.sin(elapsed) * 0.3 * deltaScale;
    this.camera.position.y += Math.cos(elapsed) * 0.3 * deltaScale;
    this.camera.lookAt(0, 0, 0);

    this.grid.position.z += this.qualityProfile.gridSpeed * deltaScale;
    if (this.grid.position.z > GRID_Z_RESET) this.grid.position.z = 0;

    this.updateFloatingFrustum();
    this.updateFloating(deltaScale);

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
    if (this.renderer) {
      this.renderer.setAnimationLoop(null);
    }

    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("resize", this.onResize);

    if (this.particleSequence) {
      this.particleSequence.kill();
    }
  }
}
