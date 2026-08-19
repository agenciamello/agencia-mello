import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { PRISMATRIX_HERO_CONFIG } from "../config/prismatrixHeroConfig";

export interface PrismatrixMetrics {
  fps: number;
  drawCalls: number;
  triangles: number;
  dpr: number;
}

interface PrismatrixSceneOptions {
  onReady?: () => void;
  onMetrics?: (metrics: PrismatrixMetrics) => void;
  onError?: () => void;
}

export class PrismatrixScene {
  private readonly container: HTMLElement;
  private readonly options: PrismatrixSceneOptions;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly modelContainer = new THREE.Group();
  private readonly resizeObserver: ResizeObserver;
  private readonly melloBodyMaterial: THREE.MeshPhysicalMaterial;
  private readonly melloLineMaterial: THREE.MeshPhysicalMaterial;
  private readonly originalMaterials = new Set<THREE.Material>();
  private environmentTarget: THREE.WebGLRenderTarget | null = null;
  private loadedModel: THREE.Object3D | null = null;
  private animationFrameId: number | null = null;
  private destroyed = false;
  private frameCount = 0;
  private lastMetricsAt = performance.now();

  constructor(container: HTMLElement, options: PrismatrixSceneOptions = {}) {
    this.container = container;
    this.options = options;

    const { camera, lighting, material, lineMaterial, renderer } =
      PRISMATRIX_HERO_CONFIG;
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    this.scene.background = new THREE.Color(renderer.background);

    this.renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = renderer.exposure;
    this.renderer.shadowMap.enabled = false;
    this.renderer.setClearColor(renderer.background, 1);
    this.renderer.setSize(width, height, false);
    this.updatePixelRatio(width);
    this.renderer.domElement.setAttribute("aria-hidden", "true");
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
    this.camera.lookAt(camera.target.x, camera.target.y, camera.target.z);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvironment = new RoomEnvironment();
    this.environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
    this.scene.environment = this.environmentTarget.texture;
    roomEnvironment.dispose();
    pmremGenerator.dispose();

    this.addDirectionalLight(lighting.key);
    this.addDirectionalLight(lighting.violet);
    this.addDirectionalLight(lighting.magenta);
    this.scene.add(
      new THREE.AmbientLight(lighting.ambient.color, lighting.ambient.intensity),
    );

    this.melloBodyMaterial = new THREE.MeshPhysicalMaterial({
      color: material.color,
      metalness: material.metalness,
      roughness: material.roughness,
      transmission: material.transmission,
      opacity: material.opacity,
      thickness: material.thickness,
      ior: material.ior,
      specularIntensity: material.specularIntensity,
      specularColor: material.specularColor,
      transparent: true,
      side: THREE.FrontSide,
    });

    this.melloLineMaterial = new THREE.MeshPhysicalMaterial({
      color: lineMaterial.color,
      metalness: lineMaterial.metalness,
      roughness: lineMaterial.roughness,
      transmission: 0,
      opacity: lineMaterial.opacity,
      thickness: 0,
      ior: 1.5,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.FrontSide,
    });

    this.scene.add(this.modelContainer);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(this.container);
    this.animate();
  }

  public loadModel(url: string): void {
    new GLTFLoader().load(
      url,
      (gltf) => {
        if (this.destroyed) {
          this.disposeLoadedObject(gltf.scene);
          return;
        }

        this.loadedModel = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        const center = bounds.getCenter(new THREE.Vector3());
        gltf.scene.position.set(-center.x, -center.y, -center.z);

        gltf.scene.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;

          const sourceMaterials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          sourceMaterials.forEach((sourceMaterial) =>
            this.originalMaterials.add(sourceMaterial),
          );

          const materialNames = sourceMaterials
            .map((sourceMaterial) => sourceMaterial.name.toLowerCase())
            .join(" ");
          const isLine =
            materialNames.includes("line") ||
            child.name.includes("Object_4") ||
            child.name.includes("Object_5");
          child.material = isLine
            ? this.melloLineMaterial
            : this.melloBodyMaterial;
        });

        this.modelContainer.add(gltf.scene);
        this.applyComposition();
        this.renderer.render(this.scene, this.camera);
        this.options.onReady?.();
      },
      undefined,
      () => {
        if (!this.destroyed) this.options.onError?.();
      },
    );
  }

  public destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.resizeObserver.disconnect();
    if (this.loadedModel) this.disposeLoadedObject(this.loadedModel);
    this.originalMaterials.forEach((material) => material.dispose());
    this.originalMaterials.clear();
    this.melloBodyMaterial.dispose();
    this.melloLineMaterial.dispose();
    this.environmentTarget?.dispose();
    this.environmentTarget = null;
    this.scene.environment = null;
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }

  private addDirectionalLight(
    config: (typeof PRISMATRIX_HERO_CONFIG.lighting)[
      | "key"
      | "violet"
      | "magenta"],
  ): void {
    const light = new THREE.DirectionalLight(config.color, config.intensity);
    light.position.set(config.position.x, config.position.y, config.position.z);
    this.scene.add(light);
  }

  private applyComposition(): void {
    const width = Math.max(this.container.clientWidth, 1);
    const composition =
      width <= 768
        ? PRISMATRIX_HERO_CONFIG.composition.mobile
        : PRISMATRIX_HERO_CONFIG.composition.desktop;

    this.modelContainer.rotation.set(0, 0, 0);
    this.modelContainer.scale.setScalar(composition.scale);

    const target = new THREE.Vector3(
      PRISMATRIX_HERO_CONFIG.camera.target.x,
      PRISMATRIX_HERO_CONFIG.camera.target.y,
      PRISMATRIX_HERO_CONFIG.camera.target.z,
    );
    const viewDirection = target.clone().sub(this.camera.position).normalize();
    const cameraRight = new THREE.Vector3()
      .crossVectors(viewDirection, this.camera.up)
      .normalize();
    const cameraUp = new THREE.Vector3()
      .crossVectors(cameraRight, viewDirection)
      .normalize();

    this.modelContainer.position
      .set(0, 0, 0)
      .addScaledVector(cameraRight, composition.shiftRight)
      .addScaledVector(cameraUp, composition.shiftUp);
  }

  private updatePixelRatio(width: number): void {
    const maxDPR =
      width <= 768
        ? PRISMATRIX_HERO_CONFIG.composition.mobile.maxDPR
        : PRISMATRIX_HERO_CONFIG.composition.desktop.maxDPR;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDPR));
  }

  private resize = (): void => {
    if (this.destroyed) return;
    const width = Math.max(this.container.clientWidth, 1);
    const height = Math.max(this.container.clientHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.updatePixelRatio(width);
    if (this.loadedModel) this.applyComposition();
  };

  private animate = (): void => {
    if (this.destroyed) return;
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);

    this.frameCount += 1;
    const now = performance.now();
    const elapsed = now - this.lastMetricsAt;
    if (elapsed < 500) return;

    this.options.onMetrics?.({
      fps: Math.round((this.frameCount * 1000) / elapsed),
      drawCalls: this.renderer.info.render.calls,
      triangles: this.renderer.info.render.triangles,
      dpr: Number(this.renderer.getPixelRatio().toFixed(2)),
    });
    this.frameCount = 0;
    this.lastMetricsAt = now;
  };

  private disposeLoadedObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) child.geometry.dispose();
    });
    object.removeFromParent();
  }
}
