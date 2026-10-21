/* InfoXteK 3D service galaxy (v3.0.0). WebGL2 renderer: instanced lit spheres, reflective floor, additive ribbons and
   sprites (all animated on the GPU), MSAA + bloom. Camera maths mirror the 2D fallback so hit-testing is shared. */
(() => {
  'use strict';
  const IX = window.IXGL; if (!IX || !IX.GL) return;
  const TAU = Math.PI * 2, D = 700, R0 = 200, FLR = R0 * 0.92, NMAX = 28, SHIFT = -14;
  const NEAR = 40, FAR = 3200, ZA = (FAR + NEAR) / (FAR - NEAR), ZB = (-2 * FAR * NEAR) / (FAR - NEAR);
  const QS = [
    { dpr: 1.25, samples: 0, bloom: 0, mirror: false, stars: 700, dust: 0, noise: 0 },
    { dpr: 1.5, samples: 4, bloom: 1, mirror: true, stars: 1200, dust: 120, noise: 0 },
    { dpr: 2, samples: 4, bloom: 2, mirror: true, stars: 1800, dust: 220, noise: 1 },
  ];
  const PRE = `
#define SKY 1
uniform mat3 uRot;
uniform vec4 uC;
uniform vec2 uPxScale;
vec3 toView(vec3 p){return uRot*p;}
vec4 viewToClip(vec3 v){float d=uC.w-v.z;return vec4(v.x*uC.x,-(v.y*uC.y+uC.z*d),${ZA.toFixed(6)}*d+(${ZB.toFixed(6)}),d);}
vec3 skyView(vec3 d){return uRot*d;}
vec4 skyClip(vec3 v){float w=-v.z;return vec4(v.x*uC.x,-(v.y*uC.y+uC.z*w),0.9999*w,w);}
`;
  const SPHERE_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec3 aP;
layout(location=1) in vec4 aI0;
layout(location=2) in vec4 aI1;
layout(location=3) in vec4 aI2;
uniform float uMir,uFlr,uT;
out vec3 vN;out vec3 vPv;out vec3 vO;out vec4 vCol;out vec4 vS;out float vH;
void main(){
  vec3 wp=aI0.xyz+aP*aI0.w;vec3 n=aP;vH=uFlr-wp.y;
  if(uMir>0.5){wp.y=2.0*uFlr-wp.y;n.y=-n.y;}
  vec3 v=toView(wp);vN=uRot*n;vPv=v;
  float a=aI2.y+uT*0.35;float ca=cos(a),sa=sin(a);
  vO=vec3(aP.x*ca+aP.z*sa,aP.y,-aP.x*sa+aP.z*ca);
  vCol=vec4(aI1.rgb,aI2.w);vS=vec4(aI1.w,aI2.x,aI2.z,aI2.y);
  gl_Position=viewToClip(v);
}`;
  const SPHERE_FS = `#version 300 es
precision highp float;
in vec3 vN;in vec3 vPv;in vec3 vO;in vec4 vCol;in vec4 vS;in float vH;
uniform vec3 uL0,uL1,uL2,uAcc;uniform float uT,uMir,uD;
out vec4 o;
vec3 env(vec3 r){
  float h=clamp(0.5-r.y*0.5,0.0,1.0);
  vec3 sky=mix(vec3(0.015,0.03,0.09),vec3(0.16,0.28,0.55),pow(h,1.4));
  sky+=uAcc*0.32*exp(-pow((h-0.5)*5.0,2.0));
  float b1=smoothstep(0.86,0.97,dot(r,uL0));
  float b2=smoothstep(0.9,0.985,dot(r,uL1))*0.55;
  float b3=smoothstep(0.93,0.99,dot(r,uL2))*0.5;
  return sky+vec3(1.0,0.96,0.9)*b1*1.5+vec3(0.55,0.78,1.0)*b2+uAcc*b3;
}
void main(){
  vec3 N=normalize(vN);vec3 V=normalize(vec3(-vPv.xy,uD-vPv.z));
  float ndv=max(dot(N,V),0.0);float fres=pow(1.0-ndv,3.0);
  vec3 base=vCol.rgb;float sel=vS.x,hov=vS.y,core=vS.z;
  float d0=clamp(dot(N,uL0)*0.5+0.5,0.0,1.0);d0*=d0;
  float d1=clamp(dot(N,uL1)*0.5+0.5,0.0,1.0);d1*=d1;
  float d2=pow(clamp(dot(N,uL2)*0.5+0.5,0.0,1.0),3.0);
  vec3 diff=base*(0.05+1.05*d0*vec3(1.0,0.97,0.92)+0.4*d1*vec3(0.55,0.75,1.0))+uAcc*d2*0.3;
  vec3 R=reflect(-V,N);
  vec3 refl=env(R)*(0.10+0.62*fres);
  float spec=pow(max(dot(N,normalize(uL0+V)),0.0),140.0)*1.7+pow(max(dot(N,normalize(uL1+V)),0.0),60.0)*0.35;
  vec3 po=normalize(vO);
  float lines=smoothstep(0.95,1.0,abs(sin(po.y*7.0+uT*0.5)))*0.3;
  float scan=exp(-pow((po.y-sin(uT*0.9+vS.w)*0.8)*11.0,2.0))*0.8;
  float inner=pow(1.0-ndv,1.2);
  vec3 emis=base*(0.10+0.34*inner)+uAcc*(lines*0.5+scan*0.8);
  vec3 c=diff+refl+vec3(spec)+emis*(0.5+0.9*sel+0.5*hov)+fres*mix(uAcc,vec3(1.0),0.3)*(0.3+0.45*sel+0.2*hov);
  if(core>0.5){c=mix(vec3(0.95,0.97,1.0),uAcc,pow(1.0-ndv,1.2)*0.85)*1.3+uAcc*lines*0.6+vec3(spec*0.6);}
  c=c/(1.0+0.38*c);c=mix(c,vec3(0.03,0.06,0.15),smoothstep(-60.0,-380.0,vPv.z)*0.5);
  float a=vCol.a;
  if(uMir>0.5)a*=0.55*exp(-max(vH,0.0)/190.0)*smoothstep(-20.0,40.0,vH+30.0);
  o=vec4(c*a,a);
}`;
  const FLOOR_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec2 aQ;
uniform float uFlr;out vec3 vW;
void main(){vec3 p=vec3(aQ.x*640.0,uFlr,aQ.y*640.0);vW=p;gl_Position=viewToClip(toView(p));}`;
  const FLOOR_FS = `#version 300 es
precision highp float;
in vec3 vW;uniform vec3 uAcc;out vec4 o;
void main(){
  vec2 q=vW.xz;float r=length(q);
  vec2 gq=q/70.0;vec2 gd=abs(fract(gq-0.5)-0.5)/max(fwidth(gq),vec2(0.0001));
  float line=1.0-min(min(gd.x,gd.y),1.0);
  float edge=smoothstep(600.0,150.0,r);float sheen=exp(-r*r/135200.0);
  vec3 base=mix(vec3(0.015,0.03,0.08),vec3(0.05,0.1,0.22),sheen);
  vec3 col=base+uAcc*line*0.42*edge+uAcc*0.05*sheen;
  float a=0.6*edge;o=vec4(col*a,a);
}`;
  const DECAL_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec2 aQ;
layout(location=1) in vec4 aD0;
layout(location=2) in vec4 aD1;
layout(location=3) in vec4 aD2;
uniform float uFlr;out vec2 vQ;out vec4 vC;out vec4 vD;
void main(){vec3 p=vec3(aD0.x+aQ.x*aD0.z,uFlr-0.4,aD0.y+aQ.y*aD0.z);vQ=aQ;vC=aD1;vD=vec4(aD0.w,aD2.xyz);gl_Position=viewToClip(toView(p));}`;
  const DECAL_FS = `#version 300 es
precision highp float;
in vec2 vQ;in vec4 vC;in vec4 vD;out vec4 o;
void main(){
  float r=length(vQ);if(r>1.0)discard;
  if(vD.x<0.5){float a=pow(1.0-r,1.5)*vC.a;o=vec4(0.0,0.0,0.0,a);}
  else if(vD.x<1.5){float a=pow(1.0-r,2.0)*vC.a;o=vec4(vC.rgb*a,0.0);}
  else{float rr=vD.y;float a=smoothstep(0.12,0.0,abs(r-rr))*(1.0-rr)*vC.a;o=vec4(vC.rgb*a,0.0);}
}`;
  const BG_VS = '#version 300 es\nout vec2 vUv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUv=p;gl_Position=vec4(p*2.0-1.0,0.9999,1.0);}';
  const BG_FS = `#version 300 es
precision highp float;
in vec2 vUv;uniform vec2 uVP,uPar;uniform vec3 uAcc;uniform float uT,uNoise;out vec4 o;
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float nz(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hs(i),hs(i+vec2(1.0,0.0)),f.x),mix(hs(i+vec2(0.0,1.0)),hs(i+vec2(1.0,1.0)),f.x),f.y);}
void main(){
  vec2 uv=vUv;vec2 asp=vec2(uVP.x/uVP.y,1.0);
  vec2 c=(uv-vec2(0.5,0.62))*asp;float r=length(c);
  vec3 col=mix(vec3(0.14,0.23,0.57),vec3(0.047,0.082,0.2),smoothstep(0.0,0.75,r));
  col=mix(col,vec3(0.027,0.043,0.12),smoothstep(0.55,1.1,r));
  vec2 p1=(uv-vec2(0.3,0.35)-uPar*0.04)*asp;col+=uAcc*0.2*exp(-dot(p1,p1)*3.2);
  vec2 p2=(uv-vec2(0.75,0.7)+uPar*0.03)*asp;col+=vec3(0.39,0.4,0.95)*0.2*exp(-dot(p2,p2)*3.6);
  if(uNoise>0.5){vec2 q=uv*vec2(4.0*asp.x,4.0)+uPar*1.5+uT*0.01;float n=nz(q)*0.5+nz(q*2.03)*0.3+nz(q*4.1)*0.2;col+=uAcc*0.1*smoothstep(0.35,0.85,n)*exp(-r*1.5);}
  for(int k=0;k<3;k++){float fk=float(k);float x0=0.2+0.3*fk-uPar.x*0.1;float dx=uv.x-(x0+(1.0-uv.y)*0.14);float w=0.04+0.02*sin(uT*0.5+fk);col+=mix(uAcc,vec3(1.0),0.6)*0.07*exp(-dx*dx/(w*w))*smoothstep(0.0,0.9,uv.y);}
  o=vec4(col,1.0);
}`;

  const hueRot = (c, deg) => { const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a); return [Math.max(0, Math.min(1, c[0] * (0.299 + 0.701 * ca + 0.168 * sa) + c[1] * (0.587 - 0.587 * ca + 0.330 * sa) + c[2] * (0.114 - 0.114 * ca - 0.497 * sa))), Math.max(0, Math.min(1, c[0] * (0.299 - 0.299 * ca - 0.328 * sa) + c[1] * (0.587 + 0.413 * ca + 0.035 * sa) + c[2] * (0.114 - 0.114 * ca + 0.292 * sa))), Math.max(0, Math.min(1, c[0] * (0.299 - 0.3 * ca + 1.25 * sa) + c[1] * (0.587 - 0.588 * ca - 1.05 * sa) + c[2] * (0.114 + 0.886 * ca - 0.203 * sa)))]; };
  const norm3 = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  IX.galaxy = (canvas, opt) => {
    opt = opt || {};
    const G = IX.GL(canvas), gl = G.gl;
    let W = 1, H = 1, cw = 2, ch = 2, q = 2, lost = false, lostTimer = 0, disposed = false, lastNow = 0, frames = 0, errCount = 0, dc = 0, burstT0 = -99, burstP = [0, 0, 0];
    const rot = new Float32Array(9), L0 = [0, 0, 0], L1 = [0, 0, 0], L2 = [0, 0, 0];
    let kScale = 1; const selA = new Float32Array(NMAX), hovA = new Float32Array(NMAX);
    let accKey = '';
    const A_S = new Float32Array((NMAX + 5) * 12), A_D = new Float32Array((NMAX * 3 + 2) * 12), A_R = new Float32Array(240 * 16), A_F = new Float32Array((NMAX * 5 + 6) * 12), errEvery = IX.forcedQ >= 0 ? 90 : 900;
    const gov = IX.Gov((nq) => { q = nq; applyQ(); });
    q = gov.q;
    let R = null; // GL resources (rebuilt after context restore)

    const init = () => {
      G.reset && G.reset();
      const r = {};
      r.post = IX.Post(G);
      r.sphere = G.program(SPHERE_VS, SPHERE_FS);
      r.floor = G.program(FLOOR_VS, FLOOR_FS);
      r.decal = G.program(DECAL_VS, DECAL_FS);
      r.spr = G.program(IX.shaders.SPR_VS(PRE), IX.shaders.SPR_FS);
      r.rib = G.program(IX.shaders.RIB_VS(PRE), IX.shaders.RIB_FS);
      r.bg = G.program(BG_VS, '#version 300 es\n' + BG_FS.slice(BG_FS.indexOf('precision')));
      const quad = IX.quad(G), strip = IX.strip(G);
      const sg = IX.geo.sphere(40, 28); r.sIdx = G.buf(sg.i, gl.STATIC_DRAW, gl.ELEMENT_ARRAY_BUFFER); r.sVtx = G.buf(sg.v); r.sCount = sg.i.length;
      r.sInst = G.buf(new Float32Array((NMAX + 5) * 12), gl.DYNAMIC_DRAW);
      r.sVao = G.vao([[r.sVtx, 0, 3, 6, 0, 0], [r.sInst, 1, 4, 12, 0, 1], [r.sInst, 2, 4, 12, 4, 1], [r.sInst, 3, 4, 12, 8, 1]], r.sIdx);
      r.fVao = G.vao([[quad, 0, 2, 2, 0, 0]]);
      r.dInst = G.buf(new Float32Array((NMAX * 3 + 2) * 12), gl.DYNAMIC_DRAW);
      r.dVao = G.vao([[quad, 0, 2, 2, 0, 0], [r.dInst, 1, 4, 12, 0, 1], [r.dInst, 2, 4, 12, 4, 1], [r.dInst, 3, 4, 12, 8, 1]]);
      // ribbons: dynamic (links, gyro, beam) + static (orbit rings)
      r.rDyn = G.buf(new Float32Array(240 * 16), gl.DYNAMIC_DRAW);
      r.rDynVao = G.vao([[strip, 0, 2, 2, 0, 0], [r.rDyn, 1, 4, 16, 0, 1], [r.rDyn, 2, 4, 16, 4, 1], [r.rDyn, 3, 4, 16, 8, 1], [r.rDyn, 4, 4, 16, 12, 1]]);
      r.rStat = G.buf(new Float32Array(160 * 16), gl.DYNAMIC_DRAW);
      r.rStatVao = G.vao([[strip, 0, 2, 2, 0, 0], [r.rStat, 1, 4, 16, 0, 1], [r.rStat, 2, 4, 16, 4, 1], [r.rStat, 3, 4, 16, 8, 1], [r.rStat, 4, 4, 16, 12, 1]]);
      // sprites: stars, dust, burst (static) + dynamic fx
      const mkSpr = (arr) => { const b = G.buf(arr), v = G.vao([[quad, 0, 2, 2, 0, 0], [b, 1, 4, 12, 0, 1], [b, 2, 4, 12, 4, 1], [b, 3, 4, 12, 8, 1]]); return { b, v }; };
      const stars = new Float32Array(1800 * 12);
      for (let i = 0; i < 1800; i++) { const u = Math.random() * 2 - 1, a = Math.random() * TAU, s = Math.sqrt(1 - u * u), br = 0.35 + Math.random() * 0.6; stars.set([Math.cos(a) * s, u, Math.sin(a) * s, 0.7 + Math.random() * 1.2, 0.74 + Math.random() * 0.1, 0.84, 1, br, 1, Math.random() * TAU, 0, 0], i * 12); }
      r.stars = mkSpr(stars);
      const dust = new Float32Array(220 * 12);
      for (let i = 0; i < 220; i++) dust.set([(Math.random() - 0.5) * 520, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 520, 1.2 + Math.random() * 2.2, 0.8, 0.92, 1, 0.3 + Math.random() * 0.2, 5, Math.random() * TAU, Math.random(), 0], i * 12);
      r.dust = mkSpr(dust);
      const bur = new Float32Array(56 * 12);
      for (let i = 0; i < 56; i++) { const u = Math.random() * 2 - 1, a = Math.random() * TAU, s = Math.sqrt(1 - u * u); bur.set([Math.cos(a) * s, u, Math.sin(a) * s, 2.2 + Math.random() * 3.2, 1, 1, 1, 0.9, 6, 0, 90 + Math.random() * 130, 0], i * 12); }
      r.burst = mkSpr(bur);
      r.fx = G.buf(new Float32Array((NMAX * 5 + 6) * 12), gl.DYNAMIC_DRAW);
      r.fxVao = G.vao([[quad, 0, 2, 2, 0, 0], [r.fx, 1, 4, 12, 0, 1], [r.fx, 2, 4, 12, 4, 1], [r.fx, 3, 4, 12, 8, 1]]);
      R = r; accKey = '';
    };

    const applyQ = () => {
      const s = QS[q], dpr = Math.min(window.devicePixelRatio || 1, s.dpr);
      cw = Math.max(2, Math.round(W * dpr)); ch = Math.max(2, Math.round(H * dpr));
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      if (R) R.post.size(cw, ch, { samples: s.samples, bloom: s.bloom });
    };

    const setCam = (yaw, pitch, punch) => {
      const Q = -pitch, cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(Q), sp = Math.sin(Q);
      rot.set([cy, sy * sp, -sy * cp, 0, cp, sp, sy, -cy * sp, cy * cp]);
      kScale = Math.min(1.1, Math.max(0.62, W / 760)) * (1 + 0.1 * punch);
      const tv = (v) => [rot[0] * v[0] + rot[3] * v[1] + rot[6] * v[2], rot[1] * v[0] + rot[4] * v[1] + rot[7] * v[2], rot[2] * v[0] + rot[5] * v[1] + rot[8] * v[2]];
      const a = tv(norm3([-0.55, -0.75, 0.55])), b = tv(norm3([0.8, -0.1, 0.45])), c = tv(norm3([0.1, -0.4, -0.9]));
      L0[0] = a[0]; L0[1] = a[1]; L0[2] = a[2]; L1[0] = b[0]; L1[1] = b[1]; L1[2] = b[2]; L2[0] = c[0]; L2[1] = c[1]; L2[2] = c[2];
    };
    const project = (p) => {
      const x = rot[0] * p[0] + rot[3] * p[1] + rot[6] * p[2], y = rot[1] * p[0] + rot[4] * p[1] + rot[7] * p[2], z = rot[2] * p[0] + rot[5] * p[1] + rot[8] * p[2], f = (D / (D - z)) * kScale;
      return { x: W / 2 + x * f, y: H / 2 + SHIFT + y * f, z, f };
    };

    const common = (pr, acc) => {
      G.use(pr); G.set(pr, 'uRot', rot); G.set(pr, 'uC', [(2 * D * kScale) / W, (2 * D * kScale) / H, (2 * SHIFT) / H, D]); G.set(pr, 'uPxScale', [2 / W, 2 / H]);
      G.set(pr, 'uVP', [W, H]); G.set(pr, 'uAcc', acc); G.set(pr, 'uFlr', FLR);
    };
    const fillRing = (arr, o, fn, n, w, col, kind, phase0) => {
      let len = 0, prev = fn(0);
      for (let i = 1; i <= n; i++) { const cur = fn(i / n), d = Math.hypot(cur[0] - prev[0], cur[1] - prev[1], cur[2] - prev[2]); arr.set([prev[0], prev[1], prev[2], w, cur[0], cur[1], cur[2], len, col[0], col[1], col[2], col[3], kind, d, 0, 0], o); o += 16; len += d; prev = cur; }
      return o;
    };

    let ringN = 0;
    const buildRings = (acc) => {
      const arr = new Float32Array(160 * 16); let o = 0;
      const c = [acc[0] * 0.7 + 0.3, acc[1] * 0.7 + 0.3, acc[2] * 0.7 + 0.3, 0.3];
      o = fillRing(arr, o, (t) => [Math.cos(t * TAU) * R0, 0, Math.sin(t * TAU) * R0], 72, 1.4, c, 3, 0);
      o = fillRing(arr, o, (t) => [Math.cos(t * TAU) * R0 * 1.12, Math.sin(t * TAU) * R0 * 0.35, Math.sin(t * TAU) * R0 * 1.12], 72, 1, [c[0], c[1], c[2], 0.2], 3, 0);
      ringN = o / 16; G.sub(R.rStat, arr);
    };

    const api = {
      get q() { return q; }, get fps() { return gov.fps; },
      info() { return { q, fps: gov.fps, dc, err: errCount, frames, samples: R ? R.post.samples : 0, bloom: QS[q].bloom, lost }; },
      resize(w, h) { W = Math.max(2, w); H = Math.max(2, h); applyQ(); },
      cam: setCam, project,
      burst(p) { burstP = p.slice(); burstT0 = -1; },
      draw(fr) {
        if (lost || disposed || !R) return;
        const now = performance.now(); if (lastNow) gov.tick(now - lastNow); lastNow = now;
        const T = fr.T, dt = fr.dt || 0.016, nodes = fr.nodes, n = Math.min(nodes.length, NMAX), s = QS[q];
        if (burstT0 === -1) burstT0 = T;
        const acc = [fr.col[0] / 255, fr.col[1] / 255, fr.col[2] / 255];
        const key = acc.join(',');
        if (key !== accKey) { accKey = key; buildRings(acc); }
        const ease = fr.tr == null ? 1 : fr.tr, grow = 0.35 + 0.65 * ease, k = 1 - Math.exp(-dt * 12);
        for (let i = 0; i < NMAX; i++) { selA[i] += ((i === fr.sel ? 1 : 0) - selA[i]) * k; hovA[i] += ((i === fr.hover ? 1 : 0) - hovA[i]) * k; }
        // --- instance data: spheres
        const si = A_S; let c = 0;
        const rad = [], pul = 1 + 0.12 * Math.sin(T * 2.2);
        si.set([0, 0, 0, 24 * (1 + 0.04 * Math.sin(T * 2.2)), 1, 1, 1, 0, 0, 0, 1, 1], c); c += 12;
        for (let i = 0; i < n; i++) {
          const p = nodes[i], r = 19 * grow * (1 + 0.2 * hovA[i] + 0.22 * selA[i] * (1 + 0.05 * Math.sin(T * 3))); rad[i] = r;
          const t = 0.5 + 0.5 * Math.sin(i * 2.399), mix = hueRot(acc, (i % 3 - 1) * 9), br = 0.82 + 0.18 * t;
          si.set([p[0], p[1], p[2], r, mix[0] * br, mix[1] * br, mix[2] * br, selA[i], hovA[i], i * 0.9, 0, 1], c); c += 12;
        }
        const sel = fr.sel;
        if (sel >= 0 && sel < n) for (let j = 0; j < 3; j++) { const a = T * 1.7 + j * 2.094, p = nodes[sel], r = rad[sel]; si.set([p[0] + Math.cos(a) * r * 1.9, p[1] + Math.sin(a * 0.7) * r * 0.5, p[2] + Math.sin(a) * r * 1.9, r * (0.13 + 0.04 * Math.sin(a)), 1, 1, 1, 1, 0, j, 0, 1], c); c += 12; }
        const sCount = c / 12; G.sub(R.sInst, si.subarray(0, c));
        // --- decals: shadows, pools, ripple
        const di = A_D; let d = 0;
        for (let i = 0; i < n; i++) {
          const p = nodes[i], h = Math.max(0, (FLR - p[1]) / 260), r = rad[i];
          di.set([p[0], p[2], r * 1.6, 0, 0, 0, 0, Math.max(0.1, 0.5 - h * 0.3), 0, 0, 0, 0], d); d += 12;
          di.set([p[0], p[2], 64 * grow, 1, acc[0], acc[1], acc[2], 0.22 + 0.4 * selA[i] + 0.12 * hovA[i], 0, 0, 0, 0], d); d += 12;
        }
        if (sel >= 0 && sel < n) { const p = nodes[sel]; di.set([p[0], p[2], 90, 2, acc[0] * 0.5 + 0.5, acc[1] * 0.5 + 0.5, acc[2] * 0.5 + 0.5, 0.8, (T * 0.7) % 1, 0, 0, 0], d); d += 12; }
        G.sub(R.dInst, di.subarray(0, d)); const dCount = d / 12;
        // --- ribbons: links, neighbour links, gyro, beam
        const rb = A_R; let o = 0;
        for (let i = 0; i < n; i++) {
          const p = nodes[i], len = Math.hypot(p[0], p[1], p[2]), ss = selA[i], dep = Math.max(0.15, Math.min(1, (p[2] + 280) / 520));
          rb.set([0, 0, 0, 1.1 + 1.4 * ss, p[0], p[1], p[2], 0, acc[0] * 0.5 + 0.5, acc[1] * 0.5 + 0.5, acc[2] * 0.5 + 0.5, (0.1 + 0.34 * dep) * (1 + 1.2 * ss), 1, len, 0, 0], o); o += 16;
          const b = nodes[(i + 1) % n]; if (b !== p && n > 2) { const dl = Math.hypot(b[0] - p[0], b[1] - p[1], b[2] - p[2]); rb.set([p[0], p[1], p[2], 1, b[0], b[1], b[2], 0, acc[0], acc[1], acc[2], 0.1 + 0.16 * dep, 3, dl, 0, 0], o); o += 16; }
        }
        if (sel >= 0 && sel < n) { const p = nodes[sel]; rb.set([p[0], p[1] + rad[sel], p[2], 3.4, p[0], FLR, p[2], 0, acc[0], acc[1], acc[2], 0.4, 0, FLR - p[1], 0, 0], o); o += 16; }
        const gc = [acc[0] * 0.4 + 0.6, acc[1] * 0.4 + 0.6, acc[2] * 0.4 + 0.6, 0.65], rr = 34, c9 = Math.cos(T * 0.9), s9 = Math.sin(T * 0.9), c8 = Math.cos(T * 0.8), s8 = Math.sin(T * 0.8);
        o = fillRing(rb, o, (t) => { const a = t * TAU; return [Math.cos(a) * rr, Math.sin(a) * rr * c9, Math.sin(a) * rr * s9]; }, 36, 1.5, gc, 0, 0);
        o = fillRing(rb, o, (t) => { const a = t * TAU; return [Math.cos(a) * rr * c8, Math.sin(a) * rr, Math.cos(a) * rr * s8]; }, 36, 1.5, gc, 0, 0);
        G.sub(R.rDyn, rb.subarray(0, o)); const rCount = o / 16;
        // --- sprites: halos, core glow, pulses
        const fx = A_F; let f = 0;
        fx.set([0, 0, 0, 72 * pul, acc[0] * 0.5 + 0.5, acc[1] * 0.5 + 0.5, acc[2] * 0.5 + 0.5, 0.42, 0, 0, 0, 0], f); f += 12;
        fx.set([0, 0, 0, 30, 1, 1, 1, 0.45, 3, 0, 0, 0], f); f += 12;
        for (let i = 0; i < n; i++) {
          const p = nodes[i], dep = Math.max(0.3, Math.min(1, (p[2] + 300) / 500));
          fx.set([p[0], p[1], p[2], rad[i] * (2.5 + 0.8 * selA[i]), acc[0], acc[1], acc[2], (0.10 + 0.4 * selA[i] + 0.14 * hovA[i]) * dep, 0, 0, 0, 0], f); f += 12;
          for (let t = 0; t < 3; t++) { fx.set([p[0], p[1], p[2], 3.2 - t * 0.8, 1, 1, 1, 0.9 * dep, 7, i * 0.23, t * 0.035, 0], f); f += 12; }
        }
        G.sub(R.fx, fx.subarray(0, f)); const fCount = f / 12;
        // ================= render =================
        dc = 0;
        R.post.bind();
        gl.clearColor(0.03, 0.05, 0.12, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE); gl.bindVertexArray(null);
        G.use(R.bg); G.set(R.bg, 'uVP', [W, H]); G.set(R.bg, 'uPar', [(fr.yaw || 0) * 0.5 + (fr.px || 0) * 0.6, (fr.pitch || 0) * 0.6 + (fr.py || 0) * 0.4]); G.set(R.bg, 'uAcc', acc); G.set(R.bg, 'uT', T); G.set(R.bg, 'uNoise', s.noise);
        gl.drawArrays(gl.TRIANGLES, 0, 3); dc++;
        gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.depthMask(false);
        // stars
        common(R.spr, acc); G.set(R.spr, 'uT', T); G.set(R.spr, 'uBurst', [0, 0, 0, -1]);
        gl.bindVertexArray(R.stars.v); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, s.stars); dc++;
        // mirrored spheres (floor reflection)
        gl.enable(gl.CULL_FACE); gl.depthMask(true);
        const drawSpheres = (mir) => {
          common(R.sphere, acc); G.set(R.sphere, 'uMir', mir); G.set(R.sphere, 'uT', T); G.set(R.sphere, 'uD', D); G.set(R.sphere, 'uL0', L0); G.set(R.sphere, 'uL1', L1); G.set(R.sphere, 'uL2', L2);
          gl.frontFace(mir ? gl.CCW : gl.CW); gl.bindVertexArray(R.sVao); gl.drawElementsInstanced(gl.TRIANGLES, R.sCount, gl.UNSIGNED_SHORT, 0, sCount); dc++;
        };
        if (s.mirror) drawSpheres(1);
        gl.disable(gl.CULL_FACE);
        // floor
        common(R.floor, acc); gl.bindVertexArray(R.fVao); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); dc++;
        // decals
        gl.depthMask(false); common(R.decal, acc); gl.bindVertexArray(R.dVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dCount); dc++;
        // real spheres
        gl.enable(gl.CULL_FACE); gl.depthMask(true); drawSpheres(0); gl.disable(gl.CULL_FACE); gl.frontFace(gl.CCW); gl.depthMask(false);
        // ribbons
        common(R.rib, acc); G.set(R.rib, 'uT', T); G.set(R.rib, 'uLS', 1);
        gl.bindVertexArray(R.rStatVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, ringN); dc++;
        gl.bindVertexArray(R.rDynVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, rCount); dc++;
        // sprites
        common(R.spr, acc); G.set(R.spr, 'uT', T);
        if (s.dust) { G.set(R.spr, 'uBurst', [0, 0, 0, -1]); gl.bindVertexArray(R.dust.v); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, s.dust); dc++; }
        G.set(R.spr, 'uBurst', [0, 0, 0, -1]); gl.bindVertexArray(R.fxVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, fCount); dc++;
        const age = T - burstT0; G.set(R.spr, 'uBurst', [burstP[0], burstP[1], burstP[2], age < 1.4 && age >= 0 ? age : -1]);
        if (age >= 0 && age < 1.4) { gl.bindVertexArray(R.burst.v); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, 56); dc++; }
        gl.depthMask(true); gl.bindVertexArray(null);
        R.post.finish({ cw, ch, bloom: 0.7, vig: 0.55, ab: s.bloom ? 0.003 : 0, time: T * 60 % 997, thr: 0.62 }); dc += 1 + (s.bloom ? 3 * s.bloom : 0);
        frames++;
        if (frames % errEvery === 0) { const e = gl.getError(); if (e !== gl.NO_ERROR) errCount++; }
      },
      dispose() { disposed = true; clearTimeout(lostTimer); canvas.removeEventListener('webglcontextlost', onLost); canvas.removeEventListener('webglcontextrestored', onRest); R = null; G.dispose(); },
    };
    const onLost = (e) => { e.preventDefault(); lost = true; clearTimeout(lostTimer); lostTimer = setTimeout(() => { if (lost && opt.onFail) opt.onFail(new Error('context lost')); }, 2500); };
    const onRest = () => { clearTimeout(lostTimer); try { init(); applyQ(); lost = false; } catch (err) { if (opt.onFail) opt.onFail(err); } };
    canvas.addEventListener('webglcontextlost', onLost); canvas.addEventListener('webglcontextrestored', onRest);
    init();
    return api;
  };
})();
