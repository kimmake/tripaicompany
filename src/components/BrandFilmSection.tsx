import { useRef } from 'react';
import { brandFilm } from '../config/media';
import { service } from '../config/site';
import { ArrowRight } from './ui/Icons';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import SectionLabel from './ui/SectionLabel';
import SplitLines from './ui/SplitLines';
import VideoPlayer from './ui/VideoPlayer';


/**
 * SECTION — BRAND FILM · Our First Journey
 * Anywhere의 첫 번째 핵심 서비스 TripAI를 소개합니다. (영상 파일·플레이어는 원본 그대로)
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
        <SectionLabel className="center">Service 01 — TripAI</SectionLabel>
        <SplitLines id="film-title" className="h2-en film-title" lines={['Our First Journey.']} />
        <p className="film-sub" data-reveal="fade">
          Anywhere의 첫 번째 서비스, TripAI.
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
        <div className="film-cta" data-reveal="fade">
          <a className="cta-btn" href={service.url} target="_blank" rel="noopener noreferrer">
            <span>{service.name} 바로가기</span>
            <ArrowRight />
            <span className="sr-only">(새 창에서 열림)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
