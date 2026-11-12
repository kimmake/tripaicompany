import { Link } from '../../lib/router';
import { ArrowRight } from './Icons';

type Props = { to: string; children: React.ReactNode; tone?: 'dark' | 'light'; className?: string };

/** 얇은 테두리 + 화살표의 절제된 페이지 이동 버튼 */
export default function LinkButton({ to, children, tone = 'dark', className = '' }: Props) {
  return (
    <Link to={to} className={`link-btn ${tone === 'light' ? 'is-light' : ''} ${className}`}>
      <span>{children}</span>
      <ArrowRight />
    </Link>
  );
}
