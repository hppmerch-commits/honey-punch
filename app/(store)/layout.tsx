import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/components/StoreProvider";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Header />
      {/* 고정 헤더 높이(모바일 56px / 데스크톱 64px) + 아이폰 상단 노치만큼 밀어준다 */}
      <div className="flex-1 pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[calc(4rem+env(safe-area-inset-top))]">
        {children}
      </div>
      <Footer />
    </StoreProvider>
  );
}
