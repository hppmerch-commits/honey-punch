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
 * 결제 수단. BANK_TRANSFER만 우리가 직접 처리하고(기업은행 계좌 안내),
 * 나머지 넷은 나이스페이먼츠 결제창을 거친다.
 */
export const PAYMENT_METHODS = [
  "CARD",
  "BANK",
  "VBANK",
  "CELLPHONE",
  "BANK_TRANSFER",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const isPaymentMethod = (m: string): m is PaymentMethod =>
  (PAYMENT_METHODS as readonly string[]).includes(m);

/** 나이스페이먼츠를 거치는 수단인가 — 승인·취소를 PG API로 처리해야 한다. */
export const isPgMethod = (m: string) => isPaymentMethod(m) && m !== "BANK_TRANSFER";

/**
 * 현금성 결제인가 — 환불할 때 고객의 환불계좌가 있어야 한다.
 * (카드·휴대폰은 승인을 되돌리면 끝이라 계좌가 필요 없다.)
 */
export const isCashMethod = (m: string) => m === "VBANK" || m === "BANK";

/**
 * 이 주문을 취소하려면 고객에게 환불계좌를 받아야 하는가.
 * 현금이 실제로 들어온 뒤에만 필요하다 — 입금 전 가상계좌는 발급취소라 필요 없다.
 */
export const needsRefundAccount = (o: { paymentMethod: string; status: string }) =>
  isCashMethod(o.paymentMethod) && o.status === "PAID";

/** 결제창 requestPay에 넘길 method 값 */
export const nicepayMethod = (m: string) =>
  ({ CARD: "card", BANK: "bank", VBANK: "vbank", CELLPHONE: "cellphone" })[m] ?? "";

/**
 * 상태 라벨 — 결제 수단에 따라 같은 상태도 다르게 읽힌다.
 * 무통장·가상계좌: PENDING=입금 대기 / PAID=입금 확인
 * 카드·계좌이체·휴대폰: PENDING=결제 대기 / PAID=결제 완료
 */
export const statusLabel = (s: string, paymentMethod = "BANK_TRANSFER") => {
  const deposit = paymentMethod === "BANK_TRANSFER" || paymentMethod === "VBANK";
  return (
    (
      {
        PENDING: deposit ? "입금 대기" : "결제 대기",
        PAID: deposit ? "입금 확인" : "결제 완료",
        SHIPPED: "배송중",
        DONE: "배송 완료",
        CANCELLED: "취소됨",
      } as Record<string, string>
    )[s] ?? s
  );
};

export const paymentMethodLabel = (m: string) =>
  ({
    CARD: "신용카드",
    BANK: "계좌이체",
    VBANK: "가상계좌",
    CELLPHONE: "휴대폰 결제",
    BANK_TRANSFER: "무통장입금",
  })[m] ?? m;

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
