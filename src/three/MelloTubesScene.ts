import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { MELLO_TUBES_HERO_CONFIG } from "../config/melloTubesHeroConfig";

export interface MelloTubesMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  dpr: number;
}

interface MelloTubesSceneOptions {
  reducedMotion?: boolean;
  onReady?: () => void;
  onMetrics?: (metrics: MelloTubesMetrics) => void;
  onError?: () => void;
}

interface PointerSpring {
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
}

const TRAIL_VERTEX_SHADER = /* glsl */ `
  attribute float aResponse;
  uniform vec3 uDeformation;
  varying vec3 vColor;

  void main() {
    float rise = smoothstep(0.08, 0.38, uv.x);
    float fall = 1.0 - smoothstep(0.70, 0.94, uv.x);
    float controlPointPulse = 0.78 + 0.22 * sin(uv.x * 9.42477796);
    float influence = rise * fall * controlPointPulse * aResponse;
    vec3 transformed = position + uDeformation * influence;
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const TRAIL_FRAGMENT_SHADER = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;

  void main() {
    gl_FragColor = vec4(vColor, uOpacity);
  }
`;

export class MelloTubesScene {
  private readonly container: HTMLElement;
  private readonly options: MelloTubesSceneOptions;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly trailsGroup = new THREE.Group();
  private readonly geometries = new Set<THREE.BufferGeometry>();
  private readonly materials = new Set<THREE.Material>();
  private readonly resizeObserver: ResizeObserver;
  private readonly deformation = new THREE.Vector3();
  private intersectionObserver: IntersectionObserver | null = null;
  private readonly pointer: PointerSpring = {
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    velocityX: 0,
    velocityY: 0,
  };
  private animationFrameId: number | null = null;
  private isIntersecting = true;
  private destroyed = false;
  private frameCount = 0;
  private lastMetricsAt = performance.now();

  constructor(container: HTMLElement, options: MelloTubesSceneOptions = {}) {
    this.container = container;
    this.options = options;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    const { camera, renderer } = MELLO_TUBES_HERO_CONFIG;

    try {
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      this.options.onError?.();
      throw new Error("WebGL is not available for the Mello Light Trails.");
    }

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.setClearColor(renderer.clearColor, 0);
    this.renderer.setSize(width, height, false);
    this.updatePixelRatio(width);
    this.renderer.domElement.setAttribute("aria-hidden", "true");
    this.renderer.domElement.style.touchAction = "pan-y";
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      camera.fov,
      width / height,
      camera.near,
      camera.far,
    );
    this.camera.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z,
    );

    this.scene.add(this.trailsGroup);
    this.buildTrails(width);
    this.applyComposition(width);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.container);

    if (!this.options.reducedMotion) {
      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          this.isIntersecting = entry?.isIntersecting ?? false;
          this.syncAnimationState();
        },
        { threshold: 0.01 },
      );
      this.intersectionObserver.observe(this.container);
      this.container.addEventListener("pointermove", this.handlePointerMove, {
        passive: true,
      });
      this.container.addEventListener("pointerleave", this.handlePointerLeave);
      document.addEventListener("visibilitychange", this.syncAnimationState);
    }

    this.renderFrame(0, true);
    if (!this.options.reducedMotion) this.syncAnimationState();
    this.options.onReady?.();
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.resizeObserver.disconnect();
    this.intersectionObserver?.disconnect();
    this.container.removeEventListener("pointermove", this.handlePointerMove);
    this.container.removeEventListener("pointerleave", this.handlePointerLeave);
    document.removeEventListener("visibilitychange", this.syncAnimationState);
    this.geometries.forEach((geometry) => geometry.dispose());
    this.materials.forEach((material) => material.dispose());
    this.geometries.clear();
    this.materials.clear();
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }

  private buildTrails(width: number): void {
    const {
      geometry,
      masterSpline,
      responseMultipliers,
      tubeColors,
      tubeRadii,
    } = MELLO_TUBES_HERO_CONFIG;
    const isMobile = width < MELLO_TUBES_HERO_CONFIG.breakpointPx;
    const tubeCount = isMobile
      ? geometry.mobileTubeCount
      : geometry.desktopTubeCount;
    const tubularSegments = isMobile
      ? geometry.mobileTubularSegments
      : geometry.desktopTubularSegments;
    const radialSegments = isMobile
      ? geometry.mobileRadialSegments
      : geometry.desktopRadialSegments;
    const glowRadialSegments = isMobile
      ? geometry.mobileGlowRadialSegments
      : geometry.desktopGlowRadialSegments;
    const coreGeometries: THREE.BufferGeometry[] = [];
    const glowGeometries: THREE.BufferGeometry[] = [];

    for (let tubeIndex = 0; tubeIndex < tubeCount; tubeIndex += 1) {
      const lane = tubeIndex - (tubeCount - 1) / 2;
      const basePoints = masterSpline.map(([x, y, z], pointIndex) => {
        const localVariation =
          Math.sin(pointIndex * 1.31 + tubeIndex * 0.73) * 0.036;
        return new THREE.Vector3(
          x + lane * 0.018 + localVariation * 0.45,
          y + lane * 0.085 + localVariation,
          z + lane * 0.072 - localVariation * 0.65,
        );
      });
      const trailCurve = new THREE.CatmullRomCurve3(
        basePoints,
        false,
        "catmullrom",
        0.54,
      );
      const coreGeometry = new THREE.TubeGeometry(
        trailCurve,
        tubularSegments,
        tubeRadii[tubeIndex],
        radialSegments,
        false,
      );
      const glowGeometry = new THREE.TubeGeometry(
        trailCurve,
        tubularSegments,
        tubeRadii[tubeIndex] * 3.15,
        glowRadialSegments,
        false,
      );
      const color = new THREE.Color(tubeColors[tubeIndex]);
      const response = responseMultipliers[tubeIndex];
      [coreGeometry, glowGeometry].forEach((trailGeometry) => {
        const vertexCount = trailGeometry.getAttribute("position").count;
        const colors = new Float32Array(vertexCount * 3);
        const responses = new Float32Array(vertexCount);
        for (let vertex = 0; vertex < vertexCount; vertex += 1) {
          colors[vertex * 3] = color.r;
          colors[vertex * 3 + 1] = color.g;
          colors[vertex * 3 + 2] = color.b;
          responses[vertex] = response;
        }
        trailGeometry.setAttribute(
          "color",
          new THREE.BufferAttribute(colors, 3),
        );
        trailGeometry.setAttribute(
          "aResponse",
          new THREE.BufferAttribute(responses, 1),
        );
      });
      coreGeometries.push(coreGeometry);
      glowGeometries.push(glowGeometry);
    }

    const mergedCoreGeometry = mergeGeometries(coreGeometries, false);
    const mergedGlowGeometry = mergeGeometries(glowGeometries, false);
    coreGeometries.forEach((trailGeometry) => trailGeometry.dispose());
    glowGeometries.forEach((trailGeometry) => trailGeometry.dispose());
    if (!mergedCoreGeometry || !mergedGlowGeometry) {
      throw new Error("Unable to assemble the Mello Light Trails geometry.");
    }

    const createMaterial = (opacity: number) =>
      new THREE.ShaderMaterial({
        uniforms: {
          uOpacity: { value: opacity },
          uDeformation: { value: this.deformation },
        },
        vertexShader: TRAIL_VERTEX_SHADER,
        fragmentShader: TRAIL_FRAGMENT_SHADER,
        vertexColors: true,
        transparent: true,
        depthWrite: opacity > 0.5,
        blending:
          opacity > 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending,
        side: opacity > 0.5 ? THREE.FrontSide : THREE.BackSide,
      });
    const coreMaterial = createMaterial(0.92);
    const glowMaterial = createMaterial(0.11);
    const coreMesh = new THREE.Mesh(mergedCoreGeometry, coreMaterial);
    const glowMesh = new THREE.Mesh(mergedGlowGeometry, glowMaterial);
    coreMesh.frustumCulled = false;
    glowMesh.frustumCulled = false;
    this.trailsGroup.add(glowMesh, coreMesh);
    this.geometries.add(mergedCoreGeometry);
    this.geometries.add(mergedGlowGeometry);
    this.materials.add(coreMaterial);
    this.materials.add(glowMaterial);
  }

  private updateTrails(time: number): void {
    const { motion } = MELLO_TUBES_HERO_CONFIG;
    const isMobile =
      this.container.clientWidth < MELLO_TUBES_HERO_CONFIG.breakpointPx;
    const deformationScale = isMobile ? motion.mobileDeformationScale : 1;
    const idleScale = isMobile ? motion.mobileIdleScale : 1;

    const idle = Math.sin(time * motion.idleSpeed) * motion.idleAmplitude;
    this.deformation.set(
      this.pointer.currentX * motion.deformX * deformationScale,
      this.pointer.currentY * motion.deformY * deformationScale +
        idle * idleScale,
      (this.pointer.currentX * 0.68 + this.pointer.currentY * 0.32) *
          motion.deformZ *
          deformationScale +
        Math.cos(time * motion.idleSpeed * 0.82) *
          motion.idleAmplitude *
          0.48 *
          idleScale,
    );
  }

  private applyComposition(width: number): void {
    const composition =
      width < MELLO_TUBES_HERO_CONFIG.breakpointPx
        ? MELLO_TUBES_HERO_CONFIG.composition.mobile
        : MELLO_TUBES_HERO_CONFIG.composition.desktop;
    this.trailsGroup.position.set(
      composition.positionX,
      composition.positionY,
      0,
    );
    this.trailsGroup.scale.setScalar(composition.scale);
  }

  private updatePixelRatio(width: number): void {
    const maxDpr =
      width < MELLO_TUBES_HERO_CONFIG.breakpointPx
        ? MELLO_TUBES_HERO_CONFIG.renderer.mobileMaxDpr
        : MELLO_TUBES_HERO_CONFIG.renderer.desktopMaxDpr;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
  }

  private handlePointerMove = (event: PointerEvent): void => {
    const bounds = this.container.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    this.pointer.targetX = THREE.MathUtils.clamp(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -1,
      1,
    );
    this.pointer.targetY = THREE.MathUtils.clamp(
      -(((event.clientY - bounds.top) / bounds.height) * 2 - 1),
      -1,
      1,
    );
  };

  private handlePointerLeave = (): void => {
    this.pointer.targetX = 0;
    this.pointer.targetY = 0;
  };

  private syncAnimationState = (): void => {
    if (this.destroyed || this.options.reducedMotion) return;
    const shouldAnimate = this.isIntersecting && !document.hidden;

    if (shouldAnimate && this.animationFrameId === null) {
      this.lastMetricsAt = performance.now();
      this.animationFrameId = requestAnimationFrame(this.animate);
    } else if (!shouldAnimate && this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  };

  private animate = (time: number): void => {
    if (this.destroyed || !this.isIntersecting || document.hidden) {
      this.animationFrameId = null;
      return;
    }
    this.renderFrame(time);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private renderFrame(time: number, forceMetrics = false): void {
    const { motion } = MELLO_TUBES_HERO_CONFIG;
    if (!this.options.reducedMotion) {
      this.pointer.velocityX =
        (this.pointer.velocityX +
          (this.pointer.targetX - this.pointer.currentX) * motion.spring) *
        motion.damping;
      this.pointer.velocityY =
        (this.pointer.velocityY +
          (this.pointer.targetY - this.pointer.currentY) * motion.spring) *
        motion.damping;
      this.pointer.currentX += this.pointer.velocityX;
      this.pointer.currentY += this.pointer.velocityY;
    }

    this.updateTrails(time);
    this.renderer.render(this.scene, this.camera);
    this.frameCount += 1;
    const elapsed = time - this.lastMetricsAt;
    if (!forceMetrics && elapsed < 500) return;

    this.options.onMetrics?.({
      fps: forceMetrics ? 0 : Math.round((this.frameCount * 1000) / elapsed),
      drawCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      dpr: Number(this.renderer.getPixelRatio().toFixed(2)),
    });
    this.frameCount = 0;
    this.lastMetricsAt = time;
  }

  private resize = (): void => {
    if (this.destroyed) return;
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.updatePixelRatio(width);
    this.applyComposition(width);
    this.renderFrame(
      this.options.reducedMotion ? 0 : performance.now(),
      true,
    );
  };
}
