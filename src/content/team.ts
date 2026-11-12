/**
 * 팀원 정보 — 실제 정보가 확정되면 아래 배열에 추가하세요.
 * 비어 있으면 /team 페이지는 팀 공통 소개만 표시합니다 (빈 카드나 가상 인물을 만들지 않음).
 *
 * 예시:
 * { name: '이름', role: '역할', focus: '담당 분야', bio: '짧은 자기소개', photo: '/images/team/파일명.webp' }
 */
export type TeamMember = {
  name: string;
  role: string;
  focus?: string;
  bio?: string;
  /** public/ 아래 경로 (선택) */
  photo?: string;
};

export const teamMembers: TeamMember[] = [];
