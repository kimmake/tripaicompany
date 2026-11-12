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
  hero: { label: 'About Anywhere', title: ['여행을 바라보는', '새로운 시선.'], lead: '같은 목적지라도, 모두의 여행은 다르니까.' },
  company: {
    label: 'Who We Are',
    title: 'Anywhere는 어떤 회사인가요',
    body: [
      'Anywhere는 AI 기술과 실제 여행 경험을 연결해, 각자에게 어울리는 여행을 더 쉽게 발견할 수 있도록 돕는 트래블테크 스타트업입니다.',
      '첫 번째 서비스이자 핵심 서비스인 TripAI를 개발하고 있습니다.',
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
} as const;

export const tripaiPage = {
  meta: {
    title: 'TripAI — Anywhere의 AI 맞춤형 여행 추천 서비스',
    description: 'TripAI는 여행자의 취향과 조건을 바탕으로 개인에게 어울리는 여행지를 추천하는 AI 기반 여행 플랫폼입니다. Anywhere가 개발하고 있습니다.',
  },
  hero: { label: 'Service 01 — TripAI', title: ['당신의 취향이', '여행이 되는 순간.'], lead: '여행자의 취향과 조건을 바탕으로, 개인에게 어울리는 여행지를 추천하는 AI 기반 여행 플랫폼입니다.' },
  intro: {
    label: 'About TripAI',
    title: '나에게 맞는 여행을 더 쉽게',
    body: [
      'TripAI는 한국인 여행자들의 실제 경험과 여행 정보를 바탕으로, 개인의 취향과 예산, 일정을 고려한 맞춤형 여행 추천 경험을 만들고자 합니다.',
      '유명한 여행지를 나열하기보다, 여행자 각자의 상황과 취향에 맞는 선택을 돕는 것을 목표로 합니다.',
    ],
  },
  features: {
    label: 'Key Features',
    title: '개발하고 있는 주요 기능',
    note: '아래 기능은 현재 개발 중이거나 지향하는 방향이며, 실제 제공 범위는 서비스 상황에 따라 달라질 수 있습니다.',
    items: [
      { title: '취향과 조건 입력', desc: '여행 예산, 기간, 여행 스타일, 선호 활동 등 여행자의 조건을 바탕으로 여행 성향을 파악합니다.' },
      { title: '여행지 탐색', desc: '여행자의 조건과 여행 정보를 연결해 어울리는 여행지 후보를 찾습니다.' },
      { title: '맞춤 여행 보고서', desc: '추천 여행지와 관련 정보를 개인에게 맞춘 여행 보고서 형태로 정리하는 것을 목표로 합니다.' },
    ],
  },
  how: {
    label: 'How It Works',
    title: '개인 맞춤형 추천 방식',
    steps: [
      { no: '01', en: 'Understand', ko: '여행자를 이해합니다', desc: '예산, 여행 기간, 여행 취향을 파악합니다.' },
      { no: '02', en: 'Discover', ko: '가능성을 발견합니다', desc: '조건에 맞는 여행지를 탐색합니다.' },
      { no: '03', en: 'Recommend', ko: '나에게 맞는 여행을 제안합니다', desc: '맞춤형 여행지와 여행 정보를 제공합니다.' },
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
    body: ['실제 사용자의 의견을 바탕으로 추천 경험을 개선하고, 더 편리하고 개인화된 여행 서비스를 만들어가고자 합니다.'],
  },
} as const;

export const teamPage = {
  meta: {
    title: 'Our Team — 여행의 새로운 경험을 만드는 사람들 | Anywhere',
    description: '서로 다른 생각과 시선을 모아, Anywhere의 첫 번째 서비스 TripAI를 만들어가는 Anywhere 팀을 소개합니다.',
  },
  hero: { label: 'Our Team', title: ['여행의 새로운 경험을', '만드는 사람들.'], lead: '서로 다른 생각과 시선을 모아, Anywhere의 첫 번째 서비스 TripAI를 만들어갑니다.' },
  intro: {
    label: 'The Team',
    title: '함께 만들어가는 여정',
    body: [
      'Anywhere 팀은 여행을 바라보는 서로 다른 생각과 시선을 모아 TripAI를 만들고 있습니다.',
      '사람마다 다른 여행의 취향과 경험에 주목하며, 더 나은 여행 선택을 돕는 서비스를 고민합니다.',
    ],
  },
} as const;
