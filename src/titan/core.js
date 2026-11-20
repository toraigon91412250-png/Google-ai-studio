import * as THREE from 'three';
import { detectSoftwareGl } from '../perf.js';
(() => {
  const {
    Scene: va, Color: Ht, FogExp2: xa, WebGLRenderer: _a, SRGBColorSpace: Xe,
    ACESFilmicToneMapping: _l, PCFSoftShadowMap: gl, PerspectiveCamera: ke,
    HemisphereLight: Na, DirectionalLight: lr, MeshStandardMaterial: cr,
    SphereGeometry: pn, ShaderMaterial: nn, BackSide: Fe, Mesh: Ce,
    BoxGeometry: Ci, CylinderGeometry: Wn, PlaneGeometry: _s, GridHelper: Fa,
    TorusGeometry: hi, Texture: je, BufferGeometry: Se, Float32BufferAttribute: te,
    InstancedMesh: li, DoubleSide: un, Matrix4: ee, Quaternion: fn, Vector3: T,
    ConeGeometry: vs, MeshBasicMaterial: ci, Group: Me, TubeGeometry: La,
    CatmullRomCurve3: nr, BufferAttribute: Ie, Raycaster: hr, Line: xs,
    LineBasicMaterial: Ii, Points: ba, PointsMaterial: tr, AdditiveBlending: sa
  } = THREE;
  const _titanSoftwareGl = detectSoftwareGl().software;
  var ut = (i) => document.querySelector(i), Ze = matchMedia("(pointer:coarse)").matches || innerWidth < 760, Dt = new va();
  Dt.background = new Ht(9217712);
  Dt.fog = new xa(10269109, 17e-4);
  var Ee = new _a({ antialias: !_titanSoftwareGl, powerPreference: "high-performance" });
  Ee.setPixelRatio(_titanSoftwareGl ? 1 : Math.min(devicePixelRatio, Ze ? 0.9 : 1));
  Ee.setSize(innerWidth, innerHeight);
  Ee.outputColorSpace = Xe;
  Ee.toneMapping = _l;
  Ee.toneMappingExposure = 1.34;
  Ee.shadowMap.enabled = false;
  Ee.shadowMap.type = gl;
  document.body.prepend(Ee.domElement);
  var qe = new ke(Ze ? 80 : 76, innerWidth / innerHeight, 0.045, 1250);
  qe.rotation.order = "YXZ";
  Dt.add(qe);
  Dt.add(new Na(14478064, 6318942, 2.05));
  var An = new lr(16769713, 2.55);
  An.position.set(-130, 230, -175);
  An.castShadow = false;
  An.shadow.mapSize.set(1024, 1024);
  An.shadow.camera.left = -110;
  An.shadow.camera.right = 110;
  An.shadow.camera.top = 110;
  An.shadow.camera.bottom = -110;
  An.shadow.bias = -13e-5;
  Dt.add(An);
  var $u = new lr(9288129, 0.65);
  $u.position.set(-65, 90, 140);
  Dt.add($u);
  var $t = (i, t = 0, e = 0.8, n = 0, s = 0) => new cr({ color: i, metalness: t, roughness: e, emissive: n, emissiveIntensity: s }), ot = { dark: $t(1713454, 0.67, 0.36), black: $t(1120025, 0.72, 0.29), iron: $t(4609635, 0.8, 0.29), steel: $t(12638168, 0.91, 0.23), edge: $t(15333100, 0.76, 0.19), bronze: $t(9992026, 0.8, 0.31), brass: $t(13544319, 0.72, 0.35), leather: $t(4732974, 0.04, 0.93), strap: $t(2367261, 0.02, 0.96), cloth: $t(5465690, 0, 1), shirt: $t(13091494, 0, 0.95), skin: $t(12029299, 0, 0.87), hair: $t(2301470, 0.05, 0.84), blade: $t(12373455, 0.91, 0.2), neon: $t(8186348, 0.12, 0.2, 4316400, 1.8), orange: $t(15968353, 0.3, 0.31, 16750394, 1.9) }, j_ = new pn(800, 32, 16), tx = new nn({ side: Fe, depthWrite: false, vertexShader: "varying vec3 vPos; void main(){vPos=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}", fragmentShader: "varying vec3 vPos; void main(){float h=normalize(vPos).y; vec3 night=vec3(.17,.28,.36); vec3 horizon=vec3(.78,.78,.69); vec3 zenith=vec3(.35,.58,.73); vec3 c=mix(horizon,zenith,smoothstep(-.12,.58,h)); float sun=pow(max(0.,dot(normalize(vPos),normalize(vec3(-.5,.65,-.6)))),150.); c+=vec3(1.,.66,.29)*sun*.72; gl_FragColor=vec4(c,1.);}" });
  Dt.add(new Ce(j_, tx));
  var Ds = new Ci(1, 1, 1), ex = new Wn(1, 1, 1, 12), Fx = new pn(1, 12, 8);
  function he(i, t, e, n, s, r) {
    let a = new Ce(t, e);
    return n && a.position.set(...n), s && a.scale.set(...s), r && a.rotation.set(...r), a.castShadow = false, a.receiveShadow = false, i.add(a), a;
  }
  function Ut(i, t, e, n, s) {
    return he(i, Ds, t, e, n, s);
  }
  function Oe(i, t, e, n, s, r = 0, a = 12) {
    let o = he(i, new Wn(n, n, s, a), t, e);
    return r === 1 && (o.rotation.z = Math.PI / 2), r === 2 && (o.rotation.x = Math.PI / 2), o;
  }
  var Cl = 384929, ge = () => (Cl = Math.imul(Cl, 1664525) + 1013904223 | 0, (Cl >>> 0) / 4294967296), Ku = [], ki = [], Dl = [[], []], Xa = [], Qu = [], Ul = [], nx = $t(6003373, 0.25, 0.3, 3234666, 0.11), As = [10263952, 10260867, 7831421, 11706765, 9213072, 11182740, 8358795].map((i) => $t(i, 0.12, 0.83)), ju = $t(4673107, 0.13, 0.91), td = $t(6578004, 0.22, 0.86), ix = $t(5860187, 0.04, 0.98), ed = he(Dt, new _s(2200, 2200), ix, [0, -0.06, 0]);
  ed.rotation.x = -Math.PI / 2;
  ed.receiveShadow = true;
  var $a = new Fa(1080, 72, 6517610, 5465948);
  $a.position.y = 0.015;
  $a.material.transparent = true;
  $a.material.opacity = 0.08;
  Dt.add($a);
  function sx(i, t, e, n, s, r, bottom = 0) {
    Ku.push({ x: t, z: e, hx: n / 2, hz: s / 2, h: r, top: r, bottom, mesh: i }); if(!ki.includes(i))ki.push(i);
  }
  function sxCylinder(mesh,x,z,radius,top,bottom=0,radiusTop=radius){
    sx(mesh,x,z,radius*2,radius*2,top,bottom);
    Ku[Ku.length-1].radius=radius;Ku[Ku.length-1].radiusTop=radiusTop;
  }
  function nd(i, t, e, n, s, r = false) {
    let a = r && s > 40, o = he(Dt, Ds, As[Math.floor(ge() * As.length)], [i, s / 2, t], [e, s, n]);
    if (o.receiveShadow = !Ze && Math.abs(i) < 84 && Math.abs(t) < 84, o.castShadow = !Ze && Math.abs(i) < 84 && Math.abs(t) < 84, sx(o, i, t, e, n, s), a) Ut(Dt, ju, [i, s + 0.23, t], [e + 0.4, 0.48, n + 0.4]);
    else {
      let h = 2.5 + e * 0.16;
      Ku[Ku.length - 1].roofHeight = h + 0.16;
      Xa.push([i, s, t, e + 1.2, h, n + 1.2, ge()]), ge() > 0.34 && Qu.push([i + (ge() - 0.5) * e * 0.5, s + h * 0.48, t + (ge() - 0.5) * n * 0.35]);
    }
    s > 16 && Ut(Dt, td, [i, s - 0.36, t], [e + 0.16, 0.19, n + 0.16]);
    for (let h = 3.4; h < s - 1; h += 5.3) Ul.push([i - e / 2 - 0.045, h, t, 0.13, 0.13, n + 0.14]), Ul.push([i + e / 2 + 0.045, h, t, 0.13, 0.13, n + 0.14]);
    let c = ge() > 0.39, l = Math.min(17, Math.floor(s / 4.7));
    for (let h = 0; h < 2; h++) for (let d = 0; d < l; d++) {
      let u = 2.7 + d * 4.7;
      if (u > s - 1.5) break;
      if (h === 0) for (let p = -1; p <= 1; p++) Dl[c ? 0 : 1].push([i + e / 4 * p, u, t + n / 2 + 0.027, e * 0.14, 1.25, 0.065]);
      else for (let p = -1; p <= 1; p++) Dl[c ? 0 : 1].push([i + e / 2 + 0.027, u, t + n / 4 * p, 0.065, 1.25, n * 0.15]);
    }
    if (r) {
      let h = he(Dt, new hi(e * 0.28, 0.12, 7, 32), ot.neon, [i, s + 0.65, t]);
      h.rotation.x = Math.PI / 2, h.userData.spin = true;
    }
    return o;
  }
  const legacyTownStart = new Set(Dt.children);
  for (let i = -8; i <= 8; i++) for (let t = -8; t <= 8; t++) {
    let e = i * 32 + (ge() - 0.5) * 3.2, n = t * 32 + (ge() - 0.5) * 3.2;
    if (Math.abs(e) < 92 && n > -110 && n < 180 || Math.abs(i) <= 2 && Math.abs(t) <= 3 || Math.hypot(e - 220, n + 180) < 50 || ge() < 0.65) continue;
    let s = 12 + Math.floor(ge() * 5) * 5 + ge() * 6, r = 11 + ge() * 5, a = 11 + ge() * 5;
    nd(e, n, r, a, s, ge() > 0.92);
  }
  let _citySeed = Cl;
  Cl = 14893721;
  for (let i = -16; i <= 16; i++) for (let t = -16; t <= 16; t++) {
    if (Math.abs(i) <= 8 && Math.abs(t) <= 8) continue;
    let e = i * 32 + (ge() - 0.5) * 3.2, n = t * 32 + (ge() - 0.5) * 3.2;
    if (Math.hypot(e - 220, n + 180) < 52 || ge() < 0.92) continue;
    let s = 12 + Math.floor(ge() * 5) * 5 + ge() * 6, r = 11 + ge() * 5, a = 11 + ge() * 5, cityBlock = nd(e, n, r, a, s, ge() > 0.98);
    cityBlock.userData.cityOnly = true;
  }
  Cl = _citySeed;
  var raidDistrict = [];
  for (let side of [-1, 1]) for (let row = 0; row < 9; row++) {
    let z = -82 + row * 26, x = side * (z >= 86 || z <= -56 ? 38 : 64), height = 14 + row % 4 * 2.1;
    let house = nd(x, z, 17, 19, height);
    house.name = "raid-district-house";
    house.userData.cityOnly = true;
    raidDistrict.push(house);
  }
  for (let x of [-40, -16, 16, 40]) {
    let house = nd(x, -108, 18, 19, 17 + Math.abs(x) % 3);
    house.name = "raid-district-house";
    house.userData.cityOnly = true;
    raidDistrict.push(house);
  }
  function raidMasonry(kind) {
    let canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = kind === "roof" ? "#514036" : "#635f53";
    ctx.fillRect(0, 0, 256, 256);
    let height = kind === "roof" ? 16 : 32, width = kind === "roof" ? 32 : 64;
    for (let row = 0; row < 256 / height; row++) for (let col = -1; col < 256 / width + 1; col++) {
      let shade = kind === "roof" ? 120 + (row * 17 + col * 13) % 24 : 153 + (row * 11 + col * 7) % 20;
      ctx.fillStyle = kind === "roof" ? `rgb(${shade},${Math.round(shade * 0.58)},${Math.round(shade * 0.4)})` : `rgb(${shade},${shade - 6},${shade - 18})`;
      ctx.fillRect(col * width + row % 2 * width / 2 + 1, row * height + 1, width - 2, height - 2);
    }
    let texture = new je(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = Xe;
    texture.wrapS = texture.wrapT = 1e3;
    return texture;
  }
  var raidStoneTexture = raidMasonry("stone"), raidRoofTexture = raidMasonry("roof");
  var raidHouseMaterial = $t(14142390, 0.02, 0.96);
  raidHouseMaterial.map = raidStoneTexture;
  for (let house of raidDistrict) house.material = raidHouseMaterial;
  var raidPavingTexture = raidStoneTexture.clone();
  raidPavingTexture.repeat.set(8, 18);
  raidPavingTexture.needsUpdate = true;
  var raidPavingMaterial = $t(11971989, 0.01, 0.98);
  raidPavingMaterial.map = raidPavingTexture;
  var raidRoad = he(Dt, new _s(60, 250), raidPavingMaterial, [0, -0.018, 25]);
  raidRoad.rotation.x = -Math.PI / 2;
  raidRoad.name = "raid-stone-avenue";
  raidRoad.userData.cityOnly = true;
  var raidPlaza = he(Dt, new _s(106, 104), raidPavingMaterial, [0, -0.012, 18]);
  raidPlaza.rotation.x = -Math.PI / 2;
  raidPlaza.name = "raid-titan-plaza";
  raidPlaza.userData.cityOnly = true;
  function rx() {
    let i = [[-0.5, 0, -0.5], [0.5, 0, -0.5], [0, 1, -0.5], [-0.5, 0, 0.5], [0.5, 0, 0.5], [0, 1, 0.5]], t = [[0, 1, 2], [3, 5, 4], [0, 2, 5], [0, 5, 3], [1, 4, 5], [1, 5, 2], [0, 3, 4], [0, 4, 1]], e = [];
    for (let s of t) for (let r of s) e.push(...i[r]);
    let n = new Se();
    return n.setAttribute("position", new te(e, 3)), n.computeVertexNormals(), n;
  }
  var zi = new li(rx(), new cr({ color: 16777215, roughness: 0.93, side: un }), Xa.length), di = new ee(), qa = new fn(), Wu = [11760209, 9851451, 12548435, 10707270, 12419163, 9328963];
  for (let i = 0; i < Xa.length; i++) {
    let [t, e, n, s, r, a, o] = Xa[i];
    di.compose(new T(t, e + 0.16, n), qa, new T(s, r, a)), zi.setMatrixAt(i, di), zi.setColorAt(i, new Ht(Wu[Math.floor(o * Wu.length)]));
  }
  zi.material.map = raidRoofTexture;
  zi.instanceMatrix.needsUpdate = true;
  zi.instanceColor.needsUpdate = true;
  zi.frustumCulled = false;
  Dt.add(zi);
  ki.push(zi);
  function zl(i, t) {
    let e = new li(Ds, t, i.length);
    return i.forEach((n, s) => {
      di.compose(new T(n[0], n[1], n[2]), qa, new T(n[3], n[4], n[5])), e.setMatrixAt(s, di);
    }), e.instanceMatrix.needsUpdate = true, e.frustumCulled = false, Dt.add(e), e;
  }
  zl(Qu.map((i) => [i[0], i[1] + 0.85, i[2], 0.95, 2.1, 0.85]), $t(7301989, 0.08, 0.96));
  zl(Ul, $t(5788750, 0.08, 0.92));
  for (let [i, t] of [[-33, 23], [44, -42], [-88, 45], [84, 68]]) {
    const bridge=Ut(Dt, td, [i, 14, t], [13, 1.6, 3.2]);bridge.name="raid-roof-bridge";sx(bridge,i,t,13,3.2,14.8,13.2);
    for (let e of [-1, 1]) Ut(Dt, ot.leather, [i + e * 6, 15.4, t], [0.45, 1.9, 3.6]);
  }
  var legacyTownParts = Dt.children.filter(object=>!legacyTownStart.has(object));
  for(const object of legacyTownParts)object.userData.legacyTown=true;
  var shiganshinaCity = null;
  var fr = [];
  for (let i = 0; i < 125; i++) {
    let t = ge() * Math.PI * 2, e = 202 + ge() * 47, n = Math.cos(t) * e, s = Math.sin(t) * e, r = 21 + ge() * 42;
    fr.push({ x: n, z: s, height: r, r: 1.2 + ge() * 1.9 });
  }
  var ax = $t(5851704, 0.07, 0.94), ox = $t(3103311, 0.02, 0.95), _r = new li(new Wn(0.64, 0.83, 1, 8), ax, fr.length), xr = new li(new vs(1, 1, 8), ox, fr.length);
  for (let i = 0; i < fr.length; i++) {
    let t = fr[i];
    di.compose(new T(t.x, t.height * 0.48, t.z), qa, new T(t.r, t.height * 0.96, t.r)), _r.setMatrixAt(i, di), di.compose(new T(t.x, t.height * 0.83, t.z), qa, new T(t.r * 4.7, t.height * 0.72, t.r * 4.7)), xr.setMatrixAt(i, di);
  }
  _r.instanceMatrix.needsUpdate = true;
  xr.instanceMatrix.needsUpdate = true;
  _r.frustumCulled = false;
  xr.frustumCulled = false;
  Dt.add(_r, xr);
  _r.name="raid-tree-trunks";ki.push(_r, xr);for(const tree of fr)sxCylinder(_r,tree.x,tree.z,tree.r*.83,tree.height*.96,0,tree.r*.64);
  var cityLegacyWallParts = [], cityOuterWalls = [], cityTowerParts = [], Nl = [], battlefieldSupport = null;
  for (let i = -26; i <= 26; i++) for (let t of [-1, 1]) Nl.push([i * 10.35, 86, t * 270, 5, 7, 8]), Nl.push([t * 270, 86, i * 10.35, 8, 7, 5]);
  const wallCrenels=zl(Nl, $t(8949898, 0.07, 0.9));wallCrenels.userData.cityLegacyWall=true;cityLegacyWallParts.push(wallCrenels);for(const [x,y,z,w,h,d] of Nl)sx(wallCrenels,x,z,w,d,y+h/2,y-h/2);
  function addLegacyWall(i) {
    return i.userData.cityLegacyWall = true, cityLegacyWallParts.push(i), i;
  }
  for (let [i, t] of [[-264, -264], [264, -264], [-264, 264], [264, 264]]) {
    const shaft=addLegacyWall(Oe(Dt, As[1], [i, 48, t], 11, 95, 0, 12)),cap=addLegacyWall(Oe(Dt, ju, [i, 99, t], 12, 5, 0, 12));sxCylinder(shaft,i,t,11,95.5,.5);sxCylinder(cap,i,t,12,101.5,96.5);
    for (let e = 0; e < 10; e++) {
      let n = e * Math.PI * 2 / 10;
      addLegacyWall(Ut(Dt, As[0], [i + Math.cos(n) * 10, 103, t + Math.sin(n) * 10], [5, 6, 5]));
    }
  }
  var cx = [];
  for (let i = 0; i < 22; i++) {
    let t = he(Dt, new pn(1, 8, 5), new ci({ color: 16118235, transparent: true, opacity: 0.1, depthWrite: false }), [(ge() - 0.5) * 760, 145 + ge() * 90, (ge() - 0.5) * 760], [18 + ge() * 28, 3.5 + ge() * 4, 8 + ge() * 10]);
    cx.push(t);
  }
  for (let i = -5; i <= 5; i++) for (let t of [-1, 1]) {
    let e = i * 51.5, n = he(Dt, Ds, As[0], [e, 41, t * 270], [51.7, 82, 12]);
    addLegacyWall(n);sx(n,n.position.x,n.position.z,n.scale.x,n.scale.z,82);n.name="raid-legacy-wall";
  }
  for (let i = -5; i <= 5; i++) for (let t of [-1, 1]) {
    let e = i * 51.5, n = he(Dt, Ds, As[1], [t * 270, 41, e], [12, 82, 51.7]);
    addLegacyWall(n);sx(n,n.position.x,n.position.z,n.scale.x,n.scale.z,82);n.name="raid-legacy-wall";
  }
  for (let i = -10; i <= 10; i++) for (let t of [-1, 1]) {
    let e = i * 51.5, n = he(Dt, Ds, As[0], [e, 41, t * 550], [51.7, 82, 12]), r = he(Dt, Ds, As[1], [t * 550, 41, e], [12, 82, 51.7]);
    n.userData.cityOnly = true, r.userData.cityOnly = true; n.name=r.name="raid-city-wall"; sx(n,n.position.x,n.position.z,n.scale.x,n.scale.z,82);sx(r,r.position.x,r.position.z,r.scale.x,r.scale.z,82);cityOuterWalls.push(n,r);
  }
  const southGatePanelIndex=cityOuterWalls.findIndex(panel=>Math.abs(panel.position.x)<.01&&panel.position.z>0&&Math.abs(panel.position.z-550)<.01);
  if(southGatePanelIndex>=0){const southGatePanel=cityOuterWalls.splice(southGatePanelIndex,1)[0],colliderIndex=Ku.findIndex(box=>box.mesh===southGatePanel),anchorIndex=ki.indexOf(southGatePanel);if(colliderIndex>=0)Ku.splice(colliderIndex,1);if(anchorIndex>=0)ki.splice(anchorIndex,1);southGatePanel.visible=false;southGatePanel.removeFromParent();}
  for (let [i, t] of [[-540, -540], [540, -540], [-540, 540], [540, 540]]) {
    let e = Oe(Dt, As[1], [i, 49, t], 10, 98, 0, 12), n = Oe(Dt, ju, [i, 100, t], 11, 5, 0, 12);
    e.userData.cityOnly = true, n.userData.cityOnly = true;e.name=n.name="raid-city-corner-tower";sxCylinder(e,i,t,10,98);sxCylinder(n,i,t,11,102.5,97.5);cityOuterWalls.push(e,n);
  }
  function towerPiece(i, t, e, n, r) {
    let a = he(Dt, i, t, e, n, r);
    return a.userData.cityOnly = true, cityTowerParts.push(a), a;
  }
  var towerStone = $t(12173523, 0.08, 0.88), towerTrim = $t(14405596, 0.12, 0.8), towerRoof = $t(3025701, 0.49, 0.64), towerWindow = $t(1644825, 0.18, 0.36), towerFace = $t(15130343, 0.1, 0.82), towerGold = $t(13805782, 0.57, 0.4), towerX = 220, towerZ = -180, towerBase = towerPiece(Ds, towerStone, [towerX, 9, towerZ], [36, 18, 36]);
  sx(towerBase, towerX, towerZ, 36, 36, 18);
  let towerShaft = towerPiece(Ds, towerStone, [towerX, 79, towerZ], [22, 122, 22]);
  sx(towerShaft, towerX, towerZ, 22, 22, 140);
  let towerClockRoom = towerPiece(Ds, towerStone, [towerX, 151, towerZ], [30, 24, 30]);
  sx(towerClockRoom, towerX, towerZ, 30, 30, 163, 139);
  let towerBell = towerPiece(Ds, towerStone, [towerX, 172, towerZ], [24, 18, 24]);
  sx(towerBell, towerX, towerZ, 24, 24, 181, 163);
  towerPiece(Ds, towerTrim, [towerX, 19, towerZ], [39, 3, 39]), towerPiece(Ds, towerTrim, [towerX, 136, towerZ], [27, 3, 27]), towerPiece(Ds, towerTrim, [towerX, 164, towerZ], [34, 3, 34]);
  let towerRoofCap = towerPiece(Ds, towerRoof, [towerX, 183, towerZ], [29, 3, 29]);
  sx(towerRoofCap, towerX, towerZ, 29, 29, 184.5, 181.5);
  for (let i = 0; i < 4; i++) {
    let t = i * Math.PI / 2, e = new Me();
    e.position.set(towerX, 0, towerZ), e.rotation.y = t, Dt.add(e), cityTowerParts.push(e);
    for (let n of [-1, 1]) {
      let r = he(e, Ds, towerTrim, [n * 10, 76, 10.75], [1.8, 112, 1.1]);
      r.castShadow = false;
    }
    for (let n = 31; n <= 115; n += 14) {
      let r = he(e, Ds, towerWindow, [0, n, 11.18], [2.1, 4.9, 0.16]);
      he(e, new pn(1, 12, 8), towerTrim, [0, n + 2.28, 11.18], [1.05, 0.8, 0.11]);
    }
  }
  for (let i = 0; i < 4; i++) {
    let t = i * Math.PI / 2, e = new Me();
    e.position.set(towerX + Math.sin(t) * 15.25, 151, towerZ + Math.cos(t) * 15.25), e.rotation.y = t, Dt.add(e), cityTowerParts.push(e), he(e, new pn(1, 24, 16), towerFace, [0, 0, 0.05], [4.65, 4.65, 0.34]), he(e, new hi(4.55, 0.27, 12, 48), towerGold, [0, 0, 0.27]);
    for (let n = 0; n < 12; n++) {
      let r = n * Math.PI / 6, a = 3.56, o = he(e, Ds, towerGold, [Math.sin(r) * a, Math.cos(r) * a, 0.32], [0.18, n % 3 === 0 ? 0.72 : 0.42, 0.09]);
      o.rotation.z = -r;
    }
    he(e, Ds, towerGold, [0, 1.22, 0.38], [0.23, 2.35, 0.1]), he(e, Ds, towerGold, [0.57, 0.42, 0.4], [0.28, 1.55, 0.1], [0, 0, -0.82]), he(e, new pn(0.48, 12, 8), towerGold, [0, 0, 0.48], [1, 1, 0.46]);
  }
  let towerSpire = towerPiece(new Wn(0.25, 6, 44, 8), towerRoof, [towerX, 203, towerZ]);
  ki.push(towerSpire);
  for (let i = 0; i < 4; i++) {
    let t = i * Math.PI / 2, e = towerPiece(new Wn(0.15, 2.7, 18, 8), towerRoof, [towerX + Math.sin(t) * 9, 182, towerZ + Math.cos(t) * 9]);
    ki.push(e);
  }
  let towerFinial = towerPiece(new Wn(0.03, 0.8, 7, 8), towerGold, [towerX, 228.5, towerZ]);
  ki.push(towerFinial);
  const legacyWindowsStart = new Set(Dt.children);
  for (let i = 0; i < 2; i++) {
    let t = Dl[i], e = new li(Ds, i === 0 ? nx : ot.dark, t.length), n = new ee();
    for (let s = 0; s < t.length; s++) {
      let [r, a, o, c, l, h] = t[s];
      n.compose(new T(r, a, o), new fn(), new T(c, l, h)), e.setMatrixAt(s, n);
    }
    e.instanceMatrix.needsUpdate = true, e.frustumCulled = false, Dt.add(e);
  }
  for(const object of Dt.children)if(!legacyWindowsStart.has(object)){object.userData.legacyTown=true;legacyTownParts.push(object);}
  function hx(i) {
    let t = new Me();
    i.add(t), t.userData.rotors = [], t.userData.nozzles = [], Ut(t, ot.black, [0, 0.82, 0.32], [0.84, 0.53, 0.4]), Ut(t, ot.iron, [0, 0.86, 0.56], [0.53, 0.35, 0.12]), Ut(t, ot.steel, [0, 0.88, 0.63], [0.27, 0.18, 0.065]);
    for (let e = -1; e <= 1; e += 2) {
      Ut(t, ot.brass, [e * 0.31, 0.81, 0.62], [0.055, 0.18, 0.055]), Ut(t, ot.strap, [e * 0.31, 0.9, 0.1], [0.15, 0.13, 0.7]), Oe(t, ot.iron, [e * 0.42, 0.68, 0.5], 0.15, 0.74, 1, 18), Oe(t, ot.steel, [e * 0.79, 0.68, 0.5], 0.17, 0.095, 1, 18), Oe(t, ot.brass, [e * 0.13, 0.68, 0.5], 0.18, 0.12, 1, 18);
      for (let o = 0; o < 3; o++) Oe(t, ot.black, [e * (0.25 + o * 0.17), 0.68, 0.5], 0.167, 0.04, 1, 18);
      Oe(t, ot.black, [e * 0.54, 0.94, 0.33], 0.225, 0.13, 1, 22), Oe(t, ot.steel, [e * 0.62, 0.94, 0.33], 0.192, 0.075, 1, 22), Oe(t, ot.bronze, [e * 0.68, 0.94, 0.33], 0.117, 0.045, 1, 20);
      for (let o = 0; o < 6; o++) {
        let c = o * Math.PI / 3;
        Ut(t, ot.black, [e * 0.71, 0.94 + Math.cos(c) * 0.097, 0.33 + Math.sin(c) * 0.097], [0.03, 0.034, 0.034]);
      }
      let n = new Me();
      n.position.set(e * 0.73, 0.94, 0.33), t.add(n), Oe(n, ot.bronze, [0, 0, 0], 0.112, 0.033, 1, 18);
      for (let o = 0; o < 8; o++) {
        let c = o * Math.PI / 4;
        Ut(n, ot.steel, [0, Math.sin(c) * 0.1, Math.cos(c) * 0.1], [0.044, 0.025, 0.024]);
      }
      t.userData.rotors.push({ side: e, rotor: n });
      let s = new Me();
      t.add(s), s.position.set(e * 0.76, 0.62, 0.25), s.rotation.z = -e * 0.09, s.rotation.y = e * 0.035, Ut(s, ot.black, [0, 0, 0.34], [0.37, 0.43, 1.6]), Ut(s, ot.iron, [e * 0.1, 0.06, 0.34], [0.17, 0.39, 1.53]), Ut(s, ot.bronze, [-e * 0.03, 0.23, 0.29], [0.33, 0.065, 1.49]), Ut(s, ot.black, [0, -0.17, 0.34], [0.37, 0.09, 1.62]);
      for (let o = 0; o < 7; o++) {
        let c = -0.34 + o * 0.22;
        Ut(s, o % 2 ? ot.steel : ot.iron, [-e * 0.15, 0.03, c], [0.03, 0.28, 0.065]), Ut(s, ot.black, [e * 0.13, 0.09, c], [0.05, 0.12, 0.056]);
      }
      Ut(s, ot.brass, [0, 0.06, -0.42], [0.42, 0.38, 0.13]), Ut(s, ot.iron, [0, 0.04, 1.1], [0.4, 0.38, 0.16]);
      for (let o = 0; o < 4; o++) Ut(s, ot.steel, [e * 0.04, 0.255, -0.19 + o * 0.32], [0.22, 0.043, 0.045]);
      let r = new Me();
      s.add(r), r.position.set(0, -0.12, 1.09), t.userData.nozzles.push(r), Oe(r, ot.iron, [0, 0, 0.11], 0.12, 0.3, 2), Oe(r, ot.bronze, [0, 0, 0.31], 0.14, 0.07, 2), Oe(r, ot.black, [0, 0, 0.38], 0.08, 0.12, 2), Oe(r, ot.steel, [0, 0, 0.46], 0.065, 0.08, 2);
      let a = [new T(e * 0.43, 0.86, 0.41), new T(e * 0.65, 0.84, 0.7), new T(e * 0.76, 0.75, 0.77), new T(e * 0.78, 0.47, 0.67)];
      he(t, new La(new nr(a), 18, 0.045, 7, false), ot.black);
      for (let o = 0; o < 3; o++) Ut(t, ot.brass, [e * 0.75, 0.46 + o * 0.1, 0.66], [0.07, 0.03, 0.1]);
    }
    for (let e of [-1, 1]) Ut(t, ot.leather, [e * 0.34, 1.13, 0.24], [0.13, 0.78, 0.07], [0, 0, e * 0.35]), Ut(t, ot.brass, [e * 0.27, 0.83, 0.47], [0.13, 0.13, 0.065]);
    return t;
  }
  function ux() {
    const xs2 = [-0.46, -0.365, -0.265, -0.11, 0.13, 0.265, 0.365, 0.46];
    const heights = [8e-3, 0.042, 0.085, 0.101, 0.093, 0.084, 0.042, 8e-3];
    const length = 1.5, shoulder = 1.3;
    const rings = [0, 0.024, 0.06, 0.115, 0.18, 0.24];
    for (let y = 0.292; y < shoulder; y += 0.052) rings.push(y);
    rings.push(shoulder, 1.335, 1.37, 1.405, 1.44, 1.47, length);
    const positions = [], normals = [], uvs = [], groups = [];
    let triangleCount = 0;
    function smooth(a, b, x) {
      let t = Math.max(0, Math.min(1, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    }
    function widthAt(y) {
      if (y < 0.05) return 0.89 + 0.11 * smooth(0, 0.05, y);
      if (y <= shoulder) return 1;
      return Math.max(0.018, 1 - smooth(shoulder, length, y) * 0.99);
    }
    function section(k, j, sign) {
      let y = rings[k], w = widthAt(y), taper = y > shoulder ? 1 - 0.54 * smooth(shoulder, length, y) : 1;
      return [xs2[j] * 0.19 * w, y, sign * heights[j] * 0.3 * taper];
    }
    function triangle(a, b, c, materialIndex, uvA = [0, 0], uvB = [0, 0], uvC = [0, 0]) {
      let va2 = new T(...a), vb = new T(...b), vc2 = new T(...c), normal = vb.clone().sub(va2).cross(vc2.clone().sub(va2)).normalize();
      for (let [v, uv] of [[va2, uvA], [vb, uvB], [vc2, uvC]]) {
        positions.push(v.x, v.y, v.z);
        normals.push(normal.x, normal.y, normal.z);
        uvs.push(uv[0], uv[1]);
      }
      groups.push([triangleCount * 3, 3, materialIndex]);
      triangleCount++;
    }
    for (const sign of [-1, 1]) for (let k = 0; k < rings.length - 1; k++) for (let j = 0; j < xs2.length - 1; j++) {
      const a = section(k, j, sign), b = section(k, j + 1, sign), c = section(k + 1, j + 1, sign), d = section(k + 1, j, sign);
      const materialIndex = j === 0 || j === xs2.length - 2 ? 2 : j === 2 || j === 3 || j === 4 ? 0 : 1;
      const uvA = [j / 7, rings[k] / length], uvB = [(j + 1) / 7, rings[k] / length], uvC = [(j + 1) / 7, rings[k + 1] / length], uvD = [j / 7, rings[k + 1] / length];
      if (sign === 1) {
        triangle(a, b, d, materialIndex, uvA, uvB, uvD);
        triangle(b, c, d, materialIndex, uvB, uvC, uvD);
      } else {
        triangle(a, d, b, materialIndex, uvA, uvD, uvB);
        triangle(b, d, c, materialIndex, uvB, uvD, uvC);
      }
    }
    for (const j of [0, xs2.length - 1]) for (let k = 0; k < rings.length - 1; k++) {
      const a = section(k, j, 1), b = section(k + 1, j, 1), c = section(k + 1, j, -1), d = section(k, j, -1);
      if (j === 0) {
        triangle(a, b, d, 3);
        triangle(b, c, d, 3);
      } else {
        triangle(a, d, b, 3);
        triangle(b, d, c, 3);
      }
    }
    for (let j = 0; j < xs2.length - 1; j++) {
      const a = section(0, j, 1), b = section(0, j + 1, 1), c = section(0, j + 1, -1), d = section(0, j, -1);
      triangle(a, d, b, 1);
      triangle(b, d, c, 1);
    }
    const geometry = new Se();
    geometry.setAttribute("position", new Ie(new Float32Array(positions), 3));
    geometry.setAttribute("normal", new Ie(new Float32Array(normals), 3));
    geometry.setAttribute("uv", new Ie(new Float32Array(uvs), 2));
    for (let [start, count, materialIndex] of groups) geometry.addGroup(start, count, materialIndex);
    geometry.computeBoundingSphere();
    return geometry;
  }
  var id = ux();
  function sd(i, t = 1, e = false) {
    let n = new Me();
    i.add(n), Ut(n, ot.leather, [0, -0.28, 0], [0.145, 0.46, 0.13]);
    for (let a = 0; a < 5; a++) Ut(n, ot.black, [0, -0.45 + a * 0.08, 0.078], [0.15, 0.016, 0.027]);
    Ut(n, ot.iron, [0, -0.02, 0], [0.24, 0.18, 0.22]), Ut(n, ot.brass, [0, 0.02, 0.08], [0.14, 0.09, 0.085]), Ut(n, ot.iron, [-t * 0.16, -0.2, 0.02], [0.09, 0.28, 0.06], [0, 0, t * 0.11]), Ut(n, ot.iron, [t * 0.1, 0.12, 0], [0.2, 0.055, 0.17]);
    let r = [he(n, id, [ot.blade, ot.iron, ot.edge, ot.steel], [0, 0.18, -0.018])];
    r.push(Ut(n, ot.edge, [-0.045, 0.78, 0.031], [0.012, 0.85, 0.015], [0, 0, 0.012]));
    for (let a = 0; a < 7; a++) r.push(Ut(n, ot.iron, [t * 0.046, 0.26 + a * 0.145, 0.039], [0.035, 0.024, 8e-3]));
    return n.userData.bladeParts = r, Ut(n, ot.brass, [0, -0.55, 0], [0.18, 0.075, 0.18]), e && (n.userData.sword = true), n;
  }
  var Ka = [], raidHumanArms = [], Ya = new Me();
  Dt.add(Ya);
  var _e = new Me();
  Ya.add(_e);
  var Bx = Ut(_e, ot.shirt, [0, 1.2, 0], [0.66, 0.65, 0.34]), zx = Ut(_e, ot.cloth, [0, 1.18, 0.21], [0.69, 0.43, 0.14]), kx = Ut(_e, ot.strap, [0, 1.51, 0.01], [0.67, 0.13, 0.39]), Vx = he(_e, new pn(0.23, 14, 12), ot.skin, [0, 1.74, -0.018], [1, 1.18, 0.96]);
  he(_e, new pn(0.238, 14, 12), ot.hair, [0, 1.9, 0.045], [1, 0.47, 1.03]);
  for (let i of [-1, 1]) {
    const shoulder=new Me(),elbow=new Me();_e.add(shoulder);shoulder.name="raid-human-arm-"+i;shoulder.position.set(i*.4,1.42,0);Ut(shoulder,ot.cloth,[0,-.22,0],[.22,.44,.29]);shoulder.add(elbow);elbow.position.y=-.4;Ut(elbow,ot.leather,[0,-.16,-.02],[.19,.32,.22]);raidHumanArms.push({arm:shoulder,elbow,side:i});
    Ut(_e, ot.strap, [i * 0.22, 0.87, 0.02], [0.19, 0.18, 0.35]), Ut(_e, ot.leather, [i * 0.23, 0.45, 0], [0.23, 0.61, 0.26]), Ut(_e, ot.strap, [i * 0.22, 0.36, -0.05], [0.25, 0.23, 0.275]), Ut(_e, ot.black, [i * 0.23, 0.1, -0.08], [0.26, 0.29, 0.34]), Ut(_e, ot.strap, [i * 0.22, 0.74, 0.02], [0.08, 0.42, 0.29], [0, 0, i * 0.32]);
    let t = sd(elbow, i);
    t.position.set(0,-.32,-.08), t.rotation.set(-1.1,0,i*.19), t.scale.setScalar(.55), Ka.push({sword:t,side:i,arm:shoulder,elbow});
  }
  var Xu = hx(_e), Qa = new Me();
  _e.add(Qa);
  Qa.position.set(0, 1.33, 0.2);
  for (let i = -2; i <= 2; i++) {
    let t = Ut(Qa, i % 2 ? ot.cloth : ot.strap, [i * 0.115, -0.32, 0.18], [0.122, 0.71, 0.035]);
    t.rotation.x = -0.2;
  }
  var Hx = Ut(_e, ot.strap, [-0.26, 1.21, -0.19], [0.1, 0.93, 0.12], [0, 0, -0.4]), Gx = Ut(_e, ot.strap, [0.26, 1.21, -0.19], [0.1, 0.93, 0.12], [0, 0, 0.4]);
  Ut(_e, ot.leather, [0, 0.77, 0.06], [0.98, 0.13, 0.44]);
  var Es = new Me();
  qe.add(Es);
  var vr = [];
  for (let i of [-1, 1]) {
    let t = new Me();
    Es.add(t), t.position.set(i * 0.6, -0.67, -1), t.rotation.set(-0.89, i * 0.18, -i * 0.15), Ut(t, ot.cloth, [0, -0.25, 0.03], [0.22, 0.48, 0.24]), Ut(t, ot.leather, [0, -0.08, -0.01], [0.23, 0.2, 0.24]);
    let e = sd(t, i, true);
    e.position.set(0, 0.17, -0.1), vr.push({ arm: t, side: i, sword: e });
  }
  var wn = [], kl = [], rd = [], V = { root: new Me(), hp: 100, maxHp: 100, alive: true, armorL: true, armorR: true, armorCutsL: 0, armorCutsR: 0, napeOpen: false, attackState: "idle", attackCooldown: 8, attackTimer: 0, recovery: 0, invulnerable: 0, armL: null, armR: null, armorPlateL: null, armorPlateR: null, weak: null, slamRing: null };
  Dt.add(V.root);
  V.root.position.set(0, 0, 18);
  V.root.scale.setScalar(1.45);
  var Fi = $t(10315096, 0.04, 0.92), Rs = $t(12946291, 0.03, 0.88), ja = $t(5585721, 0.03, 0.95), Vl = $t(2632490, 0.02, 0.93), ad = $t(6707531, 0.58, 0.43), qu = $t(14791532, 0.66, 0.31, 11826488, 0.35), od = $t(15901780, 0.15, 0.22, 16740664, 2.2);
  function Hl(i, t = "body") {
    return i.userData.titanPart = t, rd.push(i), ki.push(i), i;
  }
  function Yn(i, t, e, n, s = "body", r) {
    return Hl(Ut(i, t, e, n, r), s);
  }
  function xn(i, t, e, n, s = "body") {
    return Hl(he(i, new pn(1, 12, 9), t, e, n), s);
  }
  function Ts(i, t, e, n, s, r = "body") {
    let a = new T(...t), o = new T(...e), c = o.clone().sub(a), l = he(i, new Wn(n * 0.76, n, c.length(), 10), s);
    return l.position.copy(a).add(o).multiplyScalar(0.5), l.quaternion.setFromUnitVectors(new T(0, 1, 0), c.normalize()), Hl(l, r);
  }
  xn(V.root, Fi, [0, 12.1, 0], [3, 4.4, 1.7]);
  Yn(V.root, ja, [0, 7.8, 0], [4.3, 1.8, 2.6]);
  xn(V.root, Rs, [0, 15.4, 0.05], [2.65, 1.35, 1.65]);
  Yn(V.root, Fi, [0, 13.25, 1.02], [2.15, 0.24, 0.16]);
  for (let i of [-1, 1]) {
    Ts(V.root, [i * 1, 8, 0], [i * 1.1, 4.2, 0.05], 1.07, Fi), xn(V.root, Rs, [i * 1.1, 4.15, 0.05], [1.05, 1, 1]), Ts(V.root, [i * 1.1, 4, 0.05], [i * 1.14, 0.55, 0.35], 0.78, Fi), Yn(V.root, ja, [i * 1.18, 0.34, 0.8], [1.55, 0.66, 2.25]);
    for (let t = 0; t < 3; t++) Ts(V.root, [i * 0.42, 14.5 - t * 0.72, 1.12], [i * 2.05, 14.2 - t * 0.72, 0.95], 0.095, Rs);
  }
  V.armL = new Me();
  V.armL.position.set(-2.25, 14, 0);
  V.root.add(V.armL);
  V.armR = new Me();
  V.armR.position.set(2.25, 14, 0);
  V.root.add(V.armR);
  for (let [i, t] of [[-1, V.armL], [1, V.armR]]) {
    xn(t, Fi, [i * 0.22, -0.45, 0], [1.36, 1.35, 1.35]), Ts(t, [i * 0.2, -0.6, 0], [i * 0.75, -3.35, 0.28], 0.94, Fi), xn(t, Rs, [i * 0.75, -3.35, 0.28], [0.98, 0.9, 0.95]), Ts(t, [i * 0.75, -3.5, 0.28], [i * 1, -6.2, 0.52], 0.75, Fi), xn(t, ja, [i * 1.04, -6.38, 0.9], [0.94, 0.82, 0.58]);
    for (let e = 0; e < 3; e++) Ts(t, [i * (0.65 + e * 0.34), -6.72, 0.95], [i * (0.7 + e * 0.37), -7.75, 0.98], 0.16, Rs);
  }
  xn(V.root, Rs, [0, 18.35, 0.08], [1.58, 1.78, 1.3]);
  xn(V.root, Vl, [0, 19.48, -0.02], [1.62, 0.75, 1.34]);
  Yn(V.root, Vl, [-0.68, 19.28, 0.85], [0.25, 0.82, 0.72], "body", [0, 0, -0.32]);
  Yn(V.root, Vl, [0.55, 19.35, 0.87], [0.27, 0.68, 0.66], "body", [0, 0, 0.24]);
  Yn(V.root, ja, [0, 17.72, 1], [0.88, 0.24, 0.38]);
  for (let i of [-1, 1]) xn(V.root, od, [i * 0.48, 18.48, 1.16], [0.22, 0.13, 0.08]);
  V.armorPlateL = Yn(V.root, ad, [-2.9, 14.15, 2.15], [2.12, 2.22, 1.72], "armorL", [0, 0, -0.16]);
  V.armorPlateR = Yn(V.root, ad, [2.9, 14.15, 2.15], [2.12, 2.22, 1.72], "armorR", [0, 0, 0.16]);
  for (let i of [-1, 1]) {
    let t = i < 0 ? "armorL" : "armorR";
    Yn(V.root, qu, [i * 2.9, 13.05, 2.85], [1.5, 0.18, 0.18], t), xn(V.root, qu, [i * 2.9, 14.15, 2.97], [0.25, 0.25, 0.14], t);
  }
  V.weak = xn(V.root, od, [0, 18.32, -1.13], [0.62, 0.5, 0.3], "nape");
  V.weak.visible = false;
  var to = he(V.root, new hi(0.88, 0.11, 8, 36), ot.orange, [0, 18.32, -1.29]);
  to.visible = false;
  V.slamRing = he(Dt, new hi(1, 0.13, 7, 72), new ci({ color: 16733514, transparent: true, opacity: 0.82, depthWrite: false }), [0, 0.14, 0]);
  V.slamRing.rotation.x = -Math.PI / 2;
  V.slamRing.visible = false;
  var Oi = [], Bi = [], assetSystem = null;
  function dx() {
    V.root.visible = true, V.root.position.set(0, 0, 18), V.root.scale.setScalar(1.45), V.root.rotation.set(0, 0, 0), V.hp = V.maxHp, V.alive = true, V.armorL = true, V.armorR = true, V.armorCutsL = 0, V.armorCutsR = 0, V.napeOpen = false, V.armorPlateL.visible = true, V.armorPlateR.visible = true, V.weak.visible = false, to.visible = false, V.attackState = "idle", V.attackCooldown = 8, V.attackTimer = 0, V.recovery = 0, V.invulnerable = 0, V.armL.rotation.set(0, 0, 0), V.armR.rotation.set(0, 0, 0), V.slamRing.visible = false;
    for (let i of Oi) Dt.remove(i.root);
    Oi.length = 0;
    for (let i of Bi) {Dt.remove(i.mesh);i.mesh.material.dispose();}
    Bi.length = 0; if(assetSystem) assetSystem.reset(); eo();
  }
  function eo() {
    let i = Math.max(0, V.hp);
    ut("#titanHpText").textContent = Math.ceil(i/V.maxHp*100) + "%", ut("#titanHpBar").style.width = i / V.maxHp * 100 + "%", ut("#armorRead").textContent = "SHOULDER ARMOR: " + (V.armorL ? "L " + V.armorCutsL + "/3" : "\u2014") + " / " + (V.armorR ? "R " + V.armorCutsR + "/3" : "\u2014"), ut("#napeRead").textContent = V.napeOpen ? "NAPE EXPOSED" : "NAPE SEALED", typeof P < "u" && (ut("#ammoRead").textContent = P.thunderAmmo + " / " + mr, ut("#ammoMode").textContent = P.thunderReload > 0 ? "RELOADING " + P.thunderReload.toFixed(1) + "s" : P.thunderAmmo <= 0 ? "OUT OF AMMO" : P.thunderMag + " IN MAG / AUTO-LOAD 2", ut("#lifeRead").textContent = P.health + " / 3", ut("#lifeBar").style.width = P.health / 3 * 100 + "%");
    if(assetSystem){ut("#armorRead").textContent=assetSystem.type()==="armored"?"肩装甲  左 "+(V.armorL?V.armorCutsL+"/3":"破壊")+" / 右 "+(V.armorR?V.armorCutsR+"/3":"破壊"):"装甲なし";ut("#napeRead").textContent=V.napeOpen?"うなじ露出":"肩装甲を破壊";}
    if(P.spearArmed&&P.thunderReload<=0)ut("#ammoMode").textContent="装備中 / Rで発射・Fで刃";
    else if(P.thunderAmmo>0&&P.thunderReload<=0)ut("#ammoMode").textContent="Rで装備 → Rで発射";
  }
  function cd(i) {
    pendingVictory=0;hitStopRemaining=0;punchCameraImpact=null;
    const result=!pi&&assetSystem?assetSystem.finish(i):null;
    pi || (pi = true, yr(), ut("#ui").classList.remove("danger"), ut("#endTag").textContent = i ? "MISSION COMPLETE" : "MISSION FAILED", ut("#endTitle").textContent = i&&assetSystem?.inspect().operation==="raid"?"市街地を奪還":i ? "\u5DE8\u4EBA\u3092\u8A0E\u4F10" : "\u4F5C\u6226\u5931\u6557", ut("#endCopy").textContent = i&&assetSystem?.inspect().operation==="raid"?"全12体の巨人を討伐した。":i && assetSystem && assetSystem.type()!=="armored" ? "背後へ回り、巨人のうなじを断った。" : i ? "\u80A9\u88C5\u7532\u3092\u7834\u58CA\u3057\u3001\u3046\u306A\u3058\u3092\u5207\u65AD\u3057\u305F\u3002" : "\u88C5\u5099\u3092\u6574\u3048\u3066\u3001\u3082\u3046\u4E00\u5EA6\u8A0E\u4F10\u306B\u6311\u3081\u3002", ut("#endOverlay").classList.add("show"), i && (V.alive = false, V.root.rotation.x = -0.48, V.root.position.y = -1.5, pe("TARGET ELIMINATED")));
    if(result)ut("#endCopy").textContent+="\n時間 "+result.time.toFixed(1)+"秒 / 最高速度 "+Math.round(result.maxSpeed*3.6)+" km/h\n被弾 "+result.damage+"回 / 雷槍 "+result.spears+"発"+(result.best!==null?"\n自己ベスト "+result.best.toFixed(1)+"秒":"");
  }
  var raidHitTime=0,hitStopRemaining=0,pendingVictory=0,bladeImpactCount=0,lastBladeImpact=null,punchImpactCount=0,lastPunchImpact=null,punchCameraImpact=null;
  const impactCanvas=ut("#impactLines"),impactLabel=ut("#impactLabel");impactCanvas.style.opacity="0";impactLabel.textContent="";
  function paintBladeImpact(enemy,part,point,cuts=0,lethal=false){
    const armor=part==="armorL"||part==="armorR";
    bladeImpactCount++;lastBladeImpact={enemy:enemy.id,part,cuts,lethal};hitStopRemaining=Math.max(hitStopRemaining,lethal?.09:.075);
    ut("#reticle").classList.add("hit");ut("#reticle").dataset.hit=armor?part:"nape";raidHitTime=.22;_n=Math.max(_n,lethal?.24:.18);assetSystem?.hitReact?.(enemy,part);be(armor?112:940,.1,armor?"square":"sawtooth",.032,armor?48:320);if(Ze&&window.navigator?.vibrate)window.navigator.vibrate(lethal?55:28);
  }
  function bladeImpact(enemy,part,point,cuts=0,lethal=false){paintBladeImpact(enemy,part,point,cuts,lethal);}
  function scheduleVictory(){pendingVictory=Math.max(pendingVictory,3.35);}
  function ld(i, source = "thunder", enemy = null) {
    if(enemy)V=enemy;
    if (!V.alive || pi) return;
    const target=i==="armorL"?V.armorPlateL:i==="armorR"?V.armorPlateR:V.weak,impactPoint=target.getWorldPosition(new T()),previousHp=V.hp;let damage=0;
    if(i==="armorL"&&V.armorL){V.armorL=false;V.armorPlateL.visible=false;damage=17;pe("LEFT SHOULDER / ARMOR BROKEN");be(180,.18,"square",.04,70);}
    else if(i==="armorR"&&V.armorR){V.armorR=false;V.armorPlateR.visible=false;damage=17;pe("RIGHT SHOULDER / ARMOR BROKEN");be(180,.18,"square",.04,70);}
    else if(i==="nape"&&V.napeOpen){damage=source==="odm"?68:source==="blade"?34:8;pe("NAPE HIT / "+Math.max(0,Math.ceil((V.hp-damage)/V.maxHp*100))+"%");be(720,.16,"sawtooth",.04,180);}
    else if(i==="body"){damage=7;pe("BODY HIT / AIM FOR THE ARMOR");be(240,.08,"triangle",.018,110);}
    else if(i==="nape"){pe("NAPE SEALED / BREAK BOTH SHOULDER PLATES");be(160,.08,"triangle",.02,80);}
    V.hp=Math.max((source==="blade"||source==="odm")?0:1,V.hp-damage);
    if((source==="blade"||source==="odm")&&damage>0)bladeImpact(V,i,impactPoint,i==="armorL"?V.armorCutsL:i==="armorR"?V.armorCutsR:0,V.hp<=0&&previousHp>0);
    let wasOpen=V.napeOpen;V.napeOpen=!V.armorL&&!V.armorR;V.weak.visible=V.napeOpen;to.visible=V.napeOpen;if(V.napeOpen&&!wasOpen)pe("NAPE EXPOSED / CUT IT FROM BEHIND");
    if(V.hp<=0){if(assetSystem?.enemyDown){if(assetSystem.enemyDown(V))scheduleVictory();}else cd(true);}eo();
  }
  function closeBladeArmor(){
    const direction=Zn(),melee=assetSystem?.findBladeTarget?.(P.pos,direction,true);if(melee){V=melee.enemy;return {object:melee.object,point:melee.point,distance:melee.distance};}if(!V.alive)return null;let best=null;
    for(const [mesh,active] of [[V.armorPlateL,V.armorL],[V.armorPlateR,V.armorR]]){
      if(!active)continue;const point=mesh.getWorldPosition(new T()),delta=point.clone().sub(P.pos),distance=delta.length();
      if(distance>5.2||distance<.01||delta.clone().normalize().dot(direction)<.7||best&&distance>=best.distance)continue;
      if(raidObstacle(P.pos,delta.clone().normalize(),Math.max(0,distance-.4)))continue;
      best={object:mesh,point,distance};
    }return best;
  }
  function fx() {
    let hit=Gl(),part=hit?.object.userData.titanPart;
    if(hit?.object.userData.enemy){V=hit.object.userData.enemy;assetSystem?.setTarget?.(V);}
    if(assetSystem){const armor=closeBladeArmor();if(armor){hit=armor;part=armor.object.userData.titanPart;}}
    if(part!=="armorL"&&part!=="armorR"&&assetSystem?.findSlashTarget){const enemy=assetSystem.findSlashTarget(P.pos,Zn());if(enemy)V=enemy;}
    if(!V.alive)return false;
    if (hit && hit.distance <= 8.2 && (part === "armorL" && V.armorL || part === "armorR" && V.armorR)) {
      let count = part === "armorL" ? ++V.armorCutsL : ++V.armorCutsR;
      if (count >= 3) {
        ld(part,"blade");
        return true;
      }
      bladeImpact(V,part,hit.point||V[part==="armorL"?"armorPlateL":"armorPlateR"].getWorldPosition(new T()),count,false);
      pe((part === "armorL" ? "LEFT" : "RIGHT") + " ARMOR / CUT " + count + " OF 3");
      be(220, 0.08, "triangle", 0.018, 80);
      eo();
      return true;
    }
    let behind = P.pos.clone().sub(V.weak.getWorldPosition(new T())).dot(new T(0,0,1).applyQuaternion(V.root.quaternion));
    if(behind > .4) return false;
    let i = new T();
    V.weak.getWorldPosition(i);
    let t = i.clone().sub(P.pos), e = t.length(), n = Zn();
    if(e>.01 && raidObstacle(P.pos,t.clone().normalize(),Math.max(0,e-.4)))return false;
    if(assetSystem&&-behind/e<.78)return false;
    return e > (assetSystem?8.5:8.2) || t.normalize().dot(n) < (assetSystem ? .75 : .28) ? false : V.napeOpen ? (ld("nape", "blade"), true) : (pe("ARMOR BLOCKS THE NAPE"), be(130, 0.08, "square", 0.02, 90), true);
  }
  var raidObstacles=[],raidObstacleKey="",raidVisibleTargets=[],raidAimRay=new hr(),raidWallRay=new hr();
  function raidObstacle(origin,direction,far){
    const key=vn+":"+ki.length;
    if(key!==raidObstacleKey){raidObstacleKey=key;raidObstacles=ki.filter(mesh=>mesh.visible&&!mesh.userData.titanPart&&!mesh.userData.enemy&&!(mesh.userData.cityOnly&&vn!=="city")&&!(mesh.userData.cityLegacyWall&&vn==="city"));}
    raidWallRay.set(origin,direction);raidWallRay.near=0;raidWallRay.far=far;return raidWallRay.intersectObjects(raidObstacles,false)[0]||null;
  }
  function Gl() {
    if (!V.alive&&!assetSystem?.enemyDown) return null;
    let direction=Zn(),ray=raidAimRay;ray.set(P.pos,direction);ray.near=0;ray.far=Math.min(fe.range,190);const candidates=assetSystem?.rayCandidates?.(P.pos,direction,ray.far);raidVisibleTargets.length=0;for(const n of rd)if(n.visible&&n.userData.titanPart&&(!n.userData.enemy||n.userData.enemy.alive)&&(!candidates||candidates.has(n.userData.enemy)))raidVisibleTargets.push(n);
    const hit=ray.intersectObjects(raidVisibleTargets,false)[0];
    if(!hit)return null;
    const wall=raidObstacle(P.pos,direction,hit.distance-.05);
    if(wall)return null;if(hit.object.userData.enemy){V=hit.object.userData.enemy;assetSystem?.setTarget?.(V);}return hit;
  }
  function useThunder(){
    if(!He||Ye||pi||assetSystem?.getAssistStatus?.()?.dashing)return;
    if(assetSystem?.isTitan?.()){assetSystem.activateHardening?.();return;}
    if(!P.spearArmed){if(P.thunderAmmo<=0){pe("雷槍なし / 刃で装甲を破壊できる");return;}P.spearArmed=true;assetSystem?.equipSpear?.();pe("雷槍を装備 / Rで発射・Fで刃に戻す");eo();return;}
    Wl();
  }
  function disarmSpear(){P.spearArmed=false;assetSystem?.disarm?.();}
  function transformPlayer(){if(!He||Ye||pi)return false;assetSystem?.setGuardHeld?.(false);titanCameraController?.reset();return assetSystem?.toggleTransformation?.()||false;}
  function Wl() {
    if(assetSystem?.isTitan?.())return;
    if (!He || Ye || pi) return;
    if (P.thunderReload > 0) {
      pe("THUNDER / RELOADING");
      return;
    }
    if (P.thunderAmmo <= 0) {
      disarmSpear();pe("雷槍なし / 肩装甲は刃で3回斬れば破壊できる");
      return;
    }
    if (P.thunderMag <= 0) {
      P.thunderReload = 1.45, pe("AUTO-LOADING / 2 ROUNDS");
      return;
    }
    let i = Gl();i=assetSystem?.getAssistedShot?.(Zn(),i)||i;let scenery = !i ? raidObstacle(P.pos,Zn(),95) : null, t = P.thunderSide++ % 2 ? 1 : -1, e = new T(Math.cos(P.yaw), 0, -Math.sin(P.yaw)), n = Zn(), s = P.pos.clone().addScaledVector(e, t * 0.46).add(new T(0, -0.35, 0)), r = i ? i.point.clone() : scenery ? scenery.point.clone() : s.clone().addScaledVector(n, 95), a = r.clone().sub(s).normalize(), o = new Me();
    Dt.add(o), o.position.copy(s);if(assetSystem)assetSystem.showSpear(t);
    if(!assetSystem || !assetSystem.attachProjectile(o)){    let c = he(o, ex, ot.dark, [0, 0, 0], [0.19, 0.68, 0.19]);
    he(o, new vs(0.16, 0.32, 8), ot.brass, [0, 0.48, 0]), he(o, new pn(0.095, 8, 6), ot.orange, [0, -0.34, 0]);}
    o.quaternion.setFromUnitVectors(md, a), Oi.push({ root: o, target: r, part: i ? i.object.userData.titanPart : null, velocity: a.clone().multiplyScalar(108), age: 0 }), Oi[Oi.length-1].enemy = i?.object.userData.enemy || null, Oi[Oi.length-1].followObject = i?.object || null, Oi[Oi.length-1].followPoint = i ? i.object.worldToLocal(i.point.clone()) : null, P.thunderAmmo--, P.thunderMag--, _n = 0.055, be(t < 0 ? 440 : 520, 0.16, "sawtooth", 0.033, 120), P.thunderMag === 0 && P.thunderAmmo > 0 ? (P.thunderReload = 1.45, pe("2 ROUNDS FIRED / AUTO-LOADING")) : pe(i ? "THUNDER / LOCKED" : "THUNDER / FIRED"), eo();
  }
  var raidBlastGeometry=new pn(1,12,9),raidRingGeometry=new hi(.7,.055,6,28);
  function px(i, t) {
    let e = new Ce(raidBlastGeometry, new ci({ color: t ? 16760176 : 8576224, transparent: true, opacity: 0.8, depthWrite: false }));
    e.position.copy(i), e.scale.setScalar(0.35), Dt.add(e), Bi.push({ mesh: e, age: 0 });
    let n = he(Dt, raidRingGeometry, new ci({color:16749885,transparent:true,opacity:.7,depthWrite:false}), [i.x, i.y, i.z]);
    n.userData.blastRing = true, Bi.push({ mesh: n, age: 0 });
  }
  function mx(i) {
    for (let t = Oi.length - 1; t >= 0; t--) {
      let e = Oi[t], n = e.target.clone().sub(e.root.position), s = n.length();
      if (e.age += i, s < 1.55 || e.age > 2.7) {
        let a = s < 2.4 && !!e.part;
        px(e.root.position.clone(), a), a && ld(e.part,"thunder",e.enemy), Dt.remove(e.root), Oi.splice(t, 1);
        continue;
      }
      let r = n.normalize();
      e.velocity.copy(r).multiplyScalar(108), e.root.position.addScaledVector(r, Math.min(s, 108 * i)), e.root.quaternion.setFromUnitVectors(md, r);
    }
    for (let t = Bi.length - 1; t >= 0; t--) {
      let e = Bi[t];
      e.age += i;
      let n = e.age / 0.38;
      if (n >= 1) {
        Dt.remove(e.mesh), e.mesh.material.dispose(), Bi.splice(t, 1);
        continue;
      }
      e.mesh.userData.blastRing ? (e.mesh.scale.setScalar(0.8 + n * 4), e.mesh.material.opacity = 0.7 * (1 - n)) : (e.mesh.scale.setScalar(0.35 + n * 2.1), e.mesh.material.opacity = 0.78 * (1 - n));
    }
    P.thunderReload > 0 && (P.thunderReload = Math.max(0, P.thunderReload - i), P.thunderReload === 0 && (P.thunderMag = Math.min(2, P.thunderAmmo), pe("THUNDER READY")));
  }
  function gx(i) {
    if (!V.alive || pi) return;
    if (V.invulnerable = Math.max(0, V.invulnerable - i), V.root.position.y = Math.sin(gn * 1.7) * 0.07, V.napeOpen) {
      let s = 0.85 + Math.sin(gn * 7) * 0.14;
      V.weak.userData.baseScale ? V.weak.scale.copy(V.weak.userData.baseScale).multiplyScalar(s) : V.weak.scale.set(0.62 * s, 0.5 * s, 0.3 * s), to.rotation.z += i * 1.8;
    }
    if(assetSystem){P.invulnerable<=0&&ut("#ui").classList.remove("danger");return;}
    let t = P.pos.x - V.root.position.x, e = P.pos.z - V.root.position.z, n = Math.hypot(t, e);
    if (V.attackState === "idle") V.attackCooldown -= i, n < 48 && V.attackCooldown <= 0 && (V.attackState = "windup", V.attackTimer = 2.15, V.slamRing.visible = true, V.slamRing.position.set(V.root.position.x, 0.14, V.root.position.z), V.armL.rotation.x = -0.9, V.armR.rotation.x = -0.9, pe("GROUND SLAM / GET AIRBORNE"));
    else if (V.attackState === "windup") {
      V.attackTimer -= i;
      let s = 0.12 + (1.2 - Math.max(0, V.attackTimer) / 2.15) * 1.12;
      if (V.slamRing.scale.setScalar(s), V.attackTimer <= 0) if (V.attackState = "recovery", V.recovery = 1.8, V.attackCooldown = 5.2, V.slamRing.visible = false, V.armL.rotation.x = 1, V.armR.rotation.x = 1, n < 18.5 && P.pos.y < 7 && P.invulnerable <= 0) {
        P.health = Math.max(0, P.health - 1), P.invulnerable = 2.3;
        let r = new T(t, 0, e).normalize();
        P.vel.addScaledVector(r, 20), P.vel.y += 9, _n = 0.23, ut("#ui").classList.add("danger"), pe("SLAM HIT / " + P.health + " VITALS LEFT"), be(90, 0.32, "sawtooth", 0.06, 38), P.health <= 0 && cd(false);
      } else pe("SLAM MISSED / COUNTERATTACK"), _n = 0.09, be(130, 0.25, "triangle", 0.028, 60);
    } else V.recovery -= i, V.armL.rotation.x += (0 - V.armL.rotation.x) * Math.min(1, i * 2.4), V.armR.rotation.x += (0 - V.armR.rotation.x) * Math.min(1, i * 2.4), V.recovery <= 0 && (V.attackState = "idle");
    P.invulnerable <= 0 && ut("#ui").classList.remove("danger");
  }
  var Cs = { city: { title: "TITAN RAID", start: [0, 2.3, 76], points: [[-24, 21, 15], [24, 24, -5], [0, 19, -34], [-43, 45, -16], [41, 37, 25], [0, 86, -54], [-60, 36, 57], [64, 90, -57], [41, 96, -100], [-30, 101, -95], [78, 94, 44], [-72, 93, 0]] }, forest: { title: "GIANT FOREST", start: [176, 17, 77], points: [[190, 24, 56], [216, 44, 70], [231, 64, 101], [226, 74, 131], [201, 55, 160], [182, 66, 187], [167, 45, 218], [190, 84, 222], [222, 95, 208], [235, 55, 174], [216, 37, 139], [188, 25, 90]] }, wall: { title: "WALL CLIMB", start: [-12, 4, -219], points: [[-13, 13, -246], [-23, 27, -255], [-7, 46, -253], [19, 64, -257], [37, 84, -260], [7, 90, -255], [-38, 99, -262], [-81, 91, -259], [-124, 98, -258], [-171, 89, -257], [-214, 96, -258], [-250, 101, -252]] } }, vn = "city", Is = false, Xn = 0, Ni = null, no = false;
  function ws(i) {
    if (!Number.isFinite(i)) return "--:--.--";
    let t = Math.floor(i / 60), e = i % 60;
    return `${String(t).padStart(2, "0")}:${e.toFixed(2).padStart(5, "0")}`;
  }
  function _x() {
    try {
      return parseFloat(localStorage.getItem("odm-reborn-best-" + vn)) || null;
    } catch {
      return null;
    }
  }
  function xx(i) {
    try {
      localStorage.setItem("odm-reborn-best-" + vn, i.toFixed(3));
    } catch {
    }
  }
  function Xl(i) {
    vn = Cs[i] ? i : "city", Ni = _x(), ut("#bestTime").textContent = ws(Ni), ut("#courseSelect").value = vn;
    for (let t of cityLegacyWallParts) t.visible = vn !== "city";
    for (let t of cityOuterWalls) t.visible = vn === "city";
    for (let t of cityTowerParts) t.visible = vn === "city";
    for (let t of raidDistrict) t.visible = vn === "city";
    raidRoad.visible = raidPlaza.visible = vn === "city";
    if(shiganshinaCity){shiganshinaCity.setVisible(vn==="city");for(const object of legacyTownParts)object.visible=vn!=="city"&&!object.userData.cityOnly;_r.visible=xr.visible=vn!=="city";}
    battlefieldSupport?.update(0,{enabled:vn==="city",running:false});
    Vi();
  }
  function hd() {
    let i = Cs[vn].points.length;
    ut("#nextRing").textContent = P.score < i ? String(P.score + 1).padStart(2, "0") : "CLEAR";
    for (let t = 0; t < wn.length; t++) {
      let e = t >= P.score && t < i;
      wn[t].active = e, wn[t].grp.visible = e, wn[t].grp.scale.setScalar(t === P.score ? 1 : t === P.score + 1 ? 0.64 : 0.42);
    }
  }
  function ud() {
    Vi(), Is = true, no = false, pe(Cs[vn].title + " / GO!");
  }
  function dd() {
    if(assetSystem && !assetSystem.ready()) return;
    mr = Number(ut("#missileCount").value) || 4, Vi(), He = true, Is = false, no = false, ut("#welcome").classList.add("hidden"), pe(assetSystem?.inspect().operation==="raid"?"シガンシナ市街地 / 巨人をすべて討伐":assetSystem ? window.RaidModels.types[assetSystem.type()].detail : "TITAN SIGNATURE / BREAK THE ARMOR"), Ze || requestRaidLock(), Ve && Ve.state === "suspended" && Ve.resume();
  }
  var P = { bladeSwing:null,bladeNextSide:1,spearArmed:false,titanForm:false,titanEntering:false,pos: new T(0, 2.3, 76), vel: new T(), grounded: false, gas: 100, airTime: 0, bestAirTime: 0, launchAssist: 0, launchCooldown: 0, gasDelay: 0, airDashCD: 0, vaultTime: 0, score: 0, yaw: 0, pitch: 0, third: false, slash: 0, slashCD: 0, step: 0, boost: false, spares: 5, swap: 0, swapPhase: 0, bank: 0, health: 3, invulnerable: 0, thunderAmmo: 4, thunderMag: 2, thunderReload: 0, thunderSide: 0 }, ae = { forward: 0, right: 0, jump: false, gas: false, left: false, rightHook: false, keys: /* @__PURE__ */ new Set() }, hookOrder = 0, Be = [0, 1].map((i) => ({ name: i ? "RIGHT" : "LEFT", active: false, state: "idle", anchor: new T(), normal: new T(0, 1, 0), reelSpeed: 0, len: 0, age: 0, lockedAge: 0, releaseRadius: 5, order: 0, from: new T(), head: new T(), travel: 0, flightDistance: 0, line: null, tip: null, markers: [] }));
  var cableSegmentCount = 20, cableMetal = $t(6845307, 0.95, 0.3), hookMetal = $t(11253960, 0.9, 0.26);
  for (let side of [0, 1]) {
    let geometry = new Se();
    geometry.setAttribute("position", new Ie(new Float32Array((cableSegmentCount + 1) * 3), 3));
    let edge = new xs(geometry, new Ii({ color: 13753567, transparent: true, opacity: 0.48, depthTest: true }));
    edge.frustumCulled = false;
    edge.visible = false;
    Dt.add(edge);
    Be[side].line = edge;
    let sheath = new li(new Wn(0.023, 0.023, 1, 6), cableMetal, cableSegmentCount);
    sheath.name = "odm-steel-cable-" + side;
    sheath.frustumCulled = false;
    sheath.visible = false;
    Dt.add(sheath);
    Be[side].sheath = sheath;
    let tip = new Me();
    Dt.add(tip);
    tip.visible = false;
    he(tip, new Wn(0.07, 0.07, 0.38, 8), hookMetal, [0, -0.12, 0]);
    he(tip, new vs(0.13, 0.32, 8), hookMetal, [0, 0.2, 0]);
    for (let j = 0; j < 3; j++) {
      let angle = j * Math.PI * 2 / 3;
      let barb = Ut(tip, ot.iron, [Math.sin(angle) * 0.1, -0.14, Math.cos(angle) * 0.1], [0.045, 0.25, 0.07]);
      barb.rotation.set(Math.cos(angle) * 0.45, angle, -Math.sin(angle) * 0.45);
    }
    Be[side].tip = tip;
  }
  var fe = { infinite: false, gravity: "normal", range: 210, maxSpeed: 80, quality: "auto" }, fi = [], vx = id, Fl = [], Za = 74, dr = new Float32Array(Za * 3);
  dr.fill(-2e3);
  var ql = new Se();
  if(window.RaidModels){try{Object.assign(fe,window.RaidModels.readPreferences(localStorage));}catch{}}
  ql.setAttribute("position", new Ie(dr, 3));
  var fd = new ba(ql, new tr({ color: 13169133, size: 0.65, sizeAttenuation: true, transparent: true, opacity: 0.54, depthWrite: false, blending: sa }));
  fd.frustumCulled = false;
  Dt.add(fd);
  for (let i = 0; i < Za; i++) Fl.push({ p: new T(0, -2e3, 0), v: new T(), life: 0 });
  var Il = 0, Pl = 0;
  var gn = 0, He = false, Yu = performance.now(), Ha = 0, _n = 0;
  var pi = false, mr = 4, Ve = null;
  function be(i = 300, t = 0.08, e = "triangle", n = 0.027, s = 120) {
    if(fe.volume===0)return;
    try {
      Ve || (Ve = new (window.AudioContext || window.webkitAudioContext)()), Ve.state === "suspended" && Ve.resume();
      let r = Ve.createOscillator(), a = Ve.createGain();
      r.type = e, r.frequency.setValueAtTime(i, Ve.currentTime), r.frequency.exponentialRampToValueAtTime(Math.max(35, s), Ve.currentTime + t), a.gain.setValueAtTime(n*(fe.volume??.65), Ve.currentTime), a.gain.exponentialRampToValueAtTime(1e-3, Ve.currentTime + t), r.connect(a), a.connect(Ve.destination), r.start(), r.stop(Ve.currentTime + t + 8e-3);
    } catch {
    }
  }
  var punchNoiseBuffer=null;
  function playPunchContact(guarded,hardened){
    be(guarded?155:hardened?76:92,guarded?.08:.19,"sine",guarded?.035:.08,guarded?85:38);
    if(fe.volume===0||!Ve)return;
    try{
      if(!punchNoiseBuffer){punchNoiseBuffer=Ve.createBuffer(1,Math.ceil(Ve.sampleRate*.085),Ve.sampleRate);const data=punchNoiseBuffer.getChannelData(0);for(let n=0;n<data.length;n++)data[n]=(Math.random()*2-1)*Math.pow(1-n/data.length,3);}
      const source=Ve.createBufferSource(),filter=Ve.createBiquadFilter(),gain=Ve.createGain();
      source.buffer=punchNoiseBuffer;filter.type="lowpass";filter.frequency.value=guarded?2900:hardened?2100:1050;
      gain.gain.setValueAtTime((guarded?.10:hardened?.20:.15)*(fe.volume??.65),Ve.currentTime);gain.gain.exponentialRampToValueAtTime(.001,Ve.currentTime+.085);
      source.connect(filter);filter.connect(gain);gain.connect(Ve.destination);source.start();source.stop(Ve.currentTime+.09);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};
    }catch{}
  }
  function pe(i) {
    let t = ut("#notice");
    t.textContent = i, t.classList.add("show"), Ha = 1.5;
  }
  var Wx = new T(), Xx = new T(), qx = new T(), Yx = new T(), Zx = new T(), Zu = new T(), md = new T(0, 1, 0), Ga = new hr();
  Ga.far = 155;
  function Zn() {
    return new T(-Math.sin(P.yaw) * Math.cos(P.pitch), Math.sin(P.pitch), -Math.cos(P.yaw) * Math.cos(P.pitch));
  }
  function Yl(i) {
    let t = i === 0 ? -1 : 1, e = new T(Math.cos(P.yaw), 0, -Math.sin(P.yaw)), n = new T(-Math.sin(P.yaw), 0, -Math.cos(P.yaw));
    return P.pos.clone().addScaledVector(e, 0.77 * t).addScaledVector(n, -0.76).add(new T(0, -1.12, 0));
  }
  var odmAimPreview = null, odmAimChecked = -1;
  function gd(i = 0) {
    if (i === -1 && gn - odmAimChecked < 0.065) return odmAimPreview;
    let done = (hit) => {
      if (i === -1) {
        odmAimPreview = hit;
        odmAimChecked = gn;
      }
      return hit;
    };
    let targets = ki.filter((m) => m.visible&&(!m.userData.enemy||m.userData.enemy.alive)&&!(m.userData.cityOnly && vn !== "city") && !(m.userData.cityLegacyWall && vn === "city"));
    Ga.far = fe.range;
    Zu.copy(Zn());
    Ga.set(P.pos, Zu);
    let direct = Ga.intersectObjects(targets, false)[0];
    if (direct && direct.distance <= 2.8) return done(null);
    if (P.pos.y < 9 && (!direct ? P.pitch > -0.35 && P.pitch < 0.4 : direct.point.y < P.pos.y + 8)) {
      for (let lift of [0.2, 0.35, 0.5]) {
        let dir = new T(-Math.sin(P.yaw) * Math.cos(P.pitch + lift), Math.sin(P.pitch + lift), -Math.cos(P.yaw) * Math.cos(P.pitch + lift));
        Ga.set(P.pos, dir);
        let hit = Ga.intersectObjects(targets, false)[0];
        if (hit && hit.distance > 2.8 && hit.point.y > P.pos.y + 8 && (!direct ? hit.distance < Math.min(fe.range, 120) : Math.hypot(hit.point.x - direct.point.x, hit.point.z - direct.point.z) < Math.max(12, direct.distance * 0.28))) {
          hit.odmLiftAssist = true;
          return done(hit);
        }
      }
    }
    return done(direct || null);
  }
  function _d(i) {
    if(assetSystem?.isTitan?.())return;
    let t = Be[i];
    if (t.state !== "idle") return;
    const direct=gd(i);let e = assetSystem?.getAssistedAnchor?.(i,Zn(),direct)||direct;
    if (!e) {
      be(190, 0.11, "triangle", 0.014, 90);
      return;
    }
    t.combatAssist=!!e.combatAssist;t.combatCanRelease=false;t.combatGuide=e.combatGuide||null;t.combatPhase=e.combatPhase||null;
    t.followObject = e.object.userData.titanPart ? e.object : null; t.followPoint = t.followObject ? e.object.worldToLocal(e.point.clone()) : null;
    t.active = true, t.state = "firing", t.order = ++hookOrder, t.anchor.copy(e.point), t.normal.copy(e.face ? e.face.normal : new T(0, 1, 0)).transformDirection(e.object.matrixWorld), t.from.copy(Yl(i)), t.head.copy(t.from), t.age = 0, t.travel = 0, t.flightDistance = t.from.distanceTo(t.anchor), t.line.visible = true, t.sheath.visible = true, t.tip.visible = true, be(i === 0 ? 310 : 350, 0.09, "triangle", 0.022, 95), _n = 0.035;
  }
  function xd(i) {
    let t = Be[i];
    t.state !== "idle" && (t.combatAssist=false,t.combatCanRelease=false,t.combatGuide=null,t.combatPhase=null,t.active = false, t.state = "idle", t.line.visible = false, t.sheath.visible = false, t.tip.visible = false, t.reelSpeed = 0, be(210, 0.045, "triangle", 0.012, 65));
  }
  function Tn(i) {
    let t = Be[i];
    t.state === "idle" ? _d(i) : xd(i), i === 0 ? ae.left = t.state !== "idle" : ae.rightHook = t.state !== "idle";
  }
  var autoWireHeld = false;
  function pressAutoWire() {
    if(assetSystem?.isTitan?.())return;
    if (autoWireHeld) return;
    autoWireHeld = true, Be[0].state === "idle" && _d(0), Be[1].state === "idle" && _d(1), ae.left = Be[0].state !== "idle", ae.rightHook = Be[1].state !== "idle";
  }
  function releaseAutoWire() {
    autoWireHeld && (autoWireHeld = false, yr());
  }
  function yr() {
    autoWireHeld = false, xd(0), xd(1), hookOrder = 0, ae.left = false, ae.rightHook = false, ut("#leftTouch").classList.remove("pressed"), ut("#rightTouch").classList.remove("pressed");
  }
  function launchOdm(automatic = false) {
    if (P.launchCooldown > 0) return;
    const combatLaunch=automatic&&Be.some(w=>w.combatAssist&&w.state==="locked");
    P.vel.y = Math.max(P.vel.y, combatLaunch ? 6 : automatic ? 21 : 19);
    P.grounded = false;
    P.launchAssist = combatLaunch ? .14 : 0.65;
    P.launchCooldown = 0.8;
    P.gasDelay = 0.6;
    P.gas = Math.max(0, P.gas - (automatic ? 3 : 0));
    for (let wire of Be) if (wire.state === "locked") wire.len += 3;
    be(150, 0.17, "triangle", 0.025, 65);
  }
  function yx(dt2) {
    let justLocked = false;
    for (let wire of Be) if (wire.state !== "idle") {
      wire.age += dt2;
      if (wire.state === "locked") wire.lockedAge += dt2;
      if (wire.state === "firing") {
        wire.travel += dt2 * 240;
        let phase = Math.min(1, wire.travel / Math.max(1, wire.flightDistance));
        wire.head.lerpVectors(wire.from, wire.anchor, phase);
        if (phase >= 1) {
          wire.state = "locked";
          wire.lockedAge = 0;
          wire.releaseRadius = wire.followObject?.userData.titanPart ? 1 : Math.min(5, Math.max(1.2, P.pos.distanceTo(wire.anchor) * 0.45));
          wire.len = Math.max(3.5, P.pos.distanceTo(wire.anchor));
          wire.tip.position.copy(wire.anchor);
          justLocked = true;
          be(185, 0.075, "triangle", 0.025, 75);
        }
      }
    }
    if (justLocked && (P.grounded || P.pos.y < 5)) launchOdm(true);
  }
  var cableMatrix = new ee(), cableRotation = new fn(), cableScale = new T(), cableMid = new T(), cableUp = new T(0, 1, 0),cablePoint=new T(),cablePrevious=new T(),cableDelta=new T(),cableDirection=new T();
  function Mx(dt2) {
    for (let side = 0; side < 2; side++) {
      let wire = Be[side];
      if (wire.state === "idle") continue;
      let start = Yl(side), end = wire.state === "locked" ? wire.anchor : wire.head, dist = start.distanceTo(end), slack = wire.state === "locked" ? Math.max(0, wire.len - dist) : 0;
      let sag = Math.min(slack * 0.22, 1.8), positions = wire.line.geometry.attributes.position, previous = null;
      for (let j = 0; j <= cableSegmentCount; j++) {
        let phase = j / cableSegmentCount, point = cablePoint.lerpVectors(start, end, phase);
        point.y -= Math.sin(Math.PI * phase) * sag;
        let twang = wire.state === "locked" ? Math.exp(-wire.age * 5) * 0.025 * Math.sin(phase * 18 - gn * 28) * Math.sin(Math.PI * phase) : 0;
        point.x += twang;
        positions.setXYZ(j, point.x, point.y, point.z);
        if (previous) {
          let delta = cableDelta.subVectors(point,previous), len = delta.length();
          cableRotation.setFromUnitVectors(cableUp, delta.normalize());
          cableMid.copy(point).add(previous).multiplyScalar(0.5);
          cableScale.set(1, len, 1);
          cableMatrix.compose(cableMid, cableRotation, cableScale);
          wire.sheath.setMatrixAt(j - 1, cableMatrix);
        }
        cablePrevious.copy(point);previous = cablePrevious;
      }
      positions.needsUpdate = true;
      wire.sheath.instanceMatrix.needsUpdate = true;
      wire.tip.position.copy(end);
      let direction = cableDirection.subVectors(end,start);
      if (direction.lengthSq() > 1e-3) wire.tip.quaternion.setFromUnitVectors(cableUp, direction.normalize());
    }
  }
  function vd() {
    let i = (ae.keys.has("KeyW") ? 1 : 0) - (ae.keys.has("KeyS") ? 1 : 0), t = (ae.keys.has("KeyD") ? 1 : 0) - (ae.keys.has("KeyA") ? 1 : 0);
    i += -ae.forward, t += ae.right;
    let e = Math.hypot(i, t);
    return e > 1 && (i /= e, t /= e), { f: i, r: t };
  }
  function Vi() {
    disarmSpear();titanCameraController?.reset();
    battlefieldSupport?.reset();
    pendingVictory=0;hitStopRemaining=0;impactCanvas.style.opacity="0";impactLabel.className="";impactLabel.textContent="";lastBladeImpact=null;lastPunchImpact=null;punchImpactCount=0;punchCameraImpact=null;
    if(focusPaused){focusPaused=false;Ye=false;ut("#pauseHint").style.display="none";}
    yr();
    odmAimChecked = -1;
    let i = Cs[vn];
    V.attackState = "idle", V.attackTimer = 0, V.recovery = 0, V.attackCooldown = 14, V.slamRing.visible = false, hookOrder = 0, P.score = 0, Xn = 0, Is = false, no = false, pi = false, ut("#endOverlay").classList.remove("show"), dx();
    for (let t of kl) t.hp = 3, t.hit = 0, t.resetAt = 0, t.body.material = dummyWood, t.grp.rotation.set(0, 0, 0);
    for (let t of fi) Dt.remove(t.root);
    fi.length = 0;
    for (let t = 0; t < wn.length; t++) {
      let e = wn[t];
      e.base.set(...i.points[t]), e.grp.position.copy(e.base), e.active = true, e.grp.visible = true;
    }
    P.pos.set(...i.start), P.vel.set(0, 0, 0), P.gas = 100, P.airTime = 0, P.launchAssist = 0, P.launchCooldown = 0, P.airDashCD = 0, P.gasDelay = 0, P.vaultTime = 0, P.health = 3, P.invulnerable = 0, P.thunderAmmo = mr, P.thunderMag = Math.min(2, mr), P.thunderReload = 0, ut("#ui").classList.remove("danger"), P.spares = 5, P.swap = 0, P.swapPhase = 0, P.slash = 0, P.slashCD = 0;P.bladeSwing=null;P.bladeNextSide=1;
    for (let t of [...Ka, ...vr]) for (let e of t.sword.userData.bladeParts) e.visible = true;
    ut("#bladeCount").textContent = P.spares, ut("#bladeMode").textContent = "READY", P.pitch = 0.28, P.yaw = vn === "forest" ? -1.3 : 0, P.grounded = false, ut("#runTime").textContent = "00:00.00", ut("#bestTime").textContent = ws(Ni), hd(), ut("#notice").classList.remove("show"), Ha = 0; if(assetSystem)assetSystem.reset();
  }
  function so() {
    if(assetSystem?.isTitan?.())return;
    P.third = !P.third, ut("#viewBtn").textContent = P.third ? "FPS VIEW" : "3RD VIEW", ut("#viewMobile").textContent = P.third ? "VIEW : 3RD" : "VIEW : FPS", pe(P.third ? "GEAR MODEL / THIRD PERSON" : "FIRST PERSON VIEW");
  }
  function ro() {
    if(assetSystem?.isTitan?.()){if(He&&!Ye&&!pi)assetSystem.punch();return;}
    if(P.spearArmed){Wl();return;}
    if(!He||Ye||pi||P.slashCD>0||P.swap>0||assetSystem?.getAssistStatus?.()?.dashing)return;
    P.bladeSwing={time:0,side:P.bladeNextSide,assisted:false,connected:false};P.bladeNextSide*=-1;
    P.slash=1;P.slashCD=.28;_n=.025;be(320,.14,"triangle",.024,680);
    if(assetSystem?.beginAssistedSlash?.(Zn()))return;
    if(!assetSystem?.beginAssistedSlash){resolveFreeBladeSwing();return;}
    P.bladeSwing.freePending=true;
  }
  function resolveFreeBladeSwing(){
    if(fx()){if(P.bladeSwing)P.bladeSwing.connected=true;return;}
    let i = Zn();
    for (let t of kl) {
      if (t.hp <= 0) continue;
      let e = t.grp.position.clone().add(new T(0, 1.9, 0)).sub(P.pos);
      if (!(e.length() > 6.2 || e.normalize().dot(i) < 0.44)) {
        t.hp--, t.hit = 0.25, t.resetAt = gn + 3.8, t.body.material = t.hp ? dummyMetal : ot.orange, be(140, 0.13, "square", 0.033, 80), t.hp === 0 && (t.grp.rotation.z = (Math.random() - 0.5) * 0.7, pe("TARGET DISABLED / PRACTICE HIT"));
        break;
      }
    }
  }
  function yd() {
    if(assetSystem?.isTitan?.()||assetSystem?.getAssistStatus?.()?.dashing)return;
    disarmSpear();
    !He || Ye || pi || P.swap > 0 || P.spares <= 0 || (P.swap = 1.1, P.swapPhase = 0, P.spares--, ut("#bladeCount").textContent = P.spares, ut("#bladeMode").textContent = "EJECT / LOAD", be(460, 0.11, "triangle", 0.028, 180));
  }
  function Sx() {
    let i = Zn(), t = new T(Math.cos(P.yaw), 0, -Math.sin(P.yaw));
    for (let e of [-1, 1]) {
      let n = new Me();
      if (Dt.add(n), he(n, vx, ot.blade, [0, 0, 0]).scale.setScalar(0.88), n.position.copy(P.pos).addScaledVector(t, 0.56 * e).addScaledVector(i, -0.17), n.position.y -= 0.6, n.rotation.set(0, P.yaw, e * 0.25), fi.push({ root: n, v: P.vel.clone().multiplyScalar(0.35).addScaledVector(t, e * 5).add(new T(0, 3, 0)), w: new T((Math.random() - 0.5) * 6, e * 3, (Math.random() - 0.5) * 8), life: 0, rest: false }), fi.length > 34) {
        let r = fi.shift();
        Dt.remove(r.root);
      }
    }
    for (let e of [...Ka, ...vr]) for (let n of e.sword.userData.bladeParts) n.visible = false;
    be(225, 0.13, "triangle", 0.025, 80);
  }
  function bx(i) {
    if (P.swap > 0) {
      if (P.swap = Math.max(0, P.swap - i), P.swap < 0.82 && P.swapPhase === 0 && (P.swapPhase = 1, Sx()), P.swap < 0.34 && P.swapPhase === 1) {
        P.swapPhase = 2;
        for (let t of [...Ka, ...vr]) for (let e of t.sword.userData.bladeParts) e.visible = true;
        be(620, 0.09, "triangle", 0.019, 900);
      }
      P.swap === 0 && (ut("#bladeMode").textContent = "READY");
    }
    for (let t = fi.length - 1; t >= 0; t--) {
      let e = fi[t];
      e.life += i, e.rest || (e.v.y -= 18 * i, e.root.position.addScaledVector(e.v, i), e.root.rotation.x += e.w.x * i, e.root.rotation.y += e.w.y * i, e.root.rotation.z += e.w.z * i, e.root.position.y < 0.06 && (e.root.position.y = 0.06, e.root.rotation.set(Math.PI / 2, e.root.rotation.y, 0), e.v.set(0, 0, 0), e.rest = true)), e.life > 12 && (Dt.remove(e.root), fi.splice(t, 1));
    }
  }
  function rn(i, t, e) {
    return Math.max(t, Math.min(e, i));
  }
  var Ui = 1.78, ui = 0.43;
  function Ex(previous) {
    let pos = P.pos, feet = pos.y - Ui, oldFeet = previous.y - Ui;
    P.grounded = false;
    if (feet < 0) {
      pos.y = Ui;
      if (P.vel.y < 0) P.vel.y = 0;
      P.grounded = true;
      feet = 0;
    }
    for (let box of Ku) {
      if (!box.mesh.visible || box.mesh.userData.cityOnly && vn !== "city" || box.mesh.userData.cityLegacyWall && vn === "city" || pos.y + 0.25 < box.bottom) continue;
      let dx2 = pos.x - box.x, dz = pos.z - box.z;
      if (Math.abs(dx2) > box.hx + ui || Math.abs(dz) > box.hz + ui) continue;
      let radius=box.radius===undefined?null:box.radius+(box.radiusTop-box.radius)*rn((pos.y-box.bottom)/(box.h-box.bottom),0,1);
      if(radius!==null&&Math.hypot(dx2,dz)>radius+ui)continue;
      const roofSlope=box.roofShape==="hip"?Math.max(Math.abs(dx2)/box.hx,Math.abs(dz)/box.hz):box.roofAxis==="z"?Math.abs(dz)/box.hz:Math.abs(dx2)/(box.hx+.6);
      let top = box.h + (box.roofHeight || 0) * Math.max(0, 1-roofSlope);
      if (P.vel.y <= 0 && oldFeet >= top - 0.55 && feet <= top && feet >= top - 2.3) {
        pos.y = top + Ui;
        P.vel.y = 0;
        P.grounded = true;
        feet = top;
        continue;
      }
      if(box.bottom>0&&P.vel.y>0&&previous.y+.25<=box.bottom+.05&&pos.y+.25>=box.bottom){pos.y=box.bottom-.25;P.vel.y=0;continue;}
      if (feet >= top - 0.03) continue;
      if(radius!==null){let distance=Math.hypot(dx2,dz);let nx=distance>.0001?dx2/distance:1,nz=distance>.0001?dz/distance:0;pos.x=box.x+nx*(radius+ui);pos.z=box.z+nz*(radius+ui);let inward=P.vel.x*nx+P.vel.z*nz;if(inward<0){P.vel.x-=inward*nx;P.vel.z-=inward*nz;}continue;}
      let penX = box.hx + ui - Math.abs(dx2), penZ = box.hz + ui - Math.abs(dz);
      if (penX < penZ) {
        let sign = dx2 >= 0 ? 1 : -1;
        pos.x = box.x + sign * (box.hx + ui);
        if (P.vel.x * sign < 0) {
          if (P.vaultTime > 0) P.vel.y = Math.max(P.vel.y, Math.min(25, Math.abs(P.vel.x) * 0.7 + 10));
          P.vel.x = 0;
        }
      } else {
        let sign = dz >= 0 ? 1 : -1;
        pos.z = box.z + sign * (box.hz + ui);
        if (P.vel.z * sign < 0) {
          if (P.vaultTime > 0) P.vel.y = Math.max(P.vel.y, Math.min(25, Math.abs(P.vel.z) * 0.7 + 10));
          P.vel.z = 0;
        }
      }
    }
  }
  function wx(dt2) {
    if (!He) return;
    if(P.bladeSwing){if(P.titanForm||P.spearArmed||P.swap>0)P.bladeSwing=null;else {P.bladeSwing.time+=dt2;if(P.bladeSwing.freePending&&P.bladeSwing.time>=.185){P.bladeSwing.freePending=false;resolveFreeBladeSwing();}if(P.bladeSwing.time>=.46)P.bladeSwing=null;}}
    if(assetSystem?.stepPlayer?.(dt2,vd(),ae.gas))return;
    let pos = P.pos, vel = P.vel, previous = pos.clone(), control = vd(), forward = new T(-Math.sin(P.yaw), 0, -Math.cos(P.yaw)), right = new T(Math.cos(P.yaw), 0, -Math.sin(P.yaw));
    P.launchAssist = Math.max(0, P.launchAssist - dt2);
    P.launchCooldown = Math.max(0, P.launchCooldown - dt2);
    P.airDashCD = Math.max(0, P.airDashCD - dt2);
    P.gasDelay = Math.max(0, P.gasDelay - dt2);
    P.vaultTime = Math.max(0, P.vaultTime - dt2);P.combatGrace=Math.max(0,(P.combatGrace||0)-dt2);
    yx(dt2);
    let hooked = Be.some((w) => w.state === "locked"), input = new T().addScaledVector(forward, control.f).addScaledVector(right, control.r);
    if (input.lengthSq() > 1) input.normalize();
    input.multiplyScalar(P.grounded ? 43 : hooked ? 24 : 20);
    let horizontalSpeed = Math.hypot(vel.x, vel.z), glide = rn((horizontalSpeed - 18) / 45, 0, 1), baseGravity = fe.gravity === "low" ? 8 : fe.gravity === "high" ? 25 : 16;
    input.y = -baseGravity * (P.grounded ? 1 : 1 - glide * 0.52)*(P.combatGrace>0?.15:1);
    let boost = ae.gas && (fe.infinite || P.gas > 0.2);
    if (boost) {
      input.addScaledVector(Zn(), 32);
      input.y += 2;
      P.gasDelay = 0.8;
      if (!fe.infinite) P.gas = Math.max(0, P.gas - dt2 * 10.5);
    } else if (P.gasDelay === 0) P.gas = Math.min(100, P.gas + dt2 * (P.grounded ? 25 : 5.5));
    P.boost = boost || P.launchAssist > 0.25;
    let primaryWire = Be.filter((w) => w.state === "locked").reduce((a, b) => !a || b.order > a.order ? b : a, null);
    if (primaryWire) {
      let gap = primaryWire.anchor.distanceTo(pos), before = primaryWire.len, winch = rn(12 + gap * 0.18, 18, boost ? 46 : 32) * (fe.maxSpeed / 60);
      primaryWire.len = Math.max(3.5, Math.min(before - winch * dt2, gap + (P.launchAssist > 0 ? 2 : 0.5)));
      primaryWire.reelSpeed = Math.max(0, (before - primaryWire.len) / dt2);
    }
    for (let wire of Be) {
      if (wire.state !== "locked") {
        wire.reelSpeed = 0;
        continue;
      }
      let delta = wire.anchor.clone().sub(pos), gap = delta.length();
      if (gap < 0.5) continue;
      let dir = delta.divideScalar(gap), support = wire !== primaryWire;
      if (support) {
        let before = wire.len, feasible = wire.anchor.distanceTo(primaryWire.anchor) - primaryWire.len + 3.5;
        wire.len = Math.max(3.5, feasible, Math.min(before - 12 * dt2, gap + 0.5));
        wire.reelSpeed = Math.max(0, (before - wire.len) / dt2);
      }
      if(wire.combatAssist)continue;
      let extension = gap - wire.len, toward = vel.dot(dir);
      if (extension > -0.3) input.addScaledVector(dir, Math.min(support ? 24 : 80, (Math.max(0, extension) * 34 + Math.max(0, -toward) * 2.4) * (support ? 0.3 : 1)));
    }
    if (hooked && !boost && Math.hypot(control.f, control.r) < 0.1) {
      let wire = Be.filter((w) => w.state === "locked").reduce((a, b) => a.order > b.order ? a : b), delta = (wire.combatGuide||wire.anchor).clone().sub(pos), gap = delta.length();
      if (gap > 0.1) {
        let desired = delta.multiplyScalar(1 / gap).multiplyScalar(wire.combatAssist?rn(gap*1.8,9,42):rn(gap * 1.45, 16, Math.min(68, fe.maxSpeed * 0.85))), mix = 1 - Math.exp(-dt2 * (wire.combatAssist?8:3.2));
        vel.x += (desired.x - vel.x) * mix;
        vel.z += (desired.z - vel.z) * mix;
        if (P.launchAssist <= 0) {
          let vertical = Math.max(desired.y, -(pos.y < 12 ? 3 : 18));
          if (vertical > vel.y) vel.y += (vertical - vel.y) * mix;
          else vel.y += (vertical - vel.y) * mix * (wire.combatAssist?1:.32);
        }
      }
    }
    if (P.launchAssist > 0) input.y = Math.max(input.y, 5);
    vel.addScaledVector(input, dt2);
    let drag = Math.exp(-dt2 * (P.grounded ? 5.3 : boost ? 0.022 : 0.038));
    vel.x *= drag;
    vel.z *= drag;
    vel.y *= Math.exp(-dt2 * 0.012);
    if (P.launchAssist <= 0) for (let wire of Be) {
      if (wire.state !== "locked"||wire.combatAssist) continue;
      let offset = pos.clone().sub(wire.anchor), gap = offset.length();
      if (gap > wire.len + 0.2 && gap > 0.2) {
        offset.divideScalar(gap);
        let outward = vel.dot(offset);
        if (outward > 0) vel.addScaledVector(offset, -outward * 0.96);
      }
    }
    let limit = Math.max(20, fe.maxSpeed - (mr - 2) * 0.7);
    if (hooked) limit *= boost ? 0.92 : 0.78;
    if(Be.some(w=>w.state==="locked"&&w.combatAssist))limit=Math.min(limit,44);
    if (vel.lengthSq() > limit * limit) vel.setLength(limit);
    pos.addScaledVector(vel, dt2);
    let nearRelease = false;
    for (let side = 0; side < 2; side++) {
      let wire = Be[side];
      if (wire.state !== "locked") continue;
      if(wire.combatAssist&&((wire.combatPhase!=="strike"&&wire.combatPhase!=="staging")||!wire.combatCanRelease))continue;
      let path = pos.clone().sub(previous), den = path.lengthSq(), closest = previous.clone().addScaledVector(path, den ? rn(wire.anchor.clone().sub(previous).dot(path) / den, 0, 1) : 0),stagingArrival=wire.combatAssist&&wire.combatPhase==="staging"&&wire.combatGuide&&pos.distanceTo(wire.combatGuide)<=1;
      if (wire.lockedAge >= 0.22 && (stagingArrival||pos.distanceTo(wire.anchor) <= wire.releaseRadius || closest.distanceTo(wire.anchor) <= wire.releaseRadius)) {
        if(wire.combatAssist){P.vel.multiplyScalar(wire.combatPhase==="staging" ? .72 : .25);P.combatGrace=.8;}
        if (!nearRelease && !wire.combatAssist && wire.normal.y < 0.45) {
          let into = vel.dot(wire.normal);
          if (into < 0) vel.addScaledVector(wire.normal, -into * 0.72);
          vel.y = Math.max(vel.y, 14);
          P.vaultTime = 0.5;
        }
        xd(side);
        if (side === 0) ae.left = false;
        else ae.rightHook = false;
        nearRelease = true;
      }
    }
    Ex(previous);
    if(assetSystem)assetSystem.resolvePlayer(previous);
    let ceiling = vn === "city" ? 244 : 196, sideLimit = vn === "city" ? 560 : 282, southLimit = vn === "city" ? 620 : 282;
    if (pos.y > ceiling) {
      pos.y = ceiling;
      if (vel.y > 0) vel.y = 0;
    }
    if (Math.abs(pos.x) > sideLimit) {
      pos.x = rn(pos.x, -sideLimit, sideLimit);
      vel.x = 0;
    }
    if (pos.z > southLimit || pos.z < -sideLimit) {
      pos.z = rn(pos.z, -sideLimit, southLimit);
      vel.z = 0;
    }
    if (P.grounded) P.airTime = 0;
    else {
      P.airTime += dt2;
      P.bestAirTime = Math.max(P.bestAirTime, P.airTime);
    }
    if (pos.y < -30 || !Number.isFinite(pos.x)) Vi();
  }
  function Md() {
    if(assetSystem?.isTitan?.()){if(He&&!Ye&&!pi)assetSystem.jump();return;}
    if (!He||Ye||pi) return;
    if (P.grounded || P.pos.y < 2.5) {
      P.launchCooldown = 0;
      launchOdm(false);
      return;
    }
    if (P.airDashCD > 0 || !fe.infinite && P.gas < 9) return;
    P.airDashCD = 0.65;
    P.gasDelay = 0.8;
    if (!fe.infinite) P.gas -= 9;
    let forward = Zn();
    P.vel.addScaledVector(forward, 10);
    P.vel.y = Math.max(P.vel.y, 17);
    P.launchAssist = 0.32;
    be(190, 0.12, "triangle", 0.022, 75);
  }
  var Tx = ut("#speed"), Ax = ut("#alt"), Rx = ut("#gasReadout"), Cx = ut("#gasBar"), Px = ut("#reticle"), Ju = ut("#midPrompt");
  function Lx(i) {
    if (P.boost) for (Pl += i * (Ze ? 35 : 55); Pl >= 1; ) {
      Pl--;
      let t = Il % 2, e = Fl[Il % Za];
      Il++;
      let n = new T(Math.sin(P.yaw), 0, Math.cos(P.yaw));
      e.p.copy(Yl(t)).addScaledVector(n, 0.28), e.life = 0.13 + Math.random() * 0.15, e.v.copy(P.vel).multiplyScalar(0.15).addScaledVector(n, 4 + Math.random() * 3), e.v.y -= 4 + Math.random() * 3;
    }
    for (let t = 0; t < Za; t++) {
      let e = Fl[t];
      e.life > 0 ? (e.life -= i, e.p.addScaledVector(e.v, i), e.v.multiplyScalar(Math.exp(-i * 1.8))) : e.p.set(0, -2e3, 0), dr[t * 3] = e.p.x, dr[t * 3 + 1] = e.p.y, dr[t * 3 + 2] = e.p.z;
    }
    ql.attributes.position.needsUpdate = true;
  }
  var raidCameraRay = new hr(),titanCameraController=window.RaidModels?.createTitanCamera?.();
  function clipTitanCamera(from,to){const delta=to.clone().sub(from),length=delta.length();if(length<.05)return to;const blocked=raidObstacle(from,delta.divideScalar(length),length+.4);if(blocked)return from.clone().addScaledVector(delta,Math.max(.12,blocked.distance-.45));return to;}
  function updateRaidCamera(player, desired, dt2) {
    let blockers = ki.filter((mesh) => mesh.visible && !mesh.userData.titanPart && !(mesh.userData.cityOnly && vn !== "city") && !(mesh.userData.cityLegacyWall && vn === "city"));
    function clip(point) {
      let direction = point.clone().sub(player), distance = direction.length();
      if (distance < 0.05) return false;
      raidCameraRay.set(player, direction.divideScalar(distance));
      raidCameraRay.near = 0.05;
      raidCameraRay.far = distance + 0.4;
      let hit = raidCameraRay.intersectObjects(blockers, false)[0];
      if (hit) point.copy(player).addScaledVector(direction, Math.max(0.12, hit.distance - 0.4));
      return !!hit;
    }
    let blocked = clip(desired), candidate = blocked ? desired : qe.position.clone().lerp(desired, rn(dt2 * 8, 0, 1));
    clip(candidate);
    qe.position.copy(candidate);
    qe.position.y = Math.max(0.4, qe.position.y);
  }
  // Shoulder-led horizontal draw cut. The second hand follows 65ms later;
  // both blades use the same sweep direction instead of meeting in an X.
  function raidBladePose(side){
    const swing=P.bladeSwing,lead=!swing||side===swing.side,d=swing?.side||1,time=swing?Math.max(0,swing.time-(lead?0:.065)):.46;
    const idle=[side*.6,-.67,-1,-.89,side*.18,-side*.16];
    if(!swing)return idle;
    const frames=lead?[
      [0,...idle],[.065,d*.82,-.51,-.82,-1.08,-d*.5,-d*.65],
      [.185,-d*.10,-.48,-1.22,-.6,d*.75,d*1.1],
      [.3,-d*.6,-.78,-.72,-.35,d*1.2,d*1.65],[.46,...idle]
    ]:[
      [0,...idle],[.065,-d*.72,-.76,-.86,-1.02,-d*.25,d*.25],
      [.185,-d*.32,-.62,-1.12,-.7,d*.45,d*.85],
      [.29,d*.28,-.79,-.86,-.48,d*.8,d*1.15],[.395,...idle]
    ];
    let a=frames[0],b=frames[frames.length-1];for(let k=1;k<frames.length;k++)if(time<=frames[k][0]){a=frames[k-1];b=frames[k];break;}
    const u=rn((time-a[0])/Math.max(.001,b[0]-a[0]),0,1),ease=u*u*(3-2*u);return idle.map((_,k)=>a[k+1]+(b[k+1]-a[k+1])*ease);
  }
  function animateRaidBlades(){
    const swing=P.bladeSwing,R=P.swap>0?Math.sin((1.1-P.swap)/1.1*Math.PI):0,phase=swing?Math.sin(rn(swing.time/.46,0,1)*Math.PI):0,twist=(swing?.side||1)*phase;
    for(const {arm,side} of vr){const p=raidBladePose(side);arm.position.set(p[0],p[1]-R*.24,p[2]);arm.rotation.set(p[3]+R*.33,p[4],p[5]+side*R*.32);}
    // Keep the camera aim under mouse control; the body and weapon carry the turn.
    Es.rotation.y+=twist*.09;Es.rotation.z+=twist*.035;
    _e.rotation.y=twist*.58;_e.rotation.z+=twist*.18;Qa.rotation.y=-twist*.25;
    for(const {arm,elbow,side} of raidHumanArms){const p=raidBladePose(side);arm.rotation.set((p[3]+.89)*1.1-.2, p[4]*.65, p[5]*.8);elbow.rotation.x=-.3-phase*(side===(swing?.side)? .15:.3);}
  }
  function Ux(i) {
    let t = P.pos, e = vd(),titanFov=null,duelStatus=assetSystem?.isTitan?.()?assetSystem.getCombatStatus?.():null;
    if(punchCameraImpact){punchCameraImpact.age+=i;if(punchCameraImpact.age>.28)punchCameraImpact=null;}
    raidHitTime=Math.max(0,raidHitTime-i);if(raidHitTime===0)ut("#reticle").classList.remove("hit");
    P.slashCD = Math.max(0, P.slashCD - i), P.slash = Math.max(0, P.slash - i * 3.8), _n *= Math.exp(-i * 13), P.step += i, P.invulnerable = Math.max(0, P.invulnerable - i);
    let n = Zn(), s = new T(Math.cos(P.yaw), 0, -Math.sin(P.yaw)), r = P.vel.dot(s), a = P.vel.length(), o = rn(-r * 3e-3 - e.r * 0.04, -0.18, 0.18);
    P.bank += (o - P.bank) * Math.min(1, i * 4.2);
    let c = P.pitch + _n * Math.sin(gn * 98), l = P.yaw + _n * 0.3 * Math.cos(gn * 75);
    if(assetSystem?.isTitan?.()){
      const view=titanCameraController?.update({position:t,yaw:P.yaw,pitch:P.pitch,target:duelStatus?.opponent,dt:i,occlude:clipTitanCamera});if(view){qe.position.copy(view.position);if(punchCameraImpact){const kick=punchCameraImpact.power*Math.exp(-punchCameraImpact.age*18);qe.position.addScaledVector(punchCameraImpact.direction,-kick);qe.position.y+=kick*.22;}qe.position.x+=_n*Math.sin(gn*79);qe.position.y+=_n*Math.cos(gn*91);qe.position.copy(clipTitanCamera(t.clone().add(new T(0,-2,0)),qe.position));qe.up.set(0,1,0);qe.lookAt(view.lookAt);titanFov=view.fov;}Es.visible=false;_e.visible=false;
    }else if (P.third) {
      let x = t.clone().addScaledVector(n, 2), _ = t.clone().addScaledVector(n, -6.7).add(new T(0, 2.3, 0));
      updateRaidCamera(t, _, i), qe.up.set(Math.sin(P.bank * 0.65), Math.cos(P.bank * 0.65), 0), qe.lookAt(x), Es.visible = false, _e.visible = true;
    } else {
      qe.position.copy(t).addScaledVector(s, _n * Math.sin(gn * 85)), qe.rotation.set(c, l, P.bank, "YXZ");
      let x = Math.sin(P.step * 8) * (P.grounded ? 0.013 : 3e-3), _ = P.swap > 0 ? Math.sin((1.1 - P.swap) / 1.1 * Math.PI) : 0;
      Es.position.set(x + e.r * 0.02, Math.abs(x) * -0.7 + e.f * 0.025 - 0.22 * _, Math.sin(P.step * 4) * 0.013 + 0.22 * _), Es.rotation.set(P.vel.y * 8e-4, 0, -e.r * 0.018 + P.bank * 0.15), Es.visible = true, _e.visible = false;
    }
    _e.visible = P.third&&!assetSystem?.isTitan?.(), Ya.position.set(t.x, t.y - Ui, t.z), Ya.rotation.y = P.yaw;
    for (let x of Xu.userData.rotors) {
      let _ = Be[x.side < 0 ? 0 : 1];
      _.state === "locked" ? x.rotor.rotation.x += i * Math.min(110, _.reelSpeed * 2.4) * (x.side < 0 ? 1 : -1) : _.state === "firing" && (x.rotor.rotation.x += i * 27 * (x.side < 0 ? 1 : -1));
    }
    for (let x of Xu.userData.nozzles) {
      let _ = P.boost ? 0.28 : -0.07;
      x.rotation.x += (_ - x.rotation.x) * Math.min(1, i * 10);
    }
    _e.rotation.z = P.bank * 1.2, _e.rotation.x = rn(-P.vel.y * 6e-3, -0.42, 0.3), Qa.rotation.x = rn(0.16 + a * 6e-3, 0.1, 1);
    animateRaidBlades();
    for (let x of kl) x.hit > 0 && (x.hit = Math.max(0, x.hit - i), x.grp.rotation.y += i * 7), x.hp <= 0 && gn > x.resetAt && (x.hp = 3, x.body.material = dummyWood, x.grp.rotation.z = 0);
    for (let x = 0; x < wn.length; x++) {
      let _ = wn[x];
      _.active && (_.grp.position.y = _.base.y + Math.sin(gn * 1.15 + _.grp.userData.phase) * 0.35, _.grp.rotation.y += i * 0.5, _.grp.children[0].rotation.z += i * 0.36);
    }
    let h = wn[P.score];
    h && h.active && h.grp.position.distanceTo(t) < 3.3 && (h.active = false, h.grp.visible = false, P.score++, be(900, 0.25, "sine", 0.055, 460), _n = 0.06, P.score >= Cs[vn].points.length ? (Is = false, no = true, Xn > 0 && (!Ni || Xn < Ni) ? (Ni = Xn, xx(Xn), ut("#bestTime").textContent = ws(Ni), pe("NEW BEST / " + ws(Xn))) : pe("COURSE COMPLETE / " + ws(Xn))) : pe("CHECKPOINT " + P.score + " / " + Cs[vn].points.length), hd()), Is && (Xn += i, ut("#runTime").textContent = ws(Xn));
    let d = wn[P.score];
    if (d && d.active) {
      let x = d.base.clone().sub(t);
      ut("#navDistance").textContent = Math.round(x.length()) + " m";
      let D = Math.atan2(-x.x, -x.z) - P.yaw;
      D = Math.atan2(Math.sin(D), Math.cos(D)), ut("#navBearing").style.transform = `rotate(${-D}rad)`;
    } else ut("#navDistance").textContent = "CLEAR";
    Mx(i), bx(i), Lx(i), gx(i), mx(i), eo();
    for (let x of Dt.children) x.userData.beacon && (x.rotation.y += i * 1.2, x.position.y += Math.sin(gn * 1.8 + x.position.x) * i * 0.1);
    let u = gd(-1), p = Gl();if(assetSystem&&!P.spearArmed){const armor=closeBladeArmor();if(armor)p=armor;}
    Px.classList.toggle("ready", !!u), Ju.classList.toggle("show", !!p);
    let g = p ? { armorL: "LEFT ARMOR", armorR: "RIGHT ARMOR", nape: V.napeOpen ? "NAPE / CUT" : "NAPE SEALED", body: "BODY / LOW DAMAGE" }[p.object.userData.titanPart] || "TITAN" : `${Math.round(u?.distance || 0)} M / ANCHOR`;
    Ju.textContent = p ? "THUNDER LOCK / " + g : u ? u.odmLiftAssist ? "\u96E2\u9678\u30A2\u30F3\u30AB\u30FC / " + Math.round(u.distance) + " M" : g : "NO ANCHOR";
    if(assetSystem){const neck=V.weak.getWorldPosition(new T()),offset=neck.clone().sub(P.pos),back=P.pos.clone().sub(neck).dot(new T(0,0,1).applyQuaternion(V.root.quaternion))<.4;const canCut=V.napeOpen&&back&&offset.length()<=8.5&&offset.normalize().dot(Zn())>.28;
      Ju.classList.toggle("show",canCut||!!p);Ju.textContent=canCut?"うなじ / 斬撃可能":p?({armorL:"左肩装甲",armorR:"右肩装甲",nape:"うなじ",body:"胴体"}[p.object.userData.titanPart]+(p.distance<=(p.object.userData.titanPart==="nape"?8.5:8.2)?" / 斬撃圏内":" / 雷槍照準")):"";
    }

    const assist=assetSystem?.getAssistStatus?.(Zn());Px.classList.toggle("locked",!!assist);if(assist){Ju.classList.add("show");Ju.textContent=P.spearArmed?"R / 雷槍発射":assist.ready?(assist.part==="nape"?"クリック / うなじ斬り":"クリック / 装甲を斬る"):assist.atStage&&assist.part==="nape"?(assist.rearAlignment<.78?"さらに背後へ回る":assist.aimAlignment<.75?"うなじへ照準":"斬撃準備完了"):"巨人に接近";}
    if(assetSystem?.isTitan?.()){const duel=duelStatus,form=assetSystem.inspect().hero;Ju.classList.toggle("show",form.state==="titan");Ju.textContent=form.guardBroken>0?"ガードが崩れた / 距離を取れ":form.counterSeconds>0?(form.guarding?"反撃の隙 / ガードを離してクリック":"クリック / カウンター"):form.guarding?"ガード中":duel?.phase==="warning"?(duel.attack==="steam"||duel.attack==="stomp"?"範囲攻撃 / 距離を取れ":"振りかぶり / 右クリックでガード"):duel?.canPunch?(duel.phase==="recovery"?"攻撃後の隙 / 打ち返せ":"拳が届く / クリック"):duel?.opponent?"間合いを詰める":"";Px.classList.toggle("locked",!!duel?.canPunch);}
    let v = Math.round(a * 3.6);
    Tx.textContent = v, Ax.textContent = Math.max(0, Math.round(t.y - Ui)), Rx.textContent = fe.infinite ? "\u221E" : Math.round(P.gas) + "%", Cx.style.width = (fe.infinite ? 100 : P.gas) + "%";
    for (let x = 0; x < 2; x++) {
      let _ = Be[x], D = x === 0 ? "L" : "R";
      ut("#hook" + D).textContent = _.state === "locked" ? Math.round(t.distanceTo(_.anchor)) + " M" : _.state === "firing" ? "FIRING" : "STANDBY", ut("#length" + D).style.width = _.state === "idle" ? "0%" : _.state === "firing" ? "33%" : rn(100 - _.len / fe.range * 100, 5, 100) + "%";
    }
    ut("#velocityLines").style.opacity = 0, ut("#windOverlay").style.opacity = 0, ut("#flash").style.opacity = 0, void 0;
    let f = Ze ? 80 : 76, E = titanFov??(f + rn((a - 19) * 0.16, 0, 7)), nextFov = qe.fov + (E - qe.fov) * Math.min(1, i * 5);
    if (Math.abs(nextFov - qe.fov) > 0.01) {
      qe.fov = nextFov;
      qe.updateProjectionMatrix();
    }
    Ha > 0 && (Ha -= i, Ha <= 0 && ut("#notice").classList.remove("show"));
  }
  var Va = 0, Ye = false, focusPaused=false, _titanMenuRendered = false;
  function Sd(i) {
    requestAnimationFrame(Sd);
    let t = Math.min(0.06, Math.max(0, (i - Yu) / 1e3 || 0));
    if (Yu = i, He && !Ye && !pi) {
      _titanMenuRendered = false;
      const frozen=Math.min(t,hitStopRemaining);hitStopRemaining=Math.max(0,hitStopRemaining-frozen);t-=frozen;
      if(t>0){let finishVictory=false;if(pendingVictory>0){pendingVictory=Math.max(0,pendingVictory-t);finishVictory=pendingVictory===0;}
       gn += t, Va = Math.min(0.075, Va + t); if(assetSystem)assetSystem.update(t);if(battlefieldSupport)battlefieldSupport.update(t,{enabled:vn==="city",running:true});
       let e = 0;
       for (; Va >= 1 / 120 && e++ < 8; ) wx(1 / 120), Va -= 1 / 120;
       Ux(t);if(finishVictory&&!pi)cd(true);
      }
    } else if (_titanSoftwareGl) {
      if (_titanMenuRendered) return;
      _titanMenuRendered = true;
    }
    Ee.render(Dt, qe);
  }
  requestAnimationFrame(Sd);
  var Wa = /* @__PURE__ */ new Set();
  function bd(i, t) {
    let e = i.code;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight", "KeyQ", "KeyE", "KeyV", "KeyR", "KeyB", "KeyF", "KeyG", "KeyT"].includes(e) && i.preventDefault(), !!He) {
      if (!t) {
        Wa.delete(e), (e === "ShiftLeft" || e === "ShiftRight") && (ae.gas = false), "KeyW KeyA KeyS KeyD".split(" ").includes(e) && ae.keys.delete(e);
        return;
      }
      if (!Wa.has(e)) {
        if (Wa.add(e), e === "KeyG" || e === "Escape") {
          Jl();
          return;
        }
        Ye || ("KeyW KeyA KeyS KeyD".split(" ").includes(e) && ae.keys.add(e), (e === "ShiftLeft" || e === "ShiftRight") && (ae.gas = true), e === "KeyQ" && Tn(0), e === "KeyE" && Tn(1), e === "Space" && Md(), e === "KeyV" && so(), e === "KeyR" && useThunder(), e === "KeyT" && transformPlayer(), e === "KeyF" && (disarmSpear(),ro()), e === "KeyB" && yd(), e === "KeyX" && yr());
      }
    }
  }
  addEventListener("keydown", (i) => bd(i, true));
  addEventListener("keyup", (i) => bd(i, false));
  function Zl() {
    Wa.clear(), ae.keys.clear(), ae.gas = false, releaseAutoWire();assetSystem?.setGuardHeld?.(false);
  }
  function requestRaidLock(){
    if(Ze||!He||Ye||pi)return;
    try{Promise.resolve(Ee.domElement.requestPointerLock()).catch(()=>pauseFocus());}catch{pauseFocus();}
  }
  function pauseFocus(){
    if(!He||pi||Ye)return;
    Zl();focusPaused=true;Ye=true;ut("#pauseHint").style.display="block";
  }
  function resumeFocus(){
    if(!focusPaused)return;
    focusPaused=false;Ye=false;Yu=performance.now();Va=0;ut("#pauseHint").style.display="none";
    if(!Ze)requestRaidLock();
  }
  ut("#pauseHint").addEventListener("click",resumeFocus);
  addEventListener("blur",pauseFocus);
  document.addEventListener("pointerlockchange",()=>{if(!Ze&&document.pointerLockElement!==Ee.domElement)pauseFocus();});
  document.addEventListener("visibilitychange", () => {
    document.hidden && pauseFocus();
  });
  Ee.domElement.addEventListener("click", () => {
    if(focusPaused){resumeFocus();return;}
    He && !Ye && !Ze && document.pointerLockElement !== Ee.domElement && requestRaidLock();
  });
  Ee.domElement.addEventListener("mousedown", (i) => {
    if (!He || Ye || Ze || pi) return;
    if (i.button === 2) {
      i.preventDefault();
      if (document.pointerLockElement === Ee.domElement){if(assetSystem?.isTitan?.())assetSystem.setGuardHeld?.(true);else pressAutoWire();}
      return;
    }
    i.button === 0 && document.pointerLockElement === Ee.domElement && ro();
  });
  addEventListener("mouseup", (i) => {
    if(i.button === 2){releaseAutoWire();assetSystem?.setGuardHeld?.(false);}
  });
  Ee.domElement.addEventListener("contextmenu", (i) => i.preventDefault());
  addEventListener("mousemove", (i) => {
    if(Math.abs(i.movementX)+Math.abs(i.movementY)>3)P.lookOverride=.25;
    He && !Ye && document.pointerLockElement === Ee.domElement && (P.yaw -= i.movementX * 21e-4, P.pitch = rn(P.pitch - i.movementY * 21e-4, -1.38, 1.38));
  });
  ut("#viewBtn").addEventListener("click", so);
  ut("#viewMobile").addEventListener("click", so);
  ut("#resetBtn").addEventListener("click", Vi);
  ut("#endAgain").addEventListener("click", () => {
    Vi(), ut("#endOverlay").classList.remove("show"), He = true, Ze || requestRaidLock();
  });
  ut("#start").addEventListener("click", dd);
  ut("#courseSelect").addEventListener("change", (i) => Xl(i.target.value));
  ut("#restartRace").addEventListener("click", ud);
  var Ps = ut("#joyBase"), Ed = ut("#joyKnob"), gr = ut("#lookZone"), Ja = null, Ls = null, Ol = 0, Bl = 0, wd = (i) => {
    let t = Ps.getBoundingClientRect(), e = t.left + t.width / 2, n = t.top + t.height / 2, s = i.clientX - e, r = i.clientY - n, a = Math.hypot(s, r), o = Math.min(t.width * 0.34, a), c = Math.atan2(r, s);
    s = Math.cos(c) * o, r = Math.sin(c) * o, Ed.style.transform = `translate(${s}px,${r}px)`, ae.forward = r / (t.width * 0.34), ae.right = s / (t.width * 0.34);
  };
  Ps.addEventListener("pointerdown", (i) => {
    i.preventDefault(), Ja = i.pointerId, wd(i);
    try {
      Ps.setPointerCapture(i.pointerId);
    } catch {
    }
  });
  addEventListener("pointermove", (i) => {
    i.pointerId === Ja && wd(i);
  });
  function resetJoy() {
    Ja = null, ae.forward = 0, ae.right = 0, Ed.style.transform = "translate(0,0)", Ps.classList.remove("active");
  }
  function Td(i) {
    i.pointerId === Ja && resetJoy();
  }
  addEventListener("pointerup", Td);
  addEventListener("pointercancel", Td);
  let joystickTouch = null;
  Ps.addEventListener("touchstart", (i) => {
    if (joystickTouch !== null) return;
    let t = i.changedTouches[0];
    joystickTouch = t.identifier, i.preventDefault(), Ps.classList.add("active"), wd(t);
  }, { passive: false });
  Ps.addEventListener("touchmove", (i) => {
    let t = [...i.changedTouches].find((t2) => t2.identifier === joystickTouch);
    t && (i.preventDefault(), wd(t));
  }, { passive: false });
  function endJoystickTouch(i) {
    [...i.changedTouches].some((t) => t.identifier === joystickTouch) && (joystickTouch = null, resetJoy());
  }
  Ps.addEventListener("touchend", endJoystickTouch, { passive: false });
  Ps.addEventListener("touchcancel", endJoystickTouch, { passive: false });
  gr.addEventListener("pointerdown", (i) => {
    if (!He || Ye) return;
    i.preventDefault(), Ls = i.pointerId, Ol = i.clientX, Bl = i.clientY;
    try {
      gr.setPointerCapture(i.pointerId);
    } catch {
    }
  });
  addEventListener("pointermove", (i) => {
    if (i.pointerId !== Ls || Ye) return;
    let t = i.clientX - Ol, e = i.clientY - Bl;
    Ol = i.clientX, Bl = i.clientY, P.yaw -= t * 42e-4, P.pitch = rn(P.pitch - e * 42e-4, -1.38, 1.38);
  });
  addEventListener("pointerup", (i) => {
    i.pointerId === Ls && (Ls = null);
  });
  addEventListener("pointercancel", (i) => {
    i.pointerId === Ls && (Ls = null);
  });
  function Us(i, t, e) {
    let n = ut(i), pressed = false, s = (r) => n.classList.toggle("pressed", r), down = (r) => {
      if (Ye || pressed) return;
      r.preventDefault && r.preventDefault(), r.stopPropagation && r.stopPropagation(), pressed = true, r.pointerId !== void 0 && (() => {
        try {
          n.setPointerCapture(r.pointerId);
        } catch {
        }
      })(), s(true), t();
    }, up2 = (r) => {
      if (!pressed) return;
      r.preventDefault && r.preventDefault(), pressed = false, s(false), e && e();
    };
    n.addEventListener("pointerdown", down);
    for (let r of ["pointerup", "pointercancel", "lostpointercapture"]) n.addEventListener(r, up2);
    n.addEventListener("touchstart", down, { passive: false });
    for (let r of ["touchend", "touchcancel"]) n.addEventListener(r, up2, { passive: false });
  }
  Us("#leftTouch", () => Tn(0), () => {
  });
  Us("#rightTouch", () => Tn(1), () => {
  });
  Us("#gasTouch", () => ae.gas = true, () => ae.gas = false);
  Us("#jumpTouch", Md, () => {
  });
  Us("#cutTouch", ro, () => {
  });
  Us("#releaseTouch", useThunder, () => {
  });
  function Ad() {
    let i = _titanSoftwareGl ? 1 : (Ze ? 0.9 : 1);
    if (!_titanSoftwareGl) {
      fe.quality === "low" && (i = 1), fe.quality === "high" && (i = Ze ? 1.65 : 2), fe.quality === "max" && (i = 3);
    } else {
      _titanMenuRendered = false;
    }
    Ee.setPixelRatio(Math.min(devicePixelRatio, i)), Ee.setSize(innerWidth, innerHeight), An.castShadow = false;
  }
  function Jl(i) {
    focusPaused=false;ut("#pauseHint").style.display="none";
    let t = ut("#settingOverlay");
    Ye = typeof i == "boolean" ? i : !Ye, t.classList.toggle("open", Ye), Ye ? (Zl(), document.pointerLockElement && document.exitPointerLock()) : He && !Ze && requestRaidLock();
  }
  ut("#settingBtn").addEventListener("click", () => Jl(true));
  ut("#settingClose").addEventListener("click", () => Jl(false));
  ut("#setInfinite").addEventListener("change", (i) => fe.infinite = i.target.checked);
  ut("#setGravity").addEventListener("change", (i) => fe.gravity = i.target.value);
  ut("#setRange").addEventListener("change", (i) => fe.range = Number(i.target.value));
  ut("#setSpeed").addEventListener("change", (i) => fe.maxSpeed = Number(i.target.value));
  ut("#setQuality").addEventListener("change", (i) => {
    fe.quality = i.target.value, Ad();
  });
  ut("#setRange").value = String(fe.range);
  ut("#setSpeed").value = String(fe.maxSpeed);
  ut("#setQuality").value=fe.quality;ut("#setGravity").value=fe.gravity;ut("#setInfinite").checked=fe.infinite;
  ut("#setVolume").value=String(fe.volume??.65);
  ut("#setVolume").addEventListener("change",event=>{fe.volume=Math.max(0,Math.min(1,Number(event.target.value)||0));});
  function saveRaidPreferences(){try{if(window.RaidModels)window.RaidModels.writePreferences(localStorage,fe);}catch{}}
  for(const id of ["#setInfinite","#setGravity","#setRange","#setSpeed","#setQuality","#setVolume"])ut(id).addEventListener("change",saveRaidPreferences);
  if(fe.missiles)ut("#missileCount").value=String(fe.missiles);
  ut("#missileCount").addEventListener("change",event=>{fe.missiles=Number(event.target.value);saveRaidPreferences();});
  addEventListener("resize", () => {
    qe.aspect = innerWidth / innerHeight, qe.updateProjectionMatrix(), Ad();
  });
  addEventListener("error", (i) => {
    console.warn("[ODM LAB REBORN]", i.message);
  });
  window.odmLab = { getState: () => ({ simTime: gn, hitStop:hitStopRemaining,pendingVictory,bladeImpactCount,lastBladeImpact,punchImpactCount,lastPunchImpact, bladeSwing:P.bladeSwing?{...P.bladeSwing}:null,spearArmed:!!P.spearArmed,titanForm:!!P.titanForm,yaw:P.yaw,pitch:P.pitch,pos: P.pos.toArray(), vel: P.vel.toArray(), gas: P.gas, grounded: P.grounded, airTime: P.airTime, bestAirTime: P.bestAirTime, launchAssist: P.launchAssist, health: P.health, ammo: P.thunderAmmo, mag: P.thunderMag, titanHp: V.hp, armor: [V.armorL, V.armorR], napeOpen: V.napeOpen, missiles: Oi.map((i) => ({ age: i.age, distance: i.root.position.distanceTo(i.target), part: i.part })), missionOver: pi, spares: P.spares, route: vn, raceOn: Is, hooks: Be.map((i) => i.state), hookReleaseRadii: Be.map((i) => i.releaseRadius), wireReelSpeeds: Be.map((i) => i.reelSpeed), hookAnchors: Be.map((i) => i.anchor.toArray()), mobile: Ze, running: He, paused: Ye, settings: { ...fe } }), bladePose:()=>({arms:vr.map(({arm,side})=>({side,position:arm.position.toArray(),rotation:arm.rotation.toArray().slice(0,3)})),body:_e.rotation.toArray().slice(0,3)}),camera:()=>({position:qe.position.toArray(),fov:qe.fov}),getCombatStatus:()=>assetSystem?.getCombatStatus?.(),getAimTarget: () => {
    let i = Gl();
    return i ? { part: i.object.userData.titanPart, point: i.point.toArray(), distance: i.distance } : null;
  }, setRoute: Xl, beginRace: ud, beginMission: dd, reset: Vi, fireHook: _d, releaseHook: xd, toggleHook: Tn, fireThunder: Wl,pressThunder:useThunder,transform:transformPlayer,sheathe:disarmSpear, replaceBlades: yd, toggleView: so, setAim: (i, t) => {
    P.yaw = i, P.pitch = t;
  }, setPlayer: (i) => {
    P.pos.set(...i), P.vel.set(0, 0, 0);
  }, setVelocity: velocity=>P.vel.set(...velocity),setResources:(gas,spares)=>{P.gas=gas;P.spares=spares;ut('#bladeCount').textContent=P.spares;},worldColliders:()=>Ku.filter(b=>b.mesh.visible).map(b=>({name:b.mesh.name,x:b.x,z:b.z,hx:b.hx,hz:b.hz,top:b.h+(b.roofHeight||0),eave:b.h,roofHeight:b.roofHeight,roofAxis:b.roofAxis,roofShape:b.roofShape,bottom:b.bottom,radius:b.radius,cityOnly:!!b.mesh.userData.cityOnly,legacy:!!b.mesh.userData.cityLegacyWall})),getCity:()=>shiganshinaCity?.inspect?.()||null,getBattlefield:()=>battlefieldSupport?.inspect?.()||null, slash: ro };

  function renderRaidHud(state){
    ut("#raidObjective").textContent="討伐 "+(state.total-state.remaining)+" / "+state.total+"体";
    const form=state.hero;const transformed=form.state!=="human";ut("#missileInfo").style.display=transformed?"none":"";ut("#bladeInfo").style.display=transformed?"none":"";ut("#leftHud").style.display=transformed?"none":"";ut("#viewBtn").disabled=transformed;ut("#transformRead").textContent=form.state==="human"?"巨人化 "+Math.floor(form.energy)+"%":form.state==="emerging"?"巨人化中…":"巨人体 "+Math.ceil(form.health)+" / 残り "+Math.ceil(form.seconds)+"秒";
    ut("#transformBar").style.width=form.energy+"%";ut("#transformBtn").disabled=form.state==="emerging"||form.state==="human"&&(form.energy<40||form.cooldown>0);ut("#transformBtn").textContent=form.state==="emerging"?"巨人化中…":form.state==="human"?(form.cooldown>0?"再巨人化まで "+Math.ceil(form.cooldown)+"秒":"T 巨人化"):"T 人に戻る";
    ut("#transformStatus").classList.toggle("active",form.state!=="human");
    ut("#combatPanel").style.display=form.state==="titan"?"block":"none";ut("#guardRead").textContent=form.guardBroken>0?"ガード崩れ":form.guarding?"ガード中 / "+Math.ceil(form.guardStamina)+"%":"ガード "+Math.ceil(form.guardStamina||0)+"%";ut("#guardBar").style.width=(form.guardStamina||0)+"%";ut("#combatPanel").classList.toggle("hardened",!!form.hardened);ut("#combatControls").textContent="左クリック：拳 / 右長押し：ガード\n"+(form.hardened?"硬質化 "+Math.ceil(form.hardeningRemaining)+"秒":form.hardeningCooldown>0?"R 硬質化まで "+Math.ceil(form.hardeningCooldown)+"秒":"R：硬質化")+" / T：離脱";const kinds={attack:"通常巨人 / 拳で打ち崩す",armored:"鎧 / 側面・攻撃後の隙を狙う",jaw:"顎 / 飛び込みを避けて反撃",colossal:"超大型 / 蒸気から離れ、うなじへ",warhammer:"戦鎚 / 振り下ろしを避けて背後へ"};ut("#combatTactic").textContent=kinds[state.combat?.opponent?.kind]||"左クリック：拳 / 右長押し：ガード";
    const canvas=ut("#raidRadar"),draw=canvas.getContext("2d"),cx=80,cy=80,scale=.35;draw.clearRect(0,0,160,160);draw.fillStyle="#07151bcc";draw.beginPath();draw.arc(cx,cy,77,0,Math.PI*2);draw.fill();draw.strokeStyle="#7b9e9b66";draw.stroke();
    for(const entry of state.entries){if(!entry.V.alive)continue;let x=(entry.V.root.position.x-P.pos.x)*scale,z=(entry.V.root.position.z-P.pos.z)*scale;const dist=Math.hypot(x,z);if(dist>70){x*=70/dist;z*=70/dist;}draw.fillStyle=entry.kind==="colossal"?"#ff6850":entry.kind==="warhammer"?"#c6e6ed":entry.kind==="armored"?"#e5c78e":"#f4a167";draw.beginPath();draw.arc(cx+x,cy+z,entry.kind==="colossal"?5:3,0,Math.PI*2);draw.fill();}
    for(const station of battlefieldSupport?.inspect?.().supply.stations||[]){const x=(station.x-P.pos.x)*scale,z=(station.z-P.pos.z)*scale;if(Math.hypot(x,z)>70)continue;draw.fillStyle="#8ec5a9";draw.fillRect(cx+x-2.5,cy+z-2.5,5,5);}
    draw.fillStyle="#baffed";draw.beginPath();draw.moveTo(cx-Math.sin(P.yaw)*9,cy-Math.cos(P.yaw)*9);draw.lineTo(cx+Math.cos(P.yaw)*4,cy-Math.sin(P.yaw)*4);draw.lineTo(cx-Math.cos(P.yaw)*4,cy+Math.sin(P.yaw)*4);draw.fill();
  }
  if(window.RaidModels){
    shiganshinaCity=window.RaidModels.createShiganshinaCity?.({scene:Dt,targets:ki,colliders:Ku});
    if(shiganshinaCity){for(const object of legacyTownParts)object.visible=false;_r.visible=xr.visible=false;}
    const select=document.querySelector('#titanSelect'),start=document.querySelector('#start'),description=document.querySelector('#targetDescription');
    const title=document.querySelector('#bossHud .bossHead span');select.value=window.RaidModels.createRoster?(fe.battle||'raid'):(fe.target||'armored');
    const navigator=window.RaidModels.createNavigator?.(height=>Ku.filter(box=>box.mesh.visible&&!(box.mesh.userData.cityOnly&&vn!=='city')&&!(box.mesh.userData.cityLegacyWall&&vn==='city')&&box.bottom<height),()=>vn);
    assetSystem=(window.RaidModels.createRoster||window.RaidModels.create)({scene:Dt,V,P,targets:rd,anchors:ki,hooks:Be,player:_e,arms:vr,thirdSwords:Ka,oldGear:Xu,camera:qe,missiles:Oi,
      hud:eo,notice:pe,humanVisual:Ya,releaseWires:yr,disarm:disarmSpear,maxAmmo:()=>mr,sound:(hz,duration)=>be(hz,duration,"sawtooth",.035,45),
      shake:amount=>{_n=Math.max(_n,amount);},thud:power=>{be(70+power*20,.16+power*.14,'sine',.05+power*.06,30);be(150,.05,'triangle',.012+power*.012,60);},punchImpact:(enemy,point,side,info={})=>{
        const guarded=!!info.guarded,hardened=!!info.hardened,counter=!!info.counter;
        punchImpactCount++;lastPunchImpact={enemy:enemy.id,point:point.toArray(),side,hardened,counter,guarded};
        hitStopRemaining=Math.max(hitStopRemaining,guarded?.028:counter?.085:hardened?.075:.055);
        punchCameraImpact={age:0,power:guarded?.07:hardened?.28:.18,direction:new T(-Math.sin(P.yaw),0,-Math.cos(P.yaw))};
        raidHitTime=.16;ut("#reticle").classList.add("hit");_n=Math.max(_n,guarded?.035:.07);
        playPunchContact(guarded,hardened);

      },
      guardImpact:({perfect,broken})=>{
        if(perfect)hitStopRemaining=Math.max(hitStopRemaining,.045);
        _n=Math.max(_n,broken?.2:perfect?.08:.055);be(perfect?330:160,.09,"triangle",.035,65);

      },
      setTarget:enemy=>{V=enemy;},
      displaceEnemy:(position,proposal,radius,height)=>{if(Math.abs(proposal.x)>543-radius||Math.abs(proposal.z)>543-radius)return false;for(const box of Ku){if(!box.mesh.visible||box.mesh.userData.cityOnly&&vn!=="city"||box.mesh.userData.cityLegacyWall&&vn==="city"||box.bottom>proposal.y+height||box.h<proposal.y)continue;const x=rn(proposal.x,box.x-box.hx,box.x+box.hx),z=rn(proposal.z,box.z-box.hz,box.z+box.hz);if(Math.hypot(proposal.x-x,proposal.z-z)<radius)return false;}position.copy(proposal);return true;},
      resolveAvatar:(previous,height,radius)=>{const oldHeight=Ui,oldRadius=ui;try{Ui=height;ui=radius;Ex(previous);}finally{Ui=oldHeight;ui=oldRadius;}},
      breakArmor:(enemy,part)=>{if(enemy.alive){V=enemy;ld(part,"punch",enemy);}},
      damage:(enemy,amount,source)=>{
        if(!enemy.alive||pi)return;V=enemy;
        const protectedPart=(V.armorL||V.armorR)||enemy.kind==="colossal";V.hp=Math.max(protectedPart?1:0,V.hp-amount);
        if(V.hp===0){const won=assetSystem.enemyDown(V);if(won)scheduleVictory();}eo();
      },
      findSpawn:(position,kind)=>{const radius=kind==="colossal"?10:kind==="jaw"?2:3,offsets=[[0,0]];for(let ring=1;ring<=12;ring++)for(let side=0;side<16;side++){const angle=side*Math.PI/8;offsets.push([Math.cos(angle)*ring*8,Math.sin(angle)*ring*8]);}for(const [dx,dz] of offsets){const x=position[0]+dx,z=position[2]+dz;let free=true;for(const box of Ku){if(!box.mesh.visible||box.bottom>20||box.mesh.userData.cityOnly&&vn!=="city"||box.mesh.userData.cityLegacyWall&&vn==="city")continue;if(Math.abs(x-box.x)<box.hx+radius&&Math.abs(z-box.z)<box.hz+radius){free=false;break;}}if(free)return[x,0,z];}return position;},
      renderHud:renderRaidHud,
      assistedSlash:(enemy,part,charged,sweep=null)=>{if(!enemy.alive||pi)return false;V=enemy;const mesh=part==="armorL"?V.armorPlateL:part==="armorR"?V.armorPlateR:V.weak,point=sweep?.impactPoint?.clone()||mesh.getWorldPosition(new T());const offset=point.clone().sub(P.pos),distance=offset.length(),sweepDistance=sweep?.contactDistance??Infinity;if(sweep?sweepDistance>3:distance>8.5)return false;if(distance>.1&&raidObstacle(P.pos,offset.clone().normalize(),Math.max(0,distance-.25))&&!sweep)return false;
        if(part==="nape"){if(!V.napeOpen)return false;ld("nape",charged?"odm":"blade",enemy);return true;}
        const count=part==="armorL"?++V.armorCutsL:++V.armorCutsR;if(count>=3)ld(part,"blade",enemy);else {bladeImpact(enemy,part,point,count,false);pe("装甲に斬撃 / "+count+" / 3");eo();}return true;
      },missFeedback:()=>{impactLabel.textContent="空振り";impactLabel.className="show miss";be(255,.09,"triangle",.015,620);},
      canReach:(from,to)=>{const offset=to.clone().sub(from),distance=offset.length();return distance<.1||!raidObstacle(from,offset.divideScalar(distance),Math.max(0,distance-.25));},
      moveEnemy:(position,proposal,radius,height,yaw)=>{if(navigator)return navigator.advance(position,P.pos,Math.hypot(proposal.x-position.x,proposal.z-position.z),radius,height,yaw,gn);for(const box of Ku){if(!box.mesh.visible||box.mesh.userData.cityOnly&&vn!=="city"||box.mesh.userData.cityLegacyWall&&vn==="city"||box.bottom>height)continue;const x=rn(proposal.x,box.x-box.hx,box.x+box.hx),z=rn(proposal.z,box.z-box.hz,box.z+box.hz);if(Math.hypot(proposal.x-x,proposal.z-z)<radius)return false;}position.copy(proposal);return true;},
      loading:(busy,error)=>{ut('#retryAssets').hidden=busy||!error;ut('#retryAssets').disabled=busy;if(error)description.textContent='読み込みを再試行するか、標的を選び直してください。';start.disabled=busy||!!error;start.textContent=error?'読み込み失敗 — 標的を選び直してください':busy?'装備・巨人を準備中…':'出撃';},
      targetChanged:(type,cfg)=>{_titanMenuRendered=false;title.textContent=cfg.name+' / '+cfg.height+' M';description.textContent=cfg.detail;},
      hurt:(label,pos,amount,kind='melee')=>{if(pi||P.invulnerable>0)return;const before=assetSystem?.inspect?.().hero;if(assetSystem?.absorbDamage?.(amount,{source:pos,kind})){const after=assetSystem.inspect().hero,damage=after.health<before.health;P.invulnerable=damage?.65:.2;if(damage){ut('#ui').classList.add('danger');be(85,.18,'sawtooth',.035,45);if(!after.guardResult)pe(label+' / 巨人体に被弾');}return;}ut('#ui').classList.add('danger');be(85,.18,'sawtooth',.035,45);P.health=Math.max(0,P.health-amount);P.invulnerable=2.3;P.vel.addScaledVector(P.pos.clone().sub(pos).normalize(),15);pe(label+' / 残り耐久 '+P.health);_n=.16;eo();if(P.health<=0)cd(false);},
      steam:(pos,dt)=>{if(Math.random()<dt*7)px(pos.clone().add(new T((Math.random()-.5)*15,22+Math.random()*23,(Math.random()-.5)*15)),false);}
    });
    battlefieldSupport=window.RaidModels.createBattlefieldSupport?.({scene:Dt,P,colliders:Ku,anchors:ki,maxAmmo:()=>mr,supplyStations:shiganshinaCity?[{x:-270,z:-160,radius:5.8},{x:260,z:150,radius:5.8}]:[],
      enemies:()=>assetSystem?.supportTargets?.()||[],
      canReach:(from,to)=>{const offset=to.clone().sub(from),distance=offset.length();return distance<.1||!raidObstacle(from,offset.divideScalar(distance),Math.max(0,distance-.25));},
      assistEnemy:(id,options={})=>assetSystem?.supportEnemy?.(id,options.duration)??false,
      onResupply:()=>{P.swap=0;P.swapPhase=0;for(const sword of [...Ka,...vr])for(const part of sword.sword.userData.bladeParts)part.visible=true;ut('#bladeCount').textContent=P.spares;ut('#bladeMode').textContent='READY';eo();},
      sound:(kind)=>{if(kind==='cannon-ready')be(250,.12,'triangle',.025,70);else if(kind==='cannon'){be(82,.22,'sawtooth',.052,40);_n=Math.max(_n,.1);}else if(kind==='cannon-hit'){be(68,.22,'sawtooth',.055,30);be(150,.06,'triangle',.018,70);_n=Math.max(_n,.14);}else if(kind==='resupply'){be(520,.12,'triangle',.025,180);be(780,.09,'sine',.015,280);}
      }});
    battlefieldSupport?.update(0,{enabled:vn==='city',running:false});
    select.addEventListener('change',()=>{fe.battle=select.value;if(select.value!=='raid')fe.target=select.value;saveRaidPreferences();assetSystem.select(select.value).catch(()=>{});});
    ut('#retryAssets').onclick=()=>{ut('#retryAssets').disabled=true;assetSystem.retry(select.value).catch(()=>{ut('#retryAssets').disabled=false;ut('#retryAssets').hidden=false;});};
    assetSystem.equipmentReady.then(()=>assetSystem.select(select.value)).catch(e=>{start.disabled=true;start.textContent='装備の読み込みに失敗';ut('#retryAssets').hidden=false;console.error(e);});
    window.odmLab.getModels=assetSystem.inspect;
    ut("#transformBtn").addEventListener("click",transformPlayer);
    window.odmLab.selectTitan=type=>{if(!He){select.value=type;return assetSystem.select(type);}};
    document.querySelector('#changeLoadout').onclick=()=>{yr();He=false;pi=false;document.exitPointerLock?.();document.querySelector('#endOverlay').classList.remove('show');document.querySelector('#welcome').classList.remove('hidden');};
  }
  Xl("city");
})();
