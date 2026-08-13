import Link from "next/link";
import { business } from "@/lib/site";

export const metadata = {
  title: "회사소개 — HONEY PUNCH",
  description:
    "광주 동명동에서 시작한 유니버셜디자인 패션 브랜드, 허니펀치를 소개합니다.",
};

// 연혁 — 확정된 사실만 기록한다. 새 이력이 생기면 여기에 추가.
const HISTORY = [
  {
    year: "2026",
    items: [
      "허니펀치 설립 — 광주 동구 동명동",
      "첫 컬렉션 발표 — 점자 패치 유니버셜디자인 티셔츠",
      "공식 온라인 스토어 오픈",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="px-6 pt-10 lg:px-12">
      <div className="mx-auto max-w-[720px]">
        {/* 인트로 */}
        <p className="text-[11px] tracking-[0.16em] text-neutral-400">ABOUT</p>
        <h1 className="font-logo mt-4 text-[clamp(28px,5vw,44px)] leading-[1.3]">
          모두가 스스로 고르는 옷,
          <br />
          허니펀치
        </h1>
        <div className="mt-8 space-y-5 text-[14px] leading-[1.9] text-neutral-600 lg:text-[15px]">
          <p>
            허니펀치는 광주 동명동에서 시작한 패션 브랜드입니다. 옷을 고르는
            일이 누군가에게는 매일의 즐거움이지만, 누군가에게는 다른 사람의
            도움이 필요한 일이라는 데서 출발했습니다.
          </p>
          <p>
            소매 끝 3cm의 점자 패치. 보이지 않아도 손끝으로 색과 무드를 읽을 수
            있는 유니버셜디자인이 허니펀치의 첫 대답입니다. 특별한 옷이 아니라,
            모두가 같은 방식으로 즐길 수 있는 보통의 옷을 만듭니다.
          </p>
        </div>

        {/* 연혁 */}
        <section className="mt-20">
          <p className="text-[11px] tracking-[0.16em] text-neutral-400">
            HISTORY
          </p>
          <ul className="mt-4">
            {HISTORY.map((h) => (
              <li
                key={h.year}
                className="grid grid-cols-[72px_1fr] gap-4 border-t border-neutral-200 py-6 lg:grid-cols-[120px_1fr]"
              >
                <p className="font-logo text-[18px] leading-none lg:text-[20px]">
                  {h.year}
                </p>
                <ul className="space-y-2.5 text-[14px] leading-relaxed text-neutral-600">
                  {h.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* 회사 정보 */}
        <section className="mt-20">
          <p className="text-[11px] tracking-[0.16em] text-neutral-400">
            COMPANY
          </p>
          <dl className="mt-4 border-t border-neutral-200 text-[13px] leading-relaxed">
            {[
              ["상호", business.name],
              ["대표자", business.ceo],
              ["사업자등록번호", business.registrationNumber],
              ["주소", business.address],
            ].map(([k, v]) => (
              <div
                key={k}
                className="grid grid-cols-[110px_1fr] gap-4 border-b border-neutral-100 py-3 lg:grid-cols-[140px_1fr]"
              >
                <dt className="text-neutral-400">{k}</dt>
                <dd className="text-neutral-700">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 다음 동선 */}
        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/campaign"
            className="flex h-12 flex-1 items-center justify-center border border-black text-[14px] transition-colors hover:bg-black hover:text-white active:bg-black active:text-white"
          >
            브랜드 스토리 보기
          </Link>
          <Link
            href="/shop"
            className="flex h-12 flex-1 items-center justify-center border border-neutral-300 text-[14px] text-neutral-600 transition-colors hover:border-black hover:text-black active:border-black active:text-black"
          >
            Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
