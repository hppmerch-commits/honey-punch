"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { login, logout, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/uploads";

export type FormState = { error?: string } | undefined;

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const ok = await login(password);
  if (!ok) return { error: "비밀번호가 올바르지 않습니다." };
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

/** 폼 입력을 Product 필드로 변환. 검증 실패 시 메시지를 던진다. */
async function parseProductForm(formData: FormData) {
  const lines = (v: FormDataEntryValue | null) =>
    String(v ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const csv = (v: FormDataEntryValue | null) =>
    String(v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!name) throw new Error("상품명을 입력해 주세요.");
  if (!slug) throw new Error("URL 주소(slug)를 입력해 주세요.");

  const price = Number(formData.get("price"));
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("판매가는 0 이상의 숫자여야 합니다.");
  }

  const originalRaw = String(formData.get("originalPrice") ?? "").trim();
  const originalPrice = originalRaw === "" ? null : Number(originalRaw);
  if (originalPrice !== null && (!Number.isFinite(originalPrice) || originalPrice < 0)) {
    throw new Error("정가는 0 이상의 숫자여야 합니다.");
  }

  const stock = Number(formData.get("stock") ?? 0);
  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error("재고는 0 이상의 숫자여야 합니다.");
  }

  // 컬러: "BLACK #26262a" 한 줄에 하나
  const colors = lines(formData.get("colors")).map((line) => {
    const m = line.match(/^(.*?)\s+(#[0-9a-fA-F]{3,8})$/);
    if (!m) throw new Error(`컬러 형식이 잘못됐습니다: "${line}" (예: BLACK #26262a)`);
    return { name: m[1].trim(), hex: m[2] };
  });

  // 이미지: 업로드가 있으면 그것을 쓰고, 없으면 입력된 경로를 유지
  const uploaded = formData.get("imageFile");
  let image = String(formData.get("image") ?? "").trim();
  if (uploaded instanceof File && uploaded.size > 0) {
    image = await saveUpload(uploaded);
  }
  if (!image) throw new Error("대표 이미지를 업로드하거나 경로를 입력해 주세요.");

  return {
    slug,
    name,
    sku: String(formData.get("sku") ?? "").trim(),
    price: Math.round(price),
    originalPrice: originalPrice === null ? null : Math.round(originalPrice),
    category: String(formData.get("category") ?? "top"),
    image,
    description: lines(formData.get("description")),
    sizes: csv(formData.get("sizes")),
    colors,
    stock: Math.round(stock),
    soldOut: formData.get("soldOut") === "on",
    published: formData.get("published") === "on",
    campaignStory: formData.get("campaignStory") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };
}

function friendlyError(err: unknown) {
  const msg = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
  // Prisma 고유 제약 위반
  if (msg.includes("Unique constraint") || msg.includes("P2002")) {
    return "이미 사용 중인 URL 주소(slug)입니다. 다른 값을 입력해 주세요.";
  }
  return msg;
}

export async function createProductAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  try {
    const data = await parseProductForm(formData);
    await prisma.product.create({ data });
  } catch (err) {
    return { error: friendlyError(err) };
  }
  revalidatePath("/admin");
  revalidatePath("/shop");
  redirect("/admin");
}

export async function updateProductAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "상품 ID가 없습니다." };
  try {
    const data = await parseProductForm(formData);
    await prisma.product.update({ where: { id }, data });
  } catch (err) {
    return { error: friendlyError(err) };
  }
  revalidatePath("/admin");
  revalidatePath("/shop");
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/shop");
}

/** 목록에서 바로 노출 상태를 뒤집는다. */
export async function togglePublishedAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const next = formData.get("next") === "true";
  if (!id) return;
  await prisma.product.update({ where: { id }, data: { published: next } });
  revalidatePath("/admin");
  revalidatePath("/shop");
}
