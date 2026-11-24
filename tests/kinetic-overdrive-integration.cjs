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
  assert.ok(snap.over >= 7.8 && snap.over <= 8.0, `Overdrive starts at 8.0s in STD (got ${snap.over})`);
  assert.equal(snap.hp, 70, 'Ignition restores +10 HP in STD');
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

  const hpAfterIgnite = g.api.snapshot().hp; // 70 + 10 = 80
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

  // Killing an enemy during natural Overdrive heals +2 HP and extends duration by +0.40s in STD
  const overBeforeKill = g.api.snapshot().over;
  const victim = t.spawn('chaser', -4, 5);
  victim.hp = 1;
  victim.tutorialDummy = true;
  t.damage(victim, 5, false);
  const afterKill = g.api.snapshot();
  assert.equal(afterKill.hp, hpAfterIgnite + 2, 'Kill during Tier 3 restores +2 HP in STD');
  assert.ok(afterKill.over > overBeforeKill + 0.3, 'Kill during natural Overdrive extends timer by +0.40s');
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
  assert.ok(running.charge > 1.3, 'Wall-run charges KINETIC at boosted x1.85 rate');

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
  assert.ok(kicked.charge >= chargeBeforeKick + 9, 'Wall-kick awards +10% KINETIC charge bonus');
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

  // Verify [G] Finisher works cleanly alongside unlocked [F] Kinetic Arm without F conflict
  t.set({ x: 0, y: 0, z: 12, hp: 70, max: 100, charge: 100, over: 7.5, up: { kineticarm: 1 } });
  g.key('KeyG');
  g.dispatchWindow('keyup', { code: 'KeyG' });
  assert.equal(g.api.snapshot().finisher.finishersUsed, 2, 'KeyG Finisher works cleanly alongside unlocked KeyF Kinetic Arm');
}

// 7. Tier 3 OVERDRIVE Dual-Wield Rampage (Option A: previousWeapon, PULSE/CRYO fallback, ASTRA/LANCE/SEEKER rapid overrides)
{
  const g = start('normal');
  const t = g.api.test;
  // Unswitched with PULSE (0): fallback left hand is BREACH (1), never duplicate
  t.set({ x: 0, y: 0, z: 12, weapon: 0, previousWeapon: null, charge: 100, over: 8, ammo: [50, 10, 6, 24, 1, 6] });
  let snap = g.api.snapshot();
  assert.equal(snap.dualWield.active, true);
  assert.equal(snap.dualWield.leftWeapon, 1, 'Main PULSE pairs with BREACH fallback when unswitched');

  // Unswitched with RAILGUN (2): fallback left hand is PULSE (0)
  t.set({ weapon: 2, previousWeapon: null });
  assert.equal(g.api.snapshot().dualWield.leftWeapon, 0, 'Main non-PULSE falls back to PULSE (0) when unswitched');

  // Swap RAIL (2) -> ASTRA (3), then ASTRA (3) -> LANCE (4): left hand uses ASTRA (3) instant energy bolt
  t.weapon(2);
  t.weapon(3);
  t.weapon(4);
  t.set({ charge: 100, over: 8, cool: 0 });
  snap = g.api.snapshot();
  assert.equal(snap.weapon, 4);
  assert.equal(snap.dualWield.leftWeapon, 3, 'previousWeapon tracks last weapon (ASTRA)');

  const targetA = t.spawn('charger', 0, 5);
  targetA.hp = targetA.max = 400;
  targetA.tutorialDummy = true;
  t.aim(0, 1.1, 5);
  assert.equal(t.shootOffhand(), true, 'ASTRA offhand fires instant bolt during Tier 3');
  assert.ok(targetA.hp < 400, 'ASTRA offhand bolt damages enemy immediately without hold charge');
  assert.equal(g.api.snapshot().ammo[3], 24, 'Offhand ASTRA consumes zero ammo in Tier 3');

  // Swap back to LANCE (4) as previousWeapon (main -> 0 PULSE): offhand LANCE fires no-ADS laser
  t.weapon(0);
  t.set({ cool: 0 });
  for (let i = 0; i < 6; i++) t.update(0.1);
  targetA.hp = 400;
  t.aim(0, 1.1, 5);
  assert.equal(t.shootOffhand(), true, 'PHANTOM LANCE offhand fires instant no-ADS laser during Tier 3');
  assert.ok(targetA.hp < 400, 'Offhand LANCE damages target without scoping');

  // Swap SEEKER (5) -> PULSE (0): offhand SEEKER fires instant 2-missile salvo
  t.weapon(5);
  t.weapon(0);
  t.set({ cool: 0 });
  for (let i = 0; i < 6; i++) t.update(0.1);
  assert.equal(g.api.snapshot().dualWield.leftWeapon, 5);
  const beforeSeekerShots = g.api.snapshot().seeker.shots;
  assert.equal(t.shootOffhand(), true, 'SEEKER offhand fires instant homing missiles during Tier 3');
  assert.ok(g.api.snapshot().seeker.shots > beforeSeekerShots, 'SEEKER offhand registers missile launches');

  // Abyss Mode Tier 3 Dual-Wield: unswitched SAW (0) pairs with CRYO-TESLA (1) and chills enemy
  const ga = start('abyss');
  const ta = ga.api.test;
  ta.set({ x: 0, y: 0, z: 12, weapon: 0, previousWeapon: null, charge: 100, over: 8, ammo: [8, 22, 4, 6] });
  assert.equal(ga.api.snapshot().dualWield.leftWeapon, 1, 'Abyss unswitched SAW pairs with CRYO-TESLA (1)');
  const stalker = ta.abyssSpawn('stalker', 0, 5);
  stalker.hp = stalker.max = 300;
  stalker.tutorialDummy = true;
  ta.aim(0, 1.0, 5);
  assert.equal(ta.shootOffhand(), true, 'Abyss CRYO-TESLA offhand fires during Tier 3');
  assert.ok(stalker.hp < 300 && stalker.chill > 0, 'Abyss CRYO-TESLA offhand damages and chills enemy');
}

// 8. Dash Bullet Reflection counter-beams & Abyss abyss_reflect HP heal
{
  const ga = start('abyss');
  const ta = ga.api.test;
  ta.set({ x: 0, y: 0, z: 12, hp: 70, max: 100, charge: 100, over: 6, up: { abyss_reflect: 2 } });
  const enemy = ta.abyssSpawn('aegis', 0, 4);
  enemy.hp = enemy.max = 500;
  enemy.tutorialDummy = true;
  ta.dash();
  const THREE = require('three');
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial());
  mesh.position.set(0, 0.9, 10.2);
  ta.xBullets().push({ mesh, vel: new THREE.Vector3(0, 0, 2), life: 4 });
  ta.update(0.016);
  assert.ok(ga.api.snapshot().dashReflected >= 1, 'Dash deflect counter increments');
  assert.equal(ga.api.snapshot().hp, 76, 'abyss_reflect lv2 restores +6 HP per deflected bullet');
  assert.ok(enemy.hp < 500, 'Dash deflect fires counter-beams at visible enemies');
}

// 9. Absorbed Chrono Break [Q] & Kinetic Arm [F] unlocks & combat loops
{
  const g = start('normal');
  const t = g.api.test;
  const anchor = t.spawn('charger', -22, -22);
  anchor.hp = anchor.max = 2000;
  anchor.tutorialDummy = true;
  t.set({ x: 0, y: 0, z: 12, up: { chronobreak: 1, kineticarm: 1 } });
  assert.equal(g.api.snapshot().chrono.ready, true, 'chronobreak card unlocks READY');
  assert.equal(g.api.snapshot().kineticArm.unlocked, true, 'kineticarm card unlocks [F] Kinetic Arm');

  g.key('KeyQ');
  g.dispatchWindow('keyup', { code: 'KeyQ' });
  assert.equal(g.api.snapshot().chrono.active, true, 'KeyQ activates Chrono Break');
  t.update(4.0);
  assert.equal(g.api.snapshot().chrono.active, false, 'Chrono Break expires cleanly after 3.6s');
  const victim = t.spawn('chaser', 0, 6);
  victim.hp = 1;
  t.damage(victim, 10);
  assert.equal(g.api.snapshot().chrono.charge, 12, 'Kill recharges Chrono Break by +12%');

  // [F] catches incoming bullet and returns fire without touching [G]
  g.key('KeyF');
  g.dispatchWindow('keyup', { code: 'KeyF' });
  assert.equal(g.api.snapshot().kineticArm.catching, true, 'KeyF opens Kinetic Arm catch window');
  const THREE = require('three');
  const bm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial());
  bm.position.set(0, 0.9, 10.0);
  t.xBullets().push({ mesh: bm, vel: new THREE.Vector3(0, 0, 2), life: 4 });
  t.update(0.016);
  assert.equal(g.api.snapshot().kineticArm.captured, 1, 'Kinetic Arm captures incoming front bullet');
  t.update(0.7); // wait catch window out so next KeyF triggers return
  const target = t.spawn('charger', 0, 5);
  target.hp = target.max = 200;
  target.tutorialDummy = true;
  t.aim(0, 1.0, 5);
  g.key('KeyF');
  g.dispatchWindow('keyup', { code: 'KeyF' });
  assert.equal(g.api.snapshot().kineticArm.returned, 1, 'Second KeyF returns captured bullet');
  assert.ok(target.hp < 200, 'Returned bullet damages aimed target');
}

// 10. Sudden Bonus Missions reward +65% OVERDRIVE (igniting if crossing 100%) and expire silently on timeout
{
  const g = start('normal');
  const t = g.api.test;
  const anchor = t.spawn('charger', -22, -22);
  anchor.hp = anchor.max = 2000;
  anchor.tutorialDummy = true;
  t.set({ x: 0, y: 0, z: 12, hp: 60, max: 100, charge: 10, over: 0 });
  const sm = t.triggerSuddenMission('breach');
  assert.equal(sm.active, true);
  const crystals = t.rushEnemies().filter((e) => e.suddenObjective);
  assert.equal(crystals.length, 2, 'Breach sudden mission spawns 2 objective crystals');
  for (const c of crystals) t.damage(c, 500);
  const afterPartial = g.api.snapshot();
  assert.equal(afterPartial.suddenMission.completedCount, 1);
  assert.equal(afterPartial.charge, 75, 'Sudden mission awards +65% gauge (10 -> 75)');
  assert.equal(afterPartial.over, 0, 'Sudden mission below 100% does not immediately force Overdrive');
  assert.equal(afterPartial.hp, 74, 'Sudden mission heals +14 HP');

  // Second Sudden Mission from 40% charge crosses 100% and ignites 8s OVERDRIVE MAX
  t.set({ x: 0, y: 0, z: 12, charge: 40, over: 0 });
  t.triggerSuddenMission('breach');
  for (const c of t.rushEnemies().filter((e) => e.suddenObjective)) t.damage(c, 500);
  const afterIgnite = g.api.snapshot();
  assert.equal(afterIgnite.kineticTier, 3, 'Sudden mission crossing 100% ignites Tier 3 OVERDRIVE MAX');
  assert.ok(afterIgnite.over >= 7.8 && afterIgnite.over <= 8.0, `Sudden ignition grants 8.0s OVERDRIVE (got ${afterIgnite.over})`);

  // Relay expiration must clear cleanly without damage or penalty
  t.triggerSuddenMission('relay');
  const hpBeforeExpire = g.api.snapshot().hp;
  t.update(30);
  const afterExpire = g.api.snapshot();
  assert.equal(afterExpire.suddenMission.active, false);
  assert.equal(afterExpire.suddenMission.expiredCount, 1);
  assert.equal(afterExpire.hp, hpBeforeExpire, 'Expired sudden mission applies zero penalty');
}

// 11. Sector 1->5 Scaling (STD & ABYSS) + EASY Difficulty Preservation
{
  // STD Sector 1 stays 65 HP; Sector 5 scales up to round(65 * 1.75) = 114 HP
  const gNorm = start('normal');
  const tNorm = gNorm.api.test;
  assert.equal(tNorm.spawn('chaser', 0, 5).hp, 65, 'STD Wave 1 chaser keeps 65 HP');
  tNorm.setStage(5);
  assert.equal(tNorm.spawn('chaser', 0, 5).hp, Math.round(65 * 1.75), 'STD Wave 5 chaser scales HP x1.75');

  // EASY keeps 10s Overdrive, +15 HP ignition heal, and 32.5 HP chaser even on Wave 5
  const gEasy = start('easy');
  const tEasy = gEasy.api.test;
  tEasy.tutorialSet(-1);
  tEasy.setStage(5);
  tEasy.set({ hp: 60, max: 120, charge: 99.5, over: 0 });
  gEasy.key('KeyW');
  gEasy.step(0.08);
  gEasy.dispatchWindow('keyup', { code: 'KeyW' });
  const easySnap = gEasy.api.snapshot();
  assert.ok(easySnap.over >= 9.7 && easySnap.over <= 10.0, `EASY retains 10s Overdrive (got ${easySnap.over})`);
  assert.equal(easySnap.hp, 75, 'EASY retains +15 HP ignition heal');
  assert.equal(tEasy.spawn('chaser', 0, 5).hp, 32.5, 'EASY Wave 5 chaser keeps halved 32.5 HP without sector inflation');

  // ABYSS Sector 5 escalates steeply (x2.38 HP, 16-enemy wave queue, Sector 5 Vanguard elite, 7400 HP Architect)
  const gAbyss = start('abyss');
  const tAbyss = gAbyss.api.test;
  tAbyss.setStage(4);
  tAbyss.killWave();
  gAbyss.step(1.4);
  if (gAbyss.api.snapshot().state === 'upgrade') {
    gAbyss.element('choices').children[0].onclick();
    gAbyss.step(0.032);
  }
  if (gAbyss.api.snapshot().state === 'rebuilding') {
    gAbyss.step(gAbyss.api.snapshot().world.duration + 0.05);
  }
  assert.equal(gAbyss.api.snapshot().wave, 5, 'Advanced cleanly into ABYSS Sector 5');
  assert.equal(gAbyss.api.snapshot().queue, 16, 'ABYSS Sector 5 queues 12 base + 4 extra enemies');
  assert.equal(tAbyss.abyssSpawn('aegis', 0, 5).elite, true, 'ABYSS Sector 5 spawns AEGIS VANGUARD elite');
  assert.equal(tAbyss.abyssSpawn('stalker', 0, 5).hp, Math.round(76 * 2.38), 'ABYSS Wave 5 stalker scales x2.38');
  assert.equal(tAbyss.abyssSpawn('architect', 0, 0).hp, 7400, 'ABYSS VOID ARCHITECT spawns with 7400 HP');
}

// 12. Abyss Weapon VFX: Muzzle/Trails/Implosion, Barrel Heat, Dynamic Hitmarkers, Hitstop, and Tier 3 Offhand Aura
{
  const ga = start('abyss');
  const ta = ga.api.test;
  ta.set({ x: 0, y: 0, z: 12, weapon: 0, previousWeapon: 1, charge: 100, over: 8, ammo: [8, 22, 4, 6] });

  // Fire all 4 Abyss weapons and verify barrel heat buildup + VFX spawning
  for (let w = 0; w < 4; w++) {
    ta.weapon(w);
    ta.set({ cool: 0 });
    const foe = ta.abyssSpawn('stalker', 0, 6);
    foe.hp = foe.max = 260;
    foe.tutorialDummy = true;
    ta.aim(0, 1.0, 6);
    ta.shoot();
    assert.ok(ga.api.snapshot().abyss.weaponHeat[w] >= 0.1, `Abyss weapon ${w} accumulates barrel heat on fire`);
  }
  assert.ok(ga.api.snapshot().abyss.vfxCount > 0, 'Abyss weapon shots emit visible VFX meshes');

  // Tier 3 offhand weapon heats left-hand heat array independently (previousWeapon is 3 after 0->1->2->3->0)
  ta.weapon(0);
  ta.set({ cool: 0 });
  const leftSlot = ga.api.snapshot().dualWield.leftWeapon;
  assert.equal(leftSlot, 3, 'Swapping from weapon 3 to 0 assigns weapon 3 to left hand');
  assert.equal(ta.shootOffhand(), true, 'Abyss Tier 3 offhand fires');
  assert.ok(ga.api.snapshot().abyss.leftHeat[leftSlot] >= 0.09, 'Left-hand Abyss weapon accumulates independent barrel heat');

  // Dynamic hitmarker differentiation: frontal Aegis shield ('shield'), dorsal crit ('crit'), kill ('kill')
  ta.clearEnemies();
  ta.update(0.3);
  const aegis = ta.abyssSpawn('aegis', 0, 5);
  aegis.hp = aegis.max = 400;
  aegis.tutorialDummy = true;
  aegis.mesh.lookAt(0, 0, 12);
  ta.set({ x: 0, y: 0, z: 12, weapon: 1, cool: 0 });
  ta.aim(0, 0.7, 5);
  ta.shoot();
  assert.equal(ga.api.snapshot().abyss.hitMarkerKind, 'shield', 'Frontal Aegis shield triggers shield hitmarker');

  ta.update(0.25); // Let previous hitmarker expire
  ta.damage(aegis, 40, false, { head: true }); // Dorsal core crit hit
  assert.equal(ga.api.snapshot().abyss.hitMarkerKind, 'crit', 'Critical hit upgrades hitmarker to crit');

  ta.damage(aegis, 500, false); // Lethal blow upgrades hitmarker to kill and triggers micro-hitstop
  const afterKill = ga.api.snapshot().abyss;
  assert.equal(afterKill.hitMarkerKind, 'kill', 'Lethal damage upgrades hitmarker to kill');
  assert.equal(afterKill.hitstopActive, true, 'Lethal hit activates micro-hitstop');

  // Barrel heat cools down and temporary VFX clear over time
  for (let i = 0; i < 25; i++) ta.update(0.1);
  const cooled = ga.api.snapshot().abyss;
  assert.equal(cooled.hitstopActive, false, 'Micro-hitstop clears cleanly');
  assert.ok(cooled.weaponHeat.every((h) => h < 0.05), 'All Abyss weapon heat cools back near 0');
}

console.log('PASS: Kinetic Overdrive 4-tier progression, Tier 3 Dual-Wield, 3D wall-run/kick, Thunderfall Break, Dash Reflect, Chrono Break, Kinetic Arm, Sudden Bonus Missions, Sector Balance Scaling, and Abyss Weapon VFX');
