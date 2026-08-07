/**
 * 서버 인스턴스가 뜰 때 한 번 실행된다.
 * DB가 비어 있을 때만 기본 상품을 넣는다 (재실행해도 안전).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!process.env.DATABASE_URL) {
    console.warn("[seed] DATABASE_URL 없음 — 시드를 건너뜁니다.");
    return;
  }

  try {
    const { prisma } = await import("@/lib/db");
    const { seedProducts } = await import("@/lib/seed-data");

    const count = await prisma.product.count();
    if (count > 0) return;

    await prisma.product.createMany({
      data: seedProducts.map((p, i) => ({
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        price: p.price,
        originalPrice: p.originalPrice ?? null,
        category: p.category,
        image: p.image,
        images: [],
        description: p.description,
        sizes: p.sizes,
        colors: p.colors,
        stock: p.stock ?? 0,
        soldOut: p.soldOut ?? false,
        published: true,
        campaignStory: p.campaignStory ?? false,
        sortOrder: i,
      })),
      skipDuplicates: true,
    });

    console.log(`[seed] 기본 상품 ${seedProducts.length}종을 등록했습니다.`);
  } catch (err) {
    // 시드 실패가 서버 기동을 막지 않도록 로그만 남긴다.
    console.error("[seed] 실패:", err);
  }
}
