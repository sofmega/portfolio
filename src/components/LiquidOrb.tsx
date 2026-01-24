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

vec3 modernPalette(float t){
  t = fract(t);

  vec3 c1 = vec3(1.00, 0.63, 0.86);
  vec3 c2 = vec3(0.73, 0.68, 1.00);
  vec3 c3 = vec3(0.50, 0.93, 1.00);
  vec3 c4 = vec3(1.00, 0.92, 0.74);

  vec3 col;
  if (t < 0.33) col = mix(c1, c2, sCurve(t / 0.33));
  else if (t < 0.66) col = mix(c2, c3, sCurve((t - 0.33) / 0.33));
  else col = mix(c3, c4, sCurve((t - 0.66) / 0.34));

  col = mix(col, vec3(1.0), 0.08);
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

  float edgeNoise = fbm(p * 4.0 + t * 0.35);
  float edgeWave  = sin((p.x * 5.0 + p.y * 4.0) + t * 1.6) * 0.04;

  float md = length(p - m);
  float mousePush = u_hover * 0.16 * exp(-6.0 * md);

  float rr = r + edgeNoise * 0.09 + edgeWave + mousePush;

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
    smoothstep(1.00, 0.92, rr) -
    smoothstep(0.985, 0.90, rr);
  rim = clamp(rim, 0.0, 1.0);

  float ang = atan(p.y, p.x);
  float swirl = sin(ang * 3.0 + t * 0.9) * 0.15;

  vec2 q = p;
  q += 0.20 * vec2(
    fbm(p * 2.0 + t * 0.4),
    fbm(p * 2.0 - t * 0.35)
  );
  q += swirl * vec2(-p.y, p.x);

  float d = length(p - m);
  float ripple = sin(18.0 * d - t * 7.0) * exp(-3.5 * d);
  q += u_hover * ripple * 0.38 * normalize(p - m + 0.0001);

  float n = fbm(q * 2.0 + t * 0.10);
  float pt = n +
             0.06 * sin(t * 0.18) +
             0.03 * fbm(q * 1.2 + t * 0.05);

  vec3 col = modernPalette(pt);

  vec2 light = normalize(vec2(-0.7, 0.9));
  float spec = pow(max(0.0, dot(normalize(p), light)), 10.0);
  col += 0.14 * spec;
  col += 0.22 * rim;
  col *= mix(1.0, 0.88, r * r);

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

    // Force canvas to have a real size in layout
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none"; // important for pointer events on mobile/trackpad

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    // Detect derivatives support (AA)
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

    // Fullscreen quad
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

    // Mouse state (smoothed)
    let mouse = { x: 0.5, y: 0.5 };
    let mouseSmooth = { x: 0.5, y: 0.5 };
    let hover = 0;
    let hoverTarget = 0;

    const updateMouseFromEvent = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      // Prevent division by 0 if layout not ready
      if (r.width <= 1 || r.height <= 1) return;

      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;

      // clamp
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

    // Observe size changes of the canvas in layout
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

      // Smooth hover + mouse
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
