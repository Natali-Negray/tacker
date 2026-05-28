import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/ui/BottomNav";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "Персональный трекер задач",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 font-sans">
        <main className="min-h-screen">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
