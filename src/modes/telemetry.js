// Run telemetry breakdown and persistent career/medals progression.

export const CAREER_STORAGE_KEY = 'overdrive-career-v1';
export const FRACTURE_STORAGE_KEY = 'overdrive-fracture-intents-v1';
export const FRACTURE_LEGACY_KEY = 'overdrive-fracture-v1';

export const WEAPON_LABELS = [
  '01 / PULSE',
  '02 / BREACH',
  '03 / RAILGUN',
  '04 / ASTRA × VANTA',
  '05 / PHANTOM LANCE',
  '06 / SEEKER',
  'Ω / GENERATED'
];

export const CAREER_MEDALS = [
  { id: 'first_clear', name: '初回制覇', desc: 'いずれかのモードをクリアする' },
  { id: 'speed_runner', name: '電光石火', desc: '3分30秒以内にクリアを達成する' },
  { id: 'boss_slayer', name: '中枢破壊者', desc: 'クリアを累計3回達成する' },
  { id: 'high_scorer', name: 'OVERDRIVE', desc: '1回の出撃でSCORE 12,000以上を獲得' },
  { id: 'fracture_agent', name: '裂け目の観測者', desc: 'X / Ω / Σ のいずれかをクリアする' },
  { id: 'abyss_walker', name: '異界踏破', desc: 'Ψ / ABYSS PROTOCOLをクリアする' },
  { id: 'abyss_overlord', name: '深淵覇者', desc: 'Ψ / ABYSS PROTOCOLを10,000 PTS以上で制覇する' },
  { id: 'veteran_10', name: '百戦錬磨', desc: '合計10回出撃する' }
];

export function formatRunTime(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export class RunTelemetry {
  constructor() {
    this.reset();
  }

  reset() {
    this.totalDamage = 0;
    this.damageTaken = 0;
    this.headshots = 0;
    this.bossHits = 0;
    this.overdrives = 0;
    this.kineticCaptures = 0;
    this.kineticReturns = 0;
    this.streak = 0;
    this.streakTimer = 0;
    this.maxStreak = 0;
    this.weapons = WEAPON_LABELS.map((label, index) => ({
      index,
      label,
      damage: 0,
      kills: 0,
      shots: 0
    }));
  }

  recordShot(weaponIndex) {
    const slot = this.weapons[weaponIndex];
    if (slot) slot.shots += 1;
  }

  recordDamage({ weapon = -1, amount = 0, direct = false, head = false, kill = false, boss = false } = {}) {
    const dmg = Math.max(0, Number(amount) || 0);
    if (dmg > 0) this.totalDamage += dmg;
    if (head) this.headshots += 1;
    if (boss && dmg > 0) this.bossHits += 1;
    const slot = this.weapons[weapon];
    if (slot) {
      slot.damage += dmg;
      if (kill) slot.kills += 1;
    }
    if (kill) {
      this.streak += 1;
      this.streakTimer = 4.5;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;
    }
  }

  recordPlayerDamage(amount = 0) {
    const dmg = Math.max(0, Number(amount) || 0);
    this.damageTaken += dmg;
  }

  recordOverdrive() {
    this.overdrives += 1;
  }

  recordKineticCapture(cells = 1) {
    this.kineticCaptures += Math.max(0, Number(cells) || 0);
  }

  recordKineticReturn(cells = 1) {
    this.kineticReturns += Math.max(0, Number(cells) || 0);
  }

  tick(dt) {
    if (this.streakTimer > 0) {
      this.streakTimer -= Math.max(0, dt || 0);
      if (this.streakTimer <= 0) {
        this.streak = 0;
        this.streakTimer = 0;
      }
    }
  }

  summary({ score = 0, kills = 0, runTime = 0, wave = 1, difficulty = 'normal', win = false, weaponLabels = null } = {}) {
    const labelFor = (w) => (weaponLabels && weaponLabels[w.index]) || w.label;
    const usedWeapons = this.weapons
      .filter((w) => w.damage > 0 || w.kills > 0 || w.shots > 0)
      .sort((a, b) => b.damage - a.damage || b.kills - a.kills);
    const topWeapon = usedWeapons[0] || this.weapons[0];
    return {
      difficulty,
      win: !!win,
      wave,
      score: Math.round(score),
      kills,
      runTime: Math.round(runTime * 10) / 10,
      formattedTime: formatRunTime(runTime),
      totalDamage: Math.round(this.totalDamage),
      damageTaken: Math.round(this.damageTaken),
      headshots: this.headshots,
      overdrives: this.overdrives,
      maxStreak: Math.max(this.maxStreak, kills > 0 ? 1 : 0),
      kineticCaptures: this.kineticCaptures,
      kineticReturns: this.kineticReturns,
      topWeaponIndex: topWeapon.index,
      topWeaponName: labelFor(topWeapon),
      weapons: usedWeapons.slice(0, 4).map((w) => ({
        index: w.index,
        label: labelFor(w),
        damage: Math.round(w.damage),
        kills: w.kills
      }))
    };
  }
}

export function migrateLegacyStorage(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage || typeof storage.getItem !== 'function') return false;
  try {
    const legacy = storage.getItem(FRACTURE_LEGACY_KEY);
    if (legacy && !storage.getItem(FRACTURE_STORAGE_KEY)) {
      storage.setItem(FRACTURE_STORAGE_KEY, legacy);
      return true;
    }
  } catch {
    // Ignore storage access restrictions.
  }
  return false;
}

export function defaultCareer() {
  return {
    runs: 0,
    wins: 0,
    bestScore: 0,
    bestTime: null,
    totalKills: 0,
    totalDamage: 0,
    bestStreak: 0,
    medals: {},
    recentRuns: []
  };
}

export function loadCareer(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const base = defaultCareer();
  if (!storage || typeof storage.getItem !== 'function') return base;
  try {
    const raw = storage.getItem(CAREER_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return {
      ...base,
      ...parsed,
      medals: { ...(parsed?.medals || {}) },
      recentRuns: Array.isArray(parsed?.recentRuns) ? parsed.recentRuns.slice(0, 5) : []
    };
  } catch {
    return base;
  }
}

export function saveCareer(career, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  if (!storage || typeof storage.setItem !== 'function') return;
  try {
    storage.setItem(CAREER_STORAGE_KEY, JSON.stringify(career));
  } catch {
    // Ignore quota errors.
  }
}

export function recordCareerRun(career, runSummary, storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const next = {
    ...defaultCareer(),
    ...career,
    medals: { ...(career?.medals || {}) },
    recentRuns: Array.isArray(career?.recentRuns) ? [...career.recentRuns] : []
  };
  next.runs += 1;
  if (runSummary.win) {
    next.wins += 1;
    if (next.bestTime === null || runSummary.runTime < next.bestTime) {
      next.bestTime = runSummary.runTime;
    }
  }
  next.bestScore = Math.max(next.bestScore, runSummary.score || 0);
  next.totalKills += runSummary.kills || 0;
  next.totalDamage += runSummary.totalDamage || 0;
  next.bestStreak = Math.max(next.bestStreak, runSummary.maxStreak || 0);

  const newlyUnlocked = [];
  const unlock = (id) => {
    if (!next.medals[id]) {
      next.medals[id] = true;
      const spec = CAREER_MEDALS.find((m) => m.id === id);
      if (spec) newlyUnlocked.push(spec);
    }
  };

  if (runSummary.win) unlock('first_clear');
  if (runSummary.win && runSummary.runTime <= 210) unlock('speed_runner');
  if (next.wins >= 3) unlock('boss_slayer');
  if (runSummary.score >= 12000) unlock('high_scorer');
  if (runSummary.win && ['x', 'omega', 'fracture'].includes(runSummary.difficulty)) unlock('fracture_agent');
  if (runSummary.win && runSummary.difficulty === 'abyss') unlock('abyss_walker');
  if (runSummary.win && runSummary.difficulty === 'abyss' && (runSummary.score || 0) >= 10000) unlock('abyss_overlord');
  if (next.runs >= 10) unlock('veteran_10');

  next.recentRuns.unshift({
    difficulty: runSummary.difficulty,
    win: runSummary.win,
    score: runSummary.score,
    kills: runSummary.kills,
    time: runSummary.formattedTime,
    topWeapon: runSummary.topWeaponName
  });
  next.recentRuns = next.recentRuns.slice(0, 5);

  saveCareer(next, storage);
  return { career: next, newlyUnlocked };
}
