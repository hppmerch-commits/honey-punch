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
            className="font-logo shrink-0 text-[17px] tracking-[0.06em] sm:text-[19px]"
          >
            Honey Punch
          </Link>
          <span className="hidden text-[11px] tracking-[0.2em] text-neutral-400 sm:inline">
            ADMIN
          </span>
          <nav className="ml-auto flex items-center gap-4 text-[12px] sm:gap-5">
            <Link href="/admin" className="text-neutral-600 hover:text-black">
              상품
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hidden text-neutral-600 hover:text-black sm:inline"
            >
              쇼핑몰 보기 ↗
            </Link>
            <form action={logoutAction}>
              <button className="text-neutral-400 hover:text-black">
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
