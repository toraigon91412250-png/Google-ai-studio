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
  KINETIC_CONFIG,
  KINETIC_TIERS,
  FINISHER_CONFIG,
  computeKineticProfile,
  computeKineticTier,
  stepKineticCharge,
  canTriggerKineticFinisher,
  computeKineticFinisher
} = loadSrc('src/modes/kinetic-overdrive.js');

const {
  PARKOUR_CONFIG,
  detectWallContact,
  stepWallRun,
  computeWallKick
} = loadSrc('src/modes/parkour.js');

test('computeKineticTier transitions cleanly across all 4 combat tiers', () => {
  assert.equal(KINETIC_TIERS.length, 4);
  assert.equal(computeKineticTier(0, 0), 0);
  assert.equal(computeKineticTier(24.9, 0), 0);
  assert.equal(computeKineticTier(25, 0), 1);
  assert.equal(computeKineticTier(54.9, 0), 1);
  assert.equal(computeKineticTier(55, 0), 2);
  assert.equal(computeKineticTier(99.9, 0), 2);
  assert.equal(computeKineticTier(10, 0.5), 3);
});

test('computeKineticProfile scales speed, fire rate, damage, reload, and special perks across tiers', () => {
  const t0 = computeKineticProfile(0, 0, {});
  const t1 = computeKineticProfile(30, 0, {});
  const t2 = computeKineticProfile(70, 0, {});
  const t3 = computeKineticProfile(100, 8, {});

  assert.equal(t0.speedMult, 1);
  assert.equal(t0.damageMult, 1);
  assert.equal(t0.ammoFree, false);

  assert.ok(t1.speedMult > t0.speedMult);
  assert.ok(t1.damageMult > t0.damageMult);
  assert.ok(t1.coolMult < t0.coolMult);
  assert.equal(t1.dashDeflect, false);

  assert.ok(t2.speedMult > t1.speedMult);
  assert.ok(t2.damageMult > t1.damageMult);
  assert.equal(t2.dashDeflect, true);
  assert.equal(t2.ammoFree, false);

  assert.ok(t3.speedMult > t2.speedMult);
  assert.ok(t3.damageMult > t2.damageMult);
  assert.ok(t3.coolMult < t2.coolMult);
  assert.equal(t3.ammoFree, true);
  assert.equal(t3.chainArc, true);
});

test('stepKineticCharge accumulates faster in motion, doubles during wall-run, respects grace buffer, and ignites Tier 3 at 100%', () => {
  const moved = stepKineticCharge({ charge: 0, dt: 1, moving: true, grounded: true });
  assert.equal(moved.charge, KINETIC_CONFIG.runGainPerSec);
  assert.equal(moved.grace, KINETIC_CONFIG.graceDuration);
  assert.equal(moved.triggered, false);

  // Grace buffer preserves charge when stopping briefly to aim
  const held = stepKineticCharge({ charge: moved.charge, grace: moved.grace, dt: 0.5, moving: false });
  assert.equal(held.charge, moved.charge);
  assert.ok(held.grace > 0);

  // Decay begins only after grace expires
  const decayed = stepKineticCharge({ charge: 40, grace: 0, dt: 1, moving: false });
  assert.equal(decayed.charge, 40 - KINETIC_CONFIG.idleDecayPerSec);

  // Crossing 100 triggers 10s Overdrive
  const ignited = stepKineticCharge({ charge: 98, grace: 1, dt: 0.5, moving: true });
  assert.equal(ignited.triggered, true);
  assert.equal(ignited.over, KINETIC_CONFIG.overdriveDuration);
  assert.equal(ignited.tier, 3);
  assert.equal(ignited.charge, 100);

  // Airborne + sliding builds even faster
  const parkour = stepKineticCharge({ charge: 0, dt: 1, moving: true, grounded: false, sliding: true });
  assert.ok(parkour.charge > moved.charge);

  // Wall-running doubles charge gain rate
  const airOnly = stepKineticCharge({ charge: 0, dt: 0.5, moving: true, grounded: false, wallRunning: false });
  const wallBoosted = stepKineticCharge({ charge: 0, dt: 0.5, moving: true, grounded: false, wallRunning: true });
  assert.ok(Math.abs(wallBoosted.charge - airOnly.charge * KINETIC_CONFIG.wallRunBonusMult) < 1e-6);
});

test('Thunderfall Break finisher requires >= 1.5s Overdrive and scales damage/radius/heal with remaining timer & capacitor', () => {
  assert.equal(canTriggerKineticFinisher(0), false);
  assert.equal(canTriggerKineticFinisher(FINISHER_CONFIG.minOverRemaining - 0.1), false);
  assert.equal(canTriggerKineticFinisher(FINISHER_CONFIG.minOverRemaining), true);
  assert.equal(canTriggerKineticFinisher(8, { tutorialActive: true }), false);

  const low = computeKineticFinisher(1.5, {});
  const high = computeKineticFinisher(10, {});
  const cap = computeKineticFinisher(10, { capacitor: 2 });

  assert.equal(low.ready, true);
  assert.equal(low.damage, FINISHER_CONFIG.baseDamage);
  assert.equal(low.radius, FINISHER_CONFIG.baseRadius);
  assert.ok(high.damage > low.damage);
  assert.ok(high.radius > low.radius);
  assert.ok(high.heal >= low.heal);
  assert.ok(cap.damage > high.damage);
  assert.equal(high.refundCharge, FINISHER_CONFIG.refundCharge);
});

test('detectWallContact identifies tall solid walls and arena perimeters while ignoring ankle curbs or disabled blocks', () => {
  const solids = [
    { x: 11, z: -12, w: 2.5, d: 2.5, top: 5.0, removeInEasy: false },
    { x: 0, z: 17, w: 4.5, d: 1.5, top: 1.3, removeInEasy: true },
    { x: -5, z: 0, w: 2, d: 2, top: 0.4, removeInEasy: false }
  ];

  // Beside west face of tall pillar (minX = 8.5)
  const hitPillar = detectWallContact({ x: 8.0, y: 1.0, z: -12, solids, difficulty: 'normal' });
  assert.equal(hitPillar.hit, true);
  assert.equal(hitPillar.source, 'solid');
  assert.ok(hitPillar.nx < -0.9);

  // Low curb (top=0.4) at y=0 is below wallMinHeightAboveFeet -> ignored
  const lowCurb = detectWallContact({ x: -2.6, y: 0.2, z: 0, solids, difficulty: 'normal', allowPerimeter: false });
  assert.equal(lowCurb.hit, false);

  // removeInEasy solid is ignored in easy mode
  const easySkip = detectWallContact({ x: 0, y: 0.2, z: 15.0, solids, difficulty: 'easy', allowPerimeter: false });
  assert.equal(easySkip.hit, false);

  // Outer east perimeter wall near x=30.8
  const hitBound = detectWallContact({ x: 30.5, y: 1.2, z: 0, solids: [], bounds: { x: 30.8, z: 30.8 } });
  assert.equal(hitBound.hit, true);
  assert.equal(hitBound.source, 'perimeter');
  assert.equal(hitBound.nx, -1);
});

test('stepWallRun stays inactive on ground, attaches airborne along walls, and computeWallKick launches away cleanly', () => {
  const wallContact = { hit: true, nx: -1, nz: 0, dist: 0.45, wallKey: 'solid:0:w', source: 'solid' };

  // Grounded walk must NEVER wall-run (preserves grounded wall collision)
  const onGround = stepWallRun({
    wallContact,
    grounded: true,
    airborne: false,
    moving: true,
    lookYaw: 0,
    wishX: 0,
    wishZ: -1,
    vy: 0,
    dt: 0.016
  });
  assert.equal(onGround.active, false);

  // Airborne & moving forward along wall (wall on right side) attaches cleanly
  const running = stepWallRun({
    wallContact,
    grounded: false,
    airborne: true,
    moving: true,
    lookYaw: 0,
    wishX: 0,
    wishZ: -1,
    vy: -5,
    wallTime: 0,
    dt: 0.016
  });
  assert.equal(running.active, true);
  assert.equal(running.wallSide, 1); // right wall
  assert.ok(running.targetTilt > 0);
  assert.equal(running.speedMult, PARKOUR_CONFIG.wallRunSpeedMult);
  assert.equal(running.reloadMult, PARKOUR_CONFIG.wallRunReloadMult);
  assert.equal(running.chargeMult, PARKOUR_CONFIG.wallRunChargeMult);
  assert.ok(running.nextVy >= PARKOUR_CONFIG.wallRunMaxFallVy);
  assert.ok(running.tangentZ < -0.9); // glides forward -Z

  // Wall kick pushes away from wall normal (-1 -> -X) and upward (+Y)
  const kick = computeWallKick({ nx: wallContact.nx, nz: wallContact.nz, forwardX: 0, forwardZ: -1, jumpMult: 1.2 });
  assert.ok(kick.kickVx < -10);
  assert.ok(kick.kickVz < -4);
  assert.ok(kick.kickVy > 12);
  assert.equal(kick.chargeGain, PARKOUR_CONFIG.wallKickChargeBoost);

  // Cooldown prevents instant re-stick to the exact same wall side
  const blockedCooldown = stepWallRun({
    wallContact,
    grounded: false,
    airborne: true,
    moving: true,
    lookYaw: 0,
    wishX: 0,
    wishZ: -1,
    vy: 6,
    wallCooldown: kick.cooldown,
    activeWallKey: wallContact.wallKey,
    dt: 0.016
  });
  assert.equal(blockedCooldown.active, false);
});
