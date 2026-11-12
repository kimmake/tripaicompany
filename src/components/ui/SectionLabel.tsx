type Props = { index: string; children: React.ReactNode; className?: string };

/** "01 — About TripAI" 형태의 섹션 라벨 */
export default function SectionLabel({ index, children, className = '' }: Props) {
  return (
    <p className={`label ${className}`} data-reveal="fade">
      <i>{index}</i>
      {children}
    </p>
  );
}
