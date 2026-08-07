import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import ProductInfo from "@/components/ProductInfo";
import BrailleDots from "@/components/BrailleDots";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `${product.name} — HONEY PUNCH` : "HONEY PUNCH" };
}

export default async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  // 대표 이미지 + 추가 이미지. 추가 이미지가 없으면 대표 이미지를 한 번 더 보여준다.
  const gallery = product.images.length > 0
    ? [product.image, ...product.images]
    : [product.image, product.image];

  return (
    <main className="lg:grid lg:grid-cols-[58%_42%]">
      {/* 좌측: 이미지 */}
      <div className="flex flex-col gap-2 bg-[#f2f1ef] p-2">
        {gallery.map((src, i) => (
          <div key={i} className="relative aspect-4/5 bg-[#f2f1ef]">
            <Image
              src={src}
              alt={product.name}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* 우측: 상품 정보 */}
      <div className="px-6 py-10 lg:sticky lg:top-16 lg:self-start lg:px-14 lg:py-16">
        <p className="text-[12px] text-neutral-400">
          <Link href="/shop" className="hover:text-black">
            Shop
          </Link>{" "}
          /{" "}
          <Link href={`/shop?category=${product.category}`} className="hover:text-black">
            {product.category}
          </Link>
        </p>

        <ProductInfo product={product} />

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
