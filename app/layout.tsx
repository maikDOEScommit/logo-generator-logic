import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { deDE } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intelligenter Logo Generator",
  description: "Erstellen Sie professionelle Logos mit einem KI-gestützten Expertensystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={deDE}>
      <html lang="de">
        <body className={`${inter.className} bg-gray-900 text-white`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}