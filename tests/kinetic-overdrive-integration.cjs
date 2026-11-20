const assert = require('node:assert/strict');
const load = require('./headless-runtime.cjs');

function start(difficulty = 'normal') {
  const g = load({ difficulty, seed: 777 });
  g.start();
  g.step(0.032);
  g.api.test.clearEnemies();
  g.api.test.holdSpawns();
  g.api.test.set({ inv: 999 });
  return g;
}

// 1. Running transitions across Tiers 0 -> 1 (25%) -> 2 (55%) -> 3 (100%)
//    Ignition triggers 10s Overdrive MAX, +15 HP heal, 15m shockwave, bullet clear, and mag refill.
{
  const g = start('normal');
  const t = g.api.test;
  t.set({ x: 0, y: 0, z: 12, hp: 60, max: 100, ammo: [10, 2, 1, 0, 0, 1], charge: 24, over: 0 });
  const near = t.spawn('chaser', 0, 5);
  near.hp = near.max = 200;
  near.tutorialDummy = true;

  g.key('KeyW');
  g.step(0.2);
  let snap = g.api.snapshot();
  assert.equal(snap.kineticTier, 1, 'Crossing 25% enters Tier 1 Ignition');

  t.set({ charge: 54 });
  g.step(0.2);
  snap = g.api.snapshot();
  assert.equal(snap.kineticTier, 2, 'Crossing 55% enters Tier 2 Hyperflow');

  t.set({ charge: 99.5 });
  g.step(0.1);
  g.dispatchWindow('keyup', { code: 'KeyW' });
  snap = g.api.snapshot();
  assert.equal(snap.kineticTier, 3, 'Crossing 100% ignites Tier 3 Overdrive MAX');
  assert.ok(snap.over >= 9.8 && snap.over <= 10, `Overdrive starts at 10s (got ${snap.over})`);
  assert.equal(snap.hp, 75, 'Ignition restores +15 HP');
  assert.ok(near.hp < 200, 'Ignition shockwave damages nearby enemy');
  assert.equal(snap.ammo[0], 50, 'Ignition auto-reloads pulse rifle');
  assert.equal(snap.ammo[1], 10, 'Ignition auto-reloads breach');
  assert.equal(snap.ammo[2], 6, 'Ignition auto-reloads railgun');
  assert.equal(snap.ammo[3], 12, 'Ignition preserves Astra refill contract');
  assert.equal(snap.ammo[4], 1, 'Ignition auto-reloads phantom lance');
  assert.equal(snap.ammo[5], 6, 'Ignition auto-reloads seeker');
}

// 2. Tier 3 Zero-Ammo Drain, Chain Lightning Arcs, and Kill Sustain (+4 HP & +0.65s duration)
{
  const g = start('normal');
  const t = g.api.test;
  t.set({ x: 0, y: 0, z: 12, hp: 70, max: 100, weapon: 0, ammo: [50, 10, 6, 12, 1, 6], charge: 99.5, over: 0 });
  g.key('KeyW');
  g.step(0.05);
  g.dispatchWindow('keyup', { code: 'KeyW' });

  const hpAfterIgnite = g.api.snapshot().hp; // 70 + 15 = 85
  const primary = t.spawn('charger', 0, 5);
  primary.hp = primary.max = 200;
  primary.tutorialDummy = true;
  const secondary = t.spawn('charger', 4, 5);
  secondary.hp = secondary.max = 200;
  secondary.tutorialDummy = true;

  t.aim(0, 1.2, 5);
  t.set({ cool: 0 });
  t.shoot();
  assert.equal(g.api.snapshot().ammo[0], 50, 'Tier 3 Overdrive consumes 0 magazine ammo');
  assert.ok(primary.hp < 200, 'Direct hit damages primary target');
  assert.ok(secondary.hp < 200, 'Tier 3 Chain Lightning arcs to nearby enemy');

  // Killing an enemy during natural Overdrive heals +4 HP and extends duration by +0.65s
  const overBeforeKill = g.api.snapshot().over;
  const victim = t.spawn('chaser', -4, 5);
  victim.hp = 1;
  victim.tutorialDummy = true;
  t.damage(victim, 5, false);
  const afterKill = g.api.snapshot();
  assert.equal(afterKill.hp, hpAfterIgnite + 4, 'Kill during Tier 3 restores +4 HP');
  assert.ok(afterKill.over > overBeforeKill + 0.5, 'Kill during natural Overdrive extends timer');
}

// 3. Tier 2 Dash Bullet Deflect clears close bullets and awards +6% charge
{
  const g = start('normal');
  const t = g.api.test;
  t.set({ x: 0, y: 0, z: 12, charge: 60, over: 0 });
  const shooter = t.spawn('shooter', 0, 9);
  shooter.tutorialDummy = true;
  t.set({ x: 0, y: 0, z: 12, charge: 60, over: 0 });
  t.dash();
  const bList = t.xBullets();
  const THREE = require('three');
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial());
  mesh.position.set(0, 0.9, 10.2);
  bList.push({ mesh, vel: new THREE.Vector3(0, 0, 2), life: 4 });
  const beforeCharge = g.api.snapshot().charge;
  t.update(0.016);
  assert.equal(bList.length, 0, 'Tier 2 Hyperflow Dash deflects close incoming bullets');
  assert.ok(g.api.snapshot().charge >= beforeCharge + 6, 'Deflecting a bullet adds +6% charge');
}

// 4. Abyss mode also benefits from Kinetic Tiers & Zero-Ammo Drain without breaking Abyss contracts
{
  const g = start('abyss');
  const t = g.api.test;
  t.set({ x: 0, y: 0, z: 12, weapon: 0, charge: 99.5, over: 0, ammo: [2, 10, 2, 4] });
  g.key('KeyW');
  g.step(0.05);
  g.dispatchWindow('keyup', { code: 'KeyW' });
  const snap = g.api.snapshot();
  assert.equal(snap.kineticTier, 3);
  assert.equal(snap.ammo[0], 8, 'Abyss Vortex Saw auto-reloads on Overdrive ignition');
  t.set({ cool: 0 });
  t.shoot();
  assert.equal(g.api.snapshot().ammo[0], 8, 'Abyss weapons also fire with zero ammo drain in Tier 3');
}

// 5. 3D Parkour: grounded wall walk stays normal; airborne beside tall pillar engages Wall-Run
//    (roll tilt, reload boost, x2 charge) and Space triggers Wall-Kick away + charge bonus
{
  const g = start('normal');
  const t = g.api.test;
  // Grounded walk near tall pillar (11, 2.5, -12, w=2.5, d=2.5, top=5) must NOT wall-run
  t.set({ x: 8.1, y: 0, z: -11, vy: 0, grounded: true, charge: 0, over: 0 });
  g.key('KeyW');
  g.step(0.06);
  assert.equal(g.api.snapshot().parkour.wallRunning, false, 'Grounded player never latches into wall-run');

  // Airborne beside the pillar with active reload starts Wall-Run immediately
  t.set({ x: 8.1, y: 1.5, z: -11, vy: 2.5, grounded: false, reload: 1.0, charge: 0, over: 0 });
  g.step(0.08);
  const running = g.api.snapshot();
  assert.equal(running.parkour.wallRunning, true, 'Airborne moving near tall pillar engages Wall-Run');
  assert.equal(running.parkour.wallSide, 1, 'Pillar at +X is detected on player right side');
  assert.ok(running.parkour.roll > 0.02, 'Camera rolls cleanly away from the wall');
  assert.ok(running.reloading < 1.0 - 0.14, 'Wall-run accelerates active weapon reload (x2.2)');
  assert.ok(running.charge > 2.5, 'Wall-run charges KINETIC at doubled rate');

  // Pressing Space during Wall-Run triggers Wall-Kick away from wall + wallChain + charge bonus
  const chargeBeforeKick = running.charge;
  const xBeforeKick = running.position.x;
  g.dispatchWindow('keydown', { code: 'Space' });
  g.dispatchWindow('keyup', { code: 'Space' });
  g.dispatchWindow('keyup', { code: 'KeyW' });
  g.step(0.16);
  const kicked = g.api.snapshot();
  assert.equal(kicked.parkour.wallChain, 1, 'Wall-kick increments wall-chain counter');
  assert.ok(kicked.position.x < xBeforeKick - 1.0, 'Wall-kick launches player cleanly away from wall normal');
  assert.ok(kicked.position.y > 1.8, 'Wall-kick gives strong vertical lift');
  assert.ok(kicked.charge >= chargeBeforeKick + 13, 'Wall-kick awards +14% KINETIC charge bonus');
}

// 6. [G] Thunderfall Break Finisher: requires >= 1.5s Overdrive, consumes Overdrive,
//    wipes bullets, deals massive AoE damage + stun, heals HP, refunds 22% charge, works in Fracture too
{
  const g = start('normal');
  const t = g.api.test;
  t.set({ x: 0, y: 2.5, z: 12, hp: 60, max: 100, charge: 100, over: 1.0 });
  assert.equal(g.api.snapshot().finisher.ready, false, 'Finisher stays locked when remaining Overdrive < 1.5s');
  assert.equal(t.kineticFinisher(), false, 'Cannot trigger Thunderfall Break below 1.5s Overdrive');

  t.set({ x: 0, y: 2.5, z: 12, hp: 60, max: 100, charge: 100, over: 8.5 });
  assert.equal(g.api.snapshot().finisher.ready, true, 'Finisher unlocks when Overdrive >= 1.5s');
  const bossPackA = t.spawn('charger', 0, 4);
  bossPackA.hp = bossPackA.max = 500;
  bossPackA.tutorialDummy = true;
  const bossPackB = t.spawn('chaser', 6, 12);
  bossPackB.hp = bossPackB.max = 200;
  bossPackB.tutorialDummy = true;

  const THREE = require('three');
  const bList = t.xBullets();
  const bm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial());
  bm.position.set(0, 1.5, 6);
  bList.push({ mesh: bm, vel: new THREE.Vector3(0, 0, 2), life: 4 });

  g.key('KeyG');
  g.dispatchWindow('keyup', { code: 'KeyG' });
  const after = g.api.snapshot();
  assert.equal(after.over, 0, 'Thunderfall Break consumes remaining Overdrive');
  assert.equal(after.charge, 22, 'Thunderfall Break refunds 22% KINETIC starter charge');
  assert.ok(after.hp >= 78, 'Thunderfall Break heals player HP');
  assert.equal(bList.length, 0, 'Thunderfall Break clears nearby enemy bullets');
  assert.ok(bossPackA.hp < 350 && bossPackB.hp <= 0, 'Thunderfall Break deals scaled AoE damage to enemies');
  assert.equal(after.finisher.finishersUsed, 1, 'Finisher counter increments in snapshot');

  // Verify [G] does not collide with Fracture [F] Kinetic Arm
  const gf = start('fracture');
  gf.api.test.omegaSelect(gf.api.test.omegaOptions()[0]);
  gf.step(0.032);
  gf.api.test.set({ x: 0, y: 0, z: 12, hp: 70, max: 100, charge: 100, over: 7.5 });
  gf.key('KeyG');
  gf.dispatchWindow('keyup', { code: 'KeyG' });
  assert.equal(gf.api.snapshot().finisher.finishersUsed, 1, 'KeyG Finisher works cleanly in Fracture mode without F conflict');
}

console.log('PASS: Kinetic Overdrive 4-tier progression, 3D wall-run/wall-kick, Thunderfall Break finisher, shockwave, chain lightning, dash deflect, and Abyss/Fracture integration');
