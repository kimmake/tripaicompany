import SectionLabel from './ui/SectionLabel';

type Props = { label: string; title: readonly string[]; lead?: string; image?: string };

/** 상세 페이지 상단: 정적인 구름 위 하늘 이미지 + 제목 (메인 Hero의 비행 애니메이션은 반복하지 않음) */
export default function PageHero({ label, title, lead, image = '/images/about/above-clouds.webp' }: Props) {
  return (
    <section className="page-hero" aria-labelledby="page-title">
      <div className="ph-media" aria-hidden="true">
        <img src={image} alt="" width={1256} height={829} decoding="async" fetchPriority="high" />
      </div>
      <div className="ph-shade" aria-hidden="true" />
      <div className="wrap ph-in">
        <SectionLabel className="ph-label" reveal={false}>
          {label}
        </SectionLabel>
        <h1 className="ph-title" id="page-title">
          {title.map((l) => (
            <span className="ln" key={l}>
              {l}
            </span>
          ))}
        </h1>
        {lead && <p className="ph-lead">{lead}</p>}
      </div>
    </section>
  );
}
