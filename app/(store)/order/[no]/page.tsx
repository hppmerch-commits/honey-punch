import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders";
import { won } from "@/lib/product-types";
import { statusLabel, formatOrderDate } from "@/lib/order-types";
import { bankTransfer, hasBankInfo } from "@/lib/site";

export const metadata = { title: "주문 완료 — HONEY PUNCH" };
export const dynamic = "force-dynamic";

export default async function OrderCompletePage({
  params,
}: {
  params: Promise<{ no: string }>;
}) {
  const { no } = await params;
  const order = await getOrderByNumber(decodeURIComponent(no));
  if (!order) notFound();

  return (
    <main className="px-6 py-14 lg:px-12">
      <div className="mx-auto max-w-[640px]">
        <p className="text-[11px] tracking-[0.16em] text-neutral-400">ORDER</p>
        <h1 className="mt-3 text-[26px] leading-snug lg:text-[30px]">
          주문이 접수되었습니다
        </h1>
        <p className="mt-3 text-[13px] leading-relaxed text-neutral-500">
          주문번호 <b className="text-black">{order.orderNumber}</b> ·{" "}
          {formatOrderDate(order.createdAt)}
          <br />
          현재 상태: {statusLabel(order.status)}
        </p>

        {/* 입금 안내 */}
        {order.status === "PENDING" && (
          <div className="mt-8 border border-black px-5 py-5">
            <p className="text-[13px] tracking-[0.08em]">무통장입금 안내</p>
            {hasBankInfo() ? (
              <p className="mt-2 text-[14px] leading-relaxed">
                {bankTransfer.bank}{" "}
                <b className="tracking-wide">{bankTransfer.account}</b>
                <br />
                예금주: {bankTransfer.holder}
                <br />
                <span className="text-[12px] text-neutral-500">
                  {won(order.total)}을 입금해 주시면 확인 후 배송이 시작됩니다.
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
          <h2 className="text-[13px] tracking-[0.12em]">배송지</h2>
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

        <p className="mt-10 text-[12px] leading-relaxed text-neutral-400">
          주문 관련 문의는 주문번호와 함께 남겨주세요. 이 페이지 주소를
          저장해두시면 언제든 주문 내용을 다시 확인할 수 있습니다.
        </p>

        <Link
          href="/shop"
          className="mt-8 flex h-12 w-full items-center justify-center border border-neutral-300 text-[12px] tracking-[0.1em] transition-colors hover:border-black"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </main>
  );
}
