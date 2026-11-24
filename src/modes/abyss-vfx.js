import * as T from 'three';

export const ABYSS_WEAPON_THEMES = [
  { id: 'saw', primary: 0xff2b6d, secondary: 0xff9ec4, core: 0xfff0f6 },
  { id: 'cryo', primary: 0x2fd3ff, secondary: 0x8ef3ff, core: 0xf0feff },
  { id: 'vortex', primary: 0x9b45ff, secondary: 0xd99eff, core: 0xf7e8ff },
  { id: 'scythe', primary: 0xffa62b, secondary: 0xff4988, core: 0xfff5d1 }
];

const HIT_PRIORITY = { normal: 1, shield: 2, crit: 3, kill: 4 };

export function createAbyssImpactController() {
  let hitstopRemaining = 0;
  let hitstopCooldown = 0;
  let shakePitch = 0;
  let shakeYaw = 0;
  let shakeRoll = 0;
  let fovPunch = 0;
  let shakePhase = 0;
  let hitKind = null;
  let hitTimer = 0;
  let hitScale = 1;

  function reset() {
    hitstopRemaining = 0;
    hitstopCooldown = 0;
    shakePitch = 0;
    shakeYaw = 0;
    shakeRoll = 0;
    fovPunch = 0;
    shakePhase = 0;
    hitKind = null;
    hitTimer = 0;
    hitScale = 1;
  }

  function triggerHitMarker(kind = 'normal') {
    const normalized = HIT_PRIORITY[kind] ? kind : 'normal';
    const currentPrio = hitTimer > 0 && hitKind ? (HIT_PRIORITY[hitKind] || 0) : 0;
    const nextPrio = HIT_PRIORITY[normalized];
    if (nextPrio >= currentPrio || hitTimer <= 0.03) {
      hitKind = normalized;
    }
    hitTimer = normalized === 'kill' ? 0.24 : normalized === 'crit' ? 0.2 : normalized === 'shield' ? 0.18 : 0.13;
    hitScale = normalized === 'kill' ? 1.48 : normalized === 'crit' ? 1.32 : normalized === 'shield' ? 1.2 : 1.08;
  }

  function addShake({ pitch = 0, yaw = 0, roll = 0, fov = 0, dirSeed = 1 } = {}) {
    shakePhase += 1.73;
    const s1 = dirSeed >= 0 ? 1 : -1;
    const s2 = Math.sin(shakePhase * 3.1) >= 0 ? 1 : -1;
    shakePitch = Math.max(-0.085, Math.min(0.085, shakePitch + pitch));
    shakeYaw = Math.max(-0.07, Math.min(0.07, shakeYaw + yaw * s1 * s2));
    shakeRoll = Math.max(-0.07, Math.min(0.07, shakeRoll + roll * s2));
    fovPunch = Math.max(-4.5, Math.min(8.5, fovPunch + fov));
  }

  function triggerFire({ slot = 0, offhand = false, reducedMotion = false } = {}) {
    if (reducedMotion) return;
    const scale = offhand ? 0.68 : 1.0;
    if (slot === 0) {
      addShake({ pitch: 0.011 * scale, yaw: 0.006 * scale, roll: 0.012 * scale, fov: 1.4 * scale, dirSeed: offhand ? -1 : 1 });
    } else if (slot === 1) {
      addShake({ pitch: 0.005 * scale, yaw: 0.004 * scale, roll: 0.006 * scale, fov: 0.7 * scale, dirSeed: offhand ? -1 : 1 });
    } else if (slot === 2) {
      addShake({ pitch: 0.016 * scale, yaw: 0.008 * scale, roll: 0.016 * scale, fov: 2.2 * scale, dirSeed: offhand ? -1 : 1 });
    } else {
      addShake({ pitch: 0.013 * scale, yaw: 0.018 * scale, roll: 0.026 * scale, fov: 2.5 * scale, dirSeed: offhand ? -1 : 1 });
    }
  }

  function triggerImpact({ kind = 'normal', strength = 1, hitstopMs = 0, reducedMotion = false } = {}) {
    if (kind) triggerHitMarker(kind);
    if (reducedMotion) return false;
    const clampedStrength = Math.max(0.2, Math.min(2.6, strength));
    addShake({
      pitch: 0.008 * clampedStrength,
      yaw: 0.009 * clampedStrength,
      roll: 0.014 * clampedStrength,
      fov: 1.25 * clampedStrength
    });
    if (hitstopMs > 0 && hitstopCooldown <= 0) {
      const clampedMs = Math.min(58, Math.max(20, hitstopMs));
      hitstopRemaining = Math.max(hitstopRemaining, clampedMs / 1000);
      hitstopCooldown = 0.14;
      return true;
    }
    return false;
  }

  function step(dt) {
    if (dt <= 0) return;
    hitstopRemaining = Math.max(0, hitstopRemaining - dt);
    hitstopCooldown = Math.max(0, hitstopCooldown - dt);
    hitTimer = Math.max(0, hitTimer - dt);
    if (hitTimer <= 0) hitKind = null;
    const decay = Math.exp(-15 * dt);
    const fovDecay = Math.exp(-12 * dt);
    shakePitch *= decay;
    shakeYaw *= decay;
    shakeRoll *= decay;
    fovPunch *= fovDecay;
    hitScale = 1 + (hitScale - 1) * Math.exp(-18 * dt);
    if (Math.abs(shakePitch) < 1e-4) shakePitch = 0;
    if (Math.abs(shakeYaw) < 1e-4) shakeYaw = 0;
    if (Math.abs(shakeRoll) < 1e-4) shakeRoll = 0;
    if (Math.abs(fovPunch) < 0.01) fovPunch = 0;
  }

  function enemyTimeScale(reducedMotion = false) {
    if (reducedMotion || hitstopRemaining <= 0) return 1;
    return 0.16;
  }

  function cameraOffsets() {
    return { pitch: shakePitch, yaw: shakeYaw, roll: shakeRoll, fov: fovPunch };
  }

  function snapshot() {
    return {
      hitstopActive: hitstopRemaining > 0,
      hitstopRemaining,
      hitstopCooldown,
      timeScale: hitstopRemaining > 0 ? 0.16 : 1,
      shakeIntensity: Math.hypot(shakePitch, shakeYaw, shakeRoll),
      fovPunch,
      hitMarkerKind: hitTimer > 0 ? hitKind : null,
      hitMarkerTimer: hitTimer,
      hitScale
    };
  }

  return {
    reset,
    triggerHitMarker,
    triggerFire,
    triggerImpact,
    step,
    enemyTimeScale,
    cameraOffsets,
    snapshot
  };
}

function disposeObjectMaterials(root) {
  root?.traverse?.((obj) => {
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        for (const m of obj.material) m?.dispose?.();
      } else {
        obj.material.dispose?.();
      }
    }
  });
}

export function createAbyssVfxManager(scene) {
  const active = [];
  let accretionAccum = 0;

  // Shared base geometries reused across all dynamic Abyss FX instances
  const boxGeo = new T.BoxGeometry(1, 1, 1);
  const ringGeo = new T.TorusGeometry(1, 0.09, 6, 28);
  const thinRingGeo = new T.TorusGeometry(1, 0.042, 5, 24);
  const domeGeo = new T.SphereGeometry(1, 18, 12);
  const coreGeo = new T.OctahedronGeometry(1, 1);
  const shardGeo = new T.OctahedronGeometry(0.14, 0);
  const discGeo = new T.CylinderGeometry(0.38, 0.38, 0.03, 14);
  const upAxis = new T.Vector3(0, 0, 1);
  const yAxis = new T.Vector3(0, 1, 0);

  function pushFx(entry, low = false) {
    const maxCap = low ? 70 : 145;
    while (active.length >= maxCap) {
      const oldest = active.shift();
      if (oldest?.mesh) {
        scene.remove(oldest.mesh);
        disposeObjectMaterials(oldest.mesh);
      }
    }
    scene.add(entry.mesh);
    active.push(entry);
  }

  function makeBasic(color, opacity = 0.9, additive = true) {
    return new T.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: T.DoubleSide,
      blending: additive ? T.AdditiveBlending : T.NormalBlending
    });
  }

  function emitMuzzleFlash({ slot = 0, pos, dir, offhand = false, tier3 = false, resonance = false, low = false, reduced = false } = {}) {
    if (!pos || !dir) return;
    const theme = ABYSS_WEAPON_THEMES[slot] || ABYSS_WEAPON_THEMES[0];
    const g = new T.Group();
    g.position.copy(pos);
    const forward = dir.clone().normalize();
    g.quaternion.setFromUnitVectors(upAxis, forward);

    // Core hot flash
    const core = new T.Mesh(coreGeo, makeBasic(theme.core, 0.95));
    core.scale.setScalar(offhand ? 0.14 : 0.18);
    g.add(core);

    // Star burst fins
    const finCount = low ? 3 : 5;
    for (let i = 0; i < finCount; i++) {
      const fin = new T.Mesh(boxGeo, makeBasic(i % 2 === 0 ? theme.primary : theme.secondary, 0.88));
      fin.scale.set(0.032, 0.34, 0.032);
      fin.rotation.z = (i / finCount) * Math.PI;
      g.add(fin);
    }

    // Forward muzzle shock ring
    const ring = new T.Mesh(ringGeo, makeBasic(theme.secondary, 0.85));
    ring.position.z = 0.14;
    ring.scale.setScalar(0.18);
    ring.userData.ringExpand = 2.6;
    g.add(ring);

    // Tier 3 offhand sync aura / Resonance swap ring
    if ((offhand && tier3) || resonance) {
      const syncRing = new T.Mesh(thinRingGeo, makeBasic(resonance ? 0x7effdf : 0xff7ce6, 0.92));
      syncRing.position.z = 0.06;
      syncRing.scale.setScalar(0.28);
      syncRing.userData.ringExpand = 3.2;
      g.add(syncRing);
    }

    const life = reduced ? 0.07 : 0.14;
    pushFx({ mesh: g, life, max: life, kind: 'muzzle', vel: forward.clone().multiplyScalar(2.4) }, low);
  }

  function emitSawTrail({ pos, vel, heat = 0, bouncesDone = 0, low = false } = {}) {
    if (!pos) return;
    const g = new T.Group();
    g.position.copy(pos);
    const hot = bouncesDone > 0 || heat > 0.45;
    const disc = new T.Mesh(discGeo, makeBasic(hot ? 0xff9ec4 : 0xff2b6d, 0.55));
    disc.scale.setScalar(0.85 + Math.min(0.45, bouncesDone * 0.12));
    g.add(disc);
    if (!low) {
      const spark = new T.Mesh(shardGeo, makeBasic(0xffe08a, 0.85));
      spark.position.set((Math.random() - 0.5) * 0.3, 0.08, (Math.random() - 0.5) * 0.3);
      g.add(spark);
    }
    const drift = vel ? vel.clone().multiplyScalar(-0.08) : new T.Vector3();
    pushFx({ mesh: g, life: 0.18, max: 0.18, kind: 'trail', vel: drift }, low);
  }

  function emitSawRicochet({ pos, normal, bouncesDone = 1, low = false } = {}) {
    if (!pos) return;
    const g = new T.Group();
    g.position.copy(pos);
    const n = normal ? normal.clone().normalize() : new T.Vector3(0, 1, 0);
    g.quaternion.setFromUnitVectors(upAxis, n);

    const ring = new T.Mesh(ringGeo, makeBasic(bouncesDone >= 2 ? 0xffd166 : 0xff4988, 0.95));
    ring.scale.setScalar(0.32);
    ring.userData.ringExpand = 3.4 + Math.min(2.5, bouncesDone * 0.85);
    g.add(ring);

    const core = new T.Mesh(coreGeo, makeBasic(0xfff0f6, 0.95));
    core.scale.setScalar(0.24);
    g.add(core);

    const sparkCount = low ? 3 : 6;
    for (let i = 0; i < sparkCount; i++) {
      const sp = new T.Mesh(shardGeo, makeBasic(i % 2 === 0 ? 0xffd166 : 0xff4988, 0.9));
      const a = (i / sparkCount) * Math.PI * 2;
      sp.userData.localVel = new T.Vector3(Math.cos(a) * 5.2, Math.sin(a) * 5.2, 2.2 + Math.random() * 2.5);
      g.add(sp);
    }
    pushFx({ mesh: g, life: 0.3, max: 0.3, kind: 'ricochet' }, low);
  }

  function emitCryoArc({ from, to, isChain = false, color = 0x4be3ff, low = false } = {}) {
    if (!from || !to) return;
    const delta = to.clone().sub(from);
    const len = delta.length();
    if (len < 0.05) return;
    const dir = delta.clone().normalize();

    const g = new T.Group();
    const segments = low ? 4 : isChain ? 5 : 7;
    const perpA = new T.Vector3().crossVectors(dir, yAxis);
    if (perpA.lengthSq() < 0.01) perpA.set(1, 0, 0);
    perpA.normalize();
    const perpB = new T.Vector3().crossVectors(dir, perpA).normalize();

    let prevPt = from.clone();
    const jitterAmp = Math.min(0.48, len * 0.055);
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      const nextPt = from.clone().lerp(to, t);
      if (i < segments) {
        const j1 = (Math.random() - 0.5) * 2 * jitterAmp;
        const j2 = (Math.random() - 0.5) * 2 * jitterAmp;
        nextPt.addScaledVector(perpA, j1).addScaledVector(perpB, j2);
      }
      const segVec = nextPt.clone().sub(prevPt);
      const segLen = segVec.length();
      if (segLen > 0.005) {
        const segDir = segVec.normalize();
        const outer = new T.Mesh(boxGeo, makeBasic(color, 0.85));
        outer.position.copy(prevPt).lerp(nextPt, 0.5);
        outer.quaternion.setFromUnitVectors(upAxis, segDir);
        outer.scale.set(isChain ? 0.065 : 0.085, isChain ? 0.065 : 0.085, segLen + 0.04);
        g.add(outer);

        const inner = new T.Mesh(boxGeo, makeBasic(0xffffff, 0.95));
        inner.position.copy(outer.position);
        inner.quaternion.copy(outer.quaternion);
        inner.scale.set(0.028, 0.028, segLen + 0.04);
        g.add(inner);
      }
      prevPt = nextPt;
    }

    // 3 Cryo pressure rings along primary ray
    if (!isChain) {
      const ringCount = low ? 2 : 3;
      for (let r = 1; r <= ringCount; r++) {
        const atDist = Math.min(len * 0.82, r * (len / (ringCount + 1)));
        const rMesh = new T.Mesh(thinRingGeo, makeBasic(0x9ff6ff, 0.85));
        rMesh.position.copy(from).addScaledVector(dir, atDist);
        rMesh.quaternion.setFromUnitVectors(upAxis, dir);
        rMesh.scale.setScalar(0.22 + r * 0.06);
        rMesh.userData.ringExpand = 2.8 + r * 0.5;
        g.add(rMesh);
      }
    }

    pushFx({ mesh: g, life: isChain ? 0.2 : 0.18, max: isChain ? 0.2 : 0.18, kind: 'arc' }, low);
  }

  function emitCryoShatter({ pos, radius = 5.5, low = false } = {}) {
    if (!pos) return;
    const g = new T.Group();
    g.position.copy(pos);

    const ring = new T.Mesh(ringGeo, makeBasic(0x72ecff, 0.92));
    ring.rotation.x = Math.PI / 2;
    ring.scale.setScalar(0.4);
    ring.userData.ringExpand = Math.max(4.5, radius * 1.65);
    g.add(ring);

    const dome = new T.Mesh(domeGeo, makeBasic(0xbdf9ff, 0.28));
    dome.scale.setScalar(0.35);
    dome.userData.ringExpand = Math.max(3.5, radius * 1.15);
    g.add(dome);

    const shardCount = low ? 5 : 10;
    for (let i = 0; i < shardCount; i++) {
      const sh = new T.Mesh(shardGeo, makeBasic(i % 2 === 0 ? 0xffffff : 0x4be3ff, 0.92));
      const a = (i / shardCount) * Math.PI * 2;
      sh.userData.localVel = new T.Vector3(Math.cos(a) * 8.5, 2.8 + Math.random() * 3.5, Math.sin(a) * 8.5);
      g.add(sh);
    }

    pushFx({ mesh: g, life: 0.42, max: 0.42, kind: 'shatter' }, low);
  }

  function emitMortarTrail({ pos, low = false } = {}) {
    if (!pos) return;
    const g = new T.Group();
    g.position.copy(pos);
    const ring = new T.Mesh(thinRingGeo, makeBasic(0xc07dff, 0.78));
    ring.rotation.set(Math.random() * 2, Math.random() * 2, 0);
    ring.scale.setScalar(0.28);
    ring.userData.ringExpand = 1.6;
    g.add(ring);
    pushFx({ mesh: g, life: 0.22, max: 0.22, kind: 'trail' }, low);
  }

  function stepVortexAccretion(vortexes, dt, low = false) {
    if (!vortexes?.length) return;
    accretionAccum += dt;
    const interval = low ? 0.14 : 0.07;
    if (accretionAccum < interval) return;
    accretionAccum = 0;

    for (const v of vortexes) {
      const count = low ? 1 : 2;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const dist = v.radius * (0.72 + Math.random() * 0.45);
        const startPos = new T.Vector3(
          v.pos.x + Math.cos(a) * dist,
          v.pos.y + (Math.random() - 0.5) * 1.4,
          v.pos.z + Math.sin(a) * dist
        );
        const m = new T.Mesh(shardGeo, makeBasic(i % 2 === 0 ? 0xd094ff : 0xff7ae0, 0.88));
        m.position.copy(startPos);
        m.scale.setScalar(0.8);
        pushFx({
          mesh: m,
          life: 0.34,
          max: 0.34,
          kind: 'accretion',
          targetPos: v.pos.clone(),
          swirl: 5.5
        }, low);
      }
    }
  }

  function emitSingularityImplosion({ center, radius = 6.2, leech = false, low = false, reduced = false } = {}) {
    if (!center) return;
    const g = new T.Group();
    g.position.copy(center);

    // Inner dark collapse core + white flash
    const flash = new T.Mesh(coreGeo, makeBasic(0xfaf0ff, 0.95));
    flash.scale.setScalar(0.5);
    flash.userData.ringExpand = radius * 0.9;
    g.add(flash);

    // Expanding double-dome gravity blast
    const dome1 = new T.Mesh(domeGeo, makeBasic(0x9b45ff, 0.34));
    dome1.scale.setScalar(0.4);
    dome1.userData.ringExpand = radius * 1.55;
    g.add(dome1);

    const dome2 = new T.Mesh(domeGeo, makeBasic(0xff80e5, 0.24));
    dome2.scale.setScalar(0.25);
    dome2.userData.ringExpand = radius * 1.95;
    g.add(dome2);

    // Twin tilted shockwave rings
    const ringA = new T.Mesh(ringGeo, makeBasic(0xd99eff, 0.95));
    ringA.rotation.x = Math.PI / 2;
    ringA.scale.setScalar(0.45);
    ringA.userData.ringExpand = radius * 2.1;
    g.add(ringA);

    const ringB = new T.Mesh(ringGeo, makeBasic(leech ? 0xffd475 : 0xff5ae0, 0.9));
    ringB.rotation.set(0.65, 0.4, 0.2);
    ringB.scale.setScalar(0.38);
    ringB.userData.ringExpand = radius * 1.9;
    g.add(ringB);

    if (!reduced) {
      const shardCount = low ? 6 : 12;
      for (let i = 0; i < shardCount; i++) {
        const sp = new T.Mesh(shardGeo, makeBasic(i % 3 === 0 ? 0xffd475 : 0xd094ff, 0.92));
        const a = (i / shardCount) * Math.PI * 2;
        sp.userData.localVel = new T.Vector3(Math.cos(a) * 11, 2 + Math.random() * 5, Math.sin(a) * 11);
        g.add(sp);
      }
    }

    pushFx({ mesh: g, life: 0.56, max: 0.56, kind: 'implosion' }, low);
  }

  function emitScytheWaveTrail({ pos, quat, low = false } = {}) {
    if (!pos) return;
    const g = new T.Group();
    g.position.copy(pos);
    if (quat) g.quaternion.copy(quat);
    const echo = new T.Mesh(thinRingGeo, makeBasic(0xffd166, 0.65));
    echo.rotation.x = Math.PI / 2;
    echo.scale.set(0.95, 0.95, 0.95);
    g.add(echo);
    pushFx({ mesh: g, life: 0.16, max: 0.16, kind: 'trail' }, low);
  }

  function emitScytheParry({ muzzlePos, bulletPositions = [], counterTargets = [], low = false } = {}) {
    if (muzzlePos) {
      const g = new T.Group();
      g.position.copy(muzzlePos);
      const flash = new T.Mesh(domeGeo, makeBasic(0xffe17d, 0.45));
      flash.scale.setScalar(0.4);
      flash.userData.ringExpand = 4.2;
      g.add(flash);
      const ring = new T.Mesh(ringGeo, makeBasic(0xfff4d1, 0.95));
      ring.scale.setScalar(0.3);
      ring.userData.ringExpand = 5.4;
      g.add(ring);
      pushFx({ mesh: g, life: 0.34, max: 0.34, kind: 'parry' }, low);
    }
    for (const bp of bulletPositions.slice(0, low ? 3 : 6)) {
      const ring = new T.Mesh(thinRingGeo, makeBasic(0xffd166, 0.9));
      ring.position.copy(bp);
      ring.rotation.set(Math.random() * 2, Math.random() * 2, 0);
      ring.scale.setScalar(0.25);
      ring.userData.ringExpand = 3.6;
      pushFx({ mesh: ring, life: 0.24, max: 0.24, kind: 'parryRing' }, low);
    }
    if (muzzlePos) {
      for (const targetPos of counterTargets) {
        emitCryoArc({ from: muzzlePos, to: targetPos, isChain: false, color: 0xffd166, low });
      }
    }
  }

  function update(dt) {
    if (dt <= 0) return;
    for (let i = active.length - 1; i >= 0; i--) {
      const fx = active[i];
      fx.life -= dt;
      const t = Math.max(0, Math.min(1, 1 - fx.life / fx.max));
      const fade = Math.max(0, 1 - t);

      if (fx.vel) {
        fx.mesh.position.addScaledVector(fx.vel, dt);
      }

      if (fx.kind === 'accretion' && fx.targetPos) {
        const delta = fx.targetPos.clone().sub(fx.mesh.position);
        fx.mesh.position.addScaledVector(delta, Math.min(1, dt * 6.5));
        const tx = -delta.z;
        const tz = delta.x;
        fx.mesh.position.x += tx * dt * fx.swirl * 0.35;
        fx.mesh.position.z += tz * dt * fx.swirl * 0.35;
        fx.mesh.scale.setScalar(Math.max(0.15, fade));
      }

      if (fx.mesh.userData?.ringExpand) {
        fx.mesh.scale.setScalar(0.25 + t * fx.mesh.userData.ringExpand);
      }

      fx.mesh.traverse?.((child) => {
        if (child === fx.mesh) return;
        if (child.userData?.ringExpand) {
          child.scale.setScalar(0.2 + t * child.userData.ringExpand);
        }
        if (child.userData?.localVel) {
          child.position.addScaledVector(child.userData.localVel, dt);
          child.userData.localVel.y -= dt * 9;
          child.scale.setScalar(Math.max(0.1, fade));
        }
        if (child.material && child.material.opacity !== undefined) {
          if (child.userData._baseOpacity === undefined) child.userData._baseOpacity = child.material.opacity;
          child.material.opacity = child.userData._baseOpacity * fade;
        }
      });

      if (fx.mesh.material && fx.mesh.material.opacity !== undefined) {
        if (fx.mesh.userData._baseOpacity === undefined) fx.mesh.userData._baseOpacity = fx.mesh.material.opacity;
        fx.mesh.material.opacity = fx.mesh.userData._baseOpacity * fade;
      }

      if (fx.life <= 0) {
        scene.remove(fx.mesh);
        disposeObjectMaterials(fx.mesh);
        active.splice(i, 1);
      }
    }
  }

  function clear() {
    accretionAccum = 0;
    for (const fx of active) {
      scene.remove(fx.mesh);
      disposeObjectMaterials(fx.mesh);
    }
    active.length = 0;
  }

  function stats() {
    return { activeCount: active.length };
  }

  return {
    emitMuzzleFlash,
    emitSawTrail,
    emitSawRicochet,
    emitCryoArc,
    emitCryoShatter,
    emitMortarTrail,
    stepVortexAccretion,
    emitSingularityImplosion,
    emitScytheWaveTrail,
    emitScytheParry,
    update,
    clear,
    stats
  };
}
