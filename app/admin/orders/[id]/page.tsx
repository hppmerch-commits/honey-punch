import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getOrderById } from "@/lib/orders";
import { won } from "@/lib/product-types";
import {
  statusLabel,
  statusTone,
  formatOrderDate,
} from "@/lib/order-types";
import AdminShell from "../../AdminShell";
import {
  markPaidAction,
  shipOrderAction,
  completeOrderAction,
  cancelOrderAction,
  deleteOrderAction,
} from "../../order-actions";

export const dynamic = "force-dynamic";

const btn =
  "flex h-12 items-center justify-center px-6 text-[13px] tracking-[0.06em] transition-opacity active:opacity-70 lg:h-11 lg:text-[12px]";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <AdminShell
      title={`주문 ${order.orderNumber}`}
      action={
        <span
          className={`rounded-full px-3 py-1.5 text-[12px] ${statusTone(order.status)}`}
        >
          {statusLabel(order.status)}
        </span>
      }
    >
      <Link
        href="/admin/orders"
        className="text-[12px] text-neutral-400 underline-offset-4 hover:text-black hover:underline"
      >
        ← 주문 목록
      </Link>

      <div className="mt-6 gap-10 lg:grid lg:grid-cols-[1fr_360px]">
        <div>
          {/* 주문 상품 */}
          <section>
            <h2 className="text-[13px] tracking-[0.12em] text-neutral-500">
              주문 상품
            </h2>
            <ul className="mt-3 border-t border-neutral-200">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-neutral-100 py-4"
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
                      {won(item.unitPrice)} × {item.qty}
                    </p>
                  </div>
                  <span className="shrink-0 text-[13px] font-medium">
                    {won(item.unitPrice * item.qty)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-neutral-500">상품 금액</dt>
                <dd>{won(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">배송비</dt>
                <dd>
                  {order.shippingFee === 0 ? "무료" : won(order.shippingFee)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-neutral-200 pt-3">
                <dt>결제 금액</dt>
                <dd className="text-[18px] font-bold">{won(order.total)}</dd>
              </div>
            </dl>
          </section>

          {/* 주문자 / 배송지 */}
          <section className="mt-10">
            <h2 className="text-[13px] tracking-[0.12em] text-neutral-500">
              주문자 · 배송지
            </h2>
            <dl className="mt-3 border-t border-neutral-200 text-[13px]">
              {[
                ["주문자", order.customerName],
                ["연락처", order.phone],
                ["이메일", order.email || "—"],
                [
                  "주소",
                  `${order.postcode ? `(${order.postcode}) ` : ""}${order.address1} ${order.address2}`.trim(),
                ],
                ["요청사항", order.memo || "—"],
                ["주문 일시", formatOrderDate(order.createdAt)],
                ...(order.paidAt
                  ? [["입금 확인", formatOrderDate(order.paidAt)] as const]
                  : []),
                ...(order.trackingNumber
                  ? [
                      [
                        "송장",
                        `${order.courier} ${order.trackingNumber}`.trim(),
                      ] as const,
                    ]
                  : []),
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[92px_1fr] gap-3 border-b border-neutral-100 py-2.5 lg:grid-cols-[120px_1fr]"
                >
                  <dt className="text-neutral-400">{k}</dt>
                  <dd className="break-all">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {/* 상태 처리 */}
        <aside className="mt-10 h-fit space-y-4 border border-neutral-200 p-6 lg:sticky lg:top-24 lg:mt-0">
          <h2 className="text-[13px] tracking-[0.12em]">주문 처리</h2>

          {order.status === "PENDING" && (
            <>
              <form action={markPaidAction}>
                <input type="hidden" name="id" value={order.id} />
                <button className={`${btn} w-full bg-black text-white hover:opacity-85`}>
                  입금 확인
                </button>
              </form>
              <p className="text-[12px] leading-relaxed text-neutral-400">
                입금을 확인했다면 눌러주세요. 이후 배송 시작 단계로 넘어갑니다.
              </p>
            </>
          )}

          {order.status === "PAID" && (
            <form action={shipOrderAction} className="space-y-3">
              <input type="hidden" name="id" value={order.id} />
              <label className="block">
                <span className="mb-1.5 block text-[12px] text-neutral-500">
                  택배사
                </span>
                <input
                  name="courier"
                  placeholder="예: CJ대한통운"
                  className="h-12 w-full border border-neutral-300 px-4 text-[14px] outline-none focus:border-black"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[12px] text-neutral-500">
                  송장번호
                </span>
                <input
                  name="trackingNumber"
                  className="h-12 w-full border border-neutral-300 px-4 text-[14px] outline-none focus:border-black"
                />
              </label>
              <button className={`${btn} w-full bg-black text-white hover:opacity-85`}>
                배송 시작
              </button>
            </form>
          )}

          {order.status === "SHIPPED" && (
            <form action={completeOrderAction}>
              <input type="hidden" name="id" value={order.id} />
              <button className={`${btn} w-full bg-black text-white hover:opacity-85`}>
                배송 완료 처리
              </button>
            </form>
          )}

          {order.status === "DONE" && (
            <p className="text-[13px] text-neutral-500">
              배송이 완료된 주문입니다.
            </p>
          )}

          {order.status === "CANCELLED" && (
            <>
              <p className="text-[13px] text-neutral-500">
                취소된 주문입니다. 재고는 복원되었습니다.
              </p>
              <form action={deleteOrderAction}>
                <input type="hidden" name="id" value={order.id} />
                <button className={`${btn} w-full border border-red-200 text-red-500 hover:border-red-400`}>
                  주문 기록 삭제
                </button>
              </form>
            </>
          )}

          {(order.status === "PENDING" || order.status === "PAID") && (
            <form action={cancelOrderAction} className="border-t border-neutral-100 pt-4">
              <input type="hidden" name="id" value={order.id} />
              <button className={`${btn} w-full border border-neutral-300 text-neutral-500 hover:border-black hover:text-black`}>
                주문 취소 (재고 복원)
              </button>
            </form>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}
