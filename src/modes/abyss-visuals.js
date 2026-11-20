import * as T from 'three';

function makeRuneMark(text, accent = '#ff6aa8') {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#12081c';
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 3, 250, 58);
  ctx.font = 'bold 28px monospace';
  ctx.fillStyle = '#f8e9ff';
  ctx.fillText(text, 14, 42);
  const tex = new T.CanvasTexture(canvas);
  tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

export function createAbyssWeaponViewmodels(parent) {
  const root = new T.Group();
  root.visible = false;
  parent.add(root);

  const darkAlloy = new T.MeshStandardMaterial({ color: 0x171124, metalness: 0.78, roughness: 0.28 });
  const gunmetal = new T.MeshStandardMaterial({ color: 0x3b3154, metalness: 0.72, roughness: 0.34 });
  const gripMat = new T.MeshStandardMaterial({ color: 0x0b0812, metalness: 0.15, roughness: 0.85 });
  const sawGlow = new T.MeshStandardMaterial({ color: 0xff5a8a, emissive: 0xff2b6d, emissiveIntensity: 1.7, metalness: 0.4, roughness: 0.2 });
  const cryoGlow = new T.MeshStandardMaterial({ color: 0x8ef3ff, emissive: 0x2fd3ff, emissiveIntensity: 1.7, metalness: 0.35, roughness: 0.18 });
  const vortexGlow = new T.MeshStandardMaterial({ color: 0xd094ff, emissive: 0x8b3dff, emissiveIntensity: 1.85, metalness: 0.35, roughness: 0.2 });
  const scytheGlow = new T.MeshStandardMaterial({ color: 0xffdf7a, emissive: 0xff9f2f, emissiveIntensity: 1.8, metalness: 0.65, roughness: 0.22 });

  const cube = new T.BoxGeometry(1, 1, 1);
  const addBox = (g, x, y, z, w, h, d, m) => {
    const o = new T.Mesh(cube, m);
    o.position.set(x, y, z);
    o.scale.set(w, h, d);
    g.add(o);
    return o;
  };
  const addMark = (g, text, color, x, y, z) => {
    const tex = makeRuneMark(text, color);
    if (!tex) return;
    const plate = new T.Mesh(new T.PlaneGeometry(0.16, 0.04), new T.MeshBasicMaterial({ map: tex }));
    plate.position.set(x, y, z);
    plate.rotation.x = -Math.PI / 2;
    g.add(plate);
  };

  const models = [];
  const muzzles = [];
  const animated = { sawSpinner: null, cryoTips: [], vortexOrb: null, vortexRing: null, scytheBlade: null };

  // 0: VORTEX SAW — Twin fork rails + live serrated saw disc
  {
    const g = new T.Group();
    root.add(g);
    models.push(g);
    addBox(g, 0, -0.02, 0.03, 0.19, 0.18, 0.34, darkAlloy);
    addBox(g, 0, -0.15, 0.08, 0.08, 0.2, 0.09, gripMat).rotation.x = -0.22;
    for (const side of [-1, 1]) {
      addBox(g, side * 0.085, 0.01, -0.34, 0.042, 0.09, 0.48, gunmetal);
      addBox(g, side * 0.095, 0.02, -0.36, 0.014, 0.028, 0.42, sawGlow);
    }
    addBox(g, 0, -0.06, -0.24, 0.14, 0.04, 0.28, darkAlloy);
    const spinner = new T.Group();
    spinner.position.set(0, 0.02, -0.5);
    const disc = new T.Mesh(new T.CylinderGeometry(0.11, 0.11, 0.016, 16), sawGlow);
    spinner.add(disc);
    const hub = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.032, 10), gunmetal);
    spinner.add(hub);
    for (let i = 0; i < 6; i++) {
      const tooth = new T.Mesh(cube, darkAlloy);
      const a = (i / 6) * Math.PI * 2;
      tooth.position.set(Math.cos(a) * 0.115, 0, Math.sin(a) * 0.115);
      tooth.scale.set(0.035, 0.018, 0.022);
      tooth.rotation.y = -a;
      spinner.add(tooth);
    }
    g.add(spinner);
    animated.sawSpinner = spinner;
    addMark(g, 'SAW-01', '#ff5a8a', 0, 0.075, 0.02);
    const muzzle = new T.Object3D();
    muzzle.position.set(0, 0.02, -0.66);
    g.add(muzzle);
    muzzles.push(muzzle);
  }

  // 1: CRYO-TESLA — Tri-prong emitter + cryo condenser coils
  {
    const g = new T.Group();
    root.add(g);
    models.push(g);
    addBox(g, 0, -0.02, 0.02, 0.18, 0.17, 0.34, darkAlloy);
    addBox(g, 0, -0.15, 0.07, 0.08, 0.2, 0.09, gripMat).rotation.x = -0.22;
    const coreCyl = new T.Mesh(new T.CylinderGeometry(0.048, 0.048, 0.42, 12), cryoGlow);
    coreCyl.rotation.x = Math.PI / 2;
    coreCyl.position.set(0, 0.02, -0.34);
    g.add(coreCyl);
    for (let j = 0; j < 3; j++) {
      const ring = new T.Mesh(new T.TorusGeometry(0.068, 0.011, 6, 16), gunmetal);
      ring.position.set(0, 0.02, -0.22 - j * 0.11);
      g.add(ring);
    }
    for (const [px, py] of [[0, 0.1], [-0.085, -0.035], [0.085, -0.035]]) {
      addBox(g, px, py, -0.45, 0.026, 0.026, 0.42, gunmetal);
      const tip = new T.Mesh(new T.OctahedronGeometry(0.024, 0), cryoGlow);
      tip.position.set(px, py, -0.68);
      g.add(tip);
      animated.cryoTips.push(tip);
    }
    addMark(g, 'CRYO-02', '#6cecff', 0, 0.07, 0.03);
    const muzzle = new T.Object3D();
    muzzle.position.set(0, 0.02, -0.7);
    g.add(muzzle);
    muzzles.push(muzzle);
  }

  // 2: SINGULARITY — Gravity cage cradling suspended orbiting core
  {
    const g = new T.Group();
    root.add(g);
    models.push(g);
    addBox(g, 0, -0.03, 0.04, 0.22, 0.19, 0.34, darkAlloy);
    addBox(g, 0, -0.16, 0.08, 0.09, 0.2, 0.095, gripMat).rotation.x = -0.22;
    for (const side of [-1, 1]) {
      addBox(g, side * 0.11, 0.01, -0.36, 0.045, 0.12, 0.5, gunmetal);
      addBox(g, side * 0.115, 0.075, -0.36, 0.02, 0.015, 0.46, vortexGlow);
    }
    addBox(g, 0, -0.085, -0.36, 0.22, 0.04, 0.48, darkAlloy);
    const orb = new T.Mesh(new T.OctahedronGeometry(0.065, 1), vortexGlow);
    orb.position.set(0, 0.03, -0.44);
    g.add(orb);
    const ring = new T.Mesh(new T.TorusGeometry(0.095, 0.01, 6, 20), new T.MeshStandardMaterial({ color: 0xf0c9ff, emissive: 0xc07dff, emissiveIntensity: 1.5 }));
    ring.position.set(0, 0.03, -0.44);
    ring.rotation.x = 0.7;
    g.add(ring);
    animated.vortexOrb = orb;
    animated.vortexRing = ring;
    addMark(g, 'VOID-03', '#c07dff', 0, 0.075, 0.04);
    const muzzle = new T.Object3D();
    muzzle.position.set(0, 0.03, -0.66);
    g.add(muzzle);
    muzzles.push(muzzle);
  }

  // 3: VOID SCYTHE — Swept crimson-gold energy katana/crescent blade
  {
    const g = new T.Group();
    root.add(g);
    models.push(g);
    const bladeAssembly = new T.Group();
    g.add(bladeAssembly);
    // Hilt & emitter guard
    addBox(bladeAssembly, 0, -0.08, 0.06, 0.065, 0.26, 0.075, gripMat).rotation.x = 0.18;
    addBox(bladeAssembly, 0, 0.06, 0.02, 0.14, 0.03, 0.11, gunmetal);
    addBox(bladeAssembly, 0, 0.11, -0.05, 0.08, 0.12, 0.14, darkAlloy);
    // Swept dual-edge blade spine + crescent plasma edge
    const spine = addBox(bladeAssembly, 0, 0.24, -0.36, 0.02, 0.055, 0.72, gunmetal);
    spine.rotation.x = 0.28;
    const edge = addBox(bladeAssembly, 0, 0.27, -0.39, 0.012, 0.075, 0.78, scytheGlow);
    edge.rotation.x = 0.28;
    const tipBlade = new T.Mesh(new T.ConeGeometry(0.052, 0.24, 4), scytheGlow);
    tipBlade.position.set(0, 0.37, -0.78);
    tipBlade.rotation.x = -Math.PI / 2 + 0.28;
    bladeAssembly.add(tipBlade);
    const crossGuardRing = new T.Mesh(new T.TorusGeometry(0.065, 0.009, 6, 16), scytheGlow);
    crossGuardRing.position.set(0, 0.12, -0.08);
    bladeAssembly.add(crossGuardRing);
    animated.scytheBlade = bladeAssembly;
    const muzzle = new T.Object3D();
    muzzle.position.set(0, 0.22, -0.72);
    g.add(muzzle);
    muzzles.push(muzzle);
  }

  let swingTime = 0;

  return {
    root,
    models,
    muzzles,
    triggerSwing() {
      swingTime = 0.28;
    },
    update(dt, { active = false, weapon = 0, time = 0, recoil = 0, reloadPhase = 0, swapAnim = 0 } = {}) {
      root.visible = !!active;
      if (!active) return;
      models.forEach((m, i) => {
        m.visible = i === weapon;
      });
      swingTime = Math.max(0, swingTime - dt);
      if (animated.sawSpinner) {
        animated.sawSpinner.rotation.y += dt * (weapon === 0 ? 12 + recoil * 40 : 4);
      }
      if (animated.cryoTips.length) {
        for (let i = 0; i < animated.cryoTips.length; i++) {
          animated.cryoTips[i].rotation.z = time * 4 + i * 2;
        }
      }
      if (animated.vortexOrb && animated.vortexRing) {
        animated.vortexOrb.rotation.y += dt * 3.5;
        animated.vortexRing.rotation.z += dt * 5;
        animated.vortexRing.rotation.x = 0.7 + Math.sin(time * 3) * 0.25;
      }
      if (animated.scytheBlade) {
        const t = swingTime > 0 ? Math.sin((1 - swingTime / 0.28) * Math.PI) : 0;
        animated.scytheBlade.rotation.set(-t * 0.75, t * 0.45, 0.25 + t * 1.15);
        animated.scytheBlade.position.set(-t * 0.24, 0, -t * 0.18);
      }
      root.position.set(0.32 + Math.sin(time * 8) * 0.008, -0.28 - recoil * 0.5 + reloadPhase * 0.08 - swapAnim, -0.55 + recoil);
      root.rotation.set(-recoil * 0.6, 0, reloadPhase > 0 ? -0.18 : recoil * 0.18);
      root.scale.setScalar(0.9);
    }
  };
}

export function createAbyssEnemyModel(type, { isChild = false } = {}) {
  const g = new T.Group();
  const obsidian = new T.MeshStandardMaterial({ color: 0x221836, emissive: 0x1a0e30, emissiveIntensity: 0.45, metalness: 0.62, roughness: 0.38 });
  const darkMetal = new T.MeshStandardMaterial({ color: 0x3b2d59, emissive: 0x281847, emissiveIntensity: 0.48, metalness: 0.7, roughness: 0.32 });
  const cube = new T.BoxGeometry(1, 1, 1);
  const addMesh = (geo, mat, x = 0, y = 0, z = 0) => {
    const m = new T.Mesh(geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };
  const addPartBox = (w, h, d, mat, x = 0, y = 0, z = 0) => {
    const m = addMesh(cube, mat, x, y, z);
    m.scale.set(w, h, d);
    return m;
  };

  let core = null;
  let shieldMesh = null;
  const limbs = [];
  const hitTargets = [];

  if (type === 'stalker') {
    const magenta = new T.MeshStandardMaterial({ color: 0xe66bff, emissive: 0xc22fff, emissiveIntensity: 1.5, metalness: 0.3, roughness: 0.25 });
    const torso = addPartBox(0.58, 0.92, 0.5, obsidian, 0, 0.05, 0);
    const chest = addPartBox(0.74, 0.36, 0.56, darkMetal, 0, 0.28, 0.04);
    const helm = addMesh(new T.ConeGeometry(0.28, 0.55, 6), darkMetal, 0, 0.68, 0.05);
    helm.rotation.x = 0.25;
    core = addMesh(new T.OctahedronGeometry(0.26, 0), magenta, 0, 0.3, 0.32);
    hitTargets.push(torso, chest, helm, core);
    for (const side of [-1, 1]) {
      const fin = addPartBox(0.1, 0.7, 0.42, magenta, side * 0.44, 0.38, -0.08);
      fin.rotation.z = -side * 0.32;
      const blade = addPartBox(0.08, 0.14, 0.95, magenta, side * 0.48, -0.02, 0.35);
      blade.rotation.y = side * 0.2;
      const leg = addPartBox(0.16, 0.65, 0.22, darkMetal, side * 0.26, -0.58, 0);
      leg.rotation.z = side * 0.16;
      limbs.push(fin, blade, leg);
      hitTargets.push(fin, blade, leg);
    }
  } else if (type === 'aegis') {
    const amber = new T.MeshStandardMaterial({ color: 0xffa857, emissive: 0xff6e24, emissiveIntensity: 1.4, metalness: 0.4, roughness: 0.25 });
    const hull = addPartBox(1.18, 1.32, 0.96, obsidian, 0, 0, 0);
    const crown = addPartBox(0.84, 0.28, 0.72, darkMetal, 0, 0.78, -0.05);
    core = addMesh(new T.OctahedronGeometry(0.34, 0), amber, 0, 1.18, -0.05); // High dorsal weakpoint
    hitTargets.push(hull, crown, core);
    for (const side of [-1, 1]) {
      const pauldron = addPartBox(0.38, 0.68, 0.85, darkMetal, side * 0.76, 0.36, 0.05);
      const leg = addPartBox(0.32, 0.62, 0.45, darkMetal, side * 0.38, -0.82, 0);
      const cannon = addPartBox(0.18, 0.18, 0.75, amber, side * 0.78, 0.1, 0.45);
      limbs.push(pauldron, leg, cannon);
      hitTargets.push(pauldron, leg, cannon);
    }
    const shieldMat = new T.MeshStandardMaterial({
      color: 0xffbb6e,
      emissive: 0xff8033,
      emissiveIntensity: 1.15,
      transparent: true,
      opacity: 0.46,
      side: T.DoubleSide,
      metalness: 0.2,
      roughness: 0.15
    });
    shieldMesh = new T.Mesh(new T.CylinderGeometry(1.1, 1.1, 1.48, 6, 1, true, -Math.PI * 0.38, Math.PI * 0.76), shieldMat);
    shieldMesh.position.set(0, 0.05, 0.16);
    g.add(shieldMesh);
  } else if (type === 'weaver') {
    const cyan = new T.MeshStandardMaterial({ color: 0x76e0ff, emissive: 0x19a8ff, emissiveIntensity: 1.5, metalness: 0.35, roughness: 0.2 });
    const prism = addMesh(new T.OctahedronGeometry(0.68, 0), obsidian, 0, 0.1, 0);
    const lens = addMesh(new T.CylinderGeometry(0.28, 0.18, 0.35, 8), darkMetal, 0, 0.1, 0.56);
    lens.rotation.x = Math.PI / 2;
    core = addMesh(new T.OctahedronGeometry(0.32, 0), cyan, 0, 0.92, 0);
    const thrusterRing = addMesh(new T.TorusGeometry(0.75, 0.06, 6, 18), cyan, 0, -0.45, 0);
    thrusterRing.rotation.x = Math.PI / 2;
    hitTargets.push(prism, lens, core, thrusterRing);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const shard = addPartBox(0.18, 0.55, 0.18, darkMetal, Math.cos(a) * 0.95, 0.25, Math.sin(a) * 0.95);
      limbs.push(shard);
      hitTargets.push(shard);
    }
  } else if (type === 'splitter') {
    const lime = new T.MeshStandardMaterial({ color: 0x7eff9f, emissive: 0x2de06d, emissiveIntensity: 1.6, metalness: 0.3, roughness: 0.25 });
    const shell = addMesh(new T.IcosahedronGeometry(0.5, 0), obsidian, 0, 0, 0);
    core = addMesh(new T.OctahedronGeometry(0.3, 0), lime, 0, 0.34, 0.22);
    const ringA = addMesh(new T.TorusGeometry(0.68, 0.055, 6, 18), lime, 0, 0, 0);
    ringA.rotation.x = Math.PI / 3;
    const ringB = addMesh(new T.TorusGeometry(0.68, 0.055, 6, 18), darkMetal, 0, 0, 0);
    ringB.rotation.y = Math.PI / 3;
    limbs.push(ringA, ringB);
    hitTargets.push(shell, core, ringA, ringB);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const fin = addPartBox(0.14, 0.1, 0.42, lime, Math.cos(a) * 0.62, 0, Math.sin(a) * 0.62);
      fin.rotation.y = -a;
      limbs.push(fin);
      hitTargets.push(fin);
    }
    if (isChild) g.scale.setScalar(0.66);
  } else {
    // architect Boss — VOID ARCHITECT (3-ring gyroscope monolith + core barrier + 4 laser pylons)
    const rose = new T.MeshStandardMaterial({ color: 0xff6ad5, emissive: 0xe629b0, emissiveIntensity: 1.85, metalness: 0.4, roughness: 0.2 });
    const gold = new T.MeshStandardMaterial({ color: 0xffd275, emissive: 0xff9f2e, emissiveIntensity: 1.35, metalness: 0.72, roughness: 0.22 });
    const monolith = addPartBox(1.65, 3.55, 1.45, obsidian, 0, 0.7, 0);
    const chestArmor = addPartBox(2.4, 1.45, 1.6, darkMetal, 0, 0.95, 0.15);
    const spire = addMesh(new T.ConeGeometry(0.85, 1.75, 6), darkMetal, 0, 3.0, 0);
    const crownRing = addMesh(new T.TorusGeometry(0.92, 0.08, 6, 20), gold, 0, 2.25, 0);
    crownRing.rotation.x = Math.PI / 2;
    core = addMesh(new T.OctahedronGeometry(0.68, 1), gold, 0, 1.15, 0.98);
    shieldMesh = addMesh(
      new T.IcosahedronGeometry(1.12, 1),
      new T.MeshBasicMaterial({ color: 0xd966ff, wireframe: true, transparent: true, opacity: 0.42 })
    );
    shieldMesh.position.set(0, 1.15, 0.98);
    hitTargets.push(monolith, chestArmor, spire, core);

    const halo1 = addMesh(new T.TorusGeometry(2.85, 0.11, 8, 36), rose, 0, 1.05, 0);
    halo1.rotation.x = Math.PI / 2;
    const halo2 = addMesh(new T.TorusGeometry(2.3, 0.085, 8, 30), gold, 0, 1.15, 0);
    halo2.rotation.x = 0.62;
    const halo3 = addMesh(new T.TorusGeometry(1.9, 0.07, 8, 28), rose, 0, 1.15, 0);
    halo3.rotation.y = Math.PI / 2;
    limbs.push(halo1, halo2, halo3);
    hitTargets.push(halo1, halo2, halo3);

    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const pylon = addPartBox(0.4, 1.65, 0.4, darkMetal, Math.cos(a) * 2.25, 1.0, Math.sin(a) * 2.25);
      const pylonGem = addMesh(new T.OctahedronGeometry(0.28, 0), rose, Math.cos(a) * 2.25, 1.98, Math.sin(a) * 2.25);
      limbs.push(pylon, pylonGem);
      hitTargets.push(pylon, pylonGem);
    }
    g.userData.roseMat = rose;
    g.userData.goldMat = gold;
  }

  return { mesh: g, core, limbs, shieldMesh, hitTargets };
}

export function createSawDiscMesh() {
  const g = new T.Group();
  const glow = new T.MeshStandardMaterial({ color: 0xff6296, emissive: 0xff2868, emissiveIntensity: 2.1, metalness: 0.45, roughness: 0.2 });
  const rim = new T.MeshStandardMaterial({ color: 0xffe4f0, emissive: 0xff9ec0, emissiveIntensity: 1.5 });
  const disc = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 0.06, 16), glow);
  g.add(disc);
  const ring = new T.Mesh(new T.TorusGeometry(0.44, 0.035, 6, 18), rim);
  ring.rotation.x = Math.PI / 2;
  g.add(ring);
  const cube = new T.BoxGeometry(0.14, 0.07, 0.08);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const t = new T.Mesh(cube, rim);
    t.position.set(Math.cos(a) * 0.46, 0, Math.sin(a) * 0.46);
    t.rotation.y = -a;
    g.add(t);
  }
  return g;
}

export function createScytheWaveProjectileMesh() {
  const g = new T.Group();
  const outer = new T.Mesh(
    new T.TorusGeometry(1.15, 0.09, 6, 22, Math.PI * 0.85),
    new T.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.92, depthWrite: false, blending: T.AdditiveBlending })
  );
  outer.rotation.x = Math.PI / 2;
  outer.rotation.z = -Math.PI * 0.425;
  const inner = new T.Mesh(
    new T.TorusGeometry(0.9, 0.06, 6, 18, Math.PI * 0.72),
    new T.MeshBasicMaterial({ color: 0xff5a8a, transparent: true, opacity: 0.88, depthWrite: false, blending: T.AdditiveBlending })
  );
  inner.rotation.x = Math.PI / 2;
  inner.rotation.z = -Math.PI * 0.36;
  g.add(outer, inner);
  return g;
}

export function createEliteCrownMesh() {
  const g = new T.Group();
  const mat = new T.MeshBasicMaterial({ color: 0xffd275, transparent: true, opacity: 0.92 });
  const ring = new T.Mesh(new T.TorusGeometry(0.85, 0.055, 6, 24), mat);
  ring.rotation.x = Math.PI / 2;
  const gem = new T.Mesh(new T.OctahedronGeometry(0.24, 0), mat);
  gem.position.y = 0.28;
  g.add(ring, gem);
  return g;
}

export function createSingularityOrbMesh() {
  const g = new T.Group();
  const core = new T.Mesh(new T.OctahedronGeometry(0.26, 1), new T.MeshBasicMaterial({ color: 0xf4dcff }));
  const aura = new T.Mesh(new T.TorusGeometry(0.36, 0.04, 6, 16), new T.MeshBasicMaterial({ color: 0xb86bff, transparent: true, opacity: 0.9 }));
  g.add(core, aura);
  return g;
}

export function createVortexFieldMesh(radius) {
  const g = new T.Group();
  const core = new T.Mesh(new T.SphereGeometry(0.75, 16, 12), new T.MeshBasicMaterial({ color: 0x160424 }));
  const horizon = new T.Mesh(
    new T.TorusGeometry(radius * 0.72, 0.14, 6, 28),
    new T.MeshBasicMaterial({ color: 0xc07dff, transparent: true, opacity: 0.85, depthWrite: false, blending: T.AdditiveBlending })
  );
  horizon.rotation.x = Math.PI / 2;
  const ring2 = new T.Mesh(
    new T.TorusGeometry(radius * 0.45, 0.09, 6, 24),
    new T.MeshBasicMaterial({ color: 0xff80e5, transparent: true, opacity: 0.9, depthWrite: false, blending: T.AdditiveBlending })
  );
  ring2.rotation.x = 0.7;
  g.add(core, horizon, ring2);
  return { group: g, horizon, ring2 };
}

export function createScytheSlashMesh(radius = 3.2) {
  const g = new T.Group();
  const arc = new T.Mesh(
    new T.TorusGeometry(radius, 0.13, 6, 28, Math.PI * 0.72),
    new T.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.92, depthWrite: false, blending: T.AdditiveBlending })
  );
  arc.rotation.x = Math.PI / 2;
  arc.rotation.z = -Math.PI * 0.36;
  const inner = new T.Mesh(
    new T.TorusGeometry(radius * 0.84, 0.08, 6, 24, Math.PI * 0.65),
    new T.MeshBasicMaterial({ color: 0xff628f, transparent: true, opacity: 0.85, depthWrite: false, blending: T.AdditiveBlending })
  );
  inner.rotation.x = Math.PI / 2;
  inner.rotation.z = -Math.PI * 0.325;
  g.add(arc, inner);
  return g;
}

export function createMortarTelegraphMesh(radius) {
  const g = new T.Group();
  const outer = new T.Mesh(
    new T.RingGeometry(radius * 0.86, radius, 28),
    new T.MeshBasicMaterial({ color: 0xff4d88, transparent: true, opacity: 0.9, side: T.DoubleSide, depthWrite: false })
  );
  outer.rotation.x = -Math.PI / 2;
  const fill = new T.Mesh(
    new T.CircleGeometry(radius, 24),
    new T.MeshBasicMaterial({ color: 0xd93bff, transparent: true, opacity: 0.24, side: T.DoubleSide, depthWrite: false })
  );
  fill.rotation.x = -Math.PI / 2;
  fill.scale.setScalar(0.15);
  g.add(outer, fill);
  g.userData.fill = fill;
  return g;
}
