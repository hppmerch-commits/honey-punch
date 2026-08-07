"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/product-types";
import { useStore } from "@/components/StoreProvider";

export default function WishlistView({ products }: { products: Product[] }) {
  const { wishlist, ready } = useStore();
  const items = products.filter((p) => wishlist.includes(p.slug));

  return (
    <main className="px-6 py-14 lg:px-12">
      <h1 className="text-[26px] leading-none lg:text-[30px]">위시리스트</h1>

      {!ready ? (
        <p className="mt-10 text-[13px] text-neutral-400">불러오는 중…</p>
      ) : items.length === 0 ? (
        <div className="mt-16 border border-dashed border-neutral-200 py-24 text-center">
          <p className="text-[13px] text-neutral-400">
            저장한 상품이 없습니다. 상품 상세에서 하트를 눌러보세요.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center bg-black px-8 text-[12px] tracking-[0.1em] text-white transition-opacity hover:opacity-85"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
