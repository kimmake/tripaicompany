import { useMemo, useRef } from 'react';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import SectionLabel from './ui/SectionLabel';
import SplitLines from './ui/SplitLines';

const TOPICS = [
  { n: '01', en: 'Personalized Recommendation', ko: '여행자의 취향과 조건을 고려하는 개인화 추천.' },
  { n: '02', en: 'Experience-Based Information', ko: '한국인 여행자들의 실제 경험과 여행 정보를 활용하는 정보 탐색.' },
  { n: '03', en: 'Intelligent Travel Planning', ko: '여행 준비 과정에서 필요한 선택을 더 효율적으로 돕는 AI 기반 접근.' },
] as const;

type Pt = [number, number];
/** 세 갈래의 정보 흐름이 하나의 경로로 모이는 곡선 (viewBox 1200 × 440) */
const CURVES: [Pt, Pt, Pt, Pt][] = [
  [[40, 80], [360, 40], [520, 210], [760, 220]],
  [[40, 220], [340, 220], [520, 220], [760, 220]],
  [[40, 360], [360, 400], [520, 230], [760, 220]],
];
const ROUTE = 'M760 220 C 880 220, 960 150, 1060 180 S 1140 220, 1170 220';

const bezier = (c: [Pt, Pt, Pt, Pt], t: number): Pt => {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * c[0][i] + 3 * u * u * t * c[1][i] + 3 * u * t * t * c[2][i] + t * t * t * c[3][i];
  return [f(0), f(1)];
};

function buildDots() {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return CURVES.flatMap((c, ci) =>
    Array.from({ length: 16 }, (_, i) => {
      const [x, y] = bezier(c, (i + 0.5) / 16);
      return {
        id: `${ci}-${i}`,
        white: (i + ci) % 3 === 0,
        left: `${(x / 12).toFixed(2)}%`,
        top: `${(y / 4.4).toFixed(2)}%`,
        dx: Math.round((rnd() - 0.5) * 520),
        dy: Math.round((rnd() - 0.5) * 300),
      };
    }),
  );
}

/**
 * SECTION 05 — TECHNOLOGY
 * 딥 네이비로 전환. 흩어진 데이터 점이 세 갈래 흐름으로 정렬되고 하나의 경로로 이어지는 추상 데이터 모션.
 * (특정 알고리즘·모델·수치를 표현하지 않습니다.)
 */
export default function TechnologySection() {
  const root = useRef<HTMLElement>(null);
  const dots = useMemo(buildDots, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.anyMotion, () => {
        // 섹션 간 배경 전환: 네이비 패널이 화면 가득 펼쳐짐
        gsap.fromTo(
          q('.tech-panel'),
          { clipPath: 'inset(0% 3.5% 0% 3.5% round 36px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 0px)',
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 25%', scrub: true },
          },
        );

        const flow = q('.flow')[0];
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: flow, start: 'top 90%', end: 'center 45%', scrub: 0.8 },
        });
        q('.dot').forEach((el, i) => {
          tl.fromTo(
            el,
            { opacity: 0, x: Number((el as HTMLElement).dataset.dx), y: Number((el as HTMLElement).dataset.dy) },
            { opacity: 1, x: 0, y: 0, duration: 1, ease: 'power2.out' },
            (i % 16) * 0.012,
          );
        });
        tl.fromTo(q('.flow .cv'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.06 }, 0.45)
          .fromTo(q('.flow .route'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.4 }, 0.9)
          .from(q('.flab, .fend'), { opacity: 0, duration: 0.3, stagger: 0.05 }, 1);

        gsap.from(q('.topic'), {
          y: 36,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: q('.topics')[0], start: 'top 85%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="tech" id="technology" data-header="dark" aria-labelledby="tech-title">
      <div className="tech-panel">
        <div className="wrap">
          <div className="tech-head">
            <div className="l">
              <SectionLabel index="04">Technology</SectionLabel>
              <SplitLines id="tech-title" className="h2-en" lines={['Technology that', 'understands your journey.']} />
            </div>
            <p className="r" data-reveal="fade">
              기술은 여행을 더 인간답게 만들기 위해 존재합니다.
            </p>
          </div>

          <div className="flow" role="img" aria-label="취향과 조건, 여행자의 실제 경험, 여행 정보가 하나의 흐름으로 연결되어 맞춤 제안으로 이어지는 개념도">
            <svg viewBox="0 0 1200 440" preserveAspectRatio="none" aria-hidden="true">
              {CURVES.map((c, i) => (
                <path
                  key={i}
                  className="cv"
                  pathLength={1}
                  d={`M${c[0].join(' ')} C ${c[1].join(' ')}, ${c[2].join(' ')}, ${c[3].join(' ')}`}
                />
              ))}
              <path className="route" pathLength={1} d={ROUTE} />
              <path className="run" pathLength={1} d={ROUTE} />
            </svg>
            {dots.map((d) => (
              <span
                key={d.id}
                className={`dot${d.white ? ' w' : ''}`}
                style={{ left: d.left, top: d.top }}
                data-dx={d.dx}
                data-dy={d.dy}
                aria-hidden="true"
              />
            ))}
            <span className="flab" style={{ left: '3.3%', top: '18%' }} aria-hidden="true">취향과 조건</span>
            <span className="flab" style={{ left: '3.3%', top: '50%' }} aria-hidden="true">여행자의 실제 경험</span>
            <span className="flab" style={{ left: '3.3%', top: '82%' }} aria-hidden="true">여행 정보</span>
            <span className="fend" aria-hidden="true">
              <i />
              <span>맞춤 제안</span>
            </span>
          </div>

          <ol className="topics">
            {TOPICS.map((t) => (
              <li className="topic" key={t.n}>
                <span className="num">{t.n}</span>
                <h3>{t.en}</h3>
                <p>{t.ko}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
