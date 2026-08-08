import Link from "next/link";
import { logoutAction } from "./actions";

export default function AdminShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-5 sm:gap-6 sm:px-6">
          <Link
            href="/admin"
            className="font-logo flex h-11 shrink-0 items-center text-[17px] tracking-[0.06em] active:opacity-50 sm:text-[19px]"
          >
            Honey Punch
          </Link>
          <span className="hidden text-[11px] tracking-[0.2em] text-neutral-400 sm:inline">
            ADMIN
          </span>
          <nav className="ml-auto flex items-center gap-4 text-[12px] sm:gap-5">
            <Link
              href="/admin"
              className="flex h-11 min-w-11 items-center justify-center text-neutral-600 active:opacity-50 lg:h-auto lg:min-w-0 lg:hover:text-black"
            >
              상품
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hidden h-11 items-center text-neutral-600 active:opacity-50 sm:flex lg:h-auto lg:hover:text-black"
            >
              쇼핑몰 보기 ↗
            </Link>
            <form action={logoutAction}>
              <button className="flex h-11 min-w-11 items-center justify-center text-neutral-400 active:opacity-50 lg:h-auto lg:min-w-0 lg:hover:text-black">
                로그아웃
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-[20px] sm:text-[22px]">{title}</h1>
          {action}
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </>
  );
}
