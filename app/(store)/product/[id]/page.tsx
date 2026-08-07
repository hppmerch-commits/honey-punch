import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/products";
import ProductInfo from "@/components/ProductInfo";
import BrailleDots from "@/components/BrailleDots";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <main className="lg:grid lg:grid-cols-[58%_42%]">
      {/* 좌측: 이미지 영역 */}
      <div className="flex flex-col gap-2 bg-[#f2f1ef] p-2">
        {[0, 1].map((i) => (
          <div key={i} className="bg-[#f2f1ef]">
            <Image
              src={product.image}
              alt={product.name}
              width={800}
              height={1000}
              priority={i === 0}
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>

      {/* 우측: 상품 정보 (스크롤 시 고정) */}
      <div className="px-6 py-10 lg:sticky lg:top-16 lg:self-start lg:px-14 lg:py-16">
        <p className="text-[12px] text-neutral-400">
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>{" "}
          /{" "}
          <Link href="/shop" className="hover:text-black">
            New In
          </Link>
        </p>
        <ProductInfo product={product} />

        {/* 캠페인 스토리 배너 */}
        {product.campaignStory && (
          <Link
            href="/campaign"
            className="group mt-12 flex items-center justify-between border border-neutral-200 px-6 py-5 transition-colors hover:border-black"
          >
            <div className="flex items-center gap-4">
              <span className="flex gap-2" aria-hidden="true">
                <BrailleDots dots={[1, 2]} dotClassName="bg-[#d9a715]" emptyClassName="bg-neutral-100" />
                <BrailleDots dots={[1, 3, 5]} dotClassName="bg-[#d9a715]" emptyClassName="bg-neutral-100" />
              </span>
              <span>
                <span className="block text-[11px] tracking-[0.2em] text-neutral-400">
                  CAMPAIGN
                </span>
                <span className="mt-1 block text-[13px]">
                  손끝으로 고르는 오늘의 기분 — 이 티셔츠에 담긴 이야기
                </span>
              </span>
            </div>
            <span
              aria-hidden="true"
              className="text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-black"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </main>
  );
}
