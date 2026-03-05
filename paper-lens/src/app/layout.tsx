import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/lib/language-context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PaperLens - Vibe Coding",
  description: "Transform academic papers into beautiful, interactive web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <div className="fixed top-4 right-4 z-50">
            <LanguageSwitcher />
          </div>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
