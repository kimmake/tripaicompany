import { useRef, type CSSProperties } from 'react';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import SectionLabel from './ui/SectionLabel';
import SplitLines from './ui/SplitLines';

const PROBLEMS = [
  { key: 'overload', en: 'Information Overload', ko: '정보 과잉', desc: '너무 많은 여행 정보 속에서 필요한 정보를 찾기 어렵습니다.' },
  { key: 'personal', en: 'Lack of Personalization', ko: '개인화의 부족', desc: '인기 여행지가 반드시 나에게 맞는 여행지는 아닙니다.' },
  { key: 'planning', en: 'Planning Complexity', ko: '복잡한 여행 준비', desc: '예산, 일정, 이동, 취향까지 고려해야 하는 여행 준비는 복잡합니다.' },
] as const;

type Pos = { left: string; top: string; width?: string; fx: number; fy: number; r?: number; cx?: number; cy?: number };
const pos = (p: Pos): CSSProperties => ({ left: p.left, top: p.top, width: p.width });

/* 장면 1 — 정보 과잉: 출처가 다른 여행 정보 카드가 겹겹이 쌓임 (예시 문구) */
const INFO_CARDS: (Pos & { tag: string; title: string; img?: string; bars?: number[] })[] = [
  { left: '4%', top: '6%', fx: -220, fy: -120, r: -4, tag: '블로그 후기', title: '3박 4일 완벽 코스 총정리', img: '/images/d-paris.webp' },
  { left: '36%', top: '2%', fx: 40, fy: -220, r: 3, tag: 'SNS 인기 게시물', title: '요즘 뜨는 여행지 모음', bars: [90, 70] },
  { left: '66%', top: '8%', fx: 240, fy: -100, r: 5, tag: '영상', title: '브이로그 여행 코스', img: '/images/d-tokyo.webp' },
  { left: '14%', top: '38%', fx: -260, fy: 20, r: 2, tag: '여행 커뮤니티', title: '여기 꼭 가야 하나요?', bars: [100, 84, 52] },
  { left: '40%', top: '32%', fx: 0, fy: 60, r: -3, tag: '숙소', title: '가성비 숙소 비교', img: '/images/d-resort.webp' },
  { left: '68%', top: '44%', fx: 260, fy: 40, r: -6, tag: '리스트', title: '꼭 가봐야 할 명소 30곳', bars: [80, 92, 60] },
  { left: '2%', top: '68%', fx: -200, fy: 200, r: -2, tag: '맛집', title: '현지 맛집 리스트', bars: [74, 90] },
  { left: '34%', top: '66%', fx: -20, fy: 240, r: 4, tag: '여행 팁', title: '환전 · 교통 정리', img: '/images/d-eiffel.webp' },
  { left: '66%', top: '74%', fx: 220, fy: 200, r: 2, tag: '날씨', title: '월별 여행 날씨', bars: [64, 88] },
];

/* 장면 2 — 인기 여행지와 나의 취향이 연결되지 않음 */
const TILES: (Pos & { img: string })[] = [
  { left: '6%', top: '2%', fx: -120, fy: -60, img: '/images/d-tokyo.webp' },
  { left: '70%', top: '0%', fx: 120, fy: -60, img: '/images/d-eiffel.webp' },
  { left: '2%', top: '58%', fx: -140, fy: 60, img: '/images/d-resort.webp' },
  { left: '74%', top: '58%', fx: 140, fy: 60, img: '/images/d-paris.webp' },
];

/* 장면 3 — 일정·예산·이동·준비물이 한 화면에 몰림 */
const PANELS: (Pos & { id: string })[] = [
  { id: 'schedule', left: '2%', top: '4%', width: '46%', fx: -200, fy: -80, r: -3, cx: 160, cy: 160 },
  { id: 'budget', left: '50%', top: '0%', width: '44%', fx: 200, fy: -100, r: 4, cx: -120, cy: 180 },
  { id: 'move', left: '8%', top: '46%', width: '40%', fx: -220, fy: 120, r: 3, cx: 140, cy: -60 },
  { id: 'check', left: '48%', top: '42%', width: '38%', fx: 220, fy: 60, r: -5, cx: -80, cy: -20 },
  { id: 'memo', left: '24%', top: '70%', width: '46%', fx: 0, fy: 220, r: 2, cx: 40, cy: -160 },
];

function PanelBody({ id }: { id: string }) {
  switch (id) {
    case 'schedule':
      return (
        <>
          <h4>일정</h4>
          <div className="tl">
            {[70, 95, 50, 82].map((w, i) => (
              <span key={i} style={{ display: 'contents' }}>
                <span>Day {i + 1}</span>
                <i style={{ width: `${w}%` }} />
              </span>
            ))}
          </div>
        </>
      );
    case 'budget':
      return (
        <>
          <h4>예산</h4>
          <div className="bud">
            {[['항공', 86], ['숙소', 70], ['식비', 44], ['교통', 30]].map(([k, w]) => (
              <div key={k}>
                <span>{k}</span>
                <i style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </>
      );
    case 'move':
      return (
        <>
          <h4>이동 수단</h4>
          <div className="chips">{['항공', '기차', '버스', '렌터카', '도보'].map((c) => <span key={c}>{c}</span>)}</div>
        </>
      );
    case 'check':
      return (
        <>
          <h4>체크리스트</h4>
          <div className="checks">{['여권 · 비자', '숙소 예약', '환전', '여행자 보험'].map((c) => <span key={c}>{c}</span>)}</div>
        </>
      );
    default:
      return (
        <>
          <h4>취향 메모</h4>
          <div className="chips">{['조용한 곳', '로컬 카페', '바다 전망', '?'].map((c) => <span key={c}>{c}</span>)}</div>
        </>
      );
  }
}

/**
 * SECTION 03 — THE PROBLEM
 * 데스크톱: 고정된 무대 위에서 세 가지 문제 장면이 스크롤에 따라 전환되고, 마지막에 한 줄로 정리됩니다.
 * 모바일·모션 축소: 정적인 3단 구성.
 */
export default function ProblemSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: q('.ps-track')[0], start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        });
        const D = (el: Element, k: string) => Number((el as HTMLElement).dataset[k] ?? 0);

        // 왼쪽 텍스트 전환
        const [t1, t2, t3, t4] = q('.ps-t');
        tl.set({}, {}, 100) // 전체 길이 = 100
          .to(t1, { opacity: 0, y: -24, duration: 6 }, 26)
          .fromTo(t2, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 6 }, 30)
          .to(t2, { opacity: 0, y: -24, duration: 6 }, 58)
          .fromTo(t3, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 6 }, 62)
          .to(t3, { opacity: 0, y: -24, duration: 4 }, 84)
          .fromTo(t4, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 6 }, 88);
        const bars = q('.ps-prog i');
        tl.fromTo(bars[0], { scaleX: 0 }, { scaleX: 1, duration: 30 }, 0)
          .fromTo(bars[1], { scaleX: 0 }, { scaleX: 1, duration: 30 }, 32)
          .fromTo(bars[2], { scaleX: 0 }, { scaleX: 1, duration: 24 }, 64);

        // 장면 1 — 카드가 사방에서 몰려와 겹침
        q('.icard').forEach((el, i) => {
          tl.fromTo(
            el,
            { opacity: 0, x: D(el, 'fx'), y: D(el, 'fy'), rotation: 0 },
            { opacity: 1, x: 0, y: 0, rotation: D(el, 'r'), duration: 10, ease: 'power2.out' },
            i * 0.6,
          ).to(el, { opacity: 0, x: D(el, 'fx') * -0.25, y: D(el, 'fy') * -0.25, scale: 0.9, duration: 7 }, 26);
        });

        // 장면 2 — 나의 취향과 인기 여행지 사이의 끊어진 연결
        tl.fromTo(q('.me'), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 6 }, 31).to(q('.me'), { opacity: 0, scale: 0.9, duration: 6 }, 58);
        q('.dtile').forEach((el, i) => {
          tl.fromTo(el, { opacity: 0, x: D(el, 'fx'), y: D(el, 'fy'), scale: 0.9 }, { opacity: 1, x: 0, y: 0, scale: 1, duration: 7, ease: 'power2.out' }, 32 + i * 0.6)
            .to(el, { x: D(el, 'fx') * -0.35, y: D(el, 'fy') * -0.35, opacity: 0.85, duration: 10 }, 50)
            .to(el, { opacity: 0, duration: 4 }, 60);
        });
        tl.to(q('.ps-links'), { opacity: 1, duration: 6 }, 40).to(q('.ps-links'), { opacity: 0, duration: 6 }, 58);

        // 장면 3 — 준비 요소가 한 화면에 몰렸다가, 한 점으로 정리
        q('.panel').forEach((el, i) => {
          tl.fromTo(
            el,
            { opacity: 0, x: D(el, 'fx'), y: D(el, 'fy'), rotation: 0 },
            { opacity: 1, x: 0, y: 0, rotation: D(el, 'r'), duration: 8, ease: 'power2.out' },
            62 + i * 0.5,
          ).to(el, { opacity: 0, x: D(el, 'cx'), y: D(el, 'cy'), scale: 0.12, duration: 8, ease: 'power2.in' }, 85);
        });
        tl.to(q('.settle'), { opacity: 1, duration: 5 }, 88).fromTo(q('.settle .ln'), { scaleX: 0 }, { scaleX: 1, duration: 9, ease: 'power2.inOut' }, 89);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="problem" id="problem" aria-labelledby="problem-title">
      <div className="wrap problem-head">
        <SectionLabel index="03">The Problem</SectionLabel>
        <SplitLines id="problem-title" className="h2" lines={['정보는 넘쳐나지만,', '나에게 맞는 여행은 찾기 어렵습니다.']} />
      </div>

      {/* 데스크톱 스토리텔링 */}
      <div className="story ps-track">
        <div className="ps-stage">
          <div className="wrap ps-grid">
            <div className="ps-text">
              {PROBLEMS.map((p, i) => (
                <div className="ps-t" key={p.key}>
                  <span className="num">
                    {String(i + 1).padStart(2, '0')} — {p.en}
                  </span>
                  <h3 className="ptitle kr">{p.ko}</h3>
                  <p className="pdesc">{p.desc}</p>
                </div>
              ))}
              <div className="ps-t">
                <span className="num">Next</span>
                <h3 className="ptitle kr">
                  흩어진 선택을,
                  <br />
                  하나의 흐름으로.
                </h3>
                <p className="pdesc">TripAI는 이 복잡한 과정을 더 단순하게 정리하는 방법을 고민합니다.</p>
              </div>
              <div className="ps-prog" aria-hidden="true">
                <span><i /></span>
                <span><i /></span>
                <span><i /></span>
              </div>
            </div>

            <div className="ps-vis" aria-hidden="true">
              <div className="scene">
                {INFO_CARDS.map((c) => (
                  <div className="icard" key={c.title} style={pos(c)} data-fx={c.fx} data-fy={c.fy} data-r={c.r}>
                    {c.img && <img src={c.img} alt="" width={640} height={480} loading="lazy" decoding="async" />}
                    <small>{c.tag}</small>
                    <p>{c.title}</p>
                    {c.bars && (
                      <div className="bars">
                        {c.bars.map((w, i) => (
                          <i key={i} style={{ width: `${w}%` }} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="scene">
                <svg className="links ps-links" viewBox="0 0 100 85" preserveAspectRatio="none">
                  <path d="M50 42 L22 18" />
                  <path d="M50 42 L80 16" />
                  <path d="M50 42 L16 66" />
                  <path d="M50 42 L84 68" />
                </svg>
                {TILES.map((t) => (
                  <div className="dtile" key={t.img} style={pos(t)} data-fx={t.fx} data-fy={t.fy}>
                    <img src={t.img} alt="" width={640} height={480} loading="lazy" decoding="async" />
                    <span>인기</span>
                  </div>
                ))}
                <div className="me">
                  <small>MY TASTE</small>
                  <p>조용한 자연, 느린 산책</p>
                </div>
              </div>

              <div className="scene">
                {PANELS.map((p) => (
                  <div className="panel" key={p.id} style={pos(p)} data-fx={p.fx} data-fy={p.fy} data-r={p.r} data-cx={p.cx} data-cy={p.cy}>
                    <PanelBody id={p.id} />
                  </div>
                ))}
                <div className="settle">
                  <span className="ln" />
                  <p>이 모든 선택을, 더 단순하게.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일·모션 축소용 정적 구성 */}
      <div className="simple">
        <div className="wrap">
          <ol>
            {PROBLEMS.map((p, i) => (
              <li key={p.key} data-reveal="fade">
                <div className="mini" aria-hidden="true">
                  {i === 0 && (
                    <>
                      <div className="icard" style={{ left: '8%', top: '14%', width: '52%', rotate: '-4deg' }}>
                        <small>블로그 후기</small>
                        <p>3박 4일 코스 총정리</p>
                      </div>
                      <div className="icard" style={{ left: '40%', top: '36%', width: '52%', rotate: '3deg' }}>
                        <small>SNS</small>
                        <p>요즘 뜨는 여행지</p>
                      </div>
                    </>
                  )}
                  {i === 1 && (
                    <div className="me" style={{ width: '64%', padding: 14 }}>
                      <small>MY TASTE</small>
                      <p>조용한 자연, 느린 산책</p>
                    </div>
                  )}
                  {i === 2 && (
                    <div className="panel" style={{ left: '8%', top: '16%', width: '84%' }}>
                      <h4>일정 · 예산 · 이동</h4>
                      <div className="chips">{['Day 1–4', '항공', '숙소', '환전'].map((c) => <span key={c}>{c}</span>)}</div>
                    </div>
                  )}
                </div>
                <span className="num">
                  {String(i + 1).padStart(2, '0')} — {p.en}
                </span>
                <h3 className="ptitle kr">{p.ko}</h3>
                <p className="pdesc">{p.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
