import { useRef } from 'react';
import { brandFilm } from '../config/media';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import SectionLabel from './ui/SectionLabel';
import SplitLines from './ui/SplitLines';
import VideoPlayer from './ui/VideoPlayer';

/* 영상 속 화면 문구 (음성 해설 대신 텍스트로 확인할 수 있도록 제공) */
const FILM_TEXT = [
  { t: '0:00', text: '이번 여행, 어디로 떠나지?' },
  { t: '0:08', text: 'TripAI — 여행의 고민을 설렘으로.' },
  { t: '0:12', text: '여행 예산 100만 원 · 여행 기간 4박 5일 · 여행 스타일 자연과 휴식 · 선호 활동 맛집 탐방 — 취향 분석' },
  { t: '0:20', text: '세계 지도 위에서 조건에 맞는 여행지를 탐색하고, 후보 여행지 카드를 비교' },
  { t: '0:26', text: '수많은 여행지 중, 나에게 맞는 여행을.' },
  { t: '0:30', text: 'TripAI 맞춤 여행 보고서 — 추천 여행지, 예산, 여행 스타일, 추천 일정, 여행 정보' },
  { t: '0:36', text: 'TripAI — 당신의 취향이 여행이 되는 순간.' },
];

/**
 * SECTION — BRAND FILM · Our First Journey
 * Anywhere가 개발하는 대표 프로젝트 TripAI를 소개합니다. (영상 내용은 원본 그대로)
 * 16:9 · 최대 너비 1100px · 사용자 조작으로 재생되는 40초 브랜드 영상.
 * 진입 모션(fade + scale)은 재생과 독립적으로 한 번만 실행됩니다.
 */
export default function BrandFilmSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.anyMotion, () => {
        gsap.from(q('.film-frame'), {
          y: 90,
          scale: 0.94,
          opacity: 0,
          duration: 1.6,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: q('.film-frame')[0], start: 'top 88%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="film" id="film" aria-labelledby="film-title">
      <div className="wrap film-head">
        <SectionLabel index="01" className="center">
          Project — TripAI
        </SectionLabel>
        <SplitLines id="film-title" className="h2-en film-title" lines={['Our First Journey.']} />
        <p className="film-sub" data-reveal="fade">
          Anywhere의 첫 번째 여정, TripAI.
        </p>
        <p className="body" data-reveal="fade">
          TripAI는 여행자의 취향과 조건을 바탕으로 개인에게 어울리는 여행지를 추천하는 AI 기반 여행 플랫폼입니다.
        </p>
      </div>

      <div className="wrap">
        <div className="film-frame">
          <VideoPlayer
            sources={[...brandFilm.sources]}
            poster={brandFilm.poster}
            title={brandFilm.title}
            durationHint={brandFilm.duration}
            ctaLabel="TripAI 필름 보기"
          />
        </div>
        <details className="film-text" data-reveal="fade">
          <summary>영상 속 문구 텍스트로 보기</summary>
          <ol>
            {FILM_TEXT.map((l) => (
              <li key={l.t}>
                <time>{l.t}</time>
                <span>{l.text}</span>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </section>
  );
}
