import Header from './components/Header';
import HeroSection from './components/HeroSection';
import SkyJourney from './components/SkyJourney';
import AboutSection from './components/AboutSection';
import AnywhereAboutSection from './components/AnywhereAboutSection';
import AnywhereVisionSection from './components/AnywhereVisionSection';
import BrandFilmSection from './components/BrandFilmSection';
import ProblemSection from './components/ProblemSection';
import ApproachSection from './components/ApproachSection';
import TechnologySection from './components/TechnologySection';
import VisionSection from './components/VisionSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { sections } from './config/site';
import { useReveals } from './lib/useReveals';

export default function App() {
  useReveals();
  return (
    <div className="site">
      <a className="skip-link" href="#main">본문 바로가기</a>
      <Header />
      <main id="main">
        {sections.skyJourney ? <SkyJourney /> : <HeroSection />}
        {/* 아래 섹션은 config/site.ts 의 sections 설정으로 노출 여부를 정합니다 (숨김 = 렌더링하지 않음, 코드는 보존) */}
        {sections.about && <AboutSection />}
        {sections.aboutAnywhere && <AnywhereAboutSection />}
        {sections.brandFilm && <BrandFilmSection />}
        {sections.visionAnywhere && <AnywhereVisionSection />}
        {sections.problem && <ProblemSection />}
        {sections.approach && <ApproachSection />}
        {sections.technology && <TechnologySection />}
        {sections.vision && <VisionSection />}
        {sections.contact && <ContactSection />}
      </main>
      <Footer />
    </div>
  );
}
