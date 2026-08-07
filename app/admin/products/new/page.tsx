import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminShell from "../../AdminShell";
import ProductForm from "../../ProductForm";
import { createProductAction } from "../../actions";

export default async function NewProductPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <AdminShell title="상품 등록">
      <ProductForm action={createProductAction} submitLabel="등록하기" />
    </AdminShell>
  );
}
