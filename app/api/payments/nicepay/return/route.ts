import { NextResponse } from "next/server";
import {
  approvePayment,
  verifyAuthSignature,
  nicepayClientId,
  NicepayError,
} from "@/lib/nicepay";
import { getOrderByNumber, markOrderPaidByPg } from "@/lib/orders";
import { publicOrigin } from "@/lib/origin";

export const dynamic = "force-dynamic";

/**
 * 나이스페이먼츠 결제창이 인증을 마친 뒤 POST로 돌아오는 자리.
 * 여기서 서버 승인까지 끝내고 주문 상세로 보낸다.
 * 실패 시에도 주문은 남겨두어(재고 유지) 고객이 상세 페이지에서 다시 결제할 수 있게 한다.
 */
export async function POST(req: Request) {
  const form = await req.formData();
  const f = (k: string) => String(form.get(k) ?? "");

  const orderId = f("orderId");
  // req.url은 컨테이너 내부 주소(localhost:8080)라 쓰면 안 된다.
  const origin = publicOrigin(req.headers);
  const toOrder = (params: Record<string, string>) => {
    const u = new URL(`/order/${encodeURIComponent(orderId)}`, origin);
    for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
    return NextResponse.redirect(u, 303);
  };
  const fail = (msg: string) => toOrder({ pay: "failed", msg: msg.slice(0, 120) });

  if (!orderId) {
    return NextResponse.redirect(new URL("/checkout?payError=1", origin), 303);
  }

  // 1) 인증 단계 결과
  if (f("authResultCode") !== "0000") {
    return fail(f("authResultMsg") || "결제 인증이 취소되었거나 실패했습니다.");
  }

  // 2) 위변조·가맹점 검사
  if (f("clientId") !== nicepayClientId()) return fail("가맹점 정보가 일치하지 않습니다.");
  if (
    !verifyAuthSignature({
      authToken: f("authToken"),
      clientId: f("clientId"),
      amount: f("amount"),
      signature: f("signature"),
    })
  ) {
    return fail("결제 인증 서명이 올바르지 않습니다.");
  }

  // 3) 주문 대조 — 금액은 우리 DB 값이 기준
  const order = await getOrderByNumber(orderId);
  if (!order || order.paymentMethod !== "CARD") return fail("주문을 찾을 수 없습니다.");
  if (order.status === "PAID") return toOrder({ paid: "1" }); // 중복 콜백
  if (order.status !== "PENDING") return fail("결제를 진행할 수 없는 주문 상태입니다.");
  if (Number(f("amount")) !== order.total) return fail("결제 금액이 주문 금액과 다릅니다.");

  // 4) 승인
  try {
    const approved = await approvePayment(f("tid"), order.total);
    const ok = await markOrderPaidByPg(order.orderNumber, {
      tid: approved.tid,
      payMethod: approved.payMethod ?? "card",
      cardName: approved.card?.cardName ?? "",
      paidAt: approved.paidAt ? new Date(approved.paidAt) : new Date(),
    });
    if (!ok) return toOrder({ paid: "1" }); // 다른 요청이 먼저 반영한 경우
    return toOrder({ paid: "1" });
  } catch (e) {
    const msg = e instanceof NicepayError ? e.message : "결제 승인 중 오류가 발생했습니다.";
    console.error("nicepay approve:", e);
    return fail(msg);
  }
}

/** 브라우저에서 직접 열면 주문서로 돌려보낸다. */
export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/checkout", publicOrigin(req.headers)), 303);
}
