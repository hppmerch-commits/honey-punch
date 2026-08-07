import { listAllPublished } from "@/lib/queries";
import WishlistView from "./WishlistView";

export const dynamic = "force-dynamic";
export const metadata = { title: "위시리스트 — HONEY PUNCH" };

export default async function WishlistPage() {
  // 위시리스트는 브라우저에 저장되므로, 전체 상품을 넘겨 클라이언트에서 골라낸다.
  const products = await listAllPublished();
  return <WishlistView products={products} />;
}
