"use client";

import { useEffect } from "react";
import { useStore } from "./StoreProvider";

/** 결제가 끝난 주문 페이지에서 장바구니를 비운다 (카드 결제는 여기서만 비운다). */
export default function ClearCart() {
  const { clearCart, ready } = useStore();
  useEffect(() => {
    if (ready) clearCart();
  }, [ready, clearCart]);
  return null;
}
