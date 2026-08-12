/**
 * 섹션 표식 — Hero의 모노 라벨(짧은 룰 + 대문자 트래킹)과 같은 체계.
 * 오른쪽 코드는 Hero의 `HP · 001`, `SS · 26` 마크와 이어지는 길찾기 표식이다.
 */
export default function SectionMark({
  label,
  code,
  tone = "light",
}: {
  label: string;
  code?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <div className="flex items-baseline justify-between gap-6">
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.3em] ${
          dark ? "text-blue-300" : "text-blue-700"
        }`}
      >
        <span
          className={`mr-3 inline-block h-px w-6 align-middle ${
            dark ? "bg-blue-300/70" : "bg-blue-700/70"
          }`}
        />
        {label}
      </p>
      {code && (
        <p
          className={`font-mono text-[9px] uppercase tracking-[0.35em] ${
            dark ? "text-white/35" : "text-slate-400"
          }`}
        >
          {code}
        </p>
      )}
    </div>
  );
}
