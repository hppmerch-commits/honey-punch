import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { listAllProductsForAdmin } from "@/lib/queries";
import { won, discountRate, categoryLabel } from "@/lib/product-types";
import AdminShell from "./AdminShell";
import { deleteProductAction, togglePublishedAction } from "./actions";

export default async function AdminProductsPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const products = await listAllProductsForAdmin();
  const visible = products.filter((p) => p.published).length;
  const outOfStock = products.filter((p) => p.soldOut || p.stock <= 0).length;

  return (
    <AdminShell
      title="상품 관리"
      action={
        <Link
          href="/admin/products/new"
          className="flex h-12 items-center bg-black px-6 text-[13px] tracking-[0.1em] text-white transition-opacity active:opacity-70 lg:h-11 lg:text-[12px] lg:hover:opacity-85"
        >
          + 상품 등록
        </Link>
      }
    >
      <div className="mb-6 flex gap-6 text-[13px] text-neutral-500 sm:gap-8 lg:text-[12px]">
        <span>전체 <b className="text-black">{products.length}</b></span>
        <span>노출중 <b className="text-black">{visible}</b></span>
        <span>품절 <b className="text-black">{outOfStock}</b></span>
      </div>

      {products.length === 0 ? (
        <p className="border border-dashed border-neutral-300 py-20 text-center text-[13px] text-neutral-400">
          등록된 상품이 없습니다. 우측 상단에서 상품을 등록해 주세요.
        </p>
      ) : (
        <>
        {/* 모바일: 카드 목록 */}
        <ul className="space-y-4 lg:hidden">
          {products.map((p) => {
            const rate = discountRate(p.price, p.originalPrice);
            const sold = p.soldOut || p.stock <= 0;
            return (
              <li key={p.id} className="flex gap-4 border border-neutral-200 p-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-[#f2f1ef]">
                  <Image src={p.image} alt="" fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="flex min-h-11 items-center text-[14px] leading-snug active:opacity-50 lg:hover:underline"
                  >
                    {p.name}
                  </Link>
                  <p className="mt-1 text-[11px] text-neutral-400">
                    {categoryLabel(p.category)} · 재고 {p.stock}
                  </p>
                  <p className="mt-1.5 text-[13px]">
                    {won(p.price)}
                    {rate > 0 && (
                      <span className="ml-1.5 text-[11px] text-red-500">{rate}%</span>
                    )}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-[13px]">
                    <span
                      className={`px-2 py-0.5 text-[11px] ${
                        sold
                          ? "bg-neutral-100 text-neutral-400"
                          : p.published
                            ? "bg-black text-white"
                            : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      {sold ? "품절" : p.published ? "노출중" : "숨김"}
                    </span>
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="flex h-11 min-w-11 items-center justify-center text-neutral-600 active:opacity-50"
                    >
                      수정
                    </Link>
                    <form action={togglePublishedAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="next" value={String(!p.published)} />
                      <button className="flex h-11 min-w-11 items-center justify-center text-neutral-600 active:opacity-50">
                        {p.published ? "숨기기" : "노출"}
                      </button>
                    </form>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className="flex h-11 min-w-11 items-center justify-center text-neutral-400 active:text-red-500">
                        삭제
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* 데스크톱: 표 */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] text-[13px]">
            <thead>
              <tr className="border-y border-neutral-200 text-left text-[11px] tracking-[0.1em] text-neutral-400">
                <th className="py-3 pr-4 font-normal">이미지</th>
                <th className="py-3 pr-4 font-normal">상품명</th>
                <th className="py-3 pr-4 font-normal">카테고리</th>
                <th className="py-3 pr-4 font-normal">가격</th>
                <th className="py-3 pr-4 font-normal">재고</th>
                <th className="py-3 pr-4 font-normal">상태</th>
                <th className="py-3 font-normal">관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const rate = discountRate(p.price, p.originalPrice);
                const sold = p.soldOut || p.stock <= 0;
                return (
                  <tr key={p.id} className="border-b border-neutral-100">
                    <td className="py-3 pr-4">
                      <div className="relative h-16 w-14 overflow-hidden bg-[#f2f1ef]">
                        <Image
                          src={p.image}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="hover:underline"
                      >
                        {p.name}
                      </Link>
                      <span className="mt-0.5 block text-[11px] text-neutral-400">
                        {p.sku || "품번 없음"} · /{p.slug}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-neutral-600">
                      {categoryLabel(p.category)}
                    </td>
                    <td className="py-3 pr-4">
                      {won(p.price)}
                      {rate > 0 && (
                        <span className="ml-1.5 text-[11px] text-red-500">
                          {rate}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{p.stock}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[11px] ${
                          sold
                            ? "bg-neutral-100 text-neutral-400"
                            : p.published
                              ? "bg-black text-white"
                              : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {sold ? "품절" : p.published ? "노출중" : "숨김"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3 text-[12px]">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-neutral-600 hover:text-black"
                        >
                          수정
                        </Link>
                        <form action={togglePublishedAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <input
                            type="hidden"
                            name="next"
                            value={String(!p.published)}
                          />
                          <button className="text-neutral-600 hover:text-black">
                            {p.published ? "숨기기" : "노출"}
                          </button>
                        </form>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <button className="text-neutral-400 hover:text-red-500">
                            삭제
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </>
      )}
    </AdminShell>
  );
}
