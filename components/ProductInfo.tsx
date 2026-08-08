"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  won,
  discountRate,
  isSoldOut,
  type Product,
} from "@/lib/product-types";
import { useStore } from "./StoreProvider";

const TABS = ["DELIVERY", "DETAILS", "SIZE GUIDE"] as const;

const TAB_CONTENT: Record<(typeof TABS)[number], string[]> = {
  DELIVERY: [
    "70,000원 이상 구매 시 무료배송 (미만 3,000원)",
    "오후 2시 이전 결제 완료 시 당일 출고",
    "출고 후 평균 1~3일 내 수령 (도서산간 제외)",
  ],
  DETAILS: [
    "소재 : 상품 상세 설명 참고",
    "제조국 : 한국",
    "세탁 시 단독 손세탁을 권장합니다.",
  ],
  "SIZE GUIDE": [
    "S : 총장 68 / 가슴단면 58 / 소매길이 60",
    "M : 총장 70 / 가슴단면 61 / 소매길이 62",
    "L : 총장 72 / 가슴단면 64 / 소매길이 64",
  ],
};

export default function ProductInfo({ product }: { product: Product }) {
  // 상품명과 일치하는 컬러(예: "... IN WHITE" → WHITE)를 기본 선택
  const [color, setColor] = useState(() => {
    const i = product.colors.findIndex((c) =>
      product.name.toUpperCase().includes(`IN ${c.name.toUpperCase()}`)
    );
    return i === -1 ? 0 : i;
  });
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [tab, setTab] = useState<(typeof TABS)[number]>("DELIVERY");
  const [notice, setNotice] = useState<string | null>(null);

  const router = useRouter();
  const { addToCart, toggleWishlist, inWishlist, ready } = useStore();

  const rate = discountRate(product.price, product.originalPrice);
  const sold = isSoldOut(product);
  const wished = ready && inWishlist(product.slug);

  function buildItem() {
    return {
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size ?? "FREE",
      color: product.colors[color]?.name ?? "",
      qty: 1,
    };
  }

  function handleAdd(goToCart: boolean) {
    if (product.sizes.length > 0 && !size) {
      setNotice("사이즈를 선택해 주세요.");
      return;
    }
    addToCart(buildItem());
    setNotice(null);
    if (goToCart) router.push("/cart");
    else setNotice("장바구니에 담았습니다.");
  }

  return (
    <div>
      <h1 className="mt-4 text-[26px] leading-tight lg:text-[30px]">
        {product.name}
      </h1>
      {product.sku && (
        <p className="mt-3 text-[12px] tracking-wide text-neutral-500">
          {product.sku}
        </p>
      )}

      {product.description.length > 0 && (
        <div className="mt-5 space-y-1 text-[13px] text-neutral-400">
          {product.description.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}

      <p className="mt-6 flex items-baseline gap-3">
        <span className="text-[26px] font-bold">{won(product.price)}</span>
        {rate > 0 && (
          <>
            <span className="text-[15px] font-medium text-red-500">{rate}%</span>
            <span className="text-[15px] text-neutral-400 line-through">
              {won(product.originalPrice!)}
            </span>
          </>
        )}
      </p>

      {/* COLOR */}
      {product.colors.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <p className="text-[12px] tracking-[0.14em] text-neutral-600">COLOR</p>
            <p className="text-[13px]">{product.colors[color]?.name}</p>
          </div>
          <div className="mt-3 flex gap-3">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                aria-label={c.name}
                onClick={() => setColor(i)}
                className={`h-5 w-5 rounded-full border ${
                  i === color
                    ? "border-black ring-1 ring-black ring-offset-2"
                    : "border-neutral-300"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* SIZE */}
      {product.sizes.length > 0 && (
        <div className="mt-8">
          <p className="text-[12px] tracking-[0.14em] text-neutral-600">SIZE</p>
          {/* 사이즈가 많아도 모바일에서 찌그러지지 않도록 최소 폭을 두고 줄바꿈 */}
          <div className="mt-3 grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-3 sm:gap-4">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setNotice(null);
                }}
                className={`border-b pb-2 text-center text-[13px] transition-colors ${
                  size === s
                    ? "border-black font-medium"
                    : "border-neutral-300 text-neutral-500 hover:border-black hover:text-black"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {notice && (
        <p className="mt-5 text-[12px] text-neutral-600">{notice}</p>
      )}

      {/* 구매 버튼 */}
      <div className="mt-8 flex">
        {sold ? (
          <button
            disabled
            className="h-14 flex-1 bg-neutral-200 text-[13px] tracking-[0.1em] text-neutral-400"
          >
            SOLD OUT
          </button>
        ) : (
          <>
            <button
              onClick={() => handleAdd(true)}
              className="h-14 flex-[1.6] bg-black text-[13px] tracking-[0.1em] text-white transition-opacity hover:opacity-85"
            >
              BUY IT NOW
            </button>
            <button
              onClick={() => handleAdd(false)}
              className="h-14 flex-1 border border-l-0 border-neutral-300 text-[13px] tracking-[0.1em] transition-colors hover:border-black"
            >
              ADD TO BAG
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => toggleWishlist(product.slug)}
        className="mt-5 flex items-center gap-2 text-[13px] hover:opacity-60"
      >
        <svg
          viewBox="0 0 24 24"
          fill={wished ? "currentColor" : "none"}
          strokeWidth="1.5"
          className="h-4 w-4 stroke-current"
        >
          <path d="M12 20.5C7 16.5 3.5 13.3 3.5 9.6 3.5 7 5.5 5 8 5c1.6 0 3.1.8 4 2.1C12.9 5.8 14.4 5 16 5c2.5 0 4.5 2 4.5 4.6 0 3.7-3.5 6.9-8.5 10.9Z" />
        </svg>
        {wished ? "Added to Wishlist" : "Add to Wishlist"}
      </button>

      {/* 하단 탭 */}
      <div className="mt-14">
        <div className="flex gap-8 border-b border-neutral-200 text-[12px] tracking-[0.12em]">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 ${
                tab === t
                  ? "border-b border-black font-medium"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <ul className="mt-5 space-y-1.5 text-[13px] leading-relaxed text-neutral-500">
          {TAB_CONTENT[tab].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
