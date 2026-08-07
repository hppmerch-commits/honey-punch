import Image from "next/image";
import Link from "next/link";
import { won, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-[#f2f1ef]">
        <Image
          src={product.image}
          alt={product.name}
          width={800}
          height={1000}
          className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="text-[12px] leading-snug tracking-wide">{product.name}</p>
        <p className="flex items-center gap-2 text-[12px]">
          {product.soldOut ? (
            <span className="text-neutral-400">Sold out</span>
          ) : (
            <>
              <span>{won(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="font-medium text-red-500">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}
                    %
                  </span>
                  <span className="text-neutral-400 line-through">
                    {won(product.originalPrice)}
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
