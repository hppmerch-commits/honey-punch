import { NextResponse } from "next/server";
import { isNicepayEnabled, verifyResultSignature } from "@/lib/nicepay";
import {
  getOrderByNumber,
  markOrderPaidByPg,
  markOrderCancelledByPg,
  markOrderVbankIssued,
} from "@/lib/orders";
import { isPgMethod } from "@/lib/order-types";

export const dynamic = "force-dynamic";

/**
 * 나이스페이먼츠 결제결과 통보(웹훅).
 * 가맹점관리자에 이 주소를 등록하면 승인·취소가 일어날 때마다 POST로 들어온다.
 * 규격상 응답 본문에 "OK"가 있어야 성공으로 처리되고, 아니면 재전송된다.
 *
 * 우리 사이트를 거치지 않고 일어난 결제 변화를 알 수 있는 유일한 통로다.
 *  - 가상계좌 입금: 브라우저 없이 며칠 뒤 일어나므로 오직 여기로만 들어온다
 *  - 나이스페이 가맹점 관리자에서 직접 환불: 여기로만 들어온다
 *  - 가상계좌 입금기한 만료: 주문을 닫고 재고를 되돌려야 한다
 *  - 승인은 됐는데 우리 응답이 끊겨 결제 대기로 남은 주문: 여기서 보정된다
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
  bank?: { bankName?: string } | null;
  vbank?: {
    vbankName?: string;
    vbankNumber?: string;
    vbankHolder?: string;
    vbankExpDate?: string;
  } | null;
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

  const signature = String(h.signature ?? "");
  const ediDate = String(h.ediDate ?? "");

  // 서명이 아예 없는 통보(결제 실패 알림 등)는 검증할 대상이 없다.
  // 상태는 절대 바꾸지 않되 OK는 돌려준다 — 거부하면 나이스페이먼츠가 영원히 재전송하고
  // 가맹점관리자 로그가 '실패'로 계속 쌓인다.
  if (!signature || !tid || !ediDate) {
    console.warn("nicepay webhook: unsigned notice, ignored", {
      tid,
      orderId,
      status: h.status,
      resultCode: h.resultCode,
    });
    return ok();
  }

  // 서명이 붙어 있는데 맞지 않으면 위조이거나 키 설정 오류다 — OK를 주지 않는다.
  if (!verifyResultSignature({ tid, amount: h.amount ?? "", ediDate, signature })) {
    console.error("nicepay webhook: bad signature", { tid, orderId, status: h.status });
    return new NextResponse("invalid signature", { status: 400 });
  }

  const order = await getOrderByNumber(orderId);
  if (!order || !isPgMethod(order.paymentMethod)) {
    // 우리 주문이 아니면(테스트 등) 재전송만 막고 끝낸다.
    console.warn("nicepay webhook: unknown order", { orderId, status: h.status });
    return ok();
  }
  if (amount !== order.total) {
    console.error("nicepay webhook: amount mismatch", { orderId, amount, total: order.total });
    return ok();
  }

  const status = String(h.status ?? "");
  try {
    if (status === "paid" && h.resultCode === "0000") {
      // 카드·계좌이체·휴대폰 승인, 그리고 가상계좌 입금이 모두 여기로 들어온다.
      await markOrderPaidByPg(order.orderNumber, {
        tid,
        payMethod: h.payMethod ?? "",
        cardName: h.card?.cardName ?? "",
        bankName: h.bank?.bankName ?? "",
        paidAt: h.paidAt ? new Date(h.paidAt) : new Date(),
      });
    } else if (status === "ready" && h.vbank?.vbankNumber) {
      // 가상계좌 발급 — 주문서 흐름에서 이미 저장했겠지만 놓쳤을 때를 위한 보정.
      await markOrderVbankIssued(order.orderNumber, {
        tid,
        payMethod: h.payMethod ?? "vbank",
        vbank: h.vbank,
      });
    } else if (status === "cancelled" || status === "expired") {
      // expired = 가상계좌 입금기한 만료. 주문을 닫고 재고를 되돌린다.
      await markOrderCancelledByPg(order.orderNumber, String(h.cancelledTid ?? ""));
    } else if (status === "partialCancelled") {
      // 부분취소는 사이트에 개념이 없으므로 상태는 두고 기록만 남긴다 — 관리자가 확인.
      console.warn("nicepay webhook: partial cancel", { orderId, cancelledTid: h.cancelledTid });
    }
  } catch (e) {
    // 같은 tid가 다른 주문에 이미 붙어 있는 경우(P2002)는 재전송해도 절대 성공하지 않는다.
    // OK를 돌려 무한 재전송을 끊고 로그로 남긴다. 그 밖의 오류는 일시적일 수 있으므로
    // OK를 주지 않아 나이스페이먼츠가 다시 보내게 한다.
    const code = (e as { code?: string })?.code;
    console.error("nicepay webhook: apply failed", { orderId, status, tid, code, error: e });
    if (code !== "P2002") {
      return new NextResponse("retry", { status: 500 });
    }
  }
  return ok();
}

export async function GET() {
  return new NextResponse("nicepay webhook endpoint", { status: 200 });
}
