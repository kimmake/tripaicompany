import PageHero from '../components/PageHero';
import DetailSection from '../components/DetailSection';
import SectionLabel from '../components/ui/SectionLabel';
import VideoPlayer from '../components/ui/VideoPlayer';
import { ArrowRight } from '../components/ui/Icons';
import { brandFilm } from '../config/media';
import { service } from '../config/site';
import { tripaiPage as c } from '../content/pages';
import { usePageMeta } from '../lib/router';

/** /tripai — 서비스 소개 · 실제 화면 · 영상 · 주요 기능과 추천 방식(개발 중) · 경험 기반 정보 · 앞으로의 방향 */
export default function TripAIPage() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <PageHero label={c.hero.label} title={c.hero.title} />
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
      <section className="dp dp-screens" aria-labelledby="sc-title">
        <div className="wrap">
          <div className="dp-head sc-head">
            <SectionLabel reveal={false}>{c.screens.label}</SectionLabel>
            <h2 className="dp-title" id="sc-title">{c.screens.title}</h2>
          </div>
          <div className="sc-grid">
            {c.screens.items.map((s) => (
              <figure key={s.src} className={`sc-item${s.kind === 'wide' ? ' is-wide' : ''}`}>
                <div className={`sc-frame${s.kind === 'phone' ? ' is-phone' : ''}`}>
                  {s.kind === 'wide' && (
                    <div className="sc-bar" aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </div>
                  )}
                  <img src={s.src} alt={`TripAI 화면: ${s.caption}`} width={s.w} height={s.h} loading="lazy" decoding="async" />
                </div>
                <figcaption>{s.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="sc-note">{c.screens.note}</p>
        </div>
      </section>
      <section className="dp dp-film is-soft" aria-label="TripAI 서비스 소개 영상">
        <div className="wrap">
          <div className="film-frame">
            <VideoPlayer sources={[...brandFilm.sources]} poster={brandFilm.poster} title={brandFilm.title} durationHint={brandFilm.duration} ctaLabel="TripAI 필름 보기" />
          </div>
        </div>
      </section>
      <DetailSection label={c.how.label} title={c.how.title}>
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
        <p className="dp-note">{c.how.note}</p>
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
