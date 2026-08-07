import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function ShopPage() {
  const featured = products.slice(0, 2);
  const rest = products.slice(2);

  return (
    <main className="px-6 pt-10 lg:px-12">
      {/* 타이틀 + 서브 페이지 인디케이터 */}
      <div className="flex items-end justify-between">
        <h1 className="text-[26px] leading-none lg:text-[30px]">New In</h1>
        <div className="flex gap-1.5">
          {[2, 3, 4].map((n) => (
            <span
              key={n}
              className="flex h-7 w-7 items-center justify-center border border-neutral-300 text-[12px] text-neutral-500 hover:border-black hover:text-black"
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* 상단 대형 2열 */}
      <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* 이하 4열 그리드 (모바일 2열) */}
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {rest.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* 페이지네이션 */}
      <nav className="mt-16 flex items-center justify-center gap-4 text-[13px] text-neutral-400">
        <span>&laquo;</span>
        <span>&lsaquo;</span>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <span
            key={n}
            className={n === 1 ? "text-black underline underline-offset-4" : "hover:text-black"}
          >
            {n}
          </span>
        ))}
        <span>&rsaquo;</span>
        <span>&raquo;</span>
      </nav>
    </main>
  );
}
