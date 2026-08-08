import { listAllPublished } from "@/lib/queries";
import CartView from "./CartView";

export const dynamic = "force-dynamic";
export const metadata = { title: "장바구니 — HONEY PUNCH" };

export default async function CartPage() {
  // 장바구니는 브라우저에 저장되므로, 현재 판매중인 상품 정보를 넘겨
  // 삭제·품절된 상품을 걸러내고 가격을 최신값으로 맞춘다.
  const products = await listAllPublished();
  return <CartView products={products} />;
}
