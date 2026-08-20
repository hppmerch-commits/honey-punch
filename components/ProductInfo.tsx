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

type InfoGroup = { label?: string; lines: string[] };

const TEXT_TABS: Record<"DELIVERY" | "DETAILS", InfoGroup[]> = {
  DELIVERY: [
    {
      lines: [
        "9월까지 무료배송 이벤트",
        "결제 완료 후 배송 4~7일 소요",
        "출고 후 1~3일 내 수령",
      ],
    },
  ],
  DETAILS: [
    {
      label: "소재",
      lines: [
        "식물성 친환경 기능성 원단(소로나) 함유",
        "알레르기 케어가 가능하며 통풍이 잘되고 흡습성이 좋음",
        "세탁 후 수축 안정화 및 구김이 적고 형태 변형율이 낮음",
        "30수를 사용하여 촉감이 부드럽고 탄탄하면서도 유연한 소재",
        "우수한 보풀 방지 성능",
      ],
    },
    {
      label: "디테일",
      lines: [
        "왼쪽 소매 끝에 시각장애인들도 색상을 확인할 수 있는 색상 점자 패치 삽입",
        "정사이즈보다 약간 루즈한 세미 오버핏. 남녀노소 연령대를 불문하고 착용 가능한 베이직 핏",
        "소매 길이를 일반적인 반팔보다 길게 하여 팔뚝 보완에 용이",
        "어깨부터 암홀, 밑단까지 스트레이트로 떨어지는 일자핏으로 깔끔한 실루엣",
      ],
    },
    {
      label: "제조국",
      lines: ["Design Korea, Made in China (중국 국가 표준 브랜드 제품 요구사항 준수)"],
    },
  ],
};

export default function ProductInfo({ product }: { product: Product }) {
  // 상품명에 들어간 컬러를 기본 선택 ("...티셔츠 화이트" → 화이트, "... IN WHITE" → WHITE)
  const [color, setColor] = useState(() => {
    const name = product.name.toUpperCase();
    const i = product.colors.findIndex((c) =>
      name.includes(c.name.toUpperCase())
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
          {/* 스와치는 20px지만 버튼 자체는 44px 터치 영역을 갖는다 */}
          <div className="mt-1 -ml-3 flex">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                aria-label={c.name}
                aria-pressed={i === color}
                onClick={() => setColor(i)}
                className="flex h-11 w-11 items-center justify-center active:opacity-60"
              >
                <span
                  className={`block h-5 w-5 rounded-full border ${
                    i === color
                      ? "border-black ring-1 ring-black ring-offset-2"
                      : "border-neutral-300"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              </button>
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
                aria-pressed={size === s}
                className={`flex h-11 items-center justify-center border-b text-center text-[14px] transition-colors active:opacity-60 ${
                  size === s
                    ? "border-black font-medium"
                    : "border-neutral-300 text-neutral-500 lg:hover:border-black lg:hover:text-black"
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
              className="h-14 flex-[1.4] bg-black text-[13px] tracking-[0.1em] text-white transition-opacity active:opacity-70 lg:hover:opacity-85"
            >
              BUY IT NOW
            </button>
            <button
              onClick={() => handleAdd(false)}
              className="h-14 flex-1 border border-l-0 border-neutral-300 text-[13px] tracking-[0.1em] transition-colors active:bg-neutral-50 lg:hover:border-black"
            >
              ADD TO BAG
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => toggleWishlist(product.slug)}
        className="mt-3 flex h-11 items-center gap-2 text-[14px] active:opacity-50 lg:hover:opacity-60"
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
        <div className="flex gap-5 border-b border-neutral-200 text-[12px] tracking-[0.12em] sm:gap-8">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`flex h-11 items-center active:opacity-60 ${
                tab === t
                  ? "border-b border-black font-medium"
                  : "text-neutral-400 lg:hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "SIZE GUIDE" ? (
          product.sizeChart.length > 0 ? (
            <div className="mt-5">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[280px] border-collapse text-[14px] lg:text-[13px]">
                  <caption className="sr-only">
                    {product.name} 실측 사이즈표 (단위 cm)
                  </caption>
                  <thead>
                    <tr className="border-y border-neutral-200 text-neutral-400">
                      <th scope="col" className="py-2.5 pr-3 text-left font-normal">
                        구분
                      </th>
                      {product.sizes.map((s) => (
                        <th
                          key={s}
                          scope="col"
                          className="py-2.5 text-center font-normal"
                        >
                          {s}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.map((row) => (
                      <tr key={row.label} className="border-b border-neutral-100">
                        <th
                          scope="row"
                          className="py-2.5 pr-3 text-left font-normal text-neutral-500"
                        >
                          {row.label}
                        </th>
                        {product.sizes.map((s, i) => (
                          <td key={s} className="py-2.5 text-center">
                            {row.values[i] ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-neutral-400">
                단위 cm · 평면 실측이라 측정 방법에 따라 1~3cm 오차가 있을 수 있습니다.
              </p>
            </div>
          ) : (
            <p className="mt-5 text-[14px] text-neutral-400 lg:text-[13px]">
              사이즈 정보가 준비 중입니다.
            </p>
          )
        ) : (
          <div className="mt-5 space-y-6">
            {TEXT_TABS[tab].map((group, gi) => (
              <div key={group.label ?? gi}>
                {group.label && (
                  <p className="text-[11px] tracking-[0.16em] text-neutral-400">
                    {group.label}
                  </p>
                )}
                <ul
                  className={`space-y-2 text-[14px] leading-relaxed text-neutral-500 lg:text-[13px] ${
                    group.label ? "mt-2" : ""
                  }`}
                >
                  {group.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
