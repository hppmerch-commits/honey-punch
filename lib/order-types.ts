// 주문 상태 — 클라이언트/서버 공용 (server-only 금지)

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DONE",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * 상태 라벨 — 결제 수단에 따라 같은 상태도 다르게 읽힌다.
 * 무통장: PENDING=입금 대기 / PAID=결제 확인(입금 확인)
 * 카드:   PENDING=결제 대기 / PAID=결제 완료
 */
export const statusLabel = (s: string, paymentMethod = "BANK_TRANSFER") => {
  const card = paymentMethod === "CARD";
  return (
    (
      {
        PENDING: card ? "결제 대기" : "입금 대기",
        PAID: card ? "결제 완료" : "결제 확인",
        SHIPPED: "배송중",
        DONE: "배송 완료",
        CANCELLED: "취소됨",
      } as Record<string, string>
    )[s] ?? s
  );
};

export const paymentMethodLabel = (m: string) =>
  m === "CARD" ? "카드 · 간편결제" : "무통장입금";

/** 관리자 목록·상세 뱃지 색 */
export const statusTone = (s: string) =>
  (
    {
      PENDING: "bg-amber-50 text-amber-700",
      PAID: "bg-blue-50 text-blue-700",
      SHIPPED: "bg-indigo-50 text-indigo-700",
      DONE: "bg-neutral-100 text-neutral-600",
      CANCELLED: "bg-red-50 text-red-500",
    } as Record<string, string>
  )[s] ?? "bg-neutral-100 text-neutral-600";

export type OrderItemInput = {
  slug: string;
  size: string;
  color: string;
  qty: number;
};

export const formatOrderDate = (d: Date | string) =>
  new Date(d).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
