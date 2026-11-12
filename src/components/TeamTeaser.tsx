import LinkButton from './ui/LinkButton';
import SectionLabel from './ui/SectionLabel';

/** 메인 — Our Team 소개 (팀원 프로필은 /team 에서). 아래쪽은 Our Vision 저녁 하늘로 이어짐 */
export default function TeamTeaser() {
  return (
    <section className="tt" id="team-teaser" aria-labelledby="tt-title">
      <div className="wrap tt-in">
        <SectionLabel className="center" reveal={false}>
          Our Team
        </SectionLabel>
        <h2 className="tt-title" id="tt-title">
          여행의 새로운 경험을 만드는 사람들.
        </h2>
        <p className="tt-body">서로 다른 생각과 시선을 모아, Anywhere의 첫 번째 서비스 TripAI를 만들어갑니다.</p>
        <LinkButton to="/team">Meet Our Team</LinkButton>
      </div>
      <div className="st-tail" aria-hidden="true" />
    </section>
  );
}
