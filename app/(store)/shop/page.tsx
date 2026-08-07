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

        {/* 카테고리 필터 */}
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
          <Link
            href="/shop"
            className={!category && !q ? "text-black underline underline-offset-4" : "text-neutral-500 hover:text-black"}
          >
            전체
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/shop?category=${c.key}`}
              className={
                category === c.key
                  ? "text-black underline underline-offset-4"
                  : "text-neutral-500 hover:text-black"
              }
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
        <nav className="mt-16 flex items-center justify-center gap-4 text-[13px] text-neutral-400">
          {page > 1 && (
            <Link href={pageHref(page - 1)} className="hover:text-black">
              &lsaquo;
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={pageHref(n)}
              className={
                n === page
                  ? "text-black underline underline-offset-4"
                  : "hover:text-black"
              }
            >
              {n}
            </Link>
          ))}
          {page < totalPages && (
            <Link href={pageHref(page + 1)} className="hover:text-black">
              &rsaquo;
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
