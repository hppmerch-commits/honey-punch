"use client";

import { useEffect, useRef } from "react";
import { useStore } from "./StoreProvider";

/**
 * 결제가 끝난 주문 페이지에서 장바구니를 비운다 (카드 결제는 여기서만 비운다).
 * 마운트 후 딱 한 번만 실행한다 — clearCart 함수 참조가 바뀌어도 다시 돌지 않게.
 */
export default function ClearCart() {
  const { clearCart, ready } = useStore();
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    clearCart();
  }, [ready, clearCart]);
  return null;
}
