type LogoProps = {
  href?: string;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

/** Anywhere 워드마크 (회사 로고). 공식 로고 파일이 정해지면 이 컴포넌트만 교체하면 됩니다. */
export default function Logo({ href = '#top', label = 'Anywhere 홈으로', onClick }: LogoProps) {
  return (
    <a className="logo logo-anywhere" href={href} aria-label={label} onClick={onClick}>
      <span aria-hidden="true">Anywhere</span>
    </a>
  );
}

/** TripAI 로고 (서비스 로고: 종이비행기 심볼 + 워드마크) — 서비스 관련 영역에서 사용 */
export function TripAILogo({ href = '#film', label = 'TripAI', onClick }: LogoProps) {
  return (
    <a className="logo" href={href} aria-label={label} onClick={onClick}>
      <PlaneMark />
      <span aria-hidden="true">
        Trip<b>AI</b>
      </span>
    </a>
  );
}

/** 종이비행기 심볼 (24×24, stroke) — TripAI의 심볼 */
export function PlaneMark({ className = 'plane' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21.5 2.5 2.8 10.2l7.6 3.4 3.4 7.6z" />
      <path d="M21.5 2.5 10.4 13.6" />
    </svg>
  );
}
