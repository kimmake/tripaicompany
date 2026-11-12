import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProblemSection from './components/ProblemSection';
import ApproachSection from './components/ApproachSection';
import TechnologySection from './components/TechnologySection';
import VisionSection from './components/VisionSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { useReveals } from './lib/useReveals';

export default function App() {
  useReveals();
  return (
    <div className="site">
      <a className="skip-link" href="#main">본문 바로가기</a>
      <Header />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <ProblemSection />
        <ApproachSection />
        <TechnologySection />
        <VisionSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
