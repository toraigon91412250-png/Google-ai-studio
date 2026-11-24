import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import * as THREE from 'three';

const require = createRequire(import.meta.url);
const Module = require('node:module');
const { buildSync } = require('esbuild');

function loadSrc(relPath) {
  const file = path.resolve(relPath);
  const m = new Module(file, null);
  m.paths = Module._nodeModulePaths(path.dirname(file));
  const out = buildSync({ entryPoints: [file], bundle: true, format: 'cjs', write: false }).outputFiles[0].text;
  m._compile(out, file);
  return m.exports;
}

const {
  ABYSS_WEAPON_THEMES,
  createAbyssImpactController,
  createAbyssVfxManager
} = loadSrc('src/modes/abyss-vfx.js');

const {
  createAbyssWeaponViewmodels,
  createVortexFieldMesh,
  createScytheSlashMesh
} = loadSrc('src/modes/abyss-visuals.js');

test('ABYSS_WEAPON_THEMES defines distinct themes for all 4 Abyss weapons', () => {
  assert.equal(ABYSS_WEAPON_THEMES.length, 4);
  assert.deepEqual(ABYSS_WEAPON_THEMES.map((t) => t.id), ['saw', 'cryo', 'vortex', 'scythe']);
});

test('createAbyssImpactController enforces hitmarker priority, decaying shake, hitstop cooldown, and reducedMotion bypass', () => {
  const imp = createAbyssImpactController();

  // Priority: kill > crit > shield > normal while active
  imp.triggerImpact({ kind: 'normal', strength: 1, hitstopMs: 0 });
  assert.equal(imp.snapshot().hitMarkerKind, 'normal');
  imp.triggerImpact({ kind: 'shield', strength: 1, hitstopMs: 0 });
  assert.equal(imp.snapshot().hitMarkerKind, 'shield');
  imp.triggerImpact({ kind: 'crit', strength: 1, hitstopMs: 0 });
  assert.equal(imp.snapshot().hitMarkerKind, 'crit');
  // Lower priority does not downgrade active crit
  imp.triggerImpact({ kind: 'normal', strength: 0.5, hitstopMs: 0 });
  assert.equal(imp.snapshot().hitMarkerKind, 'crit');
  // Kill upgrades above crit
  imp.triggerImpact({ kind: 'kill', strength: 1.5, hitstopMs: 42 });
  assert.equal(imp.snapshot().hitMarkerKind, 'kill');
  assert.equal(imp.snapshot().hitstopActive, true);
  assert.equal(imp.enemyTimeScale(false), 0.16);
  // Second hitstop inside 0.14s cooldown returns false
  assert.equal(imp.triggerImpact({ kind: 'kill', strength: 1.2, hitstopMs: 40 }), false);

  // ReducedMotion still triggers hitmarker HUD without shake or hitstop freeze
  imp.reset();
  const hsReduced = imp.triggerImpact({ kind: 'crit', strength: 2.0, hitstopMs: 45, reducedMotion: true });
  assert.equal(hsReduced, false);
  assert.equal(imp.enemyTimeScale(true), 1);
  assert.equal(imp.snapshot().hitMarkerKind, 'crit');
  assert.equal(imp.snapshot().shakeIntensity, 0);

  // Fire shake & decay
  imp.triggerFire({ slot: 2, offhand: false, reducedMotion: false });
  assert.ok(imp.cameraOffsets().fov > 1.5);
  assert.ok(imp.snapshot().shakeIntensity > 0.01);
  for (let i = 0; i < 40; i++) imp.step(0.05);
  assert.equal(imp.snapshot().shakeIntensity, 0);
  assert.equal(imp.cameraOffsets().fov, 0);
  assert.equal(imp.snapshot().hitMarkerKind, null);
});

test('createAbyssVfxManager spawns all Abyss weapon VFX, enforces pool cap, expires cleanly, and clears', () => {
  const scene = new THREE.Scene();
  const mgr = createAbyssVfxManager(scene);

  mgr.emitMuzzleFlash({
    slot: 0,
    pos: new THREE.Vector3(0, 1, 0),
    dir: new THREE.Vector3(0, 0, -1),
    offhand: true,
    tier3: true
  });
  mgr.emitSawTrail({ pos: new THREE.Vector3(0, 1, -2), vel: new THREE.Vector3(0, 0, -10), heat: 0.8, bouncesDone: 2 });
  mgr.emitSawRicochet({ pos: new THREE.Vector3(2, 1, -4), normal: new THREE.Vector3(-1, 0, 0), bouncesDone: 2 });
  mgr.emitCryoArc({ from: new THREE.Vector3(0, 1, 0), to: new THREE.Vector3(0, 1, -10), isChain: false });
  mgr.emitCryoShatter({ pos: new THREE.Vector3(0, 1, -6), radius: 5.5 });
  mgr.emitMortarTrail({ pos: new THREE.Vector3(1, 2, -5) });
  mgr.stepVortexAccretion([{ pos: new THREE.Vector3(0, 0.2, -5), radius: 6.2 }], 0.1, false);
  mgr.emitSingularityImplosion({ center: new THREE.Vector3(0, 0.2, -5), radius: 6.2, leech: true });
  mgr.emitScytheWaveTrail({ pos: new THREE.Vector3(0, 1, -3), quat: new THREE.Quaternion() });
  mgr.emitScytheParry({
    muzzlePos: new THREE.Vector3(0, 1, 0),
    bulletPositions: [new THREE.Vector3(0, 1, -2), new THREE.Vector3(1, 1, -2)],
    counterTargets: [new THREE.Vector3(2, 1, -6)]
  });

  assert.ok(mgr.stats().activeCount >= 10);
  assert.equal(scene.children.length, mgr.stats().activeCount);

  // Advance enough time to expire all temporary VFX
  for (let i = 0; i < 30; i++) mgr.update(0.05);
  assert.equal(mgr.stats().activeCount, 0);
  assert.equal(scene.children.length, 0);

  // Low-quality pool cap evicts oldest beyond 70
  for (let i = 0; i < 90; i++) {
    mgr.emitMortarTrail({ pos: new THREE.Vector3(i * 0.1, 1, 0), low: true });
  }
  assert.equal(mgr.stats().activeCount, 70);
  assert.equal(scene.children.length, 70);

  mgr.clear();
  assert.equal(mgr.stats().activeCount, 0);
  assert.equal(scene.children.length, 0);
});

test('Abyss weapon viewmodels support barrel heat, reload poses, left-hand mirror, sync aura, and multi-layer slash/vortex meshes', () => {
  const parent = new THREE.Group();
  const vm = createAbyssWeaponViewmodels(parent);

  // Inactive hides root
  vm.update(0.016, { active: false });
  assert.equal(vm.root.visible, false);

  // Right-hand active weapon 0 with Tier 3 syncAura
  vm.update(0.016, {
    active: true,
    weapon: 0,
    time: 1.2,
    recoil: 0.1,
    reloadPhase: 0,
    swapAnim: 0,
    heat: 0.9,
    isLeftHand: false,
    dualWieldSync: true
  });
  assert.equal(vm.root.visible, true);
  assert.ok(vm.root.position.x > 0);
  assert.equal(vm.syncAura.visible, true);
  assert.equal(vm.models[0].visible, true);
  assert.equal(vm.models[1].visible, false);

  // Per-weapon reload pose differs cleanly across weapons
  const poses = [];
  for (let w = 0; w < 4; w++) {
    vm.update(0.016, { active: true, weapon: w, time: 0.5, reloadPhase: 0.6, isLeftHand: false });
    poses.push([vm.root.rotation.x, vm.root.rotation.y, vm.root.rotation.z]);
  }
  assert.notDeepEqual(poses[0], poses[1]);
  assert.notDeepEqual(poses[1], poses[2]);
  assert.notDeepEqual(poses[2], poses[3]);

  // Native left-hand mirroring & resonance aura when dualWieldSync is false
  vm.update(0.016, {
    active: true,
    weapon: 2,
    time: 0.8,
    reloadPhase: 0,
    isLeftHand: true,
    dualWieldSync: false,
    resonanceActive: true
  });
  assert.ok(vm.root.position.x < 0);
  assert.equal(vm.syncAura.visible, true);

  // Vortex field includes inner core, coreRim, horizon, and ring2; Scythe slash includes 3 arc layers
  const vortex = createVortexFieldMesh(6.2);
  assert.equal(vortex.group.children.length, 4);
  const slash = createScytheSlashMesh(3.2);
  assert.equal(slash.children.length, 3);
});
