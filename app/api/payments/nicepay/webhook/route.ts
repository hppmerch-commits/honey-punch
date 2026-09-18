import { NextResponse } from "next/server";
import { isNicepayEnabled, verifyResultSignature } from "@/lib/nicepay";
import {
  getOrderByNumber,
  markOrderPaidByPg,
  markOrderCancelledByPg,
} from "@/lib/orders";

export const dynamic = "force-dynamic";

/**
 * 나이스페이먼츠 결제결과 통보(웹훅).
 * 가맹점관리자에 이 주소를 등록하면 승인·취소가 일어날 때마다 POST로 들어온다.
 * 규격상 응답 본문에 "OK"가 있어야 성공으로 처리되고, 아니면 재전송된다.
 *
 * 역할: 주문서 흐름(return 라우트)이 놓친 상태를 맞춘다.
 *  - 승인은 됐는데 우리 응답이 끊겨 주문이 결제 대기로 남은 경우 → 결제 완료
 *  - 나이스페이 관리자 화면에서 직접 환불한 경우 → 주문 취소 + 재고 복원
 */
const ok = () =>
  new NextResponse("OK", { status: 200, headers: { "Content-Type": "text/html;charset=utf-8" } });

type Hook = {
  resultCode?: string;
  tid?: string;
  cancelledTid?: string;
  orderId?: string;
  ediDate?: string;
  signature?: string;
  status?: string;
  amount?: number | string;
  paidAt?: string;
  payMethod?: string;
  card?: { cardName?: string } | null;
};

async function readBody(req: Request): Promise<Hook> {
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) return (await req.json()) as Hook;
  const form = await req.formData();
  const o: Record<string, string> = {};
  form.forEach((v, k) => (o[k] = String(v)));
  return o as Hook;
}

export async function POST(req: Request) {
  if (!isNicepayEnabled()) return new NextResponse("disabled", { status: 503 });

  let h: Hook;
  try {
    h = await readBody(req);
  } catch {
    return new NextResponse("bad request", { status: 400 });
  }

  const tid = String(h.tid ?? "");
  const orderId = String(h.orderId ?? "");
  const amount = Number(h.amount ?? 0);

  // 서명이 틀리면 위조로 보고 OK를 주지 않는다 (재전송돼도 계속 거부).
  if (
    !verifyResultSignature({
      tid,
      amount: h.amount ?? "",
      ediDate: String(h.ediDate ?? ""),
      signature: String(h.signature ?? ""),
    })
  ) {
    console.warn("nicepay webhook: bad signature", { tid, orderId });
    return new NextResponse("invalid signature", { status: 400 });
  }

  const order = await getOrderByNumber(orderId);
  if (!order || order.paymentMethod !== "CARD") {
    // 우리 주문이 아니면(테스트 등) 재전송만 막고 끝낸다.
    console.warn("nicepay webhook: unknown order", { orderId, status: h.status });
    return ok();
  }
  if (amount !== order.total) {
    console.error("nicepay webhook: amount mismatch", { orderId, amount, total: order.total });
    return ok();
  }

  const status = String(h.status ?? "");
  if (status === "paid" && h.resultCode === "0000") {
    await markOrderPaidByPg(order.orderNumber, {
      tid,
      payMethod: h.payMethod ?? "card",
      cardName: h.card?.cardName ?? "",
      paidAt: h.paidAt ? new Date(h.paidAt) : new Date(),
    });
  } else if (status === "cancelled") {
    await markOrderCancelledByPg(order.orderNumber, String(h.cancelledTid ?? ""));
  } else if (status === "partialCancelled") {
    // 부분취소는 사이트에 개념이 없으므로 상태는 두고 기록만 남긴다 — 관리자가 확인.
    console.warn("nicepay webhook: partial cancel", { orderId, cancelledTid: h.cancelledTid });
  }
  return ok();
}

export async function GET() {
  return new NextResponse("nicepay webhook endpoint", { status: 200 });
}
