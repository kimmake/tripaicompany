import { useRef } from 'react';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import SectionLabel from './ui/SectionLabel';
import SplitLines from './ui/SplitLines';
import { PlaneMark } from './ui/Logo';
import { onAnchorClick } from '../lib/scroll';

const STEPS = [
  { k: 'STEP 01', en: 'Understand', ko: '여행자를 이해합니다.', key: '예산 · 여행 기간 · 여행 취향 파악', desc: '여행 예산, 기간, 취향, 선호 활동 등을 바탕으로 개인의 여행 성향을 파악합니다.' },
  { k: 'STEP 02', en: 'Discover', ko: '가능성을 발견합니다.', key: '조건에 맞는 여행지 탐색', desc: '여행자의 조건과 여행 정보를 연결하여 어울리는 여행지를 탐색합니다.' },
  { k: 'STEP 03', en: 'Recommend', ko: '나에게 맞는 여행을 제안합니다.', key: '맞춤형 여행지와 여행 정보 제공', desc: '추천 여행지와 관련 정보를 개인 맞춤형 여행 보고서로 제공합니다.' },
] as const;

/* 아래 값은 서비스 작동 원리를 설명하기 위한 '예시' 입력입니다. 브랜드 필름 속 예시와 같은 조건을 사용해 흐름을 이어갑니다. */
const PREFS = [
  { key: '여행 예산', val: '100만 원', left: '6%', top: '10%', fx: -60, fy: -40, cx: 150, cy: 150, icon: 'wallet' },
  { key: '여행 기간', val: '4박 5일', left: '58%', top: '7%', fx: 60, fy: -40, cx: -150, cy: 160, icon: 'calendar' },
  { key: '여행 스타일', val: '자연과 휴식', left: '4%', top: '70%', fx: -60, fy: 40, cx: 160, cy: -150, icon: 'leaf' },
  { key: '선호 활동', val: '맛집 탐방', left: '60%', top: '74%', fx: 60, fy: 40, cx: -160, cy: -170, icon: 'fork' },
] as const;

const NODES = [
  { img: '/images/d-turq.webp', label: '호수 · 산책로', left: '6%', top: '6%', cx: 120, cy: 160 },
  { img: '/images/d-resort.webp', label: '리조트 · 휴식', left: '72%', top: '6%', cx: -120, cy: 160 },
  { img: '/images/d-peaks.webp', label: '산악 · 트레킹', left: '6%', top: '62%', cx: 120, cy: -120 },
  { img: '/images/d-lake.webp', label: '호숫가 · 고요함', left: '72%', top: '62%', cx: -120, cy: -120 },
] as const;

const RECS = [
  { img: '/images/d-peaks.webp', title: '추천 B · 산과 숲의 휴식', tags: ['자연', '예산 범위'], tx: -108, r: -6, on: false },
  { img: '/images/d-turq.webp', title: '추천 C · 호수와 산책길', tags: ['휴식', '일정 적합'], tx: 108, r: 6, on: false },
  { img: '/images/d-resort.webp', title: '추천 A · 해변 휴양과 미식', tags: ['자연과 휴식', '맛집 탐방'], tx: 0, r: 0, on: true },
] as const;

function PrefIcon({ name }: { name: string }) {
  const d: Record<string, React.ReactNode> = {
    wallet: (<><rect x="2.5" y="5" width="15" height="10" rx="2" /><path d="M2.5 8.5h15" /></>),
    calendar: (<><rect x="3" y="4" width="14" height="13" rx="2" /><path d="M3 8h14M7 2.5v3M13 2.5v3" /></>),
    leaf: (<><path d="M4 16c0-7 4.5-11 12-12 0 7.5-4 12-11 12" /><path d="M4 16l7-7" /></>),
    fork: (<><path d="M6 2.5v6a2 2 0 0 0 4 0v-6M8 8.5v9" /><path d="M14 17.5v-15c2 1 3 3.5 3 6.5h-3" /></>),
  };
  return <svg viewBox="0 0 20 20" aria-hidden="true">{d[name]}</svg>;
}

/**
 * SECTION 04 — OUR APPROACH (핵심 인터랙티브 모션그래픽)
 * 취향 카드 → 중앙으로 모여 성향 파악 → 여행지 정보와 연결 → 추천 카드 펼침 → 맞춤형 여행 보고서.
 * 실제 분석이 아니라 작동 원리를 설명하는 2D 연출입니다.
 */
export default function ApproachSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktopMotion, () => {
        const D = (el: Element, k: string) => Number((el as HTMLElement).dataset[k] ?? 0);
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: q('.ap-track')[0], start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        });
        tl.set({}, {}, 100);

        // 단계 텍스트 & 진행 바
        const [s1, s2, s3] = q('.step');
        tl.fromTo(s1, { opacity: 1 }, { opacity: 0.3, duration: 5 }, 34)
          .fromTo(s2, { opacity: 0.3 }, { opacity: 1, duration: 5 }, 34)
          .to(s2, { opacity: 0.3, duration: 5 }, 60)
          .fromTo(s3, { opacity: 0.3 }, { opacity: 1, duration: 5 }, 60)
          .fromTo(q('.steps .bar'), { scaleY: 0 }, { scaleY: 1, duration: 100 }, 0);

        // 1. 취향 카드 등장 → 하나씩 확인(체크) → 2. 종이비행기 중심으로 모임
        q('.pref').forEach((el, i) => {
          const ck = el.querySelector('.ck i');
          tl.fromTo(el, { opacity: 0, x: D(el, 'fx'), y: D(el, 'fy') }, { opacity: 1, x: 0, y: 0, duration: 7, ease: 'power2.out' }, i * 0.8)
            .fromTo(ck, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.5, ease: 'back.out(2)' }, 8 + i * 2)
            .to(el, { opacity: 0, x: D(el, 'cx'), y: D(el, 'cy'), scale: 0.3, duration: 11, ease: 'power2.in' }, 17 + i * 0.4);
        });
        tl.fromTo(q('.core'), { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 8, ease: 'back.out(1.4)' }, 22)
          .to(q('.core'), { scale: 0.62, duration: 8, ease: 'power2.inOut' }, 36)
          .to(q('.core'), { opacity: 0, scale: 0.5, duration: 6 }, 54);

        // 3. 여행지 정보와 연결
        tl.to(q('.ap-links'), { opacity: 1, duration: 3 }, 37)
          .fromTo(q('.ap-links path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 9, stagger: 0.6 }, 38)
          .to(q('.ap-links'), { opacity: 0, duration: 5 }, 54);
        q('.node').forEach((el, i) => {
          tl.fromTo(el, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 7, ease: 'power2.out' }, 40 + i * 0.8)
            .to(el, { opacity: 0, x: D(el, 'cx'), y: D(el, 'cy'), scale: 0.6, duration: 6, ease: 'power2.in' }, 54);
        });

        // 4. 추천 카드 펼침
        q('.rec').forEach((el) => {
          tl.fromTo(
            el,
            { opacity: 0, y: 40, scale: 0.9, xPercent: 0, rotation: 0 },
            { opacity: 1, y: 0, scale: 1, xPercent: D(el, 'tx'), rotation: D(el, 'r'), duration: 8, ease: 'power3.out' },
            56,
          ).to(el, { opacity: 0, y: -10, xPercent: 0, rotation: 0, scale: 0.7, duration: 8, ease: 'power2.in' }, 74);
        });

        // 5. 맞춤형 여행 보고서
        tl.fromTo(q('.report'), { opacity: 0, y: 60, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 9, ease: 'power3.out' }, 77)
          .fromTo(q('.report .rrow'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 6, stagger: 1.2 }, 82);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="approach" id="approach" aria-labelledby="approach-title">
      <div className="wrap ap-head">
        <div className="l">
          <SectionLabel index="04">Our Approach</SectionLabel>
          <SplitLines id="approach-title" className="h2" lines={['복잡한 선택은 간단하게.', '여행의 가능성은 더 넓게.']} />
        </div>
        <div className="r ap-lead" data-reveal="fade">
          <p className="body">
            브랜드 필름 속 추천 과정을 세 단계로 풀어 설명합니다. 여행자를 이해하는 것에서 시작해, 여행 정보와 연결하고, 개인에게 맞는 여행을
            제안합니다.
          </p>
          <a className="textlink" href="#film" onClick={(e) => onAnchorClick(e)}>
            <PlaneMark className="tl-plane" />
            브랜드 필름 다시 보기
          </a>
        </div>
      </div>

      <div className="story ap-track">
        <div className="ap-stage">
          <div className="wrap ap-grid">
            <ol className="steps">
              <li className="bar" aria-hidden="true" role="presentation" />
              {STEPS.map((s) => (
                <li className="step" key={s.k}>
                  <span className="k">
                    {s.k} · {s.en}
                  </span>
                  <h3>{s.ko}</h3>
                  <span className="kw">{s.key}</span>
                  <p>{s.desc}</p>
                </li>
              ))}
            </ol>

            <div className="ap-vis" aria-hidden="true">
              <div className="grid-bg" />
              <span className="ap-tag">ILLUSTRATION</span>

              {PREFS.map((p) => (
                <div className="pref" key={p.key} style={{ left: p.left, top: p.top }} data-fx={p.fx} data-fy={p.fy} data-cx={p.cx} data-cy={p.cy}>
                  <span className="ic"><PrefIcon name={p.icon} /></span>
                  <span>
                    <small>{p.key}</small>
                    <b>{p.val}</b>
                  </span>
                  <span className="ck">
                    <i>
                      <svg viewBox="0 0 12 12">
                        <path d="M3 6.2l2 2 4-4.4" />
                      </svg>
                    </i>
                  </span>
                </div>
              ))}

              <div className="core">
                <span className="core-plane">
                  <PlaneMark />
                </span>
                <small>TRAVEL PROFILE</small>
                <p>여행 성향 이해</p>
                <div className="t">
                  <span>자연</span>
                  <span>휴식</span>
                  <span>미식</span>
                </div>
              </div>

              <svg className="ap-links" viewBox="0 0 1120 1000" preserveAspectRatio="none">
                <path pathLength={1} d="M560 500 C 400 400, 300 300, 220 200" />
                <path pathLength={1} d="M560 500 C 720 400, 820 300, 900 200" />
                <path pathLength={1} d="M560 500 C 400 620, 300 720, 220 800" />
                <path pathLength={1} d="M560 500 C 720 620, 820 720, 900 800" />
              </svg>
              {NODES.map((n) => (
                <div className="node" key={n.label} style={{ left: n.left, top: n.top }} data-cx={n.cx} data-cy={n.cy}>
                  <img src={n.img} alt="" width={640} height={480} loading="lazy" decoding="async" />
                  <span>{n.label}</span>
                </div>
              ))}

              {RECS.map((r) => (
                <div className={`rec${r.on ? ' on' : ''}`} key={r.title} data-tx={r.tx} data-r={r.r}>
                  {r.on && <span className="badge">나에게 맞는 여행지</span>}
                  <img src={r.img} alt="" width={640} height={480} loading="lazy" decoding="async" />
                  <h5>{r.title}</h5>
                  <div className="chips">{r.tags.map((t) => <span key={t}>{t}</span>)}</div>
                </div>
              ))}

              <div className="report">
                <header>
                  <div>
                    <small>
                      <PlaneMark className="rp-plane" />
                      MY TRAVEL REPORT
                    </small>
                    <h4>나의 맞춤 여행 보고서</h4>
                  </div>
                  <span>예시</span>
                </header>
                <div className="rrow">
                  <b>추천 여행지</b>
                  <div className="rdest">
                    <img src="/images/d-resort.webp" alt="" width={640} height={480} loading="lazy" decoding="async" />
                    <p>추천 A · 해변 휴양과 미식</p>
                  </div>
                </div>
                <div className="rrow">
                  <b>추천 이유</b>
                  <div className="chips"><span>자연과 휴식</span><span>맛집 탐방</span><span>예산 100만 원</span></div>
                </div>
                <div className="rrow">
                  <b>일정 구성</b>
                  <div className="days">{['D1', 'D2', 'D3', 'D4', 'D5'].map((d) => <i key={d}>{d}</i>)}</div>
                </div>
                <div className="rrow">
                  <b>예산 가이드</b>
                  <div className="bud">
                    <div><span>숙소</span><i style={{ width: '62%', background: 'var(--color-sky)', opacity: 1 }} /></div>
                    <div><span>이동</span><i style={{ width: '38%' }} /></div>
                  </div>
                </div>
              </div>

              <span className="ap-note">서비스 작동 원리를 설명하기 위한 예시 화면입니다.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="simple">
        <div className="wrap">
          <ol>
            {STEPS.map((s, i) => (
              <li key={s.k} data-reveal="fade">
                <div className="mini" aria-hidden="true">
                  {i === 0 && (
                    <div className="chips" style={{ position: 'absolute', inset: 0, alignContent: 'center', justifyContent: 'center', padding: 16 }}>
                      {['100만 원', '4박 5일', '자연과 휴식', '맛집 탐방'].map((c) => <span key={c} style={{ background: '#fff' }}>{c}</span>)}
                    </div>
                  )}
                  {i === 1 && (
                    <div style={{ position: 'absolute', inset: 14, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
                      {['/images/d-resort.webp', '/images/d-turq.webp', '/images/d-peaks.webp'].map((src) => (
                        <img key={src} src={src} alt="" width={640} height={480} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                      ))}
                    </div>
                  )}
                  {i === 2 && (
                    <div style={{ position: 'absolute', inset: 14, background: '#fff', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <span className="num" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <PlaneMark className="rp-plane" />
                        MY TRAVEL REPORT
                      </span>
                      <div className="bars">{[80, 64, 90, 48].map((w) => <i key={w} style={{ width: `${w}%` }} />)}</div>
                    </div>
                  )}
                </div>
                <span className="num">{s.k} — {s.en}</span>
                <h3 className="ptitle kr">{s.ko}</h3>
                <span className="kw">{s.key}</span>
                <p className="pdesc">{s.desc}</p>
              </li>
            ))}
          </ol>
          <p className="body" style={{ marginTop: 32, fontSize: 13 }}>위 화면은 서비스 작동 원리를 설명하기 위한 예시입니다.</p>
        </div>
      </div>
    </section>
  );
}
