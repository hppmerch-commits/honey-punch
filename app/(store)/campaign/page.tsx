import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BrailleDots from "@/components/BrailleDots";
import TemplateHero from "@/components/template/TemplateHero";
import SectionMark from "@/components/campaign/SectionMark";
import NotchCard from "@/components/campaign/NotchCard";
import { listCampaignProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "손끝으로 고르는 오늘의 기분 — HONEY PUNCH",
  description: "허니펀치 '점자 패치 티셔츠' 스토리",
};

/** 섹션 사이 점자 도트 구분 장식 */
function DotDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-24" aria-hidden="true">
      <span className="h-px w-10 bg-slate-200" />
      <BrailleDots dots={[1, 2]} dotClassName="bg-blue-600/70" emptyClassName="bg-slate-200" />
      <BrailleDots dots={[1, 3, 5]} dotClassName="bg-blue-600/70" emptyClassName="bg-slate-200" />
      <span className="h-px w-10 bg-slate-200" />
    </div>
  );
}

const STEPS: {
  no: 1 | 2 | 3 | 4;
  title: string;
  body: string[];
  image: string;
  alt: string;
}[] = [
  {
    no: 1,
    title: "왼쪽 소매 끝, 3cm의 다리(Bridge)",
    body: [
      "디자인을 시작하면서 가장 중요하게 생각한 것은 “동정이 아닌 동참”이었습니다.",
      "'시각장애인용 옷'이라는 딱지가 붙는 순간, 그것은 또 다른 장벽이 되기 때문입니다. 우리는 비장애인이 보기에도 충분히 멋지고 힙한 디자인을 원했습니다.",
      "그렇게 탄생한 것이 바로 '왼쪽 소매 끝의 실리콘 점자 패치'입니다.",
    ],
    image: "/products/braille-tee-black.png",
    alt: "의자에 걸쳐진 HONEY PUNCH PROJECT 블랙 티셔츠",
  },
  {
    no: 2,
    title: "왜 왼쪽 소매일까?",
    body: [
      "사람이 옷을 정리하거나 입었을 때, 오른손을 뻗어 가장 자연스럽고 편하게 닿을 수 있는 위치가 바로 왼쪽 소매 끝이었습니다.",
    ],
    image: "/campaign-patch.svg",
    alt: "옷감 위 실리콘 점자 패치 클로즈업",
  },
  {
    no: 3,
    title: "왜 실리콘 패치일까?",
    body: [
      "수십 번 세탁기를 돌려도 닳거나 변형되지 않고, 손끝으로 만졌을 때 점자의 오목볼록한 촉감을 가장 정확하게 느낄 수 있는 소재를 찾기 위해 수많은 테스트를 거쳤습니다.",
    ],
    image: "/products/braille-tee-white.png",
    alt: "의자에 걸쳐진 HONEY PUNCH PROJECT 화이트 티셔츠",
  },
  {
    no: 4,
    title: "보이지 않는 가치를 디자인하다",
    body: [
      "불필요한 디테일은 생략하고 식물성 친환경 원단에 집중하고 활동성의 자유에 초점을 맞췄습니다.",
      "실리콘 패치는 비장애인의 눈에는 옷의 톤을 해치지 않는 깔끔하고 세련된 시그니처 엠보싱 패치로 보이지만, 시각장애인의 손끝에는 '검·은·색', '흰·색'이라는 오늘의 선택지가 읽힙니다.",
    ],
    image: "/campaign-fabric.svg",
    alt: "차곡차곡 개어 둔 친환경 원단과 잎사귀",
  },
];

export default async function CampaignPage() {
  // 캠페인 상품은 관리자 페이지에서 "캠페인 스토리 배너 노출"을 켠 상품이다.
  const campaignProducts = await listCampaignProducts();

  return (
    <main className="campaign-surface">
      {/* ── 참고 템플릿 Hero 레이아웃에 허니펀치 내용을 담은 섹션 ── */}
      <TemplateHero />

      {/* ① Prologue */}
      <section
        id="prologue"
        className="mx-auto max-w-[720px] scroll-mt-24 px-6 pt-28 md:pt-36"
      >
        <SectionMark label="Prologue" code="HP · 002" />

        <h2 className="font-hangul mt-10 text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.15] tracking-tight text-slate-950">
          &ldquo;오늘 무슨 색 옷을 입을까?&rdquo;
        </h2>

        <div className="mt-12 space-y-7 text-[15px] leading-[1.9] text-slate-600 md:text-[16px]">
          <p>
            우리가 아침마다 옷장 앞에서 하는 아주 사소하고 평범한 고민입니다.
            흰색 티셔츠에 청바지를 매치할지, 차분한 검은색 티셔츠를 입을지
            결정하는 데는 3초도 걸리지 않죠.
          </p>
          <p>
            하지만 눈이 보이지 않는 이들에게 이 3초짜리 고민은 생각보다 높은
            장벽이 됩니다. 빨래를 마치고 개어둔 옷장에서, 혹은 행거에 걸린 옷들
            사이에서 내가 입고 싶은 &lsquo;색깔&rsquo;을 찾기 위해서는 옷의 미세한
            질감을 외우거나, 가족에게 물어봐야 합니다.
          </p>
        </div>

        {/* 이 섹션의 전환점 — 시스템의 디스플레이 목소리를 최대로 */}
        <blockquote className="mt-14 border-l-0 pl-0">
          <span className="mb-6 block h-px w-10 bg-blue-700/70" aria-hidden="true" />
          <p className="font-hangul text-[clamp(22px,3vw,34px)] font-light leading-[1.35] tracking-tight text-slate-900">
            좋아하는 옷을 스스로 골라 입는 즐거움,
            <br className="hidden sm:block" /> 그 당연한 일상을{" "}
            <em className="not-italic text-blue-700">모두가</em> 누릴 수는 없을까?
          </p>
        </blockquote>

        <p className="mt-14 text-[15px] leading-[1.9] text-slate-600 md:text-[16px]">
          허니펀치의 고민은 바로 이 아주 작은 일상의 순간에서 시작되었습니다.
        </p>
      </section>

      <DotDivider />

      {/* ② Step 1~4 — 지그재그 */}
      <section
        id="steps"
        className="mx-auto max-w-[1140px] scroll-mt-24 space-y-24 px-6 md:space-y-32"
      >
        {STEPS.map((step, i) => (
          <div
            key={step.no}
            className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-20"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <NotchCard
                code={`HP · ${String(step.no).padStart(3, "0")}`}
                mark={
                  <span className="flex items-center gap-2.5">
                    <BrailleDots
                      number={step.no}
                      dotClassName="bg-blue-600"
                      emptyClassName="bg-slate-200"
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      0{step.no}
                    </span>
                  </span>
                }
              >
                <Image
                  src={step.image}
                  alt={step.alt}
                  width={800}
                  height={1000}
                  className="h-auto w-full"
                />
              </NotchCard>
            </div>

            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <SectionMark label={`Step ${step.no}`} />
              <h3 className="font-hangul mt-6 text-[clamp(24px,3vw,34px)] font-bold leading-[1.2] tracking-tight text-slate-950">
                {step.title}
              </h3>
              <div className="mt-6 space-y-5 text-[15px] leading-[1.9] text-slate-600">
                {step.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ③ 소매 클로즈업 — 스크롤의 시각적 정점 */}
      <div className="mx-auto mt-28 max-w-[1400px] px-6 md:mt-36">
        <NotchCard
          code="DETAIL · 3CM"
          mark={
            <span className="flex items-center gap-2.5">
              <BrailleDots
                dots={[1, 2]}
                dotClassName="bg-blue-600"
                emptyClassName="bg-slate-200"
              />
              <BrailleDots
                dots={[1, 3, 5]}
                dotClassName="bg-blue-600"
                emptyClassName="bg-slate-200"
              />
            </span>
          }
        >
          <Image
            src="/campaign-sleeve.svg"
            alt="검은색 티셔츠 왼쪽 소매 끝의 실리콘 점자 패치 클로즈업"
            width={2400}
            height={1000}
            className="h-auto w-full"
          />
        </NotchCard>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400">
          왼쪽 소매 끝 · 실리콘 점자 패치
        </p>
      </div>

      {/* ④ Epilogue — 블랙 반전 */}
      <section
        id="epilogue"
        className="mt-32 scroll-mt-24 bg-black px-6 py-32 text-white md:mt-40 md:py-40"
      >
        <div className="mx-auto max-w-[720px]">
          <SectionMark label="Epilogue" code="HP · 007" tone="dark" />

          <h2 className="font-hangul mt-10 text-[clamp(30px,4.4vw,52px)] font-bold leading-[1.15] tracking-tight text-white">
            우리가 입는 것은 &lsquo;온도&rsquo;입니다.
          </h2>

          <div className="mt-12 space-y-7 text-[15px] leading-[1.9] text-white/60 md:text-[16px]">
            <p>
              이 티셔츠를 입는다는 것은 단순히 예쁜 옷을 한 장 사는 것을 넘어,
              타인의 일상에 존재하는 보이지 않는 장벽을 함께 허무는 일에
              동참하는 것입니다.
            </p>
            <p>
              길을 걷다 누군가 당신의 소매 끝 패치를 보고 물어볼지도 모릅니다.
            </p>
          </div>

          {/* 두 사람의 대화 — 이 페이지가 도달하는 장면 */}
          <div className="mt-12 space-y-10">
            <p className="font-hangul text-[clamp(20px,2.6vw,28px)] font-light leading-[1.4] tracking-tight text-white/85">
              그 소매에 있는 거 뭐야? 디자인 예쁘다.
            </p>
            <div>
              <span
                className="mb-6 block h-px w-10 bg-blue-300/70"
                aria-hidden="true"
              />
              <p className="font-hangul text-[clamp(22px,3vw,34px)] font-light leading-[1.35] tracking-tight text-white">
                이거 점자로 <em className="not-italic text-blue-300">&lsquo;흰색&rsquo;</em>
                이라고 써져 있는 거야. 보이지 않아도 스스로 옷을 골라 입을 수 있게
                도와주는 아주 멋진 신호등이지.
              </p>
            </div>
          </div>

          <div className="mt-14 space-y-7 text-[15px] leading-[1.9] text-white/60 md:text-[16px]">
            <p>손끝으로 세상을 읽는 이들의 주체적인 아침을 응원하는 옷.</p>
            <p>
              비장애인과 시각장애인의 경계를 허무는 허니펀치의 첫 번째 따뜻한
              동참에 함께해 주세요.
            </p>
          </div>
        </div>
      </section>

      {/* ⑤ CTA */}
      <section
        id="cta"
        className="mx-auto max-w-[1140px] scroll-mt-24 px-6 pb-12 pt-28 md:pt-36"
      >
        <SectionMark label="Shop the tee" code="SS · 26" />

        <div className="mt-10 md:flex md:items-end md:justify-between md:gap-16">
          <div>
            <h2 className="font-hangul text-[clamp(32px,5vw,60px)] font-bold leading-[1.1] tracking-tight text-slate-950">
              문화를 입으시면
              <br />
              기부가 <em className="not-italic text-blue-700">됩니다</em>
            </h2>
            <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.8] text-slate-600">
              점자 패치 티셔츠 판매 수익의 일부는 시각장애인 단체에 기부됩니다.
            </p>
          </div>

          <span className="mt-10 hidden shrink-0 gap-3 md:mt-0 md:flex" aria-hidden="true">
            <BrailleDots dots={[1, 2]} dotClassName="bg-blue-600" emptyClassName="bg-slate-200" />
            <BrailleDots dots={[1, 3, 5]} dotClassName="bg-blue-600" emptyClassName="bg-slate-200" />
          </span>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {campaignProducts.length > 0 ? (
            campaignProducts.map((p, i) => (
              <Link
                key={p.id}
                href={`/product/${p.slug}`}
                className={`group flex h-16 items-center justify-between gap-4 rounded-[14px] px-7 text-[14px] tracking-wide transition-colors ${
                  i === 0
                    ? "bg-slate-950 text-white active:opacity-80 lg:hover:bg-blue-700"
                    : "border border-slate-300 text-slate-900 active:bg-slate-50 lg:hover:border-slate-950"
                }`}
              >
                <span>{p.name}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            ))
          ) : (
            <Link
              href="/shop"
              className="group flex h-16 items-center justify-between gap-4 rounded-[14px] bg-slate-950 px-7 text-[14px] tracking-wide text-white transition-colors active:opacity-80 lg:hover:bg-blue-700"
            >
              <span>전체 상품 보기</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
