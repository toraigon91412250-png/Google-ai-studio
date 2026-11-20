// Pure deterministic rules, weapon specs, enemy archetypes, 18 relic cards, and 2-phase boss logic for Ψ / ABYSS PROTOCOL.

export const ABYSS_STORAGE_KEY = 'overdrive-abyss-v1';

export const ABYSS_WEAPONS = [
  {
    id: 'saw',
    slot: 0,
    short: 'SAW',
    name: '01 / VORTEX SAW',
    jpName: '旋回鋸刃ランチャー',
    role: '壁反射・多段斬貫',
    mag: 8,
    rate: 0.34,
    reload: 1.35,
    damage: 58,
    speed: 34,
    bounces: 2,
    bounceBonus: 0.35,
    pierce: 3,
    hitRadius: 0.85,
    life: 2.6,
    color: 0xff5a8a,
    spec: '回転鋸刃を射出。壁で最大2回反射し、反射ごとに威力+35%。進路上の敵を貫通する。'
  },
  {
    id: 'cryo',
    slot: 1,
    short: 'CRYO',
    name: '02 / CRYO-TESLA',
    jpName: '凍結電弧銃',
    role: '減速凍結・連鎖放電',
    mag: 22,
    rate: 0.14,
    reload: 1.25,
    damage: 24,
    range: 36,
    chillDuration: 2.6,
    chillSlow: 0.45,
    chilledBonus: 0.25,
    chainMax: 2,
    chainRange: 9.5,
    chainFactor: 0.65,
    color: 0x6cecff,
    spec: '命中した敵を45%減速させて近くへ2連鎖放電。凍結中の敵には威力+25%、分裂も封じる。'
  },
  {
    id: 'singularity',
    slot: 2,
    short: 'VORTEX',
    name: '03 / SINGULARITY',
    jpName: '特異点榴弾砲',
    role: '重力吸引・爆縮殲滅',
    mag: 4,
    rate: 0.82,
    reload: 1.7,
    damage: 94,
    speed: 24,
    gravity: 16,
    vortexDuration: 1.65,
    vortexRadius: 6.2,
    pullStrength: 11,
    tickDamage: 15,
    color: 0xc07dff,
    spec: '放物線の重力弾を着弾でブラックホール化。周囲の敵を引き寄せて継続ダメージ後に大爆縮。'
  },
  {
    id: 'scythe',
    slot: 3,
    short: 'SCYTHE',
    name: '04 / VOID SCYTHE',
    jpName: '次元斬撃刃',
    role: '広角斬撃・弾消去＋吸収',
    mag: 6,
    rate: 0.42,
    reload: 0.95,
    damage: 80,
    range: 15.5,
    cosHalfAngle: 0.62,
    healOnMulti: 6,
    color: 0xffd166,
    spec: '前方15.5mを凪ぎ払う斬撃波。前面盾を貫通し敵弾を消滅。2体以上同時命中で耐久+6回復。'
  }
];

export const ABYSS_WEAPON_LABELS = ABYSS_WEAPONS.map((w) => w.name);

export const ABYSS_ENEMIES = {
  stalker: {
    id: 'stalker',
    label: 'PHANTOM STALKER / 瞬間転移刺客',
    hp: 76,
    speed: 5.5,
    r: 0.72,
    xp: 15,
    color: 0xe66bff,
    blinkCooldown: 2.8,
    blinkWindup: 0.38,
    blinkDistance: 5.5
  },
  aegis: {
    id: 'aegis',
    label: 'AEGIS BASTION / 前面障壁重装',
    hp: 145,
    speed: 2.55,
    r: 0.96,
    xp: 22,
    color: 0xff9f5a,
    frontShieldCos: 0.35,
    frontShieldScale: 0.35,
    turnRate: 1.85,
    fireCooldown: 2.25
  },
  weaver: {
    id: 'weaver',
    label: 'PRISM WEAVER / 遅延迫撃砲台',
    hp: 86,
    speed: 3.25,
    r: 0.76,
    xp: 18,
    color: 0x76e0ff,
    preferredMin: 14,
    preferredMax: 23,
    mortarCooldown: 2.8,
    mortarDelay: 0.95,
    mortarRadius: 2.8,
    mortarDamage: 18
  },
  splitter: {
    id: 'splitter',
    label: 'SWARM SPLITTER / 分裂核ドローン',
    hp: 68,
    childHp: 30,
    speed: 4.9,
    childSpeed: 6.5,
    r: 0.68,
    childR: 0.45,
    xp: 13,
    childXp: 7,
    color: 0x7eff9f
  },
  architect: {
    id: 'architect',
    label: 'VOID ARCHITECT / 虚空設計機',
    hp: 3800,
    phase2Ratio: 0.55,
    speed: 2.35,
    enragedSpeed: 3.1,
    r: 2.55,
    xp: 120,
    color: 0xff6ad5
  }
};

export const ABYSS_WAVES = [
  ['stalker', 'splitter', 'weaver', 'stalker', 'splitter', 'weaver'],
  ['aegis', 'stalker', 'weaver', 'splitter', 'aegis', 'stalker', 'weaver'],
  ['aegis', 'weaver', 'stalker', 'splitter', 'aegis', 'weaver', 'stalker', 'splitter', 'aegis'],
  ['splitter', 'stalker', 'weaver', 'aegis', 'splitter', 'stalker', 'weaver', 'aegis', 'stalker', 'weaver'],
  ['aegis', 'aegis', 'weaver', 'splitter', 'stalker', 'weaver', 'aegis', 'splitter', 'stalker', 'weaver', 'aegis'],
  ['architect', 'weaver', 'stalker', 'aegis']
];

export const ABYSS_SECTOR_TITLES = [
  'Ψ SECTOR 01 / 異界侵入 — 4種専用武装で迎撃せよ',
  'Ψ SECTOR 02 / 前面障壁出現 — 頭頂コア・側面・大鎌で突破せよ',
  'Ψ SECTOR 03 / 重装守護陣 — 強化先鋒を撃破し遺物を集めよ',
  'Ψ SECTOR 04 / 虚空包囲網 — 重力渦と連鎖凍結で群勢を制圧せよ',
  'Ψ SECTOR 05 / 深淵総力戦 — 決戦前夜・全兵種総動員',
  'Ψ FINAL SECTOR 06 / VOID ARCHITECT 降臨 — 二段階覚醒ボスを討滅せよ'
];

export const ABYSS_UPGRADES = [
  // --- 01 / VORTEX SAW (3 cards) ---
  {
    id: 'abyss_saw',
    tag: 'WEAPON 01 · SAW',
    name: 'RICOCHET OVERDRIVE',
    jpName: '跳弾鋸刃・超旋回',
    target: '01 / VORTEX SAW専用',
    trigger: '壁反射および貫通時',
    detail: '最大反射回数 +2回、反射後のダメージ上昇率 +25%、装弾数 +2。',
    maxLevel: 3
  },
  {
    id: 'abyss_saw_twin',
    tag: 'WEAPON 01 · SAW',
    name: 'TWIN GYRO SPLITTER',
    jpName: '双刃・裂空双鋸',
    target: '01 / VORTEX SAW専用',
    trigger: '鋸刃射撃時',
    detail: '発射数が段階に応じて +1〜2枚の拡散多連鋸刃に増加し、貫通数 +1・判定拡大。',
    maxLevel: 2
  },
  {
    id: 'abyss_saw_bleed',
    tag: 'WEAPON 01 · SAW',
    name: 'REND & STAGGER',
    jpName: '虚空震盪ブレード',
    target: '01 / VORTEX SAW専用',
    trigger: '鋸刃命中時',
    detail: '鋸刃の基礎威力 +22%＋命中した敵を 1.1秒スタン（AEGIS盾も強制解除）。',
    maxLevel: 2
  },
  // --- 02 / CRYO-TESLA (3 cards) ---
  {
    id: 'abyss_cryo',
    tag: 'WEAPON 02 · CRYO',
    name: 'ABSOLUTE ZERO ARC',
    jpName: '絶対零度・多鎖放電',
    target: '02 / CRYO-TESLA専用',
    trigger: '射撃命中時',
    detail: '電弧連鎖数 +2体、連鎖距離 +3m、凍結持続時間 +1.2秒、装弾数 +6。',
    maxLevel: 3
  },
  {
    id: 'abyss_cryo_shatter',
    tag: 'WEAPON 02 · CRYO',
    name: 'GLACIAL SHATTER',
    jpName: '氷華砕破・連鎖炸裂',
    target: '02 / CRYO-TESLA専用',
    trigger: '凍結中の敵を撃破時',
    detail: '撃破地点から半径 5.5m の氷結衝撃波が発生し、周囲に 55〜95 ダメージ＋凍結を拡散。',
    maxLevel: 2
  },
  {
    id: 'abyss_cryo_nova',
    tag: 'WEAPON 02 · CRYO',
    name: 'PERMAFROST RESONANCE',
    jpName: '零度共鳴コンデンサ',
    target: '全武器（対凍結敵）',
    trigger: '凍結中の敵に攻撃',
    detail: '凍結状態の敵への全武器ダメージ +30%/段階、凍結減速効果をさらに強化。',
    maxLevel: 2
  },
  // --- 03 / SINGULARITY (3 cards) ---
  {
    id: 'abyss_vortex',
    tag: 'WEAPON 03 · VORTEX',
    name: 'EVENT HORIZON',
    jpName: '事象地平線拡張',
    target: '03 / SINGULARITY専用',
    trigger: '重力渦の発生中',
    detail: '重力渦の吸引範囲 +35%、吸引力 +40%、爆縮ダメージ +35%、装弾数 +1。',
    maxLevel: 3
  },
  {
    id: 'abyss_vortex_twin',
    tag: 'WEAPON 03 · VORTEX',
    name: 'BINARY COLLAPSE',
    jpName: '連星特異点・弾幕消滅',
    target: '03 / SINGULARITY専用',
    trigger: '重力渦の持続・爆縮時',
    detail: '重力渦の持続時間 +0.55秒・継続ダメ +50%。渦が敵弾を吸い込み消滅させる。',
    maxLevel: 2
  },
  {
    id: 'abyss_vortex_leech',
    tag: 'WEAPON 03 · VORTEX',
    name: 'GRAVITY SIPHON',
    jpName: '虚空引力還元',
    target: '03 / SINGULARITY専用',
    trigger: '爆縮命中時',
    detail: '爆縮が敵1体に命中するたび耐久 +5回復（最大+18）＆ KINETIC CHARGE +12%。',
    maxLevel: 2
  },
  // --- 04 / VOID SCYTHE (3 cards) ---
  {
    id: 'abyss_scythe',
    tag: 'WEAPON 04 · SCYTHE',
    name: 'CRIMSON CRESCENT',
    jpName: '紅蓮三日月・血晶',
    target: '04 / VOID SCYTHE専用',
    trigger: '斬撃波で2体以上命中',
    detail: '斬撃射程 +25%、斬撃幅拡大、複数命中時回復 +4、装弾数 +2。',
    maxLevel: 3
  },
  {
    id: 'abyss_scythe_wave',
    tag: 'WEAPON 04 · SCYTHE',
    name: 'DIMENSION SLASH WAVE',
    jpName: '次元裂傷・追撃斬波',
    target: '04 / VOID SCYTHE専用',
    trigger: '大鎌の斬撃時',
    detail: '遠距離まで飛ぶ貫通三日月斬撃波（射程30m）を追加射出し、盾も貫通して斬り裂く。',
    maxLevel: 2
  },
  {
    id: 'abyss_scythe_parry',
    tag: 'WEAPON 04 · SCYTHE',
    name: 'BULLET RETRIBUTION',
    jpName: '断罪・弾丸反射斬',
    target: '04 / VOID SCYTHE専用',
    trigger: '斬撃で敵弾を消去時',
    detail: '消した敵弾の数だけ自動追尾レーザーで反撃し、1.8秒間 全与ダメージ +30%/段階。',
    maxLevel: 2
  },
  // --- CORE / SYNERGY / SURVIVAL / APEX (6 cards) ---
  {
    id: 'abyss_overclock',
    tag: 'ABYSS CORE',
    name: 'VOID CAPACITOR',
    jpName: '異界並列装填',
    target: '異界4武器すべて',
    trigger: '常時効果',
    detail: '全武器の発射速度 +16%、リロード時間 -20%、OVERDRIVE蓄積 +25%。',
    maxLevel: 3
  },
  {
    id: 'abyss_executioner',
    tag: 'ABYSS CORE',
    name: 'EXECUTIONER PROTOCOL',
    jpName: '処刑者プロトコル',
    target: '全武器・撃破連携',
    trigger: '敵を撃破時',
    detail: '撃破するたび他の3武器へ弾薬 +35%/段階を自動補充し、3秒間 与ダメージ +22%。',
    maxLevel: 2
  },
  {
    id: 'abyss_resonance',
    tag: 'SYNERGY CORE',
    name: 'PRISMATIC SWAP',
    jpName: '異界属性共鳴',
    target: '武器切替コンボ',
    trigger: '別の武器に切替後 2.5秒間',
    detail: '武器切替直後の攻撃威力が +40%/段階 上昇し、クールダウンを短縮。',
    maxLevel: 2
  },
  {
    id: 'abyss_vital',
    tag: 'SURVIVAL',
    name: 'ABYSSAL CARAPACE',
    jpName: '虚空外殻強化',
    target: '機体フレーム',
    trigger: '取得時・常時',
    detail: '最大耐久 +30、耐久 +45即時回復、移動速度 +8%。',
    maxLevel: 3
  },
  {
    id: 'abyss_aegis_step',
    tag: 'MOBILITY',
    name: 'PHASE BLINK SURGE',
    jpName: '瞬閃ブリンク衝波',
    target: 'ダッシュ機動',
    trigger: 'SHIFT ダッシュ時',
    detail: 'ダッシュクールダウン -26%・無敵延長。周囲6mの敵弾を消滅させ敵をスタン。',
    maxLevel: 2
  },
  {
    id: 'abyss_immortal_core',
    tag: 'APEX RELIC',
    name: 'SOVEREIGN UNDYING',
    jpName: '深淵覇王コア',
    target: '固有オーグメント（最大1）',
    trigger: '致死ダメージ時・常時',
    detail: '常時全ダメージ +20%。戦闘中1回だけ致死攻撃を耐久35%+2.5s無敵+周囲大爆破で耐える。',
    maxLevel: 1
  }
];

export function abyssMagSize(slot, up = {}) {
  const w = ABYSS_WEAPONS[slot] || ABYSS_WEAPONS[0];
  let mag = w.mag;
  if (slot === 0 && up.abyss_saw) mag += 2 * up.abyss_saw;
  if (slot === 1 && up.abyss_cryo) mag += 6 * up.abyss_cryo;
  if (slot === 2 && up.abyss_vortex) mag += 1 * up.abyss_vortex;
  if (slot === 3 && up.abyss_scythe) mag += 2 * up.abyss_scythe;
  return mag;
}

export function abyssReloadDuration(slot, up = {}) {
  const w = ABYSS_WEAPONS[slot] || ABYSS_WEAPONS[0];
  const mult = Math.pow(0.8, up.abyss_overclock || 0);
  return Math.max(0.42, w.reload * mult);
}

export function abyssFireRate(slot, up = {}, overActive = false) {
  const w = ABYSS_WEAPONS[slot] || ABYSS_WEAPONS[0];
  const overMult = overActive ? 0.68 : 1;
  const clockMult = Math.pow(0.84, up.abyss_overclock || 0);
  return Math.max(0.065, w.rate * overMult * clockMult);
}

export function computeSawDamage(baseDamage, bouncesDone = 0, sawLevel = 0, bleedLevel = 0) {
  const perBounce = ABYSS_WEAPONS[0].bounceBonus + sawLevel * 0.25;
  return baseDamage * (1 + bleedLevel * 0.22) * (1 + Math.max(0, bouncesDone) * perBounce);
}

export function computeSawSpreadAngles(twinLevel = 0) {
  if (twinLevel >= 2) return [-0.11, 0, 0.11];
  if (twinLevel === 1) return [-0.065, 0.065];
  return [0];
}

export function computeAbyssPlayerDamageMult(up = {}, { overActive = false, chilledTarget = false, swapBuff = false, parryBuff = false, execBuff = false } = {}) {
  let mult = overActive ? 1.35 : 1;
  if (up.abyss_immortal_core) mult *= 1.2;
  if (chilledTarget && up.abyss_cryo_nova) mult *= 1 + 0.3 * up.abyss_cryo_nova;
  if (swapBuff && up.abyss_resonance) mult *= 1 + 0.4 * up.abyss_resonance;
  if (parryBuff && up.abyss_scythe_parry) mult *= 1 + 0.3 * up.abyss_scythe_parry;
  if (execBuff && up.abyss_executioner) mult *= 1.22;
  return mult;
}

export function evaluateAegisDamage(baseDamage, { frontDot = 0, isHead = false, isScythe = false, isVortex = false, stunned = false } = {}) {
  if (isHead || isScythe || isVortex || stunned) {
    return { damage: baseDamage * (isHead ? 1.55 : 1), blockedByShield: false };
  }
  if (frontDot > ABYSS_ENEMIES.aegis.frontShieldCos) {
    return {
      damage: baseDamage * ABYSS_ENEMIES.aegis.frontShieldScale,
      blockedByShield: true
    };
  }
  return { damage: baseDamage, blockedByShield: false };
}

export function shouldSplitterDivide({ isChild = false, weaponIndex = -1, chilled = false } = {}) {
  if (isChild) return false;
  if (chilled) return false;
  // VOID SCYTHE (3) and SINGULARITY (2) cleanly annihilate the nucleus without mitosis.
  if (weaponIndex === 2 || weaponIndex === 3) return false;
  return true;
}

export function stepVortexPull(enemyPos, vortexCenter, radius, pullStrength, dt) {
  const dx = vortexCenter.x - enemyPos.x;
  const dz = vortexCenter.z - enemyPos.z;
  const dist = Math.hypot(dx, dz);
  if (dist <= 0.25 || dist > radius) return { dx: 0, dz: 0, dist };
  const falloff = 1 - (dist / radius) * 0.45;
  const step = Math.min(dist - 0.2, pullStrength * falloff * dt);
  return {
    dx: (dx / dist) * step,
    dz: (dz / dist) * step,
    dist
  };
}

export function evaluateScytheCone(origin, forward, targetPos, range, cosHalfAngle = ABYSS_WEAPONS[3].cosHalfAngle) {
  const dx = targetPos.x - origin.x;
  const dy = (targetPos.y ?? origin.y) - origin.y;
  const dz = targetPos.z - origin.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > range || dist < 1e-6) return { inCone: dist <= 1.2, dist, dot: 1 };
  const dot = (dx * forward.x + dy * forward.y + dz * forward.z) / dist;
  return {
    inCone: dot >= cosHalfAngle || dist <= 2.1,
    dist,
    dot
  };
}

export function createArchitectState() {
  return {
    cycleIndex: 0,
    phase: 'spiral', // 'spiral' -> 'mortars' -> 'pulse' -> 'laser' -> 'exposed'
    enraged: false,
    timer: 1.05,
    spiralAngle: 0,
    spiralShots: 0
  };
}

export function advanceArchitectCycle(bossState, dt, hpRatio = 1) {
  const events = [];
  if (!bossState.enraged && hpRatio <= ABYSS_ENEMIES.architect.phase2Ratio) {
    bossState.enraged = true;
    bossState.phase = 'spiral';
    bossState.spiralShots = 0;
    bossState.timer = 0.35;
    events.push({ type: 'awaken', radius: 18, damage: 22 });
    return events;
  }

  const pace = bossState.enraged ? 1.28 : 1;
  bossState.timer -= dt * pace;

  if (bossState.phase === 'spiral') {
    const burstTarget = bossState.enraged ? 4 : 3;
    while (bossState.timer <= 0 && bossState.spiralShots < burstTarget) {
      bossState.spiralShots += 1;
      bossState.spiralAngle += bossState.enraged ? 0.34 : 0.42;
      events.push({
        type: 'spiral',
        angleOffset: bossState.spiralAngle,
        count: bossState.enraged ? 12 : 9,
        speed: bossState.enraged ? 15.2 : 13.5,
        counterRing: bossState.enraged
      });
      bossState.timer += 0.52;
    }
    if (bossState.spiralShots >= burstTarget && bossState.timer <= 0) {
      bossState.phase = 'mortars';
      bossState.timer = 1.05;
      events.push({
        type: 'mortars',
        count: bossState.enraged ? 6 : 4,
        delay: bossState.enraged ? 0.92 : 1.05,
        radius: bossState.enraged ? 3.3 : 3.0,
        damage: bossState.enraged ? 26 : 22
      });
    }
  } else if (bossState.phase === 'mortars') {
    if (bossState.timer <= 0) {
      bossState.phase = 'pulse';
      bossState.timer = 1.15;
      events.push({
        type: 'gravity_pulse',
        strength: bossState.enraged ? 8.5 : 6.8,
        shockwave: true,
        damage: bossState.enraged ? 26 : 20
      });
    }
  } else if (bossState.phase === 'pulse') {
    if (bossState.timer <= 0) {
      bossState.phase = 'laser';
      bossState.timer = bossState.enraged ? 1.45 : 1.25;
      events.push({
        type: 'laser_sweep',
        delay: bossState.enraged ? 0.78 : 0.88,
        damage: bossState.enraged ? 30 : 24,
        twin: bossState.enraged
      });
    }
  } else if (bossState.phase === 'laser') {
    if (bossState.timer <= 0) {
      bossState.phase = 'exposed';
      bossState.timer = bossState.enraged ? 2.25 : 2.55;
      events.push({
        type: 'exposed',
        duration: bossState.timer,
        summon: bossState.enraged ? ['stalker', 'splitter'] : ['stalker']
      });
    }
  } else if (bossState.phase === 'exposed') {
    if (bossState.timer <= 0) {
      bossState.cycleIndex += 1;
      bossState.phase = 'spiral';
      bossState.spiralShots = 0;
      bossState.timer = 0.45;
    }
  }
  return events;
}

export function pickAbyssUpgrades(up = {}, rng = Math.random, count = 4) {
  const available = ABYSS_UPGRADES.filter((u) => (up[u.id] || 0) < u.maxLevel);
  const pool = [...available];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
