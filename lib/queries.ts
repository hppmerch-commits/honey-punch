import "server-only";
import { prisma } from "@/lib/db";
import type { Product, ProductColor, SizeChartRow } from "@/lib/product-types";

type Row = Awaited<ReturnType<typeof prisma.product.findFirst>>;

/** Prisma 레코드를 화면에서 쓰는 Product 형태로 정규화한다. */
function toProduct(row: NonNullable<Row>): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    sku: row.sku,
    price: row.price,
    originalPrice: row.originalPrice,
    category: row.category,
    image: row.image,
    images: row.images,
    description: row.description,
    sizes: row.sizes,
    colors: Array.isArray(row.colors) ? (row.colors as ProductColor[]) : [],
    sizeChart: Array.isArray(row.sizeChart)
      ? (row.sizeChart as SizeChartRow[])
      : [],
    stock: row.stock,
    soldOut: row.soldOut,
    published: row.published,
    campaignStory: row.campaignStory,
    sortOrder: row.sortOrder,
  };
}

const listOrder = [{ sortOrder: "asc" as const }, { createdAt: "desc" as const }];

export const PAGE_SIZE = 12;

/** 스토어프론트 상품 목록 — 노출(published) 상품만, 카테고리/검색/페이지 적용 */
export async function listProducts({
  category,
  query,
  page = 1,
}: {
  category?: string;
  query?: string;
  page?: number;
} = {}) {
  const where = {
    published: true,
    ...(category ? { category } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { sku: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: listOrder,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: rows.map(toProduct),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

/** 상세 페이지 — 미노출 상품은 찾지 못한 것으로 처리 */
export async function getProductBySlug(slug: string) {
  const row = await prisma.product.findUnique({ where: { slug } });
  if (!row || !row.published) return null;
  return toProduct(row);
}

/** 장바구니/위시리스트처럼 slug 목록으로 한 번에 조회할 때 */
export async function getProductsBySlugs(slugs: string[]) {
  if (slugs.length === 0) return [];
  const rows = await prisma.product.findMany({
    where: { slug: { in: slugs }, published: true },
  });
  return rows.map(toProduct);
}

/** 노출중인 전체 상품 (위시리스트처럼 클라이언트에서 걸러 쓰는 경우) */
export async function listAllPublished() {
  const rows = await prisma.product.findMany({
    where: { published: true },
    orderBy: listOrder,
  });
  return rows.map(toProduct);
}

/** 캠페인 스토리가 연결된 상품 */
export async function listCampaignProducts() {
  const rows = await prisma.product.findMany({
    where: { published: true, campaignStory: true },
    orderBy: listOrder,
  });
  return rows.map(toProduct);
}

/** 관리자 목록 — 미노출 상품도 모두 보여준다 */
export async function listAllProductsForAdmin() {
  const rows = await prisma.product.findMany({ orderBy: listOrder });
  return rows.map(toProduct);
}

export async function getProductById(id: string) {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : null;
}
