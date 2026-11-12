import { useRef } from 'react';
import { motion } from '../config/site';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import SectionLabel from './ui/SectionLabel';

/**
 * SECTION — OUR VISION (기업 비전)
 * 구름 위의 새벽 풍경. 스크롤에 따라 배경이 천천히 내려앉고(스크럽), 문구는 한 번 부드럽게 떠오릅니다.
 * Hero의 연출(문자 등장·종이비행기)과 겹치지 않도록 줄 단위 페이드와 배경 스크럽만 사용합니다.
 */
/** brief: 메인에서는 첫 문장만 표시 (전문은 /about) */
export default function AnywhereVisionSection({ brief = false }: { brief?: boolean }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!motion.sectionMotion) return; // 섹션 애니메이션 끔 (config/site.ts)
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.anyMotion, () => {
        // 배경: 스크롤 진행에 따라 천천히 이동하며 아주 약간 멀어짐
        gsap.fromTo(
          q('.av-media'),
          { yPercent: -7, scale: 1.08 },
          {
            yPercent: 7,
            scale: 1.02,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
        // 문구: 라벨 → 헤드라인 줄 → 본문
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: q('.av-in')[0], start: 'top 75%', once: true },
          })
          .from(q('.av-label'), { opacity: 0, y: 14, duration: 1 })
          .from(q('.av-title .ln'), { opacity: 0, y: 46, duration: 1.6, stagger: 0.18 }, 0.2)
          .from(q('.av-body p'), { opacity: 0, y: 20, duration: 1.3, stagger: 0.15 }, 0.9);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="av" id="our-vision" data-header="dark" aria-labelledby="av-title">
      <div className="av-media" aria-hidden="true">
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
      <div className="av-shade" aria-hidden="true" />
      <div className="wrap av-in">
        <SectionLabel className="av-label" reveal={false}>
          Our Vision
        </SectionLabel>
        <h2 className="av-title" id="av-title">
          <span className="ln">모든 여행이,</span>
          <span className="ln">
            조금 더 <br className="br-m" />
            나다워질 수 있도록.
          </span>
        </h2>
        <div className="av-body">
          <p>우리는 여행자가 수많은 정보 속에서 고민하기보다, 자신에게 맞는 여행을 더 쉽게 발견할 수 있는 미래를 만들어가고자 합니다.</p>
          {!brief && (
            <p>
              TripAI를 통해 여행자의 경험과 AI 기술을 연결하고, 여행을 계획하는 과정부터 새로운 목적지를 발견하는 순간까지 더 나은 선택을
              돕겠습니다.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
