import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
gsap.defaults({ ease: 'power3.out' });

/** 반응형·모션 선호에 따른 미디어 조건 (gsap.matchMedia 용) */
export const MQ = {
  desktopMotion: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  anyMotion: '(prefers-reduced-motion: no-preference)',
} as const;

/** 브랜드 이징: 빠르게 시작해 길게 감속 */
export const EASE = 'expo.out';

export { gsap, ScrollTrigger, useGSAP };
