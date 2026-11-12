import { gsap, useGSAP, MQ } from './gsap';

/**
 * data-reveal 속성으로 선언된 요소에 섹션 성격에 맞는 진입 모션을 연결합니다.
 *  - "lines": 헤드라인 줄 마스크 리빌 (stagger)
 *  - "fade" : 짧은 거리의 opacity + translateY
 *  - "clip" : 이미지 프레임 clip-path 리빌 + 내부 이미지 패럴랙스
 * 모션 축소 설정에서는 아무 것도 실행하지 않아 최종 상태 그대로 보입니다.
 */
export function useReveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.anyMotion, () => {
      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        gsap.from(el.querySelectorAll('.mask > span'), {
          yPercent: 108,
          opacity: 0,
          duration: 1.3,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, {
          y: 32,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el, i) => {
        const frame = el.querySelector<HTMLElement>('.frame');
        const img = el.querySelector<HTMLElement>('img');
        const cap = el.querySelector<HTMLElement>('figcaption');
        if (!frame || !img) return;
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
          .from(frame, {
            clipPath: 'inset(22% 0% 0% 0% round 24px)',
            y: 60,
            duration: 1.5,
            ease: 'expo.out',
            delay: (i % 3) * 0.08,
          })
          .from(cap, { opacity: 0, y: 10, duration: 0.8 }, '-=0.9');
        // 프레임 안에서 이미지가 더 느리게 움직이는 절제된 패럴랙스
        gsap.fromTo(
          img,
          { yPercent: -5, scale: 1.06 },
          {
            yPercent: 5,
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    });
  });
}
