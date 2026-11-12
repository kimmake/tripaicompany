/**
 * 사이트 운영 설정.
 * 확인되지 않은 연락처를 임의로 노출하지 않기 위해, 값은 환경 변수(.env)로만 주입합니다.
 * 값이 비어 있으면 해당 요소는 화면에 표시되지 않습니다.
 */
const clean = (v: string | undefined) => {
  const t = (v ?? '').trim();
  return t.length > 0 ? t : null;
};

/** 회사(상위 브랜드) */
export const site = {
  name: 'Anywhere',
  /** 문의 이메일 — 설정 전에는 null (노출하지 않음) */
  contactEmail: clean(import.meta.env.VITE_CONTACT_EMAIL),
  /** 문의 폼 전송 엔드포인트 (JSON POST) — 설정 전에는 null (전송하지 않음) */
  contactEndpoint: clean(import.meta.env.VITE_CONTACT_ENDPOINT),
} as const;

/** Anywhere의 첫 번째이자 핵심 서비스 */
export const service = {
  name: 'TripAI',
  descriptor: 'AI 기반 맞춤형 여행 추천 서비스',
  /** TripAI 서비스 주소 (사용자 제공) */
  url: 'https://trip-ai-rho.vercel.app/',
  slogan: '당신의 취향이 여행이 되는 순간.',
} as const;

/**
 * 섹션 노출 설정. (Hero는 항상 표시)
 * 공개: Hero → (구름 통과) → About Anywhere → Brand Film(TripAI) → Our Story & Journey → Our Vision
 * 이전 TripAI 서비스 홈페이지용 섹션(about, problem, approach, technology, vision, contact)은 코드에 보존되어 있으며
 * 값을 true로 바꾸면 다시 노출됩니다.
 */
export const sections = {
  /** Hero → 구름 속 → 구름 위 About Anywhere 로 이어지는 스크롤 여행 (About 앵커 id: anywhere) */
  skyJourney: true,
  /** 이전 About Anywhere 섹션 (타이포그래피형) — skyJourney로 대체되어 보존·숨김 */
  aboutAnywhere: false,
  /** Our Story & Journey — Anywhere의 이야기와 여정 (id: story, 문구: src/content/story.ts) */
  /** 메인에서는 숨김 — /about 페이지에서 사용 */
  story: false,
  /** 메인 Our Team 소개 (자세한 내용은 /team) */
  teamTeaser: false,
  /** Our Vision — 기업 비전 (id: our-vision) */
  visionAnywhere: true,
  about: false,
  brandFilm: true,
  problem: false,
  approach: false,
  technology: false,
  vision: false,
  contact: false,
} as const;

export type NavItem = { id: string; label: string; kicker?: string; note?: string };
export type PageNavItem = { to: string; label: string; note?: string };

/** 상단 내비게이션 — 실제 페이지 이동 */
export const pageNav: PageNavItem[] = [
  { to: '/', label: 'Home', note: '비행하는 하늘에서 시작하는 Anywhere' },
  { to: '/about', label: 'About', note: 'Anywhere 소개' },
  { to: '/tripai', label: 'TripAI', note: 'Anywhere의 첫 번째 서비스' },
  // 실제 팀 정보가 준비되면 다시 노출: { to: '/team', label: 'Team', note: '여행의 새로운 경험을 만드는 사람들' },
];

/** 현재 공개된 섹션 기준 내비게이션 */
export const navItems: NavItem[] = [
  { id: 'anywhere', label: 'About', note: 'Anywhere 소개' },
  { id: 'film', label: 'TripAI', note: 'Anywhere의 첫 번째 서비스' },
  { id: 'our-vision', label: 'Vision', note: '우리가 그리는 여행의 미래' },
];

/** 이전(TripAI 서비스 홈페이지) 구성의 내비게이션 — 섹션을 다시 노출할 때 참고용으로 보존 */
export const archivedNavItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'approach', label: 'Our Approach' },
  { id: 'technology', label: 'Technology' },
  { id: 'vision', label: 'Vision' },
  { id: 'contact', label: 'Contact' },
];

/**
 * 모션 설정.
 * Hero(비행하는 하늘)와 Hero → 구름 → About 전환은 항상 동작합니다.
 * 그 외 섹션의 스크롤 등장·패럴랙스·경로 드로잉 애니메이션은 sectionMotion 으로 켜고 끕니다.
 * (false: 모든 내용이 처음부터 그대로 보임. 버튼·링크의 hover 효과는 유지)
 */
/** 이미지 사용 설정 */
export const visuals = {
  /** Our Vision 배경 풍경 사진 (false = 사진 없이 네이비 그라데이션. 사진 코드는 보존) */
  visionPhoto: false,
} as const;

export const motion = {
  sectionMotion: false,
} as const;
