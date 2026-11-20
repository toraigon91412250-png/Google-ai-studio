// Performance detection & adaptive resolution/effects controller.

const SOFTWARE_GL_RE = /SwiftShader|llvmpipe|softpipe|Software|Microsoft Basic Render/i;

export function isSoftwareRendererString(rendererString) {
  return SOFTWARE_GL_RE.test(String(rendererString || ''));
}

export function detectSoftwareGl(doc = typeof document !== 'undefined' ? document : null) {
  if (!doc || typeof doc.createElement !== 'function') {
    return { software: false, renderer: '' };
  }
  let canvas = null;
  let gl = null;
  try {
    canvas = doc.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    gl = canvas.getContext?.('webgl2') || canvas.getContext?.('webgl') || null;
    if (!gl) return { software: false, renderer: '' };
    const ext = gl.getExtension?.('WEBGL_debug_renderer_info');
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '')
      : String(gl.getParameter(gl.RENDERER) || '');
    return { software: isSoftwareRendererString(renderer), renderer };
  } catch {
    return { software: false, renderer: '' };
  } finally {
    try {
      gl?.getExtension?.('WEBGL_lose_context')?.loseContext?.();
    } catch {
      // Ignore cleanup errors on headless/stub contexts.
    }
  }
}

export class AdaptiveQuality {
  constructor({ mode = 'auto', mobile = false, softwareGl = false } = {}) {
    this.mode = mode;
    this.mobile = !!mobile;
    this.softwareGl = !!softwareGl;
    this.tier = softwareGl ? 2 : 0; // 0 = full auto, 1 = reduced scale, 2 = low-spec fallback
    this.samples = [];
    this.stableFrames = 0;
  }

  setMode(mode, mobile = this.mobile) {
    this.mode = mode || 'auto';
    this.mobile = !!mobile;
    if (this.mode !== 'auto') {
      this.tier = this.softwareGl ? 2 : 0;
      this.samples.length = 0;
      this.stableFrames = 0;
    }
  }

  recordFrame(dtSeconds) {
    if (this.mode !== 'auto' || this.softwareGl) return false;
    if (!Number.isFinite(dtSeconds) || dtSeconds <= 0 || dtSeconds > 0.25) return false;
    const ms = dtSeconds * 1000;
    this.samples.push(ms);
    if (this.samples.length > 45) this.samples.shift();
    if (this.samples.length < 30) return false;

    const avg = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    if (avg > 28 && this.tier < 2) {
      this.tier++;
      this.samples.length = 0;
      this.stableFrames = 0;
      return true;
    }
    if (avg < 16.5 && this.tier > 0) {
      this.stableFrames += 1;
      if (this.stableFrames >= 120) {
        this.tier--;
        this.samples.length = 0;
        this.stableFrames = 0;
        return true;
      }
    } else {
      this.stableFrames = 0;
    }
    return false;
  }

  pixelRatio(devicePixelRatioValue = 1) {
    const dpr = Math.max(1, Number(devicePixelRatioValue) || 1);
    if (this.softwareGl || this.mode === 'low') return 1;
    if (this.mode === 'high') return Math.min(dpr, 2);
    if (this.mode === 'max') return Math.min(dpr, 3);
    // auto
    if (this.tier >= 2) return 1;
    if (this.tier === 1) return Math.min(dpr, 1.15);
    return Math.min(dpr, this.mobile ? 1.3 : 1.7);
  }

  lowEffects() {
    if (this.softwareGl || this.mode === 'low') return true;
    if (this.mode === 'auto' && this.tier >= 1) return true;
    return this.mobile && this.mode !== 'max' && this.mode !== 'high';
  }

  particleScale() {
    if (this.softwareGl || this.mode === 'low') return 0.5;
    if (this.mode === 'auto' && this.tier >= 2) return 0.6;
    if (this.mode === 'auto' && this.tier === 1) return 0.8;
    return 1;
  }

  snapshot() {
    const avgMs = this.samples.length
      ? Math.round((this.samples.reduce((a, b) => a + b, 0) / this.samples.length) * 10) / 10
      : 0;
    return {
      mode: this.mode,
      tier: this.tier,
      softwareGl: this.softwareGl,
      lowEffects: this.lowEffects(),
      particleScale: this.particleScale(),
      avgFrameMs: avgMs
    };
  }
}
