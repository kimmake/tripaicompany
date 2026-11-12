type Props = { index?: string; children: React.ReactNode; className?: string; reveal?: boolean };

/** "01 — About TripAI" 형태의 섹션 라벨. index를 생략하면 라벨 텍스트만 표시합니다. */
export default function SectionLabel({ index, children, className = '', reveal = true }: Props) {
  return (
    <p className={`label ${className}`} data-reveal={reveal ? 'fade' : undefined}>
      {index && <i>{index}</i>}
      {children}
    </p>
  );
}
