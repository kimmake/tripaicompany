const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 섹션으로 부드럽게 이동하고 주소의 해시를 갱신합니다. */
export function scrollToId(id: string) {
  const target = id === 'top' ? document.body : document.getElementById(id);
  if (!target) return;
  const top = id === 'top' ? 0 : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: prefersReduced() ? 'auto' : 'smooth' });
  history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`);
  // 키보드 사용자를 위해 포커스를 섹션으로 이동 (스크롤은 이미 처리됨)
  if (id !== 'top') {
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }
}

/** <a href="#id"> 클릭 핸들러 */
export function onAnchorClick(e: React.MouseEvent<HTMLAnchorElement>, after?: () => void) {
  const href = e.currentTarget.getAttribute('href') ?? '';
  if (!href.startsWith('#')) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  after?.();
  // 메뉴가 닫히며 스크롤 잠금이 해제된 뒤 이동
  requestAnimationFrame(() => scrollToId(href.slice(1) || 'top'));
}
