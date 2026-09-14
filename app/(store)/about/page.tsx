import Link from "next/link";
import { business } from "@/lib/site";

export const metadata = {
  title: "회사소개 — HONEY PUNCH",
  description:
    "일상 속 보이지 않는 장벽을 예술과 콘텐츠로 지워가는 미디어 크리에이티브팀, 허니펀치를 소개합니다.",
};

// 연혁 — 연도가 확정된 이정표만. 연도 없는 활동은 아래 WORKS에 분야별로 둔다.
const HISTORY = [
  { year: "2016", items: ["한국–베트남 문화예술교육 공적개발원조(ODA) 사업 운영"] },
  { year: "2019", items: ["영화 〈느릿느릿 달팽이 라디오〉 제작"] },
  { year: "2022", items: ["영화 〈영화감독 노동주〉 제작 지원"] },
  { year: "2023", items: ["대한민국예술교육대상 문화체육관광부장관 표창"] },
  { year: "2025", items: ["KBS 〈빌런의 나라〉 제작 참여"] },
  {
    year: "2026",
    items: [
      "패션 브랜드로 확장 — 첫 컬렉션 유니버셜디자인 티셔츠 발표",
      "공식 온라인 스토어 오픈",
    ],
  },
];

// 활동 — 분야별. title은 본문, meta는 연도·주관·상태 같은 부가 정보.
const WORKS: { label: string; items: { title: string; meta?: string }[] }[] = [
  {
    label: "FILM & DOCUMENTARY",
    items: [
      { title: "〈느릿느릿 달팽이 라디오〉", meta: "2019 · 영화 제작" },
      { title: "〈영화감독 노동주〉", meta: "2022 · 영화 제작 지원" },
      { title: "〈빌런의 나라〉", meta: "2025 · KBS · 제작 참여" },
      { title: "〈여행은 처음이라서〉", meta: "다큐멘터리 · 제작 중" },
      { title: "〈너는 나의 아이〉", meta: "다큐멘터리 · 제작 중" },
    ],
  },
  {
    label: "ARTS EDUCATION",
    items: [
      {
        title: "시각장애인 미디어예술교육 〈우리는 미디어로 봄〉",
        meta: "주관 광주문화재단",
      },
      { title: "학교 밖 청소년 문화예술교육" },
      { title: "지역 청소년 꿈다락문화학교", meta: "전남 장성군" },
      { title: "군부대 문화예술교육" },
      {
        title: "지역 오픈 아카데미 〈사람책을 빌려드립니다〉",
        meta: "국립아시아문화전당",
      },
      { title: "장성군·담양군 청소년 미디어캠프" },
      { title: "한국–베트남 문화예술교육 ODA 사업", meta: "2016 · 외 다수" },
    ],
  },
  {
    label: "MUSIC",
    items: [
      { title: "MC성균", meta: "디지털 싱글 '그랬구나' · '카푸치노'" },
      {
        title: "박다빈",
        meta: "디지털 싱글 'Baby boy' · '프렌드쉽' · '시간아 부탁해' · '매일 크리스마스'",
      },
    ],
  },
  {
    label: "AWARDS",
    items: [
      {
        title: "대한민국예술교육대상 문화체육관광부장관 표창",
        meta: "2023 · 대표 양동준",
      },
      { title: "광주독립영화제 올해의 다큐멘터리상" },
      { title: "시청자미디어대상 최우수상" },
      { title: "광주문화재단 감사장" },
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="px-6 pt-10 lg:px-12">
      <div className="mx-auto max-w-[720px]">
        {/* 인트로 */}
        <p className="text-[11px] tracking-[0.16em] text-neutral-400">ABOUT</p>
        <h1 className="font-logo mt-4 break-keep text-[clamp(28px,5vw,44px)] leading-[1.3]">
          모두가 스스로 선택하는 일상,
          <br />
          허니펀치
        </h1>
        <div className="mt-8 space-y-5 text-[14px] leading-[1.9] text-neutral-600 lg:text-[15px]">
          <p>
            허니펀치는 카메라 너머의 진솔한 삶을 바라보고, 일상 속 보이지 않는
            장벽을 예술과 콘텐츠로 지워가는 미디어 크리에이티브팀으로 2026년
            패션 브랜드로의 확장을 준비합니다.
          </p>
          <p>
            &lsquo;동정&rsquo;이 아닌 &lsquo;동참&rsquo;의 가치 아래, 장애와
            비장애의 경계를 넘어 누구나 함께할 수 있는 문화 유니버셜 디자인을
            제안합니다.
          </p>
          <p>
            허니펀치는 일상의 작은 발견이 세상을 바꾸는 힘이 된다는 믿음으로
            사람과 사람, 예술과 일상을 연결합니다.
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
                <ul className="space-y-2.5 break-keep text-[14px] leading-relaxed text-neutral-600">
                  {h.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* 활동 — 분야별 */}
        <section className="mt-20">
          <p className="text-[11px] tracking-[0.16em] text-neutral-400">
            WORKS
          </p>
          <div className="mt-4 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {WORKS.map((group) => (
              <div key={group.label}>
                <h2 className="border-b border-neutral-800 pb-2 text-[12px] tracking-[0.14em] text-neutral-800">
                  {group.label}
                </h2>
                <ul className="break-keep">
                  {group.items.map((item) => (
                    <li
                      key={item.title}
                      className="border-b border-neutral-100 py-3 text-[14px] leading-snug"
                    >
                      <p className="text-neutral-700">{item.title}</p>
                      {item.meta && (
                        <p className="mt-1 text-[12px] leading-relaxed text-neutral-500">
                          {item.meta}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
