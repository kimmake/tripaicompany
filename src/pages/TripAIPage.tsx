import PageHero from '../components/PageHero';
import DetailSection from '../components/DetailSection';
import VideoPlayer from '../components/ui/VideoPlayer';
import { ArrowRight } from '../components/ui/Icons';
import { brandFilm } from '../config/media';
import { service } from '../config/site';
import { tripaiPage as c } from '../content/pages';
import { usePageMeta } from '../lib/router';

/** /tripai — 서비스 소개 · 주요 기능(개발 중) · 추천 방식 · 경험 기반 정보 · 영상 · 향후 방향 */
export default function TripAIPage() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <PageHero label={c.hero.label} title={c.hero.title} lead={c.hero.lead} />
      <DetailSection label={c.intro.label} title={c.intro.title}>
        {c.intro.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="dp-actions">
          <a className="link-btn" href={service.url} target="_blank" rel="noopener noreferrer">
            <span>TripAI 바로가기</span>
            <ArrowRight className="ext" />
            <span className="sr-only">(새 창에서 열림)</span>
          </a>
        </div>
      </DetailSection>
      <section className="dp dp-film is-soft" aria-label="TripAI 서비스 소개 영상">
        <div className="wrap">
          <div className="film-frame">
            <VideoPlayer sources={[...brandFilm.sources]} poster={brandFilm.poster} title={brandFilm.title} durationHint={brandFilm.duration} ctaLabel="TripAI 필름 보기" />
          </div>
        </div>
      </section>
      <DetailSection label={c.features.label} title={c.features.title}>
        <ol className="dp-list">
          {c.features.items.map((f, i) => (
            <li key={f.title}>
              <span className="dp-no">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="dp-note">{c.features.note}</p>
      </DetailSection>
      <DetailSection label={c.how.label} title={c.how.title} tone="soft">
        <ol className="dp-list">
          {c.how.steps.map((s) => (
            <li key={s.no}>
              <span className="dp-no">{s.no}</span>
              <div>
                <span className="dp-en">{s.en}</span>
                <h3>{s.ko}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </DetailSection>
      <DetailSection label={c.experience.label} title={c.experience.title}>
        {c.experience.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </DetailSection>
      <DetailSection label={c.next.label} title={c.next.title} tone="soft">
        {c.next.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </DetailSection>
    </>
  );
}
