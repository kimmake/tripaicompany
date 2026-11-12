type LogoProps = {
  href?: string;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

/** TripAI 로고: 종이비행기 심볼 + 워드마크 (브랜드 필름의 심볼과 동일한 모티프) */
export default function Logo({ href = '#top', label = 'TripAI 홈으로', onClick }: LogoProps) {
  return (
    <a className="logo" href={href} aria-label={label} onClick={onClick}>
      <PlaneMark />
      <span aria-hidden="true">
        Trip<b>AI</b>
      </span>
    </a>
  );
}

/** 종이비행기 심볼 (24×24, stroke) */
export function PlaneMark({ className = 'plane' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M21.5 2.5 2.8 10.2l7.6 3.4 3.4 7.6z" />
      <path d="M21.5 2.5 10.4 13.6" />
    </svg>
  );
}
