/**
 * Hero 하늘 레이어 WebGL 렌더러 — 정지 사진 속 구름을 실제로 흐르게 만듭니다.
 *
 * 1) 플로맵(flow map): 같은 사진을 위상이 반 주기 어긋난 두 오프셋으로 샘플링해 교차 페이드합니다.
 *    → 픽셀이 계속 한 방향으로 흐르면서도 '처음 위치로 되돌아가는' 순간이 보이지 않습니다.
 *    속도는 깊이에 비례: 위쪽 하늘·먼 구름은 거의 정지, 아래쪽 구름층일수록 빠르게(가까울수록 빠름).
 *    날개 주변은 마스크로 흐름을 0으로 만들어, 날개 뒤 복원 영역이 끌려 나오지 않게 합니다.
 * 2) 원근 구름층: 수평선 아래 평면에 투영한 노이즈 구름이 비행 방향 반대로 지나갑니다.
 *    가까운(화면 아래) 구름은 빠르고 크게, 수평선 근처는 느리고 작게 보입니다.
 * 3) 빛: 해 주변의 아주 느린 밝기 변화와 구름 사이의 저주파 명암 변화 (몇 % 이내).
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); // y=0 이 이미지 위쪽
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uSky;
uniform sampler2D uMask;
uniform float uTime;
uniform float uAspect;
uniform float uHorizon;   // 구름층 수평선 (이미지 y, 0=위)
uniform vec2 uSun;        // 해(밝은 영역) 위치
uniform float uFlowK;     // 사진 구름의 흐름 세기
uniform float uWisp;      // 가까운 구름층 농도
uniform float uGlow;      // 해 주변 빛 세기

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
const mat2 R = mat2(0.8, -0.6, 0.6, 0.8);
float fbm5(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = R * p * 2.02; a *= 0.5; } return v; }
float fbm3(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 3; i++) { v += a * noise(p); p = R * p * 2.02; a *= 0.5; } return v; }

void main() {
  vec2 uv = vUv;
  float y = uv.y;
  float freeSky = texture2D(uMask, uv).r;

  // 1) 사진 속 구름의 흐름 — 깊이에 따른 속도(위쪽 하늘은 거의 정지, 수평선 아래 구름층일수록 빠르게)
  float deck = smoothstep(uHorizon - 0.05, 1.0, y);
  float speed = 0.06 + 0.25 * smoothstep(0.1, uHorizon, y) + 1.0 * deck;
  vec2 dir = normalize(vec2(1.0, 0.25 * deck));
  vec2 flow = dir * speed * freeSky;
  // 교차 페이드 위상은 넓은 영역 단위로 어긋나게 해 전체가 동시에 '숨 쉬는' 느낌을 없앰
  float t = uTime / 8.0 + fbm3(uv * 1.3 + 4.0) * 2.0;
  float p0 = fract(t);
  float p1 = fract(t + 0.5);
  float w = abs(p0 * 2.0 - 1.0);
  vec2 k = vec2(uFlowK, uFlowK * uAspect);
  vec3 c0 = texture2D(uSky, uv - flow * p0 * k).rgb;
  vec3 c1 = texture2D(uSky, uv - flow * p1 * k).rgb;
  vec3 col = mix(c0, c1, w);

  // 2) 가까운 구름층 — 수평선 아래 평면에 원근 투영, 가까울수록(아래) 크고 빠르게 뒤로 지나감
  float below = y - uHorizon;
  if (below > 0.0 && uWisp > 0.0) {
    float z = 0.10 / (below + 0.02);
    vec2 wp = vec2(uv.x * uAspect * z - uTime * 0.009, z * 1.3);
    float n = fbm5(wp * 0.85 + vec2(0.0, uTime * 0.004));
    float lit = clamp((n - fbm5(wp * 0.85 + vec2(0.05, -0.08))) * 5.0 + 0.55, 0.0, 1.0);
    float dens = smoothstep(0.46, 0.74, n);
    float fade = smoothstep(0.0, 0.16, below);
    float a = dens * fade * uWisp;
    vec3 cloud = mix(col * vec3(0.86, 0.88, 0.94), vec3(1.0, 0.97, 0.94), lit);
    col = mix(col, cloud, a);
  }

  // 3) 빛 — 해 주변의 느린 밝기 변화와 구름 사이의 저주파 명암 (몇 % 이내)
  vec2 d = (uv - uSun) * vec2(uAspect, 1.0);
  float glow = exp(-dot(d, d) * 5.0);
  float pulse = 0.5 + 0.5 * sin(uTime * 0.23) * sin(uTime * 0.11 + 1.3);
  col += vec3(1.0, 0.86, 0.72) * glow * uGlow * (0.6 + 0.4 * pulse);
  float l = fbm3(vec2(uv.x * 1.5 - uTime * 0.012, uv.y * 1.2)) - 0.5;
  col *= 1.0 + l * 0.06 * freeSky;

  gl_FragColor = vec4(col, 1.0);
}`;

/** 1×1 흰색 PNG (마스크 생략 시) */
const WHITE_PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGP4DwABAQEAsTj2FAAAAABJRU5ErkJggg==';

export type FlightSky = { start: () => void; stop: () => void; destroy: () => void };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

function texture(gl: WebGLRenderingContext, img: HTMLImageElement, unit: number) {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  return t;
}

/**
 * 캔버스에 하늘을 렌더링합니다. WebGL을 쓸 수 없거나 이미지 로딩에 실패하면 null을 반환합니다(호출 측은 정적 이미지/CSS 레이어 유지).
 * onReady는 첫 프레임이 그려진 뒤 한 번 호출됩니다.
 */
export async function createFlightSky(
  canvas: HTMLCanvasElement,
  opts: {
    skySrc: string;
    /** 흐름 마스크(흰색=흐름). 생략하면 화면 전체가 흐름 */
    maskSrc?: string;
    aspect: number;
    horizon?: number;
    sun?: [number, number];
    flowK?: number;
    wisp?: number;
    glow?: number;
    onReady?: () => void;
    /** GPU가 컨텍스트를 회수했을 때 (캔버스를 숨기고 아래 정적 이미지로 대체) */
    onLost?: () => void;
  },
): Promise<FlightSky | null> {
  // alpha: true — 버퍼가 비워지는 순간(리사이즈·컨텍스트 손실)에도 검은 화면 대신 아래 정적 이미지가 보이도록.
  // 셰이더는 항상 알파 1을 출력하므로 평소 화면은 동일합니다.
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return null;

  let sky: HTMLImageElement, mask: HTMLImageElement;
  try {
    [sky, mask] = await Promise.all([loadImage(opts.skySrc), loadImage(opts.maskSrc ?? WHITE_PX)]);
  } catch {
    return null;
  }

  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  texture(gl, sky, 0);
  texture(gl, mask, 1);
  gl.uniform1i(gl.getUniformLocation(prog, 'uSky'), 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'uMask'), 1);
  gl.uniform1f(gl.getUniformLocation(prog, 'uAspect'), opts.aspect);
  gl.uniform1f(gl.getUniformLocation(prog, 'uHorizon'), opts.horizon ?? 0.47);
  gl.uniform2f(gl.getUniformLocation(prog, 'uSun'), ...(opts.sun ?? [0.78, 0.43]));
  gl.uniform1f(gl.getUniformLocation(prog, 'uFlowK'), opts.flowK ?? 0.05);
  gl.uniform1f(gl.getUniformLocation(prog, 'uWisp'), opts.wisp ?? 0.42);
  gl.uniform1f(gl.getUniformLocation(prog, 'uGlow'), opts.glow ?? 0.04);
  const uTime = gl.getUniformLocation(prog, 'uTime');

  // 해상도: 기기 픽셀 비율은 최대 1.5배, 총 픽셀 수는 약 240만으로 제한 (부드러운 하늘이라 이 이상은 차이가 거의 없음)
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const maxPx = 2_400_000;
    if (rect.width * rect.height * dpr * dpr > maxPx) dpr = Math.sqrt(maxPx / (rect.width * rect.height));
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      // 크기를 바꾸면 버퍼가 비워지므로, 멈춰 있는 상태여도 즉시 한 장을 다시 그림
      if (ready && !lost) draw(performance.now());
    }
  };

  let raf = 0;
  let running = false;
  let ready = false;
  let lost = false;
  const t0 = performance.now();
  const draw = (now: number) => {
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    running = false;
    cancelAnimationFrame(raf);
    canvas.style.visibility = 'hidden';
    opts.onLost?.();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  const frame = (now: number) => {
    if (lost) return;
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!ready) {
      ready = true;
      opts.onReady?.();
    }
    if (running) raf = requestAnimationFrame(frame);
  };

  return {
    start() {
      if (running || lost) return;
      running = true;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
