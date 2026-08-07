import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BrailleDots from "@/components/BrailleDots";

export const metadata: Metadata = {
  title: "손끝으로 고르는 오늘의 기분 — HONEY PUNCH",
  description: "허니펀치 '점자 패치 티셔츠' 스토리",
};

/** 섹션 사이 점자 도트 구분 장식 */
function DotDivider() {
  return (
    <div className="flex justify-center gap-4 py-20" aria-hidden="true">
      <BrailleDots dots={[1, 2]} dotClassName="bg-neutral-300" emptyClassName="bg-neutral-100" />
      <BrailleDots dots={[1, 3, 5]} dotClassName="bg-neutral-300" emptyClassName="bg-neutral-100" />
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

export default function CampaignPage() {
  return (
    <main>
      {/* ① 히어로 */}
      <section className="relative flex h-[calc(100dvh-4rem)] min-h-[480px] items-center justify-center overflow-hidden">
        <Image
          src="/campaign-hero.svg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="relative px-6 text-center">
          <p className="text-[11px] tracking-[0.3em] text-[#8a6d24]">
            HONEY PUNCH CAMPAIGN
          </p>
          <h1 className="font-logo mt-6 text-[clamp(30px,4.6vw,58px)] leading-[1.25] text-neutral-900">
            손끝으로 고르는
            <br />
            오늘의 기분
          </h1>
          <p className="mt-6 text-[13px] tracking-wide text-neutral-600">
            허니펀치 '점자 패치 티셔츠' 스토리
          </p>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-neutral-500" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="h-5 w-5 stroke-current">
            <path d="M12 4v16m0 0-6-6m6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* ② Prologue */}
      <section className="mx-auto max-w-[640px] px-6 pt-28">
        <p className="text-[11px] tracking-[0.3em] text-neutral-400">PROLOGUE</p>
        <h2 className="font-logo mt-8 text-[clamp(24px,3.2vw,36px)] leading-snug">
          "오늘 무슨 색 옷을 입을까?"
        </h2>
        <div className="mt-10 space-y-6 text-[15px] leading-[1.9] text-neutral-600">
          <p>
            우리가 아침마다 옷장 앞에서 하는 아주 사소하고 평범한 고민입니다.
            흰색 티셔츠에 청바지를 매치할지, 차분한 검은색 티셔츠를 입을지
            결정하는 데는 3초도 걸리지 않죠.
          </p>
          <p>
            하지만 눈이 보이지 않는 이들에게 이 3초짜리 고민은 생각보다 높은
            장벽이 됩니다. 빨래를 마치고 개어둔 옷장에서, 혹은 행거에 걸린 옷들
            사이에서 내가 입고 싶은 '색깔'을 찾기 위해서는 옷의 미세한 질감을
            외우거나, 가족에게 물어봐야 합니다.
          </p>
          <p className="font-logo text-[17px] italic leading-relaxed text-neutral-800">
            "좋아하는 옷을 스스로 골라 입는 즐거움,
            <br />그 당연한 일상을 모두가 누릴 수는 없을까?"
          </p>
          <p>
            허니펀치의 고민은 바로 이 아주 작은 일상의 순간에서 시작되었습니다.
          </p>
        </div>
      </section>

      <DotDivider />

      {/* ③ Step 1~4 — 지그재그 */}
      <section id="steps" className="mx-auto max-w-[1080px] space-y-28 px-6">
        {STEPS.map((step, i) => (
          <div
            key={step.no}
            className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <Image
                src={step.image}
                alt={step.alt}
                width={800}
                height={1000}
                className="h-auto w-full bg-[#f2f1ef]"
              />
            </div>
            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <div className="flex items-center gap-3">
                <BrailleDots number={step.no} />
                <p className="text-[11px] tracking-[0.3em] text-neutral-400">
                  STEP {step.no}
                </p>
              </div>
              <h3 className="mt-5 text-[21px] leading-snug">{step.title}</h3>
              <div className="mt-5 space-y-4 text-[14px] leading-[1.9] text-neutral-600">
                {step.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ④ 소매 클로즈업 풀폭 */}
      <div className="mt-28">
        <Image
          src="/campaign-sleeve.svg"
          alt="검은색 티셔츠 왼쪽 소매 끝의 실리콘 점자 패치 클로즈업"
          width={2400}
          height={1000}
          className="h-auto w-full"
        />
      </div>

      {/* ⑤ Epilogue — 블랙 반전 */}
      <section id="epilogue" className="bg-black px-6 py-32 text-white">
        <div className="mx-auto max-w-[640px]">
          <p className="text-[11px] tracking-[0.3em] text-neutral-500">
            EPILOGUE
          </p>
          <h2 className="font-logo mt-8 text-[clamp(24px,3.2vw,36px)] leading-snug">
            우리가 입는 것은 '온도'입니다.
          </h2>
          <div className="mt-10 space-y-6 text-[15px] leading-[1.9] text-neutral-400">
            <p>
              이 티셔츠를 입는다는 것은 단순히 예쁜 옷을 한 장 사는 것을 넘어,
              타인의 일상에 존재하는 보이지 않는 장벽을 함께 허무는 일에
              동참하는 것입니다.
            </p>
            <p>
              길을 걷다 누군가 당신의 소매 끝 패치를 보고 물어볼지도 모릅니다.
            </p>
            <p className="pl-5 text-white" style={{ borderLeft: "1px solid #3f3f3f" }}>
              "그 소매에 있는 거 뭐야? 디자인 예쁘다."
            </p>
            <p>
              그때 당신은 미소를 지으며 이렇게 답해줄 수 있을 것입니다.
            </p>
            <p className="pl-5 text-white" style={{ borderLeft: "1px solid #3f3f3f" }}>
              "이거 점자로 '흰색'이라고 써져 있는 거야. 보이지 않아도 스스로
              옷을 골라 입을 수 있게 도와주는 아주 멋진 신호등이지."
            </p>
            <p>손끝으로 세상을 읽는 이들의 주체적인 아침을 응원하는 옷.</p>
            <p>
              비장애인과 시각장애인의 경계를 허무는 허니펀치의 첫 번째 따뜻한
              동참에 함께해 주세요.
            </p>
          </div>
        </div>
      </section>

      {/* ⑥ CTA */}
      <section id="cta" className="px-6 pb-8 pt-28 text-center">
        <div className="flex justify-center gap-4" aria-hidden="true">
          <BrailleDots dots={[1, 2]} dotClassName="bg-[#d9a715]" emptyClassName="bg-neutral-100" />
          <BrailleDots dots={[1, 3, 5]} dotClassName="bg-[#d9a715]" emptyClassName="bg-neutral-100" />
        </div>
        <h2 className="font-logo mt-8 text-[clamp(26px,3.6vw,42px)] leading-snug">
          문화를 입으시면
          <br />
          기부가 됩니다
        </h2>
        <p className="mt-5 text-[13px] text-neutral-500">
          점자 패치 티셔츠 판매 수익의 일부는 시각장애인 단체에 기부됩니다.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/product/braille-patch-tee-black"
            className="flex h-13 w-64 items-center justify-center bg-black px-8 text-[12px] tracking-[0.12em] text-white transition-opacity hover:opacity-85"
          >
            BRAILLE PATCH TEE — BLACK
          </Link>
          <Link
            href="/product/braille-patch-tee-white"
            className="flex h-13 w-64 items-center justify-center border border-neutral-300 px-8 text-[12px] tracking-[0.12em] transition-colors hover:border-black"
          >
            BRAILLE PATCH TEE — WHITE
          </Link>
        </div>
      </section>
    </main>
  );
}
