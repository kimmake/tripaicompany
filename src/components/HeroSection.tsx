import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../lib/gsap';
import { service, site } from '../config/site';
import { PlaneMark } from './ui/Logo';

/* 레이어 이미지 (원본 사진 1장을 분리): 하늘(날개 영역 복원) · 날개(투명 배경) · 구름 안개 2장(가로 반복) */
const SKY_SRCSET = '/images/hero/sky-1280.webp 1280w, /images/hero/sky-2400.webp 2400w';
const WING_SRCSET = '/images/hero/wing-1280.webp 1280w, /images/hero/wing-2400.webp 2400w';
/* 스테이지는 화면을 덮도록 확대되므로 세로 화면에서는 화면 높이의 약 1.6배 폭으로 렌더링됩니다. */
const SIZES = '(orientation: portrait) 160vh, 100vw';

/**
 * SECTION 01 — HERO · Anywhere × TripAI
 * 배경: 비행기 창밖처럼 레이어로 분리된 하늘 · 구름 안개 · 날개의 느린 움직임 (반복, 초기화 없음)
 * 전경: 한 번만 재생되고 최종 화면에서 멈추는 브랜드 시퀀스
 *   Scene 01 (0–2s)  Anywhere 로고 등장 (왼쪽 → 오른쪽으로 드러남)
 *   Scene 02 (2–4s)  Anywhere가 위로 이동·축소 → 연결선 + presents → 종이비행기 출발
 *   Scene 03 (4–6s)  종이비행기가 지나간 자리에 TripAI 등장 (심볼은 비행기가 지나간 위치에 남음)
 *   Scene 04 (6–8s)  Anywhere ↓ presents ↓ TripAI + 서비스 설명 — 스크롤 전까지 유지
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.anyMotion, () => {
        // 인트로: 밝은 하늘 → 카메라가 천천히 자리 잡음
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to(q('.hero-veil'), { opacity: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
          .fromTo(q('.hero-cam'), { scale: 1.1 }, { scale: 1, duration: 4.5, ease: 'power3.out' }, 0);

        // 브랜드 시퀀스: 웹폰트가 준비된 뒤 실제 배치를 측정해 경로를 만들고 한 번만 재생
        const brand = q('.brand')[0] as HTMLElement;
        gsap.set(brand, { autoAlpha: 0 });
        let seq: gsap.core.Timeline | null = null;
        let cancelled = false;
        const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);
        void fontsReady.then(() => {
          if (cancelled || !root.current) return;
          seq = buildBrandSequence(root.current, brand);
        });
        // 시퀀스 도중 화면 크기가 바뀌면 최종 화면으로 즉시 이동 (최종 화면은 일반 레이아웃이라 크기 변화에 안전)
        const onResize = () => seq?.isActive() && seq.progress(1);
        window.addEventListener('resize', onResize);

        // 반복 모션 (모두 transform만 사용)
        const loops: gsap.core.Tween[] = [
          // 카메라 전진: 하늘이 아주 느리게 다가오며 뒤쪽(오른쪽)으로 흘러감
          gsap.fromTo(q('.sky-move'), { scale: 1, xPercent: 0, yPercent: 0 }, { scale: 1.05, xPercent: 1.1, yPercent: -0.6, duration: 34, ease: 'sine.inOut', repeat: -1, yoyo: true }),
          // 카메라 호흡: 전체 레이어의 미세한 상하 움직임 (날개·하늘 함께)
          gsap.to(q('.hero-breath'), { yPercent: -0.5, scale: 1.012, duration: 11, ease: 'sine.inOut', repeat: -1, yoyo: true }),
          // 구름 안개: 먼 층은 느리게, 가까운 층은 조금 빠르게 (한 타일 이동 후 이음새 없이 반복)
          gsap.fromTo(q('.haze-far'), { xPercent: -100 / 3 }, { xPercent: 0, duration: 150, ease: 'none', repeat: -1 }),
          gsap.fromTo(q('.haze-near'), { xPercent: -100 / 3 }, { xPercent: 0, duration: 80, ease: 'none', repeat: -1 }),
          // 날개 진동: 느린 흔들림 + 아주 작은 떨림. 매 반복마다 목표값을 새로 정해 규칙적으로 보이지 않게 함
          gsap.to(q('.wing-sway'), { y: () => gsap.utils.random(-1.6, 1.6), duration: 1.9, ease: 'sine.inOut', repeat: -1, repeatRefresh: true }),
          gsap.to(q('.wing-buzz'), { y: () => gsap.utils.random(-0.45, 0.45), duration: 0.22, ease: 'sine.inOut', repeat: -1, repeatRefresh: true }),
        ];

        // 화면 밖에서는 반복 모션을 멈춰 배터리·CPU 사용을 줄임
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => loops.forEach((t) => (self.isActive ? t.resume() : t.pause())),
        });

        return () => {
          cancelled = true;
          window.removeEventListener('resize', onResize);
        };
      });

      // 데스크톱 스크롤 패럴랙스: 먼 하늘은 더 많이, 가까운 날개는 덜 움직임
      mm.add(MQ.desktopMotion, () => {
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('.par-sky'), { yPercent: 10, ease: 'none', scrollTrigger: st });
        gsap.to(q('.par-wing'), { yPercent: 7, ease: 'none', scrollTrigger: st });
        gsap.to(q('.hero-inner'), { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-stage" aria-hidden="true">
        <div className="hero-cam">
          <div className="hero-breath">
            <div className="hero-layer par-sky">
              <div className="hero-layer sky-move">
                <img
                  className="hero-img"
                  src="/images/hero/sky-2400.webp"
                  srcSet={SKY_SRCSET}
                  sizes={SIZES}
                  alt=""
                  width={2400}
                  height={1594}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="haze haze-far" />
              <div className="haze haze-near" />
            </div>
            <div className="hero-layer par-wing">
              <div className="hero-layer wing-sway">
                <div className="hero-layer wing-buzz">
                  <img
                    className="hero-img"
                    src="/images/hero/wing-2400.webp"
                    srcSet={WING_SRCSET}
                    sizes={SIZES}
                    alt=""
                    width={2400}
                    height={1594}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-inner">
        <div className="brand">
          <svg className="brand-trail" aria-hidden="true">
            <path className="trail" />
            <g className="flyer">
              <g className="flyer-icon" transform="rotate(45) translate(-12 -12)">
                <path d="M21.5 2.5 2.8 10.2l7.6 3.4 3.4 7.6z" />
                <path d="M21.5 2.5 10.4 13.6" />
              </g>
            </g>
          </svg>
          <h1 className="bs-company" id="hero-title" aria-label={`${site.name} presents ${service.name}`}>
            <img
              className="bs-logo"
              src="/images/brand/anywhere-logo-800.webp"
              srcSet="/images/brand/anywhere-logo-800.webp 800w, /images/brand/anywhere-logo-1600.webp 1600w"
              sizes="(max-width: 767px) 260px, 560px"
              alt=""
              width={1745}
              height={431}
              decoding="async"
              fetchPriority="high"
            />
          </h1>
          <span className="bs-line" aria-hidden="true" />
          <p className="bs-presents" aria-hidden="true">
            presents
          </p>
          <p className="bs-service" aria-hidden="true">
            <span className="bs-mark">
              <PlaneMark />
            </span>
            <span className="bs-name">{service.name}</span>
          </p>
          <p className="bs-caption">{service.descriptor}</p>
        </div>
      </div>
    </section>
  );
}

/**
 * 측정 기반 브랜드 시퀀스.
 * 모든 요소는 최종 배치(Anywhere / 연결선 / presents / TripAI)에 놓여 있고,
 * 시작 상태만 transform으로 바꿔 두었다가 최종 배치로 돌아오게 합니다 → 끝나면 transform이 남지 않음.
 */
function buildBrandSequence(hero: HTMLElement, brand: HTMLElement) {
  const q = gsap.utils.selector(brand);
  const box = brand.getBoundingClientRect();
  const heroBox = hero.getBoundingClientRect();
  const rel = (el: Element) => {
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height, cx: r.left - box.left + r.width / 2, cy: r.top - box.top + r.height / 2 };
  };
  const company = q('.bs-company')[0];
  const presents = q('.bs-presents')[0];
  const mark = q('.bs-mark')[0];
  const name = q('.bs-name')[0];
  const svg = q('.brand-trail')[0] as unknown as SVGSVGElement;
  const trail = q('.trail')[0] as unknown as SVGPathElement;
  const flyer = q('.flyer')[0];
  const icon = q('.flyer-icon')[0];

  const C = rel(company);
  const P = rel(presents);
  const M = rel(mark);
  const N = rel(name);
  svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);

  // Scene 01: Anywhere를 화면 정중앙에 크게 (화면 폭의 88%를 넘지 않게)
  const s0 = Math.min(1.6, (heroBox.width * 0.88) / C.w);
  const dy = heroBox.top + heroBox.height / 2 - (box.top + C.cy);

  // 종이비행기 경로: presents 아래에서 출발 → 왼쪽으로 크게 돌아 심볼 위치에 수평으로 진입 → TripAI 위를 지나 오른쪽으로 빠짐
  const k = Math.max(M.h, N.h * 0.55) / 24;
  icon.setAttribute('transform', `scale(${k.toFixed(3)}) rotate(45) translate(-12 -12)`);
  const sx = P.cx, sy = P.y + P.h + 6;
  const mx = M.cx, my = N.cy;
  const loop = Math.max(40, N.h * 0.9);
  const approach = `M${sx},${sy} C${sx},${sy + (my - sy) * 0.9} ${mx - loop * 1.6},${my} ${mx},${my}`;
  const endX = N.x + N.w + N.h * 0.35;
  const across = `M${mx},${my} L${endX},${my}`;
  const exit = `M${endX},${my} C${endX + N.h * 0.4},${my} ${endX + N.h * 0.6},${my - N.h * 0.2} ${endX + N.h * 0.9},${my - N.h * 0.55}`;
  trail.setAttribute('d', approach);
  const len = trail.getTotalLength();
  const revealStart = Math.max(0, (N.x - mx) / (endX - mx));

  gsap.set(brand, { autoAlpha: 1 });
  gsap.set(company, { y: dy, scale: s0, transformOrigin: '50% 50%' });
  gsap.set(q('.bs-logo'), { opacity: 0, y: 18, clipPath: 'inset(-10% 100% -10% 0%)' });
  gsap.set(q('.bs-line'), { scaleY: 0, transformOrigin: '50% 0%' });
  gsap.set([presents, q('.bs-caption')[0]], { opacity: 0, y: 10 });
  gsap.set(mark, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });
  gsap.set(name, { clipPath: 'inset(-20% 100% -20% 0%)' });
  gsap.set(trail, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
  gsap.set(flyer, { opacity: 0, x: sx, y: sy });

  const across0 = 4.25;
  const acrossDur = 1.0;
  return (
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      // Scene 01 — Anywhere
      // 로고는 비행 궤적 방향(왼쪽 → 오른쪽)으로 드러남
      .to(q('.bs-logo'), { opacity: 1, y: 0, duration: 1.2 }, 0.5)
      .to(q('.bs-logo'), { clipPath: 'inset(-10% 0% -10% 0%)', duration: 1.6, ease: 'power2.inOut' }, 0.5)
      // Scene 02 — 위로 이동·축소, 연결선과 presents, 비행기 출발
      .to(company, { y: 0, scale: 1, duration: 1.4, ease: 'power3.inOut' }, 2.0)
      .to(q('.bs-line'), { scaleY: 1, duration: 0.7, ease: 'power2.out' }, 2.9)
      .to(presents, { opacity: 1, y: 0, duration: 0.8 }, 3.05)
      .to(flyer, { opacity: 1, duration: 0.25 }, 3.25)
      .to(flyer, { duration: across0 - 3.25, ease: 'power1.inOut', motionPath: { path: approach, autoRotate: true } }, 3.25)
      .to(trail, { strokeDashoffset: 0, duration: across0 - 3.25, ease: 'power1.inOut' }, 3.25)
      // Scene 03 — 비행기가 지나간 자리에 TripAI
      .to(flyer, { duration: acrossDur, ease: 'none', motionPath: { path: across, autoRotate: true } }, across0)
      .to(mark, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.6)' }, across0 + 0.05)
      .to(name, { clipPath: 'inset(-20% 0% -20% 0%)', duration: acrossDur * (1 - revealStart), ease: 'none' }, across0 + acrossDur * revealStart)
      .to(flyer, { duration: 0.6, ease: 'power1.in', motionPath: { path: exit, autoRotate: true } }, across0 + acrossDur)
      .to(flyer, { opacity: 0, duration: 0.45, ease: 'power1.in' }, across0 + acrossDur + 0.15)
      .to(trail, { opacity: 0, duration: 1.2, ease: 'power2.out' }, across0 + 0.4)
      // Scene 04 — 최종 구성 (유지)
      .to(q('.bs-caption'), { opacity: 1, y: 0, duration: 1.1 }, 6.0)
      .set([name, q('.bs-logo')[0]], { clearProps: 'clipPath' })
  );
}
