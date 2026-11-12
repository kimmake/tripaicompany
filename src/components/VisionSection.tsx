import { useRef } from 'react';
import { gsap, useGSAP, MQ } from '../lib/gsap';

/**
 * SECTION 06 — OUR VISION
 * 화면 가득한 풍경 위로 큰 타이포그래피가 천천히 나타나는 감성 섹션. UI·카드 요소를 사용하지 않습니다.
 */
export default function VisionSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktopMotion, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        });
        tl.set({}, {}, 100)
          .fromTo(q('.vi-media'), { scale: 1.18 }, { scale: 1, duration: 100 }, 0)
          .from(q('.vi-in .label'), { opacity: 0, y: 20, duration: 12 }, 0)
          .from(q('.vi-title .w'), { opacity: 0, y: 60, duration: 26, stagger: 6, ease: 'power2.out' }, 2)
          .from(q('.vi-body p'), { opacity: 0, y: 30, duration: 20, stagger: 6, ease: 'power2.out' }, 42);
        // 고정 구간에 들어오기 전 이미지가 아래에서 위로 살짝 따라 올라오는 패럴랙스
        gsap.fromTo(
          q('.vi-media img'),
          { yPercent: -8 },
          { yPercent: 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true } },
        );
      });

      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.from(q('.vi-title .w, .vi-body p'), {
          opacity: 0,
          y: 30,
          duration: 1.2,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: { trigger: q('.vi-title')[0], start: 'top 80%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="vision" id="vision" data-header="dark" aria-labelledby="vision-title">
      <div className="vi-stage">
        <div className="vi-media" aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/vision-m.webp" width={900} height={1600} />
            <img
              src="/images/vision.webp"
              srcSet="/images/vision-1280.webp 1280w, /images/vision.webp 2400w"
              sizes="100vw"
              alt=""
              width={2400}
              height={1600}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <div className="vi-shade" aria-hidden="true" />
        <div className="wrap vi-in">
          <p className="label">
            <i>05</i>Our Vision
          </p>
          <h2 className="vi-title" id="vision-title">
            <span className="w">Every</span> <span className="w">Journey,</span>
            <br />
            <span className="w">More</span> <span className="w">Personal.</span>
          </h2>
          <div className="vi-body">
            <p>우리는 모든 여행자가 자신에게 어울리는 여행을 더 쉽게 발견할 수 있는 미래를 꿈꿉니다.</p>
            <p>
              여행자의 실제 경험과 기술을 연결하여 여행 정보의 가치를 높이고, 더 많은 사람이 자신의 취향에 맞는 여행을 선택할 수 있도록
              돕겠습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
