import type { Metadata } from "next";
import {LXGW_WenKai_TC,LXGW_WenKai_Mono_TC} from "next/font/google";
import "./globals.css";


const lxgwWenKai = LXGW_WenKai_TC({
  weight: ["400"],
  subsets: ["latin-ext"]
});

const lxgwWenKaiMono = LXGW_WenKai_Mono_TC({
  weight: ["400"],
  subsets: ["latin-ext"]
});
export const metadata: Metadata = {
  title: "Finerseek",
  description: "Finerseek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lxgwWenKai.className} ${lxgwWenKaiMono.className}antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
