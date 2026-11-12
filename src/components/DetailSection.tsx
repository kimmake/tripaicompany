import SectionLabel from './ui/SectionLabel';

type Props = { id?: string; label: string; title: string; children: React.ReactNode; tone?: 'plain' | 'soft' };

/** 상세 페이지 본문 블록: 왼쪽 라벨·제목, 오른쪽 내용 (읽기 편한 에디토리얼 2단, 모바일 1단) */
export default function DetailSection({ id, label, title, children, tone = 'plain' }: Props) {
  return (
    <section className={`dp ${tone === 'soft' ? 'is-soft' : ''}`} id={id} aria-label={title}>
      <div className="wrap dp-grid">
        <div className="dp-head">
          <SectionLabel reveal={false}>{label}</SectionLabel>
          <h2 className="dp-title">{title}</h2>
        </div>
        <div className="dp-body">{children}</div>
      </div>
    </section>
  );
}
