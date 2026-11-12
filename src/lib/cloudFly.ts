/**
 * 구름 속 비행 레이어 (WebGL, 투명 캔버스).
 *
 * 카메라 앞에 깊이가 다른 여러 장의 구름 시트(노이즈)를 놓고, 스크롤 진행도(uZ)에 따라 카메라가 앞으로 나아갑니다.
 * 각 시트는 거리 d에 반비례해 커지고(원근), 카메라를 지나치면 사라지며 뒤에서 새 시트가 이어집니다.
 * → 구름이 좌우로 미끄러지는 것이 아니라 화면 쪽으로 다가와 시야를 스쳐 지나가는 깊이감.
 *
 * 외부에서 매 프레임 값을 넣어 줍니다(GSAP ScrollTrigger 스크럽):
 *  - z: 카메라 전진 거리   - density: 구름 시트의 농도(0~1)
 *  - edge: 화면 가장자리부터 생기는 안개   - white: 화면을 채우는 밝은 안개(통과 구간)
 * 모두 0이면 렌더링하지 않습니다.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime, uZ, uDensity, uEdge, uWhite;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
const mat2 R = mat2(0.8, -0.6, 0.6, 0.8);
float fbm(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = R * p * 2.03; a *= 0.5; } return v; }

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y; // 화면 중심 기준
  p.y = -p.y;
  float trans = 1.0;      // 남은 투과율
  vec3 col = vec3(0.0);
  const float SPAN = 3.0;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    // 시트 i의 카메라로부터 거리 (앞으로 나아갈수록 줄어들고, 지나치면 뒤로 순환)
    float d = mod(fi * 0.5 - uZ, SPAN) + 0.06;
    float s = 1.0 / d;
    vec2 q = p * s * 0.9 + vec2(fi * 7.31, fi * 3.17) + vec2(uTime * 0.01, 0.0);
    float n = fbm(q);
    // 멀리서는 흐릿하게 나타나고, 아주 가까워지면 스쳐 지나가며 사라짐
    float fade = smoothstep(SPAN, SPAN * 0.7, d) * smoothstep(0.06, 0.45, d);
    float a = smoothstep(0.46, 0.70, n) * fade * uDensity;
    // 입체감: 해(오른쪽 위) 방향으로 농도가 줄어드는 면은 밝게, 반대쪽(아래)은 그늘
    float lit = clamp((n - fbm(q + vec2(0.06, -0.09))) * 6.0 + 0.5, 0.0, 1.0);
    vec3 shadow = vec3(0.70, 0.76, 0.86);
    vec3 light = vec3(1.0, 0.975, 0.95);
    vec3 c = mix(shadow, light, lit * 0.75 + smoothstep(0.55, 0.85, n) * 0.25);
    col += c * a * trans;
    trans *= 1.0 - a;
  }
  // 가장자리에서 생기는 안개 (중앙은 마지막까지 비어 있음)
  float r = length(p * vec2(0.85, 1.0));
  float e = smoothstep(0.3, 1.05, r + (fbm(p * 2.2 + uTime * 0.02) - 0.5) * 0.35) * uEdge * 0.8;
  col += vec3(0.93, 0.95, 0.98) * e * trans;
  trans *= 1.0 - e;
  // 통과 구간의 밝은 안개 (빛이 확산된 듯 중앙이 조금 더 밝음)
  float w = uWhite * (0.92 + 0.08 * fbm(p * 1.5 + 3.0 + uTime * 0.015));
  col += mix(vec3(0.95, 0.965, 0.985), vec3(1.0, 0.99, 0.97), 1.0 - smoothstep(0.0, 0.8, r)) * w * trans;
  trans *= 1.0 - w;
  float alpha = 1.0 - trans;
  gl_FragColor = vec4(col, alpha); // premultiplied
}`;

export type CloudFlyState = { z: number; density: number; edge: number; white: number };
export type CloudFly = { render: (s: CloudFlyState) => void; destroy: () => void };

export function createCloudFly(canvas: HTMLCanvasElement, scale: number): CloudFly | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = sh(gl.VERTEX_SHADER, VERT);
  const fs = sh(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  const U = (n: string) => gl.getUniformLocation(prog, n);
  const uRes = U('uRes'), uTime = U('uTime'), uZ = U('uZ'), uDensity = U('uDensity'), uEdge = U('uEdge'), uWhite = U('uWhite');

  // 부드러운 안개라 낮은 해상도로 그려도 차이가 없음 → 성능 확보
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * scale));
    const h = Math.max(1, Math.round(r.height * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  const t0 = performance.now();
  let blank = false;

  return {
    render(s) {
      if (s.density < 0.002 && s.edge < 0.002 && s.white < 0.002) {
        if (!blank) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          blank = true;
        }
        return;
      }
      blank = false;
      gl.uniform1f(uTime, (performance.now() - t0) / 1000);
      gl.uniform1f(uZ, s.z);
      gl.uniform1f(uDensity, s.density);
      gl.uniform1f(uEdge, s.edge);
      gl.uniform1f(uWhite, s.white);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    destroy() {
      ro.disconnect();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
