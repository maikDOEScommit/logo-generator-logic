import './new-fonts.css';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider>
      <html lang="de" className="dark">
        <body className={`${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}