import type { ElementType } from 'react';

type Props = {
  as?: ElementType;
  id?: string;
  className?: string;
  lines: string[];
};

/**
 * 줄 단위 마스크 리빌 헤드라인.
 * 각 줄은 overflow: clip 마스크 안에서 아래→위로 등장합니다 (data-reveal="lines").
 */
export default function SplitLines({ as: Tag = 'h2', id, className, lines }: Props) {
  return (
    <Tag id={id} className={className} data-reveal="lines">
      {lines.map((line) => (
        <span className="mask" key={line}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
