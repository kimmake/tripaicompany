import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TripAIPage from './pages/TripAIPage';
import TeamPage from './pages/TeamPage';
import NotFoundPage from './pages/NotFoundPage';
import { usePath, useRouteScroll } from './lib/router';
import { useReveals } from './lib/useReveals';

/** 경로별 페이지 — 직접 URL 접근·새로고침·뒤로 가기 지원 (배포 서버는 index.html 폴백 필요) */
const routes: Record<string, () => React.ReactElement> = {
  '/': HomePage,
  '/about': AboutPage,
  '/tripai': TripAIPage,
  '/team': TeamPage,
};

export default function App() {
  const path = usePath();
  const Page = routes[path] ?? NotFoundPage;
  useReveals();
  useRouteScroll(path);
  return (
    <div className="site" data-page={path === '/' ? 'home' : 'detail'}>
      <a className="skip-link" href="#main">본문 바로가기</a>
      <Header path={path} />
      <main id="main" key={path}>
        <Page />
      </main>
      <Footer />
    </div>
  );
}
