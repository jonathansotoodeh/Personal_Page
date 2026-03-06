import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const outDir = path.resolve('src/assets/generated');

class NodeFileReader {
  constructor() {
    this.result = null;
    this.onloadend = null;
    this.onerror = null;
  }

  async readAsArrayBuffer(blob) {
    try {
      this.result = await blob.arrayBuffer();
      this.onloadend?.();
    } catch (error) {
      this.onerror?.(error);
    }
  }

  async readAsDataURL(blob) {
    try {
      const buffer = Buffer.from(await blob.arrayBuffer());
      this.result = `data:${blob.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
      this.onloadend?.();
    } catch (error) {
      this.onerror?.(error);
    }
  }
}

globalThis.FileReader = NodeFileReader;

function applyShadowSettings(object) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return object;
}

function metallic(color, emissive = '#000000', emissiveIntensity = 0, roughness = 0.25, metalness = 0.65) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive,
    emissiveIntensity,
    roughness,
    metalness,
  });
}

function glass(color, opacity = 0.35) {
  return new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    transmission: 0.9,
    roughness: 0.02,
    metalness: 0,
    thickness: 0.12,
  });
}

function createLaptopAsset() {
  const group = new THREE.Group();
  group.name = 'LaptopAsset';

  const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.09, 1.02), metallic('#151d2b'));
  base.position.set(0, 0.05, 0);
  group.add(base);

  const keyboardDeck = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.035, 0.48),
    metallic('#0f1826', '#122c33', 0.25, 0.22, 0.72),
  );
  keyboardDeck.position.set(0, 0.1, 0.12);
  group.add(keyboardDeck);

  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const key = new THREE.Mesh(
        new THREE.BoxGeometry(0.13, 0.018, 0.1),
        metallic('#1a2740', '#00ffff', 0.08, 0.35, 0.5),
      );
      key.position.set(-0.32 + col * 0.16, 0.128, -0.01 + row * 0.12);
      group.add(key);
    }
  }

  const trackpad = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.012, 0.2),
    metallic('#243347', '#8be9ff', 0.06, 0.18, 0.35),
  );
  trackpad.position.set(0, 0.126, 0.36);
  group.add(trackpad);

  const hingeLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12), metallic('#6e7687'));
  hingeLeft.rotation.z = Math.PI / 2;
  hingeLeft.position.set(-0.38, 0.12, -0.42);
  group.add(hingeLeft);

  const hingeRight = hingeLeft.clone();
  hingeRight.position.x = 0.38;
  group.add(hingeRight);

  const screenShell = new THREE.Mesh(
    new THREE.BoxGeometry(1.32, 0.84, 0.06),
    metallic('#121a28', '#101f33', 0.22, 0.16, 0.55),
  );
  screenShell.position.set(0, 0.73, -0.44);
  screenShell.rotation.x = -0.98;
  group.add(screenShell);

  const screenGlow = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.64, 0.015),
    metallic('#83f3ff', '#00ffff', 1.15, 0.12, 0.1),
  );
  screenGlow.position.set(0, 0.72, -0.405);
  screenGlow.rotation.x = -0.98;
  group.add(screenGlow);

  const holoBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.36, 0.14, 0.08),
    metallic('#102332', '#00ffff', 0.4, 0.24, 0.62),
  );
  holoBase.position.set(0, 1.16, -0.82);
  group.add(holoBase);

  const holoPanel = new THREE.Mesh(
    new THREE.BoxGeometry(1.02, 0.28, 0.025),
    metallic('#92ffff', '#00ffff', 1.1, 0.08, 0.08),
  );
  holoPanel.position.set(0, 1.36, -0.82);
  group.add(holoPanel);

  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 10), metallic('#8be9ff', '#00ffff', 0.6));
  antenna.position.set(-0.52, 1.27, -0.86);
  group.add(antenna);

  return applyShadowSettings(group);
}

function createCocktailAsset() {
  const group = new THREE.Group();
  group.name = 'CocktailAsset';

  const coaster = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.08, 24), metallic('#141c29', '#18293b', 0.2, 0.25, 0.72));
  coaster.position.y = 0.04;
  group.add(coaster);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.24, 12), glass('#d6ffff', 0.55));
  stem.position.y = 0.22;
  group.add(stem);

  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.26, 0.74, 22, 1, true), glass('#bdfbff', 0.3));
  bowl.position.y = 0.62;
  group.add(bowl);

  const liquid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.21, 0.3, 20),
    metallic('#35c8ff', '#00ffff', 0.4, 0.18, 0.08),
  );
  liquid.position.y = 0.56;
  group.add(liquid);

  const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 12), metallic('#fff3b0', '#ffff00', 0.25, 0.22, 0.2));
  straw.rotation.z = -0.24;
  straw.position.set(0.1, 0.9, 0);
  group.add(straw);

  const garnish = new THREE.Mesh(
    new THREE.TorusGeometry(0.08, 0.018, 10, 24, Math.PI),
    metallic('#ff8a4e', '#ff8a4e', 0.45, 0.22, 0.18),
  );
  garnish.rotation.z = Math.PI / 2.3;
  garnish.position.set(0.17, 0.86, 0.02);
  group.add(garnish);

  const olive = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    metallic('#8ef285', '#adff90', 0.18, 0.3, 0.1),
  );
  olive.position.set(-0.05, 0.6, 0.04);
  group.add(olive);

  return applyShadowSettings(group);
}

function createContactOrbAsset() {
  const group = new THREE.Group();
  group.name = 'ContactOrbAsset';

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.34, 2),
    metallic('#8b5cf6', '#8b5cf6', 1.1, 0.14, 0.2),
  );
  group.add(core);

  const glowShell = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.48, 2),
    metallic('#00ffff', '#00ffff', 0.45, 0.2, 0.08),
  );
  glowShell.material.transparent = true;
  glowShell.material.opacity = 0.14;
  group.add(glowShell);

  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.022, 16, 64),
    metallic('#00ffff', '#00ffff', 0.9, 0.15, 0.3),
  );
  ringA.rotation.set(0.6, 0.2, 0.1);
  group.add(ringA);

  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(0.76, 0.015, 14, 64),
    metallic('#ff00aa', '#ff00aa', 0.75, 0.18, 0.28),
  );
  ringB.rotation.set(-0.2, 0.9, 1.3);
  group.add(ringB);

  const satellite = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 12, 12),
    metallic('#ffff00', '#ffff00', 1, 0.18, 0.12),
  );
  satellite.position.set(0.58, 0.16, -0.02);
  group.add(satellite);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 0.52, 8),
    metallic('#89fff5', '#00ffff', 0.45, 0.25, 0.22),
  );
  beam.rotation.z = -0.92;
  beam.position.set(0.25, 0.07, -0.01);
  group.add(beam);

  return applyShadowSettings(group);
}

async function exportGlb(name, object) {
  object.updateMatrixWorld(true);
  const exporter = new GLTFExporter();
  const result = await new Promise((resolve, reject) => {
    exporter.parse(
      object,
      resolve,
      reject,
      {
        binary: true,
        onlyVisible: true,
        trs: false,
      },
    );
  });

  const buffer = Buffer.from(result);
  await fs.writeFile(path.join(outDir, `${name}.glb`), buffer);
}

await fs.mkdir(outDir, { recursive: true });
await exportGlb('laptop', createLaptopAsset());
await exportGlb('cocktail', createCocktailAsset());
await exportGlb('contact-orb', createContactOrbAsset());

console.log(`Generated GLTF assets in ${outDir}`);
