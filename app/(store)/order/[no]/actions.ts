"use server";

import { revalidatePath } from "next/cache";
import { findOrderForLookup, cancelOrder, OrderError } from "@/lib/orders";
import { needsRefundAccount } from "@/lib/order-types";
import { isBankCode } from "@/lib/banks";
import type { RefundAccount } from "@/lib/nicepay";

export type CancelState = { ok: true } | { ok: false; error: string } | undefined;

/**
 * 고객 본인 취소.
 * 주문 상세 URL만으로는 취소할 수 없고, 주문 시 연락처를 다시 맞춰야 한다
 * (URL이 새어 나가도 남이 취소하지 못하게).
 *
 * - 결제 대기: 바로 취소 (가상계좌는 발급취소까지)
 * - 카드·휴대폰 결제 완료: 승인 취소(환불)까지 자동
 * - 가상계좌·계좌이체 입금 완료: 환불계좌를 받아 현금 환불
 * - 무통장 입금 완료: 우리가 직접 받은 돈이라 자동 환불 불가 → 안내
 * - 배송 시작 이후: 불가
 */
export async function cancelMyOrderAction(
  _prev: CancelState,
  formData: FormData
): Promise<CancelState> {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!phone) return { ok: false, error: "주문하실 때 입력한 연락처를 입력해 주세요." };

  const order = await findOrderForLookup(orderNumber, phone);
  if (!order) {
    return { ok: false, error: "연락처가 주문 정보와 일치하지 않습니다." };
  }

  if (order.status === "CANCELLED") return { ok: true };
  if (order.status === "SHIPPED" || order.status === "DONE") {
    return {
      ok: false,
      error: "이미 배송이 시작된 주문은 취소할 수 없습니다. 수령 후 교환·반품으로 문의해 주세요.",
    };
  }
  if (order.status === "PAID" && order.paymentMethod === "BANK_TRANSFER") {
    return {
      ok: false,
      error:
        "입금이 확인된 무통장 주문은 환불받으실 계좌가 필요해 자동으로 취소되지 않습니다. 주문번호와 함께 문의해 주시면 바로 처리해 드리겠습니다.",
    };
  }

  // 현금이 이미 들어온 거래는 돌려보낼 계좌가 있어야 취소된다.
  let refund: RefundAccount | undefined;
  if (needsRefundAccount(order)) {
    const bankCode = String(formData.get("refundBankCode") ?? "").trim();
    const account = String(formData.get("refundAccount") ?? "").replace(/[^\d]/g, "");
    const holder = String(formData.get("refundHolder") ?? "").trim().slice(0, 20);
    if (!isBankCode(bankCode)) return { ok: false, error: "환불받으실 은행을 선택해 주세요." };
    if (account.length < 8) return { ok: false, error: "환불 계좌번호를 정확히 입력해 주세요." };
    if (!holder) return { ok: false, error: "환불 계좌의 예금주를 입력해 주세요." };
    refund = { bankCode, account, holder };
  }

  try {
    await cancelOrder(order.id, "고객 요청 취소", refund);
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error("cancelMyOrderAction:", e);
    return { ok: false, error: "취소 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath(`/order/${orderNumber}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}
