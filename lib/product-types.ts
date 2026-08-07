/** 상품 카테고리 — DB에는 문자열로 저장된다. */
export const CATEGORIES = [
  { key: "outer", label: "Outerwear" },
  { key: "top", label: "Tops" },
  { key: "bottom", label: "Bottoms" },
  { key: "acc", label: "Accessories" },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]["key"];

export const categoryLabel = (key: string) =>
  CATEGORIES.find((c) => c.key === key)?.label ?? key;

export type ProductColor = { name: string; hex: string };

/** 화면에서 쓰는 상품 형태 — Prisma 레코드를 이 형태로 정규화해서 넘긴다. */
export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  originalPrice: number | null;
  category: string;
  image: string;
  images: string[];
  description: string[];
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  soldOut: boolean;
  published: boolean;
  campaignStory: boolean;
  sortOrder: number;
};

export const won = (n: number) => n.toLocaleString("ko-KR");

export const discountRate = (price: number, originalPrice?: number | null) =>
  originalPrice && originalPrice > price
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

/** 재고가 없거나 품절 처리된 상품 */
export const isSoldOut = (p: Pick<Product, "soldOut" | "stock">) =>
  p.soldOut || p.stock <= 0;
