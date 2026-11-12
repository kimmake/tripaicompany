import PageHero from '../components/PageHero';
import DetailSection from '../components/DetailSection';
import StorySection from '../components/StorySection';
import { aboutPage as c } from '../content/pages';
import { usePageMeta } from '../lib/router';

/** /about — 회사 소개 · 가치 · 비전 · 시작 배경과 여정(Our Story & Journey) */
export default function AboutPage() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <PageHero label={c.hero.label} title={c.hero.title} />
      <DetailSection label={c.company.label} title={c.company.title}>
        {c.company.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
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
      <DetailSection label={c.vision.label} title={c.vision.title} tone="soft">
        {c.vision.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </DetailSection>
      {/* Our Story & Journey (메인에서 옮김)로 마무리 — 메인 Our Vision 장면은 반복하지 않음 */}
      <StorySection />
    </>
  );
}
