import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Fullscreen, Pause, Play, Replay, Volume } from './Icons';

export type VideoSource = { src: string; type?: string; media?: string };

type Props = {
  sources: VideoSource[];
  poster: string;
  /** 접근성용 영상 이름 */
  title: string;
  /** 메타데이터 로딩 전에 표시할 길이(초) */
  durationHint?: number;
  /** 재생 전 버튼 옆 문구 */
  ctaLabel?: string;
};

const fmt = (t: number) => {
  if (!Number.isFinite(t) || t < 0) t = 0;
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};
const fmtKo = (t: number) => `${Math.floor(t / 60)}분 ${Math.floor(t % 60)}초`;

type FsVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitDisplayingFullscreen?: boolean };

/**
 * 브랜드 필름 플레이어
 * - 사용자 조작으로만 재생 (autoplay 없음), preload="metadata"
 * - playsInline: 모바일에서 자동 전체 화면 전환 방지
 * - 재생/일시정지, 탐색, 음소거·볼륨, 전체 화면, 키보드(Space·K·←→·M·F)
 * - 스크롤 애니메이션과 독립적으로 동작하며 스크롤 위치를 변경하지 않습니다.
 */
export default function VideoPlayer({ sources, poster, title, durationHint = 0, ctaLabel = '영상 재생' }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<FsVideo>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const pendingFocus = useRef(false);

  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(durationHint);
  const [isFs, setIsFs] = useState(false);
  const [chrome, setChrome] = useState(true);
  // 화면 가까이 오기 전에는 영상 소스를 붙이지 않아 불필요한 다운로드를 막습니다 (포스터만 표시).
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const play = useCallback(async () => {
    const v = videoRef.current;
    if (!v) return;
    setError(false);
    // 중앙 버튼이 사라져도 키보드 포커스가 플레이어 안에 남도록 컨트롤 바로 이동
    const focusWasInside = wrapRef.current?.contains(document.activeElement) ?? false;
    try {
      if (v.ended) v.currentTime = 0;
      await v.play();
      setStarted(true);
      pendingFocus.current = focusWasInside;
    } catch {
      // 재생이 거부되면(예: 네트워크·코덱 문제) 포스터와 재생 버튼을 유지합니다.
      setError(true);
    }
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) void play();
    else v.pause();
  }, [play]);

  const seekBy = (d: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, v.currentTime + d), v.duration || duration);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.volume === 0) v.volume = 0.6;
  };

  const toggleFullscreen = useCallback(async () => {
    const wrap = wrapRef.current;
    const v = videoRef.current;
    if (!wrap || !v) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (wrap.requestFullscreen) await wrap.requestFullscreen();
      else v.webkitEnterFullscreen?.(); // iOS Safari: 동영상 요소 전체 화면만 지원
    } catch {
      v.webkitEnterFullscreen?.();
    }
  }, []);

  // 중앙 버튼이 사라진 뒤 렌더링된 컨트롤 바로 포커스 이동
  useEffect(() => {
    if (!pendingFocus.current || !started || ended) return;
    pendingFocus.current = false;
    wrapRef.current?.querySelector<HTMLElement>('.player-bar .pc')?.focus({ preventScroll: true });
  }, [started, ended, playing]);

  useEffect(() => {
    const onFs = () => setIsFs(document.fullscreenElement === wrapRef.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // 재생 중 일정 시간 조작이 없으면 컨트롤 숨김
  const wake = useCallback(() => {
    setChrome(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      const v = videoRef.current;
      const focusInside = wrapRef.current?.contains(document.activeElement) && document.activeElement !== v;
      if (v && !v.paused && !focusInside) setChrome(false);
    }, 2600);
  }, []);
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);
  useEffect(() => {
    if (playing) wake();
    else setChrome(true);
  }, [playing, wake]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const onRange = target instanceof HTMLInputElement && target.type === 'range';
    const onButton = target instanceof HTMLButtonElement;
    switch (e.key) {
      case ' ':
      case 'k':
      case 'K':
        if (onButton && e.key === ' ') return; // 버튼 기본 동작 유지
        if (onRange && e.key === ' ') return;
        e.preventDefault();
        toggle();
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        if (onRange) return;
        e.preventDefault();
        seekBy(e.key === 'ArrowLeft' ? -5 : 5);
        break;
      case 'm':
      case 'M':
        toggleMute();
        break;
      case 'f':
      case 'F':
        void toggleFullscreen();
        break;
      default:
        return;
    }
    wake();
  };

  const progress = duration > 0 ? (time / duration) * 100 : 0;
  const volPct = muted ? 0 : volume * 100;

  return (
    <div
      ref={wrapRef}
      className={`player${started ? ' is-started' : ''}${playing ? ' is-playing' : ''}${chrome ? '' : ' is-idle'}${isFs ? ' is-fs' : ''}`}
      role="region"
      aria-label={`${title} 플레이어`}
      onKeyDown={onKeyDown}
      onPointerMove={started ? wake : undefined}
      onFocus={started ? wake : undefined}
    >
      <video
        ref={videoRef}
        className="player-video"
        poster={poster}
        preload="metadata"
        playsInline
        aria-label={title}
        onClick={started ? toggle : undefined}
        onDoubleClick={started ? () => void toggleFullscreen() : undefined}
        onPlay={() => {
          setError(false);
          setPlaying(true);
          setEnded(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setEnded(true);
        }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onVolumeChange={(e) => {
          setMuted(e.currentTarget.muted);
          setVolume(e.currentTarget.volume);
        }}
        onError={(e) => {
          // <source> 후보 중 하나의 실패는 무시하고, 실제 미디어 오류만 표시
          if (e.currentTarget.error) setError(true);
        }}
      >
        {near &&
          sources.map((s) => <source key={s.src} src={s.src} type={s.type ?? 'video/mp4'} media={s.media} />)}
      </video>

      {/* 재생 전 · 종료 후 중앙 버튼 */}
      {(!started || ended) && (
        <button type="button" className="player-big" onClick={() => void play()} aria-label={ended ? `${title} 다시 보기` : `${title} 재생`}>
          <span className="pb-circle">{ended ? <Replay /> : <Play />}</span>
          <span className="pb-label">
            <b>{ended ? '다시 보기' : ctaLabel}</b>
            <small>{fmt(duration)}</small>
          </span>
        </button>
      )}

      {waiting && playing && <span className="player-spin" aria-hidden="true" />}

      {started && (
        <div className="player-bar">
          <button type="button" className="pc" onClick={toggle} aria-label={playing ? '일시정지' : '재생'}>
            {playing ? <Pause /> : <Play />}
          </button>
          <span className="pt" aria-hidden="true">
            {fmt(time)} <i>/</i> {fmt(duration)}
          </span>
          <input
            className="range seek"
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            aria-label="재생 위치"
            aria-valuetext={`${fmtKo(time)} / ${fmtKo(duration)}`}
            style={{ '--p': `${progress}%` } as React.CSSProperties}
            onChange={(e) => {
              const v = videoRef.current;
              if (v) v.currentTime = Number(e.target.value);
            }}
          />
          <div className="pvol">
            <button type="button" className="pc" onClick={toggleMute} aria-label={muted ? '음소거 해제' : '음소거'} aria-pressed={muted}>
              <Volume muted={muted || volume === 0} />
            </button>
            <input
              className="range vol"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              aria-label="볼륨"
              aria-valuetext={`${Math.round(volPct)}%`}
              style={{ '--p': `${volPct}%` } as React.CSSProperties}
              onChange={(e) => {
                const v = videoRef.current;
                if (!v) return;
                v.volume = Number(e.target.value);
                v.muted = v.volume === 0;
              }}
            />
          </div>
          <button type="button" className="pc" onClick={() => void toggleFullscreen()} aria-label={isFs ? '전체 화면 종료' : '전체 화면'}>
            <Fullscreen exit={isFs} />
          </button>
        </div>
      )}

      {error && (
        <p className="player-err" role="alert">
          영상을 재생할 수 없습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}
    </div>
  );
}
