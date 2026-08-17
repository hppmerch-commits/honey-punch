"use server";

import { createOrder, OrderError } from "@/lib/orders";
import type { OrderItemInput } from "@/lib/order-types";

export type CheckoutState =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string }
  | undefined;

const str = (v: FormDataEntryValue | null, max = 200) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

export async function placeOrderAction(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  let items: OrderItemInput[];
  try {
    const parsed: unknown = JSON.parse(String(formData.get("items") ?? "[]"));
    if (!Array.isArray(parsed)) throw new Error();
    items = parsed.map((i) => ({
      slug: String(i.slug ?? ""),
      size: String(i.size ?? ""),
      color: String(i.color ?? ""),
      qty: Number(i.qty),
    }));
  } catch {
    return { ok: false, error: "장바구니 정보를 읽지 못했습니다. 새로고침 후 다시 시도해 주세요." };
  }

  const customerName = str(formData.get("customerName"), 50);
  const phone = str(formData.get("phone"), 20).replace(/[^\d-]/g, "");
  const email = str(formData.get("email"), 100);
  const postcode = str(formData.get("postcode"), 10);
  const address1 = str(formData.get("address1"), 200);
  const address2 = str(formData.get("address2"), 200);
  const memo = str(formData.get("memo"), 300);

  if (!customerName) return { ok: false, error: "받는 분 성함을 입력해 주세요." };
  if (phone.replace(/-/g, "").length < 9)
    return { ok: false, error: "연락처를 정확히 입력해 주세요." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "이메일 형식이 올바르지 않습니다." };
  if (!address1) return { ok: false, error: "주소를 입력해 주세요." };
  if (formData.get("agree") !== "on")
    return { ok: false, error: "주문 내용 확인 및 결제 진행에 동의해 주세요." };

  try {
    const order = await createOrder({
      items,
      customerName,
      phone,
      email,
      postcode,
      address1,
      address2,
      memo,
    });
    return { ok: true, orderNumber: order.orderNumber };
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error("placeOrderAction:", e);
    return {
      ok: false,
      error: "주문 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
