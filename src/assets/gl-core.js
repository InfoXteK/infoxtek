/* InfoXteK 3D engine core (v3.0.0). WebGL2 only, zero dependencies, same-origin script.
   No network, no storage, no eval, no tracking. Used by gl-galaxy.js and gl-flow.js. */
(() => {
  'use strict';
  const IX = (window.IXGL = window.IXGL || {});
  IX.version = '3.0.0';
  const TAU = Math.PI * 2;
  let probed = null;
  IX.supported = () => {
    if (probed !== null) return probed;
    try { const c = document.createElement('canvas'), g = c.getContext('webgl2'); probed = !!g; if (g) { const e = g.getExtension('WEBGL_lose_context'); if (e) e.loseContext(); } } catch (e) { probed = false; }
    return probed;
  };
  // Optional override for testing: ?q=0|1|2 pins the quality level and disables the governor.
  IX.forcedQ = (() => { try { const m = /[?&]q=([012])\b/.exec(location.search); return m ? +m[1] : -1; } catch (e) { return -1; } })();

  /* ---------- GL wrapper ---------- */
  IX.GL = (canvas) => {
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) throw new Error('webgl2 unavailable');
    const own = [];
    const compile = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { const l = gl.getShaderInfoLog(s); gl.deleteShader(s); throw new Error('shader: ' + l); }
      return s;
    };
    const program = (vs, fs) => {
      const p = gl.createProgram(), a = compile(gl.VERTEX_SHADER, vs), b = compile(gl.FRAGMENT_SHADER, fs);
      gl.attachShader(p, a); gl.attachShader(p, b); gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error('link: ' + gl.getProgramInfoLog(p));
      gl.deleteShader(a); gl.deleteShader(b);
      const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const inf = gl.getActiveUniform(p, i); u[inf.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, inf.name); }
      own.push(() => gl.deleteProgram(p));
      return { p, u };
    };
    const use = (pr) => gl.useProgram(pr.p);
    const set = (pr, name, v) => {
      const l = pr.u[name]; if (l === undefined || l === null) return;
      if (typeof v === 'number') gl.uniform1f(l, v);
      else if (v.length === 2) gl.uniform2fv(l, v); else if (v.length === 3) gl.uniform3fv(l, v); else if (v.length === 4) gl.uniform4fv(l, v);
      else if (v.length === 9) gl.uniformMatrix3fv(l, false, v); else if (v.length === 16) gl.uniformMatrix4fv(l, false, v);
    };
    const seti = (pr, name, v) => { const l = pr.u[name]; if (l !== undefined && l !== null) gl.uniform1i(l, v); };
    const buf = (data, usage, target) => { const b = gl.createBuffer(), t = target || gl.ARRAY_BUFFER; gl.bindBuffer(t, b); gl.bufferData(t, data, usage || gl.STATIC_DRAW); own.push(() => gl.deleteBuffer(b)); return b; };
    const sub = (b, data) => { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferSubData(gl.ARRAY_BUFFER, 0, data); };
    // attrs: [buffer, location, size, strideFloats, offsetFloats, divisor]
    const vao = (attrs, index) => {
      const v = gl.createVertexArray(); gl.bindVertexArray(v);
      for (const [b, loc, size, stride, off, div] of attrs) { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * 4, off * 4); if (div) gl.vertexAttribDivisor(loc, div); }
      if (index) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
      gl.bindVertexArray(null); own.push(() => gl.deleteVertexArray(v)); return v;
    };
    const tex = (w, h) => {
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    const dispose = () => { while (own.length) { try { own.pop()(); } catch (e) { /* ignore */ } } try { const x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); } catch (e) { /* ignore */ } };
    const reset = () => { own.length = 0; };
    return { gl, program, use, set, seti, buf, sub, vao, tex, dispose, reset };
  };

  /* ---------- geometry (interleaved position + normal, CCW outward in a right-handed frame) ---------- */
  const pack = (verts, idx) => ({ v: new Float32Array(verts), i: new Uint16Array(idx) });
  IX.geo = {
    sphere(seg, ring) {
      const v = [], ix = [];
      for (let j = 0; j <= ring; j++) for (let i = 0; i <= seg; i++) {
        const th = (j / ring) * Math.PI, ph = (i / seg) * TAU, x = Math.sin(th) * Math.cos(ph), y = Math.cos(th), z = Math.sin(th) * Math.sin(ph);
        v.push(x, y, z, x, y, z);
      }
      for (let j = 0; j < ring; j++) for (let i = 0; i < seg; i++) { const a = j * (seg + 1) + i, b = a + 1, c = a + seg + 1, d = c + 1; ix.push(a, b, c, b, d, c); }
      return pack(v, ix);
    },
    box() {
      const F = [[[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[-1, 0, 0], [0, 0, 1], [0, 1, 0]], [[0, 1, 0], [0, 0, 1], [1, 0, 0]], [[0, -1, 0], [1, 0, 0], [0, 0, 1]], [[0, 0, 1], [1, 0, 0], [0, 1, 0]], [[0, 0, -1], [0, 1, 0], [1, 0, 0]]];
      const v = [], ix = []; let o = 0;
      for (const [n, u, w] of F) {
        for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) v.push((n[0] + u[0] * a + w[0] * b) * 0.5, (n[1] + u[1] * a + w[1] * b) * 0.5, (n[2] + u[2] * a + w[2] * b) * 0.5, n[0], n[1], n[2]);
        ix.push(o, o + 1, o + 2, o, o + 2, o + 3); o += 4;
      }
      return pack(v, ix);
    },
    // unit-height frustum centred on the origin, y from -0.5 to 0.5
    frustum(n, rTop, rBot) {
      const v = [], ix = [], sl = (rBot - rTop); // slope for the side normal
      for (let i = 0; i <= n; i++) {
        const a = (i / n) * TAU, c = Math.cos(a), s = Math.sin(a), l = Math.hypot(1, sl) || 1;
        v.push(rBot * c, -0.5, rBot * s, c / l, sl / l, s / l, rTop * c, 0.5, rTop * s, c / l, sl / l, s / l);
      }
      for (let i = 0; i < n; i++) { const a = i * 2, b = a + 2, c = a + 1, d = a + 3; ix.push(a, c, b, b, c, d); }
      const cap = (y, ny, r, flip) => {
        const base = v.length / 6; v.push(0, y, 0, 0, ny, 0);
        for (let i = 0; i <= n; i++) { const a = (i / n) * TAU; v.push(r * Math.cos(a), y, r * Math.sin(a), 0, ny, 0); }
        for (let i = 0; i < n; i++) flip ? ix.push(base, base + 2 + i, base + 1 + i) : ix.push(base, base + 1 + i, base + 2 + i);
      };
      if (rTop > 0) cap(0.5, 1, rTop, true);
      if (rBot > 0) cap(-0.5, -1, rBot, false);
      return pack(v, ix);
    },
    torus(R, r, nu, nv) {
      const v = [], ix = [];
      for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
        const u = (i / nu) * TAU, w = (j / nv) * TAU, cu = Math.cos(u), su = Math.sin(u), cw = Math.cos(w), sw = Math.sin(w);
        v.push((R + r * cw) * cu, r * sw, (R + r * cw) * su, cw * cu, sw, cw * su);
      }
      for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1; ix.push(a, c, b, b, c, d); }
      return pack(v, ix);
    },
  };

  /* ---------- post-processing: optional MSAA, 2-level bloom, vignette, chromatic fringe, dither ---------- */
  IX.Post = (G) => {
    const gl = G.gl;
    const VS = '#version 300 es\nout vec2 vUv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUv=p;gl_Position=vec4(p*2.0-1.0,0.0,1.0);}';
    const FS_H = '#version 300 es\nprecision highp float;in vec2 vUv;out vec4 o;';
    const bright = G.program(VS, FS_H + 'uniform sampler2D uT;uniform vec2 uPx;uniform float uThr;void main(){vec3 c=(texture(uT,vUv+uPx*vec2(-1.0,-1.0)).rgb+texture(uT,vUv+uPx*vec2(1.0,-1.0)).rgb+texture(uT,vUv+uPx*vec2(-1.0,1.0)).rgb+texture(uT,vUv+uPx*vec2(1.0,1.0)).rgb)*0.25;float l=dot(c,vec3(0.299,0.587,0.114))*0.55+max(max(c.r,c.g),c.b)*0.45;o=vec4(c*smoothstep(uThr,uThr+0.28,l),1.0);}');
    const blur = G.program(VS, FS_H + 'uniform sampler2D uT;uniform vec2 uD;void main(){vec3 s=texture(uT,vUv).rgb*0.227027;s+=(texture(uT,vUv+uD*1.3846).rgb+texture(uT,vUv-uD*1.3846).rgb)*0.3162162;s+=(texture(uT,vUv+uD*3.2308).rgb+texture(uT,vUv-uD*3.2308).rgb)*0.0702703;o=vec4(s,1.0);}');
    const comp = G.program(VS, FS_H + 'uniform sampler2D uS,uB1,uB2;uniform float uBloom,uBloom2,uVig,uAb,uTime;float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){vec2 d=(vUv-0.5)*uAb;vec3 c=vec3(texture(uS,vUv+d).r,texture(uS,vUv).g,texture(uS,vUv-d).b);c+=texture(uB1,vUv).rgb*uBloom+texture(uB2,vUv).rgb*uBloom2;c*=1.0-uVig*dot(vUv-0.5,vUv-0.5)*1.5;c+=(h(gl_FragCoord.xy+uTime)-0.5)*(1.5/255.0);o=vec4(c,1.0);}');
    let w = 0, h = 0, samples = 0, bloom = 0;
    let res = null;
    const free = () => { if (!res) return; for (const k of res.t) gl.deleteTexture(k); for (const k of res.f) gl.deleteFramebuffer(k); for (const k of res.r) gl.deleteRenderbuffer(k); res = null; };
    const fbo = (colorTex, depthRb) => {
      const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTex, 0);
      if (depthRb) gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRb);
      return f;
    };
    const build = () => {
      free(); const t = [], f = [], r = [];
      const bail = (msg) => { for (const k of t) gl.deleteTexture(k); for (const k of f) gl.deleteFramebuffer(k); for (const k of r) gl.deleteRenderbuffer(k); gl.bindFramebuffer(gl.FRAMEBUFFER, null); throw new Error(msg); };
      const sTex = G.tex(w, h); t.push(sTex);
      let msF = null, sF;
      if (samples > 0) {
        sF = fbo(sTex, null); f.push(sF);
        const cRb = gl.createRenderbuffer(), mdRb = gl.createRenderbuffer(); r.push(cRb, mdRb);
        gl.bindRenderbuffer(gl.RENDERBUFFER, cRb); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.RGBA8, w, h);
        gl.bindRenderbuffer(gl.RENDERBUFFER, mdRb); gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.DEPTH_COMPONENT24, w, h);
        msF = gl.createFramebuffer(); f.push(msF); gl.bindFramebuffer(gl.FRAMEBUFFER, msF);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, cRb);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, mdRb);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { for (const k of t) gl.deleteTexture(k); for (const k of f) gl.deleteFramebuffer(k); for (const k of r) gl.deleteRenderbuffer(k); gl.bindFramebuffer(gl.FRAMEBUFFER, null); samples = 0; return build(); }
      } else {
        const dRb = gl.createRenderbuffer(); r.push(dRb); gl.bindRenderbuffer(gl.RENDERBUFFER, dRb); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h);
        sF = fbo(sTex, dRb); f.push(sF);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) bail('framebuffer incomplete');
      }
      const lv = [];
      if (bloom > 0) for (const sh of bloom > 1 ? [2, 3] : [2]) {
        const bw = Math.max(1, w >> sh), bh = Math.max(1, h >> sh), a = G.tex(bw, bh), b = G.tex(bw, bh); t.push(a, b);
        const L = { w: bw, h: bh, a, b, fa: fbo(a, null), fb: fbo(b, null) }; f.push(L.fa, L.fb); lv.push(L);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      res = { t, f, r, sTex, sF, msF, lv };
    };
    const api = {
      get samples() { return samples; },
      size(nw, nh, opt) {
        nw = Math.max(2, Math.round(nw)); nh = Math.max(2, Math.round(nh));
        let s = opt.samples | 0; if (s > 0) s = Math.min(s, gl.getParameter(gl.MAX_SAMPLES) | 0);
        const nb = opt.bloom | 0;
        if (res && nw === w && nh === h && s === samples && nb === bloom) return;
        w = nw; h = nh; samples = s; bloom = nb; build();
      },
      bind() { gl.bindFramebuffer(gl.FRAMEBUFFER, res.msF || res.sF); gl.viewport(0, 0, w, h); },
      finish(o) {
        gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE); gl.bindVertexArray(null);
        if (res.msF) { gl.bindFramebuffer(gl.READ_FRAMEBUFFER, res.msF); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, res.sF); gl.blitFramebuffer(0, 0, w, h, 0, 0, w, h, gl.COLOR_BUFFER_BIT, gl.NEAREST); }
        const tri = () => gl.drawArrays(gl.TRIANGLES, 0, 3), bindT = (u, i, t) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t); G.seti(u[0], u[1], i); };
        if (bloom > 0) {
          let src = res.sTex, sw = w, sh = h;
          res.lv.forEach((L, k) => {
            gl.bindFramebuffer(gl.FRAMEBUFFER, L.fa); gl.viewport(0, 0, L.w, L.h); G.use(bright); bindT([bright, 'uT'], 0, src); G.set(bright, 'uPx', [1 / sw, 1 / sh]); G.set(bright, 'uThr', k ? -1.0 : (o.thr == null ? 0.55 : o.thr)); tri();
            gl.bindFramebuffer(gl.FRAMEBUFFER, L.fb); G.use(blur); bindT([blur, 'uT'], 0, L.a); G.set(blur, 'uD', [1 / L.w, 0]); tri();
            gl.bindFramebuffer(gl.FRAMEBUFFER, L.fa); bindT([blur, 'uT'], 0, L.b); G.set(blur, 'uD', [0, 1 / L.h]); tri();
            src = L.a; sw = L.w; sh = L.h;
          });
        }
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, o.cw, o.ch);
        G.use(comp); bindT([comp, 'uS'], 0, res.sTex);
        bindT([comp, 'uB1'], 1, bloom > 0 ? res.lv[0].a : res.sTex); bindT([comp, 'uB2'], 2, bloom > 1 ? res.lv[1].a : (bloom > 0 ? res.lv[0].a : res.sTex));
        { const bk = bloom > 0 ? (o.bloom == null ? 0.85 : o.bloom) : 0; G.set(comp, 'uBloom', bk); G.set(comp, 'uBloom2', bloom > 1 ? bk * 0.9 : 0); } G.set(comp, 'uVig', o.vig == null ? 0.5 : o.vig); G.set(comp, 'uAb', o.ab == null ? 0.0025 : o.ab); G.set(comp, 'uTime', o.time || 0);
        tri(); gl.activeTexture(gl.TEXTURE0);
      },
      dispose() { free(); },
    };
    return api;
  };

  /* ---------- quality governor: starts from a device heuristic, only ever steps DOWN when frames are slow ---------- */
  IX.Gov = (onChange) => {
    const coarse = matchMedia('(pointer: coarse)').matches, mem = navigator.deviceMemory || 8, cores = navigator.hardwareConcurrency || 8;
    let q = IX.forcedQ >= 0 ? IX.forcedQ : (coarse || mem <= 4 || cores <= 4 ? 1 : 2);
    const pinned = IX.forcedQ >= 0;
    let ema = 16.7, slow = 0, n = 0, fps = 60;
    return {
      get q() { return q; }, get fps() { return fps; },
      tick(dtMs) {
        if (dtMs > 250 || dtMs <= 0) return; // tab switch / first frame
        n++; ema = ema * 0.95 + dtMs * 0.05; fps = Math.round(1000 / ema);
        if (pinned || n < 30) return;
        if (ema > 27) slow++; else slow = Math.max(0, slow - 2);
        if (slow > 40 && q > 0) { q--; slow = 0; ema = 18; n = 0; onChange(q); }
      },
    };
  };

  /* ---------- shared shader pieces ---------- */
  const SPR_VS = (pre) => `#version 300 es
precision highp float;
${pre}
layout(location=0) in vec2 aQ;
layout(location=1) in vec4 aA;
layout(location=2) in vec4 aC;
layout(location=3) in vec4 aK;
uniform float uT;
uniform vec4 uBurst;
out vec2 vQ;out vec4 vC;out float vKind;
void main(){
  vec3 p=aA.xyz;float sz=aA.w;vec4 col=aC;float kind=aK.x;vQ=aQ;vKind=kind;
  if(kind>0.5&&kind<1.5){
    #ifdef SKY
    vec3 v=skyView(normalize(aA.xyz));
    if(v.z>-0.08){gl_Position=vec4(2.0,2.0,2.0,1.0);return;}
    float tw=0.55+0.45*sin(uT*1.6+aK.y);col.a*=tw;
    vec4 c=skyClip(v);gl_Position=vec4(c.xy+aQ*sz*uPxScale*c.w,c.z,c.w);vC=col;return;
    #endif
  }else if(kind>4.5&&kind<5.5){
    p.y=mod(p.y-uT*(10.0+14.0*aK.z)+400.0,800.0)-400.0;p.x+=sin(uT*0.4+aK.y)*6.0;col.a*=0.55+0.45*sin(uT*1.2+aK.y);
  }else if(kind>5.5&&kind<6.5){
    float t=uBurst.w;vec3 dir=aA.xyz;p=uBurst.xyz+dir*aK.z*(1.0-exp(-t*3.2))+vec3(0.0,70.0*t*t,0.0);
    col.a*=clamp(1.0-t/1.25,0.0,1.0)*step(0.0,t);sz*=clamp(1.0-t/1.6,0.1,1.0);
  }else if(kind>6.5){
    float k=fract(uT*0.45+aK.y-aK.z);p=aA.xyz*k;col.a*=sin(k*3.14159)*(1.0-aK.z*2.2);
  }
  vec3 v=toView(p);v.xy+=aQ*sz;
  gl_Position=viewToClip(v);vC=col;
}`;
  const SPR_FS = `#version 300 es
precision highp float;
in vec2 vQ;in vec4 vC;in float vKind;out vec4 o;
void main(){
  float r=length(vQ);if(r>1.0)discard;
  float a;
  if(vKind<0.5)a=pow(1.0-r,2.2);
  else if(vKind<1.5)a=pow(1.0-r,1.6);
  else if(vKind<2.5)a=smoothstep(0.16,0.0,abs(r-0.82))*0.9;
  else a=pow(1.0-r,2.0)+0.8*smoothstep(0.28,0.0,r);
  o=vec4(vC.rgb*vC.a*a,0.0);
}`;
  const RIB_VS = (pre) => `#version 300 es
precision highp float;
${pre}
layout(location=0) in vec2 aQ;
layout(location=1) in vec4 aA;
layout(location=2) in vec4 aB;
layout(location=3) in vec4 aC;
layout(location=4) in vec4 aK;
uniform vec2 uVP;
out vec2 vQ;out vec4 vC;out float vLen;out float vK;
void main(){
  vec4 ca=viewToClip(toView(aA.xyz)),cb=viewToClip(toView(aB.xyz));
  vec2 pa=ca.xy/ca.w*uVP*0.5,pb=cb.xy/cb.w*uVP*0.5;
  vec2 d=pb-pa;float L=length(d);vec2 dir=L>0.001?d/L:vec2(1.0,0.0);vec2 nr=vec2(-dir.y,dir.x);
  vec4 c=mix(ca,cb,aQ.x);
  c.xy+=nr*aQ.y*aA.w*0.5*2.0/uVP*c.w;
  gl_Position=c;vQ=aQ;vC=aC;vK=aK.x;vLen=aB.w+aQ.x*aK.y;
}`;
  const RIB_FS = `#version 300 es
precision highp float;
in vec2 vQ;in vec4 vC;in float vLen;in float vK;
uniform float uT,uLS;
out vec4 o;
void main(){
  float side=exp(-vQ.y*vQ.y*3.2);
  float flow=1.0;
  if(vK>0.5&&vK<1.5)flow=0.55+0.45*smoothstep(0.35,1.0,sin((vLen*0.045-uT*1.6)*6.2832));
  else if(vK>1.5&&vK<2.5){float d=fract(vLen*0.16*uLS-uT*0.9)+abs(vQ.y)*0.24;flow=0.26+0.74*smoothstep(0.17,0.03,abs(fract(d)-0.5));}
  else if(vK>2.5)flow=0.5+0.5*smoothstep(0.0,1.0,sin(vLen*0.05-uT*0.8));
  o=vec4(vC.rgb*vC.a*side*flow,0.0);
}`;
  IX.shaders = { SPR_VS, SPR_FS, RIB_VS, RIB_FS };
  IX.quad = (G) => G.buf(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
  IX.strip = (G) => G.buf(new Float32Array([0, -1, 0, 1, 1, -1, 1, 1]));
})();
