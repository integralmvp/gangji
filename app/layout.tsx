import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gangji - 흐름을 다루는 개인 OS",
  description: "백지 기반 Flow OS for 몰입형 인간",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
