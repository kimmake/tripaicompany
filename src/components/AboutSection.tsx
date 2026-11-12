import SectionLabel from './ui/SectionLabel';
import SplitLines from './ui/SplitLines';

const SHOTS = [
  { key: 'rest', src: '/images/about-rest.webp', w: 1200, h: 1500, title: 'Rest', caption: '쉼이 필요한 여행', alt: '노을이 지는 해변에 잔잔한 파도가 밀려오는 모습' },
  { key: 'city', src: '/images/about-city.webp', w: 1000, h: 1333, title: 'Urban', caption: '골목을 걷는 도시 탐험', alt: '간판 불빛이 켜진 밤의 도시 골목' },
  { key: 'nature', src: '/images/about-nature.webp', w: 1000, h: 1000, title: 'Nature', caption: '자연 속으로 떠나는 시간', alt: '산으로 둘러싸인 호수 위의 나무 보트' },
] as const;

/** SECTION 02 — ABOUT TRIPAI */
export default function AboutSection() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="about-head">
          <div className="l">
            <SectionLabel index="01">About TripAI</SectionLabel>
            <SplitLines id="about-title" className="h2" lines={['여행의 시작은,', '나를 이해하는 것에서.']} />
          </div>
          <div className="r">
            <p className="lead" data-reveal="fade">
              우리는 여행이 단순히 목적지를 선택하는 일이 아니라고 생각합니다. 같은 장소를 방문하더라도 사람마다 원하는 경험은 다릅니다.
            </p>
            <p className="body" data-reveal="fade">
              누군가에게 여행은 휴식이고, 누군가에게는 새로운 발견이며, 또 다른 누군가에게는 특별한 추억을 만드는 시간입니다.
            </p>
            <p className="body" data-reveal="fade">
              TripAI는 이러한 차이에서 출발합니다. 여행자의 취향과 상황을 이해하고, 각자에게 어울리는 여행을 발견할 수 있도록 돕고자 합니다.
            </p>
          </div>
        </div>

        <div className="gallery">
          {SHOTS.map((s) => (
            <figure className={`shot ${s.key}`} key={s.key} data-reveal="clip">
              <div className="frame">
                <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" />
              </div>
              <figcaption>
                <b>{s.title}</b>
                {s.caption}
              </figcaption>
            </figure>
          ))}
          <p className="about-quote" data-reveal="fade">
            같은 여행지라도, 여행의 의미는 사람마다 다릅니다.
          </p>
        </div>
      </div>
    </section>
  );
}
