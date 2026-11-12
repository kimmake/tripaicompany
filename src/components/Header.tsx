import { useEffect, useRef, useState } from 'react';
import { navItems, sections, service, site } from '../config/site';
import { onAnchorClick } from '../lib/scroll';
import { gsap, useGSAP, MQ } from '../lib/gsap';
import Logo from './ui/Logo';
import { ArrowRight } from './ui/Icons';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // 스크롤 시 투명 → 고정형 헤더
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 현재 보고 있는 섹션 표시
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // 딥 네이비·풍경 섹션 위에서는 헤더도 어두운 톤으로 전환
  useEffect(() => {
    const darkSections = Array.from(document.querySelectorAll<HTMLElement>('[data-header="dark"]'));
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setDark(visible.size > 0);
      },
      { rootMargin: '0px 0px -92% 0px' },
    );
    darkSections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // 모바일 메뉴: 스크롤 잠금, Esc 닫기, 포커스 이동
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>('ul a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a, button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      burgerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // 히어로 인트로에 맞춰 헤더가 늦게 등장
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.anyMotion, () => {
        gsap.from(headerRef.current, { opacity: 0, y: -12, duration: 1.2, delay: 1.7, ease: 'expo.out' });
      });
    },
    { scope: headerRef },
  );

  useGSAP(() => {
    if (!open || !panelRef.current) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.anyMotion, () => {
      gsap.from(panelRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      gsap.from(panelRef.current!.querySelectorAll('li'), {
        y: 24,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'expo.out',
        delay: 0.08,
      });
    });
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header ref={headerRef} className={`hdr${scrolled ? ' is-scrolled' : ''}${dark ? ' is-dark' : ''}`}>
        <div className="hdr-bg" aria-hidden="true" />
        <div className="wrap hdr-in">
          <Logo onClick={(e) => onAnchorClick(e)} />
          <nav className="nav" aria-label="주요 메뉴">
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={active === n.id ? 'true' : undefined}
                onClick={(e) => onAnchorClick(e)}
              >
                {n.kicker && <span className="nav-k">{n.kicker}</span>}
                {n.label}
              </a>
            ))}
          </nav>
          {sections.contact && (
            <a className="cta" href="#contact" onClick={(e) => onAnchorClick(e)}>
              <span>Get in touch</span>
              <ArrowRight />
            </a>
          )}
          <button
            ref={burgerRef}
            className="burger"
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <path d="M2 6h14M2 12h14" />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <div ref={panelRef} id="mobile-menu" className="mnav" role="dialog" aria-modal="true" aria-label="메뉴">
          <div className="mnav-top">
            <Logo onClick={(e) => onAnchorClick(e, close)} />
            <button className="burger" style={{ display: 'inline-flex' }} type="button" aria-label="메뉴 닫기" onClick={close}>
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <path d="M4 4l10 10M14 4L4 14" />
              </svg>
            </button>
          </div>
          <ul>
            {navItems.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => onAnchorClick(e, close)}>
                  <small>{String(i + 1).padStart(2, '0')}</small>
                  <span className="mnav-label">
                    {n.label}
                    {n.note && <em>{n.note}</em>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p>
            {site.name}는 AI 트래블테크 스타트업이며, {service.name}는 그 첫 번째 핵심 서비스입니다.
          </p>
        </div>
      )}
    </>
  );
}
