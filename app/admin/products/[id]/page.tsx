import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProductById } from "@/lib/queries";
import AdminShell from "../../AdminShell";
import ProductForm from "../../ProductForm";
import { updateProductAction } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <AdminShell
      title="상품 수정"
      action={
        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="text-[12px] text-neutral-500 hover:text-black"
        >
          쇼핑몰에서 보기 ↗
        </Link>
      }
    >
      <ProductForm
        product={product}
        action={updateProductAction}
        submitLabel="저장하기"
      />
    </AdminShell>
  );
}
