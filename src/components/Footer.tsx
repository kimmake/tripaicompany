import { useRef } from 'react';
import { service, site, motion } from '../config/site';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import { onAnchorClick } from '../lib/scroll';
import { Link } from '../lib/router';
import { ArrowUp } from './ui/Icons';

/**
 * FOOTER — "THE JOURNEY CONTINUES."
 * Our Vision의 저녁 하늘이 차분한 네이비로 내려앉으며 여정을 마무리하는 마지막 장면.
 *  - 상단 안개가 Vision 하단에 겹쳐 색 경계 없이 이어짐
 *  - 메시지 → 로고·서비스 → 하단 정보 순서로 등장 (위로 스크롤하면 되돌아감)
 * 확인되지 않은 사업자 정보·연락처·SNS는 표시하지 않습니다.
 */
export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      if (!motion.sectionMotion) return; // 섹션 애니메이션 끔 (config/site.ts)
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.anyMotion, () => {
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: { trigger: q('.ft-in')[0], start: 'top 82%', toggleActions: 'play none none reverse' },
          })
          .from(q('.ft-label'), { opacity: 0, y: 14, duration: 0.9 })
          .from(q('.ft-msg'), { opacity: 0, y: 30, duration: 1.3 }, 0.12)
          .from(q('.ft-sub'), { opacity: 0, y: 16, duration: 1 }, 0.4)
          .from(q('.ft-brand'), { opacity: 0, y: 18, duration: 1.1 }, 0.65)
          .from(q('.ft-base'), { opacity: 0, duration: 1 }, 0.9);
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="footer" data-header="dark">
      <div className="ft-haze" aria-hidden="true" />
      <div className="wrap ft-in">
        <p className="ft-label">Anywhere · Travel Tech Startup</p>
        <p className="ft-msg">Our journey continues.</p>
        <p className="ft-sub">우리의 여정은 계속됩니다.</p>

        <div className="ft-brand">
          <Link className="ft-logo" to="/" aria-label={`${site.name} 홈으로`}>
            <img
              src="/images/brand/anywhere-logo-800.webp"
              srcSet="/images/brand/anywhere-logo-800.webp 800w, /images/brand/anywhere-logo-1600.webp 1600w"
              sizes="220px"
              alt={site.name}
              width={1745}
              height={431}
              loading="lazy"
              decoding="async"
            />
          </Link>
          <Link className="ft-service" to="/tripai">
            <span>Core Service</span>
            {service.name}
          </Link>
        </div>

        <div className="ft-base">
          <span>
            © {year} {site.name}
          </span>
          <nav aria-label="푸터 메뉴" className="ft-links">
            <Link to="/about">About</Link>
            <Link to="/tripai">{service.name}</Link>
            <a href="#top" onClick={(e) => onAnchorClick(e)}>
              Back to top
              <ArrowUp />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
