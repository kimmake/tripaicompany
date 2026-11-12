/** 브랜드 영상 파일 (public/videos). 원본: 1920×1080, 30fps, 40초, H.264/AAC */
export const brandFilm = {
  title: 'TripAI 브랜드 필름',
  duration: 40,
  sources: [
    // 모바일: 720p (약 2MB) — 데이터 사용량 절감
    { src: '/videos/tripai-brand-film-720p.mp4', type: 'video/mp4', media: '(max-width: 767px)' },
    // 데스크톱: 원본 1080p (약 12MB, fast-start)
    { src: '/videos/tripai-brand-film-1080p.mp4', type: 'video/mp4' },
  ],
  poster: '/videos/brand-film-poster.webp',
  posterSmall: '/videos/brand-film-poster-960.webp',
} as const;

/** Hero 미리보기 루프: 원본 11.0–18.4초 구간(취향 카드 연결 장면), 768×432, 무음, 약 80KB */
export const heroLoop = {
  src: '/videos/tripai-hero-loop.mp4',
  poster: '/videos/hero-loop-poster.webp',
} as const;
