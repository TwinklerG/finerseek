import type { Metadata } from "next";
import { Source_Sans_3, Comforter } from "next/font/google";
import "./globals.css";

const Hei = Source_Sans_3({
  weight: ["400"],
  subsets: ["latin"]
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
        className={`${Hei.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
