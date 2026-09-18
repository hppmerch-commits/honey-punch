"use server";

import { revalidatePath } from "next/cache";
import { findOrderForLookup, cancelOrder, OrderError } from "@/lib/orders";

export type CancelState = { ok: true } | { ok: false; error: string } | undefined;

/**
 * 고객 본인 취소.
 * 주문 상세 URL만으로는 취소할 수 없고, 주문 시 연락처를 다시 맞춰야 한다
 * (URL이 새어 나가도 남이 취소하지 못하게).
 *
 * - 결제 대기(무통장 미입금 / 카드 미결제): 바로 취소
 * - 카드 결제 완료: 나이스페이 승인 취소(환불)까지 자동
 * - 무통장 입금 완료: 환불 계좌를 받아야 하므로 자동 취소 불가 → 안내
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
  if (order.status === "PAID" && order.paymentMethod !== "CARD") {
    return {
      ok: false,
      error:
        "입금이 확인된 무통장 주문은 환불받으실 계좌가 필요해 자동으로 취소되지 않습니다. 주문번호와 함께 문의해 주시면 바로 처리해 드리겠습니다.",
    };
  }

  try {
    await cancelOrder(order.id, "고객 요청 취소");
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error("cancelMyOrderAction:", e);
    return { ok: false, error: "취소 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." };
  }

  revalidatePath(`/order/${orderNumber}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}
