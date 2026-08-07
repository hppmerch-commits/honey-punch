import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "관리자 — HONEY PUNCH",
  // 관리자 페이지는 검색엔진에 노출되지 않도록 한다.
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-dvh bg-white">{children}</div>;
}
