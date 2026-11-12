import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../lib/gsap';
import { createFlightSky, type FlightSky } from '../lib/flightSky';
import { site } from '../config/site';

/* 레이어 이미지 (원본 사진 1장을 분리): 하늘(날개 영역 복원) · 날개(투명 배경) · 구름 안개 2장(가로 반복, WebGL 미지원 시 사용) */
const SKY_SRCSET = '/images/hero/sky-1280.webp 1280w, /images/hero/sky-2400.webp 2400w';
const WING_SRCSET = '/images/hero/wing-1280.webp 1280w, /images/hero/wing-2400.webp 2400w';
/* 스테이지는 화면을 덮도록 확대되므로 세로 화면에서는 화면 높이의 약 1.6배 폭으로 렌더링됩니다. */
const SIZES = '(orientation: portrait) 160vh, 100vw';
const STAGE_ASPECT = 2400 / 1594;

/**
 * SECTION 01 — HERO
 * 비행기 창밖의 하늘이 살아 움직이는 배경 + 중앙에 고정된 Anywhere 로고.
 *  - 하늘(WebGL): 사진 속 구름이 깊이에 따라 다른 속도로 흐르고(먼 하늘은 거의 정지, 아래 구름층은 빠르게),
 *    원근이 적용된 구름층이 지나가며, 해 주변 빛이 아주 미세하게 변함. 반복 시 초기화되는 순간 없음.
 *  - 날개: 별도 레이어, 미세한 상하 진동만 (회전 없음)
 *  - 카메라: 아주 느린 전진과 호흡
 *  - 로고: 애니메이션 없음
 * WebGL을 쓸 수 없으면 CSS 레이어(안개 텍스처 이동), 모션 축소 환경에서는 정지 이미지를 표시합니다.
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.anyMotion, () => {
        // 인트로: 밝은 하늘에서 창밖 풍경이 드러남 (로고는 처음부터 고정)
        gsap
          .timeline()
          .to(q('.hero-veil'), { opacity: 0, duration: 2.2, ease: 'power2.inOut' }, 0)
          .fromTo(q('.hero-cam'), { scale: 1.04 }, { scale: 1, duration: 5, ease: 'power2.out' }, 0);

        // 반복 모션 (transform만 사용)
        const loops: gsap.core.Tween[] = [
          // 카메라 전진: 하늘이 아주 느리게 다가옴
          // 카메라 시점 이동: 하늘이 날개 뒤에서 천천히 좌우·상하로 이동 → 고정된 날개와의 시차(패럴랙스)
          // (확대 1.05 상태에서 이동 폭은 가장자리 여유 안쪽)
          gsap.fromTo(q('.sky-move'), { scale: 1.05, xPercent: -0.5, yPercent: 0.3 }, { scale: 1.05, xPercent: 0.5, yPercent: -0.4, duration: 16, ease: 'sine.inOut', repeat: -1, yoyo: true }),
          // 카메라 호흡: 전체 레이어의 미세한 상하 움직임
          gsap.to(q('.hero-breath'), { yPercent: -0.4, scale: 1.01, duration: 12, ease: 'sine.inOut', repeat: -1, yoyo: true }),
          // (WebGL 미지원 시) 구름 안개 텍스처
          gsap.fromTo(q('.haze-far'), { xPercent: -100 / 3 }, { xPercent: 0, duration: 150, ease: 'none', repeat: -1 }),
          gsap.fromTo(q('.haze-near'), { xPercent: -100 / 3 }, { xPercent: 0, duration: 80, ease: 'none', repeat: -1 }),
          // 날개 진동: 느린 상하 흔들림 + 아주 작은 떨림. 매 반복마다 목표값을 새로 정해 규칙적으로 보이지 않게 함
          gsap.to(q('.wing-sway'), { y: () => gsap.utils.random(-2.6, 2.6), duration: 2.4, ease: 'sine.inOut', repeat: -1, repeatRefresh: true }),
          gsap.to(q('.wing-buzz'), { y: () => gsap.utils.random(-0.6, 0.6), duration: 0.2, ease: 'sine.inOut', repeat: -1, repeatRefresh: true }),
        ];

        // WebGL 하늘
        let sky: FlightSky | null = null;
        let active = true;
        let disposed = false;
        const canvas = q('.sky-gl')[0] as HTMLCanvasElement;
        const big = canvas.getBoundingClientRect().width * Math.min(window.devicePixelRatio || 1, 1.5) > 1400;
        void createFlightSky(canvas, {
          skySrc: big ? '/images/hero/sky-2400.webp' : '/images/hero/sky-1280.webp',
          maskSrc: '/images/hero/flow-mask.png',
          aspect: STAGE_ASPECT,
          onReady: () => root.current?.classList.add('is-gl'),
        }).then((r) => {
          if (disposed) return r?.destroy();
          sky = r;
          if (sky && active && !document.hidden) sky.start();
        });
        const onVis = () => (document.hidden || !active ? sky?.stop() : sky?.start());
        document.addEventListener('visibilitychange', onVis);

        // 화면 밖에서는 모든 반복 모션과 렌더링을 멈춤
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            active = self.isActive;
            loops.forEach((t) => (active ? t.resume() : t.pause()));
            onVis();
          },
        });

        return () => {
          disposed = true;
          document.removeEventListener('visibilitychange', onVis);
          sky?.destroy();
          root.current?.classList.remove('is-gl');
        };
      });

      // 스크롤에 따른 카메라 이동은 SkyJourney(구름 진입 전환)에서 담당합니다.
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
                <canvas className="hero-img sky-gl" />
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
        <h1 className="hero-title" id="hero-title">
          <img
            className="hero-logo"
            src="/images/brand/anywhere-logo-800.webp"
            srcSet="/images/brand/anywhere-logo-800.webp 800w, /images/brand/anywhere-logo-1600.webp 1600w"
            sizes="(max-width: 767px) 300px, 600px"
            alt={site.name}
            width={1745}
            height={431}
            decoding="async"
            fetchPriority="high"
          />
          {/* 사실에 기반한 회사 정의 한 줄 (Anywhere = AI 트래블테크 스타트업) */}
          <span className="hero-tag">AI Travel Tech Company</span>
        </h1>
      </div>
    </section>
  );
}
