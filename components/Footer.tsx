"use client";

import Link from "next/link";
import { useState } from "react";
import { business } from "@/lib/site";
import { terms, privacy, type LegalDoc } from "@/lib/legal";
import Modal from "./Modal";
import LegalDocView from "./LegalDocView";

const SHOP_LINKS = [
  { label: "New In", href: "/shop" },
  { label: "Outerwear", href: "/shop" },
  { label: "Tops", href: "/shop" },
  { label: "Bottoms", href: "/shop" },
  { label: "Accessories", href: "/shop" },
];

export default function Footer() {
  const [doc, setDoc] = useState<LegalDoc | null>(null);

  // 값이 채워진 항목만 노출 (미확정 정보를 임의로 표기하지 않음)
  const businessLine = [
    `대표자 : ${business.ceo}`,
    business.phone && `대표전화 : ${business.phone}`,
    business.address,
    business.mailOrderNumber &&
      `통신판매업신고번호 : ${business.mailOrderNumber}`,
  ].filter(Boolean);

  return (
    <>
      <footer className="mt-28 border-t border-neutral-200">
        <div className="grid gap-12 px-6 py-14 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-8 lg:px-12">
          {/* 브랜드 */}
          <div>
            <p className="font-logo text-[22px] tracking-[0.06em]">
              Honey Punch
            </p>
            <p className="mt-3 max-w-[24rem] text-[12px] leading-relaxed text-neutral-500">
              일상의 무드를 바꾸는 한 벌.
              <br />
              허니펀치의 새로운 컬렉션을 가장 먼저 만나보세요.
            </p>
          </div>

          {/* SHOP */}
          <nav>
            <p className="text-[11px] tracking-[0.16em] text-neutral-400">
              SHOP
            </p>
            <ul className="mt-2">
              {SHOP_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="flex min-h-11 items-center text-[14px] text-neutral-600 transition-colors active:opacity-50 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:hover:text-black"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* INFORMATION */}
          <nav>
            <p className="text-[11px] tracking-[0.16em] text-neutral-400">
              INFORMATION
            </p>
            <ul className="mt-2">
              <li>
                <Link
                  href="/campaign"
                  className="flex min-h-11 items-center text-[14px] text-neutral-600 transition-colors active:opacity-50 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:hover:text-black"
                >
                  브랜드 스토리
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex min-h-11 items-center text-[14px] text-neutral-600 transition-colors active:opacity-50 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:hover:text-black"
                >
                  회사소개
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setDoc(terms)}
                  className="flex min-h-11 items-center text-[14px] text-neutral-600 transition-colors active:opacity-50 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:hover:text-black"
                >
                  이용약관
                </button>
              </li>
              <li>
                <button
                  onClick={() => setDoc(privacy)}
                  className="flex min-h-11 items-center text-[14px] font-medium text-neutral-800 transition-colors active:opacity-50 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:hover:text-black"
                >
                  개인정보처리방침
                </button>
              </li>
              <li>
                <a
                  href="#"
                  className="flex min-h-11 items-center text-[14px] text-neutral-600 transition-colors active:opacity-50 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:hover:text-black"
                >
                  고객센터
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex min-h-11 items-center text-[14px] text-neutral-600 transition-colors active:opacity-50 lg:min-h-0 lg:py-1.5 lg:text-[13px] lg:hover:text-black"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* 사업자 정보 */}
        <div className="border-t border-neutral-100 px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-8 lg:px-12">
          <p className="text-[12px] font-medium text-neutral-700">
            {business.name}
          </p>
          <div className="mt-2.5 space-y-1 text-[12px] leading-relaxed text-neutral-400 lg:text-[11px]">
            <p>{businessLine.join(" / ")}</p>
            <p>
              사업자등록번호 : {business.registrationNumber} / 개인정보보호책임자
              : {business.privacyOfficer}
            </p>
            {business.email && <p>비즈니스 관련문의 : {business.email}</p>}
          </div>
          <p className="mt-6 text-[12px] text-neutral-300 lg:text-[11px]">
            ⓒ HONEY PUNCH All rights reserved.
          </p>
        </div>
      </footer>

      <Modal
        open={doc !== null}
        onClose={() => setDoc(null)}
        title={doc?.title ?? ""}
        subtitle={doc ? `시행일자 ${doc.updatedAt}` : undefined}
      >
        {doc && <LegalDocView doc={doc} />}
      </Modal>
    </>
  );
}
