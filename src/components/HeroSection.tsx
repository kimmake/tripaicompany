import { useRef } from 'react';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import { onAnchorClick } from '../lib/scroll';

const VALUES = ['Personalization', 'Authenticity', 'Simplicity', 'Discovery'];

/**
 * SECTION 01 — HERO
 * 시네마틱 인트로: 밝은 하늘(베일) → 카메라 줌 아웃 → 비행 경로 → 헤드라인 줄 단위 등장 → 슬로건 → 스크롤 유도.
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.anyMotion, () => {
        const path = root.current?.querySelector<SVGPathElement>('.hero-path path') ?? undefined;
        const len = path?.getTotalLength() ?? 0;
        if (path) gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        tl.to(q('.hero-veil'), { opacity: 0, duration: 2.2, ease: 'power2.inOut' }, 0.1)
          .fromTo(q('.hero-zoom'), { scale: 1.16, xPercent: 1.5, yPercent: 1 }, { scale: 1.04, xPercent: 0, yPercent: 0, duration: 3.4 }, 0)
          .from(q('.hero-eyebrow'), { y: 18, opacity: 0, duration: 1.2 }, 1.1)
          .from(q('.hero-title .mask > span'), { yPercent: 108, opacity: 0, duration: 1.4, stagger: 0.18 }, 1.3)
          .from(q('.hero-slogan'), { y: 18, opacity: 0, duration: 1.3 }, 2.1)
          .from(q('.hero-sub'), { y: 18, opacity: 0, duration: 1.3 }, 2.35)
          .to(path ?? {}, { strokeDashoffset: 0, duration: 2.6, ease: 'power2.inOut' }, 2.2)
          .from(q('.hero-path circle'), { opacity: 0, duration: 0.6 }, 4.4)
          .from(q('.scroll-cue, .values'), { opacity: 0, duration: 1 }, 2.9);

        // 매우 느린 카메라 드리프트
        gsap.to(q('.hero-drift'), {
          scale: 1.05,
          xPercent: -1.6,
          yPercent: -1,
          duration: 28,
          delay: 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
        gsap.to(q('.hero-path .ring'), { scale: 3.2, opacity: 0, duration: 2.8, delay: 4.6, repeat: -1, ease: 'power1.out' });
      });

      // 데스크톱 전용 패럴랙스: 이미지와 텍스트가 서로 다른 속도로 이동
      mm.add(MQ.desktopMotion, () => {
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('.hero-media'), { yPercent: 14, ease: 'none', scrollTrigger: st });
        gsap.to(q('.hero-inner'), { yPercent: -22, opacity: 0, ease: 'none', scrollTrigger: st });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-zoom">
          <div className="hero-drift">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/hero-sky-m.webp" width={900} height={1600} />
              <img
                src="/images/hero-sky.webp"
                srcSet="/images/hero-sky-1280.webp 1280w, /images/hero-sky.webp 2400w"
                sizes="100vw"
                alt=""
                width={2400}
                height={1600}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <svg className="hero-path" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M-40 780 C 280 760, 520 640, 760 560 S 1180 300, 1330 210" />
        <circle className="ring" cx="1330" cy="210" r="5" />
        <circle cx="1330" cy="210" r="3.5" />
      </svg>
      <div className="hero-veil" aria-hidden="true" />

      <div className="hero-inner wrap">
        <p className="hero-eyebrow">TripAI — Where Emotion Meets Intelligence</p>
        <h1 className="hero-title" id="hero-title">
          <span className="mask">
            <span>Travel Beyond</span>
          </span>
          <span className="mask">
            <span>Expectations.</span>
          </span>
        </h1>
        <p className="hero-slogan">당신의 취향이 여행이 되는 순간.</p>
        <p className="hero-sub">여행자의 경험과 AI 기술을 연결하여, 더 나다운 여행의 가능성을 만들어갑니다.</p>
      </div>

      <div className="hero-foot">
        <div className="wrap">
          <a className="scroll-cue" href="#about" onClick={(e) => onAnchorClick(e)}>
            <span className="rail" aria-hidden="true" />
            Scroll
          </a>
          <ul className="values" aria-label="TripAI 핵심 가치">
            {VALUES.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
