"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES, type Product } from "@/lib/product-types";
import type { FormState } from "./actions";

// 모바일에서는 globals.css가 입력 글자를 16px로 올려 iOS 자동 확대를 막는다.
const field =
  "mt-1.5 h-12 w-full border border-neutral-300 px-3 text-[13px] outline-none focus:border-black lg:h-11";
const area =
  "mt-1.5 w-full border border-neutral-300 p-3 text-[13px] leading-relaxed outline-none focus:border-black";
const label = "text-[13px] text-neutral-600 lg:text-[12px]";

export default function ProductForm({
  product,
  action,
  submitLabel,
}: {
  product?: Product;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined
  );
  const [preview, setPreview] = useState<string | null>(product?.image ?? null);

  return (
    <form action={formAction} className="max-w-[760px] space-y-7">
      {product && <input type="hidden" name="id" value={product.id} />}

      {state?.error && (
        <p className="border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={label} htmlFor="name">
            상품명 *
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            placeholder="BRAILLE PATCH TEE IN BLACK"
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="slug">
            URL 주소 *
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={product?.slug}
            placeholder="braille-patch-tee-black"
            className={field}
          />
          <p className="mt-1 text-[11px] text-neutral-400">
            영문 소문자·숫자·하이픈만. /product/여기에들어감
          </p>
        </div>

        <div>
          <label className={label} htmlFor="sku">
            품번
          </label>
          <input
            id="sku"
            name="sku"
            defaultValue={product?.sku}
            placeholder="HP2609TS501UBB"
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="price">
            판매가 (원) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            required
            defaultValue={product?.price}
            className={field}
          />
        </div>

        <div>
          <label className={label} htmlFor="originalPrice">
            정가 (원)
          </label>
          <input
            id="originalPrice"
            name="originalPrice"
            type="number"
            min="0"
            defaultValue={product?.originalPrice ?? ""}
            className={field}
          />
          <p className="mt-1 text-[11px] text-neutral-400">
            비워두면 할인 표시 없음. 입력하면 할인율이 자동 계산됩니다.
          </p>
        </div>

        <div>
          <label className={label} htmlFor="category">
            카테고리 *
          </label>
          <select
            id="category"
            name="category"
            defaultValue={product?.category ?? "top"}
            className={field}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={label} htmlFor="stock">
            재고 수량
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? 0}
            className={field}
          />
        </div>
      </div>

      {/* 이미지 */}
      <div>
        <p className={label}>대표 이미지 *</p>
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative h-40 w-32 shrink-0 overflow-hidden border border-neutral-200 bg-[#f2f1ef]">
            {preview ? (
              <Image src={preview} alt="" fill sizes="128px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-[11px] text-neutral-400">
                미리보기
              </span>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              name="imageFile"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
              className="w-full text-[13px] file:mr-3 file:h-11 file:border file:border-neutral-300 file:bg-white file:px-4 file:text-[13px] file:active:bg-neutral-50"
            />
            <p className="mt-2 text-[11px] text-neutral-400">
              JPG·PNG·WEBP·AVIF·SVG, 최대 8MB. 업로드하지 않으면 아래 경로가 사용됩니다.
            </p>
            <input
              name="image"
              defaultValue={product?.image}
              placeholder="/products/example.png"
              className={field}
            />
          </div>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="description">
          상세 설명 (한 줄에 하나씩)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description.join("\n")}
          placeholder={"왼쪽 소매 끝, 손끝으로 색을 읽는 실리콘 점자 패치 티셔츠\n식물성 친환경 원단"}
          className={area}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="sizes">
            사이즈 (쉼표로 구분)
          </label>
          <input
            id="sizes"
            name="sizes"
            defaultValue={product?.sizes.join(", ")}
            placeholder="S, M, L, XL"
            className={field}
          />
        </div>
        <div>
          <label className={label} htmlFor="sortOrder">
            정렬 순서
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            className={field}
          />
          <p className="mt-1 text-[11px] text-neutral-400">
            숫자가 작을수록 목록 앞쪽에 나옵니다.
          </p>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="colors">
          컬러 (한 줄에 하나: 이름 + 색상코드)
        </label>
        <textarea
          id="colors"
          name="colors"
          rows={3}
          defaultValue={product?.colors.map((c) => `${c.name} ${c.hex}`).join("\n")}
          placeholder={"BLACK #242427\nWHITE #f2f0ea"}
          className={area}
        />
      </div>

      <div className="flex flex-wrap gap-6 border-t border-neutral-200 pt-6">
        <label className="flex min-h-11 items-center gap-2.5 text-[14px] active:opacity-60">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? true}
            className="h-5 w-5"
          />
          쇼핑몰에 노출
        </label>
        <label className="flex min-h-11 items-center gap-2.5 text-[14px] active:opacity-60">
          <input
            type="checkbox"
            name="soldOut"
            defaultChecked={product?.soldOut ?? false}
            className="h-5 w-5"
          />
          품절 처리
        </label>
        <label className="flex min-h-11 items-center gap-2.5 text-[14px] active:opacity-60">
          <input
            type="checkbox"
            name="campaignStory"
            defaultChecked={product?.campaignStory ?? false}
            className="h-5 w-5"
          />
          캠페인 스토리 배너 노출
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row">
        <button
          type="submit"
          disabled={pending}
          className="h-12 bg-black px-10 text-[13px] tracking-[0.1em] text-white transition-opacity active:opacity-70 disabled:opacity-50 lg:hover:opacity-85"
        >
          {pending ? "저장 중…" : submitLabel}
        </button>
        <Link
          href="/admin"
          className="flex h-12 items-center justify-center border border-neutral-300 px-8 text-[13px] tracking-[0.1em] transition-colors active:bg-neutral-50 lg:hover:border-black"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
