import { useRef } from 'react';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import { service, site } from '../config/site';
import { PlaneMark } from './ui/Logo';
import SectionLabel from './ui/SectionLabel';

/**
 * SECTION — ABOUT ANYWHERE (기업 소개)
 * 타이포그래피 중심. 라벨 → 헤드라인(줄 단위) → 본문(시간차) → 마지막 문장 강조 순서로 한 번 등장합니다.
 */
export default function AnywhereAboutSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.anyMotion, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'expo.out' },
          scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
        });
        tl.from(q('.aa-label'), { opacity: 0, y: 16, duration: 1 })
          .from(q('.aa-title .mask > span'), { yPercent: 105, opacity: 0, duration: 1.4, stagger: 0.12 }, 0.2)
          .from(q('.aa-body p:not(.aa-key)'), { opacity: 0, y: 22, duration: 1.2, stagger: 0.14 }, 0.75)
          .from(q('.aa-facts li'), { opacity: 0, y: 14, duration: 1, stagger: 0.1 }, 0.9)
          .from(q('.aa-key'), { opacity: 0, y: 18, duration: 1.2 }, 1.35)
          .from(q('.aa-key .aa-plane'), { opacity: 0, x: -10, y: 8, duration: 1, ease: 'power3.out' }, 1.6)
          .fromTo(q('.aa-key .aa-u'), { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' }, 1.75);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="aa" id="anywhere" aria-labelledby="aa-title">
      <div className="wrap aa-grid">
        <SectionLabel className="aa-label" reveal={false}>
          About Anywhere
        </SectionLabel>

        <h2 className="aa-title" id="aa-title">
          <span className="mask">
            <span>여행의 새로운 가능성을</span>
          </span>
          <span className="mask">
            <span>만들어갑니다.</span>
          </span>
        </h2>

        <dl className="aa-facts" aria-label="Anywhere와 TripAI">
          <div>
            <dt>{site.name}</dt>
            <dd>기업 브랜드 · AI 트래블테크 스타트업</dd>
          </div>
          <div>
            <dt>{service.name}</dt>
            <dd>첫 번째 핵심 서비스 · {service.descriptor}</dd>
          </div>
        </dl>

        <div className="aa-body">
          <p>Anywhere는 AI 기술을 활용해 여행자의 선택을 더 쉽고 개인화된 경험으로 바꾸고자 하는 트래블테크 스타트업입니다.</p>
          <p>
            우리는 사람마다 원하는 여행이 다르다는 점에 주목합니다. 여행자의 취향과 예산, 일정, 그리고 실제 여행 경험을 연결하여 누구나
            자신에게 어울리는 여행을 발견할 수 있도록 돕고자 합니다.
          </p>
          <p className="aa-key">
            <PlaneMark className="aa-plane" />
            <span>
              그 첫 번째 서비스가 바로{' '}
              <strong>
                TripAI
                <span className="aa-u" aria-hidden="true" />
              </strong>
              입니다.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
