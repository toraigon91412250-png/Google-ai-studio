// Mode catalog, concise weapon specs, and accurate per-mode control references.

export const MODE_GROUPS = [
  {
    id: 'campaign',
    title: 'CAMPAIGN / 本編キャンペーン',
    modes: [
      { id: 'normal', code: 'STD', name: '標準キャンペーン', tag: '6区画 + 突発任務 + 二丁暴走' },
      { id: 'easy', code: 'EASY', name: 'かんたん / 練習付', tag: '操作練習 + 緩やか難度' }
    ]
  },
  {
    id: 'challenge',
    title: 'SPECIAL OPS / チャレンジ作戦',
    modes: [
      { id: 'abyss', code: 'Ψ', name: 'ABYSS PROTOCOL', badge: 'FLAGSHIP', tag: '異界4武器 · 遺物21種 · 全6区画' },
      { id: 'titan', code: 'ODM', name: '進撃 / 巨人討伐', tag: '立体機動 + 雷装討伐' }
    ]
  }
];

export const WEAPON_GUIDE = [
  {
    slot: '1',
    name: 'PULSE / パルス',
    role: '連射・中近距離',
    mag: '50発 (進化100発)',
    spec: '中距離で最大威力。3枚進化で電撃連鎖型または貫通ビーム型へ分岐。Tier 3 二丁持ち基準銃。'
  },
  {
    slot: '2',
    name: 'BREACH / 散弾砲',
    role: '至近距離・押出',
    mag: '10発',
    spec: '密着で高威力＋敵を吹き飛ばして怯ませる。突進敵の迎撃に有効。'
  },
  {
    slot: '3',
    name: 'RAILGUN / レール',
    role: '貫通・長距離',
    mag: '6発',
    spec: '直線上の敵をまとめて貫通。遠距離ほど威力が伸びる。'
  },
  {
    slot: '4',
    name: 'ASTRA × VANTA',
    role: 'チャージ・範囲制圧',
    mag: '24発 (移動補充)',
    spec: '長押し→離しで10発NOVA、24発で最終奥義EXPLOSION。左手展開時は即時エネルギーボルト連射。'
  },
  {
    slot: '5',
    name: 'PHANTOM LANCE',
    role: '精密・弱点狙撃',
    mag: '1発 (コア×2.2)',
    spec: '右クリックで3×/6×照準。左手展開時はスコープ不要で即時連射レーザーを発射。'
  },
  {
    slot: '6',
    name: 'SEEKER / 追尾弾',
    role: '複数ロック・追尾',
    mag: '6発 (最大3体ロック)',
    spec: '0.22秒照準で自動ロック。左手展開時は2発同時追尾ミサイルを即発射。'
  }
];

export const ABYSS_WEAPON_GUIDE = [
  {
    slot: '1',
    name: 'VORTEX SAW / 旋回鋸刃',
    role: '壁反射・貫通',
    mag: '8発 (最大2反射)',
    spec: '回転鋸刃を発射。壁で跳ね返るたび威力+35%、進路上の敵を切り裂き貫通する。'
  },
  {
    slot: '2',
    name: 'CRYO-TESLA / 凍結電弧',
    role: '45%減速・連鎖',
    mag: '22発 (2連鎖)',
    spec: '命中した敵を冷却・減速させ、周囲2体へ電弧連鎖。Tier 3 二丁持ち基準銃。'
  },
  {
    slot: '3',
    name: 'SINGULARITY / 特異点砲',
    role: '重力渦・大爆縮',
    mag: '4発 (1.65s吸引)',
    spec: '着弾地点にブラックホールを生成。周囲の敵を引き寄せ継続ダメージ後に大爆縮する。'
  },
  {
    slot: '4',
    name: 'VOID SCYTHE / 次元斬撃刃',
    role: '斬撃波・弾消滅',
    mag: '6回 (複数命中+6HP)',
    spec: '前方15.5mを凪ぎ払う斬撃波。前面盾を貫通し敵弾も消滅。2体以上命中で耐久回復。'
  }
];

export const MODE_CONTROLS = {
  normal: {
    pc: 'WASD / 矢印 移動 · 左クリック 射撃(Tier3は二丁暴走) · 右クリック 狙撃照準 · SPACE ジャンプ/壁蹴り · 壁近く空中でWALL RUN · SHIFT ダッシュ(GEAR II〜弾反射) · C スライド · G 必殺技 · Q 時間減速(カード解放時) · F 弾捕獲(カード解放時) · 1–6 武器 · R リロード · H 操作一覧 · ESC 一時停止',
    mobile: '左スティック 移動 · 右ドラッグ 照準 · FIRE 射撃(Tier3は二丁暴走) · 壁走り/壁蹴り · DASH(GEAR II〜弾反射) · OVERDRIVE中TAP必殺技 · BREAK/捕獲ボタン(解放時) · JUMP/SLIDE/GUN/リロード'
  },
  easy: {
    pc: 'WASD 移動 · 左クリック 射撃(Tier3は二丁暴走) · 右クリック 狙撃照準 · SPACE ジャンプ/壁蹴り · SHIFT ダッシュ(弾反射) · C スライド · G 必殺技 · Q 時間減速(解放時) · F 弾捕獲(解放時) · 1–6 武器 · R リロード · H 操作一覧 · ESC 一時停止',
    mobile: '左スティック 移動 · 右ドラッグ 照準 · FIRE 射撃 · 壁走り/必殺技/反射ダッシュ対応 · 最初は無敵の操作練習から開始（いつでもスキップ可）'
  },
  abyss: {
    pc: 'WASD / 矢印 移動 · 左クリック 攻撃(Tier3は二丁暴走) · 1–4 異界武器切替 · R リロード · SPACE ジャンプ/壁蹴り · SHIFT ダッシュ(GEAR II〜弾反射) · C スライド · G 必殺技 · Q 時間減速 / F 弾捕獲(遺物解放時) · H 操作一覧 · ESC 一時停止',
    mobile: '左スティック 移動 · 右ドラッグ 照準 · FIRE 攻撃(Tier3は二丁暴走) · 画面下ボタン/GUN で異界4武器 · OVERDRIVE中TAP必殺技 · BREAK/捕獲(遺物解放時)'
  },
  titan: {
    pc: '右クリック長押し 左右ワイヤー · Q/E 単発ワイヤー · SHIFT ガス噴射 · SPACE ジャンプ/浮上 · 左クリック/F 斬撃 · R 雷装 · B 刃交換 · V 視点 · WASD 移動',
    mobile: '左スティック 移動 · 右側スワイプ 照準 · 左/右ワイヤー・ガス・ジャンプ・雷装・斬撃ボタン'
  }
};
