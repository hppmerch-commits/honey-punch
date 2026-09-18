"use server";

import { headers } from "next/headers";
import {
  createOrder,
  getOrderByNumber,
  OrderError,
  type PaymentMethod,
} from "@/lib/orders";
import { isNicepayEnabled, nicepayClientId, goodsNameFor } from "@/lib/nicepay";
import type { OrderItemInput } from "@/lib/order-types";

/** 결제창을 띄우는 데 필요한 값 — 브라우저에 내려가도 되는 것만 담는다. */
export type NicepayLaunch = {
  clientId: string;
  orderId: string;
  amount: number;
  goodsName: string;
  returnUrl: string;
  buyerName: string;
  buyerTel: string;
  buyerEmail: string;
};

export type CheckoutState =
  | { ok: true; orderNumber: string; pay?: NicepayLaunch }
  | { ok: false; error: string }
  | undefined;

const str = (v: FormDataEntryValue | null, max = 200) =>
  String(v ?? "")
    .trim()
    .slice(0, max);

/** returnUrl의 기준 주소 — SITE_URL이 없으면 요청 헤더(Railway 프록시 포함)로 추정 */
async function siteOrigin() {
  const fixed = process.env.SITE_URL?.replace(/\/$/, "");
  if (fixed) return fixed;
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  return `${proto}://${host}`;
}

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

  // 결제 수단 — 키가 없으면 카드를 골라도 무통장으로 처리하지 않고 막는다.
  const wantsCard = formData.get("paymentMethod") === "CARD";
  if (wantsCard && !isNicepayEnabled()) {
    return { ok: false, error: "카드 결제가 아직 준비되지 않았습니다. 무통장입금을 선택해 주세요." };
  }
  const paymentMethod: PaymentMethod = wantsCard ? "CARD" : "BANK_TRANSFER";

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
      paymentMethod,
      customerName,
      phone,
      email,
      postcode,
      address1,
      address2,
      memo,
    });

    if (paymentMethod !== "CARD") {
      return { ok: true, orderNumber: order.orderNumber };
    }

    const origin = await siteOrigin();
    return {
      ok: true,
      orderNumber: order.orderNumber,
      pay: {
        clientId: nicepayClientId(),
        orderId: order.orderNumber,
        amount: order.total,
        goodsName: goodsNameFor(order.items),
        returnUrl: `${origin}/api/payments/nicepay/return`,
        buyerName: customerName,
        buyerTel: phone,
        buyerEmail: email,
      },
    };
  } catch (e) {
    if (e instanceof OrderError) return { ok: false, error: e.message };
    console.error("placeOrderAction:", e);
    return {
      ok: false,
      error: "주문 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}

/**
 * 결제창이 닫혔거나 실패한 주문을 다시 결제할 때 — 주문 상세 페이지의 "결제하기" 버튼용.
 * 주문번호+연락처 검증은 주문 상세 페이지 접근 자체가 담당하므로 여기선 상태만 본다.
 */
export async function relaunchPaymentAction(
  orderNumber: string
): Promise<{ ok: true; pay: NicepayLaunch } | { ok: false; error: string }> {
  if (!isNicepayEnabled()) return { ok: false, error: "카드 결제가 준비되지 않았습니다." };
  const order = await getOrderByNumber(orderNumber);
  if (!order || order.paymentMethod !== "CARD" || order.status !== "PENDING") {
    return { ok: false, error: "결제를 진행할 수 없는 주문입니다." };
  }
  const origin = await siteOrigin();
  return {
    ok: true,
    pay: {
      clientId: nicepayClientId(),
      orderId: order.orderNumber,
      amount: order.total,
      goodsName: goodsNameFor(order.items),
      returnUrl: `${origin}/api/payments/nicepay/return`,
      buyerName: order.customerName,
      buyerTel: order.phone,
      buyerEmail: order.email,
    },
  };
}
