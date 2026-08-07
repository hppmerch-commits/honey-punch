import Image from "next/image";
import Link from "next/link";

// 마뗑킴 스타일 게이트웨이: 풀스크린 화보 2분할 + 중앙 로고 + Campaign/Shop
export default function Gateway() {
  return (
    <main className="relative h-dvh w-full overflow-hidden">
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <div className="relative hidden md:block">
          <Image
            src="/gateway-1.jpg"
            alt="뉴트럴 톤의 티셔츠를 입고 걸어가는 모델들"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="relative">
          <Image
            src="/gateway-2.jpg"
            alt="붉은 니트 위로 서로 맞잡은 두 사람의 손"
            fill
            priority
            className="object-cover"
          />
        </div>
        {/* 텍스트 가독성용 오버레이 */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <p className="absolute left-6 top-6 text-[15px] text-white lg:left-10 lg:top-8">
        Honey Punch
      </p>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-4 lg:gap-6">
          <Link
            href="/campaign"
            className="border border-white px-7 py-3 text-[15px] text-white transition-colors hover:bg-white hover:text-black lg:px-9"
          >
            Campaign
          </Link>
          <h1 className="font-logo whitespace-nowrap px-2 text-[clamp(36px,5.5vw,88px)] text-white">
            Honey Punch
          </h1>
          <Link
            href="/shop"
            className="border border-white px-7 py-3 text-[15px] text-white transition-colors hover:bg-white hover:text-black lg:px-9"
          >
            Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
