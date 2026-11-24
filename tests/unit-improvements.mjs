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

const { AdaptiveQuality, isSoftwareRendererString } = loadSrc('src/perf.js');
const {
  CAREER_MEDALS,
  CAREER_STORAGE_KEY,
  FRACTURE_LEGACY_KEY,
  FRACTURE_STORAGE_KEY,
  RunTelemetry,
  loadCareer,
  migrateLegacyStorage,
  recordCareerRun
} = loadSrc('src/modes/telemetry.js');
const { ABYSS_WEAPON_GUIDE, MODE_CONTROLS, MODE_GROUPS, WEAPON_GUIDE } = loadSrc('src/modes/catalog.js');
const {
  SUDDEN_MISSION_CONFIG,
  SUDDEN_MISSION_KINDS,
  SuddenMissionDirector
} = loadSrc('src/modes/sudden-mission.js');

function createMemoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); }
  };
}

test('isSoftwareRendererString detects SwiftShader and llvmpipe but keeps hardware GPUs', () => {
  assert.equal(isSoftwareRendererString('ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)))'), true);
  assert.equal(isSoftwareRendererString('llvmpipe (LLVM 15.0.7, 256 bits)'), true);
  assert.equal(isSoftwareRendererString('ANGLE (NVIDIA, NVIDIA GeForce RTX 4070 Direct3D11)'), false);
});

test('AdaptiveQuality guards software WebGL and auto-scales on slow frames', () => {
  const sw = new AdaptiveQuality({ mode: 'auto', softwareGl: true });
  assert.equal(sw.pixelRatio(2), 1);
  assert.equal(sw.lowEffects(), true);
  assert.equal(sw.particleScale(), 0.5);

  const hw = new AdaptiveQuality({ mode: 'auto', mobile: false, softwareGl: false });
  assert.equal(hw.pixelRatio(2), 1.7);
  assert.equal(hw.lowEffects(), false);

  let changed = false;
  for (let i = 0; i < 35; i++) {
    if (hw.recordFrame(0.04)) changed = true;
  }
  assert.equal(changed, true, 'Slow frames trigger downscale');
  assert.equal(hw.tier, 1);
  assert.equal(hw.pixelRatio(2), 1.15);
  assert.equal(hw.lowEffects(), true);
});

test('RunTelemetry aggregates per-weapon damage, kills, streak, and top weapon', () => {
  const t = new RunTelemetry();
  t.recordDamage({ weapon: 0, amount: 80, direct: true, head: false, kill: true });
  t.recordDamage({ weapon: 2, amount: 240, direct: true, head: true, kill: true });
  t.recordDamage({ weapon: 2, amount: 180, direct: true, head: false, kill: false });
  t.recordPlayerDamage(15);
  t.recordOverdrive();

  const summary = t.summary({ score: 4200, kills: 2, runTime: 95.4, wave: 4, difficulty: 'normal', win: false });
  assert.equal(summary.totalDamage, 500);
  assert.equal(summary.damageTaken, 15);
  assert.equal(summary.headshots, 1);
  assert.equal(summary.maxStreak, 2);
  assert.equal(summary.topWeaponIndex, 2);
  assert.equal(summary.formattedTime, '1:35');
  assert.equal(summary.weapons[0].kills, 1);
});

test('CareerProgress unlocks medals and persists without breaking existing storage', () => {
  const storage = createMemoryStorage();
  const initial = loadCareer(storage);
  assert.equal(initial.runs, 0);

  const run1 = {
    difficulty: 'fracture',
    win: true,
    score: 13500,
    kills: 42,
    runTime: 180,
    formattedTime: '3:00',
    totalDamage: 6400,
    maxStreak: 9,
    topWeaponName: '04 / ASTRA × VANTA'
  };
  const res1 = recordCareerRun(initial, run1, storage);
  const unlockedIds = res1.newlyUnlocked.map((m) => m.id);
  assert.ok(unlockedIds.includes('first_clear'));
  assert.ok(unlockedIds.includes('speed_runner'));
  assert.ok(unlockedIds.includes('high_scorer'));
  assert.ok(unlockedIds.includes('fracture_agent'));

  const reloaded = loadCareer(storage);
  assert.equal(reloaded.wins, 1);
  assert.equal(reloaded.bestTime, 180);
  assert.equal(reloaded.bestScore, 13500);
  assert.equal(Object.keys(reloaded.medals).length, 4);
  assert.ok(CAREER_MEDALS.length >= 6);
  assert.ok(storage.getItem(CAREER_STORAGE_KEY));
});

test('migrateLegacyStorage copies overdrive-fracture-v1 to overdrive-fracture-intents-v1', () => {
  const legacyPayload = JSON.stringify({ best: 8800, runs: 3, wins: 1 });
  const storage = createMemoryStorage({ [FRACTURE_LEGACY_KEY]: legacyPayload });
  assert.equal(migrateLegacyStorage(storage), true);
  assert.equal(storage.getItem(FRACTURE_STORAGE_KEY), legacyPayload);
  // Does not overwrite if already migrated
  storage.setItem(FRACTURE_STORAGE_KEY, JSON.stringify({ best: 9999, runs: 4, wins: 2 }));
  assert.equal(migrateLegacyStorage(storage), false);
});

test('Catalog exposes only the 4 consolidated modes and documents Dual-Wield, Chrono Break, and Kinetic Arm', () => {
  const allModes = MODE_GROUPS.flatMap((g) => g.modes.map((m) => m.id));
  assert.deepEqual(allModes, ['normal', 'easy', 'abyss', 'titan']);
  assert.equal(Object.keys(MODE_CONTROLS).sort().join(','), 'abyss,easy,normal,titan');
  assert.equal(WEAPON_GUIDE.length, 6);
  assert.equal(ABYSS_WEAPON_GUIDE.length, 4);
  assert.match(MODE_CONTROLS.normal.pc, /Q 時間減速.*F 弾捕獲/);
  assert.match(MODE_CONTROLS.normal.pc, /二丁暴走/);
  assert.ok(MODE_CONTROLS.abyss.pc.includes('1–4'));
  assert.match(MODE_CONTROLS.titan.pc, /右クリック長押し/);
});

test('SuddenMissionDirector triggers only in eligible sectors 1-5, rewards Overdrive boost, and expires cleanly without penalty', () => {
  const sm = new SuddenMissionDirector();
  assert.equal(sm.canTrigger({ wave: 1, tutorialActive: true, bossActive: false, waveElapsed: 5, rng: () => 0.1 }), false);
  assert.equal(sm.canTrigger({ wave: 6, tutorialActive: false, bossActive: true, waveElapsed: 5, rng: () => 0.1 }), false);
  assert.equal(sm.canTrigger({ wave: 2, tutorialActive: false, bossActive: false, waveElapsed: 1.0, rng: () => 0.1 }), false);
  assert.equal(sm.canTrigger({ wave: 2, tutorialActive: false, bossActive: false, waveElapsed: 4.0, rng: () => 0.2 }), true);
  // Cannot re-trigger in the same wave
  assert.equal(sm.canTrigger({ wave: 2, tutorialActive: false, bossActive: false, waveElapsed: 6.0, rng: () => 0.1 }), false);

  const started = sm.begin({ wave: 2, kind: 'breach' });
  assert.equal(started.active, true);
  assert.equal(started.kind, 'breach');
  assert.equal(started.needed, 2);

  const step1 = sm.advance(1);
  assert.equal(step1.type, 'step');
  const step2 = sm.advance(1);
  assert.equal(step2.type, 'complete');
  assert.equal(step2.reward.charge, SUDDEN_MISSION_CONFIG.rewardCharge);
  assert.equal(step2.reward.overdriveExtend, SUDDEN_MISSION_CONFIG.rewardOverdriveExtend);
  assert.equal(sm.completedCount, 1);
  assert.equal(sm.active, false);

  // Second mission rotates kind and expires silently if timer runs out
  const second = sm.begin({ wave: 3, rng: () => 0.25 });
  assert.equal(SUDDEN_MISSION_KINDS.includes(second.kind), true);
  assert.notEqual(second.kind, 'breach');
  const exp = sm.tick(second.duration + 1);
  assert.equal(exp.type, 'expired');
  assert.equal(sm.expiredCount, 1);
  assert.equal(sm.active, false);
});
