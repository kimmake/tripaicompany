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

  // 1) 플로맵 — 깊이에 따른 속도, 비행 방향(왼쪽 위)의 반대인 오른쪽으로 흐름
  float speed = 0.05 + 0.20 * smoothstep(0.12, 0.5, y) + 0.85 * smoothstep(0.5, 1.0, y);
  vec2 dir = normalize(vec2(1.0, 0.2 * smoothstep(0.55, 1.0, y)));
  vec2 flow = dir * speed * freeSky;
  float t = uTime / 6.0 + noise(uv * vec2(2.0, 3.0) + 7.0);
  float p0 = fract(t);
  float p1 = fract(t + 0.5);
  float w = abs(p0 * 2.0 - 1.0);
  vec2 k = vec2(0.016, 0.016 * uAspect); // 픽셀 기준 등방성 이동량
  vec3 c0 = texture2D(uSky, uv - flow * p0 * k).rgb;
  vec3 c1 = texture2D(uSky, uv - flow * p1 * k).rgb;
  vec3 col = mix(c0, c1, w);

  // 2) 원근 구름층 (수평선 아래)
  float below = y - 0.47;
  if (below > 0.0) {
    float z = 0.10 / (below + 0.015);
    vec2 wp = vec2(uv.x * uAspect * z - uTime * 0.007, z * 1.4);
    float n = fbm5(wp * 0.9 + vec2(0.0, uTime * 0.003));
    float wisp = smoothstep(0.52, 0.80, n);
    float fade = smoothstep(0.0, 0.14, below) * (1.0 - 0.35 * smoothstep(0.7, 1.0, y));
    float a = wisp * fade * 0.20;
    vec3 tint = mix(vec3(1.0, 0.95, 0.9), col * 1.15, 0.5);
    col += (vec3(1.0) - col) * a * tint;
  }

  // 3) 빛 — 해 주변의 아주 느린 밝기 변화, 구름 사이의 저주파 명암
  vec2 d = (uv - vec2(0.78, 0.43)) * vec2(uAspect, 1.0);
  float glow = exp(-dot(d, d) * 6.0);
  float pulse = 0.5 + 0.5 * sin(uTime * 0.21) * sin(uTime * 0.13 + 1.3);
  col += vec3(1.0, 0.86, 0.72) * glow * 0.035 * pulse;
  float l = fbm3(vec2(uv.x * 1.5 - uTime * 0.006, uv.y * 1.2)) - 0.5;
  col *= 1.0 + l * 0.05 * freeSky;

  gl_FragColor = vec4(col, 1.0);
}`;

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
  opts: { skySrc: string; maskSrc: string; aspect: number; onReady?: () => void },
): Promise<FlightSky | null> {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  if (!gl) return null;

  let sky: HTMLImageElement, mask: HTMLImageElement;
  try {
    [sky, mask] = await Promise.all([loadImage(opts.skySrc), loadImage(opts.maskSrc)]);
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
    }
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  let raf = 0;
  let running = false;
  let ready = false;
  const t0 = performance.now();
  const frame = (now: number) => {
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
      if (running) return;
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
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
