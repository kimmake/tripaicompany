import { useRef } from 'react';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import { createCloudFly, type CloudFly, type CloudFlyState } from '../lib/cloudFly';
import { createFlightSky, type FlightSky } from '../lib/flightSky';
import HeroSection from './HeroSection';
import SectionLabel from './ui/SectionLabel';

/**
 * Hero → 구름 속 → 구름 위(About Anywhere) 로 이어지는 하나의 하늘 여행.
 *
 * 화면(스테이지)을 고정한 채 스크롤 진행도에 따라 장면이 연속으로 바뀝니다(스크럽).
 *  Scene 01  기존 Hero (비행 애니메이션 유지)
 *  Scene 02  카메라가 구름층을 향해 전진: 하늘 레이어 확대, 날개는 아래로 빠지며 안개 속으로, 가장자리부터 안개
 *  Scene 03  구름 시트들이 원근에 따라 다가와 스쳐 지나가고 화면이 밝은 안개로 가득 참 → 이때 장면 교체
 *  Scene 04  안개가 걷히며 구름 위 하늘(About 배경)이 펼쳐지고 회사 소개가 떠오름
 * 스크롤을 올리면 같은 경로로 되돌아가며, 멈추면 그 위치에서 멈춥니다.
 * 모션 축소 환경에서는 Hero와 About을 고정 없이 차례로 보여줍니다.
 */
export default function SkyJourney() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.anyMotion, () => {
        root.current?.classList.add('is-pinned');
        const canvas = q('.journey-fog')[0] as HTMLCanvasElement;
        const lowEnd = (navigator.hardwareConcurrency ?? 8) <= 4;
        const mobile = window.matchMedia('(max-width: 767px)').matches;
        const fly: CloudFly | null = createCloudFly(canvas, lowEnd ? 0.28 : mobile ? 0.35 : 0.5);
        if (!fly) root.current?.classList.add('no-gl');
        const fog: CloudFlyState = { z: 0, density: 0, edge: 0, white: 0 };
        const fallback = q('.journey-fallback')[0] as HTMLElement;
        // 구름 위(About) 하늘도 같은 렌더러로 살아 움직이게 함: 구름 바다는 천천히 흐르고 가까운 구름층이 지나감
        let aboutSky: FlightSky | null = null;
        let aboutVisible = false;
        let inView = true;
        let disposed = false;
        void createFlightSky(q('.ja-gl')[0] as HTMLCanvasElement, {
          skySrc: '/images/about/above-clouds.webp',
          aspect: 1256 / 829,
          horizon: 0.47,
          sun: [0.52, 0.42],
          flowK: 0.07,
          wisp: 0.5,
          glow: 0.05,
          onReady: () => root.current?.classList.add('ja-gl-ready'),
        }).then((r) => {
          if (disposed) return r?.destroy();
          aboutSky = r;
          syncAbout();
        });
        const syncAbout = () => (aboutVisible && inView && !document.hidden ? aboutSky?.start() : aboutSky?.stop());
        const io = new IntersectionObserver(([e]) => {
          inView = e.isIntersecting;
          syncAbout();
        });
        io.observe(q('.journey-stage')[0]);
        document.addEventListener('visibilitychange', syncAbout);

        const draw = () => {
          if (fly) fly.render(fog);
          else gsap.set(fallback, { opacity: Math.min(1, Math.max(fog.white, fog.edge * 0.55, fog.density * 0.7)) });
          const v = tl.progress() > 0.47;
          if (v !== aboutVisible) {
            aboutVisible = v;
            syncAbout();
          }
        };

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: draw,
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        });
        tl.set({}, {}, 100);

        // Scene 02 — 구름을 향해 전진
        tl.fromTo(q('.par-sky'), { scale: 1 }, { scale: 1.45, duration: 48, ease: 'power1.in' }, 0)
          .fromTo(q('.par-wing'), { yPercent: 0, scale: 1 }, { yPercent: 26, scale: 1.16, duration: 46, ease: 'power2.in' }, 0)
          .to(q('.par-wing'), { opacity: 0, duration: 16 }, 28)
          .to(q('.hero-title'), { opacity: 0, scale: 1.05, duration: 18, ease: 'power1.in' }, 18)
          // 안개 상태 (WebGL 셰이더 값)
          .to(fog, { z: 1.5, duration: 58, ease: 'power1.in' }, 0)
          .to(fog, { z: 2.7, duration: 42, ease: 'power1.out' }, 58)
          .to(fog, { edge: 0.85, duration: 30, ease: 'power1.in' }, 5)
          .to(fog, { edge: 1, duration: 10 }, 35)
          .to(fog, { edge: 0, duration: 22, ease: 'power1.inOut' }, 55)
          .to(fog, { density: 1, duration: 24, ease: 'power1.inOut' }, 8)
          .to(fog, { density: 0, duration: 27, ease: 'power1.inOut' }, 60)
          // Scene 03 — 안개로 가득 참 (이 사이에 장면 교체)
          .to(fog, { white: 1, duration: 14, ease: 'power1.in' }, 36)
          .to(fog, { white: 0, duration: 24, ease: 'power2.inOut' }, 57)
          .to(q('.journey-hero'), { autoAlpha: 0, duration: 2 }, 49)
          .fromTo(q('.journey-about'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 49)
          // Scene 04 — 구름 위로
          .fromTo(q('.ja-media'), { scale: 1.16, yPercent: 5 }, { scale: 1, yPercent: 0, duration: 42, ease: 'power2.out' }, 50)
          .fromTo(q('.ja-label'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 6 }, 76)
          .fromTo(q('.ja-title .ln'), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 9, stagger: 2.5 }, 78)
          .fromTo(q('.ja-sub'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 7 }, 86)
          .fromTo(q('.ja-body'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 7 }, 90);
        draw();

        return () => {
          disposed = true;
          io.disconnect();
          document.removeEventListener('visibilitychange', syncAbout);
          aboutSky?.destroy();
          fly?.destroy();
          root.current?.classList.remove('is-pinned', 'no-gl');
        };
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="journey">
      {/* 내비게이션 'About' 이동 지점: 회사 소개가 완성된 위치 */}
      <div id="anywhere" className="journey-anchor" aria-hidden="true" />
      <div className="journey-stage">
        <div className="journey-hero">
          <HeroSection />
        </div>
        <section className="journey-about" aria-labelledby="ja-title">
          <div className="ja-media" aria-hidden="true">
            <img src="/images/about/above-clouds.webp" alt="" width={1256} height={829} loading="eager" decoding="async" />
            <canvas className="ja-gl" />
          </div>
          <div className="ja-shade" aria-hidden="true" />
          <div className="wrap ja-in">
            <SectionLabel className="ja-label" reveal={false}>
              About Anywhere
            </SectionLabel>
            <h2 className="ja-title" id="ja-title">
              <span className="ln">여행을 바라보는</span>
              <span className="ln">새로운 시선.</span>
            </h2>
            <p className="ja-sub">같은 목적지라도, 모두의 여행은 다르니까.</p>
            <p className="ja-body">
              Anywhere는 AI 기술과 실제 여행 경험을 연결해, 각자에게 어울리는 여행을 더 쉽게 발견할 수 있도록 돕는 트래블테크 스타트업입니다.
            </p>
          </div>
        </section>
        <canvas className="journey-fog" aria-hidden="true" />
        <div className="journey-fallback" aria-hidden="true" />
      </div>
    </div>
  );
}
