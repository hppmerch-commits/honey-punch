import Link from "next/link";
import LookupForm from "./LookupForm";

export const metadata = {
  title: "주문 조회 — HONEY PUNCH",
  description: "주문번호와 연락처로 주문 내역과 배송 상태를 확인하세요.",
};

export default function OrderLookupPage() {
  return (
    <main className="px-6 py-14 lg:px-12">
      <div className="mx-auto max-w-[440px]">
        <p className="text-[11px] tracking-[0.16em] text-neutral-400">ORDER</p>
        <h1 className="mt-3 text-[26px] leading-snug lg:text-[30px]">
          주문 조회
        </h1>
        <p className="mt-3 break-keep text-[13px] leading-relaxed text-neutral-500">
          주문하실 때 받으신 주문번호와 연락처를 입력하시면 주문 내역과 배송
          상태를 확인하실 수 있습니다.
        </p>

        <LookupForm />

        <p className="mt-10 break-keep text-[12px] leading-relaxed text-neutral-500">
          주문번호를 잊으셨나요? 주문 완료 화면의 주소를 저장해두셨다면 그
          링크로 바로 확인하실 수 있습니다. 찾기 어려우시면{" "}
          <Link
            href="/about"
            className="underline underline-offset-2 hover:text-black"
          >
            문의처
          </Link>
          로 주문자 성함과 연락처를 알려주세요.
        </p>
      </div>
    </main>
  );
}
