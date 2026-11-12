import { navItems, site } from '../config/site';
import { onAnchorClick } from '../lib/scroll';
import Logo from './ui/Logo';
import { ArrowUp } from './ui/Icons';

/** SECTION 08 — FOOTER (확인되지 않은 사업자 정보는 기재하지 않습니다) */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="ft-top">
          <div className="ft-brand">
            <Logo label="TripAI 맨 위로" onClick={(e) => onAnchorClick(e)} />
            <p>{site.slogan}</p>
          </div>
          <nav aria-label="푸터 메뉴">
            <ul className="ft-nav">
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} onClick={(e) => onAnchorClick(e)}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="ft-word" aria-hidden="true">
          Travel Beyond
        </p>
        <div className="ft-bottom">
          <span>Copyright © TripAI.</span>
          <a href="#top" onClick={(e) => onAnchorClick(e)}>
            Back to top
            <ArrowUp />
          </a>
        </div>
      </div>
    </footer>
  );
}
