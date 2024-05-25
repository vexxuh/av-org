import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Containers
import Modals from "@/containers/Modals";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AV Gear",
  description: "Inventory-like System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Modals />
        {children}
      </body>
    </html>
  );
}
