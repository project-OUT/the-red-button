import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THE RED BUTTON",
  description: "매주 진행되는 사회 실험형 웹 게임",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pressStart.variable} ${vt323.variable}`}>
      <body className="min-h-dvh bg-black flex justify-center">
        <div className="w-full max-w-[430px] min-h-dvh relative bg-[#08080f] text-[#e5e5e5] font-body overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
