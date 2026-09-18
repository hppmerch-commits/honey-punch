import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders";
import { won } from "@/lib/product-types";
import {
  statusLabel,
  paymentMethodLabel,
  formatOrderDate,
  isPgMethod,
  isCashMethod,
  needsRefundAccount,
} from "@/lib/order-types";
import { bankTransfer, hasBankInfo } from "@/lib/site";
import { btnOutline, sectionLabel } from "@/lib/ui";
import PayAgainButton from "@/components/nicepay/PayAgainButton";
import ClearCart from "@/components/ClearCart";
import CancelOrderForm from "@/components/CancelOrderForm";

export const metadata = { title: "주문 완료 — HONEY PUNCH" };
export const dynamic = "force-dynamic";

export default async function OrderCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ no: string }>;
  searchParams: Promise<{ pay?: string; msg?: string; paid?: string; issued?: string }>;
}) {
  const { no } = await params;
  const sp = await searchParams;
  const order = await getOrderByNumber(decodeURIComponent(no));
  if (!order) notFound();

  const pg = isPgMethod(order.paymentMethod);
  /** 가상계좌가 발급된 상태 — 결제창을 다시 열 게 아니라 그 계좌로 입금해야 한다 */
  const vbankIssued = order.paymentMethod === "VBANK" && Boolean(order.pgVbankNumber);
  /** 결제창이 닫혀 결제가 끝나지 않은 상태 */
  const pgUnpaid = pg && order.status === "PENDING" && !vbankIssued;
  const pgPaid = pg && order.status === "PAID";
  /** 무통장입금은 우리가 통장을 보고 직접 확인하므로 자동 환불이 안 된다 */
  const manualBankPaid = order.paymentMethod === "BANK_TRANSFER" && order.status === "PAID";
  const cancellable = order.status === "PENDING" || pgPaid;
  const heading = order.status === "CANCELLED"
    ? "취소된 주문입니다"
    : pgUnpaid
      ? "결제가 완료되지 않았습니다"
      : vbankIssued && order.status === "PENDING"
        ? "입금을 기다리고 있습니다"
        : pgPaid
          ? "결제가 완료되었습니다"
          : "주문이 접수되었습니다";

  return (
    <main className="px-6 py-14 lg:px-12">
      <div className="mx-auto max-w-[640px]">
        <p className="text-[11px] tracking-[0.16em] text-neutral-400">ORDER</p>
        <h1 className="mt-3 text-[26px] leading-snug lg:text-[30px]">
          {heading}
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
          주문번호 <b className="text-[#1e1e1e]">{order.orderNumber}</b> ·{" "}
          {formatOrderDate(order.createdAt)}
          <br />
          {paymentMethodLabel(order.paymentMethod)} · 현재 상태:{" "}
          {statusLabel(order.status, order.paymentMethod)}
        </p>

        {/* 결제가 끝났거나 계좌가 발급된 주문 → 장바구니 비움 (다시 결제할 게 남았으면 그대로 둔다) */}
        {!pgUnpaid && order.status !== "CANCELLED" && <ClearCart />}

        {/* 결제 미완료 — 실패 사유 + 다시 결제 */}
        {pgUnpaid && (
          <div className="mt-8 border border-[#1e1e1e] px-5 py-5">
            <p className="text-[13px] tracking-[0.08em]">결제 안내</p>
            <p className="mt-2 break-keep text-[13px] leading-relaxed text-neutral-600">
              {sp.pay === "failed" && sp.msg
                ? `결제가 진행되지 않았습니다: ${sp.msg}`
                : "결제창이 닫혀 결제가 진행되지 않았습니다."}{" "}
              아래 버튼으로 다시 결제하실 수 있습니다. 주문 내용은 그대로 보관됩니다.
            </p>
            <PayAgainButton
              orderNumber={order.orderNumber}
              amountLabel={won(order.total)}
            />
          </div>
        )}

        {/* 가상계좌 발급 완료 — 입금 대기 */}
        {vbankIssued && order.status === "PENDING" && (
          <div className="mt-8 border border-[#1e1e1e] px-5 py-5">
            <p className="text-[13px] tracking-[0.08em]">가상계좌 입금 안내</p>
            <p className="mt-2 text-[14px] leading-relaxed">
              {order.pgVbankName}{" "}
              <b className="tracking-wide">{order.pgVbankNumber}</b>
              <br />
              예금주: {order.pgVbankHolder}
            </p>
            <p className="mt-2 break-keep text-[12px] leading-relaxed text-neutral-500">
              {won(order.total)}원을
              {order.pgVbankExpAt && ` ${formatOrderDate(order.pgVbankExpAt)}까지`} 입금해
              주세요. 입금이 확인되면 자동으로 배송 준비가 시작됩니다. 기한이 지나면 주문은
              자동으로 취소됩니다.
            </p>
          </div>
        )}

        {/* 결제 완료 */}
        {pgPaid && (
          <div className="mt-8 border border-neutral-200 px-5 py-5">
            <p className="text-[13px] tracking-[0.08em]">결제 정보</p>
            <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
              {paymentMethodLabel(order.paymentMethod)}
              {order.pgCardName && ` · ${order.pgCardName}`}
              {order.pgBankName && ` · ${order.pgBankName}`}
              {" · "}
              {won(order.total)} {order.paymentMethod === "VBANK" ? "입금 확인" : "결제 완료"}
              {order.paidAt && ` · ${formatOrderDate(order.paidAt)}`}
              <br />
              별도 확인 절차 없이 바로 배송 준비가 시작됩니다.
            </p>
          </div>
        )}

        {/* 무통장입금 안내 */}
        {order.paymentMethod === "BANK_TRANSFER" && order.status === "PENDING" && (
          <div className="mt-8 border border-[#1e1e1e] px-5 py-5">
            <p className="text-[13px] tracking-[0.08em]">무통장입금 안내</p>
            {hasBankInfo() ? (
              <p className="mt-2 text-[14px] leading-relaxed">
                {bankTransfer.bank}{" "}
                <b className="tracking-wide">{bankTransfer.account}</b>
                <br />
                예금주: {bankTransfer.holder}
                <br />
                <span className="text-[12px] text-neutral-500">
                  {won(order.total)}원을 입금해 주시면 확인 후 배송이 시작됩니다.
                </span>
              </p>
            ) : (
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
                입금 계좌는 주문 확인 연락을 통해 안내드립니다. 입금 확인 후
                배송이 시작됩니다.
              </p>
            )}
          </div>
        )}

        {/* 주문 상품 */}
        <ul className="mt-10 border-t border-neutral-200">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 border-b border-neutral-100 py-5"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#f2f1ef]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-snug">{item.name}</p>
                <p className="mt-1 text-[12px] text-neutral-400">
                  {[item.color, item.size].filter(Boolean).join(" / ")} ·{" "}
                  {item.qty}개
                </p>
              </div>
              <span className="shrink-0 text-[13px] font-medium">
                {won(item.unitPrice * item.qty)}
              </span>
            </li>
          ))}
        </ul>

        {/* 금액 */}
        <dl className="mt-6 space-y-2.5 text-[13px]">
          <div className="flex justify-between">
            <dt className="text-neutral-500">상품 금액</dt>
            <dd>{won(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">배송비</dt>
            <dd>{order.shippingFee === 0 ? "무료" : won(order.shippingFee)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-neutral-200 pt-4">
            <dt>결제 금액</dt>
            <dd className="text-[20px] font-bold">{won(order.total)}</dd>
          </div>
        </dl>

        {/* 배송지 */}
        <section className="mt-10">
          <h2 className={sectionLabel}>배송지</h2>
          <p className="mt-3 text-[13px] leading-relaxed text-neutral-600">
            {order.customerName} · {order.phone}
            <br />
            {order.postcode && `(${order.postcode}) `}
            {order.address1} {order.address2}
            {order.memo && (
              <>
                <br />
                <span className="text-neutral-400">요청사항: {order.memo}</span>
              </>
            )}
          </p>
        </section>

        <p className="mt-10 break-keep text-[12px] leading-relaxed text-neutral-500">
          이 페이지 주소를 저장해두시면 언제든 주문 내용을 다시 확인하실 수
          있습니다. 주소를 잃어버리셨다면{" "}
          <Link
            href="/order-lookup"
            className="underline underline-offset-2 hover:text-black"
          >
            주문조회
          </Link>
          에서 주문번호와 연락처로 다시 찾으실 수 있습니다.
        </p>

        {/* 고객 취소 — 결제 대기 / 카드 결제 완료만 자동 취소, 무통장 입금 완료는 안내 */}
        {cancellable && (
          <section className="mt-10">
            <h2 className={sectionLabel}>주문 취소</h2>
            <CancelOrderForm
              orderNumber={order.orderNumber}
              isPaid={pgPaid}
              needsRefundAccount={needsRefundAccount(order)}
            />
          </section>
        )}
        {manualBankPaid && (
          <p className="mt-10 break-keep text-[12px] leading-relaxed text-neutral-500">
            입금이 확인된 무통장 주문은 환불 계좌 확인이 필요해 이 화면에서 바로 취소되지
            않습니다. 취소를 원하시면 주문번호와 함께 문의해 주세요.
          </p>
        )}
        {order.status === "CANCELLED" && pg && order.pgCancelledTid && (
          <p className="mt-8 break-keep text-[13px] leading-relaxed text-neutral-600">
            {isCashMethod(order.paymentMethod)
              ? "환불이 접수되었습니다. 은행에 따라 영업일 기준 1~3일 뒤 입금됩니다."
              : "결제 승인 취소가 완료되었습니다. 카드사·통신사에 따라 영업일 기준 1~5일 뒤 취소 내역이 표시됩니다."}
          </p>
        )}

        <Link
          href="/shop"
          className={`mt-8 ${btnOutline}`}
        >
          쇼핑 계속하기
        </Link>
      </div>
    </main>
  );
}
