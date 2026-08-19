export const PRISMATRIX_ASSET_PATH = "/assets/3d/prismatrix/scene.gltf";

export const PRISMATRIX_HERO_CONFIG = {
  camera: {
    position: { x: -116, y: 4, z: -7 },
    fov: 45,
    target: { x: 0, y: 0, z: 0 },
    near: 0.1,
    far: 2000,
  },
  composition: {
    desktop: {
      scale: 1.92,
      shiftRight: 43.5,
      shiftUp: -3.5,
      maxDPR: 1.5,
    },
    mobile: {
      scale: 1.5,
      shiftRight: 18,
      shiftUp: -50,
      maxDPR: 1.25,
    },
  },
  renderer: {
    background: 0x050505,
    exposure: 1,
  },
  material: {
    color: "#130f1c",
    metalness: 0.35,
    roughness: 0.1,
    transmission: 0,
    opacity: 0.92,
    thickness: 0,
    ior: 1.52,
    specularIntensity: 1,
    specularColor: "#ffffff",
  },
  lineMaterial: {
    color: "#9484b8",
    metalness: 0.75,
    roughness: 0.18,
    opacity: 0.45,
  },
  lighting: {
    key: {
      color: "#ffffff",
      intensity: 2.2,
      position: { x: -40, y: 60, z: 50 },
    },
    violet: {
      color: "#6e38f7",
      intensity: 1.6,
      position: { x: 50, y: -20, z: -40 },
    },
    magenta: {
      color: "#d62475",
      intensity: 0.6,
      position: { x: -20, y: -35, z: 30 },
    },
    ambient: {
      color: "#ffffff",
      intensity: 0.15,
    },
  },
} as const;

export const PRISMATRIX_EXPECTED_METRICS = {
  drawCalls: 4,
  triangles: 43_776,
} as const;
