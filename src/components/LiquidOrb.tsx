"use client";

import { useEffect, useRef } from "react";

/* =========================
   SHADERS
========================= */

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;

void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;
uniform float u_hover;
uniform float u_hasDerivatives;

varying vec2 v_uv;

/* ---------- Noise ---------- */
float hash(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.55;
  for(int i = 0; i < 5; i++){
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

float sCurve(float x){
  return x * x * (3.0 - 2.0 * x);
}

float luma(vec3 c){
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

/* =========================
   OFFBRAND-ISH PALETTE
   - warm paper base
   - cool graphite shadows
   - tiny aurora hints (ice/lavender/sand)
   - low saturation = modern
========================= */
vec3 offbrandPalette(float t){
  t = fract(t);

  // “paper + ink” neutrals with subtle tint stops
  vec3 paper  = vec3(0.95, 0.93, 0.90); // warm off-white
  vec3 ice    = vec3(0.78, 0.88, 0.93); // soft ice blue
  vec3 lilac  = vec3(0.83, 0.82, 0.93); // muted lavender
  vec3 sand   = vec3(0.93, 0.88, 0.78); // warm sand
  vec3 mist   = vec3(0.90, 0.91, 0.92); // cool mist gray

  vec3 col;
  if (t < 0.25) {
    col = mix(paper, mist, sCurve(t / 0.25));
  } else if (t < 0.50) {
    col = mix(mist, ice, sCurve((t - 0.25) / 0.25));
  } else if (t < 0.75) {
    col = mix(ice, lilac, sCurve((t - 0.50) / 0.25));
  } else {
    col = mix(lilac, sand, sCurve((t - 0.75) / 0.25));
  }

  // reduce saturation = more “editorial”
  float g = luma(col);
  col = mix(vec3(g), col, 0.62);

  // slightly milky
  col = mix(col, vec3(1.0), 0.05);
  return col;
}

void main(){
  vec2 uv = v_uv;
  vec2 p = uv * 2.0 - 1.0;

  float aspect = u_res.x / u_res.y;
  p.x *= aspect;

  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= aspect;

  float t = u_time;
  float r = length(p);

  /* ---- Edge distortion (slightly calmer than before) ---- */
  float edgeNoise = fbm(p * 3.6 + t * 0.26);
  float edgeWave  = sin((p.x * 4.2 + p.y * 3.8) + t * 1.25) * 0.03;

  float md = length(p - m);
  float mousePush = u_hover * 0.14 * exp(-6.2 * md);

  float rr = r + edgeNoise * 0.075 + edgeWave + mousePush;

  /* ---- AA (safe fallback) ---- */
  float aa = 0.01;
  #ifdef GL_OES_standard_derivatives
    aa = max(0.002, fwidth(rr) * 1.6);
  #endif
  aa = mix(0.01, aa, u_hasDerivatives);

  float circle = smoothstep(1.0 + aa, 1.0 - aa, rr);
  if(circle <= 0.0){
    gl_FragColor = vec4(0.0);
    return;
  }

  float rim =
    smoothstep(1.00, 0.93, rr) -
    smoothstep(0.985, 0.91, rr);
  rim = clamp(rim, 0.0, 1.0);

  /* ---- Liquid field (calmer internal flow) ---- */
  float ang = atan(p.y, p.x);
  float swirl = sin(ang * 2.6 + t * 0.65) * 0.12;

  vec2 q = p;
  q += 0.16 * vec2(
    fbm(p * 1.9 + t * 0.25),
    fbm(p * 1.9 - t * 0.22)
  );
  q += swirl * vec2(-p.y, p.x);

  float d = length(p - m);
  float ripple = sin(16.0 * d - t * 6.4) * exp(-3.8 * d);
  q += u_hover * ripple * 0.28 * normalize(p - m + 0.0001);

  // palette driver: slow drift, minimal contrast
  float n = fbm(q * 1.85 + t * 0.07);
  float aur = fbm(q * 2.6 + vec2(0.0, t * 0.045));
  float pt = n * 0.92 + 0.08 * aur + 0.03 * sin(t * 0.12);

  vec3 col = offbrandPalette(pt);

  /* ---- Lighting: “studio” highlight + ink depth ---- */
  vec2 nn = normalize(p + 0.0001);
  vec2 light = normalize(vec2(-0.55, 0.85));

  float ndl = max(0.0, dot(nn, light));
  float spec = pow(ndl, 22.0);

  // glossy highlight (clean)
  col += 0.08 * spec;

  // milky rim
  col += 0.18 * rim;

  // gentle “ink shadow” toward edges
  col *= mix(1.0, 0.90, r * r);

  // subtle core lift (depth)
  float core = exp(-3.0 * r * r);
  col += 0.04 * core;

  // tiny grain to avoid banding
  float g = (hash(gl_FragCoord.xy + t) - 0.5) * 0.012;
  col += g;

  gl_FragColor = vec4(col, circle);
}
`;

/* =========================
   COMPONENT
========================= */

export default function LiquidOrb({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Ensure canvas has layout size
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    const ext = gl.getExtension("OES_standard_derivatives");
    const HAS_DERIV = ext ? 1 : 0;
    const FRAG_SRC = ext
      ? `#extension GL_OES_standard_derivatives : enable\n${FRAG}`
      : FRAG;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uHover = gl.getUniformLocation(prog, "u_hover");
    const uHasDer = gl.getUniformLocation(prog, "u_hasDerivatives");
    gl.uniform1f(uHasDer, HAS_DERIV);

    let mouse = { x: 0.5, y: 0.5 };
    let mouseSmooth = { x: 0.5, y: 0.5 };
    let hover = 0;
    let hoverTarget = 0;

    const updateMouseFromEvent = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) return;

      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;

      mouse.x = Math.max(0, Math.min(1, mouse.x));
      mouse.y = Math.max(0, Math.min(1, mouse.y));
    };

    const onEnter = (e: PointerEvent) => {
      hoverTarget = 1;
      updateMouseFromEvent(e);
    };
    const onLeave = () => {
      hoverTarget = 0;
    };
    const onMove = (e: PointerEvent) => {
      updateMouseFromEvent(e);
    };

    canvas.addEventListener("pointerenter", onEnter);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointermove", onMove);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    const start = performance.now();
    let running = true;

    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running) raf = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVis);

    const render = () => {
      if (!running) return;

      hover += (hoverTarget - hover) * 0.08;
      mouseSmooth.x += (mouse.x - mouseSmooth.x) * 0.12;
      mouseSmooth.y += (mouse.y - mouseSmooth.y) * 0.12;

      resize();

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uMouse, mouseSmooth.x, mouseSmooth.y);
      gl.uniform1f(uHover, hover);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      canvas.removeEventListener("pointerenter", onEnter);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        borderRadius: "9999px",
        boxShadow: "0 30px 120px rgba(0,0,0,0.18)",
      }}
    />
  );
}
