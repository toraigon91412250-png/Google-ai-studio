// Pure deterministic kinetic momentum, 4-tier overdrive scaling, and shockwave/progression helpers.

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
    ammoRegenRate: 0
  },
  {
    tier: 2,
    minCharge: 55,
    id: 'hyperflow',
    code: 'GEAR II · HYPERFLOW',
    label: 'AMMO REGEN · DASH -40%',
    hint: 'SPD +32% · PWR +38% · DEFLECT',
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
    ammoRegenRate: 0.12
  },
  {
    tier: 3,
    minCharge: 100,
    id: 'overdrive',
    code: 'APEX · OVERDRIVE MAX',
    label: 'APEX SURGE · +24% JUMP',
    hint: '∞ AMMO · CHAIN ARC · +85% FIRE · +75% DMG',
    speedMult: 1.48,
    fireRateMult: 1.85,
    coolMult: 0.54,
    damageMult: 1.75,
    reloadSpeedMult: 2.6,
    dashCdMult: 0.4,
    jumpMult: 1.24,
    fovBonus: 10,
    ammoFree: true,
    chainArc: true,
    dashDeflect: true,
    ammoRegenRate: 0.5
  }
];

export const KINETIC_CONFIG = {
  tier1Threshold: 25,
  tier2Threshold: 55,
  overdriveDuration: 10,
  maxOverdriveDuration: 14,
  killExtendSeconds: 0.65,
  killHealAmount: 4,
  ignitionHealAmount: 15,
  ignitionShockRadius: 15,
  ignitionShockDamage: 65,
  bulletClearRadius: 16,
  dashDeflectRadius: 3.6,
  dashDeflectChargePerBullet: 6,
  runGainPerSec: 18,
  airBonusMult: 1.25,
  slideBonusMult: 1.2,
  wallRunBonusMult: 2.0,
  graceDuration: 1.35,
  idleDecayPerSec: 5.5,
  dashChargeBoost: 18,
  slideChargeBoost: 10,
  padChargeBoost: 22,
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
  // Capacitor upgrades amplify tier 1-3 speed & damage slightly for extra build synergy
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
  tutorialActive = false
} = {}) {
  let nextCharge = Math.max(0, Math.min(100, charge));
  let nextOver = Math.max(0, over);
  let nextOverMax = Math.max(1, overMax || KINETIC_CONFIG.overdriveDuration);
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
      overMax: KINETIC_CONFIG.overdriveDuration,
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
    const gain = KINETIC_CONFIG.runGainPerSec * chargeMult * capFactor * stanceFactor;
    nextCharge = Math.min(100, nextCharge + dt * gain);
    nextGrace = KINETIC_CONFIG.graceDuration;
  } else if (nextGrace > 0) {
    nextGrace = Math.max(0, nextGrace - dt);
  } else {
    nextCharge = Math.max(0, nextCharge - dt * KINETIC_CONFIG.idleDecayPerSec);
  }

  if (nextCharge >= 100) {
    triggered = true;
    nextOver = KINETIC_CONFIG.overdriveDuration;
    nextOverMax = KINETIC_CONFIG.overdriveDuration;
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
