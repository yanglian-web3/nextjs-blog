import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/common.css";
import "../styles/flex.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "博客系统",
  description: "文章博客系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
       {/*<AntdRegistry> */}
           {children}
       {/*</AntdRegistry>*/}
      </body>
    </html>
  );
}
