/**
 * 사이트 운영 설정.
 * 확인되지 않은 연락처를 임의로 노출하지 않기 위해, 값은 환경 변수(.env)로만 주입합니다.
 * 값이 비어 있으면 해당 요소는 화면에 표시되지 않습니다.
 */
const clean = (v: string | undefined) => {
  const t = (v ?? '').trim();
  return t.length > 0 ? t : null;
};

export const site = {
  name: 'TripAI',
  slogan: '당신의 취향이 여행이 되는 순간.',
  message: 'Travel Beyond Expectations.',
  /** 문의 이메일 — 설정 전에는 null (노출하지 않음) */
  contactEmail: clean(import.meta.env.VITE_CONTACT_EMAIL),
  /** 문의 폼 전송 엔드포인트 (JSON POST) — 설정 전에는 null (전송하지 않음) */
  contactEndpoint: clean(import.meta.env.VITE_CONTACT_ENDPOINT),
} as const;

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'approach', label: 'Our Approach' },
  { id: 'technology', label: 'Technology' },
  { id: 'vision', label: 'Vision' },
  { id: 'contact', label: 'Contact' },
] as const;
