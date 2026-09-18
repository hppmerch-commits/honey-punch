"use client";

import { useState } from "react";
import { relaunchPaymentAction } from "@/app/(store)/checkout/actions";
import { openNicepay } from "./launch";
import { btnPrimary } from "@/lib/ui";

/** 결제창을 닫았거나 실패한 주문을 주문 상세에서 다시 결제한다. 수단은 주문에 저장된 것을 쓴다. */
export default function PayAgainButton({
  orderNumber,
  amountLabel,
}: {
  orderNumber: string;
  amountLabel: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setBusy(true);
    setError(null);
    try {
      const r = await relaunchPaymentAction(orderNumber);
      if (!r.ok) {
        setError(r.error);
        setBusy(false);
        return;
      }
      await openNicepay(r.pay, (msg) => {
        setError(msg);
        setBusy(false);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "결제창을 열지 못했습니다.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-5">
      <button type="button" onClick={pay} disabled={busy} className={btnPrimary}>
        {busy ? "결제창 여는 중…" : `${amountLabel} 결제하기`}
      </button>
      <p role="alert" aria-live="polite" className="min-h-[1px]">
        {error && (
          <span className="mt-3 block text-[12px] leading-relaxed text-red-600">
            {error}
          </span>
        )}
      </p>
    </div>
  );
}
