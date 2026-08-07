/**
 * 점자 셀(2×3) 도트 그래픽.
 * 숫자 점형은 실제 점자 규정과 일치: 1=⠁(1점), 2=⠃(1·2점), 3=⠉(1·4점), 4=⠙(1·4·5점)
 * 그 외 용도는 장식용 모티프로만 사용한다.
 */
const NUMBER_DOTS: Record<number, number[]> = {
  1: [1],
  2: [1, 2],
  3: [1, 4],
  4: [1, 4, 5],
};

export default function BrailleDots({
  dots,
  number,
  className = "",
  dotClassName = "bg-neutral-800",
  emptyClassName = "bg-neutral-200",
}: {
  dots?: number[];
  number?: 1 | 2 | 3 | 4;
  className?: string;
  dotClassName?: string;
  emptyClassName?: string;
}) {
  const filled = number ? NUMBER_DOTS[number] : (dots ?? []);
  // grid-flow-col + rows-3 : 1,2,3이 왼쪽 열(위→아래), 4,5,6이 오른쪽 열 — 점자 점 번호 규칙 그대로
  return (
    <span
      aria-hidden="true"
      className={`inline-grid grid-flow-col grid-rows-3 gap-1.5 ${className}`}
    >
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <span
          key={n}
          className={`h-1.5 w-1.5 rounded-full ${
            filled.includes(n) ? dotClassName : emptyClassName
          }`}
        />
      ))}
    </span>
  );
}
