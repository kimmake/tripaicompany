import PageHero from '../components/PageHero';
import DetailSection from '../components/DetailSection';
import LinkButton from '../components/ui/LinkButton';
import { teamMembers } from '../content/team';
import { teamPage as c } from '../content/pages';
import { usePageMeta } from '../lib/router';

/** /team — 팀 공통 소개 + (정보가 있을 때만) 팀원 목록. 가상의 인물·빈 카드는 표시하지 않음 */
export default function TeamPage() {
  usePageMeta(c.meta.title, c.meta.description);
  return (
    <>
      <PageHero label={c.hero.label} title={c.hero.title} lead={c.hero.lead} />
      <DetailSection label={c.intro.label} title={c.intro.title}>
        {c.intro.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="dp-actions">
          <LinkButton to="/about">Discover Anywhere</LinkButton>
          <LinkButton to="/tripai">Explore TripAI</LinkButton>
        </div>
      </DetailSection>
      {teamMembers.length > 0 && (
        <DetailSection label="Members" title="팀원 소개" tone="soft">
          <ul className="dp-team">
            {teamMembers.map((m) => (
              <li key={m.name}>
                {m.photo && <img src={m.photo} alt={`${m.name} 프로필 사진`} width={240} height={240} loading="lazy" decoding="async" />}
                <h3>{m.name}</h3>
                <p className="dp-role">
                  {m.role}
                  {m.focus ? ` · ${m.focus}` : ''}
                </p>
                {m.bio && <p>{m.bio}</p>}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}
    </>
  );
}
