import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { listProducts } from "@/lib/queries";
import { CATEGORIES, categoryLabel } from "@/lib/product-types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ category?: string; q?: string; page?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, q } = await searchParams;
  const title = q
    ? `"${q}" 검색 결과`
    : category
      ? categoryLabel(category)
      : "New In";
  return { title: `${title} — HONEY PUNCH` };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const category = sp.category;
  const q = sp.q?.trim() || undefined;

  const { products, total, totalPages } = await listProducts({
    category,
    query: q,
    page,
  });

  const heading = q ? `"${q}"` : category ? categoryLabel(category) : "New In";

  // 현재 필터를 유지한 채 페이지만 바꾸는 링크
  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    if (n > 1) params.set("page", String(n));
    const s = params.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  return (
    <main className="px-6 pt-10 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] leading-none lg:text-[30px]">{heading}</h1>
          <p className="mt-2 text-[12px] text-neutral-400">{total}개의 상품</p>
        </div>

        {/* 카테고리 필터 — 모바일에서는 가로 스크롤 칩, 각 항목 44px 터치 영역 */}
        <nav className="-mx-6 flex gap-1 overflow-x-auto px-6 text-[13px] [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:px-0 lg:text-[12px] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/shop"
            className={`flex h-11 shrink-0 items-center px-3 active:opacity-50 ${
              !category && !q
                ? "text-black underline underline-offset-4"
                : "text-neutral-500 lg:hover:text-black"
            }`}
          >
            전체
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/shop?category=${c.key}`}
              className={`flex h-11 shrink-0 items-center px-3 active:opacity-50 ${
                category === c.key
                  ? "text-black underline underline-offset-4"
                  : "text-neutral-500 lg:hover:text-black"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </nav>
      </div>

      {products.length === 0 ? (
        <p className="mt-20 border border-dashed border-neutral-200 py-24 text-center text-[13px] text-neutral-400">
          {q ? `"${q}"에 해당하는 상품이 없습니다.` : "등록된 상품이 없습니다."}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-16 flex flex-wrap items-center justify-center gap-1 text-[14px] text-neutral-400">
          {page > 1 && (
            <Link
              href={pageHref(page - 1)}
              aria-label="이전 페이지"
              className="flex h-11 w-11 items-center justify-center active:opacity-50 lg:hover:text-black"
            >
              &lsaquo;
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              aria-label={`${n}페이지`}
              aria-current={n === page ? "page" : undefined}
              className={`flex h-11 w-11 items-center justify-center active:opacity-50 ${
                n === page
                  ? "font-medium text-black underline underline-offset-4"
                  : "lg:hover:text-black"
              }`}
            >
              {n}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={pageHref(page + 1)}
              aria-label="다음 페이지"
              className="flex h-11 w-11 items-center justify-center active:opacity-50 lg:hover:text-black"
            >
              &rsaquo;
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
