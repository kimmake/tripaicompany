type LogoProps = {
  href?: string;
  label?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

/** TripAI 로고: 원(여정) 위의 점(목적지) — 경로 모티프의 시작점 */
export default function Logo({ href = '#top', label = 'TripAI 홈으로', onClick }: LogoProps) {
  return (
    <a className="logo" href={href} aria-label={label} onClick={onClick}>
      <LogoMark />
      <span aria-hidden="true">
        Trip<b>AI</b>
      </span>
    </a>
  );
}

export function LogoMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle className="o" cx="12" cy="12" r="9" />
      <circle className="d" cx="18.4" cy="5.6" r="2.6" />
    </svg>
  );
}
