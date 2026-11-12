import { useEffect, useLayoutEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { ScrollTrigger } from './gsap';

/**
 * 경량 라우터 (History API, 추가 라이브러리 없음)
 *  - 실제 URL 변경(pushState) · 뒤로/앞으로 가기(popstate) · 페이지별 스크롤 위치 복원
 *  - 배포 서버는 모든 경로를 index.html로 돌려줘야 합니다 (vercel.json / public/_redirects)
 */
type NavKind = 'push' | 'pop';
let lastNav: NavKind = 'push';
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.addEventListener('popstate', () => {
    lastNav = 'pop';
    emit();
  });
}

export const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';

export function navigate(to: string) {
  const url = new URL(to, location.href);
  const path = normalize(url.pathname);
  if (path === normalize(location.pathname) && !url.hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  // 현재 페이지의 스크롤 위치를 기록해 두고 이동 (뒤로 가기 시 복원)
  history.replaceState({ ...(history.state ?? {}), scrollY: window.scrollY }, '');
  history.pushState({ scrollY: 0 }, '', path + url.hash);
  lastNav = 'push';
  emit();
}

export function usePath() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => normalize(location.pathname),
    () => '/',
  );
}

/** 경로가 바뀐 뒤 스크롤 처리: 새 페이지는 맨 위(또는 #해시), 뒤로 가기는 이전 위치 복원 */
export function useRouteScroll(path: string) {
  useLayoutEffect(() => {
    const kind = lastNav;
    const hash = location.hash.slice(1);
    // 새 페이지의 GSAP 트리거가 만들어진 뒤 위치를 다시 계산하고 스크롤
    const apply = () => {
      if (kind === 'pop') {
        window.scrollTo(0, (history.state as { scrollY?: number } | null)?.scrollY ?? 0);
      } else if (hash && document.getElementById(hash)) {
        document.getElementById(hash)!.scrollIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    };
    // ScrollTrigger는 refresh 때 이전 페이지의 스크롤 위치를 기억해 되돌리므로, 그 기록을 지우고 적용
    ScrollTrigger.clearScrollMemory('manual');
    apply();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      apply();
      // 이미지·폰트 로딩으로 높이가 바뀐 뒤에도 위치 유지
      requestAnimationFrame(apply);
    });
  }, [path]);
}

/** 페이지별 title / meta description */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  }, [title, description]);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; onNavigate?: () => void };

/** 내부 페이지 링크: 새 탭·수정키 클릭은 브라우저 기본 동작 유지 */
export function Link({ to, onNavigate, onClick, children, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onNavigate?.();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
