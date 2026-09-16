/**
 * 구매 흐름(장바구니·주문서·주문조회·주문완료) 공통 UI 토큰.
 * 마뗑킴 실측값 기준:
 *  - 본문/입력/버튼 글자 13px, 자간 없음, 굵기 400
 *  - 전경색 #1e1e1e (순검정 아님)
 *  - 입력은 박스가 아니라 밑줄 1px
 *  - 버튼 높이 56px, 모서리 각짐, 테두리 1px #1e1e1e
 */
export const INK = "#1e1e1e";

/**
 * 밑줄형 입력. 마뗑킴 원본은 31px 높이지만 터치 타깃 44px를 지키려고 h-11로 둔다
 * (모바일에서는 globals.css가 확대 방지를 위해 16px로 올린다).
 */
export const fieldInput =
  "h-11 w-full border-0 border-b border-neutral-300 bg-transparent px-0 text-[13px] text-[#1e1e1e] outline-none transition-colors placeholder:text-neutral-300 focus:border-[#1e1e1e]";

/** 입력 위 라벨 — 마뗑킴은 회색이 아니라 본문색 13px */
export const fieldLabel = "mb-1 block text-[13px] text-[#1e1e1e]";

/** 라벨 아래 보조 설명 */
export const fieldHint = "mt-1.5 block text-[12px] leading-relaxed text-neutral-500";

const btnBase =
  "flex h-14 w-full items-center justify-center border text-[13px] transition-colors";

/** 주요 동작 — 검정 채움 */
export const btnPrimary = `${btnBase} border-[#1e1e1e] bg-[#1e1e1e] text-white hover:opacity-85 disabled:cursor-wait disabled:opacity-50`;

/** 보조 동작 — 흰 바탕에 검정 테두리, 호버 시 반전 */
export const btnOutline = `${btnBase} border-[#1e1e1e] bg-white text-[#1e1e1e] hover:bg-[#1e1e1e] hover:text-white`;

/** 섹션 소제목 (ORDER SUMMARY 등) */
export const sectionLabel = "text-[13px] tracking-[0.12em] text-[#1e1e1e]";
