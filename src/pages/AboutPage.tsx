import PageHero from '../components/PageHero';
import DetailSection from '../components/DetailSection';
import StorySection from '../components/StorySection';
import AnywhereVisionSection from '../components/AnywhereVisionSection';
import LinkButton from '../components/ui/LinkButton';
import { aboutPage as c } from '../content/pages';
import { usePageMeta } from '../lib/router';

/** /about — 회사 소개 · 가치 · 시작 배경과 여정(Our Story & Journey) · 앞으로의 방향(Vision) */
export default function AboutPage() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <PageHero label={c.hero.label} title={c.hero.title} lead={c.hero.lead} />
      <DetailSection label={c.company.label} title={c.company.title}>
        {c.company.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="dp-actions">
          <LinkButton to="/tripai">Explore TripAI</LinkButton>
        </div>
      </DetailSection>
      <DetailSection label={c.values.label} title={c.values.title}>
        <ul className="dp-values">
          {c.values.items.map((v) => (
            <li key={v.en}>
              <span className="dp-en">{v.en}</span>
              <h3>{v.ko}</h3>
              <p>{v.desc}</p>
            </li>
          ))}
        </ul>
      </DetailSection>
      {/* Our Story & Journey (메인에서 옮김) → 앞으로의 방향(Our Vision 전문)으로 이어짐 */}
      <StorySection />
      <AnywhereVisionSection />
    </>
  );
}
