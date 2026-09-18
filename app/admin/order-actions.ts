"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { cancelOrder, OrderError } from "@/lib/orders";
import { isBankCode } from "@/lib/banks";

function refresh(id: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

// 상태 전이는 updateMany로 조건부 실행한다 — 이미 전이된 주문에서
// 버튼이 중복 클릭돼도(뒤로가기·이중 제출) 에러 없이 무시된다.

/**
 * 입금 확인 — PENDING → PAID.
 * 무통장입금 전용이다. 나이스페이먼츠를 거친 주문은 PG가 실제 승인·입금을 통보해야
 * 결제 완료가 되어야 하므로, 여기서 손으로 바꾸면 돈이 안 들어온 주문이 배송된다.
 */
export async function markPaidAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.order.updateMany({
    where: { id, status: "PENDING", paymentMethod: "BANK_TRANSFER" },
    data: { status: "PAID", paidAt: new Date() },
  });
  refresh(id);
}

/** 배송 시작 — PAID → SHIPPED (택배사/송장 입력) */
export async function shipOrderAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const courier = String(formData.get("courier") ?? "").trim().slice(0, 50);
  const trackingNumber = String(formData.get("trackingNumber") ?? "")
    .trim()
    .slice(0, 50);
  await prisma.order.updateMany({
    where: { id, status: "PAID" },
    data: { status: "SHIPPED", courier, trackingNumber },
  });
  refresh(id);
}

/** 배송 완료 — SHIPPED → DONE */
export async function completeOrderAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.order.updateMany({
    where: { id, status: "SHIPPED" },
    data: { status: "DONE" },
  });
  refresh(id);
}

/** 주문 취소 — 재고 복원 포함. 현금성 결제는 환불계좌를 같이 받는다. */
export async function cancelOrderAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");

  const bankCode = String(formData.get("refundBankCode") ?? "").trim();
  const account = String(formData.get("refundAccount") ?? "").replace(/[^\d]/g, "");
  const holder = String(formData.get("refundHolder") ?? "").trim().slice(0, 20);
  const refund =
    isBankCode(bankCode) && account && holder ? { bankCode, account, holder } : undefined;

  let failure: string | null = null;
  try {
    await cancelOrder(id, "판매자 취소", refund);
  } catch (e) {
    if (!(e instanceof OrderError)) throw e;
    // 환불 실패 등은 관리자가 봐야 하므로 상세 화면에 띄운다.
    failure = e.message;
  }
  refresh(id);
  if (failure) redirect(`/admin/orders/${id}?error=${encodeURIComponent(failure)}`);
}

/** 취소된 주문 삭제 — 테스트 주문 정리용 */
export async function deleteOrderAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await prisma.order.deleteMany({ where: { id, status: "CANCELLED" } });
  revalidatePath("/admin/orders");
}
