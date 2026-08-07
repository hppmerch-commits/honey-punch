import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { StoreProvider } from "@/components/StoreProvider";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Header />
      <div className="flex-1 pt-16">{children}</div>
      <Footer />
    </StoreProvider>
  );
}
