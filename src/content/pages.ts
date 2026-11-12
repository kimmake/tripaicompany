/**
 * 상세 페이지 문구 (/about, /tripai, /team).
 * - 확인되지 않은 창업 일화·성과·출시 이력은 쓰지 않았습니다.
 * - '시작하게 된 배경'은 src/content/story.ts 의 임시 브랜드 스토리를 사용합니다.
 * - TripAI의 기능은 '개발 중·지향하는 방향'으로만 표현했습니다.
 */
export const aboutPage = {
  meta: {
    title: 'About Anywhere — 여행을 바라보는 새로운 시선',
    description: 'Anywhere는 AI 기술과 실제 여행 경험을 연결해, 각자에게 어울리는 여행을 더 쉽게 발견할 수 있도록 돕는 트래블테크 스타트업입니다.',
  },
  // 메인 About 헤드라인과 겹치지 않도록, 메인에서 쓰지 않는 문구를 제목으로 사용
  hero: { label: 'About Anywhere', title: ['같은 목적지라도,', '모두의 여행은 다르니까.'] },
  company: {
    label: 'Who We Are',
    title: 'Anywhere는 어떤 회사인가요',
    // 메인 About 본문 문장을 그대로 반복하지 않도록 회사 정체성만 짧게
    body: [
      'Anywhere는 여행을 준비하는 과정의 복잡함을 덜고, 사람마다 다른 여행을 존중하는 트래블테크 스타트업입니다.',
      '지금은 첫 번째 서비스이자 핵심 서비스인 TripAI를 개발하고 있습니다.',
    ],
  },
  values: {
    label: 'What We Value',
    title: '우리가 중요하게 생각하는 가치',
    items: [
      { en: 'Personalization', ko: '개인에게 맞는 여행', desc: '같은 목적지라도 사람마다 원하는 여행은 다르다는 점에서 출발합니다.' },
      { en: 'Authenticity', ko: '실제 여행 경험의 가치', desc: '여행자들의 실제 경험과 정보를 소중한 출발점으로 삼습니다.' },
      { en: 'Simplicity', ko: '여행 준비를 더 간단하게', desc: '예산, 일정, 취향을 고려해야 하는 복잡한 준비 과정을 덜어내고자 합니다.' },
      { en: 'Discovery', ko: '새로운 가능성의 발견', desc: '몰랐던 여행지와 경험을 발견하는 즐거움을 소중히 여깁니다.' },
    ],
  },
  // 메인 Our Vision(헤드라인·첫 문장)과 겹치지 않도록, 메인에 없는 문장만 사용
  vision: {
    label: 'Our Vision',
    title: '우리가 만들어가고 싶은 것',
    body: ['TripAI를 통해 여행자의 경험과 AI 기술을 연결하고, 여행을 계획하는 과정부터 새로운 목적지를 발견하는 순간까지 더 나은 선택을 돕겠습니다.'],
  },
} as const;

export const tripaiPage = {
  meta: {
    title: 'TripAI — Anywhere의 AI 맞춤형 여행 추천 서비스',
    description: 'TripAI는 여행자의 취향과 조건을 바탕으로 개인에게 어울리는 여행지를 추천하는 AI 기반 여행 플랫폼입니다. Anywhere가 개발하고 있습니다.',
  },
  // 메인 필름 설명과 겹치지 않도록 리드 문장 없이 슬로건만
  hero: { label: 'Service 01 — TripAI', title: ['당신의 취향이', '여행이 되는 순간.'] },
  intro: {
    label: 'About TripAI',
    title: '나에게 맞는 여행을 더 쉽게',
    body: [
      'TripAI는 한국인 여행자들의 실제 경험과 여행 정보를 바탕으로, 개인의 취향과 예산, 일정을 고려한 맞춤형 여행 추천 경험을 만들고자 합니다.',
      '유명한 여행지를 나열하기보다, 여행자 각자의 상황과 취향에 맞는 선택을 돕는 것을 목표로 합니다.',
    ],
  },
  // 실제 서비스(trip-ai-rho.vercel.app) 화면 캡처 — 2026년 11월. 데모 통계가 보이는 영역은 제외
  screens: {
    label: 'Service Preview',
    title: '지금의 TripAI 화면',
    items: [
      { src: '/images/tripai/screen-home.webp', w: 1600, h: 956, kind: 'wide', caption: '여행지 탐색 — 세계 지도와 검색' },
      { src: '/images/tripai/screen-intro.webp', w: 780, h: 1200, kind: 'phone', caption: '나에게 맞는 여행지 찾기' },
      { src: '/images/tripai/screen-q1.webp', w: 780, h: 1200, kind: 'phone', caption: '여행 취향 질문 (1/8)' },
    ],
    note: '실제 TripAI 서비스 화면을 캡처한 이미지입니다(2026년 11월 기준). 개발 중인 서비스로, 화면과 기능은 바뀔 수 있습니다.',
  },
  // 주요 기능과 추천 방식은 같은 3단계를 설명하므로 한 섹션으로 통합
  how: {
    label: 'How It Works',
    title: '주요 기능과 추천 방식',
    note: '아래 기능은 현재 개발 중이거나 지향하는 방향이며, 실제 제공 범위는 서비스 상황에 따라 달라질 수 있습니다.',
    steps: [
      { no: '01', en: 'Understand', ko: '취향과 조건을 이해합니다', desc: '여행 예산, 기간, 여행 스타일, 선호 활동 등을 바탕으로 여행 성향을 파악합니다.' },
      { no: '02', en: 'Discover', ko: '어울리는 여행지를 찾습니다', desc: '여행자의 조건과 여행 정보를 연결해 어울리는 여행지 후보를 탐색합니다.' },
      { no: '03', en: 'Recommend', ko: '맞춤 여행 보고서로 제안합니다', desc: '추천 여행지와 관련 정보를 개인에게 맞춘 여행 보고서 형태로 정리하는 것을 목표로 합니다.' },
    ],
  },
  experience: {
    label: 'Built on Real Experiences',
    title: '한국인 여행자의 경험을 바탕으로',
    body: [
      '여행 정보는 넘쳐나지만, 나에게 맞는 정보를 고르기는 어렵습니다.',
      'TripAI는 한국인 여행자들의 실제 여행 경험과 정보를 바탕으로, 더 믿을 수 있고 나에게 맞는 여행 정보를 제공하는 방향을 지향합니다.',
    ],
  },
  next: {
    label: "What's Next",
    title: '앞으로의 방향',
    // /about 여정 03과 같은 문장이 되지 않도록 서비스 관점으로 작성
    body: ['TripAI는 지금도 만들어지고 있는 서비스입니다. 여행자들이 직접 사용하며 남겨 주는 의견을 하나씩 반영해, 추천이 조금씩 더 나에게 맞아지도록 다듬어 가겠습니다.'],
  },
} as const;

export const teamPage = {
  meta: {
    title: 'Our Team — 여행의 새로운 경험을 만드는 사람들 | Anywhere',
    description: '서로 다른 생각과 시선을 모아, Anywhere의 첫 번째 서비스 TripAI를 만들어가는 Anywhere 팀을 소개합니다.',
  },
  // 메인 Our Team 문구(헤드라인·본문)와 겹치지 않도록
  hero: { label: 'Our Team', title: ['함께 만들어가는', '여정.'] },
  intro: {
    label: 'The Team',
    title: 'Anywhere 팀',
    body: ['사람마다 다른 여행의 취향과 경험에 주목하며, 더 나은 여행 선택을 돕는 서비스를 고민합니다.'],
  },
} as const;
