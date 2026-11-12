import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../lib/gsap';

const BRAND = 'TripAI';

/* 레이어 이미지 (원본 사진 1장을 분리): 하늘(날개 영역 복원) · 날개(투명 배경) · 구름 안개 2장(가로 반복) */
const SKY_SRCSET = '/images/hero/sky-1280.webp 1280w, /images/hero/sky-2400.webp 2400w';
const WING_SRCSET = '/images/hero/wing-1280.webp 1280w, /images/hero/wing-2400.webp 2400w';
/* 스테이지는 화면을 덮도록 확대되므로 세로 화면에서는 화면 높이의 약 1.6배 폭으로 렌더링됩니다. */
const SIZES = '(orientation: portrait) 160vh, 100vw';

/**
 * SECTION 01 — HERO
 * 비행기 창밖을 바라보는 듯한 첫 화면.
 *  - 하늘: 아주 느린 전진(줌인)과 뒤로 흘러가는 드리프트
 *  - 구름 안개 2겹: 서로 다른 속도로 화면을 가로질러 흐름 (원근감) — 이음새 없는 반복
 *  - 날개: 비행 중의 미세한 상하 진동 (회전 없음)
 *  - 카메라: 전체 레이어의 미세한 호흡. 모든 반복은 sine 이징 yoyo / 연속 루프라 초기화되는 순간이 없음
 *  - 중앙: TripAI 워드마크만 부드럽게 등장
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.anyMotion, () => {
        // 인트로: 밝은 하늘 → 카메라가 천천히 자리 잡음 → 워드마크 등장
        const chars = q('.hero-brand .ch');
        const mid = (chars.length - 1) / 2;
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .to(q('.hero-veil'), { opacity: 0, duration: 2.4, ease: 'power2.inOut' }, 0.1)
          .fromTo(q('.hero-cam'), { scale: 1.1 }, { scale: 1, duration: 4.2, ease: 'power3.out' }, 0)
          .fromTo(
            chars,
            { opacity: 0, y: 26, x: (i: number) => (i - mid) * 14 },
            { opacity: 1, y: 0, x: 0, duration: 2.4, ease: 'power3.out', stagger: { each: 0.07, from: 'center' } },
            1.2,
          );

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
        <h1 className="hero-brand" id="hero-title" aria-label={BRAND}>
          {BRAND.split('').map((c, i) => (
            <span className="ch" key={i} aria-hidden="true">
              {c}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
