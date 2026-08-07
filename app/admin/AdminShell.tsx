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
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-6">
          <Link href="/admin" className="font-logo text-[19px] tracking-[0.06em]">
            Honey Punch
          </Link>
          <span className="text-[11px] tracking-[0.2em] text-neutral-400">
            ADMIN
          </span>
          <nav className="ml-auto flex items-center gap-5 text-[12px]">
            <Link href="/admin" className="text-neutral-600 hover:text-black">
              상품
            </Link>
            <Link
              href="/"
              target="_blank"
              className="text-neutral-600 hover:text-black"
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

      <main className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px]">{title}</h1>
          {action}
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </>
  );
}
