import Image from "next/image";
import Link from "next/link";

// 마뗑킴 스타일 게이트웨이: 풀스크린 화보 + 중앙 로고 + Campaign/Shop
// 모바일에서는 가로 한 줄이 잘리므로 로고 아래로 버튼을 내린다.
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
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="relative">
          <Image
            src="/gateway-2.jpg"
            alt="붉은 니트 위로 서로 맞잡은 두 사람의 손"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        {/* 텍스트 가독성용 오버레이 */}
        <div className="absolute inset-0 bg-black/25" />
      </div>

      <p className="absolute left-6 top-[calc(1.5rem+env(safe-area-inset-top))] text-[15px] text-white lg:left-10 lg:top-8">
        Honey Punch Project
      </p>

      <div className="absolute inset-0 flex items-center justify-center px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
        {/* 로고 아래 Campaign · History · Shop 한 줄 — 모바일/PC 동일 구조 */}
        <div className="flex w-full flex-col items-center gap-7 md:gap-9">
          <h1 className="font-logo text-center text-[clamp(38px,11vw,88px)] leading-none text-white md:whitespace-nowrap md:px-2">
            Honey Punch
          </h1>

          <nav className="flex w-full max-w-[340px] gap-3 md:max-w-none md:justify-center md:gap-5">
            {[
              { label: "Campaign", href: "/campaign" },
              { label: "History", href: "/about" },
              { label: "Shop", href: "/shop" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-12 flex-1 items-center justify-center border border-white text-[14px] text-white transition-colors active:bg-white active:text-black md:h-auto md:flex-none md:px-10 md:py-3 md:text-[15px] md:hover:bg-white md:hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
