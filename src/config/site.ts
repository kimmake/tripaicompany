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

/** Anywhere가 개발 중인 서비스 */
export const service = {
  name: 'TripAI',
  descriptor: 'AI 기반 맞춤형 여행 추천 서비스',
  slogan: '당신의 취향이 여행이 되는 순간.',
} as const;

/**
 * 섹션 노출 설정.
 * 현재 단계에서는 Hero와 Brand Film만 공개합니다. 나머지 섹션 컴포넌트는 코드에 그대로 보존되어 있으며
 * 값을 true로 바꾸면 다시 노출됩니다. (Hero는 항상 표시)
 */
export const sections = {
  about: false,
  brandFilm: true,
  problem: false,
  approach: false,
  technology: false,
  vision: false,
  contact: false,
} as const;

export type NavItem = { id: string; label: string; kicker?: string; note?: string };

/** 현재 공개된 섹션 기준 내비게이션 — TripAI는 Anywhere의 프로젝트로 표시 */
export const navItems: NavItem[] = [{ id: 'film', label: 'TripAI', kicker: 'Project', note: 'Anywhere의 첫 번째 여정' }];

/** 이전(TripAI 서비스 홈페이지) 구성의 내비게이션 — 섹션을 다시 노출할 때 참고용으로 보존 */
export const archivedNavItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'approach', label: 'Our Approach' },
  { id: 'technology', label: 'Technology' },
  { id: 'vision', label: 'Vision' },
  { id: 'contact', label: 'Contact' },
];
