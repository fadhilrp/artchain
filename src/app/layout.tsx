import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AppHeader } from "@/components/app-header";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ArtChain - Blockchain Art Authentication",
  description:
    "Secure, transparent, and immutable verification for artists and collectors using blockchain technology.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <div className="min-h-screen flex flex-col">
            <AppHeader />
            <main className="flex-1 bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          </div>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
