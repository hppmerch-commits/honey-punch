"use client";

import type { NicepayLaunch } from "@/app/(store)/checkout/actions";

const SDK_URL = "https://pay.nicepay.co.kr/v1/js/";

type Authnice = {
  requestPay: (p: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    AUTHNICE?: Authnice;
  }
}

let loading: Promise<Authnice> | null = null;

/** SDK를 한 번만 내려받는다. 이미 있으면 바로 돌려준다. */
export function loadNicepay(): Promise<Authnice> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.AUTHNICE) return Promise.resolve(window.AUTHNICE);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SDK_URL;
    s.async = true;
    s.onload = () =>
      window.AUTHNICE ? resolve(window.AUTHNICE) : reject(new Error("AUTHNICE 없음"));
    s.onerror = () => {
      loading = null;
      reject(new Error("결제 모듈을 불러오지 못했습니다."));
    };
    document.head.appendChild(s);
  });
  return loading;
}

/**
 * 결제창 열기. 성공하면 나이스페이가 returnUrl로 브라우저를 보내므로 여기서는 돌아오지 않는다.
 * onError는 결제창 오류나 사용자가 창을 닫았을 때 불린다.
 */
export async function openNicepay(p: NicepayLaunch, onError: (msg: string) => void) {
  const sdk = await loadNicepay();
  sdk.requestPay({
    clientId: p.clientId,
    method: p.method,
    orderId: p.orderId,
    amount: p.amount,
    goodsName: p.goodsName,
    returnUrl: p.returnUrl,
    buyerName: p.buyerName,
    buyerTel: p.buyerTel,
    buyerEmail: p.buyerEmail,

    // 가상계좌: 입금자명은 규격상 필수. 기한은 기본 D+7을 쓰지 않고 3일로 줄인다
    // (그만큼 재고가 묶여 있으므로).
    ...(p.method === "vbank"
      ? { vbankHolder: p.vbankHolder ?? p.buyerName, vbankValidHours: 72 }
      : {}),

    // 휴대폰 결제: 실물 배송 상품이므로 디지털 콘텐츠가 아니다.
    ...(p.method === "cellphone" ? { isDigital: false } : {}),

    fnError: (r: { errorMsg?: string; resultMsg?: string }) =>
      onError(r?.errorMsg || r?.resultMsg || "결제가 취소되었습니다."),
  });
}
