// Pure 3D parkour mechanics: wall detection, wall-run physics/tilt, and wall-kick launch.

export const PARKOUR_CONFIG = {
  wallReach: 0.96,
  perimeterMargin: 0.65,
  wallMinHeightAboveFeet: 0.65,
  wallMinAirborneY: 0.12,
  wallRunSpeedMult: 1.35,
  wallRunChargeMult: 2.0,
  wallRunReloadMult: 2.2,
  wallRunMaxFallVy: -1.65,
  wallRunAttachLiftVy: 1.15,
  wallRunMaxDuration: 2.4,
  wallRunTiltRad: 0.145,
  wallKickUpVy: 10.6,
  wallKickNormalSpeed: 13.5,
  wallKickForwardSpeed: 5.5,
  wallKickCooldown: 0.24,
  wallKickChargeBoost: 14,
  kickDecayRate: 5.8
};

export function detectWallContact({
  x = 0,
  y = 0,
  z = 0,
  reach = PARKOUR_CONFIG.wallReach,
  solids = [],
  bounds = { x: 30.8, z: 30.8 },
  difficulty = 'normal',
  allowPerimeter = true
} = {}) {
  let best = { hit: false, nx: 0, nz: 0, dist: Infinity, wallKey: '', source: '' };

  for (let i = 0; i < solids.length; i++) {
    const s = solids[i];
    if (!s || s.enabled === false) continue;
    if (difficulty === 'easy' && s.removeInEasy) continue;
    if (y >= s.top - 0.15) continue;
    if (s.top <= y + PARKOUR_CONFIG.wallMinHeightAboveFeet) continue;

    const minX = s.x - s.w;
    const maxX = s.x + s.w;
    const minZ = s.z - s.d;
    const maxZ = s.z + s.d;

    const cx = Math.max(minX, Math.min(maxX, x));
    const cz = Math.max(minZ, Math.min(maxZ, z));
    let dx = x - cx;
    let dz = z - cz;
    let dist = Math.hypot(dx, dz);

    // If inside footprint edge numerically, push along nearest face normal
    if (dist < 1e-4) {
      const dl = Math.abs(x - minX);
      const dr = Math.abs(maxX - x);
      const df = Math.abs(z - minZ);
      const db = Math.abs(maxZ - z);
      const m = Math.min(dl, dr, df, db);
      if (m === dl) { dx = -1; dz = 0; }
      else if (m === dr) { dx = 1; dz = 0; }
      else if (m === df) { dx = 0; dz = -1; }
      else { dx = 0; dz = 1; }
      dist = 0;
    } else {
      dx /= dist;
      dz /= dist;
    }

    if (dist <= reach && dist < best.dist) {
      const faceTag = Math.abs(dx) >= Math.abs(dz) ? (dx >= 0 ? 'e' : 'w') : (dz >= 0 ? 's' : 'n');
      best = {
        hit: true,
        nx: dx,
        nz: dz,
        dist,
        wallKey: `solid:${i}:${faceTag}`,
        source: 'solid'
      };
    }
  }

  if (allowPerimeter && bounds && bounds.x > 0 && bounds.z > 0 && y < 4.4) {
    const m = PARKOUR_CONFIG.perimeterMargin;
    const perimeters = [
      { dist: Math.max(0, bounds.x - x), nx: -1, nz: 0, key: 'bound:e' },
      { dist: Math.max(0, x + bounds.x), nx: 1, nz: 0, key: 'bound:w' },
      { dist: Math.max(0, bounds.z - z), nx: 0, nz: -1, key: 'bound:s' },
      { dist: Math.max(0, z + bounds.z), nx: 0, nz: 1, key: 'bound:n' }
    ];
    for (const pWall of perimeters) {
      if (pWall.dist <= m && pWall.dist < best.dist) {
        best = {
          hit: true,
          nx: pWall.nx,
          nz: pWall.nz,
          dist: pWall.dist,
          wallKey: pWall.key,
          source: 'perimeter'
        };
      }
    }
  }

  return best;
}

export function stepWallRun({
  wallContact = null,
  grounded = true,
  swimming = false,
  airborne = false,
  moving = false,
  lookYaw = 0,
  wishX = 0,
  wishZ = 0,
  vy = 0,
  wallTime = 0,
  wallCooldown = 0,
  activeWallKey = '',
  dt = 0
} = {}) {
  const inactive = {
    active: false,
    wallSide: 0,
    wallKey: '',
    tangentX: 0,
    tangentZ: 0,
    targetTilt: 0,
    nextVy: vy,
    nextWallTime: 0,
    speedMult: 1,
    reloadMult: 1,
    chargeMult: 1
  };

  if (grounded || swimming || !airborne || !moving || !wallContact?.hit) {
    return inactive;
  }

  if (wallCooldown > 0 && wallContact.wallKey === activeWallKey) {
    return inactive;
  }

  const nextTime = (wallContact.wallKey === activeWallKey ? wallTime : 0) + Math.max(0, dt);
  if (nextTime > PARKOUR_CONFIG.wallRunMaxDuration) {
    return inactive;
  }

  const nx = wallContact.nx;
  const nz = wallContact.nz;
  // Wall tangents in XZ plane
  const t1x = -nz;
  const t1z = nx;

  const forwardX = -Math.sin(lookYaw);
  const forwardZ = -Math.cos(lookYaw);
  const rightX = Math.cos(lookYaw);
  const rightZ = -Math.sin(lookYaw);

  const wishLen = Math.hypot(wishX, wishZ);
  const steerX = wishLen > 0.05 ? wishX / wishLen : forwardX;
  const steerZ = wishLen > 0.05 ? wishZ / wishLen : forwardZ;

  const wishDot = steerX * t1x + steerZ * t1z;
  const fwdDot = forwardX * t1x + forwardZ * t1z;
  if (Math.max(Math.abs(wishDot), Math.abs(fwdDot)) < 0.15) {
    return inactive;
  }

  const primaryDot = Math.abs(wishDot) >= 0.12 ? wishDot : fwdDot;
  const sign = primaryDot >= 0 ? 1 : -1;
  const tangentX = sign * t1x;
  const tangentZ = sign * t1z;

  // Outward normal dotted with player right: < 0 means wall is on the player's RIGHT (+1), > 0 means LEFT (-1)
  const rightDot = nx * rightX + nz * rightZ;
  const wallSide = rightDot < 0 ? 1 : -1;
  const targetTilt = wallSide * PARKOUR_CONFIG.wallRunTiltRad;

  const nextVy = Math.max(
    PARKOUR_CONFIG.wallRunMaxFallVy,
    vy < -0.5 ? Math.max(vy, PARKOUR_CONFIG.wallRunAttachLiftVy * 0.4) : vy
  );

  return {
    active: true,
    wallSide,
    wallKey: wallContact.wallKey,
    tangentX,
    tangentZ,
    targetTilt,
    nextVy,
    nextWallTime: nextTime,
    speedMult: PARKOUR_CONFIG.wallRunSpeedMult,
    reloadMult: PARKOUR_CONFIG.wallRunReloadMult,
    chargeMult: PARKOUR_CONFIG.wallRunChargeMult
  };
}

export function computeWallKick({
  nx = 0,
  nz = 0,
  forwardX = 0,
  forwardZ = -1,
  jumpMult = 1
} = {}) {
  const nLen = Math.hypot(nx, nz) || 1;
  const unx = nx / nLen;
  const unz = nz / nLen;
  const fLen = Math.hypot(forwardX, forwardZ) || 1;
  const ufx = forwardX / fLen;
  const ufz = forwardZ / fLen;

  return {
    kickVx: unx * PARKOUR_CONFIG.wallKickNormalSpeed + ufx * PARKOUR_CONFIG.wallKickForwardSpeed,
    kickVz: unz * PARKOUR_CONFIG.wallKickNormalSpeed + ufz * PARKOUR_CONFIG.wallKickForwardSpeed,
    kickVy: PARKOUR_CONFIG.wallKickUpVy * jumpMult,
    cooldown: PARKOUR_CONFIG.wallKickCooldown,
    chargeGain: PARKOUR_CONFIG.wallKickChargeBoost
  };
}
