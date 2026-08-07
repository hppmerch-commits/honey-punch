import Image from "next/image";
import Link from "next/link";
import {
  won,
  discountRate,
  isSoldOut,
  type Product,
} from "@/lib/product-types";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const rate = discountRate(product.price, product.originalPrice);
  const sold = isSoldOut(product);

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden bg-[#f2f1ef]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="text-[12px] leading-snug tracking-wide">{product.name}</p>
        <p className="flex items-center gap-2 text-[12px]">
          {sold ? (
            <span className="text-neutral-400">Sold out</span>
          ) : (
            <>
              <span>{won(product.price)}</span>
              {rate > 0 && (
                <>
                  <span className="font-medium text-red-500">{rate}%</span>
                  <span className="text-neutral-400 line-through">
                    {won(product.originalPrice!)}
                  </span>
                </>
              )}
            </>
          )}
        </p>
      </div>
    </Link>
  );
}
