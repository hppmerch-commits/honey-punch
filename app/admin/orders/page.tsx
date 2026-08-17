import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listOrdersForAdmin } from "@/lib/orders";
import { won } from "@/lib/product-types";
import {
  ORDER_STATUSES,
  statusLabel,
  statusTone,
  formatOrderDate,
} from "@/lib/order-types";
import AdminShell from "../AdminShell";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; page?: string }>;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const sp = await searchParams;
  const status = ORDER_STATUSES.includes(
    sp.status as (typeof ORDER_STATUSES)[number]
  )
    ? sp.status
    : undefined;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  const { orders, total, pendingCount, totalPages } = await listOrdersForAdmin({
    status,
    page,
  });

  const filterHref = (s?: string) =>
    s ? `/admin/orders?status=${s}` : "/admin/orders";
  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  };

  /** 상품 요약: 첫 상품명 외 N건 */
  const itemsSummary = (o: (typeof orders)[number]) => {
    const first = o.items[0];
    if (!first) return "—";
    const rest = o.items.length - 1;
    return rest > 0 ? `${first.name} 외 ${rest}건` : first.name;
  };

  return (
    <AdminShell title="주문 관리">
      {/* 상태 필터 */}
      <nav className="-mx-1 flex flex-wrap gap-1 text-[13px] lg:text-[12px]">
        <Link
          href={filterHref()}
          className={`flex h-11 items-center px-3 active:opacity-50 ${
            !status
              ? "text-black underline underline-offset-4"
              : "text-neutral-500 lg:hover:text-black"
          }`}
        >
          전체
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={filterHref(s)}
            className={`flex h-11 items-center gap-1.5 px-3 active:opacity-50 ${
              status === s
                ? "text-black underline underline-offset-4"
                : "text-neutral-500 lg:hover:text-black"
            }`}
          >
            {statusLabel(s)}
            {s === "PENDING" && pendingCount > 0 && (
              <b className="rounded-full bg-amber-100 px-1.5 text-[11px] text-amber-700">
                {pendingCount}
              </b>
            )}
          </Link>
        ))}
      </nav>

      <p className="mt-4 text-[13px] text-neutral-500 lg:text-[12px]">
        {status ? `${statusLabel(status)} ` : "전체 "}
        <b className="text-black">{total}</b>건
      </p>

      {orders.length === 0 ? (
        <p className="mt-6 border border-dashed border-neutral-300 py-20 text-center text-[13px] text-neutral-400">
          {status ? `${statusLabel(status)} 상태의 주문이 없습니다.` : "아직 주문이 없습니다."}
        </p>
      ) : (
        <>
          {/* 모바일: 카드 */}
          <ul className="mt-6 space-y-3 lg:hidden">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/${o.id}`}
                  className="block border border-neutral-200 p-4 active:bg-neutral-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[12px] tracking-wide">
                      {o.orderNumber}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${statusTone(o.status)}`}
                    >
                      {statusLabel(o.status)}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-[13px]">{itemsSummary(o)}</p>
                  <p className="mt-1.5 flex justify-between text-[12px] text-neutral-500">
                    <span>
                      {o.customerName} · {formatOrderDate(o.createdAt)}
                    </span>
                    <b className="text-black">{won(o.total)}</b>
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          {/* 데스크톱: 테이블 */}
          <div className="mt-6 hidden overflow-x-auto lg:block">
            <table className="w-full border-t border-neutral-200 text-left text-[12px]">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400">
                  <th className="py-3 pr-4 font-normal">주문번호</th>
                  <th className="py-3 pr-4 font-normal">일시</th>
                  <th className="py-3 pr-4 font-normal">주문자</th>
                  <th className="py-3 pr-4 font-normal">상품</th>
                  <th className="py-3 pr-4 text-right font-normal">금액</th>
                  <th className="py-3 font-normal">상태</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50"
                  >
                    <td className="py-3.5 pr-4">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono tracking-wide underline-offset-4 hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 pr-4 text-neutral-500">
                      {formatOrderDate(o.createdAt)}
                    </td>
                    <td className="py-3.5 pr-4">{o.customerName}</td>
                    <td className="max-w-[280px] truncate py-3.5 pr-4">
                      {itemsSummary(o)}
                    </td>
                    <td className="py-3.5 pr-4 text-right font-medium">
                      {won(o.total)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] ${statusTone(o.status)}`}
                      >
                        {statusLabel(o.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="mt-8 flex justify-center gap-1 text-[13px]">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  className={`flex h-11 min-w-11 items-center justify-center ${
                    n === page
                      ? "font-medium text-black underline underline-offset-4"
                      : "text-neutral-400 lg:hover:text-black"
                  }`}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </>
      )}
    </AdminShell>
  );
}
