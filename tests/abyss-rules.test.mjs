import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';

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
  ABYSS_ENEMIES,
  ABYSS_SECTOR_TITLES,
  ABYSS_UPGRADES,
  ABYSS_WAVES,
  ABYSS_WEAPONS,
  ABYSS_WEAPON_LABELS,
  abyssFireRate,
  abyssMagSize,
  abyssReloadDuration,
  advanceArchitectCycle,
  computeAbyssPlayerDamageMult,
  computeSawDamage,
  computeSawSpreadAngles,
  createArchitectState,
  evaluateAegisDamage,
  evaluateScytheCone,
  pickAbyssUpgrades,
  shouldSplitterDivide,
  stepVortexPull
} = loadSrc('src/modes/abyss-rules.js');

test('Abyss mode defines 4 distinct weapons, 5 enemy archetypes, 6 sectors, and 18 relic cards', () => {
  assert.equal(ABYSS_WEAPONS.length, 4);
  assert.equal(ABYSS_WEAPON_LABELS.length, 4);
  assert.deepEqual(Object.keys(ABYSS_ENEMIES), ['stalker', 'aegis', 'weaver', 'splitter', 'architect']);
  assert.equal(ABYSS_WAVES.length, 6);
  assert.equal(ABYSS_SECTOR_TITLES.length, 6);
  assert.ok(ABYSS_WAVES[5].includes('architect'));
  assert.equal(ABYSS_ENEMIES.architect.hp, 3800);
  assert.equal(ABYSS_UPGRADES.length, 18);
  assert.equal(new Set(ABYSS_UPGRADES.map((u) => u.id)).size, 18);
});

test('VORTEX SAW scales with ricochets, bleed relic, and twin spread angles', () => {
  const base = ABYSS_WEAPONS[0].damage;
  assert.equal(computeSawDamage(base, 0, 0, 0), base);
  assert.ok(Math.abs(computeSawDamage(base, 1, 0, 0) - base * 1.35) < 1e-6);
  assert.ok(Math.abs(computeSawDamage(base, 2, 0, 0) - base * 1.7) < 1e-6);
  assert.ok(Math.abs(computeSawDamage(base, 2, 1, 0) - base * 2.2) < 1e-6);
  assert.ok(Math.abs(computeSawDamage(base, 0, 0, 1) - base * 1.22) < 1e-6);

  assert.deepEqual(computeSawSpreadAngles(0), [0]);
  assert.equal(computeSawSpreadAngles(1).length, 2);
  assert.equal(computeSawSpreadAngles(2).length, 3);
});

test('Player damage multiplier stacks Overdrive, Sovereign Core, Permafrost, Resonance, Parry, and Executioner', () => {
  assert.equal(computeAbyssPlayerDamageMult({}, {}), 1);
  const full = computeAbyssPlayerDamageMult(
    {
      abyss_immortal_core: 1,
      abyss_cryo_nova: 2,
      abyss_resonance: 1,
      abyss_scythe_parry: 1,
      abyss_executioner: 1
    },
    { overActive: true, chilledTarget: true, swapBuff: true, parryBuff: true, execBuff: true }
  );
  // 1.35 * 1.2 * 1.6 * 1.4 * 1.3 * 1.22
  assert.ok(Math.abs(full - 1.35 * 1.2 * 1.6 * 1.4 * 1.3 * 1.22) < 1e-6);
});

test('AEGIS BASTION front shield blocks frontal body hits but yields to dorsal core, flanking, stun, scythe, and vortex', () => {
  const front = evaluateAegisDamage(100, { frontDot: 0.85, isHead: false });
  assert.equal(front.blockedByShield, true);
  assert.equal(front.damage, 35);

  const flank = evaluateAegisDamage(100, { frontDot: -0.2, isHead: false });
  assert.equal(flank.blockedByShield, false);
  assert.equal(flank.damage, 100);

  const dorsal = evaluateAegisDamage(100, { frontDot: 0.9, isHead: true });
  assert.equal(dorsal.blockedByShield, false);
  assert.equal(dorsal.damage, 155);

  const scythe = evaluateAegisDamage(100, { frontDot: 0.95, isScythe: true });
  assert.equal(scythe.blockedByShield, false);
  assert.equal(scythe.damage, 100);

  const vortex = evaluateAegisDamage(100, { frontDot: 0.95, isVortex: true });
  assert.equal(vortex.blockedByShield, false);

  const stunned = evaluateAegisDamage(100, { frontDot: 0.95, stunned: true });
  assert.equal(stunned.blockedByShield, false);
});

test('SWARM SPLITTER divides unless child, chilled, or killed by SINGULARITY / VOID SCYTHE', () => {
  assert.equal(shouldSplitterDivide({ isChild: false, weaponIndex: 0, chilled: false }), true);
  assert.equal(shouldSplitterDivide({ isChild: true, weaponIndex: 0, chilled: false }), false);
  assert.equal(shouldSplitterDivide({ isChild: false, weaponIndex: 0, chilled: true }), false);
  assert.equal(shouldSplitterDivide({ isChild: false, weaponIndex: 2, chilled: false }), false);
  assert.equal(shouldSplitterDivide({ isChild: false, weaponIndex: 3, chilled: false }), false);
});

test('SINGULARITY vortex pulls outer enemies inward and clamps near center', () => {
  const pull = stepVortexPull({ x: 4, z: 0 }, { x: 0, z: 0 }, 6.2, 11, 0.1);
  assert.ok(pull.dx < 0 && Math.abs(pull.dz) < 1e-6);
  const far = stepVortexPull({ x: 10, z: 0 }, { x: 0, z: 0 }, 6.2, 11, 0.1);
  assert.equal(far.dx, 0);
  const close = stepVortexPull({ x: 0.1, z: 0 }, { x: 0, z: 0 }, 6.2, 11, 0.1);
  assert.equal(close.dx, 0);
});

test('VOID SCYTHE cone detects targets inside forward arc or close melee sweep', () => {
  const hitFront = evaluateScytheCone(
    { x: 0, y: 1.6, z: 0 },
    { x: 0, y: 0, z: -1 },
    { x: 1, y: 1.2, z: -8 },
    15.5
  );
  assert.equal(hitFront.inCone, true);

  const missBehind = evaluateScytheCone(
    { x: 0, y: 1.6, z: 0 },
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 1.2, z: 6 },
    15.5
  );
  assert.equal(missBehind.inCone, false);

  const outOfRange = evaluateScytheCone(
    { x: 0, y: 1.6, z: 0 },
    { x: 0, y: 0, z: -1 },
    { x: 0, y: 1.2, z: -20 },
    15.5
  );
  assert.equal(outOfRange.inCone, false);
});

test('VOID ARCHITECT Phase I & II transitions deterministically with awaken, laser_sweep, and exposed summon', () => {
  const state = createArchitectState();
  const seenPhase1 = [];
  for (let i = 0; i < 45; i++) {
    for (const ev of advanceArchitectCycle(state, 0.25, 0.85)) {
      seenPhase1.push(ev.type);
    }
  }
  assert.ok(seenPhase1.includes('spiral'));
  assert.ok(seenPhase1.includes('mortars'));
  assert.ok(seenPhase1.includes('gravity_pulse'));
  assert.ok(seenPhase1.includes('laser_sweep'));
  assert.ok(seenPhase1.includes('exposed'));
  assert.equal(state.enraged, false);
  assert.ok(state.cycleIndex >= 1);

  const awakenEvents = advanceArchitectCycle(state, 0.25, 0.45);
  assert.equal(state.enraged, true);
  assert.equal(awakenEvents[0].type, 'awaken');

  const seenPhase2 = [];
  for (let i = 0; i < 40; i++) {
    for (const ev of advanceArchitectCycle(state, 0.25, 0.45)) {
      seenPhase2.push(ev);
    }
  }
  const twinLaser = seenPhase2.find((e) => e.type === 'laser_sweep');
  assert.ok(twinLaser && twinLaser.twin === true);
  const exposed2 = seenPhase2.find((e) => e.type === 'exposed');
  assert.ok(exposed2 && Array.isArray(exposed2.summon) && exposed2.summon.length === 2);
});

test('All 18 Abyss relic cards respect maxLevel caps and weapon scaling helpers', () => {
  assert.equal(abyssMagSize(0, { abyss_saw: 2 }), 12);
  assert.equal(abyssMagSize(1, { abyss_cryo: 1 }), 28);
  assert.equal(abyssMagSize(2, { abyss_vortex: 2 }), 6);
  assert.equal(abyssMagSize(3, { abyss_scythe: 2 }), 10);
  assert.ok(abyssReloadDuration(0, { abyss_overclock: 1 }) < abyssReloadDuration(0, {}));
  assert.ok(abyssFireRate(0, { abyss_overclock: 1 }, true) < abyssFireRate(0, {}, false));

  const maxed = Object.fromEntries(ABYSS_UPGRADES.map((u) => [u.id, u.maxLevel]));
  assert.equal(pickAbyssUpgrades(maxed, () => 0.2, 4).length, 0);

  // One card left (abyss_immortal_core maxLevel=1): only 1 offered
  const almostMaxed = { ...maxed, abyss_immortal_core: 0 };
  const lastOne = pickAbyssUpgrades(almostMaxed, () => 0.3, 4);
  assert.equal(lastOne.length, 1);
  assert.equal(lastOne[0].id, 'abyss_immortal_core');

  const four = pickAbyssUpgrades({}, () => 0.3, 4);
  assert.equal(four.length, 4);
  assert.equal(new Set(four.map((u) => u.id)).size, 4);
});
