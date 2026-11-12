import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, MQ } from '../lib/gsap';
import { story } from '../content/story';
import { PlaneMark } from './ui/Logo';
import SectionLabel from './ui/SectionLabel';

/**
 * SECTION — OUR STORY & JOURNEY (Brand Film 다음, Our Vision 앞)
 * 하나의 여행 경로를 따라가는 에디토리얼 레이아웃.
 *  - 데스크톱: 왼쪽에 고정되는 대형 헤드라인, 오른쪽에 스토리와 여정 3단계
 *  - 얇은 경로선이 스크롤에 맞춰 이어지고(스크럽, 되감기 가능), 경로가 각 단계에 닿으면 제목·설명이 떠오름
 *  - 배경은 밝은 하늘(아이보리·블루그레이)에서 차분한 블루로 바뀌어 Our Vision의 저녁 하늘로 이어짐
 * 문구는 src/content/story.ts 에서 관리합니다.
 */
export default function StorySection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.anyMotion, () => {
        // 헤드라인 · 스토리 등장
        gsap
          .timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: q('.st-grid')[0], start: 'top 75%', toggleActions: 'play none none reverse' } })
          .from(q('.st-label'), { opacity: 0, y: 14, duration: 0.9 })
          .from(q('.st-title .ln'), { opacity: 0, y: 36, duration: 1.2, stagger: 0.12 }, 0.15)
          .from(q('.st-q'), { opacity: 0, y: 24, duration: 1.1 }, 0.45)
          .from(q('.st-body p:not(.st-q)'), { opacity: 0, y: 18, duration: 1, stagger: 0.12 }, 0.65);

        // 미세한 패럴랙스: 헤드라인 블록이 본문보다 조금 느리게
        gsap.fromTo(q('.st-head'), { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });

        // 경로선: 여정 목록을 지나가는 동안 위에서 아래로 그려짐
        const route = q('.st-route-fill')[0];
        gsap.fromTo(route, { clipPath: 'inset(0% 0% 100% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: q('.st-steps')[0], start: 'top 70%', end: 'bottom 55%', scrub: 0.4 },
        });

        // 각 단계: 경로가 닿을 즈음 등장, 위로 스크롤하면 되돌아감
        q('.st-step').forEach((el) => {
          gsap
            .timeline({ defaults: { ease: 'power3.out' }, scrollTrigger: { trigger: el, start: 'top 68%', toggleActions: 'play none none reverse' } })
            .to(el.querySelector('.st-dot'), { scale: 1, backgroundColor: 'var(--st-dot-on)', duration: 0.5 })
            .from(el.querySelector('.st-tag'), { opacity: 0, y: 10, duration: 0.7 }, 0)
            .from(el.querySelector('h3'), { opacity: 0, y: 18, duration: 0.9 }, 0.08)
            .from(el.querySelector('p'), { opacity: 0, y: 14, duration: 0.9 }, 0.18);
        });
        ScrollTrigger.refresh();
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="st" id="story" aria-labelledby="st-title">
      <div className="wrap st-grid">
        <div className="st-head">
          <SectionLabel className="st-label" reveal={false}>
            {story.label}
          </SectionLabel>
          <h2 className="st-title" id="st-title">
            {story.headline.map((l) => (
              <span className="ln" key={l}>
                {l}
              </span>
            ))}
          </h2>
        </div>

        <div className="st-main">
          <div className="st-body">
            <p className="st-q">{story.question}</p>
            {story.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ol className="st-steps" aria-label="Anywhere의 여정">
            <li className="st-route" aria-hidden="true">
              <span className="st-route-base" />
              <span className="st-route-fill" />
              <span className="st-start">
                <PlaneMark />
              </span>
            </li>
            {story.journey.map((s) => (
              <li className="st-step" key={s.no}>
                <span className="st-dot" aria-hidden="true" />
                <span className="st-tag">
                  {s.no} — {s.tag}
                </span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {/* 밝은 하늘이 옅은 안개처럼 Our Vision의 저녁 하늘 위로 풀리며 이어지는 구간 (Vision 상단에 겹침) */}
      <div className="st-tail" aria-hidden="true" />
    </section>
  );
}
