/* InfoXteK 3D flow stage (v3.0.0). One shared WebGL2 context renders a logical flow (zones, typed 3D nodes,
   links with direction chevrons, packets) and moves a camera step by step. Data comes from the page (data-f JSON). */
(() => {
  'use strict';
  const IX = window.IXGL; if (!IX || !IX.GL) return;
  const TAU = Math.PI * 2, PI = Math.PI, U = 6.2, NS = 1.15, FOV = 0.66, calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const QF = [{ dpr: 1.25, ms: 0, bloom: 0, mirror: false }, { dpr: 1.5, ms: 4, bloom: 1, mirror: true }, { dpr: 2, ms: 4, bloom: 1, mirror: true }];
  const TONES = { info: [0.13, 0.83, 0.93], good: [0.22, 0.86, 0.55], warn: [1, 0.7, 0.2], bad: [1, 0.33, 0.4], ai: [0.67, 0.56, 0.98], mute: [0.55, 0.68, 0.9] };
  const KTONE = { threat: 'bad', firewall: 'warn', ai: 'ai', shield: 'info', lock: 'info', key: 'warn', bell: 'warn', goal: 'good', db: 'info', cloud: 'info', globe: 'info', chart: 'good', package: 'warn' };
  // prims: 0 box, 1 cylinder, 2 sphere, 3 thin torus, 4 cone, 5 hex prism, 6 hex cone, 7 thick torus
  const B = 0, C = 1, S = 2, T = 3, K = 4, X = 5, Y = 6, TK = 7;
  const m = (p, x, y, z, sx, sy, sz, ry, rx, t, e) => [p, x, y, z, sx, sy, sz, ry || 0, rx || 0, t || 0, e || 0];
  const around = (n, r, f) => Array.from({ length: n }, (_, i) => f(i, (i / n) * TAU, Math.sin((i / n) * TAU) * r, Math.cos((i / n) * TAU) * r));
  const REC = {
    user: () => [m(S, 0, 1.4, 0, 0.34, 0.34, 0.34, 0, 0, 4), m(C, 0, 0.66, 0, 0.46, 0.85, 0.46, 0, 0, 1), m(S, 0, 1.02, 0, 0.5, 0.26, 0.5, 0, 0, 1)],
    device: () => [m(B, 0, 0.22, 0, 1.5, 0.12, 1, 0, 0, 2), m(B, 0, 0.72, -0.42, 1.5, 0.95, 0.08, 0, -0.28, 2), m(B, 0, 0.72, -0.37, 1.36, 0.8, 0.02, 0, -0.28, 3, 1)],
    phone: () => [m(B, 0, 0.85, 0, 0.62, 1.3, 0.1, 0, 0, 2), m(B, 0, 0.85, 0.06, 0.52, 1.14, 0.02, 0, 0, 3, 1)],
    server: () => [0, 1, 2].flatMap((i) => [m(B, 0, 0.34 + i * 0.44, 0, 1.6, 0.38, 1.1, 0, 0, 0), m(B, -0.55, 0.34 + i * 0.44, 0.56, 0.2, 0.08, 0.02, 0, 0, 3, 1), m(B, 0.25, 0.34 + i * 0.44, 0.56, 0.7, 0.07, 0.02, 0, 0, 2)]),
    db: () => [0, 1, 2].flatMap((i) => [m(C, 0, 0.36 + i * 0.46, 0, 0.85, 0.38, 0.85, 0, 0, 0), m(T, 0, 0.56 + i * 0.46, 0, 0.87, 0.87, 0.87, 0, 0, 3, 1)]),
    cloud: () => [m(S, -0.5, 0.86, 0, 0.5, 0.42, 0.5, 0, 0, 4), m(S, 0.1, 1.06, 0, 0.66, 0.56, 0.62, 0, 0, 4), m(S, 0.65, 0.84, 0, 0.48, 0.4, 0.48, 0, 0, 4), m(C, 0.05, 0.62, 0, 0.9, 0.2, 0.55, 0, 0, 4), m(S, 0.05, 0.98, 0, 0.26, 0.26, 0.26, 0, 0, 3, 1)],
    shield: () => [m(Y, 0, 1.0, 0, 0.9, 1.3, 0.9, 0, 0, 2), m(Y, 0, 1.02, 0, 0.62, 1.34, 0.62, 0, 0, 1), m(S, 0, 1.25, 0, 0.3, 0.3, 0.3, 0, 0, 3, 1), m(T, 0, 1.66, 0, 0.9, 0.9, 0.9, 0, 0, 3, 1)],
    lock: () => [m(B, 0, 0.62, 0, 1.0, 0.8, 0.62, 0, 0, 1), m(TK, 0, 1.28, 0, 0.36, 0.36, 0.36, 0, PI / 2, 4), m(B, 0, 0.62, 0.32, 0.12, 0.3, 0.02, 0, 0, 3, 1)],
    key: () => [m(TK, -0.5, 0.8, 0, 0.42, 0.42, 0.42, 0, PI / 2, 1), m(B, 0.3, 0.8, 0, 1.2, 0.12, 0.12, 0, 0, 4), m(B, 0.62, 0.66, 0, 0.12, 0.22, 0.12, 0, 0, 4), m(B, 0.9, 0.68, 0, 0.12, 0.18, 0.12, 0, 0, 4)],
    gear: () => [m(C, 0, 0.5, 0, 0.78, 0.3, 0.78, 0, 0, 0), ...around(8, 0.86, (i, a, x, z) => m(B, x, 0.5, z, 0.3, 0.3, 0.3, a, 0, 0)), m(C, 0, 0.5, 0, 0.3, 0.42, 0.3, 0, 0, 3, 1)],
    globe: () => [m(C, 0, 0.22, 0, 0.8, 0.16, 0.8, 0, 0, 2), m(S, 0, 1.1, 0, 0.78, 0.78, 0.78, 0, 0, 2), m(T, 0, 1.1, 0, 0.95, 0.95, 0.95, 0, 0, 3, 1), m(T, 0, 1.1, 0, 0.95, 0.95, 0.95, 0, PI / 2, 3, 0.8), m(T, 0, 1.1, 0, 0.95, 0.95, 0.95, PI / 2, PI / 2, 3, 0.8)],
    doc: () => [m(B, 0, 0.9, 0, 0.98, 1.3, 0.08, 0, 0, 4), m(B, 0, 1.2, 0.05, 0.66, 0.07, 0.02, 0, 0, 3, 1), m(B, 0, 0.95, 0.05, 0.66, 0.07, 0.02, 0, 0, 3, 1), m(B, -0.1, 0.7, 0.05, 0.46, 0.07, 0.02, 0, 0, 3, 1)],
    mail: () => [m(B, 0, 0.75, 0, 1.45, 0.95, 0.12, 0, 0, 4), m(B, 0, 0.98, 0.07, 1.2, 0.07, 0.02, 0, 0, 3, 1), m(B, 0, 0.68, 0.07, 1.2, 0.05, 0.02, 0, 0, 1)],
    bell: () => [m(K, 0, 0.82, 0, 0.62, 1.2, 0.62, 0, 0, 1), m(S, 0, 1.5, 0, 0.16, 0.16, 0.16, 0, 0, 3, 1), m(S, 0, 0.3, 0, 0.18, 0.18, 0.18, 0, 0, 3, 1)],
    chart: () => [m(B, -0.55, 0.52, 0, 0.32, 0.76, 0.32, 0, 0, 1), m(B, 0, 0.72, 0, 0.32, 1.16, 0.32, 0, 0, 1), m(B, 0.55, 0.98, 0, 0.32, 1.68, 0.32, 0, 0, 1), m(B, 0.55, 1.84, 0, 0.34, 0.06, 0.34, 0, 0, 3, 1)],
    code: () => [m(B, 0, 0.95, 0, 1.55, 1.1, 0.1, 0, 0, 2), m(B, -0.2, 1.28, 0.06, 0.8, 0.07, 0.02, 0, 0, 3, 1), m(B, 0.05, 0.98, 0.06, 1.0, 0.07, 0.02, 0, 0, 3, 0.7), m(B, -0.15, 0.68, 0.06, 0.6, 0.07, 0.02, 0, 0, 3, 0.7)],
    router: () => [m(B, 0, 0.3, 0, 1.6, 0.3, 1.0, 0, 0, 2), m(C, -0.55, 0.85, -0.2, 0.05, 0.8, 0.05, 0, 0, 0), m(C, 0.55, 0.85, -0.2, 0.05, 0.8, 0.05, 0, 0, 0), m(B, -0.5, 0.31, 0.5, 0.14, 0.07, 0.02, 0, 0, 3, 1), m(B, -0.2, 0.31, 0.5, 0.14, 0.07, 0.02, 0, 0, 3, 1), m(B, 0.1, 0.31, 0.5, 0.14, 0.07, 0.02, 0, 0, 3, 1)],
    firewall: () => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => m(B, -0.58 + c * 0.58 + (r % 2 ? 0.29 : 0), 0.3 + r * 0.38, 0, 0.54, 0.34, 0.5, 0, 0, 1))).concat([m(S, 0, 1.55, 0, 0.3, 0.38, 0.3, 0, 0, 3, 1)]),
    ai: () => [m(S, 0, 1.05, 0, 0.5, 0.5, 0.5, 0, 0, 3, 1), m(T, 0, 1.05, 0, 0.95, 0.95, 0.95, 0, 0.4, 4, 0.5), m(T, 0, 1.05, 0, 0.95, 0.95, 0.95, 1.1, 1.2, 4, 0.5), m(T, 0, 1.05, 0, 0.95, 0.95, 0.95, 2.2, 2.0, 4, 0.5), ...around(5, 0.95, (i, a, x, z) => m(S, x, 1.05 + Math.sin(i * 1.7) * 0.4, z, 0.1, 0.1, 0.1, 0, 0, 3, 1))],
    package: () => [m(B, 0, 0.62, 0, 1.1, 0.95, 1.1, 0, 0, 0), m(B, 0, 0.62, 0, 0.2, 0.97, 1.12, 0, 0, 1), m(B, 0, 0.62, 0, 1.12, 0.97, 0.2, 0, 0, 1)],
    goal: () => [m(C, 0, 0.2, 0, 1.15, 0.12, 1.15, 0, 0, 0), m(C, 0, 0.28, 0, 0.82, 0.12, 0.82, 0, 0, 1), m(C, 0, 0.36, 0, 0.5, 0.12, 0.5, 0, 0, 4), m(C, 0, 0.44, 0, 0.22, 0.12, 0.22, 0, 0, 3, 1), m(C, 0, 1.0, 0, 0.04, 1.2, 0.04, 0, 0, 0), m(B, 0.28, 1.4, 0, 0.55, 0.32, 0.03, 0, 0, 3, 0.9)],
    threat: () => [m(S, 0, 0.95, 0, 0.55, 0.55, 0.55, 0, 0, 1), m(S, 0, 0.95, 0.4, 0.14, 0.14, 0.14, 0, 0, 4), ...around(8, 0.62, (i, a, x, z) => m(K, x, 0.95, z, 0.14, 0.42, 0.14, a, PI / 2, 1))],
    clock: () => [m(C, 0, 0.98, 0, 0.92, 0.14, 0.92, 0, PI / 2, 4), m(B, 0, 1.15, 0.1, 0.05, 0.4, 0.04, 0, 0, 3, 1), m(B, 0.14, 0.95, 0.1, 0.34, 0.05, 0.04, 0, 0, 3, 1), m(C, 0, 0.35, 0, 0.3, 0.5, 0.3, 0, 0, 2)],
  };
  REC.admin = () => [...REC.user(), m(TK, 0.75, 1.0, 0.2, 0.28, 0.28, 0.28, 0, 0, 1, 0.4)];
  const PEDESTAL = () => [m(C, 0, 0.07, 0, 1.5, 0.14, 1.5, 0, 0, 2), m(T, 0, 0.15, 0, 1.5, 1.5, 1.5, 0, 0, 3, 0.9)];

  const PRE = `
uniform mat4 uV,uP;
vec3 toView(vec3 p){return (uV*vec4(p,1.0)).xyz;}
vec4 viewToClip(vec3 v){return uP*vec4(v,1.0);}
`;
  const SOLID_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;
layout(location=2) in vec4 aT0;layout(location=3) in vec4 aT1;layout(location=4) in vec4 aT2;layout(location=5) in vec4 aT3;
uniform float uMir;
out vec3 vN;out vec3 vV;out vec4 vC;out vec4 vF;out float vH;
mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}
mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}
void main(){
  mat3 R=rY(aT0.w)*rX(aT1.w);vec3 wp=aT0.xyz+R*(aP*aT1.xyz);vec3 n=normalize(R*(aN/aT1.xyz));vH=wp.y;
  if(uMir>0.5){wp.y=-wp.y;n.y=-n.y;}
  vec3 v=toView(wp);vV=v;vN=mat3(uV)*n;vC=aT2;vF=aT3;gl_Position=viewToClip(v);
}`;
  const SOLID_FS = `#version 300 es
precision highp float;
in vec3 vN;in vec3 vV;in vec4 vC;in vec4 vF;in float vH;
uniform vec3 uLv,uUp;uniform float uT,uMir;
out vec4 o;
void main(){
  vec3 N=normalize(vN);vec3 V=normalize(-vV);vec3 L=normalize(uLv);
  float ndl=max(dot(N,L),0.0);vec3 base=vC.rgb;
  vec3 hemi=mix(vec3(0.07,0.09,0.17),vec3(0.46,0.56,0.82),dot(N,uUp)*0.5+0.5);
  vec3 c=base*(hemi*0.95+ndl*vec3(1.0,0.96,0.9)*0.85);
  float fres=pow(1.0-max(dot(N,V),0.0),3.0);
  c+=vec3(pow(max(dot(N,normalize(L+V)),0.0),70.0)*0.7)+fres*0.32*mix(base,vec3(1.0),0.4);
  c+=base*vC.a*(0.85+0.3*vF.y+0.15*sin(uT*3.0+vV.x*0.7));
  c+=fres*base*vF.y*0.9+base*vF.z*0.18;
  c=mix(c*0.3+vec3(0.012,0.018,0.04),c,vF.x);
  c=c/(1.0+0.28*c);
  float a=1.0;if(uMir>0.5)a=0.42*exp(-max(vH,0.0)/2.4);
  o=vec4(c*a,a);
}`;
  const FLOOR_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec2 aQ;
out vec3 vW;
void main(){vec3 p=vec3(aQ.x*70.0,0.0,aQ.y*70.0);vW=p;gl_Position=viewToClip(toView(p));}`;
  const FLOOR_FS = `#version 300 es
precision highp float;
in vec3 vW;out vec4 o;
void main(){
  vec2 q=vW.xz;float r=length(q);
  vec2 g1=q;vec2 d1=abs(fract(g1-0.5)-0.5)/max(fwidth(g1),vec2(0.0001));float l1=1.0-min(min(d1.x,d1.y),1.0);
  vec2 g2=q/4.4;vec2 d2=abs(fract(g2-0.5)-0.5)/max(fwidth(g2),vec2(0.0001));float l2=1.0-min(min(d2.x,d2.y),1.0);
  float edge=smoothstep(34.0,6.0,r);
  vec3 col=mix(vec3(0.02,0.035,0.085),vec3(0.05,0.09,0.2),exp(-r*r/260.0))+vec3(0.2,0.45,0.8)*(l1*0.05+l2*0.22)*edge;
  float a=0.66*edge;o=vec4(col*a,a);
}`;
  const DECAL_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec2 aQ;layout(location=1) in vec4 aD0;layout(location=2) in vec4 aD1;layout(location=3) in vec4 aD2;
out vec2 vQ;out vec4 vC;out vec4 vD;out vec2 vS;
void main(){vec3 p=vec3(aD0.x+aQ.x*aD0.z,0.035,aD0.y+aQ.y*aD0.w);vQ=aQ;vC=aD1;vD=aD2;vS=aD0.zw;gl_Position=viewToClip(toView(p));}`;
  const DECAL_FS = `#version 300 es
precision highp float;
in vec2 vQ;in vec4 vC;in vec4 vD;in vec2 vS;out vec4 o;
float sdr(vec2 p,vec2 b,float r){vec2 d=abs(p)-b+r;return length(max(d,0.0))+min(max(d.x,d.y),0.0)-r;}
void main(){
  if(vD.x<0.5){float r=length(vQ);if(r>1.0)discard;float a=pow(1.0-r,1.5)*vC.a;o=vec4(0.0,0.0,0.0,a);}
  else if(vD.x<1.5){float r=length(vQ);if(r>1.0)discard;float a=pow(1.0-r,2.0)*vC.a;o=vec4(vC.rgb*a,0.0);}
  else{vec2 p=vQ*vS;float d=sdr(p,vS-0.02,0.7);float fill=smoothstep(0.0,-0.5,d)*0.09;float line=smoothstep(0.09,0.0,abs(d+0.06))*0.9;float dash=0.55+0.45*step(0.5,fract((p.x+p.y)*0.9+vD.y));float a=(fill+line*dash)*vC.a;o=vec4(vC.rgb*a,0.0);}
}`;
  const BG_VS = '#version 300 es\nout vec2 vUv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUv=p;gl_Position=vec4(p*2.0-1.0,0.9999,1.0);}';
  const BG_FS = `#version 300 es
precision highp float;
in vec2 vUv;uniform vec2 uVP;uniform vec2 uPar;out vec4 o;
void main(){
  vec2 uv=vUv;vec2 c=(uv-vec2(0.5,0.55))*vec2(uVP.x/uVP.y,1.0);float r=length(c);
  vec3 col=mix(vec3(0.11,0.19,0.46),vec3(0.035,0.06,0.16),smoothstep(0.0,0.8,r));col=mix(col,vec3(0.02,0.032,0.09),smoothstep(0.55,1.2,r));
  col+=vec3(0.25,0.4,0.9)*0.1*exp(-dot(c-uPar*0.05,c-uPar*0.05)*3.0);
  o=vec4(col,1.0);
}`;

  const mat = {
    persp(f, a, n, fa) { const t = 1 / Math.tan(f / 2), r = new Float32Array(16); r[0] = t / a; r[5] = t; r[10] = (fa + n) / (n - fa); r[11] = -1; r[14] = (2 * fa * n) / (n - fa); return r; },
    look(e, t) {
      let zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2]; const zl = Math.hypot(zx, zy, zz) || 1; zx /= zl; zy /= zl; zz /= zl;
      let xx = zz, xy = 0, xz = -zx; const xl = Math.hypot(xx, xz) || 1; xx /= xl; xz /= xl; // up = +y: x = up x z
      const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      const r = new Float32Array(16); r[0] = xx; r[1] = yx; r[2] = zx; r[4] = xy; r[5] = yy; r[6] = zy; r[8] = xz; r[9] = yz; r[10] = zz;
      r[12] = -(xx * e[0] + xy * e[1] + xz * e[2]); r[13] = -(yx * e[0] + yy * e[1] + yz * e[2]); r[14] = -(zx * e[0] + zy * e[1] + zz * e[2]); r[15] = 1; return r;
    },
    mulv(M, p) { return [M[0] * p[0] + M[4] * p[1] + M[8] * p[2] + M[12], M[1] * p[0] + M[5] * p[1] + M[9] * p[2] + M[13], M[2] * p[0] + M[6] * p[1] + M[10] * p[2] + M[14], M[3] * p[0] + M[7] * p[1] + M[11] * p[2] + M[15]]; },
  };

  // exact camera fit: smallest distance at which every point stays inside the frustum for the given camera angles
  const fitPts = (pts, t, yaw, pitch, aspect, margin) => {
    const cp = Math.cos(pitch), z = [Math.sin(yaw) * cp, Math.sin(pitch), Math.cos(yaw) * cp]; let x = [z[2], 0, -z[0]]; const xl = Math.hypot(x[0], x[2]) || 1; x = [x[0] / xl, 0, x[2] / xl];
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]], ht = Math.tan(FOV / 2) / margin, wt = ht * aspect; let d = 6;
    for (const p of pts) { const dx = p[0] - t[0], dy = p[1] - t[1], dz = p[2] - t[2], rx = x[0] * dx + x[1] * dy + x[2] * dz, ry = y[0] * dx + y[1] * dy + y[2] * dz, rz = z[0] * dx + z[1] * dy + z[2] * dz; d = Math.max(d, rz + Math.abs(rx) / wt, rz + Math.abs(ry) / ht); }
    return d;
  };
  const boxPts = (list, hx, hz, h) => list.flatMap((n) => [[n.x - hx, 0, n.z - hz], [n.x + hx, 0, n.z - hz], [n.x - hx, 0, n.z + hz], [n.x + hx, 0, n.z + hz], [n.x - hx, h, n.z - hz], [n.x + hx, h, n.z - hz], [n.x - hx, h, n.z + hz], [n.x + hx, h, n.z + hz]]);
  let host = null;
  IX.flowHost = () => {
    if (host) return host;
    const root = document.createElement('div'); root.className = 'f3gl';
    const gc = document.createElement('canvas'), hc = document.createElement('canvas'); gc.className = 'f3c'; hc.className = 'f3h'; gc.setAttribute('aria-hidden', 'true'); root.append(gc, hc);
    const hx = hc.getContext('2d'); if (!hx) throw new Error('2d');
    const G = IX.GL(gc), gl = G.gl;
    const SC = { per: Array.from({ length: 8 }, () => []), fper: Array.from({ length: 8 }, () => new Float32Array(200 * 16)), dd: [], fdd: new Float32Array(80 * 12), rb: [], frb: new Float32Array(420 * 16), sp: [], fsp: new Float32Array(160 * 12) }, errEvery = IX.forcedQ >= 0 ? 90 : 900;
    let q = 2, W = 2, H = 2, cw = 2, ch = 2, dead = false, lost = false, cur = null, raf = 0, last = 0, T = 0, frames = 0, dc = 0, err = 0, R = null;
    const gov = IX.Gov((nq) => { q = nq; size(); });
    q = gov.q;
    const mk = () => {
      G.reset(); const r = {}; r.post = IX.Post(G);
      r.solid = G.program(SOLID_VS, SOLID_FS); r.floor = G.program(FLOOR_VS, FLOOR_FS); r.decal = G.program(DECAL_VS, DECAL_FS);
      r.spr = G.program(IX.shaders.SPR_VS(PRE), IX.shaders.SPR_FS); r.rib = G.program(IX.shaders.RIB_VS(PRE), IX.shaders.RIB_FS); r.bg = G.program(BG_VS, BG_FS);
      const quad = IX.quad(G), strip = IX.strip(G);
      const geos = [IX.geo.box(), IX.geo.frustum(28, 1, 1), IX.geo.sphere(24, 16), IX.geo.torus(1, 0.075, 40, 8), IX.geo.frustum(24, 0, 1), IX.geo.frustum(6, 1, 1), IX.geo.frustum(6, 1, 0.45), IX.geo.torus(1, 0.2, 28, 10)];
      r.prims = geos.map((g) => { const idx = G.buf(g.i, gl.STATIC_DRAW, gl.ELEMENT_ARRAY_BUFFER), v = G.buf(g.v), inst = G.buf(new Float32Array(200 * 16), gl.DYNAMIC_DRAW); const vao = G.vao([[v, 0, 3, 6, 0, 0], [v, 1, 3, 6, 3, 0], [inst, 2, 4, 16, 0, 1], [inst, 3, 4, 16, 4, 1], [inst, 4, 4, 16, 8, 1], [inst, 5, 4, 16, 12, 1]], idx); return { n: g.i.length, inst, vao }; });
      r.fVao = G.vao([[quad, 0, 2, 2, 0, 0]]);
      r.dInst = G.buf(new Float32Array(80 * 12), gl.DYNAMIC_DRAW); r.dVao = G.vao([[quad, 0, 2, 2, 0, 0], [r.dInst, 1, 4, 12, 0, 1], [r.dInst, 2, 4, 12, 4, 1], [r.dInst, 3, 4, 12, 8, 1]]);
      r.rInst = G.buf(new Float32Array(420 * 16), gl.DYNAMIC_DRAW); r.rVao = G.vao([[strip, 0, 2, 2, 0, 0], [r.rInst, 1, 4, 16, 0, 1], [r.rInst, 2, 4, 16, 4, 1], [r.rInst, 3, 4, 16, 8, 1], [r.rInst, 4, 4, 16, 12, 1]]);
      r.sInst = G.buf(new Float32Array(160 * 12), gl.DYNAMIC_DRAW); r.sVao = G.vao([[quad, 0, 2, 2, 0, 0], [r.sInst, 1, 4, 12, 0, 1], [r.sInst, 2, 4, 12, 4, 1], [r.sInst, 3, 4, 12, 8, 1]]);
      R = r;
    };
    const size = () => { if (!R) return; const s = QF[q], dpr = Math.min(window.devicePixelRatio || 1, s.dpr); cw = Math.max(2, Math.round(W * dpr)); ch = Math.max(2, Math.round(H * dpr)); if (gc.width !== cw || gc.height !== ch) { gc.width = cw; gc.height = ch; } const d2 = Math.min(2, window.devicePixelRatio || 1); hc.width = Math.round(W * d2); hc.height = Math.round(H * d2); hx.setTransform(d2, 0, 0, d2, 0, 0); R.post.size(cw, ch, { samples: s.ms, bloom: s.bloom }); };

    /* ---------- building a controller from data ---------- */
    const build = (data) => {
      const ns = data.n.map(([id, kind, label, c, r, tone]) => ({ id, kind: REC[kind] ? kind : 'gear', label, c, r, tone: TONES[tone] ? tone : (KTONE[kind] || 'mute') }));
      const cs = ns.map((n) => n.c), rs = ns.map((n) => n.r), cx = (Math.min(...cs) + Math.max(...cs)) / 2, cz = (Math.min(...rs) + Math.max(...rs)) / 2;
      ns.forEach((n) => { n.x = (n.c - cx) * U; n.z = (n.r - cz) * U; n.col = TONES[n.tone]; n.prims = [...PEDESTAL(), ...REC[n.kind]()].map((p) => p.map((v, k) => (k >= 1 && k <= 6 ? v * NS : v))); });
      const byId = Object.fromEntries(ns.map((n, i) => [n.id, i]));
      const links = (data.l || []).map(([a, b, tone]) => {
        const A = ns[byId[a]], Bn = ns[byId[b]]; const dx = Bn.x - A.x, dz = Bn.z - A.z, L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L, off = 1.9, path = [];
        const x0 = A.x + ux * off, z0 = A.z + uz * off, x1 = Bn.x - ux * off, z1 = Bn.z - uz * off, N = 14;
        for (let i = 0; i <= N; i++) { const t = i / N; path.push([x0 + (x1 - x0) * t, 0.3 + 0.5 * Math.sin(PI * t), z0 + (z1 - z0) * t]); }
        let len = 0; const cum = [0]; for (let i = 1; i <= N; i++) { len += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]); cum.push(len); }
        return { key: a + '>' + b, a: byId[a], b: byId[b], path, cum, len, col: TONES[tone] || TONES[Bn.tone === 'mute' ? 'info' : Bn.tone] };
      });
      const lk = Object.fromEntries(links.map((l, i) => [l.key, i]));
      const steps = (data.s || []).map(([t, d, nn, ll]) => ({ t, d, n: nn.map((id) => byId[id]).filter((v) => v !== undefined), l: (ll || []).map((k) => lk[k]).filter((v) => v !== undefined) }));
      const zones = (data.z || []).map(([label, c0, r0, c1, r1, tone]) => ({ label, x: ((c0 + c1) / 2 - cx) * U, z: ((r0 + r1) / 2 - cz) * U, hx: ((c1 - c0) / 2) * U + 2.7, hz: ((r1 - r0) / 2) * U + 2.7, col: TONES[tone] || TONES.mute }));
      let ex = 0, ez = 0; ns.forEach((n) => { ex = Math.max(ex, Math.abs(n.x)); ez = Math.max(ez, Math.abs(n.z)); });
      zones.forEach((z) => { ex = Math.max(ex, Math.abs(z.x) + z.hx); ez = Math.max(ez, Math.abs(z.z) + z.hz); });
      const list = []; ns.forEach((n, i) => n.prims.forEach((p) => list.push({ p, i })));
      return { ns, links, steps, zones, ex: ex + 2, ez: ez + 2, list, dim: ns.map(() => 1), foc: ns.map(() => 0), hov: ns.map(() => 0), act: links.map(() => 0.6) };
    };

    // narrow (portrait) stages read the flow top to bottom so the long axis uses the height
    const orient = (c) => { c.portrait = W / H < 0.95; c.dy = c.portrait ? 1.12 : -0.55; c.dp = c.portrait ? 1.0 : 0.78; };
    /* ---------- controller ---------- */
    const attach = (el, data, opt) => {
      opt = opt || {};
      const sc = build(data);
      const ctl = { sc, step: -1, playing: false, visible: true, yaw: -0.55, pitch: 0.78, dy: -0.55, dp: 0.78, portrait: false, vyaw: 0, vpitch: 0, cam: null, hover: -1, selNode: -1, tAdv: 0, drag: null, onStep: null, el, title: data.t || '' };
      let user = false;
      const zonePts = sc.zones.flatMap((z) => [[z.x - z.hx, 0, z.z - z.hz], [z.x + z.hx, 0, z.z - z.hz], [z.x - z.hx, 0, z.z + z.hz], [z.x + z.hx, 0, z.z + z.hz]]);
      const target = () => {
        const full = fitPts([...boxPts(sc.ns, 2.4, 2.4, 3.4), ...zonePts], [0, 0.6, 0], ctl.dy, ctl.dp, W / H, 1.08), s = sc.steps[ctl.step];
        if (!s || !s.n.length) return { t: [0, 0.6, 0], d: full };
        const an = s.n.map((i) => sc.ns[i]); let sx = 0, sz = 0; an.forEach((n) => { sx += n.x; sz += n.z; }); sx /= an.length; sz /= an.length;
        const d = fitPts(boxPts(an, 2.7, 2.7, 3.4), [sx, 0.9, sz], ctl.dy, ctl.dp, W / H, 1.05);
        return { t: [sx, 0.9, sz], d: Math.min(full, Math.max(d, full * 0.5, 9)) };
      };
      ctl.cam = { t: [0, 0.6, 0], d: 20 };
      const setStep = (i, byUser) => { const n = sc.steps.length; ctl.step = Math.max(-1, Math.min(n - 1, i)); ctl.tAdv = 0; if (byUser) { ctl.playing = false; user = true; } if (ctl.onStep) ctl.onStep(ctl.step, ctl.playing); wake(); };
      ctl.goto = (i, byUser) => setStep(i, byUser !== false);
      ctl.next = (byUser) => { const n = sc.steps.length; setStep(ctl.step + 1 >= n ? -1 : ctl.step + 1, byUser !== false); };
      ctl.prev = (byUser) => { const n = sc.steps.length; setStep(ctl.step <= -1 ? n - 1 : ctl.step - 1, byUser !== false); };
      ctl.play = (b) => { ctl.playing = !!b && !calm; ctl.tAdv = 0; if (ctl.onStep) ctl.onStep(ctl.step, ctl.playing); wake(); };
      ctl.resetView = () => { ctl.yaw = ctl.dy; ctl.pitch = ctl.dp; ctl.vyaw = ctl.vpitch = 0; wake(); };
      ctl.setVisible = (b) => { ctl.visible = b; if (b) wake(); };
      ctl.focusNode = (i) => { const k = sc.steps.findIndex((s) => s.n.includes(i)); if (k >= 0) setStep(k, true); };
      ctl.destroy = () => { if (cur === ctl) { cur = null; if (root.parentNode) root.remove(); } };
      ctl.target = target; ctl.user = () => user;
      cur = ctl; el.append(root); W = Math.max(2, el.clientWidth); H = Math.max(2, el.clientHeight); size();
      orient(ctl); ctl.yaw = ctl.dy; ctl.pitch = ctl.dp;
      { const tg = target(); ctl.cam = { t: tg.t.slice(), d: tg.d }; }
      wake(); return ctl;
    };

    /* ---------- frame ---------- */
    const wake = () => { if (cur) cur.until = performance.now() + 1600; if (!raf && cur && cur.visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const eye = (c) => { const cp = Math.cos(c.pitch), d = c.cam.d; return [c.cam.t[0] + d * Math.sin(c.yaw) * cp, c.cam.t[1] + d * Math.sin(c.pitch), c.cam.t[2] + d * Math.cos(c.yaw) * cp]; };
    let V = null, P = null;
    const project = (p) => { const v = mat.mulv(V, p), c = mat.mulv(P, [v[0], v[1], v[2]]); const w = c[3] || 1; return { x: (c[0] / w * 0.5 + 0.5) * W, y: (0.5 - c[1] / w * 0.5) * H, z: v[2], w }; };
    const setViewport = (c) => { const e = eye(c); V = mat.look(e, c.cam.t); P = mat.persp(FOV, W / H, 0.5, 400); };
    const frame = (ts) => {
      raf = 0; const c = cur; if (!c || !c.visible || dead || lost || document.hidden || !R) return;
      const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); gov.tick(ts - last); last = ts; T += dt; const sc = c.sc;
      // resize check (container may have changed)
      const el = c.el; if (el.clientWidth && (Math.abs(el.clientWidth - W) > 1 || Math.abs(el.clientHeight - H) > 1)) { W = Math.max(2, el.clientWidth); H = Math.max(2, el.clientHeight); size(); const pt = W / H < 0.95; if (pt !== c.portrait) { orient(c); c.yaw = c.dy; c.pitch = c.dp; c.vyaw = c.vpitch = 0; } }
      // autoplay and camera easing
      if (c.playing && !calm) { c.tAdv += dt; if (c.tAdv > 3.9) { c.tAdv = 0; const n = sc.steps.length; c.step = c.step + 1 >= n ? -1 : c.step + 1; if (c.onStep) c.onStep(c.step, c.playing); } }
      const tg = c.target(), k = 1 - Math.exp(-dt * (calm ? 30 : 4.2));
      for (let i = 0; i < 3; i++) c.cam.t[i] += (tg.t[i] - c.cam.t[i]) * k; c.cam.d += (tg.d - c.cam.d) * k;
      if (!c.drag) { c.yaw += c.vyaw; c.pitch = Math.max(0.35, Math.min(1.2, c.pitch + c.vpitch)); c.vyaw *= 0.93; c.vpitch *= 0.93; if (!calm && !c.user() && Math.abs(c.vyaw) < 0.0006) c.yaw += Math.sin(T * 0.25) * 0.0009; }
      c.yaw = Math.max(-1.25, Math.min(1.25, c.yaw));
      const st = sc.steps[c.step], act = new Set(st ? st.n : sc.ns.map((_, i) => i)), actL = new Set(st ? st.l : sc.links.map((_, i) => i));
      const k2 = 1 - Math.exp(-dt * 7);
      sc.ns.forEach((n, i) => { sc.dim[i] += ((act.has(i) ? 1 : 0.2) - sc.dim[i]) * k2; sc.foc[i] += (((st && st.n[0] === i) ? 1 : (st && act.has(i) ? 0.35 : 0)) - sc.foc[i]) * k2; sc.hov[i] += ((c.hover === i ? 1 : 0) - sc.hov[i]) * k2; });
      sc.links.forEach((l, i) => { sc.act[i] += ((actL.has(i) ? 1 : (st ? 0.1 : 0.5)) - sc.act[i]) * k2; });
      setViewport(c); draw(c);
      overlay(c);
      frames++; if (frames % errEvery === 0 && gl.getError() !== gl.NO_ERROR) err++;
      if ((!calm || performance.now() < (c.until || 0)) && !raf) raf = requestAnimationFrame(frame);
    };
    const draw = (c) => {
      const sc = c.sc, s = QF[q], e = eye(c); dc = 0;
      // light and up vector in view space
      const Lw = [-0.45, 0.85, 0.55], vl = [V[0] * Lw[0] + V[4] * Lw[1] + V[8] * Lw[2], V[1] * Lw[0] + V[5] * Lw[1] + V[9] * Lw[2], V[2] * Lw[0] + V[6] * Lw[1] + V[10] * Lw[2]], up = [V[4], V[5], V[6]];
      R.post.bind(); gl.clearColor(0.03, 0.05, 0.12, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE); gl.bindVertexArray(null);
      G.use(R.bg); G.set(R.bg, 'uVP', [W, H]); G.set(R.bg, 'uPar', [c.yaw, c.pitch]); gl.drawArrays(gl.TRIANGLES, 0, 3); dc++;
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
      // instance data for solids
      const per = SC.per; per.forEach((a) => { a.length = 0; });
      sc.list.forEach(({ p, i }) => { const n = sc.ns[i], t = p[9], col = t === 0 ? [0.8, 0.86, 0.96] : t === 1 ? n.col : t === 2 ? [0.17, 0.21, 0.32] : t === 3 ? [Math.min(1, n.col[0] * 1.15), Math.min(1, n.col[1] * 1.15), Math.min(1, n.col[2] * 1.15)] : [0.96, 0.98, 1];
        per[p[0]].push(n.x + p[1], p[2], n.z + p[3], p[7], p[4], p[5], p[6], p[8], col[0], col[1], col[2], p[10], sc.dim[i], sc.foc[i], sc.hov[i], 0); });
      per.forEach((arr, k) => { if (arr.length) { const t = SC.fper[k]; t.set(arr.length > t.length ? arr.slice(0, t.length) : arr); G.sub(R.prims[k].inst, t.subarray(0, Math.min(arr.length, t.length))); } });
      const drawSolids = (mir) => { G.use(R.solid); G.set(R.solid, 'uV', V); G.set(R.solid, 'uP', P); G.set(R.solid, 'uLv', vl); G.set(R.solid, 'uUp', up); G.set(R.solid, 'uT', T); G.set(R.solid, 'uMir', mir); gl.frontFace(mir ? gl.CW : gl.CCW); per.forEach((arr, k) => { if (!arr.length) return; gl.bindVertexArray(R.prims[k].vao); gl.drawElementsInstanced(gl.TRIANGLES, R.prims[k].n, gl.UNSIGNED_SHORT, 0, Math.min(arr.length, SC.fper[k].length) / 16); dc++; }); };
      gl.enable(gl.CULL_FACE); gl.depthMask(true);
      if (s.mirror) drawSolids(1);
      gl.disable(gl.CULL_FACE); G.use(R.floor); G.set(R.floor, 'uV', V); G.set(R.floor, 'uP', P); gl.bindVertexArray(R.fVao); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); dc++;
      // decals: zones, shadows, pools
      const dd = SC.dd; dd.length = 0; sc.zones.forEach((z, zi) => dd.push(z.x, z.z, z.hx, z.hz, z.col[0], z.col[1], z.col[2], 0.8, 2, -T * 0.25 + zi, 0, 0));
      sc.ns.forEach((n, i) => { dd.push(n.x, n.z, 2.3, 2.3, 0, 0, 0, 0.55, 0, 0, 0, 0); dd.push(n.x, n.z, 3.7, 3.7, n.col[0], n.col[1], n.col[2], 0.1 + 0.55 * sc.foc[i] * 0 + 0.4 * Math.max(0, sc.dim[i] - 0.2) * (0.5 + sc.foc[i]) + 0.25 * sc.hov[i], 1, 0, 0, 0); });
      SC.fdd.set(dd.length > SC.fdd.length ? dd.slice(0, SC.fdd.length) : dd); G.sub(R.dInst, SC.fdd.subarray(0, Math.min(dd.length, SC.fdd.length))); gl.depthMask(false); G.use(R.decal); G.set(R.decal, 'uV', V); G.set(R.decal, 'uP', P); gl.bindVertexArray(R.dVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, Math.min(dd.length, SC.fdd.length) / 12); dc++;
      gl.enable(gl.CULL_FACE); gl.depthMask(true); drawSolids(0); gl.disable(gl.CULL_FACE); gl.frontFace(gl.CCW); gl.depthMask(false);
      // links as ribbons
      const rb = SC.rb; rb.length = 0; sc.links.forEach((l, i) => { const a = sc.act[i], w = 4 + 6 * a; for (let j = 0; j < l.path.length - 1; j++) { const p0 = l.path[j], p1 = l.path[j + 1]; rb.push(p0[0], p0[1], p0[2], w, p1[0], p1[1], p1[2], l.cum[j], l.col[0] * 0.5 + 0.5, l.col[1] * 0.5 + 0.5, l.col[2] * 0.5 + 0.5, 0.12 + 0.88 * a, 2, l.cum[j + 1] - l.cum[j], 0, 0); } });
      SC.frb.set(rb.length > SC.frb.length ? rb.slice(0, SC.frb.length) : rb); G.sub(R.rInst, SC.frb.subarray(0, Math.min(rb.length, SC.frb.length))); G.use(R.rib); G.set(R.rib, 'uV', V); G.set(R.rib, 'uP', P); G.set(R.rib, 'uVP', [W, H]); G.set(R.rib, 'uT', T); G.set(R.rib, 'uLS', 4.5); gl.bindVertexArray(R.rVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, Math.min(rb.length, SC.frb.length) / 16); dc++;
      // packets and glows
      const sp = SC.sp; sp.length = 0; sc.links.forEach((l, i) => { const a = sc.act[i]; if (a < 0.2) return; for (let k = 0; k < 3; k++) { const u = (T * 0.32 + k / 3 + i * 0.13) % 1, f = u * (l.path.length - 1), j = Math.min(l.path.length - 2, Math.floor(f)), t = f - j, p0 = l.path[j], p1 = l.path[j + 1], px = p0[0] + (p1[0] - p0[0]) * t, py = p0[1] + (p1[1] - p0[1]) * t, pz = p0[2] + (p1[2] - p0[2]) * t, al = Math.sin(u * PI) * a; sp.push(px, py + 0.05, pz, 0.34, 1, 1, 1, 0.95 * al, 3, 0, 0, 0, px, py + 0.05, pz, 0.8, l.col[0], l.col[1], l.col[2], 0.55 * al, 0, 0, 0, 0); } });
      sc.ns.forEach((n, i) => { const g = 0.12 + 0.5 * sc.foc[i] + 0.2 * sc.hov[i]; if (sc.dim[i] > 0.5) sp.push(n.x, 1.1, n.z, 2.7 + 0.6 * sc.foc[i], n.col[0], n.col[1], n.col[2], g * sc.dim[i] * 0.6, 0, 0, 0, 0); });
      SC.fsp.set(sp.length > SC.fsp.length ? sp.slice(0, SC.fsp.length) : sp); G.sub(R.sInst, SC.fsp.subarray(0, Math.min(sp.length, SC.fsp.length))); G.use(R.spr); G.set(R.spr, 'uV', V); G.set(R.spr, 'uP', P); G.set(R.spr, 'uT', T); G.set(R.spr, 'uBurst', [0, 0, 0, -1]); gl.bindVertexArray(R.sVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, Math.min(sp.length, SC.fsp.length) / 12); dc++;
      gl.depthMask(true); gl.bindVertexArray(null);
      R.post.finish({ cw, ch, bloom: 0.55, vig: 0.45, ab: s.bloom ? 0.002 : 0, time: T * 60 % 997, thr: 0.66 });
    };
    const rr = (x, y, w, h, r) => { hx.beginPath(); hx.moveTo(x + r, y); hx.arcTo(x + w, y, x + w, y + h, r); hx.arcTo(x + w, y + h, x, y + h, r); hx.arcTo(x, y + h, x, y, r); hx.arcTo(x, y, x + w, y, r); hx.closePath(); };
    const rgba = (c, a) => 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + a + ')';
    const overlay = (c) => {
      const sc = c.sc, st = sc.steps[c.step]; hx.clearRect(0, 0, W, H); hx.textBaseline = 'middle'; hx.textAlign = 'center';
      const small = W < 520, taken = [];
      sc.zones.forEach((z) => { const p = project([z.x - z.hx + 0.6, 0, z.z + z.hz - 0.4]); hx.font = '600 ' + (small ? 11 : 12) + 'px system-ui,sans-serif'; hx.textAlign = 'left'; hx.fillStyle = rgba(z.col, 0.95); hx.fillText(z.label, Math.max(8, p.x), Math.min(H - 10, p.y)); });
      const order = sc.ns.map((_, i) => i).sort((a, b) => (sc.foc[b] + sc.hov[b]) - (sc.foc[a] + sc.hov[a]) || project([sc.ns[b].x, 0, sc.ns[b].z]).z - project([sc.ns[a].x, 0, sc.ns[a].z]).z);
      hx.textAlign = 'center';
      const wrap2 = (t) => { if (!small || t.length < 15) return [t]; const mid = Math.floor(t.length / 2); let i = t.indexOf(' ', mid - 3); if (i < 0 || i > t.length - 3) i = t.lastIndexOf(' ', mid + 3); return i > 2 ? [t.slice(0, i), t.slice(i + 1)] : [t]; };
      order.forEach((i) => {
        const n = sc.ns[i], p = project([n.x, c.portrait ? 0.9 : 2.55, n.z]), base = project([n.x, 0.9, n.z]), isF = sc.foc[i] > 0.5, on = sc.dim[i] > 0.5, ls = wrap2(n.label); hx.font = (isF || c.hover === i ? '700 ' : '600 ') + (small ? 11 : 12.5) + 'px system-ui,sans-serif';
        const w = Math.max(...ls.map((t) => hx.measureText(t).width)) + (small ? 12 : 16), h = ls.length > 1 ? 34 : 24, off = 1.95 * ((H / 2) / (Math.tan(FOV / 2) * base.w)) + 8;
        // candidate positions: beside the node (portrait) or above, then below it (landscape); first one that fits and does not collide wins
        const cx2 = (x) => Math.max(w / 2 + 4, Math.min(W - w / 2 - 4, x)), cand = c.portrait ? [[base.x + off + w / 2, base.y], [base.x - off - w / 2, base.y], [cx2(base.x), base.y + off * 0.9 + h / 2], [cx2(base.x), base.y - off * 0.9 - h / 2]] : [[p.x, p.y], [base.x, base.y + off + h / 2 - 6], [cx2(p.x), p.y - h - 4]];
        const hit = (r) => r[0] < 4 || r[0] + r[2] > W - 4 || r[1] < 4 || r[1] + r[3] > H - 4 || taken.some((t) => r[0] < t[0] + t[2] + 2 && r[0] + r[2] > t[0] - 2 && r[1] < t[1] + t[3] && r[1] + r[3] > t[1]);
        let rc = null, lx = 0, ly = 0; for (const [cx, cy] of cand) { const r = [cx - w / 2, cy - h / 2, w, h]; if (!hit(r)) { rc = r; lx = cx; ly = cy; break; } }
        if (!rc) { if (!isF && c.hover !== i) return; lx = cand[0][0]; ly = cand[0][1]; rc = [lx - w / 2, ly - h / 2, w, h]; }
        taken.push(rc); hx.globalAlpha = on ? 1 : 0.45; hx.fillStyle = 'rgba(6,12,36,.86)'; rr(rc[0], rc[1], w, h, 7); hx.fill(); hx.strokeStyle = rgba(n.col, isF ? 1 : 0.45); hx.lineWidth = isF ? 1.6 : 1; hx.stroke(); hx.fillStyle = '#fff';
        ls.forEach((t, k) => hx.fillText(t, lx, ly + 1 + (k - (ls.length - 1) / 2) * 13));
        if (st && st.n.includes(i) && on && st.n.indexOf(i) === 0) { hx.fillStyle = rgba(n.col, 1); hx.beginPath(); hx.arc(rc[0] - 4, ly, 11, 0, TAU); hx.fill(); hx.fillStyle = '#04122e'; hx.font = '800 12px system-ui,sans-serif'; hx.fillText(String(c.step + 1), rc[0] - 4, ly + 1); }
      });
      hx.globalAlpha = 1;
    };

    /* ---------- input ---------- */
    const pick = (mx, my) => { const c = cur; if (!c || !V) return -1; let b = -1, bd = 1e9; c.sc.ns.forEach((n, i) => { const p = project([n.x, 1.0, n.z]), d = Math.hypot(p.x - mx, p.y - my), r = Math.max(30, 190 / Math.max(0.4, p.w) * 0.55); if (d < r && d < bd) { bd = d; b = i; } }); return b; };
    const xy = (e) => { const r = hc.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    hc.addEventListener('pointerdown', (e) => { const c = cur; if (!c) return; c.drag = { x: e.clientX, y: e.clientY, m: 0 }; try { hc.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } wake(); });
    hc.addEventListener('pointermove', (e) => { const c = cur; if (!c) return; if (c.drag) { const dx = e.clientX - c.drag.x, dy = e.clientY - c.drag.y; c.drag.m += Math.abs(dx) + Math.abs(dy); c.drag.x = e.clientX; c.drag.y = e.clientY; c.yaw -= dx * 0.006; c.pitch = Math.max(0.35, Math.min(1.2, c.pitch + dy * 0.004)); c.vyaw = -dx * 0.0007; c.vpitch = dy * 0.0004; wake(); return; } const [mx, my] = xy(e), h = pick(mx, my); if (h !== c.hover) { c.hover = h; hc.style.cursor = h >= 0 ? 'pointer' : 'grab'; wake(); } });
    hc.addEventListener('pointerup', (e) => { const c = cur; if (!c) return; const d = c.drag; c.drag = null; if (d && d.m < 6) { const [mx, my] = xy(e), h = pick(mx, my); if (h >= 0) c.focusNode(h); } wake(); });
    hc.addEventListener('pointerleave', () => { if (cur && !cur.drag) { cur.hover = -1; wake(); } });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
    gc.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; });
    gc.addEventListener('webglcontextrestored', () => { try { mk(); size(); lost = false; wake(); } catch (x) { dead = true; } });
    mk();
    host = { attach, root, info: () => ({ q, fps: gov.fps, dc, err, frames, lost, dead }), canvas: hc, wake };
    return host;
  };
})();
