import type { ReactNode } from "react";

/**
 * Hero의 시그니처 컨테이너 — 큰 라운드 카드에 흰색 노치를 파고,
 * 그 자리에 표식을 앉힌다. 장식이 아니라 인덱스가 들어앉는 자리다.
 */
export default function NotchCard({
  children,
  mark,
  code,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  /** 좌상단 노치 안에 들어가는 표식 (점자 인덱스 등) */
  mark?: ReactNode;
  /** 우하단 기술 코드 */
  code?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  // 노치는 페이지 배경과 같은 색이어야 '파인' 것으로 읽힌다.
  const notch = dark ? "bg-black" : "bg-white";

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] md:rounded-[36px] ${
        dark ? "bg-white/5" : "bg-[#eef1f6]"
      } ${className}`}
    >
      {children}

      {mark && (
        <>
          <span
            className={`absolute left-0 top-0 z-[2] h-14 w-28 rounded-br-[28px] md:h-16 md:w-32 ${notch}`}
          />
          <div className="absolute left-0 top-0 z-[3] flex h-14 w-28 items-center pl-5 md:h-16 md:w-32 md:pl-6">
            {mark}
          </div>
        </>
      )}

      {code && (
        <>
          <span
            className={`absolute bottom-0 right-0 z-[2] h-10 w-28 rounded-tl-[24px] md:h-12 md:w-32 ${notch}`}
          />
          <span
            className={`absolute bottom-3 right-5 z-[3] font-mono text-[9px] uppercase tracking-[0.35em] md:bottom-4 md:right-6 ${
              dark ? "text-white/35" : "text-slate-400"
            }`}
          >
            {code}
          </span>
        </>
      )}
    </div>
  );
}
