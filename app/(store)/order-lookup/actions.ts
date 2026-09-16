"use server";

import { redirect } from "next/navigation";
import { findOrderForLookup } from "@/lib/orders";

export type LookupState = { error: string } | undefined;

export async function lookupOrderAction(
  _prev: LookupState,
  formData: FormData
): Promise<LookupState> {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!orderNumber) return { error: "주문번호를 입력해 주세요." };
  if (!phone) return { error: "주문하실 때 입력한 연락처를 입력해 주세요." };

  const order = await findOrderForLookup(orderNumber, phone);
  if (!order) {
    // 어느 쪽이 틀렸는지는 알리지 않는다 (주문번호 추측 방지).
    return {
      error:
        "주문번호와 연락처가 일치하는 주문을 찾지 못했습니다. 입력하신 내용을 다시 확인해 주세요.",
    };
  }

  redirect(`/order/${order.orderNumber}`);
}
