import HeroSection from '../components/HeroSection';
import SkyJourney from '../components/SkyJourney';
import AboutSection from '../components/AboutSection';
import AnywhereAboutSection from '../components/AnywhereAboutSection';
import AnywhereVisionSection from '../components/AnywhereVisionSection';
import StorySection from '../components/StorySection';
import BrandFilmSection from '../components/BrandFilmSection';
import TeamTeaser from '../components/TeamTeaser';
import ProblemSection from '../components/ProblemSection';
import ApproachSection from '../components/ApproachSection';
import TechnologySection from '../components/TechnologySection';
import VisionSection from '../components/VisionSection';
import ContactSection from '../components/ContactSection';
import { sections } from '../config/site';
import { usePageMeta } from '../lib/router';

/** 메인: Hero → About(구름 위) → TripAI 필름 → Our Team → Our Vision (핵심 메시지 중심) */
export default function HomePage() {
  usePageMeta(
    'Anywhere — Official Website',
    'Anywhere 공식 홈페이지. Anywhere가 개발하고 있는 첫 번째 서비스, AI 기반 맞춤형 여행 추천 서비스 TripAI를 소개합니다.',
  );
  return (
    <>
      {sections.skyJourney ? <SkyJourney /> : <HeroSection />}
      {/* 아래 섹션은 config/site.ts 의 sections 설정으로 노출 여부를 정합니다 (숨김 = 렌더링하지 않음, 코드는 보존) */}
      {sections.about && <AboutSection />}
      {sections.aboutAnywhere && <AnywhereAboutSection />}
      {sections.brandFilm && <BrandFilmSection />}
      {sections.story && <StorySection />}
      {sections.teamTeaser && <TeamTeaser />}
      {sections.visionAnywhere && <AnywhereVisionSection brief />}
      {sections.problem && <ProblemSection />}
      {sections.approach && <ApproachSection />}
      {sections.technology && <TechnologySection />}
      {sections.vision && <VisionSection />}
      {sections.contact && <ContactSection />}
    </>
  );
}
