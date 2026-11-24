// Pure deterministic director for Sudden Bonus Missions absorbed from Rift Raid into Main & Abyss sectors.

export const SUDDEN_MISSION_SPECS = Object.freeze({
  breach: Object.freeze({
    kind: 'breach',
    title: '緊急破壊指令',
    instruction: '出現した結晶 2基を撃ち壊せ！',
    needed: 2,
    duration: 22,
    label: 'BREACH'
  }),
  relay: Object.freeze({
    kind: 'relay',
    title: '緊急中継占拠',
    instruction: '光る中継点 2か所を各1.2秒キープ！',
    needed: 2,
    duration: 24,
    label: 'RELAY'
  }),
  route: Object.freeze({
    kind: 'route',
    title: '緊急突破ルート',
    instruction: '光るゲート 2個を順に駆け抜けろ！',
    needed: 2,
    duration: 21,
    label: 'ROUTE'
  }),
  hunt: Object.freeze({
    kind: 'hunt',
    title: '緊急標的抹殺',
    instruction: '黄金の標的 2体を優先撃破せよ！',
    needed: 2,
    duration: 24,
    label: 'HUNT'
  })
});

export const SUDDEN_MISSION_KINDS = Object.freeze(['breach', 'relay', 'route', 'hunt']);

export const SUDDEN_MISSION_CONFIG = Object.freeze({
  triggerMinElapsed: 3.5,
  triggerChance: 0.72,
  minWave: 1,
  maxWave: 5,
  relayHoldSeconds: 1.2,
  rewardCharge: 65,
  rewardOverdriveExtend: 3.0,
  rewardHeal: 14,
  rewardScore: 750
});

export class SuddenMissionDirector {
  constructor() {
    this.reset();
  }

  reset() {
    this.active = false;
    this.completed = false;
    this.expired = false;
    this.kind = null;
    this.lastKind = null;
    this.round = 0;
    this.sectorTriggered = 0;
    this.value = 0;
    this.needed = 0;
    this.elapsed = 0;
    this.duration = 22;
    this.hold = 0;
    this.completedCount = 0;
    this.expiredCount = 0;
    return this.snapshot();
  }

  canTrigger({
    wave = 0,
    tutorialActive = false,
    bossActive = false,
    waveElapsed = 0,
    rng = Math.random
  } = {}) {
    if (this.active || tutorialActive || bossActive) return false;
    if (wave < SUDDEN_MISSION_CONFIG.minWave || wave > SUDDEN_MISSION_CONFIG.maxWave) return false;
    if (this.sectorTriggered === wave) return false;
    if (waveElapsed < SUDDEN_MISSION_CONFIG.triggerMinElapsed) return false;
    this.sectorTriggered = wave;
    return rng() <= SUDDEN_MISSION_CONFIG.triggerChance;
  }

  begin({ wave = 1, kind = null, rng = Math.random } = {}) {
    const pool = SUDDEN_MISSION_KINDS.filter((k) => k !== this.lastKind);
    const chosen = SUDDEN_MISSION_SPECS[kind]
      ? kind
      : pool[Math.floor(rng() * pool.length) % pool.length];
    const spec = SUDDEN_MISSION_SPECS[chosen];
    this.kind = chosen;
    this.lastKind = chosen;
    this.round += 1;
    this.sectorTriggered = Math.max(this.sectorTriggered, wave);
    this.active = true;
    this.completed = false;
    this.expired = false;
    this.value = 0;
    this.needed = spec.needed;
    this.elapsed = 0;
    this.duration = spec.duration;
    this.hold = 0;
    return this.snapshot();
  }

  get remaining() {
    return Math.max(0, this.duration - this.elapsed);
  }

  advance(amount = 1) {
    if (!this.active || this.completed || this.expired || !Number.isFinite(amount) || amount <= 0) {
      return null;
    }
    this.value = Math.min(this.needed, this.value + amount);
    this.hold = 0;
    if (this.value < this.needed) {
      return {
        type: 'step',
        kind: this.kind,
        progress: this.value,
        needed: this.needed,
        round: this.round
      };
    }
    this.completed = true;
    this.active = false;
    this.completedCount += 1;
    return {
      type: 'complete',
      kind: this.kind,
      progress: this.value,
      needed: this.needed,
      round: this.round,
      reward: {
        charge: SUDDEN_MISSION_CONFIG.rewardCharge,
        overdriveExtend: SUDDEN_MISSION_CONFIG.rewardOverdriveExtend,
        heal: SUDDEN_MISSION_CONFIG.rewardHeal,
        score: SUDDEN_MISSION_CONFIG.rewardScore
      }
    };
  }

  tick(dt) {
    if (!this.active || this.completed || this.expired || !Number.isFinite(dt) || dt <= 0) {
      return null;
    }
    this.elapsed = Math.min(this.duration, this.elapsed + dt);
    if (this.elapsed < this.duration) return null;
    this.active = false;
    this.expired = true;
    this.hold = 0;
    this.expiredCount += 1;
    return {
      type: 'expired',
      kind: this.kind,
      round: this.round
    };
  }

  snapshot() {
    const spec = SUDDEN_MISSION_SPECS[this.kind] || null;
    return {
      active: this.active,
      completed: this.completed,
      expired: this.expired,
      kind: this.kind,
      title: spec ? spec.title : '',
      label: spec ? spec.label : '',
      instruction: spec ? spec.instruction : '',
      round: this.round,
      sectorTriggered: this.sectorTriggered,
      progress: this.value,
      needed: this.needed,
      elapsed: this.elapsed,
      duration: this.duration,
      remaining: this.remaining,
      hold: this.hold,
      completedCount: this.completedCount,
      expiredCount: this.expiredCount
    };
  }
}
