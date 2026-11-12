import { useEffect, useRef, useState } from 'react';
import { heroLoop, brandFilm } from '../config/media';
import { useMediaQuery } from '../lib/useMediaQuery';
import { onAnchorClick } from '../lib/scroll';
import { Play } from './ui/Icons';

/**
 * Hero 우측 하단의 브랜드 필름 미리보기 창.
 * - 데스크톱 + 모션 허용: 짧은 무음 루프(muted · playsInline · loop) 자동 재생
 * - 자동 재생이 차단되거나, 모바일·모션 축소 환경: 포스터 이미지만 표시 (영상 파일을 받지 않음)
 * - 클릭 시 Brand Film 섹션으로 이동 (전체 영상은 그곳에서 사용자가 재생)
 */
export default function HeroFilmPreview() {
  const canAnimate = useMediaQuery('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!canAnimate || !v) return;
    v.muted = true; // React는 muted 속성을 DOM 속성으로만 반영하므로 명시적으로 설정
    const tryPlay = () => v.play().catch(() => setBlocked(true));
    // 화면에 보일 때만 재생해 CPU·배터리 사용을 줄임
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) void tryPlay();
      else v.pause();
    });
    io.observe(v);
    const onVis = () => (document.hidden ? v.pause() : void tryPlay());
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [canAnimate]);

  return (
    <a className="hero-film" href="#film" onClick={(e) => onAnchorClick(e)} aria-label="TripAI 브랜드 필름 보러 가기 (40초)">
      <span className="hf-media" aria-hidden="true">
        {canAnimate && !blocked ? (
          <video ref={videoRef} src={heroLoop.src} poster={heroLoop.poster} muted playsInline loop preload="auto" autoPlay disablePictureInPicture />
        ) : (
          <img src={heroLoop.poster} alt="" width={768} height={432} decoding="async" />
        )}
      </span>
      <span className="hf-meta" aria-hidden="true">
        <span className="hf-play">
          <Play />
        </span>
        <span className="hf-text">
          <b>Brand Film</b>
          <small>여행을 이해하는 새로운 방법 · 0:{String(brandFilm.duration).padStart(2, '0')}</small>
        </span>
      </span>
    </a>
  );
}
