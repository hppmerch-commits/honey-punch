import CheckoutForm from "./CheckoutForm";
import { listAllPublished } from "@/lib/queries";

export const metadata = { title: "주문/결제 — HONEY PUNCH" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  // 장바구니는 클라이언트에 있으므로, 검증에 쓸 판매중 상품 정보를 내려준다.
  const products = await listAllPublished();
  return <CheckoutForm products={products} />;
}
