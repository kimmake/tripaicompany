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
  slogan: '당신의 취향이 여행이 되는 순간.',
} as const;

/**
 * 섹션 노출 설정. (Hero는 항상 표시)
 * 공개: Hero → (구름 통과) → About Anywhere → Brand Film(TripAI) → Our Vision
 * 이전 TripAI 서비스 홈페이지용 섹션(about, problem, approach, technology, vision, contact)은 코드에 보존되어 있으며
 * 값을 true로 바꾸면 다시 노출됩니다.
 */
export const sections = {
  /** Hero → 구름 속 → 구름 위 About Anywhere 로 이어지는 스크롤 여행 (About 앵커 id: anywhere) */
  skyJourney: true,
  /** 이전 About Anywhere 섹션 (타이포그래피형) — skyJourney로 대체되어 보존·숨김 */
  aboutAnywhere: false,
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
