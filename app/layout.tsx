import type { Metadata } from "next";
import { Prata, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const prata = Prata({
  variable: "--font-prata",
  weight: "400",
  subsets: ["latin"],
});

// 아래 두 폰트는 '허니펀치 참고' 템플릿 섹션에서 쓰인다.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HONEY PUNCH",
  description: "HONEY PUNCH official online store",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${prata.variable} ${cormorant.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
