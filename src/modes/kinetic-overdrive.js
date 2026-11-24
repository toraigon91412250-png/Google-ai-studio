// Pure deterministic kinetic momentum, 4-tier overdrive scaling, dual-wield resolution, dash counter-reflect, and Chrono Break helpers.

export const KINETIC_TIERS = [
  {
    tier: 0,
    minCharge: 0,
    id: 'idle',
    code: 'STANDBY',
    label: 'KINETIC REACTOR',
    hint: 'RUN / DASH → 25% · 55% · 100%',
    speedMult: 1,
    fireRateMult: 1,
    coolMult: 1,
    damageMult: 1,
    reloadSpeedMult: 1,
    dashCdMult: 1,
    jumpMult: 1,
    fovBonus: 0,
    ammoFree: false,
    chainArc: false,
    dashDeflect: false,
    dualWield: false,
    ammoRegenRate: 0
  },
  {
    tier: 1,
    minCharge: 25,
    id: 'ignition',
    code: 'GEAR I · IGNITION',
    label: 'RELOAD ×1.35 · DASH -20%',
    hint: 'SPD +15% · FIRE +18% · DMG +15%',
    speedMult: 1.15,
    fireRateMult: 1.18,
    coolMult: 0.85,
    damageMult: 1.15,
    reloadSpeedMult: 1.35,
    dashCdMult: 0.8,
    jumpMult: 1.05,
    fovBonus: 2.5,
    ammoFree: false,
    chainArc: false,
    dashDeflect: false,
    dualWield: false,
    ammoRegenRate: 0
  },
  {
    tier: 2,
    minCharge: 55,
    id: 'hyperflow',
    code: 'GEAR II · HYPERFLOW',
    label: 'AMMO REGEN · DASH -40%',
    hint: 'SPD +32% · PWR +38% · 反撃ダッシュ',
    speedMult: 1.32,
    fireRateMult: 1.38,
    coolMult: 0.72,
    damageMult: 1.38,
    reloadSpeedMult: 1.7,
    dashCdMult: 0.6,
    jumpMult: 1.12,
    fovBonus: 5.5,
    ammoFree: false,
    chainArc: false,
    dashDeflect: true,
    dualWield: false,
    ammoRegenRate: 0.12
  },
  {
    tier: 3,
    minCharge: 100,
    id: 'overdrive',
    code: 'APEX · OVERDRIVE MAX',
    label: 'DUAL WIELD · +24% JUMP',
    hint: '二丁同時射撃 · ∞ AMMO · CHAIN ARC · +65% FIRE',
    speedMult: 1.48,
    fireRateMult: 1.65,
    coolMult: 0.61,
    damageMult: 1.55,
    reloadSpeedMult: 2.6,
    dashCdMult: 0.4,
    jumpMult: 1.24,
    fovBonus: 10,
    ammoFree: true,
    chainArc: true,
    dashDeflect: true,
    dualWield: true,
    ammoRegenRate: 0.5
  }
];

export const KINETIC_CONFIG = {
  tier1Threshold: 25,
  tier2Threshold: 55,
  overdriveDuration: 8.0,
  maxOverdriveDuration: 11.0,
  killExtendSeconds: 0.40,
  killHealAmount: 2,
  ignitionHealAmount: 10,
  easyChargeMult: 1.75,
  easyOverdriveDuration: 10,
  easyMaxOverdriveDuration: 14,
  easyKillExtendSeconds: 0.65,
  easyKillHealAmount: 4,
  easyIgnitionHealAmount: 15,
  easyDashChargeBoost: 18,
  easySlideChargeBoost: 10,
  easyPadChargeBoost: 22,
  ignitionShockRadius: 15,
  ignitionShockDamage: 65,
  bulletClearRadius: 16,
  dashDeflectRadius: 3.6,
  dashDeflectChargePerBullet: 6,
  dashReflectDamage: 48,
  runGainPerSec: 8.5,
  airBonusMult: 1.25,
  slideBonusMult: 1.2,
  wallRunBonusMult: 1.85,
  graceDuration: 1.05,
  idleDecayPerSec: 8.0,
  dashChargeBoost: 10,
  slideChargeBoost: 6,
  padChargeBoost: 14,
  chainArcRange: 10.5,
  chainArcDamage: 24
};

export const FINISHER_CONFIG = {
  minOverRemaining: 1.5,
  baseDamage: 185,
  maxBonusDamage: 165,
  baseRadius: 17,
  maxBonusRadius: 8,
  stunDuration: 2.3,
  healBase: 14,
  healBonus: 8,
  refundCharge: 22,
  invDuration: 1.35,
  diveVelocity: -24,
  arcCount: 8,
  knockbackForce: 7.5
};

export const CHRONO_CONFIG = Object.freeze({
  duration: 3.6,
  timeScale: 0.22,
  playerDamageMult: 1.35,
  killCharge: 12
});

export class ChronoBreakController {
  constructor() {
    this.reset();
  }

  reset() {
    this.unlocked = false;
    this.charge = 0;
    this.remaining = 0;
    this.activations = 0;
    return this.snapshot();
  }

  unlock() {
    this.unlocked = true;
    this.charge = 100;
    return this.snapshot();
  }

  get active() {
    return this.unlocked && this.remaining > 0;
  }

  get ready() {
    return this.unlocked && this.remaining <= 0 && this.charge >= 100;
  }

  activate() {
    if (!this.ready) return false;
    this.charge = 0;
    this.remaining = CHRONO_CONFIG.duration;
    this.activations += 1;
    return true;
  }

  onKill(amount = CHRONO_CONFIG.killCharge) {
    if (!this.unlocked || this.remaining > 0) return this.charge;
    this.charge = Math.min(100, this.charge + Math.max(0, amount));
    return this.charge;
  }

  tick(dt) {
    if (!this.unlocked || !Number.isFinite(dt) || dt <= 0) return this.active;
    if (this.remaining > 0) {
      this.remaining = Math.max(0, this.remaining - dt);
    }
    return this.active;
  }

  snapshot() {
    return {
      unlocked: this.unlocked,
      active: this.active,
      ready: this.ready,
      charge: this.charge,
      remaining: this.remaining,
      duration: CHRONO_CONFIG.duration,
      activations: this.activations
    };
  }
}

export function resolveDualWieldWeapon({
  active = false,
  mainWeapon = 0,
  previousWeapon = null,
  abyss = false,
  weaponCount = abyss ? 4 : 6
} = {}) {
  if (!active || weaponCount < 2) return -1;
  const normalizedMain = ((mainWeapon % weaponCount) + weaponCount) % weaponCount;
  if (
    previousWeapon !== null &&
    previousWeapon !== undefined &&
    Number.isInteger(previousWeapon) &&
    previousWeapon >= 0 &&
    previousWeapon < weaponCount &&
    previousWeapon !== normalizedMain
  ) {
    return previousWeapon;
  }
  const preferredPartner = abyss ? 1 : 0; // Abyss: CRYO-TESLA (1), Main/Easy: PULSE (0)
  if (normalizedMain !== preferredPartner) return preferredPartner;
  return abyss ? 0 : 1; // Fallback if holding partner weapon in right hand
}

export function computeOffhandRate(weaponIndex = 0, coolMult = 0.61, abyss = false) {
  if (abyss) {
    const abyssBaseRates = [0.24, 0.14, 0.55, 0.34];
    const base = abyssBaseRates[weaponIndex] ?? 0.24;
    return Math.max(0.08, base * coolMult);
  }
  // Normal weapons: Pulse(0), Breach(1), Rail(2), Astra rapid bolt(3), Phantom auto-lance(4), Seeker auto-salvo(5)
  const mainBaseRates = [0.11, 0.52, 0.72, 0.22, 0.46, 0.48];
  const base = mainBaseRates[weaponIndex] ?? 0.22;
  return Math.max(0.075, base * coolMult);
}

export function computeDashReflectDamage(tier = 0, abyssReflectLevel = 0) {
  if (tier < 2) return 0;
  const tierScale = tier >= 3 ? 1.5 : 1;
  const relicScale = 1 + Math.max(0, abyssReflectLevel) * 0.65;
  return Math.round(KINETIC_CONFIG.dashReflectDamage * tierScale * relicScale);
}

export function computeDashReflectCount(tier = 0, abyssReflectLevel = 0) {
  if (tier < 2) return 0;
  return (tier >= 3 ? 2 : 1) + (abyssReflectLevel > 0 ? 1 : 0);
}

export function canTriggerKineticFinisher(
  over = 0,
  { tutorialActive = false, ultimateActive = false, exhausting = false } = {}
) {
  if (tutorialActive || ultimateActive || exhausting) return false;
  return Number(over) >= FINISHER_CONFIG.minOverRemaining;
}

export function computeKineticFinisher(over = 0, up = {}) {
  const ready = Number(over) >= FINISHER_CONFIG.minOverRemaining;
  const span = Math.max(1, KINETIC_CONFIG.overdriveDuration - FINISHER_CONFIG.minOverRemaining);
  const ratio = ready ? Math.min(1, Math.max(0, (over - FINISHER_CONFIG.minOverRemaining) / span)) : 0;
  const capLv = Math.max(0, up?.capacitor || 0);
  const capScale = 1 + capLv * 0.12;
  return {
    ready,
    ratio,
    damage: Math.round((FINISHER_CONFIG.baseDamage + FINISHER_CONFIG.maxBonusDamage * ratio) * capScale),
    radius: Number((FINISHER_CONFIG.baseRadius + FINISHER_CONFIG.maxBonusRadius * ratio).toFixed(2)),
    stun: FINISHER_CONFIG.stunDuration,
    heal: Math.round(FINISHER_CONFIG.healBase + FINISHER_CONFIG.healBonus * ratio),
    refundCharge: FINISHER_CONFIG.refundCharge,
    invDuration: FINISHER_CONFIG.invDuration,
    arcCount: FINISHER_CONFIG.arcCount,
    knockback: FINISHER_CONFIG.knockbackForce
  };
}

export function computeKineticTier(charge = 0, over = 0) {
  if (over > 0) return 3;
  if (charge >= KINETIC_CONFIG.tier2Threshold) return 2;
  if (charge >= KINETIC_CONFIG.tier1Threshold) return 1;
  return 0;
}

export function computeKineticProfile(charge = 0, over = 0, up = {}) {
  const tier = computeKineticTier(charge, over);
  const base = KINETIC_TIERS[tier];
  const capLv = up?.capacitor || 0;
  const capBonus = tier > 0 ? capLv * 0.05 : 0;
  return {
    ...base,
    speedMult: base.speedMult + (tier > 0 ? capLv * 0.03 : 0),
    damageMult: base.damageMult + capBonus,
    tierRatio: tier === 3 ? Math.min(1, Math.max(0, charge / 100)) : Math.min(1, Math.max(0, charge / 100))
  };
}

export function stepKineticCharge({
  charge = 0,
  over = 0,
  overMax = KINETIC_CONFIG.overdriveDuration,
  grace = 0,
  dt = 0,
  moving = false,
  dashing = false,
  sliding = false,
  wallRunning = false,
  grounded = true,
  chargeMult = 1,
  up = {},
  tutorialActive = false,
  easy = false
} = {}) {
  const targetDuration = easy ? KINETIC_CONFIG.easyOverdriveDuration : KINETIC_CONFIG.overdriveDuration;
  let nextCharge = Math.max(0, Math.min(100, charge));
  let nextOver = Math.max(0, over);
  let nextOverMax = Math.max(1, overMax || targetDuration);
  let nextGrace = Math.max(0, grace);
  let triggered = false;

  if (nextOver > 0) {
    nextOver = Math.max(0, nextOver - dt);
    const echoBonus = up?.overecho && nextOverMax < 9 ? 1 : 0;
    const denom = Math.max(1, nextOverMax + echoBonus);
    nextCharge = nextOver > 0 ? Math.min(100, (100 * nextOver) / denom) : 0;
    nextGrace = KINETIC_CONFIG.graceDuration;
    return {
      charge: nextCharge,
      over: nextOver,
      overMax: nextOverMax,
      grace: nextGrace,
      triggered: false,
      tier: computeKineticTier(nextCharge, nextOver)
    };
  }

  if (tutorialActive) {
    return {
      charge: nextCharge,
      over: 0,
      overMax: targetDuration,
      grace: nextGrace,
      triggered: false,
      tier: computeKineticTier(nextCharge, 0)
    };
  }

  if (moving) {
    const capFactor = 1 + 0.35 * (up?.capacitor || 0);
    const stanceFactor =
      (grounded ? 1 : KINETIC_CONFIG.airBonusMult) *
      (sliding ? KINETIC_CONFIG.slideBonusMult : 1) *
      (dashing ? 1.35 : 1) *
      (wallRunning ? KINETIC_CONFIG.wallRunBonusMult : 1);
    const easyFactor = easy ? KINETIC_CONFIG.easyChargeMult : 1;
    const gain = KINETIC_CONFIG.runGainPerSec * chargeMult * easyFactor * capFactor * stanceFactor;
    nextCharge = Math.min(100, nextCharge + dt * gain);
    nextGrace = KINETIC_CONFIG.graceDuration;
  } else if (nextGrace > 0) {
    nextGrace = Math.max(0, nextGrace - dt);
  } else {
    nextCharge = Math.max(0, nextCharge - dt * KINETIC_CONFIG.idleDecayPerSec);
  }

  if (nextCharge >= 100) {
    triggered = true;
    nextOver = targetDuration;
    nextOverMax = targetDuration;
    nextCharge = 100;
    nextGrace = KINETIC_CONFIG.graceDuration;
  }

  return {
    charge: nextCharge,
    over: nextOver,
    overMax: nextOverMax,
    grace: nextGrace,
    triggered,
    tier: computeKineticTier(nextCharge, nextOver)
  };
}

export function computeSectorScaling({ mode = 'normal', difficulty = 'normal', wave = 1 } = {}) {
  if (difficulty === 'easy') {
    return {
      hpMult: 1,
      speedMult: 1,
      cdMult: 1,
      bulletSpeedMult: 1,
      spawnInterval: 0.95,
      extraEnemies: 0
    };
  }
  const w = Math.max(1, Math.floor(Number(wave) || 1));
  const idx = Math.min(4, w - 1);
  if (mode === 'abyss') {
    const hpTable = [1.12, 1.32, 1.62, 1.98, 2.38];
    const speedTable = [1.02, 1.08, 1.15, 1.22, 1.3];
    const cdTable = [0.96, 0.89, 0.81, 0.73, 0.65];
    const bulletTable = [1.04, 1.12, 1.22, 1.32, 1.42];
    const spawnTable = [0.72, 0.64, 0.56, 0.48, 0.42];
    const extraTable = [0, 1, 2, 3, 4];
    return {
      hpMult: hpTable[idx],
      speedMult: speedTable[idx],
      cdMult: cdTable[idx],
      bulletSpeedMult: bulletTable[idx],
      spawnInterval: spawnTable[idx],
      extraEnemies: extraTable[idx]
    };
  }
  const hpTable = [1.0, 1.15, 1.32, 1.52, 1.75];
  const speedTable = [1.0, 1.04, 1.09, 1.14, 1.2];
  const cdTable = [1.0, 0.94, 0.88, 0.82, 0.76];
  const bulletTable = [1.0, 1.07, 1.14, 1.21, 1.28];
  const spawnTable = [0.95, 0.88, 0.82, 0.76, 0.72];
  return {
    hpMult: hpTable[idx],
    speedMult: speedTable[idx],
    cdMult: cdTable[idx],
    bulletSpeedMult: bulletTable[idx],
    spawnInterval: spawnTable[idx],
    extraEnemies: w === 5 ? 2 : w === 4 ? 1 : 0
  };
}

export function computeRushBossHpMult({ easy = false, round = 1, wins = 0 } = {}) {
  if (easy) return 0.78;
  const r = Math.max(1, Math.floor(Number(round) || 1));
  return Math.min(1.4, Number((1.15 + (r - 1) * 0.05 + (wins >= 4 ? 0.05 : 0)).toFixed(2)));
}
